/**
 * Commercial truth — types and vocabularies.
 *
 * The separation this file exists to enforce: a ROBOT is not a RETAILER is not
 * an OFFER is not a PROGRAMME is not a LINK. The permanent facts about a product
 * live in the Job 8 evidence model and never change when a price does. An offer
 * is a statement about one seller at one moment, and it decays.
 *
 * Everything here is designed to fail closed. A price nobody checked is not a
 * price; a Buy button is not proof of stock; a search-results page is not an
 * offer. Where the honest answer is "we do not know", the type system makes
 * that answer available and the validator makes it mandatory.
 *
 * No commission value, payout rate or private programme term is declared in
 * this file. Those live in D1's private columns and never reach a client.
 */

/* ------------------------------------------------------------------ */
/* Retailers                                                           */
/* ------------------------------------------------------------------ */

export type RetailerType = "marketplace" | "specialist_retailer" | "mass_retailer" | "manufacturer_direct";

/** Who actually ships and invoices. Changes the returns and warranty route. */
export type SellerModel = "retailer_owned_inventory" | "marketplace_third_party" | "mixed" | "manufacturer_direct" | "unknown";

/**
 * Whether BotPlanet may send a customer to this retailer at all.
 *
 * `approved` requires a live commercial relationship. A retailer we merely know
 * exists is `researched_only` and may not carry a public offer — that is the
 * distinction that stops a researched price becoming an implied endorsement.
 */
export type RetailerApproval = "approved" | "pending" | "researched_only" | "paused" | "declined";

export interface Retailer {
  id: string;
  displayName: string;
  legalName: string | null;
  website: string;
  type: RetailerType;
  marketsServed: string[];
  sellerModel: SellerModel;
  supportUrl: string | null;
  returnsUrl: string | null;
  /** How a warranty claim is actually routed for this seller. */
  warrantyRoute: string;
  approval: RetailerApproval;
  /** Networks through which this retailer can be linked, if any. */
  affiliateNetworks: string[];
  lastReviewedDate: string;
  pausedReason: string | null;
  notes: string;
}

/* ------------------------------------------------------------------ */
/* Affiliate programmes                                                */
/* ------------------------------------------------------------------ */

export type ProgrammeState = "active" | "pending" | "paused" | "declined" | "territory_restricted";

export interface AffiliateProgramme {
  id: string;
  network: string;
  advertiserId: string | null;
  /** Our relationship, verified where possible. */
  state: ProgrammeState;
  market: string;
  /** True when this programme may be used for US customers. */
  usableForUsMarket: boolean;
  cookieDays: number | null;
  deepLinkSupport: boolean;
  productFeedSupport: boolean;
  /** What the programme permits for images and data. */
  imageDataPermission: string;
  /** Programmes that forbid affiliate links in email. */
  emailLinksAllowed: boolean;
  termsSource: string;
  termsVerifiedDate: string | null;
  /** Worker secret NAME only. Never a value. */
  secretRef: string | null;
  /** Why the programme is not usable, when it is not. */
  restriction: string | null;
}

/* ------------------------------------------------------------------ */
/* Exact-product destinations                                          */
/* ------------------------------------------------------------------ */

/**
 * How confident we are that a destination is THE product, not a sibling.
 *
 * `verified_exact` requires a live check of the destination. Nothing reaches it
 * on researched evidence alone, because "the URL was in our notes" and "the URL
 * currently resolves to this model" are different claims.
 */
export type MatchConfidence =
  /** Identifier captured AND the destination re-checked live. */
  | "verified_exact"
  /** Identifier captured from a source we recorded but have not re-checked. */
  | "researched_exact"
  /** Only a search or category destination exists. NOT an offer. */
  | "search_only"
  /** No usable destination at all. */
  | "none";

export interface ProductDestination {
  productId: string;
  retailerId: string;
  market: string;
  /** ASIN, SKU, MPN or feed product ID — whatever the retailer uses. */
  retailerProductId: string | null;
  identifierKind: "asin" | "sku" | "mpn" | "feed_product_id" | null;
  /** The exact model this destination must be, from the Job 8 record. */
  exactModel: string;
  /** Public destination before affiliate tagging. */
  destinationUrl: string | null;
  confidence: MatchConfidence;
  /** Where the identifier came from, and when. */
  sourceReference: string;
  sourceCheckedDate: string | null;
  /** Seller identity, when the source exposes it. */
  sellerIdentity: string | null;
  sellerModel: SellerModel;
  notes: string;
}

/** A candidate that was considered and refused, with the reason. */
export interface RejectedCandidate {
  productId: string;
  retailerId: string;
  candidate: string;
  reason: string;
  rule:
    | "sibling_model"
    | "different_generation"
    | "accessory_or_part"
    | "bundle_obscures_base"
    | "refurbished_or_used"
    | "unclear_seller"
    | "brand_name_only"
    | "wrong_region"
    | "search_not_offer";
}

/* ------------------------------------------------------------------ */
/* Offer state                                                         */
/* ------------------------------------------------------------------ */

/** How fresh the commercial data is. Windows differ by source type. */
export type FreshnessState =
  | "live"
  | "recently_checked"
  | "indicative"
  | "stale"
  | "unavailable"
  | "unknown"
  | "suppressed"
  | "pending_verification";

/** Freshness states from which a price may be shown as a current price. */
export const CURRENT_PRICE_STATES: FreshnessState[] = ["live", "recently_checked"];

export type StockState =
  | "in_stock"
  | "low_stock"
  | "preorder"
  | "backorder"
  | "temporarily_unavailable"
  | "unavailable"
  | "seller_specific"
  | "unknown";

export type ShippingState =
  | "charged"
  | "free"
  | "calculated_at_checkout"
  | "postcode_dependent"
  | "membership_dependent"
  | "estimated_range"
  | "unknown"
  | "not_exposed_by_source";

/** How the commercial data was obtained. Drives the freshness window. */
export type OfferSource =
  /** Approved programme API, machine-read. */
  | "programme_api"
  /** Approved product feed. */
  | "product_feed"
  /** A human read the retailer page on a recorded date. */
  | "manual_check"
  /** Researched during an earlier pass; never re-checked. */
  | "researched_snapshot"
  /** No source at all. */
  | "none";

/** Days after which each source type stops being treated as current. */
export const FRESHNESS_WINDOW_DAYS: Record<OfferSource, number> = {
  // A feed or API refreshes itself, so it may claim currency for longer.
  programme_api: 2,
  product_feed: 7,
  // A human check ages faster because nothing revisits it automatically.
  manual_check: 3,
  // A researched snapshot was never a current price and never becomes one.
  researched_snapshot: 0,
  none: 0,
};

export interface Shipping {
  state: ShippingState;
  /** Verbatim wording from the source. */
  sourceWording: string | null;
  costMinor: number | null;
  estimatedMinDays: number | null;
  estimatedMaxDays: number | null;
  /** True when the estimate depends on the customer's location. */
  locationSpecific: boolean;
  market: string;
  checkedDate: string | null;
  confidence: "high" | "medium" | "low" | "none";
}

export interface Stock {
  state: StockState;
  /** Verbatim wording, kept apart from the normalised state. */
  sourceWording: string | null;
  checkedDate: string | null;
}

/**
 * Warranty routes, deliberately three separate fields.
 *
 * The manufacturer term comes from Job 8 and is never overwritten by a
 * retailer's wording. A retailer protection plan is a product the retailer
 * sells, not a manufacturer warranty, and must be labelled as such.
 */
export interface WarrantyRoutes {
  /** From the Job 8 evidence ledger. May be the unconfirmed wording. */
  manufacturer: string;
  manufacturerConfirmed: boolean;
  retailerProtectionPlan: string | null;
  retailerReturnPeriod: string | null;
  marketplaceSellerReturnRoute: string | null;
}

export interface Offer {
  id: string;
  productId: string;
  retailerId: string;
  programmeId: string | null;
  market: string;
  currency: string;
  destination: ProductDestination;
  /** Minor units. Null when no price is known — never a guess. */
  basePriceMinor: number | null;
  shipping: Shipping;
  /** base + shipping, only when both are known. */
  deliveredPriceMinor: number | null;
  stock: Stock;
  warranty: WarrantyRoutes;
  source: OfferSource;
  sourceReference: string;
  sourceCheckedDate: string | null;
  freshness: FreshnessState;
  confidence: "high" | "medium" | "low" | "none";
  /** The /go path. Null when the offer may not be linked. */
  redirectKey: string | null;
  active: boolean;
  suppressionReason: string | null;
}

/* ------------------------------------------------------------------ */
/* Publication gates                                                   */
/* ------------------------------------------------------------------ */

/**
 * What a public surface may say about an offer. Separate booleans, because
 * "you may link to this" and "you may print this price" are different rights.
 */
export interface OfferPublication {
  /** The offer may appear at all. */
  showable: boolean;
  /** A Buy button may be rendered and the /go link followed. */
  linkable: boolean;
  /** The price may be printed as a current price. */
  priceShowable: boolean;
  /** A stock state may be stated. */
  stockShowable: boolean;
  /** A delivery statement may be made. */
  shippingShowable: boolean;
  /** The offer may enter Product/Offer structured data. */
  schemaEligible: boolean;
  /** One line per gate that failed. */
  blockers: string[];
}
