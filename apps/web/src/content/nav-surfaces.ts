/**
 * Navigation surfaces, derived from the single route registry.
 *
 * Kept separate from routes.ts only to avoid a circular import (routes.ts
 * reads the category list from nav.ts). Components import from here, so no
 * component holds a hard-coded path.
 */
import { ROUTES, barRoutes, utilityRoutes, footerGroups, type RouteDef } from "./routes";
import { LAUNCH_CATEGORY } from "./nav";

export interface BarItem {
  label: string;
  href: string;
  /** Opens the Shop Robots mega panel. */
  mega?: boolean;
  /** Drops out of the bar on narrower desktops. */
  secondary?: boolean;
  status: RouteDef["status"];
  section: string;
}

/** Desktop top bar. Shop Robots owns the mega menu. */
export const BAR_ITEMS: BarItem[] = barRoutes().map((r) => ({
  label: r.label,
  href: r.path,
  mega: r.path === "/robots/",
  secondary: r.navSurface === "bar-secondary",
  status: r.status,
  section: r.section,
}));

/** Utility destinations — mega-menu "More" column, drawer and footer. */
export const UTILITY_ITEMS = utilityRoutes().map((r) => ({
  label: r.label,
  href: r.path,
  status: r.status,
  section: r.section,
}));

/** Footer groups, assembled from the registry. */
export const FOOTER_GROUPS = footerGroups().map((g) => ({
  title: g.title,
  links: g.links.map((r) => ({ href: r.path, label: r.label, state: r.status })),
}));

/** Trust/legal routes, used by the footer's legal row. */
export const LEGAL_ITEMS = ROUTES.filter((r) => r.section === "legal").map((r) => ({
  href: r.path,
  label: r.label,
}));

export { LAUNCH_CATEGORY };
