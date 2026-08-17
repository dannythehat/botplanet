/**
 * Exact product destinations, and the candidates that were refused.
 *
 * THE RULE THIS ENFORCES: a search-results link is not an offer. The existing
 * /go route sends every Amazon click to `amazon.com/s?k=<product name>`, which
 * is a real tracked click to an imprecise place — the customer still has to
 * find the product, and BotPlanet cannot claim to know what it costs. Six of
 * the ten now have a specific ASIN; four do not, and are honestly classified as
 * search-only rather than dressed up.
 *
 * A CORRECTED VERIFICATION METHOD. The first pass checked these destinations
 * with an HTTP status code and treated 200 as proof the ASIN was live. That was
 * wrong: Amazon serves its "Sorry, we couldn't find that page" page with HTTP
 * 200, so a dead ASIN and a real product are indistinguishable by status alone.
 * One of the six — B0G64JV6K4, carried for the WYBOT C1 — was in fact dead, and
 * the faulty check let a buy button that landed on Amazon's 404 reach
 * production. Destinations are now checked by page CONTENT for the 404 marker,
 * and that ASIN is removed.
 *
 * WHAT "researched_exact" MEANS AND DOES NOT MEAN:
 *   - the ASIN was captured from a source URL recorded during Job 8;
 *   - the destination returns a real product page, not Amazon's 404;
 *   - the MODEL AT THE DESTINATION IS STILL NOT CONFIRMED. Amazon serves
 *     inconsistent markup to non-browser clients — productTitle was readable on
 *     one of five attempts — so code cannot establish identity here, and
 *     pushing harder would be scraping. Only an approved API, or a human with a
 *     browser, can raise this to verified_exact.
 *
 * That gap is why no price and no stock state is published for any offer: a
 * destination that resolves proves the link works, not what it sells for.
 */
import { VERIFICATIONS } from "../evidence/verification";
import type { ProductDestination, RejectedCandidate } from "./types";

export const DESTINATION_CHECK_DATE = "2026-07-31";

const model = (productId: string): string =>
  VERIFICATIONS.find((v) => v.productId === productId)?.identity.canonicalName ?? productId;

/** ASINs captured from the Amazon listing URLs cited in the Job 8 records. */
const AMAZON_ASINS: { productId: string; asin: string; sourceUrl: string }[] = [
  { productId: "prod-dolphin-nautilus-cc-plus", asin: "B09K4C9WGF", sourceUrl: "https://www.amazon.com/Dolphin-Nautilus-Robotic-Cleaner-Ground/dp/B09K4C9WGF" },
  { productId: "prod-polaris-freedom", asin: "B0BX9DJS7R", sourceUrl: "https://www.amazon.com/Polaris-Cordless-Cable-Free-Intelligent-Technology/dp/B0BX9DJS7R" },
  { productId: "prod-betta-se-plus", asin: "B0CVMQ3XBX", sourceUrl: "https://www.amazon.com/Betta-SE-Plus-Continuous-Safeguard/dp/B0CVMQ3XBX" },
  // REPLACES B0DMN6NV6H at the owner's direction, 3 August 2026. Both listings
  // are live; this is a different listing for the same model, not a fix for a
  // broken one. The trade is deliberate and is a DOWNGRADE in evidence: the
  // previous ASIN was machine-read (brand, model number PRCMDS02G-2025), this
  // one rests on the owner's confirmation because Amazon serves a
  // bot-mitigation page to server-side reads. The previous identity check is
  // kept below, and now applies only to the ASIN it actually examined.
  { productId: "prod-beatbot-aquasense-2-ultra", asin: "B0G7B6F5FZ", sourceUrl: "Owner-confirmed 2026-08-03: https://www.amazon.com/Beatbot-AquaSense-Ultra-Cordless-Clarification/dp/B0G7B6F5FZ" },
  // The Scuba X1 Pro Max, supplied by the owner and READ before acceptance this
  // time — Brand AIPER, Model Name "Scuba X1 Pro Max", Model Number X9-Grey.
  // It replaces a listing that was accepted on its URL alone and turned out to
  // be a different machine; see the refusal in REJECTED_CANDIDATES.
  { productId: "prod-aiper-scuba-x1", asin: "B0GMPWMS2H", sourceUrl: "Owner-supplied 2026-08-03, read the same day: https://www.amazon.com/Robotic-Skimmer-Ultra-fine-Filtration-Inground/dp/B0GMPWMS2H" },
  // NOTE ON B0GVT2YPLB, which this replaces. It carried that ASIN for minutes on
  // 3 August 2026 and that was MY ERROR: I read "Scuba-X1-Pro" in the listing
  // URL and took it for the Scuba X1 Pro. It is not. Reading the listing itself
  // shows Model Name and Model Number both "Scuba X1+Hy Pro", and a title of
  // "AIPER Scuba X1 Robotic Pool Cleaner with HydroComm Pro Smart Pool Monitor"
  // — the BASE X1 bundled with a monitor accessory. The "Pro" in the slug
  // belongs to HydroComm Pro, not to the cleaner.
  //
  // The record is the Scuba X1 Pro, which is a different machine with its own
  // manufacturer page. Rather than ship a buy button to the wrong product, this
  // product has no destination until the correct ASIN is supplied. A URL slug
  // is not an identifier; it is marketing copy in a path, and this is the cost
  // of having trusted one.
  // Discovered by the SerpApi run of 2026-07-31 and matched on the details
  // table, not the title — see serpapi-observations.ts for what each read.
  { productId: "prod-dolphin-e10", asin: "B0GV15VY1N", sourceUrl: "SerpApi Amazon search, 2026-07-31: details table gives brand Dolphin, model name E10" },
  // REPLACES B0H5PY2SPF at the owner's direction, 3 August 2026. Both listings
  // are live. Same trade as the Beatbot: the retired ASIN was machine-read
  // (brand AIPER, model Seagull SE ZT20032026, sold by the brand's own
  // storefront), this one rests on the owner's confirmation, so the destination
  // drops to researched_exact.
  { productId: "prod-aiper-seagull-se", asin: "B0DJ6MV81N", sourceUrl: "Owner-confirmed 2026-08-03: https://www.amazon.com/AIPER-Cordless-Self-Parking-Technology-Above-Ground/dp/B0DJ6MV81N" },
  // Owner-supplied and owner-confirmed, 3 August 2026. Identity rests on the
  // owner's confirmation rather than a listing read — see the matching records
  // in evidence/verification.ts, which say so plainly.
  { productId: "prod-dolphin-proteus-dx4-plus", asin: "B083YWJ5PQ", sourceUrl: "Owner-confirmed 2026-08-03: https://www.amazon.com/Dolphin-Automatic-Climbing-Waterline-Scrubber/dp/B083YWJ5PQ" },
  { productId: "prod-aiper-scuba-v3-ai-vision", asin: "B0GG97427D", sourceUrl: "Owner-confirmed 2026-08-03: https://www.amazon.com/AIPER-Vision-Cordless-Robotic-Cleaner/dp/B0GG97427D" },
  // REPLACES the dead B0G64JV6K4. That ASIN returned Amazon's 404 and was
  // pulled on 31 July; this is a different listing entirely, supplied and
  // confirmed by the owner. WYBOT ships C1, C1 Pro and C1 Max with no published
  // model number, so the owner's confirmation is doing the work a SKU normally
  // would — recorded as such in evidence/verification.ts rather than implied.
  { productId: "prod-wybot-c1", asin: "B0GYWJMNWK", sourceUrl: "Owner-confirmed 2026-08-03: https://www.amazon.com/WYBOT-C1-Cordless-Inground-Professional/dp/B0GYWJMNWK" },
  // Owner-supplied on 3 August 2026 and, unusually, MACHINE-READ. Amazon
  // normally serves a bot-mitigation page here; both of these returned real
  // markup, so their identity rests on published fields rather than on the
  // owner's word. See IDENTITY_CHECKS below for what each page actually said.
  { productId: "prod-dolphin-premier", asin: "B0GTYX922J", sourceUrl: "Owner-supplied 2026-08-03, read the same day: https://www.amazon.com/BUBLUE-Bubot-800P-Navigation-Scheduling/dp/B0GTYX922J" },
  { productId: "prod-aiper-scuba-s1", asin: "B0FJ818NNZ", sourceUrl: "Owner-supplied 2026-08-03, read the same day: https://www.amazon.com/Waterline-Cleaning-Filtration-Navigation-High-Precision/dp/B0FJ818NNZ" },
];


/**
 * MACHINE-READ IDENTITY CHECKS, 2026-07-31.
 *
 * A product page carries a details table with Brand, Model Name, Model Number
 * and Manufacturer Part Number, plus a canonical URL that Amazon derives from
 * the listing's own title. Those fields are readable, and between them they
 * settle the only question that matters here: IS THIS ASIN THE MODEL WE HOLD?
 *
 * This is identity ONLY. It is deliberately not a price check: the buy-box
 * price block (`priceToPay`) is absent from the markup served to a non-browser
 * client, so the dollar figures that ARE present belong to other sellers,
 * variants or comparison widgets and cannot be told apart from the real one. A
 * price still comes from a human looking at the buy box.
 *
 * That split is the point. The failure that reached production was an identity
 * failure — a dead ASIN, then a listing suspected of being superseded — and
 * identity is exactly the half that can now be checked automatically.
 */
interface IdentityCheck {
  asin: string;
  confirmed: boolean;
  /** The fields the page itself published, verbatim. */
  evidence: string;
  checkedOn: string;
}

export const IDENTITY_CHECKS: Record<string, IdentityCheck> = {
  "prod-aiper-scuba-x1": {
    asin: "B0GMPWMS2H",
    confirmed: true,
    evidence:
      "Details table gives Brand 'AIPER', Manufacturer 'AIPER', Model Name 'Scuba X1 Pro Max', Model Number 'X9-Grey', Power Source 'Battery Powered'; canonical URL /Robotic-Skimmer-Ultra-fine-Filtration-Inground/. Title: 'Aiper Scuba X1 Pro Max Pool Robot Vacuum & Robotic Pool Skimmer with 8,500 GPH Suction'. Aiper publishes a matching page at /us/aiper-scuba-series/aiper-scuba-x1-pro-max titled 'Scuba X1 Pro Max Pinnacle In-Ground Pool Cleaner'. The model name is written out in full, which is what separates it from the Pro and from the X1+HydroComm bundle that was refused.",
    checkedOn: "2026-08-03",
  },
  // Read on 3 August 2026. This record now holds a BuBlue, not a Dolphin —
  // see content/product-names.ts and the verification record for the move.
  "prod-dolphin-premier": {
    asin: "B0GTYX922J",
    confirmed: true,
    evidence:
      "Details table gives Brand 'BUBLUE', Manufacturer 'BUBLUE', Model Number 'Bubot 800P gen2', Power Source 'ac' and Product Dimensions 19\"L x 18\"W x 9\"H; Amazon's canonical URL is /BUBLUE-Bubot-800P-Navigation-Scheduling/. Title: '(2026 New) BUBLUE Bubot 800P Gen2 Robotic Pool Vacuum, Cleans Floor/Wall/Waterline/Shallow Area'. The Model Number field settles the 800P / 880P question outright.",
    checkedOn: "2026-08-03",
  },
  "prod-aiper-scuba-s1": {
    asin: "B0FJ818NNZ",
    confirmed: true,
    evidence:
      "Details table gives Brand 'AIPER', Manufacturer 'Aiper', Model Name 'Scuba S1' and Power Source 'Battery Powered'; canonical URL /Waterline-Cleaning-Filtration-Navigation-High-Precision/. Title: 'Aiper Scuba S1 Robotic Pool Cleaner, Wall & Waterline Cleaning, Dual Filtration, Extended 180-Min Battery Life'. The Model NUMBER field reads '1', which is junk and carries no weight either way — the match rests on brand plus model name plus a title naming the S1, the same basis the E10 was accepted on. It names the S1 and not the S1 Pro, which is the distinction that matters for this product.",
    checkedOn: "2026-08-03",
  },
  "prod-betta-se-plus": {
    asin: "B0CVMQ3XBX",
    confirmed: true,
    evidence:
      "Details table gives Brand 'Betta', Model Name / Model Number / Manufacturer Part Number all 'Betta-SE-Plus', Model Year 2023, ASIN B0CVMQ3XBX; canonical URL /Betta-SE-Plus-Continuous-Safeguard/. Title: 'Betta SE Plus - Solar-Powered Robotic Pool Skimmer with 24/7 Continuous Cleaning Power, Dual Charging Options, Twin Salt Chlorine Tolerant Motors, and Shallow Water Safeguard'.",
    checkedOn: "2026-07-31",
  },
  // RETIRED, and kept deliberately. This examined B0DMN6NV6H, which is no
  // longer the destination — the owner replaced it with B0G7B6F5FZ on 3 August
  // 2026. The record stays because the reading was real and may be needed again
  // if the swap is ever revisited; the ASIN field is what stops it vouching for
  // the listing that replaced it.
  "prod-beatbot-aquasense-2-ultra": {
    asin: "B0DMN6NV6H",
    confirmed: true,
    evidence:
      "Canonical URL /Beatbot-AquaSense-Cordless-Cleaning-Clarification/; Brand 'Beatbot', Model Number PRCMDS02G-2025. The feature bullets state '5-in-1 Cleaning Power — walls, floor, water surface, waterline, and water clarity', and water clarification is what separates the Ultra from the 4-in-1 Pro in the same series.",
    checkedOn: "2026-07-31",
  },
  "prod-dolphin-e10": {
    asin: "B0GV15VY1N",
    confirmed: true,
    evidence:
      "SerpApi details table: brand 'Dolphin', model name 'E10'. The model NUMBER field reads '1', which is junk and carries no weight either way; the match rests on brand plus model name plus a title naming the E10. The same search returned Nautilus AG, CC, CC Pro and CC Supreme as separate listings, so the siblings are distinguishable.",
    checkedOn: "2026-07-31",
  },
  // RETIRED, kept for the same reason as the Beatbot's: the reading was real,
  // and it applies to B0H5PY2SPF only.
  "prod-aiper-seagull-se": {
    asin: "B0H5PY2SPF",
    confirmed: true,
    evidence:
      "SerpApi details table: brand 'AIPER'; model name and model number both 'Seagull SE ZT20032026'. Sold by AiperDirect, the brand's own storefront. A renewed listing and a charger accessory in the same search were refused.",
    checkedOn: "2026-07-31",
  },
  // RETIRED TWICE OVER: this examined B0F9WN961G, which is no longer the
  // destination, for the Scuba X1, which is no longer the model this record
  // holds. Kept because "the listing we used to point at could not name itself
  // and had nothing to buy" is the reason the swap happened. Keyed separately
  // from the live check above so both readings survive.
  "retired-prod-aiper-scuba-x1-B0F9WN961G": {
    asin: "B0F9WN961G",
    confirmed: false,
    evidence:
      "NOT CONFIRMED, and now also CURRENTLY UNAVAILABLE. The listing publishes no model name — title 'AIPER Pool Cleaner', with model name, model number and manufacturer part number all 'Blue', a colour — and the SerpApi read of 2026-07-31 found no buying option at all. Two independent failures: nothing to buy, and no way to confirm what it is.",
    checkedOn: "2026-07-31",
  },
};

/**
 * What a human found when they searched Amazon for a product we hold no ASIN
 * for. "We never looked" and "we looked and it is not sold there" are different
 * facts, and only the second one is a reason to stop looking.
 *
 * These come from the owner searching in a browser, which is the only method
 * available: Amazon's search results are not readable by fetch, and the /s?k=
 * page returns HTTP 200 whether or not it found anything.
 */
const SEARCH_FINDINGS: Record<string, { checkedOn: string; finding: string }> = {
  "prod-dolphin-premier": {
    checkedOn: "2026-07-31",
    finding:
      "Owner searched Amazon US in a browser and found NO Dolphin Premier listing. This is an absence confirmed by a person, not a gap in our research — the product does not appear to be sold on Amazon US at all. It is already `candidate_under_review` in the Job 8 record, and having no US retail destination is a second, independent reason to question its place in the launch ten.",
  },
};

/** Products with no Amazon listing URL in the Job 8 record. */
const NO_AMAZON_DESTINATION = [
  // WYBOT C1 was here. ASIN B0G64JV6K4 was carried for it and was DEAD —
  // /dp/B0G64JV6K4 returned Amazon's "couldn't find that page" (confirmed by
  // content check and by the owner in a browser, 2026-07-31) — so it was pulled
  // rather than left pointing at a 404. The owner supplied a live replacement,
  // B0GYWJMNWK, on 3 August 2026 and it now sits in AMAZON_ASINS above. The
  // history stays here because "we once shipped a dead link for this product"
  // is the fact a reviewer needs, and deleting the note would erase it.
  // Dolphin Premier was here too, on the owner's browser search finding no
  // Amazon US listing at all. That finding stands and is kept in
  // SEARCH_FINDINGS: the DOLPHIN is still not sold there. The record itself no
  // longer holds a Dolphin — the owner replaced it with a BuBlue on 3 August
  // 2026, and the BuBlue does have a listing.
  //
  // Aiper Scuba S1 was here as well, every candidate having been a sibling.
  // The owner supplied a listing that names the S1 outright.
  //
  // The Scuba X1 Pro was here for part of 3 August 2026, for want of a CORRECT
  // listing rather than any listing. It left the same day: the owner supplied
  // the Pro Max, whose listing names itself in its own details table.
];

/* ==================================================================
   WINDOW-CLEANING ROBOTS — added 6 August 2026.

   ELEVEN PUBLISHED REVIEWS THAT COULD NOT BE BOUGHT FROM. The window
   category went live on 5 August with reviews, specifications and a
   "Buy" heading on every page, and no destination, no redirect key and
   no offer behind any of them. Checked on botplanet.io the same day:
   every window review returns 200, shows a Buy section, and contains
   zero prices and zero /go/ links. The pool review beside it carries
   both. A third of the published site was ranking and could not earn.

   The ASINs were not missing either. They had been researched on
   5 August and written up in docs/seo/window-cleaning-robots-asins.md,
   including the sibling traps — and never wired to anything.

   IDENTITY IS MACHINE-READ, not inherited from that document. All
   eleven listings were read on 6 August 2026 by
   scripts/amazon-identity-check.mjs: title, Brand, Item model number,
   the availability block, and the ASIN Amazon actually served against
   the ASIN requested. That last check is what protects the Mamibot,
   which ships as a three-colour variant family.

   exactModel IS WRITTEN OUT HERE rather than read from VERIFICATIONS.
   The verification ledger is pool-only, so model() would have returned
   the productId string as the "exact model" for all eleven — a lookup
   that silently degrades is worse than one that is absent, so these
   name themselves.
   ================================================================== */
interface WindowDestination {
  productId: string;
  asin: string;
  exactModel: string;
  /**
   * What the listing's own fields said, verbatim, on the day it was read.
   *
   * This is copied into IDENTITY_CHECKS below rather than living only on the
   * destination. The distinction matters: offers.test.ts asserts that anything
   * claiming `verified_exact` has an IDENTITY_CHECK naming a field somebody
   * actually read. Evidence that sits only in a destination's notes satisfies
   * nobody's guard, which is how you end up with eleven confident-looking
   * records that no test has ever examined.
   */
  evidence: string;
}

const WINDOW_CHECK_DATE = "2026-08-06";

const WINDOW_ASINS: WindowDestination[] = [
  {
    productId: "prod-ecovacs-winbot-w2-pro-omni",
    asin: "B0DR8Y4VF9",
    exactModel: "ECOVACS WINBOT W2 PRO Omni",
    evidence:
      "Brand 'ECOVACS', Item model number 'W2MP', availability block reads 'In Stock'. Title: 'ECOVACS WINBOT W2 PRO Omni Portable Window Cleaning Robot with Multi-Functional Station, Charging While Working, Intelligent Cleaning with Triple Nozzle Water Sprayer, 12-Level Protection'. The title names the Omni in full, which is what separates it from the plain W2 PRO below — the two are different machines at different prices and this pair is the category's most likely confusion.",
  },
  {
    productId: "prod-ecovacs-winbot-w2-pro",
    asin: "B0DSKC7QT7",
    exactModel: "ECOVACS WINBOT W2 PRO",
    evidence:
      "Title: 'ECOVACS WINBOT W2 PRO Window Cleaning Robot, 3 Nozzles Water Sprayer, 10-Level Protection, Win-SLAM 4.0 Path Planning, Steady-Climbing, Edge Detection'. Brand 'ECOVACS'. No 'Omni' anywhere in the title or fields, and the Omni is denied explicitly, so this cannot be its sibling. Item model number is not published on this listing.",
  },
  {
    productId: "prod-ecovacs-winbot-w3-omni",
    asin: "B0GJDQ59J1",
    exactModel: "ECOVACS WINBOT W3 Omni",
    evidence:
      "Brand 'ECOVACS', availability 'In Stock'. Title: 'ECOVACS WINBOT W3 Omni Robot Window Cleaner with Auto-Clean & Multi-Functional Station, Win-SLAM 5.0 Smart Navigation'. Win-SLAM 5.0 is the generation marker that separates the W3 from the W2 family, which ships 4.0.",
  },
  {
    productId: "prod-ecovacs-winbot-w1-pro",
    asin: "B0C2CQP8ZS",
    exactModel: "ECOVACS WINBOT W1 PRO",
    evidence:
      "Brand 'ECOVACS'. Title: 'ECOVACS Winbot W1 Pro Window Cleaning Robot, Intelligent Cleaning with Dual Cross Water Spray Technology, Win SLAM 3.0 Path Planning, 2800Pa Suction'. Win SLAM 3.0 and 2800Pa are the W1 Pro's own figures and match no other machine in the range.",
  },
  {
    productId: "prod-ecovacs-winbot-w2s",
    asin: "B0G5Y3NHTX",
    exactModel: "ECOVACS WINBOT W2S",
    evidence:
      "Brand 'ECOVACS', availability 'In Stock'. Title: 'ECOVACS WINBOT W2S Window Cleaning Robot, Intelligent Edge-to-Edge Cleaning with TruEdge Scrubbers, 3 Water Nozzles, 10-Level Safety System'. The W2S Omni (B0G5XYX1VH) is a different machine at a different price; 'omni' is a deny token here, so it refuses before 'w2s' can confirm.",
  },
  {
    productId: "prod-ecovacs-winbot-mini",
    asin: "B0DR8W696Y",
    exactModel: "ECOVACS WINBOT Mini",
    evidence:
      "Brand 'ECOVACS', availability 'In Stock'. Title: 'ECOVACS WINBOT Mini Window Cleaning Robot - Compact Design, Dual Nozzles with Ultrasonic Spray, 9-Stage Protection System'. The Mini2 (B0GJDHYRLR) is denied by its own token, which matters because 'mini' is a whole-token substring of 'mini2' in the other direction.",
  },
  {
    productId: "prod-hobot-2s",
    asin: "B097CM7P9L",
    exactModel: "HOBOT-2S",
    evidence:
      "Sold by 'Home Robot LLC', availability 'In Stock'. Title: 'HOBOT-2S Window Cleaning Automatic Robot with Ultrasonic Water Spray, Intelligent Cleaning, AI Smart Route Plan, Dual Replaceable Water Tanks'. The hyphenated 'HOBOT-2S' is the manufacturer's own model style and distinguishes it from the 298, 288, 388 and 268, all of which are denied.",
  },
  {
    productId: "prod-hobot-298",
    asin: "B07LF4HZ6C",
    exactModel: "HOBOT-298",
    evidence:
      "Brand 'HOBOT', sold by 'Home Robot LLC', availability 'In Stock'. Title: 'HOBOT-298 Window Cleaning Automatic Robot with Ultrasonic Water Spray, Intelligent Cleaning, AI Smart Route Plan, Replaceable Water Tank'. Single water tank against the 2S's dual, which is the visible difference between the two.",
  },
  {
    productId: "prod-cop-rose-x5s",
    asin: "B09D98W5KQ",
    exactModel: "Cop Rose X5S",
    evidence:
      "Brand 'Cop Rose'. Title: 'Cop Rose X5S Window Cleaner Robot Smart Robotic Window Cleaner with Auto Water Spray Vacuum Robotic Robot by Remote Controller Washer for High Windows'. Brand field and title agree on X5S.",
  },
  {
    productId: "prod-mamibot-w120-dp",
    asin: "B0DC6B81Z2",
    exactModel: "Mamibot W120-DP (Blue)",
    evidence:
      "Brand 'Mamibot', sold by 'Mamibot store', availability 'In Stock'. Title: 'Mamibot W120-DP Window Cleaning Robot, 7000Pa Strong Suction, 10 Cleaning Modes, 4-Spray Water Jet, Smart Edge Detection, App & Remote Control'. THIS IS A VARIANT FAMILY — Orange B0DC67MQ46 and Grey B0DC67QH41 are the same model in other colours — so the check that matters is that Amazon served B0DC6B81Z2 when B0DC6B81Z2 was requested. It did. The W120-T is a different machine the owner found unbuyable on 5 August and it is denied by name.",
  },
  {
    productId: "prod-hutt-s55-pro",
    asin: "B0GFW8TFML",
    exactModel: "HUTT S55 Pro",
    evidence:
      "Brand 'HUTT', sold by 'HUTT US Store', availability 'In Stock'. Title: 'HUTT S55 Pro Window Cleaning Robot, 3D Floating Pads, Up to 6500Pa Suction, HydroJet Pump Spray, SLAM 4.0 Navigation, 80ml Water Tank, 6 x Cloths'. The model name INCLUDES 'Pro'. 's55' is deliberately NOT a deny token — it is a whole-token substring of this machine's own name, and denying it is the mistake that made the Aiper X1 Pro Max refuse itself for a day. The W55 (B0CJ4RZZNY), DDC55 and A1 are denied instead.",
  },
];

const COMPANION_CHECK_DATE = "2026-08-08";

/**
 * Companion robots. Read the same way as the window eleven, one at a time.
 *
 * THE CATEGORY'S BEST-KNOWN NAMES ARE NOT HERE, and that is the finding rather
 * than an omission. Sony aibo, ElliQ, Tombot Jennie, Cozmo and Moxie have no
 * Amazon US listing at all, and Living.AI's EMO returns only unbranded
 * knockoffs — 43,900 searches a month between them with nothing to sell. See
 * docs/seo/companion-robots-research-findings.md.
 */
const COMPANION_ASINS: WindowDestination[] = [
  {
    productId: "prod-moflin",
    asin: "B0GPHNLWP3",
    exactModel: "Casio Moflin (Silver)",
    evidence:
      "Title: 'Casio Moflin AI Smart Companion Robot - Silver | AI-powered interactive companion; emotional evolution; MofLife app compatible; stress relief'. Served ASIN equals the one requested, and the availability block reads 'In Stock' with $429 showing on 8 August 2026. THE DETAILS TABLE IS ABSENT FROM THIS LISTING — no Brand row, no Item model number, nothing the other reads could quote, so identity rests on the title naming Casio, Moflin and the colourway together. That is weaker than the window eleven and is recorded as weaker. A VARIANT FAMILY: Casio sells Silver and Gold; this ASIN is the Silver, and the served-ASIN equality check is what stops the Gold's data being accepted in its place.",
  },
  {
    productId: "prod-miko-3",
    asin: "B0GV37M678",
    exactModel: "Miko 3 (Red)",
    evidence:
      "Title: 'Miko 3 AI Robot for Kids - Smart Educational & STEAM Learning Robot with Interactive Apps, Games, Stories & Activities for Girls & Boys Ages 5-10 | Red'. Served ASIN equals the one requested; availability reads 'In Stock' at $299 on 8 August 2026. A VARIANT FAMILY, AND THE SECOND ASIN WAS NEARLY RECORDED AS A DUPLICATE: B0GV2L2PDL carries a byte-identical title ending '| Blue', serves its own ASIN, and is also in stock at $299. Two listings for one machine in two colours, not two machines and not a stale row. Red is the one held; the served-ASIN equality check is what stops Blue's data being accepted in its place. Miko also sells a Mini and a Max, and neither name appears anywhere in this listing.",
  },
  /* EDUCATIONAL AND CODING ROBOTS, 8 August 2026. Five of the twelve planned.
     The other seven are not here on purpose: five had the wrong ASIN or the
     wrong product behind them — a $691 six-robot class pack for the Bee-Bot, a
     $597 education SKU for SPIKE Essential, an RVR+ where the RVR was asked
     for — and two cannot be bought at all. This category sells to schools as
     much as to parents, and the failures are all the school side of it.
     See docs/seo/coding-robots-findings.md. */
  {
    productId: "prod-sphero-bolt",
    asin: "B07DLM5DL7",
    exactModel: "Sphero BOLT",
    evidence:
      "Title: 'Sphero Bolt Coding Robot Ball, Ages 8+ | Beginner to Advanced Programming, Draw, Blocks, Javascript, or Python, Programmable Sensors & LED Matrix'. Served ASIN equals the one requested; $179, In Stock, 8 August 2026. Details give Sub Brand 'BOLT', Age Range Description 'Ages 8+ for elementary, middle and high school', Item Dimensions 2.87 x 2.87 x 2.87 inches, Item Weight 1.1 pounds, Battery Description 'Lithium-Ion Polymer'. Sphero sells BOLT, BOLT+, Mini, indi, RVR and SPRK+ and every one of them matches a bare 'sphero'; the Sub Brand row is what pins this to the BOLT.",
  },
  {
    productId: "prod-sphero-mini",
    asin: "B072B6QVVW",
    exactModel: "Sphero Mini (Blue)",
    evidence:
      "Details give Sub Brand 'Mini', Colour 'Blue', Item Dimensions 1.57 x 1.57 x 1.57 inches, Item Weight 0.11 kg, Age Range Description '96 months to 1200 months', Battery Description 'Rechargeable battery, 1 hour play'. Served ASIN equals the one requested; $50, In Stock. A VARIANT FAMILY: Sphero sells the Mini in several colours and this ASIN is the Blue. The productTitle element did not render on the read, so identity rests on the details table rather than the title — weaker than the BOLT above and recorded as such.",
  },
  {
    productId: "prod-sphero-indi",
    asin: "B094X6TV5V",
    exactModel: "Sphero indi At-Home Learning Kit",
    evidence:
      "Title: 'sphero Indi At-Home Learning Kit Screenless Coding Robot | Ages 4+'. Served ASIN equals the one requested; $100, In Stock. Details give Age Range Description '4+', Manufacturer Minimum Age 48 months and Maximum 144 months, Item Weight 0.56 kg, Material Type 'Plastic, Silicone', Colour 'At Home Learning Starter Kit'. THE KIT MATTERS: Sphero also sells indi as a classroom pack, and the colour row is what identifies this as the at-home one.",
  },
  {
    productId: "prod-ozobot-evo",
    asin: "B0CSR53WXV",
    exactModel: "Ozobot Evo Entry Kit",
    evidence:
      "Title: 'Ozobot Evo Coding Robot Kit | Ages 5-11 | STEM Coding for Kids & Teachers'. Served ASIN equals the one requested; $175, In Stock. Details give Set Name 'Evo Entry Kit', Item Dimensions 8.5 x 6.5 x 1.8 inches, Item Weight 0.44 kg, Educational Objective 'Coding Skills, STEM'. NOTE ON THE AGE FIELD: Amazon's Age Range Description reads 'Toddler', which contradicts the title's 'Ages 5-11' and Ozobot's own rating. The title and the manufacturer age months (up to 1188) are believed over the category label, and the page uses 5-11.",
  },
  {
    productId: "prod-makeblock-mbot",
    asin: "B00SK5RUQY",
    exactModel: "Makeblock mBot",
    evidence:
      "Title: 'Makeblock mBot STEM Coding Toys Robotics for Kids Ages 8-12 | Learn to Code with Scratch'. Served ASIN equals the one requested; $69, In Stock. Makeblock also sells the mBot2, the mBot Ranger and the mBot Ultimate, and none of those names appears in this title. The productTitle element did not render on the second read, so this rests on the search-result title and the served-ASIN equality rather than a details table.",
  },
  /* PET CAMERA ROBOTS, 8 August 2026. Read listing by listing rather than by
     search, and the reason is in the third entry below: the discovery script's
     candidate for the EBO SE was B0CGV82XTT, whose title reads "Rocon Ebo SE"
     and which serves an ASIN other than the one requested. A reseller listing
     wearing the product's name, caught only because every listing here was
     opened individually. */
  {
    productId: "prod-enabot-ebo-air-2",
    asin: "B0DZHDF7MD",
    exactModel: "Enabot EBO Air 2",
    evidence:
      "Title: 'Enabot EBO Air 2 Mobile Pet Camera Robot: 2K FamilyBot with Two-Way Talk'. Served ASIN equals the one requested. Sold by 'Enabot Official Store', shipped by Amazon, In Stock at $149.99 on 8 August 2026. Details give Video Capture Resolution '1296p, 2k', Item Dimensions 3.74 x 3.74 x 3.51 inches, Item Weight 0.74 kg. A VARIANT FAMILY: B0DZHG7Y6T and B0DZHG4LZK carry identical titles at the same price and serve their own ASINs — colours of one machine. The Air 2S (B0FWK8BCXD, 2.5K, $299) and Air 2 Plus (B0FD9VNX5Y, 3K with GPT and Gemini, $359) are DIFFERENT machines in the same family and are named on the page rather than sold as this one.",
  },
  {
    productId: "prod-enabot-ebo-se",
    asin: "B09R6V3CJM",
    exactModel: "Enabot EBO SE",
    evidence:
      "Title: 'Enabot EBO SE Home Robot Camera: 1080P Mobile FamilyBot Pet Companion'. Served ASIN equals the one requested. Sold by 'Enabot Official Store', In Stock at $119.99 on 8 August 2026. Details give Field Of View '360 degrees', resolution 1080p, Item Dimensions 3.8 x 3.8 x 3.5 inches. THIS IS NOT B0CGV82XTT, which the discovery pass proposed: that listing is titled 'Rocon Ebo SE Pet Robot Camera', serves a different ASIN than the one requested, and is a reseller rather than Enabot. Same price, same product name, wrong seller — exactly the substitution the served-ASIN check exists to refuse.",
  },
  {
    productId: "prod-enabot-rola-petpal",
    asin: "B0GMQW1HX6",
    exactModel: "Enabot ROLA PetPal",
    evidence:
      "Title: 'Enabot EBO ROLA PetPal Mobile 2.5K Pet Camera Robot with Treat Dispenser'. Sold by 'Enabot Official Store' at $179.99 on 8 August 2026, 4.0 stars from 26 ratings. Details give Special Feature '2-Way Audio, 2.5K Resolution Camera, Auto-Recharge, Mobile Pet Camera Robot with Treat Dispenser, Modular Design' and Item Dimensions 9.02 x 9.02 x 10 inches. The listing's own Q&A answers the subscription question outright: 'Do I need a subscription to use ROLA PetPal? No.' A SIBLING SHARES THE ROLA NAME: the ROLA Mini (B0DDC9DZKK, $139) has no treat dispenser, and the dispenser is the whole reason this model exists.",
  },
  {
    productId: "prod-ropet",
    asin: "B0GTPZ4N4M",
    exactModel: "Ropet KAMOMO pro",
    evidence:
      "Details table gives Brand Name 'ropet', Model Name 'ropet KAMOMO pro', Manufacturer 'ropet', Manufacturer Part Number 'pro', Included Components 'ropet KAMOMO', Age Range Description 'over 3 years old', Item Dimensions 9.92 x 5.91 x 5.91 inches, Item Weight 1.3 pounds. Title: 'KAMOMO Companion Interactive Robot Pet, Emotional Support for Kids and Adults, AI Desk Robots, Anxiety Relief Comfort Gift'. Sold by 'ropet' and shipped by Amazon, In Stock at $299 on 8 August 2026. A NEW PRODUCT AND THE RATING COUNT SAYS SO: 4.1 stars from 47 ratings, against 12,307 for the Joy For All cat. The listing is the Pro configuration — its packing list names the charging base, which the maker sells separately at ropetai.com — so the ASIN is the bundle rather than the bare robot.",
  },
  {
    productId: "prod-joy-for-all-companion-pets",
    asin: "B017JQQ00Q",
    exactModel: "Joy For All Companion Pet Cat, B7594 (Silver with White Mitts)",
    evidence:
      "Details table gives Manufacturer 'Joy For All', Manufacturer Part Number 'B7594', Included Components 'Silver Cat', Age Range Description 'Seniors', Supported Battery Types '4 x 1.5V C Alkaline Batteries', Material Type 'Synthetic fur (plastic)', Item Weight 1 kg, Item Dimensions 15.24 x 9.02 x 10.12 inches. Sold by 'Ageless Innovation LLC', In Stock at $159 on 8 August 2026, 4.5 stars from 12,307 ratings. Served ASIN equals the one requested. A VARIANT FAMILY: Ageless Innovation sells the cat in several colourways and a dog as well, so the part number and the Included Components row are what pin this to the Silver with White Mitts.",
  },
  {
    productId: "prod-loona",
    asin: "B0DCF53PCH",
    exactModel: "Loona Petbot (KEYi Tech)",
    evidence:
      "Title: 'Loona Robot Pet Dog ChatGPT-4o Smart AI-Powered Companion Voice & Gesture Control, Real-Time Interaction Robotics Toys for Kids, Home Monitoring - Includes Charging Dock'. Served ASIN equals the one requested; $499, In Stock, 4.1 stars from 1,234 ratings on 8 August 2026. THIS PRODUCT WAS NEARLY MISSED TWICE, both times by tooling rather than by absence. The first discovery pass returned 'Play Ball for Loona Pet Robot' as the candidate, because an accessory carries every token of the product it attaches to. The identity check then REFUSED this listing on a deny token of my own writing, 'charging dock :', which matched Amazon's own ' : Toys & Games' title suffix on a listing whose name ends 'Includes Charging Dock'. Both faults are fixed in the scripts; this entry exists because a refusal was read rather than believed.",
  },
  {
    productId: "prod-eilik",
    asin: "B0C2C9LJNQ",
    exactModel: "Eilik (Energize Lab)",
    evidence:
      "Title: 'ENERGIZE LAB Eilik - Your Desktop Companion Full of Personality with Expressive Animations & Reactions, Touch-Response...'. Served ASIN equals the one requested; $139.99, in stock, 8 August 2026 — the same figure Energize Lab's own store shows. THE RANGE IS THE TRAP HERE, not a sibling model number. Energize Lab sells Eilik ($139.99), Eilik DQ ($199.98), the Eilik AI Station ($99), Panxer ($119.90) and Eiliko ($59.90), and Amazon lists most of them under the same brand with near-identical artwork. This ASIN is the base Eilik: the title names no DQ, no Station and no Panxer, and Eiliko is a different product with its own name.",
  },
  {
    productId: "prod-vector-2",
    asin: "B07G3ZNK4Y",
    exactModel: "Anki Vector 2.0 (Black)",
    evidence:
      "Title: 'Anki Vector 2.0 AI ChatGPT Connected Robot Companion - Smart Autonomous Home Robot with Face Recognition and Voice Conversations - ChatGPT Subscription Required (Black)'. Sold by the Digital Dream Labs Store; 4.0 stars from 11,120 ratings. Served ASIN equals the one requested. Details table gives Item Dimensions 3.93 x 2.36 x 2.73 inches and Power Source battery. THE LISTING STATES THE SUBSCRIPTION REQUIREMENT IN ITS OWN TITLE, which is unusually honest for this category and is the fact the review is built on. PRICE MOVED WHILE THIS WAS BEING BUILT: $199.99 read at 02:07 and $184 at 03:15 on 8 August 2026, both from this ASIN. Neither is published — it is the clearest demonstration on this site of why a price comes from the refresh service with the date it was read rather than from a note somebody typed once.",
  },
];

for (const c of COMPANION_ASINS) {
  IDENTITY_CHECKS[c.productId] = {
    asin: c.asin,
    confirmed: true,
    evidence: c.evidence,
    checkedOn: COMPANION_CHECK_DATE,
  };
}

const LITTER_LAWN_CHECK_DATE = "2026-08-08";

/**
 * SELF-CLEANING LITTER BOXES AND ROBOTIC LAWN MOWERS — the offers, 8 August 2026.
 *
 * These eleven were published on 8 August with identity confirmed and no
 * commercial wiring at all: `OFFER_SETUP_PENDING`, which says out loud that a
 * product is verified and has no buy route yet. That state has a thirty-day
 * shelf life and it is being spent here rather than allowed to run.
 *
 * IDENTITY WAS READ AGAIN BEFORE ANY BUTTON WAS WIRED, not inherited from
 * docs/seo/litter-lawn-verification-2026-08-08.md. The earlier pass proved
 * these ASINs are the right machines; this pass exists because publishing a
 * page and sending a buyer somewhere are different promises, and the second one
 * gets its own read. All eleven were re-read through the SerpApi product engine
 * on 8 August: every listing served the ASIN that was requested, every title
 * names its own model, and every price came back identical to the earlier read.
 *
 * ONE CORRECTION TO THAT DOCUMENT, and it matters commercially. It records "the
 * product engine did not return a stock field for any of the ten". It does —
 * the field is `stock`, not `availability`, and all eleven returned one on both
 * passes. The wording is transcribed below for each. No offer publishes a stock
 * claim from this, because a destination read is not the offer engine's own
 * refresh; it goes to the price checker as an expectation and the first
 * accepted observation is what a page will ever quote.
 */
const LITTER_ASINS: WindowDestination[] = [
  {
    productId: "prod-litter-robot-4",
    asin: "B0BH6MD3DJ",
    exactModel: "Litter-Robot 4 with Step & Fence (Whisker, Black)",
    evidence:
      "Title: 'Litter-Robot 4 with Step & Fence by Whisker, Black | Automatic, Self-Cleaning Cat Litter Box, Helps Reduce Litter Box Odors, Never Scoop Again, Includes 1 Year of WhiskerCare'. Served ASIN equals the one requested. Storefront 'Visit the Whisker Store', 4.3 stars from 178 ratings, $699.00 and stock wording 'Only 15 left in stock - order soon.' on 8 August 2026. THE BUNDLES OUTRANK THE MACHINE IN SEARCH and this is the machine: B0FFDNZSHT and B0FFF2Y8R9 are $749 supply bundles, B0FFF4MYRT is a $799 accessory bundle, and all three carry the Litter-Robot 4 name. A VARIANT FAMILY as well — the listing publishes Color and Size dimensions — so the served-ASIN equality check is what stops a sibling's data being accepted for this one.",
  },
  {
    productId: "prod-petkit-purobot-max-pro-2",
    asin: "B0DM83CLW3",
    exactModel: "PETKIT Purobot Max Pro 2",
    evidence:
      "Title: 'PETKIT Purobot Max Pro 2 AI-Camera Automatic Cat Litter Box Large Opening | Cat's Facial Recognition 210° Wide Angle, 5G Wifi App Control Self Cleaning Litter Box, Odor-Free & Integration Safety'. Served ASIN equals the one requested; $509.99, stock wording 'In Stock', 4.0 stars from 45 ratings on 8 August 2026. The model name is written out in full including the '2', which is the whole point: the brief asked for a 'PuroBot Max Pro' and that is the previous generation. A separate Purobot Max 3 (B0F1YMM29X, $399.99) is a different tier rather than this one's successor, so buying on the numeral alone gets the wrong machine in either direction. This listing publishes no storefront row and no details table, so identity rests on the title and the served ASIN.",
  },
  {
    productId: "prod-casa-leo-loo-too",
    asin: "B09LL9S99B",
    exactModel: "Casa Leo, Leo's Loo Too",
    evidence:
      "Title: 'Casa Leo Automatic Self-Cleaning Cat Litter Box | with Leo’s Loo Too Wi-Fi App & Voice Control, App Weight Tracking, UV Odor Control, Safety Sensors, 30dB Quiet'. Served ASIN equals the one requested; $599.00, stock wording 'Only 17 left in stock - order soon.', 4.0 stars from 411 ratings, Amazon's Choice badge, 8 August 2026. THE STOREFRONT READS 'Visit the Smarty Pear Store' RATHER THAN CASA LEO, which looks wrong and is not: Smarty Pear is the maker that built Leo's Loo Too and Casa Leo is the brand it sells under. Both names appear on the one listing and neither is a reseller wearing the product's name. A Color variant dimension is published, so the served-ASIN check is doing real work here too.",
  },
  {
    productId: "prod-petsafe-scoopfree-crystal-pro",
    asin: "B0DR3JP2FZ",
    exactModel: "PetSafe ScoopFree Crystal Pro",
    evidence:
      "Title: 'PetSafe ScoopFree Crystal Pro Self-Cleaning Litter Box | Up to 30 Days Hands-Free Automatic Cleaning, Advanced Odor Control, Health Counter Display, LED Indicators, Removable Rake'. Served ASIN equals the one requested. Storefront 'Visit the PetSafe Store', $229.99, stock wording 'In Stock', 3.1 stars from 183 ratings on 8 August 2026. THE CLOSEST TRAP ON THE WHOLE SITE SITS FOUR CENTS AWAY: B07X3XFB6K is the ScoopFree Crystal Pro *Legacy* Front-Entry at $229.95, PetSafe's own word for the previous generation printed in its own title, and its B07 prefix dates it years before this B0D one. 'legacy' is therefore a deny token and 'crystal pro' alone can never confirm — it is a whole-token substring of the Legacy's name as well as of this one. Crystal Pro Legacy uncovered (B07WZPJ2LW, $142.49) and Crystal Classic (B0CFRY7VYN, $99) are the other two live SKUs and are denied by name.",
  },
];

const LAWN_ASINS: WindowDestination[] = [
  {
    productId: "prod-navimow-i110n",
    asin: "B0CX7T6BR3",
    exactModel: "Segway Navimow i110N",
    evidence:
      "Title: 'Segway Navimow i110N Robot Lawn Mower Perimeter Wire Free 1/4 Acre RTK+Vision Robotic Lawnmower, AI-Assisted Mapping, Virtual Boundary, APP Control, 58dB(A) Quiet, Multi-Zone Management'. Served ASIN equals the one requested. Storefront 'Visit the NAVIMOW Store', $1,099.00, stock wording 'In Stock', 4.4 stars from 498 ratings on 8 August 2026. THE KITTED VERSIONS ARE SEPARATE ASINS AT HIGHER PRICES and are denied: B0D7HG4319 is the i110N with the Rough Terrain Kit at $1,168.30 and B0CZ3R3SJH is the i110N with Garage S at $1,298. Both are genuinely this mower plus hardware, which is exactly why the destination has to name a SKU rather than search the model — a bundle is not a cheaper or dearer version of the same purchase, it is a different one. The i206 AWD (B0G814F6Z4, $999) is a different machine in the refreshed i2 line.",
  },
  {
    productId: "prod-luba-3-awd-1500h",
    asin: "B0GKNYZPC3",
    exactModel: "Mammotion LUBA 3 AWD 1500H",
    evidence:
      "Title: 'Mammotion LUBA 3 AWD 1500H Robot Lawn Mower, 0.37 Acre, 2.2\"-4.0\" Cutting | 360° LiDAR+Dual-Camera AI Vision, 4300 sq.ft/h, AWD for 80% Slopes, 15 Multi-Zone Management'. Served ASIN equals the one requested. Storefront 'Visit the Mammotion Store', $2,399.00, stock wording 'Only 1 left in stock - order soon.', 3.9 stars from 20 ratings on 8 August 2026. THE SIZE IS THE MODEL: 1500H and 3000H are 0.37 and 0.75 acre and both are published here as separate products, so '3000h' is a deny token and '1500h' is what confirms. The Luba 2 the brief named is superseded by Mammotion's own page and is not sold under this record.",
  },
  {
    productId: "prod-luba-3-awd-3000h",
    asin: "B0GKNQKJJQ",
    exactModel: "Mammotion LUBA 3 AWD 3000H",
    evidence:
      "Title: 'Mammotion LUBA 3 AWD 3000H Robot Lawn Mower, 0.75 Acre, 2.2\"-4.0\" Cutting | 360° LiDAR+NetRTK+AI Vision, 5400 sq.ft/h, AWD for 80% Slopes, 30 Multi-Zone Management'. Served ASIN equals the one requested. Storefront 'Visit the Mammotion Store', $2,799.00, stock wording 'In Stock', 3.9 stars from 22 ratings on 8 August 2026. NOTE THE NAVIGATION DIFFERENCE the titles publish and the specs did not: the 3000H reads 'LiDAR+NetRTK+AI Vision' where the 1500H reads 'LiDAR+Dual-Camera AI Vision'. The garage bundles B0GKM8JZDF and B0H1R9RJ3F sell this mower at $3,008 and are denied — same machine, different purchase.",
  },
  {
    productId: "prod-automower-410iq",
    asin: "B0DTV7TR6W",
    exactModel: "Husqvarna Automower 410iQ",
    evidence:
      "Title: 'Husqvarna 410iQ ½ Acre Wire-Free, 45% Slope, app Based, Robot Lawn Mower | Wire-free robot mower with EPOS®, app-set virtual zones, handles 45% slopes, all lawns, up to ½ acre, 4-year warranty'. Served ASIN equals the one requested; $2,499.99, stock wording 'Only 7 left in stock (more on the way).', 3.9 stars from 68 ratings on 8 August 2026. THIS IS THE LISTING THE SEARCH ROW HIDES: search truncates the front of the title and the brand token disappears, which is why every ASIN here was re-read through the product engine rather than judged from a search result. The 420iQ (B0DTVF4QGY, $3,144.37) is the larger sibling and is denied, as is the bundle B0GP91BFFB. Two prices were in circulation for this mower — $1,550 in a round-up and $2,499.99 on Amazon — and the figure recorded is the one read from the listing itself.",
  },
  {
    productId: "prod-worx-landroid-vision-wr320",
    asin: "B0GN8KK8XW",
    exactModel: "WORX WR320 Landroid Vision Cloud",
    evidence:
      "Title: 'WORX Robot Lawn Mower for 1/2 Acre, No Perimeter Wire, WR320 | Landroid Vision Cloud with AI Obstacle Avoidance, RTK Cloud Navigation, Auto Mapping, App Control, 30% Slope'. Served ASIN equals the one requested; $1,022.54, stock wording 'In Stock', 4.4 stars from 70 ratings on 8 August 2026. 'LANDROID VISION' IS A FAMILY, NOT A MODEL, which is why the SKU is in the name we publish: WO7144 is the 1/4 acre at $999.99, WR342 the 4WD 1/2 acre at $2,069.99 and WR344 the 4WD 1 acre at $2,646.18. All four are live, all four answer to 'Landroid Vision', and three of them are denied here by their own SKU. The listing publishes Style and Size variant dimensions, so the served-ASIN equality check is load-bearing.",
  },
  {
    productId: "prod-eufy-e15",
    asin: "B0DRVYDXWX",
    exactModel: "eufy Robot Lawn Mower E15",
    evidence:
      "Title: 'eufy Robot Lawn Mower E15, Auto Mapping, Pure Vision Navigation | Wire Free RTK Free, Multi-Zone Management, AI Obstacle Avoidance, APP Control, 18° Slope, Cut Height 1\"-3\"'. Served ASIN equals the one requested; $1,199.99, stock wording 'In Stock', 4.4 stars from 100 ratings on 8 August 2026. The E15 and the E18 are the two machines in this line and the numeral is the whole difference between them, so 'e18' is denied and 'e15' confirms. This listing publishes no brand row, so identity rests on the title — which names eufy first — and on the served ASIN.",
  },
  {
    productId: "prod-dreame-a3-awd-1000",
    asin: "B0H3V799KT",
    exactModel: "DREAME A3 AWD 1000",
    evidence:
      "Title: '(Latest Upgrade) DREAME A3 AWD 1000 Robot Lawn Mower, 360° 3D LiDAR & AI Dual Vision Smart Robotic Mower for 0.25 Acre, 80% Slopes & 45min Fast Charge for Homeowners with Large/Steep Lawns'. Served ASIN equals the one requested; $1,599.99, stock wording 'In Stock', 3.8 stars from 13 ratings on 8 August 2026. THREE ASINS SELL THIS MODEL AT THIS PRICE AND ONLY ONE OF THEM IS THE BARE MACHINE ON ITS OWN LISTING. All three were read on 8 August. B0H761SNFG is titled '... A3 AWD 1000 + Cleaning Set+Blade Set' — the bundle, and it says so. B0H46DDHKC is the bare machine again at the same $1,599.99. Those two publish a 'Set name' variant dimension and share a rating count of 42, so they are two set choices under one parent, and a request for either can be answered with the other's data. THIS ASIN PUBLISHES NO VARIANTS AT ALL and carries its own 13 ratings, which is what makes it the safe destination as well as the correct one: there is no sibling set for the listing to substitute. The A3 AWD Pro / LiDAR 3500 (B0GR8TQHV9, $2,699.99) is the larger machine and is denied.",
  },
];

for (const p of [...LITTER_ASINS, ...LAWN_ASINS]) {
  IDENTITY_CHECKS[p.productId] = {
    asin: p.asin,
    confirmed: true,
    evidence: p.evidence,
    checkedOn: LITTER_LAWN_CHECK_DATE,
  };
}


/**
 * ROBOT VACUUMS — eleven machines that were researched, written up and
 * published with no buy path at all.
 *
 * THE ASINS WERE NEVER MISSING. Every one of these was read at Amazon on
 * 10 August 2026 and written into its review's own record, along with the
 * price and the sibling listings that had to be denied. What never happened is
 * the step that turns a read ASIN into an offer: the category was catalogued
 * outside the seed pipeline the other eight went through, so D1 held eleven
 * published products with zero offer rows and eleven reviews rendered a buy
 * heading with nothing under it.
 *
 * That is the largest category on the site — a 135,000/mo head term — and it
 * has been live and unmonetised since 10 August. Found by the full-site audit
 * of 14 August 2026.
 *
 * EVERY EVIDENCE STRING BELOW IS COPIED FROM THE REVIEW THAT RECORDED IT, not
 * re-derived and not re-read. Where a sibling listing exists it is named and
 * denied, because that is the failure this register exists to prevent — the
 * bundle, the colourway and the one-letter model variant are how a buy button
 * ends up on the wrong machine.
 */
const VACUUM_CHECK_DATE = "2026-08-10";

const VACUUM_ASINS: WindowDestination[] = [
  {
    productId: "prod-eufy-x10-pro-omni",
    asin: "B0CPFBBHP4",
    exactModel: "eufy X10 Pro Omni",
    evidence:
      "eufy X10 Pro Omni, ASIN B0CPFBBHP4. $449.99 read on 10 August 2026. B0DG5G9HQM is the same machine in white at the same price sharing one review pool, and is denied so a request cannot be answered with the other colourway's data.",
  },
  {
    productId: "prod-eufy-omni-s1-pro",
    asin: "B0CTY6VT8Y",
    exactModel: "eufy Robot Vacuum Omni S1 Pro",
    evidence:
      "eufy Robot Vacuum Omni S1 Pro, ASIN B0CTY6VT8Y. The Amazon search row returns no price; the listing itself read $919.58 on 10 August 2026. eufy's own product page returned 404 to a direct fetch the same day, so the listing is the only live source.",
  },
  {
    productId: "prod-roborock-s8-max-ultra",
    asin: "B0D9B9LK9F",
    exactModel: "roborock S8 Max Ultra with Refill & Drainage System",
    evidence:
      "roborock S8 Max Ultra with Refill & Drainage System, ASIN B0D9B9LK9F. $949.99 read on 10 August 2026. NOT the S8 MaxV Ultra, which is a different machine at a different price — the single letter is the whole difference and is why the SKU is carried in the name we publish.",
  },
  {
    productId: "prod-roborock-saros-10",
    asin: "B0DLH247PS",
    exactModel: "roborock Saros 10",
    evidence:
      "roborock Saros 10, ASIN B0DLH247PS. $1,299.99 read on 10 August 2026. A second listing, B0DLH45139, carries the same model with no price and is denied.",
  },
  {
    productId: "prod-roborock-qrevo-s5v",
    asin: "B0DSP8J476",
    exactModel: "roborock Qrevo S5V",
    evidence:
      "roborock Qrevo S5V, ASIN B0DSP8J476. $499.98 read on 10 August 2026. B0FX4SZ4KB is the same machine at the same price sharing one review pool and is denied.",
  },
  {
    productId: "prod-dreame-x40-ultra",
    asin: "B0CXDXKSXP",
    exactModel: "Dreame X40 Ultra",
    evidence:
      "Dreame X40 Ultra, ASIN B0CXDXKSXP. $599.99 read on 10 August 2026. B0DZHNSL1H is a second listing at $594.99 with a separate review pool and is denied.",
  },
  {
    productId: "prod-dreame-x50-ultra",
    asin: "B0DM5J52GC",
    exactModel: "Dreame X50 Ultra",
    evidence:
      "Dreame X50 Ultra, ASIN B0DM5J52GC. $999.99 read on 10 August 2026. B0F3J51GW5 and B0F3HZFZBL at $989.99 are the Complete bundle and are denied — the bundle is a different purchase.",
  },
  {
    productId: "prod-shark-powerdetect-av2820s",
    asin: "B0CDJFHM4J",
    exactModel: "Shark PowerDetect Self-Empty Robot Vacuum AV2820S",
    evidence:
      "Shark PowerDetect Self-Empty Robot Vacuum AV2820S, ASIN B0CDJFHM4J. $549.99 read on 10 August 2026. The RV2820ZE at $599.99 is the vacuum-only configuration and is denied.",
  },
  {
    productId: "prod-shark-matrix-plus-ur2650ws",
    asin: "B0FDX7GFQX",
    exactModel: "Shark Matrix Plus Robot Vacuum and Mop UR2650WS",
    evidence:
      "Shark Matrix Plus Robot Vacuum and Mop UR2650WS, ASIN B0FDX7GFQX. $279.99 read on 10 August 2026. The AI Ultra AV2501S and AV2511AE are different machines in the same family and are denied.",
  },
  {
    productId: "prod-roomba-max-705",
    asin: "B0DWG3C3ZF",
    exactModel: "iRobot Roomba Max 705 Robot Vacuum with AutoEmpty Dock",
    evidence:
      "iRobot Roomba Max 705 Robot Vacuum with AutoEmpty Dock, ASIN B0DWG3C3ZF. $499.00 read on 10 August 2026. B0DWG15XKQ at $799 is the Max 705 Combo — a different machine — and is denied.",
  },
  {
    productId: "prod-ecovacs-deebot-t90-pro-omni",
    asin: "B0GJ5S4V78",
    exactModel: "ECOVACS DEEBOT T90 PRO OMNI",
    evidence:
      "ECOVACS DEEBOT T90 PRO OMNI, ASIN B0GJ5S4V78. $599.00 read on 10 August 2026.",
  },
];

/**
 * CONFIRMED IS FALSE ON ALL ELEVEN, AND THAT IS NOT A FORMALITY.
 *
 * The window and lawn destinations were cleared by transcribing a published
 * field off the listing — Brand, Model Name, Model Number — verbatim. That is
 * what `confirmed` means here and offers.test.ts enforces it: name what the
 * page said, do not describe having looked at it.
 *
 * The vacuum verification of 10 August was a different method. SerpAPI's
 * amazon_product engine was asked for each pinned ASIN and returned price,
 * rating and review count, and the search titles carried the exact model term.
 * That is enough to publish a review and enough to wire a destination that
 * points at a specific ASIN. It is not a transcribed identity field, so
 * claiming `confirmed` would be claiming a check nobody ran.
 *
 * The buy buttons work either way — the destination is a pinned ASIN, not a
 * search — and the sibling ASINs that could be substituted are named and
 * denied in every evidence string above, which is the risk the delay was
 * actually about. What is outstanding is one field read per listing, and
 * marking it false is what keeps that visible instead of quietly done.
 */
for (const p of VACUUM_ASINS) {
  IDENTITY_CHECKS[p.productId] = {
    asin: p.asin,
    confirmed: false,
    evidence: p.evidence,
    checkedOn: VACUUM_CHECK_DATE,
  };
}

/**
 * The window identity checks, DERIVED from WINDOW_ASINS rather than typed out
 * a second time.
 *
 * The pool entries above are hand-written because each was read on a different
 * day by a different route — some machine-read, some owner-confirmed, two
 * retired and kept. These eleven were all read in one pass by one script on one
 * day, so writing them twice would only create somewhere for the two copies to
 * drift apart.
 */
for (const w of WINDOW_ASINS) {
  IDENTITY_CHECKS[w.productId] = {
    asin: w.asin,
    confirmed: true,
    evidence: w.evidence,
    checkedOn: WINDOW_CHECK_DATE,
  };
}


const SNOW_CHECK_DATE = "2026-08-11";

/**
 * ROBOT SNOW BLOWERS — one product, and the read that unblocked it.
 *
 * WHY THIS SAT WITHOUT A BUTTON. The Yarbo review shipped on 11 August 2026
 * carrying no buy link and saying so on the page. The ASIN we held had come
 * from an Amazon SEARCH RESULT TITLE rather than from a listing we had read,
 * and that is precisely where the roborock S8 MaxV Ultra investigation began
 * before every result carrying the searched name turned out to be an
 * accessory kit. A $4,999 machine is the worst possible place to be wrong.
 *
 * WHAT WAS ACTUALLY READ, and the limits of it. The listing at B0FJF9V1JC was
 * fetched directly and serves brand YARBO with the title 'YARBO 2-Stage 24/7
 * Autonomous Robot Snow Blower with Modular Design | 24/7 Autonomous with
 * 6-40ft Throwing Distance, 12" Intake Height, 24" Cleaning Width, AI
 * Multi-Zone Mapping & RTK GPS'.
 *
 * THE DETAILS TABLE STILL COULD NOT BE READ — the response truncates before
 * it, so there is no Model Number field here of the kind the pool and window
 * entries rest on. This entry is therefore confirmed on a WEAKER basis than
 * those, and says so rather than pretending otherwise: brand, plus a title
 * that names the product outright, plus four independent specification
 * figures that match what yarbo.com published to this catalogue — 2-stage,
 * 6-40ft throw, 12in intake, 24in clearing width.
 *
 * That is a different situation from the roborock case in the way that
 * matters. There, the titles named an accessory. Here the title names the
 * machine and four of its numbers agree with the maker's own page.
 *
 * A BONUS THE TITLE SETTLES, PARTLY. Yarbo's own module page prints "up to 40
 * feet" and "6-40 Yards Throw Control" in the same panel, and the review
 * publishes that as an unresolved conflict. Amazon's title says FEET. It is
 * evidence toward the conservative figure this site already chose; it is not
 * Yarbo correcting its own page, so the review keeps recording the conflict.
 */
const SNOW_ASINS: WindowDestination[] = [
  {
    productId: "prod-yarbo-snow-blower",
    asin: "B0FJF9V1JC",
    exactModel: "Yarbo Snow Blower (YARBO S1)",
    evidence:
      "Read 11 August 2026 by direct fetch. Brand 'YARBO'. Title: 'YARBO 2-Stage 24/7 Autonomous Robot Snow Blower with Modular Design | 24/7 Autonomous with 6-40ft Throwing Distance, 12\" Intake Height, 24\" Cleaning Width, AI Multi-Zone Mapping & RTK GPS'. THE DETAILS TABLE WAS NOT READ — the response truncates before it — so there is no Model Number field, and this is confirmed on a weaker basis than the pool and window entries: brand, a title naming the machine, and four specification figures matching yarbo.com's own page as recorded in this catalogue (2-stage, 6-40ft throw, 12in intake, 24in clearing width). Identity was already corroborated off Amazon at two retailers: Lowe's item 8256113 publishes 'Model #YARBO S1' and Best Buy SKU J3Q5Q8G9GS titles it 'Black Yarbo S1'. THE MODULE IS THE TRAP HERE, not a bundle: the Snow Blower Module alone sells at $1,299 and is not a robot, while this listing is the complete machine. Any listing whose title omits 'robot' or names only the module is a different purchase and is denied.",
  },
];

for (const p of SNOW_ASINS) {
  IDENTITY_CHECKS[p.productId] = {
    asin: p.asin,
    confirmed: true,
    evidence: p.evidence,
    checkedOn: SNOW_CHECK_DATE,
  };
}

export const DESTINATIONS: ProductDestination[] = [
  /**
   * The eleven vacuums, at researched_exact rather than verified_exact.
   *
   * The identifier was captured — a pinned ASIN read through SerpAPI's
   * amazon_product engine on 10 August 2026, with price, rating and review
   * count returned and the sibling ASINs named and denied. What was never done
   * is the second read: transcribing a published identity field off the
   * listing before the button was wired. That is exactly the difference the
   * two levels exist to record, so these sit at the level that is true.
   *
   * The button still lands on a specific ASIN rather than a search, which is
   * what a reader needs. Raising these to verified_exact takes one field read
   * each and nothing else.
   */
  ...VACUUM_ASINS.map(
    ({ productId, asin, exactModel, evidence }): ProductDestination => ({
      productId,
      retailerId: "ret-amazon",
      market: "us",
      retailerProductId: asin,
      identifierKind: "asin",
      exactModel,
      destinationUrl: `https://www.amazon.com/dp/${asin}`,
      confidence: "researched_exact" as const,
      notes:
        "IDENTITY NOT CONFIRMED to the standard the window and lawn destinations meet. " +
        "The ASIN is pinned and was read through SerpAPI's amazon_product engine on " +
        `${VACUUM_CHECK_DATE}, returning price, rating and review count, and every sibling ASIN ` +
        "that could be substituted is named and denied above. What has not been done is " +
        "transcribing a published identity field — Brand, Model Name, Model Number — off the " +
        "listing itself. One field read per listing raises this to verified_exact.",
      sourceReference: `ASIN pinned and read through the SerpAPI amazon_product engine on ${VACUUM_CHECK_DATE}; full working in docs/commerce/robot-vacuums-identity.md. ${evidence}`,
    }),
  ),

  ...[...LITTER_ASINS, ...LAWN_ASINS, ...SNOW_ASINS].map(
    ({ productId, asin, exactModel, evidence }): ProductDestination => ({
      productId,
      retailerId: "ret-amazon",
      market: "us",
      retailerProductId: asin,
      identifierKind: "asin",
      exactModel,
      destinationUrl: `https://www.amazon.com/dp/${asin}`,
      /* verified_exact, and on the same bar as the window eleven: the listing
         served the ASIN that was requested and its own title names the model.
         Every one of these was read twice — once to decide whether to publish
         the product at all, and again before a buy button was wired to it. The
         second read is not ceremony. A page that says "this is the current
         model" and a button that says "buy this one" are different promises,
         and only the second one can send somebody's money to the wrong place. */
      confidence: "verified_exact" as const,
      sourceReference: `ASIN from docs/seo/litter-lawn-verification-2026-08-08.md, identity re-read through the SerpApi product engine on ${LITTER_LAWN_CHECK_DATE} before the offer was wired: https://www.amazon.com/dp/${asin}`,
      sourceCheckedDate: LITTER_LAWN_CHECK_DATE,
      sellerIdentity: null,
      sellerModel: "unknown",
      notes: evidence,
    }),
  ),
  ...COMPANION_ASINS.map(
    ({ productId, asin, exactModel, evidence }): ProductDestination => ({
      productId,
      retailerId: "ret-amazon",
      market: "us",
      retailerProductId: asin,
      identifierKind: "asin",
      exactModel,
      /* VERIFIED_EXACT, and the reasoning is worth keeping because the first
         attempt got it wrong. This was written as researched_exact on the
         grounds that the listing publishes no details table, so the evidence
         is thinner than the window eleven's. offers.test.ts refused it, and
         the test was right: researched_exact means identity is NOT confirmed,
         and this identity is confirmed. Served ASIN equals the one requested
         and the title reads "Casio Moflin" in full.

         "Moflin" is also a coined word owned by one maker with exactly one
         product and one sibling variant, which is a stronger identifier than
         most model numbers — there is no Moflin Pro to be confused with. The
         thinness of the details table belongs in the evidence text, where it
         is recorded, rather than in a confidence level that would have meant
         something untrue. */
      confidence: "verified_exact" as const,
      destinationUrl: `https://www.amazon.com/dp/${asin}`,
      sourceReference: `Identity machine-read by scripts/amazon-identity-check.mjs on ${COMPANION_CHECK_DATE}: https://www.amazon.com/dp/${asin}`,
      sourceCheckedDate: COMPANION_CHECK_DATE,
      sellerIdentity: null,
      sellerModel: "unknown",
      notes: evidence,
    }),
  ),
  ...WINDOW_ASINS.map(
    ({ productId, asin, exactModel, evidence }): ProductDestination => ({
      productId,
      retailerId: "ret-amazon",
      market: "us",
      retailerProductId: asin,
      identifierKind: "asin",
      exactModel,
      destinationUrl: `https://www.amazon.com/dp/${asin}`,
      /* verified_exact on a machine read of the listing's own fields, which is
         the same bar the pool destinations clear. NO PRICE IS CLAIMED HERE and
         none was taken from the read: the buy-box block is absent from the
         markup Amazon serves a non-browser client, so the dollar figures that
         ARE present belong to other sellers, variants and comparison widgets.
         One of these listings read $15.99, which is an accessory rather than a
         window robot — proof the caution is warranted rather than theoretical.
         Price comes from the refresh service, with the date it was read. */
      confidence: "verified_exact" as const,
      sourceReference: `ASIN from docs/seo/window-cleaning-robots-asins.md (captured 2026-08-05), identity machine-read by scripts/amazon-identity-check.mjs on ${WINDOW_CHECK_DATE}: https://www.amazon.com/dp/${asin}`,
      sourceCheckedDate: WINDOW_CHECK_DATE,
      sellerIdentity: null,
      sellerModel: "unknown",
      notes: evidence,
    }),
  ),
  /* eslint-disable-next-line -- pool destinations follow */
  ...AMAZON_ASINS.map(
    ({ productId, asin, sourceUrl }): ProductDestination => ({
      productId,
      retailerId: "ret-amazon",
      market: "us",
      retailerProductId: asin,
      identifierKind: "asin",
      exactModel: model(productId),
      destinationUrl: `https://www.amazon.com/dp/${asin}`,
      // Identity-confirmed ASINs reach verified_exact WITHOUT a price behind
      // them: knowing the destination is the right model and knowing what it
      // costs are separate claims, and only the first is settled here.
      // The identity check must have examined THIS ASIN. A check keyed only by
      // product would keep vouching after the ASIN was swapped, which is how a
      // machine-read verdict silently transfers to a listing nobody has read.
      confidence:
        IDENTITY_CHECKS[productId]?.confirmed && IDENTITY_CHECKS[productId]?.asin === asin
          ? ("verified_exact" as const)
          : ("researched_exact" as const),
      sourceReference: `ASIN captured from the Amazon listing cited in the Job 8 record: ${sourceUrl}`,
      sourceCheckedDate: DESTINATION_CHECK_DATE,
      // Amazon exposes the seller only on the rendered page, which we may not read.
      sellerIdentity: null,
      sellerModel: "unknown",
      // The evidence text describes a specific ASIN, so it may only be quoted
      // for that ASIN. Anything else falls back to the honest default.
      notes:
        IDENTITY_CHECKS[productId]?.asin === asin
          ? IDENTITY_CHECKS[productId]!.evidence
          : "Destination resolves on amazon.com and is not Amazon's 404 page, so the ASIN is live. The model at the destination has not been confirmed.",
    }),
  ),
  ...NO_AMAZON_DESTINATION.map(
    (productId): ProductDestination => ({
      productId,
      retailerId: "ret-amazon",
      market: "us",
      retailerProductId: null,
      identifierKind: null,
      exactModel: model(productId),
      // A search URL is recorded as the destination but classified search_only,
      // so it can carry a click without ever being called an offer.
      destinationUrl: null,
      confidence: "search_only",
      sourceReference:
        SEARCH_FINDINGS[productId]?.finding ??
        "No Amazon listing URL was captured for this product during the Job 8 research pass.",
      sourceCheckedDate: SEARCH_FINDINGS[productId]?.checkedOn ?? DESTINATION_CHECK_DATE,
      sellerIdentity: null,
      sellerModel: "unknown",
      notes:
        "Only a search destination is available. The customer still has to identify the product themselves, so no price, stock state or seller identity may be claimed and this is not published as a verified offer.",
    }),
  ),
];

export const destinationFor = (productId: string, retailerId = "ret-amazon"): ProductDestination | undefined =>
  DESTINATIONS.find((d) => d.productId === productId && d.retailerId === retailerId);

/**
 * The LIVE /go keys, read from D1 rather than generated.
 *
 * These were seeded before this job and do not follow a derivable pattern —
 * `pool-betta-seplus-amazon`, not `pool-betta-se-plus-amazon`. Generating them
 * produced five paths that 404, which is worse than no link at all: a dead buy
 * button looks like a broken site rather than an absent offer. The key is a
 * fact about D1, so it is recorded here and asserted against production.
 */
/* @extension-point per-product | required | Three records here decide whether a
   reader can buy: DESTINATIONS (which retailer and which ASIN), IDENTITY_CHECKS
   (that the ASIN is the right machine and not a sibling model) and REDIRECT_KEYS
   (the /go/ key the button points at). A REDIRECT_KEYS entry with no matching
   offer seed is a 404 on the buy button — the single most damaging failure on
   the site, and the one offers.test.ts now guards. */
export const REDIRECT_KEYS: Record<string, string> = {
  "prod-aiper-scuba-s1": "pool-aiper-scubas1-amazon",
  "prod-aiper-scuba-x1": "pool-aiper-scubax1-amazon",
  "prod-aiper-scuba-v3-ai-vision": "pool-aiper-scubav3-amazon",
  "prod-aiper-seagull-se": "pool-aiper-seagull-amazon",
  "prod-beatbot-aquasense-2-ultra": "pool-beatbot-ultra-amazon",
  "prod-betta-se-plus": "pool-betta-seplus-amazon",
  "prod-dolphin-e10": "pool-dolphin-e10-amazon",
  "prod-dolphin-nautilus-cc-plus": "pool-dolphin-ccplus-amazon",
  "prod-dolphin-premier": "pool-bublue-bubot800p-amazon",
  "prod-dolphin-proteus-dx4-plus": "pool-dolphin-proteus-dx4plus-amazon",
  "prod-polaris-freedom": "pool-polaris-freedom-amazon",
  "prod-wybot-c1": "pool-wybot-c1-amazon",

  /* WINDOW. READ OUT OF PRODUCTION D1 ON 6 AUGUST 2026, NOT DERIVED.
     
     These were briefly written as `window-winbot-w2-pro-omni-amazon` and so
     on, invented to a tidy pattern on the assumption that no window rows
     existed yet. They did. All eleven offers and all eleven redirect links
     have been in D1 since 5 August, active and wired to ap-amazon-us — the
     buy buttons were missing because buildOffers could not see the products,
     not because the commercial rows were absent.
     
     The real keys are `win-`, abbreviate the model (`w2proomni`, `w120dp`,
     `s55pro`) and are not reconstructible from any slug. Shipping the derived
     ones would have put eleven buy buttons on a 404 — the exact failure the
     note above this map records for the pool keys, repeated on a category
     twice the size. The lesson did not transfer because it was written as
     prose about pool rather than as a rule about keys.
     
     A key is a fact about D1. It is read from D1 or it is wrong. */
  "prod-ecovacs-winbot-w2-pro-omni": "win-ecovacs-w2proomni-amazon",
  "prod-ecovacs-winbot-w2-pro": "win-ecovacs-w2pro-amazon",
  "prod-ecovacs-winbot-w3-omni": "win-ecovacs-w3omni-amazon",
  "prod-ecovacs-winbot-w1-pro": "win-ecovacs-w1pro-amazon",
  "prod-ecovacs-winbot-w2s": "win-ecovacs-w2s-amazon",
  "prod-ecovacs-winbot-mini": "win-ecovacs-mini-amazon",
  "prod-hobot-2s": "win-hobot-2s-amazon",
  "prod-hobot-298": "win-hobot-298-amazon",
  "prod-cop-rose-x5s": "win-coprose-x5s-amazon",
  "prod-mamibot-w120-dp": "win-mamibot-w120dp-amazon",
  "prod-hutt-s55-pro": "win-hutt-s55pro-amazon",

  /* COMPANION. Written into D1 on 8 August 2026 by this job rather than read
     out of it, which is the one case where the rule above does not apply — a
     key cannot be read from D1 before it exists there. The offer row
     `off-moflin-amazon` and the redirect_links row `comp-casio-moflin-amazon`
     were inserted first, then recorded here, so the map still describes the
     database rather than a naming convention somebody hoped was followed. */
  "prod-moflin": "comp-casio-moflin-amazon",
  "prod-miko-3": "comp-miko-3-amazon",
  "prod-vector-2": "comp-anki-vector2-amazon",
  "prod-eilik": "comp-eilik-amazon",
  "prod-loona": "comp-loona-amazon",
  "prod-joy-for-all-companion-pets": "comp-joyforall-cat-amazon",
  "prod-ropet": "comp-ropet-kamomo-amazon",
  "prod-enabot-ebo-air-2": "petcam-enabot-eboair2-amazon",
  "prod-enabot-ebo-se": "petcam-enabot-ebose-amazon",
  "prod-enabot-rola-petpal": "petcam-enabot-rolapetpal-amazon",
  "prod-sphero-bolt": "code-sphero-bolt-amazon",
  "prod-sphero-mini": "code-sphero-mini-amazon",
  "prod-sphero-indi": "code-sphero-indi-amazon",
  "prod-ozobot-evo": "code-ozobot-evo-amazon",
  "prod-makeblock-mbot": "code-makeblock-mbot-amazon",

  /* LITTER AND LAWN. Written into D1 on 8 August 2026 by this job, in the same
     order the companion keys were: the offer row and the redirect_links row go
     into production FIRST, then the key is recorded here. That way this map
     keeps describing the database rather than a naming convention somebody
     hoped was followed — which is the mistake that nearly put eleven window
     buy buttons on a 404.

     The prefixes follow the house pattern (`pool-`, `win-`, `comp-`,
     `petcam-`, `code-`), brand then compressed model then `-amazon`. Two
     Mammotions differ only by the size in the middle, which is the whole
     difference between the machines as well. */
  "prod-litter-robot-4": "litter-whisker-lr4-amazon",
  "prod-petkit-purobot-max-pro-2": "litter-petkit-purobotmaxpro2-amazon",
  "prod-casa-leo-loo-too": "litter-casaleo-lootoo-amazon",
  "prod-petsafe-scoopfree-crystal-pro": "litter-petsafe-crystalpro-amazon",
  "prod-navimow-i110n": "lawn-segway-i110n-amazon",
  "prod-luba-3-awd-1500h": "lawn-mammotion-luba3-1500h-amazon",
  "prod-luba-3-awd-3000h": "lawn-mammotion-luba3-3000h-amazon",
  "prod-automower-410iq": "lawn-husqvarna-410iq-amazon",
  "prod-worx-landroid-vision-wr320": "lawn-worx-wr320-amazon",
  "prod-eufy-e15": "lawn-eufy-e15-amazon",
  "prod-dreame-a3-awd-1000": "lawn-dreame-a3awd1000-amazon",
  "prod-yarbo-snow-blower": "snow-yarbo-snow-blower-amazon",

  /* The eleven vacuums, added 14 August 2026 with their offers. Same house
     pattern — prefix, brand, compressed model, `-amazon`. The two Sharks and
     the three roborocks differ only by the SKU in the middle, which is the
     whole difference between the machines as well. */
  "prod-eufy-x10-pro-omni": "vac-eufy-x10proomni-amazon",
  "prod-eufy-omni-s1-pro": "vac-eufy-omnis1pro-amazon",
  "prod-roborock-s8-max-ultra": "vac-roborock-s8maxultra-amazon",
  "prod-roborock-saros-10": "vac-roborock-saros10-amazon",
  "prod-roborock-qrevo-s5v": "vac-roborock-qrevos5v-amazon",
  "prod-dreame-x40-ultra": "vac-dreame-x40ultra-amazon",
  "prod-dreame-x50-ultra": "vac-dreame-x50ultra-amazon",
  "prod-shark-powerdetect-av2820s": "vac-shark-av2820s-amazon",
  "prod-shark-matrix-plus-ur2650ws": "vac-shark-ur2650ws-amazon",
  "prod-roomba-max-705": "vac-irobot-max705-amazon",
  "prod-ecovacs-deebot-t90-pro-omni": "vac-ecovacs-t90proomni-amazon",
};

/* ------------------------------------------------------------------ */
/* Refused candidates                                                  */
/* ------------------------------------------------------------------ */

/**
 * Every destination that was considered and refused, with the rule that refused
 * it. Recorded because "we found nothing" and "we found four things and none of
 * them was this product" are different findings, and the second one is the
 * useful one when someone revisits this.
 */
/**
 * Refusals that were later disproved.
 *
 * A refusal is never deleted. Removing one erases the fact that BotPlanet once
 * refused a destination and why, which is exactly the trail a reviewer needs —
 * and a wrong refusal matters as much as a wrong acceptance, because it
 * suppresses a real offer just as effectively. So an overturned refusal moves
 * here with what disproved it, and stays.
 */
export interface SupersededRefusal {
  productId: string;
  candidate: string;
  originalReason: string;
  supersededOn: string;
  disprovedBy: string;
}

export const SUPERSEDED_REFUSALS: SupersededRefusal[] = [
  {
    productId: "prod-betta-se-plus",
    candidate: "ASIN B0CVMQ3XBX (suspected superseded listing)",
    originalReason:
      "Amazon's 'View newer model' panel on this listing points at a separate Betta SE Plus at $429.90. Amazon shows that panel only when an ASIN has been superseded, so the ASIN we hold looked like an earlier model.",
    supersededOn: "2026-07-31",
    disprovedBy:
      "The listing's own details table gives Model Name, Model Number and Manufacturer Part Number all as 'Betta-SE-Plus', Brand 'Betta', Model Year 2023. The panel points at a different LISTING of the same model, not a successor. The refusal was wrong and the destination is reinstated.",
  },
];

export const REJECTED_CANDIDATES: RejectedCandidate[] = [
  {
    productId: "prod-aiper-scuba-x1",
    retailerId: "ret-amazon",
    candidate: "https://www.amazon.com/AIPER-Scuba-X1-Pro-Underwater/dp/B0GVT2YPLB",
    reason:
      "REFUSED AS A BUNDLE OF A SIBLING MODEL. The listing URL reads /AIPER-Scuba-X1-Pro-Underwater/, which is why it was briefly accepted, but the page's own details table gives Model Name and Model Number as \"Scuba X1+Hy Pro\" and the title as \"AIPER Scuba X1 Robotic Pool Cleaner with HydroComm Pro Smart Pool Monitor\". That is the base Scuba X1 packaged with a HydroComm Pro monitor, not the Scuba X1 Pro, which Aiper sells on its own page at /us/aiper-scuba-series/aiper-scuba-x1pro. Read on 3 August 2026.",
    rule: "sibling_model",
  },
  ...NO_AMAZON_DESTINATION.map(
    (productId): RejectedCandidate => ({
      productId,
      retailerId: "ret-amazon",
      candidate: `amazon.com/s?k=${model(productId)}`,
      reason:
        "A search-results page is not an offer: it does not identify a single product, a seller, a price or a stock state, and the customer still has to choose. Kept as a fallback click destination, refused as a verified offer.",
      rule: "search_not_offer",
    }),
  ),
  {
    productId: "prod-wybot-c1",
    retailerId: "ret-amazon",
    candidate: "https://www.amazon.com/dp/B0G64JV6K4",
    reason:
      "DEAD ASIN. The listing recorded in Job 8 no longer exists: /dp/B0G64JV6K4 returns Amazon's 'Sorry, we couldn't find that page'. It passed the original HTTP-200 check because Amazon serves that page with a 200 status, which is why the check is now content-based. Must not be reinstated without a fresh ASIN.",
    rule: "search_not_offer",
  },
  {
    productId: "prod-polaris-freedom",
    retailerId: "ret-amazon",
    candidate: "Used - Like New buying option on B0BX9DJS7R at $934.82",
    reason:
      "The same listing offers a used copy $264.18 cheaper than the new one. It is a different thing with a different warranty position — a manufacturer term runs from the original purchase, not from ours — so quoting the lower figure would misdescribe what the buy button buys. Only the buy-new price is recorded.",
    rule: "refurbished_or_used",
  },
  /*
   * SUCCESSOR MODELS SURFACED BY THE MANUAL SEARCH PASS, 2026-07-31.
   *
   * Searching Amazon for three of our products returned a NEWER model instead
   * of the one we hold. Each was identified from manufacturer A+ content the
   * owner captured — the model name is printed on the machine in the brand's
   * own photography, which is the most reliable identifier available here.
   *
   * All three are refused. A successor is a different product with different
   * specifications, and pointing a buy button at one would send a reader to
   * something other than what they read about. They are recorded rather than
   * dropped because three superseded models out of ten is a fact about the
   * CATALOGUE, not a research failure — and that is a decision for the owner
   * and ChatGPT, not something to fix quietly inside a destination file.
   */
  {
    productId: "prod-dolphin-premier",
    retailerId: "ret-amazon",
    candidate: "Dolphin PROTEUS DX4 PLUS listing",
    reason:
      "Returned by the Amazon search for the Dolphin Premier. The A+ photography has 'PROTEUS DX4 PLUS' printed on the machine, so it is a different Maytronics model — 33 ft pool rating, 4,000 GPH, weekly timer. The Premier's own figures do not carry over to it.",
    rule: "sibling_model",
  },
  {
    productId: "prod-aiper-scuba-s1",
    retailerId: "ret-amazon",
    candidate: "AIPER SCUBA V3 listing",
    reason:
      "Returned by the Amazon search for an Aiper Scuba. The A+ hero image has 'SCUBA V3' printed on the chassis, and the panels describe an AI camera, AI Navium scheduling and 7 days on one charge — none of which belongs to the S1 or the X1 we hold.",
    rule: "sibling_model",
  },
  {
    productId: "prod-aiper-scuba-x1",
    retailerId: "ret-aiper-store",
    candidate: "Aiper CJ Product Catalog, feed 17133094",
    reason:
      "The joined CJ feed contains zero products, so no catalogue row exists to match. Building an offer from an empty feed would mean inventing one.",
    rule: "search_not_offer",
  },
  {
    productId: "prod-wybot-c1",
    retailerId: "ret-wybot-store",
    candidate: "Awin Wybot EU programme 115280 product feed",
    reason:
      "The joined WYBOT programme is Awin advertiser 115280, region Germany, valid domain eu.wybotpool.com. Its offers are EUR and EU-fulfilled, so serving one to a US customer would be a wrong-region offer regardless of the tracking working.",
    rule: "wrong_region",
  },
  {
    productId: "prod-wybot-c1",
    retailerId: "ret-wybot-store",
    candidate: "Awin WYBOTICS INC programme 76816 product feed",
    reason:
      "The correct US programme, but the application is pending. Awin gates the feed behind 'No relationship exists', so there is no row to build an offer from yet.",
    rule: "search_not_offer",
  },
  ...(
    [
      ["prod-dolphin-e10", "ret-walmart"],
      ["prod-betta-se-plus", "ret-leslies"],
      ["prod-dolphin-premier", "ret-leslies"],
      ["prod-dolphin-nautilus-cc-plus", "ret-dohenys"],
      ["prod-polaris-freedom", "ret-intheswim"],
      ["prod-aiper-scuba-x1", "ret-aiper-store"],
      ["prod-aiper-scuba-s1", "ret-aiper-store"],
      ["prod-beatbot-aquasense-2-ultra", "ret-beatbot-store"],
    ] as const
  ).map(
    ([productId, retailerId]): RejectedCandidate => ({
      productId,
      retailerId,
      candidate: `existing D1 offer at ${retailerId} carrying a researched price`,
      reason:
        "BotPlanet has no commercial relationship with this retailer, and the stored price was copied from the same research pass as the Amazon row rather than checked at this seller. An unapproved retailer with an unverified price is not an offer, so it is suppressed rather than shown.",
      rule: "unclear_seller",
    }),
  ),
];
