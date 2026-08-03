/**
 * Rights bases and provider rules.
 *
 * WHAT THIS FILE IS FOR: an asset record points at a rights basis by key rather
 * than repeating a paragraph of licence text ten times. When a licence changes,
 * it changes in one place and every asset that relies on it moves with it.
 *
 * WHAT IT IS NOT FOR: credentials. Where a provider needs authentication, the
 * record names the Worker secret and stops there.
 */
import type { Placement, SourceTier, Transformation } from "./types";

export interface RightsBasisDef {
  key: string;
  tier: SourceTier;
  provider: string;
  /** The permission, in the terms the provider actually grants it. */
  text: string;
  allowedMarkets: string[];
  allowedPlacements: Placement[];
  allowedTransformations: Transformation[];
  /** True when the provider forbids us hosting the file ourselves. */
  remoteServingRequired: boolean;
  localStoragePermitted: boolean;
  attributionRequired: string | null;
  expiryRule: string | null;
  /** Name of the Worker secret needed to use this route, if any. */
  credentialSecretRef: string | null;
  /** Evidence for the grant — a document, dashboard or agreement. */
  evidence: string;
}

/** Original BotPlanet artwork: the only basis with no external dependency. */
const ORIGINAL: RightsBasisDef = {
  key: "botplanet_original",
  tier: "original_botplanet",
  provider: "BotPlanet",
  text: "Original artwork authored in-house. Full usage rights in every market and placement, no attribution required, no expiry.",
  allowedMarkets: ["us", "global"],
  allowedPlacements: ["product_page", "category_page", "listing_card", "comparison", "homepage", "guide", "open_graph", "email"],
  allowedTransformations: ["proportional_resize", "format_conversion", "approved_crop"],
  remoteServingRequired: false,
  localStoragePermitted: true,
  attributionRequired: null,
  expiryRule: null,
  credentialSecretRef: null,
  evidence: "Authored in this repository; source files are versioned in git.",
};

/**
 * Branded placeholders. Deliberately separated from other original artwork:
 * a placeholder must never be eligible for Product schema, because a schema
 * consumer would take it as a photograph of the product.
 */
const PLACEHOLDER: RightsBasisDef = {
  ...ORIGINAL,
  key: "botplanet_placeholder",
  tier: "branded_placeholder",
  text: "Original BotPlanet placeholder artwork. Depicts no real product. Full usage rights, but barred from Product structured data because it is not a photograph of the product it stands in for.",
  allowedPlacements: ["product_page", "category_page", "listing_card", "comparison", "homepage"],
  allowedTransformations: ["proportional_resize", "format_conversion"],
  evidence: "Generated from a house SVG template in this repository.",
};

/**
 * Amazon Program Content. The account's ownership and current approval are
 * unverified, so this licence is a potential route rather than one held today,
 * and it is the most restrictive basis we track: content must be obtained through an
 * Amazon-approved interface, must not be cached or altered beyond permitted
 * resizing, and must be shown alongside a compliant tracked Special Link.
 *
 * NOTHING IS INGESTED UNDER THIS BASIS YET. Using it requires Creators API
 * credentials, which are held by Danny and are not present in the build
 * environment. Recording the basis without recording an asset is the honest
 * state: the route is lawful and available, and the file has not been fetched.
 */
const AMAZON: RightsBasisDef = {
  key: "amazon_associates_program_content",
  tier: "affiliate_api",
  provider: "Amazon Associates US",
  text: "Amazon grants a limited licence to display Amazon Program Content on an approved site in connection with participation in the Associates programme, obtained through Amazon-approved Associates tools or the Creators API, served from Amazon's hosts, unaltered except for permitted proportional resizing, and shown with compliant tracked Amazon Special Links. BotPlanet's Associates account ownership and current approval are unverified, so this basis is recorded as a future lawful route, not a licence held today.",
  allowedMarkets: ["us"],
  allowedPlacements: ["product_page", "listing_card", "comparison", "category_page"],
  allowedTransformations: ["proportional_resize"],
  remoteServingRequired: true,
  localStoragePermitted: false,
  attributionRequired: null,
  expiryRule: "valid only while the Associates account remains in good standing; re-check quarterly",
  credentialSecretRef: "AMAZON_CREATORS_API_KEY",
  evidence: "Amazon Associates Operating Agreement; D1 affiliate_programs.amazon_us.image_permission. Account ownership and current approval are unverified (pending owner confirmation) — this basis cannot be exercised until both are evidenced.",
};

/**
 * A manufacturer press kit that states third-party usage permission. No such
 * grant has been located for any of the ten launch brands — see MEDIA_SOURCE_CHECKS
 * — so this basis is declared and unused. It exists so that when a brand does
 * grant one, the asset has somewhere correct to point.
 */
const PRESS_KIT: RightsBasisDef = {
  key: "manufacturer_press_kit",
  tier: "manufacturer_media_library",
  provider: "(per manufacturer)",
  text: "Manufacturer press kit or media library that states, in writing, that third parties may reproduce the supplied images for editorial coverage. The specific wording and its URL must be recorded on the asset before it is used.",
  allowedMarkets: ["us"],
  allowedPlacements: ["product_page", "category_page", "listing_card", "comparison", "guide"],
  allowedTransformations: ["proportional_resize", "format_conversion", "approved_crop"],
  remoteServingRequired: false,
  localStoragePermitted: true,
  attributionRequired: "as specified by the individual press kit",
  expiryRule: "re-check annually and on any product refresh",
  credentialSecretRef: null,
  evidence: "The press kit page itself, quoted verbatim on the asset record.",
};

export const RIGHTS_BASES: RightsBasisDef[] = [PRESS_KIT, AMAZON, ORIGINAL, PLACEHOLDER];

export const rightsBasis = (key: string): RightsBasisDef | undefined => RIGHTS_BASES.find((r) => r.key === key);

/**
 * Rules that apply to Amazon Program Content specifically, kept as data so a
 * test can assert we have not quietly broken one.
 */
export const AMAZON_IMAGE_RULES: string[] = [
  "Obtain images only through Amazon-approved Associates tools or the Creators API.",
  "Never scrape an Amazon page and never construct or guess an image URL.",
  "Do not download or permanently cache Program Content unless the applicable API and programme rules expressly permit it.",
  "Serve images from Amazon's hosts where the supplying mechanism requires it.",
  "Do not alter Program Content beyond permitted proportional resizing.",
  "Display images alongside a compliant tracked Amazon Special Link.",
  "Do not place Amazon Program Content in structured data where programme rules prohibit it.",
  "Remove Program Content promptly if the Associates account ceases to be in good standing.",
];

/**
 * The lawful-source check actually performed on 2026-07-31, recorded so that
 * "no manufacturer imagery is available" is a finding with evidence behind it
 * rather than an assumption nobody tested.
 */
export interface SourceCheck {
  brand: string;
  url: string;
  outcome: "no_press_kit_found" | "press_kit_without_permission" | "permission_granted" | "unreadable";
  note: string;
}

export const MEDIA_SOURCE_CHECK_DATE = "2026-07-31";

export const MEDIA_SOURCE_CHECKS: SourceCheck[] = [
  {
    brand: "Maytronics (Dolphin)",
    url: "https://www.maytronics.com/en-us/press-releases",
    outcome: "unreadable",
    note: "HTTP 404 — no press or media page found at the conventional path on the official US domain.",
  },
  {
    brand: "Aiper",
    url: "https://aiper.com/",
    outcome: "no_press_kit_found",
    note: "No press kit or media library with stated third-party usage permission was located. Aiper distributes press releases through PR Newswire, which grants no image licence to a commercial site.",
  },
  {
    brand: "Beatbot",
    url: "https://beatbot.com/pages/press",
    outcome: "unreadable",
    note: "HTTP 404 — no press page at the conventional path.",
  },
  {
    brand: "Polaris (Fluidra)",
    url: "https://www.fluidra.com/press-room/",
    outcome: "unreadable",
    note: "Returned no readable content; no image licence located for the Polaris brand.",
  },
  {
    brand: "WYBOT",
    url: "https://www.wybotpool.com/",
    outcome: "no_press_kit_found",
    note: "No media library on the official domain. The existing WYBOT affiliate relationship is Awin EU/UK (publisher 3012175) and its creatives are not licensed for the US site.",
  },
  {
    brand: "Betta (Solar Pool Technologies)",
    url: "https://bettabot.com/",
    outcome: "no_press_kit_found",
    note: "No press kit or media library with stated third-party usage permission.",
  },
];

/**
 * The single conclusion this job reached about product photography.
 *
 * It is deliberately blunt: no third-party product photograph is lawfully
 * available to this build environment today. The Amazon route is licensed and
 * live but requires Creators API credentials held by Danny; no manufacturer
 * publishes a press kit granting third-party use; and the remaining options
 * (scraping, guessing URLs, borrowing from search results, substituting a
 * similar model) are all prohibited. A product with no BotPlanet artwork of its
 * own therefore renders a branded placeholder that names the exact model and
 * claims nothing.
 */
export const PRODUCT_PHOTOGRAPHY_POSITION =
  "No third-party product photograph is ingested. The Amazon Associates route is a potential lawful source, but the account's ownership and current approval are unverified, and obtaining Program Content lawfully would also require Creators API credentials that this environment does not hold; the programme forbids scraping, guessed URLs and unapproved caching. No launch-brand manufacturer publishes a press kit granting third-party image use. Until one of those changes, no product carries a photograph. Five products are shown in original BotPlanet creatives, which we own outright and which do show the machine but carry our branding and headline text set into the image \u2014 they illustrate, they are not evidence, and they never enter Product structured data. Every other product renders an original BotPlanet branded placeholder that names the exact model and does not depict it.";
