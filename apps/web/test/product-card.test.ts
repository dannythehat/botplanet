/**
 * WHAT A PRODUCT CARD IS ALLOWED TO SHOW.
 *
 * Both assertions come from the per-page audit of 13 August 2026, which read
 * the pool hub and three of its reviews live. Both defects had been on the
 * flagship hub for days and neither was visible to any existing test, because
 * every test here reads structured records and these are rendering rules.
 */
import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { MEDIA_ASSETS } from "../src/content/media/assets";
import { REVIEWS } from "../src/content/reviews";
import { MERGED_REVIEWS, RETIRED_SLUGS } from "../src/content/product-names";

const CARD = readFileSync(
  fileURLToPath(new URL("../src/components/ProductCard.astro", import.meta.url)),
  "utf8",
);

describe("DEFECT B1-2 — a card never shows a bare dash", () => {
  /**
   * A product with no printable price rendered "—". Every blank card on the
   * companion hub and the Aiper Scuba S1 card on the pool hub were this one
   * line. The absence is usually DELIBERATE — the S1's only Amazon listing
   * fails the identity register, so it is held unpriced on purpose — and a
   * dash rendered that decision as a fault.
   */
  it("falls back to a sentence, not a dash", () => {
    const markup = CARD.split("<style>")[0];
    expect(markup).toContain('{price ?? "Check current price"}');
    expect(markup, "the em-dash fallback is back").not.toMatch(/price\s*\?\?\s*["']—["']/);
  });

  /** Two states, no third. Anything else is a figure nobody dated. */
  it("offers exactly two price states", () => {
    const foot = CARD.slice(CARD.indexOf('class="pcard__foot"'), CARD.indexOf("</style>"));
    const fallbacks = [...foot.matchAll(/price\s*\?\?\s*"([^"]*)"/g)].map((m) => m[1]);
    expect(fallbacks).toEqual(["Check current price"]);
  });
});

describe("DEFECT B1-1 — card art belongs to the product it sits on", () => {
  /**
   * The audit found the Bubot 800P's card art at a path named
   * `dolphin-premier.webp` and asked whether the wrong art renders or a
   * misnamed file slipped the registry.
   *
   * IT IS THE SECOND, AND IT IS DELIBERATE — WHICH IS WHY THIS TEST IS SHAPED
   * THE WAY IT IS. Card art resolves by PRODUCT ID, never by filename, and
   * this product's stable ID is still `prod-dolphin-premier`: the record
   * changed manufacturer on 8 August 2026 and kept its key, because the key is
   * what the offers, the click log and the evidence hang off. The file follows
   * the ID, as every file here does, and the artwork itself depicts the BuBlue
   * correctly — its own scene description names the BuBlue app.
   *
   * So the rule is not "the filename matches the product slug", which would
   * fail on a correct record and force a rename that breaks nothing but the
   * key everything else points at. The rule is that a file named for a RETIRED
   * slug must be declared as such in product-names.ts, so a reader who trips
   * over the name finds the explanation instead of filing a bug — which is
   * exactly what happened here.
   */
  it("declares every asset whose filename is a retired product slug", () => {
    const live = new Set(Object.values(REVIEWS).map((r) => r.slug));
    const declared = new Set([...Object.keys(MERGED_REVIEWS), ...Object.keys(RETIRED_SLUGS)]);

    const undeclared = MEDIA_ASSETS.filter((a) => {
      const slug = (a as { slug?: string }).slug;
      if (!slug) return false;
      return !live.has(slug) && !declared.has(slug);
    }).map((a) => (a as { slug: string }).slug);

    expect(
      [...new Set(undeclared)],
      "an asset is filed under a slug that is neither a live product nor a declared rename",
    ).toEqual([]);
  });

  /** And the rename itself has to point somewhere real. */
  it("points every retired slug at a product that exists", () => {
    const live = new Set(Object.values(REVIEWS).map((r) => r.slug));
    for (const [from, rec] of Object.entries(MERGED_REVIEWS)) {
      expect(live.has(rec.into), `${from} merges into ${rec.into}, which is not a live product`).toBe(true);
    }
  });
});
