/**
 * The technical half of an SEO check, which audit-seo.mjs does not do.
 *
 * WHAT THE OTHER SCRIPT COVERS. audit-seo.mjs reads the keyword register
 * against rendered copy: does the page contain the term it is built around, do
 * its jump links land, is it linked from anywhere, does it chase something it
 * ceded. That is the editorial half and it is the half that decides rankings.
 *
 * WHAT NOTHING COVERED UNTIL 10 AUGUST 2026. The mechanical half: one H1 per
 * page, a canonical that points at the page it is on, a description that is not
 * shared with four other pages, an og:image so a shared link is not a grey box,
 * alt text on every image, and no internal link that costs a 301 before it
 * arrives. None of that is visible in the register and all of it is visible to
 * a crawler.
 *
 * A DUPLICATE TITLE IS THE ONE THAT MATTERS MOST HERE. Two pages with the same
 * title are two pages telling Google they answer the same query, and the usual
 * outcome is that neither ranks. On a site with nine categories of similar
 * machines that is a live risk rather than a theoretical one.
 *
 *   node scripts/audit-seo-technical.mjs [baseUrl]
 */

const BASE = (process.argv[2] ?? "https://botplanet.io").replace(/\/$/, "");
const FANOUT = 4;
const RETRY_ON = [408, 425, 429, 500, 502, 503, 504];

const findings = [];
const add = (level, code, page, detail, fix) =>
  findings.push({ level, code, page, detail, fix });

/**
 * A cache-bypassing fetch, and the reason it has to be one.
 *
 * THIS AUDIT REPORTED NINETEEN PAGES AS BROKEN AFTER THEY WERE FIXED. On 11
 * August 2026 a run immediately after a deploy listed nineteen pages whose
 * meta description was missing its keyword. Every one of them was correct in
 * production; fetching any of them by hand with a random query string returned
 * the new copy. The audit was reading Cloudflare's edge cache, which still
 * held the previous deploy's HTML.
 *
 * That is worse than a missed finding. A false positive after a fix sends you
 * back to change copy that is already right, and the second edit is made
 * against a report rather than against the page.
 *
 * `cache: "no-store"` plus the two request headers asks for a revalidated copy
 * without changing the URL — which matters, because appending a cache-buster
 * query string would alter the very thing the technical audit checks
 * (canonicals, and query-parameter variants of indexable URLs).
 */
const NO_CACHE = {
  cache: "no-store",
  headers: { "cache-control": "no-cache", pragma: "no-cache" },
};

async function get(url, attempt = 0) {
  const res = await fetch(url, { redirect: "follow", ...NO_CACHE });
  if (RETRY_ON.includes(res.status) && attempt < 4) {
    await new Promise((r) => setTimeout(r, 400 * 2 ** attempt));
    return get(url, attempt + 1);
  }
  return res;
}

const one = (html, re) => (html.match(re)?.[1] ?? null);
const norm = (s) => (s ?? "").replace(/\s+/g, " ").trim();

/* ---------------- crawl ---------------- */

const sitemap = await (await get(`${BASE}/sitemap.xml`)).text();
const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
console.log(`Technical SEO check on ${BASE}\n\nsitemap: ${urls.length} URLs`);

const pages = new Map();
for (let i = 0; i < urls.length; i += FANOUT) {
  await Promise.all(
    urls.slice(i, i + FANOUT).map(async (url) => {
      const res = await get(url);
      if (!res.ok) {
        add("FAIL", "sitemap_url_not_ok", new URL(url).pathname,
          `sitemap lists it and it answers HTTP ${res.status}`,
          "remove it from the sitemap or fix the route");
        return;
      }
      pages.set(new URL(url).pathname, { url, html: await res.text() });
    }),
  );
}
console.log(`fetched: ${pages.size} pages\n`);

/* ---------------- per page ---------------- */

const byTitle = new Map();
const byDescription = new Map();

for (const [path, { url, html }] of pages) {
  const head = html.split(/<\/head>/i)[0] ?? html;

  const title = norm(one(head, /<title[^>]*>([\s\S]*?)<\/title>/i));
  const description = norm(one(head, /<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["']/i));
  const canonical = one(head, /<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i);
  const robots = one(head, /<meta[^>]+name=["']robots["'][^>]+content=["']([^"']+)["']/i);

  if (!title) add("FAIL", "no_title", path, "no <title> at all", "every page needs one");
  else {
    if (!byTitle.has(title)) byTitle.set(title, []);
    byTitle.get(title).push(path);
  }

  if (!description) {
    add("FAIL", "no_description", path, "no meta description",
      "Google writes its own from the page, and it is usually worse than yours");
  } else {
    if (!byDescription.has(description)) byDescription.set(description, []);
    byDescription.get(description).push(path);
  }

  /* CANONICAL. Self-referencing is the correct default: it tells a crawler
     which URL to keep when it arrives with a tracking parameter on the end. */
  if (!canonical) {
    add("FAIL", "no_canonical", path, "no canonical link",
      "a self-referencing canonical is what stops ?utm= variants splitting the page");
  } else if (canonical.replace(/\/$/, "") !== url.replace(/\/$/, "")) {
    add("WARN", "canonical_elsewhere", path,
      `canonical points at ${canonical}`,
      "deliberate for a duplicate; a mistake anywhere else");
  }

  if (robots && /noindex/i.test(robots)) {
    add("FAIL", "noindex_in_sitemap", path,
      `robots meta says "${robots}" and the sitemap lists it`,
      "a sitemap is a request to index; the two must not disagree");
  }

  /* H1. Exactly one, because it is the page's own statement of what it is. */
  const h1s = [...html.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/gi)]
    .map((m) => norm(m[1].replace(/<[^>]+>/g, " ")));
  if (h1s.length === 0) add("FAIL", "no_h1", path, "no H1", "give the page a heading");
  else if (h1s.length > 1)
    add("FAIL", "many_h1", path, `${h1s.length} H1s: ${h1s.map((h) => `"${h.slice(0, 40)}"`).join(", ")}`,
      "one H1 per page — the rest should be H2");

  /* Heading order. A jump from H2 to H4 is a structure a screen reader reads
     as a missing level, and it is the cheapest accessibility fault to fix. */
  const levels = [...html.matchAll(/<h([1-6])[^>]*>/gi)].map((m) => Number(m[1]));
  let prev = 0;
  for (const lvl of levels) {
    if (prev && lvl > prev + 1) {
      add("WARN", "heading_level_skipped", path, `H${prev} is followed by H${lvl}`,
        "do not skip a level — style the heading instead");
      break;
    }
    prev = lvl;
  }

  /* Social preview. Missing og:image is a grey box wherever the link is shared. */
  for (const tag of ["og:title", "og:description", "og:image", "og:url"]) {
    const has = new RegExp(`property=["']${tag}["']`, "i").test(head);
    if (!has) add("WARN", "missing_og", path, `no ${tag}`, "a shared link renders as a grey box without it");
  }

  /* Images. An <img> with no alt attribute at all is the fault; alt="" is a
     deliberate statement that the image is decorative and is correct. */
  const imgs = [...html.matchAll(/<img\b[^>]*>/gi)].map((m) => m[0]);
  const noAlt = imgs.filter((t) => !/\salt=/i.test(t));
  if (noAlt.length)
    add("FAIL", "img_without_alt", path, `${noAlt.length} of ${imgs.length} <img> have no alt attribute`,
      'add alt="" if the image is decorative, real text if it is not');

  /* Lazy loading below the fold. Not a ranking factor on its own; it is the
     largest single lever on a page carrying thirty images. */
  const eager = imgs.filter((t) => !/loading=["']lazy["']/i.test(t));
  if (imgs.length > 8 && eager.length > 3)
    add("WARN", "many_eager_images", path,
      `${eager.length} of ${imgs.length} images are not lazy-loaded`,
      "only what is above the fold should load eagerly");

  /* Structured data. Presence, and that it parses — an unparseable block is
     worth exactly nothing and looks fine in the HTML. */
  const blocks = [...html.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)];
  if (!blocks.length) {
    add("WARN", "no_structured_data", path, "no JSON-LD", "rich results need it");
  } else {
    for (const [, body] of blocks) {
      try { JSON.parse(body); }
      catch (e) {
        add("FAIL", "structured_data_unparseable", path, `JSON-LD does not parse: ${String(e).slice(0, 70)}`,
          "a block that does not parse is worth nothing and looks fine in the source");
      }
    }
  }
}

/* ---------------- across pages ---------------- */

for (const [title, paths] of byTitle) {
  if (paths.length > 1)
    add("FAIL", "duplicate_title", paths[0],
      `"${title.slice(0, 70)}" is the title of ${paths.length} pages: ${paths.join(", ")}`,
      "two pages with one title tell Google they answer the same query, and usually neither ranks");
}
for (const [description, paths] of byDescription) {
  if (paths.length > 1)
    add("FAIL", "duplicate_description", paths[0],
      `${paths.length} pages share a description: ${paths.join(", ")}`,
      "write one per page — this is the sentence that earns the click");
}

/* Internal links that cost a redirect. Every one is a wasted hop for a crawler
   and a slower page for a reader, and they are invisible until you look. */
const known = new Set(pages.keys());
for (const [path, { html }] of pages) {
  const main = html.split(/<main\b/i)[1]?.split(/<\/main>/i)[0] ?? "";
  const hrefs = [...main.matchAll(/href=["'](\/[^"'#?]*)["']/g)].map((m) => m[1]);
  const bad = [...new Set(hrefs)].filter(
    (h) => !h.endsWith("/") && !/\.[a-z0-9]{2,5}$/i.test(h) && known.has(`${h}/`),
  );
  if (bad.length)
    add("WARN", "link_costs_a_redirect", path,
      `${bad.length} internal link(s) omit the trailing slash: ${bad.slice(0, 4).join(", ")}`,
      "link the canonical URL directly rather than paying a 301");
}

/* ---------------- report ---------------- */

const ORDER = ["FAIL", "WARN"];
let failures = 0;
for (const level of ORDER) {
  const rows = findings.filter((f) => f.level === level);
  if (!rows.length) continue;
  if (level === "FAIL") failures = rows.length;
  console.log(`${level === "FAIL" ? "FAILURES" : "WARNINGS (do not block)"} — ${rows.length}:\n`);
  const byCode = new Map();
  for (const r of rows) {
    if (!byCode.has(r.code)) byCode.set(r.code, []);
    byCode.get(r.code).push(r);
  }
  for (const [code, list] of byCode) {
    console.log(`  ${code} (${list.length})`);
    for (const r of list.slice(0, 8)) {
      console.log(`    ${r.page}`);
      console.log(`      ${r.detail}`);
      console.log(`      → ${r.fix}`);
    }
    if (list.length > 8) console.log(`    …and ${list.length - 8} more`);
    console.log("");
  }
}

console.log(
  failures
    ? `FAIL — ${failures} failure(s), ${findings.length - failures} warning(s).`
    : `PASS — ${findings.length} warning(s), nothing blocking.`,
);
process.exitCode = failures ? 1 : 0;
