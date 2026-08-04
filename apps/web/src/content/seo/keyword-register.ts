/**
 * The keyword register — what each page is trying to rank for.
 *
 * THE PROBLEM THIS SOLVES. The research run of 1 August 2026 produced a
 * keyword-to-URL map, and it lives in a markdown findings document. A document
 * cannot be checked: copy gets rewritten, a heading gets sharpened, and the
 * term the page was built around quietly leaves it. Nobody notices until a
 * rank report arrives months later showing a page that never had a chance.
 *
 * So the assignment lives here, in code, next to a test that reads the actual
 * rendered content and fails if a page has stopped containing the thing it is
 * meant to rank for. That is the whole point: this file is not documentation,
 * it is an assertion.
 *
 * IT IS ALSO THE BASELINE FOR RANK TRACKING. When position checking starts,
 * these are the terms to check, per URL, with the volume and difficulty they
 * were chosen on — so a later "we're not ranking" conversation can be had
 * against what was actually targeted rather than against memory.
 *
 * Volumes and difficulties are verbatim from the research run. They are a
 * snapshot of 1 August 2026, not a live figure, and are dated as such.
 */

export interface KeywordTarget {
  /** The exact term, lowercase, as researched. */
  term: string;
  /** US monthly search volume at the time of the run. */
  volume: number;
  /** Keyword difficulty, 0-100. */
  difficulty: number;
  /**
   * Must this term appear in the page's own copy? True for the term the page
   * is built around; false for a term we expect to pick up incidentally.
   */
  mustAppear: boolean;
}

export interface PageKeywords {
  /** Canonical path, exactly as the route registry has it. */
  path: string;
  /** The single term the page is built around. */
  primary: KeywordTarget;
  /** Terms the page should also serve, in priority order. */
  secondary: KeywordTarget[];
  /** Terms deliberately NOT targeted here, and where they went instead. */
  cededTo?: { term: string; path: string; why: string }[];
  /** Research run these figures came from. */
  researchedOn: string;
}

const RUN = "2026-08-01";

export const KEYWORD_REGISTER: PageKeywords[] = [
  {
    path: "/robots/robotic-pool-cleaners/",
    // Google groups "robotic pool cleaner", "robot pool cleaner" and "pool
    // cleaning robot" into one cluster, so the 40,500 is the cluster's.
    primary: { term: "robotic pool cleaner", volume: 40500, difficulty: 14, mustAppear: true },
    secondary: [
      { term: "pool cleaning robot", volume: 40500, difficulty: 14, mustAppear: true },
      { term: "robotic pool cleaners", volume: 40500, difficulty: 14, mustAppear: true },
      { term: "inground robotic pool cleaner", volume: 0, difficulty: 0, mustAppear: true },
      { term: "above ground pool robot", volume: 0, difficulty: 0, mustAppear: false },
      { term: "wall climbing robotic pool cleaner", volume: 0, difficulty: 0, mustAppear: true },
      { term: "robotic pool vacuum", volume: 0, difficulty: 0, mustAppear: true },
    ],
    cededTo: [
      {
        term: "cordless robotic pool cleaner",
        path: "/best-robots/robotic-pool-cleaners/cordless/",
        why: "22,200/mo at KD 0 and the SERP is list content, so it earns its own best-of page. The hub explains corded versus cordless as a decision but does not compete for the term.",
      },
      {
        term: "best robotic pool cleaner",
        path: "/best-robots/robotic-pool-cleaners/",
        why: "A ranked best-of SERP. A hub that also chased it would split the site against itself.",
      },
      {
        term: "are robotic pool cleaners worth it",
        path: "/guides/are-robotic-pool-cleaners-worth-it/",
        why: "The hub answers it in a verdict section; the standalone guide takes the query.",
      },
    ],
    researchedOn: RUN,
  },
  {
    /* Review pages target the model name and the questions asked about it.
       They must never chase the category head term: the hub owns that, and a
       review competing for it would split the site against itself for a query
       it cannot win. */
    path: "/robots/robotic-pool-cleaners/dolphin-nautilus-cc-plus/",
    primary: { term: "dolphin nautilus cc plus review", volume: 0, difficulty: 0, mustAppear: true },
    secondary: [
      { term: "dolphin nautilus cc plus wi-fi", volume: 0, difficulty: 0, mustAppear: true },
      { term: "dolphin nautilus cc plus", volume: 0, difficulty: 0, mustAppear: true },
      // The review's second section is built around this question, and it is
      // the reason the page exists rather than a spec sheet.
      { term: "does the dolphin nautilus cc plus clean the waterline", volume: 0, difficulty: 0, mustAppear: true },
      { term: "dolphin nautilus cc plus max pool size", volume: 0, difficulty: 0, mustAppear: true },
      { term: "dolphin nautilus cc plus filter", volume: 0, difficulty: 0, mustAppear: true },
      { term: "mydolphin plus app", volume: 0, difficulty: 0, mustAppear: true },
    ],
    cededTo: [
      {
        term: "robotic pool cleaner",
        path: "/robots/robotic-pool-cleaners/",
        why: "The category head term belongs to the hub. A single-model review ranking for it would be the wrong result for the searcher and would compete with our own page.",
      },
      {
        term: "best robotic pool cleaner",
        path: "/best-robots/robotic-pool-cleaners/",
        why: "A comparison SERP. One review is not a best-of.",
      },
    ],
    /* Volumes are zero because this run measured the category cluster, not
       model-level terms. Recorded as 0 rather than guessed — a made-up volume
       is worse than a blank, because it gets planned against. */
    researchedOn: RUN,
  },
  {
    path: "/robots/robotic-pool-cleaners/polaris-freedom/",
    primary: { term: "polaris freedom review", volume: 0, difficulty: 0, mustAppear: true },
    secondary: [
      { term: "polaris freedom cordless robotic pool cleaner", volume: 0, difficulty: 0, mustAppear: true },
      { term: "polaris freedom", volume: 0, difficulty: 0, mustAppear: true },
      // The section the page is actually built around, and the reason it beats
      // a spec sheet: the pool-size limit exists only in marketing artwork.
      { term: "polaris freedom max pool size", volume: 0, difficulty: 0, mustAppear: true },
      { term: "polaris freedom battery", volume: 0, difficulty: 0, mustAppear: true },
      { term: "polaris freedom runtime", volume: 0, difficulty: 0, mustAppear: true },
      { term: "iaqualink", volume: 0, difficulty: 0, mustAppear: true },
    ],
    cededTo: [
      {
        term: "robotic pool cleaner",
        path: "/robots/robotic-pool-cleaners/",
        why: "The category head term belongs to the hub, for the same reason it does on every other review.",
      },
      {
        term: "best robotic pool cleaner",
        path: "/best-robots/robotic-pool-cleaners/",
        why: "A comparison SERP. One review is not a best-of.",
      },
      {
        term: "cordless robotic pool cleaner",
        path: "/best-robots/robotic-pool-cleaners/cordless/",
        why: "THE ONE THIS PAGE WOULD MOST LIKE TO HAVE, AND MUST NOT TAKE. The Freedom is our flagship cordless machine, so a review targeting the cordless head term is the single most likely piece of self-cannibalisation on this site. That query wants a shortlist; this page is one product. Ceded on purpose.",
      },
      {
        term: "dolphin nautilus cc plus review",
        path: "/robots/robotic-pool-cleaners/dolphin-nautilus-cc-plus/",
        why: "The Nautilus is named on this page as the corded comparison. Naming a rival is not targeting its term.",
      },
    ],
    researchedOn: RUN,
  },
  {
    path: "/robots/robotic-pool-cleaners/betta-se-plus/",
    primary: { term: "betta se plus review", volume: 0, difficulty: 0, mustAppear: true },
    secondary: [
      { term: "solar pool skimmer", volume: 0, difficulty: 0, mustAppear: true },
      { term: "robotic pool skimmer", volume: 0, difficulty: 0, mustAppear: true },
      { term: "betta se plus", volume: 0, difficulty: 0, mustAppear: true },
      // The question the page is built to answer, and the one most likely to
      // be typed by someone about to buy the wrong machine.
      { term: "does the betta se plus clean the pool floor", volume: 0, difficulty: 0, mustAppear: true },
      { term: "betta se plus runtime", volume: 0, difficulty: 0, mustAppear: true },
      { term: "betta se plus warranty", volume: 0, difficulty: 0, mustAppear: true },
    ],
    cededTo: [
      {
        term: "robotic pool cleaner",
        path: "/robots/robotic-pool-cleaners/",
        why: "The category head term belongs to the hub — and doubly so here, because this machine is not a pool cleaner. Ranking a skimmer for that query would be the wrong answer for the searcher AND a bad result for us.",
      },
      {
        term: "best robotic pool cleaner",
        path: "/best-robots/robotic-pool-cleaners/",
        why: "A comparison SERP. One review is not a best-of.",
      },
      {
        term: "cordless robotic pool cleaner",
        path: "/best-robots/robotic-pool-cleaners/cordless/",
        why: "Cordless it is, a pool cleaner it is not. Chasing that term would put a surface skimmer in front of people shopping for a floor robot.",
      },
    ],
    researchedOn: RUN,
  },
];

export const keywordsFor = (path: string): PageKeywords | undefined =>
  KEYWORD_REGISTER.find((k) => k.path === path);

/** Every term that must literally appear on a given page. */
export const requiredTerms = (path: string): string[] => {
  const k = keywordsFor(path);
  if (!k) return [];
  return [k.primary, ...k.secondary].filter((t) => t.mustAppear).map((t) => t.term);
};
