# SEO rules

Numbers live in `apps/web/src/page-system/rules.ts`. If this file and that one disagree, that one wins.

Every page must have:

* **SEO title** of 20 to 60 characters, unique across the site, starting with the thing searched for.
* **Meta description** of 70 to 160 characters, unique, saying what the reader gets.
* **One H1**, from the page file's `title`.
* **Primary and secondary keywords** in the page file that match the page's row in
  `content/seo/keyword-register.ts`. The register is the authority and the page test fails if they differ.
  Every keyword must actually appear in the page's text.
* **A clean path** that starts and ends with `/`, registered in `content/routes.ts`.
* **Canonical URL, Open Graph and Twitter tags**, produced by the layout from the route.
* **Breadcrumbs** from the route registry.
* **An Open Graph image**: the hero.
* **Alt text on every image**, from the media registry, written as a full sentence, with makers' claims
  attributed to the maker.
* **Internal links**: at least five in the prose, each to a real page, and at least one inbound link
  from an older page (`RETROFITTED_INBOUND`).
* **Schema**: BreadcrumbList always. Article when `dates.published` exists. ItemList for the picks.
  FAQPage for the FAQ. ImageObject per image. Product and Review only where the site has a current
  price or a real rating, which it gates automatically.
* **An affiliate disclosure** beside the buy buttons.
* **Index or no-index** set explicitly with `index`.
* **Published and reviewed dates**, with reviewed on or after published.

Run `npm run page:check -- <file>` for a list of everything missing, and `npm test` before publishing.
