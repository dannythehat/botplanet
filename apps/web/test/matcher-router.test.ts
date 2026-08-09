import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import {
  MATCHER_JOBS,
  MIN_PRODUCTS_FOR_A_MATCH,
  canMatch,
  emptyStateFor,
  jobFor,
  jobForCategory,
} from "../src/content/matcher-router";
import { questionsFor, tasksFor } from "../src/content/matcher-questions";
import { CATEGORIES, ROUTES, REDIRECTS } from "../src/content/routes";
import { normalisePath } from "../src/lib/routing";

/**
 * THE UNIVERSAL FINDER'S GUARD RAILS.
 *
 * The failure this file exists to prevent is the one the site already had: a
 * generic BotMatch URL that silently handed every reader the pool
 * questionnaire, whatever they had come for. Every assertion below is a way of
 * saying "a job leads to its own category's questions, or it says it cannot".
 */

/**
 * A LIVE CATEGORY IS ONE WITH A LIVE HUB, not one with a row in CATEGORIES.
 *
 * `solar-panel-robots` sits in that list with no route, no hub and no
 * questions — it is a catalogue placeholder for a category nobody has built.
 * Counting it as live would have demanded a job on the finder leading to a
 * page that does not exist, which is the opposite of what this file is for.
 * The homepage counts the same way, so the two can never disagree about how
 * many categories the site has.
 */
const LIVE_CATEGORY_SLUGS = CATEGORIES.map((c) => c.slug).filter((slug) =>
  ROUTES.some((r) => r.path === `/robots/${slug}/` && r.status === "live"),
);

describe("the job router covers the site", () => {
  it("offers a job for every live category", () => {
    const covered = new Set(MATCHER_JOBS.map((j) => j.categorySlug));
    const missing = LIVE_CATEGORY_SLUGS.filter((s) => !covered.has(s));
    expect(missing, "live categories with no job on the finder").toEqual([]);
  });

  it("routes every job to a real category", () => {
    for (const job of MATCHER_JOBS) {
      expect(LIVE_CATEGORY_SLUGS, `${job.id} points at an unknown category`).toContain(job.categorySlug);
    }
  });

  it("gives every job its own category — no two jobs share one", () => {
    const slugs = MATCHER_JOBS.map((j) => j.categorySlug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("gives every job a unique id, because the id is in the URL", () => {
    const ids = MATCHER_JOBS.map((j) => j.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) expect(id).toMatch(/^[a-z][a-z0-9-]*$/);
  });

  /**
   * THE ONE THAT KEEPS STEP 1 IN THE READER'S LANGUAGE.
   *
   * "Keep my pool clean", not "Robotic pool cleaners". A reader who does not
   * know our taxonomy is exactly who this page is for, and a list of category
   * names asks them to learn it before they may proceed. The category name
   * belongs in the description underneath, where it teaches.
   */
  it("phrases every job as a need rather than as a category name", () => {
    for (const job of MATCHER_JOBS) {
      const cat = CATEGORIES.find((c) => c.slug === job.categorySlug)!;
      expect(
        job.label.toLowerCase(),
        `${job.id}: the label is the category name, which is what step 1 exists to avoid`,
      ).not.toContain(cat.name.toLowerCase());
      expect(job.label.length).toBeGreaterThan(8);
      expect(job.description.length).toBeGreaterThan(30);
    }
  });
});

describe("every path ends in a result or the honest empty state", () => {
  /**
   * A JOB WITHOUT A QUESTION SET IS A DEAD END, and a dead end in a funnel is
   * worse than an absent one: the reader has already invested a tap. All nine
   * have one today; this fails the moment a tenth job is added ahead of its
   * questions.
   */
  it("gives every job a question set and an analysing sequence", () => {
    for (const job of MATCHER_JOBS) {
      expect(questionsFor(job.categorySlug), `${job.id} has no questions`).toBeTruthy();
      expect(tasksFor(job.categorySlug), `${job.id} has no analysing sequence`).toBeTruthy();
      expect(questionsFor(job.categorySlug)!.length).toBeGreaterThan(2);
    }
  });

  it("needs at least two products before it will call anything a match", () => {
    expect(MIN_PRODUCTS_FOR_A_MATCH).toBeGreaterThanOrEqual(2);
    expect(canMatch(0)).toBe(false);
    /* ONE IS NOT A COMPARISON. Running a questionnaire against a single
       product and announcing it tells a reader a comparison happened when
       nothing was compared — the tie guard's failure, arriving from the
       opposite direction. */
    expect(canMatch(1)).toBe(false);
    expect(canMatch(2)).toBe(true);
  });

  it("writes an empty state that names the category and promises no date", () => {
    for (const n of [0, 1]) {
      const s = emptyStateFor("Robot Vacuums", n);
      expect(s).toMatch(/robot vacuum/i);
      expect(s.length).toBeGreaterThan(60);
      /* No "soon", no "coming", no month. A date here is a commitment nobody
         made, and the reader will remember it. */
      expect(s).not.toMatch(/soon|coming|shortly|next (week|month)|20\d\d/i);
    }
  });

  it("looks a job up by id and by category, both ways round", () => {
    for (const job of MATCHER_JOBS) {
      expect(jobFor(job.id)).toEqual(job);
      expect(jobForCategory(job.categorySlug)).toEqual(job);
    }
    expect(jobFor("no-such-job")).toBeUndefined();
    expect(jobForCategory("no-such-category")).toBeUndefined();
  });
});

describe("the universal entry is a page, not a redirect", () => {
  /**
   * THE BUG THIS WHOLE FEATURE REPLACES. /botmatch/ was an alias onto the pool
   * funnel, written when pool was the only category with questions. Anyone who
   * typed the obvious URL was asked about their swimming pool.
   */
  it("no longer aliases /botmatch/ onto the pool matcher", () => {
    const aliases = REDIRECTS.map((r) => normalisePath(r.from));
    expect(aliases).not.toContain("/botmatch/");
  });

  it("registers /botmatch/ as a live, indexable route", () => {
    const route = ROUTES.find((r) => r.path === "/botmatch/");
    expect(route, "/botmatch/ is not in the route registry").toBeTruthy();
    expect(route!.status).toBe("live");
    expect(route!.indexable).toBe(true);
    expect(route!.inSitemap).toBe(true);
  });

  /* The per-category funnels and the saved results stay out of the index —
     a questionnaire has nothing to rank and a result is somebody's own. */
  it("keeps the per-category funnels noindex", () => {
    for (const r of ROUTES.filter((x) => x.path.startsWith("/botmatch/") && x.path !== "/botmatch/")) {
      expect(r.indexable, `${r.path} should not be indexable`).toBe(false);
    }
  });
});

describe("no scoring logic moved into the funnel", () => {
  const island = readFileSync("apps/web/src/components/BotMatcher.astro", "utf8");

  /**
   * THE LOAD-BEARING TEST OF THIS CHANGE.
   *
   * The universal finder was allowed to add a step in front of the questions
   * and to run several sets in sequence. It was not allowed to decide anything
   * about a product. If a weight, a threshold or a sort ever appears in the
   * island, the thing that picks a robot has quietly moved to the browser —
   * where it is unversioned, untested and invisible to the commission guard.
   */
  /* THE SCRIPT BLOCK ONLY. The page copy above it says the scorer "cannot see
     prices or commission at all" — which is the claim, not a violation of it,
     and reading the whole file made this test fail on the sentence promising
     the behaviour it checks. */
  const script = island.slice(island.indexOf("<script>"), island.indexOf("</script>"));

  it("asks the API for every decision rather than making one", () => {
    expect(script).toContain('fetch("/api/botmatch"');
    const code = script
      .split("\n")
      .filter((l) => !l.trim().startsWith("*") && !l.trim().startsWith("/*") && !l.trim().startsWith("//"))
      .join("\n");
    for (const forbidden of ["commission", "weight", "priceMinor", "scoreProducts", "suitabilityScore"]) {
      expect(code, `the funnel references "${forbidden}" — scoring belongs behind the API`).not.toContain(forbidden);
    }
  });

  it("presents a tie as a tie rather than choosing from it", () => {
    /* The API returns `equivalent` when the top of the ranking is shared. The
       funnel must render that group; picking one would re-introduce exactly
       the failure topGroup exists to prevent. */
    expect(island).toContain("equivalent");
    expect(island).toContain("Equivalent on current data");
    const code = island.split("\n").filter((l) => !l.trim().startsWith("*")).join("\n");
    expect(code).not.toMatch(/equivalent\s*\[\s*0\s*\]/);
  });

  it("keeps each category's answers apart", () => {
    /* Two question sets share ids — `budget` is `budget` in all nine — so one
       flat answers object would let a lawn answer overwrite a pool one. */
    expect(island).toContain("answersByCat");
  });
});
