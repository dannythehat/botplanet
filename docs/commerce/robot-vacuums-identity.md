# Robot vacuums — identity verification, 10 August 2026

Eleven products for the category with the most search demand on the site and
no catalogue at all. Source for every row: SerpAPI's Amazon engine on
amazon.com — `engine=amazon` for the keyword searches, `engine=amazon_product`
for a read of each pinned ASIN's own listing. Both runs 10 August 2026.

**Two of the eleven planned terms did not resolve to the product the plan
named, and one of those two is the largest term in the category.** That is the
first thing in this file because it changes what "the vacuum eleven" means.

---

## The two terms that did not resolve

### roborock S8 MaxV Ultra — 9,900/mo — NO FIRST-PARTY LISTING

Searching `roborock "S8 MaxV Ultra" robot vacuum` on amazon.com returns ten
results. The roborock-branded ones are the Qrevo Series, the Q10 S5+, the
Qrevo S5V and the **S8 Max Ultra**. Every result whose title actually contains
the string "S8 MaxV Ultra" is a third-party accessory kit — mop pads, dust
bins, filter bundles, $19.99 to $34.98. There is no machine of that name on
Amazon US to point a reader at.

Accessories outliving the machine they fit is what a superseded model looks
like from the outside. The nearest current roborock in the same place in the
range is the **S8 Max Ultra**, `B0D9B9LK9F`, $949.99, 4.5 stars from 1,227
ratings on its own listing.

**Ruling: build the S8 Max Ultra under its own name, and let the review answer
the MaxV question head on.** A reader who searched for a MaxV Ultra is served
by being told what happened to it and what roborock sells instead. A reader is
not served by a page that puts a name on a machine that does not carry it, so
the product record, the slug and the title all say S8 Max Ultra.

### eufy S1 Pro — 33,100/mo — LISTED, BUT READ THE PRICE TWICE

The search result for `eufy S1 Pro robot vacuum` returns `B0CTY6VT8Y` with
**no price at all** and 3.2 stars from 776 ratings. A missing price in Amazon's
search listing normally means no buy-box winner.

Reading the ASIN's own page directly returns a price: **$919.58**. So it is
buyable. It is also the worst-rated machine of the eleven by a distance — 3.2
against a set where nothing else is below 4.3 — and eufy's own current line has
moved past it: the Omni S2 (`B0GVYTYNP7`, $1,399.99, 4.4 stars) and the C28
(`B0FWK41WF2`, $499.99), whose listing describes itself as "Upgraded from
X10 Pro".

**Ruling: build it, publish it, and say all of that on the page.** The term is
33,100/mo and the machine exists; refusing to write about it would leave the
biggest question in the category unanswered. What it does not get is a buy
button — like all eleven, it enters as OFFER_SETUP_PENDING, and its reason for
being there is its own.

---

## The nine that resolved cleanly

Four of the planned terms are family names rather than models — `roborock
qrevo`, `ecovacs deebot`, `shark powerdetect` and `shark matrix` each cover
several SKUs at different prices. A family name cannot be a catalogue row, so
each was pinned to one machine and the reason recorded.

| Product | ASIN | Price | Rating | Ratings | Why this SKU |
|---|---|---|---|---|---|
| eufy X10 Pro Omni | B0CPFBBHP4 | $449.99 | 4.6 | 39,206 | Exact model term. Second ASIN `B0DG5G9HQM` is the white colourway at the same price and the same review pool — a variation family. |
| eufy Omni S1 Pro | B0CTY6VT8Y | $919.58 | 3.2 | 776 | Exact model term. See above. |
| roborock S8 Max Ultra | B0D9B9LK9F | $949.99 | 4.5 | 1,227 | Stands in for the S8 MaxV Ultra term. See above. |
| roborock Saros 10 | B0DLH247PS | $1,299.99 | 4.5 | 4,428 | Exact model term. `B0DLH45139` is the same model with no price and 94 ratings; not pinned. |
| roborock Qrevo S5V | B0DSP8J476 | $499.98 | 4.3 | 1,625 | Top organic result for `roborock qrevo`. `B0FX4SZ4KB` is the same machine at the same price sharing the review pool — variation family, needs `th=1&psc=1`. |
| dreame X40 Ultra | B0CXDXKSXP | $599.99 | 4.4 | 901 | Exact model term and the highest-rated of the X40 listings. |
| dreame X50 Ultra | B0DM5J52GC | $999.99 | 4.5 | 815 | Exact model term. The $989.99 "Complete" listings (`B0F3J51GW5`, `B0F3HZFZBL`) are a bundle, not the base machine. |
| ECOVACS DEEBOT T90 PRO Omni | B0GJ5S4V78 | $599.00 | 4.4 | 395 | Top organic result for `ecovacs deebot`, and the current PRO Omni. T50 MAX PRO, T80S and X12 are the rest of the family. |
| Shark PowerDetect Self-Empty AV2820S | B0CDJFHM4J | $549.99 | 4.4 | 3,648 | Top organic result for `shark powerdetect`, and the largest review pool in that family. **Vacuum only — it does not mop.** |
| Shark Matrix Plus UR2650WS | B0FDX7GFQX | $279.99 | 4.6 | 35,917 | Largest review pool of anything in the set by an order of magnitude. The AI Ultra models (`B09H8CWFNK`, `B09T4YZGQR`) are a different line. |
| iRobot Roomba Max 705 Vacuum | B0DWG3C3ZF | $499.00 | 4.3 | 741 | Exact model term. `B0DWG15XKQ` at $799 is the **Combo** — a different machine with a mop and an AutoWash dock, not a variant of this one. **This SKU does not mop.** |

Prices and ratings above are from each ASIN's own listing on 10 August 2026,
not from the search result, and the two disagree in places: the search row for
the X10 Pro Omni reports 4.3, its own page reports 4.6. The listing read is the
one recorded, and every figure carries that date.

## Where the scoring attributes came from

`environments` and `cleans` are the scoring vocabulary, not description — a
capability asserted from memory that the machine does not have makes it win a
comparison it should lose. Every value in migration 0013 traces to a published
line:

- **The pinned listing's own title.** Amazon titles in this category carry the
  feature claims verbatim: "12 mm Auto-Lift", "Self-Emptying", "AI Obstacle
  Avoidance", "Carpet Detection", "360° LiDAR + 3D Object Detection". Where a
  title claims it, the attribute is set.
- **The maker's own page**, read directly for four machines where the title was
  thin: roborock S8 Max Ultra (20mm mop lift, Reactive 3D Obstacle Avoidance,
  auto-empty), roborock Saros 10 (mop auto-detaches, chassis lifts 10mm on
  high-pile, ReactiveAI 3.0), ECOVACS DEEBOT T90 PRO Omni (AIVI 3D 4.0, 15mm
  mop lift, auto-empty).

**Three maker pages could not be read** — dreame's X40 Ultra and X50 Ultra
pages and eufy's Omni S1 Pro page each returned 404 or truncated content to a
direct fetch on 10 August. Those three are described from their Amazon listing
titles alone, and where a title is silent the attribute is **left off rather
than assumed**. The dreame X40 Ultra therefore carries no `obstacle_avoidance`
and the X50 Ultra no `mop_lifting`, not because they lack them but because
nothing we read says they have them. Each review says so in as many words.

Deep pile is claimed by exactly one machine in the set. Only the Saros 10's
maker states a high-pile behaviour — "elevates the chassis up to 0.39 inches
(10mm) on high-pile carpets" plus a mop that "automatically detaches in modes
where mopping is not needed". Everything else is hard floor and ordinary
carpet. That is not a gap in the research; it is the honest state of the
category, and it means a reader who answers "deep or shag pile throughout" gets
one answer and a clear reason.

## All eleven enter as OFFER_SETUP_PENDING

Identity is confirmed and these products belong in the hub, the catalogue and
the matcher. The commercial wiring is not built: no `offers` row, no
`redirect_links` row, and neither may be added without moving the product out
of that state. `stock_status` is left NULL throughout — the product engine
returned no availability field for any of the eleven, and a product in this
state makes no stock claim anywhere.

Publishing a page and sending a buyer somewhere are different promises.
