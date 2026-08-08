import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { PAGE_PLAN } from "../src/content/seo/page-plan";
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
import { SUPERSEDED_REFUSALS } from "../src/content/commerce/destinations";
import { SerpApiAmazonProvider, SERPAPI_SECRET_REF, priceToMinor, toAttributes, toBuyingOptions } from "../src/lib/providers/serpapi-amazon";
import { CATALOGUE_INTERVAL_DAYS, DAILY_INTERVAL_DAYS, MAX_DAILY_EXCEPTIONS, MONTHLY_CREDIT_CEILING, monthlyCost, planRefresh, type ExceptionReason } from "../src/lib/providers/refresh-policy";
import { attributeSignals } from "../src/lib/providers/marketplace-attributes";
import { buyNew, gate, matchIdentity, runRefresh } from "../src/lib/providers/refresh-service";
import { AWAITING_DISCOVERY, EXPECTED_IDENTITIES } from "../src/lib/providers/expected-identity";
import type { BuyingOption } from "../src/lib/providers/amazon-provider";
import { AMAZON_ASSOCIATE_TAG, AMAZON_ASSOCIATE_TAG_STATUS, amazonDestination } from "../src/lib/site";
import { ACTIVE_PRODUCTS, CATALOGUE_WITHDRAWALS, LIFTED_WITHDRAWALS, PRODUCT_ID, activeCatalogue, catalogueStatusOf, productEditorialById } from "../src/content/products";
import { RETIRED_SLUGS, resolveSlug } from "../src/content/product-names";
import { SHOW_PRICES } from "../src/content/commerce/price-display";
import { marketplaceFor } from "../src/content/commerce/amazon-marketplaces";
import { RETIRED_VERIFICATIONS } from "../src/content/evidence/verification";
import { deriveLedger } from "../src/content/evidence/derive";
import { SERPAPI_OBSERVATIONS, SERPAPI_REJECTIONS, SERPAPI_RUN_CREDITS, SERPAPI_UNRESOLVED } from "../src/content/commerce/serpapi-observations";

const LEDGER_EVIDENCE = deriveLedger().evidence;

const OFFERS = buildOffers();
const REPORT = offerReport();
/*
 * THE CATALOGUE, NOT THE POOL EDITORIAL. Corrected 6 August 2026.
 *
 * This read `PRODUCTS`, the same incomplete map buildOffers read, so every
 * assertion below agreed with the code it was checking and proved nothing. All
 * eleven window products were absent from both, which is how eleven published
 * reviews shipped with a Buy heading and no offer behind any of them without a
 * single test going red.
 *
 * A test that derives its universe from the same source as the code under test
 * can only ever confirm they match. It cannot tell you the universe is wrong.
 */
const PRODUCT_IDS = Object.values(PRODUCT_ID);

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
    // Twelve exact, nothing search-only. One of them took three attempts in a
    // single day: a listing accepted on its URL slug turned out to be the base
    // X1 bundled with a monitor, was refused once read, and was replaced by a
    // Pro Max listing that names itself in its own details table.
    //
    // A search fallback remains the honest answer whenever no correct listing
    // is held. If that happens again the count is what should change — never
    // the classification.
    // 12 pool + 11 window + 1 companion. The window eleven arrived on 6 August
    // 2026: their ASINs had been researched on 5 August and written into
    // docs/seo/window-cleaning-robots-asins.md, and were never wired to
    // anything. Identity for all eleven was machine-read before they were
    // accepted here — see scripts/amazon-identity-check.mjs.
    //
    // Moflin joined on 8 August 2026, the first companion product with
    // anything to sell. Five of that category's better-known names have no
    // Amazon US listing at all, so this count will grow slowly and should.
    expect(exact).toHaveLength(30);
    expect(search).toHaveLength(0);
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
      /*
       * The evidence has to NAME A FIELD SOMEBODY READ, not assert that
       * reading happened.
       *
       * "Brand '...'" joined the list on 6 August 2026 with the window
       * destinations. Amazon publishes an Item model number on some listings
       * and not others — of the eleven window machines, exactly one has one
       * (the W2 PRO Omni, 'W2MP'). For the other ten the fields that exist are
       * Brand and the title, and both were read verbatim.
       *
       * "Sold by '...'" and "Title: '...'" joined for the same reason: on a
       * listing that publishes neither a model number nor a model name, the
       * storefront and the verbatim title are the fields that exist, and both
       * were transcribed.
       *
       * The quote marks in the pattern are load-bearing. They demand a
       * transcribed field VALUE rather than the word "brand" or "title"
       * appearing in a sentence, which keeps the rule exactly where it was:
       * name what the page said, do not describe having looked at it.
       */
      if (check?.confirmed) expect(check.evidence).toMatch(/Model Number|Model Name|canonical|Brand '|Sold by '|Title: '/i);
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
    const aiper = IDENTITY_CHECKS["retired-prod-aiper-scuba-x1-B0F9WN961G"];
    expect(aiper.confirmed).toBe(false);
    // A second listing for the same product was refused on the same principle:
    // its URL said "Scuba-X1-Pro", its own fields said "Scuba X1+Hy Pro".
    const refusal = REJECTED_CANDIDATES.find((c) => c.candidate.includes("B0GVT2YPLB"))!;
    expect(refusal.rule).toBe("sibling_model");
    expect(refusal.reason).toContain("Scuba X1+Hy Pro");
    // What the product carries now names itself in full, in its own details table.
    expect(destinationFor("prod-aiper-scuba-x1")!.retailerProductId).toBe("B0GMPWMS2H");
    expect(IDENTITY_CHECKS["prod-aiper-scuba-x1"].evidence).toContain("Scuba X1 Pro Max");
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
    expect(destinationFor("prod-dolphin-e10")!.retailerProductId).toBe("B0GV15VY1N");
    // The C1 carries the owner-supplied replacement, not the dead ASIN.
    expect(destinationFor("prod-wybot-c1")!.retailerProductId).toBe("B0GYWJMNWK");
  });

  it("never reinstates the dead WYBOT ASIN", () => {
    // /dp/B0G64JV6K4 returns Amazon's 404 page with an HTTP 200 status, which is
    // how it survived the original check and reached production as a live buy
    // button. The C1 now has a live replacement, but the dead one must never
    // come back with it — a replacement is not an amnesty.
    const wybot = destinationFor("prod-wybot-c1")!;
    expect(wybot.retailerProductId).not.toBe("B0G64JV6K4");
    for (const d of DESTINATIONS) expect(d.retailerProductId).not.toBe("B0G64JV6K4");
    expect(REJECTED_CANDIDATES.some((c) => c.candidate.includes("B0G64JV6K4") && /DEAD ASIN/.test(c.reason))).toBe(true);
  });

  it("holds the replacement C1 at researched_exact, because nothing read the listing", () => {
    // WYBOT publishes no model number and sells C1, C1 Pro and C1 Max under
    // near-identical titles. The owner's confirmation is what separates them,
    // and an owner's word is not a machine-read identifier — so this must not
    // reach verified_exact however confident anyone is.
    const wybot = destinationFor("prod-wybot-c1")!;
    expect(wybot.retailerProductId).toBe("B0GYWJMNWK");
    expect(wybot.confidence).toBe("researched_exact");
    expect(IDENTITY_CHECKS["prod-wybot-c1"]).toBeUndefined();
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

  it("publishes a price only where a source actually read the page", () => {
    // A price reading for a product that has left the catalogue produces no
    // showable price, because it produces no offer at all. Filtering here keeps
    // the test measuring what it means to measure — evidence reaching a live
    // offer — rather than counting readings for things we no longer sell.
    const checked = new Set(
      [
        ...MANUAL_CHECKS.map((c) => c.productId),
        ...SERPAPI_OBSERVATIONS.filter((o) => o.priceMinor !== null).map((o) => o.productId),
      ].filter((id) => catalogueStatusOf(id) === "active"),
    );
    for (const o of OFFERS) {
      if (checked.has(o.productId)) {
        expect(o.basePriceMinor).not.toBeNull();
        expect(o.stock.state).not.toBe("unknown");
      } else {
        expect(o.basePriceMinor).toBeNull();
        expect(o.stock.state).toBe("unknown");
      }
    }
    /* The site-wide switch sits in front of every rule above. While it is off
       nothing prints a price at all, so the count is zero — but the evidence
       assertions in the loop still run, which is the point: the rules keep
       being tested while the display is dark, so turning it back on restores
       a behaviour that is still under test rather than one nobody has
       exercised in months. */
    expect(REPORT.totals.priceShowable).toBe(SHOW_PRICES ? checked.size : 0);
  });

  it("the switch is the only thing that ever suppresses an evidenced price", () => {
    /* Works in both positions, so it keeps its meaning whichever way the
       switch is set. Off: the switch must be the ONLY price blocker, which
       stops it masking a real regression that would surface the moment
       someone flips it. On: the switch must not appear as a blocker at all. */
    const evidenced = OFFERS.filter(
      (o) => o.basePriceMinor !== null && o.sourceCheckedDate !== null && CURRENT_PRICE_STATES.includes(o.freshness),
    );
    expect(evidenced.length).toBeGreaterThan(0);
    const SWITCH = "price display is switched off site-wide — see content/commerce/price-display.ts";
    for (const o of evidenced) {
      const blockers = publicationFor(o).blockers;
      if (SHOW_PRICES) {
        expect(blockers).not.toContain(SWITCH);
        expect(publicationFor(o).priceShowable).toBe(true);
      } else {
        expect(blockers).toContain(SWITCH);
        expect(blockers.filter((b) => /price/.test(b) && !b.includes("switched off"))).toEqual([]);
      }
    }
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

  it("leaves the seller unknown when no source has shown one", () => {
    // Confirming the MODEL does not confirm the SELLER. Refusing to default it
    // to Amazon was vindicated: the Polaris seller turned out to be In The Swim
    // Pool Supplies, a marketplace third party, once the aggregator could read
    // the line the owner's screenshot had cropped.
    const pf = OFFERS.find((o) => o.productId === "prod-polaris-freedom")!;
    expect(pf.destination.sellerIdentity).toBe("In The Swim Pool Supplies");
    expect(pf.destination.sellerModel).toBe("marketplace_third_party");

    // Beatbot is the case that still has no seller: identity is confirmed but
    // the listing exposes no buy box, so nothing about the sale is claimed.
    const bb = OFFERS.find((o) => o.productId === "prod-beatbot-aquasense-2-ultra")!;
    expect(bb.destination.sellerIdentity).toBeNull();
    expect(bb.destination.sellerModel).toBe("unknown");
    expect(bb.basePriceMinor).toBeNull();
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
    // A price reading for a product that has left the catalogue produces no
    // showable price, because it produces no offer at all. Filtering here keeps
    // the test measuring what it means to measure — evidence reaching a live
    // offer — rather than counting readings for things we no longer sell.
    const checked = new Set(
      [
        ...MANUAL_CHECKS.map((c) => c.productId),
        ...SERPAPI_OBSERVATIONS.filter((o) => o.priceMinor !== null).map((o) => o.productId),
      ].filter((id) => catalogueStatusOf(id) === "active"),
    );
    /* Offer schema carries a price in machine-readable form, so it follows the
       display switch exactly — publishing a figure to Google that the page
       itself refuses to print would be the same claim in a worse place. */
    expect(REPORT.totals.schemaEligible).toBe(SHOW_PRICES ? checked.size : 0);
    for (const o of OFFERS) {
      expect(publicationFor(o).schemaEligible).toBe(SHOW_PRICES && checked.has(o.productId));
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
      if (SERPAPI_OBSERVATIONS.some((o) => o.productId === productId && o.priceMinor !== null)) continue;
      const o = OFFERS.find((x) => x.productId === productId)!;
      // A check only vouches for the ASIN it read. Once the destination moves
      // to a different listing the check is history, not evidence.
      if (o.destination.retailerProductId !== check.asin) continue;
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
    expect(publicationFor(ready).schemaEligible).toBe(SHOW_PRICES);
    expect(publicationFor({ ...ready, basePriceMinor: null }).schemaEligible).toBe(false);
    expect(publicationFor({ ...ready, currency: "EUR" }).schemaEligible).toBe(false);
    expect(publicationFor({ ...ready, stock: { state: "unknown", sourceWording: null, checkedDate: null } }).schemaEligible).toBe(false);
    // Every product now has an exact ASIN, so there is no live search-only
    // offer to borrow. The rule still has to hold, so the case is constructed:
    // a search link with a price and a fresh check is STILL not schema-eligible.
    const searchOnly = {
      ...ready,
      destination: { ...ready.destination, confidence: "search_only" as const, retailerProductId: null, destinationUrl: null },
    };
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
    expect(route).toContain("destinationFor(offer.productId");
    // The exact ASIN now goes through marketplaceFor, which decides which
    // Amazon store it belongs to — but it is still the ASIN, never a search.
    expect(route).toContain("marketplaceFor(offer.productId, exact.retailerProductId");
    expect(marketplaceFor("prod-x", "B09K4C9WGF", "US").url).toContain("/dp/B09K4C9WGF");
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
      /* The category segment was hardcoded to robotic-pool-cleaners, from
         when pool was the only category with products. It is now whichever
         category the product belongs to — a window product's URL built on the
         pool category is a 404, so this checks the shape and lets the mapping
         name the category. */
      expect(r.canonicalUrl).toMatch(/^https:\/\/botplanet\.io\/robots\/[a-z0-9-]+\/[a-z0-9-]+\/$/);
      /* A SHAPE A WRONG ANSWER SATISFIES IS NOT A GATE. The assertion above
         passed happily on 8 August 2026 while every companion product carried
         a canonical URL of /robots/robotic-pool-cleaners/<slug>/ — five 404s
         in the export whose entire job is telling an affiliate network where
         our products live. The category segment must be the product's OWN
         category, checked against the page plan rather than against a
         pattern. */
      const slug = r.canonicalUrl.replace(/\/$/, "").split("/").pop()!;
      const category = r.canonicalUrl.split("/robots/")[1]!.split("/")[0]!;
      /* Matched by SLUG across the whole plan, not by the URL we are checking
         — asking planFor() for the URL would only confirm the URL agrees with
         itself. A product with no planned review page is skipped rather than
         failed: the withdrawn Dolphin E10 keeps a catalogue row and has no
         page, which is correct and not a category error. */
      const plan = PAGE_PLAN.find((p) => p.type === "review" && p.path.endsWith(`/${slug}/`));
      if (plan) {
        expect(plan.category, `${slug} is filed under ${category} but its page is in ${plan.category}`).toBe(category);
      }
      expect(r.nextAction.length).toBeGreaterThan(20);
      // A fully evidenced product legitimately has no blockers — that is the
      // goal state, not a data error. Everything else must explain itself.
      if (!r.schemaEligible) expect(r.blockers.length).toBeGreaterThan(0);
      else expect(r.blockers).toEqual([]);
    }
  });
});

describe("SerpApi provider — normalisation at the boundary", () => {
  const P = (key: string | undefined) =>
    new SerpApiAmazonProvider({ apiKey: key, today: "2026-07-31" });

  it("parses money without inventing precision", () => {
    expect(priceToMinor("$1,199.00")).toBe(119900);
    expect(priceToMinor(1199)).toBe(119900);
    expect(priceToMinor("Currently unavailable")).toBeNull();
    expect(priceToMinor(null)).toBeNull();
  });

  it("keeps each buying condition separate, with its own seller", () => {
    // The Polaris listing sells new at $1,199 and used at $934.82 under
    // different terms. Collapsing them would quote the wrong thing.
    const opts = toBuyingOptions(
      {
        buy_new: { price: "$1,199.00", stock: "In Stock", delivery: ["FREE delivery Thursday, August 6"],
          features: { shipper_seller: { text: "In The Swim Pool Supplies" }, returns: { text: "FREE 30-day refund/replacement" } } },
        buy_used: { price: "$934.82", stock: "Only 1 left in stock - order soon." },
      },
      {},
    );
    const n = opts.find((o) => o.condition === "new")!;
    const u = opts.find((o) => o.condition === "used")!;
    expect(n.priceMinor).toBe(119900);
    expect(n.sellerWording).toBe("In The Swim Pool Supplies");
    expect(n.returnsWording).toBe("FREE 30-day refund/replacement");
    expect(u.priceMinor).toBe(93482);
    expect(u.sellerWording).toBeNull();
  });

  it("passes retailer wording through verbatim rather than interpreting it", () => {
    // The provider must not decide what "In Stock" means — one normaliser,
    // in the offer engine, or two providers can disagree about the same page.
    const [o] = toBuyingOptions({ buy_new: { price: "$10.00", stock: "Only 1 left in stock - order soon." } }, {});
    expect(o.stockWording).toBe("Only 1 left in stock - order soon.");
    expect(normaliseStock(o.stockWording)).toBe("low_stock");
  });

  it("quarantines seller-entered specs away from the listing's facts", () => {
    const attrs = toAttributes({ brand_name: "Polaris", model_name: "FREEDOM", model_number: "FFREEDOM",
      charging_time: "4.5 hours", manufacturer_warranty_description: "2-Year" });
    expect(attrs.modelNumber).toBe("FFREEDOM");
    // The contradicting values are present but held in `other`, never promoted.
    expect(attrs.other.charging_time).toBe("4.5 hours");
    expect(attrs.other.manufacturer_warranty_description).toBe("2-Year");
  });

  it("refuses to spend, and says so, with no key or no credits", async () => {
    const none = await P(undefined).getListing("B0BX9DJS7R");
    expect(none.ok).toBe(false);
    expect(none.skipped).toBe("no_credentials");
    expect(none.creditsUsed).toBe(0);

    const capped = new SerpApiAmazonProvider({ apiKey: "x", today: "2026-07-31", mayspend: () => false });
    const r = await capped.getListing("B0BX9DJS7R");
    expect(r.skipped).toBe("credit_ceiling_reached");
    expect(r.creditsUsed).toBe(0);
  });

  it("names the secret rather than carrying a value", () => {
    expect(SERPAPI_SECRET_REF).toBe("SERPAPI_API_KEY");
    expect(SERPAPI_SECRET_REF).toMatch(/^[A-Z0-9_]+$/);
  });
});

describe("refresh cadence and the credit ceiling", () => {
  const today = new Date("2026-08-15T00:00:00Z");
  const c = (productId: string, lastCheckedOn: string | null, exception: ExceptionReason | null = null) =>
    ({ productId, asin: "B0TEST0001", lastCheckedOn, exception });

  it("keeps the plan inside the monthly allowance", () => {
    // Daily for everything is 300 a month against a 250 plan — the cadence
    // that looks most thorough is the one that silently stops working.
    expect(monthlyCost(10, 10)).toBeGreaterThan(250);
    expect(monthlyCost(10, 0)).toBeLessThan(MONTHLY_CREDIT_CEILING);
    expect(monthlyCost(10, MAX_DAILY_EXCEPTIONS)).toBeLessThanOrEqual(MONTHLY_CREDIT_CEILING);
  });

  it("refreshes the catalogue weekly and exceptions daily", () => {
    const { decisions } = planRefresh(
      [c("a", "2026-08-14"), c("b", "2026-08-14", "unresolved_identity"), c("d", "2026-08-01")],
      { today, creditsUsedThisMonth: 0 },
    );
    const by = (id: string) => decisions.find((d) => d.productId === id)!;
    expect(by("a").cadence).toBe("weekly");
    expect(by("a").due).toBe(false);
    expect(by("b").cadence).toBe("daily");
    expect(by("b").due).toBe(true);
    expect(by("d").due).toBe(true);
  });

  it("caps the exception list so it cannot become the schedule", () => {
    const many = Array.from({ length: 9 }, (_, i) => c(`p${i}`, "2026-08-14", "active_investigation"));
    const { decisions } = planRefresh(many, { today, creditsUsedThisMonth: 0 });
    expect(decisions.filter((d) => d.cadence === "daily")).toHaveLength(MAX_DAILY_EXCEPTIONS);
    // The rest are not abandoned — they drop to weekly.
    expect(decisions.filter((d) => d.cadence === "weekly")).toHaveLength(9 - MAX_DAILY_EXCEPTIONS);
  });

  it("records a skipped run at the ceiling instead of failing quietly", () => {
    const { decisions, plannedCredits, ceilingReached } = planRefresh(
      [c("a", null), c("b", null)],
      { today, creditsUsedThisMonth: MONTHLY_CREDIT_CEILING },
    );
    expect(ceilingReached).toBe(true);
    expect(plannedCredits).toBe(0);
    for (const d of decisions) {
      expect(d.due).toBe(true);
      expect(d.skipped).toBe("credit_ceiling_reached");
      expect(d.reason).toContain("ceiling");
    }
  });
});

describe("marketplace attributes never become evidence", () => {
  const ATTRS = { brandName: null, modelName: null, modelNumber: null, manufacturerPartNumber: null,
    manufacturer: null, upc: null,
    other: { charging_time: "4.5 hours", manufacturer_warranty_description: "2-Year", colour_of_box: "blue" } };

  it("flags a conflict with manufacturer evidence and changes nothing", () => {
    const sig = attributeSignals("prod-polaris-freedom", "B0BX9DJS7R", ATTRS, (f) =>
      f === "chargeTimeHrs"
        ? { value: "charges in only 4 hours", hasManufacturerEvidence: true }
        : { value: null, hasManufacturerEvidence: false });
    const charge = sig.find((s) => s.attributeKey === "charging_time")!;
    expect(charge.effect).toBe("conflict_flagged_for_review");
    expect(charge.needsReview).toBe(true);
    expect(charge.note).toContain("ledger is unchanged");
  });

  it("cannot populate a suppressed field on its own", () => {
    // Warranty is suppressed for the Polaris. A seller typing "2-Year" into
    // Amazon does not make it true.
    const sig = attributeSignals("prod-polaris-freedom", "B0BX9DJS7R", ATTRS, () => ({ value: null, hasManufacturerEvidence: false }));
    const warranty = sig.find((s) => s.attributeKey === "manufacturer_warranty_description")!;
    expect(warranty.effect).toBe("insufficient_to_populate");
  });

  it("allows weak corroboration but never for warranty", () => {
    const agree = attributeSignals("p", "B0", { ...ATTRS, other: { capacity: "4 liters" } }, () => ({ value: "4L", hasManufacturerEvidence: true }));
    expect(agree[0].effect).toBe("weak_corroboration");
    const warr = attributeSignals("p", "B0", { ...ATTRS, other: { warranty_type: "Limited" } }, () => ({ value: "Limited", hasManufacturerEvidence: true }));
    expect(warr[0].effect).toBe("recorded_only");
  });

  it("writes nothing into the Job 8 ledger", () => {
    // The structural guarantee: no evidence record may cite an Amazon
    // attribute as its source.
    for (const e of LEDGER_EVIDENCE) {
      expect(e.storedValue === "4.5 hours").toBe(false);
    }
  });
});

describe("the affiliate tag flows only through the central builder", () => {
  it("carries the owner-confirmed tag in the single authoritative constant", () => {
    expect(AMAZON_ASSOCIATE_TAG).toBe("botplanet-20");
    expect(AMAZON_ASSOCIATE_TAG_STATUS).toContain("owner-confirmed and active");
  });

  it("tags outbound URLs with ? or & as the URL requires, exactly once", () => {
    expect(amazonDestination("https://www.amazon.com/dp/B0BX9DJS7R")).toBe(
      "https://www.amazon.com/dp/B0BX9DJS7R?tag=botplanet-20",
    );
    expect(amazonDestination("https://www.amazon.com/s?k=x")).toBe(
      "https://www.amazon.com/s?k=x&tag=botplanet-20",
    );
  });

  it("leaves no tag literal in the redirect route — tagging stays central", () => {
    const route = readFileSync("apps/web/src/pages/go/[key].ts", "utf8");
    expect(route).not.toContain("botplanet-20");
    expect(route).toContain("amazonDestination");
  });
});

describe("Dolphin Premier is withdrawn but not erased", () => {
  it("still carries no offer, because the withdrawal was never lifted for IT", () => {
    // The record that used to hold the Dolphin Premier now holds a BuBlue and
    // is active, which is why catalogueStatusOf is no longer a useful test here.
    // What must remain true is that the Dolphin itself never became sellable:
    // its evidence sits in the retired registry with no destination attached.
    const retired = RETIRED_VERIFICATIONS.find((v) => v.identity.canonicalName === "Dolphin Premier")!;
    expect(retired).toBeDefined();
    expect(retired.identity.officialProductPageUrl).toBeNull();
    expect(retired.identity.manual).toBeNull();
    expect(DESTINATIONS.some((d) => d.exactModel === "Dolphin Premier")).toBe(false);
  });

  it("keeps the reason it was withdrawn, even though the withdrawal has ended", () => {
    // The withdrawal ended on 3 August 2026 — not because the Dolphin Premier
    // became sellable, but because that record stopped holding a Dolphin. The
    // reasoning has to survive that, or a future reader sees an ordinary
    // product and never learns BotPlanet once refused to sell one here.
    expect(productEditorialById("prod-dolphin-premier")).toBeDefined();
    expect(CATALOGUE_WITHDRAWALS["prod-dolphin-premier"]).toBeUndefined();
    const w = LIFTED_WITHDRAWALS["prod-dolphin-premier"];
    expect(w.on).toBe("2026-07-31");
    expect(w.reason).toMatch(/candidate_under_review/);
    expect(w.reason).toMatch(/no listing|no US retail destination/i);
    expect(w.liftedBecause).toMatch(/never lifted for the Dolphin Premier/i);
  });

  it("was replaced by an owner decision, not by a quiet substitution", () => {
    // A successor was never slipped in behind the Dolphin's name. The change
    // was made explicitly, by the owner, and the record says so in the open:
    // the visible name and brand both change, and the override states why.
    const o = RETIRED_SLUGS["dolphin-premier"];
    expect(o.wasNamed).toBe("Dolphin Premier");
    expect(o.isNamed).toBe("BuBlue Bubot 800P Gen2");
    expect(o.reason).toMatch(/owner/i);
    // The old URL was published, so it must redirect rather than 404.
    expect(resolveSlug("dolphin-premier")).toEqual({ storedSlug: "bublue-bubot-800p", redirectTo: "bublue-bubot-800p" });
    expect(resolveSlug("bublue-bubot-800p").redirectTo).toBeNull();
  });
});

describe("an overturned refusal stays in the audit history", () => {
  it("moves the disproved Betta refusal rather than deleting it", () => {
    const s = SUPERSEDED_REFUSALS.find((x) => x.productId === "prod-betta-se-plus")!;
    expect(s.originalReason).toContain("View newer model");
    expect(s.disprovedBy).toContain("Betta-SE-Plus");
    expect(s.supersededOn).toBe("2026-07-31");
    // And it is no longer counted as a live refusal.
    expect(REJECTED_CANDIDATES.some((c) => c.productId === "prod-betta-se-plus" && c.rule === "different_generation")).toBe(false);
  });
});

describe("SerpApi discovery run — accepted, refused, accounted", () => {
  it("refuses a listing whose title and details table disagree", () => {
    // The single most valuable result of the run. Both of these would have
    // passed a title check and are a different machine.
    const c1 = SERPAPI_REJECTIONS.find((r) => r.asin === "B0GQ4FXRBN")!;
    expect(c1.observedTitle).toContain("WYBOT C1");
    expect(c1.reason).toContain("C1 PLUS");
    expect(c1.rule).toBe("sibling_model");

    const s1 = SERPAPI_REJECTIONS.find((r) => r.asin === "B0H6ZZDR3W")!;
    expect(s1.observedTitle).toContain("Scuba S1");
    expect(s1.reason).toContain("X5 Pro 2026");
    expect(s1.rule).toBe("self_contradictory_identity");

    // Neither became a destination.
    expect(DESTINATIONS.some((d) => d.retailerProductId === "B0GQ4FXRBN")).toBe(false);
    expect(DESTINATIONS.some((d) => d.retailerProductId === "B0H6ZZDR3W")).toBe(false);
  });

  it("refuses renewed units and accessories the search dragged in", () => {
    const renewed = SERPAPI_REJECTIONS.filter((r) => r.rule === "refurbished_or_used");
    expect(renewed.length).toBeGreaterThanOrEqual(2);
    const accessory = SERPAPI_REJECTIONS.find((r) => r.rule === "accessory_or_part")!;
    expect(accessory.observedTitle).toMatch(/charger/i);
  });

  it("publishes an offer only where every gate passed", () => {
    for (const o of SERPAPI_OBSERVATIONS) {
      expect(o.identityConfirmed).toBe(true);
      expect(o.brand).toBeTruthy();
      expect(o.sellerWording).toBeTruthy();
      expect(o.priceMinor).toBeGreaterThan(0);
      expect(o.currency).toBe("USD");
      expect(o.stockWording).toBeTruthy();
      expect(o.shippingWording).toBeTruthy();
      expect(o.matchEvidence.length).toBeGreaterThan(40);
      expect(o.checkedDate).toBe("2026-07-31");
    }
  });

  it("keeps an identity-confirmed product suppressed when its listing has no buy box", () => {
    // Beatbot: the model is right, but the listing quoted $2,299.00 in search
    // and $1,697.07 on the page with no seller. Two prices is not a price.
    const bb = SERPAPI_REJECTIONS.find((r) => r.productId === "prod-beatbot-aquasense-2-ultra")!;
    expect(bb.rule).toBe("no_buybox");
    expect(bb.reason).toContain("2,299");
    expect(bb.reason).toContain("1,697");
    const offer = OFFERS.find((o) => o.productId === "prod-beatbot-aquasense-2-ultra")!;
    expect(offer.basePriceMinor).toBeNull();
    // The destination is still sound, so the link stays.
    expect(publicationFor(offer).linkable).toBe(true);
    expect(publicationFor(offer).priceShowable).toBe(false);
  });

  it("prefers the aggregator over an older human check, and gains the seller", () => {
    const pf = OFFERS.find((o) => o.productId === "prod-polaris-freedom")!;
    expect(pf.source).toBe("retailer_api_via_aggregator");
    expect(pf.basePriceMinor).toBe(119900);
    // The manual check recorded no seller; the aggregator read the line.
    expect(pf.destination.sellerIdentity).toBe("In The Swim Pool Supplies");
  });

  it("leaves a human check standing where no aggregator read exists", () => {
    const cc = OFFERS.find((o) => o.productId === "prod-dolphin-nautilus-cc-plus")!;
    expect(cc.source).toBe("manual_check");
    expect(cc.basePriceMinor).toBe(74900);
  });

  it("gives the aggregator a week, not a month", () => {
    expect(FRESHNESS_WINDOW_DAYS.retailer_api_via_aggregator).toBe(7);
    expect(freshnessFor("retailer_api_via_aggregator", "2026-07-31", new Date("2026-08-05"))).toBe("recently_checked");
    expect(freshnessFor("retailer_api_via_aggregator", "2026-07-31", new Date("2026-08-10"))).toBe("stale");
  });

  it("records what it could not resolve rather than leaving a silent gap", () => {
    expect(SERPAPI_UNRESOLVED["prod-wybot-c1"]).toContain("C1 PLUS");
    expect(SERPAPI_UNRESOLVED["prod-aiper-scuba-s1"]).toMatch(/five|ambiguous/i);
    expect(SERPAPI_UNRESOLVED["prod-aiper-scuba-x1"]).toMatch(/unavailable/i);
  });

  it("accounts for every credit against the ceiling", () => {
    expect(SERPAPI_RUN_CREDITS.total).toBe(SERPAPI_RUN_CREDITS.discoverySearches + SERPAPI_RUN_CREDITS.listingReads);
    expect(SERPAPI_RUN_CREDITS.total).toBeLessThan(SERPAPI_RUN_CREDITS.ceiling);
    expect(SERPAPI_RUN_CREDITS.remainingAfterRun).toBeGreaterThan(0);
  });

  it("adds no affiliate tag to anything the run produced", () => {
    for (const d of DESTINATIONS) {
      expect(d.destinationUrl ?? "").not.toContain("tag=");
    }
  });
});

describe("scheduled refresh — identity matching", () => {
  const listing = (attrs: Partial<Record<string, string>>, opts: Partial<{ price: number; stock: string; seller: string; delivery: string; condition: string }> = {}) => ({
    asin: "B0TEST0001",
    title: opts.condition === "titleonly" ? "2026 WYBOT C1 Cordless Robotic Pool Vacuum" : "Test listing",
    buyingOptions: [{
      condition: (opts.condition === "used" ? "used" : "new") as "new" | "used",
      priceMinor: opts.price ?? 19900,
      currency: "USD",
      stockWording: opts.stock ?? "In Stock",
      deliveryWording: opts.delivery ?? "FREE delivery Monday",
      sellerWording: opts.seller ?? "SomeSeller",
      returnsWording: null,
    }],
    attributes: { brandName: null, modelName: null, modelNumber: null, manufacturerPartNumber: null,
      manufacturer: null, upc: null, other: {}, ...attrs },
    imageUrls: [], videoCount: 0, providerId: "serpapi" as const, retrievedOn: "2026-08-01", notFound: false,
  });
  const wybot = { productId: "prod-wybot-c1", asin: "B0TEST0001", brand: "WYBOT",
    modelTokens: ["c1"], denyTokens: ["c1 plus", "c1 pro", "c1 max"], lastCheckedOn: null };

  it("refuses a sibling even when the title says otherwise", () => {
    // The exact failure from the discovery run: title "2026 WYBOT C1",
    // details table "C1 PLUS". The title is never consulted.
    const m = matchIdentity(wybot, listing({ brandName: "WYBOT", modelName: "C1 PLUS", modelNumber: "C1 PLUS" }, { condition: "titleonly" }));
    expect(m.confirmed).toBe(false);
    expect(m.evidence).toContain("SIBLING MODEL");
  });

  it("confirms the base model on the structured fields", () => {
    const m = matchIdentity(wybot, listing({ brandName: "WYBOT", modelName: "C1", modelNumber: "C1" }));
    expect(m.confirmed).toBe(true);
    expect(m.evidence).toContain("not the title");
  });

  it("refuses a listing whose own fields disagree", () => {
    // model_name "Scuba S1 2026" alongside model_number "X5 Pro 2026".
    const s1 = { productId: "prod-aiper-scuba-s1", asin: "B0TEST0001", brand: "AIPER",
      modelTokens: ["scuba s1"], denyTokens: ["scuba v3"], lastCheckedOn: null };
    const m = matchIdentity(s1, listing({ brandName: "AIPER", modelName: "Scuba S1 2026", modelNumber: "X5 Pro 2026" }));
    expect(m.confirmed).toBe(false);
    expect(m.evidence).toContain("SELF-CONTRADICTORY");
  });

  it("refuses a brand mismatch outright", () => {
    const m = matchIdentity(wybot, listing({ brandName: "Aiper", modelName: "C1" }));
    expect(m.confirmed).toBe(false);
    expect(m.evidence).toContain("Brand mismatch");
  });
});

describe("scheduled refresh — publication gates", () => {
  const base = { productId: "p", asin: "B0TEST0001", brand: "WYBOT", modelTokens: ["c1"], denyTokens: [], lastCheckedOn: null };
  const ok = { confirmed: true, evidence: "matched" };
  const mk = (o: Partial<BuyingOption> | null, notFound = false) => ({
    asin: "B0TEST0001", title: "t",
    // `null` means a listing with no buying option at all.
    buyingOptions: o === null ? [] : [{
      condition: "new" as const, priceMinor: 19900, currency: "USD", stockWording: "In Stock",
      deliveryWording: "FREE delivery Monday", sellerWording: "SomeSeller", returnsWording: null, ...o }],
    attributes: { brandName: "WYBOT", modelName: "C1", modelNumber: "C1", manufacturerPartNumber: null,
      manufacturer: null, upc: null, other: {} },
    imageUrls: [], videoCount: 0, providerId: "serpapi" as const, retrievedOn: "2026-08-01", notFound,
  });

  it("passes a complete listing", () => {
    expect(gate(base, mk({}), ok)).toBeNull();
  });

  it("refuses a missing listing, a used-only listing and a priceless one", () => {
    expect(gate(base, mk({}, true), ok)).toContain("does not exist");
    expect(gate(base, mk(null), ok)).toContain("new-condition");
    expect(gate(base, mk({ condition: "used" }), ok)).toContain("new-condition");
    expect(gate(base, mk({ priceMinor: null }), ok)).toContain("No buy-box price");
  });

  it("refuses an unnamed seller, because the returns route follows the seller", () => {
    expect(gate(base, mk({ sellerWording: null }), ok)).toContain("returns route");
  });

  it("refuses whatever identity matching refused", () => {
    expect(gate(base, mk({}), { confirmed: false, evidence: "SIBLING MODEL: it is a C1 PLUS" })).toContain("C1 PLUS");
  });

  it("takes the new option and never the used one", () => {
    const both = mk({});
    both.buyingOptions.push({ condition: "used", priceMinor: 9900, currency: "USD",
      stockWording: "Only 1 left", deliveryWording: "FREE", sellerWording: "X", returnsWording: null });
    expect(buyNew(both)!.priceMinor).toBe(19900);
  });
});

describe("scheduled refresh — run behaviour", () => {
  const provider = (listing: unknown, credits = 1) => ({
    id: "serpapi" as const,
    getListing: async () => ({ ok: true, data: listing as never, skipped: null, detail: "", creditsUsed: credits }),
    search: async () => ({ ok: true, data: [], skipped: null, detail: "", creditsUsed: 1 }),
    remainingCredits: async () => 198,
  });
  const good = {
    asin: "B0TEST0001", title: "WYBOT C1",
    buyingOptions: [{ condition: "new" as const, priceMinor: 39999, currency: "USD", stockWording: "In Stock",
      deliveryWording: "FREE delivery Monday", sellerWording: "WybotDirect", returnsWording: null }],
    attributes: { brandName: "WYBOT", modelName: "C1", modelNumber: "C1", manufacturerPartNumber: null,
      manufacturer: null, upc: null, other: {} },
    imageUrls: [], videoCount: 0, providerId: "serpapi" as const, retrievedOn: "2026-08-08", notFound: false,
  };
  const expected = [{ productId: "prod-wybot-c1", asin: "B0TEST0001", brand: "WYBOT",
    modelTokens: ["c1"], denyTokens: ["c1 plus"], lastCheckedOn: null }];

  it("a dry run writes nothing and spends nothing", async () => {
    const r = await runRefresh({ provider: provider(good), expected, today: new Date("2026-08-08"),
      runDate: "2026-08-08", scope: "dry_run", creditsUsedThisMonth: 0, dryRun: true, runId: "run-dry" });
    expect(r.dryRun).toBe(true);
    expect(r.creditsUsed).toBe(0);
    expect(r.observations).toEqual([]);
    expect(r.notes).toContain("Nothing was written");
  });

  it("accepts a listing that passes every gate", async () => {
    const r = await runRefresh({ provider: provider(good), expected, today: new Date("2026-08-08"),
      runDate: "2026-08-08", scope: "weekly", creditsUsedThisMonth: 0, dryRun: false, runId: "run-w" });
    expect(r.status).toBe("ok");
    expect(r.creditsUsed).toBe(1);
    expect(r.observations[0].accepted).toBe(true);
    expect(r.observations[0].priceMinor).toBe(39999);
    expect(r.observations[0].sellerWording).toBe("WybotDirect");
  });

  it("records a suppressed observation WITHOUT a price", async () => {
    const sibling = { ...good, attributes: { ...good.attributes, modelName: "C1 PLUS", modelNumber: "C1 PLUS" } };
    const r = await runRefresh({ provider: provider(sibling), expected, today: new Date("2026-08-08"),
      runDate: "2026-08-08", scope: "weekly", creditsUsedThisMonth: 0, dryRun: false, runId: "run-w2" });
    const o = r.observations[0];
    expect(o.accepted).toBe(false);
    // What it SAW is kept; what it would have published is not.
    expect(o.priceMinor).toBeNull();
    expect(o.modelNumber).toBe("C1 PLUS");
    expect(o.suppressionReason).toContain("SIBLING");
  });

  it("stops at the ceiling and records the skip rather than spending", async () => {
    const r = await runRefresh({ provider: provider(good), expected, today: new Date("2026-08-08"),
      runDate: "2026-08-08", scope: "weekly", creditsUsedThisMonth: MONTHLY_CREDIT_CEILING,
      dryRun: false, runId: "run-w3" });
    expect(r.ceilingReached).toBe(true);
    expect(r.creditsUsed).toBe(0);
    expect(r.observations).toEqual([]);
    expect(r.skips[0].reason).toBe("credit_ceiling_reached");
    expect(r.status).toBe("skipped");
  });

  it("records a provider failure instead of dropping it", async () => {
    const broken = { ...provider(good), getListing: async () => ({ ok: false, data: null, skipped: "provider_error" as const, detail: "502", creditsUsed: 1 }) };
    const r = await runRefresh({ provider: broken, expected, today: new Date("2026-08-08"),
      runDate: "2026-08-08", scope: "weekly", creditsUsedThisMonth: 0, dryRun: false, runId: "run-w4" });
    expect(r.status).toBe("partial");
    expect(r.skips[0].reason).toBe("provider_error");
    expect(r.skips[0].detail).toBe("502");
  });

  it("skips a product that is not yet due", async () => {
    const fresh = [{ ...expected[0], lastCheckedOn: "2026-08-07" }];
    const r = await runRefresh({ provider: provider(good), expected: fresh, today: new Date("2026-08-08"),
      runDate: "2026-08-08", scope: "weekly", creditsUsedThisMonth: 0, dryRun: false, runId: "run-w5" });
    expect(r.creditsUsed).toBe(0);
    expect(r.skips[0].reason).toBe("not_due_yet");
  });
});

describe("scheduled refresh — wiring", () => {
  it("declares one active daily trigger", () => {
    const wt = readFileSync("apps/web/wrangler.toml", "utf8");
    expect(wt).toMatch(/^\[triggers\]/m);
    expect(wt).toMatch(/crons = \["0 3 \* \* \*"\]/);
    // One trigger, because four of the account's five belong to other workers.
    expect(wt).toMatch(/five per ACCOUNT/i);
  });

  it("gets both cadences from one trigger, via the planner", () => {
    // A single daily firing yields weekly-plus-exceptions because the interval
    // is enforced PER PRODUCT, and anything not due is skipped for free.
    const today = new Date("2026-08-15T00:00:00Z");
    const { decisions, plannedCredits } = planRefresh(
      [
        { productId: "weekly-fresh", asin: "B0TEST0001", lastCheckedOn: "2026-08-14", exception: null },
        { productId: "weekly-due", asin: "B0TEST0002", lastCheckedOn: "2026-08-01", exception: null },
        { productId: "exception", asin: "B0TEST0003", lastCheckedOn: "2026-08-14", exception: "unresolved_identity" },
      ],
      { today, creditsUsedThisMonth: 0 },
    );
    const by = (id: string) => decisions.find((d) => d.productId === id)!;
    expect(by("weekly-fresh").skipped).toBe("not_due_yet");
    expect(by("weekly-due").due).toBe(true);
    expect(by("exception").due).toBe(true);
    // Only the two that are actually due cost anything.
    expect(plannedCredits).toBe(2);
  });

  it("exports scheduled beside fetch, without changing request handling", () => {
    const entry = readFileSync("apps/web/src/worker-entry.ts", "utf8");
    expect(entry).toContain("scheduled(");
    expect(entry).toContain("astro.default.fetch");
  });

  it("names the secret and never a value", () => {
    const entry = readFileSync("apps/web/src/worker-entry.ts", "utf8");
    expect(entry).toContain("SERPAPI_API_KEY");
    expect(entry).not.toMatch(/[a-f0-9]{40,}/);
  });

  it("gives every product an identity expectation with deny tokens", () => {
    for (const e of EXPECTED_IDENTITIES) {
      expect(e.modelTokens.length).toBeGreaterThan(0);
      // Deny tokens are the half that actually catches siblings.
      expect(e.denyTokens.length).toBeGreaterThan(0);
      expect(e.asin).toMatch(/^B0[A-Z0-9]{8}$/);
    }
    // Products with no confirmed ASIN need discovery, not a refresh. The C1
    // left this list on 4 August 2026: its owner-confirmed destination had
    // existed since 3 August, and holding it here meant the refresh never read
    // the very listing the buy button pointed at.
    expect(AWAITING_DISCOVERY).toContain("prod-aiper-scuba-s1");
    expect(EXPECTED_IDENTITIES.some((e) => e.productId === "prod-wybot-c1")).toBe(true);
    for (const id of AWAITING_DISCOVERY) {
      expect(EXPECTED_IDENTITIES.some((e) => e.productId === id)).toBe(false);
    }

    /* THE COVERAGE HOLE THIS TEST DID NOT CLOSE UNTIL 4 AUGUST 2026.
       Everything above checks the shape of the entries that exist, and that
       the two lists do not overlap — but nothing asserted that every product
       appears in ONE of them. The Proteus DX4 Plus and the Scuba V3 fell
       straight through: published reviews, live buy buttons, owner-confirmed
       ASINs, and no price check ever run against either, because neither was
       on either list. A product is either checkable or awaiting discovery.
       There is no third state, and silence is not one. */
    for (const p of Object.values(ACTIVE_PRODUCTS)) {
      const known =
        EXPECTED_IDENTITIES.some((e) => e.productId === p.productId) ||
        AWAITING_DISCOVERY.includes(p.productId);
      expect(known, `${p.slug}: no identity expectation and not awaiting discovery`).toBe(true);
    }
  });

  /**
   * THE DEAD BUY BUTTON, AND THE TEST THAT WOULD HAVE CAUGHT IT.
   *
   * A review page renders its buy button from REDIRECT_KEYS. The redirect only
   * resolves if a row with that key exists in D1, and D1's rows come from the
   * seed. Nothing tied those two files together, so the Proteus DX4 Plus and
   * the Scuba V3 shipped with buttons pointing at keys that had no offer
   * behind them: /go/ answered 404 to every reader who clicked, for a day,
   * on two published reviews.
   *
   * The seed is read as text rather than imported: this asserts the exact
   * string a human has to type in two places, which is where the mistake
   * actually happens.
   */
  /**
   * THE COVERAGE HOLE THAT COST THE WINDOW CATEGORY ITS BUY BUTTONS.
   *
   * Every guard above iterated a map derived from `PRODUCTS` — pool-era
   * editorial — which is also what `buildOffers` iterated. A test that draws
   * its universe from the same source as the code under test can only confirm
   * the two agree. It cannot tell you the universe is wrong.
   *
   * It was. Eleven window machines were in `PRODUCT_ID`, in D1, and had
   * published reviews with a Buy heading, and none of them was in `PRODUCTS`.
   * So buildOffers produced nothing for them, every assertion skipped them,
   * and the whole suite stayed green while a third of the published site could
   * not earn a penny. Verified on botplanet.io before the fix: zero prices and
   * zero /go/ links on every window review.
   *
   * This asserts against the CATALOGUE, which is the one list a product cannot
   * be published without appearing in.
   */
  it("gives every product in the catalogue a real, buyable destination", () => {
    for (const p of activeCatalogue()) {
      const offer = OFFERS.find((o) => o.productId === p.productId);
      expect(offer, `${p.slug}: no offer at all`).toBeDefined();
      expect(offer!.destination.retailerProductId, `${p.slug}: no ASIN`).toMatch(/^B0[A-Z0-9]{8}$/);
      expect(offer!.redirectKey, `${p.slug}: buy button has no /go key`).toBeTruthy();
      expect(
        publicationFor(offer!).linkable,
        `${p.slug}: has a destination but the buy button will not render`,
      ).toBe(true);
    }
  });

  it("covers every window machine, by name", () => {
    /* Listed rather than counted. A count passes when eleven products become
       ten and a twelfth is added; these eleven are the ones whose reviews are
       published, and each must be buyable. */
    const WINDOW = [
      "prod-ecovacs-winbot-w2-pro-omni", "prod-ecovacs-winbot-w2-pro",
      "prod-ecovacs-winbot-w3-omni", "prod-ecovacs-winbot-w1-pro",
      "prod-ecovacs-winbot-w2s", "prod-ecovacs-winbot-mini",
      "prod-hobot-2s", "prod-hobot-298", "prod-cop-rose-x5s",
      "prod-mamibot-w120-dp", "prod-hutt-s55-pro",
    ];
    for (const id of WINDOW) {
      const o = OFFERS.find((x) => x.productId === id);
      expect(o, `${id} has no offer`).toBeDefined();
      /* `win-`, not `window-`. The keys are read out of D1 and abbreviate the
         model; a derived key 404s. Checked against production 6 August 2026. */
      expect(o!.redirectKey).toMatch(/^win-[a-z0-9-]+-amazon$/);
      // Identity was machine-read before any of these was accepted.
      expect(o!.destination.confidence).toBe("verified_exact");
      /* Identity is not price. D1 holds 5 August research ESTIMATES for ten
         of these — round numbers like 49900 — stored as snapshot/indicative so
         the freshness gate can never publish them. Assert the gate, not the
         column: the number may exist, and it must never reach a reader until
         the refresh service reads a real one. */
      expect(publicationFor(o!).priceShowable).toBe(false);
    }
  });

  it("gives every routed product a seeded offer behind its buy button", () => {
    /* EVERY SEED, AND THE WHOLE CATALOGUE. This read only the pool seed and
       only ACTIVE_PRODUCTS, so the eleven window keys it was meant to protect
       were outside its reach in two separate ways at once.

       A CATEGORY ADDED HERE IS A CATEGORY ADDED TO THIS LIST. Companion joined
       on 8 August 2026 and the omission surfaced immediately, because the test
       fails loudly for any routed product whose key is absent from the text it
       reads — which is exactly the behaviour wanted. Read the directory rather
       than the list if a fourth category makes this tedious. */
    const seed = ["pool", "window", "companion"]
      .map((c) => readFileSync(`packages/db/seed/${c}/commercial.ts`, "utf8"))
      .join("\n");
    for (const p of activeCatalogue()) {
      const key = REDIRECT_KEYS[p.productId];
      expect(key, `${p.slug}: no redirect key`).toBeTruthy();
      expect(
        seed.includes(`redirectKey: "${key}"`),
        `${p.slug}: buy button points at /go/${key}, which has no offer in the seed — the redirect will 404`,
      ).toBe(true);
    }
  });
});

describe("D1 is the production source; the snapshot is only a fallback", () => {
  const liveRow = (over: Partial<{ checkedDate: string; priceMinor: number; sellerWording: string }> = {}) => ({
    productId: "prod-polaris-freedom",
    checkedDate: "2026-08-02",
    priceMinor: 109900,
    stockWording: "In Stock",
    shippingWording: "FREE delivery Tuesday",
    sellerWording: "Amazon.com",
    returnsWording: null,
    identityConfirmed: true,
    ...over,
  });
  const polaris = (offers: ReturnType<typeof buildOffers>) => offers.find((o) => o.productId === "prod-polaris-freedom")!;

  it("a newer D1 row replaces the committed snapshot", () => {
    const o = polaris(buildOffers(new Date("2026-08-02"), { live: [liveRow()] }));
    expect(o.basePriceMinor).toBe(109900);
    expect(o.destination.sellerIdentity).toBe("Amazon.com");
    expect(o.sourceCheckedDate).toBe("2026-08-02");
  });

  it("a D1 row wins even when it is OLDER than the snapshot", () => {
    // The case that caught a real bug: picking whichever was checked most
    // recently meant a stale D1 row lost to a fresher snapshot, so an ageing
    // observation could never expire — the snapshot would step in and look
    // current forever.
    const stale = polaris(buildOffers(new Date("2026-07-31"), { live: [liveRow({ checkedDate: "2026-06-01", priceMinor: 99900 })] }));
    expect(stale.basePriceMinor).toBe(99900);
    expect(stale.sourceCheckedDate).toBe("2026-06-01");
    expect(stale.freshness).toBe("stale");
    expect(publicationFor(stale).priceShowable).toBe(false);
  });

  it("falls back to the snapshot when D1 returns nothing", () => {
    const o = polaris(buildOffers(new Date("2026-07-31"), { live: [] }));
    expect(o.basePriceMinor).toBe(119900);
    expect(o.sourceCheckedDate).toBe("2026-07-31");
  });

  it("suppresses an expired D1 price rather than showing it", () => {
    // Read 2 August, viewed 20 August: outside the 7-day aggregator window.
    const o = polaris(buildOffers(new Date("2026-08-20"), { live: [liveRow()] }));
    expect(o.freshness).toBe("stale");
    expect(publicationFor(o).priceShowable).toBe(false);
  });

  it("keeps the fail-closed gates after reading D1", () => {
    // A D1 row with no seller must not publish, exactly as a manual check
    // without one would not.
    const noSeller = { ...liveRow(), sellerWording: null };
    const o = polaris(buildOffers(new Date("2026-08-02"), { live: [noSeller] }));
    expect(o.destination.sellerIdentity).toBeNull();
    expect(o.destination.sellerModel).toBe("unknown");
  });

  it("reads one row per product page, not one per card", () => {
    const page = readFileSync("apps/web/src/pages/robots/[category]/[slug].astro", "utf8");
    expect(page).toContain("latestAcceptedForProduct");
    // A single call, scoped to this product.
    expect((page.match(/latestAcceptedForProduct\(/g) ?? []).length).toBe(1);
  });

  it("logs the fallback rather than taking it silently", () => {
    const page = readFileSync("apps/web/src/pages/robots/[category]/[slug].astro", "utf8");
    expect(page).toContain("console.error");
    expect(page).toContain("fallback_snapshot");
  });
});

describe("retailer, seller and programme are three different things", () => {
  it("keeps Amazon the retailer even when a marketplace seller owns the buy box", () => {
    // The Pool Spot owns the CC Plus buy box. BotPlanet's relationship is with
    // AMAZON: the affiliate destination, the programme and the retailer are
    // Amazon's, and the seller only governs fulfilment and returns.
    const cc = OFFERS.find((o) => o.productId === "prod-dolphin-nautilus-cc-plus")!;
    expect(cc.retailerId).toBe("ret-amazon");
    expect(cc.programmeId).toBe("prog-amazon-us");
    expect(cc.destination.sellerIdentity).toBe("The Pool Spot");
    expect(cc.destination.destinationUrl).toContain("amazon.com");
  });

  it("never creates a retailer or programme from a marketplace seller", () => {
    const sellers = OFFERS.map((o) => o.destination.sellerIdentity).filter(Boolean) as string[];
    expect(sellers.length).toBeGreaterThan(0);
    for (const s of sellers) {
      expect(RETAILERS.some((r) => r.displayName === s)).toBe(false);
      expect(PROGRAMMES.some((p) => p.network === s)).toBe(false);
    }
    // Every offer routes through the one approved retailer.
    for (const o of OFFERS) expect(o.retailerId).toBe("ret-amazon");
  });

  it("shows the seller as fulfilment information, under the retailer", () => {
    const page = readFileSync("apps/web/src/pages/robots/[category]/[slug].astro", "utf8");
    expect(page).toContain("sold by");
    expect(page).toContain("retailer(offer.retailerId)");
  });
});

describe("outbound call-to-action wording", () => {
  /* The review page shipped with two labels for the same action: BuyStrip said
     "Check price on Amazon" and the buy box said "View on Amazon". One page,
     one action, one sentence — and with no price printed, "view" also
     undersells what the click is for. */
  const buyBox = readFileSync("apps/web/src/components/BuyBox.astro", "utf8");
  const buyStrip = readFileSync("apps/web/src/components/BuyStrip.astro", "utf8");

  it("uses the same wording in the buy box and the buy strip", () => {
    expect(buyBox).toContain("Check price on {lead.retailerName}");
    expect(buyStrip).toContain("Check price on {retailerName}");
  });

  it("has no 'View on <retailer>' left anywhere", () => {
    for (const [name, src] of [["BuyBox", buyBox], ["BuyStrip", buyStrip]] as const) {
      expect(src, `${name} still says "View on"`).not.toMatch(/>View on /);
    }
  });
});

describe("the refresh cadence fits inside the allowance", () => {
  /* The interval was seven days, chosen against a hypothetical ten-product
     catalogue. The real register is eight products and the month's spend when
     this was written was 8 credits of 200 — while a live price sat four days
     stale. Three days is the new interval; this test is what stops the
     catalogue growing past what the allowance can actually pay for. */
  it("stays under the ceiling at full exception load", () => {
    const products = EXPECTED_IDENTITIES.length;
    const worst = monthlyCost(products, MAX_DAILY_EXCEPTIONS);
    expect(worst).toBeLessThan(MONTHLY_CREDIT_CEILING);
  });

  it("caps how stale a published price can get", () => {
    expect(CATALOGUE_INTERVAL_DAYS).toBeLessThanOrEqual(3);
    expect(CATALOGUE_INTERVAL_DAYS).toBeGreaterThan(DAILY_INTERVAL_DAYS);
  });

  it("re-reads a product that was checked four days ago", () => {
    const { decisions } = planRefresh(
      [{ productId: "p", asin: "B0", lastCheckedOn: "2026-07-31", exception: null }],
      { today: new Date("2026-08-04T03:00:00Z"), creditsUsedThisMonth: 8 },
    );
    expect(decisions[0].due).toBe(true);
    expect(decisions[0].skipped).toBeNull();
  });
});
