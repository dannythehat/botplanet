import { drizzle } from "drizzle-orm/d1";
import * as schema from "@botplanet/db/schema";

export type DB = ReturnType<typeof getDb>;

/** Drizzle client bound to the request's D1 database. */
export function getDb(locals: App.Locals) {
  return drizzle(locals.runtime.env.DB, { schema });
}

export { schema };
