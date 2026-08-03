-- BotMatch lead capture. One row per completed assessment.
-- Ported from the CryptoWatchdog matcher backend, but stored in BotPlanet's own
-- D1 rather than a separate Worker — the site already runs on Workers with D1
-- and Resend, so a second deployment would only add a thing to keep in sync.
CREATE TABLE IF NOT EXISTS matcher_leads (
  id            TEXT PRIMARY KEY,
  first_name    TEXT,
  email         TEXT,
  category_slug TEXT,                 -- which category matcher they used
  answers_json  TEXT,                 -- every answer, including profile-only ones
  scored_json   TEXT,                 -- the subset fed to the scoring engine
  result_token  TEXT,                 -- links to the on-site recommendation
  product_id    TEXT,                 -- the computed top match, if any
  consent       INTEGER NOT NULL DEFAULT 0,
  source_page   TEXT,
  submitted_at  TEXT,
  ip_country    TEXT,                 -- coarse only; full IP is never stored
  user_agent    TEXT,
  created_at    TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_matcher_leads_created ON matcher_leads(created_at);
CREATE INDEX IF NOT EXISTS idx_matcher_leads_email ON matcher_leads(email);
CREATE INDEX IF NOT EXISTS idx_matcher_leads_category ON matcher_leads(category_slug);
