/**
 * BOTMATCH MUST NOT NAME A WINNER IT CANNOT JUSTIFY.
 *
 * The scorer produces ties, correctly: two machines that fit a query equally
 * well get the same number. Everything downstream used to hide that. The API
 * took `ranked.find((r) => !r.excluded)`, the sort breaks ties on productId,
 * and the reader was handed a confident recommendation chosen alphabetically
 * from a group the recorded data could not separate.
 *
 * It is not theoretical. The first four self-cleaning litter boxes went in on
 * 8 August 2026 with identical `environments` and `cleans` on three of them —
 * the attributes that would separate them (capacity, litter type, cat weight
 * limits) are not recorded yet — and every answer combination returned Casa
 * Leo, which is simply first alphabetically among the tied three.
 *
 * These tests are site-wide on purpose. They read the API source rather than
 * one category's behaviour, because the failure is a selection rule and a
 * selection rule is shared by every matcher the site will ever have.
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { isIndistinguishable, scoreProducts, topGroup } from "@botplanet/scoring";
import { tieExplanation } from "../src/pages/api/botmatch";
import type { PoolAnswers, SuitabilityCandidate } from "@botplanet/scoring";

const API = readFileSync(
  fileURLToPath(new URL("../src/pages/api/botmatch.ts", import.meta.url)),
  "utf8",
);
const RESULT_PAGE = readFileSync(
  fileURLToPath(new URL("../src/pages/recommendation/[token].astro", import.meta.url)),
  "utf8",
);

describe("the matcher cannot return a sole winner from a tie", () => {
  it("chooses through topGroup rather than the first non-excluded row", () => {
    expect(API).toContain("topGroup(result.ranked)");
    /* Scoped to the code rather than the file: the comment above the fix
       quotes the old line on purpose, and a whole-file match would trip on it. */
    const code = API.split("\n").filter((l) => !l.trimStart().startsWith("*") && !l.trimStart().startsWith("/*")).join("\n");
    expect(
      code,
      "the API is taking the first non-excluded product again — that is the alphabetical winner bug",
    ).not.toMatch(/ranked\.find\(\s*\(\s*r\s*\)\s*=>\s*!r\.excluded\s*\)/);
  });

  it("returns no winner when the top group has more than one member", () => {
    expect(API).toMatch(/const tied = top\.length > 1;/);
    expect(API).toMatch(/const winner = tied \? null : \(top\[0\] \?\? null\);/);
  });

  /**
   * The dangerous fix is a secondary sort. Price, freshness or — worst —
   * commission would each turn a tie back into a winner and none of them is
   * evidence the reader asked about.
   */
  it("breaks a product tie on nothing at all", () => {
    const selection = API.slice(API.indexOf("const top = topGroup"), API.indexOf("// Offer ranking"));
    for (const forbidden of ["commission", "sort(", "basePriceMinor", "freshness"]) {
      expect(
        selection.toLowerCase(),
        `the tie is being broken on ${forbidden} — a tie is an answer, not a problem to route around`,
      ).not.toContain(forbidden.toLowerCase());
    }
  });

  it("records no chosen product when there is no choice", () => {
    expect(API).toContain("chosenProductId: winner?.productId ?? null");
    expect(API).toMatch(/equivalent: top\.map/);
  });

  it("shows the group on the result page instead of falling through to no-match", () => {
    expect(RESULT_PAGE).toMatch(/equivalent\.length > 1 \?/);
    expect(RESULT_PAGE).toContain("Equivalent on current data");
    /* The old page linked every product under the pool category. A litter box
       result would have pointed at /robots/robotic-pool-cleaners/. */
    expect(RESULT_PAGE).not.toMatch(/`\/robots\/\$\{catSlug\}\/\$\{p\.slug\}\/`/);
  });
});

/**
 * The behaviour the source checks above are protecting, exercised end to end
 * through the scorer with a config shaped like the ones in D1.
 */
describe("a category whose products share attributes ties rather than ranks", () => {
  const CONFIG = {
    version: 1,
    weights: { cleansCoverage: 40, power: 20, priceTier: 20, poolSize: 20 },
    hardExclusions: { environmentMismatch: true, poolTooLong: true },
    classEligibility: {
      default: ["litter_box"],
      byPrimaryNeed: { single_cat: ["litter_box"], two_cats: ["litter_box"], many_cats: ["litter_box"] },
    },
    tiebreakTolerances: { totalPricePctWithin: 1, deliveryDaysWithin: 1, requireSameWarrantyBand: true },
  } as unknown as Parameters<typeof scoreProducts>[2];

  /* The three litter boxes that went in indistinguishable, with the fourth
     that genuinely differs. */
  const LITTER: SuitabilityCandidate[] = [
    ["prod-litter-robot-4", ["odor_sealing", "multi_cat_capacity", "health_monitoring", "app_control"], "premium"],
    ["prod-petkit-purobot-max-pro-2", ["odor_sealing", "multi_cat_capacity", "health_monitoring", "app_control"], "premium"],
    ["prod-casa-leo-loo-too", ["odor_sealing", "multi_cat_capacity", "health_monitoring", "app_control"], "premium"],
    ["prod-petsafe-scoopfree-crystal-pro", ["odor_sealing"], "mid"],
  ].map(([productId, cleans, priceTier]) => ({
    productId: productId as string,
    productClass: "litter_box",
    environments: ["average_cat", "large_cat"],
    cleans: cleans as string[],
    powerType: "mains",
    priceTier: priceTier as SuitabilityCandidate["priceTier"],
    maxPoolLengthFt: null,
    maxPoolAreaSqFt: null,
  })) as SuitabilityCandidate[];

  const answers = {
    environment: "average_cat",
    primary_need: "two_cats",
    desired_cleans: ["odor_sealing", "multi_cat_capacity"],
    power_pref: "no_pref",
    budget_tier: "premium",
    pool_length_ft: null,
  } as unknown as PoolAnswers;

  it("reports the three identical boxes as one equivalent group", () => {
    const { ranked } = scoreProducts(answers, LITTER, CONFIG);
    const top = topGroup(ranked);
    expect(isIndistinguishable(ranked)).toBe(true);
    expect(top.map((t) => t.productId).sort()).toEqual([
      "prod-casa-leo-loo-too",
      "prod-litter-robot-4",
      "prod-petkit-purobot-max-pro-2",
    ]);
  });

  /* Casa Leo is first alphabetically among the tied three and was the answer to
     every question combination before this. Naming it is the bug. */
  it("does not resolve to Casa Leo, which is only first by name", () => {
    const { ranked } = scoreProducts(answers, LITTER, CONFIG);
    expect(topGroup(ranked).length).toBeGreaterThan(1);
    expect(ranked[0]!.productId).toBe("prod-casa-leo-loo-too");
  });
});

/**
 * A TIE HAS TWO CAUSES AND ONLY ONE OF THEM IS OUR FAULT.
 *
 * Every tie was explained the same way until 10 August 2026 — "we do not yet
 * hold the attributes that would separate them" — and for the most common tie
 * on this site that is not modesty, it is wrong. A sweep of all 480 window
 * answer sets found the worst tie, eleven of eleven, comes from a reader who
 * answered "not sure" on power and "show me the range" on budget. They ruled
 * nothing out, and the whole shelf tying is the correct reply to that.
 */
describe("a tie says whose fault it is", () => {
  it("tells a reader who ruled nothing out that they ruled nothing out", () => {
    const text = tieExplanation(11, 11);
    expect(text).toMatch(/whole range|open on/i);
    expect(text).not.toMatch(/do not yet hold/i);
    // And it says what to do about it, which is the point.
    expect(text).toMatch(/budget|narrow|cut this down/i);
  });

  it("still blames our data when we narrowed the field and ran out", () => {
    const text = tieExplanation(3, 11);
    expect(text).toMatch(/do not yet hold/i);
    expect(text).not.toMatch(/whole range/i);
  });

  /* The boundary is "everything eligible tied", not "everything published" —
     a category where half the shelf is ruled out by a hard exclusion and the
     survivors all tie is still a whole-range answer for that reader. */
  it("treats a tie among every SURVIVING machine as the whole range", () => {
    expect(tieExplanation(4, 4)).toMatch(/whole range|open on/i);
  });
});
