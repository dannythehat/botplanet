/**
 * Where the interchangeable data lives.
 *
 * THE PROBLEM THIS SOLVES. BotPlanet is one machine that renders many
 * categories. Some of it is engine — routing, scoring, price checking, the
 * components — and some of it is data that changes per category, per product,
 * per brand or per retailer. Nothing distinguished the two. Adding window
 * robots meant finding the category-shaped data by grep and memory, and the
 * things that got missed were the things nobody thought to grep for: the
 * sitemap query was hardcoded to pool, the BotMatch questions were pool's, the
 * scoring config was pool's. Each was invisible until a reader hit it.
 *
 * So every file holding interchangeable data now carries a machine-readable
 * tag, and this script reads them.
 *
 * THE TAG, inside any comment:
 *
 *   @extension-point <scope> | <required|optional> | <what happens if skipped>
 *
 * Scopes:
 *   per-category   one entry per category slug (pool, window, lawn, security…)
 *   per-product    one entry per product slug
 *   per-brand      one entry per brand
 *   per-retailer   one entry per retailer or affiliate network
 *   shared-vocab   the enums every category draws its values from
 *
 * A per-category tag may add ONE optional line telling the checklist how to
 * decide whether a category has been done:
 *
 *   @extension-check path:docs/seo/seeds/{slug}.json   the file must exist
 *   @extension-check manual                            cannot be automated
 *
 * With neither, the check is "does this file mention the slug", which is what
 * you want for a record keyed by category slug and wrong for everything else.
 * `manual` is honest rather than lazy: artwork directories are not named after
 * the slug, so no string search can tell you whether the hero exists.
 *
 * USAGE
 *
 *   node scripts/extension-points.mjs
 *       Print the whole map, grouped by scope.
 *
 *   node scripts/extension-points.mjs robotic-lawn-mowers
 *       The checklist for one category: which per-category files already
 *       mention that slug, and which do not. This is the "what do I still have
 *       to update" answer.
 *
 *   node scripts/extension-points.mjs --write
 *       Regenerate docs/EXTENSION-POINTS.md from the tags.
 *
 *   node scripts/extension-points.mjs --check
 *       Exit non-zero if the doc is out of date. Run by the test suite, so a
 *       tag added without regenerating the doc fails the build rather than
 *       quietly drifting.
 */

import { readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { join, relative } from "node:path";

const ROOT = process.cwd();
const DOC = "docs/EXTENSION-POINTS.md";

const SCOPES = ["per-category", "per-product", "per-brand", "per-retailer", "shared-vocab"];
const SCOPE_TITLE = {
  "per-category": "Per category",
  "per-product": "Per product",
  "per-brand": "Per brand",
  "per-retailer": "Per retailer / affiliate network",
  "shared-vocab": "Shared vocabulary",
};
const SCOPE_BLURB = {
  "per-category":
    "One entry per category slug. Adding security robots, robot vacuums or anything else means " +
    "walking this list. Run `node scripts/extension-points.mjs <slug>` to see which of them the " +
    "new slug already appears in.",
  "per-product":
    "One entry per product slug. Adding a Maytronics pool robot, a fifth window brand or the " +
    "first mower means walking this list for that product.",
  "per-brand": "One entry per brand. Cheap, but a missing brand row breaks the product's foreign key.",
  "per-retailer":
    "One entry per retailer or affiliate network. Grows when a programme is approved — Amazon " +
    "first, then the rest.",
  "shared-vocab":
    "The enums every category draws from. A new category usually needs new values here FIRST, " +
    "because a product cannot be described honestly with another category's words.",
};

/* Directories worth scanning. node_modules and build output are not. */
const SEARCH_DIRS = ["apps/web/src", "packages", "scripts", "docs/seo/seeds"];
const SKIP_DIRS = new Set(["node_modules", "dist", ".astro", ".wrangler", "build"]);
const EXTS = /\.(ts|tsx|astro|mjs|js|json)$/;

function walk(dir, out = []) {
  let entries;
  try {
    entries = readdirSync(dir);
  } catch {
    return out;
  }
  for (const name of entries) {
    if (SKIP_DIRS.has(name)) continue;
    const full = join(dir, name);
    if (statSync(full).isDirectory()) walk(full, out);
    else if (EXTS.test(name)) out.push(full);
  }
  return out;
}

/**
 * Pull every tag out of one file.
 *
 * The note runs from the pipe to the end of the comment block, so an author can
 * wrap it over several lines without escaping anything. Leading `*` and `//`
 * decoration is stripped and the whitespace collapsed.
 */
function tagsIn(path) {
  const src = readFileSync(path, "utf8");
  const found = [];
  const re = /@extension-point\s+([a-z-]+)\s*\|\s*(required|optional)\s*\|/g;
  let m;
  while ((m = re.exec(src))) {
    const [, scope, need] = m;
    const rest = src.slice(m.index + m[0].length);
    // The note ends at the close of the comment, or at a blank line in a `//` run.
    const end = rest.search(/\*\/|\n\s*\n/);
    const block = rest.slice(0, end === -1 ? 500 : end);
    const check = block.match(/@extension-check\s+(\S+)/)?.[1] ?? null;
    const note = block
      .replace(/@extension-check\s+\S+/, "")
      /* Strip comment decoration only — `*` continuation and `//` — never a
         lone slash, or a note that wraps onto "/api/botmatch returns 501"
         silently loses the leading slash and reads as a different path. */
      .replace(/^[ \t]*(\*+|\/\/)/gm, " ")
      .replace(/\s+/g, " ")
      .trim();
    found.push({ file: relative(ROOT, path), scope, need, note, check });
  }
  return found;
}

function collect() {
  const all = SEARCH_DIRS.flatMap((d) => walk(join(ROOT, d))).flatMap(tagsIn);
  const bad = all.filter((t) => !SCOPES.includes(t.scope));
  if (bad.length) {
    for (const t of bad) console.error(`Unknown scope "${t.scope}" in ${t.file}`);
    process.exit(1);
  }
  return all.sort((a, b) => SCOPES.indexOf(a.scope) - SCOPES.indexOf(b.scope) || a.file.localeCompare(b.file));
}

/** The doc, rendered from the tags. Generated — never hand-edited. */
function renderDoc(tags) {
  const lines = [
    "# Interchangeable data — where it lives",
    "",
    "**Generated. Do not hand-edit.** Run `node scripts/extension-points.mjs --write`.",
    "",
    "BotPlanet is one engine rendering many categories. This is the list of every",
    "place that holds data belonging to a *particular* category, product, brand or",
    "retailer, rather than to the machine itself. Everything not listed here is",
    "engine, and adding a category should not require touching it.",
    "",
    "Each entry says what happens if you skip it, because the failures are quiet:",
    "a category with no hero entry still renders, it just renders without a title",
    "or a meta description, and nothing complains.",
    "",
    "## How to use it",
    "",
    "```",
    "node scripts/extension-points.mjs                    # the whole map",
    "node scripts/extension-points.mjs security-robots    # checklist for one category",
    "```",
    "",
    "The second form is the useful one. It reports which per-category files already",
    "mention that slug and which do not — the answer to \"what have I still not done\".",
    "",
  ];

  for (const scope of SCOPES) {
    const rows = tags.filter((t) => t.scope === scope);
    if (!rows.length) continue;
    lines.push(`## ${SCOPE_TITLE[scope]}`, "", SCOPE_BLURB[scope], "");
    lines.push("| File | | What happens if you skip it |", "|---|---|---|");
    for (const r of rows) {
      const flag = r.need === "required" ? "**required**" : "optional";
      lines.push(`| \`${r.file}\` | ${flag} | ${r.note} |`);
    }
    lines.push("");
  }

  lines.push(
    "---",
    "",
    "## Adding a whole new category",
    "",
    "The short version, in the order that avoids rework:",
    "",
    "1. **Shared vocabulary first.** A security robot cannot be described with pool",
    "   or glass words. Add its product class, environments and capabilities before",
    "   anything references them.",
    "2. **Research** — seed file, capped run, findings, keyword-to-URL rulings.",
    "   Nothing is built before the cannibalisation rulings exist.",
    "3. **Registries** — nav, routes, the D1 category row and its seed entry.",
    "4. **Page content** — hero and the nine section records.",
    "5. **BotMatch** — its own question set, its own scoring config. Never shared.",
    "6. **Products** — catalogue rows, offers, redirects, identity, evidence, media.",
    "7. **Verify live**, then log in Notion.",
    "",
    "Full process: `docs/seo/PRE-BUILD-PROCESS.md`.",
    "",
  );
  return lines.join("\n");
}

/* ---- category checklist ------------------------------------------- */

/**
 * A category is identified two ways in this codebase and both count.
 *
 * The URL slug — "robotic-lawn-mowers" — is what the web tier keys on. The D1
 * primary key — "cat-lawn-mowers" — is what the database tier keys on, and it
 * is deliberately shorter than the slug rather than derived from it. A checker
 * that only knew about slugs reported the BotMatch seed rows as missing when
 * they were sitting right there under the id.
 *
 * The mapping is read from the seed rather than hardcoded, so it cannot drift.
 */
function categoryIdFor(slug) {
  try {
    const src = readFileSync(join(ROOT, "packages/db/seed/pool/catalogue.ts"), "utf8");
    const re = /id:\s*"([^"]+)",\s*slug:\s*"([^"]+)"/g;
    let m;
    while ((m = re.exec(src))) if (m[2] === slug) return m[1];
  } catch {
    /* fall through */
  }
  return null;
}

/**
 * The launch category is referred to by constant, not by slug.
 *
 * content/routes.ts builds pool's paths from `const CAT = LAUNCH_CATEGORY`, so
 * the literal "robotic-pool-cleaners" appears nowhere in it. A plain string
 * search reported the launch category as missing from its own route registry —
 * a false negative that would have taught people to ignore this tool, which is
 * the worst thing a checklist can do.
 */
function launchSlug() {
  try {
    const src = readFileSync(join(ROOT, "apps/web/src/content/nav.ts"), "utf8");
    return src.match(/LAUNCH_CATEGORY\s*=\s*"([^"]+)"/)?.[1] ?? null;
  } catch {
    return null;
  }
}

function done(tag, slug, catId, launch) {
  if (tag.check === "manual") return null; // unknowable — report separately
  if (tag.check?.startsWith("path:")) {
    const p = tag.check.slice(5).replace("{slug}", slug);
    try {
      statSync(join(ROOT, p));
      return true;
    } catch {
      return false;
    }
  }
  try {
    const src = readFileSync(join(ROOT, tag.file), "utf8");
    if (src.includes(slug)) return true;
    if (catId !== null && src.includes(catId)) return true;
    // The launch category may be referenced through its constant instead.
    if (slug === launch && /LAUNCH_CATEGORY/.test(src)) return true;
    return false;
  } catch {
    return false;
  }
}

function checklist(slug) {
  const tags = collect().filter((t) => t.scope === "per-category");
  const catId = categoryIdFor(slug);
  const launch = launchSlug();
  const has = [];
  const missing = [];
  const manual = [];
  for (const t of tags) {
    const state = done(t, slug, catId, launch);
    if (state === null) manual.push(t);
    else if (state) has.push(t);
    else missing.push(t);
  }

  console.log(`\nCategory: ${slug}${catId ? `  (D1 id ${catId})` : "  (no D1 category row yet)"}\n`);
  console.log(`DONE — ${has.length} of ${has.length + missing.length} auto-checkable:`);
  for (const t of has) console.log(`  ✓ ${t.file}`);

  if (missing.length) {
    console.log(`\nSTILL TO DO — ${missing.length}:`);
    for (const t of missing) {
      console.log(`  ✗ ${t.file}  [${t.need}]`);
      console.log(`      ${t.note}`);
    }
  } else {
    console.log("\nNothing outstanding that can be checked automatically.");
  }

  if (manual.length) {
    console.log(`\nCHECK BY HAND — ${manual.length} (no string search can answer these):`);
    for (const t of manual) {
      console.log(`  ? ${t.file}  [${t.need}]`);
      console.log(`      ${t.note}`);
    }
  }

  console.log(
    "\nPer-product, per-brand and per-retailer files are listed in " +
      `${DOC} — they are walked per item, not per category.\n`,
  );
}

/* ---- entry point --------------------------------------------------- */

const arg = process.argv[2];

if (arg === "--write") {
  const doc = renderDoc(collect());
  writeFileSync(join(ROOT, DOC), doc.endsWith("\n") ? doc : doc + "\n");
  console.log(`Wrote ${DOC}`);
} else if (arg === "--check") {
  const expected = renderDoc(collect());
  let actual = "";
  try {
    actual = readFileSync(join(ROOT, DOC), "utf8");
  } catch {
    console.error(`${DOC} does not exist. Run: node scripts/extension-points.mjs --write`);
    process.exit(1);
  }
  if (actual.trim() !== expected.trim()) {
    console.error(`${DOC} is out of date. Run: node scripts/extension-points.mjs --write`);
    process.exit(1);
  }
  console.log(`${DOC} is current.`);
} else if (arg && !arg.startsWith("-")) {
  checklist(arg);
} else {
  const tags = collect();
  for (const scope of SCOPES) {
    const rows = tags.filter((t) => t.scope === scope);
    if (!rows.length) continue;
    console.log(`\n${SCOPE_TITLE[scope].toUpperCase()}  (${rows.length})`);
    for (const r of rows) console.log(`  ${r.need === "required" ? "!" : " "} ${r.file}`);
  }
  console.log(`\n${tags.length} extension points. Full detail in ${DOC}.\n`);
}
