# BotMatch scoring — deterministic & commission-isolated

`packages/scoring` is a pure, framework-free, versioned engine. Same inputs + same config version → identical output. It runs in two clearly separated stages.

## Stage 1 — product suitability (`scoreProducts`)
Chooses the best **product** on fit alone.

Input is `(answers, candidates, config)` where a `SuitabilityCandidate` contains **only non-commercial attributes** — product class, environments, cleaning surfaces, power type, price tier, max pool length. **There is no price, offer, retailer or commission field.** Commercial data cannot reach product selection because there is no parameter to carry it.

Steps:
1. **Class eligibility** — `config.classEligibility.byPrimaryNeed[primary_need]`. A `surface_skimmer` (Betta) is eligible **only** when the customer's main problem is surface debris; otherwise it is excluded from a normal full-cleaner recommendation.
2. **Hard exclusions** — environment mismatch; pool longer than the product supports.
3. **Weighted suitability** — cleans coverage (40) + power match (20) + budget fit (20) + pool-size fit (20), normalised to 0–100.
4. **Deterministic ordering** — score desc, then `productId` asc; excluded products sink to the bottom.

## Stage 2 — offer ranking (`rankOffers`)
Only after a product is chosen. Ranks that product's **offers** by customer-relevant factors: total delivered price → delivery speed → warranty strength → data freshness. Commission (`commissionValueBp`, private) is used **only** as the final tie-break between offers judged **equivalent**.

Two offers are equivalent only if they match on **all** of:
- **Freshness — exactly.** A fresher offer is never equivalent to a staler one, so commission can never override a meaningfully fresher offer.
- **Price** — both unknown, or both known within tolerance % (default 1%). A known price is never equivalent to an unknown price.
- **Delivery** — both unknown, or both known within tolerance days (default 1). Known is never equivalent to unknown.
- **Warranty band** — equal.

`tieBreakUsed` is true whenever commission **materially** decided the winner — i.e. a single equivalent offer strictly beats the others on commission — **including** when that offer was already first under the deterministic customer-value order. It is false when commissions among equivalents are all equal (or null), or when only one candidate exists. The result also records the `equivalents` group and the `equivalenceBasis` (tolerances) for audit.

## Auditability
Every recommendation persists the questionnaire + scoring-config versions, per-candidate scores and exclusions, and the chosen product AND offer separately (`recommendations`, `recommendation_scores`). This makes the claim "commission did not move the product recommendation" provable from the record.

## Tests (`packages/scoring/test`)
- **`commission-isolation.test.ts`** — the guarantee:
  - `SuitabilityCandidate` exposes no commercial field (denylist test fails if one is ever added).
  - `scoreProducts` is a 3-arg pure function with no offers parameter.
  - Two suitability-identical products score identically.
  - Product ranking is byte-identical across 50 varied commission assignments.
- **`product-score.test.ts`** — surface-skimmer eligibility, environment/size exclusions, sensible winner, determinism.
- **`offer-rank.test.ts`** — commission breaks ties among equivalents; a fresher offer beats a stale higher-commission one; known price/delivery never equivalent to unknown; commission never overrides a cheaper/faster offer; `tieBreakUsed` records commission deciding even when the winner was already first; null/tied commissions do **not** flag a tie-break; unapproved offers ignored; determinism.

Run: `npm test`.
