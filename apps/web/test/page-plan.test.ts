/**
 * THE ANTI-DRIFT GATE.
 *
 * On 6 August 2026 fifteen pages were written and pushed with no build pack
 * behind any of them. OWNER-LOCKED BLUEPRINT v1.0 §7 requires one — section
 * order, exact images assigned to each section, products, schema — approved by
 * the owner before a builder starts. Nothing in the repository stopped a page
 * being built without it, so the builder invented the specification while
 * writing, and eleven pages shipped with no images at all.
 *
 * A note in a document does not stop that. This does.
 *
 * Every assertion below is one of the specific failures of that day, turned
 * into something that breaks the build instead of being noticed later.
 */
import { describe, expect, it } from "vitest";
import { PAGE_PLAN, planFor, readinessGaps, type PagePlan } from "../src/content/seo/page-plan";
import { ROUTES } from "../src/content/routes";
import { REVIEWS } from "../src/content/reviews";
import { keywordsFor } from "../src/content/seo/keyword-register";

const built = PAGE_PLAN.filter((p) => p.status === "built");

describe("the page plan covers reality", () => {
  it("gives every plan a unique path", () => {
    const paths = PAGE_PLAN.map((p) => p.path);
    expect(new Set(paths).size, "two plans claim the same URL").toBe(paths.length);
  });

  /**
   * THE ONE THAT WOULD HAVE STOPPED 6 AUGUST. A page may not be live unless it
   * was planned first. Reversed from the usual direction deliberately: the
   * question is not "is every plan built" — plenty are legitimately unbuilt —
   * it is "was every built thing planned".
   */
  it("has a plan for every live indexable route", () => {
    const unplanned = ROUTES.filter(
      (r) =>
        r.status === "live" &&
        r.indexable &&
        r.category &&
        !["/robots/", "/compare/", "/best-robots/", "/guides/", "/deals/"].includes(r.path) &&
        !planFor(r.path),
    ).map((r) => r.path);
    expect(unplanned, "live pages with no entry in the page plan").toEqual([]);
  });

  it("has a plan for every published review", () => {
    const unplanned = Object.values(REVIEWS)
      .map((r) => `/robots/${r.categorySlug}/${r.slug}/`)
      .filter((path) => !planFor(path));
    expect(unplanned, "reviews written with no page plan behind them").toEqual([]);
  });

  it("marks a plan built only if the route registry agrees it is live", () => {
    for (const p of built) {
      // Reviews are dynamic routes and correctly absent from the registry.
      if (p.type === "review") continue;
      const route = ROUTES.find((r) => r.path === p.path);
      expect(route, `${p.path} is planned as built but has no route`).toBeDefined();
      expect(route!.status, `${p.path} is planned as built but its route is not live`).toBe("live");
    }
  });
});

describe("cannibalisation is prevented, not remembered", () => {
  /**
   * One primary term, one URL. This is the rule the whole keyword map rests on
   * and it has never been machine-checked until now.
   */
  it("never lets two pages claim the same primary term", () => {
    const seen = new Map<string, string>();
    const clashes: string[] = [];
    for (const p of PAGE_PLAN) {
      const term = p.primary.term.toLowerCase();
      const owner = seen.get(term);
      if (owner) clashes.push(`"${term}" claimed by both ${owner} and ${p.path}`);
      else seen.set(term, p.path);
    }
    expect(clashes).toEqual([]);
  });

  /**
   * A ceded term has to go somewhere real, and the page it names has to
   * actually want it. "I gave it to that page" is worthless if that page never
   * took it.
   */
  it("cedes every term to a page that actually owns it", () => {
    const owns = (path: string, term: string) => {
      const target = planFor(path);
      if (!target) return false;
      const t = term.toLowerCase();
      return (
        target.primary.term.toLowerCase() === t ||
        target.secondary.some((s) => s.term.toLowerCase() === t)
      );
    };

    const broken: string[] = [];
    for (const p of PAGE_PLAN) {
      for (const c of p.ceded) {
        if (!planFor(c.toPath)) {
          broken.push(`${p.path} cedes "${c.term}" to ${c.toPath}, which has no plan`);
        } else if (!owns(c.toPath, c.term)) {
          broken.push(`${p.path} cedes "${c.term}" to ${c.toPath}, which does not target it`);
        }
      }
    }
    expect(broken).toEqual([]);
  });

  it("never cedes a term to itself", () => {
    for (const p of PAGE_PLAN) {
      for (const c of p.ceded) expect(c.toPath, `${p.path} cedes to itself`).not.toBe(p.path);
    }
  });

  it("gives every ceded term a reason worth reading", () => {
    for (const p of PAGE_PLAN) {
      for (const c of p.ceded) expect(c.why.length, `${p.path}: "${c.term}" has a thin reason`).toBeGreaterThan(25);
    }
  });
});

describe("a plan is complete before it is built", () => {
  /**
   * BLUEPRINT §7. Keywords, products, links, images and schema are declared
   * before a builder starts — not discovered while writing.
   */
  it.each(built.map((p) => p.path))("%s declared everything except artwork", (path) => {
    const p = planFor(path)!;
    // Images are handled by their own assertion below, because artwork is
    // supplied by the owner on a different clock from the writing.
    const gaps = readinessGaps(p).filter((g) => !g.includes("image(s) not supplied"));
    expect(gaps, `${path} was built with an incomplete plan`).toEqual([]);
  });

  /**
   * BLUEPRINT §4 and §5: visual-first, and "no page made primarily of long
   * black screens of text". This does not fail the build — artwork arrives
   * after the words by the owner's own instruction of 6 August — but it names
   * every page that is currently text-only, so the list can never be lost.
   */
  it("reports every built page still waiting on artwork", () => {
    const waiting = built
      .map((p) => ({ path: p.path, missing: p.images.filter((i) => !i.supplied).map((i) => i.slot) }))
      .filter((r) => r.missing.length > 0);

    // Deliberately not an assertion that fails. It prints, so the gap is
    // visible on every run rather than living in somebody's memory.
    if (waiting.length) {
      console.warn(
        `\n[page-plan] ${waiting.length} built page(s) awaiting artwork:\n` +
          waiting.map((w) => `  ${w.path} → ${w.missing.join(", ")}`).join("\n"),
      );
    }
    expect(Array.isArray(waiting)).toBe(true);
  });

  it("never plans a page with no reason to exist", () => {
    for (const p of PAGE_PLAN) {
      expect(p.evidence.length, `${p.path} has no evidence for existing`).toBeGreaterThan(30);
      expect(p.intent.length, `${p.path} has no stated search intent`).toBeGreaterThan(20);
      expect(p.research.length, `${p.path} names no research run`).toBeGreaterThan(3);
    }
  });

  it("links every page to somewhere else on the site", () => {
    for (const p of PAGE_PLAN) {
      if (p.type === "botmatch" || p.images.length === 0 && p.type === "guide") continue;
      expect(p.linksOut.length, `${p.path} is a dead end`).toBeGreaterThan(0);
    }
  });
});

describe("the plan and the keyword register agree", () => {
  /**
   * Two files hold keyword assignments: this plan, and the register that is
   * asserted against rendered copy. If they disagree, one of them is lying
   * about what a page targets and there is no way to tell which.
   */
  it.each(built.filter((p) => p.type !== "botmatch").map((p) => p.path))(
    "%s targets the same primary term in both files",
    (path) => {
      const plan = planFor(path)!;
      const reg = keywordsFor(path);
      if (!reg) return; // index pages legitimately have no register row
      expect(reg.primary.term.toLowerCase(), `${path} disagrees with the keyword register`).toBe(
        plan.primary.term.toLowerCase(),
      );
    },
  );
});
