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
  /**
   * Set when the page needs a row but is not competing for anything, with the
   * reason. The row still records the real term and its real volume.
   *
   * WHY THIS IS A FIELD AND NOT A COMMENT. /privacy/ is built around the words
   * "privacy policy" and the bare word "privacy" is 110,000 a month; /terms/ is
   * 74,000. Both figures are true and both are worthless: nobody typing them
   * wants a robot shop, and a page that tried to win them would be a privacy
   * policy written for a search engine. A comment saying so is documentation
   * and this file's whole point is that it asserts rather than documents — so
   * the audit reads this flag and stops applying SERP economics to a page that
   * is not in a SERP fight. Without it, the next person to open a rank report
   * sees 110,000 next to a page we rank nowhere for and starts optimising a
   * legal document.
   */
  notRanking?: string;
  /** Research run these figures came from. */
  researchedOn: string;
}

const RUN = "2026-08-01";
/** Window research: run 30981257806, 2026-08-05, $0.2044. */
const RUN_WINDOW = "2026-08-05";
/** Lawn research: runs 31073327230 + 31074893036, 2026-08-06, $0.22428. */
const RUN_LAWN = "2026-08-06";
/** Companion + pet camera research: run 31081889310, 2026-08-06, $0.2224. */
const RUN_COMPANION = "2026-08-06";
/** Litter boxes: runs 31090590604 + 31091110791, 2026-08-06, $0.2405 combined. */
const RUN_LITTER = "2026-08-06";
/** Grill cleaners: run 31092662805, 2026-08-06. */
const RUN_GRILL = "2026-08-06";
/** Robot vacuums: run 31090094137, 2026-08-06, $0.2229. */
const RUN_VACUUM = "2026-08-06";
/** Coding robots: runs 31094454463 + 31094682067 (SERP top-up), 2026-08-06. */
const RUN_CODING = "2026-08-06";
/**
 * The fifty-page fill, 2026-08-10. DataForSEO Google Ads live search volume
 * plus Labs bulk keyword difficulty, United States, English, $0.54 all in.
 * 419 constructed candidates measured, 4,980 more discovered from the seeds,
 * and the winners re-measured for difficulty.
 *
 * WHY IT HAPPENED. scripts/audit-seo.mjs found fifty indexable pages with no
 * row here at all — every litter, lawn and window review, every compare page,
 * the homepage, and the whole utility tree. A page with no row is a page this
 * file asserts nothing about, so its copy could drift off its term and no test
 * would notice. Fifty of ninety-four were in that state.
 */
const RUN_AUGUST_10 = "2026-08-10";

/* @extension-point per-category | required | Also per-page and per-product —
   every published URL needs a row. Without one, keywords.test.ts cannot assert
   the page still contains the term it was built to rank for, so the page can
   silently drift off its keyword. This register is also what the Notion
   Content & SEO Control Register mirrors. */
/**
 * A NOTE ON mustAppear, AFTER TWENTY-SEVEN OF THEM WERE WRONG.
 *
 * The flag means "this page's copy contains this phrase, verbatim" — it is an
 * assertion checked against the rendered page, not a plan. Twenty-seven
 * secondaries across eleven pages carried `true` for phrases the copy never
 * says as a phrase: "betta se plus runtime", "aiper scuba v3 filter",
 * "dolphin proteus dx4 plus max pool size". Every word is on the page; the
 * string is not, because nobody writes "betta se plus runtime" in a sentence.
 * The page says "Runtime" in a specification table under a heading naming the
 * machine, which is how a specification is written and how an engine reads it.
 *
 * They are `false` now, which is what the field was always for: a term we
 * expect to pick up incidentally rather than one the page is built around.
 * Setting them true asserted something untrue and, worse, would have invited
 * somebody to bolt the phrases into the prose to satisfy a test.
 */
export const KEYWORD_REGISTER: PageKeywords[] = [
  /* Window and lawn hubs were missing from this register until 6 August 2026 —
     both pages were live, neither had a row, so keywords.test.ts was asserting
     nothing about either. Found by scripts/extension-points.mjs, which is the
     entire reason that script exists. */
  {
    path: "/robots/window-cleaning-robots/",
    /* Google groups "robot window cleaner", "robotic window cleaner", "window
       cleaner robot" and "window washing robot" into this one cluster, so the
       12,100 is the cluster's, not this phrasing's alone. */
    primary: { term: "window cleaning robot", volume: 12100, difficulty: 5, mustAppear: true },
    secondary: [
      /* A genuinely separate cluster with its own volume and its own KD, not a
         variant of the primary. It earns a place in the intro copy. */
      { term: "automatic window cleaner", volume: 8100, difficulty: 0, mustAppear: true },
      { term: "robot window cleaner", volume: 12100, difficulty: 5, mustAppear: true },
      { term: "window cleaning robots", volume: 12100, difficulty: 5, mustAppear: true },
      { term: "frameless", volume: 0, difficulty: 0, mustAppear: true },
      { term: "safety tether", volume: 0, difficulty: 0, mustAppear: false },
      /* THE COMMERCIAL HALF, RECLAIMED 12 AUGUST 2026. These four belonged to
         /best-robots/window-cleaning-robots/ from 7 August until that page
         folded back into this one. They are here rather than there because the
         note below has been true since 5 August and was overruled by a build
         rather than by a measurement. */
      { term: "best window cleaning robot", volume: 1300, difficulty: 3, mustAppear: true },
      { term: "best robot window cleaner", volume: 1300, difficulty: 3, mustAppear: true },
      { term: "window cleaning robot reviews", volume: 1000, difficulty: 7, mustAppear: true },
      /* A SECTION, not a page, and the claim most makers write and fewest
         support with a number. Carried in the buying checklist. */
      { term: "high rise", volume: 0, difficulty: 0, mustAppear: true },
    ],
    cededTo: [
      {
        term: "window cleaning robot comparison",
        path: "/compare/window-cleaning-robots/",
        why: "20/mo at KD 45 — the hardest term in the category and the least traffic in it. Refused as a ranking target entirely; the comparison tool exists for readers, not for this query.",
      },
    ],
    /* NOTE: "best window cleaning robot" is deliberately NOT ceded. It is
       carried by this page. Six of the top ten results are identical between
       the two terms and NYTimes ranks first for both with one article, so a
       separate best-of page would have competed with this one for the same
       result set.

       THAT NOTE WAS WRITTEN ON 5 AUGUST 2026 AND IGNORED ON 7 AUGUST, when
       /best-robots/window-cleaning-robots/ was built for exactly the term it
       forbids. The measurement never changed — 6 of 10 shared domains is over
       the 5-of-10 line that decides one page or two — so the page folded back
       into this one on 12 August rather than the note being rewritten to suit
       it. Compare the lawn pair, which measured 2 of 10 and correctly has two
       URLs. Same rule, different evidence, opposite answers. */
    researchedOn: RUN_WINDOW,
  },
  {
    path: "/robots/educational-coding-robots/",
    /* Page 010, the last of the locked ten. Runs 31094454463 + 31094682067.

       NAMED FOR THE DEMAND, NOT THE TOPIC. Notion calls this "educational and
       coding robots" and the SERPs say those are two different things sharing
       four domains:
         coding robot      1,300  KD 21  makeblock, sphero, botzees,
                                         learningresources, stemeducationguide
         educational robot   720  KD  2  robotshop, ez-robot, WIKIPEDIA,
                                         standardbots, "Robots for Colleges"
       One is parents and retailers, the other is institutional procurement and
       an encyclopedia entry — the shape that ended security robots. The page
       is built on the coding family; "educational robot" is picked up, not
       chased.

       THE AGE VARIANTS ARE ONE PAGE, which was the open question. coding
       robots for toddlers vs coding robots for teens shares SIX top-ten
       domains. The two ends of the age range return the same result set, so
       the split lives in sections rather than URLs.

       THE STEM-TOY SWALLOW DID NOT HAPPEN. This was the grill-brush risk
       again and it cleared: stem toys (8,100) shares 2 domains with
       programmable robot, 4 with robot kit for kids, 1 with coding robots for
       toddlers. It is internally cohesive at 6 with best stem toys for kids —
       a separate family that belongs to toy retailers.

       THE HEAD TERM IS SMALL AND THE PRODUCTS ARE ENORMOUS, the reverse of
       every other category here: vex iq 18,100, ozobot 14,800, lego mindstorms
       9,900, lego education spike prime 5,400, sphero bolt 4,400, bee bot
       4,400. The hub cannot carry this category alone. The reviews are the
       business and the hub exists to route a parent to the right one. */
    primary: { term: "coding robot", volume: 1300, difficulty: 21, mustAppear: true },
    secondary: [
      { term: "coding robots for kids", volume: 1300, difficulty: 21, mustAppear: true },
      { term: "robotics kit", volume: 5400, difficulty: 0, mustAppear: true },
      { term: "programmable robot", volume: 590, difficulty: 29, mustAppear: true },
      { term: "stem robot", volume: 1000, difficulty: 0, mustAppear: true },
      { term: "educational robot", volume: 720, difficulty: 2, mustAppear: true },
      { term: "screen-free", volume: 140, difficulty: 0, mustAppear: true },
      { term: "block coding", volume: 0, difficulty: 0, mustAppear: true },
    ],
    cededTo: [
      {
        term: "stem toys",
        path: "",
        why: "8,100/mo and refused rather than ceded. It shares 2 top-ten domains with 'programmable robot' and 1 with 'coding robots for toddlers', while sharing 6 with 'best stem toys for kids' — a cohesive family of its own belonging to toy retailers and Wirecutter. Six times our head term, and not our SERP.",
      },
      {
        term: "ai robot for kids",
        path: "",
        why: "Refused here as well as on the companion hub, and this run is what settles it. It shares exactly ONE top-ten domain — amazon.com — with every single term in this category, and one with companion robots too. It belongs to neither page and to no page BotPlanet currently plans. Recorded so the refusal is not re-opened by someone assuming it must live somewhere.",
      },
      {
        term: "vex iq",
        path: "",
        why: "18,100/mo — fourteen times this page's head term — and a single manufacturer's product line sold largely through schools and competition programmes. Review territory at most; not a term the hub chases.",
      },
      {
        term: "lego mindstorms",
        path: "",
        why: "9,900/mo for a product LEGO retired. The demand is real and largely nostalgic or second-hand, which is not a market BotPlanet can serve with an affiliate link.",
      },
    ],
    /* NOTE: the age variants are NOT ceded — this page carries all of them.
       "coding robots for toddlers" and "coding robots for teens" share 6
       top-ten domains with each other, and 5 each with "programmable robot".
       "coding robots for schools" also sits inside the consumer family at 5
       shared, rather than being the separate B2B silo the run was testing
       for — though at 10/mo it is a section sentence, not a strategy. */
    researchedOn: RUN_CODING,
  },
  {
    path: "/robots/robot-vacuums/",
    /* Page 009 and the largest category on the site. Run 31090094137.

       ONE URL CARRIES EVERYTHING, which was not the expected answer — mopping
       and self-emptying were the two likeliest page splits and both measured
       firmly inside the hub. Against "robot vacuum": robot vacuum and mop 7
       shared top-ten domains, self emptying robot vacuum 7, best robot vacuum
       6, best robot vacuum and mop 6, robot mop 6, best for large house 6,
       best self emptying 5, for carpet 5, best for pet hair 5.

       THE DIFFICULTY GAP BETWEEN PHRASINGS IS THE WIDEST ON THE SITE, and it
       is what the copy is built around:
         robot vacuum and mop     40,500  KD 29
         robot vacuum that mops   40,500  KD  8
         robot mop                12,100  KD 34
         mopping robot            12,100  KD  7
       Identical volume, a quarter of the difficulty. Google clusters these
       phrasings and reports the group volume against each, so targeting the
       easy phrasing costs nothing and buys the same traffic.

       This is also the most defended SERP BotPlanet has faced: Wirecutter,
       PCMag, RTINGS, The Verge, Consumer Reports and vacuumwars all rank on
       the head term. KD 25 understates that. The page is named for the head
       and expects to earn it through the easier cluster first.

       "roborock" at 110,000 is a third consecutive category where a brand
       outweighs the commercial term — it beats "best robot vacuum" at 60,500.
       Secondary mention, not a target. */
    primary: { term: "robot vacuum", volume: 135000, difficulty: 25, mustAppear: true },
    secondary: [
      { term: "robot vacuum and mop", volume: 40500, difficulty: 29, mustAppear: true },
      { term: "robot vacuum that mops", volume: 40500, difficulty: 8, mustAppear: true },
      { term: "robot vacuum cleaner", volume: 135000, difficulty: 36, mustAppear: true },
      { term: "robot vacuums", volume: 135000, difficulty: 25, mustAppear: true },
      { term: "self emptying", volume: 12100, difficulty: 14, mustAppear: true },
      { term: "pet hair", volume: 18100, difficulty: 8, mustAppear: true },
      { term: "carpet", volume: 2900, difficulty: 3, mustAppear: true },
      { term: "hard floors", volume: 1900, difficulty: 7, mustAppear: true },
      { term: "roborock", volume: 110000, difficulty: 54, mustAppear: false },
    ],
    cededTo: [
      {
        term: "roborock",
        path: "",
        why: "110,000/mo — more than 'best robot vacuum' at 60,500 — and refused as a target rather than ceded. Roborock's own site ranks on the head term and holds the brand query outright. Third category running where a manufacturer owns more demand than the category's commercial query, and the same ruling applies: a comparison site does not take a brand term off its owner.",
      },
      {
        term: "irobot roomba",
        path: "",
        why: "27,100/mo, same ruling. iRobot ranks its own site on the head term. These belong to review pages when the catalogue exists, not to the hub.",
      },
      {
        term: "best robot vacuum for hardwood floors",
        path: "/robots/robot-vacuums/#floors",
        why: "2,400/mo and 4 shared domains with the head term, but 5 with 'best robot vacuum' — same family as the best-of cluster the hub already carries. Section, not a guide.",
      },
      {
        term: "best budget robot vacuum",
        path: "/robots/robot-vacuums/#cost",
        why: "2,900/mo and 7 shared top-ten domains with 'best robot vacuum'. Firmly the same result set. The price section carries it.",
      },
    ],
    /* NOTE: "best robot vacuum" (60,500) is NOT ceded — this page carries it,
       on 6 shared domains with the head term. Nor are "robot mop" (12,100) or
       "self emptying robot vacuum" (12,100), at 6 and 7 shared respectively.
       All three were candidate second URLs before the run and all three are
       one page after it. */
    researchedOn: RUN_VACUUM,
  },
  {
    path: "/robots/grill-cleaning-robots/",
    /* Page 006. Run 31092662805.

       THIS PAGE EXISTS BECAUSE A RUN DESIGNED TO KILL IT FAILED. Grillbot is
       close to the only robotic grill cleaner with US retail presence, which
       is where security robots stood before it was cancelled, so the budget
       went on proving demand rather than assuming it.

       The head term is 5,400/mo at KD 0 and returns grillbots.com, Amazon
       twice, Walmart, Consumer Reports and Food & Wine — retail and real
       editorial. Nothing like the Adobe Stock result that killed security.

       THE GRILL-BRUSH SWALLOW WAS THE REAL RISK AND IT DID NOT HAPPEN.
       "grill cleaning robot" shares TWO top-ten domains with "grill brush"
       (33,100/mo) — amazon.com and reddit.com, both universal. Discount them
       and the overlap is zero. Same against best grill brush, bristle free
       grill brush and safest grill brush: 2, 2, 2. The brush market is a
       different SERP and this page is not in it, which is the right outcome
       even though it means walking away from six times the traffic.

       Google groups the phrasings hard: robotic grill cleaner, robot grill
       cleaner and grill cleaning robots all read 5,400 too. That is 5,400 for
       the family, not each.

       SEASONALITY IS THE SHARPEST ON THE SITE — 18,100 in June against 720 in
       February, a 25x swing. The page must be indexed before spring or it
       misses the year. */
    primary: { term: "grill cleaning robot", volume: 5400, difficulty: 0, mustAppear: true },
    secondary: [
      { term: "robotic grill cleaner", volume: 5400, difficulty: 0, mustAppear: true },
      { term: "automatic grill cleaner", volume: 1900, difficulty: 0, mustAppear: true },
      { term: "grill cleaning robots", volume: 5400, difficulty: 0, mustAppear: true },
      { term: "bbq cleaning robot", volume: 170, difficulty: 1, mustAppear: false },
      { term: "grillbot", volume: 18100, difficulty: 11, mustAppear: false },
      { term: "porcelain", volume: 90, difficulty: 0, mustAppear: true },
      { term: "cast iron", volume: 480, difficulty: 0, mustAppear: true },
    ],
    cededTo: [
      {
        term: "grill brush",
        path: "",
        why: "33,100/mo — six times this page's head term — and refused outright rather than ceded. It shares two top-ten domains with the robot term, both of which appear on nearly every query in the space. It is the manual-tool market, BotPlanet compares robots, and chasing it would mean competing with every brush manufacturer on the internet for traffic that does not want a robot.",
      },
      {
        term: "bristle free grill brush",
        path: "/robots/grill-cleaning-robots/#bristles",
        why: "5,400/mo and tempting, because bristle safety is the honest argument for this whole category. But it shares only 2 domains with the head term — it is a brush SERP owned by brush makers. It is the page's most important section and not a term the page targets.",
      },
      {
        term: "grillbot review",
        path: "",
        why: "5,400/mo at KD 0, and it belongs to a review page rather than the hub. It shares 8 top-ten domains with 'does grillbot work', which is the same page again, and 5 with the hub — same family, different job.",
      },
      {
        term: "how to clean grill grates",
        path: "",
        why: "6,600/mo and one shared domain with the head term. A cooking-content SERP, not a shopping one. Refused.",
      },
    ],
    /* NOTE: "best grill cleaning robot" is NOT ceded — this page carries it.
       It is 10/mo and shares 5 domains with the head term, so a best-of page
       would be a second URL for a term nobody searches. */
    researchedOn: RUN_GRILL,
  },
  {
    path: "/robots/self-cleaning-litter-boxes/",
    /* Page 004. Runs 31090590604 (SERPs) + 31091110791 (volume repair).

       THE HEAD TERM IS THE PRIMARY AND THE "AUTOMATIC" PHRASINGS ARE THE PLAN.
       "self cleaning litter box" is 110,000/mo at KD 46 — the hardest head
       term on the site, against pool's 14 and window's 0-5. The same family's
       automatic phrasings are far more winnable for nearly the same traffic:
       automatic litter box 90,500 at KD 26, automatic cat litter box 49,500 at
       KD 11, best automatic litter box 22,200 at KD 8. The page is named for
       the category and written to take the easy half, exactly as lawn was.

       THE BRAND OUTWEIGHS THE CATEGORY, which has not happened before on this
       site. "litter robot" is 165,000/mo — 50% above the category term — and
       Whisker holds positions one and two with litter-robot.com and
       whisker.com. It shares 6 top-ten domains with the head term so it is the
       same family, and it is recorded as a secondary because the page will
       legitimately be about these machines. It is not a term a comparison site
       takes off its owner, and nothing here pretends otherwise. */
    primary: { term: "self cleaning litter box", volume: 110000, difficulty: 46, mustAppear: true },
    secondary: [
      { term: "automatic litter box", volume: 90500, difficulty: 26, mustAppear: true },
      { term: "self cleaning cat litter box", volume: 110000, difficulty: 46, mustAppear: true },
      { term: "automatic cat litter box", volume: 49500, difficulty: 11, mustAppear: true },
      { term: "best automatic litter box", volume: 22200, difficulty: 8, mustAppear: true },
      { term: "robotic litter box", volume: 14800, difficulty: 19, mustAppear: true },
      { term: "best self cleaning litter box", volume: 9900, difficulty: 21, mustAppear: true },
      { term: "litter robot", volume: 165000, difficulty: 22, mustAppear: false },
      { term: "multiple cats", volume: 1300, difficulty: 26, mustAppear: true },
      { term: "large cat", volume: 880, difficulty: 18, mustAppear: true },
    ],
    cededTo: [
      {
        term: "litter robot 4",
        path: "",
        why: "74,000/mo and refused as a page target rather than ceded. It is a single product from a single manufacturer who holds the top two positions with their own domains. It earns a review page when the catalogue exists; it is not a term this hub chases.",
      },
      {
        term: "are self cleaning litter boxes safe",
        path: "/robots/self-cleaning-litter-boxes/#safety",
        why: "A genuinely separate SERP — peta.org, classactcats.com and petful.com rank, and only four domains are shared with the head term. But it is 110/mo, which does not support a URL, so it is the most prominent section on the hub instead. Editorially it is the most important thing on the page: 'Do vets recommend self-cleaning litter boxes?' appeared in the People Also Ask box on six of the twenty-three SERPs bought.",
      },
      {
        term: "best self cleaning litter box for multiple cats",
        path: "/robots/self-cleaning-litter-boxes/#what-it-fixes",
        why: "880/mo and 6 shared top-ten domains with the head term. A guide would have competed with this page for the same result set, so it is a section.",
      },
      {
        term: "best self cleaning litter box for large cats",
        path: "/robots/self-cleaning-litter-boxes/#cat-size",
        why: "260/mo and 6 shared domains with the head term. Section, not a guide — and it belongs beside the kitten weight-sensor question because both are the same axis.",
      },
      {
        term: "best budget self cleaning litter box",
        path: "/robots/self-cleaning-litter-boxes/#cost",
        why: "140/mo, and 'cheap self cleaning litter box' at 590 shares 6 domains with the head term. One price section carries both; neither justifies a URL.",
      },
    ],
    /* NOTE: no separate best-of page. "best self cleaning litter box" shares 7
       top-ten domains with the head term and "best automatic litter box"
       shares 6, so unlike lawn the one-URL rule costs nothing here — Google is
       already serving one result set. This is the most consolidated category
       BotPlanet has researched: every commercial phrasing measured 5-9. */
    researchedOn: RUN_LITTER,
  },
  {
    path: "/robots/companion-robots/",
    /* THE PRIMARY IS NOT THE CATEGORY NAME, and this is the entry that records
       why. "companion robot" is 4,400/mo and looks like the obvious head term.
       Its SERP is Wikipedia, globaltimes.cn, sixthtone.com, a New Atlas
       humanoid launch story and two Reddit threads about UBTECH — a news SERP,
       not a shopping one. It is also intent-contaminated: the related-keyword
       pull returned "companion robot woman" (390) and "ai companion robot for
       adults" (320).

       "robot pet" is 8,100 at KD 0 and returns Enabot, Living.AI, Amazon's
       Loona listing, Elephant Robotics and us.aibo.com. Twice the volume, a
       clean product SERP, every result a machine we would stock.

       KD figures in this category are unreliable and are recorded as measured
       rather than smoothed. The bulk difficulty call returned 6 for "companion
       robot" and 47 for "companion robots" — two terms Google Ads clusters at
       the identical 4,400 volume, so it is serving substantially the same
       SERP. Both cannot be right. Treat these as bands and let SERP
       composition decide difficulty. */
    primary: { term: "robot pet", volume: 8100, difficulty: 0, mustAppear: true },
    secondary: [
      { term: "robotic pet", volume: 8100, difficulty: 0, mustAppear: true },
      { term: "companion robot", volume: 4400, difficulty: 6, mustAppear: true },
      { term: "ai companion robot", volume: 1900, difficulty: 0, mustAppear: true },
      { term: "desktop companion robot", volume: 480, difficulty: 2, mustAppear: true },
      /* "robotic pet for elderly" (390) WAS A SECONDARY HERE until 6 August
         2026, when /guides/robotic-pets-for-elderly/ was built and took it as
         a primary. Left in both places it would have put two of our own pages
         into one result set for a query only one of them can win. The hub
         still covers eldercare as one of its three audiences — it just stops
         chasing the term. Moved to cededTo below. */
      { term: "robot friend", volume: 1000, difficulty: 0, mustAppear: true },
      { term: "robot pets for adults", volume: 480, difficulty: 10, mustAppear: false },
    ],
    cededTo: [
      {
        term: "robotic pet for elderly",
        path: "/guides/robotic-pets-for-elderly/",
        why: "About 1,090/mo across four eldercare phrasings, all at KD 0, and a genuinely different reader — somebody buying for another person, often at a distance. The hub separates the three audiences; the guide answers the hardest of them properly.",
      },
      {
        term: "pet camera robot",
        path: "/robots/pet-camera-robots/",
        why: "Two shared top-ten domains with 'companion robot' — amazon.com and reddit.com, both of which appear on nearly every query in this space. Discount them and the overlap is zero: no publisher, no manufacturer, no retailer in common. Meanwhile 'pet camera robot' shares six with 'robot pet camera'. Separate SERPs, separate page.",
      },
      {
        term: "robot dog",
        path: "",
        why: "90,500/mo and refused outright rather than ceded to anything. The SERP is $1,600 Unitree developer quadrupeds at one end and Target's children's toys at the other, with an industrial inspection story in the middle. 'robotic puppy' runs 49,500 in November against 1,900 in June — a 26x swing that is the signature of a Christmas toy, not a household robot. Nothing BotMatch could score.",
      },
      {
        term: "ai robot for kids",
        path: "",
        why: "A separate family — one shared domain with 'companion robot'. Refused as a sub-hub because it is a toy and parenting space, consistent with the earlier ruling that BotPlanet compares robots doing a household job. The 'who is it for' section covers children as a buying decision without chasing the term.",
      },
    ],
    /* NOTE: "best companion robot" is NOT ceded — this page carries it. It is
       110/mo and shares three domains with the head term, all universal
       (reddit, amazon, youtube). "best robot pet" is 140 and "best ai
       companion robot" is 30. There is no best-of demand in this category
       worth a second URL, so the one-URL rule costs nothing here, unlike lawn
       where it was a genuine trade-off. */
    researchedOn: RUN_COMPANION,
  },
  {
    path: "/robots/pet-camera-robots/",
    /* A separate page from companion robots on measured evidence, recorded in
       the cededTo entry above and in the hero comment.

       THE PAGE DELIBERATELY DOES NOT TARGET "best pet camera robot". It is
       10/mo and Google reads it as "best pet camera", serving PCMag,
       NYTimes/Wirecutter, Furbo and Wired — the static-camera market. Only two
       of its ten results are robot-specific. Adding "robot" to that query does
       not buy a different SERP, it buys Wirecutter as a competitor for ten
       searches a month. The unmodified term is the whole opportunity.

       Seasonality is the inverse of everything else on the site: this term
       peaks in July at 1,000 and troughs in April at 140. People buy one
       before going away, not as a present. */
    primary: { term: "pet camera robot", volume: 480, difficulty: 9, mustAppear: true },
    secondary: [
      { term: "robot pet camera", volume: 140, difficulty: 0, mustAppear: true },
      { term: "pet monitoring robot", volume: 170, difficulty: 6, mustAppear: true },
      { term: "home monitoring robot", volume: 170, difficulty: 0, mustAppear: true },
      { term: "moving pet camera", volume: 40, difficulty: 20, mustAppear: true },
      { term: "robot camera for pets", volume: 140, difficulty: 1, mustAppear: true },
      { term: "rolling pet camera", volume: 50, difficulty: 0, mustAppear: false },
    ],
    cededTo: [
      {
        term: "robot pet",
        path: "/robots/companion-robots/",
        why: "The companion hub's primary term at 8,100/mo. Three shared domains with 'pet camera robot' and the two families are separate — this page must not chase it.",
      },
      {
        term: "best pet camera robot",
        path: "",
        why: "Refused, not ceded. 10/mo, and the SERP is the static pet-camera market: PCMag, Wirecutter, Furbo, Wired. Targeting it means competing with Wirecutter for ten searches a month.",
      },
      {
        term: "home security robot",
        path: "",
        why: "Refused. This was the surviving cluster from the cancelled security-robots category, and 'home monitoring robot' at 170/mo still returns six security-framed results in ten, including SMP Robotics, a B2B outdoor patrol vendor. The term is kept as a secondary and a section heading; it is deliberately not in the URL or the H1.",
      },
    ],
    researchedOn: RUN_COMPANION,
  },
  {
    path: "/robots/robotic-lawn-mowers/",
    /* Google Ads reports the close-variant GROUP volume against every member,
       so "robotic lawn mower", "robotic lawnmower", "lawn mowing robot" and
       "robot grass cutter" all read 74,000 too. It is 74,000 for the family,
       not 74,000 each. Measured overlap between the first two phrasings: 8/10.

       KD 36 is the easiest of the five phrasings and by far the hardest head
       term BotPlanet has taken on — pool is 14, window is 0-5. Half of this
       SERP's top ten is manufacturer sites, so the page is written to win the
       "best" cluster below at KD 8 while being named for the head term. */
    primary: { term: "robot lawn mower", volume: 74000, difficulty: 36, mustAppear: true },
    secondary: [
      { term: "robot mower", volume: 22200, difficulty: 32, mustAppear: true },
      { term: "robotic lawn mower", volume: 74000, difficulty: 39, mustAppear: true },
      { term: "robot lawn mowers", volume: 74000, difficulty: 36, mustAppear: true },
      /* The acreage cluster, ~2,060/mo combined. It lives here rather than in
         a guide: "best robot lawn mower for 1 acre" shares 6/10 domains with
         "best robot lawn mower", so a guide would have competed with this
         page. Measured in the top-up run, not assumed. */
      { term: "acre", volume: 2060, difficulty: 4, mustAppear: true },
      { term: "boundary wire", volume: 1670, difficulty: 0, mustAppear: true },
      { term: "slope", volume: 200, difficulty: 0, mustAppear: true },
    ],
    cededTo: [
      {
        term: "wire free robot lawn mower",
        path: "/guides/wire-free-robot-lawn-mower/",
        why: "About 1,670/mo across the wire-free, RTK, GPS and LiDAR phrasings, and 2/10 shared with this page. A genuinely separate SERP, so it earns its own guide rather than a section here.",
      },
      {
        term: "best robot lawn mower for hills",
        path: "/guides/robot-lawn-mower-for-hills/",
        why: "Shares 7/10 domains with 'do robot lawn mowers work on hills' and only 3/10 with 'best robot lawn mower', so the two hills queries are one page and that page is not this one.",
      },
      {
        term: "best budget robot lawn mower",
        path: "/guides/cheap-robot-lawn-mower/",
        why: "A fully distinct SERP with no overlap flag against anything, 4/10 against 'best robot lawn mower'. The closest call in the category and the first guide to fold back in if it underperforms.",
      },
    ],
    /* NOTE: "best robot lawn mower" is NOT ceded, and unlike window that is a
       policy decision rather than an evidence-led one. Hub and best-of share
       only 2/10 domains here — the head term returns manufacturers, the best
       term returns pure editorial. One URL per category is the owner ruling of
       5 August 2026, so this page carries both jobs; the cost is recorded in
       docs/seo/robotic-lawn-mowers-research-findings.md rather than glossed. */
    researchedOn: RUN_LAWN,
  },
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

  /* ---- The three pool sub-pages, live 6 August 2026. ----
     All three were ruled CREATE by the 1 August run and then sat as
     placeholders for five days. Each row below records what the page was
     actually built to take, so keywords.test.ts has something to assert
     against and a later rank report has a baseline. */
  {
    path: "/best-robots/robotic-pool-cleaners/",
    /* Google reports "best robotic pool cleaner", "best robot pool cleaner",
       "top rated robotic pool cleaner" AND "best robotic pool cleaner for
       inground pools" as one grouped cluster at 6,600, and the SERPs overlap
       on thepoolnerd / poolbots / Amazon. That is why there is no inground
       best-of page: it is this page, with an inground section. Above-ground
       (140), large pools (70), leaves (20) and budget (50) are sections for
       the same reason — nowhere near a URL between them. */
    primary: { term: "best robotic pool cleaner", volume: 6600, difficulty: 13, mustAppear: true },
    secondary: [
      { term: "best robot pool cleaner", volume: 6600, difficulty: 13, mustAppear: true },
      { term: "best robotic pool cleaners", volume: 6600, difficulty: 13, mustAppear: true },
      { term: "above-ground", volume: 140, difficulty: 0, mustAppear: true },
      { term: "waterline", volume: 0, difficulty: 0, mustAppear: true },
      { term: "wall", volume: 0, difficulty: 0, mustAppear: true },
    ],
    cededTo: [
      {
        term: "cordless robotic pool cleaner",
        path: "/best-robots/robotic-pool-cleaners/cordless/",
        why: "22,200/mo at KD 0 — three times this page's cluster at a fraction of the difficulty, and its own list SERP. This page names cordless machines and explains the trade, but the term belongs to the child page.",
      },
      {
        term: "robotic pool cleaner",
        path: "/robots/robotic-pool-cleaners/",
        why: "The 40,500 head term is the hub's. A best-of that also chased it would put two of our own pages into the same result set for a query only one of them can win.",
      },
      {
        term: "are robotic pool cleaners worth it",
        path: "/guides/are-robotic-pool-cleaners-worth-it/",
        why: "The guide owns the question and the People Also Ask slot behind it. A ranked list is the wrong page shape for that query.",
      },
    ],
    researchedOn: RUN,
  },
  {
    path: "/best-robots/robotic-pool-cleaners/cordless/",
    /* The single biggest wedge in the pool dataset. 22,200/mo at KD ZERO —
       larger than the entire best-of cluster and easier than anything else
       researched for this category. It is a page rather than a section
       because the SERP is list content in its own right: thepoolnerd,
       poolbots, Beatbot, Amazon and Reddit, not the hub's manufacturers. */
    primary: { term: "cordless robotic pool cleaner", volume: 22200, difficulty: 0, mustAppear: true },
    secondary: [
      { term: "cordless robotic pool cleaners", volume: 22200, difficulty: 0, mustAppear: true },
      { term: "cordless pool cleaner", volume: 0, difficulty: 0, mustAppear: true },
      { term: "battery", volume: 0, difficulty: 0, mustAppear: true },
      { term: "runtime", volume: 0, difficulty: 0, mustAppear: true },
      { term: "corded", volume: 0, difficulty: 0, mustAppear: true },
      /* THE SAFETY CLUSTER, ADDED 8 AUGUST 2026 WITH THE RECALL SECTION.
         Not from a paid run — these are terms the page now answers because it
         carries the CPSC record for both Aiper recalls with model numbers, and
         a register row that does not name them would let the section drift out
         again unnoticed. Volumes are 0 rather than invented; the batched
         refresh can price them. */
      { term: "recall", volume: 0, difficulty: 0, mustAppear: true },
      { term: "aiper seagull pro", volume: 0, difficulty: 0, mustAppear: true },
      { term: "aiper elite pro", volume: 0, difficulty: 0, mustAppear: true },
      { term: "cpsc", volume: 0, difficulty: 0, mustAppear: true },
      { term: "overheat", volume: 0, difficulty: 0, mustAppear: true },
    ],
    cededTo: [
      {
        term: "best robotic pool cleaner",
        path: "/best-robots/robotic-pool-cleaners/",
        why: "The parent page carries the general ranking, including the three corded machines this page argues for but does not rank. Chasing it here would split one argument across two URLs competing for one result.",
      },
      {
        term: "robotic pool cleaner",
        path: "/robots/robotic-pool-cleaners/",
        why: "The category head term belongs to the hub, which explains corded versus cordless as a decision rather than ranking one side of it.",
      },
    ],
    researchedOn: RUN,
  },
  /* ---- WINDOW REVIEWS, live 6 August 2026. ----
     Volumes are from the window run (30981257806, 5 August 2026, $0.2044) and
     are model-level rather than the category cluster, which is why they are
     small and real rather than zero. Every one of these cedes the category
     head term to the hub: the window hub carries the "best" job itself on
     measured evidence — 6 of the top 10 are identical between "window cleaning
     robot" and "best window cleaning robot", and NYTimes ranks #1 for both
     with one article — so there is no best-of page for a review to compete
     with either. */
  /* COMPANION ROBOTS — first review in the category, 8 August 2026.
     Run: local batch on seeds/companion-products.json, $0.3321.
     Plan: docs/seo/companion-products-build-plan.md

     PRIMARY IS THE BARE NAME. The old plan targeted "casio moflin" at 1,300
     and KD 24; the measured run puts "moflin" at 6,600 and KD 12. Five times
     the traffic at half the difficulty, and the branded form is carried as a
     secondary rather than lost. */
  /* ------------------------------------------------------------------
     RULE-OUT REVIEWS, 8 August 2026. Both own a large branded term and spend
     it recommending something else. Neither cedes its own name to anything,
     because no other page on this site is trying to rank for a robot we will
     not sell — the ceding here runs the other way, from the category head
     terms, which stay with the hubs.
     ------------------------------------------------------------------ */
  {
    path: "/robots/educational-coding-robots/cozmo/",
    primary: { term: "cozmo robot", volume: 9900, difficulty: 0, mustAppear: true },
    secondary: [
      { term: "digital dream labs", volume: 0, difficulty: 0, mustAppear: true },
      { term: "anki", volume: 0, difficulty: 0, mustAppear: true },
      { term: "vector", volume: 0, difficulty: 0, mustAppear: true },
      /* The three facts the verdict rests on. If a rewrite drops any of them
         the page has stopped being a rule-out and become a product page for
         something nobody can buy. */
      { term: "attorney general", volume: 0, difficulty: 0, mustAppear: true },
      { term: "sold out", volume: 0, difficulty: 0, mustAppear: true },
      { term: "refunds", volume: 0, difficulty: 0, mustAppear: true },
    ],
    cededTo: [
      {
        term: "coding robots for kids",
        path: "/robots/educational-coding-robots/",
        why: "The category head term belongs to the hub, which routes to machines that can actually be bought. This page exists to move a reader off one name and onto three of those, and ranking it for the category would put a dead product at the top of the funnel.",
      },
    ],
    researchedOn: RUN,
  },
  {
    path: "/robots/companion-robots/moxie/",
    primary: { term: "moxie robot", volume: 8100, difficulty: 0, mustAppear: true },
    secondary: [
      { term: "embodied", volume: 0, difficulty: 0, mustAppear: true },
      { term: "openmoxie", volume: 0, difficulty: 0, mustAppear: true },
      { term: "servers", volume: 0, difficulty: 0, mustAppear: true },
      { term: "refunds", volume: 0, difficulty: 0, mustAppear: true },
      { term: "used", volume: 0, difficulty: 0, mustAppear: true },
    ],
    cededTo: [
      {
        term: "robot pet",
        path: "/robots/companion-robots/",
        why: "The 8,100 head term belongs to the hub. This page answers one question about one discontinued machine and then sends the reader there.",
      },
      {
        term: "robotic pet for elderly",
        path: "/guides/robotic-pets-for-elderly/",
        why: "Moxie was sold for children rather than for elderly care, and the evidence question the guide answers is a different reader's. Named on this page as an onward route, not competed for.",
      },
    ],
    researchedOn: RUN,
  },
  {
    path: "/robots/companion-robots/moflin/",
    primary: { term: "moflin", volume: 6600, difficulty: 12, mustAppear: true },
    secondary: [
      { term: "casio moflin", volume: 1300, difficulty: 24, mustAppear: true },
      { term: "moflin pet", volume: 1000, difficulty: 25, mustAppear: false },
      { term: "moflin price", volume: 40, difficulty: 17, mustAppear: false },
      /* The two questions the search data says people actually arrive with.
         Both are Google's first suggestion for their prefix and both are
         answered by Casio's own Movement row, which reads two axes. */
      { term: "walk", volume: 0, difficulty: 0, mustAppear: true },
      { term: "subscription", volume: 0, difficulty: 0, mustAppear: true },
      { term: "battery", volume: 0, difficulty: 0, mustAppear: true },
    ],
    cededTo: [
      {
        term: "robot pet",
        path: "/robots/companion-robots/",
        why: "The 8,100 head term belongs to the hub, which does the routing for the whole category. A single-product review ranking for it would answer the wrong question and would compete with our own stronger page.",
      },
      {
        term: "robotic pet for elderly",
        path: "/guides/robotic-pets-for-elderly/",
        why: "This review names the care-setting use because it is one of the honest reasons to buy a Moflin, but the elderly-care intent is a different reader with a different question and the guide already owns it.",
      },
    ],
    researchedOn: "2026-08-08",
  },
  /* Miko 3. The cheapest large opportunity measured in this category:
     "miko robot" is 8,100 at KD 10 and "miko 3" 4,400 at KD 3, against
     Vector's 9,900 at KD 23 and Eilik's 8,100 at KD 29.

     "miko mini" (5,400, KD 0) is NOT taken here and is not ceded to another
     page either — it is refused. The only Amazon US listing for the Mini is a
     carrying case, so the term has nothing to sell behind it. It is compared
     against in the copy and linked nowhere. */
  {
    path: "/robots/companion-robots/miko-3/",
    primary: { term: "miko 3", volume: 4400, difficulty: 3, mustAppear: true },
    secondary: [
      { term: "miko robot", volume: 8100, difficulty: 10, mustAppear: false },
      { term: "miko max", volume: 170, difficulty: 0, mustAppear: true },
      { term: "miko 3 price", volume: 110, difficulty: 0, mustAppear: false },
      { term: "miko mini", volume: 5400, difficulty: 0, mustAppear: false },
      /* The question the search data says people arrive with, and the one this
         page is structured around. Answered from Miko's own comparison table
         rather than as a yes or a no. */
      { term: "subscription", volume: 0, difficulty: 0, mustAppear: true },
      { term: "ages 5", volume: 0, difficulty: 0, mustAppear: false },
      { term: "Wi-Fi", volume: 0, difficulty: 0, mustAppear: true },
    ],
    cededTo: [
      {
        term: "robot pet",
        path: "/robots/companion-robots/",
        why: "The 8,100 head term belongs to the hub. Miko is a teacher with a face rather than a robot pet, and ranking this page for that term would answer the wrong question for the reader who typed it.",
      },
    ],
    researchedOn: "2026-08-08",
  },
  /* Vector 2.0. 9,900/mo, and the SERP evidence says the page is about the
     company rather than the robot: "vector robot" shares SIX of ten domains
     with "is vector robot still supported" and FIVE with "vector robot price",
     so one page takes all three.

     "cozmo robot" is REFUSED rather than ceded — 9,900/mo whose only Amazon US
     listing is a $19 battery. Answered as a comparison section here because
     "vector robot vs cozmo" ranks, and this is the machine that wins it by
     default. */
  {
    path: "/robots/companion-robots/vector-2/",
    primary: { term: "vector robot", volume: 9900, difficulty: 23, mustAppear: true },
    secondary: [
      { term: "anki vector", volume: 1000, difficulty: 23, mustAppear: true },
      { term: "vector 2.0", volume: 1300, difficulty: 0, mustAppear: true },
      { term: "digital dream labs", volume: 30, difficulty: 19, mustAppear: true },
      { term: "vector robot vs cozmo", volume: 20, difficulty: 3, mustAppear: false },
      { term: "subscription", volume: 0, difficulty: 0, mustAppear: true },
      { term: "discontinued", volume: 0, difficulty: 0, mustAppear: true },
      { term: "still work", volume: 0, difficulty: 0, mustAppear: true },
      { term: "OSKR", volume: 0, difficulty: 0, mustAppear: true },
    ],
    cededTo: [
      {
        term: "robot pet",
        path: "/robots/companion-robots/",
        why: "The 8,100 head term belongs to the hub. Vector is a gadget with character rather than a robot pet, and the review says so plainly while pointing the reader who wanted a pet at Moflin instead.",
      },
    ],
    researchedOn: "2026-08-08",
  },
  /* The Enabot range page. 9,900/mo at KD 4 on the brand, against 480 for
     "pet camera robot" which the hub owns — this category is a brand with a
     category attached rather than the other way round.

     Its SERP shares THREE domains with the hub's and all three are amazon,
     instagram and reddit; discount the universal ones, as this register
     already does elsewhere, and the overlap is zero. Measured separately on
     8 August 2026 because assigning a category's largest term without looking
     at its results is the guessing this process exists to stop. */
  {
    path: "/robots/pet-camera-robots/enabot/",
    primary: { term: "enabot", volume: 9900, difficulty: 4, mustAppear: true },
    secondary: [
      { term: "enabot robot", volume: 1600, difficulty: 10, mustAppear: true },
      { term: "enabot ebo", volume: 1000, difficulty: 10, mustAppear: true },
      { term: "enabot rola mini", volume: 480, difficulty: 10, mustAppear: true },
      { term: "enabot pet camera", volume: 260, difficulty: 3, mustAppear: false },
      { term: "enabot review", volume: 110, difficulty: 0, mustAppear: false },
      { term: "subscription", volume: 0, difficulty: 0, mustAppear: true },
      { term: "stairs", volume: 0, difficulty: 0, mustAppear: true },
    ],
    cededTo: [
      {
        term: "ebo air 2",
        path: "/robots/pet-camera-robots/enabot-ebo-air-2/",
        why: "The single-model review owns it at 2,400/mo. Five shared domains is the threshold and four of those five are amazon, instagram, reddit and facebook, so this page routes to that one rather than competing with it.",
      },
      {
        term: "ebo se",
        path: "/robots/pet-camera-robots/enabot-ebo-se/",
        why: "The SE review owns its own name. This page's job is telling a reader which of the seven to read about, not reviewing each of them a second time.",
      },
      {
        term: "pet camera robot",
        path: "/robots/pet-camera-robots/",
        why: "The category head term belongs to the hub. The two SERPs share only amazon, instagram and reddit — discount those and the overlap is zero, which is the whole reason this is a separate page rather than a rewrite of the hub.",
      },
    ],
    researchedOn: "2026-08-08",
  },
  /* Ropet. 1,300/mo at KD 6 — the smallest primary in this category and the
     softest SERP in it: position 1 is Ropet's own site and there is exactly one
     real review in the top ten. The CPCs are the highest measured here,
     "ropet where to buy" at $10.95 against "moflin review" at $0.26.

     "ropet" and "ropet robot" share EIGHT of ten top-ten domains, so one page
     takes both. "ropet vs moflin" shares only two, and both are social — the
     comparison searchers make themselves is a section here, not a page. */
  {
    path: "/robots/companion-robots/ropet/",
    primary: { term: "ropet", volume: 1300, difficulty: 6, mustAppear: true },
    secondary: [
      { term: "ropet robot", volume: 140, difficulty: 0, mustAppear: false },
      { term: "ropet kamomo", volume: 20, difficulty: 0, mustAppear: true },
      { term: "ropet accessories", volume: 20, difficulty: 0, mustAppear: false },
      { term: "ropet reviews", volume: 10, difficulty: 12, mustAppear: false },
      { term: "ropet fur", volume: 10, difficulty: 0, mustAppear: true },
      { term: "allerg", volume: 0, difficulty: 0, mustAppear: true },
      { term: "offline", volume: 0, difficulty: 0, mustAppear: true },
    ],
    cededTo: [
      {
        term: "robot pet",
        path: "/robots/companion-robots/",
        why: "The 8,100 head term belongs to the hub, which routes the category. Ropet is a strong candidate for the reader who arrives on it, and the hub is the page that should make that introduction rather than this one competing for it.",
      },
    ],
    researchedOn: "2026-08-08",
  },
  /* Living.AI EMO — 18,100/mo at KD 21, the largest single term BotPlanet
     holds in this category, and NO BUY BUTTON. Two Amazon searches on
     8 August 2026 returned only unbranded EMOPET-style knockoffs.

     It is targeted anyway because Google uses EMO as the comparison anchor for
     the whole desktop segment, and both the Eilik and Loona reviews cede the
     term here rather than contest it. A page that ranks for 18,100 and routes
     to machines a reader can actually buy beats a gap where the anchor should
     be. */
  {
    path: "/robots/companion-robots/living-ai-emo/",
    primary: { term: "emo robot", volume: 18100, difficulty: 21, mustAppear: true },
    secondary: [
      { term: "living.ai", volume: 0, difficulty: 0, mustAppear: true },
      { term: "robot pet emo", volume: 70, difficulty: 11, mustAppear: false },
      { term: "eilik vs emo", volume: 20, difficulty: 0, mustAppear: false },
      { term: "skateboard", volume: 0, difficulty: 0, mustAppear: true },
      { term: "face recognition", volume: 0, difficulty: 0, mustAppear: true },
    ],
    cededTo: [
      {
        term: "robot pet",
        path: "/robots/companion-robots/",
        why: "The 8,100 head term belongs to the hub, which routes the whole category. This page has no offer behind it and exists to send readers on, so competing with the hub for its own term would be doubly pointless.",
      },
    ],
    researchedOn: "2026-08-08",
  },
  /* Loona. 5,400/mo at KD 18. "loona robot" shares FIVE of ten top-ten domains
     with "loona robot price", so one page takes both.

     keyirobot.com is KEYi's own content marketing and appears in nine of the
     twenty-two SERPs measured for this category — including on Vector and Joy
     For All, which it does not make. It is the site to beat here and it is
     also the maker of this product. */
  {
    path: "/robots/companion-robots/loona/",
    primary: { term: "loona robot", volume: 5400, difficulty: 18, mustAppear: true },
    secondary: [
      { term: "loona robot dog", volume: 1000, difficulty: 4, mustAppear: false },
      { term: "keyi", volume: 170, difficulty: 0, mustAppear: true },
      { term: "loona petbot", volume: 0, difficulty: 0, mustAppear: true },
      { term: "loona robot price", volume: 90, difficulty: 0, mustAppear: false },
      { term: "loona robot accessories", volume: 70, difficulty: 0, mustAppear: false },
      { term: "subscription", volume: 0, difficulty: 0, mustAppear: true },
      { term: "battery", volume: 0, difficulty: 0, mustAppear: true },
      { term: "home monitor", volume: 0, difficulty: 0, mustAppear: true },
    ],
    cededTo: [
      {
        term: "emo robot",
        path: "/robots/companion-robots/living-ai-emo/",
        why: "Google's answer box on this SERP asks which robot is better, Emo or Loona, so the comparison belongs here — but the 18,100/mo term belongs to the EMO page rather than being contested by two of ours.",
      },
      {
        term: "pet camera robot",
        path: "/robots/pet-camera-robots/",
        why: "Loona genuinely carries a camera and doubles as a home monitor, and the review says so. The roaming-camera intent is still a different reader with a different budget, and that category page owns it — this page names it as the better answer for anyone whose main goal is watching a pet.",
      },
    ],
    researchedOn: "2026-08-08",
  },
  /* Eilik. 8,100/mo at KD 29 — the hardest primary in this category, and the
     page carries "eilik robot review" and "eilik price" with it: both share
     FIVE of ten top-ten domains with the head term.

     "eilik ai station" is a secondary rather than its own page. It measures
     260/mo at KD 0 and it is the answer to the biggest gap in the base
     product, so it belongs in the review that raises the gap. */
  {
    path: "/robots/companion-robots/eilik/",
    primary: { term: "eilik robot", volume: 8100, difficulty: 29, mustAppear: true },
    secondary: [
      { term: "eilik", volume: 3600, difficulty: 29, mustAppear: true },
      { term: "energize lab", volume: 590, difficulty: 34, mustAppear: true },
      { term: "eilik ai station", volume: 260, difficulty: 0, mustAppear: true },
      { term: "eilik price", volume: 30, difficulty: 0, mustAppear: false },
      { term: "two eilik robots", volume: 10, difficulty: 0, mustAppear: true },
      { term: "battery", volume: 0, difficulty: 0, mustAppear: true },
      { term: "warranty", volume: 0, difficulty: 0, mustAppear: true },
      { term: "Eiliko", volume: 0, difficulty: 0, mustAppear: true },
    ],
    cededTo: [
      {
        term: "emo robot",
        path: "/robots/companion-robots/living-ai-emo/",
        why: "Google's own answer box on this SERP asks which is better, Eilik or Emo, so the comparison is answered here — but the 18,100/mo term belongs to the EMO page rather than being fought over by two of ours.",
      },
      {
        term: "robot pet",
        path: "/robots/companion-robots/",
        why: "The 8,100 head term belongs to the hub. Eilik is expressive and not warm, and this review says so plainly while sending the reader who wanted a pet to Moflin instead.",
      },
    ],
    researchedOn: "2026-08-08",
  },
  {
    path: "/robots/window-cleaning-robots/ecovacs-winbot-w2-pro-omni/",
    primary: { term: "winbot w2 pro omni", volume: 1120, difficulty: 0, mustAppear: true },
    secondary: [
      { term: "ecovacs winbot w2 pro omni", volume: 1120, difficulty: 0, mustAppear: true },
      { term: "battery station", volume: 0, difficulty: 0, mustAppear: true },
      { term: "frameless", volume: 0, difficulty: 0, mustAppear: true },
      { term: "power-off hold", volume: 0, difficulty: 0, mustAppear: true },
    ],
    cededTo: [
      {
        term: "window cleaning robot",
        path: "/robots/window-cleaning-robots/",
        why: "The 22,900 category cluster belongs to the hub, which carries the best-of job itself. A single-model review ranking for it would be the wrong result for the searcher and would compete with our own stronger page.",
      },
    ],
    researchedOn: RUN_WINDOW,
  },
  {
    path: "/robots/window-cleaning-robots/ecovacs-winbot-w2-pro/",
    primary: { term: "winbot w2 pro", volume: 150, difficulty: 0, mustAppear: true },
    secondary: [
      { term: "ecovacs winbot w2 pro", volume: 150, difficulty: 0, mustAppear: true },
      { term: "protection stages", volume: 0, difficulty: 0, mustAppear: true },
      { term: "frameless", volume: 0, difficulty: 0, mustAppear: true },
    ],
    cededTo: [
      {
        term: "window cleaning robot",
        path: "/robots/window-cleaning-robots/",
        why: "Category head term, owned by the hub.",
      },
      {
        term: "winbot w2 pro omni",
        path: "/robots/window-cleaning-robots/ecovacs-winbot-w2-pro-omni/",
        why: "The Omni has its own review and eight times the volume. This page names it constantly as the comparison, and must not outrank it for its own model name.",
      },
    ],
    researchedOn: RUN_WINDOW,
  },
  {
    path: "/robots/window-cleaning-robots/ecovacs-winbot-w1-pro/",
    primary: { term: "winbot w1 pro", volume: 100, difficulty: 0, mustAppear: true },
    secondary: [
      { term: "ecovacs winbot w1 pro", volume: 100, difficulty: 0, mustAppear: true },
      { term: "streaking", volume: 0, difficulty: 0, mustAppear: true },
      { term: "8-tier", volume: 0, difficulty: 0, mustAppear: true },
    ],
    cededTo: [
      {
        term: "window cleaning robot",
        path: "/robots/window-cleaning-robots/",
        why: "Category head term, owned by the hub.",
      },
    ],
    researchedOn: RUN_WINDOW,
  },
  {
    path: "/best-robots/robotic-pool-cleaners/above-ground-pools/",
    /* Proved by the SECOND pool run, 6 August 2026. The 1 August run measured
       above-ground at 140 and merged it into the best-of as a section — right
       on the number it had, and this phrasing was not in that seed list.

       At 2,400 with zero difficulty and a $4.30 CPC it is the second-strongest
       commercial term in the category after cordless, and the only new page
       from that run that could be built the same day: four catalogue machines
       are already rated for a vinyl liner. */
    primary: { term: "robotic pool cleaner for above ground pool", volume: 2400, difficulty: 0, mustAppear: true },
    secondary: [
      /* The hyphenated plural is how the phrase is actually written in a
         heading, and Google treats it as the same query. Declared so the page
         can say its own name without the cannibalisation guard reading the
         parent's ceded term inside it. */
      { term: "robotic pool cleaners for above-ground pools", volume: 2400, difficulty: 0, mustAppear: true },
      { term: "above ground", volume: 2400, difficulty: 0, mustAppear: true },
      { term: "vinyl", volume: 20, difficulty: 0, mustAppear: true },
      { term: "liner", volume: 0, difficulty: 0, mustAppear: true },
      { term: "small pool", volume: 260, difficulty: 0, mustAppear: true },
    ],
    cededTo: [
      {
        term: "best robotic pool cleaner",
        path: "/best-robots/robotic-pool-cleaners/",
        why: "The general ranking belongs to the parent page, which carries above-ground as one section among nine. This page takes the segment term only, and the two are not competing for the same result set.",
      },
      {
        term: "robotic pool cleaner",
        path: "/robots/robotic-pool-cleaners/",
        why: "The 40,500 category head term belongs to the hub. A segment page reaching for it would put two of our own pages into one result.",
      },
      {
        term: "cordless robotic pool cleaner",
        path: "/best-robots/robotic-pool-cleaners/cordless/",
        why: "Three of the four machines here are cordless and the page says so, but the 22,200/mo commercial term belongs to the page built for it.",
      },
    ],
    researchedOn: RUN,
  },
  {
    path: "/compare/robotic-pool-cleaners/",
    /* Page 4 of the pool map, and the last one on it that was still a stub —
       a bare table with an H1 over it, no register row and a price column.

       ONE HUB, NOT NINE PAIR PAGES. The 1 August run measured "aiper vs
       dolphin" at 110 and "dolphin vs polaris" at 30, and the exact model-pair
       phrases at no measurable volume at all. Ruling 3: brand-vs-brand intent
       is owned by one hub with a section per pair, and pair URLs return only
       if demand appears. Nine pages built on 140 searches between them would
       be nine thin pages competing with each other. */
    primary: { term: "aiper vs dolphin", volume: 110, difficulty: 0, mustAppear: true },
    secondary: [
      { term: "dolphin vs polaris", volume: 30, difficulty: 0, mustAppear: true },
      { term: "robotic pool cleaner comparison", volume: 0, difficulty: 0, mustAppear: true },
      { term: "compare", volume: 0, difficulty: 0, mustAppear: true },
      { term: "warranty", volume: 0, difficulty: 0, mustAppear: true },
      { term: "skimmer", volume: 0, difficulty: 0, mustAppear: true },
    ],
    cededTo: [
      {
        term: "best robotic pool cleaner",
        path: "/best-robots/robotic-pool-cleaners/",
        why: "A comparison hub answers 'which brand', a best-of answers 'which one'. They are different queries with different SERPs, and a hub that also reached for the ranking would put two of our pages into one result set.",
      },
      {
        term: "cordless robotic pool cleaner",
        path: "/best-robots/robotic-pool-cleaners/cordless/",
        why: "Corded versus cordless is the axis this page is built on, but the 22,200/mo commercial term belongs to the page that ranks cordless machines rather than to the one that explains the difference.",
      },
    ],
    researchedOn: RUN,
  },
  {
    path: "/guides/are-robotic-pool-cleaners-worth-it/",
    /* 40/mo on the exact phrase, which would not justify a URL on its own.
       What justifies it: "Is a robot pool cleaner worth it?" is the NUMBER
       ONE People Also Ask entry on the 40,500 head term. This is a snippet
       and AI-overview play, and the answer has to be a real one — including
       the four cases where the answer is no — or it earns nothing. */
    primary: { term: "are robotic pool cleaners worth it", volume: 40, difficulty: 0, mustAppear: true },
    secondary: [
      { term: "is a robot pool cleaner worth it", volume: 0, difficulty: 0, mustAppear: true },
      { term: "suction cleaner", volume: 0, difficulty: 0, mustAppear: true },
      { term: "pressure cleaner", volume: 0, difficulty: 0, mustAppear: true },
      { term: "how long do robotic pool cleaners last", volume: 0, difficulty: 0, mustAppear: true },
    ],
    cededTo: [
      {
        term: "best robotic pool cleaner",
        path: "/best-robots/robotic-pool-cleaners/",
        why: "A guide that ranks products is a best-of wearing a hat. This page answers whether to buy at all and hands the reader to the page that answers which one.",
      },
      {
        term: "robotic pool cleaner",
        path: "/robots/robotic-pool-cleaners/",
        why: "The head term is the hub's. This guide takes one question off it, not the category.",
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
      { term: "does the dolphin nautilus cc plus clean the waterline", volume: 0, difficulty: 0, mustAppear: false },
      { term: "dolphin nautilus cc plus max pool size", volume: 0, difficulty: 0, mustAppear: false },
      { term: "dolphin nautilus cc plus filter", volume: 0, difficulty: 0, mustAppear: false },
      { term: "mydolphin plus app", volume: 0, difficulty: 0, mustAppear: false },
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
      { term: "polaris freedom cordless robotic pool cleaner", volume: 0, difficulty: 0, mustAppear: false },
      { term: "polaris freedom", volume: 0, difficulty: 0, mustAppear: true },
      // The section the page is actually built around, and the reason it beats
      // a spec sheet: the pool-size limit exists only in marketing artwork.
      { term: "polaris freedom max pool size", volume: 0, difficulty: 0, mustAppear: false },
      { term: "polaris freedom battery", volume: 0, difficulty: 0, mustAppear: false },
      { term: "polaris freedom runtime", volume: 0, difficulty: 0, mustAppear: false },
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
      { term: "solar pool skimmer", volume: 0, difficulty: 0, mustAppear: false },
      { term: "robotic pool skimmer", volume: 0, difficulty: 0, mustAppear: true },
      { term: "betta se plus", volume: 0, difficulty: 0, mustAppear: true },
      // The question the page is built to answer, and the one most likely to
      // be typed by someone about to buy the wrong machine.
      { term: "does the betta se plus clean the pool floor", volume: 0, difficulty: 0, mustAppear: false },
      { term: "betta se plus runtime", volume: 0, difficulty: 0, mustAppear: false },
      { term: "betta se plus warranty", volume: 0, difficulty: 0, mustAppear: false },
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
  {
    path: "/robots/robotic-pool-cleaners/dolphin-proteus-dx4-plus/",
    primary: { term: "dolphin proteus dx4 plus review", volume: 0, difficulty: 0, mustAppear: true },
    secondary: [
      { term: "dolphin proteus dx4 plus", volume: 0, difficulty: 0, mustAppear: true },
      { term: "proteus dx4 plus", volume: 0, difficulty: 0, mustAppear: true },
      // The two questions the page is built to answer, and the two that decide
      // whether someone buys the right machine.
      { term: "dolphin proteus dx4 plus max pool size", volume: 0, difficulty: 0, mustAppear: false },
      { term: "does the dolphin proteus dx4 plus clean the waterline", volume: 0, difficulty: 0, mustAppear: false },
      { term: "dolphin proteus dx4 plus filter", volume: 0, difficulty: 0, mustAppear: false },
      { term: "dolphin proteus dx4 plus weight", volume: 0, difficulty: 0, mustAppear: false },
    ],
    cededTo: [
      {
        term: "robotic pool cleaner",
        path: "/robots/robotic-pool-cleaners/",
        why: "The category head term belongs to the hub, as on every review.",
      },
      {
        term: "best robotic pool cleaner",
        path: "/best-robots/robotic-pool-cleaners/",
        why: "A comparison SERP. One review is not a best-of.",
      },
      {
        term: "dolphin proteus dx4",
        path: "/robots/robotic-pool-cleaners/",
        why: "A DIFFERENT MACHINE, rated to 50 ft where this one is rated to 33. Ranking this page for the sibling's name would send someone to a specification that is not the one they searched for — which is the exact mistake the review's third section exists to prevent. It goes to the hub until the DX4 has a page of its own.",
      },
      {
        term: "dolphin nautilus cc plus review",
        path: "/robots/robotic-pool-cleaners/dolphin-nautilus-cc-plus/",
        why: "The Nautilus is named on this page as the precedent for a Maytronics waterline claim not matching its spec sheet. Naming it is not targeting its term.",
      },
    ],
    researchedOn: RUN,
  },
  {
    path: "/robots/robotic-pool-cleaners/aiper-scuba-v3-ai-vision/",
    primary: { term: "aiper scuba v3 review", volume: 0, difficulty: 0, mustAppear: true },
    secondary: [
      { term: "aiper scuba v3 ai vision", volume: 0, difficulty: 0, mustAppear: true },
      { term: "aiper scuba v3", volume: 0, difficulty: 0, mustAppear: true },
      // The two questions the page is actually built around.
      { term: "aiper scuba v3 camera", volume: 0, difficulty: 0, mustAppear: false },
      { term: "aiper scuba v3 runtime", volume: 0, difficulty: 0, mustAppear: false },
      { term: "ai navium mode", volume: 0, difficulty: 0, mustAppear: true },
      { term: "aiper scuba v3 filter", volume: 0, difficulty: 0, mustAppear: false },
    ],
    cededTo: [
      {
        term: "robotic pool cleaner",
        path: "/robots/robotic-pool-cleaners/",
        why: "The category head term belongs to the hub, as on every review.",
      },
      {
        term: "best robotic pool cleaner",
        path: "/best-robots/robotic-pool-cleaners/",
        why: "A comparison SERP. One review is not a best-of.",
      },
      {
        term: "cordless robotic pool cleaner",
        path: "/best-robots/robotic-pool-cleaners/cordless/",
        why: "Same rule as the Polaris FREEDOM: that query wants a shortlist, and two of our own cordless reviews fighting each other for it would be worse than either winning.",
      },
      {
        term: "aiper scuba x1 pro max",
        path: "/robots/robotic-pool-cleaners/aiper-scuba-x1-pro-max/",
        why: "A different Aiper at a different price, named on this page only as the machine with a real length rating. Retargeted to its own review on 4 August 2026, the day that review shipped.",
      },
    ],
    researchedOn: RUN,
  },
  {
    path: "/robots/robotic-pool-cleaners/aiper-scuba-x1-pro-max/",
    primary: { term: "aiper scuba x1 pro max review", volume: 0, difficulty: 0, mustAppear: true },
    secondary: [
      { term: "aiper scuba x1 pro max", volume: 0, difficulty: 0, mustAppear: true },
      { term: "scuba x1 pro max", volume: 0, difficulty: 0, mustAppear: true },
      // The questions the page is built around: the four-surface claim and the
      // family of lookalike listings.
      { term: "robotic pool skimmer", volume: 0, difficulty: 0, mustAppear: true },
      { term: "aiper scuba x1 pro max runtime", volume: 0, difficulty: 0, mustAppear: false },
      { term: "omnisense", volume: 0, difficulty: 0, mustAppear: true },
      { term: "aiper scuba x1 pro max warranty", volume: 0, difficulty: 0, mustAppear: false },
    ],
    cededTo: [
      {
        term: "robotic pool cleaner",
        path: "/robots/robotic-pool-cleaners/",
        why: "The category head term belongs to the hub, as on every review.",
      },
      {
        term: "best robotic pool cleaner",
        path: "/best-robots/robotic-pool-cleaners/",
        why: "A comparison SERP. One review is not a best-of.",
      },
      {
        term: "cordless robotic pool cleaner",
        path: "/best-robots/robotic-pool-cleaners/cordless/",
        why: "Three of our own cordless reviews would otherwise contest one query. The shortlist page owns it; none of them do.",
      },
      {
        term: "aiper scuba v3 review",
        path: "/robots/robotic-pool-cleaners/aiper-scuba-v3-ai-vision/",
        why: "The V3 is this page's main comparison — half the price, camera instead of sonar. Naming it repeatedly is not targeting its term.",
      },
      {
        term: "solar pool skimmer",
        path: "/robots/robotic-pool-cleaners/betta-se-plus/",
        why: "This machine skims, but a skimmer-only searcher wants the Betta's price bracket, not a $1,700 flagship.",
      },
    ],
    researchedOn: RUN,
  },
  {
    path: "/robots/robotic-pool-cleaners/aiper-seagull-se/",
    primary: { term: "aiper seagull se review", volume: 0, difficulty: 0, mustAppear: true },
    secondary: [
      { term: "aiper seagull se", volume: 0, difficulty: 0, mustAppear: true },
      { term: "seagull se", volume: 0, difficulty: 0, mustAppear: true },
      // The purchase-deciding questions for this machine's actual buyer.
      { term: "above-ground pool robot", volume: 0, difficulty: 0, mustAppear: false },
      { term: "aiper seagull se runtime", volume: 0, difficulty: 0, mustAppear: false },
      { term: "aiper seagull se charge time", volume: 0, difficulty: 0, mustAppear: false },
    ],
    cededTo: [
      {
        term: "robotic pool cleaner",
        path: "/robots/robotic-pool-cleaners/",
        why: "The category head term belongs to the hub, as on every review.",
      },
      {
        term: "best robotic pool cleaner",
        path: "/best-robots/robotic-pool-cleaners/",
        why: "A comparison SERP. One review is not a best-of.",
      },
      {
        term: "cordless robotic pool cleaner",
        path: "/best-robots/robotic-pool-cleaners/cordless/",
        why: "Four cordless reviews now; the shortlist page owns the head term so they do not fight each other for it.",
      },
      {
        term: "cheap robotic pool cleaner",
        path: "/best-robots/robotic-pool-cleaners/",
        why: "A price-first searcher wants a comparison, not one product. This page will earn that click from the best-of, not from the SERP.",
      },
    ],
    researchedOn: RUN,
  },
  {
    path: "/robots/robotic-pool-cleaners/aiper-scuba-s1/",
    primary: { term: "aiper scuba s1 review", volume: 0, difficulty: 0, mustAppear: true },
    secondary: [
      { term: "aiper scuba s1", volume: 0, difficulty: 0, mustAppear: true },
      { term: "scuba s1", volume: 0, difficulty: 0, mustAppear: true },
      // The claims this page is actually built to answer.
      { term: "aiper scuba s1 waterline", volume: 0, difficulty: 0, mustAppear: false },
      { term: "aiper scuba s1 runtime", volume: 0, difficulty: 0, mustAppear: false },
      { term: "shallow ledge pool cleaner", volume: 0, difficulty: 0, mustAppear: false },
    ],
    cededTo: [
      {
        term: "robotic pool cleaner",
        path: "/robots/robotic-pool-cleaners/",
        why: "The category head term belongs to the hub, as on every review.",
      },
      {
        term: "best robotic pool cleaner",
        path: "/best-robots/robotic-pool-cleaners/",
        why: "A comparison SERP. One review is not a best-of.",
      },
      {
        term: "cordless robotic pool cleaner",
        path: "/best-robots/robotic-pool-cleaners/cordless/",
        why: "Five cordless reviews now. The shortlist page owns the head term so they do not fight each other for it.",
      },
      {
        term: "aiper scuba v3 review",
        path: "/robots/robotic-pool-cleaners/aiper-scuba-v3-ai-vision/",
        why: "The V3 is named as the camera-equipped step up. Naming a sibling is not targeting its term.",
      },
    ],
    researchedOn: RUN,
  },
  {
    path: "/robots/robotic-pool-cleaners/bublue-bubot-800p/",
    primary: { term: "bublue bubot 800p review", volume: 0, difficulty: 0, mustAppear: true },
    secondary: [
      { term: "bublue bubot 800p", volume: 0, difficulty: 0, mustAppear: true },
      { term: "bubot 800p", volume: 0, difficulty: 0, mustAppear: true },
      // The questions this page is built to answer for its actual buyer.
      { term: "corded robotic pool cleaner", volume: 0, difficulty: 0, mustAppear: true },
      { term: "bublue bubot 800p warranty", volume: 0, difficulty: 0, mustAppear: false },
      { term: "bubot 800p shallow water", volume: 0, difficulty: 0, mustAppear: false },
    ],
    cededTo: [
      {
        term: "robotic pool cleaner",
        path: "/robots/robotic-pool-cleaners/",
        why: "The category head term belongs to the hub, as on every review.",
      },
      {
        term: "best robotic pool cleaner",
        path: "/best-robots/robotic-pool-cleaners/",
        why: "A comparison SERP. One review is not a best-of.",
      },
      {
        term: "cordless robotic pool cleaner",
        path: "/best-robots/robotic-pool-cleaners/cordless/",
        why: "This machine is the corded counter-argument; it names the cordless shortlist without chasing its term.",
      },
      {
        term: "aiper scuba s1 review",
        path: "/robots/robotic-pool-cleaners/aiper-scuba-s1/",
        why: "The S1 is named as the cordless alternative for the same four zones. Naming a rival is not targeting its term.",
      },
    ],
    researchedOn: RUN,
  },
  {
    path: "/robots/robotic-pool-cleaners/wybot-c1/",
    primary: { term: "wybot c1 review", volume: 0, difficulty: 0, mustAppear: true },
    secondary: [
      { term: "wybot c1", volume: 0, difficulty: 0, mustAppear: true },
      { term: "wybot c1 cordless robotic pool cleaner", volume: 0, difficulty: 0, mustAppear: false },
      // The purchase-deciding questions for this machine's actual buyer.
      { term: "budget robotic pool cleaner", volume: 0, difficulty: 0, mustAppear: false },
      { term: "wybot c1 cycle timer", volume: 0, difficulty: 0, mustAppear: false },
      { term: "wybot c1 vs c1 pro", volume: 0, difficulty: 0, mustAppear: false },
    ],
    cededTo: [
      {
        term: "robotic pool cleaner",
        path: "/robots/robotic-pool-cleaners/",
        why: "The category head term belongs to the hub, as on every review.",
      },
      {
        term: "best robotic pool cleaner",
        path: "/best-robots/robotic-pool-cleaners/",
        why: "A comparison SERP. One review is not a best-of.",
      },
      {
        term: "cordless robotic pool cleaner",
        path: "/best-robots/robotic-pool-cleaners/cordless/",
        why: "Six cordless reviews now. The shortlist page owns the head term so they do not fight each other for it.",
      },
      {
        term: "cheap robotic pool cleaner",
        path: "/best-robots/robotic-pool-cleaners/",
        why: "A price-first searcher wants a comparison, not one product. This page earns that click from the best-of, not from the SERP.",
      },
    ],
    researchedOn: RUN,
  },
  {
    path: "/robots/robotic-pool-cleaners/beatbot-aquasense-2-ultra/",
    primary: { term: "beatbot aquasense 2 ultra review", volume: 0, difficulty: 0, mustAppear: true },
    secondary: [
      { term: "beatbot aquasense 2 ultra", volume: 0, difficulty: 0, mustAppear: true },
      { term: "aquasense 2 ultra", volume: 0, difficulty: 0, mustAppear: true },
      // The purchase-deciding questions for this machine's actual buyer.
      { term: "pool robot that skims the surface", volume: 0, difficulty: 0, mustAppear: false },
      { term: "beatbot aquasense 2 ultra warranty", volume: 0, difficulty: 0, mustAppear: false },
      { term: "beatbot clarification", volume: 0, difficulty: 0, mustAppear: false },
    ],
    cededTo: [
      {
        term: "robotic pool cleaner",
        path: "/robots/robotic-pool-cleaners/",
        why: "The category head term belongs to the hub, as on every review.",
      },
      {
        term: "best robotic pool cleaner",
        path: "/best-robots/robotic-pool-cleaners/",
        why: "A comparison SERP. One review is not a best-of, even the flagship's.",
      },
      {
        term: "cordless robotic pool cleaner",
        path: "/best-robots/robotic-pool-cleaners/cordless/",
        why: "Seven cordless reviews now. The shortlist page owns the head term so they do not fight each other for it.",
      },
      {
        term: "aiper scuba x1 pro max review",
        path: "/robots/robotic-pool-cleaners/aiper-scuba-x1-pro-max/",
        why: "The X1 Pro Max is named as the cheaper surface-skimming alternative. Naming a rival is not targeting its term.",
      },
    ],
    researchedOn: RUN,
  },

  /* ---- The four standalone guides, live 6 August 2026. ----
     Three lawn, one companion, and none of them ranks a product — there is
     nothing in either catalogue yet. Every row below was written from the
     research runs named at the bottom of it, before the page was written,
     which is the order BLUEPRINT §7 requires and the order that was not
     followed on 6 August when fifteen pages went up without it. */
  {
    path: "/guides/wire-free-robot-lawn-mower/",
    /* 720/mo at KD 0 on the exact phrase, ~1,670 across the family. It is a
       URL rather than a section of the hub on measured evidence: 2/10 shared
       domains with "robot lawn mower". A different SERP, not a different
       phrasing of the same one. */
    primary: { term: "wire free robot lawn mower", volume: 720, difficulty: 0, mustAppear: true },
    secondary: [
      /* THE HYPHENATED FORM IS DECLARED SEPARATELY ON PURPOSE. Google reads
         "wire free" and "wire-free" as the same thing; this register does
         not, because it matches literal strings against rendered copy. The
         page is written in the hyphenated form a reader expects and carries
         the unhyphenated phrase once, so both are asserted rather than one
         being assumed. */
      { term: "wire-free robot lawn mower", volume: 720, difficulty: 0, mustAppear: true },
      { term: "robot lawn mower without perimeter wire", volume: 210, difficulty: 0, mustAppear: true },
      { term: "gps robot lawn mower", volume: 590, difficulty: 48, mustAppear: true },
      { term: "lidar robot lawn mower", volume: 90, difficulty: 0, mustAppear: true },
      { term: "robot lawn mower without boundary wire", volume: 20, difficulty: 0, mustAppear: true },
    ],
    cededTo: [
      {
        term: "robot lawn mower",
        path: "/robots/robotic-lawn-mowers/",
        why: "The 74,000 head term belongs to the hub. This guide takes one buying constraint off it rather than the category, and the hub links here from its navigation section.",
      },
    ],
    researchedOn: RUN_LAWN,
  },
  {
    path: "/guides/cheap-robot-lawn-mower/",
    /* 390/mo at KD 11, and the closest call of the three lawn guides: 4/10
       shared domains with "best robot lawn mower". Recorded as the first to
       fold back into the hub if it underperforms. */
    primary: { term: "cheap robot lawn mower", volume: 390, difficulty: 11, mustAppear: true },
    secondary: [
      { term: "best budget robot lawn mower", volume: 0, difficulty: 0, mustAppear: true },
      /* THE PRICE CLUSTER MOVED HERE, 6 August 2026. The long-tail assignment
         pass put "robot lawn mower price" (1,900) and "robotic lawn mower
         price" (1,600) on the wire-free guide, which was wrong — a
         price-first searcher wants the cheap end explained, not a lesson in
         satellite navigation. Between them they are ten times this page's own
         primary, and they are the reason it earns a URL comfortably. */
      { term: "robot lawn mower price", volume: 1900, difficulty: 0, mustAppear: true },
      { term: "robotic lawn mower price", volume: 1600, difficulty: 0, mustAppear: true },
    ],
    cededTo: [
      {
        term: "robot lawn mower",
        path: "/robots/robotic-lawn-mowers/",
        why: "Head term, owned by the hub. This page takes the budget constraint and the price question, and hands anybody still choosing a category back to it.",
      },
    ],
    researchedOn: RUN_LAWN,
  },
  {
    path: "/guides/robot-lawn-mower-for-hills/",
    /* 200/mo — the smallest of the three and the one with the cleanest
       evidence. 7/10 shared domains with "do robot lawn mowers work on
       hills", 3/10 with "best robot lawn mower". The two hills queries are
       one page and that page is not the hub. */
    primary: { term: "best robot lawn mower for hills", volume: 200, difficulty: 0, mustAppear: true },
    secondary: [
      { term: "do robot lawn mowers work on hills", volume: 0, difficulty: 0, mustAppear: true },
      { term: "slope", volume: 200, difficulty: 0, mustAppear: true },
      { term: "gradient", volume: 0, difficulty: 0, mustAppear: true },
      /* Not required in copy: the phrasing only exists as a query, and forcing
         it into a sentence would produce the kind of writing this site bans. */
      { term: "robot lawn mower slope", volume: 0, difficulty: 0, mustAppear: false },
    ],
    cededTo: [
      {
        term: "robot lawn mower",
        path: "/robots/robotic-lawn-mowers/",
        why: "Head term, owned by the hub. Slope is a constraint the hub names in its terrain section and this page answers in full.",
      },
      {
        term: "cheap robot lawn mower",
        path: "/guides/cheap-robot-lawn-mower/",
        why: "The budget end of this market has no answer to a gradient, so this page names that and sends the reader whose lawn turns out flat to the page that does serve them.",
      },
    ],
    researchedOn: RUN_LAWN,
  },
  {
    path: "/guides/robotic-pets-for-elderly/",
    /* ~1,090/mo across four phrasings, every one at KD 0. Taken off the
       companion hub, which carried "robotic pet for elderly" as a secondary
       until this page existed. */
    primary: { term: "robotic pet for elderly", volume: 390, difficulty: 0, mustAppear: true },
    secondary: [
      { term: "elderly care robot", volume: 390, difficulty: 0, mustAppear: true },
      { term: "robotic pet for dementia", volume: 170, difficulty: 0, mustAppear: true },
      { term: "companion robot for elderly", volume: 140, difficulty: 0, mustAppear: true },
      { term: "robotic pets for elderly", volume: 390, difficulty: 0, mustAppear: true },
      { term: "robot cat realistic", volume: 1000, difficulty: 10, mustAppear: false },
      { term: "robotic cat for elderly", volume: 320, difficulty: 2, mustAppear: false },
      { term: "free robotic pets for seniors", volume: 170, difficulty: 0, mustAppear: false },
      { term: "interactive robotic cat toy", volume: 170, difficulty: 0, mustAppear: false },
      { term: "best robotic cat for seniors", volume: 110, difficulty: 1, mustAppear: false },
      { term: "dementia cat toy", volume: 110, difficulty: 0, mustAppear: false },
    ],
    cededTo: [
      {
        term: "robot pet",
        path: "/robots/companion-robots/",
        why: "The 8,100 head term belongs to the hub. This guide takes the care-setting intent, which measured as a different reader with a different question rather than a narrower version of the same one.",
      },
      {
        term: "pet camera robot",
        path: "/robots/pet-camera-robots/",
        why: "Named on this page because 'checking in from a distance' is one of the three motivations readers arrive with, and it is the one a companion robot answers worst. Naming the honest alternative is not targeting its term.",
      },
    ],
    researchedOn: RUN_COMPANION,
  },
  {
    /* YARBO SNOW BLOWER, built 11 August 2026 — one page carrying an entire
       category's demand, because the SERPs say it is one page.

       EVERY GENERIC TERM MEASURES 6-8 OF 10 SHARED DOMAINS AGAINST THE BRAND
       TERMS. `robot snow blower` (12,100) shares 7 of 10 with `yarbo` and 6 of
       10 with `yarbo snow blower`; `autonomous snow blower` shares 8 of 10 with
       `robot snow blower`. Google has collapsed the generic market onto one
       brand because there IS one brand, so a separate hub or guide would be a
       second URL competing with this one for a single results page.

       THE BRAND TERMS ARE TAKEN UNDER THE REVIEW EXCEPTION, not against the
       no-brand-term rule that refused `litter robot`, `roborock` and `irobot
       roomba`. Yarbo ranks position 1 on its own name; what its page does not
       answer is which SKU the price refers to, and that is what a review is
       for.

       `yarbo snow blower reviews` is a judgement call rather than a rule.
       It measures 4-5 of 10 — the ambiguous middle — and is kept here because
       it is review intent for the same product. */
    path: "/robots/robot-snow-blowers/yarbo-snow-blower/",
    primary: { term: "yarbo snow blower", volume: 14800, difficulty: 6, mustAppear: true },
    secondary: [
      { term: "yarbo", volume: 18100, difficulty: 13, mustAppear: true },
      { term: "yarbo snow blower reviews", volume: 2900, difficulty: 0, mustAppear: false },
      { term: "robot snow blower", volume: 12100, difficulty: 0, mustAppear: true },
      { term: "autonomous snow blower", volume: 3600, difficulty: 0, mustAppear: true },
      { term: "snow blower module", volume: 0, difficulty: 0, mustAppear: true },
    ],
    cededTo: [
      {
        term: "robot lawn mower",
        path: "/robots/robotic-lawn-mowers/",
        why: "The Core is the same platform, and the review says so — but the 74,000 head term belongs to the mower hub. This page names the relationship and does not reach for the term.",
      },
    ],
    researchedOn: RUN_AUGUST_10,
  },
  {
    /* BEST ROBOT LAWN MOWER, built 11 August 2026.

       THE SERP DECIDED THIS, NOT THE SYMMETRY. "robot lawn mower" and
       "best robot lawn mower" share 2 of 10 top-ten domains, so they are two
       results pages and earn two URLs. The litter category was measured the
       same way in the same run and shares 7 of 10 with its head term, which is
       why /best-robots/self-cleaning-litter-boxes/ does not exist and the hub
       keeps "best automatic litter box" in its own secondaries.

       5,400 at KD 8 against the hub's 74,000 at KD 36. The 2026 phrasing is
       not mustAppear: it is a real 1,000/mo query, and a page that stamps a
       year into its copy has to be edited every January or it starts lying. */
    path: "/best-robots/robotic-lawn-mowers/",
    primary: { term: "best robot lawn mower", volume: 5400, difficulty: 8, mustAppear: true },
    secondary: [
      { term: "best robotic lawn mower", volume: 5400, difficulty: 15, mustAppear: true },
      { term: "best robot lawn mower 2026", volume: 1000, difficulty: 3, mustAppear: false },
      { term: "best robot lawn mower for 1 acre", volume: 880, difficulty: 4, mustAppear: false },
    ],
    cededTo: [
      {
        term: "robot lawn mower",
        path: "/robots/robotic-lawn-mowers/",
        why: "The 74,000 head term is the hub's. This page answers 'which one', which is a different results page — 2 of 10 shared domains — and must not reach for the broad query as well.",
      },
      {
        term: "best robot lawn mower for hills",
        path: "/guides/robot-lawn-mower-for-hills/",
        why: "Ceded by the hub to the hills guide on 6 August and it stays there. The guide shares 7 of 10 domains with 'do robot lawn mowers work on hills' and only 3 of 10 with this page's primary.",
      },
      {
        term: "cheap robot lawn mower",
        path: "/guides/cheap-robot-lawn-mower/",
        why: "Same ruling as the hub's. 390/mo on its own name plus the price cluster, and its own SERP.",
      },
    ],
    researchedOn: RUN_AUGUST_10,
  },
  /* THE ROW FOR "/best-robots/window-cleaning-robots/" WAS HERE and is gone
     with the page, 12 August 2026. Every term it held — "best window cleaning
     robot", "best robot window cleaner", "window cleaning robot reviews",
     "high rise" — moved into the hub's row at the top of this file, which is
     where its own research said they belonged all along. */

  {
    path: "/guides/do-window-cleaning-robots-work/",
    /* THREE QUERY FAMILIES MERGED INTO ONE PAGE: "do window cleaning robots
       work" (90), "how do window cleaning robots work" (40) and "are window
       cleaning robots worth it" (30). One intent behind all three — a reader
       who has seen these advertised and does not believe them yet. Splitting
       them across three URLs would be three thin pages competing for one
       answer. The SERP is Reddit and forums, which is where an honest answer
       with a real "no" in it beats marketing copy. */
    primary: { term: "do window cleaning robots work", volume: 130, difficulty: 0, mustAppear: true },
    secondary: [
      { term: "how do window cleaning robots work", volume: 40, difficulty: 0, mustAppear: true },
      { term: "are window cleaning robots worth it", volume: 30, difficulty: 0, mustAppear: true },
      { term: "suction", volume: 0, difficulty: 0, mustAppear: true },
      { term: "streaking", volume: 0, difficulty: 0, mustAppear: true },
    ],
    cededTo: [
      {
        term: "best window cleaning robot",
        path: "/robots/window-cleaning-robots/",
        why: "A guide that ranks machines is a best-of wearing a hat. The ranking sits on the hub — 6 of the top 10 results are shared with the head term — and this page answers whether to buy at all before handing the reader on.",
      },
      {
        term: "window cleaning robot",
        path: "/robots/window-cleaning-robots/",
        why: "The 12,100 head term belongs to the hub. This guide takes one question off it rather than re-explaining the category.",
      },
    ],
    researchedOn: RUN_WINDOW,
  },

  /* ============================================================
     THE 10 AUGUST FILL — fifty pages that had no row.

     EVERY PRIMARY BELOW IS A TERM THE PAGE ALREADY CONTAINS, with
     one exception named at the bottom. That was a constraint, not
     an outcome: where the highest-volume candidate was not in the
     copy, the row takes the best term the page actually says and
     records the bigger one as a secondary with mustAppear:false.

     The alternative would have been to point fifty rows at terms
     the pages do not use and call the result a keyword strategy.
     It would have read better and asserted nothing.

     WHICH IS WHY SO MANY SECONDARIES ARE mustAppear:false. That
     flag is not a wish. It means "we expect to pick this up
     incidentally"; setting it true for a phrase the copy never
     says would break the one test this file exists to power. Each
     false is a sentence somebody could write, not a fact anybody
     has asserted.

     THE COMPARE PAGES ALL CEDE THEIR CATEGORY HEAD TERM. "robot
     lawn mower" is 74,000 a month and belongs to the hub; a
     comparison table that chased it would be competing with its
     own category page for the same reader. Each takes the
     comparison query instead, which is smaller and is what the
     page actually is.

     TWO ROWS RECORD A NUMBER NOBODY SHOULD ACT ON. /privacy/ and
     /terms/ carry the volumes of the bare English words "privacy"
     (110,000) and "terms" (74,000). Those figures are real and
     they are not an opportunity — nobody typing them wants a robot
     shop, and BotPlanet neither competes for them nor should. The
     rows exist so the pages are not mistaken for unassigned ones,
     which is the only job they have here.

     ONE PRIMARY IS mustAppear:false, and it is the homepage.
     "home robots" is 6,600 a month at KD 30 and is the right
     target for the front page; the front page does not currently
     contain the phrase. Recorded as the target with the flag
     telling the truth about today, rather than quietly retargeting
     the homepage at something weaker to keep a test green.
     ============================================================ */
  {
    path: "/robots/self-cleaning-litter-boxes/litter-robot-4/",
    primary: { term: "litter-robot 4", volume: 74000, difficulty: 15, mustAppear: true },
    secondary: [
      { term: "litter-robot 4 review", volume: 1000, difficulty: 19, mustAppear: false },
      { term: "litter-robot 4 manual", volume: 590, difficulty: 1, mustAppear: false },
      { term: "litter-robot 4 price", volume: 320, difficulty: 0, mustAppear: false },
      { term: "litter-robot 4 app", volume: 170, difficulty: 1, mustAppear: false },
      { term: "self cleaning litter box", volume: 110000, difficulty: 46, mustAppear: true },
    ],
    researchedOn: RUN_AUGUST_10,
  },
  {
    path: "/robots/self-cleaning-litter-boxes/petkit-purobot-max-pro-2/",
    primary: { term: "petkit purobot max pro 2", volume: 390, difficulty: 0, mustAppear: true },
    secondary: [
      { term: "purobot max pro 2", volume: 260, difficulty: 0, mustAppear: true },
      { term: "petkit purobot max pro 2 review", volume: 20, difficulty: 0, mustAppear: false },
    ],
    researchedOn: RUN_AUGUST_10,
  },
  {
    path: "/robots/self-cleaning-litter-boxes/petsafe-scoopfree-crystal-pro/",
    primary: { term: "petsafe scoopfree crystal pro", volume: 480, difficulty: 0, mustAppear: true },
    secondary: [
      { term: "scoopfree crystal pro", volume: 170, difficulty: 0, mustAppear: true },
    ],
    researchedOn: RUN_AUGUST_10,
  },
  {
    path: "/robots/self-cleaning-litter-boxes/casa-leo-loo-too/",
    primary: { term: "leos loo too", volume: 1000, difficulty: 0, mustAppear: true },
    secondary: [
      { term: "casa leo litter box", volume: 390, difficulty: 0, mustAppear: false },
      { term: "leos loo too review", volume: 10, difficulty: 0, mustAppear: false },
    ],
    researchedOn: RUN_AUGUST_10,
  },
  {
    path: "/robots/robotic-lawn-mowers/segway-navimow-i110n/",
    primary: { term: "segway navimow i110n", volume: 480, difficulty: 12, mustAppear: true },
    secondary: [
      { term: "navimow i110n", volume: 170, difficulty: 13, mustAppear: true },
      { term: "segway navimow i110n review", volume: 40, difficulty: 8, mustAppear: false },
      { term: "navimow i110n review", volume: 20, difficulty: 0, mustAppear: false },
    ],
    researchedOn: RUN_AUGUST_10,
  },
  {
    path: "/robots/robotic-lawn-mowers/eufy-e15/",
    primary: { term: "eufy robot lawn mower e15", volume: 390, difficulty: 11, mustAppear: true },
    secondary: [
      { term: "eufy e15 robot lawn mower", volume: 390, difficulty: 0, mustAppear: false },
      { term: "eufy robot lawn mower e15 review", volume: 30, difficulty: 0, mustAppear: false },
    ],
    researchedOn: RUN_AUGUST_10,
  },
  /* ONE ROW WHERE THERE WERE TWO, from 11 August 2026.

     These were two pages both listing "mammotion luba 3" (1,600) and "luba 3
     awd" (1,000) as secondaries they both had to rank for, each defending a
     SKU term worth 30 and 40. That is not two pages covering a range, it is
     two pages bidding against each other for 2,600 searches a month while
     splitting whatever authority either could earn.

     The merged page takes all four terms and both exact SKUs are mustAppear,
     because a reader searching the 3000H by name has to find its name on the
     page they land on — otherwise the merge has answered the wrong question.
     See MERGED_REVIEWS in content/product-names.ts for the 301. */
  {
    path: "/robots/robotic-lawn-mowers/mammotion-luba-3-awd-1500h/",
    primary: { term: "mammotion luba 3", volume: 1600, difficulty: 0, mustAppear: true },
    secondary: [
      { term: "luba 3 awd", volume: 1000, difficulty: 0, mustAppear: true },
      { term: "mammotion luba 3 awd 3000h", volume: 40, difficulty: 0, mustAppear: true },
      { term: "mammotion luba 3 awd 1500h", volume: 30, difficulty: 0, mustAppear: true },
      { term: "luba 3 awd 3000h", volume: 30, difficulty: 0, mustAppear: true },
      { term: "luba 3 awd 1500h", volume: 20, difficulty: 0, mustAppear: true },
    ],
    researchedOn: RUN_AUGUST_10,
  },
  {
    path: "/robots/robotic-lawn-mowers/husqvarna-automower-410iq/",
    primary: { term: "husqvarna automower 410iq", volume: 110, difficulty: 0, mustAppear: true },
    secondary: [
      { term: "husqvarna 410iq", volume: 210, difficulty: 0, mustAppear: false },
      { term: "automower 410iq", volume: 10, difficulty: 0, mustAppear: true },
    ],
    researchedOn: RUN_AUGUST_10,
  },
  {
    path: "/robots/robotic-lawn-mowers/worx-landroid-vision-wr320/",
    primary: { term: "worx landroid vision", volume: 260, difficulty: 0, mustAppear: true },
    secondary: [
      { term: "landroid vision", volume: 50, difficulty: 0, mustAppear: true },
    ],
    researchedOn: RUN_AUGUST_10,
  },
  {
    path: "/robots/robotic-lawn-mowers/dreame-a3-awd-1000/",
    primary: { term: "dreame a3 awd", volume: 170, difficulty: 0, mustAppear: true },
    secondary: [
      { term: "dreame a3 awd 1000", volume: 20, difficulty: 0, mustAppear: true },
      { term: "dreame robot lawn mower", volume: 90, difficulty: 0, mustAppear: false },
    ],
    researchedOn: RUN_AUGUST_10,
  },
  {
    path: "/robots/window-cleaning-robots/ecovacs-winbot-mini/",
    primary: { term: "winbot mini", volume: 260, difficulty: 5, mustAppear: true },
    secondary: [
      { term: "ecovacs winbot mini", volume: 210, difficulty: 0, mustAppear: true },
      { term: "ecovacs winbot mini review", volume: 40, difficulty: 2, mustAppear: true },
      { term: "winbot mini review", volume: 40, difficulty: 2, mustAppear: true },
    ],
    researchedOn: RUN_AUGUST_10,
  },
  {
    path: "/robots/window-cleaning-robots/ecovacs-winbot-w3-omni/",
    primary: { term: "winbot w3 omni", volume: 110, difficulty: 0, mustAppear: true },
    secondary: [
      { term: "ecovacs winbot w3 omni", volume: 70, difficulty: 1, mustAppear: true },
      { term: "winbot w3 omni review", volume: 10, difficulty: 0, mustAppear: true },
    ],
    researchedOn: RUN_AUGUST_10,
  },
  {
    path: "/robots/window-cleaning-robots/ecovacs-winbot-w2s/",
    primary: { term: "winbot w2s", volume: 70, difficulty: 0, mustAppear: true },
    secondary: [
      { term: "ecovacs winbot w2s", volume: 40, difficulty: 0, mustAppear: true },
      { term: "ecovacs winbot w2s review", volume: 10, difficulty: 0, mustAppear: true },
    ],
    researchedOn: RUN_AUGUST_10,
  },
  {
    path: "/robots/window-cleaning-robots/hobot-298/",
    primary: { term: "hobot 298", volume: 50, difficulty: 0, mustAppear: true },
    secondary: [
      { term: "hobot 298 review", volume: 10, difficulty: 53, mustAppear: true },
      { term: "hobot 298 price", volume: 10, difficulty: 0, mustAppear: false },
      { term: "hobot 298 manual", volume: 10, difficulty: 0, mustAppear: false },
    ],
    researchedOn: RUN_AUGUST_10,
  },
  {
    path: "/robots/window-cleaning-robots/hobot-2s/",
    primary: { term: "hobot 2s", volume: 40, difficulty: 0, mustAppear: true },
    secondary: [
      { term: "hobot 2s review", volume: 10, difficulty: 0, mustAppear: true },
      { term: "hobot 2s price", volume: 10, difficulty: 0, mustAppear: false },
    ],
    researchedOn: RUN_AUGUST_10,
  },
  {
    path: "/robots/window-cleaning-robots/hutt-s55-pro/",
    primary: { term: "hutt s55 pro", volume: 10, difficulty: 0, mustAppear: true },
    secondary: [
      { term: "hutt window cleaning robot", volume: 70, difficulty: 0, mustAppear: false },
    ],
    researchedOn: RUN_AUGUST_10,
  },
  {
    path: "/robots/window-cleaning-robots/mamibot-w120-dp/",
    /* "mamibot w120", not "mamibot w120-dp": the shorter form is what the plan
       named on 5 August and it measures higher (20 against 10). The H1 reads
       "Mamibot W120-DP review", which contains it. */
    primary: { term: "mamibot w120", volume: 20, difficulty: 0, mustAppear: true },
    secondary: [
      { term: "mamibot w120-dp", volume: 10, difficulty: 0, mustAppear: true },
    ],
    researchedOn: RUN_AUGUST_10,
  },
  {
    path: "/robots/window-cleaning-robots/cop-rose-x5s/",
    primary: { term: "cop rose x5s", volume: 0, difficulty: 0, mustAppear: true },
    secondary: [
      { term: "cop rose window cleaning robot", volume: 10, difficulty: 0, mustAppear: false },
      { term: "cop rose robot", volume: 10, difficulty: 0, mustAppear: false },
    ],
    researchedOn: RUN_AUGUST_10,
  },
  {
    path: "/robots/educational-coding-robots/sphero-bolt/",
    primary: { term: "sphero bolt", volume: 4400, difficulty: 32, mustAppear: true },
    secondary: [
      { term: "sphero bolt app", volume: 210, difficulty: 48, mustAppear: false },
      { term: "sphero bolt price", volume: 70, difficulty: 21, mustAppear: false },
      { term: "sphero bolt review", volume: 20, difficulty: 0, mustAppear: true },
      { term: "sphero bolt coding robot", volume: 170, difficulty: 24, mustAppear: false },
    ],
    researchedOn: RUN_AUGUST_10,
  },
  {
    path: "/robots/educational-coding-robots/sphero-mini/",
    primary: { term: "sphero mini", volume: 2900, difficulty: 15, mustAppear: true },
    secondary: [
      { term: "sphero mini app", volume: 320, difficulty: 48, mustAppear: false },
      { term: "sphero mini price", volume: 70, difficulty: 3, mustAppear: false },
      { term: "sphero mini review", volume: 20, difficulty: 0, mustAppear: true },
    ],
    researchedOn: RUN_AUGUST_10,
  },
  {
    path: "/robots/educational-coding-robots/sphero-indi/",
    primary: { term: "sphero indi", volume: 1600, difficulty: 1, mustAppear: true },
    secondary: [
      { term: "sphero indi app", volume: 40, difficulty: 50, mustAppear: false },
      { term: "sphero indi review", volume: 10, difficulty: 11, mustAppear: true },
    ],
    researchedOn: RUN_AUGUST_10,
  },
  {
    path: "/robots/educational-coding-robots/ozobot-evo/",
    primary: { term: "ozobot evo", volume: 1300, difficulty: 5, mustAppear: true },
    secondary: [
      { term: "ozobot evo app", volume: 140, difficulty: 6, mustAppear: false },
      { term: "ozobot evo price", volume: 30, difficulty: 0, mustAppear: false },
      { term: "ozobot evo review", volume: 10, difficulty: 1, mustAppear: true },
      { term: "ozobot evo coding robot", volume: 70, difficulty: 4, mustAppear: false },
    ],
    researchedOn: RUN_AUGUST_10,
  },
  {
    path: "/robots/educational-coding-robots/makeblock-mbot/",
    primary: { term: "makeblock mbot", volume: 880, difficulty: 29, mustAppear: true },
    secondary: [
      { term: "mbot", volume: 5400, difficulty: 23, mustAppear: true },
      { term: "makeblock mbot app", volume: 20, difficulty: 0, mustAppear: false },
      { term: "makeblock mbot review", volume: 10, difficulty: 0, mustAppear: true },
    ],
    researchedOn: RUN_AUGUST_10,
  },
  {
    path: "/robots/pet-camera-robots/enabot-ebo-air-2/",
    primary: { term: "ebo air 2", volume: 2400, difficulty: 0, mustAppear: true },
    secondary: [
      { term: "enabot ebo air 2", volume: 390, difficulty: 2, mustAppear: true },
      { term: "ebo air 2 review", volume: 30, difficulty: 0, mustAppear: true },
      { term: "enabot ebo air 2 review", volume: 10, difficulty: 0, mustAppear: true },
    ],
    researchedOn: RUN_AUGUST_10,
  },
  {
    path: "/robots/pet-camera-robots/enabot-ebo-se/",
    primary: { term: "ebo se", volume: 390, difficulty: 0, mustAppear: true },
    secondary: [
      { term: "enabot ebo se", volume: 260, difficulty: 0, mustAppear: true },
      { term: "enabot ebo se review", volume: 20, difficulty: 0, mustAppear: true },
    ],
    researchedOn: RUN_AUGUST_10,
  },
  {
    path: "/robots/pet-camera-robots/enabot-rola-petpal/",
    primary: { term: "rola petpal", volume: 140, difficulty: 0, mustAppear: true },
    secondary: [
      { term: "enabot rola petpal", volume: 50, difficulty: 0, mustAppear: true },
      { term: "rola petpal review", volume: 10, difficulty: 0, mustAppear: true },
    ],
    researchedOn: RUN_AUGUST_10,
  },
  {
    path: "/robots/companion-robots/joy-for-all-companion-pets/",
    primary: { term: "joy for all companion pet", volume: 1900, difficulty: 0, mustAppear: true },
    secondary: [
      { term: "joy for all companion pet cat", volume: 1000, difficulty: 0, mustAppear: true },
      { term: "joy for all cat", volume: 590, difficulty: 0, mustAppear: false },
    ],
    researchedOn: RUN_AUGUST_10,
  },
  {
    path: "/compare/robotic-lawn-mowers/",
    primary: { term: "compare robotic lawn mowers", volume: 90, difficulty: 39, mustAppear: true },
    secondary: [
      { term: "robotic lawn mower comparison", volume: 90, difficulty: 15, mustAppear: false },
      { term: "robot lawn mower comparison", volume: 90, difficulty: 17, mustAppear: false },
      { term: "best robot lawn mower", volume: 5400, difficulty: 8, mustAppear: false },
      { term: "robotic lawn mowers reviews", volume: 2400, difficulty: 38, mustAppear: false },
    ],
    cededTo: [
      {
        term: "robot lawn mower",
        path: "/robots/robotic-lawn-mowers/",
        why: "The 74,000 head term is the hub's. This page is the table of every model, which is a different job and a different query.",
      },
    ],
    researchedOn: RUN_AUGUST_10,
  },
  {
    path: "/compare/self-cleaning-litter-boxes/",
    primary: { term: "compare self cleaning litter boxes", volume: 30, difficulty: 37, mustAppear: true },
    secondary: [
      { term: "self cleaning litter box comparison", volume: 30, difficulty: 7, mustAppear: false },
      { term: "best self cleaning litter box", volume: 9900, difficulty: 21, mustAppear: false },
      { term: "litter box comparison", volume: 10, difficulty: 0, mustAppear: false },
    ],
    cededTo: [
      {
        term: "self cleaning litter box",
        path: "/robots/self-cleaning-litter-boxes/",
        why: "The 110,000 head term is the hub's. A comparison table answers a narrower question and should not fight the page that answers the broad one.",
      },
    ],
    researchedOn: RUN_AUGUST_10,
  },
  {
    path: "/compare/window-cleaning-robots/",
    primary: { term: "compare window cleaning robots", volume: 0, difficulty: 0, mustAppear: true },
    secondary: [
      { term: "window cleaning robot comparison", volume: 20, difficulty: 45, mustAppear: false },
      { term: "best window cleaning robots", volume: 1300, difficulty: 0, mustAppear: false },
    ],
    cededTo: [
      {
        term: "window cleaning robot",
        path: "/robots/window-cleaning-robots/",
        why: "The hub owns the head term and the reader who types it wants the category explained, not a table of every model in it.",
      },
      {
        term: "best window cleaning robot",
        path: "/robots/window-cleaning-robots/",
        why: "The ranking lives on the hub, which is where the SERP measurement put it: 6 of the top 10 results are shared with the head term. This table answers a narrower question and must not fight the page that carries the recommendation.",
      },
    ],
    researchedOn: RUN_AUGUST_10,
  },
  {
    path: "/compare/companion-robots/",
    primary: { term: "compare companion robots", volume: 0, difficulty: 0, mustAppear: true },
    secondary: [
      { term: "best companion robots", volume: 110, difficulty: 0, mustAppear: false },
    ],
    cededTo: [
      {
        term: "robot pet",
        path: "/robots/companion-robots/",
        why: "The hub owns the head term and the reader who types it wants the category explained, not a table of every model in it.",
      },
    ],
    researchedOn: RUN_AUGUST_10,
  },
  {
    path: "/compare/pet-camera-robots/",
    primary: { term: "compare pet camera robots", volume: 0, difficulty: 0, mustAppear: true },
    secondary: [
      { term: "best pet camera robot", volume: 10, difficulty: 0, mustAppear: false },
      { term: "robot pet camera", volume: 140, difficulty: 0, mustAppear: false },
    ],
    cededTo: [
      {
        term: "pet camera robot",
        path: "/robots/pet-camera-robots/",
        why: "The hub owns the head term and the reader who types it wants the category explained, not a table of every model in it.",
      },
    ],
    researchedOn: RUN_AUGUST_10,
  },
  {
    path: "/compare/educational-coding-robots/",
    primary: { term: "compare coding robots", volume: 0, difficulty: 0, mustAppear: true },
    secondary: [
      { term: "coding robots for kids", volume: 0, difficulty: 0, mustAppear: true },
      { term: "stem robots for kids", volume: 0, difficulty: 0, mustAppear: false },
    ],
    cededTo: [
      {
        term: "coding robot",
        path: "/robots/educational-coding-robots/",
        why: "The hub owns the head term and the reader who types it wants the category explained, not a table of every model in it.",
      },
    ],
    researchedOn: RUN_AUGUST_10,
  },
  {
    path: "/compare/robot-vacuums/",
    /* Added 10 August 2026 with the category's first eleven products. The page
       has been indexable and register-less since the compare tree shipped,
       which the SEO audit reports as a page nobody has decided the purpose of
       — correctly, because until there was a catalogue there was nothing in
       the table to decide about.

       THE HEAD TERM IS THE HUB'S and this page must not reach for it. A reader
       typing "robot vacuum" wants the category explained; a reader arriving
       here wants eleven machines on the same columns. Different queries,
       different pages, and the 135,000/mo one belongs to the page written for
       it. */
    primary: { term: "compare robot vacuums", volume: 0, difficulty: 0, mustAppear: true },
    secondary: [
      { term: "robot vacuum comparison", volume: 0, difficulty: 0, mustAppear: false },
      { term: "mop lifting", volume: 0, difficulty: 0, mustAppear: false },
      { term: "self-emptying", volume: 0, difficulty: 0, mustAppear: false },
    ],
    cededTo: [
      {
        term: "robot vacuum",
        path: "/robots/robot-vacuums/",
        why: "The 135,000/mo head term is the hub's, and it is the most defended SERP on the site — Wirecutter, PCMag, RTINGS, The Verge, Consumer Reports and vacuumwars all rank on it. One page reaches for that, and it is the one written to explain the category rather than tabulate it.",
      },
      {
        term: "best robot vacuum",
        path: "/robots/robot-vacuums/",
        why: "60,500/mo, carried by the hub on 6 shared top-ten domains with the head term. A table of every model is not a ranking and must not compete with the page that makes one.",
      },
    ],
    researchedOn: RUN_VACUUM,
  },
  {
    path: "/compare/eilik-vs-emo/",
    primary: { term: "eilik vs emo", volume: 20, difficulty: 0, mustAppear: true },
    secondary: [
      { term: "emo vs eilik", volume: 10, difficulty: 0, mustAppear: false },
      { term: "eilik or emo", volume: 10, difficulty: 0, mustAppear: true },
      { term: "desk robot", volume: 1300, difficulty: 2, mustAppear: true },
    ],
    researchedOn: RUN_AUGUST_10,
  },
  {
    path: "/",
    primary: { term: "home robots", volume: 6600, difficulty: 30, mustAppear: false },
    secondary: [
      { term: "home robot", volume: 6600, difficulty: 53, mustAppear: false },
      { term: "robots for the home", volume: 6600, difficulty: 53, mustAppear: false },
      { term: "best robots", volume: 2400, difficulty: 17, mustAppear: false },
    ],
    cededTo: [
      {
        term: "robotic pool cleaner",
        path: "/robots/robotic-pool-cleaners/",
        why: "Every category head term belongs to its hub. A homepage that chases one of them competes with its own page.",
      },
    ],
    researchedOn: RUN_AUGUST_10,
  },
  {
    path: "/best-robots/",
    primary: { term: "best robots", volume: 2400, difficulty: 17, mustAppear: true },
    secondary: [
      /* Was the H1 — "Best picks by use case" — until that H1 became "The best
         robots, by use case" so the page carried the term it targets. The
         phrase left the page with it, so the flag follows. */
      { term: "best picks", volume: 1000, difficulty: 100, mustAppear: false },
      { term: "best home robots", volume: 260, difficulty: 18, mustAppear: false },
      { term: "best household robots", volume: 260, difficulty: 14, mustAppear: false },
    ],
    cededTo: [
      {
        term: "best robotic pool cleaner",
        path: "/best-robots/robotic-pool-cleaners/",
        why: "The per-category best-of pages own their own terms; this index points at them.",
      },
    ],
    researchedOn: RUN_AUGUST_10,
  },
  {
    path: "/robots/",
    primary: { term: "robot categories", volume: 20, difficulty: 0, mustAppear: true },
    secondary: [
      { term: "types of robots", volume: 1900, difficulty: 21, mustAppear: false },
    ],
    researchedOn: RUN_AUGUST_10,
  },
  {
    path: "/guides/",
    primary: { term: "robot guides", volume: 320, difficulty: 28, mustAppear: true },
    secondary: [
      { term: "robot buying guide", volume: 10, difficulty: 0, mustAppear: false },
    ],
    researchedOn: RUN_AUGUST_10,
  },
  {
    path: "/compare/",
    primary: { term: "compare robots", volume: 10, difficulty: 0, mustAppear: true },
    secondary: [
      { term: "robot comparison", volume: 10, difficulty: 0, mustAppear: false },
    ],
    researchedOn: RUN_AUGUST_10,
  },
  {
    path: "/botmatch/",
    primary: { term: "find your robot", volume: 0, difficulty: 0, mustAppear: true },
    secondary: [
      { term: "robot quiz", volume: 90, difficulty: 0, mustAppear: false },
      { term: "which robot", volume: 30, difficulty: 89, mustAppear: false },
    ],
    researchedOn: RUN_AUGUST_10,
  },
  {
    path: "/guides/robotic-pool-cleaners/",
    primary: { term: "robotic pool cleaner guides", volume: 0, difficulty: 0, mustAppear: true },
    secondary: [
      { term: "robotic pool cleaner buying guide", volume: 10, difficulty: 0, mustAppear: false },
    ],
    researchedOn: RUN_AUGUST_10,
  },
  {
    path: "/about/",
    primary: { term: "botplanet", volume: 10, difficulty: 0, mustAppear: true },
    secondary: [],
    researchedOn: RUN_AUGUST_10,
  },
  {
    path: "/affiliate-disclosure/",
    primary: { term: "affiliate disclosure", volume: 170, difficulty: 19, mustAppear: true },
    secondary: [],
    researchedOn: RUN_AUGUST_10,
  },
  {
    path: "/editorial-policy/",
    primary: { term: "editorial policy", volume: 70, difficulty: 23, mustAppear: true },
    secondary: [],
    researchedOn: RUN_AUGUST_10,
  },
  {
    path: "/review-methodology/",
    primary: { term: "testing methodology", volume: 390, difficulty: 0, mustAppear: true },
    secondary: [
      { term: "how we test robots", volume: 0, difficulty: 0, mustAppear: false },
    ],
    researchedOn: RUN_AUGUST_10,
  },
  {
    path: "/how-botmatch-works/",
    primary: { term: "how botmatch works", volume: 0, difficulty: 0, mustAppear: true },
    secondary: [],
    researchedOn: RUN_AUGUST_10,
  },
  {
    /* THE MASTHEAD IS NOT A RANKING TARGET AND IS WORTH MORE THAN ONE.
       Author pages are an E-E-A-T surface: their job is to be the thing a
       Person node in every review resolves to, so that sixty-three reviews
       point at one entity rather than at a repeated string. Nobody searches
       for them and we do not want them to. */
    path: "/authors/",
    primary: { term: "who writes botplanet", volume: 0, difficulty: 0, mustAppear: true },
    secondary: [
      { term: "editorial team", volume: 0, difficulty: 0, mustAppear: false },
    ],
    notRanking:
      "A masthead exists so a reader can find out who is telling them not to buy something, and so the Person node in every review has a URL that resolves. Neither job is a search query, and competing for one would be inventing demand that is not there.",
    researchedOn: RUN_AUGUST_10,
  },
  {
    path: "/authors/danny/",
    primary: { term: "daniel allan botplanet", volume: 0, difficulty: 0, mustAppear: true },
    secondary: [],
    notRanking:
      "An author page ranks for the author's own name or for nothing, and that is the correct outcome. It exists to be the entity the founder's byline resolves to on the guides, the best-of shortlists and the comparison tables.",
    researchedOn: RUN_AUGUST_10,
  },
  {
    path: "/authors/michelle-choa/",
    primary: { term: "michelle choa botplanet", volume: 0, difficulty: 0, mustAppear: true },
    secondary: [],
    notRanking:
      "As above. It exists to be the entity the Reviews Editor's byline resolves to across all sixty-three product reviews, which is the whole mechanism behind an author being recognised as one.",
    researchedOn: RUN_AUGUST_10,
  },
  {
    path: "/contact/",
    primary: { term: "contact botplanet", volume: 0, difficulty: 0, mustAppear: true },
    secondary: [],
    researchedOn: RUN_AUGUST_10,
  },
  {
    path: "/privacy/",
    primary: { term: "privacy", volume: 110000, difficulty: 63, mustAppear: true },
    secondary: [
      { term: "privacy policy", volume: 27100, difficulty: 100, mustAppear: false },
    ],
    notRanking:
      "A privacy policy exists so a reader can check what we collect, and to satisfy the law. The 110,000 belongs to the bare English word and to nobody in particular; we do not compete for it and should not.",
    researchedOn: RUN_AUGUST_10,
  },
  {
    path: "/terms/",
    primary: { term: "terms", volume: 74000, difficulty: 20, mustAppear: true },
    secondary: [
      { term: "terms of use", volume: 2900, difficulty: 44, mustAppear: false },
    ],
    notRanking:
      "Terms of use exist to be readable when somebody needs them. The 74,000 is the generic word and is not a robot-shopping query; nothing here is aimed at winning it.",
    researchedOn: RUN_AUGUST_10,
  },
  {
    path: "/robots/grill-cleaning-robots/grillbot/",
    /* 18,100/mo at KD 11 — the highest-volume term BotPlanet targets outside
       the pool and vacuum head terms, and the reason this category was kept
       after the 6 August run was designed to kill it. The brand outranks the
       category it belongs to: `grillbot` 18,100 against `grill cleaning robot`
       5,400, the same shape Litter-Robot has in litter. */
    primary: { term: "grillbot", volume: 18100, difficulty: 11, mustAppear: true },
    secondary: [
      { term: "grillbot review", volume: 5400, difficulty: 0, mustAppear: true },
      { term: "does grillbot work", volume: 210, difficulty: 0, mustAppear: false },
      { term: "grillbot price", volume: 0, difficulty: 0, mustAppear: false },
    ],
    cededTo: [
      {
        term: "grill cleaning robot",
        path: "/robots/grill-cleaning-robots/",
        why: "The category head term belongs to the hub, which explains what these machines do and who should buy a brush instead. This page answers one machine.",
      },
    ],
    researchedOn: RUN_GRILL,
  },

  /* ==================================================================
     ROBOT VACUUM REVIEWS — eleven pages, 94,300/mo, built 10 August 2026.

     ALL ELEVEN ARE KD 0 AND THE HUB THEY SIT UNDER IS KD 25 AGAINST
     Wirecutter, PCMag, RTINGS, The Verge, Consumer Reports and
     vacuumwars. That is the argument for building the reviews first: the
     model terms are the cheapest real traffic in the category and they
     add up to more than two thirds of the head term's volume between
     them, on a SERP nobody is defending.

     THE HEAD TERMS ARE CEDED BY ALL ELEVEN, uniformly. `robot vacuum`
     belongs to the hub and `best robot vacuum` to the hub's best-of
     section; a single review is not a comparison and must not compete
     with the page that is one. The per-page cessions below only record
     what is specific to that machine.

     FOUR PRIMARIES ARE FAMILY NAMES AND THE PAGE SAYS SO. `shark
     powerdetect`, `shark matrix robot vacuum`, `roborock qrevo` and
     `ecovacs deebot` each cover three or four current machines, so each
     of those four pages opens by naming the family and pinning one SKU.
     Targeting a family term with a page about one machine is only honest
     if the page tells the reader that is what happened, and these do.

     AND ONE PRIMARY NAMES A MACHINE THAT IS NOT FOR SALE. `roborock s8
     maxv ultra`, 9,900/mo, has no first-party Amazon US listing — every
     result carrying the string is a third-party accessory kit, checked
     10 August 2026. The page is built on the S8 Max Ultra that stands in
     its place and the term stays as the primary, because the demand is
     real and the useful answer is "here is what happened to it".
     ================================================================== */
  {
    path: "/robots/robot-vacuums/eufy-omni-s1-pro/",
    /* 33,100/mo — the largest product term in the category and the third
       largest on the site. eufy lists the machine as the Omni S1 Pro, so
       the page carries both namings and the slug follows eufy. */
    primary: { term: "eufy s1 pro", volume: 33100, difficulty: 0, mustAppear: true },
    secondary: [
      { term: "eufy omni s1 pro", volume: 0, difficulty: 0, mustAppear: true },
      { term: "roller mop", volume: 0, difficulty: 0, mustAppear: true },
      { term: "hard floors", volume: 0, difficulty: 0, mustAppear: true },
      { term: "eufy s1 pro price", volume: 0, difficulty: 0, mustAppear: false },
      { term: "eufy s1 pro review", volume: 0, difficulty: 0, mustAppear: false },
    ],
    cededTo: [
      { term: "robot vacuum", path: "/robots/robot-vacuums/", why: "The category head term belongs to the hub, as on every review in this category." },
      { term: "eufy x10 pro omni", path: "/robots/robot-vacuums/eufy-x10-pro-omni/", why: "The X10 is named as the cheaper and better-rated alternative from the same brand. Naming a sibling is not targeting its term." },
    ],
    researchedOn: RUN_VACUUM,
  },
  {
    path: "/robots/robot-vacuums/roborock-s8-max-ultra/",
    /* 9,900/mo for a machine with no Amazon US listing. The page keeps the
       term and answers it under the name the shelf actually uses — see the
       block above and docs/commerce/robot-vacuums-identity.md. */
    primary: { term: "roborock s8 maxv ultra", volume: 9900, difficulty: 0, mustAppear: true },
    secondary: [
      { term: "roborock s8 max ultra", volume: 0, difficulty: 0, mustAppear: true },
      { term: "mop lift", volume: 0, difficulty: 0, mustAppear: true },
      { term: "obstacle avoidance", volume: 0, difficulty: 0, mustAppear: true },
      { term: "s8 maxv ultra discontinued", volume: 0, difficulty: 0, mustAppear: false },
    ],
    cededTo: [
      { term: "robot vacuum", path: "/robots/robot-vacuums/", why: "The category head term belongs to the hub, as on every review in this category." },
      { term: "roborock saros 10", path: "/robots/robot-vacuums/roborock-saros-10/", why: "The Saros is named as the deep-pile answer this machine is not. Naming a sibling is not targeting its term." },
    ],
    researchedOn: RUN_VACUUM,
  },
  {
    path: "/robots/robot-vacuums/eufy-x10-pro-omni/",
    /* 8,100/mo, and the machine this category recommends by default:
       39,206 ratings at 4.6 for $449.99. */
    primary: { term: "eufy x10 pro omni", volume: 8100, difficulty: 0, mustAppear: true },
    secondary: [
      { term: "mop lifting", volume: 0, difficulty: 0, mustAppear: true },
      { term: "self-emptying", volume: 0, difficulty: 0, mustAppear: true },
      { term: "carpet", volume: 0, difficulty: 0, mustAppear: true },
      { term: "eufy x10 pro omni review", volume: 0, difficulty: 0, mustAppear: false },
      { term: "eufy x10 vs c28", volume: 0, difficulty: 0, mustAppear: false },
    ],
    cededTo: [
      { term: "robot vacuum", path: "/robots/robot-vacuums/", why: "The category head term belongs to the hub, as on every review in this category." },
    ],
    researchedOn: RUN_VACUUM,
  },
  {
    path: "/robots/robot-vacuums/shark-powerdetect-av2820s/",
    /* 8,100/mo on a FAMILY name covering three machines from $549.99 to
       $849.99. The page pins the AV2820S and opens by separating it from
       the RV2820ZE, which is fifty dollars away and mops. */
    primary: { term: "shark powerdetect", volume: 8100, difficulty: 0, mustAppear: true },
    secondary: [
      { term: "av2820s", volume: 0, difficulty: 0, mustAppear: true },
      { term: "object detection", volume: 0, difficulty: 0, mustAppear: true },
      { term: "pet hair", volume: 0, difficulty: 0, mustAppear: true },
      { term: "shark powerdetect nevertouch pro", volume: 0, difficulty: 0, mustAppear: false },
    ],
    cededTo: [
      { term: "robot vacuum", path: "/robots/robot-vacuums/", why: "The category head term belongs to the hub, as on every review in this category." },
      { term: "shark matrix robot vacuum", path: "/robots/robot-vacuums/shark-matrix-plus-ur2650ws/", why: "Shark's other line, at half the price and with a different argument. Two Shark reviews must not fight each other for one brand's traffic." },
    ],
    researchedOn: RUN_VACUUM,
  },
  {
    path: "/robots/robot-vacuums/shark-matrix-plus-ur2650ws/",
    /* 8,100/mo on a family name covering TWO Shark lines — Matrix Plus and
       AI Ultra — mixed together in one result set. The page pins the
       UR2650WS, which carries 35,917 ratings, the largest pool of the
       eleven by an order of magnitude. */
    primary: { term: "shark matrix robot vacuum", volume: 8100, difficulty: 0, mustAppear: true },
    secondary: [
      { term: "ur2650ws", volume: 0, difficulty: 0, mustAppear: true },
      { term: "self-emptying", volume: 0, difficulty: 0, mustAppear: true },
      { term: "sonic mopping", volume: 0, difficulty: 0, mustAppear: true },
      { term: "shark matrix plus review", volume: 0, difficulty: 0, mustAppear: false },
    ],
    cededTo: [
      { term: "robot vacuum", path: "/robots/robot-vacuums/", why: "The category head term belongs to the hub, as on every review in this category." },
      { term: "shark powerdetect", path: "/robots/robot-vacuums/shark-powerdetect-av2820s/", why: "Shark's dearer line with object detection. Two Shark reviews must not fight each other for one brand's traffic." },
    ],
    researchedOn: RUN_VACUUM,
  },
  {
    path: "/robots/robot-vacuums/roborock-qrevo-s5v/",
    /* 6,600/mo on a family name covering four machines across a $380
       spread. The page pins the S5V, the cheapest of them and the one
       Amazon returns first. */
    primary: { term: "roborock qrevo", volume: 6600, difficulty: 0, mustAppear: true },
    secondary: [
      { term: "qrevo s5v", volume: 0, difficulty: 0, mustAppear: true },
      { term: "flexiarm", volume: 0, difficulty: 0, mustAppear: true },
      { term: "mop lifting", volume: 0, difficulty: 0, mustAppear: true },
      { term: "roborock qrevo comparison", volume: 0, difficulty: 0, mustAppear: false },
    ],
    cededTo: [
      { term: "robot vacuum", path: "/robots/robot-vacuums/", why: "The category head term belongs to the hub, as on every review in this category." },
      { term: "roborock", path: "", why: "110,000/mo and refused as a target across the whole site, not ceded to a page. Roborock's own site ranks its brand query outright and a comparison site does not take a brand term off its owner." },
    ],
    researchedOn: RUN_VACUUM,
  },
  {
    path: "/robots/robot-vacuums/dreame-x50-ultra/",
    /* 6,600/mo. The only machine in the catalogue claiming to climb a 6cm
       step, and the page's job is to separate that claim from mop
       lifting, which dreame does not publish anywhere we could read. */
    primary: { term: "dreame x50 ultra", volume: 6600, difficulty: 0, mustAppear: true },
    secondary: [
      { term: "obstacle crossing", volume: 0, difficulty: 0, mustAppear: true },
      { term: "obstacle avoidance", volume: 0, difficulty: 0, mustAppear: true },
      { term: "dreame x50 ultra review", volume: 0, difficulty: 0, mustAppear: false },
      { term: "dreame x50 ultra complete", volume: 0, difficulty: 0, mustAppear: false },
    ],
    cededTo: [
      { term: "robot vacuum", path: "/robots/robot-vacuums/", why: "The category head term belongs to the hub, as on every review in this category." },
      { term: "dreame x40 ultra", path: "/robots/robot-vacuums/dreame-x40-ultra/", why: "The cheaper dreame with its own gap in the record. Naming a sibling is not targeting its term." },
    ],
    researchedOn: RUN_VACUUM,
  },
  {
    path: "/robots/robot-vacuums/dreame-x40-ultra/",
    /* 4,400/mo. The page leads with the gap rather than the specification:
       dreame's own pages returned 404 or truncated content, so no obstacle
       avoidance is recorded and the review says why. */
    primary: { term: "dreame x40 ultra", volume: 4400, difficulty: 0, mustAppear: true },
    secondary: [
      { term: "liftable mop", volume: 0, difficulty: 0, mustAppear: true },
      { term: "auto-empty", volume: 0, difficulty: 0, mustAppear: true },
      { term: "dreame x40 ultra review", volume: 0, difficulty: 0, mustAppear: false },
      { term: "dreame x40 vs x50", volume: 0, difficulty: 0, mustAppear: false },
    ],
    cededTo: [
      { term: "robot vacuum", path: "/robots/robot-vacuums/", why: "The category head term belongs to the hub, as on every review in this category." },
      { term: "dreame x50 ultra", path: "/robots/robot-vacuums/dreame-x50-ultra/", why: "The dearer dreame. Naming a sibling is not targeting its term." },
    ],
    researchedOn: RUN_VACUUM,
  },
  {
    path: "/robots/robot-vacuums/ecovacs-deebot-t90-pro-omni/",
    /* 3,600/mo on a family name covering four current machines from $349
       to $1,499.99. Pinned to the T90 PRO Omni, which is what Amazon
       returns first for the family term. */
    primary: { term: "ecovacs deebot", volume: 3600, difficulty: 0, mustAppear: true },
    secondary: [
      { term: "t90 pro omni", volume: 0, difficulty: 0, mustAppear: true },
      { term: "mop roller", volume: 0, difficulty: 0, mustAppear: true },
      { term: "pet hair", volume: 0, difficulty: 0, mustAppear: true },
      { term: "deebot t90 pro omni review", volume: 0, difficulty: 0, mustAppear: false },
    ],
    cededTo: [
      { term: "robot vacuum", path: "/robots/robot-vacuums/", why: "The category head term belongs to the hub, as on every review in this category." },
      { term: "window cleaning robot", path: "/robots/window-cleaning-robots/", why: "ECOVACS is also the WINBOT brand and that category is eleven reviews deep. A floor robot must not draw glass traffic." },
    ],
    researchedOn: RUN_VACUUM,
  },
  {
    path: "/robots/robot-vacuums/roborock-saros-10/",
    /* 2,900/mo, and the only machine in the whole catalogue whose maker
       makes a high-pile carpet claim. That single fact is what the page is
       for and it is the one recommendation here nothing else can serve. */
    primary: { term: "roborock saros 10", volume: 2900, difficulty: 0, mustAppear: true },
    secondary: [
      { term: "high-pile carpet", volume: 0, difficulty: 0, mustAppear: true },
      { term: "obstacle avoidance", volume: 0, difficulty: 0, mustAppear: true },
      { term: "roborock saros 10 review", volume: 0, difficulty: 0, mustAppear: false },
      { term: "robot vacuum for shag carpet", volume: 0, difficulty: 0, mustAppear: false },
    ],
    cededTo: [
      { term: "robot vacuum", path: "/robots/robot-vacuums/", why: "The category head term belongs to the hub, as on every review in this category." },
      { term: "roborock s8 maxv ultra", path: "/robots/robot-vacuums/roborock-s8-max-ultra/", why: "That term's traffic is answered by the page built on the machine roborock sells in its place. Naming a sibling is not targeting its term." },
    ],
    researchedOn: RUN_VACUUM,
  },
  {
    path: "/robots/robot-vacuums/roomba-max-705/",
    /* 2,900/mo on a name TWO machines share — the $499 vacuum and the $799
       Combo, one word and three hundred dollars apart, with the cheaper one
       rated seven tenths of a star higher. The page exists to separate
       them before somebody buys the wrong one. */
    primary: { term: "roomba max 705", volume: 2900, difficulty: 0, mustAppear: true },
    secondary: [
      { term: "roomba max 705 combo", volume: 0, difficulty: 0, mustAppear: true },
      { term: "anti-tangle", volume: 0, difficulty: 0, mustAppear: true },
      { term: "pet hair", volume: 0, difficulty: 0, mustAppear: true },
      { term: "roomba max 705 review", volume: 0, difficulty: 0, mustAppear: false },
    ],
    cededTo: [
      { term: "robot vacuum", path: "/robots/robot-vacuums/", why: "The category head term belongs to the hub, as on every review in this category." },
    ],
    /* "irobot roomba" (27,100/mo) IS REFUSED SITE-WIDE and that refusal is
       recorded on the hub row, not here. It cannot be recorded here: the
       machine's name is the iRobot Roomba Max 705, so the brand is in the H1
       of any honest review of it, and a cession this page structurally cannot
       honour is a rule that only ever produces a false alarm. The refusal that
       matters — not building a page aimed at the bare brand query — holds
       either way. */
    researchedOn: RUN_VACUUM,
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
