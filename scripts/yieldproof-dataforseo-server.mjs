import http from "node:http";
import { spawn } from "node:child_process";
import { readFileSync } from "node:fs";

const port = Number(process.env.PORT || 10000);
const runToken = process.env.RUN_TOKEN;
let running = false;
let completedPayload = null;

function json(res, status, body) {
  res.writeHead(status, { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" });
  res.end(JSON.stringify(body));
}

function runResearch() {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, ["scripts/seo-research.mjs"], {
      env: { ...process.env, SEO_CATEGORY: "yieldproof", SEO_COST_CAP: "0.60" },
      stdio: ["ignore", "pipe", "pipe"],
    });
    let stdout = "";
    let stderr = "";
    child.stdout.on("data", (chunk) => { stdout += chunk.toString(); });
    child.stderr.on("data", (chunk) => { stderr += chunk.toString(); });
    child.on("error", reject);
    child.on("close", (code) => {
      if (code !== 0) {
        reject(new Error(`research exited ${code}: ${(stderr || stdout).slice(-4000)}`));
        return;
      }
      try {
        const auth = JSON.parse(readFileSync("research-output/yieldproof-auth-check.json", "utf8"));
        const research = JSON.parse(readFileSync("research-output/yieldproof-keyword-research.json", "utf8"));
        const cost = JSON.parse(readFileSync("research-output/yieldproof-cost-summary.json", "utf8"));
        resolve({ auth, research, cost });
      } catch (error) {
        reject(error);
      }
    });
  });
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host || "localhost"}`);
  if (url.pathname === "/health") {
    json(res, 200, { ok: true, service: "yieldproof-dataforseo-runner" });
    return;
  }
  if (url.pathname !== "/run") {
    json(res, 404, { error: "not found" });
    return;
  }
  if (!runToken || url.searchParams.get("token") !== runToken) {
    json(res, 403, { error: "forbidden" });
    return;
  }
  if (completedPayload) {
    json(res, 200, completedPayload);
    return;
  }
  if (running) {
    json(res, 202, { status: "running" });
    return;
  }
  running = true;
  try {
    completedPayload = await runResearch();
    json(res, 200, completedPayload);
  } catch (error) {
    json(res, 500, { error: String(error?.message || error) });
  } finally {
    running = false;
  }
});

server.listen(port, "0.0.0.0", () => {
  console.log(`yieldproof-dataforseo-runner listening on ${port}`);
});
