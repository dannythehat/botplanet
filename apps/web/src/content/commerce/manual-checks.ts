/**
 * Manually checked retailer data.
 *
 * WHY THIS EXISTS: the Amazon Creators API is gated behind full Associates
 * approval, which is itself gated behind qualifying sales. There is no API to
 * read a price from. The remaining honest route is a human opening the page and
 * writing down what it says — which is a legitimate source, not a workaround,
 * provided it carries a date and decays like any other.
 *
 * RULES THESE RECORDS FOLLOW:
 *   - the wording is verbatim, because "FREE delivery" and "FREE Prime
 *     delivery" are different states and the normaliser can only tell them
 *     apart if nobody tidies them first;
 *   - a `manual_check` has a three-day freshness window, after which the price
 *     stops being printed automatically rather than sitting there going quietly
 *     wrong;
 *   - the delivery location is recorded, because Amazon prices and shipping
 *     vary by destination and a price checked from the wrong country is not a
 *     US price;
 *   - the seller is recorded verbatim. A marketplace seller is not Amazon, and
 *     the returns route follows the seller.
 */

export interface ManualCheck {
  productId: string;
  retailerId: string;
  /** The identifier the check was performed against. */
  retailerProductId: string;
  /**
   * The product title as it appeared, so the ASIN's identity is evidenced by
   * something a person actually read rather than by a status code.
   */
  observedTitle: string;
  /** True when the observed title names the exact model we hold. */
  identityConfirmed: boolean;
  /** Minor units, from the buy box for the selected variant. */
  priceMinor: number | null;
  currency: string;
  /** Verbatim, e.g. "In Stock" or "Only 3 left in stock". */
  stockWording: string | null;
  /** Verbatim, e.g. "FREE delivery Sunday, August 2". */
  shippingWording: string | null;
  /** Verbatim seller line. Null when the page did not expose one. */
  sellerWording: string | null;
  /** Verbatim returns line offered by the seller or retailer. */
  returnsWording: string | null;
  /** The delivery location the price was quoted for. */
  checkedForLocation: string;
  checkedDate: string;
  checkedBy: string;
  notes: string;
}

export const MANUAL_CHECKS: ManualCheck[] = [
  {
    productId: "prod-dolphin-nautilus-cc-plus",
    retailerId: "ret-amazon",
    retailerProductId: "B09K4C9WGF",
    observedTitle:
      "Dolphin Nautilus CC Plus Wi-Fi Automatic Robotic Pool Vacuum Cleaner, Always Cleaning, Never Charging, with Wall Climbing Scrubber Brush, Ideal for In-Ground Pools up to 40 FT in Length",
    identityConfirmed: true,
    priceMinor: 74900,
    currency: "USD",
    stockWording: "In Stock",
    shippingWording: "FREE delivery Sunday, August 2",
    // NOT Amazon. A marketplace seller, so the returns route is theirs.
    sellerWording: "The Pool Spot",
    returnsWording: "FREE 30-day refund/replacement",
    checkedForLocation: "US, ZIP 90210",
    checkedDate: "2026-07-31",
    checkedBy: "owner",
    notes:
      "Listing carries several variants (Nautilus AG $568, Nautilus CC $599, CC Plus Wi-Fi $749, Caddy bundles); $749 is the price for the Wi-Fi variant we hold, shown as -6% against a typical price of $799. The observed title names the exact model AND independently corroborates the 40 ft maximum pool length verified from Maytronics in Job 8.",
  },
];

export const manualCheckFor = (productId: string, retailerId = "ret-amazon"): ManualCheck | undefined =>
  MANUAL_CHECKS.find((c) => c.productId === productId && c.retailerId === retailerId);
