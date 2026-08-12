import { describe, expect, it } from "vitest";
import { KEYWORD_REGISTER, keywordsFor, requiredTerms } from "../src/content/seo/keyword-register";
import { heroFor } from "../src/content/category-hero";
import {
  decisionSectionFor,
  coverageSectionFor,
  splitSectionFor,
  matrixSectionFor,
  checkSectionFor,
  priceSectionFor,
  verdictSectionFor,
  faqSectionFor,
} from "../src/content/category-sections";
import { ROUTES } from "../src/content/routes";
import { liveCategories } from "../src/content/nav";

/** Every category hub the register knows about, derived rather than typed. */
const HUB_SLUGS = KEYWORD_REGISTER.map((k) => k.path)
  .map((p) => /^\/robots\/([^/]+)\/$/.exec(p)?.[1])
  .filter((s): s is string => Boolean(s));

/**
 * Everything a category hub actually says, assembled the way the page assembles
 * it. Reading the content modules rather than a rendered string keeps this
 * fast, and it is the same source the page renders from — so a term that
 * disappears from the copy disappears from here too.
 *
 * Took a hardcoded pool slug until 6 August 2026, which meant the window hub
 * went live on 5 August with nothing asserting anything about its keywords,
 * and the lawn hub followed it. Every hub in the register is checked now, so a
 * category added later is covered the moment it has a row.
 */
function hubCopy(slug: string): string {
  const hero = heroFor(slug)!;
  const sections = [
    decisionSectionFor(slug),
    coverageSectionFor(slug),
    splitSectionFor(slug),
    matrixSectionFor(slug),
    checkSectionFor(slug),
    priceSectionFor(slug),
    verdictSectionFor(slug),
    faqSectionFor(slug),
  ].filter(Boolean);

  return JSON.stringify([hero, ...sections]).toLowerCase();
}

describe("keyword register", () => {
  it("targets a path that actually exists in the route registry", () => {
    for (const k of KEYWORD_REGISTER) {
      const known = ROUTES.some((r) => r.path === k.path) || k.path.startsWith("/robots/");
      expect(known).toBe(true);
    }
  });

  it("names one primary term per page, and never the same term twice", () => {
    for (const k of KEYWORD_REGISTER) {
      expect(k.primary.term.length).toBeGreaterThan(3);
      expect(k.primary.term).toBe(k.primary.term.toLowerCase());
      const all = [k.primary, ...k.secondary].map((t) => t.term);
      expect(new Set(all).size).toBe(all.length);
    }
  });

  /**
   * A page can opt out of competing, but not out of explaining itself. The two
   * rows that carry this — /privacy/ and /terms/ — record volumes in the tens
   * of thousands for the bare English words "privacy" and "terms", and without
   * a stated reason the next person to read a rank report would take those for
   * an opportunity.
   */
  it("makes a page that is not competing say why", () => {
    for (const k of KEYWORD_REGISTER) {
      if (k.notRanking === undefined) continue;
      expect(k.notRanking.length, `${k.path} opts out of ranking without a reason`).toBeGreaterThan(60);
    }
  });

  it("says where a ceded term went, and why", () => {
    for (const k of KEYWORD_REGISTER) {
      for (const c of k.cededTo ?? []) {
        expect(c.path).not.toBe(k.path);
        expect(c.why.length).toBeGreaterThan(30);
      }
    }
  });

  /**
   * The assertion this file exists for. Copy gets rewritten; if the rewrite
   * drops the term the page was built around, this fails on the same commit
   * rather than in a rank report three months later.
   */
  it.each(HUB_SLUGS)("still contains every term the %s hub is built around", (slug) => {
    const copy = hubCopy(slug);
    const missing = requiredTerms(`/robots/${slug}/`).filter((t) => !copy.includes(t));
    expect(missing).toEqual([]);
  });

  it.each(HUB_SLUGS)("%s does not chase a term it has ceded to another page", (slug) => {
    // Appearing once in passing is fine and often unavoidable. Leading with it
    // is not: the H1 and the meta description are what the SERP competes on.
    const hero = heroFor(slug)!;
    const front = `${hero.title} ${hero.seoTitle} ${hero.metaDescription}`.toLowerCase();
    for (const c of keywordsFor(`/robots/${slug}/`)!.cededTo ?? []) {
      expect(front).not.toContain(c.term);
    }
  });

  /**
   * The gap that let two live hubs go unguarded: a category page can exist
   * with no register row at all, and every assertion above then vacuously
   * passes because there is nothing to assert against.
   */
  it("has a register row for every live category hub", () => {
    for (const cat of liveCategories()) {
      expect(keywordsFor(`/robots/${cat.slug}/`), `${cat.slug} has no keyword register row`)
        .toBeDefined();
    }
  });
});
