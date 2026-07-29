import { defineConfig } from "drizzle-kit";

/**
 * D1 uses the SQLite dialect. Migrations are generated from ./src/schema and
 * applied via `wrangler d1 migrations apply` once the Cloudflare account + zone
 * are confirmed. No database connection is required to generate migrations.
 */
export default defineConfig({
  dialect: "sqlite",
  driver: "d1-http",
  schema: "./src/schema/index.ts",
  out: "./migrations",
});
