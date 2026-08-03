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

/**
 * Everything the pool hub actually says, assembled the way the page assembles
 * it. Reading the content modules rather than a rendered string keeps this
 * fast, and it is the same source the page renders from — so a term that
 * disappears from the copy disappears from here too.
 */
function poolHubCopy(): string {
  const slug = "robotic-pool-cleaners";
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
  it("still contains every term the pool hub is built around", () => {
    const copy = poolHubCopy();
    const missing = requiredTerms("/robots/robotic-pool-cleaners/").filter((t) => !copy.includes(t));
    expect(missing).toEqual([]);
  });

  it("does not chase a term it has ceded to another page", () => {
    // Appearing once in passing is fine and often unavoidable. Leading with it
    // is not: the H1 and the meta description are what the SERP competes on.
    const hero = heroFor("robotic-pool-cleaners")!;
    const front = `${hero.title} ${hero.seoTitle} ${hero.metaDescription}`.toLowerCase();
    for (const c of keywordsFor("/robots/robotic-pool-cleaners/")!.cededTo ?? []) {
      expect(front).not.toContain(c.term);
    }
  });
});
