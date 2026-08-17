/**
 * Placing figures inside review prose.
 *
 * THE PROBLEM. The prose is Markdown, not MDX, so a component cannot be called
 * from inside it — and hand-writing a responsive <picture> in Markdown is the
 * kind of thing that rots the first time an image is resized. But a review with
 * every picture bolted on at the end is not an article, it is a page with a
 * gallery.
 *
 * THE APPROACH. Astro exposes a Markdown file's compiled HTML as a string
 * (`compiledContent()`). A review declares which heading each figure belongs
 * under, and this inserts a real, srcset-backed figure directly after that
 * heading. The prose stays clean Markdown that a non-technical editor can read.
 *
 * WHERE THE ALT TEXT COMES FROM. The media registry, always — never the review
 * file. The registry is the single place that decides what a picture claims to
 * show, and a caption written next to the layout would drift from it.
 *
 * A figure whose heading does not exist is a silent no-op in production and a
 * thrown error in dev, because a picture that quietly fails to appear is worse
 * than one that fails loudly while you are working.
 */
import { MEDIA_ASSETS } from "../content/media/assets";
import { srcsetFor } from "./srcset";

export interface ReviewFigureRef {
  /** Exact H2 text this figure sits under, as written in the Markdown. */
  afterHeading: string;
  /** Registry `src` of the asset. Alt text is taken from the registry record. */
  src: string;
  /** Optional line printed under the picture. */
  caption?: string;
}

const escapeHtml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/**
 * Heading text reduced to something two sources can agree on.
 *
 * SMART PUNCTUATION IS WHY THIS IS MORE THAN A trim().toLowerCase().
 * Markdown runs typographic substitution, so a heading written as
 *   ## Navigation, and what "ultrasonic radar" is doing here
 * arrives as `what “ultrasonic radar” is doing`, with curly quotes. Comparing
 * that against the straight quotes in content/reviews.ts fails, the figure is
 * silently skipped, and the page renders perfectly with a picture missing —
 * which is exactly what happened to the Betta review in production.
 *
 * Quotes, apostrophes, dashes and runs of whitespace are all flattened, so a
 * heading and its reference only have to agree on the words.
 */
const plain = (s: string) =>
  s
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&#39;|&apos;|&rsquo;|&lsquo;/g, "'")
    .replace(/&quot;|&ldquo;|&rdquo;/g, '"')
    .replace(/[‘’‚‛]/g, "'")
    .replace(/[“”„‟]/g, '"')
    .replace(/[‐-―]/g, "-")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();

function figureHtml(ref: ReviewFigureRef): string | null {
  const asset = MEDIA_ASSETS.find((a) => a.src === ref.src);
  if (!asset) return null;

  const srcset = srcsetFor(ref.src);
  const alt = escapeHtml(asset.altText ?? "");
  const dims =
    asset.width && asset.height ? ` width="${asset.width}" height="${asset.height}"` : "";
  const set = srcset ? ` srcset="${srcset}" sizes="(min-width: 900px) 700px, 100vw"` : "";
  const caption = ref.caption
    ? `<figcaption class="bp-figure__cap">${escapeHtml(ref.caption)}</figcaption>`
    : "";

  return (
    `<figure class="bp-figure">` +
    `<img src="${ref.src}"${set}${dims} alt="${alt}" loading="lazy" decoding="async" />` +
    caption +
    `</figure>`
  );
}

/**
 * Insert each figure immediately after the heading it names.
 *
 * `dev` makes an unmatched heading throw instead of being skipped.
 */
export function injectFigures(
  html: string,
  figures: ReviewFigureRef[] = [],
  dev = false,
): string {
  let out = html;

  for (const ref of figures) {
    const fig = figureHtml(ref);
    if (!fig) {
      if (dev) throw new Error(`Review figure is not in the media registry: ${ref.src}`);
      continue;
    }

    // Match any h2, then check its text — cheaper and more forgiving than
    // trying to guess the slugified id Astro generated for the heading.
    const headings = [...out.matchAll(/<h2\b[^>]*>([\s\S]*?)<\/h2>/g)];
    const hit = headings.find((m) => plain(m[1]) === plain(ref.afterHeading));

    if (!hit) {
      if (dev) {
        throw new Error(
          `Review figure names a heading that is not in the prose: "${ref.afterHeading}". ` +
            `Headings present: ${headings.map((m) => `"${plain(m[1])}"`).join(", ")}`,
        );
      }
      continue;
    }

    const at = hit.index! + hit[0].length;
    out = out.slice(0, at) + fig + out.slice(at);
  }

  return out;
}
