/**
 * LIVE SOURCE VERIFICATION — 2026-07-31.
 *
 * Every observation below was read from the named source on the named date by
 * fetching that URL. Values are recorded EXACTLY as the source words them,
 * including the unit and the manufacturer's own punctuation, so that a later
 * re-check can tell "the source changed" apart from "we transcribed it
 * differently". Nothing here is inferred, converted or tidied at entry; the
 * conversions happen downstream and record their method.
 *
 * `notPubliclyStated` is as important as `observations`. It records fields we
 * went looking for on the official sources and could not find, with the list of
 * sources actually checked. That is a materially different statement from "we
 * never looked", and the two must never be collapsed into one "unknown".
 *
 * `sourceChecks` records the liveness of every URL the editorial records cite,
 * including the ones that failed, so a dead or unreadable source is visible
 * rather than silently inherited.
 */

export const VERIFICATION_DATE = "2026-07-31";

/** Whether a cited source could still be read on the verification date. */
export type SourceStatus =
  /** Fetched and readable. */
  | "ok"
  /** Fetched but returned no readable content — cannot be used as evidence. */
  | "unreadable"
  /** Not fetched during this pass; the value it backs stays unverified. */
  | "not_rechecked";

export interface SourceCheck {
  url: string;
  title: string;
  status: SourceStatus;
  note?: string;
}

export interface Observation {
  field: string;
  /** Verbatim, with the source's own unit. Never normalised here. */
  value: string | number;
  sourceUrl: string;
  sourceTitle: string;
  observedOn: string;
  /** Which variants/markets this observation covers. */
  applicability?: string;
  /**
   * Marks a BOUND rather than a competing figure — "charges in under 5 hours"
   * alongside "charges in only 4 hours". A bound never wins a field and never
   * counts as a disagreement, but it is not taken on trust either: the derive
   * step checks the published figure actually falls inside it, and treats the
   * pair as a real conflict if it does not or if the numbers will not parse.
   */
  role?: "bound_supporting";
  note?: string;
}

export interface NotStated {
  field: string;
  /** The sources actually checked before concluding this. */
  checked: string[];
  note: string;
}

export interface ModelIdentity {
  brand: string;
  /** Exact manufacturer wording for this model. */
  canonicalName: string;
  modelNumber: string | null;
  modelNumberSource: string | null;
  officialProductPageUrl: string | null;
  manual: {
    url: string;
    documentId: string | null;
    revision: string | null;
    /** True only when the document demonstrably covers THIS model. */
    coversThisModel: boolean;
    /** Which models the document actually names. */
    documentCovers: string;
    note?: string;
  } | null;
  /** Raised when the stored record pointed at a different or ambiguous model. */
  identityIssue?: string;
}

export interface ProductVerification {
  productId: string;
  checkedOn: string;
  identity: ModelIdentity;
  sourceChecks: SourceCheck[];
  observations: Observation[];
  notPubliclyStated: NotStated[];
}

const D = VERIFICATION_DATE;

/* ------------------------------------------------------------------ */

const WYBOT_PAGE = "https://www.wybotpool.com/products/wybot-c1-cordless-robotic-pool-cleaner";
const WYBOT_TITLE = "WYBOT C1 Cordless Robotic Pool Cleaner — official product page";

const wybotC1: ProductVerification = {
  productId: "prod-wybot-c1",
  checkedOn: D,
  identity: {
    brand: "WYBOT",
    canonicalName: "WYBOT C1 Cordless Robotic Pool Cleaner",
    modelNumber: null,
    modelNumberSource: null,
    officialProductPageUrl: WYBOT_PAGE,
    manual: null,
    identityIssue:
      "WYBOT sells C1, C1 Pro and C1 Max as separate models with separate manuals. The stored record is the base C1; no model number is published on the official page, so the three cannot be told apart by SKU here. Third-party manual libraries list 'OS7010C' for a C1, but that string was not found on wybotpool.com and is therefore not recorded as the model number.",
  },
  sourceChecks: [
    { url: WYBOT_PAGE, title: WYBOT_TITLE, status: "ok" },
    {
      url: "https://www.amazon.com/WYBOT-Pool-Vacuum-Inground-Navigation/dp/B0G64JV6K4",
      title: "Amazon US listing (WYBOT C1) — DEAD, superseded",
      status: "unreadable",
      note: "ASIN B0G64JV6K4 returns Amazon's 'couldn't find that page' with HTTP 200. Confirmed dead by content check and by the owner in a browser on 31 July 2026, and removed from the offer register that day. Kept here so the retired destination stays on the record.",
    },
    {
      url: "https://www.amazon.com/WYBOT-C1-Cordless-Inground-Professional/dp/B0GYWJMNWK",
      title: "Amazon US listing (WYBOT C1) — replacement supplied by the owner",
      status: "not_rechecked",
      note:
        "ASIN B0GYWJMNWK. Supplied and confirmed by the owner on 3 August 2026 as the base C1. Not independently read: Amazon returns a bot-mitigation page to server-side requests. This matters more here than elsewhere — WYBOT publishes no model number and sells C1, C1 Pro and C1 Max under near-identical titles, so the owner's confirmation is the only thing separating them and no machine check stands behind it.",
    },
    {
      url: "https://www.wybotpool.com/pages/user-manual",
      title: "WYBOT manual index (attempted)",
      status: "unreadable",
      note: "HTTP 404 — no manual index found at the conventional path on the official domain.",
    },
  ],
  observations: [
    { field: "powerType", value: "cordless", sourceUrl: WYBOT_PAGE, sourceTitle: WYBOT_TITLE, observedOn: D },
    { field: "runtimeMins", value: "up to 150 minutes", sourceUrl: WYBOT_PAGE, sourceTitle: WYBOT_TITLE, observedOn: D },
    { field: "chargeTimeHrs", value: "3 hours", sourceUrl: WYBOT_PAGE, sourceTitle: WYBOT_TITLE, observedOn: D },
    { field: "weightLbs", value: "17.6 lbs", sourceUrl: WYBOT_PAGE, sourceTitle: WYBOT_TITLE, observedOn: D },
    { field: "poolSizeSuitability", value: "up to 1615 sq. ft.", sourceUrl: WYBOT_PAGE, sourceTitle: WYBOT_TITLE, observedOn: D },
    { field: "poolTypes", value: "Above-Ground & In-Ground", sourceUrl: WYBOT_PAGE, sourceTitle: WYBOT_TITLE, observedOn: D },
    { field: "surfacesCleaned", value: "floors, walls, waterlines, steps, and slopes", sourceUrl: WYBOT_PAGE, sourceTitle: WYBOT_TITLE, observedOn: D },
    { field: "filtration", value: "180μm ultra-fine filter", sourceUrl: WYBOT_PAGE, sourceTitle: WYBOT_TITLE, observedOn: D },
    { field: "filtrationMicrons", value: "180μm", sourceUrl: WYBOT_PAGE, sourceTitle: WYBOT_TITLE, observedOn: D },
    { field: "suctionRate", value: "3,038 GPH", sourceUrl: WYBOT_PAGE, sourceTitle: WYBOT_TITLE, observedOn: D },
    { field: "navigation", value: "S-path and N-path smart path planning", sourceUrl: WYBOT_PAGE, sourceTitle: WYBOT_TITLE, observedOn: D },
    { field: "cleaningModes", value: "5 cleaning modes", sourceUrl: WYBOT_PAGE, sourceTitle: WYBOT_TITLE, observedOn: D },
    { field: "appSupport", value: "WYBOT App with OTA updates", sourceUrl: WYBOT_PAGE, sourceTitle: WYBOT_TITLE, observedOn: D },
    { field: "warranty", value: "2-year warranty", sourceUrl: WYBOT_PAGE, sourceTitle: WYBOT_TITLE, observedOn: D, applicability: "US market" },
  ],
  notPubliclyStated: [
    { field: "modelNumber", checked: [WYBOT_PAGE], note: "No SKU or model number printed on the official product page." },
    { field: "manualUrl", checked: [WYBOT_PAGE, "https://www.wybotpool.com/pages/user-manual"], note: "No manual link on the product page and no manual index found on the official domain." },
    { field: "batteryCapacity", checked: [WYBOT_PAGE], note: "Runtime is stated; cell capacity is not." },
    { field: "wifi", checked: [WYBOT_PAGE], note: "App control is stated but the page does not say whether the unit links by Wi-Fi or Bluetooth." },
    { field: "dimensions", checked: [WYBOT_PAGE], note: "Weight is stated; unit dimensions are not." },
    { field: "maxDepthFt", checked: [WYBOT_PAGE], note: "No operating depth range published." },
    { field: "minDepthFt", checked: [WYBOT_PAGE], note: "No operating depth range published." },
    { field: "filterCapacityL", checked: [WYBOT_PAGE], note: "Filter fineness is stated; basket volume is not." },
    { field: "surfaceTypes", checked: [WYBOT_PAGE], note: "Pool types are stated; liner/finish compatibility is not." },
    { field: "remoteControl", checked: [WYBOT_PAGE], note: "App control is stated; no physical handset is mentioned either way." },
    { field: "includedAccessories", checked: [WYBOT_PAGE], note: "No box-contents list published on the product page." },
  ],
};

/* ------------------------------------------------------------------ */

const CC_PAGE =
  "https://www.maytronics.com/en-us/store/residential-pools/best-performance-cleaners/dolphin-nautilus-cc-plus-w%2Fwi-fi/99996409-PCI.html";
const CC_TITLE = "Maytronics Dolphin Nautilus CC Plus w/Wi-Fi (99996409-PCI) — official US product page";
const CC_MANUAL = "https://brand.maytronics.com/m/669381d55bca5c37/original/UM-8151830.pdf";
const CC_MANUAL_TITLE = "Maytronics User Instructions MBC8-UNI 8151830 (linked by Maytronics for part 99996409-PCI)";

const nautilusCcPlus: ProductVerification = {
  productId: "prod-dolphin-nautilus-cc-plus",
  checkedOn: D,
  identity: {
    brand: "Maytronics (Dolphin)",
    canonicalName: "Dolphin Nautilus CC Plus w/Wi-Fi",
    modelNumber: "99996409-PCI",
    modelNumberSource: CC_PAGE,
    officialProductPageUrl: CC_PAGE,
    manual: {
      url: CC_MANUAL,
      documentId: "MBC8-UNI 8151830",
      revision: null,
      coversThisModel: false,
      documentCovers: "MBC8-UNI platform — the document does not name the Nautilus CC Plus anywhere",
      note: "Maytronics' own manual portal serves this PDF for part 99996409-PCI, so it is the correct support document, but it is a multi-model platform manual whose contents are explicitly conditional ('Depend on model'). Model-specific figures are therefore NOT taken from it.",
    },
    identityIssue:
      "Maytronics ships several near-identical Nautilus CC variants (CC, CC Plus, CC Plus w/Wi-Fi) under different part numbers. Only 99996409-PCI is recorded here; figures must not be carried across from the other CC models.",
  },
  sourceChecks: [
    { url: CC_PAGE, title: CC_TITLE, status: "ok" },
    { url: "https://manuals.maytronics.com/intro/?pn=99996409-PCI", title: "Maytronics manual portal for 99996409-PCI", status: "ok" },
    { url: CC_MANUAL, title: CC_MANUAL_TITLE, status: "ok", note: "Platform manual, not model-specific." },
    {
      url: "https://www.amazon.com/Dolphin-Nautilus-Robotic-Cleaner-Ground/dp/B09K4C9WGF",
      title: "Amazon US listing (CC Plus Wi-Fi)",
      status: "not_rechecked",
      note: "Retailer listing; manufacturer page checked instead.",
    },
  ],
  observations: [
    { field: "powerType", value: "corded (mains power supply unit)", sourceUrl: CC_PAGE, sourceTitle: CC_TITLE, observedOn: D },
    { field: "runtimeMins", value: "2 Hours", sourceUrl: CC_PAGE, sourceTitle: CC_TITLE, observedOn: D },
    { field: "weightLbs", value: "20.837 lb", sourceUrl: CC_PAGE, sourceTitle: CC_TITLE, observedOn: D },
    { field: "poolSizeSuitability", value: "40 ft", sourceUrl: CC_PAGE, sourceTitle: CC_TITLE, observedOn: D, note: "Stated as the maximum pool length." },
    { field: "poolTypes", value: "In Ground", sourceUrl: CC_PAGE, sourceTitle: CC_TITLE, observedOn: D },
    { field: "surfacesCleaned", value: "Floor and Walls", sourceUrl: CC_PAGE, sourceTitle: CC_TITLE, observedOn: D, note: "Waterline is NOT listed for this model." },
    { field: "filtration", value: "Ultra-Fine Filter Kit", sourceUrl: CC_PAGE, sourceTitle: CC_TITLE, observedOn: D },
    { field: "filtrationMicrons", value: "70 microns", sourceUrl: CC_PAGE, sourceTitle: CC_TITLE, observedOn: D },
    { field: "navigation", value: "CleverClean™", sourceUrl: CC_PAGE, sourceTitle: CC_TITLE, observedOn: D },
    { field: "appSupport", value: "MyDolphin™ Plus", sourceUrl: CC_PAGE, sourceTitle: CC_TITLE, observedOn: D },
    { field: "wifi", value: "Yes", sourceUrl: CC_PAGE, sourceTitle: CC_TITLE, observedOn: D },
    { field: "warranty", value: "1 year", sourceUrl: CC_PAGE, sourceTitle: CC_TITLE, observedOn: D, applicability: "US market, manufacturer direct" },
    { field: "dimensions", value: "16.799 x 16.37 x 10.429 in", sourceUrl: CC_PAGE, sourceTitle: CC_TITLE, observedOn: D },
    { field: "cleaningModes", value: "Combine Brush; standard weekly timer", sourceUrl: CC_PAGE, sourceTitle: CC_TITLE, observedOn: D },
    { field: "includedAccessories", value: "Caddy optional", sourceUrl: CC_PAGE, sourceTitle: CC_TITLE, observedOn: D },
  ],
  notPubliclyStated: [
    {
      field: "cableLengthFt",
      checked: [CC_PAGE, CC_MANUAL],
      note: "The product page lists no cable length. The platform manual's '3.5 m (12 ft)' refers to where the power supply must stand relative to the pool, not to cable length, and must not be read as one.",
    },
    { field: "maxDepthFt", checked: [CC_PAGE, CC_MANUAL], note: "No operating depth range stated for this model." },
    { field: "minDepthFt", checked: [CC_PAGE, CC_MANUAL], note: "No operating depth range stated for this model." },
    { field: "suctionRate", checked: [CC_PAGE], note: "Not published for the US model." },
    { field: "filterCapacityL", checked: [CC_PAGE, CC_MANUAL], note: "Filter fineness is stated; basket volume is not." },
    { field: "surfaceTypes", checked: [CC_PAGE], note: "Brush type is stated; the page does not enumerate compatible pool finishes." },
    { field: "remoteControl", checked: [CC_PAGE], note: "App control is stated; no physical handset mentioned." },
    { field: "manualRevisionDate", checked: [CC_MANUAL], note: "The document carries a part number but no printed revision or date." },
  ],
};

/* ------------------------------------------------------------------ */

const PREMIER_SPECS = "https://www.premierrobotic.com/dolphin-cleaner-specs";
const PREMIER_SPECS_TITLE = "Premier Robotic — Dolphin Premier specifications (authorised dealer listing)";

/* ------------------------------------------------------------------ */
/* This record was the Maytronics Dolphin Premier until 3 August 2026.  */
/* It was withdrawn on 31 July on two independent findings — no         */
/* manufacturer page, and a manual that covered a different machine —   */
/* and the owner replaced it with a BuBlue. The productId still reads   */
/* "prod-dolphin-premier" because that is the D1 join key and this      */
/* environment cannot rewrite it; the visible name and brand come from  */
/* content/product-names.ts, which also records that the ROUTE is now   */
/* wrong and must be fixed in the database.                             */
/* ------------------------------------------------------------------ */

/**
 * RETIRED — the Maytronics Dolphin Premier, exactly as it was verified.
 *
 * The record is kept whole and unedited. On 3 August 2026 the owner replaced
 * this product with a BuBlue, and `prod-dolphin-premier` — the D1 join key —
 * now describes that machine instead. Everything Job 8 established about the
 * Dolphin is still true about the Dolphin; it simply is no longer in the
 * catalogue, and its evidence must not be read as though it were the BuBlue's.
 *
 * It is deliberately NOT in VERIFICATIONS: two records cannot share a product
 * ID, and the live one has to be the machine on the page. It stays exported so
 * the findings that withdrew it remain checkable.
 */
const retiredDolphinPremier: ProductVerification = {
  productId: "prod-dolphin-premier",
  checkedOn: D,
  identity: {
    brand: "Maytronics (Dolphin)",
    canonicalName: "Dolphin Premier",
    modelNumber: null,
    modelNumberSource: null,
    officialProductPageUrl: null,
    manual: null,
    identityIssue:
      "No manufacturer page for the Dolphin Premier was located on maytronics.com; the cited sources are a dealer site. Maytronics' manual portal returns part 99996339 for the name 'Dolphin Premier', but the PDF it actually serves (UM-8151643) is titled 'Dolphin Classic 5 / Top 5 Pool Cleaner' and never names the Premier. That document is therefore NOT accepted as this model's manual, and 99996339 is not recorded as the model number. This product is the weakest-identified item in the launch set.",
  },
  sourceChecks: [
    { url: PREMIER_SPECS, title: PREMIER_SPECS_TITLE, status: "ok" },
    { url: "https://www.premierrobotic.com/dolphin-premier", title: "Premier Robotic — Dolphin Premier product page", status: "not_rechecked", note: "Specification page from the same dealer was checked instead." },
    { url: "https://manuals.maytronics.com/intro/?pn=99996339", title: "Maytronics manual portal, queried for 'Dolphin Premier'", status: "ok", note: "Portal names the product 'Dolphin Premier' but serves a Classic 5 / Top 5 document." },
    { url: "https://brand.maytronics.com/m/4e551ffe566eedab/original/UM-8151643.pdf", title: "Maytronics UM-8151643", status: "ok", note: "Rejected as this model's manual — covers Dolphin Classic 5 / Top 5." },
  ],
  observations: [
    { field: "powerType", value: "corded (mains power supply unit)", sourceUrl: PREMIER_SPECS, sourceTitle: PREMIER_SPECS_TITLE, observedOn: D },
    { field: "cableLengthFt", value: "60 feet thermoplastic rubber cable reduces frictional drag", sourceUrl: PREMIER_SPECS, sourceTitle: PREMIER_SPECS_TITLE, observedOn: D },
    { field: "runtimeMins", value: "2.5 hours", sourceUrl: PREMIER_SPECS, sourceTitle: PREMIER_SPECS_TITLE, observedOn: D },
    { field: "weightLbs", value: "22 lbs.", sourceUrl: PREMIER_SPECS, sourceTitle: PREMIER_SPECS_TITLE, observedOn: D },
    {
      field: "poolSizeSuitability",
      value: "Gunite, concrete, tile, fiberglass or vinyl-lined up to 55 in long",
      sourceUrl: PREMIER_SPECS,
      sourceTitle: PREMIER_SPECS_TITLE,
      observedOn: D,
      note: "Recorded verbatim. The unit 'in' is almost certainly a typographical error for feet, but BotPlanet does not publish a corrected figure the source never printed.",
    },
    { field: "surfaceTypes", value: "Gunite, concrete, tile, fiberglass or vinyl-lined", sourceUrl: PREMIER_SPECS, sourceTitle: PREMIER_SPECS_TITLE, observedOn: D },
    { field: "surfacesCleaned", value: "Power scrubs and vacuums floor, walls, and waterline", sourceUrl: PREMIER_SPECS, sourceTitle: PREMIER_SPECS_TITLE, observedOn: D },
    { field: "filtration", value: "Includes dual NanoFilters™ set, standard fine cartridge set, oversized leaf/debris bag", sourceUrl: PREMIER_SPECS, sourceTitle: PREMIER_SPECS_TITLE, observedOn: D },
    { field: "filtrationMicrons", value: "2 micron", sourceUrl: PREMIER_SPECS, sourceTitle: PREMIER_SPECS_TITLE, observedOn: D },
    { field: "navigation", value: "Microprocessor controlled SmartNav 2.0™ learns subject pool", sourceUrl: PREMIER_SPECS, sourceTitle: PREMIER_SPECS_TITLE, observedOn: D },
    { field: "suctionRate", value: "Micro filters 75 gallons per minute", sourceUrl: PREMIER_SPECS, sourceTitle: PREMIER_SPECS_TITLE, observedOn: D },
    { field: "warranty", value: "3 yr limited warranty -not pro-rated - not limited to hours/cycles", sourceUrl: PREMIER_SPECS, sourceTitle: PREMIER_SPECS_TITLE, observedOn: D, applicability: "as offered by this dealer" },
    { field: "poolTypes", value: "In-ground finishes only are listed", sourceUrl: PREMIER_SPECS, sourceTitle: PREMIER_SPECS_TITLE, observedOn: D },
  ],
  notPubliclyStated: [
    { field: "modelNumber", checked: [PREMIER_SPECS, "https://manuals.maytronics.com/intro/?pn=99996339"], note: "The dealer lists no part number, and the manufacturer portal's number resolves to a different model's manual." },
    { field: "officialProductPageUrl", checked: [PREMIER_SPECS, "https://manuals.maytronics.com/intro/?pn=99996339"], note: "No page for the Dolphin Premier was located on maytronics.com; the only sources are dealer pages." },
    { field: "manualUrl", checked: ["https://manuals.maytronics.com/intro/?pn=99996339"], note: "No document that names the Dolphin Premier was located." },
    { field: "appSupport", checked: [PREMIER_SPECS], note: "The dealer page does not mention an app either way; the absence of a mention is not a manufacturer statement that there is none." },
    { field: "dimensions", checked: [PREMIER_SPECS], note: "Weight is stated; dimensions are not." },
    { field: "maxDepthFt", checked: [PREMIER_SPECS], note: "Not stated by the dealer." },
    { field: "minDepthFt", checked: [PREMIER_SPECS], note: "Not stated by the dealer." },
    { field: "filterCapacityL", checked: [PREMIER_SPECS], note: "Filter types are listed; capacity is not." },
    { field: "cleaningModes", checked: [PREMIER_SPECS], note: "Not enumerated." },
    { field: "wifi", checked: [PREMIER_SPECS], note: "Not stated." },
    { field: "remoteControl", checked: [PREMIER_SPECS], note: "Not stated for this configuration." },
    { field: "includedAccessories", checked: [PREMIER_SPECS], note: "Filter media are listed; a full box-contents list is not." },
  ],
};

const BUBOT_LISTING = "https://www.amazon.com/BUBLUE-Bubot-800P-Navigation-Scheduling/dp/B0GTYX922J";
const BUBOT_LISTING_TITLE = "Amazon US listing (B0GTYX922J) — BUBLUE Bubot 800P Gen2";
const BUBOT_READ = "2026-08-03";

const dolphinPremier: ProductVerification = {
  productId: "prod-dolphin-premier",
  checkedOn: BUBOT_READ,
  identity: {
    brand: "BUBLUE",
    canonicalName: "BuBlue Bubot 800P Gen2",
    modelNumber: "Bubot 800P gen2",
    modelNumberSource: BUBOT_LISTING,
    // BuBlue's own site was not reachable for a product page on the day of the
    // check, so the retailer listing is the only source — and unusually, it
    // read. That is why this is the one owner-supplied swap that reaches a
    // machine-read identity rather than resting on the owner's word.
    officialProductPageUrl: null,
    manual: null,
    identityIssue:
      "MODEL AND MANUFACTURER BOTH CHANGED ON 3 AUGUST 2026. This record held the Maytronics Dolphin Premier, which was withdrawn on 31 July for having no manufacturer page, a manual covering a different machine, and no Amazon US listing at all. The owner replaced it with the BuBlue Bubot 800P Gen2. Every observation the Dolphin record held was read from a Maytronics dealer's specification page and has been REMOVED rather than carried across — it describes a different machine from a different manufacturer. The owner's message named an '880P'; the Amazon listing and the owner's own artwork both say 800P, and the listing's Model Number field reads 'Bubot 800P gen2', so 800P is what is recorded. No manufacturer page for this model has been read, so beyond identity the specification is unverified.",
  },
  sourceChecks: [
    {
      url: BUBOT_LISTING,
      title: BUBOT_LISTING_TITLE,
      status: "ok",
      note:
        "Read successfully on 3 August 2026, which is rare for Amazon here. The details table published Brand 'BUBLUE', Manufacturer 'BUBLUE', Model Number 'Bubot 800P gen2', Power Source 'ac' and Product Dimensions 19\"L x 18\"W x 9\"H, and Amazon's own canonical URL reads /BUBLUE-Bubot-800P-Navigation-Scheduling/. Identity only: the buy box is not treated as a price source.",
    },
    {
      url: "https://www.premierrobotic.com/dolphin-premier-specs",
      title: "Dealer specification page for the RETIRED Dolphin Premier",
      status: "not_rechecked",
      note: "Kept as history. This was the only substantive source the Dolphin Premier ever had, and it was a dealer, not the manufacturer. It says nothing about the BuBlue.",
    },
    {
      url: "https://manuals.maytronics.com/intro/?pn=99996339",
      title: "Maytronics manual portal, queried for 'Dolphin Premier' — history only",
      status: "ok",
      note: "Named the product but served a Classic 5 / Top 5 document. One of the two findings that withdrew the Dolphin Premier.",
    },
  ],
  /* Deliberately empty. The Dolphin Premier's observations came from a
     Maytronics dealer page; keeping them under a BuBlue's name would attach one
     manufacturer's specification to another's machine. Identity is established;
     nothing else about this product may be stated until a source for the Bubot
     800P Gen2 is read. */
  observations: [],
  /* Also empty, and for a different reason: "not publicly stated" means we
     looked at the maker's own source and it was silent. No BuBlue source has
     been read at all, so claiming that would be a check nobody performed. */
  notPubliclyStated: [],
};

/* ------------------------------------------------------------------ */

const POLARIS_PARTS = "https://www.polarispool.com/en/support/parts/polaris-freedom-cordless-robotic-cleaner";
const POLARIS_PARTS_TITLE = "Polaris FREEDOM Cordless Robotic Cleaner — official support and parts page";
const POLARIS_MANUAL = "https://downloads.eu.ctfassets.net/au38h2e94wka/43b8bfef-h0748900-pdf/223fcbecdb9253add444ce3697ccec5d/h0748900.pdf";
const POLARIS_MANUAL_TITLE = "Polaris® Cordless Robotic Cleaner FREEDOM™ Owner's Manual (H0748900_REVC)";
const POLARIS_QSG = "https://assets.eu.ctfassets.net/au38h2e94wka/5c38db4b-h0748700-pdf/2aa70327ec969a7ad2208d61a0c5569e/h0748700.pdf";
const POLARIS_QSG_TITLE = "Polaris FREEDOM Quick Start Guide (H0748700_REVC)";
/**
 * Polaris-authored A+ content on the FREEDOM listing, ASIN B0BX9DJS7R.
 *
 * Admitted as manufacturer-origin, retailer-hosted evidence under a narrow
 * correction authorised on 2026-07-31. It is the only source that states a
 * maximum pool LENGTH for this model — the support page and owner's manual give
 * an operating depth range and nothing more — and the only one to put a figure
 * on the charge time rather than a ceiling.
 *
 * Captured by the owner in a browser on 2026-07-31. It cannot be re-read by
 * fetch, so that capture date is the freshness anchor and re-verification is a
 * human task. The exact URL and ASIN are recorded so the capture can be found
 * again, and the allowlist in sources.ts is what grants this URL — and only
 * this URL — its authority.
 */
const POLARIS_APLUS = "https://www.amazon.com/dp/B0BX9DJS7R#aplus";
const POLARIS_APLUS_TITLE = "Polaris FREEDOM A+ content, authored by Polaris, hosted on Amazon listing B0BX9DJS7R";

const polarisFreedom: ProductVerification = {
  productId: "prod-polaris-freedom",
  checkedOn: D,
  identity: {
    brand: "Polaris (Fluidra)",
    canonicalName: "Polaris FREEDOM Cordless Robotic Cleaner",
    modelNumber: "FFREEDOM (SKU); FR550CBR; TYPE EB37 (manual)",
    modelNumberSource: POLARIS_PARTS,
    officialProductPageUrl: POLARIS_PARTS,
    manual: {
      url: POLARIS_MANUAL,
      documentId: "H0748900_REVC",
      revision: "REV C, © 2024 Fluidra",
      coversThisModel: true,
      documentCovers: "Cordless Robotic Cleaner FREEDOM™, Model: TYPE EB37",
      note: "Owner's manual explicitly names FREEDOM and carries the full specification table used below.",
    },
    identityIssue:
      "Polaris sells FREEDOM, FREEDOM SC, FREEDOM LT and FREEDOM Plus. The EB37 chassis designation is shared with FREEDOM Plus, so the chassis code alone does not identify the model — the FFREEDOM SKU does. Only base-FREEDOM figures are recorded.",
  },
  sourceChecks: [
    {
      url: "https://www.polarispool.com/en/products/pool-cleaners/robotic-pool-cleaners/polaris-freedom",
      title: "Polaris FREEDOM product page (cited by the stored record)",
      status: "unreadable",
      note: "Fetched twice on the verification date and returned no readable content. The stored record's primary source could not be re-read, so the official support page and the owner's manual were used instead.",
    },
    { url: POLARIS_PARTS, title: POLARIS_PARTS_TITLE, status: "ok" },
    { url: POLARIS_MANUAL, title: POLARIS_MANUAL_TITLE, status: "ok" },
    { url: POLARIS_QSG, title: POLARIS_QSG_TITLE, status: "ok" },
    { url: "https://www.amazon.com/Polaris-Cordless-Cable-Free-Intelligent-Technology/dp/B0BX9DJS7R", title: "Amazon US listing", status: "not_rechecked", note: "Retailer listing; manufacturer sources checked instead. Anything Amazon or a seller wrote on this page stays a retailer listing — only the A+ panels below are manufacturer-authored." },
    {
      url: POLARIS_APLUS,
      title: POLARIS_APLUS_TITLE,
      status: "ok",
      note: "Read from an owner browser capture on 2026-07-31, not by fetch. Amazon serves inconsistent markup to non-browser clients, so this source is human-verified by design and cannot be re-checked automatically.",
    },
  ],
  observations: [
    { field: "powerType", value: "Cordless (lithium ion battery pack)", sourceUrl: POLARIS_MANUAL, sourceTitle: POLARIS_MANUAL_TITLE, observedOn: D },
    { field: "batteryCapacity", value: "9.6 Ah at 29.4 V DC", sourceUrl: POLARIS_MANUAL, sourceTitle: POLARIS_MANUAL_TITLE, observedOn: D },
    { field: "weightLbs", value: "20 lbs. (9.1 kg)", sourceUrl: POLARIS_MANUAL, sourceTitle: POLARIS_MANUAL_TITLE, observedOn: D, note: "Weight of Cleaner. Packed weight is separately stated as 33 lbs. and is not used." },
    { field: "dimensions", value: "16 x 16.5 x 11 inches (41 x 42 x 28 cm)", sourceUrl: POLARIS_MANUAL, sourceTitle: POLARIS_MANUAL_TITLE, observedOn: D },
    { field: "filtration", value: "All-purpose filter canister", sourceUrl: POLARIS_MANUAL, sourceTitle: POLARIS_MANUAL_TITLE, observedOn: D },
    { field: "filterCapacityL", value: "4L", sourceUrl: POLARIS_PARTS, sourceTitle: POLARIS_PARTS_TITLE, observedOn: D },
    { field: "maxDepthFt", value: "Max 13 ft. (4 m)", sourceUrl: POLARIS_MANUAL, sourceTitle: POLARIS_MANUAL_TITLE, observedOn: D },
    { field: "minDepthFt", value: "Min 15 in. (40 cm)", sourceUrl: POLARIS_MANUAL, sourceTitle: POLARIS_MANUAL_TITLE, observedOn: D },
    { field: "includedAccessories", value: "Polaris Cleaner; Charging Station; Removal Hook", sourceUrl: POLARIS_MANUAL, sourceTitle: POLARIS_MANUAL_TITLE, observedOn: D },
    { field: "runtimeMins", value: "Floor and walls (2h 30); Floor Only (1h 30)", sourceUrl: POLARIS_QSG, sourceTitle: POLARIS_QSG_TITLE, observedOn: D },
    {
      field: "runtimeMins",
      value: "Cleans for up to 2.5 hours",
      sourceUrl: POLARIS_APLUS,
      sourceTitle: POLARIS_APLUS_TITLE,
      observedOn: D,
      role: "bound_supporting",
      note: "Corroborates the quick start guide rather than competing with it: 2h 30 for the longest mode is exactly 2.5 hours.",
    },
    {
      field: "chargeTimeHrs",
      value: "charges in only 4 hours",
      sourceUrl: POLARIS_APLUS,
      sourceTitle: POLARIS_APLUS_TITLE,
      observedOn: D,
      note: "A+ panel: 'Long-Life 9.6 Ah Lithium-Ion Battery charges in only 4 hours'. The battery figure matches the owner's manual (9.6 Ah at 29.4 V DC), which is what ties this panel to this model.",
    },
    {
      field: "chargeTimeHrs",
      value: "charges in under 5 hours using the Easy-Charge Station",
      sourceUrl: POLARIS_PARTS,
      sourceTitle: POLARIS_PARTS_TITLE,
      observedOn: D,
      role: "bound_supporting",
      note: "A ceiling, not a rival figure. Four hours falls inside it, so the two are one consistent statement at different precisions and the specific figure is the one published.",
    },
    {
      field: "chargeTimeHrs",
      value: "Recharges in less than 5 hours",
      sourceUrl: POLARIS_APLUS,
      sourceTitle: POLARIS_APLUS_TITLE,
      observedOn: D,
      role: "bound_supporting",
      note: "The same ceiling stated a second time, on the panel that also gives the 4-hour figure — so the pairing is Polaris's own, not something reconciled here.",
    },
    {
      field: "poolSizeSuitability",
      value: "In-ground pools up to 50 ft",
      sourceUrl: POLARIS_APLUS,
      sourceTitle: POLARIS_APLUS_TITLE,
      observedOn: D,
      note: "The A+ panel sets this in display capitals — 'CORDLESS ROBOTIC POOL CLEANER FOR IN-GROUND POOLS UP TO 50FT'. Recorded in sentence case because the capitals are the panel's typography rather than the manufacturer's wording or unit; the words and the figure are unchanged. This is the only Polaris source that states a pool LENGTH; the manual and support page give operating depth only.",
    },
    { field: "poolTypes", value: "In-Ground", sourceUrl: POLARIS_PARTS, sourceTitle: POLARIS_PARTS_TITLE, observedOn: D },
    { field: "cleaningModes", value: "Multiple Modes: Floor/Wall/Waterline, Floor, Waterline, SMART", sourceUrl: POLARIS_PARTS, sourceTitle: POLARIS_PARTS_TITLE, observedOn: D },
    { field: "surfacesCleaned", value: "Floor, Wall and Waterline", sourceUrl: POLARIS_PARTS, sourceTitle: POLARIS_PARTS_TITLE, observedOn: D },
    { field: "navigation", value: "SMART cycle with app-selectable cleaning modes", sourceUrl: POLARIS_PARTS, sourceTitle: POLARIS_PARTS_TITLE, observedOn: D },
    { field: "appSupport", value: "iAquaLink®", sourceUrl: POLARIS_PARTS, sourceTitle: POLARIS_PARTS_TITLE, observedOn: D },
    { field: "wifi", value: "Yes — the manual requires the charging location to have adequate Wi-Fi strength", sourceUrl: POLARIS_MANUAL, sourceTitle: POLARIS_MANUAL_TITLE, observedOn: D },
  ],
  notPubliclyStated: [
    // poolSizeSuitability was recorded here until 2026-07-31, on the correct
    // finding that the manual, quick start guide and support page publish an
    // operating DEPTH range and no pool length. That finding still stands for
    // those three sources — what changed is that a fourth source was admitted.
    // The A+ panels state a length, so the field moved to `observations`.
    { field: "warranty", checked: [POLARIS_PARTS, POLARIS_MANUAL], note: "The manual references a Limited Warranty in an exclusion clause but never states its term; the support page states none. The A+ panels state none either." },
    { field: "filtrationMicrons", checked: [POLARIS_PARTS, POLARIS_MANUAL], note: "The canister is described as 'all-purpose'; no micron rating is published." },
    { field: "suctionRate", checked: [POLARIS_PARTS, POLARIS_MANUAL], note: "Operating power (29.4 W) is stated; flow rate is not." },
    { field: "surfaceTypes", checked: [POLARIS_PARTS, POLARIS_MANUAL], note: "The manual warns about vinyl liner patterns but does not enumerate compatible finishes." },
    { field: "remoteControl", checked: [POLARIS_PARTS, POLARIS_MANUAL], note: "Control is by on-unit slider or app; no handset is supplied." },
  ],
};

/* ------------------------------------------------------------------ */

const BETTA_PAGE = "https://bettabot.com/products/betta-se-plus";
const BETTA_TITLE = "Betta SE Plus — Solar-Powered Robotic Pool Skimmer, official product page";
const BETTA_MANUAL_PAGE = "https://bettabot.com/pages/betta-se-plus-smart-pool-skimmer-manual";
const BETTA_MANUAL =
  "https://cdn.shopify.com/s/files/1/0114/1935/3184/files/Betta_SE_Plus_User_Manual_44a2f6a1-8891-49bb-88d3-9e21136efb64.pdf";
const BETTA_MANUAL_TITLE = "Betta SE Plus Smart Pool Skimmer User Manual (official)";

const bettaSePlus: ProductVerification = {
  productId: "prod-betta-se-plus",
  checkedOn: D,
  identity: {
    brand: "Betta (Solar Pool Technologies)",
    canonicalName: "Betta SE Plus — Solar-Powered Robotic Pool Skimmer",
    modelNumber: null,
    modelNumberSource: null,
    officialProductPageUrl: BETTA_PAGE,
    manual: {
      url: BETTA_MANUAL,
      documentId: null,
      revision: "published 2024-02-13 (CDN version stamp v=1707781205)",
      coversThisModel: true,
      documentCovers: "Betta SE Plus Smart Pool Skimmer",
      note: "Manual title names the SE Plus explicitly, so it is distinguishable from the Betta SE manual.",
    },
    identityIssue:
      "DEFECT FOUND AND CORRECTED: the stored record cited https://bettabot.com/products/betta-se, which is the Betta SE — a DIFFERENT model with its own manual and its own 1-year warranty. The correct page for the stored product is /products/betta-se-plus. The two models are close enough to be confused and are now kept apart by URL and by manual.",
  },
  sourceChecks: [
    { url: "https://bettabot.com/products/betta-se", title: "Betta SE product page (cited by the stored record — WRONG MODEL)", status: "ok", note: "Live and readable, but it describes the Betta SE, not the SE Plus. Removed as a source for this product." },
    { url: BETTA_PAGE, title: BETTA_TITLE, status: "ok" },
    { url: BETTA_MANUAL_PAGE, title: "Betta SE Plus manual page", status: "ok" },
    { url: BETTA_MANUAL, title: BETTA_MANUAL_TITLE, status: "ok" },
    { url: "https://www.amazon.com/Betta-SE-Plus-Continuous-Safeguard/dp/B0CVMQ3XBX", title: "Amazon US listing", status: "not_rechecked", note: "Retailer listing; manufacturer sources checked instead." },
  ],
  observations: [
    { field: "powerType", value: "Cordless, solar with dual charging (solar and adapter)", sourceUrl: BETTA_PAGE, sourceTitle: BETTA_TITLE, observedOn: D },
    { field: "runtimeMins", value: "30+ hours of continuous cleaning on a single charge", sourceUrl: BETTA_PAGE, sourceTitle: BETTA_TITLE, observedOn: D },
    { field: "chargeTimeHrs", value: "5 to 6 hours under direct sunlight or 3.5 hours with the adapter", sourceUrl: BETTA_PAGE, sourceTitle: BETTA_TITLE, observedOn: D },
    { field: "poolSizeSuitability", value: "Up to 40 ft × 60 ft (approx. 2,400 sq. ft.)", sourceUrl: BETTA_PAGE, sourceTitle: BETTA_TITLE, observedOn: D },
    { field: "poolTypes", value: "Above-Ground, In-Ground", sourceUrl: BETTA_PAGE, sourceTitle: BETTA_TITLE, observedOn: D },
    { field: "surfacesCleaned", value: "Pool surface only — leaves, dust, pollen, insects, and pet hair", sourceUrl: BETTA_PAGE, sourceTitle: BETTA_TITLE, observedOn: D, note: "This is a skimmer. It does not clean the floor, walls or waterline." },
    { field: "filtration", value: "Large fine-mesh (200 um) debris basket with a top handle", sourceUrl: BETTA_PAGE, sourceTitle: BETTA_TITLE, observedOn: D },
    { field: "filtrationMicrons", value: "200 um", sourceUrl: BETTA_PAGE, sourceTitle: BETTA_TITLE, observedOn: D },
    { field: "navigation", value: "Ultrasonic radar technology to detect obstacles", sourceUrl: BETTA_PAGE, sourceTitle: BETTA_TITLE, observedOn: D },
    { field: "remoteControl", value: "Wireless remote control included", sourceUrl: BETTA_PAGE, sourceTitle: BETTA_TITLE, observedOn: D },
    { field: "warranty", value: "1-YEAR WARRANTY", sourceUrl: BETTA_PAGE, sourceTitle: BETTA_TITLE, observedOn: D, applicability: "US market" },
    { field: "warranty", value: "1-Year Manufacturer's Warranty from the date of purchase", sourceUrl: BETTA_MANUAL, sourceTitle: BETTA_MANUAL_TITLE, observedOn: D, applicability: "US market", note: "Second, higher-authority source agreeing with the product page." },
    { field: "surfaceTypes", value: "fresh water or salty water up to 5000 P.P.M.", sourceUrl: BETTA_MANUAL, sourceTitle: BETTA_MANUAL_TITLE, observedOn: D, note: "Water chemistry limit, recorded here because no finish compatibility is published." },
    { field: "cleaningModes", value: "Smart auto-cleaning with remote mode switching", sourceUrl: BETTA_PAGE, sourceTitle: BETTA_TITLE, observedOn: D },
  ],
  notPubliclyStated: [
    { field: "modelNumber", checked: [BETTA_PAGE, BETTA_MANUAL], note: "No SKU or part number printed on the product page or in the manual." },
    { field: "weightLbs", checked: [BETTA_PAGE, BETTA_MANUAL], note: "No weight published by the manufacturer." },
    { field: "dimensions", checked: [BETTA_PAGE, BETTA_MANUAL], note: "No dimensions published." },
    { field: "batteryCapacity", checked: [BETTA_PAGE, BETTA_MANUAL], note: "Runtime and charge time are stated; cell capacity is not." },
    { field: "appSupport", checked: [BETTA_PAGE, BETTA_MANUAL], note: "A wireless remote is stated. No app is mentioned either way, so 'has no app' is an inference, not a manufacturer statement." },
    { field: "wifi", checked: [BETTA_PAGE, BETTA_MANUAL], note: "Not mentioned." },
    { field: "maxDepthFt", checked: [BETTA_PAGE, BETTA_MANUAL], note: "A shallow-water safeguard is described but no depth range is given." },
    { field: "minDepthFt", checked: [BETTA_PAGE, BETTA_MANUAL], note: "A shallow-water safeguard is described but no depth range is given." },
    { field: "suctionRate", checked: [BETTA_PAGE, BETTA_MANUAL], note: "Not published." },
    { field: "filterCapacityL", checked: [BETTA_PAGE, BETTA_MANUAL], note: "The basket is described as large; no volume is given." },
    { field: "includedAccessories", checked: [BETTA_PAGE], note: "The remote is named; a full box-contents list is not published." },
    { field: "manualDocumentId", checked: [BETTA_MANUAL], note: "The manual carries no printed document number." },
  ],
};

/* ------------------------------------------------------------------ */

const E10_PAGE = "https://www.maytronics.com/global/store/residential-pools/best-value-cleaners/dolphin-e10/99996133.html";
const E10_TITLE = "Maytronics Dolphin E10 (99996133) — official product page (global store)";
const E10_MANUAL = "https://brand.maytronics.com/m/29de184d3f07aa7b/original/UM-8151910.pdf";
const E10_MANUAL_TITLE = "Maytronics User Instructions 8151910 (linked by Maytronics for part 99996133-US)";

const dolphinE10: ProductVerification = {
  productId: "prod-dolphin-e10",
  checkedOn: D,
  identity: {
    brand: "Maytronics (Dolphin)",
    canonicalName: "Dolphin E10",
    modelNumber: "99996133 (global) / 99996133-US (US)",
    modelNumberSource: E10_PAGE,
    officialProductPageUrl: E10_PAGE,
    manual: {
      url: E10_MANUAL,
      documentId: "8151910",
      revision: null,
      coversThisModel: true,
      documentCovers: "Robotic Pool Cleaner 'Mass 13' — the internal platform name Maytronics serves for part 99996133-US",
      note: "Served by Maytronics' own manual portal keyed to the US part number, so it is the correct document, but its cover name is the platform code rather than 'E10'.",
    },
    identityIssue:
      "The cited product page is Maytronics' GLOBAL store, not the US store, and the US part number carries a -US suffix. Values below are therefore recorded with a global-market applicability flag and must not be presented as US-specific without re-checking the US page.",
  },
  sourceChecks: [
    { url: E10_PAGE, title: E10_TITLE, status: "ok", note: "Global store page — market applicability flagged." },
    { url: "https://manuals.maytronics.com/intro/?pn=99996133-US", title: "Maytronics manual portal for 99996133-US", status: "ok" },
    { url: E10_MANUAL, title: E10_MANUAL_TITLE, status: "ok" },
    { url: "https://lesliespool.com/dolphin-e10-above-robotic-ground-pool-cleaner/368626.html", title: "Leslie's Pool Supplies listing", status: "not_rechecked", note: "Retailer listing; manufacturer sources checked instead." },
  ],
  observations: [
    { field: "powerType", value: "corded (mains power supply unit)", sourceUrl: E10_PAGE, sourceTitle: E10_TITLE, observedOn: D, applicability: "global" },
    { field: "cableLengthFt", value: "12.0 m", sourceUrl: E10_PAGE, sourceTitle: E10_TITLE, observedOn: D, applicability: "global" },
    { field: "weightLbs", value: "6.63 Kg.", sourceUrl: E10_PAGE, sourceTitle: E10_TITLE, observedOn: D, applicability: "global" },
    { field: "runtimeMins", value: "1.5 Hours", sourceUrl: E10_PAGE, sourceTitle: E10_TITLE, observedOn: D, applicability: "global" },
    { field: "poolSizeSuitability", value: "8 m", sourceUrl: E10_PAGE, sourceTitle: E10_TITLE, observedOn: D, applicability: "global", note: "Stated as the maximum pool length." },
    { field: "poolTypes", value: "Above Ground", sourceUrl: E10_PAGE, sourceTitle: E10_TITLE, observedOn: D, applicability: "global" },
    { field: "surfacesCleaned", value: "Floor", sourceUrl: E10_PAGE, sourceTitle: E10_TITLE, observedOn: D, applicability: "global", note: "Walls and waterline are NOT listed for this model." },
    { field: "filtration", value: "Fine Filter Kit", sourceUrl: E10_PAGE, sourceTitle: E10_TITLE, observedOn: D, applicability: "global" },
    { field: "navigation", value: "CleverClean™", sourceUrl: E10_PAGE, sourceTitle: E10_TITLE, observedOn: D, applicability: "global" },
    { field: "suctionRate", value: "15.0 M³/H", sourceUrl: E10_PAGE, sourceTitle: E10_TITLE, observedOn: D, applicability: "global" },
    { field: "warranty", value: "2 Years", sourceUrl: E10_PAGE, sourceTitle: E10_TITLE, observedOn: D, applicability: "global" },
    { field: "cleaningModes", value: "Standard Brush; single standard cycle", sourceUrl: E10_PAGE, sourceTitle: E10_TITLE, observedOn: D, applicability: "global" },
    { field: "includedAccessories", value: "Caddy included", sourceUrl: E10_PAGE, sourceTitle: E10_TITLE, observedOn: D, applicability: "global" },
    { field: "maxDepthFt", value: "Maximum depth: 5 m (16.4 ft)", sourceUrl: E10_MANUAL, sourceTitle: E10_MANUAL_TITLE, observedOn: D },
    { field: "minDepthFt", value: "Minimum depth: 0.4 m (1.33 ft)", sourceUrl: E10_MANUAL, sourceTitle: E10_MANUAL_TITLE, observedOn: D },
  ],
  notPubliclyStated: [
    { field: "filtrationMicrons", checked: [E10_PAGE, E10_MANUAL], note: "'Fine Filter Kit' is named but no micron rating is published for this model." },
    { field: "dimensions", checked: [E10_PAGE, E10_MANUAL], note: "The page lists PACKAGE dimensions (560 × 449 × 313 mm) only. Package size is not unit size and is not substituted for it." },
    { field: "filterCapacityL", checked: [E10_PAGE, E10_MANUAL], note: "Not published." },
    { field: "surfaceTypes", checked: [E10_PAGE, E10_MANUAL], note: "Pool type is stated; liner/finish compatibility is not." },
    { field: "manualRevisionDate", checked: [E10_MANUAL], note: "The document carries a part number but no printed revision or date." },
    {
      field: "appSupport",
      checked: [E10_PAGE, E10_MANUAL],
      note: "Maytronics' specification table carries app and Wi-Fi rows for models that have them and carries neither for the E10. An absent row is suggestive but is not a manufacturer statement that no app exists, so 'no app' is not published as a fact.",
    },
    { field: "wifi", checked: [E10_PAGE, E10_MANUAL], note: "No Wi-Fi row appears in the specification table for this model; as above, that is not a positive statement of absence." },
    { field: "remoteControl", checked: [E10_PAGE, E10_MANUAL], note: "Not mentioned either way." },
  ],
};

/* ------------------------------------------------------------------ */

const BEATBOT_PAGE = "https://beatbot.com/pages/aquasense-2-ultra";
const BEATBOT_TITLE = "Beatbot AquaSense 2 Ultra — official product page";
const BEATBOT_MANUAL_INDEX = "https://mybeatbot.com/pages/user-manuals";
const BEATBOT_MANUAL = "https://drive.google.com/file/d/1j8-c5Pkk5-QzreFJBhWnXF13ar9Kf3if/view";

const beatbotAquasense2Ultra: ProductVerification = {
  productId: "prod-beatbot-aquasense-2-ultra",
  checkedOn: D,
  identity: {
    brand: "Beatbot",
    canonicalName: "Beatbot AquaSense 2 Ultra Robotic Pool Cleaner",
    modelNumber: null,
    modelNumberSource: null,
    officialProductPageUrl: BEATBOT_PAGE,
    manual: {
      url: BEATBOT_MANUAL,
      documentId: null,
      revision: null,
      coversThisModel: true,
      documentCovers: "AquaSense 2 Ultra Robotic Pool Cleaner",
      note: "Listed under that exact model name on Beatbot's own manual index; the file itself is hosted on a third-party drive by the manufacturer.",
    },
    identityIssue:
      "Beatbot sells AquaSense 2, AquaSense 2 Pro and AquaSense 2 Ultra with separate manuals and materially different capability. Only Ultra figures are recorded; no value is carried across from the Pro.",
  },
  sourceChecks: [
    { url: BEATBOT_PAGE, title: BEATBOT_TITLE, status: "ok" },
    { url: BEATBOT_MANUAL_INDEX, title: "Beatbot official user-manual index", status: "ok" },
    {
      url: "https://www.amazon.com/Beatbot-AquaSense-Cordless-Cleaning-Clarification/dp/B0DMN6NV6H",
      title: "Amazon US listing (B0DMN6NV6H) — retired as the destination, still live",
      status: "not_rechecked",
      note:
        "Was the destination until 3 August 2026. It read cleanly on 31 July — brand Beatbot, model number PRCMDS02G-2025 — and it is not dead; the owner simply directed us to a different listing. Recorded so the swap is visible rather than looking like a correction of a fault.",
    },
    {
      url: "https://www.amazon.com/Beatbot-AquaSense-Ultra-Cordless-Clarification/dp/B0G7B6F5FZ",
      title: "Amazon US listing (B0G7B6F5FZ) — current destination, supplied by the owner",
      status: "not_rechecked",
      note:
        "Supplied and confirmed by the owner on 3 August 2026. Five server-side reads on that date all returned Amazon's bot-mitigation page, so nothing on the listing has been read here and the model number could not be compared with the retired ASIN's. Beatbot ships AquaSense, AquaSense Pro, AquaSense 2, AquaSense 2 Pro and AquaSense 2 Ultra, so this rests entirely on the owner's confirmation.",
    },
  ],
  observations: [
    { field: "powerType", value: "Cordless", sourceUrl: BEATBOT_PAGE, sourceTitle: BEATBOT_TITLE, observedOn: D },
    { field: "batteryCapacity", value: "13,400mAh", sourceUrl: BEATBOT_PAGE, sourceTitle: BEATBOT_TITLE, observedOn: D },
    { field: "runtimeMins", value: "10h surface / 5h floor / 5h walls", sourceUrl: BEATBOT_PAGE, sourceTitle: BEATBOT_TITLE, observedOn: D, note: "Three separate mode figures; there is no single whole-machine runtime." },
    { field: "chargeTimeHrs", value: "4.5h", sourceUrl: BEATBOT_PAGE, sourceTitle: BEATBOT_TITLE, observedOn: D },
    { field: "poolSizeSuitability", value: "up to 3,875 sq.ft", sourceUrl: BEATBOT_PAGE, sourceTitle: BEATBOT_TITLE, observedOn: D },
    { field: "poolTypes", value: "In-ground", sourceUrl: BEATBOT_PAGE, sourceTitle: BEATBOT_TITLE, observedOn: D },
    { field: "surfacesCleaned", value: "5-in-1: surface, floor, walls, waterline and water clarification", sourceUrl: BEATBOT_PAGE, sourceTitle: BEATBOT_TITLE, observedOn: D },
    { field: "filtrationMicrons", value: "150μm", sourceUrl: BEATBOT_PAGE, sourceTitle: BEATBOT_TITLE, observedOn: D },
    { field: "filtration", value: "Dual-layer ultra-fine filtration", sourceUrl: BEATBOT_PAGE, sourceTitle: BEATBOT_TITLE, observedOn: D },
    { field: "navigation", value: "HybridSense® AI with dual TOF sensors", sourceUrl: BEATBOT_PAGE, sourceTitle: BEATBOT_TITLE, observedOn: D },
    { field: "appSupport", value: "App control with scheduling, water temperature and alerts", sourceUrl: BEATBOT_PAGE, sourceTitle: BEATBOT_TITLE, observedOn: D },
    { field: "warranty", value: "3-year full replacement", sourceUrl: BEATBOT_PAGE, sourceTitle: BEATBOT_TITLE, observedOn: D, applicability: "US market" },
  ],
  notPubliclyStated: [
    { field: "modelNumber", checked: [BEATBOT_PAGE, BEATBOT_MANUAL_INDEX], note: "No SKU or part number published." },
    { field: "weightLbs", checked: [BEATBOT_PAGE], note: "No weight published on the official product page." },
    { field: "dimensions", checked: [BEATBOT_PAGE], note: "Not published." },
    { field: "wifi", checked: [BEATBOT_PAGE], note: "App control is stated; the connection type is not specified." },
    { field: "remoteControl", checked: [BEATBOT_PAGE], note: "Not mentioned." },
    { field: "maxDepthFt", checked: [BEATBOT_PAGE], note: "Not published." },
    { field: "minDepthFt", checked: [BEATBOT_PAGE], note: "Not published." },
    { field: "suctionRate", checked: [BEATBOT_PAGE], note: "Not published." },
    { field: "filterCapacityL", checked: [BEATBOT_PAGE], note: "Not published." },
    { field: "surfaceTypes", checked: [BEATBOT_PAGE], note: "Not published." },
    { field: "cleaningModes", checked: [BEATBOT_PAGE], note: "Coverage is described as 5-in-1 but the selectable modes are not enumerated." },
    { field: "includedAccessories", checked: [BEATBOT_PAGE], note: "No box-contents list published." },
    { field: "manualDocumentId", checked: [BEATBOT_MANUAL_INDEX], note: "The index links a file with no printed document number." },
    { field: "manualRevisionDate", checked: [BEATBOT_MANUAL_INDEX], note: "No revision or date published." },
  ],
};

/* ------------------------------------------------------------------ */

/* This URL was recorded as "the X1". Re-read on 3 August 2026 it is titled     */
/* "Scuba X1 Essential In-Ground Pool Cleaner" — the ENTRY model of the X1      */
/* family, not the Pro. It is kept as a source check, and is no longer this     */
/* record's product page.                                                      */
const X1_PAGE = "https://aiper.com/us/aiper-scuba-series/aiper-scuba-x1";
const X1_TITLE = "Aiper Scuba X1 Essential — official US product page (the base model, not the Pro)";
const X1_MOVED = "2026-08-03";

const aiperScubaX1: ProductVerification = {
  productId: "prod-aiper-scuba-x1",
  checkedOn: X1_MOVED,
  identity: {
    brand: "Aiper",
    canonicalName: "Aiper Scuba X1 Pro",
    modelNumber: null,
    modelNumberSource: null,
    // No readable official page for the Pro: aiper.com/us/aiper-scuba-series/
    // aiper-scuba-x1-pro returns 404. Recording the Essential's page here would
    // attach the wrong machine's specification to this record.
    officialProductPageUrl: null,
    manual: null,
    identityIssue:
      "THIS RECORD CHANGED MODEL ON 3 AUGUST 2026, at the owner's direction, from the Aiper Scuba X1 to the Aiper Scuba X1 Pro. Everything that follows must be read in that light. Aiper's Scuba line runs SE, S1, S1 Pro, X1 Essential, X1 Pro and X1 Pro Max with no published model number, so models separate only by page URL and product name — and the page this record was originally built against is titled 'Scuba X1 Essential', meaning the stored specification described the entry model. Those observations have been REMOVED rather than carried across: they are evidence about a different machine, and no observation for the Pro has been read. No official Aiper page for the Pro was reachable (404), and the Amazon listing the owner supplied returns a bot-mitigation page to server-side reads. The identity therefore rests on the owner's confirmation alone, and the Pro's specification is unverified.",
  },
  sourceChecks: [
    { url: X1_PAGE, title: X1_TITLE, status: "ok" },
    { url: "https://aiper.com/us/pages/user-manual", title: "Aiper manual index (attempted)", status: "unreadable", note: "HTTP 404." },
    { url: "https://aiper.com/pages/user-manuals", title: "Aiper manual index (attempted, alternate path)", status: "unreadable", note: "HTTP 404." },
    {
      url: "https://aiper.com/us/aiper-scuba-series/aiper-scuba-x1-pro",
      title: "Aiper Scuba X1 Pro — official page (attempted)",
      status: "unreadable",
      note: "HTTP 404 on 3 August 2026. No official Aiper page for the Pro was found, which is why this record carries no product page URL.",
    },
    {
      url: "https://www.amazon.com/AIPER-High-Power-Horizontal-Waterline-Scrubbing/dp/B0F9WN961G",
      title: "Amazon US listing (B0F9WN961G) — retired, and it had nothing to buy",
      status: "not_rechecked",
      note: "Was the destination until 3 August 2026. It never confirmed its own model — title 'AIPER Pool Cleaner', model name and model number both 'Blue' — and the SerpApi read of 31 July found no buying option at all, so the buy button led to a listing nobody could purchase from.",
    },
    {
      url: "https://www.amazon.com/AIPER-Scuba-X1-Pro-Underwater/dp/B0GVT2YPLB",
      title: "Amazon US listing (B0GVT2YPLB) — current destination, supplied by the owner",
      status: "not_rechecked",
      note: "Supplied and confirmed by the owner on 3 August 2026. Not independently read: Amazon returns a bot-mitigation page to server-side requests. The listing URL names the X1 Pro and the owner's artwork shows 'SCUBA X1 PRO' on the machine's body, which is consistent, but neither is a reading of the listing itself.",
    },
  ],
  /* Deliberately empty. Every observation previously here was read from the
     Scuba X1 Essential's page and is evidence about a different machine. They
     were removed when this record moved to the Pro rather than relabelled —
     carrying them across is exactly the substitution this registry exists to
     prevent. Nothing on this product may be stated as fact until a readable
     source for the Pro is found. */
  observations: [],
  notPubliclyStated: [
    { field: "warranty", checked: [X1_PAGE], note: "No warranty term stated anywhere on the official product page." },
    { field: "weightLbs", checked: [X1_PAGE], note: "Not published." },
    { field: "dimensions", checked: [X1_PAGE], note: "Not published." },
    { field: "batteryCapacity", checked: [X1_PAGE], note: "Runtime and charge time are stated; cell capacity is not." },
    { field: "modelNumber", checked: [X1_PAGE], note: "No SKU published." },
    { field: "manualUrl", checked: [X1_PAGE, "https://aiper.com/pages/user-manuals"], note: "A printed manual is listed in the box, but no downloadable manual was found on the official domain." },
    { field: "wifi", checked: [X1_PAGE], note: "App control is stated; connection type is not." },
    { field: "remoteControl", checked: [X1_PAGE], note: "Not mentioned." },
    { field: "maxDepthFt", checked: [X1_PAGE], note: "Not published." },
    { field: "minDepthFt", checked: [X1_PAGE], note: "Not published." },
    { field: "suctionRate", checked: [X1_PAGE], note: "Not published for this model." },
    { field: "filterCapacityL", checked: [X1_PAGE], note: "Not published." },
    { field: "cleaningModes", checked: [X1_PAGE], note: "Coverage is described; selectable modes are not enumerated." },
  ],
};

/* ------------------------------------------------------------------ */

const S1_PAGE = "https://aiper.com/us/aiper-scuba-series/aiper-scuba-s1";
const S1_TITLE = "Aiper Scuba S1 — official US product page";

const aiperScubaS1: ProductVerification = {
  productId: "prod-aiper-scuba-s1",
  checkedOn: D,
  identity: {
    brand: "Aiper",
    canonicalName: "Aiper Scuba S1 Cordless Robotic Pool Cleaner",
    modelNumber: null,
    modelNumberSource: null,
    officialProductPageUrl: S1_PAGE,
    manual: null,
    identityIssue:
      "The Scuba S1 and Scuba S1 Pro are separate models with separate manuals. Only base-S1 figures are recorded. No model number is published and no official manual index was found on aiper.com.",
  },
  sourceChecks: [
    { url: S1_PAGE, title: S1_TITLE, status: "ok" },
    { url: "https://www.poolbots.com/reviews/aiper-scuba-s1", title: "PoolBots hands-on review", status: "not_rechecked", note: "Independent editorial source; not used for manufacturer specification values." },
  ],
  observations: [
    { field: "powerType", value: "Cordless", sourceUrl: S1_PAGE, sourceTitle: S1_TITLE, observedOn: D },
    { field: "runtimeMins", value: "Up to 180 Minutes", sourceUrl: S1_PAGE, sourceTitle: S1_TITLE, observedOn: D },
    { field: "chargeTimeHrs", value: "3-4 Hours", sourceUrl: S1_PAGE, sourceTitle: S1_TITLE, observedOn: D, note: "A range, not a single figure." },
    { field: "poolSizeSuitability", value: "1600 sq.ft (150㎡) 50ft (15m) in length", sourceUrl: S1_PAGE, sourceTitle: S1_TITLE, observedOn: D },
    { field: "poolTypes", value: "In-ground", sourceUrl: S1_PAGE, sourceTitle: S1_TITLE, observedOn: D, note: "Specification block." },
    { field: "poolTypes", value: "Designed for both above-ground and in-ground pools", sourceUrl: S1_PAGE, sourceTitle: S1_TITLE, observedOn: D, note: "Marketing copy on the SAME page, contradicting the specification block." },
    { field: "surfacesCleaned", value: "4-Zone Full Coverage Cleaning — floor, walls, waterline", sourceUrl: S1_PAGE, sourceTitle: S1_TITLE, observedOn: D },
    { field: "filtration", value: "180μm Fine Filter Basket and 3μm MicroMesh™ Ultra-fine Filter", sourceUrl: S1_PAGE, sourceTitle: S1_TITLE, observedOn: D },
    { field: "filtrationMicrons", value: "3μm", sourceUrl: S1_PAGE, sourceTitle: S1_TITLE, observedOn: D, note: "Finest filter supplied; the basket alone is 180μm." },
    { field: "filterCapacityL", value: "3.5L", sourceUrl: S1_PAGE, sourceTitle: S1_TITLE, observedOn: D },
    { field: "suctionRate", value: "4200GPH(15900LPH)", sourceUrl: S1_PAGE, sourceTitle: S1_TITLE, observedOn: D },
    { field: "navigation", value: "WavePath™ Navigation 2.0 Technology", sourceUrl: S1_PAGE, sourceTitle: S1_TITLE, observedOn: D },
    { field: "appSupport", value: "App with mode selection, cleaning history and OTA upgrades", sourceUrl: S1_PAGE, sourceTitle: S1_TITLE, observedOn: D },
    { field: "includedAccessories", value: "1x Aiper Scuba S1, 1x DC Charger, 1x User Manual, 1x Retrieval Hook", sourceUrl: S1_PAGE, sourceTitle: S1_TITLE, observedOn: D },
  ],
  notPubliclyStated: [
    { field: "warranty", checked: [S1_PAGE], note: "No warranty term stated anywhere on the official product page." },
    { field: "weightLbs", checked: [S1_PAGE], note: "Not published." },
    { field: "dimensions", checked: [S1_PAGE], note: "Not published." },
    { field: "batteryCapacity", checked: [S1_PAGE], note: "Not published." },
    { field: "modelNumber", checked: [S1_PAGE], note: "No SKU published." },
    { field: "manualUrl", checked: [S1_PAGE], note: "A printed manual ships in the box; no downloadable manual was found on the official domain." },
    { field: "wifi", checked: [S1_PAGE], note: "App control is stated; connection type is not." },
    { field: "remoteControl", checked: [S1_PAGE], note: "Not mentioned." },
    { field: "maxDepthFt", checked: [S1_PAGE], note: "Not published." },
    { field: "minDepthFt", checked: [S1_PAGE], note: "Not published." },
    { field: "surfaceTypes", checked: [S1_PAGE], note: "Not published for this model." },
    { field: "cleaningModes", checked: [S1_PAGE], note: "The app selects modes but the page does not name them." },
  ],
};

/* ------------------------------------------------------------------ */

const SEAGULL_PAGE = "https://aiper.com/us/aiper-seagull-series/aiper-seagull-se-new";
const SEAGULL_TITLE = "Aiper Seagull SE — official US product page";

const aiperSeagullSe: ProductVerification = {
  productId: "prod-aiper-seagull-se",
  checkedOn: D,
  identity: {
    brand: "Aiper",
    canonicalName: "Aiper Seagull SE",
    modelNumber: null,
    modelNumberSource: null,
    officialProductPageUrl: SEAGULL_PAGE,
    manual: null,
    identityIssue:
      "Aiper has shipped more than one revision of the Seagull SE; the cited URL carries a '-new' suffix, indicating a refreshed page for a refreshed unit. Without a model number the revisions cannot be distinguished, so every value here is flagged as applying to the current page revision only.",
  },
  sourceChecks: [
    { url: SEAGULL_PAGE, title: SEAGULL_TITLE, status: "ok", note: "Sparse page — the manufacturer publishes very little specification detail for this model." },
    { url: "https://www.pcworld.com/article/1370644/aiper-seagull-se-robotic-pool-cleaner-review.html", title: "PCWorld review", status: "not_rechecked", note: "Independent editorial source; not used for manufacturer specification values." },
  ],
  observations: [
    { field: "powerType", value: "Cordless", sourceUrl: SEAGULL_PAGE, sourceTitle: SEAGULL_TITLE, observedOn: D, applicability: "current page revision" },
    { field: "runtimeMins", value: "90 minutes", sourceUrl: SEAGULL_PAGE, sourceTitle: SEAGULL_TITLE, observedOn: D, applicability: "current page revision" },
    { field: "poolTypes", value: "Above-ground", sourceUrl: SEAGULL_PAGE, sourceTitle: SEAGULL_TITLE, observedOn: D, applicability: "current page revision" },
    { field: "navigation", value: "Auto-parking near the pool wall at the end of a cycle", sourceUrl: SEAGULL_PAGE, sourceTitle: SEAGULL_TITLE, observedOn: D, applicability: "current page revision" },
    { field: "surfacesCleaned", value: "Pool floor", sourceUrl: SEAGULL_PAGE, sourceTitle: SEAGULL_TITLE, observedOn: D, applicability: "current page revision" },
    { field: "includedAccessories", value: "2x brushes, 2x wheels, retrieval hook, charger", sourceUrl: SEAGULL_PAGE, sourceTitle: SEAGULL_TITLE, observedOn: D, applicability: "current page revision" },
  ],
  notPubliclyStated: [
    { field: "warranty", checked: [SEAGULL_PAGE], note: "No warranty term stated on the official product page." },
    { field: "weightLbs", checked: [SEAGULL_PAGE], note: "Not published." },
    { field: "dimensions", checked: [SEAGULL_PAGE], note: "Not published." },
    { field: "batteryCapacity", checked: [SEAGULL_PAGE], note: "Not published." },
    { field: "chargeTimeHrs", checked: [SEAGULL_PAGE], note: "Runtime is stated; charge time is not." },
    { field: "poolSizeSuitability", checked: [SEAGULL_PAGE], note: "No maximum pool length or area is published for this model." },
    { field: "filtration", checked: [SEAGULL_PAGE], note: "No filter description published." },
    { field: "filtrationMicrons", checked: [SEAGULL_PAGE], note: "No micron rating published." },
    { field: "filterCapacityL", checked: [SEAGULL_PAGE], note: "Not published." },
    { field: "appSupport", checked: [SEAGULL_PAGE], note: "No app is mentioned either way." },
    { field: "wifi", checked: [SEAGULL_PAGE], note: "Not mentioned." },
    { field: "remoteControl", checked: [SEAGULL_PAGE], note: "Not mentioned." },
    { field: "modelNumber", checked: [SEAGULL_PAGE], note: "No SKU published." },
    { field: "manualUrl", checked: [SEAGULL_PAGE], note: "No manual link on the product page and no manual index found on the official domain." },
    { field: "maxDepthFt", checked: [SEAGULL_PAGE], note: "Not published." },
    { field: "minDepthFt", checked: [SEAGULL_PAGE], note: "Not published." },
    { field: "suctionRate", checked: [SEAGULL_PAGE], note: "Not published." },
    { field: "surfaceTypes", checked: [SEAGULL_PAGE], note: "Not published." },
    { field: "cleaningModes", checked: [SEAGULL_PAGE], note: "Not published." },
  ],
};

/* ------------------------------------------------------------------ */

/* ------------------------------------------------------------------ */
/* Owner-confirmed identities — 3 August 2026.                          */
/*                                                                      */
/* Danny supplied both Amazon listings and confirmed they are the right */
/* models. Amazon serves a bot-mitigation page to server-side reads, so  */
/* the listing title could not be read back the way every record above  */
/* was checked against a manufacturer page. The identity here therefore */
/* rests on the owner's confirmation, which is recorded as such rather  */
/* than dressed up as a source check.                                   */
/* ------------------------------------------------------------------ */

const OWNER_CONFIRMED = "2026-08-03";

const dolphinProteusDx4Plus: ProductVerification = {
  productId: "prod-dolphin-proteus-dx4-plus",
  checkedOn: OWNER_CONFIRMED,
  identity: {
    brand: "Maytronics",
    canonicalName: "Dolphin Proteus DX4 Plus",
    modelNumber: null,
    modelNumberSource: null,
    officialProductPageUrl: null,
    manual: null,
    identityIssue:
      "Identity is owner-confirmed, not source-verified. Danny supplied ASIN B083YWJ5PQ on 3 August 2026 and confirmed the listing is the Proteus DX4 Plus. No manufacturer page has been read for this record, and Amazon blocks server-side reads of the listing, so no independent check stands behind the model name yet.",
  },
  sourceChecks: [
    {
      url: "https://www.amazon.com/Dolphin-Automatic-Climbing-Waterline-Scrubber/dp/B083YWJ5PQ",
      title: "Amazon listing supplied by the owner",
      status: "not_rechecked",
      note: "Supplied and confirmed by the owner on 3 August 2026. Not independently read: Amazon returns a bot-mitigation page to server-side requests.",
    },
  ],
  observations: [],
  notPubliclyStated: [],
};

const aiperScubaV3AiVision: ProductVerification = {
  productId: "prod-aiper-scuba-v3-ai-vision",
  checkedOn: OWNER_CONFIRMED,
  identity: {
    brand: "AIPER",
    canonicalName: "AIPER Scuba V3 AI Vision",
    modelNumber: null,
    modelNumberSource: null,
    officialProductPageUrl: null,
    manual: null,
    identityIssue:
      "Identity is owner-confirmed, not source-verified. Danny supplied ASIN B0GG97427D on 3 August 2026 and confirmed the listing is the Scuba V3 AI Vision. AIPER sells Scuba S1, X1 and V3 as separate models, so this record must not be conflated with the Scuba X1 or S1 already held.",
  },
  sourceChecks: [
    {
      url: "https://www.amazon.com/AIPER-Vision-Cordless-Robotic-Cleaner/dp/B0GG97427D",
      title: "Amazon listing supplied by the owner",
      status: "not_rechecked",
      note: "Supplied and confirmed by the owner on 3 August 2026. Not independently read: Amazon returns a bot-mitigation page to server-side requests.",
    },
  ],
  observations: [],
  notPubliclyStated: [],
};

/** Retired records. Real evidence about products no longer in the catalogue. */
export const RETIRED_VERIFICATIONS: ProductVerification[] = [retiredDolphinPremier];

export const VERIFICATIONS: ProductVerification[] = [
  wybotC1,
  nautilusCcPlus,
  dolphinPremier,
  polarisFreedom,
  bettaSePlus,
  dolphinE10,
  beatbotAquasense2Ultra,
  aiperScubaX1,
  aiperScubaS1,
  aiperSeagullSe,
  dolphinProteusDx4Plus,
  aiperScubaV3AiVision,
];

export const verificationFor = (productId: string): ProductVerification | undefined =>
  VERIFICATIONS.find((v) => v.productId === productId);
