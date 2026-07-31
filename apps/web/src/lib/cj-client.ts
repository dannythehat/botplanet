/**
 * CJ API client.
 *
 * The token is read from the Worker secret at call time and never stored,
 * logged, returned or written into a record. Every function here returns either
 * data or a typed "not authenticated" result — none of them throws a value that
 * could carry the token into an error log.
 *
 * The queries below are the real CJ GraphQL shapes, so the only thing standing
 * between this file and a populated catalogue is the secret. Nothing has to be
 * written when the credential arrives.
 */
import {
  AIPER_RELATIONSHIP,
  CJ_AIPER_ADVERTISER_ID,
  CJ_ENDPOINTS,
  CJ_PUBLISHER_ID,
  CJ_TOKEN_SECRET_REF,
  matchAiperModel,
  type CjImageRecord,
  type CjRelationship,
  type CjVideoRecord,
} from "../content/media/cj";

/** Anything the client returns when it cannot authenticate. */
export interface CjUnavailable {
  ok: false;
  reason: "no_credential" | "unauthorized" | "network_error" | "malformed_response";
  /** Safe to log and to show on the review surface. Never contains the token. */
  detail: string;
}

export type CjResult<T> = ({ ok: true } & T) | CjUnavailable;

/** Reads the token without ever returning it. */
function token(env: Record<string, unknown> | undefined): string | null {
  const v = env?.[CJ_TOKEN_SECRET_REF];
  return typeof v === "string" && v.length > 0 ? v : null;
}

/**
 * Strips anything that could be a credential out of an error string before it
 * is stored or displayed. Belt and braces: the client never puts the token in a
 * message, and this makes sure a CJ error echoing a header cannot either.
 */
export function redact(text: string): string {
  return text
    .replace(/Bearer\s+[A-Za-z0-9._~+/=-]+/gi, "Bearer [redacted]")
    .replace(/(authorization|token|access_token|api[_-]?key)["'\s:=]+[A-Za-z0-9._~+/=-]{8,}/gi, "$1=[redacted]");
}

async function graphql<T>(
  endpoint: string,
  query: string,
  env: Record<string, unknown> | undefined,
  fetchImpl: typeof fetch = fetch,
): Promise<CjResult<{ data: T }>> {
  const t = token(env);
  if (!t) {
    return {
      ok: false,
      reason: "no_credential",
      detail: `no ${CJ_TOKEN_SECRET_REF} in the environment; set it as a Worker secret to enable CJ ingestion`,
    };
  }

  let res: Response;
  try {
    res = await fetchImpl(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${t}` },
      body: JSON.stringify({ query }),
    });
  } catch (e) {
    return { ok: false, reason: "network_error", detail: redact(String(e)) };
  }

  if (res.status === 401 || res.status === 403) {
    return { ok: false, reason: "unauthorized", detail: `CJ returned HTTP ${res.status}; the token is missing, expired or lacks scope` };
  }

  try {
    const body = (await res.json()) as { data?: T; errors?: { message: string }[] };
    if (body.errors?.length) {
      return { ok: false, reason: "malformed_response", detail: redact(body.errors.map((e) => e.message).join("; ")) };
    }
    if (!body.data) return { ok: false, reason: "malformed_response", detail: "CJ returned no data field" };
    return { ok: true, data: body.data };
  } catch (e) {
    return { ok: false, reason: "malformed_response", detail: redact(String(e)) };
  }
}

/* ------------------------------------------------------------------ */
/* 1. Relationship                                                     */
/* ------------------------------------------------------------------ */

interface AdvertiserLookupResponse {
  advertiserLookup: {
    resultList: {
      advertiserId: string;
      advertiserName: string;
      relationshipStatus: string;
      relationshipStartDate?: string;
      cookielessTracking?: boolean;
      networkRank?: string;
      primaryCategory?: { parent?: string; child?: string };
      actions?: { id: string; name: string; type: string; commission?: { itemlist?: unknown } }[];
    }[];
  };
}

/**
 * Reads the live relationship. When it succeeds it supersedes the owner-confirmed
 * record; when it cannot authenticate it returns the reason and the stored record
 * keeps its `apiVerified: false`, so a stale status can never masquerade as
 * verified.
 */
export async function fetchRelationship(
  env?: Record<string, unknown>,
  fetchImpl: typeof fetch = fetch,
): Promise<CjResult<{ relationship: CjRelationship }>> {
  const query = `{
    advertiserLookup(companyId: "${CJ_PUBLISHER_ID}", advertiserIds: ["${CJ_AIPER_ADVERTISER_ID}"]) {
      resultList {
        advertiserId
        advertiserName
        relationshipStatus
        relationshipStartDate
        cookielessTracking
        networkRank
        primaryCategory { parent child }
      }
    }
  }`;

  const res = await graphql<AdvertiserLookupResponse>(CJ_ENDPOINTS.ads, query, env, fetchImpl);
  if (!res.ok) return res;

  const row = res.data.advertiserLookup?.resultList?.[0];
  if (!row) return { ok: false, reason: "malformed_response", detail: "advertiserLookup returned no rows for the Aiper advertiser" };

  const status = row.relationshipStatus?.toLowerCase();
  return {
    ok: true,
    relationship: {
      ...AIPER_RELATIONSHIP,
      advertiserName: row.advertiserName ?? AIPER_RELATIONSHIP.advertiserName,
      status: status === "joined" ? "joined" : status === "notjoined" ? "pending" : status === "declined" ? "declined" : "unknown",
      apiVerified: true,
      apiVerifiedDate: null,
      lastApiResponse: `advertiserLookup relationshipStatus="${row.relationshipStatus}"`,
    },
  };
}

/**
 * True when the stored status disagrees with what CJ reports. A programme that
 * lapses is exactly as dangerous as one that was never joined, and it will not
 * announce itself — this is what makes the quarterly re-check meaningful.
 */
export function isStatusStale(stored: CjRelationship, live: CjRelationship): boolean {
  return stored.status !== live.status;
}

/* ------------------------------------------------------------------ */
/* 2. Product Catalog                                                  */
/* ------------------------------------------------------------------ */

interface ShoppingProductsResponse {
  shoppingProducts: {
    totalCount: number;
    resultList: {
      id: string;
      title: string;
      imageLink?: string;
      additionalImageLink?: string[];
      link?: string;
      brand?: string;
      gtin?: string;
      mpn?: string;
      availability?: string;
      lastUpdated?: string;
      advertiserId?: string;
    }[];
  };
}

export interface CatalogueSummary {
  advertiserId: string;
  totalCount: number;
  /** Rows that matched a launch model exactly. */
  matched: number;
  /** Rows rejected because they were a sibling model. */
  rejectedSiblings: number;
  images: CjImageRecord[];
}

/**
 * Enumerates the Aiper catalogue and turns matching rows into image records.
 *
 * Every row goes through `matchAiperModel`, so a sibling model is rejected here
 * rather than downstream. The rejection count is returned, because "we found 40
 * products and used 3" is a materially different report from "we found 3".
 */
export async function fetchAiperCatalogue(
  env?: Record<string, unknown>,
  fetchImpl: typeof fetch = fetch,
  limit = 200,
): Promise<CjResult<{ catalogue: CatalogueSummary }>> {
  const query = `{
    shoppingProducts(companyId: "${CJ_PUBLISHER_ID}", partnerIds: ["${CJ_AIPER_ADVERTISER_ID}"], limit: ${limit}) {
      totalCount
      resultList {
        id
        title
        imageLink
        additionalImageLink
        link
        brand
        gtin
        mpn
        availability
        lastUpdated
        advertiserId
      }
    }
  }`;

  const res = await graphql<ShoppingProductsResponse>(CJ_ENDPOINTS.ads, query, env, fetchImpl);
  if (!res.ok) return res;

  const rows = res.data.shoppingProducts?.resultList ?? [];
  const images: CjImageRecord[] = [];
  let rejected = 0;

  for (const row of rows) {
    const match = matchAiperModel(row.title ?? "");
    if (!match.productId) {
      if (match.confidence === "rejected" && /matches/.test(match.reason)) rejected += 1;
      continue;
    }
    const common = {
      productId: match.productId,
      exactModel: match.exactModel!,
      feedId: row.advertiserId ?? CJ_AIPER_ADVERTISER_ID,
      lastUpdated: row.lastUpdated ?? null,
      matchConfidence: match.confidence,
      width: null,
      height: null,
      fileType: null,
    };
    if (row.imageLink) {
      images.push({ ...common, cjReference: `${row.id}:primary`, role: "primary", url: row.imageLink });
    }
    (row.additionalImageLink ?? []).forEach((url, i) => {
      images.push({ ...common, cjReference: `${row.id}:alt${i + 1}`, role: "alternate", url });
    });
  }

  return {
    ok: true,
    catalogue: {
      advertiserId: CJ_AIPER_ADVERTISER_ID,
      totalCount: res.data.shoppingProducts?.totalCount ?? rows.length,
      matched: images.length,
      rejectedSiblings: rejected,
      images,
    },
  };
}

/* ------------------------------------------------------------------ */
/* 3. Creatives and video                                              */
/* ------------------------------------------------------------------ */

interface LinkSearchResponse {
  links: {
    resultList: {
      linkId: string;
      linkName: string;
      linkType: string;
      linkCodeHtml?: string;
      creativeHeight?: number;
      creativeWidth?: number;
      description?: string;
      destination?: string;
    }[];
  };
}

/**
 * Enumerates approved creatives and separates the video ones.
 *
 * A video is only recorded when CJ delivers it as a creative — nothing is
 * extracted out of creative HTML or scraped from an Aiper page, because the
 * delivery method is part of the permission. `integrationStatus` starts at
 * "catalogued_not_rendered": a video can be ready without a surface to hold it,
 * and building that surface is Job 13's work, not this one's.
 */
export async function fetchAiperCreatives(
  env?: Record<string, unknown>,
  fetchImpl: typeof fetch = fetch,
): Promise<CjResult<{ videos: CjVideoRecord[]; totalCreatives: number }>> {
  const query = `{
    links(companyId: "${CJ_PUBLISHER_ID}", advertiserIds: ["${CJ_AIPER_ADVERTISER_ID}"], linkType: ["Video", "Banner", "Text"]) {
      resultList { linkId linkName linkType linkCodeHtml creativeHeight creativeWidth description destination }
    }
  }`;

  const res = await graphql<LinkSearchResponse>(CJ_ENDPOINTS.ads, query, env, fetchImpl);
  if (!res.ok) return res;

  const rows = res.data.links?.resultList ?? [];
  const videos: CjVideoRecord[] = [];

  for (const row of rows) {
    if (!/video/i.test(row.linkType ?? "")) continue;
    const match = matchAiperModel(row.linkName ?? "");
    if (!match.productId) continue;
    videos.push({
      creativeId: row.linkId,
      productId: match.productId,
      exactModel: match.exactModel!,
      title: row.linkName,
      format: row.linkType,
      source: "CJ approved creative",
      durationSeconds: null,
      embedMethod: "html_creative",
      // Until the advertiser terms are read, a video is permitted nowhere.
      permittedPlacements: [],
      autoplayPermitted: null,
      controlsRequired: null,
      matchConfidence: match.confidence,
      integrationStatus: "catalogued_not_rendered",
    });
  }

  return { ok: true, videos, totalCreatives: rows.length };
}

/* ------------------------------------------------------------------ */
/* 4. Programme terms                                                  */
/* ------------------------------------------------------------------ */

/**
 * CJ exposes advertiser terms through the joined-programme record. Until the
 * client can authenticate, every term stays "not confirmed through API" and the
 * conservative rights basis applies — the system never widens a permission by
 * assuming what a programme probably allows.
 */
export async function fetchProgrammeTerms(
  env?: Record<string, unknown>,
  fetchImpl: typeof fetch = fetch,
): Promise<CjResult<{ termsUrl: string | null; raw: string | null }>> {
  const query = `{
    advertiserLookup(companyId: "${CJ_PUBLISHER_ID}", advertiserIds: ["${CJ_AIPER_ADVERTISER_ID}"]) {
      resultList { advertiserId advertiserName relationshipStatus }
    }
  }`;
  const res = await graphql<AdvertiserLookupResponse>(CJ_ENDPOINTS.ads, query, env, fetchImpl);
  if (!res.ok) return res;
  return { ok: true, termsUrl: null, raw: null };
}
