/**
 * Assembled provisional pool-category seed.
 *
 * This is DRAFT data for review, not a production load. Loading into D1 is wired
 * when the Cloudflare account/zone are confirmed. See docs/SEED-PROVENANCE.md for
 * the verified-vs-provisional field map.
 */
export {
  SNAPSHOT_DATE,
  marketRows,
  categoryRows,
  brandRows,
  productRows,
  productMarketAvailabilityRows,
} from "./catalogue.js";
export {
  retailerRows,
  retailerMarketRows,
  affiliateProgramRows,
  offerRows,
  redirectLinkRows,
} from "./commercial.js";
export { evidenceRows } from "./evidence.js";
export { questionnaireRows, scoringConfigRows } from "./botmatch.js";
