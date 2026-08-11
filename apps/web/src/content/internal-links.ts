/* ============================================================
   Natural internal-link anchors.

   WHAT THIS IS FOR. An internal link is only worth anything if the
   anchor text is the phrase a reader would have searched for, sitting
   in a sentence where following it is the obvious next move. Bolting
   "click here" or a keyword-stuffed exact-match phrase onto the end
   of a paragraph does the opposite: it tells Google the page is
   optimised and tells the reader nothing.

   So anchors are declared as PHRASES THAT ALREADY EXIST IN THE PROSE.
   Nothing is inserted into the writing to create a link. If the phrase
   is not there, no link appears — and that is the signal that either
   the writing or the link plan is wrong, not something to paper over.

   THE RULES, AND WHY.

   One link per anchor per page. The first mention is where a reader
   is most likely to want the detour; the fourth is where a link
   becomes wallpaper.

   Never inside a heading. A heading is a signpost for this page, not
   a route off it.

   Never inside an existing link. Nested anchors are invalid HTML and
   the browser's recovery is unpredictable.

   Live targets only. `status: "planned"` records the anchor and its
   intended destination without rendering a link, so the plan is
   written down before the page exists and turns into a real link the
   day it does. A link to a 404 is worse than no link.
   ============================================================ */

export interface InternalAnchor {
  /** The phrase as it appears in the prose. Matched case-insensitively. */
  anchor: string;
  /** Canonical destination path. */
  href: string;
  /** Why this phrase belongs to this page. Kept for review, not rendered. */
  why: string;
  /**
   * "live" renders a link. "planned" records the intent and renders nothing,
   * because a link to a page that does not exist is worse than no link.
   */
  status: "live" | "planned";
  /** How many times this anchor may link on one page. Defaults to 1. */
  max?: number;
}

/**
 * Anchors available to every page in a category, in priority order.
 *
 * Order matters: the linker takes the first match it finds for each anchor,
 * and an earlier entry wins a phrase that two entries could both claim.
 */
/* @extension-point per-category | optional | The category's pages stop
   cross-linking to each other, which costs internal PageRank and leaves a
   reader at the bottom of a review with nowhere to go. internal-links.test.ts
   checks the anchors that DO exist resolve; it cannot check for absence. */
export const CATEGORY_ANCHORS: Record<string, InternalAnchor[]> = {
  "educational-coding-robots": [
    /* Product anchors \u2014 see the note on companion-robots above. */
    {
      anchor: "Sphero BOLT",
      href: "/robots/educational-coding-robots/sphero-bolt/",
      why: "The machine every other coding review points at for text programming. Also catches 'Sphero BOLT+', which this review is the one that covers.",
      status: "live",
    },
    {
      anchor: "Sphero Mini",
      href: "/robots/educational-coding-robots/sphero-mini/",
      why: "The cheap-way-to-find-out argument, which the BOLT review makes and could not link.",
      status: "live",
    },
    {
      anchor: "Sphero indi",
      href: "/robots/educational-coding-robots/sphero-indi/",
      why: "The screen-free answer, named by every review that rules itself out for under-eights.",
      status: "live",
    },
    {
      anchor: "Ozobot Evo",
      href: "/robots/educational-coding-robots/ozobot-evo/",
      why: "The lesson-library machine, and the comparison the mBot review draws on price.",
      status: "live",
    },
    {
      anchor: "Makeblock mBot",
      href: "/robots/educational-coding-robots/makeblock-mbot/",
      why: "Anchored on the full name rather than bare 'mBot' so it cannot be confused with the mBot2 in a reader's mind, though both land here.",
      status: "live",
    },
    {
      anchor: "Cozmo",
      href: "/robots/educational-coding-robots/cozmo/",
      why: "The rule-out. Every coding review that reaches for a famous example reaches for this one, and the page it lands on is the one explaining why you cannot buy it. Bare 'Cozmo' rather than 'Cozmo 2.0' because both the Anki original and the relaunch are the same question for a reader.",
      status: "live",
    },

    {
      anchor: "screen-free",
      href: "/robots/educational-coding-robots/#screen-or-app",
      why: "The category's first real fork and a parenting decision as much as a technical one. The phrase recurs across the prose and the reasoning belongs in one place.",
      status: "live",
    },
    {
      anchor: "block coding",
      href: "/robots/educational-coding-robots/#age",
      why: "The middle step between buttons and real code, and the thing that decides which age band a machine actually serves.",
      status: "live",
    },
    {
      anchor: "month six",
      href: "/robots/educational-coding-robots/#does-it-teach",
      why: "The single most useful question to ask about any robot in this category, and the section that answers it. Worth reaching from any product page.",
      status: "live",
    },
    {
      anchor: "compare",
      href: "/compare/educational-coding-robots/",
      why: "The comparison table is the next step once the age band has narrowed the field.",
      status: "live",
    },
    {
      anchor: "review methodology",
      href: "/review-methodology/",
      why: "Any claim about how we check things should be one click from the page that says how we check things.",
      status: "live",
    },
    {
      anchor: "BotMatch",
      href: "/botmatch/educational-coding-robots/",
      why: "Planned until the catalogue has products. The funnel's first question is the age exclusion, and it is willing to answer 'buy the cheap one first'.",
      status: "planned",
    },
  ],

  "robot-vacuums": [
    {
      anchor: "mop lifting",
      href: "/robots/robot-vacuums/#floors",
      why: "The specification that decides whether a vacuum-mop works in a house with any carpet at all, and the one buried deepest in the spec sheets. Every product page will mention it; the reasoning belongs in one place.",
      status: "live",
    },
    {
      anchor: "pet hair",
      href: "/robots/robot-vacuums/#pet-hair",
      why: "The biggest single reason people buy one, and the section explaining why brush design matters more than suction.",
      status: "live",
    },
    {
      anchor: "self emptying",
      href: "/robots/robot-vacuums/#pet-hair",
      why: "Explained where it matters most rather than in the price ladder — in a pet household it is the clearest quality-of-life upgrade in the category.",
      status: "live",
    },
    {
      anchor: "obstacle avoidance",
      href: "/robots/robot-vacuums/#before-you-buy",
      why: "Most of the price gap between a cheap machine and an expensive one, and the checklist is where the honest question about your own floor sits.",
      status: "live",
    },
    {
      anchor: "compare",
      href: "/compare/robot-vacuums/",
      why: "The comparison table is the honest next step once floor type has narrowed the field.",
      status: "live",
    },
    {
      anchor: "review methodology",
      href: "/review-methodology/",
      why: "Any claim about how we check things should be one click from the page that says how we check things.",
      status: "live",
    },
    {
      anchor: "BotMatch",
      href: "/botmatch/robot-vacuums/",
      why: "Live from 10 August 2026, when the catalogue's first eleven products landed and the funnel stopped being a questionnaire with nothing behind it. Its first question is the floor-type exclusion, which is the most useful thing it does.",
      status: "live",
    },
  ],

  "grill-cleaning-robots": [
    {
      anchor: "porcelain",
      href: "/robots/grill-cleaning-robots/#grate-type",
      why: "The only hard exclusion in the category and the one mistake that is not recoverable. Any page mentioning porcelain grates should reach the section explaining why brass strips them.",
      status: "live",
    },
    {
      anchor: "wire bristles",
      href: "/robots/grill-cleaning-robots/#bristles",
      why: "The honest commercial argument for the whole category, and the one a reader is most likely to have arrived worried about.",
      status: "live",
    },
    {
      anchor: "brush",
      href: "/robots/grill-cleaning-robots/#robot-or-brush",
      why: "The comparison every buyer here is actually making. The word recurs throughout the prose and the reasoning belongs in one place.",
      status: "live",
    },
    {
      anchor: "compare",
      href: "/compare/grill-cleaning-robots/",
      why: "The comparison table is the next step once grate type has been settled.",
      status: "live",
    },
    {
      anchor: "review methodology",
      href: "/review-methodology/",
      why: "Any claim about how we check things should be one click from the page that says how we check things.",
      status: "live",
    },
    {
      anchor: "BotMatch",
      href: "/botmatch/grill-cleaning-robots/",
      why: "Planned until the catalogue has products. The funnel's first question is the grate-material exclusion, and it is willing to answer 'buy a brush'.",
      status: "planned",
    },
  ],

  "self-cleaning-litter-boxes": [
    {
      anchor: "safety",
      href: "/robots/self-cleaning-litter-boxes/#safety",
      why: "The most important section on the page and the only one readers arrive already worried about. Google surfaced the vet question on six of the twenty-three SERPs bought for this category, so any page mentioning safety should reach the explanation in one click.",
      status: "live",
    },
    {
      anchor: "clumping litter",
      href: "/robots/self-cleaning-litter-boxes/#litter-type",
      why: "The fork that decides three-year running cost, and the phrase recurs across the prose. A reader meeting it on a product page should be able to reach the reasoning.",
      status: "live",
    },
    {
      anchor: "large cat",
      href: "/robots/self-cleaning-litter-boxes/#cat-size",
      why: "Chamber size is a hard rule-out and the cat-size section is where the three groups are separated. First mention should reach it.",
      status: "live",
    },
    {
      anchor: "multiple cats",
      href: "/robots/self-cleaning-litter-boxes/#what-it-fixes",
      why: "The strongest commercial case in the category, and the section that also states the one-box-per-cat-plus-one rule the machine does not repeal.",
      status: "live",
    },
    {
      anchor: "compare",
      href: "/compare/self-cleaning-litter-boxes/",
      why: "The comparison table is the honest next step once cat size and litter type have narrowed the field.",
      status: "live",
    },
    {
      anchor: "review methodology",
      href: "/review-methodology/",
      why: "Any claim about how we check things should be one click from the page that says how we check things.",
      status: "live",
    },
    {
      anchor: "BotMatch",
      href: "/botmatch/self-cleaning-litter-boxes/",
      why: "Planned until the catalogue has products. The funnel's first question is the cat-size exclusion, which is the most useful thing it does.",
      status: "planned",
    },
  ],

  /* ------------------------------------------------------------------
     LAWN. Added 6 August 2026 with the three lawn guides — the category
     had a live hub and no anchor set at all, so nothing written for it
     could link anywhere.

     ORDERING IS LOAD-BEARING HERE and this is the list where it bites.
     The linker takes the FIRST anchor that matches a phrase, so "robot
     lawn mower" sitting above "cheap robot lawn mower" would swallow
     every one of the guide anchors and send the whole category to the
     hub. The three guide phrases are listed first, longest first, and
     the head term last. internal-links.test.ts checks this, but it is
     worth understanding rather than obeying.
     ------------------------------------------------------------------ */
  "robotic-lawn-mowers": [
    {
      /* ADDED 11 August 2026 with the lawn best-of. The three lawn guides all
         ended on a promise — "when mowers enter the catalogue, this page gets a
         shortlist" — written when the catalogue was empty. Seven mowers went in
         on 10 August and the promise went stale rather than being kept, so the
         guides now name the shortlist and this anchor is what carries them to
         it. Ahead of the hills guide deliberately: "shortlist" cannot collide
         with any of the phrases below, and the commercial page in this category
         should not be the last thing a reader can reach. */
      anchor: "shortlist",
      href: "/best-robots/robotic-lawn-mowers/",
      why: "The best-of is where a reader who has decided to buy becomes a reader choosing which one. Every lawn guide reaches that moment and none of them could reach the page.",
      status: "live",
    },
    {
      anchor: "best robot lawn mower for hills",
      href: "/guides/robot-lawn-mower-for-hills/",
      why: "Slope is the category's one hard exclusion and every lawn page mentions it. A reader meeting the phrase should reach the page that measures it rather than a paragraph that names it.",
      status: "live",
    },
    {
      anchor: "wire free robot lawn mower",
      href: "/guides/wire-free-robot-lawn-mower/",
      why: "≈1,670/mo across the wire-free family and the biggest single objection buyers raise. The guide is the page that owns the term, so the phrase belongs to it wherever it appears.",
      status: "live",
    },
    {
      anchor: "cheap robot lawn mower",
      href: "/guides/cheap-robot-lawn-mower/",
      why: "The budget question comes up on every page in this category, usually as an aside. The guide is where it is answered, including the point below which a low price stops being a bargain.",
      status: "live",
    },
    {
      anchor: "robot lawn mower",
      href: "/robots/robotic-lawn-mowers/",
      why: "The 74,000/mo head term and the hub that owns it. Listed after the guide phrases deliberately, so it cannot swallow them — it is the fallback, not the first choice.",
      status: "live",
    },
    {
      anchor: "boundary wire",
      href: "/robots/robotic-lawn-mowers/#navigation",
      why: "The fork that decides both price and installation, explained in one place on the hub. Every lawn page mentions the wire; only one of them should have to explain it.",
      status: "live",
    },
    {
      anchor: "acre",
      href: "/robots/robotic-lawn-mowers/#yard-size",
      why: "Area is the first hard constraint and the acreage cluster is worth ~2,060/mo. The yard-size section is where the stated maximum is explained against a real lawn.",
      status: "live",
    },
    {
      anchor: "slope",
      href: "/robots/robotic-lawn-mowers/#terrain",
      why: "The terrain section separates gradient, tree cover and split gardens. A page mentioning a slope in passing should be able to reach the reasoning without repeating it.",
      status: "live",
    },
    {
      anchor: "mulch",
      href: "/robots/robotic-lawn-mowers/#cutting",
      why: "Mulching rather than collecting is the single biggest surprise for a first-time buyer, and the cutting section is the only place it is explained properly.",
      status: "live",
    },
    {
      anchor: "compare",
      href: "/compare/robotic-lawn-mowers/",
      why: "The comparison table is the honest next step once area, terrain and navigation have narrowed the field to two or three machines.",
      status: "live",
    },
    {
      anchor: "review methodology",
      href: "/review-methodology/",
      why: "Every guide in this category says what it cannot yet tell the reader. The page explaining how we check things has to be one click from that sentence.",
      status: "live",
    },
    {
      /* Planned, not live: /botmatch/robotic-lawn-mowers/ is coming_soon until
         the catalogue has mowers. The question set and scoring config already
         exist; it would just recommend nothing. */
      anchor: "BotMatch",
      href: "/botmatch/robotic-lawn-mowers/",
      why: "The lawn question set asks about area, tree cover, slopes and zones — the exact axes these guides argue over. Planned until there are mowers behind it.",
      status: "planned",
    },
  ],

  /* The cross-link between these two categories matters more than most,
     because they were one category until 6 August 2026 and to a reader they
     still look like one shelf. Somebody who lands on companion robots wanting
     to watch their dog has arrived in the wrong place, and the fastest honest
     fix is a link rather than a paragraph explaining the SERP evidence. */
  "companion-robots": [
    /* PRODUCT ANCHORS, added 8 August 2026 after a crawl of all 81 live pages built the real inbound-link graph. Pool declares 14 product anchors and its flagship review has FIFTEEN inbound links; window declares 11 and its flagship has nine. Every category without product anchors had exactly TWO inbound links per review \u2014 its hub and its comparison table \u2014 and no review linked to a sibling. The prose already names siblings constantly; nothing here required a word of it to be rewritten. One anchor per product, shortest unambiguous form: where a longer variant exists (BOLT+, Air 2 Plus, mBot Ranger) the review being linked is the one that covers it, so a match inside the longer name lands on the right page rather than the wrong one. */
    {
      anchor: "Moflin",
      href: "/robots/companion-robots/moflin/",
      why: "The only robot here that develops over weeks, and the comparison every other companion review reaches for. Sixteen mentions across seven pages linked nowhere before this.",
      status: "live",
    },
    {
      anchor: "Miko 3",
      href: "/robots/companion-robots/miko-3/",
      why: "The child-facing machine in the category, and the one a reader comparing on age needs to reach.",
      status: "live",
    },
    {
      anchor: "Vector 2.0",
      href: "/robots/companion-robots/vector-2/",
      why: "Named rather than bare 'Vector', which is an ordinary English word and would link things that are not this robot.",
      status: "live",
    },
    {
      anchor: "Eilik",
      href: "/robots/companion-robots/eilik/",
      why: "The desk robot the EMO review cedes its term to, so the phrase should carry the reader there.",
      status: "live",
    },
    {
      anchor: "Loona",
      href: "/robots/companion-robots/loona/",
      why: "The most expensive machine in the category and the one the price argument on every other page is measured against.",
      status: "live",
    },
    {
      anchor: "Ropet",
      href: "/robots/companion-robots/ropet/",
      why: "The washable-fur machine, which is the answer whenever another review raises allergies.",
      status: "live",
    },

    {
      anchor: "Cozmo",
      href: "/robots/educational-coding-robots/cozmo/",
      why: "Cross-category on purpose. Cozmo is filed under coding robots and the Vector review is where a reader actually asks about it — the two machines came from the same company and share the same fate. The anchor has to live in this list to fire on that page.",
      status: "live",
    },
    {
      anchor: "Moxie",
      href: "/robots/companion-robots/moxie/",
      why: "The cautionary tale this category needs a link to. Any review that raises what happens when the servers go off should be able to point at the machine it actually happened to.",
      status: "live",
    },    {
      anchor: "Joy For All",
      href: "/robots/companion-robots/joy-for-all-companion-pets/",
      why: "The eldercare pick. Its guide names it repeatedly and, until this, none of those mentions was a link.",
      status: "live",
    },
    {
      /* PLANNED, not live, and the anchor test is what caught it. EMO has no
         offer, so living-ai-emo is deliberately absent from PRODUCT_ID and the
         registry refuses to send a live anchor at a page with nothing to sell.
         The page itself is live and targets 18,100/mo as the segment's
         comparison anchor; the moment EMO has a buy button this becomes one
         line. */
      anchor: "EMO",
      href: "/robots/companion-robots/living-ai-emo/",
      why: "Google's comparison anchor for the whole desktop segment. Live since 8 August 2026: it was held back on the reasoning that an anchor must not point at a page that cannot sell, and that reasoning was wrong. A rule-out page is a destination — EMO's explains that Amazon returns imitations, which is the single most useful thing a reader searching the name can be told.",
      status: "live",
    },

    {
      anchor: "pet camera robot",
      href: "/robots/pet-camera-robots/",
      why: "The phrase appears in the hub's own prose where the two categories are distinguished. A reader who used that phrase to get here wants the other page, and this is the shortest route to it.",
      status: "live",
    },
    {
      anchor: "robotic pets for elderly",
      href: "/guides/robotic-pets-for-elderly/",
      why: "The plural is the form the prose uses \u2014 the Joy For All review says 'our robotic pets for elderly guide' and the singular anchor below could not match it. The guide had one inbound link.",
      status: "live",
    },
    {
      anchor: "robotic pet for elderly",
      /* REPOINTED 6 August 2026, from /robots/companion-robots/#who-for to the
         guide. The hub section separates three audiences in a paragraph each;
         the guide answers this one properly, and it is now the page targeting
         the term. An anchor that sends the phrase somewhere weaker than the
         page built for it is a wasted signal. */
      href: "/guides/robotic-pets-for-elderly/",
      why: "Eldercare is the audience with genuinely different products behind it, and the guide is the page that owns the term. Any companion review or article using the phrase should reach the page built for it rather than a paragraph on the hub.",
      status: "live",
    },
    {
      anchor: "subscription",
      href: "/robots/companion-robots/#support-risk",
      why: "The support-risk section is the only place on the site that explains what a companion-robot subscription actually gates. Every product page will mention the word; the reasoning belongs in one place.",
      status: "live",
    },
    {
      anchor: "desktop companion robot",
      href: "/robots/companion-robots/#desk-or-floor",
      why: "The desk-or-floor fork is the category's real split and this is the phrase a reader searching for the desk half would use.",
      status: "live",
    },
    {
      /* Added 6 August 2026 with the eldercare guide, which needed a route
         back to the hub in its own words. Safe below the longer anchors: the
         literal string "robot pet" appears in none of them — "robotic pet for
         elderly" is "robotic", not "robot ". */
      anchor: "robot pet",
      href: "/robots/companion-robots/",
      why: "The category's own head term at 8,100/mo. Any page in this family that uses the phrase in passing should reach the hub that owns it, and the guides use it constantly.",
      status: "live",
    },
    {
      anchor: "compare",
      href: "/compare/companion-robots/",
      why: "The comparison table is the honest next step for a reader who has narrowed it to two machines.",
      status: "live",
    },
    {
      anchor: "review methodology",
      href: "/review-methodology/",
      why: "Any claim about how we check things should be one click from the page that says how we check things.",
      status: "live",
    },
    {
      /* Planned rather than live: /botmatch/companion-robots/ is coming_soon
         until the catalogue has products to recommend. The anchor is recorded
         now so it becomes a real link the day the funnel is worth using. */
      anchor: "BotMatch",
      href: "/botmatch/companion-robots/",
      why: "Named in the prose where the reader is told who it is for decides the answer, which is exactly when the tool helps. Planned until there are products behind it.",
      status: "planned",
    },
  ],

  "pet-camera-robots": [
    {
      anchor: "self-cleaning litter box",
      href: "/robots/self-cleaning-litter-boxes/",
      why: "The ROLA PetPal review rules itself out for cat owners, and this is the machine that serves the reader it just turned away. Same household, different chore.",
      status: "live",
    },
    /* Product anchors \u2014 see the note on companion-robots above. */
    {
      anchor: "EBO Air 2",
      href: "/robots/pet-camera-robots/enabot-ebo-air-2/",
      why: "Twenty mentions across three pages linked nowhere. Also catches 'EBO Air 2 Plus' and the discontinued 'EBO Air', both of which this review carries.",
      status: "live",
    },
    {
      /* Below "EBO Air 2" on purpose. That anchor consumes the first full
         mention; this one catches the bare "the Air 2" the reviews use
         thereafter. It also matches inside "Air 2 Plus", which is correct —
         the Air 2 review is the page that covers the Plus. "Air 2S" is
         blocked by the word boundary, since S is a word character. */
      anchor: "Air 2",
      href: "/robots/pet-camera-robots/enabot-ebo-air-2/",
      why: "The form the prose actually uses after the first mention. Twenty mentions of this machine across three pages linked nowhere before the crawl found it.",
      status: "live",
    },
    {
      anchor: "EBO SE",
      href: "/robots/pet-camera-robots/enabot-ebo-se/",
      why: "The under-furniture machine, which is the size comparison the other two reviews keep making.",
      status: "live",
    },
    {
      anchor: "ROLA PetPal",
      href: "/robots/pet-camera-robots/enabot-rola-petpal/",
      why: "The treat-dispenser machine. 'ROLA Mini' is deliberately NOT anchored: it is a different model we do not hold.",
      status: "live",
    },
    {
      anchor: "Enabot range",
      href: "/robots/pet-camera-robots/enabot/",
      why: "THE PAGE HAD ZERO INBOUND LINKS. 9,900/mo, the largest single term in the category, and nothing on the site pointed at it. Each single-model review now routes to it in its own words.",
      status: "live",
    },

    {
      anchor: "robot pet",
      href: "/robots/companion-robots/",
      why: "The mirror of the companion hub's link to this page. A reader here for company rather than monitoring is one click from the right category instead of reading about wheel diameter.",
      status: "live",
    },
    {
      anchor: "fixed camera",
      href: "/robots/pet-camera-robots/#versus-fixed",
      why: "The comparison every buyer in this category is actually making. The phrase recurs throughout the prose and the reasoning sits in one section.",
      status: "live",
    },
    {
      anchor: "stairs",
      href: "/robots/pet-camera-robots/#your-home",
      why: "The category's one hard exclusion. Any page mentioning stairs should be able to reach the section explaining that none of these climb them.",
      status: "live",
    },
    {
      anchor: "compare",
      href: "/compare/pet-camera-robots/",
      why: "The comparison table is the honest next step once a reader has confirmed the layout works.",
      status: "live",
    },
    {
      anchor: "review methodology",
      href: "/review-methodology/",
      why: "Any claim about how we check things should be one click from the page that says how we check things.",
      status: "live",
    },
    {
      anchor: "BotMatch",
      href: "/botmatch/pet-camera-robots/",
      why: "Planned until the catalogue has products. The funnel's first question is the stairs exclusion, which is the most useful thing it does.",
      status: "planned",
    },
  ],

  /* WINDOW-CLEANING ROBOTS. Added 6 August 2026 with the review set — the
     category had eleven published products and no anchors at all, so eleven
     reviews would have shipped linking to nothing and passing no signal to
     each other or to the hub.

     The order matters here more than it does for pool. "frameless glass" must
     sit above "frameless", and both above "glass", or the shorter anchor
     swallows the longer one and sends a reader asking the category's hardest
     question to a general page. editorial.test.ts enforces longest-first. */
  "window-cleaning-robots": [
    {
      anchor: "frameless glass",
      href: "/robots/window-cleaning-robots/#glass-type",
      why: "The category's biggest exclusion and the question most likely to make a purchase wrong. A robot that cannot hold an unframed edge is not a cheaper robot, it is the wrong one, and the hub is where that is explained rather than repeated in eleven reviews.",
      status: "live",
    },
    {
      anchor: "safety rope",
      /* #power, not #safety. The window hub has no #safety section — that id
         belongs to the LITTER hub, and this link had been landing readers at
         the top of the window hub since it was written. The section that
         actually answers "what happens when the power cuts" is #power: "That
         backup is the safety system: if the power fails, the machine holds the
         glass rather than falling." */
      href: "/robots/window-cleaning-robots/#power",
      why: "Every reader above the ground floor asks the same question — what happens when the power cuts — and the answer belongs in one place the reviews can point at.",
      status: "live",
    },
    {
      anchor: "power-off protection",
      href: "/robots/window-cleaning-robots/#power",
      why: "The mechanism behind the rope answer: how long the machine holds the glass with no mains. Named wherever a review quotes a hold time.",
      status: "live",
    },
    {
      anchor: "streaking",
      /* #dirt, not #results — same fault as the two above. There is no
         #results section on this hub. #dirt is where smearing is explained:
         "a machine that sprays water alone will smear it". */
      href: "/robots/window-cleaning-robots/#dirt",
      why: "The most common complaint about this whole category, and the one thing a spec sheet cannot predict. Reviews reach it constantly; the explanation lives on the hub.",
      status: "live",
    },
    {
      anchor: "does the window open",
      href: "/botmatch/window-cleaning-robots/",
      why: "The first question BotMatch asks and the one that eliminates half the catalogue for some readers. Named in prose exactly where a reader realises it applies to them.",
      status: "live",
    },
    {
      /* ADDED 7 August 2026 by the same inbound-link audit that found the pool
         orphan. The guide had exactly one internal link — the guides index —
         because nothing in the category used a phrase that pointed at it. The
         best-of now says the sentence, and the sentence is the link. */
      anchor: "whether window cleaning robots work",
      href: "/guides/do-window-cleaning-robots-work/",
      why: "The scepticism question, and the page that answers it with a real no. A reader still deciding whether to buy at all is on the wrong page when they are reading a ranking, and this is the shortest route to the right one.",
      status: "live",
    },
    {
      /* ADDED 7 August 2026 with the "do they work" guide, which named the
         shortlist in its own words and had nowhere to send the reader — the
         window anchor set predates the best-of page by two days. This is the
         commercial destination in a category whose reviews now earn, so it is
         the most valuable link in the list. */
      anchor: "ranked shortlist",
      href: "/best-robots/window-cleaning-robots/",
      why: "The best-of is the page that turns a reader who has decided to buy into a reader choosing which one. Any window page reaching that moment should be one click from it.",
      status: "live",
    },
    {
      anchor: "compare",
      href: "/compare/window-cleaning-robots/",
      why: "The comparison table is the honest next step for a reader who has decided one model is close but wants it beside the others.",
      status: "live",
    },
    {
      anchor: "BotMatch",
      href: "/botmatch/window-cleaning-robots/",
      why: "Named where the reader is being told their glass decides the answer, which is exactly the moment the tool is useful.",
      status: "live",
    },
    {
      anchor: "review methodology",
      href: "/review-methodology/",
      why: "Any claim about how we check things should be one click from the page that says how we check things.",
      status: "live",
    },
    {
      anchor: "editorial policy",
      href: "/editorial-policy/",
      why: "Wherever a page says commission did not pick the winner, the reader should be able to check that claim in one click.",
      status: "live",
    },

    /* ---- The eleven machines. ---- */
    {
      anchor: "WINBOT W2 PRO Omni",
      href: "/robots/window-cleaning-robots/ecovacs-winbot-w2-pro-omni/",
      why: "The flagship and the only one with a portable battery station. Named wherever a review reaches the point that there is no socket by the window.",
      status: "live",
    },
    {
      /* REPOINTED 8 August 2026. This sent the W3 Omni's own name to the
         W2 PRO Omni's page — correct while the two were merged, and a link to
         the wrong machine from the moment the W3 got its page back. The
         unmerge did not touch this file and the crawl is what caught it. */
      anchor: "WINBOT W3 Omni",
      href: "/robots/window-cleaning-robots/ecovacs-winbot-w3-omni/",
      why: "The top of the range and the highest stated suction in the catalogue. Named wherever a review says a bigger pane needs a stronger machine.",
      status: "live",
    },
    {
      anchor: "WINBOT W2 PRO",
      href: "/robots/window-cleaning-robots/ecovacs-winbot-w2-pro/",
      why: "The mid flagship without the station. The machine most readers should compare the Omni against before paying for the battery.",
      status: "live",
    },
    {
      /* REPOINTED 8 August 2026, with the W3 Omni above. */
      anchor: "WINBOT W2S",
      href: "/robots/window-cleaning-robots/ecovacs-winbot-w2s/",
      why: "The slimmer W2 variant with TruEdge scrubbers. Named wherever edge coverage is the point at issue.",
      status: "live",
    },
    {
      anchor: "WINBOT W1 PRO",
      href: "/robots/window-cleaning-robots/ecovacs-winbot-w1-pro/",
      why: "The cheap way into ECOVACS. Named wherever a review tells a reader they are being sold more machine than their windows need.",
      status: "live",
    },
    {
      /* REPOINTED 8 August 2026, with the W3 Omni above. */
      anchor: "WINBOT Mini",
      href: "/robots/window-cleaning-robots/ecovacs-winbot-mini/",
      why: "The smallest and cheapest, and the only one a renter would sensibly buy. The answer to small panes and to storage.",
      status: "live",
    },
    {
      anchor: "HUTT S55 Pro",
      href: "/robots/window-cleaning-robots/hutt-s55-pro/",
      why: "The only machine in the catalogue claiming sloped glass, which is the category's hardest exclusion. Named wherever a review rules a reader out on glass angle.",
      status: "live",
    },
    {
      anchor: "Mamibot W120-DP",
      href: "/robots/window-cleaning-robots/mamibot-w120-dp/",
      why: "The third brand and the high-rise rating. Named wherever a review discusses working above the ground floor.",
      status: "live",
    },
    {
      anchor: "HOBOT 2S",
      href: "/robots/window-cleaning-robots/hobot-2s/",
      why: "Dual replaceable tanks and ultrasonic spray. Named wherever refilling mid-clean is the complaint.",
      status: "live",
    },
    {
      anchor: "HOBOT 298",
      href: "/robots/window-cleaning-robots/hobot-298/",
      why: "The budget HOBOT. Named wherever ultrasonic spray is being weighed against a pump.",
      status: "live",
    },
    {
      anchor: "Cop Rose X5S",
      href: "/robots/window-cleaning-robots/cop-rose-x5s/",
      why: "Remote control and no app at all, which for some readers is the feature rather than the compromise. The cheapest machine in the catalogue.",
      status: "live",
    },
    /* SHORT FORMS, added 8 August 2026 from a count of how the prose actually
       reads rather than how the model is named on the box. "W3 Omni" appears
       fifteen times against one "WINBOT W3 Omni"; "the Mini" thirteen times
       against six. The long forms above take the first mention on a page and
       these take the next, and every one lands on the same review.

       Safe within this category and nowhere else: every "Mini" in window prose
       is the WINBOT Mini, and the anchor list is per-category so it cannot
       reach the Sphero Mini. */
    {
      anchor: "W3 Omni",
      href: "/robots/window-cleaning-robots/ecovacs-winbot-w3-omni/",
      why: "The form every review uses after the first mention, fifteen times across the category and linking nowhere until now.",
      status: "live",
    },
    {
      anchor: "W2S",
      href: "/robots/window-cleaning-robots/ecovacs-winbot-w2s/",
      why: "The W2 PRO review compares itself to the W2S by this name and could not reach it.",
      status: "live",
    },
    {
      anchor: "Mini",
      href: "/robots/window-cleaning-robots/ecovacs-winbot-mini/",
      why: "Four reviews rule themselves out for small panes and name the Mini as the answer. Unambiguous inside this category, where every Mini is this machine.",
      status: "live",
    },
    {
      /* Below "ranked shortlist" on purpose, so the fuller phrase takes a
         mention before the bare one does. */
      anchor: "shortlist",
      href: "/best-robots/window-cleaning-robots/",
      why: "The commercial page for the category had two inbound links and none from a review. A reader at the end of one machine's page wanting the ranked list is the most obvious journey on the site and it was not linked.",
      status: "live",
    },
  ],

  "robotic-pool-cleaners": [
    /* CROSS-CATEGORY, ADDED 8 AUGUST 2026 in the internal-link pass. Three
       hubs were sitting on two contextual inbound links each because nothing
       outside their own category ever mentioned them. These fire on prose that
       already existed — "robot vacuum" appears in the Scuba X1 Pro Max review
       and in the worth-it guide — rather than on sentences written to carry a
       link. */
    {
      anchor: "robot vacuum",
      href: "/robots/robot-vacuums/",
      why: "The comparison a pool buyer makes unprompted: the same question about whether a robot is worth it, asked about the floor indoors. Fires on copy that was already there.",
      status: "live",
    },
    {
      anchor: "grill-cleaning robot",
      href: "/robots/grill-cleaning-robots/",
      why: "The other outdoor chore robot, and the one with the same buying logic — how often the job comes round against how much you resent it.",
      status: "live",
    },
    {
      anchor: "waterline",
      href: "/robots/robotic-pool-cleaners/#coverage",
      why: "The hub's coverage section is where floor / wall / waterline are separated as distinct capabilities. This review's central argument depends on that distinction, so the first mention should be able to reach the explanation.",
      status: "live",
    },
    /* THESE TWO MUST STAY ABOVE THE BARE "cordless" ENTRY. The linker takes
       the first match it finds for a phrase, and "cordless" would otherwise
       swallow the leading word of both and send the reader to the hub. */
    {
      anchor: "cordless robotic pool cleaner",
      href: "/best-robots/robotic-pool-cleaners/cordless/",
      why: "22,200/mo at KD 0 and a page of its own on measured SERP evidence. Wherever the full phrase appears in prose, it should reach the page that ranks them.",
      status: "live",
    },
    {
      anchor: "cordless page",
      href: "/best-robots/robotic-pool-cleaners/cordless/",
      why: "How the cordless best-of gets named in running text — 'the full argument sits on the cordless page'. The natural phrase, rather than the keyword bolted on.",
      status: "live",
    },
    {
      anchor: "cordless",
      href: "/robots/robotic-pool-cleaners/",
      why: "Corded versus cordless is a hub-level decision. The review only says this machine is corded; the reasoning belongs on the hub.",
      status: "live",
    },
    {
      /* ADDED 7 August 2026 by an inbound-link audit that found
         /best-robots/robotic-pool-cleaners/above-ground-pools/ ORPHANED —
         zero internal links, on a 2,400/mo page, five days after it shipped.

         The cause is the entry directly below. Nine pool pages contain the
         phrase "above-ground pool", and the shorter "above-ground" anchor was
         matching first and sending every one of them to a section of the hub
         instead of to the page built for the term. That is precisely the
         swallowing the ordering test in internal-links.test.ts exists to
         catch — but that test only checks the order of anchors that EXIST,
         and it cannot flag the one that was never written.

         Listed above "above-ground" so the longer, more specific phrase wins,
         which is the rule for this whole file. */
      anchor: "above-ground pool",
      href: "/best-robots/robotic-pool-cleaners/above-ground-pools/",
      why: "2,400/mo at KD 0 and the second-strongest commercial term in the category. Nine pool pages use this exact phrase; each one should reach the shortlist built for it rather than a paragraph on the hub.",
      status: "live",
    },
    {
      anchor: "above-ground",
      href: "/robots/robotic-pool-cleaners/#pool-type",
      why: "The hub's pool-type section covers above-ground liners and what they need. Natural detour for a reader whose pool is not in-ground.",
      status: "live",
    },
    {
      anchor: "compare",
      href: "/compare/robotic-pool-cleaners/",
      why: "The comparison table is the honest next step for a reader who has decided this model is close but wants to see it beside the others.",
      status: "live",
    },
    {
      anchor: "BotMatch",
      href: "/botmatch/robotic-pool-cleaners/",
      why: "Named in the prose where the reader is being told their pool decides the answer. That is exactly the moment the tool is useful.",
      status: "live",
    },
    {
      anchor: "review methodology",
      href: "/review-methodology/",
      why: "Any claim about how we check things should be one click from the page that says how we check things.",
      status: "live",
    },
    /* ---- Review-to-review. Live from the second review onwards. ----
       These are the ones that earn their place: a reader being told a machine
       is wrong for them is at the exact moment a named alternative helps. The
       linker refuses to point a page at itself, so the same anchor list is
       safe on every review. */
    {
      anchor: "Dolphin Nautilus CC Plus",
      href: "/robots/robotic-pool-cleaners/dolphin-nautilus-cc-plus/",
      why: "The corded mid-range comparison. Named in the Polaris review where the cordless premium is being justified against it.",
      status: "live",
    },
    {
      anchor: "Polaris FREEDOM",
      href: "/robots/robotic-pool-cleaners/polaris-freedom/",
      why: "The cordless answer to the Nautilus's biggest rule-out. A reader told 'this one has a cord' should be one click from the one that does not.",
      status: "live",
    },
    {
      anchor: "iAquaLink",
      href: "/robots/robotic-pool-cleaners/polaris-freedom/",
      why: "The app is only discussed at length on the Freedom review, so a mention elsewhere should reach it.",
      status: "live",
    },
    {
      anchor: "Betta SE Plus",
      href: "/robots/robotic-pool-cleaners/betta-se-plus/",
      why: "The surface skimmer. Every floor-robot review reaches a point where the reader's real complaint turns out to be what is floating on top, and this is where that goes.",
      status: "live",
    },
    {
      anchor: "skimmer",
      href: "/robots/robotic-pool-cleaners/betta-se-plus/",
      why: "The word itself is the distinction most buyers get wrong — a skimmer is not a cleaner. Wherever it appears, it should be one click from the page that explains the difference.",
      status: "live",
    },
    {
      anchor: "Dolphin Proteus DX4 Plus",
      href: "/robots/robotic-pool-cleaners/dolphin-proteus-dx4-plus/",
      why: "The corded machine that does the ledges and steps. Named wherever a reader's pool shape is the deciding factor rather than its length.",
      status: "live",
    },
    {
      anchor: "sun ledge",
      href: "/robots/robotic-pool-cleaners/dolphin-proteus-dx4-plus/",
      why: "Sun ledges and steps are the shapes cheaper robots skip, and the Proteus review is where that is actually discussed.",
      status: "live",
    },
    {
      anchor: "Aiper Scuba S1",
      href: "/robots/robotic-pool-cleaners/aiper-scuba-s1/",
      why: "The mid-range all-rounder, and the page where the 12-inch shallow-ledge claim is actually discussed.",
      status: "live",
    },
    {
      anchor: "Aiper Seagull SE",
      href: "/robots/robotic-pool-cleaners/aiper-seagull-se/",
      why: "The entry point. Named wherever a review tells a small above-ground pool owner they are on the wrong page.",
      status: "live",
    },
    {
      anchor: "Aiper Scuba X1 Pro Max",
      href: "/robots/robotic-pool-cleaners/aiper-scuba-x1-pro-max/",
      why: "The four-surface flagship. Named wherever a review says 'a bigger pool needs a bigger machine' or reaches for the one robot that also skims.",
      status: "live",
    },
    {
      anchor: "Aiper Scuba V3",
      href: "/robots/robotic-pool-cleaners/aiper-scuba-v3-ai-vision/",
      why: "The camera robot. Named wherever debris recognition or seeing-versus-sweeping comes up, which is its actual differentiator.",
      status: "live",
    },
    {
      anchor: "BuBlue Bubot 800P",
      href: "/robots/robotic-pool-cleaners/bublue-bubot-800p/",
      why: "The corded counter-argument in the upper mid-range. Named wherever a review weighs a battery against a cable, or reaches for the corded machine that still does the waterline.",
      status: "live",
    },
    {
      anchor: "WYBOT C1",
      href: "/robots/robotic-pool-cleaners/wybot-c1/",
      why: "The budget wall-climber. Named wherever a review tells a reader the full floor-wall-waterline job can be had for about $500.",
      status: "live",
    },
    {
      anchor: "AquaSense 2 Ultra",
      href: "/robots/robotic-pool-cleaners/beatbot-aquasense-2-ultra/",
      why: "The catalogue's ceiling: five jobs including clarification, and the 3-year full replacement warranty every warranty discussion ends up comparing against.",
      status: "live",
    },

    /* Both went live on 6 August 2026 when their pages shipped. They were
       written as `planned` months earlier and became real links by changing
       one word — which is the whole point of declaring an anchor before its
       destination exists. */
    {
      anchor: "best robotic pool cleaner",
      href: "/best-robots/robotic-pool-cleaners/",
      why: "The ranked best-of. Every review and guide reaches a point where the reader wants the field rather than one machine, and that is where this goes.",
      status: "live",
    },
    {
      anchor: "worth it",
      href: "/guides/are-robotic-pool-cleaners-worth-it/",
      why: "The is-it-worth-it guide owns that query, and it is the number one People Also Ask entry on the category head term. Wherever a page hedges on whether the money is justified, this answers it.",
      status: "live",
    },

    /* ---- Declared now, linked when the page ships. ----
       A planned anchor renders as plain text, so none of these can 404. The
       wiring is done, and each becomes a real link the day its target exists —
       rather than being remembered, or not, months later. */
    /* REFUSED 6 August 2026, by measurement. These four anchors were declared
       months ago pointing at guide URLs nobody had ever priced. The second pool
       run priced them:

         robotic pool cleaner battery        no measurable volume
         robotic pool cleaner filter         no measurable volume
         what size robotic pool cleaner      no measurable volume
         robotic pool cleaner warranty       no measurable volume

       And the SERPs are worse than the volumes. Every one of these questions
       returns Reddit, Facebook, troublefreepool and Quora — one undifferentiated
       forum result set, not editorial. "how to clean pool robot filter" shares
       SIX top-ten domains with "aiper vs dolphin".

       Kept as entries rather than deleted so the refusal is auditable and
       nobody re-proposes them. `status: "planned"` already renders nothing.
       Evidence: docs/seo/robotic-pool-cleaners-guides-findings.md

       Warranty demand IS real but it is brand-shaped, not category-shaped —
       aiper warranty 320 at KD 3, dolphin pool cleaner warranty 110, beatbot
       warranty 70 — and it belongs in the review pages, which already carry
       warranty sections. */
    {
      anchor: "battery",
      href: "/guides/robotic-pool-cleaner-batteries/",
      why: "REFUSED 6 Aug 2026: no measurable volume, SERP is Reddit and Facebook. Every cordless review reaches the same paragraph about cells degrading. That belongs in one guide the reviews point at, not repeated five times. Planned.",
      status: "planned",
    },
    {
      anchor: "filter",
      href: "/guides/robotic-pool-cleaner-filters/",
      why: "REFUSED 6 Aug 2026: 'how to clean pool robot filter' is 10/mo and shares 6 domains with 'aiper vs dolphin'. Micron ratings, canister capacity and how often you really rinse. Recurs in every review and is explained properly in none of them yet. Planned.",
      status: "planned",
    },
    {
      anchor: "pool size",
      href: "/guides/what-size-robotic-pool-cleaner/",
      why: "REFUSED 6 Aug 2026: no measurable volume on any size phrasing. The single most common rule-out on this site is pool length. Planned as the page that explains how the ratings are arrived at and how much to trust them.",
      status: "planned",
    },
    {
      anchor: "warranty",
      href: "/guides/robotic-pool-cleaner-warranties/",
      why: "REFUSED 6 Aug 2026: no category volume; demand is brand-shaped and lives in the reviews. Two reviews so far have hit a manufacturer that will not state a term. Planned as the page that records who publishes what.",
      status: "planned",
    },
  ],
};

export const anchorsFor = (categorySlug: string | undefined): InternalAnchor[] =>
  categorySlug ? (CATEGORY_ANCHORS[categorySlug] ?? []) : [];

/** The ones that would render right now. */
export const liveAnchorsFor = (categorySlug: string | undefined): InternalAnchor[] =>
  anchorsFor(categorySlug).filter((a) => a.status === "live");
