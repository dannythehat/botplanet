-- Rename the BuBlue Bubot 800P's offer IDs and redirect keys — PART TWO, THE
-- REMOVAL.
--
-- DO NOT APPLY THIS UNTIL THE CODE THAT STOPPED USING THE OLD KEYS IS LIVE.
-- 0006 added the new rows and left the old ones in place, so both key pairs
-- resolve during the overlap. This one ends the overlap. Applied against a
-- production still running the old REDIRECT_KEYS it would 404 the Bubot's buy
-- button, which is the single most damaging failure this site has: the reader
-- trusts the page and the click earns nothing.
--
-- After this, `/go/pool-dolphin-premier-amazon` is served by the forwarding map
-- in apps/web/src/pages/go/[key].ts, which 301s to the new key. Anything pasted
-- into an email or saved in a browser keeps working; it just takes one more hop.
--
-- Order matters: the click and price history move off the old offer IDs before
-- those rows go, and the redirect_links rows go before the offers they
-- reference.

-- History follows the offer, so the record of what this row earned is not split
-- across two IDs for the same machine.
UPDATE click_events SET offer_id = 'off-bubot800p-leslies' WHERE offer_id = 'off-premier-leslies';
UPDATE click_events SET offer_id = 'off-bubot800p-amazon'  WHERE offer_id = 'off-premier-amazon';
UPDATE click_events SET redirect_key = 'pool-bublue-bubot800p-leslies' WHERE redirect_key = 'pool-dolphin-premier-leslies';
UPDATE click_events SET redirect_key = 'pool-bublue-bubot800p-amazon'  WHERE redirect_key = 'pool-dolphin-premier-amazon';

-- Empty at the time of writing; correct anyway, because a migration that only
-- handles the rows that happen to exist is one that breaks the first time
-- somebody backfills.
UPDATE offer_price_history SET offer_id = 'off-bubot800p-leslies' WHERE offer_id = 'off-premier-leslies';
UPDATE offer_price_history SET offer_id = 'off-bubot800p-amazon'  WHERE offer_id = 'off-premier-amazon';

DELETE FROM redirect_links WHERE key IN ('pool-dolphin-premier-leslies', 'pool-dolphin-premier-amazon');
DELETE FROM offers WHERE id IN ('off-premier-leslies', 'off-premier-amazon');
