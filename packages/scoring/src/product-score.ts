import type { ProductClass } from "@botplanet/shared";
import type {
  PoolAnswers,
  ProductScore,
  ProductScoringResult,
  ScoringConfig,
  SuitabilityCandidate,
} from "./types.js";

const PRICE_TIER_ORDER = ["budget", "mid", "premium", "ultra"] as const;

function eligibleClassesFor(answers: PoolAnswers, config: ScoringConfig): ProductClass[] {
  return config.classEligibility.byPrimaryNeed[answers.primary_need] ?? config.classEligibility.default;
}

/** Fraction (0-1) of the customer's desired surfaces the product actually cleans. */
function cleansCoverage(answers: PoolAnswers, c: SuitabilityCandidate): number {
  if (answers.desired_cleans.length === 0) return 1;
  const covered = answers.desired_cleans.filter((s) => c.cleans.includes(s)).length;
  return covered / answers.desired_cleans.length;
}

/** 1 if the product matches the power preference (or no preference), else 0. */
function powerMatch(answers: PoolAnswers, c: SuitabilityCandidate): number {
  if (answers.power_pref === "no_pref") return 1;
  return c.powerType === answers.power_pref ? 1 : 0;
}

/** Graded budget fit: 1 at the exact tier, decaying by tier distance. */
function priceTierMatch(answers: PoolAnswers, c: SuitabilityCandidate): number {
  if (answers.budget_tier === "no_pref") return 1;
  const want = PRICE_TIER_ORDER.indexOf(answers.budget_tier);
  const have = PRICE_TIER_ORDER.indexOf(c.priceTier);
  if (want < 0 || have < 0) return 0.5;
  const distance = Math.abs(want - have);
  return Math.max(0, 1 - distance / (PRICE_TIER_ORDER.length - 1));
}

/**
 * Deterministic product suitability scoring.
 *
 * Pure function: identical (answers, candidates, config) always yields an
 * identical result. Takes NO offers and NO commission — commercial data cannot
 * reach product selection.
 */
export function scoreProducts(
  answers: PoolAnswers,
  candidates: SuitabilityCandidate[],
  config: ScoringConfig,
): ProductScoringResult {
  const eligible = eligibleClassesFor(answers, config);
  const weights = config.weights;
  const totalWeight = weights.cleansCoverage + weights.power + weights.priceTier + weights.poolSize;

  const scored: ProductScore[] = candidates.map((c) => {
    // --- Hard exclusions ---
    if (!eligible.includes(c.productClass)) {
      return exclude(c.productId, "class_not_eligible");
    }
    if (config.hardExclusions.environmentMismatch) {
      /* No environment supplied while the exclusion is ON means the config
         gates on an axis its questionnaire never asked about. The safe
         direction is to fail closed, and that is what happens — but it would
         exclude the entire catalogue while looking exactly like a genuine
         mismatch, which is the shape of the bug that left the window matcher
         silently returning nothing for a day. It gets its own reason so the
         audit row says "misconfigured" rather than "unsuitable". */
      if (!answers.environment) {
        return exclude(c.productId, "environment_unknown");
      }
      if (!c.environments.includes(answers.environment)) {
        return exclude(c.productId, "environment_mismatch");
      }
    }
    const size = poolSizeFit(answers, c, config);
    if (size.excluded) return exclude(c.productId, size.reason!);

    // --- Weighted suitability (each factor 0-1) ---
    const fCleans = cleansCoverage(answers, c);
    const fPower = powerMatch(answers, c);
    const fPrice = priceTierMatch(answers, c);
    const fSize = size.factor;

    const raw =
      fCleans * weights.cleansCoverage +
      fPower * weights.power +
      fPrice * weights.priceTier +
      fSize * weights.poolSize;

    const score = totalWeight > 0 ? (raw / totalWeight) * 100 : 0;

    return {
      productId: c.productId,
      score: round2(score),
      excluded: false,
      exclusionReason: null,
      breakdown: {
        cleansCoverage: round2(fCleans * weights.cleansCoverage),
        power: round2(fPower * weights.power),
        priceTier: round2(fPrice * weights.priceTier),
        poolSize: round2(fSize * weights.poolSize),
      },
    };
  });

  // Stable sort: score desc, then productId asc for determinism. Excluded (score 0) sink.
  const ranked = [...scored].sort((a, b) => {
    if (a.excluded !== b.excluded) return a.excluded ? 1 : -1;
    if (b.score !== a.score) return b.score - a.score;
    return a.productId < b.productId ? -1 : a.productId > b.productId ? 1 : 0;
  });

  return { configVersion: config.version, eligibleClasses: eligible, ranked };
}

/**
 * Does this robot fit the pool?
 *
 * Three outcomes, not two, and the third is the point:
 *
 *   EXCLUDED   the maker states a limit and the reader's pool exceeds it.
 *   FITS       the maker states a limit and the pool is inside it.
 *   UNKNOWN    there is no comparable pair of figures.
 *
 * UNKNOWN must never behave like EXCLUDED. A manufacturer that publishes an
 * area and no length — Aiper does exactly this for the Scuba V3 — would
 * otherwise disappear from every result for a reader who gave a length, which
 * looks like "this robot is unsuitable" when it means "nobody has said".
 *
 * Nor may it behave like FITS. Scoring an unverified fit as full marks would
 * let a product with no published limit outrank one that is documented to fit.
 * So it carries a discount: visible, ranked below a confirmed fit, never hidden.
 */
const UNKNOWN_FIT = 0.6;

function poolSizeFit(
  answers: PoolAnswers,
  c: SuitabilityCandidate,
  config: ScoringConfig,
): { excluded: boolean; reason?: string; factor: number } {
  if (c.maxPoolLengthFt !== null && answers.pool_length_ft !== null) {
    if (config.hardExclusions.poolTooLong && c.maxPoolLengthFt < answers.pool_length_ft) {
      return { excluded: true, reason: "pool_too_long", factor: 0 };
    }
    return { excluded: false, factor: 1 };
  }

  const area = answers.pool_area_sqft ?? null;
  if (c.maxPoolAreaSqFt !== null && area !== null) {
    if (config.hardExclusions.poolTooLong && c.maxPoolAreaSqFt < area) {
      return { excluded: true, reason: "pool_too_large", factor: 0 };
    }
    return { excluded: false, factor: 1 };
  }

  return { excluded: false, factor: UNKNOWN_FIT };
}

function exclude(productId: string, reason: string): ProductScore {
  return { productId, score: 0, excluded: true, exclusionReason: reason, breakdown: {} };
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

/**
 * The top of the ranking, and everything tied with it.
 *
 * WHY THIS EXISTS. `ranked.find((r) => !r.excluded)` returns the first
 * non-excluded product, and the sort breaks ties on productId — so three
 * products with identical recorded attributes produce a confident single
 * winner chosen, in effect, alphabetically. The reader is told a machine won a
 * comparison that never happened.
 *
 * That is not hypothetical. On 8 August 2026 the first four self-cleaning
 * litter boxes went in with the same `environments` and `cleans` on three of
 * them, because the attributes that separate them — capacity, litter type, cat
 * weight limits — are not recorded yet. Every answer combination returned Casa
 * Leo, and Casa Leo is simply first alphabetically among the tied three.
 *
 * A tie is a real answer. It means the data cannot separate these machines, and
 * saying so is more useful than a coin toss dressed as a recommendation.
 *
 * Scores are compared at two decimal places, which is the precision the
 * breakdown is rounded to. Comparing raw floats would call 84.0000001 and
 * 84.0000002 different products and defeat the whole purpose.
 */
export function topGroup(ranked: ProductScore[]): ProductScore[] {
  const live = ranked.filter((r) => !r.excluded);
  if (!live.length) return [];
  const best = Math.round(live[0]!.score * 100);
  return live.filter((r) => Math.round(r.score * 100) === best);
}

/**
 * True when the matcher cannot honestly name one machine.
 *
 * The caller must not reduce this to a single product: no "first of the tied",
 * no secondary sort, no tie-break on price or commission. If the recorded data
 * does not separate them, nothing downstream is entitled to.
 */
export function isIndistinguishable(ranked: ProductScore[]): boolean {
  return topGroup(ranked).length > 1;
}
