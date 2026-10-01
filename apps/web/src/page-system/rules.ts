/**
 * THE RULES A BOTPLANET PAGE HAS TO MEET, in one place.
 *
 * Every number here is read by two things: the page schema (so a page file that
 * breaks a limit is rejected the moment it is loaded) and test/page-system.test.ts
 * (so a limit cannot be loosened in one place and forgotten in the other).
 * docs/page-system/SEO_RULES.md and IMAGE_REQUIREMENTS.md describe these in words;
 * if the words and these numbers ever disagree, these numbers win.
 */

/** Search-result display limits. Same numbers test/serp-display.test.ts enforces. */
export const SEO_TITLE_MAX = 60;
export const SEO_TITLE_MIN = 20;
export const META_DESCRIPTION_MAX = 160;
export const META_DESCRIPTION_MIN = 70;

/** A page with fewer of these is not a page a reader can act on. */
export const MIN_PICKS = 3;
export const MIN_FAQ = 3;
export const MIN_BUY_BUTTONS = 8;
export const MIN_INTERNAL_LINKS_IN_PROSE = 5;
export const MIN_PROSE_WORDS = 700;

/** Hero image. One size for every page, so no page invents its own. */
export const HERO_DESKTOP = { width: 1672, height: 941 } as const;
export const HERO_MOBILE = { width: 900, height: 1125 } as const; // 4:5

/**
 * PHRASES THAT MAKE A PAGE READ LIKE A DATABASE WROTE IT. Each of these shipped
 * on a live page and was called out by the owner as unreadable. They fail the
 * page check so they cannot come back.
 */
export const BANNED_PHRASES: { phrase: string; instead: string }[] = [
  { phrase: "catalogue record", instead: "say what the figure is and where it came from, in plain words" },
  { phrase: "the copy above it", instead: "say 'the text above'" },
  { phrase: "is wrong for", instead: "say 'is not for' or 'who should buy something else'" },
  { phrase: "not stated", instead: "leave the figure out; do not print a gap" },
  { phrase: "not disclosed", instead: "leave the figure out; do not print a gap" },
  { phrase: "not published", instead: "leave the figure out; do not print a gap" },
  { phrase: "not given", instead: "leave the figure out; do not print a gap" },
  { phrase: "leverage", instead: "use" },
  { phrase: "cutting-edge", instead: "say what it does" },
  { phrase: "game-changer", instead: "say what changed" },
  { phrase: "unlock", instead: "say what you get" },
  { phrase: "seamless", instead: "say what is smooth" },
];

/** Page types. Only best-of is built; the others share this system once written. */
export const PAGE_TYPES = [
  "best-of",
  "category-hub",
  "review",
  "versus",
  "buying-guide",
  "how-to",
  "robot-database-entry",
] as const;
export const BUILT_PAGE_TYPES = ["best-of"] as const;
