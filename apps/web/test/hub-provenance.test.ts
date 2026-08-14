/**
 * THE HUB MAY NOT PRESENT OUR RESEARCH AS THE MAKER'S FIGURE.
 *
 * Per-page audit, 13 August 2026. The pool hub's comparison table printed the
 * Scuba V3 as "Up to 1,614 sq ft" and the X1 Pro Max as "Up to 100 ft long",
 * rendered exactly like every manufacturer-published rating beside them. Both
 * are owner research — the V3's own spec table says "Max pool length: Not
 * disclosed" two clicks away.
 *
 * Two of our own surfaces disagreeing about where a number came from is worse
 * than either being wrong alone, because a reader who checks finds the
 * contradiction rather than the answer.
 */
import { describe, expect, it } from "vitest";
import { RESEARCHED_SUFFIX, sizeIsResearched } from "../src/lib/size-provenance";
import { REVIEWS } from "../src/content/reviews";

describe("hub size figures carry their provenance", () => {
  it("reads the answer out of the review's own spec table", () => {
    expect(sizeIsResearched(REVIEWS["aiper-scuba-x1-pro-max"])).toBe(true);
    expect(sizeIsResearched(REVIEWS["aiper-scuba-v3-ai-vision"])).toBe(true);
    expect(sizeIsResearched(REVIEWS["dolphin-nautilus-cc-plus"])).toBe(false);
    expect(sizeIsResearched(undefined)).toBe(false);
  });

  /**
   * The two the audit named, asserted by name. If either review's sourcing is
   * ever rewritten to claim the maker published it, this fails and somebody
   * has to justify the change rather than absorb it.
   */
  it("still calls the two figures the audit found researched, researched", () => {
    for (const slug of ["aiper-scuba-x1-pro-max", "aiper-scuba-v3-ai-vision"]) {
      const rows = REVIEWS[slug].specGroups.flatMap((g) => g.rows);
      const size = rows.filter((r) => /pool (length|area|size)/i.test(r.label));
      expect(size.length, `${slug} has no size row at all`).toBeGreaterThan(0);
      expect(sizeIsResearched(REVIEWS[slug]), `${slug} stopped declaring its size as researched`).toBe(true);
    }
  });

  /**
   * A published rating must never pick up the label by accident. Checked
   * against the row's FULL text — value and note together — because the two
   * reviews that triggered this fix write the fact in different halves: the X1
   * puts "(researched)" in the value, the V3 leaves the value null and puts
   * "Owner research holds roughly 1,614 sq ft" in the note.
   */
  it("agrees with the spec row it reads, whichever half carries the wording", () => {
    const disagreements = Object.entries(REVIEWS)
      .filter(([, r]) => {
        const rows = r.specGroups.flatMap((g) => g.rows);
        const size = rows.filter((x) => /pool (length|area|size)/i.test(x.label));
        if (!size.length) return false;
        const declares = size.some((x) =>
          /researched|owner research|our own research/i.test(
            `${x.value ?? ""} ${(x as { note?: string }).note ?? ""}`,
          ),
        );
        return declares !== sizeIsResearched(r);
      })
      .map(([slug]) => slug);
    expect(disagreements, "the helper disagrees with the spec row it reads").toEqual([]);
  });

  it("uses one suffix everywhere", () => {
    expect(RESEARCHED_SUFFIX).toBe(" (researched)");
  });
});
