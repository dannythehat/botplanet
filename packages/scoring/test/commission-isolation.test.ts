import { describe, expect, it } from "vitest";
import { scoreProducts } from "../src/product-score.js";
import type { PoolAnswers, SuitabilityCandidate } from "../src/types.js";
import { CANDIDATES, POOL_CONFIG_V1 } from "./fixtures.js";

/**
 * These tests are the editorial-integrity guarantee: affiliate commission must
 * never influence which PRODUCT is recommended.
 */
describe("commission isolation in product scoring", () => {
  const answers: PoolAnswers = {
    environment: "in_ground",
    primary_need: "full_clean",
    desired_cleans: ["floor", "walls", "waterline"],
    power_pref: "cordless",
    budget_tier: "premium",
    pool_length_ft: 30,
  };

  it("SuitabilityCandidate exposes NO commercial fields (structural guarantee)", () => {
    // If anyone ever adds a price/commission/offer field to the suitability
    // candidate, this test fails — commission cannot reach product scoring.
    const denylist = [
      "price",
      "priceminor",
      "basepriceminor",
      "commission",
      "commissionvaluebp",
      "offer",
      "offerid",
      "affiliate",
      "affiliateprogramid",
      "retailer",
      "revenue",
      "payout",
    ];
    for (const candidate of CANDIDATES) {
      const keys = Object.keys(candidate).map((k) => k.toLowerCase());
      for (const banned of denylist) {
        expect(keys, `candidate ${candidate.productId} leaks '${banned}'`).not.toContain(banned);
      }
    }
  });

  it("scoreProducts is a pure 3-arg function (answers, candidates, config) — no offers param", () => {
    expect(scoreProducts.length).toBe(3);
  });

  it("two products identical in suitability score identically, regardless of any commercial difference", () => {
    const twinA: SuitabilityCandidate = {
      productId: "twin-a",
      productClass: "full_cleaner",
      environments: ["in_ground"],
      cleans: ["floor", "walls", "waterline"],
      powerType: "cordless",
      priceTier: "premium",
      maxPoolLengthFt: null,
    };
    const twinB: SuitabilityCandidate = { ...twinA, productId: "twin-b" };

    const result = scoreProducts(answers, [twinA, twinB], POOL_CONFIG_V1);
    const a = result.ranked.find((r) => r.productId === "twin-a")!;
    const b = result.ranked.find((r) => r.productId === "twin-b")!;
    expect(a.score).toBe(b.score);
  });

  it("product ranking is deterministic and independent of externally-varied commissions", () => {
    // Simulate 50 different commission assignments to the products. Because
    // scoreProducts takes no commission input, the product ranking must be
    // byte-identical every time.
    const baseline = scoreProducts(answers, CANDIDATES, POOL_CONFIG_V1);
    const baselineOrder = baseline.ranked.map((r) => r.productId);

    for (let i = 0; i < 50; i++) {
      // These "commissions" exist only in the test; there is no channel to feed
      // them into scoreProducts.
      const _fakeCommissions = CANDIDATES.map((c) => ({
        productId: c.productId,
        commissionValueBp: (i * 137 + c.productId.length * 31) % 2000,
      }));
      const again = scoreProducts(answers, CANDIDATES, POOL_CONFIG_V1);
      expect(again.ranked.map((r) => r.productId)).toEqual(baselineOrder);
      expect(again).toEqual(baseline);
    }
  });
});
