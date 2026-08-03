/**
 * Media resolution, withdrawal control, readiness and validation.
 *
 * THE ONE RULE EVERYTHING ELSE SERVES: nothing reaches a public surface except
 * through `resolveImage()`. A component that reaches into the asset array
 * directly can render a withdrawn image; a component that calls this cannot.
 * That is what makes a takedown a one-line data change instead of a hunt
 * through every template.
 */
import { PRODUCTS } from "../content/products";
import { VERIFICATIONS } from "../content/evidence/verification";
import { ACQUISITION_BLOCKERS, DERIVATIVES, MEDIA_ASSETS } from "../content/media/assets";
import { RIGHTS_BASES } from "../content/media/rights";
import {
  PRODUCT_DEPICTING_TYPES,
  SOURCE_TIER_RANK,
  type AssetType,
  type ImageReadiness,
  type MediaAssetRecord,
  type Placement,
} from "../content/media/types";

/* ------------------------------------------------------------------ */
/* Withdrawal — the central switch                                     */
/* ------------------------------------------------------------------ */

/**
 * Is this asset renderable right now?
 *
 * A withdrawn or expired asset returns false everywhere at once: public HTML,
 * responsive derivatives, structured data and Open Graph all consult this. The
 * rights record itself is untouched, so the audit trail survives the takedown.
 */
export function isRenderable(a: MediaAssetRecord): boolean {
  if (a.withdrawal !== "active") return false;
  if (!a.src) return false;
  if (a.altTextStatus === "missing" || a.altTextStatus === "rejected") return false;
  return true;
}

/** Assets withheld from every surface, with the reason, for the review page. */
export const withdrawnAssets = (assets = MEDIA_ASSETS) => assets.filter((a) => a.withdrawal !== "active");

/* ------------------------------------------------------------------ */
/* Resolution                                                          */
/* ------------------------------------------------------------------ */

export interface ResolvedImage {
  assetId: string;
  src: string;
  width: number | null;
  height: number | null;
  alt: string;
  /** True when the alt text should be dropped and the image hidden from AT. */
  decorative: boolean;
  /** True when this is a placeholder standing in for real photography. */
  isPlaceholder: boolean;
  /** True when the licence forbids us hosting the file. */
  remoteOnly: boolean;
  /**
   * True when the asset is a finished composition that must fill its slot at
   * its own aspect ratio. A surface that crops to a fixed card ratio has to
   * stand down for these, or it cuts the model name off the artwork.
   */
  bleed: boolean;
  /** Derivatives available for a srcset, in ascending width order. */
  srcset: { src: string; width: number }[];
  /** May this image appear in Product structured data? */
  schemaProductImage: boolean;
  /** Why the chosen asset was chosen, for the review surface. */
  reason: string;
}

/**
 * The single entry point for any surface that wants a product image.
 *
 * Preference order is the source hierarchy: a licensed manufacturer image beats
 * an affiliate one, which beats a placeholder. A withdrawn asset is skipped as
 * though it did not exist, so the next-best asset — ultimately the placeholder —
 * takes over without a broken image or an empty box.
 */
export function resolveImage(
  productId: string,
  placement: Placement,
  preferredTypes: AssetType[] = ["product_hero", "product_alternate_view", "branded_placeholder"],
  assets = MEDIA_ASSETS,
): ResolvedImage | null {
  const candidates = assets
    .filter((a) => a.productId === productId)
    .filter(isRenderable)
    .filter((a) => a.allowedPlacements.includes(placement))
    .filter((a) => preferredTypes.includes(a.type))
    .sort((x, y) => {
      const t = preferredTypes.indexOf(x.type) - preferredTypes.indexOf(y.type);
      if (t !== 0) return t;
      return SOURCE_TIER_RANK[x.tier] - SOURCE_TIER_RANK[y.tier];
    });

  const chosen = candidates[0];
  if (!chosen) return null;

  const derivatives = DERIVATIVES.filter((d) => d.parentAssetId === chosen.id)
    .sort((a, b) => a.width - b.width)
    .map((d) => ({ src: d.src, width: d.width }));

  return {
    assetId: chosen.id,
    src: chosen.src!,
    width: chosen.width,
    height: chosen.height,
    alt: chosen.altTextStatus === "decorative" ? "" : chosen.altText,
    decorative: chosen.altTextStatus === "decorative",
    isPlaceholder: !chosen.depictsRealProduct,
    remoteOnly: chosen.remoteServingRequired,
    bleed: chosen.presentation === "bleed",
    srcset: derivatives,
    schemaProductImage: chosen.schema.productImage,
    reason:
      chosen.tier === "branded_placeholder"
        ? "no lawfully held photograph exists for this model; the branded placeholder names the model and depicts nothing"
        : `best available source: ${chosen.tier} via ${chosen.sourceProvider}`,
  };
}

/**
 * Images that may legitimately appear in Product structured data. Returns an
 * empty array rather than a placeholder, because an absent image field is
 * honest and a placeholder in Product schema is not.
 */
export function schemaImagesFor(productId: string, assets = MEDIA_ASSETS): string[] {
  return assets
    .filter((a) => a.productId === productId && isRenderable(a) && a.schema.productImage)
    .map((a) => a.src!)
    .filter(Boolean);
}

/* ------------------------------------------------------------------ */
/* Readiness — nine states, never one flag                             */
/* ------------------------------------------------------------------ */

const SUPPORTING_TYPES: AssetType[] = [
  "product_alternate_view",
  "product_detail",
  "product_in_use",
  "included_accessories",
  "filtration_detail",
  "charging_equipment",
  "app_screenshot",
];

export function readinessFor(productId: string, assets = MEDIA_ASSETS): ImageReadiness {
  const mine = assets.filter((a) => a.productId === productId);
  const live = mine.filter(isRenderable);
  const depicting = mine.filter((a) => PRODUCT_DEPICTING_TYPES.includes(a.type));

  const rightsRecordComplete =
    mine.length > 0 && mine.every((a) => a.rightsBasis.length > 20 && a.acquisitionMethod !== "not_yet_acquired" && a.allowedPlacements.length > 0);

  const expected = VERIFICATIONS.find((v) => v.productId === productId)?.identity.canonicalName ?? null;
  const exactModelConfirmed = depicting.length === 0 || depicting.every((a) => a.exactModel !== null && a.exactModel === expected);

  const heroReady = live.some((a) => a.type === "product_hero");
  const supportingImagesReady = live.filter((a) => SUPPORTING_TYPES.includes(a.type)).length >= 1;

  // A vector asset satisfies every rendered width on its own; requiring raster
  // derivatives of an SVG would fail a product for a file nobody should make.
  const responsiveVariantsReady = live.every(
    (a) => a.src?.endsWith(".svg") || a.remoteServingRequired || DERIVATIVES.some((d) => d.parentAssetId === a.id),
  );

  const altTextApproved = live.length > 0 && live.every((a) => a.altTextStatus === "approved" || a.altTextStatus === "decorative");
  const schemaEligible = live.some((a) => a.schema.productImage);
  const publicRenderingSafe = live.length > 0 && rightsRecordComplete && exactModelConfirmed && altTextApproved;

  return {
    rightsRecordComplete,
    exactModelConfirmed,
    heroReady,
    supportingImagesReady,
    responsiveVariantsReady,
    altTextApproved,
    schemaEligible,
    publicRenderingSafe,
    fullProductMediaSetReady:
      heroReady && supportingImagesReady && responsiveVariantsReady && altTextApproved && schemaEligible && publicRenderingSafe,
  };
}

/* ------------------------------------------------------------------ */
/* Validation                                                          */
/* ------------------------------------------------------------------ */

export interface MediaIssue {
  severity: "error" | "warning";
  rule: string;
  detail: string;
  assetId?: string;
  productId?: string;
}

/** Patterns that would mean a credential or signed URL had escaped into data. */
export const CREDENTIAL_PATTERNS: RegExp[] = [
  /X-Amz-Signature=/i,
  /AWSAccessKeyId=/i,
  /[?&](signature|sig|token|access_token|api_key|apikey|secret)=/i,
  /\bAKIA[0-9A-Z]{12,}\b/,
  /Bearer\s+[A-Za-z0-9._-]{20,}/,
];

export function validateMedia(assets = MEDIA_ASSETS): MediaIssue[] {
  const issues: MediaIssue[] = [];
  /**
   * A product is "real" if it has an editorial record OR a verification record.
   * Both are required eventually, but they do not land at the same time: a
   * product can be verified, published to D1 and rendering on a category page
   * days before its editorial is written. Checking only the editorial map would
   * reject artwork for a product that is already live, which is the wrong way
   * round — the identity check is what protects the image, and that lives in
   * the verification registry.
   */
  const productIds = new Set([
    ...Object.values(PRODUCTS).map((p) => p.productId),
    ...VERIFICATIONS.map((v) => v.productId),
  ]);
  const basisTexts = new Set(RIGHTS_BASES.map((r) => r.text));
  const seen = new Set<string>();

  for (const a of assets) {
    if (seen.has(a.id)) issues.push({ severity: "error", rule: "asset_id_unique", detail: `duplicate asset id ${a.id}`, assetId: a.id });
    seen.add(a.id);

    // Every asset belongs to a real product or declares a non-product purpose.
    if (a.productId === null && !a.purpose) {
      issues.push({ severity: "error", rule: "no_orphan_asset", detail: "asset has neither a product nor a stated purpose", assetId: a.id });
    }
    if (a.productId !== null && !productIds.has(a.productId)) {
      issues.push({ severity: "error", rule: "valid_product_id", detail: `asset references unknown product ${a.productId}`, assetId: a.id });
    }

    // A product-depicting asset must name the exact model, and it must be the
    // model Job 8 verified — this is what stops a cross-product substitution.
    if (PRODUCT_DEPICTING_TYPES.includes(a.type)) {
      const expected = VERIFICATIONS.find((v) => v.productId === a.productId)?.identity.canonicalName;
      if (!a.exactModel) {
        issues.push({ severity: "error", rule: "exact_model_required", detail: `${a.type} asset does not name the model it depicts`, assetId: a.id, productId: a.productId ?? undefined });
      } else if (expected && a.exactModel !== expected) {
        issues.push({
          severity: "error",
          rule: "no_cross_product_substitution",
          detail: `asset names "${a.exactModel}" but is attached to "${expected}"`,
          assetId: a.id,
          productId: a.productId ?? undefined,
        });
      }
    }

    // Rights, acquisition and scope must all be present and recognised.
    if (!a.rightsBasis || a.rightsBasis.length < 20) {
      issues.push({ severity: "error", rule: "rights_basis_required", detail: "asset has no usable rights basis", assetId: a.id });
    } else if (!basisTexts.has(a.rightsBasis)) {
      issues.push({ severity: "warning", rule: "rights_basis_known", detail: "asset uses a rights basis that is not in the registry", assetId: a.id });
    }
    if (!a.acquisitionMethod) {
      issues.push({ severity: "error", rule: "acquisition_method_required", detail: "asset does not record how it was obtained", assetId: a.id });
    }
    if (a.allowedMarkets.length === 0) issues.push({ severity: "error", rule: "market_scope_required", detail: "asset has no allowed market", assetId: a.id });
    if (a.allowedPlacements.length === 0) issues.push({ severity: "error", rule: "placement_scope_required", detail: "asset has no allowed placement", assetId: a.id });

    // Storage permission and remote-serving requirement must be coherent.
    if (a.remoteServingRequired && a.storage === "local_permitted") {
      issues.push({ severity: "error", rule: "remote_serving_respected", detail: "asset must be remotely served but is marked locally stored", assetId: a.id });
    }
    if (a.storage === "local_permitted" && a.src?.startsWith("/") && a.src.match(/\.(svg|png|jpe?g|webp|avif)$/) && !a.checksum) {
      issues.push({ severity: "error", rule: "checksum_required", detail: "locally stored file has no checksum", assetId: a.id });
    }

    // Dimensions must exist for any file we render, so width/height can be set.
    if (isRenderable(a) && a.src?.startsWith("/") && (a.width === null || a.height === null)) {
      issues.push({ severity: "error", rule: "dimensions_required", detail: "rendered file has no intrinsic dimensions, so layout shift cannot be prevented", assetId: a.id });
    }

    // Alt text state must be explicit.
    if (a.altTextStatus === "approved" && a.altText.trim().length < 10) {
      issues.push({ severity: "error", rule: "alt_text_state", detail: "alt text is marked approved but is empty or trivial", assetId: a.id });
    }
    if (a.altTextStatus === "decorative" && a.altText.trim().length > 0) {
      issues.push({ severity: "warning", rule: "alt_text_state", detail: "decorative asset carries alt text that will be dropped", assetId: a.id });
    }

    // A placeholder may never claim to be a photograph of the product.
    if (!a.depictsRealProduct && a.schema.productImage) {
      issues.push({ severity: "error", rule: "no_placeholder_in_product_schema", detail: "an asset that depicts no real product is marked eligible for Product schema", assetId: a.id });
    }
    if (a.schema.reason === null && !a.schema.productImage) {
      issues.push({ severity: "warning", rule: "schema_reason_required", detail: "asset is schema-ineligible with no reason recorded", assetId: a.id });
    }

    // Nothing may assert testing that has not happened.
    if (a.supportsTestedClaim) {
      issues.push({ severity: "error", rule: "no_tested_claim", detail: "asset claims to support a tested observation", assetId: a.id });
    }

    // No credential, signed URL or secret may live in a rights record.
    for (const field of [a.src ?? "", a.sourceRef ?? "", a.rightsBasis, a.altText]) {
      for (const re of CREDENTIAL_PATTERNS) {
        if (re.test(field)) {
          issues.push({ severity: "error", rule: "no_credential_in_record", detail: `asset field matches a credential pattern (${re})`, assetId: a.id });
        }
      }
    }

    // A withdrawn asset must say why and when.
    if (a.withdrawal !== "active" && (!a.withdrawalReason || !a.withdrawalDate)) {
      issues.push({ severity: "error", rule: "withdrawal_recorded", detail: "withdrawn asset has no reason or date", assetId: a.id });
    }
  }

  // Every derivative must point at an asset that exists and is renderable.
  const byId = new Map(assets.map((a) => [a.id, a]));
  for (const d of DERIVATIVES) {
    const parent = byId.get(d.parentAssetId);
    if (!parent) {
      issues.push({ severity: "error", rule: "derivative_parent_exists", detail: `derivative ${d.id} has no parent asset` });
      continue;
    }
    if (parent.width && d.width > parent.width) {
      issues.push({ severity: "error", rule: "no_upscaling", detail: `derivative ${d.id} is wider than its source`, assetId: parent.id });
    }
    if (parent.width && parent.height && d.crop === "native") {
      const source = parent.width / parent.height;
      const derived = d.width / d.height;
      if (Math.abs(source - derived) > 0.02) {
        issues.push({ severity: "error", rule: "aspect_ratio_preserved", detail: `derivative ${d.id} changes aspect ratio without an approved crop`, assetId: parent.id });
      }
    }
  }

  // Every launch product must have something to render — a fallback always exists.
  for (const p of Object.values(PRODUCTS)) {
    const fallback = resolveImage(p.productId, "listing_card", ["product_hero", "branded_placeholder"], assets);
    if (!fallback) {
      issues.push({ severity: "error", rule: "fallback_required", detail: "product has no renderable image and no placeholder", productId: p.productId });
    }
    if (!ACQUISITION_BLOCKERS.some((b) => b.productId === p.productId) && !readinessFor(p.productId, assets).heroReady) {
      issues.push({ severity: "warning", rule: "blocker_recorded", detail: "product has no hero and no recorded acquisition blocker", productId: p.productId });
    }
  }

  return issues;
}

/* ------------------------------------------------------------------ */
/* Coverage report                                                     */
/* ------------------------------------------------------------------ */

export interface ProductMediaRow {
  productId: string;
  slug: string;
  exactModel: string;
  assets: MediaAssetRecord[];
  heroAssetId: string | null;
  supportingAssetIds: string[];
  missingTypes: AssetType[];
  readiness: ImageReadiness;
  blocker: (typeof ACQUISITION_BLOCKERS)[number] | undefined;
  /** What a public surface will actually render today. */
  rendered: ResolvedImage | null;
}

/** The four types an image-complete launch product is expected to hold. */
export const TARGET_TYPES: AssetType[] = ["product_hero", "product_alternate_view", "product_detail", "listing_thumbnail"];

export function mediaReport(assets = MEDIA_ASSETS) {
  const issues = validateMedia(assets);
  const products: ProductMediaRow[] = Object.values(PRODUCTS).map((p) => {
    const mine = assets.filter((a) => a.productId === p.productId);
    const live = mine.filter(isRenderable);
    const v = VERIFICATIONS.find((x) => x.productId === p.productId);
    return {
      productId: p.productId,
      slug: p.slug,
      exactModel: v?.identity.canonicalName ?? p.slug,
      assets: mine,
      heroAssetId: live.find((a) => a.type === "product_hero")?.id ?? null,
      supportingAssetIds: live.filter((a) => SUPPORTING_TYPES.includes(a.type)).map((a) => a.id),
      missingTypes: TARGET_TYPES.filter((t) => !live.some((a) => a.type === t)),
      readiness: readinessFor(p.productId, assets),
      blocker: ACQUISITION_BLOCKERS.find((b) => b.productId === p.productId),
      rendered: resolveImage(p.productId, "listing_card", ["product_hero", "branded_placeholder"], assets),
    };
  });

  const productAssets = assets.filter((a) => a.productId !== null);
  return {
    issues,
    products,
    totals: {
      assets: assets.length,
      productAssets: productAssets.length,
      originalAssets: assets.filter((a) => a.tier === "original_botplanet").length,
      placeholders: assets.filter((a) => a.tier === "branded_placeholder").length,
      locallyStored: assets.filter((a) => a.storage === "local_permitted").length,
      remotelyServed: assets.filter((a) => a.remoteServingRequired).length,
      withdrawn: withdrawnAssets(assets).length,
      exactModelConfirmed: products.filter((p) => p.readiness.exactModelConfirmed).length,
      publicSafe: products.filter((p) => p.readiness.publicRenderingSafe).length,
      heroReady: products.filter((p) => p.readiness.heroReady).length,
      fullSetReady: products.filter((p) => p.readiness.fullProductMediaSetReady).length,
      derivatives: DERIVATIVES.length,
      altApproved: assets.filter((a) => a.altTextStatus === "approved").length,
      altDecorative: assets.filter((a) => a.altTextStatus === "decorative").length,
      altMissing: assets.filter((a) => a.altTextStatus === "missing").length,
      altRejected: assets.filter((a) => a.altTextStatus === "rejected").length,
      schemaProductEligible: assets.filter((a) => a.schema.productImage).length,
      schemaOpenGraphEligible: assets.filter((a) => a.schema.openGraph).length,
    },
  };
}
