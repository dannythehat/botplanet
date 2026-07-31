/**
 * Persistence for the scheduled refresh.
 *
 * Raw D1 rather than Drizzle, because this runs inside `scheduled()` where the
 * Astro locals that carry the Drizzle client do not exist. The statements are
 * small and explicit, which is what you want in the one code path nobody is
 * watching when it runs.
 *
 * EVERY WRITE IS AN UPSERT ON A NATURAL KEY. Run on (scope, run_date),
 * observation on (product, asin, checked_date), rejection on (product, asin).
 * Two runs in a day converge on one clean state instead of stacking rows, so a
 * retry after a partial failure is safe and needs no cleanup.
 *
 * A rejection keeps its FIRST seen date and moves its LAST seen date, so the
 * record shows how long a wrong candidate has been circling rather than
 * resetting every time it reappears.
 */
import type { ObservationRow, RefreshOutcome, SkipRow } from "./refresh-service";

type D1 = D1Database;

const b = (v: boolean) => (v ? 1 : 0);

/** Credits already spent this calendar month, which the ceiling is measured against. */
export async function creditsUsedThisMonth(db: D1, yearMonth: string): Promise<number> {
  const row = await db
    .prepare("SELECT COALESCE(SUM(credits_used), 0) AS n FROM refresh_runs WHERE run_date LIKE ?1 AND dry_run = 0")
    .bind(`${yearMonth}%`)
    .first<{ n: number }>();
  return row?.n ?? 0;
}

/** The last date each product was successfully read, so the planner knows what is due. */
export async function lastCheckedDates(db: D1): Promise<Record<string, string>> {
  const res = await db
    .prepare("SELECT product_id, MAX(checked_date) AS d FROM refresh_observations GROUP BY product_id")
    .all<{ product_id: string; d: string }>();
  const out: Record<string, string> = {};
  for (const r of res.results ?? []) out[r.product_id] = r.d;
  return out;
}

/**
 * Write a completed run.
 *
 * Batched so the run header, its observations, its skips and its rejections
 * land together. D1's batch is atomic, which is what "written transactionally"
 * has to mean here: a run that half-recorded would leave observations with no
 * run to explain them.
 */
export async function persistRun(db: D1, outcome: RefreshOutcome, startedAt: string, finishedAt: string): Promise<void> {
  if (outcome.dryRun) return; // A dry run proves the wiring and writes nothing.

  const stmts: D1PreparedStatement[] = [
    db
      .prepare(
        `INSERT INTO refresh_runs
           (id, scope, run_date, started_at, finished_at, status, products_planned, products_read,
            credits_used, credits_month_to_date, ceiling_reached, dry_run, notes)
         VALUES (?1,?2,?3,?4,?5,?6,?7,?8,?9,?10,?11,?12,?13)
         ON CONFLICT(scope, run_date) DO UPDATE SET
           finished_at = excluded.finished_at,
           status = excluded.status,
           products_planned = excluded.products_planned,
           products_read = excluded.products_read,
           credits_used = refresh_runs.credits_used + excluded.credits_used,
           ceiling_reached = excluded.ceiling_reached,
           notes = excluded.notes`,
      )
      .bind(
        outcome.runId,
        outcome.scope,
        outcome.runDate,
        startedAt,
        finishedAt,
        outcome.status,
        outcome.productsPlanned,
        outcome.productsRead,
        outcome.creditsUsed,
        outcome.creditsMonthToDate,
        b(outcome.ceilingReached),
        b(outcome.dryRun),
        outcome.notes,
      ),
  ];

  for (const o of outcome.observations) {
    stmts.push(
      db
        .prepare(
          `INSERT INTO refresh_observations
             (id, run_id, product_id, asin, checked_date, provider_id, observed_title, brand, model_name,
              model_number, price_minor, currency, stock_wording, shipping_wording, seller_wording,
              returns_wording, identity_confirmed, match_evidence, accepted, suppression_reason)
           VALUES (?1,?2,?3,?4,?5,?6,?7,?8,?9,?10,?11,?12,?13,?14,?15,?16,?17,?18,?19,?20)
           ON CONFLICT(product_id, asin, checked_date) DO UPDATE SET
             run_id = excluded.run_id,
             price_minor = excluded.price_minor,
             stock_wording = excluded.stock_wording,
             shipping_wording = excluded.shipping_wording,
             seller_wording = excluded.seller_wording,
             returns_wording = excluded.returns_wording,
             identity_confirmed = excluded.identity_confirmed,
             match_evidence = excluded.match_evidence,
             accepted = excluded.accepted,
             suppression_reason = excluded.suppression_reason`,
        )
        .bind(
          `obs-${o.productId}-${o.asin}-${o.checkedDate}`,
          outcome.runId,
          o.productId,
          o.asin,
          o.checkedDate,
          o.providerId,
          o.observedTitle,
          o.brand,
          o.modelName,
          o.modelNumber,
          o.priceMinor,
          o.currency,
          o.stockWording,
          o.shippingWording,
          o.sellerWording,
          o.returnsWording,
          b(o.identityConfirmed),
          o.matchEvidence,
          b(o.accepted),
          o.suppressionReason,
        ),
    );

    // A suppressed observation is also a refusal, and refusals are permanent:
    // this is what stops next month rediscovering the same wrong ASIN.
    if (!o.accepted) {
      stmts.push(
        db
          .prepare(
            `INSERT INTO refresh_rejections
               (id, run_id, product_id, asin, observed_title, rule, reason, first_seen_date, last_seen_date)
             VALUES (?1,?2,?3,?4,?5,?6,?7,?8,?8)
             ON CONFLICT(product_id, asin) DO UPDATE SET
               run_id = excluded.run_id,
               reason = excluded.reason,
               last_seen_date = excluded.last_seen_date`,
          )
          .bind(
            `rej-${o.productId}-${o.asin}`,
            outcome.runId,
            o.productId,
            o.asin,
            o.observedTitle,
            o.identityConfirmed ? "gate_failed" : "identity_not_confirmed",
            o.suppressionReason ?? "suppressed",
            o.checkedDate,
          ),
      );
      stmts.push(
        db
          .prepare(
            `INSERT INTO refresh_unresolved (product_id, run_id, reason, last_attempted_date, exception_reason)
             VALUES (?1,?2,?3,?4,NULL)
             ON CONFLICT(product_id) DO UPDATE SET
               run_id = excluded.run_id, reason = excluded.reason, last_attempted_date = excluded.last_attempted_date`,
          )
          .bind(o.productId, outcome.runId, o.suppressionReason ?? "suppressed", o.checkedDate),
      );
    } else {
      // Resolved: it must not linger on the unresolved list.
      stmts.push(db.prepare("DELETE FROM refresh_unresolved WHERE product_id = ?1").bind(o.productId));
    }
  }

  for (const s of outcome.skips) {
    stmts.push(
      db
        .prepare(
          `INSERT OR REPLACE INTO refresh_skips (id, run_id, product_id, reason, detail, skipped_at)
           VALUES (?1,?2,?3,?4,?5,?6)`,
        )
        .bind(`skip-${outcome.runId}-${s.productId}`, outcome.runId, s.productId, s.reason, s.detail, finishedAt),
    );
  }

  await db.batch(stmts);
}

/**
 * Accepted observations, newest per product, for the offer engine to read.
 *
 * Only `accepted = 1` rows are returned. A suppressed observation stays in the
 * table as evidence of what was seen and refused, and must never reach a
 * public surface.
 */
export async function latestAcceptedObservations(db: D1): Promise<ObservationRow[]> {
  const res = await db
    .prepare(
      `SELECT o.* FROM refresh_observations o
        JOIN (SELECT product_id, MAX(checked_date) AS d FROM refresh_observations WHERE accepted = 1 GROUP BY product_id) m
          ON o.product_id = m.product_id AND o.checked_date = m.d
        WHERE o.accepted = 1`,
    )
    .all<Record<string, unknown>>();
  return (res.results ?? []).map((r) => ({
    productId: String(r.product_id),
    asin: String(r.asin),
    checkedDate: String(r.checked_date),
    providerId: String(r.provider_id),
    observedTitle: (r.observed_title as string) ?? null,
    brand: (r.brand as string) ?? null,
    modelName: (r.model_name as string) ?? null,
    modelNumber: (r.model_number as string) ?? null,
    priceMinor: r.price_minor === null ? null : Number(r.price_minor),
    currency: String(r.currency ?? "USD"),
    stockWording: (r.stock_wording as string) ?? null,
    shippingWording: (r.shipping_wording as string) ?? null,
    sellerWording: (r.seller_wording as string) ?? null,
    returnsWording: (r.returns_wording as string) ?? null,
    identityConfirmed: Boolean(r.identity_confirmed),
    matchEvidence: String(r.match_evidence ?? ""),
    accepted: true,
    suppressionReason: null,
  }));
}

export type { ObservationRow, SkipRow };
