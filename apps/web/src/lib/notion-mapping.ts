/**
 * MACHINE-READABLE MAPPING for the Content & SEO Control Register.
 *
 * Claude does not write to the register. Danny does. This produces exactly one
 * object per launch product, containing every value one of those ten rows needs,
 * derived from the ledger so it cannot drift from what the site actually holds.
 *
 * Regenerate with `pnpm evidence:mapping`, which writes docs/job-08-notion-mapping.json.
 */
import { buildClaimLedger } from "../content/evidence/claims";
import { RECONCILIATION } from "../content/evidence/reconciliation";
import { VERIFICATION_DATE, VERIFICATIONS } from "../content/evidence/verification";
import { buildReport } from "./evidence-report";

export interface NotionRow {
  /** Stable join key. Never changes. */
  productId: string;
  slug: string;
  url: string;
  /** Manufacturer's exact wording for this model. */
  canonicalName: string;
  brand: string;
  modelNumber: string | null;
  officialProductPage: string | null;
  manualUrl: string | null;
  manualDocumentId: string | null;
  manualRevision: string | null;
  /** Raised when the model could be confused with a sibling, or was mis-cited. */
  modelIdentityNote: string | null;

  verificationDate: string;
  sourcesUsed: number;
  sourcesUnreadable: string[];

  completenessRawPercent: number;
  completenessWeightedPercent: number;
  /** Denominators, so the percentages above can be checked. */
  fieldsApplicable: number;
  fieldsPublishable: number;
  weightApplicable: number;
  weightPublishable: number;

  fieldStates: Record<string, number>;
  fieldsNotPubliclyStated: string[];
  fieldsSuppressed: string[];
  fieldsConflicting: string[];

  conflicts: { field: string; resolvedTo: string | number | null; rule: string; suppressed: boolean }[];

  /** Editorial corrections the stored record needs, one line each. */
  editorialCorrections: { field: string; outcome: string; action: string }[];

  publicationStates: {
    structurallyValid: boolean;
    factuallyEvidenced: boolean;
    currentlyVerified: boolean;
    safeForLimitedFactualUse: boolean;
    readyForReviewWriting: boolean;
    readyForComparison: boolean;
    readyForBotMatch: boolean;
  };
  publicationBlockers: string[];

  claimsPublishable: number;
  claimsBlocked: number;
}

/** Turns a reconciliation outcome into the action Danny's row should record. */
function actionFor(outcome: string, note: string): string {
  switch (outcome) {
    case "conflicts":
      return `Correct the stored value — the manufacturer source disagrees. ${note}`;
    case "unsupported":
      return `Remove the stored value or find a source for it — nothing checked states it. ${note}`;
    case "derived_from_range":
      return `Replace the derived figure with the range the source publishes. ${note}`;
    case "agrees_with_unverified_detail":
      return `Trim the unsourced wording; the headline value is verified. ${note}`;
    case "agrees_rounded":
      return `No action — stored value is a stated rounding. ${note}`;
    case "newly_populated":
      return `Add the newly sourced value to the stored record. ${note}`;
    default:
      return note;
  }
}

const NEEDS_ACTION = new Set([
  "conflicts",
  "unsupported",
  "derived_from_range",
  "agrees_with_unverified_detail",
  "newly_populated",
]);

export function buildNotionMapping(today = new Date(VERIFICATION_DATE)): {
  generatedFor: string;
  launchProducts: number;
  fieldsInRegistry: number;
  totals: ReturnType<typeof buildReport>["totals"];
  rows: NotionRow[];
} {
  const { claims, blocked } = buildClaimLedger();
  const report = buildReport(today, claims);

  const rows: NotionRow[] = report.products.map((p) => {
    const v = VERIFICATIONS.find((x) => x.productId === p.productId);
    const mine = report.ledger.fields.filter((f) => f.productId === p.productId);
    const applicable = mine.filter((f) => f.state !== "not_applicable");
    const publishable = applicable.filter((f) => f.publishable);

    return {
      productId: p.productId,
      slug: p.slug,
      url: `https://botplanet.io/pool-cleaners/${p.slug}/`,
      canonicalName: p.canonicalName,
      brand: v?.identity.brand ?? "",
      modelNumber: p.modelNumber,
      officialProductPage: v?.identity.officialProductPageUrl ?? null,
      manualUrl: v?.identity.manual?.url ?? null,
      manualDocumentId: v?.identity.manual?.documentId ?? null,
      manualRevision: v?.identity.manual?.revision ?? null,
      modelIdentityNote: v?.identity.identityIssue ?? null,

      verificationDate: v?.checkedOn ?? VERIFICATION_DATE,
      sourcesUsed: p.sourceCount,
      sourcesUnreadable: p.deadSources,

      completenessRawPercent: p.overall.rawPercent,
      completenessWeightedPercent: p.overall.weightedPercent,
      fieldsApplicable: applicable.length,
      fieldsPublishable: publishable.length,
      weightApplicable: applicable.reduce((n, f) => n + f.weight, 0),
      weightPublishable: publishable.reduce((n, f) => n + f.weight, 0),

      fieldStates: p.stateCounts,
      fieldsNotPubliclyStated: p.fieldsByState.not_publicly_stated,
      fieldsSuppressed: p.fieldsByState.suppressed,
      fieldsConflicting: p.fieldsByState.conflicting,

      conflicts: p.conflicts.map((c) => ({
        field: c.field,
        resolvedTo: c.resolvedTo,
        rule: c.resolutionRule,
        suppressed: c.suppressed,
      })),

      editorialCorrections: RECONCILIATION.filter((r) => r.productId === p.productId && NEEDS_ACTION.has(r.outcome)).map((r) => ({
        field: r.field,
        outcome: r.outcome,
        action: actionFor(r.outcome, r.unverifiedDetail ? `${r.note} Unsourced wording: ${r.unverifiedDetail}` : r.note),
      })),

      publicationStates: p.publication,
      publicationBlockers: p.publicationBlockers,

      claimsPublishable: claims.filter((c) => c.productId === p.productId).length,
      claimsBlocked: blocked.filter((b) => b.productId === p.productId).length,
    };
  });

  return {
    generatedFor: VERIFICATION_DATE,
    launchProducts: report.denominators.launchProducts,
    fieldsInRegistry: report.denominators.fieldsInRegistry,
    totals: report.totals,
    rows,
  };
}
