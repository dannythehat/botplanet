import { existsSync, readFileSync, readdirSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { MEDIA_ASSETS } from "../src/content/media/assets";
import { CATEGORIES, ROUTES } from "../src/content/routes";

/**
 * THE BUG THIS FILE EXISTS TO PREVENT, WHICH HAD ALREADY HAPPENED.
 *
 * On 9 August 2026 five diagram components were registered in MEDIA_ASSETS,
 * described in alt text, carried through the schema helpers — and rendered on
 * ZERO pages. They had been built for pages that were later restructured, and
 * nothing anywhere noticed, because a registry entry looks exactly the same
 * whether or not a reader can ever see the thing it describes.
 *
 * That is worse than an unused file. MEDIA_ASSETS is the site's answer to "what
 * pictures does BotPlanet publish", and it was answering with five it did not.
 *
 * So: a diagram is registered when it renders, and not before.
 */

const SRC = "apps/web/src";

/**
 * `educational_diagram` COVERS TWO DIFFERENT THINGS and this test only wants
 * one of them. The type is also carried by supplied artwork that teaches — a
 * hard-floor card on the vacuum hub, the Enabot range shot — which are real
 * image files with a checksum, a product they depict and, quite properly, more
 * than one page they appear on. The assertions below are about INLINE SVG
 * COMPONENTS, which have no file, are drawn by us, and depict nobody's machine.
 * The `.astro` src is what separates them, and it is not a heuristic: a record
 * whose src is a component IS a component.
 */
const DIAGRAMS = MEDIA_ASSETS.filter(
  (a) => a.type === "educational_diagram" && a.src.endsWith(".astro"),
);

/** Every .astro under src, read once — the diagrams are used from pages and
 *  from HubDiagram, and both are just files that import a component. */
function allSources(dir: string): string[] {
  const out: string[] = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = `${dir}/${entry.name}`;
    if (entry.isDirectory()) out.push(...allSources(path));
    else if (entry.name.endsWith(".astro") || entry.name.endsWith(".ts")) out.push(path);
  }
  return out;
}

const SOURCES = allSources(SRC)
  /* The registry names every diagram by path, so reading it back would make
     every test below pass on its own contents. */
  .filter((p) => !p.endsWith("content/media/assets.ts"))
  .map((p) => ({ path: p, text: readFileSync(p, "utf8") }));

describe("every registered diagram is on a page", () => {
  it("registers at least the diagrams we know about", () => {
    expect(DIAGRAMS.length).toBeGreaterThanOrEqual(10);
  });

  it("points every registry entry at a component that exists", () => {
    for (const d of DIAGRAMS) {
      expect(existsSync(`${SRC}/${d.src}`), `${d.id}: ${d.src} is not a file`).toBe(true);
    }
  });

  it("imports every registered diagram somewhere", () => {
    const orphans = DIAGRAMS.filter((d) => {
      const file = d.src.split("/").pop()!;
      const importer = SOURCES.some(
        (s) => !s.path.endsWith(`/${file}`) && s.text.includes(`/${file}`),
      );
      return !importer;
    }).map((d) => `${d.id} (${d.src})`);

    expect(
      orphans,
      "registered as a published diagram and rendered on no page — either place it or drop the record",
    ).toEqual([]);
  });

  /**
   * A DIAGRAM SHOWN TWICE ON ONE JOURNEY IS PADDING. The hub-to-guide walk is
   * the commonest path through this site, and meeting the same drawing on both
   * ends teaches nothing the second time. One home each, enforced.
   */
  it("gives every diagram exactly one home", () => {
    const doubled: string[] = [];
    for (const d of DIAGRAMS) {
      const file = d.src.split("/").pop()!;
      const importers = SOURCES.filter(
        (s) => !s.path.endsWith(`/${file}`) && s.text.includes(`/${file}`),
      );
      if (importers.length > 1) doubled.push(`${d.id}: ${importers.map((i) => i.path).join(", ")}`);
    }
    expect(doubled, "imported by more than one file").toEqual([]);
  });

  it("writes alt text on every one, because an SVG has no filename to fall back on", () => {
    for (const d of DIAGRAMS) {
      expect(d.altText.length, `${d.id} has thin alt text`).toBeGreaterThan(40);
      expect(d.altTextStatus).toBe("approved");
    }
  });

  /**
   * ORIGINAL WORK, NOT A PRODUCT SHOT. These are drawn by BotPlanet and depict
   * no manufacturer's machine, which is what lets them carry a claim at all. A
   * diagram that ever claimed to depict a real product would need an exactModel
   * and a source, and would stop being something we may simply publish.
   */
  it("claims no product and no photograph", () => {
    for (const d of DIAGRAMS) {
      expect(d.depictsRealProduct, `${d.id} claims to depict a real product`).toBe(false);
      expect(d.productId, `${d.id} is attached to a product`).toBeNull();
      expect(d.exactModel).toBeNull();
    }
  });
});

describe("the hub diagram picks by category", () => {
  const hub = readFileSync(`${SRC}/components/diagrams/HubDiagram.astro`, "utf8");
  const slugs = [...hub.matchAll(/category === "([a-z0-9-]+)"/g)].map((m) => m[1]);

  it("names only categories that have a live hub", () => {
    const live = CATEGORIES.map((c) => c.slug).filter((slug) =>
      ROUTES.some((r) => r.path === `/robots/${slug}/` && r.status === "live"),
    );
    expect(slugs.length).toBeGreaterThan(0);
    for (const slug of slugs) {
      expect(live, `HubDiagram draws for "${slug}", which has no live hub`).toContain(slug);
    }
  });

  it("gives a category at most one diagram", () => {
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  /* A hub with no diagram renders nothing. That is the correct default and it
     is worth pinning: the temptation on a thin category is to reach for a
     generic drawing, and a generic drawing is decoration. */
  it("renders nothing for a category it does not know", () => {
    expect(slugs).not.toContain("companion-robots");
    /* The template only, below the frontmatter — the docblock above it argues
       for this behaviour in prose and would otherwise fail the check that
       enforces it. */
    const template = hub.slice(hub.lastIndexOf("---") + 3);
    expect(template).not.toMatch(/else|fallback|default|\?\?/i);
  });
});

describe("the prose split cannot silently drop a diagram", () => {
  const editorial = readFileSync(`${SRC}/components/EditorialArticle.astro`, "utf8");

  /**
   * splitAt names a HEADING ID. Rename the heading in the Markdown and the cut
   * never happens — which is the safe failure, because the diagram disappears
   * rather than landing in the middle of an argument it does not illustrate.
   * This pins that behaviour so nobody "fixes" it into a fuzzy match later.
   */
  it("skips a heading it cannot find rather than guessing at one", () => {
    expect(editorial).toContain("if (at === -1) continue;");
  });

  it("keeps the slots static, because Astro requires it", () => {
    expect(editorial).toContain('slot name="diagram-1"');
    expect(editorial).not.toMatch(/slot name=\{/);
  });

  /* Each page passes its diagrams in the same order as splitAt, so a page that
     declares more cut points than the template has slots would silently lose
     the last one. */
  it("declares a slot for every cut the pages actually ask for", () => {
    const slotCount = [...editorial.matchAll(/slot name="diagram-(\d+)"/g)].length;
    const most = Math.max(
      ...SOURCES.filter((s) => s.text.includes("splitAt={[")).map(
        (s) => (s.text.match(/splitAt=\{\[(.*?)\]\}/s)?.[1].match(/"/g)?.length ?? 0) / 2,
      ),
      0,
    );
    expect(most).toBeLessThanOrEqual(slotCount);
  });
});
