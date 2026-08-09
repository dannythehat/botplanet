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
    seoTitle: "Dolphin Nautilus CC Plus Wi-Fi Review — The 40 ft Limit",
    metaDescription:
      "What the Nautilus CC Plus cleans, what it leaves alone, the 40 ft pool limit, and the US and global SKU difference worth checking before you order.",
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
      "Cordless, 2.5 hours of runtime, and a 50 ft pool limit that appears only in marketing artwork. What the battery really buys, and who should skip it.",
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
      "An honest review of the Betta SE Plus solar pool skimmer: 30 hours of runtime, a 200 micron " +
      "basket, and the one thing it will never do — clean your floor.",
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
    seoTitle: "Aiper Scuba V3 AI Vision Review — What the Camera Sees",
    metaDescription:
      "What the camera actually does, what seven days on one charge really means, the 3-micron filter claim, and the privacy question nobody else is asking.",
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
      "The 33 ft limit that catches people out, the sibling rated for 50 ft, and why we are careful about the waterline claim on this particular machine.",
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
      "The only robot here that skims the surface as well as the floor. The 8,500 GPH claim, the three-year warranty, and the bundle that fooled our records.",
    verdict:
      "The most expensive machine we cover and the only one that honestly claims all four jobs — " +
      "surface, waterline, walls and floor — with ultrasonic mapping, 8,500 GPH of claimed suction " +
      "and the longest stated warranty in our catalogue. Twice the price of Aiper's own camera " +
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
      "Ninety minutes of floor-only cleaning for a small above-ground pool, the sparsest spec sheet we cover, and the Amazon listing that died mid-review.",
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
      "Four-zone cleaning including 12-inch shallow ledges, a runtime Aiper states two different ways, and the Amazon listing we refuse to link to.",
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
    seoTitle: "BuBlue Bubot 800P Gen2 Review — Corded, So It Never Quits",
    metaDescription:
      "Corded four-zone cleaning that never runs out of battery. What BuBlue actually publishes, and what its shallow-water claim really means in a pool.",
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
      "Floor, wall and waterline cleaning at the budget end, and a weekly timer that splits one charge into four cleans. Plus the listing history to know.",
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
      "Five jobs in one machine, including surface skimming and clarification, a camera that maps your pool, and a three-year warranty that changes the sums.",
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
      "The only window robot here that works away from a socket. What the battery station buys, what it does not, and why the W2 PRO is the better buy for most houses.",
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
      { label: "Power-off hold", value: "30 min" },
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
          { label: "Power-off hold", value: "30 minutes" },
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
      "The flagship without the battery station, and on glass the difference sits inside ECOVACS's own tolerance. When the Omni is worth the premium.",
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
          { label: "Power-off hold", value: "30 minutes" },
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
      "Half the suction of the W2 PRO, three modes instead of seven, and a power-off hold ECOVACS will not put a number on. Who it is genuinely right for.",
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
          { label: "Power-off hold", value: null },
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
      "The only window robot here claiming inclined glass: 6,500 Pa stated, an 80 ml tank, and a specification we could not verify. Read the gaps first.",
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
        { label: "Power-off hold", value: null },
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
      "Four nozzles, a 60 ml tank and 3,200 Pa stated, from the third brand in the catalogue. What the high-rise rating does and does not tell you.",
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
        { label: "Power-off hold", value: null },
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
      "Ultrasonic spray and two replaceable water tanks, which is a real advantage nothing else here offers. Also no published suction figure at all — what that means.",
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
        { label: "Power-off hold", value: null },
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
      "The cheaper HOBOT and the machine we know least about in the whole catalogue. What it offers, and why we would point a first-time buyer elsewhere.",
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
        { label: "Power-off hold", value: null },
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
      "The cheapest machine here, and the only one with a remote instead of an app. Also the only one not rated for frameless glass, which decides it.",
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
        { label: "Power-off hold", value: null },
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
      "A $429 robot pet with no legs, no speech and two axes of movement. What Moflin " +
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
    title: "Anki Vector 2.0 review",
    seoTitle: "Vector Robot Review — Is It Still Supported in 2026?",
    metaDescription:
      "Anki went under in 2019 and Vector is still on sale. Who owns it now, what the " +
      "$11.99 subscription covers, and whether the robot works without one.",
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
    title: "Eilik review",
    seoTitle: "Eilik Review — The 1.5-Hour Battery Nobody Mentions",
    metaDescription:
      "A $139.99 desk robot with real character, a 90-day warranty and 90 minutes of " +
      "battery. What Eilik does, what the DQ adds, and whether two is better.",
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
    title: "Loona Petbot review",
    seoTitle: "Loona Robot Review — 90 Minutes of Play for $499",
    metaDescription:
      "The most capable robot pet you can buy, and it charges longer than it plays. " +
      "What $499 gets you, what the camera adds, and the battery nobody mentions.",
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
    categorySlug: "educational-coding-robots",
    eyebrow: "Coding robot review",
    title: "Cozmo review",
    seoTitle: "Cozmo Robot Review — Why You Cannot Buy One",
    metaDescription:
      "Cozmo is listed at $399.99 with no stock and no ship date, and Pennsylvania is " +
      "suing the seller over 14,000 unfulfilled orders. What to buy instead.",
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
    categorySlug: "companion-robots",
    eyebrow: "Companion robot review",
    title: "Moxie review",
    seoTitle: "Moxie Robot Review — It Stopped Working in 2025",
    metaDescription:
      "Embodied shut down and Moxie's servers went off, mostly without refunds. What a " +
      "used one can and cannot do on the community server, and what to buy instead.",
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
    title: "Living.AI EMO review",
    seoTitle: "EMO Robot Review — And Why Amazon Sells Fakes",
    metaDescription:
      "EMO is not sold on Amazon in the US, and searching for it returns copies. What " +
      "the real Living.AI EMO does, and what to buy instead if you want it now.",
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
      "A $299 robot pet with swappable fur and no allergies, whose conversation " +
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
      "A $149 camera that drives itself around your house. What the Air 2 does, how it " +
      "differs from the 2S and the Plus, and why the original Air is gone.",
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
      "The cheapest driving pet camera Enabot sells. 1080p, 360-degree view, no " +
      "subscription, and small enough to go under the sofa. What you give up.",
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
      "The only pet camera robot that drives to your dog and gives it a treat. What the " +
      "dispenser adds over a Furbo, and what the modular design costs.",
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
    categorySlug: "educational-coding-robots",
    eyebrow: "Coding robot review",
    title: "Sphero BOLT review",
    seoTitle: "Sphero BOLT Review — The One That Grows With Them",
    metaDescription:
      "A $179 coding ball that starts with drawing and ends in Python. Whether BOLT is worth three times a Sphero Mini, and who outgrows it.",
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
    categorySlug: "educational-coding-robots",
    eyebrow: "Coding robot review",
    title: "Sphero Mini review",
    seoTitle: "Sphero Mini Review — The Cheap Way to Find Out",
    metaDescription:
      "A $50 coding ball the size of a ping-pong ball, running the same app as the $179 BOLT. What the one-hour battery costs you.",
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
    categorySlug: "educational-coding-robots",
    eyebrow: "Coding robot review",
    title: "Sphero indi review",
    seoTitle: "Sphero indi Review — Coding With No Screen At All",
    metaDescription:
      "A $100 robot a four-year-old programs with coloured cards and no screen. What indi teaches, and the age it stops working.",
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
    categorySlug: "educational-coding-robots",
    eyebrow: "Coding robot review",
    title: "Ozobot Evo review",
    seoTitle: "Ozobot Evo Review — 700 Lessons and a Marker Pen",
    metaDescription:
      "A $175 coding robot that reads lines drawn in felt-tip. What the Evo Entry Kit includes, and why it is built for a classroom.",
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
    categorySlug: "educational-coding-robots",
    eyebrow: "Coding robot review",
    title: "Makeblock mBot review",
    seoTitle: "Makeblock mBot Review — Build It, Then Code It",
    metaDescription:
      "A $69 robot a child assembles in about 15 minutes and then programs in Scratch. The cheapest way into real electronics.",
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


  /* JOY FOR ALL, added 8 August 2026. This product was LIVE, PUBLISHED, CARRYING
     A WORKING BUY BUTTON and recommended as the top pick on the eldercare guide
     — with no review record at all. The page rendered from the catalogue
     fallback, which meant a robotic cat with a heading reading "Cleans" and no
     prose beneath it. Found by auditing image coverage, not by a test, because
     every test here checks that a review is correct rather than that one
     exists. */
  "joy-for-all-companion-pets": {
    slug: "joy-for-all-companion-pets",
    categorySlug: "companion-robots",
    eyebrow: "Companion robot review",
    title: "Joy For All Companion Pet Cat review",
    seoTitle: "Joy For All Companion Pet Cat Review — Batteries, Not Wi-Fi",
    metaDescription:
      "A $159 robotic cat with four C batteries, no app and no account. Why the least technological product here is the one most likely to get used.",
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
      "10,000 Pa maximum and 3,300 Pa moving, on the dearest window robot we hold. Who the extra suction is for, and who should buy the W2 PRO Omni.",
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
    categorySlug: "window-cleaning-robots",
    eyebrow: "Window robot review",
    title: "ECOVACS WINBOT W2S review",
    seoTitle:
      "WINBOT W2S Review — Edge Scrubbers, No Published Suction",
    metaDescription:
      "TruEdge scrubbers instead of six spray nozzles. Why the edge is a real complaint, and why no published suction figure is the reason to hesitate.",
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
    categorySlug: "window-cleaning-robots",
    eyebrow: "Window robot review",
    title: "ECOVACS WINBOT Mini review",
    seoTitle: "ECOVACS WINBOT Mini Review — Small Panes, Odd Suction Figure",
    metaDescription:
      "7,500 Pa on the cheapest WINBOT, higher than machines costing three times as much. What that number means, and why size is the real reason to buy.",
    verdict:
      "The machine for a window every other robot here is too big for, at the lowest price in the range. Its headline suction beats the flagships and that comparison is not what it looks like \u2014 buy it for the size, and take the grip as a bonus.",
    bestFor:
      "Small panes \u2014 glazing bars, a bathroom, a cottage casement \u2014 and a household with nowhere to store a robot between uses.",
    notIdealFor:
      "Large glass, where three cleaning modes and two-generations-old navigation are the real limitation rather than the suction figure.",
    facts: [
      { label: "Max suction", value: "7,500 Pa" },
      { label: "Size", value: "215 \u00d7 215 \u00d7 55 mm" },
      { label: "Power-off hold", value: "30 minutes" },
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
          { label: "Power-off hold", value: "30 minutes \u2014 the same figure ECOVACS prints for its flagships" },
          { label: "Navigation", value: "WIN-SLAM 3.0, two generations behind the W2 machines" },
          { label: "Cleaning modes", value: "3, against 7 on the W2 PRO" },
        ],
      },
    ],
    skuNote:
      "Amazon US B0DR8W696Y at $150. The Mini is the only WINBOT small enough for divided panes, and its dimensions are what identify it rather than the name.",
    lastReviewed: "2026-08-08",
  },

};

export function reviewFor(slug: string | undefined): ReviewContent | undefined {
  return slug ? REVIEWS[slug] : undefined;
}
