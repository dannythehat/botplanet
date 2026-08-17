/**
 * Builds the field-level ledger by merging four inputs:
 *
 *   field-registry.ts   what BotPlanet intends to hold, with weights
 *   verification.ts     what the live sources actually said on 2026-07-31
 *   reconciliation.ts   what happened when each stored value met its source
 *   products.ts         what the editorial layer held before verification
 *
 * WHY MERGE RATHER THAN REPLACE: the stored value is not deleted when the live
 * source disagrees with it. Both are kept on the field record, with the reason
 * the live value won and a flag that the editorial copy needs correcting. That
 * is what makes a wrong figure traceable after it has been fixed.
 *
 * The rule the whole file exists to enforce: a value reaches a public surface
 * only when a named source states it, that source was read on a known date, and
 * nothing of equal or higher authority contradicts it.
 */
import { PRODUCTS, type ProductEditorial } from "../products";
import { classifySource, isDocument } from "./sources";
import { satisfiesBound } from "./bounds";
import { FIELD_REGISTRY, fieldApplies, type FieldDefinition } from "./field-registry";
import { RECONCILIATION, type ReconciliationEntry } from "./reconciliation";
import { VERIFICATIONS, type Observation, type ProductVerification } from "./verification";
import {
  SOURCE_PRIORITY,
  type Confidence,
  type ConflictEntry,
  type EvidenceLabel,
  type EvidenceRecord,
  type FieldGroup,
  type FieldRecord,
  type FieldState,
  type SourceRef,
  type SourceType,
} from "./types";
import { normaliseDuration, normaliseLength, normaliseMass } from "../../lib/normalize";

const MARKET = "us";

export const ALL_GROUPS: FieldGroup[] = [
  "identity",
  "power_operation",
  "pool_suitability",
  "cleaning_coverage",
  "physical",
  "connectivity",
  "warranty_support",
];

/** The registry is the denominator. Exported under the old name so callers that
 *  ask "how many fields are tracked" get the full list, not the researched subset. */
export const FIELD_SPECS = FIELD_REGISTRY;

/* ------------------------------------------------------------------ */
/* Sources                                                             */
/* ------------------------------------------------------------------ */

const labelFor = (type: SourceType): EvidenceLabel => {
  switch (type) {
    case "manufacturer_document":
      return "manual_verified";
    case "manufacturer_page":
      return "manufacturer_stated";
    case "manufacturer_content_on_retailer":
      return "manufacturer_stated_on_retailer";
    case "retailer_api":
      return "api_supplied";
    case "retailer_listing":
      return "retailer_stated";
    default:
      return "researched_interpretation";
  }
};

/**
 * Confidence is capped by source authority AND by verification state. Nothing
 * unverified can reach "high" — that grade is reserved for a value read from
 * its source on a known date.
 */
export const confidenceFor = (type: SourceType, verified: boolean): Confidence => {
  const base: Confidence =
    type === "manufacturer_document" || type === "manufacturer_page" || type === "retailer_api"
      ? "high"
      : // Manufacturer-authored, but on a page the manufacturer does not
        // control and that we cannot re-read by fetch. The words are the
        // brand's; their continued presence is not guaranteed, so this caps at
        // medium rather than inheriting a manufacturer page's grade.
        type === "manufacturer_content_on_retailer" || type === "retailer_listing"
        ? "medium"
        : "low";
  if (!verified && base === "high") return "medium";
  return base;
};

/**
 * Build the source registry from every URL touched by the verification pass and
 * every URL the editorial records cite. Sources that could not be read are kept
 * in the registry so a dead link is visible rather than absent.
 */
export function buildSources(): SourceRef[] {
  const out = new Map<string, SourceRef>();
  const add = (url: string, title: string) => {
    if (out.has(url)) return;
    const c = classifySource(url);
    out.set(url, {
      id: `src-${out.size + 1}`,
      type: isDocument(url) && c.type === "manufacturer_page" ? "manufacturer_document" : c.type,
      url,
      title,
      publisher: c.publisher,
    });
  };

  for (const v of VERIFICATIONS) {
    for (const c of v.sourceChecks) add(c.url, c.title);
    for (const o of v.observations) add(o.sourceUrl, o.sourceTitle);
    if (v.identity.manual) add(v.identity.manual.url, `${v.identity.canonicalName} manual`);
  }
  for (const p of Object.values(PRODUCTS)) {
    for (const s of p.sources) add(s.url, s.label);
  }
  return [...out.values()];
}

const sourceByUrl = (sources: SourceRef[], url: string) => sources.find((s) => s.url === url);

/** The highest-authority source a product cites, used only for reporting. */
export function primarySourceFor(p: ProductEditorial, sources: SourceRef[]): SourceRef | null {
  const mine = p.sources
    .map((s) => sourceByUrl(sources, s.url))
    .filter((x): x is SourceRef => Boolean(x))
    .sort((a, b) => SOURCE_PRIORITY[a.type] - SOURCE_PRIORITY[b.type]);
  return mine[0] ?? null;
}

/* ------------------------------------------------------------------ */
/* Normalisation of verbatim source strings                            */
/* ------------------------------------------------------------------ */

/**
 * Pulls a number and its unit out of a verbatim source string so the value can
 * be normalised. Returns null when the string carries no single unambiguous
 * figure — a range, a multi-mode list or a bare description is deliberately
 * left un-normalised rather than reduced to a number nobody published.
 */
export function interpretMeasurement(raw: string): { value: number; unit: string } | null {
  const s = raw.trim();
  // A range or an enumeration is not a single figure.
  if (/\d\s*[-–]\s*\d/.test(s)) return null;
  if ((s.match(/\d+(\.\d+)?\s*(h|hr|hours?|min|minutes?)/gi) ?? []).length > 1) return null;

  const patterns: { re: RegExp; unit: string }[] = [
    { re: /(\d+(?:\.\d+)?)\s*(?:hours?|hrs?|h)\b/i, unit: "hr" },
    { re: /(\d+(?:\.\d+)?)\s*(?:minutes?|mins?)\b/i, unit: "min" },
    { re: /(\d+(?:\.\d+)?)\s*(?:kg|kilograms?)\b/i, unit: "kg" },
    { re: /(\d+(?:\.\d+)?)\s*(?:lbs?|pounds?)\b/i, unit: "lb" },
    { re: /(\d+(?:\.\d+)?)\s*(?:ft|feet|foot)\b/i, unit: "ft" },
    { re: /(\d+(?:\.\d+)?)\s*(?:in|inches|inch)\b/i, unit: "in" },
    { re: /(\d+(?:\.\d+)?)\s*m\b/i, unit: "m" },
  ];
  for (const p of patterns) {
    const m = s.match(p.re);
    if (m) {
      const n = Number(m[1]);
      if (Number.isFinite(n)) return { value: n, unit: p.unit };
    }
  }
  return null;
}

/**
 * Do two source strings state the same fact?
 *
 * Two sources rarely word a fact identically — "1-YEAR WARRANTY" and "1-Year
 * Manufacturer's Warranty from the date of purchase" are the same statement.
 * Treating them as a conflict would suppress a fact that is in fact
 * double-sourced. So the comparison is on the leading quantity-and-unit token
 * where both strings have one, and on cleaned text otherwise. When neither
 * carries a quantity, any difference in wording is treated as a real
 * disagreement — the conservative direction.
 */
export function valuesAgree(a: string | number, b: string | number): boolean {
  const clean = (x: string | number) => String(x).toLowerCase().replace(/[^a-z0-9. ]+/g, " ").replace(/\s+/g, " ").trim();
  const ca = clean(a);
  const cb = clean(b);
  if (ca === cb) return true;
  const quantity = (s: string) => s.match(/(\d+(?:\.\d+)?)\s*([a-z]+)/);
  const qa = quantity(ca);
  const qb = quantity(cb);
  if (qa && qb) return qa[1] === qb[1] && qa[2].slice(0, 3) === qb[2].slice(0, 3);
  return false;
}

function normalise(value: number, unit: string) {
  if (unit === "kg" || unit === "lb") return normaliseMass(value, unit);
  if (unit === "hr" || unit === "min") return normaliseDuration(value, unit);
  if (unit === "ft" || unit === "in" || unit === "m") return normaliseLength(value, unit);
  return null;
}

/* ------------------------------------------------------------------ */
/* Field derivation                                                    */
/* ------------------------------------------------------------------ */

/** Reads the value the editorial layer held, for the fields it covers. */
const STORED_READERS: Record<string, (p: ProductEditorial) => string | number | null> = {
  poolSizeSuitability: (p) => p.specs.poolSizeSuitability,
  cableLengthFt: (p) => p.specs.cableLengthFt,
  runtimeMins: (p) => p.specs.runtimeMins,
  chargeTimeHrs: (p) => p.specs.chargeTimeHrs,
  filtration: (p) => p.specs.filtration,
  navigation: (p) => p.specs.navigation,
  weightLbs: (p) => p.specs.weightLbs,
  warranty: (p) => p.specs.warranty,
  appSupport: (p) => p.specs.appSupport,
};

/** Fields that only exist once a manual has been identified for the model. */
const MANUAL_DEPENDENT = new Set(["manualDocumentId", "manualRevisionDate"]);

/**
 * Reads the value the verification pass established for identity fields.
 *
 * The manual URL is published whenever the manufacturer links a document for
 * this part number, even when that document is a multi-model platform manual —
 * it is still the correct support document to send a reader to. Whether
 * model-specific FIGURES may be taken from it is a separate question, answered
 * by `coversThisModel` and enforced by only ever reading values from
 * `observations`.
 */
function identityValue(v: ProductVerification, field: string): string | null {
  const m = v.identity.manual;
  switch (field) {
    case "brand":
      return v.identity.brand;
    case "canonicalName":
      return v.identity.canonicalName;
    case "modelNumber":
      return v.identity.modelNumber;
    case "officialProductPageUrl":
      return v.identity.officialProductPageUrl;
    case "manualUrl":
      return m ? m.url : null;
    case "manualDocumentId":
      return m ? m.documentId : null;
    case "manualRevisionDate":
      return m ? m.revision : null;
    default:
      return null;
  }
}

/** The source URL that backs an identity field, so identity carries evidence too. */
function identitySourceUrl(v: ProductVerification, field: string): string | null {
  const m = v.identity.manual;
  if (field === "manualUrl" || MANUAL_DEPENDENT.has(field)) return m ? m.url : null;
  if (field === "modelNumber") return v.identity.modelNumberSource;
  // Brand and canonical name are established from whichever source was actually
  // readable — for a product with no manufacturer page that is a dealer page,
  // and the lower authority is reflected in the confidence grade.
  return v.identity.officialProductPageUrl ?? v.sourceChecks.find((c) => c.status === "ok")?.url ?? null;
}

export interface DerivedLedger {
  sources: SourceRef[];
  evidence: EvidenceRecord[];
  fields: FieldRecord[];
  conflicts: ConflictEntry[];
  /** Fields with no publishable value, with the reason. */
  gaps: { productId: string; field: string; group: FieldGroup; state: FieldState; reason: string }[];
}

export function deriveLedger(): DerivedLedger {
  const sources = buildSources();
  const evidence: EvidenceRecord[] = [];
  const fields: FieldRecord[] = [];
  const conflicts: ConflictEntry[] = [];
  const gaps: DerivedLedger["gaps"] = [];

  for (const p of Object.values(PRODUCTS)) {
    const v = VERIFICATIONS.find((x) => x.productId === p.productId);
    const obsAll = v?.observations ?? [];
    const notStated = new Map((v?.notPubliclyStated ?? []).map((n) => [n.field, n]));

    const powerObs = obsAll.find((o) => o.field === "powerType");
    const powerType: "corded" | "cordless" | null = powerObs
      ? /cordless|solar|battery/i.test(String(powerObs.value))
        ? "cordless"
        : "corded"
      : null;
    const connected = obsAll.some((o) => o.field === "appSupport" || o.field === "wifi") ? true : null;

    for (const spec of FIELD_REGISTRY) {
      const rec = RECONCILIATION.find((r) => r.productId === p.productId && r.field === spec.field);
      const built = buildField({ product: p, verification: v, spec, obsAll, notStated, rec, powerType, connected, sources });

      evidence.push(...built.evidence);
      fields.push(built.field);
      if (built.conflict) conflicts.push(built.conflict);
      if (!built.field.publishable) {
        gaps.push({
          productId: p.productId,
          field: spec.field,
          group: spec.group,
          state: built.field.state,
          reason: built.field.reason,
        });
      }
    }
  }

  return { sources, evidence, fields, conflicts, gaps };
}

interface BuildArgs {
  product: ProductEditorial;
  verification?: ProductVerification;
  spec: FieldDefinition;
  obsAll: Observation[];
  notStated: Map<string, { field: string; checked: string[]; note: string }>;
  rec?: ReconciliationEntry;
  powerType: "corded" | "cordless" | null;
  connected: boolean | null;
  sources: SourceRef[];
}

function buildField(a: BuildArgs): { field: FieldRecord; evidence: EvidenceRecord[]; conflict?: ConflictEntry } {
  const { product: p, verification: v, spec, obsAll, notStated, rec, sources } = a;
  const stored = STORED_READERS[spec.field]?.(p) ?? null;
  const evidence: EvidenceRecord[] = [];

  const base = {
    productId: p.productId,
    field: spec.field,
    group: spec.group,
    weight: spec.weight,
    storedValue: stored,
    cadence: spec.cadence,
  };

  /* 1. Applicability wins over everything: an inapplicable field is not a gap. */
  const applicability = fieldApplies(spec.applicability, { powerType: a.powerType, connected: a.connected });
  if (!applicability.applies || rec?.outcome === "not_applicable") {
    return {
      evidence,
      field: {
        ...base,
        state: "not_applicable",
        value: null,
        evidenceIds: [],
        confidence: "none",
        verifiedDate: null,
        applicability: "n/a",
        reason: rec?.note ?? applicability.reason ?? "does not apply to this product",
        publishable: false,
      },
    };
  }

  /* 2. Identity fields come from the verification identity block. */
  const idValue = v ? identityValue(v, spec.field) : null;
  const observations = obsAll.filter((o) => o.field === spec.field);

  // A manual's document number and revision cannot exist when no manual has
  // been identified. That is an absent parent, not an unresearched field.
  if (MANUAL_DEPENDENT.has(spec.field) && !v?.identity.manual) {
    return {
      evidence,
      field: {
        ...base,
        state: "not_applicable",
        value: null,
        evidenceIds: [],
        confidence: "none",
        verifiedDate: null,
        applicability: "n/a",
        reason: "no manual has been identified for this model, so it has no document number or revision to record",
        publishable: false,
      },
    };
  }

  if (idValue !== null && observations.length === 0) {
    const url = identitySourceUrl(v!, spec.field);
    const src = url ? sourceByUrl(sources, url) : undefined;
    if (src) {
      const e = makeEvidence(base, idValue, src, v!.checkedOn, "all", 1);
      evidence.push(e);
      return {
        evidence,
        field: {
          ...base,
          state: "populated",
          value: idValue,
          evidenceIds: [e.id],
          confidence: e.confidence,
          verifiedDate: v!.checkedOn,
          applicability: "all",
          reason: `established from ${src.publisher} on ${v!.checkedOn}`,
          publishable: true,
        },
      };
    }
  }

  /* 3. Observed values. */
  if (observations.length > 0) {
    const withSource = observations
      .map((o) => ({ o, src: sourceByUrl(sources, o.sourceUrl) }))
      .filter((x): x is { o: Observation; src: SourceRef } => Boolean(x.src))
      .sort((x, y) => SOURCE_PRIORITY[x.src.type] - SOURCE_PRIORITY[y.src.type]);

    withSource.forEach(({ o, src }, i) => {
      evidence.push(makeEvidence(base, o.value, src, o.observedOn, o.applicability ?? "all", i + 1, o.note));
    });

    // A declared bound is recorded as evidence but never competes for the field
    // — provided the figure that DOES win falls inside it. The check runs
    // below; a bound that the winner breaks, or that will not parse, is demoted
    // back to an ordinary rival value so the field conflicts as it should.
    const declaredBounds = withSource.filter((x) => x.o.role === "bound_supporting");
    const figures = withSource.filter((x) => x.o.role !== "bound_supporting");
    const candidate = figures[0];
    const boundsHold =
      candidate !== undefined && declaredBounds.every((b) => satisfiesBound(b.o.value, candidate.o.value));
    const bounds = boundsHold ? declaredBounds : [];
    const contenders = boundsHold ? figures : withSource;

    const top = contenders[0];
    const evidenceIds = evidence.map((e) => e.id);
    const disagrees = contenders.some((x) => !valuesAgree(x.o.value, top.o.value));

    // Bounds are corroboration, so they are marked as agreeing rather than left
    // looking like unresolved competing values on the review surface.
    for (const b of bounds) {
      const e = evidence.find((x) => x.sourceId === b.src.id && x.storedValue === b.o.value);
      if (e) e.conflictStatus = "resolved";
    }

    // Two sources, two different values for the same field.
    if (disagrees) {
      const topRank = SOURCE_PRIORITY[top.src.type];
      const tie = contenders.filter((x) => SOURCE_PRIORITY[x.src.type] === topRank).length > 1;
      const conflict: ConflictEntry = {
        productId: p.productId,
        field: spec.field,
        // Only the rival figures are listed. A bound that the winner satisfies
        // is corroboration and does not belong in a list of disputed values.
        values: contenders.map((x) => ({
          value: x.o.value,
          sourceId: x.src.id,
          sourceType: x.src.type,
          publisher: x.src.publisher,
          url: x.src.url,
        })),
        resolvedTo: tie ? null : top.o.value,
        resolutionRule: tie
          ? "sources of equal authority disagree — no automatic resolution is possible"
          : `highest-authority source wins (${top.src.type})`,
        suppressed: tie,
      };
      for (const e of evidence) e.conflictStatus = tie ? "conflicting" : "resolved";
      if (tie) {
        return {
          evidence,
          conflict,
          field: {
            ...base,
            state: "conflicting",
            value: null,
            evidenceIds,
            confidence: "none",
            verifiedDate: v?.checkedOn ?? null,
            applicability: "all",
            reason: conflict.resolutionRule,
            publishable: false,
          },
        };
      }
      const boundValues = new Set(bounds.map((b) => b.o.value));
      for (const e of evidence) {
        if (e.storedValue !== top.o.value && !boundValues.has(e.storedValue as string | number)) e.superseded = true;
      }
      return {
        evidence,
        conflict,
        field: {
          ...base,
          state: "populated",
          value: top.o.value,
          evidenceIds,
          confidence: confidenceFor(top.src.type, true),
          verifiedDate: top.o.observedOn,
          applicability: top.o.applicability ?? "all",
          reason: conflict.resolutionRule,
          publishable: true,
        },
      };
    }

    // Agreement across two or more sources raises nothing above "high", but it
    // is recorded so the review surface can show corroboration.
    const corroborated = withSource.length > 1;
    const boundNote = bounds.length
      ? ` Also stated as a ceiling by ${bounds.length === 1 ? "one source" : `${bounds.length} sources`}, which this figure falls inside.`
      : "";

    // A stored value that the source contradicts: the source wins, the stored
    // value is retained on the record and flagged as needing correction.
    if (rec?.outcome === "conflicts") {
      const unresolvable = rec.unresolved === true;
      const conflict: ConflictEntry = {
        productId: p.productId,
        field: spec.field,
        values: [
          { value: top.o.value, sourceId: top.src.id, sourceType: top.src.type, publisher: top.src.publisher, url: top.src.url },
          { value: stored ?? "(none)", sourceId: "stored", sourceType: "editorial_research", publisher: "BotPlanet editorial record (pre-verification)", url: "" },
        ],
        resolvedTo: unresolvable ? null : top.o.value,
        resolutionRule: unresolvable
          ? "the live source's own figure is not credible — held for human resolution"
          : "manufacturer source outranks the stored editorial value",
        suppressed: unresolvable,
      };
      for (const e of evidence) e.conflictStatus = unresolvable ? "conflicting" : "resolved";
      return {
        evidence,
        conflict,
        field: {
          ...base,
          state: unresolvable ? "conflicting" : "populated",
          value: unresolvable ? null : top.o.value,
          evidenceIds,
          confidence: unresolvable ? "none" : confidenceFor(top.src.type, true),
          verifiedDate: top.o.observedOn,
          applicability: top.o.applicability ?? "all",
          reason: rec.note,
          publishable: !unresolvable,
        },
      };
    }

    // A stored value derived from a range: publish the range, drop the derivation.
    const reason =
      rec?.outcome === "derived_from_range"
        ? rec.note
        : rec?.unverifiedDetail
          ? `${rec.note} Unverified in the stored wording: ${rec.unverifiedDetail}`
          : corroborated
            ? `stated by ${withSource.length} independent sources, read ${top.o.observedOn}.${boundNote}`.trimEnd()
            : `stated by ${top.src.publisher}, read ${top.o.observedOn}.${boundNote}`.trimEnd();

    return {
      evidence,
      field: {
        ...base,
        state: "populated",
        value: top.o.value,
        evidenceIds,
        confidence: confidenceFor(top.src.type, true),
        verifiedDate: top.o.observedOn,
        applicability: top.o.applicability ?? "all",
        reason,
        publishable: true,
      },
    };
  }

  /* 4. No observation. Was it looked for? */
  const ns = notStated.get(spec.field);
  if (ns) {
    // A stored value we are now withholding is a stronger statement than a
    // field that was always empty, and the two are reported separately.
    const suppressing = stored !== null && stored !== "";
    return {
      evidence,
      field: {
        ...base,
        state: suppressing ? "suppressed" : "not_publicly_stated",
        value: null,
        evidenceIds: [],
        confidence: "none",
        verifiedDate: v?.checkedOn ?? null,
        applicability: "all",
        reason: suppressing
          ? `${rec?.note ?? "stored value has no source."} Checked: ${ns.checked.length} source(s). ${ns.note}`
          : `${ns.note} Checked ${ns.checked.length} source(s) on ${v?.checkedOn}.`,
        publishable: false,
      },
    };
  }

  /* 5. A stored value with no observation and no explicit not-stated record. */
  if (stored !== null && stored !== "") {
    const suppressed = rec && rec.outcome !== "agrees" && rec.outcome !== "agrees_rounded";
    return {
      evidence,
      field: {
        ...base,
        state: suppressed ? "suppressed" : "pending_verification",
        value: null,
        evidenceIds: [],
        confidence: "none",
        verifiedDate: null,
        applicability: "all",
        reason: rec?.note ?? "held from the original research pass and not re-checked against a live source",
        publishable: false,
      },
    };
  }

  /* 6. Nothing stored, nothing observed, nobody looked. */
  return {
    evidence,
    field: {
      ...base,
      state: "unknown",
      value: null,
      evidenceIds: [],
      confidence: "none",
      verifiedDate: null,
      applicability: "all",
      reason: "no value held and the official sources were not checked for this field",
      publishable: false,
    },
  };
}

/**
 * Evidence IDs must be deterministic: a claim generated in one process has to
 * reference the same ID the ledger produces in another. The index is therefore
 * the position within THIS field's evidence list, never a global counter.
 */
function makeEvidence(
  base: { productId: string; field: string; group: FieldGroup; storedValue: string | number | null; cadence: EvidenceRecord["cadence"] },
  value: string | number,
  src: SourceRef,
  observedOn: string,
  applicability: string,
  index: number,
  note?: string,
): EvidenceRecord {
  const interpreted = typeof value === "string" ? interpretMeasurement(value) : null;
  const n = interpreted ? normalise(interpreted.value, interpreted.unit) : null;
  return {
    id: `ev-${base.productId}-${base.field}-${index}`,
    productId: base.productId,
    field: base.field,
    group: base.group,
    storedValue: value,
    normalizedValue: n ? n.value : null,
    normalizedUnit: n ? n.unit : null,
    conversionMethod: n ? n.method : null,
    sourceId: src.id,
    label: labelFor(src.type),
    confidence: confidenceFor(src.type, true),
    retrievedDate: observedOn,
    verifiedDate: observedOn,
    cadence: base.cadence,
    market: MARKET,
    applicability,
    conflictStatus: "none",
    superseded: false,
    notes: note,
  };
}
