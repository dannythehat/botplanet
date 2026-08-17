import { defineConfig } from "astro/config";
import cloudflare from "@astrojs/cloudflare";

// Server-rendered on Cloudflare Workers. US market lives at the root; regional
// markets carry a path prefix. Interactivity uses small vanilla <script> islands
// (no React SSR on the worker).
export default defineConfig({
  output: "server",
  // The adapter's own entry exports only `fetch`. A cron trigger needs
  // `scheduled`, so it is pointed at a wrapper that re-exports Astro's handler
  // untouched and adds that one export. Request handling is unchanged.
  adapter: cloudflare({
    platformProxy: { enabled: true },
    workerEntryPoint: { path: "./src/worker-entry.ts", namedExports: ["scheduledRefresh"] },
  }),
  site: "https://botplanet.io",
});
