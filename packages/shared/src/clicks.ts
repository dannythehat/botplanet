/**
 * Affiliate click attribution helpers.
 *
 * Pure functions shared by the `/go/:key` redirect (which writes click events)
 * and the internal reporting view (which reads them), so logging and reporting
 * agree on what a click record actually means.
 *
 * PRIVACY: a source page is reduced to a same-site *path*. Query strings are
 * always discarded so BotMatch questionnaire answers can never reach an
 * attribution row, and off-site referrers are dropped entirely.
 *
 * TRUTH: an outbound click is never a sale. These helpers only describe how
 * well a click is attributed; conversions come exclusively from network reports.
 */

/** Which destination the redirect actually sent the visitor to. */
export type DestinationKind =
  | "offer_destination" // the retailer's real affiliate-tracked product URL
  | "amazon_search" // compliant Amazon Associates search link (no ASIN stored yet)
  | "retailer_home" // retailer homepage — outbound, but not product-specific
  | "unavailable"; // nothing safe to redirect to; no click is recorded

/** Page family a click came from, inferred from the internal source path. */
export type PageType =
  | "home"
  | "category"
  | "product"
  | "compare"
  | "botmatch"
  | "recommendation"
  | "editorial"
  | "other";

export type DeviceClass = "mobile" | "tablet" | "desktop";

/**
 * How completely a click is attributed. Reporting must be able to separate a
 * fully-attributed product click from a thin record, rather than presenting one
 * inflated total.
 *
 *  - `attributed`: product + offer known AND sent to the real affiliate
 *    destination AND page context captured.
 *  - `partial`: product + offer known, but either the destination was a
 *    non-deep-linked fallback or some page context is missing.
 *  - `minimal`: product or offer unknown, or only a retailer homepage was
 *    reachable. Countable as outbound traffic, not as a product click.
 */
export type ClickCompleteness = "attributed" | "partial" | "minimal";

export interface ClickContext {
  productId?: string | null;
  offerId?: string | null;
  destinationKind?: DestinationKind | null;
  sourcePage?: string | null;
  pageType?: PageType | string | null;
  deviceClass?: DeviceClass | string | null;
}

const blank = (v: string | null | undefined): boolean => v == null || v.trim() === "";

/**
 * True when a string is a destination we are willing to redirect a visitor to.
 * Only absolute http(s) URLs with a real host pass — this is what stops
 * `javascript:`, `data:`, protocol-relative and relative values from ever
 * reaching a `Location` header.
 */
export function isSafeAffiliateDestination(url: string | null | undefined): boolean {
  if (blank(url)) return false;
  let parsed: URL;
  try {
    parsed = new URL(url as string);
  } catch {
    return false; // relative or malformed — never redirected to
  }
  if (parsed.protocol !== "https:" && parsed.protocol !== "http:") return false;
  // A hostname must exist and look like a real domain (rejects "https://" alone).
  return parsed.hostname.length > 0 && parsed.hostname.includes(".");
}

/**
 * Reduce a `Referer` header to a same-site path for attribution.
 * Returns null for off-site, missing or unparseable referrers. Query strings and
 * fragments are always stripped (privacy rule above).
 */
export function resolveSourcePath(referer: string | null | undefined, allowedHosts: string[]): string | null {
  if (blank(referer)) return null;
  let parsed: URL;
  try {
    parsed = new URL(referer as string);
  } catch {
    return null;
  }
  const host = parsed.hostname.toLowerCase();
  const allowed = allowedHosts.some((h) => {
    const clean = h.toLowerCase().split(":")[0];
    return host === clean || host.endsWith("." + clean);
  });
  if (!allowed) return null;
  return parsed.pathname || "/";
}

/** Classify an internal path into a page family. */
export function pageTypeFromPath(path: string | null | undefined): PageType | null {
  if (blank(path)) return null;
  const p = (path as string).toLowerCase();
  if (p === "/" ) return "home";
  if (p.startsWith("/botmatch/")) return "botmatch";
  if (p.startsWith("/recommendation/")) return "recommendation";
  if (p.startsWith("/compare/")) return "compare";
  if (p.startsWith("/robots/")) {
    // /robots/<category>/ is the hub; /robots/<category>/<slug>/ is a product.
    const parts = p.split("/").filter(Boolean); // ["robots", category, slug?]
    return parts.length >= 3 ? "product" : "category";
  }
  const editorial = ["/about", "/how-botmatch-works", "/editorial-policy", "/review-methodology", "/affiliate-disclosure", "/privacy"];
  if (editorial.some((e) => p.startsWith(e))) return "editorial";
  return "other";
}

/**
 * Coarse device class from a User-Agent string. Deliberately crude: it is used
 * only to split reporting three ways, never to identify a visitor.
 */
export function deviceClassFromUserAgent(ua: string | null | undefined): DeviceClass | null {
  if (blank(ua)) return null;
  const s = (ua as string).toLowerCase();
  if (/ipad|tablet|playbook|silk|kindle/.test(s)) return "tablet";
  if (/android(?!.*mobile)/.test(s)) return "tablet";
  if (/mobi|iphone|ipod|phone|android/.test(s)) return "mobile";
  return "desktop";
}

/** Classify how completely a click record is attributed. */
export function clickCompleteness(c: ClickContext): ClickCompleteness {
  const hasCore = !blank(c.productId) && !blank(c.offerId);
  if (!hasCore) return "minimal";
  if (c.destinationKind === "retailer_home" || c.destinationKind === "unavailable") return "minimal";
  const hasContext = !blank(c.sourcePage) && !blank(c.pageType as string) && !blank(c.deviceClass as string);
  if (c.destinationKind === "offer_destination" && hasContext) return "attributed";
  return "partial";
}

/** Roll a set of click records up into honest counts by completeness. */
export function summariseClickQuality(rows: ClickContext[]): {
  total: number;
  attributed: number;
  partial: number;
  minimal: number;
} {
  const out = { total: rows.length, attributed: 0, partial: 0, minimal: 0 };
  for (const r of rows) out[clickCompleteness(r)] += 1;
  return out;
}
