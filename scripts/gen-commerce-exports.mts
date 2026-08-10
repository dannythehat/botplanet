/**
 * Regenerate the committed commerce exports.
 *
 * These five JSON files are the register's public record of what BotPlanet
 * sells and through whom, and offers.test.ts asserts they match what the code
 * produces — so the register can never be filled from a stale export. That
 * means they must be rebuilt whenever the catalogue changes, and there was no
 * script to do it: the check failed the moment Grillbot was added and the only
 * way to fix it was to hand-edit generated files.
 *
 *   npx tsx scripts/gen-commerce-exports.mts
 */
import { writeFileSync } from "node:fs";
import {
  buildOfferInventory,
  buildProductOfferMapping,
  buildProgrammeInventory,
  buildRejectedCandidates,
  buildRetailerInventory,
} from "../apps/web/src/lib/commerce-mapping.ts";

const files: [string, unknown][] = [
  ["docs/job-10-retailer-inventory.json", buildRetailerInventory()],
  ["docs/job-10-programme-inventory.json", buildProgrammeInventory()],
  ["docs/job-10-offer-inventory.json", buildOfferInventory()],
  ["docs/job-10-product-offer-mapping.json", buildProductOfferMapping()],
  ["docs/job-10-rejected-offer-candidates.json", buildRejectedCandidates()],
];

for (const [path, data] of files) {
  writeFileSync(path, `${JSON.stringify(data, null, 2)}\n`);
  console.log(`wrote ${path}`);
}
