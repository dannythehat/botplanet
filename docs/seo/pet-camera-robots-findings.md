# Pet camera robots — measured findings, 8 August 2026

Two runs. Products: `seeds/pet-camera-robots-products.json`, 49 seeds, 10 SERPs,
**$0.2230**. Brand: `seeds/enabot-brand.json`, 5 SERPs, **$0.1356**.

---

## The plan was wrong about the products

It named three reviews on 6 August: EBO Air at 1,000/mo, EBO X at 260, EBO SE
at 260. A listing-by-listing read of Amazon US on 8 August found **neither the
Air nor the X on sale anywhere**.

What Enabot actually sells:

| Model | ASIN | Price |
|---|---|---|
| EBO SE | `B09R6V3CJM` | $119 |
| EBO ROLA Mini | `B0DDC9DZKK` | $139 |
| EBO Air 2 | `B0DZHDF7MD` | $149 |
| ROLA PetPal | `B0GMQW1HX6` | $179 |
| EBO Mini | `B0H2VYLVG7` | $199 |
| EBO Air 2S | `B0FWK8BCXD` | $299 |
| EBO Air 2 Plus | `B0FD9VNX5Y` | $359 |

Seven machines where the plan knew of three, and the two with the most planned
volume are discontinued.

**A reseller nearly got the buy button.** The discovery script proposed
`B0CGV82XTT` for the EBO SE: same product name, same $119, seller "Rocon", and
it serves an ASIN other than the one requested. Only opening every listing
individually caught it.

---

## The brand is bigger than the category

| Term | Vol | KD |
|---|---|---|
| **enabot** | **9,900** | **4** |
| enabot robot | 1,600 | 10 |
| enabot ebo | 1,000 | 10 |
| enabot pet camera | 260 | 3 |
| enabot review | 110 | 0 |
| *pet camera robot (the hub's primary)* | *480* | *9* |

About **12,900/month on brand terms against 480 on the category head term.**
This is not a category with a leading brand in it. It is a brand with a
category attached.

### The ruling

| Pair | Shared | Meaningful |
|---|---|---|
| enabot × enabot robot | 7 | one page |
| enabot × enabot ebo | 6 | one page |
| enabot × ebo air 2 | 5 | **1** |
| enabot × pet camera robot | 3 | **0** |
| enabot robot × pet camera robot | 5 | 2 |

`enabot`, `enabot robot` and `enabot ebo` are one result set. The question was
whether that set belongs to the hub or to the Air 2 review, and the answer is
neither.

**Against the hub: three shared domains, and all three are amazon.com,
instagram.com and reddit.com** — the universal ones. Discount them and the
overlap is zero. This is the same method the hub's own register already used to
split pet cameras from companion robots.

**Against the Air 2 review: five, which is the threshold** — but four of the
five are amazon, instagram, reddit and facebook. Only cnet.com is a real
publisher. Meaningful overlap of one.

So `enabot` needs **its own page**: a range page covering all seven machines,
at `/robots/pet-camera-robots/enabot/`.

### What that page has to beat

The `enabot` SERP, in order: enabot.com, Amazon, Instagram, a YouTube review of
the **Air 2 Plus**, Reddit's r/CatAdvice, Trustpilot, a YouTube review of the
**ROLA Mini**, CNET's **Air 2** review, Target, Facebook.

Every editorial slot is a review of **one model**. Nobody has written the page
that explains the range — which of the seven to buy, what the extra $240
between the SE and the Air 2 Plus actually buys, and which names mean what.
That is the gap, and it is the page.

Two features on this SERP say the reader is choosing rather than researching:
`product_considerations` and `knowledge_graph`.

---

## What was refused

**`pet camera with treat dispenser`, 720/mo.** Shares one top-ten domain with
`enabot rola petpal`, and it is amazon.com. The SERP is Furbo, Closer Pets,
Petcube, Wired and Petco — the static treat-camera market. Adding "robot" to
that query does not buy a different result set, it buys Furbo as a competitor.
The same ruling the hub already made about "best pet camera robot".

**`ebo x`, 260/mo at KD 42.** The hardest term in the category, on a model
Enabot no longer sells. `enabot ebo x` at 260 and KD 0 is the same dead product
from the other direction.

---

## Seasonality runs opposite to the rest of the site

`enabot` peaks in **July and August at 18,100** and troughs in March at 3,600.
People buy these before going away, not as presents. Every other category on
this site peaks in December.

---

## Built

- `/robots/pet-camera-robots/enabot-ebo-air-2/` — `ebo air 2`, 2,400/KD 0, carrying the discontinued `enabot ebo air` at 1,000
- `/robots/pet-camera-robots/enabot-ebo-se/` — `ebo se`, 390/KD 0
- `/robots/pet-camera-robots/enabot-rola-petpal/` — `rola petpal`, 140/KD 0

## Not built

**The Enabot range page.** ~12,900/mo at KD 4–10, ruled above, not yet written.
It is the largest unbuilt opportunity measured in this category by a factor of
five.
