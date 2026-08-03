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
  /** Set when the maker changed too, not just the model name. */
  brand?: string;
  wasBranded?: string;
  changedOn: string;
  reason: string;
  /**
   * Set when the route no longer describes what is on the page. A slug lives in
   * D1 and cannot be changed from here, so this records the debt in the open
   * rather than letting a stale URL pass unnoticed.
   */
  slugIsWrong?: string;
}

export const PRODUCT_NAME_OVERRIDES: Record<string, NameOverride> = {
  "prod-aiper-scuba-x1": {
    name: "Aiper Scuba X1 Pro",
    wasNamed: "Aiper Scuba X1",
    changedOn: "2026-08-03",
    reason:
      "The record moved from the base model to the Pro at the owner's direction. Aiper's own page at the URL this record was built against is titled 'Scuba X1 Essential', so the stored record described the entry model in an X1 Essential / X1 Pro / X1 Pro Max family. The owner supplied the Pro's listing and artwork and confirmed the Pro is what BotPlanet should sell. The route still reads /aiper-scuba-x1/ because the slug lives in D1; a URL is an identifier, not a claim, and changing a published one costs more than it is worth here.",
  },
  "prod-dolphin-premier": {
    name: "BuBlue Bubot 800P Gen2",
    wasNamed: "Dolphin Premier",
    brand: "BUBLUE",
    wasBranded: "Dolphin",
    changedOn: "2026-08-03",
    reason:
      "The Dolphin Premier was withdrawn on 31 July: no manufacturer page, a manual that covers a different machine, and no Amazon US listing at all. The owner replaced it with the BuBlue Bubot 800P Gen2 on 3 August. Unlike the Aiper X1 move, this is a DIFFERENT MANUFACTURER, so the brand is overridden too. The identity is not owner-assertion this time — the Amazon listing read cleanly on 3 August and published Brand 'BUBLUE', Manufacturer 'BUBLUE' and Model Number 'Bubot 800P gen2'. The owner's message said '880P'; the listing, and the owner's own artwork, both say 800P, so 800P is used.",
    slugIsWrong:
      "The route is still /robots/robotic-pool-cleaners/dolphin-premier/ and now serves a BuBlue. That is worse than a merely dated slug — it names a different manufacturer's product — and it can only be fixed by changing the row in D1, which this environment cannot write to. Until then the page itself is correct in every visible respect and only the URL lies. Fix this before the URL is promoted anywhere.",
  },
};

/**
 * The name to render. Falls back to whatever D1 holds, so a product with no
 * override — which is nearly all of them — behaves exactly as it did before.
 */
export const displayName = (productId: string, storedName: string): string =>
  PRODUCT_NAME_OVERRIDES[productId]?.name ?? storedName;

/** The maker to render. Only differs when a record moved between brands. */
export const displayBrand = (productId: string, storedBrand: string | undefined): string | undefined =>
  PRODUCT_NAME_OVERRIDES[productId]?.brand ?? storedBrand;

/** Routes that no longer describe their own page. Surfaced so they get fixed. */
export const wrongSlugs = () =>
  Object.entries(PRODUCT_NAME_OVERRIDES)
    .filter(([, o]) => o.slugIsWrong)
    .map(([productId, o]) => ({ productId, detail: o.slugIsWrong! }));
