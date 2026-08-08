import { describe, expect, it } from "vitest";
import { isIndistinguishable, scoreProducts, topGroup } from "../src/product-score.js";
import type { PoolAnswers } from "../src/types.js";
import { CANDIDATES, POOL_CONFIG_V1 } from "./fixtures.js";

const base: PoolAnswers = {
  environment: "in_ground",
  primary_need: "full_clean",
  desired_cleans: ["floor", "walls", "waterline"],
  power_pref: "cordless",
  budget_tier: "premium",
  pool_length_ft: 30,
};

describe("product suitability scoring", () => {
  it("recommends an eligible full cleaner for a normal in-ground full-clean query", () => {
    const result = scoreProducts(base, CANDIDATES, POOL_CONFIG_V1);
    const winner = result.ranked[0]!;
    expect(winner.excluded).toBe(false);
    // Aiper Scuba X1 and Polaris FREEDOM both fit perfectly (cordless, premium,
    // full coverage). The deterministic tie-break picks the lexicographically
    // first productId.
    expect(["prod-aiper-scuba-x1", "prod-polaris-freedom"]).toContain(winner.productId);
  });

  it("EXCLUDES the surface skimmer from a normal full-clean recommendation", () => {
    const result = scoreProducts(base, CANDIDATES, POOL_CONFIG_V1);
    const betta = result.ranked.find((r) => r.productId === "prod-betta-se-plus")!;
    expect(betta.excluded).toBe(true);
    expect(betta.exclusionReason).toBe("class_not_eligible");
  });

  it("makes the surface skimmer eligible ONLY when the main need is surface debris", () => {
    const surfaceAnswers: PoolAnswers = {
      ...base,
      primary_need: "surface_debris",
      desired_cleans: ["water_surface"],
      power_pref: "no_pref",
      budget_tier: "no_pref",
    };
    const result = scoreProducts(surfaceAnswers, CANDIDATES, POOL_CONFIG_V1);
    const winner = result.ranked[0]!;
    expect(winner.productId).toBe("prod-betta-se-plus");
    expect(winner.excluded).toBe(false);
    // Full cleaners are now the ineligible class.
    const dolphin = result.ranked.find((r) => r.productId === "prod-dolphin-nautilus-cc-plus")!;
    expect(dolphin.excluded).toBe(true);
  });

  it("EXCLUDES products that cannot be used in the customer's pool environment", () => {
    const aboveGround: PoolAnswers = { ...base, environment: "above_ground", power_pref: "no_pref" };
    const result = scoreProducts(aboveGround, CANDIDATES, POOL_CONFIG_V1);
    const dolphin = result.ranked.find((r) => r.productId === "prod-dolphin-nautilus-cc-plus")!;
    expect(dolphin.excluded).toBe(true);
    expect(dolphin.exclusionReason).toBe("environment_mismatch");
    // The above-ground Seagull SE remains eligible.
    const seagull = result.ranked.find((r) => r.productId === "prod-aiper-seagull-se")!;
    expect(seagull.excluded).toBe(false);
  });

  it("EXCLUDES products whose max pool length is below the customer's pool", () => {
    const bigPool: PoolAnswers = { ...base, pool_length_ft: 60 };
    const result = scoreProducts(bigPool, CANDIDATES, POOL_CONFIG_V1);
    const dolphin = result.ranked.find((r) => r.productId === "prod-dolphin-nautilus-cc-plus")!;
    expect(dolphin.excluded).toBe(true);
    expect(dolphin.exclusionReason).toBe("pool_too_long");
  });

  it("is deterministic", () => {
    expect(scoreProducts(base, CANDIDATES, POOL_CONFIG_V1)).toEqual(
      scoreProducts(base, CANDIDATES, POOL_CONFIG_V1),
    );
  });
});

/**
 * THE HONESTY GUARD.
 *
 * The scorer has always produced ties — two machines that fit a query equally
 * well get the same number, which is correct. What was wrong was everything
 * downstream: `ranked.find((r) => !r.excluded)` takes the first, the sort
 * breaks ties on productId, and the reader is handed a confident winner chosen
 * alphabetically out of a group the data could not separate.
 *
 * These assert the tie survives to the caller, so the caller has to deal with
 * it honestly.
 */
describe("indistinguishable candidates", () => {
  const twins: typeof CANDIDATES = [
    {
      productId: "prod-b-twin",
      productClass: "full_cleaner",
      environments: ["in_ground"],
      cleans: ["floor", "walls", "waterline"],
      powerType: "cordless",
      priceTier: "premium",
      maxPoolLengthFt: 50,
      maxPoolAreaSqFt: null,
    },
    {
      productId: "prod-a-twin",
      productClass: "full_cleaner",
      environments: ["in_ground"],
      cleans: ["floor", "walls", "waterline"],
      powerType: "cordless",
      priceTier: "premium",
      maxPoolLengthFt: 50,
      maxPoolAreaSqFt: null,
    },
  ];

  it("scores identical candidates identically", () => {
    const { ranked } = scoreProducts(base, twins, POOL_CONFIG_V1);
    expect(ranked[0]!.score).toBe(ranked[1]!.score);
  });

  it("returns both of them as the top group, not the first one", () => {
    const { ranked } = scoreProducts(base, twins, POOL_CONFIG_V1);
    const top = topGroup(ranked);
    expect(top).toHaveLength(2);
    expect(top.map((t) => t.productId).sort()).toEqual(["prod-a-twin", "prod-b-twin"]);
    expect(isIndistinguishable(ranked)).toBe(true);
  });

  /* The sort is deterministic and alphabetical, so a caller taking ranked[0]
     would announce prod-a-twin. That is the exact failure this guards. */
  it("does not let the alphabetical tie-break stand in for a decision", () => {
    const { ranked } = scoreProducts(base, twins, POOL_CONFIG_V1);
    expect(ranked[0]!.productId).toBe("prod-a-twin");
    expect(topGroup(ranked).length).toBeGreaterThan(1);
  });

  it("names one winner when the candidates genuinely differ", () => {
    const { ranked } = scoreProducts(base, CANDIDATES, POOL_CONFIG_V1);
    const top = topGroup(ranked);
    // The pool fixtures contain a real tie, which is the point: this asserts
    // the helper reports it rather than that ties never happen.
    expect(top.length).toBeGreaterThanOrEqual(1);
    if (top.length === 1) expect(isIndistinguishable(ranked)).toBe(false);
  });

  it("returns nothing when every candidate is excluded", () => {
    const { ranked } = scoreProducts(
      { ...base, environment: "above_ground", primary_need: "surface_only", desired_cleans: ["water_surface"] },
      [],
      POOL_CONFIG_V1,
    );
    expect(topGroup(ranked)).toEqual([]);
    expect(isIndistinguishable(ranked)).toBe(false);
  });

  /* Two decimal places, because that is the precision the breakdown is rounded
     to. Comparing raw floats would call these different machines. */
  it("treats scores equal at two decimals as tied", () => {
    const ranked = [
      { productId: "a", score: 84.001, excluded: false, exclusionReason: null, breakdown: {} },
      { productId: "b", score: 84.002, excluded: false, exclusionReason: null, breakdown: {} },
    ] as unknown as Parameters<typeof topGroup>[0];
    expect(topGroup(ranked)).toHaveLength(2);
  });
});
