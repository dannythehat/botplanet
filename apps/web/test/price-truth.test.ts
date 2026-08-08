/**
 * Guards for the three price and catalogue faults found in the audit of
 * 6 August 2026. Each one is here because it actually happened, and each
 * assertion is the cheapest thing that would have caught it.
 *
 * 1. A listing card published a retired product's price. `prod-dolphin-premier`
 *    changed product on 3 August — Dolphin Premier out, BuBlue Bubot 800P in —
 *    and its offer rows did not follow. The category hub read those rows
 *    directly and printed $1,299 against a machine the checker had read at
 *    $799.97. Two price paths existed and only the review's was honest.
 *
 * 2. The seeded Beatbot price disagreed with the published review: $2,499
 *    against $2,299. The review was right.
 *
 * 3. The seed file could not be applied to a fresh database at all. Offers
 *    existed for the Aiper Scuba V3 and the Dolphin Proteus DX4 Plus; product
 *    rows did not, so the insert died on a foreign-key constraint and a rebuilt
 *    environment would have come up missing two products and two reviews.
 */
import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { pool } from "@botplanet/db/seed";

const { productRows, categoryRows, brandRows, offerRows } = pool;
import { cataloguePrices, checkedNote } from "../src/lib/catalogue-prices";
import { availabilityFor, productSchema, reviewSchema } from "../src/lib/seo";

const PAGES = fileURLToPath(new URL("../src/pages/", import.meta.url));
const read = (rel: string) => readFileSync(`${PAGES}${rel}`, "utf8");

describe("seed referential integrity", () => {
  /**
   * FAULT 3, made impossible. This is the assertion that would have failed on
   * the commit that added the offers, five days before anyone noticed.
   */
  it("every offer names a product the seed actually creates", () => {
    const ids = new Set(productRows.map((p) => p.id));
    const orphans = offerRows.filter((o) => !ids.has(o.productId as string));
    expect(
      orphans.map((o) => `${o.id} → ${o.productId}`),
      "an offer references a product row the seed does not insert; a fresh database will fail on FOREIGN KEY",
    ).toEqual([]);
  });

  it("every product names a brand and a category the seed creates", () => {
    const brands = new Set(brandRows.map((b) => b.id));
    const cats = new Set(categoryRows.map((c) => c.id));
    for (const p of productRows) {
      expect(brands.has(p.brandId as string), `${p.id} has unknown brand ${p.brandId}`).toBe(true);
      expect(cats.has(p.categoryId as string), `${p.id} has unknown category ${p.categoryId}`).toBe(true);
    }
  });

  it("gives every published product a unique id and slug", () => {
    const ids = productRows.map((p) => p.id);
    const slugs = productRows.map((p) => p.slug);
    expect(new Set(ids).size).toBe(ids.length);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  /**
   * FAULT 1's other half. The record holds a BuBlue; a "3-year" term and a
   * four-figure price were the Dolphin Premier's and outlived it.
   */
  it("carries the BuBlue's own price and warranty on the record that now holds it", () => {
    const bubot = offerRows.filter((o) => o.productId === "prod-dolphin-premier");
    expect(bubot.length).toBeGreaterThan(0);
    for (const o of bubot) {
      // 79997 minor units — read from Klarvue on 2026-08-04, identity confirmed.
      expect(o.basePriceMinor, "the Dolphin Premier's price is back").toBe(79997);
      expect(o.warrantySummary).toBe("1-year");
    }
  });

  it("carries the Beatbot price the review was already publishing", () => {
    for (const o of offerRows.filter((o) => o.productId === "prod-beatbot-aquasense-2-ultra")) {
      expect(o.basePriceMinor).toBe(229900);
    }
  });
});

describe("one price path", () => {
  /**
   * FAULT 1, made impossible. A listing surface must not read the seeded offer
   * price — that figure has no check date and no freshness gate. Prices on a
   * card come from `refresh_observations` through lib/catalogue-prices.ts, or
   * they do not appear.
   *
   * The buy box and the review page are deliberately NOT covered: they go
   * through the offer-truth engine, which reads the same observations and
   * applies the publication gates on top.
   */
  it.each([
    "robots/[category]/index.astro",
    "compare/[category].astro",
  ])("%s does not read a seeded offer price", (page) => {
    const src = read(page);
    expect(src, `${page} reads offers.basePriceMinor directly`).not.toMatch(/basePriceMinor/);
    expect(src, `${page} still queries the offers table for display`).not.toMatch(/schema\.offers/);
  });

  it("shows a price only where a dated, accepted, priced reading exists", async () => {
    const rows = [
      { product_id: "p-priced", asin: "A1", checked_date: "2026-08-04", provider_id: "x", price_minor: 79997, currency: "USD", accepted: 1, identity_confirmed: 1, match_evidence: "e" },
      // Accepted, but the listing exposed no price. Not an offer.
      { product_id: "p-nullprice", asin: "A2", checked_date: "2026-08-04", provider_id: "x", price_minor: null, currency: "USD", accepted: 1, identity_confirmed: 1, match_evidence: "e" },
      // Newer reading for the same product must win.
      { product_id: "p-priced", asin: "A1", checked_date: "2026-08-06", provider_id: "x", price_minor: 74900, currency: "USD", accepted: 1, identity_confirmed: 1, match_evidence: "e" },
    ];
    const db = {
      prepare: () => ({ all: async () => ({ results: rows }), bind: () => ({ first: async () => null }) }),
    } as unknown as D1Database;

    const out = await cataloguePrices(db);
    expect(out.get("p-priced")).toEqual({ priceMinor: 74900, checkedDate: "2026-08-06" });
    expect(out.has("p-nullprice"), "a reading with no price became a price").toBe(false);
  });

  it("renders nothing rather than something old when D1 is unreachable", async () => {
    const db = {
      prepare: () => ({ all: async () => { throw new Error("D1 down"); } }),
    } as unknown as D1Database;
    // Fail closed. No price on a card is a small loss; a wrong price is not.
    expect((await cataloguePrices(db)).size).toBe(0);
  });

  it("puts the check date beside the figure", () => {
    expect(checkedNote("2026-08-04")).toBe("Checked 4 Aug 2026 · confirm at retailer");
    // A malformed date must not render "Checked Invalid Date".
    expect(checkedNote("not-a-date")).toBe("Checked at the retailer");
  });
});

/**
 * FAULT 4, found 8 August 2026 in the sitewide SEO audit and fixed the same
 * day. Every review page emitted `itemReviewed: { name, brand }` and nothing
 * else — no sku, no image, no URL, no offer. productSchema() had existed since
 * launch to say all of it and nothing had ever called it, so 38 shopping pages
 * described what they sold to a search engine as a bare string.
 *
 * The reason it needs a price test rather than an SEO one: the fix puts a
 * price into markup, which is the one place the site is strictest. Structured
 * data saying $329 while the page says the price is not current is the same
 * untruth told to a machine instead of a reader, and it is worth more to the
 * site than any rich result. So the page passes an offer here on EXACTLY the
 * condition it prints one — publicationFor(offer).priceShowable — and these
 * assertions cover what the builder does with what it is given.
 */
describe("product markup carries no price the page would not print", () => {
  const build = (offers: Parameters<typeof productSchema>[0]["offers"]) =>
    productSchema({
      name: "HOBOT 2S",
      slug: "hobot-2s",
      path: "/robots/window-cleaning-robots/hobot-2s/",
      brand: "HOBOT",
      description: "d",
      offers,
    });

  it("emits no offers node at all when nothing is publishable", () => {
    expect(build([]).offers).toBeUndefined();
    expect(build([{ priceMinor: null, url: "/x/" }]).offers).toBeUndefined();
  });

  it("emits the price it was given, in major units, to two places", () => {
    const o = build([{ priceMinor: 32900, url: "/x/" }]).offers as Record<string, unknown>;
    expect(o.price).toBe("329.00");
    expect(o.priceCurrency).toBe("USD");
  });

  /**
   * Availability used to default to InStock, which invents the fact the offer
   * engine keeps a separate gate for. A price can be current while the stock
   * state is unknown, and saying InStock there is a claim nobody checked.
   */
  it("omits availability rather than assuming InStock", () => {
    const o = build([{ priceMinor: 32900, url: "/x/" }]).offers as Record<string, unknown>;
    expect(o.availability).toBeUndefined();
    const known = build([{ priceMinor: 32900, url: "/x/", availability: "InStock" }])
      .offers as Record<string, unknown>;
    expect(known.availability).toBe("https://schema.org/InStock");
  });

  it("maps every stock state the engine can produce, and refuses the ones it cannot", () => {
    expect(availabilityFor("in_stock")).toBe("InStock");
    expect(availabilityFor("low_stock")).toBe("LimitedAvailability");
    expect(availabilityFor("preorder")).toBe("PreOrder");
    expect(availabilityFor("backorder")).toBe("BackOrder");
    expect(availabilityFor("temporarily_unavailable")).toBe("OutOfStock");
    expect(availabilityFor("unavailable")).toBe("OutOfStock");
    // Neither of these is a state anybody read off a listing.
    expect(availabilityFor("unknown")).toBeNull();
    expect(availabilityFor("seller_specific")).toBeNull();
  });

  it("never writes an empty sku or brand", () => {
    const bare = productSchema({ name: "X", slug: "", path: "/p/", brand: "", description: "", offers: [] });
    expect("sku" in bare).toBe(false);
    expect("brand" in bare).toBe(false);
    expect("description" in bare).toBe(false);
    expect(bare.url).toBe("https://botplanet.io/p/");
  });

  /**
   * The gate itself. The page must not have a second, looser condition for the
   * markup than for the visible card — one flag, read once, used twice.
   */
  it("gates the review page's markup on priceShowable", () => {
    const src = read("robots/[category]/[slug].astro");
    expect(src).toMatch(/offers:\s*engineOffers[\s\S]{0,200}pub\.priceShowable/);
  });

  it("gives the review a full Product to review", () => {
    const r = reviewSchema({
      itemName: "HOBOT 2S",
      itemBrand: "HOBOT",
      itemSlug: "hobot-2s",
      headline: "h",
      description: "d",
      path: "/robots/window-cleaning-robots/hobot-2s/",
      authorName: "Danny",
      authorPath: "/about/",
      reviewBody: "v",
      offers: [{ priceMinor: 32900, url: "/robots/window-cleaning-robots/hobot-2s/" }],
    });
    const item = r.itemReviewed as Record<string, unknown>;
    expect(item["@type"]).toBe("Product");
    expect(item.sku).toBe("hobot-2s");
    expect(item.url).toBe("https://botplanet.io/robots/window-cleaning-robots/hobot-2s/");
    expect((item.offers as Record<string, unknown>).price).toBe("329.00");
    // Still no rating anywhere — that one is not ours to emit.
    expect(JSON.stringify(r)).not.toContain("reviewRating");
    expect(JSON.stringify(r)).not.toContain("aggregateRating");
  });
});
