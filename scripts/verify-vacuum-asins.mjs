/**
 * Read Amazon US for each planned vacuum and record what is actually there.
 *
 * FOUR OF THESE ELEVEN ARE FAMILY NAMES, NOT MODELS — "roborock qrevo",
 * "ecovacs deebot", "shark powerdetect" and "shark matrix" each cover several
 * SKUs at different prices. The page plan researched the KEYWORD; this script
 * finds out which machine, if any, that keyword actually resolves to on the
 * shelf. Nothing is seeded from the plan alone.
 */
import { writeFileSync } from "node:fs";

const KEY = process.env.SERPAPI_API_KEY;
const TERMS = [
  "eufy S1 Pro robot vacuum",
  "roborock S8 MaxV Ultra",
  "eufy X10 Pro Omni",
  "shark PowerDetect robot vacuum",
  "shark Matrix robot vacuum",
  "roborock Qrevo",
  "dreame X50 Ultra",
  "dreame X40 Ultra",
  "ecovacs deebot",
  "roborock Saros 10",
  "roomba Max 705",
];

const out = [];
for (const term of TERMS) {
  const url = `https://serpapi.com/search.json?engine=amazon&k=${encodeURIComponent(term)}&amazon_domain=amazon.com&api_key=${KEY}`;
  const j = await (await fetch(url)).json();
  if (j.error) { console.log(`${term}: ERROR ${j.error}`); continue; }
  const rows = (j.organic_results ?? [])
    .filter((r) => r.asin && r.title)
    .slice(0, 4)
    .map((r) => ({
      asin: r.asin,
      brand: r.brand ?? null,
      title: r.title,
      price: r.extracted_price ?? null,
      rating: r.rating ?? null,
      reviews: r.reviews ?? null,
      sponsored: Boolean(r.sponsored),
    }));
  out.push({ term, rows });
  console.log(`\n=== ${term}`);
  for (const r of rows) {
    console.log(`  ${r.asin}  ${String(r.brand ?? "-").padEnd(10)} $${String(r.price ?? "-").padEnd(8)} ${r.rating ?? "-"}★ ${String(r.reviews ?? 0).padStart(6)}  ${r.title.slice(0, 78)}`);
  }
  await new Promise((r) => setTimeout(r, 1200));
}
writeFileSync("/tmp/claude-0/-home-user-botplanet/32861255-3f41-52a8-8beb-c21f7c7ea93f/scratchpad/vacuum-asins.json", JSON.stringify(out, null, 1));
console.log(`\nwrote ${out.length} searches`);
