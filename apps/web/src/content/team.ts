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
 * fact-checker) is an owner decision — do not invent people or credentials.
 *
 * THE TEAM EXPANDED ON 10 AUGUST 2026 and the rule held. Michelle Choa's role,
 * her pages and her background came from the owner. Everything else on both
 * author pages is a description of work that exists in this repository and can
 * be checked against it: the reviews are countable, the dated decisions below
 * are in docs/ and in the commit history, and the commission isolation is
 * enforced by a type and four tests rather than by a promise.
 *
 * That is the only kind of expertise claim this file permits. "Fifteen years in
 * robotics" is unfalsifiable and would be worth nothing the first time somebody
 * looked; "found that the machine behind 9,900 searches a month has no listing,
 * on this date, and here is the page" is worth a great deal and is true.
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
   * Decisions this person made that a reader can go and check.
   *
   * THE ONLY EXPERTISE CLAIM THIS SITE MAKES. Not years, not units handled, not
   * a former employer nobody can verify — specific editorial calls, dated, each
   * one leading to a page that still says what it says. It is the difference
   * between asserting judgement and showing it, and it is the only version of
   * the claim that survives being checked.
   */
  notableWork?: { date: string; what: string }[];
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
  bio:
    "Daniel Allan founded BotPlanet to answer the question the robot market keeps dodging: which machine is right for your house, and when you should not buy one at all. He owns the buying guides, the best-of shortlists and the comparison tables, and he built BotMatch — the recommendation engine that scores every product on suitability before it is allowed to see which retailer pays.",
  accountability:
    "Daniel is accountable for every recommendation published on BotPlanet and for keeping BotMatch independent of commission.",
  portrait: {
    src: "/media/authors/danny.webp",
    alt: "Daniel Allan, founder and editorial owner of BotPlanet.",
  },
  covers:
    "The buying guides, the best-of shortlists, the comparison tables and the BotMatch scoring — and final sign-off on everything else.",
  notableWork: [
    {
      date: "2026-08-09",
      what:
        "Refused to link the only Amazon listing for Living.AI's EMO after its own details table returned the brand EMOPET, it asked fifty dollars more than the maker's own store, and Living.AI's staff stated on their forum that their store is the only legitimate source. The review still runs; it sends nobody anywhere.",
    },
    {
      date: "2026-08-10",
      what:
        "Removed three products from BotMatch's recommendation pool after finding the funnel could name a robot whose company has ceased operations and whose servers are switched off. A page saying do not buy this stays published; it must never come back as the answer to which should I buy.",
    },
    {
      date: "2026-08-10",
      what:
        "Rebuilt the budget factor in the scoring engine, which had been treating a machine one tier over the reader's budget as exactly as suitable as one a tier under it. A budget is a ceiling stated as a range.",
    },
    {
      date: "2026-08-10",
      what:
        "Found the answer-folding bug that had been discarding four of a reader's five answers before the scorer ever saw them, in all three places the site folds an answer — the server, the browser and the audit that was supposed to catch it.",
    },
  ],
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
    "Michelle Choa is BotPlanet's Reviews Editor and writes every product review on the site — sixty-three of them across nine categories. She works to a rule most review sites do not: a figure reaches a specification table only if a manufacturer published it, and where one refuses to publish, the review says so under its own heading rather than borrowing a number from a review site that borrowed it from another review site.",
  accountability:
    "Michelle is accountable for the product reviews on BotPlanet: the specifications transcribed into each table, the rule-outs, and the sections recording what a manufacturer will not publish.",
  portrait: {
    src: "/media/authors/michelle-choa.webp",
    alt: "Michelle Choa, Reviews Editor at BotPlanet.",
  },
  covers:
    "Every product review on the site — what each machine does, who should buy something else, and which figures its maker refuses to state.",
  background: "Publisher, and formerly a writer for Tropical magazine.",
  notableWork: [
    {
      date: "2026-08-10",
      what:
        "Established that roborock's S8 MaxV Ultra — 9,900 searches a month — has no first-party listing on Amazon US at all, and that every result carrying the name is a third-party accessory kit. The review is built on the machine roborock actually sells and opens by saying what happened to the one people are searching for.",
    },
    {
      date: "2026-08-10",
      what:
        "Corrected the eufy E15's rated area from a quarter acre to eufy's own 800 m² — a 26% overstatement on the one figure that decides whether a mower can finish a lawn, and the figure the matcher rules machines out on.",
    },
    {
      date: "2026-08-10",
      what:
        "Removed a large-cat claim from Casa Leo's Leo's Loo Too against the maker's own stated 20 lb ceiling, after finding it was the box the matcher had been naming for large-cat queries — on an alphabetical tie-break.",
    },
    {
      date: "2026-08-10",
      what:
        "Declined to record obstacle avoidance for the Dreame X40 Ultra and mop lifting for the X50 Ultra, because Dreame's own pages could not be read and the listings do not claim either. Under-claiming is recoverable by reading the page later; over-claiming is a bad recommendation shipped today.",
    },
    {
      date: "2026-08-08",
      what:
        "Refused a product brief naming a Dreame A1, which does not exist as a current product, and a Mammotion Luba 2, which Mammotion's own page marks superseded. Both were built on the machines those makers actually sell, judged on their own rather than substituted silently.",
    },
  ],
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
