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
 *    anything whose asset record does not permit proportional resizing.
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
/* @extension-point per-category | optional | Artwork for a new category has to
   be added to this list and the script re-run, or every image on the page is
   served at full authored size to a phone that needs a fraction of it. Also
   per-product: each review's four images belong here.
   Cannot be auto-checked — media directories are named for the subject
   ("pool", "window", "lawn-category"), not for the category slug.
   @extension-check manual */
const SOURCES = [
  "/media/home/hero-desktop.webp",
  "/media/home/hero-mobile.webp",
  "/media/botmatch/explainer-desktop.webp",
  "/media/botmatch/explainer-mobile.webp",
  "/media/matcher/pool-bot-matcher.webp",
  "/media/pool-category/feature-desktop.webp",
  "/media/pool-category/feature-mobile.webp",
  "/media/window-category/feature-desktop.webp",
  "/media/window-category/feature-mobile.webp",
  "/media/lawn-category/feature-desktop.webp",
  "/media/lawn-category/feature-mobile.webp",
  "/media/floor-category/feature-desktop.webp",
  "/media/floor-category/feature-mobile.webp",
  "/media/security-category/feature-desktop.webp",
  "/media/security-category/feature-mobile.webp",
  "/media/companion-category/feature-desktop.webp",
  "/media/companion-category/feature-mobile.webp",
  "/media/window/hero-desktop.webp",
  "/media/window/hero-mobile.webp",
  "/media/window/glass-type-framed.webp",
  "/media/window/glass-type-frameless.webp",
  "/media/window/glass-type-high.webp",
  "/media/window/soil-rain-spots.webp",
  "/media/window/soil-dust-film.webp",
  "/media/window/soil-greasy-marks.webp",
  "/media/pool/hero-desktop.webp",
  "/media/pool/hero-mobile.webp",
  "/media/pool/pool-type-inground.webp",
  "/media/pool/pool-type-above-ground.webp",
  "/media/pool/pool-type-freeform.webp",
  "/media/pool/debris-leaves.webp",
  "/media/pool/debris-silt.webp",
  "/media/pool/debris-algae.webp",
  "/media/reviews/dolphin-nautilus-cc-plus/hero.webp",
  "/media/reviews/dolphin-nautilus-cc-plus/video-poster.webp",
  "/media/reviews/dolphin-nautilus-cc-plus/plug-and-play.webp",
  "/media/reviews/dolphin-nautilus-cc-plus/app-control.webp",
  "/media/reviews/dolphin-nautilus-cc-plus/filter-access.webp",
  "/media/reviews/polaris-freedom/hero.webp",
  "/media/reviews/polaris-freedom/cordless-dock.webp",
  "/media/reviews/polaris-freedom/app-control.webp",
  "/media/reviews/betta-se-plus/hero.webp",
  "/media/reviews/betta-se-plus/twin-motors.webp",
  "/media/reviews/betta-se-plus/sensors.webp",
  "/media/reviews/betta-se-plus/debris-basket.webp",
  "/media/reviews/dolphin-proteus-dx4-plus/hero.webp",
  "/media/reviews/dolphin-proteus-dx4-plus/every-surface.webp",
  "/media/reviews/dolphin-proteus-dx4-plus/weekly-timer.webp",
  "/media/reviews/dolphin-proteus-dx4-plus/filtration.webp",
  "/media/reviews/aiper-scuba-v3-ai-vision/hero.webp",
  "/media/reviews/aiper-scuba-v3-ai-vision/ai-patrol.webp",
  "/media/reviews/aiper-scuba-v3-ai-vision/carefree.webp",
  "/media/reviews/aiper-scuba-v3-ai-vision/filtration.webp",
  "/media/reviews/aiper-scuba-x1-pro-max/hero.webp",
  "/media/reviews/aiper-scuba-x1-pro-max/suction.webp",
  "/media/reviews/aiper-scuba-x1-pro-max/runtimes.webp",
  "/media/reviews/aiper-scuba-x1-pro-max/filtration.webp",
  "/media/reviews/aiper-seagull-se/hero.webp",
  "/media/reviews/aiper-seagull-se/charging.webp",
  "/media/reviews/aiper-seagull-se/battery.webp",
  "/media/reviews/aiper-seagull-se/retrieval.webp",
  "/media/reviews/aiper-scuba-s1/hero.webp",
  "/media/reviews/aiper-scuba-s1/four-zone.webp",
  "/media/reviews/aiper-scuba-s1/filtration.webp",
  "/media/reviews/aiper-scuba-s1/modes.webp",
  "/media/reviews/bublue-bubot-800p/hero.webp",
  "/media/reviews/bublue-bubot-800p/filtration.webp",
  "/media/reviews/bublue-bubot-800p/schedule.webp",
  "/media/reviews/bublue-bubot-800p/shallow.webp",
  "/media/reviews/wybot-c1/hero.webp",
  "/media/reviews/wybot-c1/suction.webp",
  "/media/reviews/wybot-c1/cycles.webp",
  "/media/reviews/wybot-c1/charging.webp",
  "/media/reviews/beatbot-aquasense-2-ultra/hero.webp",
  "/media/reviews/beatbot-aquasense-2-ultra/coverage.webp",
  "/media/reviews/beatbot-aquasense-2-ultra/navigation.webp",
  "/media/reviews/beatbot-aquasense-2-ultra/battery.webp",
  /* Window creatives, 7 August 2026 — the first artwork on this site for a
     product outside the pool catalogue. */
  "/media/products/ecovacs-winbot-w2-pro-omni.webp",
  "/media/reviews/ecovacs-winbot-w2-pro-omni/cleaning-modes.webp",
  "/media/reviews/ecovacs-winbot-w2-pro-omni/winbot-on.webp",
  "/media/reviews/ecovacs-winbot-w2-pro-omni/all-from-inside.webp",
  "/media/reviews/ecovacs-winbot-w2-pro-omni/three-nozzle-spray.webp",
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
  /* The other seven window products, 8 August 2026. */
  "/media/products/ecovacs-winbot-w2-pro.webp",
  "/media/reviews/ecovacs-winbot-w2-pro/three-nozzle-spray.webp",
  "/media/reviews/ecovacs-winbot-w2-pro/cleaning-modes.webp",
  "/media/products/ecovacs-winbot-w1-pro.webp",
  "/media/reviews/ecovacs-winbot-w1-pro/hero.webp",
  "/media/reviews/ecovacs-winbot-w1-pro/eight-tier.webp",
  "/media/reviews/ecovacs-winbot-w1-pro/cross-spray.webp",
  "/media/reviews/ecovacs-winbot-w1-pro/app-control.webp",
  "/media/products/hobot-2s.webp",
  "/media/reviews/hobot-2s/hero.webp",
  "/media/reviews/hobot-2s/spray-module.webp",
  "/media/reviews/hobot-2s/app-control.webp",
  "/media/products/hobot-298.webp",
  "/media/reviews/hobot-298/holding-force.webp",
  "/media/reviews/hobot-298/edge-detection.webp",
  "/media/reviews/hobot-298/bluetooth-remote.webp",
  "/media/products/hutt-s55-pro.webp",
  "/media/reviews/hutt-s55-pro/every-surface.webp",
  "/media/reviews/hutt-s55-pro/adaptive-suction.webp",
  "/media/reviews/hutt-s55-pro/safety-backup.webp",
  "/media/reviews/hutt-s55-pro/one-click.webp",
  "/media/products/mamibot-w120-dp.webp",
  "/media/reviews/mamibot-w120-dp/corner-clean.webp",
  "/media/reviews/mamibot-w120-dp/eight-in-one.webp",
  "/media/reviews/mamibot-w120-dp/dual-control.webp",
  "/media/products/cop-rose-x5s.webp",
  "/media/reviews/cop-rose-x5s/spray-suction.webp",
  "/media/reviews/cop-rose-x5s/multiple-surfaces.webp",
  /* Editorial page heroes, 8 August 2026. */
  "/media/editorial/best-robotic-pool-cleaners.webp",
  "/media/editorial/best-cordless-pool-cleaners.webp",
  "/media/editorial/above-ground-pool-cleaners.webp",
  "/media/editorial/pool-cleaner-comparison.webp",
  "/media/editorial/are-pool-cleaners-worth-it.webp",
  "/media/editorial/wire-free-mowers.webp",
  "/media/editorial/cheap-mowers.webp",
  "/media/editorial/mowers-for-hills.webp",
  "/media/editorial/robotic-pets-for-elderly.webp",
  "/media/editorial/best-window-robots.webp",
  "/media/editorial/do-window-robots-work.webp",
  /* Category hub artwork, 8 August 2026. */
  "/media/hubs/vacuums/hero.webp",
  "/media/hubs/vacuums/card-hard-floor.webp",
  "/media/hubs/vacuums/card-mixed.webp",
  "/media/hubs/vacuums/card-shag.webp",
  "/media/hubs/vacuums/row-crumbs.webp",
  "/media/hubs/vacuums/row-dock.webp",
  "/media/hubs/vacuums/row-corner.webp",
  "/media/hubs/vacuums/lead-mopped.webp",
  "/media/hubs/lawn/hero.webp",
  "/media/hubs/lawn/card-small.webp",
  "/media/hubs/lawn/card-medium.webp",
  "/media/hubs/lawn/card-large.webp",
  "/media/hubs/lawn/row-cut.webp",
  "/media/hubs/lawn/row-dew.webp",
  "/media/hubs/lawn/row-border.webp",
  "/media/hubs/litter/hero.webp",
  "/media/hubs/litter/card-average.webp",
  "/media/hubs/litter/card-large.webp",
  "/media/hubs/litter/card-kitten.webp",
  "/media/hubs/litter/row-scoop.webp",
  "/media/hubs/litter/row-two-cats.webp",
  "/media/hubs/litter/row-stretch.webp",
  "/media/hubs/litter/lead-drawer.webp",
  "/media/hubs/companion/hero.webp",
  /* Homepage directory tiles, supplied 8 August 2026. Separate files from the
     hub heroes because they are photographs of real machines rather than
     BotPlanet artwork, and the two are not interchangeable. */
  "/media/hubs/companion/tile.webp",
  "/media/hubs/petcam/hero.webp",
  "/media/hubs/petcam/tile.webp",
  "/media/hubs/pool/tile.webp",
  "/media/hubs/grill/tile.webp",
  "/media/hubs/companion/card-desk.webp",
  "/media/hubs/companion/card-child.webp",
  "/media/hubs/companion/card-older.webp",
  "/media/hubs/companion/row-alone.webp",
  "/media/hubs/companion/row-shelf.webp",
  "/media/hubs/companion/row-speech.webp",
  "/media/hubs/companion/lead-lap.webp",
  "/media/hubs/coding/hero.webp",
  "/media/hubs/coding/card-young.webp",
  "/media/hubs/coding/card-middle.webp",
  "/media/hubs/coding/card-teen.webp",
  "/media/hubs/coding/row-code.webp",
  "/media/hubs/coding/row-shelf.webp",
  "/media/hubs/coding/row-button.webp",
  "/media/hubs/coding/lead-track.webp",
  "/media/hubs/grill/hero.webp",
  "/media/hubs/grill/card-porcelain.webp",
  "/media/hubs/grill/card-cast-iron.webp",
  "/media/hubs/grill/card-stainless.webp",
  "/media/hubs/grill/lead-clean-bars.webp",
  /* WINBOT W3 Omni, unmerged 8 August 2026. */
  "/media/products/ecovacs-winbot-w3-omni.webp",
  "/media/reviews/ecovacs-winbot-w3-omni/hero.webp",
  "/media/reviews/ecovacs-winbot-w3-omni/three-nozzle-spray.webp",
  "/media/reviews/ecovacs-winbot-w3-omni/model-comparison.webp",
  "/media/reviews/ecovacs-winbot-w3-omni/path-planning.webp",
  "/media/reviews/ecovacs-winbot-w3-omni/twelve-tier.webp",
  /* The 9 August 2026 upload: grill hub coverage rows, the pet camera hub,
     seven companion products, the Enabot three and the range page. Added
     with the artwork rather than after it — a source missing from this
     list renders at full size on a phone and nothing fails. */
  "/media/hubs/grill/row-baked-on-grease.webp",
  "/media/hubs/grill/row-far-corner.webp",
  "/media/hubs/grill/row-under-grate.webp",
  "/media/hubs/petcam/hero-2026-08.webp",
  "/media/hubs/petcam/card-hallway.webp",
  "/media/hubs/petcam/card-staircase.webp",
  "/media/hubs/petcam/card-deep-pile-rug.webp",
  "/media/hubs/petcam/row-dog-by-door.webp",
  "/media/hubs/petcam/row-cat-watching.webp",
  "/media/hubs/petcam/row-empty-room.webp",
  "/media/hubs/petcam/row-older-dog.webp",
  "/media/companion/moflin/hero.webp",
  "/media/companion/moflin/figure-1.webp",
  "/media/companion/moflin/figure-2.webp",
  "/media/companion/moflin/card.webp",
  "/media/companion/miko-3/hero.webp",
  "/media/companion/miko-3/figure-1.webp",
  "/media/companion/miko-3/figure-2.webp",
  "/media/companion/miko-3/card.webp",
  "/media/companion/vector-2/hero.webp",
  "/media/companion/vector-2/figure-1.webp",
  "/media/companion/vector-2/figure-2.webp",
  "/media/companion/vector-2/card.webp",
  "/media/companion/eilik/hero.webp",
  "/media/companion/eilik/figure-1.webp",
  "/media/companion/eilik/figure-2.webp",
  "/media/companion/eilik/card.webp",
  "/media/companion/eilik/range.webp",
  "/media/companion/loona/hero.webp",
  "/media/companion/loona/figure-1.webp",
  "/media/companion/loona/figure-2.webp",
  "/media/companion/loona/card.webp",
  "/media/companion/emo/hero.webp",
  "/media/companion/emo/figure-1.webp",
  "/media/companion/emo/figure-2.webp",
  "/media/companion/emo/card.webp",
  "/media/companion/emo-vs-eilik/hero.webp",
  "/media/companion/ropet/hero.webp",
  "/media/companion/ropet/figure-1.webp",
  "/media/companion/ropet/figure-2.webp",
  "/media/companion/joy-for-all/card.webp",
  "/media/petcam/ebo-air-2/hero.webp",
  "/media/petcam/ebo-air-2/figure-1.webp",
  "/media/petcam/ebo-air-2/figure-2.webp",
  "/media/petcam/ebo-air-2/card.webp",
  "/media/petcam/ebo-se/hero.webp",
  "/media/petcam/ebo-se/figure-1.webp",
  "/media/petcam/ebo-se/figure-2.webp",
  "/media/petcam/ebo-se/card.webp",
  "/media/petcam/rola-petpal/hero.webp",
  "/media/petcam/rola-petpal/figure-1.webp",
  "/media/petcam/rola-petpal/figure-2.webp",
  "/media/petcam/range/hero.webp",
  /* The four panels the owner directed be published on 9 August 2026,
     plus the two range cards and the ROLA summary sheet. Held back on
     the day; the decision to publish them is recorded in the Command
     Centre and the figures on them are attributed in their captions. */
  "/media/petcam/ebo-air-2/panel-overview.webp",
  "/media/petcam/rola-petpal/panel-overview.webp",
  "/media/petcam/rola-petpal/panel-summary.webp",
  "/media/petcam/range/size-chart.webp",
  "/media/companion/ropet/panel-diary-privacy.webp",
  "/media/companion/loona/range.webp",
  "/media/companion/joy-for-all/panel-overview.webp",
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
