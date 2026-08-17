import type { OfferCandidate, OfferRankingResult, OfferTolerances } from "./types.js";

/**
 * Rank a chosen product's offers for a customer.
 *
 * Customer-value ordering (commission-free):
 *   1. total delivered price (asc)
 *   2. delivery speed (asc)
 *   3. warranty strength (desc)
 *   4. data freshness (desc)
 *
 * Commission (private) is ONLY a final tie-break between offers judged
 * equivalent within tolerance. Two offers are equivalent only if they match on
 * ALL of: freshness (exactly), price (both unknown, or both known within
 * tolerance %), delivery (both unknown, or both known within tolerance days),
 * and warranty band. Because a fresher offer is never equivalent to a staler
 * one, and a known value is never equivalent to an unknown one, commission can
 * never override a meaningfully better (fresher / cheaper / faster) offer.
 */
export function rankOffers(
  offers: OfferCandidate[],
  tolerances: OfferTolerances,
): OfferRankingResult {
  const approved = offers.filter((o) => o.approved);
  if (approved.length === 0) {
    return {
      productId: offers[0]?.productId ?? "",
      winner: null,
      ranked: [],
      tieBreakUsed: false,
      equivalents: [],
      equivalenceBasis: null,
    };
  }

  // Deterministic customer-value ordering ignores commission entirely.
  const byCustomerValue = [...approved].sort(compareByCustomerValue);
  const leader = byCustomerValue[0]!;

  // Offers practically equivalent to the leader (includes the leader itself).
  const equivalents = byCustomerValue.filter((o) => equivalent(leader, o, tolerances));
  const equivalentIds = equivalents.map((o) => o.offerId);

  // Commission tie-break: only when a SINGLE offer strictly beats every other
  // equivalent on commission. Ties on commission (incl. all-null) are decided by
  // the deterministic fallback ordering, not by commission.
  let winner = leader;
  let tieBreakUsed = false;
  if (equivalents.length > 1) {
    const comms = equivalents.map((o) => o.commissionValueBp ?? -1);
    const maxComm = Math.max(...comms);
    const minComm = Math.min(...comms);
    const topByComm = equivalents.filter((o) => (o.commissionValueBp ?? -1) === maxComm);
    if (maxComm > minComm && topByComm.length === 1) {
      // Commission strictly and uniquely determines the winner.
      winner = topByComm[0]!;
      tieBreakUsed = true;
    }
  }

  const ranked = [winner, ...byCustomerValue.filter((o) => o.offerId !== winner.offerId)];
  return {
    productId: leader.productId,
    winner,
    ranked,
    tieBreakUsed,
    equivalents: equivalentIds,
    equivalenceBasis: tolerances,
  };
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
function equivalent(leader: OfferCandidate, o: OfferCandidate, t: OfferTolerances): boolean {
  // Freshness must match exactly — a fresher offer is never equivalent to a staler one.
  if (leader.freshnessRank !== o.freshnessRank) return false;

  // Price: known-vs-unknown is never equivalent; both-known must be within tolerance %.
  if (!bothKnownOrBothUnknown(leader.totalPriceMinor, o.totalPriceMinor)) return false;
  if (leader.totalPriceMinor !== null && o.totalPriceMinor !== null) {
    const base = leader.totalPriceMinor;
    const diffPct = base === 0 ? 0 : (Math.abs(o.totalPriceMinor - base) / base) * 100;
    if (diffPct > t.totalPricePctWithin) return false;
  }

  // Delivery: known-vs-unknown is never equivalent; both-known must be within tolerance days.
  if (!bothKnownOrBothUnknown(leader.deliveryMaxDays, o.deliveryMaxDays)) return false;
  if (leader.deliveryMaxDays !== null && o.deliveryMaxDays !== null) {
    if (Math.abs(o.deliveryMaxDays - leader.deliveryMaxDays) > t.deliveryDaysWithin) return false;
  }

  // Warranty band.
  if (t.requireSameWarrantyBand && leader.warrantyBand !== o.warrantyBand) return false;

  return true;
}

function bothKnownOrBothUnknown(a: number | null, b: number | null): boolean {
  return (a === null) === (b === null);
}
