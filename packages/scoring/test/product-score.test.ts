import { describe, expect, it } from "vitest";
import { scoreProducts } from "../src/product-score.js";
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
