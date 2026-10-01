/**
 * THE PAGE FILE: the one structured document a best-of page is written as.
 *
 * Zod is the source of truth. docs/page-system/PAGE_SCHEMA.json is GENERATED from
 * this file by `npm run page:schema` — never edited by hand.
 *
 * WHAT IS DELIBERATELY NOT A FIELD.
 *  - price and rating. A figure typed into a page file is a figure that starts
 *    going stale the day it is committed, and a rating we did not collect is one
 *    we invented. Prices come from the price service with the date they were
 *    read; ratings are not published at all until we have our own. The schema
 *    has nowhere to put either, so a page cannot carry one.
 *  - affiliate links. A product's buy button resolves from the catalogue's
 *    redirect key. The page names a product; it never names a URL.
 */
import { z } from "zod";
import {
  HERO_DESKTOP,
  META_DESCRIPTION_MAX,
  META_DESCRIPTION_MIN,
  MIN_FAQ,
  MIN_PICKS,
  SEO_TITLE_MAX,
  SEO_TITLE_MIN,
} from "./rules";

const slug = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "lowercase letters, digits and hyphens only");
const sitePath = z.string().regex(/^\/[a-z0-9\-/]*\/$/, "an absolute path that starts and ends with /");
const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "YYYY-MM-DD");
const mediaPath = z.string().regex(/^\/media\/[a-z0-9\-/._]+\.webp$/, "a /media/... .webp path");

export const PickSchema = z.object({
  /** Product slug. Must be a published catalogue product (checked by the page test). */
  product: slug,
  /** Short enough for a chip: "Best documented", "Best for heavy debris". */
  award: z.string().min(3).max(40),
  /** Why it wins that award, in plain English. */
  why: z.string().min(60),
  /** Who should buy something else. Required: a pick with no downside is an advert. */
  not_for: z.string().min(20),
  /** Two to four things in its favour. Say whose claim it is when it is the maker's. */
  pros: z.array(z.string().min(5)).min(2).max(4),
  /** One to three things to know before buying. Required for the same reason as not_for. */
  cons: z.array(z.string().min(5)).min(1).max(3),
});

export const GlanceSchema = z
  .object({
    /** The prose heading id the table sits ahead of, so it lands inside the article. */
    before_heading_id: z.string().min(3),
    columns: z.array(z.string().min(2)).min(3).max(6),
    /** Product slug to one value per column. Use "Not stated" where the maker is silent. */
    rows: z.record(slug, z.array(z.string().min(1))),
    note: z.string().min(20),
  })
  .superRefine((g, ctx) => {
    for (const [product, cells] of Object.entries(g.rows)) {
      if (cells.length !== g.columns.length) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `${product} has ${cells.length} cells for ${g.columns.length} columns`,
        });
      }
    }
  });

export const BestOfPageSchema = z.object({
  page_type: z.literal("best-of"),
  path: sitePath,
  category: slug,
  eyebrow: z.string().min(5).max(48),
  /** The H1. There is exactly one per page, and it comes from here. */
  title: z.string().min(10).max(80),
  seo_title: z.string().min(SEO_TITLE_MIN).max(SEO_TITLE_MAX),
  meta_description: z.string().min(META_DESCRIPTION_MIN).max(META_DESCRIPTION_MAX),
  standfirst: z.string().min(80).max(320),
  /** Must agree with content/seo/keyword-register.ts, which stays the authority. */
  keywords: z.object({
    primary: z.string().min(3),
    secondary: z.array(z.string().min(3)).min(2),
  }),
  /** false only for a page that should not be indexed. */
  index: z.boolean().default(true),
  dates: z.object({
    /** The day the page first went live. Article schema is emitted only with this. */
    published: isoDate,
    reviewed: isoDate,
  }),
  hero: z.object({
    desktop: mediaPath,
    /** Optional until a portrait crop exists; the template falls back to desktop. */
    mobile: mediaPath.nullable().default(null),
    alt: z.string().min(40, "describe the picture in a full sentence"),
    focal: z.string().regex(/^\d{1,3}% \d{1,3}%$/).default("50% 50%"),
    /** The words set on the picture itself, when the generator put any there. */
    headline: z.string().max(40).nullable().default(null),
    source: z.string().min(5, "say who made or supplied the picture"),
  }),
  /** Markdown file in src/articles/, without the extension. */
  prose: slug,
  layout: z
    .object({
      /** Contents block ahead of the picks. On for any page with four or more picks. */
      contents_first: z.boolean().default(true),
      /** A row of Amazon buttons straight under the hero. */
      quick_buy: z.boolean().default(true),
    })
    .default({}),
  picks: z.array(PickSchema).min(MIN_PICKS),
  /** Product slugs in the comparison table and the buy strip. */
  comparison: z.array(slug).min(MIN_PICKS),
  glance: GlanceSchema,
  buy_strip: z.object({
    heading: z.string().min(5),
    intro: z.string().min(40),
    disclosure: z.string().min(40),
  }),
  related: z.object({
    heading: z.string().min(5),
    intro: z.string().min(40),
    /** Floor-and-wall robots or sibling products shown as cards with their own buy button. */
    products: z.array(slug).min(2).max(4),
    links: z.array(z.object({ href: sitePath, label: z.string().min(5) })).min(3),
  }),
  faq: z.array(z.object({ q: z.string().min(10), a: z.string().min(40) })).min(MIN_FAQ),
});

export type BestOfPage = z.infer<typeof BestOfPageSchema>;
export const HERO_SIZE = HERO_DESKTOP;
