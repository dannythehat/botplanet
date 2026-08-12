# Companion products — keyword harvest, 8 August 2026

Six products, all with a confirmed Amazon US listing. Google Suggest and
Amazon Suggest, alphabet-soup expanded: 15 seeds, 735 queries per engine,
**4,302 distinct terms, 257 completed by both engines.** Nothing halted; the
run covered every query it planned.

**There are no search volumes here and none should be inferred.** Suggest rank
is ordinal — `a1 g1` means both engines put the term first for some prefix, not
that anyone measured it. Every term below enters the page plan as
`volume: null` until a paid run measures it. The rank columns are `a` for
Amazon, `g` for Google, lower is better, `—` means that engine never offered it.

Raw output: `companion-harvest.json` (not committed — 4,302 rows, regenerate
with `node scripts/free-keyword-harvest.mjs`).

---

> **SUPERSEDED IN PART, 8 August 2026.** The paid run
> (`companion-products-research-findings.md`) measured these terms hours later.
> Where the two disagree, the measured file wins. The subscription section
> immediately below is the main casualty: those terms total about 150 searches
> a month, so they are a paragraph on each review rather than the guide page
> claimed here. Everything about term *shape* — colours, accessories, doubts,
> comparisons — held up.

## The finding that changes the plan: subscription fear

Twenty-plus terms, across every product that has one, and Google ranks most of
them first:

| Term | a | g |
|---|---|---|
| does loona robot require a subscription | — | 1 |
| does miko 3 require a subscription | — | 1 |
| does miko robot require a subscription | — | 1 |
| does vector robot need a subscription | — | 2 |
| vector robot cloud subscription | 1 | — |
| vector robot subscription free | — | 3 |
| anki vector lifetime subscription | — | 2 |
| anki vector without subscription | — | 3 |
| vector robot subscription cost | — | 2 |
| miko 3 subscription cost | — | 2 |
| eilik robot subscription | — | 1 |
| pet camera robot no subscription | 1 | — |

Note `eilik robot subscription`: Eilik does not have one. People are asking
anyway, which is what a category-wide anxiety looks like — the question is
asked of every product regardless of whether it applies.

**This wants its own guide page.** No page in the plan answers "which companion
robots charge you monthly, and what stops working if you don't pay". It is a
buying blocker, it is asked of six different products, and answering it once
and linking to it from every review is worth more than a paragraph repeated six
times. `pet camera robot no subscription` shows the same intent reaching the
pet-camera category, so the guide serves both.

---

## Per product

### Vector 2.0 — the review is about the servers

The hypothesis in the seed file was that Vector's service history carries its
own demand. It does, and it is not close:

| Term | a | g |
|---|---|---|
| is vector robot still supported | — | 1 |
| does vector robot still work | — | 1 |
| are vector robots still being made | — | 1 |
| why was vector robot discontinued | — | 1 |
| vector robot discontinued | — | 1 |
| vector robot problems | — | 1 |
| is anki vector still supported | — | 1 |
| does anki vector still work | — | 1 |
| vector robot alternative | — | 1 |
| vector robot vs cozmo | — | 1 |

Ten first-position terms and every one of them is a doubt. A review that opens
with features and mentions Digital Dream Labs in paragraph nine is answering a
question nobody asked.

`vector robot vs cozmo` ranks first and **Cozmo is not buyable** — its only
Amazon listing is a $19 battery. That comparison is a section of the Vector
review, not a page, and it is the section where Vector wins by default.

Commerce and accessory tail, all both-engine: `vector robot accessories` (a1
g1), `vector robot charger` (a3 g1), `vector robot battery replacement` (a2
g1), `vector robot cube`, `vector robot kit`, `vector robot used` (a1 g1).
Secondhand intent is real for a brand that was liquidated.

### Eilik — colours and outfits, not specifications

Sixty-three both-engine terms, the most of any product, and the shape is
unexpected:

`eilik robot gold` (a1 g1), `blue` (a1 g1), `silver` (a1 g1), `yellow` (a1 g1),
`pink` (a1 g2), `orange` (a2 g2), `green` (a4 g8) · `eilik robot clothes` (a1
g1), `eilik robot outfits` (a1 g1) · `eilik robot accessories` (a1 g1) ·
`eilik ai station` (a1 g1), `eilik robot tank` (a1 g2), `eilik robot on the go`
(a3 g5) · `eilik robot mini` (a1 g1), `eilik robot dq` (a1 g1)

**The review needs a variants and accessories section**, and it needs to name
the colours. No head-term volume would ever have shown this. `eilik robot dq`
appearing at a1 g1 is a product line I had not heard of and must identify
before writing.

Doubt tail: `why is eilik robot so expensive` (g1), `are eilik robots worth
it` (g1), `is eilik robot good for kids` (g1), `does eilik robot talk` (g1),
`eilik robot vs emo` (g1), `eilik robot review reddit` (g2).

### Loona — accessories dominate, and one term is a warning

`loona robot accessories` (a1 g1), `loona robot clothes` (a1 g7), `loona robot
ball` (a2 g1), `loona robot wheel covers` (a1 g4), `loona robot screen
protector` (a1 g10), `loona petbot premium` (a1 g1), `loona robot used` (a1 g5).

Amazon completes the accessories at position 1 and the robot itself is harder
to find — which is exactly why the first discovery pass returned a toy ball as
the Loona candidate. The accessory market is bigger on Amazon than the machine.

Doubt tail: `is loona robot worth it` (g1), `why is loona robot so expensive`
(g1), `does loona robot require a subscription` (g1), `is loona robot
discontinued` (g1), `loona robot problems` (g1), `loona robot honest review`
(g1), `loona robot vs emo` (g1), `loona robot cheapest price` (g1).

`loona robot honest review` at position 1 is a reader telling you the existing
results are not trusted.

### Joy For All — do not use "robotic cat"

The seed `robotic cat` is unusable and the harvest is unambiguous about why:

| Term | g | Whose query is this |
|---|---|---|
| is robotic cataract surgery better | 1 | eye surgery |
| what is robotic cataract surgery | 2 | eye surgery |
| does medicare cover robotic cataract surgery | 5 | eye surgery |
| how much does robotic cataract surgery cost | 6 | eye surgery |
| robotic cat litter box | a1 g1 | litter boxes |
| best robotic cat litter box | a1 g1 | litter boxes |
| robotic cat litter | a8 g2 | litter boxes |

Two separate families swamp it: cataract surgery, and litter boxes — and the
litter-box half is **BotPlanet's own self-cleaning litter box category**.
Targeting `robotic cat` anywhere in companion robots would cannibalise a
category we already own with a term that mostly means eye surgery.

What is usable is the branded and care language: `joy for all companion pet
cat` (a1 g1), `dog` (a1 g1), `pup` (a1 g1), `golden pup` (a1 g1), `cat orange
tabby` (a1 g3), `joy for all companion pet for seniors` (a1 g2), `robotic cat
for seniors` (a5 g1), `robotic cat companion` (a1 g3), `robotic cat with fur`
(a1 g3), `robotic cat realistic` (a2 g1), `what is robotic pet therapy` (g2).

Only 15 question terms survive the pollution, against 160 for Vector. This
review is a shorter page than the others and should be, with the elderly-care
demand routed to the seniors guide that already exists.

### Moflin — "is it real"

`is moflin real` (g1), `is casio moflin real` (g1), `why is moflin so
expensive` (g1), `does moflin walk` (g1), `can moflin walk` (g1), `does moflin
talk` (g2), `can moflin move` (g2), `what does moflin do` (g2).

A $429 pet that does not walk or talk reads as a hoax to people who have only
seen a photograph. The review's job is to establish that it exists, what it
actually does, and why it costs that.

Competitors named by the searches: `moflin vs aibo` (g1) — aibo is not
buyable — and `moflin vs ropet` (g2). **Ropet is not in the plan and not in
the buyability pass.** It should be checked.

`moflin accessories` (a1 g1) and `moflin bag` (a1 g2) are both-engine.

### Miko 3 — it belongs in companion robots

The seed file asked whether Miko pulls a kids-and-parenting SERP that shares
nothing with this category. The comparison terms answer it:

`miko robot vs moxie` (g1) · `miko 3 vs eilik` (g2) · `eilik robot vs miko
robot` (g2) · `miko 3 vs miko mini` (g1)

Buyers compare Miko against Eilik and Moxie, which are companion robots, not
against tablets or toys. It stays. The internal split to watch is `miko 3 vs
miko mini` (g1) and `miko max` — a three-model range, so the review must place
the 3 within it rather than review it alone.

Doubt tail: `is miko robot safe` (g1) — a parent question no other product in
this set attracts — plus `miko 3 problems` (g1), `is miko 3 worth buying` (g1),
`can miko 3 follow you` (g1), `can miko robot play hide and seek` (g1).

---

## Category level

`robot pet for elderly` (a7 g1), `robot pet that follows you` (a1 g6),
`companion robot for adults` (a1 g1), `best companion robot for adults` (g2),
`robot pet pocket` (a1 g6), `desktop robot buddy` (a1 g1), `cheap robot pet`
(a1 g1), `cheap desktop robot` / `desktop robot cheap` (a1 g4).

Existence questions are still position 1 for the whole category: `do robot pets
exist`, `are companion robots real`, `do companion robots exist`, `can you buy
a companion robot`, `how much are companion robots`. This category is early
enough that people do not yet believe it is real, which is a different job from
ranking a comparison.

`robot pet emo` (a1 g1) and `is emo pet robot worth it` (g2): **EMO is the
comparison anchor for the entire desktop segment** — it appears in `eilik robot
vs emo` and `loona robot vs emo`, both at g1 — and it has no Amazon US listing.
That is an argument for an EMO page that ranks and routes internally, not for
dropping it.

---

## Excluded

International price terms harvested in volume and are noise for a US-first
site: `eilik robot price in india`, `eilik robot qatar price`, `casio moflin
japan price`, `moflin price uk`, `robotic cat price in india`. Named here so
the next person does not re-harvest them and think they found something.

## What still needs the paid run

Volumes, difficulty, and the SERP overlap rulings. Suggest data can tell you
what people ask and roughly in what order; it cannot tell you whether
`companion robot subscription` and `does miko 3 require a subscription` share
enough SERP domains to be one page. The one-URL-per-category rule needs domain
overlap, and that is measured, not harvested.
