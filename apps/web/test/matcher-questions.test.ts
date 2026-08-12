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
/* Pet-camera words that must never appear outside the pet-camera set.

   "stairs" is bounded on BOTH sides deliberately: the window set offers
   "stairwell" as a place a robot has to work, which is a legitimate use of a
   different word and not a leak.

   "cat" and "dog" were in this list and have been REMOVED. They caught the
   litter-box set on 6 August 2026, which asks how big your cat is — and that
   is not a leak, it is the single most important question that category has.
   The animal is not what makes pet cameras distinctive; two categories on this
   site are sold to cat owners. What is distinctive is the machine's own
   constraints, so the guard is those.

   "carpet" has now gone the same way, for the same reason: robot vacuums ask
   what is on your floors, and that is the most important question that
   category has. Two categories caring about carpet is not a leak. */
const PET_CAMERA_WORDS = /\bstairs?\b|\bpatrol|\btreats?\b/i;
/* Companion words that must never appear outside the companion set. Kept to
   terms only this category uses — "monthly fee" is deliberately NOT here,
   because pet cameras charge for cloud recording and asking about it there is
   correct rather than borrowed. */
const COMPANION_WORDS = /\bconversation\b|\bdesk\b/i;
/* Litter-box words that must never appear outside the litter-box set. The cat
   words are deliberately NOT here — pet cameras legitimately ask about cats,
   and asking a pet-camera buyer about their cat is correct rather than
   borrowed. These four are specific to the litter category. */
const LITTER_BOX_WORDS = /\blitter\b|\brefill/i;
/* Grill words that must never appear outside the grill set. */
const GRILL_WORDS = /\bgrate|\bgrill|\bbarbecue|\bbristle|\bcook\b/i;
/* Vacuum words that must never appear outside the vacuum set. "carpet" is NOT
   here — pet cameras legitimately ask about flooring, and that question is
   theirs by right rather than borrowed. */
const VACUUM_WORDS = /\bmop|\bvacuum|\bsuction|\bshag\b/i;
/* Coding words that must never appear outside the coding set. "child" is not
   here — litter boxes and pet cameras both legitimately ask about households
   with children. These are specific to the category. */
const CODING_WORDS = /\bcoding\b|\bprogramm|\btablet\b/i;

/** Every string a reader could see in a question set. */
function visibleText(slug: string): string {
  const qs = MATCHER_QUESTIONS_BY_CATEGORY[slug] ?? [];
  return qs
    .flatMap((q) => [q.kicker, q.q, ...q.options.flatMap((o) => [o.label, o.hint ?? ""])])
    .join(" \n ");
}

describe("every category's questions are its own", () => {
  /* Derived from the nav registry rather than hardcoded, since 6 August 2026.
     The list was a literal until companion robots and pet camera robots went
     live, at which point it failed for the one reason a guard must never fail:
     somebody did the right thing. What the rule actually says is "every live
     category has its own set", so that is what this now asserts — and it still
     catches the original bug, because a category launched without questions
     fails here rather than silently inheriting another category's. */
  it("has a set for every live category, and none for anything else", () => {
    const live = liveCategories().map((c) => c.slug).sort();
    expect(CATEGORIES.sort()).toEqual(live);
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

  it("asks nobody outside pet cameras about their stairs, carpet or dog", () => {
    for (const slug of CATEGORIES) {
      if (slug === "pet-camera-robots") continue;
      expect(visibleText(slug), `${slug} mentions a pet camera concern`).not.toMatch(
        PET_CAMERA_WORDS,
      );
    }
  });

  it("asks nobody outside companion robots about conversation or a desk", () => {
    for (const slug of CATEGORIES) {
      if (slug === "companion-robots") continue;
      expect(visibleText(slug), `${slug} mentions a companion concern`).not.toMatch(
        COMPANION_WORDS,
      );
    }
  });

  it("asks nobody outside litter boxes about litter or refills", () => {
    for (const slug of CATEGORIES) {
      if (slug === "self-cleaning-litter-boxes") continue;
      expect(visibleText(slug), `${slug} mentions a litter concern`).not.toMatch(
        LITTER_BOX_WORDS,
      );
    }
  });

  it("asks nobody outside grill cleaners about grates or bristles", () => {
    for (const slug of CATEGORIES) {
      if (slug === "grill-cleaning-robots") continue;
      expect(visibleText(slug), `${slug} mentions a grill concern`).not.toMatch(GRILL_WORDS);
    }
  });

  it("asks nobody outside robot vacuums about mopping or suction", () => {
    for (const slug of CATEGORIES) {
      if (slug === "robot-vacuums") continue;
      expect(visibleText(slug), `${slug} mentions a vacuum concern`).not.toMatch(VACUUM_WORDS);
    }
  });

  it("asks nobody outside coding robots about coding or tablets", () => {
    for (const slug of CATEGORIES) {
      if (slug === "educational-coding-robots") continue;
      expect(visibleText(slug), `${slug} mentions a coding concern`).not.toMatch(CODING_WORDS);
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
    /* Was "robot-vacuums" until 6 August 2026, when that category went live
       and the guard started failing because somebody had done the right thing.
       "solar-panel-robots" is a reserved, hidden slug with no questions — the
       exact case this needs to assert. */
    expect(questionsFor("solar-panel-robots")).toBeNull();
    expect(questionsFor("")).toBeNull();
    expect(questionsFor(undefined)).toBeNull();
    expect(tasksFor("solar-panel-robots")).toBeNull();
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
    expect(toScoringAnswers("solar-panel-robots", { environment: "In-ground" })).toEqual({});
  });

  it("folds a real window answer set into engine inputs", () => {
    const folded = toScoringAnswers("window-cleaning-robots", {
      environment: "Frameless",
      primary_need: "Outside, above ground level",
      power_pref: "Yes, near enough",
      budget_tier: "$200 – $350",
      /* SCORED FROM 10 AUGUST 2026 and it used to be profile-only. A reader
         with windows above the ground floor has told us the machine has to
         hold on when the mains cuts, which ten of the eleven robots do and one
         does not. The KEY still must not reach the scorer — only the fragment
         it maps to. */
      window_height: "Higher than that",
    });
    expect(folded.environment).toBe("frameless_glass");
    /* A UNION, NOT A REPLACEMENT. Two questions contribute capabilities here
       and until 10 August 2026 the second silently discarded the first. */
    expect(folded.desired_cleans).toEqual(["glass_exterior", "power_off_hold"]);
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

/**
 * THE MERGE, WHICH WAS THE LARGEST SCORING BUG THIS SITE HAS HAD.
 *
 * `toScoringAnswers` folded each chosen option's fragment with Object.assign
 * until 10 August 2026, so the LAST question to mention `desired_cleans` threw
 * away every capability the reader had asked for before it. Four of a vacuum
 * reader's five scored answers were being collected and discarded.
 *
 * It is also most of the reason the matchers tied: cleansCoverage is
 * covered-over-desired, a desired set of one item is satisfied by almost every
 * product in a category, the factor saturates at 1.0 for all of them and the
 * ranking collapses onto price tier alone.
 */
describe("capabilities accumulate across questions", () => {
  it("unions desired_cleans from every scored answer rather than keeping the last", () => {
    const folded = toScoringAnswers("robot-vacuums", {
      environment: "A mix of hard floor and carpet", // environment only
      mopping: "Yes — and the pads must lift off carpet", // mopping, mop_lifting
      primary_need: "Yes — a shedding animal", // self_emptying, obstacle_avoidance
      clutter: "Children live here", // obstacle_avoidance
      emptying: "Yes — I do not want to think about it", // self_emptying
      home_size: "A large house, several storeys", // multi_floor_mapping
      budget_tier: "$300 – $600",
    });

    expect(folded.desired_cleans).toEqual(
      expect.arrayContaining([
        "mopping",
        "mop_lifting",
        "self_emptying",
        "obstacle_avoidance",
        "multi_floor_mapping",
      ]),
    );
    expect(folded.desired_cleans).toHaveLength(5);
  });

  it("does not repeat a capability two answers both asked for", () => {
    const folded = toScoringAnswers("robot-vacuums", {
      primary_need: "Yes — a shedding animal", // self_emptying, obstacle_avoidance
      clutter: "Cables, shoes, the odd toy", // obstacle_avoidance again
    });
    const counts = new Map<string, number>();
    for (const c of folded.desired_cleans ?? []) counts.set(c, (counts.get(c) ?? 0) + 1);
    expect([...counts.values()].every((n) => n === 1)).toBe(true);
  });

  /* Two environments is not a thing the scorer can hold, so the scalar fields
     stay last-wins and a union there would be wrong. */
  it("keeps every non-capability field last-wins", () => {
    const folded = toScoringAnswers("robot-vacuums", {
      environment: "Mostly hard floors",
      budget_tier: "Over $1,000",
    });
    expect(folded.environment).toBe("hard_floors");
    expect(folded.budget_tier).toBe("ultra");
  });

  /* The litter funnel's refill question and the window funnel's height
     question were both added as scored on 10 August. Neither is the last
     scored question in its set, so both would have been silently dropped
     under the old fold — which is how the bug stayed invisible. */
  it("keeps a mid-questionnaire capability that a later question would have overwritten", () => {
    const litter = toScoringAnswers("self-cleaning-litter-boxes", {
      environment: "An average adult",
      litter_pref: "No — ordinary litter from any shop", // any_litter
      primary_need: "Two", // odor_sealing, multi_cat_capacity
      tracking: "Yes — that's useful to me", // health_monitoring, app_control
    });
    expect(litter.desired_cleans).toContain("any_litter");
    expect(litter.desired_cleans).toContain("odor_sealing");
    expect(litter.desired_cleans).toContain("health_monitoring");
  });
});

/**
 * A QUESTION THE FUNNEL ANSWERED FOR THE READER, WRONGLY.
 *
 * The vacuum floor question added `mopping` to every hard-floor and mixed-floor
 * answer until 10 August 2026, so anybody without deep pile throughout was
 * deemed to want a mop whether they said so or not. Two of the eleven machines
 * in that catalogue do not mop, and a sweep of all 1,215 answer sets found
 * neither could be the answer to any question a reader was able to ask.
 */
describe("wanting a mop is a decision, not a consequence of your floors", () => {
  it("does not ask for mopping when the reader only said what their floors are", () => {
    const folded = toScoringAnswers("robot-vacuums", {
      environment: "Mostly hard floors",
    });
    expect(folded.environment).toBe("hard_floors");
    expect(folded.desired_cleans ?? []).not.toContain("mopping");
  });

  it("lets a reader ask for a vacuum that does not mop at all", () => {
    const folded = toScoringAnswers("robot-vacuums", {
      environment: "A mix of hard floor and carpet",
      mopping: "No — vacuum only",
      primary_need: "Yes — a shedding animal",
    });
    expect(folded.desired_cleans ?? []).not.toContain("mopping");
    expect(folded.desired_cleans ?? []).not.toContain("mop_lifting");
    expect(folded.desired_cleans).toContain("self_emptying");
  });

  it("asks for mop lifting only when the reader asks for it", () => {
    const plain = toScoringAnswers("robot-vacuums", { mopping: "Yes" });
    expect(plain.desired_cleans).toEqual(["mopping"]);

    const lifting = toScoringAnswers("robot-vacuums", {
      mopping: "Yes — and the pads must lift off carpet",
    });
    expect(lifting.desired_cleans).toEqual(["mopping", "mop_lifting"]);
  });

  /* "No pets and no long hair" says nothing whatever about wanting a mop, and
     it used to say `mopping`. */
  it("does not read a mop into an answer about hair", () => {
    const folded = toScoringAnswers("robot-vacuums", { primary_need: "Neither" });
    expect(folded.primary_need).toBe("general");
    expect(folded.desired_cleans ?? []).not.toContain("mopping");
  });
});
