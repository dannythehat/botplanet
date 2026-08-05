# The pre-build stage — what every BotPlanet page goes through before anyone writes a word

**Status: the standing process. It applies to every page type — category hub,
product review, best-of guide, comparison, educational guide — and to every
robot category, not just the one being built today.**

This exists because the pool category was built the other way round. Reviews
were written and shipped, and the keyword register, the offer rows and the
Notion tracker were reconciled afterwards. That worked, but it produced two
buy buttons that returned 404 for a day, two products that were never price
checked, and a keyword register that showed eleven live pages as unpublished.
None of those were hard to fix. All of them were invisible until somebody
went looking, and none of them should have been possible.

The order below is the fix. Nothing here is new work — it is the same work,
done before publication instead of after.

---

## Stage 0 — The topic is already decided

Categories are locked in Notion. This stage does **not** ask "which niche
should we do?" — that question is settled and re-opening it wastes a research
budget on a decision nobody is making.

What Stage 0 produces: the category slug, e.g. `window-cleaning-robots`.

---

## Stage 1 — Free seed inventory *(no money spent)*

Write `docs/seo/seeds/<category>.json` by hand. Three lists:

| Field | What it is | Roughly |
|---|---|---|
| `leads` | The terms worth pulling *related keywords* for. Each costs money, so these are the head terms and the model names only. | 10–15 |
| `seeds` | Everything to price for volume and difficulty. One batched call covers all of them, so breadth is nearly free here. | 90–130 |
| `serpQueries` | Queries whose live SERP decides an intent question or a page split. Each is a separate paid call — this is the expensive list, so it stays short. | ~20 |

The seed list must include, at minimum:

- the category head term and its natural variants;
- best-of and selection modifiers (budget, cordless, by use case, by size);
- **every brand and model with real US retail presence** — these become the
  review pages, and a model missing here is a review that never gets planned;
- comparison terms, both brand-vs-brand and model-vs-model;
- the questions the category actually argues about — for pool that was walls
  and waterline; for window robots it is falling, frameless glass, streaking
  and consumables;
- use-case long tails.

**The rule: the paid run never invents its own seeds.** If a term is not in
the file, it was not considered. That is what makes the run auditable.

---

## Stage 2 — One capped paid batch

    Actions tab → "SEO Research" → category slug, optional lower cap

Ceiling is **$2.00 per category**, enforced inside the script, which also
refuses a cap above the ceiling so a typo cannot authorise spending nobody
approved. The pool run cost **$0.2154**.

The batch is deliberately shaped to be cheap:

1. **One** `search_volume` call for every seed, with 12-month trend.
2. **One** `bulk_keyword_difficulty` call for every seed.
3. `related_keywords`, one per lead — the reason `leads` is short.
4. Live SERPs for `serpQueries` only — the reason that list is shorter still.

Output is a downloadable artifact. **Raw API responses never enter git.**

---

## Stage 3 — Findings and the keyword-to-URL map

Write `docs/seo/<category>-research-findings.md`, containing:

- headline volume / KD / CPC per cluster, **and the seasonality curve** —
  pool peaks at 90,500 in June and troughs at 9,900 in December, and a plan
  that ignores that is a plan built on an average nobody searches;
- one ruling per candidate page: **create, merge, or refuse**, each with the
  SERP evidence behind it;
- the final page list, where every page owns **one primary intent**.

### The cannibalisation rule

One query family, one canonical URL. A review never chases the category head
term; a best-of never competes with the hub. Every page records what it has
**ceded and to which URL**, so the decision survives the person who made it.

---

## Stage 4 — Products *(Amazon US first)*

BotPlanet fills a category with Amazon products first, then adds other
affiliate networks as approvals land. For each product:

- exact brand and model, and the **sibling models it must never be confused
  with** — this is where most of the damage happens;
- an owner-confirmed or machine-read ASIN;
- price, stock and the date each was read;
- what the manufacturer publishes, and what it refuses to;
- who should **not** buy it.

Then the identity register gets an entry — ASIN, brand, model tokens, and the
deny tokens that refuse the siblings — and the offer + redirect rows get
seeded. **Both, before the page ships.** Two tests enforce this: every active
product must be price-checkable or explicitly awaiting discovery, and every
buy button must have an offer behind it.

---

## Stage 5 — Build

Only now: artwork, prose, figures, schema, internal links. The keyword
register entry is written **with** the page, not after it, because
`keywords.test.ts` reads the real copy and fails the build if a page has
stopped containing the term it was built to rank for.

---

## Stage 6 — Verify live, then log

- Page serves, images serve, folds render.
- Sitemap carries the URL.
- **Click the buy button.** A 302 to the right ASIN with the `botplanet-20`
  tag. Not "the code looks right" — the actual redirect.
- Price refresh run and the real price landed.
- Notion **Content & SEO Control Register** row updated: primary, secondary,
  ceded terms, title tag, meta description, affiliate destination, schema
  types, published state, last reviewed.

---

## Where things live

| What | Where |
|---|---|
| Seed inventories | `docs/seo/seeds/<category>.json` |
| Research script | `scripts/seo-research.mjs` |
| Research workflow | Actions tab → "SEO Research" |
| Findings + page map | `docs/seo/<category>-research-findings.md` |
| Keyword register (asserted by tests) | `apps/web/src/content/seo/keyword-register.ts` |
| Identity + price checking | `apps/web/src/lib/providers/expected-identity.ts` |
| Offers behind buy buttons | `packages/db/seed/pool/commercial.ts` |
| Tracking | Notion — Content & SEO Control Register |

## The two questions that catch most mistakes

1. **Does this page take a term another page already owns?** If yes, one of
   them is wrong — decide which, and write the ruling down.
2. **If a reader clicked buy right now, where would they land?** Check it.
   Do not reason about it.
