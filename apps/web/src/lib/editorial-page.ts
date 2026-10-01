/**
 * Assembling a best-of or guide page.
 *
 * The three editorial pages do exactly the same work — compile the prose,
 * read the catalogue, turn declared picks into rendered ones, build the
 * comparison rows — and the only thing that differs is which record they
 * pass in. Doing it here means the page files are six lines each and cannot
 * drift apart.
 *
 * THE PICKS ARE JOINED TO THE CATALOGUE, NOT RETYPED. content/editorial.ts
 * declares a product slug and an argument; every fact rendered beside it —
 * name, what it cleans, how big a pool it is rated for, its price band —
 * comes from the D1 row. That is the difference between a best-of page and
 * a best-of page that still says "up to 40 ft" two years after the maker
 * revised it.
 *
 * A PICK WHOSE PRODUCT IS NOT PUBLISHED IS DROPPED, LOUDLY IN DEV. The
 * alternative is a page that renders an award with no product behind it, or
 * one that throws in production because a catalogue row was archived. The
 * page stays up, minus the pick, and the console says which one went.
 */
import { eq, and } from "drizzle-orm";
import { getDb, schema } from "./db";
import { comparisonRows, type ComparableProduct } from "../content/comparison";
import type { ComparisonRow } from "../components/ComparisonTable.astro";
import { redirectKeysByProduct } from "./catalogue-redirects";
import type { RenderedPick } from "../components/PickList.astro";
import type { EditorialContent } from "../content/editorial";
import { injectFigures } from "./review-figures";

/* Compiled at build time, the same way review prose is. Eager, because there
   are three of them and a lazy import would buy nothing. */
const ARTICLE_PROSE = import.meta.glob<{ compiledContent: () => string | Promise<string> }>(
  "../articles/*.md",
  { eager: true },
);

export interface EditorialPageData {
  html: string;
  picks: RenderedPick[];
  comparison: ComparisonRow[];
}

export async function buildEditorialPage(
  article: EditorialContent,
  locals: App.Locals,
  dev = false,
): Promise<EditorialPageData> {
  const mod = ARTICLE_PROSE[`../articles/${article.prose}.md`];
  if (!mod) {
    throw new Error(
      `No prose at src/articles/${article.prose}.md for ${article.path}. ` +
        `An editorial record without its Markdown is a half-built page, not a page with a gap.`,
    );
  }
  /* Figures go in before the internal linker runs, the same order the review
     path uses: the linker works on prose text and must not be handed an image
     tag to chew on. */
  const html = injectFigures(await mod.compiledContent(), article.figures, dev);

  const db = getDb(locals);
  const cat = (
    await db
      .select()
      .from(schema.categories)
      .where(eq(schema.categories.slug, article.categorySlug))
      .limit(1)
  )[0];
  if (!cat) throw new Error(`No category row for ${article.categorySlug}`);

  const published = await db
    .select()
    .from(schema.products)
    .where(and(eq(schema.products.categoryId, cat.id), eq(schema.products.status, "published")));

  /* Only the slugs this page declares, so a product joining the category later
     cannot appear on a page whose argument never covered it — and so the
     cordless page can never print a corded machine. */
  const allowed = published.filter((p) => article.comparisonSlugs.includes(p.slug));
  const redirectByProduct = await redirectKeysByProduct(db);

  const comparable = (p: (typeof published)[number]): ComparableProduct => ({
    id: p.id,
    slug: p.slug,
    name: p.name,
    environments: p.environments as string[],
    cleans: p.cleans as string[],
    powerType: p.powerType,
    priceTier: p.priceTier,
    maxPoolLengthFt: p.maxPoolLengthFt,
    maxPoolAreaSqFt: (p as { maxPoolAreaSqFt?: number | null }).maxPoolAreaSqFt ?? null,
    redirectKey: redirectByProduct.get(p.id) ?? null,
  });

  const comparison = comparisonRows(allowed.map(comparable), cat.slug);

  /* Built from the same rows as the table, so a pick and its row can never
     disagree about what a machine cleans or how big a pool it takes. */
  const byId = new Map(comparison.map((r) => [r.productId, r]));

  const picks: RenderedPick[] = [];
  for (const pick of article.picks) {
    const product = published.find((p) => p.slug === pick.productSlug);
    const row = product ? byId.get(product.id) : undefined;
    if (!product || !row) {
      if (dev) {
        console.warn(
          `[editorial] ${article.path}: pick "${pick.award}" dropped — ` +
            `${pick.productSlug} is not a published product in ${article.categorySlug}` +
            (product ? " (missing from comparisonSlugs)" : ""),
        );
      }
      continue;
    }
    picks.push({
      ...pick,
      name: row.name,
      href: row.href,
      band: row.band,
      cleans: row.cleans,
      power: row.power,
      poolSize: row.poolSize,
      /* So the card can label its own facts. A companion robot does not clean
         anything and has no pool-size rating; without this the pick prints
         "Cleans: companionship" and "Rated for: Not disclosed". */
      categorySlug: article.categorySlug,
      /* So the pick can offer the next step a buyer wants. A best-of is the page
         a reader arrives on when they have decided to buy, and until this its
         only action was "Read the full review" — the buy buttons were in a table
         ~11,700px further down. */
      redirectKey: redirectByProduct.get(product.id) ?? null,
    });
  }

  return { html, picks, comparison };
}
