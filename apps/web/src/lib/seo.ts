/**
 * Reusable SEO + structured-data system.
 *
 * Rules honoured:
 *  - Canonical + OG URLs always point at the production domain, so the
 *    workers.dev preview never competes for indexing.
 *  - Any host that is not the production domain is served `noindex` (preview
 *    protection) — computed from the request host in Base.astro.
 *  - No fabricated Review / aggregateRating is ever emitted. Ratings only
 *    appear where a real, attributable review exists.
 */

import { SITE } from "./site";

export const SITE_URL = "https://botplanet.io";
export const PRODUCTION_HOST = "botplanet.io";
export const OG_IMAGE_DEFAULT = "/og/botplanet-default.png";

/** Absolute production URL for a path (always canonical to botplanet.io). */
export function absUrl(path: string): string {
  if (/^https?:\/\//.test(path)) return path;
  return SITE_URL + (path.startsWith("/") ? path : "/" + path);
}

export interface MetaInput {
  title: string;
  description: string;
  /** Canonical path on the production domain, e.g. "/robots/…/". */
  path: string;
  ogImage?: string;
  /** "website" | "article" | "product". */
  ogType?: string;
  noindex?: boolean;
}

export interface ResolvedMeta {
  title: string;
  description: string;
  canonical: string;
  ogTitle: string;
  ogDescription: string;
  ogType: string;
  ogImage: string;
  ogUrl: string;
  twitterCard: string;
  robots: string;
}

/** True when the current request host is not the production domain. */
export function isPreviewHost(host: string | undefined | null): boolean {
  if (!host) return false;
  return host.split(":")[0].toLowerCase() !== PRODUCTION_HOST;
}

export function buildMeta(input: MetaInput, host?: string | null): ResolvedMeta {
  const preview = isPreviewHost(host);
  const noindex = input.noindex || preview;
  /**
   * NOINDEX AND NOFOLLOW ARE DIFFERENT DECISIONS AND WERE BEING MADE TOGETHER.
   *
   * Every noindexed page on the production domain was also sending `nofollow`,
   * which tells a crawler to discard every link on the page — the breadcrumbs,
   * the header, the whole footer. That is right for a preview host, where the
   * point is to keep the duplicate out of the index entirely. It is wrong for a
   * real, linked page we simply do not want ranked: /botmatch/<category>/ is
   * reachable from every category hub and links back into the catalogue, and
   * `nofollow` was throwing those away.
   *
   * So: a page we choose not to index still gets crawled through, and only a
   * host that should not be crawled at all gets the full stop.
   */
  const robots = preview
    ? "noindex, nofollow"
    : noindex
      ? "noindex, follow"
      : "index, follow";
  const image = absUrl(input.ogImage ?? OG_IMAGE_DEFAULT);
  return {
    title: input.title,
    description: input.description,
    canonical: absUrl(input.path),
    ogTitle: input.title,
    ogDescription: input.description,
    ogType: input.ogType ?? "website",
    ogImage: image,
    ogUrl: absUrl(input.path),
    twitterCard: "summary_large_image",
    robots,
  };
}

/* ------------------------------------------------------------------ */
/* JSON-LD builders — each returns a plain object for the schema graph. */
/* ------------------------------------------------------------------ */

export function organizationSchema() {
  return {
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: "BotPlanet",
    url: SITE_URL,
    /* The brand logo, not the favicon. This used to point at /favicon.svg —
       a 16px browser-tab glyph offered to Google as the organisation's logo,
       which is the wrong image and too small to be used for anything. */
    logo: {
      "@type": "ImageObject",
      "@id": `${SITE_URL}/#logo`,
      url: absUrl("/logo/botplanet-chrome-760w.webp"),
      width: 760,
      height: 229,
      caption: "BotPlanet",
    },
    description:
      "BotPlanet helps people discover, compare and choose useful real-world robots, starting with robotic pool cleaners in the United States.",
    slogan: SITE.tagline,
  };
}

export function websiteSchema() {
  return {
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: SITE_URL,
    name: "BotPlanet",
    publisher: { "@id": `${SITE_URL}/#organization` },
    inLanguage: "en-US",
    /* Declared only because /search/ genuinely answers ?q= — this is the one
       schema property that makes a promise Google will follow and test. */
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/search/?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

/**
 * The page itself, tied to the site and the organisation.
 *
 * Without this the graph described a website and a company but never the
 * document being read, leaving every page anonymous inside its own markup.
 */
export function webPageSchema(input: {
  path: string;
  name: string;
  description: string;
  type?: "WebPage" | "CollectionPage" | "AboutPage" | "ContactPage";
}) {
  return {
    "@type": input.type ?? "WebPage",
    "@id": `${absUrl(input.path)}#webpage`,
    url: absUrl(input.path),
    name: input.name,
    description: input.description,
    isPartOf: { "@id": `${SITE_URL}/#website` },
    about: { "@id": `${SITE_URL}/#organization` },
    inLanguage: "en-US",
  };
}

export interface Crumb {
  name: string;
  path: string;
}

export function breadcrumbSchema(items: Crumb[]) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: absUrl(c.path),
    })),
  };
}

export interface ProductOfferInput {
  priceMinor: number | null;
  currency?: string;
  /**
   * schema.org availability enum tail, e.g. "InStock".
   *
   * OMITTED WHEN THE STOCK STATE IS NOT KNOWN, rather than defaulted. This used
   * to fall back to "InStock", which is an invented claim in exactly the place
   * the site is strictest about not making them — the offer engine already
   * separates `priceShowable` from `stockShowable` precisely because a current
   * price and a known stock state are different facts.
   */
  availability?: string;
  url: string;
  seller?: string;
}

/** schema.org availability for a stock state, or null where we do not know. */
export const availabilityFor = (state: string): string | null =>
  ({
    in_stock: "InStock",
    low_stock: "LimitedAvailability",
    preorder: "PreOrder",
    backorder: "BackOrder",
    temporarily_unavailable: "OutOfStock",
    unavailable: "OutOfStock",
  })[state] ?? null;

export interface ProductSchemaInput {
  name: string;
  slug: string;
  path: string;
  brand: string;
  description: string;
  image?: string;
  offers: ProductOfferInput[];
}

/**
 * Product schema WITHOUT any aggregateRating/review unless legitimately
 * supplied elsewhere. Offers use real snapshot prices when present.
 */
export function productSchema(p: ProductSchemaInput) {
  const validOffers = p.offers.filter((o) => o.priceMinor != null);
  const prices = validOffers.map((o) => (o.priceMinor as number) / 100);
  /* An empty sku or brand is worse than an absent one: it asserts the field
     exists and is blank. Both are optional here because a Product built from a
     review knows the model and may not know the rest. */
  const base: Record<string, unknown> = {
    "@type": "Product",
    name: p.name,
    ...(p.slug ? { sku: p.slug } : {}),
    ...(p.brand ? { brand: { "@type": "Brand", name: p.brand } } : {}),
    ...(p.description ? { description: p.description } : {}),
    url: absUrl(p.path),
  };
  if (p.image) base.image = absUrl(p.image);
  if (validOffers.length === 1) {
    const o = validOffers[0];
    base.offers = {
      "@type": "Offer",
      price: ((o.priceMinor as number) / 100).toFixed(2),
      priceCurrency: o.currency ?? "USD",
      ...(o.availability ? { availability: `https://schema.org/${o.availability}` } : {}),
      url: absUrl(o.url),
    };
  } else if (validOffers.length > 1) {
    base.offers = {
      "@type": "AggregateOffer",
      priceCurrency: "USD",
      lowPrice: Math.min(...prices).toFixed(2),
      highPrice: Math.max(...prices).toFixed(2),
      offerCount: validOffers.length,
    };
  }
  return base;
}

export function itemListSchema(items: { name: string; path: string }[], name?: string) {
  return {
    "@type": "ItemList",
    name,
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      url: absUrl(it.path),
    })),
  };
}

export interface PersonInput {
  name: string;
  jobTitle: string;
  path: string;
  description?: string;
}

export function personSchema(p: PersonInput) {
  return {
    "@type": "Person",
    "@id": absUrl(p.path) + "#person",
    name: p.name,
    jobTitle: p.jobTitle,
    url: absUrl(p.path),
    ...(p.description ? { description: p.description } : {}),
    worksFor: { "@id": `${SITE_URL}/#organization` },
  };
}

export interface ArticleInput {
  headline: string;
  description: string;
  path: string;
  datePublished?: string;
  dateModified?: string;
  authorName: string;
  authorPath: string;
  image?: string;
}

export function articleSchema(a: ArticleInput) {
  return {
    "@type": "Article",
    headline: a.headline,
    description: a.description,
    mainEntityOfPage: absUrl(a.path),
    ...(a.image ? { image: absUrl(a.image) } : {}),
    ...(a.datePublished ? { datePublished: a.datePublished } : {}),
    ...(a.dateModified ? { dateModified: a.dateModified } : {}),
    author: { "@type": "Person", name: a.authorName, url: absUrl(a.authorPath) },
    publisher: { "@id": `${SITE_URL}/#organization` },
  };
}

export interface ReviewSchemaInput {
  /** The exact model reviewed. */
  itemName: string;
  itemBrand?: string | null;
  /** Catalogue slug, used as the Product sku. */
  itemSlug?: string;
  /** One line describing the machine, not the review. */
  itemDescription?: string;
  /**
   * Offers for the machine, ALREADY THROUGH THE PUBLICATION GATE.
   *
   * The caller passes an offer here on exactly the condition it prints the
   * price on the page — `publicationFor(offer).priceShowable`. Structured data
   * that says $329 while the page says "price not current" is the same lie told
   * to a machine instead of a reader, and it is the one Google penalises hardest
   * on an affiliate site. Where nothing is publishable the Product still ships,
   * without offers.
   */
  offers?: ProductOfferInput[];
  headline: string;
  description: string;
  path: string;
  dateModified?: string;
  authorName: string;
  authorPath: string;
  image?: string;
  /** The verdict, in the review's own words. */
  reviewBody: string;
  positiveNotes?: string[];
  negativeNotes?: string[];
}

/**
 * A Review of a product, with no rating.
 *
 * NO reviewRating IS EMITTED, DELIBERATELY. Google's Review markup expects a
 * score, and a score is exactly the thing BotPlanet has not earned: nothing
 * here has been tested in a pool. Inventing 4.2/5 to unlock a star in the
 * search result would be the single most rewarded lie available to this site.
 * The markup describes what the review is and who wrote it; the stars stay off
 * until there is testing behind them.
 *
 * positiveNotes / negativeNotes carry the "best for" and "not ideal for" lines,
 * which are claims we can actually stand behind.
 */
export function reviewSchema(r: ReviewSchemaInput) {
  const list = (items: string[] | undefined, name: string) =>
    items && items.length
      ? {
          "@type": "ItemList",
          name,
          itemListElement: items.map((text, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: text,
          })),
        }
      : undefined;

  return {
    "@type": "Review",
    "@id": `${absUrl(r.path)}#review`,
    headline: r.headline,
    description: r.description,
    reviewBody: r.reviewBody,
    mainEntityOfPage: absUrl(r.path),
    ...(r.image ? { image: absUrl(r.image) } : {}),
    ...(r.dateModified ? { dateModified: r.dateModified } : {}),
    author: { "@type": "Person", name: r.authorName, url: absUrl(r.authorPath) },
    publisher: { "@id": `${SITE_URL}/#organization` },
    /**
     * THE THING REVIEWED IS A PRODUCT, DESCRIBED AS ONE.
     *
     * This was `{ name, brand }` and nothing else, on all 38 review pages —
     * valid, and about as much use to a search engine as a page title. The
     * whole point of a review page on a shopping site is that the machine can
     * be identified and bought, and productSchema() has existed since launch
     * to say so; nothing had ever called it. Found 8 August 2026.
     *
     * Built by the same function the rest of the site would use, so there is
     * one Product shape here rather than two that drift.
     */
    itemReviewed: productSchema({
      name: r.itemName,
      slug: r.itemSlug ?? "",
      path: r.path,
      brand: r.itemBrand ?? "",
      description: r.itemDescription ?? r.description,
      image: r.image,
      offers: r.offers ?? [],
    }),
    ...(list(r.positiveNotes, "Best for") ? { positiveNotes: list(r.positiveNotes, "Best for") } : {}),
    ...(list(r.negativeNotes, "Not ideal for")
      ? { negativeNotes: list(r.negativeNotes, "Not ideal for") }
      : {}),
  };
}

export interface QA {
  q: string;
  a: string;
}

/** Only emit when there are genuine, page-visible Q&As. */
export function faqSchema(qas: QA[]) {
  if (!qas.length) return null;
  return {
    "@type": "FAQPage",
    mainEntity: qas.map((x) => ({
      "@type": "Question",
      name: x.q,
      acceptedAnswer: { "@type": "Answer", text: x.a },
    })),
  };
}

/** Wrap builders into one @graph document. Drops null/undefined entries. */
export function schemaGraph(...nodes: (Record<string, unknown> | null | undefined)[]) {
  return {
    "@context": "https://schema.org",
    "@graph": nodes.filter(Boolean),
  };
}

/* ------------------------------------------------------------------
   Category-hub schema.

   The approved research limits a category page to CollectionPage,
   BreadcrumbList, ItemList (only for products visibly listed),
   ImageObject (for the editorial images) and FAQPage (only for FAQs
   actually rendered). Review and AggregateRating are deliberately
   absent — those belong to the individual review pages, and emitting
   them here would claim ratings the page does not show.
   ------------------------------------------------------------------ */

export interface EditorialImageInput {
  /** Site-relative path, e.g. "/media/pool/hero-desktop.webp". */
  path: string;
  /** Same text as the rendered alt — the description must match what is visible. */
  caption: string;
  width: number;
  height: number;
}

export function imageObjectSchema(img: EditorialImageInput) {
  return {
    "@type": "ImageObject",
    "@id": absUrl(img.path) + "#image",
    contentUrl: absUrl(img.path),
    url: absUrl(img.path),
    caption: img.caption,
    width: img.width,
    height: img.height,
  };
}

export interface CollectionPageInput {
  /** Canonical path of the page. */
  path: string;
  /** The visible H1. */
  name: string;
  description: string;
  /** Images rendered on the page. The first is treated as the primary. */
  images?: EditorialImageInput[];
  /** Date the page content was last reviewed, ISO yyyy-mm-dd. */
  lastReviewed?: string;
}

export function collectionPageSchema(input: CollectionPageInput) {
  const images = input.images ?? [];
  return {
    "@type": "CollectionPage",
    "@id": absUrl(input.path) + "#page",
    url: absUrl(input.path),
    name: input.name,
    description: input.description,
    isPartOf: { "@id": `${SITE_URL}/#website` },
    publisher: { "@id": `${SITE_URL}/#organization` },
    ...(images.length
      ? {
          primaryImageOfPage: { "@id": absUrl(images[0].path) + "#image" },
          image: images.map((i) => ({ "@id": absUrl(i.path) + "#image" })),
        }
      : {}),
    ...(input.lastReviewed ? { dateModified: input.lastReviewed } : {}),
  };
}

/**
 * FAQPage, built from the questions the page actually renders.
 *
 * Takes the same array the FAQ component takes, so the structured data cannot
 * drift from the visible content — the failure mode Google penalises.
 */
export function faqPageSchema(items: { q: string; a: string }[], path: string) {
  if (!items.length) return null;
  return {
    "@type": "FAQPage",
    "@id": absUrl(path) + "#faq",
    mainEntity: items.map((i) => ({
      "@type": "Question",
      name: i.q,
      acceptedAnswer: { "@type": "Answer", text: i.a },
    })),
  };
}
