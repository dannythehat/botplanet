/**
 * Search Console migration corrections, 27 September 2026.
 *
 * These are deliberately narrow. Google still has URLs from the previous site
 * in its index while many of the rebuilt category/product URLs are only just
 * being adopted. A broad "old content -> /robots/" redirect throws away topic
 * relevance and can be treated like a soft 404. Only redirect when the old
 * intent has a genuinely close successor; otherwise return 410 Gone so Google
 * can retire the obsolete URL and spend crawl budget on the current site.
 */

export const SEO_MIGRATION_REDIRECTS: Readonly<Record<string, string>> = {
  "/blog/best-robot-pets-2026/": "/robots/companion-robots/",
  "/reviews/dreame-l20-ultra-review-finally-a-robot-that-doesn-t-suck-at-mopping/":
    "/robots/robot-vacuums/",
  "/reviews/dreame-l20-ultra-review-this-robot-has-better-leg-work-than-you/":
    "/robots/robot-vacuums/",
  "/category/desk-robots/": "/robots/companion-robots/",
};

export const SEO_MIGRATION_GONE_PATHS = new Set([
  "/security-robots/",
  "/home-security-robots/",
  "/category/wearable-robots/",
]);
