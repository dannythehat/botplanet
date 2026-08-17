import type { APIRoute } from "astro";
import { eq } from "drizzle-orm";
import { getDb, schema } from "../../lib/db";
import { sendRecommendationEmail } from "../../lib/email";

export const POST: APIRoute = async ({ request, locals, url }) => {
  const db = getDb(locals);
  let body: { token?: string; email?: string; consent?: boolean };
  try {
    body = await request.json();
  } catch {
    return json({ error: "Invalid JSON" }, 400);
  }
  const { token, email } = body;
  if (!token || !email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return json({ error: "A valid email and token are required" }, 400);
  }

  const rec = (
    await db.select().from(schema.recommendations).where(eq(schema.recommendations.secureToken, token)).limit(1)
  )[0];
  if (!rec) return json({ error: "Recommendation not found" }, 404);

  // Record the email + consent against the recommendation (PII).
  await db
    .update(schema.recommendations)
    .set({ email, consentJson: { emailResult: true, marketing: Boolean(body.consent) } })
    .where(eq(schema.recommendations.id, rec.id));

  const product = rec.chosenProductId
    ? (await db.select().from(schema.products).where(eq(schema.products.id, rec.chosenProductId)).limit(1))[0]
    : undefined;

  const apiKey = locals.runtime.env.RESEND_API_KEY;
  if (!apiKey) return json({ ok: true, emailed: false, note: "Saved. Email delivery not configured yet." });

  const sent = await sendRecommendationEmail({
    apiKey,
    to: email,
    token,
    productName: product?.name ?? null,
    origin: url.origin,
  });
  return json({ ok: true, emailed: sent.ok, note: sent.ok ? "Sent!" : "Saved — email pending domain verification." });
};

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), { status, headers: { "content-type": "application/json" } });
}
