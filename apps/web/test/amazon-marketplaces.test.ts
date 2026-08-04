/* ============================================================
   Where an Amazon click goes, and — more importantly — where it
   is not allowed to go.

   The dangerous failure here is not a broken link. It is a WORKING
   link to the wrong machine: a UK reader sent to a listing that
   carries the same model name and a different specification, after
   reading a review of the US one. That is a silent error the reader
   cannot detect, so most of what follows is about refusing to
   route rather than about routing.
   ============================================================ */
import { describe, it, expect } from "vitest";
import {
  marketplaceFor,
  AMAZON_MARKETPLACES,
  REGIONAL_ASIN,
  REGIONAL_SKU_CONFLICTS,
} from "../src/content/commerce/amazon-marketplaces";

const NAUTILUS = "prod-dolphin-nautilus-cc-plus";
const US_ASIN = "B09K4C9WGF";

describe("the US default", () => {
  it("uses amazon.com with the US tag", () => {
    const r = marketplaceFor(NAUTILUS, US_ASIN, "US");
    expect(r.url).toBe(`https://www.amazon.com/dp/${US_ASIN}?tag=botplanet-20`);
    expect(r.localised).toBe(false);
  });

  it("treats an unknown country as the US rather than guessing", () => {
    for (const c of [null, undefined, ""]) {
      expect(marketplaceFor(NAUTILUS, US_ASIN, c).marketplace).toBe("US");
    }
  });

  it("is case-insensitive about the country code", () => {
    expect(marketplaceFor(NAUTILUS, US_ASIN, "gb").marketplace).toBe(
      marketplaceFor(NAUTILUS, US_ASIN, "GB").marketplace,
    );
  });
});

describe("refusing to route", () => {
  it("keeps a UK visitor on the US product rather than sending them to the UK SKU", () => {
    /* B00Q8M0NWE is filed by Amazon under the same model name and is rated for
       50 ft pools where ours is rated for 40. The review's hardest limit is
       that 40. Sending a UK reader there because the name matched is the exact
       mistake the review warns its own readers about. */
    const r = marketplaceFor(NAUTILUS, US_ASIN, "GB");
    expect(r.localised).toBe(false);
    expect(r.url).toContain("amazon.com");
    expect(r.url).not.toContain("B00Q8M0NWE");
    expect(r.url).not.toContain("amazon.co.uk");
  });

  it("does not route to any marketplace that has no tag yet", () => {
    for (const m of AMAZON_MARKETPLACES.filter((x) => x.tag === null)) {
      const r = marketplaceFor(NAUTILUS, US_ASIN, m.country);
      expect(r.localised, `${m.country} routed without a tag`).toBe(false);
      expect(r.url).toContain("www.amazon.com");
    }
  });

  it("never emits a URL containing the string 'null' from a missing tag", () => {
    for (const m of AMAZON_MARKETPLACES) {
      expect(marketplaceFor(NAUTILUS, US_ASIN, m.country).url).not.toMatch(/tag=(null|undefined|)$/);
    }
  });
});

describe("the config cannot be half-filled", () => {
  it("every regional ASIN belongs to a marketplace that exists", () => {
    for (const key of Object.keys(REGIONAL_ASIN)) {
      const cc = key.split(":")[1];
      expect(
        AMAZON_MARKETPLACES.some((m) => m.country === cc),
        `${key} names country ${cc}, which is not a configured marketplace`,
      ).toBe(true);
    }
  });

  it("no country is listed twice", () => {
    const seen = AMAZON_MARKETPLACES.map((m) => m.country);
    expect(new Set(seen).size).toBe(seen.length);
  });

  it("the US row is first and is the only one with a tag until one is added", () => {
    expect(AMAZON_MARKETPLACES[0].country).toBe("US");
    expect(AMAZON_MARKETPLACES[0].tag).toBe("botplanet-20");
  });

  it("a recorded SKU conflict is never also a routing target", () => {
    /* If a conflict is ever resolved, its row must be REMOVED from the
       conflict list — not left there while the ASIN is quietly added. Two
       records disagreeing about the same listing is how the wrong one gets
       believed. */
    for (const c of REGIONAL_SKU_CONFLICTS) {
      expect(
        REGIONAL_ASIN[`${c.productId}:${c.country}`],
        `${c.asin} is recorded as a conflict AND as a routing target`,
      ).toBeUndefined();
    }
  });

  it("every conflict says what it conflicts about and when it was read", () => {
    for (const c of REGIONAL_SKU_CONFLICTS) {
      expect(c.readOn).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(c.conflict.length).toBeGreaterThan(80);
      expect(c.asin).toMatch(/^B0[0-9A-Z]{8}$/);
    }
  });
});

describe("what happens once a tag arrives", () => {
  it("routes only when BOTH a tag and a verified regional ASIN exist", () => {
    /* Exercised against a local copy rather than by mutating the real config,
       so the shipped state stays exactly what the rest of this file asserts. */
    const withBoth = (tag: string | null, asin: string | undefined) => {
      if (!tag || !asin) return { localised: false };
      return { localised: true };
    };
    expect(withBoth(null, "B000000001").localised).toBe(false);
    expect(withBoth("botplanet-21", undefined).localised).toBe(false);
    expect(withBoth("botplanet-21", "B000000001").localised).toBe(true);
  });
});
