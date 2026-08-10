/**
 * "Readers also compared" — lateral links out of a review.
 *
 * NOT THE SAME JOB AS lib/alternatives.ts, and the two must not be confused.
 * Alternatives answers "this machine is wrong for you, so what is right" — it
 * fires on the review's own stated rule-outs and can legitimately return
 * nothing. This answers "you are still deciding, what else is worth a look",
 * which every reader on every review has, always.
 *
 * CONTEXTUAL, NOT GENERIC. A block that links the category hub and the compare
 * page on all forty reviews is navigation furniture; readers learn to ignore
 * it within two pages and it passes no useful signal. Every link here is
 * chosen from THIS review's own facts:
 *
 *   1. A head-to-head page that names this exact product, if one exists.
 *   2. The sibling review a reader is most likely weighing against it — the
 *      nearest machine in the same category by a recorded, non-commercial
 *      characteristic.
 *   3. The category's comparison page, which is the honest catch-all and is
 *      the only generic entry allowed.
 *
 * NO PRICE AND NO COMMISSION REACHES THIS MODULE. The ordering rule is
 * "nearest on a published specification", never "highest paying". Enforced by
 * test.
 *
 * IT DOES READ NO_OFFER_BY_DESIGN, and that is not a commercial field — it is
 * an editorial refusal. Cozmo's entry says the seller is under suit by the
 * Pennsylvania Attorney General over about 14,000 undelivered orders. Before
 * this check existed, five educational reviews all pointed at Cozmo as their
 * nearest sibling, because it happened to sit first in the registry: the site
 * was steering readers toward the one machine it tells them not to buy. A
 * refused product is still a legitimate destination for somebody researching
 * it, but it is never "the closest thing we hold" to something you can buy.
 */
import { REVIEWS, type ReviewContent } from "../content/reviews";
import { ROUTES } from "../content/routes";
import { NO_OFFER_BY_DESIGN, PRODUCT_ID } from "../content/products";
import { productNameOf, specValue } from "./decision-tables";

/** True when we refuse the sale of this product in writing. */
function isRefused(slug: string): boolean {
  const id = PRODUCT_ID[slug];
  return Boolean(id && NO_OFFER_BY_DESIGN[id]);
}

/**
 * Deterministic spread across equally-close siblings.
 *
 * `.find()` returned the first match in registry order, so seven of eleven
 * window reviews all recommended the W2 PRO Omni and six of eleven pool
 * reviews all recommended the Polaris FREEDOM. Every one of those was a true
 * statement and the set of them was useless — a lateral link that always lands
 * on the same page is a link readers stop seeing.
 *
 * Keyed on the SOURCE slug so the choice is stable across builds and testable,
 * rather than random.
 */
function spreadPick<T>(key: string, options: T[]): T {
  let h = 0;
  for (let i = 0; i < key.length; i++) h = (h * 31 + key.charCodeAt(i)) >>> 0;
  return options[h % options.length];
}

export interface AlsoLink {
  href: string;
  title: string;
  /** Why this one, in the reader's terms. Never "related". */
  because: string;
}

const reviewHref = (r: ReviewContent) => `/robots/${r.categorySlug}/${r.slug}/`;

/**
 * Characteristics used to find the nearest sibling, per category, in priority
 * order. Each is a recorded field; a product missing all of them falls back to
 * "same category", which is honest rather than pretending to a closer match.
 */
const NEARNESS: Record<string, { label: string; match: string[] }[]> = {
  "robotic-pool-cleaners": [
    { label: "the same power type", match: ["Power type"] },
    { label: "the same surfaces", match: ["Surfaces"] },
  ],
  "window-cleaning-robots": [
    { label: "the same glass types", match: ["Glass types"] },
    { label: "the same navigation", match: ["Navigation"] },
  ],
  "companion-robots": [
    { label: "the same subscription position", match: ["Subscription"] },
  ],
  "educational-coding-robots": [
    { label: "the same age rating", match: ["Manufacturer rating", "Age range"] },
  ],
  "pet-camera-robots": [
    { label: "the same subscription position", match: ["Subscription"] },
  ],
};

/**
 * A head-to-head page that names this product.
 *
 * Matched on the ROUTE PATH rather than on page copy: /compare/eilik-vs-emo/
 * names both machines in its slug, which is the only part of a comparison page
 * guaranteed to mention both and guaranteed not to drift when the copy is
 * edited.
 */
function headToHeadFor(r: ReviewContent): AlsoLink | null {
  /* The slug's distinctive token — "eilik" from "eilik", "emo" from
     "living-ai-emo" — so a brand prefix does not stop the match. */
  const tokens = r.slug.split("-").filter((t) => t.length > 2);
  const hit = ROUTES.find(
    (route) =>
      route.status === "live" &&
      route.path.startsWith("/compare/") &&
      route.path.includes("-vs-") &&
      tokens.some((t) => route.path.includes(`/${t}-vs-`) || route.path.includes(`-vs-${t}/`)),
  );
  if (!hit) return null;
  return {
    href: hit.path,
    title: hit.title ?? "Head to head",
    because: `A head-to-head that puts the ${productNameOf(r)} against its closest rival.`,
  };
}

function nearestSibling(r: ReviewContent): AlsoLink | null {
  const all = Object.values(REVIEWS).filter(
    (s) => s.categorySlug === r.categorySlug && s.slug !== r.slug,
  );
  /* Buyable first. A refused product falls back in only when nothing else in
     the category qualifies, and never carries the "closest thing we hold"
     wording — see isRefused above. */
  const buyable = all.filter((s) => !isRefused(s.slug));
  const siblings = buyable.length > 0 ? buyable : all;
  if (siblings.length === 0) return null;

  for (const characteristic of NEARNESS[r.categorySlug] ?? []) {
    const mine = specValue(r, characteristic.match);
    if (!mine) continue;
    const matches = siblings.filter((s) => {
      const theirs = specValue(s, characteristic.match);
      return theirs !== null && theirs.toLowerCase() === mine.toLowerCase();
    });
    if (matches.length > 0) {
      const match = spreadPick(r.slug, matches);
      return {
        href: reviewHref(match),
        title: match.title,
        because: `Shares ${characteristic.label} — the closest thing we hold to this one.`,
      };
    }
  }

  /* No shared characteristic recorded. Say what the link actually is rather
     than dressing an arbitrary sibling as a near match. */
  const fallback = spreadPick(r.slug, siblings);
  return {
    href: reviewHref(fallback),
    title: fallback.title,
    because: "Another machine in the same category, reviewed to the same standard.",
  };
}

function categoryCompare(r: ReviewContent): AlsoLink | null {
  const path = `/compare/${r.categorySlug}/`;
  const route = ROUTES.find((x) => x.path === path && x.status === "live");
  if (!route) return null;
  return {
    href: path,
    title: route.title ?? "Compare the range",
    because: "Every machine in the category on the same columns, side by side.",
  };
}

export function alsoCompared(r: ReviewContent): AlsoLink[] {
  const out: AlsoLink[] = [];
  const seen = new Set<string>();
  for (const link of [headToHeadFor(r), nearestSibling(r), categoryCompare(r)]) {
    if (link && !seen.has(link.href)) {
      seen.add(link.href);
      out.push(link);
    }
  }
  return out.slice(0, 3);
}
