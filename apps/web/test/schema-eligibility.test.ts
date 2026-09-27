import { describe, expect, it } from "vitest";
import { sanitizeRichResultNode, sanitizeRichResultNodes } from "../src/lib/schema-eligibility";

describe("rich-result eligibility", () => {
  it("lets an unrated Review fall back to Product only when Product has a valid offer", () => {
    const product = {
      "@type": "Product",
      name: "Example Robot",
      offers: { "@type": "Offer", price: "299.00", priceCurrency: "USD" },
    };

    expect(
      sanitizeRichResultNode({
        "@type": "Review",
        headline: "Example review",
        itemReviewed: product,
      }),
    ).toEqual(product);
  });

  it("drops an unrated Review when its Product has no independently eligible rich-result data", () => {
    expect(
      sanitizeRichResultNode({
        "@type": "Review",
        headline: "Example review",
        itemReviewed: { "@type": "Product", name: "Example Robot" },
      }),
    ).toBeNull();
  });

  it("keeps a Review only when a real ratingValue exists", () => {
    const review = {
      "@type": "Review",
      reviewRating: { "@type": "Rating", ratingValue: 4.5 },
      itemReviewed: { "@type": "Product", name: "Example Robot" },
    };
    expect(sanitizeRichResultNode(review)).toEqual(review);
  });

  it("drops Article markup that has no genuine publication date", () => {
    expect(sanitizeRichResultNode({ "@type": "Article", headline: "Guide", dateModified: "2026-09-01" })).toBeNull();
    const article = { "@type": "Article", headline: "Guide", datePublished: "2026-08-01" };
    expect(sanitizeRichResultNode(article)).toEqual(article);
  });

  it("drops a Product whose only offer is incomplete instead of inventing its price", () => {
    expect(
      sanitizeRichResultNode({
        "@type": "Product",
        name: "Example Robot",
        offers: { "@type": "Offer", url: "https://botplanet.io/example/" },
      }),
    ).toBeNull();
  });

  it("drops a bare Product with no offer, review or aggregate rating", () => {
    expect(sanitizeRichResultNode({ "@type": "Product", name: "Example Robot" })).toBeNull();
  });

  it("keeps a Product with a genuine aggregate rating", () => {
    const product = {
      "@type": "Product",
      name: "Rated Robot",
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: 4.4,
        ratingCount: 37,
      },
    };
    expect(sanitizeRichResultNode(product)).toEqual(product);
  });

  it("keeps valid Offer and AggregateOffer shapes", () => {
    const offerProduct = {
      "@type": "Product",
      name: "One seller",
      offers: { "@type": "Offer", price: "299.00", priceCurrency: "USD" },
    };
    const aggregateProduct = {
      "@type": "Product",
      name: "Several sellers",
      offers: {
        "@type": "AggregateOffer",
        priceCurrency: "USD",
        lowPrice: "299.00",
      },
    };
    expect(sanitizeRichResultNode(offerProduct)).toEqual(offerProduct);
    expect(sanitizeRichResultNode(aggregateProduct)).toEqual(aggregateProduct);
  });

  it("leaves ordinary schema nodes untouched and filters rejected nodes", () => {
    const faq = { "@type": "FAQPage", mainEntity: [] };
    expect(
      sanitizeRichResultNodes([
        faq,
        { "@type": "Article", headline: "No publish date" },
        { "@type": "Product", name: "Bare product" },
        null,
      ]),
    ).toEqual([faq]);
  });
});
