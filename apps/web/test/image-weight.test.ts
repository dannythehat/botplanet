import { describe, expect, it } from "vitest";
import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join } from "node:path";

/**
 * No source file may reference a raw PNG or JPEG over 200KB.
 *
 * WHY THIS EXISTS. On 1 October 2026 audit:weight found the robot dog guide
 * serving seven 2MB PNGs straight from /images/guides/ with generator
 * filenames: the hero downloaded 1.8MB before first paint, and the comparison
 * table used 2MB files as 64px CSS thumbnails. They had bypassed the media
 * pipeline entirely, so no WebP, no responsive sizes and no asset record. The
 * live audit caught it, but only after it shipped and only if somebody ran it.
 * This catches it in the commit.
 *
 * It reads references rather than the directory, deliberately. Unreferenced
 * files cost a few bytes of deploy and nothing to a reader, and a test that
 * failed on every stray upload would be deleted within a week.
 */
const SRC = "apps/web/src";
const PUBLIC = "apps/web/public";
const LIMIT = 200 * 1024;

const walk = (dir: string, out: string[] = []): string[] => {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (/\.(astro|ts|css|md)$/.test(name)) out.push(p);
  }
  return out;
};

describe("raw images referenced by source", () => {
  it("never ships a PNG or JPEG over 200KB straight to a reader", () => {
    const offenders: string[] = [];
    const re = /["'`(](\/[A-Za-z0-9_\-./%+ &]+\.(?:png|jpe?g))/gi;
    for (const file of walk(SRC)) {
      const text = readFileSync(file, "utf8");
      for (const m of text.matchAll(re)) {
        const disk = join(PUBLIC, decodeURI(m[1]));
        if (!existsSync(disk)) continue;
        const size = statSync(disk).size;
        if (size > LIMIT) offenders.push(`${file}: ${m[1]} is ${Math.round(size / 1024)}KB`);
      }
    }
    expect(
      offenders,
      "convert with scripts/ingest-artwork.mjs, add to gen-derivatives.mjs, and reference the .webp",
    ).toEqual([]);
  });
});
