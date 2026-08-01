/**
 * Media rights model — types and vocabularies.
 *
 * The principle this encodes: an image is not a file, it is a PERMISSION with a
 * file attached. Every asset therefore carries the basis on which we may show
 * it, where we may show it, whether we may store it, and how it disappears when
 * the permission ends. A URL with no recorded basis is not an asset; it is a
 * liability, and the validator rejects it.
 *
 * Nothing here stores credentials, signed URLs or API keys. Those live in
 * Worker secrets and are referenced by name only, so a rights record can never
 * leak an access token into the repository or into public HTML.
 */

/** Where an image came from, in the source hierarchy's order of preference. */
export type SourceTier =
  | "manufacturer_media_library" // 1. approved press kit / media library
  | "manufacturer_page_permitted" // 2. manufacturer page via an explicitly permitted method
  | "affiliate_api" // 3. approved affiliate API supplying image content
  | "affiliate_media_feed" // 4. approved retailer/affiliate media feed
  /**
   * 4.5 — manufacturer-authored marketing imagery supplied BY THE OWNER from
   * the exact model's listing, registered under a recorded owner ruling.
   * Ranked between the licensed feeds above and our own artwork below: the
   * imagery is the manufacturer's, but no manufacturer permission is evidenced,
   * so it never inherits a licensed tier and stays one flip from withdrawal.
   */
  | "owner_supplied_manufacturer_marketing"
  | "original_botplanet" // 5. artwork we made
  | "branded_placeholder"; // 6. honest branded placeholder

/** Preference ranking. Lower number is the better source. */
export const SOURCE_TIER_RANK: Record<SourceTier, number> = {
  manufacturer_media_library: 1,
  manufacturer_page_permitted: 2,
  affiliate_api: 3,
  affiliate_media_feed: 4,
  owner_supplied_manufacturer_marketing: 4.5,
  original_botplanet: 5,
  branded_placeholder: 6,
};

/** How the file was actually obtained. Scraping is not in this list by design. */
export type AcquisitionMethod =
  | "press_kit_download"
  | "affiliate_api_response"
  | "affiliate_feed_record"
  | "authored_in_house"
  | "generated_from_house_template"
  /** Supplied by the owner as files, from the exact model's own listing. */
  | "owner_supplied_capture"
  /** Recorded when nothing has been obtained yet, so the gap is explicit. */
  | "not_yet_acquired";

/** What a media asset is FOR. Not every product needs every type. */
export type AssetType =
  | "product_hero"
  | "product_alternate_view"
  | "product_detail"
  | "product_in_use"
  | "included_accessories"
  | "filtration_detail"
  | "charging_equipment"
  | "app_screenshot"
  | "comparison_thumbnail"
  | "listing_thumbnail"
  | "open_graph"
  | "category_hero"
  | "educational_diagram"
  | "branded_placeholder";

/** Asset types that depict a specific real product and must match it exactly. */
export const PRODUCT_DEPICTING_TYPES: AssetType[] = [
  "product_hero",
  "product_alternate_view",
  "product_detail",
  "product_in_use",
  "included_accessories",
  "filtration_detail",
  "charging_equipment",
  "app_screenshot",
  "comparison_thumbnail",
  "listing_thumbnail",
];

/** May the file be stored on our infrastructure, or must it stay at source? */
export type StorageMode =
  /** We may download, store, and serve it ourselves. */
  | "local_permitted"
  /** The licence requires it to be served from the provider's host. */
  | "remote_required"
  /** Nothing is stored because nothing has been acquired. */
  | "none";

/** Where an image is allowed to appear. */
export type Placement =
  | "product_page"
  | "category_page"
  | "listing_card"
  | "comparison"
  | "homepage"
  | "guide"
  | "open_graph"
  | "structured_data"
  | "email";

/** Transformations the licence allows. */
export type Transformation =
  | "proportional_resize"
  | "format_conversion"
  | "approved_crop"
  | "none_permitted";

export type WithdrawalStatus = "active" | "withdrawn" | "expired";

export type AltTextStatus = "approved" | "draft" | "decorative" | "missing" | "rejected";

/** Which structured-data or social slots an asset may legitimately fill. */
export interface SchemaEligibility {
  productImage: boolean;
  imageObject: boolean;
  articleImage: boolean;
  openGraph: boolean;
  twitter: boolean;
  /** Why anything above is false. Always written when something is false. */
  reason: string | null;
}

/** A generated size/format variant of a locally stored asset. */
export interface Derivative {
  id: string;
  /** The asset this was generated from. Must exist. */
  parentAssetId: string;
  format: "avif" | "webp" | "png" | "jpeg" | "svg";
  width: number;
  height: number;
  src: string;
  /** "hero" | "card" | "thumbnail" | "og" — which crop this serves. */
  crop: "native" | "hero" | "card" | "thumbnail" | "og";
}

/** The rights record. One per asset, no exceptions. */
export interface MediaAssetRecord {
  id: string;
  /** Stable product ID, or null when the asset serves a non-product purpose. */
  productId: string | null;
  /** Non-product purpose, when productId is null. */
  purpose: string | null;
  /**
   * The exact model this depicts, verbatim from the Job 8 verification record.
   * Required on every product-depicting asset — this is what stops a Betta SE
   * image being attached to a Betta SE Plus.
   */
  exactModel: string | null;
  type: AssetType;
  tier: SourceTier;
  sourceProvider: string;
  /** URL or API reference. Never a signed URL, never a credential. */
  sourceRef: string | null;
  /** Name of the Worker secret holding any credential. Never the secret. */
  credentialSecretRef: string | null;
  acquisitionMethod: AcquisitionMethod;
  /** The written permission we rely on. Never empty for a rendered asset. */
  rightsBasis: string;
  allowedMarkets: string[];
  allowedPlacements: Placement[];
  allowedTransformations: Transformation[];
  storage: StorageMode;
  /** True when the licence forbids us hosting the file ourselves. */
  remoteServingRequired: boolean;
  /** Attribution string the licence requires, or null. */
  attributionRequired: string | null;
  retrievedDate: string | null;
  lastCheckedDate: string | null;
  /** ISO date, or a rule such as "re-check quarterly", or null for perpetual. */
  expiryRule: string | null;
  withdrawal: WithdrawalStatus;
  withdrawalDate: string | null;
  withdrawalReason: string | null;
  /** SHA-256 of the stored bytes. Required when storage is local_permitted. */
  checksum: string | null;
  /** Intrinsic size, so width/height can always be emitted and CLS avoided. */
  width: number | null;
  height: number | null;
  /** Rendered file, when one exists. */
  src: string | null;
  altText: string;
  altTextStatus: AltTextStatus;
  schema: SchemaEligibility;
  reviewerStatus: "unreviewed" | "reviewed" | "rejected";
  /** True only for a real BotPlanet capture. Never true otherwise. */
  supportsTestedClaim: boolean;
  /** True when the asset is a placeholder and depicts no real product. */
  depictsRealProduct: boolean;
  notes?: string;
}

/**
 * Image readiness, as nine separate states rather than one vague flag.
 * A product can have a complete rights record and no hero; those are different
 * facts with different consequences for the surfaces that consume them.
 */
export interface ImageReadiness {
  /** Every asset attached to this product has a complete rights record. */
  rightsRecordComplete: boolean;
  /** Every product-depicting asset names the exact Job 8 model. */
  exactModelConfirmed: boolean;
  heroReady: boolean;
  supportingImagesReady: boolean;
  responsiveVariantsReady: boolean;
  altTextApproved: boolean;
  schemaEligible: boolean;
  /** Safe to render publicly right now. */
  publicRenderingSafe: boolean;
  /** Hero + supporting + variants + alt text + schema, all true. */
  fullProductMediaSetReady: boolean;
}

/** Why a product has no lawful imagery yet, and what would unblock it. */
export interface AcquisitionBlocker {
  productId: string;
  /** The best tier we established is actually available. */
  bestAvailableTier: SourceTier;
  /** What was checked, so "blocked" is a finding rather than an assumption. */
  checked: string[];
  blocker: string;
  /** The specific action that unblocks it, and who must take it. */
  unblockAction: string;
  owner: "danny" | "claude" | "manufacturer";
}
