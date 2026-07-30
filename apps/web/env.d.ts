/// <reference types="astro/client" />
/// <reference types="@cloudflare/workers-types" />

type ENV = {
  DB: D1Database;
  KV: KVNamespace;
  MEDIA: R2Bucket;
  RESEND_API_KEY?: string;
  ADMIN_TOKEN?: string;
  /** Cloudflare Web Analytics beacon token (public once rendered; set via `wrangler secret put`). */
  CF_WEB_ANALYTICS_TOKEN?: string;
  /** Google Search Console HTML-tag verification content value. */
  GOOGLE_SITE_VERIFICATION?: string;
};

type Runtime = import("@astrojs/cloudflare").Runtime<ENV>;

declare namespace App {
  interface Locals extends Runtime {}
}
