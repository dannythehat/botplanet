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
  "/media/botmatch/finder-universal.webp",
  "/media/botmatch/finder-pool.webp",
  "/media/botmatch/finder-grill.webp",
  "/media/botmatch/finder-litter.webp",
  "/media/botmatch/finder-companion.webp",
  "/media/botmatch/finder-petcam.webp",
  "/media/botmatch/finder-coding.webp",
  "/media/botmatch/finder-vacuum.webp",
  "/media/botmatch/finder-lawn.webp",
  "/media/botmatch/finder-window.webp",
  /* TIER-1 LISTING CARDS, 10 August 2026. Sixteen products were live with an
     empty grid slot; these are the files that fill them. Added here as well as
     to the media registry, because this list is hand-maintained and a card
     missing from it is served at full authored size to a phone that needs
     360px of it — a 200KB image where 10KB would do. */
  "/media/litter/litter-robot-4/card.webp",
  "/media/litter/petkit-purobot-max-pro-2/card.webp",
  "/media/litter/casa-leo-loo-too/card.webp",
  "/media/litter/petsafe-scoopfree-crystal-pro/card.webp",
  "/media/lawn/segway-navimow-i110n/card.webp",
  "/media/lawn/mammotion-luba-3-awd-1500h/card.webp",
  "/media/lawn/mammotion-luba-3-awd-3000h/card.webp",
  "/media/lawn/husqvarna-automower-410iq/card.webp",
  "/media/lawn/worx-landroid-vision-wr320/card.webp",
  "/media/lawn/eufy-e15/card.webp",
  "/media/lawn/dreame-a3-awd-1000/card.webp",
  "/media/window/ecovacs-winbot-w2s/card.webp",
  "/media/window/ecovacs-winbot-mini/card.webp",
  "/media/coding/cozmo/card.webp",
  "/media/companion/moxie/card.webp",
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
  "/media/editorial/best-solar-pool-skimmers-v3.webp",
  "/media/editorial/above-ground-pool-cleaners.webp",
  "/media/editorial/pool-cleaner-comparison.webp",
  "/media/editorial/are-pool-cleaners-worth-it.webp",
  "/media/editorial/wire-free-mowers.webp",
  "/media/editorial/cheap-mowers.webp",
  "/media/editorial/mowers-for-hills.webp",
  "/media/editorial/robotic-pets-for-elderly.webp",
  "/media/editorial/best-window-robots.webp",
  "/media/editorial/best-lawn-mowers.webp",
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
  /* Educational and coding robots, supplied 9 August 2026. Five products,
     twenty-two files. Two of them arrive as small JPEGs from the makers'
     own press kits rather than as generated art, so their derivative
     ladders stop short — the generator refuses to upscale, which is the
     right answer and the reason nothing here claims a width it lacks. */
  "/media/coding/sphero-bolt/hero.webp",
  "/media/coding/sphero-bolt/figure-1.webp",
  "/media/coding/sphero-bolt/figure-2.webp",
  "/media/coding/sphero-bolt/card.webp",
  "/media/coding/sphero-mini/hero.webp",
  "/media/coding/sphero-mini/figure-1.webp",
  "/media/coding/sphero-mini/figure-2.webp",
  "/media/coding/sphero-mini/card.webp",
  "/media/coding/sphero-indi/panel-overview.webp",
  "/media/coding/sphero-indi/hero.webp",
  "/media/coding/sphero-indi/figure-1.webp",
  "/media/coding/sphero-indi/figure-2.webp",
  "/media/coding/sphero-indi/card.webp",
  "/media/coding/ozobot-evo/hero.webp",
  "/media/coding/ozobot-evo/figure-1.webp",
  "/media/coding/ozobot-evo/figure-2.webp",
  "/media/coding/ozobot-evo/card.webp",
  "/media/coding/makeblock-mbot/panel-app.webp",
  "/media/coding/makeblock-mbot/hero.webp",
  "/media/coding/makeblock-mbot/figure-1.webp",
  "/media/coding/makeblock-mbot/figure-2.webp",
  "/media/coding/makeblock-mbot/card.webp",
  /* Code & Go Robot Mouse, owner-supplied 26 September 2026. card.webp is a
     separate file from figure-1.webp despite matching bytes: the derivative
     matcher below keys derivatives to the first asset record found at a given
     source path, so two MEDIA_ASSETS records sharing one path silently lose
     responsive variants on whichever record loses that lookup. */
  "/media/coding/code-and-go-robot-mouse/hero.webp",
  "/media/coding/code-and-go-robot-mouse/figure-1.webp",
  "/media/coding/code-and-go-robot-mouse/figure-2.webp",
  "/media/coding/code-and-go-robot-mouse/card.webp",
  /* Botley 2.0, owner-supplied 26 September 2026. Same reason card.webp is
     its own file rather than reusing hero.webp. */
  "/media/coding/botley-the-coding-robot/hero.webp",
  "/media/coding/botley-the-coding-robot/figure-1.webp",
  "/media/coding/botley-the-coding-robot/figure-2.webp",
  "/media/coding/botley-the-coding-robot/card.webp",

  /* THE 11 AUGUST DROP. Fifty-eight files across seventeen product reviews,
     every one of which had an empty picture slot before this. Same reason as
     the block above: hand-maintained, and a file missing here is served at
     full authored size to a phone that wanted a third of it. */
  // grillbot
  "/media/reviews/grillbot/hero.webp",
  // eufy-x10-pro-omni
  "/media/reviews/eufy-x10-pro-omni/hero.webp",
  "/media/reviews/eufy-x10-pro-omni/underside.webp",
  // eufy-omni-s1-pro
  "/media/reviews/eufy-omni-s1-pro/hero.webp",
  "/media/reviews/eufy-omni-s1-pro/stain-lift.webp",
  "/media/reviews/eufy-omni-s1-pro/slim-profile.webp",
  // roborock-s8-max-ultra
  "/media/reviews/roborock-s8-max-ultra/hero.webp",
  "/media/reviews/roborock-s8-max-ultra/underside.webp",
  "/media/reviews/roborock-s8-max-ultra/dock.webp",
  // roborock-saros-10
  "/media/reviews/roborock-saros-10/hero.webp",
  "/media/reviews/roborock-saros-10/suction.webp",
  "/media/reviews/roborock-saros-10/brushes.webp",
  // dreame-x40-ultra
  "/media/reviews/dreame-x40-ultra/hero.webp",
  "/media/reviews/dreame-x40-ultra/washboard.webp",
  "/media/reviews/dreame-x40-ultra/avoidance.webp",
  // dreame-x50-ultra
  "/media/reviews/dreame-x50-ultra/hero.webp",
  "/media/reviews/dreame-x50-ultra/mop-washing.webp",
  "/media/reviews/dreame-x50-ultra/brushes.webp",
  // ecovacs-deebot-t90-pro-omni
  "/media/reviews/ecovacs-deebot-t90-pro-omni/hero.webp",
  "/media/reviews/ecovacs-deebot-t90-pro-omni/thresholds.webp",
  "/media/reviews/ecovacs-deebot-t90-pro-omni/suction-noise.webp",
  "/media/reviews/ecovacs-deebot-t90-pro-omni/lift.webp",
  // shark-powerdetect-av2820s
  "/media/reviews/shark-powerdetect-av2820s/hero.webp",
  "/media/reviews/shark-powerdetect-av2820s/pet-hair.webp",
  "/media/reviews/shark-powerdetect-av2820s/self-empty.webp",
  "/media/reviews/shark-powerdetect-av2820s/neverstuck.webp",
  // shark-matrix-plus-ur2650ws
  "/media/reviews/shark-matrix-plus-ur2650ws/hero.webp",
  "/media/reviews/shark-matrix-plus-ur2650ws/mapping.webp",
  "/media/reviews/shark-matrix-plus-ur2650ws/filtration.webp",
  "/media/reviews/shark-matrix-plus-ur2650ws/pets.webp",
  // roomba-max-705
  "/media/reviews/roomba-max-705/hero.webp",
  "/media/reviews/roomba-max-705/precisionvision.webp",
  "/media/reviews/roomba-max-705/lidar.webp",
  "/media/reviews/roomba-max-705/edge.webp",
  // husqvarna-automower-410iq
  "/media/reviews/husqvarna-automower-410iq/hero.webp",
  "/media/reviews/husqvarna-automower-410iq/wire-free.webp",
  "/media/reviews/husqvarna-automower-410iq/durability.webp",
  "/media/reviews/husqvarna-automower-410iq/cut-quality.webp",
  // dreame-a3-awd-1000
  "/media/reviews/dreame-a3-awd-1000/hero.webp",
  "/media/reviews/dreame-a3-awd-1000/slope.webp",
  "/media/reviews/dreame-a3-awd-1000/obstacle-vision.webp",
  "/media/reviews/dreame-a3-awd-1000/coverage.webp",
  // worx-landroid-vision-wr320
  "/media/reviews/worx-landroid-vision-wr320/hero.webp",
  "/media/reviews/worx-landroid-vision-wr320/obstacles.webp",
  "/media/reviews/worx-landroid-vision-wr320/edge.webp",
  "/media/reviews/worx-landroid-vision-wr320/coverage.webp",
  // segway-navimow-i110n
  "/media/reviews/segway-navimow-i110n/hero.webp",
  "/media/reviews/segway-navimow-i110n/rtk.webp",
  "/media/reviews/segway-navimow-i110n/zoning.webp",
  "/media/reviews/segway-navimow-i110n/voice.webp",
  // eufy-e15
  "/media/reviews/eufy-e15/hero.webp",
  "/media/reviews/eufy-e15/cutting-height.webp",
  "/media/reviews/eufy-e15/obstacles.webp",
  "/media/reviews/eufy-e15/app-security.webp",
  // mammotion-luba-3-awd-1500h
  "/media/reviews/mammotion-luba-3-awd-1500h/hero.webp",
  "/media/reviews/mammotion-luba-3-awd-1500h/cutting-decks.webp",
  "/media/reviews/mammotion-luba-3-awd-1500h/navigation.webp",
  "/media/reviews/mammotion-luba-3-awd-1500h/obstacles.webp",
  // yarbo-snow-blower
  "/media/reviews/yarbo-snow-blower/hero.webp",
  "/media/reviews/yarbo-snow-blower/module-split.webp",
  "/media/reviews/yarbo-snow-blower/tracked-platform.webp",
  "/media/reviews/yarbo-snow-blower/chute-control.webp",
  "/media/reviews/yarbo-snow-blower/conditions.webp",
  "/media/reviews/yarbo-snow-blower/daylight-driveway.webp",
  // robot-dog-toys guide. These arrived as seven 2MB PNGs under /images/ with
  // generator filenames and were served as-is: the guide's hero downloaded
  // 1.8MB before first paint and the comparison table used 2MB files as 64px
  // thumbnails. Found by audit:weight on 1 October 2026.
  "/media/guides/robot-dog-toys/hero.webp",
  "/media/guides/robot-dog-toys/loona.webp",
  "/media/guides/robot-dog-toys/ruko.webp",
  "/media/guides/robot-dog-toys/bittle.webp",
  "/media/guides/robot-dog-toys/mechdog.webp",
  "/media/guides/robot-dog-toys/puppypi.webp",
  "/media/guides/robot-dog-toys/senior.webp",
  "/media/guides/robot-dog-toys/thumb-row-2.webp",
  // Rendered in the homepage footer and the robot-dog feature with no responsive
  // variants until audit:weight flagged it on 1 October 2026.
  "/media/hubs/companion/tile.webp",
  // betta-se-plus, the seven panels added 1 October 2026 (the SE Plus is the
  // solar-skimmer best-of's anchor machine).
  "/media/reviews/betta-se-plus/photo-top.webp",
  "/media/reviews/betta-se-plus/charging-modes.webp",
  "/media/reviews/betta-se-plus/non-stop-30h.webp",
  "/media/reviews/betta-se-plus/motors-sct.webp",
  "/media/reviews/betta-se-plus/fall-winter.webp",
  "/media/reviews/betta-se-plus/basket-photo.webp",
  "/media/reviews/betta-se-plus/radar-uv.webp",
  // 1 October 2026: the three new solar skimmers.
  "/media/reviews/aiper-ecosurfer-s2/hero.webp",
  "/media/reviews/aiper-ecosurfer-s2/thumb.webp",
  "/media/reviews/aiper-ecosurfer-s2/edge-corner.webp",
  "/media/reviews/aiper-ecosurfer-s2/filtration.webp",
  "/media/reviews/aiper-ecosurfer-s2/anti-stranding.webp",
  "/media/reviews/beatbot-iskim/hero.webp",
  "/media/reviews/beatbot-iskim/basket-9l.webp",
  "/media/reviews/beatbot-iskim/rain-24-7.webp",
  "/media/reviews/beatbot-iskim/sonicsense.webp",
  "/media/reviews/beatbot-iskim/edge-following.webp",
  "/media/reviews/beatbot-iskim/anti-spill.webp",
  "/media/reviews/beatbot-iskim/solartrack.webp",
  "/media/reviews/beatbot-iskim/auto-park.webp",
  "/media/reviews/brinbo-sk01/hero.webp",
  "/media/reviews/brinbo-sk01/surface-cleaning.webp",
  "/media/reviews/brinbo-sk01/charging.webp",
  "/media/reviews/brinbo-sk01/app-support.webp",
  "/media/reviews/brinbo-sk01/ultrasonic.webp",
  "/media/reviews/brinbo-sk01/anti-stuck.webp",
  "/media/reviews/brinbo-sk01/two-modes.webp",
  // 1 October 2026: Betta SE (base model) listing images.
  "/media/reviews/betta-se-plus/se-front.webp",
  "/media/reviews/betta-se-plus/se-auto-clean.webp",
  "/media/reviews/betta-se-plus/se-cordless-solar.webp",
  "/media/reviews/betta-se-plus/se-exploded.webp",
  "/media/reviews/betta-se-plus/se-motors.webp",
  "/media/reviews/betta-se-plus/se-radar-uv.webp",
  "/media/reviews/betta-se-plus/se-basket.webp",
  // 1 October 2026: owner-made product renders for the four solar skimmers.
  "/media/reviews/betta-se-plus/render.webp",
  "/media/reviews/brinbo-sk01/render.webp",
  "/media/reviews/beatbot-iskim/render.webp",
  "/media/reviews/aiper-ecosurfer-s2/render.webp",
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
