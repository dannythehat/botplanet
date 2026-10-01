# Solar pool skimmers — research findings, 1 October 2026

**Measured, not estimated.** DataForSEO run 1 October 2026, 24 seeds and 5 live
SERPs, **$0.1638 of a $0.75 cap**. Seed file: `docs/seo/seeds/solar-pool-skimmers.json`.
Raw output stays in `research-output/` (git-ignored); the digest is
`node scripts/seo-research-digest.mjs --category=solar-pool-skimmers`.

This re-runs the question the page plan has carried since 6 August: *should
`/best-robots/robotic-pool-cleaners/solar-powered-skimmers/` exist?* The plan marks
it **planned, blocked on a second skimmer**. This run answers whether the demand
justifies clearing that block and, separately, which second skimmer exists.

## The ruling

**Conditional GO — one best-of page, gated on two more verified machines.**
The demand is real and the SERPs are winnable. What is missing is product, not
keywords, and nothing here changes the gate that blocked it in August.

## A correction first

The earlier assumption that the catalogue holds a second skimmer in the
**Aiper Seagull SE is wrong.** Aiper's own listing calls the Seagull a
*cordless robotic pool cleaner* (floor and wall), `aiper seagull solar` returns no
volume at all, and Aiper's skimmer is the **Surfer S2**, a different machine. The
catalogue holds exactly one skimmer: the **Betta SE Plus**.

## Volumes (monthly average, US)

| Term | /mo | KD | CPC |
|---|---:|---:|---:|
| solar pool skimmer | 5,400 | 9 | $4.07 |
| solar powered pool skimmer | 5,400 | 0 | $4.07 |
| robotic pool skimmer | 2,400 | 24 | $3.79 |
| pool skimmer robot | 2,400 | 13 | $3.79 |
| automatic pool skimmer | 1,600 | 0 | $3.10 |
| solar powered pool cleaner | 880 | 0 | $4.18 |
| best robotic pool skimmer | 480 | 3 | $6.42 |
| best solar pool skimmer | 320 | 0 | $7.66 |
| solar pool skimmer robot | 320 | 0 | $5.17 |

**The first two rows are one query family, not 10,800.** DataForSEO returns the
identical 5,400 and identical monthly shape for both. The same ceiling-not-a-figure
rule that corrected the snow-blower arithmetic applies.

**Brand-shaped demand is larger than category-shaped demand.** Betta alone:

| Term | /mo | KD |
|---|---:|---:|
| betta pool skimmer | 4,400 | 4 |
| betta se plus solar pool skimmer | 1,000 | 0 |
| betta se solar pool skimmer | 880 | 1 |
| betta se plus pool skimmer | 720 | 0 |
| betta solar pool skimmer | 590 | 5 |
| betta pool skimmer reviews | 260 | 0 |

These overlap each other and cannot be added. They belong to the **existing Betta
SE Plus review**, not to the new page. Others: `wybot s2` 390 (KD 0),
`beatbot skimmer` 140 (KD 6), `aiper seagull se` 1,300 and `aiper seagull pro`
1,300 (both floor-and-wall robots, so they belong to existing reviews).

## The demand has a shape, and the average hides it

`solar pool skimmer` runs **1,300 in January and 14,800 in May**, an 11x swing, on
the same 5,400 average:

`Sep 4,400 · Oct 2,900 · Nov 2,400 · Dec 1,900 · Jan 1,300 · Feb 1,600 · Mar 6,600 · Apr 8,100 · May 14,800 · Jun 12,100 · Jul 8,100 · Aug 4,400`

Recorded because the register stores averages and a reader of "5,400" would
otherwise assume that is what a normal month looks like. It is a measurement of
the shape of demand, not a reason to hurry.

## The one-URL rule

| Pair | Shared top-10 domains | Ruling |
|---|---:|---|
| solar pool skimmer ↔ solar powered pool cleaner | **6** | **One page** |
| solar pool skimmer ↔ best solar pool skimmer | 2 | Different SERPs |
| solar pool skimmer ↔ robotic pool skimmer | 2 | Different SERPs |
| best solar pool skimmer ↔ robotic pool skimmer | 3 | Different SERPs |

So `solar pool skimmer`, `solar powered pool skimmer` and `solar powered pool
cleaner` are **one URL**. By the rule, `best solar pool skimmer` (320) and
`robotic pool skimmer` (2,400, KD 24, dominated by Maytronics, Amazon and
Walmart) would each earn their own page. **Deferred, not refused:** neither earns
a page until the first has the product depth to be worth a second, and the
second would draw on the same machines.

## What the SERP looks like

The head term is a **mixed SERP**: independent reviews (The Pool Nerd's "5 Models
Tested", troublefreepool), Reddit threads, the manufacturer (bettabot.com), retail
(Amazon, Costco, Walmart, Wayfair) and brand pages (Polaris, Solar-Breeze). It
carries `popular_products`, `people_also_ask`, video and images, and the best-of
query adds an **AI overview**. A best-of with real product depth is the page shape
that has room here. Reddit appears in four of five SERPs, which is the usual sign
that the independent answers are thin.

PAA to answer on the page: *Are solar pool skimmers worth it? · Do robotic pool
skimmers actually work? · Which is better, an Aiper or a Betta?*

## Machines named in the SERPs — NONE VERIFIED

These are names only. **No Amazon identity has been read for any of them.**

| Machine | Where it appeared |
|---|---|
| Betta SE Plus | **Held.** Catalogued, reviewed, buy button wired |
| WYBOT S2 Solar | wybotpool.com, YouTube, Amazon |
| WYBOT F1 | Walmart, Wayfair |
| Aiper Surfer S2 | independent review (mryouwho.com) |
| Polaris Skimbot | polarispool.com, two SERPs |
| Solar-Breeze Ariel / NX2 | solar-us-shop.com |
| SolaSkimmer | Costco, swimmingpoollearning.com |
| Zigma Solar Pool Skimmer | amazon.com (2026 listing) |
| Dolphin Skimmi | vitafilters.com, two SERPs. **Not shown to be solar** |

Betta and Zigma are the only two seen on Amazon US. WYBOT M1 Ultra (Forbes) is a
floor robot with a solar dock and is **not a skimmer**; leave it out.

## Two existing pages have unmeasured registers

Both rows were written with `volume: 0` because they pre-date measurement, and
this run now has real numbers for them:

- **Betta SE Plus** — primary is `betta se plus review` (0). Measured demand is
  `betta pool skimmer` 4,400 and `betta se plus solar pool skimmer` 1,000. It
  carries `solar pool skimmer` only as a non-mandatory secondary.
- **Aiper Seagull SE** — primary `aiper seagull se review` (0); measured
  `aiper seagull se` is 1,300.

Neither is changed here. Both are proposals for the next register pass.

## Recommended order

1. **Verify the second and third skimmer** to an exact ASIN (Stage 4). Start with
   WYBOT S2 Solar, Aiper Surfer S2 and Zigma: the three most likely to have a clean
   Amazon US listing. The Betta lesson applies: a model name is not an identity, and
   the SE and SE Plus are different products.
2. **Then build** the best-of with at least three verified machines, ceding all
   brand terms to the reviews.
3. **Re-measure the Betta and Seagull registers**, which is the cheapest change
   here and concerns pages that already exist.

## What this run did not settle

- Whether any skimmer other than Betta has a buyable, identity-clean Amazon US
  listing. This is the whole gate.
- Whether the AI overview on `best solar pool skimmer` cites sources we could
  displace. It reads as a separate question from ranking.
- Real prices. None were read; none are claimed.
