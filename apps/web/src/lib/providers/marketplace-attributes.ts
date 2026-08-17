/**
 * Seller-entered Amazon specifications, quarantined.
 *
 * Amazon's specification table is typed in by whoever created the listing. For
 * the Polaris FREEDOM it says `charging_time: 4.5 hours` and
 * `manufacturer_warranty_description: 2-Year`. Both CONTRADICT the approved
 * Job 8 record, which holds 4 hours from Polaris-authored A+ content and
 * "Manufacturer warranty term not confirmed" because Polaris publishes no term
 * on its own estate.
 *
 * If those values were allowed into the ledger they would look like
 * corroboration and quietly overturn a ruling. So the rule, per the Job 10
 * decision:
 *
 *   A marketplace attribute MAY   flag a possible conflict
 *   A marketplace attribute MAY   trigger a human review
 *   A marketplace attribute MAY   act as weak corroboration of a field that
 *                                 already has manufacturer evidence
 *
 *   A marketplace attribute MAY NOT overwrite manufacturer evidence
 *   A marketplace attribute MAY NOT populate a suppressed field on its own
 *   A marketplace attribute MAY NOT change warranty truth
 *   A marketplace attribute MAY NOT change an approved specification
 *
 * The asymmetry is the point. These attributes are good enough to make us look
 * again and never good enough to publish, which is exactly the weight a
 * stranger's data entry deserves.
 */
import type { MarketplaceAttributes } from "./amazon-provider";

/** What a marketplace attribute is allowed to do to a field. */
export type AttributeEffect =
  /** The ledger has manufacturer evidence and the attribute agrees. */
  | "weak_corroboration"
  /** The ledger has manufacturer evidence and the attribute disagrees. */
  | "conflict_flagged_for_review"
  /** The field is suppressed and stays suppressed — this cannot populate it. */
  | "insufficient_to_populate"
  /** Nothing in the ledger to compare against and nothing it may do. */
  | "recorded_only";

export interface AttributeSignal {
  productId: string;
  asin: string;
  /** The Job 8 field this attribute would bear on, where one matches. */
  field: string | null;
  /** The attribute key exactly as Amazon keyed it. */
  attributeKey: string;
  /** The value exactly as the seller typed it. */
  attributeValue: string;
  effect: AttributeEffect;
  /** True whenever a person needs to look. */
  needsReview: boolean;
  note: string;
}

/** Amazon attribute keys that bear on a Job 8 field. Anything else is noise. */
const FIELD_MAP: Record<string, string> = {
  charging_time: "chargeTimeHrs",
  manufacturer_warranty_description: "warranty",
  warranty_type: "warranty",
  capacity: "filterCapacityL",
  item_weight: "weightLbs",
  item_dimensions_l_x_w_x_h: "dimensions",
  control_method: "appSupport",
  power_source: "powerType",
};

/**
 * Fields where a marketplace attribute may never be more than a flag, whatever
 * the ledger says. Warranty is here because a wrong warranty term is a
 * consumer-harm claim, not a spec quibble.
 */
const NEVER_AUTHORITATIVE = new Set(["warranty"]);

const norm = (s: string): string => s.toLowerCase().replace(/[^a-z0-9.]+/g, " ").trim();

/** Loose agreement: enough to call it corroboration, never enough to publish. */
export function attributeAgrees(attributeValue: string, ledgerValue: string | number | null): boolean {
  if (ledgerValue === null) return false;
  const a = norm(String(attributeValue));
  const b = norm(String(ledgerValue));
  if (a === b) return true;
  const na = a.match(/\d+(?:\.\d+)?/);
  const nb = b.match(/\d+(?:\.\d+)?/);
  return Boolean(na && nb && Number(na[0]) === Number(nb[0]));
}

/**
 * Turn a provider's attribute table into signals.
 *
 * `ledger` supplies the current Job 8 value for a field, and whether that value
 * is currently publishable. A suppressed field passes `null` — and stays
 * suppressed, because a seller's typing is not evidence.
 */
export function attributeSignals(
  productId: string,
  asin: string,
  attributes: MarketplaceAttributes,
  ledger: (field: string) => { value: string | number | null; hasManufacturerEvidence: boolean },
): AttributeSignal[] {
  const out: AttributeSignal[] = [];
  for (const [key, value] of Object.entries(attributes.other)) {
    const field = FIELD_MAP[key] ?? null;
    const base = { productId, asin, field, attributeKey: key, attributeValue: value };

    if (!field) {
      out.push({ ...base, effect: "recorded_only", needsReview: false, note: "No Job 8 field corresponds to this attribute." });
      continue;
    }
    const { value: ledgerValue, hasManufacturerEvidence } = ledger(field);

    if (!hasManufacturerEvidence || ledgerValue === null) {
      out.push({
        ...base,
        effect: "insufficient_to_populate",
        needsReview: false,
        note: `${field} is not populated from a manufacturer source. A seller-entered attribute cannot populate it — the field stays as it is.`,
      });
      continue;
    }
    if (attributeAgrees(value, ledgerValue)) {
      out.push({
        ...base,
        effect: NEVER_AUTHORITATIVE.has(field) ? "recorded_only" : "weak_corroboration",
        needsReview: false,
        note: `Agrees with the ledger value (${ledgerValue}). Recorded as weak support; the manufacturer source remains the published one.`,
      });
      continue;
    }
    out.push({
      ...base,
      effect: "conflict_flagged_for_review",
      needsReview: true,
      note: `Disagrees with the ledger value (${ledgerValue}). The ledger is unchanged and a person must decide; a seller's data entry never overturns manufacturer evidence.`,
    });
  }
  return out;
}

/** Nothing here may ever be written to the evidence ledger. Asserted by test. */
export const MARKETPLACE_ATTRIBUTES_ARE_NOT_EVIDENCE = true;
