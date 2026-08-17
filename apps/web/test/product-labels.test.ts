import { describe, expect, it } from "vitest";
import { describeProduct, percentile, priceBand } from "../src/lib/product-labels";

/** The live catalogue's current minimum offer prices, in minor units. */
const CATALOGUE = [15000, 38900, 41900, 49800, 52900, 69900, 129900, 129900, 139900, 249900];

describe("priceBand — the only comparative statement allowed", () => {
  it("marks only the top decile as upper", () => {
    expect(priceBand(249900, CATALOGUE)).toBe("upper");
    expect(priceBand(139900, CATALOGUE)).toBeNull();
    expect(priceBand(129900, CATALOGUE)).toBeNull();
  });

  it("marks only the bottom decile as lower", () => {
    expect(priceBand(15000, CATALOGUE)).toBe("lower");
    expect(priceBand(38900, CATALOGUE)).toBeNull();
  });

  it("says nothing when the product has no current price", () => {
    expect(priceBand(null, CATALOGUE)).toBeNull();
  });

  it("says nothing when the catalogue is too small to position against", () => {
    expect(priceBand(100, [100, 200, 300])).toBeNull();
  });

  it("ignores missing and invalid prices in the sample", () => {
    expect(priceBand(15000, [...CATALOGUE, NaN, 0, -5])).toBe("lower");
  });
});

describe("percentile", () => {
  it("interpolates between values", () => {
    expect(percentile([0, 10], 0.5)).toBe(5);
    expect(percentile([1, 2, 3, 4], 0)).toBe(1);
    expect(percentile([1, 2, 3, 4], 1)).toBe(4);
  });
});

describe("describeProduct — the four featured models, from stored fields", () => {
  it("Aiper Seagull SE: cordless, above-ground, bottom of the range", () => {
    const d = describeProduct(
      { powerType: "cordless", environments: ["above_ground"], priceMinor: 15000 },
      CATALOGUE,
    );
    expect(d.label).toBe("Cordless entry option");
    expect(d.explanation).toBe("A compact cordless model listed for above-ground pools.");
    expect(d.usesPriceData).toBe(true);
  });

  it("Dolphin Nautilus CC Plus: corded, in-ground, no price claim", () => {
    const d = describeProduct(
      { powerType: "corded", environments: ["in_ground"], priceMinor: 69900 },
      CATALOGUE,
    );
    expect(d.label).toBe("Corded in-ground option");
    expect(d.explanation).toBe("A mains-powered model listed for in-ground pools.");
    expect(d.usesPriceData).toBe(false);
    // Must not imply a performance outcome we cannot support.
    expect(d.explanation).not.toMatch(/cycle|longer|faster|better/i);
  });

  it("Aiper Scuba X1: cordless, in-ground, not the top decile", () => {
    const d = describeProduct(
      { powerType: "cordless", environments: ["in_ground"], priceMinor: 129900 },
      CATALOGUE,
    );
    expect(d.label).toBe("Cordless in-ground option");
    expect(d.explanation).toBe("A cordless model listed for in-ground pool cleaning.");
    expect(d.usesPriceData).toBe(false);
  });

  it("Beatbot AquaSense 2 Ultra: cordless, top decile, price observation computed", () => {
    const d = describeProduct(
      { powerType: "cordless", environments: ["in_ground"], priceMinor: 249900 },
      CATALOGUE,
    );
    expect(d.label).toBe("Premium-priced cordless option");
    expect(d.explanation).toBe(
      "A cordless model positioned at the upper end of the current catalogue price range.",
    );
    expect(d.usesPriceData).toBe(true);
  });

  it("falls back to a plain classification when price data disappears", () => {
    const d = describeProduct(
      { powerType: "cordless", environments: ["in_ground"], priceMinor: null },
      CATALOGUE,
    );
    expect(d.label).toBe("Cordless in-ground option");
    expect(d.usesPriceData).toBe(false);
  });

  it("falls back fully when neither price nor environment is recorded", () => {
    const d = describeProduct({ powerType: "cordless", environments: [], priceMinor: null }, CATALOGUE);
    expect(d.label).toBe("Cordless pool-cleaning option");
    expect(d.explanation).toBe("A cordless model with the capabilities recorded in its product profile.");
  });
});

describe("claims that must never be generated", () => {
  const cases = [
    { powerType: "cordless", environments: ["above_ground"], priceMinor: 15000 },
    { powerType: "corded", environments: ["in_ground"], priceMinor: 69900 },
    { powerType: "cordless", environments: ["in_ground"], priceMinor: 249900 },
    { powerType: "solar", environments: ["above_ground", "in_ground"], priceMinor: 38900 },
    { powerType: "cordless", environments: [], priceMinor: null },
  ];

  it("never claims a feature count, a ranking or a test result", () => {
    for (const c of cases) {
      const { label, explanation } = describeProduct(c, CATALOGUE);
      const text = `${label} ${explanation}`;
      expect(text).not.toMatch(/most features|best|top-rated|highest|lowest|cheapest|most expensive/i);
      expect(text).not.toMatch(/we tested|tested by|rated|score|stars/i);
      expect(text).not.toMatch(/higher-spec|longer cycles/i);
    }
  });

  it("only mentions price when the band was actually computed", () => {
    for (const c of cases) {
      const d = describeProduct(c, CATALOGUE);
      const mentionsPrice = /price|entry|premium/i.test(`${d.label} ${d.explanation}`);
      expect(mentionsPrice).toBe(d.usesPriceData);
    }
  });
});
