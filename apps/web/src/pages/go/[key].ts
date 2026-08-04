import type { APIRoute } from "astro";
import { eq } from "drizzle-orm";
import {
  deviceClassFromUserAgent,
  isSafeAffiliateDestination,
  pageTypeFromPath,
  resolveSourcePath,
  type DestinationKind,
} from "@botplanet/shared";
import { getDb, schema } from "../../lib/db";
import { amazonDestination } from "../../lib/site";
import { destinationFor } from "../../content/commerce/destinations";
import { marketplaceFor } from "../../content/commerce/amazon-marketplaces";
import { ATTRIBUTION_HOSTS } from "../../lib/reporting";

/**
 * Retailer homepages, used only as a last-resort outbound destination for a
 * retailer whose programme has no tracked link yet. A click that lands here is
 * recorded as `retailer_home` so reporting never counts it as a product click.
 */
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

  /* ---- Resolve the destination, recording which kind it was. ---- */
  let destination: string | null = offer.affiliateDestinationUrl ?? null;
  let destinationKind: DestinationKind = destination ? "offer_destination" : "unavailable";

  /* Cloudflare resolves the country at the edge before the request reaches us.
     Used only to pick an Amazon store — never stored against a visitor, and
     never used to vary the page itself. */
  const country =
    (locals as App.Locals).runtime?.cf?.country ??
    request.headers.get("cf-ipcountry") ??
    null;
  let marketplace = "US";

  if (!destination && offer.retailerId === "ret-amazon") {
    // Prefer the exact product. Job 10 captured an ASIN for six of the ten from
    // the listings recorded in Job 8, so those clicks now land on the product
    // itself rather than on a search page the customer has to work through.
    const exact = destinationFor(offer.productId, "ret-amazon");
    if (exact?.retailerProductId && exact.identifierKind === "asin") {
      /* Localised where we can do it safely, US otherwise — the rule and the
         reason are in content/commerce/amazon-marketplaces.ts. Cloudflare
         gives the country on the request, so this costs nothing. */
      const routed = marketplaceFor(offer.productId, exact.retailerProductId, country);
      destination = routed.localised ? routed.url : amazonDestination(routed.url);
      marketplace = routed.marketplace;
      destinationKind = "offer_destination";
    } else {
      // No ASIN was ever captured for this product. A search link is an honest
      // fallback — a real tracked click to an imprecise place — and it is
      // recorded as `amazon_search` so reporting never counts it as a product
      // click or lets it be mistaken for a verified offer.
      const product = (
        await db
          .select({ name: schema.products.name })
          .from(schema.products)
          .where(eq(schema.products.id, offer.productId))
          .limit(1)
      )[0];
      const q = encodeURIComponent(product?.name ?? "robotic pool cleaner");
      destination = amazonDestination(`https://www.amazon.com/s?k=${q}`);
      destinationKind = "amazon_search";
    }
  } else if (!destination) {
    const home = RETAILER_HOME[offer.retailerId];
    if (home) {
      destination = home;
      destinationKind = "retailer_home";
    }
  }

  // Never redirect to an unvalidated value: anything that is not an absolute
  // http(s) URL with a real host is refused outright rather than guessed at.
  if (!destination || !isSafeAffiliateDestination(destination)) {
    return new Response("This offer link is not available right now.", {
      status: 502,
      headers: { "content-type": "text/plain; charset=utf-8", "cache-control": "no-store" },
    });
  }

  /* ---- Attribution event: anonymous, no query strings, never personal. ---- */
  const sourcePage = resolveSourcePath(request.headers.get("referer"), ATTRIBUTION_HOSTS);
  const clickRow = {
    id: crypto.randomUUID(),
    marketId: offer.marketId,
    productId: offer.productId,
    offerId: offer.id,
    retailerId: offer.retailerId,
    affiliateProgramId: offer.affiliateProgramId,
    redirectKey: key,
    /* Which Amazon store took the click. A US row from a UK visitor is a click
       we could not localise, so the cost of the unconfigured countries is
       countable rather than invisible. */
    destinationVersion: marketplace === "US" ? destinationKind : `${destinationKind}:${marketplace}`,
    sourcePage,
    pageType: pageTypeFromPath(sourcePage),
    deviceClass: deviceClassFromUserAgent(request.headers.get("user-agent")),
  };

  // Logging must never cost the visitor their click. If the write fails the
  // redirect still happens and the click is simply not counted (under-reporting
  // is honest; blocking the customer is not).
  try {
    await db.insert(schema.clickEvents).values(clickRow);
  } catch {
    // Intentionally swallowed — see above. Worker logs capture the failure.
  }

  return new Response(null, {
    status: 302,
    headers: { Location: destination, "cache-control": "no-store" },
  });
};
