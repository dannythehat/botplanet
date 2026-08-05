# Window-cleaning robots — ASIN capture

Working record for Stage 4. **Nothing here is verified identity yet** — all eleven are captured: an ASIN
becomes trustworthy when the price provider machine-reads the listing and its
Brand / Model Number fields match, exactly as happened with the WYBOT C1
(`OS7010C`) and the Aiper Scuba V3 (`PRN31`). Until then the provenance column
is the honest status.

| # | Product | ASIN | Provenance | Price seen |
|---|---|---|---|---|
| 1 | ECOVACS WINBOT W2 PRO Omni | `B0DR8Y4VF9` | search result, 2026-08-05 | ~$499 |
| 2 | ECOVACS WINBOT W2 PRO | `B0DSKC7QT7` | search result, 2026-08-05 | ~$380 |
| 3 | ECOVACS WINBOT W3 Omni | `B0GJDQ59J1` | search result, 2026-08-05 | ~$550 |
| 4 | ECOVACS WINBOT W1 PRO | `B0C2CQP8ZS` | search result, 2026-08-05 | ~$185 |
| 5 | ECOVACS WINBOT W2S | `B0G5Y3NHTX` | search result, 2026-08-05 | ~$330 |
| 6 | ECOVACS WINBOT Mini | `B0DR8W696Y` | search result, 2026-08-05 | TBC — **promoted to a review 2026-08-05**, replacing the dropped S7 Pro |
| 7 | **HOBOT 2S** | `B097CM7P9L` | **owner-supplied link, 2026-08-05** | **$299.00** |
| 8 | Cop Rose X5S | `B09D98W5KQ` | search result, 2026-08-05 | ~$160 |
| 9 | **HOBOT 298** | `B07LF4HZ6C` | **owner-supplied link, 2026-08-05** | ~$250 |
| 10 | **Mamibot W120-DP** | `B0DC6B81Z2` | search result, 2026-08-05 — **replaces the W120-T** | ~$229 |
| 11 | **HUTT S55 Pro** | `B0GFW8TFML` | **owner-supplied link, 2026-08-05** — replaces the W55 | TBC |


## Dropped

| Product | Why |
|---|---|
| HOBOT S7 Pro | Owner checked 2026-08-05: **not available on Amazon US.** It was the highest-volume Hobot term (130/mo), but a review needs a working buy button. |
| Windowmate WM-01 | Owner checked 2026-08-05: **not sold on Amazon US.** This was the magnetic both-sides-at-once machine and the only non-suction product in the plan. No magnetic window ROBOT appears to be sold in the US at all. Manual magnetic squeegees exist and were rejected — they are not robots and do not belong on BotPlanet. **Recorded as a genuine catalogue gap:** a reader with sealed double-glazing has no machine we can offer, and if a magnetic robot reaches the US market it should be added. |
| HOBOT S7 (plain) | Owner checked 2026-08-05: **does not exist on Amazon US either.** HOBOT is represented by the 2S and the 298. The S7 volume is unreachable and the research map is adjusted rather than pretending otherwise. |

## Sibling traps to check on capture

The pool build lost time to exactly this three separate times — a listing
titled `C1` whose fields read `C1 PLUS`, an `X1` that was an `X1 Essential`,
an `800P` the owner first called an `880P`.

- **HOBOT 298** — 288, 388 and 268 also exist
- **Mamibot W120-DP ships in three colours** — Blue `B0DC6B81Z2`, Orange
  `B0DC67MQ46`, Grey `B0DC67QH41`. That is a VARIANT FAMILY, and it is the
  exact shape of the Dolphin Nautilus CC Plus problem: a request for one ASIN
  can return a sibling's data. `matchIdentity` checks ASIN-returned equals
  ASIN-requested *first*, before any name matching, precisely for this. Only
  the Blue ASIN is recorded; the other two must never be substituted.
- **Windowmate / magnetic robots** — none on Amazon US. Do not substitute a
  manual magnetic squeegee to fill the gap; it is not a robot.
- **Mamibot W120-T** — the listing exists (`B07L2X6LPT`) but the owner found
  it unbuyable on 2026-08-05. A listing that exists is not a listing you can
  buy from, which is why the check is "can the owner add it to a basket"
  rather than "does the page load"
- **HUTT S55 Pro** — the model name INCLUDES "Pro". HUTT also ship the W55
  (`B0CJ4RZZNY`), DDC55 and A1. Model tokens must be `s55 pro`; `s55` alone
  must never be a deny token because it is a whole-token substring of the real
  name — the mistake that made the Aiper X1 Pro Max refuse itself for a day
- **WINBOT W2S** vs **W2S Omni** (`B0G5XYX1VH`) — different machines, different price
- **WINBOT Mini** vs **Mini2** (`B0GJDHYRLR`)
