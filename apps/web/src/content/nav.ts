/**
 * Central navigation + category registry.
 *
 * Single source of truth for: the header mega-menu, mobile drawer, footer,
 * breadcrumbs, the /robots index and sitemap inclusion. Adding a future
 * category (Lawn, Vacuum, Window …) is a data change here, not a code change.
 *
 * Launch states (honest, per blueprint Part 2.1):
 *   live        — built + populated, indexable, linked in nav.
 *   coming_soon — clearly labelled destination, NOT a thin indexable page
 *                 (noindex), shown in nav only where commercially useful.
 *   hidden      — reserved slug, noindex, not linked in nav.
 */

export type LaunchState = "live" | "coming_soon" | "hidden";

export interface CategoryDef {
  slug: string;
  name: string;
  /** Job-to-be-done label used in the mega-menu (presentation only, no URL). */
  jtbd: string;
  short: string;
  launch: LaunchState;
  /** Expansion order per blueprint: Pool → Lawn → Vacuum → Window. */
  order: number;
}

/** The launch category slug — matches the live D1 route + attribution. */
export const LAUNCH_CATEGORY = "robotic-pool-cleaners";

export const CATEGORIES: CategoryDef[] = [
  { slug: LAUNCH_CATEGORY, name: "Robotic Pool Cleaners", jtbd: "Clean my pool", short: "Cordless & corded robots that scrub the floor, walls and waterline.", launch: "live", order: 1 },
  { slug: "robotic-lawn-mowers", name: "Robotic Lawn Mowers", jtbd: "Cut my lawn", short: "Robot mowers that cut a little every day, on a wire or without one.", launch: "live", order: 3 },
  { slug: "robot-vacuums", name: "Robot Vacuums & Mops", jtbd: "Vacuum my floors", short: "Self-emptying vacuum-and-mop robots for the whole home.", launch: "coming_soon", order: 4 },
  { slug: "window-cleaning-robots", name: "Window-Cleaning Robots", jtbd: "Clean my windows", short: "Robots that grip glass and clean windows and glass doors.", launch: "live", order: 2 },
  { slug: "solar-panel-robots", name: "Solar-Panel Cleaning Robots", jtbd: "Clean solar panels", short: "Automated cleaners that keep rooftop and ground arrays producing.", launch: "hidden", order: 5 },
];

export const categoryBySlug = (slug: string): CategoryDef | undefined => CATEGORIES.find((c) => c.slug === slug);
export const liveCategories = () => CATEGORIES.filter((c) => c.launch === "live");
export const navCategories = () => CATEGORIES.filter((c) => c.launch !== "hidden").sort((a, b) => a.order - b.order);

/** Category-scoped route helpers (preserve the live URL shapes + attribution). */
export const routes = {
  category: (slug: string) => `/robots/${slug}/`,
  product: (slug: string, productSlug: string) => `/robots/${slug}/${productSlug}/`,
  botmatch: (slug: string) => `/botmatch/${slug}/`,
  compare: (slug: string) => `/compare/${slug}/`,
  best: (slug?: string) => (slug ? `/best-robots/${slug}/` : "/best-robots/"),
  guide: (guideSlug: string) => `/guides/${guideSlug}/`,
  categoryGuides: (slug: string) => `/guides/${slug}/`,
  categoryDeals: (slug: string) => `/deals/${slug}/`,
  guides: () => "/guides/",
  deals: () => "/deals/",
} as const;

/**
 * Nav surfaces are now DERIVED from the route registry (content/routes.ts) so
 * a path can never drift between the header, footer, breadcrumbs and sitemap.
 * These re-exports keep the existing component imports working.
 *
 * NOTE: routes.ts imports CATEGORIES/LAUNCH_CATEGORY from this file, so the
 * derived exports live in content/nav-surfaces.ts to avoid a circular import.
 */
export interface NavItem {
  bar?: "primary" | "secondary" | "utility";
  label: string;
  href: string;
  mega?: boolean;
  state?: LaunchState;
}
