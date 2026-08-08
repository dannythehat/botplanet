# Litter boxes and lawn mowers — identity verification, 8 August 2026

Ten candidates supplied by the owner, run against Amazon US through the
SerpAPI product engine (the same provider the scheduled refresh uses) and
against each manufacturer's own current lineup.

**Every one of them resolves to a real, current, buyable product. Three of the
ten were named wrongly in the brief, and one of those was named after a product
its own maker now labels superseded.** That is the finding, and it is the reason
the brief said not to trust its own naming over the retailer's.

Nothing here has been published to the catalogue yet. This file is the record
the publishing step reads from.

## How identity was confirmed

Search results truncate the front of a title, which hides the brand token — the
Husqvarna, WORX and eufy listings all appear brand-less in search and all carry
the brand as the first word of the real product title. Every ASIN below was
therefore re-read through the product engine rather than judged from the search
row. That is a method note worth keeping: a brand-token check run against search
titles alone would have failed four of these six mowers wrongly.

Prices are as read on 8 August 2026 and are not offers. Nothing here publishes a
price until it goes through the freshness gate.

## Self-cleaning litter boxes

| Candidate as briefed | Verdict | Current model | ASIN | Read price |
|---|---|---|---|---|
| Litter-Robot 4 | PASS, name correct | Litter-Robot 4 with Step & Fence, by Whisker | B0BH6MD3DJ | $699 |
| PetKit PuroBot Max Pro | PASS, **name corrected** | PETKIT Purobot Max Pro 2 | B0DM83CLW3 | $509.99 |
| Casa Leo's Loo Too | PASS, name correct | Casa Leo, Leo's Loo Too | B09LL9S99B | $599 |
| PetSafe ScoopFree Crystal | PASS, **name disambiguated** | ScoopFree Crystal Pro | B0DR3JP2FZ | $229.99 |

**PetKit.** The brief's "PuroBot Max Pro" is the previous generation. PetKit's own
2026 comparison page puts the flagship at **Purobot Max Pro 2**. A separate
**Purobot Max 3** also sells (B0F1YMM29X, $399.99) — it is a different tier
rather than the Max Pro's successor, and buying on the number alone would get the
wrong machine.

**PetSafe.** "ScoopFree Crystal" is a family, not a model, and the family
contains four live SKUs at four prices: Crystal Pro (B0DR3JP2FZ, $229.99),
Crystal Pro **Legacy** front-entry (B07X3XFB6K, $229.95), Crystal Pro Legacy
uncovered (B07WZPJ2LW, $142.49) and Crystal Classic (B0CFRY7VYN, $99). Two of
those are within five dollars of each other and one of them is the old
generation. The current model is the non-Legacy Crystal Pro.

**Litter-Robot 4.** Note the bundles outrank the bare unit in search: the top
result is a $749 supply bundle and a $799 accessory bundle sits beside it. The
$699 B0BH6MD3DJ is the machine itself.

## Robotic lawn mowers

| Candidate as briefed | Verdict | Current model | ASIN | Read price |
|---|---|---|---|---|
| Segway Navimow, current i/H | PASS | Segway Navimow i110N, 1/4 acre | B0CX7T6BR3 | $1,099 |
| Mammotion Luba 2 | **FAIL as named** | Mammotion LUBA 3 AWD 1500H | B0GKNYZPC3 | $2,399 |
| Husqvarna Automower, one EPOS model | PASS | Husqvarna Automower 410iQ, EPOS, 1/2 acre | B0DTV7TR6W | $2,499.99 |
| Worx Landroid Vision | PASS, **SKU chosen** | WORX WR320, Landroid Vision Cloud, 1/2 acre | B0GN8KK8XW | $1,022.54 |
| Eufy E15 | PASS | eufy Robot Lawn Mower E15 | B0DRVYDXWX | $1,199.99 |
| Dreame A1 | **FAIL as named** | DREAME A3 AWD 1000 | B0H3V799KT | $1,599.99 |

**Mammotion Luba 2 — the clearest failure.** Mammotion's own US product page for
the Luba 2 AWD is titled "2025 Model | Upgraded to 2026 LUBA 3". The company
announced the Luba 3 AWD series, Luba mini 2 AWD and Yuka mini 2 in March 2026.
Publishing a Luba 2 today would put a machine its maker has marked superseded at
the top of a category we have just opened. The replacement is the LUBA 3 AWD,
which ships in a 1500H (0.37 acre, $2,399) and a 3000H (0.75 acre, $2,799).

**Dreame A1 — no such current product.** Six passes across search and product
lookups returned no A1. Dreame's current mowers are the **A3 AWD 1000**
(B0H3V799KT, $1,599.99) and the **A3 AWD Pro** / LiDAR 3500 (B0GR8TQHV9,
$2,699.99). Either the A1 has been withdrawn or the brief carried a name from an
older list. It is recorded and skipped rather than substituted silently — a
successor is a different product and gets judged on its own.

**Worx needed a SKU decision.** "Landroid Vision" is a family of at least four
live models: WR320 2WD 1/2 acre ($1,022.54), WO7144 1/4 acre ($999.99), WR342
4WD 1/2 acre ($2,069.99) and WR344 4WD 1 acre ($2,646.18). The WR320 is the
mainstream Vision Cloud at the price most buyers meet. The 4WD models are a
different argument and belong in the catalogue separately if at all.

**Segway.** The range refreshed at CES 2026: the i2 AWD series (from $999) and
X4 series (from $2,499) are the new generation, and the i105N/i110N remain on
sale beneath them. The i110N is the current i-series machine at the size most
American lawns need, which is what the brief asked for. The H-series (H800-VF
and siblings) is the older RTK-plus-VisionFence line and is not the first
product to publish.

**Husqvarna.** The 410iQ carries EPOS and is wire-free, which is what was asked
for. Two figures were in circulation — $1,550 in a price round-up and $2,499.99
on Amazon — and the Amazon figure is the one read directly and the one recorded.
The 420iQ (B0DTVF4QGY, $3,144.37) is the larger sibling.

## What is NOT in this file

**No availability state.** The product engine did not return a stock field for
any of the ten. Availability is therefore unknown for all of them, and no offer
may publish a stock claim until the scheduled refresh reads one.

**No offers, no /go keys, no destinations.** Identity is confirmed; the
commercial wiring is not built. Publishing a product row and publishing a buy
button are separate decisions and only the first is ready.

**No reviews.** Those wait for artwork, per the owner's instruction.

---

# Addendum, 8 August 2026 — the SKUs actually published

Ten products entered the catalogue on this date as `OFFER_SETUP_PENDING`:
identity verified, published, offers not wired. No price, no /go link and no
stock claim renders for any of them.

## The PetSafe decision, recorded because it was close

Four ScoopFree Crystal SKUs are live and two of them are $229.95 and $229.99 —
four cents apart. Published: **ScoopFree Crystal Pro, B0DR3JP2FZ, $229.99**.

Both $229 SKUs are PetSafe-branded and confirmed at the product engine. The one
we did not take is **B07X3XFB6K, ScoopFree Crystal Pro *Legacy*, Front-Entry**.
"Legacy" is PetSafe's own word for the previous generation, printed in its own
title, and B07X3XFB6K's ASIN prefix (B07) dates it to several years before
B0DR3JP2FZ's (B0D). Same price, older machine. A buyer sorting by price cannot
tell these apart, which is the reason this paragraph exists.

Also not published: Crystal Pro Legacy uncovered (B07WZPJ2LW, $142.49) and
Crystal Classic (B0CFRY7VYN, $99). Both are real and buyable; neither is the
current generation, and one product per model line is the rule.

## The full published set

| Category | Name published | ASIN verified | Read price | Band |
|---|---|---|---|---|
| Litter | Litter-Robot 4 | B0BH6MD3DJ | $699 | premium |
| Litter | PETKIT Purobot Max Pro 2 | B0DM83CLW3 | $509.99 | premium |
| Litter | Casa Leo Leo's Loo Too | B09LL9S99B | $599 | premium |
| Litter | PetSafe ScoopFree Crystal Pro | B0DR3JP2FZ | $229.99 | mid |
| Lawn | Segway Navimow i110N | B0CX7T6BR3 | $1,099 | mid |
| Lawn | Mammotion LUBA 3 AWD 1500H | B0GKNYZPC3 | $2,399 | premium |
| Lawn | Mammotion LUBA 3 AWD 3000H | B0GKNQKJJQ | $2,799 | premium |
| Lawn | Husqvarna Automower 410iQ | B0DTV7TR6W | $2,499.99 | premium |
| Lawn | WORX Landroid Vision Cloud WR320 | B0GN8KK8XW | $1,022.54 | mid |
| Lawn | eufy Robot Lawn Mower E15 | B0DRVYDXWX | $1,199.99 | mid |

Ten products from ten candidates, with three renamed and one substituted:
Luba 2 became LUBA 3 AWD (published in both sizes, because 0.37 and 0.75 acre
are different buyers), Dreame A1 became **nothing** — see below — PuroBot Max
Pro became Max Pro 2, and ScoopFree Crystal became Crystal Pro.

## Refused: Dreame

**Dreame A1 is not published, and no Dreame is published in its place.** The A1
does not exist in the current US range; the line is now A3 AWD 1000
(B0H3V799KT, $1,599.99) and A3 AWD Pro (B0GR8TQHV9, $2,699.99).

The brief said to publish the ten with corrected names, and for Mammotion the
correction is unambiguous — the maker's own page says the Luba 2 was upgraded to
the Luba 3, so the successor is named by the manufacturer. Dreame is not the
same case. An A3 is not a renamed A1; it is a different machine two generations
along with LiDAR the A1 did not have, at a price the brief never named. Putting
it in because the brand matches is substituting a product nobody asked for, and
this catalogue has a rule against exactly that: a successor becomes its own
record and is judged on its own.

The A3 AWD 1000 looks like a good candidate. It should be proposed, not smuggled
in under an old name.
