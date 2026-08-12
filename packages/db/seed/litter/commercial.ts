/**
 * Litter-box commercial seed — A MIRROR OF PRODUCTION D1, NOT A PROPOSAL.
 *
 * Written 8 August 2026, when the four litter boxes left `OFFER_SETUP_PENDING`.
 * The rows went into production first and this file was written to match them,
 * which is the order that matters: a redirect key invented here and loaded
 * later is a buy button pointing at a 404, the most damaging thing this site
 * can ship. offers.test.ts reads this file as text and checks every key against
 * REDIRECT_KEYS for exactly that reason.
 *
 * EVERY SNAPSHOT IS NULL, AND THAT IS A DECISION RATHER THAN MISSING WORK.
 * The window and companion seeds carry research figures in this column, stored
 * as `snapshot` / `indicative` so the freshness gate can never publish them.
 * That is safe and it is still a number sitting in a price field that nobody
 * checked through the pipeline. These eleven products had a price read from
 * each listing on 8 August — $699.00, $509.99, $599.00, $229.99 — and none of
 * it is copied in here. The first observation the refresh service accepts is
 * what fills this column, with the date it was read. Until then the page says
 * "Check current price", which is true, rather than holding a figure that
 * merely cannot escape.
 *
 * NO STOCK CLAIM EITHER. All four listings returned stock wording on the
 * identity read and it is transcribed in commerce/destinations.ts as evidence.
 * It is evidence about a listing, not an observation of an offer, so it stays
 * out of this file and out of every page.
 *
 * Standing rules, unchanged: no affiliate destination URLs and no tracking
 * parameters in the seed; commission lives at programme level and is private.
 */
import type { offers, redirectLinks } from "../../src/schema/commercial.js";

const USD = "USD";

interface LitterOfferSeed {
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

const offerSeeds: LitterOfferSeed[] = [
  /* The bare machine. Three Litter-Robot 4 bundles outrank it in search —
     B0FFDNZSHT and B0FFF2Y8R9 at $749, B0FFF4MYRT at $799 — and every one of
     them is a real Whisker product, which is why the destination names a SKU
     instead of searching the model. */
  { id: "off-litter-robot-4-amazon", productId: "prod-litter-robot-4", asin: "B0BH6MD3DJ", redirectKey: "litter-whisker-lr4-amazon", snapshotMinor: null },
  /* Max Pro 2, not Max Pro and not Max 3. The brief named the previous
     generation and the Max 3 (B0F1YMM29X) is a different tier rather than this
     one's successor, so the numeral is wrong in both directions. */
  { id: "off-petkit-purobot-max-pro-2-amazon", productId: "prod-petkit-purobot-max-pro-2", asin: "B0DM83CLW3", redirectKey: "litter-petkit-purobotmaxpro2-amazon", snapshotMinor: null },
  { id: "off-casa-leo-loo-too-amazon", productId: "prod-casa-leo-loo-too", asin: "B09LL9S99B", redirectKey: "litter-casaleo-lootoo-amazon", snapshotMinor: null },
  /* FOUR CENTS FROM THE WRONG MACHINE. B07X3XFB6K is the ScoopFree Crystal Pro
     *Legacy* Front-Entry at $229.95 against this one's $229.99 — PetSafe's own
     word for the previous generation, in its own title. A buyer sorting by
     price cannot tell them apart. This is the current one. */
  { id: "off-petsafe-crystal-pro-amazon", productId: "prod-petsafe-scoopfree-crystal-pro", asin: "B0DR3JP2FZ", redirectKey: "litter-petsafe-crystalpro-amazon", snapshotMinor: null },
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
