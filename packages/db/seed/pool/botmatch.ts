/**
 * BotMatch questionnaire + scoring config seed for pool cleaners (v1, PROVISIONAL).
 *
 * The scoring config is DATA, not code (see packages/scoring for the engine that
 * consumes it). Every recommendation records the questionnaire + config version
 * it used. Commission is intentionally NOT part of any weight — product scoring
 * is structurally isolated from commercial data.
 */
import type { questionnaires, scoringConfigs } from "../../src/schema/botmatch.js";

/* @extension-point per-category | required | Two arrays in this file, one row
   each per category. scoringConfigRows is the one that matters at runtime —
   without it /api/botmatch returns 501 and the funnel recommends nothing.
   questionnaireRows exists because scoring_configs has a foreign key to it, so
   a config without a questionnaire row is a database that cannot be rebuilt. */
export const questionnaireRows: (typeof questionnaires.$inferInsert)[] = [
  {
    id: "q-pool-v1",
    categoryId: "cat-pool-cleaners",
    version: 1,
    status: "draft",
    schemaJson: {
      version: 1,
      questions: [
        { id: "environment", type: "single", label: "What kind of pool do you have?", options: ["above_ground", "in_ground"] },
        { id: "primary_need", type: "single", label: "What is your main problem?", options: ["floor_debris", "full_clean", "surface_debris"] },
        { id: "desired_cleans", type: "multi", label: "What should it clean?", options: ["floor", "walls", "waterline", "water_surface"] },
        { id: "power_pref", type: "single", label: "Power preference?", options: ["cordless", "corded", "no_pref"] },
        { id: "budget_tier", type: "single", label: "Budget?", options: ["budget", "mid", "premium", "ultra", "no_pref"] },
        { id: "pool_length_ft", type: "number", label: "Longest side of the pool (feet)?" },
      ],
    },
  },

  /* Window and lawn.

     The questions themselves live in code — apps/web/src/content/matcher-
     questions.ts — because they are content that changes with the copy and
     belongs in the repo's review process, not in a database row somebody edits
     without a diff. These rows exist because scoring_configs has a foreign key
     to questionnaires, and because a category with a scoring config and no
     questionnaire row is a database that cannot be rebuilt.

     Added 6 August 2026, when each category stopped sharing the pool set. */
  {
    id: "q-window-v1",
    categoryId: "cat-window-cleaners",
    version: 1,
    status: "draft",
    schemaJson: {
      version: 1,
      source: "apps/web/src/content/matcher-questions.ts",
      set: "WINDOW_QUESTIONS",
    },
  },
  {
    id: "q-lawn-v1",
    categoryId: "cat-lawn-mowers",
    version: 1,
    status: "draft",
    schemaJson: {
      version: 1,
      source: "apps/web/src/content/matcher-questions.ts",
      set: "LAWN_QUESTIONS",
    },
  },
  {
    id: "q-companion-v1",
    categoryId: "cat-companion-robots",
    version: 1,
    status: "draft",
    schemaJson: {
      version: 1,
      source: "apps/web/src/content/matcher-questions.ts",
      set: "COMPANION_QUESTIONS",
    },
  },
  {
    id: "q-petcam-v1",
    categoryId: "cat-pet-camera-robots",
    version: 1,
    status: "draft",
    schemaJson: {
      version: 1,
      source: "apps/web/src/content/matcher-questions.ts",
      set: "PET_CAMERA_QUESTIONS",
    },
  },
  {
    id: "q-litterbox-v1",
    categoryId: "cat-litter-boxes",
    version: 1,
    status: "draft",
    schemaJson: {
      version: 1,
      source: "apps/web/src/content/matcher-questions.ts",
      set: "LITTER_BOX_QUESTIONS",
    },
  },
  {
    id: "q-grill-v1",
    categoryId: "cat-grill-cleaners",
    version: 1,
    status: "draft",
    schemaJson: {
      version: 1,
      source: "apps/web/src/content/matcher-questions.ts",
      set: "GRILL_QUESTIONS",
    },
  },
  {
    id: "q-vacuum-v1",
    categoryId: "cat-robot-vacuums",
    version: 1,
    status: "draft",
    schemaJson: {
      version: 1,
      source: "apps/web/src/content/matcher-questions.ts",
      set: "VACUUM_QUESTIONS",
    },
  },
  {
    id: "q-coding-v1",
    categoryId: "cat-coding-robots",
    version: 1,
    status: "draft",
    schemaJson: {
      version: 1,
      source: "apps/web/src/content/matcher-questions.ts",
      set: "CODING_QUESTIONS",
    },
  },
];

export const scoringConfigRows: (typeof scoringConfigs.$inferInsert)[] = [
  {
    id: "sc-pool-v1",
    questionnaireId: "q-pool-v1",
    version: 1,
    weightsJson: {
      cleansCoverage: 40, // how well the product covers desired surfaces
      power: 20, // matches power preference
      priceTier: 20, // matches budget
      poolSize: 20, // handles the pool length
    },
    hardExclusionsJson: {
      environmentMismatch: true, // exclude products that cannot be used in the customer's environment
      poolTooLong: true, // exclude if maxPoolLengthFt < customer's pool length
    },
    classEligibilityJson: {
      // Which product classes may be candidates given primary_need.
      // A surface skimmer is ONLY eligible when the customer's main problem is surface debris.
      default: ["full_cleaner"],
      byPrimaryNeed: {
        floor_debris: ["full_cleaner"],
        full_clean: ["full_cleaner"],
        surface_debris: ["surface_skimmer"],
      },
    },
    tiebreakTolerancesJson: {
      // Offer-ranking tolerances (used AFTER product selection). Within these,
      // offers are "equivalent" and affiliate value may act as the final tie-break.
      totalPricePctWithin: 1,
      deliveryDaysWithin: 1,
      requireSameWarrantyBand: true,
    },
    status: "draft",
  },

  /* Window-cleaning robots.

     poolSize weight is ZERO, and that is deliberate rather than an oversight.
     No window-robot maker publishes a maximum pane size, so every candidate
     scores the engine's "unknown fit" discount identically — a constant that
     shifts nobody's ranking while diluting the factors that do. Coverage
     carries the most weight because interior, exterior and sloped glass are
     genuinely different capabilities, and sloped is claimed by exactly one
     machine in the catalogue.

     environmentMismatch is on because a robot that needs a frame to find an
     edge cannot work a frameless pane. That is the category's most common
     disappointment and the one hard exclusion worth making. */
  {
    id: "sc-window-v1",
    questionnaireId: "q-window-v1",
    version: 1,
    weightsJson: { cleansCoverage: 45, power: 20, priceTier: 35, poolSize: 0 },
    hardExclusionsJson: { environmentMismatch: true, poolTooLong: false },
    classEligibilityJson: {
      default: ["window_cleaner"],
      byPrimaryNeed: {
        exterior_glass: ["window_cleaner"],
        interior_glass: ["window_cleaner"],
        sloped_glass: ["window_cleaner"],
        all_glass: ["window_cleaner"],
      },
    },
    tiebreakTolerancesJson: {
      totalPricePctWithin: 1,
      deliveryDaysWithin: 1,
      requireSameWarrantyBand: true,
    },
    status: "draft",
  },

  /* Robotic lawn mowers.

     poolSize carries the MOST weight here, inverting the window config, and
     the field is read as area rather than length: a lawn's acreage lands in
     pool_area_sqft and is compared against the mower's rated area. Area is the
     hardest constraint in the category — a machine rated for less ground than
     you have never catches up — so poolTooLong (which gates the area exclusion
     as well as the length one) is on.

     power weight is ZERO because every robot mower runs on a battery, so the
     axis cannot discriminate. The lawn question set does not ask about it, and
     MATCHER_DEFAULTS keeps the engine's power factor neutral rather than
     scoring it zero for everyone.

     environmentMismatch is on for tree cover: a mower that positions itself by
     satellite is defeated by a canopy, and no setting fixes it. */
  {
    id: "sc-lawn-v1",
    questionnaireId: "q-lawn-v1",
    version: 1,
    weightsJson: { cleansCoverage: 30, power: 0, priceTier: 25, poolSize: 45 },
    hardExclusionsJson: { environmentMismatch: true, poolTooLong: true },
    classEligibilityJson: {
      default: ["lawn_mower"],
      byPrimaryNeed: {
        flat_lawn: ["lawn_mower"],
        slopes: ["lawn_mower"],
        multi_zone: ["lawn_mower"],
        slopes_and_zones: ["lawn_mower"],
      },
    },
    tiebreakTolerancesJson: {
      totalPricePctWithin: 1,
      deliveryDaysWithin: 1,
      requireSameWarrantyBand: true,
    },
    status: "draft",
  },

  /* Companion robots.

     environmentMismatch is OFF, and it is the first config on the site to turn
     it off deliberately rather than because the data is thin. Pool has a hard
     exclusion (above-ground vs in-ground), window has one (frameless glass),
     lawn has one (tree cover). Companion robots genuinely do not: nothing
     about a room stops a robot pet working. Inventing an environment axis to
     fill the field would mean excluding candidates on a distinction that does
     not exist, which is worse than having no exclusion at all.

     poolSize weight is ZERO for the same honesty reason as window — there is
     no size axis in this category and no maker publishes one.

     cleansCoverage carries the most weight because the capability list here
     is doing the real work. Companionship, conversation, play and learning
     content are genuinely separable — a Qoobo has companionship and no
     conversation at all, a desk robot converses and never moves — and the
     class gate plus this weighting is what stops a child's learning robot
     winning a recommendation made for someone with dementia. */
  {
    id: "sc-companion-v1",
    questionnaireId: "q-companion-v1",
    version: 1,
    weightsJson: { cleansCoverage: 60, power: 0, priceTier: 40, poolSize: 0 },
    hardExclusionsJson: { environmentMismatch: false, poolTooLong: false },
    classEligibilityJson: {
      /* A pet camera robot is NEVER eligible here, and vice versa. The two
         categories are separate on measured SERP evidence, and the class gate
         is what keeps that ruling true at runtime rather than only in a
         document somebody can edit. */
      default: ["companion_robot"],
      byPrimaryNeed: {
        adult_company: ["companion_robot"],
        child: ["companion_robot"],
        older_adult: ["companion_robot"],
        household: ["companion_robot"],
      },
    },
    tiebreakTolerancesJson: {
      totalPricePctWithin: 1,
      deliveryDaysWithin: 1,
      requireSameWarrantyBand: true,
    },
    status: "draft",
  },

  /* Pet camera robots.

     environmentMismatch is ON, and it is the whole point of this config.
     Every roaming pet camera on the US market is wheeled and none of them
     climbs stairs, so a multi-storey household where the pet lives on the
     other floor is a household the product cannot serve. That is as absolute
     as frameless glass or a tree canopy, and it is the most common reason one
     of these disappoints — so the engine refuses rather than recommends.

     poolSize is zero: no maker publishes a coverage area for these, and a
     patrol-time figure is not a size. power is zero: they all dock. */
  {
    id: "sc-petcam-v1",
    questionnaireId: "q-petcam-v1",
    version: 1,
    weightsJson: { cleansCoverage: 55, power: 0, priceTier: 45, poolSize: 0 },
    hardExclusionsJson: { environmentMismatch: true, poolTooLong: false },
    classEligibilityJson: {
      default: ["pet_camera_robot"],
      byPrimaryNeed: {
        watch_dog: ["pet_camera_robot"],
        watch_cat: ["pet_camera_robot"],
        interact: ["pet_camera_robot"],
        watch_home: ["pet_camera_robot"],
      },
    },
    tiebreakTolerancesJson: {
      totalPricePctWithin: 1,
      deliveryDaysWithin: 1,
      requireSameWarrantyBand: true,
    },
    status: "draft",
  },

  /* Self-cleaning litter boxes.

     environmentMismatch is ON, and here the "environment" is the CAT rather
     than the room. It is the only hard exclusion in the category and the only
     one on the whole site that exists for safety rather than for fit: these
     machines find their occupant by weight, and a kitten below the sensor
     minimum may not register at all. A machine that does not list `kitten`
     among its environments is refused for a kitten household rather than
     ranked lower, and the funnel is expected to return nothing at all for
     some of those readers. "Use an ordinary tray until it has grown" is the
     correct recommendation, and no recommendation is closer to it than a
     wrong one.

     Chamber size rides the same axis: a machine a large cat cannot turn
     around in does not list `large_cat`, and is excluded rather than
     discounted, because a cat that will not use a box has not been sold a
     compromise — it has been sold nothing.

     poolSize and power are both ZERO. There is no size axis a maker publishes
     and every machine plugs into the wall, so neither can discriminate.

     priceTier carries an unusually high 45. In this category the sticker
     price is genuinely misleading — a cheap box that only takes the maker's
     own refill trays costs more over three years than an expensive one that
     takes supermarket litter — so budget fit is weighted close to capability
     rather than treated as a tiebreak. */
  {
    id: "sc-litterbox-v1",
    questionnaireId: "q-litterbox-v1",
    version: 1,
    weightsJson: { cleansCoverage: 55, power: 0, priceTier: 45, poolSize: 0 },
    hardExclusionsJson: { environmentMismatch: true, poolTooLong: false },
    classEligibilityJson: {
      default: ["litter_box"],
      byPrimaryNeed: {
        single_cat: ["litter_box"],
        two_cats: ["litter_box"],
        many_cats: ["litter_box"],
      },
    },
    tiebreakTolerancesJson: {
      totalPricePctWithin: 1,
      deliveryDaysWithin: 1,
      requireSameWarrantyBand: true,
    },
    status: "draft",
  },

  /* Grill-cleaning robots.

     environmentMismatch is ON and the environment is the GRATE. Brass or steel
     brushes across porcelain-coated grates strip the enamel, and the bare cast
     iron underneath then rusts — permanent damage caused by the right machine
     carrying the wrong head. A product whose brush material does not suit the
     reader's grate is refused rather than discounted, because "mostly right"
     here means a new set of grates.

     priceTier is the highest weight on the site at 50, and that is a
     deliberate statement about a one-product category. There is very little to
     choose between machines on capability, so what the matcher can usefully do
     is tell somebody whether the spend fits what they actually need — which
     for an infrequent cook is often "it does not, buy a brush".

     poolSize and power are zero: no maker publishes a grate-area rating, and
     every machine is battery-powered. */
  {
    id: "sc-grill-v1",
    questionnaireId: "q-grill-v1",
    version: 1,
    weightsJson: { cleansCoverage: 50, power: 0, priceTier: 50, poolSize: 0 },
    hardExclusionsJson: { environmentMismatch: true, poolTooLong: false },
    classEligibilityJson: {
      default: ["grill_cleaner"],
      byPrimaryNeed: {
        avoidance: ["grill_cleaner"],
        grease: ["grill_cleaner"],
        bristle_safety: ["grill_cleaner"],
        convenience: ["grill_cleaner"],
      },
    },
    tiebreakTolerancesJson: {
      totalPricePctWithin: 1,
      deliveryDaysWithin: 1,
      requireSameWarrantyBand: true,
    },
    status: "draft",
  },

  /* Robot vacuums and mops.

     environmentMismatch is ON and the environment is the FLOOR. A vacuum-mop
     whose pads do not lift is refused for a carpeted house rather than ranked
     lower, because "mostly suitable" there means a wet pad dragged across a
     rug on a schedule. Deep pile is the same ruling for a different reason:
     clearance and torque decide whether the machine cleans or beaches.

     cleansCoverage carries 55 because the capability list is doing real work
     in this category — mopping, mop lifting, self-emptying, obstacle avoidance
     and multi-floor mapping are genuinely separable and they are most of what
     separates a $250 machine from a $1,000 one. Suction, which is the number
     every listing leads with, is not modelled at all: above a modest threshold
     it does not discriminate, and pretending otherwise would let a spec-sheet
     figure outrank the things that decide satisfaction.

     poolSize and power are zero. Makers publish a coverage area but it assumes
     hard floor and one storey, which makes it closer to marketing than a
     constraint; and every machine charges from a base. */
  {
    id: "sc-vacuum-v1",
    questionnaireId: "q-vacuum-v1",
    version: 1,
    weightsJson: { cleansCoverage: 55, power: 0, priceTier: 45, poolSize: 0 },
    hardExclusionsJson: { environmentMismatch: true, poolTooLong: false },
    classEligibilityJson: {
      default: ["robot_vacuum"],
      byPrimaryNeed: {
        pet_hair: ["robot_vacuum"],
        long_hair: ["robot_vacuum"],
        general: ["robot_vacuum"],
      },
    },
    tiebreakTolerancesJson: {
      totalPricePctWithin: 1,
      deliveryDaysWithin: 1,
      requireSameWarrantyBand: true,
    },
    status: "draft",
  },

  /* Educational and coding robots. The last of the ten.

     environmentMismatch is ON and the environment is the CHILD'S AGE. It is
     the only exclusion on this site that cuts in both directions: a
     build-it-yourself kit is refused for a five-year-old exactly as firmly as
     a button-driven floor robot is refused for a teenager. Every other
     category's exclusion protects against a machine that cannot do the job.
     This one also protects against a machine that is too much, because an
     abandoned robot is this category's failure and it is caused as often by
     buying up as by buying down.

     cleansCoverage carries 60, the highest on the site, because the
     capability list here IS the product: screen-free, block coding, text
     coding and build-it-yourself are what separate these machines, and they
     map almost directly onto the age band. Price is a weaker signal than
     usual — the cheapest robot is genuinely the right answer for a large
     share of buyers, so a high price weight would actively mislead.

     poolSize and power are zero: there is no size axis and they all take
     batteries or a USB cable. */
  {
    id: "sc-coding-v1",
    questionnaireId: "q-coding-v1",
    version: 1,
    weightsJson: { cleansCoverage: 60, power: 0, priceTier: 40, poolSize: 0 },
    hardExclusionsJson: { environmentMismatch: true, poolTooLong: false },
    classEligibilityJson: {
      default: ["educational_robot"],
      byPrimaryNeed: {
        first_steps: ["educational_robot"],
        progression: ["educational_robot"],
        building: ["educational_robot"],
        screen_free_play: ["educational_robot"],
      },
    },
    tiebreakTolerancesJson: {
      totalPricePctWithin: 1,
      deliveryDaysWithin: 1,
      requireSameWarrantyBand: true,
    },
    status: "draft",
  },
];
