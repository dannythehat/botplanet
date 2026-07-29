import { describe, expect, it } from "vitest";
import { rankOffers } from "../src/offer-rank.js";
import type { OfferCandidate, OfferTolerances } from "../src/types.js";
import { POOL_CONFIG_V1 } from "./fixtures.js";

const TOL: OfferTolerances = POOL_CONFIG_V1.tiebreakTolerances;

function offer(p: Partial<OfferCandidate> & { offerId: string }): OfferCandidate {
  return {
    productId: "prod-x",
    totalPriceMinor: 100000,
    deliveryMaxDays: 3,
    warrantyBand: 2,
    approved: true,
    freshnessRank: 1,
    commissionValueBp: 0,
    ...p,
  };
}

describe("offer ranking (commission only as final tie-break)", () => {
  it("uses commission to break a tie between equivalent offers", () => {
    const a = offer({ offerId: "a", commissionValueBp: 300 });
    const b = offer({ offerId: "b", commissionValueBp: 1200 });
    const result = rankOffers([a, b], TOL);
    expect(result.winner?.offerId).toBe("b");
    expect(result.tieBreakUsed).toBe(true);
    expect(result.equivalents.sort()).toEqual(["a", "b"]);
  });

  it("does NOT let commission override a genuinely cheaper offer beyond tolerance", () => {
    const cheap = offer({ offerId: "cheap", totalPriceMinor: 90000, commissionValueBp: 100 });
    const dear = offer({ offerId: "dear", totalPriceMinor: 100000, commissionValueBp: 1500 });
    const result = rankOffers([cheap, dear], TOL);
    expect(result.winner?.offerId).toBe("cheap");
    expect(result.tieBreakUsed).toBe(false);
  });

  it("prefers faster delivery before considering commission", () => {
    const slow = offer({ offerId: "slow", deliveryMaxDays: 10, commissionValueBp: 1500 });
    const fast = offer({ offerId: "fast", deliveryMaxDays: 2, commissionValueBp: 100 });
    const result = rankOffers([slow, fast], TOL);
    expect(result.winner?.offerId).toBe("fast");
    expect(result.tieBreakUsed).toBe(false);
  });

  // --- Required new cases (ChatGPT PR review) ---

  it("a fresher offer beats a stale higher-commission offer (freshness gates equivalence)", () => {
    const fresh = offer({ offerId: "fresh", freshnessRank: 2, commissionValueBp: 100 });
    const stale = offer({ offerId: "stale", freshnessRank: 0, commissionValueBp: 1500 });
    const result = rankOffers([stale, fresh], TOL);
    expect(result.winner?.offerId).toBe("fresh");
    expect(result.tieBreakUsed).toBe(false); // stale is not equivalent → no commission tie-break
    expect(result.equivalents).toEqual(["fresh"]);
  });

  it("known delivery is not equivalent to unknown delivery", () => {
    const known = offer({ offerId: "known", deliveryMaxDays: 3, commissionValueBp: 100 });
    const unknown = offer({ offerId: "unknown", deliveryMaxDays: null, commissionValueBp: 1500 });
    const result = rankOffers([unknown, known], TOL);
    expect(result.winner?.offerId).toBe("known"); // known delivery ranks ahead; unknown can't tie
    expect(result.tieBreakUsed).toBe(false);
    expect(result.equivalents).toEqual(["known"]);
  });

  it("known price is not equivalent to unknown price", () => {
    const priced = offer({ offerId: "priced", totalPriceMinor: 100000, commissionValueBp: 100 });
    const unpriced = offer({ offerId: "unpriced", totalPriceMinor: null, commissionValueBp: 1500 });
    const result = rankOffers([unpriced, priced], TOL);
    expect(result.winner?.offerId).toBe("priced");
    expect(result.tieBreakUsed).toBe(false);
  });

  it("records tieBreakUsed even when the commission winner was already first by fallback order", () => {
    // 'a' sorts first deterministically AND has the strictly highest commission.
    const a = offer({ offerId: "a", commissionValueBp: 1200 });
    const b = offer({ offerId: "b", commissionValueBp: 300 });
    const result = rankOffers([a, b], TOL);
    expect(result.winner?.offerId).toBe("a");
    expect(result.tieBreakUsed).toBe(true); // commission materially determined it
  });

  it("does not flag a tie-break when equivalent offers all have null commission", () => {
    const a = offer({ offerId: "a", commissionValueBp: null });
    const b = offer({ offerId: "b", commissionValueBp: null });
    const c = offer({ offerId: "c", commissionValueBp: null });
    const result = rankOffers([c, b, a], TOL);
    expect(result.winner?.offerId).toBe("a"); // deterministic fallback (offerId asc)
    expect(result.tieBreakUsed).toBe(false);
    expect(result.equivalents.sort()).toEqual(["a", "b", "c"]);
  });

  it("does not flag a tie-break when equivalent offers tie on the top commission", () => {
    const a = offer({ offerId: "a", commissionValueBp: 500 });
    const b = offer({ offerId: "b", commissionValueBp: 500 });
    const result = rankOffers([a, b], TOL);
    expect(result.winner?.offerId).toBe("a");
    expect(result.tieBreakUsed).toBe(false); // commission did not uniquely decide
  });

  it("ignores unapproved offers, and returns no winner when none are approved", () => {
    const approved = offer({ offerId: "ok", approved: true });
    const notApproved = offer({ offerId: "no", approved: false, totalPriceMinor: 1 });
    expect(rankOffers([approved, notApproved], TOL).winner?.offerId).toBe("ok");
    expect(rankOffers([notApproved], TOL).winner).toBeNull();
  });

  it("is deterministic after the changes", () => {
    const offers = [
      offer({ offerId: "a", commissionValueBp: 100 }),
      offer({ offerId: "b", commissionValueBp: 500 }),
      offer({ offerId: "c", freshnessRank: 2, commissionValueBp: 0 }),
    ];
    expect(rankOffers(offers, TOL)).toEqual(rankOffers(offers, TOL));
  });
});
