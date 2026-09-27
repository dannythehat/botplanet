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
    return hasValue(offer.priceCurrency) && hasValue(offer.lowPrice);
  }

  return false;
}

function hasEligibleRatingOrReview(product: SchemaNode): boolean {
  const aggregate = asNode(product.aggregateRating);
  const aggregateEligible = Boolean(
    aggregate &&
      hasValue(aggregate.ratingValue) &&
      (hasValue(aggregate.ratingCount) || hasValue(aggregate.reviewCount)),
  );
  if (aggregateEligible) return true;

  const reviews = Array.isArray(product.review) ? product.review : [product.review];
  return reviews.some((value) => {
    const review = asNode(value);
    if (!review) return false;
    const rating = asNode(review.reviewRating);
    return Boolean(rating && hasValue(rating.ratingValue));
  });
}

/**
 * Return only Product markup that is eligible for Google's product snippet
 * interpretation without inventing facts. Google requires a Product to carry
 * at least one of offers, review or aggregateRating. BotPlanet therefore drops
 * a bare Product when a current publishable price/rating does not exist.
 */
function sanitizeProduct(product: SchemaNode): SchemaNode | null {
  let sanitized: SchemaNode = product;

  if ("offers" in product) {
    const offers = product.offers;
    if (Array.isArray(offers)) {
      const valid = offers.filter(usableOffer);
      if (valid.length) sanitized = { ...product, offers: valid };
      else {
        const { offers: _discarded, ...rest } = product;
        sanitized = rest;
      }
    } else if (!usableOffer(offers)) {
      const { offers: _discarded, ...rest } = product;
      sanitized = rest;
    }
  }

  const remainingOffers = sanitized.offers;
  const hasOffer = Array.isArray(remainingOffers)
    ? remainingOffers.some(usableOffer)
    : usableOffer(remainingOffers);

  return hasOffer || hasEligibleRatingOrReview(sanitized) ? sanitized : null;
}

/**
 * Prevent BotPlanet from advertising Google rich-result types whose required
 * factual fields we do not possess.
 *
 * - Review is kept only when a real rating exists. BotPlanet does not invent
 *   stars. An unrated editorial review may fall back to its Product entity only
 *   when that Product independently has an eligible priced offer/rating.
 * - Article is emitted only when a genuine publication date exists. A
 *   last-reviewed date is not silently relabelled as datePublished.
 * - Product is emitted only with an eligible offer, review or aggregateRating;
 *   incomplete offers are removed rather than guessed.
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
