/**
 * Product classes.
 *
 * A "surface_skimmer" (e.g. Betta SE Plus) is a DIFFERENT class from a full
 * floor/wall/waterline cleaner. BotMatch must never let a surface skimmer win a
 * normal full-cleaner recommendation just because it is cheaper or solar-powered.
 * See packages/scoring for how class eligibility gates candidate scoring.
 *
 * THIS FILE WAS POOL-ONLY UNTIL 5 AUGUST 2026. Every vocabulary below described
 * swimming pools, because pool was the only category. Adding window-cleaning
 * robots made that visible: a window robot cannot be described with
 * floor/walls/waterline and above_ground/in_ground without lying about it, and
 * a catalogue row that lies is worse than no row.
 *
 * The vocabularies are therefore shared across categories, with the class gate
 * doing the separating. A window robot can never win a pool recommendation for
 * the same reason a surface skimmer cannot: its class is not in the pool
 * matcher's eligible list.
 */
/* @extension-point shared-vocab | required | Four vocabularies live in this
   file — PRODUCT_CLASSES, CLEANING_SURFACES, ENVIRONMENTS and POWER_TYPES —
   and a new category almost always needs values in the first three BEFORE
   anything else is built. A product that cannot be described honestly gets
   described dishonestly: window robots were nearly typed as pool cleaners on
   floors, and a catalogue row that lies is worse than no row.
   PRODUCT_CLASSES is also the gate that stops one category's robots winning
   another category's recommendation. */
export const PRODUCT_CLASSES = [
  "full_cleaner", // floor / walls / waterline robotic pool cleaner
  "surface_skimmer", // floating-debris skimmer (distinct class)
  "pressure_side", // pressure-side cleaner (booster-pump)
  "suction_side", // suction-side cleaner
  "window_cleaner", // glass-climbing window robot — NOT a pool machine
  "lawn_mower", // robotic lawn mower — not a cleaner of anything
] as const;

export type ProductClass = (typeof PRODUCT_CLASSES)[number];

/**
 * Cleaning coverage a product provides.
 *
 * Pool surfaces and glass surfaces sit in one list because one column stores
 * them. They never collide in practice: a matcher only offers surfaces its own
 * category uses, and the class gate refuses the rest.
 */
export const CLEANING_SURFACES = [
  // Pool
  "floor",
  "walls",
  "waterline",
  "water_surface",
  // Glass. Interior and exterior are genuinely different capabilities — a
  // machine safe on an inside pane is not automatically trusted three storeys
  // up — and sloped glass (skylights, conservatories) is a third claim again.
  "glass_interior",
  "glass_exterior",
  "glass_sloped",
  // Lawn. A mower cleans nothing, so the name of this list is wrong for it —
  // what the column really holds is "capabilities the customer can ask for and
  // the product either has or has not". Renaming the list would touch a stored
  // D1 column across three categories, so the honest move is to say so here
  // rather than to leave a reader wondering why a mower has a cleaning surface.
  "grass_flat", // ordinary level lawn — every mower does this
  "grass_slopes", // banks and inclines past a gentle grade
  "grass_zones", // separate lawns the machine reaches on its own
] as const;
export type CleaningSurface = (typeof CLEANING_SURFACES)[number];

/**
 * Where a product can be used.
 *
 * Named ENVIRONMENTS rather than POOL_ENVIRONMENTS since 5 August 2026. The
 * old name is kept as an alias so nothing that imported it breaks, and because
 * renaming a symbol is not worth a broken build.
 *
 * For glass, the environment is the thing that most often rules a machine out:
 * a robot that needs a frame to find an edge simply cannot work a frameless
 * pane, and that is the single most common disappointment in the category.
 */
export const ENVIRONMENTS = [
  // Pool
  "above_ground",
  "in_ground",
  // Glass
  "framed_glass",
  "frameless_glass",
  // Lawn. The equivalent make-or-break is not the shape of the garden, it is
  // whether the machine can see the sky. A mower that positions itself by
  // satellite is defeated by a canopy of mature trees, and no setting fixes
  // it; a boundary wire, LiDAR or camera system does not care. So the
  // environment axis for lawn is overhead cover, and it is a hard exclusion
  // for the same reason frameless glass is.
  "open_sky", // clear view overhead — satellite positioning works
  "tree_cover", // canopy or a tall building nearby — it does not
] as const;
export type Environment = (typeof ENVIRONMENTS)[number];

/** @deprecated Use ENVIRONMENTS — kept so existing imports keep compiling. */
export const POOL_ENVIRONMENTS = ENVIRONMENTS;
/** @deprecated Use Environment. */
export type PoolEnvironment = Environment;

export const POWER_TYPES = ["cordless", "corded", "solar"] as const;
export type PowerType = (typeof POWER_TYPES)[number];
