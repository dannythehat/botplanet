import type { APIRoute } from "astro";
import { eq } from "drizzle-orm";
import { getDb, schema } from "../../lib/db";

// Placeholder retailer destinations for the preview. In production the real,
// affiliate-tracked destination comes from offers.affiliate_destination_url,
// set only after the retailer's programme is approved.
const RETAILER_HOME: Record<string, string> = {
  "ret-amazon": "https://www.amazon.com",
  "ret-walmart": "https://www.walmart.com",
  "ret-leslies": "https://lesliespool.com",
  "ret-dohenys": "https://www.doheny.com",
  "ret-intheswim": "https://www.intheswim.com",
  "ret-beatbot-store": "https://beatbot.com",
  "ret-aiper-store": "https://aiper.com",
  "ret-wybot-store": "https://www.wybotpool.com",
};

export const GET: APIRoute = async ({ params, locals, request }) => {
  const db = getDb(locals);
  const key = params.key!;

  const link = (
    await db.select().from(schema.redirectLinks).where(eq(schema.redirectLinks.key, key)).limit(1)
  )[0];
  if (!link) return new Response("Unknown link", { status: 404 });

  const offer = (
    await db.select().from(schema.offers).where(eq(schema.offers.id, link.offerId)).limit(1)
  )[0];
  if (!offer) return new Response("Offer unavailable", { status: 404 });

  // Immutable attribution event (no personal data).
  const referer = request.headers.get("referer");
  await db.insert(schema.clickEvents).values({
    id: crypto.randomUUID(),
    marketId: offer.marketId,
    productId: offer.productId,
    offerId: offer.id,
    retailerId: offer.retailerId,
    affiliateProgramId: offer.affiliateProgramId,
    redirectKey: key,
    sourcePage: referer,
    deviceClass: null,
  });

  const destination = offer.affiliateDestinationUrl ?? RETAILER_HOME[offer.retailerId] ?? "/";
  return new Response(null, { status: 302, headers: { Location: destination } });
};
