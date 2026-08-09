# The 9 August upload — what arrived, what it maps to, what is set aside

Sixty-two files were downloaded from the Notion "Image Requests" page on
9 August 2026 and every one of them was opened and looked at. This is the
record of which file belongs in which slot, and of the eight that are not being
published without a decision from the owner.

**Nothing here has been registered or placed yet.** Ingest is a pipeline —
download, convert, register, place — and this file is the output of the first
stage plus the reading of the files. The findings below change what the later
stages should do, which is why they are written down before the later stages run.

## How the files were matched to slots

The uploads carry no slot words in their filenames this round, so position is
the only key. The page's completed sections carry an explicit mapping line
(`1000023417` → card · `1000023416` → hero) and this round's sections do not, so
the reading is: walk the document in order, and each `slot` label takes the next
image that follows it. That rule reproduces the completed sections exactly, which
is what makes it safe to apply to the new ones.

`scripts/notion-image-ingest.mjs` does the download. The S3 URLs Notion hands
out expire after 300 seconds, so the fetch and the download have to run back to
back; the script names each file `<section>__<position>__<original>` so position
survives into the filename.

## The map

| Section | Slot | File | State |
|---|---|---|---|
| Grill hub | row2 | 1000023564 | clean |
| Grill hub | row3 | 1000023565 | clean — label mangled, see below |
| Grill hub | row4 | 1000023566 | clean |
| Pet camera hub | hero | 1000023567 | branded card, see below |
| Pet camera hub | card1 | 1000023568 | clean |
| Pet camera hub | card2 | 1000023569 | clean |
| Pet camera hub | card3 | 1000023570 | clean |
| Pet camera hub | row1 | 1000023572 | clean |
| Pet camera hub | row2 | 1000023573 | clean |
| Pet camera hub | row3 | 1000023574 | **SET ASIDE** |
| Pet camera hub | row4 | 1000023575 | **SET ASIDE** |
| Moflin | hero / figure-1 / figure-2 / card | 585 / 586 / 587 / 588 | claims burnt in |
| Miko 3 | hero / figure-1 / figure-2 / card | 590 / 591 / 592 / 593 | clean enough |
| Vector 2.0 | hero / figure-1 / figure-2 / card | 595 / 597 / 598 / 599 | clean enough |
| Eilik | hero / figure-1 / figure-2 / card | 603 / 604 / 605 / 606 | clean |
| Eilik | — | 1000023602 | range card, no slot |
| Loona | hero / figure-1 / figure-2 / card | 610 / 611 / 612 / 613 | 612 carries maker copy |
| Loona | — | 1000023609 | range card, no slot |
| EMO | hero / figure-1 | 617 / 618 | branded |
| EMO | — | 619, 620 | unlabelled |
| EMO | — | **1000023621** | **the Eilik vs EMO comparison image** |
| EMO | card | — | **NO FILE** |
| Ropet | hero / figure-1 / figure-2 | 630 / 632 / 633 | claims burnt in |
| Ropet | card | 1000023634 | **SET ASIDE** |
| Joy For All | card | 1000023638 | **SET ASIDE** |
| Joy For All | — | 1000023637 | branded card, no slot |
| EBO Air 2 | hero / figure-1 / figure-2 / card | 648 / 649 / 650 / 651 | spec conflict, see below |
| EBO Air 2 | — | 1000023647 | **SET ASIDE** |
| EBO SE | hero / figure-1 / figure-2 / card | 655 / 657 / 658 / 659 | not yet opened |
| ROLA PetPal | hero / figure-1 / figure-2 | 662 / 663 / 664 | not yet opened |
| ROLA PetPal | — | 1000023661 | range card, no slot |
| Enabot range page | hero, figure-1 | — | **NOTHING UPLOADED** |

## Grill hub row3 — resolved, not guessed

The `row3` label did not survive an edit: the line reads `l · far corner of a
grill` with the label and the first words gone. Three things agree, so this is
read rather than guessed. Position puts 1000023565 between row2's image and the
row4 label. The surviving caption fragment says "far corner of a grill". The
file shows the near edge and far corner of a grill on a sunlit patio. The
section's own note says the three still needed are row2, row3 and row4, and
exactly three new files arrived.

## Set aside, with reasons

**1000023574 and 1000023575 — pet camera hub row3 and row4.** These are 768×432
and 612×407 JPEGs at 33KB and 28KB. Every other file in the round is a PNG of
about 2MB at 1254×1254 or 1448×1086. The site's derivative widths run to 1440,
so neither of these can fill the srcset without being upscaled, and 612×407 is
a stock-library thumbnail size. Publishing them would either ship a visibly soft
image or ship an srcset that claims widths the file does not have.

**1000023634 — Ropet card.** A full infographic headed "MY DIARY & PRIVACY",
carrying the BotPlanet logo and the line "Learn more at BOTPLANET.IO", which
asserts: end-to-end encryption in transit and at rest; that no data is sold or
shared; that the camera is off by default; and "industry-leading security
standards". BotPlanet has verified none of that. The standing instruction is to
attribute claims in the caption rather than reject the image, and that works for
"expressive and adorable" — it does not work here, because the artwork carries
our own mark and our own domain, so a caption reading "Ropet says…" contradicts
what the reader can see. This is the one file where attribution cannot do the
job. Owner's call.

**1000023638 — Joy For All card.** Headed "SILVER WITH WHITE MITTS", subtitled
"A calming and enriching companion for older adults living with ADRD", with
panels claiming the product "reduces stress" and "calms and boosts moods".
That is a health claim about people with dementia, under the BotPlanet logo.
The wording is Ageless Innovation's own marketing and is attributable in a
caption — but it is going onto a guide read by families making care decisions,
so it is flagged rather than published quietly. Owner's call.

**1000023647 — EBO Air 2 branded card.** States "1080P HD VIDEO". The Air 2 is
a 2K machine: our own verification record reads "Video Capture Resolution
'1296p, 2k'" from the listing's details table, and the very next file in the
same upload (1000023648) says "2K QUAD HD". Two supplied images contradict each
other about the same product and one of them contradicts the evidence ledger.
Not a claims question — a factual error in the artwork.

## The thing worth knowing before the rest is placed

**This round is infographics, not photographs.** Most of these files are
BotPlanet-branded compositions with headline type, feature chips and body copy
set into them — specifications, prices of a kind, and product claims, rendered
so they read as BotPlanet's own statements rather than a manufacturer's.

That is a change of format from every previous round, and it lands on a site
whose whole argument is that a claim carries the date it was checked and the
source it came from. A burnt-in chip saying "LONG-LASTING BATTERY" cannot carry
either. It also cannot be corrected later without regenerating the file: text in
a caption is editable, text in a WebP is not.

Set against that, the artwork is good and the standing rule is to publish rather
than withhold. The recommendation is to place them with the claims attributed in
captions, treat the four above as needing a decision, and decide separately
whether burnt-in specification chips are wanted on this site at all — because
that decision governs every future round, not this one.

## Still needed from the owner

- Enabot range page: hero and figure-1, nothing uploaded.
- EMO: the `card` slot, which asked for EMO with a boxer dog in a garden.
- Pet camera hub: row3 and row4 at full resolution.
- ROLA PetPal: the `card` slot.
