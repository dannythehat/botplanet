/**
 * Deterministic aggregation key for `revenue_daily`.
 *
 * SQLite treats NULLs as distinct, so a unique index over nullable dimension
 * columns can't prevent duplicate aggregate rows. Instead, every aggregate row
 * carries a non-null `aggregation_key` built from the normalised dimensions,
 * using the sentinel `"all"` for any dimension intentionally rolled up. That key
 * is UNIQUE and is the safe upsert / rebuild handle.
 */
export const AGG_ALL = "all";

export interface RevenueDimensions {
  date: string; // yyyy-mm-dd
  market?: string | null;
  category?: string | null;
  brand?: string | null;
  product?: string | null;
  retailer?: string | null;
  program?: string | null;
}

/** Normalise a dimension: a present id stays as-is, absent → the "all" sentinel. */
function norm(v?: string | null): string {
  return v && v.trim() ? v.trim() : AGG_ALL;
}

/**
 * Build the deterministic key. Order is fixed (date, market, category, brand,
 * product, retailer, programme) so the same grain always yields the same key.
 */
export function revenueAggregationKey(d: RevenueDimensions): string {
  return [
    d.date,
    norm(d.market),
    norm(d.category),
    norm(d.brand),
    norm(d.product),
    norm(d.retailer),
    norm(d.program),
  ].join("|");
}
