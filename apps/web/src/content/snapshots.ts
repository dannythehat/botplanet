/* ============================================================
   The BotMatch snapshot — one per product.

   WHAT IT IS. The plain-language summary a reader wants before
   they read 2,000 words: what tier this sits in, what it costs to
   run, how fast it arrives, and the three or four things that
   actually decide whether it suits them. It is the same shape as
   the summary BotMatch emails after a match, written for one
   product instead of one person.

   WHY THE DATA LIVES HERE AND NOT IN THE PROSE. Every line is a
   claim. Kept as fields it can be checked against the evidence
   record and the specification table; buried in a paragraph it
   cannot. A value we do not hold is null, and the panel prints
   "Not disclosed" rather than guessing.

   WHAT IT MUST NEVER CARRY. A price. Prices come from the offer
   engine with the date they were checked; a number typed here
   would be stale the week after it was typed. `priceBand` is a
   tier, not a figure, and tiers do not go out of date.
   ============================================================ */

export type PriceBand = "entry" | "mid" | "upper_mid" | "premium";

export const PRICE_BAND_LABEL: Record<PriceBand, string> = {
  entry: "Entry level",
  mid: "Mid range",
  upper_mid: "Upper mid range",
  premium: "Premium",
};

/** Where the band sits on the scale drawn in the panel. */
export const PRICE_BAND_STEP: Record<PriceBand, number> = {
  entry: 1,
  mid: 2,
  upper_mid: 3,
  premium: 4,
};

export interface SnapshotPoint {
  label: string;
  /** null prints "Not disclosed" rather than an invented value. */
  value: string | null;
  /** One short line of context. Optional — most points do not need one. */
  note?: string;
}

export interface ProductSnapshot {
  slug: string;
  priceBand: PriceBand;
  /** Why it sits in that band, in one line. */
  priceBandWhy: string;
  /**
   * Delivery, described by route rather than promised as a date. "Fast" here
   * means a Prime-eligible Amazon listing; we do not control fulfilment and
   * will not print a date we cannot stand behind.
   */
  shipping: string;
  shippingSpeed: "fast" | "standard" | "varies";
  /** The three or four things that decide suitability. */
  points: SnapshotPoint[];
  /** The single sentence that rules it in. */
  suitsYouIf: string;
  /** The single sentence that rules it out. Never omitted. */
  ruleOutIf: string;
}

export const SNAPSHOTS: Record<string, ProductSnapshot> = {
  "dolphin-nautilus-cc-plus": {
    slug: "dolphin-nautilus-cc-plus",
    priceBand: "mid",
    priceBandWhy:
      "Sits below the cordless and mapping models and above the floor-only machines. You are paying for wall climbing and a well-supported app, not for navigation intelligence.",
    shipping: "Prime-eligible on Amazon, so usually a day or two rather than a week.",
    shippingSpeed: "fast",
    points: [
      {
        label: "Cleans",
        value: "Floor and walls",
        note: "Not the waterline — Maytronics' own specification lists waterline scrubbing as No.",
      },
      {
        label: "Power",
        value: "Corded mains",
        note: "No battery to charge or replace, and no runtime limit on a cycle.",
      },
      {
        label: "Biggest pool it is rated for",
        value: "40 ft / 12 m",
        note: "A hard limit, not a guideline. Longer pools need a different machine.",
      },
      {
        label: "Filter",
        value: "Top-load baskets",
        note: "Lift out from above, which is the difference between rinsing it and avoiding it.",
      },
      {
        label: "Brushes",
        value: "Two, passive",
        note: "They work as the robot moves rather than being driven. Settled silt is where that shows.",
      },
      {
        label: "Weight",
        value: null,
        note: "Not published by Maytronics for this SKU.",
      },
    ],
    suitsYouIf:
      "You have an in-ground pool up to 40 ft, you want floor and wall cleaning on a schedule, and you would rather never think about charging.",
    ruleOutIf:
      "The waterline ring is your actual complaint, your pool runs longer than 40 ft, or you want a cordless machine you can drop in anywhere.",
  },
};

export const snapshotFor = (slug: string | undefined): ProductSnapshot | undefined =>
  slug ? SNAPSHOTS[slug] : undefined;
