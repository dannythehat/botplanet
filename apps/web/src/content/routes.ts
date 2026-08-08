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
import {
  CATEGORIES,
  LAUNCH_CATEGORY,
  liveCategories,
  routes as categoryPaths,
  type LaunchState,
} from "./nav";

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
/* @extension-point per-category | required | Three routes per category — the
   hub, /compare/ and /botmatch/. The pages still render without them, because
   they come from dynamic routes and a D1 row, but this registry is what the
   SITEMAP and the breadcrumbs read. A page no crawler can find is not
   published. This is exactly what was missed when window went live. */
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

  /* ---------------- Robotic lawn mowers ----------------
     Added 2026-08-06 when the category page was built. Same reason the window
     block exists: the page renders from a dynamic route and a D1 row, so it
     works without an entry here — but this registry is what the SITEMAP and
     the breadcrumbs read, and a page no crawler can find is not published. */
  {
    path: "/robots/robotic-lawn-mowers/",
    label: "Robotic Lawn Mowers",
    section: "shop",
    parent: "/robots/",
    status: "live",
    navSurface: "none",
    footerGroup: "Explore",
    inSitemap: true,
    indexable: true,
    category: "robotic-lawn-mowers",
  },
  {
    path: "/compare/robotic-lawn-mowers/",
    label: "Compare robot mowers",
    breadcrumbLabel: "Robotic Lawn Mowers",
    section: "compare",
    parent: "/compare/",
    status: "live",
    navSurface: "none",
    footerGroup: null,
    inSitemap: true,
    indexable: true,
    category: "robotic-lawn-mowers",
  },
  {
    path: "/botmatch/robotic-lawn-mowers/",
    label: "Find My Robot Lawn Mower",
    breadcrumbLabel: "Find My Robot Lawn Mower",
    section: "botmatch",
    /* Parent is the category page, not "/botmatch/" — that path is only an
       alias of the pool matcher and is not a route of its own. */
    parent: "/robots/robotic-lawn-mowers/",
    /* The lawn question set now exists — lawn area, tree cover, slopes and
       zones, budget, exactly the axes §7 of the research says decide this
       purchase — and it scores against the lawn config sc-lawn-v1.

       Still "coming_soon" for a different and smaller reason: there are no
       lawn products in the catalogue yet, so the funnel would ask seven good
       questions and then have nothing to recommend. It flips to live with the
       first published lawn product. Not in the sitemap either way, same as
       pool and window: the page renders noindex. */
    status: "live",
    navSurface: "none",
    footerGroup: null,
    inSitemap: false,
    indexable: false,
    category: "robotic-lawn-mowers",
  },

  /* ---------------- Companion robots ----------------
     Added 2026-08-06. Named for the category, targeted at "robot pet" — see
     the keyword register for why the head term is not the H1. */
  {
    path: "/robots/companion-robots/",
    label: "Companion Robots & Robot Pets",
    breadcrumbLabel: "Companion Robots",
    section: "shop",
    parent: "/robots/",
    status: "live",
    navSurface: "none",
    footerGroup: "Explore",
    inSitemap: true,
    indexable: true,
    category: "companion-robots",
  },
  {
    path: "/compare/companion-robots/",
    label: "Compare companion robots",
    breadcrumbLabel: "Companion Robots",
    section: "compare",
    parent: "/compare/",
    status: "live",
    navSurface: "none",
    footerGroup: null,
    inSitemap: true,
    indexable: true,
    category: "companion-robots",
  },
  {
    path: "/botmatch/companion-robots/",
    label: "Find My Robot Pet",
    breadcrumbLabel: "Find My Robot Pet",
    parent: "/robots/companion-robots/",
    section: "botmatch",
    /* Its own question set exists and scores against sc-companion-v1. Still
       coming_soon for the same reason lawn is: no products in the catalogue
       yet, so the funnel would ask six good questions and recommend nothing.
       Flips to live with the first published companion product. */
    status: "live",
    navSurface: "none",
    footerGroup: null,
    inSitemap: false,
    indexable: false,
    category: "companion-robots",
  },

  /* ---------------- Pet camera robots ----------------
     A separate category from companion robots, on measured evidence rather
     than taste: the two head SERPs share only Amazon, Reddit and YouTube, and
     "pet camera robot" peaks in July while everything companion peaks in
     December. Recorded in docs/seo/companion-robots-research-findings.md. */
  {
    path: "/robots/pet-camera-robots/",
    label: "Pet Camera Robots",
    section: "shop",
    parent: "/robots/",
    status: "live",
    navSurface: "none",
    footerGroup: "Explore",
    inSitemap: true,
    indexable: true,
    category: "pet-camera-robots",
  },
  {
    path: "/compare/pet-camera-robots/",
    label: "Compare pet camera robots",
    breadcrumbLabel: "Pet Camera Robots",
    section: "compare",
    parent: "/compare/",
    status: "live",
    navSurface: "none",
    footerGroup: null,
    inSitemap: true,
    indexable: true,
    category: "pet-camera-robots",
  },
  {
    path: "/botmatch/pet-camera-robots/",
    label: "Find My Pet Camera Robot",
    breadcrumbLabel: "Find My Pet Camera Robot",
    parent: "/robots/pet-camera-robots/",
    section: "botmatch",
    status: "live",
    navSurface: "none",
    footerGroup: null,
    inSitemap: false,
    indexable: false,
    category: "pet-camera-robots",
  },

  /* ---------------- Educational and coding robots ----------------
     Page 010, the last of the locked ten. Named for the demand rather than
     the topic: "coding robot" is a consumer SERP, "educational robot" is an
     institutional one. See the keyword register. */
  {
    path: "/robots/educational-coding-robots/",
    label: "Coding Robots for Kids",
    section: "shop",
    parent: "/robots/",
    status: "live",
    navSurface: "none",
    footerGroup: "Explore",
    inSitemap: true,
    indexable: true,
    category: "educational-coding-robots",
  },
  {
    path: "/compare/educational-coding-robots/",
    label: "Compare coding robots",
    breadcrumbLabel: "Coding Robots for Kids",
    section: "compare",
    parent: "/compare/",
    status: "live",
    navSurface: "none",
    footerGroup: null,
    inSitemap: true,
    indexable: true,
    category: "educational-coding-robots",
  },
  {
    path: "/botmatch/educational-coding-robots/",
    label: "Find My Coding Robot",
    breadcrumbLabel: "Find My Coding Robot",
    parent: "/robots/educational-coding-robots/",
    section: "botmatch",
    status: "live",
    navSurface: "none",
    footerGroup: null,
    inSitemap: false,
    indexable: false,
    category: "educational-coding-robots",
  },

  /* ---------------- Robot vacuums and mops ----------------
     Page 009, and the biggest category on the site at 135,000/mo. One URL
     carries all of it: mop and self-emptying both measured 6-7 shared domains
     with the head term. Flipped from coming_soon to live with this build. */
  {
    path: "/robots/robot-vacuums/",
    label: "Robot Vacuums & Mops",
    section: "shop",
    parent: "/robots/",
    status: "live",
    navSurface: "none",
    footerGroup: "Explore",
    inSitemap: true,
    indexable: true,
    category: "robot-vacuums",
  },
  {
    path: "/compare/robot-vacuums/",
    label: "Compare robot vacuums",
    breadcrumbLabel: "Robot Vacuums & Mops",
    section: "compare",
    parent: "/compare/",
    status: "live",
    navSurface: "none",
    footerGroup: null,
    inSitemap: true,
    indexable: true,
    category: "robot-vacuums",
  },
  {
    path: "/botmatch/robot-vacuums/",
    label: "Find My Robot Vacuum",
    breadcrumbLabel: "Find My Robot Vacuum",
    parent: "/robots/robot-vacuums/",
    section: "botmatch",
    status: "live",
    navSurface: "none",
    footerGroup: null,
    inSitemap: false,
    indexable: false,
    category: "robot-vacuums",
  },

  /* ---------------- Grill-cleaning robots ----------------
     Page 006. The category survived the run that was designed to kill it —
     see the keyword register for the grill-brush control that cleared it. */
  {
    path: "/robots/grill-cleaning-robots/",
    label: "Grill-Cleaning Robots",
    section: "shop",
    parent: "/robots/",
    status: "live",
    navSurface: "none",
    footerGroup: "Explore",
    inSitemap: true,
    indexable: true,
    category: "grill-cleaning-robots",
  },
  {
    path: "/compare/grill-cleaning-robots/",
    label: "Compare grill-cleaning robots",
    breadcrumbLabel: "Grill-Cleaning Robots",
    section: "compare",
    parent: "/compare/",
    status: "live",
    navSurface: "none",
    footerGroup: null,
    inSitemap: true,
    indexable: true,
    category: "grill-cleaning-robots",
  },
  {
    path: "/botmatch/grill-cleaning-robots/",
    label: "Find My Grill Cleaner",
    breadcrumbLabel: "Find My Grill Cleaner",
    parent: "/robots/grill-cleaning-robots/",
    section: "botmatch",
    status: "live",
    navSurface: "none",
    footerGroup: null,
    inSitemap: false,
    indexable: false,
    category: "grill-cleaning-robots",
  },

  /* ---------------- Self-cleaning litter boxes ----------------
     Page 004 of the owner-locked ten. One URL carries the entire commercial
     category: every buying phrasing measured 5-9 shared top-ten domains
     against the head term. See the keyword register for the table. */
  {
    path: "/robots/self-cleaning-litter-boxes/",
    label: "Self-Cleaning Litter Boxes",
    section: "shop",
    parent: "/robots/",
    status: "live",
    navSurface: "none",
    footerGroup: "Explore",
    inSitemap: true,
    indexable: true,
    category: "self-cleaning-litter-boxes",
  },
  {
    path: "/compare/self-cleaning-litter-boxes/",
    label: "Compare self-cleaning litter boxes",
    breadcrumbLabel: "Self-Cleaning Litter Boxes",
    section: "compare",
    parent: "/compare/",
    status: "live",
    navSurface: "none",
    footerGroup: null,
    inSitemap: true,
    indexable: true,
    category: "self-cleaning-litter-boxes",
  },
  {
    path: "/botmatch/self-cleaning-litter-boxes/",
    label: "Find My Litter Box",
    breadcrumbLabel: "Find My Litter Box",
    parent: "/robots/self-cleaning-litter-boxes/",
    section: "botmatch",
    /* Its own questions and its own config, sc-litterbox-v1. coming_soon only
       because the catalogue is empty — the funnel asks the right questions and
       has nothing to recommend yet. */
    status: "live",
    navSurface: "none",
    footerGroup: null,
    inSitemap: false,
    indexable: false,
    category: "self-cleaning-litter-boxes",
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
    /* Live and working — it has its own question set and scores against the
       eleven real window robots. Out of the sitemap for the same reason pool
       is: the page renders noindex, so listing it contradicted itself. */
    inSitemap: false,
    indexable: false,
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
  /* LIVE SINCE 6 AUGUST 2026. These three carried `coming_soon` and a
     RoutePlaceholder from launch, which was correct while they were empty and
     became wrong the day they were written. All three are ruled CREATE in
     docs/seo/pool-research-findings.md — nothing here exists because a site
     "should have" a best-of page. */
  {
    path: `/best-robots/${CAT}/`,
    label: "Best robotic pool cleaners",
    breadcrumbLabel: "Robotic Pool Cleaners",
    section: "best",
    parent: "/best-robots/",
    status: "live",
    navSurface: "none",
    footerGroup: null,
    inSitemap: true,
    indexable: true,
    category: CAT,
    aliases: [`/best/${CAT}/`],
    summary: "Nine robotic pool cleaners ranked by the job each does best, with who each one is wrong for.",
  },
  {
    /* The single biggest wedge in the pool dataset: 22,200/mo at KD 0, more
       than three times the "best robotic pool cleaner" cluster. A child of the
       best-of page rather than a sibling, because it is the cordless subset of
       the same argument and the breadcrumb should say so. */
    path: `/best-robots/${CAT}/cordless/`,
    label: "Best cordless robotic pool cleaners",
    breadcrumbLabel: "Cordless",
    section: "best",
    parent: `/best-robots/${CAT}/`,
    status: "live",
    navSurface: "none",
    footerGroup: null,
    inSitemap: true,
    indexable: true,
    category: CAT,
    summary: "The seven cordless machines ranked, and the honest case for buying corded instead.",
  },
  {
    /* Not on the 1 August map. The second pool run measured "robotic pool
       cleaner for above ground pool" at 2,400/mo, KD 0 — the first run saw
       above-ground at 140 and folded it into the best-of, which was right on
       the number it had.

       A page rather than a section because the above-ground rating is a
       COMPATIBILITY claim, not a performance one: six of our ten cleaners are
       not rated for a vinyl liner at all, so this reader is choosing from a
       different shortlist. */
    path: `/best-robots/${CAT}/above-ground-pools/`,
    label: "Best above-ground pool cleaners",
    breadcrumbLabel: "Above-ground pools",
    section: "best",
    parent: `/best-robots/${CAT}/`,
    status: "live",
    navSurface: "none",
    footerGroup: null,
    inSitemap: true,
    indexable: true,
    category: CAT,
    summary: "The four machines rated for a vinyl liner, and why the other six are not.",
  },
  {
    path: `/guides/${CAT}/`,
    label: "Pool cleaner guides",
    breadcrumbLabel: "Robotic Pool Cleaners",
    section: "guides",
    parent: "/guides/",
    status: "live",
    navSurface: "none",
    footerGroup: null,
    inSitemap: true,
    indexable: true,
    category: CAT,
    summary: "How robotic pool cleaners work and what actually decides which one suits your pool.",
  },
  {
    /* Only 40/mo on the exact phrase. It is here because "Is a robot pool
       cleaner worth it?" is the number one People Also Ask entry on the
       40,500 head term — a snippet play, not a volume play. Parented to the
       guides index rather than to the category's guide hub: the URL has no
       category segment, and a breadcrumb that claims one would not match it. */
    path: "/guides/are-robotic-pool-cleaners-worth-it/",
    label: "Are robotic pool cleaners worth it?",
    section: "guides",
    parent: "/guides/",
    status: "live",
    navSurface: "none",
    footerGroup: null,
    inSitemap: true,
    indexable: true,
    category: CAT,
    summary: "For most in-ground pools yes, and for four specific situations no.",
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
    /* Out of the sitemap since 6 August 2026. The page itself has always
       rendered <meta robots="noindex"> — see pages/botmatch/[category].astro —
       so listing it in the sitemap was submitting a URL for indexing while
       telling the crawler not to index it. Two contradictory signals about the
       same page, and the registry was the one that was wrong: a matcher is a
       tool, and the category page is what should rank. Found while giving lawn
       and window their own questionnaires. */
    inSitemap: false,
    indexable: false,
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
    summary:
      "The terms that apply when you use BotPlanet, including what our recommendations are and are not, and how affiliate links affect what you read here.",
  },

  {
    /* Page 2 of the window map, ruled CREATE 5 August 2026 and built on the
       7th — after the eleven reviews under it were given working buy buttons.
       1,300/mo at KD 0-3. Parented to the category hub, which owns the head
       term this page deliberately does not chase. */
    /* The Enabot range page. A STATIC ROUTE INSIDE THE PRODUCT ROUTE'S SPACE:
       /robots/<category>/<slug>/ is normally a product, and "enabot" is not
       one. Astro gives the static file precedence, so the dynamic route never
       sees it. Parented to the pet-camera hub, whose head term it does not
       chase — 9,900/mo on the brand against 480 on the category. */
    path: "/robots/pet-camera-robots/enabot/",
    label: "Enabot range",
    breadcrumbLabel: "Enabot",
    section: "robots",
    parent: "/robots/pet-camera-robots/",
    status: "live",
    navSurface: "none",
    footerGroup: null,
    inSitemap: true,
    indexable: true,
    category: "pet-camera-robots",
    summary: "Seven driving pet cameras, and which of them is the one to buy.",
  },

  {
    path: "/best-robots/window-cleaning-robots/",
    label: "Best window cleaning robots",
    breadcrumbLabel: "Window Cleaning Robots",
    section: "best",
    parent: "/robots/window-cleaning-robots/",
    status: "live",
    navSurface: "none",
    footerGroup: null,
    inSitemap: true,
    indexable: true,
    category: "window-cleaning-robots",
    summary: "Nine ranked by the job each does best, and the two we hold and do not recommend.",
  },

  {
    /* Page 9 of the window map and the last of it. Parented to /guides/ like
       the pool worth-it guide: the URL carries no category segment, so a
       breadcrumb claiming one would not match the path the reader walked. */
    path: "/guides/do-window-cleaning-robots-work/",
    label: "Do window cleaning robots work?",
    section: "guides",
    parent: "/guides/",
    status: "live",
    navSurface: "none",
    footerGroup: null,
    inSitemap: true,
    indexable: true,
    category: "window-cleaning-robots",
    summary: "Yes in the middle of the pane, no at the edges — and when not to buy one at all.",
  },

  /* ---------------- Standalone guides, 6 August 2026 ----------------
     The first pages published for categories with NOTHING IN THE
     CATALOGUE. Each answers a decision rather than ranking machines,
     and each says in its own words what it cannot yet tell the reader.

     PARENTED TO /guides/ RATHER THAN TO A CATEGORY GUIDE HUB, for the
     same reason the pool worth-it guide is: the URL carries no category
     segment, so a breadcrumb claiming one would not match the path the
     reader actually walked. The category is still recorded below, which
     is what joins them to the right internal-link anchor set.

     Full plans — keywords, links, images, schema — in
     content/seo/page-plan.ts. None has artwork yet. */
  {
    path: "/guides/wire-free-robot-lawn-mower/",
    label: "Wire-free robot lawn mowers",
    section: "guides",
    parent: "/guides/",
    status: "live",
    navSurface: "none",
    footerGroup: null,
    inSitemap: true,
    indexable: true,
    category: "robotic-lawn-mowers",
    summary: "RTK, vision or LiDAR — and when a buried cable is still the better buy.",
  },
  {
    path: "/guides/cheap-robot-lawn-mower/",
    label: "Cheap robot lawn mowers",
    section: "guides",
    parent: "/guides/",
    status: "live",
    navSurface: "none",
    footerGroup: null,
    inSitemap: true,
    indexable: true,
    category: "robotic-lawn-mowers",
    summary: "What the budget end gives up, what it does not, and where a low price stops being a bargain.",
  },
  {
    path: "/guides/robot-lawn-mower-for-hills/",
    label: "Robot lawn mowers for hills",
    section: "guides",
    parent: "/guides/",
    status: "live",
    navSurface: "none",
    footerGroup: null,
    inSitemap: true,
    indexable: true,
    category: "robotic-lawn-mowers",
    summary: "Measure the gradient first: it is the one constraint you cannot work around.",
  },
  {
    path: "/guides/robotic-pets-for-elderly/",
    label: "Robotic pets for elderly relatives",
    section: "guides",
    parent: "/guides/",
    status: "live",
    navSurface: "none",
    footerGroup: null,
    inSitemap: true,
    indexable: true,
    category: "companion-robots",
    summary: "Three different products are sold to this buyer, and they answer three different problems.",
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

/**
 * The categories whose best-of page has actually been written.
 *
 * /best-robots/ used to decide this from the category's launch state, which is
 * a different fact entirely: nine categories are live and two best-of pages
 * exist, so seven cards linked at a 404. /best-robots/[slug].astro deliberately
 * returns 404 for an unwritten slug rather than filling the URL shape with a
 * thin page, so the registry is the only thing that knows.
 */
export const builtBestOfCategories = (): Set<string> =>
  new Set(
    ROUTES.filter((r) => r.section === "best" && r.status === "live" && r.category).map(
      (r) => r.category as string,
    ),
  );

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
export { CATEGORIES, LAUNCH_CATEGORY, liveCategories };
