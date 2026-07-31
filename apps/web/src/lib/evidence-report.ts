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

/** Identity must be solid before a product can carry a written review. */
export const IDENTITY_CORE_FIELDS = ["brand", "canonicalName", "officialProductPageUrl"];

/** Weighted completeness a product must reach before a review is written around it. */
export const REVIEW_WEIGHTED_THRESHOLD = 60;

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

    const identityComplete = IDENTITY_CORE_FIELDS.every((k) => mine.find((f) => f.field === k)?.publishable);
    const readyForReviewWriting = safeForLimitedFactualUse && identityComplete && overall.weightedPercent >= REVIEW_WEIGHTED_THRESHOLD;
    const has = (keys: string[]) => keys.every((k) => {
      const f = mine.find((x) => x.field === k);
      return Boolean(f && (f.publishable || f.state === "not_applicable"));
    });
    const readyForComparison = readyForReviewWriting && has(COMPARISON_FIELDS);
    const readyForBotMatch = safeForLimitedFactualUse && has(BOTMATCH_FIELDS);

    const blockers: string[] = [];
    if (!structurallyValid) blockers.push("validation errors");
    if (!factuallyEvidenced) blockers.push("published fields without evidence");
    if (!currentlyVerified) blockers.push("published fields outside their refresh cadence");
    if (unresolved) blockers.push(`${unresolved} unresolved conflict(s)`);
    if (!identityComplete) blockers.push("model identity incomplete");
    if (overall.weightedPercent < REVIEW_WEIGHTED_THRESHOLD) {
      blockers.push(`weighted completeness ${overall.weightedPercent}% below the ${REVIEW_WEIGHTED_THRESHOLD}% review threshold`);
    }
    for (const k of COMPARISON_FIELDS) {
      const f = mine.find((x) => x.field === k);
      if (f && !f.publishable && f.state !== "not_applicable") blockers.push(`comparison field unavailable: ${k}`);
    }
    for (const k of BOTMATCH_FIELDS) {
      const f = mine.find((x) => x.field === k);
      if (f && !f.publishable && f.state !== "not_applicable") blockers.push(`BotMatch field unavailable: ${k}`);
    }

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
