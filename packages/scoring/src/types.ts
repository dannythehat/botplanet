import type {
  CleaningSurface,
  Environment,
  PowerType,
  ProductClass,
} from "@botplanet/shared";

/**
 * Customer answers to a BotMatch questionnaire.
 *
 * ONE SHAPE, MANY CATEGORIES. Every category has its own questions — see
 * apps/web/src/content/matcher-questions.ts, where the sets are independent by
 * rule — but they all fold down to these axes, because these are the axes the
 * deterministic scorer knows how to weigh.
 *
 * `primary_need` is a plain string rather than the pool union it was until
 * 6 August 2026. It is a key into the config's `classEligibility.byPrimaryNeed`
 * map, and every category names its own needs: a pool reader picks
 * "full_clean", a window reader picks "exterior_glass", a lawn reader picks
 * "large_lawn". Typing it as the pool values made it impossible to add a
 * category without editing the engine.
 *
 * The two size fields keep their pool names because they are stored D1 columns
 * and a rename is a migration, not an edit. They are read generically:
 * `pool_area_sqft` is the field a lawn reader's acreage lands in, and it is
 * compared against the mower's rated area. Worth renaming when something else
 * forces a migration on those columns.
 */
export interface MatchAnswers {
  /**
   * Where the product has to work. OPTIONAL since 6 August 2026, because a
   * category may genuinely have no environment axis: companion robots are the
   * first, and nothing about a room stops a robot pet working. Inventing a
   * distinction to fill this field would exclude candidates on something that
   * does not exist.
   *
   * Only read when the category's config sets hardExclusions.environmentMismatch.
   * A config that sets it while its questionnaire asks no environment question
   * is a misconfiguration, and the scorer says so rather than silently
   * excluding the whole catalogue.
   */
  environment?: Environment;
  primary_need: string;
  desired_cleans: CleaningSurface[];
  power_pref: PowerType | "no_pref";
  budget_tier: "budget" | "mid" | "premium" | "ultra" | "no_pref";
  /** Longest run, where a maker publishes a length. Lawn never uses this. */
  pool_length_ft: number | null;
  /** Area, where the reader gives one instead. Lawn always uses this. */
  pool_area_sqft?: number | null;
}

/** @deprecated Use MatchAnswers — kept so existing imports keep compiling. */
export type PoolAnswers = MatchAnswers;

/**
 * A product as seen by the SUITABILITY scorer.
 *
 * IMPORTANT: this type contains ONLY non-commercial attributes. There is no
 * price, no offer, no retailer and no commission field — by construction, the
 * product scorer cannot receive commercial data, so commission can never
 * influence which product is recommended. This is the core editorial-integrity
 * guarantee, enforced at the type level.
 */
export interface SuitabilityCandidate {
  productId: string;
  productClass: ProductClass;
  environments: Environment[];
  cleans: CleaningSurface[];
  powerType: PowerType;
  priceTier: "budget" | "mid" | "premium" | "ultra";
  /**
   * Maximum pool length and maximum surface area, each null when the maker does
   * not publish it. BOTH are here because manufacturers do not agree on which
   * to state: Aiper publishes an area for the Scuba V3 and no length at all,
   * while Maytronics publishes a length. Carrying only length would force one of
   * two bad choices — invent a length, or let the product be judged on nothing.
   */
  maxPoolLengthFt: number | null;
  maxPoolAreaSqFt: number | null;
}

export interface ScoringWeights {
  cleansCoverage: number;
  power: number;
  priceTier: number;
  poolSize: number;
}

export interface OfferTolerances {
  totalPricePctWithin: number;
  deliveryDaysWithin: number;
  requireSameWarrantyBand: boolean;
}

export interface ScoringConfig {
  version: number;
  weights: ScoringWeights;
  hardExclusions: {
    environmentMismatch: boolean;
    poolTooLong: boolean;
  };
  classEligibility: {
    default: ProductClass[];
    byPrimaryNeed: Record<string, ProductClass[]>;
  };
  tiebreakTolerances: OfferTolerances;
}

export interface ProductScore {
  productId: string;
  score: number; // 0-100
  excluded: boolean;
  exclusionReason: string | null;
  breakdown: Record<string, number>;
}

export interface ProductScoringResult {
  configVersion: number;
  eligibleClasses: ProductClass[];
  ranked: ProductScore[]; // best first; excluded products last with score 0
}

/**
 * A product's offer as seen by the OFFER ranker. This is the ONLY place a
 * commission value is allowed to exist, and it is used solely as a final
 * tie-break between offers already judged equivalent on customer-relevant terms.
 */
export interface OfferCandidate {
  offerId: string;
  productId: string;
  totalPriceMinor: number | null;
  deliveryMaxDays: number | null;
  warrantyBand: number | null; // higher = stronger; null = unknown
  approved: boolean;
  freshnessRank: number; // live=2, recently_verified=1, indicative=0
  /** PRIVATE. Final tie-break only. Never surfaced to the client. */
  commissionValueBp: number | null;
}

export interface OfferRankingResult {
  productId: string;
  winner: OfferCandidate | null;
  ranked: OfferCandidate[];
  /**
   * True whenever commission materially decided the winner among equivalents —
   * including when the commission-winning offer was already first under the
   * deterministic customer-value ordering. False when no commission difference
   * existed among the equivalents (or there was only one candidate).
   */
  tieBreakUsed: boolean;
  /** Audit: offerIds judged equivalent to the pre-tie-break leader (includes it). */
  equivalents: string[];
  /** Audit: the tolerances under which `equivalents` were judged equivalent. */
  equivalenceBasis: OfferTolerances | null;
}
