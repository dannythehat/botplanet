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
/* @extension-point per-category | required | No seed inventory means no paid
   research run — the workflow refuses to spend before the free seed list
   exists. Nothing downstream is buildable without it: no volumes, no
   difficulty, no cannibalisation rulings, so no page map.
   @extension-check path:docs/seo/seeds/{slug}.json */
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

/* The run's wall-clock ceiling. Twelve minutes is roughly twice the slowest
   healthy run recorded (companion, 4m28s of paid batch) and a third of the
   worst observed hang. Past it the batch stops calling and reports what it
   bought. */
const RUN_BUDGET_MS = 12 * 60 * 1000;
const DEADLINE_AT = Date.now() + RUN_BUDGET_MS;

let totalCost = 0;
const costLog = [];

async function call(path, tasks, label) {
  if (totalCost >= SAFETY_STOP) {
    console.log(`SKIPPED ${label} — cost ${totalCost.toFixed(4)} at safety stop (cap ${HARD_CAP})`);
    return null;
  }
  /* A WALL-CLOCK BUDGET FOR THE WHOLE RUN, not just per request.
     The per-call timeout below was added on 6 August 2026 and it was not
     enough. The grill run the same afternoon sat in the paid batch for over
     half an hour, because bounding each call at 90s still allows a pathological
     run to spend 90s × (12 related-keyword retries + 20 SERPs) before it gives
     up. Every one of those calls is individually "within timeout" while the
     job as a whole is plainly dead.
     So the run now has a deadline. Past it, remaining calls are skipped and
     the batch finishes with what it has — which is written after every phase
     and printed by the digest, so a slow run still produces usable research
     instead of a job somebody eventually cancels. */
  if (Date.now() > DEADLINE_AT) {
    console.error(`SKIPPED ${label} — run deadline of ${RUN_BUDGET_MS / 60000} minutes reached.`);
    return null;
  }
  /* A request timeout, because there was none until 6 August 2026 and a run
     hung for over twenty minutes on a single live SERP call with no way to
     tell a slow call from a dead one. An unbounded fetch in CI does not fail,
     it just runs until the job limit — and since results were only written at
     the very end, a hang lost every dollar already spent.
     Cut from 90s to 45s the same day: no successful DataForSEO call in six
     categories has taken more than a few seconds, so 90s was not generosity,
     it was half a minute of extra waiting per dead call. */
  let res;
  try {
    res = await fetch(`${BASE}${path}`, {
      method: "POST",
      headers: { Authorization: AUTH, "Content-Type": "application/json" },
      body: JSON.stringify(tasks),
      signal: AbortSignal.timeout(45_000),
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

  /* PER-TASK STATUS, because the envelope lies.
     On 6 August 2026 the litter-box run reported `api 20000` for its
     search_volume call, cost $0.0000, and returned NOTHING — no volume, no
     CPC, no seasonality for any of 106 seeds. DataForSEO had rejected the
     task, not the request, and the top-level status stayed 20000 because the
     REQUEST was fine. The run went green and the single most important call of
     the batch bought nothing at all.
     A batch that returns no rows is a failed batch whatever the envelope says,
     so it is now said out loud, per task, with the reason. */
  let emptyTasks = 0;
  for (const t of json.tasks ?? []) {
    if (t.status_code !== undefined && t.status_code !== 20000) {
      console.error(`${label}: TASK FAILED ${t.status_code} ${t.status_message ?? ""}`.trim());
      emptyTasks++;
    } else if (!t.result || t.result.length === 0) {
      console.error(`${label}: TASK RETURNED NO RESULT (status ${t.status_code ?? "?"})`);
      emptyTasks++;
    }
  }
  if (emptyTasks) {
    console.error(`${label}: ${emptyTasks} of ${json.tasks?.length ?? 0} task(s) produced nothing.`);
  }
  return json;
}

/* ------------------------------------------------------------------ */
/* Seeds — the category's free inventory, deduplicated at load.        */
/* ------------------------------------------------------------------ */

const LEADS = [...new Set(seedDoc.leads ?? [])];
const ALL_SEEDS = [...new Set([...LEADS, ...(seedDoc.seeds ?? [])])];
const SERP_QUERIES = [...new Set(seedDoc.serpQueries ?? [])];

/* GOOGLE ADS REJECTS A KEYWORD OVER TEN WORDS, AND IT REJECTS THE WHOLE TASK
   WITH IT — not the offending keyword, the entire batch.

   That is how the litter-box run of 6 August 2026 priced nothing. Two seeds
   ran to eleven and twelve words ("how to get a cat to use a self cleaning
   litter box"), so all 106 keywords came back empty while the response stayed
   status 20000 and cost $0.0000. Every other phase worked, the workflow went
   green, and the volume table was blank.

   Filtering here rather than failing: the other hundred-odd keywords are fine
   and worth buying, so the run proceeds without the ones Google will not
   price, and says exactly which they were. The same terms stay eligible for
   SERPs and related keywords, which have no such limit. */
const GOOGLE_ADS_MAX_WORDS = 10;
const GOOGLE_ADS_MAX_CHARS = 80;
const oversized = ALL_SEEDS.filter(
  (k) => k.split(/\s+/).length > GOOGLE_ADS_MAX_WORDS || k.length > GOOGLE_ADS_MAX_CHARS,
);
const SEEDS = ALL_SEEDS.filter((k) => !oversized.includes(k));
if (oversized.length) {
  console.error(
    `${oversized.length} seed(s) exceed Google Ads' limits (${GOOGLE_ADS_MAX_WORDS} words / ${GOOGLE_ADS_MAX_CHARS} chars) and are EXCLUDED from volume and difficulty:`,
  );
  for (const k of oversized) console.error(`  [${k.split(/\s+/).length} words] ${k}`);
  console.error("Shorten them in the seed file if their volume matters. They still work as SERP queries.");
}

/* A follow-up run that only wants volume and difficulty.
   The mirror of serpOnly below, and it exists because of the same litter-box
   run: the SERPs and related keywords were bought successfully and only the
   pricing failed. Re-running the whole batch to recover it would have paid
   twice for 23 live SERPs. This flag skips phases 3 and 4 so a repair costs
   what it should. */
const VOLUME_ONLY = seedDoc.volumeOnly === true;

/* A follow-up run that only wants SERPs.
   Analysing a finished run always turns up a term whose SERP we did not buy —
   the lawn research left two, and answering them the normal way meant paying
   $0.115 for volume and difficulty we already had. A SERP is $0.004. This flag
   skips phases 1-3 so a top-up costs what it should. */
const SERP_ONLY = seedDoc.serpOnly === true;

if (SERP_ONLY && VOLUME_ONLY) {
  console.error(`${SEED_FILE} sets both serpOnly and volumeOnly. Pick one — together they buy nothing.`);
  process.exit(1);
}

if (SERP_ONLY) {
  if (!SERP_QUERIES.length) {
    console.error(`${SEED_FILE} is serpOnly but lists no serpQueries. Nothing to research.`);
    process.exit(1);
  }
} else if (VOLUME_ONLY) {
  if (!SEEDS.length) {
    console.error(`${SEED_FILE} is volumeOnly but lists no priceable seeds. Nothing to research.`);
    process.exit(1);
  }
} else if (!SEEDS.length || !LEADS.length) {
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
const vol = SERP_ONLY
  ? null
  : await call("/keywords_data/google_ads/search_volume/live", [{ ...US, keywords: SEEDS }], "search_volume");
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
const kd = SERP_ONLY
  ? null
  : await call("/dataforseo_labs/google/bulk_keyword_difficulty/live", [{ ...US, keywords: SEEDS }], "bulk_kd");
for (const t of kd?.tasks ?? []) {
  for (const r of t.result ?? []) {
    for (const item of r.items ?? []) out.difficulty.push({ keyword: item.keyword, kd: item.keyword_difficulty ?? null });
  }
}

saveProgress();

/* 3. Related keywords — THE LONG-TAIL HARVEST, and it has never worked
   properly until now.

   `/dataforseo_labs/google/related_keywords/live` ACCEPTS EXACTLY ONE TASK PER
   REQUEST. It always has. The script sent every lead in a single batched
   request, which the API rejected every single time with

     40000 "You can set only one task at a time"

   and then fell back to retrying just the first four leads individually. So
   every run since this script was written harvested at most four leads' worth
   of long-tails and threw the rest away, and the earlier diagnosis — that the
   endpoint "has repeatedly returned almost nothing" — was measuring the bug
   rather than the endpoint. Companion robots getting usable related keywords
   for one lead of fourteen was this, not DataForSEO.

   Fixed by doing what the API asks: one task, one request, every lead. At
   roughly $0.001 a call, a fourteen-lead category costs about a penny and a
   half for the entire long-tail set.

   The wall-clock worry behind the old cap is handled where it belongs — the
   run budget is checked between calls, so a slow endpoint stops the phase
   instead of the phase being permanently crippled to guard against one. */
const relTasks = SERP_ONLY || VOLUME_ONLY ? [] : LEADS.map((keyword) => ({ ...US, keyword, depth: 1, limit: 40 }));
let relatedOk = 0;
for (const task of relTasks) {
  if (Date.now() > DEADLINE_AT) {
    console.error(`related_keywords: run budget reached; stopped after ${relatedOk} of ${relTasks.length} leads.`);
    break;
  }
  const single = await call("/dataforseo_labs/google/related_keywords/live", [task], `related:${task.keyword}`);
  if (single) {
    collectRelated(single);
    relatedOk++;
  }
}
if (relTasks.length) {
  console.error(`related_keywords: ${relatedOk} of ${relTasks.length} leads harvested, ${out.related.length} long-tail terms.`);
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
for (const q of VOLUME_ONLY ? [] : SERP_QUERIES) {
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
