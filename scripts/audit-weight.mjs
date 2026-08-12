/**
 * What every page actually costs a reader, measured against production.
 *
 * WHY THIS EXISTS. The other three audits check that pages are correct —
 * links resolve, keywords are placed, matchers answer. None of them checks
 * what a page WEIGHS, and on 11 August 2026 that gap hid a real fault for as
 * long as it existed: MatrixTable rendered its thumbnails with no `srcset`,
 * so six files went out at full size to be painted a few hundred pixels wide.
 * Three window "soil" panels alone were 998KB. The derivatives existed on
 * disk and in the manifest the whole time — the component never asked for
 * them, and nothing on this site was looking.
 *
 * WHAT IT MEASURES, and why each one is separate.
 *
 * EAGER weight is what a phone downloads before it scrolls. This is the
 * number that decides whether a page feels fast, and it is the only one worth
 * panicking about.
 *
 * LAZY weight is what a reader who scrolls pays. It does not affect first
 * paint, which is exactly why it rots unnoticed — the fault above cost a
 * megabyte and moved no headline metric.
 *
 * NO SRCSET, over 20KB, is the fault itself: a file with no responsive
 * variants in the markup, so every viewport gets the authored size.
 *
 * NO width/height is a layout-shift risk RATHER THAN a certainty, and the
 * report says so. Several components reserve their space with an explicit
 * `aspect-ratio` in CSS, which does the same job — those are listed but not
 * counted as failures, because "fixing" them would change nothing.
 *
 * TTFB is here so that "the site feels slow" can be answered with a number
 * rather than an argument about images.
 *
 * Thresholds are deliberately loose. This reports; it does not fail a build.
 * The judgement about whether 1MB of lazy artwork on a hub is wrong belongs
 * to a person looking at the page.
 */
const HOST = process.env.AUDIT_HOST ?? "https://botplanet.io";

/* Every audit on this site reads production with the cache bypassed, after a
   run in August reported nineteen already-fixed pages as broken because it
   was reading the edge. Headers rather than a query string, so the canonical
   and the URL under test stay the same string. */
const NO_CACHE = { cache: "no-store", headers: { "cache-control": "no-cache", pragma: "no-cache" } };

const EAGER_WARN = 300 * 1024;   // above this, a phone waits on pictures
const NO_SRCSET_MIN = 20 * 1024; // below this, variants are not worth the bytes

const sizes = new Map();
/** HEAD comes back without content-length through the edge, so GET and cancel. */
async function bytesOf(url) {
  if (sizes.has(url)) return sizes.get(url);
  const p = (async () => {
    try {
      const r = await fetch(url, NO_CACHE);
      const n = Number(r.headers.get("content-length") ?? 0);
      try { await r.body?.cancel(); } catch { /* already drained */ }
      return r.ok ? n : 0;
    } catch { return 0; }
  })();
  sizes.set(url, p);
  return p;
}

const attr = (tag, name) => (new RegExp(`\\b${name}="([^"]*)"`, "i").exec(tag) ?? [])[1] ?? null;
const kb = (b) => Math.round(b / 1024);
const say = (s = "") => process.stdout.write(s + "\n");

async function auditPage(path) {
  const t0 = performance.now();
  const res = await fetch(HOST + path, NO_CACHE);
  const ttfb = Math.round(performance.now() - t0);
  const html = await res.text();

  const rows = [];
  for (const tag of html.match(/<img\b[^>]*>/gi) ?? []) {
    const src = attr(tag, "src");
    if (!src || src.startsWith("data:")) continue;
    const srcset = attr(tag, "srcset");
    const abs = (s) => (s.startsWith("http") ? s : HOST + s);

    // What a 360px viewport actually fetches: the smallest candidate that
    // still covers it, or the only file there is.
    let bytes = await bytesOf(abs(src));
    if (srcset) {
      const cands = srcset.split(",").map((c) => c.trim().split(/\s+/))
        .filter((c) => c.length === 2).map(([u, w]) => ({ u, w: parseInt(w) }))
        .sort((a, b) => a.w - b.w);
      const pick = cands.find((c) => c.w >= 360) ?? cands.at(-1);
      if (pick) bytes = await bytesOf(abs(pick.u));
    }
    rows.push({
      src, bytes,
      srcset: Boolean(srcset),
      lazy: /loading="lazy"/i.test(tag),
      dims: Boolean(attr(tag, "width") && attr(tag, "height")),
      prio: /fetchpriority="high"/i.test(tag),
    });
  }
  return { path, ttfb, htmlKB: kb(html.length), rows };
}

const sitemap = await (await fetch(`${HOST}/sitemap.xml`, NO_CACHE)).text();
const paths = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].replace(HOST, ""));

say(`Weighing ${HOST}\n`);
const pages = [];
for (let i = 0; i < paths.length; i += 8) {
  pages.push(...await Promise.all(paths.slice(i, i + 8).map(auditPage)));
  process.stderr.write(`\r${pages.length}/${paths.length}`);
}
process.stderr.write("\r".padEnd(24) + "\r");

const eagerOf = (p) => p.rows.filter((r) => !r.lazy).reduce((s, r) => s + r.bytes, 0);
const lazyOf = (p) => p.rows.filter((r) => r.lazy).reduce((s, r) => s + r.bytes, 0);

/* ---- the fault this file was written for ---- */
const all = pages.flatMap((p) => p.rows.map((r) => ({ ...r, path: p.path })));
const noSrcset = [...new Map(
  all.filter((r) => !r.srcset && r.bytes > NO_SRCSET_MIN).map((r) => [r.src, r]),
).values()].sort((a, b) => b.bytes - a.bytes);

/* ---- reporting ---- */
const byEager = [...pages].sort((a, b) => eagerOf(b) - eagerOf(a));
say("HEAVIEST ON ARRIVAL — what a 360px viewport downloads before it scrolls\n");
say("  eager   lazy    html   ttfb    imgs  page");
for (const p of byEager.slice(0, 10)) {
  say(`  ${(kb(eagerOf(p))+"KB").padEnd(7)} ${(kb(lazyOf(p))+"KB").padEnd(7)} ${(p.htmlKB+"KB").padEnd(6)} ${(p.ttfb+"ms").padEnd(7)} ${String(p.rows.length).padEnd(5)} ${p.path}`);
}

const slow = byEager.filter((p) => eagerOf(p) > EAGER_WARN);
const noPrio = pages.filter((p) => p.rows.some((r) => !r.lazy) && !p.rows.some((r) => r.prio));
const ttfbs = pages.map((p) => p.ttfb).sort((a, b) => a - b);
const noDims = all.filter((r) => !r.dims);

say(`\nSERVER — median ${ttfbs[Math.floor(ttfbs.length / 2)]}ms, p90 ${ttfbs[Math.floor(ttfbs.length * 0.9)]}ms, max ${ttfbs.at(-1)}ms`);
say(`IMAGES — ${pages.length} pages, ${all.length} tags, ${sizes.size} files. Median eager ${kb(byEager.map(eagerOf).sort((a, b) => a - b)[Math.floor(pages.length / 2)])}KB.`);

if (noSrcset.length) {
  say(`\nNO SRCSET, OVER ${kb(NO_SRCSET_MIN)}KB — every viewport gets the authored file (${noSrcset.length}):\n`);
  for (const r of noSrcset) say(`  ${(kb(r.bytes)+"KB").padStart(8)}  ${r.src}\n            first seen on ${r.path}`);
}

if (noDims.length) {
  say(`\nNOTED — ${noDims.length} img tags carry no width/height, across ${new Set(noDims.map((r) => r.path)).size} pages.`);
  say("  Not automatically a fault: several components reserve the space with an");
  say("  explicit aspect-ratio in CSS, which does the same job. Worth checking only");
  say("  when a component has neither.");
}

const problems = [
  ...noSrcset.map((r) => `no srcset on ${r.src} (${kb(r.bytes)}KB)`),
  ...slow.map((p) => `${p.path} downloads ${kb(eagerOf(p))}KB before scrolling`),
  ...noPrio.map((p) => `${p.path} marks no image fetchpriority="high"`),
];
say(problems.length ? `\nFAIL — ${problems.length}:\n` + problems.map((p) => "  " + p).join("\n")
                    : "\nPASS — nothing above the thresholds this file sets.");
