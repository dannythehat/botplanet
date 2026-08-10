/**
 * Find the empty CTA frame in a composed BotPlanet Bot Finder card.
 *
 * WHY THIS IS A SCRIPT AND NOT A GUESS. components/BotFinderCard.astro puts a
 * real HTML button inside a rectangle that is drawn into the artwork. If the
 * numbers are eyeballed the button sits a few pixels proud of its border on
 * somebody's phone and the whole illusion — one composed advertisement — dies.
 * The generator also refuses to put the frame in the same place twice: across
 * the first three cards it moved by six percent of the image width.
 *
 * THREE WRONG METHODS CAME FIRST, all of which produced confident numbers:
 *   – a bounding box over "bright" pixels caught the card's own outer border,
 *     reporting a frame 97% wide;
 *   – a row through the MIDDLE of the frame crosses its empty interior, where
 *     the only bright pixels are whatever the artwork puts behind the glass;
 *     the pool card came back 0.89% wide;
 *   – the full-width top and bottom rules are shorter than the frame, because
 *     these frames have chamfered notched corners; that reported 40% on a
 *     frame nearer 60%.
 *
 * What works: the frame's strokes are THIN — two to six pixels — and there are
 * two of them a side. Scan the row through the middle for thin bright runs,
 * ignore the card's own border near the edges, and the innermost pair either
 * side is the box a button may occupy without covering the glow.
 *
 *   node scripts/measure-cta-frame.mjs <file...>
 */
import sharp from "sharp";

const files = process.argv.slice(2);
if (files.length === 0) {
  console.error("usage: node scripts/measure-cta-frame.mjs <file...>");
  process.exit(2);
}

for (const file of files) {
  const { data, info } = await sharp(file).raw().ensureAlpha().toBuffer({ resolveWithObject: true });
  const { width: W, height: H, channels: C } = info;
  const px = (x, y) => { const i = (y * W + x) * C; return [data[i], data[i + 1], data[i + 2]]; };
  const lit = (x, y) => { const [r, g, b] = px(x, y); return b > 150 && (g > 120 || r > 120); };

  const runsX = (y, from, to) => {
    const out = []; let s = null;
    for (let x = from; x < to; x++) {
      if (lit(x, y)) { if (s === null) s = x; }
      else if (s !== null) { out.push([s, x - 1]); s = null; }
    }
    if (s !== null) out.push([s, to - 1]);
    return out;
  };
  const runsY = (x, from, to) => {
    const out = []; let s = null;
    for (let y = from; y < to; y++) {
      if (lit(x, y)) { if (s === null) s = y; }
      else if (s !== null) { out.push([s, y - 1]); s = null; }
    }
    if (s !== null) out.push([s, to - 1]);
    return out;
  };

  /* The band: the widest bright horizontal rule in the bottom third is the
     frame's top or bottom edge; walk out from it to the other one. */
  let best = null;
  for (let y = Math.floor(H * 0.62); y < H; y++) {
    for (const [a, b] of runsX(y, 0, W)) {
      if (b - a > W * 0.3 && (!best || b - a > best.w)) best = { y, w: b - a };
    }
  }
  if (!best) { console.error(`${file}: no CTA frame found`); continue; }
  let top = best.y, bottom = best.y;
  for (let y = best.y + 1; y < H; y++) if (runsX(y, 0, W).some(([a, b]) => b - a > W * 0.3)) bottom = y;
  for (let y = best.y - 1; y > H * 0.5; y--) if (runsX(y, 0, W).some(([a, b]) => b - a > W * 0.3)) top = y;

  /* Thin strokes only, and away from the card's own border. */
  const EDGE = Math.round(W * 0.08);
  const midY = Math.round((top + bottom) / 2);
  const thinX = runsX(midY, EDGE, W - EDGE).filter(([a, b]) => b - a <= 6);
  if (thinX.length < 2) { console.error(`${file}: could not read the side strokes`); continue; }
  const innerL = thinX[0][1] + 1;
  const innerR = thinX[thinX.length - 1][0] - 1;

  const midX = Math.round((innerL + innerR) / 2);
  const thinY = runsY(midX, top - 8, bottom + 8).filter(([a, b]) => b - a <= 8);
  const innerT = thinY.length >= 2 ? thinY[0][1] + 1 : top + 9;
  const innerB = thinY.length >= 2 ? thinY[thinY.length - 1][0] - 1 : bottom - 9;

  const pc = (v, t) => `${((v / t) * 100).toFixed(2)}%`;
  console.log(`${file}  ${W}x${H}`);
  console.log(`  inner box   x ${innerL}..${innerR}   y ${innerT}..${innerB}`);
  console.log(`  cta: { centreY: "${pc((innerT + innerB) / 2, H)}", width: "${pc(innerR - innerL, W)}", height: "${pc(innerB - innerT, H)}" }`);
  const cx = ((innerL + innerR) / 2 / W) * 100;
  if (Math.abs(cx - 50) > 0.6) console.log(`  NOTE centre-x is ${cx.toFixed(2)}% — pass centreX to the card`);
}
