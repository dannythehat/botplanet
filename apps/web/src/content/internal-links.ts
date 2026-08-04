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
export const CATEGORY_ANCHORS: Record<string, InternalAnchor[]> = {
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
