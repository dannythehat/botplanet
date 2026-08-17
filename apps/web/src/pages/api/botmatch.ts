import type { APIRoute } from "astro";
import { and, eq, inArray } from "drizzle-orm";
import {
  scoreProducts,
  topGroup,
  rankOffers,
  explainWinner,
  type OfferCandidate,
  type PoolAnswers,
  type SuitabilityCandidate,
} from "@botplanet/scoring";
import { getDb, schema } from "../../lib/db";
import { loadScoringConfig } from "../../lib/scoring-config";
import { NO_OFFER_BY_DESIGN, catalogueStatusOf } from "../../content/products";
import { productPath } from "../../content/routes";
import { resolveImage } from "../../lib/media-registry";

const freshnessRank = (c: string | null) => (c === "live" ? 2 : c === "recently_verified" ? 1 : 0);

/**
 * Which stored scoring config each category is judged by.
 *
 * Deliberately an explicit map rather than a derived string: adding a category
 * should require someone to look at the weights and decide they are right, not
 * inherit whatever a naming convention happens to resolve to.
 */
/* @extension-point per-category | required | /api/botmatch returns 501 and the
   funnel produces no recommendation. There is deliberately NO fallback: judging
   one category's products by another category's weights excluded all eleven
   window robots as class_not_eligible and returned nothing, silently, for a
   day. The D1 scoring_configs row has to exist too. */
const SCORING_CONFIG_BY_CATEGORY: Record<string, string> = {
  "robotic-pool-cleaners": "sc-pool-v1",
  "window-cleaning-robots": "sc-window-v1",
  "robotic-lawn-mowers": "sc-lawn-v1",
  "companion-robots": "sc-companion-v1",
  "pet-camera-robots": "sc-petcam-v1",
  "self-cleaning-litter-boxes": "sc-litterbox-v1",
  "grill-cleaning-robots": "sc-grill-v1",
  "robot-vacuums": "sc-vacuum-v1",
  "educational-coding-robots": "sc-coding-v1",
};

export const POST: APIRoute = async ({ request, locals }) => {
  const db = getDb(locals);
  let body: { category?: string; answers?: PoolAnswers };
  try {
    body = await request.json();
  } catch {
    return json({ error: "Invalid JSON" }, 400);
  }
  const answers = body.answers;
  if (!answers) return json({ error: "Missing answers" }, 400);

  const cat = (
    await db.select().from(schema.categories).where(eq(schema.categories.slug, body.category ?? "")).limit(1)
  )[0];
  if (!cat) return json({ error: "Unknown category" }, 404);

  const published = await db
    .select()
    .from(schema.products)
    .where(and(eq(schema.products.categoryId, cat.id), eq(schema.products.status, "published")));

  /**
   * PUBLISHED IS NOT THE SAME AS RECOMMENDABLE, AND THIS ROUTE TREATED THEM AS
   * THE SAME UNTIL 10 AUGUST 2026.
   *
   * On that date a companion query returned "Embodied Moxie" as one of three
   * equivalents. Embodied ceased operations, Moxie stopped working when its
   * servers went off, and this site's own catalogue records that we will never
   * sell one. Living.AI EMO was beside it, whose only Amazon listing we
   * determined to be a counterfeit under a different brand. The funnel was
   * recommending a robot that does not switch on and a listing we had already
   * refused in writing.
   *
   * The rule-out reviews are PUBLISHED on purpose — a page saying "do not buy
   * this, and here is why" is some of the most useful writing here, and it has
   * to stay in the grid and in search. What it must never do is come back as
   * the answer to "which one should I buy". Those are opposite jobs and the
   * `published` flag cannot tell them apart.
   *
   * Two states, and only one of them is excluded:
   *
   *   OFFER_SETUP_PENDING — verified, no retailer wiring YET. Grillbot and the
   *   eleven robot vacuums are here. They stay in the pool, because "we cannot
   *   sell you this today" is not "this is the wrong machine for you".
   *
   *   NO_OFFER_BY_DESIGN — we will never send a buyer here. Excluded.
   *
   * Withdrawn products go too, for the same reason.
   */
  const products = published.filter(
    (p) => !NO_OFFER_BY_DESIGN[p.id] && catalogueStatusOf(p.id) === "active",
  );

  /* One config per category, and NO fallback.
     This read "sc-pool-v1" for every category until 6 August 2026. The pool
     config's class eligibility lists only full_cleaner and surface_skimmer, so
     scoring a window robot against it excluded all eleven as
     `class_not_eligible` and returned nothing — a matcher that always failed,
     silently, because the funnel is built to survive a scoring failure.
     A category without its own config gets an error, not somebody else's
     weights. Config ids follow the category slug so a new category cannot
     accidentally inherit one. */
  const configId = SCORING_CONFIG_BY_CATEGORY[cat.slug];
  if (!configId) {
    return json({ error: "No scoring config for this category yet" }, 501);
  }
  const config = await loadScoringConfig(db, configId);
  if (!config) return json({ error: "Scoring config unavailable" }, 500);

  const candidates: SuitabilityCandidate[] = products.map((p) => ({
    productId: p.id,
    productClass: p.productClass,
    environments: p.environments,
    cleans: p.cleans,
    powerType: p.powerType,
    priceTier: p.priceTier as SuitabilityCandidate["priceTier"],
    maxPoolLengthFt: p.maxPoolLengthFt,
    // Null for every product until the column exists in D1; the scorer treats
    // that as "unknown", never as "too big".
    maxPoolAreaSqFt: (p as { maxPoolAreaSqFt?: number | null }).maxPoolAreaSqFt ?? null,
  }));

  const result = scoreProducts(answers, candidates, config);

  /**
   * A TIE IS AN ANSWER, AND IT USED TO BE HIDDEN.
   *
   * This was `result.ranked.find((r) => !r.excluded)` — the first non-excluded
   * product. The sort breaks ties on productId, so a group of machines the
   * recorded data cannot separate produced a confident single winner chosen
   * alphabetically, and the reader was told it won a comparison that never
   * happened.
   *
   * Now: if the top score is shared, nothing is chosen. `chosenProductId` stays
   * null in the recommendation, because no product was chosen, and the group is
   * returned as equivalent. Do not add a tie-break here — not price, not
   * freshness, and above all not commission. If the data cannot separate them,
   * nothing downstream is entitled to.
   */
  const top = topGroup(result.ranked);
  const tied = top.length > 1;
  const winner = tied ? null : (top[0] ?? null);
  /** How many machines survived the hard exclusions at all. */
  const eligibleCount = result.ranked.filter((r) => !r.excluded).length;

  // Offer ranking for the chosen product (commission tie-break only).
  let chosenOfferId: string | null = null;
  let offerRows: (typeof schema.offers.$inferSelect)[] = [];
  if (winner) {
    offerRows = await db
      .select()
      .from(schema.offers)
      .where(and(eq(schema.offers.productId, winner.productId), eq(schema.offers.offerStatus, "active")));
    const programIds = offerRows.map((o) => o.affiliateProgramId).filter(Boolean) as string[];
    const programs = programIds.length
      ? await db.select().from(schema.affiliatePrograms).where(inArray(schema.affiliatePrograms.id, programIds))
      : [];
    const commissionOf = (pid: string | null) =>
      pid ? programs.find((p) => p.id === pid)?.commissionValueBp ?? null : null;

    const offerCandidates: OfferCandidate[] = offerRows.map((o) => ({
      offerId: o.id,
      productId: o.productId,
      totalPriceMinor: o.totalLandedMinor ?? o.basePriceMinor,
      deliveryMaxDays: o.deliveryMaxDays,
      warrantyBand: null,
      // PREVIEW: treat active offers as purchasable. Production gates on
      // retailer_markets.approved once affiliate programmes are approved.
      approved: o.offerStatus === "active",
      freshnessRank: freshnessRank(o.freshnessClass),
      commissionValueBp: commissionOf(o.affiliateProgramId),
    }));
    const ranked = rankOffers(offerCandidates, config.tiebreakTolerances);
    chosenOfferId = ranked.winner?.offerId ?? null;
  }

  // Persist the recommendation + per-candidate audit.
  const token = crypto.randomUUID();
  const recId = crypto.randomUUID();
  await db.insert(schema.recommendations).values({
    id: recId,
    secureToken: token,
    marketId: "us",
    locale: "en-US",
    questionnaireVersion: 1,
    scoringConfigVersion: result.configVersion,
    inputsJson: answers,
    chosenProductId: winner?.productId ?? null,
    chosenOfferId,
    explanationJson: tied
      ? {
          text: tieExplanation(top.length, eligibleCount),
          /* Stored rather than re-derived on the page, because the page reads a
             saved recommendation and does not have the eligible count. */
          kind: top.length >= eligibleCount ? "whole_range" : "indistinguishable",
          equivalent: top.map((t) => t.productId),
        }
      : { text: explainWinner(result) },
  });
  if (result.ranked.length) {
    await db.insert(schema.recommendationScores).values(
      result.ranked.map((s) => ({
        id: crypto.randomUUID(),
        recommendationId: recId,
        productId: s.productId,
        suitabilityScore: Math.round(s.score),
        breakdownJson: s.breakdown,
        excluded: s.excluded,
        exclusionReason: s.exclusionReason,
      })),
    );
  }

  /**
   * The public result needs to be a useful destination, not just a product
   * name. Resolve the canonical review URL and the same centrally governed
   * listing image the catalogue uses. A withdrawn asset therefore disappears
   * here automatically and falls back safely.
   */
  const publicProduct = (product: (typeof products)[number]) => {
    const image = resolveImage(
      product.id,
      "listing_card",
      ["product_hero", "product_alternate_view", "branded_placeholder"],
    );
    return {
      name: product.name,
      url: productPath(product.slug, cat.slug),
      image: image
        ? {
            src: image.src,
            srcset: image.srcset,
            alt: image.alt,
            width: image.width,
            height: image.height,
          }
        : null,
    };
  };

  const winnerProduct = winner
    ? (products.find((product) => product.id === winner.productId) ?? null)
    : null;
  const winnerName = winnerProduct?.name ?? null;
  const product = winnerProduct ? publicProduct(winnerProduct) : null;

  /* Keep the name-only array for the saved recommendation and existing email
     contract, while the visual funnel receives canonical links and images. */
  const equivalentProducts = tied
    ? top
        .map((item) => products.find((product) => product.id === item.productId))
        .filter((item): item is (typeof products)[number] => Boolean(item))
        .map(publicProduct)
        .sort((a, b) => a.name.localeCompare(b.name))
    : [];
  const equivalent = equivalentProducts.map((item) => item.name);

  return json({ token, productName: winnerName, equivalent, product, equivalentProducts });
};

/**
 * A TIE HAS TWO CAUSES AND ONLY ONE OF THEM IS OUR FAULT.
 *
 * Until 10 August 2026 every tie was explained the same way — "we do not yet
 * hold the attributes that would separate them" — and for the most common tie
 * on this site that is not true, it is modest to the point of being wrong.
 *
 * A sweep of all 480 window answer sets found the worst tie, eleven machines
 * out of eleven, comes from a reader who answered "not sure" on power, "show me
 * the range" on budget and "ground floor" on height. They ruled nothing out.
 * The whole shelf tying is the CORRECT answer to "show me everything", and
 * blaming our data for it tells the reader we know less than we do while
 * hiding what they could do about it — which is answer a question differently.
 *
 * The two are told apart by whether the tied group is the entire eligible pool.
 * Everything tied means nothing was ruled out. A subset tied means we narrowed
 * the field and then ran out of recorded difference, which is the case the
 * original sentence was written for and where it is exactly right.
 */
export function tieExplanation(tiedCount: number, eligibleCount: number): string {
  if (tiedCount >= eligibleCount) {
    return (
      `You told us you are open on the things that would narrow this down, so here is the whole range — ` +
      `all ${tiedCount} of them fit what you asked for. Go back and give a budget, a power arrangement or ` +
      `a firmer answer on where they have to work, and we can cut this down.`
    );
  }
  return (
    `We narrowed it to ${tiedCount} and stopped. On the questions you answered these score identically on ` +
    `everything we have recorded, so naming one would mean picking it out of a tie. We do not yet hold the ` +
    `attributes that would separate them.`
  );
}

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json" },
  });
}
