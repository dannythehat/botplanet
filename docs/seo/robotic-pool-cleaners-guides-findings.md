# Pool — second run: the guide, segment and comparison questions

**Run: local, 6 August 2026, $0.1795.** 87 seeds priced, 15 live SERPs.
Pool total spend now **$0.3949** of the $2.00 ceiling.

Run directly rather than through GitHub Actions — no hosted runner was being
assigned, and the research did not need one.

---

## The four "planned" guides are REFUSED. None of them was ever measured.

`internal-links.ts` has carried anchors for four guide URLs since the pool
build — batteries, filters, what size, warranties — declared without a single
number behind them. Here are the numbers.

| Proposed guide | Head term | Vol | Verdict |
|---|---|---|---|
| Batteries | robotic pool cleaner battery | **—** | **REFUSE** |
| | robotic pool cleaner battery replacement | — | |
| | can you replace a pool robot battery | — | |
| Filters | robotic pool cleaner filter | **—** | **REFUSE** |
| | how to clean pool robot filter | 10 | |
| | pool robot filter micron | — | |
| What size | what size robotic pool cleaner | **—** | **REFUSE** |
| | robotic pool cleaner pool size | — | |
| | robotic pool cleaner max pool size | — | |
| Warranties | robotic pool cleaner warranty | **—** | **REFUSE** |
| | how long do robotic pool cleaners last | 20 | |
| | robotic pool cleaner lifespan | — | |

**And the SERPs say the same thing louder.** Every one of these questions
returns Reddit, Facebook, troublefreepool and Quora — community threads, not
editorial. `how to clean pool robot filter` shares **6** top-ten domains with
`aiper vs dolphin` and **5** with `do pool robots clean the waterline`: Google
is serving one undifferentiated forum result set across the whole
maintenance-question space.

That is the security-robots shape. Expensive to win, worth little when won.
All four are refused and their anchors are marked accordingly.

**The one exception worth noting:** warranty demand is real but it is
BRAND-shaped, not category-shaped — `aiper warranty` 320 at KD 3,
`dolphin pool cleaner warranty` 110, `beatbot warranty` 70. Those belong in the
relevant review pages, which already carry warranty sections.

---

## CREATE — two pages the first run under-measured

### 1. Above-ground pool cleaners · 2,400/mo at KD 0

| Keyword | Vol | KD | CPC |
|---|---|---|---|
| **robotic pool cleaner for above ground pool** | **2,400** | **0** | $4.30 |
| robotic pool cleaner for small pool | 260 | 0 | $0.96 |
| robotic pool cleaner for vinyl liner | 20 | 0 | $4.78 |

The 1 August run measured above-ground at 140 and merged it into the best-of as
a section. That was the right call **on the number it had**. This phrasing was
not in that seed list, and at 2,400 with zero difficulty and a $4.30 CPC it is
the second-strongest commercial opportunity in the category after the cordless
page.

Four of the ten cleaners we hold are rated for above-ground use, so the page
can be built from the existing catalogue the day artwork exists.

### 2. Solar pool skimmers · ~11,600/mo combined

| Keyword | Vol | KD | CPC |
|---|---|---|---|
| solar pool skimmer | 6,600 | 9 | $5.31 |
| **solar powered pool skimmer** | **6,600** | **0** | $5.31 |
| robotic pool skimmer | 2,900 | 24 | $5.51 |
| automatic pool skimmer | 1,600 | 0 | $5.11 |
| best solar pool skimmer | 320 | 0 | $8.83 |
| pool surface skimmer robot | 210 | 0 | $6.09 |

Same volume, zero difficulty, on the "solar powered" phrasing — the same
easy-phrasing trick the vacuum category turned on.

Ruling 7 of the 1 August run deferred this pending catalogue depth, and that
gate has **not** moved: we hold exactly one skimmer, the Betta SE Plus. A
one-product segment page is thin whatever the volume. **BLOCKED ON A SECOND
SKIMMER, not on keywords** — and this is now the strongest keyword case in the
category that we cannot act on.

---

## The comparison hub was right, and it is bigger than it looked

| Pair | Vol | KD |
|---|---|---|
| wybot vs aiper | 170 | 0 |
| dolphin vs polaris pool cleaner | 140 | 0 |
| beatbot vs aiper | 140 | 0 |
| aiper vs dolphin | 110 | 0 |
| aiper vs dolphin pool cleaner | 40 | 0 |
| **Combined** | **~600** | **0** |

Six hundred a month at zero difficulty across five pairs, and the hub built on
6 August already carries four of them as sections. `wybot vs aiper` at 170 is
the largest single pair and is **not** yet a section — it should be.

`dolphin nautilus cc plus vs polaris freedom` still returns no measurable
volume, so the REJECT on pair pages stands unchanged.

---

## Also measured, no page

| Keyword | Vol | KD | Where it goes |
|---|---|---|---|
| types of automatic pool cleaners | 110 | 9 | Section of the worth-it guide |
| robotic pool cleaner repair | 110 | 0 | Nothing. We do not do repair content |
| robotic pool cleaner comparison | 40 | 11 | Comparison hub, already targeted |
| compare robotic pool cleaners | 40 | 4 | Same |
| how do robotic pool cleaners work | 40 | 0 | Hub section. Not a page at 40/mo |
| robotic pool cleaner troubleshooting | 20 | 0 | Nothing |
| robotic pool cleaner for saltwater pool | — | — | Nothing measurable |

---

## Two API faults worth recording

`related_keywords` rejects a batched request — "You can set only one task at a
time" — so 4 of 5 leads produced nothing and the long-tail harvest from this
run is thin. The script's fallback caps at 4 individual leads. **That is the
thing to fix before the next long-tail run**, and it is a script change rather
than a spend problem.

Two SERP calls returned `40101 Internal SE Server Error` on DataForSEO's side —
`what size robotic pool cleaner` and `how often should a robotic pool cleaner
run`. Both were charged at half rate and returned nothing. Neither changes a
ruling: both terms measured at no volume anyway.
