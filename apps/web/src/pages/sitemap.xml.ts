import type { APIRoute } from "astro";
import { and, eq } from "drizzle-orm";
import { getDb, schema } from "../lib/db";
import { SITE } from "../lib/site";

const CAT = "robotic-pool-cleaners";

export const GET: APIRoute = async ({ locals }) => {
  const db = getDb(locals);
  const base = `https://${SITE.domain}`;

  const products = await db
    .select({ slug: schema.products.slug })
    .from(schema.products)
    .where(and(eq(schema.products.categoryId, "cat-pool-cleaners"), eq(schema.products.status, "published")));

  const paths = [
    "/",
    `/robots/${CAT}/`,
    `/compare/${CAT}/`,
    `/botmatch/${CAT}/`,
    "/about/",
    "/how-botmatch-works/",
    "/editorial-policy/",
    "/review-methodology/",
    "/affiliate-disclosure/",
    "/privacy/",
    ...products.map((p) => `/robots/${CAT}/${p.slug}/`),
  ];

  const xml =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    paths.map((p) => `  <url><loc>${base}${p}</loc></url>`).join("\n") +
    `\n</urlset>\n`;

  return new Response(xml, {
    headers: { "content-type": "application/xml; charset=utf-8", "cache-control": "public, max-age=3600" },
  });
};
