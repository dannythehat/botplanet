/**
 * Retailer and affiliate-programme registries.
 *
 * WHAT THIS CORRECTS: D1 currently holds nineteen active offers, nine of them
 * for retailers BotPlanet has no commercial relationship with — Walmart,
 * Leslie's, Doheny's, In The Swim and four manufacturer stores — carrying
 * prices copied from the same research pass as the Amazon rows. A researched
 * price at an unapproved retailer is not an offer; presenting it as one implies
 * a route we cannot honour and a check we never made. Those retailers are
 * recorded here as `researched_only`, which bars them from public offers while
 * keeping what we know about them.
 *
 * NO COMMISSION VALUES. Rates, payouts and private terms stay in D1's private
 * columns and never enter this file or any client payload.
 */
import type { AffiliateProgramme, Retailer } from "./types";

const REVIEWED = "2026-07-31";

export const RETAILERS: Retailer[] = [
  {
    id: "ret-amazon",
    displayName: "Amazon",
    legalName: "Amazon.com Services LLC",
    website: "https://www.amazon.com",
    type: "marketplace",
    marketsServed: ["us"],
    sellerModel: "mixed",
    supportUrl: "https://www.amazon.com/gp/help/customer/display.html",
    returnsUrl: "https://www.amazon.com/gp/help/customer/display.html?nodeId=GKM69DUUYKQWKWX7",
    warrantyRoute:
      "Manufacturer warranty is claimed with the manufacturer. Amazon's own returns window applies to the purchase, and a marketplace seller may set a different returns route.",
    approval: "approved",
    affiliateNetworks: ["amazon_associates_us"],
    lastReviewedDate: REVIEWED,
    pausedReason: null,
    notes: "The only retailer with a live US commercial relationship. Seller identity varies per listing and must be recorded per offer, not assumed.",
  },

  /* --- Researched only. No relationship; may not carry a public offer. --- */
  ...(
    [
      ["ret-walmart", "Walmart", "https://www.walmart.com", "mass_retailer", "mixed"],
      ["ret-leslies", "Leslie's Pool Supplies", "https://lesliespool.com", "specialist_retailer", "retailer_owned_inventory"],
      ["ret-dohenys", "Doheny's", "https://www.doheny.com", "specialist_retailer", "retailer_owned_inventory"],
      ["ret-intheswim", "In The Swim", "https://www.intheswim.com", "specialist_retailer", "retailer_owned_inventory"],
    ] as const
  ).map(([id, name, website, type, sellerModel]): Retailer => ({
    id,
    displayName: name,
    legalName: null,
    website,
    type,
    marketsServed: ["us"],
    sellerModel,
    supportUrl: null,
    returnsUrl: null,
    warrantyRoute: "Not established — no commercial relationship, so the returns and warranty route has not been verified.",
    approval: "researched_only",
    affiliateNetworks: [],
    lastReviewedDate: REVIEWED,
    pausedReason: null,
    notes:
      "Known to stock products in the launch category, but BotPlanet has no affiliate or commercial relationship. Recorded for future application; barred from carrying a public offer until one exists.",
  })),

  /* --- Manufacturer-direct stores. Same rule. --- */
  ...(
    [
      ["ret-aiper-store", "Aiper (direct)", "https://aiper.com", "Aiper"],
      ["ret-beatbot-store", "Beatbot (direct)", "https://beatbot.com", "Beatbot"],
      ["ret-wybot-store", "WYBOT (direct)", "https://www.wybotpool.com", "WYBOT"],
    ] as const
  ).map(([id, name, website, brand]): Retailer => ({
    id,
    displayName: name,
    legalName: null,
    website,
    type: "manufacturer_direct",
    marketsServed: ["us"],
    sellerModel: "manufacturer_direct",
    supportUrl: null,
    returnsUrl: null,
    warrantyRoute: `${brand} handles both the sale and the warranty when buying direct, but the terms have not been verified.`,
    approval: "researched_only",
    affiliateNetworks: [],
    lastReviewedDate: REVIEWED,
    pausedReason: null,
    notes:
      brand === "WYBOT"
        ? "A US Awin programme (WYBOTICS INC, advertiser 76816) has been applied for and is pending. Until it is approved this store carries no public offer."
        : brand === "Aiper"
          ? "The Aiper relationship is CJ advertiser 6404897 and is joined, but its product catalogue is empty, so no exact offer can be built from it."
          : "No affiliate relationship. Recorded for future application.",
  })),
];

export const retailer = (id: string): Retailer | undefined => RETAILERS.find((r) => r.id === id);

/** Retailers that may carry a public offer to a US customer. */
export const approvedUsRetailers = () => RETAILERS.filter((r) => r.approval === "approved" && r.marketsServed.includes("us"));

/* ------------------------------------------------------------------ */
/* Affiliate programmes                                                */
/* ------------------------------------------------------------------ */

export const PROGRAMMES: AffiliateProgramme[] = [
  {
    id: "prog-amazon-us",
    network: "Amazon Associates",
    advertiserId: null,
    state: "active",
    market: "us",
    usableForUsMarket: true,
    cookieDays: 1,
    deepLinkSupport: true,
    productFeedSupport: false,
    imageDataPermission:
      "Amazon Program Content may be displayed via approved Associates tools or the Creators API, served from Amazon's hosts, unaltered beyond permitted proportional resizing.",
    // Amazon's Operating Agreement restricts Special Links in email.
    emailLinksAllowed: false,
    termsSource: "Amazon Associates Operating Agreement; account botplanet-20",
    termsVerifiedDate: REVIEWED,
    secretRef: null,
    restriction: null,
  },
  {
    id: "prog-aiper-cj",
    network: "CJ",
    advertiserId: "6404897",
    state: "active",
    market: "us",
    usableForUsMarket: true,
    cookieDays: null,
    deepLinkSupport: true,
    productFeedSupport: true,
    imageDataPermission: "Programme terms not exposed to a publisher token; the most restrictive reading applies.",
    emailLinksAllowed: false,
    termsSource: "CJ publisher 8029924, property 101845913",
    termsVerifiedDate: REVIEWED,
    secretRef: "CJ_API_TOKEN",
    restriction:
      "Joined and readable, but the Aiper Product Catalog (feed 17133094) contains zero products and the twelve approved creatives are campaign banners. No exact product offer can be built from it, so no Aiper offer is created.",
  },
  {
    id: "prog-wybot-awin-eu",
    network: "Awin",
    advertiserId: "115280",
    state: "territory_restricted",
    market: "eu",
    usableForUsMarket: false,
    cookieDays: null,
    deepLinkSupport: true,
    productFeedSupport: true,
    imageDataPermission: "EU/UK creatives only.",
    emailLinksAllowed: false,
    termsSource: "Awin publisher 3012175, advertiser 115280 (Wybot EU)",
    termsVerifiedDate: REVIEWED,
    secretRef: "AWIN_API_TOKEN",
    restriction:
      "Joined, but the programme's region is Germany and its valid domains are eu.wybotpool.com. It must never serve a US customer, and no US offer may be built from it.",
  },
  {
    id: "prog-wybot-awin-us",
    network: "Awin",
    advertiserId: "76816",
    state: "pending",
    market: "us",
    usableForUsMarket: false,
    cookieDays: null,
    deepLinkSupport: true,
    productFeedSupport: true,
    imageDataPermission: "Gated until the advertiser approves.",
    emailLinksAllowed: false,
    termsSource: "Awin publisher 3012175, advertiser 76816 (WYBOTICS INC)",
    termsVerifiedDate: null,
    secretRef: "AWIN_API_TOKEN",
    restriction:
      "Applied for and confirmed pending by the Awin API. Terms and product feed are gated behind 'No relationship exists', so the programme cannot become active and cannot carry an offer until the advertiser approves.",
  },
];

export const programme = (id: string): AffiliateProgramme | undefined => PROGRAMMES.find((p) => p.id === id);

/** Programmes that may legitimately monetise a click from a US customer. */
export const usableUsProgrammes = () => PROGRAMMES.filter((p) => p.state === "active" && p.usableForUsMarket);

/**
 * Programmes recorded elsewhere as researched but which are NOT relationships.
 * Kept as data so a research figure can never be mistaken for an approval.
 */
export const NOT_RELATIONSHIPS: { network: string; note: string }[] = [
  { network: "Impact", note: "Beatbot application declined. Not a relationship." },
  { network: "FlexOffers", note: "Researched as a possible future route for Beatbot and Leslie's. No application submitted." },
  { network: "Pepperjam", note: "Researched as a possible future route for Doheny's. No application submitted." },
  { network: "Rakuten", note: "Researched only. No application submitted." },
];
