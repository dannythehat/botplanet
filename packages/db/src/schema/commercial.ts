import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import type { FreshnessClass } from "@botplanet/shared";
import { brands, products } from "./catalogue";
import { markets } from "./reference";

/** Retailers / marketplaces (global identity). */
export const retailers = sqliteTable("retailers", {
  id: text("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  type: text("type").notNull(), // manufacturer_store | distributor | specialist | marketplace
  approvalStatus: text("approval_status").notNull().default("unreviewed"),
  reliabilityScore: integer("reliability_score"), // 0-100, nullable
});

/** A retailer operating in a specific market. */
export const retailerMarkets = sqliteTable("retailer_markets", {
  id: text("id").primaryKey(),
  retailerId: text("retailer_id")
    .notNull()
    .references(() => retailers.id),
  marketId: text("market_id")
    .notNull()
    .references(() => markets.id),
  approved: integer("approved", { mode: "boolean" }).notNull().default(false),
  shipsToJson: text("ships_to_json", { mode: "json" }).$type<string[]>(),
});

/**
 * Affiliate programmes are per-market (Amazon US != Amazon UK). Commission
 * detail is PRIVATE and NEVER exposed to the client or to product scoring.
 * `emailLinksAllowed` captures the per-programme email rule (Amazon = false).
 */
export const affiliatePrograms = sqliteTable("affiliate_programs", {
  id: text("id").primaryKey(),
  retailerId: text("retailer_id").references(() => retailers.id),
  brandId: text("brand_id").references(() => brands.id),
  marketId: text("market_id")
    .notNull()
    .references(() => markets.id),
  network: text("network").notNull(), // amazon_us | awin | cj | impact | flexoffers | rakuten | direct
  status: text("status").notNull().default("identified"), // 16-stage pipeline value
  cookieDays: integer("cookie_days"), // nullable / provisional
  commissionType: text("commission_type"), // percent | flat | cpl
  /** PRIVATE. Basis points (e.g. 800 = 8%). Nullable / provisional. */
  commissionValueBp: integer("commission_value_bp"),
  emailLinksAllowed: integer("email_links_allowed", { mode: "boolean" })
    .notNull()
    .default(false),
  programUrl: text("program_url"),
  verificationStatus: text("verification_status").notNull().default("provisional"),
  notes: text("notes"),
});

/**
 * OFFERS — market-scoped. This is the heart of the product/offer separation.
 * One global product has many market offers. Commission fields are PRIVATE and
 * used only as a final tie-break during offer ranking, never in product scoring.
 */
export const offers = sqliteTable("offers", {
  id: text("id").primaryKey(),
  productId: text("product_id")
    .notNull()
    .references(() => products.id),
  retailerId: text("retailer_id")
    .notNull()
    .references(() => retailers.id),
  marketId: text("market_id")
    .notNull()
    .references(() => markets.id),
  affiliateProgramId: text("affiliate_program_id").references(() => affiliatePrograms.id),

  currencyCode: text("currency_code").notNull(),
  // Prices as integer minor units (cents). Nullable when unverified.
  basePriceMinor: integer("base_price_minor"),
  deliveryPriceMinor: integer("delivery_price_minor"),
  totalLandedMinor: integer("total_landed_minor"),

  stockStatus: text("stock_status"), // in_stock | out_of_stock | unknown
  deliveryMinDays: integer("delivery_min_days"),
  deliveryMaxDays: integer("delivery_max_days"),
  warrantySummary: text("warranty_summary"),
  returnsUrl: text("returns_url"),

  redirectKey: text("redirect_key").unique(), // /go/:key
  // PRIVATE fields — never sent to the client:
  affiliateDestinationUrl: text("affiliate_destination_url"),
  commissionValueBp: integer("commission_value_bp"), // tie-break only

  source: text("source").notNull().default("manual"), // api | feed | import | manual | indicative
  freshnessClass: text("freshness_class").$type<FreshnessClass>().notNull().default("indicative"),
  confidence: text("confidence").notNull().default("low"),
  priceVerification: text("price_verification").notNull().default("snapshot"), // verified | snapshot | unconfirmed
  lastCheckedAt: integer("last_checked_at", { mode: "timestamp" }),
  sellerIdentity: text("seller_identity"),
  offerStatus: text("offer_status").notNull().default("active"), // active | paused | expired
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
});

/** Historical price/stock checks for an offer (freshness + audit). */
export const offerPriceHistory = sqliteTable("offer_price_history", {
  id: text("id").primaryKey(),
  offerId: text("offer_id")
    .notNull()
    .references(() => offers.id),
  priceMinor: integer("price_minor"),
  currencyCode: text("currency_code").notNull(),
  stockStatus: text("stock_status"),
  source: text("source").notNull(),
  checkedAt: integer("checked_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
});

/** Central redirect links — the destination can be swapped without editing articles. */
export const redirectLinks = sqliteTable("redirect_links", {
  key: text("key").primaryKey(),
  offerId: text("offer_id")
    .notNull()
    .references(() => offers.id),
  active: integer("active", { mode: "boolean" }).notNull().default(true),
});
