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
Only after a product is chosen. Ranks that product's **offers** by customer-relevant factors: total delivered price → delivery speed → warranty strength → data freshness. Commission (`commissionValueBp`, private) is used **only** as the final tie-break **between offers already equivalent within tolerance** (default: total price within 1%, delivery within 1 day, same warranty band). Commission can never override a genuinely better offer.

## Auditability
Every recommendation persists the questionnaire + scoring-config versions, per-candidate scores and exclusions, and the chosen product AND offer separately (`recommendations`, `recommendation_scores`). This makes the claim "commission did not move the product recommendation" provable from the record.

## Tests (`packages/scoring/test`)
- **`commission-isolation.test.ts`** — the guarantee:
  - `SuitabilityCandidate` exposes no commercial field (denylist test fails if one is ever added).
  - `scoreProducts` is a 3-arg pure function with no offers parameter.
  - Two suitability-identical products score identically.
  - Product ranking is byte-identical across 50 varied commission assignments.
- **`product-score.test.ts`** — surface-skimmer eligibility, environment/size exclusions, sensible winner, determinism.
- **`offer-rank.test.ts`** — commission breaks ties among equivalents, but never overrides a cheaper/faster offer; unapproved offers ignored; determinism.

Run: `npm test`.
