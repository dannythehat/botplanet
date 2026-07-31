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
  { match: /(^|\.)premierrobotic\.com$/i, type: "retailer_listing", publisher: "Premier Robotic" },
  { match: /(^|\.)amazon\.com$/i, type: "retailer_listing", publisher: "Amazon" },
  { match: /(^|\.)lesliespool\.com$/i, type: "retailer_listing", publisher: "Leslie's Pool Supplies" },
  { match: /(^|\.)pcworld\.com$/i, type: "editorial_research", publisher: "PCWorld" },
  { match: /(^|\.)poolbots\.com$/i, type: "editorial_research", publisher: "PoolBots" },
];

export interface ClassifiedSource {
  type: SourceType;
  publisher: string;
  /** True when the host was recognised; false means lowest authority + flag. */
  recognised: boolean;
}

export function classifySource(url: string): ClassifiedSource {
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
