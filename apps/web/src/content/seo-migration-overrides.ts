/**
 * Search Console migration corrections, 27 September 2026.
 *
 * These are deliberately narrow. Google still has URLs from the previous site
 * in its index while many of the rebuilt category/product URLs are only just
 * being adopted. A broad "old content -> /robots/" redirect throws away topic
 * relevance and can be treated like a soft 404. Only redirect when the old
 * intent has a genuinely close successor; otherwise let the request fall
 * through to the site's normal not-found handling.
 */

export const SEO_MIGRATION_REDIRECTS: Readonly<Record<string, string>> = {
  "/blog/best-robot-pets-2026/": "/robots/companion-robots/",
  "/reviews/dreame-l20-ultra-review-finally-a-robot-that-doesn-t-suck-at-mopping/":
    "/robots/robot-vacuums/",
  "/reviews/dreame-l20-ultra-review-this-robot-has-better-leg-work-than-you/":
    "/robots/robot-vacuums/",
  "/category/desk-robots/": "/robots/companion-robots/",
};

/* Reserved for confirmed retired paths that should return 410. Keep empty
   until an existing exact legacy rule is removed from content/routes.ts, so
   this correction layer cannot disagree with the legacy registry. */
export const SEO_MIGRATION_GONE_PATHS = new Set<string>();
