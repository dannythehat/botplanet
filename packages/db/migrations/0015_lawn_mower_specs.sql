-- Robotic lawn mowers — the specifications, and one rated area that was wrong.
--
-- The seven mowers have been published since 8 August with verified identity
-- and no specification beyond a price tier, an environment pair and a rated
-- area. This is the read that fills that in, taken from each maker's own pages
-- on 10 August 2026.
--
-- THE EUFY E15'S RATED AREA WAS OVERSTATED BY 26% AND THAT IS A HARD EXCLUSION.
-- The catalogue recorded 10,890 sq ft, which is a quarter-acre and a round
-- number somebody reached for. eufy states "up to 800 m²", which is 8,611 sq ft.
--
-- This matters more than a typo normally would, because `poolTooLong` is ON for
-- the lawn config: rated area is not a ranking factor there, it is a rule-out.
-- A reader with 10,000 sq ft of grass was being offered a machine its own maker
-- rates for 8,611, and being offered it as a FIT rather than as a stretch. That
-- is the single most consequential kind of error this catalogue can hold, and it
-- was introduced by rounding a metric figure to the nearest familiar acre
-- fraction rather than converting it.
--
-- Corrected to 8,611. The other six were checked against the same sources and
-- are right: Navimow i110N and Dreame A3 AWD 1000 at a quarter acre, WORX WR320
-- and Husqvarna 410iQ at a half, LUBA 3 AWD 1500H at 0.37 and 3000H at 0.75.
--
-- SLOPE IS THE OTHER FIGURE THAT DECIDES THIS CATEGORY and nothing recorded it.
-- The `grass_slopes` capability is a yes or no, and behind that flag sit numbers
-- that are not close to each other:
--
--     Mammotion LUBA 3 AWD    80%  (38.6°)   all-wheel drive
--     Dreame A3 AWD 1000      80%  (38.7°)   all-wheel drive
--     Husqvarna 410iQ         45%            15% at the boundary
--     Segway Navimow i110N    30%  (17°)
--     WORX Landroid WR320     30%  (17°)
--     eufy E15                18°
--
-- The three carrying `grass_slopes` are exactly the three above 45%, so the flag
-- itself is right and is not being changed. The figures go into specs_json so
-- the reviews can print them, because "handles slopes" covering both 45% and
-- 80% is the kind of shared word that hides the difference a reader with a bank
-- needs to see.
--
-- NAVIGATION IS RECORDED FOR THE SAME REASON. All seven are wire-free and the
-- `open_sky` / `tree_cover` environment pair already captures the make-or-break
-- — a satellite-positioned mower is defeated by a canopy and a camera-navigated
-- one is not — but the pair does not say WHICH system each machine uses, and
-- that is the first thing a buyer under trees asks.
--
-- ONE STATEMENT PER ROW, safe to re-apply.

-- ---------- The correction ----------

UPDATE products SET max_pool_area_sqft = 8611 WHERE id = 'prod-eufy-e15';

-- ---------- The specifications ----------

UPDATE products SET specs_json = json_patch(COALESCE(specs_json, '{}'), '{"ratedArea": "800 m2 (8,611 sq ft)", "ratedAreaNote": "Corrected 2026-08-10 from 10,890 sq ft, which was a quarter acre rounded rather than converted. eufy states up to 800 m2.", "maxSlopeDeg": 18, "cuttingWidthIn": 8, "cuttingHeightIn": "1-3", "navigation": "Pure vision FSD — high-precision cameras and algorithms, no wires and no RTK station", "cameraFov": "96 degrees horizontal, 80 degrees vertical", "specsReadOn": "2026-08-10", "specsReadFrom": "eufy.com"}') WHERE id = 'prod-eufy-e15';

UPDATE products SET specs_json = json_patch(COALESCE(specs_json, '{}'), '{"ratedArea": "1/4 acre (10,890 sq ft)", "maxSlopePct": 30, "maxSlopeDeg": 17, "cuttingHeightIn": "2-3.6", "navigation": "Network RTK with no local antenna, plus VisionFence", "networkRtkNote": "Segway states Network RTK access is included at no extra cost and the cellular data is provided free of charge", "obstacleAvoidance": "VisionFence identifies over 150 objects across animals, tools and everyday obstacles", "specsReadOn": "2026-08-10", "specsReadFrom": "navimow.segway.com"}') WHERE id = 'prod-navimow-i110n';

UPDATE products SET specs_json = json_patch(COALESCE(specs_json, '{}'), '{"ratedArea": "0.37 acre (16,117 sq ft)", "maxSlopePct": 80, "maxSlopeDeg": 38.6, "drive": "All-wheel drive", "cuttingHeightIn": "Standard 1.0-2.7; High version 2.2-4.0", "navigation": "360 degree LiDAR plus AI vision", "battery": "Up to 15Ah", "runtimeMin": 215, "specsReadOn": "2026-08-10", "specsReadFrom": "us.mammotion.com"}') WHERE id = 'prod-luba-3-awd-1500h';

UPDATE products SET specs_json = json_patch(COALESCE(specs_json, '{}'), '{"ratedArea": "0.75 acre (32,670 sq ft)", "maxSlopePct": 80, "maxSlopeDeg": 38.6, "drive": "All-wheel drive", "cuttingHeightIn": "Standard 1.0-2.7; High version 2.2-4.0", "navigation": "360 degree LiDAR plus AI vision", "battery": "Up to 15Ah", "runtimeMin": 215, "specsReadOn": "2026-08-10", "specsReadFrom": "us.mammotion.com"}') WHERE id = 'prod-luba-3-awd-3000h';

UPDATE products SET specs_json = json_patch(COALESCE(specs_json, '{}'), '{"ratedArea": "0.5 acre, plus or minus 20%", "ratedAreaNote": "Husqvarna states 0.5 acre systematically and 0.25 acre in irregular patterns — the only maker of the seven to publish two figures for two lawn shapes", "maxSlopePct": 45, "maxSlopeBoundaryPct": 15, "cuttingWidthIn": 9.4, "blades": "3 pivoting razor blades", "cuttingHeightIn": "1-4, electric adjustment", "navigation": "EPOS — multiple satellites plus the national cellular network, centimetre accurate; physical or virtual boundary", "obstacleHandling": "Onboard radar, lift sensor, tilt sensor", "battery": "5Ah Li-Ion", "runtimeMin": 84, "chargeMin": 108, "noiseDb": 62, "warranty": "4 years", "specsReadOn": "2026-08-10", "specsReadFrom": "husqvarna.com"}') WHERE id = 'prod-automower-410iq';

UPDATE products SET specs_json = json_patch(COALESCE(specs_json, '{}'), '{"ratedArea": "1/2 acre (21,780 sq ft)", "maxSlopePct": 30, "maxSlopeDeg": 17, "cuttingWidthIn": 8.7, "cuttingHeightIn": "1.57-3.54, electronic adjustment", "navigation": "Vision AI plus RTK Cloud — no on-site antenna", "camera": "High dynamic range full HD wide angle with auto white balance", "specsReadOn": "2026-08-10", "specsReadFrom": "worx.com"}') WHERE id = 'prod-worx-landroid-vision-wr320';

UPDATE products SET specs_json = json_patch(COALESCE(specs_json, '{}'), '{"ratedArea": "1,000 m2 (0.25 acre)", "maxSlopePct": 80, "maxSlopeDeg": 38.7, "drive": "All-wheel drive", "cuttingHeightIn": "1.2-3.9", "navigation": "OmniSense 3.0 — 360 degree 3D LiDAR plus binocular AI vision", "edgeTrim": "EdgeMaster trims to within 1.91 in of a fence line", "obstacleCrossingIn": 2.17, "specsReadOn": "2026-08-10", "specsReadFrom": "dreametech.com"}') WHERE id = 'prod-dreame-a3-awd-1000';
