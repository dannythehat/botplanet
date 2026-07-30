/**
 * Media library & rights registry (blueprint W11 / Job 2).
 *
 * Mirrors the D1 `media` table's rights model (source_type, rights_basis,
 * usage_scope, supports_tested_claim, status). This repo-managed registry is the
 * reviewable record of WHAT we hold and UNDER WHAT RIGHTS.
 *
 * RECONCILED 2026-07-30 against the live records (this corrects an earlier draft
 * that wrongly marked every product `pending_rights`):
 *  - Notion "Affiliate Programme Status — US Launch": Amazon Associates US
 *    APPROVED & LIVE for all 10; Awin/WYBOT is EU/UK only; CJ/Aiper pending.
 *    https://app.notion.com/p/3ade30f1e54081a19981db2536055324
 *  - D1 affiliate_programs.amazon_us.image_permission =
 *    "Amazon Program Content via approved Associates tools / Creators API" (terms_source:
 *    Amazon Associates Operating Agreement; status active/verified; all 10 wired to /go).
 *  - D1 affiliate_accounts: amazon_us approved/active_partner (botplanet-20);
 *    awin approved but market_id=uk ("not usable for US traffic"); cj pending.
 *
 * HARD RULES (Amazon Program Content):
 *  - Obtained only via Amazon-approved Associates tools (Product Links etc.) or the
 *    Creators API — never scraped, guessed image URLs, or unapproved downloads.
 *  - Amazon-hosted where the supplied mechanism requires it; shown with our
 *    compliant tracked Amazon Special Links (live via /go, tag botplanet-20).
 *  - Not altered except permitted proportional resizing.
 *  - No scraped/generic photo ever substitutes for a real product image.
 *  - `supportsTestedClaim` is NEVER true unless it's original BotPlanet capture.
 */

export type MediaSource =
  | "original_botplanet"
  | "manufacturer"
  | "affiliate_network"
  | "licensed_stock"
  | "ai_generated"
  | "ugc";

export type MediaStatus = "active" | "pending_rights" | "disabled" | "withdrawn";

export interface MediaAsset {
  id: string;
  kind: "diagram" | "hero" | "og" | "product_packshot" | "product_alt" | "logo";
  src: string;
  source: MediaSource;
  rightsBasis: string;
  permittedChannels: string[];
  altText: string;
  focalPoint?: { x: number; y: number };
  responsiveVariants?: number[];
  acquisitionDate: string;
  expiry: string | null;
  isOriginalBotplanet: boolean;
  supportsTestedClaim: boolean;
  status: MediaStatus;
  productId?: string;
  brandId?: string;
}

const ORIG = {
  source: "original_botplanet" as MediaSource,
  rightsBasis: "Original BotPlanet artwork — full usage rights, all channels, no expiry",
  permittedChannels: ["website", "og_social", "email", "press"],
  acquisitionDate: "2026-07-30",
  expiry: null,
  isOriginalBotplanet: true,
  supportsTestedClaim: false,
  status: "active" as MediaStatus,
};

/** Original BotPlanet assets — authored in-house, clean rights, no product photos. */
export const ORIGINAL_ASSETS: MediaAsset[] = [
  { id: "og-default", kind: "og", src: "/og/botplanet-default.svg", altText: "BotPlanet — shop real-world robots with clearer comparisons, evidence and category-specific guidance", focalPoint: { x: 0.5, y: 0.5 }, responsiveVariants: [1200], ...ORIG },
  { id: "dgm-pool-zones", kind: "diagram", src: "components/PoolDiagram.astro", altText: "Pool cross-section showing floor, walls, waterline and water-surface cleaning zones", ...ORIG },
  { id: "dgm-coverage", kind: "diagram", src: "components/diagrams/CoverageZones.astro", altText: "Pool cross-section highlighting floor, wall and waterline cleaning zones", ...ORIG },
  { id: "dgm-corded-cordless", kind: "diagram", src: "components/diagrams/CordedVsCordless.astro", altText: "Corded vs cordless robotic pool cleaners compared", ...ORIG },
  { id: "dgm-size-shape", kind: "diagram", src: "components/diagrams/PoolSizeShape.astro", altText: "Robot suitability by pool size and shape", ...ORIG },
  { id: "dgm-botmatch", kind: "diagram", src: "components/diagrams/BotMatchExplainer.astro", altText: "How BotMatch works — deterministic suitability with commission isolated to a tie-break", ...ORIG },
  { id: "hero-pool", kind: "hero", src: "components/diagrams/CategoryHero.astro", altText: "Robotic pool cleaners — stylised BotPlanet brand artwork", focalPoint: { x: 0.62, y: 0.55 }, ...ORIG },
];

/* ---- Evidence links (reused across the matrix) ---- */
const NOTION_TRACKER = "https://app.notion.com/p/3ade30f1e54081a19981db2536055324";
const AMZ_EVIDENCE = "Amazon Associates dashboard (botplanet-20); D1 affiliate_programs.amazon_us.image_permission";

/**
 * Per-product image rights reconciliation (Job 2). Records the LAWFUL image
 * source available TODAY, not assumptions.
 *
 * rightsStatus:
 *  - available_now       — a documented lawful source exists today.
 *  - pending_approval    — an additional/better source is pending.
 * assetStatus: whether a real image file has been ingested + wired yet.
 */
export interface ProductImagePlan {
  productId: string;
  slug: string;
  brand: string;
  /** The programme that provides the image route we rely on for the US site. */
  affiliateProgramme: string;
  network: string;
  accountStatus: string;
  territory: string;
  /** Lawful product-image source available NOW for the US site. */
  imageSourceNow: string;
  rightsBasis: string;
  /** How the image is compliantly obtained + current access state. */
  accessStatus: string;
  rightsStatus: "available_now" | "pending_approval";
  /** Have we actually ingested + wired a real image yet? */
  assetStatus: "rights_available_not_ingested" | "ingested_active";
  /** A better brand-direct source pending, if any. */
  upgradeSource?: string;
  /** Exact blocker for the PRIMARY route today; null if none for launch. */
  blocker: string | null;
  notionEvidence: string;
  providerEvidence: string;
  /** Only where genuinely required of Danny. */
  dannyAction: string | null;
}

/** Common Amazon-Associates image basis shared by all 10 (all sold on Amazon US, all wired to /go). */
const AMZ = {
  affiliateProgramme: "Amazon Associates US",
  network: "Amazon",
  accountStatus: "Approved — LIVE (active_partner, botplanet-20)",
  territory: "US",
  imageSourceNow: "Amazon-hosted product images via the Associates programme",
  rightsBasis:
    "Amazon grants a limited licence to display Amazon Program Content on the approved site in connection with the Associates programme (account botplanet-20), shown with compliant tracked Amazon Special Links (live via /go). Recorded in D1 image_permission.",
  accessStatus:
    "Amazon Program Content via Amazon-approved Product Links / Associates linking tools; automated product-image access will use the supported Creators API when available.",
  rightsStatus: "available_now" as const,
  assetStatus: "rights_available_not_ingested" as const,
  blocker: null,
  notionEvidence: NOTION_TRACKER,
  providerEvidence: AMZ_EVIDENCE,
  dannyAction: null,
};

/** The compliant Amazon Program Content basis + rules (established at Job 2). */
export const AMAZON_IMAGE_COMPLIANCE: string[] = [
  "Amazon Associates US account botplanet-20 is approved and active.",
  "Amazon grants a limited licence to display Amazon Program Content on the approved site in connection with participation in the Associates programme.",
  "Images must be obtained through Amazon-approved Associates tools or the Creators API.",
  "Images must remain Amazon-hosted where required by the supplied mechanism.",
  "Images must be shown with compliant tracked Amazon Special Links.",
  "Content must not be altered except for permitted proportional resizing.",
  "No scraping, guessed image URLs or unapproved downloading.",
  "The Creators API is the current supported automated image/data interface (PA-API 5 is deprecated).",
  "Actual asset ingestion and product-page wiring occur in the later implementation job; Job 2 establishes the lawful source, rights registry and compliance rules.",
];

const CJ_EVIDENCE =
  "CJ Advertiser Lookup adv 6404897 (relationship-status: notjoined = pending); CJ dashboard shows submitted application";

export const PRODUCT_IMAGE_PLAN: ProductImagePlan[] = [
  // Aiper ×3 — Amazon now; Aiper CJ feed is the pending upgrade (application submitted, awaiting decision).
  { productId: "prod-aiper-scuba-x1", slug: "aiper-scuba-x1", brand: "Aiper", ...AMZ,
    upgradeSource: "Aiper CJ product feed (adv 6404897, 8%) — publisher image rights on approval; application submitted, awaiting decision",
    providerEvidence: `${AMZ_EVIDENCE}; ${CJ_EVIDENCE}` },
  { productId: "prod-aiper-scuba-s1", slug: "aiper-scuba-s1", brand: "Aiper", ...AMZ,
    upgradeSource: "Aiper CJ product feed (adv 6404897, 8%) on approval; application submitted, awaiting decision",
    providerEvidence: `${AMZ_EVIDENCE}; ${CJ_EVIDENCE}` },
  { productId: "prod-aiper-seagull-se", slug: "aiper-seagull-se", brand: "Aiper", ...AMZ,
    upgradeSource: "Aiper CJ product feed (adv 6404897, 8%) on approval; application submitted, awaiting decision",
    providerEvidence: `${AMZ_EVIDENCE}; ${CJ_EVIDENCE}` },

  // Beatbot — Amazon now; Beatbot direct/FlexOffers a future commission upgrade (Impact declined).
  { productId: "prod-beatbot-aquasense-2-ultra", slug: "beatbot-aquasense-2-ultra", brand: "Beatbot", ...AMZ,
    upgradeSource: "Beatbot direct/FlexOffers post-launch (commission upgrade; Impact network declined)" },

  // WYBOT — Amazon now. WYBOT affiliation EXISTS via Awin but is EU/UK only → NOT usable for US assets.
  { productId: "prod-wybot-c1", slug: "wybot-c1", brand: "WYBOT", ...AMZ,
    upgradeSource: "None for US: existing WYBOT programme is Awin EU/UK (publisher 3012175), market_id=uk — creatives NOT licensed for the US site; parked for a future UK/EU market",
    providerEvidence: `${AMZ_EVIDENCE}; Awin publisher 3012175 (WYBOT EU/UK, not US)` },

  // Dolphin/Maytronics ×3 — Amazon now; Doheny's (Pepperjam) is the future non-Amazon retailer route.
  { productId: "prod-dolphin-nautilus-cc-plus", slug: "dolphin-nautilus-cc-plus", brand: "Maytronics", ...AMZ,
    upgradeSource: "Doheny's (Pepperjam) or FlexOffers/Leslie's post-launch — no direct Maytronics affiliate/image programme" },
  { productId: "prod-dolphin-premier", slug: "dolphin-premier", brand: "Maytronics", ...AMZ,
    upgradeSource: "Doheny's (Pepperjam) or FlexOffers/Leslie's post-launch" },
  { productId: "prod-dolphin-e10", slug: "dolphin-e10", brand: "Maytronics", ...AMZ,
    upgradeSource: "Doheny's (Pepperjam) or FlexOffers/Leslie's post-launch" },

  // Polaris FREEDOM (brand: Fluidra, not Pentair — data fix flagged) — Amazon now; Doheny's future.
  { productId: "prod-polaris-freedom", slug: "polaris-freedom", brand: "Polaris (Fluidra)", ...AMZ,
    upgradeSource: "Doheny's (Pepperjam) post-launch — no open Polaris/Fluidra affiliate programme. NOTE: correct brand is Fluidra, not Pentair (data fix for Job 5/6)" },

  // Betta / Solar Pool Technologies — Amazon now; BettaBot direct affiliate a future route.
  { productId: "prod-betta-se-plus", slug: "betta-se-plus", brand: "Solar Pool Technologies", ...AMZ,
    upgradeSource: "BettaBot direct affiliate (partners.bettabot.com) or FlexOffers post-launch" },
];

export const mediaStats = () => ({
  originalActive: ORIGINAL_ASSETS.filter((a) => a.status === "active").length,
  productsRightsAvailableNow: PRODUCT_IMAGE_PLAN.filter((p) => p.rightsStatus === "available_now").length,
  productsIngested: PRODUCT_IMAGE_PLAN.filter((p) => p.assetStatus === "ingested_active").length,
  productsTotal: PRODUCT_IMAGE_PLAN.length,
});
