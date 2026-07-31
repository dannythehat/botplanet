import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { PRODUCTS } from "../src/content/products";
import { VERIFICATIONS } from "../src/content/evidence/verification";
import { ACQUISITION_BLOCKERS, MEDIA_ASSETS, ORIGINAL_ASSETS, PLACEHOLDER_ASSETS, DERIVATIVES } from "../src/content/media/assets";
import {
  AMAZON_IMAGE_RULES,
  MEDIA_SOURCE_CHECKS,
  PRODUCT_PHOTOGRAPHY_POSITION,
  RIGHTS_BASES,
  rightsBasis,
} from "../src/content/media/rights";
import { PRODUCT_DEPICTING_TYPES, SOURCE_TIER_RANK, type MediaAssetRecord } from "../src/content/media/types";
import {
  CREDENTIAL_PATTERNS,
  TARGET_TYPES,
  isRenderable,
  mediaReport,
  readinessFor,
  resolveImage,
  schemaImagesFor,
  validateMedia,
  withdrawnAssets,
} from "../src/lib/media-registry";
import { buildMediaMapping } from "../src/lib/media-mapping";
import { LAUNCH_CATEGORY, productPath } from "../src/content/routes";

const REPORT = mediaReport();
const PRODUCT_IDS = Object.values(PRODUCTS).map((p) => p.productId);

describe("asset record integrity", () => {
  it("passes validation with no errors", () => {
    expect(REPORT.issues.filter((i) => i.severity === "error")).toEqual([]);
  });

  it("gives every asset a unique ID", () => {
    const ids = MEDIA_ASSETS.map((a) => a.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("attaches every asset to a real product or a stated purpose", () => {
    for (const a of MEDIA_ASSETS) {
      if (a.productId === null) expect(a.purpose).toBeTruthy();
      else expect(PRODUCT_IDS).toContain(a.productId);
    }
  });

  it("records a rights basis and an acquisition method on every asset", () => {
    for (const a of MEDIA_ASSETS) {
      expect(a.rightsBasis.length).toBeGreaterThan(20);
      expect(a.acquisitionMethod).not.toBe("not_yet_acquired");
      expect(a.allowedMarkets.length).toBeGreaterThan(0);
      expect(a.allowedPlacements.length).toBeGreaterThan(0);
    }
  });

  it("uses only rights bases that exist in the registry", () => {
    const texts = new Set(RIGHTS_BASES.map((r) => r.text));
    for (const a of MEDIA_ASSETS) expect(texts.has(a.rightsBasis)).toBe(true);
  });

  it("never claims a media asset supports a tested observation", () => {
    for (const a of MEDIA_ASSETS) expect(a.supportsTestedClaim).toBe(false);
  });

  it("flags a duplicate asset ID", () => {
    const dup = [...MEDIA_ASSETS, { ...MEDIA_ASSETS[0] }];
    expect(validateMedia(dup).some((i) => i.rule === "asset_id_unique")).toBe(true);
  });

  it("flags an asset pointing at a product that does not exist", () => {
    const bad: MediaAssetRecord = { ...PLACEHOLDER_ASSETS[0], id: "x-orphan", productId: "prod-nope" };
    expect(validateMedia([...MEDIA_ASSETS, bad]).some((i) => i.rule === "valid_product_id")).toBe(true);
  });

  it("flags an asset with no rights basis", () => {
    const bad: MediaAssetRecord = { ...PLACEHOLDER_ASSETS[0], id: "x-norights", rightsBasis: "" };
    expect(validateMedia([...MEDIA_ASSETS, bad]).some((i) => i.rule === "rights_basis_required")).toBe(true);
  });
});

describe("exact model identity", () => {
  it("names the Job 8 verified model on every product-depicting asset", () => {
    for (const a of MEDIA_ASSETS) {
      if (!PRODUCT_DEPICTING_TYPES.includes(a.type)) continue;
      const expected = VERIFICATIONS.find((v) => v.productId === a.productId)!.identity.canonicalName;
      expect(a.exactModel).toBe(expected);
    }
  });

  it("names the exact model on every placeholder, so it cannot drift onto a sibling", () => {
    for (const a of PLACEHOLDER_ASSETS) {
      const expected = VERIFICATIONS.find((v) => v.productId === a.productId)!.identity.canonicalName;
      expect(a.exactModel).toBe(expected);
    }
  });

  it("catches a cross-product substitution", () => {
    const bad: MediaAssetRecord = {
      ...PLACEHOLDER_ASSETS[0],
      id: "x-swap",
      type: "product_hero",
      exactModel: "Betta SE",
    };
    const issues = validateMedia([...MEDIA_ASSETS, bad]);
    expect(issues.some((i) => i.rule === "no_cross_product_substitution")).toBe(true);
  });

  it("catches a product image that names no model at all", () => {
    const bad: MediaAssetRecord = { ...PLACEHOLDER_ASSETS[0], id: "x-nomodel", type: "product_hero", exactModel: null };
    expect(validateMedia([...MEDIA_ASSETS, bad]).some((i) => i.rule === "exact_model_required")).toBe(true);
  });

  it("distinguishes each of the six models Job 8 warned could be confused", () => {
    const names = PLACEHOLDER_ASSETS.map((a) => a.exactModel);
    expect(names).toContain("Betta SE Plus — Solar-Powered Robotic Pool Skimmer");
    expect(names).not.toContain("Betta SE");
    expect(names).toContain("Beatbot AquaSense 2 Ultra Robotic Pool Cleaner");
    expect(names).toContain("Polaris FREEDOM Cordless Robotic Cleaner");
    expect(names).toContain("Aiper Scuba S1 Cordless Robotic Pool Cleaner");
    expect(names).toContain("Aiper Seagull SE");
    expect(names).toContain("Dolphin Premier");
    expect(new Set(names).size).toBe(names.length);
  });
});

describe("lawful sourcing", () => {
  it("holds no third-party product photograph, and says so", () => {
    const thirdParty = MEDIA_ASSETS.filter(
      (a) => a.tier !== "original_botplanet" && a.tier !== "branded_placeholder",
    );
    expect(thirdParty).toEqual([]);
    expect(PRODUCT_PHOTOGRAPHY_POSITION).toContain("No third-party product photograph is ingested");
  });

  it("records the lawful-source check that produced that finding", () => {
    expect(MEDIA_SOURCE_CHECKS.length).toBeGreaterThanOrEqual(6);
    for (const c of MEDIA_SOURCE_CHECKS) {
      expect(c.url).toMatch(/^https:\/\//);
      expect(c.note.length).toBeGreaterThan(20);
      expect(c.outcome).not.toBe("permission_granted");
    }
  });

  it("gives every product a written acquisition blocker with an unblock action", () => {
    for (const id of PRODUCT_IDS) {
      const b = ACQUISITION_BLOCKERS.find((x) => x.productId === id);
      expect(b).toBeDefined();
      expect(b!.blocker.length).toBeGreaterThan(40);
      expect(b!.unblockAction.length).toBeGreaterThan(30);
      expect(b!.checked.length).toBeGreaterThan(0);
    }
  });

  it("holds Dolphin Premier back on identity, not only on credentials", () => {
    const b = ACQUISITION_BLOCKERS.find((x) => x.productId === "prod-dolphin-premier")!;
    expect(b.blocker).toContain("candidate under review");
    expect(b.blocker).toContain("generic Dolphin image is not acceptable");
    expect(b.owner).toBe("manufacturer");
  });

  it("ranks the source hierarchy with placeholders last", () => {
    expect(SOURCE_TIER_RANK.manufacturer_media_library).toBeLessThan(SOURCE_TIER_RANK.affiliate_api);
    expect(SOURCE_TIER_RANK.affiliate_api).toBeLessThan(SOURCE_TIER_RANK.original_botplanet);
    expect(SOURCE_TIER_RANK.branded_placeholder).toBe(6);
  });

  it("keeps the Amazon rules explicit and forbids caching and guessed URLs", () => {
    const joined = AMAZON_IMAGE_RULES.join(" ").toLowerCase();
    expect(joined).toContain("never scrape");
    expect(joined).toContain("guess");
    expect(joined).toContain("cache");
    expect(rightsBasis("amazon_associates_program_content")!.localStoragePermitted).toBe(false);
    expect(rightsBasis("amazon_associates_program_content")!.remoteServingRequired).toBe(true);
  });

  it("caches nothing under the Amazon basis, because nothing is ingested under it", () => {
    const amazon = MEDIA_ASSETS.filter((a) => a.rightsBasis === rightsBasis("amazon_associates_program_content")!.text);
    expect(amazon).toEqual([]);
  });

  it("flags an asset marked locally stored that must be remotely served", () => {
    const bad: MediaAssetRecord = { ...PLACEHOLDER_ASSETS[0], id: "x-remote", remoteServingRequired: true, storage: "local_permitted" };
    expect(validateMedia([...MEDIA_ASSETS, bad]).some((i) => i.rule === "remote_serving_respected")).toBe(true);
  });
});

describe("stored files", () => {
  it("matches every placeholder checksum against the committed file", () => {
    for (const a of PLACEHOLDER_ASSETS) {
      const bytes = readFileSync(`apps/web/public${a.src}`);
      expect(a.checksum).toBe(`sha256:${createHash("sha256").update(bytes).digest("hex")}`);
    }
  });

  it("matches the Open Graph card's checksum", () => {
    const og = ORIGINAL_ASSETS.find((a) => a.id === "og-botplanet-default")!;
    const bytes = readFileSync(`apps/web/public${og.src}`);
    expect(og.checksum).toBe(`sha256:${createHash("sha256").update(bytes).digest("hex")}`);
  });

  it("records intrinsic dimensions for every rendered file, so nothing shifts on load", () => {
    for (const a of MEDIA_ASSETS) {
      if (!isRenderable(a) || !a.src?.startsWith("/")) continue;
      expect(a.width).toBeGreaterThan(0);
      expect(a.height).toBeGreaterThan(0);
    }
  });

  it("flags a stored file with no checksum", () => {
    const bad: MediaAssetRecord = { ...PLACEHOLDER_ASSETS[0], id: "x-nosum", checksum: null };
    expect(validateMedia([...MEDIA_ASSETS, bad]).some((i) => i.rule === "checksum_required")).toBe(true);
  });
});

describe("responsive derivatives", () => {
  it("generates no raster copies of vector artwork", () => {
    expect(DERIVATIVES).toEqual([]);
    for (const a of PLACEHOLDER_ASSETS) expect(a.src!.endsWith(".svg")).toBe(true);
  });

  it("counts a vector asset as variant-ready, because it scales without one", () => {
    for (const id of PRODUCT_IDS) expect(readinessFor(id).responsiveVariantsReady).toBe(true);
  });

  it("rejects a derivative wider than its source", () => {
    const parent = PLACEHOLDER_ASSETS[0];
    const derivatives = [{ id: "d1", parentAssetId: parent.id, format: "webp" as const, width: parent.width! + 400, height: 900, src: "/x.webp", crop: "native" as const }];
    DERIVATIVES.push(...derivatives);
    const issues = validateMedia();
    DERIVATIVES.length = 0;
    expect(issues.some((i) => i.rule === "no_upscaling")).toBe(true);
  });

  it("rejects a native derivative that changes aspect ratio", () => {
    const parent = PLACEHOLDER_ASSETS[0];
    DERIVATIVES.push({ id: "d2", parentAssetId: parent.id, format: "webp", width: 600, height: 600, src: "/y.webp", crop: "native" });
    const issues = validateMedia();
    DERIVATIVES.length = 0;
    expect(issues.some((i) => i.rule === "aspect_ratio_preserved")).toBe(true);
  });

  it("rejects a derivative whose parent does not exist", () => {
    DERIVATIVES.push({ id: "d3", parentAssetId: "nope", format: "webp", width: 100, height: 62, src: "/z.webp", crop: "native" });
    const issues = validateMedia();
    DERIVATIVES.length = 0;
    expect(issues.some((i) => i.rule === "derivative_parent_exists")).toBe(true);
  });
});

describe("alt text", () => {
  it("gives every renderable asset an approved or decorative state", () => {
    for (const a of MEDIA_ASSETS) {
      if (!isRenderable(a)) continue;
      expect(["approved", "decorative"]).toContain(a.altTextStatus);
    }
  });

  it("never lets a placeholder's alt text claim to show the product", () => {
    for (const a of PLACEHOLDER_ASSETS) {
      expect(a.altText).toContain("placeholder");
      expect(a.altText).not.toMatch(/\bphotograph of\b(?!.*not)/i);
      expect(a.altText).not.toMatch(/\bimage of the\b/i);
    }
  });

  it("calls no illustration a photograph", () => {
    for (const a of MEDIA_ASSETS) {
      if (a.depictsRealProduct) continue;
      expect(a.altText.toLowerCase()).not.toMatch(/^photo|^photograph of/);
    }
  });

  it("drops alt text for a decorative asset rather than describing it", () => {
    const decorative = MEDIA_ASSETS.filter((a) => a.altTextStatus === "decorative");
    expect(decorative.length).toBeGreaterThan(0);
    for (const a of decorative) expect(a.altText).toBe("");
  });

  it("refuses to render an asset whose alt text is missing or rejected", () => {
    expect(isRenderable({ ...PLACEHOLDER_ASSETS[0], altTextStatus: "missing" })).toBe(false);
    expect(isRenderable({ ...PLACEHOLDER_ASSETS[0], altTextStatus: "rejected" })).toBe(false);
  });

  it("flags alt text marked approved but empty", () => {
    const bad: MediaAssetRecord = { ...PLACEHOLDER_ASSETS[0], id: "x-emptyalt", altText: "  ", altTextStatus: "approved" };
    expect(validateMedia([...MEDIA_ASSETS, bad]).some((i) => i.rule === "alt_text_state")).toBe(true);
  });
});

describe("structured data and social", () => {
  it("puts no placeholder in Product schema", () => {
    for (const id of PRODUCT_IDS) expect(schemaImagesFor(id)).toEqual([]);
    for (const a of MEDIA_ASSETS) if (!a.depictsRealProduct) expect(a.schema.productImage).toBe(false);
  });

  it("rejects a placeholder marked eligible for Product schema", () => {
    const bad: MediaAssetRecord = {
      ...PLACEHOLDER_ASSETS[0],
      id: "x-schema",
      schema: { ...PLACEHOLDER_ASSETS[0].schema, productImage: true },
    };
    expect(validateMedia([...MEDIA_ASSETS, bad]).some((i) => i.rule === "no_placeholder_in_product_schema")).toBe(true);
  });

  it("records why anything schema-ineligible is ineligible", () => {
    for (const a of MEDIA_ASSETS) if (!a.schema.productImage) expect(a.schema.reason).toBeTruthy();
  });

  it("allows the brand card as an Open Graph image but not as a product image", () => {
    const og = ORIGINAL_ASSETS.find((a) => a.id === "og-botplanet-default")!;
    expect(og.schema.openGraph).toBe(true);
    expect(og.schema.productImage).toBe(false);
  });

  it("keeps placeholders out of Open Graph too", () => {
    for (const a of PLACEHOLDER_ASSETS) {
      expect(a.schema.openGraph).toBe(false);
      expect(a.schema.twitter).toBe(false);
    }
  });
});

describe("central withdrawal control", () => {
  const target = PLACEHOLDER_ASSETS.find((a) => a.productId === "prod-dolphin-e10")!;
  /** The same asset, withdrawn — as a takedown would record it. */
  const withdrawn: MediaAssetRecord = {
    ...target,
    withdrawal: "withdrawn",
    withdrawalDate: "2026-08-01",
    withdrawalReason: "test takedown",
  };
  const after = MEDIA_ASSETS.map((a) => (a.id === target.id ? withdrawn : a));

  it("renders the asset before withdrawal", () => {
    expect(resolveImage("prod-dolphin-e10", "listing_card")!.assetId).toBe(target.id);
  });

  it("stops public rendering the moment it is withdrawn", () => {
    expect(isRenderable(withdrawn)).toBe(false);
    expect(resolveImage("prod-dolphin-e10", "listing_card", ["product_hero", "branded_placeholder"], after)).toBeNull();
  });

  it("removes it from structured data at the same time", () => {
    expect(schemaImagesFor("prod-dolphin-e10", after)).toEqual([]);
  });

  it("removes its derivatives with it", () => {
    const live = after.filter(isRenderable).map((a) => a.id);
    expect(live).not.toContain(target.id);
    expect(DERIVATIVES.filter((d) => d.parentAssetId === target.id)).toEqual([]);
  });

  it("keeps the rights record for audit", () => {
    const kept = after.find((a) => a.id === target.id)!;
    expect(kept.rightsBasis).toBe(target.rightsBasis);
    expect(kept.withdrawalReason).toBe("test takedown");
    expect(kept.withdrawalDate).toBe("2026-08-01");
    expect(withdrawnAssets(after).map((a) => a.id)).toContain(target.id);
  });

  it("falls back rather than showing a broken image", () => {
    // With no renderable asset the resolver returns null, and the render path
    // draws the owned silhouette instead of emitting a dead <img> src.
    expect(resolveImage("prod-dolphin-e10", "listing_card", ["product_hero", "branded_placeholder"], after)).toBeNull();
    expect(validateMedia(after).some((i) => i.rule === "fallback_required")).toBe(true);
  });

  it("requires a reason and a date on any withdrawal", () => {
    const sloppy: MediaAssetRecord = { ...target, withdrawal: "withdrawn", withdrawalReason: null, withdrawalDate: null };
    expect(validateMedia([...MEDIA_ASSETS, { ...sloppy, id: "x-wd" }]).some((i) => i.rule === "withdrawal_recorded")).toBe(true);
  });

  it("needs no template change to take effect", () => {
    // Every surface resolves through the registry, so the only edit a takedown
    // needs is the record itself.
    const card = readFileSync("apps/web/src/components/ProductCard.astro", "utf8");
    expect(card).toContain("ProductImage");
    expect(card).not.toMatch(/<img[^>]*src=\{image\}/);
  });
});

describe("no credential or signed URL escapes", () => {
  it("stores only a secret NAME on a rights basis, never a value", () => {
    for (const r of RIGHTS_BASES) {
      if (!r.credentialSecretRef) continue;
      expect(r.credentialSecretRef).toMatch(/^[A-Z0-9_]+$/);
      expect(r.credentialSecretRef.length).toBeLessThan(64);
    }
  });

  it("matches no credential pattern anywhere in the asset records", () => {
    for (const a of MEDIA_ASSETS) {
      const fields = [a.src ?? "", a.sourceRef ?? "", a.rightsBasis, a.altText, a.notes ?? ""].join(" ");
      for (const re of CREDENTIAL_PATTERNS) expect(re.test(fields)).toBe(false);
    }
  });

  it("detects a signed URL if one is ever introduced", () => {
    const bad: MediaAssetRecord = { ...PLACEHOLDER_ASSETS[0], id: "x-signed", sourceRef: "https://x.test/i.jpg?X-Amz-Signature=deadbeef" };
    expect(validateMedia([...MEDIA_ASSETS, bad]).some((i) => i.rule === "no_credential_in_record")).toBe(true);
  });
});

describe("readiness states", () => {
  it("reports nine separate states, not one flag", () => {
    for (const id of PRODUCT_IDS) expect(Object.keys(readinessFor(id))).toHaveLength(9);
  });

  it("calls every product public-render safe on placeholders alone", () => {
    for (const id of PRODUCT_IDS) {
      const r = readinessFor(id);
      expect(r.rightsRecordComplete).toBe(true);
      expect(r.exactModelConfirmed).toBe(true);
      expect(r.altTextApproved).toBe(true);
      expect(r.publicRenderingSafe).toBe(true);
    }
  });

  it("calls no product hero-ready, schema-eligible or media-complete", () => {
    for (const id of PRODUCT_IDS) {
      const r = readinessFor(id);
      expect(r.heroReady).toBe(false);
      expect(r.schemaEligible).toBe(false);
      expect(r.fullProductMediaSetReady).toBe(false);
    }
  });

  it("lists the missing target types honestly rather than inventing records", () => {
    for (const p of REPORT.products) {
      expect(p.missingTypes).toEqual(TARGET_TYPES);
      expect(p.assets.length).toBe(1);
    }
  });
});

describe("public integration", () => {
  it("renders a placeholder for every product today", () => {
    for (const id of PRODUCT_IDS) {
      const r = resolveImage(id, "listing_card", ["product_hero", "branded_placeholder"])!;
      expect(r).toBeTruthy();
      expect(r.isPlaceholder).toBe(true);
      expect(r.schemaProductImage).toBe(false);
      expect(r.width).toBeGreaterThan(0);
      expect(r.height).toBeGreaterThan(0);
    }
  });

  it("emits no srcset when no derivative exists, rather than inventing widths", () => {
    for (const id of PRODUCT_IDS) expect(resolveImage(id, "listing_card")!.srcset).toEqual([]);
  });

  it("respects the placement restriction on a rights basis", () => {
    // Placeholders are not permitted in Open Graph, so asking for one there
    // must return nothing rather than quietly widening the licence.
    for (const id of PRODUCT_IDS) {
      expect(resolveImage(id, "open_graph", ["branded_placeholder"])).toBeNull();
    }
  });

  it("routes the product card through the registry rather than a raw URL", () => {
    const card = readFileSync("apps/web/src/components/ProductCard.astro", "utf8");
    expect(card).toContain('placement="listing_card"');
    expect(card).not.toContain("imageAlt");
  });

  it("emits width, height and a lazy default in the render path", () => {
    const c = readFileSync("apps/web/src/components/ProductImage.astro", "utf8");
    expect(c).toContain("width={img.width");
    expect(c).toContain("height={img.height");
    expect(c).toContain('loading={priority ? "eager" : "lazy"}');
    expect(c).toContain('decoding="async"');
  });

  it("embeds no base64 image blob anywhere in the asset records", () => {
    for (const a of MEDIA_ASSETS) expect(a.src ?? "").not.toContain("data:image");
  });
});

describe("register handoff mapping", () => {
  const mapping = buildMediaMapping();

  it("produces one row per launch product", () => {
    expect(mapping.rows).toHaveLength(PRODUCT_IDS.length);
    expect(new Set(mapping.rows.map((r) => r.productId)).size).toBe(PRODUCT_IDS.length);
  });

  it("uses the locked canonical product URL", () => {
    for (const r of mapping.rows) {
      expect(r.canonicalUrl).toBe(`https://botplanet.io/robots/${LAUNCH_CATEGORY}/${r.slug}/`);
      expect(r.canonicalUrl).toBe(`https://botplanet.io${productPath(r.slug)}`);
    }
  });

  it("matches the committed export, so the register cannot be filled from stale data", () => {
    const onDisk = JSON.parse(readFileSync("docs/job-09-media-mapping.json", "utf8"));
    expect(onDisk).toEqual(JSON.parse(JSON.stringify(mapping)));
  });

  it("carries rights, alt text, schema eligibility and blockers on every row", () => {
    for (const r of mapping.rows) {
      expect(r.exactModel.length).toBeGreaterThan(3);
      expect(r.rightsBasis.length).toBeGreaterThan(20);
      expect(r.altText.length).toBeGreaterThan(10);
      expect(r.structuredDataEligible).toBe(false);
      expect(r.schemaExclusionReason).toBeTruthy();
      expect(r.blockers.length).toBeGreaterThan(0);
      expect(r.withdrawalFallback).toContain("branded placeholder");
    }
  });

  it("reports the honest readiness status", () => {
    for (const r of mapping.rows) expect(r.imageReadinessStatus).toBe("public_safe_placeholder_only");
  });
});

describe("compact slots", () => {
  it("gives way to the generic silhouette rather than an illegible placeholder", () => {
    const c = readFileSync("apps/web/src/components/ProductImage.astro", "utf8");
    expect(c).toContain("compact && resolved?.isPlaceholder ? null : resolved");
  });

  it("still renders real imagery in a compact slot when it exists", () => {
    // The guard keys on isPlaceholder, not on the compact flag alone, so a
    // licensed photograph appears in a comparison column the moment one lands.
    const c = readFileSync("apps/web/src/components/ProductImage.astro", "utf8");
    expect(c).not.toMatch(/compact\s*\?\s*null/);
  });

  it("wires the homepage comparison preview through the registry", () => {
    const home = readFileSync("apps/web/src/pages/index.astro", "utf8");
    expect(home).toContain('placement="comparison"');
    expect(home).toContain("compact");
  });
});

describe("no unauthenticated media surface remains", () => {
  it("removed the public media-preview page", () => {
    expect(() => readFileSync("apps/web/src/pages/media-preview.astro", "utf8")).toThrow();
  });

  it("keeps the review surface under /admin", () => {
    const page = readFileSync("apps/web/src/pages/admin/media.astro", "utf8");
    expect(page).toContain("layouts/Admin.astro");
    // The admin layout is noindex,nofollow for every page it wraps.
    expect(readFileSync("apps/web/src/layouts/Admin.astro", "utf8")).toContain('content="noindex, nofollow"');
  });

  it("names no credential value on the review surface", () => {
    const page = readFileSync("apps/web/src/pages/admin/media.astro", "utf8");
    for (const re of CREDENTIAL_PATTERNS) expect(re.test(page)).toBe(false);
    expect(page).toContain("credentialSecretRef");
  });
});
