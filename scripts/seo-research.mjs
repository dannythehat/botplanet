/**
 * US pool-page SEO research — one controlled DataForSEO batch.
 *
 * Scope: ONLY the 13 approved robotic-pool-cleaner pages (see
 * docs/seo/pool-research-plan.md). No future robot category is researched.
 *
 * COST CONTROL: every DataForSEO response reports its own `cost`; this run
 * accumulates that figure and refuses to start any further request once
 * SAFETY_STOP is reached. HARD_CAP is $2.00 (owner ceiling); SAFETY_STOP
 * leaves headroom so an in-flight request can never breach the cap.
 *
 * SECURITY: the credential comes only from the DATAFORSEO_BASIC_AUTH
 * environment variable (GitHub repository secret in CI), used directly as the
 * pre-encoded Basic value — never decoded, rebuilt or logged. The output
 * artifact contains no request headers, only sanitised result fields.
 */
import { mkdirSync, writeFileSync } from "node:fs";

if (!process.env.DATAFORSEO_BASIC_AUTH?.trim()) {
  console.error("DATAFORSEO_BASIC_AUTH is not set. Aborting before any paid call.");
  process.exit(1);
}
const AUTH = "Basic " + process.env.DATAFORSEO_BASIC_AUTH.trim();

const HARD_CAP = 2.0;
const SAFETY_STOP = 1.8;
const US = { location_code: 2840, language_code: "en" };
const BASE = "https://api.dataforseo.com/v3";

let totalCost = 0;
const costLog = [];

async function call(path, tasks, label) {
  if (totalCost >= SAFETY_STOP) {
    console.log(`SKIPPED ${label} — cost ${totalCost.toFixed(4)} at safety stop (cap ${HARD_CAP})`);
    return null;
  }
  const res = await fetch(`${BASE}${path}`, {
    method: "POST",
    headers: { Authorization: AUTH, "Content-Type": "application/json" },
    body: JSON.stringify(tasks),
  });
  if (res.status === 401) {
    console.error(`${label}: HTTP 401 — authentication rejected. Failing immediately; no further calls.`);
    process.exit(1);
  }
  if (!res.ok) {
    console.error(`${label}: HTTP ${res.status}`);
    return null;
  }
  const json = await res.json();
  if (json.status_code === 40100 || json.status_code === 40101 || json.status_code === 40102) {
    console.error(`${label}: API auth error ${json.status_code} ${json.status_message}. Failing immediately.`);
    process.exit(1);
  }
  const cost = Number(json.cost ?? 0);
  totalCost += cost;
  costLog.push({ label, path, tasks: tasks.length, cost, runningTotal: Number(totalCost.toFixed(6)) });
  console.log(`${label}: ${tasks.length} task(s), cost $${cost.toFixed(4)}, total $${totalCost.toFixed(4)}, api ${json.status_code}`);
  if (json.status_code !== 20000) console.error(`${label}: API status ${json.status_code} ${json.status_message}`);
  return json;
}

/* ------------------------------------------------------------------ */
/* Seeds — deduplicated free inventory for the 13 approved pages.      */
/* ------------------------------------------------------------------ */

const LEADS = [
  "robotic pool cleaner",
  "best robotic pool cleaner",
  "dolphin vs aiper pool cleaner",
  "which robotic pool cleaner should i buy",
  "dolphin nautilus cc plus review",
  "polaris freedom review",
  "betta se plus review",
  "dolphin proteus dx4 review",
  "aiper scuba v3 review",
  "corded vs cordless robotic pool cleaner",
  "are robotic pool cleaners worth it",
  "do robotic pool cleaners climb walls",
  "polaris freedom vs dolphin nautilus",
];

const SEEDS = [...new Set([
  ...LEADS,
  // category head + variants
  "robot pool cleaner", "pool cleaning robot", "automatic pool cleaner robot", "pool robot",
  "robotic pool vacuum", "pool vacuum robot", "electric pool cleaner", "pool cleaner machine",
  "in ground pool robot", "above ground pool robot", "inground robotic pool cleaner",
  // best-of / selection
  "best robot pool cleaner", "top rated robotic pool cleaners", "best robotic pool cleaner 2026",
  "best pool cleaning robot", "best robot pool cleaner for the money", "robotic pool cleaner reviews",
  "best cordless robotic pool cleaner", "cordless robotic pool cleaner", "wireless robotic pool cleaner",
  "best budget robotic pool cleaner", "cheap robotic pool cleaner", "robotic pool cleaner under 500",
  "robotic pool cleaner under 1000",
  "best robotic pool cleaner for above ground pools", "above ground pool robot cleaner",
  "best robotic pool cleaner for inground pools", "best in ground pool cleaner robot",
  "best robotic pool cleaner for large pools", "pool robot for large inground pool",
  "best robotic pool cleaner for leaves", "pool robot for leaves and debris", "best pool cleaner heavy debris",
  "wall climbing pool cleaner", "robotic pool cleaner that climbs walls", "waterline pool robot",
  // model / review clusters
  "dolphin nautilus cc plus", "dolphin nautilus cc plus wi-fi", "dolphin nautilus cc plus wifi",
  "dolphin nautilus cc plus problems", "is the dolphin nautilus cc plus worth it", "nautilus cc plus vs cc",
  "polaris freedom robotic pool cleaner", "polaris freedom cordless", "polaris freedom plus",
  "polaris freedom battery life", "polaris freedom problems",
  "betta se plus", "betta pool skimmer", "betta se plus solar skimmer", "betta robotic skimmer",
  "betta se plus battery", "betta se plus saltwater", "solar pool skimmer", "solar pool skimmer review",
  "robotic pool skimmer",
  "dolphin proteus dx4 plus", "dolphin proteus dx4", "proteus dx4 pool cleaner", "dolphin proteus dx4 plus review",
  "aiper scuba v3 ai vision", "aiper scuba v3", "aiper ai vision pool cleaner", "aiper scuba v3 ai vision review",
  // comparisons
  "aiper vs dolphin", "dolphin vs polaris robotic pool cleaner", "polaris vs dolphin pool cleaner",
  "aiper vs beatbot", "wybot vs aiper", "dolphin nautilus cc plus vs polaris freedom",
  "robotic pool cleaner comparison", "compare pool robots", "pool robot vs suction cleaner",
  "pool robot vs pressure side cleaner", "robotic vs manual pool vacuum",
  // botmatch / choose intent
  "help me choose a pool cleaner", "what pool robot do i need", "pool cleaner quiz",
  "how to choose a robotic pool cleaner",
  // educational questions
  "how do robotic pool cleaners work", "how does a pool robot work",
  "are cordless pool robots better", "cordless pool cleaner pros and cons", "corded or cordless pool cleaner",
  "robotic pool cleaner pros and cons", "is a pool robot worth the money", "do robotic pool cleaners really work",
  "pool robot waterline cleaning", "do pool robots clean the waterline", "robotic pool cleaner walls",
  "pool robot not climbing walls",
  "how often should a robotic pool cleaner run", "how long to run pool robot",
  "can you leave a robotic pool cleaner in the pool", "should i leave my pool robot in the pool",
  "how long do robotic pool cleaners last", "robotic pool cleaner maintenance", "how to clean pool robot filter",
  "do robotic cleaners pick up leaves", "pool robot for algae", "robotic pool cleaner for saltwater pool",
  "robotic pool cleaner with app", "quietest robotic pool cleaner", "robotic pool cleaner for vinyl liner",
  "robotic pool cleaner for fiberglass pool", "robotic pool cleaner for small pool",
])];

/** SERP pulls limited to queries that decide intent or a cannibalisation split. */
const SERP_QUERIES = [
  "robotic pool cleaner", "best robotic pool cleaner", "best cordless robotic pool cleaner",
  "best robotic pool cleaner for above ground pools", "best robotic pool cleaner for large pools",
  "best robotic pool cleaner for leaves", "best budget robotic pool cleaner",
  "best robotic pool cleaner for inground pools", "wall climbing pool cleaner", "solar pool skimmer",
  "dolphin nautilus cc plus review", "polaris freedom review", "betta se plus review",
  "dolphin proteus dx4 review", "aiper scuba v3 review",
  "dolphin vs aiper pool cleaner", "dolphin nautilus cc plus vs polaris freedom",
  "corded vs cordless robotic pool cleaner", "are robotic pool cleaners worth it",
  "do robotic pool cleaners climb walls", "which robotic pool cleaner should i buy",
  "robotic pool cleaner comparison",
];

/* ------------------------------------------------------------------ */
/* Runs                                                                */
/* ------------------------------------------------------------------ */

const out = { generated: new Date().toISOString(), locale: US, seedsBeforeDedupe: null, seeds: SEEDS.length, volume: [], difficulty: [], related: [], serps: [] };

console.log(`Seeds after dedupe: ${SEEDS.length}`);

// 1. Volume/CPC/competition + 12-month trend — ONE batched call.
const vol = await call("/keywords_data/google_ads/search_volume/live", [{ ...US, keywords: SEEDS }], "search_volume");
for (const t of vol?.tasks ?? []) {
  for (const r of t.result ?? []) {
    out.volume.push({
      keyword: r.keyword, volume: r.search_volume ?? null, cpc: r.cpc ?? null,
      competition: r.competition ?? null,
      monthly: (r.monthly_searches ?? []).map((m) => ({ y: m.year, m: m.month, v: m.search_volume })),
    });
  }
}

// 2. Keyword difficulty — ONE batched call.
const kd = await call("/dataforseo_labs/google/bulk_keyword_difficulty/live", [{ ...US, keywords: SEEDS }], "bulk_kd");
for (const t of kd?.tasks ?? []) {
  for (const r of t.result ?? []) {
    for (const item of r.items ?? []) out.difficulty.push({ keyword: item.keyword, kd: item.keyword_difficulty ?? null });
  }
}

// 3. Related keywords for the lead terms — batched tasks, shallow depth.
const relTasks = LEADS.map((keyword) => ({ ...US, keyword, depth: 1, limit: 20 }));
let rel = await call("/dataforseo_labs/google/related_keywords/live", relTasks, "related_keywords(batch)");
if (rel && rel.tasks_error > 0 && rel.tasks_count <= 1) rel = null;
if (!rel) {
  for (const task of relTasks) {
    const single = await call("/dataforseo_labs/google/related_keywords/live", [task], `related:${task.keyword}`);
    if (single) collectRelated(single);
  }
} else {
  collectRelated(rel);
}
function collectRelated(json) {
  for (const t of json.tasks ?? []) {
    const seedKw = t.data?.keyword;
    for (const r of t.result ?? []) {
      for (const item of r.items ?? []) {
        const kwd = item.keyword_data;
        if (!kwd) continue;
        out.related.push({
          lead: seedKw, keyword: kwd.keyword,
          volume: kwd.keyword_info?.search_volume ?? null,
          cpc: kwd.keyword_info?.cpc ?? null,
          kd: kwd.keyword_properties?.keyword_difficulty ?? null,
        });
      }
    }
  }
}

// 4. Live US SERPs for decisive queries only — intent, result types, PAA, competitors.
for (const q of SERP_QUERIES) {
  const serp = await call("/serp/google/organic/live/advanced", [{ ...US, keyword: q, device: "desktop", depth: 20 }], `serp:${q}`);
  const items = serp?.tasks?.[0]?.result?.[0]?.items ?? [];
  const organic = items.filter((i) => i.type === "organic").slice(0, 10)
    .map((i) => ({ pos: i.rank_absolute, domain: i.domain, title: i.title }));
  const paa = items.filter((i) => i.type === "people_also_ask").flatMap((i) => (i.items ?? []).map((x) => x.title)).slice(0, 8);
  const features = [...new Set(items.map((i) => i.type))].filter((t) => t !== "organic");
  out.serps.push({ query: q, features, organic, paa });
}

/* ------------------------------------------------------------------ */
/* Artifact                                                            */
/* ------------------------------------------------------------------ */

out.costLog = costLog;
out.totalCostUsd = Number(totalCost.toFixed(6));
mkdirSync("research-output", { recursive: true });
writeFileSync("research-output/seo-research-results.json", JSON.stringify(out, null, 2));
writeFileSync(
  "research-output/cost-summary.json",
  JSON.stringify({ hardCapUsd: HARD_CAP, totalCostUsd: out.totalCostUsd, batches: costLog }, null, 2),
);
console.log(`DONE. Total spend $${totalCost.toFixed(4)} of $${HARD_CAP.toFixed(2)} cap.`);
if (totalCost > HARD_CAP) {
  console.error("CAP EXCEEDED — investigate before any further run.");
  process.exit(2);
}
