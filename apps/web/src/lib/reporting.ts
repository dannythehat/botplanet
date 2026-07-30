/**
 * Reporting connections register — the single internal source of truth for
 * "can BotPlanet actually report this figure today?".
 *
 * TRUTH VOCABULARY (from the Daily Command Centre reporting rule):
 *  - connected     verified and working
 *  - configured    code/configuration exists, live data not yet verified
 *  - not_connected no working connection
 *  - no_access     the system may exist but cannot currently be checked
 *  - no_data_yet   connected, but no reportable activity exists yet
 *
 * SECRETS: this file names *where* a credential lives (`secretStorage`) and
 * never contains a credential. Cloudflare API tokens are never stored in the
 * repository, D1, Notion, routines or scheduled prompts — they stay in Danny's
 * password manager and, where a Worker needs one, in Worker secrets.
 *
 * FIGURES: no numbers are recorded here. Counts are read live from D1 by the
 * admin reporting view, so a stale figure can never be presented as current.
 */

export type ConnectionStatus = "connected" | "configured" | "not_connected" | "no_access" | "no_data_yet";

export const STATUS_LABEL: Record<ConnectionStatus, string> = {
  connected: "Connected",
  configured: "Configured",
  not_connected: "Not connected",
  no_access: "No access",
  no_data_yet: "No data yet",
};

/** ok / warn / bad tone for the admin tag, so status colour follows meaning. */
export const STATUS_TONE: Record<ConnectionStatus, "ok" | "warn" | "bad"> = {
  connected: "ok",
  configured: "warn",
  not_connected: "bad",
  no_access: "warn",
  no_data_yet: "warn",
};

/**
 * Hosts whose referrers count as BotPlanet's own pages for click attribution.
 * Anything else is treated as off-site and discarded.
 */
export const ATTRIBUTION_HOSTS = ["botplanet.io", "preview.botplanet.io", "botplanet-web.dannythehat2.workers.dev"];

/** Cloudflare account that owns the zone, Worker, D1 and analytics. */
export const CLOUDFLARE = {
  workerName: "botplanet-web",
  zone: "botplanet.io",
  d1Database: "botplanet-db",
  /**
   * Account-agnostic dashboard deep links. `:account` is substituted by
   * Cloudflare for the logged-in account, so these work without recording an
   * account id in the repository.
   */
  links: {
    zoneTraffic: "https://dash.cloudflare.com/?to=/:account/botplanet.io/analytics/traffic",
    zoneSecurityEvents: "https://dash.cloudflare.com/?to=/:account/botplanet.io/security/events",
    webAnalytics: "https://dash.cloudflare.com/?to=/:account/web-analytics",
    workerMetrics: "https://dash.cloudflare.com/?to=/:account/workers/services/view/botplanet-web/production/metrics",
    workerDeployments: "https://dash.cloudflare.com/?to=/:account/workers/services/view/botplanet-web/production/deployments",
    workerObservability: "https://dash.cloudflare.com/?to=/:account/workers/services/view/botplanet-web/production/observability",
    d1: "https://dash.cloudflare.com/?to=/:account/workers/d1",
  },
} as const;

/**
 * Exact Cloudflare navigation paths for each reporting need. Cloudflare renames
 * dashboard sections occasionally; the deep links above are the stable route, so
 * these click paths are the human fallback.
 */
export const CLOUDFLARE_REPORT_PATHS: { metric: string; path: string; link: string; note?: string }[] = [
  {
    metric: "Requests",
    path: "dash.cloudflare.com → Account Home → Websites → botplanet.io → Analytics & Logs → Traffic",
    link: CLOUDFLARE.links.zoneTraffic,
  },
  {
    metric: "Unique visitors",
    path: "dash.cloudflare.com → Websites → botplanet.io → Analytics & Logs → Traffic (Unique visitors card)",
    link: CLOUDFLARE.links.zoneTraffic,
    note: "Zone-level estimate from edge data. Page views per URL require Web Analytics (beacon).",
  },
  {
    metric: "Bandwidth",
    path: "dash.cloudflare.com → Websites → botplanet.io → Analytics & Logs → Traffic (Bandwidth card)",
    link: CLOUDFLARE.links.zoneTraffic,
  },
  {
    metric: "HTTP errors (4xx / 5xx)",
    path: "dash.cloudflare.com → Websites → botplanet.io → Analytics & Logs → Traffic → Status codes",
    link: CLOUDFLARE.links.zoneTraffic,
    note: "Worker-thrown errors and exception rate appear under the Worker's Metrics tab instead.",
  },
  {
    metric: "Worker errors & invocations",
    path: "dash.cloudflare.com → Compute (Workers) → botplanet-web → Metrics",
    link: CLOUDFLARE.links.workerMetrics,
  },
  {
    metric: "Deployment history & version IDs",
    path: "dash.cloudflare.com → Compute (Workers) → botplanet-web → Deployments",
    link: CLOUDFLARE.links.workerDeployments,
  },
  {
    metric: "Live logs / invocation traces",
    path: "dash.cloudflare.com → Compute (Workers) → botplanet-web → Observability (Workers Logs)",
    link: CLOUDFLARE.links.workerObservability,
    note: "Enabled in wrangler.toml via [observability].",
  },
  {
    metric: "Performance (Core Web Vitals)",
    path: "dash.cloudflare.com → Analytics & Logs → Web Analytics → botplanet.io → Core Web Vitals",
    link: CLOUDFLARE.links.webAnalytics,
    note: "Requires the Web Analytics beacon; no data until the beacon token is set.",
  },
  {
    metric: "Click / attribution data (BotPlanet's own)",
    path: "dash.cloudflare.com → Storage & Databases → D1 → botplanet-db, or the internal /admin/reporting view",
    link: CLOUDFLARE.links.d1,
  },
];

export interface ReportingSystem {
  id: string;
  name: string;
  provider: string;
  /** Baseline status verified by hand on `lastCheckedAt`; may be refined at runtime. */
  status: ConnectionStatus;
  /** Dashboard URL, or the exact navigation path when there is no stable URL. */
  dashboard: string;
  dashboardLink?: string;
  dataAvailable: string[];
  dataUnavailable: string[];
  /** ISO date this entry was last verified against the real system. */
  lastCheckedAt: string;
  /** Exact click-by-click action Danny must take, or null when nothing is needed. */
  ownerAction: string | null;
  /** Where a credential lives — NAME ONLY, never a value. */
  secretStorage: string | null;
  notes?: string;
}

const CHECKED = "2026-07-30";

/**
 * The register. Statuses here are what was true when the system was last
 * checked by hand; `resolveStatus` below re-derives the two that depend on
 * runtime configuration so the admin view cannot show a stale claim.
 */
export const REPORTING_SYSTEMS: ReportingSystem[] = [
  {
    id: "site-analytics",
    name: "Site analytics (page views)",
    provider: "Cloudflare Web Analytics (free, privacy-respecting, cookieless)",
    status: "not_connected",
    dashboard: "dash.cloudflare.com → Analytics & Logs → Web Analytics → botplanet.io",
    dashboardLink: CLOUDFLARE.links.webAnalytics,
    dataAvailable: [],
    dataUnavailable: [
      "Page views",
      "Visits and referrers",
      "Top pages",
      "Core Web Vitals",
      "Country breakdown",
    ],
    lastCheckedAt: CHECKED,
    ownerAction:
      "Cloudflare dashboard → Analytics & Logs → Web Analytics → Add a site → enter botplanet.io → choose Manual installation → copy the beacon token, then run: wrangler secret put CF_WEB_ANALYTICS_TOKEN (paste the token). The beacon then loads on botplanet.io only. Automatic installation also works and needs no token — if you use it, no repository change is required.",
    secretStorage: "Worker secret CF_WEB_ANALYTICS_TOKEN (beacon token; public once rendered, kept in config so it is not hard-coded)",
    notes:
      "No paid analytics provider is introduced. The beacon is rendered only when the token exists and only on the production host.",
  },
  {
    id: "cloudflare-analytics",
    name: "Cloudflare traffic, errors & deployments",
    provider: "Cloudflare (zone analytics + Workers metrics/observability)",
    status: "connected",
    dashboard: "dash.cloudflare.com → Websites → botplanet.io → Analytics & Logs → Traffic; Compute (Workers) → botplanet-web → Metrics / Deployments / Observability",
    dashboardLink: CLOUDFLARE.links.zoneTraffic,
    dataAvailable: [
      "Requests",
      "Unique visitors (zone estimate)",
      "Bandwidth",
      "HTTP status codes / errors",
      "Worker invocations, errors and CPU time",
      "Deployment history and version IDs",
    ],
    dataUnavailable: [
      "Per-URL page views (needs the Web Analytics beacon)",
      "Core Web Vitals (needs the Web Analytics beacon)",
    ],
    lastCheckedAt: CHECKED,
    ownerAction: null,
    secretStorage:
      "Cloudflare API tokens are NOT stored in the repository, D1, Notion or routines. Dashboard access is Danny's Cloudflare login; any deploy token lives only in Danny's password manager.",
    notes: "Dashboard reporting needs no token at all — it is read by logging in.",
  },
  {
    id: "google-search-console",
    name: "Google Search Console",
    provider: "Google",
    status: "not_connected",
    dashboard: "search.google.com/search-console",
    dashboardLink: "https://search.google.com/search-console",
    dataAvailable: [],
    dataUnavailable: [
      "Clicks, impressions, CTR, average position",
      "Queries and pages",
      "Index coverage",
      "Sitemap processing status",
      "Core Web Vitals (field data)",
    ],
    lastCheckedAt: CHECKED,
    ownerAction:
      "1) Open search.google.com/search-console → Add property → URL prefix → enter https://botplanet.io → Continue. 2) Choose the HTML tag verification method and copy the content value (the long string inside content=\"…\"). 3) Send that value to Claude, or run: wrangler secret put GOOGLE_SITE_VERIFICATION (paste only the content value, not the whole tag). 4) After the next deploy, return to Search Console and press Verify. 5) Then Sitemaps → Add a new sitemap → enter sitemap.xml → Submit.",
    secretStorage: "Worker secret GOOGLE_SITE_VERIFICATION (verification content value only)",
    notes:
      "Site readiness is already met: production canonical is https://botplanet.io, robots.txt allows production and disallows preview hosts, and /sitemap.xml lists production URLs. Only the property verification itself is outstanding.",
  },
  {
    id: "go-click-reporting",
    name: "Internal /go affiliate click reporting",
    provider: "BotPlanet (Cloudflare D1 · click_events)",
    status: "connected",
    dashboard: "/admin/reporting (internal), or dash.cloudflare.com → Storage & Databases → D1 → botplanet-db",
    dashboardLink: "/admin/reporting",
    dataAvailable: [
      "Total outbound affiliate clicks",
      "Clicks by product, offer, retailer and programme",
      "Source page path, page type and device class (recorded from this release onward)",
      "Which destination kind each click used",
      "Recent click activity with timestamps",
      "Attribution completeness split (attributed / partial / minimal)",
    ],
    dataUnavailable: [
      "Conversions, sales and commission — these only exist when an affiliate network reports them, and none has yet",
    ],
    lastCheckedAt: CHECKED,
    ownerAction: null,
    secretStorage: "None — first-party data in D1 (binding DB). No credential involved.",
    notes:
      "Clicks logged before this release carry product/offer/retailer but no page context, so they count as partial or minimal rather than attributed. Logging failures never block the redirect, so totals may under-report but never over-report.",
  },
  {
    id: "amazon-associates",
    name: "Amazon Associates US",
    provider: "Amazon (tag botplanet-20)",
    status: "no_access",
    dashboard: "affiliate-program.amazon.com → Reports → Earnings / Link type performance",
    dashboardLink: "https://affiliate-program.amazon.com/home/reports",
    dataAvailable: [],
    dataUnavailable: [
      "Amazon-side clicks",
      "Ordered items and shipped items",
      "Conversion rate",
      "Earnings and bounty revenue",
    ],
    lastCheckedAt: CHECKED,
    ownerAction:
      "No setup needed — the programme is approved and live. To report figures, log in at affiliate-program.amazon.com → Reports → Earnings, set the date range, and paste the totals into the daily brief. Automated reporting would require Amazon's reporting API, which is not requested for this job.",
    secretStorage:
      "Amazon Associates login is Danny's account (password manager). The tracking tag botplanet-20 is public and lives in apps/web/src/lib/site.ts.",
    notes:
      "Programme approved and live on all ten launch products. BotPlanet cannot read Amazon's dashboard programmatically, so Amazon-side figures are owner-supplied, not system-connected.",
  },
  {
    id: "cj-affiliate",
    name: "CJ Affiliate (Aiper application)",
    provider: "CJ (publisher 8029924)",
    status: "not_connected",
    dashboard: "members.cj.com → Reports → Performance",
    dashboardLink: "https://members.cj.com",
    dataAvailable: [],
    dataUnavailable: ["Clicks", "Commissions", "Advertiser-approved links"],
    lastCheckedAt: CHECKED,
    ownerAction:
      "Wait for the Aiper (advertiser 6404897) decision, then log in at members.cj.com → Reports → Performance. No BotPlanet configuration is needed until approval.",
    secretStorage: "CJ personal access token would live in a Worker secret named CJ_API_TOKEN if automated reporting is approved later. Not stored today.",
    notes: "Application submitted and awaiting the advertiser's decision, so there is nothing to report yet.",
  },
  {
    id: "awin",
    name: "Awin (WYBOT, EU/UK)",
    provider: "Awin (publisher 3012175)",
    status: "no_data_yet",
    dashboard: "ui.awin.com → Reports → Performance",
    dashboardLink: "https://ui.awin.com",
    dataAvailable: ["Account is approved, so the dashboard is reachable"],
    dataUnavailable: [
      "US figures — the WYBOT programme is EU/UK only and is not used for US traffic",
    ],
    lastCheckedAt: CHECKED,
    ownerAction: null,
    secretStorage: "Awin API token would live in a Worker secret named AWIN_API_TOKEN if a UK market is launched. Not stored today.",
    notes: "Parked deliberately until a UK market exists. It must not appear in US reporting.",
  },
];

/**
 * Re-derive the statuses that depend on runtime configuration, so the admin view
 * reflects what is actually deployed rather than what was true when this file
 * was written.
 */
export function resolveStatus(system: ReportingSystem, env: { analyticsToken?: string; searchConsoleToken?: string }): ConnectionStatus {
  if (system.id === "site-analytics") {
    // A token means the beacon ships; whether Cloudflare has recorded views can
    // only be confirmed in the dashboard, so this stays "configured".
    return env.analyticsToken ? "configured" : "not_connected";
  }
  if (system.id === "google-search-console") {
    // The tag being present is not verification — Danny must press Verify.
    return env.searchConsoleToken ? "configured" : "not_connected";
  }
  return system.status;
}
