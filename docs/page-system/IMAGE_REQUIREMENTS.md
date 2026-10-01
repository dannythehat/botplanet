# Image requirements

Sizes live in `apps/web/src/page-system/rules.ts`. The page test fails on any other size.

| Slot | Size | Required | Notes |
|---|---|---|---|
| Desktop hero | 1672 x 941 (16:9), WebP | Yes | Made with `npm run page:hero`. Title set on the picture. |
| Mobile hero | 900 x 1125 (4:5), WebP | Optional, strongly preferred | Same command with `--mobile-out`. Falls back to the desktop hero. |
| Product image | One per product, in the media registry as a `product_hero` | Yes, one per product | A clean photograph. Shown in tables, cards and the glance table. |
| Figure in a review | Any, WebP | Optional | Placed under a named heading in `content/reviews.ts`. |
| Social / Open Graph | The desktop hero | Yes | Automatic. |

Every image needs:

1. A record in `apps/web/src/content/media/assets.ts` with alt text, dimensions, checksum and a note
   saying where it came from.
2. Alt text that describes the picture in a full sentence. Where a picture carries a maker's claim
   in its pixels, the alt text says it is the maker's claim.
3. Derivatives, from `npm run gen:derivatives`, and `npm run gen:media-mapping`.
4. No raw PNG or JPEG over 200 KB anywhere in the source (a test enforces this).

Until a picture exists the site shows a placeholder, never a broken image: the generic silhouette for a product, and a BotPlanet panel at the hero's exact shape, carrying the page's title, for a hero. A page showing any placeholder stays noindex. `npm run page:images -- <slug>` lists what is still needed.

Pictures a person supplies are published, with any inaccuracy corrected in the caption.

## Never overwrite an image under the same filename

Images are served with a seven-day cache keyed on the filename. If you replace a picture and keep its
name, anyone who has seen the page keeps seeing the old one, and so does Cloudflare. The solar
skimmers hero was replaced three times under one name and the owner kept seeing the first version.

When a picture changes, give the new file a new name (`-v2`, `-v3`) and point the page file, the media
record and `scripts/gen-derivatives.mjs` at it. Delete the old file and its derivatives.
