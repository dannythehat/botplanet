import { mkdirSync, writeFileSync } from "node:fs";

const login = process.env.DATAFORSEO_LOGIN?.trim();
const password = process.env.DATAFORSEO_PASSWORD?.trim();
if (!login || !password) {
  console.error("DataForSEO credentials are unavailable.");
  process.exit(1);
}

const AUTH = `Basic ${Buffer.from(`${login}:${password}`).toString("base64")}`;
const BASE = "https://api.dataforseo.com/v3";
const US = { location_code: 2840, language_code: "en" };
const HARD_CAP_USD = 0.60;
const SAFETY_STOP_USD = 0.50;
let totalCostUsd = 0;
const costLog = [];

async function call(path, tasks, label) {
  if (totalCostUsd >= SAFETY_STOP_USD) {
    costLog.push({ label, skipped: true, reason: "safety stop", runningTotal: totalCostUsd });
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
  const cost = Number(json.cost ?? 0);
  totalCostUsd += cost;
  costLog.push({ label, path, tasks: tasks.length, cost, runningTotal: Number(totalCostUsd.toFixed(6)) });
  if (totalCostUsd > HARD_CAP_USD) throw new Error(`Cost cap exceeded: $${totalCostUsd.toFixed(4)}`);
  return json;
}

const seeds = [...new Set([
  "robotic pool cleaner",
  "robot pool cleaner",
  "pool cleaning robot",
  "robotic pool vacuum",
  "pool robot",
  "automatic pool cleaner robot",
  "pool vacuum robot",
  "robot pool vacuum",
  "automatic robotic pool cleaner",
  "robotic swimming pool cleaner",
  "electric pool cleaner robot",
  "pool cleaner robot",
  "swimming pool cleaning robot",
  "automatic pool cleaning robot",
  "robotic cleaner for swimming pool",
  "inground robotic pool cleaner",
  "in ground pool robot",
  "above ground pool robot",
  "robotic pool cleaner for inground pools",
  "robotic pool cleaner for above ground pools",
  "wall climbing robotic pool cleaner",
  "robotic pool cleaner that climbs walls",
  "waterline pool robot",
  "pool floor cleaning robot",
  "robotic pool cleaner with app",
  "wifi robotic pool cleaner",
  "smart robotic pool cleaner",
  "cordless robotic pool cleaner",
  "corded robotic pool cleaner",
  "solar pool skimmer robot",
  "robotic pool skimmer",
  "pool surface cleaning robot",
  "robotic pool cleaner for leaves",
  "robotic pool cleaner for algae",
  "robotic pool cleaner for saltwater pool",
  "robotic pool cleaner for vinyl liner",
  "robotic pool cleaner for fiberglass pool",
  "robotic pool cleaner for small pool",
  "robotic pool cleaner for large pool",
  "robotic pool cleaner for freeform pool",
  "pool robot for leaves",
  "pool robot for debris",
  "pool robot for walls",
  "pool robot for waterline",
  "pool robot for inground pool",
  "pool robot for above ground pool",
  "automatic pool vacuum robot",
  "pool cleaning machine robot",
  "robot pool cleaning machine",
  "residential pool cleaning robot"
])];

const output = {
  generatedAt: new Date().toISOString(),
  market: "United States",
  language: "English",
  scope: "Main robotic pool cleaner category page only",
  hardCapUsd: HARD_CAP_USD,
  seeds,
  volume: [],
  difficulty: [],
  related: [],
  serps: [],
  costLog: [],
  totalCostUsd: 0,
};

const volumeJson = await call(
  "/keywords_data/google_ads/search_volume/live",
  [{ ...US, keywords: seeds }],
  "search volume and CPC"
);
for (const task of volumeJson?.tasks ?? []) {
  for (const row of task.result ?? []) {
    output.volume.push({
      keyword: row.keyword,
      searchVolume: row.search_volume ?? null,
      cpcUsd: row.cpc ?? null,
      competition: row.competition ?? null,
      competitionIndex: row.competition_index ?? null,
      monthlySearches: row.monthly_searches ?? [],
    });
  }
}

const difficultyJson = await call(
  "/dataforseo_labs/google/bulk_keyword_difficulty/live",
  [{ ...US, keywords: seeds }],
  "bulk keyword difficulty"
);
for (const task of difficultyJson?.tasks ?? []) {
  for (const result of task.result ?? []) {
    for (const item of result.items ?? []) {
      output.difficulty.push({ keyword: item.keyword, keywordDifficulty: item.keyword_difficulty ?? null });
    }
  }
}

const relatedJson = await call(
  "/dataforseo_labs/google/related_keywords/live",
  [{ ...US, keyword: "robotic pool cleaner", depth: 2, limit: 150 }],
  "related keywords"
);
for (const task of relatedJson?.tasks ?? []) {
  for (const result of task.result ?? []) {
    for (const item of result.items ?? []) {
      const data = item.keyword_data;
      if (!data?.keyword) continue;
      output.related.push({
        keyword: data.keyword,
        searchVolume: data.keyword_info?.search_volume ?? null,
        cpcUsd: data.keyword_info?.cpc ?? null,
        keywordDifficulty: data.keyword_properties?.keyword_difficulty ?? null,
        searchIntent: data.search_intent_info?.main_intent ?? null,
      });
    }
  }
}

const serpQueries = [
  "robotic pool cleaner",
  "robot pool cleaner",
  "robotic pool vacuum",
  "pool cleaning robot"
];
const serpJson = await call(
  "/serp/google/organic/live/advanced",
  serpQueries.map((keyword) => ({ ...US, keyword, device: "desktop", depth: 20 })),
  "SERP intent comparison"
);
for (const task of serpJson?.tasks ?? []) {
  const result = task.result?.[0];
  const items = result?.items ?? [];
  output.serps.push({
    keyword: task.data?.keyword,
    itemTypes: [...new Set(items.map((item) => item.type))],
    organic: items.filter((item) => item.type === "organic").slice(0, 10).map((item) => ({
      position: item.rank_absolute,
      domain: item.domain,
      title: item.title,
      url: item.url,
    })),
    peopleAlsoAsk: items.filter((item) => item.type === "people_also_ask").flatMap((item) =>
      (item.items ?? []).map((entry) => entry.title)
    ).filter(Boolean).slice(0, 12),
  });
}

const volumeMap = new Map(output.volume.map((row) => [row.keyword, row]));
const difficultyMap = new Map(output.difficulty.map((row) => [row.keyword, row.keywordDifficulty]));
const merged = new Map();
for (const keyword of seeds) {
  const v = volumeMap.get(keyword) ?? {};
  merged.set(keyword, {
    keyword,
    searchVolume: v.searchVolume ?? null,
    cpcUsd: v.cpcUsd ?? null,
    competition: v.competition ?? null,
    competitionIndex: v.competitionIndex ?? null,
    keywordDifficulty: difficultyMap.get(keyword) ?? null,
    source: "seed",
  });
}
for (const row of output.related) {
  const current = merged.get(row.keyword) ?? { keyword: row.keyword };
  merged.set(row.keyword, {
    ...current,
    searchVolume: current.searchVolume ?? row.searchVolume,
    cpcUsd: current.cpcUsd ?? row.cpcUsd,
    keywordDifficulty: current.keywordDifficulty ?? row.keywordDifficulty,
    searchIntent: row.searchIntent ?? null,
    source: current.source ? "seed+related" : "related",
  });
}
output.mergedKeywords = [...merged.values()].sort((a, b) => (b.searchVolume ?? -1) - (a.searchVolume ?? -1));
output.costLog = costLog;
output.totalCostUsd = Number(totalCostUsd.toFixed(6));

mkdirSync("research-output", { recursive: true });
writeFileSync("research-output/pool-category-keyword-research.json", JSON.stringify(output, null, 2));
writeFileSync("research-output/pool-category-cost.json", JSON.stringify({ hardCapUsd: HARD_CAP_USD, totalCostUsd: output.totalCostUsd, costLog }, null, 2));
console.log(`Completed pool category research. Cost: $${output.totalCostUsd.toFixed(4)}`);
