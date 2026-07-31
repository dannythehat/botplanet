/**
 * Warranty status wording.
 *
 * Four of the ten launch manufacturers publish no warranty term at all. There
 * are three wrong ways to handle that and one right one:
 *
 *   wrong  "no warranty"                  — asserts a fact nobody stated
 *   wrong  a retailer's warranty claim     — a seller's terms are not the maker's
 *   wrong  the stored historic term        — unsourced, and the reason Job 8 was rejected
 *   right  "Manufacturer warranty term not confirmed"
 *
 * The approved sentence lives here once. Page code asks for a status; it never
 * writes the sentence itself, so the wording cannot drift across surfaces and a
 * single test can prove no forbidden phrasing exists anywhere.
 */
import type { FieldRecord } from "../content/evidence/types";

/** The only approved wording for an unconfirmed warranty term. */
export const WARRANTY_NOT_CONFIRMED = "Manufacturer warranty term not confirmed";

/**
 * Phrasings that must never appear on a public surface. Each asserts something
 * no source supports, or promotes a seller's terms to the manufacturer's.
 */
export const FORBIDDEN_WARRANTY_WORDINGS: RegExp[] = [
  /\bno warranty\b/i,
  /\bwarranty unavailable\b/i,
  /\bdoes(?:n't| not) (?:offer|include|come with) a warranty\b/i,
  /\bwithout (?:a )?warranty\b/i,
  /\bwarranty:\s*none\b/i,
  /\bunwarranted product\b/i,
];

export type WarrantyStatus = "confirmed" | "not_confirmed";

export interface WarrantyStatement {
  status: WarrantyStatus;
  /** What a public surface may print. Never empty. */
  text: string;
  /** Who stated it, when confirmed. */
  attribution: string | null;
  /** Why it is unconfirmed, for the internal review surface only. */
  internalReason: string | null;
}

/**
 * Turns a warranty field record into public wording.
 *
 * A term is "confirmed" only when the field is publishable — meaning a named
 * manufacturer source states it and nothing of equal or higher authority
 * disagrees. Suppressed, conflicting and not-publicly-stated all produce the
 * same public sentence, because the public distinction between "we had a
 * number and dropped it" and "nobody published one" is meaningless to a reader
 * and misleading either way.
 */
export function warrantyStatement(
  field: FieldRecord | undefined,
  publisher?: string | null,
  /** True only when the winning source is the manufacturer's own page or manual. */
  manufacturerSourced = false,
): WarrantyStatement {
  // A dealer's warranty offer is the dealer's, not the maker's. It may be shown
  // beside the offer, but it can never become the product's canonical term.
  if (field && field.publishable && field.value !== null && manufacturerSourced) {
    return {
      status: "confirmed",
      text: publisher ? `${publisher} states a warranty of ${field.value}.` : String(field.value),
      attribution: publisher ?? null,
      internalReason: null,
    };
  }
  if (field && field.publishable && field.value !== null && !manufacturerSourced) {
    return {
      status: "not_confirmed",
      text: WARRANTY_NOT_CONFIRMED,
      attribution: null,
      internalReason: `a warranty term is published by ${publisher ?? "a non-manufacturer source"}, but a dealer's terms are not the manufacturer's and are not promoted to the product's canonical warranty`,
    };
  }
  return {
    status: "not_confirmed",
    text: WARRANTY_NOT_CONFIRMED,
    attribution: null,
    internalReason: field?.reason ?? "no warranty field record exists for this product",
  };
}

/** True when a piece of copy contains a phrasing that is never allowed. */
export function hasForbiddenWarrantyWording(text: string): RegExp | null {
  return FORBIDDEN_WARRANTY_WORDINGS.find((re) => re.test(text)) ?? null;
}
