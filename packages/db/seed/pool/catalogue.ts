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

export const categoryRows: (typeof categories.$inferInsert)[] = [
  { id: "cat-pool-cleaners", slug: "robotic-pool-cleaners", name: "Robotic Pool Cleaners", parentId: null },
];

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
    brandId: "brand-aiper",
    categoryId: "cat-pool-cleaners",
    productClass: "full_cleaner",
    name: "Aiper Scuba S1",
    model: "Scuba S1",
    environments: ["above_ground", "in_ground"],
    cleans: ["floor", "walls"],
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
    environments: ["in_ground"],
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
    cleans: ["floor", "walls", "waterline"],
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
    environments: ["in_ground"],
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
    status: "published",
  },
];

export const productMarketAvailabilityRows = productRows.map((p) => ({
  id: `pma-${p.id}-us`,
  productId: p.id as string,
  marketId: "us",
  availabilityStatus: "available",
}));
