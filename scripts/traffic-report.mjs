/**
 * Cloudflare edge traffic, pulled into the repository.
 *
 * WHY THIS EXISTS. On 12 August 2026 the question "any traffic today?" could
 * not be answered without a human opening the Cloudflare dashboard. The growth
 * baseline of 11 August had the numbers, but it was assembled by hand, which
 * means it is a photograph rather than a feed: fine once, useless for "is it
 * moving?". This makes the same figures a committed file, so the answer is a
 * `git pull` rather than a favour.
 *
 * WHY CLOUDFLARE AND NOT GOOGLE ANALYTICS. Cloudflare sits at the edge and sees
 * every request, including the crawlers, which are the interesting part while a
 * site is waiting to be indexed. GA sees only what executes JavaScript, so it
 * would report GoogleBot's visits as no visits at all.
 *
 * WHAT IT CANNOT TELL YOU, stated here so nobody reads more into the output
 * than it holds:
 *  - REFERRERS. Not available on this plan. Nothing in this report can prove
 *    anyone arrived from a search result, so "organic traffic" is not a number
 *    this file is able to produce.
 *  - OWNER VS STRANGER. There is no way to exclude your own visits. The honest
 *    signal is the browser long tail: one person does not use six browsers.
 *
 * CREDENTIALS. Read only from CLOUDFLARE_API_TOKEN (a repository secret in CI).
 * Never logged, never written to the output. The zone is resolved by name so no
 * account identifier is hardcoded either.
 *
 *   CLOUDFLARE_API_TOKEN=... node scripts/traffic-report.mjs
 *   node scripts/traffic-report.mjs --days=30 --zone=botplanet.io
 */

import { mkdirSync, writeFileSync } from "node:fs";

const arg = (name, fallback) =>
  process.argv.find((a) => a.startsWith(`--${name}=`))?.split("=")[1] ?? fallback;

const ZONE_NAME = arg("zone", process.env.TRAFFIC_ZONE ?? "botplanet.io");
const DAYS = Math.min(Math.max(Number(arg("days", "14")) || 14, 1), 90);

const TOKEN = process.env.CLOUDFLARE_API_TOKEN?.trim();
if (!TOKEN) {
  console.error("CLOUDFLARE_API_TOKEN is not set. Aborting.");
  process.exit(1);
}

const api = async (url, init = {}) => {
  const res = await fetch(url, {
    ...init,
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      "Content-Type": "application/json",
      ...(init.headers ?? {}),
    },
    signal: AbortSignal.timeout(30_000),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} from ${url.split("?")[0]}`);
  return res.json();
};

/* ---- 1. Resolve the zone ------------------------------------------- */

const zoneList = await api(
  `https://api.cloudflare.com/client/v4/zones?name=${encodeURIComponent(ZONE_NAME)}`,
);
if (!zoneList.success || !zoneList.result?.length) {
  console.error(`Zone "${ZONE_NAME}" not found, or the token cannot read zones.`);
  console.error("The token needs Zone:Read and Analytics:Read on this zone.");
  process.exit(1);
}
const zoneTag = zoneList.result[0].id;
const plan = zoneList.result[0].plan?.name ?? "unknown";

/* ---- 2. Pull the daily rollups ------------------------------------- */

/* httpRequests1dGroups rather than the adaptive dataset: it is the one
   available on a free plan, and its browserMap is exactly the breakdown the
   11 August baseline reported by hand. */
const QUERY = `
query ($zone: String!, $since: Date!, $until: Date!) {
  viewer {
    zones(filter: { zoneTag: $zone }) {
      httpRequests1dGroups(
        limit: 90
        filter: { date_geq: $since, date_leq: $until }
        orderBy: [date_ASC]
      ) {
        dimensions { date }
        uniq { uniques }
        sum {
          requests
          pageViews
          bytes
          threats
          browserMap { uaBrowserFamily pageViews }
          countryMap { clientCountryName requests }
        }
      }
    }
  }
}`;

const day = (d) => d.toISOString().slice(0, 10);
const until = new Date(Date.now() - 86400_000); // yesterday: today is always partial
const since = new Date(until.getTime() - (DAYS - 1) * 86400_000);

const gql = await api("https://api.cloudflare.com/client/v4/graphql", {
  method: "POST",
  body: JSON.stringify({
    query: QUERY,
    variables: { zone: zoneTag, since: day(since), until: day(until) },
  }),
});

if (gql.errors?.length) {
  console.error("GraphQL errors:");
  for (const e of gql.errors) console.error(`  ${e.message}`);
  process.exit(1);
}

const groups = gql.data?.viewer?.zones?.[0]?.httpRequests1dGroups ?? [];
if (!groups.length) {
  console.error("No data returned. The zone may have no traffic in this window.");
  process.exit(1);
}

/* ---- 3. Aggregate --------------------------------------------------- */

/* Browser families Cloudflare reports that are not people. Kept explicit and
   visible rather than filtered away silently: while a site is waiting to be
   indexed, the crawler column is the one that matters most. */
const BOTS = /bot|crawler|spider|slurp|bingpreview|facebookexternalhit|headless/i;
/* Cloudflare files anything it cannot identify — including our own audit
   scripts and most scrapers — under these. The 11 August baseline excluded
   18,655 such page views after finding the daily peaks lined up exactly with
   the days audits ran. Counting them as traffic would flatter the numbers. */
const UNIDENTIFIED = /^(unknown|curl|python|wget|go-http|java|okhttp|libwww|node)/i;

const daily = [];
const browsers = new Map();
const bots = new Map();
const countries = new Map();
let unidentified = 0;
let totals = { requests: 0, pageViews: 0, bytes: 0, threats: 0, uniques: 0 };

for (const g of groups) {
  const s = g.sum;
  totals.requests += s.requests ?? 0;
  totals.pageViews += s.pageViews ?? 0;
  totals.bytes += s.bytes ?? 0;
  totals.threats += s.threats ?? 0;
  totals.uniques += g.uniq?.uniques ?? 0;

  let dayHuman = 0;
  for (const b of s.browserMap ?? []) {
    const name = b.uaBrowserFamily ?? "Unknown";
    const views = b.pageViews ?? 0;
    if (UNIDENTIFIED.test(name)) {
      unidentified += views;
    } else if (BOTS.test(name)) {
      bots.set(name, (bots.get(name) ?? 0) + views);
    } else {
      browsers.set(name, (browsers.get(name) ?? 0) + views);
      dayHuman += views;
    }
  }
  for (const c of s.countryMap ?? []) {
    countries.set(c.clientCountryName, (countries.get(c.clientCountryName) ?? 0) + c.requests);
  }
  daily.push({ date: g.dimensions.date, requests: s.requests ?? 0, browserViews: dayHuman });
}

const sorted = (m) => [...m.entries()].sort((a, b) => b[1] - a[1]);
const humanTotal = [...browsers.values()].reduce((a, b) => a + b, 0);
const botTotal = [...bots.values()].reduce((a, b) => a + b, 0);

/* ---- 4. Write it out ------------------------------------------------ */

const stamp = day(new Date());
const rows = (pairs, label) =>
  pairs.length
    ? [`| ${label} | Page views |`, "|---|---|", ...pairs.map(([k, v]) => `| ${k} | ${v} |`)].join("\n")
    : "_None recorded._";

const md = `# Traffic — ${ZONE_NAME}, ${day(since)} to ${day(until)}

Generated ${stamp} by \`scripts/traffic-report.mjs\` from the Cloudflare GraphQL
Analytics API. Cloudflare plan: **${plan}**. Window: **${DAYS} days**, ending
yesterday — today is always partial and would read as a collapse.

## Headline

| | |
|---|---|
| Browser page views (people, probably) | **${humanTotal}** |
| Crawler page views | **${botTotal}** |
| Unidentified / tooling page views *(excluded above)* | ${unidentified} |
| Total requests | ${totals.requests} |
| Unique visitors (Cloudflare's estimate) | ${totals.uniques} |
| Threats blocked | ${totals.threats} |
| Bandwidth | ${(totals.bytes / 1e9).toFixed(2)} GB |

**Two things this cannot tell you**, and they matter more than anything above:

1. **Where anyone came from.** Referrer data is not available on this plan, so
   nothing here proves a single visit came from a search result.
2. **Which visits are the owner's.** There is no way to exclude them. The honest
   evidence for genuine strangers is the browser long tail below — one person
   does not use six browsers.

## Browsers

${rows(sorted(browsers), "Browser")}

## Crawlers

${rows(sorted(bots), "Crawler")}

Googlebot is the number to watch. Google does not accept IndexNow, so it finds
pages by crawling, and a page it has never fetched cannot rank.

## Requests by country

${
  sorted(countries)
    .slice(0, 12)
    .map(([k, v]) => `${k} ${v}`)
    .join(" · ") || "_None recorded._"
}

Datacentre traffic inflates NL, FR and DE — those are clouds, not customers.

## Daily

| Date | Requests | Browser page views |
|---|---|---|
${daily.map((d) => `| ${d.date} | ${d.requests} | ${d.browserViews} |`).join("\n")}
`;

mkdirSync("docs/traffic", { recursive: true });
const out = `docs/traffic/${stamp}.md`;
writeFileSync(out, md);
writeFileSync("docs/traffic/latest.md", md);

console.log(md);
console.log(`\nWrote ${out} and docs/traffic/latest.md`);
