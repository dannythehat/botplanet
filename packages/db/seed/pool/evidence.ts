/**
 * Evidence seed (PROVISIONAL). All launch evidence is "researched" level — no
 * BotPlanet hands-on testing exists yet, so nothing may carry a "tested" label.
 * A "BotPlanet Tested" badge requires original evidence media (see media table),
 * which is intentionally absent until review units are obtained.
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
    evidenceLevel: "researched",
    sourceUrl: "https://beatbot.com/pages/affiliate",
    attribution: "Manufacturer + third-party review (researched)",
    verificationStatus: "provisional",
  },
  {
    id: "ev-ccplus-inground",
    productId: "prod-dolphin-nautilus-cc-plus",
    claim: "Corded robotic cleaner for in-ground pools up to ~50 ft.",
    evidenceLevel: "researched",
    sourceUrl: "https://www.bobvila.com/articles/best-robotic-pool-cleaner/",
    attribution: "Researched",
    verificationStatus: "provisional",
  },
  {
    id: "ev-betta-surface-only",
    productId: "prod-betta-se-plus",
    claim: "Solar surface skimmer — handles floating debris only, not floor/wall cleaning.",
    evidenceLevel: "manufacturer_claimed",
    sourceUrl: "https://lesliespool.com/betta-se-plus-solar-powered-smart-robotic-pool-skimmer-2-year-warranty/34208.html",
    attribution: "Manufacturer / retailer",
    verificationStatus: "provisional",
  },
];
