import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { applyInternalLinks } from "../src/lib/internal-linker";
import { CATEGORY_ANCHORS, anchorsFor, liveAnchorsFor } from "../src/content/internal-links";
import { REVIEWS } from "../src/content/reviews";
import { ROUTES } from "../src/content/routes";
import { productEditorial, catalogueStatusOf, PRODUCT_ID } from "../src/content/products";
import { EDITORIAL } from "../src/content/editorial";

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

  /**
   * Does the repo know this slug is a real, sellable product?
   *
   * WIDENED 6 August 2026, when the window reviews shipped. This used to
   * require a PRODUCTS entry — the pool-era editorial map — and every window
   * product failed it despite being published in D1 with verified
   * specifications since 5 August. The test was asserting "has pool-style
   * editorial", not "is an active product", and the two stopped being the same
   * thing the moment a second category arrived whose editorial lives in
   * reviews.ts instead.
   *
   * PRODUCT_ID is the right existence check: it is the slug-to-D1 join map
   * every category has to appear in, whatever shape its editorial takes.
   */
  const activeProduct = (slug: string) => {
    const productId = PRODUCT_ID[slug] ?? productEditorial(slug)?.productId;
    return Boolean(productId && catalogueStatusOf(productId) === "active");
  };

  /**
   * Not every page under /robots/<category>/ is a product.
   *
   * The Enabot range page lives at /robots/pet-camera-robots/enabot/ because
   * that is where a reader searching the brand expects it, and it is editorial
   * — no catalogue row, no buy button, 9,900/mo. Both checks below read a path
   * in that shape as a product slug and refused the first anchor pointing at
   * it, which is the right instinct and the wrong answer.
   */
  const editorialPath = (path: string) => Boolean(EDITORIAL[path]);

  it("points every live anchor at a path the route registry knows", () => {
    const known = new Set(ROUTES.map((r) => r.path));
    for (const [cat, list] of Object.entries(CATEGORY_ANCHORS)) {
      for (const a of list.filter((x) => x.status === "live")) {
        const path = a.href.split("#")[0];
        const slug = productSlug(path);
        const ok = editorialPath(path) || (slug ? activeProduct(slug) : known.has(path));
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
        if (editorialPath(path)) continue;
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

describe("phrases that wrap across a line", () => {
  /* Markdown keeps the author's line breaks inside a paragraph. A multi-word
     anchor that happened to wrap in the source arrived as "Dolphin\nNautilus
     CC Plus" and silently did not link — silently, because the page still
     rendered perfectly and only the link was missing. Found on the live
     Polaris review. The longer the anchor, the likelier it was to happen. */
  it("links a multi-word phrase broken by a newline", () => {
    const src = "<p>Unlike the corded Dolphin\nNautilus CC Plus, which does not.</p>";
    const { html, applied } = applyInternalLinks(src, POOL);
    expect(html).toContain('href="/robots/robotic-pool-cleaners/dolphin-nautilus-cc-plus/"');
    expect(applied.some((a) => a.anchor.includes("Nautilus"))).toBe(true);
  });

  it("keeps the reader's own line break inside the link text", () => {
    const { html } = applyInternalLinks("<p>the Dolphin\nNautilus CC Plus today</p>", POOL);
    expect(html).toMatch(/>Dolphin\s+Nautilus CC Plus</);
  });

  it("still refuses to match across a word boundary it should not", () => {
    // "compare" must not fire inside "comparefoo", newline handling or not.
    const { html } = applyInternalLinks("<p>comparefoo and\ncomparebar</p>", POOL);
    expect(html).not.toContain("<a ");
  });

  it("drops an anchor that points at the page being rendered", () => {
    const src = "<p>The Polaris FREEDOM is cordless.</p>";
    const self = "/robots/robotic-pool-cleaners/polaris-freedom/";
    expect(applyInternalLinks(src, POOL, self).html).not.toContain("polaris-freedom");
    // ...and still links it from any other page.
    expect(applyInternalLinks(src, POOL).html).toContain("polaris-freedom");
  });
});

describe("a product anchor points at the product it names", () => {
  /**
   * THE REGRESSION THIS EXISTS FOR, found by crawling the live site on
   * 8 August 2026 rather than by any test here.
   *
   * Three WINBOTs were merged into siblings on 7 August and their anchors were
   * repointed with them — correct at the time. When the merge was reversed the
   * next day and each got its page back, this file was not touched, so
   * "WINBOT W3 Omni" went on sending the W3 Omni's own name to the W2 PRO
   * Omni's page. Every existing check passed: the href was a real path, the
   * route was live, the product was active. It was simply the wrong machine.
   *
   * The rule that catches it: an anchor naming a product must appear in that
   * product's own review title. "WINBOT W3 Omni" is not a substring of
   * "ECOVACS WINBOT W2 PRO Omni review", so the bad link fails here.
   */
  const norm = (x: string) => x.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
  const slugOf = (path: string) => /^\/robots\/[a-z-]+\/([a-z0-9-]+)\/$/.exec(path)?.[1] ?? null;
  const isEditorial = (path: string) => Boolean(EDITORIAL[path]);

  it("never sends a product's name to a different product's page", () => {
    /* Only anchors that NAME a machine are judged. "iAquaLink" and "sun ledge"
       point at product pages and name a feature, not a product; they are left
       alone. The failure this catches is narrower and worse — an anchor that
       matches some OTHER product's title and not the one it points at. */
    const titles = Object.entries(REVIEWS).map(([slug, r]) => ({
      slug,
      hay: `${norm(r.title)} ${norm(slug)}`,
    }));
    const wrong: string[] = [];

    for (const [cat, list] of Object.entries(CATEGORY_ANCHORS)) {
      for (const a of list.filter((x) => x.status === "live")) {
        const path = a.href.split("#")[0];
        const slug = slugOf(path);
        if (!slug || isEditorial(path)) continue;

        const key = norm(a.anchor);
        const target = titles.find((t) => t.slug === slug);
        if (!target || target.hay.includes(key)) continue;

        const elsewhere = titles.filter((t) => t.hay.includes(key)).map((t) => t.slug);
        if (elsewhere.length) {
          wrong.push(`${cat}: "${a.anchor}" → ${slug}, but it names ${elsewhere.join(" / ")}`);
        }
      }
    }
    expect(wrong).toEqual([]);
  });
});
