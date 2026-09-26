/**
 * Which /go link, if any, a hub or editorial page may offer for a product.
 *
 * Deliberately its own module rather than a field added to catalogue-prices.ts:
 * a redirect key carries no price, no commission, no offer value — nothing
 * the price-staleness engine exists to guard. It is only ever a link target,
 * used by ComparisonTable's "Check price" action so a reader who has already
 * decided from the table row does not have to open the review first to find
 * a way to buy.
 */
import { eq } from "drizzle-orm";
import { getDb, schema } from "./db";

/** Active offer's redirect key per product, for a whole page of rows. */
export async function redirectKeysByProduct(
  db: ReturnType<typeof getDb>,
): Promise<Map<string, string>> {
  const rows = await db
    .select({ productId: schema.offers.productId, key: schema.redirectLinks.key })
    .from(schema.redirectLinks)
    .innerJoin(schema.offers, eq(schema.offers.id, schema.redirectLinks.offerId))
    .where(eq(schema.redirectLinks.active, true));
  return new Map(rows.map((r) => [r.productId, r.key]));
}
