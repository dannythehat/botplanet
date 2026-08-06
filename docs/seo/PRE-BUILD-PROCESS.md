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

**Who chooses the keywords.** Claude does, always — owner decision of
5 August 2026, which reversed an earlier rule forbidding it. The condition
attached: every selection is evidence-backed, using real volume and real
difficulty from the paid batch below, never a guess — and recorded in the
keyword register and the Notion tracker where it can be checked.

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

## Stage 5b — BotMatch is part of the build, not a later job

> ### EVERY CATEGORY GETS ITS OWN BOTMATCH QUESTIONS. THEY ARE INDEPENDENT OF ONE ANOTHER.
>
> A question set is never shared, reused, inherited, defaulted to, or borrowed
> from another category because it is "close enough". A category with no
> questions of its own gets **no questionnaire at all** — never somebody
> else's.
>
> This is not a question to ask. It is settled. **Owner ruling, 6 August 2026.**

The window category went live on 5 August 2026 pointing at the only question
set that existed, which was the pool one. For a day, a reader who wanted their
*windows* cleaned was asked whether their *pool* was in-ground and how many
feet long it was, under a heading that read "Find the right window-cleaning
robots for your pool". Nothing flagged it, because there was nothing for it to
be inconsistent with.

**Four pieces ship together, per category:**

| Piece | Where | What it decides |
|---|---|---|
| Question set | `apps/web/src/content/matcher-questions.ts`, keyed by slug | What the reader is asked, and in what order |
| Analysing sequence | Same file, `MATCHER_TASKS_BY_CATEGORY` | The lines shown while it thinks — each must name something the engine genuinely does |
| Scoring config | D1 `scoring_configs`, one row per category (`sc-window-v1`, `sc-lawn-v1`) | Weights, hard exclusions, eligible product classes |
| Landing copy | `apps/web/src/components/PoolMatcher.astro` | The heading and the "what we match on" line |

**Order the questions by how much each narrows the field**, which is not the
order a spec sheet uses. Lawn asks about overhead tree cover second — ahead of
slopes and budget — because it has almost no search volume and is the single
most likely reason the purchase disappoints. BotMatch asks what decides the
purchase, not what gets searched.

**A scoring config is never shared either.** One row per category, no
fallback: `/api/botmatch` returns an error rather than judging a category's
products by another category's weights. Scoring the eleven window robots
against the pool config excluded every one of them as `class_not_eligible` and
returned nothing — silently, because the funnel is built to survive a scoring
failure.

**Enforced by `apps/web/test/matcher-questions.test.ts`**, which fails the
build if two categories share a question array, if a non-pool set mentions a
pool, if a non-window set mentions glass, if a non-lawn set mentions a lawn,
or if an unknown category is handed somebody else's questions.

**A matcher with no products is not advertised.** The questions can be right
and the category still not ready. Build the questions with the page; link to
them once there are products to recommend.

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
| BotMatch questions, per category (asserted by tests) | `apps/web/src/content/matcher-questions.ts` |
| BotMatch scoring config, per category | D1 `scoring_configs`, seeded from `packages/db/seed/pool/botmatch.ts` |
| Identity + price checking | `apps/web/src/lib/providers/expected-identity.ts` |
| Offers behind buy buttons | `packages/db/seed/pool/commercial.ts` |
| Tracking | Notion — Content & SEO Control Register |

## The three questions that catch most mistakes

1. **Does this page take a term another page already owns?** If yes, one of
   them is wrong — decide which, and write the ruling down.
2. **If a reader clicked buy right now, where would they land?** Check it.
   Do not reason about it.
3. **If a reader started BotMatch on this category right now, what would it
   ask them?** Read the actual questions. A category that has not been given
   its own set is a category that will ask about somebody else's product.
