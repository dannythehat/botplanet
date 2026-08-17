-- Cozmo and Moxie: two products that exist so we can tell people not to buy them.
--
-- WHY THEY ARE CATALOGUE ROWS AT ALL. A review page renders from a product row,
-- so a rule-out review needs one like any other. What it does NOT get is an
-- offer: there are no rows in `offers` or `redirect_links` for either of these
-- and there must not be. Both pages route the reader to machines we do
-- recommend and neither carries a buy button. The same shape as
-- prod-living-ai-emo, which has been live since 8 August 2026 for the same
-- reason — a term worth owning attached to a product we will not sell.
--
-- COZMO. Anki's 2016 robot, relaunched by Digital Dream Labs as Cozmo 2.0 and
-- listed at $399.99 on the company's own store, where it has been "COMING SOON"
-- with a Sold Out button and no ship date. The Pennsylvania Attorney General
-- sued Digital Dream Labs and its CEO on 18 September 2024 over roughly 14,000
-- prepaid orders that were never fulfilled. Filed under coding robots because
-- that is the shelf a buyer is standing at when they search it, and the whole
-- job of the page is to move them along it.
--
-- MOXIE. Embodied's $799 child companion. The company ceased operations and the
-- robots stopped working; what is left runs only on a community server somebody
-- else built. Filed under companion robots.
--
-- Brands are their own rows because the review names the company, and in both
-- cases the company is the story rather than the hardware.

INSERT INTO brands (id, slug, name)
SELECT 'brand-digital-dream-labs', 'digital-dream-labs', 'Digital Dream Labs'
WHERE NOT EXISTS (SELECT 1 FROM brands WHERE id = 'brand-digital-dream-labs');

INSERT INTO brands (id, slug, name)
SELECT 'brand-embodied', 'embodied', 'Embodied'
WHERE NOT EXISTS (SELECT 1 FROM brands WHERE id = 'brand-embodied');

INSERT INTO products (
  id, slug, brand_id, category_id, product_class, name, model,
  environments, cleans, power_type, price_tier, status, specs_json
)
SELECT
  'prod-cozmo', 'cozmo', 'brand-digital-dream-labs', 'cat-coding-robots',
  'coding_robot', 'Cozmo 2.0', 'Cozmo 2.0',
  '[]', '["coding_education","play_interaction"]', 'cordless', 'premium', 'published',
  '{"note":"NO OFFER, DELIBERATELY. Listed at $399.99 on the maker''s own store as COMING SOON with a Sold Out button and no ship date, checked 8 August 2026. The Pennsylvania Attorney General sued Digital Dream Labs and its CEO on 18 September 2024 over roughly 14,000 prepaid orders that went unfulfilled. This page recommends alternatives and carries no buy button.","checkedOn":"2026-08-08"}'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE id = 'prod-cozmo');

INSERT INTO products (
  id, slug, brand_id, category_id, product_class, name, model,
  environments, cleans, power_type, price_tier, status, specs_json
)
SELECT
  'prod-moxie', 'moxie', 'brand-embodied', 'cat-companion-robots',
  'companion_robot', 'Embodied Moxie', 'Moxie',
  '[]', '["companionship","conversation","play_interaction"]', 'cordless', 'premium', 'published',
  '{"note":"NO OFFER, DELIBERATELY. Embodied ceased operations and Moxie stopped working when the servers went off; what remains runs only on OpenMoxie, a community-built local server that needs a computer, Docker and a paid OpenAI account. Sold new at $799. This page recommends alternatives and carries no buy button.","checkedOn":"2026-08-08"}'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE id = 'prod-moxie');
