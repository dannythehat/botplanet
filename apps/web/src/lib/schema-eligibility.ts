type SchemaNode = Record<string, unknown>;

const asNode = (value: unknown): SchemaNode | null =>
  value && typeof value === "object" && !Array.isArray(value) ? (value as SchemaNode) : null;

const hasValue = (value: unknown): boolean =>
  typeof value === "number" || (typeof value === "string" && value.trim().length > 0);

function usableOffer(value: unknown): boolean {
  const offer = asNode(value);
  if (!offer) return false;
  const type = offer["@type"];

  if (type === "Offer") {
    return hasValue(offer.price) && hasValue(offer.priceCurrency);
  }

  if (type === "AggregateOffer") {
    return (
      hasValue(offer.priceCurrency) &&
      hasValue(offer.lowPrice) &&
      hasValue(offer.highPrice)
    );
  }

  return false;
}

/**
 * Keep Product markup truthful and remove only an incomplete offers property.
 * A Product is still useful entity markup without an offer; an Offer that
 * claims a sale without a price/currency is not.
 */
function sanitizeProduct(product: SchemaNode): SchemaNode {
  if (!("offers" in product)) return product;

  const offers = product.offers;
  if (Array.isArray(offers)) {
    const valid = offers.filter(usableOffer);
    if (valid.length) return { ...product, offers: valid };
    const { offers: _discarded, ...rest } = product;
    return rest;
  }

  if (usableOffer(offers)) return product;
  const { offers: _discarded, ...rest } = product;
  return rest;
}

/**
 * Prevent BotPlanet from advertising Google rich-result types whose required
 * factual fields we do not possess.
 *
 * - Review requires a real rating for Google's review rich result. BotPlanet
 *   deliberately has no invented star scores, so an unrated Review is replaced
 *   by its truthful Product entity instead of fabricating ratingValue.
 * - Article is emitted only when a genuine publication date exists. A
 *   last-reviewed date is not silently relabelled as datePublished.
 * - Product offers survive only when the price fields needed by their concrete
 *   Offer/AggregateOffer type are present.
 */
export function sanitizeRichResultNode(node: SchemaNode | null | undefined): SchemaNode | null {
  if (!node) return null;
  const type = node["@type"];

  if (type === "Review") {
    const rating = asNode(node.reviewRating);
    if (rating && hasValue(rating.ratingValue)) return node;

    const itemReviewed = asNode(node.itemReviewed);
    if (itemReviewed?.["@type"] === "Product") return sanitizeProduct(itemReviewed);
    return null;
  }

  if (type === "Article" && !hasValue(node.datePublished)) return null;
  if (type === "Product") return sanitizeProduct(node);

  return node;
}

export function sanitizeRichResultNodes(
  nodes: (SchemaNode | null | undefined)[],
): SchemaNode[] {
  return nodes.map(sanitizeRichResultNode).filter((node): node is SchemaNode => Boolean(node));
}
