/**
 * THE SHELL MUST SPEAK THE PAGE'S LANGUAGE.
 *
 * For a week every hub on this site advertised "Find My Pool Cleaner" — in the
 * header, in the drawer, and twice in the mega panel — because Header.astro
 * called shellJourney() with no argument and the launch-category fallback fired
 * on every page. A window buyer was asked about their pool seven times on one
 * page, and a lawn buyer likewise. The function had always accepted a category.
 * Nothing ever passed one.
 *
 * Found by an external audit of the window hub on 12 August 2026, alongside the
 * comparison table asking nine categories about "your pool". Both are the same
 * disease: copy written for the launch category and never re-read when eight
 * more arrived. These assertions are the vaccine.
 */
import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import {
  BOTMATCH_JOURNEYS,
  categoryOfPath,
  journeyFor,
  shellJourneyFor,
} from "../src/content/journeys";
import { REVIEWS } from "../src/content/reviews";
import { categoryCanMatch, MIN_PRODUCTS_FOR_A_MATCH } from "../src/content/matcher-router";
import { liveCategories, LAUNCH_CATEGORY } from "../src/content/nav";

const opts = { canMatch: categoryCanMatch };
const HEADER = readFileSync(fileURLToPath(new URL("../src/components/Header.astro", import.meta.url)), "utf8");
const FOOTER = readFileSync(fileURLToPath(new URL("../src/components/Footer.astro", import.meta.url)), "utf8");

describe("the shell's BotMatch journey follows the page", () => {
  it("resolves the category from every category-scoped URL shape", () => {
    expect(categoryOfPath("/robots/window-cleaning-robots/")).toBe("window-cleaning-robots");
    expect(categoryOfPath("/robots/window-cleaning-robots/hobot-2s/")).toBe("window-cleaning-robots");
    expect(categoryOfPath("/compare/robotic-lawn-mowers/")).toBe("robotic-lawn-mowers");
    expect(categoryOfPath("/botmatch/self-cleaning-litter-boxes/")).toBe("self-cleaning-litter-boxes");
    expect(categoryOfPath("/best-robots/robotic-pool-cleaners/cordless/")).toBe("robotic-pool-cleaners");
    // A guide's category is not in its path; the registry supplies it.
    expect(categoryOfPath("/guides/do-window-cleaning-robots-work/", "window-cleaning-robots")).toBe(
      "window-cleaning-robots",
    );
    expect(categoryOfPath("/about/")).toBeNull();
  });

  /** The regression itself, stated as plainly as it can be. */
  it("never offers one category's matcher on another category's page", () => {
    for (const cat of liveCategories()) {
      const j = shellJourneyFor(`/robots/${cat.slug}/`, opts);
      if (!j) continue;
      expect(j.category, `the ${cat.slug} hub advertises the ${j.category} matcher`).toBe(cat.slug);
      expect(j.href).toBe(`/botmatch/${cat.slug}/`);
    }
  });

  it("gives every live category with a working matcher a journey of its own", () => {
    const missing = liveCategories()
      .filter((c) => categoryCanMatch(c.slug) && !journeyFor(c.slug))
      .map((c) => c.slug);
    expect(missing, "live categories whose matcher works but whose shell has no label").toEqual([]);
  });

  /**
   * PRE-BUILD-PROCESS.md Stage 5b: a matcher with no products is not
   * advertised. Falling back to the launch journey here would be the original
   * bug with a smaller blast radius, so the honest answer is no button.
   */
  it("advertises nothing on a category whose matcher cannot answer", () => {
    const thin = liveCategories().filter((c) => !categoryCanMatch(c.slug));
    expect(thin.length, "no thin category left to prove the rule against").toBeGreaterThan(0);
    for (const c of thin) {
      expect(shellJourneyFor(`/robots/${c.slug}/`, opts), `${c.slug} advertises a matcher`).toBeNull();
      expect(shellJourneyFor(`/compare/${c.slug}/`, opts)).toBeNull();
    }
  });

  it("uses the universal job-first journey on the homepage only", () => {
    const home = shellJourneyFor("/", opts);
    expect(home?.category).toBe("universal");
    expect(home?.ctaLabel).toBe("Find My Robot");
    expect(home?.href).toBe("/botmatch/");

    for (const p of ["/about/", "/guides/", "/review-methodology/"]) {
      expect(shellJourneyFor(p, opts)?.category, p).toBe(LAUNCH_CATEGORY);
    }
  });

  it("points every journey at its own category's matcher", () => {
    for (const [slug, j] of Object.entries(BOTMATCH_JOURNEYS)) {
      expect(j.category).toBe(slug);
      expect(j.href).toBe(`/botmatch/${slug}/`);
      // A label naming no robot is the generic claim the product rule forbids.
      expect(j.ctaLabel.toLowerCase()).not.toBe("find my robot");
      expect(j.explanation.length).toBeGreaterThan(40);
    }
  });

  /**
   * The footer prompt reads "Not sure which {subject} fits?". It used to build
   * that from the category's DISPLAY NAME with a trailing "s" stripped, which
   * shipped "which self-cleaning litter boxe fits?", "which robot vacuums &
   * mop", "which coding robots for kid" and "which companion robots & robot
   * pet". Caught on a preview before it reached production. These are typed
   * strings now, and this is what stops the next one being derived.
   */
  it("gives every journey a singular subject that reads in a sentence", () => {
    for (const [slug, j] of Object.entries(BOTMATCH_JOURNEYS)) {
      const s = j.subject;
      expect(s, `${slug} has no subject`).toBeTruthy();
      expect(s, `${slug}: "${s}" is not lowercase`).toBe(s.toLowerCase());
      expect(s, `${slug}: "${s}" is a plural`).not.toMatch(/s$/);
      expect(s, `${slug}: "${s}" is a display name, not a noun`).not.toMatch(/[&,]|-/);
      // It has to survive the sentence it is dropped into.
      expect(`Not sure which ${s} fits?`.length).toBeLessThan(45);
    }
  });

  /**
   * The static stand-in for a D1 count. It may undercount and must never
   * overcount, because overcounting is what advertises a matcher that cannot
   * answer.
   */
  it("never claims a category can match on more reviews than exist", () => {
    for (const cat of liveCategories()) {
      const reviews = Object.values(REVIEWS).filter((r) => r.categorySlug === cat.slug).length;
      expect(categoryCanMatch(cat.slug)).toBe(reviews >= MIN_PRODUCTS_FOR_A_MATCH);
    }
  });

  /** No component may reach for the launch category to decide what to say. */
  it("leaves no pool hardcode in the shell", () => {
    for (const [name, src] of [["Header.astro", HEADER], ["Footer.astro", FOOTER]] as const) {
      const copy = src
        .replace(/\/\*[\s\S]*?\*\//g, "")
        .replace(/\{\/\*[\s\S]*?\*\/\}/g, "")
        .replace(/<!--[\s\S]*?-->/g, "")
        .replace(/^\s*\/\/.*$/gm, "");
      expect(/pool cleaner|pool robots|your pool/i.test(copy), `${name} still hardcodes pool copy`).toBe(false);
      expect(copy.includes("shellJourney("), `${name} still resolves one journey site-wide`).toBe(false);
    }
  });
});
