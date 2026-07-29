/**
 * Affiliate Revenue & Attribution Hub — BotPlanet's commercial control centre.
 *
 * SECURITY: This schema stores ONLY safe status metadata and *references* to
 * secrets. Never store passwords, API keys, full banking details, or tax-document
 * contents in D1. Credentials live in Cloudflare Worker secrets / the approved
 * secret manager; here we keep only `secretRef` (a name/handle) and setup status.
 *
 * PRIVACY: attribution rows must never contain personal BotMatch answers. Only an
 * anonymous session id and non-personal dimensions are stored, subject to consent.
 */
import { sql } from "drizzle-orm";
import { index, integer, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";
import { brands, products } from "./catalogue";
import { affiliatePrograms, offers, retailers } from "./commercial";
import { categories, markets } from "./reference";
import { recommendations } from "./sessions";

/**
 * Operational affiliate account / application. Sits alongside `affiliate_programs`
 * (which holds programme identity + commission basics) and carries the payout,
 * application-lifecycle and setup metadata needed to actually get paid.
 */
export const affiliateAccounts = sqliteTable(
  "affiliate_accounts",
  {
    id: text("id").primaryKey(),
    affiliateProgramId: text("affiliate_program_id").references(() => affiliatePrograms.id),
    network: text("network").notNull(),
    marketId: text("market_id")
      .notNull()
      .references(() => markets.id),
    applicationStage: text("application_stage").notNull().default("identified"), // 16-stage pipeline
    status: text("status").notNull().default("pending"), // pending | approved | rejected | suspended | closed
    applicationDate: integer("application_date", { mode: "timestamp" }),
    decisionDate: integer("decision_date", { mode: "timestamp" }),
    /** Safe external account/publisher reference (NOT a credential). */
    externalAccountRef: text("external_account_ref"),
    // OWNERSHIP RULE: commission rate + cookie duration are NOT stored here.
    // `affiliate_programs` is the single source of currently-applicable commercial
    // terms (used by offers); `program_terms_history` preserves past terms. An
    // account references its programme via `affiliate_program_id` — it never
    // becomes a second editable source for the same rates.
    paymentThresholdMinor: integer("payment_threshold_minor"),
    paymentCadence: text("payment_cadence"), // e.g. net30 | monthly | on_request
    paymentMethodLabel: text("payment_method_label"), // e.g. "PayPal", "ACH" — label only
    claimInstructions: text("claim_instructions"),
    nextExpectedPaymentAt: integer("next_expected_payment_at", { mode: "timestamp" }),
    accountManagerContact: text("account_manager_contact"),
    programTermsUrl: text("program_terms_url"),
    creativePermissions: text("creative_permissions"), // image/creative usage summary
    coverageNotes: text("coverage_notes"), // which products/offers this account covers
    lastTermsVerifiedAt: integer("last_terms_verified_at", { mode: "timestamp" }),
    suspensionStatus: text("suspension_status"),
    /** Status of required tax/bank/identity setup — metadata only, no document contents. */
    taxBankIdentitySetupStatus: text("tax_bank_identity_setup_status").notNull().default("incomplete"),
    /** Reference/handle to a secret in the secret manager. NEVER the secret itself. */
    secretRef: text("secret_ref"),
    createdAt: integer("created_at", { mode: "timestamp" }).notNull().default(sql`(unixepoch())`),
    updatedAt: integer("updated_at", { mode: "timestamp" }).notNull().default(sql`(unixepoch())`),
  },
  (t) => ({
    byMarket: index("aa_market_idx").on(t.marketId),
    byProgram: index("aa_program_idx").on(t.affiliateProgramId),
  }),
);

/** History of programme terms verification (commission/cookie snapshots over time). */
export const programTermsHistory = sqliteTable(
  "program_terms_history",
  {
    id: text("id").primaryKey(),
    affiliateProgramId: text("affiliate_program_id")
      .notNull()
      .references(() => affiliatePrograms.id),
    verifiedAt: integer("verified_at", { mode: "timestamp" }).notNull().default(sql`(unixepoch())`),
    termsUrl: text("terms_url"),
    commissionSnapshotJson: text("commission_snapshot_json", { mode: "json" }).$type<unknown>(),
    cookieDaysSnapshot: integer("cookie_days_snapshot"),
    changeNote: text("change_note"),
  },
  (t) => ({ byProgram: index("pth_program_idx").on(t.affiliateProgramId) }),
);

/**
 * Immutable affiliate click event — the attribution spine. Produced by every
 * `/go/:key` redirect where consent + rules permit. NO personal data.
 */
export const clickEvents = sqliteTable(
  "click_events",
  {
    id: text("id").primaryKey(),
    occurredAt: integer("occurred_at", { mode: "timestamp" }).notNull().default(sql`(unixepoch())`),
    sessionAnonId: text("session_anon_id"), // anonymous/pseudonymous only
    marketId: text("market_id").references(() => markets.id),
    productId: text("product_id").references(() => products.id),
    offerId: text("offer_id").references(() => offers.id),
    retailerId: text("retailer_id").references(() => retailers.id),
    affiliateProgramId: text("affiliate_program_id").references(() => affiliatePrograms.id),
    redirectKey: text("redirect_key"),
    destinationVersion: text("destination_version"), // which offer destination was live at click time
    sourcePage: text("source_page"),
    pageType: text("page_type"),
    contentCluster: text("content_cluster"),
    placement: text("placement"), // CTA / component placement
    recommendationModule: text("recommendation_module"),
    recommendationId: text("recommendation_id").references(() => recommendations.id),
    campaign: text("campaign"),
    trafficSource: text("traffic_source"),
    deviceClass: text("device_class"),
    consentState: text("consent_state"),
  },
  (t) => ({
    byOffer: index("ce_offer_idx").on(t.offerId),
    byRecommendation: index("ce_reco_idx").on(t.recommendationId),
    byMarketTime: index("ce_market_time_idx").on(t.marketId, t.occurredAt),
    byRedirect: index("ce_redirect_idx").on(t.redirectKey),
  }),
);

/**
 * Conversion / commission transactions imported from networks. An outbound click
 * is NEVER assumed to be a sale — a transaction only exists when a network reports one.
 */
export const commissionTransactions = sqliteTable(
  "commission_transactions",
  {
    id: text("id").primaryKey(),
    externalTransactionId: text("external_transaction_id").notNull(),
    network: text("network").notNull(),
    affiliateProgramId: text("affiliate_program_id").references(() => affiliatePrograms.id),
    clickCorrelationId: text("click_correlation_id"), // network sub-id / u1 where available
    clickEventId: text("click_event_id").references(() => clickEvents.id),
    productId: text("product_id").references(() => products.id),
    offerId: text("offer_id").references(() => offers.id),
    sourcePage: text("source_page"),
    pageType: text("page_type"),
    recommendationId: text("recommendation_id").references(() => recommendations.id),
    campaign: text("campaign"),
    trafficSource: text("traffic_source"),
    marketId: text("market_id").references(() => markets.id),
    orderValueMinor: integer("order_value_minor"),
    currencyCode: text("currency_code").notNull(),
    estimatedCommissionMinor: integer("estimated_commission_minor"),
    confirmedCommissionMinor: integer("confirmed_commission_minor"),
    state: text("state").notNull().default("pending"), // pending | approved | rejected | reversed | paid
    conversionDate: integer("conversion_date", { mode: "timestamp" }),
    validationDate: integer("validation_date", { mode: "timestamp" }),
    expectedPaymentDate: integer("expected_payment_date", { mode: "timestamp" }),
    actualPaymentDate: integer("actual_payment_date", { mode: "timestamp" }),
    reversalReason: text("reversal_reason"),
    importSource: text("import_source"), // api | postback | webhook | csv | direct_report | manual
    importJobId: text("import_job_id"),
    reconciliationConfidence: text("reconciliation_confidence"),
    manualAdjustmentMinor: integer("manual_adjustment_minor"),
    notes: text("notes"),
    createdAt: integer("created_at", { mode: "timestamp" }).notNull().default(sql`(unixepoch())`),
    updatedAt: integer("updated_at", { mode: "timestamp" }).notNull().default(sql`(unixepoch())`),
  },
  (t) => ({
    // A transaction id is unique per network.
    byNetworkTxn: uniqueIndex("ct_network_txn_uq").on(t.network, t.externalTransactionId),
    byProgram: index("ct_program_idx").on(t.affiliateProgramId),
    byClick: index("ct_click_idx").on(t.clickEventId),
    byState: index("ct_state_idx").on(t.state),
  }),
);

/** Payout records — imported commissions matched to actual network payments. */
export const payouts = sqliteTable(
  "payouts",
  {
    id: text("id").primaryKey(),
    affiliateAccountId: text("affiliate_account_id").references(() => affiliateAccounts.id),
    network: text("network").notNull(),
    marketId: text("market_id").references(() => markets.id),
    amountMinor: integer("amount_minor").notNull(),
    currencyCode: text("currency_code").notNull(),
    periodStart: integer("period_start", { mode: "timestamp" }),
    periodEnd: integer("period_end", { mode: "timestamp" }),
    status: text("status").notNull().default("expected"), // expected | received | overdue
    paidAt: integer("paid_at", { mode: "timestamp" }),
    method: text("method"),
    reference: text("reference"),
    notes: text("notes"),
  },
  (t) => ({ byAccount: index("po_account_idx").on(t.affiliateAccountId) }),
);

/**
 * Daily revenue aggregates for fast dashboards.
 *
 * GRAIN: one row per (date × market × category × brand × product × retailer ×
 * affiliate programme). A dimension that is intentionally rolled up uses the
 * literal sentinel `"all"` (never NULL) so uniqueness is well-defined — SQLite
 * treats NULLs as distinct, which would allow duplicate aggregate rows.
 *
 * `aggregationKey` = revenueAggregationKey(...) from @botplanet/shared: a
 * deterministic, non-null join of the normalised dimensions. It is UNIQUE and is
 * the safe upsert / rebuild key. Never sum rows across different grains (i.e. do
 * not add an "all-products" row to per-product rows for the same date).
 */
export const revenueDaily = sqliteTable(
  "revenue_daily",
  {
    id: text("id").primaryKey(),
    /** Deterministic non-null uniqueness key over the normalised dimensions. */
    aggregationKey: text("aggregation_key").notNull(),
    date: text("date").notNull(), // yyyy-mm-dd
    marketId: text("market_id"), // "all" encoded in aggregationKey when rolled up
    categoryId: text("category_id"),
    brandId: text("brand_id"),
    productId: text("product_id"),
    retailerId: text("retailer_id"),
    affiliateProgramId: text("affiliate_program_id"),
    clicks: integer("clicks").notNull().default(0),
    conversions: integer("conversions").notNull().default(0),
    estimatedCommissionMinor: integer("estimated_commission_minor").notNull().default(0),
    confirmedCommissionMinor: integer("confirmed_commission_minor").notNull().default(0),
    currencyCode: text("currency_code").notNull(),
  },
  (t) => ({
    byKey: uniqueIndex("rd_aggregation_key_uq").on(t.aggregationKey),
    byDate: index("rd_date_idx").on(t.date),
  }),
);

/** Import jobs — CSV/API/postback provenance for every transaction batch. */
export const importJobs = sqliteTable("import_jobs", {
  id: text("id").primaryKey(),
  source: text("source").notNull(), // api | postback | webhook | csv | direct_report | manual
  network: text("network"),
  startedAt: integer("started_at", { mode: "timestamp" }).notNull().default(sql`(unixepoch())`),
  finishedAt: integer("finished_at", { mode: "timestamp" }),
  status: text("status").notNull().default("running"),
  rowsImported: integer("rows_imported").notNull().default(0),
  provenanceJson: text("provenance_json", { mode: "json" }).$type<unknown>(),
  notes: text("notes"),
});
