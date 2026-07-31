/**
 * Validation, completeness scoring and publication safety.
 *
 * The completeness figure is only meaningful if its denominator is stated, so
 * every score below names exactly what it counted. Groups are reported
 * separately because "identity is complete" and "suitability is complete" are
 * different facts with different consequences.
 */
import { PRODUCTS } from "../content/products";
import { ALL_GROUPS, FIELD_SPECS, deriveLedger, type DerivedLedger } from "../content/evidence/derive";
import {
  CADENCE_DAYS,
  type ClaimRecord,
  type EvidenceRecord,
  type FieldGroup,
} from "../content/evidence/types";

export const LAUNCH_PRODUCT_COUNT = 10;

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

  // Exactly the intended launch set.
  if (products.length !== LAUNCH_PRODUCT_COUNT) {
    issues.push({
      severity: "error",
      rule: "launch_product_count",
      detail: `expected ${LAUNCH_PRODUCT_COUNT} launch products, found ${products.length}`,
    });
  }

  // Stable IDs and canonical names must be unique.
  for (const [key, list] of [
    ["product_id", products.map((p) => p.productId)],
    ["slug", products.map((p) => p.slug)],
  ] as const) {
    const seen = new Set<string>();
    for (const v of list) {
      if (seen.has(v)) {
        issues.push({ severity: "error", rule: `${key}_unique`, detail: `duplicate ${key}: ${v}` });
      }
      seen.add(v);
    }
  }

  const sourceIds = new Set(ledger.sources.map((s) => s.id));
  const evidenceIds = new Set(ledger.evidence.map((e) => e.id));

  for (const e of ledger.evidence) {
    // No orphan evidence.
    if (!productIds.has(e.productId)) {
      issues.push({ severity: "error", rule: "evidence_product_exists", detail: `evidence ${e.id} references unknown product`, productId: e.productId });
    }
    if (!sourceIds.has(e.sourceId)) {
      issues.push({ severity: "error", rule: "evidence_source_exists", detail: `evidence ${e.id} references unknown source`, field: e.field });
    }
    // A populated evidence-controlled field must carry a source.
    if (e.storedValue !== null && !e.sourceId) {
      issues.push({ severity: "error", rule: "source_required", detail: `${e.field} has a value but no source`, productId: e.productId, field: e.field });
    }
    // Impossible numbers.
    if (typeof e.storedValue === "number" && e.storedValue < 0) {
      issues.push({ severity: "error", rule: "no_negative_values", detail: `${e.field} is negative`, productId: e.productId, field: e.field });
    }
    // Unit consistency: a normalised value must declare its unit and method.
    if (e.normalizedValue !== null && (!e.normalizedUnit || !e.conversionMethod)) {
      issues.push({ severity: "error", rule: "unit_consistency", detail: `${e.field} normalised without unit/method`, productId: e.productId, field: e.field });
    }
    // An unresolved conflict must never be treated as publishable.
    if (e.conflictStatus === "conflicting" && !e.superseded) {
      issues.push({ severity: "warning", rule: "unresolved_conflict", detail: `${e.field} has conflicting evidence and is suppressed`, productId: e.productId, field: e.field });
    }
  }

  // Claims must point at evidence that exists, and nothing may claim testing.
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

  // No editorial prose may assert testing.
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

/** A value may only be described as current if it has been verified. */
export function isCurrent(e: EvidenceRecord, today: Date): boolean {
  return e.verifiedDate !== null && !isStale(e, today);
}

/* ------------------------------------------------------------------ */
/* Completeness — each score names its denominator                     */
/* ------------------------------------------------------------------ */

export interface GroupScore {
  group: FieldGroup;
  populated: number;
  tracked: number;
  percent: number;
}

export interface ProductReport {
  productId: string;
  slug: string;
  name: string;
  /** Identity fields present (denominator: identity fields tracked). */
  identity: GroupScore;
  /** Technical specification groups combined. */
  technical: GroupScore;
  /** Pool suitability group. */
  suitability: GroupScore;
  /** Share of populated fields that carry a usable source. */
  evidence: GroupScore;
  groups: GroupScore[];
  populatedFields: string[];
  missingFields: string[];
  conflictingFields: string[];
  staleFields: string[];
  sourceCount: number;
  claimCountByClass: Record<string, number>;
  unsupportedClaims: number;
  latestVerification: string | null;
  /** Safe to publish facts from, per the rules below. */
  publicationSafe: boolean;
  publicationBlockers: string[];
}

const TECHNICAL_GROUPS: FieldGroup[] = ["power_operation", "cleaning_coverage", "physical", "connectivity", "warranty_support"];

const score = (group: FieldGroup, populated: number, tracked: number): GroupScore => ({
  group,
  populated,
  tracked,
  percent: tracked === 0 ? 0 : Math.round((populated / tracked) * 100),
});

export function buildReport(today = new Date(), claims: ClaimRecord[] = []): {
  ledger: DerivedLedger;
  issues: ValidationIssue[];
  products: ProductReport[];
  denominators: Record<string, number>;
} {
  const ledger = deriveLedger();
  const issues = validateLedger(ledger, claims);

  const trackedByGroup = new Map<FieldGroup, number>();
  for (const g of ALL_GROUPS) trackedByGroup.set(g, FIELD_SPECS.filter((f) => f.group === g).length);

  const products: ProductReport[] = Object.values(PRODUCTS).map((p) => {
    const mine = ledger.evidence.filter((e) => e.productId === p.productId);
    const myGaps = ledger.gaps.filter((g) => g.productId === p.productId);

    const groups: GroupScore[] = ALL_GROUPS.map((g) =>
      score(g, mine.filter((e) => e.group === g).length, trackedByGroup.get(g) ?? 0),
    );

    const technicalPopulated = mine.filter((e) => TECHNICAL_GROUPS.includes(e.group)).length;
    const technicalTracked = FIELD_SPECS.filter((f) => TECHNICAL_GROUPS.includes(f.group)).length;
    const withSource = mine.filter((e) => e.sourceId).length;

    const stale = mine.filter((e) => isStale(e, today)).map((e) => e.field);
    const conflicting = mine.filter((e) => e.conflictStatus === "conflicting").map((e) => e.field);
    const myClaims = claims.filter((c) => c.productId === p.productId);
    const byClass: Record<string, number> = {};
    for (const c of myClaims) byClass[c.claimClass] = (byClass[c.claimClass] ?? 0) + 1;

    const verifiedDates = mine.map((e) => e.verifiedDate).filter((d): d is string => Boolean(d)).sort();
    const blockers: string[] = [];
    if (mine.length === 0) blockers.push("no evidence records");
    if (conflicting.length) blockers.push(`${conflicting.length} unresolved conflict(s)`);
    if (issues.some((i) => i.severity === "error" && i.productId === p.productId)) blockers.push("validation errors");

    return {
      productId: p.productId,
      slug: p.slug,
      name: p.slug,
      identity: score("identity", mine.filter((e) => e.group === "identity").length, trackedByGroup.get("identity") ?? 0),
      technical: score("power_operation", technicalPopulated, technicalTracked),
      suitability: score("pool_suitability", mine.filter((e) => e.group === "pool_suitability").length, trackedByGroup.get("pool_suitability") ?? 0),
      evidence: score("identity", withSource, mine.length),
      groups,
      populatedFields: mine.map((e) => e.field),
      missingFields: myGaps.map((g) => g.field),
      conflictingFields: conflicting,
      staleFields: stale,
      sourceCount: new Set(mine.map((e) => e.sourceId)).size,
      claimCountByClass: byClass,
      unsupportedClaims: myClaims.filter((c) => c.evidenceIds.length === 0 && c.claimClass !== "prohibited_unsupported").length,
      latestVerification: verifiedDates.length ? verifiedDates[verifiedDates.length - 1] : null,
      publicationSafe: blockers.length === 0,
      publicationBlockers: blockers,
    };
  });

  return {
    ledger,
    issues,
    products,
    denominators: {
      fieldsTrackedPerProduct: FIELD_SPECS.length,
      identityFields: trackedByGroup.get("identity") ?? 0,
      technicalFields: FIELD_SPECS.filter((f) => TECHNICAL_GROUPS.includes(f.group)).length,
      suitabilityFields: trackedByGroup.get("pool_suitability") ?? 0,
      launchProducts: LAUNCH_PRODUCT_COUNT,
    },
  };
}
