/**
 * Factual, non-ranking product descriptions built from stored fields.
 *
 * TWO KINDS OF STATEMENT, deliberately separated:
 *
 *  1. PERMANENT CLASSIFICATION — power type, supported environment and product
 *     class. These come straight from the product record and do not go stale.
 *
 *  2. CHANGING COMMERCIAL OBSERVATION — where a model sits in the catalogue's
 *     current price range. This is computed at render time from current offer
 *     prices and DISAPPEARS when the data needed to support it is missing.
 *     It is never hard-coded.
 *
 * Nothing here ranks products, counts features, or implies a performance
 * outcome (cycle length, cleaning quality, speed). Those claims need fields we
 * do not yet store.
 */

export type PriceBand = "upper" | "lower" | null;

export interface ProductFacts {
  /** e.g. "cordless" | "corded" | "solar" — as stored. */
  powerType: string;
  /** e.g. ["above_ground", "in_ground"] — as stored. */
  environments: string[];
  /** Minimum current offer price in minor units, or null when unknown. */
  priceMinor: number | null;
}

export interface ProductDescription {
  label: string;
  explanation: string;
  /** True when the wording includes a computed price observation. */
  usesPriceData: boolean;
}

/** Minimum catalogue size before a price-position statement means anything. */
const MIN_SAMPLE = 5;

/** Linear-interpolated percentile of a sorted numeric list. */
export function percentile(sorted: number[], p: number): number {
  if (!sorted.length) return NaN;
  if (sorted.length === 1) return sorted[0];
  const idx = (sorted.length - 1) * p;
  const lo = Math.floor(idx);
  const hi = Math.ceil(idx);
  if (lo === hi) return sorted[lo];
  return sorted[lo] + (sorted[hi] - sorted[lo]) * (idx - lo);
}

/**
 * Where this price sits in the catalogue's current range.
 *
 * Deliberately narrow: only the top and bottom deciles qualify, so the wording
 * describes a genuine extreme rather than dividing the catalogue in half and
 * calling everything above the midpoint "premium". Returns null — meaning "say
 * nothing about price" — whenever the data cannot support the statement.
 */
export function priceBand(priceMinor: number | null, catalogPricesMinor: number[]): PriceBand {
  if (priceMinor == null) return null;
  const prices = catalogPricesMinor.filter((n) => Number.isFinite(n) && n > 0).sort((a, b) => a - b);
  if (prices.length < MIN_SAMPLE) return null;
  if (priceMinor >= percentile(prices, 0.9)) return "upper";
  if (priceMinor <= percentile(prices, 0.1)) return "lower";
  return null;
}

const POWER_WORD: Record<string, string> = {
  cordless: "cordless",
  corded: "mains-powered",
  solar: "solar-powered",
};

const powerAdjective = (powerType: string): string => (powerType === "corded" ? "Corded" : titleish(powerType));
const titleish = (s: string) => (s ? s[0].toUpperCase() + s.slice(1) : s);

/**
 * Build the label and explanation for a featured product.
 *
 * Order of preference:
 *   1. a computed price-range observation, when the data supports one;
 *   2. the supported environment, which is permanent classification;
 *   3. a plain classification with no positioning claim at all.
 */
export function describeProduct(facts: ProductFacts, catalogPricesMinor: number[]): ProductDescription {
  const band = priceBand(facts.priceMinor, catalogPricesMinor);
  const power = facts.powerType;
  const powerNoun = POWER_WORD[power] ?? power;
  const inGround = facts.environments.includes("in_ground");
  const aboveGround = facts.environments.includes("above_ground");

  // 1. Computed price position — the only comparative statement permitted, and
  //    only while current offer data supports it.
  if (band === "upper") {
    return {
      label: `Premium-priced ${power} option`,
      explanation: `A ${powerNoun} model positioned at the upper end of the current catalogue price range.`,
      usesPriceData: true,
    };
  }

  if (band === "lower" && aboveGround && !inGround) {
    return {
      label: `${powerAdjective(power)} entry option`,
      explanation: `A compact ${powerNoun} model listed for above-ground pools.`,
      usesPriceData: true,
    };
  }

  // 2. Environment classification — permanent, straight from the record.
  if (inGround && !aboveGround) {
    return {
      label: `${powerAdjective(power)} in-ground option`,
      explanation:
        power === "corded"
          ? "A mains-powered model listed for in-ground pools."
          : `A ${powerNoun} model listed for in-ground pool cleaning.`,
      usesPriceData: false,
    };
  }

  if (aboveGround && !inGround) {
    return {
      label: `${powerAdjective(power)} above-ground option`,
      explanation: `A ${powerNoun} model listed for above-ground pools.`,
      usesPriceData: false,
    };
  }

  if (inGround && aboveGround) {
    return {
      label: `${powerAdjective(power)} option`,
      explanation: `A ${powerNoun} model listed for both above-ground and in-ground pools.`,
      usesPriceData: false,
    };
  }

  // 3. No environment recorded: say only what the profile actually holds.
  return {
    label: `${powerAdjective(power)} pool-cleaning option`,
    explanation: `A ${powerNoun} model with the capabilities recorded in its product profile.`,
    usesPriceData: false,
  };
}
