import { eq } from "drizzle-orm";
import type { ScoringConfig } from "@botplanet/scoring";
import type { DB } from "./db.js";
import { schema } from "./db.js";

/**
 * Load a versioned scoring config from D1 and map the stored JSON columns into
 * the shape the deterministic scoring engine expects. Config is DATA, not code.
 */
export async function loadScoringConfig(db: DB, configId: string): Promise<ScoringConfig | null> {
  const rows = await db
    .select()
    .from(schema.scoringConfigs)
    .where(eq(schema.scoringConfigs.id, configId))
    .limit(1);
  const row = rows[0];
  if (!row) return null;
  return {
    version: row.version,
    weights: row.weightsJson as ScoringConfig["weights"],
    hardExclusions: row.hardExclusionsJson as ScoringConfig["hardExclusions"],
    classEligibility: row.classEligibilityJson as ScoringConfig["classEligibility"],
    tiebreakTolerances: row.tiebreakTolerancesJson as ScoringConfig["tiebreakTolerances"],
  };
}
