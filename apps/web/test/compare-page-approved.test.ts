import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { CATEGORY_DIRECTORY_ART } from "../src/content/category-directory-art";
import { COMPARE_CATEGORY_DETAILS } from "../src/content/compare-details";
import { categoryCanMatch } from "../src/content/matcher-router";
import { shellJourneyFor } from "../src/content/journeys";
import { liveCategories } from "../src/content/routes";

const PAGE = readFileSync(
  fileURLToPath(new URL("../src/pages/compare/index.astro", import.meta.url)),
  "utf8",
);

describe("owner-reviewed universal comparison page", () => {
  it("has a clear visitor purpose and targets compare robots", () => {
    expect(PAGE).toContain('const TITLE = "Compare Robots Side by Side | BotPlanet"');
    expect(PAGE).toContain("<h1>Compare robots side by side. Choose the one that fits.</h1>");
    expect(PAGE).toContain('href="#compare-by-job"');
  });

  it("uses original responsive head-to-head hero artwork", () => {
    expect(PAGE).toContain('src="/media/compare/hero.webp"');
    expect(PAGE).toContain('srcset={srcsetFor("/media/compare/hero.webp")}');
    expect(PAGE).toContain('width="1672"');
    expect(PAGE).toContain('height="941"');
    expect(PAGE).toContain("A robotic lawn mower and a robot vacuum");
    expect(PAGE).toContain('fetchpriority="high"');
  });

  it("gives every live category artwork, its own criteria and a comparison route", () => {
    for (const category of liveCategories()) {
      expect(CATEGORY_DIRECTORY_ART[category.slug], `${category.slug} has no visual`).toBeTruthy();
      const detail = COMPARE_CATEGORY_DETAILS[category.slug];
      expect(detail, `${category.slug} has no comparison model`).toBeTruthy();
      expect(detail.compareOn.length).toBeGreaterThanOrEqual(4);
      expect(detail.action.toLowerCase()).toContain("compare");
    }
    expect(PAGE).toContain("categoryRoutes(category.slug).compare");
    expect(PAGE).toContain("category.detail.compareOn.map");
  });

  it("never leaks pool criteria into every category again", () => {
    expect(PAGE).not.toContain("filtered by pool type, power and coverage");
    expect(COMPARE_CATEGORY_DETAILS["window-cleaning-robots"].compareOn).toContain("Framed or frameless");
    expect(COMPARE_CATEGORY_DETAILS["robot-vacuums"].compareOn).toContain("Floor mix");
    expect(COMPARE_CATEGORY_DETAILS["self-cleaning-litter-boxes"].compareOn).toContain("Cat size & age");
  });

  it("uses the universal Find My Robot shell", () => {
    const journey = shellJourneyFor("/compare/", { canMatch: categoryCanMatch });
    expect(journey?.category).toBe("universal");
    expect(journey?.ctaLabel).toBe("Find My Robot");
    expect(journey?.href).toBe("/botmatch/");
    expect(PAGE).not.toMatch(/find my pool cleaner/i);
  });

  it("ships canonical metadata, social artwork and collection schema", () => {
    expect(PAGE).toContain("path={PATH}");
    expect(PAGE).toContain("description={DESCRIPTION}");
    expect(PAGE).toContain('ogImage="/media/compare/hero.webp"');
    expect(PAGE).toContain('type: "CollectionPage"');
    expect(PAGE).toContain("itemListSchema(");
  });

  it("removes internal publication labels and makes actions accessible", () => {
    expect(PAGE).not.toMatch(/coming soon|pill--strong|>Live</i);
    expect(PAGE).toContain('aria-label="What BotPlanet comparison means"');
    expect(PAGE).toContain('aria-labelledby="compare-by-job-title"');
    expect(PAGE).toContain(".compare-card:focus-visible");
    expect(PAGE).toContain("@media (max-width: 700px)");
  });
});
