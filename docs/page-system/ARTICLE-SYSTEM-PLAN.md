# Article system: file plan, schema plan and migration impact

Response to `BOTPLANET_DAILY_EDITORIAL_AND_AFFILIATE_HANDOFF.md` (section 13 asks for this before implementation).
Nothing here is built. 1 October 2026.

## Fit with what already exists
* Astro on Cloudflare Workers, D1 for offers and redirects, the `/go/` route, the page system (page files, zod
  schema, tests), the hero tool and the CJ and Awin clients all exist. The article system extends them.
* The repo has **no MDX**. Articles would be Markdown with YAML front matter, which also enforces the handoff's
  own rule of no page-specific JSX, since Markdown cannot carry components.
* Media is served from `public/`. An R2 bucket is configured but media does not use it today.

## File plan
```
apps/web/src/article-system/
  schema.ts        zod `botplanet.article.v1`; strict (unknown fields fail); JSON Schema generated to docs/
  rules.ts         gates, limits, banned phrases (shares the page system's)
  load.ts          reads content/articles/*.md, validates, builds the registry
  links.ts         the internal_links manifest and its checks
  commercial.ts    offer and programme resolution; the fail-closed affiliate gates
  similarity.ts    source-wording overlap check (stores shingles, not source text)
apps/web/src/content/articles/<slug>.md      front matter + Markdown, no layout
apps/web/src/content/sources/                source records by id
apps/web/src/components/article/             ArticleRenderer + Masthead, ArticleHero, ShortVersion, Takeaway,
                                             CanYouBuyIt, SpecCard, WhereToBuy, SimilarRobots, OurTake, Sources,
                                             KeepReading, ShareBar
apps/web/src/pages/news/[slug].astro, news/index.astro, robots/new.astro
scripts/article-tool.ts   new | check | preview | approve | publish
scripts/article-images.mjs  logo, title, crops and social sizes added in code; OpenAI image call (key outside repo)
apps/web/test/article-system.test.ts, new-robots.test.ts
```

## Schema plan
`botplanet.article.v1` follows the record in section 11. Sections are a discriminated list (`text`, `pull_quote`,
`inline_image`, `takeaway`) so the renderer, not the author, decides the look. Everything commercial, image, source and link
is an id resolved at build. A raw URL in article content fails validation. `commercial_module.mode` is
`exact_offers | similar_products | none`; `exact_offers` fails the build unless every offer passes the gates.

## Migration impact
1. **Routes:** `content/routes.ts` is edited by hand today. Daily articles need routes generated from the article
   registry, including the sitemap, breadcrumbs and `noindex` for drafts.
2. **Tests:** today every live page needs a keyword-register row and a page-plan entry. That cannot work at one or
   two a day. Articles would be governed by a cluster-level plan and the register and plan tests would exempt them.
3. **D1 migration:** product `launch_date`, `announcement_date` and `market_status`; programme `allowed_link_methods`,
   `restrictions`, `checked_at`; offer state fields. The existing offers and redirect tables are reused.
4. **Links:** the existing anchor linker stays. The article's `internal_links` manifest lists required links and the
   validator checks they appear; "older pages link to new ones" still applies via `RETROFITTED_INBOUND`.
5. **Approval:** `approved_by` and `approved_at` are written only on the owner's explicit instruction.
6. **CTA wording and behaviour:** "Check Price: [Exact Product Name]", new tab, `rel="sponsored nofollow"`, and
   disclosure before the first affiliate link. Existing best-of and review buttons would be aligned.

## Points where the handoff and today's decisions disagree (owner to decide)
* **AI pictures as product evidence.** The handoff says AI imagery is never evidence of an exact product, and
  buying guides and reviews use approved product photographs. The solar skimmer best-of uses the owner's renders as
  the product pictures (labelled as illustrations, kept out of structured data). Keep them, or switch to supplied photographs?
* **Route for `/robots/new/`** is fine; `/robots/[category]/` is dynamic so the static page wins, but "new" becomes
  a reserved slug.
* **Where articles live.** The handoff gives no article route. Proposed: news briefs and analysis at
  `/news/<slug>/`, evergreen explainers at `/guides/<slug>/`.
* **Bylines.** Authors on the site today are Danny and Michelle Choa. An article drafted by AI should not carry a
  real person's name unless they have written or reviewed it. Options: "BotPlanet Editorial" with a named
  reviewer, or the owner as reviewing editor.
* **`/robots/new/` strictness.** It requires an exact, verified, live offer. The three new skimmers have Amazon
  links but identity is only title-level, not verified from the listing's details table, so they would not
  qualify yet.

## What is missing and needs to come from the owner
The handoff lists items Claude must receive. These have not arrived: the locked category-page template v2.0, the
editorial visual preview URL or files, the prototype's renderer source and CSS, `botplanet-article.schema.json`,
and example records for each article format. Also the CJ and Awin tokens to import the real programmes.
