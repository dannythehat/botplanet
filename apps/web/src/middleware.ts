import { defineMiddleware } from "astro:middleware";
import { resolveRedirect, safeQuery } from "./lib/routing";

/**
 * Protect /admin and /api/admin with a shared token (ADMIN_TOKEN secret).
 * This is an interim gate; in production Cloudflare Access should also front
 * /admin at the Zero-Trust layer. The admin exposes private commercial data
 * (commission etc.), so it must never be publicly reachable.
 */
const PUBLIC = new Set(["/admin/login", "/api/admin/login"]);

export const onRequest = defineMiddleware(async (context, next) => {
  // Canonical host: 301 www → apex so there is one true production host.
  const host = context.request.headers.get("host")?.toLowerCase() ?? "";
  if (host === "www.botplanet.io") {
    const url = new URL(context.request.url);
    return context.redirect(`https://botplanet.io${url.pathname}${url.search}`, 301);
  }

  /**
   * Canonical URL enforcement. One permanent hop, never a chain: the resolver
   * normalises and de-aliases in a single step and its destinations are proven
   * canonical by test. Unknown paths are NOT redirected — they fall through to
   * a genuine 404 rather than being swept to the homepage.
   */
  const redirect = resolveRedirect(context.url.pathname);
  if (redirect) {
    const query = safeQuery(context.url.search);
    return context.redirect(redirect.to + query, redirect.status);
  }

  const path = context.url.pathname;
  const guarded = path === "/admin" || path.startsWith("/admin/") || path.startsWith("/api/admin/");
  if (!guarded || PUBLIC.has(path)) return next();

  const env = (context.locals as App.Locals).runtime?.env;
  const token = env?.ADMIN_TOKEN;
  const cookie = context.cookies.get("bp_admin")?.value;
  if (token && cookie && cookie === token) return next();

  if (path.startsWith("/api/")) return new Response("Unauthorized", { status: 401 });
  return context.redirect("/admin/login");
});
