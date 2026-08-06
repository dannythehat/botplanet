# Robotic Lawn Mowers — Amazon US products and ASINs

**Stage 4 of the pre-build process.** Found 2026-08-06 by search plus a direct
read of each product page.

**Status: ASINs confirmed by page title. Prices NOT captured** — Amazon renders
them client-side and the page source carries no figure. That is the normal case
and it is what the SerpApi price checker exists for; every price lands at Stage 6
with the date it was read, as it did for pool and window. No price is invented
here.

---

## 0. The finding that changes the plan

**Every "model" in the keyword research is a product FAMILY, not a product.**

| Research called it | Amazon actually sells |
|---|---|
| Mammotion LUBA 2 | 3000X, 3000HX, 5000, 5000H, 5000X, 10000H — plus LUBA **mini** 2 in 1500/1500H |
| Mammotion LUBA 3 | 1500, 1500H, 3000H, 5000, 5000H — plus garage and washstand bundles of each |
| Worx Landroid Vision | WR220, WR230, WR310, WR320, WR340, WR342, WR344 |
| ECOVACS GOAT O1000 | O1000 RTK, O1000 LiDAR PRO, O1000 RTK Care Kit — at least four ASINs |
| Husqvarna Automower 430X | **four live ASINs**, plus 430XH listings that are a different machine |
| Mammotion YUKA | YUKA mini 500, 500H, 700, 700H, 800, 800H, mini 2 1000H |

This is the "sibling models it must never be confused with" risk from the
pre-build process, and it is worse here than in pool or window by a wide margin.
Pool had the Scuba X1 versus X1 Pro Max. Lawn has eight near-identical SKUs per
brand, differing only by acreage and cut height, and Amazon's own search surfaces
bundles above base units.

**Consequence for the build:** every lawn review must name its exact SKU in the
H1, and every identity check must pin the model string, not just the ASIN. A
reader who buys a LUBA 3 AWD 1500 after reading about a LUBA 3 AWD 5000 has been
sent to the wrong machine by us.

**Two research assumptions did not survive contact:**

- **Segway Navimow X330 is not sold on Amazon US.** The research listed it at
  170/mo. Amazon's X series is X430 and X450. Dropped.
- **LUBA 3 has effectively superseded LUBA 2.** The research had LUBA 2 at
  2,900/mo against LUBA 3's 1,600, which reflects search lag rather than the
  shelf. Both are live and both are listed below, but the volume ordering will
  invert.

---

## 1. Confirmed — title read directly from the product page

Seventeen products, eight brands. Ordered by the job they do in the catalogue
rather than by search volume, because BotMatch needs a distinct answer per
buyer and that is what decides the list.

### Boundary wire — the cheap way in, and the answer under trees

| # | Product | ASIN | Model no. | Covers | Slope |
|---|---|---|---|---|---|
| 1 | Husqvarna Automower 430X | `B09WNF4V5G` | 967852845 | 0.8 acre | 45% |
| 2 | Husqvarna Automower 415X | `B09WNDLXJL` | 970471745 | 0.4 acre | — |
| 3 | Husqvarna Automower 115H 4G | `B087YZCNDJ` | 115H 4G | 0.4 acre | — |

**Husqvarna carries 14,800/mo at KD 0–7** — the largest single keyword any
planned BotPlanet page would own, and the research showed Amazon ranking the
430X on the brand SERP itself. Build the 430X first.

**Sibling warning, 430X.** At least four live ASINs sell something called a
430X: `B09WNF4V5G` (967852845, the current listing), `B07WLMRMJS`, `B01J8AAKCU`,
and `B01D3TIZ6K` (967622505, an older part number). Separately, `B07TS69X9J` and
`B09WNDMPMQ` are the **430XH**, which is a different machine with a different
cutting height range. The identity check must pin **967852845**.

### Wire-free, RTK — the mainstream of the category

| # | Product | ASIN | Model | Covers | Slope |
|---|---|---|---|---|---|
| 4 | Segway Navimow i105N | `B0CX8LL2PC` | i105N | 1/8 acre | — |
| 5 | Segway Navimow i110N | `B0CX7T6BR3` | i110N | 1/4 acre | — |
| 6 | ECOVACS Goat O1000 RTK | `B0DRG2HMD2` | O1000 RTK | 1/4 acre | — |
| 7 | Worx Landroid Vision Cloud WR310 | `B0GNZHMD9Q` | WR310 | 1/4 acre | 30% |
| 8 | Worx Landroid Vision Cloud WR320 | `B0GN8KK8XW` | WR320 | 1/2 acre | 30% |
| 9 | Greenworks C30Z | `B0GVHYW416` | C30Z | 3/4 acre | 24° |
| 10 | EcoFlow Blade | `B0BZRVBNPQ` | Blade | 0.7 acre | — |

### Wire-free, LiDAR — works where satellite does not

| # | Product | ASIN | Model | Covers | Slope |
|---|---|---|---|---|---|
| 11 | ECOVACS Goat A2000 LiDAR PRO | `B0GGZQTY2N` | A2000 LiDAR PRO | 1/2 acre | — |
| 12 | Mammotion LUBA 3 AWD 3000H | `B0GKNQKJJQ` | LUBA 3 AWD 3000H | 0.75 acre | 80% |
| 13 | Mammotion LUBA 3 AWD 5000 | `B0GWLG3D39` | LUBA 3 AWD 5000 | 1.25 acre | 80% |

### Slopes and acreage — the top of the range

| # | Product | ASIN | Model | Covers | Slope |
|---|---|---|---|---|---|
| 14 | Mammotion LUBA 2 AWD 3000X | `B0DWMBWJ3Z` | LUBA 2 AWD 3000X | 0.75 acre | 80% |
| 15 | Segway Navimow X430 | `B0G8Y8CNH7` | X430 | 1 acre | **84%** |

### Vision only, no RTK — the tree-cover answer

| # | Product | ASIN | Model | Covers | Slope |
|---|---|---|---|---|---|
| 16 | eufy E15 | `B0DRVYDXWX` | E15 | 0.2 acre | 18° |
| 17 | eufy E18 | `B0DRVYX8K2` | E18 | 0.3 acre | 18° |

**These two matter more than their search volume suggests.** They navigate by
stereo camera with **no RTK antenna at all**, which makes them the machines that
still work under a mature canopy — the second question the lawn BotMatch asks,
and the one the research flagged as having almost no search volume and the
highest chance of ruining a purchase. Without them the catalogue has no honest
answer for a shaded garden.

---

## 2. Found but NOT verified — search title only

Both fetches returned a server error twice. The titles come from Amazon's own
search result, so the products exist, but nothing here has been read from the
page and none of it should be seeded until it has.

| Product | ASIN | Why it is wanted |
|---|---|---|
| Greenworks optimow 50H | `B0BBSPFTWL` | The second boundary-wire brand. Without it, wire is Husqvarna-only and the cheap end of the catalogue is one brand deep. |
| Mammotion LUBA 2 AWD 10000H | `B0DT99DFMM` | 2.5 acres — the largest coverage found anywhere. The answer for genuine acreage. |
| Mammotion YUKA mini 2 1000H | `B0DT39TB3R` | 0.25 acre at 45% slope with LiDAR. A small-yard machine that still climbs. |

---

## 3. What the catalogue covers, and where it is thin

| Buyer | Answered by |
|---|---|
| Small flat lawn, cheapest way in | Navimow i105N, eufy E15 |
| Typical back yard, wire-free | Navimow i110N, GOAT O1000, Landroid WR310/WR320 |
| Half to three-quarter acre | Landroid WR320, GOAT A2000, Greenworks C30Z, LUBA 3 3000H |
| An acre or more | Navimow X430, LUBA 3 5000, LUBA 2 10000H *(unverified)* |
| Real slopes | LUBA 2/3 AWD (80%), Navimow X430 (84%) |
| **Under trees, no satellite view** | **eufy E15, E18** — and the LiDAR machines |
| Boundary wire preferred or required | Husqvarna 115H / 415X / 430X |
| Multiple separate lawns | Navimow, LUBA, GOAT, Landroid all state multi-zone |

**Thin spots, stated rather than papered over:**

- **Wire is one brand deep** until the Greenworks optimow 50H is verified. If it
  fails, a reader who wants a wire has only Husqvarna, at Husqvarna prices.
- **No sub-$500 machine found.** Pool and window both have a genuine budget
  floor; this category may not have one on Amazon US. The budget guide is
  planned at 500/mo and needs something to recommend — worth confirming before
  that page is built.
- **Slope figures are quoted in two units.** Husqvarna and Mammotion publish a
  percentage, eufy and Greenworks publish degrees. 18° is roughly 32%. Every
  review must state which unit the maker used rather than silently converting.

---

## 4. Before any of these ships

Per Stage 4 and Stage 6 of `docs/seo/PRE-BUILD-PROCESS.md`:

1. Price, stock and seller read per ASIN, each carrying the date — via the
   existing checker, not by hand.
2. An `EXPECTED_IDENTITIES` entry per product pinning the **model string**, not
   only the ASIN. This category needs it more than any other: the sibling SKUs
   are near-identical and Amazon reuses titles across bundles.
3. Offer and redirect rows seeded *before* the page ships, so no buy button can
   404 — the failure that hit the Proteus DX4 Plus and Scuba V3.
4. `node scripts/extension-points.mjs robotic-lawn-mowers` for the per-category
   list, and the per-product list in `docs/EXTENSION-POINTS.md` walked once per
   machine.
