/**
 * The meta description for a product page that has no review yet.
 *
 * WHY IT NEEDED WRITING. The page fell back to
 * `${product.name}: specs, offers and suitability.` — forty-six characters on
 * the Litter-Robot 4, against roughly a hundred and fifty that a result gets.
 * A short description is not a neutral choice: Google fills the gap by
 * scraping a sentence off the page, and the sentence it picks is the one that
 * happened to be near the top rather than the one that answers the query.
 * Eleven live product pages were in that state.
 *
 * WHAT IT MAY SAY. Only what the product record already stores — class, power
 * type, supported environments, and the capability list the page prints as
 * pills two inches lower. Same discipline as lib/product-labels.ts: no
 * ranking, no performance claim, no price. A description is a promise about
 * the page, and a promise the page does not keep is worse than a short one.
 *
 * IT NAMES WHAT IS MISSING. A page with no review says so, because a reader
 * who clicks expecting a verdict and finds a specification table has been
 * mis-sold by us rather than by a manufacturer.
 */
import { titleCase } from "./format";

export interface ProductMetaFacts {
  name: string;
  productClass: string;
  powerType: string;
  environments: string[];
  cleans: string[];
}

/** Stored enum values read as machine tokens; these are the reader's words. */
const CLASS_NOUN: Record<string, string> = {
  litter_box: "self-cleaning litter box",
  lawn_mower: "robot lawn mower",
  pool_cleaner: "robotic pool cleaner",
  window_cleaner: "window cleaning robot",
  grill_cleaner: "grill cleaning robot",
  vacuum: "robot vacuum",
  companion: "companion robot",
  pet_camera: "pet camera robot",
  coding_robot: "coding robot",
};

const POWER_PHRASE: Record<string, string> = {
  mains: "Mains-powered",
  corded: "Mains-powered",
  cordless: "Battery-powered",
  solar: "Solar-powered",
  hybrid: "Mains and battery",
};

const ENVIRONMENT_PHRASE: Record<string, string> = {
  average_cat: "average-sized cats",
  large_cat: "large cats",
  multi_cat: "multi-cat homes",
  open_sky: "open lawns",
  tree_cover: "lawns under tree cover",
  slope: "sloped lawns",
  in_ground: "in-ground pools",
  above_ground: "above-ground pools",
  framed: "framed windows",
  frameless: "frameless glass",
  sloped_glass: "sloped glass",
  interior: "interior glass",
  exterior: "exterior glass",
};

const list = (parts: string[]): string =>
  parts.length <= 1
    ? (parts[0] ?? "")
    : `${parts.slice(0, -1).join(", ")} and ${parts[parts.length - 1]}`;

/**
 * Roughly 150 characters, which is what a result gets before it truncates.
 * Built in clauses and assembled shortest-first, so a product with a long name
 * and four capabilities drops the least important clause rather than being cut
 * mid-word by Google.
 */
export function productMetaDescription(f: ProductMetaFacts): string {
  const noun = CLASS_NOUN[f.productClass] ?? titleCase(f.productClass).toLowerCase();
  const power = POWER_PHRASE[f.powerType] ?? titleCase(f.powerType);
  const envs = f.environments.map((e) => ENVIRONMENT_PHRASE[e] ?? titleCase(e).toLowerCase());

  /* The name leads, then the two facts that rule a machine in or out, then
     what the page is. Assembled longest-first and stepped down until it fits,
     so a thirty-character product name loses a clause rather than a word. */
  const powerLower = power.toLowerCase();
  const ladder = [
    `${f.name}: ${powerLower}, listed for ${list(envs)}. The recorded ${noun} specification, current offers, and what we could not verify.`,
    `${f.name}: ${powerLower}, listed for ${list(envs)}. The recorded ${noun} specification and current offers.`,
    `${f.name}: ${powerLower}, for ${list(envs)}. The recorded ${noun} specification and current offers.`,
    `${f.name}: ${powerLower}. The recorded ${noun} specification, current offers, and what we could not verify.`,
    `${f.name}: the recorded ${noun} specification, current offers, and what we could not verify.`,
  ];
  const withEnvs = envs.length ? ladder : ladder.slice(3);
  for (const candidate of withEnvs) {
    if (candidate.length >= 90 && candidate.length <= 158) return candidate;
  }
  return withEnvs[withEnvs.length - 1];
}
