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

/**
 * Redirect keys that have been renamed, and where they now live.
 *
 * A /go/ key is pasted into emails, saved in browsers and sat in the click
 * history, so renaming one without a forwarding address turns every one of
 * those into a 404 on a buy button — the single most damaging failure the site
 * has. The Bubot's two keys said "dolphin-premier" because the record they hang
 * off still carries that stable ID, and the machine there has been a BuBlue
 * since 3 August 2026 (see migration 0006).
 *
 * 301 rather than 302, because these old keys are never coming back.
 *
 * The forwarding map has to ship BEFORE migration 0007 deletes the old rows,
 * and 0006 leaves both pairs alive in the meantime — so there is no moment at
 * which either key 404s. That ordering is the whole reason the rename is two
 * migrations rather than one.
 */
const RENAMED_KEYS: Record<string, string> = {
  "pool-dolphin-premier-amazon": "pool-bublue-bubot800p-amazon",
  "pool-dolphin-premier-leslies": "pool-bublue-bubot800p-leslies",
};

export const GET: APIRoute = async ({ params, locals, request }) => {
  const db = getDb(locals);
  const key = params.key!;

  /* Forward before touching the database. During the overlap the old row still
     exists and would resolve on its own; once 0007 removes it, a lookup here
     would 404. Checking the map first makes the behaviour the same either way. */
  const renamed = RENAMED_KEYS[key];
  if (renamed) {
    return new Response(null, {
      status: 301,
      headers: { Location: `/go/${renamed}`, "cache-control": "no-store" },
    });
  }

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
      /* THE NAME IS READ BEFORE THE ROUTE IS BUILT, and that is the whole
         change of 9 August 2026. A non-US visitor with no verified regional
         ASIN is sent to their own store's SEARCH for this product's name,
         because an ASIN is not a global identifier — ours for the Miko 3
         resolves to a different maker's robot on amazon.co.uk. A name cannot
         collide that way. See content/commerce/amazon-marketplaces.ts. */
      const named = (
        await db
          .select({ name: schema.products.name })
          .from(schema.products)
          .where(eq(schema.products.id, offer.productId))
          .limit(1)
      )[0];
      const routed = marketplaceFor(offer.productId, exact.retailerProductId, country, named?.name ?? null);
      destination = amazonDestination(routed.url, routed.tag);
      marketplace = routed.marketplace;
      /* Recorded distinctly so a search fallback is never counted as a product
         click. Three of the four kinds are not "we sent them to the product". */
      destinationKind = routed.kind === "regional_search" || routed.kind === "us_search"
        ? "amazon_search"
        : "offer_destination";
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
