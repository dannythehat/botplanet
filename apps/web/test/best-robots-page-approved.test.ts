import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { CATEGORY_DIRECTORY_ART } from "../src/content/category-directory-art";
import { builtBestOfCategories, liveCategories } from "../src/content/routes";
import { categoryCanMatch } from "../src/content/matcher-router";
import { shellJourneyFor } from "../src/content/journeys";

const PAGE = readFileSync(
  fileURLToPath(new URL("../src/pages/best-robots/index.astro", import.meta.url)),
  "utf8",
);

describe("owner-reviewed Best Robots hub", () => {
  it("has a clear job and targets the registered primary phrase", () => {
    expect(PAGE).toContain('const TITLE = "Best Robots for Every Job | BotPlanet"');
    expect(PAGE).toContain("<h1>The best robots for every job</h1>");
    expect(PAGE).toContain("Start with what you want done");
    expect(PAGE).toContain('href="#best-by-job"');
  });

  it("gives every live robot category a useful visual destination", () => {
    const ranked = builtBestOfCategories();
    for (const category of liveCategories()) {
      expect(
        ranked.has(category.slug) || CATEGORY_DIRECTORY_ART[category.slug],
        `${category.slug} has neither ranked artwork nor category artwork`,
      ).toBeTruthy();
    }
    expect(PAGE).toContain("categories.map");
    expect(PAGE).toContain("categoryRoutes(category.slug).best");
    expect(PAGE).toContain("categoryRoutes(category.slug).hub");
    expect(PAGE).toContain("srcset={srcsetFor(category.art.src)}");
  });

  it("distinguishes full rankings from category-level picks without dead ends", () => {
    expect(PAGE).toContain('"Ranked guide"');
    expect(PAGE).toContain('"Best picks inside"');
    expect(PAGE).toContain('"View ranked picks"');
    expect(PAGE).toContain('"See the best options"');
    expect(PAGE).not.toMatch(/coming soon|not published|only two categories|same search returns/i);
  });

  it("keeps the entire shell universal instead of falling back to pool", () => {
    const journey = shellJourneyFor("/best-robots/", { canMatch: categoryCanMatch });
    expect(journey?.category).toBe("universal");
    expect(journey?.ctaLabel).toBe("Find My Robot");
    expect(journey?.href).toBe("/botmatch/");
    expect(PAGE).not.toMatch(/find my pool cleaner|pool-specific questions/i);
  });

  it("ships collection metadata, canonical path and structured data", () => {
    expect(PAGE).toContain("path={PATH}");
    expect(PAGE).toContain("description={DESCRIPTION}");
    expect(PAGE).toContain('type: "CollectionPage"');
    expect(PAGE).toContain("itemListSchema(");
    expect(PAGE).toContain('ogImage="/media/home/hero-desktop.webp"');
  });

  it("explains the editorial standard in reader language", () => {
    for (const promise of [
      "Price and commission stay out of the decision.",
      "A winner for one home can be wrong for another.",
      "Every pick says who should not buy it.",
    ]) {
      expect(PAGE).toContain(promise);
    }
  });

  it("keeps the primary actions accessible and responsive", () => {
    expect(PAGE).toContain('aria-label="How to use this page"');
    expect(PAGE).toContain('aria-labelledby="best-by-job-title"');
    expect(PAGE).toContain(".best-card:focus-visible");
    expect(PAGE).toContain("@media (max-width: 700px)");
  });
});
