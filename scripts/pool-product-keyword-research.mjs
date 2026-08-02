import { mkdirSync, writeFileSync } from 'node:fs';

const login = process.env.DATAFORSEO_LOGIN?.trim();
const password = process.env.DATAFORSEO_PASSWORD?.trim();
const preEncoded = process.env.DATAFORSEO_BASIC_AUTH?.trim();
if (!preEncoded && (!login || !password)) throw new Error('DataForSEO credentials unavailable');
const AUTH = preEncoded ? `Basic ${preEncoded}` : `Basic ${Buffer.from(`${login}:${password}`).toString('base64')}`;
const BASE = 'https://api.dataforseo.com/v3';
const US = { location_code: 2840, language_code: 'en' };
const HARD_CAP_USD = 0.75;
let totalCostUsd = 0;
const costLog = [];

async function call(path, tasks, label) {
  const response = await fetch(`${BASE}${path}`, {
    method: 'POST',
    headers: { Authorization: AUTH, 'Content-Type': 'application/json' },
    body: JSON.stringify(tasks),
  });
  if (!response.ok) throw new Error(`${label}: HTTP ${response.status}`);
  const json = await response.json();
  if (json.status_code !== 20000) throw new Error(`${label}: ${json.status_code} ${json.status_message}`);
  const cost = Number(json.cost ?? 0);
  totalCostUsd += cost;
  costLog.push({ label, path, tasks: tasks.length, cost, runningTotal: Number(totalCostUsd.toFixed(6)) });
  if (totalCostUsd > HARD_CAP_USD) throw new Error(`Hard cap exceeded: $${totalCostUsd.toFixed(4)}`);
  return json;
}

const products = [
  {
    id: 'dolphin-nautilus-cc-plus-wifi',
    name: 'Dolphin Nautilus CC Plus Wi-Fi',
    base: 'dolphin nautilus cc plus',
    seeds: [
      'dolphin nautilus cc plus', 'dolphin nautilus cc plus wifi', 'dolphin nautilus cc plus wi-fi',
      'dolphin nautilus cc plus review', 'dolphin nautilus cc plus wifi review', 'nautilus cc plus review',
      'dolphin nautilus cc plus price', 'dolphin nautilus cc plus amazon', 'dolphin nautilus cc plus manual',
      'dolphin nautilus cc plus troubleshooting', 'dolphin nautilus cc plus parts', 'dolphin nautilus cc plus vs proteus dx4'
    ]
  },
  {
    id: 'polaris-freedom',
    name: 'Polaris FREEDOM',
    base: 'polaris freedom robotic pool cleaner',
    seeds: [
      'polaris freedom', 'polaris freedom robotic pool cleaner', 'polaris freedom pool cleaner',
      'polaris freedom review', 'polaris freedom robotic pool cleaner review', 'polaris freedom cordless pool cleaner review',
      'polaris freedom price', 'polaris freedom amazon', 'polaris freedom manual', 'polaris freedom troubleshooting',
      'polaris freedom parts', 'polaris freedom vs dolphin'
    ]
  },
  {
    id: 'dolphin-proteus-dx4-plus',
    name: 'Dolphin Proteus DX4 Plus',
    base: 'dolphin proteus dx4 plus',
    seeds: [
      'dolphin proteus dx4 plus', 'proteus dx4 plus', 'dolphin proteus dx4',
      'dolphin proteus dx4 plus review', 'proteus dx4 plus review', 'dolphin proteus dx4 review',
      'dolphin proteus dx4 plus price', 'dolphin proteus dx4 plus amazon', 'dolphin proteus dx4 plus manual',
      'dolphin proteus dx4 plus troubleshooting', 'dolphin proteus dx4 parts', 'dolphin proteus dx4 vs nautilus cc plus'
    ]
  },
  {
    id: 'aiper-scuba-v3-ai-vision',
    name: 'Aiper Scuba V3 AI Vision',
    base: 'aiper scuba v3 ai vision',
    seeds: [
      'aiper scuba v3 ai vision', 'aiper scuba v3', 'scuba v3 ai vision',
      'aiper scuba v3 ai vision review', 'aiper scuba v3 review', 'scuba v3 review',
      'aiper scuba v3 price', 'aiper scuba v3 amazon', 'aiper scuba v3 manual',
      'aiper scuba v3 troubleshooting', 'aiper scuba v3 filter', 'aiper scuba v3 vs polaris freedom'
    ]
  },
  {
    id: 'betta-se-plus',
    name: 'Betta SE Plus',
    base: 'betta se plus',
    seeds: [
      'betta se plus', 'betta se plus pool skimmer', 'betta se plus robotic pool skimmer',
      'betta se plus review', 'betta se plus pool skimmer review', 'betta se plus robotic pool skimmer review',
      'betta se plus price', 'betta se plus amazon', 'betta se plus manual',
      'betta se plus troubleshooting', 'betta se plus parts', 'betta se plus vs betta 2'
    ]
  }
];

const allSeeds = [...new Set(products.flatMap((p) => p.seeds))];
const output = { generatedAt: new Date().toISOString(), market: 'United States', hardCapUsd: HARD_CAP_USD, products, volume: [], difficulty: [], related: {}, serps: {}, costLog: [], totalCostUsd: 0 };

const volumeJson = await call('/keywords_data/google_ads/search_volume/live', [{ ...US, keywords: allSeeds }], 'volume-cpc');
for (const task of volumeJson.tasks ?? []) for (const row of task.result ?? []) output.volume.push({ keyword: row.keyword, searchVolume: row.search_volume ?? null, cpcUsd: row.cpc ?? null, competition: row.competition ?? null, competitionIndex: row.competition_index ?? null, monthlySearches: row.monthly_searches ?? [] });

const difficultyJson = await call('/dataforseo_labs/google/bulk_keyword_difficulty/live', [{ ...US, keywords: allSeeds }], 'bulk-kd');
for (const task of difficultyJson.tasks ?? []) for (const result of task.result ?? []) for (const item of result.items ?? []) output.difficulty.push({ keyword: item.keyword, keywordDifficulty: item.keyword_difficulty ?? null });

for (const product of products) {
  const relatedJson = await call('/dataforseo_labs/google/related_keywords/live', [{ ...US, keyword: product.base, depth: 2, limit: 100 }], `related:${product.id}`);
  const rows = [];
  for (const task of relatedJson.tasks ?? []) for (const result of task.result ?? []) for (const item of result.items ?? []) {
    const data = item.keyword_data;
    if (!data?.keyword) continue;
    rows.push({ keyword: data.keyword, searchVolume: data.keyword_info?.search_volume ?? null, cpcUsd: data.keyword_info?.cpc ?? null, keywordDifficulty: data.keyword_properties?.keyword_difficulty ?? null, searchIntent: data.search_intent_info?.main_intent ?? null });
  }
  output.related[product.id] = rows;
}

const serpTasks = products.flatMap((p) => [
  { ...US, keyword: p.base, device: 'desktop', depth: 20, tag: `${p.id}:model` },
  { ...US, keyword: `${p.base} review`, device: 'desktop', depth: 20, tag: `${p.id}:review` }
]);
const serpJson = await call('/serp/google/organic/live/advanced', serpTasks, 'serps');
for (const task of serpJson.tasks ?? []) {
  const tag = task.data?.tag ?? task.data?.keyword;
  const result = task.result?.[0];
  const items = result?.items ?? [];
  output.serps[tag] = {
    keyword: task.data?.keyword,
    itemTypes: [...new Set(items.map((i) => i.type))],
    organic: items.filter((i) => i.type === 'organic').slice(0, 10).map((i) => ({ position: i.rank_absolute, domain: i.domain, title: i.title, url: i.url })),
    peopleAlsoAsk: items.filter((i) => i.type === 'people_also_ask').flatMap((i) => (i.items ?? []).map((x) => x.title)).filter(Boolean).slice(0, 10)
  };
}

const volumeMap = new Map(output.volume.map((x) => [x.keyword, x]));
const kdMap = new Map(output.difficulty.map((x) => [x.keyword, x.keywordDifficulty]));
output.summary = products.map((p) => ({
  id: p.id,
  name: p.name,
  seeds: p.seeds.map((keyword) => ({ keyword, searchVolume: volumeMap.get(keyword)?.searchVolume ?? null, cpcUsd: volumeMap.get(keyword)?.cpcUsd ?? null, competition: volumeMap.get(keyword)?.competition ?? null, competitionIndex: volumeMap.get(keyword)?.competitionIndex ?? null, keywordDifficulty: kdMap.get(keyword) ?? null })).sort((a,b) => (b.searchVolume ?? -1) - (a.searchVolume ?? -1)),
  related: (output.related[p.id] ?? []).sort((a,b) => (b.searchVolume ?? -1) - (a.searchVolume ?? -1)).slice(0, 30),
  modelSerp: output.serps[`${p.id}:model`] ?? null,
  reviewSerp: output.serps[`${p.id}:review`] ?? null
}));
output.costLog = costLog;
output.totalCostUsd = Number(totalCostUsd.toFixed(6));

mkdirSync('research-output', { recursive: true });
writeFileSync('research-output/pool-product-keyword-research.json', JSON.stringify(output, null, 2));
writeFileSync('research-output/pool-product-keyword-summary.json', JSON.stringify({ generatedAt: output.generatedAt, market: output.market, summary: output.summary, costLog, totalCostUsd: output.totalCostUsd }, null, 2));
console.log(`Completed five-product keyword research. Cost $${output.totalCostUsd.toFixed(4)}`);
