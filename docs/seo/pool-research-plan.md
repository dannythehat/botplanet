# US Pool SEO Page Research — Plan, Seeds and Proposed Page Inventory

**Branch:** `research/pool-seo-page-map` · **Prepared:** 2026-08-01 · **Status:** zero-cost preparation complete; paid batch pending DataForSEO credentials · **Paid spend so far this phase: $0.00** (hard cap $2.00)

This is the research artefact for the page-first pool build. It reuses the
existing DataForSEO Round 1 evidence (2026-07-29, ~$0.36 — see
`apps/web/src/content/keywords.ts` and the Notion launch-category assessment)
rather than repurchasing anything inside 30 days. Nothing here authorises page
construction: every page below stays `SEO Brief Approved = false` until
ChatGPT approves the map.

---

## 1. Free seed inventory (deduplicated)

Sources: existing Round 1 keyword map (64 unique phrases), the ten catalogue
product names + the two owner-media models, locked route registry, manufacturer
terminology (Dolphin/Maytronics, Polaris/Fluidra, Aiper, Betta/Solar Pool
Technologies, WYBOT, Beatbot), and retailer listing language captured in Job 10
(`serpapi-observations.ts` titles).

**Seed groups (≈180 seeds after local dedupe):**

- **Head/category (12):** robotic pool cleaner · robot pool cleaner · pool cleaning robot · automatic pool cleaner robot · pool robot · pool vacuum robot · robotic pool vacuum · best way to clean a pool automatically · electric pool cleaner · in ground pool robot · above ground pool robot · pool cleaner machine
- **Best-of / selection (14):** best robotic pool cleaner (+2026) · top rated robotic pool cleaners · best robot pool cleaner for the money · best cordless robotic pool cleaner · best budget robotic pool cleaner · best robotic pool cleaner for above ground pools · … for inground pools · … for large pools · … for leaves · wall climbing pool cleaner · best pool robot under 500 · best pool robot under 1000 · which robotic pool cleaner should I buy · robotic pool cleaner reviews
- **Model/review clusters (5 lead products × ~8):** e.g. `dolphin nautilus cc plus review` · `dolphin nautilus cc plus wi-fi` · `nautilus cc plus vs cc` · `dolphin nautilus cc plus problems` · `is the dolphin nautilus cc plus worth it` — mirrored for Polaris FREEDOM, Betta SE Plus (+ `solar pool skimmer review`), Dolphin Proteus DX4 Plus, Aiper Scuba V3 AI Vision (+ `aiper scuba v3 review`, `aiper ai vision`)
- **Comparison (12):** dolphin vs polaris robotic pool cleaner · dolphin vs aiper · aiper vs beatbot · polaris freedom vs dolphin nautilus cc plus · dolphin proteus dx4 vs nautilus cc plus · beatbot vs dolphin premier · corded vs cordless robotic pool cleaner · pool robot vs suction cleaner · pool robot vs pressure cleaner · robotic vs manual pool vacuum · aiper scuba v3 vs beatbot aquasense 2 · wybot vs aiper
- **Educational questions (~30):** do robotic pool cleaners climb walls · do pool robots clean the waterline · are robotic pool cleaners worth it · how do robotic pool cleaners work · how often should a robotic pool cleaner run · can you leave a robotic pool cleaner in the pool · how long do robotic pool cleaners last · pool robot not climbing walls · how to clean pool robot filter · do robotic cleaners pick up leaves · what micron filter for pool pollen · pool robot for algae · etc.
- **Long-tail modifiers:** for small pools · for vinyl liner · for fiberglass · for saltwater pools · with app · with waterline cleaning · self emptying · solar powered · quietest · etc.

The full machine-readable seed list is generated at paid-run time and cached
gitignored (`docs/seo/cache/`, see §4) so raw API responses never enter git.

## 2. Proposed page inventory (the keyword-to-URL map) — 13 pages

**Count correction (2026-08-01):** the initial handoff said 14 proposed pages;
the actual inventory below is **13** (4 core commercial + 5 product reviews +
3 guides + 1 direct comparison). The 14 was a summary miscount, not a missing
page — no filler page is invented to reach it. Additional URLs (segment
best-ofs, further pair comparisons, more guides) are created only where the
paid SERP evidence justifies a split.

One canonical URL = one intent cluster. URLs follow the **locked Job 6 route
registry**; the Round 1 map's obsolete shapes (`/best/…`, `/guides/<flat>`)
are re-pointed here and flagged in §3.

| # | Page | Canonical URL | Type | Intent | Lead keyword | Core cluster (2–5) |
|---|---|---|---|---|---|---|
| 1 | Category hub | `/robots/robotic-pool-cleaners/` | Category | Commercial | robotic pool cleaner *(40,500/mo, KD 0, $5.17 — Round 1)* | robot pool cleaner · pool cleaning robot · automatic pool cleaner robot · pool robot |
| 2 | Best-of guide | `/best-robots/robotic-pool-cleaners/` | Best Of | Commercial | best robotic pool cleaner *(KD 10 — Round 1)* | best robot pool cleaner · top rated robotic pool cleaners · best robotic pool cleaner 2026 · best pool cleaning robot |
| 3 | Comparison hub | `/compare/robotic-pool-cleaners/` | Comparison | Comparison | dolphin vs aiper pool cleaner *(KD 4 — Round 1)* | robotic pool cleaner comparison · dolphin vs polaris · compare pool robots |
| 4 | BotMatch landing | `/botmatch/robotic-pool-cleaners/` | Tool | Transactional | which robotic pool cleaner should I buy | help me choose a pool cleaner · pool cleaner quiz · what pool robot do I need |
| 5 | Review: Dolphin Nautilus CC Plus | `/robots/robotic-pool-cleaners/dolphin-nautilus-cc-plus/` | Product Review | Commercial | dolphin nautilus cc plus review | dolphin nautilus cc plus wi-fi · dolphin nautilus cc plus · is the nautilus cc plus worth it |
| 6 | Review: Polaris FREEDOM | `/robots/robotic-pool-cleaners/polaris-freedom/` | Product Review | Commercial | polaris freedom review | polaris freedom robotic pool cleaner · polaris freedom cordless · polaris freedom plus |
| 7 | Review: Betta SE Plus | `/robots/robotic-pool-cleaners/betta-se-plus/` | Product Review | Commercial | betta se plus review | betta pool skimmer · betta se plus solar skimmer · betta robotic skimmer |
| 8 | Review: Dolphin Proteus DX4 Plus | `/robots/robotic-pool-cleaners/dolphin-proteus-dx4-plus/` | Product Review | Commercial | dolphin proteus dx4 review | dolphin proteus dx4 plus · proteus dx4 vs nautilus cc plus (link-out) |
| 9 | Review: Aiper Scuba V3 AI Vision | `/robots/robotic-pool-cleaners/aiper-scuba-v3-ai-vision/` | Product Review | Commercial | aiper scuba v3 review | aiper scuba v3 ai vision · aiper ai vision pool cleaner |
| 10a | Guide: corded vs cordless | `/guides/corded-vs-cordless-robotic-pool-cleaners/` | Guide | Informational | corded vs cordless robotic pool cleaner | are cordless pool robots better · cordless pool cleaner pros and cons |
| 10b | Guide: are they worth it | `/guides/are-robotic-pool-cleaners-worth-it/` | Guide | Informational | are robotic pool cleaners worth it | robotic pool cleaner pros and cons · is a pool robot worth the money |
| 10c | Guide: walls & waterline | `/guides/do-robotic-pool-cleaners-climb-walls/` | Guide | Informational | do robotic pool cleaners climb walls | pool robot waterline cleaning · wall climbing pool cleaner (informational share) |
| 10d | Comparison: Polaris FREEDOM vs Nautilus CC Plus | `/compare/robotic-pool-cleaners/dolphin-nautilus-cc-plus-vs-polaris-freedom/` | Comparison | Comparison | polaris freedom vs dolphin nautilus | *(pair selection to be confirmed by SERP demand data)* |

Each row also carries (in the Notion register): long-tails, questions/PAA,
proposed title/H1/meta, internal links in/out, affiliate plan, structured
data, and the cannibalisation ruling below. Volume/KD/CPC/SERP columns stay
empty until the paid batch fills them — **no number is invented**.

## 3. Cannibalisation rulings (zero-cost pass; SERP overlap to confirm)

- **Hub vs best-of:** hub owns head/category terms; best-of owns `best/top` modifiers only. *(Round 1 ruling, retained.)*
- **Best-of vs segment best-ofs:** segment pages (above-ground, large pools, leaves, budget, cordless) are **deferred** — researched as clusters but not proposed as URLs until the paid SERP pass shows materially different results; until then their terms roll up into page 2 sections. Risk: **Merge** by default.
- **Reviews vs best-of:** reviews own exact-model + review/worth-it terms; best-of owns selection terms. Risk: None.
- **Betta SE Plus review vs generic `solar pool skimmer`:** generic term likely deserves the hub/guide layer, not the review. Risk: **Monitor** — decide with SERP data.
- **`wall climbing pool cleaner`:** commercial share may belong to best-of section, informational share to guide 10c. Risk: **Monitor**; one URL will be made subordinate.
- **Comparison hub vs pair pages:** hub owns brand-vs-brand; pair pages own explicit model-vs-model, created only where demand is proven. Reverse orders 301 to the alphabetical canonical (locked rule).
- **BotMatch landing:** conversion tool; must not compete with hub for head terms — noopener intent cluster is "help me choose". Risk: None.
- **Route corrections vs Round 1 map:** `/best/…` → `/best-robots/robotic-pool-cleaners/`; flat guide slugs stay under `/guides/…` per the live registry; `keywords.ts` will be updated to the approved map in the build phase (not in the research branch).
- **Proteus DX4 Plus & Scuba V3 reviews:** products are not yet in the public catalogue (Job 11 candidates with owner media). Research proceeds; publication depends on their catalogue reconciliation — recorded so the register cannot imply otherwise.

## 4. DataForSEO execution plan (pending credentials)

**Locale settings:** location_code 2840 (United States), language_code "en", Google, desktop (mobile SERP sample for the hub + one review only).

| Step | Endpoint | Batch | Est. cost |
|---|---|---|---|
| Volume/CPC/competition for all seeds | `keywords_data/google_ads/search_volume/live` | 1 call, ≤1,000 keywords | ~$0.05–0.10 |
| Keyword difficulty | `dataforseo_labs/google/bulk_keyword_difficulty/live` | 1 call, ≤1,000 | ~$0.05 |
| Cluster expansion for the 14 lead terms | `dataforseo_labs/google/related_keywords/live` (depth 1) | ≤14 tasks | ~$0.15 |
| PAA + SERP type/overlap for ~25 decisive queries | `serp/google/organic/live/advanced` (people_also_ask enabled) | 25 tasks | ~$0.10–0.25 |
| **Total expected** | | | **≈$0.35–0.55** (cap $2.00) |

Raw responses cached in `docs/seo/cache/` (**gitignored**); a sanitised
summary lands in this directory and in the Notion register with per-batch cost.
No request is repeated inside 30 days of Round 1 — Round 1 head-term numbers
are reused as-is. **No future robot category is researched.**

## 5. Blocked-on-owner

`DATAFORSEO_LOGIN` and `DATAFORSEO_PASSWORD` are not present in this
environment and cannot be confirmed in GitHub secrets from here. Danny must
add those two secret names (values never in chat/Notion/commits) — everything
above runs immediately afterwards.
