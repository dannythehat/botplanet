# BotPlanet Daily Editorial & Affiliate Handoff

**Status:** Working specification for ChatGPT, Claude and the BotPlanet build repository  
**Created:** 1 October 2026  
**Market at launch:** United States / English / USD  
**Production stack:** Astro, Cloudflare Workers/Static Assets, D1 operational data, MDX editorial content, R2 media

## 1. Objective

Turn one or two supplied robot-industry source links per day into original BotPlanet articles using one locked editorial renderer. Every article must strengthen the existing BotPlanet topic graph, use commercially relevant products only when verified, and preserve editorial trust.

The source URL is evidence and a starting point. It is never copied, lightly paraphrased or treated as the sole authority for a disputed claim.

## 2. Non-negotiable architecture

- One `ArticleRenderer` for news briefs, analysis and evergreen explainers.
- Article files contain structured data and editorial copy, not layout code.
- No page-specific JSX or CSS.
- Product, offer, affiliate-program, image, source and internal-link records are resolved by ID.
- Raw affiliate destinations never appear inside article content.
- Unknown fields fail validation.
- Missing commercial evidence removes the commercial component; it does not create a guessed product, price or link.
- Unapproved drafts remain `noindex, follow`.

## 3. Daily intake

The owner can provide:

```text
Source: [URL]
Optional second source: [URL]
Optional angle: [what matters / buyer angle / no preference]
Optional urgency: [today / this week / evergreen]
```

If only a URL is supplied, the editorial system must infer the best format and propose it before publication.

## 4. Daily editorial workflow

1. Open the supplied source and identify the original announcement or primary document.
2. Verify publication date, event date, product identity, company, market and exact claims.
3. Corroborate material claims with primary sources where possible.
4. Classify the article:
   - `news_brief`: fast, factual announcement and buyer implications;
   - `analysis`: explains significance, trade-offs or market direction;
   - `evergreen_explainer`: durable educational search intent.
5. Search the BotPlanet content inventory for the correct topic cluster.
6. Build an internal-link manifest before drafting.
7. Search the product and offer registries for exact or genuinely similar products.
8. Draft into the validated article schema.
9. Generate only the required image assets, with no text or logos baked into the AI image.
10. Add BotPlanet logo, title and crop in code.
11. Validate sources, claims, links, affiliate disclosure, mobile crop and metadata.
12. Create an owner preview. Publish only after approval.

## 5. Locked article sequence

1. Masthead: category, date, reading time and author
2. Hero: image, code-added title and white BotPlanet logo
3. Standfirst
4. `The short version`: exactly three bullets
5. Numbered editorial sections
6. Pull quote where useful
7. Inline images
8. `BotPlanet takeaway` callouts
9. `Can you buy it?`
10. Specification card when a product is discussed
11. Affiliate disclosure before the first affiliate CTA
12. `Where to buy` only when exact verified offers exist
13. Optional `Similar robots you can buy now` when no exact offer exists
14. `Our take`
15. Sources
16. `Keep reading`: related articles plus two or three product/category destinations
17. Share bar

## 6. Internal-link contract

Every article should normally contain three to five intentional internal links:

- one parent category or robot hub;
- one closely related BotPlanet article;
- one product review, comparison, buying guide or BotMatch destination when relevant;
- optional second product destination when it genuinely helps the reader.

Rules:

- Links are stored in an `internal_links` manifest, not improvised inside prose.
- No link may point to an unfinished or unapproved destination.
- Anchor text is descriptive and varied deliberately.
- Every product review links back to its category page.
- Every supporting article links upward into its topic cluster.
- Do not add unrelated links merely to reach a quota.

## 7. Affiliate decision tree

### 7.1 Exact product discussed in the article

Show `Where to buy` only when all of the following are true:

- exact model identity is verified;
- market is correct;
- BotPlanet has an active relationship with the merchant or programme;
- a valid destination is available;
- merchant terms allow the planned linking method;
- stock and price state have a recent check;
- the offer resolves through BotPlanet's `/go/` route.

Network lookup priority:

1. CJ joined advertisers and approved product/link feeds
2. Awin joined advertisers and product feeds
3. Amazon US exact ASIN
4. Other approved programmes added later

Commercial suitability never decides editorial suitability. Choose the right robot first, then find the best valid offer.

### 7.2 No exact affiliate offer exists

The article may still be published if it is editorially valuable. It must say the product is unavailable, not orderable or not currently monetised as appropriate.

An optional block may appear under the explicit title:

> Similar robots you can buy now

This block may contain up to three products only when:

- they solve substantially the same buyer problem;
- the relationship is explained honestly;
- they are not presented as the announced product;
- each product has a verified BotPlanet record and live offer;
- a product review or category page is preferred over a naked merchant jump when available.

If no honest match exists, show no product block.

### 7.3 Link and CTA rules

- Article configs reference `offer_id` or `affiliate_route_key`, never a raw URL.
- All affiliate clicks go through `/go/{affiliate_route_key}`.
- CTA label: `Check Price — [Exact Product Name]` or `Check current price`.
- Apply `rel="sponsored nofollow"` and open in a new tab.
- Place a visible affiliate disclosure before the first affiliate link.
- Never use `Buy Now`.
- Never pair one retailer's price with another retailer's destination.
- Stale or missing price becomes `Check current price`.
- A restricted programme must obey its terms. Existing Aiper/CJ direct-linking restrictions remain in force until clarified.

## 8. Affiliate data model

```yaml
affiliate_program:
  programme_id:
  network: cj | awin | amazon | other
  account_id:
  advertiser_id:
  relationship_status:
  market:
  allowed_link_methods:
  restrictions:
  checked_at:

product:
  product_id:
  brand:
  exact_model:
  category_id:
  launch_date:
  announcement_date:
  market_status:
  identifiers:
  product_page_status:

offer:
  offer_id:
  product_id:
  programme_id:
  retailer_id:
  market:
  exact_model:
  retailer_product_id:
  destination_confidence:
  affiliate_route_key:
  seller_identity:
  price_state:
  price:
  currency:
  stock_state:
  returns_state:
  checked_at:
  status: offer_live | offer_pending | offer_stale | withdrawn
```

## 9. New Robots on the Market page

**Proposed route:** `/robots/new/`  
**Purpose:** a curated, newest-first commercial discovery page—not a general robotics news feed.

### Public eligibility

A product appears publicly only when:

- it is a genuinely recent robot model;
- exact identity and launch/availability date are verified;
- it belongs to an approved BotPlanet category;
- it is orderable or in a verified pre-order state in the target market;
- at least one exact `offer_live` exists through CJ, Awin, Amazon or another approved programme;
- image rights/asset approval and essential specifications are complete;
- its BotPlanet product or article destination is live;
- the freshness check passes.

Products with `offer_pending` belong in an internal research queue, not the public page.

### Sorting and expiry

- Primary sort: verified market availability date, newest first.
- Secondary sort: announcement date.
- Do not sort by commission.
- Default `new` window: 180 days, configurable by category.
- Remove the `New` badge automatically after the window expires; retain the product in its normal category if still valid.
- Withdrawn, unavailable or stale offers disappear from the public new-products list until revalidated.

### Card contents

- product image;
- exact brand and model;
- category;
- availability state and date;
- two-sentence editorial explanation of what is actually new;
- link to BotPlanet product/review page;
- one affiliate CTA from a verified offer;
- `last checked` date.

## 10. Image contract

Required sizes:

- hero: 1672 × 941;
- phone hero: 900 × 1125;
- inline images: 1200 × 800;
- social square: 1080 × 1080;
- social vertical: 1080 × 1920;
- Open Graph: 1200 × 630.

The image model draws the scene or robot only. It must not draw words, logos or human faces. The renderer adds title, white BotPlanet logo, scrim and crop.

For buying guides and exact product reviews, use approved factual product photography. AI-generated imagery is for concepts, category storytelling and contextual scenes, never as evidence of an exact commercial product.

## 11. Minimum article record

```yaml
template_id: botplanet.article.v1
template_version: 1.0.0
article_id:
format: news_brief | analysis | evergreen_explainer
status: research | draft | owner_review | approved | published
route:
indexing: noindex_follow | index_follow
category_id:
title:
seo_title:
meta_description:
standfirst:
author_id:
published_at:
updated_at:
research_as_of:
hero_desktop_asset_id:
hero_mobile_asset_id:
short_version:
  -
  -
  -
sections: []
availability:
spec_card:
commercial_module:
  mode: exact_offers | similar_products | none
  product_ids: []
  offer_ids: []
our_take:
source_ids: []
internal_links: []
related_content_ids: []
approved_by:
approved_at:
```

## 12. Validation gates

Block publication or force `noindex, follow` when:

- title, metadata, canonical, author or dates are missing;
- the article is too close to source wording;
- a material claim has no evidence record;
- product identity is uncertain;
- a price lacks market and freshness data;
- raw affiliate URLs appear in article content;
- disclosure is below the first affiliate link;
- internal destinations are unfinished;
- generated art is presented as a factual product photograph;
- desktop or phone hero is missing;
- image contains unwanted text, logos or a human face;
- structured data does not match visible content;
- owner approval is missing.

## 13. What Claude must receive

Claude needs the implementation package, not only a screenshot or preview URL:

1. BotPlanet repository and target branch.
2. This handoff document.
3. Locked category-page template v2.0.
4. BotPlanet editorial visual preview URL.
5. Article renderer source and CSS/tokens from the prototype.
6. `botplanet-article.schema.json`.
7. One valid MDX/YAML record for each article format.
8. Product, offer, programme, source, asset and internal-link schemas.
9. Existing `/go/` route behaviour and affiliate restrictions.
10. Exact acceptance tests and owner approval requirement.

### Copy-paste Claude instruction

```text
Implement the BotPlanet article system in the existing BotPlanet repository.

Treat BOTPLANET_DAILY_EDITORIAL_AND_AFFILIATE_HANDOFF.md and the locked BotPlanet category blueprint as authoritative. Reuse the established Astro + Cloudflare + MDX architecture, global design tokens, product records, offer records, asset records, internal-link manifest and /go affiliate routing.

Build one ArticleRenderer supporting news_brief, analysis and evergreen_explainer records. Do not create page-specific JSX/CSS. Do not redesign the supplied editorial template. Port its desktop and mobile behaviour into reusable components. Content records may select approved modules and provide values only.

Affiliate components must resolve verified exact offers by offer_id. If no exact offer exists, the renderer may show an explicitly labelled Similar robots you can buy now module only when approved similar product_ids and live offer_ids are supplied. Otherwise render no commercial module. Never invent a product, price, destination, claim, source or internal link.

Add /robots/new/ as a newest-first page driven by verified product and offer records. Public cards require an exact offer_live in the target market. offer_pending products stay internal. Never rank by commission.

Add schema validation and fail-closed publication gates. Drafts and incomplete records must remain noindex, follow. Preserve mobile accessibility, 17px minimum article body text, keyboard focus, reduced motion and code-rendered logo/title overlays.

Before changing the locked blueprint or visual system, stop and request Danny's exact approval. Return the file plan, schema plan and migration impact before implementation.
```

## 14. Recommended implementation order

1. Port the visual prototype into reusable Astro components.
2. Create `botplanet.article.v1` schema and three example MDX records.
3. Index existing BotPlanet routes into the internal-link registry.
4. Implement the programme/product/offer registry and `/go/` resolver.
5. Import and verify current Amazon, CJ and Awin relationships.
6. Build `/robots/new/` from verified product + offer records.
7. Add the owner preview/approval state.
8. Run one real source URL through the complete workflow before enabling daily publication.

## 15. Editorial principle

BotPlanet can cover important robot news even when the announced product is not monetisable. Internal links strengthen the site; honest similar-product recommendations may create revenue; and the New Robots page remains strictly affiliate-ready. Revenue is a layer on top of correct editorial judgement, never the filter that decides what is true or worth covering.
