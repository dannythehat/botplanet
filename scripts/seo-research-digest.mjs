/**
 * Print a compact, sanitised digest of a finished SEO research run to stdout.
 *
 * WHY THIS EXISTS. The paid batch writes its results to a workflow artifact,
 * and raw API responses deliberately never enter git. That is correct for
 * storage and wrong for reading: whoever has to turn the run into a keyword
 * map cannot always download an artifact, and re-running the batch to see the
 * numbers again means paying for them twice. This reads the artifact that was
 * just produced and prints the decision-grade fields — volume, CPC, KD,
 * seasonality, related terms, and the ten organic domains per SERP — as plain
 * text in the job log, where they can be read without spending anything.
 *
 * It buys nothing and calls nothing. If the results file is missing it says so
 * and exits 0, because a digest failing must never turn a successful paid run
 * into a failed workflow.
 *
 *   node scripts/seo-research-digest.mjs --category=companion-robots
 */
import { readFileSync } from "node:fs";

const argCategory = process.argv.find((a) => a.startsWith("--category="))?.split("=")[1];
const CATEGORY = (argCategory ?? process.env.SEO_CATEGORY ?? "").trim();
if (!/^[a-z0-9-]+$/.test(CATEGORY)) {
  console.log(`No usable category slug given ("${CATEGORY}"). Nothing to digest.`);
  process.exit(0);
}

const FILE = `research-output/${CATEGORY}-results.json`;
let doc;
try {
  doc = JSON.parse(readFileSync(FILE, "utf8"));
} catch (e) {
  console.log(`No digest: cannot read ${FILE} (${e.message}).`);
  process.exit(0);
}

const MONTHS = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const kdByKeyword = new Map((doc.difficulty ?? []).map((d) => [d.keyword, d.kd]));
const n = (v) => (v === null || v === undefined ? "-" : String(v));

console.log(`\n===== DIGEST ${CATEGORY} =====`);
console.log(`generated ${doc.generated} · seeds ${doc.seeds} · spend $${doc.totalCostUsd}`);

/* --- volume / CPC / competition / KD, richest first ----------------- */
const rows = [...(doc.volume ?? [])].sort((a, b) => (b.volume ?? -1) - (a.volume ?? -1));
console.log(`\n----- VOLUME (${rows.length}) : keyword | vol | cpc | competition | kd -----`);
for (const r of rows) {
  console.log(`${r.keyword}\t${n(r.volume)}\t${n(r.cpc)}\t${n(r.competition)}\t${n(kdByKeyword.get(r.keyword))}`);
}

/* --- seasonality, for anything big enough for a curve to mean anything */
console.log(`\n----- SEASONALITY : keyword | peak | trough | last 12 months (oldest first) -----`);
for (const r of rows) {
  if ((r.volume ?? 0) < 300 || !r.monthly?.length) continue;
  const months = [...r.monthly].reverse().slice(-12);
  const withValues = months.filter((m) => typeof m.v === "number");
  if (!withValues.length) continue;
  const peak = withValues.reduce((a, b) => (b.v > a.v ? b : a));
  const trough = withValues.reduce((a, b) => (b.v < a.v ? b : a));
  const series = months.map((m) => `${MONTHS[m.m]}:${n(m.v)}`).join(" ");
  console.log(`${r.keyword}\tpeak ${MONTHS[peak.m]} ${peak.v}\ttrough ${MONTHS[trough.m]} ${trough.v}\t${series}`);
}

/* --- related keywords, capped per lead so one lead cannot flood the log */
const byLead = new Map();
for (const r of doc.related ?? []) {
  if (!byLead.has(r.lead)) byLead.set(r.lead, []);
  byLead.get(r.lead).push(r);
}
console.log(`\n----- RELATED : lead >> keyword | vol | cpc | kd -----`);
for (const [lead, items] of byLead) {
  const top = items.sort((a, b) => (b.volume ?? -1) - (a.volume ?? -1)).slice(0, 20);
  for (const r of top) console.log(`${lead}\t>>\t${r.keyword}\t${n(r.volume)}\t${n(r.cpc)}\t${n(r.kd)}`);
}

/* --- SERPs: the domains are the whole point, so print all ten --------- */
console.log(`\n----- SERPS (${(doc.serps ?? []).length}) -----`);
for (const s of doc.serps ?? []) {
  console.log(`\nQUERY: ${s.query}`);
  console.log(`FEATURES: ${(s.features ?? []).join(", ") || "none"}`);
  for (const o of s.organic ?? []) console.log(`  ${o.pos}. ${o.domain} — ${o.title}`);
  if (s.paa?.length) console.log(`PAA: ${s.paa.join(" | ")}`);
}

/* --- domain overlap, the cannibalisation ruling in one table ---------- */
const serps = doc.serps ?? [];
console.log(`\n----- SERP OVERLAP : shared top-10 domains between every pair (>=1) -----`);
console.log(`(the one-URL rule: >=5 shared domains in the top 10 means one page, not two)`);
for (let i = 0; i < serps.length; i++) {
  for (let j = i + 1; j < serps.length; j++) {
    const a = new Set((serps[i].organic ?? []).map((o) => o.domain));
    const shared = [...new Set((serps[j].organic ?? []).map((o) => o.domain))].filter((d) => a.has(d));
    if (!shared.length) continue;
    console.log(`${shared.length}\t${serps[i].query}\tVS\t${serps[j].query}\t${shared.join(", ")}`);
  }
}

console.log(`\n===== END DIGEST ${CATEGORY} =====`);
