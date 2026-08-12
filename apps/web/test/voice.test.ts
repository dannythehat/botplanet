import { describe, expect, it } from "vitest";
import { readFileSync, readdirSync } from "node:fs";
import {
  BANNED_PHRASES,
  MAX_SENTENCE_WORDS,
  MIN_SENTENCE_LENGTH_VARIANCE,
  VOICE_RULES,
} from "../src/content/voice";
import { REVIEWS } from "../src/content/reviews";
import { SNAPSHOTS } from "../src/content/snapshots";

/**
 * A voice guide nothing enforces is a document that gets read once.
 *
 * This reads the actual published prose. If a banned construction gets into a
 * review — by a writer, an agency or a model — the build goes red with the
 * offending sentence quoted, rather than the phrase quietly shipping and
 * making the site sound like everything else.
 */

const REVIEW_DIR = "apps/web/src/reviews";
const files = readdirSync(REVIEW_DIR).filter((f) => f.endsWith(".md"));

/** Prose only: strip front matter, code, links-as-markup and headings. */
function prose(md: string): string {
  return md
    .replace(/^---[\s\S]*?---/, "")
    .replace(/```[\s\S]*?```/g, "")
    .replace(/`[^`]*`/g, "")
    .replace(/^#{1,6} .*$/gm, "")
    // A horizontal rule is not punctuation, and without this the splitter runs
    // two paragraphs together and reports an 80-word sentence nobody wrote.
    .replace(/^\s*---+\s*$/gm, ".")
    // Each bullet is its own thought. Without this the splitter welds a whole
    // list into one "81-word sentence" that nobody wrote.
    .replace(/^\s*[-*+]\s+/gm, ". ")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/[*_>]/g, "");
}

function sentences(text: string): string[] {
  return text
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.split(/\s+/).length > 2);
}

describe("brand voice — the rules exist and are usable", () => {
  it("states a reason and a real published example for every rule", () => {
    expect(VOICE_RULES.length).toBeGreaterThanOrEqual(5);
    for (const r of VOICE_RULES) {
      expect(r.why.length, r.id).toBeGreaterThan(60);
      expect(r.example.length, r.id).toBeGreaterThan(40);
    }
  });

  it("keeps every rule's example traceable to copy the site actually ships", () => {
    /* An example invented for the guide is an example nobody has had to make
       work. Each one must appear in a review, a snapshot or a verdict. */
    const published = [
      ...files.map((f) => readFileSync(`${REVIEW_DIR}/${f}`, "utf8")),
      JSON.stringify(REVIEWS),
      JSON.stringify(SNAPSHOTS),
    ]
      .join(" ")
      .replace(/[*_]/g, "")
      .replace(/\s+/g, " ")
      .toLowerCase();

    for (const r of VOICE_RULES) {
      // Compare on a distinctive slice — the full quote may be line-wrapped
      // differently in the Markdown source.
      const probe = r.example.replace(/[*_]/g, "").replace(/\s+/g, " ").toLowerCase().slice(0, 55);
      expect(published.includes(probe), `${r.id}: example is not published copy`).toBe(true);
    }
  });
});

describe("published prose does not sound generated", () => {
  /**
   * A QUOTATION IS SOMEBODY ELSE'S WORDS, and these rules are about ours.
   *
   * The Yarbo review quotes a Reddit thread titled "Extremely Disappointed
   * with the Yarbo Snow Blower" — it is the third result on that machine's own
   * money term and the strongest evidence on the page. The empty-intensifier
   * rule fired on it, which would have meant either dropping the evidence or
   * misquoting it, and both are worse than the thing the rule prevents.
   *
   * So double-quoted spans are blanked before the banned-construction check
   * and only that check. The sentence-length and rhythm rules still see the
   * quotes, because a long quotation still makes a long sentence to read.
   *
   * This does not open a loophole worth worrying about: writing marketing
   * filler and wrapping it in quotation marks to dodge the linter would be
   * visible in review, and quoting a maker's own puffery in order to take it
   * apart is exactly what this site does on purpose.
   */
  const withoutQuotations = (text: string) => text.replace(/"[^"]*"/g, '""');

  it.each(files)("%s uses no banned construction", (file) => {
    const text = withoutQuotations(prose(readFileSync(`${REVIEW_DIR}/${file}`, "utf8")));
    const hits: string[] = [];

    for (const b of BANNED_PHRASES) {
      for (const s of sentences(text)) {
        if (b.pattern.test(s)) hits.push(`${b.label} — "${s.slice(0, 110)}…" → ${b.instead}`);
      }
    }

    expect(hits).toEqual([]);
  });

  it.each(files)("%s varies its sentence length like a person", (file) => {
    const lens = sentences(prose(readFileSync(`${REVIEW_DIR}/${file}`, "utf8"))).map(
      (s) => s.split(/\s+/).length,
    );
    const mean = lens.reduce((a, b) => a + b, 0) / lens.length;
    const sd = Math.sqrt(lens.reduce((a, n) => a + (n - mean) ** 2, 0) / lens.length);

    // Flat rhythm is the most reliable tell of generated text, and it survives
    // every amount of vocabulary polish.
    expect(sd, `mean ${mean.toFixed(1)} words, sd ${sd.toFixed(1)}`).toBeGreaterThan(
      MIN_SENTENCE_LENGTH_VARIANCE,
    );
  });

  it.each(files)("%s has no sentence that is really two", (file) => {
    const long = sentences(prose(readFileSync(`${REVIEW_DIR}/${file}`, "utf8")))
      .filter((s) => s.split(/\s+/).length > MAX_SENTENCE_WORDS)
      .map((s) => `${s.split(/\s+/).length} words: "${s.slice(0, 90)}…"`);
    expect(long).toEqual([]);
  });
});

describe("the voice actually shows up in the writing", () => {
  /**
   * The position is "the site that tells you when not to buy". These check the
   * two moves that make that true, because a voice guide that only bans things
   * produces prose that is inoffensive and says nothing.
   */
  it("gives every review a stated reason to walk away", () => {
    for (const s of Object.values(SNAPSHOTS)) {
      expect(s.ruleOutIf.length, `${s.slug}: no rule-out`).toBeGreaterThan(40);
    }
  });

  it("gives every review a section on what we could not find out", () => {
    for (const f of files) {
      const md = readFileSync(`${REVIEW_DIR}/${f}`, "utf8").toLowerCase();
      expect(
        /cannot tell you|could not (find|establish)|not disclosed|do not know/.test(md),
        `${f}: never admits a gap`,
      ).toBe(true);
    }
  });
});
