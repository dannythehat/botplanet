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
}

export const CATEGORY_HERO: Record<string, CategoryHeroContent> = {
  "robotic-pool-cleaners": {
    eyebrow: "Robot category",
    title: "Robotic Pool Cleaners: Compare Pool Robots for Every Pool Type",
    subtitle:
      "A robotic pool cleaner does the job you would rather not do — scrubbing the floor, " +
      "climbing the walls and lifting debris out of the water while you get on with your day. " +
      "Not every pool robot suits every pool. We compare models on the things that actually " +
      "decide it: pool type and size, how much of the pool they reach, corded or cordless " +
      "power, filtration and smart controls.",
    seoTitle: "Robotic Pool Cleaners: Compare Pool Robots | BotPlanet",
    metaDescription:
      "Compare robotic pool cleaners by pool type, floor, wall and waterline coverage, corded " +
      "or cordless power, filtration and smart controls. Find the right pool robot.",
    primaryCta: { label: "Compare pool robots", href: "#products" },
    secondaryCta: { label: "Try Pool BotMatch", href: "/botmatch/robotic-pool-cleaners/" },

    /* ------------------------------------------------------------------
       IMAGE SLOT — currently empty, so the hero renders text-only.

       To add the artwork:
         1. put the files in  apps/web/public/media/pool/
         2. uncomment the block below and set the real filenames + alt text

       image: {
         src: "/media/pool/hero-desktop.jpg",
         mobileSrc: "/media/pool/hero-mobile.jpg",
         alt: "A robotic pool cleaner working across the floor of a lit swimming pool at dusk.",
         focal: "50% 45%",
       },
       ------------------------------------------------------------------ */
  },
};

export function heroFor(slug: string | undefined): CategoryHeroContent | undefined {
  return slug ? CATEGORY_HERO[slug] : undefined;
}
