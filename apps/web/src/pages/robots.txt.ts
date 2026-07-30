import type { APIRoute } from "astro";
import { SITE } from "../lib/site";

export const GET: APIRoute = () =>
  new Response(`User-agent: *\nAllow: /\n\nSitemap: https://${SITE.domain}/sitemap.xml\n`, {
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
