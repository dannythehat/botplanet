/**
 * What every pinned ASIN resolved to on 9 August 2026, read directly.
 *
 * WHY THIS FILE EXISTS. Twenty-two products are on the paid price checker and
 * therefore have an identity expectation guarding them. TWENTY-SIX ARE NOT: they
 * carry a live buy button, a pinned ASIN and no identity check of any kind, so
 * a listing that quietly became a different product would keep earning clicks
 * and nothing on the site would notice. That gap was found by sweeping all
 * forty-nine destinations after an owner report of a dead ASIN.
 *
 * WHY IT IS SEPARATE FROM EXPECTED_IDENTITIES. That list drives the SerpApi
 * refresh, which costs a credit per read against a 200-a-month ceiling — which
 * is exactly why only twenty-two products are on it. Identity does not need
 * SerpApi: the whole catalogue was read here for nothing, by fetching each
 * product page and parsing its own details table. Identity checking is
 * therefore DECOUPLED from price checking, runs over everything, and costs
 * nothing.
 *
 * WHAT A ROW IS. Not a claim about the product — a record of what Amazon's own
 * details table said on the date in BASELINE_READ_ON. A later sweep that reads
 * something different has found a listing that changed under us, which is the
 * event this file exists to detect.
 *
 * NULL IS A REAL VALUE HERE. Where Amazon publishes no model name or number,
 * the field is null and stays null; a sweep that later finds one has still
 * found a change worth a human look, but it is not on its own proof of a swap.
 */

export interface IdentityBaseline {
  productId: string;
  asin: string;
  /** Amazon's own Brand field, as read. */
  brand: string | null;
  modelName: string | null;
  modelNumber: string | null;
  /** The listing title, for a human reading a diff. Never used for matching. */
  title: string;
}

/** The day every row below was read. */
export const BASELINE_READ_ON = "2026-08-09";

/**
 * Read by scripts/identity-sweep.mjs, which fetches amazon.com/dp/<asin> and
 * parses the details table. Titles are recorded for human diffing only —
 * matching is on the structured fields, because a title is copy the seller
 * writes and changes whenever marketing feels like it.
 */
export const IDENTITY_BASELINE: IdentityBaseline[] = [
  { productId: "prod-litter-robot-4", asin: "B0BH6MD3DJ", brand: "Whisker", modelName: null, modelNumber: "LR4-0301-00-CA", title: "Litter-Robot 4 with Step & Fence by Whisker, Black | Automatic, Self-Cleaning Cat Litter Box, Helps Reduce Lit" },
  { productId: "prod-petkit-purobot-max-pro-2", asin: "B0DM83CLW3", brand: "PETKIT", modelName: null, modelNumber: "T5-2", title: "PETKIT Purobot Max Pro 2 AI-Camera Automatic Cat Litter Box Large Opening | Cat's Facial Recognition 210° Wide" },
  { productId: "prod-casa-leo-loo-too", asin: "B09LL9S99B", brand: "Smarty Pear", modelName: null, modelNumber: "3746", title: "Casa Leo Automatic Self-Cleaning Cat Litter Box | with Leo’s Loo Too Wi-Fi App & Voice Control, App Weight Tra" },
  { productId: "prod-petsafe-scoopfree-crystal-pro", asin: "B0DR3JP2FZ", brand: "PetSafe", modelName: null, modelNumber: "PAL00-18017", title: "PetSafe ScoopFree Crystal Pro Self-Cleaning Litter Box | Up to 30 Days Hands-Free Automatic Cleaning, Advanced" },
  { productId: "prod-navimow-i110n", asin: "B0CX7T6BR3", brand: "NAVIMOW", modelName: "i110N: Mows up to 0.25 acre", modelNumber: "i110N", title: "Segway Navimow i110N Robot Lawn Mower Perimeter Wire Free 1/4 Acre RTK+Vision Robotic Lawnmower, AI-Assisted M" },
  { productId: "prod-luba-3-awd-1500h", asin: "B0GKNYZPC3", brand: "Mammotion", modelName: "High Version", modelNumber: "LUBA 3 1500H", title: "Mammotion LUBA 3 AWD 1500H Robot Lawn Mower, 0.37 Acre, 2.2\"-4.0\" Cutting | 360° LiDAR+Dual-Camera AI Vision, " },
  { productId: "prod-luba-3-awd-3000h", asin: "B0GKNQKJJQ", brand: "Mammotion", modelName: "High Version", modelNumber: "LUBA 3 3000H", title: "Mammotion LUBA 3 AWD 3000H Robot Lawn Mower, 0.75 Acre, 2.2\"-4.0\" Cutting | 360° LiDAR+NetRTK+AI Vision, 5400 " },
  { productId: "prod-automower-410iq", asin: "B0DTV7TR6W", brand: "Husqvarna", modelName: "Modern", modelNumber: "970727401", title: "Husqvarna 410iQ ½ Acre Wire-Free, 45% Slope, app Based, Robot Lawn Mower | Wire-free robot mower with EPOS®, a" },
  { productId: "prod-worx-landroid-vision-wr320", asin: "B0GN8KK8XW", brand: "WORX", modelName: "Two-Wheel Drive", modelNumber: "WR320", title: "WORX Robot Lawn Mower for 1/2 Acre, No Perimeter Wire, WR320 | Landroid Vision Cloud with AI Obstacle Avoidanc" },
  { productId: "prod-eufy-e15", asin: "B0DRVYDXWX", brand: "eufy", modelName: "eufy E15 up to 0.2 Acre", modelNumber: "T2880", title: "eufy Robot Lawn Mower E15, Auto Mapping, Pure Vision Navigation | Wire Free RTK Free, Multi-Zone Management, A" },
  { productId: "prod-dreame-a3-awd-1000", asin: "B0H3V799KT", brand: "dreame", modelName: "Modern High-Tech", modelNumber: "MXXA7300", title: "(Latest Upgrade) DREAME A3 AWD 1000 Robot Lawn Mower, 360° 3D LiDAR & AI Dual Vision Smart Robotic Mower for 0" },
  { productId: "prod-moflin", asin: "B0GPHNLWP3", brand: "Casio", modelName: "PE-M10SR-IJ", modelNumber: "PE-M10SR-IJ", title: "Casio Moflin AI Smart Companion Robot - Silver | AI-powered interactive companion; emotional evolution; MofLif" },
  { productId: "prod-miko-3", asin: "B0GV37M678", brand: "Miko My Companion", modelName: "Miko 3", modelNumber: null, title: "Miko 3 AI Robot for Kids – Smart Educational & STEAM Learning Robot with Interactive Apps, Games, Stories & Ac" },
  { productId: "prod-sphero-bolt", asin: "B07DLM5DL7", brand: "Sphero", modelName: null, modelNumber: "Sphero Bolt", title: "Sphero Bolt Coding Robot Ball, Ages 8+ | Beginner to Advanced Programming, Draw, Blocks, Javascript, or Python" },
  { productId: "prod-sphero-mini", asin: "B072B6QVVW", brand: "Sphero", modelName: null, modelNumber: "M001BRW", title: "Sphero Mini (Blue) - Coding Robot Ball - Educational Coding and Gaming for Kids and Teens - Bluetooth Connecti" },
  { productId: "prod-sphero-indi", asin: "B094X6TV5V", brand: "Sphero", modelName: null, modelNumber: "980-0528", title: "sphero Indi At-Home Learning Kit Screenless Coding Robot | Ages 4+ : Toys & Games" },
  { productId: "prod-ozobot-evo", asin: "B0CSR53WXV", brand: "Ozobot", modelName: null, modelNumber: null, title: "Ozobot Evo Coding Robot Kit | Ages 5-11 | STEM Coding for Kids & Teachers : Toys & Games" },
  { productId: "prod-makeblock-mbot", asin: "B00SK5RUQY", brand: "Makeblock", modelName: null, modelNumber: "90053", title: "Makeblock mBot STEM Coding Toys Robotics for Kids Ages 8-12 | Learn to Code with Scratch & Arduino, STEM Robot" },
  { productId: "prod-enabot-ebo-air-2", asin: "B0DZHDF7MD", brand: "Enabot EBO", modelName: "EBO Air 2 - Dove White", modelNumber: "EBO Air 2", title: "Enabot EBO Air 2 Mobile Pet Camera Robot: 2K FamilyBot with Two-Way Talk | Family Companion with Whole-Home Mo" },
  { productId: "prod-enabot-ebo-se", asin: "B09R6V3CJM", brand: "Enabot EBO", modelName: "EBO SE FamilyBot", modelNumber: "EBO SE FamilyBot", title: "Enabot EBO SE Home Robot Camera: 1080P Mobile FamilyBot Pet Companion | Whole-Home Mobility, Two-Way Talk, Nig" },
  { productId: "prod-enabot-rola-petpal", asin: "B0GMQW1HX6", brand: "Enabot EBO", modelName: "ROLA PetPal", modelNumber: "ROLA PetPal", title: "Enabot EBO ROLA PetPal Mobile 2.5K Pet Camera Robot with Treat Dispenser | Whole-Home Mobility, Two-Way Talk, " },
  { productId: "prod-ropet", asin: "B0GTPZ4N4M", brand: "ropet", modelName: "ropet KAMOMO pro", modelNumber: null, title: "ropet KAMOMO Companion Interactive Robot Pet, Emotional Support for Kids and Adults, AI Desk Robots, Anxiety R" },
  { productId: "prod-joy-for-all-companion-pets", asin: "B017JQQ00Q", brand: "JOY FOR ALL", modelName: "B7594", modelNumber: "A7594", title: "JOY FOR ALL Companion Pet for Seniors - Lifelike Animatronic Cat - Realistic Soft-Touch Fur & Purring - Therap" },
  { productId: "prod-loona", asin: "B0DCF53PCH", brand: "Loona", modelName: "KYO04LN01", modelNumber: "KYO04LN01", title: "Loona Robot Pet Dog ChatGPT-4o Smart AI-Powered Companion Voice & Gesture Control, Real-Time Interaction Robot" },
  { productId: "prod-eilik", asin: "B0C2C9LJNQ", brand: "Eilik", modelName: "Eilik", modelNumber: "Eilik", title: "ENERGIZE LAB Eilik –Your Desktop Companion Full of Personality with Expressive Animations & Reactions, Touch-R" },
  { productId: "prod-vector-2", asin: "B07G3ZNK4Y", brand: "Digital Dream Labs", modelName: "Vector Black", modelNumber: "000-0075 BLK", title: "Anki Vector 2.0 AI ChatGPT Connected Robot Companion – Smart Autonomous Home Robot with Face Recognition and V" },
  { productId: "prod-ecovacs-winbot-w2-pro-omni", asin: "B0DR8Y4VF9", brand: "ECOVACS", modelName: null, modelNumber: "W2MP", title: "- ECOVACS WINBOT W2 PRO Omni Portable Window Cleaning Robot with Multi-Functional Station, Charging While Work" },
  { productId: "prod-ecovacs-winbot-w2-pro", asin: "B0DSKC7QT7", brand: "ECOVACS", modelName: "Winbot W2 PRO", modelNumber: "W2 pro", title: "- ECOVACS WINBOT W2 PRO Window Cleaning Robot, 3 Nozzles Water Sprayer, 10-Level Protection, Win-SLAM 4.0 Path" },
  { productId: "prod-ecovacs-winbot-w3-omni", asin: "B0GJDQ59J1", brand: "ECOVACS", modelName: "WINBOT W3 OMNI", modelNumber: "WINBOT W3 OMNI", title: "- ECOVACS WINBOT W3 Omni Robot Window Cleaner with Auto-Clean & Multi-Functional Station, Win-SLAM 5.0 Smart N" },
  { productId: "prod-ecovacs-winbot-w1-pro", asin: "B0C2CQP8ZS", brand: "ECOVACS", modelName: "winbot", modelNumber: "W1PRO", title: "- ECOVACS Winbot W1 Pro Window Cleaning Robot, Intelligent Cleaning with Dual Cross Water Spray Technology, Wi" },
  { productId: "prod-ecovacs-winbot-w2s", asin: "B0G5Y3NHTX", brand: "ECOVACS", modelName: "WINBOT W2S", modelNumber: "W2S", title: "- ECOVACS WINBOT W2S Window Cleaning Robot, Intelligent Edge-to-Edge Cleaning with TruEdge Scrubbers, 3 Water " },
  { productId: "prod-ecovacs-winbot-mini", asin: "B0DR8W696Y", brand: "ECOVACS", modelName: "WINBOT MINI", modelNumber: "WINBOT MINI", title: "- ECOVACS WINBOT Mini Window Cleaning Robot - Compact Design, Dual Nozzles with Ultrasonic Spray, 9-Stage Prot" },
  { productId: "prod-hobot-2s", asin: "B097CM7P9L", brand: "HOBOT", modelName: null, modelNumber: "Hobot2s", title: "HOBOT-2S Window Cleaning Automatic Robot with Ultrasonic Water Spray, Intelligent Cleaning, AI Smart Route Pla" },
  { productId: "prod-hobot-298", asin: "B07LF4HZ6C", brand: "HOBOT", modelName: "Hobot-298", modelNumber: "Hobot-298", title: "- HOBOT-298 Window Cleaning Automatic Robot with Ultrasonic Water Spray, Intelligent Cleaning, AI Smart Route " },
  { productId: "prod-cop-rose-x5s", asin: "B09D98W5KQ", brand: "Cop Rose", modelName: "X5S", modelNumber: "X5S", title: "- Cop Rose X5S Window Cleaner Robot Smart Robotic Window Cleaner with Auto Water Spray Vacuum Robotic Robot by" },
  { productId: "prod-mamibot-w120-dp", asin: "B0DC6B81Z2", brand: "Mamibot", modelName: "W120-DP~WB", modelNumber: "W120-DP", title: "Mamibot W120-DP Window Cleaning Robot,7000Pa Strong Suction, 10 Cleaning Modes, 4-Spray Water Jet, Smart Edge " },
  { productId: "prod-hutt-s55-pro", asin: "B0GFW8TFML", brand: "HUTT", modelName: "S55PRO", modelNumber: "S55PRO", title: "HUTT S55 Pro Window Cleaning Robot, 3D Floating Pads, Up to 6500Pa Suction, HydroJet Pump Spray, SLAM 4.0 Navi" },
  { productId: "prod-dolphin-nautilus-cc-plus", asin: "B09K4C9WGF", brand: "Dolphin", modelName: "Nautilus CC Plus Wi-Fi", modelNumber: "99996406-PCI", title: "Dolphin Nautilus CC Plus Wi-Fi Automatic Robotic Pool Vacuum Cleaner, Always Cleaning, Never Charging, with Wa" },
  { productId: "prod-polaris-freedom", asin: "B0BX9DJS7R", brand: "Polaris", modelName: "FREEDOM", modelNumber: "FFREEDOM", title: ": Polaris Freedom Cordless Robotic Pool Cleaner, Cable-Free | Cleans In-Ground Pools up to 50ft with Four Clea" },
  { productId: "prod-betta-se-plus", asin: "B0CVMQ3XBX", brand: "Betta", modelName: "Betta-SE-Plus", modelNumber: "Betta-SE-Plus", title: ": Betta SE Plus - Solar-Powered Robotic Pool Skimmer with 24/7 Continuous Cleaning Power, Dual Charging Option" },
  { productId: "prod-beatbot-aquasense-2-ultra", asin: "B0G7B6F5FZ", brand: "Beatbot", modelName: "AquaSense 2 Ultra NA", modelNumber: "AquaSense 2 Ultra NA", title: ": Beatbot AquaSense 2 Ultra Cordless Robotic Pool Cleaner for Complex Pools, Mapping with AI Camera, 5-in-1 Cl" },
  { productId: "prod-aiper-scuba-x1", asin: "B0GMPWMS2H", brand: "AIPER", modelName: "Scuba X1 Pro Max", modelNumber: "X9-Grey", title: ": Aiper Scuba X1 Pro Max Pool Robot Vacuum & Robotic Pool Skimmer with 8,500 GPH Suction, Pool Mapping, 3μm Ul" },
  { productId: "prod-dolphin-e10", asin: "B0GV15VY1N", brand: "Dolphin", modelName: "E10", modelNumber: "1", title: ": Dolphin (2026 Model) E10 Automatic Robotic Pool Vacuum Cleaner, Active Scrubber Brush, Top Load Filters Acce" },
  { productId: "prod-aiper-seagull-se", asin: "B0DJ6MV81N", brand: "AIPER", modelName: "Seagull SE 2025", modelNumber: "Seagull SE 2025", title: ": AIPER Seagull SE 2025 Cordless Robotic Pool Vacuum with 1200GPH Strong Suction, Lasts 90 Mins Runtime, LED I" },
  { productId: "prod-dolphin-proteus-dx4-plus", asin: "B083YWJ5PQ", brand: "Dolphin", modelName: "Proteus DX4 plus", modelNumber: "99996207-LESW", title: ": Dolphin Proteus DX4 Plus Automatic Robotic Pool Cleaner Ideal for Pools up to 33 FT, Wall & Sun-ledge Scrubb" },
  { productId: "prod-aiper-scuba-v3-ai-vision", asin: "B0GG97427D", brand: "AIPER", modelName: "Aiper Scuba V3 Gray", modelNumber: "PRN31", title: ": AIPER Scuba V3 AI Vision Cordless Robotic Pool Cleaner, Grey | Smart Waterline Parking, Wireless Charging Do" },
  { productId: "prod-wybot-c1", asin: "B0GYWJMNWK", brand: "WYBOT", modelName: "OS7010C", modelNumber: "OS7010C C1", title: ": WYBOT C1 Cordless Robotic Pool Vacuum for Inground Pools, Professional | 4-in-1 Robotic Pool Cleaner for Abo" },
  { productId: "prod-dolphin-premier", asin: "B0GTYX922J", brand: "BUBLUE", modelName: "Robotic pool vacuum", modelNumber: "Bubot 800P gen2", title: ": (2026 New) BUBLUE Bubot 800P Gen2 Robotic Pool Vacuum,Cleans Floor/Wall/Waterline/Shallow Area,Powerful Suct" },
  { productId: "prod-aiper-scuba-s1", asin: "B0FJ818NNZ", brand: "AIPER", modelName: "Scuba S1", modelNumber: "1", title: ": Aiper Scuba S1 Robotic Pool Cleaner, Wall & Waterline Cleaning, Dual Filtration, Extended 180-Min Battery Li" },];

export const baselineFor = (productId: string): IdentityBaseline | undefined =>
  IDENTITY_BASELINE.find((b) => b.productId === productId);

/**
 * Did this read find the same product the baseline recorded?
 *
 * BRAND AND MODEL NUMBER ONLY. The title is deliberately not compared: Amazon
 * sellers rewrite titles constantly — "(Latest Upgrade)", "2026 New", seasonal
 * prefixes — and a check that trips on those would cry wolf until somebody
 * turned it off, which is how a real swap gets through.
 *
 * A field that was null at baseline and is null now agrees. A field that GAINED
 * a value is reported as a change but not as a swap, because a maker filling in
 * their own details table is not a different product.
 */
export function baselineDrift(
  b: IdentityBaseline,
  seen: { brand: string | null; modelName: string | null; modelNumber: string | null },
): { changed: boolean; swapped: boolean; detail: string } {
  const norm = (s: string | null) => (s ?? "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
  const diffs: string[] = [];
  let swapped = false;

  for (const [field, was, now] of [
    ["brand", b.brand, seen.brand],
    ["model name", b.modelName, seen.modelName],
    ["model number", b.modelNumber, seen.modelNumber],
  ] as const) {
    const a = norm(was);
    const c = norm(now);
    if (a === c) continue;
    diffs.push(`${field}: was ${was ?? "not published"}, now ${now ?? "not published"}`);
    /* Gaining a value where there was none is a fill-in, not a swap. Losing or
       CHANGING a recorded value is a swap until a human says otherwise. */
    if (a !== "" && c !== "" && a !== c) swapped = true;
    if (a !== "" && c === "") swapped = true;
  }

  return {
    changed: diffs.length > 0,
    swapped,
    detail: diffs.join("; ") || "identical to baseline",
  };
}
