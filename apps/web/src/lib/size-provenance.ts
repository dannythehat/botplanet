/**
 * Is a product's pool-size rating the manufacturer's figure, or ours?
 *
 * WHY THIS IS ITS OWN MODULE. It belongs beside poolSizeCell in
 * content/comparison.ts, and it cannot live there: that file imports a
 * constant from ComparisonTable.astro, which the test runner cannot transform,
 * so nothing in it can be unit tested. The rule this encodes is the one the
 * per-page audit caught the hub breaking, so it needs a test more than it
 * needs to be tidy.
 *
 * THE REVIEW IS THE AUTHORITY, NOT A LIST HERE. A figure we established
 * ourselves is already written "100 ft (researched)" in the review's own spec
 * table, with a note saying it was not read from the maker's page. Restating
 * that fact in a second place is how the hub and the review came to disagree
 * in the first place.
 */
import type { ReviewContent } from "../content/reviews";

/**
 * Which spec row is the size row.
 *
 * A PATTERN, NOT A LIST. The list version missed rows the catalogue actually
 * uses and silently returned "published" for them, which is the exact failure
 * mode this module exists to prevent — a miss here reads as a manufacturer's
 * rating rather than as ours.
 */
const SIZE_LABEL = /pool (length|area|size)/i;

/**
 * BOTH WORDINGS COUNT, and missing the second is what the first version of this
 * did. The X1 Pro Max writes its figure "100 ft (researched)". The Scuba V3
 * writes no value at all and puts the number in the note: "Aiper publishes an
 * area, not a length. Owner research holds roughly 1,614 sq ft". Same fact,
 * two shapes, and the V3 is the one the hub was misrepresenting worst — it
 * prints 1,614 sq ft as a rating while the review says the maker publishes no
 * length and that the area came from us.
 */
const RESEARCH_WORDING = /researched|owner research|our own research/i;

export function sizeIsResearched(review: ReviewContent | undefined): boolean {
  if (!review) return false;
  const rows = review.specGroups.flatMap((g) => g.rows);
  return rows.some((r) => {
    if (!SIZE_LABEL.test(r.label)) return false;
    const note = (r as { note?: string }).note ?? "";
    return RESEARCH_WORDING.test(`${r.value ?? ""} ${note}`);
  });
}

/** The suffix a hub cell carries when the figure is ours rather than theirs. */
export const RESEARCHED_SUFFIX = " (researched)";
