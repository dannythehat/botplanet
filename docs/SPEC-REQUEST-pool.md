# Specs needed — robotic pool cleaners

Hand this to ChatGPT. It is written so the answers drop straight into the
matcher and the comparison table without anyone having to interpret them.

## The one rule

**Every figure needs the URL it came from, and that URL must be the
manufacturer's own page or its own PDF manual.** A retailer listing, a review
site, a YouTube description or a blog is not acceptable and will be rejected.
If the manufacturer does not publish a figure, the answer is
`NOT PUBLISHED` — that is a useful answer, not a failure. Never estimate,
never convert units the source did not print, and never fill a gap from a
sibling model.

**Model precision matters more than anything else here.** Several of these
brands sell near-identical siblings. A spec for the wrong sibling is worse than
no spec, because it looks right.

---

## Priority 1 — four products with nothing at all

These four cannot enter the bot matcher or the comparison table until they have
the seven fields below. Everything else on this page is a nice-to-have; this is
the blocker.

| Product | Exact model to research | Why it is empty |
|---|---|---|
| BuBlue Bubot 800P Gen2 | **Bubot 800P gen2** (model number from Amazon; brand BUBLUE) | New product, replaced the Dolphin Premier on 3 Aug |
| Aiper Scuba X1 Pro | **Scuba X1 Pro** — *not* X1, X1 Essential or X1 Pro Max | Record moved from the X1 Essential; the old specs were removed because they described a different machine |
| Dolphin Proteus DX4 Plus | **Proteus DX4 Plus** — *not* DX3, DX4 or DX5 | Added from an ASIN only; never researched |
| AIPER Scuba V3 AI Vision | **Scuba V3 AI Vision** — *not* S1, X1 or V3 non-Vision | Added from an ASIN only; never researched |

### The seven fields the matcher actually runs on

Ask for these first. Without them a product is invisible to the bot matcher.

1. **Pool type** — in-ground, above-ground, or both? (exact wording from the maker)
2. **Maximum pool length** — in feet. The single most important number: it is a
   hard exclusion, so a wrong value hides the product or recommends it wrongly.
3. **Surfaces cleaned** — floor / walls / waterline / water surface. List which,
   in the maker's own words. "Climbs walls" and "cleans the waterline" are two
   separate claims; do not merge them.
4. **Power** — cordless (battery) or corded (mains)? If corded, the **cable
   length in feet**.
5. **Runtime** — minutes, per mode if the maker states more than one.
6. **Charge time** — hours. (Cordless only.)
7. **Typical US price** — the manufacturer's own RRP if published.
   *Price is used only to place the product in a band. Do not send an Amazon
   price; those change and we date-stamp our own.*

### Then these, for the comparison table

8. Filtration fineness in microns, and the filter/basket capacity if published
9. Navigation system — the maker's name for it, plus what it actually does
10. Weight in lbs, and dimensions
11. Suction rate (GPH or GPM — whichever the maker prints)
12. Cleaning modes — how many, and what each is called
13. App support — yes/no, and Wi-Fi or Bluetooth if stated
14. Warranty term for the **US** market
15. Surface/liner compatibility — concrete, vinyl, fibreglass, tile
16. Model number or SKU, if one is published anywhere

---

## Priority 2 — small gaps on products that are otherwise complete

Quick wins. Each is a single field.

| Product | Missing |
|---|---|
| Dolphin Nautilus CC Plus w/Wi-Fi | battery capacity, charge time |
| Dolphin E10 | battery capacity, charge time |
| Polaris FREEDOM | model number / SKU |
| Dolphin Nautilus CC Plus, Dolphin E10 | model number confirmation |

`cableLengthFt` shows as missing on the cordless models. That is correct and
needs no research — it does not apply to a machine with no cable.

---

## Priority 3 — one correction we already know about

**Dolphin Nautilus CC Plus w/Wi-Fi.** Our own product data says it scrubs the
waterline. Maytronics' specification says it does not. Ask specifically:
*does the Nautilus CC Plus w/Wi-Fi (part 99996409-PCI) clean the waterline —
yes or no — and on which Maytronics page does it say so?* This is live on the
site and wrong either way round, so a sourced answer settles it.

---

## Format to send back

One block per product. Plain text is fine.

```
PRODUCT: Aiper Scuba X1 Pro
SOURCE: https://aiper.com/...            <- manufacturer page used for everything below
poolTypes: In-ground
maxPoolLengthFt: 66
surfacesCleaned: floor, walls, waterline
powerType: cordless
cableLengthFt: N/A
runtimeMins: 180
chargeTimeHrs: 4
priceUsdRrp: 1299
filtrationMicrons: 3
...
NOT PUBLISHED: weightLbs, dimensions, warranty
```

If a single figure came from a different page than the rest, put the URL on
that line. If the manufacturer has no page for the model at all, say so — that
is itself a finding, and it is what happened with the Aiper X1 Pro.
