/**
 * Validation, completeness scoring and publication readiness.
 *
 * TWO COMPLETENESS FIGURES, BOTH WITH THEIR DENOMINATOR NAMED:
 *
 *   raw       publishable fields / fields that apply to this product
 *   weighted  sum of publishable field weights / sum of applicable field weights
 *
 * They differ, and the difference is the point. A product can look 70% complete
 * on a raw count while missing warranty, pool size and power type — the three
 * things a buyer actually decides on. The weighted figure catches that; the raw
 * figure keeps the weighted one honest by showing what it is built from.
 *
 * Inapplicable fields are removed from BOTH denominators. Counting "cable
 * length" as missing on a cordless robot would make every cordless product look
 * incomplete for a fact that does not exist.
 */
import { PRODUCTS } from "../content/products";
import { ALL_GROUPS, deriveLedger, type DerivedLedger } from "../content/evidence/derive";
import { FIELD_REGISTRY, TOTAL_REGISTRY_WEIGHT } from "../content/evidence/field-registry";
import { RECONCILIATION, reconciliationCounts, type Reconciliation } from "../content/evidence/reconciliation";
import { VERIFICATIONS } from "../content/evidence/verification";
import { warrantyStatement, hasForbiddenWarrantyWording, type WarrantyStatement } from "./warranty";
import {
  CADENCE_DAYS,
  type ClaimRecord,
  type EvidenceRecord,
  type FieldGroup,
  type FieldRecord,
  type FieldState,
  type PublicationStates,
} from "../content/evidence/types";

export const LAUNCH_PRODUCT_COUNT = 10;

/** The fields a like-for-like comparison table needs before it can be drawn. */
export const COMPARISON_FIELDS = [
  "powerType",
  "poolTypes",
  "poolSizeSuitability",
  "runtimeMins",
  "surfacesCleaned",
  "filtration",
  "warranty",
];

/** The fields BotMatch filters and scores on. */
export const BOTMATCH_FIELDS = ["powerType", "poolTypes", "poolSizeSuitability", "surfacesCleaned", "appSupport"];

/**
 * Identity must be solid before a product can carry a written review.
 *
 * The line is drawn at "we can point a reader at the manufacturer's own page
 * for this exact model". Model number and manual are recorded and wanted, but
 * requiring them would fail seven of ten products for a disclosure habit that
 * varies by brand — while an absent manufacturer page means we cannot show that
 * the model we are describing is the model the maker sells.
 */
export const IDENTITY_CORE_FIELDS = ["brand", "canonicalName", "officialProductPageUrl"];

/**
 * Weighted completeness a product must reach before a review is written around
 * it. Necessary, never sufficient — see REVIEW_SECTIONS and the gates below.
 */
export const REVIEW_WEIGHTED_THRESHOLD = 65;

/**
 * The sections a launch review is expected to contain, and the fields each one
 * cannot be written honestly without. A percentage cannot tell you whether the
 * "what it cleans" section can be written; this can.
 */
export const REVIEW_SECTIONS: { section: string; requires: string[] }[] = [
  { section: "What it is", requires: ["brand", "canonicalName", "powerType"] },
  { section: "Where it fits", requires: ["poolTypes", "poolSizeSuitability"] },
  { section: "What it cleans", requires: ["surfacesCleaned", "navigation", "filtration"] },
  { section: "How it runs", requires: ["runtimeMins"] },
  { section: "Living with it", requires: ["weightLbs"] },
];

/** Fields where an unresolved conflict makes a review dishonest, not merely thin. */
export const MATERIAL_REVIEW_FIELDS = [
  "powerType",
  "poolTypes",
  "poolSizeSuitability",
  "surfacesCleaned",
  "runtimeMins",
  "warranty",
];

/**
 * Where a product stands in the launch set. An explicit typed state, because
 * "not ready" covers two very different situations: a well-identified product
 * with thin data, and a product we cannot firmly identify at all.
 */
export type LaunchStatus =
  /** Identified, evidenced and complete enough to write a review around. */
  | "launch_ready"
  /** Identified and safe to state individual facts from, but not to review or compare. */
  | "limited_factual_use"
  /** Identity or evidence is too weak to treat as a settled launch product. */
  | "candidate_under_review";

/** One readiness gate, with the reason it passed or failed. */
export interface ReviewGate {
  gate: string;
  passed: boolean;
  detail: string;
}

/* ------------------------------------------------------------------ */
/* Validation                                                          */
/* ------------------------------------------------------------------ */

export interface ValidationIssue {
  severity: "error" | "warning";
  rule: string;
  detail: string;
  productId?: string;
  field?: string;
}

/** Words that would assert hands-on testing we have not done. */
const TESTED_PATTERNS = [
  /\bwe tested\b/i,
  /\bour (lab|tests?|testing)\b/i,
  /\bbotplanet tested\b/i,
  /\btested by botplanet\b/i,
  /\bhands-on tested\b/i,
];

export function validateLedger(ledger: DerivedLedger, claims: ClaimRecord[] = []): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const products = Object.values(PRODUCTS);
  const productIds = new Set(products.map((p) => p.productId));

  if (products.length !== LAUNCH_PRODUCT_COUNT) {
    issues.push({
      severity: "error",
      rule: "launch_product_count",
      detail: `expected ${LAUNCH_PRODUCT_COUNT} launch products, found ${products.length}`,
    });
  }

  for (const [key, list] of [
    ["product_id", products.map((p) => p.productId)],
    ["slug", products.map((p) => p.slug)],
  ] as const) {
    const seen = new Set<string>();
    for (const val of list) {
      if (seen.has(val)) issues.push({ severity: "error", rule: `${key}_unique`, detail: `duplicate ${key}: ${val}` });
      seen.add(val);
    }
  }

  // Every launch product must have been through the verification pass.
  for (const p of products) {
    if (!VERIFICATIONS.some((v) => v.productId === p.productId)) {
      issues.push({ severity: "error", rule: "verification_required", detail: "no live verification record", productId: p.productId });
    }
  }

  const sourceIds = new Set(ledger.sources.map((s) => s.id));
  const evidenceIds = new Set(ledger.evidence.map((e) => e.id));

  for (const e of ledger.evidence) {
    if (!productIds.has(e.productId)) {
      issues.push({ severity: "error", rule: "evidence_product_exists", detail: `evidence ${e.id} references unknown product`, productId: e.productId });
    }
    if (!sourceIds.has(e.sourceId)) {
      issues.push({ severity: "error", rule: "evidence_source_exists", detail: `evidence ${e.id} references unknown source`, field: e.field });
    }
    if (e.storedValue !== null && !e.sourceId) {
      issues.push({ severity: "error", rule: "source_required", detail: `${e.field} has a value but no source`, productId: e.productId, field: e.field });
    }
    if (typeof e.storedValue === "number" && e.storedValue < 0) {
      issues.push({ severity: "error", rule: "no_negative_values", detail: `${e.field} is negative`, productId: e.productId, field: e.field });
    }
    if (e.normalizedValue !== null && (!e.normalizedUnit || !e.conversionMethod)) {
      issues.push({ severity: "error", rule: "unit_consistency", detail: `${e.field} normalised without unit/method`, productId: e.productId, field: e.field });
    }
    // A value that has been read from its source must say when.
    if (!e.verifiedDate) {
      issues.push({ severity: "warning", rule: "unverified_evidence", detail: `${e.field} has never been re-checked against its source`, productId: e.productId, field: e.field });
    }
  }

  // A field may never be publishable without evidence behind it.
  for (const f of ledger.fields) {
    if (f.publishable && f.evidenceIds.length === 0) {
      issues.push({ severity: "error", rule: "publishable_requires_evidence", detail: `${f.field} is publishable with no evidence`, productId: f.productId, field: f.field });
    }
    if (f.publishable && f.state !== "populated") {
      issues.push({ severity: "error", rule: "publishable_requires_populated", detail: `${f.field} is publishable in state ${f.state}`, productId: f.productId, field: f.field });
    }
  }

  // An unresolved conflict must be visible and must publish nothing.
  for (const c of ledger.conflicts) {
    if (c.suppressed) {
      issues.push({ severity: "warning", rule: "unresolved_conflict", detail: `${c.field}: ${c.resolutionRule}`, productId: c.productId, field: c.field });
    }
  }

  // Every reconciliation entry must name a field the registry knows about.
  const registryFields = new Set(FIELD_REGISTRY.map((f) => f.field));
  for (const r of RECONCILIATION) {
    if (!registryFields.has(r.field)) {
      issues.push({ severity: "error", rule: "reconciliation_field_known", detail: `reconciliation references unknown field ${r.field}`, productId: r.productId });
    }
    if (!productIds.has(r.productId)) {
      issues.push({ severity: "error", rule: "reconciliation_product_known", detail: `reconciliation references unknown product ${r.productId}` });
    }
  }

  for (const c of claims) {
    if (!productIds.has(c.productId)) {
      issues.push({ severity: "error", rule: "claim_product_exists", detail: `claim ${c.id} references unknown product` });
    }
    for (const id of c.evidenceIds) {
      if (!evidenceIds.has(id)) {
        issues.push({ severity: "error", rule: "claim_evidence_exists", detail: `claim ${c.id} references missing evidence ${id}` });
      }
    }
    if (c.claimClass !== "prohibited_unsupported" && c.evidenceIds.length === 0) {
      issues.push({ severity: "error", rule: "claim_requires_evidence", detail: `claim ${c.id} has no supporting evidence` });
    }
    if (c.claimClass === "tested_observation") {
      issues.push({ severity: "error", rule: "no_tested_claims", detail: `claim ${c.id} asserts testing that has not happened` });
    }
  }

  for (const p of Object.values(PRODUCTS)) {
    const prose = [p.verdict, p.oneLiner, p.whoShouldBuy, p.whoShouldAvoid, ...p.pros, ...p.limitations].join(" ");
    for (const re of TESTED_PATTERNS) {
      if (re.test(prose)) {
        issues.push({ severity: "error", rule: "no_tested_claims", detail: `editorial prose asserts testing (${re})`, productId: p.productId });
      }
    }
    // Where no warranty term is confirmed, the copy must not assert an absence.
    const bad = hasForbiddenWarrantyWording(prose);
    if (bad) {
      issues.push({ severity: "error", rule: "warranty_wording", detail: `editorial prose asserts a warranty absence (${bad})`, productId: p.productId });
    }
  }

  // A dealer or editorial source must never be labelled as the manufacturer.
  const byId = new Map(ledger.sources.map((s) => [s.id, s]));
  for (const e of ledger.evidence) {
    const src = byId.get(e.sourceId);
    if (!src) continue;
    const isManufacturer = src.type === "manufacturer_page" || src.type === "manufacturer_document";
    if (!isManufacturer && (e.label === "manufacturer_stated" || e.label === "manual_verified")) {
      issues.push({
        severity: "error",
        rule: "no_dealer_as_manufacturer",
        detail: `${e.field} is labelled ${e.label} but its source is ${src.type} (${src.publisher})`,
        productId: e.productId,
        field: e.field,
      });
    }
  }

  // Nothing on a public claim may assert a warranty absence either.
  for (const c of claims) {
    const bad = hasForbiddenWarrantyWording(c.claimText);
    if (bad) {
      issues.push({ severity: "error", rule: "warranty_wording", detail: `claim ${c.id} asserts a warranty absence (${bad})`, productId: c.productId });
    }
  }

  return issues;
}

/* ------------------------------------------------------------------ */
/* Freshness                                                           */
/* ------------------------------------------------------------------ */

export function isStale(e: EvidenceRecord, today: Date): boolean {
  const basis = e.verifiedDate ?? e.retrievedDate;
  const days = (today.getTime() - new Date(basis).getTime()) / 86_400_000;
  return days > CADENCE_DAYS[e.cadence];
}

export function isCurrent(e: EvidenceRecord, today: Date): boolean {
  return e.verifiedDate !== null && !isStale(e, today);
}

/** A field is current when it was verified inside its own cadence. */
export function fieldIsCurrent(f: FieldRecord, today: Date): boolean {
  if (!f.verifiedDate) return false;
  const days = (today.getTime() - new Date(f.verifiedDate).getTime()) / 86_400_000;
  return days <= CADENCE_DAYS[f.cadence];
}

/* ------------------------------------------------------------------ */
/* Completeness                                                        */
/* ------------------------------------------------------------------ */

export interface GroupScore {
  group: FieldGroup;
  /** Fields with a publishable value. */
  populated: number;
  /** Fields that apply to this product — inapplicable ones are excluded. */
  applicable: number;
  /** Fields the registry defines, applicable or not. */
  tracked: number;
  rawPercent: number;
  weightPopulated: number;
  weightApplicable: number;
  weightedPercent: number;
}

const emptyStateCounts = (): Record<FieldState, number> => ({
  populated: 0,
  unknown: 0,
  not_applicable: 0,
  not_publicly_stated: 0,
  conflicting: 0,
  suppressed: 0,
  pending_verification: 0,
});

function scoreGroup(group: FieldGroup, list: FieldRecord[]): GroupScore {
  const tracked = FIELD_REGISTRY.filter((f) => f.group === group).length;
  const applicableList = list.filter((f) => f.state !== "not_applicable");
  const populatedList = applicableList.filter((f) => f.publishable);
  const weightApplicable = applicableList.reduce((n, f) => n + f.weight, 0);
  const weightPopulated = populatedList.reduce((n, f) => n + f.weight, 0);
  return {
    group,
    populated: populatedList.length,
    applicable: applicableList.length,
    tracked,
    rawPercent: applicableList.length === 0 ? 0 : Math.round((populatedList.length / applicableList.length) * 100),
    weightPopulated,
    weightApplicable,
    weightedPercent: weightApplicable === 0 ? 0 : Math.round((weightPopulated / weightApplicable) * 100),
  };
}

export interface ProductReport {
  productId: string;
  slug: string;
  name: string;
  /** Manufacturer wording for this exact model, from the verification pass. */
  canonicalName: string;
  modelNumber: string | null;
  manualUrl: string | null;
  identityIssue?: string;
  overall: GroupScore;
  groups: GroupScore[];
  stateCounts: Record<FieldState, number>;
  fieldsByState: Record<FieldState, string[]>;
  sourceCount: number;
  /** Sources cited that could not be read on the verification date. */
  deadSources: string[];
  conflicts: DerivedLedger["conflicts"];
  reconciliation: Record<Reconciliation, number>;
  claimCountByClass: Record<string, number>;
  latestVerification: string | null;
  publication: PublicationStates;
  publicationBlockers: string[];
  /** Where this product stands in the launch set. */
  launchStatus: LaunchStatus;
  /** Every review-writing gate, with the reason it passed or failed. */
  reviewGates: ReviewGate[];
  /** Set when no manufacturer source backs this product's values. */
  evidenceQualification: string | null;
  /** Public wording for the warranty, confirmed or not. */
  warranty: WarrantyStatement;
}

export interface EvidenceReport {
  ledger: DerivedLedger;
  issues: ValidationIssue[];
  products: ProductReport[];
  denominators: Record<string, number>;
  totals: {
    fieldRecords: number;
    evidenceRecords: number;
    stateCounts: Record<FieldState, number>;
    reconciliation: Record<Reconciliation, number>;
    rawPercent: number;
    weightedPercent: number;
    conflicts: number;
    unresolvedConflicts: number;
  };
}

export function buildReport(today = new Date(), claims: ClaimRecord[] = []): EvidenceReport {
  const ledger = deriveLedger();
  const issues = validateLedger(ledger, claims);

  const products: ProductReport[] = Object.values(PRODUCTS).map((p) => {
    const mine = ledger.fields.filter((f) => f.productId === p.productId);
    const v = VERIFICATIONS.find((x) => x.productId === p.productId);
    const myConflicts = ledger.conflicts.filter((c) => c.productId === p.productId);
    const myEvidence = ledger.evidence.filter((e) => e.productId === p.productId);

    const stateCounts = emptyStateCounts();
    const fieldsByState: Record<FieldState, string[]> = {
      populated: [],
      unknown: [],
      not_applicable: [],
      not_publicly_stated: [],
      conflicting: [],
      suppressed: [],
      pending_verification: [],
    };
    for (const f of mine) {
      stateCounts[f.state] += 1;
      fieldsByState[f.state].push(f.field);
    }

    const recCounts = emptyReconciliation();
    for (const r of RECONCILIATION.filter((r) => r.productId === p.productId)) recCounts[r.outcome] += 1;

    const overall = scoreGroup("identity", mine);
    const groups = ALL_GROUPS.map((g) => scoreGroup(g, mine.filter((f) => f.group === g)));

    const publishedFields = mine.filter((f) => f.publishable);
    const verifiedDates = mine.map((f) => f.verifiedDate).filter((d): d is string => Boolean(d)).sort();

    const structurallyValid = !issues.some((i) => i.severity === "error" && i.productId === p.productId);
    const factuallyEvidenced = publishedFields.length > 0 && publishedFields.every((f) => f.evidenceIds.length > 0);
    const currentlyVerified = publishedFields.length > 0 && publishedFields.every((f) => fieldIsCurrent(f, today));
    const unresolved = myConflicts.filter((c) => c.suppressed).length;
    const safeForLimitedFactualUse = structurallyValid && factuallyEvidenced && currentlyVerified;

    const field = (k: string) => mine.find((x) => x.field === k);

    // Warranty wording is decided once, from the winning source's authority.
    // A dealer's term is never promoted to the product's canonical warranty.
    const warrantyEvidence = (() => {
      const f = field("warranty");
      const ev = myEvidence.find((e) => e.id === f?.evidenceIds[0]);
      const src = ev ? ledger.sources.find((s) => s.id === ev.sourceId) : undefined;
      const fromManufacturer = src?.type === "manufacturer_page" || src?.type === "manufacturer_document";
      return { statement: warrantyStatement(f, src?.publisher ?? null, Boolean(fromManufacturer)) };
    })();

    /**
     * Is a field available to a comparison table or to BotMatch? Warranty is the
     * one field where "publishable" is not enough: a dealer-stated term is a
     * real, attributable fact about that dealer's offer, but putting it in a
     * comparison row would present it as the manufacturer's.
     */
    const has = (keys: string[]) => keys.every((k) => {
      if (k === "warranty") return warrantyEvidence.statement.status === "confirmed";
      const f = mine.find((x) => x.field === k);
      return Boolean(f && (f.publishable || f.state === "not_applicable"));
    });

    /* --- The review-writing gates. The percentage is one of six, not the rule. --- */
    const identityComplete = IDENTITY_CORE_FIELDS.every((k) => field(k)?.publishable);
    const manualAccepted = Boolean(v?.identity.manual?.coversThisModel);
    const modelNumberKnown = Boolean(field("modelNumber")?.publishable);

    const conflictedMaterial = MATERIAL_REVIEW_FIELDS.filter((k) => field(k)?.state === "conflicting");
    const unwritableSections = REVIEW_SECTIONS.filter((s) => !has(s.requires));
    // A section propped up by a value we are withholding is speculation.
    const speculativeFields = REVIEW_SECTIONS.flatMap((s) => s.requires).filter((k) => field(k)?.state === "suppressed");
    // Every stored value that did not survive verification must carry a written
    // correction, so nothing unsupported can quietly stay in the copy.
    const myReconciliation = RECONCILIATION.filter((r) => r.productId === p.productId);
    const correctionsIdentified = myReconciliation
      .filter((r) => !["agrees", "agrees_rounded", "not_applicable"].includes(r.outcome))
      .every((r) => r.note.trim().length > 20);

    const reviewGates: ReviewGate[] = [
      {
        gate: "weighted_completeness",
        passed: overall.weightedPercent >= REVIEW_WEIGHTED_THRESHOLD,
        detail: `weighted completeness ${overall.weightedPercent}% against a ${REVIEW_WEIGHTED_THRESHOLD}% floor`,
      },
      {
        gate: "model_identity",
        passed: identityComplete,
        detail: identityComplete
          ? `identified by ${v?.identity.officialProductPageUrl}${modelNumberKnown ? ", with a published model number" : ", model number not published by the maker"}${manualAccepted ? ", manual accepted" : ", no manual accepted"}`
          : "no accepted official manufacturer page for this exact model",
      },
      {
        gate: "no_material_conflict",
        passed: conflictedMaterial.length === 0,
        detail: conflictedMaterial.length
          ? `unresolved conflict on material review field(s): ${conflictedMaterial.join(", ")}`
          : "no unresolved conflict on a material review field",
      },
      {
        gate: "review_sections_writable",
        passed: unwritableSections.length === 0,
        detail: unwritableSections.length
          ? `insufficient evidence coverage for review section(s): ${unwritableSections.map((s) => s.section).join(", ")}`
          : "every intended review section has the evidence it needs",
      },
      {
        gate: "no_speculation",
        passed: speculativeFields.length === 0,
        detail: speculativeFields.length
          ? `review section(s) would rest on suppressed value(s): ${speculativeFields.join(", ")}`
          : "no review section rests on a suppressed value",
      },
      {
        gate: "corrections_identified",
        passed: correctionsIdentified,
        detail: correctionsIdentified
          ? "every unsupported or conflicting stored value carries a written correction"
          : "an unsupported stored value has no written correction",
      },
    ];

    const readyForReviewWriting = safeForLimitedFactualUse && reviewGates.every((g) => g.passed);
    const readyForComparison = readyForReviewWriting && has(COMPARISON_FIELDS);
    const readyForBotMatch = readyForReviewWriting && has(BOTMATCH_FIELDS);

    /* --- Launch status: an explicit state, not the absence of readiness. --- */
    const evidenceWeak = !identityComplete || conflictedMaterial.length > 0;
    const launchStatus: LaunchStatus = evidenceWeak
      ? "candidate_under_review"
      : readyForReviewWriting
        ? "launch_ready"
        : "limited_factual_use";

    /* --- Evidence qualification: never let a dealer read as the manufacturer. --- */
    const manufacturerBacked = myEvidence.some((e) => e.label === "manufacturer_stated" || e.label === "manual_verified");
    const evidenceQualification = manufacturerBacked
      ? null
      : "dealer-sourced: no manufacturer page or manual was accepted for this model, so every value is attributed to the dealer that published it and none is presented as manufacturer-stated";

    /* --- Blockers: one line each, in the order a reader would ask them. --- */
    const blockers: string[] = [];
    if (!structurallyValid) blockers.push("validation errors");
    if (!factuallyEvidenced) blockers.push("published fields without evidence");
    if (!currentlyVerified) blockers.push("published fields outside their refresh cadence");
    if (evidenceQualification) blockers.push("manufacturer identity/evidence weakness: no manufacturer-sourced value for this model");
    // Manual and model number are recorded for every product, but they only
    // BLOCK when identity as a whole has failed — otherwise a fully ready
    // product would carry blockers that block nothing.
    if (!identityComplete) {
      blockers.push("no accepted official manufacturer page");
      if (!manualAccepted) blockers.push("no accepted manual");
      if (!modelNumberKnown) blockers.push("no reliably established model number");
    }
    for (const k of conflictedMaterial) blockers.push(`unresolved conflict on ${k}`);
    if (unresolved && conflictedMaterial.length === 0) blockers.push(`${unresolved} unresolved conflict(s)`);
    for (const g of reviewGates) {
      if (!g.passed && g.gate !== "model_identity" && g.gate !== "no_material_conflict") blockers.push(g.detail);
    }
    for (const k of COMPARISON_FIELDS) if (!has([k])) blockers.push(`comparison field unavailable: ${k}`);
    for (const k of BOTMATCH_FIELDS) if (!has([k])) blockers.push(`BotMatch field unavailable: ${k}`);

    const byClass: Record<string, number> = {};
    for (const c of claims.filter((c) => c.productId === p.productId)) {
      byClass[c.claimClass] = (byClass[c.claimClass] ?? 0) + 1;
    }

    return {
      productId: p.productId,
      slug: p.slug,
      name: p.slug,
      canonicalName: v?.identity.canonicalName ?? p.slug,
      modelNumber: v?.identity.modelNumber ?? null,
      manualUrl: v?.identity.manual?.coversThisModel ? v.identity.manual.url : null,
      identityIssue: v?.identity.identityIssue,
      overall,
      groups,
      stateCounts,
      fieldsByState,
      sourceCount: new Set(myEvidence.map((e) => e.sourceId)).size,
      deadSources: (v?.sourceChecks ?? []).filter((c) => c.status === "unreadable").map((c) => c.url),
      conflicts: myConflicts,
      reconciliation: recCounts,
      claimCountByClass: byClass,
      latestVerification: verifiedDates.length ? verifiedDates[verifiedDates.length - 1] : null,
      publication: {
        structurallyValid,
        factuallyEvidenced,
        currentlyVerified,
        safeForLimitedFactualUse,
        readyForReviewWriting,
        readyForComparison,
        readyForBotMatch,
      },
      publicationBlockers: blockers,
      launchStatus,
      reviewGates,
      evidenceQualification,
      warranty: warrantyEvidence.statement,
    };
  });

  const allStates = emptyStateCounts();
  for (const f of ledger.fields) allStates[f.state] += 1;

  const applicable = ledger.fields.filter((f) => f.state !== "not_applicable");
  const publishable = applicable.filter((f) => f.publishable);
  const weightApplicable = applicable.reduce((n, f) => n + f.weight, 0);
  const weightPublishable = publishable.reduce((n, f) => n + f.weight, 0);

  return {
    ledger,
    issues,
    products,
    denominators: {
      fieldsInRegistry: FIELD_REGISTRY.length,
      totalRegistryWeight: TOTAL_REGISTRY_WEIGHT,
      launchProducts: LAUNCH_PRODUCT_COUNT,
      fieldRecordsExpected: FIELD_REGISTRY.length * LAUNCH_PRODUCT_COUNT,
      applicableFields: applicable.length,
      applicableWeight: weightApplicable,
    },
    totals: {
      fieldRecords: ledger.fields.length,
      evidenceRecords: ledger.evidence.length,
      stateCounts: allStates,
      reconciliation: reconciliationCounts(),
      rawPercent: applicable.length === 0 ? 0 : Math.round((publishable.length / applicable.length) * 100),
      weightedPercent: weightApplicable === 0 ? 0 : Math.round((weightPublishable / weightApplicable) * 100),
      conflicts: ledger.conflicts.length,
      unresolvedConflicts: ledger.conflicts.filter((c) => c.suppressed).length,
    },
  };
}

function emptyReconciliation(): Record<Reconciliation, number> {
  return {
    agrees: 0,
    agrees_rounded: 0,
    agrees_with_unverified_detail: 0,
    derived_from_range: 0,
    conflicts: 0,
    unsupported: 0,
    newly_populated: 0,
    not_applicable: 0,
  };
}
