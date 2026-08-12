/**
 * Turn a supplied master into the WebP the site serves.
 *
 * WHAT THIS EXISTS FOR. Artwork arrives as large PNGs — 1.5 to 3 MB each,
 * straight out of an image tool. Nothing on the site should serve those. This
 * converts one master to WebP at its authored size, writes it into
 * apps/web/public/media/, and prints the three fields an asset record needs:
 * checksum, width and height. Responsive widths are a separate step —
 * gen-derivatives.mjs reads the WebP this produces.
 *
 * It deliberately does NOT resize or crop. A composition with headline text
 * set into it has one correct framing, and cropping it to a card ratio cuts
 * the model name off. The surface adapts to the file; see `presentation:
 * "bleed"` in the media registry.
 *
 *   node scripts/ingest-artwork.mjs <source.png> <public-relative-dest.webp>
 *   node scripts/ingest-artwork.mjs --batch <manifest.json>
 *
 * The batch manifest is [{ from, to }], paths as above. Batch mode is the
 * normal way to run it: a product is four files and a category hub is eight,
 * and doing those one command at a time invites a typo in a path nobody
 * notices until the page renders a broken image.
 */
import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import sharp from "sharp";

const PUBLIC = "apps/web/public";

/**
 * 88 is where these compositions stop losing anything visible.
 *
 * They are not photographs: flat panels, hard type edges and thin cyan rules
 * are exactly what low WebP quality smears first, and the headline text is
 * the part a reader is meant to read. Measured against the pool creatives
 * already on the site, which shipped at this setting.
 */
const QUALITY = 88;

const sha256 = (buf) => "sha256:" + createHash("sha256").update(buf).digest("hex");

async function ingest(from, to) {
  const dest = join(PUBLIC, to);
  const src = sharp(from);
  const meta = await src.metadata();

  const buf = await src.webp({ quality: QUALITY }).toBuffer();
  mkdirSync(dirname(dest), { recursive: true });
  writeFileSync(dest, buf);

  const before = readFileSync(from).length;
  return {
    to,
    checksum: sha256(buf),
    width: meta.width,
    height: meta.height,
    bytes: buf.length,
    saved: before - buf.length,
  };
}

const args = process.argv.slice(2);
if (args.length < 2) {
  console.error("Usage: node scripts/ingest-artwork.mjs <source> <dest.webp>");
  console.error("       node scripts/ingest-artwork.mjs --batch <manifest.json>");
  process.exit(1);
}

const jobs =
  args[0] === "--batch"
    ? JSON.parse(readFileSync(args[1], "utf8"))
    : [{ from: args[0], to: args[1] }];

const out = [];
let saved = 0;
for (const j of jobs) {
  const r = await ingest(j.from, j.to);
  out.push(r);
  saved += r.saved;
  console.log(
    `${r.to}\n  ${r.width}x${r.height} · ${Math.round(r.bytes / 1024)}KB` +
      ` (was ${Math.round((r.bytes + r.saved) / 1024)}KB)\n  ${r.checksum}`,
  );
}
console.log(`\n${out.length} file(s). ${Math.round(saved / 1024 / 1024)}MB saved.`);
writeFileSync("scripts/last-ingest.json", JSON.stringify(out, null, 2) + "\n");
