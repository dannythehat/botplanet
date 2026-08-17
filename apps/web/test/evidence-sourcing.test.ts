/**
 * AN EVIDENCE BLOCK MAY NOT ARGUE WITH THE PAGE IT SITS ON.
 *
 * Systemic defect S1, per-page audit 13 August 2026. Three evidence rows exist
 * site-wide and two of them contradicted their own review:
 *
 *   Nautilus CC Plus cited a Bob Vila listicle for "in-ground pools up to
 *   ~50 ft" at the foot of a page whose central argument is that Maytronics
 *   states 40 ft. The block undid the correction the review was built around.
 *
 *   Betta SE Plus cited a Leslie's listing whose URL reads "-2-year-warranty-"
 *   under a review that states one year, sourced twice.
 *
 * A reader who scrolls that far is checking our work. Handing them a retailer
 * or an aggregator that disagrees with us is worse than citing nothing.
 */
import { describe, expect, it } from "vitest";
import { evidenceRows } from "../../../packages/db/seed/pool/evidence";

/**
 * Domains that are never a source for a product claim.
 *
 * RETAILERS AND AGGREGATORS FOR DIFFERENT REASONS. A retailer's copy is
 * written to sell and drifts from the maker's sheet — the Leslie's warranty is
 * exactly that. An aggregator listicle is somebody else's research, and citing
 * it means our figure is only as good as theirs, which is how the ~50 ft got
 * in. Neither is the manufacturer, and the manufacturer is what the claim is
 * about.
 */
const NEVER_A_SOURCE = [
  /(^|\.)amazon\./i,
  /(^|\.)lesliespool\.com$/i,
  /(^|\.)poolsupplyworld\.com$/i,
  /(^|\.)walmart\./i,
  /(^|\.)bobvila\.com$/i,
  /(^|\.)pcworld\.com$/i,
  /(^|\.)poolbots\.com$/i,
  /(^|\.)wirecutter\./i,
  /(^|\.)nytimes\.com$/i,
];

const host = (url: string) => new URL(url).hostname.replace(/^www\./, "");

describe("evidence sources", () => {
  it("has rows to check", () => {
    expect(evidenceRows.length).toBeGreaterThan(0);
  });

  it.each(evidenceRows.map((r) => r.id!))("%s cites neither a retailer nor an aggregator", (id) => {
    const row = evidenceRows.find((r) => r.id === id)!;
    expect(row.sourceUrl, `${id} has no source at all`).toBeTruthy();
    const h = host(row.sourceUrl!);
    const banned = NEVER_A_SOURCE.find((re) => re.test(h));
    expect(banned, `${id} cites ${h}, which is a retailer or an aggregator`).toBeUndefined();
  });

  /**
   * The affiliate sign-up page is on the manufacturer's domain and is still
   * not a source for anything about the product. It was cited for the Beatbot
   * until 13 August 2026.
   */
  it.each(evidenceRows.map((r) => r.id!))("%s cites a page about the product", (id) => {
    const row = evidenceRows.find((r) => r.id === id)!;
    expect(
      /\/(affiliate|partners?|about|contact|careers)\b/i.test(row.sourceUrl!),
      `${id} cites ${row.sourceUrl} — a company page, not a product page`,
    ).toBe(false);
  });

  /**
   * The level describes where the claim came from. A figure read off the
   * maker's own page is manufacturer_claimed; "researched" means we worked it
   * out, and using it for a manufacturer figure overstates our own work while
   * understating theirs.
   */
  it.each(evidenceRows.map((r) => r.id!))("%s labels its level honestly", (id) => {
    const row = evidenceRows.find((r) => r.id === id)!;
    const h = host(row.sourceUrl!);
    const isMakerPage = !/^(docs|drive|cdn|assets|downloads)\./.test(h);
    if (isMakerPage && row.evidenceLevel === "researched") {
      expect.fail(`${id} cites the maker's own page (${h}) but calls the claim "researched"`);
    }
    expect(["manufacturer_claimed", "researched", "verified"]).toContain(row.evidenceLevel);
  });

  /**
   * THE ONE THAT WOULD HAVE CAUGHT THE NAUTILUS. A claim carrying a figure the
   * review contradicts is the whole defect, and the Nautilus is the proof
   * case: 50 in the evidence block, 40 in the review, three times.
   */
  it("states the Nautilus length the review states", () => {
    const row = evidenceRows.find((r) => r.id === "ev-ccplus-inground")!;
    expect(row.claim).toContain("40 ft");
    expect(row.claim, "the ~50 ft figure is back").not.toMatch(/50\s*ft/);
  });
});
