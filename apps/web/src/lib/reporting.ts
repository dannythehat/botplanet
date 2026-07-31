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

/**
 * GA4 measurement ID. Public by design — it is rendered into every production
 * page — so it is versioned config, not a secret. The deployed value comes from
 * wrangler.toml [vars] GA_MEASUREMENT_ID; this constant labels it in reporting.
 */
export const GA_MEASUREMENT_ID = "G-EEHDN6DNZN";

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
    metric: "Page views & sessions",
    path: "analytics.google.com → BotPlanet → Reports → Engagement → Pages and screens",
    link: "https://analytics.google.com/",
    note: "GA4 is the page-view system of record; Cloudflare covers edge traffic that a tag cannot see.",
  },
  {
    metric: "Performance (Core Web Vitals)",
    path: "Google Search Console → Core Web Vitals, or PageSpeed Insights for a single URL",
    link: "https://search.google.com/search-console",
    note: "Cloudflare Web Analytics was removed, so CWV field data comes from Search Console once traffic accrues.",
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
    provider: `Google Analytics 4 (${GA_MEASUREMENT_ID})`,
    // Verified live in the production HTML after deployment: gtag.js loads and
    // exactly one config call is present. See notes for the verification basis.
    status: "connected",
    dashboard: "analytics.google.com → BotPlanet property → Reports → Realtime / Engagement → Pages and screens",
    dashboardLink: "https://analytics.google.com/",
    dataAvailable: [
      "Page views and sessions",
      "Active users and realtime traffic",
      "Traffic sources and referrers",
      "Landing pages and top pages",
      "Country, device and browser breakdown",
      "Events (default GA4 enhanced measurement)",
    ],
    dataUnavailable: [
      "Affiliate conversions and commission — GA4 never sees a retailer's checkout; those figures come only from network reports",
      "Custom BotMatch or /go events — not configured in this job",
    ],
    lastCheckedAt: CHECKED,
    ownerAction: null,
    secretStorage:
      "None. The GA4 measurement ID is public by design and lives in apps/web/wrangler.toml [vars] GA_MEASUREMENT_ID. No Google credential, service account or API key is stored anywhere.",
    notes:
      "Loaded once from Base.astro, async, with window.dataLayer initialised and a single gtag('config') call. Renders only on botplanet.io — never in local development and never on a preview or workers.dev host. Cloudflare Web Analytics was deliberately removed so two page-view systems are not installed at once.",
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
      "Per-URL page views and sessions — these come from GA4, which is the page-view system of record",
    ],
    lastCheckedAt: CHECKED,
    ownerAction: null,
    secretStorage:
      "Cloudflare API tokens are NOT stored in the repository, D1, Notion or routines. Dashboard access is Danny's Cloudflare login; any deploy token lives only in Danny's password manager.",
    notes:
      "Kept deliberately separate from GA4: Cloudflare reports edge-side truth (requests, bandwidth, status codes, Worker health, deployments) that a JavaScript tag cannot see, including traffic from visitors who block analytics. Dashboard reporting needs no token — it is read by logging in.",
  },
  {
    id: "google-search-console",
    name: "Google Search Console",
    provider: "Google (domain property sc-domain:botplanet.io)",
    status: "connected",
    dashboard: "search.google.com/search-console → property sc-domain:botplanet.io → Performance / Pages / Sitemaps",
    dashboardLink: "https://search.google.com/search-console",
    dataAvailable: [
      "Clicks, impressions, CTR and average position",
      "Queries and pages",
      "Index coverage",
      "Sitemap processing status",
      "Core Web Vitals field data (once enough traffic accrues)",
    ],
    dataUnavailable: [
      "Search figures for a brand-new site read as zero until Google has crawled and accumulated data — that is 'no data yet', not a broken connection",
    ],
    lastCheckedAt: CHECKED,
    ownerAction:
      "Optional, once: Search Console → Sitemaps → Add a new sitemap → enter sitemap.xml → Submit. Everything else is done — the domain property is verified.",
    secretStorage:
      "None required. GOOGLE_SITE_VERIFICATION is unnecessary because sc-domain:botplanet.io is already verified via DNS, which covers every URL prefix on the domain. Search Console access is Danny's Google login.",
    notes:
      "Verification confirmed by the owner. Site readiness independently checked: production canonical is https://botplanet.io, robots.txt allows production while disallowing preview hosts, /sitemap.xml lists 20 production URLs with no preview leakage, and there is no production-wide noindex.",
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
    name: "CJ Affiliate (Aiper)",
    provider: "CJ (publisher 8029924, website/property 101845913)",
    status: "connected",
    dashboard: "members.cj.com → Reports → Performance",
    dashboardLink: "https://members.cj.com",
    dataAvailable: ["Approved creatives", "Product feed metadata", "Advertiser relationship"],
    dataUnavailable: ["Product imagery — the advertiser's catalogue is empty", "Product video — no video creatives exist"],
    lastCheckedAt: "2026-07-31",
    ownerAction:
      "Ask Aiper through the CJ advertiser contact to populate their product feed. The programme is live and readable; the gap is that Aiper has published no products to it.",
    secretStorage: "CJ personal access token is stored as the Worker secret CJ_API_TOKEN. The value is never in the repository, in D1 or in any page.",
    notes:
      "APPROVED and verified live on 2026-07-31: link-search returned 12 approved creatives for advertiser 6404897 (Aiper), and shoppingProductFeeds returned feed 17133094. The catalogue itself holds 0 products and none of the 12 creatives is product media, so CJ supplies no Aiper imagery today.",
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
export function resolveStatus(system: ReportingSystem, env: { gaMeasurementId?: string }): ConnectionStatus {
  if (system.id === "site-analytics") {
    // GA4 is recorded as connected only because the deployed production HTML was
    // verified to load gtag.js with exactly one config call. If the deployment
    // ever loses its measurement ID, the tag cannot ship — so the register must
    // stop claiming a connection rather than repeat a stale "connected".
    if (!env.gaMeasurementId) return "not_connected";
    return env.gaMeasurementId === GA_MEASUREMENT_ID ? system.status : "configured";
  }
  return system.status;
}
