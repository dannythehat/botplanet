/**
 * Data provenance & verification status.
 *
 * Every commercially or editorially meaningful field in the seed carries a
 * verification status so the platform never presents a research snapshot as
 * live truth. See docs/SEED-PROVENANCE.md.
 */
export type VerificationStatus =
  | "verified" // confirmed against a primary source and current
  | "provisional" // researched but not yet confirmed / may change
  | "snapshot" // point-in-time value (e.g. a price on a given date)
  | "unconfirmed"; // not yet established — treat as unknown

/** Freshness class for an offer's price/stock/shipping data. */
export type FreshnessClass =
  | "live" // API / feed / retailer integration
  | "recently_verified" // manually checked within the freshness window
  | "indicative"; // retailer guidance, not confirmed for this customer

/** Evidence level backing a product claim (drives the on-page label). */
export const EVIDENCE_LEVELS = [
  "tested", // BotPlanet hands-on testing (only original evidence media can back this)
  "hands_on_demo",
  "researched",
  "verified_owner",
  "manufacturer_claimed",
  "unconfirmed_spec",
] as const;
export type EvidenceLevel = (typeof EVIDENCE_LEVELS)[number];
