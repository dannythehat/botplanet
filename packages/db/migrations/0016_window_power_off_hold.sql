-- Window-cleaning robots — what happens when the power cuts, and one machine
-- that was filed as needing a socket it does not need.
--
-- NINE OF THE ELEVEN WINDOW ROBOTS SHARED A SCORING FINGERPRINT — identical
-- price tier, environments and cleans — including one group of five. The
-- matcher returned a ten-way tie on one answer set. It was right to: the
-- recorded data could not separate them, and the facts that would are safety
-- facts that were not in any scored column.
--
-- THE CORRECTION FIRST, BECAUSE IT CHANGES A RECOMMENDATION.
--
-- THE WINBOT W3 OMNI WAS RECORDED AS CORDED AND IT IS NOT. ECOVACS states it
-- has "a built-in battery" delivering "up to 130 minutes of continuous
-- cleaning on a single charge", and it ships with the same portable station
-- architecture as the W2 PRO OMNI — which this catalogue already records as
-- cordless.
--
-- That matters because of the question the window funnel asks second: "Is
-- there a power socket near the windows?" A reader answering "No — stairwell,
-- landing, awkward spot" scores power_pref cordless, and the W3 OMNI — the
-- flagship built to solve exactly that problem — was scoring ZERO on the power
-- factor and losing to machines that need a wall socket. Same shape as the
-- eufy E15's rated area: a field nobody checked, on an axis that decides the
-- answer.
--
-- AND THEN THE THING NOBODY RECORDED AT ALL.
--
-- What happens when the mains cuts while the machine is stuck to a third-floor
-- window is the question that stops people buying in this category, and no
-- column held the answer. Read from each maker on 10 August 2026:
--
--   WINBOT W2 PRO OMNI   30 min     ECOVACS specification
--   WINBOT W2 PRO        30 min     ECOVACS specification
--   WINBOT W2S           30 min     "maintains suction for 30 minutes if power is lost"
--   WINBOT MINI          30 min     the same figure ECOVACS prints for its flagships
--   WINBOT W3 OMNI       130 min    it does not depend on the mains at all — its own battery
--   HOBOT-2S             20 min     "embedded UPS keeps HOBOT in position for 20 minutes with audio alert"
--   HOBOT-298            20 min     the same wording
--   Cop Rose X5S         ~20 min    "UPS electrical storage device"; keeps adsorption, warning sound
--   Mamibot W120-DP      20-30 min  manual: "when UPS is fully charged... stay on the working surface for 20-30 minutes"
--   HUTT S55 Pro         yes        emergency backup battery; DURATION NOT PINNED for this SKU
--   WINBOT W1 PRO        NO         see below
--
-- TEN OF ELEVEN HOLD, WHICH IS NOT THE SPLIT WE EXPECTED. A capability ten of
-- eleven products have barely discriminates, and recording it anyway is still
-- right — because the eleventh is the one that matters.
--
-- THE WINBOT W1 PRO DOES NOT HOLD. ECOVACS lists "Power-off protection: Yes"
-- and the safety copy explains what it means: "the WINBOT W1 PRO arrests fall
-- with a safety carabiner and tether". A carabiner is not power continuity.
-- There is no backup battery and no stated duration anywhere we could read, so
-- the machine stops holding the moment the socket does and the tether is what
-- catches it. That is a genuine rule-out for exterior glass above the ground
-- floor and it was invisible in every comparison on this site.
--
-- HUTT IS RECORDED AS HOLDING WITHOUT A DURATION. HUTT publishes an emergency
-- backup battery and a 148 kg safety rope for the S55 Pro; the durations in
-- circulation — 25 and 30 minutes — attach to other HUTT models and are NOT
-- carried across. The capability is real, the number is not ours to print.
--
-- The `window_height` question in the funnel has asked how high the windows
-- are since the category shipped and nothing read the answer. It does now, for
-- every answer except ground floor: a robot that falls off a ground-floor
-- window lands on the lawn, and ruling a machine out on a risk the reader told
-- us they do not carry would be worse than not asking.
--
-- ONE STATEMENT PER ROW, safe to re-apply.

-- ---------- The correction ----------

UPDATE products SET power_type = 'cordless' WHERE id = 'prod-ecovacs-winbot-w3-omni';

-- ---------- power_off_hold: the ten that have it ----------

UPDATE products SET cleans = '["glass_interior", "glass_exterior", "power_off_hold"]' WHERE id = 'prod-ecovacs-winbot-w2-pro-omni';
UPDATE products SET cleans = '["glass_interior", "glass_exterior", "power_off_hold"]' WHERE id = 'prod-ecovacs-winbot-w2-pro';
UPDATE products SET cleans = '["glass_interior", "glass_exterior", "power_off_hold"]' WHERE id = 'prod-ecovacs-winbot-w2s';
UPDATE products SET cleans = '["glass_interior", "glass_exterior", "power_off_hold"]' WHERE id = 'prod-ecovacs-winbot-mini';
UPDATE products SET cleans = '["glass_interior", "glass_exterior", "power_off_hold"]' WHERE id = 'prod-ecovacs-winbot-w3-omni';
UPDATE products SET cleans = '["glass_interior", "glass_exterior", "power_off_hold"]' WHERE id = 'prod-hobot-2s';
UPDATE products SET cleans = '["glass_interior", "glass_exterior", "power_off_hold"]' WHERE id = 'prod-hobot-298';
UPDATE products SET cleans = '["glass_interior", "glass_exterior", "power_off_hold"]' WHERE id = 'prod-mamibot-w120-dp';
UPDATE products SET cleans = '["glass_interior", "glass_exterior", "power_off_hold"]' WHERE id = 'prod-cop-rose-x5s';
UPDATE products SET cleans = '["glass_interior", "glass_exterior", "glass_sloped", "power_off_hold"]' WHERE id = 'prod-hutt-s55-pro';

-- prod-ecovacs-winbot-w1-pro keeps its cleans unchanged. No power_off_hold, by
-- ECOVACS' own description of what its power-off protection is.

-- ---------- The evidence, recorded where it can be read back ----------

UPDATE products SET specs_json = json_patch(COALESCE(specs_json, '{}'), '{"powerOffHoldMin": 30, "powerOffHoldSource": "ECOVACS specification", "specsReadOn": "2026-08-10", "specsReadFrom": "ecovacs.com"}') WHERE id = 'prod-ecovacs-winbot-w2-pro-omni';
UPDATE products SET specs_json = json_patch(COALESCE(specs_json, '{}'), '{"powerOffHoldMin": 30, "powerOffHoldSource": "ECOVACS specification", "specsReadOn": "2026-08-10", "specsReadFrom": "ecovacs.com"}') WHERE id = 'prod-ecovacs-winbot-w2-pro';
UPDATE products SET specs_json = json_patch(COALESCE(specs_json, '{}'), '{"powerOffHoldMin": 30, "powerOffHoldSource": "ECOVACS: maintains suction for 30 minutes if power is lost", "suction": "8,000 Pa optimised", "spray": "3-nozzle wide-angle spray atomization", "specsReadOn": "2026-08-10", "specsReadFrom": "ecovacs.com"}') WHERE id = 'prod-ecovacs-winbot-w2s';
UPDATE products SET specs_json = json_patch(COALESCE(specs_json, '{}'), '{"powerOffHoldMin": 30, "powerOffHoldSource": "ECOVACS specification — the same figure it prints for its flagships", "specsReadOn": "2026-08-10", "specsReadFrom": "ecovacs.com"}') WHERE id = 'prod-ecovacs-winbot-mini';
UPDATE products SET specs_json = json_patch(COALESCE(specs_json, '{}'), '{"powerOffHold": "Does not depend on the mains — built-in battery, up to 130 minutes of continuous cleaning on a charge", "powerTypeNote": "Corrected from corded to cordless on 2026-08-10. It carries its own battery and a portable station, the same architecture as the W2 PRO OMNI, and was scoring zero on the power factor for readers who said there is no socket near the windows.", "suctionMoving": "3,300 Pa +/-100", "suctionSafety": "10,000 Pa optimised fall-protection", "autoSpray": "Yes — three-nozzle wide-angle, 6 nozzles, 80ml +/-5 tank", "safetyCable": "Two-in-one power and safety cable, three-layer composite, tensile strength up to 100 kg, plus a 1 m safety rope at the station base", "specsReadOn": "2026-08-10", "specsReadFrom": "ecovacs.com"}') WHERE id = 'prod-ecovacs-winbot-w3-omni';
UPDATE products SET specs_json = json_patch(COALESCE(specs_json, '{}'), '{"powerOffHoldMin": 20, "powerOffHoldSource": "HOBOT: embedded UPS keeps HOBOT in position for 20 minutes with audio alert", "specsReadOn": "2026-08-10", "specsReadFrom": "hobot.com.tw"}') WHERE id = 'prod-hobot-2s';
UPDATE products SET specs_json = json_patch(COALESCE(specs_json, '{}'), '{"powerOffHoldMin": 20, "powerOffHoldSource": "HOBOT: the embedded UPS keeps HOBOT staying in position with alerting sound for 20 minutes", "specsReadOn": "2026-08-10", "specsReadFrom": "hobot.com.tw"}') WHERE id = 'prod-hobot-298';
UPDATE products SET specs_json = json_patch(COALESCE(specs_json, '{}'), '{"powerOffHoldMin": 20, "powerOffHoldSource": "Cop Rose: UPS electrical storage device — keeps adsorption about 20 minutes, will not move forward, issues a warning sound", "specsReadOn": "2026-08-10"}') WHERE id = 'prod-cop-rose-x5s';
UPDATE products SET specs_json = json_patch(COALESCE(specs_json, '{}'), '{"powerOffHoldMin": "20-30", "powerOffHoldSource": "Mamibot manual: when UPS is fully charged, it supports W120-DP to stay on the working surface for 20-30 minutes", "spray": "Dual-directional 4-nozzle motorised", "bodyDepthCm": 6.9, "weightKg": 1.4, "specsReadOn": "2026-08-10", "specsReadFrom": "mamibot.com"}') WHERE id = 'prod-mamibot-w120-dp';
UPDATE products SET specs_json = json_patch(COALESCE(specs_json, '{}'), '{"powerOffHold": "Yes — emergency backup battery. DURATION NOT PINNED: the 25 and 30 minute figures in circulation attach to other HUTT models and are not carried across to this SKU.", "safetyRopeKg": 148, "pressureCompensationSec": 0.04, "specsReadOn": "2026-08-10"}') WHERE id = 'prod-hutt-s55-pro';
UPDATE products SET specs_json = json_patch(COALESCE(specs_json, '{}'), '{"powerOffHold": "NO. ECOVACS lists power-off protection: Yes, and its own safety copy explains it as arresting a fall with a safety carabiner and tether. No backup battery and no stated duration anywhere we could read — it stops holding when the socket does.", "batteryMah": 650, "workingTimeMin": 60, "specsReadOn": "2026-08-10", "specsReadFrom": "ecovacs.com"}') WHERE id = 'prod-ecovacs-winbot-w1-pro';
