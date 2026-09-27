import { describe, expect, it } from "vitest";
import { sanitizeRichResultNode, sanitizeRichResultNodes } from "../src/lib/schema-eligibility";

describe("rich-result eligibility", () => {
  it("replaces an unrated Review with its truthful Product entity", () => {
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

  it("removes an incomplete Offer instead of inventing its price", () => {
    expect(
      sanitizeRichResultNode({
        "@type": "Product",
        name: "Example Robot",
        offers: { "@type": "Offer", url: "https://botplanet.io/example/" },
      }),
    ).toEqual({ "@type": "Product", name: "Example Robot" });
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
        highPrice: "349.00",
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
        null,
      ]),
    ).toEqual([faq]);
  });
});
