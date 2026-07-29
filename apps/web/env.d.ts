/// <reference types="astro/client" />
/// <reference types="@cloudflare/workers-types" />

type ENV = {
  DB: D1Database;
  KV: KVNamespace;
  MEDIA: R2Bucket;
};

type Runtime = import("@astrojs/cloudflare").Runtime<ENV>;

declare namespace App {
  interface Locals extends Runtime {}
}
