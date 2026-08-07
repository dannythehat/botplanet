/**
 * Guards for the editorial pages — the best-of rankings and the standalone
 * guides.
 *
 * These pages are the ones most likely to rot quietly. A category hub is
 * assembled from structured records and a review is anchored to a product, but
 * a best-of page is an argument, and an argument drifts: a product gets
 * archived and its award is left behind, a price is typed into a sentence and
 * is wrong two months later, a rewrite drops the term the page was built on.
 *
 * Every assertion below is a thing that has to stay true rather than a thing
 * that happens to be true today.
 */
import { describe, expect, it } from "vitest";
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { EDITORIAL, editorialForCategory } from "../src/content/editorial";
import { ROUTES } from "../src/content/routes";
import { keywordsFor, requiredTerms } from "../src/content/seo/keyword-register";
import { anchorsFor, liveAnchorsFor } from "../src/content/internal-links";
import { applyInternalLinks } from "../src/lib/internal-linker";
import { productEditorial, catalogueStatusOf } from "../src/content/products";
import { COMPARE_PAGES } from "../src/content/compare-page";

const ARTICLES = fileURLToPath(new URL("../src/articles/", import.meta.url));
const ALL = Object.values(EDITORIAL);

const proseOf = (basename: string) => readFileSync(`${ARTICLES}${basename}.md`, "utf8");

/** Everything the page puts in front of a reader, prose included. */
function pageCopy(path: string): string {
  const a = EDITORIAL[path];
  return [
    a.title,
    a.seoTitle,
    a.metaDescription,
    a.standfirst,
    ...a.picks.flatMap((p) => [p.award, p.why, p.wrongFor]),
    ...a.faq.flatMap((f) => [f.q, f.a]),
    proseOf(a.prose),
  ]
    .join(" ")
    .toLowerCase();
}

describe("editorial pages", () => {
  it.each(ALL.map((a) => a.path))("%s is a real, indexable, crawlable route", (path) => {
    const route = ROUTES.find((r) => r.path === path);
    expect(route, `${path} has no route registry entry`).toBeDefined();
    expect(route!.status).toBe("live");
    expect(route!.indexable).toBe(true);
    // A page nobody can find is not published. This is exactly what was missed
    // when the window category went live.
    expect(route!.inSitemap).toBe(true);
  });

  it.each(ALL.map((a) => a.path))("%s has its prose on disk", (path) => {
    expect(existsSync(`${ARTICLES}${EDITORIAL[path].prose}.md`)).toBe(true);
  });

  it.each(ALL.map((a) => a.path))("%s keys every record by its own path", (path) => {
    expect(EDITORIAL[path].path).toBe(path);
  });

  /**
   * THE RULE THIS FILE EXISTS FOR, MADE MECHANICAL.
   *
   * No price is ever invented, and on these pages that goes further: no price
   * is printed at all. A ranked list is read months after it is written, and a
   * figure typed into one is a figure nobody re-checked. Price belongs on the
   * review and in the buy box, beside the date it was read.
   *
   * The pattern deliberately catches "$799", "$1,299" and "1299 dollars" —
   * every shape a price has actually taken on this site.
   */
  it.each(ALL.map((a) => a.path))("%s prints no price anywhere", (path) => {
    const copy = pageCopy(path);
    expect(copy).not.toMatch(/\$\s?\d/);
    expect(copy).not.toMatch(/\d[\d,]*\s*dollars/);
  });

  it.each(ALL.map((a) => a.path))("%s gives every pick someone it is wrong for", (path) => {
    for (const pick of EDITORIAL[path].picks) {
      // An award with nobody it is wrong for is an advert.
      expect(pick.wrongFor.length, `${pick.award} has no rule-out`).toBeGreaterThan(30);
      expect(pick.why.length).toBeGreaterThan(60);
      expect(pick.award.length).toBeGreaterThan(3);
    }
  });

  it.each(ALL.map((a) => a.path))("%s never awards the same job twice", (path) => {
    const awards = EDITORIAL[path].picks.map((p) => p.award);
    expect(new Set(awards).size).toBe(awards.length);
    const slugs = EDITORIAL[path].picks.map((p) => p.productSlug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  /**
   * A pick whose product is not in comparisonSlugs renders with no catalogue
   * facts beside it and is silently dropped by the page builder. Catching it
   * here means the page is never quietly one recommendation shorter than the
   * file says it is.
   */
  it.each(ALL.map((a) => a.path))("%s can render every pick it declares", (path) => {
    for (const pick of EDITORIAL[path].picks) {
      expect(
        EDITORIAL[path].comparisonSlugs,
        `${pick.productSlug} is picked but not in comparisonSlugs`,
      ).toContain(pick.productSlug);
    }
  });

  it.each(ALL.map((a) => a.path))("%s only names products still in the catalogue", (path) => {
    for (const slug of EDITORIAL[path].comparisonSlugs) {
      expect(productEditorial(slug), `${slug} has no product record`).toBeDefined();
      // An archived or withdrawn product loses its page, so an award pointing
      // at one is an award pointing at a redirect.
      expect(catalogueStatusOf(slug), `${slug} is not a live catalogue entry`).toBe("active");
    }
  });

  it.each(ALL.map((a) => a.path))("%s has a keyword register row", (path) => {
    expect(keywordsFor(path), `${path} is unguarded by the keyword register`).toBeDefined();
  });

  /**
   * The same assertion the category hubs get: copy gets rewritten, and if the
   * rewrite drops the term the page was built around this fails on that commit
   * rather than in a rank report three months later.
   */
  it.each(ALL.map((a) => a.path))("%s still contains every term it targets", (path) => {
    const copy = pageCopy(path);
    expect(requiredTerms(path).filter((t) => !copy.includes(t))).toEqual([]);
  });

  /**
   * A page must not LEAD with a term it has handed to another page.
   *
   * The subtlety, which the category-hub version of this assertion never has
   * to deal with: here the ceded term is usually a SUBSTRING of the page's own
   * primary. "best robotic pool cleaner" cedes "robotic pool cleaner" to the
   * hub, and it is supposed to — while being completely unable to say its own
   * name without containing it.
   *
   * So the page's own targeted terms are struck out of the headline copy
   * first, longest first so the most specific match wins, and the ceded term
   * is looked for in what is left. That catches a title that genuinely reaches
   * for the head term and lets a title that merely spells itself correctly
   * through.
   */
  it.each(ALL.map((a) => a.path))("%s does not chase a term it has ceded", (path) => {
    const a = EDITORIAL[path];
    const k = keywordsFor(path)!;
    const own = [k.primary, ...k.secondary]
      .map((t) => t.term)
      .sort((x, y) => y.length - x.length);

    let front = `${a.title} ${a.seoTitle} ${a.metaDescription}`.toLowerCase();
    for (const term of own) front = front.split(term).join(" ");

    for (const c of k.cededTo ?? []) {
      expect(front, `${path} leads with a term it ceded`).not.toContain(c.term);
    }
  });

  /**
   * The point of writing prose full of product names is that they become
   * links. If the linker finds nothing, either the writing changed or the
   * anchor list did — and the page silently stops passing any signal to the
   * reviews it is built on.
   */
  it.each(ALL.map((a) => a.path))("%s actually links out of its prose", (path) => {
    const a = EDITORIAL[path];
    const { applied } = applyInternalLinks(proseOf(a.prose), anchorsFor(a.categorySlug), a.path);
    expect(applied.length, `${path} links to nothing`).toBeGreaterThanOrEqual(5);
    // And never to itself: a self-link is a dead end for a reader.
    for (const link of applied) expect(link.href.split("#")[0]).not.toBe(a.path);
  });

  it("every live anchor points at a route that exists", () => {
    for (const a of ALL) {
      for (const anchor of liveAnchorsFor(a.categorySlug)) {
        const target = anchor.href.split("#")[0];
        const known =
          ROUTES.some((r) => r.path === target) || target.startsWith("/robots/");
        expect(known, `${anchor.anchor} → ${anchor.href} is not a known route`).toBe(true);
      }
    }
  });

  /**
   * The linker takes the FIRST anchor that matches a phrase, so a short anchor
   * listed above a longer one containing it swallows the longer one's traffic.
   * "cordless" above "cordless robotic pool cleaner" would send every reader
   * of the 22,200/mo phrase to the hub instead of to the page built for it.
   */
  it("orders overlapping anchors longest-first", () => {
    for (const cat of new Set(ALL.map((a) => a.categorySlug))) {
      const anchors = liveAnchorsFor(cat).map((a) => a.anchor.toLowerCase());
      anchors.forEach((shorter, i) => {
        const swallowed = anchors
          .slice(i + 1)
          .filter((longer) => longer !== shorter && longer.includes(shorter));
        expect(swallowed, `"${shorter}" is listed before "${swallowed[0]}" and would swallow it`)
          .toEqual([]);
      });
    }
  });

  /**
   * The reverse of the first assertion, and the one that catches the failure
   * that actually happens: a route flipped to `live` in the registry with no
   * content behind it. That is how `/best-robots/robotic-pool-cleaners/` spent
   * five days as a RoutePlaceholder — indexable in principle, empty in fact.
   *
   * Scoped to the best-of section because every URL under it is an article.
   * The guides section also holds category hubs, which are pages in their own
   * right and correctly have no editorial record.
   */
  it("has content behind every live best-of URL", () => {
    const bestOf = ROUTES.filter(
      (r) => r.section === "best" && r.status === "live" && r.path !== "/best-robots/",
    );
    expect(bestOf.length).toBeGreaterThan(0);
    for (const r of bestOf) {
      expect(EDITORIAL[r.path], `${r.path} is live with no editorial record`).toBeDefined();
    }
  });

  it("keeps the pool guides and best-of pages distinct", () => {
    const pool = editorialForCategory("robotic-pool-cleaners");
    expect(pool.length).toBeGreaterThanOrEqual(3);
    // A guide that ranks products is a best-of wearing a hat, and it would
    // compete with the best-of pages for the same result set.
    for (const g of pool.filter((p) => p.path.startsWith("/guides/"))) {
      expect(g.picks, `${g.path} ranks products`).toEqual([]);
    }
    for (const b of pool.filter((p) => p.path.startsWith("/best-robots/"))) {
      expect(b.picks.length, `${b.path} ranks nothing`).toBeGreaterThan(2);
    }
  });
});

/**
 * The comparison hub is the same kind of page as a best-of — an argument
 * joined to the catalogue — so it gets the same guarantees. It lives in its
 * own module because a comparison page has pairs rather than ranked picks and
 * has to keep working for a category that has no comparison research at all.
 */
describe("comparison hubs", () => {
  const CMP = Object.values(COMPARE_PAGES);
  const comparePath = (slug: string) => `/compare/${slug}/`;

  const compareCopy = (slug: string): string => {
    const c = COMPARE_PAGES[slug];
    return [
      c.title,
      c.seoTitle,
      c.metaDescription,
      c.standfirst,
      ...c.pairs.flatMap((p) => [p.heading, p.verdict, p.body, ...p.picks.map((x) => x.why)]),
      ...c.faq.flatMap((f) => [f.q, f.a]),
      proseOf(c.prose),
    ]
      .join(" ")
      .toLowerCase();
  };

  it.each(CMP.map((c) => c.categorySlug))("%s has a live, indexable compare route", (slug) => {
    const route = ROUTES.find((r) => r.path === comparePath(slug));
    expect(route, `${comparePath(slug)} has no route registry entry`).toBeDefined();
    expect(route!.status).toBe("live");
    expect(route!.indexable).toBe(true);
    expect(route!.inSitemap).toBe(true);
  });

  it.each(CMP.map((c) => c.categorySlug))("%s comparison prints no price", (slug) => {
    const copy = compareCopy(slug);
    expect(copy).not.toMatch(/\$\s?\d/);
    expect(copy).not.toMatch(/\d[\d,]*\s*dollars/);
  });

  it.each(CMP.map((c) => c.categorySlug))("%s names only catalogue products", (slug) => {
    for (const pair of COMPARE_PAGES[slug].pairs) {
      for (const pick of pair.picks) {
        expect(productEditorial(pick.slug), `${pick.slug} has no product record`).toBeDefined();
        expect(catalogueStatusOf(pick.slug), `${pick.slug} is not live`).toBe("active");
      }
    }
  });

  it.each(CMP.map((c) => c.categorySlug))("%s gives every matchup a verdict", (slug) => {
    for (const pair of COMPARE_PAGES[slug].pairs) {
      // The answer comes before the reasoning, on every page on this site.
      expect(pair.verdict.length, `${pair.heading} has no verdict`).toBeGreaterThan(25);
      expect(pair.body.length).toBeGreaterThan(80);
      expect(pair.picks.length).toBeGreaterThan(0);
      expect(pair.id).toMatch(/^[a-z0-9-]+$/);
    }
    const ids = COMPARE_PAGES[slug].pairs.map((p) => p.id);
    expect(new Set(ids).size, "two matchups share an anchor id").toBe(ids.length);
  });

  it.each(CMP.map((c) => c.categorySlug))("%s still contains every term it targets", (slug) => {
    expect(requiredTerms(comparePath(slug)).filter((t) => !compareCopy(slug).includes(t))).toEqual([]);
  });

  it.each(CMP.map((c) => c.categorySlug))("%s does not chase a term it has ceded", (slug) => {
    const c = COMPARE_PAGES[slug];
    const k = keywordsFor(comparePath(slug))!;
    const own = [k.primary, ...k.secondary].map((t) => t.term).sort((x, y) => y.length - x.length);
    let front = `${c.title} ${c.seoTitle} ${c.metaDescription}`.toLowerCase();
    for (const term of own) front = front.split(term).join(" ");
    for (const ceded of k.cededTo ?? []) {
      expect(front, `${comparePath(slug)} leads with a term it ceded`).not.toContain(ceded.term);
    }
  });

  it.each(CMP.map((c) => c.categorySlug))("%s links out of its prose", (slug) => {
    const c = COMPARE_PAGES[slug];
    const { applied } = applyInternalLinks(proseOf(c.prose), anchorsFor(slug), comparePath(slug));
    expect(applied.length, `${comparePath(slug)} links to nothing`).toBeGreaterThanOrEqual(5);
    for (const link of applied) expect(link.href.split("#")[0]).not.toBe(comparePath(slug));
  });
});
