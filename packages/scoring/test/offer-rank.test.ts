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
    const a = offer({ offerId: "a", commissionValueBp: 300 }); // same price/delivery/warranty
    const b = offer({ offerId: "b", commissionValueBp: 1200 });
    const result = rankOffers([a, b], TOL);
    expect(result.winner?.offerId).toBe("b"); // higher commission wins the tie
    expect(result.tieBreakUsed).toBe(true);
  });

  it("does NOT let commission override a genuinely cheaper offer beyond tolerance", () => {
    const cheapLowCommission = offer({ offerId: "cheap", totalPriceMinor: 90000, commissionValueBp: 100 });
    const dearHighCommission = offer({ offerId: "dear", totalPriceMinor: 100000, commissionValueBp: 1500 });
    const result = rankOffers([cheapLowCommission, dearHighCommission], TOL);
    expect(result.winner?.offerId).toBe("cheap"); // ~10% cheaper is outside the 1% tolerance
    expect(result.tieBreakUsed).toBe(false);
  });

  it("prefers faster delivery before considering commission", () => {
    const slowHighCommission = offer({ offerId: "slow", deliveryMaxDays: 10, commissionValueBp: 1500 });
    const fastLowCommission = offer({ offerId: "fast", deliveryMaxDays: 2, commissionValueBp: 100 });
    const result = rankOffers([slowHighCommission, fastLowCommission], TOL);
    expect(result.winner?.offerId).toBe("fast");
    expect(result.tieBreakUsed).toBe(false);
  });

  it("ignores unapproved offers, and returns no winner when none are approved", () => {
    const approved = offer({ offerId: "ok", approved: true });
    const notApproved = offer({ offerId: "no", approved: false, totalPriceMinor: 1 });
    const r1 = rankOffers([approved, notApproved], TOL);
    expect(r1.winner?.offerId).toBe("ok");

    const r2 = rankOffers([notApproved], TOL);
    expect(r2.winner).toBeNull();
  });

  it("is deterministic", () => {
    const offers = [offer({ offerId: "a" }), offer({ offerId: "b", commissionValueBp: 500 })];
    expect(rankOffers(offers, TOL)).toEqual(rankOffers(offers, TOL));
  });
});
