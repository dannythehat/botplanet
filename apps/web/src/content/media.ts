/**
 * Media library & rights registry (blueprint W11 / Job 2).
 *
 * Mirrors the D1 `media` table's rights model (source_type, rights_basis,
 * usage_scope, supports_tested_claim, status). This repo-managed registry is the
 * reviewable record of WHAT we hold and UNDER WHAT RIGHTS.
 *
 * HARD RULES (enforced here):
 *  - No fake/generic robot photo ever stands in for a real product (see
 *    ProductVisual placeholder instead).
 *  - `supportsTestedClaim` is NEVER true unless it's original BotPlanet capture
 *    of a unit we actually used.
 *  - A product image is `active` (publishable) ONLY with a documented rights
 *    basis. Otherwise it stays `pending_rights` and the product renders the
 *    honest branded placeholder.
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
  /** Repo path or (later) R2 key. */
  src: string;
  source: MediaSource;
  rightsBasis: string;
  /** Permitted channels (usage scope). */
  permittedChannels: string[];
  altText: string;
  /** Focal point 0-1 for responsive cropping. */
  focalPoint?: { x: number; y: number };
  /** Responsive widths to generate when rasterized. */
  responsiveVariants?: number[];
  acquisitionDate: string;
  /** null = no expiry. */
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
  { id: "og-default", kind: "og", src: "/og/botplanet-default.svg", altText: "BotPlanet — shop the planet yourself, or let BotMatch find your perfect robot", focalPoint: { x: 0.5, y: 0.5 }, responsiveVariants: [1200], ...ORIG },
  { id: "dgm-pool-zones", kind: "diagram", src: "components/PoolDiagram.astro", altText: "Pool cross-section showing floor, walls, waterline and water-surface cleaning zones", ...ORIG },
  { id: "dgm-coverage", kind: "diagram", src: "components/diagrams/CoverageZones.astro", altText: "Pool cross-section highlighting floor, wall and waterline cleaning zones", ...ORIG },
  { id: "dgm-corded-cordless", kind: "diagram", src: "components/diagrams/CordedVsCordless.astro", altText: "Corded vs cordless robotic pool cleaners compared", ...ORIG },
  { id: "dgm-size-shape", kind: "diagram", src: "components/diagrams/PoolSizeShape.astro", altText: "Robot suitability by pool size and shape", ...ORIG },
  { id: "dgm-botmatch", kind: "diagram", src: "components/diagrams/BotMatchExplainer.astro", altText: "How BotMatch works — deterministic suitability with commission isolated to a tie-break", ...ORIG },
  { id: "hero-pool", kind: "hero", src: "components/diagrams/CategoryHero.astro", altText: "Robotic pool cleaners — stylised BotPlanet brand artwork", focalPoint: { x: 0.62, y: 0.55 }, ...ORIG },
];

/**
 * Per-product image rights matrix. Status is `pending_rights` until a documented
 * basis exists. `plannedSource` / `rightsPath` record the legitimate route to a
 * publishable image (filled from brand-media research). Until active, product
 * pages use the honest branded placeholder — never a scraped or generic photo.
 */
export interface ProductImagePlan {
  productId: string;
  slug: string;
  brand: string;
  plannedSource: MediaSource;
  /** The concrete legitimate route (e.g. "CJ product feed once joined"). */
  rightsPath: string;
  status: MediaStatus;
  blocker?: string;
}

export const PRODUCT_IMAGE_PLAN: ProductImagePlan[] = [
  { productId: "prod-aiper-scuba-x1", slug: "aiper-scuba-x1", brand: "Aiper", plannedSource: "affiliate_network", rightsPath: "CJ product feed (adv 6404897) — publisher usage on join", status: "pending_rights", blocker: "Aiper CJ approval" },
  { productId: "prod-aiper-scuba-s1", slug: "aiper-scuba-s1", brand: "Aiper", plannedSource: "affiliate_network", rightsPath: "CJ product feed (adv 6404897) — publisher usage on join", status: "pending_rights", blocker: "Aiper CJ approval" },
  { productId: "prod-aiper-seagull-se", slug: "aiper-seagull-se", brand: "Aiper", plannedSource: "affiliate_network", rightsPath: "CJ product feed (adv 6404897) — publisher usage on join", status: "pending_rights", blocker: "Aiper CJ approval" },
  { productId: "prod-beatbot-aquasense-2-ultra", slug: "beatbot-aquasense-2-ultra", brand: "Beatbot", plannedSource: "affiliate_network", rightsPath: "Impact affiliate program creatives on join + written OK (affiliate@beatbot.com); image use not addressed in terms", status: "pending_rights", blocker: "Beatbot Impact join + written permission" },
  { productId: "prod-wybot-c1", slug: "wybot-c1", brand: "WYBOT", plannedSource: "affiliate_network", rightsPath: "Impact/Awin 'Marketing Alliance' creatives on join + written media-kit request (maggiezhang@wybotics.com)", status: "pending_rights", blocker: "WYBOT Impact/Awin join + written permission" },
  { productId: "prod-dolphin-nautilus-cc-plus", slug: "dolphin-nautilus-cc-plus", brand: "Maytronics", plannedSource: "manufacturer", rightsPath: "Written license via Maytronics gated DAM (brand.maytronics.com), OR Amazon PA-API (Associates, links back to Amazon)", status: "pending_rights", blocker: "Maytronics written permission or Amazon PA-API access" },
  { productId: "prod-dolphin-premier", slug: "dolphin-premier", brand: "Maytronics", plannedSource: "manufacturer", rightsPath: "Written license via Maytronics gated DAM (brand.maytronics.com), OR Amazon PA-API", status: "pending_rights", blocker: "Maytronics written permission or Amazon PA-API access" },
  { productId: "prod-dolphin-e10", slug: "dolphin-e10", brand: "Maytronics", plannedSource: "manufacturer", rightsPath: "Written license via Maytronics gated DAM (brand.maytronics.com), OR Amazon PA-API", status: "pending_rights", blocker: "Maytronics written permission or Amazon PA-API access" },
  // NOTE: FREEDOM is a Polaris (Fluidra) product, not Pentair — brand-data fix flagged for Job 5/6.
  { productId: "prod-polaris-freedom", slug: "polaris-freedom", brand: "Polaris (Fluidra)", plannedSource: "manufacturer", rightsPath: "Written permission via Polaris/Fluidra channel-partner program (no open affiliate program), OR Amazon PA-API", status: "pending_rights", blocker: "Polaris/Fluidra written permission or Amazon PA-API access" },
  { productId: "prod-betta-se-plus", slug: "betta-se-plus", brand: "Solar Pool Technologies", plannedSource: "affiliate_network", rightsPath: "BettaBot affiliate program (partners.bettabot.com) join + written asset license, OR Amazon PA-API", status: "pending_rights", blocker: "Betta program join + written permission, or Amazon PA-API" },
];

export const mediaStats = () => ({
  originalActive: ORIGINAL_ASSETS.filter((a) => a.status === "active").length,
  productActive: PRODUCT_IMAGE_PLAN.filter((p) => p.status === "active").length,
  productPending: PRODUCT_IMAGE_PLAN.filter((p) => p.status === "pending_rights").length,
});
