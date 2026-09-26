import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

const category = (process.env.SEO_CATEGORY || "").trim();
if (!/^[a-z0-9-]+$/.test(category)) {
  console.error("Invalid SEO_CATEGORY");
  process.exit(1);
}

const basic = process.env.DATAFORSEO_BASIC_AUTH?.trim();
const login = process.env.DATAFORSEO_LOGIN?.trim();
const password = process.env.DATAFORSEO_PASSWORD?.trim();
if (!basic && (!login || !password)) {
  console.error("DataForSEO credentials are unavailable.");
  process.exit(1);
}
const AUTH = basic ? `Basic ${basic}` : `Basic ${Buffer.from(`${login}:${password}`).toString("base64")}`;
const BASE = "https://api.dataforseo.com/v3";
const seedPath = `docs/seo/seeds/${category}.json`;
const config = JSON.parse(readFileSync(seedPath, "utf8"));
const locationCode = config.location_code ?? 2840;
const languageCode = config.language_code ?? "en";
const requestedCap = Number(process.env.SEO_COST_CAP || "0.60");
const HARD_CAP_USD = Math.min(Number.isFinite(requestedCap) ? requestedCap : 0.60, 0.60);
const SAFETY_STOP_USD = Math.max(0, HARD_CAP_USD - 0.05);
let totalCostUsd = 0;
const costLog = [];

function cleanKeyword(value) {
  return String(value || "").trim().replace(/\s+/g, " ");
}
function unique(values) {
  return [...new Set(values.map(cleanKeyword).filter(Boolean))];
}
function money(value) {
  return value == null ? null : Number(value);
}
function addCost(json, label, path, taskCount) {
  const cost = Number(json?.cost ?? 0);
  totalCostUsd += cost;
  costLog.push({ label, path, tasks: taskCount, cost, runningTotal: Number(totalCostUsd.toFixed(6)) });
  if (totalCostUsd > HARD_CAP_USD + 1e-9) throw new Error(`Cost cap exceeded: $${totalCostUsd.toFixed(4)}`);
}
async function apiGet(path, label) {
  const response = await fetch(`${BASE}${path}`, { headers: { Authorization: AUTH, "Content-Type": "application/json" } });
  if (!response.ok) throw new Error(`${label}: HTTP ${response.status}`);
  const json = await response.json();
  if (json.status_code !== 20000) throw new Error(`${label}: ${json.status_code} ${json.status_message}`);
  return json;
}
async function apiPost(path, tasks, label) {
  if (totalCostUsd >= SAFETY_STOP_USD) {
    costLog.push({ label, path, skipped: true, reason: "safety stop", runningTotal: Number(totalCostUsd.toFixed(6)) });
    return null;
  }
  const response = await fetch(`${BASE}${path}`, {
    method: "POST",
    headers: { Authorization: AUTH, "Content-Type": "application/json" },
    body: JSON.stringify(tasks),
  });
  if (!response.ok) throw new Error(`${label}: HTTP ${response.status}`);
  const json = await response.json();
  if (json.status_code !== 20000) throw new Error(`${label}: ${json.status_code} ${json.status_message}`);
  const taskError = (json.tasks ?? []).find((t) => t.status_code !== 20000);
  if (taskError) throw new Error(`${label}: task ${taskError.status_code} ${taskError.status_message}`);
  addCost(json, label, path, tasks.length);
  return json;
}

const seedKeywords = unique(config.seed_keywords ?? []);
const suggestionRoots = unique(config.suggestion_roots ?? []);
const serpQueries = unique(config.serp_queries ?? []).slice(0, 10);
if (!seedKeywords.length) throw new Error("Seed inventory is empty");

mkdirSync("research-output", { recursive: true });

// Free authentication/account check. Only safe non-secret fields are persisted.
const userData = await apiGet("/appendix/user_data", "account check");
const account = userData?.tasks?.[0]?.result?.[0] ?? {};
const accountSafe = {
  apiStatusCode: userData.status_code,
  apiStatusMessage: userData.status_message,
  balanceUsd: money(account?.money?.balance),
  checkedAt: new Date().toISOString(),
};
writeFileSync(`research-output/${category}-auth-check.json`, JSON.stringify(accountSafe, null, 2));
console.log(`DataForSEO authentication OK. Balance available: ${accountSafe.balanceUsd == null ? "unknown" : `$${accountSafe.balanceUsd.toFixed(2)}`}`);

const output = {
  generatedAt: new Date().toISOString(),
  category,
  market: config.market ?? "United States",
  locationCode,
  language: config.language ?? "English",
  languageCode,
  hardCapUsd: HARD_CAP_USD,
  seedCount: seedKeywords.length,
  seedKeywords,
  keywordOverview: [],
  suggestions: [],
  serps: [],
  mergedKeywords: [],
  costLog: [],
  totalCostUsd: 0,
};

// One authoritative overview call supplies volume, CPC, difficulty, intent, monthly trend and SERP summary.
const overviewJson = await apiPost(
  "/dataforseo_labs/google/keyword_overview/live",
  [{ location_code: locationCode, language_code: languageCode, include_serp_info: true, keywords: seedKeywords }],
  "keyword overview"
);
for (const task of overviewJson?.tasks ?? []) {
  for (const row of task.result ?? []) {
    output.keywordOverview.push({
      keyword: row.keyword,
      searchVolume: row.keyword_info?.search_volume ?? null,
      cpcUsd: row.keyword_info?.cpc ?? null,
      competition: row.keyword_info?.competition ?? null,
      competitionLevel: row.keyword_info?.competition_level ?? null,
      monthlySearches: row.keyword_info?.monthly_searches ?? [],
      keywordDifficulty: row.keyword_properties?.keyword_difficulty ?? null,
      searchIntent: row.search_intent_info?.main_intent ?? null,
      foreignIntent: row.search_intent_info?.foreign_intent ?? [],
      serpResultsCount: row.serp_info?.se_results_count ?? null,
      serpItemTypes: row.serp_info?.item_types ?? [],
      averageBacklinks: row.avg_backlinks_info?.backlinks ?? null,
      averageReferringDomains: row.avg_backlinks_info?.referring_main_domains ?? null,
      source: "seed-overview",
    });
  }
}

// Expand the market around broad roots using DataForSEO's own keyword database.
if (suggestionRoots.length && totalCostUsd < SAFETY_STOP_USD) {
  const suggestionTasks = suggestionRoots.map((keyword) => ({
    location_code: locationCode,
    language_code: languageCode,
    keyword,
    limit: config.suggestion_limit ?? 100,
    include_seed_keyword: true,
  }));
  const suggestionsJson = await apiPost(
    "/dataforseo_labs/google/keyword_suggestions/live",
    suggestionTasks,
    "keyword suggestions"
  );
  for (const task of suggestionsJson?.tasks ?? []) {
    const root = task.data?.keyword ?? null;
    for (const result of task.result ?? []) {
      for (const item of result.items ?? []) {
        if (!item.keyword) continue;
        output.suggestions.push({
          root,
          keyword: item.keyword,
          searchVolume: item.keyword_info?.search_volume ?? null,
          cpcUsd: item.keyword_info?.cpc ?? null,
          competition: item.keyword_info?.competition ?? null,
          competitionLevel: item.keyword_info?.competition_level ?? null,
          monthlySearches: item.keyword_info?.monthly_searches ?? [],
          keywordDifficulty: item.keyword_properties?.keyword_difficulty ?? null,
          searchIntent: item.search_intent_info?.main_intent ?? null,
          foreignIntent: item.search_intent_info?.foreign_intent ?? [],
          source: "suggestion",
        });
      }
    }
  }
}

// Live SERPs for representative commercial/informational terms reveal page type and actual ranking competitors.
if (serpQueries.length && totalCostUsd < SAFETY_STOP_USD) {
  const serpJson = await apiPost(
    "/serp/google/organic/live/advanced",
    serpQueries.map((keyword) => ({ location_code: locationCode, language_code: languageCode, keyword, device: "desktop", depth: 20 })),
    "live SERPs"
  );
  for (const task of serpJson?.tasks ?? []) {
    const result = task.result?.[0];
    const items = result?.items ?? [];
    output.serps.push({
      keyword: task.data?.keyword ?? null,
      itemTypes: [...new Set(items.map((item) => item.type).filter(Boolean))],
      organic: items.filter((item) => item.type === "organic").slice(0, 10).map((item) => ({
        position: item.rank_absolute,
        domain: item.domain,
        title: item.title,
        url: item.url,
        description: item.description ?? null,
      })),
      peopleAlsoAsk: items.filter((item) => item.type === "people_also_ask").flatMap((item) =>
        (item.items ?? []).map((entry) => entry.title)
      ).filter(Boolean).slice(0, 15),
    });
  }
}

const merged = new Map();
for (const row of [...output.keywordOverview, ...output.suggestions]) {
  const key = cleanKeyword(row.keyword).toLowerCase();
  if (!key) continue;
  const current = merged.get(key);
  if (!current) {
    merged.set(key, { ...row, keyword: cleanKeyword(row.keyword) });
    continue;
  }
  merged.set(key, {
    ...current,
    searchVolume: current.searchVolume ?? row.searchVolume,
    cpcUsd: current.cpcUsd ?? row.cpcUsd,
    competition: current.competition ?? row.competition,
    competitionLevel: current.competitionLevel ?? row.competitionLevel,
    keywordDifficulty: current.keywordDifficulty ?? row.keywordDifficulty,
    searchIntent: current.searchIntent ?? row.searchIntent,
    foreignIntent: current.foreignIntent?.length ? current.foreignIntent : row.foreignIntent,
    monthlySearches: current.monthlySearches?.length ? current.monthlySearches : row.monthlySearches,
    source: current.source === row.source ? current.source : "seed+suggestion",
  });
}
output.mergedKeywords = [...merged.values()].sort((a, b) => {
  const av = a.searchVolume ?? -1;
  const bv = b.searchVolume ?? -1;
  if (bv !== av) return bv - av;
  return (a.keywordDifficulty ?? 999) - (b.keywordDifficulty ?? 999);
});
output.costLog = costLog;
output.totalCostUsd = Number(totalCostUsd.toFixed(6));

writeFileSync(`research-output/${category}-keyword-research.json`, JSON.stringify(output, null, 2));
writeFileSync(`research-output/${category}-cost-summary.json`, JSON.stringify({ hardCapUsd: HARD_CAP_USD, totalCostUsd: output.totalCostUsd, costLog }, null, 2));
console.log(`Completed ${category} DataForSEO research. Keywords: ${output.mergedKeywords.length}. Cost: $${output.totalCostUsd.toFixed(4)}`);
