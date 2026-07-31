# Media rights model

**Status:** Job 9 (image library and rights-complete visual inventory)
**Lawful-source check:** 2026-07-31
**Source of truth:** `apps/web/src/content/media/` — this document explains it; the files govern.

---

## 1. The position on product photography

**No third-party product photograph is held.** That is a finding, not an omission.

- The **Amazon Associates** route is licensed and the account (`botplanet-20`) is live, but obtaining Program
  Content lawfully requires Creators API credentials that the build environment does not hold. The programme
  forbids scraping, constructing image URLs, and caching Program Content without express permission — so there is
  no lawful way to fetch an image here.
- **No launch-brand manufacturer publishes a press kit granting third-party image use.** Six brands were checked;
  the results are recorded in `MEDIA_SOURCE_CHECKS` with the URL and outcome for each.
- Every remaining option — scraping, guessing URLs, taking an image from search results, substituting a similar
  model — is prohibited.

Until that changes, every product renders an original BotPlanet **branded placeholder** that names the exact model
and depicts nothing.

## 2. Source hierarchy

| Rank | Tier | Used today |
| --- | --- | --- |
| 1 | `manufacturer_media_library` | No — none found |
| 2 | `manufacturer_page_permitted` | No — no permitted method |
| 3 | `affiliate_api` | No — credential required |
| 4 | `affiliate_media_feed` | No — Aiper CJ application not approved |
| 5 | `original_botplanet` | Yes — 8 assets |
| 6 | `branded_placeholder` | Yes — 10 assets |

An asset records its tier, and `resolveImage()` always prefers the better one. When a licensed image lands, it
outranks the placeholder automatically — no template changes.

## 3. What every asset carries

Asset ID · product ID or stated purpose · **exact model** · type · tier · provider · source reference ·
**credential secret NAME only** · acquisition method · rights basis · allowed markets · allowed placements ·
allowed transformations · storage mode · remote-serving requirement · attribution requirement · retrieved date ·
last-checked date · expiry rule · withdrawal status, date and reason · checksum · intrinsic dimensions ·
alt text and its state · schema eligibility with a reason · reviewer status · whether it depicts a real product.

No credential, token or signed URL is ever stored. A validation rule scans every field against
`CREDENTIAL_PATTERNS` and fails the build if one appears.

## 4. Exact-model matching

The single biggest risk in a product-image library is attaching the right-looking image to the wrong model. Every
product-depicting asset must name the exact model **from the Job 8 verification record**, and a validator compares
the two. The specific traps carried forward from Job 8:

| Product | Trap |
| --- | --- |
| Dolphin Premier | Candidate under review: no accepted manufacturer page, no accepted manual, no reliable model number. A generic Dolphin image is not acceptable. Held on identity, not only on credentials. |
| Aiper Scuba S1 | Unresolved pool-type conflict; S1 and S1 Pro have no published SKUs. Never mix with Scuba X1. |
| Aiper Seagull SE | More than one SE revision, no model number. Never substitute Seagull Pro or Plus. |
| Betta SE Plus | The stored record previously cited the Betta SE. Betta SE media must never be imported. |
| Polaris FREEDOM | Shares the EB37 chassis with FREEDOM Plus. Match on the FFREEDOM SKU, not family resemblance. |
| Beatbot AquaSense 2 Ultra | Five AquaSense generations. Only Ultra imagery may be attached. |
| Dolphin Nautilus CC Plus | Several near-identical CC variants. Only part 99996409-PCI. |
| Dolphin E10 | US part number is 99996133-US; the cited page is the global store. |

## 5. Central withdrawal control

One switch, honoured everywhere:

```
asset.withdrawal = "withdrawn"  →  isRenderable() false
                                →  resolveImage() skips it and returns the next-best asset
                                →  schemaImagesFor() drops it
                                →  Open Graph references drop it
                                →  the rights record survives for audit
```

No template is edited. No broken image can appear: when nothing is renderable the render path draws the owned
silhouette instead of emitting a dead `src`. A withdrawal must record a reason and a date, or validation fails.

## 6. Nine readiness states

Not one `imageReady` flag:

`rightsRecordComplete` · `exactModelConfirmed` · `heroReady` · `supportingImagesReady` ·
`responsiveVariantsReady` · `altTextApproved` · `schemaEligible` · `publicRenderingSafe` ·
`fullProductMediaSetReady`

Today all ten products are **rights-complete, exact-model-confirmed, alt-text-approved and public-render safe**,
and **none** is hero-ready, schema-eligible or media-complete. Both halves of that sentence are true and the
states keep them separable.

## 7. Responsive derivatives

Zero derivatives exist, and that is correct: the only locally stored product assets are vector placeholders, which
scale to every rendered width without a raster copy. Generating rasters of an SVG would add bytes and a cache entry
for no benefit, so `responsiveVariantsReady` treats a vector asset as satisfied.

When raster images arrive, derivatives are validated for parent existence, no upscaling, and aspect-ratio
preservation unless an approved crop is declared. A `srcset` is emitted only when real derivatives exist — never
invented widths.

## 8. Structured data and social

| Slot | Placeholder | Original artwork | Brand OG card |
| --- | --- | --- | --- |
| Product image | Never | Never | Never |
| ImageObject | Never | Yes | Yes |
| Article image | Never | Yes | Yes |
| Open Graph | Never | Yes | Yes |
| Twitter | Never | Yes | Yes |

`schemaImagesFor()` returns an **empty array** for all ten products. An absent image field is honest; a placeholder
in Product schema tells a machine consumer it is a photograph of the product, which it is not.

## 9. Alt text

Every renderable asset is `approved` or `decorative`; an asset whose alt text is `missing` or `rejected` is not
renderable at all. Decorative assets carry empty alt text and are hidden from assistive technology rather than
described. No illustration is called a photograph. Placeholder alt text says what the reader actually sees:

> BotPlanet placeholder panel naming the *&lt;exact model&gt;*. Product photography is not yet available under a
> licence we hold.

## 10. Regenerating the placeholders

```
node scripts/gen-placeholders.mjs
```

Writes `apps/web/public/media/placeholder/<slug>.svg` and `scripts/placeholder-manifest.json`, which supplies the
checksums and dimensions the asset records use. A hand-edited SVG that is not regenerated fails the checksum test
rather than shipping with a stale rights record.
