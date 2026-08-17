/**
 * Media model — types and vocabularies.
 *
 * An asset record exists so a surface can render an image correctly: what it
 * is, what it depicts, how big it is, what it says to a screen reader, and
 * which slots it is allowed to fill. That is the whole job.
 *
 * `kind` distinguishes a real depiction of a machine from a placeholder that
 * stands in for one. That distinction is not administrative — a placeholder in
 * Product structured data would tell a machine consumer it is looking at a
 * photograph of the product when it is looking at a graphic that names it.
 */

/** Whether the file shows the actual machine or stands in for it. */
export type AssetKind =
  /** Shows the real machine. */
  | "depiction"
  /** Original artwork illustrating a concept rather than a specific machine. */
  | "illustration"
  /** Names a model and depicts nothing. */
  | "placeholder";

/** Preference ranking when more than one asset could fill a slot. */
export const KIND_RANK: Record<AssetKind, number> = {
  depiction: 1,
  illustration: 2,
  placeholder: 3,
};

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
  /** A finished promotional composition — headline, copy and button drawn in. */
  | "promotional_panel"
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

export type WithdrawalStatus = "active" | "withdrawn" | "expired";

export type AltTextStatus = "approved" | "draft" | "decorative" | "missing" | "rejected";

/**
 * Which structured-data or social slots an asset may fill.
 *
 * Everything defaults open. The one thing that stays shut is `productImage`
 * on a placeholder, because a graphic that names a model is not a picture of
 * it and Product schema would present it as one.
 */
export interface SchemaEligibility {
  productImage: boolean;
  imageObject: boolean;
  articleImage: boolean;
  openGraph: boolean;
  twitter: boolean;
  /** Why anything above is false. Written whenever something is false. */
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

/** One record per image on the site. */
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
  kind: AssetKind;
  /** Who made the file, for the admin surface. */
  sourceProvider: string;
  /** Which slots this image may fill. */
  allowedPlacements: Placement[];
  /** When the file entered the repository. */
  addedDate: string | null;
  withdrawal: WithdrawalStatus;
  withdrawalDate: string | null;
  withdrawalReason: string | null;
  /** SHA-256 of the stored bytes, so a silent edit fails a test. */
  checksum: string | null;
  /** Intrinsic size, so width/height can always be emitted and CLS avoided. */
  width: number | null;
  height: number | null;
  /** Rendered file, when one exists. */
  src: string | null;
  altText: string;
  altTextStatus: AltTextStatus;
  schema: SchemaEligibility;
  /** True when the file shows the machine rather than standing in for it. */
  depictsRealProduct: boolean;
  /**
   * How the file wants to be framed.
   *
   * `contained` is the default: a cut-out or packshot that needs a lit stage
   * and breathing room around it. `bleed` marks a finished composition — a
   * full creative with its own background, framing and text — which must fill
   * its slot edge to edge at its own aspect ratio. Cropping one of those to a
   * card ratio cuts the headline off, so the surface adapts to the file rather
   * than the other way round.
   */
  presentation?: "contained" | "bleed";
  notes?: string;
}

/**
 * Image readiness, as nine separate states rather than one vague flag.
 * A product can have a complete asset record and no hero; those are different
 * facts with different consequences for the surfaces that consume them.
 */
export interface ImageReadiness {
  /** Every product-depicting asset names the exact verified model. */
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
