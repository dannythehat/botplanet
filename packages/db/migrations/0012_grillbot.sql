-- Grillbot — the first product in grill-cleaning robots.
--
-- The category hub has been live and empty since it shipped. Its keyword row
-- is `grill cleaning robot`, 5,400/mo, KD 0, and the product term `grillbot`
-- is 18,100/mo at KD 11 — researched 6 August, run 31092662805, and never
-- built. This is the smallest change that ends the empty state.
--
-- IDENTITY, verified 10 August 2026 through SerpAPI's Amazon engine on
-- amazon.com. Amazon's own `brand` field returns "Grillbot" on four ASINs, all
-- sharing one review pool (4.1 stars, 5,400 ratings) — a single variation
-- family on colour plus a case bundle:
--
--     B00HFDFSAC  red,   no case   $129.99   <- PINNED
--     B00HVP1O7U  black, no case   $129.99
--     B07WLZ2W28  red   + case     $139.99
--     B07WF944GK  black + case     $139.99
--
-- The base product is pinned rather than the bundle, and the link must carry
-- `?th=1&psc=1` — a bare /dp/ on a variation family lands on whichever child
-- Amazon prefers, which is the fault that sent litter and lawn readers to the
-- wrong listing in August. Full record: docs/commerce/grillbot-identity.md.
--
-- A DIRECT READ OF THE AMAZON PAGE WAS BLOCKED. Both base ASINs answered 200
-- with the ASIN still in the final URL — no bounce to search — but served a
-- bot check rather than a product page, so no `id="productTitle"` was seen.
-- Identity therefore rests on dated third-party evidence rather than a page we
-- read ourselves, and is recorded that way rather than overstated.
--
-- ENTERS AS OFFER_SETUP_PENDING, like the litter and lawn ten. Identity is
-- confirmed and the product belongs in the hub and the catalogue; the
-- commercial wiring is not built. No offers row, no redirect_links row, and
-- neither may be added without moving it out of that state.
--
-- ONE PRODUCT DOES NOT MAKE A MATCHER. MIN_PRODUCTS_FOR_A_MATCH is 2, so the
-- grill funnel will keep showing its empty state after this lands, and that is
-- correct: running a questionnaire against a single product and announcing it
-- as the match tells a reader a comparison happened when nothing was compared.
-- The value here is the hub grid, the catalogue, and the review page.
--
-- `cleans` AND `environments` ARE THE SCORING VOCABULARY, not description.
-- Grill takes environment porcelain_grates / cast_iron_grates /
-- stainless_grates and cleans timer_control / grease_removal / hot_grill_safe /
-- bristle_free. A value outside those sets scores nothing and the product
-- silently never matches. Every value below is backed by the maker's own page:
--
--   all three grate types  — three brush heads: nylon (most grills), brass
--                            (porcelain and stainless), stainless steel (cast
--                            iron and expanded steel)
--   timer_control          — "Built-In LCD Timer"
--   hot_grill_safe         — "Hot or cold grills"
--   bristle_free           — nylon, brass and stainless-steel heads; no loose
--                            wire bristles, which is the category's whole
--                            safety argument
--   grease_removal         — three motors driving the heads across the grates
--
-- price_tier `mid`: $129.99 falls in the questionnaire's $100–$150 band.
--
-- ONE STATEMENT PER ROW, guarded by NOT EXISTS — D1 rejects a compound SELECT
-- with many terms, and the file must be safe to re-apply.

INSERT INTO brands (id, slug, name)
SELECT 'brand-grillbot', 'grillbot', 'Grillbot'
WHERE NOT EXISTS (SELECT 1 FROM brands WHERE id = 'brand-grillbot');

INSERT INTO products (
  id, slug, brand_id, category_id, product_class, name, model,
  environments, cleans, power_type, price_tier, max_pool_length_ft,
  specs_json, status
)
SELECT
  'prod-grillbot',
  'grillbot',
  'brand-grillbot',
  (SELECT id FROM categories WHERE slug = 'grill-cleaning-robots'),
  'grill_cleaner',
  'Grillbot',
  'GBU101',
  '["porcelain_grates", "cast_iron_grates", "stainless_grates"]',
  '["timer_control", "grease_removal", "hot_grill_safe", "bristle_free"]',
  'cordless',
  'mid',
  NULL,
  '{"offerSetupPending": true, "asinVerified": "B00HFDFSAC", "asinVariant": "Red, no case", "readPrice": "$129.99", "readOn": "2026-08-10", "readVia": "serpapi amazon engine, brand field", "availability": "unknown", "brushHeads": "Nylon, brass and stainless steel; no wire bristles", "motors": "3", "timer": "Built-in LCD timer with auto shut-off", "grillTemp": "Hot or cold grills", "warranty": "1 year, 3-year extension sold separately", "amazonRating": "4.1 from 5,400 ratings, read 2026-08-10", "variationFamily": "B00HFDFSAC red / B00HVP1O7U black / B07WLZ2W28 red+case / B07WF944GK black+case — one review pool; any link needs th=1&psc=1"}',
  'published'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE id = 'prod-grillbot');
