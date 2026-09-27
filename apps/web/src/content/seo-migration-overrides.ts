/**
 * Search Console migration corrections, 27 September 2026.
 *
 * These are deliberately narrow. Google still has URLs from the previous site
 * in its index while many of the rebuilt category/product URLs are only just
 * being adopted. A broad "old content -> /robots/" redirect throws away topic
 * relevance and can be treated like a soft 404. Only redirect when the old
 * intent has a genuinely close successor; otherwise retire the old URL.
 */

export const SEO_MIGRATION_REDIRECTS: Readonly<Record<string, string>> = {
  "/blog/best-robot-pets-2026/": "/robots/companion-robots/",
  "/reviews/dreame-l20-ultra-review-finally-a-robot-that-doesn-t-suck-at-mopping/":
    "/robots/robot-vacuums/",
  "/reviews/dreame-l20-ultra-review-this-robot-has-better-leg-work-than-you/":
    "/robots/robot-vacuums/",
  "/category/desk-robots/": "/robots/companion-robots/",
};

/* Kept for routing.ts's existing generic Gone mechanism. The security URLs
   below are intentionally NOT in this set because they still appear in the
   historical LEGACY_REDIRECTS registry, whose integrity tests require every
   registry entry to resolve. Their live retirement happens one layer earlier,
   in middleware, before resolveRedirect is called. */
export const SEO_MIGRATION_GONE_PATHS = new Set<string>();

const EDGE_RETIRED_PATHS = new Set<string>([
  "/security-robots/",
  "/home-security-robots/",
]);

/**
 * True for legacy URLs that must answer 410 at the HTTP edge before historical
 * redirect resolution. Normalises casing, duplicate slashes and a missing
 * trailing slash so the first response is 410 rather than a redirect hop.
 */
export function isSeoMigrationRetiredPath(pathname: string): boolean {
  let path = (pathname || "/").toLowerCase().replace(/\/{2,}/g, "/");
  if (!path.startsWith("/")) path = "/" + path;
  if (!path.endsWith("/")) path += "/";
  return EDGE_RETIRED_PATHS.has(path);
}
