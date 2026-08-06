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
  /* Yard size carries the acreage keyword cluster — roughly 2,060/mo across
     "best robot lawn mower for 1 acre" (880, KD 4), "robot lawn mower 1 acre"
     (720), "robot lawn mower for 2 acres" (210) and "best robot lawn mower for
     small yard" (70).

     That cluster was planned as its own guide until the follow-up SERP run of
     6 August 2026 measured "best robot lawn mower for 1 acre" at 6/10 shared
     domains with "best robot lawn mower". Same result set, so a guide would
     have competed with this page. It lives here instead — which is also where
     it belongs, since acreage is the first question BotMatch asks. */
  "robotic-lawn-mowers": {
    id: "yard-size",
    eyebrow: "Yard size",
    title: "Choose a robot lawn mower for your yard size",
    /* 78 words. */
    intro:
      "Area is the hardest constraint in this category and the first one to check. Every " +
      "machine states a maximum it can maintain, and that figure assumes it mows most days — " +
      "a mower rated for an acre does not cut an acre in an afternoon, it keeps an acre tidy " +
      "over a week. Buy one rated close to your actual lawn and it runs constantly to keep up. " +
      "Buy with headroom and it works less to do more.",
    cards: [
      {
        title: "Small yards",
        bestFor: "Courtyards, townhouse gardens, anything under about a quarter acre.",
        points: [
          "The cheapest machines are genuinely enough here, and a boundary wire is a one-afternoon job on a small perimeter.",
          "Watch the minimum rather than the maximum: a very small lawn can confuse a mower built to cover ground.",
          "Narrow passages between lawn areas are the usual failure — check the stated minimum width.",
        ],
      },
      {
        title: "Quarter acre to an acre",
        bestFor: "The typical American back yard, often in more than one piece.",
        points: [
          "The most competitive part of the market, and where wire-free navigation starts to pay for itself.",
          "Multiple zones matter more than raw area — a front lawn and a back lawn are two jobs, not one.",
          "Check whether the mower can cross a driveway or path on its own, or whether you carry it.",
        ],
      },
      {
        title: "An acre and up",
        bestFor: "Large properties, paddocks, anything measured in acres rather than feet.",
        points: [
          "Battery and charge-return behaviour decide this, not cutting width — the machine spends real time driving back to base.",
          "All-wheel drive and larger wheels stop being a luxury once the ground is uneven.",
          "This is where the price climbs steeply, and where a second smaller mower sometimes beats one big one.",
        ],
      },
    ],
  },
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
  "robotic-lawn-mowers": {
    id: "terrain",
    eyebrow: "Your ground",
    title: "Slopes, trees and awkward ground: where can it actually mow?",
    intro:
      "Area is the constraint people check. Terrain is the one that catches them out. A slope " +
      "past what the wheels can hold, a canopy of mature trees over the lawn, or a garden split " +
      "into pieces by a driveway will each rule out machines that the acreage figure said were " +
      "fine. Work out which of these three you have before comparing anything else.",
    rows: [
      {
        title: "Slopes and banks",
        whoFor: "Anything you would think twice about pushing a mower up",
        body:
          "Slope is stated as a percentage, not degrees, and the gap between models is wide. " +
          "The figure is also a maximum in ideal conditions — wet grass, a slope that steepens " +
          "at the top, or a turn taken across the fall line are all harder than the number " +
          "suggests. Measure your steepest section rather than your average, and treat the " +
          "manufacturer's figure as a ceiling you should stay under.",
      },
      {
        title: "Tree cover and satellite signal",
        whoFor: "Mature gardens, anything under a canopy or beside a tall building",
        body:
          "This is the question with almost no search volume behind it and the highest chance " +
          "of ruining the purchase. A wire-free mower that navigates by satellite needs a clear " +
          "view of the sky, and a canopy of mature trees is exactly what it does not have. " +
          "Vision and LiDAR machines do not care about sky; a boundary wire does not either. If " +
          "your lawn is shaded by trees, satellite navigation is the wrong technology and no " +
          "amount of money fixes it.",
      },
      {
        title: "Separate zones and narrow passages",
        whoFor: "Front and back lawns, gardens split by a path or driveway",
        body:
          "Most yards are not one shape. A mower has to be told each area exists, get to it, " +
          "and find its way home from it. Some cross a path on their own; some need carrying; " +
          "some handle a gap only above a stated minimum width. This is also where obstacle " +
          "avoidance earns its keep — trampolines, dog toys and garden hose are what a mower " +
          "meets in a real yard, not the clean lawn in the photograph.",
      },
    ],
  },
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
  /* The category's biggest genuine fork, and roughly 1,670/mo of search:
     "wire free robot lawn mower" (720, KD 0), "gps robot lawn mower" (590),
     "robot lawn mower without perimeter wire" (210, KD 0), "lidar robot lawn
     mower" (90), plus the RTK and no-perimeter-wire long tails. The dedicated
     guide at /guides/robot-lawn-mower-without-boundary-wire/ goes deeper; this
     panel is the decision itself. */
  "robotic-lawn-mowers": {
    id: "navigation",
    eyebrow: "Navigation",
    title: "Boundary wire or wire-free",
    intro:
      "This is the fork that decides both the price and the installation. A boundary wire is a " +
      "cable pinned around the edge of the lawn that tells the mower where the lawn stops. " +
      "Wire-free machines replace it with satellite positioning, cameras or LiDAR and a map you " +
      "draw on a phone. Neither is simply better — the wire is cheap and dependable, the map is " +
      "flexible and expensive, and tree cover can decide it for you.",
    panels: [
      {
        label: "BOUNDARY WIRE",
        title: "When the wire is the right answer",
        points: [
          "It works under trees, beside buildings and anywhere satellite signal does not reach.",
          "It is the cheapest way into the category by a wide margin.",
          "Once it is down it does not drift, lose signal or need re-mapping.",
          "Small and simple lawns are laid out in an afternoon.",
        ],
        tradeOff:
          "You are digging or pinning a cable around the whole perimeter, and changing the " +
          "garden later means moving it. A cut wire is a repair job, and strimmers cut wires.",
      },
      {
        label: "WIRE-FREE",
        title: "When wire-free earns the money",
        points: [
          "No cable to lay, and the boundary is a line you drag on a phone.",
          "Changing a border or adding a flower bed takes a minute rather than an afternoon.",
          "Separate zones are easier to define, and the mower knows which is which.",
          "Systems using LiDAR or cameras rather than satellites also work under a canopy.",
        ],
        tradeOff:
          "Satellite-based systems need a clear view of the sky, so mature trees or a tall " +
          "building beside the lawn can break them. They cost considerably more, and the " +
          "antenna needs somewhere with a clear outlook to live.",
      },
    ],
  },
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
  "robotic-lawn-mowers": {
    id: "cutting",
    eyebrow: "The cut",
    title: "What a robot mower actually does to your lawn",
    intro:
      "A robot mower does not mow the way you do. It takes a few millimetres off, every day, " +
      "and drops the clippings back as mulch instead of collecting them. On grass that is " +
      "already short that produces a better lawn than weekly cutting. On grass that has got " +
      "away from you it produces a mess, and that difference explains most of the " +
      "disappointment in this category.",
    columns: ["What it does well", "Where it falls short"],
    rows: [
      {
        label: "Everyday growth",
        cells: [
          "The job it is built for. Little and often keeps the lawn at one height instead of cycling between shaggy and scalped, and the fine clippings feed the grass rather than sitting on it.",
          "Almost nothing — this is the best case, and the reason to own one. You stop noticing the lawn, which is the point.",
        ],
      },
      {
        label: "Long or wet grass",
        cells: [
          "Some machines cope with a fortnight's growth and a heavy dew; most have a rain sensor and simply wait.",
          "This is the weak point. Long grass clogs and gets flattened rather than cut, and wet clippings clump on the lawn. After a holiday you may need to mow it yourself once before handing it back.",
        ],
      },
      {
        label: "Edges and borders",
        cells: [
          "A few models cut close to a hard edge, and some drive a wheel along the border to get nearer.",
          "Every one of them leaves a margin at a wall, a fence or a flower bed. Expect to strim the edges yourself — a robot mower removes the mowing, not the gardening.",
        ],
      },
    ],
    note:
      "None of these collect clippings. If you need the grass taken away rather than mulched " +
      "back in, this is the wrong category of machine, not the wrong model.",
  },
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
  "robotic-lawn-mowers": {
    id: "before-you-buy",
    eyebrow: "Before you buy",
    title: "Five things to check before you buy",
    intro:
      "Cutting width is the specification every listing leads with and it decides almost " +
      "nothing. What decides it is whether the machine can physically cover your ground, what " +
      "it does when it cannot, and what it costs to keep running once the novelty wears off.",
    boxLabel: "Check these before buying",
    items: [
      {
        title: "The maximum area, against your actual lawn",
        body:
          "Every mower states a maximum area it can maintain. Buy one rated close to your lawn " +
          "and it runs almost constantly to keep up, which wears it out and means you hear it " +
          "all the time. Headroom is worth paying for.",
        ask: "Is the stated maximum comfortably above my lawn, not roughly equal to it?",
      },
      {
        title: "The slope figure, against your steepest part",
        body:
          "Slope is quoted as a percentage in ideal conditions. Wet grass and a turn across the " +
          "fall line are both worse than the number. A mower that cannot hold your bank will " +
          "either refuse it or slide, and neither is recoverable with a setting.",
        ask: "What percentage is my steepest section, and does the machine beat it with room to spare?",
      },
      {
        title: "Whether satellite navigation will work in your garden",
        body:
          "A wire-free mower that positions itself by satellite needs a clear view of the sky. " +
          "Mature trees, a tall building or a narrow side passage can all break it. Vision, " +
          "LiDAR and boundary-wire systems do not care about sky.",
        ask: "Is my lawn open overhead, or is it under trees?",
      },
      {
        title: "How it handles more than one lawn",
        body:
          "Front and back are two jobs. Some machines cross a path unaided, some need lifting, " +
          "and some need a stated minimum gap to get through at all. This is the most common " +
          "gap between what a mower promises and what it does in a real garden.",
        ask: "Can it get from one lawn to the other on its own?",
      },
      {
        title: "Blades, batteries and what happens if it is stolen",
        body:
          "Blades are consumables and get changed several times a season. The battery is the " +
          "part that decides the machine's life, and it is replaceable on some models and not " +
          "others. A mower also sits outside on its own, which is why theft protection and a " +
          "PIN lock are standard rather than a gimmick.",
        ask: "What do blades cost, is the battery replaceable, and what stops someone walking off with it?",
      },
    ],
  },
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
  /* No dollar figures. The catalogue for this category is not verified yet —
     the page was built ahead of its products on the owner's instruction of
     6 August 2026 — and a band printed from memory rather than from a checked
     retail price is exactly the thing the review methodology forbids. The
     rungs describe what each step up buys, which answers the question
     honestly. Figures go in when the products do. */
  "robotic-lawn-mowers": {
    id: "cost",
    eyebrow: "Cost",
    title: "How much does a robot lawn mower cost?",
    intro:
      "This is the widest price range of any robot category we cover, and the spread is not " +
      "about cutting quality — every machine here cuts grass perfectly well. What you pay for " +
      "is area, terrain and how the mower knows where the lawn ends. A small flat lawn with a " +
      "boundary wire is a fraction of the cost of an acre of sloping ground navigated without " +
      "one. What follows is what each step up actually buys.",
    rungs: [
      {
        label: "Entry",
        what:
          "A boundary wire, a modest maximum area and a gentle slope limit. Genuinely enough " +
          "for a small, flat, single lawn — and the wire is a one-afternoon job on a short " +
          "perimeter.",
      },
      {
        label: "Mid",
        what:
          "More area, a steeper slope rating, proper app control and scheduling. Wire-free " +
          "navigation starts appearing here, usually satellite-based, which is where the jump " +
          "in price comes from rather than from any change to the cut.",
      },
      {
        label: "Upper",
        what:
          "Wire-free as standard, obstacle avoidance that recognises what it is looking at, " +
          "multiple zones handled properly, and enough battery to cover ground without living " +
          "on the charging base.",
      },
      {
        label: "Top",
        what:
          "Acres rather than square feet, all-wheel drive for slopes and rough ground, and the " +
          "navigation systems that work under tree cover. Diminishing returns unless your land " +
          "genuinely needs them.",
      },
    ],
    note:
      "Every price on BotPlanet carries the date it was checked and names whether it came from " +
      "the retailer or a marketplace seller. Where we have not checked recently, we say " +
      "\"Check current price\" rather than guess.",
  },
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
  /* This section owns "are robot lawn mowers worth it" (210/mo, KD 18). It is
     a section rather than a guide because the term shares 5/10 domains with
     both head phrasings — the same threshold that folded the window best-of.
     The separate guide at /guides/robot-lawn-mower-disadvantages/ answers
     "what goes wrong", which is a different question and a different SERP. */
  "robotic-lawn-mowers": {
    id: "worth-it",
    eyebrow: "The verdict",
    title: "Are robot lawn mowers worth it?",
    intro:
      "The most-asked question in the category, and the answer turns on your ground rather " +
      "than on the machines.",
    verdict:
      "For an open lawn you would otherwise mow every week through the season, yes. For a " +
      "small yard, a shaded one, or one you enjoy mowing, no.",
    body:
      "A robot mower does not cut better than you do. It cuts more often, which is a different " +
      "thing and produces a better lawn almost by accident — grass kept at one height is " +
      "thicker than grass that swings between shaggy and scalped, and the clippings go back in " +
      "as feed rather than into a bag. What you are really buying is the disappearance of a " +
      "weekly chore for six months of the year, plus the noise going away. Against that, it is " +
      "a machine living outdoors on its own. It needs blades, it will eventually need a " +
      "battery, it will get stuck on something, and it will not touch your edges. Judged as " +
      "one job removed from every weekend, the money makes sense. Judged as a better mower, it " +
      "does not.",
    against:
      "A small lawn you can cut in fifteen minutes, a garden shaded by mature trees where " +
      "satellite navigation will not work, ground steeper than the machines can hold, or a " +
      "lawn cut by a service you are happy with. In those cases the money buys a problem " +
      "rather than a solution.",
  },
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
  /* Every question below is one Google actually surfaces. Taken from the
     People Also Ask boxes across the 24 SERPs in runs 31073327230 and
     31074893036, ranked by how often each appeared:

       negatives / disadvantages  13 appearances  (the loudest by a distance)
       lifespan                    6
       hills and slopes            5
       dog mess                    2
       cost                        2  (incl. the Husqvarna brand SERP)
       time to cut an acre         1

     These items also generate the FAQPage schema, so the structured data
     cannot claim a question the page does not show. */
  "robotic-lawn-mowers": {
    id: "faqs",
    eyebrow: "Questions",
    title: "Robot lawn mower FAQs",
    intro:
      "The questions people actually ask before buying, answered plainly. Anything needing a " +
      "longer answer gets its own guide rather than a paragraph here.",
    items: [
      {
        q: "What are the disadvantages of a robot lawn mower?",
        a:
          "Four, honestly. They do not cut edges, so you still strim. They mulch rather than " +
          "collect, so if you need clippings taken away this is the wrong machine. They " +
          "struggle with grass that has got long, which makes coming back from a holiday " +
          "awkward. And they are one more thing to maintain — blades several times a season, a " +
          "battery eventually, and the occasional rescue from somewhere it should not have " +
          "gone. None of that is a reason not to buy one; all of it is worth knowing first.",
      },
      {
        q: "Can a robot lawn mower go uphill?",
        a:
          "Up to a stated percentage, and the range across models is wide. The figure assumes " +
          "dry grass and a straight climb — a wet slope, or a turn taken across the fall line, " +
          "is harder than the number suggests. Measure your steepest section rather than your " +
          "average and pick a machine that beats it with room to spare.",
      },
      {
        q: "How long do robot lawn mowers last?",
        a:
          "The mower itself is generally good for many seasons; the battery is what ages. It is " +
          "the part that wears with every charge cycle, and whether it can be replaced " +
          "separately varies by model. Blades are a consumable and get changed several times a " +
          "season. Before you buy, check that the battery is a serviceable part rather than a " +
          "sealed one, because that is the difference between a repair and a replacement.",
      },
      {
        q: "Do robot lawn mowers work under trees?",
        a:
          "It depends entirely on how the machine navigates. A boundary wire does not care " +
          "about tree cover at all, and neither do vision or LiDAR systems. A wire-free mower " +
          "positioning itself by satellite does — it needs a clear view of the sky, and a " +
          "canopy of mature trees is exactly what it does not have. This is the question with " +
          "the least search volume behind it and the highest chance of ruining the purchase.",
      },
      {
        q: "How do robot lawn mowers deal with dog mess?",
        a:
          "Badly, and there is no polite version of this answer. A mower that drives through it " +
          "will spread it across the lawn and into its own underside. The better machines use " +
          "cameras to recognise and avoid obstacles, which includes this one, but the reliable " +
          "answer is still to check the lawn before a scheduled run — the same as you would " +
          "before mowing it yourself.",
      },
      {
        q: "How much does a robot lawn mower cost?",
        a:
          "The widest price range of any robot category we cover. The spread is not about how " +
          "well they cut — every one of them cuts grass properly — it is about how much ground " +
          "the machine covers, how steep it can go, and whether it needs a boundary wire. A " +
          "small flat lawn on a wire is a fraction of the cost of an acre of slopes navigated " +
          "without one.",
      },
    ],
  },
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
  /* NO "robotic-lawn-mowers" ENTRY, and that is deliberate.

     The panel's button goes to /botmatch/<slug>/?start=quiz, and for lawn that
     drops the reader straight into the pool questionnaire — content/matcher-
     questions.ts holds one question set and it asks about pool type, pool
     length and waterline debris. A panel promising "tell us how big the lawn
     is" that then asks about a pool is worse than no panel.

     The copy is written and waiting. Restore it here when the lawn question
     set lands:
       headline "Find your robot mower"
       body     tell us the lawn size, the slope and whether it sits under trees
       image    /media/lawn-category/feature-desktop.webp (text-free, optimised)
     Deciding questions are in §7 of the research findings. */
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
