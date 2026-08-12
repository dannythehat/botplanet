/**
 * CJ (Commission Junction) — Aiper media ingestion.
 *
 * BotPlanet was accepted into the Aiper programme through CJ, so Aiper media is
 * no longer "awaiting supplier permission". The CJ relationship, advertiser
 * terms, Product Catalog and approved creatives are the operational source of
 * truth for the three Aiper models.
 *
 * WHAT THIS FILE HOLDS: the programme identity, the terms, and — the
 * important part — the exact-model matchers. Aiper publishes no SKUs, so the
 * only thing standing between a correct catalogue match and a Scuba X1 Pro
 * image landing on the Scuba X1 page is the matcher below. It is written to
 * reject rather than to guess.
 *
 * WHAT IT DOES NOT HOLD: credentials, tokens, or any API response. The client
 * reads the token from the Worker secret at request time and never persists it.
 */
import type { Placement } from "./types";

/* ------------------------------------------------------------------ */
/* Programme identity                                                  */
/* ------------------------------------------------------------------ */

/** Company ID — the only ID the Product Catalog endpoints accept. */
export const CJ_PUBLISHER_ID = "8029924";
/**
 * Website/property ID — the only ID link-search accepts, and the one embedded in
 * every tracked creative URL. The two are NOT interchangeable: passing the
 * website ID to shoppingProductFeeds returns "You are not authorized to query
 * product feed", which reads like a permissions failure and is really a wrong
 * identifier. Verified 2026-07-31.
 */
export const CJ_WEBSITE_ID = "101845913";
export const CJ_AIPER_ADVERTISER_ID = "6404897";

/** The Worker secret the client reads. The value never enters this repository. */
export const CJ_TOKEN_SECRET_REF = "CJ_API_TOKEN";

export const CJ_ENDPOINTS = {
  /** GraphQL: advertiser lookup, Product Catalog, shopping products. */
  ads: "https://ads.api.cj.com/query",
  /** GraphQL: commission and performance data. Not used for media. */
  commissions: "https://commissions.api.cj.com/query",
  /** REST: link and creative search. */
  linkSearch: "https://link-search.api.cj.com/v2/link-search",
} as const;

/**
 * How the relationship stands, and how we know.
 *
 * `ownerConfirmed` records that Danny has the acceptance in writing. `apiVerified`
 * stays false until a live CJ response confirms it, because an owner's report
 * and a machine-readable relationship record are different kinds of evidence and
 * the difference matters when a feed silently stops working.
 */
export interface CjRelationship {
  advertiserId: string;
  advertiserName: string;
  publisherId: string;
  status: "joined" | "pending" | "declined" | "unknown";
  ownerConfirmed: boolean;
  ownerConfirmedDate: string | null;
  apiVerified: boolean;
  apiVerifiedDate: string | null;
  /** What the API said last time it was asked, verbatim. */
  lastApiResponse: string | null;
  notes: string;
}

export const AIPER_RELATIONSHIP: CjRelationship = {
  advertiserId: CJ_AIPER_ADVERTISER_ID,
  advertiserName: "Aiper",
  publisherId: CJ_PUBLISHER_ID,
  status: "joined",
  ownerConfirmed: true,
  ownerConfirmedDate: "2026-07-31",
  apiVerified: true,
  apiVerifiedDate: "2026-07-31",
  lastApiResponse:
    "2026-07-31 — GET link-search.api.cj.com/v2/link-search?website-id=101845913&advertiser-ids=6404897 returned HTTP 200 with total-matched=12 and advertiser-name=Aiper; shoppingProductFeeds(companyId 8029924, partnerIds 6404897) returned one feed. The relationship is live and readable.",
  notes:
    "Acceptance confirmed by the owner AND verified against the live API, and now evidenced by the official welcome email (advertiser: Aiper Intelligent, LLC; programme contact Fapoo@Aiper.com). The advertiser is Aiper (6404897) via CJ; Awin (publisher 3012175) is the WYBOT EU/UK relationship and is unrelated to Aiper.",
};

/**
 * The programme terms as the ADVERTISER wrote them — the official Aiper CJ
 * welcome email, supplied by the owner on 2026-07-31. This is the contractual
 * layer, and it OVERRIDES anything the API merely makes possible.
 *
 * The lesson this record exists to keep: on the same day, a live deep-link
 * test through the CJ click network worked perfectly — and the welcome email
 * still says "You are not allowed to direct link." Technical capability and
 * programme permission are different facts from different authorities, and
 * the contract wins. Nothing may publish a product-level Aiper deep link
 * until Aiper states in writing which reading of that sentence applies.
 */
export const AIPER_PROGRAMME_TERMS = {
  evidence: "Official Aiper CJ welcome email, owner-supplied 2026-07-31",
  advertiserLegalName: "Aiper Intelligent, LLC",
  programmeContact: "Fapoo@Aiper.com",
  baseCommissionPercent: 8,
  promotionalCommissionMaxPercent: 15,
  cookieDays: 45,
  relationship: "approved and active",
  prohibited: [
    "direct linking (verbatim: \"You are not allowed to direct link\" — scope unclarified, see directLinkPolicy)",
    "bidding on Aiper brand keywords in paid search",
    "using aiper.com as the ad display URL",
    "trademark variations and misspellings",
    "popups and click-unders",
    "adult traffic",
    "incentivised traffic",
    "wholesale or dropshipping-style promotion",
    "fraud or misleading promotion",
  ],
  directLinkPolicy: {
    status: "restricted_unclarified" as const,
    verbatim: "You are not allowed to direct link.",
    openQuestion:
      "Does the prohibition cover only paid-ad traffic sent straight to Aiper (the common network meaning), or does it also bar product-level deep links from publisher pages?",
    untilClarified: [
      "no CJ deep link to an individual Aiper product page may be published anywhere on BotPlanet",
      "no Aiper product URL in paid advertising; no aiper.com display URL; no brand-keyword bidding",
      "public CTAs for Aiper products may use only an approved storewide creative (e.g. link 17218623 / evergreen 15736575) or another route whose terms are verified",
      "no numeric price may be shown unless it belongs to the same retailer and destination as the CTA",
    ],
    clarificationOwner: "owner emails Fapoo@Aiper.com; ChatGPT records the ruling",
  },
} as const;

/**
 * The Aiper product feed, as the API actually reports it.
 *
 * The feed EXISTS and we are authorised to read it. It contains ZERO products.
 * That distinction matters: this is not an access problem we can fix, it is
 * Aiper not having populated their CJ catalogue, and no amount of retrying or
 * re-scoping the query will change it.
 */
export const AIPER_FEED = {
  adId: "17133094",
  feedName: "aiper products feed",
  sourceFeedType: "GOOGLE",
  advertiserCountry: "CN",
  currency: "USD",
  language: "en",
  productCount: 0,
  lastUpdated: null as string | null,
  checkedOn: "2026-07-31",
  note:
    "shoppingProducts and products both returned totalCount 0 for advertiser 6404897. The catalogue is empty, so there is no product imagery to match against.",
};

/**
 * Every approved creative CJ holds for Aiper, as at 2026-07-31.
 *
 * Twelve creatives, and not one of them is product media: nine seasonal
 * promotional banners (Black Friday 2025, Mother's Day), two text links and one
 * evergreen link. The eleven image URLs inside them are campaign artwork and
 * tracking pixels served from CJ's own hosts. None depicts a Scuba X1, a Scuba
 * S1 or a Seagull SE, so none is eligible to appear on a product surface.
 */
export const AIPER_CREATIVES = {
  totalMatched: 12,
  byType: { Banner: 9, "Text Link": 2, EvergreenLink: 1 } as Record<string, number>,
  videoCreatives: 0,
  productImages: 0,
  campaignBanners: 9,
  imageUrlsFound: 11,
  exactModelMatches: 0,
  siblingRejections: 0,
  checkedOn: "2026-07-31",
  note:
    "Creative names are campaign names — 2025 Black Friday US, Mother's Day Sale, Aiper US, Aiper Experts Duo — not model names, so exact-model matching returns nothing. A seasonal banner on a product card would be wrong on every axis: wrong subject, expired campaign, and it depicts no specific model.",
};

/* ------------------------------------------------------------------ */
/* Rights basis                                                        */
/* ------------------------------------------------------------------ */

/**
 * Every term below is marked with how it was established. A term the API has not
 * yet returned is "not confirmed through API" and the system behaves as though
 * the restriction applies — the conservative direction. Nothing here is inferred
 * from what other affiliate programmes usually allow.
 */
export type TermSource = "cj_api" | "owner_confirmed" | "not_confirmed_through_api";

export interface CjTerm {
  term: string;
  value: string;
  source: TermSource;
}

export const AIPER_CJ_TERMS: CjTerm[] = [
  { term: "commission", value: "8% base, promotional up to 15% (welcome email)", source: "owner_confirmed" },
  { term: "cookie duration", value: "45 days (welcome email)", source: "owner_confirmed" },
  {
    term: "direct linking",
    value: "PROHIBITED per welcome email; scope unclarified — product-level deep links blocked until Aiper clarifies",
    source: "owner_confirmed",
  },
  { term: "catalogue data use", value: "not confirmed through API", source: "not_confirmed_through_api" },
  { term: "image URL use", value: "not confirmed through API", source: "not_confirmed_through_api" },
  { term: "remote hosting required", value: "assumed required until confirmed", source: "not_confirmed_through_api" },
  { term: "local caching", value: "assumed prohibited until confirmed", source: "not_confirmed_through_api" },
  { term: "resizing", value: "assumed proportional only until confirmed", source: "not_confirmed_through_api" },
  { term: "cropping", value: "assumed prohibited until confirmed", source: "not_confirmed_through_api" },
  { term: "overlays", value: "assumed prohibited until confirmed", source: "not_confirmed_through_api" },
  { term: "editorial use", value: "not confirmed through API", source: "not_confirmed_through_api" },
  { term: "comparison use", value: "not confirmed through API", source: "not_confirmed_through_api" },
  { term: "email use", value: "not confirmed through API", source: "not_confirmed_through_api" },
  { term: "social use", value: "not confirmed through API", source: "not_confirmed_through_api" },
  { term: "video use", value: "not confirmed through API", source: "not_confirmed_through_api" },
  { term: "attribution", value: "not confirmed through API", source: "not_confirmed_through_api" },
  { term: "territory", value: "not confirmed through API", source: "not_confirmed_through_api" },
  { term: "refresh and withdrawal", value: "not confirmed through API", source: "not_confirmed_through_api" },
  { term: "alteration of product imagery", value: "assumed prohibited until confirmed", source: "not_confirmed_through_api" },
];

/**
 * The terms an ingested CJ asset carries until the API returns the real
 * terms. It is deliberately the most restrictive reading: remote-served, no
 * local copy, proportional resize only. When `fetchProgrammeTerms()` returns
 * something more permissive, this record is replaced by what CJ actually says —
 * never widened by assumption.
 */
export const CJ_CONSERVATIVE_TERMS = {
  key: "cj_aiper_product_catalog",
  text:
    "Aiper product media supplied through the CJ Product Catalog and approved creatives under BotPlanet's joined publisher relationship (publisher 8029924, advertiser 6404897). Pending retrieval of the advertiser's written terms through the CJ API, the most restrictive reading applies: images are served from the provider's host, no local copy is stored, only proportional resizing is performed, and no crop, overlay or alteration is made.",
  allowedMarkets: ["us"],
  allowedPlacements: ["product_page", "category_page", "listing_card", "comparison"] as Placement[],
  remoteServingRequired: true,
  localStoragePermitted: false,
  attributionRequired: null as string | null,
  expiryRule: "re-check the advertiser terms and the relationship quarterly, and on any feed change",
  credentialSecretRef: CJ_TOKEN_SECRET_REF,
  evidence: `CJ publisher ${CJ_PUBLISHER_ID}; Aiper advertiser ${CJ_AIPER_ADVERTISER_ID}; acceptance confirmed by the owner 2026-07-31.`,
};

/* ------------------------------------------------------------------ */
/* Exact-model matching                                                */
/* ------------------------------------------------------------------ */

/**
 * Aiper publishes no model numbers, so a catalogue row can only be matched on
 * its title. That makes the matcher the single point where a sibling model can
 * contaminate a product page, and it is built to fail closed:
 *
 *  - every `require` token must be present;
 *  - ANY `deny` token rejects the row outright, even if every required token
 *    matched — "Scuba X1 Pro" contains "scuba" and "x1" and is still not the X1;
 *  - a row that matches nothing is dropped, never assigned to the nearest model.
 */
export interface ModelMatcher {
  productId: string;
  /** Verbatim from the Job 8 verification record. */
  exactModel: string;
  require: string[];
  deny: string[];
}

export const AIPER_MATCHERS: ModelMatcher[] = [
  {
    productId: "prod-aiper-scuba-x1",
    exactModel: "Aiper Scuba X1",
    require: ["scuba", "x1"],
    deny: ["pro", "max", "plus", "ultra", "s1", "n1", "se", "elite", "s2", "x2"],
  },
  {
    productId: "prod-aiper-scuba-s1",
    exactModel: "Aiper Scuba S1 Cordless Robotic Pool Cleaner",
    require: ["scuba", "s1"],
    deny: ["pro", "max", "plus", "ultra", "x1", "n1", "se", "elite", "s2", "x2"],
  },
  {
    productId: "prod-aiper-seagull-se",
    exactModel: "Aiper Seagull SE",
    require: ["seagull", "se"],
    deny: ["pro", "max", "plus", "ultra", "elite", "800b", "1000", "1500", "3000", "s1", "x1"],
  },
];

/** Lowercases and splits on anything that is not a letter or digit. */
export function tokenise(title: string): string[] {
  return title
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter(Boolean);
}

export type MatchConfidence = "exact_title" | "all_tokens" | "rejected";

export interface MatchResult {
  productId: string | null;
  exactModel: string | null;
  confidence: MatchConfidence;
  /** Why the row was accepted or rejected, in one sentence. */
  reason: string;
}

/**
 * Matches one catalogue title to at most one launch product.
 *
 * Returns a rejection rather than a best guess. A catalogue that contains
 * "Aiper Scuba X1 Pro" and no plain X1 yields zero matches, which is the correct
 * outcome — a Pro image on the X1 page would be a factual error about a product
 * a reader is deciding whether to buy.
 */
export function matchAiperModel(title: string, matchers = AIPER_MATCHERS): MatchResult {
  const tokens = tokenise(title);
  const set = new Set(tokens);

  for (const m of matchers) {
    const denied = m.deny.filter((d) => set.has(d));
    const missing = m.require.filter((r) => !set.has(r));
    if (missing.length > 0) continue;

    if (denied.length > 0) {
      return {
        productId: null,
        exactModel: null,
        confidence: "rejected",
        reason: `"${title}" matches ${m.exactModel} on ${m.require.join(" + ")} but carries the variant token(s) ${denied.join(", ")}, so it is a sibling model and is rejected`,
      };
    }

    const exact = tokenise(m.exactModel).every((t) => set.has(t)) && tokens.length <= tokenise(m.exactModel).length + 4;
    return {
      productId: m.productId,
      exactModel: m.exactModel,
      confidence: exact ? "exact_title" : "all_tokens",
      reason: `"${title}" carries every required token (${m.require.join(", ")}) and no variant token`,
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
/* Ingestion record shapes                                             */
/* ------------------------------------------------------------------ */

/** One image row returned by the CJ Product Catalog, after matching. */
export interface CjImageRecord {
  cjReference: string;
  productId: string;
  exactModel: string;
  role: "primary" | "alternate" | "thumbnail" | "lifestyle" | "detail" | "accessory" | "app_screenshot" | "creative" | "banner";
  url: string;
  width: number | null;
  height: number | null;
  fileType: string | null;
  feedId: string | null;
  lastUpdated: string | null;
  matchConfidence: MatchConfidence;
}

/** One video creative returned by CJ, after matching. */
export interface CjVideoRecord {
  creativeId: string;
  productId: string;
  exactModel: string;
  title: string;
  format: string;
  source: string;
  durationSeconds: number | null;
  embedMethod: "hosted_file" | "iframe_embed" | "third_party_player" | "html_creative";
  permittedPlacements: Placement[];
  autoplayPermitted: boolean | null;
  controlsRequired: boolean | null;
  matchConfidence: MatchConfidence;
  /** Catalogued but not rendered until a review surface exists to hold it. */
  integrationStatus: "catalogued_not_rendered" | "rendered";
}

/**
 * Nothing has been retrieved. These stay empty until `CJ_API_TOKEN` exists and
 * the ingestion runs; they are exported so every consumer and test is already
 * wired to the real shape rather than to a placeholder that would need
 * rewriting later.
 */
export const CJ_IMAGES: CjImageRecord[] = [];
export const CJ_VIDEOS: CjVideoRecord[] = [];

/** Why the catalogue has not been read, recorded as data rather than prose. */
export const CJ_INGESTION_BLOCKER = {
  blocked: true,
  reason:
    "The CJ relationship is live and fully readable — the token works, the advertiser resolves, the feed is authorised and twelve creatives are returned. The blocker is upstream: Aiper's CJ Product Catalog contains zero products, and all twelve approved creatives are seasonal campaign banners and text links rather than product media. There is nothing to ingest, and no query change would produce any.",
  unblockAction:
    "Ask Aiper (through the CJ advertiser contact) to populate their product feed, or to supply a media kit direct. Fallback tier 4 — direct Aiper media contact — is now the live route, and it is a supplier request rather than anything BotPlanet can resolve in code.",
  owner: "manufacturer" as const,
};
