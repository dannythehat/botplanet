-- Self-cleaning litter boxes — the attributes that actually separate them.
--
-- THREE OF THE FOUR WERE BYTE-IDENTICAL ON EVERY SCORED FIELD. Litter-Robot 4,
-- PETKIT Purobot Max Pro 2 and Casa Leo's Leo's Loo Too all carried
-- environments ["average_cat","large_cat"], cleans ["odor_sealing",
-- "multi_cat_capacity","health_monitoring","app_control"] and price_tier
-- 'premium'. The matcher returned a three-way tie under every answer set
-- anybody tried, and it was right to: the recorded data could not separate
-- them. Nothing about the scoring engine could fix that.
--
-- SPECIFICATIONS READ FROM EACH MAKER'S OWN PAGE, 10 August 2026. Full record
-- with the quotes: docs/commerce/litter-box-attributes.md.
--
--   Litter-Robot 4       3–25 lb    entry 15.75 x 15.75 in, globe 16.5 in high
--   PETKIT Max Pro 2     3.3–22 lb  entry 10.51 x 10.74 in, 10.03 in high
--   Leo's Loo Too        1–20 lb    "accommodates cats up to 20 lbs (9 kg)"
--   ScoopFree Crystal Pro  not published by PetSafe
--
-- TWO CORRECTIONS FOLLOW FROM THAT, AND BOTH CHANGE WHO GETS RECOMMENDED.
--
-- LEO'S LOO TOO LOSES `large_cat`. The vocabulary defines it as "Maine Coon and
-- up — chamber size, not sensor, is the limit", and Casa Leo's own words are
-- "spacious drum accommodates cats up to 20 lbs (9 kg)". A male Maine Coon
-- routinely passes 20 lb. Sending that reader to a box whose maker states 20 lb
-- as the ceiling is the exact failure the environment axis was built to stop,
-- and the fact that it was the machine winning that answer alphabetically makes
-- it worse rather than better.
--
-- LEO'S LOO TOO GAINS `kitten`, AND IT IS THE ONLY ONE. Casa Leo states "our
-- system works with cats as light as 1 lb". Whisker's minimum is 3 lb and
-- PETKIT's is 3.3 lb, so a kitten under three pounds is not detected by either
-- — the machine cannot know it is in there. Nothing in the category carried
-- `kitten` before this file, which meant a reader who answered "a kitten, or
-- very small" was matched against an axis no product claimed.
--
-- AND THE FUNNEL HAS ALWAYS ASKED A QUESTION IT COULD NOT ACT ON. "Would you
-- buy the manufacturer's own litter refills?" carries the hint "Rules out the
-- sealed-tray systems" and scored nothing, because there was no capability for
-- the answer to land on. `any_litter` is added to the shared vocabulary with
-- this file and set from each maker's own statement:
--
--   Litter-Robot 4    "standard clumping clay litter"; plant-based and
--                     non-clumping are not compatible. Any shop.        YES
--   PETKIT Max Pro 2  most clumping litter under 12 mm particle length,
--                     with two sifters supplied for tofu/mixed and for
--                     bentonite/clay. Any shop, widest range here.      YES
--   Leo's Loo Too     100% clay-clumping only, any brand — Casa Leo
--                     states other litters void the warranty and the
--                     90-day trial. Any shop, one type.                 YES
--   ScoopFree Pro     "Only compatible with official PetSafe ScoopFree
--                     Disposable Crystal Litter Trays or Reusable
--                     Litter Trays." Locked to the maker for life.      NO
--
-- The PetSafe is not being punished for a design choice — a sealed tray is why
-- it goes thirty days untouched, which is a real advantage. It is being
-- described accurately, so the reader who said they want ordinary litter stops
-- being shown it and the reader who did not still can be.
--
-- WHAT THIS FILE DOES NOT FIX. For a reader with an average-sized cat who wants
-- all four capabilities, Litter-Robot 4 and PETKIT Max Pro 2 remain tied at the
-- premium tier, and that is honest: on everything recorded they do the same
-- things. What would separate them is not in any scored column — the PETKIT
-- recognises individual cats by face and analyses clumps, the Whisker gates two
-- years of health history behind Whisker+ while showing seven days free, and
-- their entrances differ by five inches in width. Those belong in the reviews
-- this category still does not have.
--
-- ONE STATEMENT PER ROW. D1 rejects a compound UPDATE with this many terms and
-- the file must be safe to re-apply.

-- Casa Leo's Leo's Loo Too: kitten in, large_cat out, ordinary litter recorded.
UPDATE products SET environments = '["kitten", "average_cat"]' WHERE id = 'prod-casa-leo-loo-too';
UPDATE products SET cleans = '["odor_sealing", "multi_cat_capacity", "health_monitoring", "app_control", "any_litter"]' WHERE id = 'prod-casa-leo-loo-too';

-- Litter-Robot 4: takes standard clumping clay from any shop.
UPDATE products SET cleans = '["odor_sealing", "multi_cat_capacity", "health_monitoring", "app_control", "any_litter"]' WHERE id = 'prod-litter-robot-4';

-- PETKIT Purobot Max Pro 2: takes most clumping litter, two sifters supplied.
UPDATE products SET cleans = '["odor_sealing", "multi_cat_capacity", "health_monitoring", "app_control", "any_litter"]' WHERE id = 'prod-petkit-purobot-max-pro-2';

-- PetSafe ScoopFree Crystal Pro keeps its cleans unchanged: no any_litter, by
-- design and by the maker's own words.

-- ---------- The figures, recorded where they can be read back ----------

UPDATE products SET specs_json = json_patch(COALESCE(specs_json, '{}'), '{"catWeightLbs": "3-25", "entryInches": "15.75 x 15.75", "globeHeightInches": 16.5, "litterType": "Standard clumping clay; plant-based and non-clumping are not compatible", "wasteDrawer": "As little as once every 8 days, depending on cats", "healthHistory": "7 days free in the Whisker app; up to 2 years with a Whisker+ subscription", "warranty": "1 year; 3 years for $100", "specsReadOn": "2026-08-10", "specsReadFrom": "litter-robot.com"}') WHERE id = 'prod-litter-robot-4';

UPDATE products SET specs_json = json_patch(COALESCE(specs_json, '{}'), '{"catWeightLbs": "3.3-22", "entryInches": "10.51 x 10.74", "entranceHeightInches": 10.03, "cylinderLitres": 76, "wasteBinLitres": 8, "wasteInterval": "17 days", "litterType": "Most clumping litter under 12 mm particle length; sifters supplied for tofu/mixed and for bentonite/clay", "model": "P9904", "litterBoxWeightLbs": 24.25, "specsReadOn": "2026-08-10", "specsReadFrom": "petkit.com"}') WHERE id = 'prod-petkit-purobot-max-pro-2';

UPDATE products SET specs_json = json_patch(COALESCE(specs_json, '{}'), '{"catWeightLbs": "1-20", "makerWords": "Spacious drum accommodates cats up to 20 lbs (9 kg); our system works with cats as light as 1 lb", "wasteDrawerLitres": 9.5, "noiseDb": 30, "litterType": "100% clay-clumping only, any brand; other litters void the warranty and the 90-day trial", "warranty": "1 year, 3-year extension sold separately", "largeCatNote": "large_cat REMOVED 2026-08-10. The maker states 20 lb as the ceiling and a male Maine Coon routinely passes it.", "specsReadOn": "2026-08-10", "specsReadFrom": "casaleopet.com"}') WHERE id = 'prod-casa-leo-loo-too';

UPDATE products SET specs_json = json_patch(COALESCE(specs_json, '{}'), '{"catWeightLbs": null, "catWeightNote": "PetSafe does not publish a weight limit for the Crystal Pro. The Crystal CLASSIC is stated at 15 lb; that figure belongs to a different machine and is not carried over here.", "dimensionsInches": "28.2 x 20.4 x 16", "litterType": "Only compatible with official PetSafe ScoopFree Disposable Crystal Litter Trays or Reusable Litter Trays", "anyLitterNote": "any_litter deliberately NOT set. The sealed tray is why it runs 30 days untouched — a real advantage — and it is also a running cost locked to the maker for the life of the machine.", "app": "None. A digital display health counter, no Wi-Fi and no app.", "wasteInterval": "Up to 30 days", "amazonRating": "3.1 from 184 ratings, read 2026-08-10 — the lowest of the four", "specsReadOn": "2026-08-10", "specsReadFrom": "petsafe.com"}') WHERE id = 'prod-petsafe-scoopfree-crystal-pro';
