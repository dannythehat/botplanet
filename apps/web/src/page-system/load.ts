/**
 * Reads every page file in content/pages/ and turns it into what the site renders.
 *
 * A page file that breaks the schema THROWS HERE, at import, so the build, the
 * dev server and the tests all fail on the same line with the same message. There
 * is no state where a malformed page quietly renders half a page.
 */
import { BestOfPageSchema, type BestOfPage } from "./schema";
import type { EditorialContent } from "../content/editorial";

const modules = import.meta.glob("../content/pages/*.page.json", { eager: true, import: "default" });

export const PAGE_FILES: BestOfPage[] = Object.entries(modules).map(([file, raw]) => {
  const parsed = BestOfPageSchema.safeParse(raw);
  if (!parsed.success) {
    const issues = parsed.error.issues.map((i) => `  ${i.path.join(".") || "(page)"}: ${i.message}`).join("\n");
    throw new Error(`Page file ${file} does not meet the BotPlanet page schema:\n${issues}`);
  }
  return parsed.data;
});

export function pageFileFor(path: string | undefined): BestOfPage | undefined {
  return path ? PAGE_FILES.find((p) => p.path === path) : undefined;
}

/** The ids the template gives its own sections, so the contents block can link to them. */
export const SECTION_IDS = { buy: "where-to-buy", related: "more-pool-robots", faq: "faq" } as const;

export function pageFileToEditorial(p: BestOfPage): EditorialContent {
  return {
    path: p.path,
    categorySlug: p.category,
    eyebrow: p.eyebrow,
    title: p.title,
    seoTitle: p.seo_title,
    metaDescription: p.meta_description,
    standfirst: p.standfirst,
    image: { src: p.hero.desktop, alt: p.hero.alt, focal: p.hero.focal },
    heroMobileSrc: p.hero.mobile ?? undefined,
    prose: p.prose,
    picks: p.picks.map((k) => ({ productSlug: k.product, award: k.award, why: k.why, wrongFor: k.not_for, pros: k.pros, cons: k.cons })),
    comparisonSlugs: p.comparison,
    faq: p.faq,
    published: p.dates.published,
    lastReviewed: p.dates.reviewed,
    contentsFirst: p.layout.contents_first,
    centered: p.layout.centered,
    hideComparisonTable: !p.layout.comparison_table,
    extraContents: [
      { id: SECTION_IDS.buy, text: p.buy_strip.heading },
      { id: SECTION_IDS.related, text: p.related.heading },
      { id: SECTION_IDS.faq, text: "Questions people actually ask" },
    ],
  };
}
