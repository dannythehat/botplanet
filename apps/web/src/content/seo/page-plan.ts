/* ============================================================
   THE PAGE PLAN — every URL BotPlanet will ever have, planned
   before it is built.

   WHY THIS FILE EXISTS, stated plainly because it exists because
   of a failure.

   On 6 August 2026 fifteen pages were written and pushed with no
   build pack behind any of them: eleven window reviews, two
   best-of pages, two guides. OWNER-LOCKED BLUEPRINT v1.0 §7
   requires a page blueprint — section order, exact images
   assigned to each section, schema, products — approved by the
   owner BEFORE a builder starts. None existed, so the builder
   invented the specification while writing, which is exactly
   what §9 forbids. Eleven of those pages shipped with no images
   at all, which §4 and §5 prohibit outright.

   The root cause was not carelessness. It was that a page could
   be built without a plan, because nothing stopped it. Notes in
   a document do not stop it. A test does.

   SO: every route in the registry must have an entry here, and
   page-plan.test.ts fails the build if one does not. A page
   cannot reach `built` without declaring its keywords, its
   products, its internal links, its images and its schema. The
   gate is mechanical and there is no way round it that does not
   involve deleting the test, which is a visible act rather than
   a silent omission.

   THIS FILE IS ALSO THE THING THE OWNER READS. It is mirrored to
   Notion by scripts/sync-page-plan.mjs so any page can be opened
   and its full plan seen — keywords, products, links, images —
   without reading code.

   CANNIBALISATION IS ENFORCED HERE, not remembered. Two pages
   may not claim the same primary term. A ceded term must name
   the page that actually owns it, and that page must actually
   own it. Both are checked.
   ============================================================ */

/** Where a page is in the pipeline. Only `built` may be live. */
export type PlanStatus =
  /** Named by research as worth having. No keywords assigned yet. */
  | "planned"
  /** Keywords assigned from a real run. Products and images not settled. */
  | "researched"
  /** Complete: keywords, products, links, images, schema. Buildable. */
  | "ready"
  /** Built and live. */
  | "built";

export type PageType =
  | "hub"
  | "review"
  | "best-of"
  | "guide"
  | "compare"
  | "botmatch"
  | "core";

export interface PlanKeyword {
  term: string;
  /** US monthly volume from the named research run. 0 means measured as nil. */
  volume: number;
  difficulty: number;
}

/** An image the page cannot be built without. */
export interface ImageSlot {
  /** Where it goes, e.g. "hero", "decision-card-1", "figure-2". */
  slot: string;
  /** What it must show. This is the brief the artwork is made from. */
  shows: string;
  /** Supplied and registered in content/media/assets.ts? */
  supplied: boolean;
}

export interface PagePlan {
  /** Canonical path. Unique across the registry. */
  path: string;
  category: string;
  type: PageType;
  status: PlanStatus;
  /** What the searcher actually wants. One sentence. */
  intent: string;
  /** The one term this URL owns. No other page may claim it. */
  primary: PlanKeyword;
  secondary: PlanKeyword[];
  /** Terms deliberately NOT taken here, and the page of ours that owns them. */
  ceded: { term: string; toPath: string; why: string }[];
  /**
   * Terms refused outright — not taken here and not given to any page of ours.
   * A distinction the keyword register does not draw and should: "ceded to
   * nowhere" is how a brand term with ten times our volume gets quietly
   * re-opened six weeks later by somebody assuming it must live somewhere.
   */
  refused?: { term: string; volume: number; why: string }[];
  /** Product slugs this page recommends or reviews. */
  products: string[];
  /** Why the product list is empty, where it is. */
  productsNote?: string;
  /** Internal links this page must carry, by destination path. */
  linksOut: string[];
  images: ImageSlot[];
  /** Schema types the page emits. */
  schema: string[];
  /** Which research run the figures came from. */
  research: string;
  /** Why this page exists at all — the SERP evidence, in one or two lines. */
  evidence: string;
}

/* ------------------------------------------------------------------
   POOL — the only category with a complete, built page set.
   Research: run 30691679570, 1 August 2026, $0.2154.
   Map: docs/seo/pool-research-findings.md
   ------------------------------------------------------------------ */

const POOL: PagePlan[] = [
  {
    path: "/robots/robotic-pool-cleaners/",
    category: "robotic-pool-cleaners",
    type: "hub",
    status: "built",
    intent: "Understand the category and narrow to a shortlist for my own pool.",
    primary: { term: "robotic pool cleaner", volume: 40500, difficulty: 14 },
    secondary: [
      { term: "pool cleaning robot", volume: 40500, difficulty: 14 },
      { term: "robotic pool vacuum", volume: 0, difficulty: 0 },
      { term: "inground robotic pool cleaner", volume: 0, difficulty: 0 },
      { term: "wall climbing robotic pool cleaner", volume: 0, difficulty: 0 },
    ],
    ceded: [
      { term: "cordless robotic pool cleaner", toPath: "/best-robots/robotic-pool-cleaners/cordless/", why: "22,200/mo at KD 0 with its own list SERP." },
      { term: "best robotic pool cleaner", toPath: "/best-robots/robotic-pool-cleaners/", why: "A ranked best-of SERP, not a hub SERP." },
      { term: "are robotic pool cleaners worth it", toPath: "/guides/are-robotic-pool-cleaners-worth-it/", why: "The guide takes the question and the PAA slot behind it." },
    ],
    products: ["aiper-scuba-s1", "wybot-c1", "dolphin-nautilus-cc-plus", "aiper-scuba-x1-pro-max", "aiper-seagull-se", "dolphin-proteus-dx4-plus", "aiper-scuba-v3-ai-vision", "polaris-freedom", "beatbot-aquasense-2-ultra", "bublue-bubot-800p", "betta-se-plus"],
    linksOut: ["/best-robots/robotic-pool-cleaners/", "/compare/robotic-pool-cleaners/", "/botmatch/robotic-pool-cleaners/"],
    images: [
      { slot: "hero", shows: "A robotic pool cleaner in a lit in-ground pool at dusk", supplied: true },
      { slot: "decision-card-1", shows: "In-ground pool", supplied: true },
      { slot: "decision-card-2", shows: "Above-ground pool", supplied: true },
      { slot: "decision-card-3", shows: "Small, large and freeform pools", supplied: true },
      { slot: "matrix-1", shows: "Leaves and larger debris", supplied: true },
      { slot: "matrix-2", shows: "Fine dirt, sand and silt", supplied: true },
      { slot: "matrix-3", shows: "Algae and stuck-on dirt", supplied: true },
    ],
    schema: ["CollectionPage", "ItemList", "FAQPage", "ImageObject", "BreadcrumbList"],
    research: "30691679570 · 2026-08-01",
    evidence: "40,500/mo cluster; Google groups robotic/robot/pool cleaning robot into one.",
  },
  {
    path: "/best-robots/robotic-pool-cleaners/",
    category: "robotic-pool-cleaners",
    type: "best-of",
    status: "built",
    intent: "Show me a ranked shortlist with the reasoning.",
    primary: { term: "best robotic pool cleaner", volume: 6600, difficulty: 13 },
    secondary: [
      { term: "best robot pool cleaner", volume: 6600, difficulty: 13 },
      { term: "best robotic pool cleaner for inground pools", volume: 6600, difficulty: 13 },
    ],
    ceded: [
      { term: "cordless robotic pool cleaner", toPath: "/best-robots/robotic-pool-cleaners/cordless/", why: "Three times this cluster at a fraction of the difficulty." },
      { term: "robotic pool cleaner", toPath: "/robots/robotic-pool-cleaners/", why: "Head term belongs to the hub." },
    ],
    products: ["aiper-scuba-s1", "wybot-c1", "dolphin-nautilus-cc-plus", "aiper-scuba-x1-pro-max", "aiper-seagull-se", "dolphin-proteus-dx4-plus", "aiper-scuba-v3-ai-vision", "polaris-freedom", "beatbot-aquasense-2-ultra"],
    linksOut: ["/robots/robotic-pool-cleaners/", "/best-robots/robotic-pool-cleaners/cordless/", "/botmatch/robotic-pool-cleaners/"],
    images: [
      { slot: "hero", shows: "Ranked pool cleaners, editorial treatment", supplied: false },
    ],
    schema: ["Article", "ItemList", "FAQPage", "BreadcrumbList"],
    research: "30691679570 · 2026-08-01",
    evidence: "Google groups best/top-rated/inground into one 6,600 cluster; SERP is list content.",
  },
  {
    path: "/best-robots/robotic-pool-cleaners/cordless/",
    category: "robotic-pool-cleaners",
    type: "best-of",
    status: "built",
    intent: "I have decided on cordless; rank them for me.",
    primary: { term: "cordless robotic pool cleaner", volume: 22200, difficulty: 0 },
    secondary: [{ term: "best cordless robotic pool cleaner", volume: 22200, difficulty: 0 }],
    ceded: [
      { term: "best robotic pool cleaner", toPath: "/best-robots/robotic-pool-cleaners/", why: "The parent carries the general ranking including corded machines." },
      { term: "robotic pool cleaner", toPath: "/robots/robotic-pool-cleaners/", why: "Head term belongs to the hub." },
    ],
    products: ["aiper-scuba-s1", "wybot-c1", "aiper-seagull-se", "polaris-freedom", "aiper-scuba-v3-ai-vision", "aiper-scuba-x1-pro-max", "beatbot-aquasense-2-ultra"],
    linksOut: ["/robots/robotic-pool-cleaners/", "/best-robots/robotic-pool-cleaners/", "/compare/robotic-pool-cleaners/"],
    images: [{ slot: "hero", shows: "Cordless cleaner lifting clear of water, no cable in frame", supplied: false }],
    schema: ["Article", "ItemList", "FAQPage", "BreadcrumbList"],
    research: "30691679570 · 2026-08-01",
    evidence: "22,200/mo at KD 0 — biggest wedge in the dataset. SERP is list content in its own right.",
  },
  {
    path: "/compare/robotic-pool-cleaners/",
    category: "robotic-pool-cleaners",
    type: "compare",
    status: "built",
    intent: "Which brand is better — Aiper or Dolphin?",
    primary: { term: "aiper vs dolphin", volume: 110, difficulty: 0 },
    secondary: [
      { term: "dolphin vs polaris", volume: 30, difficulty: 0 },
      { term: "robotic pool cleaner comparison", volume: 0, difficulty: 0 },
    ],
    ceded: [
      { term: "best robotic pool cleaner", toPath: "/best-robots/robotic-pool-cleaners/", why: "'Which brand' and 'which one' are different queries with different SERPs." },
    ],
    products: ["aiper-scuba-s1", "dolphin-nautilus-cc-plus", "polaris-freedom", "dolphin-proteus-dx4-plus", "beatbot-aquasense-2-ultra", "aiper-scuba-x1-pro-max", "wybot-c1", "betta-se-plus"],
    linksOut: ["/robots/robotic-pool-cleaners/", "/best-robots/robotic-pool-cleaners/", "/botmatch/robotic-pool-cleaners/"],
    images: [{ slot: "hero", shows: "Two machines head to head, brand-neutral", supplied: false }],
    schema: ["Article", "ItemList", "FAQPage", "BreadcrumbList"],
    research: "30691679570 · 2026-08-01",
    evidence: "Pair phrases have no measurable volume; one hub with per-pair sections, not nine pages.",
  },
  {
    path: "/guides/are-robotic-pool-cleaners-worth-it/",
    category: "robotic-pool-cleaners",
    type: "guide",
    status: "built",
    intent: "Should I buy one at all?",
    primary: { term: "are robotic pool cleaners worth it", volume: 40, difficulty: 0 },
    secondary: [{ term: "is a robot pool cleaner worth it", volume: 0, difficulty: 0 }],
    ceded: [
      { term: "best robotic pool cleaner", toPath: "/best-robots/robotic-pool-cleaners/", why: "A guide that ranks products is a best-of wearing a hat." },
    ],
    products: [],
    productsNote: "A guide recommends nothing directly; it hands the reader to the best-of.",
    linksOut: ["/robots/robotic-pool-cleaners/", "/best-robots/robotic-pool-cleaners/", "/best-robots/robotic-pool-cleaners/cordless/"],
    images: [{ slot: "hero", shows: "A clean pool with a robot at rest — the 'was it worth it' image", supplied: false }],
    schema: ["Article", "FAQPage", "BreadcrumbList"],
    research: "30691679570 · 2026-08-01",
    evidence: "40/mo exact, but the #1 People Also Ask on the 40,500 head term.",
  },
  {
    path: "/guides/robotic-pool-cleaners/",
    category: "robotic-pool-cleaners",
    type: "guide",
    status: "built",
    intent: "Browse the explanations for this category.",
    primary: { term: "robotic pool cleaner guides", volume: 0, difficulty: 0 },
    secondary: [],
    ceded: [],
    products: [],
    productsNote: "An index page. It lists guides and recommends nothing.",
    linksOut: ["/best-robots/robotic-pool-cleaners/", "/best-robots/robotic-pool-cleaners/cordless/", "/botmatch/robotic-pool-cleaners/"],
    images: [],
    schema: ["WebPage", "ItemList", "BreadcrumbList"],
    research: "n/a — index page, no keyword target",
    evidence: "Not a research ruling. It exists so the guides that do exist are reachable.",
  },
  {
    path: "/botmatch/robotic-pool-cleaners/",
    category: "robotic-pool-cleaners",
    type: "botmatch",
    status: "built",
    intent: "Answer questions and be told which one fits my pool.",
    primary: { term: "which robotic pool cleaner should i buy", volume: 10, difficulty: 52 },
    secondary: [],
    ceded: [
      { term: "best robotic pool cleaner", toPath: "/best-robots/robotic-pool-cleaners/", why: "The matcher is a conversion tool and competes for nothing. It renders noindex." },
    ],
    products: [],
    productsNote: "Scores the whole category catalogue at runtime rather than listing a fixed set.",
    linksOut: ["/robots/robotic-pool-cleaners/"],
    images: [],
    schema: [],
    research: "30691679570 · 2026-08-01",
    evidence: "10/mo at KD 52 with a best-of SERP. Deliberately not an SEO target.",
  },
];

/* Pool reviews. Model clusters were the cheapest real traffic in the whole
   1 August set — KD 0 almost everywhere. Every one is built. */
const POOL_REVIEWS: PagePlan[] = (
  /* The model term each review targets, matching the keyword register exactly
     — the register is asserted against the page's real rendered copy, so it is
     the authority when the two could differ. `cluster` is the model-name
     volume from the 1 August run; the register records the review pages at 0
     because that run measured category clusters rather than model names, and
     that difference is recorded rather than smoothed over. */
  [
    ["dolphin-nautilus-cc-plus", "dolphin nautilus cc plus", 5400],
    ["polaris-freedom", "polaris freedom", 260],
    ["betta-se-plus", "betta se plus", 3600],
    ["dolphin-proteus-dx4-plus", "dolphin proteus dx4 plus", 390],
    ["aiper-scuba-v3-ai-vision", "aiper scuba v3", 1000],
    ["aiper-scuba-x1-pro-max", "aiper scuba x1 pro max", 0],
    ["aiper-seagull-se", "aiper seagull se", 0],
    ["aiper-scuba-s1", "aiper scuba s1", 0],
    ["bublue-bubot-800p", "bublue bubot 800p", 0],
    ["wybot-c1", "wybot c1", 0],
    ["beatbot-aquasense-2-ultra", "beatbot aquasense 2 ultra", 0],
  ] as const
).map(([slug, term, volume]) => ({
  path: `/robots/robotic-pool-cleaners/${slug}/`,
  category: "robotic-pool-cleaners",
  type: "review" as const,
  status: "built" as const,
  intent: `Decide whether this specific machine suits my pool.`,
  primary: { term: `${term} review`, volume, difficulty: 0 },
  secondary: [{ term, volume, difficulty: 0 }],
  ceded: [
    { term: "robotic pool cleaner", toPath: "/robots/robotic-pool-cleaners/", why: "The head term belongs to the hub; one review cannot win it and should not split us." },
    { term: "best robotic pool cleaner", toPath: "/best-robots/robotic-pool-cleaners/", why: "A comparison SERP. One review is not a best-of." },
  ],
  products: [slug],
  linksOut: ["/robots/robotic-pool-cleaners/", "/compare/robotic-pool-cleaners/", "/botmatch/robotic-pool-cleaners/"],
  images: [
    { slot: "hero", shows: `${slug} lead artwork`, supplied: true },
    { slot: "figure-1", shows: "Feature story 1", supplied: true },
    { slot: "figure-2", shows: "Feature story 2", supplied: true },
  ],
  schema: ["Review", "Article", "WebPage", "BreadcrumbList"],
  research: "30691679570 · 2026-08-01",
  evidence: "Model clusters are the cheapest real traffic in the set — KD 0 almost everywhere.",
}));

/* ------------------------------------------------------------------
   THE OTHER EIGHT CATEGORIES.

   Every hub below is BUILT and every one is text-only — hero copy, eight
   sections, own BotMatch questions, no artwork and (except window) no
   products. That is the owner's sequence of 6 August: pages first, then
   images, then reviews. It is recorded here per page so the artwork brief
   is a list rather than a memory.

   The image slots are the real ones the template renders: a hero, three
   decision cards, and three or four matrix rows depending on the category.
   ------------------------------------------------------------------ */

interface HubSeed {
  slug: string;
  intent: string;
  primary: PlanKeyword;
  secondary: PlanKeyword[];
  ceded: PagePlan["ceded"];
  refused?: PagePlan["refused"];
  products: string[];
  productsNote?: string;
  cards: string[];
  matrix: string[];
  heroShows: string;
  research: string;
  evidence: string;
  heroSupplied?: boolean;
}

const HUB_SEEDS: HubSeed[] = [
  {
    slug: "window-cleaning-robots",
    intent: "Work out whether one of these will clean my windows, and which.",
    primary: { term: "window cleaning robot", volume: 12100, difficulty: 5 },
    secondary: [
      { term: "automatic window cleaner", volume: 8100, difficulty: 0 },
      { term: "robot window cleaner", volume: 12100, difficulty: 5 },
      { term: "best window cleaning robot", volume: 1300, difficulty: 3 },
      { term: "frameless", volume: 0, difficulty: 0 },
    ],
    ceded: [],
    refused: [
      { term: "window cleaning robot comparison", volume: 20, why: "KD 45 — the hardest term in the dataset for the least traffic. The comparison tool exists for readers, not for this query." },
      { term: "best budget window cleaning robot", volume: 0, why: "SERP identical to the general best-of, which this hub already carries. A section, not a page." },
      { term: "window cleaning robot amazon", volume: 590, why: "KD 0 and real volume, but a page named after a retailer is thin. The hub picks it up." },
    ],
    products: ["ecovacs-winbot-w2-pro-omni", "ecovacs-winbot-w3-omni", "ecovacs-winbot-w2-pro", "ecovacs-winbot-w2s", "ecovacs-winbot-w1-pro", "ecovacs-winbot-mini", "hutt-s55-pro", "mamibot-w120-dp", "hobot-2s", "hobot-298", "cop-rose-x5s"],
    cards: ["Framed windows", "Frameless glass", "High and unreachable"],
    matrix: ["Rain spots and hard-water marks", "Dust and pollen film", "Greasy marks and fingerprints"],
    heroShows: "A window robot mid-pane on a bright sheet of glass",
    research: "30981257806 · 2026-08-05",
    evidence: "12,100 cluster. THE HUB CARRIES THE BEST-OF JOB ITSELF: 6 of the top 10 are identical between the head term and 'best window cleaning robot', and NYTimes ranks #1 for both with one article.",
    heroSupplied: true,
  },
  {
    slug: "robotic-lawn-mowers",
    intent: "Find a mower that suits my lawn size, slope and boundary situation.",
    primary: { term: "robot lawn mower", volume: 74000, difficulty: 36 },
    secondary: [
      { term: "robot mower", volume: 22200, difficulty: 32 },
      { term: "robotic lawn mower", volume: 74000, difficulty: 39 },
      { term: "acre", volume: 2060, difficulty: 4 },
      { term: "boundary wire", volume: 1670, difficulty: 0 },
    ],
    ceded: [],
    refused: [
      { term: "wire free robot lawn mower", volume: 0, why: "Planned as its own guide rather than chased here; the hub explains boundary wire as a decision without competing for the buying term." },
      { term: "best robot lawn mower for hills", volume: 0, why: "Planned as a guide. Slope is the category's hardest exclusion and deserves its own answer, not a hub paragraph." },
    ],
    products: [],
    productsNote: "No products seeded. Research lists 17 review candidates — the largest catalogue on the site — none sourced yet.",
    cards: ["Small yards", "Quarter acre to an acre", "An acre and up"],
    matrix: ["Everyday growth", "Long or wet grass", "Edges and borders"],
    heroShows: "A robot mower on a striped lawn, late afternoon light",
    research: "31073327230 + 31074893036 · 2026-08-06",
    evidence: "74,000/mo head term. Hub and best-of share only 2/10 domains, but one URL per category is the owner ruling of 5 August, so this page carries both jobs.",
  },
  {
    slug: "robot-vacuums",
    intent: "Choose a vacuum for my floor types and whether I need mopping.",
    primary: { term: "robot vacuum", volume: 135000, difficulty: 25 },
    secondary: [
      { term: "robot vacuum and mop", volume: 40500, difficulty: 29 },
      { term: "robot vacuum that mops", volume: 40500, difficulty: 8 },
      { term: "self emptying", volume: 12100, difficulty: 14 },
      { term: "pet hair", volume: 18100, difficulty: 8 },
    ],
    ceded: [],
    refused: [
      { term: "roborock", volume: 110000, why: "Bigger than 'best robot vacuum' at 60,500, and Roborock ranks its own site on the head term. A comparison site does not take a brand term off its owner." },
      { term: "irobot roomba", volume: 27100, why: "Same ruling. Belongs to a review page when the catalogue exists, not to the hub." },
    ],
    products: [],
    productsNote: "No products seeded. The largest category on the site by demand and the emptiest by catalogue.",
    cards: ["Mostly hard floors", "A mix of hard floor and carpet", "Deep or shag pile throughout"],
    matrix: ["Everyday floor dust", "Edges and corners", "Mopping hard floors", "Being left alone"],
    heroShows: "A robot vacuum crossing from hard floor onto a rug",
    research: "31090094137 · 2026-08-06",
    evidence: "135,000/mo and the widest difficulty gap on the site: 'robot vacuum that mops' is the same 40,500 volume at KD 8 against 'robot vacuum and mop' at KD 29.",
  },
  {
    slug: "self-cleaning-litter-boxes",
    intent: "Find a litter box that suits my cat's size and how many cats I have.",
    primary: { term: "self cleaning litter box", volume: 110000, difficulty: 46 },
    secondary: [
      { term: "automatic litter box", volume: 90500, difficulty: 26 },
      { term: "automatic cat litter box", volume: 49500, difficulty: 11 },
      { term: "best automatic litter box", volume: 22200, difficulty: 8 },
      { term: "robotic litter box", volume: 14800, difficulty: 19 },
    ],
    ceded: [],
    refused: [
      { term: "litter robot", volume: 165000, why: "Larger than the category term itself at 110,000. Whisker ranks its own site; a comparison site does not take a brand term off its owner." },
    ],
    products: [],
    productsNote: "No products seeded.",
    cards: ["An average adult cat", "A large or long cat", "A kitten, or a very small cat"],
    matrix: ["The daily scoop", "Smell", "More than one cat", "Knowing your cat is well"],
    heroShows: "A self-cleaning litter box in a clean utility space, cat nearby",
    research: "31090590604 + 31091110791 · 2026-08-06",
    evidence: "110,000/mo, and the easier phrasings are the way in — 'automatic cat litter box' is 49,500 at KD 11 against the head term's KD 46.",
  },
  {
    slug: "grill-cleaning-robots",
    intent: "Decide whether a grill robot beats a brush, and which suits my grates.",
    primary: { term: "grill cleaning robot", volume: 5400, difficulty: 0 },
    secondary: [
      { term: "robotic grill cleaner", volume: 5400, difficulty: 0 },
      { term: "automatic grill cleaner", volume: 1900, difficulty: 0 },
      { term: "porcelain", volume: 90, difficulty: 0 },
      { term: "cast iron", volume: 480, difficulty: 0 },
    ],
    ceded: [],
    refused: [
      { term: "grillbot", volume: 18100, why: "Three times the category term and a single manufacturer's brand. Review territory when the catalogue exists; not a hub target." },
      { term: "grill brush", volume: 0, why: "The category's real competitor is a $15 brush. The hub argues the case honestly in a section rather than chasing a term whose SERP is hardware retailers." },
    ],
    products: [],
    productsNote: "No products seeded.",
    cards: ["Porcelain-coated grates", "Bare cast iron", "Stainless steel bars"],
    matrix: ["The top of the bars", "Baked-on grease", "Sides, edges and the far corners", "Everything below the grate"],
    heroShows: "A grill robot working across hot bars, smoke and evening light",
    research: "31092662805 · 2026-08-06",
    evidence: "5,400/mo at KD 0 — the easiest commercial term on the site. Grate material is a genuine hard exclusion: brass strips porcelain.",
  },
  {
    slug: "companion-robots",
    intent: "Find a robot pet or companion for myself, a child or an older relative.",
    primary: { term: "robot pet", volume: 8100, difficulty: 0 },
    secondary: [
      { term: "robotic pet", volume: 8100, difficulty: 0 },
      { term: "companion robot", volume: 4400, difficulty: 6 },
      { term: "ai companion robot", volume: 1900, difficulty: 0 },
      { term: "robotic pet for elderly", volume: 390, difficulty: 0 },
    ],
    ceded: [
      { term: "pet camera robot", toPath: "/robots/pet-camera-robots/", why: "Measured as a separate category: discount amazon and reddit and the two share no domain at all, and their seasons run opposite ways." },
    ],
    refused: [
      { term: "robot dog", volume: 90500, why: "Huge, and the SERP is $1,600 Unitree developer quadrupeds beside Target children's toys. Two markets, neither ours." },
    ],
    products: [],
    productsNote: "No products seeded.",
    cards: ["For yourself, or another adult", "For a child", "For an older relative"],
    matrix: ["Company and presence", "Conversation", "Novelty and the long run", "Care and wellbeing use"],
    heroShows: "A companion robot on a table in a warm domestic room",
    research: "31081889310 · 2026-08-06",
    evidence: "Built on 'robot pet' (8,100, KD 0) rather than 'companion robot' (4,400) — the latter returns Wikipedia and humanoid-launch news, not shopping.",
  },
  {
    slug: "pet-camera-robots",
    intent: "Watch and interact with my pet while I am out.",
    primary: { term: "pet camera robot", volume: 480, difficulty: 9 },
    secondary: [
      { term: "robot pet camera", volume: 140, difficulty: 0 },
      { term: "pet monitoring robot", volume: 170, difficulty: 6 },
      { term: "home monitoring robot", volume: 170, difficulty: 0 },
    ],
    ceded: [
      { term: "robot pet", toPath: "/robots/companion-robots/", why: "The companion hub owns it at 8,100. This page is the roaming-camera intent, which measured as a separate SERP entirely." },
    ],
    refused: [
      { term: "best pet camera robot", volume: 0, why: "Google reads it as 'best pet camera' and answers with Wirecutter and Furbo — static cameras, not robots. Chasing it would put us in the wrong result set." },
    ],
    products: [],
    productsNote: "No products seeded.",
    cards: ["One floor, hard surfaces", "Stairs between the rooms that matter", "Carpet and thick rugs"],
    matrix: ["Dogs with separation anxiety", "Cats", "Checking on the house", "Older or sleepy pets"],
    heroShows: "A rolling pet camera in a hallway with a dog watching it",
    research: "31081889310 · 2026-08-06",
    evidence: "480/mo and small, but it is the one commercially viable cluster left after home security robots was cancelled. Peaks in July, opposite to companion's December.",
  },
  {
    slug: "educational-coding-robots",
    intent: "Buy a coding robot that suits the age of the child I am buying for.",
    primary: { term: "coding robot", volume: 1300, difficulty: 21 },
    secondary: [
      { term: "coding robots for kids", volume: 1300, difficulty: 21 },
      { term: "robotics kit", volume: 5400, difficulty: 0 },
      { term: "stem robot", volume: 1000, difficulty: 0 },
      { term: "educational robot", volume: 720, difficulty: 2 },
    ],
    ceded: [],
    refused: [
      { term: "stem toys", volume: 8100, why: "Six times our head term and not our SERP — 1-2 shared domains with everything here, 6 with 'best stem toys for kids'. Its own family, owned by toy retailers." },
      { term: "ai robot for kids", volume: 0, why: "Shares exactly ONE domain — amazon.com — with every term in this category and one with companion robots. Belongs to no page BotPlanet plans." },
      { term: "vex iq", volume: 18100, why: "Fourteen times the head term, one manufacturer's line sold largely through schools and competition programmes. Review at most." },
    ],
    products: [],
    productsNote: "No products seeded. The reviews are the business here — products run 4x to 14x the head term.",
    cards: ["Four to seven", "Eight to twelve", "Thirteen and up"],
    matrix: ["Getting a child started", "Holding attention past a month", "Teaching real programming", "Being used without an adult"],
    heroShows: "A child at a table with a small coding robot, screen-free",
    research: "31094454463 + 31094682067 · 2026-08-06",
    evidence: "Built on the coding family, not the educational one — the two share 4 domains and 'educational robot' returns institutional procurement and Wikipedia.",
  },
];

const HUBS: PagePlan[] = HUB_SEEDS.map((h) => ({
  path: `/robots/${h.slug}/`,
  category: h.slug,
  type: "hub",
  status: "built",
  intent: h.intent,
  primary: h.primary,
  secondary: h.secondary,
  ceded: h.ceded,
  refused: h.refused,
  products: h.products,
  productsNote: h.productsNote,
  linksOut: [`/compare/${h.slug}/`, `/botmatch/${h.slug}/`],
  images: [
    { slot: "hero", shows: h.heroShows, supplied: h.heroSupplied ?? false },
    ...h.cards.map((c, i) => ({ slot: `decision-card-${i + 1}`, shows: c, supplied: h.heroSupplied ?? false })),
    ...h.matrix.map((m, i) => ({ slot: `matrix-${i + 1}`, shows: m, supplied: h.heroSupplied ?? false })),
  ],
  schema: ["CollectionPage", "ItemList", "FAQPage", "BreadcrumbList"],
  research: h.research,
  evidence: h.evidence,
}));

/* Comparison pages. Live for every category from the day the category is,
   because they are generated from the catalogue. Only pool has comparison
   research behind it; the rest render the honest table and target nothing,
   which is why their primary is the page's own name rather than a keyword. */
const COMPARES: PagePlan[] = HUB_SEEDS.map((h) => ({
  path: `/compare/${h.slug}/`,
  category: h.slug,
  type: "compare",
  status: "built",
  intent: "Put every machine in the category side by side on the facts that decide it.",
  primary: { term: `compare ${h.slug.replace(/-/g, " ")}`, volume: 0, difficulty: 0 },
  secondary: [],
  ceded: [
    { term: h.primary.term, toPath: `/robots/${h.slug}/`, why: "The category head term belongs to the hub. A comparison table is a tool for a reader who has already arrived, not a page that competes for the category." },
  ],
  products: h.products,
  productsNote: h.products.length ? undefined : "Generated from the catalogue; renders the empty state until products exist.",
  linksOut: [`/robots/${h.slug}/`, `/botmatch/${h.slug}/`],
  images: [],
  schema: ["WebPage", "ItemList", "BreadcrumbList"],
  research: h.research,
  evidence: "Not a keyword target. It exists because a reader comparing machines needs one table, and because the route is generated for every category anyway.",
}));

/* ------------------------------------------------------------------
   WINDOW REVIEWS — written 6 August 2026 with no build pack, which is the
   failure that produced this file. Their plans are recorded here after the
   fact so the gap is closed and visible, NOT to make them compliant. All
   eleven are text-only and none may be considered finished until artwork
   exists: four images each, per BLUEPRINT §5 and §6.

   No window ASIN is identity-verified, so no window review may print a price.
   ------------------------------------------------------------------ */

const WINDOW_REVIEW_SEEDS: [string, string, number][] = [
  ["ecovacs-winbot-w2-pro-omni", "winbot w2 pro omni", 1120],
  ["ecovacs-winbot-w3-omni", "winbot w3 omni", 150],
  ["ecovacs-winbot-w2-pro", "winbot w2 pro", 150],
  ["ecovacs-winbot-w2s", "winbot w2s", 50],
  ["ecovacs-winbot-w1-pro", "winbot w1 pro", 100],
  ["ecovacs-winbot-mini", "winbot mini", 0],
  ["hutt-s55-pro", "hutt s55 pro", 0],
  ["mamibot-w120-dp", "mamibot w120", 100],
  ["hobot-2s", "hobot 2s", 50],
  ["hobot-298", "hobot 298", 50],
  ["cop-rose-x5s", "cop rose x5s", 0],
];

const WINDOW_REVIEWS: PagePlan[] = WINDOW_REVIEW_SEEDS.map(([slug, term, volume]) => ({
  path: `/robots/window-cleaning-robots/${slug}/`,
  category: "window-cleaning-robots",
  type: "review",
  status: "built",
  intent: "Decide whether this specific machine suits my windows.",
  primary: { term, volume, difficulty: 0 },
  secondary: [{ term: `${term} review`, volume, difficulty: 0 }],
  ceded: [
    { term: "window cleaning robot", toPath: "/robots/window-cleaning-robots/", why: "The 12,100 cluster belongs to the hub, which also carries the best-of job on measured evidence. One review cannot win it." },
  ],
  products: [slug],
  linksOut: ["/robots/window-cleaning-robots/", "/compare/window-cleaning-robots/", "/botmatch/window-cleaning-robots/"],
  images: [
    { slot: "hero", shows: `${slug} lead artwork`, supplied: false },
    { slot: "figure-1", shows: "Feature story 1", supplied: false },
    { slot: "figure-2", shows: "Feature story 2", supplied: false },
    { slot: "product-card", shows: "Catalogue card image for listings and the hub grid", supplied: false },
  ],
  schema: ["Review", "Article", "WebPage", "BreadcrumbList"],
  research: "30981257806 · 2026-08-05",
  evidence: volume > 0
    ? `${volume}/mo on the model name. Model terms are the cheapest real traffic in the category.`
    : "No measurable volume on the model name. The page exists for BotMatch coverage and the long tail: this machine answers a question no other product in the catalogue can.",
}));

/* Window BotMatch — live, noindex, competes for nothing. */
const WINDOW_BOTMATCH: PagePlan = {
  path: "/botmatch/window-cleaning-robots/",
  category: "window-cleaning-robots",
  type: "botmatch",
  status: "built",
  intent: "Answer questions about my glass and be told which machine fits.",
  primary: { term: "find my window cleaning robot", volume: 0, difficulty: 0 },
  secondary: [],
  ceded: [
    { term: "best window cleaning robot", toPath: "/robots/window-cleaning-robots/", why: "The hub carries the best-of job itself on measured SERP evidence. The matcher is a conversion tool and renders noindex." },
  ],
  products: [],
  productsNote: "Scores the whole category catalogue at runtime rather than listing a fixed set.",
  linksOut: ["/robots/window-cleaning-robots/"],
  images: [],
  schema: [],
  research: "30981257806 · 2026-08-05",
  evidence: "Not an SEO target by design — the page renders noindex. It exists as the conversion tool.",
};

export const PAGE_PLAN: PagePlan[] = [
  ...POOL,
  ...POOL_REVIEWS,
  ...HUBS,
  ...COMPARES,
  ...WINDOW_REVIEWS,
  WINDOW_BOTMATCH,
];

export const planFor = (path: string): PagePlan | undefined =>
  PAGE_PLAN.find((p) => p.path === path);

export const plansForCategory = (category: string): PagePlan[] =>
  PAGE_PLAN.filter((p) => p.category === category);

/** Everything a page must have before it may be built. */
export function readinessGaps(p: PagePlan): string[] {
  const gaps: string[] = [];
  if (!p.primary.term) gaps.push("no primary keyword");
  /* Secondary terms are required of pages that chase search. A comparison
     tool, a matcher and an index page legitimately target nothing beyond
     their own name, and demanding secondaries of them would only produce
     invented ones — which is worse than none. */
  const chasesSearch = p.type === "hub" || p.type === "review" || p.type === "best-of";
  if (p.secondary.length === 0 && chasesSearch) gaps.push("no secondary keywords");
  if (p.products.length === 0 && !p.productsNote) gaps.push("no products and no note explaining why");
  if (p.linksOut.length === 0) gaps.push("no internal links planned");
  if (p.schema.length === 0 && p.type !== "botmatch") gaps.push("no schema declared");
  const unsupplied = p.images.filter((i) => !i.supplied);
  if (unsupplied.length) gaps.push(`${unsupplied.length} image(s) not supplied: ${unsupplied.map((i) => i.slot).join(", ")}`);
  return gaps;
}
