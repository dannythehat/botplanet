/**
 * The BotPlanet page tool.
 *
 *   npm run page:new     -- best-of <slug>       start a draft from the template
 *   npm run page:check   -- <draft-or-page.json> list every problem with a page file
 *   npm run page:publish -- <slug>               move a passing draft into the site
 *   npm run page:schema                          regenerate docs/page-system/PAGE_SCHEMA.json
 *
 * Drafts live in apps/web/src/content/pages-drafts/ where the site never loads them,
 * so a half-written page cannot break the build. `page:check` prints every
 * problem at once rather than the first one.
 */
import { copyFileSync, existsSync, mkdirSync, readFileSync, renameSync, writeFileSync } from "node:fs";
import { zodToJsonSchema } from "zod-to-json-schema";
import { BestOfPageSchema } from "../apps/web/src/page-system/schema";

const WEB = "apps/web/src";
const DRAFTS = `${WEB}/content/pages-drafts`;
const PAGES = `${WEB}/content/pages`;
const [cmd, ...rest] = process.argv.slice(2);

function check(file: string): boolean {
  const parsed = BestOfPageSchema.safeParse(JSON.parse(readFileSync(file, "utf8")));
  if (parsed.success) {
    console.log(`PASS  ${file}`);
    return true;
  }
  console.log(`FAIL  ${file}  (${parsed.error.issues.length} problems)`);
  for (const i of parsed.error.issues) console.log(`  - ${i.path.join(".") || "(page)"}: ${i.message}`);
  return false;
}

if (cmd === "schema") {
  const json = zodToJsonSchema(BestOfPageSchema, { name: "BestOfPage", $refStrategy: "none" });
  writeFileSync("docs/page-system/PAGE_SCHEMA.json", JSON.stringify(json, null, 2) + "\n");
  console.log("wrote docs/page-system/PAGE_SCHEMA.json");
} else if (cmd === "new") {
  const [type, slug] = rest;
  if (type !== "best-of" || !slug) {
    console.error("usage: page:new -- best-of <slug>   (best-of is the only template built so far)");
    process.exit(1);
  }
  mkdirSync(DRAFTS, { recursive: true });
  const json = `${DRAFTS}/${slug}.page.json`;
  const md = `${DRAFTS}/${slug}.md`;
  if (existsSync(json)) throw new Error(`${json} already exists`);
  copyFileSync(`${WEB}/page-system/templates/best-of.page.json`, json);
  writeFileSync(md, "## TODO First section\n\nWrite at least 700 words in plain English, with at least five links to other BotPlanet pages.\n");
  console.log(`created ${json}\ncreated ${md}\nnext: fill them in, then  npm run page:check -- ${json}`);
} else if (cmd === "check") {
  if (!rest[0]) throw new Error("usage: page:check -- <file>");
  process.exit(check(rest[0]) ? 0 : 1);
} else if (cmd === "publish") {
  const slug = rest[0];
  const json = `${DRAFTS}/${slug}.page.json`;
  if (!slug || !existsSync(json)) throw new Error(`no draft at ${json}`);
  if (!check(json)) process.exit(1);
  const page = JSON.parse(readFileSync(json, "utf8"));
  renameSync(json, `${PAGES}/${slug}.page.json`);
  renameSync(`${DRAFTS}/${slug}.md`, `${WEB}/articles/${page.prose}.md`);
  const routeFile = `${WEB}/pages${page.path.replace(/\/$/, "")}.astro`;
  mkdirSync(routeFile.replace(/\/[^/]+$/, ""), { recursive: true });
  writeFileSync(
    routeFile,
    `---\n/* Written as a page file: content/pages/${slug}.page.json.\n   Nothing else belongs in this file. See docs/page-system/. */\nimport BestOfPage from "${"../".repeat(page.path.split("/").filter(Boolean).length)}components/BestOfPage.astro";\n---\n\n<BestOfPage path="${page.path}" />\n`,
  );
  console.log(`published ${slug}. Still to do by hand, and npm test will say which are missing:
  1. route in content/routes.ts
  2. row in content/seo/keyword-register.ts and entry in content/seo/page-plan.ts
  3. hero record in content/media/assets.ts, then npm run gen:derivatives and gen:media-mapping
  4. inbound links from older pages: RETROFITTED_INBOUND in content/internal-links.ts
  5. npm test`);
} else {
  console.error("commands: new | check | publish | schema");
  process.exit(1);
}
