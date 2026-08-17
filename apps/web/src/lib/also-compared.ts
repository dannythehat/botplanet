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
import { ANTI_RECOMMENDED, NO_OFFER_BY_DESIGN, PRODUCT_ID } from "../content/products";
import { productNameOf, specValue } from "./decision-tables";

/** True when we refuse the sale of this product in writing. */
function isRefused(slug: string): boolean {
  const id = PRODUCT_ID[slug];
  return Boolean(id && NO_OFFER_BY_DESIGN[id]);
}

/**
 * True when our own copy argues against buying this machine.
 *
 * THE PICKER RECOMMENDED BOTH OF THEM. The window hub's FAQ names two machines
 * it will not recommend, and this block offered the 298 on the W2 PRO's page
 * and the W1 PRO on the W2 PRO Omni's — the site arguing against a machine in
 * one paragraph and volunteering it in the next. The verdict lived in prose,
 * so nothing could see it. It is a register now. See ANTI_RECOMMENDED.
 */
function isAntiRecommended(slug: string): boolean {
  return slug in ANTI_RECOMMENDED;
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
  /* POWER TYPE DROPPED TO LAST, 14 August 2026. It was first, and it is the
     weakest characteristic in the category: corded-or-cordless splits eleven
     machines into two heaps and says nothing about whether either suits the
     reader. The captions gave it away in their own words — "shares the same
     power type" appeared on eight pages, which is the picker admitting it
     matched on nothing useful, and it put a $159 floor-only skimmer beside a
     $2,199 flagship. Surfaces first: what a machine actually cleans is the
     thing a reader is choosing between. */
  "robotic-pool-cleaners": [
    { label: "the same surfaces", match: ["Surfaces"] },
    { label: "the same power type", match: ["Power type"] },
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
  /* Refused OR argued against. Both fall back in only when the category has
     nothing else, and neither ever carries the "closest thing we hold"
     wording — a machine we tell people to skip is not a recommendation. */
  const buyable = all.filter((s) => !isRefused(s.slug) && !isAntiRecommended(s.slug));
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

/**
 * The category hub, offered only when nothing else could be.
 *
 * A CATEGORY'S FIRST REVIEW HAS NO SIBLINGS, which is obvious in hindsight and
 * was not handled: Grillbot arrived on 10 August as the only grill review, so
 * there was no head-to-head and no nearest sibling, and the block fell to a
 * single link. The hub is the honest thing to offer a reader in that position —
 * it explains the category rather than pretending a comparison exists — and it
 * is deliberately LAST, so it never displaces a real product comparison on any
 * page that has one.
 */
function categoryHub(r: ReviewContent): AlsoLink | null {
  const path = `/robots/${r.categorySlug}/`;
  const route = ROUTES.find((x) => x.path === path && x.status === "live");
  if (!route) return null;
  return {
    href: path,
    title: route.title ?? "The category explained",
    because: "What to look for before picking a model, and who should not buy one at all.",
  };
}

/* The neighbour's surfaces, named as a neighbour's rather than dressed as this
   category's own. Both say "related" in their reason text so a reader is never
   told a snow blower belongs in a mower comparison. */
function relatedCompare(categorySlug: string): AlsoLink | null {
  const path = `/compare/${categorySlug}/`;
  const route = ROUTES.find((x) => x.path === path && x.status === "live");
  if (!route) return null;
  return {
    href: path,
    title: route.title ?? "Compare the related range",
    because: "The closest category we hold a full catalogue for, side by side on the same columns.",
  };
}

function relatedHub(categorySlug: string): AlsoLink | null {
  const path = `/robots/${categorySlug}/`;
  const route = ROUTES.find((x) => x.path === path && x.status === "live");
  if (!route) return null;
  return {
    href: path,
    title: route.title ?? "The related category explained",
    because: "The nearest category with a full catalogue, and where this machine's platform came from.",
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
  /* Only when the product comparisons could not fill the block. */
  if (out.length < 2) {
    const hub = categoryHub(r);
    if (hub && !seen.has(hub.href)) out.push(hub);
  }

  /* AND ONLY WHEN THE CATEGORY ITSELF OFFERS NOTHING, which is not the same
     situation as a category's first review. A hidden category has no hub route
     at all, so every one of the four fallbacks above returns null and the
     block renders empty. See ReviewContent.relatedCategorySlug for why
     borrowing a neighbour's surfaces is the honest answer rather than
     inventing a sibling. */
  if (out.length < 2 && r.relatedCategorySlug) {
    for (const link of [
      relatedCompare(r.relatedCategorySlug),
      relatedHub(r.relatedCategorySlug),
    ]) {
      if (link && !seen.has(link.href) && out.length < 3) {
        seen.add(link.href);
        out.push(link);
      }
    }
  }
  return out.slice(0, 3);
}
