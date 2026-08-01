# US Pool SEO Research — Findings and Final Keyword-to-URL Map

**Run:** GitHub Actions 30691679570 on `research/pool-seo-page-map@4cea12e` ·
**Completed:** 2026-08-01 08:26 UTC · **Spend: $0.2154 of the $2.00 cap** ·
Locale: US (2840) / en / Google desktop. Artifact `seo-research-results.json`
(ID 8815900734); receipt `docs/seo/latest-research-run.json`.

Batches: 1× search_volume (119 keywords, +12-month trend), 1× bulk KD (119),
13× related_keywords, 22× live SERP advanced. Seeds: 119 after local dedupe
(from ~180 raw). No future-category keyword was researched.

## Headline numbers

| Cluster | Volume/mo | KD | CPC | Seasonality |
|---|---|---|---|---|
| robotic pool cleaner (+robot pool cleaner, pool cleaning robot — Google groups all three) | **40,500** | 14/0/0 | $5.17 | peak Jun **90,500** → trough Dec **9,900** |
| **cordless robotic pool cleaner** | **22,200** | **0** | $5.32 | peak May 60,500 → Nov 4,400 |
| best robotic pool cleaner (+best robot…, top rated…, **and** "…for inground pools" — same grouped cluster) | 6,600 | 13 | $6.21 | peak Jun 14,800 |
| solar pool skimmer | 6,600 | 0 | $5.31 | peak May 14,800 |
| dolphin nautilus cc plus (model cluster) | 5,400 (+480 wifi, +140 review) | 0 | $3.42 | Jun 9,900 |
| betta pool skimmer / betta se plus | 3,600 / 1,600 | 0 | $6-7 | Jun 9,900 |
| aiper scuba v3 (+ai vision, review) | 1,000 (+170) | 3–14 | $8 | Jun 5,400 |
| dolphin proteus dx4 | 390 (+40 review) | 0 | $2.71 | Jun 880 |
| polaris freedom robotic pool cleaner | 260 (+20 review) | 0 | $5.62 | Jun 590 |
| comparisons (aiper vs dolphin 110; dolphin vs polaris 30; model-pair terms) | ≤110 | 0–12 | low | — |
| educational questions (worth it 40; how do they work 40; corded vs cordless 10; climb walls —) | ≤40 | 0 | low | — |

**Honesty note for the Christmas objective:** December is this category's
annual search LOW (~9,900 vs 90,500 in June). Early publication matters for
indexing and for catching the late-season tail, but the demand curve peaks
May–July; expectations for pre-Christmas organic volume must reflect that.

## SERP-driven rulings (final)

1. **CREATE — Cordless best-of page** (`/best-robots/robotic-pool-cleaners/cordless/`,
   child-route shape proposed for ratification). 22,200/mo at KD 0 — the
   single biggest wedge in the dataset, and Round 1 flagged it too. The
   "best cordless" SERP is list content (thepoolnerd, poolbots, Beatbot,
   Amazon, Reddit) — a best-of page, not a hub section. This is the
   data-justified 14th… now 12th page (see final count below).
2. **MERGE — "…for inground pools" into the main best-of.** Google reports
   the identical 6,600/KD 11-13 grouped cluster and the SERPs overlap
   (thepoolnerd/poolbots/Amazon). A separate URL would self-cannibalise.
   Above-ground (140), large pools (70), leaves (20) and budget (50) also
   stay as sections — volumes nowhere near justifying URLs.
3. **REJECT — dedicated pair page (CC Plus vs FREEDOM).** The exact pair
   phrase has no measurable volume; the SERP is Reddit/forums plus
   "Polaris or Dolphin better?" PAA. Brand-vs-brand intent (aiper vs
   dolphin 110) is owned by the comparison hub with per-pair sections.
   Pair URLs return only if demand appears.
4. **MERGE — "corded vs cordless" guide into the hub section + the new
   cordless page.** Volume 10; the intent is answered inside commercial
   SERPs and as PAA. Not a standalone URL.
5. **MERGE — "climb walls / waterline" guide into the hub's
   floor-wall-waterline section + FAQs.** No measurable volume; the
   commercial share ("wall climbing pool cleaner", 20/mo) is a best-of
   section at most.
6. **KEEP — "Are robotic pool cleaners worth it?" guide.** 40/mo plus it is
   the #1 PAA on the 40,500 head term ("Is a robot pool cleaner worth
   it?") — a featured-snippet/AI-overview play that feeds the hub.
7. **MONITOR — "solar pool skimmer" (6,600, KD 0).** Real segment demand,
   but the catalogue holds exactly one skimmer (Betta SE Plus); a one-
   product segment page would be thin. The Betta review owns betta terms
   (3,600+1,600). Recorded as the first candidate page for a future
   skimmer segment once ≥2 products exist.
8. **BotMatch landing: no SEO targeting.** "which robotic pool cleaner
   should i buy" is 10/mo at KD 52 with a best-of SERP. The page exists as
   the conversion tool; it competes for nothing.
9. **Reviews confirmed.** Model clusters are the cheapest real traffic in
   the set (KD 0 almost everywhere): Nautilus CC Plus ~6,000 combined;
   Betta ~5,300 combined; Scuba V3 ~1,200; Proteus DX4 ~430; FREEDOM ~280.
   Proteus DX4 Plus and Scuba V3 publication remains gated on catalogue
   reconciliation.

## Final map — 11 pages ready for briefs (was 13 proposed)

| # | Page | Canonical URL | Lead keyword (vol / KD) |
|---|---|---|---|
| 1 | Category hub | `/robots/robotic-pool-cleaners/` | robotic pool cleaner (40,500 / 14) |
| 2 | Best-of guide | `/best-robots/robotic-pool-cleaners/` | best robotic pool cleaner (6,600 / 13) — incl. inground/above-ground/large/leaves/budget sections |
| 3 | **Cordless best-of** *(new)* | `/best-robots/robotic-pool-cleaners/cordless/` | cordless robotic pool cleaner (22,200 / 0) |
| 4 | Comparison hub | `/compare/robotic-pool-cleaners/` | aiper vs dolphin (110 / 0) + brand pairs as sections |
| 5 | BotMatch landing | `/botmatch/robotic-pool-cleaners/` | conversion tool — no SEO target |
| 6 | Review: Dolphin Nautilus CC Plus | `/robots/robotic-pool-cleaners/dolphin-nautilus-cc-plus/` | dolphin nautilus cc plus (5,400 / 0) |
| 7 | Review: Polaris FREEDOM | `/robots/robotic-pool-cleaners/polaris-freedom/` | polaris freedom robotic pool cleaner (260 / 0) |
| 8 | Review: Betta SE Plus | `/robots/robotic-pool-cleaners/betta-se-plus/` | betta pool skimmer (3,600 / 0) |
| 9 | Review: Dolphin Proteus DX4 Plus | `/robots/robotic-pool-cleaners/dolphin-proteus-dx4-plus/` | dolphin proteus dx4 (390 / 0) |
| 10 | Review: Aiper Scuba V3 AI Vision | `/robots/robotic-pool-cleaners/aiper-scuba-v3-ai-vision/` | aiper scuba v3 (1,000 / 14) |
| 11 | Guide: Are robotic pool cleaners worth it? | `/guides/are-robotic-pool-cleaners-worth-it/` | are robotic pool cleaners worth it (40 / 0 + head-term PAA #1) |

Merged/rejected (recorded in the register, not built): inground best-of →
page 2; corded-vs-cordless guide → pages 1+3; climb-walls guide → page 1;
CC Plus vs FREEDOM pair page → page 4 sections. Deferred candidates: solar
pool skimmer segment (6,600/KD 0, needs catalogue depth); pair comparisons.

## Competitors (recurring across every commercial SERP)
thepoolnerd.com · poolbots.com · Reddit/r-pools · maytronics.com ·
lesliespool.com · Amazon · reviewed.com · intheswim.com. Content gap the
SERPs show: nobody pairs honest evidence labels + suitability reasoning
with side-by-side offers — BotPlanet's exact design.
