import type { APIRoute } from "astro";

export const POST: APIRoute = async ({ request, locals, cookies, redirect }) => {
  const form = await request.formData();
  const token = String(form.get("token") ?? "");
  const expected = (locals as App.Locals).runtime?.env?.ADMIN_TOKEN;
  if (expected && token && token === expected) {
    cookies.set("bp_admin", token, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 12,
    });
    return redirect("/admin");
  }
  return redirect("/admin/login?e=1");
};
