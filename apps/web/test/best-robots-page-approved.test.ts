import { existsSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { builtBestOfCategories, sitemapRoutes } from "../src/content/routes";
import { resolveRedirect } from "../src/lib/routing";

describe("best-of consolidation", () => {
  it("retires the generic index in favour of the robot-category directory", () => {
    expect(existsSync("apps/web/src/pages/best-robots/index.astro")).toBe(false);
    expect(resolveRedirect("/best-robots/")?.to).toBe("/robots/");
    expect(sitemapRoutes().map((route) => route.path)).not.toContain("/best-robots/");
  });

  it("keeps the evidence-supported ranked guides", () => {
    expect([...builtBestOfCategories()].sort()).toEqual([
      "robotic-lawn-mowers",
      "robotic-pool-cleaners",
    ]);
    for (const path of [
      "apps/web/src/pages/best-robots/robotic-pool-cleaners/index.astro",
      "apps/web/src/pages/best-robots/robotic-pool-cleaners/above-ground-pools.astro",
      "apps/web/src/pages/best-robots/robotic-pool-cleaners/cordless.astro",
      "apps/web/src/pages/best-robots/robotic-lawn-mowers/index.astro",
    ]) {
      expect(existsSync(path), path).toBe(true);
    }
  });
});
