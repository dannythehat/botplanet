/* ============================================================
   Category hero content, keyed by category slug.

   Wording for robotic pool cleaners is taken from the approved
   Notion research (Page 001 — Robotic Pool Cleaners, Keyword &
   Content Blueprint): exact H1, exact meta description, primary
   keyword in the first sentence, one natural synonym inside the
   first 100 words, and no "best" framing (that term belongs to
   the best-of guide).

   A category with no entry here falls back to the generic
   heading on the category page. Add an entry to give it a hero.
   ============================================================ */

import type { HeroCta, HeroImage } from "../components/CategoryHero.astro";

export interface CategoryHeroContent {
  eyebrow?: string;
  /** Exact approved H1. */
  title: string;
  /** 55–85 words. */
  subtitle: string;
  /** Approved <title>. */
  seoTitle: string;
  /** Approved meta description. */
  metaDescription: string;
  primaryCta?: HeroCta;
  secondaryCta?: HeroCta;
  /** Drop the artwork in and fill this out. Omit it and the hero renders text-only. */
  image?: HeroImage;
  /** "above" for wide cinematic artwork, "beside" for squarer artwork. */
  imageLayout?: "above" | "beside";
}

/* @extension-point per-category | required | The page falls back to a bare
   generic heading: no H1 of its own, no <title>, no meta description, no OG
   image and no CollectionPage schema. It renders, so nothing complains. */
export const CATEGORY_HERO: Record<string, CategoryHeroContent> = {
  /* Page 010, the last of the owner-locked ten. Keyword evidence: run
     31094454463, 2026-08-06, $0.1462, plus a SERP top-up. Full working in
     docs/seo/educational-coding-robots-research-findings.md, INCLUDING three
     questions this page is built without an answer to — they are named there
     rather than glossed.

     THE PAGE IS NAMED FOR THE DEMAND, NOT THE TOPIC. Notion calls the category
     "educational and coding robots", and the SERPs say those are two different
     things:

       coding robot        1,300/mo  KD 21  makeblock, sphero, botzees,
                                            learningresources, reddit,
                                            stemeducationguide, techgearlab
       educational robot     720/mo  KD  2  robotshop, ez-robot, WIKIPEDIA,
                                            robot-advance, standardbots,
                                            "Robots for Colleges & Universities"

     They share 4 top-ten domains. The coding SERP is parents and retailers.
     The educational SERP is institutional procurement and an encyclopedia
     entry — the same shape that ended the security-robots category. So the
     page is built on the coding family and "educational robot" is a secondary
     term it will pick up rather than chase.

     WITHIN THE CODING FAMILY THE ONE-URL RULE IS EMPHATIC: coding robot vs
     best coding robots for kids shares 8 top-ten domains, coding robot vs
     coding robots for kids 7, coding robots for kids vs best coding robots for
     kids 7. One page, no best-of.

     THE HEAD TERM IS SMALL AND THE PRODUCTS ARE HUGE, which is the reverse of
     every other category here: vex iq 18,100, ozobot 14,800, lego mindstorms
     9,900, lego education spike prime 5,400, sphero bolt 4,400, bee bot 4,400.
     The hub will never carry this category on its own — the reviews are the
     business, and the hub exists to route a parent to the right one.

     Christmas category: coding robot peaks at 2,900 in December against 720 in
     June, and stem toys runs 18,100 in December against 4,400 in January. */
  "educational-coding-robots": {
    eyebrow: "Robot category",
    /* 47 words. Head term opens sentence one. The age point — the category's
       hard exclusion and its real failure mode — is sentence two. */
    title: "Coding Robots for Kids: Which One Suits Which Age",
    subtitle:
      "A coding robot teaches programming by making something physical happen, which works far " +
      "better than a screen for most children. Age is the whole decision: a button-driven floor " +
      "robot bores a twelve-year-old within a day, and a build-it-yourself kit defeats a " +
      "five-year-old. Both end up in a cupboard, which is what failure looks like here.",
    seoTitle: "Coding Robots for Kids: Compare by Age | BotPlanet",
    metaDescription:
      "Compare coding robots for kids by age, screen-free or app-based, block or text coding, " +
      "and how long a child keeps using one. Find the right first coding robot.",
    primaryCta: { label: "Compare coding robots", href: "#products" },
    secondaryCta: { label: "Which age needs what?", href: "#age" },
    imageLayout: "above",
  },

  /* Page 009, and the largest category BotPlanet has taken on. Keyword
     evidence: DataForSEO run 31090094137, 2026-08-06, $0.2229. Full working in
     docs/seo/robot-vacuums-research-findings.md.

     ONE URL CARRIES EVERYTHING, which was not the expected answer. Measured
     against "robot vacuum": robot vacuum and mop shares 7 top-ten domains,
     self emptying robot vacuum 7, best robot vacuum 6, best robot vacuum and
     mop 6, robot mop 6, best robot vacuum for large house 6, best self
     emptying 5, robot vacuum for carpet 5, best robot vacuum for pet hair 5.
     Mopping and self-emptying were the two most likely page splits in the
     category and both came back firmly inside the hub.

     THE PAGE IS NAMED FOR THE HEAD TERM AND BUILT ON THE EASY PHRASINGS, and
     the gap here is the widest on the site. "robot vacuum" is 135,000/mo at
     KD 25 against the most defended SERP we have faced — Wirecutter, PCMag,
     RTINGS, The Verge, Consumer Reports and vacuumwars all rank. But Google
     groups phrasings loosely here and the difficulty moves enormously:
       robot vacuum and mop     40,500  KD 29
       robot vacuum that mops   40,500  KD  8   <- same volume, a quarter the difficulty
       robot mop                12,100  KD 34
       mopping robot            12,100  KD  7   <- same again
       best robot vacuum for pet hair 18,100 KD 8
     Those four are what the copy is written to take.

     THE BRAND IS BIGGER THAN THE BEST-OF TERM. "roborock" is 110,000/mo, well
     above "best robot vacuum" at 60,500, and Roborock's own site ranks on the
     head term. Third category running where a manufacturer owns more demand
     than the category's commercial query. Secondary mention, not the H1.

     Seasonality is mild and entirely retail: 201,000 in November against
     110,000 for most of the year. That is Black Friday, not a season. */
  "robot-vacuums": {
    eyebrow: "Robot category",
    /* 44 words. Head term opens sentence one; the mop phrasing the page is
       built to win lands in sentence two. */
    title: "Robot Vacuums and Mops: Compare What Actually Cleans Your Floors",
    subtitle:
      "A robot vacuum is the one household robot most people meet first, and the range runs from " +
      "under two hundred dollars to well over a thousand. A robot vacuum that mops is now the " +
      "default rather than the upgrade — so the real question is what your floors are, and what " +
      "the extra money genuinely buys.",
    seoTitle: "Robot Vacuums & Mops: Compare Robot Vacuums | BotPlanet",
    metaDescription:
      "Compare robot vacuums and mops by floor type, mop lifting, self-emptying, pet hair, " +
      "obstacle avoidance and price. Find the right robot vacuum for your home.",
    primaryCta: { label: "Compare robot vacuums", href: "#products" },
    secondaryCta: { label: "Does it work on carpet?", href: "#floors" },
    imageLayout: "above",
  },

  /* Page 006. Keyword evidence: DataForSEO run 31092662805, 2026-08-06.
     Full working in docs/seo/grill-cleaning-robots-research-findings.md.

     THIS RUN WAS DESIGNED TO KILL THE CATEGORY AND FAILED TO. Grillbot is
     close to the only robotic grill cleaner with US retail presence, which is
     the position security robots was in before it was cancelled, so the SERP
     budget went on proving demand rather than assuming it. Three tests:

     1. Is the category term a shopping SERP? Yes. "grill cleaning robot" is
        5,400/mo at KD 0 and returns grillbots.com, Amazon twice, Walmart,
        Consumer Reports and Food & Wine. Real retail and real editorial —
        nothing like the Adobe Stock result that ended security robots.

     2. Does the manual grill-brush market swallow it? NO, and this was the
        real risk. "grill cleaning robot" shares TWO top-ten domains with
        "grill brush" — amazon.com and reddit.com, both universal. Discount
        them and the overlap is zero. The 33,100/mo brush market is a
        different SERP and BotPlanet is not in it.

     3. Does the brand own the category? Partly. "grillbot" is 18,100/mo, more
        than three times the category term, and it shares 5 domains so it is
        the same family. Grillbot's own site holds the top slot. Secondary
        term, not the H1 — same ruling as Litter-Robot.

     THE CATEGORY IS ONE PRODUCT, AND THE PAGE SAYS SO. Every commercial
     variant returns the same machine. Pretending to compare a field that does
     not exist would be the dishonest move, so the page is built to answer
     "does this thing actually work" — which is what the People Also Ask box
     asks on three of the SERPs, in those words.

     SEASONALITY IS THE SHARPEST ON THE SITE: 18,100 in June against 720 in
     February. A 25x swing. This page has to be live and indexed by spring. */
  "grill-cleaning-robots": {
    eyebrow: "Robot category",
    /* 45 words. Head term opens sentence one. The honest framing — one real
       product — is sentence three rather than buried. */
    title: "Grill-Cleaning Robots: Does an Automatic Grill Cleaner Work?",
    subtitle:
      "A grill cleaning robot sits on the grates, drives itself around and scrubs while you do " +
      "something else. It is a small category — one product dominates it — so this page is less " +
      "about which robotic grill cleaner to pick and more about whether one belongs on your " +
      "barbecue at all, and what it will not do.",
    seoTitle: "Grill-Cleaning Robots: Does an Automatic Grill Cleaner Work? | BotPlanet",
    metaDescription:
      "Does a grill cleaning robot actually work? We compare robotic grill cleaners on grate " +
      "type, brush material, grease and safety — and say when a brush is the better buy.",
    primaryCta: { label: "Compare grill robots", href: "#products" },
    /* Straight to the verdict, not the product grid. "Do the grill bots really
       work?" and "Does a Grillbot really work?" both appear in Google's People
       Also Ask on this category. The doubt IS the query. */
    secondaryCta: { label: "Does it actually work?", href: "#worth-it" },
    imageLayout: "above",
  },

  /* Page 004 of the owner-locked ten. Keyword evidence: DataForSEO runs
     31090590604 (SERPs) and 31091110791 (volume repair), 2026-08-06, $0.2405
     combined. Full working in
     docs/seo/self-cleaning-litter-boxes-research-findings.md.

     ONE URL CARRIES THE WHOLE COMMERCIAL CATEGORY, and for once the data made
     that easy rather than being a policy call. Measured against
     "self cleaning litter box": automatic litter box 9 shared top-ten domains,
     self cleaning cat litter box 8, best self cleaning litter box 7, smart
     litter box 7, best automatic litter box 6, for multiple cats 6, for large
     cats 6, cheap 6. Google serves substantially one result set for all of it.

     THE PAGE IS NAMED FOR THE HEAD TERM AND WRITTEN TO WIN THE "AUTOMATIC"
     ONE. "self cleaning litter box" is 110,000/mo at KD 46 — the hardest head
     term BotPlanet has taken on. The same family's "automatic" phrasings are
     materially easier for nearly the same traffic: automatic litter box
     90,500 at KD 26, automatic cat litter box 49,500 at KD 11, and best
     automatic litter box 22,200 at KD 8. That last one is the single best
     opportunity in the category and it is what the copy is built to take.

     THE BRAND IS BIGGER THAN THE CATEGORY. "litter robot" is 165,000/mo —
     50% more than the category term — and Whisker holds positions one and two
     with its own two domains. It shares 6 domains with the head term so it is
     the same family, but it is not a term a comparison site wins. It is a
     secondary mention here and a review page for the product; it is not the
     H1 and never will be. */
  "self-cleaning-litter-boxes": {
    eyebrow: "Robot category",
    /* 46 words. Head term opens sentence one; the "automatic" phrasing the
       page is actually built to win lands in sentence two. */
    title: "Self-Cleaning Litter Boxes: Compare Automatic Litter Boxes",
    subtitle:
      "A self cleaning litter box sifts the waste into a sealed drawer a few minutes after your " +
      "cat leaves, so the job goes from daily to roughly weekly. An automatic litter box is not " +
      "right for every cat though — size, age and nerve decide it, and one of those is a safety " +
      "question rather than a preference.",
    seoTitle: "Self-Cleaning Litter Boxes: Compare Automatic Litter Boxes | BotPlanet",
    metaDescription:
      "Compare self-cleaning litter boxes by cat size, multi-cat capacity, odour sealing, litter " +
      "type and running cost — including which cats they are not safe for.",
    primaryCta: { label: "Compare litter boxes", href: "#products" },
    /* Straight to the safety section rather than to BotMatch, which is
       coming_soon until the catalogue has products. This is also the honest
       CTA: "Do vets recommend self-cleaning litter boxes?" appears in Google's
       People Also Ask on SIX of the 23 SERPs bought for this category, and
       PETA ranks fourth for "are self cleaning litter boxes safe". The
       question in the reader's head is whether this thing is safe, not which
       model is prettiest. */
    secondaryCta: { label: "Are they safe?", href: "#safety" },
    /* No hero artwork yet — pages first, images after, per the owner's
       instruction of 6 August 2026. */
    imageLayout: "above",
  },

  /* Keyword evidence: DataForSEO run 31081889310, 2026-08-06, $0.2224. Full
     working in docs/seo/companion-robots-research-findings.md.

     THE H1 IS NOT THE CATEGORY NAME, and that is deliberate.

     "companion robot" is 4,400/mo and looks like the obvious head term. Its
     SERP is not a shopping SERP: Wikipedia, globaltimes.cn, sixthtone.com, a
     New Atlas piece on the world's first mass-produced humanoid, and two
     Reddit threads about a UBTECH launch. Three Chinese tech-news outlets in a
     top ten. It is also intent-contaminated — the related-keyword pull
     returned "companion robot woman" (390) and "ai companion robot for adults"
     (320), and the "ai companion robot" SERP carries a Facebook post reading
     "It's an endless love. It will never betray you."

     "robot pet" is 8,100/mo at KD 0 and returns Enabot, Living.AI, Amazon's
     Loona listing, Elephant Robotics and us.aibo.com. Twice the volume, a
     clean product SERP, and every result is a machine we would stock.

     So the page is named for the category and written on "robot pet".
     "companion robot" is served as a secondary term in the body, which is
     where a contaminated head term belongs.

     The two head terms share 4 domains — reddit, youtube, amazon, wikipedia,
     all universal — which is below the one-URL threshold. The COMMERCIAL
     variants converge though: "best companion robot" vs "best robot pet"
     share 5, including keyirobot.com and robotshop.com. Buyers land in the
     same place; only the news-driven head term wanders off. One hub. */
  "companion-robots": {
    eyebrow: "Robot category",
    /* 46 words. Primary term opens sentence one. The category name lands in
       sentence two so the page still reads as what it is called. */
    title: "Companion Robots and Robot Pets: Compare What They Actually Do",
    subtitle:
      "A robot pet is bought for company rather than to do a job, which makes it the hardest " +
      "kind of robot to compare honestly. A companion robot that charms one person bores " +
      "another, and the specification sheet will not tell you which. We compare them on the " +
      "things that decide it — who it is for, whether it talks back, and what happens when the " +
      "company behind it stops answering.",
    seoTitle: "Companion Robots & Robot Pets: Compare | BotPlanet",
    metaDescription:
      "Compare robot pets and companion robots by who they are for, conversation, movement, " +
      "subscription cost and support risk. Find the right companion robot.",
    primaryCta: { label: "Compare robot pets", href: "#products" },
    /* Not BotMatch. /botmatch/companion-robots/ has its own question set and
       its own scoring config, but no products to recommend yet, so it is
       coming_soon — advertising it would promise a tool that returns nothing.
       The second CTA goes to the section carrying this category's real risk
       instead. Swap it to BotMatch with the first published product. */
    secondaryCta: { label: "What happens if support ends?", href: "#support-risk" },
    /* No hero artwork yet — pages first, images after, per the owner's
       instruction of 6 August 2026. The hero renders text-only rather than
       blocking the page. */
    imageLayout: "above",
  },

  /* Keyword evidence: same run, 31081889310.

     A SEPARATE PAGE FROM COMPANION ROBOTS, and the evidence is not close.
     "companion robot" and "pet camera robot" share exactly two top-ten
     domains, amazon.com and reddit.com, both of which appear on nearly every
     query in this space. Discount them and the overlap is zero — no
     publisher, no manufacturer, no retailer in common. Meanwhile "pet camera
     robot" and "robot pet camera" share six, four of them distinctive:
     store.enabot.com, wired.com, ebay.com, walmart.com.

     The seasonality says the same thing independently. Everything companion
     peaks in November and December. "pet camera robot" peaks in JULY at 1,000
     and troughs in April at 140 — people buy one before going away, not as a
     present.

     THE PAGE DOES NOT TARGET "best pet camera robot". It is 10/mo and Google
     reads it as "best pet camera", serving PCMag, Wirecutter, Furbo and Wired
     — the static-camera market. Adding "robot" to that query buys Wirecutter
     as a competitor for ten searches a month. The unmodified term is the
     whole opportunity. */
  "pet-camera-robots": {
    eyebrow: "Robot category",
    /* 44 words. */
    title: "Pet Camera Robots: Cameras That Drive Around the House",
    subtitle:
      "A pet camera robot is a camera on wheels that goes to your dog instead of waiting for " +
      "your dog to walk past it. That is the whole argument for one over a fixed camera, and " +
      "whether it holds depends on your floors, your stairs and how much your pet actually " +
      "moves around while you are out.",
    seoTitle: "Pet Camera Robots: Compare Moving Pet Cameras | BotPlanet",
    metaDescription:
      "Compare pet camera robots by video quality, two-way audio, treat dispensing, floor type " +
      "and battery life. Find the right moving pet camera for your home.",
    primaryCta: { label: "Compare pet camera robots", href: "#products" },
    secondaryCta: { label: "Robot or fixed camera?", href: "#versus-fixed" },
    imageLayout: "above",
  },

  /* Keyword evidence: DataForSEO runs 31073327230 and 31074893036,
     2026-08-06, $0.22428 combined. Full working in
     docs/seo/robotic-lawn-mowers-research-findings.md.

     "robot lawn mower" is 74,000/mo and Google groups four other phrasings
     into it (robotic lawn mower, robotic lawnmower, lawn mowing robot, robot
     grass cutter) — the measured overlap between the first two is 8/10.
     "robot mower" is a SEPARATE cluster at 22,200 and earns its place in the
     H1 rather than being treated as the same words.

     TWO THINGS THIS PAGE IS BUILT AROUND, both from the research:

     1. The head term is KD 36-54 and half its top ten is manufacturer sites
        — husqvarna.com, worx.com, navimow.com, mammotion.com, yarbo.com. A
        comparison site does not win that SERP. "best robot lawn mower" is
        KD 8 and returns nothing but editorial. So the copy is written to win
        the "best" cluster (~13,400/mo) while the head term is what the page
        is named for.

     2. Unlike window, hub and best-of are NOT the same SERP here — 2/10
        shared, against window's 6/10. The one-URL rule still applies (owner
        ruling, 5 August 2026), so this page carries the "best" job too, but
        the merge is a policy decision rather than something the data asked
        for. Recorded so a future reader does not mistake it for evidence.

     The acreage cluster (~2,060/mo: 1 acre, 2 acres, half acre, small yard)
     lives in the yard-size section below, NOT in a guide — "best robot lawn
     mower for 1 acre" shares 6/10 with "best robot lawn mower". */
  "robotic-lawn-mowers": {
    eyebrow: "Robot category",
    /* 41 words. Primary term opens sentence one; the separate 22,200/mo
       "robot mower" cluster lands naturally in sentence two, and yard size —
       the biggest long-tail cluster and the first BotMatch question — is the
       thing the last sentence promises. */
    title: "Robotic Lawn Mowers: Compare Robot Mowers for Every Yard Size",
    subtitle:
      "A robot lawn mower cuts a little every day instead of a lot once a week, which is why " +
      "a lawn it looks after stays even rather than recovering between mows. Not every robot " +
      "mower suits every yard though — size, slope and tree cover rule machines out fast, and " +
      "we compare them on exactly that.",
    seoTitle: "Robotic Lawn Mowers: Compare Robot Mowers | BotPlanet",
    metaDescription:
      "Compare robotic lawn mowers by yard size, slope, boundary wire or wire-free RTK " +
      "navigation, zones and price. Find the right robot mower for your lawn.",
    primaryCta: { label: "Compare robot mowers", href: "#products" },
    /* No BotMatch CTA yet, unlike pool and window. /botmatch/robotic-lawn-mowers/
       resolves, but the questionnaire is still the pool question set — it would
       ask a lawn buyer how long their pool is. Sending readers there would be
       advertising a tool that does not exist. The second CTA goes to the
       decision this category actually turns on instead. Swap it back to
       BotMatch when the lawn question set lands. */
    secondaryCta: { label: "Wire or wire-free?", href: "#navigation" },
    /* No hero artwork yet. The interface allows it and the hero renders
       text-only rather than blocking the page — the category was built before
       its images on the owner's instruction of 6 August 2026 ("we will do
       pages first, then add products afterwards"). The masters needed are
       listed in docs/seo/robotic-lawn-mowers-research-findings.md §10. Do NOT reuse
       /media/lawn-category/feature-desktop.webp here: it is the homepage
       teaser, composed with a dark left gutter for overlaid text, and it
       already appears further down this page in the BotMatch panel. */
    imageLayout: "above",
  },

  /* Keyword evidence: DataForSEO run 30981257806, 2026-08-05, $0.2044.
     "window cleaning robot" is 12,100/mo at KD 0-5 and Google groups four
     other phrasings into it (robot window cleaner, robotic window cleaner,
     window cleaner robot, window washing robot). "automatic window cleaner"
     is a SEPARATE cluster worth 8,100 at KD 0, so it earns a place in the
     subtitle rather than being treated as the same words.

     This page also carries the "best" job — there is no separate best-of
     page, because 6 of the top 10 results are identical between the two
     terms and NYTimes ranks first for both with a single article. */
  "window-cleaning-robots": {
    eyebrow: "Robot category",
    title: "Window Cleaning Robots: Compare Robot Window Cleaners",
    /* 44 words, matching the shortened pool intro Danny approved rather than
       the older 55-85 range. Primary term opens sentence one; the separate
       8,100/mo cluster appears naturally in sentence two. */
    subtitle:
      "A window cleaning robot grips the glass, sprays and wipes its way across it, and " +
      "does the panes you would rather not reach. An automatic window cleaner is not right " +
      "for every window though — the frame, the height and the glass decide it, and we " +
      "compare them on exactly that.",
    seoTitle: "Window Cleaning Robots: Compare Robot Window Cleaners | BotPlanet",
    metaDescription:
      "Compare window cleaning robots by glass type, framed or frameless, suction power, " +
      "safety tether and app control. Find the right robot window cleaner for your windows.",
    primaryCta: { label: "Compare window robots", href: "#products" },
    secondaryCta: { label: "Try Window BotMatch", href: "/botmatch/window-cleaning-robots/" },
    /* Owner-created BotPlanet artwork, supplied 2026-08-05. Carries in-image
       BotPlanet branding by the owner's design decision. The machine in the
       artwork is badged AIPER, a pool-robot brand that makes no window robot
       and appears nowhere in this catalogue; raised with the owner, who
       confirmed it stands. Recorded so a future reader finds a decision
       rather than assuming a mistake. */
    image: {
      src: "/media/window/hero-desktop.webp",
      mobileSrc: "/media/window/hero-mobile.webp",
      /* The mobile master is a 4:5 portrait — logo at the top, headline
         beneath it. The default 3:2 slot cropped both away. */
      mobileAspect: "4 / 5",
      alt:
        "A window cleaning robot gripping the glass wall of a modern home at dusk, water " +
        "spraying across the pane, with a warmly lit living room and a coastline visible " +
        "behind the glass.",
      focal: "50% 50%",
    },
    imageLayout: "above",
  },

  "robotic-pool-cleaners": {
    eyebrow: "Robot category",
    title: "Robotic Pool Cleaners: Compare Pool Robots for Every Pool Type",
    /* 40 words. Danny approved this shorter intro on 2 August 2026 in place of
       the 55–85 word range in the Notion research, so the block scans in about
       four lines on a phone rather than nine. Keyword rules still hold:
       "robotic pool cleaner" opens the first sentence and "pool robot" follows
       as the natural synonym. */
    subtitle:
      "A robotic pool cleaner scrubs the floor, climbs the walls and lifts debris out of " +
      "the water while you get on with your day. Not every pool robot suits every pool — " +
      "we compare them on the things that actually decide it.",
    seoTitle: "Robotic Pool Cleaners: Compare Pool Robots | BotPlanet",
    metaDescription:
      "Compare robotic pool cleaners by pool type, floor, wall and waterline coverage, corded " +
      "or cordless power, filtration and smart controls. Find the right pool robot.",
    primaryCta: { label: "Compare pool robots", href: "#products" },
    secondaryCta: { label: "Try Pool BotMatch", href: "/botmatch/robotic-pool-cleaners/" },

    /* Owner-created BotPlanet artwork. Carries approved in-image BotPlanet
       branding, which is deliberate editorial media — do not crop it out or
       swap it for a plain packshot. Master supplied as PNG; the files below
       are the optimised WebP derivatives (133 KB / 85 KB).
       Mobile is a 3:2 centre crop that keeps both the logo and the robot. */
    image: {
      src: "/media/pool/hero-desktop.webp",
      mobileSrc: "/media/pool/hero-mobile.webp",
      alt:
        "Cutaway view of a lit in-ground swimming pool at dusk with a tracked " +
        "BotPlanet robotic pool cleaner working across the pool floor, a modern " +
        "house lit behind it.",
      focal: "50% 55%",
    },
    imageLayout: "above",
  },
};

export function heroFor(slug: string | undefined): CategoryHeroContent | undefined {
  return slug ? CATEGORY_HERO[slug] : undefined;
}
