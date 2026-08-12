-- 0017 — Yarbo Snow Blower, and the first product in a HIDDEN category.
--
-- Approved for build on 11 August 2026 after four review rounds. The full
-- research, the identity verification and every rejected alternative are in
-- docs/seo/snow-blower-research-2026-08-11.md.
--
-- WHY THIS IS ONE PRODUCT AND NOT A CATEGORY. Robot snow blowers have one
-- manufacturer. Snowbot — which looked like an independent competitor — is
-- Yarbo's own former brand name: Hanyang Technology of Shenzhen, Snowbot S1 at
-- $1,999 in 2021, S1 Pro at $2,999, now sold as Yarbo. Left Hand Robotics was
-- bought by Toro in 2021 and builds commercial sidewalk machines.
-- smart-dots.com and cnygreenteam.com are Yarbo DEALERS; CNY Green Team lists
-- nine SKUs and every one is a Yarbo. There is no second machine to compare
-- against, so the four comparative surfaces a category means here — hub,
-- comparison table, BotMatch matcher, best-of — are not built. The category
-- exists as a `hidden` launch state in content/nav.ts: a reserved slug that
-- gives the review a clean URL and no surfaces at all.
--
-- IT IS A MODULE, NOT A SNOW BLOWER, and the catalogue has to say which SKU it
-- is pricing. Yarbo is a "1+N" system: one Core takes a mower, a snow blower, a
-- leaf blower or a trimmer. The snow blower MODULE alone is $1,299 and needs a
-- Core. The thing Yarbo calls the "Yarbo Snow Blower" is $4,999 and includes
-- the Core, the Data Center, the battery, the dock, a snow track and a tow
-- hitch. Third-party reviews headline $4,999 and describe it as "standalone",
-- which is how a reader ends up expecting a $1,299 robot. This record is the
-- $4,999 complete package and says so.
--
-- OFFER_SETUP_PENDING, and this one is not a formality. Identity is confirmed
-- at two retailers — Lowe's publishes "Model #YARBO S1" against item 8256113
-- and Best Buy titles it "Black Yarbo S1" under SKU J3Q5Q8G9GS — but Amazon's
-- own details table has NOT been read. WebFetch returns the page head only and
-- this account's DataForSEO merchant endpoints are not enabled. ASIN
-- B0FJF9V1JC comes from the search result title, which is exactly where the
-- roborock S8 MaxV Ultra investigation started before it turned out every
-- result carrying that name was an accessory kit. No offers row, no
-- redirect_links row, and neither may be added until Brand and Model Number
-- are confirmed first-party on that listing.
--
-- SPECS ARE FIRST-PARTY OR ABSENT. Everything in specs_json below was read
-- from yarbo.com on 11 August 2026. The "up to 4 hours" runtime that
-- circulates in third-party reviews is NOT carried: yarbo.com's own page says
-- approximately 90 minutes, and where the maker and a review site disagree the
-- maker wins. Yarbo's own throw-distance conflict is recorded as a conflict
-- rather than resolved by picking one — its module page prints "up to 40 feet"
-- and "6-40 Yards Throw Control" in the same panel.
--
-- STOCK IS LEFT NULL. A product in OFFER_SETUP_PENDING makes no availability
-- claim anywhere, and this one has zero owner reviews at Lowe's to reason from.
--
-- ONE STATEMENT PER ROW, safe to re-apply.

-- ---------- Brand ----------

INSERT INTO brands (id, slug, name) SELECT 'brand-yarbo', 'yarbo', 'Yarbo' WHERE NOT EXISTS (SELECT 1 FROM brands WHERE id = 'brand-yarbo');

-- ---------- Category ----------
-- The row exists so the product page's join resolves. Its `hidden` launch
-- state lives in content/nav.ts, not here — D1 has no launch column, and the
-- repo is where that decision belongs.

INSERT INTO categories (id, slug, name) SELECT 'cat-robot-snow-blowers', 'robot-snow-blowers', 'Robot Snow Blowers' WHERE NOT EXISTS (SELECT 1 FROM categories WHERE id = 'cat-robot-snow-blowers');

-- ---------- Product ----------

INSERT INTO products (id, slug, brand_id, category_id, product_class, name, model, environments, cleans, power_type, price_tier, status, specs_json) SELECT 'prod-yarbo-snow-blower', 'yarbo-snow-blower', 'brand-yarbo', 'cat-robot-snow-blowers', 'snow_blower', 'Yarbo Snow Blower', 'YARBO S1', '["open_sky", "tree_cover"]', '[]', 'cordless', 'ultra', 'published', '{"offerSetupPending": true, "offerSetupSince": "2026-08-11", "asinUnverified": "B0FJF9V1JC", "asinNote": "From the Amazon SEARCH RESULT TITLE only. The listing''s own details table could NOT be read — WebFetch returns the page head and this account''s DataForSEO merchant endpoints are not enabled. Identity rests on Lowe''s item 8256113, which publishes Model #YARBO S1, and Best Buy SKU J3Q5Q8G9GS, titled Black Yarbo S1. No buy link ships until Brand and Model Number are read first-party on Amazon.", "listPrice": "$4,999.00", "listPriceCovers": "Core + Snow Blower Module + Data Center + Y Series Battery + Docking Station + Snow Track + Tow Hitch + wired charger + install kit", "modulePrice": "$1,299.00", "modulePriceNote": "The Snow Blower Module ALONE, which needs a Core to run. The same phrase snow blower is quoted at both figures depending on the page, which is the single most useful thing this review can explain.", "bundlePrices": "Mower Pro + Snow Blower $7,199; complete 4-in-1 $7,999", "dealerPrices": "smart-dots.com lists Yarbo Core at $4,999 struck to $3,599; cnygreenteam.com lists a Modular Snow Blower Robot at $4,530. Both read 2026-08-11.", "readOn": "2026-08-11", "readVia": "yarbo.com, lowes.com item 8256113, bestbuy.com SKU J3Q5Q8G9GS", "availability": "unknown", "ownerReviews": "ZERO ratings at Lowe''s on 2026-08-11. Owner evidence exists off-retail instead: Reddit, Trustpilot and forum.yarbo.com, and the highest-ranking of it is a thread titled Extremely Disappointed with the Yarbo Snow Blower, position 3 on yarbo snow blower reviews.", "clearingWidthIn": 24, "intakeHeightIn": 12, "throwDistanceFt": "6-40, adjustable", "throwConflict": "Yarbo''s own Snow Blower Module page prints up to 40 FEET and 6-40 YARDS Throw Control in the same panel. One is wrong and both are Yarbo''s. Recorded as a conflict, not resolved.", "batteryAh": 38.4, "runtimeMin": 90, "runtimeConflict": "yarbo.com states approximately 90 minutes. Third-party reviews (electrokit.blog, lawncareguides.com) state up to 4 hours on a 36V/38.4Ah pack. First-party wins and the 4-hour figure is NOT carried.", "chargeMin": "90 (20% to 80%)", "areaPerChargeSqFt": 6000, "areaPerChargeNote": "At 1 inch of snow, per Yarbo", "maxSlopePct": 36, "maxSlopeDeg": 21, "operatingTempF": "-13 to +140", "construction": "Q355 steel", "ingressRating": "IPX5", "warranty": "Up to 5 years; 2 years standard coverage", "modularSystem": "1+N — one Core, four attachments: lawn mower, snow blower, leaf blower, trimmer. The Core is the same platform as Yarbo''s mower, which is why this review is cross-linked from the robotic-lawn-mowers hub.", "mSeriesNote": "The M Series is on Kickstarter pre-order and is not sold. Covered as a section of the review, never as a product row.", "specsReadOn": "2026-08-11", "specsReadFrom": "yarbo.com"}' WHERE NOT EXISTS (SELECT 1 FROM products WHERE id = 'prod-yarbo-snow-blower');
