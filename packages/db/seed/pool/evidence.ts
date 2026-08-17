/**
 * Evidence seed. All launch evidence is "researched" level — no BotPlanet
 * hands-on testing exists yet, so nothing may carry a "tested" label. A
 * "BotPlanet Tested" badge requires original evidence media (see media table),
 * which is intentionally absent until review units are obtained.
 *
 * EVERY SOURCE HERE IS THE MANUFACTURER'S, AND THAT RULE ARRIVED LATE.
 *
 * These three rows shipped at launch marked `provisional` and were never
 * revisited. The per-page audit of 13 August 2026 read them on the live pages
 * and found two of the three arguing with the review printed above them:
 *
 *   Nautilus CC Plus — cited a Bob Vila listicle for "in-ground pools up to
 *   ~50 ft". The review's central correction is that Maytronics states 40 ft
 *   (12 m), and it walks the reader through why the larger figure is wrong.
 *   The Evidence block, at the foot of that argument, undid it.
 *
 *   Betta SE Plus — cited a Leslie's listing whose own URL reads
 *   "…-2-year-warranty…" while the review states one year, sourced twice from
 *   Betta's product page and its manual.
 *
 * A reader who scrolls to the Evidence block is checking our work. Handing
 * them a retailer or an aggregator that contradicts the page is worse than
 * citing nothing at all.
 *
 * THE RULE, enforced by evidence.test.ts:
 *   - the source is the manufacturer's own domain, never a retailer and never
 *     an aggregator or listicle;
 *   - the claim states the same figure the review states;
 *   - a claim taken from a manufacturer page is `manufacturer_claimed`, not
 *     `researched` — the level describes where it came from.
 */
import type { evidence } from "../../src/schema/catalogue.js";

/* @extension-point per-product | optional | The product ships with no cited
   source behind its specification claims. It renders, but every figure on the
   page is then unattributed, which is the thing the review methodology
   promises we do not do. */
export const evidenceRows: (typeof evidence.$inferInsert)[] = [
  {
    id: "ev-ultra-surface-skim",
    productId: "prod-beatbot-aquasense-2-ultra",
    claim: "Cleans floor, walls and waterline and also skims the water surface.",
    /* Was `researched` against beatbot.com/pages/affiliate — our own affiliate
       sign-up page, which is not a source for anything about the product. The
       claim is Beatbot's and the product page is where they make it. */
    evidenceLevel: "manufacturer_claimed",
    sourceUrl: "https://beatbot.com/pages/aquasense-2-ultra",
    attribution: "Beatbot product page",
    verificationStatus: "provisional",
  },
  {
    id: "ev-ccplus-inground",
    /* WAS "up to ~50 ft" SOURCED TO BOB VILA. Maytronics states 40 ft (12 m)
       and the review says so three times. The figure now matches the page and
       the source is the maker's own product page. */
    productId: "prod-dolphin-nautilus-cc-plus",
    claim: "Corded robotic cleaner for in-ground pools up to 40 ft (12 m).",
    evidenceLevel: "manufacturer_claimed",
    sourceUrl:
      "https://www.maytronics.com/en-us/store/residential-pools/best-performance-cleaners/dolphin-nautilus-cc-plus-w",
    attribution: "Maytronics product page",
    verificationStatus: "provisional",
  },
  {
    id: "ev-betta-surface-only",
    productId: "prod-betta-se-plus",
    claim: "Solar surface skimmer — handles floating debris only, not floor/wall cleaning.",
    /* Was a Leslie's listing whose URL advertises a 2-year warranty against
       the page's twice-sourced 1 year. Betta's own product page makes the same
       surface-only claim without the contradiction attached. */
    evidenceLevel: "manufacturer_claimed",
    sourceUrl: "https://bettabot.com/products/betta-se-plus",
    attribution: "Betta product page",
    verificationStatus: "provisional",
  },
];
