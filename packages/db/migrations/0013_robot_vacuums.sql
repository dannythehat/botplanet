-- Robot vacuums — the first eleven products in the category with the most
-- search demand on the site and, until this file, no catalogue at all.
--
-- The hub has been live and empty since it shipped. Its keyword row is
-- `robot vacuum`, 135,000/mo, and the eleven product terms below total
-- 94,300/mo at KD 0 — researched 6 August, run 31090094137, and never built.
--
-- IDENTITY, verified 10 August 2026 through SerpAPI's Amazon engine on
-- amazon.com: `engine=amazon` for the keyword searches, `engine=amazon_product`
-- for a read of each pinned ASIN's own listing. Full record, including both
-- terms that did NOT resolve to the product the plan named, is
-- docs/commerce/robot-vacuums-identity.md.
--
-- TWO OF THE ELEVEN PLANNED TERMS DID NOT RESOLVE, and one of those is the
-- largest term in the category. They are recorded here because a reader of
-- this file six months from now will otherwise wonder why the names differ
-- from the plan:
--
--   roborock S8 MaxV Ultra (9,900/mo) — NO first-party listing on Amazon US.
--     Every result whose title contains that string is a third-party accessory
--     kit, $19.99 to $34.98. Accessories outliving the machine they fit is what
--     a superseded model looks like from outside. Built instead as the
--     S8 Max Ultra, B0D9B9LK9F, under its own name — a reader who searched for
--     the MaxV is served by being told what happened to it, and is not served
--     by a page that puts a name on a machine that does not carry it.
--
--   eufy S1 Pro (33,100/mo) — listed, but the search row carries NO PRICE and
--     3.2 stars from 776 ratings. Reading the ASIN's own page returns $919.58,
--     so it is buyable; it is also the worst-rated machine here by a distance,
--     and eufy's own line has moved to the Omni S2 and the C28. Built, because
--     33,100 people a month ask about it and refusing to write about it leaves
--     the biggest question in the category unanswered. Its page says all of it.
--
-- FOUR OF THE PLANNED TERMS ARE FAMILY NAMES, NOT MODELS. `roborock qrevo`,
-- `ecovacs deebot`, `shark powerdetect` and `shark matrix` each cover several
-- SKUs at different prices, and a family name cannot be a catalogue row. Each
-- is pinned to one machine, with the reason in the identity document and in
-- `specs_json` beside the ASIN it pins.
--
-- ALL ELEVEN ENTER AS OFFER_SETUP_PENDING, like the litter and lawn ten and
-- like Grillbot. Identity is confirmed and these belong in the hub, the
-- catalogue and the matcher; the commercial wiring is not built. No offers
-- row, no redirect_links row, and neither may be added without moving the
-- product out of that state. `stock_status` is left NULL throughout: the
-- product engine returned no availability field for any of the eleven, and a
-- product in this state must make no stock claim anywhere.
--
-- `cleans` AND `environments` ARE THE SCORING VOCABULARY, not description. The
-- vacuum matcher takes environment hard_floors / low_pile_carpet /
-- deep_pile_carpet and cleans mopping / mop_lifting / self_emptying /
-- obstacle_avoidance / multi_floor_mapping. A value outside those sets scores
-- nothing and the product silently never matches; a value asserted from memory
-- that the machine does not have makes it win a comparison it should lose.
--
-- EVERY ATTRIBUTE BELOW TRACES TO A PUBLISHED LINE — the pinned listing's own
-- title, which in this category carries the feature claims verbatim, plus a
-- direct read of the maker's page for the S8 Max Ultra, the Saros 10 and the
-- T90 PRO Omni where the title was thin.
--
-- THREE MAKER PAGES COULD NOT BE READ. dreame's X40 Ultra and X50 Ultra pages
-- and eufy's Omni S1 Pro page each returned 404 or truncated content to a
-- direct fetch on 10 August 2026. Those three are described from their Amazon
-- titles alone, and where a title is silent the attribute is LEFT OFF rather
-- than assumed — so the X40 Ultra carries no obstacle_avoidance and the X50
-- Ultra no mop_lifting, not because they lack them but because nothing we read
-- says they have them. Each review states this in as many words. Under-claiming
-- is recoverable by reading the page later; over-claiming is a bad
-- recommendation shipped today.
--
-- DEEP PILE IS CLAIMED BY EXACTLY ONE MACHINE and that is the honest state of
-- the category rather than a gap in the research. Only roborock states a
-- high-pile behaviour for the Saros 10 — chassis lifting 10mm, mop detaching
-- in vacuum-only modes. environmentMismatch is ON for this matcher, so a
-- reader who answers "deep or shag pile throughout" gets one answer and a
-- clear reason for it.
--
-- PRICE TIERS FOLLOW THE QUESTIONNAIRE'S OWN BANDS, not a general sense of
-- expensive: budget under $300, mid $300–600, premium $600–1,000, ultra over
-- $1,000. The spread that produces — one budget, six mid, three premium, one
-- ultra — is the shape of the shelf, not a target.
--
-- TWO OF THE ELEVEN DO NOT MOP AT ALL, and that is the single most useful
-- discrimination in the set. The Shark PowerDetect AV2820S is the self-empty
-- VACUUM in a family whose NeverTouch Pro sibling is the vacuum-and-mop, and
-- the Roomba Max 705 at B0DWG3C3ZF is the vacuum-only SKU whose $799 sibling
-- B0DWG15XKQ is the Combo with the mop and the AutoWash dock. Both are easy to
-- buy by accident and neither carries `mopping` here.
--
-- ONE STATEMENT PER ROW, guarded by NOT EXISTS — D1 rejects a compound SELECT
-- with this many terms, and the file must be safe to re-apply.

-- ---------- Brands ----------
-- eufy, Dreame and ECOVACS already exist from lawn and window.

INSERT INTO brands (id, slug, name) SELECT 'brand-roborock', 'roborock', 'roborock' WHERE NOT EXISTS (SELECT 1 FROM brands WHERE id = 'brand-roborock');
INSERT INTO brands (id, slug, name) SELECT 'brand-shark', 'shark', 'Shark' WHERE NOT EXISTS (SELECT 1 FROM brands WHERE id = 'brand-shark');
INSERT INTO brands (id, slug, name) SELECT 'brand-irobot', 'irobot', 'iRobot' WHERE NOT EXISTS (SELECT 1 FROM brands WHERE id = 'brand-irobot');

-- ---------- Products ----------

INSERT INTO products (id, slug, brand_id, category_id, product_class, name, model, environments, cleans, power_type, price_tier, status, specs_json) SELECT 'prod-eufy-x10-pro-omni', 'eufy-x10-pro-omni', 'brand-eufy', 'cat-robot-vacuums', 'robot_vacuum', 'eufy X10 Pro Omni', 'X10 Pro Omni', '["hard_floors", "low_pile_carpet"]', '["mopping", "mop_lifting", "self_emptying", "obstacle_avoidance", "multi_floor_mapping"]', 'cordless', 'mid', 'published', '{"offerSetupPending": true, "asinVerified": "B0CPFBBHP4", "readPrice": "$449.99", "readOn": "2026-08-10", "readVia": "serpapi amazon_product engine, listing read", "availability": "unknown", "amazonRating": "4.6 from 39,206 ratings, read 2026-08-10", "suctionPa": 8000, "mopLiftMm": 12, "evidence": "Listing title: Dual Mops with 12 mm Auto-Lift | 8,000 Pa Suction, Carpet Detection, AI Obstacle Avoidance, Auto Mop Washing, Auto Drying, Self-Emptying", "variationFamily": "B0CPFBBHP4 black / B0DG5G9HQM white — same price, one review pool; any link needs th=1&psc=1"}' WHERE NOT EXISTS (SELECT 1 FROM products WHERE id = 'prod-eufy-x10-pro-omni');
INSERT INTO products (id, slug, brand_id, category_id, product_class, name, model, environments, cleans, power_type, price_tier, status, specs_json) SELECT 'prod-eufy-omni-s1-pro', 'eufy-omni-s1-pro', 'brand-eufy', 'cat-robot-vacuums', 'robot_vacuum', 'eufy Omni S1 Pro', 'Omni S1 Pro', '["hard_floors"]', '["mopping", "self_emptying", "obstacle_avoidance"]', 'cordless', 'premium', 'published', '{"offerSetupPending": true, "asinVerified": "B0CTY6VT8Y", "readPrice": "$919.58", "readOn": "2026-08-10", "readVia": "serpapi amazon_product engine, listing read", "availability": "unknown", "amazonRating": "3.2 from 776 ratings, read 2026-08-10 — the lowest in the category by a distance", "suctionPa": 8000, "priceNote": "The Amazon SEARCH row for this ASIN returns NO PRICE. The listing read returns $919.58. A missing search price normally means no buy-box winner.", "supersessionNote": "eufy''s own current line is the Omni S2 (B0GVYTYNP7, $1,399.99) and the C28 (B0FWK41WF2, $499.99), whose listing describes itself as Upgraded from X10 Pro.", "noCarpetClaim": "The listing makes no carpet claim and no mop-lift claim, so this machine carries hard_floors only. Its roller mop is fixed. eufy''s own page could not be read on 10 August 2026.", "evidence": "Listing title: HydroJet System with Roller Mop, Eco-Clean Ozone, Obstacle Avoidance, Auto Mop Washing & Drying, Self-Emptying | 8000 Pa Suction"}' WHERE NOT EXISTS (SELECT 1 FROM products WHERE id = 'prod-eufy-omni-s1-pro');
INSERT INTO products (id, slug, brand_id, category_id, product_class, name, model, environments, cleans, power_type, price_tier, status, specs_json) SELECT 'prod-roborock-s8-max-ultra', 'roborock-s8-max-ultra', 'brand-roborock', 'cat-robot-vacuums', 'robot_vacuum', 'roborock S8 Max Ultra', 'S8 Max Ultra', '["hard_floors", "low_pile_carpet"]', '["mopping", "mop_lifting", "self_emptying", "obstacle_avoidance", "multi_floor_mapping"]', 'cordless', 'premium', 'published', '{"offerSetupPending": true, "asinVerified": "B0D9B9LK9F", "readPrice": "$949.99", "readOn": "2026-08-10", "readVia": "serpapi amazon_product engine, listing read, plus a direct read of us.roborock.com", "availability": "unknown", "amazonRating": "4.5 from 1,227 ratings, read 2026-08-10", "suctionPa": 8000, "mopLiftMm": 20, "namingNote": "This product stands in for the planned term roborock S8 MaxV Ultra, which has NO first-party listing on Amazon US — every result carrying that string is a third-party accessory kit. Built under its own name rather than the searched one.", "evidence": "Maker page: lifts up to 20mm above the ground while cleaning carpets; Reactive 3D Obstacle Avoidance using advanced 3D structured light technology; supports auto dust emptying after cleanups and during cleanups; 8000Pa HyperForce suction; Carpet Boost+ System"}' WHERE NOT EXISTS (SELECT 1 FROM products WHERE id = 'prod-roborock-s8-max-ultra');
INSERT INTO products (id, slug, brand_id, category_id, product_class, name, model, environments, cleans, power_type, price_tier, status, specs_json) SELECT 'prod-roborock-saros-10', 'roborock-saros-10', 'brand-roborock', 'cat-robot-vacuums', 'robot_vacuum', 'roborock Saros 10', 'Saros 10', '["hard_floors", "low_pile_carpet", "deep_pile_carpet"]', '["mopping", "mop_lifting", "self_emptying", "obstacle_avoidance", "multi_floor_mapping"]', 'cordless', 'ultra', 'published', '{"offerSetupPending": true, "asinVerified": "B0DLH247PS", "readPrice": "$1,299.99", "readOn": "2026-08-10", "readVia": "serpapi amazon_product engine, listing read, plus a direct read of us.roborock.com", "availability": "unknown", "amazonRating": "4.5 from 4,428 ratings, read 2026-08-10", "suctionPa": 22000, "heightIn": 3.14, "deepPileNote": "The ONLY machine of the eleven whose maker states a high-pile behaviour, which is why it is the only one carrying deep_pile_carpet.", "evidence": "Maker page: elevates the chassis up to 0.39 inches (10mm) on high-pile carpets, reducing suction port blockages from long fibers; the mop automatically detaches in modes where mopping is not needed, such as Vacuum Only and Vacuum Carpets First; ReactiveAI 3.0 Obstacle Recognition with front triple structured light, an RGB camera and VertiBeam lateral structured light; RockDock Ultra self-emptying", "siblingNote": "B0DLH45139 is the same model with no price and 94 ratings. Not pinned."}' WHERE NOT EXISTS (SELECT 1 FROM products WHERE id = 'prod-roborock-saros-10');
INSERT INTO products (id, slug, brand_id, category_id, product_class, name, model, environments, cleans, power_type, price_tier, status, specs_json) SELECT 'prod-roborock-qrevo-s5v', 'roborock-qrevo-s5v', 'brand-roborock', 'cat-robot-vacuums', 'robot_vacuum', 'roborock Qrevo S5V', 'Qrevo S5V', '["hard_floors", "low_pile_carpet"]', '["mopping", "mop_lifting", "self_emptying", "obstacle_avoidance"]', 'cordless', 'mid', 'published', '{"offerSetupPending": true, "asinVerified": "B0DSP8J476", "readPrice": "$499.98", "readOn": "2026-08-10", "readVia": "serpapi amazon_product engine, listing read", "availability": "unknown", "amazonRating": "4.3 from 1,625 ratings, read 2026-08-10", "suctionPa": 12000, "mopLiftMm": 10, "namingNote": "The planned term was the family name roborock qrevo, which covers the S5V, the Qrevo Series, the Edge 2 and the Qrevo 2 Pro at $499.98 to $879.99. Pinned to the S5V as the top organic result for that search.", "evidence": "Listing title: FlexiArm Edge Mopping | 12,000Pa, Dual Zero-Tangle System, Smart Obstacle Avoidance, 10mm Mop Lifting, Auto Mop Washing&Drying, Self-Emptying", "variationFamily": "B0DSP8J476 and B0FX4SZ4KB are the same machine at the same price sharing one review pool; any link needs th=1&psc=1"}' WHERE NOT EXISTS (SELECT 1 FROM products WHERE id = 'prod-roborock-qrevo-s5v');
INSERT INTO products (id, slug, brand_id, category_id, product_class, name, model, environments, cleans, power_type, price_tier, status, specs_json) SELECT 'prod-dreame-x40-ultra', 'dreame-x40-ultra', 'brand-dreame', 'cat-robot-vacuums', 'robot_vacuum', 'Dreame X40 Ultra', 'X40 Ultra', '["hard_floors", "low_pile_carpet"]', '["mopping", "mop_lifting", "self_emptying"]', 'cordless', 'mid', 'published', '{"offerSetupPending": true, "asinVerified": "B0CXDXKSXP", "readPrice": "$599.99", "readOn": "2026-08-10", "readVia": "serpapi amazon_product engine, listing read", "availability": "unknown", "amazonRating": "4.4 from 901 ratings, read 2026-08-10", "suctionPa": 12000, "underClaimNote": "NO obstacle_avoidance is recorded, and that is a gap in what we could read rather than a statement about the machine. Dreame''s own X40 Ultra page returned 404 or truncated content to a direct fetch on 10 August 2026, and the Amazon title does not claim obstacle avoidance. Re-read the maker page and revisit.", "evidence": "Listing title: Removable & Liftable Mop, 12,000Pa Suction, Side Brush Extensive Cleaning, 158F Mop & Washboard Self Cleaning, Auto-Empty, Auto Refill, liftable Brushes"}' WHERE NOT EXISTS (SELECT 1 FROM products WHERE id = 'prod-dreame-x40-ultra');
INSERT INTO products (id, slug, brand_id, category_id, product_class, name, model, environments, cleans, power_type, price_tier, status, specs_json) SELECT 'prod-dreame-x50-ultra', 'dreame-x50-ultra', 'brand-dreame', 'cat-robot-vacuums', 'robot_vacuum', 'Dreame X50 Ultra', 'X50 Ultra', '["hard_floors", "low_pile_carpet"]', '["mopping", "self_emptying", "obstacle_avoidance"]', 'cordless', 'premium', 'published', '{"offerSetupPending": true, "asinVerified": "B0DM5J52GC", "readPrice": "$999.99", "readOn": "2026-08-10", "readVia": "serpapi amazon_product engine, listing read", "availability": "unknown", "amazonRating": "4.5 from 815 ratings, read 2026-08-10", "suctionPa": 20000, "stepClimbIn": 2.36, "underClaimNote": "NO mop_lifting is recorded, and that is a gap in what we could read rather than a statement about the machine. Dreame''s own X50 Ultra page returned 404 to a direct fetch on 10 August 2026, and the Amazon title claims obstacle avoidance and 6cm obstacle crossing but says nothing about lifting the pads off carpet. Obstacle CROSSING is step climbing, not mop lifting, and the two are not the same claim.", "evidence": "Listing title: Auto-Empty and Mop Self-Cleaning, 20,000Pa Suction, Obstacle Avoidance and 360 Navigation, Corner to Edge Deep Cleaning, Detangling Brush | 2.36 in (6cm) Obstacle Crossing for Carpet", "siblingNote": "B0F3J51GW5 and B0F3HZFZBL at $989.99 are the Complete bundle, not the base machine."}' WHERE NOT EXISTS (SELECT 1 FROM products WHERE id = 'prod-dreame-x50-ultra');
INSERT INTO products (id, slug, brand_id, category_id, product_class, name, model, environments, cleans, power_type, price_tier, status, specs_json) SELECT 'prod-ecovacs-deebot-t90-pro-omni', 'ecovacs-deebot-t90-pro-omni', 'brand-ecovacs', 'cat-robot-vacuums', 'robot_vacuum', 'ECOVACS DEEBOT T90 PRO Omni', 'DEEBOT T90 PRO Omni', '["hard_floors", "low_pile_carpet"]', '["mopping", "mop_lifting", "self_emptying", "obstacle_avoidance", "multi_floor_mapping"]', 'cordless', 'mid', 'published', '{"offerSetupPending": true, "asinVerified": "B0GJ5S4V78", "readPrice": "$599.00", "readOn": "2026-08-10", "readVia": "serpapi amazon_product engine, listing read, plus a direct read of ecovacs.com", "availability": "unknown", "amazonRating": "4.4 from 395 ratings, read 2026-08-10", "suctionPa": 30000, "mopLiftMm": 15, "namingNote": "The planned term was the family name ecovacs deebot, which covers the T90 PRO Omni, the T50 MAX PRO Omni, the T80S Omni and the X12 OMNICYCLONE at $349 to $1,499.99. Pinned to the T90 PRO Omni as the top organic result for that search.", "evidence": "Maker page: AIVI 3D 4.0 Omni-Approach Technology, powered by the VLM model and deep learning neural networks; automatic mop lifting (mm): Y, 15mm; on carpets, the mop roller automatically lifts to prevent moisture; Auto Empty technology, up to 90 days of zero maintenance; 100% pickup rate for large debris on both hard floors and carpets"}' WHERE NOT EXISTS (SELECT 1 FROM products WHERE id = 'prod-ecovacs-deebot-t90-pro-omni');
INSERT INTO products (id, slug, brand_id, category_id, product_class, name, model, environments, cleans, power_type, price_tier, status, specs_json) SELECT 'prod-shark-powerdetect-av2820s', 'shark-powerdetect-av2820s', 'brand-shark', 'cat-robot-vacuums', 'robot_vacuum', 'Shark PowerDetect Self-Empty Robot Vacuum', 'AV2820S', '["hard_floors", "low_pile_carpet"]', '["self_emptying", "obstacle_avoidance", "multi_floor_mapping"]', 'cordless', 'mid', 'published', '{"offerSetupPending": true, "asinVerified": "B0CDJFHM4J", "readPrice": "$549.99", "readOn": "2026-08-10", "readVia": "serpapi amazon_product engine, listing read", "availability": "unknown", "amazonRating": "4.4 from 3,648 ratings, read 2026-08-10", "doesNotMop": "This SKU is the self-empty VACUUM. Its sibling the PowerDetect NeverTouch Pro, RV2820ZE at B0DDZSPNXQ, is the vacuum-and-mop at $599.99. Easy to buy by accident, so no mopping capability is recorded here.", "namingNote": "The planned term was the family name shark powerdetect, which covers the AV2820S, the NeverTouch Pro RV2820ZE and the UV Reveal RV3020XE at $549.99 to $849.99. Pinned to the AV2820S as the top organic result and the largest review pool in that family.", "evidence": "Listing title: Self-Empty Robot Vacuum, Black, AV2820S | NeverStuck, DirtDetect/EdgeDetect/FloorDetect, 30-Day HEPA Self-Empty Base, 360 LiDAR + 3D Object Detection"}' WHERE NOT EXISTS (SELECT 1 FROM products WHERE id = 'prod-shark-powerdetect-av2820s');
INSERT INTO products (id, slug, brand_id, category_id, product_class, name, model, environments, cleans, power_type, price_tier, status, specs_json) SELECT 'prod-shark-matrix-plus-ur2650ws', 'shark-matrix-plus-ur2650ws', 'brand-shark', 'cat-robot-vacuums', 'robot_vacuum', 'Shark Matrix Plus Robot Vacuum and Mop', 'UR2650WS', '["hard_floors", "low_pile_carpet"]', '["mopping", "self_emptying", "multi_floor_mapping"]', 'cordless', 'budget', 'published', '{"offerSetupPending": true, "asinVerified": "B0FDX7GFQX", "readPrice": "$279.99", "readOn": "2026-08-10", "readVia": "serpapi amazon_product engine, listing read", "availability": "unknown", "amazonRating": "4.6 from 35,917 ratings, read 2026-08-10 — the largest review pool of the eleven by an order of magnitude", "noMopLift": "The mop pad attaches by hand and there is no auto-lift claim. In a house with carpet the pad comes off before a carpet run, or it does not go on. That is the trade at this price and it is stated rather than hidden.", "noObstacleAvoidance": "360 LiDAR is mapping, not object recognition. Shark''s own PowerDetect line adds 3D Object Detection explicitly and this listing does not, so no obstacle_avoidance is recorded.", "namingNote": "The planned term was the family name shark matrix, which covers the Matrix Plus UR2650WS, the AI Ultra AV2501S and AV2511AE, and the Matrix Plus AV2613WA at $278.34 to $420.39. Pinned to the UR2650WS on review pool.", "evidence": "Listing title: Sonic Mopping, Matrix Clean, CleanEdge, HEPA 30-Day Self-Empty Base, 360 LiDAR Mapping, Self-Cleaning Brushroll, Wi-Fi"}' WHERE NOT EXISTS (SELECT 1 FROM products WHERE id = 'prod-shark-matrix-plus-ur2650ws');
INSERT INTO products (id, slug, brand_id, category_id, product_class, name, model, environments, cleans, power_type, price_tier, status, specs_json) SELECT 'prod-roomba-max-705', 'roomba-max-705', 'brand-irobot', 'cat-robot-vacuums', 'robot_vacuum', 'iRobot Roomba Max 705 Robot Vacuum', 'Max 705', '["hard_floors", "low_pile_carpet"]', '["self_emptying", "obstacle_avoidance", "multi_floor_mapping"]', 'cordless', 'mid', 'published', '{"offerSetupPending": true, "asinVerified": "B0DWG3C3ZF", "readPrice": "$499.00", "readOn": "2026-08-10", "readVia": "serpapi amazon_product engine, listing read", "availability": "unknown", "amazonRating": "4.3 from 741 ratings, read 2026-08-10", "doesNotMop": "This SKU is the VACUUM. B0DWG15XKQ at $799 is the Roomba Max 705 COMBO — a different machine with a mop and an AutoWash dock, not a variant of this one, and it has its own review pool of 4,800. Two products one word apart, so no mopping capability is recorded here.", "evidence": "Listing title: Robot Vacuum with AutoEmpty Dock, Powerful Suction, Dual Rubber Anti-Tangle Brushes, LiDAR Navigation, Obstacle & Anti-Fall Detection, for Carpet and Hard Floors"}' WHERE NOT EXISTS (SELECT 1 FROM products WHERE id = 'prod-roomba-max-705');
