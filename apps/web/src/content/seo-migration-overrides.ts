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

/* Confirmed retired URLs with no topic-equivalent successor. These take
   precedence over older legacy redirect decisions in routing.ts so Google and
   readers are not sent to a generic destination that does not answer the old
   search intent. */
export const SEO_MIGRATION_GONE_PATHS = new Set<string>([
  "/security-robots/",
  "/home-security-robots/",
]);
