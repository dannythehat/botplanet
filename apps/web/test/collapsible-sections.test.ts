/* ============================================================
   The folded sections have one failure mode worth a test suite:
   doing nothing at all.

   A fold is named by heading id. Reword the heading, and the id
   changes, and the fold silently stops matching. The page still
   renders — it is just twice as tall as it was yesterday, with no
   error anywhere to say why. That is precisely the bug nobody
   catches by looking, because the page looks fine; it just looks
   fine for four more screens than it should.

   So the first test here is the one that matters: every fold
   declared in content/reviews.ts must correspond to a real heading
   in that review's Markdown. The rest check that folding is
   lossless — no word may be dropped by being put behind a door.
   ============================================================ */
import { describe, it, expect } from "vitest";
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import GithubSlugger from "github-slugger";
import { foldSections } from "../src/lib/collapsible-sections";
import { REVIEWS } from "../src/content/reviews";

const here = dirname(fileURLToPath(import.meta.url));
const reviewsDir = join(here, "..", "src", "reviews");

/** The `## ` headings of a review, slugged the way Astro's pipeline slugs them. */
function headingIds(markdown: string): { id: string; text: string }[] {
  const slugger = new GithubSlugger();
  const body = markdown.replace(/^---\n[\s\S]*?\n---\n/, "");
  return [...body.matchAll(/^##\s+(.+)$/gm)].map((m) => ({
    text: m[1].trim(),
    id: slugger.slug(m[1].trim()),
  }));
}

/** Visible words, with all markup removed — for checking nothing was lost. */
const words = (html: string) =>
  html
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

describe("every declared fold matches a real heading", () => {
  for (const [slug, review] of Object.entries(REVIEWS)) {
    const file = join(reviewsDir, `${slug}.md`);
    if (!existsSync(file)) continue;

    const ids = headingIds(readFileSync(file, "utf8"));

    it(`${slug}: fold ids exist in the prose`, () => {
      const present = new Set(ids.map((h) => h.id));
      for (const fold of review.folds ?? []) {
        expect(
          present.has(fold.id),
          `"${fold.id}" is not a heading in ${slug}.md. Headings are: ${[...present].join(", ")}`,
        ).toBe(true);
      }
    });

    it(`${slug}: every fold has a teaser that says something`, () => {
      for (const fold of review.folds ?? []) {
        /* "Read more" is not a teaser. A reader has to be able to decide NOT
           to open it, which takes an actual sentence. */
        expect(fold.teaser.length, `${fold.id} teaser is too short`).toBeGreaterThan(24);
        expect(fold.teaser).not.toMatch(/^(read|learn|find out|click|see) more/i);
      }
    });

    it(`${slug}: leaves the majority of the review open`, () => {
      /* Folding is a tool for detail, not a way to turn a review into an
         accordion. If more than half the sections ship shut, the page has
         stopped being an article. */
      const folded = (review.folds ?? []).length;
      expect(folded).toBeLessThanOrEqual(Math.floor(ids.length / 2));
    });
  }
});

describe("foldSections", () => {
  const doc =
    `<h2 id="one">One</h2><p>First body.</p>` +
    `<h2 id="two">Two</h2><p>Second body.</p><ul><li>a</li></ul>` +
    `<h2 id="three">Three</h2><p>Third body.</p>`;

  it("wraps only the named section", () => {
    const { html, folded } = foldSections(doc, [{ id: "two", teaser: "The middle one." }]);
    expect(folded).toEqual(["two"]);
    expect(html.match(/<details/g)).toHaveLength(1);
    expect(html).toContain('<details class="bp-fold" id="two-fold">');
  });

  it("keeps the section's own content and nothing else inside it", () => {
    const { html } = foldSections(doc, [{ id: "two", teaser: "The middle one." }]);
    const body = html.match(/<div class="bp-fold__body">([\s\S]*?)<\/div><\/details>/)![1];
    expect(body).toContain("Second body.");
    expect(body).not.toContain("First body.");
    expect(body).not.toContain("Third body.");
  });

  it("loses no words — the point is disclosure, not deletion", () => {
    const { html } = foldSections(doc, [
      { id: "one", teaser: "The first one." },
      { id: "three", teaser: "The last one." },
    ]);
    /* Teasers are additions, so the check is that the original text survives
       rather than that the two strings are equal. */
    for (const w of words(doc).split(" ")) expect(words(html)).toContain(w);
  });

  it("keeps the heading a real h2 with its id, so the outline is unchanged", () => {
    const { html } = foldSections(doc, [{ id: "two", teaser: "The middle one." }]);
    expect(html).toMatch(/<summary[^>]*><h2 id="two"[^>]*>Two<\/h2>/);
    /* Every id in the source is still an id in the output — anchors and the
       contents list keep working. */
    for (const id of ["one", "two", "three"]) expect(html).toContain(`id="${id}"`);
  });

  it("folds the last section, which runs to the end of the document", () => {
    const { html } = foldSections(doc, [{ id: "three", teaser: "The last one." }]);
    expect(html).toMatch(/<div class="bp-fold__body"><p>Third body\.<\/p><\/div><\/details>$/);
  });

  it("is a no-op with no folds declared", () => {
    expect(foldSections(doc, []).html).toBe(doc);
    expect(foldSections(doc).html).toBe(doc);
  });

  it("throws in strict mode on an id that is not in the document", () => {
    expect(() => foldSections(doc, [{ id: "four", teaser: "Does not exist." }], true)).toThrow(
      /no <h2 id/,
    );
  });

  it("stays quiet outside strict mode, so a live page never 500s over a fold", () => {
    const { html, folded } = foldSections(doc, [{ id: "four", teaser: "Does not exist." }]);
    expect(folded).toEqual([]);
    expect(html).toBe(doc);
  });

  it("copies an escaped id through unchanged rather than double-escaping it", () => {
    /* The id is read out of an attribute, so it arrives already escaped.
       Escaping it again would rewrite the id and break the anchor the fold
       exists to keep working. */
    const odd = `<h2 id="a&quot;b">X</h2><p>y</p>`;
    const { html } = foldSections(odd, [{ id: "a&quot;b", teaser: "An escaped id." }]);
    expect(html).toContain('id="a&quot;b-fold"');
    expect(html).toContain('<h2 id="a&quot;b"');
    expect(html).not.toContain("&amp;quot;");
  });
});
