/**
 * BotMatch journeys — category-aware recommendation configuration.
 *
 * PRODUCT RULE: BotMatch is category-specific. It cannot meaningfully "find any
 * robot" without first knowing the category and the customer's need, so the
 * public shell must never advertise a generic site-wide "Find My Robot".
 * Every CTA is supplied by the journey for a concrete category.
 *
 * Adding a future category means adding one entry here — no component changes,
 * no hard-coded label anywhere in the shell. Only the launch category is
 * defined today; later journeys are built in their own jobs.
 */
import { LAUNCH_CATEGORY, routes } from "./nav";

export interface BotMatchJourney {
  /** Category slug this journey belongs to (matches the nav registry). */
  category: string;
  /** Button label, e.g. "Find My Pool Cleaner". Always category-specific. */
  ctaLabel: string;
  /**
   * The thing itself, singular and lowercase, for a sentence: "Not sure which
   * POOL CLEANER fits?".
   *
   * WRITTEN OUT RATHER THAN DERIVED. The first version of the footer prompt
   * took the category's display name and stripped a trailing "s", which
   * produced "Not sure which self-cleaning litter BOXE fits?", "which robot
   * vacuums & MOP", "which coding robots for KID" and "which companion robots
   * & robot PET". Display names are plural noun phrases with ampersands in
   * them; English singulars are not a regex. Nine short strings, typed once.
   */
  subject: string;
  /**
   * What the reader is matching AGAINST — their windows, their pool, their
   * lawn. Not the machine.
   *
   * The snapshot CTA read "Match this against my window robot" when it was
   * first given a noun on 14 August 2026, which matches a robot against a
   * robot. `subject` is the product; this is the thing the product has to
   * suit, and they are never the same word.
   */
  matchAgainst: string;
  /** Heading for the journey itself, e.g. on the questionnaire page. */
  journeyTitle: string;
  /** One sentence explaining what the questionnaire actually does. */
  explanation: string;
  /** Route that starts the journey. */
  href: string;
  /**
   * Whether this journey's CTA carries the primary accent. The accent marks the
   * highest-value action on a page; a future secondary journey can opt out.
   */
  accent?: boolean;
}

/**
 * Journeys by category slug.
 *
 * Future entries follow the same shape, for example:
 *   "robotic-lawn-mowers":   ctaLabel "Find My Robot Mower"
 *   "window-cleaning-robots": ctaLabel "Choose My Window-Cleaning Robot"
 *   "robot-vacuums":          ctaLabel "Help Me Pick a Robot Vacuum"
 * They are intentionally NOT defined yet — each is built in its own job.
 */
/* @extension-point per-category | optional | The shell's BotMatch button keeps
   pointing at the launch category's journey, so a reader on a lawn page is
   offered "Find My Pool Cleaner". Cosmetic but wrong, and visible in the
   header on every page of the category. */
export const BOTMATCH_JOURNEYS: Record<string, BotMatchJourney> = {
  [LAUNCH_CATEGORY]: {
    category: LAUNCH_CATEGORY,
    ctaLabel: "Find My Pool Cleaner",
    subject: "pool cleaner",
    matchAgainst: "my pool",
    journeyTitle: "Find your robotic pool cleaner",
    explanation:
      "Answer a few pool-specific questions and get one clear recommendation.",
    href: routes.botmatch(LAUNCH_CATEGORY),
    accent: true,
  },
  /* Both added 6 August 2026 with their categories. Without an entry the
     shell's BotMatch button keeps saying "Find My Pool Cleaner" on every page
     of these two categories, which is cosmetic but visibly wrong in the header
     of every page a reader sees. */
  "companion-robots": {
    category: "companion-robots",
    ctaLabel: "Find My Robot Pet",
    subject: "robot pet",
    matchAgainst: "who it is for",
    journeyTitle: "Find your robot pet",
    explanation:
      "Tell us who it is for and whether a monthly fee is acceptable, and get one clear recommendation.",
    href: routes.botmatch("companion-robots"),
    accent: true,
  },
  "pet-camera-robots": {
    category: "pet-camera-robots",
    ctaLabel: "Find My Pet Camera Robot",
    subject: "pet camera robot",
    matchAgainst: "my home and my pet",
    journeyTitle: "Find your pet camera robot",
    explanation:
      "Tell us about your stairs, your floors and your pet, and get one clear recommendation.",
    href: routes.botmatch("pet-camera-robots"),
    accent: true,
  },
  "self-cleaning-litter-boxes": {
    category: "self-cleaning-litter-boxes",
    ctaLabel: "Find My Litter Box",
    subject: "litter box",
    matchAgainst: "my cat",
    journeyTitle: "Find your self-cleaning litter box",
    explanation:
      "Tell us your cat's size and how many you have, and get one clear recommendation.",
    href: routes.botmatch("self-cleaning-litter-boxes"),
    accent: true,
  },
  "grill-cleaning-robots": {
    category: "grill-cleaning-robots",
    ctaLabel: "Find My Grill Cleaner",
    subject: "grill cleaner",
    matchAgainst: "my grill",
    journeyTitle: "Find your grill cleaning robot",
    explanation:
      "Tell us what your grates are made of and how often you cook, and get one clear answer.",
    href: routes.botmatch("grill-cleaning-robots"),
    accent: true,
  },
  "robot-vacuums": {
    category: "robot-vacuums",
    ctaLabel: "Find My Robot Vacuum",
    subject: "robot vacuum",
    matchAgainst: "my floors",
    journeyTitle: "Find your robot vacuum",
    explanation:
      "Tell us what is on your floors and whether there is an animal in the house, and get one clear recommendation.",
    href: routes.botmatch("robot-vacuums"),
    accent: true,
  },
  "educational-coding-robots": {
    category: "educational-coding-robots",
    ctaLabel: "Find My Coding Robot",
    subject: "coding robot",
    matchAgainst: "their age and their kit",
    journeyTitle: "Find their first coding robot",
    explanation:
      "Tell us how old they are and whether a tablet is available, and get one clear recommendation.",
    href: routes.botmatch("educational-coding-robots"),
    accent: true,
  },
  /* THE LAST TWO, ADDED 12 AUGUST 2026, and the reason the shell said
     "Find My Pool Cleaner" to a window buyer and a lawn buyer for a week.
     Both matchers have had their own question set and their own scoring config
     since 7 and 10 August — window scores eleven machines, lawn scores seven —
     so the only thing missing was the label the shell reads. */
  "window-cleaning-robots": {
    category: "window-cleaning-robots",
    ctaLabel: "Find My Window Robot",
    subject: "window robot",
    matchAgainst: "my windows",
    journeyTitle: "Find your window cleaning robot",
    explanation:
      "Tell us whether your glass is frameless, whether there is a socket nearby and whether the window opens, and get one clear recommendation.",
    href: routes.botmatch("window-cleaning-robots"),
    accent: true,
  },
  "robotic-lawn-mowers": {
    category: "robotic-lawn-mowers",
    ctaLabel: "Find My Robot Mower",
    subject: "robot mower",
    matchAgainst: "my lawn",
    journeyTitle: "Find your robot lawn mower",
    explanation:
      "Tell us your lawn's area, its worst slope and how much tree cover it has, and get one clear recommendation.",
    href: routes.botmatch("robotic-lawn-mowers"),
    accent: true,
  },
};

/** Universal homepage journey. Category pages continue to use their own
 * concrete matcher; only the front door uses the job-first router. */
export const UNIVERSAL_BOTMATCH_JOURNEY: BotMatchJourney = {
  category: "universal",
  ctaLabel: "Find Your Robot",
  subject: "robot",
  matchAgainst: "the job",
  journeyTitle: "Find the right robot for the job",
  explanation: "Tell us what you need done and get a shortlist you can check.",
  href: "/botmatch/",
  accent: true,
};

/**
 * The category a URL belongs to, or null.
 *
 * The registry answers this for every REGISTERED route, including guides,
 * whose category is not in their path. It cannot answer for a product page —
 * /robots/<cat>/<slug>/ is a dynamic route with no record — so the four
 * category-scoped URL shapes are read directly first. Both halves are needed:
 * the path shapes cover the pages that are not registered, the registry covers
 * the pages whose category the path does not spell.
 */
export function categoryOfPath(pathname: string, routeCategory?: string | null): string | null {
  const m = /^\/(robots|compare|botmatch|best-robots)\/([a-z0-9-]+)\//.exec(pathname.toLowerCase());
  if (m) return m[2];
  return routeCategory ?? null;
}

/**
 * The journey the shell should advertise on a given page — or null, meaning
 * show no BotMatch button at all.
 *
 * THREE OUTCOMES, AND THE THIRD IS THE POINT.
 *
 *  - A category page whose matcher can answer gets that category's journey.
 *    This is what was broken: Header.astro called shellJourney() with no
 *    argument, so the fallback fired on every page of every category and a
 *    window buyer was offered "Find My Pool Cleaner" seven times over.
 *
 *  - A category page whose matcher CANNOT answer gets nothing. Grill has one
 *    published machine against MIN_PRODUCTS_FOR_A_MATCH of two, so scoring a
 *    questionnaire against it and announcing the result would tell a reader a
 *    comparison happened when nothing was compared. PRE-BUILD-PROCESS.md Stage
 *    5b, and it outranks having a button in the header. Falling back to pool
 *    here would just be the original bug wearing a smaller hat.
 *
 *  - Everything else — the homepage, /about/, /guides/ — keeps the launch
 *    journey, UNCHANGED. The universal job-picker at /botmatch/ is live and
 *    would arguably be the better answer there, but the product rule at the top
 *    of this file forbids the shell advertising a generic "find any robot" and
 *    that rule is the owner's, not a builder's to reinterpret in passing.
 */
export function shellJourneyFor(
  pathname: string,
  opts: { routeCategory?: string | null; canMatch: (slug: string) => boolean },
): BotMatchJourney | null {
  const cat = categoryOfPath(pathname, opts.routeCategory);
  if (!cat) return pathname === "/" ? UNIVERSAL_BOTMATCH_JOURNEY : BOTMATCH_JOURNEYS[LAUNCH_CATEGORY];
  const journey = journeyFor(cat);
  if (!journey) return null;
  return opts.canMatch(cat) ? journey : null;
}

/** The journey for a category, or null when that category has none yet. */
export function journeyFor(category: string | undefined | null): BotMatchJourney | null {
  if (!category) return null;
  return BOTMATCH_JOURNEYS[category] ?? null;
}

/**
 * The journey the global shell should advertise. Today that is the single live
 * launch category; when more categories go live this becomes the one matching
 * the page's category, falling back to the launch journey.
 */
export function shellJourney(currentCategory?: string | null): BotMatchJourney {
  return journeyFor(currentCategory) ?? BOTMATCH_JOURNEYS[LAUNCH_CATEGORY];
}
