import { describe, expect, it } from "vitest";
import { affiliateSafeSchemaNode, productSchema, schemaGraph } from "../src/lib/seo";

describe("affiliate-safe structured data", () => {
  it("never emits retailer offers from the Product builder", () => {
    const product = productSchema({
      name: "Example Robot",
      slug: "example-robot",
      path: "/robots/example-robot/",
      brand: "Example",
      description: "Editorial product page",
      offers: [
        {
          priceMinor: 99900,
          currency: "USD",
          availability: "InStock",
          url: "https://retailer.example/product",
        },
      ],
    });

    expect(product).not.toHaveProperty("offers");
    expect(product).not.toHaveProperty("availability");
    expect(product).not.toHaveProperty("seller");
  });

  it("drops offer-only Product markup before rendering the graph", () => {
    const graph = schemaGraph({
      "@type": "Product",
      name: "Example Robot",
      offers: {
        "@type": "Offer",
        price: "999.00",
        priceCurrency: "USD",
        availability: "https://schema.org/InStock",
      },
    });

    expect(graph["@graph"]).toEqual([]);
  });

  it("keeps genuine editorial review Product markup but strips merchant fields", () => {
    const node = affiliateSafeSchemaNode({
      "@type": "Product",
      name: "Example Robot",
      review: {
        "@type": "Review",
        author: { "@type": "Person", name: "BotPlanet Editorial" },
        reviewRating: { "@type": "Rating", ratingValue: 4, bestRating: 5 },
      },
      offers: { "@type": "Offer", price: "999.00", priceCurrency: "USD" },
      shippingDetails: { "@type": "OfferShippingDetails" },
      hasMerchantReturnPolicy: { "@type": "MerchantReturnPolicy" },
      availability: "https://schema.org/InStock",
      seller: { "@type": "Organization", name: "BotPlanet" },
    });

    expect(node).not.toBeNull();
    expect(node).toHaveProperty("review");
    expect(node).not.toHaveProperty("offers");
    expect(node).not.toHaveProperty("shippingDetails");
    expect(node).not.toHaveProperty("hasMerchantReturnPolicy");
    expect(node).not.toHaveProperty("availability");
    expect(node).not.toHaveProperty("seller");
  });

  it("drops standalone Offer and AggregateOffer nodes", () => {
    const graph = schemaGraph(
      { "@type": "Offer", price: "10.00", priceCurrency: "USD" },
      { "@type": "AggregateOffer", lowPrice: "10.00", priceCurrency: "USD" },
      { "@type": "WebPage", name: "Safe page" },
    );

    expect(graph["@graph"]).toEqual([{ "@type": "WebPage", name: "Safe page" }]);
  });
});
