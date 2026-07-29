import type {
  CleaningSurface,
  PoolEnvironment,
  PowerType,
  ProductClass,
} from "@botplanet/shared";

/** Customer answers to the pool questionnaire. */
export interface PoolAnswers {
  environment: PoolEnvironment;
  primary_need: "floor_debris" | "full_clean" | "surface_debris";
  desired_cleans: CleaningSurface[];
  power_pref: PowerType | "no_pref";
  budget_tier: "budget" | "mid" | "premium" | "ultra" | "no_pref";
  pool_length_ft: number | null;
}

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
  environments: PoolEnvironment[];
  cleans: CleaningSurface[];
  powerType: PowerType;
  priceTier: "budget" | "mid" | "premium" | "ultra";
  maxPoolLengthFt: number | null;
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
