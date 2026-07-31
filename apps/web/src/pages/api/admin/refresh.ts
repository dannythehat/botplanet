/**
 * Manual invocation of the scheduled refresh.
 *
 * WHY THIS EXISTS: a weekly cron cannot be verified weekly. Without a way to
 * run it on demand, the only proof the wiring works arrives seven days after
 * anyone could still remember writing it. This route runs exactly the same code
 * path the scheduler runs, so what is tested here is the real thing rather than
 * a rehearsal of it.
 *
 * DRY RUN IS THE DEFAULT. A bare GET plans the run, reports what it would read
 * and what it would skip, spends no credit and writes nothing. Executing for
 * real needs `?execute=true`, which is deliberate: the allowance is 250 a month
 * and an accidental page refresh should not cost any of it.
 *
 * Behind the /api/admin gate in middleware, so it is not publicly reachable.
 * The response carries decisions and observations — never the API key, never a
 * raw provider payload.
 */
import type { APIRoute } from "astro";
import { SerpApiAmazonProvider } from "../../../lib/providers/serpapi-amazon";
import { EXPECTED_IDENTITIES } from "../../../lib/providers/expected-identity";
import { runRefresh } from "../../../lib/providers/refresh-service";
import { creditsUsedThisMonth, lastCheckedDates, persistRun } from "../../../lib/providers/refresh-store";
import { MONTHLY_CREDIT_CEILING } from "../../../lib/providers/refresh-policy";

export const prerender = false;

export const GET: APIRoute = async ({ locals, url }) => {
  const env = (locals as App.Locals).runtime?.env;
  const db = env?.DB;
  if (!db) return new Response(JSON.stringify({ error: "No database binding" }), { status: 500 });

  const execute = url.searchParams.get("execute") === "true";
  const now = new Date();
  const runDate = now.toISOString().slice(0, 10);
  const startedAt = now.toISOString();

  const spent = await creditsUsedThisMonth(db, runDate.slice(0, 7));
  const lastChecked = await lastCheckedDates(db);

  const outcome = await runRefresh({
    provider: new SerpApiAmazonProvider({
      apiKey: env.SERPAPI_API_KEY,
      today: runDate,
      // The ceiling is enforced by the planner; this is the second line of
      // defence in case a caller ever bypasses it.
      mayspend: () => spent < MONTHLY_CREDIT_CEILING,
    }),
    expected: EXPECTED_IDENTITIES.map((e) => ({ ...e, lastCheckedOn: lastChecked[e.productId] ?? null })),
    today: now,
    runDate,
    scope: execute ? "manual" : "dry_run",
    creditsUsedThisMonth: spent,
    dryRun: !execute,
    runId: `run-${execute ? "manual" : "dry"}-${runDate}`,
  });

  await persistRun(db, outcome, startedAt, new Date().toISOString());

  return new Response(
    JSON.stringify(
      {
        mode: execute ? "EXECUTED" : "DRY RUN — nothing written, no credit spent",
        ceiling: MONTHLY_CREDIT_CEILING,
        creditsUsedThisMonthBefore: spent,
        outcome: {
          ...outcome,
          // The evidence is the point of the response; the wording is verbatim
          // from the retailer and carries nothing private.
          observations: outcome.observations,
        },
      },
      null,
      2,
    ),
    { status: 200, headers: { "content-type": "application/json", "cache-control": "no-store" } },
  );
};
