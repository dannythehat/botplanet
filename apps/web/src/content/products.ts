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
      { label: "Amazon US listing (WYBOT C1)", url: "https://www.amazon.com/WYBOT-Pool-Vacuum-Inground-Navigation/dp/B0G64JV6K4" },
    ],
    evidence: "manufacturer_verified",
    confidence: "high",
    researchedDate: R,
  },

  "dolphin-nautilus-cc-plus": {
    slug: "dolphin-nautilus-cc-plus",
    oneLiner: "Popular corded Maytronics robot with Wi-Fi app control, wall and waterline scrubbing for in-ground pools.",
    verdict:
      "Maytronics' best-selling mid-range cleaner delivers reliable floor, wall and waterline cleaning with app scheduling via MyDolphin Plus. Its corded design with an anti-tangle swivel means no recharging, and top-load cartridge filters are easy to service. A safe, proven choice for in-ground pools up to about 40 ft, though the caddy and floating cable add handling bulk.",
    bestFor: "Proven in-ground everyday cleaning",
    priceRangeUsdApprox: [700, 999],
    specs: {
      poolSizeSuitability: "In-ground pools up to ~40 ft",
      cableLengthFt: 60,
      runtimeMins: 120,
      chargeTimeHrs: null,
      filtration: "Top-load fine/ultra-fine cartridge filter basket",
      navigation: "CleverClean scanning with anti-tangle swivel cable",
      weightLbs: 20,
      warranty: "2-year limited (varies by retailer)",
      appSupport: "Wi-Fi + MyDolphin Plus — start, stop, schedule remotely",
    },
    notableFeatures: [
      "Wi-Fi + MyDolphin Plus app scheduling",
      "Active wall and waterline scrubbing brush",
      "Anti-tangle 60 ft swivel cable",
      "Easy top-load cartridge filter access",
      "Weekly cleaning scheduler",
    ],
    pros: [
      "Proven Maytronics reliability and support",
      "Corded — no battery to recharge or degrade",
      "Cleans floor, walls and waterline",
      "Simple top-load filter cleaning",
      "App control and scheduling",
    ],
    limitations: [
      "Floating cable can tangle in tight or odd-shaped pools",
      "Caddy and cable add storage and handling bulk",
      "Best suited to in-ground pools up to ~40 ft only",
      "No above-ground rating",
      "Warranty length varies by seller",
    ],
    whoShouldBuy: "In-ground pool owners wanting a proven, low-maintenance corded robot with app scheduling.",
    whoShouldAvoid: "Anyone with an above-ground pool, or who wants a fully cordless, cable-free experience.",
    faqs: [
      { q: "Does the CC Plus Wi-Fi clean the waterline?", a: "Yes — it scrubs floors, walls and the waterline with its active brush." },
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

  "dolphin-premier": {
    slug: "dolphin-premier",
    oneLiner: "Premium corded Maytronics robot with swappable Multi-Media filtration and SmartNav for large in-ground pools.",
    verdict:
      "Maytronics' top-tier non-Wi-Fi cleaner stands out for Multi-Media filtration that swaps between an oversized leaf bag, standard cartridges and 2-micron NanoFilters. It cleans floor, walls and waterline on in-ground pools up to 50 ft with a strong 3-year non-prorated warranty. A heavy-duty pick for leafy or debris-heavy pools, though it lacks Wi-Fi app control.",
    bestFor: "Debris-heavy large in-ground pools",
    priceRangeUsdApprox: [1000, 1500],
    specs: {
      poolSizeSuitability: "In-ground pools up to ~50 ft",
      cableLengthFt: 60,
      runtimeMins: 150,
      chargeTimeHrs: null,
      filtration: "Multi-Media: leaf bag, cartridge, 2-micron NanoFilters (swappable)",
      navigation: "Microprocessor SmartNav scanning (no Wi-Fi)",
      weightLbs: 22,
      warranty: "3-year limited, not prorated, not cycle-limited",
      appSupport: "None — single-button plug-and-play",
    },
    notableFeatures: [
      "Multi-Media swappable filtration (leaf bag / cartridge / NanoFilters)",
      "2-micron NanoFilters for very fine debris and algae",
      "Dual active scrubbing brushes",
      "Anti-tangle 60 ft swivel cable",
      "3-year non-prorated warranty",
    ],
    pros: [
      "Versatile filtration handles leaves through fine algae",
      "Strong 3-year, non-prorated warranty",
      "Cleans floor, walls and waterline effectively",
      "Corded — no battery to recharge or replace",
      "Rated for larger in-ground pools up to 50 ft",
    ],
    limitations: [
      "No Wi-Fi or app control",
      "Higher price than most mid-range robots",
      "Caddy and cable add handling and storage bulk",
      "In-ground only — no above-ground rating",
      "Heavier to lift out of the pool",
    ],
    whoShouldBuy: "Owners of larger or leafy in-ground pools who want versatile Multi-Media filtration and a long warranty.",
    whoShouldAvoid: "Buyers who want Wi-Fi app control, a cordless design, or a small budget.",
    faqs: [
      { q: "Does the Dolphin Premier have Wi-Fi?", a: "No — it is a single-button plug-and-play model without app or Wi-Fi control." },
      { q: "What makes its filtration special?", a: "Its Multi-Media system lets you swap between an oversized leaf bag, standard cartridges and 2-micron NanoFilters in seconds." },
      { q: "What is the warranty?", a: "A 3-year limited warranty that is not prorated and not limited by number of cycles." },
    ],
    sources: [
      { label: "Dolphin Premier official specs", url: "https://www.premierrobotic.com/dolphin-cleaner-specs" },
      { label: "Dolphin Premier product page", url: "https://www.premierrobotic.com/dolphin-premier" },
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
      weightLbs: null,
      warranty: "2-year limited",
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
      { label: "Amazon US listing", url: "https://www.amazon.com/Beatbot-AquaSense-Cordless-Cleaning-Clarification/dp/B0DMN6NV6H" },
    ],
    evidence: "manufacturer_verified",
    confidence: "high",
    researchedDate: R,
  },

  "aiper-scuba-x1": {
    slug: "aiper-scuba-x1",
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
export const PRODUCT_ID: Record<string, string> = {
  "beatbot-aquasense-2-ultra": "prod-beatbot-aquasense-2-ultra",
  "aiper-scuba-x1": "prod-aiper-scuba-x1",
  "aiper-scuba-s1": "prod-aiper-scuba-s1",
  "aiper-seagull-se": "prod-aiper-seagull-se",
  "wybot-c1": "prod-wybot-c1",
  "dolphin-nautilus-cc-plus": "prod-dolphin-nautilus-cc-plus",
  "dolphin-premier": "prod-dolphin-premier",
  "polaris-freedom": "prod-polaris-freedom",
  "betta-se-plus": "prod-betta-se-plus",
  "dolphin-e10": "prod-dolphin-e10",
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
  | "historical_candidate";

export const CATALOGUE_STATUS: Record<string, CatalogueStatus> = {
  "prod-dolphin-premier": "historical_candidate",
};

export const catalogueStatusOf = (productId: string): CatalogueStatus =>
  CATALOGUE_STATUS[productId] ?? "active";

/** Why a product left the active catalogue, kept so the decision is traceable. */
export const CATALOGUE_WITHDRAWALS: Record<string, { on: string; reason: string }> = {
  "prod-dolphin-premier": {
    on: "2026-07-31",
    reason:
      "Withdrawn from the active launch catalogue. Two independent findings: Job 8 holds it as candidate_under_review because the only manual available covers 'Classic 5 / Top 5' rather than the Premier, and a browser search of Amazon US found no listing, so there is no US retail destination. The record is retained as a historical candidate — non-commercial, not recommendable — and no successor has been substituted.",
  },
};

/** The products that may carry an offer or be recommended. */
export const ACTIVE_PRODUCTS: Record<string, ProductEditorial> = Object.fromEntries(
  Object.entries(PRODUCTS).filter(([, p]) => catalogueStatusOf(p.productId) === "active"),
);

/** Lookup by route slug. */
export const productEditorial = (slug: string): ProductEditorial | undefined => PRODUCTS[slug];
/** Lookup by stable canonical productId (the D1 join key). */
export const productEditorialById = (productId: string): ProductEditorial | undefined =>
  Object.values(PRODUCTS).find((p) => p.productId === productId);
export const hasEditorial = (slug: string): boolean => slug in PRODUCTS;
