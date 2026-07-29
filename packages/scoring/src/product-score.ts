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
    if (config.hardExclusions.environmentMismatch && !c.environments.includes(answers.environment)) {
      return exclude(c.productId, "environment_mismatch");
    }
    if (
      config.hardExclusions.poolTooLong &&
      c.maxPoolLengthFt !== null &&
      answers.pool_length_ft !== null &&
      c.maxPoolLengthFt < answers.pool_length_ft
    ) {
      return exclude(c.productId, "pool_too_long");
    }

    // --- Weighted suitability (each factor 0-1) ---
    const fCleans = cleansCoverage(answers, c);
    const fPower = powerMatch(answers, c);
    const fPrice = priceTierMatch(answers, c);
    const fSize = 1; // already excluded above if too long

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

function exclude(productId: string, reason: string): ProductScore {
  return { productId, score: 0, excluded: true, exclusionReason: reason, breakdown: {} };
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}
