/**
 * Source registry.
 *
 * Every source a value can be attributed to, classified by type and publisher.
 * Classification is by host, so a new URL from a known publisher inherits the
 * right authority automatically and an unrecognised host is never silently
 * treated as authoritative — it falls to the lowest tier and is flagged.
 */
import type { SourceType } from "./types";

interface HostRule {
  match: RegExp;
  type: SourceType;
  publisher: string;
}

/**
 * Host classification. Manufacturer domains are listed explicitly; anything
 * unmatched is treated as editorial research, never as a manufacturer fact.
 */
const HOST_RULES: HostRule[] = [
  { match: /(^|\.)aiper\.com$/i, type: "manufacturer_page", publisher: "Aiper" },
  { match: /(^|\.)beatbot\.com$/i, type: "manufacturer_page", publisher: "Beatbot" },
  { match: /(^|\.)bettabot\.com$/i, type: "manufacturer_page", publisher: "Betta" },
  { match: /(^|\.)wybotpool\.com$/i, type: "manufacturer_page", publisher: "WYBOT" },
  { match: /(^|\.)maytronics\.com$/i, type: "manufacturer_page", publisher: "Maytronics (Dolphin)" },
  { match: /(^|\.)polarispool\.com$/i, type: "manufacturer_page", publisher: "Polaris" },
  // Added 4 August 2026. An earlier record tried bubluepool.com, which does
  // not resolve — the real domain is bublue.com, and the wrong-domain error is
  // owned in the Bubot 800P review rather than papered over.
  { match: /(^|\.)bublue\.com$/i, type: "manufacturer_page", publisher: "BUBLUE" },
  { match: /(^|\.)premierrobotic\.com$/i, type: "retailer_listing", publisher: "Premier Robotic" },
  { match: /(^|\.)amazon\.com$/i, type: "retailer_listing", publisher: "Amazon" },
  { match: /(^|\.)lesliespool\.com$/i, type: "retailer_listing", publisher: "Leslie's Pool Supplies" },
  { match: /(^|\.)pcworld\.com$/i, type: "editorial_research", publisher: "PCWorld" },
  { match: /(^|\.)poolbots\.com$/i, type: "editorial_research", publisher: "PoolBots" },
];

/**
 * Manufacturer-authored content hosted on a retailer's page, allowlisted by
 * EXACT URL.
 *
 * Amazon A+ content is written and uploaded by the brand; the retailer only
 * hosts it. That makes it manufacturer-origin evidence, and it is admitted as
 * such — but one URL at a time, never by host. Classifying by host would make
 * every Amazon page a manufacturer source overnight, including the parts a
 * seller writes, which is exactly the confusion the source hierarchy exists to
 * prevent. Each entry names who authorised it and when it was captured, because
 * this content can be replaced without notice on a domain we do not control.
 */
export interface RetailerHostedManufacturerSource {
  url: string;
  publisher: string;
  /** The retailer identifier the capture is anchored to, e.g. an ASIN. */
  retailerProductId: string;
  capturedOn: string;
  capturedBy: string;
  /** Who cleared it, so the exception is traceable to a decision. */
  authorisedBy: string;
  note: string;
}

export const RETAILER_HOSTED_MANUFACTURER_SOURCES: RetailerHostedManufacturerSource[] = [
  {
    url: "https://www.amazon.com/dp/B0BX9DJS7R#aplus",
    publisher: "Polaris (A+ content, hosted by Amazon)",
    retailerProductId: "B0BX9DJS7R",
    capturedOn: "2026-07-31",
    capturedBy: "owner (browser screen capture of the A+ panels on the listing)",
    authorisedBy: "ChatGPT, narrow Job 8 evidence correction, 2026-07-31",
    note:
      "Polaris-authored A+ panels on the exact FREEDOM listing. Carries the brand's own typography and product photography and states two figures the Polaris support page and owner's manual do not: the maximum pool length and a charge time. Cannot be re-read by fetch — Amazon serves inconsistent markup to non-browser clients — so re-verification is a human task and the capture date is the freshness anchor.",
  },
];

const allowlisted = (url: string) => RETAILER_HOSTED_MANUFACTURER_SOURCES.find((s) => s.url === url);

export interface ClassifiedSource {
  type: SourceType;
  publisher: string;
  /** True when the host was recognised; false means lowest authority + flag. */
  recognised: boolean;
}

export function classifySource(url: string): ClassifiedSource {
  // Exact-URL allowlist first: it must beat the host rule that would otherwise
  // file this under the retailer that merely hosts it.
  const hosted = allowlisted(url);
  if (hosted) return { type: "manufacturer_content_on_retailer", publisher: hosted.publisher, recognised: true };

  let host = "";
  try {
    host = new URL(url).hostname;
  } catch {
    return { type: "editorial_research", publisher: "Unrecognised source", recognised: false };
  }
  const rule = HOST_RULES.find((r) => r.match.test(host));
  if (!rule) return { type: "editorial_research", publisher: host, recognised: false };
  return { type: rule.type, publisher: rule.publisher, recognised: true };
}

/** A URL that ends in a document extension is treated as a manufacturer document. */
export function isDocument(url: string): boolean {
  return /\.(pdf|docx?)($|\?)/i.test(url);
}
