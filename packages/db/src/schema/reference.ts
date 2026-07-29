import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

/** Markets. Products are global; offers reference a market. */
export const markets = sqliteTable("markets", {
  id: text("id").primaryKey(), // "us", "ca", "uk", "au"
  name: text("name").notNull(),
  pathPrefix: text("path_prefix").notNull().default(""), // US = "" (root)
  defaultLocale: text("default_locale").notNull(),
  currencyCode: text("currency_code").notNull(),
  measurement: text("measurement").notNull(), // imperial | metric
  launchStatus: text("launch_status").notNull(), // launch | planned | structural_only
  isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
});

/** Per-market, per-locale disclosure text (affiliate / sponsored / review-unit). */
export const disclosures = sqliteTable("disclosures", {
  id: text("id").primaryKey(),
  marketId: text("market_id")
    .notNull()
    .references(() => markets.id),
  locale: text("locale").notNull(),
  type: text("type").notNull(), // affiliate | sponsored | review_unit
  body: text("body").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
});

/** Category taxonomy (launch: robotic pool cleaners). */
export const categories = sqliteTable("categories", {
  id: text("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  parentId: text("parent_id"),
});
