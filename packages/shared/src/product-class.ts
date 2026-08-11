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
  /* Grill-cleaning robots. A separate class from everything above for the
     obvious reason and one less obvious one: it is the only machine BotPlanet
     covers that works on a surface food touches, which is why its brush
     material is a hard exclusion rather than a preference. */
  "grill_cleaner", // robotic grill / BBQ grate cleaner
  /* Robot vacuums. The largest category on the site and the last class added.
     Kept distinct from window_cleaner and lawn_mower for the obvious reason,
     and from grill_cleaner because a floor robot must never be offered to
     somebody asking about a barbecue however similar "cleans a surface" looks
     in a database column. */
  "robot_vacuum", // floor vacuum, with or without a mop
  /* Educational and coding robots. The last class of the locked ten, and the
     only one bought to be outgrown: every other robot on this site is judged
     on how well it does a job, this one on whether a child keeps using it. */
  "educational_robot", // coding and STEM robot, kit or pre-built
  /* Robot snow blowers, added 11 August 2026 for the Yarbo, the only consumer
     machine of its kind sold in the US.

     A SEPARATE CLASS FROM lawn_mower DESPITE SHARING A CHASSIS, and that is
     the interesting part rather than an oversight. The Yarbo is a modular yard
     robot: one Core takes a mower module, a snow blower module, a blower or a
     trimmer. The same physical machine is both things depending on what is
     bolted to it — so a database that treated them as one class would let a
     snow blower win a "which mower for my lawn" recommendation on the strength
     of a shared part number.

     What a reader wants cleared in January and what they want cut in June are
     different jobs with different rated areas, different slope limits and,
     when the modules are bought separately, different prices. Two classes. */
  "snow_blower", // autonomous snow blower — clears, does not cut
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
  /* Added 10 August 2026. What happens when the mains power cuts while the
     machine is stuck to a third-floor window is the question that stops people
     buying in this category, and until now nothing recorded the answer.

     TEN OF THE ELEVEN HOLD AND ONE DOES NOT, which is not the split we
     expected and is the reason this is worth recording rather than assuming.
     ECOVACS, HOBOT, HUTT, Mamibot and Cop Rose all ship a UPS or a backup
     battery — 20 to 30 minutes, most with an audible alert. The WINBOT W1 PRO
     lists "power-off protection: Yes" and means a carabiner and a tether: no
     battery, no duration, and a machine that stops holding the moment the
     socket does. That is a rule-out for exterior glass above the ground floor
     and it was invisible. */
  "power_off_hold", // a UPS or backup battery keeps it stuck to the glass in a power cut
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
  /* Added 10 August 2026. The funnel has ALWAYS asked "would you buy the
     manufacturer's own litter refills?", with a hint reading "Rules out the
     sealed-tray systems", and nothing read the answer — there was no value for
     it to land on. A running cost the reader is locked into for the life of
     the machine is exactly the kind of thing this site exists to say out loud,
     and it is the sharpest difference in the category: three of the four boxes
     take ordinary clumping litter from any shop, and the fourth works only
     with the maker's own crystal trays. */
  "any_litter", // takes ordinary litter from any shop, not the maker's own trays
  /* Grill-cleaning robots. Scrubbing is the category, so it is not listed —
     every machine here scrubs and a universal capability cannot discriminate.
     These four do differ, and the first is the category's whole sales pitch. */
  "bristle_free", // no loose wire bristles to end up in food
  "hot_grill_safe", // rated to run on a warm grill, which is when grease shifts
  "grease_removal", // shifts baked-on grease rather than only loose char
  "timer_control", // set a duration and walk away rather than watching it
  /* Robot vacuums. Vacuuming is the category, so it is not listed — every
     machine here vacuums. These five are what actually separate a $200 machine
     from a $1,500 one, and mop_lifting is the one that decides whether a
     vacuum-mop is usable in a house with carpet at all. */
  "mopping", // wet-mops as well as vacuums
  "mop_lifting", // raises the pads over carpet instead of dragging them across it
  "self_emptying", // empties itself into a base rather than a bin you empty
  "obstacle_avoidance", // recognises and avoids cables, socks and worse
  "multi_floor_mapping", // remembers more than one storey
  /* Educational and coding robots. "Teaches coding" is the category, so it is
     not listed — every machine here claims it. These four separate them, and
     the first is the one that decides whether a five-year-old can use it
     without a parent's tablet. */
  "screen_free", // programmed by buttons or cards, no phone or tablet needed
  "block_coding", // Scratch-style drag-and-drop, the usual middle step
  "text_coding", // real Python or JavaScript, where it stops being a toy
  "build_it_yourself", // assembled from parts rather than arriving finished
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
  /* Grill-cleaning robots. The environment is the GRATE, and it is a genuine
     hard exclusion rather than a fit preference: a steel or brass brush run
     across porcelain-coated grates strips the coating, and once it is gone the
     cast iron underneath rusts. That damage is permanent and it is done by
     using the right machine with the wrong brush, so the matcher asks the
     grate first and the config refuses on it. */
  "porcelain_grates", // coated — nylon only, or the coating goes
  "cast_iron_grates", // bare cast iron — takes a harder brush
  "stainless_grates", // stainless steel bars
  /* Robot vacuums. The environment is the FLOOR, and deep pile is the genuine
     exclusion. A vacuum-mop whose pads do not lift will drag a wet pad across
     carpet, and a machine without the clearance and torque for deep pile will
     beach on it. Both are predictable before purchase and neither is fixable
     with a setting, which is what makes this the right axis for the category's
     one hard rule-out. */
  "hard_floors", // wood, tile, laminate, vinyl
  "low_pile_carpet", // ordinary fitted carpet and thin rugs
  "deep_pile_carpet", // deep or shag pile — clearance, torque and wet pads all bite
  /* Educational and coding robots. The environment is the CHILD'S AGE, and it
     is a genuine hard exclusion in both directions — the only axis on the site
     where being too capable is as disqualifying as being not capable enough.
     A button-driven floor robot bores a twelve-year-old within a day. A VEX
     kit defeats a five-year-old and gets abandoned. Neither is fixable, and an
     abandoned robot is the category's actual failure mode rather than a bad
     clean. */
  "age_4_7", // pre-reading — screen-free, physical, no typing
  "age_8_12", // block coding, some building
  "age_13_plus", // text languages and real construction
] as const;
export type Environment = (typeof ENVIRONMENTS)[number];

/** @deprecated Use ENVIRONMENTS — kept so existing imports keep compiling. */
export const POOL_ENVIRONMENTS = ENVIRONMENTS;
/** @deprecated Use Environment. */
export type PoolEnvironment = Environment;

export const POWER_TYPES = ["cordless", "corded", "solar"] as const;
export type PowerType = (typeof POWER_TYPES)[number];
