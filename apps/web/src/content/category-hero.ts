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
  /* Keyword evidence: DataForSEO runs 31073327230 and 31074893036,
     2026-08-06, $0.22428 combined. Full working in
     docs/seo/robotic-lawn-mowers-research-findings.md.

     "robot lawn mower" is 74,000/mo and Google groups four other phrasings
     into it (robotic lawn mower, robotic lawnmower, lawn mowing robot, robot
     grass cutter) — the measured overlap between the first two is 8/10.
     "robot mower" is a SEPARATE cluster at 22,200 and earns its place in the
     H1 rather than being treated as the same words.

     TWO THINGS THIS PAGE IS BUILT AROUND, both from the research:

     1. The head term is KD 36-54 and half its top ten is manufacturer sites
        — husqvarna.com, worx.com, navimow.com, mammotion.com, yarbo.com. A
        comparison site does not win that SERP. "best robot lawn mower" is
        KD 8 and returns nothing but editorial. So the copy is written to win
        the "best" cluster (~13,400/mo) while the head term is what the page
        is named for.

     2. Unlike window, hub and best-of are NOT the same SERP here — 2/10
        shared, against window's 6/10. The one-URL rule still applies (owner
        ruling, 5 August 2026), so this page carries the "best" job too, but
        the merge is a policy decision rather than something the data asked
        for. Recorded so a future reader does not mistake it for evidence.

     The acreage cluster (~2,060/mo: 1 acre, 2 acres, half acre, small yard)
     lives in the yard-size section below, NOT in a guide — "best robot lawn
     mower for 1 acre" shares 6/10 with "best robot lawn mower". */
  "robotic-lawn-mowers": {
    eyebrow: "Robot category",
    /* 41 words. Primary term opens sentence one; the separate 22,200/mo
       "robot mower" cluster lands naturally in sentence two, and yard size —
       the biggest long-tail cluster and the first BotMatch question — is the
       thing the last sentence promises. */
    title: "Robotic Lawn Mowers: Compare Robot Mowers for Every Yard Size",
    subtitle:
      "A robot lawn mower cuts a little every day instead of a lot once a week, which is why " +
      "a lawn it looks after stays even rather than recovering between mows. Not every robot " +
      "mower suits every yard though — size, slope and tree cover rule machines out fast, and " +
      "we compare them on exactly that.",
    seoTitle: "Robotic Lawn Mowers: Compare Robot Mowers | BotPlanet",
    metaDescription:
      "Compare robotic lawn mowers by yard size, slope, boundary wire or wire-free RTK " +
      "navigation, zones and price. Find the right robot mower for your lawn.",
    primaryCta: { label: "Compare robot mowers", href: "#products" },
    /* No BotMatch CTA yet, unlike pool and window. /botmatch/robotic-lawn-mowers/
       resolves, but the questionnaire is still the pool question set — it would
       ask a lawn buyer how long their pool is. Sending readers there would be
       advertising a tool that does not exist. The second CTA goes to the
       decision this category actually turns on instead. Swap it back to
       BotMatch when the lawn question set lands. */
    secondaryCta: { label: "Wire or wire-free?", href: "#navigation" },
    /* No hero artwork yet. The interface allows it and the hero renders
       text-only rather than blocking the page — the category was built before
       its images on the owner's instruction of 6 August 2026 ("we will do
       pages first, then add products afterwards"). The masters needed are
       listed in docs/seo/robotic-lawn-mowers-research-findings.md §10. Do NOT reuse
       /media/lawn-category/feature-desktop.webp here: it is the homepage
       teaser, composed with a dark left gutter for overlaid text, and it
       already appears further down this page in the BotMatch panel. */
    imageLayout: "above",
  },

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
      /* The mobile master is a 4:5 portrait — logo at the top, headline
         beneath it. The default 3:2 slot cropped both away. */
      mobileAspect: "4 / 5",
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
