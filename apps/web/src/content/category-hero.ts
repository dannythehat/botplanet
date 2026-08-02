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
