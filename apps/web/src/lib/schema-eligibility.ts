type SchemaNode = Record<string, unknown>;

const asNode = (value: unknown): SchemaNode | null =>
  value && typeof value === "object" && !Array.isArray(value) ? (value as SchemaNode) : null;

const hasValue = (value: unknown): boolean =>
  typeof value === "number" || (typeof value === "string" && value.trim().length > 0);

const schemaTypes = (node: SchemaNode): string[] => {
  const type = node["@type"];
  if (typeof type === "string") return [type];
  if (Array.isArray(type)) return type.filter((entry): entry is string => typeof entry === "string");
  return [];
};

const isOfferType = (node: SchemaNode): boolean => {
  const types = schemaTypes(node);
  return types.includes("Offer") || types.includes("AggregateOffer");
};

const PRODUCT_MERCHANT_FIELDS = new Set([
  "offers",
  "shippingDetails",
  "hasMerchantReturnPolicy",
  "availability",
  "seller",
]);

/**
 * BotPlanet is an affiliate/editorial publisher, not the merchant of record.
 *
 * This is deliberately recursive because Offer markup can be nested inside a
 * Review's itemReviewed Product, not only supplied as a top-level graph node.
 * No schema path is allowed to tell Google that BotPlanet sells, stocks,
 * ships, or accepts returns for a product.
 */
function stripMerchantClaimsDeep(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value
      .map(stripMerchantClaimsDeep)
      .filter((entry) => entry !== null && entry !== undefined);
  }

  const node = asNode(value);
  if (!node) return value;
  if (isOfferType(node)) return null;

  const product = schemaTypes(node).includes("Product");
  const clean: SchemaNode = {};

  for (const [key, child] of Object.entries(node)) {
    if (product && PRODUCT_MERCHANT_FIELDS.has(key)) continue;
    const sanitized = stripMerchantClaimsDeep(child);
    if (sanitized !== null && sanitized !== undefined) clean[key] = sanitized;
  }

  return clean;
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
 * Product rich-result markup is allowed only when it is supported by a real
 * rating/review. Affiliate retailer prices are intentionally NOT an
 * eligibility route: publishing them as Product.offers is what makes Google
 * classify BotPlanet as a merchant and ask BotPlanet for shipping/returns.
 */
function sanitizeProduct(product: SchemaNode): SchemaNode | null {
  const stripped = stripMerchantClaimsDeep(product);
  const sanitized = asNode(stripped);
  if (!sanitized) return null;
  return hasEligibleRatingOrReview(sanitized) ? sanitized : null;
}

/**
 * Final structured-data gate before JSON-LD reaches Google.
 *
 * Affiliate policy:
 * - Offer and AggregateOffer are never emitted by BotPlanet.
 * - Merchant-only Product fields are stripped recursively, including offers,
 *   shippingDetails, return policy, availability and seller.
 * - An unrated editorial Review is not converted into a priced Product.
 * - Product markup survives only with a genuine review/rating signal.
 * - Article is emitted only when a genuine publication date exists.
 *
 * The guard removes unsupported claims; it never invents replacement data.
 */
export function sanitizeRichResultNode(node: SchemaNode | null | undefined): SchemaNode | null {
  if (!node) return null;

  const stripped = stripMerchantClaimsDeep(node);
  const clean = asNode(stripped);
  if (!clean) return null;

  const types = schemaTypes(clean);
  if (types.includes("Offer") || types.includes("AggregateOffer")) return null;

  if (types.includes("Review")) {
    const rating = asNode(clean.reviewRating);
    return rating && hasValue(rating.ratingValue) ? clean : null;
  }

  if (types.includes("Article") && !hasValue(clean.datePublished)) return null;
  if (types.includes("Product")) return sanitizeProduct(clean);

  return clean;
}

export function sanitizeRichResultNodes(
  nodes: (SchemaNode | null | undefined)[],
): SchemaNode[] {
  return nodes.map(sanitizeRichResultNode).filter((node): node is SchemaNode => Boolean(node));
}
