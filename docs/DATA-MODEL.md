# Data model

Market-aware from day one. **Products are global; offers and all commercial data are market-scoped.**

## Tables (D1 / SQLite via Drizzle)

### Reference
- `markets` — us / ca / uk / au. US has `path_prefix = ""` (root domain).
- `disclosures` — per-market, per-locale affiliate/sponsored/review-unit text.
- `categories` — taxonomy (launch: robotic pool cleaners).

### Catalogue (global)
- `brands` — includes `has_direct_affiliate` (Dolphin/Polaris = false → retailer-only).
- `products` — global, **price-free**. Scoring attributes are explicit columns (`environments`, `cleans`, `power_type`, `price_tier`, `max_pool_length_ft`, `product_class`); everything else in `specs_json`. `status` = draft | published | proposed.
- `product_market_availability` — which markets a product is sold in.
- `evidence` — claims + evidence level + source; drives on-page evidence labels.
- `media` — media metadata + rights. **`supports_tested_claim` can only be true for original BotPlanet evidence media.** No image rows are seeded (rights unconfirmed).

### Commercial (market-scoped)
- `retailers`, `retailer_markets` — retailer identity + per-market approval/shipping.
- `affiliate_programs` — per-market (Amazon US ≠ Amazon UK). `commission_value_bp` is **private**; `email_links_allowed` captures the per-programme email rule (Amazon = false).
- `offers` — **the product/offer separation**. One global product → many market offers. Private fields (`affiliate_destination_url`, `commission_value_bp`) never reach the client. Prices are integer minor units; `price_verification` = verified | snapshot | unconfirmed.
- `offer_price_history` — freshness + audit trail.
- `redirect_links` — `/go/:key`; destination swappable centrally without editing content.

### BotMatch
- `questionnaires` — versioned question schema per category.
- `scoring_configs` — versioned weights, hard exclusions, class eligibility, offer tie-break tolerances. **Data, not code.**

### Sessions / audit
- `recommendations` — audit spine: inputs, config versions, chosen product AND offer (separate), explanation, token (encodes market+locale). `email` is nullable PII.
- `recommendation_scores` — per-candidate scores/exclusions; proves what each product scored.
- `leads` — commercial-robot lead-gen funnel.
- `audit_log` — offer pauses, config publishes, overrides.

### Affiliate Revenue & Attribution Hub (migration `0001_affiliate_hub`)
Full detail in `docs/AFFILIATE-HUB.md`. Tables: `affiliate_accounts`, `program_terms_history`, `click_events` (immutable attribution), `commission_transactions`, `payouts`, `revenue_daily`, `import_jobs`. **Secrets are never stored — only `secret_ref` handles + setup status. No personal data in attribution.**

## Indexes
Common lookups are indexed: products by category/brand; `product_market_availability` unique on (product, market); offers by (product, market) and market; `offer_price_history` by offer; affiliate_programs by market/retailer/brand; `retailer_markets` unique on (retailer, market); recommendation_scores by recommendation; click_events by offer / recommendation / (market, time) / redirect; commission_transactions unique on (network, external_transaction_id) + by program/click/state; `revenue_daily` unique on a deterministic non-null **`aggregation_key`** (sentinel `"all"` for rolled-up dimensions — see `docs/AFFILIATE-HUB.md`), avoiding SQLite's distinct-NULL duplicate-row problem.

## Known follow-up (non-blocking)
`scoreProducts` currently gives the pool-size factor full marks once a product passes the hard length exclusion. A later revision should grade it (a robot merely *capable* of a pool vs one *optimally suited* to it). Tracked as a scoring refinement; does not affect commission isolation.

## Migrations
Generated from `packages/db/src/schema` via `npm run db:generate` (drizzle-kit, SQLite dialect). Applied with `wrangler d1 migrations apply` once the Cloudflare account/zone are confirmed. No live DB is needed to generate.

## Non-negotiables encoded here
- Product suitability is scored with **no access to price or commission** (see `docs/SCORING.md`).
- Commission is private and used only as an offer tie-break.
- Betta SE Plus is a `surface_skimmer` class — never a full-cleaner substitute.
