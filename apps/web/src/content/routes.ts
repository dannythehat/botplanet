/**
 * Central route registry — the single source of truth for the site's URL
 * structure, navigation, breadcrumbs, sitemap inclusion and redirects.
 *
 * Every path string in the site should come from here. Components must not
 * hard-code paths; adding or moving a route is a data change in this file.
 *
 * SPEC NOTE: the Notion sitemap specification (Part 2.1) is still marked
 * "SPECIFICATION — for ChatGPT review + Danny lock" and proposes a different
 * shape in three places: a `pool-cleaners` slug, section routes nested under
 * the category (`/robots/<cat>/compare`), and a global `/find-my-robot` entry.
 * This implementation follows the Job 6 brief instead, because it is the more
 * recent owner instruction, it matches what is already live and indexed, and
 * the "no generic BotMatch journey" rule is a locked permanent rule that
 * supersedes the older `/find-my-robot` proposal. The divergence is recorded
 * in the handoff for ChatGPT to ratify.
 */
import { CATEGORIES, LAUNCH_CATEGORY, routes as categoryPaths, type LaunchState } from "./nav";

export type RouteStatus = LaunchState;

/** Where a route may appear in navigation surfaces. */
export type NavSurface =
  | "bar" // desktop top bar
  | "bar-secondary" // top bar, drops out on narrow desktops
  | "utility" // mega-menu "More" / drawer / footer only
  | "none";

export interface RouteDef {
  /** Canonical path: lowercase, hyphenated, always trailing-slash. */
  path: string;
  /** Navigation label. */
  label: string;
  /** Breadcrumb label when it should differ from the nav label. */
  breadcrumbLabel?: string;
  /** Grouping used for active-state and footer placement. */
  section: string;
  /** Canonical parent path, used to build breadcrumbs. */
  parent?: string;
  status: RouteStatus;
  navSurface: NavSurface;
  /** Footer group title, or null to keep it out of the footer. */
  footerGroup?: string | null;
  inSitemap: boolean;
  indexable: boolean;
  /** Category slug this route belongs to, where applicable. */
  category?: string;
  /** Obsolete or alternative paths that must 301 here. */
  aliases?: string[];
  /** Short honest description used by placeholder pages. */
  summary?: string;
}

const CAT = LAUNCH_CATEGORY;

/**
 * The registry. Order matters only for navigation surfaces; lookup is by path.
 */
export const ROUTES: RouteDef[] = [
  /* ---------------- Core ---------------- */
  {
    path: "/",
    label: "Home",
    section: "home",
    status: "live",
    navSurface: "none",
    inSitemap: true,
    indexable: true,
  },
  {
    path: "/robots/",
    label: "Shop Robots",
    breadcrumbLabel: "Robot Categories",
    section: "shop",
    parent: "/",
    status: "live",
    navSurface: "bar",
    footerGroup: "Explore",
    inSitemap: true,
    indexable: true,
    summary: "Every robot category BotPlanet covers, and which are live today.",
  },
  {
    path: "/compare/",
    label: "Compare",
    breadcrumbLabel: "Compare Robots",
    section: "compare",
    parent: "/",
    status: "live",
    navSurface: "bar",
    footerGroup: "Explore",
    inSitemap: true,
    indexable: true,
    summary: "Head-to-head comparisons, with the winner explained by use case.",
  },
  {
    path: "/best-robots/",
    label: "Best Robots",
    breadcrumbLabel: "Best Robots",
    section: "best",
    parent: "/",
    status: "live",
    navSurface: "bar-secondary",
    footerGroup: "Explore",
    inSitemap: true,
    indexable: true,
    aliases: ["/best/"],
    summary: "Our top picks by use case, with the reasoning and the limitations.",
  },
  {
    path: "/guides/",
    label: "Guides",
    section: "guides",
    parent: "/",
    status: "live",
    navSurface: "bar",
    footerGroup: "Explore",
    inSitemap: true,
    indexable: true,
    summary: "How these robots work, what to look for, and how to keep them running.",
  },
  {
    path: "/deals/",
    label: "Deals",
    section: "deals",
    parent: "/",
    status: "coming_soon",
    navSurface: "bar-secondary",
    footerGroup: "Explore",
    inSitemap: false,
    indexable: false,
    summary: "Verified price drops. Nothing is listed until a price is confirmed at the retailer.",
  },
  {
    path: "/news/",
    label: "Robot News",
    section: "news",
    parent: "/",
    status: "coming_soon",
    navSurface: "utility",
    footerGroup: null,
    inSitemap: false,
    indexable: false,
    summary: "Robot industry news and analysis.",
  },
  {
    path: "/business/",
    label: "For Business",
    section: "company",
    parent: "/",
    status: "coming_soon",
    navSurface: "utility",
    footerGroup: "Company",
    inSitemap: false,
    indexable: false,
    summary:
      "Commercial cleaning, inspection and service robots. A separate track — no affiliate links and no BotMatch.",
  },
  {
    path: "/about/",
    label: "About",
    breadcrumbLabel: "About BotPlanet",
    section: "company",
    parent: "/",
    status: "live",
    navSurface: "utility",
    footerGroup: "Company",
    inSitemap: true,
    indexable: true,
  },
  {
    path: "/search/",
    label: "Search",
    section: "tools",
    parent: "/",
    status: "live",
    navSurface: "none",
    footerGroup: null,
    // A search results page must never be indexed: query variants would create
    // unlimited near-duplicate URLs.
    inSitemap: false,
    indexable: false,
    summary: "Search BotPlanet.",
  },
  {
    path: "/saved/",
    label: "Saved",
    breadcrumbLabel: "Saved products",
    section: "tools",
    parent: "/",
    status: "live",
    navSurface: "none",
    footerGroup: null,
    // Personal to the device; nothing to index.
    inSitemap: false,
    indexable: false,
    summary: "Products you have saved on this device.",
  },

  /* ---------------- Window-cleaning robots ----------------
     Added 2026-08-05 when the category went live. The category page renders
     from a dynamic route and a D1 row, so it worked before this entry existed
     — but the registry is what the SITEMAP and the breadcrumbs read, so
     without it the page was live and invisible to crawlers. A page nobody can
     find is not published. */
  {
    path: "/robots/window-cleaning-robots/",
    label: "Window-Cleaning Robots",
    section: "shop",
    parent: "/robots/",
    status: "live",
    navSurface: "none",
    footerGroup: "Explore",
    inSitemap: true,
    indexable: true,
    category: "window-cleaning-robots",
  },
  {
    path: "/compare/window-cleaning-robots/",
    label: "Compare window cleaners",
    breadcrumbLabel: "Window-Cleaning Robots",
    section: "compare",
    parent: "/compare/",
    status: "live",
    navSurface: "none",
    footerGroup: null,
    inSitemap: true,
    indexable: true,
    category: "window-cleaning-robots",
  },
  {
    path: "/botmatch/window-cleaning-robots/",
    label: "Find My Window Cleaning Robot",
    breadcrumbLabel: "Find My Window Cleaning Robot",
    section: "botmatch",
    /* Parent is the category page, not "/botmatch/" — that path is only an
       alias of the pool matcher and is not a route of its own. */
    parent: "/robots/window-cleaning-robots/",
    status: "live",
    navSurface: "none",
    footerGroup: null,
    inSitemap: true,
    indexable: true,
    category: "window-cleaning-robots",
  },

  /* ---------------- Category subtree ---------------- */
  {
    path: `/robots/${CAT}/`,
    label: "Robotic Pool Cleaners",
    section: "shop",
    parent: "/robots/",
    status: "live",
    navSurface: "none",
    footerGroup: "Explore",
    inSitemap: true,
    indexable: true,
    category: CAT,
    aliases: ["/robots/pool-cleaners/", "/robots/robotic-pool-cleaner/"],
  },
  {
    path: `/compare/${CAT}/`,
    label: "Compare pool cleaners",
    breadcrumbLabel: "Robotic Pool Cleaners",
    section: "compare",
    parent: "/compare/",
    status: "live",
    navSurface: "none",
    footerGroup: null,
    inSitemap: true,
    indexable: true,
    category: CAT,
    aliases: ["/compare/pool-cleaners/"],
  },
  {
    path: `/best-robots/${CAT}/`,
    label: "Best robotic pool cleaners",
    breadcrumbLabel: "Robotic Pool Cleaners",
    section: "best",
    parent: "/best-robots/",
    status: "coming_soon",
    navSurface: "none",
    footerGroup: null,
    inSitemap: false,
    indexable: false,
    category: CAT,
    aliases: [`/best/${CAT}/`],
    summary: "Our best-of picks for robotic pool cleaners.",
  },
  {
    path: `/guides/${CAT}/`,
    label: "Pool cleaner guides",
    breadcrumbLabel: "Robotic Pool Cleaners",
    section: "guides",
    parent: "/guides/",
    status: "coming_soon",
    navSurface: "none",
    footerGroup: null,
    inSitemap: false,
    indexable: false,
    category: CAT,
    summary: "Buying and care guides for robotic pool cleaners.",
  },
  {
    path: `/deals/${CAT}/`,
    label: "Pool cleaner deals",
    breadcrumbLabel: "Robotic Pool Cleaners",
    section: "deals",
    parent: "/deals/",
    status: "coming_soon",
    navSurface: "none",
    footerGroup: null,
    inSitemap: false,
    indexable: false,
    category: CAT,
    summary: "Confirmed price drops on robotic pool cleaners.",
  },
  {
    path: `/botmatch/${CAT}/`,
    label: "Find My Pool Cleaner",
    breadcrumbLabel: "Find My Pool Cleaner",
    section: "botmatch",
    parent: `/robots/${CAT}/`,
    status: "live",
    navSurface: "none",
    footerGroup: "BotMatch",
    inSitemap: true,
    indexable: true,
    category: CAT,
    // Generic BotMatch entries must never exist as pages; they land here.
    aliases: ["/find-my-robot/", "/botmatch/", "/find-my-robot/pool-cleaners/"],
  },

  /* ---------------- Company / trust ---------------- */
  {
    path: "/how-botmatch-works/",
    label: "How BotMatch works",
    section: "botmatch",
    parent: "/",
    status: "live",
    navSurface: "none",
    footerGroup: "BotMatch",
    inSitemap: true,
    indexable: true,
  },
  {
    path: "/review-methodology/",
    label: "How we review",
    section: "company",
    parent: "/about/",
    status: "live",
    navSurface: "none",
    footerGroup: "Company",
    inSitemap: true,
    indexable: true,
    aliases: ["/how-we-review/"],
  },
  {
    path: "/editorial-policy/",
    label: "Editorial policy",
    section: "company",
    parent: "/about/",
    status: "live",
    navSurface: "none",
    footerGroup: "Company",
    inSitemap: true,
    indexable: true,
  },
  {
    path: "/contact/",
    label: "Contact",
    section: "company",
    parent: "/about/",
    status: "live",
    navSurface: "none",
    footerGroup: "Company",
    inSitemap: true,
    indexable: true,
    summary: "How to reach BotPlanet.",
  },
  {
    path: "/affiliate-disclosure/",
    label: "Affiliate disclosure",
    section: "legal",
    parent: "/",
    status: "live",
    navSurface: "none",
    footerGroup: "Trust & legal",
    inSitemap: true,
    indexable: true,
  },
  {
    path: "/privacy/",
    label: "Privacy",
    section: "legal",
    parent: "/",
    status: "live",
    navSurface: "none",
    footerGroup: "Trust & legal",
    inSitemap: true,
    indexable: true,
  },
  {
    path: "/terms/",
    label: "Terms",
    section: "legal",
    parent: "/",
    status: "live",
    navSurface: "none",
    footerGroup: "Trust & legal",
    inSitemap: true,
    indexable: true,
    summary: "The terms that apply when you use BotPlanet.",
  },
];

/* ------------------------------------------------------------------ */
/* Derived lookups                                                     */
/* ------------------------------------------------------------------ */

const BY_PATH = new Map(ROUTES.map((r) => [r.path, r]));

export const routeFor = (path: string): RouteDef | undefined => BY_PATH.get(path);

/** Routes shown in the desktop top bar, in registry order. */
export const barRoutes = () =>
  ROUTES.filter((r) => r.navSurface === "bar" || r.navSurface === "bar-secondary");

/** Utility destinations: reachable via the mega menu's More column and drawer. */
export const utilityRoutes = () => ROUTES.filter((r) => r.navSurface === "utility");

/** Footer groups, assembled from the registry so nothing can drift. */
export const footerGroups = (): { title: string; links: RouteDef[] }[] => {
  const order = ["Explore", "BotMatch", "Company", "Trust & legal"];
  return order
    .map((title) => ({ title, links: ROUTES.filter((r) => r.footerGroup === title) }))
    .filter((g) => g.links.length > 0);
};

/** Canonical, indexable paths for the XML sitemap. */
export const sitemapRoutes = () => ROUTES.filter((r) => r.inSitemap && r.indexable && r.status !== "hidden");

/** Category-scoped section paths, generated rather than hard-coded. */
export const categoryRoutes = (slug: string) => ({
  hub: categoryPaths.category(slug),
  compare: categoryPaths.compare(slug),
  best: categoryPaths.best(slug),
  guides: categoryPaths.categoryGuides(slug),
  deals: categoryPaths.categoryDeals(slug),
  botmatch: categoryPaths.botmatch(slug),
});

/**
 * THE canonical path for a product page.
 *
 * Anything that needs a product URL — the sitemap, the Notion register export,
 * internal links — must come through here. A second hand-written pattern is how
 * ten obsolete `/pool-cleaners/<slug>/` URLs reached the SEO register, and the
 * only durable fix is to leave exactly one place where the shape is decided.
 */
export const productPath = (productSlug: string, categorySlug: string = LAUNCH_CATEGORY): string =>
  categoryPaths.product(categorySlug, productSlug);

/** Every alias in the registry, mapped to its canonical destination. */
export const REDIRECTS: { from: string; to: string }[] = ROUTES.flatMap((r) =>
  (r.aliases ?? []).map((from) => ({ from, to: r.path })),
);

/** Categories, re-exported so consumers need only one import. */
export { CATEGORIES, LAUNCH_CATEGORY };
