/* ============================================================
   Section 2 content — the decision section — keyed by category.

   Shape is fixed for every category page:
     H2 carrying the section's secondary keyword
     → 60–100 words
     → decision cards

   Only the wording and the pictures change per category. Pool
   types here; lawn sizes, window types or litter-box capacities
   on the pages that follow.

   Pool wording follows the approved Notion research (Page 001,
   "Choose a robotic pool cleaner for your pool type"), which
   assigns this section the inground / above-ground / pool-size
   keyword cluster.
   ============================================================ */

import type { DecisionCard } from "../components/DecisionCards.astro";

export interface DecisionSectionContent {
  /** Anchor id for internal links. */
  id: string;
  /** The H2. */
  title: string;
  /** 60–100 words. */
  intro: string;
  cards: DecisionCard[];
}

export const DECISION_SECTION: Record<string, DecisionSectionContent> = {
  "robotic-pool-cleaners": {
    id: "pool-type",
    title: "Choose a robotic pool cleaner for your pool type",

    /* 72 words. Carries "inground robotic pool cleaner" (1,300),
       "above ground pool robot" (320) and "vinyl liner" naturally. */
    intro:
      "Pool robots are not interchangeable. The right one depends on how your pool is " +
      "built, how long it is and what shape it takes. An inground robotic pool cleaner " +
      "has to handle deeper water, wall climbing and a waterline; an above ground pool " +
      "robot usually only needs a clean floor and a gentler touch on a vinyl liner. Get " +
      "this wrong and you buy a machine that cannot reach half your pool.",

    cards: [
      {
        title: "In-ground pools",
        bestFor: "Deeper water, walls and a visible waterline.",
        points: [
          "Check the stated maximum pool length covers your longest run, not just your average.",
          "Wall and waterline cleaning is a separate capability from floor cleaning — confirm it per model.",
          "Deep ends, steps and benches change how well a robot navigates.",
        ],
      },
      {
        title: "Above-ground pools",
        bestFor: "Flat floors and liners that need a gentler touch.",
        points: [
          "Floor-only cleaning is often genuinely enough, and costs less.",
          "Look for brushes and tracks rated as safe for a vinyl liner.",
          "A lighter machine is easier to lift out on your own.",
        ],
      },
      {
        title: "Small, large and freeform pools",
        bestFor: "Unusual shapes, long spans and tight corners.",
        points: [
          "Maximum pool length matters more than any size label on the box.",
          "Curves and corners depend on navigation, not raw suction.",
          "Retrieval gets harder as weight goes up — check it before you buy.",
        ],
      },
    ],
  },
};

export function decisionSectionFor(slug: string | undefined): DecisionSectionContent | undefined {
  return slug ? DECISION_SECTION[slug] : undefined;
}
