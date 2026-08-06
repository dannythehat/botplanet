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
  /* Companion robots and pet-camera robots are TWO classes, not one, and the
     split is the whole reason they are two pages. The research of 6 August
     2026 measured their SERPs sharing only Amazon, Reddit and YouTube — the
     three domains that appear on nearly every query in the space — and no
     publisher, manufacturer or retailer in common at all.

     The class gate is what stops that ruling being undone quietly later. A
     desk companion has no camera and cannot be recommended to somebody who
     asked to watch their dog; a roaming pet camera has no personality and
     must not win a "keep me company" recommendation because it happens to be
     cheaper. */
  "companion_robot", // robot pet or desk companion — company, not a chore
  "pet_camera_robot", // roaming indoor camera on wheels — watching, not company
  /* Self-cleaning litter boxes. A separate class from the pet-camera robots
     above despite both being sold to cat owners: one sifts waste and never
     moves, the other drives around and has no waste function at all. Nothing
     in either catalogue should ever be able to win the other's
     recommendation. */
  "litter_box", // self-cleaning / automatic cat litter box
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
  /* Companion robots. The list's name is wrong for these too — nothing here
     cleans anything — but the column stores "things the customer can ask for
     and the product either does or does not", which is exactly what these are.
     Renaming the column across four categories is not worth the churn; saying
     so plainly here is.
     These four are genuinely separable. A Qoobo has companionship and no
     conversation at all. An EMO converses and never leaves the desk. Miko
     teaches. Treating them as one "is a companion" flag would let any of them
     win any of the others' recommendations. */
  "companionship", // presence and personality — the reason to own one
  "conversation", // holds a spoken exchange, not just voice commands
  "play_interaction", // responds physically — moves, plays, reacts to touch
  "learning_content", // structured educational material, mostly for children
  /* Pet-camera robots. Kept separate from the companion capabilities above so
     the two classes cannot be described in each other's words. */
  "remote_video", // live video you can watch from your phone
  "two_way_audio", // talk to the room and hear it back
  "treat_dispensing", // throws or drops treats on command
  "roams_home", // drives itself around rather than sitting in one place
  /* Self-cleaning litter boxes. Every machine in the category scoops — that is
     the category — so scooping is not listed here: a capability every product
     has cannot discriminate between them and would score identically for all.
     These four genuinely differ machine to machine. */
  "odor_sealing", // sealed waste drawer or carbon filtration, not just a lid
  "health_monitoring", // logs weight and visit frequency — the vet-useful one
  "multi_cat_capacity", // rated for more than one cat rather than merely tolerating it
  "app_control", // phone app and notifications rather than a panel of buttons
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
  /* Pet-camera robots. The make-or-break here is stairs, and it is as absolute
     as frameless glass or a tree canopy: every roaming pet camera on the US
     market is a wheeled machine, and none of them climbs. In a house with
     bedrooms upstairs the robot patrols whichever floor you leave it on and
     nothing else — which is fine if you know it, and the most common
     disappointment if you do not.

     Companion robots do not use this axis. Nothing about a room rules out a
     robot pet, so the companion scoring config turns the environment exclusion
     off rather than inventing a distinction to fill the field. */
  "single_storey", // one floor, or one floor you care about — a wheeled robot covers it
  "multi_storey", // stairs between the rooms that matter — it does not
  /* Self-cleaning litter boxes. The environment here is the CAT, not the room,
     and it is the category's genuine hard exclusion — the one where getting it
     wrong is a safety question rather than a disappointment.
     These machines detect their occupant by weight and start a cycle once the
     cat leaves. A kitten under the sensor's threshold may not register at all.
     A large cat may register perfectly and still not physically fit the
     chamber. Both are real, both rule specific machines out, and neither is
     fixable with a setting — which is why the matcher asks about it second and
     the scoring config excludes on it. */
  "kitten", // under the weight a sensor reliably detects
  "average_cat", // the size every machine in the category is designed around
  "large_cat", // Maine Coon and up — chamber size, not sensor, is the limit
] as const;
export type Environment = (typeof ENVIRONMENTS)[number];

/** @deprecated Use ENVIRONMENTS — kept so existing imports keep compiling. */
export const POOL_ENVIRONMENTS = ENVIRONMENTS;
/** @deprecated Use Environment. */
export type PoolEnvironment = Environment;

export const POWER_TYPES = ["cordless", "corded", "solar"] as const;
export type PowerType = (typeof POWER_TYPES)[number];
