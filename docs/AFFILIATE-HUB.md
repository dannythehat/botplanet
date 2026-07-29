# Affiliate Revenue & Attribution Hub

BotPlanet's commercial control centre — not just an affiliate-links table. This PR lays the **schema foundation** (migration `0001_affiliate_hub`); the admin UI is a later deliverable, but the data model already makes full attribution possible.

## Security & privacy (non-negotiable)
- **No secrets in D1.** No passwords, API keys, full banking details, or tax-document contents. Only safe status metadata and a `secret_ref` (a handle to a secret held in Cloudflare secrets / the approved secret manager) and setup **status** fields.
- **No personal data in attribution.** `click_events` store an anonymous `session_anon_id` and non-personal dimensions only. **BotMatch answers never enter attribution URLs or analytics payloads.** Consent state is recorded and honoured.

## Tables (migration 0001)
| Table | Purpose |
|---|---|
| `affiliate_accounts` | BotPlanet's **operational** relationship: application lifecycle, payout threshold/cadence/method label, claim instructions, next expected payment, account manager, creative permissions, tax/bank/identity **setup status**, `secret_ref`. **Does not store commission rate or cookie duration** (see ownership rule). |
| `program_terms_history` | Historical commission/cookie snapshots + verification dates. |
| `click_events` | Immutable attribution per `/go/:key` redirect (where consent permits). |
| `commission_transactions` | Conversions imported from networks. An outbound click is **never** assumed to be a sale. |
| `payouts` | Imported commissions matched to actual network payments. |
| `revenue_daily` | Daily aggregates for fast dashboards (see grain below). |
| `import_jobs` | CSV/API/postback provenance for every transaction batch. |

## Ownership rule — no duplicated rates
Commission rate + cookie duration have **one editable source**:
- `affiliate_programs` = programme identity + **currently-applicable** commercial terms (what offers use).
- `program_terms_history` = the record of past terms + verification evidence.
- `affiliate_accounts` = the operational/payout/application relationship, and **references** its programme via `affiliate_program_id`. It never re-stores the rate/cookie, so the two can't drift.

## `revenue_daily` grain & uniqueness
**Grain:** one row per `date × market × category × brand × product × retailer × affiliate programme`. A dimension intentionally rolled up uses the literal sentinel **`"all"`**, never NULL.
Because SQLite treats NULLs as distinct (which would permit duplicate aggregate rows), uniqueness is enforced on a deterministic non-null **`aggregation_key`** = `revenueAggregationKey(...)` from `@botplanet/shared` (`date|market|category|brand|product|retailer|programme`, normalised). That key is UNIQUE and is the safe **upsert / rebuild** handle. **Never sum across grains** — e.g. don't add an `all`-products row to per-product rows for the same date.

## The end-to-end trace this enables
> *Which visitor journey generated this click → which retailer received it → which transaction came back → how much commission was approved → and was it actually paid?*

- **Journey → click:** `click_events` links `session_anon_id`, `source_page`, `page_type`, `content_cluster`, `placement`, `recommendation_module`, `recommendation_id` (BotMatch), `campaign`, `traffic_source`, `device_class` to `offer_id` / `retailer_id` / `affiliate_program_id` and the `destination_version` live at click time.
- **Click → transaction:** `commission_transactions.click_correlation_id` / `click_event_id` correlate a network-reported sale back to the click (where the network passes a sub-id).
- **Transaction → money:** `state` (pending → approved → paid, or rejected/reversed), `estimated`/`confirmed` commission, validation & payment dates, then `payouts` reconcile to real network payments.
- **Provenance:** every transaction carries `import_source` + `import_job_id`.

## Reporting dimensions supported
date · category · brand · product · retailer · affiliate programme · page · component/placement · recommendation module · BotMatch recommendation · campaign · traffic source · market · device (where allowed). `revenue_daily` pre-aggregates the common combination; granular queries use the indexes on `click_events` and `commission_transactions`.

## Reconciliation principle
Estimated vs confirmed commission are separate fields; `reconciliation_confidence` and `manual_adjustment_minor` (with audit via `audit_log`) capture the gap between "click happened" and "commission actually paid". The network/supplier remains the source of truth for a confirmed sale.
