/**
 * Public accountability / EEAT identity.
 *
 * HONESTY RULE: we never claim hands-on testing or expertise we don't have.
 * BotPlanet currently operates as a research-led editorial project. Product
 * recommendations are built from manufacturer specifications, retailer data
 * and aggregated owner feedback — each labelled by evidence level. Hands-on
 * "tested" status is only ever applied when a real review unit has been used.
 *
 * Expanding the named editorial team (additional authors, an independent
 * fact-checker) is a Danny-owned decision — do not invent people or credentials.
 */
import { SITE } from "../lib/site";

export interface Author {
  id: string;
  name: string;
  role: string;
  path: string;
  bio: string;
  /** Honest statement of what this person's involvement means. */
  accountability: string;
  /**
   * What this person is on the hook for, in the reader's words, printed in the
   * author box. Not a claim about their career — a description of their job
   * here, which is the only thing this site can vouch for.
   */
  covers: string;
  /**
   * A square portrait, or absent.
   *
   * A REAL PHOTOGRAPH OR NOTHING. The box falls back to initials on a plate,
   * which is honest; a stock portrait standing in for a named individual is the
   * same lie as an invented credential, and it is the more convincing one.
   */
  portrait?: { src: string; alt: string };
  /**
   * Anything true about them from OUTSIDE BotPlanet, supplied by the owner.
   *
   * OPTIONAL, AND EMPTY IS THE HONEST DEFAULT. Google reads a Person block as
   * a credential claim, so nothing goes in here that the owner has not stated.
   * The rule at the top of this file — do not invent people or credentials —
   * bites hardest on exactly this field.
   */
  background?: string;
}

export const FOUNDER: Author = {
  id: "danny",
  name: SITE.founder.name,
  role: SITE.founder.title,
  path: "/authors/danny/",
  bio: SITE.founder.bio,
  accountability:
    "Daniel is accountable for every recommendation published on BotPlanet and for keeping BotMatch independent of commission.",
  portrait: {
    src: "/media/authors/danny.webp",
    alt: "Daniel Allan, founder and editorial owner of BotPlanet.",
  },
  covers:
    "The buying guides, the best-of shortlists, the comparison tables and the BotMatch scoring — and final sign-off on everything else.",
};

/**
 * Reviews Editor, added 10 August 2026 by the owner's decision.
 *
 * EVERYTHING HERE WAS SUPPLIED, NOT RESEARCHED. The rule at the top of this
 * file is that we do not invent people or credentials, and it applies with the
 * most force to a named individual whose details feed a Person block that a
 * search engine reads as a claim about a real person's expertise. Her role,
 * her pages and her background came from Danny; nothing has been added around
 * them — no years, no specialisms, no awards, no titles she was not given.
 */
export const REVIEWS_EDITOR: Author = {
  id: "michelle-choa",
  name: "Michelle Choa",
  role: "Reviews Editor",
  path: "/authors/michelle-choa/",
  /* The bio covers the job here. What she did BEFORE BotPlanet lives in
     `background` and is printed once, under its own heading — the two used to
     say the same thing twice, on the page and again inside the Person node. */
  bio:
    "Michelle Choa is BotPlanet's Reviews Editor. Every product review on the site is hers: what each machine does, who should buy something else, and which figures its maker will not publish.",
  accountability:
    "Michelle is accountable for the product reviews on BotPlanet: the specifications transcribed into each table, the rule-outs, and the sections recording what a manufacturer will not publish.",
  portrait: {
    src: "/media/authors/michelle-choa.webp",
    alt: "Michelle Choa, Reviews Editor at BotPlanet.",
  },
  covers:
    "Every product review on the site — what each machine does, who should buy something else, and which figures its maker refuses to state.",
  background: "Publisher, and formerly a writer for Tropical magazine.",
};

/** Every named author, keyed by id. The author pages are built from this. */
export const AUTHORS: Record<string, Author> = {
  [FOUNDER.id]: FOUNDER,
  [REVIEWS_EDITOR.id]: REVIEWS_EDITOR,
};

export const authorById = (id: string): Author | undefined => AUTHORS[id];

/**
 * Who a product review belongs to.
 *
 * THE DEFAULT LIVES HERE RATHER THAN IN SIXTY-THREE RECORDS. Reviews are the
 * Reviews Editor's by definition of the job, so the byline is a property of
 * the page TYPE and only the exceptions are worth writing down. Stamping the
 * same id onto every review would be sixty-three chances to miss one, and the
 * sixty-fourth review would ship unattributed.
 *
 * `authorId` on a review overrides it, which is what a guest piece or a review
 * Danny writes himself would use.
 *
 * NOTE THE ASYMMETRY WITH EDITORIAL.author BELOW, which is the founder and
 * covers the guides, the best-of shortlists and the comparison tables. Two page
 * types, two defaults, and neither of them is "whoever was here first".
 */
export const authorForReview = (authorId?: string): Author =>
  (authorId ? AUTHORS[authorId] : undefined) ?? REVIEWS_EDITOR;

/**
 * The review "voice" attached to editorial pages. Until an independent
 * fact-checker is appointed, editorial accountability sits with the founder,
 * stated plainly rather than dressed up as a larger team.
 */
export const EDITORIAL = {
  author: FOUNDER,
  reviewer: FOUNDER,
  /** How current recommendations are actually produced (shown to readers). */
  method:
    "Research-led. Recommendations are built from manufacturer specifications, verified retailer data and aggregated owner feedback — not paid placement. Where we have not physically used a unit, we say so.",
  standingLabel: "Research-led review · not yet hands-on tested",
} as const;

/** Evidence labels — the only vocabulary allowed for product claims. */
export const EVIDENCE_LABELS = {
  researched: { label: "Researched", tone: "muted", desc: "Compiled from public manufacturer and retailer information." },
  manufacturer_verified: { label: "Manufacturer data verified", tone: "ok", desc: "Confirmed against the manufacturer's official specification." },
  retailer_checked: { label: "Retailer data checked", tone: "ok", desc: "Price and availability checked at an approved US retailer." },
  hands_on: { label: "Hands-on tested", tone: "class", desc: "BotPlanet physically used this unit under our review method." },
  review_unit: { label: "Review unit supplied", tone: "class", desc: "Unit supplied for review; editorial independence retained." },
  customer_evidence: { label: "Customer evidence reviewed", tone: "muted", desc: "Aggregated from verified owner reviews and reported experience." },
} as const;

export type EvidenceKey = keyof typeof EVIDENCE_LABELS;
