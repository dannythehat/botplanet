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
  "/product/dreame-l20-ultra/": "/robots/robot-vacuums/",
  "/category/desk-robots/": "/robots/companion-robots/",

  /* Exact legacy -> current replacements still receiving Search Console
     impressions. These must consolidate directly rather than fall through to a
     trailing-slash 301 followed by a 404. */
  "/reviews/emo-ai-desktop-pet-review-your-new-desk-bestie/":
    "/robots/companion-robots/living-ai-emo/",
  "/product/botley-2-coding-robot/":
    "/robots/educational-coding-robots/botley-the-coding-robot/",

  /* Closest honest successors for retired products/editorials. The destination
     answers the same job/category intent; none of these are sent to the generic
     site-wide /robots/ index. */
  "/reviews/mammotion-luba-2-awd-review-the-lawn-mowing-beast/":
    "/robots/robotic-lawn-mowers/",
  "/reviews/makeblock-mbot2-review-more-than-just-a-blue-toy-on-wheels/":
    "/robots/educational-coding-robots/",
  "/reviews/shark-ai-ultra-review-scrappy-smart-and-sucks-in-a-good-way/":
    "/robots/robot-vacuums/",
  "/reviews/shark-ai-ultra-review-the-blue-collar-hero-your-carpet-deserves/":
    "/robots/robot-vacuums/",
  "/product/matatastudio-vincibot/": "/robots/educational-coding-robots/",
  "/blog/nicoo-realistic-robot-puppy-review-all-bark-no-bite-and-no-poop/":
    "/guides/robot-dog-toys/",
  "/reviews/nicoo-realistic-robot-puppy-review-all-bark-no-bite-and-no-poop/":
    "/guides/robot-dog-toys/",
  "/product/unitree-go2-pro/": "/guides/robot-dog-toys/",
};

/* Kept for routing.ts's existing generic Gone mechanism. The URLs retired at
   the HTTP edge below are intentionally NOT in this set because some still
   appear in the historical LEGACY_REDIRECTS registry, whose integrity tests
   require every registry entry to resolve. Their live retirement happens one
   layer earlier, in middleware, before resolveRedirect is called. */
export const SEO_MIGRATION_GONE_PATHS = new Set<string>();

const EDGE_RETIRED_PATHS = new Set<string>([
  "/security-robots/",
  "/home-security-robots/",

  /* No current BotPlanet page honestly replaces these. Returning 410 avoids
     sending model-specific or out-of-scope searches to unrelated hubs. */
  "/reviews/amazon-echo-show-10-review-the-screen-that-follows-you/",
  "/reviews/amazon-echo-show-10-review-the-smart-display-that-follows-you/",
  "/reviews/amazon-echo-show-10-review-the-speaker-that-follows-you-around/",
  "/reviews/temi-personal-robot-v3-review-the-butler-we-deserve/",
  "/category/kitchen-robots/",
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
