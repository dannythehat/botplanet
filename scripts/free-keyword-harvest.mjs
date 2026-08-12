/**
 * Free keyword harvest — Google Suggest and Amazon Suggest, no credential.
 *
 * WHY THIS EXISTS. The paid DataForSEO batch runs in GitHub Actions and the
 * repository's Actions entitlement expired on 8 August 2026. Every category
 * BotPlanet has built ran the paid gate first, and there is no version of this
 * project where a page gets written from nothing. This is what is available
 * with no credential and no spend.
 *
 * WHAT IT GIVES YOU, AND WHAT IT DOES NOT.
 *
 * It gives real queries. Both endpoints return what people actually type, in
 * an order the engines derive from how often they type it. Amazon's is the
 * more valuable of the two for this site: it is scoped to a shop, so every
 * suggestion carries buying intent by construction, and it surfaces
 * accessory and comparison language the general web never shows.
 *
 * IT DOES NOT GIVE VOLUMES. There is no searches-per-month here and there is
 * no honest way to derive one. Suggest rank is ordinal — it says "this is
 * asked more than the one below it" and nothing more. The page plan records a
 * volume for every keyword it targets, so anything harvested here enters as
 * `volume: null` and stays that way until a paid run measures it. A guessed
 * number in that field is worse than an empty one, because the next person
 * cannot tell the difference.
 *
 * ALPHABET SOUP. Each seed is expanded with a-z and with the question and
 * commercial modifiers below. Asking Google for "eilik robot" returns ten
 * suggestions; asking for "eilik robot a", "eilik robot b" and so on returns
 * a few hundred, and the tail is where the buying questions live.
 *
 * Usage:
 *   node scripts/free-keyword-harvest.mjs --seeds a.json --out harvest.json
 *   node scripts/free-keyword-harvest.mjs --terms "eilik robot,loona robot"
 */

import { readFileSync, writeFileSync } from "node:fs";

const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

const LETTERS = "abcdefghijklmnopqrstuvwxyz".split("");

/* Modifiers chosen for what a review page has to answer, not for coverage.
   "is X still supported" is on this list because the Vector review cannot be
   written without knowing whether that is a real question or my assumption. */
const PREFIX_MODIFIERS = ["is", "are", "does", "do", "can", "how", "why", "what", "best", "cheap"];
const SUFFIX_MODIFIERS = [
  "price", "review", "vs", "for sale", "worth it", "alternative",
  "subscription", "battery", "app", "accessories", "problems", "discontinued",
];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const arg = (name) =>
  process.argv.includes(name) ? process.argv[process.argv.indexOf(name) + 1] : null;

/**
 * Google Suggest. `client=firefox` returns a plain JSON array rather than the
 * JSONP the browser client uses, which is the only reason this needs no
 * parsing beyond JSON.parse.
 */
async function google(q) {
  const url = `https://suggestqueries.google.com/complete/search?client=firefox&hl=en&gl=us&q=${encodeURIComponent(q)}`;
  try {
    const res = await fetch(url, { headers: { "user-agent": UA } });
    if (!res.ok) return [];
    const body = JSON.parse(await res.text());
    return Array.isArray(body?.[1]) ? body[1] : [];
  } catch {
    return [];
  }
}

/** Amazon Suggest, US marketplace (`mid` is amazon.com), all departments. */
async function amazon(q) {
  const url =
    `https://completion.amazon.com/api/2017/suggestions?limit=11&prefix=${encodeURIComponent(q)}` +
    `&suggestion-type=KEYWORD&alias=aps&mid=ATVPDKIKX0DER&site-variant=desktop&client-info=amazon-search-ui`;
  try {
    const res = await fetch(url, { headers: { "user-agent": UA } });
    if (!res.ok) return [];
    const body = JSON.parse(await res.text());
    return (body?.suggestions ?? [])
      .filter((s) => s.type === "KEYWORD" && s.value)
      .map((s) => s.value);
  } catch {
    return [];
  }
}

function expansionsFor(seed) {
  const out = [seed];
  for (const l of LETTERS) out.push(`${seed} ${l}`);
  for (const m of PREFIX_MODIFIERS) out.push(`${m} ${seed}`);
  for (const m of SUFFIX_MODIFIERS) out.push(`${seed} ${m}`);
  return out;
}

const seedsArg = arg("--seeds");
const termsArg = arg("--terms");
let SEEDS;
if (termsArg) SEEDS = termsArg.split(",").map((s) => s.trim()).filter(Boolean);
else if (seedsArg) {
  const doc = JSON.parse(readFileSync(seedsArg, "utf8"));
  SEEDS = doc.harvestSeeds ?? doc.seeds;
} else {
  console.error("Give --terms 'a,b' or --seeds path.json");
  process.exit(1);
}

/* A term can be reached from several expansions. `rank` keeps the BEST
   position it ever appeared at, because a term that is Google's first
   suggestion for one prefix and its tenth for another is a first-suggestion
   term. Keeping the worst, or averaging, would bury exactly the terms worth
   having. */
const found = new Map();
const record = (term, engine, rank, via) => {
  const key = term.toLowerCase().trim();
  if (!key) return;
  if (!found.has(key)) found.set(key, { term: key, google: null, amazon: null, via: [] });
  const row = found.get(key);
  if (row[engine] === null || rank < row[engine]) row[engine] = rank;
  if (row.via.length < 4 && !row.via.includes(via)) row.via.push(via);
};

let done = 0;
const queries = SEEDS.flatMap((s) => expansionsFor(s).map((q) => ({ seed: s, q })));
process.stderr.write(`${SEEDS.length} seeds → ${queries.length} suggest queries per engine\n`);

/* A THROTTLED ENGINE RETURNS AN EMPTY LIST, WHICH LOOKS LIKE "NOBODY SEARCHES
   THIS". That mistake has already cost this project one full discovery run —
   seventeen lawn mowers reported as absent from Amazon when the truth was a
   rate limit. Both engines here fail the same soft way, so a long empty streak
   halts the run instead of producing a confident, short list. */
const dry = { google: 0, amazon: 0 };
const LIMIT = 25;

let halted = null;
for (const { seed, q } of queries) {
  const [g, a] = await Promise.all([google(q), amazon(q)]);
  g.forEach((t, i) => record(t, "google", i + 1, seed));
  a.forEach((t, i) => record(t, "amazon", i + 1, seed));
  done += 1;
  for (const [engine, list] of [["google", g], ["amazon", a]]) {
    dry[engine] = list.length ? 0 : dry[engine] + 1;
    if (dry[engine] >= LIMIT) halted = engine;
  }
  if (halted) {
    process.stderr.write(
      `\nHALTED: ${halted} returned nothing ${LIMIT} times running — that is a throttle, not a finding. ` +
        `${done} of ${queries.length} queries done; what was harvested is kept and the gap is recorded.\n`,
    );
    break;
  }
  if (done % 50 === 0) process.stderr.write(`  ${done}/${queries.length} — ${found.size} terms\n`);
  await sleep(250);
}

/* BOTH-ENGINE TERMS FIRST. A query Google and Amazon both complete is asked
   by people researching AND by people shopping, which on this site is the
   only kind of keyword worth a page section. After that, Amazon before
   Google: this is an affiliate catalogue, not a magazine. */
const rows = [...found.values()].sort((a, b) => {
  const both = (r) => (r.google !== null && r.amazon !== null ? 0 : 1);
  if (both(a) !== both(b)) return both(a) - both(b);
  const best = (r) => Math.min(r.amazon ?? 99, r.google ?? 99);
  return best(a) - best(b);
});

const out = arg("--out");
if (out) {
  writeFileSync(
    out,
    JSON.stringify(
      {
        harvestedOn: new Date().toISOString().slice(0, 10),
        method: "Google Suggest + Amazon Suggest, alphabet-soup expanded. Ordinal rank only — NO search volumes.",
        seeds: SEEDS,
        queriesRun: done,
        queriesPlanned: queries.length,
        haltedOn: halted,
        terms: rows,
      },
      null,
      2,
    ),
  );
}

const both = rows.filter((r) => r.google !== null && r.amazon !== null);
console.log(`\n${rows.length} distinct terms from ${queries.length} queries per engine.`);
console.log(`${both.length} appear on BOTH engines.\n`);
console.log("| Term | Amazon | Google | From |");
console.log("|---|---|---|---|");
for (const r of rows.slice(0, 60)) {
  console.log(`| ${r.term} | ${r.amazon ?? "—"} | ${r.google ?? "—"} | ${r.via.join(", ")} |`);
}
