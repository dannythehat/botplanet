import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { PRODUCTS } from "../src/content/products";
import { DESTINATIONS, REDIRECT_KEYS, REJECTED_CANDIDATES, destinationFor } from "../src/content/commerce/destinations";
import { NOT_RELATIONSHIPS, PROGRAMMES, RETAILERS, approvedUsRetailers, programme, retailer, usableUsProgrammes } from "../src/content/commerce/registry";
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
  it("captures an ASIN for six products and refuses to invent the other four", () => {
    const exact = DESTINATIONS.filter((d) => d.confidence === "researched_exact");
    const search = DESTINATIONS.filter((d) => d.confidence === "search_only");
    expect(exact).toHaveLength(6);
    expect(search).toHaveLength(4);
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
    expect(DESTINATIONS.some((d) => d.confidence === "verified_exact")).toBe(false);
    for (const d of DESTINATIONS.filter((x) => x.confidence === "researched_exact")) {
      expect(d.notes).toContain("has NOT been re-confirmed");
    }
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
    expect(destinationFor("prod-wybot-c1")!.retailerProductId).toBe("B0G64JV6K4");
    expect(destinationFor("prod-dolphin-e10")!.retailerProductId).toBeNull();
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

  it("publishes no price, stock or shipping today, because none is sourced", () => {
    expect(REPORT.totals.priceShowable).toBe(0);
    expect(REPORT.totals.stockShowable).toBe(0);
    for (const o of OFFERS) {
      expect(o.basePriceMinor).toBeNull();
      expect(o.stock.state).toBe("unknown");
    }
  });
});

describe("freshness", () => {
  it("gives a feed a longer window than a manual check", () => {
    expect(FRESHNESS_WINDOW_DAYS.product_feed).toBeGreaterThan(FRESHNESS_WINDOW_DAYS.manual_check);
    expect(FRESHNESS_WINDOW_DAYS.researched_snapshot).toBe(0);
  });

  it("moves through live, recently checked and stale as a source ages", () => {
    expect(freshnessFor("product_feed", "2026-07-31", new Date("2026-07-31"))).toBe("live");
    expect(freshnessFor("product_feed", "2026-07-26", new Date("2026-07-31"))).toBe("recently_checked");
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
  it("lets nothing into Offer schema today", () => {
    expect(REPORT.totals.schemaEligible).toBe(0);
    for (const o of OFFERS) expect(publicationFor(o).schemaEligible).toBe(false);
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
    const o = OFFERS.find((x) => x.destination.confidence === "researched_exact")!;
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
      expect(r.blockers.length).toBeGreaterThan(0);
      expect(r.nextAction.length).toBeGreaterThan(20);
    }
  });
});
