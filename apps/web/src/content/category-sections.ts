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
import type { CoverageRow } from "../components/CoverageRows.astro";
import type { SplitPanel } from "../components/DecisionSplit.astro";
import type { MatrixRow } from "../components/MatrixTable.astro";
import type { CheckItem } from "../components/CheckList.astro";
import type { HeroImage } from "../components/CategoryHero.astro";

export interface DecisionSectionContent {
  /** Anchor id for internal links. */
  id: string;
  /** Short label above the H2. */
  eyebrow?: string;
  /** The H2. */
  title: string;
  /** 60–100 words. */
  intro: string;
  cards: DecisionCard[];
}

export const DECISION_SECTION: Record<string, DecisionSectionContent> = {
  "robotic-pool-cleaners": {
    id: "pool-type",
    eyebrow: "Pool type",
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
        image: {
          src: "/media/pool/pool-type-inground.webp",
          alt:
            "A rectangular in-ground swimming pool with blue tiled walls and a stainless " +
            "steel handrail, set into a stone patio beside a house.",
        },
        points: [
          "Check the stated maximum pool length covers your longest run, not just your average.",
          "Wall and waterline cleaning is a separate capability from floor cleaning — confirm it per model.",
          "Deep ends, steps and benches change how well a robot navigates.",
        ],
      },
      {
        title: "Above-ground pools",
        bestFor: "Flat floors and liners that need a gentler touch.",
        image: {
          src: "/media/pool/pool-type-above-ground.webp",
          alt:
            "A round above-ground swimming pool with grey panelled walls, edged with pebbles " +
            "and lawn, next to a raised timber deck.",
        },
        points: [
          "Floor-only cleaning is often genuinely enough, and costs less.",
          "Look for brushes and tracks rated as safe for a vinyl liner.",
          "A lighter machine is easier to lift out on your own.",
        ],
      },
      {
        title: "Small, large and freeform pools",
        bestFor: "Unusual shapes, long spans and tight corners.",
        image: {
          src: "/media/pool/pool-type-freeform.webp",
          alt:
            "Two freeform pools side by side: a small kidney-shaped pool on a stone patio, " +
            "and a large curved lagoon pool with rock edging and waterfalls.",
        },
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

/* ============================================================
   Section 3 — coverage. What does the machine actually clean?

   Pool wording follows the approved Notion research ("Floor,
   walls, waterline or surface: what should the robot clean?"),
   which assigns this section the wall-climbing cluster.

   The image slot is for the approved four-zone cutaway (floor,
   walls, waterline, surface). The rows read as finished without
   it, so the section is not blocked waiting on artwork.
   ============================================================ */

export interface CoverageSectionContent {
  id: string;
  eyebrow?: string;
  title: string;
  intro: string;
  image?: HeroImage;
  rows: CoverageRow[];
}

export const COVERAGE_SECTION: Record<string, CoverageSectionContent> = {
  "robotic-pool-cleaners": {
    id: "coverage",
    eyebrow: "Cleaning coverage",
    title: "Floor, walls, waterline or surface: what should the robot clean?",

    /* 75 words. Carries "wall climbing robotic pool cleaner" (30) plus the
       floor and waterline terminology this section owns. */
    intro:
      "Not every pool robot cleans the same surfaces. Some only handle the floor. Others " +
      "climb the walls and scrub the waterline, where the tile line grows a greasy ring. A " +
      "few stay on the surface and never touch the floor at all. Manufacturers use these " +
      "terms loosely, so check coverage model by model rather than trusting the category " +
      "name — a wall climbing robotic pool cleaner and a floor-only machine can sit at the " +
      "same price.",

    rows: [
      {
        title: "Floor-only cleaning",
        whoFor: "Flat floors, settled dirt, tighter budgets",
        body:
          "A floor-only machine covers the pool floor and nothing above it. For a pool with " +
          "a flat base where most of the dirt settles rather than sticking to the sides, that " +
          "is often genuinely enough. It also costs less than paying for climbing ability you " +
          "will never use.",
      },
      {
        title: "Wall and waterline cleaning",
        whoFor: "In-ground pools with a visible tile line",
        body:
          "Climbing depends on traction, not raw power. A robot can reach the wall without " +
          "ever scrubbing the waterline, which is exactly where the oily ring forms. Treat " +
          "\"climbs walls\" and \"cleans the waterline\" as two separate claims, and confirm " +
          "both for the exact model rather than the product range.",
      },
      {
        title: "Surface skimming",
        whoFor: "Pools under trees, where leaves land faster than they sink",
        body:
          "A surface skimmer collects floating debris before it settles. It does not clean the " +
          "floor or the walls, so it works alongside a floor-and-wall robot rather than " +
          "replacing one. Leaves lifted at the surface never become the load your main robot " +
          "has to shift later.",
      },
    ],
  },
};

export function coverageSectionFor(slug: string | undefined): CoverageSectionContent | undefined {
  return slug ? COVERAGE_SECTION[slug] : undefined;
}

/* ============================================================
   Section 4 — the binary power choice.

   Pool wording follows the approved Notion research ("Corded vs
   cordless robotic pool cleaners"), including its boundary rule:
   this section owns "corded robotic pool cleaner" (590, KD 0)
   and must NOT be optimised for "cordless robotic pool cleaner"
   (22,200) — that term belongs to the dedicated cordless guide.
   The exact cordless phrase is therefore avoided here, and the
   section stays short.

   No outbound link yet: /best-robots/robotic-pool-cleaners/
   cordless/ does not exist, and the research forbids promoting
   an unfinished destination. Add the link when that page ships.
   ============================================================ */

export interface SplitSectionContent {
  id: string;
  eyebrow?: string;
  title: string;
  intro: string;
  panels: SplitPanel[];
}

export const SPLIT_SECTION: Record<string, SplitSectionContent> = {
  "robotic-pool-cleaners": {
    id: "power",
    eyebrow: "Power",
    title: "Corded vs cordless robotic pool cleaners",

    /* 77 words. Carries "corded robotic pool cleaner" (590) once, naturally. */
    intro:
      "Power is the first real fork in the decision. A corded robotic pool cleaner draws " +
      "continuous power from a transformer at the poolside, so a long cycle is never cut " +
      "short by a battery. A cordless machine charges between runs and goes in with no cable " +
      "to manage. Neither is better in the abstract — it comes down to the size of your pool, " +
      "how you lift the robot in and out, and how much cable you are willing to untangle.",

    panels: [
      {
        label: "CORDED",
        title: "When corded is the stronger choice",
        points: [
          "Continuous power, so a full cycle never stops half way through.",
          "Better suited to longer pools, where a battery can run flat before the floor is done.",
          "Cycle length stays predictable — the same clean every run.",
        ],
        tradeOff:
          "The cable has to be managed, and it can twist on a freeform pool or one with a lot " +
          "of corners.",
      },
      {
        label: "CORDLESS",
        title: "When cordless is the stronger choice",
        points: [
          "Nothing to plug in and nothing trailing across the deck.",
          "Quicker to drop in for a short run without setting up a transformer.",
          "Easier to move between a pool and a spa, or to store away.",
        ],
        tradeOff:
          "Runtime caps how much ground it covers in one go, and a bigger pool may need a " +
          "recharge part-way through.",
      },
    ],
  },
};

export function splitSectionFor(slug: string | undefined): SplitSectionContent | undefined {
  return slug ? SPLIT_SECTION[slug] : undefined;
}

/* ============================================================
   Section 5 — the capability matrix.

   Pool wording follows the approved Notion research ("What
   debris can a pool robot actually remove?"), which specifies a
   debris-versus-filter matrix and three sub-topics: leaves and
   larger debris, fine dirt and silt, algae and stuck-on dirt.

   This section is also where the core synonyms "robotic pool
   vacuum" and "pool cleaning robot" land. They belong to the
   same 40,500 keyword family as the primary term, and filtration
   is the one place "vacuum" is the honest word to use rather
   than a term dropped in for search engines.
   ============================================================ */

export interface MatrixSectionContent {
  id: string;
  eyebrow?: string;
  title: string;
  intro: string;
  columns: string[];
  rows: MatrixRow[];
  note?: string;
}

export const MATRIX_SECTION: Record<string, MatrixSectionContent> = {
  "robotic-pool-cleaners": {
    id: "debris",
    eyebrow: "Debris and filtration",
    title: "What debris can a pool robot actually remove?",

    /* 75 words. Carries "robotic pool vacuum" and the filtration cluster. */
    intro:
      "A robotic pool vacuum does not treat all dirt the same way. Leaves are a volume " +
      "problem — they fill the basket. Fine silt is a filtration problem, and depends on how " +
      "fine the filter genuinely is rather than what the box calls it. Algae is a chemistry " +
      "problem a robot can help with but never solve. Match the debris you actually get to " +
      "the basket and the filter, not to a marketing word like ultra-fine.",

    columns: ["What it needs", "Where a robot falls short"],

    rows: [
      {
        label: "Leaves and larger debris",
        image: {
          src: "/media/pool/debris-leaves.webp",
          alt:
            "Fallen leaves floating on the surface and settled across the floor of a blue " +
            "in-ground swimming pool.",
        },
        cells: [
          "A wide intake and a basket big enough to hold a full load in one cycle.",
          "A full basket stops collecting. Under heavy leaf fall you may have to empty it " +
            "part-way through a run.",
        ],
      },
      {
        label: "Fine dirt, sand and silt",
        image: {
          src: "/media/pool/debris-silt.webp",
          alt:
            "Underwater view of fine brown silt gathered along the join between the floor " +
            "and the wall of a swimming pool.",
        },
        cells: [
          "A filter that is genuinely fine, stated as a measurement rather than described " +
            "as fine on the packaging.",
          "Fine filters block sooner and lose suction if they are not rinsed between runs.",
        ],
      },
      {
        label: "Algae and stuck-on dirt",
        image: {
          src: "/media/pool/debris-algae.webp",
          alt:
            "A freeform swimming pool with cloudy green algae-tinted water and debris " +
            "suspended near the surface.",
        },
        cells: [
          "Active brushing and enough traction to scrub, rather than suction on its own.",
          "A pool cleaning robot lifts algae once it is loosened, but it does not correct " +
            "the water chemistry that grew it.",
        ],
      },
    ],

    note:
      "Filter fineness is usually given in microns. A lower number means a finer filter — " +
      "and a filter that needs rinsing more often.",
  },
};

export function matrixSectionFor(slug: string | undefined): MatrixSectionContent | undefined {
  return slug ? MATRIX_SECTION[slug] : undefined;
}

/* ============================================================
   Section 6 — the pre-purchase checklist.

   Pool wording follows the approved Notion research ("Features
   that matter before you buy"), including its five sub-topics and
   its instruction to translate specification fields into customer
   consequences rather than produce a feature dump. Every item
   therefore pairs the explanation with the exact question to ask.

   Carries "smart robotic pool cleaner" (110) in the app and
   scheduling item, where it is the natural phrase.
   ============================================================ */

export interface CheckSectionContent {
  id: string;
  eyebrow?: string;
  title: string;
  intro: string;
  boxLabel?: string;
  items: CheckItem[];
}

export const CHECK_SECTION: Record<string, CheckSectionContent> = {
  "robotic-pool-cleaners": {
    id: "before-you-buy",
    eyebrow: "Before you buy",
    title: "Features that matter before you buy",

    /* 67 words. */
    intro:
      "Specifications only matter once you translate them into what happens in your pool. A " +
      "maximum length figure decides whether a cycle finishes. Filter access decides whether " +
      "you keep using the thing. A smart robotic pool cleaner is only smart for as long as " +
      "its app is still supported. Check these five before you spend, rather than after.",

    boxLabel: "Check these before buying",

    items: [
      {
        title: "Pool length and navigation",
        body:
          "The stated maximum length is the number that decides whether a cycle finishes the " +
          "floor. Navigation decides whether it covers the whole pool or misses the same " +
          "corner every run.",
        ask: "Does the stated maximum length cover my longest run, not my average?",
      },
      {
        title: "Filter access and maintenance",
        body:
          "A filter you have to fight with is a filter you stop rinsing, and a clogged filter " +
          "quietly loses you suction. Top-access baskets are quicker to empty than ones " +
          "reached from underneath.",
        ask: "Can I empty and rinse it without turning the machine over?",
      },
      {
        title: "App, Wi-Fi and scheduling controls",
        body:
          "Scheduling is what turns pool cleaning into something you stop thinking about. But " +
          "an app is also a dependency — it has to keep working for as long as you own the " +
          "robot.",
        ask: "Does it still run on its own if the app stops being updated?",
      },
      {
        title: "Retrieval, weight and storage",
        body:
          "A robot full of water is considerably heavier than its dry weight on the box, and " +
          "you lift it out after every cycle. The weight that matters is the one you feel at " +
          "the poolside.",
        ask: "What does it weigh coming out of the water, and where will it live?",
      },
      {
        title: "Warranty, parts and retailer support",
        body:
          "Brushes, filters and tracks are consumables. A robot is only as serviceable as its " +
          "spare parts, and warranty terms can differ by retailer as well as by brand.",
        ask: "Are replacement parts sold separately, and who actually honours the warranty?",
      },
    ],
  },
};

export function checkSectionFor(slug: string | undefined): CheckSectionContent | undefined {
  return slug ? CHECK_SECTION[slug] : undefined;
}
