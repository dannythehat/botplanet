import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { PRODUCTS } from "../src/content/products";
import { DESTINATIONS, IDENTITY_CHECKS, REDIRECT_KEYS, REJECTED_CANDIDATES, destinationFor } from "../src/content/commerce/destinations";
import { NOT_RELATIONSHIPS, PROGRAMMES, RETAILERS, approvedUsRetailers, programme, retailer, usableUsProgrammes } from "../src/content/commerce/registry";
import { MANUAL_CHECKS } from "../src/content/commerce/manual-checks";
import { CURRENT_PRICE_STATES, FRESHNESS_WINDOW_DAYS } from "../src/content/commerce/types";
import {
  AS_AT,
  buildOffers,
  deliveredPrice,
  freshnessFor,
  isValidCurrency,
  normaliseShipping,
  normaliseStock,
  offerReport,
  preferredOffer,
  publicationFor,
  validateOffers,
} from "../src/lib/offer-truth";
import { buildOfferInventory, buildProductOfferMapping, buildProgrammeInventory, buildRejectedCandidates, buildRetailerInventory } from "../src/lib/commerce-mapping";
import { isSafeAffiliateDestination } from "@botplanet/shared";

const OFFERS = buildOffers();
const REPORT = offerReport();
const PRODUCT_IDS = Object.values(PRODUCTS).map((p) => p.productId);

describe("identity and referential integrity", () => {
  it("passes validation with no errors", () => {
    expect(REPORT.issues.filter((i) => i.severity === "error")).toEqual([]);
  });

  it("gives every offer a stable unique ID and redirect key", () => {
    const ids = OFFERS.map((o) => o.id);
    const keys = OFFERS.map((o) => o.redirectKey).filter(Boolean);
    expect(new Set(ids).size).toBe(ids.length);
    expect(new Set(keys).size).toBe(keys.length);
  });

  it("references only real products, retailers and programmes", () => {
    for (const o of OFFERS) {
      expect(PRODUCT_IDS).toContain(o.productId);
      expect(retailer(o.retailerId)).toBeDefined();
      if (o.programmeId) expect(programme(o.programmeId)).toBeDefined();
    }
  });

  it("keeps the offer's destination on the same product", () => {
    for (const o of OFFERS) expect(o.destination.productId).toBe(o.productId);
  });

  it("flags a duplicate offer", () => {
    expect(validateOffers([...OFFERS, { ...OFFERS[0] }]).some((i) => i.rule === "offer_id_unique")).toBe(true);
  });
});

describe("approved sellers only", () => {
  it("creates offers only for approved retailers", () => {
    for (const o of OFFERS) expect(retailer(o.retailerId)!.approval).toBe("approved");
    expect(approvedUsRetailers().map((r) => r.id)).toEqual(["ret-amazon"]);
  });

  it("creates no offer for a retailer we merely researched", () => {
    const researched = RETAILERS.filter((r) => r.approval === "researched_only").map((r) => r.id);
    expect(researched.length).toBeGreaterThan(0);
    for (const id of researched) expect(OFFERS.some((o) => o.retailerId === id)).toBe(false);
  });

  it("rejects an offer smuggled in for an unapproved retailer", () => {
    const bad = { ...OFFERS[0], id: "x-bad", retailerId: "ret-walmart" };
    expect(validateOffers([...OFFERS, bad]).some((i) => i.rule === "approved_retailer_only")).toBe(true);
  });

  it("records the researched retailers rather than deleting what we know", () => {
    for (const id of ["ret-walmart", "ret-leslies", "ret-dohenys", "ret-intheswim"]) {
      expect(retailer(id)).toBeDefined();
      expect(retailer(id)!.approval).toBe("researched_only");
    }
  });

  it("keeps researched networks out of the relationship list", () => {
    expect(NOT_RELATIONSHIPS.map((n) => n.network)).toEqual(expect.arrayContaining(["Impact", "FlexOffers", "Pepperjam", "Rakuten"]));
    for (const n of NOT_RELATIONSHIPS) expect(PROGRAMMES.some((p) => p.network === n.network)).toBe(false);
  });
});

describe("programme territory and state", () => {
  it("allows only active, US-usable programmes to back an offer", () => {
    for (const o of OFFERS) {
      if (!o.programmeId) continue;
      const p = programme(o.programmeId)!;
      expect(p.state).toBe("active");
      expect(p.usableForUsMarket).toBe(true);
    }
    expect(usableUsProgrammes().map((p) => p.id)).toContain("prog-amazon-us");
  });

  it("bars the WYBOT EU programme from serving a US customer", () => {
    const eu = programme("prog-wybot-awin-eu")!;
    expect(eu.state).toBe("territory_restricted");
    expect(eu.usableForUsMarket).toBe(false);
    expect(OFFERS.some((o) => o.programmeId === "prog-wybot-awin-eu")).toBe(false);
    const bad = { ...OFFERS[0], id: "x-eu", programmeId: "prog-wybot-awin-eu" };
    const issues = validateOffers([...OFFERS, bad]);
    expect(issues.some((i) => i.rule === "us_usable_programme")).toBe(true);
  });

  it("stops the pending WYBOT US programme becoming active", () => {
    const us = programme("prog-wybot-awin-us")!;
    expect(us.state).toBe("pending");
    expect(us.usableForUsMarket).toBe(false);
    expect(OFFERS.some((o) => o.programmeId === "prog-wybot-awin-us")).toBe(false);
    const bad = { ...OFFERS[0], id: "x-pending", programmeId: "prog-wybot-awin-us" };
    expect(validateOffers([...OFFERS, bad]).some((i) => i.rule === "active_programme_only")).toBe(true);
  });

  it("creates no Aiper offer from the empty CJ feed", () => {
    const cj = programme("prog-aiper-cj")!;
    expect(cj.state).toBe("active");
    expect(cj.restriction).toContain("zero products");
    expect(OFFERS.some((o) => o.programmeId === "prog-aiper-cj")).toBe(false);
  });

  it("marks Amazon links as not permitted in email", () => {
    expect(programme("prog-amazon-us")!.emailLinksAllowed).toBe(false);
  });

  it("rejects a non-US offer on a US surface", () => {
    const bad = { ...OFFERS[0], id: "x-market", market: "uk" };
    expect(validateOffers([...OFFERS, bad]).some((i) => i.rule === "us_market_only")).toBe(true);
  });
});

describe("exact-product destinations", () => {
  it("captures an ASIN for five products and refuses to invent the rest", () => {
    const exact = DESTINATIONS.filter((d) => d.confidence === "researched_exact" || d.confidence === "verified_exact");
    const search = DESTINATIONS.filter((d) => d.confidence === "search_only");
    expect(exact).toHaveLength(5);
    expect(search).toHaveLength(5);
    for (const d of exact) {
      expect(d.identifierKind).toBe("asin");
      expect(d.retailerProductId).toMatch(/^B0[A-Z0-9]{8}$/);
      expect(d.destinationUrl).toBe(`https://www.amazon.com/dp/${d.retailerProductId}`);
    }
    for (const d of search) {
      expect(d.retailerProductId).toBeNull();
      expect(d.destinationUrl).toBeNull();
    }
  });

  it("never claims a verified match on researched evidence alone", () => {
    // verified_exact now has two routes, and both require a named identifier
    // that a person or a machine actually READ — never the mere fact that the
    // ASIN was in our notes and the URL resolves. That was the check that let
    // a dead ASIN reach production.
    for (const d of DESTINATIONS.filter((x) => x.confidence === "verified_exact")) {
      const check = IDENTITY_CHECKS[d.productId];
      const manual = MANUAL_CHECKS.find((m) => m.productId === d.productId && m.identityConfirmed);
      expect(Boolean(check?.confirmed) || Boolean(manual)).toBe(true);
      // The evidence has to name what was read, not assert that it was.
      if (check?.confirmed) expect(check.evidence).toMatch(/Model Number|Model Name|canonical/i);
    }
    // Anything short of that stays researched_exact and says why.
    for (const d of DESTINATIONS.filter((x) => x.confidence === "researched_exact")) {
      expect(d.notes).toMatch(/NOT CONFIRMED|has not been confirmed/i);
    }
  });

  it("refuses an identity check that the listing does not actually support", () => {
    // The Aiper listing publishes "Blue" as its model name and mentions four
    // Scuba models in one comparison block. A page that cannot name its own
    // model cannot confirm one.
    const aiper = IDENTITY_CHECKS["prod-aiper-scuba-x1"];
    expect(aiper.confirmed).toBe(false);
    expect(destinationFor("prod-aiper-scuba-x1")!.confidence).toBe("researched_exact");
  });

  it("names the Job 8 exact model on every destination", () => {
    for (const d of DESTINATIONS) {
      expect(d.exactModel.length).toBeGreaterThan(3);
      expect(d.exactModel).not.toBe(d.productId);
    }
  });

  it("treats a search link as not an offer", () => {
    for (const o of OFFERS) {
      if (o.destination.confidence !== "search_only") continue;
      const pub = publicationFor(o);
      expect(pub.blockers.join(" ")).toContain("a search link is not an offer");
      expect(pub.schemaEligible).toBe(false);
      expect(o.suppressionReason).toContain("fallback click");
    }
  });

  it("records the reason for every rejected candidate", () => {
    expect(REJECTED_CANDIDATES.length).toBeGreaterThanOrEqual(15);
    for (const c of REJECTED_CANDIDATES) {
      expect(c.reason.length).toBeGreaterThan(30);
      expect(c.rule).toBeTruthy();
      expect(PRODUCT_IDS).toContain(c.productId);
    }
  });

  it("rejects the EU WYBOT feed as a wrong-region candidate", () => {
    const r = REJECTED_CANDIDATES.find((c) => c.rule === "wrong_region")!;
    expect(r.productId).toBe("prod-wybot-c1");
    expect(r.reason).toContain("EU");
  });

  it("rejects unapproved-retailer rows for unclear seller identity", () => {
    const unclear = REJECTED_CANDIDATES.filter((c) => c.rule === "unclear_seller");
    expect(unclear.length).toBeGreaterThanOrEqual(8);
  });

  it("resolves a destination only for the product it belongs to", () => {
    expect(destinationFor("prod-polaris-freedom")!.retailerProductId).toBe("B0BX9DJS7R");
    expect(destinationFor("prod-dolphin-e10")!.retailerProductId).toBeNull();
  });

  it("never reinstates the dead WYBOT ASIN", () => {
    // /dp/B0G64JV6K4 returns Amazon's 404 page with an HTTP 200 status, which is
    // how it survived the original check and reached production as a live buy
    // button. It stays out until a fresh ASIN is found.
    const wybot = destinationFor("prod-wybot-c1")!;
    expect(wybot.retailerProductId).toBeNull();
    expect(wybot.confidence).toBe("search_only");
    for (const d of DESTINATIONS) expect(d.retailerProductId).not.toBe("B0G64JV6K4");
    expect(REJECTED_CANDIDATES.some((c) => c.candidate.includes("B0G64JV6K4") && /DEAD ASIN/.test(c.reason))).toBe(true);
  });
});

describe("price, stock and shipping normalisation", () => {
  it("normalises stock wording to controlled states", () => {
    expect(normaliseStock("In Stock")).toBe("in_stock");
    expect(normaliseStock("Only 3 left in stock")).toBe("low_stock");
    expect(normaliseStock("Available for Pre-order")).toBe("preorder");
    expect(normaliseStock("Currently unavailable")).toBe("unavailable");
    expect(normaliseStock("Temporarily out of stock")).toBe("temporarily_unavailable");
    expect(normaliseStock("Ships from and sold by SomeSeller")).toBe("seller_specific");
  });

  it("defaults unknown stock wording to unknown, never to in stock", () => {
    expect(normaliseStock(null)).toBe("unknown");
    expect(normaliseStock("Add to Cart")).toBe("unknown");
    expect(normaliseStock("Buy Now")).toBe("unknown");
  });

  it("normalises shipping wording", () => {
    expect(normaliseShipping("FREE delivery")).toBe("free");
    expect(normaliseShipping("Shipping calculated at checkout")).toBe("calculated_at_checkout");
    expect(normaliseShipping("Enter your zip code")).toBe("postcode_dependent");
    // Free only if you pay for Prime, so it is membership-dependent, not free.
    expect(normaliseShipping("FREE Prime delivery")).toBe("membership_dependent");
    expect(normaliseShipping("3 - 5 business days")).toBe("estimated_range");
    expect(normaliseShipping(null)).toBe("unknown");
  });

  it("validates currency", () => {
    expect(isValidCurrency("USD")).toBe(true);
    expect(isValidCurrency("EUR")).toBe(false);
    expect(isValidCurrency("")).toBe(false);
  });

  it("computes a delivered price only when both parts are known", () => {
    expect(deliveredPrice(10000, 500, "charged")).toBe(10500);
    expect(deliveredPrice(10000, null, "free")).toBe(10000);
    expect(deliveredPrice(10000, null, "calculated_at_checkout")).toBeNull();
    expect(deliveredPrice(null, 500, "charged")).toBeNull();
  });

  it("publishes a price only where a human actually checked the page", () => {
    const checked = new Set(MANUAL_CHECKS.map((c) => c.productId));
    for (const o of OFFERS) {
      if (checked.has(o.productId)) {
        expect(o.basePriceMinor).not.toBeNull();
        expect(o.stock.state).not.toBe("unknown");
      } else {
        expect(o.basePriceMinor).toBeNull();
        expect(o.stock.state).toBe("unknown");
      }
    }
    expect(REPORT.totals.priceShowable).toBe(checked.size);
  });

  it("records the manual check verbatim, with its date and delivery location", () => {
    for (const c of MANUAL_CHECKS) {
      expect(c.checkedDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(c.checkedForLocation).toMatch(/US/);
      expect(c.currency).toBe("USD");
      if (c.stockWording) expect(c.stockWording).not.toBe(c.stockWording.toLowerCase().replace(/\s+/g, "_"));
    }
  });

  it("carries a marketplace seller through to the returns route", () => {
    const cc = OFFERS.find((o) => o.productId === "prod-dolphin-nautilus-cc-plus")!;
    expect(cc.destination.sellerIdentity).toBe("The Pool Spot");
    expect(cc.destination.sellerModel).toBe("marketplace_third_party");
    expect(cc.warranty.marketplaceSellerReturnRoute).toContain("The Pool Spot");
    // The seller's returns offer must never be merged into the manufacturer term.
    expect(cc.warranty.retailerReturnPeriod).toBe("FREE 30-day refund/replacement");
    expect(cc.warranty.manufacturer).toContain("1 year");
    expect(cc.warranty.manufacturer).not.toContain("30-day");
  });

  it("leaves the seller unknown when the page did not show one", () => {
    // Confirming the MODEL does not confirm the SELLER. The Polaris capture had
    // no seller line, and defaulting it to Amazon would attach a returns route
    // and a warranty position we have no evidence for.
    const pf = OFFERS.find((o) => o.productId === "prod-polaris-freedom")!;
    expect(pf.destination.confidence).toBe("verified_exact");
    expect(pf.destination.sellerIdentity).toBeNull();
    expect(pf.destination.sellerModel).toBe("unknown");
    expect(pf.warranty.marketplaceSellerReturnRoute).not.toMatch(/Sold by/);
    expect(pf.warranty.retailerReturnPeriod).toBeNull();
  });

  it("records the buy-new price and refuses the used option on the same listing", () => {
    const pf = OFFERS.find((o) => o.productId === "prod-polaris-freedom")!;
    expect(pf.basePriceMinor).toBe(119900);
    // The used copy was $934.82 and must never become the quoted price.
    expect(pf.basePriceMinor).not.toBe(93482);
    const used = REJECTED_CANDIDATES.find(
      (c) => c.productId === "prod-polaris-freedom" && c.rule === "refurbished_or_used",
    );
    expect(used).toBeDefined();
    expect(used!.candidate).toContain("934.82");
  });

  it("quotes the delivery date a non-member actually gets", () => {
    // The listing also offered "FREE delivery Tomorrow, August 1" to Prime
    // members. Recording that as the delivery statement would promise most
    // readers a date they will not be given.
    const c = MANUAL_CHECKS.find((x) => x.productId === "prod-polaris-freedom")!;
    expect(c.shippingWording).toBe("FREE delivery Thursday, August 6");
    expect(c.shippingWording).not.toMatch(/prime/i);
    const pf = OFFERS.find((o) => o.productId === "prod-polaris-freedom")!;
    expect(pf.shipping.state).toBe("free");
  });
});

describe("freshness", () => {
  it("gives a human check a month, because a shorter window means no prices at all", () => {
    expect(FRESHNESS_WINDOW_DAYS.manual_check).toBe(30);
    expect(FRESHNESS_WINDOW_DAYS.researched_snapshot).toBe(0);
  });

  it("keeps a manual price showable for the whole month", () => {
    expect(freshnessFor("manual_check", "2026-07-31", new Date("2026-08-20"))).toBe("recently_checked");
    expect(freshnessFor("manual_check", "2026-07-31", new Date("2026-09-05"))).toBe("stale");
  });

  it("refuses to show a price without the date it was checked", () => {
    const undated = { ...OFFERS.find((o) => o.basePriceMinor !== null)!, sourceCheckedDate: null };
    const pub = publicationFor(undated);
    expect(pub.priceShowable).toBe(false);
    expect(pub.blockers.join(" ")).toContain("no check date");
  });

  it("moves through live, recently checked and stale as a source ages", () => {
    expect(freshnessFor("product_feed", "2026-07-31", new Date("2026-07-31"))).toBe("live");
    expect(freshnessFor("product_feed", "2026-07-29", new Date("2026-07-31"))).toBe("recently_checked");
    expect(freshnessFor("product_feed", "2026-07-01", new Date("2026-07-31"))).toBe("stale");
  });

  it("never lets a researched snapshot become current", () => {
    expect(freshnessFor("researched_snapshot", AS_AT, new Date(AS_AT))).toBe("indicative");
    expect(CURRENT_PRICE_STATES).not.toContain("indicative");
  });

  it("returns unknown with no source or no date", () => {
    expect(freshnessFor("none", AS_AT)).toBe("unknown");
    expect(freshnessFor("product_feed", null)).toBe("unknown");
  });

  it("suppresses a stale price rather than printing it", () => {
    const stale = { ...OFFERS[0], basePriceMinor: 49900, freshness: "stale" as const };
    const pub = publicationFor(stale);
    expect(pub.priceShowable).toBe(false);
    expect(pub.blockers.join(" ")).toContain("stale");
  });

  it("suppresses an unavailable offer's price and schema", () => {
    const gone = { ...OFFERS[0], basePriceMinor: 49900, freshness: "unavailable" as const, stock: { state: "unavailable" as const, sourceWording: "Currently unavailable", checkedDate: AS_AT } };
    const pub = publicationFor(gone);
    expect(pub.priceShowable).toBe(false);
    expect(pub.schemaEligible).toBe(false);
  });
});

describe("warranty separation", () => {
  it("carries the Job 8 manufacturer term, never a retailer's wording", () => {
    for (const o of OFFERS) {
      expect(o.warranty.manufacturer.length).toBeGreaterThan(3);
      if (!o.warranty.manufacturerConfirmed) {
        expect(o.warranty.manufacturer).toBe("Manufacturer warranty term not confirmed");
      }
    }
  });

  it("keeps the retailer protection plan a separate field", () => {
    for (const o of OFFERS) {
      expect(o.warranty).toHaveProperty("retailerProtectionPlan");
      expect(o.warranty).toHaveProperty("retailerReturnPeriod");
      expect(o.warranty).toHaveProperty("marketplaceSellerReturnRoute");
    }
  });

  it("names a marketplace returns route where the seller is not exposed", () => {
    const amazon = OFFERS.find((o) => o.retailerId === "ret-amazon")!;
    expect(amazon.warranty.marketplaceSellerReturnRoute).toContain("marketplace seller");
  });
});

describe("preferred offer", () => {
  it("produces a written audit for every choice", () => {
    for (const p of REPORT.products) {
      expect(p.preferred.audit.length).toBeGreaterThanOrEqual(3);
      for (const line of p.preferred.audit) expect(line.length).toBeGreaterThan(5);
    }
  });

  it("ranks by exact-match confidence before anything else", () => {
    const exact = { ...OFFERS[0], id: "a", destination: { ...OFFERS[0].destination, confidence: "researched_exact" as const } };
    const search = { ...OFFERS[0], id: "b", destination: { ...OFFERS[0].destination, confidence: "search_only" as const } };
    const r = preferredOffer(OFFERS[0].productId, [search, exact]);
    expect(r.offerId).toBe("a");
  });

  it("uses commission only to settle a genuine tie", () => {
    for (const p of REPORT.products) expect(p.preferred.commissionUsedAsTieBreak).toBe(false);
    const a = { ...OFFERS[0], id: "a" };
    const b = { ...OFFERS[0], id: "b" };
    const r = preferredOffer(a.productId, [a, b], (x, y) => (x.id === "b" ? -1 : 1));
    expect(r.commissionUsedAsTieBreak).toBe(true);
    expect(r.offerId).toBe("b");
    expect(r.audit.join(" ")).toContain("genuinely equivalent");
  });

  it("never uses commission when the offers differ", () => {
    const cheap = { ...OFFERS[0], id: "cheap", deliveredPriceMinor: 10000 };
    const dear = { ...OFFERS[0], id: "dear", deliveredPriceMinor: 20000 };
    const r = preferredOffer(cheap.productId, [dear, cheap], () => -1);
    expect(r.offerId).toBe("cheap");
    expect(r.commissionUsedAsTieBreak).toBe(false);
  });

  it("features nothing when no approved offer exists", () => {
    const r = preferredOffer("prod-nope", OFFERS);
    expect(r.offerId).toBeNull();
    expect(r.audit.join(" ")).toContain("nothing is featured");
  });
});

describe("schema eligibility gates", () => {
  it("lets an offer into Offer schema only when it is fully evidenced", () => {
    const checked = new Set(MANUAL_CHECKS.map((c) => c.productId));
    expect(REPORT.totals.schemaEligible).toBe(checked.size);
    for (const o of OFFERS) {
      expect(publicationFor(o).schemaEligible).toBe(checked.has(o.productId));
    }
  });

  it("raises a destination to verified_exact only on a read identifier", () => {
    for (const o of OFFERS) {
      if (o.destination.confidence !== "verified_exact") continue;
      const c = MANUAL_CHECKS.find((x) => x.productId === o.productId);
      const machine = IDENTITY_CHECKS[o.productId];
      if (c) expect(c.identityConfirmed && c.observedTitle.length > 20).toBe(true);
      else expect(machine?.confirmed).toBe(true);
    }
  });

  it("confirming the model does not confirm the price", () => {
    // The identity read cannot see the buy box — `priceToPay` is absent from
    // the markup a non-browser client is served — so a machine-confirmed
    // destination still publishes no price until a person reads one.
    for (const [productId, check] of Object.entries(IDENTITY_CHECKS)) {
      if (!check.confirmed) continue;
      if (MANUAL_CHECKS.some((m) => m.productId === productId)) continue;
      const o = OFFERS.find((x) => x.productId === productId)!;
      expect(o.destination.confidence).toBe("verified_exact");
      expect(o.basePriceMinor).toBeNull();
      expect(publicationFor(o).priceShowable).toBe(false);
    }
  });

  it("requires an exact product, a current price, a currency and a stock state", () => {
    const ready = {
      ...OFFERS.find((o) => o.destination.confidence === "researched_exact")!,
      basePriceMinor: 49900,
      freshness: "live" as const,
      stock: { state: "in_stock" as const, sourceWording: "In Stock", checkedDate: AS_AT },
    };
    expect(publicationFor(ready).schemaEligible).toBe(true);
    expect(publicationFor({ ...ready, basePriceMinor: null }).schemaEligible).toBe(false);
    expect(publicationFor({ ...ready, currency: "EUR" }).schemaEligible).toBe(false);
    expect(publicationFor({ ...ready, stock: { state: "unknown", sourceWording: null, checkedDate: null } }).schemaEligible).toBe(false);
    const searchOnly = OFFERS.find((o) => o.destination.confidence === "search_only")!;
    expect(publicationFor({ ...searchOnly, basePriceMinor: 49900, freshness: "live" }).schemaEligible).toBe(false);
  });

  it("separates the right to link from the right to quote a price", () => {
    // An unchecked but exact destination: we may send someone there, but we may
    // not claim to know what it costs.
    const o = OFFERS.find((x) => x.destination.confidence === "researched_exact" && x.basePriceMinor === null)!;
    const pub = publicationFor(o);
    expect(pub.linkable).toBe(true);
    expect(pub.priceShowable).toBe(false);
  });
});

describe("/go redirect", () => {
  const route = readFileSync("apps/web/src/pages/go/[key].ts", "utf8");

  it("deep-links to the exact ASIN where one exists", () => {
    expect(route).toContain("amazon.com/dp/${exact.retailerProductId}");
    expect(route).toContain("destinationFor(offer.productId");
  });

  it("keeps an honest search fallback for products with no ASIN", () => {
    expect(route).toContain('destinationKind = "amazon_search"');
    expect(route).toContain("amazon.com/s?k=");
  });

  it("refuses an unsafe destination rather than guessing", () => {
    expect(route).toContain("isSafeAffiliateDestination");
    expect(isSafeAffiliateDestination("https://www.amazon.com/dp/B0G64JV6K4")).toBe(true);
    for (const bad of ["javascript:alert(1)", "//evil.test", "/relative", "data:text/html,x", "http://", "ftp://evil.test"]) {
      expect(isSafeAffiliateDestination(bad)).toBe(false);
    }
  });

  it("gives every linkable offer a stable /go key", () => {
    for (const o of OFFERS) {
      if (!publicationFor(o).linkable) continue;
      expect(o.redirectKey).toBeTruthy();
      expect(o.redirectKey).toMatch(/^[a-z0-9-]+$/);
    }
  });

  it("uses the recorded D1 keys rather than deriving them from the slug", () => {
    // The seeded keys do not follow a derivable pattern — pool-betta-seplus-amazon,
    // not pool-betta-se-plus-amazon. Deriving them produced five paths that 404,
    // and a dead buy button reads as a broken site rather than an absent offer.
    for (const o of OFFERS) {
      expect(o.redirectKey).toBe(REDIRECT_KEYS[o.productId]);
    }
    expect(REDIRECT_KEYS["prod-betta-se-plus"]).toBe("pool-betta-seplus-amazon");
    expect(REDIRECT_KEYS["prod-betta-se-plus"]).not.toBe("pool-betta-se-plus-amazon");
  });

  it("records a key for every launch product", () => {
    for (const id of PRODUCT_IDS) expect(REDIRECT_KEYS[id]).toBeTruthy();
    expect(new Set(Object.values(REDIRECT_KEYS)).size).toBe(PRODUCT_IDS.length);
  });

  it("carries no questionnaire answer into an outbound URL", () => {
    for (const o of OFFERS) {
      expect(o.redirectKey ?? "").not.toMatch(/answer|q\d|pool_?size|budget/i);
      expect(o.destination.destinationUrl ?? "").not.toMatch(/answer|questionnaire/i);
    }
  });
});

describe("no private data escapes", () => {
  const exports = {
    retailers: buildRetailerInventory(),
    programmes: buildProgrammeInventory(),
    offers: buildOfferInventory(),
    mapping: buildProductOfferMapping(),
    rejected: buildRejectedCandidates(),
  };

  it("publishes no commission value in any export", () => {
    const blob = JSON.stringify(exports);
    expect(blob).not.toMatch(/commissionValue|commission_?bp|payout|"rate"|percentage/i);
    // The only permitted mention is the tie-break boolean.
    const hits = blob.match(/commission[A-Za-z]*/g) ?? [];
    expect(new Set(hits)).toEqual(new Set(["commissionUsedAsTieBreak"]));
  });

  it("publishes secret names only, never values", () => {
    for (const row of exports.programmes.rows) {
      if (!row.secretRef) continue;
      expect(row.secretRef).toMatch(/^[A-Z0-9_]+$/);
    }
    const blob = JSON.stringify(exports);
    for (const v of ["273793b7", "j2koRSny", "cfut_", "Bearer "]) expect(blob).not.toContain(v);
  });

  it("matches the committed exports, so the register cannot be filled from stale data", () => {
    const files: [string, unknown][] = [
      ["docs/job-10-retailer-inventory.json", exports.retailers],
      ["docs/job-10-programme-inventory.json", exports.programmes],
      ["docs/job-10-offer-inventory.json", exports.offers],
      ["docs/job-10-product-offer-mapping.json", exports.mapping],
      ["docs/job-10-rejected-offer-candidates.json", exports.rejected],
    ];
    for (const [f, d] of files) {
      expect(JSON.parse(readFileSync(f, "utf8"))).toEqual(JSON.parse(JSON.stringify(d)));
    }
  });

  it("produces one mapping row per launch product with a canonical URL", () => {
    expect(exports.mapping.rows).toHaveLength(PRODUCT_IDS.length);
    for (const r of exports.mapping.rows) {
      expect(r.canonicalUrl).toMatch(/^https:\/\/botplanet\.io\/robots\/robotic-pool-cleaners\/[a-z0-9-]+\/$/);
      expect(r.nextAction.length).toBeGreaterThan(20);
      // A fully evidenced product legitimately has no blockers — that is the
      // goal state, not a data error. Everything else must explain itself.
      if (!r.schemaEligible) expect(r.blockers.length).toBeGreaterThan(0);
      else expect(r.blockers).toEqual([]);
    }
  });
});
