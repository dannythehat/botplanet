/**
 * What every page actually makes a browser download, measured rather than assumed.
 *
 * Per page: every <img> it renders, whether that img has a srcset, what a
 * 360px-wide phone would fetch for it, and what a browser with no srcset to
 * choose from is forced to fetch. The gap between those two is the finding.
 */
const HOST = "https://botplanet.io";
const NO_CACHE = { cache: "no-store", headers: { "cache-control": "no-cache", pragma: "no-cache" } };

const sizes = new Map();
async function bytesOf(url) {
  if (sizes.has(url)) return sizes.get(url);
  const p = (async () => {
    try {
      // HEAD comes back without content-length through the edge, so GET the
      // file and cancel the body the moment the headers land.
      const r = await fetch(url, NO_CACHE);
      const n = Number(r.headers.get("content-length") ?? 0);
      try { await r.body?.cancel(); } catch {}
      return r.ok ? n : 0;
    } catch { return 0; }
  })();
  sizes.set(url, p);
  return p;
}

const sm = await (await fetch(`${HOST}/sitemap.xml`, NO_CACHE)).text();
const paths = [...sm.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].replace(HOST, ""));

const IMG = /<img\b[^>]*>/gi;
const attr = (tag, name) => (new RegExp(`\\b${name}="([^"]*)"`, "i").exec(tag) ?? [])[1] ?? null;

async function auditPage(path) {
  const html = await (await fetch(HOST + path, NO_CACHE)).text();
  const imgs = html.match(IMG) ?? [];
  const rows = [];
  for (const tag of imgs) {
    const src = attr(tag, "src");
    if (!src || src.startsWith("data:")) continue;
    const srcset = attr(tag, "srcset");
    const abs = (s) => (s.startsWith("http") ? s : HOST + s);
    const full = await bytesOf(abs(src));
    let phone = full;
    if (srcset) {
      const cands = srcset.split(",").map((c) => c.trim().split(/\s+/)).filter((c) => c.length === 2)
        .map(([u, w]) => ({ u, w: parseInt(w) })).sort((a, b) => a.w - b.w);
      const pick = cands.find((c) => c.w >= 360) ?? cands[cands.length - 1];
      if (pick) phone = await bytesOf(abs(pick.u));
    }
    rows.push({
      src, srcset: Boolean(srcset), full, phone,
      lazy: /loading="lazy"/i.test(tag),
      dims: Boolean(attr(tag, "width") && attr(tag, "height")),
    });
  }
  return { path, html: html.length, rows };
}

const out = [];
for (let i = 0; i < paths.length; i += 8) {
  out.push(...await Promise.all(paths.slice(i, i + 8).map(auditPage)));
  process.stderr.write(`\r${out.length}/${paths.length}`);
}
process.stderr.write("\n");

const kb = (b) => Math.round(b / 1024);
out.sort((a, b) => b.rows.reduce((s, r) => s + r.phone, 0) - a.rows.reduce((s, r) => s + r.phone, 0));

console.log("HEAVIEST PAGES ON A PHONE (what a 360px viewport downloads in images)\n");
console.log("phone   desktop  imgs  nosrcset  nolazy  nodims  page");
for (const p of out.slice(0, 20)) {
  const ph = p.rows.reduce((s, r) => s + r.phone, 0);
  const fu = p.rows.reduce((s, r) => s + r.full, 0);
  const no = p.rows.filter((r) => !r.srcset && r.full > 20000).length;
  const nl = p.rows.filter((r) => !r.lazy).length;
  const nd = p.rows.filter((r) => !r.dims).length;
  console.log(`${(kb(ph)+"KB").padEnd(7)} ${(kb(fu)+"KB").padEnd(8)} ${String(p.rows.length).padEnd(5)} ${String(no).padEnd(9)} ${String(nl).padEnd(7)} ${String(nd).padEnd(7)} ${p.path}`);
}

const allRows = out.flatMap((p) => p.rows.map((r) => ({ ...r, path: p.path })));
const heavyNoSrcset = [...new Map(allRows.filter((r) => !r.srcset && r.full > 20000).map((r) => [r.src, r])).values()]
  .sort((a, b) => b.full - a.full);
console.log(`\nIMAGES WITH NO SRCSET, OVER 20KB — a phone downloads the full file (${heavyNoSrcset.length} distinct)\n`);
for (const r of heavyNoSrcset.slice(0, 40)) console.log(`  ${(kb(r.full)+"KB").padStart(7)}  ${r.src}`);

const totalPhone = out.reduce((s, p) => s + p.rows.reduce((t, r) => t + r.phone, 0), 0);
console.log(`\n${out.length} pages, ${allRows.length} img tags, ${sizes.size} distinct files.`);
console.log(`Wasted on no-srcset files over 20KB: ${kb(heavyNoSrcset.reduce((s, r) => s + r.full, 0))}KB across ${heavyNoSrcset.length} files.`);
console.log(`Median page image weight on a phone: ${kb(out.map((p)=>p.rows.reduce((s,r)=>s+r.phone,0)).sort((a,b)=>a-b)[Math.floor(out.length/2)])}KB`);
