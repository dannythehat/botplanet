# BotPlanet: instructions for Claude

Read `docs/page-system/BOTPLANET_PAGE_SYSTEM.md` before making or changing any page. It is the one
source of rules, and `AGENTS.md` points to the same file.

## Always

* Make pages as page files (`apps/web/src/content/pages/`), through `npm run page:new`, `page:check`
  and `page:publish`. Do not hand-build a layout. If the template cannot do what a page needs, change
  the template and the tests, not the page.
* Run `npm test` before committing. The page checks are the standard, not advice.
* Write plain English. The owner has rejected stiff, database-sounding wording (see `BANNED_PHRASES`).
* Never invent a price, rating, spec or warranty. Say "Not stated".
* Attribute a maker's claims to the maker, in the text and in alt text.
* Every new page gets inbound links from older pages: `RETROFITTED_INBOUND` in `content/internal-links.ts`.
* Publish every picture the owner supplies. Correct any inaccuracy in the caption instead of withholding it.
* Credentials live outside the repository. Never write one into a file or a commit.
* Keep replies to the owner short. Do not raise image rights or licensing; the owner has closed that topic.
* Do not open a pull request unless asked. Work on the branch you were given, then merge to `main`
  when asked, which deploys.

## Useful commands

`npm test` · `npm run page:new -- best-of <slug>` · `npm run page:check -- <file>` ·
`npm run page:publish -- <slug>` · `npm run page:hero` (options are in the header of `scripts/page-hero.mjs`) ·
`npm run gen:derivatives` · `npm run gen:media-mapping` · `npm run audit:links|seo|weight`
