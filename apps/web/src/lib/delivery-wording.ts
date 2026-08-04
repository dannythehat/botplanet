/* ============================================================
   BotPlanet — what survives of a delivery promise, and for how long.

   THE BUG THIS EXISTS TO PREVENT, VERBATIM. On 4 August 2026 the
   Nautilus page said:

     "FREE delivery Tomorrow, August 1. Order within 3 hrs 47 mins."

   It was captured on 31 July, when every word of it was true. Four
   days later "Tomorrow" pointed at a date in the past and the
   countdown had expired before the scrape finished. Nobody wrote
   anything false; the sentence rotted where it stood.

   A PRICE AND A DELIVERY DATE DO NOT AGE AT THE SAME RATE. The
   catalogue is re-read weekly — a deliberate choice, because the
   provider allows 250 reads a month and daily would exhaust it
   (see refresh-policy.ts). A dated price survives that easily:
   "$749, checked 31 July" tells a reader exactly what they have,
   and it is the check date that does the work. A delivery date
   cannot be rescued the same way. "Arrives Tomorrow, checked last
   Tuesday" is not honest-with-a-caveat, it is nonsense.

   So the wording is split by shelf life:

     the countdown  — false within the hour. Never printed.
     the date       — true for the day it was read. Printed only
                      on that day.
     "free delivery"— a property of the offer, not of a moment.
                      Printed for as long as the offer is.

   WHAT IT DOES NOT DO IS INVENT A NEW DATE. Adding days to a
   captured estimate would produce a delivery promise no retailer
   ever made. When the date expires it is removed, not recalculated.
   ============================================================ */

const MONTHS =
  "January|February|March|April|May|June|July|August|September|October|November|December|" +
  "Jan|Feb|Mar|Apr|Jun|Jul|Aug|Sept|Sep|Oct|Nov|Dec";

const WEEKDAYS =
  "Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday|" +
  "Mon|Tues|Tue|Weds|Wed|Thurs|Thur|Thu|Fri|Sat|Sun";

/** The first word of anything time-specific: a day name, a month, or "tomorrow". */
const TEMPORAL = new RegExp(`\\b(?:tomorrow|today|overnight|${WEEKDAYS}|${MONTHS})\\b`, "i");

/** "Order within 3 hrs 47 mins" — a countdown, frozen at the moment of capture. */
const COUNTDOWN = /\bOrder within\b[^.]*\.?/gi;

/** Amazon's own "Details" link text, scraped along with the sentence. */
const LINK_NOISE = /\bDetails\b\.?/gi;

/** e.g. "August 1", "Aug 5", "1 August" — for checking a date has not passed. */
const EXPLICIT_DATE = new RegExp(`\\b(?:(${MONTHS})\\s+(\\d{1,2})|(\\d{1,2})\\s+(${MONTHS}))\\b`, "i");

const MONTH_INDEX: Record<string, number> = {
  jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5,
  jul: 6, aug: 7, sep: 8, sept: 8, oct: 9, nov: 10, dec: 11,
};

/** YYYY-MM-DD, in UTC, so two dates are compared as dates rather than instants. */
const asDay = (iso: string): number | null => {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso);
  return m ? Date.UTC(+m[1], +m[2] - 1, +m[3]) : null;
};

/**
 * True when the wording names a calendar date that has already passed.
 *
 * The year is never printed in these sentences, so it is taken from the check
 * date — and a month more than six months behind is read as next year, which
 * is what makes "January 3" work when it is read in December.
 */
function namesAPastDate(wording: string, todayIso: string): boolean {
  const m = EXPLICIT_DATE.exec(wording);
  const today = asDay(todayIso);
  if (!m || today === null) return false;

  const monthWord = (m[1] ?? m[4] ?? "").toLowerCase();
  const day = Number(m[2] ?? m[3]);
  const month = MONTH_INDEX[monthWord.slice(0, monthWord.startsWith("sept") ? 4 : 3)];
  if (month === undefined || !Number.isFinite(day)) return false;

  const y = new Date(today).getUTCFullYear();
  let when = Date.UTC(y, month, day);
  if (when < today - 182 * 86_400_000) when = Date.UTC(y + 1, month, day);
  return when < today;
}

/** Removes everything from the first time-specific word to the end of its sentence. */
function stripTemporal(wording: string): string {
  return wording
    .split(/(?<=\.)\s+/)
    .map((sentence) => {
      const m = TEMPORAL.exec(sentence);
      if (!m) return sentence;
      /* Cut at the token, then clean up whatever joined it to the clause
         before. The pieces interleave — "delivery on 5 August" leaves
         "delivery on 5", where the day number has to go before the
         preposition is even visible — so this runs until it stops changing
         rather than once through in a fixed order. */
      let kept = sentence.slice(0, m.index);
      for (let i = 0; i < 4; i++) {
        const was = kept;
        kept = kept
          .replace(/[\s,;–—-]+$/, "")
          .replace(/\s+\d{1,2}(?:st|nd|rd|th)?$/i, "")
          .replace(/\s+\b(?:on|by|between|from|as soon as|as early as|starting)$/i, "");
        if (kept === was) break;
      }
      return kept.trim();
    })
    .filter(Boolean)
    .join(" ");
}

/**
 * The delivery line to print, or null when nothing survives.
 *
 * @param wording     Verbatim from the retailer, as captured.
 * @param checkedDate ISO date the capture was made. Null means unknown, which
 *                    is treated as stale — an undated promise is not one we can
 *                    stand behind.
 * @param todayIso    ISO date now, injected rather than read from the clock so
 *                    this is testable and so a page rendered at an edge in a
 *                    different timezone behaves the same as the tests.
 */
export function deliveryLine(
  wording: string | null | undefined,
  checkedDate: string | null | undefined,
  todayIso: string,
): string | null {
  if (!wording) return null;

  /* Always, at any age: the countdown expired within the hour, and "Details"
     is a link caption that was never part of the promise. */
  let out = wording.replace(COUNTDOWN, " ").replace(LINK_NOISE, " ").replace(/\s+/g, " ").trim();

  const sameDay = Boolean(checkedDate) && checkedDate === todayIso;
  if (!sameDay || namesAPastDate(out, todayIso)) out = stripTemporal(out);

  out = out.replace(/\s+/g, " ").replace(/[\s,;.]+$/, "").trim();
  if (out.length < 4) return null;

  /* "FREE delivery" is Amazon's shouting, not a fact about the offer. */
  out = out.replace(/\bFREE\b/g, "Free");

  /* What is left has to still SAY something about delivery. Cutting the date
     out of "Arrives Tomorrow" leaves "Arrives", which is a word rather than a
     claim — the reader learns nothing and the line looks broken. A remainder
     that names delivery, its cost, or the programme it comes under is kept;
     anything else is dropped entirely. */
  const SAYS_SOMETHING = /\b(?:deliver\w*|shipp?\w*|postage|pick\s?up|collect\w*|prime|free)\b|[$£€]\s?\d/i;
  return SAYS_SOMETHING.test(out) ? out : null;
}

/**
 * A short note for the reader when the date has been removed, so the absence is
 * explained rather than silently different from what the retailer's own page
 * will say. Null when the full wording is still current.
 */
export function deliveryNote(
  wording: string | null | undefined,
  checkedDate: string | null | undefined,
  todayIso: string,
): string | null {
  if (!wording || !TEMPORAL.test(wording)) return null;
  if (checkedDate === todayIso && !namesAPastDate(wording, todayIso)) return null;
  return "Delivery dates change daily — Amazon shows the current estimate for your address.";
}
