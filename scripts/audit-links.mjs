/**
 * The standing findability audit — what CI would run if CI were running.
 *
 * WHY THIS FILE EXISTS. GitHub Actions has been dead since 8 August 2026: runs
 * are created, no runner is ever assigned, and they fail in about two seconds.
 * The unit suite still runs locally, but nothing was checking the thing unit
 * tests cannot see — the site as a crawler meets it. A canonical pointing at
 * the wrong URL, a noindex on a page that should rank, a link to a route that
 * no longer exists: every one of those passes `npm test` and costs traffic.
 *
 * WHAT IT ASSERTS, all against a running site rather than the source:
 *   1. every sitemap URL answers 200, with no redirect hop;
 *   2. every page's canonical points at itself on the production domain;
 *   3. no page in the sitemap carries a noindex;
 *   4. every internal link resolves, and lands on a path the route registry
 *      knows or a live product URL — not a guess, not a stale slug;
 *   5. og:image is absolute and actually fetches.
 *
 *   node scripts/audit-links.mjs [baseUrl]
 *   npm run audit:links
 *
 * The base URL defaults to production. Pass a preview URL to audit a version
 * before it ships, which is the point: this is meant to run against the
 * wrangler preview while the change is still reversible.
 *
 * Exit code is 1 if anything failed, so it can gate a deploy the moment there
 * is somewhere to gate one from.
 */
import { spawnSync } from "node:child_process";

const BASE = (process.argv[2] ?? "https://botplanet.io").replace(/\/$/, "");
const PROD_HOST = "botplanet.io";
/**
 * Auditing a preview is the point of the base-URL argument, and a preview is
 * SUPPOSED to be noindex — Base.astro serves noindex on any host that is not
 * botplanet.io so a workers.dev copy never competes for indexing. The first
 * run against a preview reported all 79 URLs as noindex failures, which was
 * this script not knowing that rule rather than the site breaking it. The
 * canonical checks still run: a preview's canonicals point at production,
 * which is exactly what they should do and worth confirming.
 */
const AUDITING_PRODUCTION = new URL(BASE).host === PROD_HOST;

/* Paths that are legitimately not in the registry and not products. /go/ is an
   affiliate redirect and is disallowed in robots.txt; anchors and query strings
   are stripped before anything is checked. */
const IGNORED_PREFIXES = ["/go/", "/api/", "/admin/"];

/**
 * The route registry, read through tsx rather than re-parsed here.
 *
 * A regex over routes.ts would drift the first time somebody used a template
 * literal in a path, and it already does — several paths are built from a CAT
 * constant. Importing the real module is the only version that stays true.
 */
function registryPaths() {
  const r = spawnSync(
    "npx",
    [
      "tsx",
      "-e",
      `import("./apps/web/src/content/routes.ts").then((m) => {
         const live = m.ROUTES.filter((x) => x.status === "live").map((x) => x.path);
         const all = m.ROUTES.map((x) => x.path);
         const aliases = m.REDIRECTS.map((x) => x.from);
         console.log("__JSON__" + JSON.stringify({ live, all, aliases }));
       })`,
    ],
    { encoding: "utf8" },
  );
  const line = (r.stdout ?? "").split("\n").find((l) => l.startsWith("__JSON__"));
  if (!line) {
    console.error("Could not read the route registry:\n" + (r.stderr || r.stdout));
    process.exit(2);
  }
  return JSON.parse(line.slice("__JSON__".length));
}

const failures = [];
const warnings = [];
const fail = (rule, where, detail) => failures.push({ rule, where, detail });
/* A warning is something a person should look at and not something that should
   stop a deploy. The distinction earns its keep on the coming-soon routes: the
   footer links /deals/ and /news/ on purpose, both render, and calling that a
   broken link would train everybody to ignore the report. */
const warn = (rule, where, detail) => warnings.push({ rule, where, detail });

const get = async (url, method = "GET") => {
  try {
    const r = await fetch(url, { redirect: "manual", method });
    return { status: r.status, location: r.headers.get("location"), body: method === "GET" ? await r.text() : "" };
  } catch (e) {
    return { status: 0, location: null, body: "", error: String(e) };
  }
};

const main = async () => {
  console.log(`Auditing ${BASE}${AUDITING_PRODUCTION ? "" : " (preview — noindex is expected and not checked)"}\n`);
  const { live, all, aliases } = registryPaths();
  const liveRoutes = new Set(live);
  const knownRoutes = new Set(all);
  const aliasPaths = new Set(aliases);

  const sm = await get(`${BASE}/sitemap.xml`);
  if (sm.status !== 200) {
    console.error(`sitemap.xml returned ${sm.status}. Nothing else can be checked.`);
    process.exit(2);
  }
  const sitemap = [...sm.body.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname);
  console.log(`sitemap: ${sitemap.length} URLs`);

  /* Product URLs are not in the registry by design — they come from D1 — so the
     sitemap is the list of the ones that exist. A link to a product not in here
     is a link to a page that is not published. */
  const publishedPaths = new Set(sitemap);

  const pages = new Map();
  for (const path of sitemap) {
    const r = await get(BASE + path);
    pages.set(path, r);

    if (r.status !== 200) {
      fail("sitemap_url_not_200", path, `returned ${r.status}${r.location ? ` -> ${r.location}` : ""}`);
      continue;
    }

    const canonical = r.body.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
    if (!canonical) fail("canonical_missing", path, "no canonical link");
    else {
      const c = new URL(canonical);
      if (c.host !== PROD_HOST) fail("canonical_wrong_host", path, `canonical points at ${c.host}`);
      if (c.pathname !== path) fail("canonical_not_self", path, `canonical points at ${c.pathname}`);
    }

    const robots = r.body.match(/<meta name="robots" content="([^"]*)"/)?.[1] ?? "";
    if (AUDITING_PRODUCTION && /noindex/.test(robots)) {
      fail("noindex_in_sitemap", path, `robots is "${robots}"`);
    }

    const og = r.body.match(/<meta property="og:image" content="([^"]+)"/)?.[1];
    if (!og) fail("og_image_missing", path, "no og:image");
    else if (!/^https:\/\//.test(og)) fail("og_image_relative", path, og);
  }

  /* og:image is checked once per distinct URL. Every review shares a handful of
     them and fetching each per page would be a few hundred requests for the
     same answer. */
  const ogUrls = new Set();
  for (const [, r] of pages) {
    const og = r.body.match(/<meta property="og:image" content="([^"]+)"/)?.[1];
    if (og) ogUrls.add(og);
  }
  for (const u of ogUrls) {
    const r = await get(u, "HEAD");
    if (r.status !== 200) fail("og_image_broken", u, `returned ${r.status}`);
  }
  console.log(`og:image: ${ogUrls.size} distinct, checked`);

  /* Internal links. Every href on every sitemap page, deduplicated across the
     site so a footer link is fetched once rather than eighty times. */
  const linkSources = new Map();
  for (const [path, r] of pages) {
    if (r.status !== 200) continue;
    for (const m of r.body.matchAll(/<a\b[^>]*href="([^"]+)"/g)) {
      const raw = m[1];
      if (!raw.startsWith("/") || raw.startsWith("//")) continue;
      const target = raw.split("#")[0].split("?")[0];
      if (!target || IGNORED_PREFIXES.some((p) => target.startsWith(p))) continue;
      if (!linkSources.has(target)) linkSources.set(target, new Set());
      linkSources.get(target).add(path);
    }
  }
  console.log(`internal links: ${linkSources.size} distinct targets`);

  for (const [target, sources] of linkSources) {
    const from = [...sources].slice(0, 3).join(", ");

    if (aliasPaths.has(target)) {
      fail("link_to_redirect", target, `linked from ${from} — this path 301s, link the destination`);
      continue;
    }
    const known = knownRoutes.has(target) || publishedPaths.has(target);
    if (!known) {
      fail("link_to_unknown_route", target, `linked from ${from} — not in the route registry and not a published URL`);
      continue;
    }
    const r = pages.get(target) ?? (await get(BASE + target));
    if (r.status !== 200) {
      fail("link_target_not_200", target, `returned ${r.status}, linked from ${from}`);
      continue;
    }

    /* Registry drift, in both directions, and neither is a broken link.
       A coming-soon route that renders a real page is either a placeholder the
       footer links on purpose or a page somebody built and forgot to mark live
       — this cannot tell which, so it says so and a person decides. That check
       is how seven working BotMatch pages were found still marked coming_soon
       on 8 August 2026, months after they shipped. */
    if (knownRoutes.has(target) && !liveRoutes.has(target)) {
      warn(
        "registry_says_not_live",
        target,
        `renders 200 but the registry marks it coming_soon — linked from ${from}`,
      );
    }
  }

  const report = (list, heading) => {
    const byRule = new Map();
    for (const f of list) {
      if (!byRule.has(f.rule)) byRule.set(f.rule, []);
      byRule.get(f.rule).push(f);
    }
    console.log(`${heading} — ${list.length}:\n`);
    for (const [rule, items] of byRule) {
      console.log(`  ${rule} (${items.length})`);
      for (const f of items) console.log(`    ${f.where}\n      ${f.detail}`);
      console.log("");
    }
  };

  console.log("");
  if (warnings.length) report(warnings, "WARNINGS (do not block)");
  if (!failures.length) {
    console.log("PASS — nothing to fix.");
    return;
  }
  report(failures, "FAIL");
  process.exitCode = 1;
};

await main();
