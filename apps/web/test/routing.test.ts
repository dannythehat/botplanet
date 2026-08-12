import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import {
  activeNavPath,
  breadcrumbsFor,
  isNavActive,
  normalisePath,
  isGone,
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
  LEGACY_REDIRECTS,
  LEGACY_CONTENT_REDIRECTS,
  LEGACY_PREFIX_FALLBACK,
} from "../src/content/routes";
import { RETIRED_SLUGS, MERGED_REVIEWS } from "../src/content/product-names";
import { COMPARE_PAGES, comparePageIsSubstantive } from "../src/content/compare-page";
import { BAR_ITEMS, FOOTER_GROUPS, UTILITY_ITEMS } from "../src/content/nav-surfaces";
import { routes, LAUNCH_CATEGORY } from "../src/content/nav";
import { heroFor } from "../src/content/category-hero";
import { CATEGORY_ANCHORS, RETROFITTED_INBOUND } from "../src/content/internal-links";
import { PAGE_PLAN } from "../src/content/seo/page-plan";
import { KEYWORD_REGISTER } from "../src/content/seo/keyword-register";
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

describe("legacy redirects from the previous site", () => {
  /**
   * See the long note above LEGACY_REDIRECTS in content/routes.ts. Google's
   * index still holds the old site's URLs; these turn each dead one into a
   * signpost instead of a 404.
   */
  it("never redirects a path that is a live route today", () => {
    /* THE MISTAKE THIS CAUGHT ON THE WAY IN: /contact/ existed on the old site
       AND exists on this one, and was about to be redirected to /about/. A
       legacy map is written by looking at what USED to exist, which is exactly
       the frame of mind in which you forget to check what still does. */
    const live = new Set(ROUTES.map((r) => r.path));
    const broken = LEGACY_REDIRECTS.filter((r) => live.has(r.from)).map((r) => r.from);
    expect(broken).toEqual([]);
  });

  it("sends every legacy path somewhere that exists, in one hop", () => {
    for (const r of LEGACY_REDIRECTS) {
      const first = resolveRedirect(r.from);
      expect(first, `${r.from} does not redirect`).not.toBeNull();
      // One hop, never a chain: the destination must be final.
      expect(resolveRedirect(first!.to), `${r.from} → ${first!.to} redirects again`).toBeNull();
      expect(first!.status).toBe(301);
    }
  });

  it("gives every legacy entry a written reason", () => {
    for (const r of LEGACY_REDIRECTS) expect(r.why.length).toBeGreaterThan(20);
  });

  it("maps an old product URL onto the page that replaced it", () => {
    const r = resolveRedirect("/product/sphero-bolt/");
    expect(r?.to).toBe("/robots/educational-coding-robots/sphero-bolt/");
    expect(r?.status).toBe(301);
  });

  it("matches an old review URL that carried a headline after the slug", () => {
    // "sphero-bolt-review-the-smartest-hamster-ball-in-the-galaxy"
    const r = resolveRedirect("/reviews/sphero-bolt-review-the-smartest-hamster-ball-in-the-galaxy/");
    expect(r?.to).toBe("/robots/educational-coding-robots/sphero-bolt/");
  });

  it("sends a product we no longer hold to the category that covers it", () => {
    expect(resolveRedirect("/product/irobot-roomba-j9-plus/")?.to).toBe("/robots/robot-vacuums/");
    expect(resolveRedirect("/product/temi-v3-robot/")?.to).toBe("/robots/companion-robots/");
  });

  it("404s an unknown path that is not the old site's", () => {
    /* The standard at the top of lib/routing.ts still holds for the open web:
       unknown routes 404 and are never swept to the homepage. */
    expect(resolveRedirect("/nonsense/")).toBeNull();
    expect(resolveRedirect("/robots/not-a-category/")).toBeNull();
  });

  /* THIS REVERSES A PREVIOUS DECISION, on the owner's instruction of 12 August
     2026, and the reversal is narrow enough to be worth stating.

     The rule was "a redirect that cannot be justified is worse than an honest
     404". That is right in general and wrong for these four prefixes, because
     they are not unknown paths — they are the previous robot site's content
     URLs, and a request for one is a request for robots on this domain. The
     robot index answers that. It stays a 404 everywhere else. */
  it("sends the old site's unmapped content URLs to the robot index", () => {
    for (const p of [
      "/blog/whatever/",
      "/blog/some-old-listicle/",
      "/category/anything/",
      "/product/some-machine-that-never-existed/",
      "/reviews/a-review-of-something-gone/",
    ]) {
      const r = resolveRedirect(p);
      expect(r?.to, p).toBe("/robots/");
      expect(r?.status, p).toBe(301);
    }
  });

  it("maps the four URLs Search Console actually showed, exactly", () => {
    expect(resolveRedirect("/product/emo-ai-desktop-pet/")?.to).toBe(
      "/robots/companion-robots/living-ai-emo/",
    );
    expect(
      resolveRedirect("/reviews/worx-landroid-m-review-your-weekend-back-for-a-grand/")?.to,
    ).toBe("/robots/robotic-lawn-mowers/worx-landroid-vision-wr320/");
    expect(resolveRedirect("/blog/best-ai-pet-robots/")?.to).toBe("/robots/companion-robots/");
    expect(resolveRedirect("/category/wearable-robots/")?.to).toBe("/robots/");
  });

  it("reaches those mappings in ONE hop from the unslashed form", () => {
    /* The trailing-slash normaliser used to win this race: /product/x answered
       301 to /product/x/, which then answered 301 again. Two hops to say one
       thing, and Google discounts the second. */
    const r = resolveRedirect("/product/emo-ai-desktop-pet");
    expect(r?.to).toBe("/robots/companion-robots/living-ai-emo/");
  });
});

describe("410 Gone — the previous sites' dead sections", () => {
  it("marks every gone prefix gone, with or without a trailing slash", () => {
    for (const p of ["/gifts", "/gifts/", "/quiz", "/quiz/", "/shop", "/shop/"]) {
      expect(isGone(p), p).toBe(true);
    }
  });

  it("marks children of a gone prefix gone", () => {
    for (const p of ["/gifts/anything/", "/quiz/step-2/", "/shop/cleaning-robots/"]) {
      expect(isGone(p), p).toBe(true);
    }
  });

  it("ignores the query string, which is how the old storefront built its URLs", () => {
    /* isGone takes a pathname; the middleware passes url.pathname, so
       /shop?category=x arrives here as "/shop". Asserted so a future change
       that starts passing the full URL is caught. */
    expect(isGone("/shop")).toBe(true);
  });

  it("does not catch a live path that merely starts with the same letters", () => {
    for (const p of ["/shopping-guide/", "/quizzes-and-tools/", "/giftsomething/"]) {
      expect(isGone(p), p).toBe(false);
    }
  });

  it("leaves every live route alone", () => {
    for (const p of ["/", "/robots/", "/robots/robotic-pool-cleaners/", "/guides/", "/botmatch/"]) {
      expect(isGone(p), p).toBe(false);
    }
  });

  it("never touches assets or passthrough paths", () => {
    for (const p of ["/go/pool-aiper-scuba-s1-amazon", "/api/botmatch", "/_astro/x.js"]) {
      expect(isGone(p), p).toBe(false);
    }
  });

  it("does not also redirect a gone path — 410 is the whole answer", () => {
    /* If both fired, the middleware's ordering would decide the outcome and a
       reordering would silently change it. Neither should have an opinion. */
    for (const p of ["/gifts/", "/quiz/", "/shop/"]) {
      expect(resolveRedirect(p)?.to, p).not.toBe("/robots/");
    }
  });
});

describe("no redirect points at another redirect", () => {
  it("resolves every registry destination to a final URL in one hop", () => {
    const targets = [
      ...REDIRECTS.map((r) => r.to),
      ...LEGACY_CONTENT_REDIRECTS.map((r) => r.to),
      LEGACY_PREFIX_FALLBACK.to,
    ];
    for (const to of targets) {
      const again = resolveRedirect(to);
      expect(again, `${to} redirects onward — that is a chain`).toBeNull();
    }
  });

  it("never sends a redirect to a path that is itself 410", () => {
    const targets = [
      ...REDIRECTS.map((r) => r.to),
      ...LEGACY_CONTENT_REDIRECTS.map((r) => r.to),
      LEGACY_PREFIX_FALLBACK.to,
    ];
    for (const to of targets) {
      expect(isGone(to), `${to} is a redirect target AND gone`).toBe(false);
    }
  });
});

/**
 * THE BEST-OF CONSOLIDATION, 12 August 2026.
 *
 * Nine categories are live and three best-of pages existed. Six were never
 * built because each category's research measured its head term against its
 * "best" term, found five or more shared results in the top ten, and ruled one
 * page — which is the rule this site runs on. Window was measured at SIX and
 * got a second page anyway, two days after its own keyword register row said
 * not to. That page is now an alias of its hub.
 *
 * These assertions are the shape of the site after that, so nobody has to
 * remember which of the two rulings applied to which category.
 */
describe("best-of consolidation", () => {
  const WINDOW_BEST = "/best-robots/window-cleaning-robots/";
  const WINDOW_HUB = "/robots/window-cleaning-robots/";
  const SURVIVORS = ["/best-robots/robotic-pool-cleaners/", "/best-robots/robotic-lawn-mowers/"];

  it("301s the window best-of to the window hub in one hop", () => {
    const hop = resolveRedirect(WINDOW_BEST);
    expect(hop?.to).toBe(WINDOW_HUB);
    expect(hop?.status).toBe(301);
    // And the destination is final — not itself a redirect, and not gone.
    expect(resolveRedirect(WINDOW_HUB)).toBeNull();
    expect(isGone(WINDOW_HUB)).toBe(false);
  });

  it("also catches the older /best/ shape of the same URL", () => {
    expect(resolveRedirect("/best/window-cleaning-robots/")?.to).toBe(WINDOW_HUB);
  });

  it("keeps the window best-of out of the sitemap and out of the registry", () => {
    expect(sitemapRoutes().map((r) => r.path)).not.toContain(WINDOW_BEST);
    expect(ROUTES.some((r) => r.path === WINDOW_BEST)).toBe(false);
    // The hub itself is still declared — folding the shortlist in must not
    // take the page it folded into with it.
    expect(sitemapRoutes().map((r) => r.path)).toContain(WINDOW_HUB);
  });

  it("leaves both surviving best-of pages live and declared", () => {
    for (const path of SURVIVORS) {
      const route = ROUTES.find((r) => r.path === path);
      expect(route, `${path} lost its route record`).toBeDefined();
      expect(route!.status).toBe("live");
      expect(route!.indexable).toBe(true);
      expect(sitemapRoutes().map((r) => r.path), `${path} left the sitemap`).toContain(path);
      expect(resolveRedirect(path), `${path} redirects`).toBeNull();
    }
  });

  it("names only the two survivors as built", () => {
    expect([...builtBestOfCategories()].sort()).toEqual([
      "robotic-lawn-mowers",
      "robotic-pool-cleaners",
    ]);
  });

  /**
   * A section index is a promise that a section is behind it. Two pages is not
   * a section, and six of the seven that would have filled it were refused on
   * evidence rather than merely unbuilt. It stays in the footer, which is a
   * link rather than a promise.
   */
  it("takes /best-robots/ out of the navigation but keeps it reachable", () => {
    const best = ROUTES.find((r) => r.path === "/best-robots/")!;
    expect(BAR_ITEMS.map((i) => i.href)).not.toContain("/best-robots/");
    expect(BAR_ITEMS.some((i) => i.href.startsWith("/best-robots/"))).toBe(false);
    expect(UTILITY_ITEMS.map((i) => i.href)).not.toContain("/best-robots/");
    // Reachable, from the one surface that is a directory rather than a
    // promise of a section behind it.
    expect(best.footerGroup).toBe("Explore");
    expect(FOOTER_GROUPS.flatMap((g) => g.links).map((l) => l.href)).toContain("/best-robots/");
  });

  /**
   * The mega panel's "Best pool robots" item pointed at /best-robots/ — the
   * index of every category — under a column headed "Robotic pool cleaners".
   * A nav item that names one page and links to another is the failure this
   * whole consolidation is about, in miniature.
   */
  it("sends the mega panel's pool item to the pool ranking, not the index", () => {
    expect(routes.best(LAUNCH_CATEGORY)).toBe("/best-robots/robotic-pool-cleaners/");
    expect(ROUTES.some((r) => r.path === routes.best(LAUNCH_CATEGORY) && r.status === "live")).toBe(
      true,
    );
  });

  /**
   * The prominent route to a ranking is now from inside the category the
   * ranking is about, which is where a reader is already choosing. It was the
   * top bar, which asked every reader on every page to care about a section
   * that answers two categories.
   */
  it("links each surviving best-of from its own hub, above the fold", () => {
    for (const slug of builtBestOfCategories()) {
      const hero = heroFor(slug)!;
      const ctas = [hero.primaryCta?.href, hero.secondaryCta?.href];
      expect(ctas, `the ${slug} hub does not link its best-of from the hero`).toContain(
        categoryRoutes(slug).best,
      );
    }
  });

  /**
   * And back the other way. A best-of hangs off its hub so the breadcrumb IS
   * the link home; the pool page hung off /best-robots/ until this change and
   * offered the reader no way into the category it ranks.
   */
  it("parents each surviving best-of to its hub, so the breadcrumb leads back", () => {
    for (const slug of builtBestOfCategories()) {
      const route = ROUTES.find((r) => r.path === categoryRoutes(slug).best)!;
      expect(route.parent, `${route.path} does not hang off its hub`).toBe(`/robots/${slug}/`);
      expect(breadcrumbsFor(route.path).map((c) => c.path)).toContain(`/robots/${slug}/`);
    }
  });

  /**
   * The point of the whole exercise. The hub took the shortlist's terms, so it
   * has to say the words — and no internal link may still point at the URL
   * that folded.
   */
  it("moves the shortlist's commercial terms onto the hub copy", () => {
    const slug = "window-cleaning-robots";
    const copy = JSON.stringify([
      heroFor(slug),
      decisionSectionFor(slug),
      coverageSectionFor(slug),
      splitSectionFor(slug),
      matrixSectionFor(slug),
      checkSectionFor(slug),
      priceSectionFor(slug),
      verdictSectionFor(slug),
      faqSectionFor(slug),
    ]).toLowerCase();

    for (const term of [
      "best window cleaning robot",
      "best robot window cleaner",
      "window cleaning robot reviews",
      "high rise",
    ]) {
      expect(copy.includes(term), `the window hub no longer says "${term}"`).toBe(true);
    }

    /* The named recommendations came with the terms. Awards without the
       machines behind them would be the folded page's shape and none of its
       substance. */
    for (const machine of ["winbot w2 pro", "hobot 2s", "cop rose x5s", "mamibot w120-dp", "hutt s55 pro"]) {
      expect(copy.includes(machine), `the window hub no longer names the ${machine}`).toBe(true);
    }
  });

  /**
   * THE DEFECT EVERY OTHER ASSERTION IN THIS FILE MISSED, found by an external
   * audit on 12 August 2026 and not by us.
   *
   * The WINBOT ladder on the window hub ended "...and the best-of page makes
   * that argument". That page had folded into the very page the sentence was
   * printed on. Nothing caught it because every guard here checks HREFS — a
   * page referred to in words, with no link, is invisible to all of them.
   *
   * The rule this asserts is narrow and mechanical on purpose: a component
   * built for ONE category must not talk about a page type that category does
   * not have. It would have failed on the exact sentence above.
   */
  it("never lets a category-specific component name a page its category lacks", () => {
    const COMPONENTS = fileURLToPath(new URL("../src/components/", import.meta.url));
    /* The dispatch map in HubTable.astro, restated. Each of these renders for
       exactly one category, so each may only speak about that category. */
    const OWNED_BY: Record<string, string> = {
      "WinbotLadder.astro": "window-cleaning-robots",
      "CapabilityTable.astro": "companion-robots",
    };
    const built = builtBestOfCategories();

    for (const [file, slug] of Object.entries(OWNED_BY)) {
      const src = readFileSync(`${COMPONENTS}${file}`, "utf8");
      /* Strip the Astro frontmatter and every comment: this is about what a
         READER is told, and a code comment explaining the history is exactly
         the thing that should be allowed to mention it. */
      const copy = src
        .replace(/^---[\s\S]*?---/, "")
        .replace(/\/\*[\s\S]*?\*\//g, "")
        .replace(/\{\/\*[\s\S]*?\*\/\}/g, "")
        .toLowerCase();
      if (built.has(slug)) continue;
      expect(
        /best-of page|shortlist page|best-of above|our best-of/.test(copy),
        `${file} renders for ${slug}, which has no best-of page, and its copy still refers to one`,
      ).toBe(false);
    }
  });

  /**
   * An internal link into a 301 spends a crawl to be told to go somewhere
   * else, and it is exactly what happens when a page is folded and its
   * inbound links are not. The registry's own alias entry is the one legitimate
   * mention of this URL anywhere in the codebase.
   */
  it("leaves nothing pointing at the folded URL but the alias itself", () => {
    const anchors = [
      ...Object.values(CATEGORY_ANCHORS).flat().map((a) => a.href),
      ...RETROFITTED_INBOUND.flatMap((r) => (r as { links?: { href: string }[] }).links?.map((l) => l.href) ?? []),
    ];
    for (const href of anchors) {
      expect(href.split("#")[0], "an internal anchor still points at the folded best-of").not.toBe(
        WINDOW_BEST,
      );
    }

    for (const p of PAGE_PLAN) {
      expect(p.path).not.toBe(WINDOW_BEST);
      expect(p.linksOut, `${p.path} links out to the folded best-of`).not.toContain(WINDOW_BEST);
      for (const c of p.ceded) expect(c.toPath, `${p.path} cedes to the folded best-of`).not.toBe(WINDOW_BEST);
    }

    for (const k of KEYWORD_REGISTER) {
      expect(k.path).not.toBe(WINDOW_BEST);
      for (const c of k.cededTo ?? []) expect(c.path, `${k.path} cedes to the folded best-of`).not.toBe(WINDOW_BEST);
    }
  });
});
