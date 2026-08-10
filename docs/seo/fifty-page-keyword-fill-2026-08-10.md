# Fifty-page keyword fill — 10 August 2026

Run by `scripts/audit-seo.mjs` finding fifty indexable pages with no row in
the keyword register. Source: DataForSEO Google Ads live search volume and
DataForSEO Labs bulk keyword difficulty, location 2840 (United States),
language en. **Total spend $0.48.**

419 constructed candidates measured, 4,980 further terms discovered from the
seeds, plus two top-up batches for pages the first pass missed.

A free Google/Amazon Suggest harvest was attempted first and abandoned: it
halted on Amazon rate limiting after 103 of 1,715 planned queries and covered
one seed of thirty-five. It also returns no volumes, and the register records
a volume for every term it holds.

## What each page got

| Page | Primary | Volume | KD | In copy |
|---|---|---:|---:|---|
| `/robots/self-cleaning-litter-boxes/litter-robot-4/` | litter-robot 4 | 74000 | 15 | yes |
| `/robots/self-cleaning-litter-boxes/petkit-purobot-max-pro-2/` | petkit purobot max pro 2 | 390 | 0 | yes |
| `/robots/self-cleaning-litter-boxes/petsafe-scoopfree-crystal-pro/` | petsafe scoopfree crystal pro | 480 | 0 | yes |
| `/robots/self-cleaning-litter-boxes/casa-leo-loo-too/` | leos loo too | 1000 | 0 | yes |
| `/robots/robotic-lawn-mowers/segway-navimow-i110n/` | segway navimow i110n | 480 | 12 | yes |
| `/robots/robotic-lawn-mowers/eufy-e15/` | eufy robot lawn mower e15 | 390 | 11 | yes |
| `/robots/robotic-lawn-mowers/mammotion-luba-3-awd-1500h/` | mammotion luba 3 awd 1500h | 30 | 0 | yes |
| `/robots/robotic-lawn-mowers/mammotion-luba-3-awd-3000h/` | mammotion luba 3 awd 3000h | 40 | 0 | yes |
| `/robots/robotic-lawn-mowers/husqvarna-automower-410iq/` | husqvarna automower 410iq | 110 | 0 | yes |
| `/robots/robotic-lawn-mowers/worx-landroid-vision-wr320/` | worx landroid vision | 260 | 0 | yes |
| `/robots/robotic-lawn-mowers/dreame-a3-awd-1000/` | dreame a3 awd | 170 | 0 | yes |
| `/robots/window-cleaning-robots/ecovacs-winbot-mini/` | winbot mini | 260 | 5 | yes |
| `/robots/window-cleaning-robots/ecovacs-winbot-w3-omni/` | winbot w3 omni | 110 | 0 | yes |
| `/robots/window-cleaning-robots/ecovacs-winbot-w2s/` | winbot w2s | 70 | 0 | yes |
| `/robots/window-cleaning-robots/hobot-298/` | hobot 298 | 50 | 0 | yes |
| `/robots/window-cleaning-robots/hobot-2s/` | hobot 2s | 40 | 0 | yes |
| `/robots/window-cleaning-robots/hutt-s55-pro/` | hutt s55 pro | 10 | 0 | yes |
| `/robots/window-cleaning-robots/mamibot-w120-dp/` | mamibot w120-dp | 10 | 0 | yes |
| `/robots/window-cleaning-robots/cop-rose-x5s/` | cop rose x5s | 0 | 0 | yes |
| `/robots/educational-coding-robots/sphero-bolt/` | sphero bolt | 4400 | 32 | yes |
| `/robots/educational-coding-robots/sphero-mini/` | sphero mini | 2900 | 15 | yes |
| `/robots/educational-coding-robots/sphero-indi/` | sphero indi | 1600 | 1 | yes |
| `/robots/educational-coding-robots/ozobot-evo/` | ozobot evo | 1300 | 5 | yes |
| `/robots/educational-coding-robots/makeblock-mbot/` | makeblock mbot | 880 | 29 | yes |
| `/robots/pet-camera-robots/enabot-ebo-air-2/` | ebo air 2 | 2400 | 0 | yes |
| `/robots/pet-camera-robots/enabot-ebo-se/` | ebo se | 390 | 0 | yes |
| `/robots/pet-camera-robots/enabot-rola-petpal/` | rola petpal | 140 | 0 | yes |
| `/robots/companion-robots/joy-for-all-companion-pets/` | joy for all companion pet | 1900 | 0 | yes |
| `/compare/robotic-lawn-mowers/` | compare robotic lawn mowers | 90 | 39 | yes |
| `/compare/self-cleaning-litter-boxes/` | compare self cleaning litter boxes | 30 | 37 | yes |
| `/compare/window-cleaning-robots/` | compare window cleaning robots | 0 | 0 | yes |
| `/compare/companion-robots/` | compare companion robots | 0 | 0 | yes |
| `/compare/pet-camera-robots/` | compare pet camera robots | 0 | 0 | yes |
| `/compare/educational-coding-robots/` | coding robots for kids | 0 | 0 | yes |
| `/compare/eilik-vs-emo/` | eilik vs emo | 20 | 0 | yes |
| `/` | home robots | 6600 | 30 | **no** |
| `/best-robots/` | best robots | 2400 | 17 | yes |
| `/robots/` | robot categories | 20 | 0 | yes |
| `/guides/` | robot guides | 320 | 28 | yes |
| `/compare/` | compare robots | 10 | 0 | yes |
| `/botmatch/` | find your robot | 0 | 0 | yes |
| `/guides/robotic-pool-cleaners/` | robotic pool cleaner guides | 0 | 0 | yes |
| `/about/` | botplanet | 10 | 0 | yes |
| `/affiliate-disclosure/` | affiliate disclosure | 170 | 19 | yes |
| `/editorial-policy/` | editorial policy | 70 | 23 | yes |
| `/review-methodology/` | testing methodology | 390 | 0 | yes |
| `/how-botmatch-works/` | how botmatch works | 0 | 0 | yes |
| `/contact/` | contact botplanet | 0 | 0 | yes |
| `/privacy/` | privacy | 110000 | 63 | yes |
| `/terms/` | terms | 74000 | 20 | yes |

## Rules applied

- **Every primary is a term the page already contains**, with one exception:
  the homepage, whose target `home robots` (6,600/mo, KD 30) appears nowhere
  on it. Recorded with `mustAppear: false` rather than retargeting the front
  page at something weaker to keep a test green.
- **Comparison pages cede their category head term to the hub.** `robot lawn
  mower` is 74,000/mo and belongs to `/robots/robotic-lawn-mowers/`; a table
  chasing it would compete with its own category page.
- **A secondary is `mustAppear: false` unless the copy actually says it.**
  That flag is an assertion, not an ambition.
- **`/privacy/` and `/terms/` carry the volumes of the bare English words.**
  110,000 and 74,000 are real figures and are not an opportunity. The rows
  exist so the pages are not mistaken for unassigned ones.

## Two conflicts the existing tests caught

`page-plan.ts` holds keyword assignments too, and `page-plan.test.ts` fails
when the two files disagree. It caught both:

- `/robots/window-cleaning-robots/mamibot-w120-dp/` — the plan named
  `mamibot w120` on 5 August. It measures higher than `mamibot w120-dp`
  (20 against 10) and the H1 contains it. The plan was right.
- `/compare/educational-coding-robots/` — the plan generated its term from
  the slug, giving `compare educational coding robots`, a phrase that appears
  nowhere on a page headed "Compare coding robots for kids". The generator now
  takes an override and a measured volume.
