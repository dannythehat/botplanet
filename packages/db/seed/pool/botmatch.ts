/**
 * BotMatch questionnaire + scoring config seed for pool cleaners (v1, PROVISIONAL).
 *
 * The scoring config is DATA, not code (see packages/scoring for the engine that
 * consumes it). Every recommendation records the questionnaire + config version
 * it used. Commission is intentionally NOT part of any weight — product scoring
 * is structurally isolated from commercial data.
 */
import type { questionnaires, scoringConfigs } from "../../src/schema/botmatch.js";

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
];
