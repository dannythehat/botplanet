/**
 * The Amazon provider boundary.
 *
 * WHY THIS EXISTS: BotPlanet has read Amazon four different ways in one week —
 * an HTTP status code, a page fetch, a human with a browser, and now an
 * aggregator relay. Three of those were wrong or partial, and each one leaked
 * its own shape into the offer records. This interface is where that stops.
 *
 * Everything downstream — the offer engine, the publication gates, the product
 * page — consumes `AmazonListing` and does not know or care who produced it.
 * When the Amazon Creators API becomes available it implements this same
 * interface and slots in beside SerpApi with no offer-engine rebuild, which is
 * the whole point of putting the seam here rather than inside `buildOffers`.
 *
 * NORMALISATION HAPPENS AT THIS BOUNDARY, NOT LATER. A provider returns
 * verbatim retailer wording in the `*Wording` fields and nothing else — no
 * provider is allowed to decide what "In Stock" means. That interpretation is
 * the offer engine's job and stays in one place, so two providers can never
 * disagree about it.
 */

/** Which implementation spoke, recorded on every result for audit. */
export type AmazonProviderId = "serpapi" | "creators_api" | "manual_check";

/**
 * Authority order. Lower wins when two providers describe the same ASIN.
 *
 * The Creators API is Amazon itself. SerpApi is Amazon's page relayed
 * faithfully. A manual check is accurate at the instant a person read it and
 * then ages for up to a month. Freshness and authority point the same way here,
 * which is why the order is uncontroversial.
 */
export const PROVIDER_AUTHORITY: Record<AmazonProviderId, number> = {
  creators_api: 1,
  serpapi: 2,
  manual_check: 3,
};

/** One buying option on a listing — new, used, renewed, each with its own seller. */
export interface BuyingOption {
  condition: "new" | "used" | "renewed" | "unknown";
  priceMinor: number | null;
  currency: string;
  /** Verbatim, e.g. "In Stock" or "Only 1 left in stock - order soon." */
  stockWording: string | null;
  /** Verbatim, e.g. "FREE delivery Thursday, August 6". */
  deliveryWording: string | null;
  /** Verbatim seller line. Null when the source did not expose one. */
  sellerWording: string | null;
  returnsWording: string | null;
}

/**
 * Manufacturer-style attributes that a SELLER typed into Amazon's spec table.
 *
 * Deliberately kept in their own field rather than mixed into the listing's
 * facts. These are not manufacturer evidence and must never be treated as
 * such — see marketplace-attributes.ts for the rule and the reasoning.
 */
export interface MarketplaceAttributes {
  brandName: string | null;
  modelName: string | null;
  modelNumber: string | null;
  manufacturerPartNumber: string | null;
  manufacturer: string | null;
  upc: string | null;
  /** Everything else the table carried, verbatim, keyed as the source keyed it. */
  other: Record<string, string>;
}

export interface AmazonListing {
  asin: string;
  /** The listing title, verbatim. */
  title: string | null;
  /** Buying options, in the order the source presented them. */
  buyingOptions: BuyingOption[];
  /** Seller-entered specification table. NOT evidence. */
  attributes: MarketplaceAttributes;
  /** Image URLs the provider exposed. Subject to the Job 9 rights rules. */
  imageUrls: string[];
  videoCount: number;
  providerId: AmazonProviderId;
  /** When this snapshot was taken. Drives freshness downstream. */
  retrievedOn: string;
  /** True when the source said the ASIN does not exist. */
  notFound: boolean;
}

/** A candidate returned by a search, used for discovery and successor detection. */
export interface AmazonSearchHit {
  asin: string;
  title: string;
  brand: string | null;
  priceMinor: number | null;
  deliveryWording: string | null;
  position: number;
}

/**
 * Why a provider call did not happen or did not help.
 *
 * A skipped call is recorded rather than swallowed. "We did not check" and "we
 * checked and found nothing" are different facts, and a run that silently did
 * nothing because the month's credits were gone is the worst of both.
 */
export type ProviderSkipReason =
  | "credit_ceiling_reached"
  | "not_due_yet"
  | "no_credentials"
  | "provider_error";

export interface ProviderResult<T> {
  ok: boolean;
  data: T | null;
  skipped: ProviderSkipReason | null;
  detail: string;
  /** Credits this call consumed, for the ceiling accounting. */
  creditsUsed: number;
}

export interface AmazonProvider {
  readonly id: AmazonProviderId;
  /** Look up one ASIN. */
  getListing(asin: string): Promise<ProviderResult<AmazonListing>>;
  /** Find candidates for a product we hold no ASIN for. */
  search(query: string): Promise<ProviderResult<AmazonSearchHit[]>>;
  /** Remaining allowance, where the provider exposes it. */
  remainingCredits(): Promise<number | null>;
}
