/**
 * OWNER-APPROVED BUYING-ADVICE CONTRACT — 17 AUGUST 2026.
 *
 * The guides index is a visual library of finished advice, not a list of
 * empty category promises. The assertions below protect that purpose and the
 * universal site journey from category-specific defaults.
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { CATEGORIES } from "../src/content/routes";
import { editorialForCategory } from "../src/content/editorial";
import { shellJourneyFor } from "../src/content/journeys";
import { categoryCanMatch } from "../src/content/matcher-router";

const PAGE = readFileSync(
  fileURLToPath(new URL("../src/pages/guides/index.astro", import.meta.url)),
  "utf8",
);

const READER_COPY = PAGE
  .replace(/<style>[\s\S]*?<\/style>/g, "")
  .replace(/\{\/\*[\s\S]*?\*\/\}/g, "")
  .replace(/\/\*[\s\S]*?\*\//g, "");

describe("the approved buying-advice index stays useful", () => {
  it("has one clear job, complete metadata and collection schema", () => {
    expect(PAGE).toContain('const TITLE = "Robot Buying Advice & Guides | BotPlanet"');
    expect(PAGE).toContain("<h1>Know what matters before you buy</h1>");
    expect(PAGE).toContain("path={PATH}");
    expect(PAGE).toContain('ogImage="/media/guides/hero.webp"');
    expect(PAGE).toContain('type: "CollectionPage"');
    expect(PAGE).toContain("itemListSchema(");
  });

  it("uses responsive original artwork in the hero and every guide card", () => {
    expect(PAGE).toContain('src="/media/guides/hero.webp"');
    expect(PAGE).toContain("/media/guides/hero-360w.webp 360w");
    expect(PAGE).toContain('width="1672"');
    expect(PAGE).toContain('height="941"');
    expect(PAGE).toContain("srcset={srcsetFor(guide.image.src)}");
    expect(PAGE).toContain("width={imageSize?.width ?? 1672}");
  });

  it("lists only real published guides and no empty category cards", () => {
    const published = CATEGORIES.flatMap((category) =>
      editorialForCategory(category.slug).filter((guide) => guide.path.startsWith("/guides/")),
    );
    expect(published.length).toBeGreaterThan(0);
    expect(PAGE).toContain('filter((guide) => guide.path.startsWith("/guides/"))');
    expect(READER_COPY).not.toMatch(/coming soon|no guides published|nothing here yet/i);
  });

  it("keeps the page universal and free of a pool-cleaner default", () => {
    expect(shellJourneyFor("/guides/", { canMatch: categoryCanMatch })).toMatchObject({
      category: "universal",
      ctaLabel: "Find My Robot",
      href: "/botmatch/",
    });
    expect(READER_COPY).not.toMatch(/find my pool cleaner|pool-specific questions/i);
  });

  it("keeps the content centred and responsive", () => {
    expect(PAGE).toContain("max-width: 1440px;");
    expect(PAGE).toContain("margin: 0 auto;");
    expect(PAGE).toContain("text-align: center;");
    expect(PAGE).toContain("@media (max-width: 650px)");
  });
});
