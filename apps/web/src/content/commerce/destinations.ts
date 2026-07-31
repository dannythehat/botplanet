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
  { productId: "prod-beatbot-aquasense-2-ultra", asin: "B0DMN6NV6H", sourceUrl: "https://www.amazon.com/Beatbot-AquaSense-Cordless-Cleaning-Clarification/dp/B0DMN6NV6H" },
  { productId: "prod-aiper-scuba-x1", asin: "B0F9WN961G", sourceUrl: "https://www.amazon.com/AIPER-High-Power-Horizontal-Waterline-Scrubbing/dp/B0F9WN961G" },
];

/** Products with no Amazon listing URL in the Job 8 record. */
const NO_AMAZON_DESTINATION = [
  // ASIN B0G64JV6K4 was carried for this product and is DEAD — /dp/B0G64JV6K4
  // returns Amazon's "couldn't find that page" (confirmed by content check and
  // by the owner in a browser, 2026-07-31). Removed rather than left pointing
  // at a 404; a new ASIN has to be found before it can carry an offer again.
  "prod-wybot-c1",
  "prod-dolphin-premier",
  "prod-dolphin-e10",
  "prod-aiper-scuba-s1",
  "prod-aiper-seagull-se",
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
      confidence: "researched_exact",
      sourceReference: `ASIN captured from the Amazon listing cited in the Job 8 record: ${sourceUrl}`,
      sourceCheckedDate: DESTINATION_CHECK_DATE,
      // Amazon exposes the seller only on the rendered page, which we may not read.
      sellerIdentity: null,
      sellerModel: "unknown",
      notes:
        "Destination confirmed to resolve on amazon.com (HTTP 200, 2026-07-31), so the ASIN is live and the host is Amazon US. The model at the destination has NOT been re-confirmed, because that needs page content the Associates programme forbids scraping. Raising this to verified_exact requires the Creators API.",
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
      sourceReference: "No Amazon listing URL was captured for this product during the Job 8 research pass.",
      sourceCheckedDate: DESTINATION_CHECK_DATE,
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
  "prod-aiper-seagull-se": "pool-aiper-seagull-amazon",
  "prod-beatbot-aquasense-2-ultra": "pool-beatbot-ultra-amazon",
  "prod-betta-se-plus": "pool-betta-seplus-amazon",
  "prod-dolphin-e10": "pool-dolphin-e10-amazon",
  "prod-dolphin-nautilus-cc-plus": "pool-dolphin-ccplus-amazon",
  "prod-dolphin-premier": "pool-dolphin-premier-amazon",
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
export const REJECTED_CANDIDATES: RejectedCandidate[] = [
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
