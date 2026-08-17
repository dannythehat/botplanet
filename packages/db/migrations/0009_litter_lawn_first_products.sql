-- First products for self-cleaning litter boxes and robotic lawn mowers.
--
-- Ten products, verified 8 August 2026 against Amazon US through the SerpAPI
-- product engine and against each manufacturer's own current lineup. The full
-- record, including the three candidates that were named wrongly in the brief
-- and the one that was refused outright, is in
-- docs/seo/litter-lawn-verification-2026-08-08.md.
--
-- ALL TEN ENTER AS OFFER_SETUP_PENDING. Identity is confirmed and the products
-- belong in the hub tables and the matcher; their commercial wiring is not
-- built. No offer rows, no redirect_links rows, and none may be added without
-- moving the product out of that state. `stock_status` is left NULL on purpose:
-- the product engine returned no availability field for any of the ten, and a
-- product in this state must make no stock claim anywhere.
--
-- `cleans` AND `environments` ARE THE SCORING VOCABULARY, not description. The
-- matcher reads them literally — lawn takes environment open_sky / tree_cover
-- and cleans grass_flat / grass_slopes / grass_zones; litter takes environment
-- average_cat / large_cat / kitten and cleans odor_sealing /
-- multi_cat_capacity / health_monitoring / app_control. A value outside those
-- sets scores nothing and the product silently never matches.
--
-- max_pool_area_sqft carries the LAWN AREA in square feet, because the matcher
-- scores lawn size through the same column the pool category uses for area.
-- 1/4 acre = 10,890 sq ft; 1/2 acre = 21,780; 0.37 acre = 16,117; 0.75 acre =
-- 32,670.
--
-- ONE STATEMENT PER ROW. D1 rejects a compound SELECT with this many terms
-- ("too many terms in compound SELECT"), so the tidy single-INSERT form this
-- file started as does not run. Each row is guarded by NOT EXISTS and the file
-- is safe to re-apply.

-- ---------- Brands ----------

INSERT INTO brands (id, slug, name) SELECT 'brand-whisker', 'whisker', 'Whisker' WHERE NOT EXISTS (SELECT 1 FROM brands WHERE id = 'brand-whisker');
INSERT INTO brands (id, slug, name) SELECT 'brand-petkit', 'petkit', 'PETKIT' WHERE NOT EXISTS (SELECT 1 FROM brands WHERE id = 'brand-petkit');
INSERT INTO brands (id, slug, name) SELECT 'brand-casa-leo', 'casa-leo', 'Casa Leo' WHERE NOT EXISTS (SELECT 1 FROM brands WHERE id = 'brand-casa-leo');
INSERT INTO brands (id, slug, name) SELECT 'brand-petsafe', 'petsafe', 'PetSafe' WHERE NOT EXISTS (SELECT 1 FROM brands WHERE id = 'brand-petsafe');
INSERT INTO brands (id, slug, name) SELECT 'brand-segway', 'segway', 'Segway Navimow' WHERE NOT EXISTS (SELECT 1 FROM brands WHERE id = 'brand-segway');
INSERT INTO brands (id, slug, name) SELECT 'brand-mammotion', 'mammotion', 'Mammotion' WHERE NOT EXISTS (SELECT 1 FROM brands WHERE id = 'brand-mammotion');
INSERT INTO brands (id, slug, name) SELECT 'brand-husqvarna', 'husqvarna', 'Husqvarna' WHERE NOT EXISTS (SELECT 1 FROM brands WHERE id = 'brand-husqvarna');
INSERT INTO brands (id, slug, name) SELECT 'brand-worx', 'worx', 'WORX' WHERE NOT EXISTS (SELECT 1 FROM brands WHERE id = 'brand-worx');
INSERT INTO brands (id, slug, name) SELECT 'brand-eufy', 'eufy', 'eufy' WHERE NOT EXISTS (SELECT 1 FROM brands WHERE id = 'brand-eufy');

-- ---------- Products ----------

INSERT INTO products (id, slug, brand_id, category_id, product_class, name, model, environments, cleans, power_type, price_tier, status, specs_json) SELECT 'prod-litter-robot-4', 'litter-robot-4', 'brand-whisker', 'cat-litter-boxes', 'litter_box', 'Litter-Robot 4', 'Litter-Robot 4', '["average_cat", "large_cat"]', '["odor_sealing", "multi_cat_capacity", "health_monitoring", "app_control"]', 'mains', 'premium', 'published', '{"offerSetupPending": true, "asinVerified": "B0BH6MD3DJ", "readPrice": "$699", "readOn": "2026-08-08", "availability": "unknown"}' WHERE NOT EXISTS (SELECT 1 FROM products WHERE id = 'prod-litter-robot-4');
INSERT INTO products (id, slug, brand_id, category_id, product_class, name, model, environments, cleans, power_type, price_tier, status, specs_json) SELECT 'prod-petkit-purobot-max-pro-2', 'petkit-purobot-max-pro-2', 'brand-petkit', 'cat-litter-boxes', 'litter_box', 'PETKIT Purobot Max Pro 2', 'Purobot Max Pro 2', '["average_cat", "large_cat"]', '["odor_sealing", "multi_cat_capacity", "health_monitoring", "app_control"]', 'mains', 'premium', 'published', '{"offerSetupPending": true, "asinVerified": "B0DM83CLW3", "readPrice": "$509.99", "readOn": "2026-08-08", "availability": "unknown", "namingNote": "The brief said PuroBot Max Pro. Max Pro 2 is the current flagship; a separate Purobot Max 3 sells at a LOWER price and is a different tier."}' WHERE NOT EXISTS (SELECT 1 FROM products WHERE id = 'prod-petkit-purobot-max-pro-2');
INSERT INTO products (id, slug, brand_id, category_id, product_class, name, model, environments, cleans, power_type, price_tier, status, specs_json) SELECT 'prod-casa-leo-loo-too', 'casa-leo-loo-too', 'brand-casa-leo', 'cat-litter-boxes', 'litter_box', 'Casa Leo Leo''s Loo Too', 'Leo''s Loo Too', '["average_cat", "large_cat"]', '["odor_sealing", "multi_cat_capacity", "health_monitoring", "app_control"]', 'mains', 'premium', 'published', '{"offerSetupPending": true, "asinVerified": "B09LL9S99B", "readPrice": "$599", "readOn": "2026-08-08", "availability": "unknown"}' WHERE NOT EXISTS (SELECT 1 FROM products WHERE id = 'prod-casa-leo-loo-too');
INSERT INTO products (id, slug, brand_id, category_id, product_class, name, model, environments, cleans, power_type, price_tier, status, specs_json) SELECT 'prod-petsafe-scoopfree-crystal-pro', 'petsafe-scoopfree-crystal-pro', 'brand-petsafe', 'cat-litter-boxes', 'litter_box', 'PetSafe ScoopFree Crystal Pro', 'ScoopFree Crystal Pro', '["average_cat"]', '["odor_sealing"]', 'mains', 'mid', 'published', '{"offerSetupPending": true, "asinVerified": "B0DR3JP2FZ", "readPrice": "$229.99", "readOn": "2026-08-08", "availability": "unknown", "namingNote": "ScoopFree Crystal is a family of four live SKUs. B07X3XFB6K is four cents cheaper and is PetSafe''s own Legacy generation. This is the current one."}' WHERE NOT EXISTS (SELECT 1 FROM products WHERE id = 'prod-petsafe-scoopfree-crystal-pro');
INSERT INTO products (id, slug, brand_id, category_id, product_class, name, model, environments, cleans, power_type, price_tier, status, specs_json, max_pool_area_sqft) SELECT 'prod-navimow-i110n', 'segway-navimow-i110n', 'brand-segway', 'cat-lawn-mowers', 'lawn_mower', 'Segway Navimow i110N', 'i110N', '["open_sky"]', '["grass_flat", "grass_zones"]', 'cordless', 'mid', 'published', '{"offerSetupPending": true, "asinVerified": "B0CX7T6BR3", "readPrice": "$1,099", "readOn": "2026-08-08", "availability": "unknown", "navigation": "RTK plus vision, perimeter wire free"}', 10890 WHERE NOT EXISTS (SELECT 1 FROM products WHERE id = 'prod-navimow-i110n');
INSERT INTO products (id, slug, brand_id, category_id, product_class, name, model, environments, cleans, power_type, price_tier, status, specs_json, max_pool_area_sqft) SELECT 'prod-luba-3-awd-1500h', 'mammotion-luba-3-awd-1500h', 'brand-mammotion', 'cat-lawn-mowers', 'lawn_mower', 'Mammotion LUBA 3 AWD 1500H', 'LUBA 3 AWD 1500H', '["open_sky", "tree_cover"]', '["grass_flat", "grass_slopes", "grass_zones"]', 'cordless', 'premium', 'published', '{"offerSetupPending": true, "asinVerified": "B0GKNYZPC3", "readPrice": "$2,399", "readOn": "2026-08-08", "availability": "unknown", "navigation": "360 LiDAR, dual-camera AI vision", "namingNote": "Replaces the Luba 2 named in the brief. Mammotion''s own US page for the Luba 2 AWD reads: 2025 Model, Upgraded to 2026 LUBA 3."}', 16117 WHERE NOT EXISTS (SELECT 1 FROM products WHERE id = 'prod-luba-3-awd-1500h');
INSERT INTO products (id, slug, brand_id, category_id, product_class, name, model, environments, cleans, power_type, price_tier, status, specs_json, max_pool_area_sqft) SELECT 'prod-luba-3-awd-3000h', 'mammotion-luba-3-awd-3000h', 'brand-mammotion', 'cat-lawn-mowers', 'lawn_mower', 'Mammotion LUBA 3 AWD 3000H', 'LUBA 3 AWD 3000H', '["open_sky", "tree_cover"]', '["grass_flat", "grass_slopes", "grass_zones"]', 'cordless', 'premium', 'published', '{"offerSetupPending": true, "asinVerified": "B0GKNQKJJQ", "readPrice": "$2,799", "readOn": "2026-08-08", "availability": "unknown", "navigation": "360 LiDAR, NetRTK, AI vision"}', 32670 WHERE NOT EXISTS (SELECT 1 FROM products WHERE id = 'prod-luba-3-awd-3000h');
INSERT INTO products (id, slug, brand_id, category_id, product_class, name, model, environments, cleans, power_type, price_tier, status, specs_json, max_pool_area_sqft) SELECT 'prod-automower-410iq', 'husqvarna-automower-410iq', 'brand-husqvarna', 'cat-lawn-mowers', 'lawn_mower', 'Husqvarna Automower 410iQ', 'Automower 410iQ', '["open_sky", "tree_cover"]', '["grass_flat", "grass_slopes", "grass_zones"]', 'cordless', 'premium', 'published', '{"offerSetupPending": true, "asinVerified": "B0DTV7TR6W", "readPrice": "$2,499.99", "readOn": "2026-08-08", "availability": "unknown", "navigation": "EPOS satellite, wire free, no boundary wire"}', 21780 WHERE NOT EXISTS (SELECT 1 FROM products WHERE id = 'prod-automower-410iq');
INSERT INTO products (id, slug, brand_id, category_id, product_class, name, model, environments, cleans, power_type, price_tier, status, specs_json, max_pool_area_sqft) SELECT 'prod-worx-landroid-vision-wr320', 'worx-landroid-vision-wr320', 'brand-worx', 'cat-lawn-mowers', 'lawn_mower', 'WORX Landroid Vision Cloud WR320', 'WR320', '["open_sky", "tree_cover"]', '["grass_flat", "grass_zones"]', 'cordless', 'mid', 'published', '{"offerSetupPending": true, "asinVerified": "B0GN8KK8XW", "readPrice": "$1,022.54", "readOn": "2026-08-08", "availability": "unknown", "navigation": "Camera vision, no perimeter wire, no RTK", "namingNote": "Landroid Vision is a family of at least four live SKUs. WR320 is the mainstream 2WD half-acre model; the 4WD WR342 and WR344 are a separate argument."}', 21780 WHERE NOT EXISTS (SELECT 1 FROM products WHERE id = 'prod-worx-landroid-vision-wr320');
INSERT INTO products (id, slug, brand_id, category_id, product_class, name, model, environments, cleans, power_type, price_tier, status, specs_json, max_pool_area_sqft) SELECT 'prod-eufy-e15', 'eufy-e15', 'brand-eufy', 'cat-lawn-mowers', 'lawn_mower', 'eufy Robot Lawn Mower E15', 'E15', '["open_sky", "tree_cover"]', '["grass_flat", "grass_zones"]', 'cordless', 'mid', 'published', '{"offerSetupPending": true, "asinVerified": "B0DRVYDXWX", "readPrice": "$1,199.99", "readOn": "2026-08-08", "availability": "unknown", "navigation": "Pure vision, wire free and RTK free"}', 10890 WHERE NOT EXISTS (SELECT 1 FROM products WHERE id = 'prod-eufy-e15');
