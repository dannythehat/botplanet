/**
 * Coding-robot commercial seed — A MIRROR OF PRODUCTION D1, NOT A PROPOSAL.
 *
 * Written 8 August 2026 with the first five reviews in the category. Rows went
 * into production first; this file was written to match them.
 *
 * FIVE OF TWELVE, and the seven missing are the point. Five had the wrong ASIN
 * or the wrong product behind them and two cannot be bought at all — the
 * Bee-Bot candidate was a $691 six-robot class pack, SPIKE Essential a $597
 * education SKU, the Sphero RVR candidate an RVR+. This category sells to
 * schools as much as to parents and the failures are all the school side.
 * See docs/seo/coding-robots-findings.md.
 */
import type { offers, redirectLinks } from "../../src/schema/commercial.js";

const USD = "USD";

interface CodingOfferSeed {
  id: string;
  productId: string;
  /** ASIN, identity-read 2026-08-08 — see commerce/destinations.ts. */
  asin: string;
  /** D1 `offers.redirect_key`, verbatim. NEVER derive this. */
  redirectKey: string;
  snapshotMinor: number | null;
}

const offerSeeds: CodingOfferSeed[] = [
  { id: "off-sphero-bolt-amazon", productId: "prod-sphero-bolt", asin: "B07DLM5DL7", redirectKey: "code-sphero-bolt-amazon", snapshotMinor: 17900 },
  /* Blue. Sphero sells the Mini in several colours and the details table is
     what identifies this one — the productTitle element did not render. */
  { id: "off-sphero-mini-amazon", productId: "prod-sphero-mini", asin: "B072B6QVVW", redirectKey: "code-sphero-mini-amazon", snapshotMinor: 5000 },
  /* The At-Home kit, NOT the classroom pack Sphero also sells under this name. */
  { id: "off-sphero-indi-amazon", productId: "prod-sphero-indi", asin: "B094X6TV5V", redirectKey: "code-sphero-indi-amazon", snapshotMinor: 10000 },
  { id: "off-ozobot-evo-amazon", productId: "prod-ozobot-evo", asin: "B0CSR53WXV", redirectKey: "code-ozobot-evo-amazon", snapshotMinor: 17500 },
  { id: "off-makeblock-mbot-amazon", productId: "prod-makeblock-mbot", asin: "B00SK5RUQY", redirectKey: "code-makeblock-mbot-amazon", snapshotMinor: 6900 },
  /* Added 26 September 2026, identity-read via web search rather than a
     listing fetch — see CODING_GIFT_ASINS in commerce/destinations.ts and
     docs/seo/coding-robots-gift-topup-findings.md. snapshotMinor null on
     both: Botley's price disagreed across sources, and neither was read from
     the listing itself, so nothing is quoted until the refresh service
     reads and dates a figure. */
  { id: "off-botley2-amazon", productId: "prod-botley-2", asin: "B083T58PKM", redirectKey: "code-botley2-amazon", snapshotMinor: null },
  { id: "off-robotmouse-amazon", productId: "prod-code-and-go-robot-mouse", asin: "B01B14XK00", redirectKey: "code-robotmouse-amazon", snapshotMinor: null },
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
