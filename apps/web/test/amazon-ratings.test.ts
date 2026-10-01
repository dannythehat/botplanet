/**
 * Amazon ratings are a third party's figures, so they carry a date and a source, stay
 * inside 1 to 5, and go stale. See content/commerce/amazon-ratings.ts.
 */
import { describe, expect, it } from "vitest";
import { AMAZON_RATINGS } from "../src/content/commerce/amazon-ratings";
import { PRODUCT_ID } from "../src/content/products";

/* Days a rating may go unread. Longer than a price's shelf life, because stars move
   slowly, but not forever. When this fails, the owner sends a fresh screenshot. */
const SHELF_LIFE_DAYS = 120;

describe("Amazon ratings", () => {
  for (const [slug, r] of Object.entries(AMAZON_RATINGS)) {
    it(`${slug}: is a real product, in range, dated and sourced`, () => {
      expect(PRODUCT_ID[slug], `${slug} is not a catalogue product`).toBeDefined();
      expect(r.rating).toBeGreaterThanOrEqual(1);
      expect(r.rating).toBeLessThanOrEqual(5);
      expect(r.readOn).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(r.source.length).toBeGreaterThan(10);
      expect(r.ratingsLabel.length).toBeGreaterThan(0);
      if (r.ratings !== null) expect(r.ratingsLabel).toBe(r.ratings.toLocaleString("en-US"));
    });

    it(`${slug}: has been read recently enough to show`, () => {
      const age = (Date.now() - new Date(`${r.readOn}T00:00:00Z`).getTime()) / 86_400_000;
      expect(age, `read ${Math.floor(age)} days ago; ask the owner for a fresh screenshot`).toBeLessThan(SHELF_LIFE_DAYS);
    });
  }
});
