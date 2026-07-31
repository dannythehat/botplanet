/**
 * The asset inventory.
 *
 * Two kinds of record live here and nothing else:
 *   1. original BotPlanet artwork, which we own outright;
 *   2. branded placeholders, which stand in for photography we may not lawfully
 *      hold yet and which depict nothing.
 *
 * THERE ARE NO THIRD-PARTY PRODUCT PHOTOGRAPHS. That is a finding, not an
 * oversight — see MEDIA_SOURCE_CHECKS and PRODUCT_PHOTOGRAPHY_POSITION in
 * rights.ts, and ACQUISITION_BLOCKERS below for what unblocks each product.
 * Fabricating a record so coverage looked complete would defeat the purpose of
 * having a rights registry at all.
 *
 * Placeholder checksums and dimensions come from the generator's manifest, so
 * an edited SVG that is not regenerated fails the checksum test rather than
 * silently shipping with a stale rights record.
 */
import { VERIFICATIONS } from "../evidence/verification";
import { PRODUCT_ID } from "../products";
import MANIFEST from "../../../../../scripts/placeholder-manifest.json";
import { rightsBasis } from "./rights";
import type { AcquisitionBlocker, MediaAssetRecord, SchemaEligibility } from "./types";

const AUTHORED = "2026-07-31";

/** Placeholders are never eligible for anything that asserts a product photo. */
const PLACEHOLDER_SCHEMA: SchemaEligibility = {
  productImage: false,
  imageObject: false,
  articleImage: false,
  openGraph: false,
  twitter: false,
  reason: "a branded placeholder depicts no real product; presenting it as a Product image or an Open Graph preview would tell a machine consumer it is a photograph of the product",
};

/** Original artwork that depicts no specific product may still illustrate. */
const ORIGINAL_SCHEMA: SchemaEligibility = {
  productImage: false,
  imageObject: true,
  articleImage: true,
  openGraph: true,
  twitter: true,
  reason: "original artwork illustrates a concept, so it may support an article or a social preview but never stands as the photograph of a specific product",
};

const base = (id: string, basisKey: string) => {
  const r = rightsBasis(basisKey)!;
  return {
    id,
    tier: r.tier,
    sourceProvider: r.provider,
    sourceRef: null,
    credentialSecretRef: r.credentialSecretRef,
    rightsBasis: r.text,
    allowedMarkets: r.allowedMarkets,
    allowedPlacements: r.allowedPlacements,
    allowedTransformations: r.allowedTransformations,
    storage: "local_permitted" as const,
    remoteServingRequired: r.remoteServingRequired,
    attributionRequired: r.attributionRequired,
    retrievedDate: AUTHORED,
    lastCheckedDate: AUTHORED,
    expiryRule: r.expiryRule,
    withdrawal: "active" as const,
    withdrawalDate: null,
    withdrawalReason: null,
    reviewerStatus: "unreviewed" as const,
    supportsTestedClaim: false,
  };
};

/* ------------------------------------------------------------------ */
/* Original BotPlanet artwork                                          */
/* ------------------------------------------------------------------ */

export const ORIGINAL_ASSETS: MediaAssetRecord[] = [
  {
    ...base("og-botplanet-default", "botplanet_original"),
    productId: null,
    purpose: "Site-wide Open Graph and Twitter card",
    exactModel: null,
    type: "open_graph",
    acquisitionMethod: "authored_in_house",
    // Verified against the committed file; a silent edit changes this hash and
    // fails the checksum test rather than shipping with a stale rights record.
    checksum: "sha256:352afbf36c62cbd236ced8fa31c14e07fe6df4e0c9a22232cff5cfbf38f7cf96",
    width: 1200,
    height: 630,
    src: "/og/botplanet-default.png",
    altText: "BotPlanet — shop real-world robots with clearer comparisons and evidence",
    altTextStatus: "approved",
    schema: { ...ORIGINAL_SCHEMA, reason: "brand card, not a product photograph" },
    depictsRealProduct: false,
    notes: "An SVG source (/og/botplanet-default.svg) is versioned alongside the PNG that social platforms require.",
  },
  {
    ...base("hero-category-pool", "botplanet_original"),
    productId: null,
    purpose: "Robotic pool cleaners category hero",
    exactModel: null,
    type: "category_hero",
    acquisitionMethod: "authored_in_house",
    checksum: null,
    width: null,
    height: null,
    src: "components/diagrams/CategoryHero.astro",
    altText: "",
    altTextStatus: "decorative",
    schema: { ...ORIGINAL_SCHEMA, productImage: false, reason: "decorative brand artwork rendered as inline SVG; it illustrates the category and depicts no product" },
    depictsRealProduct: false,
    notes: "Rendered as an inline Astro component, so it has no intrinsic file dimensions and needs no responsive derivatives.",
  },
  {
    ...base("silhouette-generic-robot", "botplanet_original"),
    productId: null,
    purpose: "Generic robot silhouette used inside product-card media stages",
    exactModel: null,
    type: "branded_placeholder",
    acquisitionMethod: "authored_in_house",
    checksum: null,
    width: null,
    height: null,
    src: "components/RobotSilhouette.astro",
    altText: "",
    altTextStatus: "decorative",
    schema: PLACEHOLDER_SCHEMA,
    depictsRealProduct: false,
    notes: "Deliberately generic geometry. It is never described as a photograph and never attached to a single model.",
  },
  ...(
    [
      ["dgm-pool-zones", "components/PoolDiagram.astro", "Pool cross-section showing floor, wall, waterline and water-surface cleaning zones"],
      ["dgm-coverage", "components/diagrams/CoverageZones.astro", "Pool cross-section highlighting floor, wall and waterline cleaning zones"],
      ["dgm-corded-cordless", "components/diagrams/CordedVsCordless.astro", "Diagram comparing corded and cordless robotic pool cleaners"],
      ["dgm-size-shape", "components/diagrams/PoolSizeShape.astro", "Diagram showing how pool size and shape affect robot suitability"],
      ["dgm-botmatch", "components/diagrams/BotMatchExplainer.astro", "Diagram of how BotMatch produces a deterministic suitability result"],
    ] as const
  ).map(([id, src, alt]): MediaAssetRecord => ({
    ...base(id, "botplanet_original"),
    productId: null,
    purpose: "Educational diagram",
    exactModel: null,
    type: "educational_diagram",
    acquisitionMethod: "authored_in_house",
    checksum: null,
    width: null,
    height: null,
    src,
    altText: alt,
    altTextStatus: "approved",
    schema: ORIGINAL_SCHEMA,
    depictsRealProduct: false,
    notes: "Inline SVG component: no file, no derivatives, no layout shift.",
  })),
];

/* ------------------------------------------------------------------ */
/* Branded product placeholders                                        */
/* ------------------------------------------------------------------ */

interface ManifestEntry {
  slug: string;
  model: string;
  src: string;
  width: number;
  height: number;
  checksum: string;
}

const manifest = MANIFEST as ManifestEntry[];

/**
 * Alt text for a placeholder must describe what the reader actually sees — a
 * BotPlanet panel naming a model — and must not claim to show the product.
 * That distinction is the whole reason placeholders are catalogued separately.
 */
const placeholderAlt = (model: string) =>
  `BotPlanet placeholder panel naming the ${model}. Product photography is not yet available under a licence we hold.`;

export const PLACEHOLDER_ASSETS: MediaAssetRecord[] = manifest.map((m): MediaAssetRecord => {
  const productId = PRODUCT_ID[m.slug] ?? `prod-${m.slug}`;
  const verified = VERIFICATIONS.find((v) => v.productId === productId);
  return {
    ...base(`ph-${m.slug}`, "botplanet_placeholder"),
    productId,
    purpose: null,
    // The exact model comes from the Job 8 verification record, not from the
    // slug, so a placeholder can never drift onto a sibling model.
    exactModel: verified?.identity.canonicalName ?? m.model,
    type: "branded_placeholder",
    acquisitionMethod: "generated_from_house_template",
    checksum: m.checksum,
    width: m.width,
    height: m.height,
    src: m.src,
    altText: placeholderAlt(verified?.identity.canonicalName ?? m.model),
    altTextStatus: "approved",
    schema: PLACEHOLDER_SCHEMA,
    depictsRealProduct: false,
    notes: "Vector artwork: it scales to every rendered size without derivatives, so no raster variants are generated and none are missing.",
  };
});

export const MEDIA_ASSETS: MediaAssetRecord[] = [...ORIGINAL_ASSETS, ...PLACEHOLDER_ASSETS];

/* ------------------------------------------------------------------ */
/* Why no product photography exists yet                               */
/* ------------------------------------------------------------------ */

const AMAZON_BLOCK = {
  bestAvailableTier: "affiliate_api" as const,
  checked: [
    "Amazon Associates US account botplanet-20 (approved, active)",
    "Amazon Associates Operating Agreement image terms",
    "D1 affiliate_programs.amazon_us.image_permission",
  ],
  blocker:
    "The licensed route is Amazon Program Content via the Creators API. The API needs credentials this build environment does not hold, and the programme forbids scraping, constructing image URLs, or caching Program Content without express permission — so there is no lawful way to fetch an image here.",
  unblockAction:
    "Provide the Creators API credential as the Worker secret AMAZON_CREATORS_API_KEY. Ingestion then runs against the API, stores no file, and serves Amazon-hosted images beside the existing tracked /go Special Links.",
  owner: "danny" as const,
};

/**
 * One record per product. Each names the specific identity risk carried over
 * from Job 8, because the wrong-model risk is different for each brand and a
 * generic "no images yet" line would lose it.
 */
export const ACQUISITION_BLOCKERS: AcquisitionBlocker[] = [
  {
    productId: "prod-wybot-c1",
    ...AMAZON_BLOCK,
    checked: [...AMAZON_BLOCK.checked, "wybotpool.com — no media library", "Awin WYBOT programme (publisher 3012175) — EU/UK only, creatives not licensed for the US site"],
    blocker: `${AMAZON_BLOCK.blocker} WYBOT's own affiliate creatives are licensed for EU/UK only. Separately, WYBOT sells C1, C1 Pro and C1 Max with no published model number, so any incoming image must be matched by product page rather than SKU.`,
  },
  {
    productId: "prod-dolphin-nautilus-cc-plus",
    ...AMAZON_BLOCK,
    checked: [...AMAZON_BLOCK.checked, "maytronics.com press page — HTTP 404"],
    blocker: `${AMAZON_BLOCK.blocker} Maytronics ships several near-identical Nautilus CC variants; only part 99996409-PCI may be matched.`,
  },
  {
    productId: "prod-dolphin-premier",
    ...AMAZON_BLOCK,
    checked: [...AMAZON_BLOCK.checked, "maytronics.com press page — HTTP 404", "Maytronics manual portal for 'Dolphin Premier' — serves a Classic 5 / Top 5 document"],
    blocker:
      "This product is a candidate under review: no accepted manufacturer page, no accepted manual and no reliable model number. Even with an Amazon credential, no image may be ingested until the exact model identity is defensible — a generic Dolphin image is not acceptable, and there is no SKU to match one against.",
    unblockAction:
      "Establish the manufacturer page and part number for the Dolphin Premier first (Job 8 identity work), then ingest. Until then this product stays on the placeholder regardless of credentials.",
    owner: "manufacturer" as const,
  },
  {
    productId: "prod-polaris-freedom",
    ...AMAZON_BLOCK,
    checked: [...AMAZON_BLOCK.checked, "fluidra.com press room — no readable content", "polarispool.com support/parts page for SKU FFREEDOM"],
    blocker: `${AMAZON_BLOCK.blocker} Polaris sells FREEDOM, FREEDOM SC, FREEDOM LT and FREEDOM Plus on a shared EB37 chassis, so an incoming image must be matched on the FFREEDOM SKU and not on family resemblance.`,
  },
  {
    productId: "prod-betta-se-plus",
    ...AMAZON_BLOCK,
    checked: [...AMAZON_BLOCK.checked, "bettabot.com — no media library"],
    blocker: `${AMAZON_BLOCK.blocker} The stored record previously cited the Betta SE page in error. Any incoming image must be matched to /products/betta-se-plus; Betta SE media must never be imported for this product.`,
  },
  {
    productId: "prod-dolphin-e10",
    ...AMAZON_BLOCK,
    checked: [...AMAZON_BLOCK.checked, "maytronics.com press page — HTTP 404"],
    blocker: `${AMAZON_BLOCK.blocker} The E10's US part number is 99996133-US and the cited product page is the global store, so an incoming image must be matched on the US part number.`,
  },
  {
    productId: "prod-beatbot-aquasense-2-ultra",
    ...AMAZON_BLOCK,
    checked: [...AMAZON_BLOCK.checked, "beatbot.com/pages/press — HTTP 404", "mybeatbot.com user-manual index — manuals only, no media licence"],
    blocker: `${AMAZON_BLOCK.blocker} Beatbot sells AquaSense, AquaSense Pro, AquaSense 2, AquaSense 2 Pro and AquaSense 2 Ultra; only Ultra imagery may be attached and no generation may be substituted.`,
  },
  {
    productId: "prod-aiper-scuba-x1",
    ...AMAZON_BLOCK,
    checked: [...AMAZON_BLOCK.checked, "aiper.com — no media library", "CJ advertiser 6404897 — application submitted, not approved"],
    blocker: `${AMAZON_BLOCK.blocker} The Aiper CJ feed would supply licensed images but the application is not approved. Aiper publishes no model numbers, so X1 and X1 Pro can only be separated by product page.`,
    unblockAction: `${AMAZON_BLOCK.unblockAction} Alternatively, approval of the Aiper CJ programme (advertiser 6404897) would supply a licensed publisher image feed.`,
  },
  {
    productId: "prod-aiper-scuba-s1",
    ...AMAZON_BLOCK,
    checked: [...AMAZON_BLOCK.checked, "aiper.com — no media library", "CJ advertiser 6404897 — application submitted, not approved"],
    blocker: `${AMAZON_BLOCK.blocker} The Scuba S1 and S1 Pro are separate models with no published SKUs, so only imagery from the exact S1 product page may be attached and Scuba X1 media must never be mixed in.`,
    unblockAction: `${AMAZON_BLOCK.unblockAction} Alternatively, approval of the Aiper CJ programme (advertiser 6404897) would supply a licensed publisher image feed.`,
  },
  {
    productId: "prod-aiper-seagull-se",
    ...AMAZON_BLOCK,
    checked: [...AMAZON_BLOCK.checked, "aiper.com — no media library", "CJ advertiser 6404897 — application submitted, not approved"],
    blocker: `${AMAZON_BLOCK.blocker} Aiper has shipped more than one Seagull SE revision and publishes no model number, so Seagull Pro, Plus and other generations must never be substituted.`,
    unblockAction: `${AMAZON_BLOCK.unblockAction} Alternatively, approval of the Aiper CJ programme (advertiser 6404897) would supply a licensed publisher image feed.`,
  },
];

/**
 * Derivatives of locally stored assets. Empty by construction today: the only
 * locally stored product assets are vector placeholders, which scale to every
 * rendered size without a raster variant. Generating raster copies of an SVG
 * would add bytes and a cache entry for no benefit.
 */
export const DERIVATIVES: import("./types").Derivative[] = [];
