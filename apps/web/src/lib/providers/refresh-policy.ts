/**
 * When a listing gets re-read, and what stops the month's allowance being spent
 * in a week.
 *
 * THE CONSTRAINT IS REAL. The account allows 250 searches a month. Refreshing
 * ten products daily is 300 before any discovery work, so a daily default would
 * exhaust the allowance and then fail silently for the rest of the month —
 * which looks exactly like a system that is working, right up until a price on
 * the site is six weeks old. Weekly for the catalogue is ~43 a month and leaves
 * room for discovery and genuine exceptions.
 *
 * A SKIPPED RUN IS RECORDED, NEVER SWALLOWED. When the ceiling is reached the
 * run stops and says so. "We did not check" and "we checked and nothing
 * changed" must never look the same from the outside, because only one of them
 * means the price on the page can be trusted.
 */
import type { ProviderSkipReason } from "./amazon-provider";

/** The monthly ceiling, set below the plan's 250 so discovery is never starved. */
export const MONTHLY_CREDIT_CEILING = 200;

/** Days between scheduled reads. */
export const WEEKLY_INTERVAL_DAYS = 7;
export const DAILY_INTERVAL_DAYS = 1;

/**
 * The only four reasons a product may be read daily rather than weekly.
 * Anything else is weekly — the exception list has to stay small or it becomes
 * the schedule.
 */
export type ExceptionReason =
  /** We do not yet know that the ASIN is the model we hold. */
  | "unresolved_identity"
  /** The listing changed since the last read. */
  | "recently_changed"
  /** The offer is not currently buyable. */
  | "unavailable_offer"
  /** A human has flagged this product for a closer look. */
  | "active_investigation";

/** How many products may sit on the daily list before the budget stops working. */
export const MAX_DAILY_EXCEPTIONS = 4;

export interface RefreshCandidate {
  productId: string;
  asin: string | null;
  lastCheckedOn: string | null;
  exception: ExceptionReason | null;
}

export interface RefreshDecision {
  productId: string;
  due: boolean;
  intervalDays: number;
  cadence: "daily" | "weekly" | "none";
  reason: string;
  skipped: ProviderSkipReason | null;
}

const daysBetween = (from: string, to: Date): number =>
  Math.floor((to.getTime() - new Date(`${from}T00:00:00Z`).getTime()) / 86_400_000);

/**
 * Plan a refresh run.
 *
 * Exceptions are served first, because the whole point of the daily list is
 * that those products are the ones we are least sure about. The ceiling is
 * applied to the plan rather than discovered halfway through it, so a run that
 * cannot complete says so before spending anything.
 */
export function planRefresh(
  candidates: RefreshCandidate[],
  opts: { today: Date; creditsUsedThisMonth: number; ceiling?: number },
): { decisions: RefreshDecision[]; plannedCredits: number; ceilingReached: boolean } {
  const ceiling = opts.ceiling ?? MONTHLY_CREDIT_CEILING;
  let budget = Math.max(0, ceiling - opts.creditsUsedThisMonth);
  const ceilingReached = budget === 0;

  // Exceptions first, and only as many as the cap allows. A product that falls
  // off the end of the exception list is still refreshed weekly — it loses its
  // priority, not its cover.
  const exceptions = candidates.filter((c) => c.exception).slice(0, MAX_DAILY_EXCEPTIONS);
  const exceptionIds = new Set(exceptions.map((c) => c.productId));
  const ordered = [...exceptions, ...candidates.filter((c) => !exceptionIds.has(c.productId))];

  const decisions: RefreshDecision[] = [];
  let plannedCredits = 0;

  for (const c of ordered) {
    const daily = exceptionIds.has(c.productId);
    const intervalDays = daily ? DAILY_INTERVAL_DAYS : WEEKLY_INTERVAL_DAYS;
    const age = c.lastCheckedOn === null ? Infinity : daysBetween(c.lastCheckedOn, opts.today);
    const due = age >= intervalDays;

    if (!due) {
      decisions.push({
        productId: c.productId,
        due: false,
        intervalDays,
        cadence: daily ? "daily" : "weekly",
        reason: `checked ${age} day(s) ago, next due at ${intervalDays}`,
        skipped: "not_due_yet",
      });
      continue;
    }
    if (budget <= 0) {
      decisions.push({
        productId: c.productId,
        due: true,
        intervalDays,
        cadence: daily ? "daily" : "weekly",
        reason: `due, but the monthly ceiling of ${ceiling} credits is reached — run skipped and recorded`,
        skipped: "credit_ceiling_reached",
      });
      continue;
    }
    budget -= 1;
    plannedCredits += 1;
    decisions.push({
      productId: c.productId,
      due: true,
      intervalDays,
      cadence: daily ? "daily" : "weekly",
      reason: daily ? `daily exception: ${c.exception}` : "weekly catalogue refresh",
      skipped: null,
    });
  }
  return { decisions, plannedCredits, ceilingReached };
}

/** Monthly cost of a plan, for sanity-checking the cadence against the allowance. */
export function monthlyCost(products: number, dailyExceptions: number): number {
  return Math.round((products - dailyExceptions) * (30 / WEEKLY_INTERVAL_DAYS) + dailyExceptions * 30);
}
