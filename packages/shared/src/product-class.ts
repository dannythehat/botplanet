/**
 * Product classes.
 *
 * A "surface_skimmer" (e.g. Betta SE Plus) is a DIFFERENT class from a full
 * floor/wall/waterline cleaner. BotMatch must never let a surface skimmer win a
 * normal full-cleaner recommendation just because it is cheaper or solar-powered.
 * See packages/scoring for how class eligibility gates candidate scoring.
 */
export const PRODUCT_CLASSES = [
  "full_cleaner", // floor / walls / waterline robotic cleaner
  "surface_skimmer", // floating-debris skimmer (distinct class)
  "pressure_side", // pressure-side cleaner (booster-pump)
  "suction_side", // suction-side cleaner
] as const;

export type ProductClass = (typeof PRODUCT_CLASSES)[number];

/** Cleaning coverage a product provides. */
export const CLEANING_SURFACES = [
  "floor",
  "walls",
  "waterline",
  "water_surface",
] as const;
export type CleaningSurface = (typeof CLEANING_SURFACES)[number];

/** Where a product can be used. */
export const POOL_ENVIRONMENTS = ["above_ground", "in_ground"] as const;
export type PoolEnvironment = (typeof POOL_ENVIRONMENTS)[number];

export const POWER_TYPES = ["cordless", "corded", "solar"] as const;
export type PowerType = (typeof POWER_TYPES)[number];
