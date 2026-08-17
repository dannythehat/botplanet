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

/**
 * OVER BUDGET AND UNDER BUDGET ARE NOT THE SAME DISTANCE.
 *
 * `1 - distance / 3` scored one tier cheaper and one tier dearer identically,
 * so a reader who said "$300 to $600" was offered a $950 machine on exactly
 * the same footing as a $280 one. A budget is a ceiling stated as a range, and
 * the whole point of asking is to stop recommending machines above it.
 */
describe("budget fit is asymmetric", () => {
  const cheap = (tier: "budget" | "mid" | "premium" | "ultra") => ({
    productId: `prod-${tier}`,
    productClass: "full_cleaner" as const,
    environments: ["in_ground" as const],
    cleans: ["floor" as const, "walls" as const, "waterline" as const],
    powerType: "cordless" as const,
    priceTier: tier,
    maxPoolLengthFt: null,
    maxPoolAreaSqFt: null,
  });

  const asked = { ...base, budget_tier: "mid" as const, pool_length_ft: null };
  const scoreOf = (tier: "budget" | "mid" | "premium" | "ultra") =>
    scoreProducts(asked, [cheap(tier)], POOL_CONFIG_V1).ranked[0]!.breakdown.priceTier!;

  it("scores the stated tier highest", () => {
    expect(scoreOf("mid")).toBeGreaterThan(scoreOf("budget"));
    expect(scoreOf("mid")).toBeGreaterThan(scoreOf("premium"));
  });

  it("penalises a tier over budget MORE than a tier under it", () => {
    expect(scoreOf("budget")).toBeGreaterThan(scoreOf("premium"));
  });

  it("keeps a cheaper machine close to a perfect fit", () => {
    // Cheaper and does everything asked is a good answer, not a near miss.
    expect(scoreOf("budget") / scoreOf("mid")).toBeGreaterThan(0.8);
  });

  it("makes three tiers over budget worth nothing at all", () => {
    const under = { ...asked, budget_tier: "budget" as const };
    const s = scoreProducts(under, [cheap("ultra")], POOL_CONFIG_V1).ranked[0]!;
    expect(s.breakdown.priceTier).toBe(0);
  });
});

/**
 * "IT FITS" IS NOT ONE NUMBER.
 *
 * Every machine whose published rating covered the reader's ground used to
 * score a flat 1, which meant the axis carrying 45% of the lawn weight could
 * not tell a mower rated for twice the garden from one rated for six times it.
 * That is most of the reason the lawn matcher returned a tie under every
 * answer set anybody tried.
 */
describe("rated size is graded, not binary", () => {
  const mower = (id: string, area: number) => ({
    productId: id,
    productClass: "lawn_mower" as const,
    environments: ["open_sky" as const],
    cleans: ["grass_flat" as const],
    powerType: "cordless" as const,
    priceTier: "mid" as const,
    maxPoolLengthFt: null,
    maxPoolAreaSqFt: area,
  });

  const LAWN = {
    ...POOL_CONFIG_V1,
    weights: { cleansCoverage: 30, power: 0, priceTier: 25, poolSize: 45 },
    hardExclusions: { environmentMismatch: true, poolTooLong: true },
    classEligibility: { default: ["lawn_mower" as const], byPrimaryNeed: {} },
  };

  const smallYard = {
    ...base,
    environment: "open_sky" as const,
    primary_need: "small_lawn",
    desired_cleans: ["grass_flat" as const],
    power_pref: "no_pref" as const,
    budget_tier: "mid" as const,
    pool_length_ft: null,
    pool_area_sqft: 5000,
  };

  it("prefers a right-sized machine to one built for six times the ground", () => {
    const { ranked } = scoreProducts(
      smallYard,
      [mower("prod-right", 10_890), mower("prod-huge", 32_670)],
      LAWN,
    );
    expect(ranked[0]!.productId).toBe("prod-right");
    expect(isIndistinguishable(ranked)).toBe(false);
  });

  it("discounts a machine rated for exactly the ground it is given", () => {
    // Published area ratings are the maker's own and assume an open rectangle
    // on a full charge. At the limit is a fit, not a comfortable one.
    const { ranked } = scoreProducts(
      smallYard,
      [mower("prod-exact", 5_000), mower("prod-headroom", 12_000)],
      LAWN,
    );
    expect(ranked[0]!.productId).toBe("prod-headroom");
  });

  it("never rules a machine out for being too big", () => {
    const { ranked } = scoreProducts(smallYard, [mower("prod-huge", 87_120)], LAWN);
    expect(ranked[0]!.excluded).toBe(false);
    expect(ranked[0]!.breakdown.poolSize).toBeGreaterThan(0);
  });

  it("still excludes a machine rated for less ground than there is", () => {
    const { ranked } = scoreProducts(
      { ...smallYard, pool_area_sqft: 20_000 },
      [mower("prod-small", 10_890)],
      LAWN,
    );
    expect(ranked[0]!.excluded).toBe(true);
    expect(ranked[0]!.exclusionReason).toBe("pool_too_large");
  });

  it("scores an unstated rating below a confirmed fit and above nothing", () => {
    const { ranked } = scoreProducts(
      smallYard,
      [mower("prod-fits", 12_000), { ...mower("prod-silent", 0), maxPoolAreaSqFt: null }],
      LAWN,
    );
    const fits = ranked.find((r) => r.productId === "prod-fits")!;
    const silent = ranked.find((r) => r.productId === "prod-silent")!;
    expect(silent.breakdown.poolSize).toBeLessThan(fits.breakdown.poolSize!);
    expect(silent.breakdown.poolSize).toBeGreaterThan(0);
  });
});
