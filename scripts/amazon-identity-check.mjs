/**
 * Amazon US identity check.
 *
 * WHAT THIS IS FOR. An ASIN captured from a search result is a guess. It
 * becomes a destination the site is willing to publish only when the listing's
 * OWN fields — Brand, Model Name, Item model number — say it is the machine we
 * think it is. The pool build lost time to this three separate times: a
 * listing titled "C1" whose fields read "C1 PLUS", an "X1" that was an "X1
 * Essential", an "800P" the owner first called an "880P".
 *
 * So this reads the listing and reports what it actually says. It does not
 * write to the offer register and it does not decide anything. Discovery,
 * verification and publication stay separate, because a page that loads is not
 * the same as a product you can buy, and a product you can buy is not the same
 * as the product the review describes.
 *
 * MATCHING RULES, which mirror lib/providers/refresh-service.ts:
 *   - deny is checked BEFORE match, so a sibling refuses before a substring
 *     can confirm;
 *   - a deny token must never be a whole-token substring of the real model
 *     name (denying "s55" would make the HUTT S55 Pro refuse itself);
 *   - the ASIN Amazon returns must equal the ASIN requested, which is what
 *     catches a variant-family listing serving a sibling colour's data.
 *
 * Usage:  node scripts/amazon-identity-check.mjs [--json out.json]
 *
 * No credentials. Amazon is read anonymously, one listing at a time, with a
 * pause between requests — this is a handful of reads of pages we are about to
 * send buyers to, not a crawl.
 */

import { readFileSync, writeFileSync } from "node:fs";

const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

/**
 * The eleven window-cleaning machines, from
 * docs/seo/window-cleaning-robots-asins.md. Tokens come from the "sibling
 * traps" section of that document rather than being invented here.
 */
const TARGETS = [
  {
    productId: "prod-ecovacs-winbot-w2-pro-omni",
    name: "ECOVACS WINBOT W2 PRO Omni",
    asin: "B0DR8Y4VF9",
    brand: "ECOVACS",
    modelTokens: ["w2 pro omni", "winbot w2 pro omni"],
    /* "w2 pro" alone cannot deny: it is a whole-token substring of this
       machine's own name. The plain W2 PRO and the W2S Omni are denied by
       their own distinct strings instead. */
    denyTokens: ["w2s", "w1 pro", "w3 omni", "mini", "w2 pro max"],
  },
  {
    productId: "prod-ecovacs-winbot-w2-pro",
    name: "ECOVACS WINBOT W2 PRO",
    asin: "B0DSKC7QT7",
    brand: "ECOVACS",
    modelTokens: ["w2 pro", "winbot w2 pro"],
    // The Omni is the sibling this one is most often confused with.
    denyTokens: ["omni", "w2s", "w1 pro", "w3", "mini"],
  },
  {
    productId: "prod-ecovacs-winbot-w3-omni",
    name: "ECOVACS WINBOT W3 Omni",
    asin: "B0GJDQ59J1",
    brand: "ECOVACS",
    modelTokens: ["w3 omni", "winbot w3"],
    denyTokens: ["w2 pro", "w2s", "w1 pro", "mini"],
  },
  {
    productId: "prod-ecovacs-winbot-w1-pro",
    name: "ECOVACS WINBOT W1 PRO",
    asin: "B0C2CQP8ZS",
    brand: "ECOVACS",
    modelTokens: ["w1 pro", "winbot w1"],
    denyTokens: ["w2", "w3", "mini", "omni"],
  },
  {
    productId: "prod-ecovacs-winbot-w2s",
    name: "ECOVACS WINBOT W2S",
    asin: "B0G5Y3NHTX",
    brand: "ECOVACS",
    modelTokens: ["w2s", "winbot w2s"],
    /* W2S vs W2S Omni (B0G5XYX1VH) are different machines at different
       prices. "omni" denies before "w2s" can confirm. */
    denyTokens: ["omni", "w2 pro", "w1 pro", "w3", "mini"],
  },
  {
    productId: "prod-ecovacs-winbot-mini",
    name: "ECOVACS WINBOT Mini",
    asin: "B0DR8W696Y",
    brand: "ECOVACS",
    modelTokens: ["winbot mini", "mini"],
    // Mini2 (B0GJDHYRLR) is a different machine.
    denyTokens: ["mini2", "mini 2", "w1 pro", "w2", "w3", "omni"],
  },
  {
    productId: "prod-hobot-2s",
    name: "HOBOT 2S",
    asin: "B097CM7P9L",
    brand: "HOBOT",
    modelTokens: ["2s", "hobot-2s", "hobot 2s"],
    denyTokens: ["298", "288", "388", "268", "s7", "legee"],
  },
  {
    productId: "prod-cop-rose-x5s",
    name: "Cop Rose X5S",
    asin: "B09D98W5KQ",
    brand: "Cop Rose",
    modelTokens: ["x5s", "x5 s"],
    denyTokens: ["x6", "x7", "x9", "x5 pro"],
  },
  {
    productId: "prod-hobot-298",
    name: "HOBOT 298",
    asin: "B07LF4HZ6C",
    brand: "HOBOT",
    modelTokens: ["298", "hobot-298", "hobot 298"],
    // 288, 388 and 268 all exist and are near neighbours.
    denyTokens: ["288", "388", "268", "2s", "s7", "legee"],
  },
  {
    productId: "prod-mamibot-w120-dp",
    name: "Mamibot W120-DP (Blue)",
    asin: "B0DC6B81Z2",
    brand: "Mamibot",
    modelTokens: ["w120-dp", "w120 dp"],
    /* A VARIANT FAMILY: Orange B0DC67MQ46 and Grey B0DC67QH41 are the same
       model in other colours, and the W120-T is a different machine the owner
       found unbuyable. Only the Blue ASIN is recorded; the ASIN equality check
       below is what stops a sibling colour's data being accepted. */
    denyTokens: ["w120-t", "w120t", "w110", "w130"],
  },
  {
    productId: "prod-hutt-s55-pro",
    name: "HUTT S55 Pro",
    asin: "B0GFW8TFML",
    brand: "HUTT",
    /* The model name INCLUDES "Pro". "s55" must NOT be a deny token — it is a
       whole-token substring of the real name, and denying it is the mistake
       that made the Aiper X1 Pro Max refuse itself for a day. */
    modelTokens: ["s55 pro", "s55pro"],
    denyTokens: ["w55", "ddc55", "a1", "s55 max"],
  },
];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function fetchListing(asin) {
  const res = await fetch(`https://www.amazon.com/dp/${asin}`, {
    headers: { "user-agent": UA, "accept-language": "en-US,en;q=0.9" },
  });
  if (!res.ok) return { ok: false, status: res.status, html: "" };
  return { ok: true, status: res.status, html: await res.text() };
}

const clean = (s) =>
  s
    ? s
        .replace(/&amp;/g, "&")
        .replace(/&rlm;|&lrm;|&nbsp;/g, " ")
        .replace(/\s+/g, " ")
        .trim()
    : null;

/** Read one row of the "product overview" table, e.g. Brand or Model Name. */
function overviewField(html, key) {
  const re = new RegExp(
    `po-${key}"[^>]*>[\\s\\S]{0,400}?po-break-word">([^<]{1,80})<`,
    "i",
  );
  return clean(re.exec(html)?.[1]);
}

/** Read one row of the detail bullets, e.g. "Item model number". */
function bulletField(html, label) {
  const re = new RegExp(`${label}[\\s\\S]{0,200}?<span>([^<]{1,60})<`, "i");
  return clean(re.exec(html)?.[1]);
}

function readListing(html) {
  const title = clean(/<title>([^<]*)<\/title>/i.exec(html)?.[1])?.replace(
    /^Amazon\.com[\s:–-]*/i,
    "",
  );
  const whole = /a-price-whole">([0-9,]+)/.exec(html)?.[1];
  const frac = /a-price-fraction">([0-9]{2})/.exec(html)?.[1];
  return {
    title,
    // Amazon canonicalises to the ASIN it actually served. If that differs
    // from the one requested, a variant sibling answered and nothing below
    // can be trusted.
    servedAsin: /"currentAsin"\s*:\s*"([A-Z0-9]{10})"/.exec(html)?.[1] ??
      /\/dp\/([A-Z0-9]{10})/.exec(html)?.[1] ??
      null,
    brand: overviewField(html, "brand") ?? bulletField(html, "Manufacturer"),
    modelName: overviewField(html, "model_name"),
    modelNumber:
      bulletField(html, "Item model number") ?? overviewField(html, "model_number"),
    priceUsd: whole ? Number(`${whole.replace(/,/g, "")}.${frac ?? "00"}`) : null,
    ...availability(html),
    seller: clean(/sellerProfileTriggerId[^>]*>([^<]{1,60})</.exec(html)?.[1]),
  };
}

/**
 * Stock state, read from the availability block ONLY.
 *
 * The first version of this searched the whole page for "Currently
 * unavailable" and refused all eleven listings. Every one of them was in stock
 * with a price on screen: the phrase appears twice in a JavaScript string
 * table that Amazon ships on every product page, as
 * `"currentlyUnavailableMessage":"Currently unavailable"`. Searching a 3 MB
 * document for a phrase and calling the result a fact about the product is how
 * you refuse a whole category by accident.
 */
function availability(html) {
  const block = /id="availability"[\s\S]{0,600}/.exec(html)?.[0] ?? "";
  return {
    availabilityWording: clean(/primary-availability-message"[^>]*>([^<]{1,80})</.exec(block)?.[1]),
    inStock: /In Stock|Only \d+ left in stock/i.test(block),
    unavailable:
      /Currently unavailable/i.test(block) || /couldn't find that page/i.test(html),
  };
}

/** Deny before match, exactly as refresh-service does it. */
function judge(target, read) {
  const hay = [read.title, read.modelName, read.modelNumber, read.brand]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  if (!read.servedAsin) return { verdict: "unread", why: "No ASIN found in the page" };
  if (read.servedAsin !== target.asin)
    return {
      verdict: "refused",
      why: `Amazon served ${read.servedAsin}, not ${target.asin} — a variant sibling answered`,
    };
  if (read.unavailable) return { verdict: "refused", why: "Listing is unavailable" };

  const denied = target.denyTokens.filter((t) => hay.includes(t.toLowerCase()));
  if (denied.length)
    return { verdict: "refused", why: `Deny token matched: ${denied.join(", ")}` };

  const matched = target.modelTokens.filter((t) => hay.includes(t.toLowerCase()));
  if (!matched.length)
    return { verdict: "unconfirmed", why: "No model token found in the listing's own fields" };

  const brandOk =
    !read.brand || read.brand.toLowerCase().includes(target.brand.toLowerCase().split(" ")[0]);
  if (!brandOk)
    return { verdict: "refused", why: `Brand reads "${read.brand}", expected "${target.brand}"` };

  return { verdict: "confirmed", why: `Matched on: ${matched.join(", ")}` };
}

/**
 * `--targets file.json` checks a set other than the window eleven above.
 *
 * The file is an array of the same shape as TARGETS: productId, name, asin,
 * brand, modelTokens, denyTokens. The tokens are the whole point of this
 * script and are not derivable from a discovery run, so they are written by
 * hand per set — an auto-generated token list would confirm whatever it was
 * given, which is the opposite of what this is for.
 */
const targetsFile = process.argv.includes("--targets")
  ? process.argv[process.argv.indexOf("--targets") + 1]
  : null;
const RUN = targetsFile
  ? JSON.parse(readFileSync(targetsFile, "utf8"))
  : TARGETS;

const results = [];
for (const t of RUN) {
  process.stderr.write(`reading ${t.asin} (${t.name})… `);
  let read = null;
  let error = null;
  try {
    const r = await fetchListing(t.asin);
    if (!r.ok) error = `HTTP ${r.status}`;
    else read = readListing(r.html);
  } catch (e) {
    error = String(e.message ?? e);
  }
  const j = read ? judge(t, read) : { verdict: "unread", why: error ?? "no response" };
  process.stderr.write(`${j.verdict}\n`);
  results.push({ ...t, read, error, ...j });
  await sleep(1500);
}

const out = process.argv.includes("--json")
  ? process.argv[process.argv.indexOf("--json") + 1]
  : null;
if (out) writeFileSync(out, JSON.stringify({ checkedOn: new Date().toISOString().slice(0, 10), results }, null, 2));

console.log("\n| Product | ASIN | Verdict | Brand | Model no. | Price | Stock |");
console.log("|---|---|---|---|---|---|---|");
for (const r of results) {
  console.log(
    `| ${r.name} | ${r.asin} | **${r.verdict}** | ${r.read?.brand ?? "—"} | ${r.read?.modelNumber ?? "—"} | ${r.read?.priceUsd != null ? `$${r.read.priceUsd}` : "—"} | ${r.read?.inStock ? "in stock" : "—"} |`,
  );
}
console.log("");
for (const r of results) console.log(`${r.asin} ${r.verdict}: ${r.why}`);
