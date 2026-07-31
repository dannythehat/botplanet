/**
 * Derives the field-level evidence ledger from the existing editorial records.
 *
 * WHY DERIVE RATHER THAN RETYPE: product identity already lives in one place.
 * Copying ten products' specifications into a second hand-maintained file would
 * create exactly the drift this job exists to prevent. Instead every populated
 * editorial field becomes an evidence record whose label and confidence are
 * decided by the authority of the source that product cites.
 *
 * HONESTY BOUNDARY: this reclassifies and audits values that were researched on
 * the recorded research date. It does not re-verify them against the live
 * source — so `verifiedDate` stays null until a human or a fetch job confirms
 * the value, and every such record reads as unverified in the report. A null
 * field produces no evidence at all; it is reported as a gap, never guessed.
 */
import { PRODUCTS, type ProductEditorial } from "../products";
import { classifySource, isDocument } from "./sources";
import {
  type Confidence,
  type EvidenceLabel,
  type EvidenceRecord,
  type FieldGroup,
  type RefreshCadence,
  type SourceRef,
  type SourceType,
  SOURCE_PRIORITY,
} from "./types";
import { normaliseDuration, normaliseLength, normaliseMass } from "../../lib/normalize";

const MARKET = "us";

/** Which group and cadence each editorial field belongs to. */
interface FieldSpec {
  field: string;
  group: FieldGroup;
  cadence: RefreshCadence;
  /** Reads the raw value off the editorial record. */
  read: (p: ProductEditorial) => string | number | null;
  /** Optional unit of the stored value, for normalisation. */
  unit?: "ft" | "lb" | "min" | "hr";
}

/**
 * The evidence-controlled field set. Deliberately limited to fields the current
 * records actually hold: inventing rows for fields nobody has sourced would
 * make completeness look worse or better than it is, depending on the
 * denominator, without adding truth. Fields the launch data does not yet cover
 * (battery capacity, micron rating, dimensions, filter capacity …) are reported
 * as unpopulated groups rather than as fake empty records.
 */
export const FIELD_SPECS: FieldSpec[] = [
  { field: "brand", group: "identity", cadence: "annual", read: (p) => p.slug.split("-")[0] },
  { field: "canonicalName", group: "identity", cadence: "annual", read: (p) => p.slug },
  { field: "poolSizeSuitability", group: "pool_suitability", cadence: "six_monthly", read: (p) => p.specs.poolSizeSuitability },
  { field: "cableLengthFt", group: "power_operation", cadence: "six_monthly", read: (p) => p.specs.cableLengthFt, unit: "ft" },
  { field: "runtimeMins", group: "power_operation", cadence: "six_monthly", read: (p) => p.specs.runtimeMins, unit: "min" },
  { field: "chargeTimeHrs", group: "power_operation", cadence: "six_monthly", read: (p) => p.specs.chargeTimeHrs, unit: "hr" },
  { field: "filtration", group: "cleaning_coverage", cadence: "six_monthly", read: (p) => p.specs.filtration },
  { field: "navigation", group: "cleaning_coverage", cadence: "six_monthly", read: (p) => p.specs.navigation },
  { field: "weightLbs", group: "physical", cadence: "six_monthly", read: (p) => p.specs.weightLbs, unit: "lb" },
  { field: "warranty", group: "warranty_support", cadence: "quarterly", read: (p) => p.specs.warranty },
  { field: "appSupport", group: "connectivity", cadence: "quarterly", read: (p) => p.specs.appSupport },
];

/** Every field group the model tracks, including ones with no data yet. */
export const ALL_GROUPS: FieldGroup[] = [
  "identity",
  "power_operation",
  "pool_suitability",
  "cleaning_coverage",
  "physical",
  "connectivity",
  "warranty_support",
];

const labelFor = (type: SourceType): EvidenceLabel => {
  switch (type) {
    case "manufacturer_document":
      return "manual_verified";
    case "manufacturer_page":
      return "manufacturer_stated";
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
 * unverified can reach "high" — that grade is reserved for a value someone has
 * checked against the source since it was recorded.
 */
const confidenceFor = (type: SourceType, verified: boolean): Confidence => {
  const base: Confidence =
    type === "manufacturer_document" || type === "manufacturer_page"
      ? "high"
      : type === "retailer_api"
        ? "high"
        : type === "retailer_listing"
          ? "medium"
          : "low";
  if (!verified && base === "high") return "medium";
  return base;
};

/** Build the source registry from every URL the editorial records cite. */
export function buildSources(): SourceRef[] {
  const out = new Map<string, SourceRef>();
  for (const p of Object.values(PRODUCTS)) {
    for (const s of p.sources) {
      if (out.has(s.url)) continue;
      const c = classifySource(s.url);
      out.set(s.url, {
        id: `src-${out.size + 1}`,
        type: isDocument(s.url) && c.type === "manufacturer_page" ? "manufacturer_document" : c.type,
        url: s.url,
        title: s.label,
        publisher: c.publisher,
      });
    }
  }
  return [...out.values()];
}

/** The highest-authority source a product cites, used to attribute its fields. */
export function primarySourceFor(p: ProductEditorial, sources: SourceRef[]): SourceRef | null {
  const mine = p.sources
    .map((s) => sources.find((x) => x.url === s.url))
    .filter((x): x is SourceRef => Boolean(x))
    .sort((a, b) => SOURCE_PRIORITY[a.type] - SOURCE_PRIORITY[b.type]);
  return mine[0] ?? null;
}

function normalise(value: number, unit: FieldSpec["unit"]) {
  if (unit === "ft") return normaliseLength(value, "ft");
  if (unit === "lb") return normaliseMass(value, "lb");
  if (unit === "min") return normaliseDuration(value, "min");
  if (unit === "hr") return normaliseDuration(value, "hr");
  return null;
}

export interface DerivedLedger {
  sources: SourceRef[];
  evidence: EvidenceRecord[];
  /** Fields with no value at all: reported honestly as gaps. */
  gaps: { productId: string; field: string; group: FieldGroup }[];
}

export function deriveLedger(): DerivedLedger {
  const sources = buildSources();
  const evidence: EvidenceRecord[] = [];
  const gaps: DerivedLedger["gaps"] = [];

  for (const p of Object.values(PRODUCTS)) {
    const src = primarySourceFor(p, sources);
    for (const spec of FIELD_SPECS) {
      const raw = spec.read(p);
      if (raw === null || raw === undefined || raw === "") {
        gaps.push({ productId: p.productId, field: spec.field, group: spec.group });
        continue;
      }
      if (!src) {
        gaps.push({ productId: p.productId, field: spec.field, group: spec.group });
        continue;
      }
      const n = typeof raw === "number" ? normalise(raw, spec.unit) : null;
      evidence.push({
        id: `ev-${p.productId}-${spec.field}`,
        productId: p.productId,
        field: spec.field,
        group: spec.group,
        storedValue: raw,
        normalizedValue: n ? n.value : null,
        normalizedUnit: n ? n.unit : null,
        conversionMethod: n ? n.method : null,
        sourceId: src.id,
        label: labelFor(src.type),
        // No value has been re-checked against its source since the original
        // research pass, so nothing here is graded "high".
        confidence: confidenceFor(src.type, false),
        retrievedDate: p.researchedDate,
        verifiedDate: null,
        cadence: spec.cadence,
        market: MARKET,
        applicability: "all",
        conflictStatus: "none",
        superseded: false,
      });
    }
  }

  return { sources, evidence, gaps };
}
