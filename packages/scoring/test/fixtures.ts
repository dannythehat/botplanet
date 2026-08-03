import type { ScoringConfig, SuitabilityCandidate } from "../src/types.js";

/** Mirrors the seed scoring config sc-pool-v1. */
export const POOL_CONFIG_V1: ScoringConfig = {
  version: 1,
  weights: { cleansCoverage: 40, power: 20, priceTier: 20, poolSize: 20 },
  hardExclusions: { environmentMismatch: true, poolTooLong: true },
  classEligibility: {
    default: ["full_cleaner"],
    byPrimaryNeed: {
      floor_debris: ["full_cleaner"],
      full_clean: ["full_cleaner"],
      surface_debris: ["surface_skimmer"],
    },
  },
  tiebreakTolerances: {
    totalPricePctWithin: 1,
    deliveryDaysWithin: 1,
    requireSameWarrantyBand: true,
  },
};

/** Mirrors a representative subset of the pool seed catalogue. */
export const CANDIDATES: SuitabilityCandidate[] = [
  {
    productId: "prod-dolphin-nautilus-cc-plus",
    productClass: "full_cleaner",
    environments: ["in_ground"],
    cleans: ["floor", "walls", "waterline"],
    powerType: "corded",
    priceTier: "mid",
    maxPoolLengthFt: 50,
    // Not published for any fixture; the scorer treats that as unknown, not unfit.
    maxPoolAreaSqFt: null,
  },
  {
    productId: "prod-aiper-scuba-x1",
    productClass: "full_cleaner",
    environments: ["in_ground"],
    cleans: ["floor", "walls", "waterline"],
    powerType: "cordless",
    priceTier: "premium",
    maxPoolLengthFt: null,
    // Not published for any fixture; the scorer treats that as unknown, not unfit.
    maxPoolAreaSqFt: null,
  },
  {
    productId: "prod-aiper-seagull-se",
    productClass: "full_cleaner",
    environments: ["above_ground"],
    cleans: ["floor"],
    powerType: "cordless",
    priceTier: "budget",
    maxPoolLengthFt: null,
    // Not published for any fixture; the scorer treats that as unknown, not unfit.
    maxPoolAreaSqFt: null,
  },
  {
    productId: "prod-polaris-freedom",
    productClass: "full_cleaner",
    environments: ["in_ground"],
    cleans: ["floor", "walls", "waterline"],
    powerType: "cordless",
    priceTier: "premium",
    maxPoolLengthFt: 50,
    // Not published for any fixture; the scorer treats that as unknown, not unfit.
    maxPoolAreaSqFt: null,
  },
  {
    productId: "prod-betta-se-plus",
    productClass: "surface_skimmer",
    environments: ["above_ground", "in_ground"],
    cleans: ["water_surface"],
    powerType: "solar",
    priceTier: "budget",
    maxPoolLengthFt: null,
    // Not published for any fixture; the scorer treats that as unknown, not unfit.
    maxPoolAreaSqFt: null,
  },
];
