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
    robots: noindex ? "noindex, nofollow" : "index, follow",
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
  availability?: string; // schema.org availability enum tail e.g. "InStock"
  url: string;
  seller?: string;
}

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
  const base: Record<string, unknown> = {
    "@type": "Product",
    name: p.name,
    sku: p.slug,
    brand: { "@type": "Brand", name: p.brand },
    description: p.description,
    url: absUrl(p.path),
  };
  if (p.image) base.image = absUrl(p.image);
  if (validOffers.length === 1) {
    const o = validOffers[0];
    base.offers = {
      "@type": "Offer",
      price: ((o.priceMinor as number) / 100).toFixed(2),
      priceCurrency: o.currency ?? "USD",
      availability: `https://schema.org/${o.availability ?? "InStock"}`,
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
