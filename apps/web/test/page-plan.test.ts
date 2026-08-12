/**
 * THE ANTI-DRIFT GATE.
 *
 * On 6 August 2026 fifteen pages were written and pushed with no build pack
 * behind any of them. OWNER-LOCKED BLUEPRINT v1.0 §7 requires one — section
 * order, exact images assigned to each section, products, schema — approved by
 * the owner before a builder starts. Nothing in the repository stopped a page
 * being built without it, so the builder invented the specification while
 * writing, and eleven pages shipped with no images at all.
 *
 * A note in a document does not stop that. This does.
 *
 * Every assertion below is one of the specific failures of that day, turned
 * into something that breaks the build instead of being noticed later.
 */
import { describe, expect, it } from "vitest";
import { PAGE_PLAN, planFor, readinessGaps, type PagePlan } from "../src/content/seo/page-plan";
import { ROUTES } from "../src/content/routes";
import { REVIEWS } from "../src/content/reviews";
import { keywordsFor } from "../src/content/seo/keyword-register";

const built = PAGE_PLAN.filter((p) => p.status === "built");

describe("the page plan covers reality", () => {
  it("gives every plan a unique path", () => {
    const paths = PAGE_PLAN.map((p) => p.path);
    expect(new Set(paths).size, "two plans claim the same URL").toBe(paths.length);
  });

  /**
   * THE ONE THAT WOULD HAVE STOPPED 6 AUGUST. A page may not be live unless it
   * was planned first. Reversed from the usual direction deliberately: the
   * question is not "is every plan built" — plenty are legitimately unbuilt —
   * it is "was every built thing planned".
   */
  it("has a plan for every live indexable route", () => {
    const unplanned = ROUTES.filter(
      (r) =>
        r.status === "live" &&
        r.indexable &&
        r.category &&
        !["/robots/", "/compare/", "/best-robots/", "/guides/", "/deals/"].includes(r.path) &&
        !planFor(r.path),
    ).map((r) => r.path);
    expect(unplanned, "live pages with no entry in the page plan").toEqual([]);
  });

  it("has a plan for every published review", () => {
    const unplanned = Object.values(REVIEWS)
      .map((r) => `/robots/${r.categorySlug}/${r.slug}/`)
      .filter((path) => !planFor(path));
    expect(unplanned, "reviews written with no page plan behind them").toEqual([]);
  });

  it("marks a plan built only if the route registry agrees it is live", () => {
    for (const p of built) {
      // Reviews are dynamic routes and correctly absent from the registry.
      if (p.type === "review") continue;
      const route = ROUTES.find((r) => r.path === p.path);
      expect(route, `${p.path} is planned as built but has no route`).toBeDefined();
      expect(route!.status, `${p.path} is planned as built but its route is not live`).toBe("live");
    }
  });
});

describe("cannibalisation is prevented, not remembered", () => {
  /**
   * One primary term, one URL. This is the rule the whole keyword map rests on
   * and it has never been machine-checked until now.
   */
  it("never lets two pages claim the same primary term", () => {
    const seen = new Map<string, string>();
    const clashes: string[] = [];
    for (const p of PAGE_PLAN) {
      const term = p.primary.term.toLowerCase();
      const owner = seen.get(term);
      if (owner) clashes.push(`"${term}" claimed by both ${owner} and ${p.path}`);
      else seen.set(term, p.path);
    }
    expect(clashes).toEqual([]);
  });

  /**
   * A ceded term has to go somewhere real, and the page it names has to
   * actually want it. "I gave it to that page" is worthless if that page never
   * took it.
   */
  it("cedes every term to a page that actually owns it", () => {
    const owns = (path: string, term: string) => {
      const target = planFor(path);
      if (!target) return false;
      const t = term.toLowerCase();
      return (
        target.primary.term.toLowerCase() === t ||
        target.secondary.some((s) => s.term.toLowerCase() === t)
      );
    };

    const broken: string[] = [];
    for (const p of PAGE_PLAN) {
      for (const c of p.ceded) {
        if (!planFor(c.toPath)) {
          broken.push(`${p.path} cedes "${c.term}" to ${c.toPath}, which has no plan`);
        } else if (!owns(c.toPath, c.term)) {
          broken.push(`${p.path} cedes "${c.term}" to ${c.toPath}, which does not target it`);
        }
      }
    }
    expect(broken).toEqual([]);
  });

  /**
   * THE GAP THAT LET /best-robots/window-cleaning-robots/ EXIST FOR FIVE DAYS.
   *
   * The assertion above compares primary against primary, so two pages fighting
   * for one term pass it as long as only one of them CALLS it their primary.
   * The window hub declared "best window cleaning robot" in its secondary list
   * on 5 August, with a research note saying the two terms share six of the top
   * ten results and a second page would compete with it. A best-of page was
   * built on 7 August with that exact term as its primary. Nothing failed.
   *
   * Declaring a term at all is a claim on it. Taking it as your primary when
   * another page has already declared it is the cannibalisation this whole
   * registry exists to prevent.
   */
  it("never lets one page take another's declared term as its primary", () => {
    /**
     * ONE UNRESOLVED CLASH, LISTED RATHER THAN PATTERN-MATCHED so a second one
     * cannot join it quietly, and it is a MEASUREMENT the owner has to
     * commission rather than a tidy-up.
     *
     * /guides/robotic-pets-for-elderly/ declares "joy for all companion pets"
     * at 1,900/mo; the Joy For All review declares the same term as its PRIMARY
     * at 880. Two research runs measured one phrase and disagreed by a factor
     * of two, and the guide's own comment says the review was "CANCELLED rather
     * than deferred" — after which the review was built anyway, because the
     * product was already live in D1 with a working buy button.
     *
     * Which page should own it needs a SERP overlap reading between the two,
     * the same measurement that decided window (6 of 10, one page) and lawn
     * (2 of 10, two pages). Guessing it here would be the mistake this test was
     * written to catch, wearing a different hat.
     */
    const AWAITING_A_SERP_READING = new Set(["joy for all companion pets"]);

    const clashes: string[] = [];
    for (const p of PAGE_PLAN) {
      const term = p.primary.term.toLowerCase();
      if (AWAITING_A_SERP_READING.has(term)) continue;
      for (const other of PAGE_PLAN) {
        if (other.path === p.path) continue;
        // Ceding it is the sanctioned way to hand a term over, and a page that
        // has ceded a term is not competing for it.
        if (other.ceded.some((c) => c.term.toLowerCase() === term)) continue;
        if (other.secondary.some((s) => s.term.toLowerCase() === term)) {
          clashes.push(`${p.path} takes "${term}" as its primary, but ${other.path} also targets it`);
        }
      }
    }
    expect(clashes).toEqual([]);
  });

  it("never cedes a term to itself", () => {
    for (const p of PAGE_PLAN) {
      for (const c of p.ceded) expect(c.toPath, `${p.path} cedes to itself`).not.toBe(p.path);
    }
  });

  it("gives every ceded term a reason worth reading", () => {
    for (const p of PAGE_PLAN) {
      for (const c of p.ceded) expect(c.why.length, `${p.path}: "${c.term}" has a thin reason`).toBeGreaterThan(25);
    }
  });
});

describe("a plan is complete before it is built", () => {
  /**
   * BLUEPRINT §7. Keywords, products, links, images and schema are declared
   * before a builder starts — not discovered while writing.
   */
  it.each(built.map((p) => p.path))("%s declared everything except artwork", (path) => {
    const p = planFor(path)!;
    // Images are handled by their own assertion below, because artwork is
    // supplied by the owner on a different clock from the writing.
    const gaps = readinessGaps(p).filter((g) => !g.includes("image(s) not supplied"));
    expect(gaps, `${path} was built with an incomplete plan`).toEqual([]);
  });

  /**
   * BLUEPRINT §4 and §5: visual-first, and "no page made primarily of long
   * black screens of text". This does not fail the build — artwork arrives
   * after the words by the owner's own instruction of 6 August — but it names
   * every page that is currently text-only, so the list can never be lost.
   */
  it("reports every built page still waiting on artwork", () => {
    const waiting = built
      .map((p) => ({ path: p.path, missing: p.images.filter((i) => !i.supplied).map((i) => i.slot) }))
      .filter((r) => r.missing.length > 0);

    // Deliberately not an assertion that fails. It prints, so the gap is
    // visible on every run rather than living in somebody's memory.
    if (waiting.length) {
      console.warn(
        `\n[page-plan] ${waiting.length} built page(s) awaiting artwork:\n` +
          waiting.map((w) => `  ${w.path} → ${w.missing.join(", ")}`).join("\n"),
      );
    }
    expect(Array.isArray(waiting)).toBe(true);
  });

  it("never plans a page with no reason to exist", () => {
    for (const p of PAGE_PLAN) {
      expect(p.evidence.length, `${p.path} has no evidence for existing`).toBeGreaterThan(30);
      expect(p.intent.length, `${p.path} has no stated search intent`).toBeGreaterThan(20);
      expect(p.research.length, `${p.path} names no research run`).toBeGreaterThan(3);
    }
  });

  it("links every page to somewhere else on the site", () => {
    for (const p of PAGE_PLAN) {
      if (p.type === "botmatch" || p.images.length === 0 && p.type === "guide") continue;
      expect(p.linksOut.length, `${p.path} is a dead end`).toBeGreaterThan(0);
    }
  });
});

describe("the plan and the keyword register agree", () => {
  /**
   * Two files hold keyword assignments: this plan, and the register that is
   * asserted against rendered copy. If they disagree, one of them is lying
   * about what a page targets and there is no way to tell which.
   */
  it.each(built.filter((p) => p.type !== "botmatch").map((p) => p.path))(
    "%s targets the same primary term in both files",
    (path) => {
      const plan = planFor(path)!;
      const reg = keywordsFor(path);
      if (!reg) return; // index pages legitimately have no register row
      expect(reg.primary.term.toLowerCase(), `${path} disagrees with the keyword register`).toBe(
        plan.primary.term.toLowerCase(),
      );
    },
  );
});

/**
 * THE URL CARRIES THE KEYWORD.
 *
 * Added 6 August 2026 after `/best-robots/robotic-pool-cleaners/above-ground/`
 * was written for the query "robotic pool cleaner for above ground pool". The
 * slug was a dangling adjective — "cordless" describes the machine, so it
 * stands alone; "above-ground" describes the POOL, so on its own it says the
 * wrong thing about what the page lists. Renamed to `above-ground-pools`.
 *
 * This is basic and it should not have needed catching by eye, so it is
 * checked now. The rule is not "the slug equals the keyword" — that produces
 * ugly stuffed URLs. It is "every distinctive word of the primary keyword
 * appears somewhere in the path", which the category and section segments
 * usually satisfy for free.
 */
describe("the URL carries the primary keyword", () => {
  const STOP = new Set([
    "the","a","for","and","of","best","my","should","i","buy","vs","with",
    "to","in","on","is","it","are","do","robot","robots","robotic",
  ]);
  const words = (s: string) =>
    s.toLowerCase().replace(/[^a-z0-9 ]/g, " ").split(/\s+/).filter((w) => w && !STOP.has(w));

  /**
   * A review's slug is the MODEL NAME and deliberately omits "review" — that
   * is the convention every review site uses and Google matches the model, not
   * the suffix. Bolting `-review` onto eleven URLs would be worse than the gap.
   */
  /**
   * ONE LIVE URL IS KNOWINGLY EXEMPT AND IT IS AN OPEN OWNER DECISION.
   *
   * /robots/companion-robots/ targets "robot pet" — 8,100/mo at KD 0 — because
   * "companion robot" is only 4,400 and its SERP returns Wikipedia, Chinese
   * tech-news outlets and humanoid-launch stories rather than shopping. The
   * keyword choice is right and the URL carries the weaker term.
   *
   * It is NOT quietly fixed here because that URL is live, indexed, in the
   * sitemap, in D1 as a category slug, in the nav and in every internal link
   * pointing at the category. Renaming it is a redirect exercise with real
   * risk, and it is the owner's call rather than a builder's tidy-up.
   *
   * Listed rather than pattern-matched, so a second one cannot join it by
   * accident.
   */
  const LIVE_URL_DECISIONS = new Set(["/robots/companion-robots/"]);

  /**
   * URLS THAT DELIBERATELY DO NOT CARRY THEIR TERM, BECAUSE THE TERM NAMES A
   * MACHINE THAT IS NOT ON THE SHELF.
   *
   * "roborock s8 maxv ultra" is 9,900/mo and there is no first-party listing
   * for it on Amazon US — checked 10 August 2026, and every result carrying
   * that exact string in its title was a third-party accessory kit. What
   * roborock sells in its place is the S8 Max Ultra, so that is what the
   * product record, the page title and the URL say.
   *
   * The alternative is a URL reading `roborock-s8-maxv-ultra` on a page about
   * a machine that does not carry the name. That is worth more to a ranking
   * algorithm and less to the person who arrives, and this site resolves that
   * trade in the reader's favour. The page still targets the term, still
   * contains it, and opens by explaining what happened to it.
   *
   * Listed rather than pattern-matched, so a second one cannot join it by
   * accident. Remove the entry if roborock ever lists the machine again.
   */
  const TERM_NAMES_A_MISSING_PRODUCT = new Set([
    "/robots/robot-vacuums/roborock-s8-max-ultra/",
  ]);

  const exempt = (p: (typeof PAGE_PLAN)[number], missing: string[]) =>
    LIVE_URL_DECISIONS.has(p.path) ||
    TERM_NAMES_A_MISSING_PRODUCT.has(p.path) ||
    (p.type === "review" && missing.every((m) => m === "review")) ||
    // A version number cannot survive slugification: "botley 2.0" -> botley-2.
    missing.every((m) => /^\d+$/.test(m)) ||
    /* A POSSESSIVE CANNOT SURVIVE SLUGIFICATION EITHER. "Leo's Loo Too"
       slugifies to leo-loo-too, and the search term people type is "leos loo
       too" with the apostrophe dropped rather than the s. So the word is
       "leos", the path has "leo", and the URL is right while the substring
       test is wrong. Only the possessive stem is forgiven, and only when the
       stem itself is in the path — "cats" would not pass against "cat-litter"
       unless the path genuinely carried it. */
    missing.every((m) => m.endsWith("s") && p.path.toLowerCase().includes(m.slice(0, -1)));

  it.each(
    PAGE_PLAN.filter((p) => p.type !== "compare" && p.type !== "botmatch").map((p) => p.path),
  )("%s", (path) => {
    const p = planFor(path)!;
    const kw = words(p.primary.term);
    if (!kw.length) return;
    const missing = kw.filter((w) => !path.toLowerCase().includes(w));
    if (!missing.length || exempt(p, missing)) return;
    throw new Error(
      `URL omits "${missing.join('", "')}" from its primary keyword "${p.primary.term}" (${p.primary.volume}/mo)`,
    );
  });
});
