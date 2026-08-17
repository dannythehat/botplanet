/**
 * SerpApi implementation of the Amazon provider.
 *
 * SerpApi reads the live Amazon listing and returns its fields. That makes it a
 * relay of the retailer rather than a source in its own right, which is why its
 * output carries `retailer_api_via_aggregator` and a seven-day window: it does
 * not drift the way a written-down figure does, but a scheduled snapshot is
 * still a snapshot.
 *
 * TWO RULES THIS FILE ENFORCES AT THE BOUNDARY
 *
 * 1. VERBATIM IN, VERBATIM OUT. Stock, delivery, seller and returns come back
 *    exactly as Amazon worded them. This provider does not decide that "In
 *    Stock" means in stock — the offer engine's normaliser does, in one place,
 *    so a second provider can never disagree with it.
 *
 * 2. SELLER-ENTERED SPECS ARE QUARANTINED. Amazon's spec table is typed by
 *    whoever listed the product, and for the Polaris it says "charging_time
 *    4.5 hours" and "2-Year" warranty — both of which contradict the approved
 *    Job 8 record. They are returned in `attributes`, never in the listing's
 *    facts, and marketplace-attributes.ts is the only thing allowed to read
 *    them.
 *
 * The key is a Worker secret. It is read from the environment at call time and
 * never logged, never persisted, never returned in a result, and never written
 * to any export.
 */
import type {
  AmazonListing,
  AmazonProvider,
  AmazonSearchHit,
  BuyingOption,
  MarketplaceAttributes,
  ProviderResult,
} from "./amazon-provider";

const BASE = "https://serpapi.com";
export const SERPAPI_SECRET_REF = "SERPAPI_API_KEY";

/** Minor units from a "$1,199.00" string. Null rather than a guess. */
export function priceToMinor(raw: unknown): number | null {
  if (typeof raw === "number" && Number.isFinite(raw)) return Math.round(raw * 100);
  if (typeof raw !== "string") return null;
  const m = raw.replace(/,/g, "").match(/(\d+(?:\.\d{1,2})?)/);
  return m ? Math.round(Number(m[1]) * 100) : null;
}

/** SerpApi labels an option "buy_new" / "buy_used"; anything else is unknown. */
export function conditionOf(key: string): BuyingOption["condition"] {
  const k = key.toLowerCase();
  // A listing with one buying option is keyed `single_offer` and is the new
  // item — there is no other condition on offer to confuse it with.
  if (k === "single_offer") return "new";
  if (k.includes("new")) return "new";
  if (k.includes("used")) return "used";
  if (k.includes("renew") || k.includes("refurb")) return "renewed";
  return "unknown";
}

const firstString = (v: unknown): string | null =>
  Array.isArray(v) ? (typeof v[0] === "string" ? v[0] : null) : typeof v === "string" ? v : null;

/**
 * Amazon words the seller block two ways and SerpApi mirrors both: a single
 * `shipper_seller` line, or separate `ships_from` and `sold_by` lines. Reading
 * only the first shape silently loses the seller on every listing that uses the
 * second — which is most brand-store listings, exactly the ones where knowing
 * the seller matters most.
 */
const featureText = (features: unknown, ...keys: string[]): string | null => {
  if (!features || typeof features !== "object") return null;
  const f = features as Record<string, { text?: unknown }>;
  for (const key of keys) {
    if (typeof f[key]?.text === "string") return f[key].text as string;
  }
  return null;
};

export function toBuyingOptions(purchaseOptions: unknown, fallback: Record<string, unknown>): BuyingOption[] {
  const out: BuyingOption[] = [];
  if (purchaseOptions && typeof purchaseOptions === "object" && !Array.isArray(purchaseOptions)) {
    for (const [key, raw] of Object.entries(purchaseOptions as Record<string, Record<string, unknown>>)) {
      out.push({
        condition: conditionOf(key),
        priceMinor: priceToMinor(raw.extracted_price ?? raw.price),
        currency: "USD",
        stockWording: typeof raw.stock === "string" ? raw.stock : null,
        deliveryWording: firstString(raw.delivery),
        sellerWording: featureText(raw.features, "shipper_seller", "sold_by"),
        returnsWording: featureText(raw.features, "returns"),
      });
    }
  }
  // A listing with a single buying option exposes it at the top level instead.
  if (out.length === 0 && (fallback.price || fallback.extracted_price)) {
    out.push({
      condition: "new",
      priceMinor: priceToMinor(fallback.extracted_price ?? fallback.price),
      currency: "USD",
      stockWording: typeof fallback.stock === "string" ? fallback.stock : null,
      deliveryWording: firstString(fallback.delivery),
      sellerWording: null,
      returnsWording: null,
    });
  }
  return out;
}

const str = (v: unknown): string | null => (typeof v === "string" && v.trim() ? v.trim() : null);

export function toAttributes(details: unknown): MarketplaceAttributes {
  const d = (details && typeof details === "object" ? details : {}) as Record<string, unknown>;
  const known = new Set(["brand_name", "model_name", "model_number", "manufacturer_part_number", "manufacturer", "upc"]);
  const other: Record<string, string> = {};
  for (const [k, v] of Object.entries(d)) {
    if (known.has(k)) continue;
    if (typeof v === "string") other[k] = v;
  }
  return {
    brandName: str(d.brand_name),
    modelName: str(d.model_name),
    modelNumber: str(d.model_number),
    manufacturerPartNumber: str(d.manufacturer_part_number),
    manufacturer: str(d.manufacturer),
    upc: str(d.upc),
    other,
  };
}

export interface SerpApiOptions {
  apiKey: string | undefined;
  /** Today, injected so the caller controls the recorded date. */
  today: string;
  /** Called before every billable request; false means the ceiling is reached. */
  mayspend?: () => boolean;
  fetchImpl?: typeof fetch;
}

export class SerpApiAmazonProvider implements AmazonProvider {
  readonly id = "serpapi" as const;

  constructor(private readonly opts: SerpApiOptions) {}

  private async get(path: string, params: Record<string, string>): Promise<ProviderResult<unknown>> {
    if (!this.opts.apiKey) {
      return { ok: false, data: null, skipped: "no_credentials", detail: `${SERPAPI_SECRET_REF} is not set`, creditsUsed: 0 };
    }
    if (this.opts.mayspend && !this.opts.mayspend()) {
      return {
        ok: false,
        data: null,
        skipped: "credit_ceiling_reached",
        detail: "monthly credit ceiling reached — run skipped rather than spending into the next period",
        creditsUsed: 0,
      };
    }
    const q = new URLSearchParams({ ...params, api_key: this.opts.apiKey });
    const doFetch = this.opts.fetchImpl ?? fetch;
    try {
      const res = await doFetch(`${BASE}${path}?${q}`);
      const body = (await res.json()) as Record<string, unknown>;
      if (!res.ok || body.error) {
        // The message is echoed, but never the query string it came from — that
        // carries the key.
        return { ok: false, data: null, skipped: "provider_error", detail: String(body.error ?? res.status), creditsUsed: 1 };
      }
      return { ok: true, data: body, skipped: null, detail: "", creditsUsed: 1 };
    } catch (e) {
      return { ok: false, data: null, skipped: "provider_error", detail: (e as Error).message, creditsUsed: 0 };
    }
  }

  async getListing(asin: string): Promise<ProviderResult<AmazonListing>> {
    const r = await this.get("/search.json", { engine: "amazon_product", asin, amazon_domain: "amazon.com" });
    if (!r.ok || !r.data) return { ...r, data: null };
    const body = r.data as Record<string, unknown>;
    const p = (body.product_results ?? {}) as Record<string, unknown>;
    const thumbs = Array.isArray(p.thumbnails) ? p.thumbnails : [];
    return {
      ok: true,
      skipped: null,
      detail: "",
      creditsUsed: r.creditsUsed,
      data: {
        asin,
        title: str(p.title),
        buyingOptions: toBuyingOptions(body.purchase_options, p),
        attributes: toAttributes(body.product_details),
        imageUrls: thumbs.map((t) => (typeof t === "string" ? t : String((t as Record<string, unknown>)?.link ?? ""))).filter(Boolean),
        videoCount: Array.isArray(body.videos) ? body.videos.length : 0,
        providerId: this.id,
        retrievedOn: this.opts.today,
        notFound: !p.title,
      },
    };
  }

  async search(query: string): Promise<ProviderResult<AmazonSearchHit[]>> {
    const r = await this.get("/search.json", { engine: "amazon", k: query, amazon_domain: "amazon.com" });
    if (!r.ok || !r.data) return { ...r, data: null };
    const rows = (r.data as Record<string, unknown>).organic_results;
    const hits: AmazonSearchHit[] = (Array.isArray(rows) ? rows : [])
      .map((row, i) => {
        const x = row as Record<string, unknown>;
        return {
          asin: String(x.asin ?? ""),
          title: String(x.title ?? ""),
          brand: str(x.brand),
          priceMinor: priceToMinor(x.extracted_price ?? x.price),
          deliveryWording: firstString(x.delivery),
          position: typeof x.position === "number" ? x.position : i + 1,
        };
      })
      .filter((h) => /^B0[A-Z0-9]{8}$/.test(h.asin));
    return { ok: true, data: hits, skipped: null, detail: "", creditsUsed: r.creditsUsed };
  }

  async remainingCredits(): Promise<number | null> {
    if (!this.opts.apiKey) return null;
    const doFetch = this.opts.fetchImpl ?? fetch;
    try {
      // The account endpoint is not itself billable.
      const res = await doFetch(`${BASE}/account?api_key=${this.opts.apiKey}`);
      const body = (await res.json()) as Record<string, unknown>;
      const left = body.total_searches_left;
      return typeof left === "number" ? left : null;
    } catch {
      return null;
    }
  }
}
