/**
 * Capped DataForSEO research batch for ONE BotPlanet robot category.
 *
 * REUSABLE BY DESIGN. This began as a pool-only script with its seeds typed
 * into the file. It now takes a category and reads that category's seed
 * inventory from docs/seo/seeds/<category>.json, because every page BotPlanet
 * builds gets the same pre-build research treatment and a process that only
 * works once is not a process. See docs/seo/PRE-BUILD-PROCESS.md.
 *
 *   SEO_CATEGORY=window-cleaning-robots node scripts/seo-research.mjs
 *   node scripts/seo-research.mjs --category=window-cleaning-robots
 *
 * COST CONTROL: every DataForSEO response reports its own `cost`; this run
 * accumulates that figure and refuses to start any further request once
 * SAFETY_STOP is reached. The cap defaults to $2.00 and may be lowered — never
 * silently raised — with SEO_COST_CAP. SAFETY_STOP leaves headroom so an
 * in-flight request can never breach the cap.
 *
 * SECURITY: the credential comes only from the DATAFORSEO_BASIC_AUTH
 * environment variable (GitHub repository secret in CI), used directly as the
 * pre-encoded Basic value — never decoded, rebuilt or logged. The output
 * artifact contains no request headers, only sanitised result fields.
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

/* ---- Which category are we researching? ---------------------------- */
const argCategory = process.argv.find((a) => a.startsWith("--category="))?.split("=")[1];
const CATEGORY = (argCategory ?? process.env.SEO_CATEGORY ?? "").trim();
if (!CATEGORY) {
  console.error("No category given. Use --category=<slug> or SEO_CATEGORY=<slug>.");
  console.error("Seed inventories live in docs/seo/seeds/<slug>.json");
  process.exit(1);
}
if (!/^[a-z0-9-]+$/.test(CATEGORY)) {
  console.error(`Category "${CATEGORY}" is not a plain slug. Refusing to build a path from it.`);
  process.exit(1);
}
const SEED_FILE = `docs/seo/seeds/${CATEGORY}.json`;
let seedDoc;
try {
  seedDoc = JSON.parse(readFileSync(SEED_FILE, "utf8"));
} catch (e) {
  console.error(`Cannot read ${SEED_FILE}: ${e.message}`);
  console.error("Write the free seed inventory first — the paid run never invents its own seeds.");
  process.exit(1);
}

if (!process.env.DATAFORSEO_BASIC_AUTH?.trim()) {
  console.error("DATAFORSEO_BASIC_AUTH is not set. Aborting before any paid call.");
  process.exit(1);
}
const AUTH = "Basic " + process.env.DATAFORSEO_BASIC_AUTH.trim();

/* The owner ceiling. SEO_COST_CAP may LOWER it for a small run; a value above
   the ceiling is refused rather than honoured, so a typo cannot authorise
   spending nobody approved. */
const CEILING = 2.0;
const requestedCap = Number(process.env.SEO_COST_CAP ?? CEILING);
if (!Number.isFinite(requestedCap) || requestedCap <= 0) {
  console.error(`SEO_COST_CAP "${process.env.SEO_COST_CAP}" is not a positive number.`);
  process.exit(1);
}
const HARD_CAP = Math.min(requestedCap, CEILING);
const SAFETY_STOP = HARD_CAP * 0.9;
const US = { location_code: 2840, language_code: "en" };
const BASE = "https://api.dataforseo.com/v3";

let totalCost = 0;
const costLog = [];

async function call(path, tasks, label) {
  if (totalCost >= SAFETY_STOP) {
    console.log(`SKIPPED ${label} — cost ${totalCost.toFixed(4)} at safety stop (cap ${HARD_CAP})`);
    return null;
  }
  /* A request timeout, because there was none until 6 August 2026 and a run
     hung for over twenty minutes on a single live SERP call with no way to
     tell a slow call from a dead one. An unbounded fetch in CI does not fail,
     it just runs until the job limit — and since results were only written at
     the very end, a hang lost every dollar already spent. 90s is generous for
     a live SERP; anything past it is not coming back. */
  let res;
  try {
    res = await fetch(`${BASE}${path}`, {
      method: "POST",
      headers: { Authorization: AUTH, "Content-Type": "application/json" },
      body: JSON.stringify(tasks),
      signal: AbortSignal.timeout(90_000),
    });
  } catch (e) {
    console.error(`${label}: request failed or timed out (${e.name}). Continuing with what we have.`);
    return null;
  }
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
/* Seeds — the category's free inventory, deduplicated at load.        */
/* ------------------------------------------------------------------ */

const LEADS = [...new Set(seedDoc.leads ?? [])];
const SEEDS = [...new Set([...LEADS, ...(seedDoc.seeds ?? [])])];
const SERP_QUERIES = [...new Set(seedDoc.serpQueries ?? [])];

if (!SEEDS.length || !LEADS.length) {
  console.error(`${SEED_FILE} has no leads or no seeds. Nothing to research.`);
  process.exit(1);
}

/* ------------------------------------------------------------------ */
/* Runs                                                                */
/* ------------------------------------------------------------------ */

/* Written after every phase, not just at the end. A run that dies half way
   through has still bought real data, and throwing it away means paying for
   it twice. */
function saveProgress() {
  try {
    mkdirSync("research-output", { recursive: true });
    out.costLog = costLog;
    out.totalCostUsd = Number(totalCost.toFixed(6));
    writeFileSync(`research-output/${CATEGORY}-results.json`, JSON.stringify(out, null, 2));
  } catch (e) {
    console.error(`Could not write progress: ${e.message}`);
  }
}

const out = { category: CATEGORY, seedFile: SEED_FILE, generated: new Date().toISOString(), locale: US, seedsBeforeDedupe: null, seeds: SEEDS.length, volume: [], difficulty: [], related: [], serps: [] };

console.log(`Category: ${CATEGORY} (${SEED_FILE})`);
console.log(`Seeds after dedupe: ${SEEDS.length} · leads ${LEADS.length} · SERP queries ${SERP_QUERIES.length}`);
console.log(`Cost cap: $${HARD_CAP.toFixed(2)} (ceiling $${CEILING.toFixed(2)})`);

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

saveProgress();

// 2. Keyword difficulty — ONE batched call.
const kd = await call("/dataforseo_labs/google/bulk_keyword_difficulty/live", [{ ...US, keywords: SEEDS }], "bulk_kd");
for (const t of kd?.tasks ?? []) {
  for (const r of t.result ?? []) {
    for (const item of r.items ?? []) out.difficulty.push({ keyword: item.keyword, kd: item.keyword_difficulty ?? null });
  }
}

saveProgress();

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

saveProgress();

// 4. Live US SERPs for decisive queries only — intent, result types, PAA, competitors.
for (const q of SERP_QUERIES) {
  const serp = await call("/serp/google/organic/live/advanced", [{ ...US, keyword: q, device: "desktop", depth: 20 }], `serp:${q}`);
  const items = serp?.tasks?.[0]?.result?.[0]?.items ?? [];
  const organic = items.filter((i) => i.type === "organic").slice(0, 10)
    .map((i) => ({ pos: i.rank_absolute, domain: i.domain, title: i.title }));
  const paa = items.filter((i) => i.type === "people_also_ask").flatMap((i) => (i.items ?? []).map((x) => x.title)).slice(0, 8);
  const features = [...new Set(items.map((i) => i.type))].filter((t) => t !== "organic");
  out.serps.push({ query: q, features, organic, paa });
  saveProgress();
}

/* ------------------------------------------------------------------ */
/* Artifact                                                            */
/* ------------------------------------------------------------------ */

out.costLog = costLog;
out.totalCostUsd = Number(totalCost.toFixed(6));
mkdirSync("research-output", { recursive: true });
writeFileSync(`research-output/${CATEGORY}-results.json`, JSON.stringify(out, null, 2));
writeFileSync(
  `research-output/${CATEGORY}-cost-summary.json`,
  JSON.stringify({ category: CATEGORY, hardCapUsd: HARD_CAP, totalCostUsd: out.totalCostUsd, batches: costLog }, null, 2),
);
console.log(`DONE. Total spend $${totalCost.toFixed(4)} of $${HARD_CAP.toFixed(2)} cap.`);
if (totalCost > HARD_CAP) {
  console.error("CAP EXCEEDED — investigate before any further run.");
  process.exit(2);
}
