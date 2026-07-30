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
    logo: absUrl("/favicon.svg"),
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
