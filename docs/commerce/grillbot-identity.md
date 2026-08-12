# Grillbot — identity verification, 10 August 2026

Source: SerpAPI Amazon search `k=grillbot`, amazon.com, run 10 Aug 2026.
Brand field returned by Amazon: **Grillbot** on four of sixteen results.

| ASIN | Variant | Price | Rating | Reviews |
|---|---|---|---|---|
| B00HFDFSAC | Red, no case | $129.99 | 4.1 | 5,400 |
| B00HVP1O7U | Black, no case | $129.99 | 4.1 | 5,400 |
| B07WLZ2W28 | Red + case | $139.99 | 4.1 | 5,400 |
| B07WF944GK | Black + case | $139.99 | 4.1 | 5,400 |

All four share one review pool — a single variation family, colour plus a
bundle axis. Same shape as the litter and lawn listings: a bare /dp/ link
lands on whichever child Amazon prefers, so any pinned link needs
`?th=1&psc=1`.

Direct fetch of both base ASINs returned HTTP 200 with the ASIN still in the
final URL — no bounce to search — but no `id="productTitle"`, because Amazon
served a bot check. Identity therefore rests on the SerpAPI brand field and
title, which is dated third-party evidence rather than a page we read
ourselves. Recorded as such.

PINNED: **B00HFDFSAC**, Grillbot in red, $129.99, no case.
Reason: the base product rather than the +case bundle, and the higher-placed
of the two base colours in Amazon's own ordering.
