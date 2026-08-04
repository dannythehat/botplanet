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

export const DESTINATIONS: ProductDestination[] = [
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
export const REDIRECT_KEYS: Record<string, string> = {
  "prod-aiper-scuba-s1": "pool-aiper-scubas1-amazon",
  "prod-aiper-scuba-x1": "pool-aiper-scubax1-amazon",
  "prod-aiper-scuba-v3-ai-vision": "pool-aiper-scubav3-amazon",
  "prod-aiper-seagull-se": "pool-aiper-seagull-amazon",
  "prod-beatbot-aquasense-2-ultra": "pool-beatbot-ultra-amazon",
  "prod-betta-se-plus": "pool-betta-seplus-amazon",
  "prod-dolphin-e10": "pool-dolphin-e10-amazon",
  "prod-dolphin-nautilus-cc-plus": "pool-dolphin-ccplus-amazon",
  "prod-dolphin-premier": "pool-dolphin-premier-amazon",
  "prod-dolphin-proteus-dx4-plus": "pool-dolphin-proteus-dx4plus-amazon",
  "prod-polaris-freedom": "pool-polaris-freedom-amazon",
  "prod-wybot-c1": "pool-wybot-c1-amazon",
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
      "The correct US programme, but the application is pending. Awin gates the feed behind 'No relationship exists', so there is no lawful row to build an offer from yet.",
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
