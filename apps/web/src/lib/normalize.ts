/**
 * Unit normalisation.
 *
 * RULES THIS ENFORCES
 *  - one canonical internal unit per dimension (mm, g, minutes);
 *  - the sourced value and its original unit are never overwritten;
 *  - the conversion method is recorded so any figure can be audited;
 *  - conversions do not invent precision the source never had.
 */

/** Significant figures in the source, used to avoid false precision. */
export function significantDecimals(value: number): number {
  const s = String(value);
  const dot = s.indexOf(".");
  return dot === -1 ? 0 : s.length - dot - 1;
}

/** Round to at most the precision the source expressed. */
export function roundLike(converted: number, source: number): number {
  const dp = significantDecimals(source);
  // A source given as a whole number must not gain decimals through conversion.
  const factor = 10 ** dp;
  return Math.round(converted * factor) / factor;
}

export interface Normalised {
  value: number;
  unit: string;
  method: string;
}

const LENGTH_TO_MM: Record<string, number> = { mm: 1, cm: 10, m: 1000, in: 25.4, ft: 304.8 };
const MASS_TO_G: Record<string, number> = { g: 1, kg: 1000, lb: 453.59237, oz: 28.349523125 };
const TIME_TO_MIN: Record<string, number> = { min: 1, minutes: 1, h: 60, hr: 60, hrs: 60, hours: 60 };

export function normaliseLength(value: number, unit: string): Normalised | null {
  const f = LENGTH_TO_MM[unit.toLowerCase()];
  if (f == null || !Number.isFinite(value)) return null;
  return { value: Math.round(value * f), unit: "mm", method: `${value} ${unit} x ${f} -> mm (rounded to whole mm)` };
}

export function normaliseMass(value: number, unit: string): Normalised | null {
  const f = MASS_TO_G[unit.toLowerCase()];
  if (f == null || !Number.isFinite(value)) return null;
  return { value: Math.round(value * f), unit: "g", method: `${value} ${unit} x ${f} -> g (rounded to whole g)` };
}

export function normaliseDuration(value: number, unit: string): Normalised | null {
  const f = TIME_TO_MIN[unit.toLowerCase()];
  if (f == null || !Number.isFinite(value)) return null;
  return { value: Math.round(value * f), unit: "minutes", method: `${value} ${unit} x ${f} -> minutes` };
}

/** Display helpers: canonical value back to the unit a US reader expects. */
export function gramsToPoundsDisplay(grams: number, sourceValue: number): number {
  return roundLike(grams / MASS_TO_G.lb, sourceValue);
}

export function mmToFeetDisplay(mm: number, sourceValue: number): number {
  return roundLike(mm / LENGTH_TO_MM.ft, sourceValue);
}
