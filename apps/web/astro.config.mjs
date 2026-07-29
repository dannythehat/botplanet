import { defineConfig } from "astro/config";
import cloudflare from "@astrojs/cloudflare";

// Server-rendered on Cloudflare Workers. US market lives at the root; regional
// markets carry a path prefix. Interactivity uses small vanilla <script> islands
// (no React SSR on the worker).
export default defineConfig({
  output: "server",
  adapter: cloudflare({ platformProxy: { enabled: true } }),
  site: "https://botplanet.io",
});
