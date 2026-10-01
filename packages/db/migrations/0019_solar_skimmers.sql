-- 0019 — three solar skimmers join the catalogue: Aiper EcoSurfer S2, Beatbot iSkim
-- and BRINBO SK01, alongside the Betta SE Plus already held.
--
-- WHY THESE FOUR. The owner chose the four best-selling solar skimmers on Amazon US
-- on 1 October 2026 and supplied each listing's own images and an ASIN taken from the
-- listing's address bar. The research that makes a solar-skimmer best-of worth
-- building is in docs/seo/solar-pool-skimmers-research-findings.md; the candidates
-- and the traps are in docs/seo/solar-skimmer-candidates-2026-10-01.md.
--
-- WHAT IS AND IS NOT KNOWN. Each ASIN was fetched and its page title matches the
-- listing the owner opened. Amazon's details table could NOT be read (a fetch returns
-- the page head only), so identity rests on brand plus a title naming the model, the
-- same weaker basis the Yarbo offer was accepted on, and destinations.ts says so.
--
-- ONE ASIN PER PRODUCT. Colours are separate ASINs on Amazon. The iSkim in particular
-- has several listings (colour, with and without a charger, and a larger iSkim Ultra).
-- This record holds the Navy Blue listing the owner supplied.
--
-- NO PRICE IS WRITTEN. base_price_minor stays NULL and the refresh service fills it
-- with the date it was read; a price typed into a migration starts going stale the
-- moment it is committed.
--
-- ONE STATEMENT PER ROW, safe to re-apply.

INSERT INTO brands (id, slug, name) SELECT 'brand-brinbo', 'brinbo', 'BRINBO' WHERE NOT EXISTS (SELECT 1 FROM brands WHERE id = 'brand-brinbo');

INSERT INTO products (id, slug, brand_id, category_id, product_class, name, model, environments, cleans, power_type, price_tier, status, specs_json) SELECT 'prod-aiper-ecosurfer-s2', 'aiper-ecosurfer-s2', 'brand-aiper', 'cat-pool-cleaners', 'surface_skimmer', 'Aiper EcoSurfer S2', 'EcoSurfer S2', '["above_ground", "in_ground"]', '["water_surface"]', 'solar', 'budget', 'published', '{"note": "Solar surface skimmer — floating debris only, NOT a floor/wall cleaner.", "snapshotDate": "2026-10-01"}' WHERE NOT EXISTS (SELECT 1 FROM products WHERE id = 'prod-aiper-ecosurfer-s2');

INSERT INTO products (id, slug, brand_id, category_id, product_class, name, model, environments, cleans, power_type, price_tier, status, specs_json) SELECT 'prod-beatbot-iskim', 'beatbot-iskim', 'brand-beatbot', 'cat-pool-cleaners', 'surface_skimmer', 'Beatbot iSkim', 'iSkim', '["above_ground", "in_ground"]', '["water_surface"]', 'solar', 'budget', 'published', '{"note": "Solar surface skimmer — floating debris only, NOT a floor/wall cleaner.", "snapshotDate": "2026-10-01"}' WHERE NOT EXISTS (SELECT 1 FROM products WHERE id = 'prod-beatbot-iskim');

INSERT INTO products (id, slug, brand_id, category_id, product_class, name, model, environments, cleans, power_type, price_tier, status, specs_json) SELECT 'prod-brinbo-sk01', 'brinbo-sk01', 'brand-brinbo', 'cat-pool-cleaners', 'surface_skimmer', 'BRINBO SK01', 'SK01', '["above_ground", "in_ground"]', '["water_surface"]', 'solar', 'budget', 'published', '{"note": "Solar surface skimmer — floating debris only, NOT a floor/wall cleaner.", "snapshotDate": "2026-10-01"}' WHERE NOT EXISTS (SELECT 1 FROM products WHERE id = 'prod-brinbo-sk01');

INSERT INTO offers (id, product_id, retailer_id, market_id, affiliate_program_id, currency_code, stock_status, redirect_key, source, freshness_class, confidence, price_verification, offer_status) SELECT 'off-aiper-ecosurfer-s2-amazon', 'prod-aiper-ecosurfer-s2', 'ret-amazon', 'us', 'ap-amazon-us', 'USD', 'unknown', 'pool-aiper-ecosurfers2-amazon', 'manual', 'indicative', 'low', 'snapshot', 'active' WHERE NOT EXISTS (SELECT 1 FROM offers WHERE id = 'off-aiper-ecosurfer-s2-amazon');

INSERT INTO offers (id, product_id, retailer_id, market_id, affiliate_program_id, currency_code, stock_status, redirect_key, source, freshness_class, confidence, price_verification, offer_status) SELECT 'off-beatbot-iskim-amazon', 'prod-beatbot-iskim', 'ret-amazon', 'us', 'ap-amazon-us', 'USD', 'unknown', 'pool-beatbot-iskim-amazon', 'manual', 'indicative', 'low', 'snapshot', 'active' WHERE NOT EXISTS (SELECT 1 FROM offers WHERE id = 'off-beatbot-iskim-amazon');

INSERT INTO offers (id, product_id, retailer_id, market_id, affiliate_program_id, currency_code, stock_status, redirect_key, source, freshness_class, confidence, price_verification, offer_status) SELECT 'off-brinbo-sk01-amazon', 'prod-brinbo-sk01', 'ret-amazon', 'us', 'ap-amazon-us', 'USD', 'unknown', 'pool-brinbo-sk01-amazon', 'manual', 'indicative', 'low', 'snapshot', 'active' WHERE NOT EXISTS (SELECT 1 FROM offers WHERE id = 'off-brinbo-sk01-amazon');

INSERT INTO redirect_links (key, offer_id, active) SELECT 'pool-aiper-ecosurfers2-amazon', 'off-aiper-ecosurfer-s2-amazon', 1 WHERE NOT EXISTS (SELECT 1 FROM redirect_links WHERE key = 'pool-aiper-ecosurfers2-amazon');

INSERT INTO redirect_links (key, offer_id, active) SELECT 'pool-beatbot-iskim-amazon', 'off-beatbot-iskim-amazon', 1 WHERE NOT EXISTS (SELECT 1 FROM redirect_links WHERE key = 'pool-beatbot-iskim-amazon');

INSERT INTO redirect_links (key, offer_id, active) SELECT 'pool-brinbo-sk01-amazon', 'off-brinbo-sk01-amazon', 1 WHERE NOT EXISTS (SELECT 1 FROM redirect_links WHERE key = 'pool-brinbo-sk01-amazon');
