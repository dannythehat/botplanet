/**
 * Machine-readable commercial exports for the Content & SEO Control Register.
 *
 * Claude does not write to the register. These five documents are generated from
 * the offer engine and drift-tested, so a register row can never be filled from
 * a figure the system no longer holds.
 *
 * NOTHING PRIVATE LEAVES HERE. No commission rate, no payout term, no secret
 * value, no signed URL. A programme record carries the NAME of its Worker secret
 * and nothing more, and a test asserts the exports stay clean.
 */
import { PRODUCTS } from "../content/products";
import { productPath } from "../content/routes";
import { absUrl } from "./seo";
import { DESTINATIONS, REJECTED_CANDIDATES } from "../content/commerce/destinations";
import { PROGRAMMES, RETAILERS } from "../content/commerce/registry";
import { AS_AT, offerReport, publicationFor } from "./offer-truth";

export const buildRetailerInventory = () => ({
  generatedFor: AS_AT,
  total: RETAILERS.length,
  approved: RETAILERS.filter((r) => r.approval === "approved").length,
  researchedOnly: RETAILERS.filter((r) => r.approval === "researched_only").length,
  rows: RETAILERS.map((r) => ({
    retailerId: r.id,
    displayName: r.displayName,
    website: r.website,
    type: r.type,
    marketsServed: r.marketsServed,
    sellerModel: r.sellerModel,
    approval: r.approval,
    affiliateNetworks: r.affiliateNetworks,
    returnsUrl: r.returnsUrl,
    warrantyRoute: r.warrantyRoute,
    lastReviewedDate: r.lastReviewedDate,
    pausedReason: r.pausedReason,
    mayCarryPublicOffer: r.approval === "approved",
    notes: r.notes,
  })),
});

export const buildProgrammeInventory = () => ({
  generatedFor: AS_AT,
  active: PROGRAMMES.filter((p) => p.state === "active").length,
  pending: PROGRAMMES.filter((p) => p.state === "pending").length,
  territoryRestricted: PROGRAMMES.filter((p) => p.state === "territory_restricted").length,
  rows: PROGRAMMES.map((p) => ({
    programmeId: p.id,
    network: p.network,
    advertiserId: p.advertiserId,
    state: p.state,
    market: p.market,
    usableForUsMarket: p.usableForUsMarket,
    cookieDays: p.cookieDays,
    deepLinkSupport: p.deepLinkSupport,
    productFeedSupport: p.productFeedSupport,
    emailLinksAllowed: p.emailLinksAllowed,
    imageDataPermission: p.imageDataPermission,
    termsSource: p.termsSource,
    termsVerifiedDate: p.termsVerifiedDate,
    // The secret's NAME only. Never a value, and never a commission figure.
    secretRef: p.secretRef,
    restriction: p.restriction,
  })),
});

export const buildOfferInventory = () => {
  const report = offerReport();
  return {
    generatedFor: AS_AT,
    totals: report.totals,
    rows: report.offers.map((o) => {
      const pub = publicationFor(o);
      return {
        offerId: o.id,
        productId: o.productId,
        retailerId: o.retailerId,
        programmeId: o.programmeId,
        market: o.market,
        currency: o.currency,
        retailerProductId: o.destination.retailerProductId,
        identifierKind: o.destination.identifierKind,
        exactModel: o.destination.exactModel,
        matchConfidence: o.destination.confidence,
        destinationUrl: o.destination.destinationUrl,
        sellerIdentity: o.destination.sellerIdentity,
        priceMinor: o.basePriceMinor,
        stockState: o.stock.state,
        shippingState: o.shipping.state,
        deliveredPriceMinor: o.deliveredPriceMinor,
        warrantyManufacturer: o.warranty.manufacturer,
        warrantyManufacturerConfirmed: o.warranty.manufacturerConfirmed,
        retailerProtectionPlan: o.warranty.retailerProtectionPlan,
        source: o.source,
        sourceCheckedDate: o.sourceCheckedDate,
        freshness: o.freshness,
        confidence: o.confidence,
        redirectKey: o.redirectKey,
        goPath: o.redirectKey ? `/go/${o.redirectKey}` : null,
        active: o.active,
        suppressionReason: o.suppressionReason,
        publication: pub,
      };
    }),
  };
};

export const buildRejectedCandidates = () => ({
  generatedFor: AS_AT,
  total: REJECTED_CANDIDATES.length,
  byRule: REJECTED_CANDIDATES.reduce<Record<string, number>>((a, c) => ({ ...a, [c.rule]: (a[c.rule] ?? 0) + 1 }), {}),
  rows: REJECTED_CANDIDATES,
});

export const buildProductOfferMapping = () => {
  const report = offerReport();
  return {
    generatedFor: AS_AT,
    launchProducts: report.products.length,
    rows: report.products.map((p) => {
      const product = Object.values(PRODUCTS).find((x) => x.productId === p.productId)!;
      const pref = p.offers.find((o) => o.id === p.preferred.offerId) ?? null;
      const prefPub = pref ? publicationFor(pref) : null;
      const dest = DESTINATIONS.find((d) => d.productId === p.productId);

      const blockers: string[] = [];
      if (!pref) blockers.push("no approved offer");
      if (prefPub && !prefPub.priceShowable) blockers.push("no current price from an approved source");
      if (prefPub && !prefPub.stockShowable) blockers.push("stock state unknown");
      if (dest?.confidence === "search_only") blockers.push("no exact Amazon destination — only a search fallback");
      if (prefPub && !prefPub.schemaEligible) blockers.push("not eligible for Offer structured data");

      return {
        productId: p.productId,
        canonicalUrl: absUrl(productPath(product.slug)),
        verifiedOffers: p.verifiedOffers,
        preferredOfferId: p.preferred.offerId,
        preferredOfferAudit: p.preferred.audit,
        commissionUsedAsTieBreak: p.preferred.commissionUsedAsTieBreak,
        retailer: pref?.retailerId ?? null,
        exactProductIdentifier: dest?.retailerProductId ?? null,
        identifierKind: dest?.identifierKind ?? null,
        market: "us",
        priceState: prefPub?.priceShowable ? "current" : "not_published",
        stockState: pref?.stock.state ?? "unknown",
        deliveryState: pref?.shipping.state ?? "unknown",
        warrantyRoute: pref?.warranty.manufacturer ?? null,
        lastChecked: pref?.sourceCheckedDate ?? null,
        freshness: pref?.freshness ?? "unknown",
        affiliateProgramme: pref?.programmeId ?? null,
        goPath: pref?.redirectKey ? `/go/${pref.redirectKey}` : null,
        schemaEligible: prefPub?.schemaEligible ?? false,
        blockers,
        nextAction:
          dest?.confidence === "search_only"
            ? "Capture an exact Amazon ASIN for this product, then re-run the destination check."
            : "Obtain price and availability through the Amazon Creators API so the offer can carry a current price and enter Offer schema.",
      };
    }),
  };
};
