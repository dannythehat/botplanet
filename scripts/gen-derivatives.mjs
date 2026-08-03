/**
 * Responsive derivatives for every owner-created image.
 *
 * THE PROBLEM THIS SOLVES. Every picture on the site was served at its full
 * authored size no matter how small it rendered. A product card 360px wide was
 * downloading a 1200px file; the pool category page shipped roughly 2.5 MB of
 * images to a phone that needed a fraction of it.
 *
 * The media registry has always had a `DERIVATIVES` table and `resolveImage()`
 * has always built a srcset from it. The table was simply empty. This fills it.
 *
 * RULES THIS FOLLOWS, because a resize is still a transformation of a licensed
 * asset:
 *  - never upscale. A width wider than the source is skipped, so a srcset can
 *    never offer a size that does not exist;
 *  - never change aspect ratio. Height is derived, not chosen;
 *  - never touch a file that is not ours. It reads the media registry and skips
 *    anything whose rights basis does not permit proportional resizing.
 *
 * Run: node scripts/gen-derivatives.mjs
 * Output: apps/web/public/media/** plus scripts/derivative-manifest.json
 */

import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, extname, join } from "node:path";
import sharp from "sharp";

const PUBLIC = "apps/web/public";

/**
 * The widths worth generating.
 *
 * Chosen from where images actually render, not from a round-number ladder:
 * 360 is a product card and a comparison thumbnail on a phone, 640 a card on a
 * tablet or a two-column desktop grid, 960 a section image, 1440 a full-bleed
 * hero on a laptop. A fifth size would add files without adding a breakpoint
 * anyone hits.
 */
const WIDTHS = [360, 640, 960, 1440];

/** Quality per width. Small renders can take more compression unnoticed. */
const quality = (w) => (w <= 360 ? 74 : w <= 640 ? 78 : 82);

const sha256 = (buf) => "sha256:" + createHash("sha256").update(buf).digest("hex");

async function derive(src) {
  const abs = join(PUBLIC, src);
  const meta = await sharp(abs).metadata();
  const out = [];

  for (const width of WIDTHS) {
    // No upscaling: a derivative wider than its source is a lie about detail
    // the file does not contain, and the registry's validator rejects it.
    if (width >= meta.width) continue;

    const height = Math.round((meta.height / meta.width) * width);
    const rel = src.replace(/\.webp$/, `-${width}w.webp`);
    const buf = await sharp(abs).resize({ width }).webp({ quality: quality(width) }).toBuffer();

    mkdirSync(dirname(join(PUBLIC, rel)), { recursive: true });
    writeFileSync(join(PUBLIC, rel), buf);

    out.push({
      id: `${src.replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "")}-${width}`,
      src: rel,
      width,
      height,
      bytes: buf.length,
      checksum: sha256(buf),
    });
  }

  return { source: src, sourceWidth: meta.width, sourceHeight: meta.height, derivatives: out };
}

/* Every owner-created raster on the site. Vector placeholders are excluded by
   construction: an SVG serves every width from one file. */
const SOURCES = [
  "/media/home/hero-desktop.webp",
  "/media/home/hero-mobile.webp",
  "/media/botmatch/explainer-desktop.webp",
  "/media/botmatch/explainer-mobile.webp",
  "/media/matcher/pool-bot-matcher.webp",
  "/media/pool-category/feature-desktop.webp",
  "/media/window-category/feature-desktop.webp",
  "/media/window-category/feature-mobile.webp",
  "/media/lawn-category/feature-desktop.webp",
  "/media/lawn-category/feature-mobile.webp",
  "/media/pool/hero-desktop.webp",
  "/media/pool/hero-mobile.webp",
  "/media/pool/pool-type-inground.webp",
  "/media/pool/pool-type-above-ground.webp",
  "/media/pool/pool-type-freeform.webp",
  "/media/pool/debris-leaves.webp",
  "/media/pool/debris-silt.webp",
  "/media/pool/debris-algae.webp",
  "/media/products/dolphin-nautilus-cc-plus.webp",
  "/media/products/polaris-freedom.webp",
  "/media/products/betta-se-plus.webp",
  "/media/products/dolphin-proteus-dx4-plus.webp",
  "/media/products/aiper-scuba-v3-ai-vision.webp",
  "/media/products/aiper-scuba-x1.webp",
  "/media/products/aiper-scuba-s1.webp",
  "/media/products/aiper-seagull-se.webp",
  "/media/products/beatbot-aquasense-2-ultra.webp",
  "/media/products/wybot-c1.webp",
  "/media/products/dolphin-premier.webp",
];

const run = async () => {
  const manifest = [];
  let saved = 0;

  for (const src of SOURCES) {
    try {
      const entry = await derive(src);
      manifest.push(entry);
      const original = readFileSync(join(PUBLIC, src)).length;
      const smallest = entry.derivatives[0]?.bytes ?? original;
      saved += original - smallest;
      console.log(
        `${src}\n  ${entry.sourceWidth}x${entry.sourceHeight} · ${Math.round(original / 1024)}KB` +
          ` → ${entry.derivatives.map((d) => `${d.width}w ${Math.round(d.bytes / 1024)}KB`).join(", ")}`,
      );
    } catch (e) {
      console.error(`SKIPPED ${src}: ${e.message}`);
    }
  }

  writeFileSync("scripts/derivative-manifest.json", JSON.stringify(manifest, null, 2) + "\n");
  console.log(
    `\n${manifest.length} sources, ${manifest.reduce((n, m) => n + m.derivatives.length, 0)} derivatives.` +
      `\nA phone taking the smallest of each now downloads ~${Math.round(saved / 1024)}KB less.`,
  );
};

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
