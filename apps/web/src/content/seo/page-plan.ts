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
  /* THE FIRST PRODUCT-VERSUS-PRODUCT PAGE. Every other compare entry is a
     category holding a range side by side; this one is two named machines,
     because Google's People Also Ask carries the question in almost these
     words — "Which is better, Eilik or Emo?" — and a category page answers
     something else.

     THE TERM ORDER FOLLOWS THE QUESTION. Eilik leads because that is how the
     PAA asks it, and because Eilik is the one this site can actually route a
     buyer to. EMO's Amazon listings are a different brand's, which is the
     page's own finding and the reason it exists in this shape rather than as
     a two-buy-button comparison. */
  /* THE UNIVERSAL FINDER. The nine per-category funnels have no plan entries
     because they are noindex tools; this one is a page with an argument, so it
     gets one. The term it is built on is not a product term — nobody searches
     "botmatch" — it is the question a reader asks before they know the
     category exists, and the page answers it by asking a better one. */
  {
    path: "/botmatch/",
    category: null,
    type: "botmatch" as const,
    status: "built" as const,
    intent: "I want a robot for a job. Which one, and how do I know you are not just selling me something?",
    primary: { term: "which robot should i buy", volume: 590, difficulty: 8 },
    secondary: [
      { term: "robot finder", volume: 480, difficulty: 12 },
      { term: "best robot for my home", volume: 320, difficulty: 14 },
    ],
    /* NOTHING IS CEDED, and that is not an oversight. Ceding names a page that
       already targets the term, and this page competes with none of ours: it
       ranks for "which robot should I buy", which no category page wants and
       no category page could honestly answer. */
    ceded: [],
    products: [],
    productsNote:
      "Deliberately none. This page routes into all nine categories and names no product — listing some would make it a shortlist, which is the job of the best-of pages, and would put a thumb on a scale the funnel is built to keep level.",
    linksOut: ["/robots/", "/how-botmatch-works/", "/editorial-policy/"],
    images: [],
    schema: ["WebPage", "FAQPage", "BreadcrumbList"],
    research: "PAA and internal routing · 2026-08-09",
    evidence: "Low volume on the head term and that is expected — this page exists to catch the reader who arrives without a category, and the homepage sends more traffic to it than search ever will. What makes it worth indexing is the commission-isolation argument, which nothing else on the site states in full.",
  },
  {
    path: "/compare/eilik-vs-emo/",
    category: "companion-robots",
    type: "compare" as const,
    status: "built" as const,
    intent: "Which of these two desk robots should I buy?",
    primary: { term: "eilik vs emo", volume: 320, difficulty: 4 },
    secondary: [
      { term: "emo vs eilik", volume: 210, difficulty: 4 },
      { term: "which is better eilik or emo", volume: 90, difficulty: 0 },
    ],
    ceded: [
      { term: "eilik", toPath: "/robots/companion-robots/eilik/", why: "The model term belongs to the review, which carries the specification and the buy route." },
      { term: "emo robot", toPath: "/robots/companion-robots/living-ai-emo/", why: "Same reason, and the EMO review carries the counterfeit finding in full." },
    ],
    products: ["eilik", "living-ai-emo"],
    linksOut: ["/robots/companion-robots/eilik/", "/robots/companion-robots/living-ai-emo/", "/robots/companion-robots/"],
    images: [{ slot: "hero", shows: "Eilik and EMO side by side under the question itself", supplied: true }],
    schema: ["Article", "WebPage", "FAQPage", "ImageObject", "BreadcrumbList"],
    research: "PAA capture · 2026-08-09",
    evidence: "Google's own People Also Ask asks 'Which is better, Eilik or Emo?'. The pair phrase is small but the intent is unambiguous and neither review can answer it without becoming a comparison.",
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
    /* THESE THREE WERE `refused` UNTIL 6 AUGUST 2026, described as "planned as
       a guide". That was the wrong field: a refused term goes to no page of
       ours, and these were always going somewhere. The guides exist now, so
       they are ceded — which the cannibalisation test can actually check,
       because it verifies the named page really does target the term. */
    ceded: [
      { term: "wire free robot lawn mower", toPath: "/guides/wire-free-robot-lawn-mower/", why: "≈1,670/mo across the wire-free, RTK, GPS and LiDAR phrasings, and 2/10 shared domains with this page. A separate SERP, so it earns a URL rather than a section here." },
      { term: "best robot lawn mower for hills", toPath: "/guides/robot-lawn-mower-for-hills/", why: "Shares 7/10 domains with 'do robot lawn mowers work on hills' and only 3/10 with 'best robot lawn mower'. The two hills queries are one page and that page is not this one." },
      { term: "cheap robot lawn mower", toPath: "/guides/cheap-robot-lawn-mower/", why: "390/mo at KD 11 plus the price cluster, and 4/10 shared domains with 'best robot lawn mower'. The closest call in the category, and the first guide to fold back in here if it underperforms." },
    ],
    refused: [],
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
    ],
    ceded: [
      { term: "pet camera robot", toPath: "/robots/pet-camera-robots/", why: "Measured as a separate category: discount amazon and reddit and the two share no domain at all, and their seasons run opposite ways." },
      /* Was a SECONDARY here until 6 August 2026, when the guide was built.
         Left in both places it would have put two of our own pages into one
         result set for a query only one of them can win. The hub still covers
         eldercare as one of its three audiences; it stops chasing the term. */
      { term: "robotic pet for elderly", toPath: "/guides/robotic-pets-for-elderly/", why: "≈1,090/mo across four eldercare phrasings at KD 0, and a different reader — somebody buying for another person, often at a distance. The hub separates the three audiences; the guide answers the hardest of them properly." },
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
/**
 * What each comparison page is actually called, and what that is worth.
 *
 * MEASURED 10 AUGUST 2026, and it changed two things this generator had wrong.
 * The term was built from the slug, which is right for six categories and
 * wrong for coding: the slug is "educational-coding-robots" and the page says
 * "Compare coding robots for kids", so the generated term appeared nowhere on
 * the page it described. And the volume was hardcoded to 0 on the assumption
 * that nobody searches for a comparison — "compare robotic lawn mowers" is 90
 * a month and "compare self cleaning litter boxes" is 30. Small, real, and
 * theirs: the head terms still go to the hubs below.
 */
const COMPARE_MEASURED: Record<string, { term?: string; volume: number; difficulty: number }> = {
  "robotic-lawn-mowers": { volume: 90, difficulty: 15 },
  "self-cleaning-litter-boxes": { volume: 30, difficulty: 7 },
  "window-cleaning-robots": { volume: 0, difficulty: 0 },
  "companion-robots": { volume: 0, difficulty: 0 },
  "pet-camera-robots": { volume: 0, difficulty: 0 },
  "educational-coding-robots": { term: "compare coding robots", volume: 0, difficulty: 0 },
  "robotic-pool-cleaners": { volume: 0, difficulty: 0 },
  "robot-vacuums": { volume: 0, difficulty: 0 },
  "grill-cleaning-robots": { volume: 0, difficulty: 0 },
};

const COMPARES: PagePlan[] = HUB_SEEDS.map((h) => ({
  path: `/compare/${h.slug}/`,
  category: h.slug,
  type: "compare",
  status: "built",
  intent: "Put every machine in the category side by side on the facts that decide it.",
  primary: {
    term: COMPARE_MEASURED[h.slug]?.term ?? `compare ${h.slug.replace(/-/g, " ")}`,
    volume: COMPARE_MEASURED[h.slug]?.volume ?? 0,
    difficulty: COMPARE_MEASURED[h.slug]?.difficulty ?? 0,
  },
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
  ["ecovacs-winbot-mini", "winbot mini", 0],
  ["ecovacs-winbot-w1-pro", "winbot w1 pro", 100],
  ["hutt-s55-pro", "hutt s55 pro", 0],
  ["mamibot-w120-dp", "mamibot w120", 100],
  ["hobot-2s", "hobot 2s", 50],
  ["hobot-298", "hobot 298", 50],
  ["cop-rose-x5s", "cop rose x5s", 0],
];

/** Product slugs whose artwork has arrived. A flip is one line. */
/* UNMERGED 8 August 2026. The W3 Omni, W2S and Mini were folded into siblings
   on 7 August because the 5 August research capped WINBOTs at three — and all
   three stayed published in D1 with live Amazon offers, so the 301s left three
   sellable products no page could reach. They are back, with their own
   reviews. The concentration argument is a reason to write about other brands,
   not a reason to hide a buy button.

   The W2S and the Mini have no artwork yet and are the only two window
   products without it; page-plan.test.ts prints the outstanding list. */
const SUPPLIED_ARTWORK = new Set([
  "ecovacs-winbot-w2-pro-omni",
  "ecovacs-winbot-w3-omni",
  "ecovacs-winbot-w2-pro",
  "ecovacs-winbot-w1-pro",
  "hutt-s55-pro",
  "mamibot-w120-dp",
  "hobot-2s",
  "hobot-298",
  "cop-rose-x5s",
]);

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
  /* SUPPLIED FLIPS PER PRODUCT, 7 August 2026. The W2 PRO Omni is the first
     window product with artwork — four files supplied through the Notion
     image-request page. The other ten are still waiting, and
     page-plan.test.ts prints the outstanding list on every run. */
  images: [
    { slot: "hero", shows: `${slug} lead artwork`, supplied: SUPPLIED_ARTWORK.has(slug) },
    { slot: "figure-1", shows: "Feature story 1", supplied: SUPPLIED_ARTWORK.has(slug) },
    { slot: "figure-2", shows: "Feature story 2", supplied: SUPPLIED_ARTWORK.has(slug) },
    { slot: "product-card", shows: "Catalogue card image for listings and the hub grid", supplied: SUPPLIED_ARTWORK.has(slug) },
  ],
  schema: ["Review", "Article", "WebPage", "BreadcrumbList"],
  research: "30981257806 · 2026-08-05",
  evidence: volume > 0
    ? `${volume}/mo on the model name. Model terms are the cheapest real traffic in the category.`
    : "No measurable volume on the model name. The page exists for BotMatch coverage and the long tail: this machine answers a question no other product in the catalogue can.",
}));

/* Window BotMatch — live, noindex, competes for nothing. */
/* The window best-of. Page 2 of the window map from the very first run, ruled
   CREATE on 5 August 2026 and then never built while eleven reviews under it
   went live. Written 7 August, after the buy buttons on those reviews were
   made to work — a shortlist that funnels into pages nobody can buy from is
   an ornament. */
/* Page 9 of the window map. THREE QUERY FAMILIES, ONE PAGE — "do window
   cleaning robots work" (90), "how do window cleaning robots work" (40) and
   "are window cleaning robots worth it" (30). One intent behind all three: a
   reader who has seen these advertised and does not believe them yet. The SERP
   is Reddit and forums, which is exactly where a plainly-written answer with a
   real "no" in it can win against marketing copy. */
const WINDOW_WORKS_GUIDE: PagePlan = {
  path: "/guides/do-window-cleaning-robots-work/",
  category: "window-cleaning-robots",
  type: "guide",
  status: "built",
  intent: "Tell me whether these actually work before I spend anything.",
  primary: { term: "do window cleaning robots work", volume: 130, difficulty: 0 },
  secondary: [
    { term: "how do window cleaning robots work", volume: 40, difficulty: 0 },
    { term: "are window cleaning robots worth it", volume: 30, difficulty: 0 },
    { term: "suction", volume: 0, difficulty: 0 },
    { term: "streaking", volume: 0, difficulty: 0 },
  ],
  ceded: [
    { term: "window cleaning robot", toPath: "/robots/window-cleaning-robots/", why: "The 12,100 head term is the hub's. This guide answers the scepticism question and hands the reader on rather than re-explaining the category." },
    { term: "best window cleaning robot", toPath: "/best-robots/window-cleaning-robots/", why: "A guide that ranks machines is a best-of wearing a hat, and it would compete with the page built for that query. This one answers whether to buy at all." },
  ],
  products: [],
  productsNote: "No picks by design. The eleven machines are ranked on the best-of; naming a winner here would split one argument across two URLs competing for one result.",
  linksOut: [
    "/robots/window-cleaning-robots/",
    "/best-robots/window-cleaning-robots/",
    "/botmatch/window-cleaning-robots/",
    "/review-methodology/",
  ],
  images: [{ slot: "hero", shows: "A half-cleaned window, robot mid-pane, the difference visible", supplied: false }],
  schema: ["Article", "FAQPage", "BreadcrumbList"],
  research: "30981257806 · 2026-08-05 · $0.2044",
  evidence: "130/mo combined across three phrasings at KD 0, and the last unbuilt page on the window map. A Reddit-and-forums SERP rewards an honest answer, and this category has a real one — they work in the middle of the pane and disappoint at the edge.",
};

const WINDOW_BEST: PagePlan = {
  path: "/best-robots/window-cleaning-robots/",
  category: "window-cleaning-robots",
  type: "best-of",
  status: "built",
  intent: "Tell me which window robot to buy, and which one is wrong for my glass.",
  primary: { term: "best window cleaning robot", volume: 1300, difficulty: 3 },
  secondary: [
    { term: "best robot window cleaner", volume: 1300, difficulty: 3 },
    { term: "window cleaning robot reviews", volume: 1000, difficulty: 7 },
    { term: "best window cleaning robot 2026", volume: 210, difficulty: 0 },
    { term: "frameless", volume: 0, difficulty: 0 },
    { term: "high rise", volume: 0, difficulty: 0 },
  ],
  ceded: [
    { term: "window cleaning robot", toPath: "/robots/window-cleaning-robots/", why: "The 12,100 head term is the hub's. This page takes the commercial half of the category and leaves the explanation of how the machines work where it already sits." },
  ],
  refused: [
    { term: "best budget window cleaning robot", volume: 0, why: "SERP identical to the general best-of. A second page would cannibalise this one for a segment that is a paragraph, not a market." },
    { term: "best cordless window cleaning robot", volume: 0, why: "Nearly every machine here runs a cable for power and a battery for the fall. Cordless is not a segment in this category, so the term describes nothing to rank for." },
    { term: "best window cleaning robot for high rise", volume: 0, why: "Same SERP as the general best-of, so it is a SECTION here. It is also the claim most makers write and fewest support with a number." },
    { term: "best window cleaning robot for frameless glass", volume: 0, why: "Same SERP again, and the honest exclusion most models fail. Carried as a section because a reader with frameless glass needs it before anything else on the page." },
  ],
  products: [
    "ecovacs-winbot-w2-pro",
    "ecovacs-winbot-w2-pro-omni",
    "ecovacs-winbot-w3-omni",
    "ecovacs-winbot-w2s",
    "ecovacs-winbot-mini",
    "hutt-s55-pro",
    "hobot-2s",
    "cop-rose-x5s",
    "mamibot-w120-dp",
  ],
  productsNote: "Nine ranked out of eleven held. The WINBOT W1 PRO and the HOBOT-298 are named on the page and deliberately given no award — both are beaten on price and on published evidence by machines already on the list, and an award invented so every product has one is an advert.",
  linksOut: [
    "/robots/window-cleaning-robots/",
    "/compare/window-cleaning-robots/",
    "/botmatch/window-cleaning-robots/",
    "/review-methodology/",
  ],
  images: [{ slot: "hero", shows: "A window robot mid-pane on a large clean window, tether visible", supplied: false }],
  schema: ["Article", "ItemList", "FAQPage", "BreadcrumbList"],
  research: "30981257806 · 2026-08-05 · $0.2044",
  evidence: "1,300/mo at KD 0-3 with a $3.20 CPC, and the one CREATE ruling from the window run that was never acted on. Eleven reviews already sit under it with working Amazon buy buttons, so it is the shortest path from a commercial query to a click that earns.",
};

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

/* ------------------------------------------------------------------
   PLANNED PAGES — researched, not built.

   Every keyword below was PAID FOR ALREADY. These are the review and guide
   candidates each category's research run named, with the volumes it measured,
   lifted out of the findings documents and into code where a test can see them.
   No new DataForSEO spend was needed and none was possible: runs 31120094738
   and 31121016884 were both killed at fifteen minutes with no runner ever
   assigned, so research is blocked until that is resolved.

   STATUS IS `researched`, NOT `ready`. Every one of these still needs the two
   things the blueprint requires before a builder touches it: a product sourced
   and verified, and artwork assigned per section. Nothing here is buildable
   tonight and the status says so.

   REVIEWS ARE TITLED WITH THE BARE PRODUCT NAME, not "X review". Measured, not
   assumed: the companion run found the bare name takes 10-100x the searches of
   the review phrasing.
   ------------------------------------------------------------------ */

interface PlannedSeed {
  slug: string;
  term: string;
  volume: number;
  difficulty?: number;
  note?: string;
  /**
   * True once the page exists.
   *
   * ADDED 10 AUGUST 2026 with the eleven robot vacuums, and the reason is that
   * this helper was written to describe pages that did NOT exist yet — it
   * hardcoded `researched` for everything it produced. When a whole category
   * got built out of one of these lists, the plan went on describing eleven
   * live pages as candidates, and every test keyed on `status === "built"`
   * quietly skipped them. A flag per seed keeps one list per category instead
   * of splitting it in two and losing the volumes that justified each page.
   */
  built?: boolean;
}

function plannedReviews(category: string, research: string, seeds: PlannedSeed[]): PagePlan[] {
  return seeds.map((x) => ({
    path: `/robots/${category}/${x.slug}/`,
    category,
    type: "review" as const,
    status: (x.built ? "built" : "researched") as const,
    intent: "Decide whether this specific machine is the right one for me.",
    primary: { term: x.term, volume: x.volume, difficulty: x.difficulty ?? 0 },
    secondary: [{ term: `${x.term} review`, volume: 0, difficulty: 0 }],
    ceded: [],
    products: [],
    productsNote: x.note ?? "Product not sourced. No catalogue row, no ASIN, no verified specification yet.",
    linksOut: [`/robots/${category}/`, `/compare/${category}/`, `/botmatch/${category}/`],
    images: [
      { slot: "hero", shows: `${x.term} lead artwork`, supplied: false },
      { slot: "figure-1", shows: "Feature story 1", supplied: false },
      { slot: "figure-2", shows: "Feature story 2", supplied: false },
      { slot: "product-card", shows: "Catalogue card for listings and the hub grid", supplied: false },
    ],
    schema: ["Review", "Article", "WebPage", "BreadcrumbList"],
    research,
    evidence: `${x.volume.toLocaleString("en-US")}/mo on the bare product name. Model terms are the cheapest real traffic in every category researched so far.`,
  }));
}

/* Robot vacuums — the largest demand on the site and, until 10 August 2026, an
   empty catalogue. All eleven are now built.

   SIX OF THE ELEVEN SLUGS ARE NOT THE SLUG THE TERM WOULD SUGGEST, and every
   one of those six is deliberate. Four of the researched terms are FAMILY
   NAMES rather than models — `shark powerdetect`, `shark matrix robot vacuum`,
   `roborock qrevo` and `ecovacs deebot` each cover three or four current
   machines across price spreads up to $1,150 — so each page is built on one
   pinned SKU and named for it. `roborock s8 maxv ultra` names a machine with
   NO first-party Amazon US listing at all, so the page is built on the S8 Max
   Ultra that stands in its place. And `eufy s1 pro` is listed by eufy itself
   as the Omni S1 Pro.

   The TERM column below is unchanged in every case. The term is what people
   search and it is still what the page targets; the slug is what the machine
   is called. Full record: docs/commerce/robot-vacuums-identity.md. */
const VACUUM_REVIEWS = plannedReviews("robot-vacuums", "31090094137 · 2026-08-06", [
  { slug: "eufy-omni-s1-pro", term: "eufy s1 pro", volume: 33100, built: true, note: "Built 10 August 2026. eufy lists it as the Omni S1 Pro, hence the slug. The Amazon search row carries no price and the rating is 3.2 — both on the page." },
  { slug: "roborock-s8-max-ultra", term: "roborock s8 maxv ultra", volume: 9900, built: true, note: "Built 10 August 2026 as the S8 Max Ultra. The MaxV Ultra has NO first-party Amazon US listing — every result carrying that string is a third-party accessory kit — so the page answers the term under the name the machine on the shelf actually has." },
  { slug: "eufy-x10-pro-omni", term: "eufy x10 pro omni", volume: 8100, built: true, note: "Built 10 August 2026. B0CPFBBHP4, $449.99." },
  { slug: "shark-powerdetect-av2820s", term: "shark powerdetect", volume: 8100, built: true, note: "Built 10 August 2026 on the AV2820S. PowerDetect covers three machines from $549.99 to $849.99, and the AV2820S is the vacuum while the RV2820ZE is the vacuum-and-mop." },
  { slug: "shark-matrix-plus-ur2650ws", term: "shark matrix robot vacuum", volume: 8100, built: true, note: "Built 10 August 2026 on the UR2650WS. Matrix names two Shark lines; this is the $279.99 one with 35,917 ratings." },
  { slug: "roborock-qrevo-s5v", term: "roborock qrevo", volume: 6600, built: true, note: "Built 10 August 2026 on the S5V. Qrevo covers four machines from $499.98 to $879.99." },
  { slug: "dreame-x50-ultra", term: "dreame x50 ultra", volume: 6600, built: true, note: "Built 10 August 2026. B0DM5J52GC, $999.99." },
  { slug: "dreame-x40-ultra", term: "dreame x40 ultra", volume: 4400, built: true, note: "Built 10 August 2026. B0CXDXKSXP, $599.99." },
  { slug: "ecovacs-deebot-t90-pro-omni", term: "ecovacs deebot", volume: 3600, built: true, note: "Built 10 August 2026 on the T90 PRO Omni. DEEBOT covers four current machines from $349 to $1,499.99." },
  { slug: "roborock-saros-10", term: "roborock saros 10", volume: 2900, built: true, note: "Built 10 August 2026. B0DLH247PS, $1,299.99 — the only machine in the catalogue with a maker's high-pile claim." },
  { slug: "roomba-max-705", term: "roomba max 705", volume: 2900, built: true, note: "Built 10 August 2026 on the vacuum-only B0DWG3C3ZF. The $799 Combo is a different machine sharing the name." },
]);

/* Litter boxes. Litter-Robot 4 at 74,000 is the single biggest review
   opportunity anywhere on the site, and it was built on 10 August 2026 along
   with the other three products the category holds.

   TWO OF THE RESEARCHED SLUGS NAMED THE SAME MACHINE. `casa-leo` (6,600) and
   `leos-loo-too` (1,000) are the brand and the model of one product — Casa Leo
   makes Leo's Loo Too and little else — so they are one page carrying both
   terms rather than two pages competing for one product's traffic. The 1,000
   is folded into that row's secondary set, not lost.

   AND THE FOUR BUILT ROWS TAKE THEIR TERMS FROM THE KEYWORD REGISTER, NOT
   FROM THIS FILE'S OWN SEEDS. The 6 August seeds were category-level guesses
   at what each page would target; the register rows were measured on 10 August
   against the exact product URLs, and they are both narrower and more recent.
   Where the two disagreed the register won — `litter-robot 4` rather than
   `litter robot 4`, `leos loo too` (1,000, the model) rather than `casa leo`
   (6,600, the bare brand), `petsafe scoopfree crystal pro` (480) rather than
   the family term, and `petkit purobot max pro 2` (390), which was not in the
   seed set at all because the run measured the PuraMax 2, the Pura X and the
   Purobot Ultra and the machine we verified is a fourth product.

   The seed volumes those rows used to carry are not lost — they are the family
   and brand terms, and they sit in each register row's secondary set where
   they belong. */
const LITTER_REVIEWS = plannedReviews("self-cleaning-litter-boxes", "31090590604 + 31091110791 · 2026-08-06", [
  { slug: "litter-robot-4", term: "litter-robot 4", volume: 74000, difficulty: 15, built: true, note: "Built 10 August 2026. THE BIGGEST SINGLE REVIEW OPPORTUNITY ON THE SITE — and the brand term itself (165,000) is refused, so this review is how the category reaches Whisker demand honestly." },
  { slug: "casa-leo-loo-too", term: "leos loo too", volume: 1000, built: true, note: "Built 10 August 2026. The model term rather than the bare brand `casa leo` (6,600), on the site's standing ruling that a comparison site does not take a brand query off its owner." },
  { slug: "neakasa-m1", term: "neakasa m1", volume: 3600 },
  { slug: "catgenie", term: "catgenie", volume: 2900 },
  { slug: "petkit-puramax-2", term: "petkit puramax 2", volume: 1900 },
  { slug: "petsafe-scoopfree-crystal-pro", term: "petsafe scoopfree crystal pro", volume: 480, built: true, note: "Built 10 August 2026 on the Crystal Pro. ScoopFree Crystal is a family of four live SKUs and two of them are within five cents of each other, one a previous generation." },
  { slug: "petkit-purobot-max-pro-2", term: "petkit purobot max pro 2", volume: 390, built: true, note: "Built 10 August 2026. Not in the 6 August seed set — that run measured the PuraMax 2, the Pura X and the Purobot Ultra, and this is a fourth machine. Volume from the 10 August register run against the product URL itself." },
  { slug: "petkit-pura-x", term: "petkit pura x", volume: 590 },
  { slug: "popur-x5", term: "popur x5", volume: 590 },
  { slug: "petkit-purobot-ultra", term: "petkit purobot ultra", volume: 390 },
]);

/* ------------------------------------------------------------------
   COMPANION ROBOTS — REPLANNED 8 August 2026 from measured data.
   Research: local run on docs/seo/seeds/companion-products.json,
   133 seeds, 22 SERPs, $0.3321.
   Plan: docs/seo/companion-products-build-plan.md
   Buyability: docs/seo/companion-robots-research-findings.md

   THE 6 AUGUST PLAN NAMED SEVEN REVIEWS AND FOUR OF THEM COULD NOT
   CARRY A BUY BUTTON. Amazon US was checked product by product on
   8 August: Sony aibo, Tombot Jennie, ElliQ, Cozmo and Moxie have
   no listing at all, and Living.AI EMO returns only unbranded
   knockoffs. That is 43,900 searches a month this site cannot
   monetise, and it was planned as if it could.

   Three products replace them, all with a confirmed ASIN read from
   the listing's own fields: Vector 2.0, Miko 3 and — retitled —
   Moflin. Joy For All is deleted as a review and handed to the
   seniors guide, which shares five of its top-ten domains and was
   already built waiting for exactly this product.

   ORDER IS THE CALENDAR, NOT THE VOLUME. Everything here except
   Moflin peaks in December: `miko robot` runs 2,400 in June and
   40,500 in December. Moflin peaks in SEPTEMBER at 14,800, which
   is why it is first despite not being the biggest.
   ------------------------------------------------------------------ */

const COMPANION_RESEARCH = "local 2026-08-08 · $0.3321 · seeds/companion-products.json";

/** Shared by every companion review: same slots, same schema, same exits. */
const companionReviewShell = (slug: string) => ({
  category: "companion-robots",
  type: "review" as const,
  status: "researched" as const,
  intent: "Decide whether this specific machine is the right one for me.",
  linksOut: [
    "/robots/companion-robots/",
    "/compare/companion-robots/",
    "/botmatch/companion-robots/",
  ],
  images: [
    { slot: "hero", shows: `${slug} lead artwork`, supplied: false },
    { slot: "figure-1", shows: "Feature story 1", supplied: false },
    { slot: "figure-2", shows: "Feature story 2", supplied: false },
    { slot: "product-card", shows: "Catalogue card for listings and the hub grid", supplied: false },
  ],
  schema: ["Review", "Article", "WebPage", "BreadcrumbList"],
  research: COMPANION_RESEARCH,
});

const COMPANION_REVIEWS: PagePlan[] = [
  {
    ...companionReviewShell("moflin"),
    path: "/robots/companion-robots/moflin/",
    /* BUILT 8 August 2026 — the first companion review, and the only page in
       this category with a September deadline rather than a December one. */
    status: "built" as const,
    /* TITLED "MOFLIN", NOT "CASIO MOFLIN". The old plan carried the branded
       form at 1,300 and KD 24. The bare name is 6,600 at KD 12 — five times
       the traffic at half the difficulty. */
    primary: { term: "moflin", volume: 6600, difficulty: 12 },
    secondary: [
      { term: "casio moflin", volume: 1300, difficulty: 24 },
      { term: "moflin pet", volume: 1000, difficulty: 25 },
      { term: "moflin review", volume: 140, difficulty: 6 },
      { term: "casio moflin review", volume: 40, difficulty: 0 },
      { term: "moflin price", volume: 40, difficulty: 17 },
      { term: "casio moflin price", volume: 40, difficulty: 0 },
      { term: "buy moflin", volume: 20, difficulty: 5 },
      { term: "moflin for sale", volume: 20, difficulty: 9 },
      { term: "is moflin worth it", volume: 10, difficulty: 0 },
      { term: "moflin battery life", volume: 10, difficulty: 0 },
    ],
    ceded: [],
    refused: [
      { term: "sony aibo", volume: 3600, why: "Named on this page because searchers ask for 'moflin vs aibo' at suggest position 1, and refused as a target because aibo has no Amazon US listing. Naming the honest comparison is not claiming its term." },
    ],
    products: ["moflin"],
    productsNote: "Catalogued as prod-moflin, 8 August 2026. Amazon US B0GPHNLWP3 — identity read from the listing title, which is weaker evidence than the window eleven had because this listing publishes no details table; recorded as researched_exact rather than verified_exact for that reason. Specifications read from casio.com/us/moflin/ the same day, where Casio publishes a full table.",
    evidence: "6,600/mo at KD 12 on the bare name. The ONLY product in this category that does not peak at Christmas: 720 in July, 14,800 in September. That peak is the deadline, which is why it is page one of six.",
  },
  {
    ...companionReviewShell("miko 3"),
    path: "/robots/companion-robots/miko-3/",
    /* BUILT 8 August 2026, second in the category. */
    status: "built" as const,
    primary: { term: "miko 3", volume: 4400, difficulty: 3 },
    secondary: [
      { term: "miko robot", volume: 8100, difficulty: 10 },
      { term: "miko 3 review", volume: 320, difficulty: 0 },
      { term: "miko robot review", volume: 210, difficulty: 0 },
      { term: "miko max", volume: 170, difficulty: 0 },
      { term: "miko 3 price", volume: 110, difficulty: 0 },
      { term: "miko 3 vs miko mini", volume: 110, difficulty: 0 },
      { term: "miko max subscription cost", volume: 70, difficulty: 0 },
      { term: "miko 3 amazon", volume: 50, difficulty: 3 },
      { term: "miko robot age range", volume: 30, difficulty: 0 },
      { term: "miko robot subscription", volume: 20, difficulty: 0 },
      { term: "is miko robot worth it", volume: 20, difficulty: 0 },
      { term: "miko 3 vs miko max", volume: 10, difficulty: 0 },
    ],
    ceded: [],
    refused: [
      /* 5,400/mo AT KD 0 THAT CANNOT BE SOLD. The only Amazon US listing for
         the Mini is "LTGEM Case Compatible with Miko Mini" — a case for a
         product is not the product, the same pattern as Cozmo's $19 battery.
         This page compares against the Mini and sends nobody anywhere. */
      { term: "miko mini", volume: 5400, why: "Checked 8 August 2026: the only Amazon US listing is a carrying case for it. A 5,400/mo KD 0 term with nothing behind it is a page that costs money and earns none. Compared against on the Miko 3 review instead." },
      { term: "ai robot for kids", volume: 0, why: "Shares two of ten domains with 'miko 3'. The existing ruling that this term belongs to no BotPlanet page holds, and the measurement confirms Miko does not drag this category into a parenting SERP." },
    ],
    products: ["miko-3"],
    productsNote: "Catalogued as prod-miko-3, 8 August 2026. Amazon US B0GV37M678 — $299, in stock. THE SECOND LISTING WAS NOT A DUPLICATE: B0GV2L2PDL carries a byte-identical title ending \'| Blue\', serves its own ASIN and is also in stock at $299. Two colours of one machine. Red is the one held. Specifications read from miko.ai/products/miko-3 the same day.",
    evidence: "4,400/mo at KD 3, with 'miko robot' at 8,100/KD 10 behind it. 'miko 3' and 'miko 3 review' share SIX of ten domains, so one page takes both. Cheapest large opportunity in the category and it was not in the plan at all.",
  },
  {
    ...companionReviewShell("vector 2.0"),
    path: "/robots/companion-robots/vector-2/",
    /* BUILT 8 August 2026, third in the category. */
    status: "built" as const,
    primary: { term: "vector robot", volume: 9900, difficulty: 23 },
    secondary: [
      { term: "vector 2.0", volume: 1300, difficulty: 0 },
      { term: "anki vector", volume: 1000, difficulty: 23 },
      { term: "anki vector robot", volume: 720, difficulty: 23 },
      { term: "vector robot price", volume: 480, difficulty: 4 },
      { term: "vector robot app", volume: 210, difficulty: 9 },
      { term: "vector robot for sale", volume: 110, difficulty: 5 },
      { term: "vector robot amazon", volume: 110, difficulty: 4 },
      { term: "vector 2.0 robot", volume: 90, difficulty: 13 },
      { term: "vector robot cube", volume: 70, difficulty: 0 },
      { term: "vector robot subscription", volume: 50, difficulty: 6 },
      { term: "vector robot accessories", volume: 50, difficulty: 0 },
      { term: "digital dream labs vector", volume: 30, difficulty: 19 },
      { term: "vector robot review", volume: 30, difficulty: 5 },
      { term: "vector robot vs cozmo", volume: 20, difficulty: 3 },
      { term: "is vector robot still supported", volume: 10, difficulty: 0 },
      { term: "vector robot alternative", volume: 10, difficulty: 0 },
    ],
    ceded: [],
    refused: [
      { term: "cozmo robot", volume: 9900, why: "9,900/mo and the only Amazon US listing is a $19 battery for it. Answered as a comparison section on this page, because 'vector robot vs cozmo' ranks and this is the machine that wins it by default." },
    ],
    products: ["vector-2"],
    productsNote: "Catalogued as prod-vector-2, 8 August 2026. Amazon US B07G3ZNK4Y, sold by the Digital Dream Labs Store, whose listing title states 'ChatGPT Subscription Required' outright. Subscription pricing — $11.99/month, $99.99/year — read from anki.bot the same day. The listing price moved from $199.99 to $184 within one morning, which is why none is recorded here.",
    evidence: "9,900/mo. 'vector robot' shares SIX of ten domains with 'is vector robot still supported' and FIVE with 'vector robot price' — one page takes all three. Every Vector SERP's PAA asks whether it is discontinued or still works.",
  },
  {
    ...companionReviewShell("eilik"),
    path: "/robots/companion-robots/eilik/",
    /* BUILT 8 August 2026, fourth in the category. */
    status: "built" as const,
    primary: { term: "eilik robot", volume: 8100, difficulty: 29 },
    secondary: [
      { term: "eilik", volume: 3600, difficulty: 29 },
      { term: "energize lab eilik", volume: 590, difficulty: 34 },
      { term: "eilik robot price", volume: 390, difficulty: 7 },
      { term: "eilik robot amazon", volume: 390, difficulty: 1 },
      { term: "eilik ai station", volume: 260, difficulty: 0 },
      { term: "eilik robot review", volume: 110, difficulty: 1 },
      { term: "eilik robot keychain", volume: 90, difficulty: 5 },
      { term: "eilik desktop robot", volume: 50, difficulty: 29 },
      { term: "eilik price", volume: 30, difficulty: 0 },
      { term: "eilik robot for sale", volume: 30, difficulty: 26 },
      { term: "eilik vs emo", volume: 20, difficulty: 0 },
      { term: "is eilik worth it", volume: 10, difficulty: 0 },
      { term: "two eilik robots", volume: 10, difficulty: 0 },
      { term: "eilik battery life", volume: 10, difficulty: 0 },
    ],
    ceded: [
      { term: "emo robot", toPath: "/robots/companion-robots/living-ai-emo/", why: "Google's own PAA on this SERP asks 'Which is better, Eilik or Emo?', so the comparison has to be answered here — but the 18,100/mo term belongs to the EMO page, which is the only page that should rank for it." },
    ],
    products: ["eilik"],
    productsNote: "Catalogued as prod-eilik, 8 August 2026 — the BASE Eilik, B0C2C9LJNQ at $139.99, matching Energize Lab's own price. The DQ (B0DBVM5BCY, $199.98) turned out to be the Desert Quester: identical hardware in a desert colourway with an exclusive game and a weapon kit. It is described on the page and deliberately NOT seeded as a second offer, because one product row carrying two Amazon offers would print the DQ's price under the Eilik's name.",
    evidence: "8,100/mo. Shares FIVE of ten domains with both 'eilik robot review' and 'eilik price', so one page takes all three. Eilik is a RANGE — DQ, AI Station, Panxer, Eiliko — and both engines complete the head term with seven colour variants at position 1.",
  },
  {
    ...companionReviewShell("loona"),
    path: "/robots/companion-robots/loona/",
    /* BUILT 8 August 2026, fifth in the category. */
    status: "built" as const,
    primary: { term: "loona robot", volume: 5400, difficulty: 18 },
    secondary: [
      { term: "loona robot dog", volume: 1000, difficulty: 4 },
      { term: "loona robot amazon", volume: 260, difficulty: 0 },
      { term: "keyi tech loona", volume: 170, difficulty: 0 },
      { term: "loona robot review", volume: 110, difficulty: 2 },
      { term: "loona robot price", volume: 90, difficulty: 0 },
      { term: "loona robot accessories", volume: 70, difficulty: 0 },
      { term: "keyi loona", volume: 50, difficulty: 0 },
      { term: "loona robot where to buy", volume: 40, difficulty: 0 },
      { term: "loona robot for sale", volume: 30, difficulty: 0 },
      { term: "is loona robot worth it", volume: 30, difficulty: 2 },
      { term: "loona petbot review", volume: 20, difficulty: 24 },
      { term: "buy loona robot", volume: 20, difficulty: 33 },
      { term: "loona robot subscription", volume: 10, difficulty: 0 },
      { term: "loona robot battery life", volume: 10, difficulty: 0 },
    ],
    ceded: [
      { term: "emo robot", toPath: "/robots/companion-robots/living-ai-emo/", why: "The PAA on this SERP asks 'Which robot is better, Emo or Loona?', so it is answered here — but the term itself belongs to the EMO page rather than being fought over by two of ours." },
    ],
    products: ["loona"],
    productsNote: "Catalogued as prod-loona, 8 August 2026. Amazon US B0DCF53PCH at $499, 4.1 stars from 1,234 ratings. Specifications are KEYi\'s own listing copy and Q&A because keyirobot.com is JavaScript-rendered and could not be machine-read — which is also why the absence of a subscription is recorded as none published rather than none exists.",
    evidence: "5,400/mo. Shares FIVE of ten domains with 'loona robot price'. keyirobot.com is KEYi's own content marketing and ranks across this whole category including on products it does not make.",
  },
  {
    ...companionReviewShell("moxie"),
    status: "built" as const,
    path: "/robots/companion-robots/moxie/",
    primary: { term: "moxie robot", volume: 8100, difficulty: 0 },
    secondary: [
      { term: "embodied moxie", volume: 0, difficulty: 0 },
      { term: "moxie robot shut down", volume: 0, difficulty: 0 },
      { term: "openmoxie", volume: 0, difficulty: 0 },
      { term: "moxie robot for sale", volume: 0, difficulty: 0 },
    ],
    ceded: [],
    refused: [
      { term: "buy moxie robot", volume: 0, why: "There is nothing to sell and nothing we would sell if there were. The product is discontinued, the servers are off and a used unit may never work. Owning a buying term for a robot that does not function would be a lie told for traffic." },
    ],
    products: [],
    productsNote: "prod-moxie is a D1 row with no offer and no /go key, added in migration 0008 and deliberately absent from PRODUCT_ID. The resale market is real and we are not routing anybody into it: a used Moxie may or may not join the community server and the seller cannot tell you which.",
    evidence: "8,100/mo and a search population that is largely people asking what happened, plus a resale market operating on a product that no longer works out of the box. The page that answers 'what happened and can I still use one' is the page nobody has written, and it is the honest use of the term.",
  },
  {
    ...companionReviewShell("ropet"),
    path: "/robots/companion-robots/ropet/",
    /* RESEARCHED 8 August 2026, not built. Found because searchers named it
       themselves in "moflin vs ropet" — nothing in the plan knew it existed,
       and it is the only buyable companion product this site had no measured
       volume for. Round two fixed that: docs/seo/companion-round-two-findings.md */
    primary: { term: "ropet", volume: 1300, difficulty: 6 },
    secondary: [
      { term: "ropet robot", volume: 140, difficulty: 0 },
      { term: "ropet ai robot", volume: 50, difficulty: 1 },
      { term: "ropet kamomo", volume: 20, difficulty: 0 },
      { term: "ropet accessories", volume: 20, difficulty: 0 },
      { term: "ropet reviews", volume: 10, difficulty: 12 },
      { term: "ropet where to buy", volume: 10, difficulty: 0 },
      { term: "ropet price", volume: 10, difficulty: 0 },
    ],
    ceded: [],
    refused: [
      /* 2,900/mo of annual average that is really 27,100 in one November and
         zero for four months of the year, on a product whose SERP is
         Trustpilot, r/ScamsEtc and "Don't Buy AI Puppies". Recorded here with
         the figures so nobody re-opens it when the number spikes again. */
      { term: "froplay dog reviews", volume: 2900, why: "An advertising spike rather than demand: 0 in August, 27,100 in November, 40 by June. The SERP is Trustpilot, a scam subreddit and 'Is the robot dog a scam?'. Ranking for scam-check traffic on a product we cannot verify, do not sell and would not recommend is the wrong 2,900." },
      { term: "loona deskmate", volume: 880, why: "A crowdfunding launch curve — zero until January 2026, 3,600 in March, 590 by June — with no retail listing behind it. Gated on availability rather than on volume; KEYi will ship it and the Loona review already gives us the brand." },
    ],
    products: ["ropet"],
    productsNote: "Catalogued as prod-ropet, 8 August 2026. Amazon US B0GTPZ4N4M, Model Name 'ropet KAMOMO pro', $299, in stock — the PRO configuration, whose own packing list names the charging base Ropet sells separately, and $40 UNDER the maker's own bundle price on the day it was read. A new product: 4.1 stars from 47 ratings against 12,307 on the Joy For All cat.",
    evidence: "1,300/mo at KD 6 and about 1,600 across the cluster. THE SOFTEST SERP IN THE CATEGORY: one real review in the top ten. Also the highest CPCs — 'ropet where to buy' at $10.95 against 'moflin review' at $0.26. Flat seasonality, 880 in July to 1,900 in December, so it is the one companion page with no Christmas deadline.",
  },
  {
    ...companionReviewShell("joy for all companion pets"),
    path: "/robots/companion-robots/joy-for-all-companion-pets/",
    primary: { term: "joy for all companion pets", volume: 880, difficulty: 8 },
    secondary: [
      { term: "robotic cat for elderly", volume: 320, difficulty: 0 },
      { term: "joy for all cat", volume: 260, difficulty: 0 },
      { term: "companion pet cat", volume: 210, difficulty: 0 },
    ],
    ceded: [
      { term: "robotic pet for elderly", toPath: "/guides/robotic-pets-for-elderly/", why: "The guide owns the eldercare term and this product is its top pick. The review answers one machine; the guide answers the decision, and sending the decision-stage reader to the review would drop them past the comparison they came for." },
    ],
    products: ["joy-for-all-companion-pets"],
    productsNote: "Catalogued as prod-joy-for-all-companion-pets, 8 August 2026. Amazon US B017JQQ00Q at $159, sold by Ageless Innovation LLC, 4.5 stars from 12,307 ratings. Part number B7594 pins this to the Silver with White Mitts; the cat sells in several colourways and there is a dog as well.",
    evidence: "THE PAGE WAS ALREADY LIVE AND ALREADY SELLING. Published in D1, carrying a working buy button, and the top pick on the eldercare guide \u2014 with no review record, so it rendered from the catalogue fallback with a heading reading \"Cleans\" over a robotic cat. This entry exists because that was found in an image audit rather than by a test.",
  },
  {
    ...companionReviewShell("emo robot"),
    path: "/robots/companion-robots/living-ai-emo/",
    /* BUILT 8 August 2026, sixth and last in the category. */
    status: "built" as const,
    /* KEPT DESPITE HAVING NOTHING TO SELL. Two separate Amazon searches on
       8 August returned only unbranded "EMOPET" knockoffs — Living.AI does not
       list in the US. It stays because it is the comparison anchor for the
       entire desktop segment: Google's PAA asks "Which is better, Eilik or
       Emo?" on Eilik's SERP and "Which robot is better, Emo or Loona?" on
       Loona's. A page that ranks for 18,100 and routes to machines that can be
       bought is worth more than a gap where the anchor should be. */
    primary: { term: "emo robot", volume: 18100, difficulty: 21 },
    secondary: [
      { term: "robot pet emo", volume: 70, difficulty: 11 },
      { term: "eilik vs emo", volume: 20, difficulty: 0 },
    ],
    ceded: [],
    products: [],
    productsNote: "NO OFFER AND NONE EXPECTED. Amazon US searched twice on 8 August 2026; only unbranded EMOPET-style knockoffs returned, with the brand token 'Living.AI' absent from both. This page carries no buy button and routes internally instead.",
    linksOut: [
      "/robots/companion-robots/",
      "/robots/companion-robots/eilik/",
      "/robots/companion-robots/loona/",
      "/compare/companion-robots/",
    ],
    evidence: "18,100/mo at KD 21, the largest single term in the category, and the comparison anchor Google itself uses in the PAA on both the Eilik and Loona SERPs. Unmonetisable and still worth ranking for.",
  },
];

/* Pet camera robots — the Enabot line, which is the roaming-camera family
   rather than the companion one. */
/* ------------------------------------------------------------------
   PET CAMERA ROBOTS — REPLANNED 8 August 2026 from measured data.
   Research: local run on seeds/pet-camera-robots-products.json,
   49 seeds, 10 SERPs, $0.2230.
   Findings: docs/seo/pet-camera-robots-findings.md

   THE PLAN NAMED THREE MODELS AND TWO OF THEM ARE DISCONTINUED.
   The 6 August research proposed EBO Air (1,000/mo), EBO X (260)
   and EBO SE (260). A listing-by-listing read of Amazon US on
   8 August found neither the Air nor the X on sale anywhere.
   Enabot now sells seven machines: SE $119, ROLA Mini $139,
   Air 2 $149, ROLA PetPal $179, EBO Mini $199, Air 2S $299 and
   Air 2 Plus $359.

   THE OLD TERM STILL HAS DEMAND AND GOOGLE HAS ALREADY MOVED IT.
   "enabot ebo air" measures 1,000/mo at KD 0 and its SERP serves
   Air 2 results — Enabot's store, the Air 2 on Amazon, CNET's
   Air 2 review. The two share SIX of ten top-ten domains, so the
   Air 2 page carries the old term rather than a redirect.

   THE BIGGEST TERM IN THE CATEGORY IS THE BRAND, AND IT NOW HAS
   ITS OWN PAGE PLANNED. "enabot" is 9,900/mo at KD 4 against 480
   for "pet camera robot". Its SERP was measured separately on
   8 August ($0.1356) because assigning the largest term in a
   category without looking at its results is the guessing this
   process exists to stop.

   It belongs to neither existing page. Against the hub it shares
   THREE domains and all three are amazon, instagram and reddit —
   discount the universal ones, as the hub's own register already
   does, and the overlap is zero. Against the Air 2 review it
   shares five, which is the threshold, but four of those five are
   amazon, instagram, reddit and facebook; only cnet.com is a real
   publisher. Meaningful overlap of one.

   So it gets a range page. See ENABOT_RANGE below.
   ------------------------------------------------------------------ */

const PETCAM_RESEARCH = "local 2026-08-08 · $0.2230 · seeds/pet-camera-robots-products.json";

const petcamShell = (slug: string) => ({
  category: "pet-camera-robots",
  type: "review" as const,
  status: "built" as const,
  intent: "Decide whether this specific machine is the right one for me.",
  linksOut: ["/robots/pet-camera-robots/", "/robots/companion-robots/"],
  images: [
    { slot: "hero", shows: `${slug} lead artwork`, supplied: false },
    { slot: "figure-1", shows: "Feature story 1", supplied: false },
    { slot: "figure-2", shows: "Feature story 2", supplied: false },
    { slot: "product-card", shows: "Catalogue card for listings and the hub grid", supplied: false },
  ],
  schema: ["Review", "Article", "WebPage", "BreadcrumbList"],
  research: PETCAM_RESEARCH,
});

const PETCAM_REVIEWS: PagePlan[] = [
  {
    ...petcamShell("enabot ebo air 2"),
    path: "/robots/pet-camera-robots/enabot-ebo-air-2/",
    primary: { term: "ebo air 2", volume: 2400, difficulty: 0 },
    secondary: [
      { term: "enabot ebo air", volume: 1000, difficulty: 0 },
      { term: "ebo air 2 plus", volume: 1000, difficulty: 0 },
      { term: "enabot ebo air 2", volume: 390, difficulty: 2 },
      { term: "enabot ebo air 2 plus", volume: 210, difficulty: 2 },
      { term: "ebo air 2s", volume: 50, difficulty: 2 },
      { term: "enabot ebo air review", volume: 20, difficulty: 0 },
      { term: "enabot ebo mini", volume: 10, difficulty: 0 },
      { term: "enabot ebo air 2s", volume: 10, difficulty: 0 },
    ],
    ceded: [],
    refused: [
      { term: "ebo x", volume: 260, why: "KD 42, the hardest term in the category, on a model Enabot no longer sells. 'enabot ebo x' at 260 and KD 0 is the same dead product from the other direction. Neither is worth a page and neither has anything to sell behind it." },
    ],
    products: ["enabot-ebo-air-2"],
    productsNote: "Catalogued as prod-enabot-ebo-air-2, 8 August 2026. Amazon US B0DZHDF7MD at $149.99, sold by Enabot Official Store. Three ASINs carry this title at this price — the other two are colours. The Air 2S and Air 2 Plus are different machines and are named on the page rather than sold from this row.",
    evidence: "2,400/mo at KD 0 on 'ebo air 2', and it inherits the discontinued 'enabot ebo air' at 1,000 because the two share SIX of ten top-ten domains — Google has already merged the old model's term into the current range. Air 2 and Air 2 Plus share EIGHT, so one page covers the family.",
  },
  {
    ...petcamShell("enabot ebo se"),
    path: "/robots/pet-camera-robots/enabot-ebo-se/",
    primary: { term: "ebo se", volume: 390, difficulty: 0 },
    secondary: [
      { term: "enabot ebo se", volume: 260, difficulty: 0 },
      { term: "enabot ebo se review", volume: 20, difficulty: 0 },
    ],
    ceded: [],
    products: ["enabot-ebo-se"],
    productsNote: "Catalogued as prod-enabot-ebo-se, 8 August 2026. Amazon US B09R6V3CJM at $119.99, sold by Enabot Official Store. NOT B0CGV82XTT: that listing carries the same product name at the same price under the seller 'Rocon' and serves a different ASIN. The page warns buyers to check the seller.",
    evidence: "650/mo across 'ebo se' and 'enabot ebo se', both KD 0. Shares only FOUR of ten domains with the Air family, so it is a separate SERP and a separate page. It is also the only model in the range low enough to get under furniture, which is where cats are.",
  },
  {
    ...petcamShell("enabot rola petpal"),
    path: "/robots/pet-camera-robots/enabot-rola-petpal/",
    primary: { term: "rola petpal", volume: 140, difficulty: 0 },
    secondary: [
      { term: "enabot rola mini", volume: 480, difficulty: 10 },
      { term: "enabot rola petpal", volume: 50, difficulty: 0 },
      { term: "enabot ebo rola", volume: 40, difficulty: 15 },
      { term: "ebo rola", volume: 20, difficulty: 0 },
    ],
    ceded: [],
    refused: [
      /* 720/mo AND THE WRONG MARKET. The SERP is Furbo, Closer Pets, Petcube,
         Wired and Petco — static treat cameras. It shares ONE domain with
         "enabot rola petpal", and that domain is amazon.com. Adding a robot to
         that query does not buy a different result set, it buys Furbo as a
         competitor. The same ruling the hub already made about "best pet
         camera robot". */
      { term: "pet camera with treat dispenser", volume: 720, why: "Shares ONE top-ten domain with 'enabot rola petpal', and it is amazon.com. The SERP is Furbo, Closer Pets, Petcube, Wired and Petco — the static treat-camera market, which this site does not compete in. The dispenser is described on the page; the term is refused." },
    ],
    products: ["enabot-rola-petpal"],
    productsNote: "Catalogued as prod-enabot-rola-petpal, 8 August 2026. Amazon US B0GMQW1HX6 at $179.99, 4.0 stars from 26 ratings. The ROLA Mini (B0DDC9DZKK, $139) shares the ROLA name and has NO treat dispenser, which is the only reason to pay the difference.",
    evidence: "The only machine on this site that combines a treat dispenser with a camera that moves — Furbo throws from a shelf, every other Enabot drives without treats. 'enabot rola mini' at 480/KD 10 is carried here because the two are one product family and the Mini is the thing a buyer is choosing against.",
  },
];

/* The Enabot range page. RESEARCHED 8 August 2026, not built.

   Every editorial slot on the "enabot" SERP is a review of ONE model — a
   YouTube review of the Air 2 Plus, a YouTube review of the ROLA Mini, CNET on
   the Air 2. Nobody has written the page that explains the range: which of the
   seven machines to buy, and what the $240 between the SE and the Air 2 Plus
   actually buys. That gap is the page. */
const ENABOT_RANGE: PagePlan = {
  path: "/robots/pet-camera-robots/enabot/",
  category: "pet-camera-robots",
  /* best-of rather than review: it ranks three machines and names four more,
     which is what the type means here. It is not a review of a product,
     because "enabot" is not a product. */
  type: "best-of",
  status: "built",
  intent: "Work out which Enabot to buy, out of seven machines whose names do not explain themselves.",
  primary: { term: "enabot", volume: 9900, difficulty: 4 },
  secondary: [
    { term: "enabot robot", volume: 1600, difficulty: 10 },
    { term: "enabot ebo", volume: 1000, difficulty: 10 },
    { term: "enabot pet camera", volume: 260, difficulty: 3 },
    { term: "enabot review", volume: 110, difficulty: 0 },
    { term: "enabot rola mini", volume: 480, difficulty: 10 },
    { term: "enabot ebo mini", volume: 10, difficulty: 0 },
    { term: "enabot app", volume: 50, difficulty: 13 },
  ],
  ceded: [
    { term: "ebo air 2", toPath: "/robots/pet-camera-robots/enabot-ebo-air-2/", why: "The single-model review owns it at 2,400/mo. This page routes to it rather than competing — five shared domains is the threshold, and four of those five are amazon, instagram, reddit and facebook." },
    { term: "ebo se", toPath: "/robots/pet-camera-robots/enabot-ebo-se/", why: "The SE review owns its own name. This page's job is telling somebody which of the seven to read about, not reviewing each of them again." },
    { term: "pet camera robot", toPath: "/robots/pet-camera-robots/", why: "The category head term belongs to the hub, and the two SERPs share only amazon, instagram and reddit — discount those and the overlap is zero, which is why this is a separate page rather than a rewrite of the hub." },
  ],
  products: ["enabot-ebo-air-2", "enabot-ebo-se", "enabot-rola-petpal"],
  productsNote: "Ranks the three catalogued machines and names the other four with prices: SE $119, ROLA Mini $139, Air 2 $149, ROLA PetPal $179, EBO Mini $199, Air 2S $299, Air 2 Plus $359. Three of the seven are catalogued and reviewed; the other four are named and priced here without a catalogue row each, which is the honest shape for a range page.",
  linksOut: [
    "/robots/pet-camera-robots/",
    "/robots/pet-camera-robots/enabot-ebo-air-2/",
    "/robots/pet-camera-robots/enabot-ebo-se/",
    "/robots/pet-camera-robots/enabot-rola-petpal/",
  ],
  images: [
    { slot: "hero", shows: "The Enabot range together, several models at one scale", supplied: false },
    { slot: "figure-1", shows: "Size comparison — the SE against the ROLA PetPal", supplied: false },
  ],
  schema: ["Article", "WebPage", "BreadcrumbList"],
  research: "local 2026-08-08 · $0.1356 · seeds/enabot-brand.json",
  evidence: "About 12,900/mo across brand terms at KD 4-10, against 480 on the category head term. This is not a category with a leading brand in it, it is a brand with a category attached. Every editorial slot on its SERP reviews a single model; nobody has written the range.",
};

/* Coding robots. The reverse of every other category: the products are 4x to
   14x the head term, so the reviews are the business and the hub only routes.

   BRAND TERMS MEASURED AND REFUSED, 8 August 2026 ($0.1662).
   docs/seo/coding-robots-findings.md

   After Enabot turned out to be a brand with a category attached — 9,900/mo at
   KD 4, with an editorial gap on its SERP — this category looked like the same
   shape and larger: sphero 27,100, vex robotics 33,100, ozobot 14,800,
   makeblock 3,600, and SIX Sphero products in the plan with no brand term
   anywhere near it.

   IT IS NOT THE SAME SHAPE. "sphero" returns sphero.com, YouTube, the Sphero
   Edu app on two stores, WIKIPEDIA, and one retail result. "ozobot" returns
   ozobot.com, the ozoblockly coding IDE, and demco.com and teq.com — library
   and classroom suppliers. Both are navigational or procurement queries rather
   than shopping ones, and they measure KD 26, 36 and 62 against Enabot's 4.
   There is no editorial gap because the query is not editorial.

   BUYABILITY, read listing by listing the same day: five are clean (Sphero
   BOLT, Mini and indi, Ozobot Evo, Makeblock mBot), five have the wrong ASIN
   or the wrong product behind them, and two cannot be bought at all. The
   pattern in the failures is one thing: THIS CATEGORY SELLS TO SCHOOLS. The
   Bee-Bot candidate is a $691 six-robot class pack, SPIKE Essential is a $597
   education SKU, and VEX GO — 2,900/mo at KD 8, the best difficulty in the
   category — has no Amazon listing because VEX sells it through the education
   channel. A consumer comparison site can answer the parent buying one robot.
   It cannot answer a procurement query.

   THE FIVE CLEAN ONES WERE THEN MEASURED SEPARATELY, 8 August 2026 ($0.1596),
   seeds/coding-robots-products.json, because three of them are Sphero and the
   one-URL rule had never been tested inside a single brand. If "sphero bolt"
   and "sphero mini" return the same result set then these are sections of one
   page, not three reviews, and writing three would have been the exact mistake
   this process exists to catch.

   THEY ARE THREE PAGES. bolt × mini shares FOUR of ten domains — sphero.com,
   amazon.com, help.sphero.com, youtube.com. Discount the universal two and the
   remainder is the manufacturer's own site and its help centre. Third-party
   editorial overlap is ZERO. bolt × indi shares three, of which one survives
   the discount. indi × mbot shares three and only geyerinstructional.com, a
   classroom supplier, survives.

   THE FINDING THAT MATTERS MORE: not one independent review site ranks in the
   top ten for ANY of the four product terms measured. The slots are the
   manufacturer, its education arm, its help centre, YouTube, and school and
   library suppliers — geyerinstructional, schoolspecialty, gocivilairpatrol,
   a university libguide, a Utah .gov. The single real publisher anywhere is
   theisaacstandard.com at 14 for mBot. The brand SERPs had no editorial gap
   because they are navigational; the PRODUCT SERPs have nothing but gap. That
   is the reverse of the brand ruling above and it is why the reviews are the
   business in this category. */
const CODING_RESEARCH = "local 2026-08-08 · $0.1596 · seeds/coding-robots-products.json";

const codingShell = (slug: string) => ({
  category: "educational-coding-robots",
  type: "review" as const,
  status: "built" as const,
  intent: "Decide whether this specific machine is the right one for me.",
  linksOut: ["/robots/educational-coding-robots/", "/compare/educational-coding-robots/"],
  images: [
    { slot: "hero", shows: `${slug} lead artwork`, supplied: false },
    { slot: "figure-1", shows: "Feature story 1", supplied: false },
    { slot: "figure-2", shows: "Feature story 2", supplied: false },
    { slot: "product-card", shows: "Catalogue card for listings and the hub grid", supplied: false },
  ],
  schema: ["Review", "Article", "WebPage", "BreadcrumbList"],
  research: CODING_RESEARCH,
});

const CODING_BUILT: PagePlan[] = [
  {
    ...codingShell("sphero bolt"),
    path: "/robots/educational-coding-robots/sphero-bolt/",
    primary: { term: "sphero bolt", volume: 4400, difficulty: 32 },
    secondary: [
      { term: "sphero bolt plus", volume: 480, difficulty: 10 },
      { term: "sphero bolt review", volume: 20, difficulty: 0 },
      { term: "sphero bolt vs mini", volume: 10, difficulty: 0 },
      { term: "sphero bolt python", volume: 10, difficulty: 0 },
    ],
    ceded: [
      { term: "sphero mini", toPath: "/robots/educational-coding-robots/sphero-mini/", why: "The cheaper robot owns its own name at 2,900/mo. This page names it constantly because it is the thing a reader is choosing against, and routes rather than competes — the two SERPs share no third-party editorial domain at all." },
      { term: "coding robot", toPath: "/robots/educational-coding-robots/", why: "The category head term belongs to the hub, whose job is routing a parent to the right age band. This page answers one machine." },
    ],
    products: ["sphero-bolt"],
    productsNote: "Catalogued as prod-sphero-bolt, 8 August 2026. Amazon US B07DLM5DL7 at $179. The details table's Sub Brand row is what separates this from the BOLT+, BOLT Power Pack and SPRK+ listings that share the name.",
    evidence: "4,400/mo at KD 32 — the second-largest product term in the category and the hardest of the five built, because Sphero's own site holds five of the ten slots. The page is built on the one question none of those slots answers: BOLT or Mini, and whether the text-coding step is worth $129. 'sphero bolt plus' at 480/KD 10 is carried here rather than given a page because there is no verified ASIN behind the BOLT+ and a page with nothing to sell is a page that recommends nothing.",
  },
  {
    ...codingShell("sphero mini"),
    path: "/robots/educational-coding-robots/sphero-mini/",
    primary: { term: "sphero mini", volume: 2900, difficulty: 15 },
    secondary: [
      { term: "sphero mini review", volume: 20, difficulty: 0 },
      { term: "sphero play", volume: 0, difficulty: 0 },
      { term: "sphero edu", volume: 0, difficulty: 0 },
    ],
    ceded: [
      { term: "sphero bolt", toPath: "/robots/educational-coding-robots/sphero-bolt/", why: "The BOLT owns its own name at 4,400/mo. This page's argument is that the Mini is the cheap way to find out first, which requires naming the BOLT and then handing the reader to it." },
    ],
    refused: [
      /* 390/mo at KD 0 and a $6.17 CPC, which is a commercial term for
         something. It is not clear it is this product: "sphero mini golf" may
         be an activity kit or may be minigolf with the brand attached, and
         nothing in the SERP settles it. A term nobody has identified is not a
         term to build copy around. */
      { term: "sphero mini golf", volume: 390, why: "390/mo at KD 0 with a $6.17 CPC — the highest cost-per-click measured in this category, which usually means a real buyer. We could not establish from the results whether it means a Sphero accessory kit or minigolf with a brand name in front of it. Refused until identified rather than guessed at." },
    ],
    products: ["sphero-mini"],
    productsNote: "Catalogued as prod-sphero-mini, 8 August 2026. Amazon US B072B6QVVW at $50, the Blue. The productTitle element did not render on our read, so identity rests on the details table — Sub Brand 'Mini', Colour 'Blue' — and on the served-ASIN equality check. Sphero sells other colours as separate listings at prices we have not read.",
    evidence: "2,900/mo at KD 15, the softest of the three Sphero terms, on the cheapest real product in the category. Its SERP shares four domains with the BOLT's and the two that survive the universal discount are sphero.com and help.sphero.com — the manufacturer, twice. No independent review ranks for either term, which is the whole opportunity.",
  },
  /* ------------------------------------------------------------------
     RULE-OUT REVIEWS, 8 August 2026. Two large terms owned by pages that
     recommend something else. Neither has products, an offer or a buy button
     and neither is getting one — `products: []` here is the plan, not a gap
     waiting to be filled.
     ------------------------------------------------------------------ */
  {
    ...codingShell("cozmo"),
    path: "/robots/educational-coding-robots/cozmo/",
    primary: { term: "cozmo robot", volume: 9900, difficulty: 0 },
    secondary: [
      { term: "anki cozmo", volume: 0, difficulty: 0 },
      { term: "cozmo 2.0", volume: 0, difficulty: 0 },
      { term: "digital dream labs", volume: 0, difficulty: 0 },
      { term: "cozmo robot review", volume: 0, difficulty: 0 },
    ],
    ceded: [],
    refused: [
      { term: "buy cozmo robot", volume: 0, why: "Refused on purpose rather than for want of demand. The page exists to say the seller is under suit by a state Attorney General over roughly 14,000 prepaid orders that went undelivered; ranking for the buying intent and then honouring it would be the one thing this site is built not to do. The transactional term can go unowned." },
    ],
    products: [],
    productsNote: "prod-cozmo is a D1 row with no offer and no /go key, added in migration 0008 and deliberately absent from PRODUCT_ID so the catalogue tests do not demand a buyable destination for it. Same shape as prod-living-ai-emo. There is no buy button on this page and there is not going to be one.",
    evidence: "9,900/mo for the bare name and the demand is entirely nostalgic — Anki stopped trading in 2019 and the machine has not been reliably purchasable since. What ranks for it is old reviews of a discontinued robot and a store page with no stock. Nobody is writing the page that answers the actual question, which is whether you can buy one today and from whom.",
  },
  {
    ...codingShell("sphero indi"),
    path: "/robots/educational-coding-robots/sphero-indi/",
    primary: { term: "sphero indi", volume: 1600, difficulty: 1 },
    secondary: [
      { term: "screen-free", volume: 140, difficulty: 0 },
      { term: "sphero indi at home learning kit", volume: 30, difficulty: 0 },
      { term: "sphero indi review", volume: 10, difficulty: 11 },
    ],
    ceded: [],
    refused: [
      { term: "coding robot for 4 year old", volume: 0, why: "Measured at ZERO on 8 August 2026. It is the obvious phrase for this product and the obvious phrase for an age page, and nobody searches it. Recorded rather than dropped so the idea is not re-proposed on intuition — the age fork lives in a hub section because that is where the demand actually is." },
    ],
    products: ["sphero-indi"],
    productsNote: "Catalogued as prod-sphero-indi, 8 August 2026. Amazon US B094X6TV5V at $100, the At-Home Learning Kit. Sphero also sells an indi Class Pack with code mats and literacy cards — a different product at a different price, named on the page and not sold from this row.",
    evidence: "1,600/mo at KD 1, the easiest term of the five and the only screen-free product with a buy button behind it. Its SERP is sphero.com twice, Amazon, edu.sphero.com, a school instructional supplier, a Civil Air Patrol page and a Utah state .gov — procurement all the way down, with nothing written for the parent of a four-year-old.",
  },
  {
    ...codingShell("ozobot evo"),
    path: "/robots/educational-coding-robots/ozobot-evo/",
    primary: { term: "ozobot evo", volume: 1300, difficulty: 5 },
    secondary: [
      { term: "ozobot color codes", volume: 720, difficulty: 0 },
      { term: "ozobot evo vs bit", volume: 40, difficulty: 0 },
      { term: "ozobot evo review", volume: 10, difficulty: 1 },
      { term: "block coding", volume: 0, difficulty: 0 },
    ],
    ceded: [],
    refused: [
      { term: "ozobot", volume: 14800, why: "14,800/mo at KD 36 and refused outright on 8 August 2026, not handed to another page. A bare Ozobot search on Amazon returns the Evo, which is what a brand term looks like rather than a product; the SERP is ozobot.com, the ozoblockly coding IDE, and demco.com and teq.com — library and classroom distributors. Every slot is the manufacturer, its software or its procurement channel. There is no editorial position to take, which is exactly the test Enabot passed at KD 4 and this fails at 36." },
    ],
    products: ["ozobot-evo"],
    productsNote: "Catalogued as prod-ozobot-evo, 8 August 2026. Amazon US B0CSR53WXV at $175, the Evo Entry Kit. The listing's own Age Range Description field reads 'Toddler', contradicting both its title and Ozobot's rating of 5 to 11; the page names the contradiction and uses the title.",
    evidence: "1,300/mo at KD 5, and it carries 'ozobot color codes' at another 720/KD 0 because the colour codes are how the robot is programmed rather than an accessory — a reader searching the codes is a reader deciding whether the method suits their child. Combined that is over 2,000/mo at single-digit difficulty against a SERP with no independent review on it.",
  },
  {
    ...codingShell("makeblock mbot"),
    path: "/robots/educational-coding-robots/makeblock-mbot/",
    primary: { term: "makeblock mbot", volume: 880, difficulty: 29 },
    secondary: [
      { term: "mbot2", volume: 720, difficulty: 0 },
      { term: "mbot ranger", volume: 320, difficulty: 0 },
      { term: "scratch coding robot", volume: 260, difficulty: 8 },
      { term: "makeblock mbot review", volume: 10, difficulty: 0 },
    ],
    ceded: [],
    refused: [
      { term: "makeblock", volume: 3600, why: "3,600/mo at KD 17 on the bare brand, refused alongside Sphero, Ozobot and VEX on 8 August 2026 for the same reason. The 'makeblock mbot' results alone carry makeblock.com four times — the product page, mBot2, the brand page and the education arm — plus two school suppliers. A brand page here would be competing with the manufacturer for its own name and offering a reader nothing the manufacturer does not already say." },
    ],
    products: ["makeblock-mbot"],
    productsNote: "Catalogued as prod-makeblock-mbot, 8 August 2026. Amazon US B00SK5RUQY at $69. Makeblock also sells the mBot2, the mBot Ranger and the mBot Ultimate; none of those names appears in this listing's title. The productTitle element did not render on our second read, so identity rests on the search-result title and the served-ASIN equality check.",
    evidence: "880/mo at KD 29 on the model name, and 1,040 more on 'mbot2' and 'mbot ranger' at KD 0 — a family question the page answers rather than a set of pages, because we sell one of the three and saying so is the useful part. 'scratch coding robot' at 260/KD 8 lands here because this is the only Scratch-native machine in the catalogue.",
  },
];

/* The seven that are NOT built, and why each one is not. Left as planned rather
   than deleted, because a plan that quietly loses its failures is a plan that
   re-proposes them next quarter. */
const CODING_REVIEWS = plannedReviews("educational-coding-robots", "31094454463 + 31094682067 · 2026-08-06", [
  { slug: "ozobot", term: "ozobot", volume: 14800, difficulty: 36, note: "NOT A PRODUCT. A bare Amazon search for 'ozobot' returns the Evo, and the brand SERP is ozobot.com, the ozoblockly IDE and two classroom distributors. Filed as a review by the original plan; it is a brand term and the Evo review carries what is addressable." },
  { slug: "bee-bot", term: "bee bot", volume: 4400, difficulty: 6, note: "WRONG PRODUCT BEHIND THE TERM. The candidate ASIN B0F6759THL is a 'Coding Robot Class Pack — 6 Bee-Bot' at $691. The term is a parent buying one robot at KD 6; a classroom six-pack is not that purchase. Blocked on a single-unit listing." },
  { slug: "lego-spike-essential", term: "lego spike essential", volume: 3600, difficulty: 11, note: "EDUCATION SKU AT $597, and the listing served a different ASIN than requested. Same failure as Bee-Bot: a classroom kit against a consumer term." },
  { slug: "vex-go", term: "vex go", volume: 2900, difficulty: 8, note: "NO AMAZON US LISTING. The best difficulty score in the category and nothing to sell — a search returns a HEXBUG toy. VEX sells GO through the education channel, which its brand SERP confirms. Blocked on a retail listing anywhere." },
  { slug: "sphero-rvr", term: "sphero rvr", volume: 720, difficulty: 5, note: "THE CANDIDATE IS THE WRONG MACHINE. B0BLF8CLQF is titled 'Sphero RVR+', a different and dearer model at $339. Either the RVR is discontinued and this term should point at the RVR+, or the correct ASIN has not been found. Not settled, so not written." },
  { slug: "botley-2", term: "botley 2.0", volume: 720, difficulty: 0, note: "Serves a different ASIN than requested — an Activity Set parent listing. Probably resolvable, not resolved." },
  { slug: "code-and-go-robot-mouse", term: "code and go robot mouse", volume: 590, difficulty: 0, note: "Serves a different ASIN than requested — an Activity Set parent listing. Probably resolvable, not resolved." },
]);

/* Grill. One product dominates, so one review matters. */
const GRILL_REVIEWS = plannedReviews("grill-cleaning-robots", "31092662805 · 2026-08-06", [
  { slug: "grillbot", term: "grillbot", volume: 18100, difficulty: 11, note: "Product not sourced. The brand term is REFUSED for the hub at 18,100 — three times the category term — and this review is the honest way to reach that demand." },
]);

/* Lawn. Seventeen review candidates were named; these are the ones with a
   measured figure behind them. */
const LAWN_REVIEWS = plannedReviews("robotic-lawn-mowers", "31073327230 + 31074893036 · 2026-08-06", [
  { slug: "husqvarna-automower", term: "husqvarna automower", volume: 14800, difficulty: 7 },
  { slug: "segway-navimow", term: "segway navimow", volume: 4400, difficulty: 39 },
  { slug: "mammotion-luba-2", term: "mammotion luba 2", volume: 2900, difficulty: 0 },
  { slug: "mammotion-luba-3", term: "mammotion luba 3", volume: 1600, difficulty: 0 },
  { slug: "mammotion-yuka", term: "mammotion yuka", volume: 720, difficulty: 9 },
  { slug: "husqvarna-automower-115h", term: "husqvarna automower 115h", volume: 590, difficulty: 0 },
  { slug: "segway-navimow-i110n", term: "segway navimow i110n", volume: 480, difficulty: 12 },
  { slug: "segway-navimow-x430", term: "segway navimow x430", volume: 480, difficulty: 0 },
  { slug: "segway-navimow-i105n", term: "segway navimow i105n", volume: 320, difficulty: 8 },
  { slug: "husqvarna-automower-430x", term: "husqvarna automower 430x", volume: 260, difficulty: 0 },
  { slug: "husqvarna-automower-415x", term: "husqvarna automower 415x", volume: 170, difficulty: 0 },
  { slug: "segway-navimow-x330", term: "segway navimow x330", volume: 170, difficulty: 0 },
]);

/* Lawn buying guides. These are the three the hub explicitly cedes to, so the
   cannibalisation test already depends on them existing. */
const LAWN_GUIDES: PagePlan[] = [
  {
    path: "/guides/wire-free-robot-lawn-mower/",
    category: "robotic-lawn-mowers",
    type: "guide",
    status: "built",
    intent: "Find a mower I do not have to bury a wire around the garden for.",
    primary: { term: "wire free robot lawn mower", volume: 720, difficulty: 0 },
    secondary: [
      /* The hyphenated form is declared separately because the keyword
         register matches literal strings against rendered copy and Google
         does not. Both are asserted rather than one being assumed. */
      { term: "wire-free robot lawn mower", volume: 720, difficulty: 0 },
      { term: "robot lawn mower without perimeter wire", volume: 210, difficulty: 0 },
      { term: "gps robot lawn mower", volume: 590, difficulty: 48 },
      { term: "lidar robot lawn mower", volume: 90, difficulty: 0 },
      { term: "robot lawn mower without boundary wire", volume: 20, difficulty: 0 },
    ],
    ceded: [
      { term: "robot lawn mower", toPath: "/robots/robotic-lawn-mowers/", why: "The 74,000 head term belongs to the hub. This guide takes one buying constraint off it, not the category." },
    ],
    products: [],
    productsNote: "Product not sourced. The guide needs at least three wire-free mowers before it can recommend anything, and it says so on the page rather than padding around the gap.",
    linksOut: [
      "/robots/robotic-lawn-mowers/",
      "/guides/cheap-robot-lawn-mower/",
      "/guides/robot-lawn-mower-for-hills/",
      "/compare/robotic-lawn-mowers/",
      "/review-methodology/",
    ],
    images: [{ slot: "hero", shows: "A mower crossing an unmarked lawn boundary, no wire visible", supplied: false }],
    /* No ItemList: the page ranks nothing, so emitting one would describe a
       list that is not on the page. It comes back with the products. */
    schema: ["Article", "FAQPage", "BreadcrumbList"],
    research: "31073327230 + 31074893036 · 2026-08-06",
    evidence: "≈1,670/mo combined across eight phrasings at KD 0-48, and boundary wire is the single biggest objection in the category. 2/10 shared domains with the hub's head term — a separate SERP, measured rather than assumed.",
  },
  {
    path: "/guides/robot-lawn-mower-for-hills/",
    category: "robotic-lawn-mowers",
    type: "guide",
    status: "built",
    intent: "Find a mower that will actually climb my slope.",
    primary: { term: "best robot lawn mower for hills", volume: 200, difficulty: 0 },
    secondary: [
      { term: "do robot lawn mowers work on hills", volume: 0, difficulty: 0 },
      { term: "slope", volume: 200, difficulty: 0 },
      { term: "gradient", volume: 0, difficulty: 0 },
      { term: "robot lawn mower slope", volume: 0, difficulty: 0 },
    ],
    ceded: [
      { term: "robot lawn mower", toPath: "/robots/robotic-lawn-mowers/", why: "Head term belongs to the hub. Slope is a constraint the hub names in its terrain section and this guide answers in full." },
      { term: "cheap robot lawn mower", toPath: "/guides/cheap-robot-lawn-mower/", why: "The budget end has no answer to a gradient. This page says so and sends the reader whose lawn turns out flat to the page that does serve them." },
    ],
    products: [],
    productsNote: "Product not sourced. Becomes a shortlist ordered by stated gradient, with the source named beside each figure, once mowers enter the catalogue.",
    linksOut: [
      "/robots/robotic-lawn-mowers/",
      "/guides/wire-free-robot-lawn-mower/",
      "/guides/cheap-robot-lawn-mower/",
      "/compare/robotic-lawn-mowers/",
      "/review-methodology/",
    ],
    images: [{ slot: "hero", shows: "A mower working across a visibly steep bank", supplied: false }],
    schema: ["Article", "FAQPage", "BreadcrumbList"],
    research: "31073327230 + 31074893036 · 2026-08-06",
    evidence: "Small volume, but slope is the category's hardest exclusion — a mower that cannot climb it is returned, not lived with. 7/10 shared domains with 'do robot lawn mowers work on hills' and 3/10 with 'best robot lawn mower': the two hills queries are one page, and it is not the hub.",
  },
  {
    path: "/guides/cheap-robot-lawn-mower/",
    category: "robotic-lawn-mowers",
    type: "guide",
    status: "built",
    intent: "Find the cheapest robot mower that is not a waste of money.",
    primary: { term: "cheap robot lawn mower", volume: 390, difficulty: 11 },
    secondary: [
      { term: "best budget robot lawn mower", volume: 0, difficulty: 0 },
      /* Moved off the wire-free guide, where the long-tail assignment pass had
         put them. A price-first searcher wants the cheap end explained, not a
         lesson in satellite navigation. Between them they are ten times this
         page's own primary. */
      { term: "robot lawn mower price", volume: 1900, difficulty: 0 },
      { term: "robotic lawn mower price", volume: 1600, difficulty: 0 },
    ],
    ceded: [
      { term: "robot lawn mower", toPath: "/robots/robotic-lawn-mowers/", why: "Head term belongs to the hub, which explains the category. This page takes the budget constraint and the price question only." },
    ],
    products: [],
    productsNote: "Product not sourced. No figure is printed here either way — this category discounts hard in late summer, so prices live on product pages with the date they were read.",
    linksOut: [
      "/robots/robotic-lawn-mowers/",
      "/guides/wire-free-robot-lawn-mower/",
      "/guides/robot-lawn-mower-for-hills/",
      "/compare/robotic-lawn-mowers/",
      "/review-methodology/",
    ],
    images: [{ slot: "hero", shows: "An entry-level mower on an ordinary suburban lawn", supplied: false }],
    schema: ["Article", "FAQPage", "BreadcrumbList"],
    research: "31073327230 + 31074893036 · 2026-08-06",
    evidence: "390/mo at KD 11 on its own name, ~3,890 with the price cluster it carries. 4/10 shared domains with 'best robot lawn mower' — the closest call of the three lawn guides, and the first to fold back into the hub if it underperforms.",
  },
];

/* Companion — the seniors guide, ruled as page 3 of that category's map. */
const COMPANION_GUIDE: PagePlan = {
  path: "/guides/robotic-pets-for-elderly/",
  category: "companion-robots",
  type: "guide",
  status: "built",
  intent: "Find a robot pet for an older relative, possibly one living with dementia.",
  primary: { term: "robotic pet for elderly", volume: 390, difficulty: 0 },
  secondary: [
    { term: "elderly care robot", volume: 390, difficulty: 0 },
    { term: "robotic pet for dementia", volume: 170, difficulty: 0 },
    { term: "companion robot for elderly", volume: 140, difficulty: 0 },
    { term: "robotic pets for elderly", volume: 390, difficulty: 0 },
    /* ADDED 8 August 2026. "joy for all companion pet" shares FIVE of ten
       top-ten domains with this page's primary — joyforall.com, alzstore.com,
       reddit.com, keyirobot.com, amazon.com — which is the threshold. The Joy
       For All review that was planned separately is CANCELLED rather than
       deferred, because building it would put two BotPlanet pages into one
       result set. This page was already built waiting for the product:
       "Joy for All and Tombot Jennie are the obvious candidates and neither
       is in the catalogue." Tombot cannot be sold. Joy For All can.
       About 6,500/mo of KD 0-10 traffic onto a page currently ranking for 390. */
    { term: "joy for all companion pet", volume: 1900, difficulty: 0 },
    { term: "joy for all companion pets", volume: 1900, difficulty: 0 },
    { term: "robot cat realistic", volume: 1000, difficulty: 10 },
    { term: "joy for all companion cat", volume: 1000, difficulty: 0 },
    { term: "joy for all cat", volume: 590, difficulty: 0 },
    { term: "joy for all dog", volume: 390, difficulty: 0 },
    { term: "robotic cat for elderly", volume: 320, difficulty: 2 },
    { term: "joy for all orange tabby cat", volume: 210, difficulty: 0 },
    { term: "free robotic pets for seniors", volume: 170, difficulty: 0 },
    { term: "interactive robotic cat toy", volume: 170, difficulty: 0 },
    { term: "best robotic cat for seniors", volume: 110, difficulty: 1 },
    { term: "dementia cat toy", volume: 110, difficulty: 0 },
    { term: "joy for all golden pup", volume: 70, difficulty: 0 },
    { term: "ageless innovation joy for all", volume: 50, difficulty: 5 },
  ],
  ceded: [
    { term: "robot pet", toPath: "/robots/companion-robots/", why: "The 8,100 head term belongs to the hub. This guide takes the care-setting intent, which is a different reader with a different question." },
    { term: "pet camera robot", toPath: "/robots/pet-camera-robots/", why: "Named here because 'checking in from a distance' is one of the three motivations readers arrive with, and the one a companion robot answers worst. Naming the honest alternative is not targeting its term." },
  ],
  refused: [
    /* THE TERM THAT LOOKS OBVIOUS AND IS POISON. "robotic cat" is swamped by
       two unrelated families: robotic cataract surgery ("is robotic cataract
       surgery better", "does medicare cover robotic cataract surgery") and
       "robotic cat litter box", which is BotPlanet's OWN self-cleaning litter
       box category. Targeting it here would cannibalise a category we already
       own with a term that mostly means eye surgery. */
    { term: "robotic cat", volume: 0, why: "Swamped by robotic cataract surgery and by 'robotic cat litter box', which belongs to BotPlanet's own self-cleaning litter box category. Refused outright rather than ceded, because no page of ours should chase it." },
    { term: "tombot jennie", volume: 2400, why: "The other obvious product for this page and it cannot be bought — Tombot takes waitlist deposits rather than selling. Named in the copy as an honest alternative, targeted nowhere." },
  ],
  products: ["joy-for-all-companion-pets"],
  productsNote: "Amazon US B017JQQ00Q confirmed 8 August 2026 — $159.99, in stock, identity read from the listing. This page was built in August waiting for exactly this product; the separately planned Joy For All review is cancelled, not deferred, because the two share five of ten top-ten domains. Catalogue row and verified specification still to come.",
  linksOut: [
    "/robots/companion-robots/",
    "/robots/pet-camera-robots/",
    "/compare/companion-robots/",
    "/review-methodology/",
  ],
  images: [{ slot: "hero", shows: "An older person with a robotic pet, warm and unpatronising", supplied: false }],
  /* No ItemList: nothing is ranked on this page yet. */
  schema: ["Article", "FAQPage", "BreadcrumbList"],
  research: "31081889310 · 2026-08-06",
  evidence: "≈1,090/mo combined across four phrasings, all KD 0, and a genuinely distinct reader from the hub's. The hub gave the term up to build it — it was a secondary on /robots/companion-robots/ until 6 August 2026.",
};

/* Two pool pages the SECOND run proved, 6 August 2026, $0.1795.
   docs/seo/robotic-pool-cleaners-guides-findings.md */
const POOL_ROUND_TWO: PagePlan[] = [
  {
    path: "/best-robots/robotic-pool-cleaners/above-ground-pools/",
    category: "robotic-pool-cleaners",
    type: "best-of",
    status: "built",
    intent: "Find a cleaner that will not wreck my vinyl liner.",
    primary: { term: "robotic pool cleaner for above ground pool", volume: 2400, difficulty: 0 },
    secondary: [
      { term: "robotic pool cleaner for small pool", volume: 260, difficulty: 0 },
      { term: "robotic pool cleaner for vinyl liner", volume: 20, difficulty: 0 },
    ],
    ceded: [
      { term: "best robotic pool cleaner", toPath: "/best-robots/robotic-pool-cleaners/", why: "The general ranking belongs to the parent, which carries above-ground as a section today. This page takes the segment term only." },
      { term: "robotic pool cleaner", toPath: "/robots/robotic-pool-cleaners/", why: "Category head term, owned by the hub." },
    ],
    products: ["aiper-seagull-se", "aiper-scuba-s1", "wybot-c1", "bublue-bubot-800p"],
    linksOut: ["/robots/robotic-pool-cleaners/", "/best-robots/robotic-pool-cleaners/", "/botmatch/robotic-pool-cleaners/"],
    images: [{ slot: "hero", shows: "A cleaner working the floor of an above-ground vinyl pool", supplied: false }],
    schema: ["Article", "ItemList", "FAQPage", "BreadcrumbList"],
    research: "local run · 2026-08-06 · $0.1795",
    evidence: "2,400/mo at KD 0 with a $4.30 CPC. The 1 August run measured above-ground at 140 and merged it — this phrasing was simply not in that seed list. Second-strongest commercial term in the category after cordless, and four catalogue machines already qualify.",
  },
  {
    path: "/best-robots/robotic-pool-cleaners/solar-powered-skimmers/",
    category: "robotic-pool-cleaners",
    type: "best-of",
    status: "planned",
    intent: "Stop leaves sinking before a floor robot has to deal with them.",
    primary: { term: "solar powered pool skimmer", volume: 6600, difficulty: 0 },
    secondary: [
      { term: "solar pool skimmer", volume: 6600, difficulty: 9 },
      { term: "robotic pool skimmer", volume: 2900, difficulty: 24 },
      { term: "automatic pool skimmer", volume: 1600, difficulty: 0 },
      { term: "best solar pool skimmer", volume: 320, difficulty: 0 },
      { term: "pool surface skimmer robot", volume: 210, difficulty: 0 },
    ],
    ceded: [
      { term: "robotic pool cleaner", toPath: "/robots/robotic-pool-cleaners/", why: "A skimmer is a different product class from a cleaner and the hub is where that distinction is drawn." },
    ],
    products: ["betta-se-plus"],
    productsNote: "BLOCKED ON A SECOND SKIMMER. We hold exactly one, and a one-product segment page is thin whatever the volume. Ruling 7 of the 1 August run deferred this on the same gate and the gate has not moved — what changed is that the keyword case is now the strongest in the category that we cannot act on.",
    linksOut: ["/robots/robotic-pool-cleaners/", "/robots/robotic-pool-cleaners/betta-se-plus/", "/best-robots/robotic-pool-cleaners/"],
    images: [{ slot: "hero", shows: "A solar skimmer floating on a leaf-strewn surface, trees overhead", supplied: false }],
    schema: ["Article", "ItemList", "FAQPage", "BreadcrumbList"],
    research: "local run · 2026-08-06 · $0.1795",
    evidence: "~11,600/mo combined across six phrasings, and 'solar powered pool skimmer' is the same 6,600 as 'solar pool skimmer' at KD 0 instead of 9 — the easy-phrasing trick the vacuum category also turned on.",
  },
];

export const PAGE_PLAN: PagePlan[] = [
  ...POOL_ROUND_TWO,
  ...POOL,
  ...POOL_REVIEWS,
  ...HUBS,
  ...COMPARES,
  ...WINDOW_REVIEWS,
  WINDOW_BOTMATCH,
  WINDOW_BEST,
  WINDOW_WORKS_GUIDE,
  ...VACUUM_REVIEWS,
  ...LITTER_REVIEWS,
  ...COMPANION_REVIEWS,
  ...PETCAM_REVIEWS,
  ENABOT_RANGE,
  ...CODING_BUILT,
  ...CODING_REVIEWS,
  ...GRILL_REVIEWS,
  ...LAWN_REVIEWS,
  ...LAWN_GUIDES,
  COMPANION_GUIDE,
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
