/* ============================================================
   Whether BotPlanet prints a price at all.

   ONE SWITCH, ONE REASON, AND A WAY BACK.

   Turned OFF on 4 August 2026. The Nautilus page showed $749.00,
   checked 31 July, sourced from the Amazon buy box via SerpApi and
   attributed to the marketplace seller "The Pool Spot". The owner
   reports the listing at closer to $1,800. Both figures cannot be
   right, and the machine cannot tell which is: amazon.com serves
   this environment a bot-mitigation page, so the number cannot be
   re-read to settle it.

   That is the whole argument. A price nobody can currently verify
   is not a price, it is a claim — and a wrong price is the single
   most damaging thing this site can print, because it is the one
   number a reader will act on without checking. Everything else on
   a BotPlanet page is checkable in a minute; a price is believed.

   WHAT IS STILL SHOWN. Everything else: the retailer, the seller,
   stock, delivery, the check date, and a working link. The reader
   is sent to the live listing to read the current price from the
   only source that is definitionally correct — the page they will
   buy on. That is a smaller claim, and a true one.

   WHAT THIS IS NOT. It is not a bug fix and it does not pretend to
   be one. The underlying question — why the captured buy-box price
   and the observed price disagree — is open, and turning the
   display off does not close it. It stops the site asserting a
   figure while it is open.

   HOW TO TURN IT BACK ON. Set SHOW_PRICES to true. Nothing else
   changes: every freshness rule, check-date requirement and
   publication gate is still in place underneath and starts
   applying again the moment this flips. Do it once a capture has
   been reconciled against the live listing.
   ============================================================ */

/**
 * The master switch. When false, no surface prints a currency figure —
 * not the buy box, not a card, not the comparison table, and not the
 * Offer schema, which would otherwise put the same number into Google's
 * index in machine-readable form.
 */
export const SHOW_PRICES = false;

/** Printed where a price would have been, so the space is not simply blank. */
export const PRICE_WITHHELD_LABEL = "Check current price";

/**
 * The reason, in the reader's language rather than ours. Shown once per
 * surface — a page that repeats it in five places is a page apologising.
 */
export const PRICE_WITHHELD_NOTE =
  "We are not printing a price for this model while we reconcile a disagreement between " +
  "the price our check recorded and the price on the listing. The link goes to the live " +
  "page, where the current figure is the one that counts.";
