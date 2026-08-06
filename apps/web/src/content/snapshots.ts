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
  /**
   * The same rule-outs, structured.
   *
   * WHY BOTH. `ruleOutIf` is the sentence a reader reads. These are the same
   * reasons expressed as tests a machine can run against the catalogue, so the
   * page can answer "then what should I buy?" from data rather than from an
   * editor's memory of the range. A reason with no qualifying product says so
   * — it never quietly promotes the nearest thing.
   */
  ruleOuts?: RuleOut[];
}

/** A reason to rule this machine out, and what would answer it instead. */
export interface RuleOut {
  /** Printed to the reader. */
  need: string;
  /** How a replacement is found in the catalogue. */
  test:
    | { kind: "cleans"; value: string }
    | { kind: "maxLengthOver"; feet: number }
    | { kind: "power"; value: string };
}

/* @extension-point per-product | optional | No price history and no rule-outs
   for the product. The page still renders; it just cannot say whether today's
   price is good, which is most of why somebody reads a comparison site. */
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
    ruleOuts: [
      { need: "You need the waterline scrubbed", test: { kind: "cleans", value: "waterline" } },
      { need: "Your pool runs longer than 40 ft", test: { kind: "maxLengthOver", feet: 40 } },
      { need: "You want a cordless machine", test: { kind: "power", value: "cordless" } },
    ],
  },

  "polaris-freedom": {
    slug: "polaris-freedom",
    priceBand: "premium",
    priceBandWhy:
      "The top of this category. You are paying for the battery and the dock, not for extra cleaning ability — a corded machine covers the same surfaces for considerably less.",
    shipping: "Prime-eligible on Amazon, so usually a day or two rather than a week.",
    shippingSpeed: "fast",
    points: [
      {
        label: "Cleans",
        value: "Floor, walls and waterline",
        note: "A dedicated waterline-only mode, which most floor-and-wall machines do not have at all.",
      },
      {
        label: "Power",
        value: "Cordless, 9.6 Ah lithium-ion",
        note: "Nothing in the water to tangle. The battery is a wear part — budget for replacing it.",
      },
      {
        label: "Biggest pool it is rated for",
        value: "50 ft",
        note: "Polaris states this only in its marketing panels. The manual and support page give depth and no length.",
      },
      {
        label: "Runtime",
        value: "2 h 30",
        note: "Floor and walls. Floor only is 1 h 30. Recharges in four hours on the dock.",
      },
      {
        label: "Filter",
        value: "4 L canister",
        note: "Large for the class. No micron rating is published by Polaris.",
      },
      {
        label: "Warranty",
        value: null,
        note: "Polaris does not state a term in the manual, on the support page or in the A+ panels.",
      },
    ],
    suitsYouIf:
      "You have an in-ground pool up to about 50 ft, the cable is the thing you actually hate, and you want the waterline handled as well as the floor.",
    ruleOutIf:
      "Your pool is above ground, it is deeper than 13 ft, or you would rather not own a machine with a part that wears out on a calendar.",
    ruleOuts: [
      { need: "Your pool is above ground", test: { kind: "cleans", value: "floor" } },
      { need: "You would rather have mains power than a battery", test: { kind: "power", value: "corded" } },
    ],
  },

  "betta-se-plus": {
    slug: "betta-se-plus",
    priceBand: "entry",
    priceBandWhy:
      "The cheapest machine we cover, and it is not competing with the others. A skimmer and a floor robot do different jobs, so this is an addition to a setup rather than an alternative to one.",
    shipping: "Prime-eligible on Amazon, so usually a day or two rather than a week.",
    shippingSpeed: "fast",
    points: [
      {
        label: "Cleans",
        value: "The surface only",
        note: "Leaves, pollen, insects, pet hair. Never the floor, the walls or the waterline — Betta says so itself.",
      },
      {
        label: "Power",
        value: "Solar, with a mains adapter",
        note: "5 to 6 hours in sun, 3.5 on the adapter. In a sunny month it tops itself up while it works.",
      },
      {
        label: "Runtime",
        value: "30+ hours continuous",
        note: "Not a misprint. A small motor moving a floating hull is a different problem from climbing a wall.",
      },
      {
        label: "Biggest pool it is rated for",
        value: "40 × 60 ft",
        note: "About 2,400 sq ft, from Betta's own product page.",
      },
      {
        label: "Filter",
        value: "200 micron basket",
        note: "One of the few machines here whose maker publishes a micron rating at all.",
      },
      {
        label: "Warranty",
        value: "1 year",
        note: "Stated on the product page and again in the manual.",
      },
    ],
    suitsYouIf:
      "Your pool sits under trees and the surface is the thing that always looks dirty — especially if you already have a floor robot doing the bottom.",
    ruleOutIf:
      "You want the floor or the waterline cleaned, your pool is bigger than about 40 by 60 ft, or it sits in permanent shade.",
    ruleOuts: [
      { need: "You need the floor cleaned", test: { kind: "cleans", value: "floor" } },
      { need: "You need the waterline scrubbed", test: { kind: "cleans", value: "waterline" } },
    ],
  },

  "dolphin-proteus-dx4-plus": {
    slug: "dolphin-proteus-dx4-plus",
    priceBand: "upper_mid",
    priceBandWhy:
      "Above the entry Dolphins and below the app-and-mapping models. You are paying for wall climbing, ledges and a top-load filter from the most established brand in the category.",
    shipping: "Prime-eligible on Amazon, so usually a day or two rather than a week.",
    shippingSpeed: "fast",
    points: [
      {
        label: "Cleans",
        value: "Floor, walls, steps and sun ledges",
        note: "The waterline is claimed on Maytronics' listing but no technical sheet has been found to corroborate it.",
      },
      {
        label: "Power",
        value: "Corded mains",
        note: "No battery to charge or replace, and no runtime limit on a cycle.",
      },
      {
        label: "Biggest pool it is rated for",
        value: "33 ft",
        note: "Shorter than people assume. The plain Proteus DX4 is rated to 50 ft and shares the same product page.",
      },
      {
        label: "Filter",
        value: "Top-load cartridge",
        note: "Lift the lid at the poolside rather than turning a wet machine over. No micron rating is published.",
      },
      {
        label: "Weight",
        value: "18.5 lb dry",
        note: "A two-handed lift, and heavier coming out than going in.",
      },
      {
        label: "Warranty",
        value: null,
        note: "No term is stated on the listing, and no Maytronics page for this model has been found.",
      },
    ],
    suitsYouIf:
      "You have an in-ground pool under 33 ft with steps or a sun ledge, and you want every surface handled by one corded machine.",
    ruleOutIf:
      "Your pool runs longer than 33 ft, it is above ground, or the waterline is the single reason you are buying.",
    ruleOuts: [
      { need: "Your pool runs longer than 33 ft", test: { kind: "maxLengthOver", feet: 33 } },
      { need: "You want a cordless machine", test: { kind: "power", value: "cordless" } },
    ],
  },

  "aiper-scuba-v3-ai-vision": {
    slug: "aiper-scuba-v3-ai-vision",
    priceBand: "upper_mid",
    priceBandWhy:
      "The same money as a corded Dolphin that does not touch the waterline, buying a camera, cordless freedom and the finest published filter rating we list. The mapping flagships sit above it.",
    shipping: "Prime-eligible on Amazon, so usually a day or two rather than a week.",
    shippingSpeed: "fast",
    points: [
      {
        label: "Cleans",
        value: "Floor, walls and waterline",
        note: "4,800 GPH through dual brushes, per Aiper. Waterline coverage at this price is uncommon.",
      },
      {
        label: "Navigation",
        value: "Camera — it looks at the pool",
        note: "2 m detection range, twenty-plus debris types recognised, night lights. Aiper's design figures.",
      },
      {
        label: "Power",
        value: "Cordless, wireless dock",
        note: "One charge runs AI Navium's weekly plan — short cleans spread over 7 days, not 168 hours of runtime.",
      },
      {
        label: "Filter",
        value: "3 μm + 180 μm layers",
        note: "The finest published rating in our catalogue. Manufacturer's figure, not a lab result.",
      },
      {
        label: "Weight",
        value: "18.1 lb",
        note: "The lightest full cleaner we list, and it parks at the waterline for lifting.",
      },
      {
        label: "Warranty",
        value: null,
        note: "Aiper has a warranty process; no stated term for this machine was found.",
      },
    ],
    suitsYouIf:
      "Your in-ground pool collects real debris and you want the robot to see it and go to it, with the lightest daily routine here.",
    ruleOutIf:
      "Your pool is above ground, you want a stated maximum pool length or warranty term, or you would rather not have a camera in the water.",
    ruleOuts: [
      { need: "You would rather have mains power than a battery", test: { kind: "power", value: "corded" } },
      { need: "You want a machine with a stated length rating for a big pool", test: { kind: "maxLengthOver", feet: 50 } },
    ],
  },

  "aiper-scuba-x1-pro-max": {
    slug: "aiper-scuba-x1-pro-max",
    priceBand: "premium",
    priceBandWhy:
      "The top of the catalogue, and the only machine in it doing four jobs. The premium over Aiper's own camera robot is mostly the surface skimming, the mapping and the 3-year warranty.",
    shipping: "Prime-eligible on Amazon, so usually a day or two rather than a week.",
    shippingSpeed: "fast",
    points: [
      {
        label: "Cleans",
        value: "Surface, waterline, walls and floor",
        note: "The only machine we cover that claims all four — it is sold as a vacuum and a skimmer in one.",
      },
      {
        label: "Suction",
        value: "8,500 GPH",
        note: "Aiper's pump rating, the largest claim in our catalogue, on nine brushless motors.",
      },
      {
        label: "Navigation",
        value: "OmniSense+ 2.0 ultrasonic mapping",
        note: "Maps the pool and plans coverage. The camera trick belongs to the cheaper Scuba V3.",
      },
      {
        label: "Runtime",
        value: "Up to 12 h skimming / 5.5 h floor",
        note: "The longest-legged machine we list, by Amazon's own mode descriptions.",
      },
      {
        label: "Filter",
        value: "3 μm + 180 μm, 5 L basket",
        note: "The catalogue's finest published rating, in its biggest stated basket.",
      },
      {
        label: "Warranty",
        value: "3 years",
        note: "Stated on Aiper's page — the longest published term of anything we cover.",
      },
    ],
    suitsYouIf:
      "You have a large in-ground pool and want one machine doing the skimmer's job and the cleaner's, with the longest warranty on offer.",
    ruleOutIf:
      "Your budget is under four figures, your pool already has surface skimming you like, or it is above ground.",
    ruleOuts: [
      { need: "You would rather have mains power than a battery", test: { kind: "power", value: "corded" } },
      { need: "You only need the surface skimmed, not the whole pool", test: { kind: "cleans", value: "water_surface" } },
    ],
  },

  "aiper-seagull-se": {
    slug: "aiper-seagull-se",
    priceBand: "entry",
    priceBandWhy:
      "The cheapest machine in the catalogue — a tenth of the flagships. You are paying for a motor, a battery and ninety minutes of floor coverage, and nothing else is pretended.",
    shipping: "Prime-eligible on Amazon, so usually a day or two rather than a week.",
    shippingSpeed: "fast",
    points: [
      {
        label: "Cleans",
        value: "Floor only",
        note: "No walls, no waterline. In a soft-sided above-ground pool the floor is the whole job.",
      },
      {
        label: "Power",
        value: "Cordless battery",
        note: "90 minutes of runtime per Aiper; roughly a 2.5-hour recharge per the listing.",
      },
      {
        label: "Pool type",
        value: "Above-ground, to about 33 ft",
        note: "The ceiling is our research — Aiper publishes no maximum size at all.",
      },
      {
        label: "Navigation",
        value: "Random path, self-parking",
        note: "Parks against the pool wall at the end of a cycle; a hook ships in the box.",
      },
      {
        label: "Filter",
        value: null,
        note: "Aiper publishes no filter description or micron rating for this machine.",
      },
      {
        label: "Warranty",
        value: null,
        note: "No term stated on Aiper's product page.",
      },
    ],
    suitsYouIf:
      "You have a small, flat-bottomed above-ground pool and want the floor handled for the price of a good pool net with a motor.",
    ruleOutIf:
      "Your pool is in-ground with real walls, the waterline ring is your complaint, or you want an app, a schedule or a map.",
    ruleOuts: [
      { need: "You need the walls climbed", test: { kind: "cleans", value: "walls" } },
      { need: "You need the waterline scrubbed", test: { kind: "cleans", value: "waterline" } },
    ],
  },

  "aiper-scuba-s1": {
    slug: "aiper-scuba-s1",
    priceBand: "mid",
    priceBandWhy:
      "The middle of Aiper's range and of ours: flagship filtration and four-zone coverage without the camera of the V3 or the skimming of the X1 Pro Max.",
    shipping: "Sold direct by Aiper; Amazon availability is currently unreliable — see the review.",
    shippingSpeed: "varies",
    points: [
      {
        label: "Cleans",
        value: "Floor, walls, waterline and shallow areas",
        note: "Aiper's own four-zone claim, including ledges in as little as 12 inches of water.",
      },
      {
        label: "Power",
        value: "Cordless, wall charger",
        note: "150 or 180 minutes — both figures are Aiper's, on one page. Charging is 3 to 4 hours.",
      },
      {
        label: "Biggest pool it is rated for",
        value: "50 ft / 1,600 sq ft",
        note: "Aiper's stated ceiling.",
      },
      {
        label: "Filter",
        value: "3 μm + 180 μm, 3.5 L basket",
        note: "The catalogue's finest published rating, on its cheapest machine.",
      },
      {
        label: "Modes",
        value: "Five, plus a weekly plan",
        note: "Schedule, wall, floor, auto and eco from the app, with OTA updates.",
      },
      {
        label: "Warranty",
        value: null,
        note: "No term stated on Aiper's product page.",
      },
    ],
    suitsYouIf:
      "You have an in-ground pool up to 50 ft — especially one with a tanning ledge or shallow steps — and want every wet surface handled at a mid-range price.",
    ruleOutIf:
      "Your pool runs longer than 50 ft, you want the surface skimmed, or you want a camera choosing where to clean.",
    ruleOuts: [
      { need: "Your pool runs longer than 50 ft", test: { kind: "maxLengthOver", feet: 50 } },
      { need: "You want the water surface skimmed too", test: { kind: "cleans", value: "water_surface" } },
    ],
  },

  "bublue-bubot-800p": {
    slug: "bublue-bubot-800p",
    priceBand: "upper_mid",
    priceBandWhy:
      "About $800 — level with the camera-equipped Scuba V3 and well under the flagships. What the money buys here is corded certainty and published figures, not a battery or a camera.",
    shipping: "Prime-eligible on Amazon, so usually a day or two rather than a week.",
    shippingSpeed: "fast",
    points: [
      {
        label: "Cleans",
        value: "Floor, walls, waterline, plus steps and platforms",
        note: "The shallow-area claim is sensor avoidance, not cleaning — see the review.",
      },
      {
        label: "Power",
        value: "Corded mains",
        note: "Unlimited runtime, nothing to charge, nothing to age. The cable is about 50 ft by our research — neither source states it.",
      },
      {
        label: "Biggest pool it is rated for",
        value: "1,076 sq ft",
        note: "An area rating only. BuBlue publishes no length figure, and a cord length is not one.",
      },
      {
        label: "Suction",
        value: "3,566 GPH, 150 W motor",
        note: "BuBlue's own figures — four roller brushes and two suction ports behind them.",
      },
      {
        label: "Filter",
        value: "180 μm, 2 × 3 L baskets",
        note: "Six litres of basket in total, per BuBlue's page.",
      },
      {
        label: "Warranty",
        value: "1 year",
        note: "Stated by BuBlue, with 30-day money-back and 24/7 support. The brand is young; the term is real.",
      },
    ],
    suitsYouIf:
      "Your pool is within about 1,076 sq ft and cable reach, and you want every wet surface handled with nothing to charge, from a brand that publishes its numbers.",
    ruleOutIf:
      "Your pool is much larger, you hate cables on principle, you want the surface skimmed, or you want a long-established brand behind the warranty.",
    ruleOuts: [
      { need: "You would rather have no cable at all", test: { kind: "power", value: "cordless" } },
      { need: "You want the water surface skimmed too", test: { kind: "cleans", value: "water_surface" } },
    ],
  },

  "wybot-c1": {
    slug: "wybot-c1",
    priceBand: "mid",
    priceBandWhy:
      "About $500 from WYBOT's own store — double the Seagull SE, well under the $850 class, for a feature list much closer to the latter: walls, waterline, app scheduling and a stated 2-year warranty.",
    shipping: "Prime-eligible on Amazon, so usually a day or two rather than a week.",
    shippingSpeed: "fast",
    points: [
      {
        label: "Cleans",
        value: "Floor, walls, waterline, steps and slopes",
        note: "WYBOT's own coverage list — the full set short of the water surface.",
      },
      {
        label: "Power",
        value: "Cordless, wall charger",
        note: "Up to 150 minutes per WYBOT; 3 hours to charge from its own table.",
      },
      {
        label: "Biggest pool it is rated for",
        value: "1,615 sq ft",
        note: "Above-ground and in-ground, all pool shapes — WYBOT's classification.",
      },
      {
        label: "Scheduling",
        value: "Up to 4 cleans a week from one charge",
        note: "The cycle timer is the standout feature at this price.",
      },
      {
        label: "Filter",
        value: "180 μm ultra-fine",
        note: "One stated fineness — no second, finer layer like Aiper's 3 μm.",
      },
      {
        label: "Warranty",
        value: "2 years",
        note: "Stated by WYBOT, with a 30-day return beside it — longer than several pricier brands manage.",
      },
    ],
    suitsYouIf:
      "Your pool fits inside 1,615 sq ft — above-ground or in-ground — and you want walls, waterline and a weekly schedule handled for about $500.",
    ruleOutIf:
      "Your pool is larger, you want ultra-fine filtration or a camera, or you want the water surface skimmed.",
    ruleOuts: [
      { need: "You want the water surface skimmed too", test: { kind: "cleans", value: "water_surface" } },
      { need: "You would rather have mains power than a battery", test: { kind: "power", value: "corded" } },
    ],
  },

  "beatbot-aquasense-2-ultra": {
    slug: "beatbot-aquasense-2-ultra",
    priceBand: "premium",
    priceBandWhy:
      "$2,299 from Beatbot's own store — the most expensive machine we cover. The premium buys the only five-job set in the catalogue and a 3-year full replacement warranty nothing else matches.",
    shipping: "Sold on Amazon and direct from Beatbot's own store.",
    shippingSpeed: "varies",
    points: [
      {
        label: "Cleans",
        value: "Floor, walls, waterline, water surface — plus clarification",
        note: "Beatbot's 5-in-1. The clarifier doses the water as it drives; refills are a consumable.",
      },
      {
        label: "Power",
        value: "Cordless, wireless dock",
        note: "13,400 mAh — up to 10 h skimming, 5 h floors, 5 h walls and waterline; 4.5 h to charge.",
      },
      {
        label: "Biggest pool it is rated for",
        value: "3,875 sq ft",
        note: "Beatbot's lab-tested figure for floor cleaning in one full cycle.",
      },
      {
        label: "Navigation",
        value: "Camera + sensor pool mapping",
        note: "HybridSense fusion with CleverNav path planning; inlets, drains and ladders read as obstacles.",
      },
      {
        label: "Filter",
        value: "Two-stage, down to 150 μm",
        note: "Beatbot's stated fineness.",
      },
      {
        label: "Warranty",
        value: "3-year full replacement",
        note: "Beatbot calls it the industry's first. The strongest term in our catalogue.",
      },
    ],
    suitsYouIf:
      "Your in-ground pool is large and complicated — sunk debris, walls, a waterline ring, floating leaves and summer cloudiness — and you want one machine for all of it with the longest warranty in the class.",
    ruleOutIf:
      "Your pool is modest or above-ground, you want skimming without flagship money, or a mid-range machine already covers your actual problems.",
    ruleOuts: [
      { need: "You would rather have mains power than a battery", test: { kind: "power", value: "corded" } },
      { need: "You only need the surface skimmed, not the whole pool", test: { kind: "cleans", value: "water_surface" } },
    ],
  },
};

export const snapshotFor = (slug: string | undefined): ProductSnapshot | undefined =>
  slug ? SNAPSHOTS[slug] : undefined;
