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
import { questionsFor } from "../../content/matcher-questions";
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

/**
 * Answers in question order, with their labels — for the team email.
 *
 * Reads the CATEGORY'S OWN question set. It read one global array until
 * 6 August 2026, which meant a window lead's email was rendered against pool
 * questions and silently dropped every answer whose id the pool set did not
 * contain. An unknown category falls back to the raw ids rather than losing
 * the lead's answers, because a slightly ugly email beats a missing one.
 */
function orderedAnswers(categorySlug: string | undefined, answers: Record<string, string>) {
  const questions = questionsFor(categorySlug);
  if (!questions) {
    return Object.entries(answers).map(([id, answer]) => ({ question: id, answer }));
  }
  return questions
    .filter((q) => answers[q.id])
    .map((q) => ({ question: q.q, answer: answers[q.id]! }));
}

/**
 * Weaves the person's own answers back into a sentence.
 *
 * Per category, because "you have in-ground pool" is nonsense in a window
 * lead's email. Each category names the three or four answers worth echoing
 * back; anything else is left out rather than guessed at.
 */
/* @extension-point per-category | optional | The lead email falls through to
   the pool wording and tells a window or lawn buyer what we understood about
   their "pool". The `seen` and `theirs` maps in renderReply below are the same
   decision and need the same entry. */
function reflect(categorySlug: string | undefined, a: Record<string, string>): string {
  const lower = (s: string) => s.toLowerCase();
  let bits: (string | null)[] = [];

  if (categorySlug === "window-cleaning-robots") {
    bits = [
      a.environment ? `your glass is ${lower(a.environment)}` : null,
      a.primary_need ? `the windows that matter are ${lower(a.primary_need)}` : null,
      a.window_height ? `they are ${lower(a.window_height)}` : null,
      a.power_pref ? `on power, ${lower(a.power_pref)}` : null,
    ];
  } else if (categorySlug === "robotic-lawn-mowers") {
    bits = [
      a.lawn_size ? `the lawn is ${lower(a.lawn_size)}` : null,
      a.environment ? `it is ${lower(a.environment)}` : null,
      a.primary_need ? `the ground is ${lower(a.primary_need)}` : null,
      a.boundary_pref ? `on a boundary wire, ${lower(a.boundary_pref)}` : null,
    ];
  } else if (categorySlug === "companion-robots") {
    bits = [
      a.primary_need ? `it's ${lower(a.primary_need)}` : null,
      a.subscription_tolerance ? `on a monthly fee, ${lower(a.subscription_tolerance)}` : null,
      a.movement ? `you'd like something that ${lower(a.movement)}` : null,
      a.talking ? `on talking, ${lower(a.talking)}` : null,
    ];
  } else if (categorySlug === "pet-camera-robots") {
    bits = [
      a.primary_need ? `you mainly want to ${lower(a.primary_need)}` : null,
      a.environment ? `on stairs, ${lower(a.environment)}` : null,
      a.flooring ? `the floors are ${lower(a.flooring)}` : null,
      a.autonomy ? `you'd like it to ${lower(a.autonomy)}` : null,
    ];
  } else if (categorySlug === "self-cleaning-litter-boxes") {
    bits = [
      a.environment ? `your cat is ${lower(a.environment)}` : null,
      a.primary_need ? `there ${a.primary_need === "One" ? "is" : "are"} ${lower(a.primary_need)}` : null,
      a.litter_pref ? `on the maker's own refills, ${lower(a.litter_pref)}` : null,
      a.tracking ? `on health tracking, ${lower(a.tracking)}` : null,
    ];
  } else if (categorySlug === "grill-cleaning-robots") {
    bits = [
      a.environment ? `your grates are ${lower(a.environment)}` : null,
      a.bar_spacing ? `the bars are ${lower(a.bar_spacing)}` : null,
      a.primary_need ? `the problem is ${lower(a.primary_need)}` : null,
      a.frequency ? `you cook ${lower(a.frequency)}` : null,
    ];
  } else if (categorySlug === "robot-vacuums") {
    bits = [
      a.environment ? `your floors are ${lower(a.environment)}` : null,
      a.primary_need ? `on hair, ${lower(a.primary_need)}` : null,
      a.clutter ? `the floor is usually ${lower(a.clutter)}` : null,
      a.emptying ? `on emptying, ${lower(a.emptying)}` : null,
    ];
  } else if (categorySlug === "educational-coding-robots") {
    bits = [
      a.environment ? `they are ${lower(a.environment)}` : null,
      a.device ? `on a tablet, ${lower(a.device)}` : null,
      a.primary_need ? `you want it to ${lower(a.primary_need)}` : null,
      a.asked_for_it ? `and ${lower(a.asked_for_it)}` : null,
    ];
  } else if (categorySlug === "robotic-pool-cleaners") {
    bits = [
      a.environment ? `you have ${lower(a.environment)} pool` : null,
      a.pool_length ? `it runs ${lower(a.pool_length)}` : null,
      a.primary_need ? `the job is ${lower(a.primary_need)}` : null,
      a.power_pref ? `you'd prefer ${lower(a.power_pref)}` : null,
    ];
  } else {
    /* A category with no entry above gets no reflection rather than pool's.
       Pool used to be the fallback, which is how a window lead would have been
       told what we understood about their pool. The opening paragraph reads
       fine without it — renderReply has a second version for exactly this. */
    bits = [];
  }

  const kept = bits.filter((b): b is string => Boolean(b));
  if (!kept.length) return "";
  return kept.length > 1 ? `${kept.slice(0, -1).join(", ")} and ${kept[kept.length - 1]}` : kept[0]!;
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
  categorySlug: string | undefined;
  answers: Record<string, string>;
  productName: string | null;
  resultUrl: string | null;
}) {
  const r = reflect(opts.categorySlug, opts.answers);
  /* What the suitability scorer can actually see, named per category. The
     integrity claim in this email has to describe the real inputs, and for a
     window lead "pool type, size, coverage" describes nothing that happened. */
  const SEEN: Record<string, string> = {
    "robotic-pool-cleaners": "pool type, size, coverage, power and budget band",
    "window-cleaning-robots":
      "framed or frameless glass, which glass you need reached, power and budget band",
    "robotic-lawn-mowers": "lawn size, tree cover, slopes, separate zones and budget band",
    "companion-robots":
      "who it is for, whether it moves, how much it talks and your budget band",
    "pet-camera-robots":
      "whether there are stairs, what is on your floors, what you need it to do and your budget band",
    "self-cleaning-litter-boxes":
      "your cat's size, how many cats, which litter you will use and your budget band",
    "grill-cleaning-robots":
      "what your grates are made of, how the bars are spaced, how often you cook and your budget band",
    "robot-vacuums":
      "what is on your floors, whether there is hair in the house, how clear the floor is and your budget band",
    "educational-coding-robots":
      "the child's age, whether a tablet is free, what you want from it and your budget band",
  };
  const seen = SEEN[opts.categorySlug ?? ""] ?? "what you told us and your budget band";
  /* "your pool" in the sign-off, or the right noun for the category. */
  const THEIRS: Record<string, string> = {
    "robotic-pool-cleaners": "your pool",
    "window-cleaning-robots": "your windows",
    "robotic-lawn-mowers": "your lawn",
    "companion-robots": "who this is for",
    "pet-camera-robots": "your home",
    "self-cleaning-litter-boxes": "your cat",
    "grill-cleaning-robots": "your grill",
    "robot-vacuums": "your floors",
    "educational-coding-robots": "the child",
  };
  const theirs = THEIRS[opts.categorySlug ?? ""] ?? "what you told us";
  const p = (t: string) =>
    `<p style="margin:0 0 15px;color:#1f2430;font-size:15px;line-height:1.55;">${t}</p>`;

  const opening = r
    ? `I've been through what you told the matcher — ${esc(r)}. That's what shaped the answer below.`
    : `I've been through your answers, and that's what shaped the answer below.`;

  const pick = opts.productName
    ? `Based on that, the robot that fits you best right now is <strong>${esc(opts.productName)}</strong>.`
    : `Your answers narrow it down, but I want to check a couple of things before naming one — reply and tell me a bit more.`;

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
        `suits you cannot see prices, retailers or commission at all. It only sees ${seen}. ` +
        `Commission is only ever used to break a tie between shops selling the same ` +
        `machine on the same terms — never to decide the machine.`,
    )}
    ${p(`If anything about ${theirs} doesn't fit what I've said, just reply — it comes straight to me.`)}
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
    `If anything doesn't fit ${theirs}, just reply — it comes straight to me.`,
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
  /**
   * BOTH SENDS ARE HANDED TO waitUntil, AND THAT IS NOT A TIDY-UP.
   *
   * They were `void fetch(...)`. A Worker is entitled to be torn down the
   * moment its handler returns a Response, and a promise nobody registered is
   * exactly what gets torn down with it — so the reader saw "Check your inbox",
   * the endpoint answered {ok:true}, and whether the mail ever left was down to
   * whether the runtime happened to still be alive. Silent, intermittent, and
   * invisible to every test we have, because the failure is in the platform's
   * lifecycle rather than in this code's logic.
   *
   * waitUntil is the contract for "finish this before you kill me". Where the
   * runtime does not expose it, the sends are awaited instead: a slightly
   * slower response is worth more than a lead that quietly never arrives.
   */
  const ctx = (locals as App.Locals).runtime?.ctx as
    | { waitUntil?: (p: Promise<unknown>) => void }
    | undefined;
  const keepAlive = (p: Promise<unknown>) =>
    typeof ctx?.waitUntil === "function" ? ctx.waitUntil(p) : p;

  if (apiKey) {
    const rows = orderedAnswers(body.categorySlug, answers)
      .map((a) => `<tr><td style="padding:4px 10px 4px 0;color:#666">${esc(a.question)}</td><td style="padding:4px 0"><strong>${esc(a.answer)}</strong></td></tr>`)
      .join("");

    // Team notification, immediately.
    const teamSend = fetch("https://api.resend.com/emails", {
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
    keepAlive(teamSend);

    // Personal reply, scheduled 50–80 minutes out so it does not read as a robot.
    const delayMin = 50 + Math.floor(Math.random() * 31);
    const { subject, html, text } = renderReply({
      name: firstName,
      categorySlug: body.categorySlug,
      answers,
      productName: body.productName ?? null,
      resultUrl,
    });
    const replySend = fetch("https://api.resend.com/emails", {
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
    keepAlive(replySend);
  }

  return json({ ok: true });
};
