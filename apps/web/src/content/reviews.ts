/* ============================================================
   Review page content, keyed by product slug.

   THIS IS THE FILE YOU EDIT for each new review. The prose lives
   alongside in src/reviews/<slug>.md; everything structured —
   verdict, key facts, specifications — lives here so it can be
   checked against the source dataset rather than buried in prose.

   Facts are transcribed from Danny's supplied specification
   dataset (docs/reviews/_source-specs.json, researched 2026-08-03).
   Where that dataset holds null, the value here is null and the
   table prints "Not disclosed by the manufacturer". Nothing is
   filled in from a third-party review.
   ============================================================ */

import type { SpecGroup } from "../components/SpecTable.astro";
import type { HeroImage } from "../components/CategoryHero.astro";
import type { ReviewFigureRef } from "../lib/review-figures";
import type { ReviewVideo } from "../components/VideoSection.astro";

export interface ReviewContent {
  /** Product slug — matches content/products.ts and the D1 row. */
  slug: string;
  categorySlug: string;
  eyebrow: string;
  /** The H1. */
  title: string;
  seoTitle: string;
  metaDescription: string;
  /** The answer, before the reasoning. */
  verdict: string;
  bestFor: string;
  notIdealFor: string;
  image?: HeroImage;
  /** Four facts a buyer decides on. */
  facts: { label: string; value: string }[];
  /**
   * Figures placed inside the prose, each named by the heading it sits under.
   *
   * A figure may only be listed here if what is printed inside it agrees with
   * the review. Three of the seven creatives supplied for the Nautilus were
   * held back on that rule — see REVIEW_FIGURES_WITHHELD in media/assets.ts.
   */
  figures?: ReviewFigureRef[];
  /**
   * Sections that ship shut, named by heading id. See lib/collapsible-sections.
   *
   * The test is "does this section answer *should I buy it* or *why exactly*".
   * The first kind never goes in this list. Nothing is removed from the page
   * by being here — the words are still in the HTML and still indexed.
   */
  folds?: import("../lib/collapsible-sections").FoldSpec[];
  /**
   * A YouTube video about this product. The section renders only when a real
   * watch URL is present — there is no "video coming soon" placeholder,
   * because an empty promise on a live page is worse than no section.
   */
  video?: ReviewVideo;
  specGroups: SpecGroup[];
  /** Which SKU the specifications describe. */
  skuNote: string;
  lastReviewed: string;
}

export const REVIEWS: Record<string, ReviewContent> = {
  "dolphin-nautilus-cc-plus": {
    slug: "dolphin-nautilus-cc-plus",
    categorySlug: "robotic-pool-cleaners",
    eyebrow: "Robotic pool cleaner review",
    title: "Dolphin Nautilus CC Plus Wi-Fi review",
    seoTitle: "Dolphin Nautilus CC Plus Wi-Fi Review | BotPlanet",
    metaDescription:
      "An honest review of the Dolphin Nautilus CC Plus Wi-Fi: what it cleans, what it does " +
      "not, the 40 ft pool limit, and the US and global SKU differences worth checking first.",
    verdict:
      "A corded floor-and-wall cleaner that does a specific job reliably and does not pretend " +
      "to do more. It plugs in, runs a two-hour cycle, climbs the walls, and never needs " +
      "charging. It does not scrub the waterline, whatever the product copy implies.",
    bestFor:
      "An in-ground pool up to 40 ft where you want floor and wall cleaning handled on a " +
      "schedule, with no charging routine to remember.",
    notIdealFor:
      "The waterline is your actual complaint, your pool runs longer than 40 ft, or you want " +
      "a cordless machine.",
    image: {
      src: "/media/reviews/dolphin-nautilus-cc-plus/hero.webp",
      alt:
        "BotPlanet artwork for the Dolphin Nautilus CC Plus Wi-Fi robotic pool cleaner, shown " +
        "lifting out of dark water beside a phone running the Dolphin app.",
    },
    figures: [
      {
        afterHeading: "What it actually cleans, and how",
        src: "/media/reviews/dolphin-nautilus-cc-plus/plug-and-play.webp",
        caption:
          "Corded, so there is no charge cycle to plan around: the power supply sits by the pool and the robot runs whenever you tell it to.",
      },
      {
        afterHeading: "Filtration and the maintenance reality",
        src: "/media/reviews/dolphin-nautilus-cc-plus/filter-access.webp",
        caption:
          "The baskets lift out through the top, which is the difference between rinsing the filter and dreading it.",
      },
      {
        afterHeading: "The app",
        src: "/media/reviews/dolphin-nautilus-cc-plus/app-control.webp",
        caption:
          "MyDolphin Plus handles scheduling and cycle selection. What it does not do is tell you the filter is full.",
      },
    ],
    /* Six of the twelve sections ship shut. Every one of them answers "why
       exactly" rather than "should I buy it" — the five that decide the
       purchase (who it is for, who should not, the waterline finding, what it
       cleans, filtration) and the verdict stay open, in that order. */
    folds: [
      {
        id: "pool-size-and-the-cable-that-confuses-everyone",
        teaser: "Why a 56 ft cable does not mean a 56 ft pool.",
      },
      {
        id: "the-app",
        teaser: "What MyDolphin Plus does, and the one thing it will not tell you.",
      },
      {
        id: "weight-handling-and-getting-it-out",
        teaser: "What 19 lb dry actually feels like coming out of the water.",
      },
      {
        id: "what-is-in-the-box-and-the-warranty",
        teaser: "Contents, the 2.5-year cover, and what it does not cover.",
      },
      {
        id: "the-sku-trap",
        teaser: "US and global models share a name and do not share a spec sheet.",
      },
      {
        id: "what-we-cannot-tell-you",
        teaser: "The limits of a review written without a pool to run it in.",
      },
    ],
    /* Title and channel came from YouTube's oEmbed endpoint on 3 August 2026,
       not from memory. The share token was stripped from the URL — it
       identifies whoever sent the link, not the video. */
    video: {
      url: "https://youtu.be/9cjD-Oiulag",
      title: "Dolphin Nautilus CC Plus Automatic Robotic Pool Vacuum Cleaner Review - Is It Worth It?",
      channel: "Shop with me!",
      poster: "/media/reviews/dolphin-nautilus-cc-plus/video-poster.webp",
      note:
        "An independent owner's review — not ours, and not Maytronics'. We link it because watching the machine lifted out, opened and rinsed shows things a specification sheet cannot. It is one person's experience rather than our testing, and nothing in it has been used as evidence for any claim on this page.",
    },
    facts: [
      { label: "Power", value: "Corded mains" },
      { label: "Cleans", value: "Floor and walls" },
      { label: "Max pool length", value: "40 ft / 12 m" },
      { label: "Warranty", value: "2.5 years" },
    ],
    specGroups: [
      {
        heading: "Power and reach",
        rows: [
          { label: "Power type", value: "Corded mains power" },
          {
            label: "Cable length",
            value: "56 ft / 17.1 m",
            note: "Longer than the pool-size guidance on purpose — the cable runs from a poolside supply, down and across.",
          },
          { label: "Anti-tangle swivel", value: "Yes" },
          { label: "Battery", value: null },
        ],
      },
      {
        heading: "Pool compatibility",
        rows: [
          {
            label: "Installation",
            value: "In-ground",
            note: "The current US listing states in-ground only. The global SKU also lists above-ground — do not assume it applies to the item you are buying.",
          },
          {
            label: "Maximum pool length",
            value: "40 ft / 12 m",
            note: "Some official bundle copy has referenced 50 ft. Use 40 ft unless the exact product page for your SKU says otherwise.",
          },
          { label: "Shapes", value: "Rectangular, round, freeform, kidney" },
          { label: "Surface types", value: null },
        ],
      },
      {
        heading: "Cleaning",
        rows: [
          { label: "Coverage", value: "Floor and walls" },
          {
            label: "Waterline scrubbing",
            value: "No",
            note: "Climbing a wall and scrubbing the waterline are different capabilities. This model does the first.",
          },
          { label: "Cycle length", value: "120 minutes" },
          { label: "Additional cycles", value: "None — one default cycle" },
          { label: "Weekly timer", value: "Yes" },
          { label: "Delay start", value: null },
          { label: "Brushes", value: "Two, described as a Combine Brush" },
          { label: "Actively driven brush", value: "No" },
          { label: "Suction", value: "4,500 gph / 17 m³ per hour" },
        ],
      },
      {
        heading: "Filtration",
        rows: [
          { label: "Access", value: "Top-load" },
          {
            label: "Filter supplied",
            value: "Ultra-Fine Filter Kit (current US SKU)",
            note: "The global SKU ships a Fine Filter Kit. Use the wording on the listing you buy from.",
          },
          {
            label: "Full-filter indicator",
            value: "No",
            note: "Nothing tells you the filter is clogged. Rinse after every cycle rather than waiting to notice.",
          },
          { label: "Filter capacity", value: null },
        ],
      },
      {
        heading: "Control",
        rows: [
          { label: "App", value: "MyDolphin Plus" },
          { label: "Wi-Fi", value: "Yes" },
          { label: "Bluetooth", value: null },
          { label: "Physical remote", value: "Not included, and none listed for this model" },
          {
            label: "Navigation",
            value: null,
            note: "Maytronics states the cleaner navigates automatically but does not specify the technology on the pages we checked.",
          },
        ],
      },
      {
        heading: "Handling",
        rows: [
          {
            label: "Dry weight",
            value: "20.8 lb / 9.45 kg",
            note: "The weight you lift is higher — it comes out full of water. A wet weight is not published.",
          },
          { label: "Dimensions (H×L×W)", value: "10.4 × 16.8 × 16.4 in / 26.5 × 42.7 × 41.6 cm" },
          { label: "Retrieval", value: "Lift by handle once the robot reaches an accessible point" },
          { label: "Waterline parking", value: null },
          { label: "Retrieval hook", value: null },
        ],
      },
    ],
    skuNote:
      "Specifications describe US SKU 99996409-PCI (UPC 850015249969), from Maytronics' own " +
      "product pages accessed 3 August 2026. A global SKU, 99996406-PCI, differs on filter kit " +
      "and installation type. Confirm the SKU on the listing before buying.",
    lastReviewed: "2026-08-03",
  },

  "polaris-freedom": {
    slug: "polaris-freedom",
    categorySlug: "robotic-pool-cleaners",
    eyebrow: "Robotic pool cleaner review",
    title: "Polaris FREEDOM cordless review",
    seoTitle: "Polaris FREEDOM Cordless Robotic Pool Cleaner Review | BotPlanet",
    metaDescription:
      "An honest review of the Polaris FREEDOM: what it cleans, the 2.5-hour runtime, the battery " +
      "you are really buying, and why the 50 ft pool limit appears only in marketing artwork.",
    verdict:
      "A genuinely cordless in-ground cleaner that does the floor, the walls and the waterline, runs " +
      "two and a half hours on a charge, and parks itself on a dock. You are paying a premium for a " +
      "battery — the one part guaranteed to be worse in five years than it is today.",
    bestFor:
      "An in-ground pool up to about 50 ft where the cable is the thing you actually hate, and the " +
      "waterline needs doing as well as the floor.",
    notIdealFor:
      "Your pool is above ground, deeper than 13 ft, or you keep equipment for a decade and do not " +
      "want a part that wears out on a calendar.",
    image: {
      src: "/media/reviews/polaris-freedom/hero.webp",
      alt:
        "BotPlanet artwork for the Polaris FREEDOM cordless robotic pool cleaner, shown at the edge " +
        "of a lit pool beside a phone running a two hour thirty cycle.",
    },
    figures: [
      {
        afterHeading: "Cordless, and what that actually costs",
        src: "/media/reviews/polaris-freedom/cordless-dock.webp",
        caption:
          "The Easy-Charge station is a contact dock rather than a plug, and it lives outdoors. Four hours from empty.",
      },
      {
        afterHeading: "The app, and the Wi-Fi requirement nobody mentions before you buy",
        src: "/media/reviews/polaris-freedom/app-control.webp",
        caption:
          "iAquaLink handles modes, charge status and a push notification when the machine is parked at the waterline waiting to be lifted out.",
      },
    ],
    /* POLARIS'S OWN VIDEO, LABELLED AS SUCH.
       The URL carries `amzn1.ive.seller.video`, which is Amazon's own marker
       for footage the seller supplied — so this is the manufacturer showing
       you their machine, not an owner reporting on it. It is still worth
       linking: watching the thing climb out and park at the waterline shows
       something no specification table can. It is not evidence for any claim
       on this page and nothing here rests on it.

       The `ref=cm_sw_wa_r_ib_mb_…` share token was stripped. It identifies
       whoever sent the link, not the video. */
    video: {
      url: "https://www.amazon.com/vdp/08d6671e239a42299ebaff7ba7442f9a?aci=amzn1.ive.seller.video.08d6671e239a42299ebaff7ba7442f9a&product=B0BX9DJS7R",
      title: "Polaris FREEDOM Robotic Pool Cleaner",
      channel: "Polaris",
      source: "seller",
      note:
        "Polaris's own video, hosted on Amazon. We link it because seeing the machine climb out and park at the waterline is worth more than a paragraph describing it. It is marketing rather than testing, nobody here has run this robot, and nothing on this page is evidenced by it.",
    },
    /* Five of the twelve sections ship shut. The five that decide the purchase —
       who it is for, who should not, the 50 ft question, what it cleans, and the
       battery — stay open, as does the verdict. */
    folds: [
      {
        id: "runtime-and-two-figures-that-are-the-same-figure",
        teaser: "Why 2h30 and 2.5 hours are one number, not two sources disagreeing.",
      },
      {
        id: "filtration-and-the-rating-nobody-publishes",
        teaser: "A 4 litre canister, and why no micron figure here has a source.",
      },
      {
        id: "weight-handling-and-getting-it-out",
        teaser: "Twenty pounds, plus water — and a correction to our own record.",
      },
      {
        id: "what-is-in-the-box-and-the-warranty-we-cannot-confirm",
        teaser: "Three items, and a warranty term Polaris does not print anywhere.",
      },
      {
        id: "the-name-trap",
        teaser: "FREEDOM, SC, LT and Plus — and a chassis code shared between two of them.",
      },
      {
        id: "what-we-cannot-tell-you",
        teaser: "Seven things no published source answers, listed rather than glossed.",
      },
    ],
    facts: [
      { label: "Power", value: "Cordless battery" },
      { label: "Cleans", value: "Floor, walls, waterline" },
      { label: "Max pool length", value: "50 ft" },
      { label: "Runtime", value: "2 h 30" },
    ],
    specGroups: [
      {
        heading: "Power and runtime",
        rows: [
          { label: "Power type", value: "Cordless lithium-ion" },
          { label: "Battery", value: "9.6 Ah at 29.4 V DC" },
          {
            label: "Runtime — floor and walls",
            value: "2 h 30",
            note: "The longest mode. Polaris's 'up to 2.5 hours' is the same figure stated less precisely.",
          },
          { label: "Runtime — floor only", value: "1 h 30" },
          {
            label: "Charge time",
            value: "4 hours",
            note: "Polaris also states 'under 5 hours' in two places. That is a ceiling, not a rival figure.",
          },
          { label: "Operating power", value: "29.4 W" },
          {
            label: "Battery cycle life",
            value: null,
            note: "No source publishes one. The capacity will fall with age; nobody says over how many cycles.",
          },
          { label: "Replacement battery cost", value: null },
        ],
      },
      {
        heading: "Pool compatibility",
        rows: [
          { label: "Installation", value: "In-ground only" },
          {
            label: "Max pool length",
            value: "50 ft",
            note: "Stated only in the manufacturer's A+ marketing panels. The manual, quick start guide and support page give depth and no length at all.",
          },
          { label: "Max depth", value: "13 ft / 4 m" },
          { label: "Min depth", value: "15 in / 40 cm" },
          {
            label: "Surface finishes",
            value: null,
            note: "The manual warns about vinyl liner patterns but does not enumerate compatible finishes.",
          },
        ],
      },
      {
        heading: "Cleaning",
        rows: [
          { label: "Surfaces", value: "Floor, wall and waterline" },
          {
            label: "Modes",
            value: "Four",
            note: "Floor, and floor + walls + waterline on the unit; Waterline only and SMART Cycle in the app.",
          },
          { label: "Navigation", value: "SMART cycle, app-selectable" },
          {
            label: "Flow rate",
            value: null,
            note: "Operating power is published; suction is not. Any flow figure quoted for this machine did not come from Polaris.",
          },
        ],
      },
      {
        heading: "Filtration",
        rows: [
          { label: "Filter", value: "All-purpose canister" },
          { label: "Capacity", value: "4 L" },
          {
            label: "Micron rating",
            value: null,
            note: "Not published on the support page or in the manual.",
          },
          { label: "Full-filter indicator", value: null },
        ],
      },
      {
        heading: "Control",
        rows: [
          { label: "App", value: "iAquaLink" },
          {
            label: "Wi-Fi",
            value: "Required at the charging location",
            note: "The manual requires adequate signal where the dock sits, not where the pool is. Check this before buying.",
          },
          { label: "Physical remote", value: "None supplied — app or an on-unit slider" },
          { label: "Push notifications", value: "Cycle complete, and ready to retrieve at the waterline" },
        ],
      },
      {
        heading: "Handling",
        rows: [
          {
            label: "Weight",
            value: "20 lb / 9.1 kg",
            note: "Cleaner only, from the owner's manual. The 33 lb figure Polaris also prints is packed weight and is not what you lift.",
          },
          { label: "Dimensions", value: "16 × 16.5 × 11 in / 41 × 42 × 28 cm" },
          {
            label: "Retrieval",
            value: "Climbs to the waterline at end of cycle, or the supplied hook",
            note: "Two methods, per Polaris. There is no tap-to-summon.",
          },
          { label: "In the box", value: "Cleaner, charging station, removal hook" },
          {
            label: "Warranty",
            value: null,
            note: "The manual references a Limited Warranty inside an exclusion clause and never states its term. The support page and the A+ panels state none.",
          },
        ],
      },
    ],
    skuNote:
      "Specifications describe SKU FFREEDOM (also referenced FR550CBR), from Polaris' own support " +
      "page, owner's manual H0748900_REVC and quick start guide, accessed 31 July 2026, with the " +
      "pool-length figure from the manufacturer's A+ panels. The manual's chassis designation " +
      "TYPE EB37 is shared with the FREEDOM Plus, so check the SKU rather than the chassis code.",
    lastReviewed: "2026-08-04",
  },
};

export function reviewFor(slug: string | undefined): ReviewContent | undefined {
  return slug ? REVIEWS[slug] : undefined;
}
