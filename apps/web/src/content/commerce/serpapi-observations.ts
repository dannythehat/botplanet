/**
 * SERPAPI DISCOVERY AND PRICE RUN — 2026-07-31.
 *
 * Eleven credits: four discovery searches and seven listing reads. Every
 * candidate the searches surfaced is recorded here, accepted or refused, with
 * the field that decided it — because "we found nothing" and "we found six
 * things and four of them were a different machine" are different findings, and
 * the second is the one worth keeping.
 *
 * WHAT THIS RUN PROVED ABOUT TITLE MATCHING
 *
 * Two candidates would have passed a title check and are the wrong product:
 *
 *   B0GQ4FXRBN  title says "2026 WYBOT C1"      details table says C1 PLUS
 *   B0H6ZZDR3W  title says "Aiper Scuba S1"     details table says X5 Pro 2026
 *
 * The title is marketing copy the seller writes. The details table is the
 * structured identity Amazon holds. When they disagree the listing is refused,
 * because a buy button that sends a reader to a C1 PLUS after they read about a
 * C1 is the exact failure the dead-ASIN incident already cost us once.
 *
 * ONE LISTING CONTRADICTS ITSELF: B0H6ZZDR3W gives model_name "Scuba S1 2026"
 * and model_number "X5 Pro 2026" on the same page. A listing that cannot agree
 * with itself cannot confirm an identity.
 */

/** What the aggregator read from one listing, verbatim. */
export interface SerpApiObservation {
  productId: string;
  asin: string;
  observedTitle: string;
  /** The details table's own identity fields, which decide the match. */
  brand: string | null;
  modelName: string | null;
  modelNumber: string | null;
  /** Buy-new only. A used or renewed option is never recorded as the price. */
  priceMinor: number | null;
  currency: string;
  stockWording: string | null;
  shippingWording: string | null;
  sellerWording: string | null;
  returnsWording: string | null;
  identityConfirmed: boolean;
  /** Which field settled it, for the audit trail. */
  matchEvidence: string;
  checkedDate: string;
}

export const SERPAPI_RUN_DATE = "2026-07-31";

/**
 * Credits spent, recorded so the monthly ceiling is accounted from real usage
 * rather than an estimate.
 */
export const SERPAPI_RUN_CREDITS = {
  discoverySearches: 4,
  listingReads: 7,
  total: 11,
  /** Reported by the account endpoint after the run. */
  remainingAfterRun: 198,
  ceiling: 200,
};

export const SERPAPI_OBSERVATIONS: SerpApiObservation[] = [
  {
    productId: "prod-betta-se-plus",
    asin: "B0CVMQ3XBX",
    observedTitle:
      "Betta SE Plus - Solar-Powered Robotic Pool Skimmer with 24/7 Continuous Cleaning Power, Dual Charging Options, Twin Salt Chlorine Tolerant Motors, and Shallow Water Safeguard",
    brand: "Betta",
    modelName: "Betta-SE-Plus",
    modelNumber: "Betta-SE-Plus",
    priceMinor: 38990,
    currency: "USD",
    stockWording: "In Stock",
    shippingWording: "FREE delivery Wednesday, August 5",
    // Ships from Amazon, sold by the brand's own storefront — the cleanest
    // seller position of anything checked so far.
    sellerWording: "BettaOfficial",
    returnsWording: null,
    identityConfirmed: true,
    matchEvidence:
      "Details table: brand 'Betta'; model name, model number and manufacturer part number all 'Betta-SE-Plus'. Single buying option, so no condition ambiguity. Ships from Amazon, sold by BettaOfficial.",
    checkedDate: SERPAPI_RUN_DATE,
  },
  {
    productId: "prod-polaris-freedom",
    asin: "B0BX9DJS7R",
    observedTitle:
      "Polaris Freedom Cordless Robotic Pool Cleaner, Cable-Free for All In-Ground Pools up to 50ft, Four Cleaning Modes & Intelligent Cleaning Technology",
    brand: "Polaris",
    modelName: "FREEDOM",
    modelNumber: "FFREEDOM",
    priceMinor: 119900,
    currency: "USD",
    stockWording: "In Stock",
    shippingWording: "FREE delivery Thursday, August 6",
    // The manual check could not see this line. It is a marketplace third
    // party, which is why it mattered that we refused to assume Amazon.
    sellerWording: "In The Swim Pool Supplies",
    returnsWording: "FREE 30-day refund/replacement",
    identityConfirmed: true,
    matchEvidence:
      "Details table: model name 'FREEDOM', model number and manufacturer part number 'FFREEDOM', manufacturer 'Fluidra'. FFREEDOM is the SKU the Job 8 identity record uses to separate base FREEDOM from FREEDOM Plus, which the same search returned separately at $1,399. Buy-new price recorded; the used option at $934.82 is refused.",
    checkedDate: SERPAPI_RUN_DATE,
  },
  {
    productId: "prod-dolphin-e10",
    asin: "B0GV15VY1N",
    observedTitle:
      "Dolphin (2026 Model) E10 Automatic Robotic Pool Vacuum Cleaner, Active Scrubber Brush, Top Load Filter Basket, Ideal for Above Ground Pools up to 30 FT",
    brand: "Dolphin",
    modelName: "E10",
    modelNumber: "1",
    priceMinor: 56800,
    currency: "USD",
    stockWording: "In Stock",
    shippingWording: "FREE delivery August 1 - 3. Details",
    sellerWording: "In The Swim Pool Supplies",
    returnsWording: null,
    identityConfirmed: true,
    matchEvidence:
      "Details table: brand 'Dolphin', model name 'E10'. The model NUMBER field reads '1', which is junk data and carries no weight either way; the match rests on brand plus model name plus a title that names the E10. The '2026 Model' prefix is a model-year label, not a different model name — the same search returned Nautilus AG, Nautilus CC, CC Pro and CC Supreme as separate listings, so the siblings are distinguishable.",
    checkedDate: SERPAPI_RUN_DATE,
  },
  {
    productId: "prod-aiper-seagull-se",
    asin: "B0H5PY2SPF",
    observedTitle:
      "2026 AIPER Seagull SE Cordless Robotic Pool Vacuum for Above Ground Pools | Powerful 1320GPH Suction",
    brand: "AIPER",
    modelName: "Seagull SE ZT20032026",
    modelNumber: "Seagull SE ZT20032026",
    priceMinor: 14999,
    currency: "USD",
    stockWording: "In Stock",
    shippingWording: "FREE delivery August 5 - 7. Details",
    sellerWording: "AiperDirect",
    returnsWording: null,
    identityConfirmed: true,
    matchEvidence:
      "Details table: brand 'AIPER'; model name and model number both 'Seagull SE ZT20032026'. Sold by AiperDirect, the brand's own storefront. A renewed listing (B0H7JNPZJ9) and a charger accessory (B0F6XRZ6GM) appeared in the same search and are refused.",
    checkedDate: SERPAPI_RUN_DATE,
  },
];

export const serpApiObservationFor = (productId: string): SerpApiObservation | undefined =>
  SERPAPI_OBSERVATIONS.find((o) => o.productId === productId);

/**
 * Candidates the run surfaced and refused, with the field that refused them.
 * Kept so the same wrong ASIN is not rediscovered and accepted next month.
 */
export interface SerpApiRejection {
  productId: string;
  asin: string;
  observedTitle: string;
  reason: string;
  rule: "sibling_model" | "self_contradictory_identity" | "refurbished_or_used" | "accessory_or_part" | "no_buybox" | "unavailable";
}

export const SERPAPI_REJECTIONS: SerpApiRejection[] = [
  {
    productId: "prod-wybot-c1",
    asin: "B0GQ4FXRBN",
    observedTitle: "2026 WYBOT C1 Cordless Robotic Pool Vacuum for Inground Pools, Wave White | 4-in-1 Robotic Pool Cleaner",
    reason:
      "THE TITLE SAYS C1, THE PRODUCT IS A C1 PLUS. The details table gives model name and model number 'C1 PLUS' and manufacturer part number 'C1-WGV1'. WYBOT sells C1, C1 Pro, C1 Max and C1 Plus as separate models and BotPlanet holds the base C1, so this is a sibling. It would have passed any check that read the title. It also carries a used buying option.",
    rule: "sibling_model",
  },
  {
    productId: "prod-aiper-scuba-s1",
    asin: "B0H6ZZDR3W",
    observedTitle: "(2026 Upgrade) Aiper Scuba S1 Robotic Pool Cleaner, 270-Min Runtime, Floor, Wall, Waterline",
    reason:
      "THE LISTING CONTRADICTS ITSELF. Model name reads 'Scuba S1 2026' while model number and manufacturer part number both read 'X5 Pro 2026' — two different machines named on one page. A listing that cannot agree with itself cannot confirm an identity, so it is refused rather than resolved in our favour.",
    rule: "self_contradictory_identity",
  },
  {
    productId: "prod-aiper-scuba-s1",
    asin: "B0H28VT625",
    observedTitle: "(2026 Upgrade) (Renewed) Aiper Scuba S1 Robotic Pool Cleaner, 270 Min Runtime",
    reason: "Renewed condition. A refurbished unit is a different thing with a different warranty position and is never recorded as the price of the new one.",
    rule: "refurbished_or_used",
  },
  {
    productId: "prod-aiper-seagull-se",
    asin: "B0H7JNPZJ9",
    observedTitle: "(Renewed) AIPER Seagull SE 2026 Cordless Robotic Pool Cleaner with 100 Mins Runtime",
    reason: "Renewed condition, refused for the same reason.",
    rule: "refurbished_or_used",
  },
  {
    productId: "prod-aiper-seagull-se",
    asin: "B0F6XRZ6GM",
    observedTitle: "12.6V Charger for Aiper Seagull Pool Vacuum",
    reason: "A charger, not a robot. Returned by the search on brand and model words alone.",
    rule: "accessory_or_part",
  },
  {
    productId: "prod-aiper-scuba-x1",
    asin: "B0F9WN961G",
    observedTitle: "AIPER Pool Cleaner",
    reason:
      "CURRENTLY UNAVAILABLE, and still unidentifiable. The listing has no buying option at all, and its model name, model number and manufacturer part number all read 'Blue' — a colour. Both gates fail independently: nothing to buy, and no way to confirm what it is.",
    rule: "unavailable",
  },
  {
    productId: "prod-beatbot-aquasense-2-ultra",
    asin: "B0DMN6NV6H",
    observedTitle: "(2025) Beatbot Cordless Robotic Pool Cleaner for Complex Pools",
    reason:
      "IDENTITY CONFIRMED, PRICE REFUSED. The model is the AquaSense 2 Ultra, but the listing exposes no buy box: no seller, and two irreconcilable figures — $2,299.00 in the search result against $1,697.07 on the product page, with 'Only 1 left in stock - order soon.' Two prices for one product is not a price. The destination stays verified and linkable; no price, stock or seller is published.",
    rule: "no_buybox",
  },
];

/** Products the run left with no usable destination, and why. */
export const SERPAPI_UNRESOLVED: Record<string, string> = {
  "prod-wybot-c1":
    "Six C1-titled listings were returned. The one read is a C1 PLUS. The others share the same price and photography and are colour variants of the same family, so none can be accepted until a details table names the base C1 exactly.",
  "prod-aiper-scuba-s1":
    "Five Scuba S1-titled listings at five different prices ($319.99 to $559.99). The one read names X5 Pro 2026 in its identity fields. Ambiguous, so all are held for review.",
  "prod-aiper-scuba-x1": "The held ASIN is currently unavailable and names no model.",
};
