# US Robotic-Lawn-Mower SEO Research — Findings and Proposed Keyword Map

**Main run:** GitHub Actions 31073327230 · 2026-08-06 05:23 UTC · **$0.21628**
**Top-up run:** 31074893036 · 2026-08-06 05:42 UTC · **$0.008** (see §9)
**Total spend: $0.22428 of the $2.00 cap** · Locale: US (2840) / en / desktop.
110 keywords priced (from the 123-term inventory in
`docs/seo/seeds/robotic-lawn-mowers.json`, 13 deduped), 13 related-keyword
leads, **24 live SERPs**, 27 API batches.

**Status: PROPOSED. Nothing is built until Danny signs off.**
Products and ASINs are Stage 4 — this document is Stage 2/3 only, per
`docs/seo/PRE-BUILD-PROCESS.md` and Danny's instruction of 6 August 2026:
*"We will do pages first, then add products afterwards."*

---

## 0. Read this first — the two things that change the plan

### a) This category is HARD. Much harder than pool or window.

| Category | Head term | Vol/mo | KD |
|---|---|---|---|
| Robotic pool cleaners | robotic pool cleaner | 27,100 | **14** |
| Window cleaning robots | window cleaning robot | 12,100 | **0–5** |
| **Robotic lawn mowers** | **robot lawn mower** | **74,000** | **36–54** |

Six times the traffic of window, at three to ten times the difficulty. This
is the first category where the head term is genuinely out of reach in the
short term, and the map below is built around that rather than pretending
otherwise.

### b) The head term and the "best" term are DIFFERENT SERPs here — unlike window.

This matters because the one-URL rule was justified for window by a
measurement, and the same measurement gives the opposite answer for lawn:

| Pair | Shared domains, top 10 |
|---|---|
| window cleaning robot ↔ best window cleaning robot | **6/10 → merged, correctly** |
| **robot lawn mower ↔ best robot lawn mower** | **2/10** |

Look at what each one actually returns:

- **`robot lawn mower`** (74,000, KD 36) → worx.com, navimow.com,
  husqvarna.com, us.mammotion.com, yarbo.com, lowes.com. **Half the page is
  manufacturers.** Google reads this as a shopping/navigational query. A
  comparison site does not win that SERP.
- **`best robot lawn mower`** (5,400, KD 8) → nytimes.com, amazon.com,
  reddit.com, youtube.com, jjtechish.substack.com, consumerreports.org,
  cnet.com, reviewed.com, homedepot.com, zdnet.com. **Every single result is
  editorial.** That is the SERP BotPlanet is built to compete in.

**So the strategic call is: build the category page to win the "best" cluster
(≈13,400/mo combined at KD 8–21), and treat the 74,000 head term as a
long-term aspiration we optimise for but do not expect.** Ranking for
`robot lawn mower` means outranking Husqvarna's own site. Ranking for
`best robot lawn mower` means outranking a Substack.

The one-URL ruling still stands and this map has one category page. But it is
worth stating plainly that in *this* category the merge has a real cost —
here we are folding two genuinely distinct SERPs into one URL by policy, not
because the data says they are the same. That is Danny's call to make, and it
is recorded here so nobody later thinks the measurement said otherwise.

---

## 1. Seasonality — sharper than either previous category

`robot lawn mower`, last 12 months:

| Month | Volume |
|---|---|
| **May / June 2026** | **135,000** ← peak |
| April 2026 | 110,000 |
| July 2025 | 110,000 |
| **August 2025** | **90,500** ← where we are |
| Sep 2025 / Mar 2026 | 60,500 |
| October 2025 | 40,500 |
| November 2025 | 27,100 |
| Jan / Feb 2026 | 22,200 |
| **December 2025** | **18,100** ← trough |

**A 7.5× swing between December and June.** Pool swung ~3×, window ~2.7×.

Every cluster follows it. `best robot mower` runs 1,600 in December to 14,800
in April. `husqvarna automower` runs 5,400 to 33,100.

**What that means for the build:** we are on the down-slope. The season we
should be targeting is **March–June 2027**, which is seven to ten months out.
That is close to ideal — pages built now have two full quarters to age and
accumulate links before the ramp starts in March. There is no version of this
where we build in February and rank in April.

---

## 2. TIER 1 — Category page keywords

**One URL: `/robots/robotic-lawn-mowers/`**

### 2a. The head cluster — one family, not five terms

| Keyword | Vol/mo | KD | CPC |
|---|---|---|---|
| robot lawn mower | 74,000 | **36** | $1.63 |
| robotic lawn mower | 74,000 | 39 | $1.63 |
| robotic lawnmower | 74,000 | 51 | $1.63 |
| lawn mowing robot | 74,000 | 51 | $1.63 |
| robot grass cutter | 74,000 | 54 | $1.63 |

**That is 74,000 total, not 370,000.** Google Ads reports the close-variant
*group* volume against every member, so all five read identically. The same
thing happened in the window research (five phrasings all showing 12,100).
Flagging it because the raw export invites a 5× overstatement.

The merge is also measured, not assumed: `robot lawn mower` ↔
`robotic lawn mower` share **8/10** domains. One page, definitively.

**Primary keyword: `robot lawn mower`** — lowest KD of the five at 36, and
the phrasing Google's own related-keyword tool returns most.

### 2b. Separate phrasings the hub also carries

| Keyword | Vol/mo | KD |
|---|---|---|
| **robot mower** | **22,200** | 32 |
| automatic lawn mower | 8,100 | 22 |
| autonomous lawn mower | 3,600 | 27 |
| self driving lawn mower | 1,600 | 48 |
| smart lawn mower | 880 | 48 |

`robot mower` at 22,200 is a genuinely separate cluster (its own volume, its
own KD, its own CPC at $2.18) and is the **secondary keyword**.

### 2c. The "best" cluster — folded in under the one-URL rule

| Keyword | Vol/mo | KD | CPC |
|---|---|---|---|
| best robot mower | 6,600 | 21 | $4.16 |
| best robot lawn mower | 5,400 | **8** | $3.81 |
| best robotic lawn mower | 5,400 | 15 | $3.81 |
| robot lawn mower reviews | 2,400 | 18 | $2.22 |
| best robot lawn mower 2026 | 1,000 | **3** | $3.45 |
| best robotic lawn mower 2026 | 260 | 0 | $4.27 |
| top rated robot lawn mowers | 170 | — | $3.64 |
| **Combined** | **≈13,400** | **3–21** | — |

This is where the money is. **CPC $3.45–$4.16 versus $1.63 on the head term**
— advertisers pay two and a half times more for these clicks, which is the
market telling us the buyers are here.

**Realistically this cluster is the category page's actual target.** KD 8 on
5,400/mo, in an all-editorial SERP.

### 2d. The decision cluster — also hub sections, and the SERP agrees

| Keyword | Vol/mo | KD | Evidence it belongs to the hub |
|---|---|---|---|
| which robot lawn mower should i buy | 0 | — | 6/10 with `robot lawn mower comparison`, 6/10 with `best robot lawn mower`, 5/10 with both head phrasings |
| robot lawn mower comparison | 90 | 17 | 7/10 with `best…for large yard`, 6/10 with `best`, 6/10 with `which…should i buy` |
| best robot lawn mower for large yard | 0 | — | **7/10** with `robot lawn mower comparison` |
| how do robot lawn mowers work | 210 | 7 | **5/10** with both head phrasings, 5/10 with comparison |
| are robot lawn mowers worth it | 210 | 18 | **5/10** with both head phrasings |
| **the acreage cluster** *(1 acre, 2 acres, half acre, small yard)* | **≈2,060** | 2–20 | **6/10** with `best robot lawn mower` — see §9b |

All six become **anchored sections of the category page**, not guides. The
"how do they work" and "worth it" rulings follow the same ≥5 threshold that
merged the window best-of — applied consistently, even though both read like
natural standalone guide topics.

### 2e. Proposed page metadata

- **H1:** Robotic Lawn Mowers: Compare Robot Mowers for Every Yard Size
- **Title:** Robotic Lawn Mowers: Compare Robot Mowers | BotPlanet
- **Primary:** robot lawn mower · **Secondary:** robot mower, best robot lawn mower
- **Long-tail in body:** automatic lawn mower, robotic lawnmower, best robot mower, robot lawn mower reviews, which robot lawn mower should i buy
- **Sections the SERP demands:** a ranked pick list (the "best" job), yard-size
  bands, wire-free vs boundary wire, slope limits, how they work, worth-it verdict

---

## 3. TIER 2 — Review keywords

Model-name reviews do not cannibalise the hub. Measured: `eufy robot lawn
mower` ↔ `robot lawn mower` is **1/10**; `segway navimow review` ↔
`husqvarna automower review` is **2/10**; `segway navimow review` ↔
`navimow vs luba` is **1/10**.

Four review SERPs came back **fully distinct** — `segway navimow review`,
`husqvarna automower review`, `ecovacs goat review`, `eufy robot lawn mower`
— confirming the tier is safe.

**One borderline pair, and I am overruling the threshold openly:**
`mammotion luba review` ↔ `worx landroid review` share 5/10. But the shared
domains are homedepot, reddit, toptenreviews and youtube — generic roundup
sites that rank for every review query in the category. That is not Google
saying "same intent"; it is Google having nothing better to show. Two
different products can never be one page. **The ≥5 rule is hereby scoped to
non-product terms**, and that scoping is recorded rather than quietly applied.

### Review candidates, by brand cluster

**Husqvarna — ≈16,000/mo, KD 0–7. The single biggest gettable opportunity in
the whole category.**

| Term | Vol/mo | KD |
|---|---|---|
| husqvarna automower | 14,800 | **7** |
| robot lawn mower husqvarna *(discovered, not seeded)* | 14,800 | **0** |
| husqvarna automower 115h | 590 | 0 |
| husqvarna automower 430x | 260 | 0 |
| husqvarna automower 415x | 170 | 0 |
| husqvarna automower review | 140 | 0 |

14,800/mo at KD 0–7 is easier than anything in the pool catalogue and carries
more traffic than the entire window category. Three reviews: **430X, 415X,
115H.**

**The top-up run (§9a) confirms both halves of this.** `husqvarna automower`
↔ `husqvarna automower review` share **5/10**, so one review page owns the
whole 14,800 rather than the 140 the review term suggested — the largest
single keyword any planned BotPlanet page would carry. And Amazon ranks the
**430X** at position 6 on that SERP, which settles the availability question
for the flagship. **Build the 430X first.**

**Segway Navimow — ≈6,200/mo**

| Term | Vol/mo | KD |
|---|---|---|
| segway navimow | 4,400 | 39 |
| segway navimow i110n | 480 | 12 |
| segway navimow x430 | 480 | **0** |
| segway navimow i105n | 320 | 8 |
| navimow review | 210 | 3 |
| segway navimow x330 | 170 | 0 |
| segway navimow review | 170 | 4 |
| segway navimow problems | 10 | — |

Four reviews: **i110N, i105N, X330, X430.**

**Mammotion — ≈5,410/mo, and almost all of it at KD 0**

| Term | Vol/mo | KD |
|---|---|---|
| mammotion luba 2 | 2,900 | **0** |
| mammotion luba 3 | 1,600 | **0** |
| mammotion yuka | 720 | 9 |
| mammotion review | 90 | 0 |
| mammotion luba awd | 70 | 0 |
| mammotion luba review | 30 | 0 |

2,900/mo at KD 0 is the best volume-to-difficulty ratio in the category.
Three reviews: **LUBA 2 AWD, LUBA 3, YUKA.**

**Worx — ≈1,670/mo** · worx landroid 1,300 KD 0 · landroid vision 260 KD 0 ·
worx landroid review 110 KD 0. One or two reviews: **Landroid Vision** (+ a
wired Landroid if we want the boundary-wire budget answer).

**Eufy — ≈1,560/mo** · eufy e18 590 KD 0 · eufy e15 480 KD 0 · eufy robot
lawn mower 480 KD 6 (distinct SERP) · eufy robot mower review 10. Two
reviews: **E15, E18.**

**ECOVACS GOAT — ≈360/mo** · goat o1000 210 KD 7 · goat a2000 110 KD 2 ·
ecovacs goat review 30 (distinct SERP). Two reviews: **O1000, A2000.**

**EcoFlow — 320/mo** · ecoflow blade 320 KD 0. One review: **Blade.**

**Greenworks — 260/mo** · greenworks robot mower 260 KD 0. One review:
**Optimow.**

### Proposed: 17 reviews across 8 brands

Ordered by cluster volume: Husqvarna 430X · Mammotion LUBA 2 AWD · Mammotion
LUBA 3 · Segway Navimow i110N · Worx Landroid Vision · Mammotion YUKA · Eufy
E18 · Husqvarna Automower 115H · Segway Navimow X430 · Eufy E15 · Segway
Navimow i105N · EcoFlow Blade · Greenworks Optimow · Husqvarna Automower 415X
· ECOVACS GOAT O1000 · Segway Navimow X330 · ECOVACS GOAT A2000.

**Eight brands against window's five and pool's seven.** This category has
the most even brand spread of the three — no single manufacturer dominates
the way ECOVACS does window — which is good for BotMatch and good for not
reading as one brand's catalogue.

**Nothing here is confirmed until Stage 4.** Every one of the 17 needs a live
Amazon US ASIN before it becomes a page. Husqvarna in particular sells heavily
through dealers and Lowe's rather than Amazon, so the biggest cluster is also
the one most at risk of having no buy button — same failure that killed the
HOBOT S7 Pro in the window build.

---

## 4. TIER 3 — Buying guide keywords

Seven guides. Each one is checked against the hub and against the others.

### G1 — Wire-free navigation: RTK, GPS and LiDAR vs boundary wire
**`/guides/wire-free-robot-lawn-mower/`**

| Term | Vol/mo | KD |
|---|---|---|
| wire free robot lawn mower | 720 | **0** |
| gps robot lawn mower | 590 | 48 |
| robot lawn mower without perimeter wire | 210 | **0** |
| lidar robot lawn mower | 90 | 0 |
| robot lawn mower without boundary wire | 20 | 0 |
| rtk robot lawn mower | 20 | — *(distinct SERP)* |
| no perimeter wire robot mower | 10 | 10 |
| vision robot lawn mower | 10 | — |
| **Combined** | **≈1,670** | **0–48** |

**The strongest guide in the set.** Safe: `robot lawn mower without boundary
wire` ↔ hub is 2/10, `rtk robot lawn mower` ↔ hub is 1/10. This is also the
single decision that separates a $600 mower from a $2,000 one, so it feeds
every review and drives BotMatch.

*(One oddity for the record: `robot lawn mower without boundary wire` ↔ `are
robot lawn mowers safe for pets` came back 5/10, shared on facebook, reddit
and three manufacturer domains. Two unrelated questions both landing on forum
threads is noise, not shared intent. No merge.)*

### ~~G2 — What size yard~~ — **KILLED by the top-up run. This is a hub section.**

| Term | Vol/mo | KD |
|---|---|---|
| best robot lawn mower for 1 acre | 880 | **4** |
| robot lawn mower 1 acre *(discovered)* | 720 | 8 |
| robot lawn mower for 2 acres *(discovered)* | 210 | **2** |
| robot lawn mower for 1 acre | 170 | 11 |
| best robot lawn mower for small yard | 70 | 20 |
| best robot lawn mower for half acre | 10 | — |
| **Combined** | **≈2,060** | **2–20** |

This was proposed as the highest-volume guide in the tier. The follow-up SERP
run (§9) says it cannot be one: **`best robot lawn mower for 1 acre` shares
6/10 domains with `best robot lawn mower`** — amazon, cnet, homedepot,
reddit, youtube, zdnet. It is 5/10 with `robot lawn mower comparison` too.

Google is serving the same result set. An acreage guide would have competed
with our own category page for it, which is precisely the failure the
threshold exists to catch.

**The ≈2,060/mo goes to the category page as a yard-size section** — which is
where it belongs anyway, since acreage is the first question BotMatch asks.

*(The original draft of this section flagged the acreage terms as untested and
priced the answer at $0.004. That call was worth making.)*

### G3 — Budget robot mowers
**`/guides/cheap-robot-lawn-mower/`**

| Term | Vol/mo | KD |
|---|---|---|
| cheap robot lawn mower | 390 | 11 |
| best budget robot lawn mower | 110 | **2** |
| robot lawn mower under 1000 / under 2000 | 0 | — |
| **Combined** | **≈500** | **2–11** |

`best budget robot lawn mower` came back a **fully distinct SERP** — no
overlap flag with anything. Confirmed independently: 1/10 with the hub, 4/10
with `best robot lawn mower`. Both under threshold. Safe.

**But it is the closest call in the set, and worth saying so.** The top-up run
found budget shares **6/10** with `best robot lawn mower for 1 acre` — the
term that just got killed for being 6/10 with the hub. Chained overlap is not
the test and the direct measurement is 4/10, so budget keeps its page. If it
underperforms, this is the first guide to fold in.

*Not included:* `robot lawn mower price` (1,900/mo) is **KD 48** — the hardest
term in the entire category outside the head cluster, and worth less than the
acreage guide. The hub absorbs it.

### G4 — Slopes and hills — **ONE page, and this is the important ruling**
**`/guides/robot-lawn-mower-for-hills/`**

| Term | Vol/mo | KD |
|---|---|---|
| best robot lawn mower for hills | 90 | **0** |
| robot lawn mower for hills | 70 | 0 |
| do robot lawn mowers work on hills | 40 | 0 |
| robot lawn mower slope limit | 0 | — |
| what slope can a robot mower handle | 0 | — |
| **Combined** | **≈200** | **0** |

**`best robot lawn mower for hills` ↔ `do robot lawn mowers work on hills`
share 7/10 domains** — eu.mammotion.com, sunseekertech.com, ecovacs.com,
facebook.com, lymow.com, reddit.com.

That is the clearest cannibalisation signal in the whole run. The obvious
plan — a "best for hills" product guide *and* a "do they work on hills"
explainer — would have been two pages fighting for one result set. **They are
one page**, which answers the question and then names the machines that do it.

It is also **3/10 against `best robot lawn mower`** and **0/10 against the
hub**, so it is genuinely independent of everything else. Low volume, zero
difficulty, and five separate People-Also-Ask appearances behind it.

### G5 — The disadvantages: what robot mowers are bad at
**`/guides/robot-lawn-mower-disadvantages/`**

No head-term volume. Built entirely on Google's own People Also Ask, where it
is **the loudest question in the category**:

| Question | Appearances across 22 SERPs |
|---|---|
| What are the negatives of robotic lawn mowers? | **6** |
| What are the disadvantages of a robotic mower? | **5** |
| What is the disadvantage of a robotic lawn mower? | **2** |
| **Combined** | **13** |

Nothing else in the run comes close. Google is surfacing this question on
more than half of every SERP we pulled, including the commercial ones.

**Critical framing constraint:** this guide must **not** be titled or framed
as "are robot lawn mowers worth it". That term shares **5/10** with both head
phrasings and belongs to the hub (§2d). The guide answers *what goes wrong*
— cut quality on long grass, edges, wet weather, theft, dog mess, winter
storage — and links to the hub for the verdict. Get that wrong and we build
our own competitor.

Absorbs the no-volume terms with genuine reader need: pets, children, rain,
wet grass, theft (`do robot lawn mowers get stolen` 20/mo), noise, long
grass, edges, and the PAA "How do robot lawn mowers deal with dog poo?" (×2).

### G6 — How long they last, and what they cost to keep
**`/guides/robot-lawn-mower-lifespan-maintenance/`**

| Term | Vol/mo | KD |
|---|---|---|
| robot lawn mower maintenance | 50 | **0** |
| how long do robot lawn mowers last | 40 | 0 |
| robot lawn mower blade replacement | 0 | — |
| robot lawn mower winter storage | 10 | — |
| **Combined** | **≈100** | **0** |

Plus **6 PAA appearances** across four phrasings of the lifespan question.
Low volume, but on a $2,000 purchase "how long will it last" is a decision
blocker, and it is the natural home for blade and battery replacement costs.

### G7 — Head to head: Navimow vs LUBA vs Automower
**`/guides/navimow-vs-luba-vs-automower/`**

| Term | Vol/mo | KD | CPC |
|---|---|---|---|
| navimow vs luba | 30 | **0** | **$8.63** |
| mammotion vs segway | 20 | — | **$17.27** |
| husqvarna vs navimow | 10 | — | — |
| **Combined** | **60** | **0** | — |

Tiny volume — and **CPC $17.27**, the highest figure anywhere in this
research and ten times the head term's $1.63. `navimow vs luba` also returned
a **fully distinct SERP**. Someone comparing these two machines is minutes
from a $2,000 purchase, and advertisers know it.

**The weakest case of the seven on volume, the strongest on intent.** Cheap to
build once the three brand reviews exist, since it is largely a synthesis of
them. Build it last.

---

## 5. Explicitly refused, with the evidence

| Refused | Why |
|---|---|
| A separate best-of page | Owner ruling, one URL per category. **Noting honestly that the SERP data does not support the merge here — 2/10, unlike window's 6/10.** |
| `robot lawn mower price` (1,900/mo) | KD 48. Hardest non-head term in the set; hub absorbs it |
| `robot lawn mower amazon` (390/mo, KD 6) | A page named after a retailer is thin. Same call as window |
| `robot lawn mower reddit` (320/mo) | Cannot be targeted by a site that is not Reddit |
| `best robot lawn mower for large yard` | **7/10** with `robot lawn mower comparison` → hub section |
| `how do robot lawn mowers work` (210/mo) | **5/10** with both head phrasings → hub section |
| `are robot lawn mowers worth it` (210/mo) | **5/10** with both head phrasings → hub section |
| `which robot lawn mower should i buy` | 6/10 with comparison, 6/10 with best → hub section |
| `robot lawn mower comparison` (90/mo, KD 17) | 7/10 with large-yard, 6/10 with best and with which-should-i-buy → hub section. The `/compare/` tool page stays; it is a tool, not a keyword target |
| A separate "do they work on hills" explainer | **7/10** with `best robot lawn mower for hills` → merged into G4 |
| A separate acreage / yard-size guide (≈2,060/mo) | **6/10** with `best robot lawn mower` → hub section. See §9b |
| `robot lawn mower vs regular mower` | 0/mo. Distinct SERP, no demand. A hub section at most |
| `are robot lawn mowers safe for pets` / `for children` | 0/mo either. Section inside G5 |
| `robot lawn mower theft protection` | 0/mo. Section inside G5 |
| `robot lawn mower for st augustine grass` (30) / `bermuda grass` (0) | Too thin to hold a page; a line in G2 |
| `smart lawn mower` (880) / `self driving lawn mower` (1,600) / `gps robot lawn mower` (590) as targets | All KD 48. Named in body copy, never as a page's primary |

---

## 6. Proposed page count

| Tier | Pages |
|---|---|
| Category page | 1 |
| Product reviews | 17 |
| Buying guides | 6 *(was 7 — acreage folded into the hub)* |
| **Total to build** | **24** |

`/compare/robotic-lawn-mowers/` and `/botmatch/robotic-lawn-mowers/` are not
counted. They already exist for every category in the route registry and come
into being the moment the category goes live — no build work, no keywords of
their own.

The weight is all in reviews, which is deliberate — Danny's instruction of
5 August: *"Add as many diverse products as possible - so our bot selector has
plenty of options."*

**Artwork required:** 17 reviews × 4 images = 68, plus 2 for the category page
and 1 per guide = **76 images.** The largest single artwork ask so far, and
worth knowing before we start rather than halfway through.

---

## 7. What BotMatch has to ask in this category

The research says the deciding questions are, in order of how much they
narrow the field:

1. **How big is the lawn** — acreage is the hardest constraint and the terms
   confirm buyers lead with it (≈2,060/mo)
2. **How steep is the steepest part** — a 45% slope eliminates most of the
   catalogue
3. **Wire or wire-free** — the ≈1,670/mo question, and the price cliff
4. **Is there tree cover** — RTK needs satellite view; LiDAR and vision do not
5. **Multiple separate zones**
6. **Budget band** — $500 to $3,000+ is a wider spread than pool or window

Note that #4 has almost no search volume but is the question that most often
makes an RTK mower the wrong answer. BotMatch asks what decides the purchase,
not what gets searched.

---

## 8. Data gaps

Two of the three below were closed by the top-up run in §9. What remains:

- **Amazon US availability is unverified for 16 of the 17 products.** The
  Husqvarna Automower 430X is now confirmed — Amazon ranks #6 for `husqvarna
  automower` with that exact model. The rest are Stage 4.

---

## 10. Artwork the category page is waiting on

The page is live and complete without these — the hero renders text-only and
every card slot is optional, by design. But it is the only live category page
with no photography, and it looks it.

**Two masters, in priority order:**

| # | File | Size | What it is |
|---|---|---|---|
| 1 | `/media/lawn/hero-desktop.webp` | ~1670 × 940 (16:9) | A robot mower working a lawn at dusk, house lit behind. Same treatment as the pool and window heroes — cinematic, BotPlanet branding in-image if wanted, no product logos we cannot verify. |
| 2 | `/media/lawn/hero-mobile.webp` | 4:5 portrait, ~1120 × 1400 | The mobile crop. **Author it as its own 4:5 composition, not a crop of the desktop file** — the window hero was cropped and lost its headline. `mobileAspect` in `category-hero.ts` takes whatever ratio the master actually is. |

**Six optional section images**, same shape as pool and window (3 decision
cards at ~1586 × 992, 3 matrix rows at ~1586 × 992):

- `glass-type` equivalent → `/media/lawn/yard-small.webp`, `yard-medium.webp`, `yard-large.webp` — a courtyard lawn, a typical back yard, an acre of open ground
- `soil` equivalent → `/media/lawn/cut-everyday.webp`, `cut-long-grass.webp`, `cut-edges.webp` — an evenly kept lawn, grass that has got away, a mower's margin at a wall

Add each new file to the `SOURCES` array in `scripts/gen-derivatives.mjs` and
run it. Never upscale — the script refuses widths above the source, and a
1586-wide master is correct at 1586.

---

## 9. Top-up SERP run — 2026-08-06, $0.008

Run 31074893036, two live SERPs, no volume or difficulty re-bought (see the
`serpOnly` mode added to `scripts/seo-research.mjs`). Both questions came from
this document's own gap list and both answers changed the plan.

### 9a. `husqvarna automower` — the brand term belongs to a review, not a hub

| Pos | Domain | Result |
|---|---|---|
| 1 | husqvarna.com | Robot Lawn Mowers \| Husqvarna US |
| 2 | roboticmowerservices.com | Automower & Sunseeker model list |
| 4 | reddit.com | "How good are the new Husqvarna automowers…" |
| **6** | **amazon.com** | **Husqvarna Automower 430X Robotic Lawn Mower** |
| 10 | medium.com | An Honest Review of the Husqvarna AutoMower |
| 13 | husqvarna.com | Parts and support, Automower 550 |
| 14 | toolsinaction.com | Automower 430XH Review — "why I wouldn't…" |
| 15, 16 | youtube.com | Automower channel + "3 years with Husqvarna Automower" |

**Three findings:**

1. **`husqvarna automower` ↔ `husqvarna automower review` = 5/10.** One page,
   not two. A single Husqvarna Automower review can carry **14,800/mo**, not
   the 140/mo I costed it at. That is the largest single keyword any planned
   BotPlanet page would own.
2. **It does not touch the category page.** No overlap flag against either
   head phrasing. The Husqvarna review is structurally safe.
3. **The 430X is on Amazon US** — Amazon ranks #6 with that exact model.
   The availability risk flagged in §3 is answered for the flagship. That
   makes the 430X the review to build first.

Note what is winnable here: medium.com, toolsinaction.com and a Reddit thread
all rank in the top 16. **Two of the top results are complaints** — "why I
wouldn't recommend", "Red flags & Frustration: 3 years with". A review that
takes the negatives seriously fits this SERP; a puff piece does not.

PAA on this SERP: life expectancy, "Is a Husqvarna Automower good?", cost, and
**"What are the disadvantages of a robotic mower?"** — the disadvantages
question appearing yet again, now on a brand SERP.

### 9b. `best robot lawn mower for 1 acre` — the acreage guide is dead

| Compared with | Shared |
|---|---|
| **best robot lawn mower** | **6/10** — amazon, cnet, homedepot, reddit, youtube, zdnet |
| best budget robot lawn mower | 6/10 |
| robot lawn mower comparison | 5/10 |
| which robot lawn mower should i buy | 4/10 |
| best robot lawn mower for hills | 4/10 |

Over the threshold against the hub's own "best" cluster. **The ≈2,060/mo
acreage terms become a category-page section** (§G2), not a guide.

This is the top-up earning its $0.004: without it we would have built a
2,060/mo guide that competed with our own category page and lost.

The SERP also carries an **AI overview**, `discussions_and_forums` and
`perspectives` — three features the other lawn SERPs did not show. Two
Facebook threads rank in the top 18. Google is treating acreage as a question
people argue about rather than one a buying guide settles, which is a second,
independent reason not to give it a commercial page.

---

## Stage 4 amendment — 7 August 2026: 17 reviews cut to 10

**The proposed 17 had the same fault the window category shipped with, and it
was caught before anything was built rather than after.**

Six of the seventeen were near-identical siblings inside one range, separated
by mowing area and nothing else:

| Pair | What actually differs |
|---|---|
| Husqvarna Automower 430X / 415X | area |
| Segway Navimow i110N / i105N | area |
| Segway Navimow X430 / X330 | area |
| Eufy E18 / E15 | area |
| ECOVACS GOAT O1000 / A2000 | area |
| Mammotion LUBA 2 AWD / LUBA 3 | consecutive generations |

Four Navimow pages and three Automower pages is a manufacturer's catalogue,
not a comparison site. It is also the exact failure the window build made — six
WINBOTs where the plan allowed three — which cost a merge, three redirects and
a wasted set of artwork on 7 August. The owner's instruction is explicit: no
duplicates, no different versions of the same thing.

### The ruling: one machine per PROPOSITION, not per model number

Selection is by what the hub itself says decides this category — boundary wire
versus wire-free, then navigation type, then area — rather than by SKU.

| # | Product | Vol/mo | The proposition it answers |
|---|---|---|---|
| 1 | Husqvarna Automower 430X | 14,800 | Wire · large yard · premium |
| 2 | Mammotion LUBA 2 AWD | ~4,500 | Wire-free RTK · AWD · steep slopes |
| 3 | Mammotion YUKA | 720 | Wire-free RTK · collects clippings |
| 4 | Husqvarna Automower 115H | 590 | Wire · small yard · budget |
| 5 | Eufy E18 | 590 | Wire-free · mid yard · cheapest wire-free |
| 6 | Segway Navimow i110N | 480 | Wire-free RTK · quarter acre |
| 7 | Segway Navimow X430 | 480 | Wire-free RTK **+ vision** · 1.2 acre |
| 8 | Worx Landroid Vision | 260 | **Camera only** — no RTK, no wire |
| 9 | Greenworks Optimow | 260 | Wire · mid yard · second wired brand |
| 10 | ECOVACS GOAT O1000 | 210 | **LiDAR + vision** — the only one |

**Ten reviews, seven brands, maximum two per brand** (was four). Navigation
spread: 3 wired, 4 RTK, 1 RTK+vision, 1 camera-only, 1 LiDAR — every branch of
the hub's own decision tree has exactly one machine behind it, which is also
what BotMatch needs to score against.

**LUBA 3 is folded into the LUBA 2 review** rather than dropped, the way the
W3 Omni folded into the W2 PRO Omni. It is 1,600/mo and a real question — is
the newer generation worth it — but it is a section, not a page. The combined
figure above reflects both.

**EcoFlow Blade (320) is dropped, not merged.** Its differentiator is a lawn
sweeper, which the YUKA already answers at more than twice the volume. Two
pages for one proposition is the thing this amendment exists to prevent.

**Any of the six can return** if a measured SERP shows its own result set. The
cut is on duplication, not on quality, and nothing here says these are bad
machines.

### Still blocking: none of the ten is confirmed buyable

Stage 4 requires a live Amazon US ASIN per product before any becomes a page.
Automated discovery on 7 August was rate-limited by Amazon after roughly twenty
searches — it answered with a 2.3 KB page carrying no results, which the first
run wrongly reported as "no listings" for all seventeen. `scripts/amazon-
discover.mjs` now retries and treats a short body as a throttle rather than an
empty shelf. **Husqvarna remains the known risk**: it sells heavily through
dealers and Lowe's, and it carries the largest cluster in the category.

### Stage 4 discovery run, 7 August 2026 — candidates only, none verified

Twelve of seventeen returned a candidate ASIN. **Reading the titles shows at
least four are the wrong machine**, which is the entire reason discovery and
identity are separate steps on this site.

| Product | ASIN | Listing says | Read |
|---|---|---|---|
| Husqvarna Automower 430X | B09WNF4V5G | "Automower 430X … GPS Assisted Navigation" | **plausible** |
| Mammotion LUBA 2 AWD | B0DWRKVXD7 | "LUBA 2 AWD 5000HX … 1.25 Acres" | plausible, but 5000HX is one of three capacity variants |
| Mammotion LUBA 3 | B0GKNQKJJQ | "LUBA 3 AWD 3000H, 0.75 Acre" | plausible |
| Segway Navimow i110N | B0CX7T6BR3 | "Navimow i110N … 1/4 Acre RTK+Vision" | **plausible** |
| Segway Navimow X430 | B0G8Y8CNH7 | "Navimow X430 … 1 Acre, 4WD, 84% Slopes" | **plausible** |
| Worx Landroid Vision | B0GN8KK8XW | "… WR320 \| Landroid Vision Cloud" | plausible — WR320 is the Vision's SKU |
| ECOVACS GOAT O1000 | B0GJ4F8MLF | "Goat O1000 **LiDAR PRO**" | variant, not the base O1000 |
| ECOVACS GOAT A2000 | B0GGZQTY2N | "Goat A2000 **LiDAR PRO**" | variant |
| Eufy E15 | B0DRVYDXWX | "Robot Lawn Mower E15 … Pure Vision" | plausible |
| **Mammotion YUKA** | B0DT39TB3R | "**YUKA mini 2** 1000H" | **WRONG — sibling model** |
| **Segway Navimow i105N** | B0G814F6Z4 | "Navimow **i206 AWD** … New i105N" | **WRONG — i206 listing** |
| **EcoFlow Blade** | B0DTVF4QGY | "**Husqvarna Automower 420iQ**" | **WRONG — different manufacturer** |

**The EcoFlow Blade result is the instructive one.** The matcher required the
token `blade`, which appears in almost every mower listing as a component. A
generic word is not a model identifier, and the match returned a Husqvarna.
Any target whose model name is an ordinary noun needs a brand token too.

Five returned no match at all: **Eufy E18, Husqvarna Automower 115H,
Greenworks Optimow, Husqvarna Automower 415X, Segway Navimow X330.** Four of
those five searches returned an ECOVACS Goat listing as the top result, which
is Amazon answering a query it has no good match for — not evidence the
product is unavailable. It needs a hand check before anything is concluded.

**Effect on the ten-product plan: three of the ten have no usable candidate**
(YUKA wrong, 115H unmatched, Optimow unmatched) and one more (E18) unmatched
with its sibling E15 found instead. Nothing is dropped on this evidence — a
failed automated search is not a finding — but no lawn product may become a
page until its ASIN is machine-read and its identity confirmed, exactly as the
eleven window products were on 6 August.
