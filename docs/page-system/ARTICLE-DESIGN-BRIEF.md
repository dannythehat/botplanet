# Article design brief (for designing the article builder with ChatGPT first)

Purpose: the owner designs the look of the BotPlanet article page and its images with ChatGPT, then brings the
result back here and it is built into the page system, so every article matches. This file is the brief that
goes to ChatGPT. Nothing here is built yet.

## The brand (fixed, do not redesign)
* Dark site. Page `#07070a`, panels `#0e0e13`, nested `#14141a`, white blocks `#f7f7f9`.
* Text `#f6f6f8` / `#b4b4c0` / `#8a8a97`. Accent is a cool silver `#cdd3da`; blue highlight `#4d9bff`;
  positive `#5fde96`; warning `#e8b44c`.
* Fonts: Space Grotesk for headings, the system sans for body, a monospace for small labels.
* Frosted-glass panels, numbered section chips, thin glowing dividers, amber and blue buy buttons.
* Logo files in `apps/web/public/logo/`: `botplanet-logo-white.png` (1017x1017, white on transparent, for
  images), `botplanet-mark.png` (1001x508 wide mark), `botplanet-chrome.png` (760x229 wordmark).

## What the article page should be: a proper editorial magazine
Sections, top to bottom:
1. **Masthead strip:** category kicker (e.g. HUMANOIDS · NEWS), date, reading time, author.
2. **Hero:** full-width picture, the title set on it, the BotPlanet logo on the picture.
3. **Standfirst:** two sentences under the hero.
4. **The short version:** a box of three bullets.
5. **Body sections:** numbered, in frosted panels, with pull quotes, inline pictures and a callout in the
   style of "BotPlanet takeaway".
6. **Can you buy it?:** a clear box (orderable now, pre-order, or not for sale) with a price band and date.
7. **Spec card:** the robot's key facts at a glance, a picture, no gaps shown.
8. **Where to buy:** product cards with a picture and a buy button. Amazon, CJ, Awin or the maker's own link.
9. **Our take:** a short verdict.
10. **Sources:** every source named and linked, with the date read.
11. **Keep reading:** related stories, plus two or three cards linking to our money pages.
12. **Share and follow bar.**

## Pictures every article needs
| Slot | Size | Notes |
|---|---|---|
| Hero, desktop | 1672 x 941 (16:9) | title set on it, logo bottom right |
| Hero, phone | 900 x 1125 (4:5) | same scene, recomposed |
| Inline | 1200 x 800 (3:2), up to three | no text in the picture |
| Social square | 1080 x 1080 | title and logo |
| Social vertical | 1080 x 1920 | title and logo, for Shorts, Reels, Pinterest |
| Open Graph | 1200 x 630 | title and logo |

## Rules for the AI images
* The AI draws the scene or the robot. Our code adds the title, the logo and the crop. Never ask the AI to
  write words.
* The BotPlanet logo goes on every image, in the same corner and at the same size.
* Where we already have a picture of the robot, it is used as a reference so the machine looks right.
* No invented specs, prices or claims in a picture. No people's faces.
* One consistent style across the whole site (to be set by the style guide ChatGPT produces).

## What to ask ChatGPT to produce
1. A magazine layout for the article page, desktop and phone, with the sections above.
2. A style guide for the images: mood, lighting, colour, composition, how the logo and title sit.
3. Prompt templates for each picture slot that the builder can fill in per story.
4. Three example articles laid out (news brief, analysis, evergreen explainer).
