/* ============================================================
   Whether BotPlanet prints a price at all.

   ONE SWITCH, ONE REASON, AND A WAY BACK.

   TURNED OFF, THEN BACK ON THE SAME DAY — 4 August 2026. The
   history is kept because the reason it went off is the reason the
   guards around it now exist.

   OFF: the page showed $749.00, captured 31 July. The owner
   reported the listing at closer to $1,800. Two numbers, no way to
   tell which was right, and a wrong price is the single most
   damaging thing this site can print — everything else on a
   BotPlanet page is checkable in a minute; a price is believed.

   WHAT THE CHECK FOUND. Both figures were wrong for this product.
   Read from amazon.com the same day, B09K4C9WGF was $849.00, In
   Stock. Our stored figure was $100 stale. The owner's $1,800 was
   amazon.co.uk showing B00Q8M0NWE — which turned out not to be a
   regional listing at all but a SIBLING VARIANT, the same machine
   without Wi-Fi, one of nine under parent B0HBR6VSXS, and $829.00
   on amazon.com. See lib/providers/refresh-service.ts for the gate
   that could not previously tell those nine apart.

   ON: a real refresh run through the production pipeline returned
   $849.00 with Model Name "Nautilus CC Plus Wi-Fi" — matching the
   manual read exactly. That is the bar for switching this back on
   and it is the only bar: not "the number looks plausible" but
   "the pipeline and an independent read of the listing agree".

   The interval was cut from seven days to three at the same time,
   because a week of drift is what let a $100 gap sit on the page
   unnoticed.

   HOW TO TURN IT OFF AGAIN. Set SHOW_PRICES to false. Every
   freshness rule and publication gate keeps running underneath
   either way, so nothing needs unpicking — the switch sits in
   front of them, not instead of them.
   ============================================================ */

/**
 * The master switch. When false, no surface prints a currency figure —
 * not the buy box, not a card, not the comparison table, and not the
 * Offer schema, which would otherwise put the same number into Google's
 * index in machine-readable form.
 */
export const SHOW_PRICES = true;

/** Printed where a price would have been, so the space is not simply blank. */
export const PRICE_WITHHELD_LABEL = "Check current price";

/**
 * RETIRED 14 AUGUST 2026, ON THE OWNER'S INSTRUCTION.
 *
 * This printed "We are not printing a price for this model while we reconcile
 * a disagreement between the price our check recorded and the price on the
 * listing" wherever a price was missing. On the W3 Omni and the W2 PRO it had
 * been saying it since 31 July, and it was not true: there was no
 * disagreement, because the checker had never read either listing. Forty-two
 * of sixty-four products were in the same position.
 *
 * Even where it had been true it was the wrong thing to print. A reader wants
 * a price or a link; a paragraph about our reconciliation process is neither,
 * and it makes a working buy button look broken. The label is
 * "Check current price" and the button goes to the live page. That is the
 * whole answer.
 *
 * Kept as a comment rather than deleted so nobody reinstates it by writing it
 * again from scratch.
 */
