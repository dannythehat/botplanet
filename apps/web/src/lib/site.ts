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

/** Amazon Associates US tracking tag (public — appears in outbound links). */
export const AMAZON_ASSOCIATE_TAG = "botplanet-20";

/** Trust pages shown in the footer. */
export const TRUST_LINKS: { href: string; label: string }[] = [
  { href: "/about/", label: "About BotPlanet" },
  { href: "/how-botmatch-works/", label: "How BotMatch works" },
  { href: "/editorial-policy/", label: "Editorial policy" },
  { href: "/review-methodology/", label: "Review methodology" },
  { href: "/affiliate-disclosure/", label: "Affiliate disclosure" },
  { href: "/privacy/", label: "Privacy" },
];
