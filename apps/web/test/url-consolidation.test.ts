import { existsSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import {
  URL_CONSOLIDATION_REDIRECTS,
  REMOVED_PATHS,
  isRemovedPath,
} from "../src/content/url-consolidation";
import { resolveRedirect, isGone } from "../src/lib/routing";
import { sitemapRoutes } from "../src/content/routes";
import { BAR_ITEMS, FOOTER_GROUPS, UTILITY_ITEMS } from "../src/content/nav-surfaces";

describe("URL consolidation", () => {
  it("redirects every merged page in one permanent hop", () => {
    for (const [from, to] of Object.entries(URL_CONSOLIDATION_REDIRECTS)) {
      const result = resolveRedirect(from);
      expect(result?.status, from).toBe(301);
      expect(result?.to, from).toBe(to);
      expect(resolveRedirect(to), `${from} creates a redirect chain`).toBeNull();
    }
  });

  it("keeps redirect sources out of navigation and the sitemap", () => {
    const sources = new Set(Object.keys(URL_CONSOLIDATION_REDIRECTS));
    const navPaths = [
      ...BAR_ITEMS.map((item) => item.href),
      ...UTILITY_ITEMS.map((item) => item.href),
      ...FOOTER_GROUPS.flatMap((group) => group.links.map((link) => link.href)),
    ];
    expect(navPaths.filter((path) => sources.has(path))).toEqual([]);
    expect(sitemapRoutes().map((route) => route.path).filter((path) => sources.has(path))).toEqual([]);
  });

  it("returns 410 for pages removed without a replacement", () => {
    for (const path of REMOVED_PATHS) {
      expect(isRemovedPath(path), path).toBe(true);
      expect(isGone(path), path).toBe(true);
      expect(resolveRedirect(path), path).toBeNull();
    }
    expect(isGone("/news/old-story/")).toBe(true);
  });

  it("removes obsolete route implementations while preserving the intentional pages", () => {
    for (const path of [
      "apps/web/src/pages/best-robots/index.astro",
      "apps/web/src/pages/compare/index.astro",
      "apps/web/src/pages/compare/[category].astro",
      "apps/web/src/pages/guides/robotic-pool-cleaners.astro",
      "apps/web/src/pages/business/index.astro",
      "apps/web/src/pages/deals/index.astro",
      "apps/web/src/pages/deals/robotic-pool-cleaners.astro",
      "apps/web/src/pages/news/index.astro",
      "apps/web/src/pages/news/[slug].astro",
    ]) {
      expect(existsSync(path), path).toBe(false);
    }

    for (const path of [
      "apps/web/src/pages/compare/eilik-vs-emo.astro",
      "apps/web/src/pages/best-robots/robotic-pool-cleaners/index.astro",
      "apps/web/src/pages/best-robots/robotic-pool-cleaners/above-ground-pools.astro",
      "apps/web/src/pages/best-robots/robotic-pool-cleaners/cordless.astro",
      "apps/web/src/pages/best-robots/robotic-lawn-mowers/index.astro",
    ]) {
      expect(existsSync(path), path).toBe(true);
    }
  });

  it("moves the unique pool comparison and guide directory content into the pool hub", () => {
    const hub = readFileSync("apps/web/src/pages/robots/[category]/index.astro", "utf8");
    expect(hub).toContain("comparePageFor(cat.slug)");
    expect(hub).toContain("<BrandPairs");
    expect(hub).toContain("editorialForCategory(cat.slug)");
    expect(hub).toContain("Robotic pool cleaner buying advice");

    const table = readFileSync("apps/web/src/components/ComparisonTable.astro", "utf8");
    expect(table).not.toContain("`/compare/${categorySlug}/`");
    expect(table).not.toContain("Every column, every model");
  });
});
