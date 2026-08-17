/**
 * WHAT THE SEARCH RESULT ACTUALLY SHOWS.
 *
 * A title and a meta description are not documentation — they are the advert,
 * and they are the only part of a page most people ever read. Google renders
 * roughly 600px of title and around 155-160 characters of description, then
 * stops mid-word. Everything past that is written for nobody.
 *
 * WHY THIS FILE EXISTS. On 7 August 2026 an audit of the pages built that day
 * found TEN OF NINETEEN records over the limit, the worst at 195 characters —
 * a description whose last third could never appear in a result. Nothing in
 * the repository checked it, so every page written since launch had been free
 * to drift, and each one drifted a little further because a longer sentence
 * always reads better in an editor than it does in a SERP.
 *
 * The keyword register already asserts that a page CONTAINS the term it wants.
 * This asserts that the two lines competing for the click are the right size to
 * be seen. Those are different failures and both are silent.
 */
import { describe, expect, it } from "vitest";
import { EDITORIAL } from "../src/content/editorial";
import { CATEGORY_HERO } from "../src/content/category-hero";
import { REVIEWS } from "../src/content/reviews";
import { COMPARE_PAGES } from "../src/content/compare-page";
import { PRODUCTION_HOST, buildMeta } from "../src/lib/seo";

/** Google truncates around here. Beyond it, the words are written for nobody. */
const MAX_DESCRIPTION = 160;
/** ~600px. Sixty characters is the usual safe proxy for it. */
const MAX_TITLE = 60;
/**
 * Below this a description is not using the space it has been given, which is
 * a wasted advert rather than a broken one.
 */
const MIN_DESCRIPTION = 70;

interface Row {
  id: string;
  seoTitle: string;
  metaDescription: string;
}

const rows: Row[] = [
  ...Object.values(EDITORIAL).map((e) => ({
    id: e.path,
    seoTitle: e.seoTitle,
    metaDescription: e.metaDescription,
  })),
  ...Object.entries(CATEGORY_HERO).map(([slug, h]) => ({
    id: `/robots/${slug}/`,
    seoTitle: h.seoTitle,
    metaDescription: h.metaDescription,
  })),
  /* REVIEWS AND COMPARE PAGES WERE NOT CHECKED UNTIL 8 August 2026, and the
     reviews are the largest page type on the site by a distance.

     The rule below was written for editorial pages and hubs and simply never
     extended, so a crawl of all 81 live pages found NINETEEN of thirty-nine
     review and compare records outside these limits — four titles truncating
     in the result and eighteen descriptions running past 160 characters, one
     of them to 212. Ten of the descriptions opened with the same wasted
     twenty-eight characters, "An honest review of the <product>:", before
     saying anything a searcher could use.

     A limit that covers the small page types and not the big one is not a
     limit. */
  ...Object.entries(REVIEWS).map(([slug, r]) => ({
    id: `review:${slug}`,
    seoTitle: r.seoTitle,
    metaDescription: r.metaDescription,
  })),
  ...Object.entries(COMPARE_PAGES).map(([slug, c]) => ({
    id: `/compare/${slug}/`,
    seoTitle: c.seoTitle,
    metaDescription: c.metaDescription,
  })),
];

/**
 * FOUR CATEGORY HUBS ARE KNOWINGLY OVER AND ARE NOT QUIETLY FIXED HERE.
 *
 * Hub hero copy comes from the locked Category Page Template, and BLUEPRINT §9
 * is explicit that a builder does not approve its own change to owner-locked
 * content. Rewriting four hub titles to make a test pass would be exactly that,
 * so they are listed instead — visible on every run, impossible to forget, and
 * waiting on a decision rather than on somebody noticing.
 *
 * Remove a line the moment its copy is approved and shortened. The list may
 * only ever get shorter; a new page cannot join it, because a new page has no
 * lock to respect.
 */
const AWAITING_OWNER_APPROVAL = new Set<string>([
  /* All four were approved and shortened by the owner on 7 August 2026, the
     day after this list was written. It is deliberately left in place and
     empty: the mechanism is the point, and the next locked page that breaches
     the limit needs somewhere to sit that is visible rather than silent. */
]);

const checked = rows.filter((r) => !AWAITING_OWNER_APPROVAL.has(r.id));

describe("what the search result shows", () => {
  it.each(checked.map((r) => r.id))("%s has a title that fits the result", (id) => {
    const r = checked.find((x) => x.id === id)!;
    expect(
      r.seoTitle.length,
      `"${r.seoTitle}" is ${r.seoTitle.length} chars and truncates in the SERP`,
    ).toBeLessThanOrEqual(MAX_TITLE);
    expect(r.seoTitle.length).toBeGreaterThan(20);
  });

  it.each(checked.map((r) => r.id))("%s has a description that fits the result", (id) => {
    const r = checked.find((x) => x.id === id)!;
    expect(
      r.metaDescription.length,
      `${r.metaDescription.length} chars — the last ${r.metaDescription.length - MAX_DESCRIPTION} are written for nobody`,
    ).toBeLessThanOrEqual(MAX_DESCRIPTION);
    expect(
      r.metaDescription.length,
      `${r.metaDescription.length} chars — short enough to be wasting the space`,
    ).toBeGreaterThanOrEqual(MIN_DESCRIPTION);
  });

  /**
   * A description that repeats the title verbatim gives a searcher one piece of
   * information rendered twice, in the one place where two would fit.
   */
  it.each(checked.map((r) => r.id))("%s does not repeat its title in its description", (id) => {
    const r = checked.find((x) => x.id === id)!;
    expect(r.metaDescription.toLowerCase()).not.toContain(r.seoTitle.toLowerCase());
  });

  /**
   * The exemption list is a debt register, so it has to stay honest in both
   * directions: an entry that no longer breaches must be removed, or the list
   * grows into permission to ignore the rule.
   */
  it("keeps no stale entry in the owner-approval list", () => {
    const stale = [...AWAITING_OWNER_APPROVAL].filter((id) => {
      const r = rows.find((x) => x.id === id);
      return r && r.seoTitle.length <= MAX_TITLE && r.metaDescription.length <= MAX_DESCRIPTION;
    });
    expect(stale, "these now pass and should be removed from the exemption list").toEqual([]);
  });

  it("reports every hub still waiting on approval", () => {
    const over = rows
      .filter((r) => AWAITING_OWNER_APPROVAL.has(r.id))
      .map((r) => `  ${r.id} → title ${r.seoTitle.length}/${MAX_TITLE}, description ${r.metaDescription.length}/${MAX_DESCRIPTION}`);
    if (over.length) {
      console.warn(`\n[serp-display] ${over.length} owner-locked hub(s) over the display limit:\n${over.join("\n")}`);
    }
    expect(Array.isArray(over)).toBe(true);
  });
});

/**
 * THE ROBOTS DIRECTIVE, WHICH IS TWO DECISIONS AND NOT ONE.
 *
 * `noindex` says do not rank this page. `nofollow` says do not use any link on
 * it. Sending them together on the production domain throws away the
 * breadcrumbs, the header and the footer of a page that is genuinely linked and
 * genuinely crawlable — /botmatch/<category>/ sits on every category hub and
 * links back into the catalogue.
 *
 * A preview host is the one case where the full stop is right: nothing on
 * workers.dev should be crawled at all, because every URL on it duplicates one
 * on botplanet.io.
 */
describe("robots directives", () => {
  const meta = (noindex: boolean, host: string) =>
    buildMeta({ title: "t", description: "d", path: "/x/", noindex }, host).robots;

  it("keeps crawling through a page it declines to index", () => {
    expect(meta(true, PRODUCTION_HOST)).toBe("noindex, follow");
  });

  it("indexes and follows by default", () => {
    expect(meta(false, PRODUCTION_HOST)).toBe("index, follow");
  });

  it("stops a preview host dead, indexable or not", () => {
    expect(meta(false, "botplanet-web.dannythehat2.workers.dev")).toBe("noindex, nofollow");
    expect(meta(true, "botplanet-web.dannythehat2.workers.dev")).toBe("noindex, nofollow");
  });

  it("reads the production host with a port on it", () => {
    expect(meta(false, `${PRODUCTION_HOST}:8787`)).toBe("index, follow");
  });
});
