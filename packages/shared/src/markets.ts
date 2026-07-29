/**
 * Market / locale / currency configuration.
 *
 * Products are GLOBAL. Everything commercial (offers, prices, stock, shipping,
 * affiliate programmes, disclosures) is MARKET-scoped. The US launches at the
 * root domain; other markets carry a path prefix. English-only markets ship at
 * launch (fr-CA deferred).
 */

export type MarketId = "us" | "ca" | "uk" | "au";
export type LocaleCode = "en-US" | "en-CA" | "fr-CA" | "en-GB" | "en-AU";
export type CurrencyCode = "USD" | "CAD" | "GBP" | "AUD";
export type MeasurementSystem = "imperial" | "metric";
export type LaunchStatus = "launch" | "planned" | "structural_only";

export interface MarketConfig {
  readonly id: MarketId;
  readonly name: string;
  /** URL path prefix. The primary launch market (US) lives at the root: "". */
  readonly pathPrefix: string;
  readonly defaultLocale: LocaleCode;
  readonly locales: readonly LocaleCode[];
  readonly currency: CurrencyCode;
  readonly measurement: MeasurementSystem;
  readonly launchStatus: LaunchStatus;
}

export const MARKETS: Readonly<Record<MarketId, MarketConfig>> = {
  us: {
    id: "us",
    name: "United States",
    pathPrefix: "",
    defaultLocale: "en-US",
    locales: ["en-US"],
    currency: "USD",
    measurement: "imperial",
    launchStatus: "launch",
  },
  ca: {
    id: "ca",
    name: "Canada",
    pathPrefix: "/ca",
    defaultLocale: "en-CA",
    // fr-CA is structurally supported but not shipped at launch.
    locales: ["en-CA"],
    currency: "CAD",
    measurement: "metric",
    launchStatus: "structural_only",
  },
  uk: {
    id: "uk",
    name: "United Kingdom",
    pathPrefix: "/uk",
    defaultLocale: "en-GB",
    locales: ["en-GB"],
    currency: "GBP",
    measurement: "metric",
    launchStatus: "structural_only",
  },
  au: {
    id: "au",
    name: "Australia",
    pathPrefix: "/au",
    defaultLocale: "en-AU",
    locales: ["en-AU"],
    currency: "AUD",
    measurement: "metric",
    launchStatus: "structural_only",
  },
};

export const DEFAULT_MARKET: MarketId = "us";

export const CURRENCY_MINOR_UNITS: Readonly<Record<CurrencyCode, number>> = {
  USD: 2,
  CAD: 2,
  GBP: 2,
  AUD: 2,
};

/** Convert a decimal amount (e.g. 499.0) to integer minor units (e.g. 49900). */
export function toMinorUnits(amount: number, currency: CurrencyCode): number {
  const factor = 10 ** CURRENCY_MINOR_UNITS[currency];
  return Math.round(amount * factor);
}
