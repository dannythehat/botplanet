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
  { slug: "robotic-lawn-mowers", name: "Robotic Lawn Mowers", jtbd: "Cut my lawn", short: "Wire-free robot mowers that keep the yard trimmed automatically.", launch: "coming_soon", order: 2 },
  { slug: "robot-vacuums", name: "Robot Vacuums & Mops", jtbd: "Vacuum my floors", short: "Self-emptying vacuum-and-mop robots for the whole home.", launch: "coming_soon", order: 3 },
  { slug: "window-cleaning-robots", name: "Window-Cleaning Robots", jtbd: "Clean my windows", short: "Robots that grip glass and clean windows and glass doors.", launch: "coming_soon", order: 4 },
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
  best: (slug?: string) => (slug ? `/best/${slug}/` : "/best/"),
  guide: (guideSlug: string) => `/guides/${guideSlug}/`,
  guides: () => "/guides/",
  deals: () => "/deals/",
} as const;

/** Primary header items. `mega` opens the Shop Robots panel. */
export interface NavItem {
  label: string;
  href: string;
  mega?: boolean;
  state?: LaunchState;
}

export const PRIMARY_NAV: NavItem[] = [
  { label: "Shop Robots", href: routes.category(LAUNCH_CATEGORY), mega: true },
  { label: "Find My Robot", href: routes.botmatch(LAUNCH_CATEGORY) },
  { label: "Compare", href: routes.compare(LAUNCH_CATEGORY) },
  { label: "Best Robots", href: routes.best() },
  { label: "Guides", href: routes.guides() },
  { label: "Deals", href: routes.deals() },
  { label: "Robot News", href: "/news/", state: "coming_soon" },
  { label: "For Business", href: "/business/" },
  { label: "About", href: "/about/" },
];

/** Footer link groups. */
export const FOOTER_GROUPS: { title: string; links: { href: string; label: string; state?: LaunchState }[] }[] = [
  {
    title: "Explore",
    links: [
      { href: routes.category(LAUNCH_CATEGORY), label: "Shop pool cleaners" },
      { href: routes.compare(LAUNCH_CATEGORY), label: "Compare" },
      { href: routes.best(), label: "Best robotic pool cleaners" },
      { href: routes.guides(), label: "Guides" },
      { href: routes.deals(), label: "Deals" },
    ],
  },
  {
    title: "BotMatch",
    links: [
      { href: routes.botmatch(LAUNCH_CATEGORY), label: "Find my robot" },
      { href: "/how-botmatch-works/", label: "How BotMatch works" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about/", label: "About BotPlanet" },
      { href: "/review-methodology/", label: "How we review" },
      { href: "/editorial-policy/", label: "Editorial policy" },
      { href: "/business/", label: "For business" },
      { href: "/contact/", label: "Contact" },
    ],
  },
  {
    title: "Trust & legal",
    links: [
      { href: "/affiliate-disclosure/", label: "Affiliate disclosure" },
      { href: "/evidence-policy/", label: "Evidence & sourcing" },
      { href: "/privacy/", label: "Privacy" },
      { href: "/terms/", label: "Terms" },
    ],
  },
];
