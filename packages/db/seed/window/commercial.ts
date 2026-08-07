/**
 * Window-category commercial seed.
 *
 * WHY THIS FILE EXISTS. Eleven window reviews went live on 5 August 2026 with
 * a "Buy" heading on every page and nothing behind it: no destination, no
 * redirect key, no offer. Checked on botplanet.io — every window review
 * returns 200, shows a Buy section, and contains zero prices and zero /go/
 * links, while the pool review beside it carries both. This file is one of the
 * four things that had to exist for a reader to be able to buy.
 *
 * A redirect key with no row behind it is a 404 on the buy button, which is
 * the single most damaging failure on this site — the reader trusts the page,
 * clicks, and lands on nothing. offers.test.ts reads this file as TEXT and
 * fails if any REDIRECT_KEYS entry has no matching `redirectKey:` here, so the
 * two cannot drift apart.
 *
 * Same rules as the pool seed:
 *  - NO affiliate destination URLs and NO tracking parameters are stored here.
 *  - Commission lives at PROGRAMME level and is private.
 *  - Every price is a dated SNAPSHOT, never live truth.
 *
 * ON THE PRICES BELOW, WHICH ARE DELIBERATELY ABSENT. The pool seed carries a
 * figure per offer from its research pass. These carry null, and that is not
 * laziness. The identity read of 6 August could see each listing's Brand,
 * model number and title, but Amazon omits the buy-box block (`priceToPay`)
 * from the markup it serves a non-browser client — so the dollar figures that
 * ARE in the page belong to other sellers, variants and comparison widgets.
 * One of these eleven read $15.99, which is an accessory rather than a window
 * robot. Publishing that would have been worse than publishing nothing.
 *
 * A price appears when the refresh service reads one, with the date it was
 * read beside it. The buy button does not wait for it: a working link to the
 * right product earns; a price is a courtesy to the reader.
 */
import type { offers, redirectLinks } from "../../src/schema/commercial.js";

const USD = "USD";

interface WindowOfferSeed {
  id: string;
  productId: string;
  /** ASIN, identity-confirmed 2026-08-06 — see commerce/destinations.ts. */
  asin: string;
  redirectKey: string;
}

/**
 * One Amazon US offer per window product. Amazon only: the window category has
 * no other approved retailer, and an offer for an unapproved seller is exactly
 * what the offer engine refuses to construct.
 */
const offerSeeds: WindowOfferSeed[] = [
  { id: "off-winbot-w2-pro-omni-amazon", productId: "prod-ecovacs-winbot-w2-pro-omni", asin: "B0DR8Y4VF9", redirectKey: "window-winbot-w2-pro-omni-amazon" },
  { id: "off-winbot-w2-pro-amazon", productId: "prod-ecovacs-winbot-w2-pro", asin: "B0DSKC7QT7", redirectKey: "window-winbot-w2-pro-amazon" },
  { id: "off-winbot-w3-omni-amazon", productId: "prod-ecovacs-winbot-w3-omni", asin: "B0GJDQ59J1", redirectKey: "window-winbot-w3-omni-amazon" },
  { id: "off-winbot-w1-pro-amazon", productId: "prod-ecovacs-winbot-w1-pro", asin: "B0C2CQP8ZS", redirectKey: "window-winbot-w1-pro-amazon" },
  { id: "off-winbot-w2s-amazon", productId: "prod-ecovacs-winbot-w2s", asin: "B0G5Y3NHTX", redirectKey: "window-winbot-w2s-amazon" },
  { id: "off-winbot-mini-amazon", productId: "prod-ecovacs-winbot-mini", asin: "B0DR8W696Y", redirectKey: "window-winbot-mini-amazon" },
  { id: "off-hobot-2s-amazon", productId: "prod-hobot-2s", asin: "B097CM7P9L", redirectKey: "window-hobot-2s-amazon" },
  { id: "off-hobot-298-amazon", productId: "prod-hobot-298", asin: "B07LF4HZ6C", redirectKey: "window-hobot-298-amazon" },
  { id: "off-cop-rose-x5s-amazon", productId: "prod-cop-rose-x5s", asin: "B09D98W5KQ", redirectKey: "window-cop-rose-x5s-amazon" },
  /* Blue only. Orange B0DC67MQ46 and Grey B0DC67QH41 are the same model in
     other colours and must never be substituted — a request for one ASIN in a
     variant family can be answered with a sibling's data, which is exactly
     what the ASIN-equality check in the refresh service exists to catch. */
  { id: "off-mamibot-w120dp-amazon", productId: "prod-mamibot-w120-dp", asin: "B0DC6B81Z2", redirectKey: "window-mamibot-w120dp-amazon" },
  { id: "off-hutt-s55-pro-amazon", productId: "prod-hutt-s55-pro", asin: "B0GFW8TFML", redirectKey: "window-hutt-s55-pro-amazon" },
];

export const offerRows: (typeof offers.$inferInsert)[] = offerSeeds.map((o) => ({
  id: o.id,
  productId: o.productId,
  retailerId: "ret-amazon",
  marketId: "us",
  affiliateProgramId: "ap-amazon-us",
  currencyCode: USD,
  // Null, on purpose. See the note at the top of this file.
  basePriceMinor: null,
  deliveryPriceMinor: null,
  totalLandedMinor: null,
  stockStatus: "unknown",
  deliveryMinDays: null,
  deliveryMaxDays: null,
  // ECOVACS publishes no warranty term on any WINBOT page we read, and that
  // gap runs across the whole range. Claiming one here would invent it.
  warrantySummary: null,
  returnsUrl: null,
  redirectKey: o.redirectKey,
  affiliateDestinationUrl: null, // never stored in seed
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
  // Amazon Associates US is the one approved programme, so these go live.
  active: true,
}));
