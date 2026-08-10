/**
 * Which five specifications a category's reader decides on.
 *
 * WHAT THIS FILE IS NOT. It is not a second source of facts. Every value the
 * glance box prints is lifted out of that review's own `specGroups` — the
 * figures already transcribed from the manufacturer and already published
 * lower down the same page in the full table. Nothing here can introduce a
 * number, and nothing here can contradict one, because there is only ever one
 * copy of each figure and it lives in content/reviews.ts.
 *
 * WHY A PROJECTION RATHER THAN A NEW FIELD ON EVERY REVIEW. Forty reviews were
 * written before this box existed. Asking each to nominate its own glance rows
 * would mean forty edits, forty chances to paraphrase a value while copying it,
 * and a fortyfirst review that quietly ships without one. A projection cannot
 * drift from its source because it has no source of its own.
 *
 * MATCHING IS BY LABEL, WITH ALIASES, BECAUSE THE REVIEWS DISAGREE. The same
 * fact is called "Max pool length" on the Nautilus, "Max pool size" on the
 * Bubot and "Coverage" on the WYBOT — the reviews follow whatever each
 * manufacturer publishes, which is right for the full table and useless for a
 * grid. Each slot below therefore lists every label that means the same thing,
 * in preference order, and takes the first one that has a value.
 *
 * A SLOT THAT FINDS NOTHING IS DROPPED, not printed empty. This differs from
 * SpecTable, which prints "Not disclosed by the manufacturer" and is right to:
 * that table is the complete record and a silence in it is information. A
 * glance box of five "not disclosed" rows is not information, it is furniture.
 * The box says how many of its fields the maker publishes and sends the reader
 * to the full table for the rest — see components/SpecGlance.astro.
 */

export interface GlanceField {
  /** What the box calls it — one phrase per category, whatever the review calls it. */
  label: string;
  /**
   * Labels in content/reviews.ts that carry this fact, in preference order.
   * Compared case-insensitively after trimming. First match with a value wins.
   */
  match: string[];
}

/**
 * Chosen by counting what is ACTUALLY FILLED across each category's reviews,
 * not by deciding what ought to matter. A slot that is empty on nine of eleven
 * machines teaches a reader nothing and makes the box look broken; the counts
 * behind each list are in the commit that added this file.
 */
export const GLANCE_FIELDS: Record<string, GlanceField[]> = {
  /* Power type and installation are filled on all eleven; surfaces and
     navigation on ten. Pool size is the fourth question every reader asks and
     the one the manufacturers name four different ways. */
  /* Grill, added with the category's first product on 10 August 2026. Grillbot
     publishes a thin sheet — the four fields below are what it actually states,
     and the box needs three filled rows to show at all, so a maker who
     publishes less than this gets no box rather than a padded one. */
  "grill-cleaning-robots": [
    { label: "Brush heads", match: ["Heads supplied", "Brush heads"] },
    { label: "Grill temperature", match: ["Grill temperature"] },
    { label: "Timer", match: ["Timer"] },
    { label: "Warranty", match: ["Warranty"] },
    { label: "Power", match: ["Power"] },
  ],

  /* Robot vacuums, added with the category's first eleven products on 10
     August 2026. Every slot here is a CAPABILITY rather than a measurement,
     which is the opposite of every other category on this site — and it is
     deliberate. Suction is the number every listing leads with and it does not
     discriminate above a modest threshold: 8,000 Pa and 30,000 Pa machines sit
     next to each other in this set at the same price. Whether the mop lifts
     off carpet, whether it empties itself and whether it can see a cable are
     what actually separate them, so those lead and the Pascal figure comes
     last. */
  "robot-vacuums": [
    { label: "Mops", match: ["Mops"] },
    { label: "Mop lifting", match: ["Mop lifting"] },
    { label: "Self-emptying", match: ["Self-emptying"] },
    { label: "Obstacle avoidance", match: ["Obstacle avoidance"] },
    { label: "Deep or shag pile", match: ["Deep or shag pile"] },
    { label: "Suction", match: ["Suction"] },
  ],

  /* Self-cleaning litter boxes, added with the category's first four reviews on
     10 August 2026. CAT WEIGHT LEADS because it is the category's only genuine
     safety question — a kitten under the sensor's threshold may not register at
     all — and because reading the four ranges side by side is what tells a
     reader with a Maine Coon or a kitten that this is not a field of
     interchangeable machines. Entry size is second for the same reason and is
     the figure two of the four makers do not publish, which is itself worth
     seeing. Litter is third: it is the running cost you are locked into for the
     life of the box, and it is the only slot where one of the four answers
     differently from the rest. */
  "self-cleaning-litter-boxes": [
    { label: "Cat weight", match: ["Cat weight"] },
    { label: "Entry", match: ["Entry size"] },
    { label: "Litter", match: ["Litter"] },
    { label: "Hands off for", match: ["Waste interval"] },
    { label: "App", match: ["App"] },
    { label: "Warranty", match: ["Warranty"] },
  ],

  "robotic-pool-cleaners": [
    { label: "Power", match: ["Power type"] },
    { label: "Cleans", match: ["Surfaces"] },
    {
      label: "Rated for",
      match: ["Max pool length", "Max pool size", "Max pool", "Coverage"],
    },
    {
      label: "Runtime",
      match: ["Runtime", "Runtime — floor and walls", "Runtime — floor only", "Cycle length"],
    },
    { label: "Navigation", match: ["Navigation"] },
  ],

  /* Glass type rules machines out before any other specification — a robot
     that navigates by feeling for a frame drives off the edge of frameless
     glass — so it leads. Power-off hold is thin (three of eleven) and kept
     anyway: when it IS published it is the answer to "what happens in a power
     cut", and its absence on the other eight is itself worth seeing. */
  "window-cleaning-robots": [
    { label: "Glass types", match: ["Glass types"] },
    { label: "Suction", match: ["Maximum suction", "Maximum", "Moving suction", "Moving", "Suction while moving"] },
    { label: "Power-off hold", match: ["Power-off hold"] },
    { label: "Navigation", match: ["Navigation"] },
    { label: "Water tank", match: ["Water tank", "Water tanks", "Tank", "Tank capacity"] },
  ],

  /* This category's buyer is choosing a thing to live with rather than a tool
     to do a job, so size, how long it stays awake and whether it wants money
     every month are the decisions. Subscription is filled on five of nine and
     is the one that catches people out. */
  "companion-robots": [
    { label: "Size", match: ["Size", "Dimensions"] },
    { label: "Weight", match: ["Weight"] },
    { label: "Runtime", match: ["Runtime", "Play time", "Continuous playtime"] },
    { label: "Charge time", match: ["Charge time"] },
    /* "Monthly" is Vector's subscription price under a different heading — the
       same fact a reader is checking for, so it answers the same slot. */
    { label: "Subscription", match: ["Subscription", "Monthly", "Ongoing cost"] },
  ],

  /* The maker's own age rating leads because it is the single thing a parent
     filters on, and because it is the maker's claim rather than ours. */
  "educational-coding-robots": [
    { label: "Age (maker's rating)", match: ["Manufacturer rating", "Age range"] },
    /* "Teaches" and "What it teaches" are the same fact as "Coding" — what a
       child actually does with it — written to suit each product's own sheet. */
    { label: "Teaches", match: ["Coding", "Teaches", "What it teaches", "Lessons"] },
    /* Whether a child BUILDS it is the defining split in this category — the
       mBot arrives as parts and the Sphero arrives as a ball — and both makers
       publish it, under their own headings. */
    { label: "Build", match: ["Assembly", "Build", "Kit"] },
    { label: "Battery", match: ["Battery"] },
    { label: "Play time", match: ["Play time", "Play", "Runtime"] },
    { label: "Weight", match: ["Weight"] },
  ],

  /* All eight of these are filled on all three reviews, which is what happens
     when one manufacturer publishes a consistent sheet. Stairs is in because
     a driving camera that cannot climb is a one-floor product and nobody says
     so on the box. */
  "pet-camera-robots": [
    { label: "Resolution", match: ["Resolution"] },
    { label: "Night vision", match: ["Night vision"] },
    { label: "Two-way talk", match: ["Two-way talk"] },
    { label: "Stairs", match: ["Stairs"] },
    { label: "Subscription", match: ["Subscription"] },
  ],
};

export function glanceFieldsFor(categorySlug: string): GlanceField[] {
  return GLANCE_FIELDS[categorySlug] ?? [];
}
