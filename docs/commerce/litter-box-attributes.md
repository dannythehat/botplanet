# Self-cleaning litter boxes — the attributes that separate them, 10 August 2026

Three of the four boxes in the catalogue were **byte-identical on every scored
field** — same environments, same cleans, same price tier — so the matcher
returned a three-way tie under every answer set anybody tried. It was right to.
The recorded data could not separate them, and no change to the scoring engine
can fix a catalogue that does not know the difference between its own products.

This is the read that closes it. Identity (ASIN, price, seller) was already
verified on 8 August and is in `docs/seo/litter-lawn-verification-2026-08-08.md`;
what follows is the **specification** read, taken from each manufacturer's own
pages on 10 August 2026.

## What each maker publishes

| | Litter-Robot 4 | PETKIT Purobot Max Pro 2 | Casa Leo Leo's Loo Too | PetSafe ScoopFree Crystal Pro |
|---|---|---|---|---|
| Price (8 Aug) | $699 | $509.99 | $599 | $229.99 |
| Amazon rating (10 Aug) | 4.4 / 156 | 4.0 / 45 | 4.0 / 411 | **3.1 / 184** |
| Cat weight | **3–25 lb** | **3.3–22 lb** | **1–20 lb** | not published |
| Entry | **15.75 × 15.75 in** | **10.51 × 10.74 in**, 10.03 in high | not published | not published |
| Interior | globe 16.5 in high | cylinder 76 L | drum, 30 dB | box 28.2 × 20.4 × 16 in |
| Waste capacity | ~8 days | 8 L, 17 days | 9.5 L | up to 30 days |
| Litter | standard clumping clay | most clumping under 12 mm | 100% clay-clumping, any brand | **PetSafe crystal trays only** |
| App | Whisker app | 5G Wi-Fi, AI camera | Wi-Fi, voice | **none** |
| Warranty | 1 yr; 3 yr for $100 | not read | 1 yr; 3 yr optional | not on the product page |

Sources read directly: `litter-robot.com`, `petkit.com`, `casaleopet.com`,
`petsafe.com`. Ratings from each ASIN's own Amazon listing on 10 August 2026.

## The two corrections

### Leo's Loo Too is not a large-cat box

Casa Leo's own words are "spacious drum accommodates cats up to 20 lbs (9 kg)".
The `large_cat` value in our vocabulary means "Maine Coon and up — chamber size,
not sensor, is the limit", and a male Maine Coon routinely passes 20 lb.

`large_cat` removed. It was carrying that claim while also being the machine
that won the tie alphabetically, which made the error worse rather than
academic: a reader with a big cat was being sent to the box with the lowest
stated ceiling of the three.

### Leo's Loo Too is the only kitten box, and nothing carried `kitten` at all

Casa Leo states "our system works with cats as light as 1 lb". Whisker's minimum
is 3 lb and PETKIT's is 3.3 lb, so a kitten under three pounds is not detected
by either — the machine cannot know it is in there, which is the hazard the
weight sensor exists to prevent.

Before this read, **no product in the category carried `kitten`**, so a reader
answering "a kitten, or very small" was scored against an axis nothing claimed.

## The question the funnel asked and could not act on

"Would you buy the manufacturer's own litter refills?" has been in the litter
questionnaire since it shipped, with the hint **"Rules out the sealed-tray
systems"**, and no option carried a score. There was no capability for the
answer to land on, so the reader answered a question that changed nothing.

`any_litter` is added to the shared vocabulary — *takes ordinary litter from any
shop, not the maker's own trays* — and set from each maker's own statement:

- **Litter-Robot 4** — "standard clumping clay litter" works best; plant-based
  and non-clumping are not compatible. Any shop. **Yes.**
- **PETKIT Purobot Max Pro 2** — most clumping litter with particles under
  12 mm, and two sifters are supplied, one for tofu and mixed litter and one for
  bentonite and clay. Any shop, and the widest range of the four. **Yes.**
- **Casa Leo Leo's Loo Too** — 100% clay-clumping only, any brand; Casa Leo
  states other litters void the warranty and the 90-day trial. Any shop, one
  type. **Yes.**
- **PetSafe ScoopFree Crystal Pro** — "Only compatible with official PetSafe
  ScoopFree Disposable Crystal Litter Trays or Reusable Litter Trays." **No.**

The PetSafe is not being punished for a design choice. The sealed tray is
exactly why it runs thirty days untouched, which is the longest interval of the
four and a real advantage. It is being described accurately, so that the reader
who said they want ordinary litter stops being shown it and the reader who did
not still can be.

## What this does not fix

For a reader with an average-sized cat who wants all four capabilities, the
**Litter-Robot 4 and the PETKIT Purobot Max Pro 2 remain tied** at the premium
tier. That is honest: on everything recorded, they do the same things.

What would separate them is not in any scored column and belongs in the reviews
this category still does not have —

- the PETKIT recognises individual cats by face through a 210° camera and
  analyses clumps for pH when paired with its own urine-monitoring litter;
- the Whisker shows seven days of history free and gates two years behind a
  Whisker+ subscription;
- their entrances differ by more than five inches in width, which is the
  difference between a cat walking in and a cat deciding not to.

The category has 74,000/mo on `litter robot 4` alone and no review pages at all.
That is the next thing worth building here, not another scoring constant.
