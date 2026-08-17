import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { shellJourneyFor } from "../src/content/journeys";
import { categoryCanMatch } from "../src/content/matcher-router";

const PAGE = readFileSync(
  fileURLToPath(new URL("../src/pages/botmatch/index.astro", import.meta.url)),
  "utf8",
);
const MATCHER = readFileSync(
  fileURLToPath(new URL("../src/components/BotMatcher.astro", import.meta.url)),
  "utf8",
);
const API = readFileSync(
  fileURLToPath(new URL("../src/pages/api/botmatch.ts", import.meta.url)),
  "utf8",
);

describe("owner-approved universal BotMatch page", () => {
  it("keeps the whole shell universal rather than reverting to pool", () => {
    const journey = shellJourneyFor("/botmatch/", { canMatch: categoryCanMatch });
    expect(journey?.category).toBe("universal");
    expect(journey?.ctaLabel).toBe("Find My Robot");
    expect(journey?.href).toBe("/botmatch/");
  });

  it("uses clear search metadata and the actual primary phrase", () => {
    expect(PAGE).toContain('const TITLE = "Find Your Robot with BotMatch | BotPlanet"');
    expect(PAGE).toContain('"Find your robot with BotMatch.');
    expect(PAGE).toContain('path={PATH}');
    expect(PAGE).toContain('ogImage="/media/botmatch/finder-universal.webp"');
    expect(PAGE).toContain('name: TITLE');
    expect(PAGE).toContain('description: DESCRIPTION');
  });

  it("uses the dedicated BotMatch artwork with meaningful alt text", () => {
    expect(PAGE).toContain("/media/botmatch/finder-universal.webp");
    expect(PAGE).toContain("/media/botmatch/explainer-desktop.webp");
    expect(PAGE).toContain("/media/botmatch/explainer-mobile.webp");
    expect(PAGE).toContain("srcset={srcsetFor(");
    expect(PAGE.match(/alt="/g)?.length).toBe(2);
  });

  it("does not emit invisible FAQ schema or internal roadmap language", () => {
    expect(PAGE).not.toContain("faqPageSchema");
    expect(PAGE).not.toMatch(/\d+ of the \{?categories\.length\}? categories/);
    expect(PAGE).not.toMatch(/test in the repository|fails the build/i);
    expect(PAGE).not.toMatch(/categories (are )?live/i);
  });

  it("makes email genuinely optional and shows results without a lead submission", () => {
    expect(MATCHER).toContain("data-skip-email");
    expect(MATCHER).toContain("Skip email — show my result");
    expect(MATCHER).toContain('track("matcher_result_without_email")');
    const skipHandler = MATCHER.slice(
      MATCHER.indexOf('q<HTMLElement>("[data-skip-email]")'),
      MATCHER.indexOf("/* ---------- done: one block per category ---------- */"),
    );
    expect(skipHandler).toContain("renderResults()");
    expect(skipHandler).toContain('show("done")');
    expect(skipHandler).not.toContain("/api/matcher-lead");
  });

  it("shows a real thinking state after the final answer", () => {
    expect(MATCHER).toContain('data-stage="analysing"');
    expect(MATCHER).toContain("bp-mm__thinking");
    expect(MATCHER).toContain('role="status"');
    expect(MATCHER).toContain('aria-live="polite"');
    expect(MATCHER).toContain("BotMatch is comparing your answers");
    expect(MATCHER).toContain("bp-mm__thinking-orbit");
    expect(MATCHER).toContain("@media (prefers-reduced-motion: reduce)");
  });

  it("renders every recommendation as a visual product destination", () => {
    expect(MATCHER).toContain("bp-mm__product-card");
    expect(MATCHER).toContain("bp-mm__product-image");
    expect(MATCHER).toContain("bp-mm__product-button");
    expect(MATCHER).toContain("View product");
    expect(MATCHER).toContain("result.product");
    expect(MATCHER).toContain("result.equivalentProducts");
    expect(API).toContain('import { productPath } from "../../content/routes"');
    expect(API).toContain('import { resolveImage } from "../../lib/media-registry"');
    expect(API).toMatch(/resolveImage\(\s*product\.id,\s*"listing_card"/);
    expect(API).toContain("url: productPath(product.slug, cat.slug)");
    expect(API).toContain("equivalentProducts");
  });

  it("keeps the owner-approved trust promises visible", () => {
    for (const promise of [
      "Money stays out of scoring",
      "A tie stays a tie",
      "No fake comparison",
      "Email is optional",
    ]) {
      expect(PAGE).toContain(promise);
    }
  });
});
