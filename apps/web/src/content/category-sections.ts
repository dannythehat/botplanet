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

/* @extension-point per-category | required | Nine records live in this file —
   DECISION, COVERAGE, SPLIT, MATRIX, CHECK, PRICE, VERDICT, FAQ and
   BOTMATCH_CTA — and each is looked up independently. A missing record drops
   its section silently; a category with none renders a hero, a product grid
   and nothing in between. FAQ also feeds the FAQPage schema, so an absent
   record means no FAQ rich result. */
export const DECISION_SECTION: Record<string, DecisionSectionContent> = {
  /* Carries the #age anchor from the hero's second CTA. Age is the category's
     hard exclusion and its real failure mode — the measured age long-tails
     are small (coding robots for 5 year olds 210, for 10 year olds 110, for 8
     year olds 90) but the decision is the whole purchase, which is exactly
     the lawn tree-cover situation again: BotMatch asks what decides the buy,
     not what gets searched. */
  "educational-coding-robots": {
    id: "age",
    eyebrow: "Their age",
    title: "Choose a coding robot for the age they are now",
    /* 78 words. */
    intro:
      "This is the whole decision and it cuts both ways, which is unusual. Every other robot on " +
      "this site fails by being not quite good enough. These fail by being wrong for the child " +
      "in either direction — too simple and it is boring by the second afternoon, too complex " +
      "and it never gets finished. An abandoned robot is the failure mode here, not a bad " +
      "result, so buy for the child you have rather than the one you are hoping for.",
    cards: [
      {
        title: "Four to seven",
        bestFor: "Pre-readers and early readers.",
        points: [
          "Screen-free is the thing to look for — programmed with buttons or cards, no tablet, no account, no parent needed after the first go.",
          "The sequence is the lesson at this age. Press four arrows, watch it drive the route, work out why it went wrong. That is programming.",
          "Cheapest tier in the category by a distance, and the one most likely to be shared with a sibling.",
        ],
        image: {
          src: "/media/hubs/coding/card-young.webp",
          alt:
            "A chunky button-driven toy robot on a table with big directional controls and a set of arrow cards.",
        },
      },
      {
        title: "Eight to twelve",
        bestFor: "The age the whole category is designed around.",
        points: [
          "Block coding — the drag-and-drop Scratch style — is the middle step, and this is where most machines sit.",
          "Look for something that grows: a robot that starts with blocks and later accepts typed code buys years rather than months.",
          "Building becomes part of the appeal here. A kit assembled from parts holds attention longer than a finished robot does.",
        ],
        image: {
          src: "/media/hubs/coding/card-middle.webp",
          alt:
            "A child pressing the top of a small coding robot beside a set of arrow cards, a printed track and two coding books.",
        },
      },
      {
        title: "Thirteen and up",
        bestFor: "Teenagers, and adults who want the same thing.",
        points: [
          "Real languages — Python or JavaScript — rather than blocks, or the robot is a toy within a week.",
          "This is where the competition kits live, and where a school or club is often the reason for the purchase rather than the child.",
          "Also where the price steps up hard, and where a general-purpose robotics kit beats anything sold as a children's toy.",
        ],
        image: {
          src: "/media/hubs/coding/card-teen.webp",
          alt:
            "An exposed circuit-board robot kit with jumper wires being assembled at a desk beside a breadboard and laptop.",
        },
      },
    ],
  },

  /* Carries the #floors anchor from the hero's second CTA, and the floor-type
     clusters that measured inside the hub: "robot vacuum for carpet" (2,900,
     5 shared domains), "best robot vacuum for carpet" (1,900), "best robot
     vacuum for hardwood floors" (2,400) and "robot vacuum for hardwood floors"
     (1,900). Sections, not guides. */
  "robot-vacuums": {
    id: "floors",
    eyebrow: "Your floors",
    title: "Choose a robot vacuum for what is actually on your floors",
    /* 80 words. */
    intro:
      "This decides more than price does, and it is the question the specification sheet " +
      "answers least clearly. Almost every robot sold now mops as well as vacuums, which is " +
      "excellent on hard floors and a problem on carpet — a wet pad dragged across a rug is " +
      "worse than no clean at all. What separates the machines is whether the pads lift out of " +
      "the way, and how far they lift.",
    cards: [
      {
        title: "Mostly hard floors",
        bestFor: "Wood, tile, laminate, vinyl — apartments and newer houses.",
        points: [
          "The easy case, and where a robot vacuum that mops earns its money properly.",
          "Mop pressure and how often the base rinses the pads matter more than suction here.",
          "Suction figures are the most oversold number in the category. On hard floors almost anything modern is enough.",
        ],
        image: {
          src: "/media/hubs/vacuums/card-hard-floor.webp",
          alt:
            "A wide expanse of pale oak flooring running to garden doors, no rug anywhere in the room.",
        },
      },
      {
        title: "A mix of hard floor and carpet",
        bestFor: "Most family homes, and the case the whole category is designed around.",
        points: [
          "Mop lifting is the specification that matters, and the height it lifts to is what separates a good machine from a frustrating one.",
          "A low lift clears a thin rug and not much else. Deep pile needs the machine to lift high or avoid carpet entirely.",
          "Check it can identify carpet at all — the ones that cannot will mop your rug on a schedule.",
        ],
        image: {
          src: "/media/hubs/vacuums/card-mixed.webp",
          alt:
            "The boundary where oak flooring meets a large flat-weave rug, both surfaces in frame.",
        },
      },
      {
        title: "Deep or shag pile throughout",
        bestFor: "Older houses, bedrooms, anywhere soft underfoot.",
        points: [
          "This is where machines get stuck rather than clean badly, and clearance and wheel torque decide it.",
          "Consider a vacuum-only machine. Removing the mop removes the problem and usually the price premium with it.",
          "Deep pile also eats battery, so a robot rated for your square footage on tile will not reach it on carpet.",
        ],
        image: {
          src: "/media/hubs/vacuums/card-shag.webp",
          alt:
            "Deep cream shag pile close up, the fibres catching low sunlight.",
        },
      },
    ],
  },

  /* Grate material is the first fork and the only hard exclusion in the
     category. It is also the one thing a listing will not tell you clearly,
     and getting it wrong does permanent damage rather than a bad clean. */
  "grill-cleaning-robots": {
    id: "grate-type",
    eyebrow: "Your grates",
    title: "Choose a grill cleaning robot for what your grates are made of",
    /* 77 words. */
    intro:
      "Settle this before anything else, because the wrong brush does damage a better machine " +
      "cannot undo. These robots clean with replaceable brush heads in nylon, brass or steel, " +
      "and the material has to suit the grate. Run something hard across a porcelain-coated " +
      "grate and the coating comes off in strips. Underneath is bare cast iron, and bare cast " +
      "iron rusts. That is a new set of grates, not a bad afternoon.",
    cards: [
      {
        title: "Porcelain-coated grates",
        bestFor: "Most mid-range gas barbecues sold in the last decade.",
        points: [
          "Nylon brushes only. Brass and steel both strip the enamel, and once it is gone it does not come back.",
          "Nylon also means working on a warm grill rather than a hot one — the bristles soften and deform in real heat.",
          "If you cannot tell what your grates are, assume porcelain. It is the commonest and the least forgiving.",
        ],
        image: {
          src: "/media/hubs/grill/card-porcelain.webp",
          alt:
            "Porcelain-coated grill grates close up, the enamel glossy and dark.",
        },
      },
      {
        title: "Bare cast iron",
        bestFor: "Heavy grates on charcoal kettles and better gas grills.",
        points: [
          "Brass is the sensible default: hard enough to shift carbon, soft enough not to score the iron.",
          "Cast iron wants a light oil after cleaning, and no robot does that part. Budget two minutes by hand.",
          "This is where an automatic grill cleaner earns most — baked-on cast iron is the job people put off.",
        ],
        image: {
          src: "/media/hubs/grill/card-cast-iron.webp",
          alt:
            "Bare cast iron grill grates close up, matte black and seasoned.",
        },
      },
      {
        title: "Stainless steel bars",
        bestFor: "Premium gas grills and most flat-top griddles.",
        points: [
          "Takes the hardest brushes, so a steel head is fine and works fastest here.",
          "Stainless scratches visibly even when nothing is harmed, so expect the finish to dull with use.",
          "Griddle tops are a different problem: they are flat, and these machines are built to sit on bars.",
        ],
        image: {
          src: "/media/hubs/grill/card-stainless.webp",
          alt:
            "Stainless steel grill bars close up, bright and reflective.",
        },
      },
    ],
  },

  /* Cat size is the first fork and the only hard exclusion in the category.
     It carries the "for large cats" cluster — "self cleaning litter box for
     large cats" (880) plus "best self cleaning litter box for large cats"
     (260) and "for maine coon" (70) — which lives here rather than in a guide
     because it measured 6 shared top-ten domains with the head term. */
  "self-cleaning-litter-boxes": {
    id: "cat-size",
    eyebrow: "Your cat",
    title: "Choose an automatic litter box for the cat you actually have",
    /* 79 words. */
    intro:
      "Nothing else matters until this is settled, and it is the one decision here where being " +
      "wrong is a safety question rather than a disappointment. A self cleaning cat litter box " +
      "finds its " +
      "occupant by weight and starts a cycle once the cat steps out. A kitten too light to " +
      "register may not be detected at all. A large cat may register perfectly and still not " +
      "fit the chamber. Neither is fixable with a setting.",
    cards: [
      {
        title: "An average adult cat",
        bestFor: "Roughly eight to fifteen pounds — most cats, most households.",
        points: [
          "Every machine in the category is designed around this cat, so the whole catalogue is open to you.",
          "Judge on drawer capacity, odour sealing and running cost instead, because fit is not the constraint.",
          "This is also where the cheapest machines stop being a compromise and start being a sensible buy.",
        ],
        image: {
          src: "/media/hubs/litter/card-average.webp",
          alt:
            "An average adult tabby standing side on beside a self-cleaning litter box.",
        },
      },
      {
        title: "A large or long cat",
        bestFor: "Maine Coons, Ragdolls, Bengals — anything over about fifteen pounds.",
        points: [
          "Chamber size rules machines out, not the weight sensor. A cat that will not turn around inside will not use it twice.",
          "Look for the internal dimensions rather than the external footprint. Manufacturers publish the second far more readily.",
          "Globe-style boxes are the usual problem: the opening is round, and a long cat has to duck.",
        ],
        image: {
          src: "/media/hubs/litter/card-large.webp",
          alt:
            "A large long-bodied Maine Coon type cat standing side on against a plain wall for scale.",
        },
      },
      {
        title: "A kitten, or a very small cat",
        bestFor: "Under about five pounds, and anything still growing.",
        points: [
          "Most weight sensors have a minimum below which the cat is not detected — the machine does not know it is occupied.",
          "Manufacturers commonly state a minimum age or weight before use. Where they do, we quote it; where they will not, we say so.",
          "A plain open tray until the kitten is grown is the right answer more often than a cheaper automatic box is.",
        ],
        image: {
          src: "/media/hubs/litter/card-kitten.webp",
          alt:
            "A small tabby kitten sitting alone on a wide floor, tiny against the door frame beside it.",
        },
      },
    ],
  },

  /* Who it is for is the first fork in this category and the only one that
     genuinely rules machines out. It is also where the research found three
     separate query families rather than one: "robot pet" (8,100) for adults,
     "ai robot for kids" for children, and "robotic pet for elderly" (390) —
     which shares ZERO top-ten domains with "companion robot" and five with
     "best companion robot for seniors". Three audiences, one page, because
     the buyer is choosing between them rather than searching within one. */
  "companion-robots": {
    id: "who-for",
    eyebrow: "Who it's for",
    title: "Choose a robot pet for who is going to live with it",
    /* 84 words. */
    intro:
      "Nothing else about this category matters until this is settled. The same machine that " +
      "delights a nine-year-old is patronising to an adult and unusable by somebody with " +
      "arthritis and poor hearing. A robotic pet bought for a parent has to work without a " +
      "phone, without an account and without help. One bought for yourself can assume all " +
      "three. Decide who it is for first, and most of the catalogue rules itself out before " +
      "you have looked at a single specification.",
    cards: [
      {
        title: "For yourself, or another adult",
        bestFor: "A desk, a home office, a quiet flat.",
        points: [
          "This is where the desktop companion robot sits — small, expressive, stays on the desk and reacts to you while you work.",
          "Conversation quality is what you are paying for, and it is the thing most likely to disappoint after a fortnight.",
          "Check the subscription before the price. Several of the best-known machines need one to keep talking.",
        ],
        image: {
          src: "/media/hubs/companion/card-desk.webp",
          alt:
            "A companion robot beside the keyboard on an adult's home desk, a monitor and lamp behind.",
        },
      },
      {
        title: "For a child",
        bestFor: "Roughly five to ten, and always with a parent's judgement over it.",
        points: [
          "Durability and content matter more than personality — these get dropped, and they get asked strange questions.",
          "Almost all of them are subscription products, and the subscription is where the educational content lives.",
          "Read the safety reporting. Google's own results for children's AI robots include a national news investigation into what these toys will say.",
        ],
        image: {
          src: "/media/hubs/companion/card-child.webp",
          alt:
            "A companion robot on a child's bedroom rug at child height, wooden blocks scattered around it.",
        },
      },
      {
        title: "For an older relative",
        bestFor: "Someone living alone, or living with dementia.",
        points: [
          "A robotic pet for elderly use is a different product from a robot friend for a desk — it has to work with no phone, no account and no setup.",
          "The evidence base here is real: this is the one part of the category with peer-reviewed research behind it, and we cite it rather than paraphrase it.",
          "Weight, fur, warmth and a heartbeat do more here than conversation does. The most effective machines in this group barely speak.",
        ],
        image: {
          src: "/media/hubs/companion/card-older.webp",
          alt:
            "A companion robot on the side table beside a wing-backed armchair in a warm traditional sitting room.",
        },
      },
    ],
  },

  /* The layout question, which is the only genuine hard exclusion in this
     category: every roaming pet camera robot on the US market is wheeled, and
     none of them climbs stairs. */
  "pet-camera-robots": {
    id: "your-home",
    eyebrow: "Your home",
    title: "Choose a pet camera robot for your floors and your stairs",
    /* 81 words. */
    intro:
      "A pet camera robot only helps in rooms it can reach, and reaching is the part the " +
      "product photography never shows. Every one of these is a small wheeled machine. It " +
      "cannot climb a stair, it will struggle on deep pile, and a closed door is the end of " +
      "its patrol. Work out which floor your pet actually spends the day on, and whether the " +
      "robot can cross it, before you compare a single specification.",
    cards: [
      {
        title: "One floor, hard surfaces",
        bestFor: "Apartments, ranch houses, anywhere the pet stays on one level.",
        points: [
          "The best case, and the one every one of these machines is designed around.",
          "Wood, tile and laminate give small wheels the traction they need to cross a room and get home to the dock.",
          "Rugs with a lip are the usual snag — a robot that beaches on a rug edge is a robot you come home to find stranded.",
        ],
        image: {
          src: "/media/hubs/petcam/card-hallway.webp",
          alt:
            "A domestic hallway of bare wooden boards running away from the camera towards a lit doorway.",
        },
      },
      {
        title: "Stairs between the rooms that matter",
        bestFor: "Two-storey houses where the pet follows you up and down.",
        points: [
          "No pet camera robot on the market climbs stairs. This is a hard limit, not a specification to compare.",
          "You are choosing one floor to cover, or buying two machines and two docks.",
          "If the pet is upstairs all day and the dock is downstairs, a fixed camera upstairs beats a robot downstairs.",
        ],
        image: {
          src: "/media/hubs/petcam/card-staircase.webp",
          alt:
            "A wooden staircase seen from floor level at the bottom step, rising away from the camera.",
        },
      },
      {
        title: "Carpet and thick rugs",
        bestFor: "Older homes, bedrooms, anywhere soft underfoot.",
        points: [
          "Wheel size and torque decide this, and neither is on the box. Look for wheel diameter in the specifications.",
          "Deep pile drains battery fast, so a robot rated for an hour of patrol will do considerably less.",
          "A robot that cannot reliably find its own dock across carpet becomes a robot you plug in by hand, which defeats the point.",
        ],
        image: {
          src: "/media/hubs/petcam/card-deep-pile-rug.webp",
          alt:
            "The cut edge of a thick cream rug meeting a pale wooden floor, the pile standing well clear of the boards.",
        },
      },
    ],
  },

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
        image: {
          src: "/media/hubs/lawn/card-small.webp",
          alt:
            "A small enclosed suburban back lawn between fences, with a patio along one side.",
        },
      },
      {
        title: "Quarter acre to an acre",
        bestFor: "The typical American back yard, often in more than one piece.",
        points: [
          "The most competitive part of the market, and where wire-free navigation starts to pay for itself.",
          "Multiple zones matter more than raw area — a front lawn and a back lawn are two jobs, not one.",
          "Check whether the mower can cross a driveway or path on its own, or whether you carry it.",
        ],
        image: {
          src: "/media/hubs/lawn/card-medium.webp",
          alt:
            "A larger garden lawn with curved planted borders and mature trees.",
        },
      },
      {
        title: "An acre and up",
        bestFor: "Large properties, paddocks, anything measured in acres rather than feet.",
        points: [
          "Battery and charge-return behaviour decide this, not cutting width — the machine spends real time driving back to base.",
          "All-wheel drive and larger wheels stop being a luxury once the ground is uneven.",
          "This is where the price climbs steeply, and where a second smaller mower sometimes beats one big one.",
        ],
        image: {
          src: "/media/hubs/lawn/card-large.webp",
          alt:
            "A wide open expanse of mown grass running to a treeline.",
        },
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
  "educational-coding-robots": {
    id: "does-it-teach",
    eyebrow: "The honest question",
    title: "Do coding robots actually teach coding?",
    intro:
      "Parents buy an educational robot hoping for a skill and often get a toy, and the " +
      "difference is mostly down to what happens after the first fortnight. Being straight about " +
      "that is more useful than repeating a manufacturer's curriculum claim.",
    image: {
      src: "/media/hubs/coding/lead-track.webp",
      alt:
        "A coding robot part-way along a black line printed on a paper track.",
    },
    rows: [
      {
        title: "What they genuinely teach",
        whoFor: "Every age band",
        body:
          "Sequence, cause and effect, and debugging — which is most of what programming " +
          "actually is. A child who works out why the robot turned left instead of right is " +
          "doing the same thing a developer does all day, and doing it with their hands rather " +
          "than on a screen. That transfer is real and it is well supported. What none of them " +
          "teaches is a language a child will still be using in five years, and no listing " +
          "should imply otherwise.",
        image: {
          src: "/media/hubs/coding/row-code.webp",
          alt:
            "A laptop showing real typed Python beside the coding robot it controls.",
        },
      },
      {
        title: "Why most of them stop being used",
        whoFor: "Anyone about to spend three figures",
        body:
          "The honest answer is that the challenges run out. A robot with a fixed set of " +
          "activities is finished when the child has done them, and that is usually weeks " +
          "rather than years. The ones that survive have either an open building system, a " +
          "community making new projects, or a route from blocks into real code — something " +
          "that makes the next thing harder than the last. Ask what a child does with it in " +
          "month six, because month one takes care of itself.",
        image: {
          src: "/media/hubs/coding/row-shelf.webp",
          alt:
            "A part-used coding robot on a shelf beside its closed box.",
        },
      },
      {
        title: "The parent's part",
        whoFor: "Realistically, all of them",
        body:
          "The machines that get used are the ones an adult sits down with a few times early " +
          "on. That is not a flaw in the products, it is how the age group works, and any " +
          "review implying a robot will teach a child to code unattended is selling something. " +
          "If nobody in the house has half an hour a week for it, buy the simplest screen-free " +
          "one and treat it as a toy that happens to teach sequencing — which is a perfectly " +
          "good outcome.",
        image: {
          src: "/media/hubs/coding/row-button.webp",
          alt:
            "A child's hand pressing the single large button on a coding robot.",
        },
      },
    ],
  },

  /* Carries the pet-hair cluster, which is the biggest reachable opportunity
     in the category: "best robot vacuum for pet hair" is 18,100/mo at KD 8 and
     shares 5 top-ten domains with the head term. A guide would have competed
     with the hub. */
  "robot-vacuums": {
    id: "pet-hair",
    eyebrow: "Pets and hair",
    title: "Pet hair, tangles and the brush that decides it",
    intro:
      "More people buy a robot vacuum because of an animal than for any other single reason, and " +
      "the machines differ enormously at it. The thing that separates them is not suction — it " +
      "is what happens to long hair once it is inside, and whether you end up cutting it off a " +
      "brush roll with scissors every fortnight.",
    image: {
      src: "/media/hubs/vacuums/lead-mopped.webp",
      alt:
        "A damp mopped stripe drying across pale tile.",
    },
    rows: [
      {
        title: "The brush roll, and tangling",
        whoFor: "Anyone with a long-haired animal or long hair themselves",
        body:
          "A traditional bristle brush wraps hair around itself and keeps it. Rubber or " +
          "anti-tangle designs let it pass through to the bin, and the better ones add a comb " +
          "that cuts hair as it feeds. This is the single most useful difference between machines " +
          "in the category and it is buried in the specifications rather than on the box. If you " +
          "have a shedding dog or a long-haired cat, treat it as the first filter and suction as " +
          "the second.",
        image: {
          src: "/media/hubs/vacuums/row-crumbs.webp",
          alt:
            "Crumbs and grit scattered across a hard floor in raking light.",
        },
      },
      {
        title: "What a self emptying base actually solves",
        whoFor: "Multi-pet households",
        body:
          "A robot bin is small, and an animal fills it fast. Self-emptying moves the job from " +
          "every day or two to roughly every two months, which is the difference between a " +
          "machine you maintain and one you forget about. That is a real quality-of-life change " +
          "and it is why the feature is worth its price premium here more than anywhere else. " +
          "The bags are a consumable, and they are not cheap — price a year of them before " +
          "comparing.",
        image: {
          src: "/media/hubs/vacuums/row-dock.webp",
          alt:
            "A robot vacuum reversing onto its dock against the wall of an otherwise empty room.",
        },
      },
      {
        title: "The thing no robot handles",
        whoFor: "Everyone, before they spend",
        body:
          "Pet accidents. Every serious manufacturer now claims obstacle avoidance that " +
          "recognises this specific hazard, and the claims are better than they were, but none " +
          "is perfect and the failure mode is genuinely awful — a robot that drives through mess " +
          "spreads it across every floor it can reach. If your animal has accidents, run the " +
          "machine while you are home rather than on a schedule, and treat avoidance as a " +
          "reduction in risk rather than a guarantee.",
        image: {
          src: "/media/hubs/vacuums/row-corner.webp",
          alt:
            "The corner where two skirting boards meet, clean and empty.",
        },
      },
    ],
  },

  /* The bristle-safety case, which is the honest commercial argument for this
     entire category. It is a section rather than a target: "bristle free grill
     brush" is 5,400/mo but shares only 2 domains with the head term, so it is
     a different SERP belonging to brush manufacturers.

     One figure worth recording: "wire grill brush danger" carries a CPC of
     $18.08 on 260 searches. That is the highest cost-per-click measured in any
     BotPlanet category by a factor of three, and it is not retail money — it
     is the shape of a term advertisers bid on because somebody was injured. */
  "grill-cleaning-robots": {
    id: "bristles",
    eyebrow: "The real argument",
    title: "Wire bristles, and why these machines exist at all",
    intro:
      "The strongest case for a robot on your barbecue has nothing to do with saving effort. " +
      "Ordinary wire grill brushes shed bristles, the bristles stick to the grate, and the grate " +
      "touches food. It is a documented and genuinely serious injury, and it is the reason a " +
      "bristle-free machine has a market at all. It is also an argument that applies to a " +
      "twelve-dollar brush just as well, which is the part the marketing skips.",
    image: {
      src: "/media/hubs/grill/lead-clean-bars.webp",
      alt:
        "The clean top surface of a set of grill bars, evenly lit.",
    },
    rows: [
      {
        title: "What actually goes wrong",
        image: {
          src: "/media/hubs/grill/row-baked-on-grease.webp",
          alt:
            "The inside corner of a barbecue firebox under the grate, coated in thick black baked-on grease with the bars running across it.",
        },
        whoFor: "Anyone still using a wire brush on a hot grate",
        body:
          "A worn wire brush loses individual bristles. One lands on the bars, gets cooked onto " +
          "the next thing you grill, and is swallowed. Emergency departments see these, they are " +
          "hard to find on a scan, and the treatment is not trivial. The risk goes up as the " +
          "brush ages, which is exactly when people stop thinking about it. Google prices this " +
          "worry at eighteen dollars a click, which tells you who is bidding.",
      },
      {
        title: "What a robot changes, honestly",
        image: {
          src: "/media/hubs/grill/row-far-corner.webp",
          alt:
            "The far corner of an open barbecue in sunlight, where the grill bars end and meet the side wall of the firebox.",
        },
        whoFor: "Buyers comparing a robot against the brush they own",
        body:
          "These machines use replaceable brush heads that are held in a housing rather than a " +
          "hand-held head that flexes and sheds. That is a real reduction in risk and it is fair " +
          "to say so. What is not fair is implying it is the only way to get there: a bristle-free " +
          "scraper, a wooden paddle or a coil-style brush all remove the same hazard for a " +
          "fraction of the money. Buy the robot because you want the job done for you, not " +
          "because you think it is the only safe option.",
      },
      {
        title: "Checking the heads, which nobody does",
        image: {
          src: "/media/hubs/grill/row-under-grate.webp",
          alt:
            "The space below a lifted grill grate, showing the drip tray beneath it streaked with burnt-on fat.",
        },
        whoFor: "Anyone who owns one already",
        body:
          "The brush heads are consumables and they wear. A worn head on a robot is the same " +
          "hazard as a worn brush in your hand, and it is easier to ignore because the machine " +
          "does the work out of sight. Look at them every few cooks, replace them on the " +
          "manufacturer's schedule rather than when they look bad, and check the grate before " +
          "food goes on it. That last habit is worth keeping whatever you clean with.",
      },
    ],
  },

  /* The safety section, and it carries the #safety anchor the hero's second
     CTA points at. This is the most important section on the page and the
     evidence for that is unusually direct.

     "Do vets recommend self-cleaning litter boxes?" — or a near-identical
     phrasing — appears in Google's People Also Ask box on SIX of the 23 SERPs
     bought for this category. Nothing else in the run repeats like that. And
     "are self cleaning litter boxes safe" returns peta.org at position four
     with "3 Reasons Not to Buy a Self-Cleaning Litter Box", classactcats.com
     with "The Problem With Robotic And Self Cleaning Litter Boxes", and a
     Facebook post that is a safety warning. Its PAA asks outright: "Have any
     cats been injured by a Litter-Robot?"

     It is a SECTION rather than a page. The term is only 110/mo, which does
     not support a URL, and it shares four domains with the head term. But it
     is where BotPlanet's whole position — the site that tells you when not to
     buy — either means something or does not.

     A NOTE ON WHAT THIS SECTION DOES NOT DO. It does not repeat specific
     injury allegations against named products. Those are contested, some are
     litigated, and BotPlanet has verified none of them. What it does instead
     is explain the mechanism, name the cats at risk, and tell the reader
     exactly what to check — which is more useful than an anecdote and does not
     require us to assert something we cannot stand behind. */
  "self-cleaning-litter-boxes": {
    id: "safety",
    eyebrow: "The question everyone asks",
    title: "Are self-cleaning litter boxes safe?",
    intro:
      "Ask Google about any automatic litter box and it offers you the same question back: do " +
      "vets recommend these. It came up in the People Also Ask box on six of the twenty-three " +
      "searches we ran for this category, and PETA ranks on the first page for whether they are " +
      "safe at all. That is not a fringe worry to be reassured away in a sentence, so here is " +
      "the mechanism and what to check.",
    image: {
      src: "/media/hubs/litter/lead-drawer.webp",
      alt:
        "The closed waste drawer of a self-cleaning litter box, sealed shut.",
    },
    rows: [
      {
        title: "How the machine knows a cat is inside",
        whoFor: "Every buyer, before comparing anything else",
        body:
          "All of these work the same way: a weight sensor detects the cat, a timer starts when " +
          "the cat leaves, and the cycle runs a few minutes later. The safety of the whole " +
          "category rests on that sensor being right. It is reliable for a cat of ordinary " +
          "size. It is less reliable at the bottom of its range, which is why almost every " +
          "manufacturer states a minimum weight and why kittens are the group to be careful " +
          "with. Ask what the stated minimum is, and whether there is a secondary sensor — " +
          "infrared or a physical interrupt — rather than weight alone.",
        image: {
          src: "/media/hubs/litter/row-stretch.webp",
          alt:
            "A tabby cat mid-stretch on a tiled floor, alert and well, a litter box behind.",
        },
      },
      {
        title: "Who should not buy one, plainly",
        whoFor: "Kittens, very small cats, and nervous or unwell cats",
        body:
          "A kitten below the sensor threshold is the clear rule-out, and the answer is an " +
          "ordinary tray until it has grown. So is a cat that is frightened of the machine: one " +
          "that will not use it does not have a litter box, it has an ornament, and a cat that " +
          "stops using a box is a health problem before it is a cleaning one. Cats with " +
          "mobility problems or in the middle of a urinary issue are worth a word with a vet " +
          "first, because these boxes hide the evidence you would otherwise notice — which is " +
          "exactly what the health-tracking models are trying to solve.",
        image: {
          src: "/media/hubs/litter/row-two-cats.webp",
          alt:
            "Two cats in the same room, one lying on a mat and one walking, neither at the litter box behind them.",
        },
      },
      {
        title: "What we will and will not tell you",
        whoFor: "Anyone who has read the alarming version online",
        body:
          "There are widely circulated accounts of cats being hurt in these machines, some of " +
          "them attached to named products and some of them in litigation. We have verified " +
          "none of them, so we will not repeat them as fact or as a comparison point — that " +
          "would be trading on somebody's worst day for a click. What we will do is state each " +
          "machine's stated minimum weight, what sensors it actually uses, and whether the " +
          "manufacturer publishes that at all. Where a maker will not say, that silence is the " +
          "finding and we print it.",
        image: {
          src: "/media/hubs/litter/row-scoop.webp",
          alt:
            "A plastic scoop resting on the rim of an open litter tray.",
        },
      },
    ],
  },

  /* This section is the reason the category page exists, and it carries the
     #support-risk anchor the hero's second CTA points at.

     The evidence behind it is unusually direct. Google's People Also Ask asks
     "Does Eilik need a subscription?", "Does emo robot need a subscription?"
     and "Can you use Miko 3 without a subscription?" — three separate products,
     the same fear. And the research turned up three terms with large volume
     attached to products that appear to be discontinued or orphaned: vector
     robot (9,900), cozmo robot (9,900) and moxie robot (8,100). Roughly 28,000
     searches a month for machines whose companies stopped.

     No other category BotPlanet covers has this problem. A pool robot works
     when its maker goes under. A companion robot often does not. */
  "companion-robots": {
    id: "support-risk",
    eyebrow: "The risk nobody prices in",
    title: "Subscriptions, shutdowns, and what happens when the company stops",
    intro:
      "This is the single most important section on this page, and it is the one the " +
      "manufacturers do not write. A companion robot is not really a product you own — it is " +
      "a product plus a company that has to keep existing. When that company stops, some of " +
      "these machines become ornaments. Before comparing personality or price, understand what " +
      "you are actually depending on.",
    image: {
      src: "/media/hubs/companion/lead-lap.webp",
      alt:
        "An older person's hands resting on a companion robot held in their lap.",
    },
    rows: [
      {
        title: "The subscription question",
        whoFor: "Almost every talking machine in this category",
        body:
          "Ask it before you ask anything else, because Google's own users do. The People Also " +
          "Ask box on three different products in this category asks whether that product " +
          "needs a subscription. The pattern is consistent: the hardware price gets the " +
          "headline, and the conversation, the cloud voice and the children's learning content " +
          "sit behind a monthly fee. Some machines keep a reduced personality when you stop " +
          "paying. Others go quiet. We state which for every product we list, and where the " +
          "manufacturer will not say, we say that instead.",
        image: {
          src: "/media/hubs/companion/row-alone.webp",
          alt:
            "A companion robot alone on a wooden floor in a quiet lit room.",
        },
      },
      {
        title: "When the company shuts down",
        whoFor: "Anyone spending real money on a cloud-connected robot",
        body:
          "This is not a hypothetical risk in this category, it is a recurring event, and the " +
          "search data shows the wreckage. Three of the best-known names in desktop and " +
          "children's companion robots still draw tens of thousands of searches a month between " +
          "them while being difficult or impossible to buy new. People are looking for machines " +
          "whose makers stopped. Ask what the robot can still do with no internet connection " +
          "at all — a machine with local personality survives its manufacturer, and a machine " +
          "that is a speaker for a cloud service does not.",
        image: {
          src: "/media/hubs/companion/row-shelf.webp",
          alt:
            "A companion robot settled on a bookshelf among books and a framed picture.",
        },
      },
      {
        title: "What it hears, and where that goes",
        whoFor: "Anything with a microphone in a bedroom or a child's room",
        body:
          "These are always-listening devices with cameras, sold to sit in the rooms people are " +
          "least guarded in. That is worth a clear head rather than alarm. The questions that " +
          "matter are whether audio is processed on the device or in the cloud, whether " +
          "recordings are retained and for how long, whether there is a hardware microphone cut, " +
          "and which country the company answers to. Where a manufacturer publishes answers we " +
          "quote them. Where a manufacturer publishes nothing, that absence is itself the " +
          "finding and we record it.",
        image: {
          src: "/media/hubs/companion/row-speech.webp",
          alt:
            "A companion robot with its light ring active and a speech bubble beside it.",
        },
      },
    ],
  },

  /* Carries the #versus-fixed anchor from the hero's second CTA. This is the
     comparison the buyer is actually making — not robot against robot, but
     robot against the $40 fixed camera they already own. */
  "pet-camera-robots": {
    id: "versus-fixed",
    eyebrow: "The real comparison",
    title: "A moving pet camera, or a fixed one?",
    intro:
      "Almost nobody comparing pet camera robots is choosing between two robots. They are " +
      "choosing between a robot and a fixed camera that costs a fifth as much, and the honest " +
      "answer depends entirely on whether their pet moves. Google agrees, incidentally: search " +
      "for the best one of these and it returns reviews of ordinary fixed pet cameras, because " +
      "that is the market this sits inside.",
    image: {
      src: "/media/hubs/petcam/row-empty-room.webp",
      alt:
        "An empty living room in the middle of the afternoon, sofa and armchair unoccupied and daylight coming through tall windows.",
    },
    rows: [
      {
        title: "What the robot genuinely adds",
        image: {
          src: "/media/hubs/petcam/row-cat-watching.webp",
          alt:
            "A tabby and white cat crouched flat on a wooden floor, eyes fixed on a small grey ball just in front of it.",
        },
        whoFor: "Dogs that follow you room to room, and cats that hide",
        body:
          "A fixed camera watches one place. If the dog sleeps somewhere else, you watch an " +
          "empty sofa. A robot pet camera drives to the animal, which turns \"is he all right\" " +
          "from a guess into an answer. It also lets you initiate something rather than just " +
          "observe — drive over, speak, throw a treat, get a reaction. For an anxious dog with " +
          "separation problems, that interaction is the actual product and the camera is how " +
          "you steer it.",
      },
      {
        title: "Where the fixed camera wins",
        image: {
          src: "/media/hubs/petcam/row-dog-by-door.webp",
          alt:
            "A cockapoo sitting alone on a wooden floor beside a closed black front door, looking towards the camera.",
        },
        whoFor: "Most households, honestly",
        body:
          "A fixed camera is always on, always charged, always pointed somewhere useful, and " +
          "costs a fraction as much. It does not get stuck under a bed, run out of battery at " +
          "two in the afternoon, or need a dock it can find. If your pet sleeps in the same " +
          "place all day — which most cats and many older dogs do — a wide-angle camera on a " +
          "shelf tells you everything a pet monitoring robot would, for less money and with " +
          "nothing to go wrong.",
      },
      {
        title: "Battery, docking and the quiet failure",
        image: {
          src: "/media/hubs/petcam/row-older-dog.webp",
          alt:
            "An elderly yellow labrador asleep in a padded bed beside a window, head resting on the rim.",
        },
        whoFor: "Anyone leaving the house for a working day",
        body:
          "This is where the category disappoints, and it is rarely in the reviews. These are " +
          "small machines with small batteries. Patrol time is quoted in tens of minutes, not " +
          "hours, and the rest of the day is spent on the dock. That is fine if it docks " +
          "reliably. If it cannot find its way back across a rug, you come home to a flat robot " +
          "in a corner and no footage of the afternoon you actually wanted to see.",
      },
    ],
  },

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
        image: {
          src: "/media/hubs/lawn/row-cut.webp",
          alt:
            "Freshly cut lawn seen close up, the blade tips even across the frame.",
        },
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
        image: {
          src: "/media/hubs/lawn/row-dew.webp",
          alt:
            "Long grass heavy with dew in low morning sun.",
        },
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
        image: {
          src: "/media/hubs/lawn/row-border.webp",
          alt:
            "The edge where a lawn meets a planted border and a paved path.",
        },
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
    /* THE SHORTLIST'S HERO, KEPT PUBLISHED. This picture was drawn for
       /best-robots/window-cleaning-robots/, which folded into this page on
       12 August 2026. The section it belongs to is this one — a machine
       part-way down a tall exterior pane with its tether running out of frame
       is the exterior row, drawn. Leaving it attached to a redirected URL
       would have quietly unpublished it. */
    image: {
      src: "/media/editorial/best-window-robots.webp",
      alt:
        "A window cleaning robot part-way down a tall pane with its safety tether running up " +
        "out of frame, a city skyline and river beyond.",
    },
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
          "The reason to buy one, with one catch nobody advertises: these clean one side of the " +
          "glass at a time, so an upstairs exterior pane is only reachable if the window opens " +
          "inwards far enough for you to place the machine on the outer face and attach the " +
          "rope. No machine we hold does both sides at once. Beyond that the tether and its " +
          "anchor stop being a specification and become the whole safety case, and the " +
          "power-cut behaviour matters more than the suction number: these hold for about 30 " +
          "minutes on a full charge, which is what gets the machine back to you rather than " +
          "onto the drive.",
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
  "educational-coding-robots": {
    id: "screen-or-app",
    eyebrow: "The fork",
    title: "Screen-free, or programmed from a tablet",
    intro:
      "The first real fork, and it is a parenting decision as much as a technical one. Some " +
      "programmable robot designs are driven by pressing buttons on the robot itself or laying " +
      "out cards on the " +
      "floor. The rest need a tablet or phone. Both teach the same ideas; they put a screen in " +
      "very different places.",
    panels: [
      {
        label: "SCREEN-FREE",
        title: "When no tablet is the point",
        points: [
          "Works for a pre-reader, with no account, no app store and no parent unlocking anything.",
          "The child looks at the robot rather than at a screen, which is the whole reason many families buy one.",
          "Nothing to update, nothing to lose compatibility, and it still works in five years when the app would have been discontinued.",
          "Cheapest way in, and genuinely the right answer under about seven.",
        ],
        tradeOff:
          "The ceiling is low. Button sequences run out of depth quickly, and there is no route " +
          "from here to real code — the child moves on to a different robot rather than growing " +
          "into this one.",
      },
      {
        label: "APP-BASED",
        title: "When the tablet earns its place",
        points: [
          "Block coding needs a screen, and block coding is the step that leads somewhere.",
          "Far more depth: sensors, loops, conditionals and projects other people have written.",
          "The machines that later accept Python or JavaScript are all in this half.",
          "Usually free updates and new challenges, which is what keeps one in use past month three.",
        ],
        tradeOff:
          "It is another reason for a tablet to be out, and the app is a dependency you do not " +
          "control. When the manufacturer stops updating it, the robot's useful life ends with " +
          "it — check how old the current app is before buying.",
      },
    ],
  },

  /* The mop question, which was expected to be a separate page and measured
     firmly inside the hub: "robot vacuum and mop" shares 7 top-ten domains
     with the head term and "robot mop" shares 6. Google treats them as one
     result set, so this is the fork and not a URL. */
  "robot-vacuums": {
    id: "vacuum-or-mop",
    eyebrow: "The fork",
    title: "Vacuum only, or a robot vacuum that mops",
    intro:
      "Mopping went from a premium feature to the default in about three years, and the category " +
      "has not been honest about what that means. A robot vacuum and mop is two machines sharing a " +
      "chassis, and the compromise falls on whichever job your house needs most. Decide which " +
      "you are actually buying before you compare a single model.",
    panels: [
      {
        label: "VACUUM ONLY",
        title: "When the mop is dead weight",
        points: [
          "Carpet throughout. A mop you can never use is a water tank taking up bin space.",
          "Simpler machine, fewer consumables, nothing to refill and no dirty water to empty.",
          "Considerably cheaper for the same suction and the same navigation.",
          "Deep pile in particular — losing the mop often means losing the clearance problem too.",
        ],
        tradeOff:
          "Hard floors still need mopping and you will still be doing it. If half your ground " +
          "floor is tile, this is a false economy.",
      },
      {
        label: "VACUUM AND MOP",
        title: "When the mop is the point",
        points: [
          "Mostly hard floors, where a damp pass every day keeps them genuinely clean rather than swept.",
          "The good ones wash and dry their own pads at the base, which is what stops a mop becoming a chore.",
          "Mop lifting means a mixed house works — the machine raises the pads for carpet and drops them for tile.",
          "This is where the engineering money goes now, so the best navigation tends to arrive here first.",
        ],
        tradeOff:
          "More to fill, empty, clean and eventually replace. The base station is large and needs " +
          "a permanent home. And a machine that cannot lift its pads high enough will damp your " +
          "rugs every time it runs.",
      },
    ],
  },

  /* The comparison every buyer is actually making, and the one the category
     usually avoids. "grill brush" is 33,100/mo against the robot term's 5,400
     — six times the demand — and shares only two universal domains, so the
     brush market is a different SERP we are not chasing. It is still the thing
     on the other side of the decision, so the page argues it out. */
  "grill-cleaning-robots": {
    id: "robot-or-brush",
    eyebrow: "The fork",
    title: "A robot, or a good brush and four minutes",
    intro:
      "Almost nobody choosing a grill cleaning robot is choosing between two robots. They are " +
      "choosing between a robot and a brush that costs a fifteenth as much and is already in " +
      "the garage. That comparison deserves a straight answer rather than a feature list, so " +
      "here it is from both sides.",
    panels: [
      {
        label: "ROBOT",
        title: "When the machine is worth it",
        points: [
          "You genuinely do not clean the grill, and a machine that does it unattended is better than a brush you never pick up.",
          "You cook often enough that four minutes of scrubbing after every session actually adds up.",
          "You want the grate done while you carry food inside, rather than standing over a cooling barbecue.",
          "The brush heads are held in a housing rather than a flexing hand-held head, which is a real reduction in the loose-bristle risk.",
        ],
        tradeOff:
          "It is expensive for what it does, it needs charging, and it only reaches the top of " +
          "the bars. It does not touch the sides, the lid, the burners or the grease tray, and " +
          "those are the parts that actually make a barbecue unpleasant.",
      },
      {
        label: "BRUSH",
        title: "When a brush is the better buy",
        points: [
          "It is faster. Four minutes with a decent bristle-free scraper beats a ten-minute unattended cycle you have to set up.",
          "It gets the edges, the corners and the bars the robot drives over rather than into.",
          "Nothing to charge, nothing to store, nothing to break, and no brush heads to buy.",
          "A bristle-free design removes the safety argument entirely for about a fifteenth of the price.",
        ],
        tradeOff:
          "You have to do it, and you have to do it while the grill is still warm, which is " +
          "exactly when you would rather be eating. That is the whole reason the robot exists.",
      },
    ],
  },

  /* The category's real fork, and the one the listings hide. "what litter to
     use in a self cleaning litter box" measured 7 shared top-ten domains with
     the head term, so it belongs here rather than in a guide — and it is
     really a question about which machine you bought, because the machine
     decides the litter and the litter decides the running cost. */
  "self-cleaning-litter-boxes": {
    id: "litter-type",
    eyebrow: "The fork",
    title: "Clumping litter, or the maker's own trays",
    intro:
      "Two business models share this shelf and the product pages rarely make it obvious. Every " +
      "robotic litter box falls into one of them. One kind takes ordinary clumping litter from " +
      "any shop and rakes the clumps into a drawer. " +
      "The other takes a proprietary tray of crystal litter that you replace as a unit. They " +
      "cost similar money on the day and quite different money over three years, so work out " +
      "which one you are buying before you compare anything else.",
    panels: [
      {
        label: "CLUMPING",
        title: "When ordinary clumping litter is right",
        points: [
          "Any clumping clay litter from any shop, so you are never locked to one supplier or one price.",
          "Running cost is just litter — the thing you were buying anyway.",
          "Most cats already use clumping litter, so there is no transition to manage.",
          "This is the majority of the category, including every machine at the top of it.",
        ],
        tradeOff:
          "You handle the drawer, and the drawer smells. It also demands a genuinely clumping " +
          "litter — cheap non-clumping clay turns to sludge and jams the rake, which is the " +
          "most common cause of a machine that has stopped working.",
      },
      {
        label: "PROPRIETARY TRAY",
        title: "When a sealed tray system earns it",
        points: [
          "The least hands-on option in the category — you lift out a tray and put a new one in.",
          "Crystal litter controls odour well and tracks less through the house.",
          "Nothing to scoop, empty or wash, which is the whole reason some people buy these.",
          "Genuinely good for anyone who cannot face the drawer.",
        ],
        tradeOff:
          "You are buying refills from one company forever, and that is the actual price of the " +
          "product. Work out the annual refill cost before the sticker price — over three years " +
          "it can exceed the machine. Some cats also dislike crystal litter, and a cat that " +
          "will not use the box makes the running cost academic.",
      },
    ],
  },

  /* The category's real fork. "desktop companion robot" is 480/mo at KD 2 and
     "robot pet" is 8,100 — the same shelf to a buyer, two genuinely different
     machines, and the choice most likely to be got wrong because the product
     photography for both is a cute face on a white background. */
  "companion-robots": {
    id: "desk-or-floor",
    eyebrow: "The fork",
    title: "Stays on the desk, or moves around the room",
    intro:
      "Every machine in this category is one of two things and the listings rarely say which. " +
      "A desk companion sits where you put it, faces you, and earns its money through " +
      "expression and conversation. A floor robot drives around, reacts to the room and behaves " +
      "more like an animal. They cost similar money and they are not substitutes — one is " +
      "company while you work, the other is company in the house.",
    panels: [
      {
        label: "DESK",
        title: "When a desk companion is right",
        points: [
          "You want something present while you work, not something underfoot.",
          "Conversation and expression are the point, and both are better when the machine is not also trying to drive.",
          "It is the cheaper half of the category and the safer first purchase.",
          "Nothing to trip over, nothing to charge on a dock, nothing to lose under the sofa.",
        ],
        tradeOff:
          "It does not come to you, it does not react to the room, and the novelty of a face " +
          "that pulls expressions wears off faster than the novelty of something that behaves " +
          "like a creature. This is the half of the category most likely to end up in a drawer.",
      },
      {
        label: "FLOOR",
        title: "When a floor robot earns the money",
        points: [
          "You want something that behaves like a pet rather than a gadget — that finds you rather than waits.",
          "Movement is what makes people bond with these, and it is the difference an ai companion robot cannot fake sitting still.",
          "Better suited to a household than to one person at one desk.",
          "This is also where the premium machines live, and where the engineering money goes.",
        ],
        tradeOff:
          "Considerably more expensive, and a lot more to go wrong — wheels, sensors, a dock to " +
          "find and a floor to cope with. Stairs stop most of them, and carpet slows all of them.",
      },
    ],
  },

  /* Auto-follow versus manual drive. Both exist in the Enabot range at
     different prices and the difference is not obvious from a listing. */
  "pet-camera-robots": {
    id: "driving",
    eyebrow: "The fork",
    title: "It follows the pet, or you drive it",
    intro:
      "Two quite different products share this shelf. One patrols and tracks movement on its " +
      "own, so you open the app to a robot already looking at your dog. The other is a machine " +
      "you steer with a thumbstick on your phone. The second is cheaper and more fun; the first " +
      "is the one that still works on the days you are too busy to play with it.",
    panels: [
      {
        label: "AUTONOMOUS",
        title: "When automatic tracking is worth it",
        points: [
          "It works when you are not watching, which is most of the time.",
          "Motion tracking means the recording of the thing you missed actually contains the thing you missed.",
          "Better for anxious animals — the robot goes to them rather than waiting for them to walk past.",
          "Self-docking matters more here, because a machine that patrols all day has to charge itself.",
        ],
        tradeOff:
          "It costs more, and autonomy in a small wheeled robot is only as good as its map. In a " +
          "cluttered house it will get stuck, and a stuck robot records the underside of a chair.",
      },
      {
        label: "MANUAL",
        title: "When driving it yourself is enough",
        points: [
          "Much cheaper, and for a lot of households genuinely more fun.",
          "Fewer sensors means fewer things that fail, and less to go wrong on carpet.",
          "If you check in a couple of times a day rather than leaving it running, autonomy buys you nothing.",
          "Good enough as a first robot camera for pets before spending real money.",
        ],
        tradeOff:
          "It only works while you are holding the phone. Nothing is watched, nothing is " +
          "recorded on its own initiative, and the moment you actually wanted to see is the " +
          "moment you were in a meeting.",
      },
    ],
  },

  /* The category's biggest genuine fork, and roughly 1,670/mo of search:
     "wire free robot lawn mower" (720, KD 0), "gps robot lawn mower" (590),
     "robot lawn mower without perimeter wire" (210, KD 0), "lidar robot lawn
     mower" (90), plus the RTK and no-perimeter-wire long tails. The dedicated
     guide at /guides/wire-free-robot-lawn-mower/ goes deeper; this
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
  "educational-coding-robots": {
    id: "expectations",
    eyebrow: "What to expect",
    title: "What a coding robot is good at, and what it is not",
    intro:
      "Every stem robot is sold on a learning outcome, which makes this the hardest category on " +
      "the site to write about honestly. Here is what these machines actually do, judged as " +
      "things a child uses rather than as a curriculum.",
    columns: ["What it genuinely does", "Where it falls short"],
    rows: [
      {
        label: "Getting a child started",
        cells: [
          "Excellent. A physical thing that moves when you tell it to is far more compelling than a screen, and the first session almost always goes well.",
          "Nothing. This is the case that sells the category and it delivers every time.",
        ],
      },
      {
        label: "Holding attention past a month",
        cells: [
          "The open-ended ones manage it — building systems, community projects, a path from blocks to typed code.",
          "The fixed-challenge ones do not. When the built-in activities are done, the robot is done, and that is most of the category.",
        ],
      },
      {
        label: "Teaching real programming",
        cells: [
          "Sequence, loops, conditionals and debugging all transfer directly, and doing them physically makes them stick.",
          "No child comes out of this able to write software. It is the foundation under the skill, not the skill, and any claim otherwise is marketing.",
        ],
      },
      {
        label: "Being used without an adult",
        cells: [
          "The screen-free ones, genuinely — a five-year-old can pick one up and get going alone.",
          "Almost everything else. The app-based machines need setting up, and the kits need building. Budget parent time or budget for disappointment.",
        ],
      },
    ],
    note:
      "The most useful question to ask about any robot on this page is what a child does with it " +
      "in month six. Month one takes care of itself.",
  },

  "robot-vacuums": {
    id: "expectations",
    eyebrow: "What to expect",
    title: "What a robot vacuum replaces, and what it does not",
    intro:
      "This is the most owned robot in the world, so the gap between the promise and the " +
      "experience is well documented. Being straight about it is more useful than another " +
      "feature list: a robot vacuum cleaner changes how often your floors are clean, not " +
      "whether you ever clean them yourself.",
    columns: ["What it genuinely does", "Where it falls short"],
    rows: [
      {
        label: "Everyday floor dust",
        cells: [
          "The job it is built for and it is excellent at it. Daily running keeps floors at a level that weekly vacuuming never reaches, because the dirt never accumulates.",
          "Almost nothing. This is the case that sells the category and it delivers.",
        ],
      },
      {
        label: "Edges and corners",
        cells: [
          "Side brushes flick debris into the path, and machines with extending arms genuinely reach further into corners than they used to.",
          "Still the weakest part. Every one of them leaves a margin along skirting boards and in tight corners, and no amount of money fixes it entirely.",
        ],
      },
      {
        label: "Mopping hard floors",
        cells: [
          "A damp pass every day beats a proper mop once a month for how the floor actually looks and feels.",
          "It is a damp wipe, not a scrub. Dried-on spills need a person, and a pad that is not washed at the base just moves dirt around.",
        ],
      },
      {
        label: "Being left alone",
        cells: [
          "Modern mapping and obstacle avoidance mean a tidy house genuinely runs unattended for months.",
          "An untidy house does not. Cables, socks, toys and pet accidents all end runs, and the machine that copes with clutter is the expensive one.",
        ],
      },
    ],
    note:
      "None of these does stairs, and none replaces a real vacuum for a deep clean or for the " +
      "sofa. Think of it as keeping the floor at a standard rather than as removing vacuuming " +
      "from your life.",
  },

  "grill-cleaning-robots": {
    id: "what-it-cleans",
    eyebrow: "What to expect",
    title: "What a robotic grill cleaner actually reaches",
    intro:
      "This is the section that decides whether you are happy with one, and it is the section " +
      "the product photography works hardest to avoid. These machines sit on the cooking grate " +
      "and drive around the top of the bars. That is the whole of their world.",
    columns: ["What it does well", "Where it falls short"],
    rows: [
      {
        label: "The top of the bars",
        cells: [
          "The job it is built for, and it does it properly. Loose char and last night's residue come off the upper surface without you standing there.",
          "Almost nothing — this is the best case. It is also a smaller share of cleaning a barbecue than you think.",
        ],
      },
      {
        label: "Baked-on grease",
        cells: [
          "Works far better on a warm grill than a cold one, because warmth softens grease. A long cycle on a still-warm grate shifts a lot.",
          "On a cold grill it mostly polishes. Nylon brushes in particular need heat to work, and heat is what nylon likes least — that tension is real and unresolved.",
        ],
      },
      {
        label: "Sides, edges and the far corners",
        cells: [
          "Some machines are shaped to run right to the edge of the grate and the better ones cover it fairly.",
          "The perimeter is where these are weakest. Bars at the edge get driven along rather than across, and corners get missed.",
        ],
      },
      {
        label: "Everything below the grate",
        cells: [
          "Nothing. It never goes there.",
          "The flavour bars, the burners, the grease tray and the inside of the lid are all untouched, and they are most of what makes an old barbecue unpleasant.",
        ],
      },
    ],
    note:
      "A grill cleaning robot cleans the cooking surface. Deep-cleaning the barbecue is still a " +
      "job you do a couple of times a season, by hand, and no machine on this page changes that.",
  },

  /* Carries the multi-cat cluster — "self cleaning litter box for multiple
     cats" (1,300) and "best self cleaning litter box for multiple cats" (880).
     Both measured 6 shared top-ten domains with the head term, so a guide
     would have competed with this page. */
  "self-cleaning-litter-boxes": {
    id: "what-it-fixes",
    eyebrow: "What to expect",
    title: "What an automatic litter box actually fixes",
    intro:
      "The promise is that you never scoop again. The truth is narrower and better stated up " +
      "front: the daily job goes away and a weekly one replaces it. That is a real improvement " +
      "and worth the money for a lot of households. It is not the same as the box looking after " +
      "itself.",
    columns: ["What it genuinely does", "Where it falls short"],
    rows: [
      {
        label: "The daily scoop",
        cells: [
          "Gone, and this is the reason to own one. Waste is sifted within minutes and sealed away, so the box is clean when the cat next uses it rather than clean when you next remember.",
          "You still empty the drawer, and the drawer is worse than a day's scooping because it is several days of it at once. Call it weekly rather than never.",
        ],
      },
      {
        label: "Smell",
        cells: [
          "Much better than an open tray. Removing waste quickly is what actually controls odour, and a sealed drawer with a carbon filter holds what is left.",
          "Filters are a consumable and stop working quietly. A machine that has begun to smell usually needs its filter changed and its chamber washed, not replacing.",
        ],
      },
      {
        label: "More than one cat",
        cells: [
          "The strongest case in the category. Two cats fill a tray twice as fast, so removing waste after every visit is worth roughly twice as much.",
          "It does not repeal the vet's rule of one box per cat plus one. A single automatic box for three cats is a queue, and queues are how litter-box problems start.",
        ],
      },
      {
        label: "Knowing your cat is well",
        cells: [
          "The better machines log weight and how often each cat visits, which is genuinely useful — visit frequency is an early signal for urinary trouble.",
          "It is a log, not a diagnosis, and it is also the feature most often behind an app account. An automatic box also hides the output you would otherwise glance at.",
        ],
      },
    ],
    note:
      "An automatic cat litter box does not remove the box from the room, and none of them stops " +
      "litter being tracked across the floor. If those are the problems you are trying to solve, " +
      "this is the wrong category rather than the wrong model.",
  },

  "companion-robots": {
    id: "expectations",
    eyebrow: "What to expect",
    title: "What a robotic pet actually does, and what it does not",
    intro:
      "This is the category where the gap between the marketing video and the living room is " +
      "widest, and being straight about it is more useful than another feature list. None of " +
      "these machines is a substitute for a person or an animal. What they are is better than " +
      "an empty room, which for a lot of people is the entire point and worth paying for.",
    columns: ["What it genuinely does", "Where it falls short"],
    rows: [
      {
        label: "Company and presence",
        cells: [
          "The thing they are actually good at. A machine that reacts when you walk in changes the feel of a room, and that effect is real and repeatable rather than a trick.",
          "It is presence, not relationship. The machine does not know you, remember your week or notice you are upset, whatever the packaging implies about emotional AI.",
        ],
      },
      {
        label: "Conversation",
        cells: [
          "The best of them hold a genuine back-and-forth now, and the ones running current language models are far better than the category's reputation.",
          "Usually the subscription. It is also the feature most likely to get worse over time as a company cuts cloud costs, and the first thing to stop if it shuts down.",
        ],
      },
      {
        label: "Novelty and the long run",
        cells: [
          "The ones that move and behave like creatures hold attention for months rather than weeks. Physical behaviour beats a talking face for staying power.",
          "Be honest about this before spending: a large share of these are used daily for a fortnight and monthly after that. The desk ones fare worst.",
        ],
      },
      {
        label: "Care and wellbeing use",
        cells: [
          "The one area with peer-reviewed evidence behind it. Simple robotic pets for dementia and for isolated older people are studied, and the findings are genuinely positive.",
          "The evidence is for simple, animal-like machines rather than for talking robots. It is also not a substitute for care, and we will not present it as one.",
        ],
      },
    ],
    note:
      "Nothing on this page will tell you a companion robot cured somebody's loneliness. Where " +
      "there is research we cite it and stay inside what it found; where there is only a " +
      "marketing claim, we say that is all there is.",
  },

  "pet-camera-robots": {
    id: "what-it-handles",
    eyebrow: "What to expect",
    title: "What a pet monitoring robot handles well",
    intro:
      "How well one of these works depends far more on the animal than on the machine. The " +
      "same robot is transformative in one house and ignored in another, and you can predict " +
      "which before buying by being honest about what your pet does all day.",
    columns: ["What it does well", "Where it falls short"],
    rows: [
      {
        label: "Dogs with separation anxiety",
        cells: [
          "The strongest case in the category. Being able to drive over, speak and drop a treat gives you something to do about the distress rather than just watching it.",
          "It can also make things worse. A disembodied voice with no person attached unsettles some dogs, and you will not know which yours is until you try.",
        ],
      },
      {
        label: "Cats",
        cells: [
          "A laser or a moving toy on a robot is the best automatic play device most cats will meet, and it goes to them rather than waiting.",
          "Plenty of cats treat the robot as a threat and simply leave the room, which produces excellent footage of them leaving the room.",
        ],
      },
      {
        label: "Checking on the house",
        cells: [
          "Being able to look at any room from anywhere is genuinely useful — did I leave the hob on, is the back door shut, is anyone home.",
          "It is not a security system and should not be sold as one. It is not on when you need it, it does not alert reliably, and a burglar can pick it up.",
        ],
      },
      {
        label: "Older or sleepy pets",
        cells: [
          "Almost nothing, honestly. A fixed camera pointed at the bed does the same job better and never needs charging.",
          "This is the case where a home monitoring robot is the wrong purchase, and we would rather say so than sell one.",
        ],
      },
    ],
    note:
      "None of these replaces a dog walker, a sitter or a visit. They shorten the gap between " +
      "wondering and knowing, which is worth something — but it is worth being clear that is " +
      "what you are buying.",
  },

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
  "educational-coding-robots": {
    id: "before-you-buy",
    eyebrow: "Before you buy",
    title: "Five things to check before you buy",
    intro:
      "The stated age range on the box is the specification most likely to mislead you, because " +
      "it is set wide to sell to more people. What decides whether this gets used is the child, " +
      "the app, and what happens when the built-in challenges run out.",
    boxLabel: "Check these before buying",
    items: [
      {
        title: "The real age band, not the printed one",
        body:
          "Boxes say things like 4-12, and no product genuinely serves both ends of that. Look " +
          "at how it is programmed: buttons and cards means young, block coding means middle, " +
          "typed languages means teenager. That tells you more than the number.",
        ask: "How is it actually programmed, and does that match a child who cannot read yet?",
      },
      {
        title: "Whether it needs a tablet, and whose",
        body:
          "App-based robots need a device to be free whenever the child wants to use one. In a " +
          "house with one shared tablet, that is the difference between a robot in daily use and " +
          "a robot in a drawer.",
        ask: "Whose device does this live on, and will it be available?",
      },
      {
        title: "What happens when the challenges run out",
        body:
          "The single best predictor of whether it is still used at Christmas. A fixed set of " +
          "activities is finished in weeks. An open building system, an active community or a " +
          "path from blocks into real code is what buys years.",
        ask: "What does a child do with this in month six?",
      },
      {
        title: "How old the app is",
        body:
          "An app-dependent robot lives exactly as long as its app is maintained. Check the last " +
          "update date in the store before buying — a robot whose app has not been touched in " +
          "two years is a robot on borrowed time, whatever the box says.",
        ask: "When was the app last updated?",
      },
      {
        title: "Whether it is really for the child",
        body:
          "The uncomfortable one. A lot of these are bought by an adult who wants their child to " +
          "like coding, and the child never asked. That is not a reason not to buy one, but it " +
          "is a reason to buy the cheap screen-free option first and see what happens rather " +
          "than the flagship kit.",
        ask: "Has anyone actually asked them?",
      },
    ],
  },

  "robot-vacuums": {
    id: "before-you-buy",
    eyebrow: "Before you buy",
    title: "Five things to check before you buy",
    intro:
      "Suction in pascals is the number every listing shouts and it is close to meaningless " +
      "above a modest threshold. What decides whether you are happy in a year is the brush, the " +
      "pads, the clutter in your house and what the consumables cost.",
    boxLabel: "Check these before buying",
    items: [
      {
        title: "How high the mop pads lift",
        body:
          "If you have any carpet at all, this is the specification that decides everything. A " +
          "low lift clears a thin rug and nothing more. Machines that lift high, or that remove " +
          "the pads at the base before doing carpet, are the ones that work in a mixed house.",
        ask: "How many millimetres do the pads lift, and will that clear my thickest rug?",
      },
      {
        title: "The brush roll, if there is hair in your house",
        body:
          "Anti-tangle brush designs let long hair pass into the bin; traditional bristles wrap " +
          "it and hold it. This is the difference between never thinking about the machine and " +
          "cutting hair off it with scissors every fortnight.",
        ask: "Is the main brush anti-tangle, and does it have a cutting comb?",
      },
      {
        title: "What the consumables cost per year",
        body:
          "Filters, side brushes, mop pads and — if it empties itself — bags. None is expensive " +
          "alone and together they are not trivial. A cheap machine with proprietary bags can " +
          "cost more over three years than a dearer one that takes standard parts.",
        ask: "What does a year of filters, brushes, pads and bags cost?",
      },
      {
        title: "Whether your house is tidy enough for it",
        body:
          "The honest question nobody asks. Obstacle avoidance has improved enormously and it is " +
          "still the thing that ends most runs. A house with cables, shoes and toys on the floor " +
          "needs the good camera-based avoidance, which is most of the price gap between a $250 " +
          "machine and a $900 one.",
        ask: "Would I tidy the floor before running it, honestly?",
      },
      {
        title: "Where the base station is going to live",
        body:
          "A self-emptying, self-washing base is a piece of furniture. It needs a socket, a " +
          "permanent spot with clearance around it, and on the mopping models a place you do not " +
          "mind hearing it dry pads. People underestimate this and then keep the robot in a " +
          "cupboard, which defeats it.",
        ask: "Where exactly is it going, and is there a socket there?",
      },
    ],
  },

  "grill-cleaning-robots": {
    id: "before-you-buy",
    eyebrow: "Before you buy",
    title: "Five things to check before you buy",
    intro:
      "Cycle length is the specification the box leads with and it decides nothing — you are " +
      "not standing there. What decides it is whether the brushes suit your grates, whether the " +
      "machine physically fits, and what the consumables cost once the novelty has worn off.",
    boxLabel: "Check these before buying",
    items: [
      {
        title: "Brush material against your grate material",
        body:
          "Nylon for porcelain-coated grates, brass or steel for bare cast iron and stainless. " +
          "Getting this wrong strips enamel permanently, and the machines ship with one type in " +
          "the box while the others are sold separately.",
        ask: "What are my grates made of, and does the right head come with it or cost extra?",
      },
      {
        title: "Whether it fits your grill, and sits flat",
        body:
          "These need a broadly flat cooking surface with bars close enough together to drive " +
          "on. Very wide-spaced bars, heavily curved grates and most flat-top griddles are " +
          "either awkward or outright unsuitable.",
        ask: "How wide are the gaps between my bars, and is the grate flat?",
      },
      {
        title: "How hot it may be run",
        body:
          "Grease shifts when it is warm, so the useful cycle is on a grill that has just been " +
          "used. Every machine has a maximum temperature and nylon heads have the lowest. Run it " +
          "too hot and the brushes deform in one cycle.",
        ask: "What temperature is it rated to, and how long do I have to wait after cooking?",
      },
      {
        title: "What the brush heads cost, and how long they last",
        body:
          "Heads are consumables, they are the safety-critical part, and they are proprietary. " +
          "Work out the annual cost at your cooking frequency before you buy, because it is not " +
          "small relative to the machine.",
        ask: "What does a set of replacement heads cost, and how many cooks do they last?",
      },
      {
        title: "Battery, charging and where it lives",
        body:
          "It is a battery device that lives near a barbecue, which is outdoors, damp and hot in " +
          "turn. Check whether the battery is replaceable, how it charges, and whether the maker " +
          "expects it to be stored inside over winter.",
        ask: "Is the battery replaceable, and does it have to come indoors between cooks?",
      },
    ],
  },

  "self-cleaning-litter-boxes": {
    id: "before-you-buy",
    eyebrow: "Before you buy",
    title: "Five things to check before you buy",
    intro:
      "Capacity is the number the listings lead with and it decides very little — every machine " +
      "here holds several days. What decides it is whether your cat fits, whether your cat will " +
      "use it, and what it costs to keep running once the novelty of not scooping has worn off.",
    boxLabel: "Check these before buying",
    items: [
      {
        title: "The minimum weight, against your cat",
        body:
          "The weight sensor is the safety system, and it has a floor. Below it the machine may " +
          "not register that it is occupied. For an adult cat this is academic; for a kitten it " +
          "is the whole decision, and it is why an ordinary tray is the right answer until the " +
          "kitten has grown.",
        ask: "What is the stated minimum weight, and is my cat comfortably above it?",
      },
      {
        title: "The inside of the chamber, not the outside of the box",
        body:
          "Manufacturers publish external dimensions readily and internal ones reluctantly. A " +
          "large cat needs room to turn around, and a globe-shaped opening is narrower than the " +
          "box around it suggests. A cat that has to duck will use it once.",
        ask: "What are the internal dimensions, and will a long cat turn around in there?",
      },
      {
        title: "What litter it takes, and what that costs a year",
        body:
          "Either it takes ordinary clumping litter from any shop, or it takes the maker's own " +
          "trays forever. The second is a subscription with a machine attached. Work out three " +
          "years of refills and add it to the price before comparing anything.",
        ask: "Can I buy the litter anywhere, or only from them?",
      },
      {
        title: "Whether the app is a convenience or a requirement",
        body:
          "Some of these are perfectly usable from a panel of buttons and the app is a bonus. " +
          "Others put scheduling, cycle settings and the waste-level alert behind an account, so " +
          "a dead phone or a dropped connection becomes a litter problem.",
        ask: "Does it work fully without wifi and without an account?",
      },
      {
        title: "How you clean the machine itself",
        body:
          "The one nobody thinks about until month three. Waste gets past the rake, the chamber " +
          "needs washing, and how easily it comes apart decides whether that happens monthly or " +
          "never. A machine that cannot be stripped and hosed is one you will eventually replace " +
          "rather than clean.",
        ask: "Does it come apart, and can the parts that get dirty be washed?",
      },
    ],
  },

  "companion-robots": {
    id: "before-you-buy",
    eyebrow: "Before you buy",
    title: "Five things to check before you buy",
    intro:
      "Personality is what the listings sell and it is the thing you cannot check from a " +
      "product page. What you can check is what it costs to keep running, what it does when " +
      "the internet is off, and who is on the other end of it. These five separate a machine " +
      "you keep from one that ends up in a cupboard.",
    boxLabel: "Check these before buying",
    items: [
      {
        title: "Whether there is a subscription, and what stops without it",
        body:
          "Google's own users ask this about three separate products in this category, which " +
          "tells you how common it is. The hardware price is often not the price. Find out what " +
          "the machine still does when you stop paying — reduced personality is very different " +
          "from silence.",
        ask: "What does it cost per month, and what exactly do I lose if I cancel?",
      },
      {
        title: "What it can do with no internet at all",
        body:
          "This is the single best proxy for how long the machine will outlive its manufacturer. " +
          "A robot with its personality on the device keeps working whatever happens to the " +
          "company. A robot that is a speaker for a cloud service is worth nothing the day the " +
          "servers go off, and that day is not hypothetical in this category.",
        ask: "Unplug the router — does it still do anything?",
      },
      {
        title: "Who it is actually for",
        body:
          "The most expensive mistake here is buying an adult's desk toy for a child, or a " +
          "child's learning robot for a parent with dementia. Each of the three audiences on " +
          "this page needs something genuinely different, and a machine designed for one is " +
          "usually poor for the others rather than merely imperfect.",
        ask: "Is this designed for the person receiving it, or just appealing to me?",
      },
      {
        title: "Whether it moves, and whether that matters to you",
        body:
          "Machines that move around hold attention for months. Machines that sit on a desk and " +
          "pull faces tend to hold it for weeks. If the point is company rather than a gadget, " +
          "the thing that behaves like a creature is worth the extra money and the extra " +
          "trouble.",
        ask: "Do I want something present while I work, or something living in the house?",
      },
      {
        title: "What it hears and records, and where that goes",
        body:
          "These are microphones and cameras in bedrooms, offices and children's rooms. Check " +
          "whether audio is processed on the device or in the cloud, whether there is a way to " +
          "switch the microphone off in hardware rather than in software, and how long anything " +
          "is kept. A manufacturer that will not answer has answered.",
        ask: "Can I mute the microphone physically, and does the maker publish a retention policy?",
      },
    ],
  },

  "pet-camera-robots": {
    id: "before-you-buy",
    eyebrow: "Before you buy",
    title: "Five things to check before you buy",
    intro:
      "Resolution is the number every listing leads with and it decides almost nothing — you " +
      "are watching a dog on a sofa, not reading a number plate. What decides it is whether " +
      "the robot can get to the animal, get back to its dock, and be worth opening the app for.",
    boxLabel: "Check these before buying",
    items: [
      {
        title: "Whether your pet is on the same floor as the dock",
        body:
          "No pet camera robot climbs stairs. If the dock is downstairs and the dog sleeps " +
          "upstairs, the robot patrols an empty ground floor all day. This is the most common " +
          "reason one of these disappoints and it is entirely predictable before buying.",
        ask: "Where does my pet actually spend the day, and can the robot get there?",
      },
      {
        title: "Wheel size against your floors",
        body:
          "Small wheels and thick carpet do not mix, and rug edges strand these machines " +
          "routinely. Wheel diameter is usually buried in the specifications rather than on the " +
          "listing, and it predicts real-world behaviour better than any other number on the " +
          "page.",
        ask: "How big are the wheels, and what is on my floors?",
      },
      {
        title: "Patrol time, not battery capacity",
        body:
          "These have small batteries. Useful patrol time is quoted in tens of minutes and " +
          "carpet cuts into it hard. What matters is whether it can cover the house a few times " +
          "in a working day and get itself back on charge in between — not the milliamp-hour " +
          "figure.",
        ask: "How long does it actually patrol, and does it dock itself reliably?",
      },
      {
        title: "Whether there is a subscription for recordings",
        body:
          "The live view is usually free. Saved clips, motion history and cloud storage often " +
          "are not — and the recording is the half you want, because you were busy when the " +
          "thing happened. Check whether there is local storage on a card as an alternative.",
        ask: "Can I record without paying monthly, and is there a card slot?",
      },
      {
        title: "How it is secured, and where the video goes",
        body:
          "Google's People Also Ask on this category includes whether pet cameras are hackable, " +
          "which is a fair question about an internet-connected camera that drives around your " +
          "home. Look for two-factor authentication on the account, encryption in transit, and " +
          "a clear statement of which country the video is stored in.",
        ask: "Does the account support two-factor, and where is the footage held?",
      },
    ],
  },

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
          "down. It should be stated in minutes with the battery capacity behind it. Several " +
          "makers write \"high rise\" on the box and never publish that figure — where it is " +
          "absent, treat the words as positioning rather than a specification.",
        ask: "How long does it stay on the glass with the power off, and what battery is behind that?",
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
  "educational-coding-robots": {
    id: "cost",
    eyebrow: "Cost",
    title: "How much should a first coding robot cost?",
    intro:
      "A wide range, and the honest advice runs against the money: for a first robot, the cheap " +
      "end is usually right. A child who takes to it will tell you within a fortnight, and that " +
      "is a much better basis for spending real money than a hopeful guess in a shop. What " +
      "follows is what each step up buys.",
    rungs: [
      {
        label: "Entry",
        what:
          "A screen-free floor robot programmed with buttons or cards. No app, no account, " +
          "nothing to update. The right first purchase for anyone under about seven and the " +
          "right test purchase for almost everyone else.",
      },
      {
        label: "Mid",
        what:
          "Block coding through an app, sensors to react to the world, and a set of built-in " +
          "challenges. This is the bulk of the category and where most eight to twelve year " +
          "olds should be.",
      },
      {
        label: "Upper",
        what:
          "A building system rather than a finished robot, and usually a route from blocks into " +
          "Python or JavaScript. The step that buys years instead of months, and the one worth " +
          "paying for once a child has shown interest.",
      },
      {
        label: "Top",
        what:
          "Competition-grade kits, the ones schools and clubs use. Serious construction and real " +
          "code. Genuinely excellent and completely wasted on a child who has not asked for it.",
      },
    ],
    note:
      "Every price on BotPlanet carries the date it was checked. This category discounts hard in " +
      "November and December, which is also when most of it is bought.",
  },

  /* Carries the budget cluster, which measured inside the hub via the "best"
     term: "best budget robot vacuum" (2,900) and "best cheap robot vacuum"
     (2,900) each share 7 top-ten domains with "best robot vacuum", and "cheap
     robot vacuum" is 4,400 at KD 7. Section, not a guide. */
  "robot-vacuums": {
    id: "cost",
    eyebrow: "Cost",
    title: "How much should you spend on a robot vacuum?",
    intro:
      "The widest useful range of any category here, and unusually the cheap end is genuinely " +
      "good. A modern budget machine cleans floors about as well as a flagship — what the money " +
      "buys is navigation, tangle handling and how little you have to think about it. Decide how " +
      "much of your attention you are buying back.",
    rungs: [
      {
        label: "Entry",
        what:
          "Vacuum only or a token mop, basic navigation, a bin you empty yourself. Cleans a " +
          "small tidy flat perfectly well. Expect to rescue it occasionally and to empty it " +
          "every couple of runs.",
      },
      {
        label: "Mid",
        what:
          "Proper LiDAR mapping, no-go zones, real mop pads that lift, and usually a " +
          "self-emptying base. This is the sweet spot for most homes and where the jump in " +
          "day-to-day experience is largest.",
      },
      {
        label: "Upper",
        what:
          "Camera-based obstacle avoidance that genuinely recognises cables and pet mess, " +
          "anti-tangle brushes and a base that washes and dries the pads. The step that buys " +
          "unattended running in a house that is not spotless.",
      },
      {
        label: "Top",
        what:
          "Extending arms for corners, hot-water pad washing, mop pads that detach for carpet, " +
          "multi-floor mapping. Real engineering, but diminishing — the floors are not much " +
          "cleaner than the tier below.",
      },
    ],
    note:
      "Every price on BotPlanet carries the date it was checked. Consumables are stated " +
      "separately, because a machine with proprietary bags and pads is not as cheap as its " +
      "sticker suggests. This category discounts hard in November, and that is worth waiting " +
      "for.",
  },

  /* No dollar figures — catalogue empty, and a band printed from memory is
     what the review methodology forbids. */
  "grill-cleaning-robots": {
    id: "cost",
    eyebrow: "Cost",
    title: "How much does a grill cleaning robot cost?",
    intro:
      "The narrowest range of any category on BotPlanet, because there is very little to choose " +
      "between. The number that matters is not on the box: a good bristle-free brush does the " +
      "core of this job for a fraction of the price, so the real question is what the machine " +
      "adds over that. What follows is what each step up actually buys.",
    rungs: [
      {
        label: "Entry",
        what:
          "The base machine with one set of brush heads, usually nylon. A timer, a battery and " +
          "not much else. This is the whole product for most buyers, and the steps above it are " +
          "narrower than the price gap suggests.",
      },
      {
        label: "Mid",
        what:
          "Extra brush sets in different materials, so the same machine suits more than one " +
          "grate type, plus longer runtime. Buying the bundle is usually cheaper than buying the " +
          "heads separately later, which is the one real saving in the category.",
      },
      {
        label: "Upper",
        what:
          "Better build for outdoor life, longer warranty and higher heat tolerance — which is " +
          "the specification that decides whether you can run it when grease actually shifts. " +
          "Worth it if you cook often; hard to justify if you do not.",
      },
    ],
    note:
      "Every price on BotPlanet carries the date it was checked. Replacement brush heads are " +
      "stated separately from the machine, because they are consumable, proprietary and the " +
      "part that keeps the machine safe.",
  },

  /* No dollar figures — the catalogue is empty and a band printed from memory
     is what the review methodology forbids. Carries the budget cluster:
     "cheap self cleaning litter box" (590) and "best budget self cleaning
     litter box" (140), which measured 6 and 4 shared domains with the head
     term respectively. Sections, not a guide. */
  "self-cleaning-litter-boxes": {
    id: "cost",
    eyebrow: "Cost",
    title: "How much does a self-cleaning litter box cost?",
    intro:
      "A wide range, and the sticker price is only half the question. The best automatic litter " +
      "box for your house is rarely the cheapest one on the day. This is the one category " +
      "BotPlanet covers where running cost can overtake the machine, because some of these only " +
      "take the maker's own refill trays. Work out three years before you compare two boxes. " +
      "What follows is what each step up actually buys.",
    rungs: [
      {
        label: "Entry",
        what:
          "An open-top or simple enclosed box that rakes clumping litter into a drawer. No app, " +
          "no sensors beyond the one that keeps it safe, no health logging. Genuinely enough " +
          "for one ordinary adult cat, and the cheapest way out of daily scooping.",
      },
      {
        label: "Mid",
        what:
          "A larger sealed drawer, proper carbon filtration and an app that tells you when it is " +
          "full. This is where multi-cat capacity becomes real rather than tolerated, and where " +
          "most households should be looking.",
      },
      {
        label: "Upper",
        what:
          "Per-cat recognition and weight logging, a bigger chamber that suits a large cat, and " +
          "the build quality that decides whether it is still working in year four. The health " +
          "tracking is the clearest thing the extra money buys.",
      },
      {
        label: "Top",
        what:
          "Flagship territory: the largest chambers, the best odour sealing, self-washing in one " +
          "or two cases, and the longest warranties in the category. Diminishing returns unless " +
          "you have several cats or a very large one.",
      },
    ],
    note:
      "Every price on BotPlanet carries the date it was checked and names whether it came from " +
      "the retailer or a marketplace seller. Refill and consumable costs are stated separately " +
      "from the machine, because a cheap box that only takes one company's trays is not a cheap " +
      "box.",
  },

  /* No dollar figures in either block below. The catalogue for both categories
     is empty — the pages were built ahead of their products on the owner's
     instruction of 6 August 2026 — and a band printed from memory rather than
     from a checked retail price is exactly what the review methodology
     forbids. The rungs describe what each step up buys. Figures go in with the
     products and carry the date they were read. */
  "companion-robots": {
    id: "cost",
    eyebrow: "Cost",
    title: "How much does a companion robot cost?",
    intro:
      "A wide range, and unusually for a robot category the money does not buy capability so " +
      "much as behaviour. Every machine here has a face, a speaker and some personality. What " +
      "climbs with price is whether it moves, how well it holds a conversation, and how much " +
      "engineering went into making it feel like a creature rather than a device. Watch for " +
      "the subscription, which sits outside the price entirely.",
    rungs: [
      {
        label: "Entry",
        what:
          "A desk machine with expressions, sounds and simple reactions. No real conversation " +
          "and usually no cloud account, which also means nothing to cancel and nothing to lose " +
          "if the company disappears. Genuinely charming, and the safest first purchase.",
      },
      {
        label: "Mid",
        what:
          "Proper conversational AI, app control and a personality that develops. This is where " +
          "the subscription usually appears, and where the machine stops being a toy and starts " +
          "depending on somebody else's servers.",
      },
      {
        label: "Upper",
        what:
          "It moves. Wheels or legs, reacts to the room, finds you, docks itself. Movement is " +
          "what makes people keep these rather than shelve them, and it is the clearest thing " +
          "the extra money buys.",
      },
      {
        label: "Top",
        what:
          "Animal-grade engineering — recognisable behaviour, real materials, machines built to " +
          "be lived with for years rather than owned for a season. Also where care-focused and " +
          "therapeutic products sit, and where support risk matters most because the sums are " +
          "largest.",
      },
    ],
    note:
      "Every price on BotPlanet carries the date it was checked and names whether it came from " +
      "the retailer or a marketplace seller. Where we have not checked recently, we say " +
      "\"Check current price\" rather than guess. Subscription costs are stated separately, " +
      "because a cheap robot with a monthly fee is not a cheap robot.",
  },

  "pet-camera-robots": {
    id: "cost",
    eyebrow: "Cost",
    title: "How much does a pet camera robot cost?",
    intro:
      "The narrowest price range of any category on BotPlanet, and the most important number " +
      "is not in it: a perfectly good fixed pet camera costs a fraction of the cheapest robot " +
      "here. You are paying for movement, and whether that is worth it depends on whether your " +
      "pet moves. What follows is what each step up buys.",
    rungs: [
      {
        label: "Entry",
        what:
          "A small robot you drive yourself from the app, with a camera and two-way audio. No " +
          "autonomy, modest battery, and you charge it by hand. Fine as a way of finding out " +
          "whether your pet reacts to one at all before spending more.",
      },
      {
        label: "Mid",
        what:
          "Self-docking, longer patrol time, better low-light video, and usually a treat " +
          "dispenser or a laser. This is the sensible middle of the category and where most " +
          "buyers should be looking.",
      },
      {
        label: "Upper",
        what:
          "Autonomous patrol and motion tracking — the robot follows the animal without being " +
          "driven, which is the difference between a toy and something that works while you are " +
          "at work. Sharper cameras and proper mapping come with it.",
      },
    ],
    note:
      "Every price carries the date it was checked. Cloud recording plans are stated separately " +
      "from the hardware price, because the live view being free does not mean the recordings " +
      "are.",
  },

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
    /* THE RUNGS NAME MACHINES SINCE 12 AUGUST 2026. They described what each
       step up buys and named nothing, which is the right shape for a ladder and
       the wrong shape for the only place on this page a reader is choosing by
       budget. The names come from the folded shortlist, which is where the
       recommendation used to live. */
    rungs: [
      {
        label: "Entry",
        what:
          "Around $150 to $200. Mains powered, three cleaning modes, fewer nozzles, simpler " +
          "path planning. Genuinely enough for interior glass and ordinary framed windows — " +
          "and grip is not the compromise here. The Cop Rose X5S is the cheapest we hold and " +
          "the only one with no app at all, a remote control instead, which for a buyer who " +
          "does not want another account is the feature rather than the compromise. It does " +
          "not claim frameless glass, and that rules it out for a lot of modern windows.",
      },
      {
        label: "Mid",
        what:
          "Roughly $230 to $380. More nozzles, more modes, better edge handling and the " +
          "navigation generation that plans a proper path rather than a pattern. This is where " +
          "most people should be looking, and the WINBOT W2 PRO is the machine to look at: the " +
          "same navigation, nozzles, tank and modes as the flagship above it. Two alternatives " +
          "sit here for particular jobs — the HOBOT 2S if refilling is the part you resent, " +
          "because it takes two replaceable tanks and nothing else here does, and the Mamibot " +
          "W120-DP if you would rather not depend on one maker, since six of the eleven " +
          "machines we hold are ECOVACS.",
      },
      {
        label: "Premium",
        what:
          "About $500 to $550. A station — either portable, so the robot works away from a " +
          "socket, or self-cleaning. The top of the range also brings the strongest suction and " +
          "the most modes, but the station is what the price is really for. The WINBOT W2 PRO " +
          "Omni is the one worth the jump, and only for the windows with no socket near them: " +
          "stairwell landings, conservatories, the window behind the sofa. If every window you " +
          "own has a plug beneath it, this is a premium for a station you will never use.",
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
  "educational-coding-robots": {
    id: "worth-it",
    eyebrow: "The verdict",
    title: "Are coding robots worth it?",
    intro:
      "The last category of the ten and the one where the honest answer is least like the " +
      "marketing.",
    verdict:
      "As a way into programming for a child who is curious, yes — and start cheap. As a way to " +
      "make a child interested in coding who is not, no.",
    body:
      "What these do well is turn an abstract idea into something physical. A child who tells a " +
      "robot to go forward four and turn right, and then watches it hit the sofa, has learned " +
      "more about programming in ten seconds than an hour of screen tutorial gives them. That " +
      "effect is genuine at every age band. Where the category disappoints is duration: most of " +
      "these have a fixed set of challenges, and when those run out the robot is finished. The " +
      "ones worth real money are the ones with somewhere to go — a building system, a community, " +
      "or a path from coloured blocks into typed code. The other thing worth saying plainly is " +
      "that no robot here creates interest that was not already there. Buying the flagship kit " +
      "for a child who has never mentioned coding is a way to own an expensive box.",
    against:
      "A child who has not asked. Buy the cheapest screen-free one and see. A house with one " +
      "shared tablet and an app-based robot, which will not get used. And anyone expecting a " +
      "measurable school outcome — this is a foundation, not a curriculum, whatever the box " +
      "says.",
  },

  "robot-vacuums": {
    id: "worth-it",
    eyebrow: "The verdict",
    title: "Are robot vacuums worth it?",
    intro:
      "The most-owned robot in the world, so the answer is better evidenced here than anywhere " +
      "else on this site — and it is more qualified than the category would like.",
    verdict:
      "For hard floors, a tidy house and anyone who would otherwise vacuum weekly, yes, clearly. " +
      "For a cluttered house or deep pile throughout, buy carefully or not at all.",
    body:
      "The thing a robot vacuum actually changes is frequency. Floors cleaned every day never " +
      "reach the state that weekly vacuuming is trying to fix, so the house feels cleaner even " +
      "though the machine is worse than your upright at any single pass. That effect is real, it " +
      "is why people who own one rarely go back, and it is worth the money. What it does not do " +
      "is remove vacuuming from your life — the stairs, the sofa, the corners and the deep clean " +
      "are all still yours. The failure cases are predictable rather than mysterious: clutter " +
      "ends runs, deep pile strands machines, and a mop that cannot lift high enough will damp " +
      "your rugs on a schedule. Every one of those is knowable before you spend, which is what " +
      "this page is for.",
    against:
      "A house with deep pile throughout, unless you buy vacuum-only and check the clearance. A " +
      "floor that habitually has cables, toys or shoes on it, unless you go up to proper " +
      "camera-based avoidance. Anyone expecting it to replace a real vacuum rather than reduce " +
      "how often you reach for one. And anyone buying in October — this category discounts hard " +
      "in November.",
  },

  /* Carries the #worth-it anchor from the hero's second CTA, and that placement
     is evidence-led: "Do the grill bots really work?" and "Does a Grillbot
     really work?" both appear verbatim in Google's People Also Ask across
     these SERPs. The doubt is the query. A skeptical Reddit thread — "glad I
     googled before impulse buying" — ranks in the top ten for the head term
     itself. */
  "grill-cleaning-robots": {
    id: "worth-it",
    eyebrow: "The verdict",
    title: "Do grill cleaning robots actually work?",
    intro:
      "Google asks this back at you on three separate searches in this category, in almost " +
      "those words, and a skeptical Reddit thread ranks on the first page for the category term " +
      "itself. So it deserves a straight answer.",
    verdict:
      "Yes, they work — on the top of the bars, on a warm grill, with the right brushes. Whether " +
      "that is worth the money depends entirely on whether you would otherwise clean it at all.",
    body:
      "The machine does what it says. Put it on a still-warm grate, set the timer, and it will " +
      "scrub the cooking surface unattended and do a decent job of it. The disappointment, when " +
      "it comes, is almost never that it failed — it is that people expected a clean barbecue " +
      "and got a clean grate. It does not touch the burners, the flavour bars, the grease tray " +
      "or the lid, and those are most of what makes an old grill unpleasant. Judged against " +
      "four minutes with a decent bristle-free brush, it is expensive and slower. Judged against " +
      "the grill you have not cleaned since August, it is transformative, because the machine " +
      "will actually do it and you will not. Be honest about which of those two people you are, " +
      "and the decision makes itself.",
    against:
      "Anyone who already cleans their grill after cooking — a brush is faster and reaches more. " +
      "Flat-top griddles and grates with widely spaced bars, which these cannot drive on. And " +
      "anyone buying it purely for bristle safety, because a bristle-free brush removes that " +
      "risk for a fraction of the price.",
  },

  /* Owns "are self cleaning litter boxes worth it" — 320/mo, KD 5, and a SERP
     with Forbes, NYTimes, Lifehacker, PetMD and classactcats.com on it. A
     section rather than a guide: it shares 5 domains with the head term, which
     is the one-URL threshold, and 320/mo does not support a second URL in a
     category this consolidated. */
  "self-cleaning-litter-boxes": {
    id: "worth-it",
    eyebrow: "The verdict",
    title: "Are self-cleaning litter boxes worth it?",
    intro:
      "The question this category attracts most after the safety one. The best self cleaning " +
      "litter box on the market is still the wrong purchase for some households, and the answer " +
      "turns on how many cats you have rather than on how good the machines are.",
    verdict:
      "For two or more adult cats, or for anyone who genuinely dreads the daily job, yes. For " +
      "one cat and a tolerable routine, the money is hard to justify.",
    body:
      "What you are buying is the removal of a small daily chore, replaced by a larger weekly " +
      "one. That trade is worth real money to some people and nothing at all to others, and no " +
      "specification tells you which you are. The case gets stronger fast with a second cat: " +
      "twice the waste means the box is unpleasant twice as quickly, so clearing it within " +
      "minutes rather than at the end of the day is worth roughly twice as much. It also gets " +
      "stronger if anyone in the house cannot easily bend to a tray. Against that, these are " +
      "expensive, they are large, they are one more thing with a motor and an app, and the " +
      "cheapest ones are not the bargain they look like once you have priced three years of the " +
      "only litter they accept. And a cat that refuses to use it turns the whole thing into a " +
      "large ornament, which is a risk no review can price for you.",
    against:
      "A kitten, or any cat below the machine's stated minimum weight. A nervous cat, or one " +
      "already having litter-box trouble — this is the wrong moment to change anything. A " +
      "single cat and a routine you do not mind. And anyone hoping it will stop litter being " +
      "tracked across the floor, because it will not.",
  },

  /* Owns "are companion robots worth it". The term returned no volume data at
     all — below Google Ads' reporting floor — but it has a real SERP with
     Forbes, IEEE Spectrum, a PMC paper on dementia care and several buying
     guides, and it appeared as a lead in the research. A section rather than a
     guide: it shares keyirobot.com and reddit with the hub head terms and
     there is not enough demand in this category to support a second URL. */
  "companion-robots": {
    id: "worth-it",
    eyebrow: "The verdict",
    title: "Are companion robots worth it?",
    intro:
      "The question the category attracts most, and the one where a comparison site is most " +
      "tempted to be dishonest in either direction.",
    verdict:
      "For a quiet house, a desk you sit at all day, or an older relative living alone, yes — " +
      "with your eyes open about the subscription. As a substitute for company, no.",
    body:
      "A robot pet does not know you. It does not remember your week, notice you are low, or " +
      "care whether you come home, and any listing implying otherwise is selling something it " +
      "cannot deliver. What it does do is make a room feel occupied. Something reacts when you " +
      "walk in, something responds when you speak, and for a lot of people living alone that " +
      "is worth real money — not as a cure for anything, but as the difference between silence " +
      "and not-silence. The evidence is strongest at the two ends: simple animal-like machines " +
      "for older people, where there is peer-reviewed research behind it, and expressive " +
      "moving robots for households that want something to share a room with. The weakest case " +
      "is the middle — a talking face on a desk, bought on novelty, subscribed to for a month " +
      "and shelved by the second.",
    against:
      "A busy household that already has a pet, a child, or people in it. Anyone buying one to " +
      "fix loneliness rather than to soften it. And anyone who would resent a monthly fee — " +
      "because in this category the fee is usually where the personality lives, and cancelling " +
      "it can leave you with an ornament.",
  },

  /* Owns "are pet cameras worth it", which appears verbatim in the People Also
     Ask box on "pet camera robot". Kept as a section rather than a guide for
     the same reason as above: 480/mo does not support two URLs. */
  "pet-camera-robots": {
    id: "worth-it",
    eyebrow: "The verdict",
    title: "Are pet camera robots worth it?",
    intro:
      "The honest answer is narrower than the category would like, and it turns entirely on " +
      "your animal rather than on the machines.",
    verdict:
      "For a dog with separation anxiety, or a pet that moves around a single floor all day, " +
      "yes. For most other households a fixed camera is the better buy.",
    body:
      "The argument for a robot over a fixed camera is that it goes to the animal. That is a " +
      "real advantage in exactly one situation: the pet moves, and it moves around a floor the " +
      "robot can cross. Then a moving pet camera turns \"I can't see him\" into \"there he is\", " +
      "and being able to drive over, talk and drop a treat gives you something to do about " +
      "distress instead of watching it on a phone. Against that, these are small machines with " +
      "small batteries that cannot climb a stair, struggle on carpet, and spend most of the day " +
      "on a dock. A wide-angle fixed camera costs a fraction as much, is always on, and never " +
      "gets stuck under a bed. If your pet sleeps in one spot — which most cats and plenty of " +
      "older dogs do — that is the better product and we would rather say so.",
    against:
      "A house with stairs where the pet follows you between floors. Thick carpet throughout. A " +
      "pet that sleeps in the same place all day. And anyone buying one as a security camera — " +
      "it is not on when you need it, it does not alert reliably, and an intruder can simply " +
      "pick it up.",
  },

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
      "which windows you mean. The best robot window cleaner for glass you cannot safely " +
      "reach is a different machine from the one that suits a patio door, and the money only " +
      "makes sense for one of the two.",
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
      "corners are where every one of them is weakest, pads and solution run out mid-job, " +
      "they are loud enough that you will leave the room, and on a frameless pane you are " +
      "trusting an edge sensor with a machine hanging above your drive. None of that is a " +
      "reason not to buy one. All of it is a reason to buy the right one and tie the tether " +
      "on properly.",
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
  /* From the People Also Ask boxes on the five SERPs that completed in run
     31094454463. One question appeared on two separate SERPs and is
     deliberately NOT answered here: "What is the AI robot for ADHD kids?",
     alongside "Is coding good for kids with ADHD?". There is real demand
     behind it and BotPlanet has no basis for answering a clinical question
     about a child's condition. Naming it as unanswered is the honest move; a
     confident paragraph would not be. */
  "educational-coding-robots": {
    id: "faqs",
    eyebrow: "Questions",
    title: "Coding robot FAQs",
    intro: "The questions people actually ask before buying, answered plainly.",
    items: [
      {
        q: "What is the best coding robot for kids?",
        a:
          "There is no single answer and the age band decides almost all of it. Under seven, a " +
          "screen-free robot programmed with buttons or cards. Eight to twelve, block coding " +
          "through an app, ideally one that later accepts typed code. Thirteen and up, a real " +
          "building kit and a real language. A page that names one winner for all ages has " +
          "skipped the only question that matters.",
      },
      {
        q: "What is a good coding robot for a seven-year-old?",
        a:
          "Seven sits exactly on the boundary, which makes it the hardest age to buy for. A " +
          "confident reader who already likes puzzles will get more out of a block-coding robot " +
          "and grow into it. A child who is still finding reading hard will do better with a " +
          "screen-free one and will not feel behind. If you are unsure, the screen-free option " +
          "is the safer mistake — it gets used, it is cheap, and it is easy to hand down.",
      },
      {
        q: "Do coding robots actually teach coding?",
        a:
          "They teach the foundations — sequence, loops, conditionals and debugging — and doing " +
          "those physically makes them stick better than a screen does. What they do not do is " +
          "leave a child able to write software, and no product here should imply otherwise. " +
          "Treat it as the thing that makes the idea of programming concrete, which is genuinely " +
          "valuable and is not the same as a skill.",
      },
      {
        q: "How long will a child actually use one?",
        a:
          "Longer than you fear for the good ones, shorter than you hope for the rest. The " +
          "predictor is what happens when the built-in challenges are finished: a robot with a " +
          "fixed set of activities is done in weeks, while one with an open building system, an " +
          "active community or a route into real code keeps going for years. Ask what month six " +
          "looks like before you buy.",
      },
      {
        q: "Does it need a tablet?",
        a:
          "Depends entirely which half of the category you are in. Screen-free robots are " +
          "programmed with buttons or cards and need nothing else, which is why they suit young " +
          "children. Everything with block coding needs a phone or tablet. In a house with one " +
          "shared device that is a real constraint — it decides whether the robot is picked up " +
          "on a whim or negotiated for.",
      },
      {
        q: "Is a robotics kit better than a finished robot?",
        a:
          "For an older child, usually yes. Building it is half the learning and a kit that can " +
          "be rebuilt into something else has a much longer life than a robot with a fixed " +
          "shape. For a younger child it is the wrong way round: a kit that takes an adult two " +
          "hours to assemble is an adult's project, and the child is watching.",
      },
    ],
  },

  "robot-vacuums": {
    id: "faqs",
    eyebrow: "Questions",
    title: "Robot vacuum FAQs",
    intro: "The questions people actually ask before buying, answered plainly.",
    items: [
      {
        q: "Do robot vacuums work on carpet?",
        a:
          "On low pile, yes, and well. On deep or shag pile it depends on clearance and wheel " +
          "torque, and the failure is getting stuck rather than cleaning badly. The bigger issue " +
          "is the mop: a vacuum-mop whose pads do not lift high enough will drag a wet pad across " +
          "your rug every run. If you have deep pile throughout, look at how high the pads lift, " +
          "or buy a vacuum-only machine and remove the problem.",
      },
      {
        q: "Which robot vacuum is worth buying?",
        a:
          "There is no single answer and any page giving you one has skipped the question that " +
          "matters — what is on your floors. Mostly hard floors point to a mopping machine with " +
          "good pad washing. A mix points to whichever lifts its pads highest. Deep pile points " +
          "to vacuum-only. Pets point to the anti-tangle brush before anything else. Start there " +
          "and the shortlist is three machines rather than forty.",
      },
      {
        q: "Is self-emptying worth the extra money?",
        a:
          "In a house with pets or long hair, yes — it is the clearest quality-of-life upgrade in " +
          "the category, moving bin duty from every couple of days to roughly every two months. " +
          "In a small flat with hard floors and no animals it is a convenience rather than a " +
          "transformation. Either way, price the bags: they are a consumable and often " +
          "proprietary.",
      },
      {
        q: "How well do they actually avoid things?",
        a:
          "Far better than three years ago and still not perfectly. Cheap machines bump and turn, " +
          "which means cables and socks end runs. Camera-based avoidance on the upper tiers " +
          "genuinely recognises common hazards, and that difference is most of the price gap " +
          "between a $250 machine and a $900 one. Treat every avoidance claim as a reduction in " +
          "risk, not a guarantee — particularly the one about pet accidents.",
      },
      {
        q: "How long do robot vacuums last?",
        a:
          "The machine generally outlives its battery, which is the part that ages with every " +
          "charge cycle. Brushes, filters and mop pads are consumables replaced through the " +
          "year. Before buying, check whether the battery is a serviceable part and whether the " +
          "maker still sells spares for models a few years old — that is the difference between " +
          "a repair and a replacement, and it varies enormously by brand.",
      },
      {
        q: "Do I still need a normal vacuum?",
        a:
          "Yes. Nothing here does stairs, and none of them does upholstery, car interiors or a " +
          "proper deep clean. What changes is how often you reach for the upright: for many " +
          "households it goes from weekly to monthly. Buying a robot to throw away your vacuum " +
          "is the single commonest way to be disappointed by one.",
      },
    ],
  },

  /* Taken from the People Also Ask boxes across run 31092662805. The "does it
     really work" question appeared on three separate SERPs in three phrasings,
     which is why it leads. */
  "grill-cleaning-robots": {
    id: "faqs",
    eyebrow: "Questions",
    title: "Grill cleaning robot FAQs",
    intro: "The questions people actually ask before buying, answered plainly.",
    items: [
      {
        q: "Do grill cleaning robots really work?",
        a:
          "Yes, within a narrower job than most buyers picture. On a still-warm grate with the " +
          "right brush heads, one of these will scrub the top of the bars unattended and leave " +
          "the cooking surface genuinely clean. What it will not do is clean the barbecue — the " +
          "burners, the grease tray, the sides and the lid are all untouched. Almost every " +
          "disappointed review is really about that gap rather than about the scrubbing.",
      },
      {
        q: "Can it damage my grates?",
        a:
          "Yes, if you use the wrong brush material, and this is the one mistake that is not " +
          "recoverable. Brass and steel heads strip the enamel off porcelain-coated grates, and " +
          "the bare cast iron underneath then rusts. Nylon is the safe choice for coated grates. " +
          "If you are not certain what yours are made of, assume porcelain — it is both the " +
          "commonest and the least forgiving.",
      },
      {
        q: "Does it work on a hot grill?",
        a:
          "Warm, not hot. Grease softens with heat, so a warm grate cleans far better than a " +
          "cold one, and running the machine straight after cooking is the sensible habit. But " +
          "every model has a temperature ceiling and nylon heads have the lowest of the lot — " +
          "run them on a properly hot grill and they deform in a single cycle. Check the stated " +
          "maximum and wait for it.",
      },
      {
        q: "Is it safer than a wire brush?",
        a:
          "On the specific risk of loose bristles in food, yes — the heads are held in a housing " +
          "rather than a flexing hand-held head, and that shedding is a documented and serious " +
          "injury. But it is not the only way to remove that risk. A bristle-free scraper or a " +
          "coil brush does the same thing for a fifteenth of the price. Buy the robot because " +
          "you want the job done for you, not because you have been told it is the only safe " +
          "option.",
      },
      {
        q: "Will it fit my barbecue?",
        a:
          "Usually, if the cooking surface is broadly flat and the bars are close enough " +
          "together to drive on. Very widely spaced bars, heavily curved grates and flat-top " +
          "griddles are all awkward to unsuitable — a griddle in particular is the wrong shape " +
          "for a machine designed to sit on bars. Measure the gap between your bars before you " +
          "buy anything.",
      },
      {
        q: "How long do the brush heads last?",
        a:
          "They are consumables and they are the safety-critical part, so treat the " +
          "manufacturer's replacement schedule as a floor rather than a suggestion. A worn head " +
          "on a robot carries the same shedding risk as a worn brush in your hand, and it is " +
          "easier to miss because the machine works out of sight. Price a year of heads at your " +
          "cooking frequency before buying — it is not trivial against the cost of the machine.",
      },
    ],
  },

  /* Every question below is one Google actually surfaces, taken from the
     People Also Ask boxes across the 23 SERPs in run 31090590604 and ranked by
     how often each appeared:

       do vets recommend these        6 appearances  (by a distance the loudest)
       disadvantages / downsides      5
       is it worth it                 4
       what litter can I use          3
       is there a cheaper alternative 2
       can a kitten use one           2

     Six appearances for the vet question is the strongest single signal in any
     BotPlanet research run so far, and it is answered first. */
  "self-cleaning-litter-boxes": {
    id: "faqs",
    eyebrow: "Questions",
    title: "Self-cleaning litter box FAQs",
    intro:
      "The questions people actually ask before buying, answered plainly.",
    items: [
      {
        q: "Do vets recommend self-cleaning litter boxes?",
        a:
          "This is the most-asked question in the category by a distance — it appeared in " +
          "Google's People Also Ask box on six of the twenty-three searches we ran. The honest " +
          "answer is that there is no single veterinary position for or against. What comes up " +
          "consistently in veterinary writing is narrower and more useful: keep to one box per " +
          "cat plus one whether they are automatic or not; do not switch a cat that is already " +
          "having litter-box trouble; and be aware that a box which clears itself also clears " +
          "the evidence you would otherwise notice, which matters because changes in urine " +
          "output are an early warning sign. That last point is why per-cat weight and visit " +
          "logging is a genuinely useful feature rather than a gimmick.",
      },
      {
        q: "What are the disadvantages of a self-cleaning litter box?",
        a:
          "Five, honestly. They are expensive. They are big, and they need a socket, so where " +
          "the box goes is no longer entirely your choice. You still empty a drawer, so the job " +
          "becomes weekly rather than disappearing. Some only take the maker's own litter, which " +
          "is a running cost most buyers do not price in. And a cat that is frightened of the " +
          "mechanism will simply stop using it, which is a worse problem than the one you were " +
          "solving.",
      },
      {
        q: "Can a kitten use a self-cleaning litter box?",
        a:
          "Usually not safely, and this is the clearest rule-out in the category. These machines " +
          "detect their occupant by weight, and below the sensor's minimum the box does not know " +
          "the cat is there. Most manufacturers state a minimum weight or age; where they do, we " +
          "quote it on the product page, and where they refuse to publish one we say that " +
          "instead. Until the kitten is grown, an ordinary open tray is the right answer.",
      },
      {
        q: "Can I use regular cat litter in a self-cleaning litter box?",
        a:
          "It depends entirely on which machine you bought, and it is worth knowing before you " +
          "buy rather than after. Most take ordinary clumping clay litter from any shop. A " +
          "minority take only the maker's own crystal trays, which is a subscription in all but " +
          "name. Even among the ordinary ones, the litter has to genuinely clump — cheap " +
          "non-clumping clay turns to sludge and jams the rake, and that is the single most " +
          "common reason one of these stops working.",
      },
      {
        q: "Is there a cheaper alternative to the well-known brands?",
        a:
          "Yes, and the gap has narrowed a lot. The category's best-known name is also its most " +
          "expensive, and it earns some of that in chamber size, build and warranty. But there " +
          "is now a real middle market doing the same job — sift, seal, notify — for " +
          "considerably less. The honest test is not the price but the three-year cost: check " +
          "what litter it takes, what the filters cost and how long the warranty runs, then " +
          "compare.",
      },
      {
        q: "How many cats can share one automatic litter box?",
        a:
          "Mechanically, most are rated for two or three. Practically, the veterinary guidance " +
          "of one box per cat plus one does not stop applying because the box empties itself. " +
          "An automatic box handles the waste from multiple cats well; what it cannot do is be " +
          "in two places at once, and cats queueing for a single box is how litter-box problems " +
          "begin. Two cats, one good machine is fine. Three cats and one machine is optimistic.",
      },
    ],
  },

  /* Every question below is one Google actually surfaces, taken verbatim or
     near-verbatim from the People Also Ask boxes across the 23 SERPs in run
     31081889310. The subscription question is here because it appeared on
     THREE separate product SERPs — Eilik, EMO and Miko 3 — which is the
     clearest signal in the whole run about what buyers are afraid of.

     These items generate the FAQPage schema, so the structured data cannot
     claim a question the page does not show. */
  "companion-robots": {
    id: "faqs",
    eyebrow: "Questions",
    title: "Companion robot FAQs",
    intro:
      "The questions people actually ask before buying, answered plainly. Anything needing a " +
      "longer answer gets its own page rather than a paragraph here.",
    items: [
      {
        q: "Do companion robots need a subscription?",
        a:
          "Many of the best-known ones do, and it is the question Google surfaces on three " +
          "separate products in this category. The pattern is consistent: the hardware price is " +
          "the headline, and conversation, cloud voice and children's learning content sit " +
          "behind a monthly fee. Simpler machines — the ones that emote and react rather than " +
          "talk — usually have no account at all. Check what the robot still does if you stop " +
          "paying, because reduced personality and complete silence are very different outcomes.",
      },
      {
        q: "What happens if the company that made it shuts down?",
        a:
          "It depends entirely on whether the personality lives on the device or in the cloud, " +
          "and this is not a hypothetical worry in this category. Several well-known desktop " +
          "and children's companion robots still attract tens of thousands of searches a month " +
          "while being difficult or impossible to buy new. A machine that works offline keeps " +
          "working. A machine that is effectively a speaker for a cloud service stops. Before " +
          "you buy, unplug the router in the shop or ask the maker directly.",
      },
      {
        q: "How much does a companion robot cost?",
        a:
          "A wide range, and unusually the money buys behaviour rather than capability. The " +
          "cheapest desk machines are genuinely charming and have no account attached. Real " +
          "conversation costs more and usually adds a subscription. Machines that move around " +
          "the room cost more again, and that is the step most worth paying for if you want " +
          "something you keep rather than shelve. Always add the monthly fee to the sticker " +
          "price before comparing.",
      },
      {
        q: "Do robot pets help with loneliness?",
        a:
          "There is real evidence in one specific case: simple, animal-like robotic pets used " +
          "by older adults, including people living with dementia. That work is peer-reviewed " +
          "and the findings are positive, which is why this is the one part of the category we " +
          "cite research for. Outside that group the honest answer is that a companion robot " +
          "makes a room feel occupied rather than curing anything, and we are not going to " +
          "dress that up as therapy.",
      },
      {
        q: "What is the best AI companion robot?",
        a:
          "There is no single answer, and any page giving you one has skipped the only question " +
          "that matters — who it is for. An adult wanting something on a desk, a parent buying " +
          "for a child, and someone choosing for an older relative are three different " +
          "purchases with almost no overlap. Start with who will live with it and the shortlist " +
          "narrows to two or three before you compare anything.",
      },
      {
        q: "Are companion robots always listening?",
        a:
          "The ones you talk to are, in the same way a smart speaker is — they wait for a wake " +
          "word, which means the microphone is live. What differs is where the audio goes. Some " +
          "process it on the device, some send it to a server abroad. Look for a hardware " +
          "microphone switch rather than a software one, and check whether the maker publishes " +
          "a retention policy at all. Many do not, and that silence is itself an answer.",
      },
    ],
  },

  "pet-camera-robots": {
    id: "faqs",
    eyebrow: "Questions",
    title: "Pet camera robot FAQs",
    intro:
      "The questions people actually ask before buying, answered plainly.",
    items: [
      {
        q: "Are pet cameras worth it?",
        a:
          "A camera of some kind, usually yes — knowing rather than wondering is worth the " +
          "money. A robot one specifically, only if your pet moves around and does so on a " +
          "single floor. If the dog sleeps in the same spot all day, a fixed camera pointed at " +
          "that spot does the same job for a fraction of the price and never gets stuck under " +
          "the sofa.",
      },
      {
        q: "Can a pet camera robot climb stairs?",
        a:
          "No. Every one of these on the US market is a small wheeled machine and none of them " +
          "climbs. Whichever floor you leave it on is the floor it covers. In a two-storey " +
          "house that means choosing the floor your pet actually spends the day on, or buying " +
          "two robots and two docks — and it is the single most common reason people are " +
          "disappointed by one.",
      },
      {
        q: "What are the downsides of owning a pet robot?",
        a:
          "Battery life measured in tens of minutes rather than hours, so it lives on its dock " +
          "for most of the day. Carpet and rug edges strand it. It cannot manage stairs or a " +
          "closed door. Some pets are frightened of it and simply leave the room. And it is one " +
          "more internet-connected camera in your house to keep secure. None of that makes it a " +
          "bad product — all of it is worth knowing before you spend.",
      },
      {
        q: "Do pet camera robots work on carpet?",
        a:
          "On low pile, generally yes. On deep pile, often badly. Wheel diameter is what decides " +
          "it and it is usually buried in the specifications rather than on the listing. The " +
          "bigger practical problem is rug edges, which beach these machines routinely — and a " +
          "robot that cannot get back to its dock across the living room is a robot you end up " +
          "charging by hand.",
      },
      {
        q: "Are pet cameras hackable?",
        a:
          "Any internet-connected camera can be, and one that drives around your house is worth " +
          "a moment's thought. The practical protections are ordinary: a unique password, " +
          "two-factor authentication on the account, and firmware that actually gets updated. " +
          "Check where the video is stored and which country the company answers to, and prefer " +
          "a model that offers local recording to a card rather than cloud-only.",
      },
      {
        q: "Can I use one as a home security camera?",
        a:
          "Not really, and we would rather say so. It is not running when you need it, it does " +
          "not alert reliably, it cannot see a room with the door shut, and an intruder can pick " +
          "it up and put it in a bag. As a way of checking whether you left the hob on it is " +
          "genuinely useful. As a security system it is the wrong product, and a fixed camera " +
          "costs less and does that job properly.",
      },
    ],
  },

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
      "longer answer gets its own guide rather than a paragraph here, and our full window " +
      "cleaning robot reviews sit one level beneath this page — one per machine, with the " +
      "maker's published figures and what we could not establish.",
    items: [
      /* FIRST, AND IT IS THE QUESTION THE CATEGORY IS ACTUALLY SEARCHED WITH.
         "best window cleaning robot" is 1,300/mo at KD 3 and this page has
         always been the page that carries it — the register row above has said
         so since 5 August 2026, because the two terms share six of the top ten
         results. A second URL was built for it anyway on 7 August and folded
         back in here on 12 August. This answer is what came back with it. */
      {
        q: "What is the best window cleaning robot?",
        a:
          "For most homes the ECOVACS WINBOT W2 PRO, and it is not the flagship: it carries the " +
          "same navigation, nozzles, tank and cleaning modes as the machine above it, and what " +
          "the extra money buys higher up the range is a battery station weighing more than " +
          "three times the robot. If the windows you actually want cleaned have no socket near " +
          "them, the W2 PRO Omni is the only machine here that solves it. For sloped or roof " +
          "glass it is the HUTT S55 Pro, the only one that claims the capability at all. If " +
          "your glass is frameless, check the maker claims it before anything else — that " +
          "rules machines out before any preference does. Two we hold and do not recommend: " +
          "the WINBOT W1 PRO, overtaken inside its own range by the cheaper Mini, and the " +
          "HOBOT 298, whose maker publishes almost nothing measurable about it.",
      },
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
          "Only if the window opens inwards far enough for you to place the machine on the " +
          "outer face and attach the safety rope — these clean one side of the glass at a " +
          "time, and no machine we hold works on both sides at once. Where the window does " +
          "open, this is the case for owning one: the robot works the outside pane while you " +
          "stay inside. Tether it, check the anchor, and read the power-cut hold before you " +
          "let it out of the window.",
      },
      {
        q: "Are they loud?",
        a:
          "Closer to a vacuum cleaner than to an appliance you can ignore in the next room. It " +
          "is a suction pump holding a machine against glass, and there is no quiet way to do " +
          "that. Plan to be out of the room rather than working beside it.",
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
  /**
   * The label used inside an article — a review or a guide — where the panel
   * sits at the foot of two thousand words.
   *
   * WHY A SECOND LABEL AT ALL. Every category used the same "Start 30-second
   * match" everywhere, which put eight to thirteen links on identical anchor
   * text into each matcher: the only thing a crawler learned from all of them
   * was that something takes thirty seconds. Naming the category is better
   * copy on both surfaces and gives the two contexts different words, which is
   * what body links look like when a person writes them.
   */
  ctaLabelInArticle?: string;
  note?: string;
  image?: HeroImage;
}

export const BOTMATCH_CTA: Record<string, BotMatchCtaContent> = {
  /* THE PANELS BELOW ARE WRITTEN AND WAITING, NOT SWITCHED OFF BY HAND.
     Changed 6 August 2026.

     "A matcher with no products is not advertised" — PRE-BUILD-PROCESS.md
     Stage 5b — used to be enforced by leaving the record out of this file.
     That worked and it was fragile: the copy lived in a comment, restoring it
     was a rewrite rather than a flip, and it depended on somebody remembering
     months later. Lawn sat like that for exactly that reason.

     The gate now lives where the truth is. The category page reads its own
     published-product count and renders this panel only when there is
     something to recommend; the review page renders it unconditionally,
     because a review existing means a product exists. So the copy is written,
     reviewed and version-controlled today, and the panel turns itself on the
     moment the first product lands — no second deploy, nothing to remember.

     Restored for lawn at the same time, whose question set landed on 6 August
     and whose panel had been waiting in a comment ever since. */
  "educational-coding-robots": {
    headline: "Find their first coding robot",
    body:
      "Tell us how old they are, whether a tablet is available and whether they have actually " +
      "asked for one. In about 30 seconds we will match you with the right coding robot — and " +
      "say when the cheap one is the better buy.",
    points: ["About 30 seconds", "Five plain questions", "No account needed"],
    ctaLabel: "Start the coding-robot matcher",
    ctaLabelInArticle: "Match me with a coding robot",
    note: "Free. We email the result and keep it on a page you can return to.",
  },
  "robot-vacuums": {
    headline: "Find your robot vacuum",
    body:
      "Tell us what is on your floors, whether there is an animal in the house and how tidy you " +
      "keep it. In about 30 seconds we will match you with the right robot vacuum — and tell you " +
      "which ones to rule out.",
    points: ["About 30 seconds", "Five plain questions", "No account needed"],
    ctaLabel: "Start the vacuum matcher",
    ctaLabelInArticle: "Match me with a robot vacuum",
    note: "Free. We email the result and keep it on a page you can return to.",
  },
  "grill-cleaning-robots": {
    headline: "Find your grill cleaner",
    body:
      "Tell us what your grates are made of, how wide the bars are and how often you cook. In " +
      "about 30 seconds we will match you with the right machine — or tell you a brush is the " +
      "better buy.",
    points: ["About 30 seconds", "Five plain questions", "No account needed"],
    ctaLabel: "Start the grill-cleaner matcher",
    ctaLabelInArticle: "Match me with a grill cleaner",
    note: "Free. We email the result and keep it on a page you can return to.",
  },
  "self-cleaning-litter-boxes": {
    headline: "Find your litter box",
    body:
      "Tell us how big your cat is, how many you have and whether you will buy the maker's own " +
      "litter. In about 30 seconds we will match you with the right automatic litter box — and " +
      "tell you plainly if your cat is too small for one.",
    points: ["About 30 seconds", "Five plain questions", "No account needed"],
    ctaLabel: "Start the litter-box matcher",
    ctaLabelInArticle: "Match me with a litter box",
    note: "Free. We email the result and keep it on a page you can return to.",
  },
  "companion-robots": {
    headline: "Find your robot pet",
    body:
      "Tell us who it is for, whether a monthly fee is acceptable, and whether you want " +
      "something that moves. In about 30 seconds we will match you with the right companion " +
      "robot — and tell you which ones to rule out.",
    points: ["About 30 seconds", "Five plain questions", "No account needed"],
    ctaLabel: "Start the companion matcher",
    ctaLabelInArticle: "Match me with a companion robot",
    note: "Free. We email the result and keep it on a page you can return to.",
  },
  "pet-camera-robots": {
    headline: "Find your pet camera robot",
    body:
      "Tell us whether there are stairs between the rooms that matter, what is on your floors " +
      "and what you actually need to do from your phone. In about 30 seconds we will match you " +
      "with the right robot — or tell you a fixed camera is the better buy.",
    points: ["About 30 seconds", "Five plain questions", "No account needed"],
    ctaLabel: "Start the pet-camera matcher",
    ctaLabelInArticle: "Match me with a pet camera robot",
    note: "Free. We email the result and keep it on a page you can return to.",
  },
  "robotic-lawn-mowers": {
    headline: "Find your robot mower",
    body:
      "Tell us the lawn size, the slope and whether it sits under trees. In about 30 seconds we " +
      "will match you with the right robot mower — and tell you which ones to rule out.",
    points: ["About 30 seconds", "Four plain questions", "No account needed"],
    ctaLabel: "Start the mower matcher",
    ctaLabelInArticle: "Match me with a robot mower",
    image: {
      src: "/media/lawn-category/feature-desktop.webp",
      alt:
        "A robot lawn mower on a striped lawn, shown beside the BotMatch questions that narrow the choice.",
      focal: "72% center",
    },
    note: "Free. We email the result and keep it on a page you can return to.",
  },
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
    ctaLabel: "Start the window matcher",
    ctaLabelInArticle: "Match me with a window robot",
    image: {
      src: "/media/window-category/feature-desktop.webp",
      alt:
        "A window cleaning robot on glass, shown beside the BotMatch questions that narrow the choice.",
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
    ctaLabel: "Start the pool matcher",
    ctaLabelInArticle: "Match me with a pool robot",
    image: {
      src: "/media/pool-category/feature-desktop.webp",
      alt:
        "A robotic pool cleaner working a lit pool, shown beside the BotMatch questions that narrow the choice.",
      focal: "78% center",
    },
    note: "Free. We email your result and save it to a page you can come back to.",
  },
};

export function botMatchCtaFor(slug: string | undefined): BotMatchCtaContent | undefined {
  return slug ? BOTMATCH_CTA[slug] : undefined;
}
