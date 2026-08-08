/**
 * Amazon US discovery — find a candidate ASIN for a planned product.
 *
 * WHAT THIS IS FOR, AND WHAT IT IS NOT. The research documents propose
 * products from search volume alone. A product only becomes a page when it has
 * a live Amazon US listing behind it, because a review with no buy button is a
 * page that costs money to write and earns nothing. This runs that check.
 *
 * It DISCOVERS ONLY. Nothing here writes to the catalogue, the offer register
 * or the page plan. The output is a table a human reads and a follow-up
 * identity check verifies — the same separation the pool and window builds
 * used, and the reason the WYBOT C1's dead ASIN was caught before publication
 * rather than after.
 *
 * THE MATCH IS DELIBERATELY CONSERVATIVE. A search result whose title does not
 * contain the model tokens is reported as `unmatched` rather than guessed at.
 * The failure this protects against is real and has happened twice on this
 * site: an "X1" that was an "X1 Essential", and a "C1" whose fields read
 * "C1 PLUS". A missing row is cheap; a wrong ASIN reaches a buyer.
 *
 * Usage: node scripts/amazon-discover.mjs [--json out.json]
 */

import { writeFileSync } from "node:fs";

const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

/**
 * The seventeen robotic-lawn-mower candidates from
 * docs/seo/robotic-lawn-mowers-research-findings.md, in the order that
 * document ranks them — cluster volume first.
 *
 * `must` are tokens the listing title has to contain for a match. `deny` are
 * sibling models that disqualify. Both come from the model naming, not from
 * guesswork: where a range uses a shared stem (Automower 4xx, Navimow i1xx)
 * the deny list carries the siblings.
 */
const TARGETS = [
  { slug: "husqvarna-automower-430x", name: "Husqvarna Automower 430X", query: "Husqvarna Automower 430X robotic lawn mower", must: ["430x"], deny: ["435x", "450x", "415x", "310", "315"] },
  { slug: "mammotion-luba-2-awd", name: "Mammotion LUBA 2 AWD", query: "Mammotion LUBA 2 AWD robot lawn mower", must: ["luba 2"], deny: ["luba 3", "yuka", "luba 1"] },
  { slug: "mammotion-luba-3", name: "Mammotion LUBA 3", query: "Mammotion LUBA 3 robot lawn mower", must: ["luba 3"], deny: ["luba 2", "yuka"] },
  { slug: "segway-navimow-i110n", name: "Segway Navimow i110N", query: "Segway Navimow i110N robot lawn mower", must: ["i110n"], deny: ["i105n", "i108n", "x330", "x350", "x390", "x430"] },
  { slug: "worx-landroid-vision", name: "Worx Landroid Vision", query: "Worx Landroid Vision robot lawn mower", must: ["vision"], deny: ["landroid s", "landroid m", "landroid l"] },
  { slug: "mammotion-yuka", name: "Mammotion YUKA", query: "Mammotion YUKA robot lawn mower", must: ["yuka"], deny: ["luba"] },
  { slug: "eufy-e18", name: "Eufy Robot Lawn Mower E18", query: "eufy robot lawn mower E18", must: ["e18"], deny: ["e15", "e17"] },
  { slug: "husqvarna-automower-115h", name: "Husqvarna Automower 115H", query: "Husqvarna Automower 115H robotic lawn mower", must: ["115h"], deny: ["315", "430x", "415x", "305"] },
  { slug: "segway-navimow-x430", name: "Segway Navimow X430", query: "Segway Navimow X430 robot lawn mower", must: ["x430"], deny: ["x330", "x350", "x390", "i110n", "i105n"] },
  { slug: "eufy-e15", name: "Eufy Robot Lawn Mower E15", query: "eufy robot lawn mower E15", must: ["e15"], deny: ["e18", "e17"] },
  { slug: "segway-navimow-i105n", name: "Segway Navimow i105N", query: "Segway Navimow i105N robot lawn mower", must: ["i105n"], deny: ["i110n", "i108n", "x330", "x430"] },
  { slug: "ecoflow-blade", name: "EcoFlow Blade", query: "EcoFlow Blade robotic lawn mower", must: ["blade"], deny: [] },
  { slug: "greenworks-optimow", name: "Greenworks Optimow", query: "Greenworks Optimow robotic lawn mower", must: ["optimow"], deny: [] },
  { slug: "husqvarna-automower-415x", name: "Husqvarna Automower 415X", query: "Husqvarna Automower 415X robotic lawn mower", must: ["415x"], deny: ["430x", "435x", "450x", "115h"] },
  { slug: "ecovacs-goat-o1000", name: "ECOVACS GOAT O1000", query: "ECOVACS GOAT O1000 robot lawn mower", must: ["o1000"], deny: ["a2000", "o500", "o800", "g1"] },
  { slug: "segway-navimow-x330", name: "Segway Navimow X330", query: "Segway Navimow X330 robot lawn mower", must: ["x330"], deny: ["x430", "x350", "x390", "i110n"] },
  { slug: "ecovacs-goat-a2000", name: "ECOVACS GOAT A2000", query: "ECOVACS GOAT A2000 robot lawn mower", must: ["o1000", "a2000"], deny: ["o500", "o800"] },
];


/**
 * Companion robots. Seven from the page plan, plus ELLIQ and Miko 3 which the
 * plan does not carry — ELLIQ is the largest unassigned long-tail in the
 * category at 3,600/mo, and Miko was ruled in scope by the owner on 7 August
 * 2026 after a Search Console click arrived on "miko ai robot".
 *
 * SEVERAL OF THESE ARE EXPECTED TO FAIL, which is the point of running it.
 * ElliQ sells direct with a subscription, Tombot takes deposits on a waitlist,
 * Aibo has been through a US discontinuation, and Moflin is a Casio Japan
 * product. A category whose best-known names are not on Amazon is a category
 * whose review plan needs to know that before anything is written.
 *
 * EVERY `must` CARRIES A BRAND OR A FULL MODEL NAME. The lawn run required the
 * token "blade" for the EcoFlow Blade and matched a Husqvarna Automower —
 * "blade" is a mower component. A generic noun is not an identifier.
 */
const COMPANION = [
  /* BRAND TOKEN ONLY. The first pass allowed "emo robot" and matched an
     unbranded "AI Desktop Robot – Humanoid Emo Robot for Office Desk" — the
     same class of error as requiring "blade" for the EcoFlow Blade. "emo" is
     what the category is called; "Living.AI" is who makes the one we mean. */
  { slug: "living-ai-emo", name: "Living.AI EMO", query: "Living.AI EMO robot pet desktop companion", must: ["living.ai", "living ai"], deny: ["emotn", "emoji"] },
  { slug: "eilik", name: "Eilik", query: "Eilik desktop robot companion", must: ["eilik"], deny: [] },
  { slug: "loona", name: "Loona Petbot", query: "Loona robot pet dog KEYi", must: ["loona"], deny: [] },
  { slug: "sony-aibo", name: "Sony aibo", query: "Sony aibo robot dog", must: ["aibo"], deny: [] },
  { slug: "tombot-jennie", name: "Tombot Jennie", query: "Tombot Jennie robotic dog", must: ["tombot", "jennie"], deny: [] },
  { slug: "joy-for-all-companion-pets", name: "Joy For All Companion Pet", query: "Joy For All Companion Pet cat", must: ["joy for all"], deny: [] },
  { slug: "casio-moflin", name: "Casio Moflin", query: "Casio Moflin robot pet", must: ["moflin"], deny: [] },
  { slug: "elliq", name: "ElliQ", query: "ElliQ companion robot for seniors", must: ["elliq"], deny: [] },
  { slug: "miko-3", name: "Miko 3", query: "Miko 3 AI robot for kids", must: ["miko 3", "miko3"], deny: ["screen protector", "case for", "film", "pack)"] },
];

/**
 * The three the companion research parked under "check before planning these
 * reviews — probably discontinued". Combined they are 27,900/mo, more than the
 * whole planned companion review set below EMO, and the research never resolved
 * them. Anki went bankrupt in 2019 and Digital Dream Labs bought the Vector and
 * Cozmo lines; Embodied shut Moxie down in December 2024 and the units were
 * bricked. So the expected answer is "Vector and Cozmo yes, Moxie no" — but an
 * expectation is not a reading, which is why they get searched rather than
 * assumed.
 */
const COMPANION_LEGACY = [
  { slug: "anki-vector", name: "Vector 2.0", query: "Vector 2.0 robot Digital Dream Labs", must: ["vector 2.0", "vector robot", "anki vector"], deny: ["accessor", "cable", "sticker"] },
  { slug: "anki-cozmo", name: "Cozmo", query: "Cozmo robot Digital Dream Labs", must: ["cozmo"], deny: ["accessor", "sticker"] },
  { slug: "embodied-moxie", name: "Moxie", query: "Moxie robot Embodied", must: ["moxie robot", "embodied moxie"], deny: ["moxie girlz", "doll"] },
];

/** Which set to run. `--set companion` or default to the lawn seventeen. */
const SET = process.argv.includes("--set") ? process.argv[process.argv.indexOf("--set") + 1] : "lawn";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
/* RETRIES, BECAUSE A THROTTLE LOOKS LIKE AN EMPTY SHELF. Seventeen searches
   at 2.5s tripped Amazon's rate limiting on 7 August 2026 and it answered with
   a 2.3KB page carrying no title and no results — which the first run reported
   as "no_results" for all seventeen products. A blocked request and a product
   Amazon does not stock are indistinguishable unless the size is checked. */
const get = async (url) => {
  for (let attempt = 1; attempt <= 3; attempt++) {
    const res = await fetch(url, {
      headers: { "user-agent": UA, "accept-language": "en-US,en;q=0.9" },
    });
    const body = res.ok ? await res.text() : "";
    if (body.length > 100000) return body;
    if (attempt < 3) await sleep(30000 * attempt);
  }
  return "";
};

const clean = (s) =>
  s ? s.replace(/&amp;/g, "&").replace(/&#39;/g, "'").replace(/\s+/g, " ").trim() : null;

/**
 * Pull (asin, title) pairs out of a search results page.
 *
 * Amazon renders each result inside a container carrying `data-asin`, with the
 * title in an h2. Sponsored placements carry the same markup, so they are not
 * distinguishable here — which is another reason this output is a candidate
 * list for a human rather than an answer.
 */
function parseResults(html) {
  /* SPLIT, DON'T MATCH ACROSS. The first version of this used one regex
     spanning from data-asin to the h2 title and returned zero results for all
     seventeen products — a malformed bounded quantifier that silently matched
     nothing, which looks exactly like "Amazon has none of these". Splitting on
     the ASIN attribute and searching a bounded window after it is duller and
     does not fail silently. */
  const out = [];
  const chunks = html.split(/data-asin="/).slice(1);
  for (const chunk of chunks) {
    const asin = /^(B0[A-Z0-9]{8})"/.exec(chunk)?.[1];
    if (!asin || out.some((r) => r.asin === asin)) continue;
    const window = chunk.slice(0, 6000);
    const title =
      /<h2[^>]*>[\s\S]{0,400}?<span[^>]*>([^<]{10,250})<\/span>/.exec(window)?.[1] ??
      /<h2[^>]*aria-label="([^"]{10,250})"/.exec(window)?.[1] ??
      /alt="([^"]{15,250})"/.exec(window)?.[1];
    if (title) out.push({ asin, title: clean(title) });
    if (out.length >= 12) break;
  }
  return out;
}

/**
 * ACCESSORIES MATCH EVERY TOKEN OF THE PRODUCT THEY ATTACH TO.
 *
 * The companion run on 8 August 2026 returned "Play Ball for Loona Pet Robot"
 * as the Loona candidate. It contains "loona", it is not denied by any sibling
 * model, and it is a £12 ball. Per-target deny lists cannot catch this, because
 * the disqualifier is not a competing model — it is the word "for".
 *
 * These are matched against the whole title. A real product listing can say
 * "replacement filters included"; almost none of them open with "Case for".
 */
const ACCESSORY_DENY = [
  "case for", "cover for", "stand for", "dock for", "charger for", "cable for",
  "skin for", "sticker", "decal", "screen protector", "play ball for",
  "toy for loona", "accessories for", "accessory for", "replacement parts",
  "carrying case", "protective film", "mount for", "adapter for",
  /* "Digital Dream Labs Battery for Vector or Cozmo", $19, was the only thing
     Amazon US stocks for Cozmo. A spare part for a product is evidence the
     product exists somewhere, not evidence you can buy it here. */
  "battery for", "batteries for",
];

function judge(target, results) {
  for (const r of results) {
    const t = (r.title ?? "").toLowerCase();
    if (ACCESSORY_DENY.some((d) => t.includes(d))) continue;
    if (target.deny.some((d) => t.includes(d))) continue;
    if (target.must.some((x) => t.includes(x))) return { ...r, verdict: "candidate" };
  }
  return { asin: null, title: results[0]?.title ?? null, verdict: results.length ? "unmatched" : "no_results" };
}

const results = [];
const ALL = SET === "companion" ? COMPANION : SET === "companion-legacy" ? COMPANION_LEGACY : TARGETS;
/* `--only slug,slug` re-runs part of a set. The companion run on 8 August 2026
   stopped after eight of nine without writing its JSON, and re-searching the
   seven that had already answered would have burned another rate-limit budget
   to learn nothing. Resuming a partial run is cheaper than repeating it. */
const ONLY = process.argv.includes("--only")
  ? new Set(process.argv[process.argv.indexOf("--only") + 1].split(","))
  : null;
const RUN = ONLY ? ALL.filter((t) => ONLY.has(t.slug)) : ALL;
for (const t of RUN) {
  process.stderr.write(`searching ${t.name}… `);
  let picked = { asin: null, title: null, verdict: "error" };
  try {
    const html = await get(`https://www.amazon.com/s?k=${encodeURIComponent(t.query)}`);
    picked = judge(t, parseResults(html));
  } catch (e) {
    picked = { asin: null, title: String(e.message ?? e), verdict: "error" };
  }
  process.stderr.write(`${picked.verdict}${picked.asin ? " " + picked.asin : ""}\n`);
  results.push({ ...t, ...picked });
  await sleep(20000);
}

const out = process.argv.includes("--json") ? process.argv[process.argv.indexOf("--json") + 1] : null;
if (out) writeFileSync(out, JSON.stringify(results, null, 2));

console.log("\n| # | Product | ASIN | Verdict | Listing title |");
console.log("|---|---|---|---|---|");
results.forEach((r, i) =>
  console.log(`| ${i + 1} | ${r.name} | ${r.asin ?? "—"} | ${r.verdict} | ${(r.title ?? "—").slice(0, 80)} |`),
);
const ok = results.filter((r) => r.verdict === "candidate").length;
console.log(`\n[${SET}] ${ok} of ${results.length} have a candidate ASIN. Identity still unverified — run amazon-identity-check.mjs next.`);
