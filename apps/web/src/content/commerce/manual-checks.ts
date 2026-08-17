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
 *   - a `manual_check` has a thirty-day freshness window, after which the price
 *     stops being printed automatically rather than sitting there going quietly
 *     wrong. Inside the window the price is only ever shown WITH its check date,
 *     which is what makes a three-week-old figure honest instead of a stale
 *     claim dressed as a live one;
 *   - only the NEW price is recorded. A listing that also offers a used or
 *     open-box copy is offering a different thing at a different price, and
 *     quoting the cheaper one would misrepresent what the buy button buys;
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
  {
    productId: "prod-polaris-freedom",
    retailerId: "ret-amazon",
    retailerProductId: "B0BX9DJS7R",
    observedTitle: "Polaris Freedom Cordless Robotic Pool Cleaner, Cable-Free",
    // Confirmed from the listing's own manufacturer A+ panels, which the owner
    // captured: they carry Polaris FREEDOM branding, the Easy-Charge station and
    // iAquaLink control. See notes for what that does and does not establish.
    identityConfirmed: true,
    // The NEW price only. The same listing offers a used copy at $934.82, which
    // is recorded as a refused candidate rather than quoted.
    priceMinor: 119900,
    currency: "USD",
    stockWording: "In Stock",
    shippingWording: "FREE delivery Thursday, August 6",
    // NOT RECORDED AS AMAZON. No seller line was visible in the capture, and the
    // Nautilus CC Plus turned out to be sold by a marketplace third party, so
    // assuming Amazon here would be a guess with a returns route attached to it.
    sellerWording: null,
    returnsWording: null,
    checkedForLocation: "US, Beverly Hills 90210",
    checkedDate: "2026-07-31",
    checkedBy: "owner",
    notes:
      "Buy-new price $1,199.00, shown as -14% against a $1,399.00 list price, with financing offered at $54.92/mo over 36 months (neither is recorded as a price). A faster Prime-only option was also shown — 'Or Prime members get FREE delivery Tomorrow, August 1' — but the non-member delivery statement is the one recorded, because a membership-dependent date is not the date most readers will get. Identity rests on the manufacturer A+ content in the capture rather than on the buy-box title, which was read separately by machine; the two agree, and the A+ panels also corroborate two fields Job 8 currently suppresses (in-ground pools up to 50 ft, and a 4-hour charge time), which is flagged for ChatGPT rather than acted on here.",
  },
];

export const manualCheckFor = (productId: string, retailerId = "ret-amazon"): ManualCheck | undefined =>
  MANUAL_CHECKS.find((c) => c.productId === productId && c.retailerId === retailerId);
