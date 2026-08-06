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
];
