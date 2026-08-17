/**
 * URL consolidation locked after the page-by-page architecture review.
 *
 * These are exact structural moves. Category hubs own category comparison
 * intent; the named Eilik-vs-EMO article and the evidence-supported best-of
 * articles remain separate pages.
 */
export const URL_CONSOLIDATION_REDIRECTS: Readonly<Record<string, string>> = {
  "/best-robots/": "/robots/",
  "/compare/": "/robots/",
  "/compare/robotic-pool-cleaners/": "/robots/robotic-pool-cleaners/",
  "/compare/window-cleaning-robots/": "/robots/window-cleaning-robots/",
  "/compare/robotic-lawn-mowers/": "/robots/robotic-lawn-mowers/",
  "/compare/robot-vacuums/": "/robots/robot-vacuums/",
  "/compare/companion-robots/": "/robots/companion-robots/",
  "/compare/pet-camera-robots/": "/robots/pet-camera-robots/",
  "/compare/self-cleaning-litter-boxes/": "/robots/self-cleaning-litter-boxes/",
  "/compare/educational-coding-robots/": "/robots/educational-coding-robots/",
  "/compare/grill-cleaning-robots/": "/robots/grill-cleaning-robots/",
  "/guides/robotic-pool-cleaners/": "/robots/robotic-pool-cleaners/",
};

/** Pages deliberately retired without a replacement. */
export const REMOVED_PATHS = new Set([
  "/business/",
  "/deals/",
  "/deals/robotic-pool-cleaners/",
  "/news/",
]);

/** Children of these retired sections are gone as well. */
export const REMOVED_PREFIXES = ["/news/"] as const;

const canonical = (pathname: string): string => {
  let path = pathname.toLowerCase().replace(/\/{2,}/g, "/");
  if (!path.startsWith("/")) path = `/${path}`;
  if (!path.endsWith("/")) path += "/";
  return path;
};

export const isConsolidatedPath = (pathname: string): boolean =>
  canonical(pathname) in URL_CONSOLIDATION_REDIRECTS;

export const consolidatedDestination = (pathname: string): string | null =>
  URL_CONSOLIDATION_REDIRECTS[canonical(pathname)] ?? null;

export const isRemovedPath = (pathname: string): boolean => {
  const path = canonical(pathname);
  return REMOVED_PATHS.has(path) || REMOVED_PREFIXES.some((prefix) => path.startsWith(prefix));
};
