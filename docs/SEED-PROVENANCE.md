# Seed provenance — provisional vs verified

The pool seed (`packages/db/seed/pool`) is a **research draft**, dated **2026-07-29**. Nothing in it should be treated as live truth. This document maps every meaningful field's status.

## Global rules honoured
- **Prices** are dated snapshots → every offer has `price_verification = "snapshot"` and `freshness_class = "indicative"`.
- **Affiliate commission / cookie** are provisional → `affiliate_programs.verification_status = "provisional"`; unconfirmed values are `null`.
- **No image URLs** — the `media` table is intentionally empty until rights are confirmed.
- **No credentials / no tracking parameters** — `offers.affiliate_destination_url` is `null` in every seed row.
- **Products and offers are separate records.**
- **Redirect links are `active = false`** and **retailer_markets `approved = false`** until an affiliate programme is approved (Danny owns acceptance).

## Field status

| Field | Status | Notes |
|---|---|---|
| Product identity (brand, model, class, environments, cleans, power) | **verified** | From manufacturer/retailer listings |
| Product `price_tier` | provisional | Editorial banding, not a price |
| Offer `base_price_minor` | **snapshot** | 2026-07-29; not live |
| Offer stock / delivery | unconfirmed | `stock_status = "unknown"`, delivery `null` |
| `affiliate_programs.commission_value_bp` | provisional | Basis points; private; midpoints where a range was seen |
| `affiliate_programs.cookie_days` | provisional / null | WYBOT & Doheny's cookie durations are **null (to confirm)** |
| `email_links_allowed` | conservative default `false` | Only set true after a programme is confirmed to allow it |
| Evidence rows | provisional, level "researched"/"manufacturer_claimed" | No BotPlanet hands-on testing exists yet |

## The 10th product — CONFIRMED
All **10 launch products** are now confirmed (`status = "published"`).

- **`prod-dolphin-e10`** was approved (ChatGPT + Danny, 2026-07-29) as the trusted-brand, corded, above-ground pick — it completes the corded-vs-cordless axis in the above-ground segment. **Dolphin Escape** (premium, ~$799) is held as a later premium above-ground alternative, not in the initial ten. Product identity is confirmed; its price (`off-e10-walmart`, ~$529 snapshot), affiliate route, image rights and stock remain **provisional** and its redirect link stays inactive until an affiliate programme is approved.

## Pre-lock confirmations still open
1. WYBOT & In The Swim affiliate **cookie durations**.
2. **Per-brand image licensing** (especially Dolphin/Polaris via dealer portals).
3. Manual **price-freshness workflow** ownership + thresholds.
