import type { OfferCandidate, OfferRankingResult, OfferTolerances } from "./types.js";

/**
 * Rank a chosen product's offers for a customer.
 *
 * Order of consideration (commission-free):
 *   1. total delivered price (asc)
 *   2. delivery speed (asc)
 *   3. warranty strength (desc)
 *   4. data freshness (desc)
 *
 * ONLY when the top offers are "equivalent" within the configured tolerances may
 * affiliate commission act as the final tie-break. Commission can never override
 * a genuinely better offer.
 */
export function rankOffers(
  offers: OfferCandidate[],
  tolerances: OfferTolerances,
): OfferRankingResult {
  const approved = offers.filter((o) => o.approved);
  if (approved.length === 0) {
    return { productId: offers[0]?.productId ?? "", winner: null, ranked: [], tieBreakUsed: false };
  }

  // Primary ordering ignores commission entirely.
  const byCustomerValue = [...approved].sort(compareByCustomerValue);
  const best = byCustomerValue[0]!;

  // Which offers are practically equivalent to the best?
  const equivalents = byCustomerValue.filter((o) => equivalent(best, o, tolerances));

  let winner = best;
  let tieBreakUsed = false;
  if (equivalents.length > 1) {
    // Final tie-break: highest commission among equivalents.
    const byCommission = [...equivalents].sort(
      (a, b) => (b.commissionValueBp ?? -1) - (a.commissionValueBp ?? -1),
    );
    const top = byCommission[0]!;
    if (top.offerId !== best.offerId) {
      winner = top;
      tieBreakUsed = true;
    }
  }

  // Final ranked list: winner first, then the rest in customer-value order.
  const ranked = [winner, ...byCustomerValue.filter((o) => o.offerId !== winner.offerId)];
  return { productId: best.productId, winner, ranked, tieBreakUsed };
}

function compareByCustomerValue(a: OfferCandidate, b: OfferCandidate): number {
  const pa = a.totalPriceMinor ?? Number.MAX_SAFE_INTEGER;
  const pb = b.totalPriceMinor ?? Number.MAX_SAFE_INTEGER;
  if (pa !== pb) return pa - pb;
  const da = a.deliveryMaxDays ?? Number.MAX_SAFE_INTEGER;
  const db = b.deliveryMaxDays ?? Number.MAX_SAFE_INTEGER;
  if (da !== db) return da - db;
  const wa = a.warrantyBand ?? -1;
  const wb = b.warrantyBand ?? -1;
  if (wa !== wb) return wb - wa;
  if (a.freshnessRank !== b.freshnessRank) return b.freshnessRank - a.freshnessRank;
  return a.offerId < b.offerId ? -1 : a.offerId > b.offerId ? 1 : 0;
}

/** Are two offers equivalent within tolerance (so commission may break the tie)? */
function equivalent(best: OfferCandidate, o: OfferCandidate, t: OfferTolerances): boolean {
  // Price within tolerance %
  if (best.totalPriceMinor !== null && o.totalPriceMinor !== null) {
    const base = best.totalPriceMinor;
    const diffPct = base === 0 ? 0 : (Math.abs(o.totalPriceMinor - base) / base) * 100;
    if (diffPct > t.totalPricePctWithin) return false;
  } else if (best.totalPriceMinor !== o.totalPriceMinor) {
    return false; // one price unknown, the other known → not equivalent
  }

  // Delivery within tolerance days
  const bd = best.deliveryMaxDays;
  const od = o.deliveryMaxDays;
  if (bd !== null && od !== null) {
    if (Math.abs(od - bd) > t.deliveryDaysWithin) return false;
  }

  // Warranty band
  if (t.requireSameWarrantyBand && best.warrantyBand !== o.warrantyBand) return false;

  return true;
}
