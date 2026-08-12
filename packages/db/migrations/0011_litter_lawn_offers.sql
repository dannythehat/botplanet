-- Offers and /go keys for the eleven litter boxes and lawn mowers.
--
-- WHAT CHANGES FOR A READER. Eleven published reviews that said "Check current
-- price" and had nowhere to send anybody now have a buy button each, pointing
-- at one pinned ASIN on Amazon US. Nothing else changes: no price is published,
-- no stock state is claimed, and the pages keep the "Check current price"
-- wording until the refresh service reads a real figure and dates it.
--
-- WHY THE PRICE COLUMN IS NULL ON EVERY ROW. Each of these listings was read on
-- 8 August 2026 and gave a price — $699.00, $509.99, $599.00, $229.99,
-- $1,099.00, $2,399.00, $2,799.00, $2,499.99, $1,022.54, $1,199.99, $1,599.99.
-- None of it is here. The window and companion rows carry research figures in
-- this column, stored as snapshot/indicative so the freshness gate can never
-- publish them; that is safe and it is still a number in a price field that no
-- pipeline checked. The first observation the refresh service accepts fills
-- these, with the date it was read.
--
-- NO STOCK CLAIM EITHER, and this corrects the verification record. That
-- document says the product engine returned no stock field for any of the ten.
-- It does — the field is `stock`, not `availability` — and all eleven returned
-- wording on both reads: "In Stock", "Only 15 left in stock - order soon.",
-- "Only 7 left in stock (more on the way)." That is evidence about a listing,
-- transcribed into commerce/destinations.ts, and it is not an observation of an
-- offer. stock_status stays 'unknown' until the refresh reads one.
--
-- IDENTITY WAS RE-READ BEFORE THIS RAN. Every ASIN below was read again through
-- the SerpApi product engine on 8 August, after the products were published and
-- before any button was wired: all eleven served the ASIN requested and all
-- eleven publish a model number that names them. Publishing a page and taking
-- somebody's click are different promises and the second one got its own read.
--
-- ONE STATEMENT PER ROW. D1 refuses "too many terms in compound SELECT" on a
-- multi-row INSERT ... SELECT, so each row is its own idempotent statement.

-- ---------------------------------------------------------------- offers
INSERT INTO offers (id, product_id, retailer_id, market_id, affiliate_program_id, currency_code, base_price_minor, stock_status, redirect_key, source, freshness_class, confidence, price_verification, offer_status) SELECT 'off-litter-robot-4-amazon', 'prod-litter-robot-4', 'ret-amazon', 'us', 'ap-amazon-us', 'USD', NULL, 'unknown', 'litter-whisker-lr4-amazon', 'manual', 'indicative', 'low', 'snapshot', 'active' WHERE NOT EXISTS (SELECT 1 FROM offers WHERE id = 'off-litter-robot-4-amazon');
INSERT INTO offers (id, product_id, retailer_id, market_id, affiliate_program_id, currency_code, base_price_minor, stock_status, redirect_key, source, freshness_class, confidence, price_verification, offer_status) SELECT 'off-petkit-purobot-max-pro-2-amazon', 'prod-petkit-purobot-max-pro-2', 'ret-amazon', 'us', 'ap-amazon-us', 'USD', NULL, 'unknown', 'litter-petkit-purobotmaxpro2-amazon', 'manual', 'indicative', 'low', 'snapshot', 'active' WHERE NOT EXISTS (SELECT 1 FROM offers WHERE id = 'off-petkit-purobot-max-pro-2-amazon');
INSERT INTO offers (id, product_id, retailer_id, market_id, affiliate_program_id, currency_code, base_price_minor, stock_status, redirect_key, source, freshness_class, confidence, price_verification, offer_status) SELECT 'off-casa-leo-loo-too-amazon', 'prod-casa-leo-loo-too', 'ret-amazon', 'us', 'ap-amazon-us', 'USD', NULL, 'unknown', 'litter-casaleo-lootoo-amazon', 'manual', 'indicative', 'low', 'snapshot', 'active' WHERE NOT EXISTS (SELECT 1 FROM offers WHERE id = 'off-casa-leo-loo-too-amazon');
INSERT INTO offers (id, product_id, retailer_id, market_id, affiliate_program_id, currency_code, base_price_minor, stock_status, redirect_key, source, freshness_class, confidence, price_verification, offer_status) SELECT 'off-petsafe-crystal-pro-amazon', 'prod-petsafe-scoopfree-crystal-pro', 'ret-amazon', 'us', 'ap-amazon-us', 'USD', NULL, 'unknown', 'litter-petsafe-crystalpro-amazon', 'manual', 'indicative', 'low', 'snapshot', 'active' WHERE NOT EXISTS (SELECT 1 FROM offers WHERE id = 'off-petsafe-crystal-pro-amazon');
INSERT INTO offers (id, product_id, retailer_id, market_id, affiliate_program_id, currency_code, base_price_minor, stock_status, redirect_key, source, freshness_class, confidence, price_verification, offer_status) SELECT 'off-navimow-i110n-amazon', 'prod-navimow-i110n', 'ret-amazon', 'us', 'ap-amazon-us', 'USD', NULL, 'unknown', 'lawn-segway-i110n-amazon', 'manual', 'indicative', 'low', 'snapshot', 'active' WHERE NOT EXISTS (SELECT 1 FROM offers WHERE id = 'off-navimow-i110n-amazon');
INSERT INTO offers (id, product_id, retailer_id, market_id, affiliate_program_id, currency_code, base_price_minor, stock_status, redirect_key, source, freshness_class, confidence, price_verification, offer_status) SELECT 'off-luba3-1500h-amazon', 'prod-luba-3-awd-1500h', 'ret-amazon', 'us', 'ap-amazon-us', 'USD', NULL, 'unknown', 'lawn-mammotion-luba3-1500h-amazon', 'manual', 'indicative', 'low', 'snapshot', 'active' WHERE NOT EXISTS (SELECT 1 FROM offers WHERE id = 'off-luba3-1500h-amazon');
INSERT INTO offers (id, product_id, retailer_id, market_id, affiliate_program_id, currency_code, base_price_minor, stock_status, redirect_key, source, freshness_class, confidence, price_verification, offer_status) SELECT 'off-luba3-3000h-amazon', 'prod-luba-3-awd-3000h', 'ret-amazon', 'us', 'ap-amazon-us', 'USD', NULL, 'unknown', 'lawn-mammotion-luba3-3000h-amazon', 'manual', 'indicative', 'low', 'snapshot', 'active' WHERE NOT EXISTS (SELECT 1 FROM offers WHERE id = 'off-luba3-3000h-amazon');
INSERT INTO offers (id, product_id, retailer_id, market_id, affiliate_program_id, currency_code, base_price_minor, stock_status, redirect_key, source, freshness_class, confidence, price_verification, offer_status) SELECT 'off-automower-410iq-amazon', 'prod-automower-410iq', 'ret-amazon', 'us', 'ap-amazon-us', 'USD', NULL, 'unknown', 'lawn-husqvarna-410iq-amazon', 'manual', 'indicative', 'low', 'snapshot', 'active' WHERE NOT EXISTS (SELECT 1 FROM offers WHERE id = 'off-automower-410iq-amazon');
INSERT INTO offers (id, product_id, retailer_id, market_id, affiliate_program_id, currency_code, base_price_minor, stock_status, redirect_key, source, freshness_class, confidence, price_verification, offer_status) SELECT 'off-worx-wr320-amazon', 'prod-worx-landroid-vision-wr320', 'ret-amazon', 'us', 'ap-amazon-us', 'USD', NULL, 'unknown', 'lawn-worx-wr320-amazon', 'manual', 'indicative', 'low', 'snapshot', 'active' WHERE NOT EXISTS (SELECT 1 FROM offers WHERE id = 'off-worx-wr320-amazon');
INSERT INTO offers (id, product_id, retailer_id, market_id, affiliate_program_id, currency_code, base_price_minor, stock_status, redirect_key, source, freshness_class, confidence, price_verification, offer_status) SELECT 'off-eufy-e15-amazon', 'prod-eufy-e15', 'ret-amazon', 'us', 'ap-amazon-us', 'USD', NULL, 'unknown', 'lawn-eufy-e15-amazon', 'manual', 'indicative', 'low', 'snapshot', 'active' WHERE NOT EXISTS (SELECT 1 FROM offers WHERE id = 'off-eufy-e15-amazon');
INSERT INTO offers (id, product_id, retailer_id, market_id, affiliate_program_id, currency_code, base_price_minor, stock_status, redirect_key, source, freshness_class, confidence, price_verification, offer_status) SELECT 'off-dreame-a3awd1000-amazon', 'prod-dreame-a3-awd-1000', 'ret-amazon', 'us', 'ap-amazon-us', 'USD', NULL, 'unknown', 'lawn-dreame-a3awd1000-amazon', 'manual', 'indicative', 'low', 'snapshot', 'active' WHERE NOT EXISTS (SELECT 1 FROM offers WHERE id = 'off-dreame-a3awd1000-amazon');

-- --------------------------------------------------------- redirect_links
-- The row /go/<key> actually resolves against. An offer with a redirect_key and
-- no row here is a buy button that answers 404, which is the single most
-- damaging failure this site can ship — so the two are written together, in one
-- migration, and never in two.
INSERT INTO redirect_links (key, offer_id, active) SELECT 'litter-whisker-lr4-amazon', 'off-litter-robot-4-amazon', 1 WHERE NOT EXISTS (SELECT 1 FROM redirect_links WHERE key = 'litter-whisker-lr4-amazon');
INSERT INTO redirect_links (key, offer_id, active) SELECT 'litter-petkit-purobotmaxpro2-amazon', 'off-petkit-purobot-max-pro-2-amazon', 1 WHERE NOT EXISTS (SELECT 1 FROM redirect_links WHERE key = 'litter-petkit-purobotmaxpro2-amazon');
INSERT INTO redirect_links (key, offer_id, active) SELECT 'litter-casaleo-lootoo-amazon', 'off-casa-leo-loo-too-amazon', 1 WHERE NOT EXISTS (SELECT 1 FROM redirect_links WHERE key = 'litter-casaleo-lootoo-amazon');
INSERT INTO redirect_links (key, offer_id, active) SELECT 'litter-petsafe-crystalpro-amazon', 'off-petsafe-crystal-pro-amazon', 1 WHERE NOT EXISTS (SELECT 1 FROM redirect_links WHERE key = 'litter-petsafe-crystalpro-amazon');
INSERT INTO redirect_links (key, offer_id, active) SELECT 'lawn-segway-i110n-amazon', 'off-navimow-i110n-amazon', 1 WHERE NOT EXISTS (SELECT 1 FROM redirect_links WHERE key = 'lawn-segway-i110n-amazon');
INSERT INTO redirect_links (key, offer_id, active) SELECT 'lawn-mammotion-luba3-1500h-amazon', 'off-luba3-1500h-amazon', 1 WHERE NOT EXISTS (SELECT 1 FROM redirect_links WHERE key = 'lawn-mammotion-luba3-1500h-amazon');
INSERT INTO redirect_links (key, offer_id, active) SELECT 'lawn-mammotion-luba3-3000h-amazon', 'off-luba3-3000h-amazon', 1 WHERE NOT EXISTS (SELECT 1 FROM redirect_links WHERE key = 'lawn-mammotion-luba3-3000h-amazon');
INSERT INTO redirect_links (key, offer_id, active) SELECT 'lawn-husqvarna-410iq-amazon', 'off-automower-410iq-amazon', 1 WHERE NOT EXISTS (SELECT 1 FROM redirect_links WHERE key = 'lawn-husqvarna-410iq-amazon');
INSERT INTO redirect_links (key, offer_id, active) SELECT 'lawn-worx-wr320-amazon', 'off-worx-wr320-amazon', 1 WHERE NOT EXISTS (SELECT 1 FROM redirect_links WHERE key = 'lawn-worx-wr320-amazon');
INSERT INTO redirect_links (key, offer_id, active) SELECT 'lawn-eufy-e15-amazon', 'off-eufy-e15-amazon', 1 WHERE NOT EXISTS (SELECT 1 FROM redirect_links WHERE key = 'lawn-eufy-e15-amazon');
INSERT INTO redirect_links (key, offer_id, active) SELECT 'lawn-dreame-a3awd1000-amazon', 'off-dreame-a3awd1000-amazon', 1 WHERE NOT EXISTS (SELECT 1 FROM redirect_links WHERE key = 'lawn-dreame-a3awd1000-amazon');
