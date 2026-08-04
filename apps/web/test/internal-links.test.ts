import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { applyInternalLinks } from "../src/lib/internal-linker";
import { CATEGORY_ANCHORS, anchorsFor, liveAnchorsFor } from "../src/content/internal-links";
import { REVIEWS } from "../src/content/reviews";
import { ROUTES } from "../src/content/routes";
import { productEditorial, catalogueStatusOf } from "../src/content/products";

const POOL = anchorsFor("robotic-pool-cleaners");

describe("internal link anchors", () => {
  it("links a phrase in body text", () => {
    const { html, applied } = applyInternalLinks("<p>It skips the waterline entirely.</p>", POOL);
    expect(html).toContain('<a href="/robots/robotic-pool-cleaners/#coverage"');
    expect(applied.some((a) => a.anchor.toLowerCase() === "waterline")).toBe(true);
  });

  it("links a phrase once, not every time it appears", () => {
    const { html } = applyInternalLinks(
      "<p>waterline</p><p>waterline</p><p>waterline</p>",
      POOL,
    );
    expect(html.match(/<a /g) ?? []).toHaveLength(1);
  });

  it("never links inside a heading", () => {
    const { html } = applyInternalLinks("<h2>The waterline question, first</h2>", POOL);
    expect(html).toBe("<h2>The waterline question, first</h2>");
  });

  it("never nests a link inside an existing one", () => {
    const src = '<p><a href="/x">a waterline guide</a></p>';
    expect(applyInternalLinks(src, POOL).html).toBe(src);
  });

  it("never links inside a figure caption", () => {
    const src = '<figure class="bp-figure"><figcaption>waterline</figcaption></figure>';
    expect(applyInternalLinks(src, POOL).html).toBe(src);
  });

  it("keeps the original casing of the phrase", () => {
    const { html } = applyInternalLinks("<p>BotMatch knows your pool.</p>", POOL);
    expect(html).toContain(">BotMatch</a>");
  });

  it("matches whole words only, hyphens included", () => {
    // "cordless" must not fire inside "semi-cordless-ish", and "above-ground"
    // must survive its own hyphen.
    const { html } = applyInternalLinks("<p>a semi-cordless-ish machine</p>", POOL);
    expect(html).not.toContain("<a ");
    const g = applyInternalLinks("<p>an above-ground pool</p>", POOL);
    expect(g.html).toContain(">above-ground</a>");
  });

  it("renders nothing for a planned anchor, so no link points at a 404", () => {
    const planned = POOL.filter((a) => a.status === "planned");
    expect(planned.length).toBeGreaterThan(0);
    for (const a of planned) {
      const { html } = applyInternalLinks(`<p>the ${a.anchor} question</p>`, POOL);
      expect(html).not.toContain(a.href);
    }
  });
});

describe("the anchor plan itself", () => {
  it("gives every anchor a written reason", () => {
    for (const list of Object.values(CATEGORY_ANCHORS)) {
      for (const a of list) expect(a.why.length).toBeGreaterThan(40);
    }
  });

  /**
   * A product page is not in ROUTES — those URLs are generated per product, so
   * the registry cannot list them. They are validated against the catalogue
   * instead, which is the real answer to "does this page exist": an anchor may
   * point at a product only if that product is still active.
   */
  const productSlug = (path: string) => /^\/robots\/[a-z0-9-]+\/([a-z0-9-]+)\/$/.exec(path)?.[1];
  const activeProduct = (slug: string) => {
    const p = productEditorial(slug);
    return Boolean(p && catalogueStatusOf(p.productId) === "active");
  };

  it("points every live anchor at a path the route registry knows", () => {
    const known = new Set(ROUTES.map((r) => r.path));
    for (const [cat, list] of Object.entries(CATEGORY_ANCHORS)) {
      for (const a of list.filter((x) => x.status === "live")) {
        const path = a.href.split("#")[0];
        const slug = productSlug(path);
        const ok = slug ? activeProduct(slug) : known.has(path);
        expect(ok, `${cat}: ${a.anchor} → ${path}`).toBe(true);
      }
    }
  });

  it("never sends a live anchor to a route that is not live", () => {
    const status = new Map(ROUTES.map((r) => [r.path, r.status]));
    for (const list of Object.values(CATEGORY_ANCHORS)) {
      for (const a of list.filter((x) => x.status === "live")) {
        const path = a.href.split("#")[0];
        const slug = productSlug(path);
        if (slug) {
          /* A withdrawn product keeps its record and loses its page, so an
             anchor pointing at one would be a live link to a redirect. */
          expect(activeProduct(slug), `${a.anchor} → ${path} is not an active product`).toBe(true);
          continue;
        }
        expect(status.get(path)).toBe("live");
      }
    }
  });

  it("declares no two live anchors competing for the same phrase", () => {
    for (const list of Object.values(CATEGORY_ANCHORS)) {
      const phrases = list.filter((a) => a.status === "live").map((a) => a.anchor.toLowerCase());
      expect(new Set(phrases).size).toBe(phrases.length);
    }
  });
});

describe("anchors against the real review prose", () => {
  /**
   * The point of declaring anchors as phrases that already exist is that they
   * link naturally. This proves at least some of them actually appear — an
   * anchor plan where nothing matches is a plan nobody checked.
   */
  it("finds live anchors in the review that would actually link", () => {
    for (const review of Object.values(REVIEWS)) {
      const md = readFileSync(`apps/web/src/reviews/${review.slug}.md`, "utf8").toLowerCase();
      const live = liveAnchorsFor(review.categorySlug);
      const present = live.filter((a) => md.includes(a.anchor.toLowerCase()));
      expect(present.length, `${review.slug} matched no declared anchor`).toBeGreaterThan(0);
    }
  });
});
