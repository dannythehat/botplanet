/**
 * Companion-category commercial seed — A MIRROR OF PRODUCTION D1, NOT A PROPOSAL.
 *
 * Written 8 August 2026 with the first companion review. Unlike the window
 * file next door, these rows were INSERTED by this job rather than read back
 * out of a database that already held them — there was no companion product in
 * D1 before Moflin. The order still ran the same way round: the offer and the
 * redirect_links row went into production first, then this file was written to
 * match them, so it remains a transcript rather than a plan.
 *
 * That ordering is the whole discipline. A redirect key invented here and
 * loaded later is a buy button pointing at a 404, which is the most damaging
 * thing this site can ship and the reason offers.test.ts reads this file as
 * text and checks every key against REDIRECT_KEYS.
 *
 * THE PRICE HERE NEVER REACHES A READER. 42900 is what the Amazon listing
 * showed on 8 August 2026, recorded as `snapshot` / `indicative`, and the
 * freshness gate refuses to publish either as a current price. A real price
 * arrives from the refresh service with the date it was read. The buy button
 * does not wait for one.
 *
 * Standing rules, unchanged: no affiliate destination URLs and no tracking
 * parameters in the seed; commission lives at programme level and is private.
 */
import type { offers, redirectLinks } from "../../src/schema/commercial.js";

const USD = "USD";

interface CompanionOfferSeed {
  /** D1 `offers.id`, verbatim. */
  id: string;
  productId: string;
  /** ASIN, identity-confirmed 2026-08-08 — see commerce/destinations.ts. */
  asin: string;
  /** D1 `offers.redirect_key`, verbatim. NEVER derive this. */
  redirectKey: string;
  /** Listing price in minor units on the day it was read. Never published. */
  snapshotMinor: number | null;
}

const offerSeeds: CompanionOfferSeed[] = [
  /* Silver only. Casio sells a Gold of the same machine, and a request for one
     ASIN in a variant family can be answered with a sibling's data — the same
     trap the Mamibot W120-DP colours carry in the window seed. The
     ASIN-equality check in the refresh service is what catches it. */
  { id: "off-moflin-amazon", productId: "prod-moflin", asin: "B0GPHNLWP3", redirectKey: "comp-casio-moflin-amazon", snapshotMinor: 42900 },
];

export const offerRows: (typeof offers.$inferInsert)[] = offerSeeds.map((o) => ({
  id: o.id,
  productId: o.productId,
  retailerId: "ret-amazon",
  marketId: "us",
  affiliateProgramId: "ap-amazon-us",
  currencyCode: USD,
  basePriceMinor: o.snapshotMinor,
  deliveryPriceMinor: null,
  totalLandedMinor: null,
  stockStatus: "unknown",
  deliveryMinDays: null,
  deliveryMaxDays: null,
  /* Casio publishes one year from the day it arrives, on casio.com/us/moflin/.
     Left null here because the column mirrors D1 and D1 holds null; the term
     is stated on the review, sourced to the page it was read from. */
  warrantySummary: null,
  returnsUrl: null,
  redirectKey: o.redirectKey,
  affiliateDestinationUrl: null,
  commissionValueBp: null,
  source: "manual",
  freshnessClass: "indicative",
  confidence: "low",
  priceVerification: "snapshot",
  sellerIdentity: null,
  offerStatus: "active",
}));

export const redirectLinkRows: (typeof redirectLinks.$inferInsert)[] = offerSeeds.map((o) => ({
  key: o.redirectKey,
  offerId: o.id,
  active: true,
}));
