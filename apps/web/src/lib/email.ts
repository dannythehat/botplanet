import { SITE } from "./site.js";

/**
 * Send the "your recommendation is ready" email via Resend.
 *
 * The email links ONLY to the on-site result page — never a raw affiliate link
 * (Amazon and others prohibit affiliate links in email, and the result page can
 * update after the email is sent).
 */
export async function sendRecommendationEmail(opts: {
  apiKey: string;
  to: string;
  token: string;
  productName: string | null;
  origin: string;
}): Promise<{ ok: boolean; error?: string }> {
  const url = `${opts.origin}/recommendation/${opts.token}`;
  const product = opts.productName ? ` — ${opts.productName}` : "";
  const html = `
    <div style="font-family:system-ui,sans-serif;max-width:520px">
      <h2>Your BotPlanet recommendation is ready${product}</h2>
      <p>We picked it on suitability, not commission. Your result is saved at this link:</p>
      <p><a href="${url}" style="background:#4fd1c5;color:#05141a;padding:10px 16px;border-radius:8px;text-decoration:none;font-weight:700">View your recommendation</a></p>
      <p style="color:#667">Prices are snapshots — confirm the current price at the retailer.</p>
      <p>— ${SITE.name}</p>
    </div>`;
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${opts.apiKey}`, "content-type": "application/json" },
      body: JSON.stringify({
        from: SITE.emailFrom,
        to: opts.to,
        subject: "Your BotPlanet recommendation is ready",
        html,
      }),
    });
    if (!res.ok) return { ok: false, error: `Resend ${res.status}` };
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "send failed" };
  }
}
