/**
 * The map of interchangeable data has to stay true, or it is worse than none.
 *
 * A stale map is actively dangerous: somebody adding security robots reads it,
 * works the list, and ships a category missing whatever was added after the map
 * was last written. So the generated doc is checked against the tags on every
 * run, and a tag added without regenerating fails the build.
 *
 * See scripts/extension-points.mjs for the tag format.
 */
import { execFileSync } from "node:child_process";
import { describe, expect, it } from "vitest";
import { liveCategories } from "../src/content/nav";

const ROOT = new URL("../../../", import.meta.url).pathname;

function run(args: string[]): string {
  return execFileSync("node", ["scripts/extension-points.mjs", ...args], {
    cwd: ROOT,
    encoding: "utf8",
  });
}

describe("extension points", () => {
  it("keeps docs/EXTENSION-POINTS.md in step with the tags in the code", () => {
    // Throws with the regeneration command in its message if they have drifted.
    expect(() => run(["--check"])).not.toThrow();
  });

  it("finds every scope, so a whole class of data cannot silently vanish", () => {
    const map = run([]);
    for (const scope of ["PER CATEGORY", "PER PRODUCT", "PER BRAND", "SHARED VOCABULARY"]) {
      expect(map, `no ${scope} extension points found`).toContain(scope);
    }
  });

  /**
   * The required per-category points are the ones whose absence is invisible:
   * the page still renders, it just renders without a title, without a sitemap
   * entry, or without a questionnaire. Every live category must satisfy all of
   * them — this is the check that would have caught the window hub shipping
   * with no keyword register row.
   */
  it.each(liveCategories().map((c) => c.slug))(
    "%s has every required per-category extension point",
    (slug) => {
      const report = run([slug]);
      const todo = report.split("STILL TO DO")[1]?.split("CHECK BY HAND")[0] ?? "";
      const requiredOutstanding = todo
        .split("\n")
        .filter((l) => l.includes("[required]"))
        .map((l) => l.trim());
      expect(requiredOutstanding, `${slug} is missing required extension points`).toEqual([]);
    },
  );
});
