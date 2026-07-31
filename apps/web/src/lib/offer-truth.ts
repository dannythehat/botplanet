/**
 * The offer engine: build, gate, rank and validate.
 *
 * Offers are DERIVED from the destination registry, the retailer registry and
 * the programme registry rather than hand-listed, so an offer cannot exist for a
 * retailer we have no relationship with, or point at a destination nobody
 * recorded. The three ways an offer used to be able to lie — an unapproved
 * seller, a copied price, a search link dressed as a product — are all closed
 * here by construction rather than by review.
 *
 * Commission never influences anything except a genuine tie between otherwise
 * equivalent approved offers, and even then it is read from D1's private column
 * by the caller and passed in; this module never sees a rate.
 */
import { PRODUCTS, catalogueStatusOf } from "../content/products";
import { buildReport } from "./evidence-report";
import { WARRANTY_NOT_CONFIRMED } from "./warranty";
import { DESTINATIONS, REDIRECT_KEYS, REJECTED_CANDIDATES, destinationFor } from "../content/commerce/destinations";
import { PROGRAMMES, RETAILERS, programme, retailer } from "../content/commerce/registry";
import { manualCheckFor } from "../content/commerce/manual-checks";
import { serpApiObservationFor } from "../content/commerce/serpapi-observations";
import {
  CURRENT_PRICE_STATES,
  FRESHNESS_WINDOW_DAYS,
  type FreshnessState,
  type Offer,
  type OfferPublication,
  type OfferSource,
  type ShippingState,
  type StockState,
} from "../content/commerce/types";

export const AS_AT = "2026-07-31";

/* ------------------------------------------------------------------ */
/* Normalisation                                                       */
/* ------------------------------------------------------------------ */

/**
 * Maps a retailer's stock wording to a controlled state.
 *
 * An unrecognised phrase becomes `unknown`, never `in_stock`. And an enabled Buy
 * button is not an input here at all — the absence of the words "out of stock"
 * is not evidence of availability.
 */
export function normaliseStock(wording: string | null): StockState {
  if (!wording) return "unknown";
  const s = wording.toLowerCase();
  if (/\bpre-?order\b/.test(s)) return "preorder";
  if (/\bback-?order\b/.test(s)) return "backorder";
  if (/only \d+ left|low stock|limited stock/.test(s)) return "low_stock";
  if (/temporarily (out of stock|unavailable)/.test(s)) return "temporarily_unavailable";
  if (/currently unavailable|out of stock|sold out/.test(s)) return "unavailable";
  if (/sold by|ships from and sold by/.test(s)) return "seller_specific";
  if (/\bin stock\b|available now|ships within/.test(s)) return "in_stock";
  return "unknown";
}

/** Maps shipping wording to a controlled state, defaulting to unknown. */
export function normaliseShipping(wording: string | null): ShippingState {
  if (!wording) return "unknown";
  const s = wording.toLowerCase();
  if (/free (shipping|delivery)/.test(s)) return "free";
  if (/calculated at checkout|shipping calculated/.test(s)) return "calculated_at_checkout";
  if (/enter (your )?(zip|postcode|postal)/.test(s)) return "postcode_dependent";
  if (/prime|membership|subscriber/.test(s)) return "membership_dependent";
  if (/\d+\s*[-–]\s*\d+\s*(business\s*)?days/.test(s)) return "estimated_range";
  if (/\$\s*\d/.test(s)) return "charged";
  return "unknown";
}

/** Currency codes we accept. Anything else is a data error, not a currency. */
export const SUPPORTED_CURRENCIES = ["USD"];

export function isValidCurrency(code: string): boolean {
  return SUPPORTED_CURRENCIES.includes(code);
}

/** Delivered price only exists when BOTH parts are known. */
export function deliveredPrice(baseMinor: number | null, shippingMinor: number | null, shippingState: ShippingState): number | null {
  if (baseMinor === null) return null;
  if (shippingState === "free") return baseMinor;
  if (shippingMinor === null) return null;
  return baseMinor + shippingMinor;
}

/* ------------------------------------------------------------------ */
/* Freshness                                                           */
/* ------------------------------------------------------------------ */

const daysBetween = (from: string, to: Date) => (to.getTime() - new Date(from).getTime()) / 86_400_000;

/**
 * Freshness from the source type and the check date.
 *
 * A `researched_snapshot` can never be current: its window is zero days, so it
 * lands on `indicative` immediately and can never be printed as a live price.
 * That is deliberate — the nineteen stored prices are all of this kind.
 */
export function freshnessFor(source: OfferSource, checkedDate: string | null, today = new Date(AS_AT)): FreshnessState {
  if (source === "none" || !checkedDate) return "unknown";
  if (source === "researched_snapshot") return "indicative";
  const age = daysBetween(checkedDate, today);
  const window = FRESHNESS_WINDOW_DAYS[source];
  // "live" is reserved for something checked today; everything else inside the
  // window is "recently checked", which is what a dated price actually is.
  if (age <= 1) return "live";
  if (age <= window) return "recently_checked";
  return "stale";
}

/* ------------------------------------------------------------------ */
/* Offer construction                                                  */
/* ------------------------------------------------------------------ */

/**
 * Builds the offer set from the registries.
 *
 * One offer per (product, approved retailer). A retailer that is not approved
 * produces no offer at all — the suppression happens before an Offer object
 * exists, so there is nothing for a surface to accidentally render.
 */
export function buildOffers(today = new Date(AS_AT)): Offer[] {
  const report = buildReport(new Date(AS_AT));
  const offers: Offer[] = [];

  for (const p of Object.values(PRODUCTS)) {
    // A product withdrawn from the active catalogue carries no offer at all.
    // It keeps its page and its evidence; what it loses is the ability to be
    // sold, which is the whole meaning of the withdrawal.
    if (catalogueStatusOf(p.productId) !== "active") continue;
    const row = report.products.find((r) => r.productId === p.productId);

    for (const r of RETAILERS) {
      if (r.approval !== "approved") continue;
      const dest = destinationFor(p.productId, r.id);
      if (!dest) continue;

      const prog = PROGRAMMES.find((x) => x.market === "us" && x.state === "active" && r.affiliateNetworks.includes("amazon_associates_us") && x.id === "prog-amazon-us");

      /*
       * Source precedence, highest authority first.
       *
       * The aggregator relays the retailer's own live page, so it outranks a
       * human check that was exact at one instant and then aged — and it sees
       * the seller line, which a screenshot often crops. Where both exist the
       * aggregator wins; where only a human looked, the human stands; where
       * neither did, the researched snapshot can never be a current price.
       */
      const serp = r.id === "ret-amazon" ? serpApiObservationFor(p.productId) : undefined;
      const manual = manualCheckFor(p.productId, r.id);
      const check = serp
        ? {
            identityConfirmed: serp.identityConfirmed,
            priceMinor: serp.priceMinor,
            stockWording: serp.stockWording,
            shippingWording: serp.shippingWording,
            sellerWording: serp.sellerWording,
            returnsWording: serp.returnsWording,
            checkedDate: serp.checkedDate,
          }
        : manual;
      const source: OfferSource = serp
        ? "retailer_api_via_aggregator"
        : manual
          ? "manual_check"
          : "researched_snapshot";
      const checkedDate = check?.checkedDate ?? AS_AT;
      const freshness = freshnessFor(source, checkedDate, today);
      const shippingState = normaliseShipping(check?.shippingWording ?? null);

      offers.push({
        id: `offer-${p.productId}-${r.id}`,
        productId: p.productId,
        retailerId: r.id,
        programmeId: prog?.id ?? null,
        market: "us",
        currency: "USD",
        destination: check?.identityConfirmed
          ? // A human read the page and confirmed the model, which is the only
            // thing that can raise a destination to verified_exact here.
            //
            // The SELLER is a separate question and does not come along for the
            // ride: a named seller line means a marketplace third party, and no
            // seller line means we do not know. It must not default to Amazon,
            // because the returns route and any seller warranty follow whoever
            // is actually selling, and the first product checked turned out to
            // be sold by "The Pool Spot" rather than by Amazon.
            {
              ...dest,
              confidence: "verified_exact" as const,
              sellerIdentity: check.sellerWording,
              sellerModel: (check.sellerWording ? "marketplace_third_party" : "unknown") as const,
            }
          : dest,
        basePriceMinor: check?.priceMinor ?? null,
        shipping: {
          state: check ? shippingState : "not_exposed_by_source",
          sourceWording: check?.shippingWording ?? null,
          costMinor: shippingState === "free" ? 0 : null,
          estimatedMinDays: null,
          estimatedMaxDays: null,
          // Amazon quotes delivery against a destination, so it is always
          // location-specific and the location is recorded on the check.
          locationSpecific: Boolean(check),
          market: "us",
          checkedDate: check?.checkedDate ?? null,
          confidence: check ? "high" : "none",
        },
        deliveredPriceMinor: check ? deliveredPrice(check.priceMinor, shippingState === "free" ? 0 : null, shippingState) : null,
        stock: {
          state: normaliseStock(check?.stockWording ?? null),
          sourceWording: check?.stockWording ?? null,
          checkedDate: check?.checkedDate ?? null,
        },
        warranty: {
          // Straight from the Job 8 ledger. A retailer never overwrites it.
          manufacturer: row?.warranty.text ?? WARRANTY_NOT_CONFIRMED,
          manufacturerConfirmed: row?.warranty.status === "confirmed",
          retailerProtectionPlan: null,
          // The seller's returns offer, labelled as theirs — never merged into
          // the manufacturer warranty.
          retailerReturnPeriod: check?.returnsWording ?? null,
          marketplaceSellerReturnRoute:
            check?.sellerWording
              ? `Sold by ${check.sellerWording}, a marketplace seller, so returns and any seller warranty are handled by them rather than by Amazon.`
              : r.sellerModel === "mixed" || r.sellerModel === "marketplace_third_party"
                ? "Returns route depends on whether the listing is sold by the retailer or a marketplace seller; the seller is not exposed to us."
                : null,
        },
        source,
        sourceReference: check
          ? `Read from the live listing by ${check.checkedBy} on ${check.checkedDate}, delivering to ${check.checkedForLocation}.`
          : dest.sourceReference,
        sourceCheckedDate: checkedDate,
        freshness,
        confidence: check?.identityConfirmed ? "high" : dest.confidence === "researched_exact" ? "medium" : "low",
        // Read from the recorded D1 keys, never derived from the slug.
        redirectKey: r.id === "ret-amazon" ? (REDIRECT_KEYS[p.productId] ?? null) : null,
        active: dest.confidence !== "none",
        suppressionReason:
          dest.confidence === "search_only"
            ? "no exact destination exists, so this is a fallback click rather than a verified offer"
            : null,
      });
    }
  }

  return offers;
}

/* ------------------------------------------------------------------ */
/* Publication gates                                                   */
/* ------------------------------------------------------------------ */

/**
 * What a surface may say about one offer.
 *
 * Each right is granted separately and each refusal is written down. The most
 * important pair: `linkable` can be true while `priceShowable` is false — we can
 * honestly send someone to a product page without claiming to know its price.
 */
export function publicationFor(offer: Offer): OfferPublication {
  const blockers: string[] = [];
  const r = retailer(offer.retailerId);
  const prog = offer.programmeId ? programme(offer.programmeId) : null;

  if (!r || r.approval !== "approved") blockers.push(`retailer ${offer.retailerId} is not an approved seller`);
  if (prog && !prog.usableForUsMarket) blockers.push(`programme ${prog.id} may not serve a US customer`);
  if (prog && prog.state !== "active") blockers.push(`programme ${prog.id} is ${prog.state}, not active`);
  if (!isValidCurrency(offer.currency)) blockers.push(`unsupported currency ${offer.currency}`);

  const exact = offer.destination.confidence === "verified_exact" || offer.destination.confidence === "researched_exact";
  if (!exact) blockers.push("no exact product destination — a search link is not an offer");

  // A price may be shown only with the date it was checked beside it. That is
  // what makes a month-old figure honest rather than a stale claim.
  const priceCurrent =
    offer.basePriceMinor !== null && offer.sourceCheckedDate !== null && CURRENT_PRICE_STATES.includes(offer.freshness);
  if (offer.basePriceMinor === null) blockers.push("no price from an approved source");
  else if (offer.sourceCheckedDate === null) blockers.push("price has no check date, so it cannot be shown with one");
  else if (!priceCurrent) blockers.push(`price is ${offer.freshness}, so it may not be shown as current`);

  if (offer.stock.state === "unknown") blockers.push("stock state unknown — the destination resolving is not proof of stock");
  if (offer.shipping.state === "unknown" || offer.shipping.state === "not_exposed_by_source") {
    blockers.push("shipping not exposed by any checked source");
  }

  const showable = Boolean(r && r.approval === "approved") && offer.active;
  // Linkable is the loosest right: an approved retailer and a usable programme.
  const linkable = showable && Boolean(prog?.usableForUsMarket) && prog?.state === "active";

  return {
    showable,
    linkable,
    priceShowable: showable && priceCurrent,
    stockShowable: showable && offer.stock.state !== "unknown" && offer.stock.checkedDate !== null,
    shippingShowable: showable && offer.shipping.state !== "unknown" && offer.shipping.state !== "not_exposed_by_source",
    // Offer schema needs a price, a currency, an availability and an exact
    // product. Emitting it without them would be a machine-readable lie.
    schemaEligible: showable && exact && priceCurrent && offer.stock.state !== "unknown" && isValidCurrency(offer.currency),
    blockers,
  };
}

/* ------------------------------------------------------------------ */
/* Preferred offer                                                     */
/* ------------------------------------------------------------------ */

export interface PreferredOffer {
  productId: string;
  offerId: string | null;
  /** Every factor that contributed, in the order applied. */
  audit: string[];
  /** True when commission was needed to settle a genuine tie. */
  commissionUsedAsTieBreak: boolean;
}

const CONFIDENCE_RANK: Record<string, number> = { verified_exact: 0, researched_exact: 1, search_only: 2, none: 3 };

/**
 * Chooses the offer to feature for a product that has ALREADY been chosen.
 *
 * This never influences which product wins — it runs after that decision, which
 * is the whole point of keeping offer ranking out of product ranking.
 *
 * Commission is the last resort and only for a genuine tie: identical exact-match
 * confidence, identical stock, identical delivered price. The caller supplies the
 * comparison because rates live in D1's private column; this function never sees
 * a number, only a preference between two IDs.
 */
export function preferredOffer(
  productId: string,
  offers: Offer[],
  tieBreakByCommission?: (a: Offer, b: Offer) => number,
): PreferredOffer {
  const audit: string[] = [];
  const mine = offers.filter((o) => o.productId === productId);
  audit.push(`${mine.length} offer(s) exist for this product`);

  const eligible = mine.filter((o) => publicationFor(o).showable);
  audit.push(`${eligible.length} from an approved retailer`);
  if (eligible.length === 0) {
    audit.push("no approved offer — nothing is featured");
    return { productId, offerId: null, audit, commissionUsedAsTieBreak: false };
  }

  const sorted = [...eligible].sort((a, b) => {
    const c = CONFIDENCE_RANK[a.destination.confidence] - CONFIDENCE_RANK[b.destination.confidence];
    if (c !== 0) return c;
    const stockRank = (o: Offer) => (o.stock.state === "in_stock" ? 0 : o.stock.state === "unknown" ? 1 : 2);
    const s = stockRank(a) - stockRank(b);
    if (s !== 0) return s;
    const pa = a.deliveredPriceMinor ?? Number.MAX_SAFE_INTEGER;
    const pb = b.deliveredPriceMinor ?? Number.MAX_SAFE_INTEGER;
    if (pa !== pb) return pa - pb;
    return 0;
  });

  audit.push(`ranked by exact-match confidence, then stock, then delivered price`);

  const top = sorted[0];
  const equivalent = sorted.filter(
    (o) =>
      o.destination.confidence === top.destination.confidence &&
      o.stock.state === top.stock.state &&
      (o.deliveredPriceMinor ?? null) === (top.deliveredPriceMinor ?? null),
  );

  let commissionUsed = false;
  let chosen = top;
  if (equivalent.length > 1 && tieBreakByCommission) {
    chosen = [...equivalent].sort(tieBreakByCommission)[0];
    commissionUsed = true;
    audit.push(`${equivalent.length} offers were genuinely equivalent; commission settled the tie`);
  } else if (equivalent.length > 1) {
    audit.push(`${equivalent.length} offers were equivalent and no tie-break was supplied; the first stable match was kept`);
  }

  audit.push(`chosen: ${chosen.id} (${chosen.destination.confidence})`);
  return { productId, offerId: chosen.id, audit, commissionUsedAsTieBreak: commissionUsed };
}

/* ------------------------------------------------------------------ */
/* Validation                                                          */
/* ------------------------------------------------------------------ */

export interface OfferIssue {
  severity: "error" | "warning";
  rule: string;
  detail: string;
  offerId?: string;
  productId?: string;
}

export function validateOffers(offers = buildOffers()): OfferIssue[] {
  const issues: OfferIssue[] = [];
  const productIds = new Set(Object.values(PRODUCTS).map((p) => p.productId));
  const retailerIds = new Set(RETAILERS.map((r) => r.id));
  const programmeIds = new Set(PROGRAMMES.map((p) => p.id));
  const seenIds = new Set<string>();
  const seenKeys = new Set<string>();

  for (const o of offers) {
    if (seenIds.has(o.id)) issues.push({ severity: "error", rule: "offer_id_unique", detail: `duplicate offer id ${o.id}`, offerId: o.id });
    seenIds.add(o.id);

    if (!productIds.has(o.productId)) issues.push({ severity: "error", rule: "valid_product_id", detail: `unknown product ${o.productId}`, offerId: o.id });
    if (!retailerIds.has(o.retailerId)) issues.push({ severity: "error", rule: "valid_retailer_id", detail: `unknown retailer ${o.retailerId}`, offerId: o.id });
    if (o.programmeId && !programmeIds.has(o.programmeId)) {
      issues.push({ severity: "error", rule: "valid_programme_id", detail: `unknown programme ${o.programmeId}`, offerId: o.id });
    }

    if (o.redirectKey) {
      if (seenKeys.has(o.redirectKey)) issues.push({ severity: "error", rule: "redirect_key_unique", detail: `duplicate redirect key ${o.redirectKey}`, offerId: o.id });
      seenKeys.add(o.redirectKey);
    }

    if (!isValidCurrency(o.currency)) issues.push({ severity: "error", rule: "currency_valid", detail: `unsupported currency ${o.currency}`, offerId: o.id });
    if (o.basePriceMinor !== null && o.basePriceMinor < 0) issues.push({ severity: "error", rule: "no_negative_price", detail: "negative price", offerId: o.id });

    // A US surface may never carry a non-US offer.
    if (o.market !== "us") issues.push({ severity: "error", rule: "us_market_only", detail: `offer market is ${o.market}`, offerId: o.id });

    // The offer's product must match the destination's exact model.
    if (o.destination.productId !== o.productId) {
      issues.push({ severity: "error", rule: "destination_matches_product", detail: "destination belongs to a different product", offerId: o.id });
    }

    // An unapproved retailer must never produce an offer at all.
    const r = retailer(o.retailerId);
    if (r && r.approval !== "approved") {
      issues.push({ severity: "error", rule: "approved_retailer_only", detail: `${r.displayName} is ${r.approval} and may not carry an offer`, offerId: o.id });
    }

    // A pending or territory-restricted programme may never back a live offer.
    const prog = o.programmeId ? programme(o.programmeId) : null;
    if (prog && prog.state !== "active") {
      issues.push({ severity: "error", rule: "active_programme_only", detail: `programme ${prog.id} is ${prog.state}`, offerId: o.id });
    }
    if (prog && !prog.usableForUsMarket) {
      issues.push({ severity: "error", rule: "us_usable_programme", detail: `programme ${prog.id} may not serve US customers`, offerId: o.id });
    }

    // A price may not exist without a check date behind it.
    if (o.basePriceMinor !== null && !o.sourceCheckedDate) {
      issues.push({ severity: "error", rule: "price_needs_check_date", detail: "price with no check date", offerId: o.id });
    }

    // Warranty separation: the manufacturer term must come from Job 8.
    if (o.warranty.retailerProtectionPlan && !/retailer|protection plan/i.test(o.warranty.retailerProtectionPlan)) {
      issues.push({ severity: "warning", rule: "retailer_plan_labelled", detail: "retailer protection plan is not labelled as retailer-provided", offerId: o.id });
    }

    const pub = publicationFor(o);
    if (pub.schemaEligible && (o.basePriceMinor === null || o.stock.state === "unknown")) {
      issues.push({ severity: "error", rule: "schema_needs_price_and_stock", detail: "schema-eligible without a price or stock state", offerId: o.id });
    }
    if (pub.priceShowable && o.basePriceMinor === null) {
      issues.push({ severity: "error", rule: "no_price_without_value", detail: "price marked showable with no price", offerId: o.id });
    }
  }

  // Every product should be reachable somehow, even if only by a fallback click.
  for (const p of Object.values(PRODUCTS)) {
    if (catalogueStatusOf(p.productId) !== "active") continue;
    if (!offers.some((o) => o.productId === p.productId)) {
      issues.push({ severity: "warning", rule: "product_has_route", detail: "no offer or fallback route", productId: p.productId });
    }
  }

  return issues;
}

/* ------------------------------------------------------------------ */
/* Report                                                              */
/* ------------------------------------------------------------------ */

export function offerReport(today = new Date(AS_AT)) {
  const offers = buildOffers(today);
  const issues = validateOffers(offers);

  const products = Object.values(PRODUCTS).map((p) => {
    const mine = offers.filter((o) => o.productId === p.productId);
    const pref = preferredOffer(p.productId, offers);
    const pubs = mine.map((o) => ({ offer: o, pub: publicationFor(o) }));
    return {
      productId: p.productId,
      slug: p.slug,
      offers: mine,
      publications: pubs,
      preferred: pref,
      verifiedOffers: pubs.filter((x) => x.pub.showable && x.offer.destination.confidence !== "search_only").length,
      linkable: pubs.filter((x) => x.pub.linkable).length,
      priceShowable: pubs.filter((x) => x.pub.priceShowable).length,
      schemaEligible: pubs.filter((x) => x.pub.schemaEligible).length,
      rejected: REJECTED_CANDIDATES.filter((c) => c.productId === p.productId),
    };
  });

  const all = offers.map(publicationFor);
  return {
    offers,
    issues,
    products,
    totals: {
      retailers: RETAILERS.length,
      retailersApproved: RETAILERS.filter((r) => r.approval === "approved").length,
      retailersResearchedOnly: RETAILERS.filter((r) => r.approval === "researched_only").length,
      programmesActive: PROGRAMMES.filter((p) => p.state === "active").length,
      programmesPending: PROGRAMMES.filter((p) => p.state === "pending").length,
      programmesTerritoryRestricted: PROGRAMMES.filter((p) => p.state === "territory_restricted").length,
      offers: offers.length,
      exactDestination: offers.filter((o) => o.destination.confidence === "researched_exact" || o.destination.confidence === "verified_exact").length,
      searchOnly: offers.filter((o) => o.destination.confidence === "search_only").length,
      showable: all.filter((p) => p.showable).length,
      linkable: all.filter((p) => p.linkable).length,
      priceShowable: all.filter((p) => p.priceShowable).length,
      stockShowable: all.filter((p) => p.stockShowable).length,
      schemaEligible: all.filter((p) => p.schemaEligible).length,
      rejectedCandidates: REJECTED_CANDIDATES.length,
      destinationsRecorded: DESTINATIONS.length,
    },
  };
}
