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
  /**
   * Where to borrow comparisons from when this review's own category has none.
   *
   * EVERY FALLBACK IN also-compared.ts IS CATEGORY-SCOPED — head-to-head,
   * nearest sibling, the comparison table, the hub. A category's first review
   * has no siblings, which Grillbot hit on 10 August 2026 and the hub fallback
   * answered. A review in a HIDDEN category has no hub either, so all four
   * return nothing and the block renders empty.
   *
   * That is not a corner case to paper over: the Yarbo is a snow blower module
   * on the same Core that carries Yarbo's mower, and the lawn hub is genuinely
   * where a reader of this page should go next. Naming that relationship is
   * more honest than inventing a sibling, and more useful than an empty block.
   *
   * Only ever the LAST resort — a real comparison in the review's own category
   * always wins.
   */
  relatedCategorySlug?: string;
  /**
   * A second machine this review covers, with its own tracked buy path.
   *
   * WHY A REVIEW EVER COVERS TWO PRODUCTS. Some makers ship one design in two
   * sizes and change nothing else. Two pages for those is two pages competing
   * for the same head terms while each holds a SKU term worth almost nothing —
   * so they merge, and the merged page has to be able to sell both or the
   * merge has quietly made one of them unbuyable. This is that buy path.
   *
   * It carries no price. Price comes from D1 with the date it was read, and a
   * figure typed here would be a second number on the page with no way to tell
   * which one is current — the same rule BuyStrip already follows.
   */
  alsoCovers?: {
    name: string;
    retailerName: string;
    /** A key from REDIRECT_KEYS. The /go/ route is what makes it tracked. */
    redirectKey: string;
    line: string;
  };
  specGroups: SpecGroup[];
  /** Which SKU the specifications describe. */
  skuNote: string;
  lastReviewed: string;
  /**
   * Who wrote it, by id from content/team.ts.
   *
   * OPTIONAL, AND THE DEFAULT IS THE EDITORIAL AUTHOR. Every review carried the
   * founder's name in its structured data and nothing on the page until 10
   * August 2026, when a second named editor joined and the byline stopped being
   * a constant. A review with no `authorId` still resolves to somebody rather
   * than to nobody, which is the property that matters: there is no path here
   * that publishes an unattributed review.
   */
  authorId?: string;
}

/* @extension-point per-product | optional | No review page for the product, and
   no card in the homepage review grid, which is built from this record so new
   reviews appear automatically. A catalogued product with no review still
   works — it just never gets the page that ranks. */
export const REVIEWS: Record<string, ReviewContent> = {
  "dolphin-nautilus-cc-plus": {
    slug: "dolphin-nautilus-cc-plus",
    categorySlug: "robotic-pool-cleaners",
    eyebrow: "Robotic pool cleaner review",
    title: "Dolphin Nautilus CC Plus Wi-Fi review",
    seoTitle: "Dolphin Nautilus CC Plus Review — Wi-Fi, and the 40 ft Limit",
    metaDescription:
      "Our Dolphin Nautilus CC Plus review: what it cleans, what it leaves alone, " +
      "the 40 ft pool limit, and the US and global SKU difference worth checking.",
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
    seoTitle:
      "Polaris FREEDOM Review — Cordless, and the Runtime Catch",
    metaDescription:
      "Our Polaris Freedom review: cordless, 2.5 hours of runtime, and a 50 ft " +
      "pool limit that appears only in marketing artwork. Who should skip it.",
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

  "betta-se-plus": {
    slug: "betta-se-plus",
    categorySlug: "robotic-pool-cleaners",
    eyebrow: "Robotic pool skimmer review",
    title: "Betta SE Plus solar skimmer review",
    seoTitle: "Betta SE Plus Review — Skims the Surface, Nothing Else",
    metaDescription:
      "An honest Betta SE Plus review: 30 hours of runtime, a 200 micron basket, " +
      "and the one thing this solar skimmer will never do — clean your floor.",
    verdict:
      "Not a pool cleaner — a skimmer, and the difference is the whole review. It floats, runs on " +
      "sunlight, and takes leaves and pollen off the surface before they sink. It will never touch " +
      "your floor, your walls or your waterline, and Betta says so plainly.",
    bestFor:
      "A pool under trees, especially alongside a floor robot: debris caught on the surface never " +
      "sinks, never stains and never has to be vacuumed off the bottom later.",
    notIdealFor:
      "The floor or the waterline is your actual complaint, your pool is bigger than about " +
      "40 by 60 ft, or it sits in permanent shade.",
    image: {
      src: "/media/reviews/betta-se-plus/hero.webp",
      alt:
        "BotPlanet artwork for the Betta SE Plus solar robotic pool skimmer, shown floating on a " +
        "sunlit pool among fallen leaves.",
    },
    figures: [
      {
        afterHeading: "Runtime, and the number that sounds like a typo",
        src: "/media/reviews/betta-se-plus/twin-motors.webp",
        caption:
          "Twin Salt Chlorine Tolerant motors and dual charging — solar, with a mains adapter for a bad week. The dock shown here is illustrative: Betta does not sell one, and the machine charges afloat or on the adapter.",
      },
      {
        afterHeading: "Navigation, and what \"ultrasonic radar\" is doing here",
        src: "/media/reviews/betta-se-plus/sensors.webp",
        caption:
          "Ultrasonic radar for obstacle detection and a UV-resistant shell — both Betta's own wording, and both matter more on a machine that lives in full sun.",
      },
      {
        afterHeading: "Filtration, and the one number Betta does publish",
        src: "/media/reviews/betta-se-plus/debris-basket.webp",
        caption:
          "The 200 micron basket lifts out by its handle. The docking station in this illustration is not part of the product — there is no dock to buy.",
      },
    ],
    /* Seller's own footage, hosted on Amazon — the URL carries
       amzn1.ive.seller.video. Share token stripped. */
    video: {
      url: "https://www.amazon.com/vdp/01ddc8879b6d4846ba5ea6935348ec77?aci=amzn1.ive.seller.video.01ddc8879b6d4846ba5ea6935348ec77&product=B0CVMQ3XBX",
      title: "Betta Solar-Powered Smart Robotic Pool Skimmer",
      channel: "Betta",
      source: "seller",
      note:
        "Betta's own video, hosted on Amazon. Worth two minutes because a floating skimmer is hard to picture from a specification — you can see how it sits and how it turns. It is marketing rather than testing, and nothing on this page is evidenced by it.",
    },
    folds: [
      /* Runtime deliberately NOT folded: 30 hours on a charge is one of the two
         reasons anyone buys this machine, so hiding it behind a door would be
         collapsing the argument rather than the detail. */
      {
        id: "filtration-and-the-one-number-betta-does-publish",
        teaser: "200 microns — and why coarse is the right answer here.",
      },
      {
        id: "navigation-and-what-ultrasonic-radar-is-doing-here",
        teaser: "Obstacle detection, a UV-resistant shell, and a 3.5 inch minimum.",
      },
      {
        id: "what-is-in-the-box-and-the-warranty",
        teaser: "A one-year warranty stated twice — and no docking station.",
      },
      {
        id: "what-we-cannot-tell-you",
        teaser: "Seven things Betta does not publish, listed rather than glossed.",
      },
    ],
    facts: [
      { label: "Power", value: "Solar + adapter" },
      { label: "Cleans", value: "Surface only" },
      { label: "Max pool", value: "40 × 60 ft" },
      { label: "Runtime", value: "30+ hours" },
    ],
    specGroups: [
      {
        heading: "Power and runtime",
        rows: [
          { label: "Power type", value: "Cordless, solar with dual charging" },
          {
            label: "Runtime",
            value: "30+ hours continuous",
            note: "A small motor moving a floating hull, not a heavy machine climbing a wall.",
          },
          { label: "Charge — solar", value: "5 to 6 hours in direct sunlight" },
          {
            label: "Charge — adapter",
            value: "3.5 hours",
            note: "Betta ships a mains adapter because solar alone does not survive a bad week.",
          },
          { label: "Battery capacity", value: null },
          { label: "Docking station", value: "None — the machine charges afloat or on the adapter" },
        ],
      },
      {
        heading: "Pool compatibility",
        rows: [
          { label: "Installation", value: "Above-ground and in-ground" },
          { label: "Max pool size", value: "40 × 60 ft, approx. 2,400 sq ft" },
          {
            label: "Minimum water depth",
            value: "3.5 in",
            note: "Relevant for a shallow tanning ledge.",
          },
          {
            label: "Water chemistry",
            value: "Fresh or salt up to 5,000 ppm",
            note: "The twin motors are described by Betta as Salt Chlorine Tolerant.",
          },
        ],
      },
      {
        heading: "Cleaning",
        rows: [
          {
            label: "Surfaces",
            value: "Pool surface only",
            note: "Leaves, dust, pollen, insects and pet hair. Not the floor, not the walls, not the waterline.",
          },
          { label: "Modes", value: "Smart auto-cleaning, mode switching by remote" },
          { label: "Navigation", value: "Ultrasonic radar obstacle detection" },
          { label: "Shell", value: "UV-resistant coating" },
          { label: "Suction rate", value: null },
        ],
      },
      {
        heading: "Filtration",
        rows: [
          { label: "Filter", value: "Fine-mesh debris basket with a top handle" },
          {
            label: "Micron rating",
            value: "200 um",
            note: "Coarse on purpose. This basket catches leaves and insects; a finer mesh would clog under a tree.",
          },
          { label: "Basket volume", value: null },
        ],
      },
      {
        heading: "Control and support",
        rows: [
          { label: "Remote", value: "Wireless remote included" },
          {
            label: "App",
            value: null,
            note: "Betta names a remote and never mentions an app either way, so 'no app' is our inference rather than their statement.",
          },
          { label: "Wi-Fi", value: null },
          {
            label: "Warranty",
            value: "1 year",
            note: "Stated on the product page and again in the manual — two sources agreeing.",
          },
        ],
      },
      {
        heading: "Handling",
        rows: [
          { label: "Weight", value: null },
          { label: "Dimensions", value: null },
          { label: "In the box", value: null, note: "A remote is named; a full contents list is not published." },
        ],
      },
    ],
    skuNote:
      "Specifications come from Betta's own product page and the Betta SE Plus user manual, " +
      "accessed 31 July 2026, with the twin-motor, ultrasonic radar, UV-coating and 3.5 inch " +
      "minimum-depth figures read from the manufacturer's Amazon listing on 4 August 2026. Betta " +
      "prints no SKU or part number on either the product page or the manual. The Betta SE is a " +
      "different machine with its own manual — check the listing names the SE Plus.",
    lastReviewed: "2026-08-04",
  },

  "aiper-scuba-v3-ai-vision": {
    slug: "aiper-scuba-v3-ai-vision",
    categorySlug: "robotic-pool-cleaners",
    eyebrow: "Robotic pool cleaner review",
    title: "Aiper Scuba V3 AI Vision review",
    seoTitle: "Aiper Scuba V3 Review — AI Vision, and What the Camera Sees",
    metaDescription:
      "Our Aiper Scuba V3 review: what the camera does, what seven days on a " +
      "charge means, the 3-micron filter claim, and the privacy question nobody " +
      "else asks.",
    verdict:
      "The first robot in our catalogue that looks at your pool: a camera recognises debris and " +
      "steers at it instead of sweeping blind. Cordless, 18.1 lb, waterline coverage, and the " +
      "finest filter rating we list — with headline numbers that are Aiper's own benchmarks, and a " +
      "camera in your water that deserves more published detail than it gets.",
    bestFor:
      "An in-ground pool that collects real debris — leaves, sand, twigs — where you want the " +
      "robot deciding for itself where to work, and the lightest daily routine in our catalogue.",
    notIdealFor:
      "Your pool is above ground, you want a manufacturer-stated maximum pool length or warranty " +
      "term, or a camera in the water is a line you would rather not cross.",
    image: {
      src: "/media/reviews/aiper-scuba-v3-ai-vision/hero.webp",
      alt:
        "BotPlanet artwork for the Aiper Scuba V3 AI Vision cordless robotic pool cleaner, shown " +
        "beside a night pool with a phone running the Aiper app.",
    },
    figures: [
      {
        afterHeading: "What the camera actually does",
        src: "/media/reviews/aiper-scuba-v3-ai-vision/ai-patrol.webp",
        caption:
          "The claims in this frame are Aiper's own: a 2 m — 6.6 ft — detection range, more than twenty debris types recognised, and \"up to 10×\" faster cleaning measured against an unnamed baseline. The first two are design specifications; the third is marketing.",
      },
      {
        afterHeading: "What \"7 days on one charge\" actually means",
        src: "/media/reviews/aiper-scuba-v3-ai-vision/carefree.webp",
        caption:
          "AI Navium mode plans a week of short cleans from one charge — that is the \"7-days runtime\" claim, and it is a scheduling feature, not 168 hours of running.",
      },
      {
        afterHeading: "Filtration, and the finest number in our catalogue",
        src: "/media/reviews/aiper-scuba-v3-ai-vision/filtration.webp",
        caption:
          "A 180 micron mesh for leaves and grit backed by a 3 micron layer for sand and pollen — Aiper's figures, and the finest published rating of anything we list.",
      },
    ],
    folds: [
      {
        id: "filtration-and-the-finest-number-in-our-catalogue",
        teaser: "3 microns — the finest figure we list, and what it does and does not prove.",
      },
      {
        id: "weight-the-dock-and-daily-handling",
        teaser: "18.1 lb, a wireless dock, and why the routine is genuinely one-handed.",
      },
      {
        id: "the-name-trap",
        teaser: "Cognitive AI on Aiper's site, AI Vision on Amazon — same machine, no SKU.",
      },
      {
        id: "what-we-cannot-tell-you",
        teaser: "Six things Aiper does not publish, including what the camera retains.",
      },
    ],
    video: {
      url: "https://youtu.be/DKs34wPDPCM",
      title: "I Think Aiper Just Changed Pool Cleaning Forever (Scuba V3 Review)",
      channel: "Deanin' It Yourself",
      source: "independent",
      note:
        "Independent, and enthusiastic — read the title as the reviewer's verdict rather than ours. It is worth watching for the AI navigation running in a real pool, which is the claim this machine is sold on and the one hardest to judge from a page.",
    },
    facts: [
      { label: "Power", value: "Cordless battery" },
      { label: "Cleans", value: "Floor, walls, waterline" },
      { label: "Weight", value: "18.1 lb" },
      { label: "Filter", value: "3 μm + 180 μm" },
    ],
    specGroups: [
      {
        heading: "Power and runtime",
        rows: [
          { label: "Power type", value: "Cordless lithium-ion" },
          { label: "Battery weight", value: "955 g", note: "From the listing's details table — the pack, not the machine." },
          {
            label: "Runtime",
            value: "~180 min (210 in eco)",
            note: "Owner research, not re-read from Aiper's page. Treat as researched rather than verified.",
          },
          {
            label: "Charge time",
            value: "~5 hours",
            note: "Owner research, same caveat.",
          },
          {
            label: "\"7 days on one charge\"",
            value: "A weekly plan, not 168 hours",
            note: "AI Navium spreads short autonomous cleans across the week so one charge covers it. Aiper's claim, correctly understood.",
          },
          { label: "Charging", value: "Wireless contact dock" },
        ],
      },
      {
        heading: "Pool compatibility",
        rows: [
          { label: "Installation", value: "In-ground" },
          {
            label: "Max pool length",
            value: null,
            note: "Aiper publishes an area, not a length. Owner research holds roughly 1,614 sq ft; no length rating exists to quote.",
          },
        ],
      },
      {
        heading: "Cleaning",
        rows: [
          { label: "Surfaces", value: "Floor, walls and waterline" },
          { label: "Suction", value: "4,800 GPH", note: "Aiper's figure, with dual brushes." },
          {
            label: "Navigation",
            value: "Camera — 2 m / 6.6 ft detection range",
            note: "Single front-facing camera; Aiper says over twenty debris types recognised. Both are Aiper's design figures.",
          },
          {
            label: "\"Up to 10× faster\"",
            value: "Marketing benchmark",
            note: "Measured against an unnamed baseline. No independent measurement exists.",
          },
          { label: "Night cleaning", value: "Yes — the robot carries its own lights" },
          { label: "Waterline parking", value: "Yes, with an app alert when it is ready to lift" },
        ],
      },
      {
        heading: "Filtration",
        rows: [
          { label: "Filter", value: "Multi-layer basket" },
          {
            label: "Micron rating",
            value: "3 μm fine layer + 180 μm debris mesh",
            note: "The finest published figure in our catalogue. Manufacturer's rating, not a lab result.",
          },
        ],
      },
      {
        heading: "Camera and privacy",
        rows: [
          {
            label: "Data protection",
            value: "TÜV-certified, per Aiper",
            note: "A real third-party scheme, and the entirety of what is published. What is processed on-device versus sent to Aiper is not spelled out.",
          },
        ],
      },
      {
        heading: "Handling",
        rows: [
          { label: "Weight", value: "18.1 lb / 8.2 kg", note: "The lightest full cleaner in our catalogue, and Aiper's page copy matches the listing table exactly." },
          { label: "Dimensions (L×W×H)", value: "17.5 × 15 × 8.6 in" },
          { label: "Warranty", value: null, note: "Aiper's site has a warranty process; no stated term for this machine was found." },
        ],
      },
    ],
    skuNote:
      "Specifications describe the Aiper Scuba V3, Gray, ASIN B0GG97427D — the Blue B0GY8DDHTN is a " +
      "colour variant, not a different specification. Sources: Aiper's own product page (which " +
      "titles the machine 'Scuba V3 Cognitive AI') and the Amazon listing (which sells it as 'AI " +
      "Vision'), both read 4 August 2026. Aiper publishes no SKU for any Scuba model, so check the " +
      "name on the listing: the Scuba S1, X1 and X1 Pro Max are different machines.",
    lastReviewed: "2026-08-04",
  },

  "dolphin-proteus-dx4-plus": {
    slug: "dolphin-proteus-dx4-plus",
    categorySlug: "robotic-pool-cleaners",
    eyebrow: "Robotic pool cleaner review",
    title: "Dolphin Proteus DX4 Plus review",
    seoTitle: "Dolphin Proteus DX4 Plus Review — The 33 ft Catch",
    metaDescription:
      "Our Dolphin Proteus DX4 Plus review: the 33 ft limit that catches people " +
      "out, the sibling rated for 50 ft, and why we are careful about the " +
      "waterline claim.",
    verdict:
      "A corded Maytronics machine that climbs walls, does the sun ledges and — per Maytronics' own " +
      "listing copy — the waterline too. Rated for pools up to 33 ft, which is shorter than people " +
      "assume and shorter than the Proteus DX4 sitting next to it on the same page.",
    bestFor:
      "An in-ground pool under 33 ft with steps and a sun ledge, where you want one corded machine " +
      "to handle every surface and no battery to think about.",
    notIdealFor:
      "Your pool runs longer than 33 ft, it is above ground, or the waterline is the entire reason " +
      "you are buying — read the waterline section before committing.",
    image: {
      src: "/media/reviews/dolphin-proteus-dx4-plus/hero.webp",
      alt:
        "BotPlanet artwork for the Dolphin Proteus DX4 Plus robotic pool cleaner, shown on stone " +
        "paving beside a curved pool at dusk.",
    },
    figures: [
      {
        afterHeading: "What it actually cleans",
        src: "/media/reviews/dolphin-proteus-dx4-plus/every-surface.webp",
        caption:
          "Floor, walls, steps and sun ledges, on tracks rather than wheels. The waterline is claimed by Maytronics on the listing but not corroborated by any technical sheet we could find — see the section above.",
      },
      {
        afterHeading: "Filtration",
        src: "/media/reviews/dolphin-proteus-dx4-plus/filtration.webp",
        caption:
          "Top-load access: lift the lid at the poolside rather than turning eighteen wet pounds over. Maytronics publishes no micron rating for the cartridge.",
      },
      {
        afterHeading: "Weight, handling and the things nobody publishes",
        src: "/media/reviews/dolphin-proteus-dx4-plus/weekly-timer.webp",
        caption:
          "The mains power supply. Our artwork shows a programmable weekly schedule on it — that feature is not described anywhere on the listing we read, so treat it as illustration until Maytronics confirms it.",
      },
    ],
    folds: [
      {
        id: "filtration",
        teaser: "Top-load access, and the rating Maytronics does not publish.",
      },
      {
        id: "weight-handling-and-the-things-nobody-publishes",
        teaser: "18.5 lb dry, 22 inches long, and no caddy in this configuration.",
      },
      {
        id: "what-we-cannot-tell-you",
        teaser: "Six gaps, and the reason there are more than usual.",
      },
    ],
    video: {
      url: "https://youtu.be/31780W8v1Tc",
      title: "Maytronics Proteus DX4 Robot Pool Cleaner Honest Review - Before You Buy!!!",
      channel: "Rubintech",
      source: "independent",
      note:
        "Independent, not Maytronics'. A before-you-buy review rather than an unboxing, which suits a machine whose argument is reliability rather than features.",
    },
    facts: [
      { label: "Power", value: "Corded mains" },
      { label: "Cleans", value: "Floor, walls, ledges" },
      { label: "Max pool length", value: "33 ft" },
      { label: "Weight", value: "18.5 lb" },
    ],
    specGroups: [
      {
        heading: "Power and reach",
        rows: [
          { label: "Power type", value: "Corded mains" },
          { label: "Cable length", value: null, note: "Not stated on the listing." },
          { label: "Cycle time", value: null, note: "No cycle duration is published." },
          { label: "Battery", value: null, note: "None — corded, so nothing degrades on a calendar." },
        ],
      },
      {
        heading: "Pool compatibility",
        rows: [
          { label: "Installation", value: "In-ground" },
          {
            label: "Max pool length",
            value: "33 ft",
            note: "The plain Proteus DX4 is rated to 50 ft and shares this product page. Check the title of the listing you are buying.",
          },
        ],
      },
      {
        heading: "Cleaning",
        rows: [
          { label: "Surfaces", value: "Floor, walls, steps and sun ledges" },
          {
            label: "Waterline",
            value: "Claimed on the listing, not corroborated",
            note: "Maytronics' bullet says it scrubs the waterline; the product title says 'Wall & Sun-ledge Scrubbing' and omits it. No technical sheet for this model has been found. The same manufacturer's marketing and spec sheet disagree on this feature for the Nautilus CC Plus.",
          },
          { label: "Navigation", value: "Smart navigation", note: "Maytronics' own name for the system is not given on this listing." },
          { label: "Drive", value: "Tracks" },
        ],
      },
      {
        heading: "Filtration",
        rows: [
          { label: "Filter", value: "Top-load cartridge" },
          { label: "Micron rating", value: null, note: "Filter type is stated; fineness is not." },
          { label: "Full-filter indicator", value: null },
        ],
      },
      {
        heading: "Control",
        rows: [
          { label: "App", value: null, note: "No app is mentioned on the listing either way." },
          { label: "Wi-Fi", value: null },
          {
            label: "Weekly timer",
            value: null,
            note: "Not described on the listing we read. Our own artwork shows one on the power supply; that is illustration, not specification.",
          },
        ],
      },
      {
        heading: "Handling",
        rows: [
          { label: "Dry weight", value: "18.5 lb", note: "It comes out of the water heavier than it went in." },
          { label: "Dimensions (L×W×H)", value: '22.2 × 17.6 × 12.8 in' },
          { label: "Caddy", value: "Not included", note: "One of the six siblings ships with a caddy. This is not that one." },
          { label: "Warranty", value: null, note: "No term stated on the listing." },
        ],
      },
    ],
    skuNote:
      "Specifications describe the Dolphin Proteus DX4 Plus, ASIN B083YWJ5PQ, model number " +
      "99996207-LESW as printed in the listing's own details table — owner research also names " +
      "99996290-DX4, and Maytronics part numbers carry market and retailer suffixes, so both may be " +
      "genuine for different channels. Read 3 August 2026 and re-read 4 August 2026. NO MAYTRONICS " +
      "PRODUCT PAGE FOR THIS MODEL HAS BEEN FOUND: every figure here is retailer-sourced and none is " +
      "presented as manufacturer-verified. Six Proteus models share one Amazon parent listing.",
    lastReviewed: "2026-08-04",
  },

  "aiper-scuba-x1-pro-max": {
    slug: "aiper-scuba-x1-pro-max",
    categorySlug: "robotic-pool-cleaners",
    eyebrow: "Robotic pool cleaner review",
    title: "Aiper Scuba X1 Pro Max review",
    seoTitle: "Aiper Scuba X1 Pro Max Review — It Skims the Surface Too",
    metaDescription:
      "Our Aiper Scuba X1 Pro Max review: the only robot here that skims the " +
      "surface as well as the floor. The 8,500 GPH claim and the three-year " +
      "warranty.",
    verdict:
      /* "The most expensive machine we cover" until 13 August 2026, at
         $1,699.99, against the Beatbot at $2,199. True when it was written and
         overtaken when the Beatbot was catalogued. */
      "Near the top of what we cover and the only one that honestly claims all four jobs — " +
      "surface, waterline, walls and floor — with ultrasonic mapping, 8,500 GPH of claimed suction " +
      "and a warranty term matched only by the Beatbot. Twice the price of Aiper's own camera " +
      "robot, and the difference is mostly the skimming.",
    bestFor:
      "A large in-ground pool whose owner wants one machine doing the skimmer's job and the " +
      "cleaner's — surface debris caught before it sinks, then waterline, walls and floor.",
    notIdealFor:
      "Your budget is under four figures, your pool already has surface skimming you like, or it " +
      "is above ground.",
    image: {
      src: "/media/reviews/aiper-scuba-x1-pro-max/hero.webp",
      alt:
        "BotPlanet artwork for the Aiper Scuba X1 Pro Max robotic pool cleaner, shown at the edge " +
        "of a night pool with sensor beams fanning across scattered leaves.",
    },
    figures: [
      {
        afterHeading: "Suction: 8,500 GPH and nine motors",
        src: "/media/reviews/aiper-scuba-x1-pro-max/suction.webp",
        caption:
          "8,500 GPH through a dual-jet system on nine brushless motors — Aiper's figures, printed in its listing title and on its own page. A pump rating, not an independent measurement.",
      },
      {
        afterHeading: "The mode times, decoded",
        src: "/media/reviews/aiper-scuba-x1-pro-max/runtimes.webp",
        caption:
          "The three durations are Aiper's, with two labels straightened out: Amazon names them Skim Mode (up to 12 hours) and Eco Mode (up to 5 hours), and rates floor cleaning at up to 5.5 hours. Neither source names a mode called SuperEco.",
      },
      {
        afterHeading: "Filtration: the same 3-micron story, doubled",
        src: "/media/reviews/aiper-scuba-x1-pro-max/filtration.webp",
        caption:
          "A 180 micron standard mesh paired with a replaceable 3 micron ultra-fine filter in a five-litre basket — the same dual-layer arrangement as the Scuba V3, at flagship scale.",
      },
    ],
    folds: [
      {
        id: "suction-8500-gph-and-nine-motors",
        teaser: "The biggest suction claim in our catalogue, and what a GPH figure does not prove.",
      },
      {
        id: "the-mode-times-decoded",
        teaser: "12, 5 and 5.5 hours are all real — two of the labels on our artwork are not.",
      },
      {
        id: "filtration-the-same-3-micron-story-doubled",
        teaser: "3 μm + 180 μm in a five-litre basket, same as the V3, bigger.",
      },
      {
        id: "what-we-cannot-tell-you",
        teaser: "Five gaps, including the machine's own weight and the 40-sensor figure.",
      },
    ],
    video: {
      url: "https://youtu.be/6sjzrLttXR0",
      title: "Aiper Scuba X1 Pro Max Review: The $2,000+ Pool Robot That STILL Falls Short",
      channel: "The Pool Nerd",
      source: "independent",
      note:
        "Independent, negative, and linked on purpose. This is one of the most expensive machines we list and the strongest published argument against it should be one click away rather than buried. Nothing in it has been used as evidence for a claim on this page.",
    },
    facts: [
      { label: "Cleans", value: "Surface to floor" },
      { label: "Suction", value: "8,500 GPH" },
      { label: "Warranty", value: "3 years" },
      { label: "Power", value: "Cordless battery" },
    ],
    specGroups: [
      {
        heading: "Power and runtime",
        rows: [
          { label: "Power type", value: "Cordless lithium-ion" },
          { label: "Skim mode", value: "Up to 12 hours", note: "Amazon's own mode description." },
          { label: "Eco mode", value: "Up to 5 hours" },
          { label: "Floor cleaning", value: "Up to 5.5 hours", note: "From the listing's efficiency line." },
          { label: "Charge time", value: null, note: "Not stated on either source we read." },
          { label: "Charging", value: "Wireless, per the listing's feature list" },
        ],
      },
      {
        heading: "Pool compatibility",
        rows: [
          { label: "Installation", value: "In-ground" },
          {
            label: "Max pool length",
            value: "100 ft (researched)",
            note: "From owner research. Amazon says only 'for all in-ground pools'; Aiper's page states no length.",
          },
        ],
      },
      {
        heading: "Cleaning",
        rows: [
          {
            label: "Surfaces",
            value: "Water surface, waterline, walls and floor",
            note: "The only machine we cover that claims all four. Sold as a vacuum AND a robotic pool skimmer.",
          },
          { label: "Suction", value: "8,500 GPH", note: "Aiper's pump rating — the largest claim in our catalogue. Dual-jet, nine brushless motors." },
          {
            label: "Navigation",
            value: "OmniSense+ 2.0 ultrasonic mapping",
            note: "Maps the pool and plans coverage. No camera — debris recognition is the Scuba V3's trick, not this one's.",
          },
          {
            label: "Sensor count",
            value: null,
            note: "Our artwork carries a 40-sensor figure; neither Aiper's page nor the listing states a count. Unverified.",
          },
          { label: "End of cycle", value: "Smart Surface Parking — floats to the edge for collection" },
        ],
      },
      {
        heading: "Filtration",
        rows: [
          { label: "Filter", value: "Dual-layer: 180 μm standard + 3 μm ultra-fine (replaceable)" },
          { label: "Basket capacity", value: "5 L", note: "From the listing's details table." },
        ],
      },
      {
        heading: "Warranty and durability",
        rows: [
          {
            label: "Warranty",
            value: "3 years",
            note: "Stated on Aiper's own page — the longest published term in our catalogue.",
          },
          { label: "Design lifespan", value: "10 years, per Aiper's durability sheet" },
          { label: "Salt tolerance", value: "Tested to 50,000 ppm NaCl", note: "Aiper's own test claim, alongside chlorine to 40 ppm and -4°F to 158°F." },
        ],
      },
      {
        heading: "Handling",
        rows: [
          { label: "Weight", value: null, note: "Not published by Aiper or the listing — a real gap for a machine this size." },
          { label: "Dimensions (L×W×H)", value: "15 × 11 × 17 in" },
          { label: "Model number", value: "X9-Grey", note: "The one Aiper machine with a part number in its listing table." },
        ],
      },
    ],
    skuNote:
      "Specifications describe the bare Aiper Scuba X1 Pro Max in grey, ASIN B0GMPWMS2H, model " +
      "number X9-Grey, from Aiper's own product page and the Amazon listing, both read 4 August " +
      "2026. Two bundles share the name — a caddy version and a HydroComm Pure version — and a " +
      "further listing whose URL says 'Scuba-X1-Pro' names itself 'Scuba X1+Hy Pro' in its own " +
      "fields: a different machine our own register once accepted on the URL and refused once " +
      "read. Check the model name in the details table, never the URL.",
    lastReviewed: "2026-08-04",
  },

  "aiper-seagull-se": {
    slug: "aiper-seagull-se",
    categorySlug: "robotic-pool-cleaners",
    eyebrow: "Robotic pool cleaner review",
    title: "Aiper Seagull SE review",
    seoTitle: "Aiper Seagull SE Review — Floor Only, 90 Minutes",
    metaDescription:
      "Our Aiper Seagull SE review: ninety minutes of floor-only cleaning for a " +
      "small above-ground pool, and the sparsest specification sheet we cover.",
    verdict:
      "The cheapest machine we cover and the most honest thing in the budget end of the market: " +
      "a cordless vacuum that does the floor of a small above-ground pool for ninety minutes and " +
      "does nothing else. No walls, no waterline, no app — and at this price, that is the correct " +
      "product, not a compromise.",
    bestFor:
      "A small, flat-bottomed above-ground pool where the job is sand and sunk leaves on the " +
      "floor, and a first robot for anyone learning what one changes.",
    notIdealFor:
      "An in-ground pool with real walls, a waterline ring, or anyone who wants an app, a " +
      "schedule or a map.",
    image: {
      src: "/media/reviews/aiper-seagull-se/hero.webp",
      alt:
        "BotPlanet artwork for the Aiper Seagull SE compact cordless pool cleaner, shown at a " +
        "poolside beside its retrieval hook.",
    },
    figures: [
      {
        afterHeading: "What 90 minutes actually covers",
        src: "/media/reviews/aiper-seagull-se/battery.webp",
        caption:
          "Ninety minutes is Aiper's own figure. The 2x battery badge rounds up — Aiper's published claim is an 80% increase over what it calls similar Seagull models.",
      },
      {
        afterHeading: "Getting it in and out",
        src: "/media/reviews/aiper-seagull-se/retrieval.webp",
        caption:
          "The retrieval hook ships in the box and fits a standard pole. At the end of a cycle the machine parks itself against the pool wall — Aiper's own description.",
      },
      {
        afterHeading: "The sparsest specification sheet we cover",
        src: "/media/reviews/aiper-seagull-se/charging.webp",
        caption:
          "The 2.5-hour recharge is the surviving Amazon listing's figure; Aiper's own page says only that charging time halved against earlier Seagull models, and states no absolute number.",
      },
    ],
    folds: [
      {
        id: "getting-it-in-and-out",
        teaser: "Self-parking at the wall, a hook in the box, and one number nobody publishes.",
      },
      {
        id: "the-renewed-listing-and-the-100-minute-trap",
        teaser: "A refurbished listing advertises 100 minutes; Aiper's page says 90.",
      },
      {
        id: "what-we-cannot-tell-you",
        teaser: "Six gaps, most of them because Aiper publishes almost nothing.",
      },
    ],
    video: {
      url: "https://youtu.be/LcwUL8iIojI",
      title: "Back and (Not) Better than Ever? Aiper Seagull SE Robotic Pool Cleaner Review",
      channel: "PoolPad",
      source: "independent",
      note:
        "An independent review, and a sceptical one. It makes the point our own page does: this is a floor-only machine with no rotating brush, and the review is worth watching precisely because it does not assume the newer model is the better one.",
    },
    facts: [
      { label: "Power", value: "Cordless battery" },
      { label: "Cleans", value: "Floor only" },
      { label: "Runtime", value: "90 min" },
      { label: "Pool type", value: "Above-ground" },
    ],
    specGroups: [
      {
        heading: "Power and runtime",
        rows: [
          { label: "Power type", value: "Cordless lithium-ion" },
          { label: "Runtime", value: "90 minutes", note: "Aiper's own figure, from its current product page." },
          {
            label: "Charge time",
            value: "~2.5 hours",
            note: "The surviving Amazon listing's figure. Aiper's page states only that charging halved against earlier Seagull models.",
          },
          { label: "Battery capacity", value: null, note: "Not published anywhere we read." },
        ],
      },
      {
        heading: "Pool compatibility",
        rows: [
          { label: "Installation", value: "Above-ground" },
          {
            label: "Max pool size",
            value: "~33 ft (researched)",
            note: "Our research. Aiper publishes no maximum length or area for this machine.",
          },
        ],
      },
      {
        heading: "Cleaning",
        rows: [
          {
            label: "Surfaces",
            value: "Pool floor only",
            note: "No walls, no waterline. In a soft-sided above-ground pool the floor is the whole job.",
          },
          { label: "Navigation", value: "Random path, no mapping", note: "Self-parks against the pool wall at the end of a cycle." },
          { label: "Filter", value: null, note: "Aiper publishes no filter description or micron rating at all." },
        ],
      },
      {
        heading: "Control and support",
        rows: [
          { label: "App", value: "None — a power button is the interface" },
          {
            label: "Warranty",
            value: null,
            note: "No term stated on Aiper's product page. Older research recorded one year; we cannot currently show a source for it.",
          },
        ],
      },
      {
        heading: "Handling",
        rows: [
          { label: "Weight", value: null, note: "Not published — the one handling fact we would most like to give you." },
          { label: "In the box", value: "Cleaner, 2× brushes, 2× wheels, retrieval hook, charger", note: "From Aiper's own page." },
        ],
      },
    ],
    skuNote:
      "Specifications come from Aiper's current Seagull SE product page and the surviving Amazon " +
      "listing (B0DJ6MV81N, 'Seagull SE 2025'), both read 4 August 2026. A second Amazon listing — " +
      "the '2026 model', ZT20032026, sold by AiperDirect — returned a 404 the day this review was " +
      "written, and a Renewed listing advertising 100 minutes remains refused as refurbished " +
      "stock. Aiper publishes no SKU on its own page, so check the listing title names the " +
      "Seagull SE.",
    lastReviewed: "2026-08-04",
  },

  "aiper-scuba-s1": {
    slug: "aiper-scuba-s1",
    categorySlug: "robotic-pool-cleaners",
    eyebrow: "Robotic pool cleaner review",
    title: "Aiper Scuba S1 review",
    seoTitle: "Aiper Scuba S1 Review — The Runtime Aiper States Twice",
    metaDescription:
      "Our Aiper Scuba S1 review: four-zone cleaning including 12-inch ledges, a " +
      "runtime Aiper states two different ways, and the listing we refuse to link " +
      "to.",
    verdict:
      "Aiper's mid-range all-rounder: cordless, wall-climbing, waterline-scrubbing, with the " +
      "flagships' 3-micron filtration and a shallow-ledge claim most robots cannot make. Held " +
      "back only by its paperwork — Aiper's page disagrees with itself twice, and the sole Amazon " +
      "listing fails our identity checks.",
    bestFor:
      "An in-ground pool up to 50 ft — especially one with a tanning ledge or shallow steps — " +
      "where you want every wet surface handled at a mid-range price.",
    notIdealFor:
      "A pool longer than 50 ft, anyone who wants the surface skimmed, or anyone who wants a " +
      "camera choosing where to clean.",
    image: {
      src: "/media/reviews/aiper-scuba-s1/hero.webp",
      alt:
        "BotPlanet artwork for the Aiper Scuba S1 cordless robotic pool cleaner, shown at the " +
        "edge of a night pool beside a phone running the Aiper app.",
    },
    figures: [
      {
        afterHeading: "Four zones, including the one robots skip",
        src: "/media/reviews/aiper-scuba-s1/four-zone.webp",
        caption:
          "Aiper's own four zones: shallow areas, waterline, walls and floors. The shallow claim comes with a number — as little as 12 inches of water — and it is the uncommon one.",
      },
      {
        afterHeading: "Suction and filtration: the flagship parts, downsized",
        src: "/media/reviews/aiper-scuba-s1/filtration.webp",
        caption:
          "The 180 micron basket in front of the 3 micron MicroMesh layer — Aiper's figures, the same arrangement as its flagships, in a 3.5 litre basket.",
      },
      {
        afterHeading: "Five modes and the weekly plan",
        src: "/media/reviews/aiper-scuba-s1/modes.webp",
        caption:
          "Wall, eco, auto, floor and schedule — the five modes on Aiper's page, with the weekly plan the schedule runs. A cordless schedule still depends on someone putting it back on charge.",
      },
    ],
    folds: [
      {
        id: "suction-and-filtration-the-flagship-parts-downsized",
        teaser: "4,200 GPH and the catalogue's finest filter rating, on its cheapest carrier.",
      },
      {
        id: "five-modes-and-the-weekly-plan",
        teaser: "Schedule, wall, floor, auto, eco — and the one manual step nobody mentions.",
      },
      {
        id: "in-ground-or-above-ground-aipers-page-points-both-ways",
        teaser: "The spec block says in-ground; the copy says both. Both sentences are Aiper's.",
      },
      {
        id: "what-we-cannot-tell-you",
        teaser: "Six gaps, including which of Aiper's two runtime figures is real.",
      },
    ],
    video: {
      url: "https://youtu.be/BPgwv0olFKI",
      title: "Aiper Scuba S1 Review: The TRUTH After 30 Days | 5 Point Test & Final Score",
      channel: "Clear Water Chronicles",
      source: "independent",
      note:
        "Independent, not ours and not Aiper's. Thirty days and a five-point test rather than a first impression, which on a cordless machine is the only kind of review worth reading — the battery is the specification that decays.",
    },
    facts: [
      { label: "Cleans", value: "Floor, walls, waterline" },
      { label: "Power", value: "Cordless battery" },
      { label: "Max pool length", value: "50 ft" },
      { label: "Filter", value: "3 μm + 180 μm" },
    ],
    specGroups: [
      {
        heading: "Power and runtime",
        rows: [
          { label: "Power type", value: "Cordless lithium-ion" },
          {
            label: "Runtime",
            value: "150 or 180 minutes — Aiper states both",
            note: "The spec block says up to 180; marketing copy on the same page says the full 150. Likely mode-dependent, but the page does not say so.",
          },
          { label: "Charge time", value: "3–4 hours", note: "A range, quoted as one." },
          { label: "Charging", value: "Wall charger — no dock" },
          { label: "Battery capacity", value: null, note: "Not published." },
        ],
      },
      {
        heading: "Pool compatibility",
        rows: [
          {
            label: "Installation",
            value: "In-ground (spec) / both (copy)",
            note: "Aiper's specification block says in-ground; marketing copy on the same page says above-ground too. Both sentences are Aiper's.",
          },
          { label: "Max pool", value: "50 ft / 1,600 sq ft", note: "Aiper's stated ceiling." },
          {
            label: "Shallow areas",
            value: "As little as 12 in of water",
            note: "Aiper's own claim, and the uncommon one — most robots beach on a tanning ledge.",
          },
        ],
      },
      {
        heading: "Cleaning",
        rows: [
          { label: "Surfaces", value: "Floor, walls, waterline and shallow areas", note: "Aiper's four-zone claim, from its own page." },
          { label: "Suction", value: "4,200 GPH", note: "Aiper's figure." },
          { label: "Navigation", value: "WavePath 2.0 planned paths", note: "No camera, no sonar — the middle option between the V3 and a random walk." },
        ],
      },
      {
        heading: "Filtration",
        rows: [
          { label: "Filter", value: "180 μm basket + 3 μm MicroMesh ultra-fine" },
          { label: "Basket capacity", value: "3.5 L" },
        ],
      },
      {
        heading: "Control and support",
        rows: [
          { label: "App", value: "Modes, cleaning history, OTA updates" },
          { label: "Modes", value: "Schedule, wall, floor, automatic, eco" },
          { label: "Weekly plan", value: "45-minute sessions, up to every 48 hours", note: "Aiper's framing of the schedule." },
          {
            label: "Warranty",
            value: null,
            note: "No term stated on Aiper's product page. Our research holds two years; we cannot currently show a source.",
          },
        ],
      },
      {
        heading: "Handling",
        rows: [
          { label: "Weight", value: null, note: "Not published — a pattern with Aiper." },
          { label: "Dimensions", value: null },
          { label: "In the box", value: "Cleaner, DC charger, manual, retrieval hook", note: "From Aiper's own page." },
        ],
      },
    ],
    skuNote:
      "Specifications come from Aiper's own Scuba S1 product page, read 31 July 2026 and " +
      "re-confirmed 4 August 2026. Aiper publishes no SKU. The sole new-condition Amazon listing " +
      "is refused by our identity register: its model name says 'Scuba S1 2026', its part number " +
      "says 'X5 Pro 2026', and its title claims 270 minutes — half again more than Aiper's own " +
      "page. A renewed listing repeating the 270-minute claim is refused as refurbished stock. " +
      "Check the details table, not the title, before buying anywhere.",
    lastReviewed: "2026-08-04",
  },

  "bublue-bubot-800p": {
    slug: "bublue-bubot-800p",
    categorySlug: "robotic-pool-cleaners",
    eyebrow: "Robotic pool cleaner review",
    title: "BuBlue Bubot 800P Gen2 review",
    seoTitle: "BuBlue Bubot 800P Review — Gen2, Corded, So It Never Quits",
    metaDescription:
      "Our BuBlue Bubot 800P review: corded four-zone cleaning that never runs " +
      "out of battery, and what its shallow-water claim really means in a pool.",
    verdict:
      "The corded contrarian of the upper mid-range: unlimited mains power, floor-wall-waterline " +
      "coverage plus steps, published figures many bigger brands withhold, and a stated one-year " +
      "warranty for about $800. The soft spots are the brand's short track record and a " +
      "shallow-water story that is avoidance, not cleaning.",
    bestFor:
      "A pool up to about 1,076 sq ft where you want every wet surface handled without owning " +
      "a battery, from a young brand that shows its numbers.",
    notIdealFor:
      "A pool much over 1,000 sq ft, anyone who hates cables on principle, or anyone who wants " +
      "a decade-old brand behind the warranty.",
    image: {
      src: "/media/reviews/bublue-bubot-800p/hero.webp",
      alt:
        "BotPlanet artwork for the BuBlue Bubot 800P Gen2 corded robotic pool cleaner, shown on " +
        "a sunlit pool deck with size and cable-length callouts.",
    },
    figures: [
      {
        afterHeading: "Suction: the numbers BuBlue actually publishes",
        src: "/media/reviews/bublue-bubot-800p/filtration.webp",
        caption:
          "Two 3-litre baskets behind 180-micron ultra-fine filtration — six litres in total. These figures are BuBlue's own, confirmed on its product page.",
      },
      {
        afterHeading: "Four zones, and what \"shallow\" really means here",
        src: "/media/reviews/bublue-bubot-800p/shallow.webp",
        caption:
          "Our artwork prints a 12-inch minimum depth. No source states one: BuBlue's own claim is that its sensors bypass shallow zones — avoidance, not cleaning. Treat the picture as illustration.",
      },
      {
        afterHeading: "The app: path width, car mode and schedules",
        src: "/media/reviews/bublue-bubot-800p/schedule.webp",
        caption:
          "Scheduled cleans booked from the app's calendar. Corded, so a schedule never fails because somebody forgot to put the robot back on charge.",
      },
    ],
    folds: [
      {
        id: "the-app-path-width-car-mode-and-schedules",
        teaser: "Path width, a remote-control car mode, and schedules that never meet a flat battery.",
      },
      {
        id: "above-ground-or-in-ground-both-answers-exist",
        teaser: "BuBlue's FAQ says above-ground; its materials list says in-ground. Both are BuBlue's.",
      },
      {
        id: "warranty-support-and-the-strike-through-price",
        teaser: "A real one-year warranty — and why the $1,099 'regular price' is theatre.",
      },
      {
        id: "what-we-cannot-tell-you",
        teaser: "Six gaps, including the cable length neither source states.",
      },
    ],
    video: {
      url: "https://youtu.be/Zax9PjIHMjY",
      title: "BUBLUE Bubot 800P Gen2 Robotic Pool Cleaner Review | Powerful Suction & AI Pool Mapping",
      channel: "Legendary Tech",
      source: "independent",
      note:
        "Independent, and it names the Gen2 explicitly \u2014 which matters, because BuBlue sells a 300P, a 500P and an 800P and the generation is what our catalogue row is pinned to. Not our testing.",
    },
    facts: [
      { label: "Cleans", value: "Floor, walls, waterline" },
      { label: "Power", value: "Corded mains" },
      { label: "Max pool area", value: "1,076 sq ft" },
      { label: "Filter", value: "180 μm, 2 × 3 L" },
    ],
    specGroups: [
      {
        heading: "Power and runtime",
        rows: [
          { label: "Power type", value: "Corded mains" },
          { label: "Runtime", value: "Unlimited — no battery", note: "No cycle duration is published either." },
          {
            label: "Cable length",
            value: "≈50 ft (our research)",
            note: "Neither BuBlue's page nor the listing states it — and a cord length is not a pool rating.",
          },
          { label: "Motor", value: "150 W three-axis", note: "BuBlue's figure." },
        ],
      },
      {
        heading: "Pool compatibility",
        rows: [
          {
            label: "Installation",
            value: "Above-ground (FAQ) / in-ground materials",
            note: "BuBlue's FAQ says ideal for above-ground; the same FAQ lists vinyl, fibreglass and concrete. Both sentences are BuBlue's.",
          },
          { label: "Max pool", value: "1,076 sq ft", note: "An area rating only — BuBlue publishes no length figure." },
          {
            label: "Shallow areas",
            value: "Sensor bypass — avoidance",
            note: "BuBlue claims its sensors bypass shallow zones. Cleaning them is not the claim, and no minimum depth is published.",
          },
        ],
      },
      {
        heading: "Cleaning",
        rows: [
          { label: "Surfaces", value: "Floor, walls, waterline, plus steps and platforms", note: "From the listing title and BuBlue's page." },
          { label: "Suction", value: "3,566 GPH", note: "BuBlue's pump figure, not an independent measurement." },
          { label: "Brushes", value: "4 roller brushes, 2 suction ports", note: "BuBlue's Bluehole arrangement." },
          { label: "Navigation", value: "Ultrasonic sensors, planned paths", note: "No camera, no sonar mapping." },
        ],
      },
      {
        heading: "Filtration",
        rows: [
          { label: "Filter", value: "180 μm ultra-fine" },
          { label: "Basket capacity", value: "2 × 3 L (6 L total)" },
        ],
      },
      {
        heading: "Control and support",
        rows: [
          { label: "App", value: "Bluetooth / Wi-Fi — modes, schedules, path width, car mode, waterline return" },
          { label: "Modes", value: "Wall, floor, eco, auto" },
          {
            label: "Warranty",
            value: "1 year",
            note: "Stated on BuBlue's own page, with a 30-day money-back guarantee and 24/7 support beside it.",
          },
        ],
      },
      {
        heading: "Handling",
        rows: [
          { label: "Weight", value: null, note: "Not published by BuBlue or the listing." },
          {
            label: "Dimensions",
            value: "19 × 18 × 9 in",
            note: "From the Amazon listing's details table; our artwork prints slightly different figures.",
          },
          { label: "Retrieval", value: "One-tap return to the waterline from the app" },
        ],
      },
    ],
    skuNote:
      "Specifications come from BuBlue's own product page, read 4 August 2026, and the Amazon " +
      "listing's details table, machine-read 3 August 2026. The Model Number field reads " +
      "'Bubot 800P gen2', which settles the 800P / 880P question outright — BuBlue sells a " +
      "Bubot family with several near-identical names, so check the details table, not the " +
      "title, before buying anywhere.",
    lastReviewed: "2026-08-04",
  },

  "wybot-c1": {
    slug: "wybot-c1",
    categorySlug: "robotic-pool-cleaners",
    eyebrow: "Robotic pool cleaner review",
    title: "WYBOT C1 review",
    seoTitle: "WYBOT C1 Review — Waterline Cleaning at the Budget End",
    metaDescription:
      "Our WYBOT C1 review: floor, wall and waterline cleaning at the budget end, " +
      "and a weekly timer that splits one charge into four separate cleans.",
    verdict:
      "The best budget case in our catalogue for a pool with walls worth climbing: " +
      "floor-wall-waterline coverage, a genuinely useful weekly cycle timer and a stated " +
      "2-year warranty for about $500. The honest trade-offs are a 180-micron filter with no " +
      "ultra-fine layer, mid-pack runtime, and an Amazon listing that a person — not a " +
      "machine — had to identity-check.",
    bestFor:
      "A small-to-mid pool, above-ground or in-ground, where the budget stops short of four " +
      "figures but the job list still includes walls, waterline, steps and a weekly schedule.",
    notIdealFor:
      "A pool over 1,615 sq ft, anyone who wants ultra-fine filtration or a camera, or anyone " +
      "who wants the water surface skimmed.",
    image: {
      src: "/media/reviews/wybot-c1/hero.webp",
      alt:
        "BotPlanet artwork for the WYBOT C1 cordless robotic pool cleaner, shown poolside at " +
        "night beside a phone running the WYBOT app.",
    },
    figures: [
      {
        afterHeading: "Suction: 3,038 GPH, and the numbers on our artwork",
        src: "/media/reviews/wybot-c1/suction.webp",
        caption:
          "Leaves, dirt, hair and twigs into a 180-micron filter — WYBOT's own claims. The 11.5 m³/h printed here is WYBOT's 3,038 GPH converted; the 65 W and four-wheel-drive figures have no WYBOT source we have read.",
      },
      {
        afterHeading: "The cycle timer: four cleans from one charge",
        src: "/media/reviews/wybot-c1/cycles.webp",
        caption:
          "One charge, split one to four ways across the week from the app. The splits sum to 120 minutes; WYBOT's headline runtime says up to 150. Both numbers are WYBOT's — see the arithmetic note above.",
      },
      {
        afterHeading: "Charging, battery and retrieval",
        src: "/media/reviews/wybot-c1/charging.webp",
        caption:
          "The 3-hour charge is WYBOT's own figure. The 4,600 mAh beside it is our research — WYBOT publishes no battery capacity, and no source we read states one.",
      },
    ],
    folds: [
      {
        id: "five-modes-six-paths-and-the-s-path-brain",
        teaser: "Full, floor, wall, wall-then-floor and eco — and why the sequencing mode matters.",
      },
      {
        id: "the-cycle-timer-four-cleans-from-one-charge",
        teaser: "One charge, four scheduled cleans — and the 120-versus-150 arithmetic WYBOT leaves open.",
      },
      {
        id: "charging-battery-and-retrieval",
        teaser: "Three hours to charge, self-parking at the waterline, and 17.6 lbs to lift.",
      },
      {
        id: "what-we-cannot-tell-you",
        teaser: "Six gaps, including three numbers printed on our own artwork.",
      },
    ],
    video: {
      url: "https://youtu.be/aJMA-8lp73c",
      title: "Pool Cleaner Suction Power Rankings — WYBOT C1 Tested",
      channel: "Clear Water Chronicles",
      source: "independent",
      note:
        "Independent, and it measures rather than describes — suction ranked against other machines. Not our testing, and the closest thing to a controlled comparison we could find for this model.",
    },
    facts: [
      { label: "Cleans", value: "Floor, walls, waterline" },
      { label: "Power", value: "Cordless battery" },
      { label: "Max pool area", value: "1,615 sq ft" },
      { label: "Filter", value: "180 μm" },
    ],
    specGroups: [
      {
        heading: "Power and runtime",
        rows: [
          { label: "Power type", value: "Cordless lithium-ion" },
          {
            label: "Runtime",
            value: "Up to 150 minutes",
            note: "WYBOT's headline figure. The cycle timer's splits sum to 120 — see the review.",
          },
          { label: "Charge time", value: "3 hours", note: "WYBOT's own comparison table." },
          { label: "Battery capacity", value: null, note: "Not published. Our artwork's 4,600 mAh is research, not a WYBOT statement." },
        ],
      },
      {
        heading: "Pool compatibility",
        rows: [
          {
            label: "Installation",
            value: "Above-ground and in-ground",
            note: "WYBOT's own classification, for all pool shapes. Our catalogue said in-ground only until this review was written.",
          },
          { label: "Max pool", value: "1,615 sq ft", note: "An area rating; WYBOT publishes no length figure." },
        ],
      },
      {
        heading: "Cleaning",
        rows: [
          { label: "Surfaces", value: "Floor, walls, waterline, steps and slopes", note: "WYBOT's own coverage list." },
          { label: "Suction", value: "3,038 GPH", note: "WYBOT's pump figure — 11.5 m³/h in metric." },
          { label: "Brushes", value: "Dual PVC brushes" },
          { label: "Navigation", value: "S-path / N-path planned paths", note: "No camera, no sonar — the planned-path middle class." },
          { label: "Modes", value: "Full, floor, wall, wall-then-floor, eco floor", note: "Five modes over six cleaning paths." },
        ],
      },
      {
        heading: "Filtration",
        rows: [
          { label: "Filter", value: "180 μm ultra-fine filter", note: "One stated fineness — no second, finer layer like Aiper's 3 μm." },
        ],
      },
      {
        heading: "Control and support",
        rows: [
          { label: "App", value: "WYBOT app — modes, remote control, cycle timer, OTA updates" },
          { label: "Scheduling", value: "Up to 4 cycles per week from one charge", note: "WYBOT's cycle timer." },
          {
            label: "Warranty",
            value: "2 years",
            note: "Stated by WYBOT, with a 30-day return and 30-day price guarantee beside it.",
          },
        ],
      },
      {
        heading: "Handling",
        rows: [
          { label: "Weight", value: "17.6 lbs", note: "WYBOT's figure — one of the lighter wall-climbers we cover." },
          { label: "Retrieval", value: "Self-parks at the waterline", note: "WYBOT's claim." },
          { label: "Dimensions", value: null, note: "Not published." },
        ],
      },
    ],
    skuNote:
      "Specifications come from WYBOT's own C1 product page, read 31 July 2026 and re-read 4 " +
      "August 2026. WYBOT publishes no model number for the C1, and it sells C1, C1 Pro and " +
      "C1 Max as separate machines — one rejected Amazon candidate was titled C1 but read " +
      "C1 PLUS in its identity fields. Check the listing says C1, alone, before buying anywhere.",
    lastReviewed: "2026-08-04",
  },

  "beatbot-aquasense-2-ultra": {
    slug: "beatbot-aquasense-2-ultra",
    categorySlug: "robotic-pool-cleaners",
    eyebrow: "Robotic pool cleaner review",
    title: "Beatbot AquaSense 2 Ultra review",
    seoTitle: "Beatbot AquaSense 2 Ultra Review — Five Jobs, One Robot",
    metaDescription:
      "Our Beatbot AquaSense 2 Ultra review: five jobs in one machine, a camera " +
      "that maps your pool, and a three-year warranty that changes the sums.",
    verdict:
      "The ceiling of our catalogue: floor, walls, waterline, surface skimming and a " +
      "clarification system nobody else attempts, behind a pool-mapping camera stack and an " +
      "industry-first 3-year full replacement warranty — for $2,299. Worth it for the big, " +
      "complicated pool that uses all five jobs; overkill for everyone else.",
    bestFor:
      "A large, debris-heavy in-ground pool — up to 3,875 sq ft of floor per cycle — whose " +
      "owner wants sunk debris, walls, waterline, floating leaves and cloudy water handled by " +
      "one machine.",
    notIdealFor:
      "Modest or above-ground pools, buyers who want skimming without flagship money, or " +
      "anyone a WYBOT C1 or Aiper Scuba S1 would serve at a fraction of the price.",
    image: {
      src: "/media/reviews/beatbot-aquasense-2-ultra/hero.webp",
      alt:
        "BotPlanet artwork for the Beatbot AquaSense 2 Ultra robotic pool cleaner, shown on " +
        "its dock beside an infinity pool at dusk with a phone running the Beatbot app.",
    },
    figures: [
      {
        afterHeading: "One machine, five jobs — including two nobody else does",
        src: "/media/reviews/beatbot-aquasense-2-ultra/coverage.webp",
        caption:
          "Beatbot's 5-in-1 set: surface, clarification, walls, platforms, waterline and floor. The \"multizone mode\" label is our artwork's phrasing — Beatbot calls it Adaptive Multi-Platform Cleaning.",
      },
      {
        afterHeading: "HybridSense, CleverNav and the camera that maps your pool",
        src: "/media/reviews/beatbot-aquasense-2-ultra/navigation.webp",
        caption:
          "CleverNav path planning over a HybridSense map: camera, infrared, ultrasonic and dual time-of-flight sensors, with inlets, drains and ladders treated as obstacles. Both names are Beatbot's own.",
      },
      {
        afterHeading: "The battery: three runtimes and a lab-tested footnote",
        src: "/media/reviews/beatbot-aquasense-2-ultra/battery.webp",
        caption:
          "13,400 mAh, with Beatbot's own footnote about the 3,875 sq ft figure reproduced at the base. One correction: this creative says up to 11 hours for surface cleaning — Beatbot's page says up to 10, and 10 is the number to plan on.",
      },
    ],
    folds: [
      {
        id: "clarification-the-robot-that-doses-your-water",
        teaser: "The fifth job: a clarifying agent released as it drives, refills sold separately.",
      },
      {
        id: "the-battery-three-runtimes-and-a-lab-tested-footnote",
        teaser: "13,400 mAh, three different runtime claims, and the asterisk on 3,875 sq ft.",
      },
      {
        id: "the-name-the-family-and-the-listing-we-could-not-machine-read",
        teaser: "Five near-identical model names, one transposed on our own artwork — and why it matters.",
      },
      {
        id: "what-we-cannot-tell-you",
        teaser: "Six gaps, including a live Amazon price and what clarification does to your chemistry.",
      },
    ],
    video: {
      url: "https://youtu.be/CicRheJU5GI",
      title: "I Tested the Beatbot AquaSense 2 Ultra — Here's Why It's Not Worth $3,000",
      channel: "The Pool Nerd",
      source: "independent",
      note:
        "An independent negative review, deliberately chosen. This is the most expensive machine on the site and the case against it deserves to be one click away rather than buried. Watch it before you spend, not after.",
    },
    facts: [
      { label: "Cleans", value: "Floor, walls, waterline, surface" },
      { label: "Power", value: "Cordless battery" },
      { label: "Max cleaning area", value: "3,875 sq ft" },
      { label: "Warranty", value: "3-year full replacement" },
    ],
    specGroups: [
      {
        heading: "Power and runtime",
        rows: [
          { label: "Power type", value: "Cordless lithium-ion, wireless charging dock" },
          { label: "Battery capacity", value: "13,400 mAh", note: "The largest in our catalogue." },
          {
            label: "Runtime",
            value: "Up to 10 h surface / 5 h floor / 5 h walls and waterline",
            note: "Three mode figures, all Beatbot's. Our artwork's 11-hour surface figure has no source — plan on 10.",
          },
          { label: "Charge time", value: "4.5 hours", note: "Beatbot's figure." },
        ],
      },
      {
        heading: "Pool compatibility",
        rows: [
          { label: "Installation", value: "In-ground", note: "Beatbot's marketing; no above-ground rating." },
          {
            label: "Max cleaning area",
            value: "3,875 sq ft",
            note: "Beatbot's own footnote: floor cleaning in one full battery cycle, lab-tested. Other jobs draw the same battery.",
          },
        ],
      },
      {
        heading: "Cleaning",
        rows: [
          { label: "Surfaces", value: "5-in-1: floor, walls, waterline, water surface, clarification", note: "Beatbot's own coverage list." },
          { label: "Platforms", value: "Adaptive Multi-Platform Cleaning", note: "Ledges, slopes and raised shelves — Beatbot's claim." },
          { label: "Clarification", value: "ClearWater clarifying agent, released while cleaning", note: "Described by Beatbot as 100% natural; refill kits sold separately." },
          { label: "Navigation", value: "HybridSense AI camera + IR + ultrasonic + dual TOF, CleverNav path planning", note: "Full pool mapping with obstacle awareness." },
        ],
      },
      {
        heading: "Filtration",
        rows: [
          { label: "Filter", value: "Two-stage, down to 150 μm", note: "Beatbot's stated fineness — from twigs to 150-micron particles." },
        ],
      },
      {
        heading: "Control and support",
        rows: [
          { label: "App", value: "Scheduling, water temperature, alerts, one-tap poolside return" },
          {
            label: "Warranty",
            value: "3-year full replacement",
            note: "Beatbot calls it the industry's first. The longest and strongest term in our catalogue.",
          },
        ],
      },
      {
        heading: "Handling",
        rows: [
          { label: "Weight", value: null, note: "Not published by Beatbot; our research holds about 29 lbs." },
          { label: "Dimensions", value: null, note: "Not published." },
          { label: "Retrieval", value: "Smart return — surfaces at the poolside on one tap" },
        ],
      },
    ],
    skuNote:
      "Specifications come from Beatbot's own AquaSense 2 Ultra page, read 31 July 2026 and " +
      "re-read 4 August 2026, and its manual index. Beatbot publishes no SKU; the retired " +
      "Amazon listing's details table read PRCMDS02G-2025. Beatbot sells five machines whose " +
      "names differ by a suffix — AquaSense, Pro, 2, 2 Pro, 2 Ultra — so check the details " +
      "table names the 2 Ultra before buying anywhere.",
    lastReviewed: "2026-08-04",
  },

  /* ---------------- WINDOW-CLEANING ROBOTS ----------------
     Built 6 August 2026. The category had eleven published products, verified
     manufacturer specifications and captured ASINs since 5 August, and not one
     review — eleven buy buttons with no page to press them from.

     ONE THING IS TRUE OF EVERY REVIEW BELOW and is stated in each of them: no
     window ASIN has been identity-verified yet. All eleven were captured from
     Amazon search results rather than machine-read for Brand and Model Number
     the way the WYBOT C1 and the Aiper Scuba V3 were. That is a real gap, it
     is named on every page, and it is the reason no window review prints a
     price in its prose — the buy box handles price, with its check date, and
     the offer-truth engine decides whether it may be shown at all. */
  "ecovacs-winbot-w2-pro-omni": {
    slug: "ecovacs-winbot-w2-pro-omni",
    /* FIRST WINDOW REVIEW WITH ARTWORK, 7 August 2026. Four owner-supplied
       creatives arrived through the Notion image-request page; this is the
       wiring that puts them on the page. The lead image is the product
       creative — the same file the catalogue card and the hub grid resolve to
       — so a reader meets the machine once and consistently.

       Captions carry the corrections. Two of these creatives print
       manufacturer claim copy ("Powerful Suction", "Industry-first
       Three-nozzle Spray") that this review does not accept at face value,
       and the standing rule is to publish the picture and state the
       correction underneath rather than withhold it. A reader who sees the
       claim and reads the qualification has been told the truth and kept the
       picture. */
    image: {
      src: "/media/products/ecovacs-winbot-w2-pro-omni.webp",
      alt:
        "BotPlanet artwork for the ECOVACS WINBOT W2 PRO Omni window cleaning robot, shown on a " +
        "floor-to-ceiling window at dusk with its portable power station on the floor below.",
    },
    figures: [
      {
        afterHeading: "Who this is for",
        src: "/media/reviews/ecovacs-winbot-w2-pro-omni/winbot-on.webp",
        caption:
          "The station on the floor is what this model is for: the robot works a window with no socket under it. The \u201cWorld\u2019s No.1\u201d badge in this artwork is ECOVACS\u2019 own claim, sourced to its internal data and AVC statistics to March 2024 \u2014 we have not verified it and it carries no weight in our rating.",
      },
      {
        afterHeading: "The battery station is the product",
        src: "/media/reviews/ecovacs-winbot-w2-pro-omni/all-from-inside.webp",
        caption:
          "The station is the whole reason to buy this model rather than the plain W2 PRO: the robot works a window with no socket beneath it. Note the cable still running to the wall in this artwork — the station powers the robot, it does not make the system wireless.",
      },
      {
        afterHeading: "Safety, and the number to actually read",
        src: "/media/reviews/ecovacs-winbot-w2-pro-omni/three-nozzle-spray.webp",
        caption:
          "Three nozzles spread water across the pane ahead of the pads. ECOVACS calls the arrangement industry-first; we have not verified that claim against any other maker's range and it carries no weight in our rating either way.",
      },
      {
        afterHeading: "Frameless glass",
        src: "/media/reviews/ecovacs-winbot-w2-pro-omni/cleaning-modes.webp",
        caption:
          "Six cleaning modes, one of them edge-specific — which matters most on frameless glass, where the machine has no frame to feel for and the border is where every robot in this category does its worst work.",
      },
    ],
    categorySlug: "window-cleaning-robots",
    eyebrow: "Window robot review",
    title: "ECOVACS WINBOT W2 PRO Omni review",
    seoTitle: "ECOVACS WINBOT W2 PRO Omni Review — The Cordless One",
    metaDescription:
      "The WINBOT W2 PRO Omni is the only window robot here that works away from " +
      "a socket. What the battery station buys, and when the W2 PRO is the better " +
      "buy.",
    verdict:
      "The only machine in our catalogue that cleans a window nowhere near a plug. That is the whole product — on glass it is a good mid-range robot whose suction is inside the same tolerance range as the cheaper W2 PRO.",
    bestFor:
      "Windows a cable will not reach: stairwell landings, conservatories, rooms where the nearest socket is behind furniture.",
    notIdealFor:
      "Every window you own has a socket under it, your panes are small, or your glass is sloped.",
    video: {
      url: "https://youtu.be/XYQdVSKq8no",
      title: "Can a robot clean my windows? I TESTED the Ecovacs Winbot W2 PRO OMNI",
      channel: "Tech It Before You Wreck It",
      source: "independent",
      note:
        "Independent, not ECOVACS'. It runs the machine on real domestic glass rather than a showroom pane, and shows the station in use, which is the whole reason to buy this model over the plain W2 PRO.",
    },
    facts: [
      { label: "Power", value: "Cordless via station" },
      { label: "Max suction", value: "5,500 Pa ±500" },
      { label: "Power-off hold", value: "30 min", note: "ECOVACS states this across the WINBOT range; the same figure appears on every W-series record we hold and in the category research of 5 August 2026. Not re-read from the product page since." },
      { label: "Glass", value: "Framed and frameless" },
    ],
    specGroups: [
      {
        heading: "Cleaning",
        rows: [
          { label: "Maximum suction", value: "5,500 Pa ±500" },
          { label: "Suction while moving", value: "2,800 Pa" },
          { label: "Water tank", value: "60 ml ±5" },
          { label: "Spray nozzles", value: "6" },
          { label: "Cleaning modes", value: "7" },
        ],
      },
      {
        heading: "Navigation and safety",
        rows: [
          { label: "Navigation", value: "WIN-SLAM 4.0" },
          { label: "Protection stages", value: "12" },
          { label: "Power-off hold", value: "30 minutes", note: "ECOVACS states this across the WINBOT range; the same figure appears on every W-series record we hold and in the category research of 5 August 2026. Not re-read from the product page since." },
          { label: "Glass types", value: "Framed and frameless" },
        ],
      },
      {
        heading: "Physical",
        rows: [
          { label: "Robot weight", value: "1.6 kg ±0.1" },
          { label: "Station weight", value: "5.5 kg" },
          { label: "Robot size", value: "271 × 271 × 77 mm" },
          { label: "Station battery life", value: null },
        ],
      },
    ],
    skuNote:
      "Figures read from ecovacs.com/us on 5 August 2026. ECOVACS sells the W2 PRO, the W2 PRO Omni and the W2S under names differing by one word — check the listing's details table names the W2 PRO Omni before buying.",
    lastReviewed: "2026-08-06",
  },


  "ecovacs-winbot-w2-pro": {
    slug: "ecovacs-winbot-w2-pro",
    categorySlug: "window-cleaning-robots",
    eyebrow: "Window robot review",
    title: "ECOVACS WINBOT W2 PRO review",
    seoTitle:
      "ECOVACS WINBOT W2 PRO Review — The Default WINBOT",
    metaDescription:
      "The WINBOT W2 PRO is the flagship without the battery station, and on " +
      "glass the difference sits inside ECOVACS's own tolerance. When the Omni is " +
      "worth it.",
    verdict:
      "The WINBOT most people should buy: the same navigation, nozzles, tank and modes as the flagship, with suction inside an overlapping tolerance range, minus a 5.5 kg battery station most houses will never need.",
    bestFor:
      "Ordinary framed or frameless windows with a socket somewhere near them.",
    notIdealFor:
      "Windows nowhere near power, small panes where the Mini fits better, or sloped glass.",
    video: {
      url: "https://youtu.be/YbzVEMWzrnk",
      title: "ECOVACS WINBOT W2 PRO Review: Is This Smart Window Cleaner Worth the Investment?",
      channel: "Reviewsinside",
      source: "independent",
      note:
        "Independent, not ECOVACS'. Its title names the plain W2 PRO rather than the Omni, which is the machine this page sells \u2014 but the two are constantly confused in search results, so check for a station on the floor before you take anything in it as applying here. If there is one, you are watching the Omni.",
    },
    facts: [
      { label: "Max suction", value: "5,300 Pa ±500" },
      { label: "Moving suction", value: "2,800 Pa" },
      { label: "Protection stages", value: "10" },
      { label: "Weight", value: "1.8 kg ±0.1" },
    ],
    specGroups: [
      {
        heading: "Cleaning",
        rows: [
          { label: "Maximum suction", value: "5,300 Pa ±500" },
          { label: "Suction while moving", value: "2,800 Pa" },
          { label: "Water tank", value: "60 ml ±5" },
          { label: "Spray nozzles", value: "6" },
          { label: "Cleaning modes", value: "7" },
        ],
      },
      {
        heading: "Navigation and safety",
        rows: [
          { label: "Navigation", value: "WIN-SLAM 4.0" },
          { label: "Protection stages", value: "10" },
          { label: "Power-off hold", value: "30 minutes", note: "ECOVACS states this across the WINBOT range; the same figure appears on every W-series record we hold and in the category research of 5 August 2026. Not re-read from the product page since." },
          { label: "Glass types", value: "Framed and frameless" },
        ],
      },
      {
        heading: "Physical",
        rows: [
          { label: "Robot weight", value: "1.8 kg ±0.1" },
          { label: "Robot size", value: "271 × 271 × 77.5 mm" },
        ],
      },
    ],
    skuNote:
      "Figures read from ecovacs.com/us on 5 August 2026. Three machines share this name family — check the listing's details table names the plain W2 PRO rather than the Omni or the W2S.",
    image: {
      src: "/media/products/ecovacs-winbot-w2-pro.webp",
      alt:
        "BotPlanet artwork for the ECOVACS WINBOT W2 PRO window cleaning robot, shown high " +
        "on a city window at dusk with spray leaving its side.",
    },
    figures: [
      {
        afterHeading: "Who this is for",
        src: "/media/reviews/ecovacs-winbot-w2-pro/three-nozzle-spray.webp",
        caption:
          "Spread is most of what separates a clean pane from a streaked one, and this is where the W2 PRO earns its money. The percentages printed here are ECOVACS\u2019 own and are measured against its cheaper W1 PRO rather than against any rival.",
      },
      {
        afterHeading: "Ten stages, not twelve",
        src: "/media/reviews/ecovacs-winbot-w2-pro/cleaning-modes.webp",
        caption:
          "Seven modes, one of them edge-specific. Note the phone in this artwork: the app screen reads WINBOT W2S, a sibling model, not the W2 PRO \u2014 the app is shared across the range and the screenshot was not reshot for this machine.",
      },
    ],
    lastReviewed: "2026-08-06",
  },

  "ecovacs-winbot-w1-pro": {
    slug: "ecovacs-winbot-w1-pro",
    categorySlug: "window-cleaning-robots",
    eyebrow: "Window robot review",
    title: "ECOVACS WINBOT W1 PRO review",
    seoTitle: "ECOVACS WINBOT W1 PRO Review — The Cheap Way In",
    metaDescription:
      "The WINBOT W1 PRO has half the suction of the W2 PRO, three modes instead " +
      "of seven, and a power-off hold ECOVACS will not put a number on.",
    verdict:
      "The cheapest way into a brand with a real service operation behind it, and honest about being the entry model: 2,800 Pa, three modes, a dual cross nozzle, and the only WINBOT whose power-off hold is claimed without a published duration.",
    bestFor:
      "Finding out whether you want one of these at all, and ordinary framed windows on the lower floors.",
    notIdealFor:
      "Large panes, anyone who wants scheduling or mapping, or anyone above the first floor who wants the longest published safety margin.",
    video: {
      url: "https://youtu.be/T7vKpUNeD9M",
      title: "Uncovering the Truth about Ecovacs Winbot W1 Pro: An Extreme Review!",
      channel: "TDSheridan Lab",
      source: "independent",
      note:
        "Independent, not ECOVACS'. It puts the entry machine on large shop windows, which is precisely the job this review says it is not for — watch it as the stress test rather than the recommendation.",
    },
    facts: [
      { label: "Max suction", value: "2,800 Pa" },
      { label: "Cleaning modes", value: "3" },
      { label: "Protection", value: "8-tier" },
      { label: "Power-off hold", value: "Stated, no figure" },
    ],
    specGroups: [
      {
        heading: "Cleaning",
        rows: [
          { label: "Maximum suction", value: "2,800 Pa" },
          { label: "Suction while moving", value: null },
          { label: "Water tank", value: "60 ml" },
          { label: "Spray nozzles", value: "Dual cross nozzle" },
          { label: "Cleaning modes", value: "3" },
        ],
      },
      {
        heading: "Navigation and safety",
        rows: [
          { label: "Navigation", value: "WIN-SLAM 3.0" },
          { label: "Protection", value: "8-tier" },
          { label: "Power-off hold", value: "No — a carabiner and tether, not a battery", note: "ECOVACS lists \"power-off protection: Yes\" and its own safety copy explains it as arresting a fall with a safety carabiner and tether. No backup battery and no stated duration: it stops holding when the socket does. The only machine of the eleven without a UPS." },
          { label: "Glass types", value: "Framed and frameless" },
        ],
      },
      {
        heading: "Physical",
        rows: [
          { label: "Robot weight", value: "1.53 kg" },
          { label: "Robot size", value: "270 × 270 × 77.5 mm" },
        ],
      },
    ],
    skuNote:
      "Figures read from ecovacs.com/us on 5 August 2026. ECOVACS publishes no moving-suction figure and no power-off duration for this model; both are printed as undisclosed rather than estimated from the rest of the range.",
    image: {
      src: "/media/products/ecovacs-winbot-w1-pro.webp",
      alt:
        "BotPlanet artwork for the ECOVACS WINBOT W1 PRO window cleaning robot, shown on a " +
        "dark plinth with its twin cables hanging.",
    },
    figures: [
      {
        afterHeading: "Who this is for",
        src: "/media/reviews/ecovacs-winbot-w1-pro/hero.webp",
        caption:
          "The entry machine in the WINBOT range, on ordinary rain-streaked glass rather than a tower block \u2014 which is the window it is actually for.",
      },
      {
        afterHeading: "Half the suction, and what that actually costs you",
        src: "/media/reviews/ecovacs-winbot-w1-pro/eight-tier.webp",
        caption:
          "2,800 Pa is the number ECOVACS publishes and this artwork prints it. Read the ring of eight protections beside it and note what is not there: a duration for the power-off hold. Every sibling model gets a published 30 minutes; this one gets the claim without the figure.",
      },
      {
        afterHeading: "Streaking",
        src: "/media/reviews/ecovacs-winbot-w1-pro/cross-spray.webp",
        caption:
          "A 60 ml tank and the dual cross nozzle. Fewer nozzles put the water down in a narrower pattern, and pattern is most of what decides whether a pane dries clean or streaked.",
      },
      {
        afterHeading: "Who should look elsewhere",
        src: "/media/reviews/ecovacs-winbot-w1-pro/app-control.webp",
        caption:
          "Three modes and two water levels, which is the whole app. If you want scheduling or mapping, this is the machine to walk past.",
      },
    ],
    lastReviewed: "2026-08-06",
  },



  "hutt-s55-pro": {
    slug: "hutt-s55-pro",
    categorySlug: "window-cleaning-robots",
    eyebrow: "Window robot review",
    title: "HUTT S55 Pro review",
    seoTitle: "HUTT S55 Pro Review — The Only One Claiming Sloped Glass",
    metaDescription:
      "The HUTT S55 Pro is the only window robot here claiming inclined glass: " +
      "6,500 Pa stated, an 80 ml tank, and a specification we could not verify.",
    verdict:
      "The only machine in our catalogue claiming sloped glass, which is the whole reason it is here. Strong stated numbers — 6,500 Pa, an 80 ml tank, a HydroJet pump — and not one of them confirmed by HUTT's own published page.",
    bestFor:
      "Conservatory roofs, sloping skylights and slanted gable windows, where nothing else here offers to work at all.",
    notIdealFor:
      "Ordinary vertical windows, or anyone who wants manufacturer-confirmed figures before spending.",
    facts: [
      { label: "Sloped glass", value: "Claimed" },
      { label: "Max suction", value: "6,500 Pa (stated)" },
      { label: "Water tank", value: "80 ml" },
      { label: "Verified", value: "No" },
    ],
    specGroups: [
      { heading: "Cleaning", rows: [
        { label: "Maximum suction", value: "6,500 Pa (retailer-stated)" },
        { label: "Water tank", value: "80 ml (retailer-stated)" },
        { label: "Spray system", value: "HydroJet pump" },
      ]},
      { heading: "Navigation and safety", rows: [
        { label: "Navigation", value: "SLAM 4.0 (retailer-stated)" },
        { label: "Glass types", value: "Framed, frameless and sloped (retailer-stated)" },
        { label: "Power-off hold", value: "Yes — emergency backup battery", note: "HUTT publishes the battery and a 148 kg safety rope for this SKU but no duration. The 25 and 30 minute figures in circulation attach to other HUTT models and are not carried across." },
      ]},
      { heading: "Physical", rows: [
        { label: "Robot weight", value: null },
        { label: "Warranty", value: null },
      ]},
    ],
    skuNote:
      "NOTHING HERE IS MANUFACTURER-VERIFIED. Every figure is retailer-stated; we could not find a HUTT product page publishing them. The sloped-glass rating is the reason this product is in the catalogue and it rests on a retail listing — confirm it with HUTT before buying for a conservatory roof.",
    image: {
      src: "/media/products/hutt-s55-pro.webp",
      alt:
        "BotPlanet artwork for the HUTT S55 Pro window cleaning robot, shown on a night " +
        "window with its remote control and spare pads beside it.",
    },
    figures: [
      {
        afterHeading: "Who this is for",
        src: "/media/reviews/hutt-s55-pro/every-surface.webp",
        caption:
          "HUTT sells this as a machine for glass, mirrors, tile and shower screens rather than windows alone. The sloped-glass case below is the unusual one; this is the ordinary one.",
      },
      {
        afterHeading: "The sloped-glass claim, and how much weight to put on it",
        src: "/media/reviews/hutt-s55-pro/safety-backup.webp",
        caption:
          "Thirty minutes of backup battery, and the rope actually attached to an anchor. On angled glass the rope is not a formality \u2014 a machine that loses grip on a slope has somewhere to slide.",
      },
      {
        afterHeading: "The pump, and why it is not the same as spray nozzles",
        src: "/media/reviews/hutt-s55-pro/adaptive-suction.webp",
        caption:
          "The pump and the 120-degree fan on the right, the fan stack on the left. Note the suction here reads 2,000\u20136,500 Pa as an adaptive range, while the card artwork for this same machine prints 3,800 Pa. HUTT publishes 6,500 as the maximum and that is the figure this review uses; the two creatives do not agree with each other.",
      },
      {
        afterHeading: "Who should look elsewhere",
        src: "/media/reviews/hutt-s55-pro/one-click.webp",
        caption:
          "A remote, not an app. SLAM 4.0 is the navigation generation HUTT claims, and there is no phone in this system at all.",
      },
    ],
    lastReviewed: "2026-08-06",
  },

  "mamibot-w120-dp": {
    slug: "mamibot-w120-dp",
    categorySlug: "window-cleaning-robots",
    eyebrow: "Window robot review",
    title: "Mamibot W120-DP review",
    seoTitle: "Mamibot W120-DP Review — The Non-ECOVACS Option",
    metaDescription:
      "The MAMIBOT W120-DP has four nozzles, a 60 ml tank and 3,200 Pa stated, " +
      "from the third brand in the catalogue. What the high-rise rating does not " +
      "tell you.",
    verdict:
      "A reasonable mid-price alternative in a catalogue six-elevenths owned by ECOVACS, with a proper four-nozzle spray spread. The high-rise wording is positioning rather than a specification — the figure that would justify it is not published.",
    bestFor:
      "Anyone who wants a machine that is not an ECOVACS, on ordinary framed or frameless windows.",
    notIdealFor:
      "Anyone comparing on stated suction, anyone with sloped glass, or anyone needing to work away from a socket.",
    video: {
      url: "https://youtu.be/crSOj6S8KD4",
      title: "Mamibot iGLASSBOT W120-DP Test for Cleaning Sticky Glue on Glass",
      channel: "William Will",
      source: "independent",
      note:
        "Independent, and worth watching because it tests something nobody else does: dried adhesive rather than dust. Mamibot publishes little about this machine, and footage of it failing or coping is more use than another spec sheet.",
    },
    facts: [
      { label: "Max suction", value: "3,200 Pa (stated)" },
      { label: "Spray nozzles", value: "4" },
      { label: "Water tank", value: "60 ml" },
      { label: "Verified", value: "No" },
    ],
    specGroups: [
      { heading: "Cleaning", rows: [
        { label: "Maximum suction", value: "3,200 Pa (retailer-stated)" },
        { label: "Water tank", value: "60 ml (retailer-stated)" },
        { label: "Spray nozzles", value: "4" },
      ]},
      { heading: "Navigation and safety", rows: [
        { label: "Glass types", value: "Framed and frameless" },
        { label: "Power-off hold", value: "20–30 minutes on the UPS", note: "Mamibot's manual: when the UPS is fully charged it supports the W120-DP to stay on the working surface for 20–30 minutes." },
      ]},
      { heading: "Physical", rows: [
        { label: "Robot weight", value: null },
        { label: "Warranty", value: null },
      ]},
    ],
    skuNote:
      "Retailer-stated throughout; no Mamibot page publishing these figures was found. The ASIN replaced a different Mamibot model in our records on 5 August 2026 and has not been identity-verified.",
    image: {
      src: "/media/products/mamibot-w120-dp.webp",
      alt:
        "BotPlanet artwork for the Mamibot W120-DP window cleaning robot, shown on a " +
        "floor-to-ceiling window with spray leaving both sides.",
    },
    figures: [
      {
        afterHeading: "Who this is for",
        src: "/media/reviews/mamibot-w120-dp/corner-clean.webp",
        caption:
          "The four corner sensors, and the edge claim they support. 1 mm of edge clearance is Mamibot\u2019s figure, and the comparison panel underneath is Mamibot comparing itself with unnamed machines.",
      },
      {
        afterHeading: "The high-rise claim",
        src: "/media/reviews/mamibot-w120-dp/eight-in-one.webp",
        caption:
          "The item to read in this list is power-outage protection. On a high window that is the specification that decides what happens in a cut, and it is the one the cheaper machines in this catalogue leave out.",
      },
      {
        afterHeading: "Who should look elsewhere",
        src: "/media/reviews/mamibot-w120-dp/dual-control.webp",
        caption:
          "The useful number here is the smallest window it takes: 60 by 40 centimetres. Measure before you buy \u2014 a lot of older houses have panes smaller than that.",
      },
    ],
    lastReviewed: "2026-08-06",
  },

  "hobot-2s": {
    slug: "hobot-2s",
    categorySlug: "window-cleaning-robots",
    eyebrow: "Window robot review",
    title: "HOBOT 2S review",
    seoTitle: "HOBOT 2S Review — Two Tanks, and No Published Suction",
    metaDescription:
      "The HOBOT 2S has ultrasonic spray and two replaceable water tanks, a real " +
      "advantage nothing else here offers. Also no published suction figure at " +
      "all.",
    verdict:
      "Two replaceable water tanks and an ultrasonic atomiser instead of pumped nozzles. The tanks are a concrete advantage nothing else here offers; the spray advantage is a claim nobody has measured, and HOBOT publishes no suction figure at all.",
    bestFor:
      "A house with enough glass that refilling is the part you resent.",
    notIdealFor:
      "Anyone choosing on documented specifications, anyone with sloped glass, or a first-time buyer who wants to compare properly.",
    video: {
      url: "https://youtu.be/0YXMTqhWIbc",
      title: "Hobot 2S Review and Test | Top Robotic Window Cleaner",
      channel: "Little Robot Shop",
      source: "independent",
      note:
        "Independent, not HOBOT's. It covers the remote, the app and an actual test run — useful because HOBOT publishes no suction figure and watching it hold glass is the only evidence available.",
    },
    facts: [
      { label: "Spray", value: "Ultrasonic" },
      { label: "Water tanks", value: "2, replaceable" },
      { label: "Max suction", value: "Not published" },
      { label: "Verified", value: "No" },
    ],
    specGroups: [
      { heading: "Cleaning", rows: [
        { label: "Maximum suction", value: null },
        { label: "Spray system", value: "Ultrasonic atomiser" },
        { label: "Water tanks", value: "2, replaceable (retailer-stated)" },
      ]},
      { heading: "Navigation and safety", rows: [
        { label: "Navigation", value: "AI route planning (no version published)" },
        { label: "Glass types", value: "Framed and frameless" },
        {
            label: "Power-off hold",
            value: "Not published",
            /* THE SECOND HOBOT WITH THIS DEFECT, and finding it twice named the
               cause. It read "20 minutes on the embedded UPS, with an audio
               alert" while this page's own snapshot and gaps section said "not
               published — we cannot tell you what happens when your power
               cuts". The 298 said the same with one word changed: "with an
               alerting sound".

               THE FIGURE BELONGS TO THE MAMIBOT AND THE COP ROSE. Both of those
               records carry it WITH a manual cited; both HOBOT records carried
               it with nothing. It was copied across and drifted by a word, which
               is why the verbatim-duplicate guard caught the 298 and not this.
               HOBOT publishes no duration for either machine. */
          },
      ]},
      { heading: "Physical", rows: [
        { label: "Robot weight", value: null },
        { label: "Warranty", value: null },
      ]},
    ],
    skuNote:
      "Retailer-stated throughout; no HOBOT page publishing these figures was found. Owner-supplied ASIN from 5 August 2026, not identity-verified.",
    image: {
      src: "/media/products/hobot-2s.webp",
      alt:
        "BotPlanet artwork for the HOBOT-2S window cleaning robot, shown held to a " +
        "floor-to-ceiling window at night with spray leaving both sides.",
    },
    figures: [
      {
        afterHeading: "Who this is for",
        src: "/media/reviews/hobot-2s/hero.webp",
        caption:
          "Twin tanks spraying from both sides at once, which is the one thing this machine does that the cheaper 298 does not.",
      },
      {
        afterHeading: "Ultrasonic spray, honestly assessed",
        src: "/media/reviews/hobot-2s/spray-module.webp",
        caption:
          "The spray module lifts out without a tool, which matters more than it sounds: the tank and nozzles are the part that clogs, and a module you can rinse is the difference between maintenance and a dead robot.",
      },
      {
        afterHeading: "AI route planning",
        src: "/media/reviews/hobot-2s/app-control.webp",
        caption:
          "The app is a remote control with three modes and two water levels. Useful, and some way short of the mapping the phrase \u201croute planning\u201d suggests.",
      },
    ],
    lastReviewed: "2026-08-06",
  },

  "hobot-298": {
    slug: "hobot-298",
    categorySlug: "window-cleaning-robots",
    eyebrow: "Window robot review",
    title: "HOBOT 298 review",
    seoTitle:
      "HOBOT 298 Review — Ultrasonic Spray, Few Published Specs",
    metaDescription:
      "The HOBOT 298 is the cheaper HOBOT and the machine we know least about in " +
      "the catalogue. What it offers, and why a first-time buyer should look " +
      "elsewhere.",
    verdict:
      "The cheaper HOBOT, using the same ultrasonic spray as the 2S without its two replaceable tanks. It is the machine we know least about in this catalogue, and this review is short because padding it would misrepresent that.",
    bestFor:
      "Someone who wants ultrasonic spray cheaply and is comfortable buying on a long-standing brand's reputation rather than on published figures.",
    notIdealFor:
      "Almost anyone buying their first window robot — at a similar price the WINBOT W1 PRO publishes everything this one does not.",
    video: {
      url: "https://youtu.be/YOphx_t0fmk",
      title: "HOBOT 298 Review (Cleaning Factory Windows)",
      channel: "Robot My Life",
      source: "independent",
      note:
        "Independent, not HOBOT's, and shot on high dusty factory glass rather than a clean showroom pane. HOBOT publishes no suction figure for this model, so watching it hold and travel is the only evidence available.",
    },
    facts: [
      { label: "Spray", value: "Ultrasonic" },
      { label: "Max suction", value: "Not published" },
      { label: "Power-off hold", value: "Not published" },
      { label: "Verified", value: "No" },
    ],
    specGroups: [
      { heading: "Cleaning", rows: [
        { label: "Maximum suction", value: null },
        { label: "Spray system", value: "Ultrasonic atomiser" },
        { label: "Water tank", value: null },
      ]},
      { heading: "Navigation and safety", rows: [
        { label: "Navigation", value: null },
        { label: "Glass types", value: "Framed and frameless" },
        {
            label: "Power-off hold",
            value: "Not published",
            /* IT READ "20 minutes on the embedded UPS, with an alerting sound"
               UNTIL 14 AUGUST 2026, and the same page said "Not published"
               three times — including in the row directly above this table.
               Four statements about one figure, in direct contradiction.

               THE FIGURE IS NOT HOBOT'S. Every other value on this page is
               attributed and this one never was; the identical wording, UPS
               and alert sound appear on the Mamibot W120-DP and the Cop Rose
               X5S, both of which cite a manual for it. It was borrowed from a
               sibling record and it describes a different machine.

               AND IT IS THE ONE FIGURE THAT MUST NOT BE BORROWED. This is the
               category's safety number — how long the robot stays on the glass
               after the power fails — and this page's own buying advice tells
               a reader to judge a machine on it. Publishing an unsourced
               twenty minutes against a machine three storeys up is the worst
               thing this site could print. HOBOT does not state it, so neither
               do we. */
          },
      ]},
      { heading: "Physical", rows: [
        { label: "Robot weight", value: null },
        { label: "Warranty", value: null },
      ]},
    ],
    skuNote:
      "No manufacturer-verified specification of any kind was found for this model. Owner-supplied ASIN from 5 August 2026, not identity-verified. Almost every row above is undisclosed, and that is the honest state of what is published.",
    image: {
      src: "/media/products/hobot-298.webp",
      alt:
        "BotPlanet artwork for the HOBOT-298 window cleaning robot, shown on a tall window " +
        "at night above a lit city.",
    },
    figures: [
      {
        afterHeading: "Who this is for",
        src: "/media/reviews/hobot-298/holding-force.webp",
        caption:
          "This artwork prints a number the rest of HOBOT\u2019s material does not: up to 6 kg of holding force. That is not a suction figure in pascals and the two do not convert, so it does not close the gap named below \u2014 but it is more than we could find anywhere else, and it is HOBOT\u2019s claim rather than a measurement of ours.",
      },
      {
        afterHeading: "Ultrasonic spray at the cheap end",
        src: "/media/reviews/hobot-298/edge-detection.webp",
        caption:
          "The underside, and the reason the edge matters: a yellow border pad around a grey centre pad. The border is the part doing the work at the frame, where every robot in this category is at its worst.",
      },
      {
        afterHeading: "Who should look elsewhere",
        src: "/media/reviews/hobot-298/bluetooth-remote.webp",
        caption:
          "The control is Bluetooth, not Wi-Fi. That means it works from the same room and nowhere else \u2014 no scheduling, no starting it from the office.",
      },
    ],
    lastReviewed: "2026-08-06",
  },

  "cop-rose-x5s": {
    slug: "cop-rose-x5s",
    categorySlug: "window-cleaning-robots",
    eyebrow: "Window robot review",
    title: "Cop Rose X5S review",
    seoTitle: "Cop Rose X5S Review — No App, and Framed Glass Only",
    metaDescription:
      "The COP ROSE X5S is the cheapest machine here, and the only one with a " +
      "remote instead of an app. Also the only one not rated for frameless glass.",
    verdict:
      "The cheapest machine in the catalogue and the only one with no app at all — a remote control instead, which for the right buyer is the feature rather than the compromise. It is also the only one rated for framed glass only.",
    bestFor:
      "Framed windows, a tight budget, and anyone who actively does not want another app on their phone.",
    notIdealFor:
      "Frameless glass, which it does not claim at all. Also anyone wanting scheduling, mapping or a cleaning history.",
    facts: [
      { label: "Control", value: "Remote, no app" },
      { label: "Glass types", value: "Framed only" },
      { label: "Max suction", value: "Not published" },
      { label: "Verified", value: "No" },
    ],
    specGroups: [
      { heading: "Cleaning", rows: [
        { label: "Maximum suction", value: null },
        { label: "Water tank", value: null },
      ]},
      { heading: "Navigation and safety", rows: [
        { label: "Control", value: "Remote control, no app" },
        { label: "Glass types", value: "Framed only" },
        { label: "Power-off hold", value: "About 20 minutes on the UPS, with a warning sound", note: "Cop Rose describes a UPS electrical storage device: the robot keeps adsorption, will not move forward, and issues a warning sound." },
      ]},
      { heading: "Physical", rows: [
        { label: "Robot weight", value: null },
        { label: "Warranty", value: null },
      ]},
    ],
    skuNote:
      "Retailer-stated throughout; no manufacturer page publishing these figures was found. The framed-glass-only rating is the one specification that decides this purchase outright, and it is the one we are most confident in — it is what the product is sold as.",
    image: {
      src: "/media/products/cop-rose-x5s.webp",
      alt:
        "BotPlanet artwork for the Cop Rose X5S window cleaning robot, shown angled " +
        "against a night city window with its remote control and a phone alongside.",
    },
    figures: [
      {
        afterHeading: "Who this is for",
        src: "/media/reviews/cop-rose-x5s/spray-suction.webp",
        caption:
          "An atomised spray and a suction figure of up to 4,000 Pa, both Cop Rose\u2019s own. At this price the spray is the part that separates it from a machine that drags a dry cloth around.",
      },
      {
        afterHeading: "No app is a genuine trade, both ways",
        src: "/media/reviews/cop-rose-x5s/multiple-surfaces.webp",
        caption:
          "A correction we owe you: the artwork for this machine shows both a remote and a phone app, and the section above was written on the basis that it ships remote-only. We have not been able to settle which is right from the listing. Treat the app as unconfirmed rather than absent, and if it matters to your decision, check the box contents before you buy.",
      },
    ],
    lastReviewed: "2026-08-06",
  },

  /* ============================================================
     COMPANION ROBOTS — first review in the category, 8 August 2026.

     EVERY FIGURE BELOW COMES FROM casio.com/us/moflin/, read on
     8 August 2026. Casio publishes a full specification table for
     this product, which is more than most makers in this category
     do, so nothing here is null and nothing is borrowed.

     The specification settles the question the search data says
     people actually arrive with. "does moflin walk" and "can
     moflin walk" are both Google's first suggestion for their
     prefix; the answer is in the Movement row, which reads two
     axes, head rotation and tilt. It has no legs and no wheels.
     Casio does not hide this — it is simply the last thing anyone
     reads, and it is the first thing this page says.
     ============================================================ */
  moflin: {
    slug: "moflin",
    figures: [
      {
        afterHeading: "What Moflin actually does",
        src: "/media/companion/moflin/figure-2.webp",
        caption:
          "Stroking its back is the whole interaction. There are no legs, no wheels and no screen — the response to touch is what you are buying.",
      },
      {
        afterHeading: "Battery life, and what happens when it runs out",
        src: "/media/companion/moflin/figure-1.webp",
        caption:
          "It sleeps in the nest to charge. The panel wording in this artwork is Casio's own promotional copy rather than a BotPlanet finding.",
      },
    ],
    image: {
      src: "/media/companion/moflin/hero.webp",
      alt:
        "Moflin held in two cupped hands in a lamplit living room. The supplied artwork carries Casio's own promotional panels; the wording on them is the maker's, not a BotPlanet finding.",
    },
    categorySlug: "companion-robots",
    eyebrow: "Companion robot review",
    title: "Casio Moflin review",
    seoTitle: "Moflin Review — What a $429 AI Pet Actually Does",
    metaDescription:
      "A $429 companion robot with no legs, no speech and two axes of movement. What Moflin " +
      "actually does, what Casio publishes, and who it is genuinely for.",
    verdict:
      "A 260-gram ball of fur that moves its head, makes sounds and learns to respond to how you handle it. It does not walk, does not talk and does nothing useful, and every one of those is a design decision rather than a shortfall. Whether that is worth $429 depends entirely on whether you want a pet or a gadget.",
    bestFor:
      "Someone who wants something to look after in a home where a real animal is not possible — a rented flat, an allergy, a care setting, a schedule that will not carry a dog.",
    notIdealFor:
      "Anyone expecting it to move around the room, hold a conversation, run an app on a screen or do a job. It does none of those and is not sold as though it does.",
    video: {
      url: "https://youtu.be/gIdDClL4cu0",
      title: "Moflin Robot Unboxing and Review",
      channel: "Silvolf",
      source: "independent",
      note:
        "An independent owner's video, not Casio's and not ours. Moflin has no face and no screen, so the whole product is texture and movement \u2014 this is the closest you will get to handling one before you buy.",
    },
    facts: [
      { label: "Movement", value: "2 axes — head only" },
      { label: "Weight", value: "260 g" },
      { label: "Battery life", value: "5 h, 3.5 h to charge" },
      { label: "Subscription", value: "None" },
    ],
    specGroups: [
      {
        heading: "What it does",
        rows: [
          { label: "Movement", value: "2 axes (head rotation and tilt)" },
          { label: "Walks or rolls", value: "No — it has no legs and no wheels" },
          { label: "Speech", value: "No — sounds only, no words" },
          { label: "Audio", value: "1 speaker, 1 microphone" },
          { label: "Sensors", value: "Microphone, illuminance, touch, accelerometer/gyroscope" },
          { label: "App", value: "MofLife — naming, journal, volume, battery, updates" },
        ],
      },
      {
        heading: "Power",
        rows: [
          { label: "Battery", value: "Li-ion 3.7 V, 1,200 mAh" },
          { label: "Runtime", value: "About 5 hours at 25 °C / 77 °F" },
          { label: "Charge time", value: "About 3 hours 30 minutes" },
          { label: "Power consumption", value: "About 4.7 W" },
          { label: "Charging", value: "In its bed, and it still responds while charging" },
        ],
      },
      {
        heading: "Physical",
        rows: [
          { label: "Size", value: "130 × 90 × 180 mm" },
          { label: "Size in its bed", value: "140 × 120 × 190 mm" },
          { label: "Weight", value: "About 260 g" },
          { label: "Bed size", value: "140 × 100 × 190 mm, about 280 g" },
          { label: "Colours", value: "Silver, Gold" },
        ],
      },
      {
        heading: "Ownership",
        rows: [
          { label: "Subscription", value: "None published for the US" },
          { label: "Warranty", value: "One year from the day it arrives" },
          { label: "In the box", value: "Moflin, bed, AC adapter, startup guide" },
          { label: "Fur care", value: "Soft brush; damp cloth if it gets dirty" },
        ],
      },
    ],
    skuNote:
      "Every figure read from casio.com/us/moflin/ on 8 August 2026, where Casio publishes a full specification table. Casio sells Silver and Gold; the ASIN behind our buy button is the Silver, and the two differ in colour only. Casio notes its specifications may change without notice.",
    lastReviewed: "2026-08-08",
  },

  /* Miko 3. Specifications from miko.ai/products/miko-3, read 8 August 2026,
     where Miko publishes dimensions, weight, battery and language support in
     its own FAQ. The subscription tiers below are read from the same page's
     comparison table rather than summarised from memory — "does miko 3 require
     a subscription" is Google's first suggestion for its prefix, and the
     honest answer is longer than yes or no. */
  "miko-3": {
    slug: "miko-3",
    figures: [
      {
        afterHeading: "What it does out of the box",
        src: "/media/companion/miko-3/figure-1.webp",
        caption:
          "The face is a screen, and the screen is the product. Everything Miko does happens on it.",
      },
      {
        afterHeading: "Buying one, and which colour",
        src: "/media/companion/miko-3/figure-2.webp",
        caption:
          "Red and blue are two Amazon listings at the same $299. The colour is the only difference between them.",
      },
    ],
    image: {
      src: "/media/companion/miko-3/hero.webp",
      alt:
        "A red Miko 3 on a rug with its screen face lit, a child sitting in front of it. The supplied artwork carries Miko's own promotional wording, which is the maker's rather than ours.",
    },
    categorySlug: "companion-robots",
    eyebrow: "Companion robot review",
    title: "Miko 3 review",
    seoTitle: "Miko 3 Review — What You Get Without Miko Max",
    metaDescription:
      "A $299 learning robot for ages 5 to 10. What Miko 3 does out of the box, what " +
      "the Miko Max subscription unlocks, and how it compares with the Mini.",
    verdict:
      "The most capable robot a five-year-old can actually talk to, and the one product in this category built around a child rather than adapted for one. It works without paying anything further, but several of the headline apps are limited or locked until you do, and the buying decision is really about that.",
    bestFor:
      "A child roughly five to ten who will talk to it, in a house with reliable Wi-Fi and a parent willing to use the companion app.",
    notIdealFor:
      "Under-fives, anyone over about ten, a home without Wi-Fi, or a buyer who wants everything the marketing shows without a recurring charge.",
    video: {
      url: "https://youtu.be/V845fMB5jhE",
      title: "Miko 3: Best Robot For Kids? (FULL REVIEW)",
      channel: "Eric's Tech World",
      source: "independent",
      note:
        "Independent, not Miko's. It tests the AI conversation and the content platform, which is where this product either earns its subscription or does not.",
    },
    facts: [
      { label: "Age range", value: "5 to 10" },
      { label: "Battery", value: "6–7 h play, 4 h charge" },
      { label: "Languages", value: "8" },
      { label: "Subscription", value: "Optional — from $8.25/mo" },
    ],
    specGroups: [
      {
        heading: "What it is",
        rows: [
          { label: "Age range", value: "5 to 10 (Miko's own rating)" },
          { label: "Moves", value: "Yes — drives on wheels" },
          { label: "Wake word", value: "“Hey Miko”" },
          { label: "Languages", value: "8 — English, Spanish (Europe), Spanish (Latin America), Mandarin, Italian, German, French, Arabic" },
          { label: "Recognition", value: "Face and voice" },
          { label: "Connection", value: "Wi-Fi required — it does nothing offline" },
        ],
      },
      {
        heading: "Hardware",
        rows: [
          { label: "Display", value: "Wide-angle high-resolution IPS" },
          { label: "Camera", value: "Wide-angle HD" },
          { label: "Microphones", value: "Dual MEMS" },
          { label: "Sensors", value: "Time-of-flight range, odometric" },
          { label: "Size", value: "6.3 × 5.5 × 8.67 in" },
          { label: "Weight", value: "2 lb" },
          { label: "Colours", value: "Red, Blue" },
        ],
      },
      {
        heading: "Power",
        rows: [
          { label: "Play time", value: "About 6 to 7 hours, depending on use" },
          { label: "Charge time", value: "About 4 hours with the 15 W adapter" },
          { label: "Sleep mode", value: "Yes — Miko recommends it to preserve the battery" },
        ],
      },
      {
        heading: "Subscription and ownership",
        rows: [
          { label: "Works without a subscription", value: "Yes — but with several apps limited or locked" },
          { label: "Miko Max price", value: "From $8.25/month, or $99 a year" },
          { label: "Locked without Max", value: "iHeart Music, DaVinci Games & Shows, Lingo Kids parental controls" },
          { label: "Limited without Max", value: "Learning buddy, Story Maker, Disney, Mattel Shows, progress reports, parental controls" },
          { label: "Free either way", value: "Spell Bee, Dance Master, app locking" },
          { label: "Certification", value: "kidSAFE+ COPPA" },
          { label: "Warranty", value: "1 year; 30-day returns" },
        ],
      },
    ],
    skuNote:
      "Specifications and subscription tiers read from miko.ai/products/miko-3 on 8 August 2026. Miko sells the 3 in Red and Blue as separate Amazon listings at the same price; our buy button points at the Red. The Mini and the Max are different machines, not colours.",
    lastReviewed: "2026-08-08",
  },

  /* Vector 2.0. The measured SERPs put ten first-position terms behind this
     product and every one of them is a doubt — still supported, still works,
     still being made, why discontinued, problems, alternative. The PAA on
     three separate Vector SERPs asks whether it is discontinued and whether it
     needs a subscription.

     So the specification table below leads with the company and the
     subscription rather than the hardware. Subscription pricing read from
     anki.bot/pages/vector-subscription on 8 August 2026; dimensions and the
     Wi-Fi restriction from the Amazon listing the same day. */
  "vector-2": {
    slug: "vector-2",
    figures: [
      {
        afterHeading: "What you are actually getting",
        src: "/media/companion/vector-2/figure-2.webp",
        caption:
          "It is 3.93 inches long. Everyone expects something bigger, and the hand is the only honest way to show it.",
      },
      {
        afterHeading: "Who this is for",
        src: "/media/companion/vector-2/figure-1.webp",
        caption:
          "Its life is measured in returns to the dock. If a desk robot that mostly sits on a charger is not the appeal, this is not the one.",
      },
    ],
    image: {
      src: "/media/companion/vector-2/hero.webp",
      alt:
        "Anki Vector on a dark desk at night with its screen face lit green and its cube beside it. The panel text in the supplied artwork is promotional copy rather than a BotPlanet finding.",
    },
    categorySlug: "companion-robots",
    eyebrow: "Companion robot review",
    title: "Anki Vector 2.0 robot review",
    seoTitle: "Vector Robot Review — Is It Still Supported in 2026?",
    metaDescription:
      /* "vector robot" is this page's primary and it was in the title but not
         here — the description said plain "Vector", which is the name a reader
         already convinced would use and not the phrase 5,400 of them a month
         actually search. One word, and it costs the sentence nothing. */
      "Anki went under in 2019 and the Vector robot is still on sale. Who owns it now, what the " +
      "$11.99 subscription covers, and whether it works without one.",
    verdict:
      "A palm-sized robot with more character than anything else at the price, sold by the third company to own it, and dependent on a subscription that costs more per year than some of its competitors cost outright. Buy it for what it is now, not for what Anki promised in 2018.",
    bestFor:
      "Someone who wants a desk robot with genuine personality and has read the subscription terms before ordering rather than after.",
    notIdealFor:
      "Anyone who wants a one-off purchase, anyone who needs it to work reliably for years, or anyone buying on the strength of the original 2018 reviews.",
    video: {
      url: "https://youtu.be/L_53CyT-eAc",
      title: "Vector 2.0 Review! Your Smart AI Robot Sidekick",
      channel: "Bens Stuff",
      source: "independent",
      note:
        "An independent review, not Digital Dream Labs'. It shows the arm and the cube working, which is the thing Vector has that nothing else in this category does.",
    },
    facts: [
      { label: "Sold by", value: "ANKI, LLC" },
      { label: "Subscription", value: "$11.99/mo or $99.99/yr" },
      { label: "Wi-Fi", value: "2.4 GHz only" },
      { label: "Size", value: "3.93 × 2.36 × 2.73 in" },
    ],
    specGroups: [
      {
        heading: "Who makes it now",
        rows: [
          { label: "Original maker", value: "Anki Inc. — ceased trading 2019" },
          { label: "Sold today by", value: "ANKI, LLC, formerly Digital Dream Labs" },
          { label: "Amazon storefront", value: "Digital Dream Labs Store" },
          { label: "Developer route", value: "OSKR — Anki's open-source path for Vector" },
        ],
      },
      {
        heading: "The subscription",
        rows: [
          { label: "Required for cloud features", value: "Yes — the Amazon listing states it in its own title" },
          { label: "Monthly", value: "$11.99" },
          { label: "Annual", value: "$99.99" },
          { label: "Managed through", value: "Stratus, keyed to the robot's 8-character serial" },
          { label: "Activation delay", value: "Up to 36 hours" },
          { label: "What works unsubscribed", value: "Anki publishes no feature-by-feature comparison" },
        ],
      },
      {
        heading: "Hardware",
        rows: [
          { label: "Size", value: "3.93 × 2.36 × 2.73 in" },
          { label: "Weight", value: "5.6 oz (listing figure)" },
          { label: "Power", value: "Battery, returns to its own charger" },
          { label: "Wi-Fi", value: "2.4 GHz only — it will not see a 5 GHz network" },
          { label: "Recognition", value: "Face and voice" },
          { label: "Setup", value: "Chrome web setup, or the iOS and Android apps" },
        ],
      },
    ],
    skuNote:
      "Subscription pricing and terms read from anki.bot/pages/vector-subscription on 8 August 2026; dimensions, Wi-Fi restriction and seller from the Amazon listing the same day. The listing price moved from $199.99 to $184 within one morning, which is why no price is quoted here — the figure on the page comes from the refresh service with the date it was read.",
    lastReviewed: "2026-08-08",
  },

  /* Eilik. Energize Lab publishes a proper anatomy table, so every hardware
     figure below is theirs rather than a retailer's.

     TWO NUMBERS DECIDE THIS PRODUCT and neither appears in the marketing: the
     battery runs 1.5 hours, and the warranty is 90 days against a year from
     Casio and Miko. Both are on the maker's own page and both are in the facts
     strip rather than buried in a table. */
  eilik: {
    slug: "eilik",
    figures: [
      {
        afterHeading: "What it actually does",
        src: "/media/companion/eilik/range.webp",
        caption:
          "The whole family in one frame: the AI Station dome, the DQ, the Panxer and Eiliko, plus the colourways. Energize Lab sells a range, not a product.",
      },
      {
        afterHeading: "The range, and what the DQ actually is",
        src: "/media/companion/eilik/figure-2.webp",
        caption:
          "The DQ beside a standard Eilik at the same scale. Same hardware, desert colourway, $60 more.",
      },
      {
        afterHeading: "Colours",
        src: "/media/companion/eilik/figure-1.webp",
        caption:
          "Four of the colourways side by side. The trim is the only thing that changes.",
      },
    ],
    image: {
      src: "/media/companion/eilik/hero.webp",
      alt:
        "Two Eiliks on a wooden desk turned towards each other, one white with pink trim and one orange, both screen faces lit.",
    },
    categorySlug: "companion-robots",
    eyebrow: "Companion robot review",
    title: "Eilik robot review",
    seoTitle: "Eilik Robot Review — The 1.5-Hour Battery Nobody Mentions",
    metaDescription:
      "The Eilik robot: $139.99, real character, a 90-day warranty and 90 minutes " +
      "of battery. What Eilik does, what the DQ adds, and whether two is better.",
    verdict:
      "The most personality per dollar in this category and the shortest battery life in it. Eilik is a desk toy that reacts to being touched and to another Eilik, with no subscription and no cloud account, and it runs for about ninety minutes between charges.",
    bestFor:
      "A desk, a bedroom shelf, or a gift for someone who wants something with character and does not want an account, an app subscription or a microphone in the room.",
    notIdealFor:
      "Anyone expecting conversation, anyone who wants it to run all day, or anyone who needs more than 90 days of warranty cover at this price.",
    video: {
      url: "https://youtu.be/4GoQHnFB8Sc",
      title: "Eilik Desktop Robot: CUTE OR SCARY? (Unbox & Review)",
      channel: "Eric's Tech World",
      source: "independent",
      note:
        "Independent, not ours. The title asks the right question: Eilik's face is a screen and some people find that endearing and some find it unsettling. Watch it before you spend $139.99, because that reaction is not something a specification can tell you.",
    },
    facts: [
      { label: "Battery", value: "1.5 h use, 1 h charge" },
      { label: "Warranty", value: "90 days" },
      { label: "Subscription", value: "None" },
      { label: "Weight", value: "230 g" },
    ],
    specGroups: [
      {
        heading: "Anatomy",
        rows: [
          { label: "Size", value: "108 × 105 × 133 mm (4.3 × 4.1 × 5.2 in)" },
          { label: "Weight", value: "230 g (8 oz)" },
          { label: "Servos", value: "EM3 × 4" },
          { label: "Display", value: "1.54 in, 128 × 64 OLED" },
          { label: "Speaker", value: "3 W" },
          { label: "Material", value: "High-strength polycarbonate" },
          { label: "Port", value: "USB Type-C" },
        ],
      },
      {
        heading: "Power — read this before buying",
        rows: [
          { label: "Battery", value: "450 mAh" },
          { label: "Runtime", value: "1.5 hours" },
          { label: "Charge time", value: "1 hour" },
          { label: "Input", value: "5 V 1 A" },
        ],
      },
      {
        heading: "Ownership",
        rows: [
          { label: "Subscription", value: "None — updates are free through the app" },
          { label: "Warranty", value: "90 days" },
          { label: "Account required", value: "No" },
          { label: "Maker", value: "Shenzhen Zhuneng Technology Co., Ltd. (Energize Lab)" },
        ],
      },
      {
        heading: "The rest of the range, at Energize Lab's own prices",
        rows: [
          { label: "Eilik", value: "$139.99" },
          { label: "Eilik DQ (Desert Quester)", value: "$199.98 — same hardware, desert colourway, exclusive game and weapon kit" },
          { label: "Eilik AI Station", value: "$99" },
          { label: "Panxer", value: "$119.90 — a vehicle for Eilik, not a robot" },
          { label: "Eiliko", value: "$59.90 — a different, smaller product" },
          { label: "Eilik × 2", value: "$269.98" },
        ],
      },
    ],
    skuNote:
      "Hardware figures from store.energizelab.com/products/eilik and range pricing from the same store, both read 8 August 2026. Our buy button points at the base Eilik on Amazon (B0C2C9LJNQ) at $139.99, matching the maker's own price. The DQ has its own Amazon listing and is not sold here.",
    lastReviewed: "2026-08-08",
  },

  /* Loona. KEYi's own site is JavaScript-rendered and could not be
     machine-read, so every figure here comes from the Amazon listing's copy
     and its Q&A — KEYi's own words, on the page we send buyers to.

     THE BATTERY IS THE STORY AT THIS PRICE. 1,350 mAh gives 1.5 hours of
     play against 2.5 hours to charge, so a $499 robot spends longer on its
     dock than off it. The maker's own top bullet is about having fixed the
     charging, which is a candid thing to lead with and worth repeating
     rather than hiding. */
  loona: {
    slug: "loona",
    figures: [
      {
        afterHeading: "What $499 actually buys",
        src: "/media/companion/loona/figure-1.webp",
        caption:
          "The face is a screen and the expressions are the product. This is one frame of a range that does not sit still.",
      },
      {
        afterHeading: "Why Loona costs what it costs",
        src: "/media/companion/loona/range.webp",
        caption:
          "The descriptive wording set into this artwork is promotional copy supplied with it, not a BotPlanet finding.",
      },
      {
        afterHeading: "The accessory problem, and one warning about buying",
        src: "/media/companion/loona/figure-2.webp",
        caption:
          "What arrives in the box, laid out. The maker's feature wording is printed on this artwork and is theirs rather than ours.",
      },
    ],
    image: {
      src: "/media/companion/loona/hero.webp",
      alt:
        "Loona on a wooden floor with its ears up and screen face lit, a real dog lying a few feet behind it.",
    },
    categorySlug: "companion-robots",
    eyebrow: "Companion robot review",
    title: "Loona robot review",
    seoTitle: "Loona Robot Review — 90 Minutes of Play for $499",
    metaDescription:
      "The Loona robot is the most capable robot pet you can buy, and it charges " +
      "longer than it plays. What $499 gets you, and the battery nobody mentions.",
    verdict:
      "The most capable machine in this category and the hardest to justify on paper. Loona sees, recognises faces and gestures, follows you, talks back, plays fetch and doubles as a home camera — for 90 minutes, after which it needs 2.5 hours on its dock.",
    bestFor:
      "Someone who wants the closest thing to a robot pet that exists, uses it in sessions rather than all day, and will get value from the camera as well as the character.",
    notIdealFor:
      "Anyone wanting constant presence, anyone on a budget, or anyone buying primarily to watch a pet — a dedicated pet camera does that job for a fraction of this.",
    video: {
      url: "https://youtu.be/ELE_sfFj3zU",
      title: "Loona Robot: Still Worth Buying In 2026? (UPDATED REVIEW)",
      channel: "Eric's Tech World",
      source: "independent",
      note:
        "Independent, and it asks the only question that matters at $499 — whether the thing is still in use rather than whether it is impressive on day one. Updated rather than a launch review.",
    },
    facts: [
      { label: "Battery", value: "1.5 h play, 2.5 h charge" },
      { label: "Camera", value: "HD RGB — doubles as home monitor" },
      { label: "Voice", value: "Amazon Lex + ChatGPT-4o" },
      { label: "Dock", value: "Included, auto-returns" },
    ],
    specGroups: [
      {
        heading: "Power — read this first",
        rows: [
          { label: "Battery", value: "1,350 mAh" },
          { label: "Continuous playtime", value: "Up to 1.5 hours" },
          { label: "Charge time", value: "About 2.5 hours" },
          { label: "Auto-return to dock", value: "Yes — preset routes per room" },
          { label: "Dock", value: "Included" },
        ],
      },
      {
        heading: "What it can do",
        rows: [
          { label: "Camera", value: "HD RGB" },
          { label: "Recognition", value: "Faces and hand gestures" },
          { label: "Follows you", value: "Yes" },
          { label: "Voice", value: "Amazon Lex with ChatGPT-4o" },
          { label: "Play", value: "Chases laser pens, fetches balls, app games and quizzes" },
          { label: "Home monitoring", value: "Yes — camera and speaker, viewed from the app" },
        ],
      },
      {
        heading: "Practical",
        rows: [
          { label: "Weight", value: "1.1 kg" },
          { label: "Connection", value: "Wi-Fi, and mobile hotspot since the V28 update" },
          { label: "Subscription", value: "None published" },
          { label: "Lighting", value: "Needs a well-lit room — the camera does the work" },
          { label: "Noise", value: "Quiet rooms and clear speech improve voice recognition" },
        ],
      },
    ],
    skuNote:
      "Figures from the Amazon listing B0DCF53PCH and its Q&A, read 8 August 2026 — KEYi's own copy on the page we link to. keyirobot.com is JavaScript-rendered and could not be machine-read, so the absence of a subscription is recorded as none published rather than none exists. Rated 4.1 from 1,234 ratings on the day it was read.",
    lastReviewed: "2026-08-08",
  },

  /* Living.AI EMO — THE ONE PAGE IN THIS CATEGORY WITH NOTHING TO SELL.
     18,100/mo, the largest single term BotPlanet holds in companion robots,
     and no Amazon US listing behind it. Two searches on 8 August 2026 returned
     only unbranded EMOPET-style knockoffs with the Living.AI brand token
     absent from both.

     It is built anyway because Google uses EMO as the comparison anchor for
     the whole desktop segment — its own answer box asks "Which is better,
     Eilik or Emo?" on Eilik's results and "Which robot is better, Emo or
     Loona?" on Loona's. A page that ranks for 18,100 and routes to machines a
     reader can actually buy is worth more than a gap where the anchor should
     be. There is no buy button and the page says why in its first section. */
  /* ------------------------------------------------------------------
     TWO RULE-OUT REVIEWS, 8 August 2026. Neither carries an offer and
     neither may be given one.

     The site's position is that it tells you when not to buy. These are the
     purest form of that: pages that own a large search term and spend it
     sending the reader somewhere else. Cozmo is 9,900/mo and Moxie 8,100/mo,
     and the honest answer to both is "no, buy one of these instead".

     `video` is absent on both on purpose. Every clip of a working Cozmo or
     Moxie shows a machine doing something it will not do for a buyer today,
     which is the opposite of what these pages are for.
     ------------------------------------------------------------------ */
  "cozmo": {
    slug: "cozmo",
    /* Wired 11 August 2026. The asset was already in the media registry —
       it filled the listing card — but this review carried no image field
       at all, so the page rendered with an empty space at the top. */
    image: {
      src: "/media/coding/cozmo/card.webp",
      alt:
        "A clean studio shot of the small white and red tracked robot alone on a " +
        "plain white background.",
    },
    categorySlug: "educational-coding-robots",
    eyebrow: "Coding robot review",
    title: "Cozmo robot review",
    seoTitle: "Cozmo Robot Review — Why You Cannot Buy One",
    metaDescription:
      "The Cozmo robot is listed at $399.99 with no stock and no ship date, and " +
      "Pennsylvania is suing the seller over 14,000 unfulfilled orders. What to " +
      "buy instead.",
    verdict:
      "A good robot from a company you should not send money to. Digital Dream Labs lists Cozmo 2.0 at $399.99 with no stock and no ship date, and the Pennsylvania Attorney General sued the company and its chief executive in September 2024 over roughly 14,000 prepaid orders that were never fulfilled.",
    bestFor:
      "Nobody, at this price and from this seller. If you want the character, a second-hand original bought from a person is the only route we would not argue with.",
    notIdealFor:
      "Anyone about to pre-order. The store takes money, publishes no ship date, and its operator is under suit for exactly that.",
    facts: [
      { label: "Listed price", value: "$399.99" },
      { label: "Stock", value: "Sold Out, no ship date" },
      { label: "BotPlanet buy button", value: "None — deliberately" },
      { label: "BBB rating", value: "F, not accredited" },
    ],
    specGroups: [
      {
        heading: "Buying it — read this first",
        rows: [
          { label: "Seller", value: "Digital Dream Labs" },
          { label: "Store state, 8 August 2026", value: "COMING SOON, button reads Sold Out" },
          { label: "Ship date offered", value: "None" },
          { label: "Attorney General suit", value: "Pennsylvania, filed 18 September 2024" },
          { label: "Orders alleged unfulfilled", value: "About 14,000, November 2020 to January 2024" },
          { label: "Sales alleged", value: "More than $4 million, $147 to $655 per robot" },
          { label: "BBB", value: "F, not accredited, 71 complaints unanswered" },
        ],
      },
      {
        heading: "What we could not verify",
        rows: [
          { label: "Receivership over the digital assets", value: "Reported 9 July 2026, case GD-25-013191 — not confirmed at the court by us" },
          { label: "Outcome of the suit", value: "No judgment or settlement found on the public record, 8 August 2026" },
          { label: "Restock", value: "No date published anywhere we could find" },
          { label: "Old Anki cloud endpoints", value: "No response from any of the four when we tested them, 8 August 2026" },
        ],
      },
    ],
    skuNote:
      "Price and stock read from Digital Dream Labs' own store on 8 August 2026. The lawsuit figures are from the Pennsylvania Attorney General's filing of 18 September 2024 as reported at the time; the BBB rating and complaint counts are from the company's BBB profile, read the same day. No price is published on this page as an offer because we hold none and will not hold one.",
    lastReviewed: "2026-08-08",
  },
  "moxie": {
    slug: "moxie",
    /* Wired 11 August 2026. The asset was already in the media registry —
       it filled the listing card — but this review carried no image field
       at all, so the page rendered with an empty space at the top. */
    image: {
      src: "/media/companion/moxie/card.webp",
      alt: "A clean studio shot of the robot alone on a plain background.",
    },
    categorySlug: "companion-robots",
    eyebrow: "Companion robot review",
    title: "Moxie robot review",
    seoTitle: "Moxie Robot Review — It Stopped Working in 2025",
    metaDescription:
      "Embodied shut down and the Moxie robot's servers went off, mostly without " +
      "refunds. What a used one can still do, and what to buy instead.",
    verdict:
      "An $800 child's companion that stopped working when its maker ceased operations, with no refund for most owners. What survives runs on OpenMoxie — a community server you host yourself, with an OpenAI bill attached and some of the original content missing.",
    bestFor:
      "Somebody who wants a project, already owns one, and is willing to run a local server for it. As a purchase for a child, nobody.",
    notIdealFor:
      "A parent buying a used one at $200 to $400 expecting the robot from the advert. It may never speak, and the seller cannot tell you whether it will.",
    facts: [
      { label: "Sold new at", value: "$799" },
      { label: "Servers", value: "Off — reported 30 January 2025" },
      { label: "Refunds", value: "Not for most owners" },
      { label: "BotPlanet buy button", value: "None — deliberately" },
    ],
    specGroups: [
      {
        heading: "What happened",
        rows: [
          { label: "Maker", value: "Embodied — ceased operations" },
          { label: "Announced", value: "Late 2024, owners told the robot would stop working" },
          { label: "Shutdown date", value: "Reported as 30 January 2025" },
          { label: "Refunds", value: "Declined for most; a narrow window around the closure announcement" },
          { label: "Payment plans", value: "Owners told it was out of the company's hands" },
        ],
      },
      {
        heading: "What OpenMoxie asks of you",
        rows: [
          { label: "Who runs it", value: "Volunteers — not Embodied, not any successor" },
          { label: "Hardware", value: "A PC, Mac, Linux box or Raspberry Pi 5 on the same network" },
          { label: "Ongoing cost", value: "An OpenAI account with credits — speech and conversation bill to you" },
          { label: "Also needed", value: "Docker" },
          { label: "Content that works", value: "Daily Missions, Reading, Wild Workout" },
          { label: "Content missing", value: "Ocean Explorer, Animal Faces, Story Maker" },
        ],
      },
      {
        heading: "What we could not verify",
        rows: [
          { label: "Embodied's own refund wording", value: "Its closing FAQ returned 403 to us on 8 August 2026" },
          { label: "Pre-shutdown update requirement", value: "Reported, but not stated in OpenMoxie's own README where we looked" },
          { label: "Whether a given used unit can be recovered", value: "No way to check before buying" },
        ],
      },
    ],
    skuNote:
      "Read on 8 August 2026. The shutdown date, the refund position and the original $799 price come from contemporaneous reporting; Embodied's own closing FAQ would not open for us and we have said so rather than quoting it second-hand as though we had. The OpenMoxie requirements are from the project's own repository. No price is published as an offer because we hold none and will not hold one.",
    lastReviewed: "2026-08-08",
  },
  "living-ai-emo": {
    slug: "living-ai-emo",
    figures: [
      {
        afterHeading: "What the real EMO actually is",
        src: "/media/companion/emo/figure-1.webp",
        caption:
          "The genuine article on its charging base. The feature wording set into this artwork is promotional copy, not a BotPlanet finding.",
      },
      {
        afterHeading: "Accessories",
        src: "/media/companion/emo/figure-2.webp",
        caption:
          "The charging base, the ball, the mat and the rest, laid out together.",
      },
      {
        afterHeading: "Who should hold out for the real thing",
        src: "/media/companion/emo/card.webp",
        caption:
          "What owning one looks like. Buy it from Living.AI directly — the Amazon listings under this name are a different brand.",
      },
    ],
    image: {
      src: "/media/companion/emo/hero.webp",
      alt:
        "EMO standing on its charging base on a desk with its screen face lit cyan and headphones round its head. The feature wording in the supplied artwork is promotional copy, not a BotPlanet finding.",
    },
    categorySlug: "companion-robots",
    eyebrow: "Companion robot review",
    title: "Living.AI EMO robot review",
    seoTitle: "EMO Robot Review — And Why Amazon Sells Fakes",
    metaDescription:
      "The EMO robot is not sold on Amazon in the US, and searching for it " +
      "returns copies. What the real Living.AI EMO does, and what to buy instead " +
      "right now.",
    verdict:
      "The desktop robot everything else in this category gets compared against, and the hardest one to actually buy. Living.AI sells EMO directly and does not list it on Amazon in the US, so searching for it there returns imitations rather than the product.",
    bestFor:
      "Someone who wants the original, is willing to order from Living.AI directly, and will check what arrives against the real specification.",
    notIdealFor:
      "Anyone wanting it tomorrow from a familiar retailer with a familiar returns process. That is a different robot, and there are two good ones.",
    video: {
      url: "https://youtu.be/sXz2JPeYBCw",
      title: "EMO Robot 1 Year Review - Desktop Pet",
      channel: "The Nice City",
      source: "independent",
      note:
        "A year of ownership, independent and unaffiliated. This page exists because EMO is the term everybody searches and nobody here can sell it — so the most useful thing we can give you is somebody who has lived with one for twelve months rather than twelve minutes.",
    },
    facts: [
      { label: "On Amazon US", value: "No — copies only" },
      { label: "Sold by", value: "Living.AI, direct" },
      { label: "Sees", value: "HD camera, face recognition" },
      { label: "Hears", value: "4-microphone array" },
    ],
    specGroups: [
      {
        heading: "Buying it — read this first",
        rows: [
          { label: "Amazon US listing", value: "None found, 8 August 2026, across two searches" },
          { label: "What Amazon returns instead", value: "EMOPET and similar unbranded desk robots" },
          { label: "Brand token to look for", value: "Living.AI — absent from every top result we read" },
          { label: "Official channel", value: "living.ai, direct" },
          { label: "BotPlanet buy button", value: "None — we do not send buyers to a copy" },
        ],
      },
      {
        heading: "What the real EMO does",
        rows: [
          { label: "Form", value: "Bipedal desktop robot — it walks on two legs" },
          { label: "Sensors", value: "More than 10 internal sensors" },
          { label: "Vision", value: "HD camera with face recognition, remembers family members" },
          { label: "Hearing", value: "4-microphone array with sound source location" },
          { label: "Processing", value: "Neural network processor with on-board AI models" },
          { label: "Charging", value: "Its skateboard is a wireless charger, and charges a phone too" },
          { label: "Updates", value: "Over the air" },
        ],
      },
      {
        heading: "Accessories, at Living.AI's own prices",
        rows: [
          { label: "Home Station", value: "$99.00" },
          { label: "EMO Clothes (Corgi)", value: "$19.00" },
          { label: "EMO Smart Light", value: "$15.00" },
        ],
      },
    ],
    skuNote:
      "Capability and accessory pricing read from living.ai on 8 August 2026. No price is quoted for EMO itself because we hold no verified offer for it — Living.AI sells direct and there is no Amazon US listing to check against. Amazon was searched twice on the same day; both passes returned imitations.",
    lastReviewed: "2026-08-08",
  },

  /* Ropet KAMOMO. The last companion product built, and the only one found
     because searchers named it themselves — "moflin vs ropet" turned up in a
     free harvest and nothing in the plan knew the product existed.

     TWO FACTS THE MARKETING DOES NOT LEAD WITH, both from the maker's own
     listing: the AI conversation is gated behind roughly 20 to 25 days of
     bonding, and Amazon sells the Pro bundle for $40 less than Ropet's own
     store. Both are on the page. */
  ropet: {
    slug: "ropet",
    figures: [
      {
        afterHeading: "What it does while you wait, and after",
        src: "/media/companion/ropet/figure-2.webp",
        caption:
          "Asleep on its base on a bedside table. This is what it does for most of the day.",
      },
      {
        afterHeading: "The fur is the point",
        src: "/media/companion/ropet/figure-1.webp",
        caption:
          "The five plush covers and the eye colours. The names and the claims on this chart are Ropet's own marketing wording.",
      },
      {
        afterHeading: "What we cannot tell you",
        src: "/media/companion/ropet/panel-diary-privacy.webp",
        caption:
          "Ropet's own privacy panel, supplied with the artwork. Every claim on it — encryption, no data sharing, camera off by default — is the maker's, and BotPlanet has tested none of them.",
      },
    ],
    image: {
      src: "/media/companion/ropet/hero.webp",
      alt:
        "Ropet on a desk under a hand resting on its head, a round white robot in a cream fur cover with large blue eyes. The feature panels are Ropet's own marketing wording.",
    },
    categorySlug: "companion-robots",
    eyebrow: "Companion robot review",
    title: "Ropet KAMOMO review",
    seoTitle: "Ropet Review — The AI Pet That Makes You Wait",
    metaDescription:
      "A $299 companion robot with swappable fur and no allergies, whose conversation " +
      "unlocks after three weeks of bonding. What Ropet does, and what it withholds.",
    verdict:
      "A furry desk pet built around a deliberate delay: it learns you first and talks later, with the AI conversation arriving after roughly three weeks of daily handling. The fur comes off and swaps, most of it runs offline, and it costs $130 less than a Moflin.",
    bestFor:
      "Someone who wants a warm, furry companion, cannot have an animal because of allergies or a tenancy, and is willing to spend three weeks earning the conversation.",
    notIdealFor:
      "Anyone who wants it talking on day one, anyone who wants something with a long track record, or anyone who would resent buying fur separately.",
    video: {
      url: "https://youtu.be/Hl_SFV3NNLw",
      title: "Ropet Is FINALLY Here! | Full Pet Robot Test + Review",
      channel: "Eric's Tech World",
      source: "independent",
      note:
        "Independent, not Ropet's. A shipped-unit test rather than Kickstarter footage, which matters on a product this new — most of what is online for Ropet is still the campaign film.",
    },
    facts: [
      { label: "AI conversation", value: "After ~20–25 days" },
      { label: "Fur", value: "Removable and swappable" },
      { label: "Offline", value: "Most features, local chips" },
      { label: "Warranty", value: "1 year" },
    ],
    specGroups: [
      {
        heading: "The three-week wait",
        rows: [
          { label: "AI conversation unlocks", value: "After around 20 to 25 days of bonding" },
          { label: "Before that", value: "Responds to voice, touch and gestures" },
          { label: "Long-term memory", value: "Yes — recognises its owner and adapts" },
          { label: "AI Diary", value: "Captures photos and records daily activity" },
        ],
      },
      {
        heading: "Privacy, which is the unusual part",
        rows: [
          { label: "Offline operation", value: "Most features, using local processing chips" },
          { label: "Maker's claim", value: "No account needed for the core experience" },
          { label: "Subscription", value: "None published" },
        ],
      },
      {
        heading: "Physical",
        rows: [
          { label: "Size", value: "9.92 × 5.91 × 5.91 in" },
          { label: "Weight", value: "1.3 lb" },
          { label: "Battery", value: "Rechargeable, included" },
          { label: "In the box", value: "KAMOMO, charging base, USB-C cable, manual" },
          { label: "Fur", value: "Removable — sold separately in other colours" },
          { label: "Age rating", value: "Over 3 years" },
        ],
      },
      {
        heading: "What the extras cost, at Ropet's own prices",
        rows: [
          { label: "Berry Blush Bunny Fur", value: "$39.00" },
          { label: "Panda fur and sleeping mask", value: "$28.00" },
          { label: "Pro bundle, direct from Ropet", value: "$339.00" },
          { label: "Warranty and returns", value: "1 year; 30 days" },
        ],
      },
    ],
    skuNote:
      "Hardware and packing list from the Amazon listing B0GTPZ4N4M, accessory and bundle pricing from ropetai.com, both read 8 August 2026. The listing is the Pro configuration — its own packing list names the charging base Ropet sells separately. A NEW PRODUCT: 4.1 stars from 47 ratings, against 12,307 on the Joy For All cat.",
    lastReviewed: "2026-08-08",
  },

  /* ============================================================
     PET CAMERA ROBOTS, 8 August 2026.

     THE PAGE PLAN'S MODEL LIST WAS STALE AND THE RESEARCH FOUND
     IT. Three reviews were planned on 6 August — EBO Air at
     1,000/mo, EBO X at 260, EBO SE at 260 — and a listing-by-
     listing read of Amazon on 8 August found neither the Air nor
     the X on sale. Enabot now sells seven machines. Two of the
     three planned pages were for products nobody can buy.

     "enabot ebo air" still measures 1,000/mo at KD 0, and its
     SERP already serves Air 2 results — Enabot's own store, the
     Air 2 on Amazon, CNET's Air 2 review. Google merged the old
     term into the current range, so the Air 2 page carries it
     rather than a redirect doing the work.
     ============================================================ */
  "enabot-ebo-air-2": {
    slug: "enabot-ebo-air-2",
    figures: [
      {
        afterHeading: "Where this sits in the range",
        src: "/media/petcam/range/hero.webp",
        caption:
          "The four Enabot machines at the same scale: the Air 2, the SE, the ROLA Mini and the ROLA PetPal, smallest to largest.",
      },
      {
        afterHeading: "What $149 gets you",
        src: "/media/petcam/ebo-air-2/figure-1.webp",
        caption:
          "The Air 2 at rest on a rug, which is where a robot like this spends most of its time.",
      },
      {
        afterHeading: "The range, and what the extra money actually buys",
        src: "/media/petcam/ebo-air-2/figure-2.webp",
        caption:
          "Tracks over a rug edge, and the return to the dock. Both panels carry Enabot's own feature wording.",
      },
      {
        afterHeading: "Who this is for",
        src: "/media/petcam/ebo-air-2/card.webp",
        caption:
          "Small enough to be ignored by the animals it is watching.",
      },
      {
        afterHeading: "What we cannot tell you",
        src: "/media/petcam/ebo-air-2/panel-overview.webp",
        caption:
          "Enabot's own overview panel. It prints 1080p; Enabot's own listing records this camera as 2K. The figure on the artwork is the maker's and we have not measured either.",
      },
    ],
    image: {
      src: "/media/petcam/ebo-air-2/hero.webp",
      alt:
        "The Enabot EBO Air 2 on a rug with a heart lit on its face, beside night-vision and daylight views of the same dog. The specifications printed in the artwork are Enabot's own figures.",
    },
    categorySlug: "pet-camera-robots",
    eyebrow: "Pet camera robot review",
    title: "Enabot EBO Air 2 review",
    seoTitle: "Enabot EBO Air 2 Review — And Which One to Buy",
    metaDescription:
      "The EBO Air 2 is a $149 camera that drives itself around your house. How " +
      "it differs from the 2S and the Plus, and why the original Air is gone.",
    verdict:
      "A 2K camera on tracked wheels that you drive from your phone and that parks itself when the battery runs low. At $149 it is the one to buy in Enabot's range, and the more expensive models buy resolution and chat rather than a better robot.",
    bestFor:
      "One floor of a house, a pet you want to find rather than merely watch, and anybody who refuses to pay a monthly fee for a camera.",
    notIdealFor:
      "A house where the animal is upstairs. It has wheels, not legs, and no camera robot on the US market climbs stairs.",
    video: {
      url: "https://youtu.be/F_E07zmdL0o",
      title: "EBO Air 2 Review: My Cats HATED it",
      channel: "Alex Kidman",
      source: "independent",
      note:
        "We are linking a negative review on purpose. It is independent, not ours. The premise of a pet camera robot is that your animal tolerates it, and this reviewer's cats did not \u2014 a real outcome nobody selling these will show you. Watch it as the downside case rather than as the verdict.",
    },
    facts: [
      { label: "Camera", value: "2K, night vision" },
      { label: "Drive", value: "Tracked wheels, from the app" },
      { label: "Charging", value: "Auto-returns to dock" },
      { label: "Subscription", value: "None" },
    ],
    specGroups: [
      {
        heading: "What it does",
        rows: [
          { label: "Resolution", value: "2K (1296p)" },
          { label: "Night vision", value: "Yes" },
          { label: "Two-way talk", value: "Yes" },
          { label: "Movement", value: "Tracked wheels, driven from the app" },
          { label: "Auto-recharge", value: "Returns to its dock when the battery is low" },
          { label: "Display", value: "Custom emoticon face" },
        ],
      },
      {
        heading: "Physical",
        rows: [
          { label: "Size", value: "3.74 × 3.74 × 3.51 in" },
          { label: "Weight", value: "0.74 kg" },
          { label: "Battery", value: "2,500 mAh" },
          { label: "Stairs", value: "No — one floor only" },
        ],
      },
      {
        heading: "The rest of the range, and what the money buys",
        rows: [
          { label: "EBO SE", value: "$119 — 1080p, no emoticon face" },
          { label: "EBO ROLA Mini", value: "$139 — 2K" },
          { label: "EBO Air 2 (this one)", value: "$149 — 2K" },
          { label: "ROLA PetPal", value: "$179 — 2.5K, treat dispenser" },
          { label: "EBO Mini", value: "$199 — 2K" },
          { label: "EBO Air 2S", value: "$299 — 2.5K" },
          { label: "EBO Air 2 Plus", value: "$359 — 3K, GPT and Gemini chat" },
        ],
      },
      {
        heading: "Ownership",
        rows: [
          { label: "Subscription", value: "None on any Enabot model we read" },
          { label: "Sold by", value: "Enabot Official Store, shipped by Amazon" },
          { label: "Setup", value: "Charge, install the app, scan a QR code" },
        ],
      },
    ],
    skuNote:
      "Read from the Amazon listing B0DZHDF7MD and Enabot's own comparison table on 8 August 2026. Three ASINs carry this title at this price — B0DZHG7Y6T and B0DZHG4LZK are the other colours. The Air 2S and Air 2 Plus are different machines, not colours. The original EBO Air is no longer listed.",
    lastReviewed: "2026-08-08",
  },

  "enabot-ebo-se": {
    slug: "enabot-ebo-se",
    figures: [
      {
        afterHeading: "The size is the actual argument",
        src: "/media/petcam/range/size-chart.webp",
        caption:
          "Enabot's own size chart. It gives the SE as 3.1 inches wide where Enabot's own listing says 3.8 — the figures on the chart are the maker's and we have measured neither.",
      },
      {
        afterHeading: "What you give up against the Air 2",
        src: "/media/petcam/ebo-se/figure-1.webp",
        caption:
          "The SE and the Air 2 in the same frame at the same scale. The size difference is the buying argument between them.",
      },
      {
        afterHeading: "Who this is for",
        src: "/media/petcam/ebo-se/figure-2.webp",
        caption:
          "In a dark room with the lights off, which is when a pet camera earns its keep.",
      },
      {
        afterHeading: "Where this sits in the range",
        src: "/media/petcam/ebo-se/card.webp",
        caption:
          "The smallest of the four, and the one that goes where the cat went.",
      },
    ],
    image: {
      src: "/media/petcam/ebo-se/hero.webp",
      alt:
        "The Enabot EBO SE on a dark wooden floor with a blue heart lit on its face. The panel wording in the artwork is Enabot's own marketing copy.",
    },
    categorySlug: "pet-camera-robots",
    eyebrow: "Pet camera robot review",
    title: "Enabot EBO SE review",
    seoTitle: "Enabot EBO SE Review — The $119 One That Fits Under",
    metaDescription:
      "The EBO SE is the cheapest driving pet camera Enabot sells: 1080p, a " +
      "360-degree view, no subscription, and small enough to go under the sofa.",
    verdict:
      "The entry point, and the one that gets under furniture. 1080p instead of 2K and no emoticon face, but it drives, talks, sees in the dark and docks itself for $30 less than the Air 2.",
    bestFor:
      "A first one, a cat that hides under things, or anybody who wants to find out whether a driving camera is useful before spending more.",
    notIdealFor:
      "Anyone who will be annoyed by 1080p on a large screen, or who wants the treat dispenser.",
    video: {
      url: "https://youtu.be/s9yYa6VhL-g",
      title: "Enabot Ebo SE: Worth Buying in 2025? | 6-Month Review",
      channel: "Pepper Projectz",
      source: "independent",
      note:
        "Six months of use rather than a first impression, which is the only kind of footage that says anything useful about a battery robot. Independent, and not ours.",
    },
    facts: [
      { label: "Camera", value: "1080p, night vision" },
      { label: "View", value: "360 degrees" },
      { label: "Charging", value: "Auto-returns to dock" },
      { label: "Subscription", value: "None" },
    ],
    specGroups: [
      {
        heading: "What it does",
        rows: [
          { label: "Resolution", value: "1080p" },
          { label: "Field of view", value: "360 degrees" },
          { label: "Night vision", value: "Yes" },
          { label: "Two-way talk", value: "Yes" },
          { label: "Movement", value: "Driven from the app; low enough for under furniture" },
          { label: "Auto-recharge", value: "Returns to its dock when low" },
        ],
      },
      {
        heading: "Physical",
        rows: [
          { label: "Size", value: "3.8 × 3.8 × 3.5 in" },
          { label: "Battery", value: "2,500 mAh" },
          { label: "Stairs", value: "No — one floor only" },
        ],
      },
      {
        heading: "Ownership",
        rows: [
          { label: "Subscription", value: "None" },
          { label: "Sold by", value: "Enabot Official Store, shipped by Amazon" },
        ],
      },
    ],
    skuNote:
      "Read from the Amazon listing B09R6V3CJM on 8 August 2026. NOT B0CGV82XTT, which carries the same product name at the same price under the seller name 'Rocon' and serves a different ASIN — check the seller reads Enabot Official Store before ordering.",
    lastReviewed: "2026-08-08",
  },

  "enabot-rola-petpal": {
    slug: "enabot-rola-petpal",
    figures: [
      {
        afterHeading: "Where this sits in the range",
        src: "/media/petcam/range/hero.webp",
        caption:
          "The whole Enabot line at one scale. The PetPal is the big one, and the size is most of what separates it.",
      },
      {
        afterHeading: "Treats that come to the animal",
        src: "/media/petcam/rola-petpal/figure-1.webp",
        caption:
          "The hopper, open. Nothing else in this category carries one.",
      },
      {
        afterHeading: "The rest of it",
        src: "/media/petcam/rola-petpal/panel-summary.webp",
        caption:
          "Enabot's own summary sheet, supplied with the artwork. The size and night-vision claims on it are the maker's wording.",
      },
      {
        afterHeading: "It is much bigger than the others",
        src: "/media/petcam/rola-petpal/figure-2.webp",
        caption:
          "The PetPal beside the Air 2 at the same scale. Buyers do not expect the difference.",
      },
      {
        afterHeading: "What we cannot tell you",
        src: "/media/petcam/rola-petpal/panel-overview.webp",
        caption:
          "Enabot's own overview panel. It prints 1080p; Enabot's own listing records 2.5K. The figure is the maker's and we have not measured it.",
      },
    ],
    image: {
      src: "/media/petcam/rola-petpal/hero.webp",
      alt:
        "A golden retriever taking a treat from the open hopper of the ROLA PetPal on a kitchen floor.",
    },
    categorySlug: "pet-camera-robots",
    eyebrow: "Pet camera robot review",
    title: "Enabot ROLA PetPal review",
    seoTitle: "Enabot ROLA PetPal Review — Treats On Wheels",
    metaDescription:
      "The ROLA PetPal is the only pet camera robot that drives to your dog and " +
      "gives it a treat. What the dispenser adds over a Furbo, and what " +
      "modularity costs.",
    verdict:
      "The one machine that combines a treat dispenser with a camera that moves. Furbo throws treats from a shelf and Enabot's other models drive without treats — this does both, at 2.5K, for $179.",
    bestFor:
      "A dog you want to reward rather than just watch, on one floor, without a monthly fee.",
    notIdealFor:
      "Cats, mostly. And anyone who wants the smallest possible robot — this one is twice the size of the Air 2.",
    video: {
      url: "https://youtu.be/PDVgZGxRfXg",
      title: "2024 Enabot ROLA PetPal Unboxing, Set Up, Testing and Full App Tutorial",
      channel: "BearBear Cammy",
      source: "independent",
      note:
        "Independent, and the reason to watch it is the treat dispenser working — the one thing this machine has that no other robot in the category does. It is a tutorial as much as a review.",
    },
    facts: [
      { label: "Treat dispenser", value: "Built in" },
      { label: "Camera", value: "2.5K, night vision" },
      { label: "Modules", value: "Interactive Module sold separately" },
      { label: "Subscription", value: "None" },
    ],
    specGroups: [
      {
        heading: "What it does",
        rows: [
          { label: "Treat dispenser", value: "Built in, triggered from the app" },
          { label: "Resolution", value: "2.5K" },
          { label: "Night vision", value: "Yes" },
          { label: "Two-way talk", value: "Yes" },
          { label: "Movement", value: "Manually driven from the app" },
          { label: "Auto-recharge", value: "Auto-docks when low" },
          { label: "Modular", value: "Optional Interactive Module, sold separately" },
        ],
      },
      {
        heading: "Physical",
        rows: [
          { label: "Size", value: "9.02 × 9.02 × 10 in" },
          { label: "Against the Air 2", value: "Roughly three times the footprint" },
          { label: "Stairs", value: "No — one floor only" },
        ],
      },
      {
        heading: "Ownership",
        rows: [
          { label: "Subscription", value: "None — the listing answers this outright" },
          { label: "Sold by", value: "Enabot Official Store, shipped by Amazon" },
          { label: "Ratings", value: "4.0 from 26, so it is new" },
        ],
      },
    ],
    skuNote:
      "Read from the Amazon listing B0GMQW1HX6 on 8 August 2026. The ROLA Mini (B0DDC9DZKK, $139) shares the ROLA name and has no treat dispenser, which is the only reason to buy this model.",
    lastReviewed: "2026-08-08",
  },
  /* ============================================================
     EDUCATIONAL AND CODING ROBOTS, 8 August 2026. Five of twelve.

     THE OTHER SEVEN ARE NOT HERE ON PURPOSE. Five had the wrong
     ASIN or the wrong product behind them and two cannot be
     bought at all. The pattern is one thing: this category sells
     to schools as much as to parents. The Bee-Bot candidate is a
     $691 six-robot class pack against a 4,400/mo consumer term;
     SPIKE Essential is a $597 education SKU; VEX GO has the best
     difficulty score in the category and no Amazon listing
     because VEX sells it through schools.

     The brand terms were measured and refused the same day —
     sphero 27,100, ozobot 14,800, vex robotics 33,100 — because
     their SERPs are the manufacturer's own site, its app, its
     coding IDE, Wikipedia and classroom distributors. Enabot's
     brand SERP had an editorial gap; these do not.
     ============================================================ */
  "sphero-bolt": {
    slug: "sphero-bolt",
    image: {
      src: "/media/coding/sphero-bolt/hero.webp",
      alt:
        "A clear Sphero BOLT on a wooden floor with its blue LED matrix lit, a child's hand reaching for it. Sphero's own name and the words programmable robotic ball are set into the artwork.",
    },
    figures: [
      {
        afterHeading: "The LED matrix is what makes block coding feel like something",
        src: "/media/coding/sphero-bolt/figure-1.webp",
        caption:
          "The matrix and the drive gear, seen through the shell. It is the one part of this robot that shows you what your program did.",
      },
      {
        afterHeading: "Three ways to code it, and the third one is the point",
        src: "/media/coding/sphero-bolt/figure-2.webp",
        caption:
          "The third way: real JavaScript against the same ball, in a text editor rather than a block canvas.",
      },
      {
        afterHeading: "Four hours, and it charges without a socket",
        src: "/media/coding/sphero-bolt/card.webp",
        caption:
          "It charges by induction on the base, so there is no port to break and nothing to plug in.",
      },
    ],
    categorySlug: "educational-coding-robots",
    eyebrow: "Coding robot review",
    title: "Sphero BOLT review",
    seoTitle: "Sphero BOLT Review — The One That Grows With Them",
    metaDescription:
      "The Sphero BOLT is a $179 coding ball that starts with drawing and ends in " +
      "Python. Whether it is worth three times a Sphero Mini, and who outgrows " +
      "it.",
    verdict:
      "The one robot here a child does not outgrow in a year. BOLT starts with drawing a path on a screen and ends with real Python, and the LED matrix is what makes the middle step — block coding — feel like it produces something rather than just moving a ball.",
    bestFor:
      "A child around eight to thirteen who will still be interested in a year, and a household happy to spend once rather than replace.",
    notIdealFor:
      "Under-eights, and anybody who wants to find out cheaply whether their child likes coding. The Mini does that for a quarter of the price.",
    video: {
      url: "https://youtu.be/GM9uVo42-FI",
      title: "Robot Review: Five Activities with Sphero Bolt",
      channel: "STEM with Mr N",
      source: "independent",
      note:
        "An independent teacher running five real activities rather than an unboxing, and not ours. It shows what a lesson with this robot actually looks like, which is the thing a parent cannot judge from a box. Note it is the original BOLT and not the BOLT+ \u2014 the two are easy to confuse in search results, and this one matches what we sell.",
    },
    facts: [
      { label: "Ages", value: "8+" },
      { label: "Code in", value: "Draw, Blocks, Python, JavaScript" },
      { label: "Play time", value: "4+ hours" },
      { label: "Waterproof", value: "Yes" },
    ],
    specGroups: [
      {
        heading: "What makes it the BOLT",
        rows: [
          { label: "Code three ways", value: "Draw, Blocks, and text in Python or JavaScript" },
          { label: "LED matrix", value: "Programmable — displays movement, messages and data" },
          { label: "Sensors", value: "Programmable, used to detect and respond" },
          { label: "App", value: "Sphero Edu" },
          { label: "Charging", value: "Inductive" },
        ],
      },
      {
        heading: "Physical",
        rows: [
          { label: "Diameter", value: "2.87 in" },
          { label: "Weight", value: "1.1 lb" },
          { label: "Battery", value: "Lithium-ion polymer" },
          { label: "Play time", value: "4+ hours" },
          { label: "Waterproof", value: "Yes" },
        ],
      },
      {
        heading: "Ages",
        rows: [
          { label: "Manufacturer rating", value: "8+, elementary through high school" },
          { label: "Where it stops", value: "It does not — the text-coding step keeps going" },
        ],
      },
    ],
    skuNote:
      "Read from the Amazon listing B07DLM5DL7 on 8 August 2026. Sphero sells BOLT, BOLT+, Mini, indi, RVR and SPRK+, and the details table's Sub Brand row is what identifies this one.",
    lastReviewed: "2026-08-08",
  },

  "sphero-mini": {
    slug: "sphero-mini",
    image: {
      src: "/media/coding/sphero-mini/hero.webp",
      alt:
        "A blue and white Sphero Mini beside a phone running its driving app. The panel wording describing it is promotional copy rather than a BotPlanet finding.",
    },
    figures: [
      {
        afterHeading: "The size cuts both ways",
        src: "/media/coding/sphero-mini/figure-1.webp",
        caption:
          "The Mini beside a BOLT at the same scale. Roughly half the diameter, and a quarter of the price.",
      },
      {
        afterHeading: "One hour, and that is the thing people are annoyed by",
        src: "/media/coding/sphero-mini/figure-2.webp",
        caption:
          "The shell lifts off to reach the charging port. An hour of play against about an hour on the cable.",
      },
      {
        afterHeading: "Who this is for",
        src: "/media/coding/sphero-mini/card.webp",
        caption:
          "Small enough to be a desk object and a cat toy at once, which is most of its appeal.",
      },
    ],
    categorySlug: "educational-coding-robots",
    eyebrow: "Coding robot review",
    title: "Sphero Mini review",
    seoTitle: "Sphero Mini Review — The Cheap Way to Find Out",
    metaDescription:
      "The Sphero Mini is a $50 coding ball the size of a ping-pong ball, running " +
      "the same app as the $179 BOLT. What the one-hour battery costs you.",
    verdict:
      "The cheapest honest way to find out whether a child likes coding. It runs the same Sphero Edu app as the BOLT — the same drawing, blocks and text — in a ball the size of a ping-pong ball, and it lasts about an hour between charges.",
    bestFor:
      "A first coding robot, a stocking present, or a household not yet sure the interest is real.",
    notIdealFor:
      "Anyone who wants it to last an afternoon. One hour of play is the specification and it is the thing people are surprised by.",
    video: {
      url: "https://youtu.be/Qu_TKpfSK20",
      title: "Sphero Mini Review: Big Fun in a Tiny Robot!",
      channel: "Everything STEM",
      source: "independent",
      note:
        "Independent, and useful mostly for scale \u2014 the Mini is a ping-pong ball and no photograph conveys that as well as watching somebody hold one. It does not run the battery down, which is this machine's real limitation.",
    },
    facts: [
      { label: "Size", value: "1.57 in — a ping-pong ball" },
      { label: "Play time", value: "About 1 hour" },
      { label: "Same app as BOLT", value: "Yes" },
      { label: "Doubles as", value: "A game controller" },
    ],
    specGroups: [
      {
        heading: "What it does",
        rows: [
          { label: "Coding", value: "Draw, blocks, and text — the same Sphero Edu app as the BOLT" },
          { label: "Sensors", value: "Gyroscope and accelerometer" },
          { label: "Lights", value: "Programmable LED" },
          { label: "Drive modes", value: "Joystick, Slingshot and others in Sphero Play" },
          { label: "Games", value: "Works as a controller for arcade games in the app" },
        ],
      },
      {
        heading: "Physical",
        rows: [
          { label: "Diameter", value: "1.57 in" },
          { label: "Weight", value: "0.11 kg" },
          { label: "Battery", value: "Rechargeable, about 1 hour of play" },
          { label: "Shell", value: "Opens for charging" },
        ],
      },
      {
        heading: "Ages",
        rows: [
          { label: "Manufacturer rating", value: "8+" },
        ],
      },
    ],
    skuNote:
      "Read from the Amazon listing B072B6QVVW on 8 August 2026. The productTitle element did not render on our read, so identity rests on the details table — Sub Brand 'Mini', Colour 'Blue' — rather than on the title. Sphero sells the Mini in several colours and this ASIN is the Blue.",
    lastReviewed: "2026-08-08",
  },

  "sphero-indi": {
    slug: "sphero-indi",
    image: {
      src: "/media/coding/sphero-indi/hero.webp",
      alt:
        "A young child kneeling on a wooden floor laying a green colour card in front of a blue indi car, with a track of cards already down.",
    },
    figures: [
      {
        afterHeading: "How a card becomes a program",
        src: "/media/coding/sphero-indi/figure-1.webp",
        caption:
          "Each colour is an instruction. The car reads the card it drives over and does what the colour says.",
      },
      {
        afterHeading: "Screen-free is the actual product",
        src: "/media/coding/sphero-indi/panel-overview.webp",
        caption:
          "The four base instructions — drive, spin, sound, wait. The line calling it a robot that teaches real skills is promotional copy rather than our finding.",
      },
      {
        afterHeading: "What it teaches, honestly stated",
        src: "/media/coding/sphero-indi/figure-2.webp",
        caption:
          "A course built from books and blocks. The floor is the canvas, which is the whole idea and also the limit.",
      },
      {
        afterHeading: "Who this is for",
        src: "/media/coding/sphero-indi/card.webp",
        caption:
          "No screen, no app required, and nothing to read. That is the age range it fits.",
      },
    ],
    categorySlug: "educational-coding-robots",
    eyebrow: "Coding robot review",
    title: "Sphero indi review",
    seoTitle: "Sphero indi Review — Coding With No Screen At All",
    metaDescription:
      "The Sphero indi is a $100 robot a four-year-old programs with coloured " +
      "cards and no screen. What indi teaches, and the age it stops working.",
    verdict:
      "The one product here that teaches programming without a screen. A four-year-old lays coloured cards on the floor, indi drives over them and does what each colour says, and that is a program — cause, effect and sequence, with nothing to log into.",
    bestFor:
      "Four to seven, and any household that would rather not add another screen to the day.",
    notIdealFor:
      "Anyone over about seven. The colour-card idea has a ceiling and Sphero says so — its own age field stops at 144 months.",
    video: {
      url: "https://youtu.be/eW3Q33CK55A",
      title: "Unboxing My New Sphero indi Robot | Screenless Coding for Kids",
      channel: "The Snuggle Cailey",
      source: "independent",
      note:
        "An independent owner's unboxing rather than Sphero's own film, and that is deliberate: the manufacturer's video is a polished classroom advert, and what a buyer needs to see is the colour cards going down on an ordinary floor.",
    },
    facts: [
      { label: "Ages", value: "4 to about 7" },
      { label: "Screen", value: "Not required" },
      { label: "Programming", value: "Coloured cards" },
      { label: "App", value: "Optional" },
    ],
    specGroups: [
      {
        heading: "How it works",
        rows: [
          { label: "Screenless mode", value: "Coloured cards laid on the floor, no device needed" },
          { label: "App mode", value: "Optional simplified drag-and-drop" },
          { label: "What it teaches", value: "Cause and effect, pattern recognition, colours, directions" },
          { label: "Play", value: "Children build mazes for it to navigate" },
        ],
      },
      {
        heading: "Physical",
        rows: [
          { label: "Weight", value: "0.56 kg" },
          { label: "Material", value: "Plastic and silicone" },
          { label: "Customising", value: "Stickers included" },
        ],
      },
      {
        heading: "Ages",
        rows: [
          { label: "Manufacturer rating", value: "4+" },
          { label: "Manufacturer age field", value: "48 to 144 months" },
          { label: "The ceiling", value: "Real, and the reason to buy something else at eight" },
        ],
      },
    ],
    skuNote:
      "Read from the Amazon listing B094X6TV5V on 8 August 2026. Sphero also sells indi as a classroom pack; the details table's colour row identifies this as the At-Home Learning Kit.",
    lastReviewed: "2026-08-08",
  },

  "ozobot-evo": {
    slug: "ozobot-evo",
    image: {
      src: "/media/coding/ozobot-evo/hero.webp",
      alt:
        "The Ozobot Evo Entry Kit as it ships: the retail box, a zipped case, a pack of washable colour-code markers, a Meet Evo booklet and the small white robot.",
    },
    figures: [
      {
        afterHeading: "Colour codes on paper, then a block editor",
        src: "/media/coding/ozobot-evo/figure-1.webp",
        caption:
          "A drawn line with a colour code in it. The words on this picture are Ozobot's own marketing wording.",
      },
      {
        afterHeading: "The 700 lessons are the reason to buy it over a toy",
        src: "/media/coding/ozobot-evo/figure-2.webp",
        caption:
          "The block editor, and the way a program gets loaded — the robot is held against the screen and reads it as flashing light.",
      },
      {
        afterHeading: "Amazon says \"Toddler\" and Amazon is wrong",
        src: "/media/coding/ozobot-evo/card.webp",
        caption:
          "The kit as it ships. Its own heading says ages 4 and up; this page uses 5 to 11, which is what Ozobot's product title and age fields say. Amazon's category label reads Toddler. Three sources, three answers.",
      },
    ],
    categorySlug: "educational-coding-robots",
    eyebrow: "Coding robot review",
    title: "Ozobot Evo review",
    seoTitle: "Ozobot Evo Review — 700 Lessons and a Marker Pen",
    metaDescription:
      "The Ozobot Evo is a $175 coding robot that reads lines drawn in felt-tip. " +
      "What the Evo Entry Kit includes, and why it is built for a classroom.",
    verdict:
      "A robot that follows lines you draw and obeys colour codes written in marker pen, with a block-coding app behind it carrying five skill levels and over 700 free lessons. It is built for a classroom and it works at a kitchen table.",
    bestFor:
      "Five to eleven, and any adult who wants a lesson plan rather than a toy — teacher or parent.",
    notIdealFor:
      "Anyone who wants the child to reach real text programming. Evo's ceiling is Blockly; the Sphero BOLT is where you go for Python.",
    video: {
      url: "https://youtu.be/opGHngaF7_s",
      title: "Ozobot Evo Review",
      channel: "Andru Edwards",
      source: "independent",
      note:
        "Independent, and it shows the marker-pen colour codes working \u2014 the part of this product people do not believe until they see it. It does not go into the Blockly editor, where the older half of the age range spends its time.",
    },
    facts: [
      { label: "Ages", value: "5 to 11" },
      { label: "Programming", value: "Marker-pen colour codes, then Blockly" },
      { label: "Lessons", value: "700+ free" },
      { label: "Skill levels", value: "Five" },
    ],
    specGroups: [
      {
        heading: "How it works",
        rows: [
          { label: "Screen-free start", value: "Colour codes drawn on paper in the supplied markers" },
          { label: "Then", value: "Ozobot Blockly, five skill levels from beginner to master" },
          { label: "Lessons", value: "Over 700 free, covering STEAM, computer science and core subjects" },
          { label: "Kit", value: "Evo Entry Kit — robot, markers and accessories" },
        ],
      },
      {
        heading: "Physical",
        rows: [
          { label: "Kit size", value: "8.5 × 6.5 × 1.8 in" },
          { label: "Weight", value: "0.44 kg" },
          { label: "Build", value: "Durable, sold as classroom-ready" },
        ],
      },
      {
        heading: "Ages",
        rows: [
          { label: "Title and maker", value: "5 to 11" },
          { label: "Amazon's category field", value: "Reads 'Toddler', which is wrong — believe the title" },
        ],
      },
    ],
    skuNote:
      "Read from the Amazon listing B0CSR53WXV on 8 August 2026. Amazon's Age Range Description field reads 'Toddler', contradicting both the listing title and Ozobot's own rating; the title is believed and this page uses 5 to 11.",
    lastReviewed: "2026-08-08",
  },

  "makeblock-mbot": {
    slug: "makeblock-mbot",
    image: {
      src: "/media/coding/makeblock-mbot/hero.webp",
      alt:
        "A blue mBot on a plain background with several of its parts floating away from it: a bracket, a perforated plate, a yellow flag and a blue beam.",
    },
    figures: [
      {
        afterHeading: "Fifteen minutes with a screwdriver",
        src: "/media/coding/makeblock-mbot/figure-1.webp",
        caption:
          "Assembled, with the booklet behind it. This is what fifteen minutes gets you.",
      },
      {
        afterHeading: "What the build teaches that the code does not",
        src: "/media/coding/makeblock-mbot/figure-2.webp",
        caption:
          "The maker's own three-panel summary. The middle label is misspelt in the supplied artwork; the word is electronics.",
      },
      {
        afterHeading: "Then it is block coding, in Scratch",
        src: "/media/coding/makeblock-mbot/panel-app.webp",
        caption:
          "Driving it from the phone app, which is where most owners start before the Scratch editor.",
      },
      {
        afterHeading: "mBot2, mBot Ranger, and which one this is",
        src: "/media/coding/makeblock-mbot/card.webp",
        caption:
          "The original mBot, head-on. Two ultrasonic sensors above a printed smile is how you tell it from the mBot2.",
      },
    ],
    categorySlug: "educational-coding-robots",
    eyebrow: "Coding robot review",
    title: "Makeblock mBot review",
    seoTitle: "Makeblock mBot Review — Build It, Then Code It",
    metaDescription:
      "The Makeblock mBot is a $69 robot a child assembles in about 15 minutes " +
      "and then programs in Scratch. The cheapest way into real electronics.",
    verdict:
      "The only one here that arrives in pieces, and that is the point. A child builds it in about a quarter of an hour, learns what the parts do while doing it, and then programs the result in Scratch. Nothing else at this price teaches the hardware as well as the code.",
    bestFor:
      "Eight to twelve, and a child who likes taking things apart as much as making them work.",
    notIdealFor:
      "Anyone who wants it working out of the box, and anyone who would find a loose bag of components stressful rather than inviting.",
    video: {
      url: "https://youtu.be/vbukZVWeLnY",
      title: "Makeblock mBot Educational Robot Kit STEM Coding Toy Review Build & Play",
      channel: "The Young Prince and The Railroad",
      source: "independent",
      note:
        "Independent, not ours. The build is the whole argument for this robot and this video shows it start to finish, with a child doing it. Watch it before you buy: if the loose parts look like a bad evening rather than a good one, that is your answer.",
    },
    facts: [
      { label: "Ages", value: "8 to 12" },
      { label: "Build time", value: "About 15 minutes" },
      { label: "Coding", value: "Scratch" },
      { label: "Arrives", value: "In pieces" },
    ],
    specGroups: [
      {
        heading: "What makes it different",
        rows: [
          { label: "Assembly", value: "Built from parts in about 15 minutes" },
          { label: "Teaches", value: "Electronics, machinery and robotics components, not only code" },
          { label: "Coding", value: "Scratch-based, drag and drop" },
          { label: "Level", value: "Entry — designed as a first robotics kit" },
        ],
      },
      {
        heading: "Ages",
        rows: [
          { label: "Manufacturer rating", value: "8 to 12" },
        ],
      },
    ],
    skuNote:
      "Read from the Amazon listing B00SK5RUQY on 8 August 2026. Makeblock also sells the mBot2, the mBot Ranger and the mBot Ultimate; none of those names appears in this listing's title. The productTitle element did not render on our second read, so this rests on the search-result title and the served-ASIN equality check.",
    lastReviewed: "2026-08-08",
  },

  /* BOTLEY 2.0, added 26 September 2026. One of the seven coding robots the
     8 August research left unbuilt — the ASIN on file then served a
     classroom bundle rather than the single consumer unit. Re-checked
     because the head term swings from a few hundred searches a month to
     4,400 every December, and the swing is on the product name itself, not
     on any "gift" phrasing — see docs/seo/coding-robots-gift-topup-findings.md. */
  "botley-the-coding-robot": {
    slug: "botley-the-coding-robot",
    categorySlug: "educational-coding-robots",
    eyebrow: "Coding robot review",
    title: "Botley 2.0 review",
    seoTitle: "Botley 2.0 Review — Screen-Free Coding Before They Can Read",
    metaDescription:
      "Botley 2.0 is a screen-free coding robot for ages 5 to 7: a child programs " +
      "moves with a remote, Botley plays them back. What the activity set does and does not.",
    verdict:
      "A coding toy built for a child who cannot yet read fluently, let alone code on a screen. A detachable remote programs up to 80 moves at once by pressing directional buttons in sequence; Botley then drives that sequence back. No app, no login, no screen at any point.",
    bestFor:
      "A five to seven year old getting their first taste of sequencing and cause-and-effect, and a household that wants a coding toy with no screen involved anywhere.",
    notIdealFor:
      "A child who has already outgrown screen-free sequencing — there is no coding-app tier to grow into here the way Sphero's lineup offers one.",
    facts: [
      { label: "Ages", value: "5 to 7 (manufacturer rating)" },
      { label: "Coding method", value: "Detachable remote, screen-free" },
      { label: "Sequence length", value: "Up to 80 steps in one program" },
      { label: "Included", value: "Activity mats and cards, per the manufacturer's standard set" },
    ],
    specGroups: [
      {
        heading: "What it does",
        rows: [
          { label: "Coding", value: "Remote-control button sequence, played back by the robot — no app or screen" },
          { label: "Sequence length", value: "Up to 80 steps, per the manufacturer" },
          { label: "Sensors", value: "Object detection to avoid driving off a mat edge, per the manufacturer" },
          { label: "In the box", value: "Robot, detachable remote and activity cards/mats — exact count varies by listing" },
        ],
      },
      {
        heading: "Ages",
        rows: [
          { label: "Manufacturer rating", value: "5 to 7" },
        ],
      },
    ],
    skuNote:
      "IDENTITY NOT READ FROM THE LISTING ITSELF. ASIN B083T58PKM found via web search — 'Learning Resources Botley the Coding Robot 2.0 Activity Set - 78 Pieces, Ages 5+' — because Amazon blocked every direct fetch attempted. No price is published here: search snippets disagreed across sources ($64 to $84.99), so nothing is quoted until the automated refresh service reads and dates a real figure. Learning Resources also sells a materially more expensive Classroom Set; this ASIN is the standard retail activity set, not that one.",
    lastReviewed: "2026-09-26",
  },

  /* CODE & GO ROBOT MOUSE, added 26 September 2026. Same research pass as
     Botley — see the note above it. Smaller head term (590/mo baseline,
     880/mo in December) but the SKU question the 8 August research left
     open is now resolved: this ASIN is the bare single unit, not the
     $71.99 activity set or the $270.99 classroom set. */
  "code-and-go-robot-mouse": {
    slug: "code-and-go-robot-mouse",
    categorySlug: "educational-coding-robots",
    eyebrow: "Coding robot review",
    title: "Code & Go Robot Mouse review",
    seoTitle: "Code & Go Robot Mouse Review — Coding With Cards, Ages 4+",
    metaDescription:
      "The Code & Go Robot Mouse is a $39.99 screen-free coding toy: a child places " +
      "direction cards to guide it to the cheese. What the bare unit includes.",
    verdict:
      "The youngest-rated coding toy in this category and the only card-based one: a child lays directional cards in a sequence and the mouse follows them, with no remote, no app and no screen. Cheaper and simpler than Botley, aimed at a child a couple of years younger.",
    bestFor:
      "A four to seven year old, and anyone who wants the cheapest honest way to find out whether screen-free sequencing holds a child's attention before spending more on a coding toy.",
    notIdealFor:
      "A child who already codes with Sphero's block or text editors — this is a step below that, by age and by design, not an upgrade path to it.",
    facts: [
      { label: "Ages", value: "4 and up (manufacturer rating)" },
      { label: "Coding method", value: "Physical direction cards, screen-free" },
      { label: "Included", value: "Robot mouse and card set, per the manufacturer's standard listing" },
      { label: "Price", value: "$39.99, per the retailer's own listing title — not yet read from the page itself" },
    ],
    specGroups: [
      {
        heading: "What it does",
        rows: [
          { label: "Coding", value: "Sequence of physical direction cards, read and followed by the mouse — no app or screen" },
          { label: "Objective", value: "Navigate a maze or grid to reach a wedge of cheese, per the manufacturer" },
        ],
      },
      {
        heading: "Ages",
        rows: [
          { label: "Manufacturer rating", value: "4 and up" },
        ],
      },
    ],
    skuNote:
      "IDENTITY NOT READ FROM THE LISTING ITSELF. ASIN B01B14XK00 found via web search — 'Learning Resources Code & Go® Robot Mouse, Screen-Free Coding Robot Toy, Early Programming for Kids Ages 4+' — because Amazon blocked every direct fetch attempted. $39.99 is the search snippet's own figure, dated 26 September 2026, not a page read; treat it as indicative until the automated refresh service confirms one. Learning Resources also sells a $71.99 Activity Set and a $270.99 Classroom Set under similar names; this ASIN is neither.",
    lastReviewed: "2026-09-26",
  },

  /* JOY FOR ALL, added 8 August 2026. This product was LIVE, PUBLISHED, CARRYING
     A WORKING BUY BUTTON and recommended as the top pick on the eldercare guide
     — with no review record at all. The page rendered from the catalogue
     fallback, which meant a robotic cat with a heading reading "Cleans" and no
     prose beneath it. Found by auditing image coverage, not by a test, because
     every test here checks that a review is correct rather than that one
     exists. */
  "joy-for-all-companion-pets": {
    slug: "joy-for-all-companion-pets",
    /* Wired 11 August 2026. The asset was already in the media registry —
       it filled the listing card — but this review carried no image field
       at all, so the page rendered with an empty space at the top. */
    image: {
      src: "/media/companion/joy-for-all/card.webp",
      alt:
        "The Joy For All companion cat in silver with white mitts, lying with its " +
        "paws forward, beside two inset photographs of older people holding one.",
    },
    categorySlug: "companion-robots",
    eyebrow: "Companion robot review",
    title: "Joy For All Companion Pet Cat review",
    seoTitle: "Joy For All Companion Pet Cat Review — Batteries, Not Wi-Fi",
    metaDescription:
      "The Joy For All Companion Pet cat: $159, four C batteries, no app and no " +
      "account. Why the least technological product here is the one most likely " +
      "to get used.",
    verdict:
      "The least technological thing on this site and the one most likely to be used every day by the person it was bought for. No app, no account, no dock — four C batteries and a purr you feel through the fur. Designed for one reader and honest about it.",
    bestFor:
      "An older person, especially one living with memory loss, and the relative buying from a distance who will not be there to fix anything.",
    notIdealFor:
      "Anyone who would find a pretend cat patronising — a real reaction worth asking about first — and anyone expecting conversation or a personality that develops.",
    video: {
      url: "https://youtu.be/TnO9hDWjUYM",
      title: "Joy for All Companion Pets Review (Tabby Cat): Therapeutic Pet for People Living With Dementia",
      channel: "Bambu Care",
      source: "independent",
      note:
        "Independent, and framed for the reader this product is actually sold to. It is a dementia-care review rather than a gadget review, which is the right lens — and it is somebody else's assessment, not ours, and not clinical evidence.",
    },
    facts: [
      { label: "Power", value: "4 x C batteries, included" },
      { label: "App", value: "None" },
      { label: "Weight", value: "1 kg" },
      { label: "Amazon rating", value: "4.5 from 12,307" },
    ],
    specGroups: [
      {
        heading: "What it does",
        rows: [
          { label: "Responds to", value: "Touch and movement" },
          { label: "Movement", value: "Head and paw" },
          { label: "Sound", value: "Meows, and a purr you feel rather than hear" },
          { label: "Learning", value: "None \u2014 it responds the same way every time, deliberately" },
        ],
      },
      {
        heading: "Physical",
        rows: [
          { label: "Dimensions", value: "15.24 x 9.02 x 10.12 in" },
          { label: "Weight", value: "1 kg" },
          { label: "Material", value: "Synthetic fur over plastic" },
          { label: "Batteries", value: "4 x 1.5V C alkaline, included" },
        ],
      },
      {
        heading: "What it does not have",
        rows: [
          { label: "App", value: "None" },
          { label: "Account or Wi-Fi", value: "None" },
          { label: "Subscription", value: "None, so nothing can be withdrawn later" },
          { label: "Charging dock", value: "None \u2014 batteries are the design decision" },
        ],
      },
    ],
    skuNote:
      "Read from the Amazon listing B017JQQ00Q on 8 August 2026, sold by Ageless Innovation LLC at $159. A VARIANT FAMILY: the cat is sold in several colourways and there is a dog as well, so Manufacturer Part Number 'B7594' and Included Components 'Silver Cat' are what pin this to the Silver with White Mitts.",
    lastReviewed: "2026-08-08",
  },


  /* THE THREE WINBOTS UNMERGED, 8 August 2026, at the owner's direction.

     They were folded into siblings on 7 August because the 5 August window
     research capped the category at three WINBOTs — "a category of one brand
     is a worse page for a reader and a worse hedge for us" — and eleven
     reviews had been built the next day ignoring it.

     WHAT THE MERGE MISSED. All three stayed published in D1 with live Amazon
     offers, so the 301s left three sellable products that no page could reach.
     A redirect is the right answer for a product that no longer exists; these
     exist, they are in stock, and they are on the best-of page's ranked list.
     The concentration argument still stands and is now a reason to keep
     writing about other brands, not a reason to hide three buy buttons. */
  "ecovacs-winbot-w3-omni": {
    slug: "ecovacs-winbot-w3-omni",
    categorySlug: "window-cleaning-robots",
    eyebrow: "Window robot review",
    title: "ECOVACS WINBOT W3 Omni review",
    seoTitle: "ECOVACS WINBOT W3 Omni Review — The Strongest Grip Here",
    metaDescription:
      "The WINBOT W3 Omni claims 10,000 Pa maximum and 3,300 Pa moving, on the " +
      "dearest window robot we hold. Who the extra suction is genuinely for.",
    verdict:
      "The strongest grip in this catalogue and the biggest tank, on the most expensive window robot we hold. Both are real and both are margin rather than a cleaner pane \u2014 which makes this a machine for genuinely large glass and nobody else.",
    bestFor:
      "Sliding doors, picture windows and walls of glass, in a household where the window that needs cleaning has no socket under it.",
    notIdealFor:
      "Windows the size most windows are. The W2 PRO Omni does the same job with the same station for less, and small panes need the Mini instead.",
    video: {
      url: "https://youtu.be/lQFuYnfe8Vw",
      title: "ECOVACS Winbot W3 Omni Window Robot - Full Review & Test",
      channel: "ModernDayReviews",
      source: "independent",
      note:
        "Independent, not ECOVACS'. It runs the machine and shows the station washing its own pads, which is the feature the price rests on. Check it is the W3 Omni you are watching and not the W2S Omni — the two look alike and are different machines.",
    },
    facts: [
      { label: "Max suction", value: "10,000 Pa" },
      { label: "Moving suction", value: "3,300 Pa \u00b1100" },
      { label: "Water tank", value: "80 ml \u00b15" },
      { label: "Navigation", value: "WIN-SLAM 5.0" },
    ],
    specGroups: [
      {
        heading: "Grip",
        rows: [
          { label: "Maximum suction", value: "10,000 Pa \u2014 nearly double the W2 line" },
          { label: "Moving suction", value: "3,300 Pa \u00b1100, the highest figure in this catalogue" },
          { label: "Why moving matters", value: "It is the number that decides whether a robot holds while it travels" },
          {
            label: "Power-off hold",
            value: "It does not need the mains at all — 130 min on its own battery",
            note: "The only machine here that answers the power-cut question by not depending on a socket. Its station is portable and it carries a two-in-one power and safety cable, three-layer composite, rated to 100 kg, plus a 1 m safety rope at the station base. Our catalogue filed it as CORDED until 10 August 2026, which meant it scored zero for readers who said there is no socket near the windows — the exact problem it is built to solve.",
          },
        ],
      },
      {
        heading: "Water and route",
        rows: [
          { label: "Tank", value: "80 ml \u00b15 \u2014 a third more than every other WINBOT" },
          { label: "Navigation", value: "WIN-SLAM 5.0, the newest generation ECOVACS ships" },
          { label: "Cleaning modes", value: "8" },
          { label: "Station", value: "Yes \u2014 the same proposition as the W2 PRO Omni" },
        ],
      },
      {
        heading: "What is missing",
        rows: [
          { label: "Weight", value: "Not published \u2014 alone in the range, and you lift this overhead" },
        ],
      },
    ],
    skuNote:
      "Amazon US B0GJDQ59J1 at $550. ECOVACS sells the W2 PRO Omni, the W3 Omni and the W2 PRO under names close enough to confuse; the station and the suction figures are what separate this one.",
    image: {
      src: "/media/products/ecovacs-winbot-w3-omni.webp",
      alt:
        "BotPlanet artwork for the ECOVACS WINBOT W3 Omni window cleaning robot, shown on a " +
        "floor-to-ceiling window at dusk with its station on the floor below.",
    },
    figures: [
      {
        afterHeading: "Who this is for",
        src: "/media/reviews/ecovacs-winbot-w3-omni/hero.webp",
        caption:
          "The station on the floor is what this shares with the W2 PRO Omni. Everything above it \u2014 the suction, the tank, the navigation generation \u2014 is what the extra $220 buys.",
      },
      {
        afterHeading: "Who should look elsewhere",
        src: "/media/reviews/ecovacs-winbot-w3-omni/model-comparison.webp",
        caption:
          "ECOVACS\u2019 own comparison, and the most useful thing in this artwork: 110 minutes of battery, a 90 m\u00b2 working area, a 30 \u00d7 40 cm minimum window and the \u00b190\u00b0 incline rating that puts it on skylights. Note the machine on the right is the W2S Omni, a station model we do not hold \u2014 not the stationless W2S reviewed elsewhere on this site.",
      },
      {
        afterHeading: "The tank is the underrated part",
        src: "/media/reviews/ecovacs-winbot-w3-omni/three-nozzle-spray.webp",
        caption:
          "Three nozzles across the pane ahead of the pads. The percentages here are ECOVACS\u2019 own and are measured against its cheapest model, the W1 PRO, rather than against any rival.",
      },
      {
        afterHeading: "WIN-SLAM 5.0, and what a navigation generation is worth",
        src: "/media/reviews/ecovacs-winbot-w3-omni/path-planning.webp",
        caption:
          "16 cm/s and 1 mm of obstacle detection, both ECOVACS\u2019 figures. Speed is what a newer navigation generation actually buys \u2014 a shorter cycle, not a cleaner pane.",
      },
      {
        afterHeading: "Twelve tiers, and the one number to actually read",
        src: "/media/reviews/ecovacs-winbot-w3-omni/twelve-tier.webp",
        caption:
          "A correction to the picture: the 8,000 Pa printed in tier one is not this machine\u2019s figure. ECOVACS rates the W3 Omni at 10,000 Pa maximum, and 8,000 is what its own comparison above gives the W2S Omni. The twelve tiers are right; the suction number in this panel is not.",
      },
    ],
    lastReviewed: "2026-08-08",
  },

  "ecovacs-winbot-w2s": {
    slug: "ecovacs-winbot-w2s",
    /* Wired 11 August 2026. The asset was already in the media registry —
       it filled the listing card — but this review carried no image field
       at all, so the page rendered with an empty space at the top. */
    image: {
      src: "/media/window/ecovacs-winbot-w2s/card.webp",
      alt:
        "A BotPlanet card for the ECOVACS WINBOT W2S: the window robot alone on " +
        "clear glass with no station in frame, with the model name and the " +
        "BotPlanet logo set into the image.",
    },
    categorySlug: "window-cleaning-robots",
    eyebrow: "Window robot review",
    title: "ECOVACS WINBOT W2S review",
    seoTitle:
      "WINBOT W2S Review — Edge Scrubbers, No Published Suction",
    metaDescription:
      "The WINBOT W2S has TruEdge scrubbers instead of six spray nozzles. Why the " +
      "edge is a real complaint, and why no published suction figure is a reason " +
      "to wait.",
    verdict:
      "One specific bet: that the border of the pane bothers you more than the middle. If it does, this is the only machine here built for that. If it does not, ECOVACS publishes less about this model than any other WINBOT and that is the reason to walk past it.",
    bestFor:
      "Somebody whose actual complaint is a rim of haze at the frame \u2014 the strip a cloth reaches last and a circular path reaches worst.",
    notIdealFor:
      "Anyone who wants to compare it properly, because you cannot. No published suction, tank, weight or dimensions, all of which the W2 PRO publishes at the same money.",
    facts: [
      { label: "Edges", value: "TruEdge scrubbers" },
      { label: "Max suction", value: "Not published" },
      { label: "Navigation", value: "WIN-SLAM 4.0" },
      { label: "Spray nozzles", value: "3" },
    ],
    specGroups: [
      {
        heading: "The trade it makes",
        rows: [
          { label: "Edge hardware", value: "TruEdge scrubbers \u2014 the reason to pick it over the W2 PRO" },
          { label: "Spray nozzles", value: "3, against the W2 PRO's 6" },
          { label: "Navigation", value: "WIN-SLAM 4.0, the same generation as the W2 PRO" },
          { label: "Independent testing", value: "None we could find, for TruEdge or against it" },
          { label: "Power-off hold", value: "30 minutes", note: "ECOVACS: maintains suction for 30 minutes if power is lost — the same figure as the W2 PRO." },
        ],
      },
      {
        heading: "What ECOVACS does not publish",
        rows: [
          { label: "Maximum suction", value: "Published for every other WINBOT, absent here" },
          { label: "Moving suction", value: "Absent" },
          { label: "Weight", value: "Absent" },
          { label: "Tank capacity", value: "Absent" },
        ],
      },
    ],
    skuNote:
      "Amazon US B0G5Y3NHTX at $330. The W2S and the W2 PRO are one character apart in the model name and the same price bracket; the scrubbers are the only visible difference.",
    lastReviewed: "2026-08-08",
  },

  "ecovacs-winbot-mini": {
    slug: "ecovacs-winbot-mini",
    /* Wired 11 August 2026. The asset was already in the media registry —
       it filled the listing card — but this review carried no image field
       at all, so the page rendered with an empty space at the top. */
    image: {
      src: "/media/window/ecovacs-winbot-mini/card.webp",
      alt:
        "A BotPlanet card for the ECOVACS WINBOT Mini: the small window robot " +
        "alone on a plain background, with the model name and the BotPlanet logo " +
        "set into the image.",
    },
    categorySlug: "window-cleaning-robots",
    eyebrow: "Window robot review",
    title: "ECOVACS WINBOT Mini review",
    seoTitle: "ECOVACS WINBOT Mini Review — Small Panes, Odd Suction Figure",
    metaDescription:
      "The WINBOT Mini claims 7,500 Pa, higher than machines costing three times " +
      "as much. What that number means, and why size is the real reason to buy.",
    verdict:
      "The machine for a window every other robot here is too big for, at the lowest price in the range. Its headline suction beats the flagships and that comparison is not what it looks like \u2014 buy it for the size, and take the grip as a bonus.",
    bestFor:
      "Small panes \u2014 glazing bars, a bathroom, a cottage casement \u2014 and a household with nowhere to store a robot between uses.",
    notIdealFor:
      "Large glass, where three cleaning modes and two-generations-old navigation are the real limitation rather than the suction figure.",
    facts: [
      { label: "Max suction", value: "7,500 Pa" },
      { label: "Size", value: "215 \u00d7 215 \u00d7 55 mm" },
      { label: "Power-off hold", value: "30 minutes", note: "ECOVACS states this across the WINBOT range; the same figure appears on every W-series record we hold and in the category research of 5 August 2026. Not re-read from the product page since." },
      { label: "Cleaning modes", value: "3" },
    ],
    specGroups: [
      {
        heading: "Size, which is the real argument",
        rows: [
          { label: "Dimensions", value: "215 \u00d7 215 \u00d7 55 mm, against 271 mm square for the W2 machines" },
          { label: "Fits", value: "Panes the rest of this catalogue cannot enter" },
          { label: "Storage", value: "Goes in a drawer" },
        ],
      },
      {
        heading: "The suction figure, in context",
        rows: [
          { label: "Maximum", value: "7,500 Pa \u2014 above the W2 PRO Omni's 5,500 and the W2 PRO's 5,300" },
          { label: "Moving", value: "Not published, and it is the figure that would settle the comparison" },
          { label: "Why it is not a ranking", value: "A smaller, lighter robot needs less force to hold the same glass" },
        ],
      },
      {
        heading: "Safety and route",
        rows: [
          {
            label: "Power-off hold",
            value: "30 minutes",
            /* THE MINI CARRIED TWO POWER-OFF ROWS and this was the second, its
               value ending "— the same figure ECOVACS prints for its
               flagships". Same number, different wording, one page. The
               comparison belongs in the prose; a spec table answering the same
               question twice is what the HOBOT 298 was fixed for. */
            note:
              "ECOVACS states this across the WINBOT range; the same figure appears on every W-series record we hold and in the category research of 5 August 2026. Not re-read from the product page since.",
          },
          { label: "Navigation", value: "WIN-SLAM 3.0, two generations behind the W2 machines" },
          { label: "Cleaning modes", value: "3, against 7 on the W2 PRO" },
        ],
      },
    ],
    skuNote:
      "Amazon US B0DR8W696Y at $150. The Mini is the only WINBOT small enough for divided panes, and its dimensions are what identify it rather than the name.",
    lastReviewed: "2026-08-08",
  },

  "grillbot": {
    slug: "grillbot",
    /* Artwork arrived 11 August 2026, and this is the only file in that drop
       with nothing written into it — no headline, no figure, no logo on the
       machine. So it is the only one typed as a depiction and left open to
       Product structured data. */
    image: {
      src: "/media/reviews/grillbot/hero.webp",
      alt:
        "The Grillbot on a hot grill grate: a squat red machine with three " +
        "circular wire brushes underneath, sitting on the bars of a lit gas " +
        "grill at dusk with steam rising around it.",
    },
    figures: [],
    categorySlug: "grill-cleaning-robots",
    eyebrow: "Grill-cleaning robot review",
    title: "Grillbot review",
    seoTitle: "Grillbot Review — What $130 of Not Scrubbing Buys",
    metaDescription:
      "Grillbot sits on the grates and scrubs while you do something else. What it " +
      "cleans, what Grillbot will not publish, and why a $15 brush kills the same risk.",
    verdict:
      "The only robotic grill cleaner with real US retail presence, and it does exactly one thing: it scrubs the grates on its own while you are not standing there. Three motors, three brush heads, an LCD timer and auto shut-off, hot grill or cold. It is maintenance between proper cleans rather than a substitute for one, and if wire bristles are your only worry a $15 bristle-free brush removes the same risk for a fraction of the money.",
    bestFor:
      "Somebody who grills often enough that scrubbing has become the reason they put it off, and would rather pay once than keep not doing it.",
    notIdealFor:
      "Anyone buying purely to avoid wire bristles — a bristle-free brush does that for about $15 — and anyone expecting a deep clean rather than upkeep between them.",
    facts: [
      { label: "Price", value: "$129.99, read 10 August 2026" },
      { label: "Brush heads", value: "Nylon, brass, stainless steel" },
      { label: "Runs on", value: "Hot or cold grills" },
      { label: "Warranty", value: "1 year" },
    ],
    specGroups: [
      {
        heading: "How it works",
        rows: [
          { label: "Operation", value: "Sits on the grates, one button, runs to a timer" },
          { label: "Motors", value: "Three" },
          { label: "Timer", value: "Built-in LCD timer with auto shut-off" },
          { label: "Grill temperature", value: "Hot or cold grills" },
          { label: "Steering", value: "Adjusts speed and direction as it runs" },
        ],
      },
      {
        heading: "Brushes",
        rows: [
          { label: "Heads supplied", value: "Three" },
          { label: "Nylon", value: "Softest and longest-lasting; Grillbot's default recommendation" },
          { label: "Brass", value: "For porcelain and stainless steel grates" },
          { label: "Stainless steel", value: "For cast iron and expanded steel grates" },
          { label: "Loose wire bristles", value: "None" },
          { label: "Dishwasher safe", value: "Yes" },
        ],
      },
      {
        heading: "Power and support",
        rows: [
          { label: "Power", value: "Cordless, rechargeable battery" },
          { label: "Runtime", value: null },
          { label: "Upgraded battery", value: "Up to 8 hours — sold separately, not the supplied cell" },
          { label: "Replacement battery", value: "$22.95 from Grillbot" },
          { label: "Replacement charger", value: "$12.95 from Grillbot" },
          { label: "Warranty", value: "1 year; 3-year extension sold separately at $26.95" },
        ],
      },
      {
        heading: "Not published",
        rows: [
          { label: "Cycle length", value: null },
          { label: "Weight", value: null },
          { label: "Dimensions", value: null },
          { label: "Grill size range", value: null },
        ],
      },
    ],
    skuNote:
      "Grillbot in red without a case, ASIN B00HFDFSAC, $129.99 read on 10 August 2026. Four ASINs share one review pool — red and black, each with and without a carry case — so a link that does not force a variant can land on the $139.99 bundle.",
    lastReviewed: "2026-08-10",
  },

  /* ============================================================
     ROBOT VACUUMS — the first eleven, 10 August 2026.

     NO ARTWORK YET for any of them. They ship unillustrated for
     the same reason Grillbot did: the category has 135,000/mo on
     its head term and no catalogue at all, and a page that answers
     the query beats a finished page that does not exist.

     THE SPEC LABELS ARE DELIBERATELY IDENTICAL ACROSS ALL ELEVEN.
     Every other category on this site follows whatever each maker
     publishes, which is right for a full table and useless for a
     grid — the glance projection then needs six aliases per slot to
     find the same fact. Eleven products landing at once was the
     chance to name the fields once, so "Mops", "Mop lifting",
     "Self-emptying", "Obstacle avoidance" and "Deep or shag pile"
     read the same on every page in the category and the glance
     projection needs no aliases at all.

     A null HERE IS A READING, NOT A JUDGEMENT. Where a maker's page
     could not be read — dreame twice, eufy's S1 Pro, both Sharks —
     the capability is null and the review says so in its own words.
     Under-claiming is recoverable by reading the page later;
     over-claiming is a bad recommendation shipped today.
     ============================================================ */

  "eufy-x10-pro-omni": {
    slug: "eufy-x10-pro-omni",
    image: {
      src: "/media/reviews/eufy-x10-pro-omni/hero.webp",
      alt:
        "A BotPlanet panel for the eufy X10 Pro Omni: the flat black robot parked " +
        "under its tall auto-empty dock on dark wood flooring, a child sitting with " +
        "a small dog on a rug behind. Four labels along the bottom read 8000 Pa, " +
        "smart vacuum plus mop 2-in-1, auto-empty dock up to 60 days, and iPath " +
        "laser navigation — eufy's own marketing wording, set into the artwork.",
    },
    figures: [
      {
        afterHeading: "What the 12 millimetres actually buys",
        src: "/media/reviews/eufy-x10-pro-omni/underside.webp",
        caption:
          "The two round pads at the back are what lift 12mm. They spin rather than " +
          "drag, which is the part that matters on a floor with dried-on marks — and " +
          "the part that has to clear the carpet when it rises.",
      },
    ],
    categorySlug: "robot-vacuums",
    eyebrow: "Robot vacuum review",
    title: "eufy X10 Pro Omni review",
    seoTitle: "eufy X10 Pro Omni Review — 12mm of Lift for $450",
    metaDescription:
      "The eufy X10 Pro Omni vacuums, mops, lifts the pads 12mm and empties " +
      "itself for $449.99. What the lift clears, and why 8,000 Pa is the wrong " +
      "comparison.",
    verdict:
      "The machine most people asking about robot vacuums should look at first. It vacuums, it mops, the pads lift 12mm onto carpet, it empties itself into the tower and it looks at the floor with a camera. At $449.99 with 39,206 ratings at 4.6 stars behind it, nothing else in the category offers that combination of capability, price and evidence.",
    bestFor:
      "Hard floor and ordinary carpet, one machine to do both, and no interest in emptying a bin.",
    notIdealFor:
      "Deep or shag pile throughout — 12mm does not clear it, and no machine at this price does.",
    facts: [
      { label: "Price", value: "$449.99, read 10 August 2026" },
      { label: "Rating", value: "4.6 from 39,206 ratings" },
      { label: "Mop lift", value: "12mm" },
      { label: "Dock", value: "Self-emptying, mop washing and drying" },
    ],
    specGroups: [
      {
        heading: "What it does",
        rows: [
          { label: "Mops", value: "Yes — dual spinning pads" },
          { label: "Mop lifting", value: "12mm auto-lift" },
          { label: "Self-emptying", value: "Yes, into the tower" },
          { label: "Obstacle avoidance", value: "AI obstacle avoidance" },
          { label: "Multi-floor mapping", value: "Yes" },
          { label: "Suction", value: "8,000 Pa" },
        ],
      },
      {
        heading: "Floors",
        rows: [
          { label: "Hard floors", value: "Yes" },
          { label: "Low-pile carpet", value: "Yes — carpet detection, pads lift" },
          { label: "Deep or shag pile", value: null },
        ],
      },
      {
        heading: "Not published",
        rows: [
          { label: "Runtime", value: null },
          { label: "Bin capacity", value: null },
          { label: "Water tank", value: null },
          { label: "Noise", value: null },
          { label: "Dimensions", value: null },
        ],
      },
    ],
    skuNote:
      "eufy X10 Pro Omni, ASIN B0CPFBBHP4, $449.99 read on 10 August 2026. B0DG5G9HQM is the same machine in white at the same price sharing one review pool, so any link needs th=1&psc=1.",
    lastReviewed: "2026-08-10",
  },

  "eufy-omni-s1-pro": {
    slug: "eufy-omni-s1-pro",
    image: {
      src: "/media/reviews/eufy-omni-s1-pro/hero.webp",
      alt:
        "A BotPlanet panel for the eufy Omni S1 Pro: the tall cylindrical UniClean " +
        "station standing on a wooden floor with the slim black robot in front of " +
        "it crossing a spilled-coffee stain. A feature list beside it reads " +
        "UniClean station, vacuum and mop, tackles tough stains and premium smart " +
        "cleaning — eufy's own marketing wording, set into the artwork.",
    },
    figures: [
      {
        afterHeading: "The roller mop, which is the good idea here",
        src: "/media/reviews/eufy-omni-s1-pro/stain-lift.webp",
        caption:
          "eufy's own claim, in eufy's own words: 48-hour dried coffee lifted, with a " +
          "comparison against unnamed “other robots”. The comparison is the maker's, " +
          "not a measurement of ours, and the small print on the artwork attributes " +
          "it to internal lab testing.",
      },
      {
        afterHeading: "eufy has moved on and says so",
        src: "/media/reviews/eufy-omni-s1-pro/slim-profile.webp",
        caption:
          "3.78 inches is eufy's figure for the robot's height, printed on its own " +
          "artwork. It is the number that decides whether the machine gets under your " +
          "sofa, and it is one of the few this listing does publish.",
      },
    ],
    categorySlug: "robot-vacuums",
    eyebrow: "Robot vacuum review",
    title: "eufy Omni S1 Pro review",
    seoTitle: "eufy S1 Pro Review — Read the Price Twice",
    metaDescription:
      "The eufy S1 Pro is the biggest search term in the category and the " +
      "lowest-rated machine we hold. No price in the search row, 3.2 stars, and a " +
      "range moved on.",
    verdict:
      "A self-washing roller mop on a machine the rest of eufy's range has overtaken. It is rated 3.2 from 776 ratings, the lowest of the eleven vacuums we catalogue by a distance, its Amazon search row carries no price at all, and at $919.58 it sits between a better-rated flagship and a cheaper machine using its own headline technology. The roller is a good idea. This is not the machine to buy it on.",
    bestFor:
      "Hard floors throughout, wanting a self-washing roller mop, having checked the seller and the price on the day.",
    notIdealFor:
      "Any house with carpet — no mop-lift or carpet claim appears anywhere on the listing — and anyone who would rather spend less for a higher-rated machine.",
    facts: [
      { label: "Price", value: "$919.58, read 10 August 2026" },
      { label: "Rating", value: "3.2 from 776 ratings" },
      { label: "In search", value: "No price shown" },
      { label: "Mop", value: "Self-washing roller" },
    ],
    specGroups: [
      {
        heading: "What it does",
        rows: [
          { label: "Mops", value: "Yes — self-washing roller" },
          { label: "Mop lifting", value: null },
          { label: "Self-emptying", value: "Yes, into the base" },
          { label: "Obstacle avoidance", value: "Stated on the listing, not detailed" },
          { label: "Multi-floor mapping", value: null },
          { label: "Suction", value: "8,000 Pa" },
        ],
      },
      {
        heading: "Floors",
        rows: [
          { label: "Hard floors", value: "Yes" },
          { label: "Low-pile carpet", value: null },
          { label: "Deep or shag pile", value: null },
        ],
      },
      {
        heading: "Not published",
        rows: [
          { label: "Runtime", value: null },
          { label: "Bin capacity", value: null },
          { label: "Water tank", value: null },
          { label: "Noise", value: null },
          { label: "Dimensions", value: null },
          { label: "What Eco-Clean Ozone does", value: null },
        ],
      },
    ],
    skuNote:
      "eufy Robot Vacuum Omni S1 Pro, ASIN B0CTY6VT8Y. The Amazon search row returns no price; the listing read on 10 August 2026 returns $919.58. eufy's own page returned 404 to a direct fetch the same day.",
    lastReviewed: "2026-08-10",
  },

  "roborock-s8-max-ultra": {
    slug: "roborock-s8-max-ultra",
    image: {
      src: "/media/reviews/roborock-s8-max-ultra/hero.webp",
      alt:
        "A BotPlanet panel for the roborock S8 Max Ultra: the white robot on a lit " +
        "plinth in front of its tall white dock, a phone showing a floor map beside " +
        "them. Labels read smart docking, app control, auto washing and drying, and " +
        "edge-to-edge cleaning.",
    },
    figures: [
      {
        afterHeading: "Twenty millimetres against twelve",
        src: "/media/reviews/roborock-s8-max-ultra/underside.webp",
        caption:
          "The riser is the mechanism behind the 20mm figure: the roller assembly " +
          "lifts the pad rather than the whole chassis. 8,000 Pa is roborock's " +
          "published suction for this machine, and it is the same number our " +
          "specification table carries.",
      },
      {
        afterHeading: "What the machine does",
        src: "/media/reviews/roborock-s8-max-ultra/dock.webp",
        caption:
          "Everything roborock lists the dock as doing, in one frame. What no " +
          "roborock page we could read states is how long the bag lasts in a house " +
          "with animals, as against the seven weeks it quotes.",
      },
    ],
    categorySlug: "robot-vacuums",
    eyebrow: "Robot vacuum review",
    /* THE H1 AND THE TITLE BOTH LEAD WITH "MaxV" AND THE PRODUCT IS NOT ONE.
       That is deliberate. The 9,900/mo term names a machine with no
       first-party Amazon US listing, and the reader typing it is best served
       by seeing their own words and then the answer — not by a heading for a
       product they did not search for. The verdict directly beneath names the
       S8 Max Ultra, the skuNote pins it, and the review opens on the
       substitution in its first sentence. */
    title: "roborock S8 MaxV Ultra: what Amazon actually sells",
    seoTitle: "roborock S8 MaxV Ultra — What Amazon Actually Sells",
    metaDescription:
      "The roborock S8 MaxV Ultra has no Amazon US listing — only accessory kits. " +
      "This is what roborock sells instead: 20mm of mop lift, structured light, " +
      "$949.99.",
    verdict:
      "Twenty millimetres of mop lift, the largest figure of the eleven vacuums we catalogue, with structured-light obstacle avoidance and a dock that empties mid-clean. It also carries the traffic for a term that names a different machine: the S8 MaxV Ultra has no first-party listing on Amazon US at all. At $949.99 the extra over a $449.99 eufy buys lift height, a better dock and better seeing.",
    bestFor:
      "Hard floor and rugs, where getting the wet pads properly out of the way is the deciding factor.",
    notIdealFor:
      "Deep or shag pile — roborock makes no high-pile claim for this machine — and anyone whose house is mostly hard floor and would not notice the extra $500.",
    facts: [
      { label: "Price", value: "$949.99, read 10 August 2026" },
      { label: "Rating", value: "4.5 from 1,227 ratings" },
      { label: "Mop lift", value: "20mm" },
      { label: "Dock interval", value: "Up to 7 weeks" },
    ],
    specGroups: [
      {
        heading: "What it does",
        rows: [
          { label: "Mops", value: "Yes — dual pads, FlexiArm side reach" },
          { label: "Mop lifting", value: "20mm auto-lift" },
          { label: "Self-emptying", value: "Yes, during and after a clean" },
          { label: "Obstacle avoidance", value: "Reactive 3D, structured light" },
          { label: "Multi-floor mapping", value: "Yes" },
          { label: "Suction", value: "8,000 Pa" },
        ],
      },
      {
        heading: "Floors",
        rows: [
          { label: "Hard floors", value: "Yes" },
          { label: "Low-pile carpet", value: "Yes — Carpet Boost+, pads lift 20mm" },
          { label: "Deep or shag pile", value: null },
        ],
      },
      {
        heading: "Not published",
        rows: [
          { label: "Runtime", value: null },
          { label: "Bin capacity", value: null },
          { label: "Water tank", value: null },
          { label: "Noise", value: null },
          { label: "Dimensions", value: null },
        ],
      },
    ],
    skuNote:
      "roborock S8 Max Ultra with Refill & Drainage System, ASIN B0D9B9LK9F, $949.99 read on 10 August 2026. This is NOT the S8 MaxV Ultra, which has no first-party Amazon US listing — every result carrying that string is a third-party accessory kit.",
    lastReviewed: "2026-08-10",
  },

  "roborock-saros-10": {
    slug: "roborock-saros-10",
    image: {
      src: "/media/reviews/roborock-saros-10/hero.webp",
      alt:
        "A BotPlanet panel for the roborock Saros 10: the black robot on a lit " +
        "plinth in front of its tall dark dock, ringed by six labelled thumbnails " +
        "reading app control, low-profile cleaning, smart navigation, edge " +
        "cleaning, auto-dock support and powerful cleaning.",
    },
    figures: [
      {
        afterHeading: "The 3.14 inches, which is the other real argument",
        src: "/media/reviews/roborock-saros-10/suction.webp",
        caption:
          "22,000 Pa is roborock's published figure and the one our table carries. It " +
          "is also, as the review argues above, not the number that decides anything " +
          "at this end of the market — the 3.14 inches is.",
      },
      {
        afterHeading: "Navigation",
        src: "/media/reviews/roborock-saros-10/brushes.webp",
        caption:
          "Navigation gets the machine to the hair; the brush decides what happens " +
          "next. roborock's zero-tangle claim is its own and unquantified — no " +
          "percentage, no hair length, no test named.",
      },
    ],
    categorySlug: "robot-vacuums",
    eyebrow: "Robot vacuum review",
    title: "roborock Saros 10 review",
    seoTitle: "roborock Saros 10 Review — The Only Deep-Pile Answer",
    metaDescription:
      "The roborock Saros 10 is the one machine we hold whose maker claims high " +
      "pile: the chassis lifts 10mm and the mop detaches. $1,299.99, and few need " +
      "it.",
    verdict:
      "The only robot vacuum in our catalogue whose manufacturer says anything about deep pile. The chassis lifts 10mm on high-pile carpet and the mop detaches entirely in vacuum-only modes, which is different engineering from raising a pad. At $1,299.99 it is the most expensive machine here by $350, and for a house of hard floor and ordinary carpet it does nothing a $449.99 machine does not.",
    bestFor:
      "Deep or shag pile carpet, or low furniture a taller robot cannot get under at 3.14 inches.",
    notIdealFor:
      "Hard floor and ordinary carpet, where a machine at a third of the price does the same work.",
    facts: [
      { label: "Price", value: "$1,299.99, read 10 August 2026" },
      { label: "Rating", value: "4.5 from 4,428 ratings" },
      { label: "Height", value: "3.14 inches" },
      { label: "High pile", value: "Chassis lifts 10mm" },
    ],
    specGroups: [
      {
        heading: "What it does",
        rows: [
          { label: "Mops", value: "Yes — hot water washing at the dock" },
          { label: "Mop lifting", value: "Detaches entirely in vacuum-only modes" },
          { label: "Self-emptying", value: "Yes, RockDock Ultra with bags" },
          { label: "Obstacle avoidance", value: "ReactiveAI 3.0 — structured light, RGB camera, VertiBeam" },
          { label: "Multi-floor mapping", value: "Yes" },
          { label: "Suction", value: "22,000 Pa" },
        ],
      },
      {
        heading: "Floors",
        rows: [
          { label: "Hard floors", value: "Yes" },
          { label: "Low-pile carpet", value: "Yes" },
          { label: "Deep or shag pile", value: "Yes — chassis elevates up to 0.39 in (10mm)" },
        ],
      },
      {
        heading: "Not published",
        rows: [
          { label: "Runtime", value: null },
          { label: "Bin capacity", value: null },
          { label: "Water tank", value: null },
          { label: "Noise", value: null },
          { label: "Weight", value: null },
        ],
      },
    ],
    skuNote:
      "roborock Saros 10, ASIN B0DLH247PS, $1,299.99 read on 10 August 2026. A second listing for the same model, B0DLH45139, carries no price and 94 ratings; it is not the one pinned.",
    lastReviewed: "2026-08-10",
  },

  "roborock-qrevo-s5v": {
    slug: "roborock-qrevo-s5v",
    image: undefined,
    figures: [],
    categorySlug: "robot-vacuums",
    eyebrow: "Robot vacuum review",
    title: "roborock Qrevo S5V review",
    seoTitle: "roborock Qrevo S5V Review — Which Qrevo You Get",
    metaDescription:
      "roborock Qrevo is four machines from $499.98 to $879.99. The S5V is the " +
      "cheapest: 10mm mop lift, FlexiArm edge reach, and two ASINs you have to " +
      "pin.",
    verdict:
      "The cheapest entry to roborock's Qrevo line, with the FlexiArm edge reach that is the range's real argument and 10mm of mop lift. Fifty dollars more than the eufy X10 Pro Omni for the same four capabilities, a better edge reach and a review pool a twentieth the size. The trap is the name: Qrevo covers four machines across a $380 spread.",
    bestFor:
      "Hard floor and ordinary carpet, where the strip of dust along the skirting board is the complaint.",
    notIdealFor:
      "Deep or shag pile, and anyone who would rather have 39,206 ratings behind their purchase than 1,625.",
    facts: [
      { label: "Price", value: "$499.98, read 10 August 2026" },
      { label: "Rating", value: "4.3 from 1,625 ratings" },
      { label: "Mop lift", value: "10mm" },
      { label: "Family", value: "Four Qrevo machines, $499.98 to $879.99" },
    ],
    specGroups: [
      {
        heading: "What it does",
        rows: [
          { label: "Mops", value: "Yes — FlexiArm edge mopping" },
          { label: "Mop lifting", value: "10mm mop lifting" },
          { label: "Self-emptying", value: "Yes, with mop washing and drying" },
          { label: "Obstacle avoidance", value: "Smart obstacle avoidance" },
          { label: "Multi-floor mapping", value: null },
          { label: "Suction", value: "12,000 Pa" },
        ],
      },
      {
        heading: "Floors",
        rows: [
          { label: "Hard floors", value: "Yes" },
          { label: "Low-pile carpet", value: "Yes — pads lift 10mm" },
          { label: "Deep or shag pile", value: null },
        ],
      },
      {
        heading: "Not published",
        rows: [
          { label: "Runtime", value: null },
          { label: "Bin capacity", value: null },
          { label: "Water tank", value: null },
          { label: "Noise", value: null },
          { label: "Dimensions", value: null },
        ],
      },
    ],
    skuNote:
      "roborock Qrevo S5V, ASIN B0DSP8J476, $499.98 read on 10 August 2026. B0FX4SZ4KB is the same machine at the same price sharing one review pool, so any link needs th=1&psc=1 — and the family it sits in spans $380.",
    lastReviewed: "2026-08-10",
  },

  "dreame-x40-ultra": {
    slug: "dreame-x40-ultra",
    image: {
      src: "/media/reviews/dreame-x40-ultra/hero.webp",
      alt:
        "A BotPlanet panel for the Dreame X40 Ultra: the black robot beside its " +
        "tall dock on a dark floor with a phone showing the Dreame app. The " +
        "headline reads 12,000 Pa cleaning power, with labels for dual spinning " +
        "mops, a smart dock system and app control.",
    },
    figures: [
      {
        afterHeading: "What the extending brush and the washboard are for",
        src: "/media/reviews/dreame-x40-ultra/washboard.webp",
        caption:
          "The ridged plate is the whole idea: the pads are scrubbed against a " +
          "surface rather than rinsed in standing water. Dreame does not publish a " +
          "wash temperature for this model.",
      },
      {
        afterHeading: "The gap in this page, stated first",
        src: "/media/reviews/dreame-x40-ultra/avoidance.webp",
        caption:
          "This panel asserts obstacle avoidance. The Amazon listing we built this " +
          "page from does not claim it, and Dreame's own pages would not load, so our " +
          "catalogue records this machine as having none. The headline is the " +
          "artwork's; the ruling above is ours, and it is the one the matcher uses.",
      },
    ],
    categorySlug: "robot-vacuums",
    eyebrow: "Robot vacuum review",
    title: "Dreame X40 Ultra review",
    seoTitle: "Dreame X40 Ultra Review — A Gap We Could Not Close",
    metaDescription:
      "The Dreame X40 Ultra has a liftable mop, an extending side brush and a " +
      "self-refilling dock for $599.99. And no obstacle-avoidance claim we could " +
      "read.",
    verdict:
      "A full sheet for six hundred dollars — a mop that lifts and detaches, a side brush that extends into corners, a washboard that scrubs the pads at 158°F, and a dock that empties the bin and refills the tank. What is missing is any obstacle-avoidance claim on the only page we could read, and dreame's own pages returned 404 to every URL we tried, so our record shows none.",
    bestFor:
      "A clear floor, hard surfaces and ordinary carpet, and a specific irritation about corners or dirty mop pads.",
    notIdealFor:
      "A cluttered floor. Until dreame's own page can be read, no obstacle avoidance is recorded and this is not the machine to buy on that basis.",
    facts: [
      { label: "Price", value: "$599.99, read 10 August 2026" },
      { label: "Rating", value: "4.4 from 901 ratings" },
      { label: "Mop", value: "Removable and liftable" },
      { label: "Dock", value: "Auto-empty and auto-refill" },
    ],
    specGroups: [
      {
        heading: "What it does",
        rows: [
          { label: "Mops", value: "Yes — removable and liftable" },
          { label: "Mop lifting", value: "Liftable mop and liftable brushes" },
          { label: "Self-emptying", value: "Yes, with auto water refill" },
          { label: "Obstacle avoidance", value: null },
          { label: "Multi-floor mapping", value: null },
          { label: "Suction", value: "12,000 Pa" },
        ],
      },
      {
        heading: "Floors",
        rows: [
          { label: "Hard floors", value: "Yes" },
          { label: "Low-pile carpet", value: "Yes — mop lifts and detaches" },
          { label: "Deep or shag pile", value: null },
        ],
      },
      {
        heading: "Not published",
        rows: [
          { label: "Runtime", value: null },
          { label: "Bin capacity", value: null },
          { label: "Water tank", value: null },
          { label: "Noise", value: null },
          { label: "Dimensions", value: null },
        ],
      },
    ],
    skuNote:
      "Dreame X40 Ultra, ASIN B0CXDXKSXP, $599.99 read on 10 August 2026. B0DZHNSL1H is a second listing at $594.99 with a separate review pool of 101; we did not establish what separates them. Dreame's own product pages returned 404 or truncated content to a direct fetch.",
    lastReviewed: "2026-08-10",
  },

  "dreame-x50-ultra": {
    slug: "dreame-x50-ultra",
    image: {
      src: "/media/reviews/dreame-x50-ultra/hero.webp",
      alt:
        "A BotPlanet panel headed “reach into tight corners” for the Dreame X50 " +
        "Ultra, showing the machine from a low angle with its roller brush and two " +
        "round mop pads visible as it works into a corner. Labels read edge " +
        "cleaning, under-furniture reach and corner precision.",
    },
    figures: [
      {
        afterHeading: "Obstacle crossing is not mop lifting",
        src: "/media/reviews/dreame-x50-ultra/mop-washing.webp",
        caption:
          "Washing the pads is not the same as lifting them, and this machine's " +
          "listing documents the first and not the second. A clean pad dragged across " +
          "carpet is still a wet pad dragged across carpet.",
      },
      {
        afterHeading: "What the six centimetres is genuinely for",
        src: "/media/reviews/dreame-x50-ultra/brushes.webp",
        caption:
          "The brush claim carries no figure — no hair length, no percentage, no " +
          "test. It is the maker's wording, and we record it as a design description " +
          "rather than a specification.",
      },
    ],
    categorySlug: "robot-vacuums",
    eyebrow: "Robot vacuum review",
    title: "Dreame X50 Ultra review",
    seoTitle: "Dreame X50 Ultra Review — It Climbs, But Does It Lift?",
    metaDescription:
      "The Dreame X50 Ultra claims 6cm of obstacle crossing, the only claim like " +
      "it we catalogue. Crossing is not mop lifting, and we record only what we " +
      "read.",
    verdict:
      "The only machine we catalogue claiming to climb a 6cm step, which makes it the answer for a house with a raised threshold the robot has to get over. It claims obstacle avoidance and 20,000 Pa. It does not claim mop lifting anywhere we could read — obstacle crossing is step climbing and not the same thing — so our record shows none, and at $999.99 that is a gap worth closing before you buy.",
    bestFor:
      "A level change the robot must cross, on mostly hard floor, with dreame's dock and detangling brush.",
    notIdealFor:
      "Carpet, where no lift figure is published — the roborock S8 Max Ultra is $50 less and publishes 20mm.",
    facts: [
      { label: "Price", value: "$999.99, read 10 August 2026" },
      { label: "Rating", value: "4.5 from 815 ratings" },
      { label: "Obstacle crossing", value: "2.36 in (6cm)" },
      { label: "Suction", value: "20,000 Pa" },
    ],
    specGroups: [
      {
        heading: "What it does",
        rows: [
          { label: "Mops", value: "Yes — mop self-cleaning at the dock" },
          { label: "Mop lifting", value: null },
          { label: "Self-emptying", value: "Yes, auto-empty base" },
          { label: "Obstacle avoidance", value: "Obstacle avoidance and 360° navigation" },
          { label: "Multi-floor mapping", value: null },
          { label: "Step climbing", value: "2.36 in (6cm)" },
        ],
      },
      {
        heading: "Floors",
        rows: [
          { label: "Hard floors", value: "Yes" },
          { label: "Low-pile carpet", value: "Yes — detangling brush, carpet crossing" },
          { label: "Deep or shag pile", value: null },
        ],
      },
      {
        heading: "Not published",
        rows: [
          { label: "Runtime", value: null },
          { label: "Bin capacity", value: null },
          { label: "Water tank", value: null },
          { label: "Noise", value: null },
          { label: "Dimensions", value: null },
        ],
      },
    ],
    skuNote:
      "Dreame X50 Ultra, ASIN B0DM5J52GC, $999.99 read on 10 August 2026. B0F3J51GW5 and B0F3HZFZBL at $989.99 are the Complete bundle and were not pinned. Dreame's own product page returned 404 to a direct fetch.",
    lastReviewed: "2026-08-10",
  },

  "ecovacs-deebot-t90-pro-omni": {
    slug: "ecovacs-deebot-t90-pro-omni",
    image: {
      src: "/media/reviews/ecovacs-deebot-t90-pro-omni/hero.webp",
      alt:
        "A BotPlanet panel for the ECOVACS DEEBOT T90 PRO Omni: the black robot in " +
        "front of its dock on a dark floor beside a phone and two bottles of " +
        "cleaning solution. The headline reads nonstop power, with labels for quick " +
        "top-up charging, built for big homes and app-ready control.",
    },
    figures: [
      {
        afterHeading: "\"ECOVACS DEEBOT\" is four machines, not one",
        src: "/media/reviews/ecovacs-deebot-t90-pro-omni/thresholds.webp",
        caption:
          "0.59 inches is ECOVACS's own threshold figure for this model — the T90 PRO " +
          "Omni specifically, not the three other machines sold under the DEEBOT T90 " +
          "name. The comparison against “others” is the maker's and names nobody.",
      },
      {
        afterHeading: "The suction number, and why it is the wrong number",
        src: "/media/reviews/ecovacs-deebot-t90-pro-omni/suction-noise.webp",
        caption:
          "All five figures are ECOVACS's, and the three percentages are measured " +
          "against ECOVACS's own T90 rather than against anything else on this page. " +
          "30,000 Pa is the number the listing leads with; the section above is about " +
          "why it is not the number to buy on.",
      },
      {
        afterHeading: "Fifteen millimetres and a roller",
        src: "/media/reviews/ecovacs-deebot-t90-pro-omni/lift.webp",
        caption:
          "The 15mm in the heading above is our figure for the mop lift; ECOVACS " +
          "prints 0.59 inches here, which is the same measurement rounded to " +
          "imperial. The three separate lifts are the part worth noticing — brushes " +
          "and mop rise independently.",
      },
    ],
    categorySlug: "robot-vacuums",
    eyebrow: "Robot vacuum review",
    title: "ECOVACS DEEBOT T90 PRO Omni review",
    /* The primary term is the FAMILY name "ecovacs deebot", so the title has
       to carry the brand as well as the model — a DEEBOT title without ECOVACS
       on it does not serve the search that brings people here. */
    seoTitle: "ECOVACS DEEBOT T90 PRO Omni Review — 15mm of Lift",
    metaDescription:
      "The ECOVACS DEEBOT T90 PRO Omni has a self-cleaning mop roller, lifts 15mm " +
      "on carpet and docks for 90 days. And 30,000 Pa, the number not to buy it " +
      "for.",
    verdict:
      "A self-cleaning mop roller that stays wet with clean water for a whole run, lifting 15mm onto carpet, with AIVI 3D obstacle recognition and a dock ECOVACS rates at ninety days. The 30,000 Pa on the front of the box is close to meaningless; the roller, the lift and the dock interval are what six hundred dollars actually buys, and the capability record here is one of the fullest we hold.",
    bestFor:
      "A large hard floor with ordinary carpet, where a mop that stops being clean halfway round is the complaint.",
    notIdealFor:
      "Deep or shag pile, and anyone who would rather save $150 and take the eufy X10 Pro Omni for the same four capabilities.",
    facts: [
      { label: "Price", value: "$599.00, read 10 August 2026" },
      { label: "Rating", value: "4.4 from 395 ratings" },
      { label: "Mop lift", value: "15mm" },
      { label: "Dock interval", value: "Up to 90 days" },
    ],
    specGroups: [
      {
        heading: "What it does",
        rows: [
          { label: "Mops", value: "Yes — TruEdge self-cleaning OZMO roller" },
          { label: "Mop lifting", value: "15mm automatic lift on carpet" },
          { label: "Self-emptying", value: "Yes, up to 90 days" },
          { label: "Obstacle avoidance", value: "AIVI 3D 4.0 with structured light" },
          { label: "Multi-floor mapping", value: "Yes" },
          { label: "Suction", value: "30,000 Pa" },
        ],
      },
      {
        heading: "Floors",
        rows: [
          { label: "Hard floors", value: "Yes" },
          { label: "Low-pile carpet", value: "Yes — Triple Lift Carpet Care" },
          { label: "Deep or shag pile", value: null },
        ],
      },
      {
        heading: "Not published",
        rows: [
          { label: "Runtime", value: null },
          { label: "Bin capacity", value: null },
          { label: "Water tank", value: null },
          { label: "Noise", value: null },
          { label: "Dimensions", value: null },
          { label: "What YIKO does offline", value: null },
        ],
      },
    ],
    skuNote:
      "ECOVACS DEEBOT T90 PRO Omni, ASIN B0GJ5S4V78, $599.00 read on 10 August 2026. The DEEBOT name covers four current machines from $349 to $1,499.99; this is the one Amazon returns first for the family term.",
    lastReviewed: "2026-08-10",
  },

  "shark-powerdetect-av2820s": {
    slug: "shark-powerdetect-av2820s",
    image: {
      src: "/media/reviews/shark-powerdetect-av2820s/hero.webp",
      alt:
        "A BotPlanet panel for the Shark PowerDetect AV2820S: the black robot in " +
        "front of its bagless tower on a dark floor with scattered debris around it " +
        "and a phone showing the DirtDetect screen. Three panels beneath read Dirt " +
        "Detect, Edge Detect and Floor Detect, each quoting Shark's own " +
        "up-to-50-per-cent improvement footnoted against the Shark RV900S and " +
        "RV2600. A strip along the bottom adds up to 120 minutes of runtime.",
    },
    figures: [
      {
        afterHeading: "What \"PowerDetect\" is doing",
        src: "/media/reviews/shark-powerdetect-av2820s/pet-hair.webp",
        caption:
          "The self-cleaning brushroll and the anti-hair wrap are the two design " +
          "claims Shark makes for a house with animals. Neither carries a figure on " +
          "any page we read.",
      },
      {
        afterHeading: "Not mopping is a feature for some houses",
        src: "/media/reviews/shark-powerdetect-av2820s/self-empty.webp",
        caption:
          "Bagless, so there is nothing to re-order — and 30 days is Shark's own " +
          "figure for how often you empty it. A machine that does not mop has no " +
          "water tank to fill either, which is the point of the section above.",
      },
      {
        afterHeading: "The fifty-dollar word",
        src: "/media/reviews/shark-powerdetect-av2820s/neverstuck.webp",
        caption:
          "NeverStuck is the second of the two names in the fifty-dollar gap. It is a " +
          "mechanism — the machine raises itself rather than reversing out — and it " +
          "is the one of the pair that is easy to picture.",
      },
    ],
    categorySlug: "robot-vacuums",
    eyebrow: "Robot vacuum review",
    title: "Shark PowerDetect AV2820S review",
    seoTitle: "Shark PowerDetect AV2820S Review — It Does Not Mop",
    metaDescription:
      "The Shark PowerDetect self-empty vacuum, not the vacuum-and-mop sharing " +
      "its name fifty dollars away. 3D object detection, a 30-day HEPA base, no " +
      "water tank.",
    verdict:
      "A vacuum, and only a vacuum. The near-identically named PowerDetect NeverTouch Pro fifty dollars away is the one that mops, and nothing on either listing will stop you buying the wrong one. What this machine has is 3D object detection — the capability that separates driving round a charging cable from eating it — plus four kinds of floor sensing and a base rated at thirty days.",
    bestFor:
      "Carpet through most of the house, wanting vacuuming done properly and no mop to manage.",
    notIdealFor:
      "Hard floors where you wanted mopping — the eufy X10 Pro Omni mops and costs $100 less.",
    facts: [
      { label: "Price", value: "$549.99, read 10 August 2026" },
      { label: "Rating", value: "4.4 from 3,648 ratings" },
      { label: "Mops", value: "No — vacuum only" },
      { label: "Base", value: "30-day HEPA self-empty" },
    ],
    specGroups: [
      {
        heading: "What it does",
        rows: [
          { label: "Mops", value: "No — vacuum only" },
          { label: "Mop lifting", value: null },
          { label: "Self-emptying", value: "Yes, 30-day HEPA base" },
          { label: "Obstacle avoidance", value: "360° LiDAR plus 3D object detection" },
          { label: "Multi-floor mapping", value: "Yes" },
          { label: "Suction", value: null },
        ],
      },
      {
        heading: "Floors",
        rows: [
          { label: "Hard floors", value: "Yes — FloorDetect" },
          { label: "Low-pile carpet", value: "Yes — FloorDetect, DirtDetect" },
          { label: "Deep or shag pile", value: null },
        ],
      },
      {
        heading: "Not published",
        rows: [
          { label: "Runtime", value: null },
          { label: "Bin capacity", value: null },
          { label: "Noise", value: null },
          { label: "Dimensions", value: null },
          { label: "Weight", value: null },
        ],
      },
    ],
    skuNote:
      "Shark PowerDetect Self-Empty Robot Vacuum AV2820S, ASIN B0CDJFHM4J, $549.99 read on 10 August 2026. The RV2820ZE at $599.99 is the vacuum AND mop; the RV3020XE at $849.99 is the UV Reveal. Shark's own product page redirected to a corporate landing page.",
    lastReviewed: "2026-08-10",
  },

  "shark-matrix-plus-ur2650ws": {
    slug: "shark-matrix-plus-ur2650ws",
    image: {
      src: "/media/reviews/shark-matrix-plus-ur2650ws/hero.webp",
      alt:
        "A BotPlanet panel for the Shark Matrix Plus UR2650WS: the black robot in " +
        "front of its dock with a green tile above reading vac plus mop, described " +
        "as a 2-in-1 robot vacuum and sonic mopping system. Two panels beneath read " +
        "sonic mopping, scrubs hard floors up to 100 times per minute, and better " +
        "edge cleaning using blasts of air.",
    },
    figures: [
      {
        afterHeading: "What $280 costs you",
        src: "/media/reviews/shark-matrix-plus-ur2650ws/mapping.webp",
        caption:
          "LiDAR at this price is the thing that is not obvious from the number on " +
          "the box, and it is the reason this machine maps rather than bounces.",
      },
      {
        afterHeading: "Sonic mopping and the self-cleaning brushroll",
        src: "/media/reviews/shark-matrix-plus-ur2650ws/filtration.webp",
        caption:
          "99.97 per cent is Shark's figure, and unusually for this category it names " +
          "the test it comes from. That is more than most of the machines on this " +
          "site can say.",
      },
      {
        afterHeading: "Who this is genuinely right for",
        src: "/media/reviews/shark-matrix-plus-ur2650ws/pets.webp",
        caption:
          "The self-cleaning brushroll is the claim that matters in a house that " +
          "sheds, and it is one of the few things this machine has in common with " +
          "Shark's much dearer models.",
      },
    ],
    categorySlug: "robot-vacuums",
    eyebrow: "Robot vacuum review",
    /* "Shark Matrix" names two Shark lines and the primary term is the family
       phrase, so the heading carries the family and then pins the SKU. A title
       reading only "Matrix Plus UR2650WS" answers a model code nobody types. */
    title: "Shark Matrix robot vacuum review: the Matrix Plus UR2650WS",
    seoTitle: "Shark Matrix Robot Vacuum — Which of the Two You Get",
    metaDescription:
      "The Shark Matrix robot vacuum is the cheapest here with a self-emptying " +
      "base, and $280 costs you two things: no mop lift, and LiDAR that maps " +
      "rather than sees.",
    verdict:
      "Thirty-five thousand nine hundred and seventeen ratings at 4.6 stars for $279.99, which no other machine in this catalogue comes near on either figure. Two things are missing and they are the two the dearer machines sell: the mop pad attaches by hand and never lifts, and 360° LiDAR maps the room without recognising anything in it. On a clear floor, neither may cost you anything.",
    bestFor:
      "A clear floor and a modest budget, with a self-cleaning brushroll for hair and a base you empty monthly.",
    notIdealFor:
      "A cluttered floor — LiDAR maps, it does not see — and a carpeted house where nobody will remember to take the pad off.",
    facts: [
      { label: "Price", value: "$279.99, read 10 August 2026" },
      { label: "Rating", value: "4.6 from 35,917 ratings" },
      { label: "Mop", value: "Sonic, pad fitted by hand" },
      { label: "Base", value: "30-day HEPA self-empty" },
    ],
    specGroups: [
      {
        heading: "What it does",
        rows: [
          { label: "Mops", value: "Yes — sonic mopping, pad fitted by hand" },
          { label: "Mop lifting", value: null },
          { label: "Self-emptying", value: "Yes, 30-day HEPA base" },
          { label: "Obstacle avoidance", value: null },
          { label: "Multi-floor mapping", value: "Yes — 360° LiDAR mapping" },
          { label: "Suction", value: null },
        ],
      },
      {
        heading: "Floors",
        rows: [
          { label: "Hard floors", value: "Yes" },
          { label: "Low-pile carpet", value: "Yes — self-cleaning brushroll" },
          { label: "Deep or shag pile", value: null },
        ],
      },
      {
        heading: "Not published",
        rows: [
          { label: "Runtime", value: null },
          { label: "Bin capacity", value: null },
          { label: "Water tank", value: null },
          { label: "Noise", value: null },
          { label: "Dimensions", value: null },
        ],
      },
    ],
    skuNote:
      "Shark Matrix Plus Robot Vacuum and Mop UR2650WS, ASIN B0FDX7GFQX, $279.99 read on 10 August 2026. The AI Ultra AV2501S and AV2511AE at about $420 also carry the Matrix name and are a different line. Shark's own product page redirected to a corporate landing page.",
    lastReviewed: "2026-08-10",
  },

  "roomba-max-705": {
    slug: "roomba-max-705",
    image: {
      src: "/media/reviews/roomba-max-705/hero.webp",
      alt:
        "A BotPlanet panel for the iRobot Roomba Max 705: the black robot on dark " +
        "wood in front of its AutoEmpty dock, a phone showing the Roomba app beside " +
        "it and scattered popcorn on the floor in front. Six labelled panels down " +
        "the side read 75 days auto-emptying, extreme power with 180 times more " +
        "suction, anti-tangle dual rubber brushes, four suction levels plus carpet " +
        "boost, PrecisionVision AI with ClearView Pro LiDAR, and targeted cleaning.",
    },
    figures: [
      {
        afterHeading: "What this one has",
        src: "/media/reviews/roomba-max-705/precisionvision.webp",
        caption:
          "Object recognition rather than bump-and-turn: the machine is meant to name " +
          "what is in front of it and decide. A cable is the classic case, and the " +
          "one owners of every brand complain about.",
      },
      {
        afterHeading: "The name iRobot did not use",
        src: "/media/reviews/roomba-max-705/lidar.webp",
        caption:
          "iRobot names the navigation and not the suction. That is a choice about " +
          "which number it wants read, and on a machine with rubber anti-tangle " +
          "brushes it is arguably the right one.",
      },
      {
        afterHeading: "Who should buy one",
        src: "/media/reviews/roomba-max-705/edge.webp",
        caption:
          "A round robot cannot reach into a square corner, which is why every maker " +
          "in this category prints an edge-cleaning panel. This one is a side brush " +
          "doing what side brushes do.",
      },
    ],
    categorySlug: "robot-vacuums",
    eyebrow: "Robot vacuum review",
    title: "iRobot Roomba Max 705 review",
    seoTitle: "Roomba Max 705 Review — Two Machines, One Name",
    metaDescription:
      "Two machines are called Roomba Max 705. The $499 vacuum is rated 4.3 " +
      "against the $799 Combo's 3.6, and it does not mop. One extra word " +
      "separates them.",
    verdict:
      "Rubber anti-tangle brushes, LiDAR navigation, anti-fall detection and a dock that empties itself, for $499. It does not mop, and the machine that does — the Roomba Max 705 Combo, one word and three hundred dollars away — is rated 3.6 against this one's 4.3 by a review pool six times the size. The brushes are the reason to choose this over a Shark at the same money.",
    bestFor:
      "A shedding animal, hard floor and carpet, and no interest in a robot that mops.",
    notIdealFor:
      "Anyone who wanted mopping — the eufy X10 Pro Omni is cheaper than both Roombas and lifts its pads onto carpet.",
    facts: [
      { label: "Price", value: "$499.00, read 10 August 2026" },
      { label: "Rating", value: "4.3 from 741 ratings" },
      { label: "Mops", value: "No — vacuum only" },
      { label: "Brushes", value: "Dual rubber, anti-tangle" },
    ],
    specGroups: [
      {
        heading: "What it does",
        rows: [
          { label: "Mops", value: "No — vacuum only" },
          { label: "Mop lifting", value: null },
          { label: "Self-emptying", value: "Yes, AutoEmpty Dock" },
          { label: "Obstacle avoidance", value: "Obstacle and anti-fall detection, LiDAR navigation" },
          { label: "Multi-floor mapping", value: "Yes" },
          { label: "Suction", value: null },
        ],
      },
      {
        heading: "Floors",
        rows: [
          { label: "Hard floors", value: "Yes" },
          { label: "Low-pile carpet", value: "Yes — dual rubber anti-tangle brushes" },
          { label: "Deep or shag pile", value: null },
        ],
      },
      {
        heading: "Not published",
        rows: [
          { label: "Suction figure", value: null },
          { label: "Runtime", value: null },
          { label: "Bin capacity", value: null },
          { label: "Noise", value: null },
          { label: "Dimensions", value: null },
        ],
      },
    ],
    skuNote:
      "iRobot Roomba Max 705 Robot Vacuum with AutoEmpty Dock, ASIN B0DWG3C3ZF, $499.00 read on 10 August 2026. B0DWG15XKQ at $799 is the Max 705 COMBO — a different machine with a mop and an AutoWash dock, rated 3.6 from 4,800 ratings.",
    lastReviewed: "2026-08-10",
  },

  /* ============================================================
     SELF-CLEANING LITTER BOXES — the first four, 10 August 2026.

     THE CATEGORY HAD FOUR PUBLISHED PRODUCTS AND NO PAGES since
     8 August, while `litter robot 4` alone is 74,000/mo — the
     largest single review term on the site. No artwork yet; they
     ship unillustrated for the same reason Grillbot and the
     vacuums did.

     CAT WEIGHT LEADS EVERY TABLE because it is the only genuine
     safety question in the category. A kitten under the sensor's
     threshold does not register, and a cycle starting with a
     kitten inside is what the threshold exists to prevent. The
     four ranges are 3–25, 3.3–22, 1–20 and not published, and
     reading them side by side is most of the value of these
     pages.

     ENTRY SIZE IS SECOND AND TWO MAKERS DO NOT PUBLISH IT. It is
     the specification that decides whether a cat walks in or
     refuses, the failure mode of this category is a cat using the
     rug instead, and the absence is recorded rather than filled.

     Every figure here was read from the maker's own page on 10
     August 2026 — the record with quotes and sources is
     docs/commerce/litter-box-attributes.md. Ratings are from each
     ASIN's own Amazon listing the same day.
     ============================================================ */

  "litter-robot-4": {
    slug: "litter-robot-4",
    /* Wired 11 August 2026. The asset was already in the media registry —
       it filled the listing card — but this field was never pointed at it,
       so the review itself rendered with an empty space at the top. */
    image: {
      src: "/media/litter/litter-robot-4/card.webp",
      alt:
        "A BotPlanet card for the Litter-Robot 4: the tall black globe-and-base " +
        "unit in a dark utility room with a tabby cat standing beside it, with " +
        "the model name and the BotPlanet logo set into the image.",
    },
    figures: [],
    categorySlug: "self-cleaning-litter-boxes",
    eyebrow: "Self-cleaning litter box review",
    title: "Litter-Robot 4 review",
    seoTitle: "Litter-Robot 4 Review — The Entry Size Nobody Compares",
    metaDescription:
      "The Litter-Robot 4 takes cats 3 to 25 lb through the widest door in the " +
      "category. What $699 buys, and which part of the health tracking is paid " +
      "for.",
    verdict:
      "The biggest opening in the category, at 15.75 inches square, and the widest stated cat weight range at 3 to 25 lb. It takes ordinary clumping clay from any shop, which is the running-cost difference that matters against the sealed-tray systems. What the pitch does not make obvious is that the health tracking shows seven days free and gates two years of history behind Whisker+ — the tracking is real, the long view is the paid product.",
    bestFor:
      "A large cat, ordinary clumping clay, and $699 — the widest door here and the widest weight range.",
    notIdealFor:
      "A kitten under 3 lb, which the weight sensor cannot detect, and anyone committed to walnut, paper or any non-clumping litter.",
    facts: [
      { label: "Price", value: "$699, read 8 August 2026" },
      { label: "Rating", value: "4.4 from 156 ratings" },
      { label: "Cat weight", value: "3–25 lb" },
      { label: "Entry size", value: "15.75 × 15.75 in" },
    ],
    specGroups: [
      {
        heading: "Your cat",
        rows: [
          { label: "Cat weight", value: "3–25 lb" },
          { label: "Entry size", value: "15.75 × 15.75 in" },
          { label: "Interior height", value: "Globe 16.5 in" },
          { label: "Kittens", value: "No — 3 lb is the stated minimum" },
        ],
      },
      {
        heading: "Running it",
        rows: [
          { label: "Litter", value: "Standard clumping clay, any shop" },
          { label: "Litter not compatible", value: "Plant-based and non-clumping" },
          { label: "Waste interval", value: "As low as once every 8 days, depending on cats" },
          { label: "Waste drawer volume", value: null },
        ],
      },
      {
        heading: "App and support",
        rows: [
          { label: "App", value: "Whisker app — not required to run the box" },
          { label: "Free history", value: "7 days of visits and individual cat weights" },
          { label: "Paid history", value: "Up to 2 years with a Whisker+ subscription" },
          { label: "Warranty", value: "1 year; 3 years for $100" },
        ],
      },
      {
        heading: "Not published",
        rows: [
          { label: "Noise", value: null },
          { label: "Cycle time", value: null },
          { label: "Unit weight", value: null },
        ],
      },
    ],
    skuNote:
      "Litter-Robot 4 with Step & Fence by Whisker, ASIN B0BH6MD3DJ, $699 read on 8 August 2026, rating read 10 August. The bundles outrank the bare unit in Amazon's own results — a $749 supply bundle above it and a $799 accessory bundle beside it. Specifications read from litter-robot.com on 10 August 2026.",
    lastReviewed: "2026-08-10",
  },

  "petkit-purobot-max-pro-2": {
    slug: "petkit-purobot-max-pro-2",
    /* Wired 11 August 2026. The asset was already in the media registry —
       it filled the listing card — but this field was never pointed at it,
       so the review itself rendered with an empty space at the top. */
    image: {
      src: "/media/litter/petkit-purobot-max-pro-2/card.webp",
      alt:
        "A BotPlanet card for the PETKIT Purobot Max Pro 2: the drum unit with " +
        "its wide opening facing the camera, with the model name and the " +
        "BotPlanet logo set into the image.",
    },
    figures: [],
    categorySlug: "self-cleaning-litter-boxes",
    eyebrow: "Self-cleaning litter box review",
    title: "PETKIT Purobot Max Pro 2 review",
    seoTitle: "PETKIT Purobot Max Pro 2 Review — It Knows Which Cat",
    metaDescription:
      "The PETKIT Purobot Max Pro 2 does facial recognition for up to 15 cats and " +
      "urine pH from the clump, $509.99. And a door five inches narrower than its " +
      "rival.",
    verdict:
      "The only litter box here that knows which cat just used it — 210-degree camera, facial recognition for up to fifteen animals, individual health profiles and clump analysis for urine pH. In a two-cat house that is the difference between a smeared visit log and an early warning that actually arrives. The catch is the door: 10.51 inches wide against the Litter-Robot's 15.75, on a machine called Max.",
    bestFor:
      "Two or more similar-sized cats, where knowing which animal is off is the whole point.",
    notIdealFor:
      "A big cat — the 22 lb ceiling is close to the Litter-Robot's 25, but the entrance is five inches narrower — and any kitten under 3.3 lb.",
    facts: [
      { label: "Price", value: "$509.99, read 8 August 2026" },
      { label: "Rating", value: "4.0 from 45 ratings" },
      { label: "Cat weight", value: "3.3–22 lb" },
      { label: "Recognises", value: "Up to 15 cats by face and weight" },
    ],
    specGroups: [
      {
        heading: "Your cat",
        rows: [
          { label: "Cat weight", value: "3.3–22 lb" },
          { label: "Entry size", value: "10.51 × 10.74 in, 10.03 in high" },
          { label: "Interior", value: "76 L cylinder" },
          { label: "Kittens", value: "No — 3.3 lb is the stated minimum" },
        ],
      },
      {
        heading: "Running it",
        rows: [
          { label: "Litter", value: "99% of clumping litters — clay, tofu or mixed" },
          { label: "Litter particle limit", value: "Under 12 mm long and 3 mm across" },
          { label: "Sifters supplied", value: "Two — one for tofu and mixed, one for bentonite and clay" },
          { label: "Waste interval", value: "17 days" },
          { label: "Waste drawer volume", value: "8 L" },
        ],
      },
      {
        heading: "What the camera does",
        rows: [
          { label: "Recognition", value: "Up to 15 cats by face and weight, with individual health profiles" },
          { label: "Camera", value: "210° wide angle" },
          { label: "Health tracking", value: "Urine pH from clump analysis, soft-stool instances, yowling detection" },
          { label: "App", value: "5G Wi-Fi — live monitoring works with no subscription" },
          { label: "Free playback", value: "30 days of video" },
          { label: "Paid playback", value: "Extended recording needs PETKIT Care+, monthly" },
        ],
      },
      {
        heading: "Safety and support",
        rows: [
          { label: "Safety sensors", value: "12, plus proximity detection" },
          { label: "Anti-pinch", value: "Patented design keeps the entrance open at all times" },
          { label: "Warranty", value: "2 years" },
          { label: "Unit weight", value: "24.25 lb" },
          { label: "Model", value: "P9904" },
        ],
      },
      {
        heading: "Not published",
        rows: [
          { label: "Noise", value: null },
          { label: "Cycle time", value: null },
        ],
      },
    ],
    skuNote:
      "PETKIT Purobot Max Pro 2, ASIN B0DM83CLW3, $509.99 read on 8 August 2026, rating read 10 August. The brief that named this product called it the Purobot Max Pro, which is the previous generation; a Purobot Max 3 also sells at $399.99 and is a different tier rather than this machine's successor. Specifications read from petkit.com on 10 August 2026.",
    lastReviewed: "2026-08-10",
  },

  "casa-leo-loo-too": {
    slug: "casa-leo-loo-too",
    /* Wired 11 August 2026. The asset was already in the media registry —
       it filled the listing card — but this field was never pointed at it,
       so the review itself rendered with an empty space at the top. */
    image: {
      src: "/media/litter/casa-leo-loo-too/card.webp",
      alt:
        "A BotPlanet card for the Casa Leo Leo’s Loo Too: the domed unit on a " +
        "plain floor, with the model name and the BotPlanet logo set into the " +
        "image.",
    },
    figures: [],
    categorySlug: "self-cleaning-litter-boxes",
    eyebrow: "Self-cleaning litter box review",
    title: "Casa Leo Leo's Loo Too review",
    seoTitle: "Casa Leo Leo's Loo Too Review — The Only Kitten Box",
    metaDescription:
      "Leo's Loo Too works with cats as light as 1 lb, where every rival gives up " +
      "around three. Also the lowest ceiling here at 20 lb — and we had that " +
      "wrong.",
    verdict:
      "The only automatic litter box in our catalogue that detects a cat under three pounds — Casa Leo states it works with cats as light as 1 lb, where Whisker's minimum is 3 and PETKIT's is 3.3. That makes it the answer for a kitten and nothing else is. It is also the lowest ceiling of the four at 20 lb, and the only one that does not publish its entry size, which is the figure that decides whether a big cat uses it.",
    bestFor:
      "A kitten or a small adult cat, on clay-clumping litter, with the largest waste drawer here at 9.5 L.",
    notIdealFor:
      "A cat heading past 20 lb — Casa Leo's own stated ceiling — and anyone who will not use 100% clay-clumping litter, which voids the warranty and the trial.",
    facts: [
      { label: "Price", value: "$599, read 8 August 2026" },
      { label: "Rating", value: "4.0 from 411 ratings" },
      { label: "Cat weight", value: "1–20 lb" },
      { label: "Waste drawer volume", value: "9.5 L" },
    ],
    specGroups: [
      {
        heading: "Your cat",
        rows: [
          { label: "Cat weight", value: "1–20 lb" },
          {
            label: "Kittens",
            value: "Yes — the only box here that detects under 3 lb",
            note: "Casa Leo's words: our system works with cats as light as 1 lb.",
          },
          {
            label: "Large cats",
            value: "No — 20 lb is the stated ceiling",
            note: "Our catalogue marked this box large-cat suitable until 10 August 2026. Corrected against Casa Leo's own figure.",
          },
          { label: "Entry size", value: null },
        ],
      },
      {
        heading: "Running it",
        rows: [
          { label: "Litter", value: "100% clay-clumping only, any brand" },
          {
            label: "Litter not compatible",
            value: "Anything else",
            note: "Casa Leo states other litters void the warranty and the 90-day trial.",
          },
          { label: "Waste drawer volume", value: "9.5 L" },
          { label: "Waste interval", value: null },
          { label: "Noise", value: "About 30 dB" },
        ],
      },
      {
        heading: "App and support",
        rows: [
          { label: "App", value: "Wi-Fi app and voice control, with weight tracking per visit" },
          { label: "Odour control", value: "UV" },
          { label: "Subscription", value: null },
          { label: "Warranty", value: "1 year; 3-year extension sold separately" },
        ],
      },
      {
        heading: "Not published",
        rows: [
          { label: "Interior diameter", value: null },
          { label: "Overall dimensions", value: null },
          { label: "Cycle time", value: null },
        ],
      },
    ],
    skuNote:
      "Casa Leo, Leo's Loo Too, ASIN B09LL9S99B, $599 read on 8 August 2026, rating read 10 August. Specifications read from casaleopet.com on 10 August 2026 — casaleo.com timed out entirely.",
    lastReviewed: "2026-08-10",
  },

  "petsafe-scoopfree-crystal-pro": {
    slug: "petsafe-scoopfree-crystal-pro",
    /* Wired 11 August 2026. The asset was already in the media registry —
       it filled the listing card — but this field was never pointed at it,
       so the review itself rendered with an empty space at the top. */
    image: {
      src: "/media/litter/petsafe-scoopfree-crystal-pro/card.webp",
      alt:
        "A BotPlanet card for the PetSafe ScoopFree Crystal Pro: the white " +
        "flat-tray unit with a hooded cover and a cat standing on the tray, with " +
        "the model name and the BotPlanet logo set into the image.",
    },
    figures: [],
    categorySlug: "self-cleaning-litter-boxes",
    eyebrow: "Self-cleaning litter box review",
    title: "PetSafe ScoopFree Crystal Pro review",
    seoTitle: "PetSafe ScoopFree Crystal Pro Review — 3.1 Stars",
    metaDescription:
      "The PetSafe ScoopFree Crystal Pro is a third the price of the boxes beside " +
      "it and rated a full star below all three. Plus a tray you are tied to.",
    verdict:
      "Thirty days untouched is the longest interval of the four boxes here and a real advantage, and $229.99 is a third of what the others cost. Two things go with that: it works only with PetSafe's own crystal trays for the life of the machine, and it is rated 3.1 stars from 184 ratings against 4.4, 4.0 and 4.0 for the rest. A comparison site that prints the price and omits the score is not doing the job.",
    bestFor:
      "Somebody whose real goal is a month of not thinking about it, who is content to buy one brand's trays.",
    notIdealFor:
      "Anyone who wants ordinary litter from any shop, or a per-cat health history — there is no app and no Wi-Fi at all.",
    facts: [
      { label: "Price", value: "$229.99, read 8 August 2026" },
      { label: "Rating", value: "3.1 from 184 ratings" },
      { label: "Waste interval", value: "Up to 30 days" },
      { label: "Litter", value: "PetSafe crystal trays only" },
    ],
    specGroups: [
      {
        heading: "Your cat",
        rows: [
          { label: "Cat weight", value: null, note: "PetSafe publishes a limit for the Crystal CLASSIC, a different and cheaper machine. That figure is not carried across." },
          { label: "Entry size", value: null },
          { label: "Dimensions", value: "28.2 × 20.4 × 16 in" },
        ],
      },
      {
        heading: "Running it",
        rows: [
          {
            label: "Litter",
            value: "PetSafe crystal trays only",
            note: "PetSafe's words: only compatible with official PetSafe ScoopFree Disposable Crystal Litter Trays or Reusable Litter Trays.",
          },
          { label: "Waste interval", value: "Up to 30 days" },
          { label: "How it works", value: "A rake sweeps a flat tray — no rotating globe or drum" },
          { label: "Crystal litter", value: "Dehydrates solid waste, 99% dust free, does not stick to paws" },
          { label: "Tray price", value: null },
        ],
      },
      {
        heading: "What it tracks",
        rows: [
          { label: "App", value: "None — no Wi-Fi" },
          { label: "Health tracking", value: "A digital display counter of visits on the unit" },
          { label: "Alerts", value: "LED indicators, including a light when the tray needs replacing" },
        ],
      },
      {
        heading: "Not published",
        rows: [
          { label: "Warranty", value: null },
          { label: "Noise", value: null },
          { label: "Cycle time", value: null },
        ],
      },
    ],
    skuNote:
      "PetSafe ScoopFree Crystal Pro, ASIN B0DR3JP2FZ, $229.99 read on 8 August 2026, rating read 10 August. ScoopFree Crystal is a family of four live SKUs: this Crystal Pro at $229.99, a Crystal Pro LEGACY front-entry at $229.95 — five cents apart and a previous generation — a Legacy uncovered at $142.49 and a Crystal Classic at $99. Specifications read from petsafe.com on 10 August 2026.",
    lastReviewed: "2026-08-10",
  },

  /* ============================================================
     ROBOTIC LAWN MOWERS — the first seven, 10 August 2026.

     RATED AREA LEADS EVERY TABLE because it is the only hard
     rule-out in the category: the lawn config EXCLUDES a machine
     rated for less ground than the reader has rather than ranking
     it lower, which is the right treatment for a mower that
     cannot finish. It is also the field the catalogue had wrong —
     the eufy E15 was recorded at 10,890 sq ft, a quarter acre
     rounded rather than converted, against eufy's own 800 m² which
     is 8,611. The correction is in migration 0015 and it is the
     first thing the E15's own review says.

     SLOPE IS THE NUMBER THE CAPABILITY FLAG HIDES. Three of the
     seven carry `grass_slopes` and behind that single yes sit
     45%, 80% and 80%; the four without it are at 30%, 30% and 18
     degrees. Every review prints the figure, because "handles
     slopes" covering both 45% and 80% is a shared word doing the
     work of a measurement.

     NAVIGATION IS THE THIRD AXIS AND IT IS BINARY IN PRACTICE.
     All seven are wire-free. Three find themselves by satellite
     and are defeated by a mature canopy with no setting that
     fixes it; four navigate by camera or LiDAR and are not. The
     `open_sky` / `tree_cover` environment pair already carries
     that as a rule-out — these rows say which system each machine
     actually uses, which is the first thing a buyer under trees
     asks.

     Every figure read from the maker's own pages on 10 August
     2026. Identity was verified 8 August; the record including
     the two products the brief named wrongly is
     docs/seo/litter-lawn-verification-2026-08-08.md.
     ============================================================ */

  "husqvarna-automower-410iq": {
    slug: "husqvarna-automower-410iq",
    image: {
      src: "/media/reviews/husqvarna-automower-410iq/hero.webp",
      alt:
        "A BotPlanet panel naming the Husqvarna Automower 410iQ, showing the low " +
        "dark grey mower on a lawn at night with lit borders behind it.",
    },
    figures: [
      {
        afterHeading: "EPOS, and why the boundary is the interesting part",
        src: "/media/reviews/husqvarna-automower-410iq/wire-free.webp",
        caption:
          "No boundary wire is the headline; a satellite reference station is the " +
          "mechanism. The section above is about what that trade actually costs you " +
          "when the signal is poor.",
      },
      {
        afterHeading: "The numbers Husqvarna publishes that nobody else does",
        src: "/media/reviews/husqvarna-automower-410iq/durability.webp",
        caption:
          "Husqvarna is the maker in this set that publishes the numbers behind a " +
          "claim like this one. Working in rain is not a specification; the ingress " +
          "rating and the slope figure in the section above are.",
      },
      {
        afterHeading: "What the two area figures actually tell you",
        src: "/media/reviews/husqvarna-automower-410iq/cut-quality.webp",
        caption:
          "The stripes are artwork rather than evidence — a mulching robot that cuts " +
          "a little every day does not leave them. What it does leave is grass that " +
          "never gets long enough to notice.",
      },
    ],
    categorySlug: "robotic-lawn-mowers",
    eyebrow: "Robotic lawn mower review",
    title: "Husqvarna Automower 410iQ review",
    seoTitle: "Husqvarna Automower 410iQ Review — Two Area Figures",
    metaDescription:
      "The Husqvarna Automower 410iQ is the only mower here with two rated areas: " +
      "half an acre if your lawn is a sensible shape, a quarter if it is not.",
    verdict:
      "The only mower in this catalogue whose maker publishes two working-area figures — half an acre systematically, a quarter acre in irregular patterns — which is the most honest line on any lawn spec sheet we read. It is also the only one that can fall back to a physical boundary wire when satellites disappoint, and the only one with a four-year warranty. At $2,499.99 it is dear, and 45% is half the slope the all-wheel-drive machines manage.",
    bestFor:
      "An awkwardly shaped half acre, where a virtual boundary might not hold and a physical one is the fallback.",
    notIdealFor:
      "A steep bank — 45% inside the area and 15% at the boundary, against 80% for the AWD machines — and any budget the WORX at $1,022.54 would satisfy.",
    facts: [
      { label: "Price", value: "$2,499.99, read 8 August 2026" },
      { label: "Rated area", value: "0.5 acre systematically, 0.25 acre in irregular patterns, ±20%" },
      { label: "Max slope", value: "45% inside the area, 15% at the boundary" },
      { label: "Warranty", value: "4 years" },
    ],
    specGroups: [
      {
        heading: "Your lawn",
        rows: [
          {
            label: "Rated area",
            value: "0.5 acre systematically, 0.25 acre in irregular patterns, ±20%",
            note: "The only maker of the seven to publish two figures for two lawn shapes.",
          },
          { label: "Max slope", value: "45% inside the area, 15% at the boundary" },
          { label: "Navigation", value: "EPOS — multiple satellites plus the national cellular network, centimetre accurate" },
          { label: "Boundary", value: "Physical wire or virtual — the only machine here offering both" },
        ],
      },
      {
        heading: "Cutting",
        rows: [
          { label: "Cutting width", value: "9.4 in" },
          { label: "Blades", value: "3 pivoting razor blades" },
          { label: "Cutting height", value: "1–4 in, electric adjustment" },
        ],
      },
      {
        heading: "Running it",
        rows: [
          { label: "Battery", value: "5 Ah Li-Ion" },
          { label: "Typical mowing time", value: "84 min per charge" },
          { label: "Charge time", value: "108 min" },
          { label: "Noise", value: "62 dB(A)" },
          { label: "Obstacles", value: "Onboard radar, plus lift and tilt sensors" },
          { label: "Warranty", value: "4 years" },
        ],
      },
      {
        heading: "Not published",
        rows: [
          { label: "IP rating", value: null },
          { label: "Weight", value: null },
          { label: "Separate zones", value: null },
        ],
      },
    ],
    skuNote:
      "Husqvarna Automower 410 iQ, ASIN B0DTV7TR6W, $2,499.99 read on 8 August 2026. Two prices were in circulation — $1,550 in a round-up and $2,499.99 on Amazon — and the Amazon figure is the one read directly. The 420iQ at $3,144.37 is the larger sibling. Specifications read from husqvarna.com on 10 August 2026.",
    lastReviewed: "2026-08-10",
  },

  "mammotion-luba-3-awd-1500h": {
    slug: "mammotion-luba-3-awd-1500h",
    image: {
      src: "/media/reviews/mammotion-luba-3-awd-1500h/hero.webp",
      alt:
        "A BotPlanet panel naming the Mammotion LUBA 3 AWD, showing the white and " +
        "orange four-wheel-drive mower on a lawn at night with a blue guide line " +
        "drawn across the grass and a lit house behind.",
    },
    figures: [
      {
        afterHeading: "What the 3000H adds beyond the acreage",
        src: "/media/lawn/mammotion-luba-3-awd-3000h/card.webp",
        caption:
          "The 3000H, which had its own page until 11 August 2026 and now shares " +
          "this one. Same chassis, same slope, twice the ground.",
      },
      {
        afterHeading: "What eighty per cent actually means",
        src: "/media/reviews/mammotion-luba-3-awd-1500h/cutting-decks.webp",
        caption:
          "Two cutting discs rather than one, and four driven wheels around them. On " +
          "a bank the wheels are what stops the machine, and the discs are what it " +
          "can still do once stopped. Both sizes are built this way.",
      },
      {
        afterHeading: "Navigation, and the reason this is not the cheap way to climb",
        src: "/media/reviews/mammotion-luba-3-awd-1500h/navigation.webp",
        caption:
          "The positioning kit is the expensive part of this machine, not the blades. " +
          "That is the trade the section above is about.",
      },
      {
        afterHeading: "Who should not buy this",
        src: "/media/reviews/mammotion-luba-3-awd-1500h/obstacles.webp",
        caption:
          "A garden with children, animals and things left out is the case this " +
          "machine is built for, and it is also the case where an obstacle miss costs " +
          "the most.",
      },
    ],
    categorySlug: "robotic-lawn-mowers",
    eyebrow: "Robotic lawn mower review",
    /* ONE ARTICLE, TWO MACHINES, from 11 August 2026.

       The 1500H and the 3000H were two pages saying the same thing. They share
       a chassis, a slope figure, a battery, a runtime and a cutting range, and
       they differed on this site by one number — so the two pages competed for
       the same 2,600/mo of head terms ("mammotion luba 3", "luba 3 awd") while
       each carried a SKU term worth 30 and 40. That is cannibalisation with no
       upside: neither page could win a term the other was also chasing.

       The 3000H's URL now 301s here (see MERGED_REVIEWS in product-names.ts)
       and this page sells both — its own buy box for the 1500H, and the strip
       built from `alsoCovers` for the 3000H. Nothing became unbuyable. */
    title: "Mammotion LUBA 3 AWD review: 1500H and 3000H",
    seoTitle: "Mammotion LUBA 3 AWD Review — 1500H vs 3000H, 80% Slopes",
    metaDescription:
      "Both Mammotion LUBA 3 AWD sizes in one place: 80% slopes on all four " +
      "wheels, LiDAR rather than satellites, and the sum that decides 1500H " +
      "against 3000H.",
    verdict:
      "Eighty per cent slopes on all-wheel drive, roughly double what most of this category manages, with 360-degree LiDAR and AI vision rather than satellite positioning alone — the pairing that matters, because steep gardens are often wooded gardens. Two sizes: the 1500H covers 0.37 acre for $2,399 and the 3000H covers 0.75 for $2,799. The ground is not what you are paying for, and on a flat lawn either one is dead weight you are financing.",
    bestFor:
      "A genuine bank under 16,117 sq ft, especially with tree cover that would defeat a satellite-positioned machine.",
    notIdealFor:
      "A flat lawn, where the WORX covers half an acre for $1,022.54 — and anything over 0.75 acre, which is past the larger of these two.",
    facts: [
      { label: "Price", value: "$2,399 (1500H) / $2,799 (3000H), read 8 August 2026" },
      { label: "Rated area", value: "0.37 acre (1500H) / 0.75 acre (3000H)" },
      { label: "Max slope", value: "80% (38.6°), all-wheel drive" },
      { label: "Runtime", value: "215 min on up to 15 Ah" },
    ],
    specGroups: [
      {
        heading: "Your lawn",
        rows: [
          { label: "Rated area", value: "1500H — 0.37 acre (16,117 sq ft); 3000H — 0.75 acre (32,670 sq ft)" },
          { label: "Max slope", value: "80% (38.6°), all-wheel drive — both sizes" },
          {
            label: "Navigation",
            value: "1500H — 360° LiDAR plus dual-camera AI vision; 3000H — the same plus network RTK",
            note: "Published in Mammotion's listing titles rather than in its specification tables. RTK adds accuracy on open ground and is the part that stops working under a canopy, which is why the 1500H is not the lesser machine on a wooded slope.",
          },
          { label: "Mowing rate", value: "1500H — 4,300 sq ft/h; 3000H — 5,400 sq ft/h" },
          { label: "Multi-zone management", value: "1500H — 15 zones; 3000H — 30 zones" },
          { label: "Drive", value: "All-wheel, both sizes" },
        ],
      },
      {
        heading: "Cutting",
        rows: [
          {
            label: "Cutting height",
            value: "Standard 1.0–2.7 in; High version 2.2–4.0 in",
            note: "The H is a cutting height, not a trim level. Warm-season grasses are cut at three inches and up, above the standard version's ceiling.",
          },
          { label: "Cutting width", value: null },
        ],
      },
      {
        heading: "Running it",
        rows: [
          { label: "Battery", value: "Up to 15 Ah, both sizes" },
          { label: "Runtime", value: "215 min per charge, both sizes" },
        ],
      },
      {
        heading: "Not published",
        rows: [
          { label: "Noise", value: null },
          { label: "IP rating", value: null },
          { label: "Weight", value: null },
          { label: "Warranty", value: null },
          { label: "Noise under load on a slope", value: null },
        ],
      },
    ],
    /* THE SECOND MACHINE, WITH ITS OWN TRACKED BUY PATH. The 3000H kept its
       product record, its D1 row, its destination and its /go/ key when the two
       pages merged — only the page went. This is what puts it back in front of
       a reader, on the one page that now covers both. */
    alsoCovers: {
      name: "Mammotion LUBA 3 AWD 3000H",
      retailerName: "Amazon",
      redirectKey: "lawn-mammotion-luba3-3000h-amazon",
      line:
        "Over 16,117 sq ft of grass? That is past the 1500H and into the 3000H — " +
        "0.75 acre, $400 more, same eighty per cent climb.",
    },
    skuNote:
      "Two SKUs, both the high-cut version. Mammotion LUBA 3 AWD 1500H, ASIN B0GKNYZPC3, $2,399; Mammotion LUBA 3 AWD 3000H, ASIN B0GKNQKJJQ, $2,799. Both read on 8 August 2026, both listing titles giving a 2.2–4.0 in cutting range. The garage bundles B0GKM8JZDF and B0H1R9RJ3F sell the 3000H at $3,008 and are not what this page links to — same machine, different purchase. The brief named a LUBA 2, and Mammotion's own US page for that machine is titled “2025 Model | Upgraded to 2026 LUBA 3” — so most of the internet's LUBA reviews are of a model its maker has marked superseded. The 15.7 in cutting width in circulation belongs to the LUBA 2 series and is NOT carried across. Specifications read from us.mammotion.com on 10 August 2026.",
    lastReviewed: "2026-08-11",
  },

  /* The LUBA 3 AWD 3000H's record lived here until 11 August 2026. It is now
     covered by the 1500H review above, which carries both machines, both
     ASINs and a tracked buy path for each; the 3000H's URL 301s there via
     MERGED_REVIEWS in content/product-names.ts.

     THE PRODUCT DID NOT GO ANYWHERE. Its D1 row, its destination record, its
     identity baseline and its /go/ key are all untouched, so it is still
     matchable, still comparable and still buyable. What it lost was a second
     page arguing with the first over the same search terms. */

  "dreame-a3-awd-1000": {
    slug: "dreame-a3-awd-1000",
    image: {
      src: "/media/reviews/dreame-a3-awd-1000/hero.webp",
      alt:
        "A BotPlanet panel naming the Dreame A3 AWD 1000, showing the black, white " +
        "and red four-wheel-drive mower on a lawn at night with lit planting behind " +
        "it.",
    },
    figures: [
      {
        afterHeading: "Eighty per cent against forty-five",
        src: "/media/reviews/dreame-a3-awd-1000/slope.webp",
        caption:
          "This is what an eighty per cent gradient claim is for. Four driven wheels " +
          "rather than two is the difference between climbing a bank like this one " +
          "and sliding down it.",
      },
      {
        afterHeading: "OmniSense 3.0, and why it suits a steep garden",
        src: "/media/reviews/dreame-a3-awd-1000/obstacle-vision.webp",
        caption:
          "Seeing an obstacle matters more on a slope than on the flat, because a " +
          "machine that stops dead on a bank has to restart on one.",
      },
      {
        afterHeading: "Who should not buy this",
        src: "/media/reviews/dreame-a3-awd-1000/coverage.webp",
        caption:
          "The rated area is 1,000 square metres. Arcs on artwork are not coverage — " +
          "the figure in the table is, and it is the one that rules a garden in or " +
          "out.",
      },
    ],
    categorySlug: "robotic-lawn-mowers",
    eyebrow: "Robotic lawn mower review",
    title: "Dreame A3 AWD 1000 review",
    seoTitle: "Dreame A3 AWD 1000 Review — 80% Slopes for $1,600",
    metaDescription:
      "The Dreame A3 AWD 1000 is the cheapest way to climb a bank here, on LiDAR " +
      "rather than satellites. A quarter acre is the ceiling, and 80% is the " +
      "slope.",
    verdict:
      "Eighty per cent slopes for $1,599.99, which is eight hundred dollars less than the only other machine here that climbs like this. It navigates on 360-degree 3D LiDAR and binocular vision rather than satellites, so a canopy does not defeat it, and it cuts from 1.2 to 3.9 inches — a wider range than anything else at its price. The ceiling is a quarter acre, and on flat ground the all-wheel drive is the whole reason for the premium.",
    bestFor:
      "A steep quarter acre, possibly under trees, without paying Mammotion money.",
    notIdealFor:
      "More than 10,764 sq ft, and any flat lawn — the Segway covers a quarter acre for $500 less.",
    facts: [
      { label: "Price", value: "$1,599.99, read 8 August 2026" },
      { label: "Rated area", value: "1,000 m² (0.25 acre)" },
      { label: "Max slope", value: "80% (38.7°), all-wheel drive" },
      { label: "Cutting height", value: "1.2–3.9 in" },
    ],
    specGroups: [
      {
        heading: "Your lawn",
        rows: [
          { label: "Rated area", value: "1,000 m² (0.25 acre)" },
          { label: "Max slope", value: "80% (38.7°), all-wheel drive" },
          { label: "Navigation", value: "OmniSense 3.0 — 360° 3D LiDAR plus binocular AI vision" },
          { label: "Drive", value: "All-wheel" },
        ],
      },
      {
        heading: "Cutting",
        rows: [
          { label: "Cutting height", value: "1.2–3.9 in" },
          { label: "Edge trim", value: "EdgeMaster, to within 1.91 in of a fence line" },
          { label: "Obstacle crossing", value: "2.17 in" },
          { label: "Cutting width", value: null },
        ],
      },
      {
        heading: "Not published",
        rows: [
          { label: "Battery", value: null },
          { label: "Runtime", value: null },
          { label: "Noise", value: null },
          { label: "IP rating", value: null },
          { label: "Weight", value: null },
          { label: "Warranty", value: null },
        ],
      },
    ],
    skuNote:
      "DREAME A3 AWD 1000, ASIN B0H3V799KT, $1,599.99 read on 8 August 2026. The brief named a “Dreame A1” and six passes across search and product lookups returned no such current product; this is the machine Dreame actually sells, judged on its own rather than substituted silently. The A3 AWD Pro at $2,699.99 is the larger sibling, and its 15.8 in dual-blade cutting width is NOT carried across to this model. Specifications read from dreametech.com on 10 August 2026.",
    lastReviewed: "2026-08-10",
  },

  "worx-landroid-vision-wr320": {
    slug: "worx-landroid-vision-wr320",
    image: {
      src: "/media/reviews/worx-landroid-vision-wr320/hero.webp",
      alt:
        "A BotPlanet panel headed “smart height control” for the WORX Landroid " +
        "Vision WR320, showing a hand holding a phone with the Landroid app's " +
        "cutting-height slider set to medium, and the orange and black mower on the " +
        "lawn behind.",
    },
    figures: [
      {
        afterHeading: "The camera is the argument",
        src: "/media/reviews/worx-landroid-vision-wr320/obstacles.webp",
        caption:
          "A camera rather than a bump sensor is the whole pitch for this machine. " +
          "What WORX does not publish is what it does when the camera cannot see — at " +
          "dusk, or in long wet grass.",
      },
      {
        afterHeading: "Half an acre, and what \"Landroid Vision\" does not mean",
        src: "/media/reviews/worx-landroid-vision-wr320/edge.webp",
        caption:
          "Cutting to the edge is the claim; how close is not a number WORX prints. " +
          "Every robot mower in this set leaves a margin, and the size of it is the " +
          "thing nobody publishes.",
      },
      {
        afterHeading: "The numbers",
        src: "/media/reviews/worx-landroid-vision-wr320/coverage.webp",
        caption:
          "The figures that decide this purchase are in the section above rather than " +
          "in this picture: rated area, cutting width and slope, all three published " +
          "by WORX.",
      },
    ],
    categorySlug: "robotic-lawn-mowers",
    eyebrow: "Robotic lawn mower review",
    title: "WORX Landroid Vision WR320 review",
    seoTitle: "WORX Landroid Vision WR320 Review — Half an Acre, $1,023",
    metaDescription:
      "The WORX Landroid Vision WR320 uses a camera, no antenna, and covers half " +
      "an acre for forty per cent of the Husqvarna price. No published runtime at " +
      "all.",
    verdict:
      "Half an acre for $1,022.54, navigated by camera rather than satellite, which is the right technology for a garden with trees and the reason this is comfortably the best value in the catalogue for a flat lawn. What WORX does not publish is anything about the battery — no capacity, no runtime, no charge time — on a machine rated for a lot of ground, and at thirty per cent it is not a slope mower.",
    bestFor:
      "A flat half acre with trees, at a price no other machine here comes near for that area.",
    notIdealFor:
      "Any real slope past 30%, and anyone who wants published runtime figures and a warranty length before spending outdoors.",
    facts: [
      { label: "Price", value: "$1,022.54, read 8 August 2026" },
      { label: "Rated area", value: "1/2 acre (21,780 sq ft)" },
      { label: "Max slope", value: "30% (17°)" },
      { label: "Navigation", value: "Vision AI plus RTK Cloud — no on-site antenna" },
    ],
    specGroups: [
      {
        heading: "Your lawn",
        rows: [
          { label: "Rated area", value: "1/2 acre (21,780 sq ft)" },
          { label: "Max slope", value: "30% (17°)" },
          { label: "Navigation", value: "Vision AI plus RTK Cloud — no on-site antenna" },
          { label: "Camera", value: "High dynamic range full HD wide angle with auto white balance" },
        ],
      },
      {
        heading: "Cutting",
        rows: [
          { label: "Cutting width", value: "8.7 in" },
          { label: "Cutting height", value: "1.57–3.54 in, electronic adjustment" },
        ],
      },
      {
        heading: "Not published",
        rows: [
          { label: "Battery", value: null },
          { label: "Runtime", value: null },
          { label: "Charge time", value: null },
          { label: "Noise", value: null },
          { label: "IP rating", value: null },
          { label: "Weight", value: null },
          { label: "Warranty", value: null },
        ],
      },
    ],
    skuNote:
      "WORX WR320, Landroid Vision Cloud 1/2 acre, ASIN B0GN8KK8XW, $1,022.54 read on 8 August 2026. Landroid Vision is a family of at least four live US models: this WR320 2WD half acre, the WO7144 quarter acre at $999.99 — twenty-three dollars apart — the WR342 4WD half acre at $2,069.99 and the WR344 4WD one acre at $2,646.18. Specifications read from worx.com on 10 August 2026.",
    lastReviewed: "2026-08-10",
  },

  "segway-navimow-i110n": {
    slug: "segway-navimow-i110n",
    image: {
      src: "/media/reviews/segway-navimow-i110n/hero.webp",
      alt:
        "A BotPlanet panel naming the Segway Navimow i110N and describing it as " +
        "wire-free robotic mowing, showing the grey and orange mower on a lawn at " +
        "night with a blue line drawn along the lawn edge and a lit house behind.",
    },
    figures: [
      {
        afterHeading: "What Network RTK saves you",
        src: "/media/reviews/segway-navimow-i110n/rtk.webp",
        caption:
          "Tree cover is the failure mode for satellite positioning, and it is the " +
          "reason a camera sits alongside the aerial rather than instead of it. " +
          "Segway's own claim; no accuracy figure under canopy is published.",
      },
      {
        afterHeading: "The numbers, and the one Segway does not print",
        src: "/media/reviews/segway-navimow-i110n/zoning.webp",
        caption:
          "Zones and schedules are the part that is easy to show. The figure this " +
          "artwork does not carry is the one the section above is about.",
      },
      {
        afterHeading: "Who should buy one",
        src: "/media/reviews/segway-navimow-i110n/voice.webp",
        caption:
          "Voice control is a convenience rather than a reason to buy. It is worth " +
          "knowing it exists before you choose between this and a machine that only " +
          "has an app.",
      },
    ],
    categorySlug: "robotic-lawn-mowers",
    eyebrow: "Robotic lawn mower review",
    title: "Segway Navimow i110N review",
    seoTitle: "Segway Navimow i110N Review — The Data Is Included",
    metaDescription:
      "The Segway Navimow i110N has Network RTK, no antenna and no subscription — " +
      "the cellular data is free. A quarter acre for $1,099, and useless under " +
      "trees.",
    verdict:
      "Network RTK with no local antenna to mount, and Segway states the access is included at no extra cost with the cellular data provided free — which removes both the afternoon of installation and the question of what happens when the free year ends. At $1,099 for a quarter acre that is a clean proposition. It is also satellite-positioned, so a mature canopy is a hard failure rather than a degradation.",
    bestFor:
      "An open quarter acre with a clear view of the sky, and no appetite for mounting an antenna.",
    notIdealFor:
      "A lawn under mature trees, where satellite positioning fails outright — and anyone who cuts below two inches.",
    facts: [
      { label: "Price", value: "$1,099, read 8 August 2026" },
      { label: "Rated area", value: "1/4 acre (10,890 sq ft)" },
      { label: "Max slope", value: "30% (17°)" },
      { label: "Navigation", value: "Network RTK with no local antenna, plus VisionFence" },
    ],
    specGroups: [
      {
        heading: "Your lawn",
        rows: [
          { label: "Rated area", value: "1/4 acre (10,890 sq ft)" },
          { label: "Max slope", value: "30% (17°)" },
          {
            label: "Navigation",
            value: "Network RTK with no local antenna, plus VisionFence",
            note: "Segway states Network RTK access is included at no extra cost and the required cellular data is provided free of charge.",
          },
          { label: "Obstacles", value: "VisionFence identifies over 150 objects across animals, tools and everyday obstacles" },
        ],
      },
      {
        heading: "Cutting",
        rows: [
          {
            label: "Cutting height",
            value: "2–3.6 in, adjusted by hand",
            note: "Two inches is a high floor. A lawn you like cut short may be below this machine's lowest setting.",
          },
          { label: "Cutting width", value: null },
        ],
      },
      {
        heading: "Not published",
        rows: [
          { label: "Battery", value: null },
          { label: "Runtime", value: null },
          { label: "Noise", value: null },
          { label: "IP rating", value: null },
          { label: "Weight", value: null },
          { label: "Warranty", value: null },
        ],
      },
    ],
    skuNote:
      "Segway Navimow i110N, ASIN B0CX7T6BR3, $1,099 read on 8 August 2026. The range refreshed at CES 2026 — the i2 AWD series from $999 and the X4 series from $2,499 are the new generation, with the i105N and i110N remaining on sale beneath them. Specifications read from navimow.segway.com on 10 August 2026.",
    lastReviewed: "2026-08-10",
  },

  "eufy-e15": {
    slug: "eufy-e15",
    image: {
      src: "/media/reviews/eufy-e15/hero.webp",
      alt:
        "A BotPlanet panel for the eufy Robot Lawn Mower E15, showing the white and " +
        "grey mower on a lawn at dusk with a curved blue guide line running behind " +
        "it and a lit house beyond. Labels read wire-free freedom, precise vision " +
        "navigation, smart and even cutting and app control.",
    },
    figures: [
      {
        afterHeading: "Small, and honest about it",
        src: "/media/reviews/eufy-e15/cutting-height.webp",
        caption:
          "eufy's own listing panels, and three figures it does publish: 25–75mm " +
          "cutting height, an 18-degree slope limit and 56dB. The footnote is eufy's " +
          "too — the E15 and E18 differ only in mowing area.",
      },
      {
        afterHeading: "No wires, no antenna, no satellites",
        src: "/media/reviews/eufy-e15/obstacles.webp",
        caption:
          "Twelve obstacle types named by eufy, and the reason the machine needs no " +
          "perimeter wire: it is looking rather than following. What it does at dusk " +
          "is not stated.",
      },
      {
        afterHeading: "Who should not buy this",
        src: "/media/reviews/eufy-e15/app-security.webp",
        caption:
          "GPS and 4G tracking is eufy's answer to a machine that lives outdoors " +
          "unattended. The same footnote applies: this artwork is shared with the " +
          "E18, which differs only in mowing area.",
      },
    ],
    categorySlug: "robotic-lawn-mowers",
    eyebrow: "Robotic lawn mower review",
    title: "eufy Robot Lawn Mower E15 review",
    /* The register's primary is the full `eufy robot lawn mower e15`, which is
       how eufy names it and how the 390/mo searches read, so the title carries
       all five words even though it costs most of the line. */
    seoTitle: "eufy Robot Lawn Mower E15 Review — We Had This Wrong",
    metaDescription:
      "The eufy Robot Lawn Mower E15 is rated at 800 m² — 8,611 sq ft, not the " +
      "quarter acre our catalogue said. 26% less grass, on a figure that rules " +
      "mowers out.",
    verdict:
      "Camera-only navigation with no wires, no antenna and no satellites, which is the shortest setup in the category and the right technology for a garden with trees. Everything else about it is at the modest end: eight-inch cut, three-inch ceiling, eighteen degrees of slope and 800 square metres. At $1,199.99 the WORX Landroid Vision covers two and a half times the ground for $177 less using the same kind of navigation, and that is a hard comparison to win.",
    bestFor:
      "A small flat lawn under trees, where nothing needs mounting and satellite positioning would fail.",
    notIdealFor:
      "More than 8,611 sq ft, any slope past 18°, or a lawn cut above three inches.",
    facts: [
      { label: "Price", value: "$1,199.99, read 8 August 2026" },
      {
        label: "Rated area",
        value: "800 m² (8,611 sq ft)",
      },
      { label: "Max slope", value: "18°" },
      { label: "Navigation", value: "Pure vision FSD — no wires, no RTK station" },
    ],
    specGroups: [
      {
        heading: "Your lawn",
        rows: [
          {
            label: "Rated area",
            value: "800 m² (8,611 sq ft)",
            note: "Our catalogue recorded 10,890 sq ft — a quarter acre rounded rather than converted — until 10 August 2026. Corrected to eufy's own figure.",
          },
          { label: "Max slope", value: "18°" },
          { label: "Navigation", value: "Pure vision FSD — high-precision cameras and algorithms, no wires and no RTK station" },
          { label: "Camera field of view", value: "96° horizontal, 80° vertical" },
        ],
      },
      {
        heading: "Cutting",
        rows: [
          { label: "Cutting width", value: "8 in (203 mm)" },
          { label: "Cutting height", value: "1–3 in (25–75 mm)" },
        ],
      },
      {
        heading: "Not published",
        rows: [
          { label: "Battery", value: null },
          { label: "Runtime", value: null },
          { label: "Charge time", value: null },
          { label: "Noise", value: null },
          { label: "IP rating", value: null },
          { label: "Weight", value: null },
          { label: "Warranty", value: null },
        ],
      },
    ],
    skuNote:
      "eufy Robot Lawn Mower E15, ASIN B0DRVYDXWX, $1,199.99 read on 8 August 2026. There is an E18 in the same family and we did not verify it — every figure here is the E15's. Specifications read from eufy.com on 10 August 2026.",
    lastReviewed: "2026-08-10",
  },

  /* ------------------------------------------------------------------
     YARBO SNOW BLOWER — the only product on this site in a HIDDEN category.

     Approved 11 August 2026 after four review rounds. The category has one
     manufacturer: Snowbot IS Yarbo, Left Hand Robotics went to Toro in 2021
     and builds commercial machines, and every other domain selling one is a
     Yarbo dealer. With nothing to compare, the four surfaces a category means
     here are not built — see nav.ts, where robot-snow-blowers is `hidden`.

     THE MONEY SERP DECIDED THE SHAPE OF THIS PAGE. `yarbo snow blower reviews`
     returns Yarbo's own page, then a Reddit thread titled "Extremely
     Disappointed with the Yarbo Snow Blower" at position 3, then Trustpilot
     and Yarbo's own forum. Lowe's carries zero ratings. So the owner evidence
     section sits high rather than at the foot, because a review built on the
     specification sheet alone is contradicted by the third result on its own
     name.

     NO BUY LINK. OFFER_SETUP_PENDING with a real obstacle: Amazon's details
     table could not be read, so the ASIN rests on a search-result title.
     ------------------------------------------------------------------ */
  "yarbo-snow-blower": {
    slug: "yarbo-snow-blower",
    image: {
      src: "/media/reviews/yarbo-snow-blower/hero.webp",
      alt:
        "BotPlanet artwork titled Yarbo Snow Blower: a black and yellow tracked " +
        "robot clearing a driveway at night, snow arcing from its chute, a lit " +
        "house behind and a cleared strip visible behind its tracks.",
    },
    /* Five figures, and the order they argue in matters more here than on any
       other review on the site. `module-split` sits under the price section
       rather than the specification section because the whole page turns on
       one object being two objects, and a picture settles that faster than
       four paragraphs. `conditions` deliberately sits under what we could NOT
       establish: four confident renders of powder, falling snow, slush and a
       plough bank, against a machine nobody has measured across any of them.
       Its caption says so, because the alternative is artwork quietly making
       a claim the text spent a section refusing to make. */
    figures: [
      {
        afterHeading: "The first thing to understand: it is not a snow blower",
        src: "/media/reviews/yarbo-snow-blower/tracked-platform.webp",
        caption:
          "Two objects, bolted together. The tracked chassis at the back is the " +
          "Core — battery, satellite positioning and cameras — and it does " +
          "nothing on its own. The blower housing across the front is one of " +
          "four things you can attach to it.",
      },
      {
        afterHeading: "Why you will see two prices, and which one is real",
        src: "/media/reviews/yarbo-snow-blower/module-split.webp",
        caption:
          "The $1,299 part is the top half: augers, impeller and chute, with " +
          "no way to move itself. The $4,999 product is both halves plus the " +
          "dock, the battery and the Data Center. Third-party reviews quote " +
          "the higher figure and call it standalone, which is how the " +
          "confusion starts.",
      },
      {
        afterHeading: "The published specification",
        src: "/media/reviews/yarbo-snow-blower/chute-control.webp",
        caption:
          "The chute rotates and elevates, which is what turns a two-stage " +
          "machine into one that can aim. No distance is printed on this " +
          "artwork on purpose — Yarbo publishes two irreconcilable figures for " +
          "it and we are not picking one by drawing it.",
      },
      {
        afterHeading: "Who it might be for",
        src: "/media/reviews/yarbo-snow-blower/daylight-driveway.webp",
        caption:
          "The case it makes best: a long driveway, deep snow, and twenty of " +
          "these a winter. At 6,000 sq ft a charge, a driveway much longer " +
          "than this one is a machine that docks partway and comes back.",
      },
      {
        afterHeading: "What we could not establish",
        src: "/media/reviews/yarbo-snow-blower/conditions.webp",
        caption:
          "Powder, falling snow, wet slush and a ploughed-in bank. These are " +
          "renders, not results — the difference between the top two panels " +
          "and the bottom two is exactly the throughput nobody has measured, " +
          "and the wet-snow panel is the one we would most want tested.",
      },
    ],
    categorySlug: "robot-snow-blowers",
    /* Its own category is hidden and holds one product, so it has no siblings,
       no comparison table and no hub. The Core this machine rides on is the
       same platform as Yarbo's mower, which makes lawn the true neighbour
       rather than a convenient one. */
    relatedCategorySlug: "robotic-lawn-mowers",
    eyebrow: "Robot snow blower review",
    title: "Yarbo Snow Blower review",
    seoTitle: "Yarbo Snow Blower Review — $1,299 or $4,999?",
    metaDescription:
      "The Yarbo Snow Blower is a module, not a robot — which is why you will " +
      "see $1,299 and $4,999 for the same words. What owners actually say.",
    verdict:
      "The only autonomous snow blower a US buyer can actually purchase, which is a statement about the market rather than a compliment. It is a module on Yarbo's modular Core, so $1,299 buys the attachment and $4,999 buys the machine that carries it — a distinction every third-party review blurs. Yarbo's published figures are decent for a domestic driveway; the owner threads that rank on its own name are not uniformly happy, and Lowe's carries no ratings at all.",
    bestFor:
      "A snow-belt driveway inside 6,000 sq ft with twenty-plus clearing events a winter — or anybody already buying a Yarbo Core to mow, for whom the module is $1,299 rather than $4,999.",
    notIdealFor:
      "Anybody expecting $1,299 to buy a robot, a driveway that needs clearing in one pass, a slope past 36%, or anybody who would happily pay a contractor — the robot's argument is never going outside, not cost.",
    facts: [
      { label: "Price", value: "$4,999 complete / $1,299 module only, read 11 August 2026" },
      { label: "Clearing", value: "24 in wide, 12 in intake, throws 6–40 ft" },
      { label: "Runtime", value: "~90 min, 6,000 sq ft per charge at 1 in snow" },
      { label: "Max slope", value: "36% (21°)" },
    ],
    specGroups: [
      {
        heading: "What it clears",
        rows: [
          { label: "Clearing width", value: "24 in" },
          { label: "Intake height", value: "12 in, adjustable" },
          {
            label: "Throw distance",
            value: "6–40 ft, adjustable",
            note: "Yarbo's own module page prints \"up to 40 feet\" and \"6-40 Yards Throw Control\" in the same panel. One is wrong and both are Yarbo's; the conservative figure is used here.",
          },
          { label: "Stages", value: "Two — auger feeding an impeller" },
          { label: "Area per charge", value: "Up to 6,000 sq ft at 1 in of snow" },
          { label: "Max slope", value: "36% (21°)" },
        ],
      },
      {
        heading: "Running it",
        rows: [
          { label: "Battery", value: "38.4 Ah" },
          {
            label: "Runtime",
            value: "Approximately 90 min",
            note: "Several review sites state \"up to 4 hours\" on the same battery. Yarbo's own page says approximately 90 minutes, and the maker's figure is the one carried.",
          },
          { label: "Charge time", value: "90 min, 20% to 80%" },
          { label: "Operating temperature", value: "−13°F to +140°F" },
          { label: "Construction", value: "Q355 steel" },
          { label: "Ingress rating", value: "IPX5" },
          { label: "Warranty", value: "2 years standard, up to 5" },
        ],
      },
      {
        heading: "Not published",
        rows: [
          { label: "Noise", value: null },
          { label: "Throughput in wet snow", value: null },
          { label: "Machine weight", value: null },
          { label: "Owner ratings at Lowe's", value: null },
        ],
      },
    ],
    skuNote:
      "Two SKUs and the difference is the robot. The Snow Blower Module alone is $1,299 and requires a Core. The product Yarbo calls the \"Yarbo Snow Blower\" is $4,999 and includes the Core, Data Center, Y Series battery, docking station, snow track, tow hitch, charger and install kit. Both read from yarbo.com on 11 August 2026. Mower Pro plus Snow Blower is $7,199; the complete 4-in-1 is $7,999. Dealer pricing moves: SmartDots listed the Core at $4,999 struck to $3,599 and CNY Green Team a modular snow blower robot at $4,530, both read the same day. Identity is Lowe's \"Model #YARBO S1\" (item 8256113) and Best Buy SKU J3Q5Q8G9GS, \"Black Yarbo S1\". Amazon ASIN B0FJF9V1JC is from a search-result title and has NOT been confirmed against the listing's own details table, which is why this page carries no buy link.",
    lastReviewed: "2026-08-11",
  },

};

export function reviewFor(slug: string | undefined): ReviewContent | undefined {
  return slug ? REVIEWS[slug] : undefined;
}
