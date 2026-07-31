import type { APIRoute } from "astro";
import { and, eq } from "drizzle-orm";
import { getDb, schema } from "../lib/db";
import { SITE } from "../lib/site";
import { productPath, sitemapRoutes } from "../content/routes";

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

  const products = await db
    .select({ slug: schema.products.slug })
    .from(schema.products)
    .where(and(eq(schema.products.categoryId, "cat-pool-cleaners"), eq(schema.products.status, "published")));

  const paths = [
    ...sitemapRoutes().map((r) => r.path),
    ...products.map((p) => productPath(p.slug)),
  ];

  // Defensive: the registry is tested, but never emit a duplicate.
  const unique = [...new Set(paths)].sort();

  const xml =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    unique.map((p) => `  <url><loc>${base}${p}</loc></url>`).join("\n") +
    `\n</urlset>\n`;

  return new Response(xml, {
    headers: { "content-type": "application/xml; charset=utf-8", "cache-control": "public, max-age=3600" },
  });
};
