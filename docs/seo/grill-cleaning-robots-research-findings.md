# Grill-cleaning robots — keywords per page

Page 006 of the owner-locked ten. Researched 6 August 2026. US volumes, searches per month.

## The verdict first: the category survives

This run was designed to kill it. Grillbot is close to the only robotic grill cleaner
with US retail presence — the same position security robots was in before it was
cancelled — so the SERP budget went on proving demand rather than assuming it.

| Test | Result |
|---|---|
| Is the head term a shopping SERP? | **Yes.** grillbots.com, Amazon ×2, Walmart, Consumer Reports, Food & Wine |
| Does the grill-brush market swallow it? | **No.** 2 shared domains, both universal |
| Does the brand own the category? | **Partly.** `grillbot` 18,100 vs category 5,400 |

## The page · `/robots/grill-cleaning-robots/`

| Use it for | Keyword | Vol | KD |
|---|---|---|---|
| **H1 + title** | **grill cleaning robot** | **5,400** | 0 |
| In copy | robotic grill cleaner | 5,400 | 0 |
| In copy | grill cleaning robots | 5,400 | 0 |
| In copy | automatic grill cleaner | 1,900 | 0 |
| In copy | bbq cleaning robot | 170 | 1 |
| Mentioned | grillbot | 18,100 | 11 |

Google groups the phrasings hard — `robotic grill cleaner`, `robot grill cleaner` and
`grill cleaning robots` all read 5,400. That's 5,400 for the family, not each.

## Seasonality — the sharpest on the site

`grill cleaning robot`: **18,100 in June, 720 in February. A 25× swing.**

Sharper than pool (9×) or robotic puppy (26× is comparable but that's a toy). The page
has to be live and indexed before spring or it misses the year entirely.

## Don't build

| | Why |
|---|---|
| Anything targeting `grill brush` (33,100) | Six times our traffic, 2 shared domains, both universal. It's the manual-tool market. BotPlanet compares robots. |
| `bristle free grill brush` (5,400) | Tempting — bristle safety is the honest argument for the category. But 2 shared domains: it's a brush SERP owned by brush makers. Section, not a target. |
| `how to clean grill grates` (6,600) | 1 shared domain. Cooking content, not shopping. |
| A best-of page | `best grill cleaning robot` is 10/mo and shares 5 domains with the head. |
| `grillbot review` (5,400) | Belongs to a review page, not the hub. Shares 8 domains with `does grillbot work` — same page again. |

## Reviews

One product dominates, so one review matters:

| Product | Keyword | Vol |
|---|---|---|
| Grillbot | grillbot | 18,100 |
| — its review cluster | grillbot review / does grillbot work | 5,400 / 210 |

## One number worth staring at

`wire grill brush danger` — 260 searches, **CPC $18.08**.

That's the highest cost-per-click measured in any BotPlanet category by a factor of
three, and it isn't retail money. It's the shape of a term advertisers bid on because
somebody was injured. The bristle-safety section is written carefully because of it:
it explains the mechanism, and it says plainly that a $15 bristle-free brush removes
the same risk. We are not monetising a hazard.

---

Run `31092662805`. Seeds: `docs/seo/seeds/grill-cleaning-robots.json`.

**Note on the run.** It hung for 52 minutes and was cancelled; the digest and artifact
steps still ran, so the data survived. Root cause, caught by the per-task reporting
added earlier the same day: DataForSEO's `related_keywords` endpoint accepts **one task
per request** and returned `40000 You can set only one task at a time` for all twelve
leads, which sent the script into its per-lead fallback loop. Fixed in
`scripts/seo-research.mjs` — 12-minute wall-clock deadline, fallback capped at 4 leads,
per-call timeout cut to 45s. 15 of 20 SERPs completed before cancellation; the 5 missing
were `grill scraper`, `grill cleaning tools`, `how to clean grill grates`,
`clean grill without a brush` and `grill cleaning robot vs brush`. None changes a ruling.
