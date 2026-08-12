/**
 * Building the comparison rows.
 *
 * The table is generated from the catalogue, never hand-written. A hand-written
 * comparison drifts the moment a product changes — and three products changed
 * the machine they describe in a single day, which is exactly when a stale
 * hand-typed row would have printed one robot's numbers under another's name.
 *
 * Everything here is derived from stored fields. Where a field is null, the
 * cell says the manufacturer has not published it, and nothing is inferred to
 * fill the space.
 */
import { NOT_DISCLOSED, type ComparisonRow } from "../components/ComparisonTable.astro";
/* THROUGH productPath, NOT A TEMPLATE STRING. The comment above productPath
   says a second hand-written pattern is how ten obsolete URLs reached the SEO
   register; this was one of two survivors, and on 11 August 2026 it linked a
   merged product straight at its own 301. */
import { productPath } from "./routes";

/** The catalogue fields this needs. Deliberately not the whole product row. */
export interface ComparableProduct {
  id: string;
  slug: string;
  name: string;
  environments: string[];
  cleans: string[];
  powerType: string;
  priceTier: string;
  maxPoolLengthFt: number | null;
  maxPoolAreaSqFt: number | null;
}

const BAND_LABEL: Record<string, string> = {
  budget: "Budget",
  mid: "Mid",
  premium: "Premium",
  ultra: "Top",
};

/** Sort key. Declared in the table's caption so the order is never a mystery. */
const BAND_ORDER = ["budget", "mid", "premium", "ultra"];

const WORD: Record<string, string> = {
  in_ground: "In-ground",
  above_ground: "Above-ground",
  floor: "Floor",
  walls: "Walls",
  waterline: "Waterline",
  water_surface: "Surface",
  cordless: "Cordless",
  corded: "Corded",
  solar: "Solar",
};

const label = (v: string) => WORD[v] ?? v.replace(/_/g, " ");

/**
 * How big a pool it is rated for.
 *
 * Length is preferred because a reader can measure their pool with a tape and
 * cannot easily judge its area. Where the maker publishes only an area — Aiper
 * does this for the Scuba V3, BuBlue for the Bubot — the area is shown rather
 * than a "Not disclosed" that would misrepresent a published rating as silence.
 */
export function poolSizeCell(p: ComparableProduct): string {
  if (p.maxPoolLengthFt !== null) return `Up to ${p.maxPoolLengthFt} ft long`;
  if (p.maxPoolAreaSqFt !== null) return `Up to ${p.maxPoolAreaSqFt.toLocaleString("en-US")} sq ft`;
  return NOT_DISCLOSED;
}

export function comparisonRows(products: ComparableProduct[], categorySlug: string): ComparisonRow[] {
  return [...products]
    .sort((a, b) => {
      const band = BAND_ORDER.indexOf(a.priceTier) - BAND_ORDER.indexOf(b.priceTier);
      return band !== 0 ? band : a.name.localeCompare(b.name);
    })
    .map((p) => ({
      productId: p.id,
      name: p.name,
      href: productPath(p.slug, categorySlug),
      poolSize: poolSizeCell(p),
      environments: p.environments.length ? p.environments.map(label).join(" · ") : NOT_DISCLOSED,
      cleans: p.cleans.length ? p.cleans.map(label).join(" · ") : NOT_DISCLOSED,
      power: label(p.powerType),
      band: BAND_LABEL[p.priceTier] ?? p.priceTier,
    }));
}
