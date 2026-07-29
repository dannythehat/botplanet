import type { ProductScore, ProductScoringResult } from "./types.js";

/**
 * Human-readable explanation for a recommendation. Explanations are derived only
 * from the suitability breakdown — never from commercial factors — so the "why"
 * shown to the customer always reflects fit, not commission.
 */
export function explainWinner(result: ProductScoringResult): string {
  const winner = result.ranked.find((r) => !r.excluded);
  if (!winner) return "No suitable product matched your answers.";
  const reasons = topReasons(winner);
  return `Recommended on suitability (score ${winner.score}/100): ${reasons.join(", ")}.`;
}

function topReasons(score: ProductScore): string[] {
  const entries = Object.entries(score.breakdown)
    .filter(([, v]) => v > 0)
    .sort((a, b) => b[1] - a[1]);
  const labels: Record<string, string> = {
    cleansCoverage: "cleans what you need",
    power: "matches your power preference",
    priceTier: "fits your budget",
    poolSize: "handles your pool size",
  };
  return entries.slice(0, 3).map(([k]) => labels[k] ?? k);
}
