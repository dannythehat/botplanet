import { sql } from "drizzle-orm";
import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { products } from "./catalogue";
import { offers } from "./commercial";
import { categories, markets } from "./reference";

/**
 * A BotMatch recommendation record — the audit spine. Stores inputs, the config
 * versions used, the chosen product AND offer separately, and the explanation.
 * The token encodes market + locale so a shared /recommendation/:token link
 * always renders in the market it was generated for.
 */
export const recommendations = sqliteTable("recommendations", {
  id: text("id").primaryKey(),
  secureToken: text("secure_token").notNull().unique(),
  marketId: text("market_id")
    .notNull()
    .references(() => markets.id),
  locale: text("locale").notNull(),
  questionnaireVersion: integer("questionnaire_version").notNull(),
  scoringConfigVersion: integer("scoring_config_version").notNull(),
  inputsJson: text("inputs_json", { mode: "json" }).$type<unknown>().notNull(),
  chosenProductId: text("chosen_product_id").references(() => products.id),
  chosenOfferId: text("chosen_offer_id").references(() => offers.id),
  explanationJson: text("explanation_json", { mode: "json" }).$type<unknown>(),
  email: text("email"), // nullable; PII — see retention policy
  consentJson: text("consent_json", { mode: "json" }).$type<unknown>(),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
  expiresAt: integer("expires_at", { mode: "timestamp" }),
});

/** Per-candidate audit trail — proves what each product scored and why. */
export const recommendationScores = sqliteTable("recommendation_scores", {
  id: text("id").primaryKey(),
  recommendationId: text("recommendation_id")
    .notNull()
    .references(() => recommendations.id),
  productId: text("product_id")
    .notNull()
    .references(() => products.id),
  suitabilityScore: integer("suitability_score").notNull(),
  breakdownJson: text("breakdown_json", { mode: "json" }).$type<unknown>(),
  excluded: integer("excluded", { mode: "boolean" }).notNull().default(false),
  exclusionReason: text("exclusion_reason"),
}, (t) => ({ byRecommendation: index("rs_reco_idx").on(t.recommendationId) }));

/** Commercial-robot lead-gen funnel (quote / demo / leasing / site assessment). */
export const leads = sqliteTable("leads", {
  id: text("id").primaryKey(),
  categoryId: text("category_id").references(() => categories.id),
  productId: text("product_id").references(() => products.id),
  marketId: text("market_id")
    .notNull()
    .references(() => markets.id),
  type: text("type").notNull(), // quote | demo | leasing | site_assessment
  contactJson: text("contact_json", { mode: "json" }).$type<unknown>(),
  status: text("status").notNull().default("new"),
  routedTo: text("routed_to"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
});

/** Generic audit log — offer pauses, config publishes, manual overrides, etc. */
export const auditLog = sqliteTable("audit_log", {
  id: text("id").primaryKey(),
  entity: text("entity").notNull(),
  entityId: text("entity_id").notNull(),
  action: text("action").notNull(),
  actor: text("actor").notNull(),
  beforeJson: text("before_json", { mode: "json" }).$type<unknown>(),
  afterJson: text("after_json", { mode: "json" }).$type<unknown>(),
  at: integer("at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
});
