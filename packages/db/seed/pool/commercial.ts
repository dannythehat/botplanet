/**
 * Pool-category commercial seed (PROVISIONAL DRAFT).
 *
 * Rules honoured here:
 *  - Every price is a dated SNAPSHOT (priceVerification: "snapshot"), not live truth.
 *  - Affiliate commission/cookie are provisional (verificationStatus: "provisional")
 *    and nullable where unconfirmed. Commission lives at PROGRAMME level and is private.
 *  - NO affiliate destination URLs and NO tracking parameters are stored here.
 *  - emailLinksAllowed defaults to false everywhere until a programme is confirmed.
 */
import { toMinorUnits } from "@botplanet/shared";
import type { retailers, retailerMarkets, affiliatePrograms, offers, redirectLinks } from "../../src/schema/commercial.js";

const USD = "USD";

export const retailerRows: (typeof retailers.$inferInsert)[] = [
  { id: "ret-amazon", slug: "amazon", name: "Amazon", type: "marketplace", approvalStatus: "unreviewed" },
  { id: "ret-walmart", slug: "walmart", name: "Walmart", type: "marketplace", approvalStatus: "unreviewed" },
  { id: "ret-leslies", slug: "leslies", name: "Leslie's Pool Supplies", type: "specialist", approvalStatus: "unreviewed" },
  { id: "ret-dohenys", slug: "dohenys", name: "Doheny's", type: "specialist", approvalStatus: "unreviewed" },
  { id: "ret-intheswim", slug: "intheswim", name: "In The Swim", type: "specialist", approvalStatus: "unreviewed" },
  { id: "ret-beatbot-store", slug: "beatbot-store", name: "Beatbot Store", type: "manufacturer_store", approvalStatus: "unreviewed" },
  { id: "ret-aiper-store", slug: "aiper-store", name: "Aiper Store", type: "manufacturer_store", approvalStatus: "unreviewed" },
  { id: "ret-wybot-store", slug: "wybot-store", name: "WYBOT Store", type: "manufacturer_store", approvalStatus: "unreviewed" },
];

export const retailerMarketRows: (typeof retailerMarkets.$inferInsert)[] = retailerRows.map((r) => ({
  id: `rm-${r.id}-us`,
  retailerId: r.id as string,
  marketId: "us",
  approved: r.id === "ret-amazon", // Amazon Associates approved; others pending
  shipsToJson: ["US"],
}));

/**
 * Affiliate programmes (provisional). Commission in basis points is PRIVATE.
 * Sources verified 2026-07-29; rates/cookies change frequently.
 */
export const affiliateProgramRows: (typeof affiliatePrograms.$inferInsert)[] = [
  {
    id: "ap-amazon-us",
    retailerId: "ret-amazon",
    brandId: null,
    marketId: "us",
    network: "amazon_us",
    status: "active", // approved — tag botplanet-20
    cookieDays: 1, // 24-hour cookie
    commissionType: "percent",
    commissionValueBp: 300, // ~3% (category-dependent)
    emailLinksAllowed: false, // Amazon prohibits affiliate links in email
    verificationStatus: "verified",
    notes: "Home/Lawn&Garden ~3%, 24h cookie. No links in email/offline.",
  },
  {
    id: "ap-beatbot-direct",
    retailerId: "ret-beatbot-store",
    brandId: "brand-beatbot",
    marketId: "us",
    network: "direct",
    status: "identified",
    cookieDays: 30,
    commissionType: "percent",
    commissionValueBp: 800, // 8%
    emailLinksAllowed: false,
    verificationStatus: "provisional",
    notes: "Beatbot in-house programme; also on FlexOffers.",
  },
  {
    id: "ap-aiper-cj",
    retailerId: "ret-aiper-store",
    brandId: "brand-aiper",
    marketId: "us",
    network: "cj",
    status: "identified",
    cookieDays: 45,
    commissionType: "percent",
    commissionValueBp: 900, // 8-10% (provisional midpoint)
    emailLinksAllowed: false,
    verificationStatus: "provisional",
    notes: "Aiper via CJ / Impact / Rakuten. AOV ~$500.",
  },
  {
    id: "ap-wybot-impact",
    retailerId: "ret-wybot-store",
    brandId: "brand-wybot",
    marketId: "us",
    network: "impact",
    status: "identified",
    cookieDays: null, // UNCONFIRMED
    commissionType: "percent",
    commissionValueBp: 1200, // min 12%
    emailLinksAllowed: false,
    verificationStatus: "provisional",
    notes: "WYBOT via Impact / Awin. Cookie duration to confirm.",
  },
  {
    id: "ap-dohenys-pepperjam",
    retailerId: "ret-dohenys",
    brandId: null,
    marketId: "us",
    network: "pepperjam",
    status: "identified",
    cookieDays: null, // unconfirmed
    commissionType: "percent",
    commissionValueBp: 750, // up to 7.5%
    emailLinksAllowed: false,
    verificationStatus: "provisional",
    notes: "Best non-Amazon route for Dolphin & Polaris (no direct programmes).",
  },
  {
    id: "ap-leslies-flexoffers",
    retailerId: "ret-leslies",
    brandId: null,
    marketId: "us",
    network: "flexoffers",
    status: "identified",
    cookieDays: 30,
    commissionType: "percent",
    commissionValueBp: 240, // ~2.4%
    emailLinksAllowed: false,
    verificationStatus: "provisional",
    notes: "Carries Dolphin, Polaris, Betta.",
  },
];

interface OfferSeed {
  id: string;
  productId: string;
  retailerId: string;
  affiliateProgramId: string | null;
  priceUsd: number;
  warranty: string | null;
  redirectKey: string;
}

/** One representative provisional US offer per product (some products get two, to
 *  demonstrate product/offer separation). Prices are 2026-07-29 snapshots. */
const offerSeeds: OfferSeed[] = [
  { id: "off-ultra-beatbot", productId: "prod-beatbot-aquasense-2-ultra", retailerId: "ret-beatbot-store", affiliateProgramId: "ap-beatbot-direct", priceUsd: 2499, warranty: "3-year full replacement", redirectKey: "pool-beatbot-ultra-beatbot" },
  { id: "off-ultra-amazon", productId: "prod-beatbot-aquasense-2-ultra", retailerId: "ret-amazon", affiliateProgramId: "ap-amazon-us", priceUsd: 2499, warranty: "3-year", redirectKey: "pool-beatbot-ultra-amazon" },
  { id: "off-scubax1-aiper", productId: "prod-aiper-scuba-x1", retailerId: "ret-aiper-store", affiliateProgramId: "ap-aiper-cj", priceUsd: 1299, warranty: "2-year", redirectKey: "pool-aiper-scubax1-aiper" },
  { id: "off-scubas1-aiper", productId: "prod-aiper-scuba-s1", retailerId: "ret-aiper-store", affiliateProgramId: "ap-aiper-cj", priceUsd: 498, warranty: "2-year", redirectKey: "pool-aiper-scubas1-aiper" },
  { id: "off-seagull-amazon", productId: "prod-aiper-seagull-se", retailerId: "ret-amazon", affiliateProgramId: "ap-amazon-us", priceUsd: 150, warranty: "1-2 year", redirectKey: "pool-aiper-seagull-amazon" },
  { id: "off-wybotc1-wybot", productId: "prod-wybot-c1", retailerId: "ret-wybot-store", affiliateProgramId: "ap-wybot-impact", priceUsd: 419, warranty: "2-year", redirectKey: "pool-wybot-c1-wybot" },
  { id: "off-ccplus-dohenys", productId: "prod-dolphin-nautilus-cc-plus", retailerId: "ret-dohenys", affiliateProgramId: "ap-dohenys-pepperjam", priceUsd: 699, warranty: "2-3 year", redirectKey: "pool-dolphin-ccplus-dohenys" },
  { id: "off-ccplus-amazon", productId: "prod-dolphin-nautilus-cc-plus", retailerId: "ret-amazon", affiliateProgramId: "ap-amazon-us", priceUsd: 699, warranty: "2-3 year", redirectKey: "pool-dolphin-ccplus-amazon" },
  { id: "off-premier-leslies", productId: "prod-dolphin-premier", retailerId: "ret-leslies", affiliateProgramId: "ap-leslies-flexoffers", priceUsd: 1299, warranty: "3-year", redirectKey: "pool-dolphin-premier-leslies" },
  { id: "off-freedom-intheswim", productId: "prod-polaris-freedom", retailerId: "ret-intheswim", affiliateProgramId: null, priceUsd: 1399, warranty: "2-3 year", redirectKey: "pool-polaris-freedom-intheswim" },
  { id: "off-betta-leslies", productId: "prod-betta-se-plus", retailerId: "ret-leslies", affiliateProgramId: "ap-leslies-flexoffers", priceUsd: 389, warranty: "2-year", redirectKey: "pool-betta-seplus-leslies" },
  { id: "off-e10-walmart", productId: "prod-dolphin-e10", retailerId: "ret-walmart", affiliateProgramId: null, priceUsd: 529, warranty: "2-year", redirectKey: "pool-dolphin-e10-walmart" },
  // Amazon US offers for every product — Amazon Associates (botplanet-20) is the
  // approved US route, so every product has a live, tracked buy-link.
  { id: "off-scubax1-amazon", productId: "prod-aiper-scuba-x1", retailerId: "ret-amazon", affiliateProgramId: "ap-amazon-us", priceUsd: 1299, warranty: "2-year", redirectKey: "pool-aiper-scubax1-amazon" },
  { id: "off-scubas1-amazon", productId: "prod-aiper-scuba-s1", retailerId: "ret-amazon", affiliateProgramId: "ap-amazon-us", priceUsd: 498, warranty: "2-year", redirectKey: "pool-aiper-scubas1-amazon" },
  { id: "off-wybotc1-amazon", productId: "prod-wybot-c1", retailerId: "ret-amazon", affiliateProgramId: "ap-amazon-us", priceUsd: 419, warranty: "2-year", redirectKey: "pool-wybot-c1-amazon" },
  { id: "off-premier-amazon", productId: "prod-dolphin-premier", retailerId: "ret-amazon", affiliateProgramId: "ap-amazon-us", priceUsd: 1299, warranty: "3-year", redirectKey: "pool-dolphin-premier-amazon" },
  { id: "off-freedom-amazon", productId: "prod-polaris-freedom", retailerId: "ret-amazon", affiliateProgramId: "ap-amazon-us", priceUsd: 1399, warranty: "2-3 year", redirectKey: "pool-polaris-freedom-amazon" },
  { id: "off-betta-amazon", productId: "prod-betta-se-plus", retailerId: "ret-amazon", affiliateProgramId: "ap-amazon-us", priceUsd: 389, warranty: "2-year", redirectKey: "pool-betta-seplus-amazon" },
  { id: "off-e10-amazon", productId: "prod-dolphin-e10", retailerId: "ret-amazon", affiliateProgramId: "ap-amazon-us", priceUsd: 529, warranty: "2-year", redirectKey: "pool-dolphin-e10-amazon" },
];

export const offerRows: (typeof offers.$inferInsert)[] = offerSeeds.map((o) => ({
  id: o.id,
  productId: o.productId,
  retailerId: o.retailerId,
  marketId: "us",
  affiliateProgramId: o.affiliateProgramId,
  currencyCode: USD,
  basePriceMinor: toMinorUnits(o.priceUsd, "USD"),
  deliveryPriceMinor: null,
  totalLandedMinor: null,
  stockStatus: "unknown",
  deliveryMinDays: null,
  deliveryMaxDays: null,
  warrantySummary: o.warranty,
  returnsUrl: null,
  redirectKey: o.redirectKey,
  affiliateDestinationUrl: null, // never stored in seed
  commissionValueBp: null, // commission lives on the programme (private); tie-break derives from there
  source: "manual",
  freshnessClass: "indicative",
  confidence: "low",
  priceVerification: "snapshot", // dated research snapshot, not live truth
  sellerIdentity: null,
  offerStatus: "active",
}));

export const redirectLinkRows: (typeof redirectLinks.$inferInsert)[] = offerSeeds.map((o) => ({
  key: o.redirectKey,
  offerId: o.id,
  // Live once the offer's affiliate programme is approved (Amazon is).
  active: o.affiliateProgramId === "ap-amazon-us",
}));
