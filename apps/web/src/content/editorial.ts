/* ============================================================
   Editorial article content — best-of pages and standalone guides.

   THE THIRD PAGE TYPE. Category hubs live in category-sections.ts
   and reviews live in reviews.ts. This file holds the pages that
   are neither: a ranked best-of, and a guide that answers one
   question.

   WHY THESE PAGES EXIST AT ALL. Every one of them was ruled
   CREATE by measured SERP evidence in
   docs/seo/pool-research-findings.md, and nothing else has been
   added. A best-of page that exists because a site "should have
   one" is a page competing with its own category hub.

   THE STRUCTURE MIRRORS reviews.ts DELIBERATELY: everything
   checkable lives here as data, and only the prose lives in
   Markdown alongside (src/articles/<slug>.md). That is what lets
   a test read the picks without parsing an article.

   ONE RULE THAT IS NOT OBVIOUS FROM THE TYPES: no price figure
   appears on these pages, and the type has nowhere to put one.
   Prices are dated observations that belong on the review and in
   the buy box, where the check date is printed beside them. A
   ranked list that quotes a number is quoting it from whenever
   the list was written, and readers arrive months later. Bands
   ("Mid", "Top") come from the catalogue and stay true.
   ============================================================ */

import type { FaqItem } from "../components/FaqList.astro";
import type { HeroImage } from "../components/CategoryHero.astro";
import type { ReviewFigureRef } from "../lib/review-figures";

/** One ranked recommendation. */
export interface EditorialPick {
  /** Product slug — must match a published D1 row. */
  productSlug: string;
  /** The award, e.g. "Best overall". Short enough to sit on a chip. */
  award: string;
  /**
   * Why it wins its award. Two or three sentences, and every factual claim
   * has to be traceable to the catalogue row or the product's own review —
   * this page states conclusions, the review carries the evidence.
   */
  why: string;
  /**
   * Who should not buy it. Required, not optional: an award with no rule-out
   * is an advert. Taken from the review's `notIdealFor` so the two pages
   * cannot end up telling a reader different things.
   */
  wrongFor: string;
}

export interface EditorialContent {
  /** Canonical path. Must exist in the route registry. */
  path: string;
  categorySlug: string;
  eyebrow: string;
  /** The H1. */
  title: string;
  seoTitle: string;
  metaDescription: string;
  /** The standfirst under the H1 — the answer before the reasoning. */
  standfirst: string;
  /**
   * The page hero. Optional, because a page is complete without one and
   * nothing should wait on artwork to ship.
   *
   * These are scenes, not product shots: a best-of page's hero shows the job,
   * not a machine we are about to rank. That distinction is why they live
   * here rather than resolving through the product registry — the picture
   * belongs to the page, not to any one thing on it.
   */
  image?: HeroImage;
  /** Markdown file basename in src/articles/, without the extension. */
  prose: string;
  /**
   * Pictures placed inside the prose, each under a heading that exists in it.
   *
   * The same mechanism reviews use, and it is here for the same reason: a
   * best-of or a guide that runs nine hundred words with one hero at the top
   * is a wall of text, and the argument in the middle is where a picture
   * actually earns its place. A figure naming a heading nobody wrote is
   * dropped silently in production and throws in dev, so a typo fails loudly
   * rather than leaving a page quietly short of a picture.
   */
  figures?: ReviewFigureRef[];
  /**
   * Ranked picks. Empty for a guide, which recommends nothing directly and
   * sends the reader to a page that does.
   */
  picks: EditorialPick[];
  /**
   * Which catalogue slugs the comparison table may show, in the order the
   * picks appear. Declared rather than filtered so a product joining the
   * category cannot silently appear on a page whose argument does not cover
   * it — and so the cordless page can never print a corded machine.
   */
  comparisonSlugs: string[];
  faq: FaqItem[];
  lastReviewed: string;
  /** The day the page first went live, when it is known. Article schema is emitted only when this exists — a last-reviewed date is never relabelled as a publication date. */
  published?: string;
  /** Put the contents block ahead of the picks, for a page whose picks are tall. */
  contentsFirst?: boolean;
  /** Extra jump links appended to the contents, for sections the page's slot adds. */
  extraContents?: { id: string; text: string }[];
}

/* @extension-point per-category | optional | Best-of pages and standalone
   guides for a category, keyed by canonical path. OPTIONAL because these are
   earned, not owed: a category gets a best-of page when its research shows a
   ranked-list SERP that the hub cannot serve, and not otherwise. A category
   with no row here has no sub-pages, which is a legitimate state and the one
   nine of the ten categories are in today. What is NOT legitimate is a route
   registered as live with no record behind it — editorial.test.ts checks the
   pairing in both directions. */
export const EDITORIAL: Record<string, EditorialContent> = {
  /* ------------------------------------------------------------------
     Page 2 of the pool map. "best robotic pool cleaner", 6,600 at KD 13.

     Google reports "best robotic pool cleaner", "best robot pool cleaner",
     "top rated robotic pool cleaner" AND "best robotic pool cleaner for
     inground pools" as one grouped cluster, and the SERPs overlap on
     thepoolnerd / poolbots / Amazon. So there is no inground best-of page:
     it is this page, with an inground section. Above-ground (140), large
     pools (70), leaves (20) and budget (50) are sections here for the same
     reason — the volumes are nowhere near a URL.
     ------------------------------------------------------------------ */
  "/best-robots/robotic-pool-cleaners/": {
    path: "/best-robots/robotic-pool-cleaners/",
    categorySlug: "robotic-pool-cleaners",
    eyebrow: "Best of",
    title: "The best robotic pool cleaners for US pools",
    seoTitle: "The Best Robotic Pool Cleaners (2026) — Ranked by the Job",
    metaDescription:
      "The best robotic pool cleaner for each job — floor, walls, waterline, above-ground, big pools and heavy debris. Every pick names who should not buy it.",
    standfirst:
      "There is no single best robotic pool cleaner, and any list that gives you one has decided your pool for you. " +
      "These nine are ranked by the job they do best, and each one says plainly who should not buy it.",
    image: {
      src: "/media/editorial/best-robotic-pool-cleaners.webp",
      alt:
        "A tracked robotic pool cleaner working the floor of a large lit in-ground pool at dusk, a modern house glowing behind it.",
      focal: "50% 60%",
    },
    prose: "best-robotic-pool-cleaners",
    picks: [
      {
        productSlug: "aiper-scuba-s1",
        award: "Best overall",
        why:
          "The only machine in this catalogue that handles every wet surface — floor, walls and waterline — at a mid-range price, " +
          "with the same 3-micron filtration Aiper puts in its flagships and a shallow-ledge claim most robots cannot make. " +
          "Rated to 50 ft, which covers the great majority of American in-ground pools.",
        wrongFor:
          "A pool longer than 50 ft, anyone who wants the surface skimmed, or anyone who wants a camera choosing where to clean.",
      },
      {
        productSlug: "wybot-c1",
        award: "Best value",
        why:
          "Floor, walls and waterline plus a weekly cycle timer and a stated 2-year warranty, from the cheapest machine here that " +
          "climbs anything at all. Nothing else in the catalogue does the full wet-surface job for less.",
        wrongFor:
          "A pool over 1,615 sq ft, anyone who wants ultra-fine filtration or a camera, or anyone who wants the water surface skimmed.",
      },
      {
        productSlug: "dolphin-nautilus-cc-plus",
        award: "Best corded",
        why:
          "Plugs in, runs a two-hour cycle, climbs the walls and never needs charging — the Maytronics machine most American pool " +
          "owners have actually met. It is rated to 40 ft and it does not scrub the waterline, whatever the product copy implies.",
        wrongFor:
          "The waterline is your actual complaint, your pool runs longer than 40 ft, or you want a cordless machine.",
      },
      {
        productSlug: "aiper-scuba-x1-pro-max",
        award: "Best for a large pool",
        why:
          "The only cleaner here that honestly claims all four jobs — surface, waterline, walls and floor — with ultrasonic mapping, " +
          "8,500 GPH of claimed suction and the longest stated warranty of any Aiper we hold. Rated to 100 ft.",
        wrongFor:
          "Your budget is under four figures, your pool already has surface skimming you like, or it is above ground.",
      },
      {
        productSlug: "aiper-seagull-se",
        award: "Best for an above-ground pool",
        why:
          "A cordless vacuum that does the floor of a small above-ground pool for ninety minutes and does nothing else. " +
          "No walls, no waterline, no app — which at this price is the correct product rather than a compromise.",
        wrongFor:
          "An in-ground pool with real walls, a waterline ring, or anyone who wants an app, a schedule or a map.",
      },
      {
        productSlug: "dolphin-proteus-dx4-plus",
        award: "Best for steps and sun ledges",
        why:
          "Corded Maytronics again, but this one climbs walls, works the sun ledges and — per Maytronics' own listing copy — the " +
          "waterline too. It is the answer when the shape of your pool is the problem rather than its length.",
        wrongFor:
          "Your pool runs longer than 33 ft, it is above ground, or the waterline is the entire reason you are buying.",
      },
      {
        productSlug: "aiper-scuba-v3-ai-vision",
        award: "Best for heavy debris",
        why:
          "The first robot here that looks at your pool: a camera recognises debris and steers at it instead of sweeping blind. " +
          "Cordless, 18.1 lb, waterline coverage and the finest filter rating we list.",
        wrongFor:
          "Your pool is above ground, you want a manufacturer-stated maximum pool length or warranty term, or a camera in the water is a line you would rather not cross.",
      },
      {
        productSlug: "polaris-freedom",
        award: "Best cordless with a dock",
        why:
          "Two and a half hours on a charge, floor, walls and waterline, and it parks itself on a dock so there is no fishing a wet " +
          "machine out by its handle. A recognised American pool brand behind it, rated to about 50 ft.",
        wrongFor:
          "Your pool is above ground, deeper than 13 ft, or you keep equipment for a decade and do not want a part that wears out on a calendar.",
      },
      {
        productSlug: "beatbot-aquasense-2-ultra",
        award: "Best if money is not the constraint",
        why:
          "Floor, walls, waterline, surface skimming and a water-clarification system nobody else attempts, behind a pool-mapping " +
          "camera stack and an industry-first 3-year full replacement warranty. Rated to 3,875 sq ft of floor per cycle.",
        wrongFor:
          "Modest or above-ground pools, buyers who want skimming without flagship money, or anyone a WYBOT C1 or Aiper Scuba S1 would serve for a fraction of the price.",
      },
    ],
    comparisonSlugs: [
      "aiper-scuba-s1",
      "wybot-c1",
      "dolphin-nautilus-cc-plus",
      "aiper-scuba-x1-pro-max",
      "aiper-seagull-se",
      "dolphin-proteus-dx4-plus",
      "aiper-scuba-v3-ai-vision",
      "polaris-freedom",
      "beatbot-aquasense-2-ultra",
      "bublue-bubot-800p",
    ],
    faq: [
      {
        q: "What is the best robotic pool cleaner overall?",
        a:
          "For a standard in-ground pool up to 50 ft, the Aiper Scuba S1: it is the cheapest machine here that does the floor, the " +
          "walls and the waterline with fine filtration. But 'overall' hides the real question. An above-ground pool wants the Aiper " +
          "Seagull SE, a 33 ft pool full of steps wants the Dolphin Proteus DX4 Plus, and a pool that eats leaves wants the Aiper " +
          "Scuba V3. The best cleaner is the one that matches your pool, not the one at the top of a list.",
      },
      {
        q: "Do I need one that climbs walls?",
        a:
          "Only if your walls get dirty, which depends on the surface. Plaster and pebble hold a film that shows; vinyl and fibreglass " +
          "usually do not. Wall climbing costs money and shortens the floor cycle, so a pool whose walls stay clean is better served by " +
          "a floor-only machine that does its one job properly.",
      },
      {
        q: "Is the waterline the same as the walls?",
        a:
          "No, and it is the single most common thing buyers get wrong. The waterline is the band of scum at the surface where oils and " +
          "sunscreen collect. A robot can climb the wall and still never scrub that band — the Dolphin Nautilus CC Plus is exactly that " +
          "machine. If the ring is your complaint, check for the word waterline specifically.",
      },
      {
        q: "Corded or cordless?",
        a:
          "Corded machines never run out mid-cycle and have no part that degrades on a calendar. Cordless machines have no cable to " +
          "untangle and can be dropped in and forgotten. The honest trade is that a battery is the one component guaranteed to be worse " +
          "in five years than it is today, and it is rarely user-replaceable.",
      },
      {
        q: "How long should a robotic pool cleaner last?",
        a:
          "The warranty is the only figure anybody will commit to, and it is the number worth comparing: 2 years on the WYBOT C1, " +
          "2.5 on the Dolphin Nautilus CC Plus, 3 on the Aiper Scuba X1 Pro Max, and a 3-year full replacement term on the Beatbot " +
          "AquaSense 2 Ultra. On a machine that lives in chlorinated water, that term is doing real work.",
      },
    ],
    lastReviewed: "2026-08-06",
  },

  /* ------------------------------------------------------------------
     Page 3 of the pool map, and the single biggest wedge in the dataset:
     "cordless robotic pool cleaner", 22,200/mo at KD 0 — three times the
     "best robotic pool cleaner" cluster at a fraction of the difficulty.

     It is a separate URL because the SERP is list content in its own right
     (thepoolnerd, poolbots, Beatbot, Amazon, Reddit) rather than a section
     of the general best-of. The hub explains corded versus cordless as a
     decision and deliberately does not compete for the term.
     ------------------------------------------------------------------ */
  "/best-robots/robotic-pool-cleaners/cordless/": {
    path: "/best-robots/robotic-pool-cleaners/cordless/",
    categorySlug: "robotic-pool-cleaners",
    eyebrow: "Best of · Cordless",
    title: "The best cordless robotic pool cleaners",
    seoTitle: "Best Cordless Robotic Pool Cleaners (2026) — Seven Ranked",
    metaDescription:
      "Seven cordless robotic pool cleaners ranked by pool type, runtime and what they actually reach. Includes the honest case for buying a corded machine instead.",
    standfirst:
      "Cordless means no cable to untangle and no float to position — and one component that is guaranteed to be worse in five years " +
      "than it is today. These seven are ranked by pool, and the last section makes the case for not buying one at all.",
    image: {
      src: "/media/editorial/best-cordless-pool-cleaners.webp",
      alt:
        "A hand lifting a tracked pool cleaner clear of a lit pool at night, water streaming off it and no cable anywhere in the frame.",
      focal: "55% 50%",
    },
    prose: "best-cordless-robotic-pool-cleaners",
    picks: [
      {
        productSlug: "aiper-scuba-s1",
        award: "Best cordless overall",
        why:
          "Floor, walls and waterline, 3-micron filtration and a shallow-ledge claim, at a mid-range price. For a standard in-ground " +
          "pool up to 50 ft this is the cordless machine to beat, and nothing here beats it without costing considerably more.",
        wrongFor:
          "A pool longer than 50 ft, anyone who wants the surface skimmed, or anyone who wants a camera choosing where to clean.",
      },
      {
        productSlug: "wybot-c1",
        award: "Best cheap cordless that climbs",
        why:
          "The cheapest cordless machine here that does walls and waterline rather than just the floor, with a weekly cycle timer that " +
          "genuinely earns its place and a stated 2-year warranty.",
        wrongFor:
          "A pool over 1,615 sq ft, anyone who wants ultra-fine filtration or a camera, or anyone who wants the water surface skimmed.",
      },
      {
        productSlug: "aiper-seagull-se",
        award: "Cheapest cordless",
        why:
          "Ninety minutes on the floor of a small above-ground pool, and nothing else at all. The most honest product at the budget end " +
          "of this market precisely because it does not pretend to climb.",
        wrongFor:
          "An in-ground pool with real walls, a waterline ring, or anyone who wants an app, a schedule or a map.",
      },
      {
        productSlug: "polaris-freedom",
        award: "Best cordless with a dock",
        why:
          "Two and a half hours per charge and a dock it parks itself on, so the machine is never lifted dripping out of the water by " +
          "hand. Floor, walls and waterline, rated to about 50 ft, from a brand American pool owners recognise.",
        wrongFor:
          "Your pool is above ground, deeper than 13 ft, or you keep equipment for a decade and do not want a part that wears out on a calendar.",
      },
      {
        productSlug: "aiper-scuba-v3-ai-vision",
        award: "Best cordless for heavy debris",
        why:
          "A camera recognises debris and steers at it rather than sweeping a pattern and hoping. At 18.1 lb it is also the easiest " +
          "machine here to lift out, which on a cordless robot is a daily consideration rather than a spec.",
        wrongFor:
          "Your pool is above ground, you want a manufacturer-stated maximum pool length or warranty term, or a camera in the water is a line you would rather not cross.",
      },
      {
        productSlug: "aiper-scuba-x1-pro-max",
        award: "Best cordless for a large pool",
        why:
          "Rated to 100 ft, the longest reach here, and the only Aiper that skims the surface as well as the floor, walls and waterline. " +
          "Ultrasonic mapping and a 3-year stated warranty.",
        wrongFor:
          "Your budget is under four figures, your pool already has surface skimming you like, or it is above ground.",
      },
      {
        productSlug: "beatbot-aquasense-2-ultra",
        award: "The cordless ceiling",
        why:
          "Five jobs including water clarification, camera-based pool mapping and a 3-year full replacement warranty — the most machine " +
          "on this page by a distance, rated to 3,875 sq ft of floor per cycle.",
        wrongFor:
          "Modest or above-ground pools, buyers who want skimming without flagship money, or anyone a WYBOT C1 or Aiper Scuba S1 would serve for a fraction of the price.",
      },
    ],
    comparisonSlugs: [
      "aiper-scuba-s1",
      "wybot-c1",
      "aiper-seagull-se",
      "polaris-freedom",
      "aiper-scuba-v3-ai-vision",
      "aiper-scuba-x1-pro-max",
      "beatbot-aquasense-2-ultra",
    ],
    faq: [
      /* THESE TWO ANSWER FROM THE PAGE AND NOWHERE ELSE. FAQ schema is only
         honest where the answer is visible in the article, and both of these
         are lifted from the recall section above. The model numbers are in
         them deliberately: "Aiper recall" without a model number is the exact
         shape of the question that sends somebody to the wrong conclusion. */
      {
        q: "Which Aiper pool cleaners were recalled?",
        a:
          "Two. The Aiper Elite Pro, model GS100, on 24 August 2023 (CPSC recall 23-784), and the Aiper Seagull Pro, model " +
          "ZT6001, on 20 March 2025 (CPSC recall 25-187). Both were charging faults — a battery that could overheat when the " +
          "cord was used without its adapter, and an adapter that could overheat on its own. The CPSC recall database holds no " +
          "other Aiper recall.",
      },
      {
        q: "Is the Aiper Seagull SE part of the recall?",
        a:
          "No. The recalled machine is the Seagull Pro, model ZT6001, which is a different and more expensive product. The names " +
          "are one word apart and that is the whole confusion. The Scuba S1, Scuba V3 AI Vision and Scuba X1 Pro Max are not " +
          "recalled either, and the Scuba S1 is the machine Aiper had to ship to recalled Seagull Pro owners as the remedy.",
      },
      {
        q: "How should you store a cordless pool robot over winter?",
        a:
          "At roughly half charge, indoors, and topped back up every couple of months. Aiper's own instruction is 40-60 percent " +
          "every two months in a cool, well-ventilated place, and never to charge in direct sunlight. A cell left full in a hot " +
          "shed for nine months is being stored in the worst way available to it.",
      },
      {
        q: "Are cordless robotic pool cleaners any good?",
        a:
          "Yes, and they are now the majority of this catalogue — seven of the eleven machines we hold. The compromise is no longer " +
          "cleaning ability: cordless robots here climb walls, scrub the waterline and filter to 3 microns. It is the battery, which is " +
          "the one part guaranteed to hold less charge every season and is rarely user-replaceable.",
      },
      {
        q: "How long does a cordless pool robot run?",
        a:
          "In this catalogue, from 90 minutes on the Aiper Seagull SE to 2 hours 30 on the Polaris FREEDOM. What matters is whether the " +
          "runtime covers your pool in one go — a machine that stops at 80 percent leaves a stripe, and you will be running it twice.",
      },
      {
        q: "Do cordless pool cleaners climb walls?",
        a:
          "Most of these do. The Aiper Seagull SE is the exception and says so: floor only, above-ground pools. Everything else on this " +
          "page claims floor, walls and waterline, and the two flagships add surface skimming.",
      },
      {
        q: "Is cordless better than corded?",
        a:
          "Not automatically. Corded machines have unlimited runtime and no component that degrades on a calendar, which is why the " +
          "Dolphin Nautilus CC Plus is still the machine most American pool owners have met. Cordless wins on handling — no cable to " +
          "untangle, no float to position, nothing to trip over. Buy cordless because the cable is the thing you hate, not because it " +
          "is newer.",
      },
      {
        q: "Can you replace the battery in a cordless pool robot?",
        a:
          "On most of these, not as an owner-serviceable part. That is the whole risk in one sentence, and it is why the warranty term " +
          "matters more here than on a corded machine: 2 years on the WYBOT C1, 3 on the Aiper Scuba X1 Pro Max, and a 3-year full " +
          "replacement term on the Beatbot AquaSense 2 Ultra.",
      },
    ],
    lastReviewed: "2026-08-06",
  },

  /* ------------------------------------------------------------------
     ABOVE-GROUND CLEANERS. Not on the 1 August map — the second pool run
     (6 August, $0.1795) measured "robotic pool cleaner for above ground pool"
     at 2,400/mo, KD 0, $4.30 CPC. The first run saw above-ground at 140 and
     merged it into the best-of as a section, which was right on the number it
     had; this phrasing was simply not in that seed list.

     Second-strongest commercial term in the category after cordless, and the
     only new page here that could be built the same day it was proved: four
     catalogue machines are already rated for above-ground use.
     ------------------------------------------------------------------ */
  "/best-robots/robotic-pool-cleaners/above-ground-pools/": {
    path: "/best-robots/robotic-pool-cleaners/above-ground-pools/",
    categorySlug: "robotic-pool-cleaners",
    eyebrow: "Best of · Above ground",
    title: "Robotic pool cleaners for above-ground pools",
    seoTitle: "Robotic Pool Cleaners for Above-Ground Pools: Four Qualify",
    metaDescription:
      "Which robotic pool cleaner for above ground pools is rated for a vinyl liner: six of the ten we hold are not, and the rating means fit rather than power.",
    standfirst:
      "Most robots are not rated for an above-ground pool, and that is about the liner and the curved join rather than about power. " +
      "Four of the ten cleaners we hold qualify. This is all four, and what actually separates them.",
    image: {
      src: "/media/editorial/above-ground-pool-cleaners.webp",
      alt:
        "A white pool cleaner at the foot of the curved vinyl-liner wall of an above-ground pool in afternoon light, garden furniture behind.",
      focal: "50% 55%",
    },
    prose: "best-above-ground-pool-cleaners",
    picks: [
      {
        productSlug: "wybot-c1",
        award: "Best overall for above ground",
        why:
          "Floor, walls and waterline, cordless, rated to 1,615 sq ft — the largest published capacity of anything here that is " +
          "cleared for vinyl. Adds a weekly cycle timer and a stated 2-year warranty, and it is the cheapest machine in the " +
          "catalogue that climbs at all.",
        wrongFor:
          "A pool over 1,615 sq ft, anyone who wants ultra-fine filtration or a camera, or anyone who wants the water surface skimmed.",
      },
      {
        productSlug: "aiper-scuba-s1",
        award: "Best filtration",
        why:
          "The same three wet surfaces as the WYBOT with 3-micron filtration on top, and the only machine here that publishes a " +
          "length rating — 50 ft — as well as an area. Rated capacity is within fifteen square feet of the C1.",
        wrongFor:
          "A pool longer than 50 ft, anyone who wants the surface skimmed, or anyone who wants a camera choosing where to clean.",
      },
      {
        productSlug: "aiper-seagull-se",
        award: "Best if the floor is the whole job",
        why:
          "Ninety minutes on the floor of a small above-ground pool and nothing else. On a flat vinyl bottom there is nothing to " +
          "climb, so a floor-only machine is not a compromise — it is the shape of the job.",
        wrongFor:
          "An in-ground pool with real walls, a waterline ring, or anyone who wants an app, a schedule or a map.",
      },
      {
        productSlug: "bublue-bubot-800p",
        award: "Best without a battery",
        why:
          "The only corded machine in the catalogue rated for above-ground use, at 1,076 sq ft. Mains power never runs out " +
          "mid-cycle and there is no cell to lose capacity over winters in a garage.",
        wrongFor:
          "A pool much over 1,000 sq ft, anyone who hates cables on principle, or anyone who wants a decade-old brand behind the warranty.",
      },
    ],
    comparisonSlugs: ["wybot-c1", "aiper-scuba-s1", "aiper-seagull-se", "bublue-bubot-800p", "betta-se-plus"],
    faq: [
      {
        q: "Can you use any robotic pool cleaner for above ground pool cleaning?",
        a:
          "No, and it is the most expensive mistake in this category. An above-ground pool has a vinyl liner and a curved join " +
          "where the wall meets the floor. A machine built to grip plaster and climb a vertical wall is working against both. " +
          "Six of the ten cleaners we hold are not rated for above-ground use at all — check the maker says so explicitly rather " +
          "than assuming a smaller pool is an easier job.",
      },
      {
        q: "Do I need one that climbs walls in an above-ground pool?",
        a:
          "Often not. Above-ground walls are vinyl and hold less of a film than plaster or pebble, and on many pools the floor is " +
          "the only thing that genuinely needs a machine. If the walls do stain, the WYBOT C1 and the Aiper Scuba S1 both climb " +
          "and both are rated for the liner.",
      },
      {
        q: "What size robot do I need for a 24 ft round pool?",
        a:
          "A 24 ft round pool is roughly 450 sq ft of floor, which sits comfortably inside every published rating on this page — " +
          "1,615 sq ft on the WYBOT C1, 1,600 on the Aiper Scuba S1 and 1,076 on the BuBlue Bubot 800P. For most above-ground " +
          "pools, size is not the deciding factor and coverage is.",
      },
      {
        q: "Will a robot damage my liner?",
        a:
          "Not one that is rated for it. The rating exists precisely because vinyl is soft and the brushes and weight of an " +
          "in-ground machine are designed against a hard surface. Damage from the wrong machine tends not to show immediately, " +
          "which is why the compatibility rating matters more here than any performance figure.",
      },
    ],
    lastReviewed: "2026-08-06",
  },

  /* ------------------------------------------------------------------
     The solar skimmer best-of, 1 October 2026. Planned on 6 August at 6,600/mo
     for "solar powered pool skimmer" and held on the gate "one product is a thin
     page". The owner chose the four best-selling solar skimmers on Amazon US and
     supplied each listing's images, so the gate is met.

     AWARDS ANSWER A QUESTION, THEY DO NOT CROWN A WINNER. Nobody here has run
     any of the four. The Betta SE Plus has a manufacturer page and manual behind
     it; the other three have a listing. The page says so and the awards are
     worded to match.
     ------------------------------------------------------------------ */
  "/best-robots/robotic-pool-cleaners/solar-powered-skimmers/": {
    path: "/best-robots/robotic-pool-cleaners/solar-powered-skimmers/",
    categorySlug: "robotic-pool-cleaners",
    eyebrow: "Best of · Solar skimmers",
    title: "The best solar powered pool skimmers",
    seoTitle: "Best Solar Powered Pool Skimmers — Four Compared",
    metaDescription:
      "The four best-selling solar pool skimmers on Amazon compared: runtime claims, basket size, sensors and apps, and what each listing does not tell you.",
    standfirst:
      "A solar pool skimmer takes leaves off the surface before they sink, and does nothing else. These four are the best sellers on Amazon US, compared on the claims that matter and on what each maker leaves out.",
    image: {
      src: "/media/editorial/best-solar-pool-skimmers.webp",
      alt:
        "Four solar pool skimmers on labelled cards: the Aiper EcoSurfer S2, the Beatbot iSkim, the BRINBO SK01 beside its app and the Betta SE Plus.",
      focal: "50% 50%",
    },
    prose: "best-solar-pool-skimmers",
    picks: [
      {
        productSlug: "betta-se-plus",
        award: "Best documented",
        why:
          "The only one of the four with a manufacturer's product page and manual to read: a stated one-year warranty, a 200 micron basket, 3.5 hours on the adapter and 5 to 6 on the sun. Betta's 30 hour figure is a claim, but it sits among numbers you can check.",
        wrongFor:
          "Anyone who wants an app or edge following, or a pool in permanent shade.",
      },
      {
        productSlug: "aiper-ecosurfer-s2",
        award: "Best for edges and steps",
        why:
          "Aiper's listing is the most specific about how the machine stays out of trouble: two dToF sensors for walls and corners, and adjustable anti-stranding columns for steps. It also has the 35 hour battery figure, which is a claim.",
        wrongFor:
          "Anyone who needs a published basket volume or warranty term before buying; the listing gives neither.",
      },
      {
        productSlug: "beatbot-iskim",
        award: "Best for heavy debris",
        why:
          "A 9 litre basket, the largest volume any of the four states, behind a covered intake Beatbot says keeps debris in when the machine reverses. For a pool that sheds, fewer trips to empty it is the point.",
        wrongFor:
          "Anyone who needs a stated runtime in hours; the listing gives none.",
      },
      {
        productSlug: "brinbo-sk01",
        award: "One to watch",
        why:
          "An app, two speeds and a stated 2.5 hour adapter charge, with the highest rating of the four. It is also the newest, with 28 ratings, so the rating is an early signal and not a record.",
        wrongFor:
          "Anyone who wants a long record of owner reports, or a brand with a track record in pool robots.",
      },
    ],
    comparisonSlugs: ["betta-se-plus", "aiper-ecosurfer-s2", "beatbot-iskim", "brinbo-sk01"],
    faq: [
      {
        q: "Does a solar pool skimmer work on cloudy days?",
        a:
          "It works from its battery, and the battery is refilled by the panel or, on all four, by a wall adapter. Every maker here claims round-the-clock cleaning, and none of the figures is ours. How long a machine runs after several grey days is the number to look for in owner reviews.",
      },
      {
        q: "Do I still need a robotic pool cleaner if I have a skimmer?",
        a:
          "Yes, if the floor or walls get dirty. A skimmer collects what floats and nothing else. It is a good partner for a floor robot because debris caught at the surface never sinks.",
      },
      {
        q: "Are solar pool skimmers safe in a saltwater pool?",
        a:
          "Two of these four say something about salt: the Betta SE Plus describes salt chlorine tolerant motors and the Beatbot iSkim listing says saltwater-safe. The Aiper and BRINBO listings we read do not say, so check before using one in a salt pool.",
      },
      {
        q: "How do you get a floating skimmer out of the pool?",
        a:
          "Some park themselves. Beatbot says the iSkim parks after cleaning or on one tap in its app, and the BRINBO app shows a park button. The Betta SE Plus runs automatically or from a remote. Otherwise it is a pole or a hand.",
      },
    ],
    contentsFirst: true,
    extraContents: [
      { id: "where-to-buy", text: "Where to buy the four" },
      { id: "more-pool-robots", text: "If the floor is the problem" },
      { id: "faq", text: "Questions people actually ask" },
    ],
    published: "2026-10-01",
    lastReviewed: "2026-10-01",
  },

  /* ------------------------------------------------------------------
     Page 11 of the pool map. 40/mo on the exact phrase, which does not
     justify a URL on its own — but it is the NUMBER ONE People Also Ask
     entry on the 40,500 head term ("Is a robot pool cleaner worth it?").
     That is a featured-snippet and AI-overview play, and the answer has
     to be a real one or it earns nothing.

     No picks. A guide that ranks products is a best-of wearing a hat, and
     it would compete with the two pages above.
     ------------------------------------------------------------------ */
  "/guides/are-robotic-pool-cleaners-worth-it/": {
    path: "/guides/are-robotic-pool-cleaners-worth-it/",
    categorySlug: "robotic-pool-cleaners",
    eyebrow: "Guide",
    title: "Are robotic pool cleaners worth it?",
    seoTitle: "Are Robotic Pool Cleaners Worth It? An Honest Answer",
    metaDescription:
      "Are robotic pool cleaners worth it? For most pools yes, but not for the reason the marketing gives. The four cases where one is the wrong purchase.",
    standfirst:
      "For most in-ground pools, yes: the machine buys back an hour a week and it will still be doing it in three years. " +
      "For four specific situations it is the wrong purchase, and those are worth reading before the ones where it is right.",
    image: {
      src: "/media/editorial/are-pool-cleaners-worth-it.webp",
      alt:
        "A still, spotless infinity pool at sunrise with a robotic cleaner at rest on the step, the job already done.",
      focal: "60% 55%",
    },
    prose: "are-robotic-pool-cleaners-worth-it",
    picks: [],
    comparisonSlugs: [],
    faq: [
      {
        q: "Is a robot pool cleaner worth it?",
        a:
          "For a pool you own and swim in through a full season, yes. A robot turns pool cleaning from a weekly chore into a machine " +
          "you drop in, and unlike a suction cleaner it filters debris out of the water rather than sending it to your pump basket. " +
          "It is not worth it for a small above-ground pool you drain each winter, a pool cleaned by a service you already pay for, " +
          "or a pool whose actual problem is chemistry rather than debris.",
      },
      {
        q: "Are robotic pool cleaners better than suction cleaners?",
        a:
          "They do a different job. A suction cleaner runs off your pump and pushes everything it collects into the pump basket and " +
          "filter, so your filtration system does the work and wears accordingly. A robot has its own motor and its own filter, runs " +
          "independently of the pump, and takes the debris out of circulation.",
      },
      {
        q: "How much does a robotic pool cleaner save?",
        a:
          "Not money directly — time. The saving is roughly an hour a week of brushing and vacuuming across a swimming season, plus " +
          "less load on your pump and filter. Anyone selling you a robot on electricity savings is selling you something else.",
      },
      {
        q: "How long do robotic pool cleaners last?",
        a:
          "Long enough that the warranty is the number to compare, because nobody else will commit to one. Warranty terms across our " +
          "catalogue run from 1 to 3 years, with one 3-year full replacement term. A machine that lives in chlorinated water and is " +
          "lifted out wet is not a decade purchase.",
      },
      {
        q: "Do robotic pool cleaners work on above-ground pools?",
        a:
          "Some do and most do not, and the ones that do are usually floor-only. An above-ground pool has a vinyl liner and a curved " +
          "wall-to-floor join that a machine built for a plaster in-ground pool cannot handle. Check the manufacturer says above-ground " +
          "explicitly rather than assuming it.",
      },
    ],
    lastReviewed: "2026-08-06",
  },

  /* ==================================================================
     LAWN AND COMPANION GUIDES — the first pages on this site published
     for categories with NO PRODUCTS IN THE CATALOGUE.

     That is deliberate and it is the reason all four carry `picks: []`.
     A guide that ranks machines nobody here has checked is a guide
     repeating other people's shortlists, and the one thing this site
     sells is that it does not do that. Each of these answers the
     decision, names what we cannot yet tell the reader, and hands them
     to the hub. When lawn and companion products enter the catalogue,
     the ranked lists arrive here and the "what we cannot tell you"
     sections come out.

     All four were planned before they were written: keywords, links,
     images and schema are in content/seo/page-plan.ts, per BLUEPRINT
     §7. None of them has artwork yet, which page-plan.test.ts prints
     on every run so the gap cannot be forgotten.
     ================================================================== */

  /* ------------------------------------------------------------------
     720/mo at KD 0 on the exact phrase, ~1,670 across the wire-free,
     RTK, GPS and LiDAR phrasings. It is a page rather than a section of
     the hub because it shares only 2/10 domains with "robot lawn mower"
     — a genuinely separate SERP, measured rather than assumed.
     ------------------------------------------------------------------ */
  "/guides/wire-free-robot-lawn-mower/": {
    path: "/guides/wire-free-robot-lawn-mower/",
    categorySlug: "robotic-lawn-mowers",
    eyebrow: "Guide",
    title: "Wire-free robot lawn mowers: RTK, vision or LiDAR",
    seoTitle: "Wire-Free Robot Lawn Mower: Which System Suits Your Garden",
    metaDescription:
      "A wire free robot lawn mower is three navigation technologies sold under one label, and " +
      "tree cover decides between them. When a cable is still better.",
    standfirst:
      "Wire-free is worth paying for when your lawn is going to change, and worth skipping when it is not. " +
      "The three systems sold under that label behave differently under trees, which is the thing that actually decides it.",
    image: {
      src: "/media/editorial/wire-free-mowers.webp",
      alt:
        "A robot mower at the edge of a flower bed on unmarked lawn with no boundary wire visible anywhere, an antenna on a post behind.",
      focal: "50% 60%",
    },
    prose: "wire-free-robot-lawn-mower",
    picks: [],
    comparisonSlugs: [],
    faq: [
      {
        q: "Is there a robot lawn mower without boundary wire?",
        a:
          "Several, and they use one of three systems. RTK satellite pairs a receiver on the mower with a fixed antenna on the house " +
          "and holds a line to a few centimetres. Camera-based machines read the edge of the grass visually. LiDAR builds a laser map " +
          "of solid objects around it. Satellite systems need a clear view of the sky; the other two do not.",
      },
      {
        q: "Do wire-free robot mowers work under trees?",
        a:
          "Camera and LiDAR systems do. Satellite systems, which is most of what is sold, lose accuracy under a canopy and will " +
          "usually stop and report an error rather than mow blind. If mature trees cover much of the lawn, a boundary wire is more " +
          "dependable than an RTK machine costing several times as much.",
      },
      {
        q: "How accurate is RTK on a robot mower?",
        a:
          "A few centimetres with a clear sky, which is close enough to mow to a border without a physical edge. Manufacturers publish " +
          "that figure and not the one that matters more: what happens when the fix degrades. Expect a machine that halts rather than " +
          "one that wanders, and expect to fetch it.",
      },
      {
        q: "Is wire-free worth the extra money?",
        a:
          "If you rearrange your garden, or it splits into separate zones, yes — moving a boundary becomes a line you drag on a phone " +
          "instead of an afternoon with a pegging tool. For a small rectangle you have no plans to change, no. The cut is identical " +
          "either way, because navigation decides where the machine goes rather than what it does to the grass.",
      },
      {
        q: "Can I add wire-free navigation to a wired mower?",
        a:
          "No. The navigation system is designed into the machine, and no manufacturer sells an upgrade. Buying a wired mower is a " +
          "decision about the next several years of that lawn, which is why the tree question is worth settling before you order.",
      },
    ],
    lastReviewed: "2026-08-06",
  },

  /* ------------------------------------------------------------------
     390/mo at KD 11 on the exact phrase, and it carries the price
     cluster: "robot lawn mower price" (1,900) and "robotic lawn mower
     price" (1,600) sit here rather than on the hub, because a
     price-first searcher wants the cheap end explained, not a category
     overview. The closest call of the three lawn guides — 4/10 shared
     domains with "best robot lawn mower" — and the first to fold back
     into the hub if it underperforms.
     ------------------------------------------------------------------ */
  "/guides/cheap-robot-lawn-mower/": {
    path: "/guides/cheap-robot-lawn-mower/",
    categorySlug: "robotic-lawn-mowers",
    eyebrow: "Guide",
    title: "Cheap robot lawn mowers: what you give up, and what you do not",
    seoTitle: "Cheap Robot Lawn Mower: What the Low End Actually Costs You",
    metaDescription:
      "The expensive part of a cheap robot lawn mower is navigation, not cutting. What a budget " +
      "machine gives up, and where a low price stops being a bargain.",
    standfirst:
      "The cheapest sensible machine is small, wired and single-zone, and the saving is real — because every mower " +
      "in this category cuts to much the same standard. What you give up is area, zones and slope.",
    image: {
      src: "/media/editorial/cheap-mowers.webp",
      alt:
        "A small plain robot mower on an ordinary suburban back lawn beside a pebbledashed house and a wooden bench, deliberately unglamorous.",
      focal: "50% 60%",
    },
    prose: "cheap-robot-lawn-mower",
    picks: [],
    comparisonSlugs: [],
    faq: [
      {
        q: "How much is a cheap robot lawn mower?",
        a:
          "Entry machines are a small fraction of what a wire-free model costs, and the gap is navigation rather than cutting quality. " +
          "We do not print figures in guides, because this category discounts hard in late summer and any number written here is wrong " +
          "by the time you read it. Prices sit on product pages with the date they were checked beside them.",
      },
      {
        q: "What is the catch with a budget robot mower?",
        a:
          "Three things, consistently. You lay a boundary wire around the lawn yourself. You get one zone, so a front and back lawn " +
          "split by a driveway means carrying the machine. And you get a modest slope rating, which is the one limit you cannot work " +
          "around. None of those affect the cut.",
      },
      {
        q: "Do cheap robot mowers cut as well as expensive ones?",
        a:
          "Yes, on grass they can keep up with. Every machine here takes a few millimetres off frequently and mulches the clippings " +
          "back, and a lawn kept at one height looks better than one cut weekly regardless of price. What you pay for is area, terrain " +
          "and how the mower knows where the lawn ends.",
      },
      {
        q: "How long do budget robot mowers last?",
        a:
          "Compare the warranty, because it is the only commitment anybody makes. Blades are a consumable on every machine at every " +
          "price, so check the manufacturer publishes a parts listing before buying — a mower you cannot re-blade is disposable, and " +
          "that is a bigger risk at the bottom of the market than any battery.",
      },
      {
        q: "Is a cheap robot mower better than a push mower?",
        a:
          "For a small flat lawn you would otherwise cut weekly, yes, and the argument is time rather than quality. For a lawn you " +
          "enjoy mowing, or one with a bank in it, no. The budget end of this market has no answer to a slope and buying one anyway " +
          "is the most common regret in the category.",
      },
    ],
    lastReviewed: "2026-08-06",
  },

  /* ------------------------------------------------------------------
     200/mo, the smallest of the three, and the one with the clearest
     reason to exist: "best robot lawn mower for hills" shares 7/10
     domains with "do robot lawn mowers work on hills" and only 3/10
     with "best robot lawn mower". The two hills queries are one page,
     and that page is not the hub.
     ------------------------------------------------------------------ */
  "/guides/robot-lawn-mower-for-hills/": {
    path: "/guides/robot-lawn-mower-for-hills/",
    categorySlug: "robotic-lawn-mowers",
    eyebrow: "Guide",
    title: "The best robot lawn mower for hills starts with your gradient",
    seoTitle: "Best Robot Lawn Mower for Hills: Measure the Slope First",
    metaDescription:
      "The best robot lawn mower for hills is decided by gradient, the one constraint you cannot " +
      "work around. How to measure yours, and when the answer is none.",
    standfirst:
      "Measure the gradient before you shop for anything else. Area you can compromise on and navigation you can choose, " +
      "but a machine that cannot hold your bank will never learn to.",
    image: {
      src: "/media/editorial/mowers-for-hills.webp",
      alt:
        "A robot mower part-way up a visibly steep grass bank shot from below so the gradient reads, a house at the top and woodland beyond.",
      focal: "50% 50%",
    },
    prose: "robot-lawn-mower-for-hills",
    picks: [],
    comparisonSlugs: [],
    faq: [
      {
        q: "What slope can a robot lawn mower handle?",
        a:
          "Ratings run from modest gradients at the budget end to around 45 per cent on machines built for it, and the figure is " +
          "always measured on dry grass. Wet grass carries roughly two-thirds of the traction, so buy at least ten percentage points " +
          "of headroom above the steepest metre of your lawn rather than above its average.",
      },
      {
        q: "How do I measure the slope of my lawn?",
        a:
          "Run a straight plank up the bank, put a spirit level on it, and measure the drop at one end against the plank's length. " +
          "Rise divided by run, times a hundred, gives you per cent. A phone inclinometer laid on the same plank does it faster. " +
          "Check which unit a manufacturer quotes, because 35 degrees and 35 per cent are different hills.",
      },
      {
        q: "Do robot lawn mowers work on hills at all?",
        a:
          "On a bank you can walk across comfortably, yes. Above roughly 50 per cent on any part of the lawn, nothing in this " +
          "category is a safe bet and a strimmer on a pole is the honest tool. A terraced garden with retaining walls between levels " +
          "is a multi-zone problem before it is a gradient one.",
      },
      {
        q: "What makes a robot mower climb better?",
        a:
          "Wheel tread and diameter, weight over the driven wheels, and whether all four wheels drive. The first is visible in a " +
          "photograph, which makes it the easiest thing to check before you buy. Light machines with smooth tyres slip regardless of " +
          "what the specification claims.",
      },
      {
        q: "Why does my robot mower scalp the lawn on the slope?",
        a:
          "The deck rides differently going downhill and a low cutting height takes the crown off the bank. Setting the height about " +
          "ten millimetres above what you use on the flat fixes most of it. Bald patches where the wheels sit are a different problem " +
          "— that is slip, and it means the machine is at or past its gradient limit.",
      },
    ],
    lastReviewed: "2026-08-06",
  },

  /* ------------------------------------------------------------------
     ~1,090/mo across four phrasings, every one at KD 0, and a genuinely
     different reader from the hub's: somebody buying for another person,
     often at a distance, sometimes for a care setting. The hub cedes
     "robotic pet for elderly" here rather than keeping it as a
     secondary, because two of our own pages in one result set is a
     result only one of them can win.
     ------------------------------------------------------------------ */
  "/guides/robotic-pets-for-elderly/": {
    path: "/guides/robotic-pets-for-elderly/",
    categorySlug: "companion-robots",
    eyebrow: "Guide",
    title: "Robotic pets for elderly relatives: choosing one honestly",
    seoTitle: "Robotic Pet for Elderly Relatives: How to Choose One",
    metaDescription:
      "Three robotic pets for elderly owners are sold as one idea and answer three different " +
      "problems. What the research supports, and when not to buy at all.",
    standfirst:
      "Buy the simplest machine that fixes the one thing you are actually trying to fix, and buy it for a person rather than " +
      "for a diagnosis. Three quite different products are sold to this reader, and picking the wrong one is the usual mistake.",
    image: {
      src: "/media/editorial/robotic-pets-for-elderly.webp",
      alt:
        "An older person's hands resting on a white robotic cat curled in their lap in a warm lamp-lit sitting room, no face in frame.",
      focal: "50% 50%",
    },
    prose: "robotic-pets-for-elderly",
    figures: [
      {
        afterHeading: "The three things being sold",
        src: "/media/companion/joy-for-all/panel-overview.webp",
        caption:
          "The Joy For All cat, which is the simplest of the three and the one this page ends up recommending. The line describing it is Ageless Innovation's own marketing wording.",
      },
      {
        afterHeading: "Which one we recommend, and why it is this one",
        src: "/media/companion/joy-for-all/card.webp",
        caption:
          "Silver with white mitts, the colourway we hold. The comfort and mood claims printed on this artwork are Ageless Innovation's own, supplied with it — this page recommends the cat on the evidence set out above, not on those panels.",
      },
    ],
    /* THE ONE GUIDE ON THIS SITE THAT CARRIES A PICK, and the exception is
       deliberate rather than drift. The convention above — guides recommend
       nothing and send the reader to a page that does — assumes such a page
       exists. Here it does not, and cannot: "joy for all companion pet" shares
       FIVE of ten top-ten domains with this page's own primary term, so the
       Joy For All review that was planned was cancelled rather than deferred.
       Building it would have put two BotPlanet pages into one result set.

       This page was written in August waiting for exactly this product. Its
       own note read "Joy for All and Tombot Jennie are the obvious candidates
       and neither is in the catalogue". Tombot takes waitlist deposits and
       cannot be sold. Joy For All can, and now is.
       See docs/seo/companion-products-build-plan.md. */
    picks: [
      {
        productSlug: "joy-for-all-companion-pets",
        award: "The one to buy for most people",
        why:
          "It answers this page's own checklist better than anything else sold to this reader. Four C batteries, included, and no " +
          "charging dock for anybody to remember. No app, no account, no home network. Synthetic fur over a 1 kg body that sits in a " +
          "lap, and sensors that respond to motion and touch with head and paw movements, meows and a purr you can feel. Ageless " +
          "Innovation has been selling these to care settings for years, and 12,307 Amazon ratings averaging 4.5 is the largest body " +
          "of real feedback on any product in this category.",
        wrongFor:
          "Somebody who would find a pretend cat patronising rather than comforting — which is a real reaction and worth asking about " +
          "first. Also anyone hoping for conversation, reminders or a way to check in from a distance: this machine does none of those " +
          "and is better for it.",
      },
    ],
    /* One slug, matching the one pick. The comparison table on a page with a
       single recommendation is a specification card rather than a comparison,
       and that is the honest shape here: there is nothing else in the
       catalogue sold to this reader. Miko, Vector, Eilik and Loona are all in
       companion robots and none of them belongs on a page about buying for an
       older relative — declaring the list rather than filtering the category
       is what stops them appearing. */
    comparisonSlugs: ["joy-for-all-companion-pets"],
    faq: [
      {
        q: "Do robotic pets help people with dementia?",
        a:
          "The evidence supports a modest, real effect: studies in care settings report less agitation, better mood and more social " +
          "interaction. It is measured mostly on wards rather than in a house where somebody lives alone, and it says a person with " +
          "something to stroke is calmer than a person with nothing — a smaller claim than the marketing makes, and a useful one.",
      },
      {
        q: "What is the best robotic pet for an elderly person?",
        a:
          "Usually the simplest one. Battery-powered, fur-covered, responds to touch, with no screen, no app and nothing to log into. " +
          "A machine that has to be understood before it can be enjoyed has already failed this reader. On that test the Joy For All " +
          "Companion Pet Cat is the one we recommend: four C batteries rather than a dock, no app and no account, and fur over a " +
          "one-kilogram body that sits in a lap.",
      },
      {
        q: "Is a robotic pet or a care robot better for an older relative?",
        a:
          "They solve different problems. A robotic animal answers loneliness and agitation. A care robot with a screen and a voice " +
          "answers communication and reminders, and only works if the person will talk to a machine at all. If your real motivation is " +
          "checking in from a distance, buy a monitoring device and call it that.",
      },
      {
        q: "What should I check before buying one?",
        a:
          "Weight in the lap, replaceable batteries rather than a charging dock somebody has to remember, sound that turns genuinely " +
          "low, no account or home network required, and a cover that comes off to be washed. Then ask what happens to the machine if " +
          "the company behind it stops trading, because several here are services as much as products.",
      },
      {
        q: "Can a robotic pet upset someone?",
        a:
          "Yes, and it is worth taking seriously. Handing an adult a toy animal implies something about how you see them. Give it " +
          "without ceremony and give it a name rather than a purpose. If the person has said they do not want one, that settles it — " +
          "no specification outweighs it.",
      },
    ],
    lastReviewed: "2026-08-06",
  },

  /* ==================================================================
     THE WINDOW BEST-OF. Page 2 of the window map, ruled CREATE by the
     research run of 5 August 2026 and then left unbuilt while eleven
     reviews went live beneath it.

     IT WAITED FOR A REASON, and the reason was fixed first. Until
     7 August none of those eleven reviews had a working buy button —
     buildOffers could not see a window product — so a shortlist
     funnelling into them would have sent every commercial click to a
     page with nothing to click. The offer path was repaired, all
     eleven redirects verified live against production, and then this
     page was written.

     NINE PICKS OUT OF ELEVEN HELD. The W1 PRO and the HOBOT 298 are
     named on the page and given no award. Both are beaten on price and
     on published evidence by machines already on the list, and an
     award invented so that every product has one is an advert. They
     stay in comparisonSlugs so the table still shows all eleven.
     ================================================================== */
  /* THE ENABOT RANGE PAGE. Not a category best-of and not a single review —
     one manufacturer's seven machines, explained.

     "enabot" measures 9,900/mo at KD 4 against 480 for "pet camera robot",
     which the hub owns. Its SERP shares three domains with the hub and all
     three are amazon, instagram and reddit; discount the universal ones and
     the overlap is zero. Against the Air 2 review it shares five, four of
     which are amazon, instagram, reddit and facebook. Separate page on both
     counts. See docs/seo/pet-camera-robots-findings.md.

     THE GAP IS SPECIFIC: every editorial slot on that SERP reviews ONE model.
     Nobody has written the page that explains the range. */
  "/robots/pet-camera-robots/enabot/": {
    path: "/robots/pet-camera-robots/enabot/",
    categorySlug: "pet-camera-robots",
    eyebrow: "Range guide",
    title: "Enabot: which of the seven is the one to buy",
    seoTitle: "Enabot Review 2026: Which EBO Should You Actually Buy",
    metaDescription:
      "Enabot sells seven driving pet cameras and the names do not " +
      "explain themselves. What each one adds, and the three worth buying.",
    standfirst:
      "Enabot is effectively the whole driving-pet-camera market in the US, and it sells seven machines whose names give almost nothing away. " +
      "The short version: the Air 2 is the one to buy, the SE is the one that fits under furniture, and everything above the PetPal is buying resolution rather than a better robot.",
    prose: "enabot-range",
    picks: [
      {
        productSlug: "enabot-ebo-air-2",
        award: "The one to buy",
        why:
          "2K, night vision, tracked wheels that cross rugs and thresholds, two-way talk, and it drives itself back to the dock when the battery is low. " +
          "It sits in the middle of the range and gives up nothing that matters — the three models above it buy resolution and a chatbot, not a better robot.",
        wrongFor:
          "A house where the animal is upstairs, or anyone who wants the treat dispenser. It has wheels, and nothing in this category climbs.",
      },
      {
        productSlug: "enabot-ebo-se",
        award: "Best cheap one, and the one that fits under things",
        why:
          "3.5 inches tall, which is the only measurement that matters when the cat is under the sofa. 1080p instead of 2K and no emoticon face; everything else survives the saving, " +
          "including the 360-degree view, the night vision and the self-docking.",
        wrongFor:
          "Anyone watching on a large screen, where 1080p driven around a dim room runs out of pixels.",
      },
      {
        productSlug: "enabot-rola-petpal",
        award: "Best for dogs",
        why:
          "The only machine here that drives to the animal and then gives it a treat. Furbo throws from a shelf and every other Enabot drives without treats; this does both, at 2.5K, for less than the mid-range models above it.",
        wrongFor:
          "Cats, mostly — it is three times the footprint of the Air 2 and cannot follow them under furniture.",
      },
    ],
    comparisonSlugs: ["enabot-ebo-air-2", "enabot-ebo-se", "enabot-rola-petpal"],
    faq: [
      {
        q: "Which Enabot should I buy?",
        a:
          "The EBO Air 2 for most people: 2K, night vision, tracked wheels and self-docking, with nothing important missing. Buy the EBO SE instead if your pet hides under " +
          "furniture, because it is the only one low enough to follow. Buy the ROLA PetPal if you want to give a dog a treat from the app.",
      },
      {
        q: "Do Enabot robots need a subscription?",
        a:
          "No. We read every current listing on 8 August 2026 and none of them carries one, and the ROLA PetPal's own Q&A answers the question outright. That is unusual in this market — " +
          "Furbo and Petcube both sell monthly plans for features Enabot includes.",
      },
      {
        q: "What is the difference between the EBO Air 2, the Air 2S and the Air 2 Plus?",
        a:
          "Resolution and software. The Air 2 is 2K, the Air 2S is 2.5K, and the Air 2 Plus is 3K with a GPT and Gemini chat mode. All three drive identically. " +
          "You are paying more than twice the price of the entry model for a sharper picture and a chatbot, not for a robot that gets to more places.",
      },
      {
        q: "Can an Enabot climb stairs?",
        a:
          "No, and neither can anything else sold in this category. Every driving pet camera on the US market is a wheeled machine. It patrols whichever floor you leave it on, which is " +
          "fine when you know it and the most common disappointment when you do not.",
      },
      {
        q: "What happened to the EBO Air and the EBO X?",
        a:
          "Both are discontinued. We checked every Enabot listing on Amazon US on 8 August 2026 and found neither. The EBO Air was replaced by the Air 2, which is why searches for the " +
          "old model now return Air 2 results.",
      },
      {
        q: "Is the ROLA Mini the same as the ROLA PetPal?",
        a:
          "No, and the shared name is the trap. The ROLA Mini is cheaper and has no treat dispenser. The dispenser is the only reason to pay the difference for the PetPal, so check the full model " +
          "name before ordering.",
      },
    ],
    lastReviewed: "2026-08-08",
  },

  /* "/best-robots/window-cleaning-robots/" WAS HERE UNTIL 12 AUGUST 2026.

     It ranked nine of the eleven window machines and named two it would not
     recommend, and it should never have been a separate URL: the window hub's
     own keyword register row already recorded that "window cleaning robot" and
     "best window cleaning robot" return six of the same top ten results, and
     ruled that a best-of "would have competed with this one for the same
     result set". This page was built five days later anyway.

     Folded into /robots/window-cleaning-robots/ rather than deleted. The
     recommendation now sits in that hub's price ladder, where a reader is
     choosing by budget; the headline answer and the two non-recommendations
     are its first FAQ; the one-side-at-a-time limit and the noise are in the
     coverage rows and the verdict; and its hero illustration is the coverage
     section's picture. The URL is an alias of the hub — see routes.ts.
     ------------------------------------------------------------------ */

  /* ------------------------------------------------------------------
     BEST ROBOT LAWN MOWER, built 11 August 2026.

     WHY THIS GETS ITS OWN URL WHEN THE LITTER EQUIVALENT DOES NOT. The
     August research measured SERP overlap for both. "robot lawn mower"
     and "best robot lawn mower" share 2 of 10 top-ten domains — two
     different results pages, so two pages. The litter pair shares 7 of
     10, and that research explicitly ruled "separate best-of page: the
     hub carries it". Same question, opposite answers, because the
     evidence differed rather than because the categories feel
     different.

     5,400/mo at KD 8 on the primary, against the hub's 74,000 at KD 36
     — the easier half of the category's demand, which is the same
     reason the hub itself is written around the winnable phrasings.

     SIX PICKS FOR SIX JOBS, and the awards are all shaped "best for X"
     rather than "runner up". A ranking that orders machines by overall
     goodness is answering a question nobody has: everyone arrives with
     an area and a slope, and those two numbers rule out most of the
     list before preference gets a say.
     ------------------------------------------------------------------ */
  "/best-robots/robotic-lawn-mowers/": {
    path: "/best-robots/robotic-lawn-mowers/",
    categorySlug: "robotic-lawn-mowers",
    eyebrow: "Best of",
    title: "The best robot lawn mower for your lawn, ranked",
    seoTitle: "Best Robot Lawn Mower 2026: Ranked by Area and Slope",
    metaDescription:
      "The best robot lawn mower for each job, ranked on the two numbers that rule " +
      "machines out: how much grass you have, and how steep the worst bit is.",
    standfirst:
      "Two measurements settle this category and neither is a feature: the square footage of your lawn, and the gradient of its worst slope. " +
      "Get those and the six machines below shorten to about two.",
    /* Its own hero since 11 August. It borrowed the lawn hub's until then,
       which meant the hub and the shortlist opened on the same picture. The
       slope is deliberate: this page rules machines out on area and gradient,
       and gradient is the number that eliminates four of the six below. */
    image: {
      src: "/media/editorial/best-lawn-mowers.webp",
      alt:
        "An unbadged silver robot mower working across a steep grass bank at " +
        "night with its headlamps on, the slope falling away to a lit lakeside " +
        "town and mountains far below, and a modern glass house above it.",
      focal: "55% 60%",
    },
    prose: "best-robot-lawn-mowers",
    picks: [
      {
        productSlug: "worx-landroid-vision-wr320",
        award: "Best overall",
        why:
          "Half an acre of rated area at a price the rest of this list does not approach — the next cheapest machine rated for the same ground costs nearly two and a half times as much. Camera navigation with no antenna to mount and no wire to bury, which removes the installation day that puts most people off this category.",
        wrongFor:
          "Any slope past 30%, which is outside its rating — and anyone who wants a published runtime figure before spending that much outdoors, because WORX does not print one.",
      },
      {
        productSlug: "mammotion-luba-3-awd-1500h",
        award: "Best for a steep lawn",
        why:
          "Eighty per cent — 38.6 degrees — on all four driven wheels, navigating by LiDAR and cameras rather than satellites. Steep gardens are usually wooded gardens, and that pairing is what keeps working under a canopy. Two sizes, 0.37 and 0.75 of an acre.",
        wrongFor:
          "A flat lawn, where the all-wheel drive is dead weight you are financing and the WORX covers more ground for a fraction of the outlay.",
      },
      {
        productSlug: "dreame-a3-awd-1000",
        award: "Best steep lawn under a quarter acre",
        why:
          "The same eighty per cent climb as the Mammotion for several hundred dollars less, on the same LiDAR-first navigation. If your slope is severe and your lawn is small, this is the cheaper of the only two machines that qualify.",
        wrongFor:
          "More than 10,764 sq ft, which is its ceiling — and any flat lawn, where the Segway covers a quarter acre for less.",
      },
      {
        productSlug: "husqvarna-automower-410iq",
        award: "Best for an awkwardly shaped lawn",
        why:
          "The only maker here that publishes its rated area twice — half an acre in a sensible shape, a quarter in an irregular one — which is the most honest specification in the category. Four years of warranty, against silence from most of this list.",
        wrongFor:
          "A bank of any seriousness: 45% inside the area and 15% at the boundary, against 80% for the two all-wheel-drive machines. And any budget the WORX would satisfy.",
      },
      {
        productSlug: "segway-navimow-i110n",
        award: "Best open quarter acre",
        why:
          "Network RTK with no antenna to mount and no subscription — Segway carries the cellular data cost, which nobody else here does. VisionFence handles obstacles on top of the positioning.",
        wrongFor:
          "A lawn under mature trees, where satellite positioning fails outright and no setting recovers it. Also anyone who cuts below two inches.",
      },
      {
        productSlug: "eufy-e15",
        award: "Best small lawn under trees",
        why:
          "Pure vision navigation: no boundary wire, no antenna, no satellites, so a canopy is not a problem and there is nothing to install. eufy publishes the cutting height range, the slope limit and the noise figure, which several makers here do not.",
        wrongFor:
          "More than 8,611 sq ft or any slope past 18 degrees — the tightest pair of limits in this list — and a lawn you like cut above three inches.",
      },
    ],
    comparisonSlugs: [
      "worx-landroid-vision-wr320",
      "mammotion-luba-3-awd-1500h",
      "dreame-a3-awd-1000",
      "husqvarna-automower-410iq",
      "segway-navimow-i110n",
      "eufy-e15",
    ],
    faq: [
      {
        q: "What is the best robot lawn mower?",
        a:
          "For a flat lawn up to half an acre, the WORX Landroid Vision WR320 — nothing else here is rated for that much ground at anywhere near the price. It is also the best robotic lawn mower here for anyone who wants nothing to install. For a steep lawn it is the Mammotion LUBA 3 AWD, or the Dreame A3 AWD 1000 if the lawn is under a quarter acre. Area and slope decide it before any feature does.",
      },
      {
        q: "What size robot lawn mower do I need?",
        a:
          "Measure your lawn in square feet and buy a machine rated above it. A rated area is a ceiling rather than a target: a mower rated for less ground than you have does not cut more slowly, it never finishes. Half an acre is 21,780 sq ft and a quarter is 10,890, and every machine here publishes its own figure.",
      },
      {
        q: "Do robot lawn mowers work on slopes?",
        a:
          "Up to their published gradient and not past it. The two all-wheel-drive machines here claim eighty per cent — about 38.6 degrees — and the rest sit between eighteen degrees and forty-five per cent. Go and look at the steepest part of your lawn: if a wheelbarrow feels unwise you are above thirty per cent, and most of this list is already out.",
      },
      {
        q: "Do I still need a boundary wire?",
        a:
          "Not for any machine on this list. Three navigate by satellite positioning, two by camera and one by LiDAR, and none needs a cable buried around the perimeter. What that trades away is different per machine: satellite positioning fails under trees, and camera navigation depends on being able to see.",
      },
      {
        q: "Will a robot mower cut right up to the edge?",
        a:
          "No, and no maker publishes how close in inches. A round or square deck cannot reach against a wall, a fence or a border, so a margin is left everywhere the lawn meets something solid. Plan on a strimmer a few times a season whichever machine you buy.",
      },
      {
        q: "Where can I read the full robot lawn mower reviews?",
        a:
          "Every mower ranked here has its own review with the manufacturer's published figures, what we could not establish, and who should not buy it. The comparison table puts them side by side on the specifications that actually differ.",
      },
    ],
    lastReviewed: "2026-08-11",
  },

  /* ------------------------------------------------------------------
     Page 9 of the window map, and the last of it. Three query families
     merged into one page — "do window cleaning robots work" (90), "how
     do..." (40) and "are... worth it" (30) — because there is one intent
     behind all three: somebody who has seen these advertised and does
     not believe them yet.

     NO PICKS, AND FOR THE POOL GUIDE'S REASON RATHER THAN THE LAWN
     GUIDES'. There are eleven machines in this catalogue and they are
     ranked on the best-of. A guide that also named a winner would split
     one argument across two URLs competing for one result.

     THE ANSWER HAS TO CONTAIN A REAL NO. The SERP is Reddit and forums:
     people asking each other whether these are a gimmick. A page that
     answers "yes, absolutely!" loses to a thread where somebody says
     the edges are rubbish — because the edges ARE rubbish, and that is
     the finding this page leads with.
     ------------------------------------------------------------------ */
  "/guides/do-window-cleaning-robots-work/": {
    path: "/guides/do-window-cleaning-robots-work/",
    categorySlug: "window-cleaning-robots",
    eyebrow: "Guide",
    title: "Do window cleaning robots work?",
    seoTitle: "Do Window Cleaning Robots Work? The Honest Answer",
    metaDescription:
      "Do window cleaning robots work? Yes in the middle of the pane, no at the edges. How they " +
      "hold on, what stops them falling, and when not to buy one.",
    standfirst:
      "Yes in the middle of the pane, no at the edges — and that one sentence is the whole honest review of this category. " +
      "Whether it is worth it comes down to how much glass you own.",
    image: {
      src: "/media/editorial/do-window-robots-work.webp",
      alt:
        "A wide window half cleaned, the left side still hazy with rain marks and dust and the right side clear onto a city skyline, the robot sitting on the boundary between them.",
      focal: "50% 50%",
    },
    prose: "do-window-cleaning-robots-work",
    picks: [],
    comparisonSlugs: [],
    faq: [
      {
        q: "How do window cleaning robots work?",
        a:
          "A fan pulls air out from underneath the machine, which lowers the pressure inside and lets the atmosphere press it against the glass. It is suction, not magnetism or adhesive. Two pads underneath do the cleaning, wet by a fine spray, while the machine drives itself over the pane in a pattern.",
      },
      {
        q: "Are window cleaning robots worth it?",
        a:
          "For a house with a lot of glass, yes — but not because the finish is better. It is that the windows get cleaned at all. Glass done often at ninety per cent looks considerably better than glass done perfectly twice a year. For a flat with four windows, buy a squeegee: the setup takes longer than the job.",
      },
      {
        q: "Do they leave streaks?",
        a:
          "In direct sun, yes, because the spray dries before the pad reaches it — the same reason you are told not to wash a car in sunlight. Clean on an overcast day or out of direct light and most complaints about streaking go away. What does not go away is the last centimetre against the frame.",
      },
      {
        q: "Will it fall off my window?",
        a:
          "It should not, and two systems exist so it does not. An internal battery keeps the fan turning after a power cut — the number to compare is how many minutes it holds, and many makers do not publish it. The second is a physical safety rope, which ships with every machine and should be anchored on every window above the ground floor, every time.",
      },
      {
        q: "Can they clean the outside of upstairs windows?",
        a:
          "Only if the window opens inwards far enough for you to place the machine on the outer face and attach the rope. These clean one side at a time. Nothing we hold does both faces at once, and no magnetic robot that would is currently sold in the US — a genuine gap in the market rather than in our catalogue.",
      },
      {
        q: "Do they work on frameless glass?",
        a:
          "Most of the machines we hold do, and some do not. A robot that navigates by feeling for a frame will drive off the edge of a pane that has none, so where a maker does not claim frameless glass explicitly, treat the silence as the answer rather than an oversight.",
      },
    ],
    lastReviewed: "2026-08-07",
  },
};

export function editorialFor(path: string | undefined): EditorialContent | undefined {
  return path ? EDITORIAL[path] : undefined;
}

/** Every editorial page belonging to a category, in registry order. */
export function editorialForCategory(categorySlug: string): EditorialContent[] {
  return Object.values(EDITORIAL).filter((e) => e.categorySlug === categorySlug);
}
