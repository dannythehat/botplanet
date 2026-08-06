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
    journeyTitle: "Find your robot pet",
    explanation:
      "Tell us who it is for and whether a monthly fee is acceptable, and get one clear recommendation.",
    href: routes.botmatch("companion-robots"),
    accent: true,
  },
  "pet-camera-robots": {
    category: "pet-camera-robots",
    ctaLabel: "Find My Pet Camera Robot",
    journeyTitle: "Find your pet camera robot",
    explanation:
      "Tell us about your stairs, your floors and your pet, and get one clear recommendation.",
    href: routes.botmatch("pet-camera-robots"),
    accent: true,
  },
  "self-cleaning-litter-boxes": {
    category: "self-cleaning-litter-boxes",
    ctaLabel: "Find My Litter Box",
    journeyTitle: "Find your self-cleaning litter box",
    explanation:
      "Tell us your cat's size and how many you have, and get one clear recommendation.",
    href: routes.botmatch("self-cleaning-litter-boxes"),
    accent: true,
  },
};

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
