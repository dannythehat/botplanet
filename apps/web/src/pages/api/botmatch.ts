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

  const config = await loadScoringConfig(db, "sc-pool-v1");
  if (!config) return json({ error: "Scoring config unavailable" }, 500);

  const candidates: SuitabilityCandidate[] = products.map((p) => ({
    productId: p.id,
    productClass: p.productClass,
    environments: p.environments,
    cleans: p.cleans,
    powerType: p.powerType,
    priceTier: p.priceTier as SuitabilityCandidate["priceTier"],
    maxPoolLengthFt: p.maxPoolLengthFt,
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

  return json({ token });
};

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json" },
  });
}
