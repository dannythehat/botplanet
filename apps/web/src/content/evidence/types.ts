/**
 * Evidence and claim model — types and vocabularies.
 *
 * The principle this encodes: a product does not have "a source". Each FIELD
 * has its own evidence, its own confidence and its own freshness. A model can
 * have a manufacturer-verified weight and no reliable runtime figure at the
 * same time, and the system must be able to say so.
 *
 * Nothing here stores commercial terms. Commission, offers, stock and shipping
 * are deliberately absent so they cannot leak into a factual claim.
 */

/** Where a value came from, in the source hierarchy's order of authority. */
export type SourceType =
  | "manufacturer_page" // 1. official product page
  | "manufacturer_document" // 2. manual, spec sheet, support document
  | "retailer_api" // 3. approved retailer/affiliate API
  | "retailer_listing" // 4. attributable retailer listing
  | "editorial_research"; // 5. independent research, labelled as such

/** Authority ranking used to resolve conflicts. Lower number wins. */
export const SOURCE_PRIORITY: Record<SourceType, number> = {
  manufacturer_document: 1,
  manufacturer_page: 2,
  retailer_api: 3,
  retailer_listing: 4,
  editorial_research: 5,
};

/** What kind of backing a stored value actually has. */
export type EvidenceLabel =
  | "manufacturer_stated"
  | "manual_verified"
  | "retailer_stated"
  | "api_supplied"
  | "calculated_from_sourced_values"
  | "researched_interpretation"
  | "unknown"
  | "conflicting";

export type Confidence = "high" | "medium" | "low" | "none";

/** How often a field must be re-checked before it is treated as stale. */
export type RefreshCadence = "monthly" | "quarterly" | "six_monthly" | "annual";

export const CADENCE_DAYS: Record<RefreshCadence, number> = {
  monthly: 31,
  quarterly: 92,
  six_monthly: 183,
  annual: 366,
};

/** Field groups, so completeness can be reported per concern, not as one blob. */
export type FieldGroup =
  | "identity"
  | "power_operation"
  | "pool_suitability"
  | "cleaning_coverage"
  | "physical"
  | "connectivity"
  | "warranty_support";

export interface SourceRef {
  id: string;
  type: SourceType;
  url: string;
  title: string;
  publisher: string;
}

/** One field, one source, one point in time. */
export interface EvidenceRecord {
  id: string;
  /** Stable product ID — never the slug. */
  productId: string;
  field: string;
  group: FieldGroup;
  /** Exactly as the source words it, including its unit. Never overwritten. */
  storedValue: string | number | boolean | null;
  /** Canonical internal value, if the field is normalisable. */
  normalizedValue: number | null;
  /** Canonical unit for normalizedValue, e.g. "mm" | "g" | "minutes". */
  normalizedUnit: string | null;
  /** How the conversion was performed, so it can be audited or reversed. */
  conversionMethod: string | null;
  sourceId: string;
  label: EvidenceLabel;
  confidence: Confidence;
  /** ISO date the value was taken from the source. */
  retrievedDate: string;
  /** ISO date the value was last re-checked against the source, or null. */
  verifiedDate: string | null;
  cadence: RefreshCadence;
  market: string;
  /** Which product variants/markets this applies to; "all" when unrestricted. */
  applicability: string;
  conflictStatus: "none" | "conflicting" | "resolved";
  /** Why this source won, when a conflict was resolved. */
  resolutionNote?: string;
  superseded: boolean;
  notes?: string;
}

/** How a public statement relates to evidence. */
export type ClaimClass =
  | "direct_specification"
  | "commercial_observation"
  | "calculated_value"
  | "editorial_interpretation"
  | "suitability_statement"
  | "comparative_statement"
  | "tested_observation"
  | "prohibited_unsupported";

/** Where a claim may appear. */
export type PublicContext =
  | "product_page"
  | "category_page"
  | "comparison"
  | "botmatch"
  | "guide"
  | "metadata"
  | "structured_data";

export interface ClaimRecord {
  id: string;
  productId: string;
  claimText: string;
  claimClass: ClaimClass;
  /** Evidence records that support it. Empty means it cannot be published. */
  evidenceIds: string[];
  confidence: Confidence;
  allowedContexts: PublicContext[];
  prohibitedContexts?: PublicContext[];
  freshnessRequirement: RefreshCadence;
  reviewerStatus: "unreviewed" | "reviewed" | "rejected";
  notes?: string;
}

/** A claim class that may never be published without genuine testing evidence. */
export const PROHIBITED_WITHOUT_TESTING: ClaimClass[] = ["tested_observation"];
