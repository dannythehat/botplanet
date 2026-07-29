/**
 * Emit ordered INSERT statements for the pool seed, for `wrangler d1 execute`.
 * Uses drizzle table metadata so SQL column names are always correct.
 *
 *   npx tsx packages/db/seed/to-sql.ts > seed.sql
 */
import { getTableColumns, getTableName, type Table } from "drizzle-orm";
import * as schema from "../src/schema/index.js";
import * as pool from "./pool/index.js";

function sqlValue(v: unknown): string {
  if (v === null || v === undefined) return "NULL";
  if (typeof v === "number") return String(v);
  if (typeof v === "boolean") return v ? "1" : "0";
  if (typeof v === "object") return `'${JSON.stringify(v).replace(/'/g, "''")}'`;
  return `'${String(v).replace(/'/g, "''")}'`;
}

function emit(table: Table, rows: Record<string, unknown>[]): string {
  if (!rows.length) return "";
  const cols = getTableColumns(table) as Record<string, { name: string }>;
  const name = getTableName(table);
  const lines: string[] = [];
  for (const row of rows) {
    const keys = Object.keys(row).filter((k) => row[k] !== undefined && k in cols);
    const colNames = keys.map((k) => `"${cols[k]!.name}"`).join(", ");
    const values = keys.map((k) => sqlValue(row[k])).join(", ");
    lines.push(`INSERT INTO "${name}" (${colNames}) VALUES (${values});`);
  }
  return lines.join("\n");
}

// FK-safe order.
const blocks: [Table, Record<string, unknown>[]][] = [
  [schema.markets, pool.marketRows],
  [schema.categories, pool.categoryRows],
  [schema.brands, pool.brandRows],
  [schema.products, pool.productRows],
  [schema.productMarketAvailability, pool.productMarketAvailabilityRows],
  [schema.retailers, pool.retailerRows],
  [schema.retailerMarkets, pool.retailerMarketRows],
  [schema.affiliatePrograms, pool.affiliateProgramRows],
  [schema.offers, pool.offerRows],
  [schema.redirectLinks, pool.redirectLinkRows],
  [schema.evidence, pool.evidenceRows],
  [schema.questionnaires, pool.questionnaireRows],
  [schema.scoringConfigs, pool.scoringConfigRows],
];

const out = blocks.map(([t, r]) => emit(t, r as Record<string, unknown>[])).filter(Boolean).join("\n");
process.stdout.write(out + "\n");
