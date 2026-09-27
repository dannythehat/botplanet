import type { APIRoute } from "astro";
import { and, eq } from "drizzle-orm";
import { getDb, schema } from "../lib/db";
import { SITE } from "../lib/site";
import { productPath, productInSitemap, sitemapRoutes } from "../content/routes";
import { REVIEWS } from "../content/reviews";
import { comparePageIsSubstantive } from "../content/compare-page";

/**
 * XML sitemap generated from the route registry plus published products.
 *
 * Excluded by construction: non-indexable routes, coming-soon placeholders,
 * hidden routes, /go, /admin, /api, search and saved, every redirect source,
 * and any query-parameter variant. Only canonical production URLs appear.
 */
export const GET: APIRoute = async ({ locals }) => {
  const db = getDb(locals);
  const base = `https://${SITE.domain}`;

  /* Every live category, not just pool.
     This query named "cat-pool-cleaners" outright until 5 August 2026, and
     productPath() defaults to the launch category — so a second category's
     products were invisible to crawlers AND would have been emitted under the
     pool URL if they had not been. Joining categories and passing each
     product's own slug fixes both halves. */
  const rows = await db
    .select({ slug: schema.products.slug, categorySlug: schema.categories.slug })
    .from(schema.products)
    .innerJoin(schema.categories, eq(schema.products.categoryId, schema.categories.id))
    .where(eq(schema.products.status, "published"));

  /* How many published machines each category actually holds, which is what
     decides whether its comparison page is a page. */
  const published = new Map<string, number>();
  for (const r of rows) published.set(r.categorySlug, (published.get(r.categorySlug) ?? 0) + 1);

  const paths = [
    /* December 2026 challenge page. It is a static, indexable buying guide
       built from live keyword research and intentionally added here so it is
       declared to crawlers on first publish even before the wider route
       registry is consolidated in the next registry maintenance pass. */
    "/guides/robot-dog-toys/",
    /* THE COMPARE ROUTES ARE FILTERED AGAINST THE CATALOGUE, not against their
       own registry flags. A route file cannot know how many products are
       published, so four live-but-empty categories were listing a comparison
       page of about sixty words — a table with nothing in it. The same rule
       runs on the page itself, which noindexes under the same condition, so the
       two never disagree. Found 8 August 2026 in the sitewide SEO pass. */
    ...sitemapRoutes()
      .filter(
        (r) =>
          r.section !== "compare" ||
          !r.category ||
          comparePageIsSubstantive(r.category, published.get(r.category) ?? 0),
      )
      .map((r) => r.path),
    /* A product page only exists where its category page does. A row for a
       category still marked coming_soon would be a URL nobody can navigate to. */
    /* AND ONLY WHERE THE URL IS STILL ITS OWN PAGE. A retired slug is still
       `published` in D1 — the row keeps its offers and its evidence — but the
       URL now 301s to a parent. Listing a redirect in a sitemap asks Google to
       crawl a URL in order to be told to go somewhere else, which spends
       crawl budget to gain nothing. Found on 7 August 2026, when merging three
       WINBOTs left all three in the sitemap.

       MERGED_REVIEWS is here for the same reason and is not the same case. A
       retired slug is a record that changed model; a merged one is a product
       that kept everything except its page, because a sibling's review now
       covers it. Either way the URL answers a 301, and either way listing it
       asks a crawler to spend a fetch to be told to go elsewhere. */
    /* THE RULE MOVED TO content/routes.ts ON 11 AUGUST 2026, and moving it
       fixed it. Inline here it read `liveSlugs.has(categorySlug)`, which
       silently dropped every product in a HIDDEN category — a reserved slug
       with no hub but with real, indexable reviews beneath it. Those pages
       indexed and were never declared. See productInSitemap for the whole
       rule, including why coming_soon still admits nothing. */
    ...rows
      .filter((r) =>
        productInSitemap({
          slug: r.slug,
          categorySlug: r.categorySlug,
          hasPublishedReview: Boolean(REVIEWS[r.slug]),
        }),
      )
      .map((r) => productPath(r.slug, r.categorySlug)),
  ];

  // Defensive: the registry is tested, but never emit a duplicate.
  const unique = [...new Set(paths)].sort();

  /**
   * lastmod, for the pages that actually have a defensible date.
   *
   * A review carries `lastReviewed` — a real editorial date somebody stands
   * behind — so it gets one. Everything else does not: emitting today's date
   * for every URL on every crawl is the commonest sitemap mistake there is,
   * it tells a crawler the whole site changed daily, and after a few passes of
   * finding nothing changed it stops being believed for the pages where the
   * date IS true. So an undated page ships no lastmod at all, which is the
   * honest signal rather than a weak one.
   */
  /* PASS THE REVIEW'S OWN CATEGORY. productPath() defaults to the launch
     category, so this built every key as a pool URL — and every non-pool
     review's lastmod was computed against a path that does not exist and
     silently dropped. Fifty-two of sixty-three reviews were shipping a real
     editorial date to nobody. Same defaulting mistake as the products query
     above, found the same way: by checking the output rather than the code. */
  const reviewed = new Map(
    Object.values(REVIEWS).map((r) => [productPath(r.slug, r.categorySlug), r.lastReviewed]),
  );

  /**
   * Image entries, added 11 August 2026 with the artwork drop that gave every
   * review a picture for the first time.
   *
   * WHY DECLARE THEM AT ALL. Google finds an <img> by rendering the page, and
   * rendering is the part of crawling it does last and least. The image
   * extension states the images belonging to a URL in the same fetch that
   * announces the URL, which is the difference between artwork being indexed
   * in weeks and being indexed eventually. On a site whose pictures are its
   * own work rather than the manufacturer's stock shots, that is worth having.
   *
   * NO <image:caption> AND NO <image:title>. Both are optional, both are
   * ignored by Google today, and the alt text they would duplicate is already
   * on the page where it does the work — for a screen reader. A field emitted
   * in two places is a field that can disagree with itself later.
   *
   * The lead image first, then the figures in the order they appear in the
   * article, so the file a reader sees first is the file declared first.
   */
  const images = new Map<string, string[]>();
  for (const r of Object.values(REVIEWS)) {
    const srcs = [r.image?.src, ...(r.figures ?? []).map((f) => f.src)].filter(
      (src): src is string => Boolean(src),
    );
    if (srcs.length) images.set(productPath(r.slug, r.categorySlug), [...new Set(srcs)]);
  }

  const xml =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"` +
    ` xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n` +
    unique
      .map((p) => {
        const mod = reviewed.get(p);
        const pics = (images.get(p) ?? [])
          .map((src) => `<image:image><image:loc>${base}${src}</image:loc></image:image>`)
          .join("");
        return `  <url><loc>${base}${p}</loc>${mod ? `<lastmod>${mod}</lastmod>` : ""}${pics}</url>`;
      })
      .join("\n") +
    `\n</urlset>\n`;

  return new Response(xml, {
    headers: { "content-type": "application/xml; charset=utf-8", "cache-control": "public, max-age=3600" },
  });
};
