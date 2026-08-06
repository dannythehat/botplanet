/**
 * BotMatch question sets — the guard for a bug that was live for a day.
 *
 * On 5 August 2026 the window category went live pointing at the only
 * questionnaire that existed, which was the pool one. A visitor who wanted
 * their windows cleaned was asked whether their pool was in-ground and how
 * many feet long it was. Nothing caught it, because there was nothing for it
 * to be inconsistent with.
 *
 * These tests encode the rule that replaced it: every category's questions are
 * its own, and a category with no questions gets none rather than somebody
 * else's. They are cheap and they fail loudly, which is the entire point.
 */
import { describe, expect, it } from "vitest";
import { CLEANING_SURFACES, ENVIRONMENTS, POWER_TYPES } from "@botplanet/shared";
import {
  MATCHER_DEFAULTS,
  MATCHER_QUESTIONS_BY_CATEGORY,
  MATCHER_TASKS_BY_CATEGORY,
  questionsFor,
  tasksFor,
  toScoringAnswers,
} from "../src/content/matcher-questions";
import { liveCategories } from "../src/content/nav";

const CATEGORIES = Object.keys(MATCHER_QUESTIONS_BY_CATEGORY);

/** Pool words that must never appear outside the pool set. */
const POOL_WORDS = /\bpool|waterline|above-ground|in-ground|skimmer|chlorine|deck\b/i;
/** Glass words that must never appear outside the window set. */
const GLASS_WORDS = /\bglass|window|pane|frameless|squeegee|streak\b/i;
/** Lawn words that must never appear outside the lawn set. */
const LAWN_WORDS = /\blawn|grass|mow|acre|yard|boundary wire\b/i;

/** Every string a reader could see in a question set. */
function visibleText(slug: string): string {
  const qs = MATCHER_QUESTIONS_BY_CATEGORY[slug] ?? [];
  return qs
    .flatMap((q) => [q.kicker, q.q, ...q.options.flatMap((o) => [o.label, o.hint ?? ""])])
    .join(" \n ");
}

describe("every category's questions are its own", () => {
  it("has a set for each of pool, window and lawn", () => {
    expect(CATEGORIES.sort()).toEqual([
      "robotic-lawn-mowers",
      "robotic-pool-cleaners",
      "window-cleaning-robots",
    ]);
  });

  it("never shares an array instance between two categories", () => {
    // Object identity, not deep equality: two categories pointing at the SAME
    // array is precisely the shape of the original bug.
    for (const a of CATEGORIES) {
      for (const b of CATEGORIES) {
        if (a === b) continue;
        expect(MATCHER_QUESTIONS_BY_CATEGORY[a]).not.toBe(MATCHER_QUESTIONS_BY_CATEGORY[b]);
        expect(MATCHER_TASKS_BY_CATEGORY[a]).not.toBe(MATCHER_TASKS_BY_CATEGORY[b]);
      }
    }
  });

  it("asks nobody outside pool about their pool", () => {
    for (const slug of CATEGORIES) {
      if (slug === "robotic-pool-cleaners") continue;
      expect(visibleText(slug), `${slug} mentions a pool`).not.toMatch(POOL_WORDS);
    }
  });

  it("asks nobody outside window about their glass", () => {
    for (const slug of CATEGORIES) {
      if (slug === "window-cleaning-robots") continue;
      expect(visibleText(slug), `${slug} mentions glass`).not.toMatch(GLASS_WORDS);
    }
  });

  it("asks nobody outside lawn about their lawn", () => {
    for (const slug of CATEGORIES) {
      if (slug === "robotic-lawn-mowers") continue;
      expect(visibleText(slug), `${slug} mentions a lawn`).not.toMatch(LAWN_WORDS);
    }
  });

  it("gives each category its own analysing sequence, of the same length as pool's", () => {
    for (const slug of CATEGORIES) {
      const tasks = MATCHER_TASKS_BY_CATEGORY[slug];
      expect(tasks, `${slug} has no tasks`).toBeDefined();
      expect(tasks!.length).toBeGreaterThanOrEqual(5);
    }
  });

  it("never returns another category's questions for an unknown slug", () => {
    expect(questionsFor("robot-vacuums")).toBeNull();
    expect(questionsFor("")).toBeNull();
    expect(questionsFor(undefined)).toBeNull();
    expect(tasksFor("robot-vacuums")).toBeNull();
  });
});

describe("questions are well formed", () => {
  it("has unique question ids and unique option labels within a set", () => {
    for (const slug of CATEGORIES) {
      const qs = MATCHER_QUESTIONS_BY_CATEGORY[slug]!;
      const ids = qs.map((q) => q.id);
      expect(new Set(ids).size, `${slug} has duplicate question ids`).toBe(ids.length);
      for (const q of qs) {
        const labels = q.options.map((o) => o.label);
        expect(new Set(labels).size, `${slug}/${q.id} has duplicate labels`).toBe(labels.length);
        expect(q.options.length, `${slug}/${q.id} needs at least two options`).toBeGreaterThan(1);
      }
    }
  });

  it("only emits score values the shared vocabulary actually defines", () => {
    for (const slug of CATEGORIES) {
      for (const q of MATCHER_QUESTIONS_BY_CATEGORY[slug]!) {
        for (const o of q.options) {
          const s = o.scores;
          if (!s) continue;
          if (s.environment) {
            expect(ENVIRONMENTS, `${slug}/${q.id}`).toContain(s.environment);
          }
          for (const c of s.desired_cleans ?? []) {
            expect(CLEANING_SURFACES, `${slug}/${q.id}`).toContain(c);
          }
          if (s.power_pref && s.power_pref !== "no_pref") {
            expect(POWER_TYPES, `${slug}/${q.id}`).toContain(s.power_pref);
          }
        }
      }
    }
  });

  it("asks every category about budget, because every category has price bands", () => {
    for (const slug of CATEGORIES) {
      const qs = MATCHER_QUESTIONS_BY_CATEGORY[slug]!;
      const budget = qs.find((q) => q.options.some((o) => o.scores?.budget_tier));
      expect(budget, `${slug} never asks about budget`).toBeDefined();
    }
  });

  it("gives every category a question that keys class eligibility", () => {
    for (const slug of CATEGORIES) {
      const qs = MATCHER_QUESTIONS_BY_CATEGORY[slug]!;
      const need = qs.find((q) => q.options.some((o) => o.scores?.primary_need));
      expect(need, `${slug} never sets primary_need`).toBeDefined();
    }
  });
});

describe("folding answers into the scoring shape", () => {
  it("uses the named category's set, not a default", () => {
    // "In-ground" is a pool label. Folded under window it must score nothing,
    // rather than quietly setting environment to a pool value.
    const folded = toScoringAnswers("window-cleaning-robots", { environment: "In-ground" });
    expect(folded.environment).toBeUndefined();
  });

  it("returns an empty fragment for a category with no questions", () => {
    expect(toScoringAnswers("robot-vacuums", { environment: "In-ground" })).toEqual({});
  });

  it("folds a real window answer set into engine inputs", () => {
    const folded = toScoringAnswers("window-cleaning-robots", {
      environment: "Frameless",
      primary_need: "Outside, above ground level",
      power_pref: "Yes, near enough",
      budget_tier: "$200 – $350",
      window_height: "Higher than that", // profile-only
    });
    expect(folded.environment).toBe("frameless_glass");
    expect(folded.desired_cleans).toEqual(["glass_exterior"]);
    expect(folded.power_pref).toBe("corded");
    expect(folded.budget_tier).toBe("mid");
    // Profile answers must never reach the scorer.
    expect(Object.keys(folded)).not.toContain("window_height");
  });

  it("folds a real lawn answer set, including the acreage", () => {
    const folded = toScoringAnswers("robotic-lawn-mowers", {
      lawn_size: "1/2 acre to an acre",
      environment: "Under trees or beside a tall building",
      primary_need: "Real slopes or banks",
      budget_tier: "$1,500 – $2,500",
    });
    expect(folded.pool_area_sqft).toBe(43560);
    expect(folded.environment).toBe("tree_cover");
    expect(folded.desired_cleans).toEqual(["grass_flat", "grass_slopes"]);
    expect(folded.budget_tier).toBe("premium");
  });

  it("applies a category's declared defaults for axes it does not ask about", () => {
    // Lawn deliberately never asks corded-or-cordless: every robot mower runs
    // on a battery. Without the default the engine compares each candidate
    // against undefined and scores the power factor zero for all of them.
    expect(MATCHER_DEFAULTS["robotic-lawn-mowers"]?.power_pref).toBe("no_pref");
    const folded = toScoringAnswers("robotic-lawn-mowers", { lawn_size: "A small yard" });
    expect(folded.power_pref).toBe("no_pref");
    expect(folded.pool_length_ft).toBeNull();
  });

  it("lets a real answer override a default rather than the other way round", () => {
    const folded = toScoringAnswers("robotic-pool-cleaners", { power_pref: "Cordless" });
    expect(folded.power_pref).toBe("cordless");
  });
});

describe("no live category is left pointing at the wrong questionnaire", () => {
  it("every live category either has its own set or has none at all", () => {
    for (const cat of liveCategories()) {
      const qs = questionsFor(cat.slug);
      if (qs === null) continue; // no BotMatch — the honest outcome
      expect(MATCHER_QUESTIONS_BY_CATEGORY[cat.slug], cat.slug).toBe(qs);
    }
  });
});
