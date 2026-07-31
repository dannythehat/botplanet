/**
 * RECONCILIATION — what happened when each stored value met its live source.
 *
 * The verification pass of 2026-07-31 compared every value the editorial records
 * held against the manufacturer sources recorded in `verification.ts`. This file
 * is the outcome of that comparison, field by field. It exists so that the
 * result of the comparison is data rather than a claim in a commit message: it
 * can be tested, counted, and shown on the internal review surface.
 *
 * NOTHING IS SILENTLY OVERWRITTEN. A stored value that turned out to be wrong is
 * kept alongside the live value and marked, so the change is auditable and so a
 * value that was once published can be traced.
 */

export type Reconciliation =
  /** The stored value matches what the live source says. */
  | "agrees"
  /** The stored value is a rounding or unit conversion of the source figure. */
  | "agrees_rounded"
  /** The headline agrees, but part of the stored wording has no source. */
  | "agrees_with_unverified_detail"
  /** The stored value is a single figure derived from a range the source gave. */
  | "derived_from_range"
  /** The stored value contradicts the live source. */
  | "conflicts"
  /** No checked source states this at all. */
  | "unsupported"
  /** The live source supplies a value the stored record did not have. */
  | "newly_populated"
  /** The field cannot apply to this product. */
  | "not_applicable";

/** Outcomes that permit the value to be published. */
export const PUBLISHABLE_OUTCOMES: Reconciliation[] = [
  "agrees",
  "agrees_rounded",
  "agrees_with_unverified_detail",
  "newly_populated",
];

export interface ReconciliationEntry {
  productId: string;
  field: string;
  outcome: Reconciliation;
  /** One sentence: what was compared and what came out of it. */
  note: string;
  /** Wording inside the stored value that no checked source supports. */
  unverifiedDetail?: string;
  /**
   * Set on a conflict that source authority cannot settle — because the sources
   * are of equal rank, or because the winning source's own figure is not
   * credible. Nothing is published for the field until a human resolves it.
   */
  unresolved?: true;
}

export const RECONCILIATION: ReconciliationEntry[] = [
  /* ---------------- WYBOT C1 ---------------- */
  { productId: "prod-wybot-c1", field: "poolSizeSuitability", outcome: "agrees", note: "Stored '~1,615 sq ft' matches the official 'up to 1615 sq. ft.'." },
  { productId: "prod-wybot-c1", field: "cableLengthFt", outcome: "not_applicable", note: "Cordless unit — there is no cable to measure." },
  { productId: "prod-wybot-c1", field: "runtimeMins", outcome: "agrees", note: "Stored 150 minutes matches 'up to 150 minutes'." },
  { productId: "prod-wybot-c1", field: "chargeTimeHrs", outcome: "agrees", note: "Stored 3 hours matches '3 hours'." },
  { productId: "prod-wybot-c1", field: "filtration", outcome: "agrees", note: "Stored 180-micron fine filter basket matches the official '180μm ultra-fine filter'." },
  { productId: "prod-wybot-c1", field: "navigation", outcome: "agrees", note: "Stored S-path / N-path path planning matches the official wording." },
  { productId: "prod-wybot-c1", field: "weightLbs", outcome: "agrees", note: "Stored 17.6 lb matches '17.6 lbs' exactly." },
  {
    productId: "prod-wybot-c1",
    field: "warranty",
    outcome: "agrees_with_unverified_detail",
    note: "The 2-year term matches the official page.",
    unverifiedDetail: "'30-day money-back' is a retailer return policy and is not stated by WYBOT on the product page.",
  },
  {
    productId: "prod-wybot-c1",
    field: "appSupport",
    outcome: "agrees_with_unverified_detail",
    note: "WYBOT App and OTA updates are both stated officially.",
    unverifiedDetail: "'weekly scheduling' is not stated on the official product page.",
  },

  /* ---------------- Dolphin Nautilus CC Plus ---------------- */
  { productId: "prod-dolphin-nautilus-cc-plus", field: "poolSizeSuitability", outcome: "agrees", note: "Stored '~40 ft' matches the official maximum pool length of 40 ft." },
  {
    productId: "prod-dolphin-nautilus-cc-plus",
    field: "cableLengthFt",
    outcome: "unsupported",
    note: "Stored 60 ft. Neither the official US product page nor the linked platform manual states a cable length; the manual's '3.5 m (12 ft)' is a power-supply placement distance, not cable length. The stored figure is withheld.",
  },
  { productId: "prod-dolphin-nautilus-cc-plus", field: "runtimeMins", outcome: "agrees", note: "Stored 120 minutes matches '2 Hours'." },
  { productId: "prod-dolphin-nautilus-cc-plus", field: "chargeTimeHrs", outcome: "not_applicable", note: "Mains-powered unit — there is no battery to charge." },
  { productId: "prod-dolphin-nautilus-cc-plus", field: "filtration", outcome: "agrees", note: "Stored fine/ultra-fine cartridge basket matches the official 'Ultra-Fine Filter Kit' at 70 microns." },
  {
    productId: "prod-dolphin-nautilus-cc-plus",
    field: "navigation",
    outcome: "agrees_with_unverified_detail",
    note: "CleverClean is stated officially.",
    unverifiedDetail: "'anti-tangle swivel cable' is not stated on the official US product page.",
  },
  { productId: "prod-dolphin-nautilus-cc-plus", field: "weightLbs", outcome: "agrees_rounded", note: "Stored 20 lb is a rounding of the official 20.837 lb." },
  {
    productId: "prod-dolphin-nautilus-cc-plus",
    field: "warranty",
    outcome: "conflicts",
    note: "Stored '2-year limited (varies by retailer)'. The official Maytronics US page for part 99996409-PCI states '1 year'. The manufacturer figure wins and the stored value is withheld.",
  },
  { productId: "prod-dolphin-nautilus-cc-plus", field: "appSupport", outcome: "agrees", note: "MyDolphin Plus and Wi-Fi are both stated officially." },

  /* ---------------- Dolphin Premier ---------------- */
  {
    productId: "prod-dolphin-premier",
    field: "poolSizeSuitability",
    outcome: "conflicts",
    unresolved: true,
    note: "Stored 'up to ~50 ft'. The only checked source states 'up to 55 in long' — a figure of 55 with an implausible unit. Stored 50 matches neither the number nor the unit, and no corrected figure is invented, so nothing is published.",
  },
  { productId: "prod-dolphin-premier", field: "cableLengthFt", outcome: "agrees", note: "Stored 60 ft matches '60 feet thermoplastic rubber cable'." },
  { productId: "prod-dolphin-premier", field: "runtimeMins", outcome: "agrees", note: "Stored 150 minutes matches '2.5 hours'." },
  { productId: "prod-dolphin-premier", field: "chargeTimeHrs", outcome: "not_applicable", note: "Mains-powered unit — there is no battery to charge." },
  { productId: "prod-dolphin-premier", field: "filtration", outcome: "agrees", note: "Stored multi-media description matches the dealer's NanoFilters / cartridge / leaf-bag listing at 2 microns." },
  {
    productId: "prod-dolphin-premier",
    field: "navigation",
    outcome: "agrees_with_unverified_detail",
    note: "SmartNav is stated by the source.",
    unverifiedDetail: "'(no Wi-Fi)' is an inference — the source does not state the absence of Wi-Fi.",
  },
  { productId: "prod-dolphin-premier", field: "weightLbs", outcome: "agrees", note: "Stored 22 lb matches '22 lbs.'." },
  { productId: "prod-dolphin-premier", field: "warranty", outcome: "agrees", note: "Stored 3-year non-prorated matches '3 yr limited warranty -not pro-rated - not limited to hours/cycles'." },
  {
    productId: "prod-dolphin-premier",
    field: "appSupport",
    outcome: "unsupported",
    note: "Stored 'None — single-button plug-and-play'. The source is silent on app support; silence is not a manufacturer statement that there is none.",
  },

  /* ---------------- Polaris FREEDOM ---------------- */
  {
    productId: "prod-polaris-freedom",
    field: "poolSizeSuitability",
    outcome: "unsupported",
    note: "Stored 'In-ground pools up to 50 ft'. The owner's manual publishes an operating DEPTH range (max 13 ft, min 15 in) and no pool length or area at all. Depth is not pool size and is not substituted for it.",
  },
  { productId: "prod-polaris-freedom", field: "cableLengthFt", outcome: "not_applicable", note: "Cordless unit — there is no cable to measure." },
  { productId: "prod-polaris-freedom", field: "runtimeMins", outcome: "agrees", note: "Stored 150 minutes matches the quick start guide's 'Floor and walls (2h 30)'." },
  {
    productId: "prod-polaris-freedom",
    field: "chargeTimeHrs",
    outcome: "unsupported",
    note: "Stored 4 hours. Polaris states only 'charges in under 5 hours'. Four hours is consistent with that but is not stated, so it is not published as a figure.",
  },
  { productId: "prod-polaris-freedom", field: "filtration", outcome: "agrees", note: "Stored top-access canister matches the manual's 'All-purpose filter canister' and the 4 L capacity on the support page." },
  { productId: "prod-polaris-freedom", field: "navigation", outcome: "agrees", note: "Stored app-optimised SMART cycle matches the official mode list." },
  {
    productId: "prod-polaris-freedom",
    field: "weightLbs",
    outcome: "newly_populated",
    note: "The stored record had no weight. The owner's manual states 'Weight of Cleaner 20 lbs. (9.1 kg)'. Packed weight (33 lbs.) is deliberately not used.",
  },
  {
    productId: "prod-polaris-freedom",
    field: "warranty",
    outcome: "unsupported",
    note: "Stored '2-year limited'. The owner's manual mentions a Limited Warranty only inside an exclusion clause and never states its term; the support page states none.",
  },
  { productId: "prod-polaris-freedom", field: "appSupport", outcome: "agrees", note: "iAquaLink app control is stated officially, and the manual requires Wi-Fi at the charging location." },

  /* ---------------- Betta SE Plus ---------------- */
  { productId: "prod-betta-se-plus", field: "poolSizeSuitability", outcome: "agrees", note: "Stored '~40×60 ft' matches 'Up to 40 ft × 60 ft (approx. 2,400 sq. ft.)'." },
  { productId: "prod-betta-se-plus", field: "cableLengthFt", outcome: "not_applicable", note: "Cordless solar unit — there is no cable." },
  { productId: "prod-betta-se-plus", field: "runtimeMins", outcome: "agrees_rounded", note: "Stored 1800 minutes is 30 hours; the source states '30+ hours', so the stored figure is the conservative floor of an open-ended claim." },
  { productId: "prod-betta-se-plus", field: "chargeTimeHrs", outcome: "agrees", note: "Stored 3.5 hours matches the adapter charge time; solar charging is separately stated as 5–6 hours." },
  { productId: "prod-betta-se-plus", field: "filtration", outcome: "agrees", note: "Stored fine mesh ~200 micron matches 'fine-mesh (200 um) debris basket'." },
  { productId: "prod-betta-se-plus", field: "navigation", outcome: "agrees", note: "Ultrasonic radar detection and the shallow-water safeguard are both stated officially." },
  {
    productId: "prod-betta-se-plus",
    field: "weightLbs",
    outcome: "unsupported",
    note: "Stored 15 lb. Neither the official product page nor the official manual publishes a weight.",
  },
  {
    productId: "prod-betta-se-plus",
    field: "warranty",
    outcome: "agrees",
    note: "Stored '1-year' is corroborated by two independent official sources: the product page ('1-YEAR WARRANTY') and the user manual ('1-Year Manufacturer's Warranty from the date of purchase').",
  },
  {
    productId: "prod-betta-se-plus",
    field: "appSupport",
    outcome: "unsupported",
    note: "Stored 'No app — wireless remote or fully automatic'. The remote is verified; the absence of an app is not stated by Betta and is therefore not published as a fact.",
  },

  /* ---------------- Dolphin E10 ---------------- */
  {
    productId: "prod-dolphin-e10",
    field: "poolSizeSuitability",
    outcome: "conflicts",
    note: "Stored 'Above-ground pools up to 30 ft'. Maytronics states a maximum pool length of 8 m, which is 26.2 ft. The stored figure overstates the manufacturer's rating by roughly four feet and is withheld.",
  },
  { productId: "prod-dolphin-e10", field: "cableLengthFt", outcome: "agrees_rounded", note: "Stored 40 ft is a rounding of the official '12.0 m' (39.4 ft)." },
  { productId: "prod-dolphin-e10", field: "runtimeMins", outcome: "agrees", note: "Stored 90 minutes matches '1.5 Hours'." },
  { productId: "prod-dolphin-e10", field: "chargeTimeHrs", outcome: "not_applicable", note: "Mains-powered unit — there is no battery to charge." },
  {
    productId: "prod-dolphin-e10",
    field: "filtration",
    outcome: "agrees_with_unverified_detail",
    note: "Maytronics lists a 'Fine Filter Kit' for this model.",
    unverifiedDetail: "'ultra-fine' is not offered on the E10 — that kit belongs to higher models in the range.",
  },
  { productId: "prod-dolphin-e10", field: "navigation", outcome: "agrees", note: "Stored CleverClean scanning matches the official 'CleverClean™'." },
  { productId: "prod-dolphin-e10", field: "weightLbs", outcome: "agrees_rounded", note: "Stored 14 lb is a rounding of the official '6.63 Kg.' (14.6 lb)." },
  { productId: "prod-dolphin-e10", field: "warranty", outcome: "agrees", note: "Stored '2-year (24-month) limited' matches the official '2 Years'." },
  {
    productId: "prod-dolphin-e10",
    field: "appSupport",
    outcome: "unsupported",
    note: "Stored 'None — no app or remote'. Maytronics' specification table carries app and Wi-Fi rows for models that have them and carries neither for the E10, which is suggestive but is not a statement that no app exists. The absence is not published as a fact.",
  },

  /* ---------------- Beatbot AquaSense 2 Ultra ---------------- */
  { productId: "prod-beatbot-aquasense-2-ultra", field: "poolSizeSuitability", outcome: "agrees", note: "Stored '~3,875 sq ft' matches 'up to 3,875 sq.ft'." },
  { productId: "prod-beatbot-aquasense-2-ultra", field: "cableLengthFt", outcome: "not_applicable", note: "Cordless unit — there is no cable to measure." },
  { productId: "prod-beatbot-aquasense-2-ultra", field: "runtimeMins", outcome: "agrees", note: "Stored 300 minutes matches the stated 5 h floor-cleaning runtime; surface skimming is separately stated as 10 h." },
  { productId: "prod-beatbot-aquasense-2-ultra", field: "chargeTimeHrs", outcome: "agrees", note: "Stored 4.5 hours matches '4.5h'." },
  { productId: "prod-beatbot-aquasense-2-ultra", field: "filtration", outcome: "agrees", note: "Stored dual-layer ultra-fine basket at ~150 micron matches the official 150μm rating." },
  {
    productId: "prod-beatbot-aquasense-2-ultra",
    field: "navigation",
    outcome: "agrees_with_unverified_detail",
    note: "HybridSense AI with dual TOF sensors is stated officially.",
    unverifiedDetail: "'camera + IR/ultrasonic' and 'CleverNav' are not named on the official product page.",
  },
  {
    productId: "prod-beatbot-aquasense-2-ultra",
    field: "weightLbs",
    outcome: "unsupported",
    note: "Stored 29 lb. Beatbot publishes no weight on the official product page.",
  },
  { productId: "prod-beatbot-aquasense-2-ultra", field: "warranty", outcome: "agrees", note: "Stored '3-year full replacement' matches the official wording." },
  { productId: "prod-beatbot-aquasense-2-ultra", field: "appSupport", outcome: "agrees", note: "App control with scheduling and alerts is stated officially." },

  /* ---------------- Aiper Scuba X1 ---------------- */
  { productId: "prod-aiper-scuba-x1", field: "poolSizeSuitability", outcome: "agrees", note: "Stored '~2,150 sq ft / 66 ft' matches '2150 sq.ft (200㎡) / 66ft (20m)'." },
  { productId: "prod-aiper-scuba-x1", field: "cableLengthFt", outcome: "not_applicable", note: "Cordless unit — there is no cable to measure." },
  { productId: "prod-aiper-scuba-x1", field: "runtimeMins", outcome: "agrees", note: "Stored 180 minutes matches 'Up to 180 minutes'." },
  { productId: "prod-aiper-scuba-x1", field: "chargeTimeHrs", outcome: "agrees", note: "Stored 4 hours matches '4 hours'." },
  { productId: "prod-aiper-scuba-x1", field: "filtration", outcome: "agrees", note: "Stored basket plus 3-micron MicroMesh matches the official filtration description." },
  {
    productId: "prod-aiper-scuba-x1",
    field: "navigation",
    outcome: "agrees_with_unverified_detail",
    note: "WavePath 3.0 is stated officially.",
    unverifiedDetail: "'~14 sensors' is not stated on the official product page.",
  },
  {
    productId: "prod-aiper-scuba-x1",
    field: "warranty",
    outcome: "unsupported",
    note: "Stored '2-year limited'. No warranty term appears anywhere on the official product page.",
  },
  { productId: "prod-aiper-scuba-x1", field: "appSupport", outcome: "agrees", note: "App control is stated officially." },

  /* ---------------- Aiper Scuba S1 ---------------- */
  { productId: "prod-aiper-scuba-s1", field: "poolSizeSuitability", outcome: "agrees", note: "Stored '~1,600 sq ft' matches '1600 sq.ft (150㎡) 50ft (15m) in length'." },
  { productId: "prod-aiper-scuba-s1", field: "cableLengthFt", outcome: "not_applicable", note: "Cordless unit — there is no cable to measure." },
  { productId: "prod-aiper-scuba-s1", field: "runtimeMins", outcome: "agrees", note: "Stored 180 minutes matches 'Up to 180 Minutes'." },
  {
    productId: "prod-aiper-scuba-s1",
    field: "chargeTimeHrs",
    outcome: "derived_from_range",
    note: "Stored 3.5 hours is the midpoint of Aiper's '3-4 Hours'. A midpoint is a calculation, not a manufacturer statement, so the range is published instead of the single figure.",
  },
  { productId: "prod-aiper-scuba-s1", field: "filtration", outcome: "agrees", note: "Stored 180-micron basket plus 3-micron MicroMesh matches the official description exactly." },
  { productId: "prod-aiper-scuba-s1", field: "navigation", outcome: "agrees", note: "Stored WavePath 2.0 matches 'WavePath™ Navigation 2.0 Technology'." },
  {
    productId: "prod-aiper-scuba-s1",
    field: "weightLbs",
    outcome: "unsupported",
    note: "Stored 16 lb. Aiper publishes no weight for this model.",
  },
  {
    productId: "prod-aiper-scuba-s1",
    field: "warranty",
    outcome: "unsupported",
    note: "Stored '2-year limited'. No warranty term appears anywhere on the official product page.",
  },
  { productId: "prod-aiper-scuba-s1", field: "appSupport", outcome: "agrees", note: "App modes, cleaning history and OTA upgrades are all stated officially." },

  /* ---------------- Aiper Seagull SE ---------------- */
  {
    productId: "prod-aiper-seagull-se",
    field: "poolSizeSuitability",
    outcome: "unsupported",
    note: "Stored 'flat above-ground up to ~40 ft (round to ~33 ft); flat-floored in-ground'. The official page publishes no pool dimension of any kind for this model.",
  },
  { productId: "prod-aiper-seagull-se", field: "cableLengthFt", outcome: "not_applicable", note: "Cordless unit — there is no cable to measure." },
  { productId: "prod-aiper-seagull-se", field: "runtimeMins", outcome: "agrees", note: "Stored 90 minutes matches '90 minutes'." },
  {
    productId: "prod-aiper-seagull-se",
    field: "chargeTimeHrs",
    outcome: "unsupported",
    note: "Stored 2.5 hours. The official page states a runtime but no charge time.",
  },
  {
    productId: "prod-aiper-seagull-se",
    field: "filtration",
    outcome: "unsupported",
    note: "Stored 'basic flat mesh filter basket (no fine micron rating)'. The official page publishes no filtration description at all, so neither the basket type nor the absence of a micron rating is sourced.",
  },
  {
    productId: "prod-aiper-seagull-se",
    field: "navigation",
    outcome: "agrees_with_unverified_detail",
    note: "Auto-parking at the pool wall is stated officially.",
    unverifiedDetail: "'random path' and 'no smart mapping' are inferences; Aiper describes neither.",
  },
  {
    productId: "prod-aiper-seagull-se",
    field: "warranty",
    outcome: "unsupported",
    note: "Stored '1-year limited'. No warranty term appears on the official product page.",
  },
  {
    productId: "prod-aiper-seagull-se",
    field: "appSupport",
    outcome: "unsupported",
    note: "Stored 'None'. Aiper does not state the absence of an app for this model, and absence of a mention is not a statement.",
  },
];

export const reconciliationFor = (productId: string, field: string): ReconciliationEntry | undefined =>
  RECONCILIATION.find((r) => r.productId === productId && r.field === field);

/** Exact counts by outcome, for the editorial reconciliation report. */
export function reconciliationCounts(): Record<Reconciliation, number> {
  const out = {
    agrees: 0,
    agrees_rounded: 0,
    agrees_with_unverified_detail: 0,
    derived_from_range: 0,
    conflicts: 0,
    unsupported: 0,
    newly_populated: 0,
    not_applicable: 0,
  } satisfies Record<Reconciliation, number>;
  for (const r of RECONCILIATION) out[r.outcome] += 1;
  return out;
}
