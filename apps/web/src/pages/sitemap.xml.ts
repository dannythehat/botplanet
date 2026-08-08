import type { APIRoute } from "astro";
import { and, eq } from "drizzle-orm";
import { getDb, schema } from "../lib/db";
import { SITE } from "../lib/site";
import { productPath, sitemapRoutes } from "../content/routes";
import { liveCategories } from "../content/nav";
import { RETIRED_SLUGS } from "../content/product-names";
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

  const liveSlugs = new Set(liveCategories().map((c) => c.slug));

  /* How many published machines each category actually holds, which is what
     decides whether its comparison page is a page. */
  const published = new Map<string, number>();
  for (const r of rows) published.set(r.categorySlug, (published.get(r.categorySlug) ?? 0) + 1);

  const paths = [
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
       WINBOTs left all three in the sitemap. */
    ...rows
      .filter((r) => liveSlugs.has(r.categorySlug) && !(r.slug in RETIRED_SLUGS))
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
  const reviewed = new Map(
    Object.values(REVIEWS).map((r) => [productPath(r.slug), r.lastReviewed]),
  );

  const xml =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    unique
      .map((p) => {
        const mod = reviewed.get(p);
        return `  <url><loc>${base}${p}</loc>${mod ? `<lastmod>${mod}</lastmod>` : ""}</url>`;
      })
      .join("\n") +
    `\n</urlset>\n`;

  return new Response(xml, {
    headers: { "content-type": "application/xml; charset=utf-8", "cache-control": "public, max-age=3600" },
  });
};
