/**
 * @botplanet/db — schema + (future) D1 client helpers.
 *
 * The Drizzle D1 client is wired when the Cloudflare account/zone are confirmed.
 * For now this package exposes the schema and, via ./seed, the provisional
 * pool-category seed data.
 */
export * as schema from "./schema/index.js";
