/**
 * Drive every BotMatch matcher end to end against a running site.
 *
 * WHAT IT ANSWERS. A matcher can be perfectly built and still be useless: its
 * questions can be written, its scoring config registered, its page live — and
 * the category behind it can hold no products, so the reader answers five
 * questions and is told nothing. Nothing in the unit suite sees that, because
 * the products live in D1 rather than in the repo.
 *
 *   node scripts/audit-matchers.mjs [baseUrl]
 */
import { spawnSync } from "node:child_process";

const BASE = (process.argv[2] ?? "https://botplanet.io").replace(/\/$/, "");

/* Build the SCORING answers the way the browser does.
 *
 * NOT A MAP OF QUESTION ID TO OPTION ID. Each option carries a `scores` object
 * that is merged into a flat answer set — {pool_length_ft: 32, power_pref:
 * "no_pref"} — on top of the category's defaults. Sending {questionId: value}
 * produced an empty answer set and every matcher replied HTTP 200 with
 * productName: null, which looks exactly like nine broken matchers and was
 * nine broken requests.
 */
const r = spawnSync("npx", ["tsx", "-e", `
  Promise.all([
    import("./apps/web/src/content/matcher-questions.ts"),
    import("./apps/web/src/content/nav.ts"),
  ]).then(([q, n]) => {
    const out = {};
    for (const cat of n.liveCategories()) {
      const qs = q.questionsFor(cat.slug) ?? [];
      /* THREE READERS, NOT ONE. Answering every question with its first
         option is one person, and if that person happens to land on a tie the
         matcher looks broken when it is only undecided. A matcher that can
         never separate its catalogue whatever it is asked is a different
         thing, and that is what needs finding. */
      const profile = (pick) => {
        let a = { ...(q.MATCHER_DEFAULTS?.[cat.slug] ?? {}) };
        for (const question of qs) {
          const opts = question.options ?? [];
          const o = opts[pick(opts.length)];
          if (o?.scores) a = { ...a, ...o.scores };
        }
        return a;
      };
      out[cat.slug] = {
        name: cat.name,
        questionCount: qs.length,
        profiles: {
          first: profile(() => 0),
          middle: profile((n) => Math.floor(n / 2)),
          last: profile((n) => Math.max(0, n - 1)),
        },
      };
    }
    console.log("__JSON__" + JSON.stringify(out));
  });
`], { encoding: "utf8", cwd: "/home/user/botplanet", maxBuffer: 32 * 1024 * 1024 });

const line = (r.stdout ?? "").split("\n").find((l) => l.startsWith("__JSON__"));
if (!line) { console.error("could not read the question sets\n", r.stderr); process.exit(2); }
const CATS = JSON.parse(line.slice("__JSON__".length));

console.log(`Driving every matcher on ${BASE}\n`);
let broken = 0;

for (const [slug, info] of Object.entries(CATS)) {
  const runs = [];
  for (const [label, answers] of Object.entries(info.profiles)) {
    try {
      const res = await fetch(`${BASE}/api/botmatch`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category: slug, answers }),
      });
      const raw = await res.text();
      const body = JSON.parse(raw);
      runs.push({
        label,
        status: res.status,
        name: body.productName ?? null,
        tied: Array.isArray(body.equivalent) ? body.equivalent.length : 0,
        error: body.error ?? null,
      });
    } catch (e) {
      runs.push({ label, status: 0, name: null, tied: 0, error: String(e).slice(0, 50) });
    }
  }

  const decided = runs.filter((r) => r.name);
  const anyCandidates = runs.some((r) => r.name || r.tied > 0);
  /* A matcher fails when it can put NOTHING in front of a reader — no
     recommendation and no tied group — under any of the three profiles. */
  const ok = anyCandidates;
  if (!ok) broken++;
  const detail = runs
    .map((r) => `${r.label}:${r.name ? r.name : r.tied ? `${r.tied}-way tie` : r.error ? r.error : "nothing"}`)
    .join("  ");
  console.log(`${ok ? "ok  " : "FAIL"}  ${slug.padEnd(28)} ${String(info.questionCount).padStart(2)}q  decides ${decided.length}/3   ${detail}`);
}

console.log(broken === 0 ? "\nPASS — every matcher can put something in front of a reader." : `\nFAIL — ${broken} matcher(s) return nothing at all.`);
process.exitCode = broken === 0 ? 0 : 1;
