/**
 * Awin API client.
 *
 * Same contract as the CJ client: the token is read from the Worker secret at
 * call time, never stored, never returned, and redacted out of any error string.
 * Every function returns data or a typed refusal — none throws a value that
 * could carry a credential into a log.
 *
 * The endpoints below are the ones verified against the live API on 2026-07-31,
 * so the only thing between this file and a populated WYBOT feed is the
 * advertiser's approval and the separate datafeed key.
 */
import {
  AWIN_DATAFEED_SECRET_REF,
  AWIN_ENDPOINTS,
  AWIN_PUBLISHER_ID,
  AWIN_TOKEN_SECRET_REF,
  AWIN_WYBOT_US_ADVERTISER_ID,
  matchWybotModel,
  type AwinImageRecord,
  type AwinProgramme,
  type AwinRelationshipStatus,
} from "../content/media/awin";

export interface AwinUnavailable {
  ok: false;
  reason: "no_credential" | "unauthorized" | "no_relationship" | "network_error" | "malformed_response";
  detail: string;
}

export type AwinResult<T> = ({ ok: true } & T) | AwinUnavailable;

function token(env: Record<string, unknown> | undefined, key: string): string | null {
  const v = env?.[key];
  return typeof v === "string" && v.length > 0 ? v : null;
}

/** Strips anything credential-shaped before it is stored or displayed. */
export function redactAwin(text: string): string {
  return text
    .replace(/Bearer\s+[A-Za-z0-9._~+/=-]+/gi, "Bearer [redacted]")
    .replace(/apikey\/[A-Za-z0-9._~+/=-]+/gi, "apikey/[redacted]")
    .replace(/(authorization|token|access_token|api[_-]?key)["'\s:=]+[A-Za-z0-9._~+/=-]{8,}/gi, "$1=[redacted]");
}

async function get<T>(
  url: string,
  env: Record<string, unknown> | undefined,
  fetchImpl: typeof fetch = fetch,
): Promise<AwinResult<{ data: T }>> {
  const t = token(env, AWIN_TOKEN_SECRET_REF);
  if (!t) {
    return { ok: false, reason: "no_credential", detail: `no ${AWIN_TOKEN_SECRET_REF} in the environment; set it as a Worker secret to enable Awin ingestion` };
  }

  let res: Response;
  try {
    res = await fetchImpl(url, { headers: { Authorization: `Bearer ${t}` } });
  } catch (e) {
    return { ok: false, reason: "network_error", detail: redactAwin(String(e)) };
  }

  if (res.status === 401 || res.status === 403) {
    let body = "";
    try {
      body = await res.text();
    } catch {
      body = "";
    }
    // Awin uses 401 for BOTH "bad token" and "you are not in this programme".
    // Collapsing them would turn a pending application into a credential alarm.
    if (/missing\.relationship|No relationship exists/i.test(body)) {
      return { ok: false, reason: "no_relationship", detail: "the publisher is not joined to this advertiser, so its terms and feed are gated" };
    }
    return { ok: false, reason: "unauthorized", detail: `Awin returned HTTP ${res.status}; the token is missing, expired or lacks scope` };
  }

  try {
    return { ok: true, data: (await res.json()) as T };
  } catch (e) {
    return { ok: false, reason: "malformed_response", detail: redactAwin(String(e)) };
  }
}

/* ------------------------------------------------------------------ */
/* Relationship                                                        */
/* ------------------------------------------------------------------ */

interface AwinProgrammeRow {
  id: number;
  name: string;
  currencyCode?: string;
  status?: string;
  displayUrl?: string;
  primaryRegion?: { name?: string; countryCode?: string };
}

/**
 * Reads the live relationship for one advertiser by asking each bucket in turn.
 *
 * Awin has no "what is my status with X" endpoint — it has per-relationship
 * listings — so the status is established by which list the advertiser appears
 * in. An advertiser in none of them has never been applied for.
 */
export async function fetchRelationshipStatus(
  advertiserId = AWIN_WYBOT_US_ADVERTISER_ID,
  env?: Record<string, unknown>,
  fetchImpl: typeof fetch = fetch,
): Promise<AwinResult<{ status: AwinRelationshipStatus; programme: AwinProgramme | null }>> {
  for (const rel of ["joined", "pending", "rejected"] as const) {
    const res = await get<AwinProgrammeRow[]>(`${AWIN_ENDPOINTS.programmes}?relationship=${rel}`, env, fetchImpl);
    if (!res.ok) return res;
    const row = res.data.find((p) => String(p.id) === String(advertiserId));
    if (!row) continue;
    return {
      ok: true,
      status: rel,
      programme: {
        advertiserId: String(row.id),
        name: row.name,
        countryCode: row.primaryRegion?.countryCode ?? "",
        currencyCode: row.currencyCode ?? "",
        displayUrl: row.displayUrl ?? "",
        programmeStatus: row.status ?? "",
        relationship: rel,
        // A programme is only usable on the US site when it IS the US
        // programme and we are actually joined to it.
        usableForUsSite: rel === "joined" && row.primaryRegion?.countryCode === "US",
        apiVerifiedDate: null,
        notes: "",
      },
    };
  }
  return { ok: true, status: "notjoined", programme: null };
}

/** True when the stored relationship no longer matches what Awin reports. */
export function isAwinStatusStale(stored: AwinRelationshipStatus, live: AwinRelationshipStatus): boolean {
  return stored !== live;
}

/* ------------------------------------------------------------------ */
/* Programme terms                                                     */
/* ------------------------------------------------------------------ */

/**
 * Terms are readable only once joined. A `no_relationship` result is the normal,
 * expected answer while an application is pending — it is returned as its own
 * reason so a caller can tell "waiting on the advertiser" apart from "our
 * credential broke".
 */
export async function fetchProgrammeTerms(
  advertiserId = AWIN_WYBOT_US_ADVERTISER_ID,
  env?: Record<string, unknown>,
  fetchImpl: typeof fetch = fetch,
): Promise<AwinResult<{ details: unknown }>> {
  const res = await get<unknown>(`${AWIN_ENDPOINTS.programmeDetails}?advertiserId=${advertiserId}`, env, fetchImpl);
  if (!res.ok) return res;
  return { ok: true, details: res.data };
}

/* ------------------------------------------------------------------ */
/* Product feed                                                        */
/* ------------------------------------------------------------------ */

export interface AwinFeedSummary {
  advertiserId: string;
  totalRows: number;
  matched: number;
  rejectedSiblings: number;
  images: AwinImageRecord[];
}

interface FeedRow {
  aw_product_id?: string;
  product_name?: string;
  merchant_image_url?: string;
  alternate_image?: string;
  brand_name?: string;
  last_updated?: string;
  data_feed_id?: string;
}

/**
 * Turns product-feed rows into image records, rejecting siblings on the way.
 *
 * Rows arrive from the Awin datafeed, which needs its own key — the OAuth token
 * is rejected by productdata.awin.com. The parsing is separated from the fetch
 * so the matching logic can be tested against real feed shapes before the
 * credential exists.
 */
export function ingestFeedRows(rows: FeedRow[]): AwinFeedSummary {
  const images: AwinImageRecord[] = [];
  let rejected = 0;

  for (const row of rows) {
    const title = [row.brand_name, row.product_name].filter(Boolean).join(" ");
    const match = matchWybotModel(title);
    if (!match.productId) {
      if (/variant token/.test(match.reason)) rejected += 1;
      continue;
    }
    const common = {
      productId: match.productId,
      exactModel: match.exactModel!,
      feedId: row.data_feed_id ?? null,
      lastUpdated: row.last_updated ?? null,
      matchConfidence: match.confidence,
      width: null,
      height: null,
    };
    if (row.merchant_image_url) {
      images.push({ ...common, awinReference: `${row.aw_product_id ?? "row"}:primary`, role: "primary", url: row.merchant_image_url });
    }
    if (row.alternate_image) {
      images.push({ ...common, awinReference: `${row.aw_product_id ?? "row"}:alt`, role: "alternate", url: row.alternate_image });
    }
  }

  return { advertiserId: AWIN_WYBOT_US_ADVERTISER_ID, totalRows: rows.length, matched: images.length, rejectedSiblings: rejected, images };
}

/**
 * Lists the datafeeds available to the publisher. Requires the datafeed key,
 * which is a different credential from the OAuth token — passing the token here
 * fails, and the refusal says which secret is actually needed.
 */
export async function fetchDatafeedList(
  env?: Record<string, unknown>,
  fetchImpl: typeof fetch = fetch,
): Promise<AwinResult<{ csv: string }>> {
  const key = token(env, AWIN_DATAFEED_SECRET_REF);
  if (!key) {
    return {
      ok: false,
      reason: "no_credential",
      detail: `no ${AWIN_DATAFEED_SECRET_REF} in the environment. This is NOT the OAuth token: productdata.awin.com takes a separate datafeed key from Toolbox → Create-a-Feed.`,
    };
  }
  try {
    const res = await fetchImpl(`${AWIN_ENDPOINTS.datafeedList}/${key}`);
    if (res.status >= 400) {
      return { ok: false, reason: "unauthorized", detail: `Awin datafeed list returned HTTP ${res.status}` };
    }
    return { ok: true, csv: await res.text() };
  } catch (e) {
    return { ok: false, reason: "network_error", detail: redactAwin(String(e)) };
  }
}

export { AWIN_PUBLISHER_ID };
