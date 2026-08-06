/**
 * Companion robots and pet camera robots — the matcher, proven before the
 * products arrive.
 *
 * WHY THIS EXISTS. Both categories were built ahead of their catalogues, so
 * their funnels currently score an empty candidate list and recommend nothing.
 * That is the intended state, and it is also the state in which a broken
 * scoring config looks exactly like a correct one: no products, no winner, no
 * complaint. The window matcher spent a day in precisely that condition — the
 * config excluded all eleven robots as class_not_eligible and returned nothing,
 * silently, because the funnel is built to survive a scoring failure.
 *
 * So the configs are exercised here against synthetic candidates that stand in
 * for the real products named in
 * docs/seo/companion-robots-research-findings.md. When the catalogue is
 * seeded, the only thing that changes is that the candidates become real. If
 * these pass, plugging products in is a data job rather than a debugging job.
 *
 * The fixtures below MIRROR the seed rows sc-companion-v1 and sc-petcam-v1 in
 * packages/db/seed/pool/botmatch.ts. If a weight or an exclusion changes there,
 * it has to change here, and that duplication is deliberate: a test that reads
 * the same object it is testing proves nothing.
 */
import { describe, expect, it } from "vitest";
import { scoreProducts } from "../src/product-score.js";
import type { PoolAnswers, ScoringConfig, SuitabilityCandidate } from "../src/types.js";

/** Mirrors the seed scoring config sc-companion-v1. */
const COMPANION_CONFIG_V1: ScoringConfig = {
  version: 1,
  weights: { cleansCoverage: 60, power: 0, priceTier: 40, poolSize: 0 },
  /* environmentMismatch OFF on purpose — nothing about a room stops a robot
     pet working, and inventing an axis to fill the field would exclude
     candidates on a distinction that does not exist. */
  hardExclusions: { environmentMismatch: false, poolTooLong: false },
  classEligibility: {
    default: ["companion_robot"],
    byPrimaryNeed: {
      adult_company: ["companion_robot"],
      child: ["companion_robot"],
      older_adult: ["companion_robot"],
      household: ["companion_robot"],
    },
  },
  tiebreakTolerances: {
    totalPricePctWithin: 1,
    deliveryDaysWithin: 1,
    requireSameWarrantyBand: true,
  },
};

/** Mirrors the seed scoring config sc-petcam-v1. */
const PET_CAMERA_CONFIG_V1: ScoringConfig = {
  version: 1,
  weights: { cleansCoverage: 55, power: 0, priceTier: 45, poolSize: 0 },
  /* ON, and it is the whole point of this config: every roaming pet camera on
     the US market is wheeled and none of them climbs stairs. */
  hardExclusions: { environmentMismatch: true, poolTooLong: false },
  classEligibility: {
    default: ["pet_camera_robot"],
    byPrimaryNeed: {
      watch_dog: ["pet_camera_robot"],
      watch_cat: ["pet_camera_robot"],
      interact: ["pet_camera_robot"],
      watch_home: ["pet_camera_robot"],
    },
  },
  tiebreakTolerances: {
    totalPricePctWithin: 1,
    deliveryDaysWithin: 1,
    requireSameWarrantyBand: true,
  },
};

/* Stand-ins for the products the research named. Nothing here asserts a price
   or a specification — these exist to exercise the class gate and the
   capability weighting, not to describe a real machine. */
const DESK_COMPANION: SuitabilityCandidate = {
  productId: "prod-desk-companion",
  productClass: "companion_robot",
  environments: [],
  cleans: ["companionship", "conversation"],
  powerType: "corded",
  priceTier: "mid",
  maxPoolLengthFt: null,
  maxPoolAreaSqFt: null,
};

const FLOOR_COMPANION: SuitabilityCandidate = {
  productId: "prod-floor-companion",
  productClass: "companion_robot",
  environments: [],
  cleans: ["companionship", "play_interaction"],
  powerType: "cordless",
  priceTier: "premium",
  maxPoolLengthFt: null,
  maxPoolAreaSqFt: null,
};

const KIDS_COMPANION: SuitabilityCandidate = {
  productId: "prod-kids-companion",
  productClass: "companion_robot",
  environments: [],
  cleans: ["play_interaction", "learning_content"],
  powerType: "cordless",
  priceTier: "mid",
  maxPoolLengthFt: null,
  maxPoolAreaSqFt: null,
};

/** Single-storey only, like every wheeled pet camera actually sold. */
const PET_CAMERA: SuitabilityCandidate = {
  productId: "prod-pet-camera",
  productClass: "pet_camera_robot",
  environments: ["single_storey"],
  cleans: ["remote_video", "two_way_audio", "roams_home"],
  powerType: "cordless",
  priceTier: "mid",
  maxPoolLengthFt: null,
  maxPoolAreaSqFt: null,
};

const PET_CAMERA_WITH_TREATS: SuitabilityCandidate = {
  productId: "prod-pet-camera-treats",
  productClass: "pet_camera_robot",
  environments: ["single_storey"],
  cleans: ["remote_video", "two_way_audio", "treat_dispensing", "roams_home"],
  powerType: "cordless",
  priceTier: "premium",
  maxPoolLengthFt: null,
  maxPoolAreaSqFt: null,
};

/* A pool robot, present only to prove it can never win either recommendation. */
const POOL_ROBOT: SuitabilityCandidate = {
  productId: "prod-pool-intruder",
  productClass: "full_cleaner",
  environments: ["in_ground"],
  cleans: ["floor", "walls", "waterline"],
  powerType: "cordless",
  priceTier: "budget",
  maxPoolLengthFt: 50,
  maxPoolAreaSqFt: null,
};

const ALL = [
  DESK_COMPANION,
  FLOOR_COMPANION,
  KIDS_COMPANION,
  PET_CAMERA,
  PET_CAMERA_WITH_TREATS,
  POOL_ROBOT,
];

/* The answers a real reader produces. Field names are the engine's, which are
   still pool-shaped — pool_area_sqft and pool_length_ft are nulled by
   MATCHER_DEFAULTS for both categories because neither asks about size. */
const adultCompanyAnswers: PoolAnswers = {
  /* No environment key at all — companion robots have no environment axis and
     the config's environment exclusion is off. This is the real shape of a
     companion answer set, not a simplification for the test. */
  primary_need: "adult_company",
  desired_cleans: ["companionship", "conversation"],
  power_pref: "no_pref",
  budget_tier: "mid",
  pool_length_ft: null,
  pool_area_sqft: null,
};

const watchDogAnswers: PoolAnswers = {
  environment: "single_storey",
  primary_need: "watch_dog",
  desired_cleans: ["remote_video", "roams_home"],
  power_pref: "no_pref",
  budget_tier: "mid",
  pool_length_ft: null,
  pool_area_sqft: null,
};

describe("companion robot matcher", () => {
  it("recommends a companion robot for someone wanting company at a desk", () => {
    const result = scoreProducts(adultCompanyAnswers, ALL, COMPANION_CONFIG_V1);
    const winner = result.ranked.find((r) => !r.excluded)!;
    expect(winner).toBeDefined();
    expect(winner.productId).toBe("prod-desk-companion");
  });

  it("EXCLUDES a pet camera robot from a companion recommendation", () => {
    /* The ruling that the two categories are separate, enforced at runtime.
       These share a shelf in a reader's head and they must not share a
       recommendation: a roaming camera has no personality and must never win
       a "keep me company" query because it happens to be cheaper. */
    const result = scoreProducts(adultCompanyAnswers, ALL, COMPANION_CONFIG_V1);
    const cam = result.ranked.find((r) => r.productId === "prod-pet-camera")!;
    expect(cam.excluded).toBe(true);
    expect(cam.exclusionReason).toBe("class_not_eligible");
  });

  it("EXCLUDES another category's robot entirely", () => {
    const result = scoreProducts(adultCompanyAnswers, ALL, COMPANION_CONFIG_V1);
    const pool = result.ranked.find((r) => r.productId === "prod-pool-intruder")!;
    expect(pool.excluded).toBe(true);
    expect(pool.exclusionReason).toBe("class_not_eligible");
  });

  it("prefers the machine whose capabilities match what was asked for", () => {
    /* Someone choosing for a child asks for play and learning content. The
       kids machine should beat the desk one, which offers neither, even though
       both are companion_robot and both are mid-priced. */
    const childAnswers: PoolAnswers = {
      ...adultCompanyAnswers,
      primary_need: "child",
      desired_cleans: ["play_interaction", "learning_content"],
    };
    const result = scoreProducts(childAnswers, ALL, COMPANION_CONFIG_V1);
    const kids = result.ranked.find((r) => r.productId === "prod-kids-companion")!;
    const desk = result.ranked.find((r) => r.productId === "prod-desk-companion")!;
    expect(kids.excluded).toBe(false);
    expect(kids.score).toBeGreaterThan(desk.score);
  });

  it("never excludes a companion robot on environment, because it has no environment axis", () => {
    /* The config turns environmentMismatch off. Every companion candidate
       carries an empty environments list, which under an ON exclusion would
       wipe out the entire catalogue — silently, and looking exactly like an
       empty catalogue. This is the test that would have caught that. */
    const result = scoreProducts(adultCompanyAnswers, ALL, COMPANION_CONFIG_V1);
    const companions = result.ranked.filter((r) => r.productId.includes("companion"));
    expect(companions.length).toBeGreaterThan(0);
    for (const c of companions) {
      expect(c.exclusionReason).not.toBe("environment_mismatch");
    }
  });
});

describe("pet camera robot matcher", () => {
  it("recommends a pet camera robot for someone wanting to check on a dog", () => {
    const result = scoreProducts(watchDogAnswers, ALL, PET_CAMERA_CONFIG_V1);
    const winner = result.ranked.find((r) => !r.excluded)!;
    expect(winner).toBeDefined();
    expect(["prod-pet-camera", "prod-pet-camera-treats"]).toContain(winner.productId);
  });

  it("EXCLUDES a companion robot from a pet camera recommendation", () => {
    const result = scoreProducts(watchDogAnswers, ALL, PET_CAMERA_CONFIG_V1);
    const desk = result.ranked.find((r) => r.productId === "prod-desk-companion")!;
    expect(desk.excluded).toBe(true);
    expect(desk.exclusionReason).toBe("class_not_eligible");
  });

  it("EXCLUDES every wheeled robot when the customer has stairs", () => {
    /* The category's one hard exclusion, and the reason the stairs question is
       asked second. No pet camera robot on the market climbs, so a household
       whose pet lives on the other floor gets an honest nothing rather than a
       recommendation that cannot work. */
    const stairsAnswers: PoolAnswers = { ...watchDogAnswers, environment: "multi_storey" };
    const result = scoreProducts(stairsAnswers, ALL, PET_CAMERA_CONFIG_V1);
    const cams = result.ranked.filter((r) => r.productId.startsWith("prod-pet-camera"));
    expect(cams.length).toBeGreaterThan(0);
    for (const cam of cams) {
      expect(cam.excluded).toBe(true);
      expect(cam.exclusionReason).toBe("environment_mismatch");
    }
    expect(result.ranked.find((r) => !r.excluded)).toBeUndefined();
  });

  it("prefers the treat dispenser when the reader asked to interact", () => {
    const interactAnswers: PoolAnswers = {
      ...watchDogAnswers,
      primary_need: "interact",
      desired_cleans: ["remote_video", "two_way_audio", "treat_dispensing"],
      budget_tier: "premium",
    };
    const result = scoreProducts(interactAnswers, ALL, PET_CAMERA_CONFIG_V1);
    const treats = result.ranked.find((r) => r.productId === "prod-pet-camera-treats")!;
    const plain = result.ranked.find((r) => r.productId === "prod-pet-camera")!;
    expect(treats.excluded).toBe(false);
    expect(treats.score).toBeGreaterThan(plain.score);
  });
});

describe("the two configs cannot be confused for one another", () => {
  it("gives the two categories different weights and different exclusions", () => {
    expect(COMPANION_CONFIG_V1.weights).not.toEqual(PET_CAMERA_CONFIG_V1.weights);
    expect(COMPANION_CONFIG_V1.hardExclusions.environmentMismatch).toBe(false);
    expect(PET_CAMERA_CONFIG_V1.hardExclusions.environmentMismatch).toBe(true);
  });

  it("shares no eligible product class between them", () => {
    const a = new Set(COMPANION_CONFIG_V1.classEligibility.default);
    const shared = PET_CAMERA_CONFIG_V1.classEligibility.default.filter((c) => a.has(c));
    expect(shared).toEqual([]);
  });

  it("names a config that gates on an environment its questions never ask for", () => {
    /* The failure mode this whole file exists to catch. A config with the
       environment exclusion ON, fed answers from a questionnaire that asks no
       environment question, excludes every candidate — and before 6 August
       2026 it did so as "environment_mismatch", indistinguishable from a
       genuinely unsuitable catalogue. It now fails closed AND says why. */
    const noEnvironment: PoolAnswers = {
      primary_need: "watch_dog",
      desired_cleans: ["remote_video"],
      power_pref: "no_pref",
      budget_tier: "no_pref",
      pool_length_ft: null,
      pool_area_sqft: null,
    };
    const result = scoreProducts(noEnvironment, ALL, PET_CAMERA_CONFIG_V1);
    const cams = result.ranked.filter((r) => r.productId.startsWith("prod-pet-camera"));
    expect(cams.length).toBeGreaterThan(0);
    for (const cam of cams) {
      expect(cam.excluded).toBe(true);
      expect(cam.exclusionReason).toBe("environment_unknown");
    }
  });
});
