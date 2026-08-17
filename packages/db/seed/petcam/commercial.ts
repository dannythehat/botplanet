/**
 * Pet-camera commercial seed — A MIRROR OF PRODUCTION D1, NOT A PROPOSAL.
 *
 * Written 8 August 2026 with the first three reviews in the category. The rows
 * went into production first and this file was written to match them, so it
 * stays a transcript rather than a plan.
 *
 * THE PRICES HERE NEVER REACH A READER. They are what the listings showed on
 * 8 August 2026, recorded as `snapshot` / `indicative`, and the freshness gate
 * refuses to publish either as a current price.
 */
import type { offers, redirectLinks } from "../../src/schema/commercial.js";

const USD = "USD";

interface PetcamOfferSeed {
  id: string;
  productId: string;
  /** ASIN, identity-confirmed 2026-08-08 — see commerce/destinations.ts. */
  asin: string;
  /** D1 `offers.redirect_key`, verbatim. NEVER derive this. */
  redirectKey: string;
  snapshotMinor: number | null;
}

const offerSeeds: PetcamOfferSeed[] = [
  /* Three colour variants share this title and price — B0DZHG7Y6T and
     B0DZHG4LZK are the others. The Air 2S and Air 2 Plus are DIFFERENT
     machines in the same family, not colours, and are named on the page
     rather than sold from this row. */
  { id: "off-ebo-air-2-amazon", productId: "prod-enabot-ebo-air-2", asin: "B0DZHDF7MD", redirectKey: "petcam-enabot-eboair2-amazon", snapshotMinor: 14999 },
  /* NOT B0CGV82XTT. That listing reads "Rocon Ebo SE", serves a different
     ASIN than the one requested, and is a reseller rather than Enabot — the
     candidate the discovery pass proposed, and the reason every listing in
     this category was opened individually. */
  { id: "off-ebo-se-amazon", productId: "prod-enabot-ebo-se", asin: "B09R6V3CJM", redirectKey: "petcam-enabot-ebose-amazon", snapshotMinor: 11999 },
  { id: "off-rola-petpal-amazon", productId: "prod-enabot-rola-petpal", asin: "B0GMQW1HX6", redirectKey: "petcam-enabot-rolapetpal-amazon", snapshotMinor: 17999 },
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
