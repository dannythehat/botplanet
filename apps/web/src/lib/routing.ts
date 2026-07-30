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
import { REDIRECTS, ROUTES, routeFor, type RouteDef } from "../content/routes";

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

export interface RedirectResult {
  /** Canonical destination path. */
  to: string;
  /** Permanent by definition — these are structural moves, not experiments. */
  status: 301;
  reason: "normalise" | "alias";
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

  const normalised = normalisePath(pathname);
  const alias = REDIRECTS.find((r) => normalisePath(r.from) === normalised);

  if (alias) {
    const target = normalisePath(alias.to);
    // Guard against a registry mistake pointing an alias at itself.
    if (target !== normalised) return { to: target, status: 301, reason: "alias" };
  }

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

  const crumbs: Crumb[] = chain
    .filter((r) => r.path !== "/")
    .map((r) => ({ name: r.breadcrumbLabel ?? r.label, path: r.path }));

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
