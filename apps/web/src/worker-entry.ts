/**
 * The Worker entry point: Astro's request handler, plus the scheduled refresh.
 *
 * WHY A CUSTOM ENTRY. The Cloudflare adapter owns the generated worker and only
 * exports `fetch`. A cron trigger needs `scheduled`, so the adapter is pointed
 * at this file instead: it re-exports Astro's handler untouched and adds the
 * one export the scheduler needs. Nothing about request handling changes.
 *
 * WHAT THE SCHEDULED RUN DOES, AND WHAT IT REFUSES TO DO
 *
 * It plans against the month's remaining allowance BEFORE spending anything,
 * reads only what is due, gates every result fail-closed, and writes the
 * accepted and the refused together. If the ceiling is reached it records a
 * skip and stops. A run that quietly did nothing because the credits were gone
 * would look exactly like a run where nothing changed, and only one of those
 * means the price on the page can still be trusted.
 *
 * A FAILURE IS RECORDED, NOT SWALLOWED. The handler never throws past itself;
 * anything unexpected is written as a failed run with its message, because a
 * cron that dies silently is indistinguishable from one that never fired.
 */
import { createExports as createAstroExports } from "@astrojs/cloudflare/entrypoints/server.js";
import { SerpApiAmazonProvider } from "./lib/providers/serpapi-amazon";
import { EXPECTED_IDENTITIES } from "./lib/providers/expected-identity";
import { runRefresh } from "./lib/providers/refresh-service";
import { creditsUsedThisMonth, lastCheckedDates, persistRun } from "./lib/providers/refresh-store";
import { MONTHLY_CREDIT_CEILING } from "./lib/providers/refresh-policy";

interface Env {
  DB: D1Database;
  SERPAPI_API_KEY?: string;
}

export async function scheduledRefresh(env: Env, cron: string): Promise<void> {
  const now = new Date();
  const runDate = now.toISOString().slice(0, 10);
  const startedAt = now.toISOString();
  // The daily trigger serves only the capped exception list; the weekly one
  // sweeps the catalogue. Both share the same ceiling.
  const scope = cron.startsWith("0 3 * * 1") ? "weekly" : "daily_exception";

  try {
    const spent = await creditsUsedThisMonth(env.DB, runDate.slice(0, 7));
    const lastChecked = await lastCheckedDates(env.DB);

    const outcome = await runRefresh({
      provider: new SerpApiAmazonProvider({
        apiKey: env.SERPAPI_API_KEY,
        today: runDate,
        mayspend: () => spent < MONTHLY_CREDIT_CEILING,
      }),
      expected: EXPECTED_IDENTITIES.map((e) => ({ ...e, lastCheckedOn: lastChecked[e.productId] ?? null })),
      today: now,
      runDate,
      scope: scope as "weekly" | "daily_exception",
      creditsUsedThisMonth: spent,
      dryRun: false,
      runId: `run-${scope}-${runDate}`,
    });

    await persistRun(env.DB, outcome, startedAt, new Date().toISOString());
  } catch (e) {
    await env.DB.prepare(
      `INSERT INTO refresh_runs (id, scope, run_date, started_at, finished_at, status, notes)
       VALUES (?1,?2,?3,?4,?5,'failed',?6)
       ON CONFLICT(scope, run_date) DO UPDATE SET status='failed', finished_at=excluded.finished_at, notes=excluded.notes`,
    )
      .bind(`run-${scope}-${runDate}`, scope, runDate, startedAt, new Date().toISOString(), (e as Error).message)
      .run()
      .catch(() => {
        /* If even the failure cannot be recorded, the platform log is all there is. */
      });
  }
}

/**
 * Astro calls this with the built manifest and uses whatever it returns as the
 * Worker's exports. The request handler is taken verbatim from the adapter —
 * this file adds `scheduled` beside it and changes nothing else.
 */
export function createExports(manifest: Parameters<typeof createAstroExports>[0]) {
  const astro = createAstroExports(manifest);
  return {
    default: {
      fetch: astro.default.fetch,
      async scheduled(event: ScheduledController, env: Env, ctx: ExecutionContext) {
        ctx.waitUntil(scheduledRefresh(env, event.cron));
      },
    },
  };
}
