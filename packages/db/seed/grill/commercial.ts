/**
 * Grill-cleaning-robot commercial seed — A MIRROR OF PRODUCTION D1, NOT A
 * PROPOSAL.
 *
 * WHY THIS FILE DID NOT EXIST UNTIL 26 SEPTEMBER 2026, and what it cost.
 *
 * Grillbot arrived on 10 August 2026 as the first and, so far, only product
 * in this category — identity confirmed through Amazon's own brand field,
 * ASIN B00HFDFSAC pinned, $129.99 read the same day. It went into
 * OFFER_SETUP_PENDING rather than being wired immediately, because the one
 * direct-fetch attempt on record hit Amazon's bot-check page instead of the
 * listing itself, and a buy button is a different promise from a published
 * page.
 *
 * OFFER_SETUP_PENDING has a stated 30-day shelf life for exactly this
 * reason — a pending state is supposed to force a decision, not become a
 * home. Nobody revisited it. It sat there 47 days, 17 past the limit, before
 * its own overdue-pending test finally went red on 26 September and forced
 * the question. The whole grill-cleaning-robots vertical earned nothing for
 * six and a half weeks over a single un-repeated listing read.
 *
 * WIRED NOW AT researched_exact, THE SAME BAR AS THE ROBOT-VACUUM CATEGORY —
 * see commerce/destinations.ts, GRILL_ASINS, for exactly what is and is not
 * confirmed. The gap is one clean listing read that does not bounce off the
 * bot check; until then this is honest rather than silent.
 *
 * THE PRICE IS NULL, deliberately, as in every seed beside this one. The
 * $129.99 read on 10 August is not copied here. The first observation the
 * refresh service accepts fills the column, with the date it was read.
 *
 * Standing rules, unchanged: no affiliate destination URLs and no tracking
 * parameters in the seed; commission lives at programme level and is
 * private.
 */
import type { offers, redirectLinks } from "../../src/schema/commercial.js";

const USD = "USD";

interface GrillOfferSeed {
  /** D1 `offers.id`, verbatim. */
  id: string;
  productId: string;
  /** ASIN, pinned 2026-08-10 — see commerce/destinations.ts. */
  asin: string;
  /** D1 `offers.redirect_key`, verbatim. NEVER derive this. */
  redirectKey: string;
  /** Null until the refresh service reads one. See the note above. */
  snapshotMinor: number | null;
}

const offerSeeds: GrillOfferSeed[] = [
  { id: "off-grillbot-amazon", productId: "prod-grillbot", asin: "B00HFDFSAC", redirectKey: "grill-grillbot-amazon", snapshotMinor: null },
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
