/**
 * SCHEDULED OFFER REFRESH — the operational record.
 *
 * WHY THESE TABLES EXIST. Job 10's refresh policy lived in code while its
 * results lived in a committed TypeScript file. That is fine for a run a human
 * starts and commits, and impossible for a scheduled one: a Worker cannot write
 * to source control. Without somewhere writable the five live prices would
 * simply expire and the catalogue would empty itself.
 *
 * WHAT IS PRESERVED, AND WHY IT IS NOT JUST THE ANSWERS. Every run records what
 * it decided AND what it refused, because a refusal is the more useful record
 * when someone revisits this: "we found nothing" and "we found six things and
 * four of them were a different machine" are different findings. Runs are
 * append-only. Nothing overwrites the history of what was believed and when.
 *
 * IDEMPOTENCE. A run is keyed by (scope, run_date), and an observation by
 * (product_id, asin, checked_date). Re-running the same day updates in place
 * rather than duplicating, so a retry after a partial failure converges on one
 * clean state instead of stacking rows.
 *
 * NOTHING SECRET IS STORED. No API key, no raw provider payload, no signed URL.
 * Only the fields the retailer itself published, plus our decision about them.
 */
import { index, integer, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";

/** One execution of the scheduler, successful or not. */
export const refreshRuns = sqliteTable(
  "refresh_runs",
  {
    id: text("id").primaryKey(),
    /** "weekly" | "daily_exception" | "manual" | "dry_run". */
    scope: text("scope").notNull(),
    runDate: text("run_date").notNull(),
    startedAt: text("started_at").notNull(),
    finishedAt: text("finished_at"),
    /** "ok" | "partial" | "skipped" | "failed". */
    status: text("status").notNull(),
    productsPlanned: integer("products_planned").notNull().default(0),
    productsRead: integer("products_read").notNull().default(0),
    creditsUsed: integer("credits_used").notNull().default(0),
    /** Credits spent this calendar month BEFORE this run, for the ceiling. */
    creditsMonthToDate: integer("credits_month_to_date").notNull().default(0),
    ceilingReached: integer("ceiling_reached", { mode: "boolean" }).notNull().default(false),
    /** True when nothing was written — a dry run proves the wiring only. */
    dryRun: integer("dry_run", { mode: "boolean" }).notNull().default(false),
    notes: text("notes"),
  },
  (t) => ({
    byScopeDate: uniqueIndex("refresh_runs_scope_date_uq").on(t.scope, t.runDate),
    byDate: index("refresh_runs_date_idx").on(t.runDate),
  }),
);

/**
 * What the provider read for one product on one date.
 *
 * Wording is stored VERBATIM. Normalisation stays in the offer engine so a
 * second provider cannot disagree with the first about what "In Stock" means.
 */
export const refreshObservations = sqliteTable(
  "refresh_observations",
  {
    id: text("id").primaryKey(),
    runId: text("run_id").notNull(),
    productId: text("product_id").notNull(),
    asin: text("asin").notNull(),
    checkedDate: text("checked_date").notNull(),
    providerId: text("provider_id").notNull(),
    observedTitle: text("observed_title"),
    brand: text("brand"),
    modelName: text("model_name"),
    modelNumber: text("model_number"),
    /** Buy-NEW only. A used or renewed option never lands here. */
    priceMinor: integer("price_minor"),
    currency: text("currency").notNull().default("USD"),
    stockWording: text("stock_wording"),
    shippingWording: text("shipping_wording"),
    sellerWording: text("seller_wording"),
    returnsWording: text("returns_wording"),
    identityConfirmed: integer("identity_confirmed", { mode: "boolean" }).notNull().default(false),
    /** Which field settled the match, in words. */
    matchEvidence: text("match_evidence").notNull(),
    /** True once every publication gate passed. */
    accepted: integer("accepted", { mode: "boolean" }).notNull().default(false),
    suppressionReason: text("suppression_reason"),
  },
  (t) => ({
    byProductAsinDate: uniqueIndex("refresh_obs_product_asin_date_uq").on(t.productId, t.asin, t.checkedDate),
    byProduct: index("refresh_obs_product_idx").on(t.productId),
    byRun: index("refresh_obs_run_idx").on(t.runId),
  }),
);

/**
 * A candidate considered and refused, with the rule that refused it.
 *
 * Kept permanently so next month's run cannot rediscover the same wrong ASIN
 * and accept it — the C1 PLUS listing whose title says "WYBOT C1" is exactly
 * the case this table exists for.
 */
export const refreshRejections = sqliteTable(
  "refresh_rejections",
  {
    id: text("id").primaryKey(),
    runId: text("run_id").notNull(),
    productId: text("product_id").notNull(),
    asin: text("asin").notNull(),
    observedTitle: text("observed_title"),
    rule: text("rule").notNull(),
    reason: text("reason").notNull(),
    firstSeenDate: text("first_seen_date").notNull(),
    lastSeenDate: text("last_seen_date").notNull(),
  },
  (t) => ({
    byProductAsin: uniqueIndex("refresh_rej_product_asin_uq").on(t.productId, t.asin),
    byProduct: index("refresh_rej_product_idx").on(t.productId),
  }),
);

/** A product the run could not resolve, and the reason, so it is never a silent gap. */
export const refreshUnresolved = sqliteTable(
  "refresh_unresolved",
  {
    productId: text("product_id").primaryKey(),
    runId: text("run_id").notNull(),
    reason: text("reason").notNull(),
    lastAttemptedDate: text("last_attempted_date").notNull(),
    /** Set when the product is on the daily exception list. */
    exceptionReason: text("exception_reason"),
  },
);

/**
 * A refresh that did NOT happen, and why.
 *
 * The most important table here. A run that silently did nothing because the
 * month's credits were gone looks identical to a run where nothing changed —
 * and only one of those means the price on the page can still be trusted.
 */
export const refreshSkips = sqliteTable(
  "refresh_skips",
  {
    id: text("id").primaryKey(),
    runId: text("run_id").notNull(),
    productId: text("product_id").notNull(),
    /** credit_ceiling_reached | not_due_yet | no_credentials | provider_error. */
    reason: text("reason").notNull(),
    detail: text("detail").notNull(),
    skippedAt: text("skipped_at").notNull(),
  },
  (t) => ({
    byRun: index("refresh_skips_run_idx").on(t.runId),
  }),
);
