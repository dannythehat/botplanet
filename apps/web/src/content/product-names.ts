/**
 * Retired product URLs.
 *
 * Two records changed the machine they describe on 3 August 2026, at the
 * owner's direction:
 *
 *   /aiper-scuba-x1/    →  Aiper Scuba X1 Pro       (same brand, up the range)
 *   /dolphin-premier/   →  BuBlue Bubot 800P Gen2   (different manufacturer)
 *
 * D1 now holds the corrected slug, name and brand, so nothing here overrides
 * what the database says — the database is right. What remains is the debt the
 * rename created: both old URLs were published in the sitemap and could have
 * been linked or indexed. They must not 404, and they must not keep serving a
 * page under a name that no longer matches, so each answers with a permanent
 * redirect to where the product actually lives.
 *
 * These entries are not decoration. Delete one and a published URL starts
 * returning 404 for a product that still exists.
 */

export interface RetiredSlug {
  /** Where the old URL now points. */
  to: string;
  /** What the record held when that URL was published. */
  wasNamed: string;
  /** What it holds now. */
  isNamed: string;
  changedOn: string;
  reason: string;
}

/* @extension-point per-product | optional | Only needed when a product's slug
   changes or the product is dropped. Without an entry the old URL 404s instead
   of redirecting, and every link and ranking it had is thrown away. */
export const RETIRED_SLUGS: Record<string, RetiredSlug> = {
  /* THE THREE WINBOTS WERE MERGED HERE ON 7 AUGUST 2026 AND UNMERGED ON
     8 AUGUST, at the owner's direction. Their entries are gone, so
     /ecovacs-winbot-w3-omni/, /ecovacs-winbot-w2s/ and /ecovacs-winbot-mini/
     serve their own reviews again rather than 301ing to a sibling.

     WHY THE MERGE WAS WRONG, recorded because the reasoning for it was sound
     and the outcome still was not. The 5 August research capped the category
     at three WINBOTs on a real argument: "a category of one brand is a worse
     page for a reader and a worse hedge for us." Eleven reviews were built the
     next day ignoring that, six of them WINBOTs, and the merge was the
     correction.

     What it missed is that all three stayed PUBLISHED in D1 with live Amazon
     offers. A redirect is the right answer for a product that no longer
     exists. These exist, they are in stock, and they sit on the best-of page's
     ranked list — so the 301s left three sellable products that no page on the
     site could reach. Brand concentration is a reason to write about other
     brands. It is not a reason to hide a buy button.

     The parent reviews keep their variant sections. They now route to these
     pages instead of standing in for them. */
  /* Both of these point at the FINAL destination, not at each other. The
     record moved twice in one day — X1 → X1 Pro → X1 Pro Max — and a chain of
     301s is a chain of chances to lose a visitor. Each retired URL gets there
     in a single hop. */
  "aiper-scuba-x1": {
    to: "aiper-scuba-x1-pro-max",
    wasNamed: "Aiper Scuba X1",
    isNamed: "Aiper Scuba X1 Pro Max",
    changedOn: "2026-08-03",
    reason:
      "Aiper's own page for the URL this record was built against is titled 'Scuba X1 Essential' — the entry model of an X1 Essential / X1 Pro / X1 Pro Max family — and its Amazon listing had no buying option at all. The owner supplied the Pro's listing and artwork and confirmed the Pro is what BotPlanet should sell. The record then moved again the same day, to the Pro Max, when the owner supplied that listing instead. Every observation the record held was read from the Essential's page and was removed rather than carried across.",
  },
  "aiper-scuba-x1-pro": {
    to: "aiper-scuba-x1-pro-max",
    wasNamed: "Aiper Scuba X1 Pro",
    isNamed: "Aiper Scuba X1 Pro Max",
    changedOn: "2026-08-03",
    reason:
      "Held the Scuba X1 Pro for part of one day. The only listing supplied for the Pro turned out to be the base X1 bundled with a HydroComm Pro monitor, so the Pro never had a buy link; the owner then supplied the Pro Max, whose Amazon listing names itself unambiguously (Model Name \"Scuba X1 Pro Max\"). This URL was live briefly and is redirected rather than left to 404.",
  },
  "dolphin-premier": {
    to: "bublue-bubot-800p",
    wasNamed: "Dolphin Premier",
    isNamed: "BuBlue Bubot 800P Gen2",
    changedOn: "2026-08-03",
    reason:
      "The Dolphin Premier was withdrawn on 31 July: no manufacturer page, a manual covering a different machine, and no Amazon US listing at all. The owner replaced it with the BuBlue Bubot 800P Gen2, whose identity was machine-read from its listing the same day — Brand BUBLUE, Model Number 'Bubot 800P gen2'. A different manufacturer, so the brand row changed too. The Dolphin's own evidence is kept whole in RETIRED_VERIFICATIONS.",
  },
};

/**
 * Resolve an incoming URL segment.
 *
 * Returns the slug to query D1 with, and — when the visitor arrived on a
 * retired URL — where to send them instead.
 */
export function resolveSlug(requested: string): { storedSlug: string; redirectTo: string | null } {
  const retired = RETIRED_SLUGS[requested];
  return retired ? { storedSlug: retired.to, redirectTo: retired.to } : { storedSlug: requested, redirectTo: null };
}

/* ------------------------------------------------------------------ */
/* Reviews merged into another product's page                          */
/* ------------------------------------------------------------------ */

/**
 * A product whose PAGE was merged into another product's review.
 *
 * DIFFERENT FROM BOTH TABLES AROUND IT, and the distinction is the whole
 * reason this exists rather than being crammed into RETIRED_SLUGS. A retired
 * slug means the record changed model — was named X, is named Y — and
 * resolveSlug rewrites the D1 query with it. A removed product means the
 * machine left the catalogue and its URL goes to the category. Neither is
 * true here: the product is unchanged, still stocked, still matchable, still
 * has its own destination and its own /go/ key. Only its page went, because
 * it was the second page arguing with the first over the same search terms.
 *
 * So the redirect target is a REVIEW URL rather than a slug to re-query, and
 * the merged review is required to carry a buy path for the machine whose page
 * it absorbed — see ReviewContent.alsoCovers. A merge that drops the buy path
 * has not merged two pages, it has deleted a product.
 */
export interface MergedReview {
  /** Category the surviving review lives under. */
  categorySlug: string;
  /** Slug of the review that now covers this machine. */
  into: string;
  name: string;
  mergedOn: string;
  reason: string;
}

export const MERGED_REVIEWS: Record<string, MergedReview> = {
  "mammotion-luba-3-awd-3000h": {
    categorySlug: "robotic-lawn-mowers",
    into: "mammotion-luba-3-awd-1500h",
    name: "Mammotion LUBA 3 AWD 3000H",
    mergedOn: "2026-08-11",
    reason:
      "The 1500H and the 3000H are one design in two sizes: same chassis, same 80% slope figure, same all-wheel drive, same 15 Ah battery, same 215-minute run, same 2.2–4.0 in cutting range on the SKUs we link. They differ on rated area, mowing rate, zone count and one navigation line. Two pages for that meant two pages chasing the same head terms — 'mammotion luba 3' at 1,600/mo and 'luba 3 awd' at 1,000 — while each held an exact-SKU term worth 30 and 40 respectively. Neither could win a term the other was also chasing. The surviving page names both machines in its H1, states the three differences its maker publishes only in listing titles, and carries a tracked buy path for each.",
  },
};

/** Where a merged product's URL should send a visitor. */
export const mergedRedirect = (slug: string): string | null => {
  const m = MERGED_REVIEWS[slug];
  return m ? `/robots/${m.categorySlug}/${m.into}/` : null;
};

/* ------------------------------------------------------------------ */
/* Products removed from the catalogue                                 */
/* ------------------------------------------------------------------ */

/**
 * A product that has LEFT, rather than one that changed model.
 *
 * Its row stays in D1 as `archived`, so nothing about it is destroyed, but it
 * no longer appears in listings, the comparison table, the matcher or the
 * sitemap. Its URL was published and indexed, so it must not 404 — it goes to
 * the category it belonged to, which is the nearest genuinely useful page.
 */
export interface RemovedProduct {
  /** Category slug to send the visitor to. */
  categorySlug: string;
  name: string;
  removedOn: string;
  reason: string;
}

export const REMOVED_PRODUCTS: Record<string, RemovedProduct> = {
  "dolphin-e10": {
    categorySlug: "robotic-pool-cleaners",
    name: "Dolphin E10",
    removedOn: "2026-08-03",
    reason:
      "Removed from the catalogue at the owner's direction. It was the only product with no BotPlanet artwork, and the only above-ground floor-only machine in a set that had moved upmarket around it. The evidence record is kept in RETIRED_VERIFICATIONS and the D1 row is archived rather than deleted, so the decision stays traceable and the product could return.",
  },
};

/** Where a removed product's URL should send a visitor, or null. */
export const removedRedirect = (slug: string): string | null => {
  const r = REMOVED_PRODUCTS[slug];
  return r ? `/robots/${r.categorySlug}/` : null;
};
