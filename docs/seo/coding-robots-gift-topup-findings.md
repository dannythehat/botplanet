# Coding robots — Christmas gift-modifier top-up, 26 September 2026

**Measured, not estimated.** DataForSEO run 26 September 2026 on 22 seeds and
5 SERPs, $0.1606 of a $0.50 cap. Every figure below is read from that run.
Seed file: `docs/seo/seeds/coding-robots-gift-topup.json`.

## The instinct was wrong, and the numbers say so plainly

Every generic gift-intent phrase seeded — `best coding robot for christmas`,
`coding robot gift for kids`, `christmas gifts for kids who like robots`,
`best stem toys for christmas 2026`, `screen free coding toy for kids` —
returned **no measurable volume**. `stem toys for christmas` (the bare form)
returned 10/mo. Nobody is typing the phrase a gift guide is built to catch.

**The Christmas demand is real, and it is on the product names, not a gift
wrapper.** Both products show 3-10x seasonal swings peaking in December:

| Term | Baseline | December | KD |
|---|---|---|---|
| `botley the coding robot` | 390-1,600/mo | **4,400/mo** | 0 |
| `botley 2.0` | 480-1,000/mo | **1,600/mo** | 0 |
| `code and go robot mouse` | 320-720/mo | **880/mo** | 0 |

This is the same shape as the already-built Miko/Vector/Eilik/Loona/Moflin
cluster (see `Companion Robots — Build Plan & Keywords`, 8 August): a reader
does not search "coding robot gift," they search the exact toy a relative
mentioned, in November and December. The review page IS the gift-guide page.

## Ruling: build two reviews, no gift-guide page

**Botley the Coding Robot** — `/robots/educational-coding-robots/botley-the-coding-robot/`.
Head term 1,300/mo baseline to 4,400/mo December, KD 0. SERP is manufacturer
(learningresources.com), retailers (Amazon, hand2mind, hand2mind, hand2mind,
kaplanco — several are classroom suppliers) and one independent hands-on
review (teachyourkidscode.com). Room for an independent review; not a
publisher-saturated SERP.

**Code & Go Robot Mouse** — `/robots/educational-coding-robots/code-and-go-robot-mouse/`.
Smaller — 590/mo baseline to 880/mo December, KD 0 — but real, and the SKU
question flagged 8 August (classroom-set ASIN vs. single unit) is now
resolved: **B01B14XK00** is a clean standalone listing, not the $71.99
activity-set or $270.99 classroom-set ASINs.

**No gift-guide page.** The generic gift-modifier phrases this run priced
specifically to justify one returned no volume. Building a page for a
phrase with no measured search behind it is the exact mistake
PRE-BUILD-PROCESS.md exists to prevent.

## What was NOT settled by this run, stated plainly

- **No product-page fetch of either Amazon listing** — Amazon blocks
  automated fetching in this environment (the same wall Grillbot hit).
  ASINs and prices below come from web search result titles/snippets, not a
  direct listing read. Both are wired at `researched_exact` with the gap
  disclosed, same bar as the Grillbot and robot-vacuum precedents, until a
  clean direct read replaces it.
- **Botley 2.0's exact current price** was not read live — search snippets
  disagreed ($64, $81, $84.99, $64.99 across different sources/dates). No
  price is published; the buy box shows "Check current price" until the
  automated refresh service reads and dates one, per the standing rule.
- **Live by mid-November** is the target, mirroring the companion-robots
  cluster's "live and indexed before the peak" reasoning — a page published
  after Thanksgiving arrives at the swing with no crawl history.
