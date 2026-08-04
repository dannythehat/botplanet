/**
 * The asset inventory.
 *
 * Three kinds of record live here and nothing else:
 *   1. original BotPlanet artwork, which we own outright;
 *   2. owner-created product creatives — finished compositions that DO show a
 *      real machine, with BotPlanet branding and headline text set into the
 *      image. Ours, cleared, and still not photography;
 *   3. branded placeholders, which stand in for photography we may not lawfully
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
import DERIVATIVES_JSON from "../../../../../scripts/derivative-manifest.json";
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
  ...(
    [
      ["hero-home-desktop", "/media/home/hero-desktop.webp", 1672, 941, "sha256:ce8f54daae0b0f6f71a1eb087a47b22e2b128846cd95dcd58d77af2374728f28"],
      ["hero-home-mobile", "/media/home/hero-mobile.webp", 941, 1672, "sha256:fed2c212c664eb81cdacd759cf827d48fd9b521a60b3f18d6b3a5c97a0449ae6"],
    ] as const
  ).map(([id, src, width, height, checksum]): MediaAssetRecord => ({
    ...base(id, "botplanet_original"),
    productId: null,
    purpose: "Homepage hero",
    exactModel: null,
    type: "category_hero",
    acquisitionMethod: "authored_in_house",
    checksum,
    width,
    height,
    src,
    altText:
      "A night-time home where six kinds of robot are working at once: a pool cleaner in the water, a window cleaner on the glass, a mower on the lawn, a vacuum on the terrace, a four-legged patrol robot and a companion robot at the door, beneath the BotPlanet logo and the Earth.",
    altTextStatus: "approved",
    // The machines in the frame are rendered generics, not catalogue models, so
    // this illustrates the category set without depicting any product we sell.
    schema: {
      ...ORIGINAL_SCHEMA,
      reason:
        "original brand artwork showing generic machines of each category; it may illustrate the page and preview socially, but depicts no product in the catalogue and is never a Product image",
    },
    depictsRealProduct: false,
    presentation: "bleed",
    retrievedDate: "2026-08-03",
    lastCheckedDate: "2026-08-03",
    notes: "Owner-created, supplied 3 August 2026. Both are authored compositions, not crops — the portrait version is recomposed so all six machines survive on a phone, which a centre crop of the wide file could not do.",
  })),
  ...(
    [
      ["botmatch-explainer-desktop", "/media/botmatch/explainer-desktop.webp", 1672, 941, "sha256:0d914ba007ccd6197e5be035a2cc68d81e4206af5e6bcec13a8116e20ca83674"],
      ["botmatch-explainer-mobile", "/media/botmatch/explainer-mobile.webp", 941, 1672, "sha256:491cc7596cc3902713eb180e662e839a9c505bed917ffdd37b24ec0380ad98fe"],
    ] as const
  ).map(([id, src, width, height, checksum]): MediaAssetRecord => ({
    ...base(id, "botplanet_original"),
    productId: null,
    purpose: "BotMatch explainer on the homepage",
    exactModel: null,
    type: "promotional_panel",
    acquisitionMethod: "authored_in_house",
    checksum,
    width,
    height,
    src,
    altText:
      "A BotMatch panel at the centre of six linked category tiles — pool cleaning, window cleaning, floor care, lawn and garden, security, and companion and service — showing a best-match result being confirmed.",
    altTextStatus: "approved",
    schema: {
      ...ORIGINAL_SCHEMA,
      imageObject: false,
      articleImage: false,
      reason:
        "an interface illustration of BotPlanet's own tool, not editorial content about a product; it may preview socially but must not be emitted as an ImageObject supporting the article",
    },
    depictsRealProduct: false,
    presentation: "bleed",
    retrievedDate: "2026-08-03",
    lastCheckedDate: "2026-08-03",
    notes:
      "Owner-created, supplied 3 August 2026 as a composed desktop/mobile pair. It shows all six categories linked to the matcher; only pool cleaners is live, so the copy beside it must keep saying so — see the section note on the homepage.",
  })),
  /* Homepage category feature artwork. Every one of these is decorative: the
     section's headline, body and buttons are real HTML beside the picture, so
     described alt text would be the same fact told twice. Each file is composed
     with one side dark and empty for the copy — the note records which. */
  ...(
    [
      [
        "feature-pool-category-desktop",
        "/media/pool-category/feature-desktop.webp",
        1672,
        941,
        "sha256:d7e557392590cb1330b44fb75a3a77bde5a39cbe39b480916877d4cfb2df9688",
        "Robotic pool cleaners",
        "Composed with the left third dark and empty. The robot is a rendered generic, deliberately not any brand's model.",
      ],
      [
        "feature-pool-category-mobile",
        "/media/pool-category/feature-mobile.webp",
        857,
        1588,
        "sha256:7802a1cb1b9ba5556fce972a15d4f197418f1993b5e9810b1415515b39a4fcba",
        "Robotic pool cleaners",
        "The portrait companion to the desktop file, supplied later than the rest. Composed for the phone layout: empty upper half for the copy, the machine in the lower half. Inset 42px on every edge from the supplied file, which carried a drawn silver frame a few pixels in from the border — that would have shown as a broken hairline once the picture reaches the plate's edge. Nothing else is altered.",
      ],
      [
        "feature-window-category-desktop",
        "/media/window-category/feature-desktop.webp",
        1672,
        941,
        "sha256:bfcff7b089dd84af0fce770d37a4a5aceb788c47296ebf5ebac75a548463c034",
        "Window-cleaning robots",
        "Composed with the right side open sky, so the copy sits there. The machine is a rendered generic, deliberately not any brand's model.",
      ],
      [
        "feature-window-category-mobile",
        "/media/window-category/feature-mobile.webp",
        857,
        1588,
        "sha256:629d66d2a6d0ea3f848e1edbc5f56da2e04cbc6049371760401009b1e21bc425",
        "Window-cleaning robots",
        "Replaced 3 August 2026 with a version composed for the phone layout: empty upper half, the machine in the lower half so it survives the crop. Inset 42px on every edge from the supplied file, which carried a drawn silver frame a few pixels in from the border. Nothing else is altered.",
      ],
      [
        "feature-lawn-category-desktop",
        "/media/lawn-category/feature-desktop.webp",
        1672,
        941,
        "sha256:7d85dcab488132d6bf5ca8cc7a3db7e6813cbadbe5cf182cb44c177ac93efb26",
        "Lawn and garden robots",
        "Composed with the left third falling to black, so the copy sits there. The mower is a rendered generic, deliberately not any brand's model.",
      ],
      [
        "feature-lawn-category-mobile",
        "/media/lawn-category/feature-mobile.webp",
        857,
        1588,
        "sha256:4060220ccf0869be9ee8f57db1b0ed6fd948635e1f58b0c6c71913538977e8db",
        "Lawn and garden robots",
        "Replaced 3 August 2026 with a version composed for the phone layout: empty upper half, the mower and the lit garden in the lower half so they survive the crop. Inset 42px on every edge from the supplied file, which carried a drawn silver frame a few pixels in from the border. Nothing else is altered.",
      ],
      [
        "feature-floor-category-desktop",
        "/media/floor-category/feature-desktop.webp",
        1672,
        941,
        "sha256:3648b46b2142cbcb99c9a884e95a08f3ba548c1dcca0ef6763369316a2e55abc",
        "Robotic floor cleaners",
        "Composed with the right side an unlit wall, so the copy sits there. The vacuum is a rendered generic, deliberately not any brand's model.",
      ],
      [
        "feature-floor-category-mobile",
        "/media/floor-category/feature-mobile.webp",
        857,
        1588,
        "sha256:f60926001531dcb8967099fb8596a21d26ad57acdfe6a54fa6ef4fb5594f0da4",
        "Robotic floor cleaners",
        "Replaced 3 August 2026 with a version composed for the phone layout: empty upper half, the machine and the lit room in the lower half so they survive the crop. Inset 42px on every edge from the supplied file, which carried a drawn silver frame a few pixels in from the border. Nothing else is altered.",
      ],
      [
        "feature-security-category-desktop",
        "/media/security-category/feature-desktop.webp",
        1672,
        941,
        "sha256:7a23406ed918620f7f49e8f72d470ca7fea6c59dee5de9bfb1cc7c95c9e01c3e",
        "Security robots",
        "Composed with the left half falling to black, so the copy sits there. The patrol robot is a rendered generic, deliberately not any brand's model.",
      ],
      [
        "feature-security-category-mobile",
        "/media/security-category/feature-mobile.webp",
        857,
        1588,
        "sha256:6c0db37f462a87b84684ac4c6a87b689df07eb73cf082f727257ed92426a7b86",
        "Security robots",
        "Replaced 3 August 2026 with a version composed for the phone layout: empty upper half, the patrol robot and the lit approach in the lower half so they survive the crop. Inset 42px on every edge from the supplied file, which carried a drawn silver frame about eight pixels in from the border. Nothing else is altered.",
      ],
      [
        "feature-companion-category-desktop",
        "/media/companion-category/feature-desktop.webp",
        1612,
        881,
        "sha256:06aeafc3a716c0863e733e8b71c43d0f78a154bd9bcf5fd33b71a2fc90dc9400",
        "Companion and service robots",
        "Composed with the left half falling to black, so the copy sits there. Inset 30px on every edge from the supplied file: the original carried a thin blue frame drawn a few pixels in from the border, which would have shown as a broken hairline once the picture bleeds to the section edges. Nothing else is altered and the aspect ratio is untouched beyond that inset.",
      ],
      [
        "feature-companion-category-mobile",
        "/media/companion-category/feature-mobile.webp",
        857,
        1588,
        "sha256:7d7c2853c0ad501b5fdf83a81d23587c3e784969798372063fa39f9a93d7d52c",
        "Companion and service robots",
        "Replaced 3 August 2026 with a version composed for the phone layout: empty upper half, the robot and the lit room in the lower half so they survive the crop. Inset 42px on every edge from the supplied file, which carried a drawn silver frame a few pixels in from the border. Verified clean by scripts/check-drawn-frame.mjs. Nothing else is altered.",
      ],
    ] as const
  ).map(([id, src, width, height, checksum, category, note]): MediaAssetRecord => ({
    ...base(id, "botplanet_original"),
    productId: null,
    purpose: `${category} feature section on the homepage`,
    exactModel: null,
    type: "category_hero",
    acquisitionMethod: "authored_in_house",
    checksum,
    width,
    height,
    src,
    altText: "",
    altTextStatus: "decorative",
    schema: {
      ...ORIGINAL_SCHEMA,
      productImage: false,
      reason:
        "decorative section artwork showing a generic machine; it illustrates the category and depicts no product in the catalogue",
    },
    depictsRealProduct: false,
    presentation: "bleed",
    retrievedDate: "2026-08-03",
    lastCheckedDate: "2026-08-03",
    notes: `Owner-created, supplied 3 August 2026. ${note}`,
  })),
  {
    ...base("promo-botmatch-pool", "botplanet_original"),
    productId: null,
    purpose: "BotMatch promotional panel on the robotic pool cleaners category page",
    exactModel: null,
    type: "promotional_panel",
    acquisitionMethod: "authored_in_house",
    checksum: "sha256:8624684735bcdf34705ee45c7289987780897e0fd5d9b6127207384eada19485",
    width: 941,
    height: 1672,
    src: "/media/matcher/pool-bot-matcher.webp",
    altText:
      "Find your perfect pool bot. Tell us your budget, pool size or priorities like fast shipping, and in 30 seconds we will match you with the right robotic pool cleaner. Start the 30-second match.",
    altTextStatus: "approved",
    // The robot in the frame is a rendered generic machine, not a model we
    // sell, so this panel makes no claim about any product in the catalogue.
    schema: {
      ...ORIGINAL_SCHEMA,
      imageObject: false,
      articleImage: false,
      reason:
        "a promotional panel is advertising, not editorial illustration; it may serve as a social preview but must not be emitted as an ImageObject supporting the article's content",
    },
    depictsRealProduct: false,
    presentation: "bleed",
    retrievedDate: "2026-08-03",
    lastCheckedDate: "2026-08-03",
    notes:
      "Owner-created, supplied 3 August 2026 as a 941×1672 PNG and converted to WebP with no crop or recolour. RETIRED FROM RENDER on 3 August 2026: the headline, body copy and button are drawn into the artwork, which makes every word of the offer invisible to search and turns the button into a picture of a button. The BotMatch panel now renders real copy and a real link beside text-free artwork. The record is kept because the file is BotPlanet's own work and may be reused as a social card, where baked-in type is the right choice.",
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
/* Owner-created product creatives                                     */
/* ------------------------------------------------------------------ */

/**
 * Danny's own artwork for five pool robots, supplied 3 August 2026.
 *
 * These are NOT placeholders and NOT product photography. Each is a finished
 * BotPlanet composition: the robot in a scene, with BotPlanet branding and
 * headline text set into the image. That distinction drives three decisions:
 *
 *  - `depictsRealProduct` is true, so the "MEDIA PENDING" treatment that hides
 *    placeholders does not apply and the card renders the artwork;
 *  - `productImage` is false, because a search engine reading Product schema
 *    expects a photograph of the product, not a creative with marketing text
 *    burnt into it;
 *  - `presentation` is "bleed", because the composition is the whole frame.
 *    Cropping one to a 4:3 card would cut the model name off the top.
 *
 * The claims printed inside the artwork ("up to 2.5 hours of runtime", "3µm
 * MicroMesh filter") are brand copy. They carry no evidence weight here: any
 * specification that appears as body copy still needs its own evidence record,
 * exactly as it would if the artwork did not exist.
 *
 * Rights: owned outright — see public/media/products/RIGHTS.md.
 */
const OWNER_ARTWORK_SCHEMA: SchemaEligibility = {
  productImage: false,
  imageObject: true,
  articleImage: true,
  openGraph: true,
  twitter: true,
  reason:
    "an owner-created creative depicts the real product but carries BotPlanet branding and headline text set into the image; Product schema expects a clean photograph, so it illustrates and previews but never stands as the product image",
};

interface OwnerArtwork {
  slug: string;
  file: string;
  checksum: string;
  width: number;
  height: number;
  /** What the composition actually shows, beyond the robot itself. */
  scene: string;
}

const OWNER_ARTWORK: OwnerArtwork[] = [
  {
    slug: "dolphin-nautilus-cc-plus",
    file: "dolphin-nautilus-cc-plus.webp",
    checksum: "sha256:4bf32f1eb3d1918a24ca79b85edd80c58a08e9b4e32976de0cfb86ecd39855fe",
    width: 1122,
    height: 1402,
    scene:
      "the black and blue cleaner lifting out of dark water beside a phone showing the Dolphin app, over icons for Wi-Fi control, wall climbing and top-load filter access",
  },
  {
    slug: "polaris-freedom",
    file: "polaris-freedom.webp",
    checksum: "sha256:a224297287dffbe25f8b55206705dc2a1eb062083d48fcf2c7a5fa4675b0ea4b",
    width: 1200,
    height: 1200,
    scene:
      "the blue tracked cordless cleaner in shallow water beside a phone showing the Polaris app, with callouts for cordless running, four cleaning modes, navigation and the top-load filter",
  },
  {
    slug: "betta-se-plus",
    file: "betta-se-plus.webp",
    checksum: "sha256:eb452fb8b81bec8339ccd0b8a99d19daf82eb7886141e56a10cdf068a632b890",
    width: 1200,
    height: 1200,
    scene:
      "the solar-panelled surface skimmer floating on a leaf-strewn pool in a sunlit garden, with callouts for continuous surface cleaning, solar charging, dual charging and shallow-water safeguarding",
  },
  {
    slug: "dolphin-proteus-dx4-plus",
    file: "dolphin-proteus-dx4-plus.webp",
    checksum: "sha256:1fe618cc48b9c5f80eb025f1fc81176646415fb563d6d7a85d650da5a5353052",
    width: 1200,
    height: 1200,
    scene:
      "the grey and blue tracked cleaner resting on stone coping beside a curved pool at dusk, with callouts for navigation, wall and waterline cleaning and top-load filtration",
  },
  {
    slug: "aiper-scuba-s1",
    file: "aiper-scuba-s1.webp",
    checksum: "sha256:147316cbcc6b17b06f23b0f71ff8399b6492973a9b399d1a95ad77184f15ee05",
    width: 1402,
    height: 1122,
    scene:
      "the grey and black tracked cleaner on wet paving beside a lit pool at night, with a phone showing the Aiper app mid-cycle and callouts for navigation, suction, waterline cleaning, filtration and battery life",
  },
  {
    // The file name follows the product ID, as every file here does. What it
    // DEPICTS is the BuBlue that this record now holds — see product-names.ts.
    slug: "dolphin-premier",
    file: "dolphin-premier.webp",
    checksum: "sha256:d423972cffdbc682bf25b7818e173edd33271322930f1022b8c0f18cbca06c56",
    width: 1402,
    height: 1122,
    scene:
      "the grey corded cleaner on its caddy at the poolside at night, lit blue along its front edge, with a phone showing the BuBlue app and callouts for suction, navigation, runtime, filtration and app control",
  },
  {
    slug: "aiper-scuba-x1",
    file: "aiper-scuba-x1.webp",
    checksum: "sha256:b61a0d6a69177adb170f8550f7f21a9c6ba10857f6c7f61b943c3f0de44ec496",
    width: 1402,
    height: 1122,
    scene:
      "the grey and black cleaner on its dock at the poolside at night, 'SCUBA X1 Pro Max' printed on its front, with a phone showing the Aiper app and callouts for suction, surface skimming, navigation, filtration and runtime",
  },
  {
    slug: "aiper-seagull-se",
    file: "aiper-seagull-se.webp",
    checksum: "sha256:8a2ea0d26ab0dc08090cb46927106f189c210fc8111fd62347ab53dcd8142f2d",
    width: 1254,
    height: 1254,
    scene:
      "the compact grey cleaner on poolside paving next to its retrieval hook, 'SEAGULL SE' on the carry handle, with callouts for cordless running, self-parking, easy retrieval and a compact build",
  },
  {
    slug: "beatbot-aquasense-2-ultra",
    file: "beatbot-aquasense-2-ultra.webp",
    checksum: "sha256:ed6e41162f96875cda3a335032630e6bf24fa2a5fec5fb32094c681edd8aaa6f",
    width: 1254,
    height: 1254,
    scene:
      "the dark grey cleaner tilted on its dock beside a lit infinity pool at dusk, with a phone showing the AquaSense 2 Ultra app mid-cycle and callouts for app control, floor, wall and waterline cleaning, cordless running and navigation",
  },
  {
    slug: "wybot-c1",
    file: "wybot-c1.webp",
    checksum: "sha256:c6fcc066410578e897e331420bd6eb82e5eaeab4970d97167aa578b5fab71b0b",
    width: 1254,
    height: 1254,
    scene:
      "the black and silver tracked cleaner on stone paving beside a lit pool at dusk, with a phone showing the WYBOT app and callouts for app control, floor, wall and waterline cleaning, cordless running and navigation",
  },
  {
    slug: "aiper-scuba-v3-ai-vision",
    file: "aiper-scuba-v3-ai-vision.webp",
    checksum: "sha256:e32fc4d8cd4bab2736e61c45800795c191d054015c108af0a8e0a362ec723c19",
    width: 1200,
    height: 1200,
    scene:
      "the black cordless cleaner on its charging dock beside a lit resort pool, with callouts for camera navigation, wireless charging, weight, filtration and floor, wall and waterline cleaning",
  },
];

export const OWNER_PRODUCT_ARTWORK: MediaAssetRecord[] = OWNER_ARTWORK.map((a): MediaAssetRecord => {
  const productId = PRODUCT_ID[a.slug] ?? `prod-${a.slug}`;
  // The model name comes from the verification record, never from the file
  // name, so a renamed file can never quietly move artwork onto a sibling model.
  const model = VERIFICATIONS.find((v) => v.productId === productId)?.identity.canonicalName ?? null;
  return {
    ...base(`art-${a.slug}`, "botplanet_original"),
    productId,
    purpose: null,
    exactModel: model,
    type: "product_hero",
    acquisitionMethod: "authored_in_house",
    checksum: a.checksum,
    width: a.width,
    height: a.height,
    src: `/media/products/${a.file}`,
    // The alt text describes what is in the frame and names the model. It does
    // not repeat the sales claims printed in the artwork, because a screen
    // reader user should get the picture, not the pitch.
    altText: `BotPlanet artwork for the ${model}: ${a.scene}.`,
    altTextStatus: "approved",
    schema: OWNER_ARTWORK_SCHEMA,
    depictsRealProduct: true,
    presentation: "bleed",
    retrievedDate: "2026-08-03",
    lastCheckedDate: "2026-08-03",
    notes:
      "Owner-created creative, optimised from a PNG master to WebP with no crop, recolour or removal of in-image text. Not Amazon Program Content — see public/media/products/RIGHTS.md.",
  };
});

/* ------------------------------------------------------------------ */
/* Review article figures                                             */
/* ------------------------------------------------------------------ */

/**
 * Owner-created figures that illustrate a review, keyed to the section they
 * belong beside.
 *
 * THE RULE, AS THE OWNER SET IT ON 4 AUGUST 2026. These creatives carry
 * headline text set into the image, and that text makes claims. Where a claim
 * does not match the manufacturer's own sources, THE DEFAULT IS TO PUBLISH THE
 * FIGURE AND STATE THE CORRECTION IN ITS CAPTION — not to withhold it. A
 * reader who sees a docking station and reads "no dock is included" underneath
 * has been told the truth and kept the picture. A reader who sees neither has
 * been given less.
 *
 * BRANDING IS NOT A REASON TO WITHHOLD, AND NEVER WAS. These are BotPlanet
 * creatives. The BotPlanet mark appearing on the machine in them is the
 * owner's own design decision about the owner's own artwork, and an earlier
 * version of this file treated it as a misrepresentation. That was wrong and
 * the objection is deleted rather than softened.
 *
 * REVIEW_FIGURES_WITHHELD is now only for a creative whose headline directly
 * contradicts the review's central finding — where publishing it would state
 * in pixels the opposite of what the page states in words, and no caption can
 * hold both. That is a narrow case, and it is meant to stay narrow.
 *
 * Like the product creatives, the claims printed inside carry no evidence
 * weight: a specification still needs its own evidence record.
 */
interface ReviewFigure {
  slug: string;
  /** Review this belongs to. */
  productSlug: string;
  /**
   * What the figure actually is.
   *
   * Deliberately never `product_hero`: that type is what the card and the
   * listing resolve to, and a second one per product would quietly outrank the
   * product creative and skew the readiness report. A review figure is an
   * extra view, not a replacement hero.
   */
  type: "product_in_use" | "app_screenshot" | "filtration_detail" | "included_accessories";
  file: string;
  checksum: string;
  width: number;
  height: number;
  /** What the composition shows — becomes the alt text, minus the pitch. */
  scene: string;
}

const REVIEW_FIGURES: ReviewFigure[] = [
  {
    slug: "hero",
    productSlug: "dolphin-nautilus-cc-plus",
    type: "product_in_use",
    file: "hero.webp",
    checksum: "sha256:5b07c200a41f5890ee6f1177aaa214620f890940af4bde0d5908983d2e010048",
    width: 1122,
    height: 1402,
    scene:
      "the black and blue cleaner lifting out of dark water beside a phone showing the Dolphin app, above three panels marked Wi-Fi control, wall climbing and top-load filter access",
  },
  {
    slug: "plug-and-play",
    productSlug: "dolphin-nautilus-cc-plus",
    type: "product_in_use",
    file: "plug-and-play.webp",
    checksum: "sha256:627f2c1a22a08551ee965c451ed17bec7275f91a7e147082a39e2c31c630ed15",
    width: 1254,
    height: 1254,
    scene:
      "the cleaner beside its power supply at the edge of a lit pool at night, with a hand pressing the single button on the caddy",
  },
  {
    slug: "app-control",
    productSlug: "dolphin-nautilus-cc-plus",
    type: "app_screenshot",
    file: "app-control.webp",
    checksum: "sha256:b909f05f0d7989c7d27d8b74b160534bc59f12e448bb77cccc47d9a0acc21531",
    width: 1254,
    height: 1254,
    scene:
      "the cleaner on wet stone beside a phone running the MyDolphin Plus app, showing a scheduled quick clean",
  },
  {
    slug: "video-poster",
    productSlug: "dolphin-nautilus-cc-plus",
    type: "product_in_use",
    file: "video-poster.webp",
    checksum: "sha256:d40f53d5f461b7f7260ceb402b818f8981f0d0bca64a65d0b840b84ca24823d9",
    width: 1672,
    height: 941,
    scene:
      "a BotPlanet review card for the machine, shown beside a phone running the MyDolphin Plus app with a Wi-Fi symbol between them",
  },
  {
    slug: "filter-access",
    productSlug: "dolphin-nautilus-cc-plus",
    type: "filtration_detail",
    file: "filter-access.webp",
    checksum: "sha256:8f9cc28e112d152edb838f5e04e74a3fae9d817a20b759bdf1a6fd47b227ff92",
    width: 1254,
    height: 1254,
    scene:
      "two hands lifting the filter baskets out through the top of the machine at the poolside",
  },

  /* ---- Polaris FREEDOM ---- */
  {
    slug: "hero",
    productSlug: "polaris-freedom",
    type: "product_in_use",
    file: "hero.webp",
    checksum: "sha256:9c0fdbb8ca88073fab0b2cce35b4da9ff1c29e6596da7a3ddec0bf1a53aa811c",
    width: 1254,
    height: 1254,
    scene:
      "the blue and black tracked cleaner at the edge of a lit pool at night beside a phone showing a two hour thirty cycle running in floor and wall mode",
  },
  {
    slug: "cordless-dock",
    productSlug: "polaris-freedom",
    type: "product_in_use",
    file: "cordless-dock.webp",
    checksum: "sha256:bf0532219a9d0c3d0cff9786fc7a548a7a2742d1470ed0d5b0a1f744c24a9b64",
    width: 1254,
    height: 1254,
    scene:
      "the cleaner standing on a terrace beside its upright charging station and a phone, with a lit pool behind",
  },
  {
    slug: "app-control",
    productSlug: "polaris-freedom",
    type: "app_screenshot",
    file: "app-control.webp",
    checksum: "sha256:e1568cf32873fe756c8b9f93ca29a5b3603ec216364d32ba5cc9b891ec87ef52",
    width: 1254,
    height: 1254,
    scene:
      "a phone running the iAquaLink app showing a two hour thirty floor and wall cycle and a full battery, beside the cleaner at a lit poolside",
  },

  /* ---- Betta SE Plus ---- */
  {
    slug: "hero",
    productSlug: "betta-se-plus",
    type: "product_in_use",
    file: "hero.webp",
    checksum: "sha256:5fb5ca3a267fb34f6b10e8c36a4d4f1405977fb052b1e1864e39c9601d475e83",
    width: 1254,
    height: 1254,
    scene:
      "the silver solar skimmer floating on a sunlit pool among fallen leaves, with its solar panel facing up",
  },
  {
    slug: "twin-motors",
    productSlug: "betta-se-plus",
    type: "product_in_use",
    file: "twin-motors.webp",
    checksum: "sha256:f58d95ccb170f386881acc70c654d1fbadfeced3a52dbea1a181c69ba4072a0c",
    width: 1254,
    height: 1254,
    scene:
      "the skimmer at a poolside beside a wall-mounted charger and a free-standing solar panel, above three panels on motors, solar charging and shallow water",
  },
  {
    slug: "sensors",
    productSlug: "betta-se-plus",
    type: "product_in_use",
    file: "sensors.webp",
    checksum: "sha256:406495e30ccf8e52f859c594adeaa8429f51eaad5fe01908463e2c7cf8bb1923",
    width: 1254,
    height: 1254,
    scene:
      "the skimmer on a dark pool with sensor arcs drawn around it, above three panels on obstacle detection, edge navigation and the UV-resistant shell",
  },
  {
    slug: "debris-basket",
    productSlug: "betta-se-plus",
    type: "filtration_detail",
    file: "debris-basket.webp",
    checksum: "sha256:521af3f70232a084dada6b2f0ef73014162f198804494e9aac0cbb4dc42998ca",
    width: 1254,
    height: 1254,
    scene:
      "the skimmer with its top cover raised showing a basket full of leaves, above a three-step sequence ending with the basket being emptied into a bin",
  },

  /* ---- Dolphin Proteus DX4 Plus ---- */
  {
    slug: "hero",
    productSlug: "dolphin-proteus-dx4-plus",
    type: "product_in_use",
    file: "hero.webp",
    checksum: "sha256:4322c17dd68111fc13da45f2ae7e791f2f758bf39df352c8192cbe417c5a4236",
    width: 1254,
    height: 1254,
    scene:
      "the white and blue tracked cleaner on stone paving beside a curved pool at dusk, with its cable coiled behind it",
  },
  {
    slug: "every-surface",
    productSlug: "dolphin-proteus-dx4-plus",
    type: "product_in_use",
    file: "every-surface.webp",
    checksum: "sha256:48de5cb59170a0064249f67d36ddb32bec2a59f0f086f4739e6d998900e27de8",
    width: 1254,
    height: 1254,
    scene:
      "the cleaner on a pool floor with two further views of it climbing a tiled wall above, beside panels naming floor cleaning, wall climbing and waterline coverage",
  },
  {
    slug: "weekly-timer",
    productSlug: "dolphin-proteus-dx4-plus",
    type: "product_in_use",
    file: "weekly-timer.webp",
    checksum: "sha256:b8058f4fc5bb966b85df51997ad4c2125e3453334e292c2870bc2dae8cf4e103",
    width: 1254,
    height: 1254,
    scene:
      "the cleaner beside its mains power supply unit at a poolside, with the supply's button panel facing the camera",
  },
  {
    slug: "filtration",
    productSlug: "dolphin-proteus-dx4-plus",
    type: "filtration_detail",
    file: "filtration.webp",
    checksum: "sha256:b7b1d51d8db347685e6f292a6ff9ef1a499cad06ab563ed5cc42ad3a93587e25",
    width: 1536,
    height: 1536,
    scene:
      "a hand lifting the filter cartridge out through the opened top lid of the machine at the poolside",
  },

  /* ---- Aiper Scuba V3 AI Vision ---- */
  {
    slug: "hero",
    productSlug: "aiper-scuba-v3-ai-vision",
    type: "product_in_use",
    file: "hero.webp",
    checksum: "sha256:5eff3711d840b749d6b3d20b33dd7091e5f9f0f13b2081ff4ba267574c592fac",
    width: 1254,
    height: 1254,
    scene:
      "the black tracked cleaner with a teal vent standing on stone beside a night pool, next to a phone showing the Aiper app, above five feature panels",
  },
  {
    slug: "ai-patrol",
    productSlug: "aiper-scuba-v3-ai-vision",
    type: "product_in_use",
    file: "ai-patrol.webp",
    checksum: "sha256:e6919910f0c44b2f42920ffe73ae88c02440fff4ac65313d7e9a828b1035e1c2",
    width: 1254,
    height: 1254,
    scene:
      "the cleaner head-on with three headlight beams sweeping a gridded pool floor, with leaves, sand, twigs and pebbles picked out in target frames around it",
  },
  {
    slug: "carefree",
    productSlug: "aiper-scuba-v3-ai-vision",
    type: "app_screenshot",
    file: "carefree.webp",
    checksum: "sha256:9c01cb4b112ebb3150231576f454f7da96dd07732015a9bce21822340680976a",
    width: 1254,
    height: 1254,
    scene:
      "the cleaner at a daylight poolside above a cutaway pool diagram showing its cleaning path, beside a phone running the Aiper app in AI Navium mode",
  },
  {
    slug: "filtration",
    productSlug: "aiper-scuba-v3-ai-vision",
    type: "filtration_detail",
    file: "filtration.webp",
    checksum: "sha256:fd5f8fd9bc3f627c73c2c6ad0e4f923387bec1661c3288c4bb98ba362b06bd9a",
    width: 1254,
    height: 1254,
    scene:
      "an exploded view of the white filter basket inside the dark debris basket, with the mesh layers fanned out and the 3 micron and 180 micron layers labelled",
  },

  /* ---- Aiper Scuba X1 Pro Max ---- */
  {
    slug: "hero",
    productSlug: "aiper-scuba-x1-pro-max",
    type: "product_in_use",
    file: "hero.webp",
    checksum: "sha256:b52ba7ea6db769785e39c3d2cf7658193102a02d584e5a9e3741da95bbbd31a3",
    width: 1402,
    height: 1122,
    scene:
      "the dark tracked flagship at the edge of a night pool, sensor beams fanning across scattered leaves, beside a feature list from surface skimming to app control",
  },
  {
    slug: "suction",
    productSlug: "aiper-scuba-x1-pro-max",
    type: "product_in_use",
    file: "suction.webp",
    checksum: "sha256:8f4d13a8bf77f9349d1bbfc426da93c672b33135df488929eb6e43566187378a",
    width: 1254,
    height: 1254,
    scene:
      "the cleaner on a leaf-strewn pool floor with two jets of water rising from its outlets and suction streaks drawn ahead of it",
  },
  {
    slug: "runtimes",
    productSlug: "aiper-scuba-x1-pro-max",
    type: "product_in_use",
    file: "runtimes.webp",
    checksum: "sha256:8e49037240001266efface4ff526d4a8e5ab9beea74581007137c21261682de6",
    width: 1254,
    height: 1254,
    scene:
      "the cleaner floating at the surface of a lit pool at night beside three duration panels for surface, floor and eco cleaning",
  },
  {
    slug: "filtration",
    productSlug: "aiper-scuba-x1-pro-max",
    type: "filtration_detail",
    file: "filtration.webp",
    checksum: "sha256:df490c18c93c4c510b13d96dc257b930249e2aca2661bce5e1b51926573145aa",
    width: 1254,
    height: 1254,
    scene:
      "two filter baskets side by side underwater — the 180 micron standard mesh with leaves and stones, and the 3 micron ultra-fine basket with dust and algae",
  },

  /* ---- Aiper Seagull SE ---- */
  {
    slug: "hero",
    productSlug: "aiper-seagull-se",
    type: "product_in_use",
    file: "hero.webp",
    checksum: "sha256:54703cc18761b0ce99c25efac24ceb493de9a11c873a98712d60aa012a30e71c",
    width: 1254,
    height: 1254,
    scene:
      "the compact grey cleaner with its carbon-weave handle beside its retrieval hook at a poolside, above panels for cordless design, self-parking, easy retrieval and compact build",
  },
  {
    slug: "charging",
    productSlug: "aiper-seagull-se",
    type: "product_in_use",
    file: "charging.webp",
    checksum: "sha256:5a7de7cd2ba442947a13b668232aeacdd8b12ae0d8467c2431a6490b6a526cd2",
    width: 1254,
    height: 1254,
    scene:
      "the cleaner on an indoor floor beside its wall charger, with a 2.5 hours badge and a note comparing charging time with the Seagull 600",
  },
  {
    slug: "battery",
    productSlug: "aiper-seagull-se",
    type: "product_in_use",
    file: "battery.webp",
    checksum: "sha256:0019449cb5ac7a89c2f68a27d338dd58c852e767ccdb6f1f8233b0017dd3efdc",
    width: 1254,
    height: 1254,
    scene:
      "an above-ground pool seen from directly overhead on a lawn, the cleaner working inside a 90 minutes dial, with a 2x battery badge in the corner",
  },
  {
    slug: "retrieval",
    productSlug: "aiper-seagull-se",
    type: "product_in_use",
    file: "retrieval.webp",
    checksum: "sha256:8aaaec19e73c52ae4b80815d48307fe0f203cd25fb3c1d51d5ba9c16afa2e49d",
    width: 1254,
    height: 1254,
    scene:
      "the cleaner lifted dripping from an infinity pool on the included hook and pole, with feature panels beneath",
  },

  /* ---- Aiper Scuba S1 ---- */
  {
    slug: "hero",
    productSlug: "aiper-scuba-s1",
    type: "product_in_use",
    file: "hero.webp",
    checksum: "sha256:06956efa784e4feaf74788e81ca1ac640da5e2a03c466859abbbfa390f770168",
    width: 1402,
    height: 1122,
    scene:
      "the grey and black tracked cleaner at the edge of a night pool beside a phone showing the Aiper app with floor, wall, waterline and all modes and a running countdown",
  },
  {
    slug: "four-zone",
    productSlug: "aiper-scuba-s1",
    type: "product_in_use",
    file: "four-zone.webp",
    checksum: "sha256:533aab1a96f58ab716af2a2aa99896767accb8afa0121bea680d9047ab444cc9",
    width: 1254,
    height: 1254,
    scene:
      "a daylight pool seen from above with the cleaner shown working four labelled zones — shallow areas, waterline, walls and floors — while a woman and a dog rest poolside",
  },
  {
    slug: "filtration",
    productSlug: "aiper-scuba-s1",
    type: "filtration_detail",
    file: "filtration.webp",
    checksum: "sha256:556a3fbe627798de01c6467d7580ba911ee4cd3287b571ea89db85822ad16dc2",
    width: 1254,
    height: 1254,
    scene:
      "the dark 180 micron filter basket and the white 3 micron ultra-fine basket side by side underwater, with debris icons from leaves to algae beneath",
  },
  {
    slug: "modes",
    productSlug: "aiper-scuba-s1",
    type: "app_screenshot",
    file: "modes.webp",
    checksum: "sha256:0a5ee1d05acf23f35cff63378456bc8280a0c1f0280240a7c167f292c5f61502",
    width: 1254,
    height: 1254,
    scene:
      "the cleaner on rippling night water beside five labelled mode buttons — wall, eco, auto, floor and schedule — above a weekly day picker",
  },

  /* ---- BuBlue Bubot 800P Gen2 ----
     The hero prints 9.0 in / 18.3 in dimensions and a 49.21 ft cable, and the
     shallow creative prints a 12 in minimum operational depth. The dimensions
     differ slightly from the listing's 19 x 18 x 9, the cable figure is
     research-only, and the depth claim has NO source at all — BuBlue's own
     page claims shallow-zone AVOIDANCE, not shallow-zone cleaning. All four
     publish per the owner's standing rule; the review and captions carry the
     corrections. */
  {
    slug: "hero",
    productSlug: "bublue-bubot-800p",
    type: "product_in_use",
    file: "hero.webp",
    checksum: "sha256:6adf599e12464f147c001c4e87a64ae60d50c3d2a025143c6d59f7c095699e9a",
    width: 1254,
    height: 1254,
    scene:
      "the grey tracked cleaner on a sunlit pool deck under the words Your Pool's Reliable Partner, with size and cable-length callouts beside it",
  },
  {
    slug: "filtration",
    productSlug: "bublue-bubot-800p",
    type: "filtration_detail",
    file: "filtration.webp",
    checksum: "sha256:001757383f5b1d173f54ed637d99b6a7d0e4d661952ce912a10af249f49604bb",
    width: 1254,
    height: 1254,
    scene:
      "the cleaner opened to show its two 3-litre filter baskets, with 180 micron ultra-fine filtration callouts around them",
  },
  {
    slug: "schedule",
    productSlug: "bublue-bubot-800p",
    type: "app_screenshot",
    file: "schedule.webp",
    checksum: "sha256:71db4c4676e602ea576b232299712f16fecbcf34350f2072a6358408c0c87684",
    width: 1254,
    height: 1254,
    scene:
      "the cleaner working a pool floor beside a phone showing the app's weekly cleaning schedule calendar",
  },
  {
    slug: "shallow",
    productSlug: "bublue-bubot-800p",
    type: "product_in_use",
    file: "shallow.webp",
    checksum: "sha256:6d15f822e8d99b2a8df804fc462c5b7043ef36846e76201a52db094b2c9bbed4",
    width: 1254,
    height: 1254,
    scene:
      "the cleaner on a shallow tanning platform in clear water, with a 12 inch depth callout beside it",
  },

  /* ---- WYBOT C1 ----
     The suction creative prints 65 W motors, an 11.5 m³/h flow rate and
     four-wheel drive; the charging creative prints 4,600 mAh. WYBOT's page
     states 3,038 GPH (11.5 m³/h is that figure converted), a triple-motor
     system with no wattage, treads in every photo, and no battery capacity.
     The 3-hour charge IS WYBOT's own figure. All four publish per the owner's
     standing rule; the review and captions carry the corrections. */
  {
    slug: "hero",
    productSlug: "wybot-c1",
    type: "product_in_use",
    file: "hero.webp",
    checksum: "sha256:b4a18087fa075c54dc7b5be415cdc5129402269ae1c26212c25bf90ca7896274",
    width: 1254,
    height: 1254,
    scene:
      "the black and silver tracked cleaner on stone paving beside a night pool, next to a phone showing the WYBOT app and panels for app control, floor, wall and waterline cleaning, cordless running and navigation",
  },
  {
    slug: "suction",
    productSlug: "wybot-c1",
    type: "product_in_use",
    file: "suction.webp",
    checksum: "sha256:6c536beaec7191f4b59f77ec6d0b889d97d17beedc1c165aa4ad691ab802a803",
    width: 1254,
    height: 1254,
    scene:
      "the cleaner underwater from below, intake vortices drawing in leaves, above a row of debris icons for leaves, dirt, hair and twigs",
  },
  {
    slug: "cycles",
    productSlug: "wybot-c1",
    type: "app_screenshot",
    file: "cycles.webp",
    checksum: "sha256:3c7ef23bd1d13bc9fa6783cf5d10ac965ffa92162871c91dbb32c4c6a620d164",
    width: 1254,
    height: 1254,
    scene:
      "a phone showing the WYBOT app's cycle timer beside a ring diagram splitting one charge into one, two, three or four cleaning days",
  },
  {
    slug: "charging",
    productSlug: "wybot-c1",
    type: "product_in_use",
    file: "charging.webp",
    checksum: "sha256:65817bf8450d34f82109ead5302ab830cf96f2ff691de233543028c296b71807",
    width: 1254,
    height: 1254,
    scene:
      "the cleaner plugged into a wall charger on a poolside patio at night, with badges for charging time and battery capacity",
  },
];

/**
 * Supplied, and deliberately not published.
 *
 * Each of these prints a claim the review refutes from the manufacturer's own
 * technical sheet. Putting them on the page would state in pixels the opposite
 * of what the page states in words — and the picture is what a reader believes.
 */
export const REVIEW_FIGURES_WITHHELD: {
  productSlug: string;
  supplied: string;
  claim: string;
  contradicts: string;
}[] = [
  {
    productSlug: "dolphin-nautilus-cc-plus",
    supplied: "Smart Navigation",
    claim: "Full pool coverage — cleans floors, walls and waterline",
    contradicts:
      "Maytronics' technical sheet for part 99996409-PCI lists Waterline Scrubbing: No. The review's second section is about this exact claim.",
  },
  {
    productSlug: "dolphin-nautilus-cc-plus",
    supplied: "Wall Climbing Capability",
    claim: "Total pool coverage — cleans floors, walls, and waterline thoroughly",
    contradicts:
      "Same sheet, same field. The headline of this creative is accurate; only the third bullet is not.",
  },
  {
    productSlug: "dolphin-nautilus-cc-plus",
    supplied: "Product Anatomy",
    claim: "Active scrubbing brush — helps loosen dirt and debris",
    contradicts:
      "The same sheet lists Active Brush: No, and the review states 'Actively driven brush: No'. The brushes are passive and work as the robot moves.",
  },
  {
    productSlug: "polaris-freedom",
    supplied: "FREEDOM — Clean. Smart. Cordless. (supplied as the main image)",
    claim: "4 intelligent cleaning modes: Floor, Wall, Waterline & Max Clean",
    contradicts:
      "There is no mode called Max Clean. Polaris's own listing bullet names the four as: floor, and floor+walls+waterline on the unit, plus Waterline only and SMART Cycle in the app. 'Max Clean' appears nowhere in the listing, the manual, the quick start guide or the support page. Everything else in this creative checks out — 2.5 hours, 50 ft, lithium-ion, cordless — so it is one wrong word on an otherwise accurate image, and changing it to SMART Cycle would make it publishable.",
  },
  {
    productSlug: "polaris-freedom",
    supplied: "Waterline Retrieval Options",
    claim: "Three retrieval options, including 'Tap & Lift — tap the robot on the top and it will rise to the waterline for easy lifting'",
    contradicts:
      "Polaris publishes TWO retrieval methods, not three: 'FREEDOM climbs to the waterline at end-of-cycle for lightweight removal... Or use the manual retrieval hook (included) and a standard pole.' The climb is automatic at the end of a cycle — no tap. Tapping the machine to summon it is not a feature Polaris describes anywhere. The push-notification panel on this creative IS accurate; it is presented as a third retrieval method, which it is not.",
  },
];

export const REVIEW_FIGURE_ASSETS: MediaAssetRecord[] = REVIEW_FIGURES.map((f): MediaAssetRecord => {
  const productId = PRODUCT_ID[f.productSlug] ?? `prod-${f.productSlug}`;
  const model = VERIFICATIONS.find((v) => v.productId === productId)?.identity.canonicalName ?? null;
  return {
    ...base(`fig-${f.productSlug}-${f.slug}`, "botplanet_original"),
    productId,
    purpose: `Review figure: ${f.slug}`,
    exactModel: model,
    type: f.type,
    acquisitionMethod: "authored_in_house",
    checksum: f.checksum,
    width: f.width,
    height: f.height,
    src: `/media/reviews/${f.productSlug}/${f.file}`,
    // Describes the frame and names the model. It does not repeat the sales
    // claims printed in the artwork: a screen reader user gets the picture,
    // not the pitch.
    altText: `BotPlanet artwork for the ${model}: ${f.scene}.`,
    altTextStatus: "approved",
    schema: OWNER_ARTWORK_SCHEMA,
    depictsRealProduct: true,
    presentation: "bleed",
    retrievedDate: "2026-08-03",
    lastCheckedDate: "2026-08-03",
    notes:
      "Owner-created review figure, optimised from a PNG master to WebP with no crop, recolour or removal of in-image text. Published only because its printed claims agree with the review — see REVIEW_FIGURES_WITHHELD for the ones that do not.",
  };
});

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

/* Owner artwork sits ahead of the placeholders so a product that has both
   resolves to the artwork; the placeholder stays as the fallback if the
   artwork is ever withdrawn. */
export const MEDIA_ASSETS: MediaAssetRecord[] = [
  ...ORIGINAL_ASSETS,
  ...OWNER_PRODUCT_ARTWORK,
  ...REVIEW_FIGURE_ASSETS,
  ...PLACEHOLDER_ASSETS,
];

/* ------------------------------------------------------------------ */
/* Why no product photography exists yet                               */
/* ------------------------------------------------------------------ */

const AMAZON_BLOCK = {
  bestAvailableTier: "affiliate_api" as const,
  checked: [
    "Amazon Associates US account (ownership and current approval unverified — pending owner confirmation)",
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
 *
 * A blocker here is about PHOTOGRAPHY. Five products now carry owner-created
 * BotPlanet artwork (OWNER_PRODUCT_ARTWORK above), so their cards are no longer
 * empty — but a creative is not a packshot, and the blocker below still stands
 * for anything that needs an actual photograph of the machine.
 */
const HAS_OWNER_ARTWORK =
  " BotPlanet's own artwork now fills this product's card; that is a creative, not photography, and does not clear this blocker.";

export const ACQUISITION_BLOCKERS: AcquisitionBlocker[] = [
  {
    productId: "prod-aiper-scuba-v3-ai-vision",
    bestAvailableTier: "affiliate_media_feed" as const,
    checked: [
      "aiper.com/us/aiper-scuba-v3 — read 4 August 2026; product photography present, no media library or press-kit licence published",
      "Amazon US listing B0GG97427D — read 4 August 2026; retailer listing, not a licensable media source",
      "Aiper US affiliate programme — direct programme exists (hasDirectAffiliate: true in the brand record) but no media-feed credentials are held",
    ],
    blocker:
      "NO LICENSED PHOTOGRAPHY ROUTE IS OPEN YET. Aiper runs a direct affiliate programme, which is the plausible lawful source for product imagery, but BotPlanet holds no approved membership or feed credentials for it. Aiper's own site publishes photography with no stated reuse licence, and the Amazon listing may not be scraped under Associates rules. The product currently renders owner-created BotPlanet creatives and a branded placeholder, not photography.",
    unblockAction:
      "Apply to Aiper's direct affiliate programme and request media-kit access for the Scuba V3. On approval, store the feed credentials as a Worker secret and ingest through the existing registry — matching on the exact name 'Scuba V3', because Aiper publishes no SKUs and the S1, X1 and X1 Pro Max separate only by name.",
    owner: "manufacturer" as const,
  },
  {
    productId: "prod-dolphin-proteus-dx4-plus",
    bestAvailableTier: "manufacturer_press_kit" as const,
    checked: [
      "Maytronics US site — no product page for the Proteus DX4 Plus found on 4 August 2026",
      "Amazon US listing B083YWJ5PQ — read 3 and 4 August 2026; retailer listing, not a licensable media source",
      "No Maytronics press room or media library published for the Proteus range",
    ],
    blocker:
      "NO MANUFACTURER SOURCE EXISTS TO LICENCE FROM. Maytronics publishes no product page for this model that we have been able to find, so there is no press kit, no media library and no image licence to ask for. The Amazon listing carries photography, but a retailer listing grants no reuse right and the Associates programme forbids scraping it. The same problem blocks the specification: every figure on this product is retailer-sourced, which is why its evidence label reads Researched rather than Manufacturer data verified.",
    unblockAction:
      "Ask Maytronics US directly for a product page URL and a media pack for part 99996207-LESW, naming the Proteus DX4 Plus specifically — the DX4 and DX4 Plus are different machines and a pack for the wrong one is worse than none. A manufacturer page would also settle the waterline question the review currently has to flag as uncorroborated.",
    owner: "manufacturer" as const,
  },
  {
    productId: "prod-wybot-c1",
    bestAvailableTier: "affiliate_media_feed" as const,
    checked: [
      "Awin directory, scanned 2026-07-31 — 21,429 programmes, 10,965 of them US",
      "Awin US programme FOUND: WYBOTICS INC advertiser 76816, USD, Active, www.wybotpool.com",
      "Awin relationship API — advertiser 76816 returned under relationship=pending on 2026-07-31",
      "Awin programmedetails 76816 — HTTP 401 'No relationship exists', so terms and feed are gated",
      "Awin joined programme is Wybot EU (115280, Germany, EUR) — EU/UK creatives, not licensed for the US site",
      "wybotpool.com — no media library",
    ],
    blocker:
      "AWAITING ADVERTISER APPROVAL. A US WYBOT programme exists on Awin and BotPlanet has applied for it; the API confirms the application is pending. Until WYBOTICS INC (advertiser 76816) approves, the programme terms and the product feed are both gated, so no image may be ingested. The EU programme we are already joined to cannot fill the gap: its creatives are licensed for EU/UK traffic, not for a US site. WYBOT also sells C1, C1 Pro and C1 Max with no published model number, so an incoming feed row must be matched on title and any variant token rejects it.",
    unblockAction:
      "Wait for WYBOTICS INC (advertiser 76816) to approve. On approval, generate the Awin datafeed key under Toolbox → Create-a-Feed and store it as the Worker secret AWIN_DATAFEED_KEY — the OAuth token is rejected by productdata.awin.com. Ingestion then exact-matches WYBOT C1 and flows through the existing registry.",
    owner: "manufacturer" as const,
  },
  {
    productId: "prod-dolphin-nautilus-cc-plus",
    ...AMAZON_BLOCK,
    checked: [...AMAZON_BLOCK.checked, "maytronics.com press page — HTTP 404"],
    blocker: `${AMAZON_BLOCK.blocker} Maytronics ships several near-identical Nautilus CC variants; only part 99996409-PCI may be matched.${HAS_OWNER_ARTWORK}`,
  },
  {
    /* This record held the Dolphin Premier until 3 August 2026 and its blocker
       described that machine's candidate-under-review status. It now holds the
       BuBlue Bubot 800P Gen2, so the blocker describes the BuBlue instead. */
    productId: "prod-dolphin-premier",
    ...AMAZON_BLOCK,
    checked: [
      ...AMAZON_BLOCK.checked,
      "bublue.com/products/bublue-bubot-800p — read 4 August 2026; product photography present, no media library or press-kit licence published",
      "Amazon US listing B0GTYX922J — machine-read 3 August 2026; retailer listing, not a licensable media source",
    ],
    blocker: `${AMAZON_BLOCK.blocker} BuBlue's own site publishes photography with no stated reuse licence, and no affiliate programme has been checked for the brand yet. BuBlue sells the Bubot family in 300P/500P/700P/800P/880P variants, so any incoming image must be matched to the 800P Gen2 exactly.${HAS_OWNER_ARTWORK}`,
    unblockAction:
      "Ask BuBlue directly for a media pack for the Bubot 800P Gen2, or check whether the brand runs an affiliate programme with a media feed. Until either exists, the product renders owner-created BotPlanet creatives.",
    owner: "manufacturer" as const,
  },
  {
    productId: "prod-polaris-freedom",
    ...AMAZON_BLOCK,
    checked: [...AMAZON_BLOCK.checked, "fluidra.com press room — no readable content", "polarispool.com support/parts page for SKU FFREEDOM"],
    blocker: `${AMAZON_BLOCK.blocker} Polaris sells FREEDOM, FREEDOM SC, FREEDOM LT and FREEDOM Plus on a shared EB37 chassis, so an incoming image must be matched on the FFREEDOM SKU and not on family resemblance.${HAS_OWNER_ARTWORK}`,
  },
  {
    productId: "prod-betta-se-plus",
    ...AMAZON_BLOCK,
    checked: [...AMAZON_BLOCK.checked, "bettabot.com — no media library"],
    blocker: `${AMAZON_BLOCK.blocker} The stored record previously cited the Betta SE page in error. Any incoming image must be matched to /products/betta-se-plus; Betta SE media must never be imported for this product.${HAS_OWNER_ARTWORK}`,
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
    bestAvailableTier: "affiliate_media_feed" as const,
    checked: [
      "CJ relationship, verified live 2026-07-31 (publisher 8029924, website 101845913, advertiser 6404897 Aiper)",
      "CJ shoppingProductFeeds — one feed, adId 17133094 'aiper products feed', productCount 0",
      "CJ shoppingProducts and products — totalCount 0",
      "CJ link-search — 12 approved creatives, 0 product images, 0 videos",
      "aiper.com — no media library",
    ],
    blocker:
      "The CJ programme is live and fully readable, so this is no longer a permission problem. It is an upstream supply problem: Aiper's CJ Product Catalog contains zero products, and all twelve approved creatives are seasonal campaign banners and text links. Nothing in CJ depicts this model. Aiper publishes no model numbers, so an incoming image must still be matched to the exact X1 product page and never to X1 Pro.",
    unblockAction:
      "Ask Aiper through the CJ advertiser contact to populate their product feed, or request a media kit direct. No query change or credential will produce imagery that the advertiser has not published.",
    owner: "manufacturer" as const,
  },
  {
    productId: "prod-aiper-scuba-s1",
    bestAvailableTier: "affiliate_media_feed" as const,
    checked: [
      "CJ relationship, verified live 2026-07-31 (publisher 8029924, website 101845913, advertiser 6404897 Aiper)",
      "CJ shoppingProductFeeds — one feed, adId 17133094 'aiper products feed', productCount 0",
      "CJ shoppingProducts and products — totalCount 0",
      "CJ link-search — 12 approved creatives, 0 product images, 0 videos",
      "aiper.com — no media library",
    ],
    blocker:
      "The CJ programme is live and fully readable, so this is no longer a permission problem. It is an upstream supply problem: Aiper's CJ Product Catalog contains zero products, and all twelve approved creatives are seasonal campaign banners and text links. Nothing in CJ depicts this model. The S1 and S1 Pro are separate models with no published SKUs, so only exact-S1 imagery may be attached and Scuba X1 media must never be mixed in.",
    unblockAction:
      "Ask Aiper through the CJ advertiser contact to populate their product feed, or request a media kit direct. No query change or credential will produce imagery that the advertiser has not published.",
    owner: "manufacturer" as const,
  },
  {
    productId: "prod-aiper-seagull-se",
    bestAvailableTier: "affiliate_media_feed" as const,
    checked: [
      "CJ relationship, verified live 2026-07-31 (publisher 8029924, website 101845913, advertiser 6404897 Aiper)",
      "CJ shoppingProductFeeds — one feed, adId 17133094 'aiper products feed', productCount 0",
      "CJ shoppingProducts and products — totalCount 0",
      "CJ link-search — 12 approved creatives, 0 product images, 0 videos",
      "aiper.com — no media library",
    ],
    blocker:
      "The CJ programme is live and fully readable, so this is no longer a permission problem. It is an upstream supply problem: Aiper's CJ Product Catalog contains zero products, and all twelve approved creatives are seasonal campaign banners and text links. Nothing in CJ depicts this model. Aiper has shipped more than one Seagull SE revision and publishes no model number, so Seagull Pro, Plus and other generations must never be substituted.",
    unblockAction:
      "Ask Aiper through the CJ advertiser contact to populate their product feed, or request a media kit direct. No query change or credential will produce imagery that the advertiser has not published.",
    owner: "manufacturer" as const,
  },
];

/**
 * Responsive derivatives, generated by scripts/gen-derivatives.mjs.
 *
 * These are not an optimisation detail — they were the reason the pool category
 * page shipped roughly 2.5 MB of images. Every picture was served at its
 * authored size no matter how small it rendered: a 360px product card was
 * downloading a 1200px file. The registry has always been able to build a
 * srcset from this table; it was simply empty.
 *
 * Built by matching each manifest entry back to the asset it came from, so a
 * derivative can never be attached to an asset that does not exist, and a
 * withdrawn asset takes its derivatives out of every srcset with it.
 *
 * The vector placeholders deliberately have none: an SVG serves every width
 * from one file, and raster copies of it would add bytes for no benefit.
 */
interface DerivativeManifestEntry {
  source: string;
  sourceWidth: number;
  sourceHeight: number;
  derivatives: { id: string; src: string; width: number; height: number; checksum: string }[];
}

const DERIVATIVE_MANIFEST = DERIVATIVES_JSON as DerivativeManifestEntry[];

export const DERIVATIVES: import("./types").Derivative[] = DERIVATIVE_MANIFEST.flatMap((entry) => {
  // Every group that can own a raster. Leaving one out does not fail loudly —
  // the derivative files still exist on disk, they just never reach a srcset,
  // and the product silently drops out of responsive-variant readiness.
  const parent = [...ORIGINAL_ASSETS, ...OWNER_PRODUCT_ARTWORK, ...REVIEW_FIGURE_ASSETS].find(
    (a) => a.src === entry.source,
  );
  if (!parent) return [];
  return entry.derivatives.map((d) => ({
    id: d.id,
    parentAssetId: parent.id,
    format: "webp" as const,
    width: d.width,
    height: d.height,
    src: d.src,
    crop: "native" as const,
  }));
});
