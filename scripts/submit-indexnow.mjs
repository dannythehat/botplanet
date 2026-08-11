/**
 * Tell the search engines that accept being told.
 *
 * WHY THIS EXISTS AND WHAT IT CANNOT DO. A sitemap is a passive invitation:
 * it sits at a URL and waits to be re-crawled, which for a site of this age
 * means days to weeks. IndexNow is the opposite — an HTTP POST naming the URLs
 * that changed, accepted by Bing, Yandex, Seznam and Naver, and shared between
 * them from whichever endpoint receives it.
 *
 * GOOGLE IS NOT IN THAT LIST AND CANNOT BE ADDED HERE. The
 * `google.com/ping?sitemap=` endpoint that every SEO article still recommends
 * was retired by Google in January 2024; it is not deprecated-but-working, it
 * is gone, and a script that calls it and reports success is lying. Google
 * takes sitemap submissions through Search Console only, which needs the
 * owner's account and a verified property. Until that exists, Google finds new
 * pages the way it always has — by crawling the sitemap it already knows about
 * from robots.txt.
 *
 * THE KEY IS PUBLIC BY DESIGN and belongs in the repository. IndexNow proves
 * ownership by requiring the key to be readable at
 * https://<host>/<key>.txt — publishing it IS the authentication, so this is
 * not a credential and does not belong in the scratchpad with the ones that
 * are. Anybody can read it; nobody can use it to submit URLs for a host they
 * do not control.
 *
 *   node scripts/submit-indexnow.mjs                  # every URL in the sitemap
 *   node scripts/submit-indexnow.mjs /a/ /b/          # only these paths
 *   node scripts/submit-indexnow.mjs --since 2026-08-10   # by sitemap lastmod
 *
 * `--since` is the one to reach for after a content pass. Submitting all 109
 * URLs when eleven changed is not harmful, but it is a worse signal: the point
 * of the protocol is to say WHICH pages moved.
 */
const HOST = "botplanet.io";
const KEY = "02724818364dca3f2c76f28281392cc8";
const ENDPOINT = "https://api.indexnow.org/indexnow";

/** IndexNow caps a single submission at 10,000 URLs. We are far below it. */
const MAX_URLS = 10000;

const args = process.argv.slice(2);
const sinceAt = args.indexOf("--since");
const since = sinceAt >= 0 ? args[sinceAt + 1] : null;
const explicit = args.filter((a, i) => a.startsWith("/") && i !== sinceAt + 1);

const say = (s = "") => process.stdout.write(s + "\n");

async function sitemapEntries() {
  const res = await fetch(`https://${HOST}/sitemap.xml`, {
    cache: "no-store",
    headers: { "cache-control": "no-cache" },
  });
  if (!res.ok) throw new Error(`sitemap returned ${res.status}`);
  const xml = await res.text();
  return [...xml.matchAll(/<url>(.*?)<\/url>/gs)].map((m) => ({
    loc: (/<loc>(.*?)<\/loc>/.exec(m[1]) ?? [])[1],
    lastmod: (/<lastmod>(.*?)<\/lastmod>/.exec(m[1]) ?? [])[1] ?? null,
  }));
}

/* THE KEY FILE IS CHECKED BEFORE ANYTHING IS SUBMITTED, because the failure it
   catches is silent. IndexNow answers 200 to a well-formed request and only
   then fetches the key; if that 404s the URLs are dropped and nothing here
   would ever say so. Better to fail loudly on our own side first. */
async function keyIsLive() {
  const res = await fetch(`https://${HOST}/${KEY}.txt`, { cache: "no-store" });
  if (!res.ok) return { ok: false, why: `key file returned ${res.status}` };
  const body = (await res.text()).trim();
  if (body !== KEY) return { ok: false, why: `key file contains "${body.slice(0, 40)}"` };
  return { ok: true };
}

const entries = await sitemapEntries();
say(`sitemap: ${entries.length} URLs`);

let urls;
if (explicit.length) {
  urls = explicit.map((p) => `https://${HOST}${p}`);
  say(`submitting ${urls.length} named path(s)`);
} else if (since) {
  urls = entries.filter((e) => e.lastmod && e.lastmod >= since).map((e) => e.loc);
  say(`submitting ${urls.length} URL(s) with lastmod >= ${since}`);
  /* A page with no lastmod is not evidence that it did not change — it is a
     page this site declines to date, which is a different thing. Say so rather
     than let a smaller number read as a complete one. */
  const undated = entries.filter((e) => !e.lastmod).length;
  if (undated) say(`  (${undated} URL(s) carry no lastmod and are not in this set)`);
} else {
  urls = entries.map((e) => e.loc);
  say(`submitting all ${urls.length} URL(s)`);
}

if (!urls.length) {
  say("\nNothing to submit.");
  process.exit(0);
}
if (urls.length > MAX_URLS) {
  say(`\nRefusing: ${urls.length} URLs is over the ${MAX_URLS} per-request limit.`);
  process.exit(1);
}

const key = await keyIsLive();
if (!key.ok) {
  say(`\nFAIL — ${key.why}`);
  say(`The key must be readable at https://${HOST}/${KEY}.txt before any`);
  say("submission counts. Deploy first, then run this again.");
  process.exit(1);
}
say(`key verified at https://${HOST}/${KEY}.txt`);

const res = await fetch(ENDPOINT, {
  method: "POST",
  headers: { "content-type": "application/json; charset=utf-8" },
  body: JSON.stringify({ host: HOST, key: KEY, keyLocation: `https://${HOST}/${KEY}.txt`, urlList: urls }),
});

/* 200 accepted, 202 accepted but the key is still being checked. Everything
   else is a refusal and is printed with its body, because the body is where
   IndexNow says which URL it objected to. */
const body = await res.text();
say("");
if (res.status === 200 || res.status === 202) {
  say(`PASS — ${res.status} ${res.status === 202 ? "(accepted, key check pending)" : "(accepted)"}`);
  say(`${urls.length} URL(s) submitted to Bing, Yandex, Seznam and Naver.`);
  say("Google does not accept IndexNow and has no working ping endpoint; it");
  say("takes submissions through Search Console only.");
} else {
  say(`FAIL — ${res.status}`);
  if (body.trim()) say(body.trim().slice(0, 800));
  process.exit(1);
}
