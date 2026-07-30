import { describe, expect, it } from "vitest";
import {
  activeNavPath,
  breadcrumbsFor,
  isNavActive,
  normalisePath,
  resolveRedirect,
  safeQuery,
} from "../src/lib/routing";
import { REDIRECTS, ROUTES, sitemapRoutes } from "../src/content/routes";

describe("normalisePath — locked URL standards", () => {
  it("lowercases, collapses slashes and enforces one trailing slash", () => {
    expect(normalisePath("/Robots/Robotic-Pool-Cleaners")).toBe("/robots/robotic-pool-cleaners/");
    expect(normalisePath("//guides//")).toBe("/guides/");
    expect(normalisePath("/ABOUT/")).toBe("/about/");
    expect(normalisePath("")).toBe("/");
  });

  it("leaves already-canonical paths untouched", () => {
    for (const r of ROUTES) expect(normalisePath(r.path)).toBe(r.path);
  });

  it("never rewrites passthrough or file paths", () => {
    expect(normalisePath("/go/pool-beatbot-ultra-amazon")).toBe("/go/pool-beatbot-ultra-amazon");
    expect(normalisePath("/api/botmatch")).toBe("/api/botmatch");
    expect(normalisePath("/admin/offers")).toBe("/admin/offers");
    expect(normalisePath("/sitemap.xml")).toBe("/sitemap.xml");
    expect(normalisePath("/robots.txt")).toBe("/robots.txt");
    expect(normalisePath("/fonts/space-grotesk-latin.woff2")).toBe("/fonts/space-grotesk-latin.woff2");
  });
});

describe("resolveRedirect", () => {
  it("sends generic BotMatch entries to the category journey", () => {
    for (const p of ["/find-my-robot/", "/botmatch/", "/find-my-robot/pool-cleaners/"]) {
      const r = resolveRedirect(p);
      expect(r?.to).toBe("/botmatch/robotic-pool-cleaners/");
      expect(r?.status).toBe(301);
    }
  });

  it("redirects the old /best/ section to /best-robots/", () => {
    expect(resolveRedirect("/best/")?.to).toBe("/best-robots/");
    expect(resolveRedirect("/best/robotic-pool-cleaners/")?.to).toBe("/best-robots/robotic-pool-cleaners/");
  });

  it("redirects legacy category slugs", () => {
    expect(resolveRedirect("/robots/pool-cleaners/")?.to).toBe("/robots/robotic-pool-cleaners/");
    expect(resolveRedirect("/compare/pool-cleaners/")?.to).toBe("/compare/robotic-pool-cleaners/");
  });

  it("normalises casing and missing trailing slashes in one hop", () => {
    expect(resolveRedirect("/Guides")?.to).toBe("/guides/");
    expect(resolveRedirect("/FIND-MY-ROBOT")?.to).toBe("/botmatch/robotic-pool-cleaners/");
  });

  it("returns null for canonical paths, so there is no redirect loop", () => {
    for (const r of ROUTES) expect(resolveRedirect(r.path)).toBeNull();
  });

  it("produces no redirect chains: every destination is already canonical", () => {
    for (const { to } of REDIRECTS) {
      expect(resolveRedirect(to)).toBeNull();
    }
  });

  it("does not redirect unknown paths — they must 404", () => {
    expect(resolveRedirect("/this-page-does-not-exist/")).toBeNull();
    expect(resolveRedirect("/robots/robotic-pool-cleaners/no-such-product/")).toBeNull();
  });

  it("leaves passthrough routes alone", () => {
    expect(resolveRedirect("/go/some-key")).toBeNull();
    expect(resolveRedirect("/api/admin/login")).toBeNull();
  });
});

describe("safeQuery", () => {
  it("keeps campaign parameters and drops everything else", () => {
    expect(safeQuery("?utm_source=x&secret=abc&q=pool")).toBe("?utm_source=x&q=pool");
  });

  it("returns an empty string when nothing is worth keeping", () => {
    expect(safeQuery("?answers=large-pool&budget=800")).toBe("");
    expect(safeQuery("")).toBe("");
    expect(safeQuery("?")).toBe("");
  });
});

describe("breadcrumbsFor", () => {
  it("emits nothing for the homepage", () => {
    expect(breadcrumbsFor("/")).toEqual([]);
  });

  it("builds the category trail", () => {
    expect(breadcrumbsFor("/robots/robotic-pool-cleaners/")).toEqual([
      { name: "Robot Categories", path: "/robots/" },
      { name: "Robotic Pool Cleaners", path: "/robots/robotic-pool-cleaners/" },
    ]);
  });

  it("builds the product trail with the product as the final crumb", () => {
    const c = breadcrumbsFor("/robots/robotic-pool-cleaners/dolphin-e10/", "Dolphin E10");
    expect(c.map((x) => x.name)).toEqual(["Robot Categories", "Robotic Pool Cleaners", "Dolphin E10"]);
    expect(c[c.length - 1].path).toBe("/robots/robotic-pool-cleaners/dolphin-e10/");
  });

  it("builds the comparison trail under Compare, not under Shop", () => {
    expect(breadcrumbsFor("/compare/robotic-pool-cleaners/").map((x) => x.name)).toEqual([
      "Compare Robots",
      "Robotic Pool Cleaners",
    ]);
  });

  it("builds the BotMatch trail under the category", () => {
    expect(breadcrumbsFor("/botmatch/robotic-pool-cleaners/").map((x) => x.name)).toEqual([
      "Robot Categories",
      "Robotic Pool Cleaners",
      "Find My Pool Cleaner",
    ]);
  });

  it("builds a guide article trail", () => {
    expect(breadcrumbsFor("/guides/how-robot-pool-cleaners-work/", "How robot pool cleaners work").map((x) => x.name)).toEqual([
      "Guides",
      "How robot pool cleaners work",
    ]);
  });

  it("omits a trail that would only repeat the page title", () => {
    expect(breadcrumbsFor("/about/")).toEqual([]);
    expect(breadcrumbsFor("/guides/")).toEqual([]);
  });
});

describe("navigation active state", () => {
  it("marks the section containing the current page", () => {
    expect(isNavActive("/robots/", "/robots/robotic-pool-cleaners/dolphin-e10/")).toBe(true);
    expect(isNavActive("/compare/", "/robots/robotic-pool-cleaners/")).toBe(false);
  });

  it("never marks home active on a sub-page", () => {
    expect(isNavActive("/", "/guides/")).toBe(false);
    expect(isNavActive("/", "/")).toBe(true);
  });

  it("chooses exactly one nav item — the most specific match", () => {
    const nav = ["/robots/", "/compare/", "/guides/"];
    expect(activeNavPath(nav, "/robots/robotic-pool-cleaners/dolphin-e10/")).toBe("/robots/");
    expect(activeNavPath(nav, "/deals/")).toBeNull();
  });
});

describe("sitemap inclusion rules", () => {
  it("contains only canonical, indexable, non-hidden routes", () => {
    for (const r of sitemapRoutes()) {
      expect(r.indexable).toBe(true);
      expect(r.inSitemap).toBe(true);
      expect(r.status).not.toBe("hidden");
      expect(r.path).toBe(normalisePath(r.path));
    }
  });

  it("excludes search, saved and every coming-soon route", () => {
    const paths = sitemapRoutes().map((r) => r.path);
    expect(paths).not.toContain("/search/");
    expect(paths).not.toContain("/saved/");
    expect(paths).not.toContain("/deals/");
    expect(paths).not.toContain("/news/");
  });

  it("never lists a path that is itself a redirect source", () => {
    const aliases = new Set(REDIRECTS.map((r) => normalisePath(r.from)));
    for (const r of sitemapRoutes()) expect(aliases.has(r.path)).toBe(false);
  });
});

describe("registry integrity", () => {
  it("has unique canonical paths", () => {
    const seen = new Set<string>();
    for (const r of ROUTES) {
      expect(seen.has(r.path)).toBe(false);
      seen.add(r.path);
    }
  });

  it("has no alias colliding with a real route", () => {
    const real = new Set(ROUTES.map((r) => r.path));
    for (const { from } of REDIRECTS) expect(real.has(normalisePath(from))).toBe(false);
  });

  it("gives every route a resolvable parent", () => {
    const real = new Set(ROUTES.map((r) => r.path));
    for (const r of ROUTES) {
      if (r.parent) expect(real.has(r.parent)).toBe(true);
    }
  });

  it("keeps every registry path canonical", () => {
    for (const r of ROUTES) expect(r.path).toBe(normalisePath(r.path));
  });
});
