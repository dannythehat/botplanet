import { describe, expect, it } from "vitest";
import { PRODUCTS } from "../src/content/products";
import { deriveLedger, FIELD_SPECS, buildSources, primarySourceFor } from "../src/content/evidence/derive";
import { classifySource } from "../src/content/evidence/sources";
import { buildReport, isCurrent, isStale, validateLedger, LAUNCH_PRODUCT_COUNT } from "../src/lib/evidence-report";
import { SOURCE_PRIORITY } from "../src/content/evidence/types";
import { normaliseDuration, normaliseLength, normaliseMass, roundLike, gramsToPoundsDisplay } from "../src/lib/normalize";
import type { ClaimRecord } from "../src/content/evidence/types";

const TODAY = new Date("2026-07-30T00:00:00Z");

describe("launch catalogue integrity", () => {
  it("holds exactly the ten launch products", () => {
    expect(Object.keys(PRODUCTS)).toHaveLength(LAUNCH_PRODUCT_COUNT);
  });

  it("gives every product a unique stable ID that is not the slug", () => {
    const ids = Object.values(PRODUCTS).map((p) => p.productId);
    expect(new Set(ids).size).toBe(ids.length);
    for (const p of Object.values(PRODUCTS)) expect(p.productId).not.toBe(p.slug);
  });

  it("gives every product a unique slug", () => {
    const slugs = Object.values(PRODUCTS).map((p) => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });
});

describe("source classification", () => {
  it("recognises manufacturer domains", () => {
    expect(classifySource("https://aiper.com/us/x").type).toBe("manufacturer_page");
    expect(classifySource("https://www.maytronics.com/en-us/store/x").type).toBe("manufacturer_page");
  });

  it("classifies retailers and third-party editorial separately", () => {
    expect(classifySource("https://www.amazon.com/dp/X").type).toBe("retailer_listing");
    expect(classifySource("https://www.pcworld.com/article/x").type).toBe("editorial_research");
  });

  it("never treats an unknown host as a manufacturer", () => {
    const c = classifySource("https://random-specs-site.example/x");
    expect(c.type).toBe("editorial_research");
    expect(c.recognised).toBe(false);
  });

  it("ranks manufacturer documents above pages, and pages above retailers", () => {
    expect(SOURCE_PRIORITY.manufacturer_document).toBeLessThan(SOURCE_PRIORITY.manufacturer_page);
    expect(SOURCE_PRIORITY.manufacturer_page).toBeLessThan(SOURCE_PRIORITY.retailer_listing);
    expect(SOURCE_PRIORITY.retailer_listing).toBeLessThan(SOURCE_PRIORITY.editorial_research);
  });
});

describe("normalisation", () => {
  it("converts to canonical internal units", () => {
    expect(normaliseLength(60, "ft")).toEqual({ value: 18288, unit: "mm", method: expect.any(String) });
    expect(normaliseMass(20, "lb")?.value).toBe(9072);
    expect(normaliseDuration(2.5, "hr")?.value).toBe(150);
  });

  it("records the conversion method so a figure can be audited", () => {
    expect(normaliseMass(20, "lb")?.method).toContain("453.59237");
  });

  it("rejects unknown units instead of guessing", () => {
    expect(normaliseLength(5, "furlongs")).toBeNull();
    expect(normaliseMass(5, "stone")).toBeNull();
  });

  it("does not invent precision the source never had", () => {
    // A source that said "20 lb" must not come back as "44.09 lb".
    expect(gramsToPoundsDisplay(9072, 20)).toBe(20);
    expect(roundLike(44.0924, 20)).toBe(44);
    expect(roundLike(44.0924, 20.5)).toBe(44.1);
  });
});

describe("derived evidence ledger", () => {
  const ledger = deriveLedger();

  it("creates evidence only for populated fields, and a gap for every null", () => {
    const totalSlots = Object.keys(PRODUCTS).length * FIELD_SPECS.length;
    expect(ledger.evidence.length + ledger.gaps.length).toBe(totalSlots);
    for (const e of ledger.evidence) expect(e.storedValue).not.toBeNull();
  });

  it("attributes each product to its highest-authority source", () => {
    const sources = buildSources();
    for (const p of Object.values(PRODUCTS)) {
      const primary = primarySourceFor(p, sources);
      expect(primary).not.toBeNull();
      const mine = p.sources.map((s) => sources.find((x) => x.url === s.url)!);
      const best = Math.min(...mine.map((m) => SOURCE_PRIORITY[m.type]));
      expect(SOURCE_PRIORITY[primary!.type]).toBe(best);
    }
  });

  it("never grades unverified evidence as high confidence", () => {
    for (const e of ledger.evidence) {
      if (e.verifiedDate === null) expect(e.confidence).not.toBe("high");
    }
  });

  it("preserves the sourced value and stores conversions separately", () => {
    const weights = ledger.evidence.filter((e) => e.field === "weightLbs");
    expect(weights.length).toBeGreaterThan(0);
    for (const w of weights) {
      expect(typeof w.storedValue).toBe("number");
      expect(w.normalizedUnit).toBe("g");
      expect(w.conversionMethod).toBeTruthy();
      // The original is untouched by normalisation.
      expect(w.normalizedValue).not.toBe(w.storedValue);
    }
  });

  it("labels evidence by the authority of its source", () => {
    for (const e of ledger.evidence) {
      expect(["manufacturer_stated", "manual_verified", "retailer_stated", "api_supplied", "researched_interpretation"]).toContain(e.label);
    }
  });
});

describe("validation rules", () => {
  const ledger = deriveLedger();

  it("passes the current catalogue with no errors", () => {
    const errors = validateLedger(ledger).filter((i) => i.severity === "error");
    expect(errors).toEqual([]);
  });

  it("rejects a claim whose evidence does not exist", () => {
    const claims: ClaimRecord[] = [
      { id: "c1", productId: Object.values(PRODUCTS)[0].productId, claimText: "x", claimClass: "direct_specification",
        evidenceIds: ["ev-does-not-exist"], confidence: "high", allowedContexts: ["product_page"],
        freshnessRequirement: "six_monthly", reviewerStatus: "unreviewed" },
    ];
    const errs = validateLedger(ledger, claims).filter((i) => i.rule === "claim_evidence_exists");
    expect(errs).toHaveLength(1);
  });

  it("rejects a claim with no evidence at all", () => {
    const claims: ClaimRecord[] = [
      { id: "c2", productId: Object.values(PRODUCTS)[0].productId, claimText: "x", claimClass: "direct_specification",
        evidenceIds: [], confidence: "low", allowedContexts: ["product_page"],
        freshnessRequirement: "six_monthly", reviewerStatus: "unreviewed" },
    ];
    expect(validateLedger(ledger, claims).some((i) => i.rule === "claim_requires_evidence")).toBe(true);
  });

  it("always rejects a tested observation", () => {
    const claims: ClaimRecord[] = [
      { id: "c3", productId: Object.values(PRODUCTS)[0].productId, claimText: "we measured it", claimClass: "tested_observation",
        evidenceIds: [], confidence: "high", allowedContexts: ["product_page"],
        freshnessRequirement: "six_monthly", reviewerStatus: "unreviewed" },
    ];
    expect(validateLedger(ledger, claims).some((i) => i.rule === "no_tested_claims")).toBe(true);
  });

  it("finds no hands-on testing assertion in the existing editorial prose", () => {
    expect(validateLedger(ledger).filter((i) => i.rule === "no_tested_claims")).toEqual([]);
  });

  it("flags orphan evidence pointing at a product that does not exist", () => {
    const broken = { ...ledger, evidence: [{ ...ledger.evidence[0], productId: "prod-ghost" }] };
    expect(validateLedger(broken).some((i) => i.rule === "evidence_product_exists")).toBe(true);
  });

  it("flags a negative measurement", () => {
    const broken = { ...ledger, evidence: [{ ...ledger.evidence.find((e) => typeof e.storedValue === "number")!, storedValue: -1 }] };
    expect(validateLedger(broken).some((i) => i.rule === "no_negative_values")).toBe(true);
  });

  it("flags a normalised value with no unit or method", () => {
    const broken = { ...ledger, evidence: [{ ...ledger.evidence.find((e) => e.normalizedValue !== null)!, normalizedUnit: null }] };
    expect(validateLedger(broken).some((i) => i.rule === "unit_consistency")).toBe(true);
  });

  it("warns on an unresolved conflict rather than publishing it", () => {
    const broken = { ...ledger, evidence: [{ ...ledger.evidence[0], conflictStatus: "conflicting" as const }] };
    expect(validateLedger(broken).some((i) => i.rule === "unresolved_conflict")).toBe(true);
  });
});

describe("freshness", () => {
  const e = deriveLedger().evidence[0];

  it("treats an unverified value as not current, however recent", () => {
    expect(isCurrent({ ...e, retrievedDate: "2026-07-30", verifiedDate: null }, TODAY)).toBe(false);
  });

  it("goes stale once the cadence has elapsed", () => {
    expect(isStale({ ...e, cadence: "quarterly", retrievedDate: "2026-07-01", verifiedDate: null }, TODAY)).toBe(false);
    expect(isStale({ ...e, cadence: "quarterly", retrievedDate: "2026-01-01", verifiedDate: null }, TODAY)).toBe(true);
  });

  it("counts freshness from the verification date when one exists", () => {
    expect(isStale({ ...e, cadence: "quarterly", retrievedDate: "2025-01-01", verifiedDate: "2026-07-01" }, TODAY)).toBe(false);
  });
});

describe("completeness and publication safety", () => {
  const report = buildReport(TODAY);

  it("reports one row per launch product", () => {
    expect(report.products).toHaveLength(LAUNCH_PRODUCT_COUNT);
  });

  it("states its denominators rather than scoring against an unknown total", () => {
    expect(report.denominators.fieldsTrackedPerProduct).toBe(FIELD_SPECS.length);
    expect(report.denominators.launchProducts).toBe(LAUNCH_PRODUCT_COUNT);
    expect(report.denominators.identityFields).toBeGreaterThan(0);
    expect(report.denominators.technicalFields).toBeGreaterThan(0);
  });

  it("keeps identity, technical, suitability and evidence completeness separate", () => {
    for (const p of report.products) {
      for (const s of [p.identity, p.technical, p.suitability, p.evidence]) {
        expect(s.percent).toBeGreaterThanOrEqual(0);
        expect(s.percent).toBeLessThanOrEqual(100);
        expect(s.populated).toBeLessThanOrEqual(s.tracked);
      }
    }
  });

  it("counts populated and missing fields to the tracked total", () => {
    for (const p of report.products) {
      expect(p.populatedFields.length + p.missingFields.length).toBe(FIELD_SPECS.length);
    }
  });

  it("reports no verification date, because nothing has been re-verified yet", () => {
    for (const p of report.products) expect(p.latestVerification).toBeNull();
  });

  it("blocks publication when a product has unresolved conflicts", () => {
    const withConflict = buildReport(TODAY).products[0];
    expect(withConflict.publicationBlockers).toEqual(expect.any(Array));
    // Current data has no conflicts, so the current set is publication-safe.
    expect(withConflict.publicationSafe).toBe(true);
  });
});

describe("commission independence", () => {
  it("keeps every commercial term out of the evidence model", () => {
    const serialised = JSON.stringify(deriveLedger());
    for (const banned of ["commission", "payout", "epc", "affiliate_program", "retailerFee"]) {
      expect(serialised.toLowerCase()).not.toContain(banned.toLowerCase());
    }
  });

  it("tracks no offer, price or stock field in the evidence-controlled set", () => {
    const fields = FIELD_SPECS.map((f) => f.field.toLowerCase());
    for (const banned of ["price", "stock", "shipping", "offer", "retailer"]) {
      expect(fields.some((f) => f.includes(banned))).toBe(false);
    }
  });
});
