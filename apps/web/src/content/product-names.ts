/**
 * Retired product URLs.
 *
 * Two records changed the machine they describe on 3 August 2026, at the
 * owner's direction:
 *
 *   /aiper-scuba-x1/    →  Aiper Scuba X1 Pro       (same brand, up the range)
 *   /dolphin-premier/   →  BuBlue Bubot 800P Gen2   (different manufacturer)
 *
 * D1 now holds the corrected slug, name and brand, so nothing here overrides
 * what the database says — the database is right. What remains is the debt the
 * rename created: both old URLs were published in the sitemap and could have
 * been linked or indexed. They must not 404, and they must not keep serving a
 * page under a name that no longer matches, so each answers with a permanent
 * redirect to where the product actually lives.
 *
 * These entries are not decoration. Delete one and a published URL starts
 * returning 404 for a product that still exists.
 */

export interface RetiredSlug {
  /** Where the old URL now points. */
  to: string;
  /** What the record held when that URL was published. */
  wasNamed: string;
  /** What it holds now. */
  isNamed: string;
  changedOn: string;
  reason: string;
}

export const RETIRED_SLUGS: Record<string, RetiredSlug> = {
  /* Both of these point at the FINAL destination, not at each other. The
     record moved twice in one day — X1 → X1 Pro → X1 Pro Max — and a chain of
     301s is a chain of chances to lose a visitor. Each retired URL gets there
     in a single hop. */
  "aiper-scuba-x1": {
    to: "aiper-scuba-x1-pro-max",
    wasNamed: "Aiper Scuba X1",
    isNamed: "Aiper Scuba X1 Pro Max",
    changedOn: "2026-08-03",
    reason:
      "Aiper's own page for the URL this record was built against is titled 'Scuba X1 Essential' — the entry model of an X1 Essential / X1 Pro / X1 Pro Max family — and its Amazon listing had no buying option at all. The owner supplied the Pro's listing and artwork and confirmed the Pro is what BotPlanet should sell. The record then moved again the same day, to the Pro Max, when the owner supplied that listing instead. Every observation the record held was read from the Essential's page and was removed rather than carried across.",
  },
  "aiper-scuba-x1-pro": {
    to: "aiper-scuba-x1-pro-max",
    wasNamed: "Aiper Scuba X1 Pro",
    isNamed: "Aiper Scuba X1 Pro Max",
    changedOn: "2026-08-03",
    reason:
      "Held the Scuba X1 Pro for part of one day. The only listing supplied for the Pro turned out to be the base X1 bundled with a HydroComm Pro monitor, so the Pro never had a buy link; the owner then supplied the Pro Max, whose Amazon listing names itself unambiguously (Model Name \"Scuba X1 Pro Max\"). This URL was live briefly and is redirected rather than left to 404.",
  },
  "dolphin-premier": {
    to: "bublue-bubot-800p",
    wasNamed: "Dolphin Premier",
    isNamed: "BuBlue Bubot 800P Gen2",
    changedOn: "2026-08-03",
    reason:
      "The Dolphin Premier was withdrawn on 31 July: no manufacturer page, a manual covering a different machine, and no Amazon US listing at all. The owner replaced it with the BuBlue Bubot 800P Gen2, whose identity was machine-read from its listing the same day — Brand BUBLUE, Model Number 'Bubot 800P gen2'. A different manufacturer, so the brand row changed too. The Dolphin's own evidence is kept whole in RETIRED_VERIFICATIONS.",
  },
};

/**
 * Resolve an incoming URL segment.
 *
 * Returns the slug to query D1 with, and — when the visitor arrived on a
 * retired URL — where to send them instead.
 */
export function resolveSlug(requested: string): { storedSlug: string; redirectTo: string | null } {
  const retired = RETIRED_SLUGS[requested];
  return retired ? { storedSlug: retired.to, redirectTo: retired.to } : { storedSlug: requested, redirectTo: null };
}
