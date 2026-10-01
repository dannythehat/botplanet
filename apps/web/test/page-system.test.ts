/**
 * THE BOTPLANET PAGE SYSTEM, ENFORCED.
 *
 * Every page written as a page file (apps/web/src/content/pages/*.page.json) is
 * checked here against the rules in page-system/rules.ts and the schema in
 * page-system/schema.ts. A page that fails does not ship, which is the point:
 * layout, SEO and image rules are not guidance, they are tests.
 *
 * WHAT EACH BLOCK GUARDS, and the page it came from. The solar skimmer best-of
 * went live on 1 October 2026 and the owner's first reaction was that it was
 * "the worst page I have ever had the displeasure to view": a comparison table
 * with its buttons printed on top of another column, a hero that was a rough
 * collage, a six-column table squeezed into a 600px column, a contents block
 * halfway down the page, and wording nobody would say aloud. Each of those is a
 * rule below, so the next page cannot repeat it.
 */
import { existsSync, readFileSync } from "node:fs";
import sharp from "sharp";
import { describe, expect, it } from "vitest";
import { PAGE_FILES } from "../src/page-system/load";
import { BestOfPageSchema } from "../src/page-system/schema";
import {
  BANNED_PHRASES,
  HERO_DESKTOP,
  HERO_MOBILE,
  META_DESCRIPTION_MAX,
  MIN_BUY_BUTTONS,
  MIN_INTERNAL_LINKS_IN_PROSE,
  MIN_PROSE_WORDS,
  SEO_TITLE_MAX,
} from "../src/page-system/rules";
import { MEDIA_ASSETS } from "../src/content/media/assets";
import { PRODUCT_ID } from "../src/content/products";
import { REDIRECT_KEYS } from "../src/content/commerce/destinations";
import { routeFor } from "../src/content/routes";
import { keywordsFor } from "../src/content/seo/keyword-register";
import { EDITORIAL } from "../src/content/editorial";
import { REVIEWS } from "../src/content/reviews";

const PUBLIC = "apps/web/public";
/* A page exists if it is a registered route or a product review page, which are
   generated from the catalogue rather than listed in ROUTES. */
const pageExists = (href: string): boolean => {
  const clean = href.replace(/#.*$/, "");
  if (routeFor(clean)) return true;
  const m = clean.match(/^\/robots\/[a-z0-9-]+\/([a-z0-9-]+)\/$/);
  return Boolean(m && PRODUCT_ID[m[1]]);
};
const slugify = (h: string) =>
  h.toLowerCase().replace(/[^\w\s-]/g, "").trim().replace(/\s+/g, "-");

describe("the published schema file is current", () => {
  it("matches what the zod schema generates", async () => {
    const { zodToJsonSchema } = await import("zod-to-json-schema");
    const fresh = zodToJsonSchema(BestOfPageSchema, { name: "BestOfPage", $refStrategy: "none" });
    const onDisk = JSON.parse(readFileSync("docs/page-system/PAGE_SCHEMA.json", "utf8"));
    expect(onDisk, "run npm run page:schema").toEqual(JSON.parse(JSON.stringify(fresh)));
  });
});

describe("there is at least one page file, and the gold standard is one of them", () => {
  it("has the solar skimmer best-of as a page file", () => {
    expect(PAGE_FILES.map((p) => p.path)).toContain("/best-robots/robotic-pool-cleaners/solar-powered-skimmers/");
  });
});

for (const page of PAGE_FILES) {
  const prose = readFileSync(`apps/web/src/articles/${page.prose}.md`, "utf8");
  const everyWord = `${JSON.stringify(page)}\n${prose}`.toLowerCase();

  describe(`page file ${page.path}`, () => {
    it("meets the schema", () => {
      expect(BestOfPageSchema.safeParse(page).success).toBe(true);
    });

    it("has a route file that does nothing except render the page", () => {
      const file = `apps/web/src/pages${page.path.replace(/\/$/, "")}.astro`;
      const alt = `apps/web/src/pages${page.path}index.astro`;
      const f = existsSync(file) ? file : alt;
      expect(existsSync(f), `no route file at ${file}`).toBe(true);
      const src = readFileSync(f, "utf8");
      expect(src).toContain("BestOfPage");
      expect(src).toContain(`path="${page.path}"`);
      expect(src.split("\n").length, "a route file is a stub; the page lives in the page file").toBeLessThan(14);
    });

    it("is a registered, indexable route", () => {
      const r = routeFor(page.path);
      expect(r, "add it to content/routes.ts").toBeDefined();
      expect(r!.indexable).toBe(page.index);
      expect(r!.inSitemap).toBe(page.index);
    });

    it("has a hero at the one allowed size, with a registry record and real alt text", () => {
      return (async () => {
        const f = `${PUBLIC}${page.hero.desktop}`;
        expect(existsSync(f), `missing ${f}`).toBe(true);
        const m = await sharp(f).metadata();
        expect([m.width, m.height], "hero must be exactly the standard size").toEqual([
          HERO_DESKTOP.width,
          HERO_DESKTOP.height,
        ]);
        const rec = MEDIA_ASSETS.find((a) => a.src === page.hero.desktop);
        expect(rec, "the hero needs a record in content/media/assets.ts").toBeDefined();
        expect(rec!.altText && rec!.altText.length).toBeGreaterThan(40);
        if (page.hero.mobile) {
          const mf = `${PUBLIC}${page.hero.mobile}`;
          expect(existsSync(mf)).toBe(true);
          const mm = await sharp(mf).metadata();
          expect([mm.width, mm.height]).toEqual([HERO_MOBILE.width, HERO_MOBILE.height]);
          expect(MEDIA_ASSETS.find((a) => a.src === page.hero.mobile)).toBeDefined();
        }
      })();
    });

    it("has SEO text inside the search-result limits, and unique across the site", () => {
      expect(page.seo_title.length).toBeLessThanOrEqual(SEO_TITLE_MAX);
      expect(page.meta_description.length).toBeLessThanOrEqual(META_DESCRIPTION_MAX);
      const others = Object.values(EDITORIAL).filter((e) => e.path !== page.path);
      expect(others.map((e) => e.seoTitle)).not.toContain(page.seo_title);
      expect(others.map((e) => e.metaDescription)).not.toContain(page.meta_description);
      expect(Object.values(REVIEWS).map((r) => r.seoTitle)).not.toContain(page.seo_title);
    });

    it("targets the same keywords as the keyword register, and says them", () => {
      const reg = keywordsFor(page.path);
      expect(reg, "add the page to content/seo/keyword-register.ts").toBeDefined();
      expect(page.keywords.primary).toBe(reg!.primary.term);
      const regTerms = new Set([reg!.primary.term, ...reg!.secondary.map((s) => s.term)]);
      for (const t of page.keywords.secondary) expect(regTerms.has(t), `${t} is not in the register`).toBe(true);
      expect(`${page.title} ${page.seo_title}`.toLowerCase()).toContain(page.keywords.primary.split(" ").slice(-2).join(" "));
      for (const t of [page.keywords.primary, ...page.keywords.secondary]) {
        expect(everyWord, `"${t}" never appears on the page`).toContain(t.toLowerCase());
      }
    });

    it("is long enough, linked enough and structured", () => {
      const words = prose.split(/\s+/).filter(Boolean).length;
      expect(words).toBeGreaterThanOrEqual(MIN_PROSE_WORDS);
      const links = [...prose.matchAll(/\]\((\/[^)\s]*)\)/g)].map((m) => m[1]);
      expect(links.length).toBeGreaterThanOrEqual(MIN_INTERNAL_LINKS_IN_PROSE);
      for (const href of new Set(links)) {
        expect(pageExists(href), `${href} is not a registered page`).toBe(true);
      }
      const headings = [...prose.matchAll(/^## (.+)$/gm)].map((m) => slugify(m[1]));
      expect(headings.length).toBeGreaterThanOrEqual(4);
      expect(headings, "the glance table has to land inside a real section").toContain(page.glance.before_heading_id);
      expect(prose, "tables belong in components, not the narrow prose column").not.toMatch(/^\|.*\|$/m);
    });

    it("never uses wording the owner has rejected", () => {
      for (const { phrase, instead } of BANNED_PHRASES) {
        expect(everyWord.includes(phrase), `"${phrase}" — ${instead}`).toBe(false);
      }
    });

    it("names only real products, every one of which can be bought", () => {
      const picks = page.picks.map((p) => p.product);
      for (const s of picks) expect(page.comparison, `${s} is picked but not compared`).toContain(s);
      for (const s of page.comparison) {
        const id = PRODUCT_ID[s];
        expect(id, `${s} is not a catalogue product`).toBeDefined();
        expect(REDIRECT_KEYS[id], `${s} has no buy link`).toBeDefined();
        expect(Object.keys(page.glance.rows), `${s} has no glance row`).toContain(s);
      }
      for (const s of page.related.products) {
        expect(REDIRECT_KEYS[PRODUCT_ID[s]], `${s} has no buy link`).toBeDefined();
      }
      for (const l of page.related.links) expect(pageExists(l.href), `${l.href} is not a page`).toBe(true);
    });

    it("puts enough Amazon buttons on the page, counted from the page file", () => {
      const n = page.comparison.length;
      const buttons =
        (page.layout.quick_buy ? n : 0) + // under the hero
        page.picks.length + //               one per pick
        n + //                               comparison table
        n + //                               glance table
        n + //                               buy strip
        page.related.products.length; //     related robot cards
      expect(buttons).toBeGreaterThanOrEqual(MIN_BUY_BUTTONS);
    });

    it("lists its contents before its picks when it has four or more", () => {
      if (page.picks.length >= 4) expect(page.layout.contents_first).toBe(true);
    });

    it("carries a real publication date, so Article schema is emitted", () => {
      expect(page.dates.reviewed >= page.dates.published).toBe(true);
    });
  });
}
