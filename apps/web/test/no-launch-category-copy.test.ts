/**
 * NO SHARED SURFACE MAY ASK A READER ABOUT SOMEBODY ELSE'S CATEGORY.
 *
 * The same defect has now been found five times in four days, each time on a
 * different shared component, each time by an audit rather than by a test:
 *
 *   the shell CTA, drawer and mega panel — "Find My Pool Cleaner" on all nine
 *   hubs; the footer prompt — "Not sure which pool cleaner fits?" site-wide;
 *   the hub comparison table — "whether one fits your pool" on nine
 *   categories; the review buy strip — "sounds like your pool?" on all
 *   sixty-four reviews; the BotMatch snapshot — "Match this against my pool",
 *   likewise.
 *
 * Every one was copy written when pool was the only category, rendered by a
 * component that nine categories share, and never re-read when eight more
 * arrived. This is the test that stops the sixth.
 */
import { describe, expect, it } from "vitest";
import { readdirSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const DIR = fileURLToPath(new URL("../src/components/", import.meta.url));

/**
 * Components rendered for more than one category. A component built for ONE
 * category may name it — WinbotLadder is allowed to say "WINBOT".
 */
const SHARED = readdirSync(DIR).filter(
  (f) =>
    f.endsWith(".astro") &&
    !["WinbotLadder.astro", "CapabilityTable.astro", "PoolSizeShape.astro"].includes(f),
);

/** Second-person copy naming a category the reader may not be in. */
const LAUNCH_CATEGORY_COPY = [
  /\byour pool\b/i,
  /\bmy pool\b/i,
  /\bpool cleaner\b/i,
  /\bpool robots?\b/i,
  /\byour windows\b/i,
  /\byour lawn\b/i,
  /\byour cat\b/i,
];

/** Strip comments and CSS: the history of a fix must be allowed to name it. */
function readerCopy(src: string): string {
  return src
    .replace(/<style>[\s\S]*?<\/style>/g, "")
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, "")
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/^\s*\/\/.*$/gm, "");
}

describe("shared components speak to whoever is reading", () => {
  /**
   * A PER-CATEGORY MAP IS THE FIX, NOT THE DEFECT, and the first run of this
   * test flagged one. BotMatcher.astro holds a `Record` keyed by category slug
   * whose entries read "for your pool", "for your windows", "for your lawn" —
   * every category gets its own noun, which is exactly what the five broken
   * components were missing. Copy inside such a map is exempt; copy outside one
   * is not.
   */
  const perCategoryMap = (src: string) =>
    /Record<\s*string\s*,[\s\S]{0,4000}"(robotic-pool-cleaners|window-cleaning-robots|robotic-lawn-mowers)"\s*:/.test(src);

  it.each(SHARED)("%s names no single category in its copy", (file) => {
    const raw = readFileSync(DIR + file, "utf8");
    if (perCategoryMap(raw)) return;
    const copy = readerCopy(raw);
    const hits = LAUNCH_CATEGORY_COPY.filter((re) => re.test(copy)).map((re) => String(re));
    expect(
      hits,
      `${file} renders for every category and its copy names one of them`,
    ).toEqual([]);
  });

  /**
   * And the two that were fixed by making the noun come from the journey
   * rather than by deleting it, asserted directly so a later edit cannot
   * quietly hardcode them again.
   */
  it("takes the snapshot CTA's noun from the category's own journey", () => {
    const src = readFileSync(DIR + "BotMatchSnapshot.astro", "utf8");
    expect(src).toContain("journeyFor(categorySlug)?.subject");
    expect(src).toContain("Match this against my {subject}");
  });
});
