# Companion robots — keywords per page

Researched 6 August 2026. US volumes, searches per month.

## Page 1 — Companion robots hub · `/robots/companion-robots/`

| Use it for | Keyword | Vol |
|---|---|---|
| **H1 + title** | **robot pet** | **8,100** |
| In copy | robotic pet | 8,100 |
| In copy | companion robot | 4,400 |
| In copy | ai companion robot | 1,900 |
| In copy | robot friend | 1,000 |
| In copy | robot pets for adults | 480 |
| In copy | desktop companion robot | 480 |

## Page 2 — Pet camera robots · `/robots/pet-camera-robots/`

Separate page from the hub. They share no meaningful SERP domains.

| Use it for | Keyword | Vol |
|---|---|---|
| **H1 + title** | **pet camera robot** | **480** |
| In copy | pet monitoring robot | 170 |
| In copy | home monitoring robot | 170 |
| In copy | robot pet camera | 140 |
| In copy | robot camera for pets | 140 |

## Page 3 — Robot pets for seniors (guide)

| Use it for | Keyword | Vol |
|---|---|---|
| **H1 + title** | **robotic pet for elderly** | **390** |
| In copy | elderly care robot | 390 |
| In copy | robotic pet for dementia | 170 |
| In copy | companion robot for elderly | 140 |

## Reviews — one page each

Title is the product name, not "X review". The bare name gets 10–100× the searches.

| Product | Keyword | Vol |
|---|---|---|
| Living.AI EMO | emo robot | 18,100 |
| Eilik | eilik robot | 8,100 |
| Loona | loona robot | 5,400 |
| Sony Aibo | sony aibo | 3,600 |
| Tombot Jennie | tombot jennie | 2,400 |
| Joy for All | joy for all companion pet | 1,900 |
| Casio Moflin | casio moflin | 1,300 |
| Enabot EBO Air | enabot ebo air | 1,000 |
| Enabot EBO X | enabot ebo x | 260 |
| Enabot EBO SE | enabot ebo se | 260 |

## Don't build

| | Why |
|---|---|
| Robot dog page | 90,500 searches, but the results are $1,600 Unitree dev kits and Target toys. Nothing we'd sell. |
| Kids robot page | Toy and parenting space, out of scope. |
| "Best companion robot" page | 110/mo. The hub covers it. |

## Check before planning these reviews

Probably discontinued. Big numbers, possibly nothing to sell.

| Product | Vol |
|---|---|
| vector robot | 9,900 |
| cozmo robot | 9,900 |
| moxie robot | 8,100 |

**Resolved 8 August 2026 — see the buyability pass below.** Vector is buyable,
Cozmo and Moxie are not.

---

Run `31081889310`, cost $0.2224. Seeds: `docs/seo/seeds/companion-robots.json`.

---

# Buyability pass, 8 August 2026

Search volume proposes a product. An Amazon US listing decides whether it can
become a page. This is that reading, run with `scripts/amazon-discover.mjs
--set companion` and verified with `scripts/amazon-identity-check.mjs
--targets`. Prices are what the listing showed on 8 August 2026 and are a
dated observation, not a fact about the product.

## Buyable — identity confirmed against the listing's own fields

| Product | Term vol | ASIN | Price seen | Stock |
|---|---|---|---|---|
| Vector 2.0 | 9,900 | `B07G3ZNK4Y` | $199.99 | In Stock |
| Eilik | 8,100 | `B0C2C9LJNQ` | $139.99 | In Stock |
| Loona | 5,400 | `B0DCF53PCH` | $499 | In Stock |
| Joy For All Companion Pet | 1,900 | `B017JQQ00Q` | $159.99 | In Stock |
| Casio Moflin | 1,300 | `B0GPHNLWP3` | $429 | In Stock |
| Miko 3 | (unmeasured) | `B0GV37M678` | $299 | In Stock |

Two caveats that belong to editorial rather than to discovery:

- **The Brand field did not parse on any of the six.** Confirmation rests on the
  model token appearing in the listing title, which for names as distinctive as
  Eilik, Moflin, Loona and Miko 3 is decisive, and for Vector rests on a title
  reading "Anki Vector 2.0". This is weaker than the window eleven, where the
  Brand row was read directly. No offer should be registered from this table
  without re-reading the Brand row first.
- **Vector's history is the story, not a footnote.** Anki was liquidated in
  2019 and Digital Dream Labs bought the line. A review that ranks for 9,900
  searches a month and does not lead with what happened to the servers is not
  a review.

## Not buyable on Amazon US

| Product | Term vol | What the search actually returned |
|---|---|---|
| Living.AI EMO | 18,100 | "EMOPET AI Desk Robot Companion" and similar. Two queries, brand token "Living.AI" absent from the top results of both. |
| Cozmo | 9,900 | One listing: "Digital Dream Labs Battery for Vector or Cozmo", $19. A spare part, not the robot. |
| Moxie | 8,100 | Nothing related. Embodied shut Moxie down in December 2024. |
| Sony aibo | 3,600 | PuppyPi and other unrelated robot dogs. |
| ElliQ | 3,600 | Unrelated plush companions. ElliQ sells direct on a subscription. |
| Tombot Jennie | 2,400 | Contixo and other remote-control dog toys. Tombot takes waitlist deposits. |

**Loona was nearly missed twice**, which is worth recording because both near
misses were tooling faults rather than facts about Loona. The first pass
matched "Play Ball for Loona Pet Robot" — an accessory carries every token of
the product it attaches to. The identity check then refused the real listing on
a deny token of my own writing, `charging dock :`, which matched Amazon's own
`" : Toys & Games"` title suffix on a listing whose name ends "Includes
Charging Dock". Both are fixed in the scripts; the second is the reason a
refusal gets read rather than believed.

## What this does to the plan

The plan carries seven companion reviews. Three of them — EMO, aibo and
Tombot Jennie — have nothing to sell, and EMO is the largest single term in the
category at 18,100. Two products the plan does not carry, Vector 2.0 at 9,900
and Miko 3, are buyable today.

Nothing here has been applied to `page-plan.ts`. Dropping the category's
biggest planned review and adding two unplanned ones is an owner decision, not
a consequence of a search result.
