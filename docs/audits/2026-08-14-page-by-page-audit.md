# BotPlanet — page-by-page audit, 14 August 2026

Every one of the 110 live pages fetched from production and run through a
detector for each defect class the manual per-page audits found. The point
is coverage: the Notion batches read 14 pages by hand and found real things.
This applies the same tests to all 110, so a defect cannot survive by
sitting on a page nobody had time to open.

Every number below is measured, not remembered. Where a detector needs
human judgement, it says so rather than reporting a total it cannot stand behind.

---

## Headline

- **110** live pages, all returning 200
- **91** carry at least one defect
- **149** defects total, in 7 classes

| Class | Pages | What it is |
|---|---|---|
| PROSE_PRICE | 51 | A price printed in body copy. **Needs triage — see below.** |
| NO_BUY_PATH | 44 | Page names products and carries no affiliate link at all. |
| VIDEO_NO_POSTER | 32 | Video block with no poster image — blank rectangle until it loads. |
| HUB_PROSE_NO_LINKS | 9 | Hub body copy links to no product. |
| PICKER_MECHANICAL | 8 | 'Readers also compared' caption admits it matched on power type. |
| PICKER_REPEAT | 4 | Same product listed twice in one alternatives block. |
| THIN | 1 | Under 300 words on an indexable content page. |

---
## The four that cost money

### 1. NO_BUY_PATH — 44 pages name products and cannot be bought from

| Page type | No buy path | Total |
|---|---|---|
| review | **16** | 64 |
| compare | **9** | 9 |
| hub | **9** | 9 |
| guide | **5** | 7 |
| best-of | **4** | 4 |
| author | **1** | 3 |

The 16 reviews are the real defect: 11 are robot vacuums, which have **zero
offer rows in D1** — the category was catalogued outside the seed pipeline that
creates them. That needs verified ASINs, not code. The other 5 (EMO, Moxie,
Cozmo, Grillbot, Enabot) are correctly unbuyable and say so.

The other 28 — every hub, compare, best-of and guide — are an editorial
position written into the code, not an accident.

### 2. PROSE_PRICE — 51 flagged, 5 real

The raw detector flags any price in body copy. Most are legitimate: a
subscription fee, an accessory, a rival's price. Re-run comparing each prose
price against that page's own buy box, only **5** restate a figure the buy box
owns — which is the actual rule.

| Page | Buy box | Prose repeats |
|---|---|---|
| `/robots/robot-snow-blowers/yarbo-snow-blower/` | 1299/4999 | 1299, 4999, 4530, 4530 |
| `/robots/robotic-lawn-mowers/husqvarna-automower-410iq/` | 1022.54 | 1022.54 |
| `/robots/robotic-lawn-mowers/mammotion-luba-3-awd-1500h/` | 1022.54 | 1022.54 |
| `/robots/robotic-pool-cleaners/wybot-c1/` | 500 | 500, 499.99 |
| `/robots/self-cleaning-litter-boxes/litter-robot-4/` | 699 | 699, 699, 749 |

**Worth a second look:** the Husqvarna and the Mammotion both show a buy box
of 1022.54. Two different machines at an identical price is either a
coincidence or a wrong offer on one of them.

### 3. HUB_PROSE_NO_LINKS — 9 of 9 hubs

Every hub. ~29,000 words of category copy between them and not one product
link in any of it. The link injector runs on markdown only; hub sections are
structured records it cannot see.

### 4. PICKER — 8 mechanical, 4 repeats

Eight pages carry a 'shares the same power type' caption, which is the picker
admitting it matched on nothing useful. Four list the same product twice in one
block.

- `/robots/robotic-pool-cleaners/aiper-seagull-se/` — /robots/robotic-pool-cleaners/beatbot-aquasense-2-ultra/ listed twice in one block
- `/robots/robotic-pool-cleaners/betta-se-plus/` — /robots/robotic-pool-cleaners/beatbot-aquasense-2-ultra/ listed twice in one block
- `/robots/robotic-pool-cleaners/bublue-bubot-800p/` — /robots/robotic-pool-cleaners/beatbot-aquasense-2-ultra/ listed twice in one block
- `/robots/robotic-pool-cleaners/dolphin-nautilus-cc-plus/` — /robots/robotic-pool-cleaners/beatbot-aquasense-2-ultra/, /robots/robotic-pool-cleaners/aiper-scuba-x1-pro-max/ listed twice in one block

---
## VIDEO_NO_POSTER — 32 reviews

Every one is a review. A video block renders with no poster, so a reader sees
a blank rectangle until the embed loads. Cosmetic, consistent, and one
template fix.

---
## Per-page appendix

Clean pages omitted. `—` means no defect in that class.

| Page | Type | Words | Buy links | Defects |
|---|---|---|---|---|
| `/authors/michelle-choa/` | author | 925 | 0 | NO_BUY_PATH |
| `/best-robots/robotic-lawn-mowers/` | best-of | 2813 | 0 | NO_BUY_PATH |
| `/best-robots/robotic-pool-cleaners/` | best-of | 3043 | 0 | NO_BUY_PATH |
| `/best-robots/robotic-pool-cleaners/above-ground-pools/` | best-of | 1911 | 0 | NO_BUY_PATH |
| `/best-robots/robotic-pool-cleaners/cordless/` | best-of | 3465 | 0 | NO_BUY_PATH |
| `/compare/companion-robots/` | compare | 370 | 0 | NO_BUY_PATH |
| `/compare/educational-coding-robots/` | compare | 335 | 0 | NO_BUY_PATH |
| `/compare/eilik-vs-emo/` | compare | 851 | 0 | NO_BUY_PATH |
| `/compare/pet-camera-robots/` | compare | 307 | 0 | NO_BUY_PATH |
| `/compare/robot-vacuums/` | compare | 484 | 0 | NO_BUY_PATH |
| `/compare/robotic-lawn-mowers/` | compare | 378 | 0 | NO_BUY_PATH |
| `/compare/robotic-pool-cleaners/` | compare | 2331 | 0 | NO_BUY_PATH |
| `/compare/self-cleaning-litter-boxes/` | compare | 334 | 0 | NO_BUY_PATH |
| `/compare/window-cleaning-robots/` | compare | 451 | 0 | NO_BUY_PATH |
| `/guides/are-robotic-pool-cleaners-worth-it/` | guide | 1931 | 0 | NO_BUY_PATH |
| `/guides/do-window-cleaning-robots-work/` | guide | 2106 | 0 | NO_BUY_PATH |
| `/guides/robot-lawn-mower-for-hills/` | guide | 1763 | 0 | NO_BUY_PATH |
| `/guides/robotic-pets-for-elderly/` | guide | 2195 | 0 | NO_BUY_PATH |
| `/guides/robotic-pool-cleaners/` | guide | 155 | 0 | THIN |
| `/guides/wire-free-robot-lawn-mower/` | guide | 1888 | 0 | NO_BUY_PATH |
| `/robots/companion-robots/` | hub | 3702 | 0 | NO_BUY_PATH; HUB_PROSE_NO_LINKS |
| `/robots/educational-coding-robots/` | hub | 2965 | 0 | NO_BUY_PATH; HUB_PROSE_NO_LINKS |
| `/robots/grill-cleaning-robots/` | hub | 2778 | 0 | NO_BUY_PATH; HUB_PROSE_NO_LINKS |
| `/robots/pet-camera-robots/` | hub | 3022 | 0 | NO_BUY_PATH; HUB_PROSE_NO_LINKS |
| `/robots/robot-vacuums/` | hub | 3234 | 0 | NO_BUY_PATH; HUB_PROSE_NO_LINKS |
| `/robots/robotic-lawn-mowers/` | hub | 3259 | 0 | NO_BUY_PATH; HUB_PROSE_NO_LINKS |
| `/robots/robotic-pool-cleaners/` | hub | 2699 | 0 | NO_BUY_PATH; HUB_PROSE_NO_LINKS |
| `/robots/self-cleaning-litter-boxes/` | hub | 3630 | 0 | NO_BUY_PATH; HUB_PROSE_NO_LINKS |
| `/robots/window-cleaning-robots/` | hub | 3735 | 0 | NO_BUY_PATH; HUB_PROSE_NO_LINKS |
| `/robots/companion-robots/eilik/` | review | 1924 | 1 | PROSE_PRICE; VIDEO_NO_POSTER |
| `/robots/companion-robots/joy-for-all-companion-pets/` | review | 1744 | 1 | PROSE_PRICE; VIDEO_NO_POSTER |
| `/robots/companion-robots/living-ai-emo/` | review | 1774 | 0 | NO_BUY_PATH; PROSE_PRICE; VIDEO_NO_POSTER |
| `/robots/companion-robots/loona/` | review | 2046 | 1 | PROSE_PRICE; VIDEO_NO_POSTER |
| `/robots/companion-robots/miko-3/` | review | 2093 | 1 | PROSE_PRICE; VIDEO_NO_POSTER |
| `/robots/companion-robots/moflin/` | review | 2324 | 1 | PROSE_PRICE; VIDEO_NO_POSTER |
| `/robots/companion-robots/moxie/` | review | 1785 | 0 | NO_BUY_PATH; PROSE_PRICE |
| `/robots/companion-robots/ropet/` | review | 2022 | 1 | PROSE_PRICE; VIDEO_NO_POSTER |
| `/robots/companion-robots/vector-2/` | review | 1979 | 1 | PROSE_PRICE; VIDEO_NO_POSTER |
| `/robots/educational-coding-robots/cozmo/` | review | 1806 | 0 | NO_BUY_PATH; PROSE_PRICE |
| `/robots/educational-coding-robots/makeblock-mbot/` | review | 1621 | 1 | PROSE_PRICE; VIDEO_NO_POSTER |
| `/robots/educational-coding-robots/ozobot-evo/` | review | 1588 | 1 | PROSE_PRICE; VIDEO_NO_POSTER |
| `/robots/educational-coding-robots/sphero-bolt/` | review | 1648 | 1 | PROSE_PRICE; VIDEO_NO_POSTER |
| `/robots/educational-coding-robots/sphero-indi/` | review | 1542 | 1 | PROSE_PRICE; VIDEO_NO_POSTER |
| `/robots/educational-coding-robots/sphero-mini/` | review | 1577 | 1 | PROSE_PRICE; VIDEO_NO_POSTER |
| `/robots/grill-cleaning-robots/grillbot/` | review | 1526 | 0 | NO_BUY_PATH; PROSE_PRICE |
| `/robots/pet-camera-robots/enabot-ebo-air-2/` | review | 1867 | 1 | PROSE_PRICE; VIDEO_NO_POSTER |
| `/robots/pet-camera-robots/enabot-ebo-se/` | review | 1476 | 1 | PROSE_PRICE; VIDEO_NO_POSTER |
| `/robots/pet-camera-robots/enabot-rola-petpal/` | review | 1563 | 1 | PROSE_PRICE; VIDEO_NO_POSTER |
| `/robots/pet-camera-robots/enabot/` | review | 2127 | 0 | NO_BUY_PATH |
| `/robots/robot-snow-blowers/yarbo-snow-blower/` | review | 2849 | 1 | PROSE_PRICE |
| `/robots/robot-vacuums/dreame-x40-ultra/` | review | 1464 | 0 | NO_BUY_PATH; PROSE_PRICE |
| `/robots/robot-vacuums/dreame-x50-ultra/` | review | 1366 | 0 | NO_BUY_PATH; PROSE_PRICE |
| `/robots/robot-vacuums/ecovacs-deebot-t90-pro-omni/` | review | 1478 | 0 | NO_BUY_PATH; PROSE_PRICE |
| `/robots/robot-vacuums/eufy-omni-s1-pro/` | review | 1460 | 0 | NO_BUY_PATH; PROSE_PRICE |
| `/robots/robot-vacuums/eufy-x10-pro-omni/` | review | 1591 | 0 | NO_BUY_PATH; PROSE_PRICE |
| `/robots/robot-vacuums/roborock-qrevo-s5v/` | review | 1330 | 0 | NO_BUY_PATH; PROSE_PRICE |
| `/robots/robot-vacuums/roborock-s8-max-ultra/` | review | 1493 | 0 | NO_BUY_PATH; PROSE_PRICE |
| `/robots/robot-vacuums/roborock-saros-10/` | review | 1409 | 0 | NO_BUY_PATH; PROSE_PRICE |
| `/robots/robot-vacuums/roomba-max-705/` | review | 1392 | 0 | NO_BUY_PATH; PROSE_PRICE |
| `/robots/robot-vacuums/shark-matrix-plus-ur2650ws/` | review | 1408 | 0 | NO_BUY_PATH; PROSE_PRICE |
| `/robots/robot-vacuums/shark-powerdetect-av2820s/` | review | 1436 | 0 | NO_BUY_PATH; PROSE_PRICE |
| `/robots/robotic-lawn-mowers/dreame-a3-awd-1000/` | review | 1637 | 1 | PROSE_PRICE |
| `/robots/robotic-lawn-mowers/eufy-e15/` | review | 1589 | 1 | PROSE_PRICE |
| `/robots/robotic-lawn-mowers/husqvarna-automower-410iq/` | review | 1698 | 1 | PROSE_PRICE |
| `/robots/robotic-lawn-mowers/mammotion-luba-3-awd-1500h/` | review | 2491 | 2 | PROSE_PRICE |
| `/robots/robotic-lawn-mowers/segway-navimow-i110n/` | review | 1682 | 1 | PROSE_PRICE |
| `/robots/robotic-lawn-mowers/worx-landroid-vision-wr320/` | review | 1606 | 1 | PROSE_PRICE |
| `/robots/robotic-pool-cleaners/aiper-scuba-s1/` | review | 3264 | 1 | PROSE_PRICE; PICKER_MECHANICAL; VIDEO_NO_POSTER |
| `/robots/robotic-pool-cleaners/aiper-scuba-v3-ai-vision/` | review | 3400 | 1 | PICKER_MECHANICAL; VIDEO_NO_POSTER |
| `/robots/robotic-pool-cleaners/aiper-scuba-x1-pro-max/` | review | 3405 | 1 | PROSE_PRICE; PICKER_MECHANICAL; VIDEO_NO_POSTER |
| `/robots/robotic-pool-cleaners/aiper-seagull-se/` | review | 3073 | 1 | PROSE_PRICE; PICKER_MECHANICAL; PICKER_REPEAT; VIDEO_NO_POSTER |
| `/robots/robotic-pool-cleaners/beatbot-aquasense-2-ultra/` | review | 3194 | 1 | PROSE_PRICE; VIDEO_NO_POSTER |
| `/robots/robotic-pool-cleaners/betta-se-plus/` | review | 3005 | 1 | PROSE_PRICE; PICKER_REPEAT |
| `/robots/robotic-pool-cleaners/bublue-bubot-800p/` | review | 3006 | 1 | PROSE_PRICE; PICKER_MECHANICAL; PICKER_REPEAT; VIDEO_NO_POSTER |
| `/robots/robotic-pool-cleaners/dolphin-nautilus-cc-plus/` | review | 3887 | 1 | PICKER_REPEAT; VIDEO_NO_POSTER |
| `/robots/robotic-pool-cleaners/dolphin-proteus-dx4-plus/` | review | 2907 | 1 | PICKER_MECHANICAL; VIDEO_NO_POSTER |
| `/robots/robotic-pool-cleaners/polaris-freedom/` | review | 3668 | 1 | PICKER_MECHANICAL |
| `/robots/robotic-pool-cleaners/wybot-c1/` | review | 3102 | 1 | PROSE_PRICE; PICKER_MECHANICAL; VIDEO_NO_POSTER |
| `/robots/self-cleaning-litter-boxes/casa-leo-loo-too/` | review | 1645 | 1 | PROSE_PRICE |
| `/robots/self-cleaning-litter-boxes/litter-robot-4/` | review | 1759 | 1 | PROSE_PRICE |
| `/robots/self-cleaning-litter-boxes/petkit-purobot-max-pro-2/` | review | 1718 | 1 | PROSE_PRICE |
| `/robots/self-cleaning-litter-boxes/petsafe-scoopfree-crystal-pro/` | review | 1754 | 1 | PROSE_PRICE |
| `/robots/window-cleaning-robots/ecovacs-winbot-mini/` | review | 1588 | 1 | PROSE_PRICE |
| `/robots/window-cleaning-robots/ecovacs-winbot-w1-pro/` | review | 1987 | 1 | VIDEO_NO_POSTER |
| `/robots/window-cleaning-robots/ecovacs-winbot-w2-pro-omni/` | review | 2332 | 1 | VIDEO_NO_POSTER |
| `/robots/window-cleaning-robots/ecovacs-winbot-w2-pro/` | review | 2093 | 1 | VIDEO_NO_POSTER |
| `/robots/window-cleaning-robots/ecovacs-winbot-w2s/` | review | 1684 | 1 | PROSE_PRICE |
| `/robots/window-cleaning-robots/ecovacs-winbot-w3-omni/` | review | 2322 | 1 | PROSE_PRICE; VIDEO_NO_POSTER |
| `/robots/window-cleaning-robots/hobot-298/` | review | 1594 | 1 | VIDEO_NO_POSTER |
| `/robots/window-cleaning-robots/hobot-2s/` | review | 1725 | 1 | VIDEO_NO_POSTER |
| `/robots/window-cleaning-robots/mamibot-w120-dp/` | review | 1794 | 1 | VIDEO_NO_POSTER |

### Clean pages (19)

`/`, `/about/`, `/affiliate-disclosure/`, `/authors/`, `/authors/danny/`, `/best-robots/`, `/botmatch/`, `/compare/`, `/contact/`, `/editorial-policy/`, `/guides/`, `/guides/cheap-robot-lawn-mower/`, `/how-botmatch-works/`, `/privacy/`, `/review-methodology/`, `/robots/`, `/robots/window-cleaning-robots/cop-rose-x5s/`, `/robots/window-cleaning-robots/hutt-s55-pro/`, `/terms/`
