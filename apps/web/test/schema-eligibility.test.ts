import { describe, expect, it } from "vitest";
import { sanitizeRichResultNode, sanitizeRichResultNodes } from "../src/lib/schema-eligibility";

describe("rich-result eligibility for an affiliate publisher", () => {
  it("never converts an unrated editorial Review into a priced Product", () => {
    expect(
      sanitizeRichResultNode({
        "@type": "Review",
        headline: "Example review",
        itemReviewed: {
          "@type": "Product",
          name: "Example Robot",
          offers: { "@type": "Offer", price: "299.00", priceCurrency: "USD" },
        },
      }),
    ).toBeNull();
  });

  it("keeps a genuinely rated Review but removes nested merchant Offer markup", () => {
    expect(
      sanitizeRichResultNode({
        "@type": "Review",
        reviewRating: { "@type": "Rating", ratingValue: 4.5 },
        itemReviewed: {
          "@type": "Product",
          name: "Example Robot",
          offers: { "@type": "Offer", price: "299.00", priceCurrency: "USD" },
          availability: "https://schema.org/InStock",
          seller: { "@type": "Organization", name: "BotPlanet" },
        },
      }),
    ).toEqual({
      "@type": "Review",
      reviewRating: { "@type": "Rating", ratingValue: 4.5 },
      itemReviewed: { "@type": "Product", name: "Example Robot" },
    });
  });

  it("drops Article markup that has no genuine publication date", () => {
    expect(sanitizeRichResultNode({ "@type": "Article", headline: "Guide", dateModified: "2026-09-01" })).toBeNull();
    const article = { "@type": "Article", headline: "Guide", datePublished: "2026-08-01" };
    expect(sanitizeRichResultNode(article)).toEqual(article);
  });

  it("drops a Product whose only eligibility signal is an affiliate offer", () => {
    expect(
      sanitizeRichResultNode({
        "@type": "Product",
        name: "Example Robot",
        offers: { "@type": "Offer", price: "299.00", priceCurrency: "USD" },
      }),
    ).toBeNull();
  });

  it("drops a bare Product with no review or aggregate rating", () => {
    expect(sanitizeRichResultNode({ "@type": "Product", name: "Example Robot" })).toBeNull();
  });

  it("keeps a Product with a genuine aggregate rating while stripping merchant fields", () => {
    expect(
      sanitizeRichResultNode({
        "@type": "Product",
        name: "Rated Robot",
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: 4.4,
          ratingCount: 37,
        },
        offers: { "@type": "Offer", price: "299.00", priceCurrency: "USD" },
        shippingDetails: { "@type": "OfferShippingDetails" },
        hasMerchantReturnPolicy: { "@type": "MerchantReturnPolicy" },
        availability: "https://schema.org/InStock",
        seller: { "@type": "Organization", name: "BotPlanet" },
      }),
    ).toEqual({
      "@type": "Product",
      name: "Rated Robot",
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: 4.4,
        ratingCount: 37,
      },
    });
  });

  it("drops standalone Offer and AggregateOffer nodes completely", () => {
    expect(
      sanitizeRichResultNode({ "@type": "Offer", price: "299.00", priceCurrency: "USD" }),
    ).toBeNull();
    expect(
      sanitizeRichResultNode({ "@type": "AggregateOffer", lowPrice: "299.00", priceCurrency: "USD" }),
    ).toBeNull();
  });

  it("recursively removes an Offer hidden inside an otherwise ordinary schema node", () => {
    expect(
      sanitizeRichResultNode({
        "@type": "WebPage",
        name: "Affiliate page",
        mainEntity: {
          "@type": "Product",
          name: "Example Robot",
          offers: { "@type": "Offer", price: "299.00", priceCurrency: "USD" },
        },
      }),
    ).toEqual({
      "@type": "WebPage",
      name: "Affiliate page",
      mainEntity: { "@type": "Product", name: "Example Robot" },
    });
  });

  it("leaves ordinary schema nodes untouched and filters rejected nodes", () => {
    const faq = { "@type": "FAQPage", mainEntity: [] };
    expect(
      sanitizeRichResultNodes([
        faq,
        { "@type": "Article", headline: "No publish date" },
        { "@type": "Product", name: "Bare product" },
        { "@type": "Offer", price: "10.00", priceCurrency: "USD" },
        null,
      ]),
    ).toEqual([faq]);
  });
});
