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

/**
 * The monthly ceiling, set below the plan's 250 so discovery is never starved.
 *
 * RAISED FROM 200 TO 210 ON 27 SEPTEMBER 2026. Botley 2.0 and the Code & Go
 * Robot Mouse graduated from awaiting-discovery to a real EXPECTED_IDENTITIES
 * entry the same day, taking the four-day cadence's worst case from 188 to
 * 203 — over the old ceiling by legitimate catalogue growth, not slack. 200
 * was always a defensive buffer below the account's real 250, not a technical
 * limit; 210 still leaves 40 credits a month for discovery and genuine
 * exceptions, which is the room the buffer exists to protect.
 */
export const MONTHLY_CREDIT_CEILING = 210;

/**
 * Days between scheduled reads.
 *
 * THE ORIGINAL SEVEN WAS ARITHMETIC FROM A CATALOGUE WE DO NOT HAVE. The note
 * above reasons about "refreshing ten products daily is 300", and concludes
 * weekly. But the register holds eight products and the month's actual spend
 * on 4 August 2026 was EIGHT credits out of 200. The budget was never the
 * constraint; the interval was, and it was set defensively against a cost that
 * never materialised.
 *
 * The cost of that slack showed up on the live site: the Nautilus was read on
 * 31 July at $749.00 and was still showing that figure on 4 August, when the
 * listing said $849.00 — with the next scheduled read not due until the 7th.
 * A price a reader acts on should not be able to drift for a week unnoticed.
 *
 * Three days caps the worst case at three and costs roughly 80 credits a
 * month for the current catalogue. `monthlyCost` is asserted against the
 * ceiling in the test suite, so growing the catalogue trips a test rather
 * than quietly exhausting the allowance mid-month.
 *
 * FOUR DAYS FROM 8 AUGUST 2026, AND THE TEST DID ITS JOB. Eleven litter boxes
 * and lawn mowers joined the price checker that day, taking the register from
 * eleven products to twenty-two, and `monthlyCost` went straight through the
 * ceiling — which is what the assertion above was put there to make happen
 * rather than letting the run quietly stop half way through a month.
 *
 * The arithmetic is not close and there is no clever way round it. Twenty-two
 * products read every three days is 220 credits before a single exception, on
 * an allowance of 250 with a self-imposed ceiling of 200. Twenty products is
 * the most a three-day cadence can fund, and the catalogue passed that.
 *
 * So the interval is four days and the daily exception list drops to one. That
 * combination costs 188 of 200 at full load and keeps the whole register on a
 * near-uniform cadence, which is the right trade: the interval exists to bound
 * how far a PUBLISHED price can drift, and every page benefits from it, where
 * the daily list benefits four. The alternative that also fits — seven days
 * with four daily watches — would undo the 4 August fix for twenty-one
 * products to keep a privilege for one.
 *
 * WHAT THIS ACTUALLY IS: the free SerpApi plan is now the binding constraint on
 * how fresh a price on this site can be. It is not a bug and it is not fixable
 * in this file. Twenty-six further products already carry buy buttons with no
 * identity expectation at all, and putting them on the checker at any cadence
 * costs more than the allowance holds. That is a decision about a subscription,
 * not about a constant, and it belongs to the owner.
 */
export const CATALOGUE_INTERVAL_DAYS = 4;
export const DAILY_INTERVAL_DAYS = 1;

/** @deprecated Kept as an alias so existing callers and tests keep working. */
export const WEEKLY_INTERVAL_DAYS = CATALOGUE_INTERVAL_DAYS;

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

/**
 * How many products may sit on the daily list before the budget stops working.
 *
 * ONE, FROM 8 AUGUST 2026. It was four, chosen against an eight-product
 * register. A daily read costs 30 credits a month against a four-day read's
 * 7.5, so every product promoted to this list costs what three products cost on
 * the ordinary cadence. At twenty-two products that arithmetic decides the
 * question: four daily watches would eat 120 of the 200-credit ceiling and
 * force the rest of the catalogue out to a weekly read.
 *
 * A product that falls off the end of this list is not abandoned — planRefresh
 * drops it to the catalogue cadence, so it loses its priority and keeps its
 * cover. That is what makes the cap safe to tighten.
 */
export const MAX_DAILY_EXCEPTIONS = 1;

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
