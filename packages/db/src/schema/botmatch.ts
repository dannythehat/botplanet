import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { categories } from "./reference";

/** A versioned questionnaire for a category. */
export const questionnaires = sqliteTable("questionnaires", {
  id: text("id").primaryKey(),
  categoryId: text("category_id")
    .notNull()
    .references(() => categories.id),
  version: integer("version").notNull(),
  status: text("status").notNull().default("draft"), // draft | published | retired
  schemaJson: text("schema_json", { mode: "json" }).$type<unknown>().notNull(),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
});

/**
 * A versioned scoring configuration. Weights, hard exclusions, class eligibility
 * and offer tie-break tolerances are data, not code — every recommendation
 * records the config version it used (see recommendations table) for audit.
 */
export const scoringConfigs = sqliteTable("scoring_configs", {
  id: text("id").primaryKey(),
  questionnaireId: text("questionnaire_id")
    .notNull()
    .references(() => questionnaires.id),
  version: integer("version").notNull(),
  weightsJson: text("weights_json", { mode: "json" }).$type<unknown>().notNull(),
  hardExclusionsJson: text("hard_exclusions_json", { mode: "json" }).$type<unknown>().notNull(),
  classEligibilityJson: text("class_eligibility_json", { mode: "json" }).$type<unknown>().notNull(),
  tiebreakTolerancesJson: text("tiebreak_tolerances_json", { mode: "json" }).$type<unknown>().notNull(),
  status: text("status").notNull().default("draft"),
  publishedAt: integer("published_at", { mode: "timestamp" }),
});
