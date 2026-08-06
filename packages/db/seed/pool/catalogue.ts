/**
 * Pool-category catalogue seed (PROVISIONAL DRAFT).
 *
 * Rules honoured here:
 *  - Prices are NOT in this file — they live on offers as dated snapshots.
 *  - No image URLs (rights unconfirmed) — the media table is left empty.
 *  - Betta SE Plus is typed as `surface_skimmer`, not a full cleaner.
 *  - The 10th full-cleaner (Dolphin E10, above-ground) is status "proposed",
 *    pending human confirmation of the above-ground comparison.
 */
import type { categories, markets } from "../../src/schema/reference.js";
import type { brands, products } from "../../src/schema/catalogue.js";

export const SNAPSHOT_DATE = "2026-07-29";

export const marketRows: (typeof markets.$inferInsert)[] = [
  {
    id: "us",
    name: "United States",
    pathPrefix: "",
    defaultLocale: "en-US",
    currencyCode: "USD",
    measurement: "imperial",
    launchStatus: "launch",
    isActive: true,
  },
];

/**
 * Every category on the site, not just the pool one.
 *
 * The file is shelved under seed/pool/ because pool was the only catalogue
 * when it was written, but a category row is reference data with no products
 * attached and no pool in it. Window went live on 5 August 2026 and lawn on
 * 6 August, and both rows were created directly against D1 — which meant a
 * bootstrap from this seed produced a database where two of the three live
 * category pages 404'd. That was a latent bug, and it is fixed here rather
 * than left for whoever next rebuilds the database from scratch.
 *
 * When a second catalogue is seeded properly, this array should move out to
 * packages/db/seed/categories.ts and stop pretending to be pool-specific.
 */
/* @extension-point per-category | required | A database rebuilt from this seed
   has no row for the category, so its page 404s with "Category not found".
   Window and lawn were both created directly against D1 and missing here until
   6 August 2026 — a latent bug nobody would find until the next rebuild. */
export const categoryRows: (typeof categories.$inferInsert)[] = [
  { id: "cat-pool-cleaners", slug: "robotic-pool-cleaners", name: "Robotic Pool Cleaners", parentId: null },
  { id: "cat-window-cleaners", slug: "window-cleaning-robots", name: "Window-Cleaning Robots", parentId: null },
  { id: "cat-lawn-mowers", slug: "robotic-lawn-mowers", name: "Robotic Lawn Mowers", parentId: null },
  /* Two rows, not one. Companion robots and pet-camera robots are separate
     categories on measured SERP evidence — see
     docs/seo/companion-robots-research-findings.md. Seeded here at the same
     time the pages were built, rather than being created against D1 first and
     backfilled later the way window and lawn were. */
  { id: "cat-companion-robots", slug: "companion-robots", name: "Companion Robots & Robot Pets", parentId: null },
  { id: "cat-pet-camera-robots", slug: "pet-camera-robots", name: "Pet Camera Robots", parentId: null },
  { id: "cat-litter-boxes", slug: "self-cleaning-litter-boxes", name: "Self-Cleaning Litter Boxes", parentId: null },
  { id: "cat-grill-cleaners", slug: "grill-cleaning-robots", name: "Grill-Cleaning Robots", parentId: null },
  { id: "cat-robot-vacuums", slug: "robot-vacuums", name: "Robot Vacuums & Mops", parentId: null },
  { id: "cat-coding-robots", slug: "educational-coding-robots", name: "Coding Robots for Kids", parentId: null },
];

/* @extension-point per-brand | required | A product row references its brand by
   foreign key, so a missing brand row fails the insert outright. Cheap to add
   and the one place hasDirectAffiliate is recorded, which decides whether we
   monetise the brand directly or only through retailers. */
export const brandRows: (typeof brands.$inferInsert)[] = [
  { id: "brand-beatbot", slug: "beatbot", name: "Beatbot", maker: "Beatbot", hasDirectAffiliate: true },
  { id: "brand-dolphin", slug: "dolphin", name: "Dolphin", maker: "Maytronics", hasDirectAffiliate: false, notes: "No direct consumer affiliate programme found; monetise via retailers." },
  { id: "brand-aiper", slug: "aiper", name: "Aiper", maker: "Aiper", hasDirectAffiliate: true },
  { id: "brand-wybot", slug: "wybot", name: "WYBOT", maker: "WYBOT", hasDirectAffiliate: true },
  { id: "brand-polaris", slug: "polaris", name: "Polaris", maker: "Pentair", hasDirectAffiliate: false, notes: "No direct programme; retailer-only." },
  { id: "brand-betta", slug: "betta", name: "Betta", maker: "Solar Pool Technologies", hasDirectAffiliate: null },
  { id: "brand-bublue", slug: "bublue", name: "BUBLUE", maker: "BUBLUE", hasDirectAffiliate: null, notes: "Added 2026-08-03 with the Bubot 800P Gen2. No affiliate programme checked yet; sold through Amazon." },
];

/**
 * 10 launch products. 9 confirmed + Dolphin E10 (status "proposed").
 * `status`: published = confirmed for launch draft; proposed = pending review.
 */
/* @extension-point per-product | required | The product does not exist: no
   catalogue row, no card on the category page, no comparison row, and nothing
   for BotMatch to score. This is also where productClass, environments,
   cleans, powerType and priceTier are set — the five fields the scoring engine
   actually reads, so a wrong value here is a wrong recommendation. */
export const productRows: (typeof products.$inferInsert)[] = [
  {
    id: "prod-beatbot-aquasense-2-ultra",
    slug: "beatbot-aquasense-2-ultra",
    brandId: "brand-beatbot",
    categoryId: "cat-pool-cleaners",
    productClass: "full_cleaner",
    name: "Beatbot AquaSense 2 Ultra",
    model: "AquaSense 2 Ultra",
    environments: ["in_ground"],
    cleans: ["floor", "walls", "waterline", "water_surface"],
    powerType: "cordless",
    priceTier: "ultra",
    // Beatbot publishes an area only.
    maxPoolLengthFt: null,
    maxPoolAreaSqFt: 3875,
    specsJson: { note: "Premium cordless; also skims the water surface.", snapshotDate: SNAPSHOT_DATE },
    status: "published",
  },
  {
    // Moved from the Scuba X1 Essential to the X1 Pro and then to the X1 Pro
    // Max on 2026-08-03, both at the owner's direction. The ID is the stable join key and does not move with
    // the model; the old slug redirects — see apps/web/src/content/product-names.ts.
    id: "prod-aiper-scuba-x1",
    slug: "aiper-scuba-x1-pro-max",
    brandId: "brand-aiper",
    categoryId: "cat-pool-cleaners",
    productClass: "full_cleaner",
    name: "Aiper Scuba X1 Pro Max",
    model: "Scuba X1 Pro Max",
    environments: ["in_ground"],
    // Aiper markets it as a vacuum AND a skimmer, so it cleans the surface too.
    cleans: ["floor", "walls", "waterline", "water_surface"],
    powerType: "cordless",
    priceTier: "premium",
    // Aiper's own comparison table: 3230 sq.ft (300㎡), 100ft (30m) in length.
    // The owner's artwork prints 80 ft; the manufacturer figure is used.
    maxPoolLengthFt: 100,
    maxPoolAreaSqFt: 3230,
    specsJson: { note: "Cordless; vacuums and skims. 8500 GPH.", snapshotDate: SNAPSHOT_DATE },
    status: "published",
  },
  {
    id: "prod-aiper-scuba-s1",
    slug: "aiper-scuba-s1",
    /* cleans CORRECTED 4 August 2026 to include the waterline. Aiper's own
       page states "4-Zone Full Coverage Cleaning — Shallow Areas, Waterline,
       Walls, Floors", and the verification record has held that since 31
       July. The seed and D1 said floor+walls, which is the Nautilus bug in
       mirror image: BotMatch would fail to offer this machine to the one
       buyer whose complaint is the tide-mark. Corrected in both. */
    brandId: "brand-aiper",
    categoryId: "cat-pool-cleaners",
    productClass: "full_cleaner",
    name: "Aiper Scuba S1",
    model: "Scuba S1",
    environments: ["above_ground", "in_ground"],
    cleans: ["floor", "walls", "waterline"],
    powerType: "cordless",
    priceTier: "mid",
    // Aiper states 1600 sq.ft (150m2), 50ft (15m) in length.
    maxPoolLengthFt: 50,
    maxPoolAreaSqFt: 1600,
    specsJson: { snapshotDate: SNAPSHOT_DATE },
    status: "published",
  },
  {
    id: "prod-aiper-seagull-se",
    slug: "aiper-seagull-se",
    brandId: "brand-aiper",
    categoryId: "cat-pool-cleaners",
    productClass: "full_cleaner",
    name: "Aiper Seagull SE",
    model: "Seagull SE",
    environments: ["above_ground"],
    cleans: ["floor"],
    powerType: "cordless",
    priceTier: "budget",
    maxPoolLengthFt: null,
    specsJson: { note: "Budget cordless, floor-only, above-ground.", snapshotDate: SNAPSHOT_DATE },
    status: "published",
  },
  {
    id: "prod-wybot-c1",
    slug: "wybot-c1",
    brandId: "brand-wybot",
    categoryId: "cat-pool-cleaners",
    productClass: "full_cleaner",
    name: "WYBOT C1",
    model: "C1",
    /* CORRECTED 4 August 2026 to include above_ground. WYBOT's own comparison
       table classifies the C1 "Above-Ground & In-Ground", for all pool shapes,
       and the verification record has held that since 31 July. The seed and D1
       said in-ground only, which hid this machine from the above-ground
       BotMatch buyer it exists for — the S1-waterline class of bug again. */
    environments: ["above_ground", "in_ground"],
    cleans: ["floor", "walls", "waterline"],
    powerType: "cordless",
    priceTier: "mid",
    // WYBOT publishes an area only.
    maxPoolLengthFt: null,
    maxPoolAreaSqFt: 1615,
    specsJson: { note: "Cordless wall-climbing.", snapshotDate: SNAPSHOT_DATE },
    status: "published",
  },
  {
    id: "prod-dolphin-nautilus-cc-plus",
    slug: "dolphin-nautilus-cc-plus",
    brandId: "brand-dolphin",
    categoryId: "cat-pool-cleaners",
    productClass: "full_cleaner",
    name: "Dolphin Nautilus CC Plus",
    model: "Nautilus CC Plus (Wi-Fi)",
    environments: ["in_ground"],
    /* NOT waterline. Maytronics' own technical sheet for part 99996409-PCI
       lists Waterline Scrubbing: No, and the whole first section of this
       machine's review is about that. The seed and D1 both carried
       "waterline" until 4 August 2026, which meant BotMatch would recommend
       it to the one buyer the review exists to warn off — the person whose
       actual complaint is the tide-mark at the tile line. Corrected in both. */
    cleans: ["floor", "walls"],
    powerType: "corded",
    priceTier: "mid",
    // Maytronics states 40 ft. The seed carried 50, which would have recommended it for pools a quarter longer than it is rated for.
    maxPoolLengthFt: 40,
    maxPoolAreaSqFt: null,
    specsJson: { note: "Corded value; trusted benchmark brand.", snapshotDate: SNAPSHOT_DATE },
    status: "published",
  },
  {
    // Held the Maytronics Dolphin Premier until 2026-08-03, when the owner
    // replaced it with a BuBlue. Different manufacturer, so the brand moves too.
    // maxPoolLengthFt is now NULL rather than the Dolphin's 50: it is a hard
    // exclusion in the matcher, and carrying another machine's number would
    // silently mis-filter this one. It stays null until the real figure is read.
    id: "prod-dolphin-premier",
    slug: "bublue-bubot-800p",
    brandId: "brand-bublue",
    categoryId: "cat-pool-cleaners",
    productClass: "full_cleaner",
    name: "BuBlue Bubot 800P Gen2",
    model: "Bubot 800P gen2",
    /* CORRECTED 4 August 2026 to include above_ground. BuBlue's own FAQ calls
       it "ideal for above-ground pools up to 1,076 sq ft"; the same FAQ lists
       vinyl, fiberglass and concrete, and the listing title says inground.
       Both readings are stored so neither hides the product from the one
       BotMatch buyer it fits — the same class of bug as the S1 waterline. */
    environments: ["above_ground", "in_ground"],
    cleans: ["floor", "walls", "waterline"],
    powerType: "corded",
    priceTier: "mid",
    maxPoolLengthFt: null,
    // Corded, but the cord is 50 ft and that is NOT a pool-length rating.
    // BuBlue publishes an area only.
    maxPoolAreaSqFt: 1076,
    specsJson: { snapshotDate: SNAPSHOT_DATE },
    status: "published",
  },
  {
    id: "prod-polaris-freedom",
    slug: "polaris-freedom",
    brandId: "brand-polaris",
    categoryId: "cat-pool-cleaners",
    productClass: "full_cleaner",
    name: "Polaris FREEDOM",
    model: "FREEDOM (cordless)",
    environments: ["in_ground"],
    cleans: ["floor", "walls", "waterline"],
    powerType: "cordless",
    priceTier: "premium",
    maxPoolLengthFt: 50,
    specsJson: { snapshotDate: SNAPSHOT_DATE },
    status: "published",
  },
  {
    id: "prod-betta-se-plus",
    slug: "betta-se-plus",
    brandId: "brand-betta",
    categoryId: "cat-pool-cleaners",
    // DISTINCT CLASS — never competes as a normal full cleaner.
    productClass: "surface_skimmer",
    name: "Betta SE Plus",
    model: "SE Plus",
    environments: ["above_ground", "in_ground"],
    cleans: ["water_surface"],
    powerType: "solar",
    priceTier: "budget",
    // Betta states up to 40 ft x 60 ft, approx. 2,400 sq ft.
    maxPoolLengthFt: 40,
    maxPoolAreaSqFt: 2400,
    specsJson: { note: "Solar surface skimmer — floating debris only, NOT a floor/wall cleaner.", snapshotDate: SNAPSHOT_DATE },
    status: "published",
  },
  {
    // CONFIRMED 10th launch product (approved by ChatGPT/Danny, 2026-07-29).
    // Product identity is confirmed; price / affiliate / image-rights / stock
    // fields remain provisional snapshots until individually verified.
    // REMOVED from the catalogue on 2026-08-03 at the owner's direction. The row
    // is archived rather than deleted so the decision stays traceable and the
    // product could return; its URL redirects to the category.
    id: "prod-dolphin-e10",
    slug: "dolphin-e10",
    brandId: "brand-dolphin",
    categoryId: "cat-pool-cleaners",
    productClass: "full_cleaner",
    name: "Dolphin E10",
    model: "E10",
    environments: ["above_ground"],
    cleans: ["floor"],
    powerType: "corded",
    priceTier: "mid",
    // Maytronics states 8 m. Converted and rounded DOWN, because this is a hard exclusion and rounding up over-promises.
    maxPoolLengthFt: 26,
    maxPoolAreaSqFt: null,
    specsJson: {
      note: "Trusted-brand corded above-ground; completes corded-vs-cordless in the above-ground segment. Dolphin Escape held as a later premium above-ground alternative.",
      snapshotDate: SNAPSHOT_DATE,
    },
    status: "archived",
  },
];

export const productMarketAvailabilityRows = productRows.map((p) => ({
  id: `pma-${p.id}-us`,
  productId: p.id as string,
  marketId: "us",
  availabilityStatus: "available",
}));
