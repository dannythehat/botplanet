/**
 * Affiliate discovery run.
 *
 * Asks CJ and Awin two questions the repository cannot answer on its own:
 *   1. Which advertisers are we ACTUALLY approved with right now?
 *   2. Which pool-cleaner products can we build a real offer from?
 *
 * The stored programme inventory is a snapshot from 31 July 2026. Approvals
 * happen in Danny's dashboards, not in this repo, so the only way to know the
 * current position is to ask the networks.
 *
 * Runs in GitHub Actions so the tokens stay as repository secrets and never
 * reach a developer machine or this file. Writes docs/affiliate-discovery.json
 * and docs/affiliate-discovery.md.
 *
 * Nothing here writes to the offer register. Discovery and publication are
 * separate on purpose: a product appearing in a feed is not the same as a
 * verified destination for an exact model.
 */

import { writeFileSync } from "node:fs";

const AWIN_PUBLISHER_ID = "3012175";
const AWIN = {
  programmes: `https://api.awin.com/publishers/${AWIN_PUBLISHER_ID}/programmes`,
  datafeedList: "https://productdata.awin.com/datafeed/list/apikey",
};
const CJ = {
  ads: "https://ads.api.cj.com/query",
  linkSearch: "https://link-search.api.cj.com/v2/link-search",
};

/** Terms that identify a pool-cleaning robot in a product feed. */
const POOL_TERMS = [
  "pool cleaner", "pool robot", "pool vacuum", "robotic pool", "pool skimmer",
];

const token = {
  awin: process.env.AWIN_API_TOKEN || "",
  awinFeed: process.env.AWIN_DATAFEED_KEY || "",
  cj: process.env.CJ_API_TOKEN || "",
};

/** Never let a token reach the log, even inside an error message. */
const redact = (s) => {
  let out = String(s);
  for (const t of Object.values(token)) if (t && t.length > 6) out = out.split(t).join("[redacted]");
  return out;
};

const log = (...a) => console.log(...a.map(redact));

async function getJson(url, init) {
  const res = await fetch(url, init);
  const text = await res.text();
  if (!res.ok) return { ok: false, status: res.status, body: text.slice(0, 400) };
  try {
    return { ok: true, status: res.status, data: JSON.parse(text) };
  } catch {
    return { ok: true, status: res.status, raw: text.slice(0, 4000) };
  }
}

const isPool = (s) => {
  const t = String(s || "").toLowerCase();
  return POOL_TERMS.some((term) => t.includes(term));
};

/* ------------------------------------------------------------------ */
/* Awin                                                                */
/* ------------------------------------------------------------------ */

async function awinProgrammes() {
  if (!token.awin) return { skipped: "AWIN_API_TOKEN not set" };
  const out = {};
  for (const rel of ["joined", "pending"]) {
    const r = await getJson(`${AWIN.programmes}?relationship=${rel}`, {
      headers: { Authorization: `Bearer ${token.awin}` },
    });
    if (!r.ok) { out[rel] = { error: `HTTP ${r.status}`, body: redact(r.body) }; continue; }
    out[rel] = (r.data || []).map((p) => ({
      advertiserId: String(p.id ?? p.advertiserId ?? ""),
      name: p.name,
      country: p.primaryRegion?.countryCode ?? p.countryCode ?? null,
      currency: p.currencyCode ?? null,
      displayUrl: p.displayUrl ?? null,
      market: p.primaryRegion?.name ?? null,
    }));
    log(`  Awin ${rel}: ${out[rel].length} programme(s)`);
  }
  return out;
}

async function awinFeeds() {
  if (!token.awinFeed) return { skipped: "AWIN_DATAFEED_KEY not set" };
  const r = await getJson(`${AWIN.datafeedList}/${token.awinFeed}`);
  if (!r.ok) return { error: `HTTP ${r.status}`, body: redact(r.body) };
  // The feed list is CSV, not JSON.
  const rows = String(r.raw ?? "").trim().split("\n");
  const head = (rows.shift() || "").split(",").map((h) => h.replace(/"/g, "").trim());
  const idx = (n) => head.findIndex((h) => h.toLowerCase().includes(n));
  const feeds = rows.map((line) => {
    const c = line.split(",").map((v) => v.replace(/"/g, "").trim());
    return {
      advertiserId: c[idx("advertiser id")] ?? null,
      advertiserName: c[idx("advertiser name")] ?? null,
      region: c[idx("region")] ?? c[idx("primary region")] ?? null,
      membership: c[idx("membership")] ?? null,
      products: c[idx("no of products")] ?? null,
    };
  }).filter((f) => f.advertiserName);
  log(`  Awin feeds: ${feeds.length}`);
  return feeds;
}

/* ------------------------------------------------------------------ */
/* CJ                                                                  */
/* ------------------------------------------------------------------ */

async function cjAdvertisers() {
  if (!token.cj) return { skipped: "CJ_API_TOKEN not set" };
  const query = `{ advertiserLookup(companyId: "8029924", forPublishers: true) {
    totalCount resultList { advertiserId advertiserName relationshipStatus networkRank } } }`;
  const r = await getJson(CJ.ads, {
    method: "POST",
    headers: { Authorization: `Bearer ${token.cj}`, "content-type": "application/json" },
    body: JSON.stringify({ query }),
  });
  if (!r.ok) return { error: `HTTP ${r.status}`, body: redact(r.body) };
  const list = r.data?.data?.advertiserLookup?.resultList ?? [];
  log(`  CJ advertisers: ${list.length}`);
  return list.map((a) => ({
    advertiserId: a.advertiserId,
    name: a.advertiserName,
    relationship: a.relationshipStatus,
  }));
}

async function cjPoolProducts(advertisers) {
  if (!token.cj) return { skipped: "CJ_API_TOKEN not set" };
  const joined = (Array.isArray(advertisers) ? advertisers : []).filter(
    (a) => String(a.relationship || "").toLowerCase() === "joined",
  );
  if (!joined.length) return { note: "No joined CJ advertisers to search." };

  const found = [];
  for (const adv of joined) {
    const query = `{ shoppingProducts(companyId: "8029924", partnerIds: ["${adv.advertiserId}"], keyword: "pool cleaner", limit: 50) {
      totalCount resultList { title brand price { amount currency } linkCode(pid: "101845913") { clickUrl } } } }`;
    const r = await getJson(CJ.ads, {
      method: "POST",
      headers: { Authorization: `Bearer ${token.cj}`, "content-type": "application/json" },
      body: JSON.stringify({ query }),
    });
    if (!r.ok) { found.push({ advertiser: adv.name, error: `HTTP ${r.status}` }); continue; }
    const rows = r.data?.data?.shoppingProducts?.resultList ?? [];
    const pool = rows.filter((p) => isPool(p.title));
    log(`  CJ ${adv.name}: ${rows.length} returned, ${pool.length} look like pool cleaners`);
    for (const p of pool) {
      found.push({
        advertiser: adv.name,
        advertiserId: adv.advertiserId,
        title: p.title,
        brand: p.brand ?? null,
        price: p.price ? `${p.price.amount} ${p.price.currency}` : null,
        affiliateUrl: p.linkCode?.clickUrl ?? null,
      });
    }
  }
  return found;
}

/* ------------------------------------------------------------------ */

const run = async () => {
  log("Affiliate discovery — asking the networks what we are approved for\n");

  log("Awin:");
  const awinProgs = await awinProgrammes();
  const feeds = await awinFeeds();

  log("\nCJ:");
  const cjAdvs = await cjAdvertisers();
  const cjProducts = await cjPoolProducts(cjAdvs);

  const result = {
    ranAt: new Date().toISOString(),
    note:
      "Discovery only. Nothing here is a publishable offer: a product in a feed is not a " +
      "verified destination for an exact model. Promote a row into the offer register only " +
      "after its identity is confirmed.",
    awin: { programmes: awinProgs, datafeeds: feeds },
    cj: { advertisers: cjAdvs, poolProducts: cjProducts },
  };

  writeFileSync("docs/affiliate-discovery.json", JSON.stringify(result, null, 2) + "\n");

  /* readable summary */
  const lines = ["# Affiliate discovery", "", `Run: ${result.ranAt}`, "", result.note, ""];
  const table = (title, rows, cols) => {
    lines.push(`## ${title}`, "");
    if (!Array.isArray(rows) || !rows.length) {
      lines.push(`_${rows?.skipped || rows?.error || rows?.note || "Nothing returned."}_`, "");
      return;
    }
    lines.push(`| ${cols.join(" | ")} |`, `|${cols.map(() => "---").join("|")}|`);
    for (const r of rows) lines.push(`| ${cols.map((c) => String(r[c] ?? "")).join(" | ")} |`);
    lines.push("");
  };
  table("Awin — joined", awinProgs.joined, ["advertiserId", "name", "country", "market"]);
  table("Awin — pending", awinProgs.pending, ["advertiserId", "name", "country", "market"]);
  table("Awin — product feeds", feeds, ["advertiserId", "advertiserName", "region", "membership", "products"]);
  table("CJ — advertisers", cjAdvs, ["advertiserId", "name", "relationship"]);
  table("CJ — pool products found", cjProducts, ["advertiser", "brand", "title", "price"]);
  writeFileSync("docs/affiliate-discovery.md", lines.join("\n"));

  log("\nWrote docs/affiliate-discovery.json and docs/affiliate-discovery.md");
};

run().catch((e) => {
  console.error(redact(e?.message || e));
  process.exit(1);
});
