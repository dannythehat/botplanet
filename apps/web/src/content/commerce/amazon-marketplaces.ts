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

   So an unconfigured country keeps the US destination. The reader
   may still be bounced by Amazon, but they are bounced FROM THE
   RIGHT PRODUCT rather than delivered to the wrong one. That is a
   worse experience and an honest one, and it is the correct
   trade until a row below is filled in properly.
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
    productId: "prod-dolphin-nautilus-cc-plus",
    country: "GB",
    asin: "B00Q8M0NWE",
    readOn: "2026-08-04",
    conflict:
      "Amazon's own detail table gives Brand 'Dolphin' and Model Name 'Nautilus CC Plus', matching the " +
      "US listing exactly. The title does not: the UK listing reads 'Ideal for In-Ground Pools up to 50 FT " +
      "in Length' where the US listing (B09K4C9WGF) reads 40 FT, and the page also carries an 'up to 65 FT' " +
      "claim elsewhere. A 40 ft rating is the single hardest limit in our review of this machine, so a " +
      "listing that states 50 is not the same product for our purposes even though Amazon files it under " +
      "the same model name. Not routed. Reading the UK listing was possible; reading the US one was not, " +
      "because amazon.com serves this environment a bot-mitigation page.",
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
 */
export function marketplaceFor(
  productId: string,
  usAsin: string,
  country: string | null | undefined,
): { url: string; marketplace: string; localised: boolean } {
  const us = AMAZON_MARKETPLACES[0];
  const usUrl = `https://${us.host}/dp/${usAsin}?tag=${us.tag}`;

  const cc = (country ?? "US").toUpperCase();
  if (cc === "US") return { url: usUrl, marketplace: "US", localised: false };

  const market = AMAZON_MARKETPLACES.find((m) => m.country === cc);
  const asin = REGIONAL_ASIN[`${productId}:${cc}`];

  /* Both conditions, or neither.
       - No verified regional ASIN: keep the amazon.com link and let Amazon's
         own Earn Globally redirect handle it. Guessing that the US ASIN also
         exists on the local store is how you ship a 404.
       - No tag: the store is not enabled, so a localised link would earn
         nothing where the amazon.com one might still be picked up. */
  if (!market?.tag || !asin) {
    return { url: usUrl, marketplace: "US", localised: false };
  }

  return {
    url: `https://${market.host}/dp/${asin}?tag=${market.tag}`,
    marketplace: cc,
    localised: true,
  };
}
