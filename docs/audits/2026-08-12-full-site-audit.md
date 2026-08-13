# BotPlanet — full site audit, 12 August 2026

Every URL in the live sitemap was fetched from production and measured. Nothing
below is from memory or from the repository: it is what the site served.

**Method, so it can be reproduced or contradicted.**
110 URLs read from `https://botplanet.io/sitemap.xml`. Each fetched with
redirects disabled. Navigation chrome excluded by isolating `<main>`, so a
header or footer link cannot inflate a content link count. "Prose" excludes
tables and the product grid, so it measures the writing only. Every distinct
internal destination found on any page (127 of them) was then fetched
separately to check for broken or redirecting links.

---

## 1. What is not wrong

Stated first because the failures below are specific, and a reader should know
what was checked and passed.

| Check | Result |
|---|---|
| Pages returning 200 | 110 of 110 |
| Broken internal links | **0** of 127 destinations |
| Internal links pointing at a redirect | **0** |
| Missing `<title>` | 0 |
| Missing meta description | 0 |
| Missing canonical | 0 |
| Pages without exactly one H1 | 0 |
| Missing `og:image` | 0 |
| Pages with no schema | 0 |
| `noindex` pages wrongly listed in the sitemap | 0 |
| Titles over 65 characters | 0 |

Two audit lines that look like failures and are not, named so nobody chases
them:

- **"48 pages with images missing alt"** — false positive. Each is a single
  decorative image carrying `alt=""`, which is the correct treatment and is
  enforced by an existing test. Every content image has real alt text.
- **"/privacy/ and /terms/ are orphans"** — false positive. Both are linked
  from the footer's legal row, which sits outside `<main>` and was excluded by
  design.

Nineteen URLs are linked but absent from the sitemap. All are deliberate: the
per-category BotMatch funnels render `noindex` (a questionnaire has nothing to
rank), plus the grill comparison page and a deals page that are gated until
they hold enough products.

---

## 2. Where the site stands, by page type

| Type | Pages | Avg words | Links in prose | Product links | Pages with a buy button |
|---|---|---|---|---|---|
| Category hub | 9 | 3,212 | 5.0 | 6.9 | **0** |
| Review | 64 | 2,010 | 11.5 | 2.8 | 48 |
| Best-of ranking | 4 | 2,806 | 19.2 | 8.2 | **0** |
| Guide | 7 | 1,668 | 11.0 | 3.6 | **0** |
| Compare | 9 | 649 | 5.1 | 7.0 | **0** |
| Core / index / author | 16 | ~250 | ~4 | ~2 | 0 |

**48 of 110 pages carry a buy button. All 48 are reviews.**

---

## 3. DEFECT — robot vacuums have no offers at all

The largest category on the site, targeting a 135,000/mo head term, with eleven
published reviews. Every one of them has been live and indexable with no way to
buy anything.

Offer rows per category, queried from D1:

| Category | Published products | Products with an offer row |
|---|---|---|
| robotic-pool-cleaners | 11 | 11 |
| window-cleaning-robots | 11 | 11 |
| robotic-lawn-mowers | 7 | 7 |
| self-cleaning-litter-boxes | 4 | 4 |
| pet-camera-robots | 3 | 3 |
| companion-robots | 9 | 7 |
| educational-coding-robots | 6 | 5 |
| robot-snow-blowers | 1 | 1 |
| **robot-vacuums** | **11** | **0** |
| **grill-cleaning-robots** | **1** | **0** |

**Root cause.** The repository holds a seed directory per catalogued category —
`coding`, `companion`, `lawn`, `litter`, `petcam`, `pool`, `snow`, `window`.
That pipeline is what creates the Amazon offer rows. **There is no `vacuums`
directory and no `grill` directory.** Those products reached D1 by another
route, without offers, and eleven reviews were then written on top of them.

This is not a rendering bug and not a data drift. It is a category that was
built and published with its buy path never constructed. The 3 companion and 1
coding products without offers are different and correct: EMO and Moxie are not
sold in the US, Cozmo is discontinued, and each says so on its page.

**What fixing it requires.** Verified Amazon ASINs for eleven current vacuums,
read at the retailer, with the identity confirmed — the same Stage 4 discovery
run the lawn mowers had. It cannot be fixed by writing code, and an ASIN must
never be guessed.

---

## 4. DEFECT — nine category hubs link nothing from their own writing

| Hub | Words | Links in prose | Product links in prose |
|---|---|---|---|
| window-cleaning-robots | 3,702 | 5 | **0** |
| companion-robots | 3,680 | 5 | **0** |
| self-cleaning-litter-boxes | 3,630 | 5 | **0** |
| robotic-lawn-mowers | 3,259 | 6 | **0** |
| robot-vacuums | 3,207 | 5 | **0** |
| pet-camera-robots | 3,013 | 5 | **0** |
| educational-coding-robots | 2,947 | 5 | **0** |
| grill-cleaning-robots | 2,775 | 3 | **0** |
| robotic-pool-cleaners | 2,694 | 6 | **0** |

Roughly 29,000 words of category copy across the nine biggest pages on the
site, and not one link from that copy to a product. Every product link on a hub
sits inside a comparison table, a capability table, or the card grid — which on
the companion hub begins **84% of the way down the document**.

**Root cause.** The internal-link injector runs on **markdown only**. Reviews
and guides are markdown, so their prose gets links injected — hence 11.5 links
per review against 5.0 per hub, and those 5 are chrome-adjacent rather than
editorial. Hub sections are structured records rendered straight to HTML. The
injector has never been able to see them.

---

## 5. DECISION, NOT A DEFECT — the pages built to convert cannot be bought from

29 pages: 4 best-of rankings, 7 guides, 9 comparison pages, 9 hubs. All of them
name products, rank them, and argue for one. None carries a buy button.

This is written into the code as an editorial position: a hub "links to
products, it does not sell them", and a best-of page prints no price so that a
figure nobody re-checked cannot go stale inside a ranking.

The clearest example: `/best-robots/robotic-pool-cleaners/cordless/` is 3,461
words, ranks ten machines, and targets 22,200 searches a month. A reader who
has decided which one to buy must click again into a review to find a button.

The position on prices is right. The position on buy buttons costs money on the
four highest-intent page types on the site. A dated "Check price" link, which is
what the reviews already use, honours the price rule and closes the gap — it
promises no figure, only a destination.

---

## 6. Smaller findings

- `/authors/danny/` meta description exceeds 160 characters and will be
  truncated in results.
- 13 pages are under 300 words. All are index or policy pages where that is
  appropriate, except `/guides/robotic-pool-cleaners/` at **155 words**, which
  is a live indexable URL in the sitemap and is thin by any measure.
- `/about/` has one inbound internal link. `/guides/do-window-cleaning-robots-work/`
  has one, despite being a page built to answer the category's top objection.
- 16 pages carry no images at all — mostly policy and index pages.

---

## 7. What is proposed, and what is blocked

| # | Action | Type | Blocked on |
|---|---|---|---|
| 1 | Add dated "Check price" links to best-of, guide, compare and hub product mentions, for products that have a verified offer | Build | Nothing |
| 2 | Extend the internal-link injector to hub sections, so category copy links products | Build | Nothing |
| 3 | Amazon ASIN discovery for 11 robot vacuums, verified at the retailer | Data | Owner time / a research run |
| 4 | Same for the 1 grill product | Data | As above |
| 5 | Expand or retire `/guides/robotic-pool-cleaners/` at 155 words | Editorial | Owner decision |

---

## 8. Questions this audit cannot answer

For a reviewer double-checking this:

1. Is the no-buy-button-outside-reviews position worth keeping for any of the
   four page types, or should all 29 pages carry a dated "Check price"?
2. Should hub prose be auto-linked, or does the injector's link density
   (11.5 per review) become spammy at 3,200 words?
3. Was there ever a reason robot vacuums were catalogued outside the seed
   pipeline, or was it simply skipped?
