-- 0018 — the Yarbo Snow Blower gets a buy button.
--
-- WHY IT DID NOT HAVE ONE. Migration 0017 shipped this product in
-- OFFER_SETUP_PENDING with a real obstacle rather than a formality: ASIN
-- B0FJF9V1JC came from an Amazon SEARCH RESULT TITLE, not from a listing
-- anybody had read. That is exactly where the roborock S8 MaxV Ultra
-- investigation started before every result carrying the searched name turned
-- out to be an accessory kit, and this is a $4,999 machine.
--
-- WHAT CHANGED. The listing was fetched directly on 11 August 2026. It serves
-- brand YARBO and the title 'YARBO 2-Stage 24/7 Autonomous Robot Snow Blower
-- with Modular Design | 24/7 Autonomous with 6-40ft Throwing Distance, 12"
-- Intake Height, 24" Cleaning Width, AI Multi-Zone Mapping & RTK GPS'.
--
-- THE DETAILS TABLE STILL COULD NOT BE READ, and this migration says so rather
-- than implying a cleaner result than was obtained. There is no Model Number
-- field here of the kind the pool and window offers rest on. What there is:
-- the brand, a title naming the machine outright, and FOUR specification
-- figures that match what yarbo.com published into this catalogue in 0017 —
-- two-stage, 6-40ft throw, 12in intake height, 24in clearing width. Identity
-- was already corroborated off Amazon at Lowe's (item 8256113, "Model #YARBO
-- S1") and Best Buy (SKU J3Q5Q8G9GS, "Black Yarbo S1").
--
-- That is a weaker basis than the other offers on this site and a materially
-- different situation from the roborock case: there the titles named an
-- accessory, here the title names the machine and four of its numbers agree
-- with the maker's own page.
--
-- NO PRICE IS WRITTEN HERE. base_price_minor stays NULL and the figure comes
-- from the refresh service with the date it was read, same as every other
-- offer. A price typed into a migration is a price that starts going stale the
-- moment it is committed, and this product is seasonal.
--
-- ONE STATEMENT PER ROW, safe to re-apply.

-- ---------- Offer ----------

INSERT INTO offers (id, product_id, retailer_id, market_id, affiliate_program_id, currency_code, stock_status, redirect_key, source, freshness_class, confidence, price_verification, offer_status) SELECT 'off-yarbo-snow-blower-amazon', 'prod-yarbo-snow-blower', 'ret-amazon', 'us', 'ap-amazon-us', 'USD', 'unknown', 'snow-yarbo-snow-blower-amazon', 'manual', 'indicative', 'low', 'snapshot', 'active' WHERE NOT EXISTS (SELECT 1 FROM offers WHERE id = 'off-yarbo-snow-blower-amazon');

-- ---------- Redirect ----------

INSERT INTO redirect_links (key, offer_id, active) SELECT 'snow-yarbo-snow-blower-amazon', 'off-yarbo-snow-blower-amazon', 1 WHERE NOT EXISTS (SELECT 1 FROM redirect_links WHERE key = 'snow-yarbo-snow-blower-amazon');

-- ---------- Clear the pending flag ----------
-- The specs_json keys that recorded WHY there was no buy link are replaced
-- with what was actually read, so the record does not go on describing an
-- obstacle that has been cleared.

UPDATE products SET specs_json = json_remove(specs_json, '$.offerSetupPending', '$.offerSetupSince', '$.asinUnverified', '$.asinNote') WHERE id = 'prod-yarbo-snow-blower';

UPDATE products SET specs_json = json_set(specs_json, '$.asin', 'B0FJF9V1JC', '$.asinReadOn', '2026-08-11', '$.asinBasis', 'Listing fetched directly. Brand YARBO; title names the machine and prints 2-stage, 6-40ft throw, 12in intake and 24in clearing width, all four matching yarbo.com as recorded here. The Amazon DETAILS TABLE was not readable, so there is no Model Number field behind this — a weaker basis than the other offers on this site, recorded rather than smoothed over. Corroborated at Lowe''s item 8256113 (Model #YARBO S1) and Best Buy SKU J3Q5Q8G9GS.') WHERE id = 'prod-yarbo-snow-blower';
