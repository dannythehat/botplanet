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

/* @extension-point per-category | required | Also per-page and per-product —
   every published URL needs a row. Without one, keywords.test.ts cannot assert
   the page still contains the term it was built to rank for, so the page can
   silently drift off its keyword. This register is also what the Notion
   Content & SEO Control Register mirrors. */
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
       result set. */
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
      { term: "robotic pet for elderly", volume: 390, difficulty: 0, mustAppear: true },
      { term: "robot friend", volume: 1000, difficulty: 0, mustAppear: true },
      { term: "robot pets for adults", volume: 480, difficulty: 10, mustAppear: false },
    ],
    cededTo: [
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
    path: "/robots/window-cleaning-robots/ecovacs-winbot-w3-omni/",
    primary: { term: "winbot w3 omni", volume: 150, difficulty: 0, mustAppear: true },
    secondary: [
      { term: "ecovacs winbot w3 omni", volume: 150, difficulty: 0, mustAppear: true },
      { term: "10,000 pa", volume: 0, difficulty: 0, mustAppear: true },
      { term: "win-slam 5.0", volume: 0, difficulty: 0, mustAppear: true },
    ],
    cededTo: [
      {
        term: "window cleaning robot",
        path: "/robots/window-cleaning-robots/",
        why: "Category head term, owned by the hub. One review is not a category page and should not try to be.",
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
  {
    path: "/robots/robotic-pool-cleaners/dolphin-proteus-dx4-plus/",
    primary: { term: "dolphin proteus dx4 plus review", volume: 0, difficulty: 0, mustAppear: true },
    secondary: [
      { term: "dolphin proteus dx4 plus", volume: 0, difficulty: 0, mustAppear: true },
      { term: "proteus dx4 plus", volume: 0, difficulty: 0, mustAppear: true },
      // The two questions the page is built to answer, and the two that decide
      // whether someone buys the right machine.
      { term: "dolphin proteus dx4 plus max pool size", volume: 0, difficulty: 0, mustAppear: true },
      { term: "does the dolphin proteus dx4 plus clean the waterline", volume: 0, difficulty: 0, mustAppear: true },
      { term: "dolphin proteus dx4 plus filter", volume: 0, difficulty: 0, mustAppear: true },
      { term: "dolphin proteus dx4 plus weight", volume: 0, difficulty: 0, mustAppear: true },
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
      { term: "aiper scuba v3 camera", volume: 0, difficulty: 0, mustAppear: true },
      { term: "aiper scuba v3 runtime", volume: 0, difficulty: 0, mustAppear: true },
      { term: "ai navium mode", volume: 0, difficulty: 0, mustAppear: true },
      { term: "aiper scuba v3 filter", volume: 0, difficulty: 0, mustAppear: true },
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
      { term: "above-ground pool robot", volume: 0, difficulty: 0, mustAppear: true },
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
];

export const keywordsFor = (path: string): PageKeywords | undefined =>
  KEYWORD_REGISTER.find((k) => k.path === path);

/** Every term that must literally appear on a given page. */
export const requiredTerms = (path: string): string[] => {
  const k = keywordsFor(path);
  if (!k) return [];
  return [k.primary, ...k.secondary].filter((t) => t.mustAppear).map((t) => t.term);
};
