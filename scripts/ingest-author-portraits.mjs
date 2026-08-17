/**
 * Turn the two supplied author photographs into square portraits.
 *
 * WHY A SCRIPT RATHER THAN TWO HAND CROPS. The Facebook screenshot has to be
 * measured, not eyeballed: the photograph inside it sits between two black
 * bars, and picking the edge by eye means a black strip along the top of a
 * face at some sizes and a cropped forehead at others. The bars are found by
 * scanning row brightness — see scripts/_bounds — and the numbers below came
 * out of that scan rather than out of a guess.
 *
 * SQUARE, BECAUSE THE AUTHOR PLATE IS A CIRCLE. A portrait cropped to a square
 * centred on the face survives being masked to a circle at 52px and being shown
 * at 220px on the author page. A 3:4 photograph masked to a circle loses the
 * chin.
 *
 * NOTHING IS RETOUCHED, RECOLOURED OR GENERATED. These are photographs of two
 * real people supplied by the site's owner; the only operations here are crop,
 * resize and re-encode.
 *
 *   node scripts/ingest-author-portraits.mjs
 */
import sharp from "sharp";
import { mkdirSync } from "node:fs";

const UPLOADS = "/root/.claude/uploads/32861255-3f41-52a8-8beb-c21f7c7ea93f";
const OUT = "apps/web/public/media/authors";
/** The sizes the author box and the author page actually request. */
const WIDTHS = [104, 220, 440];

const SOURCES = [
  {
    id: "michelle-choa",
    file: `${UPLOADS}/0a6707aa-1000023820.png`,
    /* 1122x1402, already a headshot. Square of 1000 taken from the top so the
       head sits in the upper third of the frame the way a portrait should,
       nudged right because she is off-centre to the left of the frame. */
    crop: { left: 90, top: 40, width: 1000, height: 1000 },
  },
  {
    id: "danny",
    file: `${UPLOADS}/a5b30d32-1000021832.jpg`,
    /* 1080x2400 phone screenshot. The photograph itself runs y 643 to y 1720 —
       measured by row brightness, not chosen — so it is 1080x1077, which is
       square already. Two pixels are trimmed off each edge to keep the bars
       out entirely at every scale. */
    crop: { left: 2, top: 645, width: 1076, height: 1073 },
  },
];

mkdirSync(OUT, { recursive: true });

for (const s of SOURCES) {
  const meta = await sharp(s.file).metadata();
  const side = Math.min(s.crop.width, s.crop.height);

  for (const w of WIDTHS) {
    const out = `${OUT}/${s.id}-${w}w.webp`;
    await sharp(s.file)
      .extract({ ...s.crop, width: side, height: side })
      .resize(w, w, { fit: "cover" })
      .webp({ quality: 86 })
      .toFile(out);
    console.log(`  ${out}`);
  }

  /* The 1x source the srcset falls back to. */
  const base = `${OUT}/${s.id}.webp`;
  await sharp(s.file)
    .extract({ ...s.crop, width: side, height: side })
    .resize(440, 440, { fit: "cover" })
    .webp({ quality: 88 })
    .toFile(base);
  console.log(`${s.id}: source ${meta.width}x${meta.height} → ${side}px square → ${base}`);
}

console.log("\ndone. These are photographs of real people supplied by the owner;");
console.log("nothing here retouches, recolours or generates any part of them.");
