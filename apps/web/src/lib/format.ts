/** Format integer minor units (cents) as a USD price. */
export function usd(minor: number | null | undefined): string {
  if (minor === null || minor === undefined) return "Price unavailable";
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(minor / 100);
}

/** Human label for a freshness class. */
export function freshnessLabel(freshnessClass: string | null): string {
  switch (freshnessClass) {
    case "live":
      return "Live price";
    case "recently_verified":
      return "Recently checked";
    default:
      return "Check current price";
  }
}

export function titleCase(s: string): string {
  return s.replace(/(^|[\s-])\w/g, (m) => m.toUpperCase()).replace(/-/g, " ");
}
