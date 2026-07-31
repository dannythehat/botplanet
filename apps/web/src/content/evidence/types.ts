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

/**
 * What we actually know about a field, for one product.
 *
 * These are deliberately seven distinct states rather than "has a value / does
 * not". "We never looked", "we looked and the manufacturer does not publish it"
 * and "two sources disagree so we are withholding it" are three different facts
 * with three different consequences, and collapsing them into `null` is how a
 * catalogue starts lying by omission.
 */
export type FieldState =
  /** A live source states it and nothing contradicts it. */
  | "populated"
  /** No value, and the official sources have not been checked for it. */
  | "unknown"
  /** The field cannot apply to this product (e.g. cable length on a cordless unit). */
  | "not_applicable"
  /** Official sources were checked and none publishes this value. */
  | "not_publicly_stated"
  /** Two or more sources give incompatible values. */
  | "conflicting"
  /** A stored value exists but is withheld from publication (unsupported or unresolved conflict). */
  | "suppressed"
  /** A value exists but has not been re-checked against its source since it was recorded. */
  | "pending_verification";

/** States a field may be published from. Everything else is internal only. */
export const PUBLISHABLE_STATES: FieldState[] = ["populated"];

/**
 * Publication readiness, separated into the seven things that were previously
 * squashed into one `publicationSafe` boolean. A product can be structurally
 * valid and still unfit for a comparison table; the surfaces need to know which.
 */
export interface PublicationStates {
  /** IDs, slugs and references resolve; no schema errors. */
  structurallyValid: boolean;
  /** Every published field traces to a source. */
  factuallyEvidenced: boolean;
  /** Those sources were re-checked within their cadence. */
  currentlyVerified: boolean;
  /** Safe to state individual facts, with attribution, on a product page. */
  safeForLimitedFactualUse: boolean;
  /** Enough verified substance to write a review around. */
  readyForReviewWriting: boolean;
  /** Enough shared verified fields to sit in a like-for-like comparison. */
  readyForComparison: boolean;
  /** The fields BotMatch filters on are verified and unambiguous. */
  readyForBotMatch: boolean;
}

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

/** One field of one product, with its state and everything backing it. */
export interface FieldRecord {
  productId: string;
  field: string;
  group: FieldGroup;
  state: FieldState;
  /** Weight from the field registry, for weighted completeness. */
  weight: number;
  /** The value BotPlanet holds, verbatim from the winning source. */
  value: string | number | null;
  /** The value the editorial record held before this verification pass. */
  storedValue: string | number | null;
  /** Every evidence record for this field, highest authority first. */
  evidenceIds: string[];
  confidence: Confidence;
  verifiedDate: string | null;
  cadence: RefreshCadence;
  applicability: string;
  /** Why the field is in this state, in one sentence. */
  reason: string;
  /** May this field's value appear on a public surface? */
  publishable: boolean;
}

/** Two sources, one field, two incompatible values. */
export interface ConflictEntry {
  productId: string;
  field: string;
  values: { value: string | number; sourceId: string; sourceType: SourceType; publisher: string; url: string }[];
  /** Which value wins, or null when the conflict is unresolved. */
  resolvedTo: string | number | null;
  resolutionRule: string;
  /** True when no value may be published until a human decides. */
  suppressed: boolean;
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
