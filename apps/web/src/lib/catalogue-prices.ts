/**
 * The price a listing card is allowed to show.
 *
 * WHY THIS EXISTS. Two surfaces — the category hub and the comparison page —
 * used to read `offers.base_price_minor` straight out of D1 and print the
 * lowest one. That is a seeded figure with no check date and no freshness
 * gate, and on 6 August 2026 it was found publishing the retired Dolphin
 * Premier's $1,299 against the BuBlue Bubot 800P, a machine the checker had
 * read at $799.97 two days earlier. The record had changed product; the offer
 * row had not.
 *
 * The review pages were never wrong about this, because they go through the
 * offer-truth engine and read `refresh_observations` — the table the scheduled
 * price checker writes, where every row carries the date it was read and
 * whether identity was confirmed. So the site had two price paths and only one
 * of them was honest. This is the other one, corrected.
 *
 * THE RULES, WHICH ARE THE SAME RULES THE BUY BOX FOLLOWS:
 *
 *   - Only `accepted = 1` observations count. A suppressed reading stays in
 *     the table as evidence and never reaches a page.
 *   - An observation with no price is not an offer. No price is shown.
 *   - Every price carries the date it was read. A card that cannot show a date
 *     does not show a figure either.
 *   - Nothing falls back to the seeded offer row. Fail closed: no price on a
 *     card is a small loss, a wrong price is a broken promise.
 */
import { latestAcceptedObservations } from "./providers/refresh-store";

export interface CataloguePrice {
  priceMinor: number;
  /** ISO date the retailer page was actually read. */
  checkedDate: string;
}

/**
 * Latest accepted price per product, for a whole page of cards.
 *
 * One query for the page, not one per card. Products with no accepted priced
 * observation are simply absent from the map, and a caller must treat absence
 * as "no price to show" rather than looking somewhere else for one.
 */
export async function cataloguePrices(db: D1Database): Promise<Map<string, CataloguePrice>> {
  const out = new Map<string, CataloguePrice>();
  let rows: Awaited<ReturnType<typeof latestAcceptedObservations>>;
  try {
    rows = await latestAcceptedObservations(db);
  } catch (err) {
    /* Explicit and logged. A silent fallback to the seeded rows is precisely
       the failure this module was written to remove — the page renders with no
       prices, which is honest, rather than with old ones, which is not. */
    console.error("[catalogue-prices] D1 unreachable; rendering without prices", err);
    return out;
  }

  for (const r of rows) {
    if (r.priceMinor === null || !r.checkedDate) continue;
    const existing = out.get(r.productId);
    // Newest wins if the query ever returns more than one row for a product.
    if (!existing || r.checkedDate > existing.checkedDate) {
      out.set(r.productId, { priceMinor: r.priceMinor, checkedDate: r.checkedDate });
    }
  }
  return out;
}

/** "Checked 4 Aug 2026" — the date goes beside the figure, always. */
export function checkedNote(checkedDate: string): string {
  const d = new Date(`${checkedDate}T00:00:00Z`);
  if (Number.isNaN(d.getTime())) return "Checked at the retailer";
  const day = d.getUTCDate();
  const month = d.toLocaleString("en-US", { month: "short", timeZone: "UTC" });
  return `Checked ${day} ${month} ${d.getUTCFullYear()} · confirm at retailer`;
}
