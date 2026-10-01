/**
 * URL rules, redirect resolution and breadcrumb construction.
 *
 * Pure functions only — no Astro, no I/O — so the rules that decide what a
 * canonical URL is can be unit tested rather than trusted.
 *
 * LOCKED URL STANDARDS
 *  - lowercase paths
 *  - hyphenated slugs
 *  - trailing slash on every page route
 *  - one canonical URL per page
 *  - query parameters never create a second indexable URL
 *  - no internal link may point at a redirected path
 *  - unknown routes 404; they are never swept to the homepage
 */
import {
  GONE_PREFIXES,
  LEGACY_CONTENT_REDIRECTS,
  LEGACY_REDIRECTS,
  REDIRECTS,
  ROUTES,
  legacyProductRedirect,
  routeFor,
  type RouteDef,
} from "../content/routes";
import { REVIEWS } from "../content/reviews";
import { consolidatedDestination, isConsolidatedPath, isRemovedPath } from "../content/url-consolidation";
import {
  SEO_MIGRATION_GONE_PATHS,
  SEO_MIGRATION_REDIRECTS,
} from "../content/seo-migration-overrides";

/* Every product this site actually holds, for resolving old /product/ and
   /reviews/ URLs onto the page that replaced them. Built once. */
const KNOWN_PRODUCTS = Object.values(REVIEWS).map((r) => ({
  slug: r.slug,
  categorySlug: r.categorySlug,
}));

/** Paths that are handled outside the page router and must never be rewritten. */
const PASSTHROUGH = [/^\/go\//, /^\/api\//, /^\/admin(\/|$)/, /^\/_/, /^\/fonts\//, /^\/logo\//, /^\/og\//];

const isPassthrough = (p: string) => PASSTHROUGH.some((re) => re.test(p));

/** True when a path points at a file (has an extension) rather than a page. */
export const isFilePath = (p: string): boolean => /\.[a-z0-9]{2,5}$/i.test(p);

/**
 * Normalise a path to the canonical form: lowercase, single slashes, exactly
 * one trailing slash. Returns the input unchanged for passthrough and files.
 */
export function normalisePath(pathname: string): string {
  if (!pathname) return "/";
  if (isPassthrough(pathname) || isFilePath(pathname)) return pathname;
  let p = pathname.toLowerCase();
  p = p.replace(/\/{2,}/g, "/");
  if (!p.startsWith("/")) p = "/" + p;
  if (!p.endsWith("/")) p += "/";
  return p;
}

/**
 * Is this one of the previous sites' URLs that should return 410 Gone?
 *
 * Checked on the PATH only, so /shop?category=cleaning-robots is caught by the
 * same rule as /shop/. Checked BEFORE any redirect logic, including
 * normalisation — otherwise /gifts/x answers 301 to /gifts/x/ and only then
 * 410s, which is a redirect chain that ends in a dead end and tells Google
 * nothing on the first hop.
 *
 * Prefix matching is bounded at a segment: /shop and /shop/anything are gone,
 * /shopping-guide would not be. Nothing on this site currently starts with one
 * of these words, and the guard means nothing ever accidentally will.
 */
export function isGone(pathname: string): boolean {
  if (isPassthrough(pathname) || isFilePath(pathname)) return false;
  const canonical = normalisePath(pathname);
  if (SEO_MIGRATION_GONE_PATHS.has(canonical)) return true;
  if (isRemovedPath(pathname)) return true;
  const p = pathname.toLowerCase().replace(/\/+$/, "");
  return GONE_PREFIXES.some(({ prefix }) => p === prefix || p.startsWith(`${prefix}/`));
}

export interface RedirectResult {
  /** Canonical destination path. */
  to: string;
  /** Permanent by definition — these are structural moves, not experiments. */
  status: 301;
  reason: "normalise" | "alias" | "legacy" | "consolidation";
}

/**
 * Resolve a request path to a redirect, or null when it is already canonical.
 *
 * Aliases are resolved AFTER normalisation and the result is resolved again,
 * so an alias that itself needs normalising still lands on the final URL in a
 * single hop — there are no redirect chains.
 */
export function resolveRedirect(pathname: string): RedirectResult | null {
  if (isPassthrough(pathname) || isFilePath(pathname)) return null;
  if (isGone(pathname)) return null;

  const normalised = normalisePath(pathname);
  const alias = REDIRECTS.find((r) => normalisePath(r.from) === normalised);

  if (alias) {
    const target = normalisePath(alias.to);
    // Guard against a registry mistake pointing an alias at itself.
    if (target !== normalised) {
      return {
        to: target,
        status: 301,
        reason: isConsolidatedPath(normalised) ? "consolidation" : "alias",
      };
    }
  }

  /* Search Console migration corrections take precedence over older legacy
     decisions. They are explicit because topic-equivalent redirects preserve
     intent; generic sweeps do not. */
  const migrationTarget = SEO_MIGRATION_REDIRECTS[normalised];
  if (migrationTarget) {
    const target = normalisePath(migrationTarget);
    if (target !== normalised) return { to: target, status: 301, reason: "legacy" };
  }

  /* The previous site on this domain, whose URLs are still what Google has
     indexed. See the long note above LEGACY_REDIRECTS in content/routes.ts:
     these are 404s today, and each 404 is crawl budget spent on nothing. */
  const legacy = LEGACY_REDIRECTS.find((r) => normalisePath(r.from) === normalised);
  if (legacy) {
    const target = normalisePath(legacy.to);
    if (target !== normalised) return { to: target, status: 301, reason: "legacy" };
  }

  /* Explicit old-content mappings, ahead of the slug resolver: these are the
     ones Search Console actually showed, and each was chosen by hand because a
     guessed destination is worse than the index. */
  const content = LEGACY_CONTENT_REDIRECTS.find((r) => normalisePath(r.from) === normalised);
  if (content) {
    const target = normalisePath(content.to);
    if (target !== normalised) return { to: target, status: 301, reason: "legacy" };
  }

  const legacyProduct = legacyProductRedirect(normalised, KNOWN_PRODUCTS);
  if (legacyProduct) {
    const target = normalisePath(legacyProduct);
    if (target !== normalised) return { to: target, status: 301, reason: "legacy" };
  }

  /* No broad legacy catch-all here. If an old editorial/product URL has no
     defensible replacement, it must 404 (or be explicitly marked 410 above)
     rather than pretending /robots/ answers the same intent. This prevents
     the migration from creating soft-404-style redirects. */

  if (normalised !== pathname) return { to: normalised, status: 301, reason: "normalise" };
  return null;
}

/** Query parameters worth preserving across a redirect. Nothing personal. */
const SAFE_PARAMS = new Set(["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "ref", "q"]);

/** Filter a query string down to parameters that are safe to carry forward. */
export function safeQuery(search: string): string {
  if (!search || search === "?") return "";
  const params = new URLSearchParams(search.startsWith("?") ? search.slice(1) : search);
  const kept = new URLSearchParams();
  for (const [k, v] of params) {
    if (SAFE_PARAMS.has(k.toLowerCase())) kept.append(k, v);
  }
  const out = kept.toString();
  return out ? `?${out}` : "";
}

export interface Crumb {
  name: string;
  path: string;
}

/**
 * Build the breadcrumb trail for a path from the registry's parent chain.
 *
 * Returns [] for the homepage and for any route where a breadcrumb adds no
 * value. The final entry is the current page; callers must not link it.
 */
export function breadcrumbsFor(path: string, currentLabel?: string): Crumb[] {
  const canonical = normalisePath(path);
  if (canonical === "/") return [];

  const route = routeFor(canonical);

  // Unregistered paths (dynamic product/editorial pages) supply their own label
  // and hang off the nearest registered ancestor.
  const chain: RouteDef[] = [];
  let node = route ?? nearestAncestor(canonical);
  const guard = new Set<string>();
  while (node && !guard.has(node.path)) {
    guard.add(node.path);
    chain.unshift(node);
    node = node.parent ? routeFor(node.parent) : undefined;
  }

  /* A crumb must point where the reader will land. /compare/ and /best-robots/
     301 to /robots/ since the consolidation, so a trail through them linked a
     redirect on every comparison and best-of page. Resolve each crumb to its
     destination, take the destination's own label, and collapse the repeat. */
  const crumbs: Crumb[] = [];
  for (const r of chain.filter((x) => x.path !== "/")) {
    const dest = consolidatedDestination(r.path);
    const target = dest ? routeFor(dest) : undefined;
    const crumb = dest
      ? { name: target?.breadcrumbLabel ?? target?.label ?? r.label, path: dest }
      : { name: r.breadcrumbLabel ?? r.label, path: r.path };
    if (crumbs.length && crumbs[crumbs.length - 1].path === crumb.path) continue;
    crumbs.push(crumb);
  }

  // A dynamic leaf (product, guide article) appends itself.
  if (!route && currentLabel) crumbs.push({ name: currentLabel, path: canonical });
  else if (route && currentLabel) crumbs[crumbs.length - 1] = { name: currentLabel, path: canonical };

  // One crumb means the trail would only repeat the page title — not useful.
  return crumbs.length > 1 ? crumbs : [];
}

/** The deepest registered route that is a prefix of this path. */
function nearestAncestor(path: string): RouteDef | undefined {
  let best: RouteDef | undefined;
  for (const r of ROUTES) {
    if (path.startsWith(r.path) && r.path !== "/" && (!best || r.path.length > best.path.length)) best = r;
  }
  return best;
}

/**
 * Active-state resolution for navigation.
 * A nav item is active when it is the current page, or an ancestor section of
 * it. Only one item per surface may match, so section prefixes are compared by
 * specificity rather than by any-prefix matching.
 */
export function isNavActive(navPath: string, currentPath: string): boolean {
  const current = normalisePath(currentPath);
  const nav = normalisePath(navPath);
  if (nav === "/") return current === "/";
  return current === nav || current.startsWith(nav);
}

/** The single best-matching nav path for the current page, or null. */
export function activeNavPath(navPaths: string[], currentPath: string): string | null {
  const matches = navPaths.filter((p) => isNavActive(p, currentPath));
  if (!matches.length) return null;
  return matches.reduce((a, b) => (b.length > a.length ? b : a));
}
