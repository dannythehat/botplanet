/**
 * Regenerates docs/job-09-media-mapping.json from the media registry.
 *
 * WHY THIS EXISTS. A test asserts the committed export matches
 * `buildMediaMapping()` exactly, so the SEO register can never be filled from
 * stale data. That test is right, but nothing regenerated the file — so every
 * registry change broke the suite and the only fix was to hand-edit generated
 * JSON, which is how generated files quietly stop being generated.
 *
 * Run: npm run gen:media-mapping
 */
import { writeFileSync } from "node:fs";
import { buildMediaMapping } from "../apps/web/src/lib/media-mapping";

const OUT = "docs/job-09-media-mapping.json";

writeFileSync(OUT, JSON.stringify(buildMediaMapping(), null, 2) + "\n");
console.log(`Wrote ${OUT}`);
