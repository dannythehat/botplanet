/**
 * Product editorial layer (blueprint W5/W6).
 *
 * SEPARATION OF CONCERNS:
 *  - Commercial/dynamic data (offers, prices, stock, redirect keys, attribution)
 *    stays in D1 and is joined by slug at request time — the existing model is
 *    preserved, and commission never enters this file.
 *  - Editorial/narrative/spec data lives here, versioned in git and reviewable
 *    in the PR.
 *
 * HONESTY: every value below is researched from manufacturer + major US retailer
 * pages (sources listed per product), not physically tested. `evidenceLabel`
 * reflects that ("Manufacturer data verified" / "Researched"). "Hands-on tested"
 * is NEVER set here — it is only earned with a real review unit. Prices are
 * approximate street ranges for context; live prices come from D1 offers with a
 * freshness stamp. Keyed by the D1 product slug.
 */
import type { EvidenceKey } from "./team";

export interface ProductEditorial {
  /** Stable canonical product ID — matches D1 `products.id`. Join through THIS, never the slug (slugs can change). */
  productId: string;
  slug: string;
  oneLiner: string;
  verdict: string;
  bestFor: string;
  /** Approx US street/MSRP range for context only; [null,null] if unknown. */
  priceRangeUsdApprox: [number | null, number | null];
  specs: {
    poolSizeSuitability: string;
    cableLengthFt: number | null;
    runtimeMins: number | null;
    chargeTimeHrs: number | null;
    filtration: string;
    navigation: string;
    weightLbs: number | null;
    warranty: string;
    appSupport: string;
  };
  notableFeatures: string[];
  pros: string[];
  limitations: string[];
  whoShouldBuy: string;
  whoShouldAvoid: string;
  faqs: { q: string; a: string }[];
  sources: { label: string; url: string }[];
  evidence: EvidenceKey;
  confidence: "high" | "medium" | "low";
  researchedDate: string;
}

const R = "2026-07-30";

const RAW: Record<string, Omit<ProductEditorial, "productId">> = {
  "wybot-c1": {
    slug: "wybot-c1",
    oneLiner: "Affordable cordless robot for in-ground and above-ground pools with app control and waterline cleaning.",
    verdict:
      "A strong budget cordless pick that cleans floors, walls and the waterline on pools up to ~1,615 sq ft with roughly 150 minutes of runtime. It undercuts premium brands significantly and adds app scheduling, though its filtration and long-term durability are less proven than Maytronics. A smart value buy for small-to-mid pools where cord-free convenience matters.",
    bestFor: "Budget cordless convenience",
    priceRangeUsdApprox: [400, 570],
    specs: {
      poolSizeSuitability: "In-ground & above-ground pools up to ~1,615 sq ft",
      cableLengthFt: null,
      runtimeMins: 150,
      chargeTimeHrs: 3,
      filtration: "Top-load 180-micron fine filter basket, dual PVC brushes",
      navigation: "Smart path planning (S-path / N-path modes)",
      weightLbs: 17.6,
      warranty: "2-year limited; 30-day money-back",
      appSupport: "WYBOT app — modes, weekly scheduling, OTA updates",
    },
    notableFeatures: [
      "Cord-free lithium battery (no tangling cable)",
      "Up to ~150 minutes runtime per charge",
      "Cleans waterline and walls, not just the floor",
      "App with scheduling and multiple modes",
      "Self-parks at the waterline for easy retrieval",
    ],
    pros: [
      "Much cheaper than premium robotic cleaners",
      "Truly cordless — no cable snags",
      "Works on in-ground and above-ground pools",
      "Cleans waterline and walls",
      "Lightweight at 17.6 lbs",
    ],
    limitations: [
      "Battery runtime may not finish very large pools in one cycle",
      "Filtration fineness and debris capacity trail top-tier models",
      "Newer brand — less proven long-term reliability",
      "No water-surface skimming",
      "Requires recharging between full cleans",
    ],
    whoShouldBuy: "Owners of small-to-mid pools who want cordless convenience and app control at a budget price.",
    whoShouldAvoid: "Owners of large pools, or buyers prioritising proven long-term durability and the finest filtration.",
    faqs: [
      { q: "Is the WYBOT C1 cordless?", a: "Yes — it runs on a rechargeable lithium battery with no cable, delivering up to about 150 minutes per charge." },
      { q: "Does it clean walls and the waterline?", a: "Yes, it cleans floors, walls and the waterline, plus steps and slopes." },
      { q: "What size pool does it fit?", a: "It is rated for in-ground and above-ground pools up to roughly 1,615 sq ft." },
    ],
    sources: [
      { label: "WYBOT official product page", url: "https://www.wybotpool.com/products/wybot-c1-cordless-robotic-pool-cleaner" },
      // Replaced 4 August 2026 — the previous source cited B0G64JV6K4, the dead
      // ASIN the rejection register retired on 31 July.
      { label: "Amazon US listing (WYBOT C1)", url: "https://www.amazon.com/WYBOT-C1-Cordless-Inground-Professional/dp/B0GYWJMNWK" },
    ],
    evidence: "manufacturer_verified",
    confidence: "high",
    researchedDate: R,
  },

  "dolphin-nautilus-cc-plus": {
    slug: "dolphin-nautilus-cc-plus",
    /* CORRECTED 3 August 2026. This record claimed waterline cleaning in five
       places. Maytronics' own page for part 99996409-PCI states "Cleaning
       Coverage: Floor and Walls", "Waterline Scrubbing: No" and "Active Brush:
       No". Every one of those claims has been removed rather than softened —
       the waterline is exactly where the greasy tile ring forms, so a buyer who
       bought this for that reason bought the wrong machine. */
    oneLiner: "Popular corded Maytronics robot with Wi-Fi app control and floor and wall cleaning for in-ground pools.",
    verdict:
      "Maytronics' best-selling mid-range cleaner delivers reliable floor and wall cleaning with app scheduling via MyDolphin Plus. Its corded design with an anti-tangle swivel means no recharging, and top-load cartridge filters are easy to service. A safe, proven choice for in-ground pools up to 40 ft — but Maytronics states it does not scrub the waterline, so if the tile line is your problem this is not the machine for it.",
    bestFor: "Proven in-ground everyday cleaning",
    priceRangeUsdApprox: [700, 999],
    specs: {
      poolSizeSuitability: "In-ground pools up to ~40 ft",
      cableLengthFt: 60,
      runtimeMins: 120,
      chargeTimeHrs: null,
      filtration: "Top-load Ultra-Fine Filter Kit",
      navigation: "CleverClean scanning with anti-tangle swivel cable",
      weightLbs: 20,
      // Maytronics states 1 year on its own product page. The previous "2-year
      // limited (varies by retailer)" was a retailer's term, not the maker's.
      warranty: "1 year (Maytronics, US)",
      appSupport: "Wi-Fi + MyDolphin Plus — start, stop, schedule remotely",
    },
    notableFeatures: [
      "Wi-Fi + MyDolphin Plus app scheduling",
      "Two combined brushes for floor and wall scrubbing",
      "4,500 gph suction rate",
      "Anti-tangle 60 ft swivel cable",
      "Easy top-load cartridge filter access",
      "Weekly cleaning scheduler",
    ],
    pros: [
      "Proven Maytronics reliability and support",
      "Corded — no battery to recharge or degrade",
      "Climbs and cleans walls, not just the floor",
      "Simple top-load filter cleaning",
      "App control and scheduling",
    ],
    limitations: [
      "Floating cable can tangle in tight or odd-shaped pools",
      "Caddy and cable add storage and handling bulk",
      "Does not scrub the waterline — Maytronics states so explicitly",
      "Best suited to in-ground pools up to 40 ft only",
      "No above-ground rating",
      "1-year manufacturer warranty is short for the money",
    ],
    whoShouldBuy: "In-ground pool owners wanting a proven, low-maintenance corded robot with app scheduling.",
    whoShouldAvoid: "Anyone with an above-ground pool, or who wants a fully cordless, cable-free experience.",
    faqs: [
      { q: "Does the CC Plus Wi-Fi clean the waterline?", a: "No. Maytronics' own specification for part 99996409-PCI lists Cleaning Coverage as \"Floor and Walls\" and Waterline Scrubbing as \"No\". It climbs and scrubs walls, which is a different thing: the waterline is the tile band at the surface where the oily ring forms, and this machine is not rated to clean it." },
      { q: "Is it cordless?", a: "No, it is corded with a 60 ft anti-tangle swivel cable; there is no battery to charge." },
      { q: "How is it controlled?", a: "Via Wi-Fi and the MyDolphin Plus app, which lets you start, stop and schedule cycles remotely." },
    ],
    sources: [
      { label: "Maytronics official product page", url: "https://www.maytronics.com/en-us/store/residential-pools/best-performance-cleaners/dolphin-nautilus-cc-plus-w%2Fwi-fi/99996409-PCI.html" },
      { label: "Amazon US listing (CC Plus Wi-Fi)", url: "https://www.amazon.com/Dolphin-Nautilus-Robotic-Cleaner-Ground/dp/B09K4C9WGF" },
    ],
    evidence: "manufacturer_verified",
    confidence: "high",
    researchedDate: R,
  },

  /* This key held the Dolphin Premier until 3 August 2026, when the owner
     replaced the product with the BuBlue Bubot 800P Gen2 — a different
     manufacturer on the same stable record ID (prod-dolphin-premier, via
     PRODUCT_ID below). The Dolphin editorial was removed with the Dolphin:
     none of its figures describe this machine. Sources: bublue.com product
     page and the Amazon listing, both read 3–4 August 2026. */
  "bublue-bubot-800p": {
    slug: "bublue-bubot-800p",
    oneLiner: "Corded four-zone cleaner from a young brand: floor, walls, waterline and shallow areas with unlimited mains power and a stated 1-year warranty.",
    verdict:
      "The corded contrarian of the upper mid-range: while rivals chase batteries, the Bubot 800P Gen2 runs on mains power that never quits mid-clean, covers floor, walls, waterline and shallow areas, and publishes more real numbers than several bigger brands — 3,566 GPH, a 150 W motor, four brushes and 6 L of basket. BuBlue is a young brand with a short track record, and its shallow-area claim is avoidance of shallow zones, not cleaning them — but at ~$800 with a stated warranty, this is the strongest corded case in its class.",
    bestFor: "Mid-sized pools, corded reliability",
    priceRangeUsdApprox: [750, 800],
    specs: {
      poolSizeSuitability: "Pools up to ~1,076 sq ft; BuBlue's own FAQ emphasises above-ground, its materials list covers in-ground",
      cableLengthFt: null,
      runtimeMins: null,
      chargeTimeHrs: null,
      filtration: "Dual 3 L baskets (6 L total) with 180-micron ultra-fine filtration",
      navigation: "Ultrasonic sensors with planned paths and app path-width control (no camera)",
      weightLbs: null,
      warranty: "1-year, plus 30-day money-back guarantee",
      appSupport: "Yes — Bluetooth/Wi-Fi; modes, schedules, path width, car mode, waterline return",
    },
    notableFeatures: [
      "Corded — unlimited runtime, nothing to charge and no battery to age",
      "Cleans floor, walls, waterline and shallow areas, plus steps and platforms",
      "3,566 GPH suction from a 150 W three-axis motor, four roller brushes, two suction ports",
      "Dual 3 L filter baskets with 180-micron ultra-fine filtration",
      "App with scheduling, path-width control and a remote-control car mode",
    ],
    pros: [
      "Never runs out of battery mid-clean, and schedules never fail on an empty charge",
      "Publishes suction, wattage, brush and basket figures many bigger brands withhold",
      "Stated 1-year warranty with 30-day money-back and 24/7 support",
      "Path width and car mode are uncommon at this price",
      "TangleEase swivel management on the cable",
    ],
    limitations: [
      "It is still a cable — reach and tangle behaviour bound the pool it suits",
      "BuBlue is a young brand with a short track record",
      "'Shallow areas' means the sensors bypass shallow zones — cleaning them is not the claim",
      "Weight and confirmed cable length are not published",
      "Rated by area only (~1,076 sq ft) — no pool-length rating",
    ],
    whoShouldBuy: "Owners of pools up to ~1,076 sq ft who want every wet surface handled without owning a battery, from a brand that shows its numbers.",
    whoShouldAvoid: "Owners of larger pools, anyone who hates cables on principle, or buyers who want a decade-old brand behind the warranty.",
    faqs: [
      { q: "Is the Bubot 800P corded or cordless?", a: "Corded. It runs on mains power, so cycles never end early on a flat battery and there is nothing to recharge — but the cable has to reach, and BuBlue rates the machine by pool area (~1,076 sq ft), not length." },
      { q: "Does it clean shallow water?", a: "BuBlue's claim is that its smart sensors bypass shallow zones and obstacles — detection and avoidance, not cleaning. No minimum operating depth is published. If a shallow tanning ledge is your actual problem, the Aiper Scuba S1 puts a number on it." },
      { q: "Is it for above-ground or in-ground pools?", a: "BuBlue's FAQ calls it ideal for above-ground pools up to 1,076 sq ft, while listing vinyl, fibreglass and concrete — an in-ground materials list. It serves either; BuBlue's own emphasis is the above-ground case." },
    ],
    sources: [
      { label: "BuBlue product page", url: "https://www.bublue.com/products/bublue-bubot-800p" },
      { label: "Amazon US listing", url: "https://www.amazon.com/BUBLUE-Bubot-800P-Navigation-Scheduling/dp/B0GTYX922J" },
    ],
    evidence: "manufacturer_verified",
    confidence: "medium",
    researchedDate: R,
  },

  "polaris-freedom": {
    slug: "polaris-freedom",
    oneLiner: "Fully cordless lithium-ion robot for in-ground pools up to 50 ft with iAquaLink app control.",
    verdict:
      "The FREEDOM delivers genuine cable-free convenience with a ~2.5-hour runtime and app-based mode control, making it one of the more polished cordless in-ground robots. It is expensive versus corded rivals, and battery cleaners trade some suction and long-term battery lifespan for the no-tangle freedom. A strong pick if you value never dealing with a cord or floating cable again.",
    bestFor: "Cordless convenience, in-ground",
    priceRangeUsdApprox: [999, 1299],
    specs: {
      poolSizeSuitability: "In-ground pools up to 50 ft",
      cableLengthFt: null,
      runtimeMins: 150,
      chargeTimeHrs: 4,
      filtration: "Large easy-empty top-access filter canister",
      navigation: "Intelligent cleaning with app-optimized SMART Cycle",
      /* CORRECTED 2026-08-04, both of them, and both said so in the review.
         weightLbs was null on the finding that Polaris does not publish a
         weight. Polaris does: 20 lb (9.1 kg) in the owner's manual's own
         specification table. Nobody read far enough.
         warranty said "2-year limited". No Polaris source we can find states
         a term at all — the manual mentions a Limited Warranty inside an
         exclusion clause and never gives its length, and the support page and
         A+ panels give none. The figure is removed rather than left standing,
         because a warranty length is exactly the kind of number a buyer
         decides on. */
      weightLbs: 20,
      warranty: null,
      appSupport: "iAquaLink (Wi-Fi) — modes, battery status, cycle-complete alerts",
    },
    notableFeatures: [
      "Completely cordless lithium-ion (9,600 mAh) — no floating cable",
      "Easy-Charge contact dock (no plug to insert)",
      "Four modes: floor / floor-walls-waterline / waterline / SMART Cycle",
      "Double-helix brush system",
      "Climbs to the surface for easy retrieval",
    ],
    pros: [
      "No cord or floating cable to manage",
      "Up to ~2.5 hours of cleaning per charge",
      "Full-feature iAquaLink app",
      "Charges in about 4 hours via contact dock",
      "Cleans floor, walls and up to the waterline",
    ],
    limitations: [
      "Premium price versus comparable corded robots",
      "Battery packs degrade over years — future replacement cost",
      "In-ground pools only (not rated above-ground)",
      "Manufacturer does not publish a weight for the standard FREEDOM",
      "Some retailer listings dispute the extent of true waterline scrubbing",
    ],
    whoShouldBuy: "In-ground pool owners who want a premium, truly cordless robot with app control and will pay extra to eliminate cable hassle.",
    whoShouldAvoid: "Budget shoppers, above-ground pool owners, and anyone who prefers a corded robot's uninterrupted power and longer service life.",
    faqs: [
      { q: "Is the Polaris FREEDOM really cordless?", a: "Yes. It runs on an internal lithium-ion battery and charges on a contact dock, so there is no power cable in the water." },
      { q: "How long does it clean per charge?", a: "Up to about 2.5 hours, and it recharges in roughly 4 hours." },
      { q: "Does it work in above-ground pools?", a: "No. It is rated for in-ground pools up to 50 ft in length." },
    ],
    sources: [
      { label: "Polaris (Pentair/Fluidra) product page", url: "https://www.polarispool.com/en/products/pool-cleaners/robotic-pool-cleaners/polaris-freedom" },
      { label: "Amazon US listing", url: "https://www.amazon.com/Polaris-Cordless-Cable-Free-Intelligent-Technology/dp/B0BX9DJS7R" },
    ],
    evidence: "manufacturer_verified",
    confidence: "medium",
    researchedDate: R,
  },

  "betta-se-plus": {
    slug: "betta-se-plus",
    oneLiner: "Solar-powered robotic skimmer that floats and removes leaves, bugs and debris from the water surface.",
    verdict:
      "The Betta SE Plus is a surface skimmer, not a floor/wall cleaner: it floats on the water and continuously collects floating debris using solar power, so it never touches the pool bottom. Its upgrade over the base SE is dual charging (solar plus a wall adapter) and a shallow-water safeguard, giving true set-and-forget operation. Excellent to keep the surface clear, but it does nothing for dirt, silt or algae on the floor and walls.",
    bestFor: "Hands-free surface debris",
    priceRangeUsdApprox: [380, 450],
    specs: {
      poolSizeSuitability: "Above-ground & in-ground; ideal coverage up to ~40×60 ft",
      cableLengthFt: null,
      runtimeMins: 1800,
      chargeTimeHrs: 3.5,
      filtration: "Large top-handle basket, fine mesh (~200 micron)",
      navigation: "Ultrasonic radar obstacle detection + shallow-water safeguard",
      weightLbs: 15,
      warranty: "1-year",
      appSupport: "No app — wireless remote or fully automatic",
    },
    notableFeatures: [
      "Solar-powered with dual charging (solar + wall adapter)",
      "Up to ~30 hours of stored runtime for continuous skimming",
      "Twin salt-chlorine-tolerant motors (fresh or saltwater)",
      "Shallow-water safeguard steers away from steps",
      "Ultrasonic radar obstacle avoidance",
    ],
    pros: [
      "Fully hands-free surface cleaning powered by the sun",
      "Adapter charging (~3.5 hrs) as a fast backup to solar",
      "Saltwater-safe twin motors, UV-resistant cover",
      "Reduces skimmer-basket load and surface buildup",
      "Works in above-ground and in-ground pools",
    ],
    limitations: [
      "Surface skimmer only — does NOT clean floor, walls or waterline",
      "Not a replacement for a floor-scrubbing robot",
      "Only a 1-year warranty",
      "No smartphone app (remote or automatic only)",
      "Needs adequate sun and a minimum water depth for best performance",
    ],
    whoShouldBuy: "Owners with heavy leaf, pollen or insect fall who want an automated way to keep the water surface clear without lifting a net.",
    whoShouldAvoid: "Anyone expecting it to clean the pool floor, walls or waterline — it strictly skims floating debris.",
    faqs: [
      { q: "Does the Betta SE Plus clean the pool floor?", a: "No. It floats on the surface and only skims floating debris; it never cleans the floor or walls." },
      { q: "How is it powered?", a: "By a built-in solar panel, with an included wall adapter for faster or supplemental charging." },
      { q: "Will it work in a saltwater pool?", a: "Yes. Its twin motors are designed to tolerate both freshwater and saltwater." },
    ],
    sources: [
      { label: "Betta (Solar Pool Technologies) product page", url: "https://bettabot.com/products/betta-se" },
      { label: "Amazon US listing", url: "https://www.amazon.com/Betta-SE-Plus-Continuous-Safeguard/dp/B0CVMQ3XBX" },
    ],
    evidence: "manufacturer_verified",
    confidence: "high",
    researchedDate: R,
  },

  /* Added 4 August 2026, same day as its review. Like the Proteus, it had a
     D1 row and a live page before the repo knew it existed. Aiper's own page
     and the Amazon listing were both read on the day of writing, so unlike
     the Proteus this record has a manufacturer source. */
  "aiper-scuba-v3-ai-vision": {
    slug: "aiper-scuba-v3-ai-vision",
    oneLiner:
      "Camera-guided cordless cleaner that recognises debris and steers at it, covering floor, walls and waterline.",
    verdict:
      "The first robot in the catalogue that looks at the pool: a front camera with a 2 m detection range recognises twenty-plus debris types and plans routes toward what it sees, with night lights for after dark. Cordless, 18.1 lb — the lightest full cleaner here — with a wireless dock, waterline parking with app alerts, and a 3 micron fine filter layer that is the finest published rating we list. The headline 10x figure is Aiper's own benchmark, and neither a maximum pool length nor a warranty term is published.",
    bestFor: "Camera-guided cleaning of pools that collect real debris",
    priceRangeUsdApprox: [800, 900],
    specs: {
      poolSizeSuitability: "In-ground pools; Aiper states an area (~1,614 sq ft researched), no length",
      cableLengthFt: null,
      runtimeMins: 180,
      chargeTimeHrs: 5,
      filtration: "Multi-layer basket: 180 micron debris mesh + 3 micron fine layer",
      navigation: "Front camera, 2 m / 6.6 ft detection range, 20+ debris types, night lights",
      weightLbs: 18.1,
      warranty: "Not stated — Aiper has a warranty process but publishes no term for this machine",
      appSupport: "Aiper app — AI Navium weekly plans, mode selection, waterline-ready alerts",
    },
    notableFeatures: [
      "Debris-recognising camera with 2 m detection range",
      "AI Navium mode: one charge budgeted across a week of short cleans",
      "3 micron fine filtration layer — the finest published figure in the catalogue",
      "18.1 lb, wireless charging dock, waterline parking with app alert",
      "Night cleaning by onboard lights",
    ],
    pros: [
      "Goes to visible debris instead of sweeping blind",
      "Lightest full cleaner in the catalogue",
      "Waterline coverage on a cordless machine at this price",
      "Aiper publishes more numbers than most rivals, including a micron rating",
    ],
    limitations: [
      "No maximum pool length published — an area only",
      "Warranty term not published",
      "The 10x cleaning-speed figure is Aiper's own unnamed-baseline benchmark",
      "What the camera records and retains is not spelled out beyond a TUV certification claim",
      "Runtime and charge time are researched figures, not re-read from Aiper's page",
    ],
    whoShouldBuy:
      "Owners of in-ground pools that collect leaves, sand and twigs, who want the robot to see the mess and go to it with the lightest daily routine available.",
    whoShouldAvoid:
      "Above-ground pool owners, anyone needing a stated length rating or warranty term, or anyone uncomfortable putting a camera in the water.",
    faqs: [
      {
        q: "What does \"7 days on one charge\" mean on the Aiper Scuba V3?",
        a: "Not 168 hours of runtime. AI Navium mode plans a week of short autonomous cleans sized to your pool and spreads them across seven days, so one charge covers the week. Continuous runtime is roughly 180 minutes per owner research.",
      },
      {
        q: "Is the Scuba V3 the same as the Scuba V3 AI Vision?",
        a: "Yes. Aiper's own site titles it 'Scuba V3 Cognitive AI' and Amazon sells it as 'AI Vision' — the model in Amazon's details table is simply Aiper Scuba V3. The Gray and Blue ASINs are colour variants of the same machine.",
      },
      {
        q: "Does it clean the waterline?",
        a: "Yes — floor, walls and waterline, per both Aiper's page and the listing, with 4,800 GPH of suction through dual brushes.",
      },
    ],
    sources: [
      { label: "Aiper Scuba V3 product page (titled 'Scuba V3 Cognitive AI')", url: "https://aiper.com/us/aiper-scuba-v3" },
      { label: "Amazon US listing (B0GG97427D, Gray)", url: "https://www.amazon.com/dp/B0GG97427D" },
    ],
    evidence: "manufacturer_verified",
    confidence: "medium",
    researchedDate: "2026-08-04",
  },

  /* Added 4 August 2026. The row already existed in D1 and the page already
     rendered; the repo simply did not know about it, which the internal-link
     test caught. Every figure here is RETAILER-sourced — no Maytronics product
     page for this model has been found — and the fields nobody publishes are
     null rather than borrowed from the Proteus DX4, which is a different
     machine rated to 50 ft. */
  "dolphin-proteus-dx4-plus": {
    slug: "dolphin-proteus-dx4-plus",
    oneLiner:
      "Corded Maytronics cleaner for in-ground pools up to 33 ft, covering floor, walls, steps and sun ledges.",
    verdict:
      "A mid-range corded Dolphin that climbs walls and handles the shapes cheaper robots skip — steps and sun ledges — with a top-load filter that makes weekly maintenance a lid rather than a wrestle. Two cautions. It is rated to 33 ft, not the 50 ft of the plain Proteus DX4 it shares a product page with. And its waterline claim comes from Maytronics' sales listing rather than a technical sheet, on a range where we have already found those two disagreeing.",
    bestFor: "Corded whole-surface cleaning on a smaller in-ground pool",
    priceRangeUsdApprox: [850, 950],
    specs: {
      poolSizeSuitability: "In-ground pools up to 33 ft",
      cableLengthFt: null,
      runtimeMins: null,
      chargeTimeHrs: null,
      filtration: "Top-load cartridge filter; no micron rating published",
      navigation: "Smart navigation (Maytronics' own name for it is not given on the listing)",
      weightLbs: 18.5,
      // Not "unknown" — checked and not published. The listing states no term.
      warranty: "Not stated on the listing; no Maytronics page found for this model",
      appSupport: "None mentioned on the listing",
    },
    notableFeatures: [
      "Wall climbing on tracks rather than wheels",
      "Steps and sun ledges named explicitly by the manufacturer",
      "Top-load filter access",
      "Corded — no battery to degrade and no runtime limit",
    ],
    pros: [
      "Covers floor, walls, steps and ledges from one corded machine",
      "Top-load filter is emptied at the poolside rather than upside down",
      "No battery, so nothing wears out on a calendar",
      "Maytronics is the most established brand in the category",
    ],
    limitations: [
      "Rated to 33 ft — a third less pool than the similarly named Proteus DX4",
      "Waterline scrubbing is claimed on the listing and contradicted by the listing's own title",
      "No Maytronics product page or technical sheet has been found for this model",
      "No cycle time, cable length, micron rating or warranty term published",
      "No caddy in this configuration",
    ],
    whoShouldBuy:
      "Owners of in-ground pools under 33 ft with steps or a sun ledge who want every surface handled by one corded machine.",
    whoShouldAvoid:
      "Anyone with a pool longer than 33 ft, an above-ground pool, or whose single reason for buying is waterline scrubbing.",
    faqs: [
      {
        q: "What size pool is the Proteus DX4 Plus for?",
        a: "In-ground pools up to 33 ft. The plain Proteus DX4 is rated to 50 ft and is sold from the same Amazon product page, so check the title of the listing you are buying.",
      },
      {
        q: "Does the Dolphin Proteus DX4 Plus clean the waterline?",
        a: "Maytronics' listing bullet says it scrubs the floor, walls, waterline, steps and sun ledges. The same listing's title says 'Wall & Sun-ledge Scrubbing' and does not mention the waterline. No Maytronics technical sheet for this model has been found, and on the Nautilus CC Plus the marketing and the spec sheet disagree on exactly this feature — so we report the claim and flag that it is uncorroborated.",
      },
      {
        q: "How heavy is it?",
        a: "18.5 lb dry, per the listing's details table. It comes out of the water heavier than that.",
      },
    ],
    sources: [
      {
        label: "Amazon US listing (B083YWJ5PQ) — Dolphin Proteus DX4 Plus",
        url: "https://www.amazon.com/dp/B083YWJ5PQ",
      },
    ],
    /* NOT manufacturer_verified, deliberately. Every figure came from the
       retail listing because no Maytronics page for this model has been found,
       and the label has to say so. */
    evidence: "researched",
    confidence: "medium",
    researchedDate: "2026-08-04",
  },

  "dolphin-e10": {
    slug: "dolphin-e10",
    oneLiner: "Affordable corded robotic cleaner built for above-ground pools up to 30 ft, cleaning the floor in ~1.5 hrs.",
    verdict:
      "Maytronics' entry-level workhorse for above-ground pools offers reliable floor cleaning and an active scrubbing brush at a budget-friendly price. It is a simple plug-in device with no app, no remote and no wall climbing, focusing purely on the floor in a quick 1.5-hour cycle. For a small above-ground pool it is one of the best value robots available, but larger or in-ground pool owners should look elsewhere.",
    bestFor: "Budget above-ground floor cleaning",
    priceRangeUsdApprox: [449, 599],
    specs: {
      poolSizeSuitability: "Above-ground pools up to 30 ft",
      cableLengthFt: 40,
      runtimeMins: 90,
      chargeTimeHrs: null,
      filtration: "Top-load fine/ultra-fine cartridge filter basket",
      navigation: "CleverClean smart scanning",
      weightLbs: 14,
      warranty: "2-year (24-month) limited",
      appSupport: "None — no app or remote",
    },
    notableFeatures: [
      "CleverClean smart navigation",
      "Active scrubbing brush lifts dirt and algae",
      "Quick 1.5-hour cleaning cycle",
      "Top-load easy-access filter basket",
      "Plug-and-play, no pre-installation",
    ],
    pros: [
      "Low price point for a Maytronics robot",
      "Lightweight (~14 lbs) and easy to handle",
      "Fast 90-minute cleaning cycle",
      "Simple, reliable corded operation",
      "Strong suction with active brushing",
    ],
    limitations: [
      "Cleans the floor only — no wall or waterline climbing",
      "Above-ground pools only, up to ~30 ft",
      "No app, remote or scheduling",
      "No anti-tangle swivel on the cable",
      "40 ft cable limits reach on larger pools",
    ],
    whoShouldBuy: "Owners of small-to-medium above-ground pools who want dependable, no-frills floor cleaning at the lowest Dolphin price.",
    whoShouldAvoid: "In-ground pool owners, or anyone needing wall/waterline cleaning, app control, or coverage of pools longer than 30 ft.",
    faqs: [
      { q: "Does the Dolphin E10 climb walls?", a: "No. It is designed to clean the pool floor only and does not climb walls or the waterline." },
      { q: "What size pool is it for?", a: "Above-ground pools up to about 30 ft in length." },
      { q: "Does it have an app or remote?", a: "No. It is a simple plug-in robot with no app, remote or timer." },
    ],
    sources: [
      { label: "Maytronics Dolphin E10 product page", url: "https://www.maytronics.com/global/store/residential-pools/best-value-cleaners/dolphin-e10/99996133.html" },
      { label: "Leslie's Pool Supplies listing", url: "https://lesliespool.com/dolphin-e10-above-robotic-ground-pool-cleaner/368626.html" },
    ],
    evidence: "manufacturer_verified",
    confidence: "high",
    researchedDate: R,
  },

  "beatbot-aquasense-2-ultra": {
    slug: "beatbot-aquasense-2-ultra",
    oneLiner: "Premium AI-mapping cordless robot that also skims the water surface for large in-ground pools.",
    verdict:
      "The most capable — and most expensive — consumer pool robot, adding true water-surface skimming and AI camera navigation to full floor/wall/waterline cleaning. It cleans thoroughly and its app is genuinely useful, but at $2,000+ it only makes sense for owners of large, high-value in-ground pools. For most people it is overkill.",
    bestFor: "Large premium in-ground pools",
    priceRangeUsdApprox: [2299, 3150],
    specs: {
      poolSizeSuitability: "In-ground up to ~3,875 sq ft cleaning area per cycle",
      cableLengthFt: null,
      runtimeMins: 300,
      chargeTimeHrs: 4.5,
      filtration: "Dual-layer ultra-fine basket (mfr claims ~150 micron)",
      navigation: "HybridSense AI mapping (camera + TOF/IR/ultrasonic) + CleverNav",
      weightLbs: 29,
      warranty: "3-year full replacement",
      appSupport: "Yes — remote, scheduling, water-temp, alerts, one-click parking",
    },
    notableFeatures: [
      "5-in-1 cleaning including dedicated water-surface skimming",
      "HybridSense AI camera + multi-sensor mapping for shaped pools",
      "Auto surface self-parking with app notification",
      "Large 13,400 mAh battery (~10 hrs surface, ~5 hrs floor)",
      "Wireless charging dock",
    ],
    pros: [
      "Only mainstream robot that also skims the water surface",
      "Near-complete coverage on floor, walls and waterline",
      "Strong app with mapping, scheduling and alerts",
      "Best-in-class 3-year warranty",
    ],
    limitations: [
      "Very expensive (~$2,300 on sale, up to ~$3,150 list)",
      "Heavy at ~29 lbs dry (more when water-laden)",
      "Marketed for in-ground; not an above-ground value pick",
      "Fine-filtration micron rating not clearly published",
    ],
    whoShouldBuy: "Owners of large, premium in-ground pools who want one device for floor, walls, waterline and floating surface debris — and will pay for it.",
    whoShouldAvoid: "Budget shoppers, small above-ground pool owners, or anyone who does not need water-surface skimming.",
    faqs: [
      { q: "Does it really skim the water surface?", a: "Yes. It has a dedicated surface mode that collects floating debris like leaves and pollen, running up to about 10 hours. This is the main feature separating it from most competitors." },
      { q: "How long does it run per charge?", a: "Roughly 5 hours on floors and about 5 hours on walls/waterline, or up to ~10 hours in the lower-draw surface mode, then it self-parks at the surface." },
      { q: "Is it worth the price over cheaper Aiper models?", a: "Only if you want AI mapping, waterline and water-surface cleaning and have a large in-ground pool. For a small or flat pool, a much cheaper robot does the core job." },
    ],
    sources: [
      { label: "Beatbot spec page", url: "https://beatbot.com/pages/aquasense-2-ultra" },
      // Replaced 4 August 2026 — the previous source cited B0DMN6NV6H, the
      // listing retired from the destination register on 3 August.
      { label: "Amazon US listing", url: "https://www.amazon.com/Beatbot-AquaSense-Ultra-Cordless-Clarification/dp/B0G7B6F5FZ" },
    ],
    evidence: "manufacturer_verified",
    confidence: "high",
    researchedDate: R,
  },

  /* RENAMED 4 August 2026, "aiper-scuba-x1" -> "aiper-scuba-x1-pro-max". This
     file is keyed by the D1 product slug and the D1 slug has been
     aiper-scuba-x1-pro-max since the record moved up the range; the old key
     meant the editorial layer silently failed to join on the live page. The
     old URL still 301s via product-names.ts. */
  "aiper-scuba-x1-pro-max": {
    slug: "aiper-scuba-x1-pro-max",
    oneLiner: "Cordless in-ground robot with 6,600 GPH suction and smart navigation for medium-to-large pools.",
    verdict:
      "Aiper's mainstream in-ground cleaner pairs strong 6,600 GPH suction with WavePath 3.0 navigation and 3-hour runtime to cover floor, walls and waterline — a solid mid-range choice well below Beatbot money. Note Aiper now positions the base unit as the 'Scuba X1 Essential' within a wider X1 / X1 Pro / X1 Pro Max lineup, so confirm exactly which model a listing sells.",
    bestFor: "Medium-large in-ground pools",
    priceRangeUsdApprox: [899, 1299],
    specs: {
      poolSizeSuitability: "In-ground up to ~2,150 sq ft / 66 ft length",
      cableLengthFt: null,
      runtimeMins: 180,
      chargeTimeHrs: 4,
      filtration: "Filter basket + 3-micron MicroMesh ultra-fine filter",
      navigation: "WavePath 3.0 cross-pattern, ~14 sensors, obstacle avoidance",
      weightLbs: null,
      warranty: "2-year limited",
      appSupport: "Yes — modes, smart retrieval, underwater app link",
    },
    notableFeatures: [
      "6,600 GPH dual-jet suction with dual rollers",
      "WavePath 3.0 cross-pattern navigation with obstacle avoidance",
      "Up to 180-minute runtime, 4-hour recharge",
      "3-micron MicroMesh filtration, 5 L debris capacity",
      "Charging dock + smart retrieval to the waterline",
    ],
    pros: [
      "Strong suction handles heavier debris on large pools",
      "Covers floor, walls and waterline",
      "Long 3-hour runtime for its class",
      "Fine 3-micron filtration option",
    ],
    limitations: [
      "Marketed for in-ground pools, not above-ground",
      "Base model naming is confusing (Essential vs Pro vs Pro Max)",
      "Base-unit weight and exact street price vary by listing",
      "App connectivity has drawn some reviewer complaints in the X1 family",
    ],
    whoShouldBuy: "Owners of medium-to-large in-ground pools wanting strong suction and full floor/wall/waterline cleaning without flagship prices.",
    whoShouldAvoid: "Above-ground pool owners, or anyone wanting AI mapping or water-surface skimming.",
    faqs: [
      { q: "What size pool is the Scuba X1 rated for?", a: "Aiper rates it for in-ground pools up to about 2,150 sq ft or 66 ft in length on a single charge. Larger pools may need a second cycle." },
      { q: "Is the Scuba X1 the same as the X1 Pro or Pro Max?", a: "No. The base Scuba X1 (often labelled 'Essential') sits below the X1 Pro and X1 Pro Max, which add more advanced mapping and higher runtimes. Check the exact model before buying." },
      { q: "Does it clean walls and the waterline?", a: "Yes. It climbs walls and does horizontal waterline scrubbing in addition to the floor, though performance varies by mode and pool surface." },
    ],
    sources: [
      { label: "Aiper spec page", url: "https://aiper.com/us/aiper-scuba-series/aiper-scuba-x1" },
      { label: "Amazon US listing", url: "https://www.amazon.com/AIPER-High-Power-Horizontal-Waterline-Scrubbing/dp/B0F9WN961G" },
    ],
    evidence: "manufacturer_verified",
    confidence: "medium",
    researchedDate: R,
  },

  "aiper-scuba-s1": {
    slug: "aiper-scuba-s1",
    oneLiner: "Mid-priced cordless robot for smaller in-ground and above-ground pools; cleans floor, walls and waterline.",
    verdict:
      "Aiper's value all-surface cleaner for pools up to ~1,600 sq ft, with 4,200 GPH suction, 3-micron filtration and app support. A reasonable pick for smaller pools, but independent testers report real-world battery life and navigation falling short of the marketing, so set expectations accordingly. Good value on sale, not a flagship performer.",
    bestFor: "Smaller in/above-ground pools",
    priceRangeUsdApprox: [530, 700],
    specs: {
      poolSizeSuitability: "In-ground & above-ground up to ~1,600 sq ft",
      cableLengthFt: null,
      runtimeMins: 180,
      chargeTimeHrs: 3.5,
      filtration: "180-micron basket + 3-micron MicroMesh ultra-fine filter",
      navigation: "WavePath 2.0 (inertial/acceleration path planning)",
      weightLbs: 16,
      warranty: "2-year limited",
      appSupport: "Yes — modes, cleaning history, OTA updates",
    },
    notableFeatures: [
      "Cleans floor, walls and waterline with wall-climbing treads",
      "4,200 GPH suction, dual drive + brushless filtration motors",
      "Dual filtration: 180-micron basket + 3-micron mesh",
      "App with modes, history and OTA updates",
      "Works in in-ground and above-ground pools",
    ],
    pros: [
      "Handles both in-ground and above-ground pools",
      "Fine 3-micron filtration for the price class",
      "Lightweight at ~16 lbs",
      "Frequently discounted to ~$530",
    ],
    limitations: [
      "Independent testers report real runtime well under the rated 180 min",
      "Navigation is basic and can be inconsistent vs mapped competitors",
      "Struggles on steep slopes/inclines per reviews",
      "No automatic self-return/parking; manual retrieval",
      "Rated runtime differs across model years (150/180/270 min)",
    ],
    whoShouldBuy: "Owners of smaller in-ground or above-ground pools who want floor, wall and waterline cleaning on a modest budget.",
    whoShouldAvoid: "Owners of large or heavily-sloped pools, or anyone expecting flagship-level battery life and navigation.",
    faqs: [
      { q: "How long does the Scuba S1 actually run?", a: "Aiper lists up to 180 minutes and some 2026 listings claim 270, but independent reviews measured far less — sometimes under an hour. Treat the headline runtime as optimistic." },
      { q: "Can it clean an above-ground pool?", a: "Yes. Unlike the Scuba X1, the S1 is rated for both in-ground and above-ground pools up to about 1,600 sq ft, including walls and the waterline." },
      { q: "Does it return to the edge automatically?", a: "No. The S1 lacks automatic self-parking, so you retrieve it manually with the included hook when the cycle or battery ends." },
    ],
    sources: [
      { label: "Aiper spec page", url: "https://aiper.com/us/aiper-scuba-series/aiper-scuba-s1" },
      { label: "PoolBots hands-on review", url: "https://www.poolbots.com/reviews/aiper-scuba-s1" },
    ],
    evidence: "manufacturer_verified",
    confidence: "medium",
    researchedDate: R,
  },

  "aiper-seagull-se": {
    slug: "aiper-seagull-se",
    oneLiner: "Budget cordless floor-only vacuum for small, flat above-ground pools.",
    verdict:
      "An entry-level, floor-only cordless cleaner for small flat above-ground pools. Cheap, light and simple, with no app, no wall climbing and only a basic mesh filter. Fine as an inexpensive floor vacuum for a small flat pool, but it is not a full-surface cleaner and struggles with slopes or fine debris.",
    bestFor: "Small flat above-ground pools",
    priceRangeUsdApprox: [199, 300],
    specs: {
      poolSizeSuitability: "Flat above-ground up to ~40 ft (round to ~33 ft); flat-floored in-ground",
      cableLengthFt: null,
      runtimeMins: 90,
      chargeTimeHrs: 2.5,
      filtration: "Basic flat mesh filter basket (no fine micron rating)",
      navigation: "Random path with self-parking (no smart mapping)",
      weightLbs: null,
      warranty: "1-year limited",
      appSupport: "None",
    },
    notableFeatures: [
      "1,200 GPH suction, dual-drive motors and two brushes",
      "Up to 90-minute runtime, ~2.5-hour recharge",
      "Self-parks near the wall on low battery",
      "One-button operation, no app needed",
      "Lightweight, low-cost entry point",
    ],
    pros: [
      "Very affordable (often ~$200-250)",
      "Simple one-button use, no app required",
      "Lightweight and easy to lift out",
      "Self-parks for retrieval",
    ],
    limitations: [
      "Floor only — does not climb walls or clean the waterline",
      "Needs a flat pool floor; struggles on any slope",
      "Basic mesh filter misses fine debris like sand and algae",
      "Only a 1-year warranty; users report slow claims",
      "No smart navigation or app; coverage is random",
    ],
    whoShouldBuy: "Owners of small, flat-bottomed above-ground pools who want a cheap, no-fuss floor vacuum.",
    whoShouldAvoid: "Anyone with a sloped in-ground pool, or who needs wall/waterline cleaning or fine filtration.",
    faqs: [
      { q: "Does the Seagull SE climb walls?", a: "No. It cleans the pool floor only and cannot climb walls or clean the waterline. For that, step up to a model like the Scuba S1." },
      { q: "What pool size and shape does it suit?", a: "Flat-floored pools — above-ground up to about 40 ft (or round up to ~33 ft). It performs poorly on any sloped or contoured surface." },
      { q: "Is there an app?", a: "No. It is a one-button device with no app or smart mapping. It runs a random pattern and self-parks near the wall when the battery runs low." },
    ],
    sources: [
      { label: "Aiper product page", url: "https://aiper.com/us/aiper-seagull-series/aiper-seagull-se-new" },
      { label: "PCWorld review", url: "https://www.pcworld.com/article/1370644/aiper-seagull-se-robotic-pool-cleaner-review.html" },
    ],
    evidence: "researched",
    confidence: "medium",
    researchedDate: R,
  },
};

/**
 * Stable canonical product IDs — the SINGLE source of the editorial↔D1 join.
 * These MUST match D1 `products.id` exactly (see packages/db/seed/pool/catalogue.ts).
 * The slug is only a route identifier and may change; the productId must not.
 */
/* @extension-point per-product | required | Four records in this file are keyed
   by product slug: PRODUCT_ID, PRODUCTS (the editorial copy), CATALOGUE_STATUS
   and CATALOGUE_WITHDRAWALS. Without a PRODUCTS entry the product has no
   editorial voice at all — no summary, no who-it-is-for, no rule-outs — and
   the card falls back to bare catalogue fields. */
export const PRODUCT_ID: Record<string, string> = {
  "beatbot-aquasense-2-ultra": "prod-beatbot-aquasense-2-ultra",
  "aiper-scuba-x1-pro-max": "prod-aiper-scuba-x1",
  "aiper-scuba-s1": "prod-aiper-scuba-s1",
  "aiper-seagull-se": "prod-aiper-seagull-se",
  "wybot-c1": "prod-wybot-c1",
  "dolphin-nautilus-cc-plus": "prod-dolphin-nautilus-cc-plus",
  // Renamed from "dolphin-premier" on 4 August 2026 — the record's D1 slug
  // changed with the product it holds. The ID is the stable join key and stays.
  "bublue-bubot-800p": "prod-dolphin-premier",
  "polaris-freedom": "prod-polaris-freedom",
  "betta-se-plus": "prod-betta-se-plus",
  "aiper-ecosurfer-s2": "prod-aiper-ecosurfer-s2",
  "beatbot-iskim": "prod-beatbot-iskim",
  "brinbo-sk01": "prod-brinbo-sk01",
  "dolphin-e10": "prod-dolphin-e10",
  "dolphin-proteus-dx4-plus": "prod-dolphin-proteus-dx4-plus",
  "aiper-scuba-v3-ai-vision": "prod-aiper-scuba-v3-ai-vision",

  /* WINDOW-CLEANING ROBOTS. Added 6 August 2026 with the review set.

     These eleven have been published in D1 since 5 August with verified
     manufacturer specifications, and the repo did not know they existed —
     every map in this file was pool-only. The visible symptom was that the
     internal-link anchor test could not confirm a window product was active,
     because as far as the repo was concerned there was no such product.

     Slug-to-ID only, deliberately. The editorial copy for these lives in
     content/reviews.ts and src/reviews/*.md, which is where the window
     category was built; PRODUCTS below is pool-era editorial that predates
     the review template and is not worth duplicating for a second category. */
  "ecovacs-winbot-w2-pro-omni": "prod-ecovacs-winbot-w2-pro-omni",
  "ecovacs-winbot-w3-omni": "prod-ecovacs-winbot-w3-omni",
  "ecovacs-winbot-w2-pro": "prod-ecovacs-winbot-w2-pro",
  "ecovacs-winbot-w2s": "prod-ecovacs-winbot-w2s",
  "ecovacs-winbot-w1-pro": "prod-ecovacs-winbot-w1-pro",
  "ecovacs-winbot-mini": "prod-ecovacs-winbot-mini",
  "hutt-s55-pro": "prod-hutt-s55-pro",
  "mamibot-w120-dp": "prod-mamibot-w120-dp",
  "hobot-2s": "prod-hobot-2s",
  "hobot-298": "prod-hobot-298",
  "cop-rose-x5s": "prod-cop-rose-x5s",

  /* COMPANION ROBOTS. Added 8 August 2026 with the first review in the
     category. Slug-to-ID only, as with window above: the editorial lives in
     content/reviews.ts and src/reviews/*.md. */
  "moflin": "prod-moflin",
  "miko-3": "prod-miko-3",
  "vector-2": "prod-vector-2",
  "eilik": "prod-eilik",
  "loona": "prod-loona",
  "joy-for-all-companion-pets": "prod-joy-for-all-companion-pets",
  "ropet": "prod-ropet",

  /* PET CAMERA ROBOTS. Added 8 August 2026. */
  "enabot-ebo-air-2": "prod-enabot-ebo-air-2",
  "enabot-ebo-se": "prod-enabot-ebo-se",
  "enabot-rola-petpal": "prod-enabot-rola-petpal",

  /* EDUCATIONAL AND CODING ROBOTS. Added 8 August 2026 — the five of twelve
     whose listings survived a read. */
  "sphero-bolt": "prod-sphero-bolt",
  "sphero-mini": "prod-sphero-mini",
  "sphero-indi": "prod-sphero-indi",
  "ozobot-evo": "prod-ozobot-evo",
  "makeblock-mbot": "prod-makeblock-mbot",
  /* Added 26 September 2026 — the two of the seven remaining that Christmas
     seasonality research justified re-checking, per
     docs/seo/coding-robots-gift-topup-findings.md. */
  "botley-the-coding-robot": "prod-botley-2",
  "code-and-go-robot-mouse": "prod-code-and-go-robot-mouse",
  /* Rule-out reviews. Real D1 rows and real pages, so they belong in the join
     map like anything else — what they do not have is an offer, and that is
     declared in NO_OFFER_BY_DESIGN below rather than by being left out here.

     EMO JOINED THEM ON 8 AUGUST 2026. It had been absent from this map since
     it shipped, which is how its page passed the catalogue tests: not by
     declaring that we refuse the sale, but by not being visible to the check
     at all. That is the same outcome reached two different ways, and only one
     of them survives somebody reading the file in six months. */
  "living-ai-emo": "prod-living-ai-emo",
  "cozmo": "prod-cozmo",
  /* Grillbot, added 10 August 2026 with the first grill-cleaning product. It
     is OFFER_SETUP_PENDING — identity verified, no commercial wiring — and it
     is in this map so it cannot be a SILENT exclusion: a review page must
     resolve to a slug here and then be sellable or refused in writing, which
     is the rule EMO's missing buy button taught. */
  "grillbot": "prod-grillbot",
  "moxie": "prod-moxie",

  /* First products for litter boxes and lawn mowers, 8 August 2026. All ten
     are OFFER_SETUP_PENDING: verified, published, not yet wired to sell. The
     verification record — including the three the brief named wrongly and the
     one refused outright — is docs/seo/litter-lawn-verification-2026-08-08.md. */
  "litter-robot-4": "prod-litter-robot-4",
  "petkit-purobot-max-pro-2": "prod-petkit-purobot-max-pro-2",
  "casa-leo-loo-too": "prod-casa-leo-loo-too",
  "petsafe-scoopfree-crystal-pro": "prod-petsafe-scoopfree-crystal-pro",
  "segway-navimow-i110n": "prod-navimow-i110n",
  "mammotion-luba-3-awd-1500h": "prod-luba-3-awd-1500h",
  "mammotion-luba-3-awd-3000h": "prod-luba-3-awd-3000h",
  "husqvarna-automower-410iq": "prod-automower-410iq",
  "worx-landroid-vision-wr320": "prod-worx-landroid-vision-wr320",
  "eufy-e15": "prod-eufy-e15",
  /* Refused on 8 August as "Dreame A1", which does not exist; verified and
     admitted the same day under its real name. See migration 0010. */
  "dreame-a3-awd-1000": "prod-dreame-a3-awd-1000",

  /* ROBOT VACUUMS, added 10 August 2026. The category with the most search
     demand on the site and, until migration 0013, no catalogue at all.

     TWO SLUGS DO NOT MATCH THE TERM THEY WERE PLANNED UNDER, and that is
     deliberate rather than a typo. `roborock-s8-max-ultra` was planned as the
     S8 MaxV Ultra, which has no first-party listing on Amazon US — every
     result carrying that string is a third-party accessory kit — so the
     product is built under the name the machine actually has. And
     `eufy-omni-s1-pro` is the eufy S1 Pro of the plan, listed under eufy's own
     "Omni S1 Pro" title. The full record is
     docs/commerce/robot-vacuums-identity.md.

     All eleven are OFFER_SETUP_PENDING: verified, published, not yet wired to
     sell. */
  "eufy-x10-pro-omni": "prod-eufy-x10-pro-omni",
  "eufy-omni-s1-pro": "prod-eufy-omni-s1-pro",
  "roborock-s8-max-ultra": "prod-roborock-s8-max-ultra",
  "roborock-saros-10": "prod-roborock-saros-10",
  "roborock-qrevo-s5v": "prod-roborock-qrevo-s5v",
  "dreame-x40-ultra": "prod-dreame-x40-ultra",
  "dreame-x50-ultra": "prod-dreame-x50-ultra",
  "ecovacs-deebot-t90-pro-omni": "prod-ecovacs-deebot-t90-pro-omni",
  "shark-powerdetect-av2820s": "prod-shark-powerdetect-av2820s",
  "shark-matrix-plus-ur2650ws": "prod-shark-matrix-plus-ur2650ws",
  "roomba-max-705": "prod-roomba-max-705",

  /* ROBOT SNOW BLOWER, added 11 August 2026. One product, one manufacturer, and
     a HIDDEN category rather than a real one — see nav.ts and migration 0017.
     OFFER_SETUP_PENDING, and for once not as a formality: Amazon's own details
     table has not been read, so the ASIN is unconfirmed and no buy link ships
     until it is. */
  "yarbo-snow-blower": "prod-yarbo-snow-blower",
};

/**
 * Products that will never have an offer, and are not waiting for one.
 *
 * THE DISTINCTION THIS DRAWS. "No offer yet" is a gap and the catalogue tests
 * are right to fail on it — a published review with a buy button pointing at
 * nothing is the worst failure this site has. "No offer, ever" is an editorial
 * decision, and it needs saying out loud rather than being smuggled past those
 * tests by leaving the product out of PRODUCT_ID.
 *
 * Both entries here are rule-out reviews: pages that own a large search term
 * and spend it telling the reader to buy something else. Cozmo's seller is
 * under suit by a state Attorney General over roughly 14,000 prepaid orders
 * that were never delivered. Moxie's maker ceased trading and the robots
 * stopped working. Neither page carries a buy button, so the rule about buy
 * buttons has nothing to say about them.
 *
 * Adding a slug here is not a shortcut for "we have not done the commercial
 * work yet". It is a statement that we refuse the sale.
 */
/**
 * OFFER_SETUP_PENDING — verified and published, not yet wired to sell.
 *
 * THE THIRD STATE, AND THE ONE THE OTHER TWO KEPT PRETENDING NOT TO NEED.
 * A product used to be either sellable or refused. Ten litter boxes and lawn
 * mowers verified on 8 August 2026 are neither: their identity is confirmed at
 * the retailer and the manufacturer, they belong in the hub tables and the
 * matcher, and nobody has built their commercial wiring yet. Filing them under
 * NO_OFFER_BY_DESIGN would say we refuse the sale, which is false. Leaving them
 * out of PRODUCT_ID would be the silent exclusion this file spent a day
 * removing.
 *
 * WHAT IT MEANS ON THE PAGE. No /go link. No price. No availability or stock
 * claim anywhere — a product in this state has an unknown stock state by
 * definition, and the buy box says "Check current price" rather than inventing
 * one.
 *
 * WHY IT EXPIRES. Every state like this is a silent exclusion waiting to
 * happen: it starts as a note and becomes the place products go to be
 * forgotten. So it has a date and a shelf life. A product sitting here more
 * than THIRTY DAYS fails the build, and the fix is to wire the offer, refuse
 * the sale in writing, or take the product down. There is no fourth option and
 * there is no extending the clock quietly.
 */
export interface OfferSetupPending {
  /** Why the offer is not wired yet. Not "TODO". */
  reason: string;
  /** ISO date the product entered this state. The clock starts here. */
  since: string;
}

export const OFFER_SETUP_PENDING_DAYS = 30;

/**
 * EMPTY, AND THE DAY IT EMPTIED IS THE POINT.
 *
 * Eleven products entered this state on 8 August 2026 and all eleven left it
 * the same day, wired to Amazon US with a pinned ASIN, a /go key and a seeded
 * offer each. Nothing was carried forward and nothing was quietly re-dated.
 *
 * The eleven reasons that used to sit here have not been deleted — they are in
 * git, and the wiring that answers each of them is recorded beside the ASIN it
 * pins in commerce/destinations.ts. Two of those reasons turned out to be
 * wrong about the obstacle, which is worth keeping in mind the next time
 * something lands here: "Whisker's affiliate programme has not been applied
 * for" and "Anker's programme is unapplied" both described a direct
 * relationship nobody needs. Every one of these sells on Amazon US, where
 * BotPlanet already has a programme, so the work was pinning a SKU rather than
 * signing an agreement.
 *
 * The map stays, and so does its shelf life. This is the state a verified
 * product waits in, and an empty one is the only good state for it to be in.
 */
export const OFFER_SETUP_PENDING: Record<string, OfferSetupPending> = {
  /* GRILLBOT LEFT ON 26 SEPTEMBER 2026, 47 DAYS AFTER IT ARRIVED — 17 days
     past its own 30-day shelf life, which is what finally failed the build.
     It was the only product in its category, so grill-cleaning-robots earned
     nothing for six and a half weeks over a single un-repeated listing read.
     Wired at researched_exact in commerce/destinations.ts — see GRILL_ASINS
     there for what is and is not confirmed. */


  /* THE ELEVEN ROBOT VACUUMS CAME OFF THIS LIST ON 14 AUGUST 2026, wired to
     Amazon with the ASINs that had been sitting in their own review records
     since 10 August. See VACUUM_ASINS in commerce/destinations.ts.

     WHAT THIS REGISTER GOT RIGHT AND WHAT IT COST. The reason written here was
     sound — four of the eleven sit in variation families or one word from a
     differently-priced sibling, and a careless /dp/ link on any of them lands a
     reader on a machine that does not do what the page said. So the wiring
     waited, correctly. What nobody set was a date to come back, and the site's
     largest category — a 135,000/mo head term, eleven published reviews — then
     spent four days live with a buy heading and nothing under it. The audit of
     14 August found it; this register did not surface it.

     Every one of the eleven now carries a pinned ASIN with its siblings named
     and denied in the identity check, which is the careful version the delay
     was for. */

};

/** Days a product has been waiting, against the day given. */
export const pendingAgeDays = (since: string, today: string): number =>
  Math.floor((Date.parse(today) - Date.parse(since)) / 86_400_000);

/** Products that have outstayed the shelf life, as of `today`. */
export const overduePendingOffers = (today: string): string[] =>
  Object.entries(OFFER_SETUP_PENDING)
    .filter(([, v]) => pendingAgeDays(v.since, today) > OFFER_SETUP_PENDING_DAYS)
    .map(([id]) => id);

/**
 * PRODUCTS THE SITE TELLS READERS NOT TO BUY.
 *
 * NOT THE SAME AS NO_OFFER_BY_DESIGN, and the difference is the whole reason
 * this exists. That register refuses the SALE — we will not take a commission
 * on the machine at all. This one records an EDITORIAL verdict: the product is
 * perfectly buyable, we hold it, the buy button works, and our own copy says
 * you should buy something else instead.
 *
 * WHY IT HAD TO BECOME MACHINE-READABLE. The window hub's FAQ names two
 * machines it will not recommend — the WINBOT W1 PRO, overtaken inside its own
 * range by the cheaper Mini, and the HOBOT 298, whose maker publishes almost
 * nothing measurable about it. Both statements were prose, so nothing else on
 * the site could see them, and the "readers also compared" picker went on
 * offering both as the nearest sibling: the 298 on the W2 PRO's page, the
 * W1 PRO on the W2 PRO Omni's. A site that argues against a machine in one
 * paragraph and recommends it in the next has no opinion at all.
 *
 * A page about one of these is still a legitimate destination — somebody
 * researching the W1 PRO should reach our review of it. What must never happen
 * is the site VOLUNTEERING one as the thing to look at instead.
 */
export const ANTI_RECOMMENDED: Record<string, string> = {
  "ecovacs-winbot-w1-pro":
    "A competent entry machine overtaken inside its own range: the Mini costs less and grips harder. Named in the window hub's FAQ as one of two we hold and do not recommend.",
  "hobot-298":
    "The machine we know least about — its own maker publishes almost nothing measurable, and the W1 PRO costs about the same while publishing what the 298 does not. Named in the window hub's FAQ as the second of the two.",
};

export const NO_OFFER_BY_DESIGN: Record<string, string> = {
  "prod-living-ai-emo":
    "Living.AI sells EMO direct and does not list it on Amazon US. Searching for it there returns imitations — EMOPET and unbranded desk robots — with the Living.AI brand token absent from every top result we read on 8 August 2026. There is no destination we could send a buyer to that we are confident sells the real product, so we send them nowhere. A SPECIFIC LISTING WAS PUT UP FOR THIS AND CHECKED ON 9 AUGUST 2026, amazon.com/dp/B0DG8JPL6J, and it failed on three counts. Its own details table gives brand 'EMOPET' and manufacturer 'EMOPET', and the storefront reads 'Visit the EMOPET Store' — the Living.AI token appears nowhere on the listing. It asks $419.00 for what its model number calls 'EMO GO HOME', against $369.00 for the EMO Go Home on Living.AI's own store, so it is fifty dollars ABOVE the maker's price, which is the wrong direction for an authorised reseller and the right one for a reseller nobody authorised. And Living.AI's own staff, on Living.AI's own forum, say the official store is 'the only legitimate place to purchase EMO' and that they cannot confirm Living.ai is the seller behind an Amazon listing. Sibling B0DDT2MT9K carries a near-identical EMOPET title, so this is a brand running a family of these listings rather than one stray reseller. Rechecking is welcome; wiring it on this evidence is not.",
  "prod-cozmo":
    "Digital Dream Labs is under suit by the Pennsylvania Attorney General over about 14,000 prepaid orders that went undelivered, and its store lists Cozmo 2.0 with no stock and no ship date. We will not route a buyer into that.",
  "prod-moxie":
    "Embodied ceased operations and Moxie stopped working when its servers went off. There is no new stock, and a used unit may never function. There is nothing here we would sell.",
};

/** Editorial records with the stable productId attached, keyed by slug (route id). */
export const PRODUCTS: Record<string, ProductEditorial> = Object.fromEntries(
  Object.entries(RAW).map(([slug, r]) => [slug, { ...r, productId: PRODUCT_ID[slug] ?? `prod-${slug}` }]),
) as Record<string, ProductEditorial>;

/**
 * CATALOGUE STATUS — which products may be sold and recommended.
 *
 * A product is not deleted when it leaves the active catalogue. Its record,
 * its evidence and its verification history stay exactly where they are, so
 * the reasoning remains auditable and a URL that was published does not become
 * a 404. What changes is what BotPlanet is willing to DO with it.
 *
 * Dolphin Premier is withdrawn on two independent findings:
 *   - Job 8 recorded it `candidate_under_review` on evidence grounds; its
 *     manual is a "Classic 5 / Top 5" document that does not name the model;
 *   - the owner searched Amazon US in a browser and found no listing at all,
 *     so there is no US retail destination for it.
 *
 * A successor is NOT substituted here. Any replacement becomes its own product
 * record and must pass the pre-Job-11 reconciliation like anything else —
 * quietly swapping a different machine in behind the same name is precisely
 * how a catalogue starts lying.
 */
export type CatalogueStatus =
  /** Sellable and recommendable. */
  | "active"
  /** Kept for the record: no offers, no recommendations, no comparisons. */
  | "historical_candidate"
  /**
   * Taken out of the catalogue by an owner decision rather than by a finding
   * against the product. Distinct from historical_candidate on purpose: one
   * says "we could not stand behind this", the other says "we chose to stop
   * carrying it". Collapsing them would lose the difference, and the
   * difference is the whole reason either label exists.
   */
  | "removed";

export const CATALOGUE_STATUS: Record<string, CatalogueStatus> = {
  "prod-dolphin-e10": "removed",
  /* `prod-dolphin-premier` was the other entry; that
     record now holds the BuBlue Bubot 800P Gen2, which has a machine-read
     identity and a live destination, so it is an ordinary active product. The
     Dolphin Premier itself is still not sellable and never became so — see
     LIFTED_WITHDRAWALS below and RETIRED_VERIFICATIONS in evidence. */
};

export const catalogueStatusOf = (productId: string): CatalogueStatus =>
  CATALOGUE_STATUS[productId] ?? "active";

/** Why a product left the active catalogue, kept so the decision is traceable. */
export const CATALOGUE_WITHDRAWALS: Record<string, { on: string; reason: string }> = {
  /* Empty. The one withdrawal is recorded below, because a withdrawal that is
     simply deleted takes its reasoning with it. */
};

/**
 * Withdrawals that ended, and how.
 *
 * A product leaves this catalogue for a reason, and the reason has to outlive
 * the withdrawal — otherwise a future reader sees an ordinary product and never
 * learns that BotPlanet once refused to sell it, or why. So a lifted withdrawal
 * moves here rather than disappearing.
 */
export const LIFTED_WITHDRAWALS: Record<string, { on: string; reason: string; liftedOn: string; liftedBecause: string }> = {
  "prod-dolphin-premier": {
    on: "2026-07-31",
    reason:
      "Withdrawn from the active launch catalogue. Two independent findings: Job 8 holds it as candidate_under_review because the only manual available covers 'Classic 5 / Top 5' rather than the Premier, and a browser search of Amazon US found no listing, so there is no US retail destination. The record is retained as a historical candidate — non-commercial, not recommendable — and no successor has been substituted.",
    liftedOn: "2026-08-03",
    liftedBecause:
      "The withdrawal was never lifted for the Dolphin Premier — both findings against it still stand, and it is still not sold on Amazon US. What changed is that this RECORD no longer holds a Dolphin. On the owner's direction it now holds the BuBlue Bubot 800P Gen2, whose identity was machine-read from its Amazon listing the same day: Brand BUBLUE, Model Number 'Bubot 800P gen2'. A record with a verified identity and a live destination is not a withdrawn record, so the withdrawal ends with the product it applied to. The route still reads /dolphin-premier/ until D1 can be updated — see content/product-names.ts.",
  },
};

/** The products that may carry an offer or be recommended. */
export const ACTIVE_PRODUCTS: Record<string, ProductEditorial> = Object.fromEntries(
  Object.entries(PRODUCTS).filter(([, p]) => catalogueStatusOf(p.productId) === "active"),
);

/**
 * THE CATALOGUE. Every product that has a page, whatever shape its editorial
 * takes.
 *
 * Added 6 August 2026 to fix a failure that was total and completely silent.
 * `PRODUCTS` above is pool-era editorial keyed by slug, and the offer engine,
 * the offer validator, the offer report and the product-offer mapping all
 * treated it as "the catalogue". No window machine is in it — that category
 * was built on reviews.ts and src/reviews/*.md, which is a different and
 * perfectly good shape — so eleven published reviews with a Buy heading could
 * not produce a single offer between them, and no test noticed, because the
 * tests iterated the same map as the code.
 *
 * PRODUCT_ID is the real catalogue: it is the slug-to-D1 join every product
 * must appear in to exist at all. Editorial is optional and looked up per
 * product; the category comes from CATEGORY_OF below because productPath()
 * needs it and a product URL built on the wrong category is a 404.
 */
/* THE THIRD SHAPE ARRIVED, AND THE BRANCH THAT LIVED HERE WAS WRONG ABOUT IT.
   This was a two-way branch: window slugs by prefix, everything else pool. Its
   own comment said "when a third shape arrives this becomes a lookup rather
   than a branch". Companion robots arrived on 8 August 2026 and the branch
   silently filed all five under robotic-pool-cleaners, so the product-offer
   mapping published canonical URLs like
   /robots/robotic-pool-cleaners/moflin/ — five 404s, in an export whose whole
   job is telling an affiliate network where our products live.

   NO TEST CAUGHT IT because the assertion checked the SHAPE of the URL
   (/robots/<something>/<something>/) rather than whether the category was the
   product's own. A pattern that a wrong answer satisfies is not a gate. The
   replacement assertion lives in offers.test.ts and compares each product's
   category against the page plan's entry for its review path.

   Explicit sets from here on. A product added without a category listed here
   lands in `pool` by default and the new test fails loudly, which is the
   behaviour wanted. */
const WINDOW_SLUGS = new Set([
  "ecovacs-winbot-w2-pro-omni",
  "ecovacs-winbot-w3-omni",
  "ecovacs-winbot-w2-pro",
  "ecovacs-winbot-w2s",
  "ecovacs-winbot-w1-pro",
  "ecovacs-winbot-mini",
  "hutt-s55-pro",
  "mamibot-w120-dp",
  "hobot-2s",
  "hobot-298",
  "cop-rose-x5s",
]);

const CODING_SLUGS = new Set([
  "sphero-bolt",
  "sphero-mini",
  "sphero-indi",
  "ozobot-evo",
  "makeblock-mbot",
  "cozmo",
  "botley-the-coding-robot",
  "code-and-go-robot-mouse",
]);

/* The launch category, named rather than assumed. CATEGORY_OF falls through to
   pool, so this is what makes "fell through" distinguishable from "is a pool
   cleaner" — see the test of the same name in offers.test.ts. */
export const POOL_SLUGS = new Set([
  "beatbot-aquasense-2-ultra", "aiper-scuba-x1-pro-max", "aiper-scuba-s1", "aiper-seagull-se",
  "wybot-c1", "dolphin-nautilus-cc-plus", "bublue-bubot-800p", "polaris-freedom",
  "betta-se-plus", "dolphin-e10", "dolphin-proteus-dx4-plus", "aiper-scuba-v3-ai-vision",
  "aiper-ecosurfer-s2", "beatbot-iskim", "brinbo-sk01",
]);

const LITTER_SLUGS = new Set(["litter-robot-4", "petkit-purobot-max-pro-2", "casa-leo-loo-too", "petsafe-scoopfree-crystal-pro"]);

const LAWN_SLUGS = new Set(["segway-navimow-i110n", "mammotion-luba-3-awd-1500h", "mammotion-luba-3-awd-3000h", "husqvarna-automower-410iq", "worx-landroid-vision-wr320", "eufy-e15", "dreame-a3-awd-1000"]);

const PETCAM_SLUGS = new Set(["enabot-ebo-air-2", "enabot-ebo-se", "enabot-rola-petpal"]);

const COMPANION_SLUGS = new Set([
  "moflin",
  "miko-3",
  "vector-2",
  "eilik",
  "loona",
  /* No review page of its own, deliberately: it shares five of ten top-ten
     domains with /guides/robotic-pets-for-elderly/, which is live, so that
     guide carries the product instead. It still needs a category here, because
     the catalogue row and its spec page exist either way. */
  "joy-for-all-companion-pets",
  "ropet",
  "moxie",
  "living-ai-emo",
]);

/* Grill, from 10 August 2026. One slug so far; a set for the same reason every
   other category has one — the fall-through below files an unclaimed slug as a
   pool cleaner. */
const GRILL_SLUGS = new Set(["grillbot"]);

/* Robot vacuums, from 10 August 2026. Eleven at once, which makes this the
   largest single set in the map — and the one where a missing entry would be
   least visible, because the fall-through below files an unclaimed slug as a
   pool cleaner and a robot vacuum reads plausibly enough in a pool grid to
   survive a glance. The test that asserts every slug is claimed is what stops
   that, not this comment. */
const VACUUM_SLUGS = new Set([
  "eufy-x10-pro-omni",
  "eufy-omni-s1-pro",
  "roborock-s8-max-ultra",
  "roborock-saros-10",
  "roborock-qrevo-s5v",
  "dreame-x40-ultra",
  "dreame-x50-ultra",
  "ecovacs-deebot-t90-pro-omni",
  "shark-powerdetect-av2820s",
  "shark-matrix-plus-ur2650ws",
  "roomba-max-705",
]);

/* Robot snow blowers, from 11 August 2026. One slug, in a HIDDEN category —
   which changes nothing here: the fall-through below files an unclaimed slug as
   a pool cleaner regardless of whether its category is live, and a snow blower
   sitting in the pool grid would be no less wrong for being in a category
   nobody can navigate to. */
const SNOW_SLUGS = new Set(["yarbo-snow-blower"]);

const CATEGORY_OF: Record<string, string> = Object.fromEntries(
  Object.keys(PRODUCT_ID).map((slug) => [
    slug,
    WINDOW_SLUGS.has(slug)
      ? "window-cleaning-robots"
      : COMPANION_SLUGS.has(slug)
        ? "companion-robots"
        : PETCAM_SLUGS.has(slug)
          ? "pet-camera-robots"
          : CODING_SLUGS.has(slug)
            ? "educational-coding-robots"
            : LITTER_SLUGS.has(slug)
              ? "self-cleaning-litter-boxes"
              : LAWN_SLUGS.has(slug)
                ? "robotic-lawn-mowers"
                : GRILL_SLUGS.has(slug)
                  ? "grill-cleaning-robots"
                : VACUUM_SLUGS.has(slug)
                  ? "robot-vacuums"
                : SNOW_SLUGS.has(slug)
                  ? "robot-snow-blowers"
                : /* THE DEFAULT IS POOL AND THAT IS A TRAP. A slug in no set
                     above lands in the launch category silently, which is how
                     ten litter boxes and lawn mowers were briefly filed as pool
                     cleaners on 8 August 2026. The test below asserts every
                     slug is claimed by a set rather than falling through. */
                  "robotic-pool-cleaners",
  ]),
);

export interface CatalogueProduct {
  /** Route identifier. */
  slug: string;
  /** Stable D1 join key. */
  productId: string;
  categorySlug: string;
  /** Pool-era editorial, where it exists. Genuinely optional. */
  editorial: ProductEditorial | undefined;
}

export const CATALOGUE: CatalogueProduct[] = Object.entries(PRODUCT_ID).map(
  ([slug, productId]) => ({
    slug,
    productId,
    categorySlug: CATEGORY_OF[slug],
    editorial: PRODUCTS[slug],
  }),
);

/** The catalogue, minus anything withdrawn from sale. */
export const activeCatalogue = (): CatalogueProduct[] =>
  CATALOGUE.filter((p) => catalogueStatusOf(p.productId) === "active");

/** Lookup by route slug. */
export const productEditorial = (slug: string): ProductEditorial | undefined => PRODUCTS[slug];
/** Lookup by stable canonical productId (the D1 join key). */
export const productEditorialById = (productId: string): ProductEditorial | undefined =>
  Object.values(PRODUCTS).find((p) => p.productId === productId);
export const hasEditorial = (slug: string): boolean => slug in PRODUCTS;
