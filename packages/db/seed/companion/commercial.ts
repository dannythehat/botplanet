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
  /* Red only, and the Blue is the reason this comment exists. B0GV2L2PDL
     carries a byte-identical title ending "| Blue", serves its own ASIN and is
     also in stock at $299 — it looked like a duplicate row for one machine and
     is in fact the second colour. Recording the wrong one would not have
     broken anything visibly, which is exactly why it was worth reading both. */
  { id: "off-miko-3-amazon", productId: "prod-miko-3", asin: "B0GV37M678", redirectKey: "comp-miko-3-amazon", snapshotMinor: 29900 },
  /* 18400 is the figure showing at 03:15 on 8 August 2026. The same ASIN read
     $199.99 an hour earlier the same morning. Both are honest reads and
     neither is published — snapshot plus indicative cannot pass the freshness
     gate, which is the whole reason this column is safe to hold at all. */
  { id: "off-vector-2-amazon", productId: "prod-vector-2", asin: "B07G3ZNK4Y", redirectKey: "comp-anki-vector2-amazon", snapshotMinor: 18400 },
  /* The BASE Eilik. Energize Lab sells five things in this range and the DQ at
     $199.98 has its own confirmed ASIN (B0DBVM5BCY) which is deliberately NOT
     seeded: it is the same hardware in a desert colourway with an exclusive
     game, and giving one product row two Amazon offers would print the DQ's
     price under the Eilik's name. If the DQ is ever sold here it gets its own
     catalogue row. */
  { id: "off-eilik-amazon", productId: "prod-eilik", asin: "B0C2C9LJNQ", redirectKey: "comp-eilik-amazon", snapshotMinor: 13999 },
  { id: "off-loona-amazon", productId: "prod-loona", asin: "B0DCF53PCH", redirectKey: "comp-loona-amazon", snapshotMinor: 49900 },
  /* The only product on this site whose buy button lives on a GUIDE rather
     than on a review of its own. See the ruling in
     docs/seo/companion-products-build-plan.md. */
  { id: "off-joyforall-cat-amazon", productId: "prod-joy-for-all-companion-pets", asin: "B017JQQ00Q", redirectKey: "comp-joyforall-cat-amazon", snapshotMinor: 15900 },
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
