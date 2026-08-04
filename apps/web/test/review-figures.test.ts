import { describe, expect, it } from "vitest";
import { injectFigures } from "../src/lib/review-figures";
import { REVIEWS } from "../src/content/reviews";
import { MEDIA_ASSETS, REVIEW_FIGURES_WITHHELD } from "../src/content/media/assets";
import { readFileSync } from "node:fs";

/* Compiled Markdown, near enough: Astro emits h2 elements with slug ids and
   paragraphs between them, which is all the injector cares about. */
const HTML =
  `<h2 id="who-this-is-for">Who this is for</h2><p>One.</p>` +
  `<h2 id="the-app">The app</h2><p>Two.</p>` +
  `<h2 id="filtration-and-the-maintenance-reality">Filtration and the maintenance reality</h2><p>Three.</p>`;

const A_REAL_FIGURE = "/media/reviews/dolphin-nautilus-cc-plus/app-control.webp";

describe("review figures", () => {
  it("puts a figure directly after the heading it names", () => {
    const out = injectFigures(HTML, [{ afterHeading: "The app", src: A_REAL_FIGURE }]);
    expect(out).toContain(`<h2 id="the-app">The app</h2><figure class="bp-figure">`);
  });

  it("takes alt text from the registry, never from the review file", () => {
    const asset = MEDIA_ASSETS.find((a) => a.src === A_REAL_FIGURE)!;
    const out = injectFigures(HTML, [{ afterHeading: "The app", src: A_REAL_FIGURE }]);
    expect(asset.altText.length).toBeGreaterThan(20);
    expect(out).toContain(`alt="${asset.altText.replace(/"/g, "&quot;")}"`);
  });

  it("emits a srcset, so a phone does not download the full-size creative", () => {
    const out = injectFigures(HTML, [{ afterHeading: "The app", src: A_REAL_FIGURE }]);
    expect(out).toMatch(/srcset="[^"]*-360w\.webp 360w/);
    expect(out).toContain("loading=\"lazy\"");
  });

  it("leaves the prose untouched when a figure names a heading that is not there", () => {
    const out = injectFigures(HTML, [{ afterHeading: "A heading nobody wrote", src: A_REAL_FIGURE }]);
    expect(out).toBe(HTML);
  });

  it("throws in dev rather than dropping a figure silently", () => {
    expect(() =>
      injectFigures(HTML, [{ afterHeading: "A heading nobody wrote", src: A_REAL_FIGURE }], true),
    ).toThrow(/not in the prose/);
    expect(() =>
      injectFigures(HTML, [{ afterHeading: "The app", src: "/media/nope.webp" }], true),
    ).toThrow(/not in the media registry/);
  });

  it("escapes a caption rather than letting it inject markup", () => {
    const out = injectFigures(HTML, [
      { afterHeading: "The app", src: A_REAL_FIGURE, caption: 'A <script>alert("x")</script> caption' },
    ]);
    expect(out).not.toContain("<script>");
    expect(out).toContain("&lt;script&gt;");
  });
});

describe("every declared figure actually lands", () => {
  /**
   * The real guard. A figure that names a heading the prose does not contain is
   * silently dropped in production — which is exactly how a review ends up with
   * pictures missing and nobody notices. This reads the actual Markdown.
   */
  it("names a heading that exists in the review's own prose", () => {
    for (const review of Object.values(REVIEWS)) {
      if (!review.figures?.length) continue;
      const md = readFileSync(`apps/web/src/reviews/${review.slug}.md`, "utf8");
      const headings = md
        .split("\n")
        .filter((l) => l.startsWith("## "))
        .map((l) => l.slice(3).trim().toLowerCase());

      for (const fig of review.figures) {
        expect(headings, `${review.slug}: "${fig.afterHeading}"`).toContain(
          fig.afterHeading.toLowerCase(),
        );
      }
    }
  });

  it("points every figure at an asset the registry holds", () => {
    for (const review of Object.values(REVIEWS)) {
      for (const fig of review.figures ?? []) {
        expect(MEDIA_ASSETS.some((a) => a.src === fig.src), `${review.slug}: ${fig.src}`).toBe(true);
      }
    }
  });
});

describe("creatives held back for contradicting the review", () => {
  /**
   * Three of the seven creatives supplied for the Nautilus print claims the
   * manufacturer's own specification denies. They are recorded rather than
   * quietly dropped, so nobody re-adds them later thinking a slot was missed.
   */
  it("records what each one claims and what it contradicts", () => {
    expect(REVIEW_FIGURES_WITHHELD.length).toBeGreaterThan(0);
    for (const w of REVIEW_FIGURES_WITHHELD) {
      expect(w.claim.length).toBeGreaterThan(10);
      expect(w.contradicts.length).toBeGreaterThan(30);
      expect(REVIEWS[w.productSlug]).toBeDefined();
    }
  });

  it("keeps every withheld creative out of the published figure list", () => {
    const published = Object.values(REVIEWS).flatMap((r) => r.figures ?? []).map((f) => f.src);
    // None of the withheld creatives were ever converted into the reviews
    // folder, so no published figure may share their supplied name.
    for (const w of REVIEW_FIGURES_WITHHELD) {
      const slug = w.supplied.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      expect(published.some((src) => src.includes(slug))).toBe(false);
    }
  });
});
