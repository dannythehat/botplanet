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
  /** Markdown file basename in src/articles/, without the extension. */
  prose: string;
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
      "Nine machines ranked by what they are actually for — floor, walls, waterline, above-ground, big pools and heavy debris. Every pick names who should not buy it.",
    standfirst:
      "There is no single best robotic pool cleaner, and any list that gives you one has decided your pool for you. " +
      "These nine are ranked by the job they do best, and each one says plainly who should not buy it.",
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
    seoTitle: "Robotic Pool Cleaners for Above-Ground Pools — Only Four Qualify",
    metaDescription:
      "Six of the ten machines we hold are not rated for a vinyl liner at all. Here are the four that are, what separates them, and why the rating is a compatibility claim rather than a performance one.",
    standfirst:
      "Most robots are not rated for an above-ground pool, and that is about the liner and the curved join rather than about power. " +
      "Four of the ten cleaners we hold qualify. This is all four, and what actually separates them.",
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
      "For most pools, yes — but not for all of them, and not for the reason the marketing gives. The four cases where a robot is the wrong purchase, stated plainly.",
    standfirst:
      "For most in-ground pools, yes: the machine buys back an hour a week and it will still be doing it in three years. " +
      "For four specific situations it is the wrong purchase, and those are worth reading before the ones where it is right.",
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
};

export function editorialFor(path: string | undefined): EditorialContent | undefined {
  return path ? EDITORIAL[path] : undefined;
}

/** Every editorial page belonging to a category, in registry order. */
export function editorialForCategory(categorySlug: string): EditorialContent[] {
  return Object.values(EDITORIAL).filter((e) => e.categorySlug === categorySlug);
}
