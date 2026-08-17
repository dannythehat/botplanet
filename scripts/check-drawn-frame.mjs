/**
 * Does this image still carry a drawn border?
 *
 * The mobile category artwork arrives with a thin silver frame set a few pixels
 * in from the edge. It looks fine viewed whole and looks like a rendering bug
 * once the picture reaches the edge of a plate, so it is cropped off — and the
 * crop has to be checked, not assumed.
 *
 * THE MISTAKE THIS REPLACES. The first check took the brightest pixel near each
 * edge and called anything bright a surviving frame. It reported one on the
 * security artwork, where the crop was clean and the bright pixels were wet
 * ground reflecting a porch light. Brightness is not the signal.
 *
 * A drawn frame is a LINE: bright along essentially its whole length. Real
 * content is bright in places and dark in others. So this measures the fraction
 * of each edge that is bright. A frame reads near 100%; a photograph does not.
 *
 * AND IT HAS TO END. That test alone flagged the window desktop artwork, whose
 * right edge is 94% bright — because it is sky, and the sky carries on being
 * sky. A line goes bright and then stops: dark again a few pixels inside. So an
 * edge only counts as a frame if it is bright at the very edge AND dark just
 * within it. Two signals, because either one alone gets a real picture wrong.
 *
 * Run: node scripts/check-drawn-frame.mjs <path...>
 */
import sharp from "sharp";

/** Above this share of a bright edge line, the edge is uniform enough to be a line. */
const FRAME_SHARE = 0.9;
/** ...but only if it has gone dark again by here, which content does not do. */
const INSIDE_SHARE = 0.35;
const BRIGHT = 70;
/** How far in to look: these frames sit within ~40px of the edge. */
const DEPTH = 4;
/** Far enough past any of these frames to be back in the picture. */
const INSIDE_AT = 16;

async function check(file) {
  const { data, info } = await sharp(file).raw().toBuffer({ resolveWithObject: true });
  const lum = (x, y) => {
    const i = (y * info.width + x) * info.channels;
    return (data[i] + data[i + 1] + data[i + 2]) / 3;
  };
  const share = (get, n) => {
    let c = 0;
    for (let k = 0; k < n; k++) if (get(k) > BRIGHT) c++;
    return c / n;
  };

  const { width: w, height: h } = info;
  /** The same line, sampled well inside the frame's reach. */
  const inside = {
    left: share((y) => lum(INSIDE_AT, y), h),
    right: share((y) => lum(w - 1 - INSIDE_AT, y), h),
    top: share((x) => lum(x, INSIDE_AT), w),
    bottom: share((x) => lum(x, h - 1 - INSIDE_AT), w),
  };

  let framed = false;
  let worst = 0;
  let where = "";

  for (let d = 0; d < DEPTH; d++) {
    const edges = [
      ["left", share((y) => lum(d, y), h)],
      ["right", share((y) => lum(w - 1 - d, y), h)],
      ["top", share((x) => lum(x, d), w)],
      ["bottom", share((x) => lum(x, h - 1 - d), w)],
    ];
    for (const [name, v] of edges) {
      if (v > worst) {
        worst = v;
        where = `${name} edge, ${d}px in`;
      }
      // Bright at the edge, dark again inside it. Both, or it is a picture.
      if (v >= FRAME_SHARE && inside[name] <= INSIDE_SHARE) {
        framed = true;
        where = `${name} edge, ${d}px in`;
      }
    }
  }

  console.log(
    `${framed ? "FRAME" : "clean"}  ${file}  ` +
      `brightest edge ${Math.round(worst * 100)}% (${where})`,
  );
  return framed;
}

const files = process.argv.slice(2);
if (files.length === 0) {
  console.error("usage: node scripts/check-drawn-frame.mjs <path...>");
  process.exit(2);
}

const any = (await Promise.all(files.map(check))).some(Boolean);
process.exit(any ? 1 : 0);
