/* ============================================================
   Natural internal-link anchors.

   WHAT THIS IS FOR. An internal link is only worth anything if the
   anchor text is the phrase a reader would have searched for, sitting
   in a sentence where following it is the obvious next move. Bolting
   "click here" or a keyword-stuffed exact-match phrase onto the end
   of a paragraph does the opposite: it tells Google the page is
   optimised and tells the reader nothing.

   So anchors are declared as PHRASES THAT ALREADY EXIST IN THE PROSE.
   Nothing is inserted into the writing to create a link. If the phrase
   is not there, no link appears — and that is the signal that either
   the writing or the link plan is wrong, not something to paper over.

   THE RULES, AND WHY.

   One link per anchor per page. The first mention is where a reader
   is most likely to want the detour; the fourth is where a link
   becomes wallpaper.

   Never inside a heading. A heading is a signpost for this page, not
   a route off it.

   Never inside an existing link. Nested anchors are invalid HTML and
   the browser's recovery is unpredictable.

   Live targets only. `status: "planned"` records the anchor and its
   intended destination without rendering a link, so the plan is
   written down before the page exists and turns into a real link the
   day it does. A link to a 404 is worse than no link.
   ============================================================ */

export interface InternalAnchor {
  /** The phrase as it appears in the prose. Matched case-insensitively. */
  anchor: string;
  /** Canonical destination path. */
  href: string;
  /** Why this phrase belongs to this page. Kept for review, not rendered. */
  why: string;
  /**
   * "live" renders a link. "planned" records the intent and renders nothing,
   * because a link to a page that does not exist is worse than no link.
   */
  status: "live" | "planned";
  /** How many times this anchor may link on one page. Defaults to 1. */
  max?: number;
}

/**
 * Anchors available to every page in a category, in priority order.
 *
 * Order matters: the linker takes the first match it finds for each anchor,
 * and an earlier entry wins a phrase that two entries could both claim.
 */
/* @extension-point per-category | optional | The category's pages stop
   cross-linking to each other, which costs internal PageRank and leaves a
   reader at the bottom of a review with nowhere to go. internal-links.test.ts
   checks the anchors that DO exist resolve; it cannot check for absence. */
export const CATEGORY_ANCHORS: Record<string, InternalAnchor[]> = {
  "robot-vacuums": [
    {
      anchor: "mop lifting",
      href: "/robots/robot-vacuums/#floors",
      why: "The specification that decides whether a vacuum-mop works in a house with any carpet at all, and the one buried deepest in the spec sheets. Every product page will mention it; the reasoning belongs in one place.",
      status: "live",
    },
    {
      anchor: "pet hair",
      href: "/robots/robot-vacuums/#pet-hair",
      why: "The biggest single reason people buy one, and the section explaining why brush design matters more than suction.",
      status: "live",
    },
    {
      anchor: "self emptying",
      href: "/robots/robot-vacuums/#pet-hair",
      why: "Explained where it matters most rather than in the price ladder — in a pet household it is the clearest quality-of-life upgrade in the category.",
      status: "live",
    },
    {
      anchor: "obstacle avoidance",
      href: "/robots/robot-vacuums/#before-you-buy",
      why: "Most of the price gap between a cheap machine and an expensive one, and the checklist is where the honest question about your own floor sits.",
      status: "live",
    },
    {
      anchor: "compare",
      href: "/compare/robot-vacuums/",
      why: "The comparison table is the honest next step once floor type has narrowed the field.",
      status: "live",
    },
    {
      anchor: "review methodology",
      href: "/review-methodology/",
      why: "Any claim about how we check things should be one click from the page that says how we check things.",
      status: "live",
    },
    {
      anchor: "BotMatch",
      href: "/botmatch/robot-vacuums/",
      why: "Planned until the catalogue has products. The funnel's first question is the floor-type exclusion, which is the most useful thing it does.",
      status: "planned",
    },
  ],

  "grill-cleaning-robots": [
    {
      anchor: "porcelain",
      href: "/robots/grill-cleaning-robots/#grate-type",
      why: "The only hard exclusion in the category and the one mistake that is not recoverable. Any page mentioning porcelain grates should reach the section explaining why brass strips them.",
      status: "live",
    },
    {
      anchor: "wire bristles",
      href: "/robots/grill-cleaning-robots/#bristles",
      why: "The honest commercial argument for the whole category, and the one a reader is most likely to have arrived worried about.",
      status: "live",
    },
    {
      anchor: "brush",
      href: "/robots/grill-cleaning-robots/#robot-or-brush",
      why: "The comparison every buyer here is actually making. The word recurs throughout the prose and the reasoning belongs in one place.",
      status: "live",
    },
    {
      anchor: "compare",
      href: "/compare/grill-cleaning-robots/",
      why: "The comparison table is the next step once grate type has been settled.",
      status: "live",
    },
    {
      anchor: "review methodology",
      href: "/review-methodology/",
      why: "Any claim about how we check things should be one click from the page that says how we check things.",
      status: "live",
    },
    {
      anchor: "BotMatch",
      href: "/botmatch/grill-cleaning-robots/",
      why: "Planned until the catalogue has products. The funnel's first question is the grate-material exclusion, and it is willing to answer 'buy a brush'.",
      status: "planned",
    },
  ],

  "self-cleaning-litter-boxes": [
    {
      anchor: "safety",
      href: "/robots/self-cleaning-litter-boxes/#safety",
      why: "The most important section on the page and the only one readers arrive already worried about. Google surfaced the vet question on six of the twenty-three SERPs bought for this category, so any page mentioning safety should reach the explanation in one click.",
      status: "live",
    },
    {
      anchor: "clumping litter",
      href: "/robots/self-cleaning-litter-boxes/#litter-type",
      why: "The fork that decides three-year running cost, and the phrase recurs across the prose. A reader meeting it on a product page should be able to reach the reasoning.",
      status: "live",
    },
    {
      anchor: "large cat",
      href: "/robots/self-cleaning-litter-boxes/#cat-size",
      why: "Chamber size is a hard rule-out and the cat-size section is where the three groups are separated. First mention should reach it.",
      status: "live",
    },
    {
      anchor: "multiple cats",
      href: "/robots/self-cleaning-litter-boxes/#what-it-fixes",
      why: "The strongest commercial case in the category, and the section that also states the one-box-per-cat-plus-one rule the machine does not repeal.",
      status: "live",
    },
    {
      anchor: "compare",
      href: "/compare/self-cleaning-litter-boxes/",
      why: "The comparison table is the honest next step once cat size and litter type have narrowed the field.",
      status: "live",
    },
    {
      anchor: "review methodology",
      href: "/review-methodology/",
      why: "Any claim about how we check things should be one click from the page that says how we check things.",
      status: "live",
    },
    {
      anchor: "BotMatch",
      href: "/botmatch/self-cleaning-litter-boxes/",
      why: "Planned until the catalogue has products. The funnel's first question is the cat-size exclusion, which is the most useful thing it does.",
      status: "planned",
    },
  ],

  /* The cross-link between these two categories matters more than most,
     because they were one category until 6 August 2026 and to a reader they
     still look like one shelf. Somebody who lands on companion robots wanting
     to watch their dog has arrived in the wrong place, and the fastest honest
     fix is a link rather than a paragraph explaining the SERP evidence. */
  "companion-robots": [
    {
      anchor: "pet camera robot",
      href: "/robots/pet-camera-robots/",
      why: "The phrase appears in the hub's own prose where the two categories are distinguished. A reader who used that phrase to get here wants the other page, and this is the shortest route to it.",
      status: "live",
    },
    {
      anchor: "robotic pet for elderly",
      href: "/robots/companion-robots/#who-for",
      why: "The who-it-is-for section is where the three audiences are separated, and eldercare is the one with genuinely different products behind it. First mention should reach the explanation.",
      status: "live",
    },
    {
      anchor: "subscription",
      href: "/robots/companion-robots/#support-risk",
      why: "The support-risk section is the only place on the site that explains what a companion-robot subscription actually gates. Every product page will mention the word; the reasoning belongs in one place.",
      status: "live",
    },
    {
      anchor: "desktop companion robot",
      href: "/robots/companion-robots/#desk-or-floor",
      why: "The desk-or-floor fork is the category's real split and this is the phrase a reader searching for the desk half would use.",
      status: "live",
    },
    {
      anchor: "compare",
      href: "/compare/companion-robots/",
      why: "The comparison table is the honest next step for a reader who has narrowed it to two machines.",
      status: "live",
    },
    {
      anchor: "review methodology",
      href: "/review-methodology/",
      why: "Any claim about how we check things should be one click from the page that says how we check things.",
      status: "live",
    },
    {
      /* Planned rather than live: /botmatch/companion-robots/ is coming_soon
         until the catalogue has products to recommend. The anchor is recorded
         now so it becomes a real link the day the funnel is worth using. */
      anchor: "BotMatch",
      href: "/botmatch/companion-robots/",
      why: "Named in the prose where the reader is told who it is for decides the answer, which is exactly when the tool helps. Planned until there are products behind it.",
      status: "planned",
    },
  ],

  "pet-camera-robots": [
    {
      anchor: "robot pet",
      href: "/robots/companion-robots/",
      why: "The mirror of the companion hub's link to this page. A reader here for company rather than monitoring is one click from the right category instead of reading about wheel diameter.",
      status: "live",
    },
    {
      anchor: "fixed camera",
      href: "/robots/pet-camera-robots/#versus-fixed",
      why: "The comparison every buyer in this category is actually making. The phrase recurs throughout the prose and the reasoning sits in one section.",
      status: "live",
    },
    {
      anchor: "stairs",
      href: "/robots/pet-camera-robots/#your-home",
      why: "The category's one hard exclusion. Any page mentioning stairs should be able to reach the section explaining that none of these climb them.",
      status: "live",
    },
    {
      anchor: "compare",
      href: "/compare/pet-camera-robots/",
      why: "The comparison table is the honest next step once a reader has confirmed the layout works.",
      status: "live",
    },
    {
      anchor: "review methodology",
      href: "/review-methodology/",
      why: "Any claim about how we check things should be one click from the page that says how we check things.",
      status: "live",
    },
    {
      anchor: "BotMatch",
      href: "/botmatch/pet-camera-robots/",
      why: "Planned until the catalogue has products. The funnel's first question is the stairs exclusion, which is the most useful thing it does.",
      status: "planned",
    },
  ],

  "robotic-pool-cleaners": [
    {
      anchor: "waterline",
      href: "/robots/robotic-pool-cleaners/#coverage",
      why: "The hub's coverage section is where floor / wall / waterline are separated as distinct capabilities. This review's central argument depends on that distinction, so the first mention should be able to reach the explanation.",
      status: "live",
    },
    {
      anchor: "cordless",
      href: "/robots/robotic-pool-cleaners/",
      why: "Corded versus cordless is a hub-level decision. The review only says this machine is corded; the reasoning belongs on the hub.",
      status: "live",
    },
    {
      anchor: "above-ground",
      href: "/robots/robotic-pool-cleaners/#pool-type",
      why: "The hub's pool-type section covers above-ground liners and what they need. Natural detour for a reader whose pool is not in-ground.",
      status: "live",
    },
    {
      anchor: "compare",
      href: "/compare/robotic-pool-cleaners/",
      why: "The comparison table is the honest next step for a reader who has decided this model is close but wants to see it beside the others.",
      status: "live",
    },
    {
      anchor: "BotMatch",
      href: "/botmatch/robotic-pool-cleaners/",
      why: "Named in the prose where the reader is being told their pool decides the answer. That is exactly the moment the tool is useful.",
      status: "live",
    },
    {
      anchor: "review methodology",
      href: "/review-methodology/",
      why: "Any claim about how we check things should be one click from the page that says how we check things.",
      status: "live",
    },
    /* ---- Review-to-review. Live from the second review onwards. ----
       These are the ones that earn their place: a reader being told a machine
       is wrong for them is at the exact moment a named alternative helps. The
       linker refuses to point a page at itself, so the same anchor list is
       safe on every review. */
    {
      anchor: "Dolphin Nautilus CC Plus",
      href: "/robots/robotic-pool-cleaners/dolphin-nautilus-cc-plus/",
      why: "The corded mid-range comparison. Named in the Polaris review where the cordless premium is being justified against it.",
      status: "live",
    },
    {
      anchor: "Polaris FREEDOM",
      href: "/robots/robotic-pool-cleaners/polaris-freedom/",
      why: "The cordless answer to the Nautilus's biggest rule-out. A reader told 'this one has a cord' should be one click from the one that does not.",
      status: "live",
    },
    {
      anchor: "iAquaLink",
      href: "/robots/robotic-pool-cleaners/polaris-freedom/",
      why: "The app is only discussed at length on the Freedom review, so a mention elsewhere should reach it.",
      status: "live",
    },
    {
      anchor: "Betta SE Plus",
      href: "/robots/robotic-pool-cleaners/betta-se-plus/",
      why: "The surface skimmer. Every floor-robot review reaches a point where the reader's real complaint turns out to be what is floating on top, and this is where that goes.",
      status: "live",
    },
    {
      anchor: "skimmer",
      href: "/robots/robotic-pool-cleaners/betta-se-plus/",
      why: "The word itself is the distinction most buyers get wrong — a skimmer is not a cleaner. Wherever it appears, it should be one click from the page that explains the difference.",
      status: "live",
    },
    {
      anchor: "Dolphin Proteus DX4 Plus",
      href: "/robots/robotic-pool-cleaners/dolphin-proteus-dx4-plus/",
      why: "The corded machine that does the ledges and steps. Named wherever a reader's pool shape is the deciding factor rather than its length.",
      status: "live",
    },
    {
      anchor: "sun ledge",
      href: "/robots/robotic-pool-cleaners/dolphin-proteus-dx4-plus/",
      why: "Sun ledges and steps are the shapes cheaper robots skip, and the Proteus review is where that is actually discussed.",
      status: "live",
    },
    {
      anchor: "Aiper Scuba S1",
      href: "/robots/robotic-pool-cleaners/aiper-scuba-s1/",
      why: "The mid-range all-rounder, and the page where the 12-inch shallow-ledge claim is actually discussed.",
      status: "live",
    },
    {
      anchor: "Aiper Seagull SE",
      href: "/robots/robotic-pool-cleaners/aiper-seagull-se/",
      why: "The entry point. Named wherever a review tells a small above-ground pool owner they are on the wrong page.",
      status: "live",
    },
    {
      anchor: "Aiper Scuba X1 Pro Max",
      href: "/robots/robotic-pool-cleaners/aiper-scuba-x1-pro-max/",
      why: "The four-surface flagship. Named wherever a review says 'a bigger pool needs a bigger machine' or reaches for the one robot that also skims.",
      status: "live",
    },
    {
      anchor: "Aiper Scuba V3",
      href: "/robots/robotic-pool-cleaners/aiper-scuba-v3-ai-vision/",
      why: "The camera robot. Named wherever debris recognition or seeing-versus-sweeping comes up, which is its actual differentiator.",
      status: "live",
    },
    {
      anchor: "BuBlue Bubot 800P",
      href: "/robots/robotic-pool-cleaners/bublue-bubot-800p/",
      why: "The corded counter-argument in the upper mid-range. Named wherever a review weighs a battery against a cable, or reaches for the corded machine that still does the waterline.",
      status: "live",
    },
    {
      anchor: "WYBOT C1",
      href: "/robots/robotic-pool-cleaners/wybot-c1/",
      why: "The budget wall-climber. Named wherever a review tells a reader the full floor-wall-waterline job can be had for about $500.",
      status: "live",
    },
    {
      anchor: "AquaSense 2 Ultra",
      href: "/robots/robotic-pool-cleaners/beatbot-aquasense-2-ultra/",
      why: "The catalogue's ceiling: five jobs including clarification, and the 3-year full replacement warranty every warranty discussion ends up comparing against.",
      status: "live",
    },

    /* ---- Declared now, linked when the page ships. ----
       A planned anchor renders as plain text, so none of these can 404. The
       wiring is done, and each becomes a real link the day its target exists —
       rather than being remembered, or not, months later. */
    {
      anchor: "best robotic pool cleaner",
      href: "/best-robots/robotic-pool-cleaners/",
      why: "Recorded for when the best-of page carries real picks. Not linked yet — the page exists but has no ranked content behind it.",
      status: "planned",
    },
    {
      anchor: "worth it",
      href: "/guides/are-robotic-pool-cleaners-worth-it/",
      why: "The is-it-worth-it guide owns that query. Planned: the page returns 404 today.",
      status: "planned",
    },
    {
      anchor: "battery",
      href: "/guides/robotic-pool-cleaner-batteries/",
      why: "Every cordless review reaches the same paragraph about cells degrading. That belongs in one guide the reviews point at, not repeated five times. Planned.",
      status: "planned",
    },
    {
      anchor: "filter",
      href: "/guides/robotic-pool-cleaner-filters/",
      why: "Micron ratings, canister capacity and how often you really rinse. Recurs in every review and is explained properly in none of them yet. Planned.",
      status: "planned",
    },
    {
      anchor: "pool size",
      href: "/guides/what-size-robotic-pool-cleaner/",
      why: "The single most common rule-out on this site is pool length. Planned as the page that explains how the ratings are arrived at and how much to trust them.",
      status: "planned",
    },
    {
      anchor: "warranty",
      href: "/guides/robotic-pool-cleaner-warranties/",
      why: "Two reviews so far have hit a manufacturer that will not state a term. Planned as the page that records who publishes what.",
      status: "planned",
    },
  ],
};

export const anchorsFor = (categorySlug: string | undefined): InternalAnchor[] =>
  categorySlug ? (CATEGORY_ANCHORS[categorySlug] ?? []) : [];

/** The ones that would render right now. */
export const liveAnchorsFor = (categorySlug: string | undefined): InternalAnchor[] =>
  anchorsFor(categorySlug).filter((a) => a.status === "live");
