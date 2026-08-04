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

  "betta-se-plus": {
    slug: "betta-se-plus",
    categorySlug: "robotic-pool-cleaners",
    eyebrow: "Robotic pool skimmer review",
    title: "Betta SE Plus solar skimmer review",
    seoTitle: "Betta SE Plus Solar Robotic Pool Skimmer Review | BotPlanet",
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
    seoTitle: "Aiper Scuba V3 AI Vision Review | BotPlanet",
    metaDescription:
      "An honest review of the Aiper Scuba V3 AI Vision: what the camera actually does, what " +
      "\"7 days on one charge\" really means, the 3 micron filter claim, and the privacy question " +
      "nobody else is asking.",
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
    seoTitle: "Dolphin Proteus DX4 Plus Review | BotPlanet",
    metaDescription:
      "An honest review of the Dolphin Proteus DX4 Plus: the 33 ft limit that catches people out, " +
      "the sibling rated for 50, and why we are careful about the waterline claim.",
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
    seoTitle: "Aiper Scuba X1 Pro Max Review | BotPlanet",
    metaDescription:
      "An honest review of the Aiper Scuba X1 Pro Max: the only robot we cover that skims the " +
      "surface as well as the floor, the 8,500 GPH claim, the 3-year warranty, and the bundle trap " +
      "that once fooled our own records.",
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
    seoTitle: "Aiper Seagull SE Review | BotPlanet",
    metaDescription:
      "An honest review of the Aiper Seagull SE: 90 minutes of floor-only cleaning for a small " +
      "above-ground pool, the sparsest spec sheet we cover, and the Amazon listing that died " +
      "while we wrote it.",
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
};

export function reviewFor(slug: string | undefined): ReviewContent | undefined {
  return slug ? REVIEWS[slug] : undefined;
}
