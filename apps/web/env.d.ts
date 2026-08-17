/// <reference types="astro/client" />
/// <reference types="@cloudflare/workers-types" />

type ENV = {
  DB: D1Database;
  KV: KVNamespace;
  MEDIA: R2Bucket;
  RESEND_API_KEY?: string;
  ADMIN_TOKEN?: string;
  /** GA4 measurement ID (public by design; set in wrangler.toml [vars]). */
  GA_MEASUREMENT_ID?: string;
  /**
   * Google Search Console HTML-tag verification value. Unused — the domain
   * property sc-domain:botplanet.io is already verified via DNS.
   */
  GOOGLE_SITE_VERIFICATION?: string;
};

type Runtime = import("@astrojs/cloudflare").Runtime<ENV>;

declare namespace App {
  interface Locals extends Runtime {}
}
