/**
 * Generates the branded product placeholders.
 *
 * WHY FILES RATHER THAN AN INLINE COMPONENT: a placeholder is an ASSET. It has
 * to carry a checksum, intrinsic dimensions and a rights record like everything
 * else, and it has to be withdrawable through the same switch. Inline markup
 * cannot be catalogued or withdrawn; a file can.
 *
 * The artwork is deliberately abstract. It names the exact model in text and
 * depicts nothing, so it can never be mistaken for a photograph of the product.
 *
 * Run: node scripts/gen-placeholders.mjs
 */
import { writeFileSync, mkdirSync } from "node:fs";
import { createHash } from "node:crypto";
import { join } from "node:path";

const OUT = "apps/web/public/media/placeholder";
mkdirSync(OUT, { recursive: true });

const W = 1200;
const H = 750;

/** Exact model names come from the Job 8 verification record. */
const PRODUCTS = [
  ["wybot-c1", "WYBOT C1 Cordless Robotic Pool Cleaner", "WYBOT"],
  ["dolphin-nautilus-cc-plus", "Dolphin Nautilus CC Plus w/Wi-Fi", "Maytronics"],
  ["dolphin-premier", "Dolphin Premier", "Maytronics"],
  ["polaris-freedom", "Polaris FREEDOM Cordless Robotic Cleaner", "Polaris"],
  ["betta-se-plus", "Betta SE Plus Solar-Powered Robotic Pool Skimmer", "Betta"],
  ["dolphin-e10", "Dolphin E10", "Maytronics"],
  ["beatbot-aquasense-2-ultra", "Beatbot AquaSense 2 Ultra Robotic Pool Cleaner", "Beatbot"],
  ["aiper-scuba-x1", "Aiper Scuba X1", "Aiper"],
  ["aiper-scuba-s1", "Aiper Scuba S1 Cordless Robotic Pool Cleaner", "Aiper"],
  ["aiper-seagull-se", "Aiper Seagull SE", "Aiper"],
];

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/** Wraps the model name so a long name never overflows the panel. */
function wrap(text, max) {
  const words = text.split(" ");
  const lines = [];
  let line = "";
  for (const w of words) {
    if ((line + " " + w).trim().length > max && line) {
      lines.push(line.trim());
      line = w;
    } else {
      line = (line + " " + w).trim();
    }
  }
  if (line) lines.push(line);
  return lines.slice(0, 3);
}

const svg = (model, brand) => {
  const initials = brand.split(/\s+/).slice(0, 2).map((w) => w[0]).join("").toUpperCase();
  const lines = wrap(model, 30);
  const startY = 452 - (lines.length - 1) * 21;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-hidden="true">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0.6" y2="1">
      <stop offset="0" stop-color="#12161b"/><stop offset="1" stop-color="#050607"/>
    </linearGradient>
    <radialGradient id="glow" cx="0.5" cy="0.34" r="0.55">
      <stop offset="0" stop-color="#cdd3da" stop-opacity="0.16"/>
      <stop offset="1" stop-color="#cdd3da" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <rect width="${W}" height="${H}" fill="url(#glow)"/>
  <g fill="none" stroke="#ffffff" stroke-opacity="0.06">
    <circle cx="600" cy="255" r="112"/><circle cx="600" cy="255" r="158"/><circle cx="600" cy="255" r="204"/>
  </g>
  <text x="600" y="276" text-anchor="middle" font-family="system-ui,-apple-system,Segoe UI,Roboto,sans-serif"
        font-size="86" font-weight="700" fill="#ffffff" fill-opacity="0.90" letter-spacing="-2">${esc(initials)}</text>
${lines.map((l, i) => `  <text x="600" y="${startY + i * 42}" text-anchor="middle" font-family="system-ui,-apple-system,Segoe UI,Roboto,sans-serif" font-size="31" font-weight="600" fill="#f4f6f8">${esc(l)}</text>`).join("\n")}
  <text x="600" y="${startY + lines.length * 42 + 26}" text-anchor="middle" font-family="system-ui,-apple-system,Segoe UI,Roboto,sans-serif"
        font-size="19" fill="#9299a3">BotPlanet illustration — not a photograph of this product</text>
  <rect x="0" y="${H - 4}" width="${W}" height="4" fill="#c9ced5" fill-opacity="0.5"/>
</svg>
`;
};

const manifest = [];
for (const [slug, model, brand] of PRODUCTS) {
  const body = svg(model, brand);
  writeFileSync(join(OUT, `${slug}.svg`), body);
  manifest.push({
    slug,
    model,
    src: `/media/placeholder/${slug}.svg`,
    width: W,
    height: H,
    checksum: `sha256:${createHash("sha256").update(body).digest("hex")}`,
  });
}

writeFileSync("scripts/placeholder-manifest.json", JSON.stringify(manifest, null, 2) + "\n");
console.log(`wrote ${manifest.length} placeholders to ${OUT}`);
