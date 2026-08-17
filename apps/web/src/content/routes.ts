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
import { MERGED_REVIEWS, RETIRED_SLUGS } from "./product-names";

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
    label: "Robot Categories",
    breadcrumbLabel: "Robot Categories",
    section: "shop",
    parent: "/",
    status: "live",
    navSurface: "none",
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
    /* OUT OF THE TOP BAR, 12 AUGUST 2026. A nav slot is a promise that there
       is a section behind it, and there is not: two best-of pages exist and
       six of the categories that would fill this index were REFUSED by their
       own research, because their head term and their "best" term return the
       same results page. This index will never hold nine cards, and a bar item
       that opens onto two was buying a top-level slot with a category count
       that is not coming.

       Still in the footer, and deliberately. It is a real page with two real
       destinations, and a page reachable from nowhere is an orphan in the
       sitemap. The prominent route to a best-of is now from inside its own
       category hub, where a reader is already choosing. */
    navSurface: "none",
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
    /* BotPlanet is an independent affiliate comparison publisher, not a shop.
       Keep the future route reserved, but do not advertise an empty retail
       destination in the global navigation or footer. */
    navSurface: "none",
    footerGroup: null,
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
    /* The masthead. It exists because "we tell you when not to buy" is worth
       exactly what a reader's willingness to believe somebody is behind it is
       worth, and until 10 August 2026 the answer was a name in a schema block
       nobody sees. */
    path: "/authors/",
    label: "Who writes this",
    breadcrumbLabel: "Authors",
    section: "company",
    parent: "/",
    status: "live",
    navSurface: "utility",
    footerGroup: "Company",
    inSitemap: true,
    indexable: true,
  },
  {
    path: "/authors/danny/",
    label: "Daniel Allan",
    breadcrumbLabel: "Daniel Allan",
    section: "company",
    parent: "/authors/",
    status: "live",
    navSurface: "none",
    footerGroup: null,
    inSitemap: true,
    indexable: true,
  },
  {
    path: "/authors/michelle-choa/",
    label: "Michelle Choa",
    breadcrumbLabel: "Michelle Choa",
    section: "company",
    parent: "/authors/",
    status: "live",
    navSurface: "none",
    footerGroup: null,
    inSitemap: true,
    indexable: true,
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
  /* THE FIRST PRODUCT-VERSUS-PRODUCT PAGE, 9 August 2026.

     Every other /compare/ route is a category — one page holding a whole
     range side by side. This one is two named machines, and it exists
     because Google's own People Also Ask carries the question in almost
     these words: "Which is better, Eilik or Emo?". The 6 August rule says
     the URL follows the phrasing people actually use, so the term is
     "eilik vs emo" and Eilik leads, in that order, because that is the
     order the question is asked in.

     It sits at a STATIC path so it wins against /compare/[category].astro,
     which would otherwise try to resolve "eilik-vs-emo" as a category and
     return a 404. */
  /* THE UNIVERSAL FINDER, 9 August 2026, and the first BotMatch route that
     is indexable.

     The nine per-category funnels are noindex: a questionnaire has nothing to
     rank and the result pages are private by design. This one is different
     because it carries the argument rather than just the form — how a robot
     gets picked, and the fact that the scorer cannot see price or commission.
     That is the claim worth being findable for.

     Its own children stay noindex. /botmatch/<category>/ and
     /recommendation/<token>/ are unchanged. */
  {
    path: "/botmatch/",
    label: "Find My Robot",
    breadcrumbLabel: "BotMatch",
    section: "botmatch",
    parent: "/",
    status: "live",
    navSurface: "bar",
    /* THE FOOTER'S BOTMATCH ENTRY SINCE 12 AUGUST 2026, replacing the pool
       matcher that had the slot to itself.

       THIS IS THE ONE PLACE THE JOURNEY WORK READS PAST THE LETTER OF A LOCKED
       RULE, so it is written down rather than slipped in. content/journeys.ts
       says the shell must never advertise a generic site-wide "find any robot",
       and it says why: a questionnaire cannot pick a robot without first
       knowing the category. This page is the answer to that objection rather
       than an instance of it — it asks the job before it asks anything else,
       hands the reader to that category's own questions, and scores nothing
       itself. It is also already live, indexable and in the sitemap under this
       exact label. A one-word owner instruction reverts it. */
    footerGroup: "BotMatch",
    inSitemap: true,
    indexable: true,
  },
  {
    path: "/compare/eilik-vs-emo/",
    label: "Eilik vs EMO",
    breadcrumbLabel: "Eilik vs EMO",
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
    /* THE SHORTLIST FOLDED INTO THIS PAGE, 12 August 2026.
       /best-robots/window-cleaning-robots/ was built on 7 August against this
       page's own research, which had already ruled the opposite way: the
       keyword register row for this hub records that "window cleaning robot"
       and "best window cleaning robot" share SIX of the top ten results and
       that a separate best-of "would have competed with this one for the same
       result set". It was built anyway, and for five days two of our URLs
       chased one SERP.

       An alias rather than a legacy redirect because it is neither — it is a
       page of ours that became a section of another page of ours, which is
       exactly what an alias is for: one permanent hop, no chain, and the
       destination proven canonical by the same test that proves every other
       alias. The content came with it; see PRICE_SECTION and FAQ_SECTION in
       content/category-sections.ts, and the register row for the terms this
       page now carries. */
    aliases: ["/best-robots/window-cleaning-robots/", "/best/window-cleaning-robots/"],
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
    /* REPARENTED FROM /best-robots/ TO THE CATEGORY HUB, 12 August 2026.
       The lawn best-of has always hung off its hub and this one hung off the
       index, so the two identical page types produced two different crumb
       trails — and this one gave the reader no way back to the category it
       ranks. A breadcrumb is the link back from a best-of to its hub; making
       both point the same way is what makes that true everywhere. */
    parent: `/robots/${CAT}/`,
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
    /* OUT OF THE FOOTER, 12 August 2026. This was the ONLY entry in the
       footer's BotMatch group, so the foot of every page on the site offered
       "Find My Pool Cleaner" and named none of the other eight matchers — the
       last surviving instance of the launch-category hardcode the audit found
       in the header, the drawer, the mega panel and the footer prompt.

       Not replaced by nine links: the footer's Explore group already lists all
       nine categories, and each hub carries its own matcher. The group now
       holds the universal picker instead, which asks the job first. */
    footerGroup: null,
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
    /* "/botmatch/" LEFT THIS LIST ON 9 AUGUST 2026 AND THAT IS THE POINT OF
       THE WHOLE CHANGE. It was an alias onto the pool funnel, written when
       pool was the only category with questions — so every reader who typed
       the obvious URL, or followed a generic link, was asked about their
       swimming pool whatever they had come for. It is now a real page that
       asks what job they want done first.

       The other two stay: /find-my-robot/ and its pool variant are legacy
       paths that were only ever the pool matcher. */
    aliases: ["/find-my-robot/", "/find-my-robot/pool-cleaners/"],
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
    path: "/best-robots/robotic-lawn-mowers/",
    label: "Best robot lawn mowers",
    breadcrumbLabel: "Robotic Lawn Mowers",
    section: "best",
    parent: "/robots/robotic-lawn-mowers/",
    status: "live",
    navSurface: "none",
    footerGroup: null,
    inSitemap: true,
    indexable: true,
    category: "robotic-lawn-mowers",
    summary: "Six mowers ranked on the two numbers that rule machines out: area and slope.",
  },

  /* /best-robots/window-cleaning-robots/ WAS HERE UNTIL 12 AUGUST 2026 and is
     now an alias of /robots/window-cleaning-robots/. Removed from the registry
     rather than flagged out of the sitemap, because a route record is what
     makes a URL a page: leaving one behind would keep the breadcrumb, the
     best-of index card and builtBestOfCategories() all pointing at something
     that answers 301. The reason it folded is on the hub's record above. */

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
 * Whether a product's own URL belongs in the sitemap.
 *
 * ONE PLACE FOR THE RULE, because the sitemap had it inline and got it wrong.
 * Until 11 August 2026 the sitemap admitted a product only when
 * `liveCategories()` contained its category — live, and nothing else. That was
 * right for `coming_soon`, where the hub is a labelled placeholder and the
 * category has not launched, and WRONG for `hidden`.
 *
 * A hidden category is a reserved slug with no hub, no route and no
 * comparative surfaces — but a published review beneath it is a finished,
 * indexable page. `[slug].astro` never passes `noindex` and never reads the
 * category's launch state, so that page indexes normally. Under the old rule
 * it indexed while this site never declared it: the worst of both, and
 * especially so for a page whose whole plan is an indexation head start
 * before a seasonal spike.
 *
 * So: live categories admit their products as before, hidden categories admit
 * only products that actually have a review written, and `coming_soon` admits
 * nothing. The hub, comparison and matcher of a hidden category stay out by
 * construction rather than by this rule — `sitemapRoutes()` above filters on
 * the route registry, and a hidden category has no routes registered at all.
 *
 * `hasPublishedReview` is passed in rather than read here, so this file does
 * not have to import the review registry to answer a routing question.
 */
export const productInSitemap = (opts: {
  slug: string;
  categorySlug: string;
  hasPublishedReview: boolean;
}): boolean => {
  /* A retired slug 301s to its replacement and a merged one 301s to the review
     that absorbed it. Either way, listing the URL asks a crawler to spend a
     fetch to be told to go somewhere else. */
  if (opts.slug in RETIRED_SLUGS || opts.slug in MERGED_REVIEWS) return false;

  const category = CATEGORIES.find((c) => c.slug === opts.categorySlug);
  if (!category) return false;
  if (category.launch === "live") return true;
  if (category.launch === "hidden") return opts.hasPublishedReview;
  return false; // coming_soon: the hub is a placeholder, so nothing under it ships
};

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
 *
 * A MERGED PRODUCT RESOLVES TO THE PAGE THAT COVERS IT, and that has to happen
 * here rather than at each caller. When the LUBA 3 AWD 3000H's review folded
 * into the 1500H's, the product itself stayed published — so the category grid
 * and the comparison table went on linking a URL that answers a 301, which the
 * link audit caught the same hour. Every one of those surfaces builds its href
 * from this function; making it merge-aware fixes all of them at once and
 * makes it impossible for the next merge to reintroduce the same fault.
 *
 * The redirect in [slug].astro stays, because an external link or a bookmark
 * on the old URL still has to land somewhere sensible. What changes is that we
 * stop spending our own crawl budget on it.
 */
export const productPath = (productSlug: string, categorySlug: string = LAUNCH_CATEGORY): string => {
  const merged = MERGED_REVIEWS[productSlug];
  return merged
    ? categoryPaths.product(merged.categorySlug, merged.into)
    : categoryPaths.product(categorySlug, productSlug);
};

/** Every alias in the registry, mapped to its canonical destination. */
export const REDIRECTS: { from: string; to: string }[] = ROUTES.flatMap((r) =>
  (r.aliases ?? []).map((from) => ({ from, to: r.path })),
);

/** Categories, re-exported so consumers need only one import. */
export { CATEGORIES, LAUNCH_CATEGORY, liveCategories };

/* ============================================================
   LEGACY REDIRECTS — the URLs Google still thinks are this site.

   WHAT THIS FIXES, AND HOW IT WAS FOUND. Search Console on 11 August 2026:
   62 pages indexed, and every one of them belongs to a PREVIOUS site on this
   domain — /product/*, /reviews/*, /blog/*, /shop, /quiz, /gifts. The 111
   pages that actually exist sit in "Discovered – currently not indexed" with
   Last crawled: N/A. Google knows they are there, from the sitemap, and has
   never fetched one of them.

   Meanwhile every old URL 404s. /security-robots, /robot-vacuums,
   /companion-robots and the rest were all checked by hand and all dead, each
   with a live replacement under /robots/. Google's own internal-link report
   still lists /shop, /categories, /new-robots and /returns-policy as this
   site's most-linked pages, which is a fair summary of what it believes.

   So the crawler spends what little budget a two-backlink domain earns on
   re-checking dead URLs, and never reaches the new ones. A 301 turns each of
   those dead ends into a signpost: it passes on whatever the old page was
   worth, and it is the strongest "this moved, come and look" signal available.

   WHAT IS DELIBERATELY NOT HERE. Anything that cannot be mapped honestly.
   Products the catalogue no longer holds — a Roomba j9+, a temi, two
   Husqvarnas — go to the category that covers them, because a reader who
   wanted a robot vacuum is served by the vacuum hub and is not served by the
   homepage. Old URLs with no category at all keep 404ing. The rule in
   lib/routing.ts stands: unknown routes 404, they are never swept to the
   homepage, and a redirect nobody can justify is worse than an honest 404.
   ============================================================ */

/** Old exact paths, and where each one honestly belongs now. */
export const LEGACY_REDIRECTS: { from: string; to: string; why: string }[] = [
  /* The old site put categories at the root. Every one of these is a live
     category today, one path segment deeper. */
  ...CATEGORIES.filter((c) => c.launch === "live").map((c) => ({
    from: `/${c.slug}/`,
    to: `/robots/${c.slug}/`,
    why: "Root-level category from the previous structure; the category still exists one segment deeper.",
  })),

  /* Cancelled before it was built. 004 Home Security was ruled out on no
     consumer demand in the SERPs, so there is no security category to land on
     and the robots index is the honest destination. */
  { from: "/security-robots/", to: "/robots/", why: "Home security was researched and cancelled; no such category exists, so the reader gets the full index rather than a 404." },
  { from: "/home-security-robots/", to: "/robots/", why: "The second phrasing the old site used for the same cancelled category." },

  /* Storefront-shaped pages from the old site. All of them were 'browse the
     catalogue', which is what /robots/ is now. (/shop/ is NOT here — it is a
     410, see GONE_PREFIXES.) */
  { from: "/categories/", to: "/robots/", why: "The old category index." },
  { from: "/new-robots/", to: "/robots/", why: "The old new-arrivals list; nothing on this site replaces it, and the index is the nearest honest answer." },
  { from: "/product/", to: "/robots/", why: "Bare product index from the old structure." },
  { from: "/reviews/", to: "/robots/", why: "Bare review index from the old structure." },
  { from: "/blog/", to: "/guides/", why: "The old blog is the guides section now." },

  /* /quiz/, /gifts/ and /shop/ USED TO REDIRECT AND NOW RETURN 410. See
     GONE_PREFIXES below for why. They are deliberately absent from this list. */

  /* Policy pages that were renamed rather than removed. */
  { from: "/privacy-policy/", to: "/privacy/", why: "The policy is the same policy; only the URL got shorter when the site was rebuilt." },
  /* NOT /contact/. It was on the old site and it is on this one, so it needs
     no redirect — and a redirect would have broken a live page. Caught by
     routing.test.ts, which is why the collision check below is a test rather
     than a comment. */
  { from: "/returns-policy/", to: "/terms/", why: "This site sells nothing directly, so it has no returns policy of its own. Terms is where the commercial relationship is described." },
  { from: "/shipping-policy/", to: "/terms/", why: "As above — delivery is the retailer's, not ours." },
];

/**
 * THE OLD SITES' URLS THAT ARE NOT COMING BACK — 410 Gone, not 404, not 301.
 *
 * Two earlier sites lived on this domain. Google still holds their URLs and was
 * still crawling them on 8 August 2026, spending crawl budget on a site that
 * has almost none: two backlinks, ten Googlebot visits a fortnight, and
 * twenty-seven current pages it has never fetched.
 *
 * WHY 410 RATHER THAN 404. Both say "not here", but 404 means "maybe later" and
 * 410 means "deliberately gone". Google retries a 404 for a long time and drops
 * a 410 far faster. When the goal is to get an old catalogue out of the index so
 * the crawler spends its budget on the current pages, 410 is the instruction
 * that actually says so.
 *
 * WHY 410 RATHER THAN 301. These three were redirected until 12 August 2026 —
 * /shop/ and /gifts/ to /robots/, /quiz/ to /botmatch/. A redirect claims the
 * destination answers the request, and it does not: somebody looking for a
 * seasonal gift finder or a storefront basket is not looking for a robot
 * comparison index. Worse, a 301 keeps the old URL alive in Google's mind
 * indefinitely, which is the opposite of what we want. Owner decision,
 * 12 August 2026.
 *
 * MATCHED BY PREFIX, and the query string is ignored: the old catalogue's URLs
 * were /shop?category=cleaning-robots and similar, so matching the path alone
 * covers every variant without listing them.
 */
export const GONE_PREFIXES: { prefix: string; why: string }[] = [
  { prefix: "/gifts", why: "Seasonal gift finder from the previous site. No successor, and a robot index does not answer it." },
  { prefix: "/quiz", why: "The previous site's questionnaire. BotMatch does the job properly, but at its own URL and with its own questions." },
  { prefix: "/shop", why: "The previous site's storefront, including /shop?category=… . This site sells nothing directly." },
];

/**
 * The previous robot site's content URLs, which DO have live equivalents.
 *
 * Unlike the three above, these were real editorial pages about real machines,
 * and the reader who follows one still wants what it was about. Each maps
 * explicitly — no pattern-guessing a destination, because a redirect that lands
 * on the wrong robot is worse than one that lands on the index.
 *
 * Every `from` here was seen in Search Console.
 */
export const LEGACY_CONTENT_REDIRECTS: { from: string; to: string; why: string }[] = [
  {
    from: "/product/emo-ai-desktop-pet/",
    to: "/robots/companion-robots/living-ai-emo/",
    why: "The same machine. The old site called it by its marketing name, this one by maker and model.",
  },
  {
    from: "/reviews/worx-landroid-m-review-your-weekend-back-for-a-grand/",
    to: "/robots/robotic-lawn-mowers/worx-landroid-vision-wr320/",
    why: "The Landroid M is discontinued; the Landroid Vision WR320 is the model that replaced it in the same range and price band.",
  },
  {
    from: "/blog/best-ai-pet-robots/",
    to: "/robots/companion-robots/",
    why: "A best-of listicle about robot pets. The companion hub is the page that covers those machines now.",
  },
  {
    from: "/category/wearable-robots/",
    to: "/robots/",
    why: "No wearable-robot category exists here and none is planned, so the reader gets the full index rather than a pretend match.",
  },
];

/**
 * Path prefixes from the old robot site whose UNMAPPED children go to /robots/.
 *
 * The explicit map above handles what Search Console showed. This handles the
 * long tail nobody has seen yet: an old /blog/ post or /category/ page that
 * still has a link somewhere. /robots/ is the honest destination — it is the
 * index of everything this site covers, and it is a real answer to "I was
 * looking at robots on this domain".
 *
 * Deliberately NOT a redirect to the homepage: the homepage sells the site,
 * the index answers the request.
 */
export const LEGACY_PREFIX_FALLBACK = {
  prefixes: ["/product/", "/category/", "/reviews/", "/blog/"],
  to: "/robots/",
} as const;

/**
 * Old product and review URLs, resolved by slug rather than listed one by one.
 *
 * The previous site used /product/<slug> and /reviews/<slug>-review-<some
 * headline>. Where that slug still names something in the catalogue the
 * redirect is exact; where it does not, the reader goes to the category that
 * covers what they were looking at.
 */
const LEGACY_PRODUCT_CATEGORY: Record<string, string> = {
  /* Gone from the catalogue, but the category that covers them is live, so a
     reader who arrived for one of these is still served. */
  "irobot-roomba-j9-plus": "robot-vacuums",
  "ecovacs-deebot-x2-omni": "robot-vacuums",
  "husqvarna-automower-430xh": "robotic-lawn-mowers",
  "husqvarna-automower-450x-nera": "robotic-lawn-mowers",
  "ecovacs-goat-a3000": "robotic-lawn-mowers",
  "miko-mini-ai-robot": "companion-robots",
  "temi-v3-robot": "companion-robots",
  "jjrc-r2-cady-wida": "educational-coding-robots",
  "amazon-echo-show-10": "companion-robots",
};

/**
 * Resolve a legacy /product/ or /reviews/ path, or return null.
 *
 * Old review slugs carried a headline — "sphero-bolt-review-the-smartest-
 * hamster-ball-in-the-galaxy" — so the product slug is matched as a PREFIX and
 * the longest match wins, which stops a shorter slug claiming a longer one's
 * URL.
 */
export const legacyProductRedirect = (
  pathname: string,
  known: { slug: string; categorySlug: string }[],
): string | null => {
  const m = /^\/(?:product|reviews)\/([a-z0-9-]+)\/?$/.exec(pathname.toLowerCase());
  if (!m) return null;
  const slug = m[1];

  const exact = known.find((k) => k.slug === slug);
  if (exact) return productPath(exact.slug, exact.categorySlug);

  const prefixed = known
    .filter((k) => slug.startsWith(`${k.slug}-`))
    .sort((a, b) => b.slug.length - a.slug.length)[0];
  if (prefixed) return productPath(prefixed.slug, prefixed.categorySlug);

  for (const [old, category] of Object.entries(LEGACY_PRODUCT_CATEGORY)) {
    if (slug === old || slug.startsWith(`${old}-`)) return `/robots/${category}/`;
  }
  return null;
};
