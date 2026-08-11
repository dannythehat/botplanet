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

/* @extension-point per-category | required | The category is invisible: absent
   from the header mega-menu, the mobile drawer, the footer and the /robots
   index, and excluded from the sitemap because liveCategories() drives it.
   The launch state here is also what marks a category coming_soon or hidden. */
export const CATEGORIES: CategoryDef[] = [
  { slug: LAUNCH_CATEGORY, name: "Robotic Pool Cleaners", jtbd: "Clean my pool", short: "Cordless & corded robots that scrub the floor, walls and waterline.", launch: "live", order: 1 },
  { slug: "robotic-lawn-mowers", name: "Robotic Lawn Mowers", jtbd: "Cut my lawn", short: "Robot mowers that cut a little every day, on a wire or without one.", launch: "live", order: 3 },
  { slug: "robot-vacuums", name: "Robot Vacuums & Mops", jtbd: "Vacuum my floors", short: "Self-emptying vacuum-and-mop robots for the whole home.", launch: "live", order: 4 },
  { slug: "window-cleaning-robots", name: "Window-Cleaning Robots", jtbd: "Clean my windows", short: "Robots that grip glass and clean windows and glass doors.", launch: "live", order: 2 },
  /* Companion and pet-camera are TWO categories, and that is the finding of
     the research run of 6 August 2026 rather than a filing preference. Their
     SERPs share only Amazon, Reddit and YouTube — no publisher, manufacturer
     or retailer in common — and their seasons run opposite ways: companion
     peaks at Christmas, pet cameras peak in July when people go away. */
  { slug: "companion-robots", name: "Companion Robots & Robot Pets", jtbd: "Keep me company", short: "Robot pets and desk companions built for company rather than chores.", launch: "live", order: 6 },
  { slug: "pet-camera-robots", name: "Pet Camera Robots", jtbd: "Watch my pet", short: "Cameras on wheels that drive around the house while you are out.", launch: "live", order: 7 },
  { slug: "self-cleaning-litter-boxes", name: "Self-Cleaning Litter Boxes", jtbd: "Stop scooping", short: "Automatic litter boxes that sift and seal the waste themselves.", launch: "live", order: 8 },
  { slug: "grill-cleaning-robots", name: "Grill-Cleaning Robots", jtbd: "Clean my grill", short: "Robots that scrub the barbecue grates so you do not have to.", launch: "live", order: 9 },
  { slug: "educational-coding-robots", name: "Coding Robots for Kids", jtbd: "Teach my kid to code", short: "Robots children program themselves, from screen-free floor bots up.", launch: "live", order: 10 },
  { slug: "solar-panel-robots", name: "Solar-Panel Cleaning Robots", jtbd: "Clean solar panels", short: "Automated cleaners that keep rooftop and ground arrays producing.", launch: "hidden", order: 5 },
  /* ROBOT SNOW BLOWERS — HIDDEN ON PURPOSE, and the purpose is not "not ready".
     Added 11 August 2026 after four review rounds concluded the category has
     exactly one manufacturer. Snowbot IS Yarbo; Left Hand Robotics went to Toro
     in 2021 and builds commercial machines; every other domain selling one is a
     Yarbo dealer. With nothing to compare, a hub, a comparison table, a matcher
     and a best-of would be four surfaces pretending a market exists.
     `hidden` gives the Yarbo review a clean URL — /robots/robot-snow-blowers/ —
     with no hub, no route registered, and no surfaces rendered. If a second
     manufacturer ever ships a consumer machine into US retail, promotion is one
     word: hidden becomes live. See docs/seo/snow-blower-research-2026-08-11.md. */
  { slug: "robot-snow-blowers", name: "Robot Snow Blowers", jtbd: "Clear snow", short: "Autonomous machines that clear a driveway without anybody going outside.", launch: "hidden", order: 10 },
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
