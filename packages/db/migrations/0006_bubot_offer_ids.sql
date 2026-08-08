-- Rename the BuBlue Bubot 800P's offer IDs and redirect keys off the Dolphin
-- Premier's name — PART ONE, ADDITIVE ONLY.
--
-- WHY THE RENAME. `prod-dolphin-premier` stopped holding a Dolphin on 3 August
-- 2026 — the owner swapped the product on that stable record ID and the machine
-- there now is a BuBlue Bubot 800P Gen2. The PRICES were corrected on 6 August.
-- The NAMES were not: two offers called `off-premier-leslies` and
-- `off-premier-amazon`, and two redirect keys called
-- `pool-dolphin-premier-leslies` and `pool-dolphin-premier-amazon`, were still
-- selling a BuBlue under a Maytronics name. Those strings are read by people —
-- in the D1 console, in click reports, in the affiliate dashboards — and one
-- naming the wrong manufacturer is a trap for whoever reads it next.
--
-- WHY IT IS SPLIT IN TWO. This runs against the SAME production database the
-- live site reads. Deleting the old rows here would 404 the Bubot's buy button
-- the moment it applied, because production is still running code whose
-- REDIRECT_KEYS points at `pool-dolphin-premier-amazon`. So this migration only
-- ADDS: for the length of the overlap both key pairs resolve, the old one from
-- its own row and the new one from this one. 0007 removes the old pair, and is
-- applied only once the code that stopped using it is live.
--
-- WHAT DOES NOT CHANGE. `prod-dolphin-premier` itself. It is the stable record
-- ID the whole product swap was built on and it is referenced from the repo in
-- several places; renaming a primary key so it reads nicely is how foreign keys
-- get broken. The comment beside it says what it holds.
--
-- STATE READ FROM PRODUCTION BEFORE WRITING THIS (8 August 2026): two offers,
-- two redirect links (leslies inactive, amazon active), fourteen click events,
-- no price history.

-- The offers, copied whole to their new IDs. Column list read from
-- pragma_table_info('offers') against production, not from memory.
INSERT INTO offers (
  id, product_id, retailer_id, market_id, affiliate_program_id, currency_code,
  base_price_minor, delivery_price_minor, total_landed_minor, stock_status,
  delivery_min_days, delivery_max_days, warranty_summary, returns_url,
  redirect_key, affiliate_destination_url, commission_value_bp, source,
  freshness_class, confidence, price_verification, last_checked_at,
  seller_identity, offer_status, created_at, updated_at
)
SELECT
  CASE id
    WHEN 'off-premier-leslies' THEN 'off-bubot800p-leslies'
    WHEN 'off-premier-amazon'  THEN 'off-bubot800p-amazon'
  END,
  product_id, retailer_id, market_id, affiliate_program_id, currency_code,
  base_price_minor, delivery_price_minor, total_landed_minor, stock_status,
  delivery_min_days, delivery_max_days, warranty_summary, returns_url,
  CASE redirect_key
    WHEN 'pool-dolphin-premier-leslies' THEN 'pool-bublue-bubot800p-leslies'
    WHEN 'pool-dolphin-premier-amazon'  THEN 'pool-bublue-bubot800p-amazon'
    ELSE redirect_key
  END,
  affiliate_destination_url, commission_value_bp, source,
  freshness_class, confidence, price_verification, last_checked_at,
  seller_identity, offer_status, created_at, updated_at
FROM offers
WHERE id IN ('off-premier-leslies', 'off-premier-amazon')
  AND NOT EXISTS (SELECT 1 FROM offers o2 WHERE o2.id = 'off-bubot800p-amazon');

-- The redirect links, on their new keys, pointing at the new offer rows.
-- `active` is carried over rather than reset, so the Leslie's link — inactive
-- because that programme is not approved — does not quietly go live as a side
-- effect of a rename.
INSERT INTO redirect_links (key, offer_id, active)
SELECT
  CASE key
    WHEN 'pool-dolphin-premier-leslies' THEN 'pool-bublue-bubot800p-leslies'
    WHEN 'pool-dolphin-premier-amazon'  THEN 'pool-bublue-bubot800p-amazon'
  END,
  CASE offer_id
    WHEN 'off-premier-leslies' THEN 'off-bubot800p-leslies'
    WHEN 'off-premier-amazon'  THEN 'off-bubot800p-amazon'
  END,
  active
FROM redirect_links
WHERE key IN ('pool-dolphin-premier-leslies', 'pool-dolphin-premier-amazon')
  AND NOT EXISTS (SELECT 1 FROM redirect_links r2 WHERE r2.key = 'pool-bublue-bubot800p-amazon');
