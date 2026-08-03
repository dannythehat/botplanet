/* ============================================================
   BotMatch lead capture.

   Ported from the CryptoWatchdog matcher's Cloudflare Worker.
   Same behaviour — validate, honeypot, store, notify the team,
   schedule a personal-sounding reply — but implemented as an
   Astro API route so it runs inside the site's existing Worker,
   D1 and Resend rather than a second deployment.

   The one deliberate change: BotPlanet computes a real
   recommendation. The reply therefore carries the actual match
   and links to the saved result page, instead of hand-written
   copy. Affiliate links never go in email — the result page is
   the destination, which is also what Amazon's terms require.
   ============================================================ */

import type { APIRoute } from "astro";
import { MATCHER_QUESTIONS } from "../../content/matcher-questions";
import { SITE } from "../../lib/site";

export const prerender = false;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json" },
  });

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** Answers in question order, with their labels — for the team email. */
function orderedAnswers(answers: Record<string, string>) {
  return MATCHER_QUESTIONS.filter((q) => answers[q.id]).map((q) => ({
    question: q.q,
    answer: answers[q.id],
  }));
}

/** Weaves the person's own answers back into a sentence. */
function reflect(a: Record<string, string>): string {
  const bits: string[] = [];
  if (a.environment) bits.push(`you have ${a.environment.toLowerCase()} pool`);
  if (a.pool_length) bits.push(`it runs ${a.pool_length.toLowerCase()}`);
  if (a.primary_need) bits.push(`the job is ${a.primary_need.toLowerCase()}`);
  if (a.power_pref) bits.push(`you'd prefer ${a.power_pref.toLowerCase()}`);
  if (!bits.length) return "";
  return bits.length > 1 ? `${bits.slice(0, -1).join(", ")} and ${bits[bits.length - 1]}` : bits[0];
}

interface LeadBody {
  firstName?: string;
  email?: string;
  consent?: boolean;
  categorySlug?: string;
  answers?: Record<string, string>;
  resultToken?: string | null;
  productName?: string | null;
  submittedAt?: string;
  sourcePage?: string;
  /** Honeypots — real people never fill these. */
  company?: string;
  website_url?: string;
}

function renderReply(opts: {
  name: string;
  answers: Record<string, string>;
  productName: string | null;
  resultUrl: string | null;
}) {
  const r = reflect(opts.answers);
  const p = (t: string) =>
    `<p style="margin:0 0 15px;color:#1f2430;font-size:15px;line-height:1.55;">${t}</p>`;

  const opening = r
    ? `I've been through what you told the matcher — ${esc(r)}. That's what shaped the answer below.`
    : `I've been through your answers, and that's what shaped the answer below.`;

  const pick = opts.productName
    ? `Based on that, the robot that fits you best right now is <strong>${esc(opts.productName)}</strong>.`
    : `Your answers narrow it down, but I want to check a couple of things before naming one — reply and tell me a bit more about your pool.`;

  const link = opts.resultUrl
    ? p(
        `Your full result is saved here, including why it won and what it does not do well: ` +
          `<a href="${opts.resultUrl}" style="color:#2f6bff;">view your recommendation</a>. ` +
          `It stays up to date, so prices and availability are current when you open it.`,
      )
    : "";

  const html = `<!doctype html><html><body style="margin:0;background:#f5f6fa;padding:24px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <div style="max-width:600px;margin:0 auto;background:#fff;border-radius:12px;border:1px solid #e6e7ef;padding:26px 26px 20px;">
    ${p(`Hi ${esc(opts.name)},`)}
    ${p(`Thanks for using BotMatch. This is Danny.`)}
    ${p(opening)}
    ${p(pick)}
    ${link}
    ${p(
      `One thing worth knowing about how we pick: the part of BotMatch that chooses <em>which robot</em> ` +
        `suits you cannot see prices, retailers or commission at all. It only sees pool type, size, coverage, ` +
        `power and budget band. Commission is only ever used to break a tie between shops selling the same ` +
        `machine on the same terms — never to decide the machine.`,
    )}
    ${p(`If anything about your pool doesn't fit what I've said, just reply — it comes straight to me.`)}
    ${p(`Danny<br>BotPlanet`)}
    <p style="margin:18px 0 0;color:#9aa0ad;font-size:11px;line-height:1.5;">
      You're getting this because you asked for a recommendation through BotMatch. BotPlanet earns a
      commission from some retailers, which never changes which product we recommend.
      <a href="mailto:${SITE.emailFrom.replace(/.*<|>.*/g, "")}?subject=unsubscribe" style="color:#9aa0ad;">Unsubscribe</a>.
    </p>
  </div>
</body></html>`;

  const text = [
    `Hi ${opts.name},`,
    ``,
    `Thanks for using BotMatch. This is Danny.`,
    ``,
    r ? `I've been through what you told the matcher — ${r}. That's what shaped the answer below.` : `I've been through your answers.`,
    ``,
    opts.productName
      ? `Based on that, the robot that fits you best right now is ${opts.productName}.`
      : `Your answers narrow it down, but I want to check a couple of things first — just reply.`,
    ``,
    opts.resultUrl ? `Your full result, including what it does not do well: ${opts.resultUrl}` : ``,
    ``,
    `How we pick: the part of BotMatch that chooses which robot suits you cannot see prices, retailers or`,
    `commission. Commission only ever breaks a tie between shops selling the same machine on the same terms.`,
    ``,
    `If anything doesn't fit your pool, just reply — it comes straight to me.`,
    ``,
    `Danny`,
    `BotPlanet`,
  ].join("\n");

  return {
    subject: opts.productName
      ? `Your BotMatch result, ${opts.name} — ${opts.productName}`
      : `Your BotMatch result, ${opts.name}`,
    html,
    text,
  };
}

export const POST: APIRoute = async ({ request, locals }) => {
  let body: LeadBody;
  try {
    body = (await request.json()) as LeadBody;
  } catch {
    return json({ ok: false, error: "Malformed request." }, 400);
  }

  // Honeypot: silently accept so a bot cannot tell it was caught.
  if (body.company || body.website_url) return json({ ok: true });

  const firstName = String(body.firstName ?? "").trim().slice(0, 80);
  const email = String(body.email ?? "").trim().toLowerCase().slice(0, 200);
  const consent = body.consent === true;

  if (!firstName) return json({ ok: false, error: "Please enter your first name." }, 400);
  if (!EMAIL_RE.test(email)) return json({ ok: false, error: "Please enter a valid email address." }, 400);
  if (!consent) return json({ ok: false, error: "Please tick the box so we can email your result." }, 400);

  const answers = (body.answers && typeof body.answers === "object" ? body.answers : {}) as Record<string, string>;
  const env = (locals as App.Locals).runtime?.env as Record<string, unknown> | undefined;
  const origin = new URL(request.url).origin;
  const resultUrl = body.resultToken ? `${origin}/recommendation/${body.resultToken}` : null;

  /* ---- store ---- */
  const id = crypto.randomUUID();
  try {
    const db = (env?.DB ?? null) as { prepare: (q: string) => any } | null;
    if (db) {
      await db
        .prepare(
          `INSERT INTO matcher_leads
           (id, first_name, email, category_slug, answers_json, scored_json, result_token,
            product_id, consent, source_page, submitted_at, ip_country, user_agent)
           VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)`,
        )
        .bind(
          id,
          firstName,
          email,
          body.categorySlug ?? null,
          JSON.stringify(answers),
          JSON.stringify(body.productName ? { productName: body.productName } : {}),
          body.resultToken ?? null,
          body.productName ?? null,
          1,
          body.sourcePage ?? null,
          body.submittedAt ?? new Date().toISOString(),
          request.headers.get("cf-ipcountry"),
          request.headers.get("user-agent")?.slice(0, 300) ?? null,
        )
        .run();
    }
  } catch (e) {
    // A storage failure must not lose the lead — the emails below still fire.
    console.error("matcher lead store failed", e);
  }

  /* ---- notify + reply ---- */
  const apiKey = env?.RESEND_API_KEY as string | undefined;
  if (apiKey) {
    const rows = orderedAnswers(answers)
      .map((a) => `<tr><td style="padding:4px 10px 4px 0;color:#666">${esc(a.question)}</td><td style="padding:4px 0"><strong>${esc(a.answer)}</strong></td></tr>`)
      .join("");

    // Team notification, immediately.
    void fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "content-type": "application/json" },
      body: JSON.stringify({
        from: SITE.emailFrom,
        to: SITE.emailFrom.replace(/.*<|>.*/g, ""),
        subject: `BotMatch lead — ${firstName} (${body.categorySlug ?? "unknown"})`,
        html: `<h3>${esc(firstName)} · ${esc(email)}</h3>
               <p>Match: <strong>${esc(body.productName ?? "none computed")}</strong>${
                 resultUrl ? ` · <a href="${resultUrl}">result</a>` : ""
               }</p>
               <table style="font:14px system-ui;border-collapse:collapse">${rows}</table>`,
      }),
    }).catch(() => {});

    // Personal reply, scheduled 50–80 minutes out so it does not read as a robot.
    const delayMin = 50 + Math.floor(Math.random() * 31);
    const { subject, html, text } = renderReply({
      name: firstName,
      answers,
      productName: body.productName ?? null,
      resultUrl,
    });
    void fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "content-type": "application/json" },
      body: JSON.stringify({
        from: SITE.emailFrom,
        to: [email],
        subject,
        html,
        text,
        scheduled_at: new Date(Date.now() + delayMin * 60_000).toISOString(),
        headers: {
          "List-Unsubscribe": `<mailto:${SITE.emailFrom.replace(/.*<|>.*/g, "")}?subject=unsubscribe>`,
        },
      }),
    }).catch(() => {});
  }

  return json({ ok: true });
};
