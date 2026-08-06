import type { APIRoute } from "astro";
import { and, eq, inArray } from "drizzle-orm";
import {
  scoreProducts,
  rankOffers,
  explainWinner,
  type OfferCandidate,
  type PoolAnswers,
  type SuitabilityCandidate,
} from "@botplanet/scoring";
import { getDb, schema } from "../../lib/db";
import { loadScoringConfig } from "../../lib/scoring-config";

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

  const products = await db
    .select()
    .from(schema.products)
    .where(and(eq(schema.products.categoryId, cat.id), eq(schema.products.status, "published")));

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
  const winner = result.ranked.find((r) => !r.excluded) ?? null;

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
    explanationJson: { text: explainWinner(result) },
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

  // The winner's name, so the matcher's email can say what it picked without a
  // second round trip. Nothing commercial is returned here.
  const winnerName = winner
    ? (products.find((p) => p.id === winner.productId)?.name ?? null)
    : null;

  return json({ token, productName: winnerName });
};

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json" },
  });
}
