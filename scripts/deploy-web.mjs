/**
 * Deploy apps/web to Cloudflare Workers from a workstation.
 *
 * WHY THIS EXISTS. Deployment normally happens in GitHub Actions on a push to
 * main, with CLOUDFLARE_API_TOKEN supplied as a repository secret. On 8 August
 * 2026 the repository's Actions entitlement lapsed: runs are created, no runner
 * is ever assigned (runner_id 0, no steps, logs 404), and they fail in about
 * two seconds. Nothing in the workflow file can fix that, so a merged and
 * tested main sat undeployed.
 *
 * This is the same two commands the workflow runs — `astro build` then
 * `wrangler deploy` — with the credential loaded from a file OUTSIDE the
 * repository rather than typed onto a command line.
 *
 * THE CREDENTIAL NEVER ENTERS THIS REPOSITORY. The env file lives wherever the
 * operator keeps it and is passed by path. Nothing here prints it, and the
 * standing rule is unchanged: never write a credential into a file inside the
 * repo and never into a commit.
 *
 * CI REMAINS THE REAL ROUTE. This is a manual fallback for a broken runner, not
 * a replacement for the pipeline: it does NOT run the test suite or the
 * typecheck the workflow gates on. Run `npm test` first, every time — the
 * workflow does, and skipping it is how an untested build reaches production.
 *
 * Usage: node scripts/deploy-web.mjs /path/to/cloudflare.env
 */

import { readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";

const envPath = process.argv[2];
if (!envPath) {
  console.error("Usage: node scripts/deploy-web.mjs /path/to/cloudflare.env");
  console.error("The file needs CLOUDFLARE_API_TOKEN, and CLOUDFLARE_ACCOUNT_ID if the");
  console.error("token is scoped to more than one account. Keep it outside the repo.");
  process.exit(1);
}

/** Plain KEY=VALUE parsing. No expansion, no quoting rules, no surprises. */
const env = { ...process.env };
let loaded = 0;
for (const line of readFileSync(envPath, "utf8").split("\n")) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith("#")) continue;
  const eq = trimmed.indexOf("=");
  if (eq < 1) continue;
  env[trimmed.slice(0, eq).trim()] = trimmed.slice(eq + 1).trim();
  loaded += 1;
}

if (!env.CLOUDFLARE_API_TOKEN) {
  console.error(`No CLOUDFLARE_API_TOKEN in ${envPath}. Refusing to run.`);
  process.exit(1);
}
/* The count, never the values. */
console.error(`Loaded ${loaded} variable(s) from ${envPath}.`);

const run = (cmd, args, cwd) => {
  console.error(`\n$ ${cmd} ${args.join(" ")}`);
  const r = spawnSync(cmd, args, { cwd, env, stdio: "inherit", shell: false });
  if (r.status !== 0) {
    console.error(`\n${cmd} exited ${r.status}. Stopping.`);
    process.exit(r.status ?? 1);
  }
};

run("npx", ["astro", "build"], "apps/web");
run("npx", ["wrangler", "deploy"], "apps/web");

console.error("\nDeployed. Verify against production before believing it — a green");
console.error("deploy and a correct page are different claims, and the edge cache has");
console.error("served a stale one before.");
