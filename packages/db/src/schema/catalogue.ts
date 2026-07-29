import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import type {
  CleaningSurface,
  PoolEnvironment,
  PowerType,
  ProductClass,
} from "@botplanet/shared";
import { categories, markets } from "./reference";

/** Brands / manufacturers (global). */
export const brands = sqliteTable("brands", {
  id: text("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  maker: text("maker"), // e.g. "Maytronics" for Dolphin
  /** Whether the brand runs its own consumer affiliate programme (else retailer-only). */
  hasDirectAffiliate: integer("has_direct_affiliate", { mode: "boolean" }),
  notes: text("notes"),
});

/**
 * Products are GLOBAL, price-free records. Scoring-relevant attributes are
 * explicit columns; everything else lives in `specsJson`.
 */
export const products = sqliteTable("products", {
  id: text("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  brandId: text("brand_id")
    .notNull()
    .references(() => brands.id),
  categoryId: text("category_id")
    .notNull()
    .references(() => categories.id),
  productClass: text("product_class").$type<ProductClass>().notNull(),
  name: text("name").notNull(),
  model: text("model"),

  // --- BotMatch scoring attributes (structured) ---
  environments: text("environments", { mode: "json" })
    .$type<PoolEnvironment[]>()
    .notNull(),
  cleans: text("cleans", { mode: "json" }).$type<CleaningSurface[]>().notNull(),
  powerType: text("power_type").$type<PowerType>().notNull(),
  priceTier: text("price_tier").notNull(), // budget | mid | premium | ultra
  maxPoolLengthFt: integer("max_pool_length_ft"),

  specsJson: text("specs_json", { mode: "json" }).$type<Record<string, unknown>>(),

  /** draft | published | proposed (proposed = pending human confirmation). */
  status: text("status").notNull().default("draft"),
  primaryMediaId: text("primary_media_id"), // FK added when media exists (no images at seed time)
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
});

/** Which markets a global product is offered in. */
export const productMarketAvailability = sqliteTable(
  "product_market_availability",
  {
    id: text("id").primaryKey(),
    productId: text("product_id")
      .notNull()
      .references(() => products.id),
    marketId: text("market_id")
      .notNull()
      .references(() => markets.id),
    availabilityStatus: text("availability_status").notNull(), // available | unavailable | discontinued
    marketVariantModel: text("market_variant_model"),
  },
);

/**
 * Evidence backing product claims. Drives the on-page evidence label.
 * `supportsTestedClaim` on media (see media table) is what actually gates a
 * "BotPlanet Tested" badge; this table records the claim + source.
 */
export const evidence = sqliteTable("evidence", {
  id: text("id").primaryKey(),
  productId: text("product_id").references(() => products.id),
  claim: text("claim").notNull(),
  evidenceLevel: text("evidence_level").notNull(), // see EVIDENCE_LEVELS
  sourceUrl: text("source_url"),
  attribution: text("attribution"),
  verificationStatus: text("verification_status").notNull().default("provisional"),
  capturedAt: integer("captured_at", { mode: "timestamp" }),
});

/**
 * Media library metadata. IMPORTANT: no rows with real image URLs are added at
 * seed time — rights are unconfirmed. The table exists so the schema is ready.
 * A withdrawal flips `status` and pulls the asset everywhere it is referenced.
 */
export const media = sqliteTable("media", {
  id: text("id").primaryKey(),
  r2Key: text("r2_key"),
  mediaType: text("media_type").notNull(),
  sourceType: text("source_type").notNull(), // manufacturer | affiliate_network | original_botplanet | licensed_stock | ai_generated | ugc
  rightsBasis: text("rights_basis"),
  usageScopeJson: text("usage_scope_json", { mode: "json" }).$type<string[]>(),
  marketRestrictions: text("market_restrictions", { mode: "json" }).$type<string[]>(),
  isAiGenerated: integer("is_ai_generated", { mode: "boolean" }).notNull().default(false),
  isOriginalBotplanet: integer("is_original_botplanet", { mode: "boolean" })
    .notNull()
    .default(false),
  /** Only original BotPlanet evidence media may ever set this true. */
  supportsTestedClaim: integer("supports_tested_claim", { mode: "boolean" })
    .notNull()
    .default(false),
  evidenceId: text("evidence_id").references(() => evidence.id),
  productId: text("product_id").references(() => products.id),
  brandId: text("brand_id").references(() => brands.id),
  altText: text("alt_text"),
  status: text("status").notNull().default("pending_rights"), // pending_rights | active | disabled | withdrawn
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
});
