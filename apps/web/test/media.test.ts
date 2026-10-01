import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { PRODUCTS, PRODUCT_ID } from "../src/content/products";
import { VERIFICATIONS } from "../src/content/evidence/verification";
import { MEDIA_ASSETS, ORIGINAL_ASSETS, PLACEHOLDER_ASSETS, DERIVATIVES } from "../src/content/media/assets";
import { KIND_RANK, PRODUCT_DEPICTING_TYPES, type MediaAssetRecord } from "../src/content/media/types";
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

/**
 * Products that carry owner-created BotPlanet artwork. These behave differently
 * from the rest and the difference is the point: a product with artwork renders
 * the artwork, not the placeholder, and counts as hero-ready.
 *
 * The list is derived, not typed out, so supplying a sixth creative updates
 * every assertion below instead of turning one of them red.
 */
const ARTWORK_PRODUCT_IDS = new Set(
  MEDIA_ASSETS.filter((a) => a.type === "product_hero" && a.productId).map((a) => a.productId!),
);
const PLACEHOLDER_ONLY_IDS = PRODUCT_IDS.filter((id) => !ARTWORK_PRODUCT_IDS.has(id));

describe("asset record integrity", () => {
  it("passes validation with no errors", () => {
    expect(REPORT.issues.filter((i) => i.severity === "error")).toEqual([]);
  });
it("flags a duplicate asset ID", () => {
    const dup = [...MEDIA_ASSETS, { ...MEDIA_ASSETS[0] }];
    expect(validateMedia(dup).some((i) => i.rule === "asset_id_unique")).toBe(true);
  });

  it("flags an asset pointing at a product that does not exist", () => {
    const bad: MediaAssetRecord = { ...PLACEHOLDER_ASSETS[0], id: "x-orphan", productId: "prod-nope" };
    expect(validateMedia([...MEDIA_ASSETS, bad]).some((i) => i.rule === "valid_product_id")).toBe(true);
  });
});

describe("exact model identity", () => {
  it("names the Job 8 verified model on every product-depicting asset", () => {
    for (const a of MEDIA_ASSETS) {
      if (!PRODUCT_DEPICTING_TYPES.includes(a.type)) continue;
      /* A verification record is still the STRONGEST source and is still
         required where one exists. Window products are verified through
         reviews.ts rather than the pool ledger, so where there is no record
         the assertion becomes "names a model at all" — which is what stops
         the null that shipped in the first window alt text. */
      const verified = VERIFICATIONS.find((v) => v.productId === a.productId);
      if (verified) expect(a.exactModel).toBe(verified.identity.canonicalName);
      else expect(a.exactModel, `${a.id} depicts a product and names no model`).toBeTruthy();
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
    // This slot held the Dolphin Premier until 3 August 2026. The record now
    // holds a BuBlue; the point of the test is unchanged — every placeholder
    // names exactly one machine, and no two name the same one.
    expect(names).toContain("BuBlue Bubot 800P Gen2");
    expect(names).not.toContain("Dolphin Premier");
    expect(new Set(names).size).toBe(names.length);
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

  /* The two tests below exist because the suite once passed green while two
     registered files were absent from disk entirely. The registry named them,
     recorded their dimensions and recorded a checksum for bytes that were not
     there, and nothing noticed — the checksum checks above only covered
     placeholders and the Open Graph card. A registry that describes a file it
     cannot produce is worse than no registry: it reports confidence it has not
     earned, and the failure only appears as a broken image in production. */
  it("can produce every local file the registry names, byte for byte", () => {
    const missing: string[] = [];
    const wrong: string[] = [];

    for (const a of MEDIA_ASSETS) {
      if (!a.src?.startsWith("/")) continue; // component-rendered or remote
      let bytes: Buffer;
      try {
        bytes = readFileSync(`apps/web/public${a.src}`);
      } catch {
        missing.push(`${a.id} → ${a.src}`);
        continue;
      }
      if (!a.checksum) continue;
      const actual = `sha256:${createHash("sha256").update(bytes).digest("hex")}`;
      if (actual !== a.checksum) wrong.push(`${a.id} → ${a.src}`);
    }

    expect({ missing, wrong }).toEqual({ missing: [], wrong: [] });
  });

  it("can produce every derivative the srcset will offer", () => {
    const missing = DERIVATIVES.filter((d) => {
      try {
        readFileSync(`apps/web/public${d.src}`);
        return false;
      } catch {
        return true;
      }
    }).map((d) => d.src);

    // A srcset entry with no file behind it is a 404 the browser picks on its
    // own, at whichever viewport width happens to select it.
    expect(missing).toEqual([]);
  });
});

describe("responsive derivatives", () => {
  it("generates no raster copies of vector artwork", () => {
    // Derivatives exist now — the table was empty until 3 August 2026, which is
    // why every picture was served at its authored size and the pool page
    // shipped roughly 2.5 MB of images. What must NOT happen is raster copies
    // of an SVG: one vector file already serves every width.
    const byId = new Map(MEDIA_ASSETS.map((a) => [a.id, a]));
    for (const d of DERIVATIVES) {
      const parent = byId.get(d.parentAssetId)!;
      expect(parent, `${d.id} has no parent asset`).toBeTruthy();
      expect(parent.src!.endsWith(".svg")).toBe(false);
    }
    for (const a of PLACEHOLDER_ASSETS) expect(a.src!.endsWith(".svg")).toBe(true);
  });

  it("never offers a width the source file does not contain", () => {
    // Upscaling in a srcset is a promise of detail that is not in the bytes.
    const byId = new Map(MEDIA_ASSETS.map((a) => [a.id, a]));
    for (const d of DERIVATIVES) {
      const parent = byId.get(d.parentAssetId)!;
      if (parent.width) expect(d.width).toBeLessThan(parent.width);
    }
  });

  it("counts a vector asset as variant-ready, because it scales without one", () => {
    for (const id of PLACEHOLDER_ONLY_IDS) expect(readinessFor(id).responsiveVariantsReady).toBe(true);
  });

  it("now counts the raster creatives as variant-ready, because they have derivatives", () => {
    // This asserted the opposite until 3 August 2026 — the artwork was WebP with
    // no variants, and saying it was ready would have hidden a real optimisation
    // still owed. The optimisation has now been done, so the assertion flips.
    for (const id of ARTWORK_PRODUCT_IDS) {
      expect(readinessFor(id).responsiveVariantsReady).toBe(true);
    }
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
  it("puts artwork that shows the machine into Product schema, and nothing else", () => {
    // Every image that depicts the machine is eligible. The line that holds is
    // the other one: a graphic that merely names a model is not a picture of
    // it, and Product schema would present it as one.
    for (const a of MEDIA_ASSETS) if (!a.depictsRealProduct) expect(a.schema.productImage).toBe(false);
    for (const id of PRODUCT_IDS) {
      for (const src of schemaImagesFor(id)) {
        const a = MEDIA_ASSETS.find((x) => x.src === src && x.productId === id)!;
        expect(a.depictsRealProduct).toBe(true);
      }
    }
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
describe("no signed URL escapes into a record", () => {
  it("matches no credential pattern anywhere in the asset records", () => {
    for (const a of MEDIA_ASSETS) {
      const fields = [a.src ?? "", a.altText, a.notes ?? ""].join(" ");
      for (const re of CREDENTIAL_PATTERNS) expect(re.test(fields)).toBe(false);
    }
  });

  it("detects a signed URL if one is ever introduced", () => {
    const bad: MediaAssetRecord = { ...PLACEHOLDER_ASSETS[0], id: "x-signed", altText: "https://x.test/i.jpg?X-Amz-Signature=deadbeef" };
    expect(validateMedia([...MEDIA_ASSETS, bad]).some((i) => i.rule === "no_credential_in_record")).toBe(true);
  });
});

describe("readiness states", () => {
  it("calls every product public-render safe on placeholders alone", () => {
    for (const id of PRODUCT_IDS) {
      const r = readinessFor(id);
      expect(r.exactModelConfirmed).toBe(true);
      expect(r.altTextApproved).toBe(true);
      expect(r.publicRenderingSafe).toBe(true);
    }
  });

  it("calls a product hero-ready only where owner artwork exists", () => {
    for (const id of PLACEHOLDER_ONLY_IDS) expect(readinessFor(id).heroReady).toBe(false);
    for (const id of ARTWORK_PRODUCT_IDS) expect(readinessFor(id).heroReady).toBe(true);
  });
it("lists the missing target types honestly rather than inventing records", () => {
    for (const p of REPORT.products) {
      const hasArtwork = ARTWORK_PRODUCT_IDS.has(p.productId);
      expect(p.missingTypes).toEqual(hasArtwork ? TARGET_TYPES.filter((t) => t !== "product_hero") : TARGET_TYPES);

      /* Asset count is derived, not hard-coded. It used to assert a flat 2,
         which was a stand-in for "nothing invented" — and it broke the moment
         a product legitimately gained review figures. Counting the records
         that actually exist keeps the real guarantee (every asset on the
         report is one the registry holds) without failing on real additions. */
      const held = MEDIA_ASSETS.filter((a) => a.productId === p.productId);
      expect(p.assets.length).toBe(held.length);
      expect(p.assets.length).toBeGreaterThanOrEqual(hasArtwork ? 2 : 1);
    }
  });

  it("keeps review figures out of the product hero slot", () => {
    // A review figure is an extra view. Typed as a hero it would outrank the
    // product creative in resolveImage and quietly change every card.
    const figures = MEDIA_ASSETS.filter((a) => a.id.startsWith("fig-"));
    expect(figures.length).toBeGreaterThan(0);
    for (const f of figures) expect(f.type).not.toBe("product_hero");
  });
});

describe("public integration", () => {
  it("prefers owner artwork over the placeholder, and falls back when it is pulled", () => {
    /* Not the Betta SE Plus: its real photographs deliberately outrank the BotPlanet
       artwork for it (see the ordering note in MEDIA_ASSETS), so it no longer
       resolves to an `art-` record. */
    const id = [...ARTWORK_PRODUCT_IDS].find((i) => i !== "prod-betta-se-plus")!;
    const chosen = resolveImage(id, "listing_card")!;
    expect(chosen.assetId.startsWith("art-")).toBe(true);
    expect(chosen.bleed).toBe(true);

    const pulled = MEDIA_ASSETS.map((a) =>
      a.id === chosen.assetId
        ? { ...a, withdrawal: "withdrawn" as const, withdrawalDate: "2026-08-03", withdrawalReason: "test takedown" }
        : a,
    );
    const after = resolveImage(id, "listing_card", ["product_hero", "branded_placeholder"], pulled)!;
    expect(after.assetId.startsWith("ph-")).toBe(true);
    expect(after.isPlaceholder).toBe(true);
  });

  it("emits no srcset when no derivative exists, rather than inventing widths", () => {
    for (const id of PRODUCT_IDS) expect(resolveImage(id, "listing_card")!.srcset).toEqual([]);
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

  it("reports the honest readiness status", () => {
    for (const r of mapping.rows) {
      expect(["full_set", "public_safe_placeholder_only"]).toContain(r.imageReadinessStatus);
    }
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

  it("renders no product imagery on the homepage outside the registry", () => {
    // The homepage used to carry a comparison strip of branded placeholders,
    // and this test asserted that strip existed. The rebuild removed it — ten
    // placeholder tiles read as a pool-cleaner shop rather than a robotics
    // destination, and a placeholder is not a reason to occupy the fold.
    //
    // The guarantee that actually matters survives the redesign and is what is
    // asserted now: a product image on this page must come from the registry.
    // Either it goes through ProductImage, or there is none. What must never
    // appear is a raw <img> pointing at product media, because that is the one
    // route by which an unlicensed photograph could reach the homepage without
    // passing the rights check.
    const home = readFileSync("apps/web/src/pages/index.astro", "utf8");
    const mediaSrcs = [...home.matchAll(/(?:src|srcset)="(\/media\/[^"\s]*)"/g)].map((m) => m[1]);
    // Brand artwork may appear directly — it is ours and depicts no catalogue
    // model — but only if the registry knows about it. That is the same rights
    // check ProductImage performs, applied to the one page that does not use it.
    for (const src of mediaSrcs) {
      const asset = MEDIA_ASSETS.find((a) => a.src === src);
      expect(asset, `${src} is not in the media registry`).toBeTruthy();
      expect(asset!.depictsRealProduct).toBe(false);
      expect(asset!.productId).toBeNull();
    }
    if (home.includes("placement=")) expect(home).toContain("ProductImage");
    // Every <img> on the page is either the logo or registry-cleared artwork.
    // The loop above already proved the /media/ ones are registered; this
    // catches an <img> pointing anywhere else entirely.
    for (const tag of home.match(/<img[^>]+src="([^"]+)"/g) ?? []) {
      expect(tag).toMatch(/src="(\/logo\/|\/media\/)/);
    }
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
});
