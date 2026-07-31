-- Job 10 operational addendum: scheduled offer refresh.
--
-- The refresh POLICY already existed in code; what did not exist was anywhere
-- for a Worker to write its results. Without this, the scheduler cannot run and
-- live prices simply expire out of their freshness window.
--
-- Runs are append-only and every table is idempotent on a natural key, so a
-- retry after a partial failure converges on one clean state rather than
-- stacking duplicates. No secret and no raw provider payload is stored here.

CREATE TABLE IF NOT EXISTS refresh_runs (
  id TEXT PRIMARY KEY,
  scope TEXT NOT NULL,
  run_date TEXT NOT NULL,
  started_at TEXT NOT NULL,
  finished_at TEXT,
  status TEXT NOT NULL,
  products_planned INTEGER NOT NULL DEFAULT 0,
  products_read INTEGER NOT NULL DEFAULT 0,
  credits_used INTEGER NOT NULL DEFAULT 0,
  credits_month_to_date INTEGER NOT NULL DEFAULT 0,
  ceiling_reached INTEGER NOT NULL DEFAULT 0,
  dry_run INTEGER NOT NULL DEFAULT 0,
  notes TEXT
);
CREATE UNIQUE INDEX IF NOT EXISTS refresh_runs_scope_date_uq ON refresh_runs (scope, run_date);
CREATE INDEX IF NOT EXISTS refresh_runs_date_idx ON refresh_runs (run_date);

CREATE TABLE IF NOT EXISTS refresh_observations (
  id TEXT PRIMARY KEY,
  run_id TEXT NOT NULL,
  product_id TEXT NOT NULL,
  asin TEXT NOT NULL,
  checked_date TEXT NOT NULL,
  provider_id TEXT NOT NULL,
  observed_title TEXT,
  brand TEXT,
  model_name TEXT,
  model_number TEXT,
  price_minor INTEGER,
  currency TEXT NOT NULL DEFAULT 'USD',
  stock_wording TEXT,
  shipping_wording TEXT,
  seller_wording TEXT,
  returns_wording TEXT,
  identity_confirmed INTEGER NOT NULL DEFAULT 0,
  match_evidence TEXT NOT NULL,
  accepted INTEGER NOT NULL DEFAULT 0,
  suppression_reason TEXT
);
CREATE UNIQUE INDEX IF NOT EXISTS refresh_obs_product_asin_date_uq
  ON refresh_observations (product_id, asin, checked_date);
CREATE INDEX IF NOT EXISTS refresh_obs_product_idx ON refresh_observations (product_id);
CREATE INDEX IF NOT EXISTS refresh_obs_run_idx ON refresh_observations (run_id);

CREATE TABLE IF NOT EXISTS refresh_rejections (
  id TEXT PRIMARY KEY,
  run_id TEXT NOT NULL,
  product_id TEXT NOT NULL,
  asin TEXT NOT NULL,
  observed_title TEXT,
  rule TEXT NOT NULL,
  reason TEXT NOT NULL,
  first_seen_date TEXT NOT NULL,
  last_seen_date TEXT NOT NULL
);
CREATE UNIQUE INDEX IF NOT EXISTS refresh_rej_product_asin_uq ON refresh_rejections (product_id, asin);
CREATE INDEX IF NOT EXISTS refresh_rej_product_idx ON refresh_rejections (product_id);

CREATE TABLE IF NOT EXISTS refresh_unresolved (
  product_id TEXT PRIMARY KEY,
  run_id TEXT NOT NULL,
  reason TEXT NOT NULL,
  last_attempted_date TEXT NOT NULL,
  exception_reason TEXT
);

CREATE TABLE IF NOT EXISTS refresh_skips (
  id TEXT PRIMARY KEY,
  run_id TEXT NOT NULL,
  product_id TEXT NOT NULL,
  reason TEXT NOT NULL,
  detail TEXT NOT NULL,
  skipped_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS refresh_skips_run_idx ON refresh_skips (run_id);
