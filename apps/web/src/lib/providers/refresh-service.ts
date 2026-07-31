/**
 * The scheduled refresh, end to end.
 *
 * This is the operational half of Job 10. The policy — weekly baseline, capped
 * daily exceptions, a hard monthly ceiling — already existed and was tested;
 * what did not exist was anything that RAN it, or anywhere for a Worker to put
 * the answers. Without both, the live prices simply expire and the catalogue
 * empties itself while looking healthy.
 *
 * THE ORDER OF OPERATIONS MATTERS
 *
 *   1. count what this calendar month has already spent
 *   2. plan the run against the ceiling BEFORE spending anything
 *   3. record the skips the plan already implies
 *   4. read each due listing
 *   5. gate each result fail-closed
 *   6. write accepted and refused results together
 *
 * Planning before spending is the whole reason a ceiling works. Discovering
 * halfway through that the month is exhausted leaves a half-refreshed
 * catalogue where some prices are current and some are a fortnight old, with
 * nothing on the page to tell them apart.
 *
 * IDEMPOTENCE. Every write is an upsert on a natural key: a run on (scope,
 * date), an observation on (product, asin, date). Running twice in a day
 * converges rather than duplicating, so a retry after a partial failure is
 * safe and needs no cleanup.
 *
 * A DRY RUN WRITES NOTHING. It plans, it reports, and it returns. That is what
 * makes the wiring verifiable today instead of next Tuesday.
 */
import type { AmazonListing, AmazonProvider, BuyingOption } from "./amazon-provider";
import { MONTHLY_CREDIT_CEILING, planRefresh, type ExceptionReason, type RefreshCandidate } from "./refresh-policy";

/** A row the service will write. Shaped to the D1 table, not to the provider. */
export interface ObservationRow {
  productId: string;
  asin: string;
  checkedDate: string;
  providerId: string;
  observedTitle: string | null;
  brand: string | null;
  modelName: string | null;
  modelNumber: string | null;
  priceMinor: number | null;
  currency: string;
  stockWording: string | null;
  shippingWording: string | null;
  sellerWording: string | null;
  returnsWording: string | null;
  identityConfirmed: boolean;
  matchEvidence: string;
  accepted: boolean;
  suppressionReason: string | null;
}

export interface SkipRow {
  productId: string;
  reason: string;
  detail: string;
}

export interface RefreshOutcome {
  runId: string;
  scope: string;
  runDate: string;
  status: "ok" | "partial" | "skipped" | "failed";
  dryRun: boolean;
  productsPlanned: number;
  productsRead: number;
  creditsUsed: number;
  creditsMonthToDate: number;
  ceilingReached: boolean;
  observations: ObservationRow[];
  skips: SkipRow[];
  notes: string;
}

/**
 * The expected identity of a product, from the Job 8 record.
 *
 * Matching is on BRAND plus MODEL, from the listing's details table — never on
 * the title, which is copy the seller writes. Two candidates in the last run
 * would have passed a title check and were a different machine.
 */
export interface ExpectedIdentity {
  productId: string;
  asin: string;
  brand: string;
  /** Any of these, matched case-insensitively, confirms the model. */
  modelTokens: string[];
  /** If any of these appears in the model fields, it is a SIBLING. Refuse. */
  denyTokens: string[];
  exception?: ExceptionReason;
  lastCheckedOn: string | null;
}

const norm = (s: string | null | undefined): string => (s ?? "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();

/**
 * Whole-token match, with a prefix allowance for SKU-shaped tokens.
 *
 * "C1" must not match inside "C1 PLUS" — that is the sibling trap. But a SKU
 * genuinely varies by suffix: the Beatbot we hold is PRCMDS02 and the listing
 * publishes PRCMDS02G-2025 and PRCMDS02-NA-A-2025, which are the same part in
 * two notations. So a token containing BOTH letters and digits may match as a
 * prefix; a human-readable name may not.
 */
const hasToken = (haystack: string, token: string): boolean => {
  const t = norm(token);
  if (new RegExp(`(^| )${t}( |$)`).test(haystack)) return true;
  const skuish = /^[a-z]+\d[a-z0-9]*$/.test(t);
  return skuish && new RegExp(`(^| )${t}[a-z0-9]*( |$)`).test(haystack);
};

/**
 * Words brands use to separate one model from its siblings. These are what
 * actually distinguish a C1 from a C1 Plus, so they are compared as a set
 * rather than searched for individually.
 */
const FAMILY_QUALIFIERS = ["pro", "plus", "max", "ultra", "lite", "elite", "mini", "supreme", "premium"];
const qualifiersIn = (text: string): Set<string> => {
  const n = norm(text);
  return new Set(FAMILY_QUALIFIERS.filter((q) => new RegExp(`(^| )${q}( |$)`).test(n)));
};

/**
 * Decide whether a listing is the product we hold.
 *
 * FAIL-CLOSED IN BOTH DIRECTIONS. A deny token anywhere in the identity fields
 * refuses outright — "C1 PLUS" is not a C1 no matter what the title says. And a
 * listing whose own fields disagree with each other is refused too: one
 * candidate gave model_name "Scuba S1 2026" and model_number "X5 Pro 2026" on
 * the same page, and a listing that cannot agree with itself cannot confirm
 * anything.
 */
export function matchIdentity(
  expected: ExpectedIdentity,
  listing: AmazonListing,
): { confirmed: boolean; evidence: string } {
  const a = listing.attributes;
  const fields = [a.modelName, a.modelNumber, a.manufacturerPartNumber].filter(Boolean) as string[];
  const brandOk = norm(a.brandName).includes(norm(expected.brand)) || norm(expected.brand).includes(norm(a.brandName));

  if (!brandOk) {
    return { confirmed: false, evidence: `Brand mismatch: listing says '${a.brandName ?? "none"}', we hold '${expected.brand}'.` };
  }
  const denied = expected.denyTokens.filter((d) => fields.some((f) => hasToken(norm(f), d)));
  if (denied.length) {
    return {
      confirmed: false,
      evidence: `SIBLING MODEL. The identity fields (${fields.join(" / ")}) contain '${denied.join("', '")}', which names a different model in the same family. The title is not consulted — it is copy the seller writes.`,
    };
  }
  const matched = fields.filter((f) => expected.modelTokens.some((t) => hasToken(norm(f), t)));
  if (!matched.length) {
    return {
      confirmed: false,
      evidence: `No identity field names the model. Listing gives (${fields.join(" / ") || "nothing"}); expected one of ${expected.modelTokens.join(", ")}.`,
    };
  }
  /*
   * Self-consistency, narrowly.
   *
   * The first version of this refused any field that carried digits and did not
   * match, which suppressed two products wrongly on the first live run: the
   * Nautilus CC Plus (part number "99996406-PCI") and the Beatbot (part number
   * "PRCMDS02-NA-A-2025"). A PART NUMBER IS NOT A RIVAL MODEL CLAIM, and
   * treating it as one hides real offers behind a scary-sounding refusal.
   *
   * What genuinely signals a sibling is a FAMILY QUALIFIER the model we hold
   * does not carry — the "Pro" in "X5 Pro 2026" sitting beside a model name of
   * "Scuba S1 2026". Comparison is on the qualifier SET, because our own models
   * carry qualifiers too: "SE Plus" must not refuse itself for containing
   * "plus".
   */
  const ours = qualifiersIn(expected.modelTokens.join(" "));
  const intruder = fields
    .map((f) => ({ field: f, extra: [...qualifiersIn(f)].filter((q) => !ours.has(q)) }))
    .find((x) => x.extra.length > 0);
  if (intruder) {
    return {
      confirmed: false,
      evidence: `SELF-CONTRADICTORY LISTING. Identity fields disagree: ${fields.join(" / ")}. '${intruder.field}' carries the family qualifier '${intruder.extra.join("', '")}', which the model we hold does not. A listing that cannot agree with itself cannot confirm an identity.`,
    };
  }
  return {
    confirmed: true,
    evidence: `Details table: brand '${a.brandName}', identity fields ${matched.join(" / ")} match ${expected.modelTokens.join("/")}. Matched on the structured fields, not the title.`,
  };
}

/** The buy-NEW option, or nothing. A used unit is never the price of a new one. */
export function buyNew(listing: AmazonListing): BuyingOption | null {
  return listing.buyingOptions.find((o) => o.condition === "new") ?? null;
}

/**
 * Every gate, applied in the order a reader would ask them. The first failure
 * wins and is recorded verbatim as the suppression reason.
 */
export function gate(expected: ExpectedIdentity, listing: AmazonListing, match: { confirmed: boolean; evidence: string }): string | null {
  if (listing.notFound) return "The listing does not exist. Nothing may be published for a destination that is not there.";
  if (!match.confirmed) return match.evidence;
  const nw = buyNew(listing);
  if (!nw) return "No new-condition buying option. A used or renewed unit is a different thing with a different warranty position.";
  if (nw.priceMinor === null) return "No buy-box price. A listing that exposes no price is not an offer.";
  if (!nw.stockWording) return "No availability stated.";
  if (!nw.sellerWording) return "No seller line. The returns route and any seller warranty follow whoever is actually selling, so an unnamed seller cannot be published.";
  if (!nw.deliveryWording) return "No delivery statement.";
  return null;
}

export interface RefreshDeps {
  provider: AmazonProvider;
  expected: ExpectedIdentity[];
  today: Date;
  runDate: string;
  scope: "scheduled" | "weekly" | "daily_exception" | "manual" | "dry_run";
  creditsUsedThisMonth: number;
  dryRun: boolean;
  ceiling?: number;
  runId: string;
}

/** Plan, read, gate. Persistence is the caller's job so this stays testable. */
export async function runRefresh(deps: RefreshDeps): Promise<RefreshOutcome> {
  const candidates: RefreshCandidate[] = deps.expected.map((e) => ({
    productId: e.productId,
    asin: e.asin,
    lastCheckedOn: e.lastCheckedOn,
    exception: e.exception ?? null,
  }));

  const { decisions, plannedCredits, ceilingReached } = planRefresh(candidates, {
    today: deps.today,
    creditsUsedThisMonth: deps.creditsUsedThisMonth,
    ceiling: deps.ceiling ?? MONTHLY_CREDIT_CEILING,
  });

  const observations: ObservationRow[] = [];
  const skips: SkipRow[] = [];
  let creditsUsed = 0;
  let read = 0;
  let hadError = false;

  for (const d of decisions) {
    if (d.skipped) {
      skips.push({ productId: d.productId, reason: d.skipped, detail: d.reason });
      continue;
    }
    if (deps.dryRun) continue;

    const expected = deps.expected.find((e) => e.productId === d.productId)!;
    const res = await deps.provider.getListing(expected.asin);
    creditsUsed += res.creditsUsed;

    if (!res.ok || !res.data) {
      hadError = true;
      skips.push({ productId: d.productId, reason: res.skipped ?? "provider_error", detail: res.detail });
      continue;
    }
    read += 1;
    const listing = res.data;
    const match = matchIdentity(expected, listing);
    const blocked = gate(expected, listing, match);
    const nw = buyNew(listing);

    observations.push({
      productId: expected.productId,
      asin: expected.asin,
      checkedDate: deps.runDate,
      providerId: listing.providerId,
      observedTitle: listing.title,
      brand: listing.attributes.brandName,
      modelName: listing.attributes.modelName,
      modelNumber: listing.attributes.modelNumber,
      // A blocked observation records what it saw but never a publishable price.
      priceMinor: blocked ? null : (nw?.priceMinor ?? null),
      currency: nw?.currency ?? "USD",
      stockWording: nw?.stockWording ?? null,
      shippingWording: nw?.deliveryWording ?? null,
      sellerWording: nw?.sellerWording ?? null,
      returnsWording: nw?.returnsWording ?? null,
      identityConfirmed: match.confirmed,
      matchEvidence: match.evidence,
      accepted: blocked === null,
      suppressionReason: blocked,
    });
  }

  const status: RefreshOutcome["status"] = deps.dryRun
    ? "skipped"
    : hadError
      ? "partial"
      : ceilingReached && read === 0
        ? "skipped"
        : "ok";

  return {
    runId: deps.runId,
    scope: deps.scope,
    runDate: deps.runDate,
    status,
    dryRun: deps.dryRun,
    productsPlanned: deps.dryRun ? plannedCredits : decisions.filter((d) => !d.skipped).length,
    productsRead: read,
    creditsUsed,
    creditsMonthToDate: deps.creditsUsedThisMonth,
    ceilingReached,
    observations,
    skips,
    notes: deps.dryRun
      ? `Dry run: ${plannedCredits} listing(s) would be read, ${skips.length} skipped. Nothing was written and no credit was spent.`
      : `${read} listing(s) read, ${observations.filter((o) => o.accepted).length} accepted, ${observations.filter((o) => !o.accepted).length} suppressed, ${skips.length} skipped.`,
  };
}
