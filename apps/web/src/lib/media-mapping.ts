/**
 * MACHINE-READABLE MAPPING for the Content & SEO Control Register (Job 9).
 *
 * Claude does not write to the register. This produces exactly one object per
 * launch product with everything one of those ten rows needs, derived from the
 * media registry so it cannot drift from what the site actually renders.
 *
 * The canonical URL comes from the same central helper the site and the Job 8
 * mapping use, so the three can never disagree.
 */
import { MEDIA_ASSETS } from "../content/media/assets";
import { productPath } from "../content/routes";
import { absUrl } from "./seo";
import { TARGET_TYPES, mediaReport, schemaImagesFor } from "./media-registry";

export interface MediaRegisterRow {
  productId: string;
  slug: string;
  canonicalUrl: string;
  exactModel: string;

  heroAssetId: string | null;
  supportingAssetIds: string[];
  /** What a public surface renders today, whatever its type. */
  renderedAssetId: string | null;
  renderedIsPlaceholder: boolean;

  imageSource: string;
  allowedPlacements: string[];

  altText: string;
  altTextStatus: string;

  /** URLs that may legitimately appear in Product structured data. */
  structuredDataImages: string[];
  structuredDataEligible: boolean;
  openGraphEligible: boolean;
  schemaExclusionReason: string | null;

  missingImageTypes: string[];
  withdrawalFallback: string;

  readiness: Record<string, boolean>;
  imageReadinessStatus: "full_set" | "public_safe_placeholder_only" | "not_renderable";
  blockers: string[];
}

export function buildMediaMapping(): {
  launchProducts: number;
  totals: ReturnType<typeof mediaReport>["totals"];
  rows: MediaRegisterRow[];
} {
  const report = mediaReport();

  const rows: MediaRegisterRow[] = report.products.map((p) => {
    const rendered = p.rendered;
    const asset = MEDIA_ASSETS.find((a) => a.id === rendered?.assetId);
    const schemaImages = schemaImagesFor(p.productId);

    const status: MediaRegisterRow["imageReadinessStatus"] = p.readiness.fullProductMediaSetReady
      ? "full_set"
      : p.readiness.publicRenderingSafe
        ? "public_safe_placeholder_only"
        : "not_renderable";

    const blockers: string[] = [];
    if (!p.readiness.heroReady) blockers.push("no product hero");
    if (!p.readiness.supportingImagesReady) blockers.push("no supporting product imagery");
    if (!p.readiness.schemaEligible) blockers.push("no image eligible for Product structured data");

    return {
      productId: p.productId,
      slug: p.slug,
      canonicalUrl: absUrl(productPath(p.slug)),
      exactModel: p.exactModel,

      heroAssetId: p.heroAssetId,
      supportingAssetIds: p.supportingAssetIds,
      renderedAssetId: rendered?.assetId ?? null,
      renderedIsPlaceholder: rendered?.isPlaceholder ?? false,

      imageSource: asset ? `${asset.kind} — ${asset.sourceProvider}` : "none",
      allowedPlacements: asset?.allowedPlacements ?? [],

      altText: rendered?.alt ?? "",
      altTextStatus: asset?.altTextStatus ?? "missing",

      structuredDataImages: schemaImages,
      structuredDataEligible: schemaImages.length > 0,
      openGraphEligible: Boolean(asset?.schema.openGraph),
      schemaExclusionReason: schemaImages.length === 0 ? (asset?.schema.reason ?? "no renderable asset") : null,

      missingImageTypes: p.missingTypes,
      withdrawalFallback:
        "the media registry re-resolves on every request: a pulled asset is skipped and the next-best asset renders, ending at the placeholder. No broken image can appear, and structured data and Open Graph references disappear with it.",

      readiness: { ...p.readiness } as unknown as Record<string, boolean>,
      imageReadinessStatus: status,
      blockers,
    };
  });

  return {
    launchProducts: rows.length,
    totals: report.totals,
    rows,
  };
}

export { TARGET_TYPES };
