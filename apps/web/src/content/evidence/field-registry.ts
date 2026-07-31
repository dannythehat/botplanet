/**
 * FIELD REGISTRY — the documented denominator.
 *
 * WHY THIS EXISTS: a completeness percentage is meaningless unless the set of
 * fields being counted is written down and fixed in advance. The previous pass
 * counted only the eleven fields the editorial records happened to hold, which
 * flattered the score by excluding everything nobody had researched. This file
 * declares the FULL field set BotPlanet intends to hold for a robotic pool
 * cleaner, whether or not any product currently has a value for it.
 *
 * WEIGHTS: not every field matters equally. A missing warranty is a nuisance;
 * a missing power type makes the product unusable in BotMatch. Weights are on a
 * 1–5 scale and are used ONLY for the weighted completeness figure — they never
 * influence whether a value may be published.
 *
 * APPLICABILITY: some fields cannot apply to some products. Cable length is not
 * a gap on a cordless robot, and charge time is not a gap on a corded one. A
 * field ruled inapplicable is removed from that product's denominator entirely
 * rather than counted as missing, and the reason is recorded.
 */
import type { FieldGroup, RefreshCadence } from "./types";

/** How a field's applicability is decided for a given product. */
export type ApplicabilityRule =
  | "always"
  /** Only meaningful on mains-powered (corded) cleaners. */
  | "corded_only"
  /** Only meaningful on battery-powered (cordless) cleaners. */
  | "cordless_only"
  /** Only meaningful when the product has app or Wi-Fi connectivity. */
  | "connected_only";

export interface FieldDefinition {
  /** Stable field key. Never renamed once published. */
  field: string;
  group: FieldGroup;
  /** Human label used on the internal review surface. */
  label: string;
  /** 1 (nice to have) … 5 (cannot ship without). */
  weight: 1 | 2 | 3 | 4 | 5;
  applicability: ApplicabilityRule;
  cadence: RefreshCadence;
  /** Unit of the raw stored value where one applies, for normalisation. */
  unit?: "ft" | "lb" | "min" | "hr" | "in" | "sqft" | "micron" | "L";
  /** What the field means, so two people record the same thing in it. */
  definition: string;
}

export const FIELD_REGISTRY: FieldDefinition[] = [
  /* ---------------- identity ---------------- */
  {
    field: "brand",
    group: "identity",
    label: "Brand",
    weight: 5,
    applicability: "always",
    cadence: "annual",
    definition: "Manufacturer as it appears on the official product page.",
  },
  {
    field: "canonicalName",
    group: "identity",
    label: "Canonical model name",
    weight: 5,
    applicability: "always",
    cadence: "annual",
    definition: "The exact model name the manufacturer uses, including suffixes that distinguish near-identical models.",
  },
  {
    field: "modelNumber",
    group: "identity",
    label: "Model number / SKU",
    weight: 5,
    applicability: "always",
    cadence: "annual",
    definition: "Manufacturer part number or SKU. This is what separates a Betta SE from a Betta SE Plus.",
  },
  {
    field: "officialProductPageUrl",
    group: "identity",
    label: "Official product page",
    weight: 5,
    applicability: "always",
    cadence: "quarterly",
    definition: "The manufacturer's own page for this exact model — not a dealer, not a near model.",
  },
  {
    field: "manualUrl",
    group: "identity",
    label: "Manual / owner's document",
    weight: 4,
    applicability: "always",
    cadence: "annual",
    definition: "URL of the manufacturer's manual that demonstrably covers this model.",
  },
  {
    field: "manualDocumentId",
    group: "identity",
    label: "Manual document ID",
    weight: 2,
    applicability: "always",
    cadence: "annual",
    definition: "Printed document/part number of the manual, so a revision can be detected.",
  },
  {
    field: "manualRevisionDate",
    group: "identity",
    label: "Manual revision",
    weight: 2,
    applicability: "always",
    cadence: "annual",
    definition: "Revision marker or copyright year printed on the manual.",
  },

  /* ---------------- power & operation ---------------- */
  {
    field: "powerType",
    group: "power_operation",
    label: "Power type",
    weight: 5,
    applicability: "always",
    cadence: "annual",
    definition: "Mains-powered (corded) or battery-powered (cordless). Drives every other applicability rule.",
  },
  {
    field: "cableLengthFt",
    group: "power_operation",
    label: "Cable length",
    weight: 4,
    applicability: "corded_only",
    cadence: "six_monthly",
    unit: "ft",
    definition: "Length of the floating cable, which caps the pool size a corded unit can reach.",
  },
  {
    field: "batteryCapacity",
    group: "power_operation",
    label: "Battery capacity",
    weight: 3,
    applicability: "cordless_only",
    cadence: "six_monthly",
    definition: "Manufacturer-stated cell capacity, verbatim with its unit (mAh, Ah or Wh).",
  },
  {
    field: "runtimeMins",
    group: "power_operation",
    label: "Runtime / cycle length",
    weight: 5,
    applicability: "always",
    cadence: "six_monthly",
    unit: "min",
    definition: "Longest manufacturer-stated cleaning cycle in the default full-coverage mode.",
  },
  {
    field: "chargeTimeHrs",
    group: "power_operation",
    label: "Charge time",
    weight: 3,
    applicability: "cordless_only",
    cadence: "six_monthly",
    unit: "hr",
    definition: "Manufacturer-stated time to a full charge from empty.",
  },

  /* ---------------- pool suitability ---------------- */
  {
    field: "poolTypes",
    group: "pool_suitability",
    label: "Pool types",
    weight: 5,
    applicability: "always",
    cadence: "six_monthly",
    definition: "Above-ground, in-ground, or both, as stated by the manufacturer.",
  },
  {
    field: "poolSizeSuitability",
    group: "pool_suitability",
    label: "Maximum pool size",
    weight: 5,
    applicability: "always",
    cadence: "six_monthly",
    definition: "Manufacturer-stated maximum pool length or area. Never inferred from cable length.",
  },
  {
    field: "maxDepthFt",
    group: "pool_suitability",
    label: "Maximum operating depth",
    weight: 2,
    applicability: "always",
    cadence: "annual",
    unit: "ft",
    definition: "Deepest water the manufacturer rates the unit for.",
  },
  {
    field: "minDepthFt",
    group: "pool_suitability",
    label: "Minimum operating depth",
    weight: 2,
    applicability: "always",
    cadence: "annual",
    unit: "ft",
    definition: "Shallowest water the manufacturer rates the unit for.",
  },
  {
    field: "surfaceTypes",
    group: "pool_suitability",
    label: "Pool surface types",
    weight: 3,
    applicability: "always",
    cadence: "annual",
    definition: "Liner/finish types the manufacturer states the unit suits (vinyl, gunite, tile, fibreglass).",
  },

  /* ---------------- cleaning & coverage ---------------- */
  {
    field: "surfacesCleaned",
    group: "cleaning_coverage",
    label: "Surfaces cleaned",
    weight: 5,
    applicability: "always",
    cadence: "six_monthly",
    definition: "Which of floor, walls and waterline the manufacturer states the unit cleans.",
  },
  {
    field: "filtration",
    group: "cleaning_coverage",
    label: "Filtration system",
    weight: 4,
    applicability: "always",
    cadence: "six_monthly",
    definition: "Filter media/basket description as the manufacturer words it.",
  },
  {
    field: "filtrationMicrons",
    group: "cleaning_coverage",
    label: "Finest filtration rating",
    weight: 3,
    applicability: "always",
    cadence: "six_monthly",
    unit: "micron",
    definition: "Finest micron rating stated for any filter supplied in the box.",
  },
  {
    field: "filterCapacityL",
    group: "cleaning_coverage",
    label: "Filter capacity",
    weight: 2,
    applicability: "always",
    cadence: "annual",
    unit: "L",
    definition: "Stated volume of the debris basket or canister.",
  },
  {
    field: "navigation",
    group: "cleaning_coverage",
    label: "Navigation",
    weight: 4,
    applicability: "always",
    cadence: "six_monthly",
    definition: "Named navigation/path-planning system, verbatim.",
  },
  {
    field: "suctionRate",
    group: "cleaning_coverage",
    label: "Suction rate",
    weight: 2,
    applicability: "always",
    cadence: "annual",
    definition: "Stated flow rate with its unit (GPH, LPH or m³/h). Units are not converted across brands.",
  },
  {
    field: "cleaningModes",
    group: "cleaning_coverage",
    label: "Cleaning modes",
    weight: 3,
    applicability: "always",
    cadence: "six_monthly",
    definition: "Named cleaning modes the manufacturer lists.",
  },

  /* ---------------- physical ---------------- */
  {
    field: "weightLbs",
    group: "physical",
    label: "Weight",
    weight: 4,
    applicability: "always",
    cadence: "annual",
    unit: "lb",
    definition: "Weight of the cleaner itself, dry, excluding caddy and packaging.",
  },
  {
    field: "dimensions",
    group: "physical",
    label: "Dimensions",
    weight: 2,
    applicability: "always",
    cadence: "annual",
    definition: "Stated W×D×H of the cleaner. Package dimensions are recorded separately and never substituted.",
  },
  {
    field: "includedAccessories",
    group: "physical",
    label: "In the box",
    weight: 2,
    applicability: "always",
    cadence: "annual",
    definition: "Items the manufacturer states are supplied with the unit.",
  },

  /* ---------------- connectivity ---------------- */
  {
    field: "appSupport",
    group: "connectivity",
    label: "App support",
    weight: 4,
    applicability: "always",
    cadence: "quarterly",
    definition: "Named app and what it controls, or an explicit statement that there is no app.",
  },
  {
    field: "wifi",
    group: "connectivity",
    label: "Wi-Fi",
    weight: 3,
    applicability: "always",
    cadence: "quarterly",
    definition: "Whether the unit itself connects to Wi-Fi, as distinct from a Bluetooth or remote link.",
  },
  {
    field: "remoteControl",
    group: "connectivity",
    label: "Remote control",
    weight: 2,
    applicability: "always",
    cadence: "annual",
    definition: "Whether a physical remote handset is supplied.",
  },

  /* ---------------- warranty & support ---------------- */
  {
    field: "warranty",
    group: "warranty_support",
    label: "Warranty",
    weight: 5,
    applicability: "always",
    cadence: "quarterly",
    definition: "Warranty term and type exactly as the manufacturer states it for the US market.",
  },
];

export const FIELD_BY_KEY = new Map(FIELD_REGISTRY.map((f) => [f.field, f]));

/** Total weight of every field, before per-product applicability is applied. */
export const TOTAL_REGISTRY_WEIGHT = FIELD_REGISTRY.reduce((n, f) => n + f.weight, 0);

/**
 * Decides whether a field applies to a product. `powerType` must be known first;
 * when it is not, power-dependent fields stay applicable so the gap is visible
 * rather than being quietly excused.
 */
export function fieldApplies(rule: ApplicabilityRule, ctx: { powerType?: "corded" | "cordless" | null; connected?: boolean | null }): { applies: boolean; reason?: string } {
  switch (rule) {
    case "always":
      return { applies: true };
    case "corded_only":
      if (ctx.powerType === "cordless") return { applies: false, reason: "cordless unit — no cable" };
      return { applies: true };
    case "cordless_only":
      if (ctx.powerType === "corded") return { applies: false, reason: "mains-powered unit — no battery" };
      return { applies: true };
    case "connected_only":
      if (ctx.connected === false) return { applies: false, reason: "no app or Wi-Fi on this model" };
      return { applies: true };
  }
}
