/**
 * CONSERVATIVE CLAIM LEDGER.
 *
 * Claims are GENERATED from the field ledger rather than written by hand. A
 * hand-written claim list drifts: someone fixes a field, the sentence that
 * depended on it keeps its old number, and the site publishes something no
 * source says. Generating them makes that impossible — a claim cannot exist
 * without a publishable field behind it, and it carries that field's evidence
 * IDs, confidence and refresh cadence.
 *
 * CONSERVATIVE MEANS: every claim restates what a named source said, attributed,
 * in the source's own units. No claim ranks a product against another, none
 * asserts testing, and none turns an absence of information into a negative
 * fact ("has no app"). Where a field is suppressed or conflicting, the claim is
 * not written at all — and `blockedClaims` records what could not be said and
 * why, so the gap is visible instead of silent.
 */
import { deriveLedger } from "./derive";
import type { ClaimClass, ClaimRecord, FieldRecord, PublicContext, SourceRef } from "./types";

/** Fields a public claim may be built from, with how each is worded. */
interface ClaimTemplate {
  field: string;
  claimClass: ClaimClass;
  contexts: PublicContext[];
  prohibited?: PublicContext[];
  /** Builds the sentence. `value` is verbatim from the source. */
  say: (value: string, publisher: string) => string;
}

const CLAIM_TEMPLATES: ClaimTemplate[] = [
  {
    field: "powerType",
    claimClass: "direct_specification",
    contexts: ["product_page", "category_page", "comparison", "botmatch", "guide"],
    say: (v, pub) => `${pub} describes this model as ${v}.`,
  },
  {
    field: "poolTypes",
    claimClass: "direct_specification",
    contexts: ["product_page", "category_page", "comparison", "botmatch", "guide"],
    say: (v, pub) => `${pub} lists this model for ${v} pools.`,
  },
  {
    field: "poolSizeSuitability",
    claimClass: "direct_specification",
    contexts: ["product_page", "comparison", "botmatch", "guide"],
    say: (v, pub) => `${pub} rates this model for pools up to ${v}.`,
  },
  {
    field: "surfacesCleaned",
    claimClass: "direct_specification",
    contexts: ["product_page", "category_page", "comparison", "botmatch", "guide"],
    say: (v, pub) => `${pub} states that it cleans ${v}.`,
  },
  {
    field: "runtimeMins",
    claimClass: "direct_specification",
    contexts: ["product_page", "comparison", "botmatch", "guide"],
    say: (v, pub) => `${pub} states a cleaning cycle of ${v}.`,
  },
  {
    field: "cableLengthFt",
    claimClass: "direct_specification",
    contexts: ["product_page", "comparison", "guide"],
    say: (v, pub) => `${pub} states a cable length of ${v}.`,
  },
  {
    field: "chargeTimeHrs",
    claimClass: "direct_specification",
    contexts: ["product_page", "comparison", "guide"],
    say: (v, pub) => `${pub} states a charge time of ${v}.`,
  },
  {
    field: "batteryCapacity",
    claimClass: "direct_specification",
    contexts: ["product_page", "comparison", "guide"],
    say: (v, pub) => `${pub} states a battery capacity of ${v}.`,
  },
  {
    field: "appSupport",
    claimClass: "direct_specification",
    contexts: ["product_page", "category_page", "comparison", "botmatch", "guide"],
    say: (v, pub) => `${pub} states app support: ${v}.`,
  },
  {
    field: "wifi",
    claimClass: "direct_specification",
    contexts: ["product_page", "comparison", "botmatch"],
    say: (v, pub) => `${pub} states Wi-Fi connectivity: ${v}.`,
  },
  {
    field: "warranty",
    claimClass: "direct_specification",
    // Warranty terms change without notice and vary by seller, so a warranty
    // claim is never allowed into structured data or page metadata.
    contexts: ["product_page", "comparison", "guide"],
    prohibited: ["structured_data", "metadata"],
    say: (v, pub) => `${pub} states a warranty of ${v}.`,
  },
  {
    field: "filtration",
    claimClass: "direct_specification",
    contexts: ["product_page", "comparison", "guide"],
    say: (v, pub) => `${pub} describes the filtration as ${v}.`,
  },
  {
    field: "filtrationMicrons",
    claimClass: "direct_specification",
    contexts: ["product_page", "comparison", "guide"],
    say: (v, pub) => `${pub} states a finest filtration rating of ${v}.`,
  },
  {
    field: "navigation",
    claimClass: "direct_specification",
    contexts: ["product_page", "comparison", "guide"],
    say: (v, pub) => `${pub} names the navigation system as ${v}.`,
  },
  {
    field: "weightLbs",
    claimClass: "direct_specification",
    contexts: ["product_page", "comparison", "guide"],
    say: (v, pub) => `${pub} states a weight of ${v}.`,
  },
  {
    field: "maxDepthFt",
    claimClass: "direct_specification",
    contexts: ["product_page", "comparison", "guide"],
    say: (v, pub) => `${pub} states a maximum operating depth of ${v}.`,
  },
];

const TEMPLATE_BY_FIELD = new Map(CLAIM_TEMPLATES.map((t) => [t.field, t]));

export interface BlockedClaim {
  productId: string;
  field: string;
  /** The sentence that cannot be published. */
  wouldHaveSaid: string;
  state: FieldRecord["state"];
  reason: string;
}

export interface ClaimLedger {
  claims: ClaimRecord[];
  blocked: BlockedClaim[];
}

/**
 * A suitability statement is the one claim built from more than one field, and
 * it is the one BotMatch needs. It is only written when BOTH inputs are
 * publishable, so a product with an unknown pool size never acquires a
 * suitability sentence by accident.
 */
function suitabilityClaim(productId: string, fields: FieldRecord[]): ClaimRecord | null {
  const size = fields.find((f) => f.field === "poolSizeSuitability" && f.publishable);
  const types = fields.find((f) => f.field === "poolTypes" && f.publishable);
  if (!size || !types) return null;
  return {
    id: `claim-${productId}-suitability`,
    productId,
    claimText: `Suitable for ${types.value} pools up to ${size.value}, as stated by the manufacturer.`,
    claimClass: "suitability_statement",
    evidenceIds: [...size.evidenceIds, ...types.evidenceIds],
    confidence: size.confidence === "high" && types.confidence === "high" ? "high" : "medium",
    allowedContexts: ["botmatch", "guide", "product_page"],
    prohibitedContexts: ["structured_data"],
    freshnessRequirement: size.cadence,
    reviewerStatus: "unreviewed",
    notes: "Built from two verified fields. Restates manufacturer ratings; it is not a BotPlanet judgement of fit.",
  };
}

export function buildClaimLedger(): ClaimLedger {
  const ledger = deriveLedger();
  const byId = new Map<string, SourceRef>(ledger.sources.map((s) => [s.id, s]));
  const claims: ClaimRecord[] = [];
  const blocked: BlockedClaim[] = [];

  const byProduct = new Map<string, FieldRecord[]>();
  for (const f of ledger.fields) {
    const list = byProduct.get(f.productId) ?? [];
    list.push(f);
    byProduct.set(f.productId, list);
  }

  for (const [productId, fields] of byProduct) {
    for (const f of fields) {
      const t = TEMPLATE_BY_FIELD.get(f.field);
      if (!t) continue;

      if (!f.publishable) {
        // "not applicable" is not a blocked claim — there was never a claim to make.
        if (f.state === "not_applicable") continue;
        blocked.push({
          productId,
          field: f.field,
          wouldHaveSaid: t.say("…", "the manufacturer"),
          state: f.state,
          reason: f.reason,
        });
        continue;
      }

      const evidenceId = f.evidenceIds[0];
      const ev = ledger.evidence.find((e) => e.id === evidenceId);
      const publisher = ev ? (byId.get(ev.sourceId)?.publisher ?? "the manufacturer") : "the manufacturer";

      claims.push({
        id: `claim-${productId}-${f.field}`,
        productId,
        claimText: t.say(String(f.value), publisher),
        claimClass: t.claimClass,
        evidenceIds: f.evidenceIds,
        confidence: f.confidence,
        allowedContexts: t.contexts,
        prohibitedContexts: t.prohibited,
        freshnessRequirement: f.cadence,
        reviewerStatus: "unreviewed",
        notes: f.applicability === "all" ? undefined : `Applies to: ${f.applicability}.`,
      });
    }

    const suitability = suitabilityClaim(productId, fields);
    if (suitability) claims.push(suitability);
  }

  return { claims, blocked };
}

/** Claim classes this ledger will never emit, and why. */
export const NEVER_EMITTED: { claimClass: ClaimClass; reason: string }[] = [
  { claimClass: "tested_observation", reason: "BotPlanet has not tested any unit; no capture exists to support one." },
  { claimClass: "comparative_statement", reason: "Comparisons need a verified value for the same field on every product being compared; the launch set does not yet have that for any field." },
  { claimClass: "commercial_observation", reason: "Price, stock and offer terms live in D1 with their own freshness stamp and never enter the evidence model." },
  { claimClass: "prohibited_unsupported", reason: "By definition — a statement with no evidence is not published." },
];
