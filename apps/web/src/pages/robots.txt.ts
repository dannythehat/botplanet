import type { APIRoute } from "astro";
import { isPreviewHost, SITE_URL } from "../lib/seo";

/**
 * Production-truth robots.txt.
 *  - Any non-production host (preview.botplanet.io, *.workers.dev): Disallow all,
 *    so staging never enters the index (belt-and-braces with the meta noindex).
 *  - Production (botplanet.io): allow crawling, but keep affiliate redirects,
 *    admin, api and the internal media-preview out; point to the sitemap.
 */
export const GET: APIRoute = ({ request }) => {
  const host = request.headers.get("host");
  const body = isPreviewHost(host)
    ? `User-agent: *\nDisallow: /\n`
    : `User-agent: *\nAllow: /\nDisallow: /go/\nDisallow: /admin/\nDisallow: /api/\nDisallow: /media-preview/\n\nSitemap: ${SITE_URL}/sitemap.xml\n`;
  return new Response(body, { headers: { "content-type": "text/plain; charset=utf-8" } });
};
