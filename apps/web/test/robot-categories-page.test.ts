import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { CATEGORY_DIRECTORY_ART } from "../src/content/category-directory-art";
import { liveCategories } from "../src/content/routes";

const PAGE = readFileSync(
  fileURLToPath(new URL("../src/pages/robots/index.astro", import.meta.url)),
  "utf8",
);

describe("owner-approved robot category directory", () => {
  it("gives every live category its own relevant image and accessible description", () => {
    const categories = liveCategories();
    expect(categories).toHaveLength(9);
    expect(Object.keys(CATEGORY_DIRECTORY_ART).sort()).toEqual(
      categories.map((category) => category.slug).sort(),
    );

    for (const category of categories) {
      const art = CATEGORY_DIRECTORY_ART[category.slug];
      expect(art, `${category.slug} is missing directory artwork`).toBeDefined();
      expect(art.src, `${category.slug} image is missing`).toMatch(/^\/media\/.+\.webp$/);
      expect(art.alt, `${category.slug} alt text is missing`).toMatch(/\S{20,}/);
    }

    expect(PAGE).toContain("category-card__image");
    expect(PAGE).toContain("srcset={srcsetFor(category.art.src)}");
    expect(PAGE).toContain('loading="lazy"');
  });

  it("uses category-directory search intent without pool-launch metadata", () => {
    expect(PAGE).toContain('title="Robot Categories: Types of Home Robots | BotPlanet"');
    expect(PAGE).toContain("<h1>Robot categories</h1>");
    expect(PAGE).toMatch(/types of robots/i);
    expect(PAGE).toContain('type: "CollectionPage"');
    expect(PAGE).toContain("itemListSchema(");
    expect(PAGE).toContain('path="/robots/"');
  });

  it("does not publish the rejected launch-roadmap or shop language", () => {
    const copy = PAGE.toLowerCase();
    for (const rejected of [
      "shop robots",
      "category live",
      "categories live",
      "live badge",
      "robotic pool cleaners — what’s inside",
      "find my pool cleaner",
      "deals",
    ]) {
      expect(copy, `rejected copy returned: ${rejected}`).not.toContain(rejected);
    }
  });

  it("offers one universal next step after the complete visual directory", () => {
    expect(PAGE).toContain("Not sure which kind of robot you need?");
    expect(PAGE).toContain('href="/botmatch/"');
    expect(PAGE).toContain("Find your robot");
  });
});
