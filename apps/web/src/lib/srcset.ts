/**
 * Responsive sources for images rendered outside the product registry.
 *
 * `ProductImage` already builds a srcset from the media registry, but the hero,
 * the section artwork and the BotMatch panel are plain `<img>` tags — they are
 * brand artwork, not product media, so they never went through that path. The
 * result was a phone downloading a 941px hero to paint it 430px wide.
 *
 * This reads the same generated manifest the registry uses, so there is one
 * source of truth for what sizes actually exist on disk. A path with no
 * derivatives returns undefined and the `<img>` falls back to its single file,
 * which is exactly right for anything too small to be worth splitting.
 */
import MANIFEST from "../../../../scripts/derivative-manifest.json";

interface Entry {
  source: string;
  sourceWidth: number;
  sourceHeight: number;
  derivatives: { src: string; width: number; height: number }[];
}

const BY_SOURCE = new Map((MANIFEST as Entry[]).map((e) => [e.source, e]));

/**
 * The `srcset` for a source path, including the original at its full width so
 * a large display still gets the authored file.
 */
export function srcsetFor(src: string): string | undefined {
  const entry = BY_SOURCE.get(src);
  if (!entry || entry.derivatives.length === 0) return undefined;
  const parts = entry.derivatives.map((d) => `${d.src} ${d.width}w`);
  parts.push(`${src} ${entry.sourceWidth}w`);
  return parts.join(", ");
}

/** Intrinsic size, so width/height can be emitted and nothing shifts on load. */
export function sizeOf(src: string): { width: number; height: number } | undefined {
  const entry = BY_SOURCE.get(src);
  return entry ? { width: entry.sourceWidth, height: entry.sourceHeight } : undefined;
}
