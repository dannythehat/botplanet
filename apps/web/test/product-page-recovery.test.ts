/**
 * PRODUCT PAGE RECOVERY CONTRACT — 17 AUGUST 2026.
 *
 * Product pages share one renderer. These checks protect the two failures that
 * made dozens of routes look unfinished: an empty visual header and pool-only
 * copy on products from every other category.
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const PAGE = readFileSync(
  fileURLToPath(new URL("../src/pages/robots/[category]/[slug].astro", import.meta.url)),
  "utf8",
);

const READER_COPY = PAGE
  .replace(/<style>[\s\S]*?<\/style>/g, "")
  .replace(/\{\/\*[\s\S]*?\*\/\}/g, "")
  .replace(/\/\*[\s\S]*?\*\//g, "");

describe("the shared product page never renders as an unfinished shell", () => {
  it("gives reviews missing dedicated artwork the best safe registry image", () => {
    expect(PAGE).toContain('resolveImage(product.id, "product_page")');
    expect(PAGE).toContain("const displayImage = review?.image ??");
    expect(PAGE).toContain("const displayReview = review ? { ...review, image: displayImage } : null");
    expect(PAGE).toContain("review={displayReview!}");
  });

  it("keeps display-only placeholder fallback out of Product review schema", () => {
    expect(PAGE).toContain("image: review!.image?.src");
    expect(PAGE).not.toContain("image: displayImage?.src");
  });

  it("gives every plain product page an image-led, centred hero", () => {
    expect(PAGE).toContain("<ProductImage");
    expect(PAGE).toContain('placement="product_page"');
    expect(PAGE).toContain('class="plain-product__image"');
    expect(PAGE).toContain("max-width: 1280px;");
    expect(PAGE).toContain("margin: 0 auto;");
    expect(PAGE).toContain("@media (max-width: 620px)");
  });

  it("uses the right category journey instead of pool-only copy", () => {
    expect(PAGE).toContain("categoryCanMatch(category!) ? journeyFor(category!) : null");
    expect(PAGE).toContain("href={productJourney.href}");
    expect(PAGE).toContain("{productJourney.ctaLabel}");
    expect(READER_COPY).not.toMatch(/is this right for my pool|find my pool cleaner|pool-specific questions/i);
  });

  it("ships a canonical path and a usable social image on both page modes", () => {
    expect(PAGE).toContain("path={Astro.url.pathname}");
    expect(PAGE).toContain("ogImage={hasReview ? displayImage?.src : resolvedProductImage?.src}");
  });
});
