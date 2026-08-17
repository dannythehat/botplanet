/**
 * Awin — WYBOT media ingestion.
 *
 * TWO WYBOT PROGRAMMES, AND THE DIFFERENCE IS THE WHOLE POINT:
 *
 *   115280  Wybot EU        Germany, EUR, eu.wybotpool.com   JOINED
 *   76816   WYBOTICS INC    United States, USD, wybotpool.com  PENDING
 *
 * The EU programme is the one BotPlanet has been in all along, and its creatives
 * are licensed for EU/UK traffic — not for a US site. The US programme was
 * recorded as not existing; it does exist, it was found in the Awin directory on
 * 2026-07-31, and an application is now in. Until it is approved, Awin returns
 * "No relationship exists" for its terms and its feed, so nothing can be
 * ingested and nothing is assumed.
 *
 * This file holds programme identity, the conservative terms and the
 * exact-model matcher. It holds no credential: the client reads the token from
 * the Worker secret at call time.
 */
import type { Placement } from "./types";

/* ------------------------------------------------------------------ */
/* Programme identity                                                  */
/* ------------------------------------------------------------------ */

export const AWIN_PUBLISHER_ID = "3012175";
export const AWIN_ACCOUNT_NAME = "botplanet";

/** The EU programme we are joined to. Not usable for US traffic. */
export const AWIN_WYBOT_EU_ADVERTISER_ID = "115280";
/** The US programme we have applied to. The one that matters for launch. */
export const AWIN_WYBOT_US_ADVERTISER_ID = "76816";

/**
 * Two different credentials, and they are not interchangeable.
 *
 * The OAuth token drives api.awin.com (accounts, programmes, programme details,
 * transactions). The product feed lives on productdata.awin.com and takes a
 * separate datafeed key generated under Toolbox → Create-a-Feed; the OAuth token
 * is rejected there. Verified 2026-07-31.
 */
export const AWIN_TOKEN_SECRET_REF = "AWIN_API_TOKEN";
export const AWIN_DATAFEED_SECRET_REF = "AWIN_DATAFEED_KEY";

export const AWIN_ENDPOINTS = {
  accounts: "https://api.awin.com/accounts",
  programmes: `https://api.awin.com/publishers/${AWIN_PUBLISHER_ID}/programmes`,
  programmeDetails: `https://api.awin.com/publishers/${AWIN_PUBLISHER_ID}/programmedetails`,
  datafeedList: "https://productdata.awin.com/datafeed/list/apikey",
} as const;

export type AwinRelationshipStatus = "joined" | "pending" | "rejected" | "notjoined";

export interface AwinProgramme {
  advertiserId: string;
  name: string;
  countryCode: string;
  currencyCode: string;
  displayUrl: string;
  /** Awin's own programme status, distinct from OUR relationship to it. */
  programmeStatus: string;
  relationship: AwinRelationshipStatus;
  /** True when this programme's creatives may be used on the US site. */
  usableForUsSite: boolean;
  apiVerifiedDate: string | null;
  notes: string;
}

export const WYBOT_EU_PROGRAMME: AwinProgramme = {
  advertiserId: AWIN_WYBOT_EU_ADVERTISER_ID,
  name: "Wybot EU",
  countryCode: "DE",
  currencyCode: "EUR",
  displayUrl: "https://www.eu.wybotpool.com/",
  programmeStatus: "Active",
  relationship: "joined",
  usableForUsSite: false,
  apiVerifiedDate: "2026-07-31",
  notes:
    "Joined and active, but its valid domains are eu.wybotpool.com and its region is Germany. Creatives and feed entries from this programme are licensed for EU/UK traffic and must never be used on the US site.",
};

export const WYBOT_US_PROGRAMME: AwinProgramme = {
  advertiserId: AWIN_WYBOT_US_ADVERTISER_ID,
  name: "WYBOTICS INC",
  countryCode: "US",
  currencyCode: "USD",
  displayUrl: "https://www.wybotpool.com",
  programmeStatus: "Active",
  relationship: "pending",
  usableForUsSite: false,
  apiVerifiedDate: "2026-07-31",
  notes:
    "Application submitted and confirmed by the API: relationship=pending returns this programme. Terms and product feed stay gated behind 'No relationship exists' until the advertiser approves. Nothing is ingested and no term is assumed in the meantime.",
};

export const AWIN_PROGRAMMES = [WYBOT_EU_PROGRAMME, WYBOT_US_PROGRAMME];

/**
 * What the Awin directory holds for the rest of the launch set, checked across
 * all 21,429 available programmes on 2026-07-31. Recorded so nobody re-runs the
 * search hoping for a different answer.
 */
export const AWIN_LAUNCH_BRAND_COVERAGE = {
  checkedOn: "2026-07-31",
  totalProgrammesScanned: 21429,
  usProgrammesScanned: 10965,
  findings: [
    { brand: "WYBOT", result: "US programme found — WYBOTICS INC (76816), applied for" },
    { brand: "Beatbot", result: "EU only — DE (123170), FR (123172), ES (123174), IT (123176). No US programme." },
    { brand: "Aiper", result: "not on Awin — the Aiper relationship is CJ advertiser 6404897" },
    { brand: "Maytronics / Dolphin", result: "not on Awin" },
    { brand: "Polaris / Fluidra", result: "not on Awin" },
    { brand: "Betta / Solar Pool Technologies", result: "not on Awin" },
  ],
  adjacentUsPoolProgrammes: [
    { id: "94499", name: "Pool Splash, LLC" },
    { id: "98069", name: "Sutro" },
    { id: "81845", name: "WaterGuru" },
    { id: "123698", name: "CHASING Cleaner" },
  ],
  note:
    "Adjacent programmes are recorded for commercial awareness only. None sells a launch product, so none is a media source for the ten.",
};

/* ------------------------------------------------------------------ */
/* Rights basis                                                        */
/* ------------------------------------------------------------------ */

export type AwinTermSource = "awin_api" | "owner_confirmed" | "gated_until_approval";

export interface AwinTerm {
  term: string;
  value: string;
  source: AwinTermSource;
}

/**
 * Every term is gated. Awin returns programme details only to a joined
 * publisher, so until WYBOTICS INC approves there is nothing to read and the
 * most restrictive reading applies. Nothing is inferred from the EU programme's
 * terms: a different programme in a different market is not evidence about this
 * one.
 */
export const WYBOT_US_TERMS: AwinTerm[] = [
  { term: "product feed access", value: "gated until approval", source: "gated_until_approval" },
  { term: "image URL use", value: "gated until approval", source: "gated_until_approval" },
  { term: "remote hosting required", value: "assumed required until confirmed", source: "gated_until_approval" },
  { term: "local caching", value: "assumed prohibited until confirmed", source: "gated_until_approval" },
  { term: "resizing", value: "assumed proportional only until confirmed", source: "gated_until_approval" },
  { term: "cropping", value: "assumed prohibited until confirmed", source: "gated_until_approval" },
  { term: "overlays", value: "assumed prohibited until confirmed", source: "gated_until_approval" },
  { term: "editorial use", value: "gated until approval", source: "gated_until_approval" },
  { term: "comparison use", value: "gated until approval", source: "gated_until_approval" },
  { term: "email use", value: "gated until approval", source: "gated_until_approval" },
  { term: "social use", value: "gated until approval", source: "gated_until_approval" },
  { term: "commission and cookie", value: "gated until approval", source: "gated_until_approval" },
  { term: "attribution", value: "gated until approval", source: "gated_until_approval" },
  { term: "territory", value: "US, from the programme's primary region", source: "awin_api" },
];

export const AWIN_CONSERVATIVE_TERMS = {
  key: "awin_wybot_us_feed",
  text:
    "WYBOT product media supplied through the Awin US programme (publisher 3012175, advertiser 76816 WYBOTICS INC) once the advertiser approves the application. Pending retrieval of the programme's written terms, the most restrictive reading applies: images are served from the provider's host, no local copy is stored, only proportional resizing is performed, and no crop, overlay or alteration is made.",
  allowedMarkets: ["us"],
  allowedPlacements: ["product_page", "category_page", "listing_card", "comparison"] as Placement[],
  remoteServingRequired: true,
  localStoragePermitted: false,
  attributionRequired: null as string | null,
  expiryRule: "re-check the relationship and the programme terms quarterly, and on any feed change",
  credentialSecretRef: AWIN_TOKEN_SECRET_REF,
  evidence: `Awin publisher ${AWIN_PUBLISHER_ID} (${AWIN_ACCOUNT_NAME}); advertiser ${AWIN_WYBOT_US_ADVERTISER_ID}; application confirmed pending by the API on 2026-07-31.`,
};

/* ------------------------------------------------------------------ */
/* Exact-model matching                                                */
/* ------------------------------------------------------------------ */

/**
 * WYBOT sells C1, C1 Pro and C1 Max and publishes no model number on the
 * official page, so a feed row can only be matched on its title. Same rule as
 * the Aiper matcher: any variant token rejects the row outright, even when every
 * required token matched, and an unmatched row is dropped rather than assigned
 * to the nearest model.
 */
export interface AwinModelMatcher {
  productId: string;
  exactModel: string;
  require: string[];
  deny: string[];
}

export const WYBOT_MATCHERS: AwinModelMatcher[] = [
  {
    productId: "prod-wybot-c1",
    exactModel: "WYBOT C1 Cordless Robotic Pool Cleaner",
    require: ["c1"],
    deny: ["pro", "max", "plus", "ultra", "promax", "s1", "s2", "f1", "e1", "m1", "c2", "mini"],
  },
];

export function tokeniseAwin(title: string): string[] {
  return title
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter(Boolean);
}

export type AwinMatchConfidence = "exact_title" | "all_tokens" | "rejected";

export interface AwinMatchResult {
  productId: string | null;
  exactModel: string | null;
  confidence: AwinMatchConfidence;
  reason: string;
}

export function matchWybotModel(title: string, matchers = WYBOT_MATCHERS): AwinMatchResult {
  const tokens = tokeniseAwin(title);
  const set = new Set(tokens);

  for (const m of matchers) {
    const missing = m.require.filter((r) => !set.has(r));
    if (missing.length > 0) continue;

    const denied = m.deny.filter((d) => set.has(d));
    if (denied.length > 0) {
      return {
        productId: null,
        exactModel: null,
        confidence: "rejected",
        reason: `"${title}" matches ${m.exactModel} on ${m.require.join(" + ")} but carries the variant token(s) ${denied.join(", ")}, so it is a sibling model and is rejected`,
      };
    }

    // A WYBOT feed row must actually be a WYBOT row: "C1" alone is too generic
    // a token to accept from a mixed catalogue.
    if (!set.has("wybot") && !set.has("wybotics")) {
      return {
        productId: null,
        exactModel: null,
        confidence: "rejected",
        reason: `"${title}" carries the C1 token but names no WYBOT brand, so it is not accepted as this model`,
      };
    }

    return {
      productId: m.productId,
      exactModel: m.exactModel,
      confidence: set.has("cordless") && set.has("robotic") ? "exact_title" : "all_tokens",
      reason: `"${title}" names WYBOT, carries every required token (${m.require.join(", ")}) and no variant token`,
    };
  }

  return {
    productId: null,
    exactModel: null,
    confidence: "rejected",
    reason: `"${title}" matches no launch model's required tokens; it is not assigned to the nearest model`,
  };
}

/* ------------------------------------------------------------------ */
/* Ingestion state                                                     */
/* ------------------------------------------------------------------ */

export interface AwinImageRecord {
  awinReference: string;
  productId: string;
  exactModel: string;
  role: "primary" | "alternate" | "thumbnail" | "lifestyle" | "detail";
  url: string;
  width: number | null;
  height: number | null;
  feedId: string | null;
  lastUpdated: string | null;
  matchConfidence: AwinMatchConfidence;
}

/** Empty until the advertiser approves and the datafeed key exists. */
export const AWIN_IMAGES: AwinImageRecord[] = [];

export const AWIN_INGESTION_BLOCKER = {
  blocked: true,
  status: "awaiting_advertiser_approval" as const,
  reason:
    "The US WYBOT programme (WYBOTICS INC, advertiser 76816) exists and BotPlanet has applied. The Awin API confirms the application: relationship=pending returns the programme, relationship=rejected returns nothing. Programme terms and the product feed stay gated — programmedetails returns HTTP 401 'No relationship exists between publisherId 3012175 and advertiserId 76816' — so there is nothing lawful to ingest yet.",
  unblockAction:
    "Wait for WYBOTICS INC to approve the application. On approval, re-run the relationship check, retrieve the US programme terms, and generate the Awin datafeed key (Toolbox → Create-a-Feed) so the product feed can be read. Ingestion then exact-matches WYBOT C1 and flows through the existing media registry with no further code changes.",
  owner: "manufacturer" as const,
  /** The second credential, needed in addition to approval. */
  alsoRequires: `${AWIN_DATAFEED_SECRET_REF} — the OAuth token is rejected by productdata.awin.com (verified 2026-07-31)`,
};
