/* ============================================================
   Sending an international visitor to the right Amazon.

   THE PROBLEM, AS THE OWNER HIT IT. Our link is
   amazon.com/dp/B09K4C9WGF?tag=botplanet-20. Clicked from the UK,
   Amazon does not show that page: it bounces the visitor to
   amazon.co.uk, usually to a SEARCH RESULTS page rather than to
   the product. The US tag does not travel with them, so the click
   is lost as well as the reader.

   EARN GLOBALLY IS ON, AND IT CHANGES THE COMMERCIAL ANSWER.

   Read from Associates Central on 4 August 2026: the store
   `botplanet-20` is configured to earn from the United States,
   Canada, France, Germany, Italy, Netherlands, Poland, Spain,
   Sweden and the United Kingdom. That is Amazon's own OneLink
   mechanism, and it means an amazon.com link clicked from any of
   those countries is redirected by Amazon AND still credited to
   our tag.

   So the earlier worry that UK clicks were unmonetised was wrong:
   they are monetised. What Earn Globally does NOT do is land the
   shopper on the equivalent PRODUCT — without a per-product
   mapping it commonly drops them on a local search page, which is
   what the owner saw. Attribution is solved; the landing is not.

   WHY WE DO NOT SIMPLY REWRITE THE HOST OURSELVES. Sending a UK
   visitor straight to amazon.co.uk/dp/<US ASIN> looks like the fix
   and is not: a US ASIN frequently does not exist on the UK store,
   so the "fix" is a 404. Amazon's own redirect at least knows what
   it has. We therefore keep the amazon.com destination and only
   override it where we hold a regional ASIN we have verified — see
   the rule below.

   THE RULE THAT MAKES THIS SAFE — READ IT BEFORE ADDING A ROW.

   A marketplace is only used when BOTH are true:

     1. we hold a REGIONAL TAG for it, and
     2. we hold a REGIONAL ASIN that has been verified to be the
        SAME MACHINE the review describes.

   The second condition is not paperwork. The Nautilus CC Plus is
   the example: the US ASIN B09K4C9WGF is rated for pools up to
   40 ft, and the UK ASIN B00Q8M0NWE — same brand, same model name
   "Nautilus CC Plus" on Amazon's own detail table — is rated up to
   50 ft. Same name, different machine. Routing a UK reader to it
   because the name matched would send them to a product our review
   does not describe, which is precisely the SKU trap the review
   itself warns about.

   THAT LAST PARAGRAPH USED TO SAY THE OPPOSITE, AND IT WAS WRONG.

   It read: "an unconfigured country keeps the US destination. The
   reader may still be bounced by Amazon, but they are bounced FROM
   THE RIGHT PRODUCT rather than delivered to the wrong one."

   The owner disproved it from Burnley on 9 August 2026. Our Miko 3
   link carries the US ASIN B0GV37M678. Followed from the UK it did
   not land on a Miko 3 and it did not 404 — it produced a LOOI
   robot, a different machine from a different maker. AN ASIN IS NOT
   A GLOBAL IDENTIFIER. The same ten characters address different
   products on different stores, so a bare US ASIN followed from
   abroad is not "the right product, possibly bounced". It is a
   coin toss, and the losing side is a buy button that recommends
   somebody else's robot under our name.

   THE RULE NOW, FOR ANY NON-US CLICK:

     - a VERIFIED regional ASIN → that store's product page;
     - otherwise → that store's SEARCH for the product's exact
       name. A name cannot collide the way an identifier can. It is
       visibly a search rather than a product page, which is the
       honest shape for "we know what you want and not where it
       lives here".

   A bare US ASIN is never emitted to a non-US visitor again. The
   test in test/offers.test.ts asserts it.
   ============================================================ */

export interface AmazonMarketplace {
  /** ISO-3166-1 alpha-2, as Cloudflare reports it on the request. */
  country: string;
  host: string;
  /**
   * The tag that earns on this store. Under Earn Globally that is the SAME
   * tag everywhere — Amazon links the stores rather than issuing one tag per
   * country — so this is `botplanet-20` for every enabled country and null
   * for a store that has not been switched on.
   */
  tag: string | null;
}

/** The one tag. Earn Globally credits it across every enabled store. */
export const US_TAG = "botplanet-20";

/**
 * Read from Associates Central → Your associates account → Earn globally.
 * Update the date whenever the country list is checked again; a list nobody
 * has looked at for six months is a guess wearing a constant's name.
 */
export const EARN_GLOBALLY_READ_ON = "2026-08-04";

/**
 * The stores Amazon operates that a US-catalogue reader plausibly lands on.
 * Presence here is NOT permission to rewrite the host — see `marketplaceFor`.
 */
/* @extension-point per-retailer | optional | Needed only when we sell into a
   second Amazon marketplace. Each has its own tracking tag and its own ASINs —
   REGIONAL_ASIN below — because the same machine has different identifiers per
   country, and reusing a US ASIN abroad sends a reader to the wrong listing or
   to nothing. */
export const AMAZON_MARKETPLACES: AmazonMarketplace[] = [
  { country: "US", host: "www.amazon.com", tag: US_TAG },

  /* Enabled under Earn Globally as at EARN_GLOBALLY_READ_ON. */
  { country: "GB", host: "www.amazon.co.uk", tag: US_TAG },
  { country: "CA", host: "www.amazon.ca", tag: US_TAG },
  { country: "DE", host: "www.amazon.de", tag: US_TAG },
  { country: "FR", host: "www.amazon.fr", tag: US_TAG },
  { country: "IT", host: "www.amazon.it", tag: US_TAG },
  { country: "ES", host: "www.amazon.es", tag: US_TAG },
  { country: "NL", host: "www.amazon.nl", tag: US_TAG },
  { country: "SE", host: "www.amazon.se", tag: US_TAG },
  { country: "PL", host: "www.amazon.pl", tag: US_TAG },

  /* NOT enabled. Listed so that a click from here is recognisably
     unmonetised rather than silently indistinguishable from the rest. */
  { country: "AU", host: "www.amazon.com.au", tag: null },
  { country: "JP", host: "www.amazon.co.jp", tag: null },
];

/** True when a click from this country is credited to us at all. */
export const earnsIn = (country: string | null | undefined): boolean =>
  Boolean(AMAZON_MARKETPLACES.find((m) => m.country === (country ?? "US").toUpperCase())?.tag);

/**
 * Regional ASINs, keyed by `${productId}:${country}`.
 *
 * A row here is a claim that the regional listing is THE SAME MACHINE as the
 * one the review describes — not merely the same model name. Anything less
 * than that belongs in the note below and NOT in this map.
 */
export const REGIONAL_ASIN: Record<string, string> = {
  // Deliberately empty. See REGIONAL_SKU_CONFLICTS.
};

/**
 * Regional listings that share a model name and do NOT share a specification.
 * Recorded rather than dropped, so nobody re-discovers them and assumes the
 * absence from REGIONAL_ASIN was an oversight.
 */
export const REGIONAL_SKU_CONFLICTS: {
  productId: string;
  country: string;
  asin: string;
  readOn: string;
  conflict: string;
}[] = [
  {
    productId: "prod-miko-3",
    country: "GB",
    asin: "B0GV37M678",
    readOn: "2026-08-09",
    conflict:
      "THE CLICK THAT PROVED AN ASIN IS NOT GLOBAL. This is our US ASIN, and the owner following our own " +
      "link from the UK reached a LOOI robot — a different machine from a different maker — rather than a " +
      "Miko 3 or a 404. Checked the same day through the product engine against amazon.co.uk: the ASIN " +
      "returns no product at all there, so what a browser resolves it to is Amazon's redirect rather than a " +
      "listing we could ever verify. THERE IS ALSO NO GENUINE MIKO 3 ON amazon.co.uk: a search returns a " +
      "screen protector captioned 'Compatible for Miko 3' and a run of unrelated £20 toy robots. So there " +
      "is no regional ASIN to add, and GB clicks for this product now go to a UK search for the product " +
      "name — which finds nothing good either, but says so instead of selling a stranger's robot.",
  },
  {
    productId: "prod-dolphin-nautilus-cc-plus",
    country: "GB",
    asin: "B00Q8M0NWE",
    readOn: "2026-08-04",
    conflict:
      "NOT A REGIONAL VARIANT AT ALL — a DIFFERENT MODEL, and it exists on amazon.com too. Both listings " +
      "were read on 4 August 2026. B00Q8M0NWE is one of nine size_name variants under parent B0HBR6VSXS, " +
      "alongside the B09K4C9WGF we hold: Amazon labels ours 'Nautilus CC Plus Wi-Fi' and this one " +
      "'Nautilus CC Plus' — the same machine WITHOUT Wi-Fi. On amazon.com it is $829.00 against our " +
      "$849.00; on amazon.co.uk it is the listing the owner found at roughly £1,800, which is UK import " +
      "pricing for a different variant rather than a contradiction of the US figure. Its UK title also " +
      "claims 'up to 50 FT' where ours claims 40. Not routed, and not the product this review describes.",
  },
];

/**
 * Where an Amazon click should actually go.
 *
 * @param productId Our product ID, for looking up a regional ASIN.
 * @param usAsin    The ASIN the catalogue holds — always a US ASIN.
 * @param country   From `request.cf.country`. Null when unknown, which is
 *                  treated as the US default rather than guessed at.
 *
 * Returns the URL plus which marketplace was chosen, so the click event can
 * record it and the loss from unconfigured countries is measurable rather
 * than invisible.
 *
 * THE URL COMES BACK UNTAGGED, DELIBERATELY. lib/site.ts calls
 * amazonDestination "the ONLY way an outbound Amazon URL is built", and that
 * has to stay true or it stops being a guarantee and becomes a comment. The
 * first version of this function returned a tagged URL, the caller wrapped it
 * anyway, and production shipped `?tag=botplanet-20&tag=botplanet-20`. Under
 * Earn Globally the tag is the same on every enabled store, so there is
 * nothing this function needs to say about it.
 */
export function marketplaceFor(
  productId: string,
  usAsin: string,
  country: string | null | undefined,
  /**
   * The product's catalogue name, used to build the search fallback.
   *
   * OPTIONAL ONLY SO EXISTING CALLERS COMPILE. Without it a non-US click has
   * nothing to search for, so it falls back to the US product page — the very
   * behaviour this function exists to stop. The /go route always passes it;
   * `searchFallbackAvailable` below is what a test can assert on.
   */
  productName?: string | null,
): {
  url: string;
  marketplace: string;
  localised: boolean;
  /** What kind of destination was built, for the click record. */
  kind: "us_asin" | "regional_asin" | "regional_search" | "us_search";
  /** The tag to attach, or null where this store earns us nothing. */
  tag: string | null;
} {
  const us = AMAZON_MARKETPLACES[0];
  const usUrl = `https://${us.host}/dp/${usAsin}`;

  const cc = (country ?? "US").toUpperCase();

  /* US IS UNCHANGED, and deliberately first. Everything below this line is
     about a visitor Amazon is going to redirect; a US visitor is not. */
  if (cc === "US") {
    return { url: usUrl, marketplace: "US", localised: false, kind: "us_asin", tag: us.tag };
  }

  const market = AMAZON_MARKETPLACES.find((m) => m.country === cc);
  const asin = REGIONAL_ASIN[`${productId}:${cc}`];

  /* 1. A verified regional ASIN is the only thing that earns a product page.
        A row in REGIONAL_ASIN is a claim that somebody read the regional
        listing and found the same machine — see the rule at the top. */
  if (market && asin) {
    return {
      url: `https://${market.host}/dp/${asin}`,
      marketplace: cc,
      localised: true,
      kind: "regional_asin",
      tag: market.tag,
    };
  }

  /* 2. Otherwise, a SEARCH on the store the visitor is actually on.
        A NAME CANNOT COLLIDE THE WAY AN IDENTIFIER CAN. B0GV37M678 is a Miko 3
        here and something else on amazon.co.uk; "Miko 3" is "Miko 3"
        everywhere. The visitor lands on a search page, which looks like what
        it is, instead of on a product page that looks like the one they asked
        for and is not. */
  const name = (productName ?? "").trim();
  if (market && name) {
    return {
      url: `https://${market.host}/s?k=${encodeURIComponent(name)}`,
      marketplace: cc,
      localised: true,
      kind: "regional_search",
      tag: market.tag,
    };
  }

  /* 3. A country we do not have a store for, or a product with no name to
        search. Still never a bare US ASIN: amazon.com's own search takes the
        name and Amazon redirects the visitor to their local store with the
        query intact. */
  if (name) {
    return {
      url: `https://${us.host}/s?k=${encodeURIComponent(name)}`,
      marketplace: market?.country ?? "US",
      localised: false,
      kind: "us_search",
      tag: market ? market.tag : us.tag,
    };
  }

  /* 4. No name and no store. This is a data gap rather than a routing
        decision — the caller could not tell us what the product is called —
        and the US product page is the least-wrong answer left. It is reachable
        only if a caller omits `productName`, which /go never does. */
  return { url: usUrl, marketplace: "US", localised: false, kind: "us_asin", tag: us.tag };
}

/** True when this product can be searched for by name on a non-US store. */
export const searchFallbackAvailable = (productName: string | null | undefined): boolean =>
  Boolean((productName ?? "").trim());
