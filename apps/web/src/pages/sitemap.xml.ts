import type { APIRoute } from "astro";
import { and, eq } from "drizzle-orm";
import { getDb, schema } from "../lib/db";
import { SITE } from "../lib/site";
import { productPath, sitemapRoutes } from "../content/routes";
import { liveCategories } from "../content/nav";
import { REVIEWS } from "../content/reviews";

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

  const paths = [
    ...sitemapRoutes().map((r) => r.path),
    /* A product page only exists where its category page does. A row for a
       category still marked coming_soon would be a URL nobody can navigate to. */
    ...rows
      .filter((r) => liveSlugs.has(r.categorySlug))
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
