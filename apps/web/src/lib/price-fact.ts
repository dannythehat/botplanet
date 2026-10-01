/**
 * Reconcile a review's typed "Price" fact with the live price the page already
 * shows in its buy box.
 *
 * WHY THIS EXISTS. Found 1 October 2026 by comparing every review's header with
 * its own buy box on the live site. Three pages contradicted themselves:
 *
 *   Husqvarna 410iQ   header $2,499.99    buy box $1,799.99
 *   WORX WR320        header $1,022.54    buy box $1,358.71
 *   eufy E15          header $1,199.99    buy box $1,299.99
 *
 * A reader sees both within one screen. The header figure is typed into
 * content/reviews.ts on the day somebody read the listing; the buy box comes
 * from the refresh service. They are two sources for one fact, and the typed
 * one rots.
 *
 * THE RULE. When a live price exists AND the header carries exactly one typed
 * figure AND the two differ, the live one wins and is dated. Everything else is
 * left alone, deliberately:
 *
 *  - NO LIVE PRICE: the typed figure stays. It is dated, and a dated figure is
 *    honest. Replacing it with "check the price" would throw away a fact the
 *    reader can use.
 *  - MORE THAN ONE TYPED FIGURE ("$2,399 (1500H) / $2,799 (3000H)", or the
 *    Yarbo's "$4,999 complete / $1,299 module only"): the figures ARE the
 *    content — they say which SKU costs what — and one live price for one SKU
 *    cannot stand in for them.
 *  - THEY AGREE: nothing to do. Cents and thousands separators are ignored, so
 *    "$599" and "$599.00" are the same price and not a conflict.
 */
export interface PriceFact {
  label: string;
  value: string;
}

/** "$1,199.99" -> 119999. Null when it is not a dollar amount. */
export const parseUsdMinor = (s: string | null | undefined): number | null => {
  if (!s) return null;
  const m = /\$\s*([\d,]+(?:\.\d{1,2})?)/.exec(s);
  if (!m) return null;
  const n = Number(m[1].replace(/,/g, ""));
  return Number.isFinite(n) ? Math.round(n * 100) : null;
};

const figures = (s: string): string[] => s.match(/\$\s*[\d,]+(?:\.\d{1,2})?/g) ?? [];

const longDate = (iso: string | null): string | null => {
  if (!iso) return null;
  const d = new Date(`${iso.slice(0, 10)}T00:00:00Z`);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
};

export function reconcilePriceFact(
  facts: PriceFact[],
  live: { price: string | null; checkedDate: string | null } | null,
): PriceFact[] {
  if (!live?.price) return facts;
  const liveMinor = parseUsdMinor(live.price);
  if (liveMinor === null) return facts;

  return facts.map((f) => {
    if (f.label !== "Price") return f;
    const typed = figures(f.value);
    if (typed.length !== 1) return f;
    if (parseUsdMinor(typed[0]) === liveMinor) return f;
    const when = longDate(live.checkedDate);
    return { ...f, value: when ? `${live.price}, checked ${when}` : live.price };
  });
}
