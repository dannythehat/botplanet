/**
 * Robot snow blower commercial seed — A MIRROR OF PRODUCTION D1, NOT A PROPOSAL.
 *
 * Written 11 August 2026, when the Yarbo Snow Blower left `OFFER_SETUP_PENDING`
 * after one day there. The row went into production first, by migration
 * 0018_yarbo_offer.sql, and this file was written to match it. A redirect key
 * invented here and loaded later is a buy button pointing at a 404, which is
 * why offers.test.ts reads this file as text and checks every key against
 * REDIRECT_KEYS.
 *
 * ONE PRODUCT, BECAUSE THE CATEGORY HAS ONE MANUFACTURER. Snowbot is Yarbo's
 * own former brand name and every other domain selling one is a Yarbo dealer.
 * The category is `hidden` in content/nav.ts and has no hub, no comparison and
 * no matcher — see migration 0017 for the full reasoning.
 *
 * THE TRAP HERE IS NOT A BUNDLE, IT IS THE MODULE. Everywhere else in this
 * catalogue the neighbouring ASIN is the same machine with a kit attached. Here
 * the Snow Blower Module sells alone at $1,299 and is not a robot at all — it
 * is an attachment that needs a Core to move. The listing seeded below is the
 * complete $4,999 machine. Any listing whose title omits "robot", or names only
 * the module, is a different purchase.
 *
 * THE SNAPSHOT COLUMN IS NULL, deliberately, and more so than elsewhere. This
 * product is seasonal: dealer discounts appear and disappear, and December
 * stock is not August stock. A price typed in here would be wrong sooner than
 * most. The first observation the refresh service accepts fills the column,
 * with the date it was read.
 */
import type { offers, redirectLinks } from "../../src/schema/commercial.js";

const USD = "USD";

interface SnowOfferSeed {
  /** D1 `offers.id`, verbatim. */
  id: string;
  productId: string;
  /** ASIN, identity-read 2026-08-11 — see commerce/destinations.ts. */
  asin: string;
  /** D1 `offers.redirect_key`, verbatim. NEVER derive this. */
  redirectKey: string;
  /** Null until the refresh service reads one. See the note above. */
  snapshotMinor: number | null;
}

const offerSeeds: SnowOfferSeed[] = [
  /* B0FJF9V1JC, and the one destination on this site confirmed WITHOUT a Model
     Number field. The listing serves brand YARBO and a title printing
     two-stage, 6-40ft throw, 12in intake and 24in clearing width — four
     figures matching yarbo.com. The details table itself could not be read.
     destinations.ts carries the full evidence and the caveat with it. */
  { id: "off-yarbo-snow-blower-amazon", productId: "prod-yarbo-snow-blower", asin: "B0FJF9V1JC", redirectKey: "snow-yarbo-snow-blower-amazon", snapshotMinor: null },
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
