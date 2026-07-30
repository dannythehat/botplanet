/**
 * Public accountability / EEAT identity.
 *
 * HONESTY RULE: we never claim hands-on testing or expertise we don't have.
 * BotPlanet currently operates as a research-led editorial project. Product
 * recommendations are built from manufacturer specifications, retailer data
 * and aggregated owner feedback — each labelled by evidence level. Hands-on
 * "tested" status is only ever applied when a real review unit has been used.
 *
 * Expanding the named editorial team (additional authors, an independent
 * fact-checker) is a Danny-owned decision — do not invent people or credentials.
 */
import { SITE } from "../lib/site";

export interface Author {
  id: string;
  name: string;
  role: string;
  path: string;
  bio: string;
  /** Honest statement of what this person's involvement means. */
  accountability: string;
}

export const FOUNDER: Author = {
  id: "danny",
  name: SITE.founder.name,
  role: SITE.founder.title,
  path: "/about/",
  bio: SITE.founder.bio,
  accountability:
    "Danny is accountable for every recommendation published on BotPlanet and for keeping BotMatch independent of commission.",
};

/**
 * The review "voice" attached to editorial pages. Until an independent
 * fact-checker is appointed, editorial accountability sits with the founder,
 * stated plainly rather than dressed up as a larger team.
 */
export const EDITORIAL = {
  author: FOUNDER,
  reviewer: FOUNDER,
  /** How current recommendations are actually produced (shown to readers). */
  method:
    "Research-led. Recommendations are built from manufacturer specifications, verified retailer data and aggregated owner feedback — not paid placement. Where we have not physically used a unit, we say so.",
  standingLabel: "Research-led review · not yet hands-on tested",
} as const;

/** Evidence labels — the only vocabulary allowed for product claims. */
export const EVIDENCE_LABELS = {
  researched: { label: "Researched", tone: "muted", desc: "Compiled from public manufacturer and retailer information." },
  manufacturer_verified: { label: "Manufacturer data verified", tone: "ok", desc: "Confirmed against the manufacturer's official specification." },
  retailer_checked: { label: "Retailer data checked", tone: "ok", desc: "Price and availability checked at an approved US retailer." },
  hands_on: { label: "Hands-on tested", tone: "class", desc: "BotPlanet physically used this unit under our review method." },
  review_unit: { label: "Review unit supplied", tone: "class", desc: "Unit supplied for review; editorial independence retained." },
  customer_evidence: { label: "Customer evidence reviewed", tone: "muted", desc: "Aggregated from verified owner reviews and reported experience." },
} as const;

export type EvidenceKey = keyof typeof EVIDENCE_LABELS;
