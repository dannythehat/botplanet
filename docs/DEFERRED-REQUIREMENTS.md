# Deferred requirements the foundation must not preclude

The public frontend is deferred, but the schema and architecture must support these later without rework. Source: Notion "Authority, Linking, Conversion & Standout Experience System" + "Image Sources, Rights & Visual Production System". This doc records what the data model must eventually carry so we don't paint ourselves into a corner.

> Guiding principle — every important page must answer: **Why trust this? · What's the best answer for me? · Where do I go next? · What makes this better than ten generic affiliate pages?**

## 1. Authority & internal linking (structural, not optional)
Every indexable page belongs to a topic cluster and carries intentional links. Page records must eventually store: parent hub, primary + secondary clusters, required inbound links, required outbound internal links, preferred anchor-text variants, breadcrumb path, **orphan status**, link-review date. Minimum link sets differ by page type (hub / product / review / comparison / guide). **Publication QA fails on orphan status or missing required links.**

_Reserved model:_ `page_records`, `topic_clusters`, `internal_link_plan`, `anchor_variants` (planned next migration group, alongside the SEO/analytics layer already scoped in the SEO intelligence spec).

## 2. External sources & evidence
Commercial/technical claims require an internal **evidence record** (already in schema: `evidence`) with source URL, source type, checked date, finding, confidence, verification status. Manufacturer claims labelled as such. Affiliate links are purchase actions, **not** evidence citations.

## 3. EEAT
Pages must show author, reviewer, qualifications, research method, whether physically tested, evidence status, first-published & last-reviewed dates, what changed, affiliate disclosure, limitations. _Reserved model:_ `authors`, `reviewers`, page author/reviewer refs, plus required supporting pages (editorial policy, review methodology, recommendation-independence policy, corrections, About, How BotMatch works).

## 4. Calls to action
One deliberate primary CTA per section, result-describing wording, purchase CTAs show retailer + price freshness + disclosure. CTA position/performance tracked by component and page. _Reserved model:_ `cta_definitions` + CTA analytics (ties to `click_events.placement`).

## 5. Recommendation modules
Reusable, explained modules: best overall / cordless / above-ground / large pools / budget / trusted corded / surface skimmer / best alternative / **not recommended for this situation**. Every recommendation explains why, who it suits, who should avoid, limitations, evidence status, offer freshness. **Never anonymous boxes generated from commission** — enforced by the scoring engine (commission is isolated from product selection) and by requiring evidence + explanation.

## 6. Visual experience & image rights
Planned visual story per page (pool-type selectors, floor/wall/waterline/surface diagrams, corded-vs-cordless explainers, before/after evidence, size/weight comparisons). All imagery obeys the **Media Library & Rights System** (`media` table): internal IDs, render-time rights guard, `supports_tested_claim` gate, central withdrawal. No image is rendered without confirmed rights.

## 7. Pop-ups / prompts
Allowed: exit-intent save/email comparison, resume-BotMatch, "want BotPlanet to choose?", price/availability alerts, email-my-results, market-suggestion banner. Prohibited: immediate newsletter walls, stacked pop-ups, fake urgency/countdowns, manufactured scarcity, content-blocking, repeat prompts after dismissal. Requirements: **frequency caps + persistent dismissal state**, mobile-safe, accessible, consent-compliant, event-tracked. _Reserved model:_ `popup_rules` + per-session dismissal/frequency state.

## 8. Component system
BotMatch entry, recommendation card, evidence badge, price-freshness badge, who-suits/who-should-avoid, limitations panel, comparison tray, product-class explainer, source/methodology drawer, author/reviewer panel, related-guide rail, alternative-product module, sticky mobile CTA, save/email result, "why BotPlanet chose this".

## 9. Publishing QA gates (must block publish)
A page cannot publish when: orphaned · required internal links missing · claims lack evidence records · author/reviewer incomplete · image rights unresolved · affiliate disclosure missing · CTA intent undefined · recommendation reasoning absent · limitations / "who should avoid this" missing where required.

## 10. Analytics
Internal-link clicks (source→destination), CTA impressions/clicks, BotMatch entries by component, comparison additions, recommendation-module engagement, affiliate clicks **by recommendation position**, pop-up shown/dismissed/converted, media engagement, scroll/depth — without collecting unnecessary personal data. Ties into the SEO/GA4/GSC layer already scoped.

---
**None of this is built in this PR.** It is recorded so the foundation stays compatible: `click_events` already carries page/placement/recommendation/cluster/campaign dimensions; `evidence` and `media` exist; the scoring engine keeps commission out of recommendations. The page-records/linking/EEAT/CTA/pop-up tables are the next migration group after the frontend is scaffolded.
