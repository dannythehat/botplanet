# Interchangeable data — where it lives

**Generated. Do not hand-edit.** Run `node scripts/extension-points.mjs --write`.

BotPlanet is one engine rendering many categories. This is the list of every
place that holds data belonging to a *particular* category, product, brand or
retailer, rather than to the machine itself. Everything not listed here is
engine, and adding a category should not require touching it.

Each entry says what happens if you skip it, because the failures are quiet:
a category with no hero entry still renders, it just renders without a title
or a meta description, and nothing complains.

## How to use it

```
node scripts/extension-points.mjs                    # the whole map
node scripts/extension-points.mjs security-robots    # checklist for one category
```

The second form is the useful one. It reports which per-category files already
mention that slug and which do not — the answer to "what have I still not done".

## Per category

One entry per category slug. Adding security robots, robot vacuums or anything else means walking this list. Run `node scripts/extension-points.mjs <slug>` to see which of them the new slug already appears in.

| File | | What happens if you skip it |
|---|---|---|
| `apps/web/src/components/BotMatcher.astro` | optional | The funnel falls back to general wording — "for you", and a criteria line that does not name the category's real inputs. True, but flat, and it wastes the one line that tells a reader we understand their problem. |
| `apps/web/src/content/category-hero.ts` | **required** | The page falls back to a bare generic heading: no H1 of its own, no <title>, no meta description, no OG image and no CollectionPage schema. It renders, so nothing complains. |
| `apps/web/src/content/category-sections.ts` | **required** | Nine records live in this file — DECISION, COVERAGE, SPLIT, MATRIX, CHECK, PRICE, VERDICT, FAQ and BOTMATCH_CTA — and each is looked up independently. A missing record drops its section silently; a category with none renders a hero, a product grid and nothing in between. FAQ also feeds the FAQPage schema, so an absent record means no FAQ rich result. |
| `apps/web/src/content/editorial.ts` | optional | Best-of pages and standalone guides for a category, keyed by canonical path. OPTIONAL because these are earned, not owed: a category gets a best-of page when its research shows a ranked-list SERP that the hub cannot serve, and not otherwise. A category with no row here has no sub-pages, which is a legitimate state and the one nine of the ten categories are in today. What is NOT legitimate is a route registered as live with no record behind it — editorial.test.ts checks the pairing in both directions. |
| `apps/web/src/content/internal-links.ts` | optional | The category's pages stop cross-linking to each other, which costs internal PageRank and leaves a reader at the bottom of a review with nowhere to go. internal-links.test.ts checks the anchors that DO exist resolve; it cannot check for absence. |
| `apps/web/src/content/journeys.ts` | optional | The shell's BotMatch button keeps pointing at the launch category's journey, so a reader on a lawn page is offered "Find My Pool Cleaner". Cosmetic but wrong, and visible in the header on every page of the category. |
| `apps/web/src/content/matcher-questions.ts` | **required** | BotMatch returns 404 for the category. That is deliberate and must stay that way: a category never inherits another category's questions. MATCHER_TASKS_BY_CATEGORY and MATCHER_DEFAULTS in this file are keyed the same way. |
| `apps/web/src/content/nav.ts` | **required** | The category is invisible: absent from the header mega-menu, the mobile drawer, the footer and the /robots index, and excluded from the sitemap because liveCategories() drives it. The launch state here is also what marks a category coming_soon or hidden. |
| `apps/web/src/content/routes.ts` | **required** | Three routes per category — the hub, /compare/ and /botmatch/. The pages still render without them, because they come from dynamic routes and a D1 row, but this registry is what the SITEMAP and the breadcrumbs read. A page no crawler can find is not published. This is exactly what was missed when window went live. |
| `apps/web/src/content/seo/keyword-register.ts` | **required** | Also per-page and per-product — every published URL needs a row. Without one, keywords.test.ts cannot assert the page still contains the term it was built to rank for, so the page can silently drift off its keyword. This register is also what the Notion Content & SEO Control Register mirrors. |
| `apps/web/src/pages/api/botmatch.ts` | **required** | /api/botmatch returns 501 and the funnel produces no recommendation. There is deliberately NO fallback: judging one category's products by another category's weights excluded all eleven window robots as class_not_eligible and returned nothing, silently, for a day. The D1 scoring_configs row has to exist too. |
| `apps/web/src/pages/api/matcher-lead.ts` | optional | The lead email falls through to the pool wording and tells a window or lawn buyer what we understood about their "pool". The `seen` and `theirs` maps in renderReply below are the same decision and need the same entry. |
| `packages/db/seed/pool/botmatch.ts` | **required** | Two arrays in this file, one row each per category. scoringConfigRows is the one that matters at runtime — without it /api/botmatch returns 501 and the funnel recommends nothing. questionnaireRows exists because scoring_configs has a foreign key to it, so a config without a questionnaire row is a database that cannot be rebuilt. |
| `packages/db/seed/pool/catalogue.ts` | **required** | A database rebuilt from this seed has no row for the category, so its page 404s with "Category not found". Window and lawn were both created directly against D1 and missing here until 6 August 2026 — a latent bug nobody would find until the next rebuild. |
| `scripts/gen-derivatives.mjs` | optional | Artwork for a new category has to be added to this list and the script re-run, or every image on the page is served at full authored size to a phone that needs a fraction of it. Also per-product: each review's four images belong here. Cannot be auto-checked — media directories are named for the subject ("pool", "window", "lawn-category"), not for the category slug. |
| `scripts/seo-research.mjs` | **required** | No seed inventory means no paid research run — the workflow refuses to spend before the free seed list exists. Nothing downstream is buildable without it: no volumes, no difficulty, no cannibalisation rulings, so no page map. |

## Per product

One entry per product slug. Adding a Maytronics pool robot, a fifth window brand or the first mower means walking this list for that product.

| File | | What happens if you skip it |
|---|---|---|
| `apps/web/src/content/commerce/destinations.ts` | **required** | Three records here decide whether a reader can buy: DESTINATIONS (which retailer and which ASIN), IDENTITY_CHECKS (that the ASIN is the right machine and not a sibling model) and REDIRECT_KEYS (the /go/ key the button points at). A REDIRECT_KEYS entry with no matching offer seed is a 404 on the buy button — the single most damaging failure on the site, and the one offers.test.ts now guards. |
| `apps/web/src/content/evidence/verification.ts` | **required** | The product has no dated record of what was actually read on the retailer's page — price, stock, seller, returns, and the model number that proves identity. Without it nothing on the page can carry the "checked on" date the methodology promises. |
| `apps/web/src/content/media/assets.ts` | **required** | Every image on the site needs a record here stating who made it and on what asset record. An image without one fails media.test.ts and does not ship — deliberately, because publishing a picture we cannot prove we may use is the one mistake that costs money rather than traffic. |
| `apps/web/src/content/product-names.ts` | optional | Only needed when a product's slug changes or the product is dropped. Without an entry the old URL 404s instead of redirecting, and every link and ranking it had is thrown away. |
| `apps/web/src/content/products.ts` | **required** | Four records in this file are keyed by product slug: PRODUCT_ID, PRODUCTS (the editorial copy), CATALOGUE_STATUS and CATALOGUE_WITHDRAWALS. Without a PRODUCTS entry the product has no editorial voice at all — no summary, no who-it-is-for, no rule-outs — and the card falls back to bare catalogue fields. |
| `apps/web/src/content/reviews.ts` | optional | No review page for the product, and no card in the homepage review grid, which is built from this record so new reviews appear automatically. A catalogued product with no review still works — it just never gets the page that ranks. |
| `apps/web/src/content/snapshots.ts` | optional | No price history and no rule-outs for the product. The page still renders; it just cannot say whether today's price is good, which is most of why somebody reads a comparison site. |
| `apps/web/src/lib/providers/expected-identity.ts` | **required** | The price checker does not know the product exists, so its page shows no price and never will — silently. Two products sat like this for days. A product must be here OR explicitly listed as awaiting discovery; offers.test.ts fails the build if it is neither. This is also what catches a retailer swapping the listing for a sibling model. |
| `packages/db/seed/pool/catalogue.ts` | **required** | The product does not exist: no catalogue row, no card on the category page, no comparison row, and nothing for BotMatch to score. This is also where productClass, environments, cleans, powerType and priceTier are set — the five fields the scoring engine actually reads, so a wrong value here is a wrong recommendation. |
| `packages/db/seed/pool/commercial.ts` | **required** | Both arrays below are built from offerSeeds. No seed means the buy button resolves to nothing and /go/<key> returns 404 — which is exactly what happened to the Proteus DX4 Plus and the Scuba V3 for a day. offers.test.ts now fails the build for this, so the failure is loud rather than silent. |
| `packages/db/seed/pool/evidence.ts` | optional | The product ships with no cited source behind its specification claims. It renders, but every figure on the page is then unattributed, which is the thing the review methodology promises we do not do. |

## Per brand

One entry per brand. Cheap, but a missing brand row breaks the product's foreign key.

| File | | What happens if you skip it |
|---|---|---|
| `packages/db/seed/pool/catalogue.ts` | **required** | A product row references its brand by foreign key, so a missing brand row fails the insert outright. Cheap to add and the one place hasDirectAffiliate is recorded, which decides whether we monetise the brand directly or only through retailers. |

## Per retailer / affiliate network

One entry per retailer or affiliate network. Grows when a programme is approved — Amazon first, then the rest.

| File | | What happens if you skip it |
|---|---|---|
| `apps/web/src/content/commerce/amazon-marketplaces.ts` | optional | Needed only when we sell into a second Amazon marketplace. Each has its own tracking tag and its own ASINs — REGIONAL_ASIN below — because the same machine has different identifiers per country, and reusing a US ASIN abroad sends a reader to the wrong listing or to nothing. |
| `packages/db/seed/pool/commercial.ts` | **required** | retailerRows above and this array grow together as affiliate programmes are approved — Amazon US first, then the rest. A retailer with no programme row can still be shown, but its offers carry no commission basis and no approval state, so the offer ranker cannot treat it as purchasable. |

## Shared vocabulary

The enums every category draws from. A new category usually needs new values here FIRST, because a product cannot be described honestly with another category's words.

| File | | What happens if you skip it |
|---|---|---|
| `packages/shared/src/product-class.ts` | **required** | Four vocabularies live in this file — PRODUCT_CLASSES, CLEANING_SURFACES, ENVIRONMENTS and POWER_TYPES — and a new category almost always needs values in the first three BEFORE anything else is built. A product that cannot be described honestly gets described dishonestly: window robots were nearly typed as pool cleaners on floors, and a catalogue row that lies is worse than no row. PRODUCT_CLASSES is also the gate that stops one category's robots winning another category's recommendation. |

---

## Adding a whole new category

The short version, in the order that avoids rework:

1. **Shared vocabulary first.** A security robot cannot be described with pool
   or glass words. Add its product class, environments and capabilities before
   anything references them.
2. **Research** — seed file, capped run, findings, keyword-to-URL rulings.
   Nothing is built before the cannibalisation rulings exist.
3. **Registries** — nav, routes, the D1 category row and its seed entry.
4. **Page content** — hero and the nine section records.
5. **BotMatch** — its own question set, its own scoring config. Never shared.
6. **Products** — catalogue rows, offers, redirects, identity, evidence, media.
7. **Verify live**, then log in Notion.

Full process: `docs/seo/PRE-BUILD-PROCESS.md`.
