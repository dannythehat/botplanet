# Owner-created product artwork — rights record

Supplied by Danny on 3 August 2026. Optimised from PNG masters to WebP; no
crop, no recolour, no removal of in-image text or branding.

Every file carries approved in-image BotPlanet branding and headline text.
Under the blueprint this is deliberate editorial media, not a placeholder:
it must not be cropped out, replaced by a manufacturer packshot, or discarded
because it contains text.

| File | Product | Master | Stored |
|---|---|---|---|
| `dolphin-nautilus-cc-plus.webp` | Dolphin Nautilus CC Plus Wi-Fi | 1122×1402 PNG, 1.5 MB | 1122×1402, 103 KB |
| `polaris-freedom.webp` | Polaris FREEDOM | 1254×1254 PNG, 1.9 MB | 1200×1200, 159 KB |
| `betta-se-plus.webp` | Betta SE Plus | 1254×1254 PNG, 2.0 MB | 1200×1200, 161 KB |
| `dolphin-proteus-dx4-plus.webp` | Dolphin Proteus DX4 Plus | 1254×1254 PNG, 2.3 MB | 1200×1200, 196 KB |
| `aiper-scuba-v3-ai-vision.webp` | Aiper Scuba V3 AI Vision | 1254×1254 PNG, 2.0 MB | 1200×1200, 171 KB |

## Rights status

- **Creator:** Danny (owner-created BotPlanet artwork).
- **Rights:** owned outright, cleared for use across BotPlanet.
- **Not Amazon Program Content.** These are BotPlanet's own creatives. They are
  not served from Amazon's hosts and are not covered by — nor restricted by —
  the Associates rule that Amazon-supplied imagery must be displayed unaltered
  from Amazon's servers. Keep the two categories separate: any image taken from
  a product listing is Amazon Program Content and follows that rule instead.
- **Supports tested claims:** no. These are brand creatives. They must not be
  used as evidence for a performance claim, and any specification stated in the
  artwork still needs its own evidence record before it appears as body copy.

## Where these are used

Registered in `apps/web/src/content/media/assets.ts` as `art-<slug>` and resolved
through `resolveImage()` like every other asset, so a withdrawal recorded there
empties every card at once. They render on the robotic pool cleaners category
page product grid, full-bleed at their own aspect ratio — the classification
chip moves into the card body rather than sitting on top of the artwork, and no
crop is applied.

They are **not** eligible for `Product` structured data: a schema consumer reads
that field as a photograph of the product, and these carry BotPlanet branding
and headline text set into the image.

Two of the five — **Dolphin Proteus DX4 Plus** and **Aiper Scuba V3 AI Vision** —
have verification records and live D1 product rows but no editorial record yet.
Their identity is owner-confirmed rather than source-verified, and Notion still
lists both as pending exact ASIN and redirect verification, so neither may ship
a working affiliate button until that is closed out.

Danny has said more detailed photography will follow for the individual review
pages. These five are the lead category-page visuals.
