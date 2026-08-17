-- Dreame A3 AWD 1000 — the candidate refused on 8 August, verified and admitted.
--
-- The brief of 8 August named a "Dreame A1". No such machine exists in the
-- current US range, so it was refused rather than substituted: a successor is a
-- different product and gets proposed on its own, not slipped in under an old
-- name. It has now been proposed and verified.
--
-- IDENTITY. B0H3V799KT, title "(Latest Upgrade) DREAME A3 AWD 1000 Robot Lawn
-- Mower ... for 0.25 Acre, 80% Slopes", $1,599.99 read 8 August 2026. The maker
-- sells the A3 AWD line in a 1000 and a 3500; the numeral is the mapping area in
-- square metres, and 1000 m2 is the 0.25 acre the listing states.
--
-- THE SKU AMBIGUITY, RECORDED. Three ASINs carry the A3 AWD 1000 at the same
-- $1,599.99: B0H3V799KT, B0H46DDHKC ("All-Terrain Wire-Free") and B0H761SNFG,
-- which bundles a cleaning and blade set. This is the bare machine. When the
-- offer is wired, DESTINATIONS must name this ASIN rather than search the model.
--
-- Enters as OFFER_SETUP_PENDING like the other ten. No offer, no /go key, no
-- stock claim: the product engine returned no availability field for it either.

INSERT INTO brands (id, slug, name) SELECT 'brand-dreame', 'dreame', 'Dreame' WHERE NOT EXISTS (SELECT 1 FROM brands WHERE id = 'brand-dreame');
INSERT INTO products (id, slug, brand_id, category_id, product_class, name, model, environments, cleans, power_type, price_tier, status, specs_json, max_pool_area_sqft) SELECT 'prod-dreame-a3-awd-1000', 'dreame-a3-awd-1000', 'brand-dreame', 'cat-lawn-mowers', 'lawn_mower', 'Dreame A3 AWD 1000', 'A3 AWD 1000', '["open_sky", "tree_cover"]', '["grass_flat", "grass_slopes", "grass_zones"]', 'cordless', 'premium', 'published', '{"offerSetupPending": true, "asinVerified": "B0H3V799KT", "readPrice": "$1,599.99", "readOn": "2026-08-08", "availability": "unknown", "navigation": "360 3D LiDAR plus binocular AI vision, wire free, no RTK", "slope": "80 percent (38.7 degrees), all-wheel drive", "namingNote": "The brief originally said Dreame A1, which does not exist in the current range. A3 AWD is the current line and sells in a 1000 and a 3500. Three ASINs carry the A3 AWD 1000 at the same $1,599.99; this is the bare listing rather than a bundle."}', 10890 WHERE NOT EXISTS (SELECT 1 FROM products WHERE id = 'prod-dreame-a3-awd-1000');
