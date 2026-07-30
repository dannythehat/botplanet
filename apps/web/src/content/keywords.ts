/**
 * Repository-managed keyword → page map (blueprint W10 / Part 7.1).
 *
 * Evidence: DataForSEO Round 1 (US, Google Ads volume + DataForSEO Labs KD/SERP),
 * researched 2026-07-29, ~$0.36 spend. Notion: "US Launch-Category Assessment —
 * DataForSEO Evidence (Round 1)". Cluster-level research was capped, so several
 * long-tail rows have `usVolume: null` (NOT individually pulled) rather than an
 * invented number. Do not issue duplicate paid requests to fill these — flag for
 * a batched refresh instead.
 *
 * `status`: live = page exists; planned = mapped, not yet built.
 * Each row targets ONE canonical URL and ONE dominant intent to avoid
 * cannibalisation (see `cannibalisation`).
 */

export type Intent = "commercial" | "transactional" | "comparison" | "informational";
export type PageType = "category" | "best_of" | "comparison" | "guide" | "product" | "tool";
export type KwStatus = "live" | "planned";

export interface Keyword {
  primary: string;
  secondary: string[];
  intent: Intent;
  targetUrl: string;
  pageType: PageType;
  usVolume: number | null;
  /** DataForSEO Labs keyword difficulty 0-100 (lower = easier). null if not pulled. */
  kd: number | null;
  cpcUsd: number | null;
  serpFeatures: string[];
  status: KwStatus;
  owner: string;
  dateResearched: string;
  dataForSeoRef: string;
  cannibalisation?: string;
}

const REF = "DataForSEO Round 1 (2026-07-29)";
const OWNER = "BotPlanet editorial";

export const KEYWORDS: Keyword[] = [
  // ---- Category / head term ----
  {
    primary: "robotic pool cleaner", secondary: ["robot pool cleaner", "automatic pool cleaner robot", "pool cleaning robot"],
    intent: "commercial", targetUrl: "/robots/robotic-pool-cleaners/", pageType: "category",
    usVolume: 40500, kd: 0, cpcUsd: 5.17, serpFeatures: ["shopping", "retailer listings", "niche blogs top-5"],
    status: "live", owner: OWNER, dateResearched: "2026-07-29", dataForSeoRef: REF,
    cannibalisation: "Head term owned by the category hub. Best-of pages target 'best…' modifiers only.",
  },
  // ---- Best-of cluster (commercial) ----
  {
    primary: "best robotic pool cleaner", secondary: ["best robot pool cleaner", "top robotic pool cleaners", "best pool cleaning robot 2026"],
    intent: "commercial", targetUrl: "/best/", pageType: "best_of",
    usVolume: null, kd: 10, cpcUsd: 5.17, serpFeatures: ["shopping", "review round-ups"],
    status: "planned", owner: OWNER, dateResearched: "2026-07-29", dataForSeoRef: REF,
    cannibalisation: "General 'best' term. Sub-segments below take the qualified variants.",
  },
  {
    primary: "best cordless robotic pool cleaner", secondary: ["cordless robotic pool cleaner", "best cordless pool robot", "wireless robotic pool cleaner"],
    intent: "commercial", targetUrl: "/best/cordless-robotic-pool-cleaners/", pageType: "best_of",
    usVolume: 22200, kd: 0, cpcUsd: 5.17, serpFeatures: ["shopping", "low competition wedge"],
    status: "planned", owner: OWNER, dateResearched: "2026-07-29", dataForSeoRef: REF,
    cannibalisation: "Primary growth wedge (14× seasonal swing). Distinct from general best-of by 'cordless'.",
  },
  {
    primary: "best robotic pool cleaner for large pools", secondary: ["pool robot for large inground pool", "robotic cleaner 50ft pool"],
    intent: "commercial", targetUrl: "/best/large-pools/", pageType: "best_of",
    usVolume: null, kd: null, cpcUsd: null, serpFeatures: ["shopping"],
    status: "planned", owner: OWNER, dateResearched: "2026-07-29", dataForSeoRef: REF,
    cannibalisation: "Segmented by pool size; intent = large in-ground only.",
  },
  {
    primary: "best robotic pool cleaner for leaves", secondary: ["pool robot for leaves and debris", "best pool cleaner heavy debris"],
    intent: "commercial", targetUrl: "/best/leaves-and-debris/", pageType: "best_of",
    usVolume: null, kd: null, cpcUsd: null, serpFeatures: ["shopping"],
    status: "planned", owner: OWNER, dateResearched: "2026-07-29", dataForSeoRef: REF,
    cannibalisation: "Debris-type intent; large-basket/filtration angle.",
  },
  {
    primary: "best wall-climbing robotic pool cleaner", secondary: ["robotic pool cleaner that climbs walls", "waterline pool robot"],
    intent: "commercial", targetUrl: "/best/wall-climbing/", pageType: "best_of",
    usVolume: null, kd: null, cpcUsd: null, serpFeatures: ["shopping"],
    status: "planned", owner: OWNER, dateResearched: "2026-07-29", dataForSeoRef: REF,
    cannibalisation: "Coverage intent (walls + waterline); distinct from floor-only.",
  },
  {
    primary: "best robotic pool cleaner for above ground pools", secondary: ["above ground pool robot", "cordless cleaner for above ground pool"],
    intent: "commercial", targetUrl: "/best/above-ground-pools/", pageType: "best_of",
    usVolume: null, kd: null, cpcUsd: null, serpFeatures: ["shopping"],
    status: "planned", owner: OWNER, dateResearched: "2026-07-29", dataForSeoRef: REF,
    cannibalisation: "Environment = above-ground; pairs with in-ground page as a matched set.",
  },
  {
    primary: "best robotic pool cleaner for inground pools", secondary: ["inground pool robot", "best in ground pool cleaner robot"],
    intent: "commercial", targetUrl: "/best/inground-pools/", pageType: "best_of",
    usVolume: null, kd: null, cpcUsd: null, serpFeatures: ["shopping"],
    status: "planned", owner: OWNER, dateResearched: "2026-07-29", dataForSeoRef: REF,
    cannibalisation: "Environment = in-ground.",
  },
  {
    primary: "best budget robotic pool cleaner", secondary: ["cheap robotic pool cleaner", "robotic pool cleaner under 500"],
    intent: "commercial", targetUrl: "/best/budget/", pageType: "best_of",
    usVolume: null, kd: null, cpcUsd: null, serpFeatures: ["shopping"],
    status: "planned", owner: OWNER, dateResearched: "2026-07-29", dataForSeoRef: REF,
    cannibalisation: "Price-segment intent; no overlap with premium picks.",
  },
  // ---- Comparisons ----
  {
    primary: "dolphin vs aiper pool cleaner", secondary: ["aiper vs dolphin", "dolphin or aiper robotic pool cleaner"],
    intent: "comparison", targetUrl: "/compare/robotic-pool-cleaners/", pageType: "comparison",
    usVolume: null, kd: 4, cpcUsd: null, serpFeatures: ["comparison", "forums"],
    status: "live", owner: OWNER, dateResearched: "2026-07-29", dataForSeoRef: REF,
    cannibalisation: "Brand-vs-brand; specific model pairs get their own /compare/…-vs-… URLs.",
  },
  {
    primary: "dolphin nautilus cc plus vs aiper scuba x1", secondary: [],
    intent: "comparison", targetUrl: "/compare/robotic-pool-cleaners/dolphin-nautilus-cc-plus-vs-aiper-scuba-x1/", pageType: "comparison",
    usVolume: null, kd: null, cpcUsd: null, serpFeatures: ["comparison"],
    status: "planned", owner: OWNER, dateResearched: "2026-07-29", dataForSeoRef: REF,
  },
  // ---- Educational guides (informational) ----
  { primary: "how do robotic pool cleaners work", secondary: ["how does a pool robot work", "robotic pool cleaner explained"], intent: "informational", targetUrl: "/guides/how-robotic-pool-cleaners-work/", pageType: "guide", usVolume: null, kd: null, cpcUsd: null, serpFeatures: ["featured snippet", "video"], status: "planned", owner: OWNER, dateResearched: "2026-07-29", dataForSeoRef: REF },
  { primary: "corded vs cordless robotic pool cleaner", secondary: ["are cordless pool robots better", "cordless or corded pool cleaner"], intent: "informational", targetUrl: "/guides/corded-vs-cordless-pool-cleaners/", pageType: "guide", usVolume: null, kd: null, cpcUsd: null, serpFeatures: ["featured snippet"], status: "planned", owner: OWNER, dateResearched: "2026-07-29", dataForSeoRef: REF },
  { primary: "floor vs wall vs waterline pool cleaning", secondary: ["do i need a pool robot that climbs walls", "waterline cleaning robot"], intent: "informational", targetUrl: "/guides/floor-wall-waterline-cleaning/", pageType: "guide", usVolume: null, kd: null, cpcUsd: null, serpFeatures: [], status: "planned", owner: OWNER, dateResearched: "2026-07-29", dataForSeoRef: REF },
  { primary: "how to choose a robotic pool cleaner for pool size and shape", secondary: ["what size pool robot do i need", "pool cleaner for freeform pool"], intent: "informational", targetUrl: "/guides/choosing-by-pool-size-and-shape/", pageType: "guide", usVolume: null, kd: null, cpcUsd: null, serpFeatures: [], status: "planned", owner: OWNER, dateResearched: "2026-07-29", dataForSeoRef: REF },
  { primary: "robotic pool cleaner maintenance", secondary: ["how to clean a pool robot filter", "pool robot care"], intent: "informational", targetUrl: "/guides/maintenance/", pageType: "guide", usVolume: null, kd: null, cpcUsd: null, serpFeatures: ["video"], status: "planned", owner: OWNER, dateResearched: "2026-07-29", dataForSeoRef: REF },
  { primary: "how often should you run a robotic pool cleaner", secondary: ["how long to run pool robot", "how often run pool cleaner"], intent: "informational", targetUrl: "/guides/how-often-to-run/", pageType: "guide", usVolume: null, kd: null, cpcUsd: null, serpFeatures: ["featured snippet"], status: "planned", owner: OWNER, dateResearched: "2026-07-29", dataForSeoRef: REF },
  { primary: "can a robotic pool cleaner stay in the pool", secondary: ["should i leave my pool robot in the pool", "leaving pool cleaner in water"], intent: "informational", targetUrl: "/guides/can-it-stay-in-the-pool/", pageType: "guide", usVolume: null, kd: null, cpcUsd: null, serpFeatures: ["featured snippet"], status: "planned", owner: OWNER, dateResearched: "2026-07-29", dataForSeoRef: REF },
  { primary: "common robotic pool cleaner problems", secondary: ["pool robot not climbing walls", "pool cleaner troubleshooting"], intent: "informational", targetUrl: "/guides/common-problems/", pageType: "guide", usVolume: null, kd: null, cpcUsd: null, serpFeatures: ["forums"], status: "planned", owner: OWNER, dateResearched: "2026-07-29", dataForSeoRef: REF },
  { primary: "pool robot filter types and debris", secondary: ["fine vs ultra fine pool filter", "what micron filter for pollen pool"], intent: "informational", targetUrl: "/guides/filter-types-and-debris/", pageType: "guide", usVolume: null, kd: null, cpcUsd: null, serpFeatures: [], status: "planned", owner: OWNER, dateResearched: "2026-07-29", dataForSeoRef: REF },
  { primary: "what to know before buying a robotic pool cleaner", secondary: ["robotic pool cleaner buying guide", "things to know pool robot"], intent: "informational", targetUrl: "/guides/what-to-know-before-buying/", pageType: "guide", usVolume: null, kd: null, cpcUsd: null, serpFeatures: ["featured snippet"], status: "planned", owner: OWNER, dateResearched: "2026-07-29", dataForSeoRef: REF },
];

export const keywordFor = (targetUrl: string): Keyword | undefined => KEYWORDS.find((k) => k.targetUrl === targetUrl);
