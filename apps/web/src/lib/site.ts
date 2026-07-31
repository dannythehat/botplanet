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
 * WITHHELD. The tag `botplanet-20` was carried on every outbound Amazon link,
 * but BotPlanet has no evidenced, approved Associates account and no
 * confirmation that this tag is ours. Both failure modes are real: appending a
 * tag that belongs to somebody else sends them our commission, and tagging
 * traffic on an unapproved account is exactly what gets an application refused.
 *
 * So it is null until account approval AND ownership are evidenced. Links still
 * work — a customer reaching the right product page is the point, and the tag
 * only decides who gets paid. `amazonDestination()` is the single place that
 * decides, so restoring it later is one constant, not a search across files.
 */
export const AMAZON_ASSOCIATE_TAG: string | null = null;

/** Why the tag is withheld, shown on the internal commerce surface. */
export const AMAZON_ASSOCIATE_TAG_STATUS =
  "unverified / pending owner confirmation — no approved Associates account is evidenced, so no tag is appended to public destinations";

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
