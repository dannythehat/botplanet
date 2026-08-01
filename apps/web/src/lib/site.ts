/**
 * Central site / brand / EEAT config. Founder + business fields are placeholders
 * until confirmed — search for "TODO:founder" to fill in.
 */
export const SITE = {
  name: "BotPlanet",
  domain: "botplanet.io",
  /**
   * Brand-level statement. Deliberately NOT a BotMatch promise: BotMatch is
   * category-specific and currently covers robotic pool cleaners only, so no
   * copy may imply one journey recommends across the whole robotics market.
   * This is the single source for structured data and any rendered use.
   */
  tagline: "Shop the planet’s real-world robots with clearer comparisons, evidence and category-specific guidance.",
  // TODO:founder — replace with the real accountable editorial owner.
  founder: {
    name: "Danny",
    title: "Founder & Editorial Owner",
    bio: "Founder of BotPlanet. Reviews and recommendations here are written to help you buy the right robot, with independence from commission.",
  },
  business: {
    legalName: "BotPlanet",
    contactEmail: "hello@botplanet.io",
  },
  emailFrom: "BotPlanet <recommendations@botplanet.io>",
} as const;

/**
 * Amazon Associates US tracking tag.
 *
 * Owner-confirmed for BotPlanet on 1 August 2026. All public Amazon destinations
 * are built through amazonDestination(), so this single value controls tagging
 * everywhere without duplicating the tag across pages or product data.
 */
export const AMAZON_ASSOCIATE_TAG: string | null = "botplanet-20";

/** Current Amazon Associates state shown on internal commerce surfaces. */
export const AMAZON_ASSOCIATE_TAG_STATUS =
  "owner-confirmed and active — botplanet-20 is appended to public Amazon destinations";

/**
 * The ONLY way an outbound Amazon URL is built. Appends the tag when there is a
 * verified one and leaves the URL clean when there is not.
 */
export function amazonDestination(url: string): string {
  if (!AMAZON_ASSOCIATE_TAG) return url;
  return `${url}${url.includes("?") ? "&" : "?"}tag=${AMAZON_ASSOCIATE_TAG}`;
}

/** Trust pages shown in the footer. */
export const TRUST_LINKS: { href: string; label: string }[] = [
  { href: "/about/", label: "About BotPlanet" },
  { href: "/how-botmatch-works/", label: "How BotMatch works" },
  { href: "/editorial-policy/", label: "Editorial policy" },
  { href: "/review-methodology/", label: "Review methodology" },
  { href: "/affiliate-disclosure/", label: "Affiliate disclosure" },
  { href: "/privacy/", label: "Privacy" },
];