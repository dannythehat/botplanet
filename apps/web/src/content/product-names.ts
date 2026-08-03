/**
 * Display-name overrides.
 *
 * The name a visitor reads normally comes from D1, which is right: the database
 * is the catalogue. But a product's IDENTITY is settled in this repository, in
 * the verification registry, and the two can disagree — a model gets renamed,
 * or a record moves to a successor — at a moment when nobody can reach the
 * database. When that happens the repo must win, because the repo is where the
 * decision was reviewed and where the evidence for it lives.
 *
 * So this is not a place to make names prettier. An entry belongs here only
 * when the stored name is WRONG about which machine the record describes, and
 * every entry says what changed and why. When D1 is next updated the row and
 * the override agree, and the entry can be deleted without anything moving.
 */

export interface NameOverride {
  /** What the visitor should read. */
  name: string;
  /** The name currently stored in D1, so a silent drift is visible here. */
  wasNamed: string;
  changedOn: string;
  reason: string;
}

export const PRODUCT_NAME_OVERRIDES: Record<string, NameOverride> = {
  "prod-aiper-scuba-x1": {
    name: "Aiper Scuba X1 Pro",
    wasNamed: "Aiper Scuba X1",
    changedOn: "2026-08-03",
    reason:
      "The record moved from the base model to the Pro at the owner's direction. Aiper's own page at the URL this record was built against is titled 'Scuba X1 Essential', so the stored record described the entry model in an X1 Essential / X1 Pro / X1 Pro Max family. The owner supplied the Pro's listing and artwork and confirmed the Pro is what BotPlanet should sell. The route still reads /aiper-scuba-x1/ because the slug lives in D1; a URL is an identifier, not a claim, and changing a published one costs more than it is worth here.",
  },
};

/**
 * The name to render. Falls back to whatever D1 holds, so a product with no
 * override — which is nearly all of them — behaves exactly as it did before.
 */
export const displayName = (productId: string, storedName: string): string =>
  PRODUCT_NAME_OVERRIDES[productId]?.name ?? storedName;
