import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { PRODUCTS } from "../src/content/products";
import {
  buildSources,
  deriveLedger,
  FIELD_SPECS,
  interpretMeasurement,
  primarySourceFor,
  valuesAgree,
} from "../src/content/evidence/derive";
import { FIELD_REGISTRY, TOTAL_REGISTRY_WEIGHT, fieldApplies } from "../src/content/evidence/field-registry";
import { RECONCILIATION, PUBLISHABLE_OUTCOMES, reconciliationCounts } from "../src/content/evidence/reconciliation";
import { VERIFICATIONS, VERIFICATION_DATE } from "../src/content/evidence/verification";
import { buildClaimLedger, NEVER_EMITTED } from "../src/content/evidence/claims";
import { classifySource } from "../src/content/evidence/sources";
import {
  BOTMATCH_FIELDS,
  COMPARISON_FIELDS,
  LAUNCH_PRODUCT_COUNT,
  MATERIAL_REVIEW_FIELDS,
  REVIEW_SECTIONS,
  REVIEW_WEIGHTED_THRESHOLD,
  buildReport,
  fieldIsCurrent,
  isCurrent,
  isStale,
  validateLedger,
} from "../src/lib/evidence-report";
import { buildNotionMapping } from "../src/lib/notion-mapping";
import { LAUNCH_CATEGORY, REDIRECTS, ROUTES, productPath } from "../src/content/routes";
import { routes as categoryPaths } from "../src/content/nav";
import { WARRANTY_NOT_CONFIRMED, FORBIDDEN_WARRANTY_WORDINGS, hasForbiddenWarrantyWording, warrantyStatement } from "../src/lib/warranty";
import { SOURCE_PRIORITY, type ClaimRecord, type EvidenceRecord } from "../src/content/evidence/types";
import { gramsToPoundsDisplay, normaliseDuration, normaliseLength, normaliseMass, roundLike } from "../src/lib/normalize";

const TODAY = new Date(`${VERIFICATION_DATE}T00:00:00Z`);
const LEDGER = deriveLedger();
const REPORT = buildReport(TODAY, buildClaimLedger().claims);

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
    expect(classifySource("https://www.maytronics.com/x").type).toBe("manufacturer_page");
    expect(classifySource("https://aiper.com/us/x").recognised).toBe(true);
  });

  it("classifies retailers and third-party editorial separately", () => {
    expect(classifySource("https://www.amazon.com/dp/X").type).toBe("retailer_listing");
    expect(classifySource("https://www.pcworld.com/a").type).toBe("editorial_research");
  });

  it("never treats an unknown host as a manufacturer", () => {
    const c = classifySource("https://some-blog.example/robot");
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
    expect(normaliseLength(60, "ft")?.value).toBe(18288);
    expect(normaliseMass(20, "lb")?.value).toBe(9072);
    expect(normaliseDuration(2.5, "hr")?.value).toBe(150);
  });

  it("records the conversion method so a figure can be audited", () => {
    expect(normaliseLength(12, "m")?.method).toContain("-> mm");
  });

  it("rejects unknown units instead of guessing", () => {
    expect(normaliseLength(5, "furlongs")).toBeNull();
  });

  it("does not invent precision the source never had", () => {
    expect(roundLike(14.6155, 14)).toBe(15);
    expect(gramsToPoundsDisplay(9072, 20)).toBe(20);
  });

  it("pulls a single figure out of verbatim source wording", () => {
    expect(interpretMeasurement("6.63 Kg.")).toEqual({ value: 6.63, unit: "kg" });
    expect(interpretMeasurement("1.5 Hours")).toEqual({ value: 1.5, unit: "hr" });
    expect(interpretMeasurement("8 m")).toEqual({ value: 8, unit: "m" });
  });

  it("refuses to reduce a range to a number nobody published", () => {
    expect(interpretMeasurement("3-4 Hours")).toBeNull();
    expect(interpretMeasurement("10h surface / 5h floor / 5h walls")).toBeNull();
  });
});

describe("field registry", () => {
  it("declares the full intended field set, not just the researched subset", () => {
    expect(FIELD_REGISTRY.length).toBeGreaterThanOrEqual(30);
    for (const key of ["modelNumber", "manualUrl", "powerType", "batteryCapacity", "filtrationMicrons", "dimensions", "wifi"]) {
      expect(FIELD_REGISTRY.some((f) => f.field === key)).toBe(true);
    }
  });

  it("gives every field a weight, a group, a cadence and a written definition", () => {
    for (const f of FIELD_REGISTRY) {
      expect(f.weight).toBeGreaterThanOrEqual(1);
      expect(f.weight).toBeLessThanOrEqual(5);
      expect(f.definition.length).toBeGreaterThan(20);
      expect(f.group).toBeTruthy();
      expect(f.cadence).toBeTruthy();
    }
    expect(TOTAL_REGISTRY_WEIGHT).toBe(FIELD_REGISTRY.reduce((n, f) => n + f.weight, 0));
  });

  it("uses unique field keys", () => {
    const keys = FIELD_REGISTRY.map((f) => f.field);
    expect(new Set(keys).size).toBe(keys.length);
  });

  it("excludes a cable from a cordless robot and a battery from a corded one", () => {
    expect(fieldApplies("corded_only", { powerType: "cordless" }).applies).toBe(false);
    expect(fieldApplies("cordless_only", { powerType: "corded" }).applies).toBe(false);
    expect(fieldApplies("corded_only", { powerType: "corded" }).applies).toBe(true);
  });

  it("keeps a power-dependent field visible while power type is unknown", () => {
    expect(fieldApplies("corded_only", { powerType: null }).applies).toBe(true);
    expect(fieldApplies("cordless_only", { powerType: null }).applies).toBe(true);
  });

  it("exports the registry as the completeness denominator", () => {
    expect(FIELD_SPECS).toBe(FIELD_REGISTRY);
  });
});

describe("live verification", () => {
  it("covers every launch product", () => {
    for (const p of Object.values(PRODUCTS)) {
      expect(VERIFICATIONS.some((v) => v.productId === p.productId)).toBe(true);
    }
  });

  it("dates every observation and names the source it came from", () => {
    for (const v of VERIFICATIONS) {
      for (const o of v.observations) {
        expect(o.observedOn).toMatch(/^\d{4}-\d{2}-\d{2}$/);
        expect(o.sourceUrl).toMatch(/^https?:\/\//);
        expect(o.sourceTitle.length).toBeGreaterThan(5);
      }
    }
  });

  it("records which sources it actually checked before calling a field unstated", () => {
    for (const v of VERIFICATIONS) {
      for (const n of v.notPubliclyStated) {
        expect(n.checked.length).toBeGreaterThan(0);
        expect(n.note.length).toBeGreaterThan(10);
      }
    }
  });

  it("keeps a source that could not be read, rather than dropping it", () => {
    const polaris = VERIFICATIONS.find((v) => v.productId === "prod-polaris-freedom")!;
    const dead = polaris.sourceChecks.find((c) => c.status === "unreadable");
    expect(dead?.url).toContain("polarispool.com/en/products");
  });

  it("refuses a manual that covers a different model", () => {
    const premier = VERIFICATIONS.find((v) => v.productId === "prod-dolphin-premier")!;
    expect(premier.identity.manual).toBeNull();
    expect(premier.identity.identityIssue).toContain("Classic 5");
  });

  it("records the corrected source when a stored record cited the wrong model", () => {
    const betta = VERIFICATIONS.find((v) => v.productId === "prod-betta-se-plus")!;
    expect(betta.identity.officialProductPageUrl).toBe("https://bettabot.com/products/betta-se-plus");
    expect(betta.identity.identityIssue).toContain("DEFECT FOUND AND CORRECTED");
    expect(betta.sourceChecks.some((c) => c.url.endsWith("/betta-se") && /WRONG MODEL/.test(c.title))).toBe(true);
  });

  it("names a sibling-model risk for every product, so near models cannot merge", () => {
    for (const v of VERIFICATIONS) {
      expect(v.identity.identityIssue && v.identity.identityIssue.length).toBeGreaterThan(30);
    }
  });
});

describe("reconciliation of stored values against live sources", () => {
  it("names a known registry field and a known product on every entry", () => {
    const fields = new Set(FIELD_REGISTRY.map((f) => f.field));
    const ids = new Set(Object.values(PRODUCTS).map((p) => p.productId));
    for (const r of RECONCILIATION) {
      expect(fields.has(r.field)).toBe(true);
      expect(ids.has(r.productId)).toBe(true);
      expect(r.note.length).toBeGreaterThan(20);
    }
  });

  it("records the two overstatements the pass found", () => {
    const e10 = RECONCILIATION.find((r) => r.productId === "prod-dolphin-e10" && r.field === "poolSizeSuitability");
    expect(e10?.outcome).toBe("conflicts");
    const cc = RECONCILIATION.find((r) => r.productId === "prod-dolphin-nautilus-cc-plus" && r.field === "warranty");
    expect(cc?.outcome).toBe("conflicts");
  });

  it("marks a stored figure with no source as unsupported rather than deleting it quietly", () => {
    const polaris = RECONCILIATION.find((r) => r.productId === "prod-polaris-freedom" && r.field === "warranty");
    expect(polaris?.outcome).toBe("unsupported");
    expect(polaris?.note).toContain("never states its term");
  });

  it("records a field the live source newly filled in", () => {
    const w = RECONCILIATION.find((r) => r.productId === "prod-polaris-freedom" && r.field === "weightLbs");
    expect(w?.outcome).toBe("newly_populated");
  });

  it("counts every outcome, so the totals can be checked against the entries", () => {
    const counts = reconciliationCounts();
    expect(Object.values(counts).reduce((a, b) => a + b, 0)).toBe(RECONCILIATION.length);
  });

  it("treats only agreement and new sourcing as publishable outcomes", () => {
    expect(PUBLISHABLE_OUTCOMES).not.toContain("conflicts");
    expect(PUBLISHABLE_OUTCOMES).not.toContain("unsupported");
    expect(PUBLISHABLE_OUTCOMES).not.toContain("derived_from_range");
  });
});

describe("field states", () => {
  it("produces one field record per registry field per product", () => {
    expect(LEDGER.fields).toHaveLength(FIELD_REGISTRY.length * LAUNCH_PRODUCT_COUNT);
  });

  it("leaves nothing in the 'nobody looked' state after the verification pass", () => {
    expect(REPORT.totals.stateCounts.unknown).toBe(0);
  });

  it("leaves nothing unverified after the verification pass", () => {
    expect(REPORT.totals.stateCounts.pending_verification).toBe(0);
    for (const e of LEDGER.evidence) expect(e.verifiedDate).toBe(VERIFICATION_DATE);
  });

  it("separates 'the maker does not publish it' from 'we are withholding what we had'", () => {
    expect(REPORT.totals.stateCounts.not_publicly_stated).toBeGreaterThan(0);
    expect(REPORT.totals.stateCounts.suppressed).toBeGreaterThan(0);
    const suppressed = LEDGER.fields.filter((f) => f.state === "suppressed");
    for (const f of suppressed) expect(f.storedValue).not.toBeNull();
    const notStated = LEDGER.fields.filter((f) => f.state === "not_publicly_stated");
    for (const f of notStated) expect(f.value).toBeNull();
  });

  it("removes an inapplicable field from the record rather than counting it missing", () => {
    const cable = LEDGER.fields.find((f) => f.productId === "prod-aiper-scuba-x1" && f.field === "cableLengthFt")!;
    expect(cable.state).toBe("not_applicable");
    expect(cable.publishable).toBe(false);
  });

  it("publishes nothing from a state other than populated", () => {
    for (const f of LEDGER.fields) {
      if (f.publishable) expect(f.state).toBe("populated");
      else expect(f.value).toBeNull();
    }
  });

  it("gives every field record a written reason for the state it is in", () => {
    for (const f of LEDGER.fields) expect(f.reason.length).toBeGreaterThan(10);
  });

  it("carries the pre-verification stored value alongside the live one", () => {
    const e10 = LEDGER.fields.find((f) => f.productId === "prod-dolphin-e10" && f.field === "poolSizeSuitability")!;
    expect(e10.storedValue).toContain("30 ft");
    expect(e10.value).toBe("8 m");
  });
});

describe("conflicts", () => {
  it("resolves to the higher-authority source and records the rule", () => {
    const cc = LEDGER.conflicts.find((c) => c.productId === "prod-dolphin-nautilus-cc-plus" && c.field === "warranty")!;
    expect(cc.resolvedTo).toBe("1 year");
    expect(cc.suppressed).toBe(false);
    expect(cc.resolutionRule.length).toBeGreaterThan(10);
  });

  it("publishes nothing when the disagreement cannot be settled by authority", () => {
    const s1 = LEDGER.conflicts.find((c) => c.productId === "prod-aiper-scuba-s1" && c.field === "poolTypes")!;
    expect(s1.suppressed).toBe(true);
    expect(s1.resolvedTo).toBeNull();
    const field = LEDGER.fields.find((f) => f.productId === "prod-aiper-scuba-s1" && f.field === "poolTypes")!;
    expect(field.state).toBe("conflicting");
    expect(field.publishable).toBe(false);
  });

  it("holds a conflict where the winning source's own figure is not credible", () => {
    const premier = LEDGER.conflicts.find((c) => c.productId === "prod-dolphin-premier" && c.field === "poolSizeSuitability")!;
    expect(premier.suppressed).toBe(true);
  });

  it("lists every value in the conflict with the source it came from", () => {
    for (const c of LEDGER.conflicts) {
      expect(c.values.length).toBeGreaterThanOrEqual(2);
      for (const v of c.values) expect(v.publisher.length).toBeGreaterThan(2);
    }
  });

  it("does not mistake two wordings of the same fact for a conflict", () => {
    expect(valuesAgree("1-YEAR WARRANTY", "1-Year Manufacturer's Warranty from the date of purchase")).toBe(true);
    expect(valuesAgree("In-ground", "Designed for both above-ground and in-ground pools")).toBe(false);
    const betta = LEDGER.fields.find((f) => f.productId === "prod-betta-se-plus" && f.field === "warranty")!;
    expect(betta.state).toBe("populated");
    expect(betta.evidenceIds.length).toBe(2);
  });
});

describe("completeness", () => {
  it("states both denominators rather than scoring against an unknown total", () => {
    expect(REPORT.denominators.fieldsInRegistry).toBe(FIELD_REGISTRY.length);
    expect(REPORT.denominators.fieldRecordsExpected).toBe(FIELD_REGISTRY.length * LAUNCH_PRODUCT_COUNT);
    expect(REPORT.denominators.applicableFields).toBeLessThan(REPORT.denominators.fieldRecordsExpected);
    expect(REPORT.denominators.applicableWeight).toBeGreaterThan(0);
  });

  it("reports a raw and a weighted figure, and they are not the same number", () => {
    expect(REPORT.totals.rawPercent).toBeGreaterThan(0);
    expect(REPORT.totals.weightedPercent).toBeGreaterThan(0);
    expect(REPORT.totals.weightedPercent).not.toBe(REPORT.totals.rawPercent);
  });

  it("excludes inapplicable fields from both denominators", () => {
    for (const p of REPORT.products) {
      const mine = LEDGER.fields.filter((f) => f.productId === p.productId);
      const applicable = mine.filter((f) => f.state !== "not_applicable");
      expect(p.overall.applicable).toBe(applicable.length);
      expect(p.overall.applicable).toBeLessThanOrEqual(p.overall.tracked * 0 + mine.length);
    }
  });

  it("reports one row per launch product with its group breakdown", () => {
    expect(REPORT.products).toHaveLength(LAUNCH_PRODUCT_COUNT);
    for (const p of REPORT.products) expect(p.groups.length).toBe(7);
  });

  it("never reports a percentage above 100", () => {
    for (const p of REPORT.products) {
      expect(p.overall.rawPercent).toBeLessThanOrEqual(100);
      expect(p.overall.weightedPercent).toBeLessThanOrEqual(100);
      for (const g of p.groups) expect(g.weightedPercent).toBeLessThanOrEqual(100);
    }
  });
});

describe("publication states", () => {
  it("reports seven independent states, not one boolean", () => {
    for (const p of REPORT.products) {
      expect(Object.keys(p.publication)).toHaveLength(7);
    }
  });

  it("holds a product back from comparison when a comparison field is unavailable", () => {
    const polaris = REPORT.products.find((p) => p.slug === "polaris-freedom")!;
    expect(polaris.publication.safeForLimitedFactualUse).toBe(true);
    expect(polaris.publication.readyForComparison).toBe(false);
    expect(polaris.publicationBlockers.join(" ")).toContain("poolSizeSuitability");
  });

  it("holds a thinly sourced product back from review writing", () => {
    const seagull = REPORT.products.find((p) => p.slug === "aiper-seagull-se")!;
    expect(seagull.publication.readyForReviewWriting).toBe(false);
    expect(seagull.publication.readyForComparison).toBe(false);
  });

  it("requires model identity before a review may be written", () => {
    const premier = REPORT.products.find((p) => p.slug === "dolphin-premier")!;
    expect(premier.publication.readyForReviewWriting).toBe(false);
    expect(premier.publicationBlockers.join(" ")).toContain("identity");
  });

  it("only calls a product BotMatch-ready when every field BotMatch uses is available", () => {
    for (const p of REPORT.products) {
      if (!p.publication.readyForBotMatch) continue;
      for (const key of BOTMATCH_FIELDS) {
        const f = LEDGER.fields.find((x) => x.productId === p.productId && x.field === key)!;
        expect(f.publishable || f.state === "not_applicable").toBe(true);
      }
    }
  });

  it("only calls a product comparison-ready when every comparison field is available", () => {
    for (const p of REPORT.products) {
      if (!p.publication.readyForComparison) continue;
      for (const key of COMPARISON_FIELDS) {
        const f = LEDGER.fields.find((x) => x.productId === p.productId && x.field === key)!;
        expect(f.publishable || f.state === "not_applicable").toBe(true);
      }
    }
  });

  it("gives a written blocker for every state that is false", () => {
    for (const p of REPORT.products) {
      const anyFalse = Object.values(p.publication).some((v) => v === false);
      if (anyFalse) expect(p.publicationBlockers.length).toBeGreaterThan(0);
    }
  });
});

describe("claim ledger", () => {
  const { claims, blocked } = buildClaimLedger();

  it("writes claims only from publishable fields", () => {
    expect(claims.length).toBeGreaterThan(50);
    for (const c of claims) expect(c.evidenceIds.length).toBeGreaterThan(0);
  });

  it("points every claim at evidence that exists", () => {
    const ids = new Set(LEDGER.evidence.map((e) => e.id));
    for (const c of claims) for (const id of c.evidenceIds) expect(ids.has(id)).toBe(true);
  });

  it("produces deterministic evidence IDs across separate ledger builds", () => {
    const a = deriveLedger().evidence.map((e) => e.id);
    const b = deriveLedger().evidence.map((e) => e.id);
    expect(a).toEqual(b);
  });

  it("emits no comparative, tested or commercial claim", () => {
    for (const c of claims) {
      expect(c.claimClass).not.toBe("tested_observation");
      expect(c.claimClass).not.toBe("comparative_statement");
      expect(c.claimClass).not.toBe("commercial_observation");
    }
    expect(NEVER_EMITTED.map((n) => n.claimClass)).toContain("tested_observation");
  });

  it("attributes every claim to a named publisher rather than asserting it directly", () => {
    for (const c of claims) {
      if (c.claimClass !== "direct_specification") continue;
      expect(c.claimText).toMatch(/ (states|describes|lists|names|rates) /);
    }
  });

  it("keeps warranty out of structured data and metadata", () => {
    const w = claims.find((c) => c.id.endsWith("-warranty"))!;
    expect(w.prohibitedContexts).toContain("structured_data");
    expect(w.prohibitedContexts).toContain("metadata");
  });

  it("writes a suitability claim only when both inputs are verified", () => {
    const suitability = claims.filter((c) => c.claimClass === "suitability_statement");
    for (const c of suitability) {
      const f = LEDGER.fields.find((x) => x.productId === c.productId && x.field === "poolSizeSuitability")!;
      expect(f.publishable).toBe(true);
    }
    expect(suitability.some((c) => c.productId === "prod-dolphin-premier")).toBe(false);
  });

  it("records what could not be claimed, with the reason", () => {
    expect(blocked.length).toBeGreaterThan(0);
    for (const b of blocked) {
      expect(b.state).not.toBe("not_applicable");
      // A populated field is only blocked in the one case where the value is
      // real but its source cannot speak for the manufacturer: a dealer warranty.
      if (b.state === "populated") expect(b.field).toBe("warranty");
      expect(b.reason.length).toBeGreaterThan(10);
    }
  });

  it("never blocks and claims the same field at once", () => {
    for (const b of blocked) {
      expect(claims.some((c) => c.productId === b.productId && c.id.endsWith(`-${b.field}`))).toBe(false);
    }
  });
});

describe("validation rules", () => {
  it("passes the current catalogue with no errors", () => {
    const errors = REPORT.issues.filter((i) => i.severity === "error");
    expect(errors).toEqual([]);
  });

  it("rejects a claim whose evidence does not exist", () => {
    const bad: ClaimRecord = {
      id: "c1",
      productId: Object.values(PRODUCTS)[0].productId,
      claimText: "x",
      claimClass: "direct_specification",
      evidenceIds: ["ev-nope"],
      confidence: "high",
      allowedContexts: ["product_page"],
      freshnessRequirement: "quarterly",
      reviewerStatus: "unreviewed",
    };
    expect(validateLedger(LEDGER, [bad]).some((i) => i.rule === "claim_evidence_exists")).toBe(true);
  });

  it("rejects a claim with no evidence at all", () => {
    const bad: ClaimRecord = {
      id: "c2",
      productId: Object.values(PRODUCTS)[0].productId,
      claimText: "x",
      claimClass: "direct_specification",
      evidenceIds: [],
      confidence: "low",
      allowedContexts: ["product_page"],
      freshnessRequirement: "quarterly",
      reviewerStatus: "unreviewed",
    };
    expect(validateLedger(LEDGER, [bad]).some((i) => i.rule === "claim_requires_evidence")).toBe(true);
  });

  it("always rejects a tested observation", () => {
    const bad: ClaimRecord = {
      id: "c3",
      productId: Object.values(PRODUCTS)[0].productId,
      claimText: "We tested it.",
      claimClass: "tested_observation",
      evidenceIds: LEDGER.evidence.slice(0, 1).map((e) => e.id),
      confidence: "high",
      allowedContexts: ["product_page"],
      freshnessRequirement: "quarterly",
      reviewerStatus: "unreviewed",
    };
    expect(validateLedger(LEDGER, [bad]).some((i) => i.rule === "no_tested_claims")).toBe(true);
  });

  it("finds no hands-on testing assertion in the existing editorial prose", () => {
    expect(REPORT.issues.filter((i) => i.rule === "no_tested_claims")).toEqual([]);
  });

  it("flags orphan evidence pointing at a product that does not exist", () => {
    const orphan = { ...LEDGER.evidence[0], id: "ev-orphan", productId: "prod-does-not-exist" } as EvidenceRecord;
    const issues = validateLedger({ ...LEDGER, evidence: [...LEDGER.evidence, orphan] });
    expect(issues.some((i) => i.rule === "evidence_product_exists")).toBe(true);
  });

  it("flags a negative measurement", () => {
    const bad = { ...LEDGER.evidence[0], id: "ev-neg", storedValue: -5 } as EvidenceRecord;
    const issues = validateLedger({ ...LEDGER, evidence: [...LEDGER.evidence, bad] });
    expect(issues.some((i) => i.rule === "no_negative_values")).toBe(true);
  });

  it("flags a normalised value with no unit or method", () => {
    const bad = { ...LEDGER.evidence[0], id: "ev-nounit", normalizedValue: 5, normalizedUnit: null, conversionMethod: null } as EvidenceRecord;
    const issues = validateLedger({ ...LEDGER, evidence: [...LEDGER.evidence, bad] });
    expect(issues.some((i) => i.rule === "unit_consistency")).toBe(true);
  });

  it("warns on an unresolved conflict rather than publishing it", () => {
    expect(REPORT.issues.some((i) => i.rule === "unresolved_conflict")).toBe(true);
  });

  it("flags a field marked publishable with no evidence behind it", () => {
    const broken = { ...LEDGER, fields: LEDGER.fields.map((f, i) => (i === 0 ? { ...f, publishable: true, evidenceIds: [] } : f)) };
    expect(validateLedger(broken).some((i) => i.rule === "publishable_requires_evidence")).toBe(true);
  });
});

describe("freshness", () => {
  const ev = LEDGER.evidence[0];

  it("treats an unverified value as not current, however recent", () => {
    expect(isCurrent({ ...ev, verifiedDate: null }, TODAY)).toBe(false);
  });

  it("goes stale once the cadence has elapsed", () => {
    const later = new Date("2027-12-31T00:00:00Z");
    expect(isStale(ev, later)).toBe(true);
  });

  it("counts field freshness from the verification date", () => {
    const f = LEDGER.fields.find((x) => x.state === "populated")!;
    expect(fieldIsCurrent(f, TODAY)).toBe(true);
    expect(fieldIsCurrent(f, new Date("2028-01-01T00:00:00Z"))).toBe(false);
  });
});

describe("Notion register mapping", () => {
  const mapping = buildNotionMapping();

  it("produces exactly one row per launch product", () => {
    expect(mapping.rows).toHaveLength(LAUNCH_PRODUCT_COUNT);
    expect(new Set(mapping.rows.map((r) => r.productId)).size).toBe(LAUNCH_PRODUCT_COUNT);
  });

  it("matches the committed export, so the register cannot be filled from stale data", () => {
    const onDisk = JSON.parse(readFileSync("docs/job-08-notion-mapping.json", "utf8"));
    expect(onDisk).toEqual(JSON.parse(JSON.stringify(mapping)));
  });

  it("carries the model identity a register row needs", () => {
    for (const r of mapping.rows) {
      expect(r.canonicalName.length).toBeGreaterThan(3);
      expect(r.brand.length).toBeGreaterThan(2);
      expect(r.verificationDate).toBe(VERIFICATION_DATE);
    }
  });

  it("states both completeness figures with the numbers behind them", () => {
    for (const r of mapping.rows) {
      expect(r.fieldsApplicable).toBeGreaterThan(0);
      expect(r.weightApplicable).toBeGreaterThan(0);
      expect(r.completenessRawPercent).toBe(Math.round((r.fieldsPublishable / r.fieldsApplicable) * 100));
      expect(r.completenessWeightedPercent).toBe(Math.round((r.weightPublishable / r.weightApplicable) * 100));
    }
  });

  it("lists the editorial corrections each product needs", () => {
    const e10 = mapping.rows.find((r) => r.slug === "dolphin-e10")!;
    expect(e10.editorialCorrections.some((c) => c.field === "poolSizeSuitability")).toBe(true);
    const total = mapping.rows.reduce((n, r) => n + r.editorialCorrections.length, 0);
    expect(total).toBeGreaterThan(20);
  });
});

describe("commission independence", () => {
  it("keeps every commercial term out of the evidence model", () => {
    // Comments are stripped first: the file is allowed to EXPLAIN that
    // commercial terms are excluded; it must not declare one.
    const code = readFileSync("apps/web/src/content/evidence/types.ts", "utf8")
      .replace(/\/\*[\s\S]*?\*\//g, "")
      .replace(/\/\/.*$/gm, "")
      .toLowerCase();
    for (const banned of ["commission", "payout", "epc", "affiliateurl", "price", "merchant"]) {
      expect(code).not.toContain(banned);
    }
  });

  it("tracks no offer, price or stock field in the evidence-controlled set", () => {
    for (const f of FIELD_REGISTRY) {
      expect(f.field.toLowerCase()).not.toMatch(/price|offer|stock|commission|merchant/);
    }
  });

  it("attributes each product to its highest-authority cited source", () => {
    const sources = buildSources();
    for (const p of Object.values(PRODUCTS)) {
      const s = primarySourceFor(p, sources);
      if (!s) continue;
      const ranks = p.sources.map((x) => sources.find((y) => y.url === x.url)).filter(Boolean).map((x) => SOURCE_PRIORITY[x!.type]);
      expect(SOURCE_PRIORITY[s.type]).toBe(Math.min(...ranks));
    }
  });
});

/* ------------------------------------------------------------------ */
/* Job 8 correction: canonical URLs, readiness gates, warranty wording  */
/* ------------------------------------------------------------------ */

describe("canonical product URLs in the register mapping", () => {
  const mapping = buildNotionMapping();
  const CANONICAL = `/robots/${LAUNCH_CATEGORY}/`;

  it("uses the locked product route for all ten rows", () => {
    expect(mapping.rows).toHaveLength(LAUNCH_PRODUCT_COUNT);
    for (const r of mapping.rows) {
      expect(r.url).toBe(`https://botplanet.io${CANONICAL}${r.slug}/`);
      expect(r.path.startsWith(CANONICAL)).toBe(true);
      expect(r.path.endsWith("/")).toBe(true);
    }
  });

  it("resolves every URL to the correct stable product", () => {
    for (const r of mapping.rows) {
      const p = Object.values(PRODUCTS).find((x) => x.productId === r.productId)!;
      expect(p).toBeDefined();
      expect(r.path).toBe(productPath(p.slug));
      expect(r.url.endsWith(`/${p.slug}/`)).toBe(true);
    }
  });

  it("contains zero obsolete /pool-cleaners/ URLs", () => {
    const obsolete = mapping.rows.filter((r) => /\/pool-cleaners\//.test(r.url) && !r.url.includes(CANONICAL));
    expect(obsolete).toEqual([]);
    for (const r of mapping.rows) expect(r.url).not.toContain("botplanet.io/pool-cleaners/");
  });

  it("generates the URL through the central route configuration, not a second pattern", () => {
    for (const r of mapping.rows) {
      expect(r.path).toBe(categoryPaths.product(LAUNCH_CATEGORY, r.slug));
    }
  });

  it("agrees with the route registry's category hierarchy", () => {
    const hub = ROUTES.find((x) => x.path === `/robots/${LAUNCH_CATEGORY}/`);
    expect(hub).toBeDefined();
    for (const r of mapping.rows) expect(r.path.startsWith(hub!.path)).toBe(true);
  });

  it("points no URL at a redirect source", () => {
    const aliases = new Set(REDIRECTS.map((x) => x.from));
    for (const r of mapping.rows) {
      expect(aliases.has(r.path)).toBe(false);
      // Nor at an alias of any registry route.
      for (const route of ROUTES) for (const a of route.aliases ?? []) expect(r.path).not.toBe(a);
    }
  });
});

describe("review-writing readiness rule", () => {
  it("sets the weighted floor at 65%, not the old arbitrary 60%", () => {
    expect(REVIEW_WEIGHTED_THRESHOLD).toBe(65);
  });

  it("treats the percentage as necessary but never sufficient", () => {
    // Every product at or above the floor that is still not review-ready must
    // have a non-percentage gate failing.
    for (const p of REPORT.products) {
      if (p.publication.readyForReviewWriting) continue;
      if (p.overall.weightedPercent < REVIEW_WEIGHTED_THRESHOLD) continue;
      const failed = p.reviewGates.filter((g) => !g.passed).map((g) => g.gate);
      expect(failed.length).toBeGreaterThan(0);
      expect(failed).not.toEqual(["weighted_completeness"]);
    }
  });

  it("checks six critical gates on every product", () => {
    const expected = [
      "weighted_completeness",
      "model_identity",
      "no_material_conflict",
      "review_sections_writable",
      "no_speculation",
      "corrections_identified",
    ];
    for (const p of REPORT.products) expect(p.reviewGates.map((g) => g.gate)).toEqual(expected);
  });

  it("passes review writing only when every gate passes", () => {
    for (const p of REPORT.products) {
      const allPass = p.reviewGates.every((g) => g.passed) && p.publication.safeForLimitedFactualUse;
      expect(p.publication.readyForReviewWriting).toBe(allPass);
    }
  });

  it("blocks a review whose sections cannot be written from evidence", () => {
    const polaris = REPORT.products.find((p) => p.slug === "polaris-freedom")!;
    expect(polaris.overall.weightedPercent).toBeGreaterThanOrEqual(REVIEW_WEIGHTED_THRESHOLD);
    expect(polaris.publication.readyForReviewWriting).toBe(false);
    expect(polaris.reviewGates.find((g) => g.gate === "review_sections_writable")!.passed).toBe(false);
  });

  it("blocks a review that would rest on a suppressed value", () => {
    const beatbot = REPORT.products.find((p) => p.slug === "beatbot-aquasense-2-ultra")!;
    expect(beatbot.reviewGates.find((g) => g.gate === "no_speculation")!.passed).toBe(false);
    expect(beatbot.publicationBlockers.join(" ")).toContain("suppressed value");
  });

  it("blocks a review when a material field carries an unresolved conflict", () => {
    for (const p of REPORT.products) {
      const conflicted = MATERIAL_REVIEW_FIELDS.some(
        (k) => LEDGER.fields.find((f) => f.productId === p.productId && f.field === k)?.state === "conflicting",
      );
      if (conflicted) expect(p.publication.readyForReviewWriting).toBe(false);
    }
  });

  it("gives every gate a written reason, passing or failing", () => {
    for (const p of REPORT.products) for (const g of p.reviewGates) expect(g.detail.length).toBeGreaterThan(15);
  });

  it("never marks a product comparison- or BotMatch-ready without review readiness", () => {
    for (const p of REPORT.products) {
      if (p.publication.readyForComparison) expect(p.publication.readyForReviewWriting).toBe(true);
      if (p.publication.readyForBotMatch) expect(p.publication.readyForReviewWriting).toBe(true);
    }
  });

  it("declares the review sections it gates on", () => {
    expect(REVIEW_SECTIONS.length).toBeGreaterThanOrEqual(5);
    for (const s of REVIEW_SECTIONS) expect(s.requires.length).toBeGreaterThan(0);
  });
});

describe("Dolphin Premier — launch candidate under review", () => {
  const premier = REPORT.products.find((p) => p.slug === "dolphin-premier")!;

  it("stays in the ledger and the launch inventory", () => {
    expect(premier).toBeDefined();
    expect(PRODUCTS["dolphin-premier"]).toBeDefined();
  });

  it("is structurally valid, factually evidenced and safe for limited factual use", () => {
    expect(premier.publication.structurallyValid).toBe(true);
    expect(premier.publication.factuallyEvidenced).toBe(true);
    expect(premier.publication.safeForLimitedFactualUse).toBe(true);
  });

  it("carries the dealer-source qualification", () => {
    expect(premier.evidenceQualification).toContain("dealer-sourced");
    expect(premier.evidenceQualification).toContain("none is presented as manufacturer-stated");
  });

  it("is excluded from review writing, comparison and BotMatch", () => {
    expect(premier.publication.readyForReviewWriting).toBe(false);
    expect(premier.publication.readyForComparison).toBe(false);
    expect(premier.publication.readyForBotMatch).toBe(false);
  });

  it("is typed as a candidate under review", () => {
    expect(premier.launchStatus).toBe("candidate_under_review");
  });

  it("lists every required blocker", () => {
    const blockers = premier.publicationBlockers.join(" | ");
    expect(blockers).toContain("no accepted official manufacturer page");
    expect(blockers).toContain("no accepted manual");
    expect(blockers).toContain("no reliably established model number");
    expect(blockers).toContain("unresolved conflict on poolSizeSuitability");
    expect(blockers).toContain("manufacturer identity/evidence weakness");
    expect(blockers).toContain(`${REVIEW_WEIGHTED_THRESHOLD}% floor`);
  });

  it("presents no dealer-derived statement as manufacturer-stated", () => {
    const mine = LEDGER.evidence.filter((e) => e.productId === premier.productId);
    for (const e of mine) {
      expect(e.label).not.toBe("manufacturer_stated");
      expect(e.label).not.toBe("manual_verified");
    }
    expect(REPORT.issues.filter((i) => i.rule === "no_dealer_as_manufacturer")).toEqual([]);
  });
});

describe("Aiper Seagull SE — limited factual use only", () => {
  const seagull = REPORT.products.find((p) => p.slug === "aiper-seagull-se")!;

  it("stays in the catalogue", () => {
    expect(PRODUCTS["aiper-seagull-se"]).toBeDefined();
    expect(seagull).toBeDefined();
  });

  it("is safe for limited factual use", () => {
    expect(seagull.publication.safeForLimitedFactualUse).toBe(true);
    expect(seagull.launchStatus).toBe("limited_factual_use");
  });

  it("is excluded from review writing, comparison and BotMatch", () => {
    expect(seagull.publication.readyForReviewWriting).toBe(false);
    expect(seagull.publication.readyForComparison).toBe(false);
    expect(seagull.publication.readyForBotMatch).toBe(false);
  });

  it("names insufficient evidence coverage in its blockers", () => {
    expect(seagull.publicationBlockers.join(" | ")).toContain("insufficient evidence coverage");
  });

  it("does not clear the 65% floor", () => {
    expect(seagull.overall.weightedPercent).toBeLessThan(REVIEW_WEIGHTED_THRESHOLD);
  });
});

describe("warranty wording", () => {
  const { claims } = buildClaimLedger();

  it("uses one approved sentence, held in one place", () => {
    expect(WARRANTY_NOT_CONFIRMED).toBe("Manufacturer warranty term not confirmed");
    for (const p of REPORT.products) {
      if (p.warranty.status === "not_confirmed") expect(p.warranty.text).toBe(WARRANTY_NOT_CONFIRMED);
    }
  });

  it("never asserts that a product has no warranty", () => {
    for (const p of REPORT.products) expect(hasForbiddenWarrantyWording(p.warranty.text)).toBeNull();
    for (const c of claims) expect(hasForbiddenWarrantyWording(c.claimText)).toBeNull();
    for (const p of Object.values(PRODUCTS)) {
      const prose = [p.verdict, p.oneLiner, p.whoShouldBuy, p.whoShouldAvoid, ...p.pros, ...p.limitations].join(" ");
      expect(hasForbiddenWarrantyWording(prose)).toBeNull();
    }
  });

  it("catches each forbidden phrasing", () => {
    expect(FORBIDDEN_WARRANTY_WORDINGS.length).toBeGreaterThanOrEqual(5);
    for (const bad of ["No warranty", "warranty unavailable", "does not offer a warranty", "sold without a warranty"]) {
      expect(hasForbiddenWarrantyWording(bad)).not.toBeNull();
    }
  });

  it("never promotes a dealer's term to the product's canonical warranty", () => {
    const premier = REPORT.products.find((p) => p.slug === "dolphin-premier")!;
    expect(premier.warranty.status).toBe("not_confirmed");
    expect(premier.warranty.internalReason).toContain("dealer");
    expect(claims.some((c) => c.productId === premier.productId && c.id.endsWith("-warranty"))).toBe(false);
  });

  it("confirms a term only when the manufacturer states it", () => {
    for (const p of REPORT.products) {
      if (p.warranty.status !== "confirmed") continue;
      const f = LEDGER.fields.find((x) => x.productId === p.productId && x.field === "warranty")!;
      const ev = LEDGER.evidence.find((e) => e.id === f.evidenceIds[0])!;
      const src = LEDGER.sources.find((s) => s.id === ev.sourceId)!;
      expect(["manufacturer_page", "manufacturer_document"]).toContain(src.type);
    }
  });

  it("keeps an unconfirmed warranty out of comparison rows", () => {
    for (const p of REPORT.products) {
      if (p.publication.readyForComparison) expect(p.warranty.status).toBe("confirmed");
    }
  });

  it("returns the approved wording for a missing field record", () => {
    expect(warrantyStatement(undefined).text).toBe(WARRANTY_NOT_CONFIRMED);
    expect(warrantyStatement(undefined).status).toBe("not_confirmed");
  });
});

describe("register mapping carries the correction", () => {
  const mapping = buildNotionMapping();

  it("records the launch status of every row", () => {
    const byStatus = mapping.rows.reduce<Record<string, number>>((a, r) => ({ ...a, [r.launchStatus]: (a[r.launchStatus] ?? 0) + 1 }), {});
    expect(Object.keys(byStatus).every((k) => ["launch_ready", "limited_factual_use", "candidate_under_review"].includes(k))).toBe(true);
    expect(mapping.rows.find((r) => r.slug === "dolphin-premier")!.launchStatus).toBe("candidate_under_review");
    expect(mapping.rows.find((r) => r.slug === "aiper-seagull-se")!.launchStatus).toBe("limited_factual_use");
  });

  it("records every review gate with its reason", () => {
    for (const r of mapping.rows) {
      expect(r.reviewGates).toHaveLength(6);
      for (const g of r.reviewGates) expect(g.detail.length).toBeGreaterThan(15);
    }
  });

  it("records the approved warranty wording per row", () => {
    for (const r of mapping.rows) {
      expect(["confirmed", "not_confirmed"]).toContain(r.warrantyStatus);
      if (r.warrantyStatus === "not_confirmed") expect(r.warrantyPublicWording).toBe(WARRANTY_NOT_CONFIRMED);
    }
  });
});
