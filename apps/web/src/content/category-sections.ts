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
import type { PriceRung } from "../components/PriceLadder.astro";
import type { FaqItem } from "../components/FaqList.astro";
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
  "window-cleaning-robots": {
    id: "glass-type",
    eyebrow: "Glass type",
    title: "Choose a window cleaning robot for your glass",
    intro:
      "The glass decides this, not the robot. A machine that needs a frame to find an edge " +
      "cannot work a frameless pane, and that single mismatch is the most common " +
      "disappointment in the category. Height matters too: the windows worth automating are " +
      "usually the ones you cannot safely reach, and those are the ones where a tether and a " +
      "power-cut hold stop being a specification and start being the point.",
    cards: [
      {
        title: "Framed windows",
        bestFor: "Ordinary house windows with a visible frame.",
        image: {
          src: "/media/window/glass-type-framed.webp",
          alt:
            "An ordinary framed house window at dusk with white glazing bars, warm lamplight " +
            "showing a living room inside.",
        },
        points: [
          "The easy case — every machine we list handles framed glass.",
          "The frame gives the robot a hard edge to find, so navigation is simpler.",
          "Small panes divided by glazing bars are the exception: check the minimum pane size.",
        ],
      },
      {
        title: "Frameless glass",
        bestFor: "Glass walls, sliding patio doors, balustrades.",
        image: {
          src: "/media/window/glass-type-frameless.webp",
          alt:
            "A frameless glass wall and sliding patio door on a modern home at dusk, the glass " +
            "meeting floor and ceiling with almost no visible framing.",
        },
        points: [
          "Every ECOVACS WINBOT in this catalogue states frameless support — it is not the hard exclusion the category's reputation suggests.",
          "What varies is how fast the edge sensor reacts, not whether it exists.",
          "The risk is at the edge, so the safety tether matters more here than anywhere.",
        ],
      },
      {
        title: "High and unreachable",
        bestFor: "Upper floors, high-rise, anything above a ladder.",
        image: {
          src: "/media/window/glass-type-high.webp",
          alt:
            "The upper floors of a modern apartment building at dusk seen from below, lit rooms " +
            "behind large windows with a city skyline beyond.",
        },
        points: [
          "This is where a robot earns its money — the windows you should not be on a ladder for.",
          "The tether is not optional and the anchor point matters as much as the robot.",
          "Check the power-cut hold: the machines here state 30 minutes on a full charge.",
        ],
      },
    ],
  },
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
  "window-cleaning-robots": {
    id: "coverage",
    eyebrow: "Where it works",
    title: "Inside, outside or sloped: where can the robot go?",
    intro:
      "Inside and outside are not the same job. An indoor pane is forgiving — if the machine " +
      "stalls, you lift it off. Outside, three storeys up, the same stall is a rescue " +
      "operation, and wind, rain and a wet frame all change the odds. Sloped glass is a third " +
      "claim again, and only one machine we list makes it. Check which of the three you " +
      "actually need before you compare anything else.",
    rows: [
      {
        title: "Interior glass",
        whoFor: "Patio doors, room dividers, mirrors, anything you can reach",
        body:
          "The safest use and the one every machine here handles. Indoors the risk is a dropped " +
          "robot on a hard floor rather than a fall from height, so the tether is a convenience " +
          "instead of a necessity. This is also where grease lives, which is the hardest soil " +
          "in the category.",
      },
      {
        title: "Exterior glass",
        whoFor: "Upper floors, high-rise, anything above a ladder",
        body:
          "The reason to buy one. Every machine we list can work exterior glass, but the tether " +
          "and its anchor stop being a specification and become the whole safety case. Read the " +
          "power-cut behaviour before the suction number: these hold for about 30 minutes on a " +
          "full charge, which is what gets the machine back to you rather than onto the drive.",
      },
      {
        title: "Sloped and skylight glass",
        whoFor: "Conservatories, roof lights, angled glazing",
        body:
          "The rarest claim, and the one most people assume is standard. Only the HUTT S55 Pro " +
          "states sloped glass in this catalogue. Everything else is specified for vertical " +
          "panes, and a machine on an angle it was not designed for is a machine relying on " +
          "suction it was never asked to prove.",
      },
    ],
  },
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
  "window-cleaning-robots": {
    id: "power",
    eyebrow: "Power",
    title: "Mains cable or battery station",
    intro:
      "Almost every window robot runs on mains power with a battery inside for emergencies, " +
      "not for cleaning. That backup is the safety system: if the power fails, the machine " +
      "holds the glass rather than falling. A small number add a portable station so the robot " +
      "can work away from a socket. That is a convenience decision, not a safety one — and it " +
      "is the single biggest reason to pay flagship money in this category.",
    panels: [
      {
        label: "MAINS",
        title: "When the cable is fine",
        points: [
          "There is a socket near the window, which at home there usually is.",
          "Continuous power means no cleaning time lost to a charge.",
          "Cheaper: the entry machines here start around $150 and all run this way.",
          "The battery still matters — it is what holds the robot on the glass in a power cut.",
        ],
      },
      {
        label: "PORTABLE STATION",
        title: "When the station earns its money",
        points: [
          "Windows far from any socket — stairwells, landings, a conservatory.",
          "The WINBOT W2 PRO Omni is the machine in this catalogue built around it.",
          "You are paying for reach and tidiness, not for cleaning performance.",
          "It adds bulk to store: the station weighs more than three times the robot.",
        ],
      },
    ],
  },
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
  "window-cleaning-robots": {
    id: "dirt",
    eyebrow: "What it removes",
    title: "What a robot window cleaner can actually shift",
    intro:
      "A robot window cleaner does not treat all dirt the same way. A film of dust wipes off " +
      "in one pass. Dried mineral spotting is chemistry, not pressure, and a machine that " +
      "sprays water alone will smear it. Grease needs a solvent and repeated passes. Match " +
      "what is actually on your glass to how the machine sprays and how many passes it makes, " +
      "rather than to the suction figure on the box.",
    columns: ["What it needs", "Where a robot falls short"],
    rows: [
      {
        label: "Rain spots and hard-water marks",
        image: {
          src: "/media/window/soil-rain-spots.webp",
          alt: "Dried rain droplets and mineral spotting across a window pane, a blurred blue-hour city behind it.",
        },
        cells: [
          "A cleaning solution rather than plain water, and more than one pass over the same spot.",
          "Plain water redistributes minerals instead of removing them. Heavy limescale still needs a hand and an acid cleaner.",
        ],
      },
      {
        label: "Dust and pollen film",
        image: {
          src: "/media/window/soil-dust-film.webp",
          alt: "A flat film of dust and pollen across glass with a single finger-swipe cut through it, garden greenery blurred behind.",
        },
        cells: [
          "One even pass. This is the job every machine in the category does well.",
          "Almost nothing — this is the best case. Dry dust can streak if the pad is already loaded.",
        ],
      },
      {
        label: "Greasy marks and fingerprints",
        image: {
          src: "/media/window/soil-greasy-marks.webp",
          alt: "Greasy fingerprints and smears on the inside of a glass door, raked by warm indoor light.",
        },
        cells: [
          "Solution, dwell time and repeat passes. A deep or heavy-duty mode rather than a fast one.",
          "One fast pass will spread grease rather than lift it. Kitchen film is the hardest thing on this list.",
        ],
      },
    ],
    note:
      "Every machine here sprays; none of them squeegees the way a person does. That is why " +
      "streaking is the category's most common complaint, and why the pad matters as much as " +
      "the pump.",
  },
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
  "window-cleaning-robots": {
    id: "before-you-buy",
    eyebrow: "Before you buy",
    title: "Five things to check before you buy",
    intro:
      "Suction is the number every listing shouts and it is not the one that decides this. " +
      "What decides it is whether the machine fits your glass, what happens when the power " +
      "goes, and whether you will still be feeding it pads in six months. Check these five " +
      "before you spend.",
    boxLabel: "Check these before buying",
    items: [
      {
        title: "Frameless support, if you have frameless glass",
        body:
          "A machine that needs a frame to find an edge is not going on a frameless pane. " +
          "Every ECOVACS WINBOT here states frameless support, so this rules in more machines " +
          "than the category's reputation suggests — but it still has to be stated.",
        ask: "Does the maker state frameless support for this exact model?",
      },
      {
        title: "What happens in a power cut",
        body:
          "The internal battery is a safety system, not a runtime. The machines here state " +
          "around 30 minutes of hold on a full charge, which is the window you have to get it " +
          "down. A model that does not state this figure has not answered the question.",
        ask: "How long does it stay on the glass with the power off?",
      },
      {
        title: "The tether and where it anchors",
        body:
          "Every one of these ships a safety cord. The cord is only as good as what it is tied " +
          "to, and outside an upper-floor window that anchor is your problem, not the " +
          "manufacturer's.",
        ask: "Where exactly am I anchoring this, three storeys up?",
      },
      {
        title: "Pads and solution — the running cost",
        body:
          "The most common owner complaint in this category is running out of pads or solution " +
          "part-way through the job. These are consumables and they are not generous in the box.",
        ask: "How many spare pads ship with it, and what do replacements cost?",
      },
      {
        title: "How it sprays, not how hard it sucks",
        body:
          "Suction keeps it on the glass; spraying and passes decide whether the glass is clean. " +
          "Nozzle count and mode selection tell you more about the finish than the Pa figure — " +
          "the cheapest machine in this catalogue grips harder than the $499 one.",
        ask: "How many nozzles and modes, and is there a heavy-duty pass?",
      },
    ],
  },
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


/* ============================================================
   Section 7 — cost.

   The approved research is explicit that researched price bands
   wait until the five products are verified, and that every
   displayed price carries a date and names its seller. None of
   that is in place, so no rung carries a figure yet and each
   shows "Check current price". The rungs describe what changes
   as the price climbs, which answers the question honestly
   without printing a number that is stale by Tuesday.
   ============================================================ */

export interface PriceSectionContent {
  id: string;
  eyebrow?: string;
  title: string;
  intro: string;
  rungs: PriceRung[];
  note?: string;
}

export const PRICE_SECTION: Record<string, PriceSectionContent> = {
  "window-cleaning-robots": {
    id: "cost",
    eyebrow: "Cost",
    title: "How much does a window cleaning robot cost?",
    intro:
      "Roughly $150 to $550, and the interesting thing about this category is what the money " +
      "does not buy. Suction barely moves across the range — the cheapest machine we list " +
      "claims a stronger grip than the $499 one. What you actually pay for is nozzles, " +
      "cleaning modes, navigation and whether a station comes with it. Prices move week to " +
      "week, so what follows is what each step up buys rather than a number.",
    rungs: [
      {
        label: "Entry",
        what:
          "Around $150 to $200. Mains powered, three cleaning modes, fewer nozzles, simpler " +
          "path planning. Genuinely enough for interior glass and ordinary framed windows — " +
          "and grip is not the compromise here.",
      },
      {
        label: "Mid",
        what:
          "Roughly $230 to $380. More nozzles, more modes, better edge handling and the " +
          "navigation generation that plans a proper path rather than a pattern. This is where " +
          "most people should be looking.",
      },
      {
        label: "Premium",
        what:
          "About $500 to $550. A station — either portable, so the robot works away from a " +
          "socket, or self-cleaning. The top of the range also brings the strongest suction and " +
          "the most modes, but the station is what the price is really for.",
      },
    ],
    note:
      "Consumables are the cost nobody quotes: pads and cleaning solution run out, and running " +
      "out mid-window is this category's most common complaint. Buy spares with the machine.",
  },
  "robotic-pool-cleaners": {
    id: "cost",
    eyebrow: "Cost",
    title: "How much does a robotic pool cleaner cost?",
    intro:
      "There is no single answer, because a robotic pool cleaner is really four products at " +
      "four prices. What moves the number is coverage — floor only, or floor, walls and " +
      "waterline — along with navigation, filter fineness, battery size and whether an app is " +
      "involved. Prices also move week to week, so a figure printed here would be wrong before " +
      "you read it. What follows is what each step up actually buys.",
    rungs: [
      {
        label: "Entry",
        what:
          "Floor-only cleaning, shorter cycles and simpler filters. Genuinely enough for a " +
          "flat, smaller pool where the dirt settles rather than sticking to the sides.",
      },
      {
        label: "Mid",
        what:
          "Wall climbing appears, filtration gets finer and cycles run longer. Basic " +
          "scheduling sometimes arrives at this level, sometimes not — check per model.",
      },
      {
        label: "Upper",
        what:
          "Full floor, wall and waterline coverage, real navigation rather than a random " +
          "pattern, and app control that is worth using rather than a checkbox on the box.",
      },
      {
        label: "Top",
        what:
          "Cordless convenience at larger pool sizes, the longest runtimes, surface skimming " +
          "or docking, and the finest filtration. Diminishing returns unless your pool is big.",
      },
    ],
    note:
      "Every price on BotPlanet carries the date it was checked and names whether it came from " +
      "the retailer or a marketplace seller. Where we have not checked recently, we say " +
      "\"Check current price\" rather than guess.",
  },
};

export function priceSectionFor(slug: string | undefined): PriceSectionContent | undefined {
  return slug ? PRICE_SECTION[slug] : undefined;
}

/* ============================================================
   Section 8 — the worth-it verdict.

   Answers the biggest question the category attracts, at
   category level, in the 120–180 words the research allows. The
   dedicated worth-it guide does not exist yet, so nothing links
   out to it.
   ============================================================ */

export interface VerdictSectionContent {
  id: string;
  eyebrow?: string;
  title: string;
  intro: string;
  verdict: string;
  body: string;
  against: string;
}

export const VERDICT_SECTION: Record<string, VerdictSectionContent> = {
  "window-cleaning-robots": {
    id: "worth-it",
    eyebrow: "The verdict",
    title: "Are window cleaning robots worth it?",
    intro:
      "The question this category attracts most, and the honest answer depends entirely on " +
      "which windows you mean.",
    verdict:
      "For glass you cannot safely reach, yes — clearly. For windows you can reach with a " +
      "cloth, no.",
    body:
      "A window robot does not clean better than you do with a squeegee and ten minutes. On an " +
      "easy pane, a person wins on speed and finish, and the machine will need a second pass " +
      "where you would have needed none. That changes completely once the glass is somewhere " +
      "you should not be standing. An upper-floor exterior pane is either a robot, a ladder or " +
      "a professional, and only one of those three is cheap and safe. Judged against a window " +
      "cleaner's visit rather than against your own afternoon, a $200 machine pays for itself " +
      "inside a year on most houses. Judged against a cloth, it never does.",
    against:
      "The case against is real and worth stating: streaking on a first pass is common, " +
      "corners are where every one of them is weakest, pads and solution run out mid-job, and " +
      "on a frameless pane you are trusting an edge sensor with a machine hanging above your " +
      "drive. None of that is a reason not to buy one. All of it is a reason to buy the right " +
      "one and tie the tether on properly.",
  },
  "robotic-pool-cleaners": {
    id: "worth-it",
    eyebrow: "The verdict",
    title: "Are robotic pool cleaners worth it?",
    intro:
      "It is the question the category attracts most, and it deserves a straight answer rather " +
      "than a sales pitch. Here is ours, at category level.",
    verdict:
      "For most pool owners with an in-ground pool, yes — but for the time it gives back, not " +
      "for the cleaning itself.",
    /* 152 words. */
    body:
      "A robot does not clean better than you would with a brush and a spare hour. What it does " +
      "is clean consistently, on a schedule, without the hour. That is the whole proposition, " +
      "and it is a genuine one: most pools get neglected not because the owner cannot clean " +
      "them but because doing it every week is tedious. Running costs are modest — a cycle " +
      "draws roughly what a fridge does over a few hours, and the consumables are brushes and " +
      "filters. Against that, it is a machine that lives in water. It will need parts, it may " +
      "need a repair, and it will not fix your water chemistry, your skimmer or your filter " +
      "pump. Treat it as one job removed from your week rather than pool maintenance solved, " +
      "and the money makes sense.",
    against:
      "A small above-ground pool you can brush in ten minutes, a pool used a few weeks a year, " +
      "or a pool where the real problem is chemistry rather than debris. In those cases a " +
      "manual vacuum and a decent skimmer net do the same job for a fraction of the money.",
  },
};

export function verdictSectionFor(slug: string | undefined): VerdictSectionContent | undefined {
  return slug ? VERDICT_SECTION[slug] : undefined;
}

/* ============================================================
   Section 9 — FAQs.

   The six questions the approved research specifies, answered
   concisely. Troubleshooting and maintenance depth belong to the
   supporting guides, per the research boundary.

   These same items generate the FAQPage schema, so the
   structured data cannot claim a question the page does not show.
   ============================================================ */

export interface FaqSectionContent {
  id: string;
  eyebrow?: string;
  title: string;
  intro: string;
  items: FaqItem[];
}

export const FAQ_SECTION: Record<string, FaqSectionContent> = {
  "window-cleaning-robots": {
    id: "faqs",
    eyebrow: "Questions",
    title: "Window cleaning robot FAQs",
    intro:
      "The questions people actually ask before buying, answered plainly. Anything needing a " +
      "longer answer gets its own guide rather than a paragraph here.",
    items: [
      {
        q: "Can a window cleaning robot fall off?",
        a:
          "It is the question everybody asks and the honest answer is yes, in principle — which " +
          "is exactly why every machine in this category ships a safety tether and an internal " +
          "battery that holds the glass when the power fails. The machines here state around 30 " +
          "minutes of hold on a full charge. The tether is only as good as what you anchor it " +
          "to, and outside an upper-floor window that anchor is your decision, not the " +
          "manufacturer's.",
      },
      {
        q: "Do window cleaning robots work on frameless windows?",
        a:
          "More often than the category's reputation suggests. Every ECOVACS WINBOT we list " +
          "states support for frameless as well as framed glass. What differs is how quickly " +
          "the edge sensor reacts, not whether one is fitted. The thing to check is that your " +
          "exact model states it — support is not automatic across a brand.",
      },
      {
        q: "Do they leave streaks?",
        a:
          "Sometimes, and it is the most common complaint in the category. These machines spray " +
          "and wipe; none of them squeegees the way a person does. Streaking usually means a " +
          "loaded pad, a fast mode where a deep one was needed, or plain water against mineral " +
          "spotting. Fresh pads and the right mode fix most of it.",
      },
      {
        q: "Can they clean the outside of upper-floor windows?",
        a:
          "Yes, and that is the case for owning one. The robot works the outside pane while you " +
          "stay inside, which is the whole proposition. Tether it, check the anchor, and read " +
          "the power-cut hold before you let it out of the window.",
      },
      {
        q: "How much does a window cleaning robot cost?",
        a:
          "About $150 to $550. Suction barely varies across that range — the cheapest machine " +
          "we list claims a stronger grip than one costing three times as much. The money buys " +
          "nozzles, cleaning modes, navigation and whether a station is included.",
      },
      {
        q: "Do they clean corners and edges properly?",
        a:
          "This is every model's weakest point. A round or square machine cannot reach into a " +
          "corner the way a cloth-wrapped finger can, so expect a margin at the very edge. Some " +
          "models add an edge-specific mode or edge-to-edge scrubbers, which narrows the margin " +
          "rather than removing it.",
      },
    ],
  },
  "robotic-pool-cleaners": {
    id: "faqs",
    eyebrow: "Questions",
    title: "Robotic pool cleaner FAQs",
    intro:
      "The questions people ask most before buying, answered plainly. Anything that needs a " +
      "longer explanation gets its own guide rather than a paragraph here.",
    items: [
      {
        q: "Do robotic pool cleaners climb walls?",
        a:
          "Some do, many do not, and the ability is model-specific rather than a feature of the " +
          "category. Climbing depends on traction against a wet surface, so a machine can be " +
          "powerful and still stay on the floor. Check the exact model rather than the product " +
          "range, because manufacturers often share a name across both.",
      },
      {
        q: "Do pool robots clean the waterline?",
        a:
          "Only if they are stated to. Reaching the wall and scrubbing the waterline are two " +
          "different claims: the waterline is the tile band at the surface where an oily ring " +
          "forms, and it needs the robot to hold position there and brush. Treat the two as " +
          "separate capabilities and confirm both.",
      },
      {
        q: "Can you leave a robotic pool cleaner in the pool?",
        a:
          "It is not recommended between cycles. Continuous exposure to pool chemicals ages " +
          "seals, brushes and cable, and most manufacturers say to remove the unit after a run. " +
          "Leaving it in also means it is sitting in the water during shock treatments, which " +
          "is where damage tends to happen.",
      },
      {
        q: "How often should a pool robot run?",
        a:
          "Twice a week suits most pools in season, with more during heavy leaf fall or after a " +
          "storm. Running it daily rarely improves the water and wears the consumables faster. " +
          "If the pool still looks dirty on that schedule, the issue is usually filtration or " +
          "chemistry rather than cleaning frequency.",
      },
      {
        q: "How long do robotic pool cleaners last?",
        a:
          "Expect several seasons rather than a decade, with brushes, filters and tracks " +
          "replaced along the way as consumables. Lifespan depends heavily on whether the unit " +
          "is removed and rinsed after cycles. Before buying, check that spare parts are sold " +
          "separately — a robot is only as serviceable as its parts supply.",
      },
      {
        q: "Can a robotic pool cleaner remove algae?",
        a:
          "It can lift algae once it is loosened, and a machine that actively brushes will help. " +
          "What it cannot do is stop algae returning, because that is a water-chemistry problem. " +
          "Balance the water first, then let the robot clear what has been dislodged.",
      },
    ],
  },
};

export function faqSectionFor(slug: string | undefined): FaqSectionContent | undefined {
  return slug ? FAQ_SECTION[slug] : undefined;
}

/* ============================================================
   The BotMatch call to action.

   Not in the approved 17-step component order — Danny asked for
   it on 3 August 2026. Placed after the buying checklist, where
   the reader has just been shown five things to verify and
   "just tell me which one" is the honest reaction.

   The copy sells the one thing that is actually different about
   BotMatch, which is that the part choosing the robot cannot see
   commission. That claim is enforced at the type level in
   packages/scoring, so it is safe to make.
   ============================================================ */

export interface BotMatchCtaContent {
  headline: string;
  body: string;
  points: string[];
  ctaLabel: string;
  note?: string;
  image?: HeroImage;
}

export const BOTMATCH_CTA: Record<string, BotMatchCtaContent> = {
  "window-cleaning-robots": {
    headline: "Find your window robot",
    body:
      "Tell us whether your glass is framed or frameless, how high it is and whether there is " +
      "a socket nearby. In about 30 seconds we will match you with the right window cleaning " +
      "robot — and tell you which ones to rule out.",
    points: ["About 30 seconds", "A handful of plain questions", "No account needed"],
    ctaLabel: "Start 30-second match",
    image: {
      src: "/media/window-category/feature-desktop.webp",
      alt: "",
      focal: "72% center",
    },
    note: "Free. We email the result and keep it on a page you can return to.",
  },
  "robotic-pool-cleaners": {
    /* This panel used to render as a poster: the headline, the body copy and
       the button were all painted into a single JPEG. That meant the words
       were pixels — a crawler read none of them, and the "button" was a
       picture of a button rather than something you can tab to and focus.

       It is now a rendered panel. Every line below is real HTML and the
       button is a real link, with text-free artwork beside it. */
    headline: "Find your perfect pool bot",
    body:
      "Tell us your budget, pool size or priorities like fast shipping. In about 30 seconds " +
      "we will match you with the right robotic pool cleaner — and tell you which ones to rule out.",
    points: ["About 30 seconds", "Eight plain questions", "No account needed"],
    ctaLabel: "Start 30-second match",
    image: {
      src: "/media/pool-category/feature-desktop.webp",
      alt: "",
      focal: "78% center",
    },
    note: "Free. We email your result and save it to a page you can come back to.",
  },
};

export function botMatchCtaFor(slug: string | undefined): BotMatchCtaContent | undefined {
  return slug ? BOTMATCH_CTA[slug] : undefined;
}
