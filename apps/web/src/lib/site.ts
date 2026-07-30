/**
 * Central site / brand / EEAT config. Founder + business fields are placeholders
 * until confirmed — search for "TODO:founder" to fill in.
 */
export const SITE = {
  name: "BotPlanet",
  domain: "botplanet.io",
  tagline: "Shop the planet yourself, or let BotPlanet find your perfect robot.",
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

/** Trust pages shown in the footer. */
export const TRUST_LINKS: { href: string; label: string }[] = [
  { href: "/about/", label: "About BotPlanet" },
  { href: "/how-botmatch-works/", label: "How BotMatch works" },
  { href: "/editorial-policy/", label: "Editorial policy" },
  { href: "/review-methodology/", label: "Review methodology" },
  { href: "/affiliate-disclosure/", label: "Affiliate disclosure" },
  { href: "/privacy/", label: "Privacy" },
];
