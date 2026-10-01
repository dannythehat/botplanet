# BotPlanet page system

One set of rules for how a BotPlanet page is made. Anyone writing a page, a person or an AI
assistant, reads this first and follows it. The rules are enforced by tests, so a page that breaks
them does not ship.

## The idea

A page is a **page file**: one structured JSON document naming the page's title, keywords, hero,
picks, products, facts, FAQ and related pages. The site turns that file into the finished page
using the same approved components every time. Nobody hand-builds a layout.

Where things live:

| What | Where |
|---|---|
| The page itself | `apps/web/src/content/pages/<slug>.page.json` |
| The long-form writing | `apps/web/src/articles/<slug>.md` |
| The rules (limits, banned phrases) | `apps/web/src/page-system/rules.ts` |
| The schema (what a page file may contain) | `apps/web/src/page-system/schema.ts`, generated to `docs/page-system/PAGE_SCHEMA.json` |
| The page template | `apps/web/src/components/BestOfPage.astro` |
| The checks | `apps/web/test/page-system.test.ts` |
| The gold standard to copy | `content/pages/solar-powered-skimmers.page.json` |

## Page types

| Type | Status |
|---|---|
| Best-of / comparison ("Best X") | **Built.** Gold standard: the solar skimmers page. |
| Product review | Not yet a page file. Reviews still live in `content/reviews.ts`. Next to build. |
| Category hub | Not yet. |
| Product versus product | Not yet. |
| Buying guide | Not yet. |
| How-to article | Not yet. |
| Robot database entry | Not yet. |

Each of the others will be added the same way: a schema, a template component, a route stub,
and checks in `page-system.test.ts`.

## Making a best-of page, step by step

1. `npm run page:new -- best-of <slug>` creates a draft page file and a prose stub in
   `apps/web/src/content/pages-drafts/`. The site never loads drafts, so a half-written page cannot
   break the build.
2. Make the hero: `npm run page:hero -- --src <picture> --title "Short Title" --kicker "BEST OF · POOL" --out apps/web/public/media/editorial/<slug>.webp --mobile-out apps/web/public/media/editorial/<slug>-mobile.webp --focus-x 0.6`.
   It produces the two required sizes. Then add a record for each file in
   `content/media/assets.ts`, and run `npm run gen:derivatives` and `npm run gen:media-mapping`.
3. Fill in the page file. Every field marked TODO has to be replaced.
4. Write the prose. Plain English, at least 700 words, at least five links to other BotPlanet pages,
   no tables (the glance table in the page file is the table).
5. `npm run page:check -- <draft>` lists every problem at once. Fix them all.
6. `npm run page:publish -- <slug>` moves the files into the site and writes the route stub.
7. Do the four registrations the command prints: `content/routes.ts`, the keyword register and
   page plan, and the inbound links from older pages (`RETROFITTED_INBOUND`).
8. `npm test`. Anything still missing fails with a message that says what to add.

## What the template does for every best-of page

Hero, with a portrait version on phones. A row of Amazon buttons straight under the hero. The
contents block ahead of the picks. The ranked picks, each saying who should buy something else. A
full-width "at a glance" table with pictures and buy buttons, stacking into cards on a phone. The
side-by-side comparison table. A "where to buy" strip. Related robots as cards with their own buy
button. The FAQ. Meta tags, Open Graph, canonical, breadcrumbs, and Article, ImageObject, ItemList
and FAQ schema, with Article dated from `dates.published`.

## Pictures that are not made yet

A page can be built before its pictures exist. The hero shows a correctly sized BotPlanet placeholder
carrying the page's short title, and a product with no picture shows the generic robot silhouette, so
nothing breaks and nothing jumps when the real picture arrives. In the page file set `hero.desktop` to
`null`.

* `npm run page:images -- <slug>` lists every picture the page needs, which are ready and which are
  pending, and the file name to give each one.
* Drop finished pictures in `docs/image-inbox/<slug>/` (made by `page:new`) and commit them to `main`.
* While any picture is pending the page must be noindex (`"index": false`). The test fails otherwise, so
  an unfinished page never reaches search results.

## What a page file cannot contain, and why

* **Prices.** A price typed into a file is stale from the day it is committed. Prices come from the
  price service with the date they were read.
* **Our own ratings or scores.** We do not publish stars we did not collect. Amazon's rating is shown on
  picks and in the glance table, but it comes from `content/commerce/amazon-ratings.ts` with the day it
  was read, is labelled as Amazon's, is never put in structured data, and expires after 120 days.
* **Affiliate links.** The page names a product. The buy button comes from that product's redirect key.
  A page cannot name a URL.

## Standing rules

* Never invent a price, a rating, a spec or a warranty. Where a figure is not known, leave it out.
  Do not print gap labels ("Not stated", "Not disclosed", "Not published") in a table, a card or a
  pros-and-cons list. A "What to know" box appears only when there is a real downside to put in it.
* A claim from a maker's listing is written as the maker's claim, in the text and in the picture's alt text.
* Plain English. See `BANNED_PHRASES` in `rules.ts`, and write the way you would say it aloud.
* Older pages must link to every new page. Add the entry to `RETROFITTED_INBOUND`.
* Never put credentials in the repository.

## Migrating the existing pages

About 120 pages exist. They keep working as they are. The plan is one template at a time, best-of
first (done), then review, hub, guide, versus: write the schema and component, move one page across
as the gold standard, move the rest, and delete the old per-page wiring as each type finishes.
