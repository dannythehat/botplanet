import { describe, expect, it } from "vitest";
import {
  activeNavPath,
  breadcrumbsFor,
  isNavActive,
  normalisePath,
  resolveRedirect,
  safeQuery,
} from "../src/lib/routing";
import {
  CATEGORIES,
  REDIRECTS,
  ROUTES,
  builtBestOfCategories,
  categoryRoutes,
  productInSitemap,
  sitemapRoutes,
} from "../src/content/routes";
import { RETIRED_SLUGS, MERGED_REVIEWS } from "../src/content/product-names";
import { COMPARE_PAGES, comparePageIsSubstantive } from "../src/content/compare-page";

describe("normalisePath — locked URL standards", () => {
  it("lowercases, collapses slashes and enforces one trailing slash", () => {
    expect(normalisePath("/Robots/Robotic-Pool-Cleaners")).toBe("/robots/robotic-pool-cleaners/");
    expect(normalisePath("//guides//")).toBe("/guides/");
    expect(normalisePath("/ABOUT/")).toBe("/about/");
    expect(normalisePath("")).toBe("/");
  });

  it("leaves already-canonical paths untouched", () => {
    for (const r of ROUTES) expect(normalisePath(r.path)).toBe(r.path);
  });

  it("never rewrites passthrough or file paths", () => {
    expect(normalisePath("/go/pool-beatbot-ultra-amazon")).toBe("/go/pool-beatbot-ultra-amazon");
    expect(normalisePath("/api/botmatch")).toBe("/api/botmatch");
    expect(normalisePath("/admin/offers")).toBe("/admin/offers");
    expect(normalisePath("/sitemap.xml")).toBe("/sitemap.xml");
    expect(normalisePath("/robots.txt")).toBe("/robots.txt");
    expect(normalisePath("/fonts/space-grotesk-latin.woff2")).toBe("/fonts/space-grotesk-latin.woff2");
  });
});

describe("resolveRedirect", () => {
  /* "/botmatch/" IS NO LONGER ONE OF THESE, and the change is the point of the
     universal finder. It used to redirect onto the pool funnel, so anyone who
     typed the obvious URL was asked about their swimming pool whatever they
     had come for. It is a real page now, and it asks what job they want done
     before it asks anything else. The two legacy paths still forward, because
     they were only ever the pool matcher. */
  it("sends legacy BotMatch entries to the category journey", () => {
    for (const p of ["/find-my-robot/", "/find-my-robot/pool-cleaners/"]) {
      const r = resolveRedirect(p);
      expect(r?.to).toBe("/botmatch/robotic-pool-cleaners/");
      expect(r?.status).toBe(301);
    }
  });

  it("no longer sends /botmatch/ to the pool funnel", () => {
    expect(resolveRedirect("/botmatch/")).toBeNull();
  });

  it("redirects the old /best/ section to /best-robots/", () => {
    expect(resolveRedirect("/best/")?.to).toBe("/best-robots/");
    expect(resolveRedirect("/best/robotic-pool-cleaners/")?.to).toBe("/best-robots/robotic-pool-cleaners/");
  });

  it("redirects legacy category slugs", () => {
    expect(resolveRedirect("/robots/pool-cleaners/")?.to).toBe("/robots/robotic-pool-cleaners/");
    expect(resolveRedirect("/compare/pool-cleaners/")?.to).toBe("/compare/robotic-pool-cleaners/");
  });

  it("normalises casing and missing trailing slashes in one hop", () => {
    expect(resolveRedirect("/Guides")?.to).toBe("/guides/");
    expect(resolveRedirect("/FIND-MY-ROBOT")?.to).toBe("/botmatch/robotic-pool-cleaners/");
  });

  it("returns null for canonical paths, so there is no redirect loop", () => {
    for (const r of ROUTES) expect(resolveRedirect(r.path)).toBeNull();
  });

  it("produces no redirect chains: every destination is already canonical", () => {
    for (const { to } of REDIRECTS) {
      expect(resolveRedirect(to)).toBeNull();
    }
  });

  it("does not redirect unknown paths — they must 404", () => {
    expect(resolveRedirect("/this-page-does-not-exist/")).toBeNull();
    expect(resolveRedirect("/robots/robotic-pool-cleaners/no-such-product/")).toBeNull();
  });

  it("leaves passthrough routes alone", () => {
    expect(resolveRedirect("/go/some-key")).toBeNull();
    expect(resolveRedirect("/api/admin/login")).toBeNull();
  });
});

describe("safeQuery", () => {
  it("keeps campaign parameters and drops everything else", () => {
    expect(safeQuery("?utm_source=x&secret=abc&q=pool")).toBe("?utm_source=x&q=pool");
  });

  it("returns an empty string when nothing is worth keeping", () => {
    expect(safeQuery("?answers=large-pool&budget=800")).toBe("");
    expect(safeQuery("")).toBe("");
    expect(safeQuery("?")).toBe("");
  });
});

describe("breadcrumbsFor", () => {
  it("emits nothing for the homepage", () => {
    expect(breadcrumbsFor("/")).toEqual([]);
  });

  it("builds the category trail", () => {
    expect(breadcrumbsFor("/robots/robotic-pool-cleaners/")).toEqual([
      { name: "Robot Categories", path: "/robots/" },
      { name: "Robotic Pool Cleaners", path: "/robots/robotic-pool-cleaners/" },
    ]);
  });

  it("builds the product trail with the product as the final crumb", () => {
    const c = breadcrumbsFor("/robots/robotic-pool-cleaners/dolphin-e10/", "Dolphin E10");
    expect(c.map((x) => x.name)).toEqual(["Robot Categories", "Robotic Pool Cleaners", "Dolphin E10"]);
    expect(c[c.length - 1].path).toBe("/robots/robotic-pool-cleaners/dolphin-e10/");
  });

  it("builds the comparison trail under Compare, not under Shop", () => {
    expect(breadcrumbsFor("/compare/robotic-pool-cleaners/").map((x) => x.name)).toEqual([
      "Compare Robots",
      "Robotic Pool Cleaners",
    ]);
  });

  it("builds the BotMatch trail under the category", () => {
    expect(breadcrumbsFor("/botmatch/robotic-pool-cleaners/").map((x) => x.name)).toEqual([
      "Robot Categories",
      "Robotic Pool Cleaners",
      "Find My Pool Cleaner",
    ]);
  });

  it("builds a guide article trail", () => {
    expect(breadcrumbsFor("/guides/how-robot-pool-cleaners-work/", "How robot pool cleaners work").map((x) => x.name)).toEqual([
      "Guides",
      "How robot pool cleaners work",
    ]);
  });

  it("omits a trail that would only repeat the page title", () => {
    expect(breadcrumbsFor("/about/")).toEqual([]);
    expect(breadcrumbsFor("/guides/")).toEqual([]);
  });
});

describe("navigation active state", () => {
  it("marks the section containing the current page", () => {
    expect(isNavActive("/robots/", "/robots/robotic-pool-cleaners/dolphin-e10/")).toBe(true);
    expect(isNavActive("/compare/", "/robots/robotic-pool-cleaners/")).toBe(false);
  });

  it("never marks home active on a sub-page", () => {
    expect(isNavActive("/", "/guides/")).toBe(false);
    expect(isNavActive("/", "/")).toBe(true);
  });

  it("chooses exactly one nav item — the most specific match", () => {
    const nav = ["/robots/", "/compare/", "/guides/"];
    expect(activeNavPath(nav, "/robots/robotic-pool-cleaners/dolphin-e10/")).toBe("/robots/");
    expect(activeNavPath(nav, "/deals/")).toBeNull();
  });
});

describe("sitemap inclusion rules", () => {
  it("contains only canonical, indexable, non-hidden routes", () => {
    for (const r of sitemapRoutes()) {
      expect(r.indexable).toBe(true);
      expect(r.inSitemap).toBe(true);
      expect(r.status).not.toBe("hidden");
      expect(r.path).toBe(normalisePath(r.path));
    }
  });

  it("excludes search, saved and every coming-soon route", () => {
    const paths = sitemapRoutes().map((r) => r.path);
    expect(paths).not.toContain("/search/");
    expect(paths).not.toContain("/saved/");
    expect(paths).not.toContain("/deals/");
    expect(paths).not.toContain("/news/");
  });

  it("never lists a path that is itself a redirect source", () => {
    const aliases = new Set(REDIRECTS.map((r) => normalisePath(r.from)));
    for (const r of sitemapRoutes()) expect(aliases.has(r.path)).toBe(false);
  });
});

/**
 * The /best-robots/ index links a card per category, and it linked wherever the
 * CATEGORY was live rather than wherever the PAGE was written — seven cards
 * onto a 404. This asserts the fact the page now reads instead.
 */
describe("builtBestOfCategories", () => {
  it("names only categories whose best-of URL is a registered live route", () => {
    const live = new Set(ROUTES.filter((r) => r.status === "live").map((r) => r.path));
    const built = builtBestOfCategories();
    expect(built.size).toBeGreaterThan(0);
    for (const slug of built) {
      expect(live.has(categoryRoutes(slug).best), `/best-robots/${slug}/ is not a live route`).toBe(
        true,
      );
    }
  });

  it("leaves out a live category with no best-of page written", () => {
    const built = builtBestOfCategories();
    const liveCats = CATEGORIES.filter((c) => c.launch === "live").map((c) => c.slug);
    const unwritten = liveCats.filter((s) => !built.has(s));
    const live = new Set(ROUTES.filter((r) => r.status === "live").map((r) => r.path));
    for (const slug of unwritten) {
      expect(live.has(categoryRoutes(slug).best), `${slug} would link at a 404`).toBe(false);
    }
  });
});

describe("comparePageIsSubstantive", () => {
  const compareRoutes = () => sitemapRoutes().filter((r) => r.section === "compare" && r.category);

  it("keeps out a comparison of nothing, and of one machine", () => {
    expect(comparePageIsSubstantive("robot-vacuums", 0)).toBe(false);
    expect(comparePageIsSubstantive("robot-vacuums", 1)).toBe(false);
  });

  it("lets a category in as soon as it has two published machines", () => {
    expect(comparePageIsSubstantive("robot-vacuums", 2)).toBe(true);
  });

  it("keeps a category with written comparison research whatever the count", () => {
    for (const slug of Object.keys(COMPARE_PAGES)) {
      expect(comparePageIsSubstantive(slug, 0)).toBe(true);
    }
  });

  /* Every compare route in the registry is category-scoped except the hub, and
     the hub carries no `category` — so nothing may slip past the filter for
     want of one. */
  it("gives every registry compare route but the hub a category to judge", () => {
    const compare = sitemapRoutes().filter((r) => r.section === "compare");
    const withoutCategory = compare.filter((r) => !r.category).map((r) => r.path);
    expect(withoutCategory).toEqual(["/compare/"]);
    expect(compareRoutes().length).toBeGreaterThan(0);
  });
});

describe("registry integrity", () => {
  it("has unique canonical paths", () => {
    const seen = new Set<string>();
    for (const r of ROUTES) {
      expect(seen.has(r.path)).toBe(false);
      seen.add(r.path);
    }
  });

  it("has no alias colliding with a real route", () => {
    const real = new Set(ROUTES.map((r) => r.path));
    for (const { from } of REDIRECTS) expect(real.has(normalisePath(from))).toBe(false);
  });

  it("gives every route a resolvable parent", () => {
    const real = new Set(ROUTES.map((r) => r.path));
    for (const r of ROUTES) {
      if (r.parent) expect(real.has(r.parent)).toBe(true);
    }
  });

  it("keeps every registry path canonical", () => {
    for (const r of ROUTES) expect(r.path).toBe(normalisePath(r.path));
  });
});

/**
 * GATE 3, from the snow-blower merge review of 11 August 2026.
 *
 * The sitemap decided product inclusion with `liveSlugs.has(categorySlug)`,
 * built from `liveCategories()`, which returns only `launch === "live"`. That
 * silently dropped every product in a HIDDEN category — a reserved slug with
 * no hub, no route and no comparative surfaces, but with real reviews beneath
 * it that `[slug].astro` renders without ever setting noindex.
 *
 * So those pages indexed and this site never declared them. The failure is
 * invisible from the page (it renders perfectly) and invisible from the
 * sitemap (the URL simply is not there), which is why it needs a test rather
 * than a comment.
 */
describe("productInSitemap — hidden categories ship their reviews", () => {
  const live = CATEGORIES.find((c) => c.launch === "live")!.slug;
  const hidden = CATEGORIES.find((c) => c.launch === "hidden")!.slug;

  it("has a hidden category to test against", () => {
    // If this ever fails the fixture is gone, not the rule.
    expect(hidden).toBeTruthy();
  });

  it("admits a product in a live category", () => {
    expect(productInSitemap({ slug: "x", categorySlug: live, hasPublishedReview: true })).toBe(true);
    expect(productInSitemap({ slug: "x", categorySlug: live, hasPublishedReview: false })).toBe(true);
  });

  it("admits a REVIEWED product in a hidden category — the bug this fixes", () => {
    expect(productInSitemap({ slug: "x", categorySlug: hidden, hasPublishedReview: true })).toBe(true);
  });

  it("keeps an unreviewed product in a hidden category out", () => {
    // A hidden category is a reservation. Only a written review earns the URL.
    expect(productInSitemap({ slug: "x", categorySlug: hidden, hasPublishedReview: false })).toBe(false);
  });

  it("keeps a coming_soon category's products out either way", () => {
    const soon = CATEGORIES.find((c) => c.launch === "coming_soon")?.slug;
    if (!soon) return;
    expect(productInSitemap({ slug: "x", categorySlug: soon, hasPublishedReview: true })).toBe(false);
  });

  it("keeps retired and merged slugs out whatever their category", () => {
    for (const slug of Object.keys(RETIRED_SLUGS)) {
      expect(productInSitemap({ slug, categorySlug: live, hasPublishedReview: true })).toBe(false);
    }
    for (const slug of Object.keys(MERGED_REVIEWS)) {
      expect(productInSitemap({ slug, categorySlug: live, hasPublishedReview: true })).toBe(false);
    }
  });

  it("never admits a hidden category's own hub, comparison or matcher", () => {
    /* Those come from the route registry rather than from this predicate, and
       a hidden category has no routes registered — which is what makes the
       hidden-category URL safe in the first place. Asserted here so the two
       halves of the rule are checked in one place. */
    const paths = sitemapRoutes().map((r) => r.path);
    expect(paths).not.toContain(`/robots/${hidden}/`);
    expect(paths).not.toContain(`/compare/${hidden}/`);
    expect(paths).not.toContain(`/botmatch/${hidden}/`);
    expect(paths).not.toContain(`/best-robots/${hidden}/`);
  });
});
