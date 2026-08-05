/* ============================================================
   Category hero content, keyed by category slug.

   Wording for robotic pool cleaners is taken from the approved
   Notion research (Page 001 — Robotic Pool Cleaners, Keyword &
   Content Blueprint): exact H1, exact meta description, primary
   keyword in the first sentence, one natural synonym inside the
   first 100 words, and no "best" framing (that term belongs to
   the best-of guide).

   A category with no entry here falls back to the generic
   heading on the category page. Add an entry to give it a hero.
   ============================================================ */

import type { HeroCta, HeroImage } from "../components/CategoryHero.astro";

export interface CategoryHeroContent {
  eyebrow?: string;
  /** Exact approved H1. */
  title: string;
  /** 55–85 words. */
  subtitle: string;
  /** Approved <title>. */
  seoTitle: string;
  /** Approved meta description. */
  metaDescription: string;
  primaryCta?: HeroCta;
  secondaryCta?: HeroCta;
  /** Drop the artwork in and fill this out. Omit it and the hero renders text-only. */
  image?: HeroImage;
  /** "above" for wide cinematic artwork, "beside" for squarer artwork. */
  imageLayout?: "above" | "beside";
}

export const CATEGORY_HERO: Record<string, CategoryHeroContent> = {
  /* Keyword evidence: DataForSEO run 30981257806, 2026-08-05, $0.2044.
     "window cleaning robot" is 12,100/mo at KD 0-5 and Google groups four
     other phrasings into it (robot window cleaner, robotic window cleaner,
     window cleaner robot, window washing robot). "automatic window cleaner"
     is a SEPARATE cluster worth 8,100 at KD 0, so it earns a place in the
     subtitle rather than being treated as the same words.

     This page also carries the "best" job — there is no separate best-of
     page, because 6 of the top 10 results are identical between the two
     terms and NYTimes ranks first for both with a single article. */
  "window-cleaning-robots": {
    eyebrow: "Robot category",
    title: "Window Cleaning Robots: Compare Robot Window Cleaners",
    /* 44 words, matching the shortened pool intro Danny approved rather than
       the older 55-85 range. Primary term opens sentence one; the separate
       8,100/mo cluster appears naturally in sentence two. */
    subtitle:
      "A window cleaning robot grips the glass, sprays and wipes its way across it, and " +
      "does the panes you would rather not reach. An automatic window cleaner is not right " +
      "for every window though — the frame, the height and the glass decide it, and we " +
      "compare them on exactly that.",
    seoTitle: "Window Cleaning Robots: Compare Robot Window Cleaners | BotPlanet",
    metaDescription:
      "Compare window cleaning robots by glass type, framed or frameless, suction power, " +
      "safety tether and app control. Find the right robot window cleaner for your windows.",
    primaryCta: { label: "Compare window robots", href: "#products" },
    secondaryCta: { label: "Try Window BotMatch", href: "/botmatch/window-cleaning-robots/" },
    /* Owner-created BotPlanet artwork, supplied 2026-08-05. Carries in-image
       BotPlanet branding by the owner's design decision. The machine in the
       artwork is badged AIPER, a pool-robot brand that makes no window robot
       and appears nowhere in this catalogue; raised with the owner, who
       confirmed it stands. Recorded so a future reader finds a decision
       rather than assuming a mistake. */
    image: {
      src: "/media/window/hero-desktop.webp",
      mobileSrc: "/media/window/hero-mobile.webp",
      alt:
        "A window cleaning robot gripping the glass wall of a modern home at dusk, water " +
        "spraying across the pane, with a warmly lit living room and a coastline visible " +
        "behind the glass.",
      focal: "50% 50%",
    },
    imageLayout: "above",
  },

  "robotic-pool-cleaners": {
    eyebrow: "Robot category",
    title: "Robotic Pool Cleaners: Compare Pool Robots for Every Pool Type",
    /* 40 words. Danny approved this shorter intro on 2 August 2026 in place of
       the 55–85 word range in the Notion research, so the block scans in about
       four lines on a phone rather than nine. Keyword rules still hold:
       "robotic pool cleaner" opens the first sentence and "pool robot" follows
       as the natural synonym. */
    subtitle:
      "A robotic pool cleaner scrubs the floor, climbs the walls and lifts debris out of " +
      "the water while you get on with your day. Not every pool robot suits every pool — " +
      "we compare them on the things that actually decide it.",
    seoTitle: "Robotic Pool Cleaners: Compare Pool Robots | BotPlanet",
    metaDescription:
      "Compare robotic pool cleaners by pool type, floor, wall and waterline coverage, corded " +
      "or cordless power, filtration and smart controls. Find the right pool robot.",
    primaryCta: { label: "Compare pool robots", href: "#products" },
    secondaryCta: { label: "Try Pool BotMatch", href: "/botmatch/robotic-pool-cleaners/" },

    /* Owner-created BotPlanet artwork. Carries approved in-image BotPlanet
       branding, which is deliberate editorial media — do not crop it out or
       swap it for a plain packshot. Master supplied as PNG; the files below
       are the optimised WebP derivatives (133 KB / 85 KB).
       Mobile is a 3:2 centre crop that keeps both the logo and the robot. */
    image: {
      src: "/media/pool/hero-desktop.webp",
      mobileSrc: "/media/pool/hero-mobile.webp",
      alt:
        "Cutaway view of a lit in-ground swimming pool at dusk with a tracked " +
        "BotPlanet robotic pool cleaner working across the pool floor, a modern " +
        "house lit behind it.",
      focal: "50% 55%",
    },
    imageLayout: "above",
  },
};

export function heroFor(slug: string | undefined): CategoryHeroContent | undefined {
  return slug ? CATEGORY_HERO[slug] : undefined;
}
