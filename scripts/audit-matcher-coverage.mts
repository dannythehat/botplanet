/**
 * Score EVERY answer a reader can give, for every category, and report what
 * the catalogue can actually tell them.
 *
 * WHY THIS EXISTS ALONGSIDE audit-matchers.mjs. That script drives three answer
 * sets per category through the live API, which proves the funnel is wired up
 * end to end — the thing that was silently dead in production on 9 August. What
 * it cannot tell you is whether the catalogue is capable of answering, because
 * three samples out of a few thousand is not a measurement. On 10 August it
 * reported lawn as "decides 0/3" for weeks while the real figure was unknown,
 * and a single fold bug in the answer merge was quietly emptying the inputs.
 *
 * This one scores LOCALLY — same engine, same stored configs, same products —
 * across the full cartesian product of scored answers. No API calls, so no
 * recommendation rows written to D1 for questions nobody asked, and a complete
 * sweep instead of a sample.
 *
 * THE NUMBER THAT MATTERS IS NOT "% DECIDED". A tie is a real answer on this
 * site and a category of near-identical machines SHOULD tie. The two figures
 * worth acting on are:
 *
 *   NEVER WINS — a published product that cannot be the answer to any question
 *   a reader is able to ask. It is in the catalogue, it has a review, it is in
 *   the grid, and the funnel will never name it. Either its attributes are
 *   wrong, or it is genuinely dominated and the review should say so.
 *
 *   NEVER REACHABLE — an answer set that returns nothing at all. Sometimes
 *   correct (an acre of grass, and the biggest mower does three quarters) and
 *   sometimes a hole.
 *
 *   node --experimental-strip-types scripts/audit-matcher-coverage.mts
 *   npx tsx scripts/audit-matcher-coverage.mts
 */
import { scoreProducts, topGroup } from "@botplanet/scoring";
import type { ScoringConfig, SuitabilityCandidate } from "@botplanet/scoring";
import {
  MATCHER_DEFAULTS,
  MATCHER_QUESTIONS_BY_CATEGORY,
  mergeScores,
} from "../apps/web/src/content/matcher-questions.ts";
import type { ScoreFragment } from "../apps/web/src/content/matcher-questions.ts";
import { NO_OFFER_BY_DESIGN, catalogueStatusOf } from "../apps/web/src/content/products.ts";
import { execFileSync } from "node:child_process";

/* Category slug to the D1 id the products are filed under. Written out rather
   than derived because a wrong join here would silently score one category's
   answers against another's shelf, which is the shape of the bug that put
   window robots in front of pool questions in August. */
const CATEGORY_ID: Record<string, string> = {
  "robotic-pool-cleaners": "cat-pool-cleaners",
  "window-cleaning-robots": "cat-window-cleaners",
  "robotic-lawn-mowers": "cat-lawn-mowers",
  "companion-robots": "cat-companion-robots",
  "pet-camera-robots": "cat-pet-camera-robots",
  "self-cleaning-litter-boxes": "cat-litter-boxes",
  "grill-cleaning-robots": "cat-grill-cleaners",
  "robot-vacuums": "cat-robot-vacuums",
  "educational-coding-robots": "cat-coding-robots",
};

/** Cap on answer sets per category, so a 7-question set cannot run to millions. */
const MAX_COMBOS = 20_000;

function d1<T>(sql: string): T[] {
  const raw = execFileSync(
    "npx",
    ["wrangler", "d1", "execute", "botplanet-db", "--remote", "--json", "--command", sql],
    { encoding: "utf8", cwd: "apps/web", maxBuffer: 64 * 1024 * 1024 },
  );
  const start = raw.indexOf("[");
  return JSON.parse(raw.slice(start))[0].results as T[];
}

const productRows = d1<{
  category_id: string; id: string; slug: string; name: string; product_class: string;
  environments: string; cleans: string; power_type: string; price_tier: string;
  max_pool_length_ft: number | null; max_pool_area_sqft: number | null;
}>(
  "SELECT category_id, id, slug, name, product_class, environments, cleans, power_type, price_tier, max_pool_length_ft, max_pool_area_sqft FROM products WHERE status = 'published'",
);

const configRows = d1<{
  category_id: string; version: number; weights_json: string;
  hard_exclusions_json: string; class_eligibility_json: string;
}>(
  "SELECT q.category_id, sc.version, sc.weights_json, sc.hard_exclusions_json, sc.class_eligibility_json FROM scoring_configs sc JOIN questionnaires q ON q.id = sc.questionnaire_id",
);

const parse = (v: unknown) => (typeof v === "string" ? JSON.parse(v) : v);

const configFor = (categoryId: string): ScoringConfig | undefined => {
  const r = configRows.find((c) => c.category_id === categoryId);
  if (!r) return undefined;
  return {
    version: r.version,
    weights: parse(r.weights_json),
    hardExclusions: parse(r.hard_exclusions_json),
    classEligibility: parse(r.class_eligibility_json),
    tiebreakTolerances: { totalPricePctWithin: 1, deliveryDaysWithin: 1, requireSameWarrantyBand: true },
  };
};

/* The SAME pool /api/botmatch scores, which means the same two exclusions.
   A rule-out review stays published and stays in the grid — a page saying "do
   not buy this" is some of the most useful writing here — but it must never
   come back as the answer to "which should I buy". Measuring against a
   different pool from the one the site scores would make this instrument lie
   in the most reassuring direction. */
const candidatesFor = (categoryId: string): SuitabilityCandidate[] =>
  productRows
    .filter((p) => p.category_id === categoryId)
    .filter((p) => !NO_OFFER_BY_DESIGN[p.id] && catalogueStatusOf(p.id) === "active")
    .map((p) => ({
      productId: p.id,
      productClass: p.product_class as SuitabilityCandidate["productClass"],
      environments: parse(p.environments),
      cleans: parse(p.cleans),
      powerType: p.power_type as SuitabilityCandidate["powerType"],
      priceTier: p.price_tier as SuitabilityCandidate["priceTier"],
      maxPoolLengthFt: p.max_pool_length_ft,
      maxPoolAreaSqFt: p.max_pool_area_sqft,
    }));

const nameOf = new Map(productRows.map((p) => [p.id, p.name]));

/** Every combination of scored options, as merged answer fragments. */
function answerSets(slug: string): ScoreFragment[] {
  const questions = (MATCHER_QUESTIONS_BY_CATEGORY[slug] ?? []).filter((q) =>
    q.options.some((o) => o.scores),
  );
  let sets: ScoreFragment[] = [{ ...(MATCHER_DEFAULTS[slug] ?? {}) }];
  for (const q of questions) {
    const next: ScoreFragment[] = [];
    for (const base of sets) {
      for (const opt of q.options) {
        const merged: ScoreFragment = {
          ...base,
          desired_cleans: [...(base.desired_cleans ?? [])],
        };
        if (opt.scores) mergeScores(merged, opt.scores);
        next.push(merged);
        if (next.length > MAX_COMBOS) break;
      }
      if (next.length > MAX_COMBOS) break;
    }
    sets = next;
  }
  return sets;
}

let anyProblem = false;
console.log("Scoring every answer a reader can give, against the live catalogue.\n");

for (const [slug, categoryId] of Object.entries(CATEGORY_ID)) {
  const config = configFor(categoryId);
  const candidates = candidatesFor(categoryId);
  if (!config || !candidates.length) {
    console.log(`  ${slug.padEnd(28)} no config or no products — skipped`);
    continue;
  }

  const sets = answerSets(slug);
  const winners = new Map<string, number>();
  let decided = 0;
  let empty = 0;
  let worstTie = 0;

  for (const answers of sets) {
    const { ranked } = scoreProducts(answers as never, candidates, config);
    const top = topGroup(ranked);
    if (!top.length) { empty++; continue; }
    if (top.length === 1) decided++;
    worstTie = Math.max(worstTie, top.length);
    for (const t of top) winners.set(t.productId, (winners.get(t.productId) ?? 0) + 1);
  }

  const neverWins = candidates.map((c) => c.productId).filter((id) => !winners.has(id));
  const pct = ((decided / sets.length) * 100).toFixed(0);

  console.log(
    `  ${slug.padEnd(28)} ${String(sets.length).padStart(5)} answer sets  ` +
      `${pct.padStart(3)}% named one  worst tie ${worstTie}  ` +
      `${empty ? `${empty} return nothing  ` : ""}` +
      `${neverWins.length ? `${neverWins.length}/${candidates.length} NEVER WIN` : "every product wins somewhere"}`,
  );

  if (neverWins.length) {
    anyProblem = true;
    for (const id of neverWins) console.log(`        never the answer: ${nameOf.get(id) ?? id}`);
  }
}

console.log(
  anyProblem
    ? "\nSome published products can never be recommended. Either their recorded" +
        "\nattributes are wrong, or they are genuinely dominated and their review" +
        "\nshould say so out loud."
    : "\nEvery published product is the right answer to something.",
);
