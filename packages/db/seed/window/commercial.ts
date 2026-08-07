/**
 * Window-category commercial seed — A MIRROR OF PRODUCTION D1, NOT A PROPOSAL.
 *
 * READ THIS BEFORE EDITING. Every row below already exists in the production
 * database and has since 5 August 2026. This file was written on 6 August as
 * new data to load, which was wrong twice over: the offers were already there,
 * and the redirect keys invented for them (`window-winbot-w2-pro-omni-amazon`
 * and friends) do not match the real ones (`win-ecovacs-w2proomni-amazon`).
 * Loading it would have created eleven duplicate offers for the same eleven
 * products and pointed every buy button at a key that answers 404.
 *
 * The rows here were read back out of D1 on 6 August 2026 and transcribed
 * verbatim. Its job is to be a faithful FALLBACK if D1 is unavailable, and to
 * give offers.test.ts a text to check the redirect keys against — the test
 * that exists because a buy button pointing at a key with no row behind it is
 * the most damaging failure this site can ship.
 *
 * WHY THE WINDOW REVIEWS SHOWED NO BUY BUTTON, since it was never this file:
 * `buildOffers()` iterated the pool-era editorial map, which contains no window
 * product, so the engine produced no offer for any of them however complete
 * the database was. Fixed in lib/offer-truth.ts by reading the catalogue.
 *
 * WHY THEY SHOW NO PRICE, which is correct and unchanged: the figures below are
 * `snapshot` / `indicative` research estimates from 5 August — round numbers
 * like 49900 and 16000, not observed transactions. The freshness gate refuses
 * to publish a snapshot as a current price, which is the whole point of it. A
 * real price arrives from the refresh service with the date it was read. The
 * buy button does not wait for one.
 *
 * Standing rules, unchanged: no affiliate destination URLs and no tracking
 * parameters in the seed; commission lives at programme level and is private.
 */
import type { offers, redirectLinks } from "../../src/schema/commercial.js";

const USD = "USD";

interface WindowOfferSeed {
  /** D1 `offers.id`, verbatim. */
  id: string;
  productId: string;
  /** ASIN, identity-confirmed 2026-08-06 — see commerce/destinations.ts. */
  asin: string;
  /** D1 `offers.redirect_key`, verbatim. NEVER derive this. */
  redirectKey: string;
  /**
   * Research estimate in minor units, as stored. Null where the 5 August pass
   * could not establish one. These never reach a reader: `snapshot` +
   * `indicative` cannot pass the freshness gate.
   */
  snapshotMinor: number | null;
}

const offerSeeds: WindowOfferSeed[] = [
  { id: "off-winbot-w2proomni-amazon", productId: "prod-ecovacs-winbot-w2-pro-omni", asin: "B0DR8Y4VF9", redirectKey: "win-ecovacs-w2proomni-amazon", snapshotMinor: 49900 },
  { id: "off-winbot-w2pro-amazon", productId: "prod-ecovacs-winbot-w2-pro", asin: "B0DSKC7QT7", redirectKey: "win-ecovacs-w2pro-amazon", snapshotMinor: 38000 },
  { id: "off-winbot-w3omni-amazon", productId: "prod-ecovacs-winbot-w3-omni", asin: "B0GJDQ59J1", redirectKey: "win-ecovacs-w3omni-amazon", snapshotMinor: 55000 },
  { id: "off-winbot-w1pro-amazon", productId: "prod-ecovacs-winbot-w1-pro", asin: "B0C2CQP8ZS", redirectKey: "win-ecovacs-w1pro-amazon", snapshotMinor: 18500 },
  { id: "off-winbot-w2s-amazon", productId: "prod-ecovacs-winbot-w2s", asin: "B0G5Y3NHTX", redirectKey: "win-ecovacs-w2s-amazon", snapshotMinor: 33000 },
  { id: "off-winbot-mini-amazon", productId: "prod-ecovacs-winbot-mini", asin: "B0DR8W696Y", redirectKey: "win-ecovacs-mini-amazon", snapshotMinor: 15000 },
  { id: "off-hobot-2s-amazon", productId: "prod-hobot-2s", asin: "B097CM7P9L", redirectKey: "win-hobot-2s-amazon", snapshotMinor: 29900 },
  { id: "off-hobot-298-amazon", productId: "prod-hobot-298", asin: "B07LF4HZ6C", redirectKey: "win-hobot-298-amazon", snapshotMinor: 25000 },
  { id: "off-coprose-x5s-amazon", productId: "prod-cop-rose-x5s", asin: "B09D98W5KQ", redirectKey: "win-coprose-x5s-amazon", snapshotMinor: 16000 },
  /* Blue only. Orange B0DC67MQ46 and Grey B0DC67QH41 are the same model in
     other colours and must never be substituted — a request for one ASIN in a
     variant family can be answered with a sibling's data, which is what the
     ASIN-equality check in the refresh service exists to catch. */
  { id: "off-mamibot-w120dp-amazon", productId: "prod-mamibot-w120-dp", asin: "B0DC6B81Z2", redirectKey: "win-mamibot-w120dp-amazon", snapshotMinor: 22900 },
  /* Null in D1 and null here. The 5 August pass recorded this one as TBC and
     nothing has replaced it — an estimate invented now to fill the column
     would be the only fabricated number in the file. */
  { id: "off-hutt-s55pro-amazon", productId: "prod-hutt-s55-pro", asin: "B0GFW8TFML", redirectKey: "win-hutt-s55pro-amazon", snapshotMinor: null },
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
  /* ECOVACS publishes no warranty term on any WINBOT page we read, and that
     gap runs across the whole range rather than one model. Null, as in D1. */
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
  // All eleven are active in D1.
  active: true,
}));
