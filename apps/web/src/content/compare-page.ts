/* ============================================================
   Comparison-hub content, keyed by category slug.

   PAGE 4 OF THE POOL MAP, and the last one on it that was still a
   stub. `/compare/<category>/` has existed since launch as a bare
   table with an H1 over it — no argument, no keyword row, no
   schema, and a price column publishing figures a best-of page is
   not allowed to print.

   WHY THIS IS A HUB AND NOT A SET OF PAIR PAGES. The 1 August run
   measured `aiper vs dolphin` at 110/mo and `dolphin vs polaris`
   at 30, and the exact model-pair phrases at no measurable volume
   at all. Ruling 3 in docs/seo/pool-research-findings.md: brand-
   vs-brand intent is owned by ONE hub with a section per pair, and
   pair URLs return only if demand appears. Nine pair pages built
   on 110 searches between them would be nine thin pages competing
   with each other.

   A CATEGORY WITHOUT A RECORD HERE STILL GETS A COMPARISON PAGE —
   the table, generated from its catalogue. That is the honest
   floor: window has eleven products and no comparison research, so
   it gets the table and no argument, rather than an argument
   nobody measured.
   ============================================================ */

import type { FaqItem } from "../components/FaqList.astro";
import type { HeroImage } from "../components/CategoryHero.astro";

/** One brand-versus-brand section. Never its own URL. */
export interface BrandPair {
  /** Anchor id, e.g. "aiper-vs-dolphin". */
  id: string;
  /** The H3, in the phrasing people search. */
  heading: string;
  /** Measured US volume for the pair phrase, 0 where it was not measured. */
  volume: number;
  /** The answer first — one sentence, before the reasoning. */
  verdict: string;
  /** Two or three sentences of reasoning. Facts traceable to the catalogue. */
  body: string;
  /** The machine that wins for most buyers, and the one that answers back. */
  picks: { slug: string; why: string }[];
}

export interface ComparePageContent {
  categorySlug: string;
  eyebrow: string;
  title: string;
  seoTitle: string;
  metaDescription: string;
  standfirst: string;
  /** Optional page hero. A scene, not a product shot. */
  image?: HeroImage;
  /** Markdown basename in src/articles/. */
  prose: string;
  pairs: BrandPair[];
  faq: FaqItem[];
  lastReviewed: string;
}

export const COMPARE_PAGES: Record<string, ComparePageContent> = {
  "robotic-pool-cleaners": {
    categorySlug: "robotic-pool-cleaners",
    eyebrow: "Compare",
    title: "Robotic pool cleaners compared, brand by brand",
    seoTitle: "Aiper vs Dolphin vs Polaris — Pool Cleaners Compared",
    metaDescription:
      "Aiper against Dolphin, Dolphin against Polaris, and the matchups underneath. Every machine we hold in one table, with the differences that decide it.",
    standfirst:
      "Most of these matchups come down to one thing, and it is not cleaning power. Aiper builds cordless machines and Dolphin builds corded ones, " +
      "and almost everything people mean by 'which brand is better' follows from that single fact.",
    image: {
      src: "/media/editorial/pool-cleaner-comparison.webp",
      alt:
        "Two unbranded robotic pool cleaners side by side on wet poolside stone at sunset, evenly lit with neither favoured.",
      focal: "50% 60%",
    },
    prose: "robotic-pool-cleaners-compared",
    pairs: [
      {
        id: "aiper-vs-dolphin",
        heading: "Aiper vs Dolphin",
        volume: 110,
        verdict:
          "Aiper if the cable is what you hate. Dolphin if you want a machine that will still be running in five years.",
        body:
          "This is the whole brand question in one line: every Aiper we hold is cordless and every Dolphin is corded. " +
          "Dolphin is Maytronics, decades deep in the pool trade, and it publishes a warranty term on everything — but its " +
          "best-known machine does the floor and the walls and leaves the waterline alone. Aiper moves faster and covers " +
          "more surfaces for the money, and it is the brand that will not state a warranty term on its own camera robot.",
        picks: [
          { slug: "aiper-scuba-s1", why: "Aiper's answer: cordless, all three wet surfaces, 3-micron filtration, rated to 50 ft." },
          { slug: "dolphin-nautilus-cc-plus", why: "Dolphin's answer: never charges, never stops early, floor and walls to 40 ft — and no waterline." },
        ],
      },
      {
        id: "dolphin-vs-polaris",
        heading: "Dolphin vs Polaris",
        volume: 30,
        verdict:
          "Polaris if you want cordless from a name your pool store knows. Dolphin if unlimited runtime matters more than the dock.",
        body:
          "Two brands American pool owners actually recognise, on opposite sides of the same argument. The Polaris FREEDOM is " +
          "cordless, runs two and a half hours, does the waterline and parks itself on a dock. The Dolphins are corded and never " +
          "run out — but the Nautilus CC Plus stops at the walls and the Proteus DX4 Plus is rated to only 33 ft, which is " +
          "shorter than most people expect at that price.",
        picks: [
          { slug: "polaris-freedom", why: "Rated to about 50 ft, floor to waterline, and the dock means never lifting it out wet." },
          { slug: "dolphin-proteus-dx4-plus", why: "The Dolphin that does do the waterline, plus the steps and the sun ledge — inside 33 ft." },
        ],
      },
      {
        id: "beatbot-vs-aiper",
        heading: "Beatbot vs Aiper — the flagship question",
        volume: 0,
        verdict:
          "Beatbot for a big, complicated, debris-heavy pool. Aiper for everything else, at roughly half the outlay.",
        body:
          "At the top of the market the two are doing genuinely different jobs. The AquaSense 2 Ultra adds water clarification " +
          "to the four surfaces, maps the pool with a camera stack, and carries a 3-year full replacement warranty — the " +
          "strongest term anyone here offers. The Scuba X1 Pro Max does four surfaces with ultrasonic mapping and the longest " +
          "reach in the catalogue at 100 ft. Neither is a machine a modest pool needs.",
        picks: [
          { slug: "beatbot-aquasense-2-ultra", why: "Five jobs, 3,875 sq ft per cycle, and the only full replacement warranty here." },
          { slug: "aiper-scuba-x1-pro-max", why: "Four surfaces, 100 ft, 8,500 GPH claimed — the long-pool answer." },
        ],
      },
      {
        id: "wybot-vs-aiper",
        heading: "WYBOT vs Aiper — the budget climbers",
        volume: 0,
        verdict: "WYBOT if the budget is firm. Aiper if you want the filtration and the pool-length rating with it.",
        body:
          "Both do floor, walls and waterline cordlessly, which used to be impossible at this end of the market. The WYBOT C1 " +
          "is the cheapest machine here that climbs at all and adds a weekly cycle timer and a stated 2-year warranty, at the " +
          "cost of a 180-micron filter with no ultra-fine layer. The Scuba S1 brings 3-micron filtration and a published 50 ft " +
          "rating rather than an area figure.",
        picks: [
          { slug: "wybot-c1", why: "Floor, walls, waterline and a weekly timer for less than anything else that climbs." },
          { slug: "aiper-scuba-s1", why: "The same three surfaces with 3-micron filtration and a shallow-ledge claim." },
        ],
      },
      {
        id: "skimmer-vs-cleaner",
        heading: "Betta vs everything — skimmer against cleaner",
        volume: 0,
        verdict: "Not a matchup. They do different jobs, and under trees you want both.",
        body:
          "This is the comparison people make by accident and it is the most expensive mistake in the category. The Betta SE Plus " +
          "is a solar skimmer: it floats, it takes leaves off the surface before they sink, and it will never touch your floor, " +
          "your walls or your waterline. Betta says so plainly. Put it against a floor robot and it loses a contest it was never " +
          "entered in — run it alongside one and debris never reaches the bottom to be vacuumed off later.",
        picks: [
          { slug: "betta-se-plus", why: "Surface only, solar, rated to 40 × 60 ft. The right answer to a different question." },
        ],
      },
    ],
    faq: [
      {
        q: "Is Aiper better than Dolphin?",
        a:
          "Neither is better in general. Aiper builds cordless machines that cover more surfaces for the money; Dolphin builds " +
          "corded machines with unlimited runtime, decades of pool-trade history and a published warranty on everything. If the " +
          "cable is your complaint, Aiper. If you keep equipment a long time and do not want a battery on a calendar, Dolphin.",
      },
      {
        q: "Which brand of robotic pool cleaner lasts longest?",
        a:
          "Nobody publishes a lifespan, so the warranty is the only figure anyone commits to and the only fair way to compare. " +
          "In this catalogue: 3-year full replacement on the Beatbot AquaSense 2 Ultra, 3 years on the Aiper Scuba X1 Pro Max, " +
          "2.5 on the Dolphin Nautilus CC Plus, 2 on the WYBOT C1, 1 on the BuBlue Bubot 800P — and no stated term at all on " +
          "the Aiper Scuba V3.",
      },
      {
        q: "Should I compare on suction power?",
        a:
          "It is the least useful number on the page. Manufacturers measure it differently, most do not publish it at all, and " +
          "a figure like 8,500 GPH is the maker's own benchmark rather than an independent one. Compare on what a machine " +
          "reaches — floor, walls, waterline, surface — and on the pool size it is rated for.",
      },
      {
        q: "Do I need a skimmer as well as a robot?",
        a:
          "If your pool sits under trees, yes, and it is the cheapest upgrade in the category. A skimmer takes leaves off the " +
          "surface before they sink, stain and break down. Only two machines here do both jobs — the Aiper Scuba X1 Pro Max and " +
          "the Beatbot AquaSense 2 Ultra — and both are flagship money.",
      },
    ],
    lastReviewed: "2026-08-06",
  },
};

export const comparePageFor = (slug: string | undefined): ComparePageContent | undefined =>
  slug ? COMPARE_PAGES[slug] : undefined;
