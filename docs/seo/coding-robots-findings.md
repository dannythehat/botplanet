# Coding robots — buyability and brand terms, 8 August 2026

Two checks on a plan that carries twelve reviews and had never been tested
against a shop. Brand run: `seeds/coding-robots-brands.json`, 6 SERPs,
**$0.1662**.

---

## The brand terms are huge and none of them is ours

| Term | Vol | KD |
|---|---|---|
| vex robotics | 33,100 | **62** |
| sphero | 27,100 | 26 |
| ozobot | 14,800 | 36 |
| makeblock | 3,600 | 17 |
| sphero robot | 2,400 | 20 |
| wonder workshop | 1,900 | 38 |
| vex go | 2,900 | 8 |
| coding robot | 1,300 | 21 |

The plan has **six Sphero products and no `sphero` term**, which after the
Enabot finding looked like the same missing page: a brand with a category
attached, 27,100/mo sitting unclaimed.

**It is not the same, and the SERPs say so plainly.**

### `sphero` — a navigational SERP

1 sphero.com (PK-12 STEM Education) · 2 YouTube · 5 Google Play, Sphero Edu
app · 6 **Wikipedia** · 7 Amazon · 8 Apple App Store · 9 Instagram

People searching "sphero" want the company, the app or the encyclopedia entry.
One retail result in the top ten.

### `ozobot` — navigational plus the school channel

1 ozobot.com (Official Store, K-8 STEAM) · 4 Amazon · 6 **ozoblockly.com**, the
coding IDE · 8 X · 9 **demco.com** · 10 **teq.com** · 12 Instagram

Demco and Teq are library and classroom suppliers. This is a procurement SERP,
not a shopping one.

### Why Enabot was different

Enabot's brand SERP carried CNET, Target, Walmart and Trustpilot — publishers
and retailers, with an editorial gap where a range explainer should be. It also
measured **KD 4**.

These measure KD 26, 36 and 62, and the results are the manufacturer's own
properties, its software and its distributors. There is no editorial gap to
fill because the query is not editorial.

**Ruling: no brand page for Sphero, Ozobot, VEX or Wonder Workshop.** The
volume is real and it is not addressable by a comparison site.

`coding robot for kids` and `best coding robot for kids` share **five domains,
four of them real** — makeblock.com, sphero.com, botzeestoys.com,
stemeducationguide.com. One page, and the hub already owns that territory.

---

## Buyability: five clean, five with problems, two absent

Read listing by listing on 8 August 2026.

### Clean

| Product | ASIN | Price |
|---|---|---|
| Sphero BOLT | `B07DLM5DL7` | $179 |
| Sphero Mini | `B072B6QVVW` | $50 |
| Sphero indi | `B094X6TV5V` | $100 |
| Ozobot Evo | `B0CSR53WXV` | $175 |
| Makeblock mBot | `B00SK5RUQY` | $69 |

### Problems

**Sphero RVR — the candidate is the wrong machine.** `B0BLF8CLQF` is titled
"Sphero **RVR+**", a different and more expensive model at $339. The plan
targets `sphero rvr` at 720/mo. Either the RVR is discontinued and the term
should point at the RVR+, or the correct ASIN has not been found. Not settled.

**Bee-Bot — the candidate is a school six-pack.** `B0F6759THL` is a "Coding
Robot Class Pack — 6 Bee-Bot" at **$691**. The plan targets `bee bot` at
4,400/mo and KD 6, which is a parent buying one robot. A $691 classroom kit is
the wrong product for that reader.

**LEGO SPIKE Essential — $597 and an education SKU.** `B09LMS9YXX` serves a
different ASIN than requested. Same problem: a classroom kit against a
consumer term.

**Botley 2.0 and Code & Go Robot Mouse** both serve a different ASIN than
requested — Activity Set parent listings. Probably resolvable, not resolved.

### Absent

**Ozobot, bare.** A search returns the Evo. Consistent with `ozobot` being a
brand rather than a product, which the SERP confirms.

**VEX GO.** 2,900/mo at KD 8 — the most attractive difficulty in the category —
and no Amazon US listing. The top result is a HEXBUG toy. VEX sells GO through
the education channel, which is also what its brand SERP shows.

---

## What this means for the plan

The category was planned as twelve product reviews on the reasoning that "the
products are 4x to 14x the head term, so the reviews are the business". That
reasoning still holds. What has changed:

1. **No brand pages.** Measured and refused, with the SERPs recorded.
2. **Five products are ready to build.** Sphero BOLT, Mini and indi, Ozobot Evo,
   Makeblock mBot.
3. **Five need their ASIN settled** before anything is written: RVR, Bee-Bot,
   SPIKE Essential, Botley, Robot Mouse.
4. **Two should probably be dropped.** Bare "Ozobot" is a brand, and VEX GO has
   nothing to sell despite the best difficulty score in the category.

**This category sells to schools as much as to parents**, and that is the thread
running through every finding above — the class packs, the education SKUs, Demco
and Teq on the SERP, VEX GO's absence from Amazon. A consumer comparison site
can serve the parent buying one robot. It cannot serve the procurement query,
and several of these listings are aimed at the procurement query.

---

## Second run: are three Sphero reviews three pages or one?

`seeds/coding-robots-products.json`, 21 seeds, 4 SERPs, **$0.1596**.

The five clean products include three Spheros, and the one-URL rule had never
been tested *inside* a brand. If `sphero bolt` and `sphero mini` return the same
result set they are sections of one page, and writing three would have been the
exact mistake this process exists to catch.

### They are three pages

| Pair | Shared | After discounting amazon/youtube | Third-party editorial |
|---|---|---|---|
| sphero bolt × sphero mini | 4 | 2 (sphero.com, help.sphero.com) | **0** |
| sphero bolt × sphero indi | 3 | 1 (sphero.com) | **0** |
| sphero indi × makeblock mbot | 3 | 1 (geyerinstructional.com) | **0** |

Everything surviving the discount is either the manufacturer's own property or a
classroom supplier. Separate pages, with the evidence recorded.

### The finding that matters more

**Not one independent review site ranks in the top ten for any of the four
product terms measured.** The slots are sphero.com, edu.sphero.com,
help.sphero.com, makeblock.com, Amazon, YouTube, and school and library
suppliers — geyerinstructional, schoolspecialty, gocivilairpatrol, a Lakehead
University libguide, a Utah state `.gov`. The single real publisher anywhere is
**theisaacstandard.com at position 14** for mBot.

The brand SERPs had no editorial gap because they are navigational. The
**product SERPs are nothing but gap.** That is the reverse of the brand ruling
above, and it is why the reviews are the business in this category.

### The tail

| Term | Vol | KD | Goes to |
|---|---|---|---|
| ozobot color codes | 720 | 0 | Ozobot Evo — the codes *are* the programming method |
| mbot2 | 720 | 0 | Makeblock mBot, as the family question |
| sphero bolt plus | 480 | 10 | Sphero BOLT, carried not built — no verified ASIN |
| sphero mini golf | 390 | 0 | **Refused.** $6.17 CPC, highest measured here, and nothing in the SERP settles whether it means a Sphero kit or minigolf |
| mbot ranger | 320 | 0 | Makeblock mBot |
| scratch coding robot | 260 | 8 | Makeblock mBot — the only Scratch-native machine in the catalogue |
| screen free coding robot | 140 | 0 | Sphero indi |
| coding robot for 4 year old | **0** | — | Nowhere. The obvious phrase for an age page, and nobody searches it |

`sphero bolt` is dominated by the **BOLT+** — three sphero.com results plus a
help page titled "BOLT vs BOLT+". The review has to handle that or it does not
match intent.

---

## Built

- `/robots/educational-coding-robots/sphero-bolt/` — `sphero bolt`, 4,400/KD 32
- `/robots/educational-coding-robots/sphero-mini/` — `sphero mini`, 2,900/KD 15
- `/robots/educational-coding-robots/sphero-indi/` — `sphero indi`, 1,600/KD 1
- `/robots/educational-coding-robots/ozobot-evo/` — `ozobot evo`, 1,300/KD 5, plus `ozobot color codes` at 720
- `/robots/educational-coding-robots/makeblock-mbot/` — `makeblock mbot`, 880/KD 29, plus 1,040 on the family names

About **11,300/month** across the five and their carried terms.

---

## Seasonality: school year, not Christmas

`vex robotics` peaks in **September at 49,500** and troughs in July at 18,100.
`sphero` runs 33,100 from October to December. `ozobot` peaks November and
December at 22,200.

Back to school and Christmas both, which is unlike every other category on this
site.
