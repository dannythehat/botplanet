#!/usr/bin/env node
/**
 * Builds a page's hero from a supplied picture, the same way every time.
 *
 *   node scripts/page-hero.mjs --src <picture> --title "Solar Skimmers" \
 *     --kicker "BEST OF · POOL" --out apps/web/public/media/editorial/<slug>.webp \
 *     [--mobile-out apps/web/public/media/editorial/<slug>-mobile.webp] [--focus-x 0.63] [--mobile-focus-x 0.72]
 *
 * Desktop is 1672x941 (16:9). Mobile, when asked for, is 900x1125 (4:5). Both are
 * cropped around --focus-x (0 left edge, 1 right edge; default centre) so the
 * subject stays in frame, with a soft dark gradient behind the title so it reads on
 * any picture. The sizes come from page-system/rules.ts and the page test fails
 * on any other size, so do not resize the output by hand.
 *
 * The result still needs a record in content/media/assets.ts (alt text, source),
 * `npm run gen:derivatives` and `npm run gen:media-mapping`.
 */
import sharp from "sharp";

const args = Object.fromEntries(
  process.argv.slice(2).reduce((acc, a, i, all) => {
    if (a.startsWith("--")) acc.push([a.slice(2), all[i + 1]]);
    return acc;
  }, []),
);
for (const k of ["src", "title", "out"]) {
  if (!args[k]) {
    console.error(`missing --${k}`);
    process.exit(1);
  }
}
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;");
const focusX = args["focus-x"] === undefined ? 0.5 : Number(args["focus-x"]);
const mobileFocusX = args["mobile-focus-x"] === undefined ? focusX : Number(args["mobile-focus-x"]);
const words = args.title.split(" ");
const lines = words.length > 1 ? [words[0], words.slice(1).join(" ")] : [words[0]];

async function make(W, H, out, mobile) {
  const meta = await sharp(args.src).metadata();
  const target = W / H;
  let cw = meta.width,
    ch = meta.height;
  if (meta.width / meta.height > target) cw = Math.round(meta.height * target);
  else ch = Math.round(meta.width / target);
  const fx = mobile ? mobileFocusX : focusX;
  const left = Math.max(0, Math.min(meta.width - cw, Math.round(fx * meta.width - cw / 2)));
  const top = Math.max(0, Math.round((meta.height - ch) / 2));
  const base = await sharp(args.src).extract({ left, top, width: cw, height: ch }).resize(W, H).toBuffer();
  const size = mobile ? 96 : 112;
  const y2 = H - (mobile ? 70 : 83);
  const y1 = y2 - Math.round(size * 1.04);
  const x = mobile ? 48 : 62;
  const kick = args.kicker
    ? `<text x="${x + 2}" y="${y1 - size + 6}" font-size="${mobile ? 26 : 30}" letter-spacing="7" fill="#9fd0ff">${esc(args.kicker)}</text>`
    : "";
  const text = lines
    .map((l, i) => {
      const y = i === 0 ? y1 : y2;
      return `<text x="${x}" y="${y}" font-size="${size}" stroke="#000" stroke-opacity="0.35" stroke-width="6">${esc(l)}</text><text x="${x}" y="${y}" font-size="${size}">${esc(l)}</text>`;
    })
    .join("");
  const grad = mobile
    ? `<linearGradient id="g" x1="0" x2="0" y1="0" y2="1"><stop offset="0.35" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity="0.7"/></linearGradient>`
    : `<linearGradient id="g" x1="0" x2="1" y1="0" y2="0"><stop offset="0" stop-color="#000" stop-opacity="0.55"/><stop offset="0.5" stop-color="#000" stop-opacity="0.18"/><stop offset="1" stop-color="#000" stop-opacity="0"/></linearGradient>`;
  const svg = Buffer.from(
    `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg"><defs>${grad}</defs><rect width="${W}" height="${H}" fill="url(#g)"/><g font-family="DejaVu Sans, Arial, Helvetica, sans-serif" font-weight="700" fill="#fff">${kick}${text}</g></svg>`,
  );
  await sharp(base).composite([{ input: svg }]).webp({ quality: 90 }).toFile(out);
  console.log(`wrote ${out} (${W}x${H})`);
}

await make(1672, 941, args.out, false);
if (args["mobile-out"]) await make(900, 1125, args["mobile-out"], true);
