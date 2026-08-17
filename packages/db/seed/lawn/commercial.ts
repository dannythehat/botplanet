/**
 * Lawn-mower commercial seed — A MIRROR OF PRODUCTION D1, NOT A PROPOSAL.
 *
 * Written 8 August 2026, when the seven mowers left `OFFER_SETUP_PENDING`. The
 * rows went into production first and this file was written to match them. A
 * redirect key invented here and loaded later is a buy button pointing at a
 * 404; offers.test.ts reads this file as text and checks every key against
 * REDIRECT_KEYS because that is where the mistake actually happens.
 *
 * THE SNAPSHOT COLUMN IS NULL THROUGHOUT, deliberately — see the note in the
 * litter seed beside it. Prices were read from all seven listings on 8 August
 * and none of them is copied in here. The first observation the refresh service
 * accepts fills the column, with the date it was read.
 *
 * THIS CATEGORY IS WHERE A BUNDLE COSTS THE MOST. Four of these seven have a
 * sibling ASIN that sells the same mower with a kit, a garage or a blade set
 * attached, usually at a price close enough to look like the same purchase:
 * Segway's Rough Terrain Kit at $1,168.30 against the bare $1,099, Mammotion's
 * garage at $3,008 against $2,799, Dreame's cleaning-and-blade set at exactly
 * the same $1,599.99. Every id below names one ASIN and one only.
 *
 * Standing rules, unchanged: no affiliate destination URLs and no tracking
 * parameters in the seed; commission lives at programme level and is private.
 */
import type { offers, redirectLinks } from "../../src/schema/commercial.js";

const USD = "USD";

interface LawnOfferSeed {
  /** D1 `offers.id`, verbatim. */
  id: string;
  productId: string;
  /** ASIN, identity-read 2026-08-08 — see commerce/destinations.ts. */
  asin: string;
  /** D1 `offers.redirect_key`, verbatim. NEVER derive this. */
  redirectKey: string;
  /** Null until the refresh service reads one. See the note above. */
  snapshotMinor: number | null;
}

const offerSeeds: LawnOfferSeed[] = [
  /* The bare i110N. B0D7HG4319 adds the Rough Terrain Kit ($1,168.30) and
     B0CZ3R3SJH adds Garage S ($1,298); both are genuinely this mower. */
  { id: "off-navimow-i110n-amazon", productId: "prod-navimow-i110n", asin: "B0CX7T6BR3", redirectKey: "lawn-segway-i110n-amazon", snapshotMinor: null },
  /* 1500H and 3000H are 0.37 and 0.75 acre. Two products, two ASINs, two keys
     — the size is the only thing separating them and it is also the entire
     reason a buyer picks one. */
  { id: "off-luba3-1500h-amazon", productId: "prod-luba-3-awd-1500h", asin: "B0GKNYZPC3", redirectKey: "lawn-mammotion-luba3-1500h-amazon", snapshotMinor: null },
  { id: "off-luba3-3000h-amazon", productId: "prod-luba-3-awd-3000h", asin: "B0GKNQKJJQ", redirectKey: "lawn-mammotion-luba3-3000h-amazon", snapshotMinor: null },
  { id: "off-automower-410iq-amazon", productId: "prod-automower-410iq", asin: "B0DTV7TR6W", redirectKey: "lawn-husqvarna-410iq-amazon", snapshotMinor: null },
  /* WR320, and the SKU is in the name for a reason: WO7144, WR342 and WR344
     are all live and all answer to "Landroid Vision". */
  { id: "off-worx-wr320-amazon", productId: "prod-worx-landroid-vision-wr320", asin: "B0GN8KK8XW", redirectKey: "lawn-worx-wr320-amazon", snapshotMinor: null },
  { id: "off-eufy-e15-amazon", productId: "prod-eufy-e15", asin: "B0DRVYDXWX", redirectKey: "lawn-eufy-e15-amazon", snapshotMinor: null },
  /* THE ONE THE OWNER PINNED BY HAND, and the read backs the instruction up.
     B0H46DDHKC and B0H761SNFG both sell the A3 AWD 1000 at this same
     $1,599.99, share a rating count of 42 and publish a "Set name" variant
     dimension — two set choices under one parent, one of which bundles a
     cleaning and blade set. B0H3V799KT publishes no variants at all and
     carries its own 13 ratings: the bare machine on its own listing, with no
     sibling set for the listing to answer with. */
  { id: "off-dreame-a3awd1000-amazon", productId: "prod-dreame-a3-awd-1000", asin: "B0H3V799KT", redirectKey: "lawn-dreame-a3awd1000-amazon", snapshotMinor: null },
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
