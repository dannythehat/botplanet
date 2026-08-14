/**
 * CLAIMS IN COPY THAT THE CATALOGUE CAN CONTRADICT.
 *
 * Both rules come from the per-page audit of 13 August 2026, and both have the
 * same cause: a sentence that was true when the catalogue held three products
 * and was never re-read as it reached sixty-four. Neither was visible to any
 * existing test, because every other guard here checks structured records and
 * these are claims made in prose.
 */
import { describe, expect, it } from "vitest";
import { readFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { REVIEWS } from "../src/content/reviews";
import { SNAPSHOTS } from "../src/content/snapshots";

const DIR = fileURLToPath(new URL("../src/reviews/", import.meta.url));
const FILES = readdirSync(DIR).filter((f) => f.endsWith(".md"));
const prose = (f: string) => readFileSync(DIR + f, "utf8");

/**
 * EVERYTHING a review puts in front of a reader.
 *
 * THREE SURFACES, NOT TWO, and missing the third is how the first version of
 * this test passed while a false claim stayed live. It read the markdown and
 * the snapshot only. The Scuba X1 Pro Max's "most expensive machine we cover"
 * ALSO sits in its record in content/reviews.ts — the verdict and standfirst
 * that render above the prose — so the guard went green, the page shipped, and
 * production still said it. Caught by verifying against the live page rather
 * than trusting the suite.
 */
function copyFor(slug: string): string {
  const file = FILES.find((f) => f === `${slug}.md`);
  const snap = (SNAPSHOTS as Record<string, unknown>)[slug];
  const record = (REVIEWS as Record<string, unknown>)[slug];
  return [
    file ? prose(file) : "",
    snap ? JSON.stringify(snap) : "",
    record ? JSON.stringify(record) : "",
  ].join(" ").toLowerCase();
}

describe("S2 — review prose never counts the catalogue", () => {
  /**
   * The Betta review said "two of the three pool robots we have reviewed so
   * far" and "unlike the last two machines we reviewed". Both were written
   * against a catalogue of three. It holds sixty-four.
   *
   * A COUNT SCOPED TO A BRAND IS FINE and is deliberately not caught here —
   * "three of the four machines of theirs we cover" is a fact about Aiper that
   * a reader can check. What rots is a claim about OUR publishing sequence,
   * because that changes every time anything is published.
   */
  const SEQUENCE_CLAIMS = [
    /\bwe have reviewed so far\b/,
    /\bthe (last|first|previous) (one|two|three|four|five|\d+) (machines?|robots?|products?) we\b/,
    /\bthe (first|only) (machine|robot|product) we have (reviewed|covered|held)\b/,
    /\bso far,? we have (reviewed|covered)\b/,
  ];

  it.each(Object.keys(REVIEWS))("%s makes no claim about our review sequence", (slug) => {
    const copy = copyFor(slug);
    const hits = SEQUENCE_CLAIMS.filter((re) => re.test(copy)).map(String);
    expect(hits, `${slug} states where it sits in our publishing order — that rots on the next publish`).toEqual([]);
  });
});

describe("S1/S3 — an exclusive superlative belongs to one product", () => {
  /**
   * THE PROOF CASE. The Betta SE Plus snapshot said "the cheapest machine we
   * cover" at $389.90 while the Seagull SE's own review said the same thing at
   * $159.99. Running this for the first time found a second: the Scuba X1 Pro
   * Max opened by calling itself "the most expensive machine we cover" at
   * $1,699.99, against the Beatbot at $2,199. Both sentences were true when
   * they were written and neither was re-read when the catalogue grew past
   * them.
   *
   * A test cannot price-check a superlative — prices live in D1 and are read
   * per request — but it can prove no two products claim the same EXCLUSIVE
   * one. Where two pages disagree, at least one is lying, and that is enough.
   *
   * EXCLUSIVE IS THE WHOLE DISTINCTION, and it is why the first version of
   * this test was wrong. It flagged three Aiper machines for "the finest
   * published rating in our catalogue" — but all three say SHARED in the same
   * sentence ("shared by these two", "shared across Aiper's Scuba range"), and
   * a shared attribute genuinely can be held by several. It also flagged five
   * window robots for "the only machine here", where each names a different
   * capability afterwards. Only claims that cannot logically be held twice
   * are checked, and the qualifying clause is kept so two different claims
   * are not collapsed into one.
   *
   * Scoped by category: "the cheapest machine here" on a window robot and on a
   * pool robot are two different true sentences.
   */
  const EXCLUSIVE = /\bthe (cheapest|most expensive|priciest|dearest) (machine|robot|one|product)[a-z ]{0,20}(we (cover|hold|list)|in (this|our) catalogue|here)\b/g;

  it("never lets two products in a category claim the same exclusive superlative", () => {
    const byCategory = new Map<string, Map<string, string[]>>();
    for (const [slug, r] of Object.entries(REVIEWS)) {
      for (const m of new Set(copyFor(slug).match(EXCLUSIVE) ?? [])) {
        const cat = byCategory.get(r.categorySlug) ?? new Map<string, string[]>();
        cat.set(m, [...(cat.get(m) ?? []), slug]);
        byCategory.set(r.categorySlug, cat);
      }
    }
    const clashes: string[] = [];
    for (const [cat, claims] of byCategory) {
      for (const [claim, slugs] of claims) {
        if (slugs.length > 1) {
          clashes.push(`${cat}: ${slugs.join(" + ")} both claim "${claim}" — one of them is false`);
        }
      }
    }
    expect(clashes).toEqual([]);
  });

  /**
   * The other half of the same rule. A superlative that several products CAN
   * share has to say so, or it reads as exclusive and contradicts its
   * siblings. Three Aiper machines quote the same 3-micron filter and each
   * one says "shared" in the sentence; that is what makes them honest rather
   * than three pages arguing.
   */
  const SHAREABLE = /\bthe (finest|best|longest|highest|lowest) [a-z ]{0,30}(we (cover|hold|list)|of anything we list|in (this|our) catalogue)\b/g;

  it("makes every product sharing one superlative say that it is shared", () => {
    /* GROUPED BY THE PHRASE ITSELF. The first version grouped by "matches the
       pattern", so "the finest filter rating" and "the best budget case" were
       treated as the same claim and three innocent pages failed. Two products
       only contradict each other when they say the SAME thing. */
    const byCategory = new Map<string, Map<string, string[]>>();
    for (const [slug, r] of Object.entries(REVIEWS)) {
      for (const m of new Set(copyFor(slug).match(SHAREABLE) ?? [])) {
        const cat = byCategory.get(r.categorySlug) ?? new Map<string, string[]>();
        cat.set(m, [...(cat.get(m) ?? []), slug]);
        byCategory.set(r.categorySlug, cat);
      }
    }

    const unqualified: string[] = [];
    for (const [cat, claims] of byCategory) {
      for (const [claim, slugs] of claims) {
        if (slugs.length < 2) continue;
        for (const slug of slugs) {
          const copy = copyFor(slug);
          const i = copy.indexOf(claim);
          const window = copy.slice(i, i + claim.length + 130);
          if (!/shared|shares|sharing|both|joint|alongside|as well as|equalled|matched|tie/.test(window)) {
            unqualified.push(`${cat}/${slug}: "${claim}" is also claimed by ${slugs.filter((s) => s !== slug).join(", ")}, and this page does not say it is shared`);
          }
        }
      }
    }
    expect(unqualified).toEqual([]);
  });
});

/**
 * ONE PAGE, ONE ANSWER PER FIGURE.
 *
 * The HOBOT 298 said "Power-off hold: Not published" three times and, in its
 * own spec table, "20 minutes on the embedded UPS, with an alerting sound".
 * Four statements about one number, in direct contradiction, on the flagship
 * safety figure of the category — how long a robot stays on the glass three
 * storeys up after the power fails.
 *
 * The 20 minutes was not HOBOT's. The identical wording appears on the Mamibot
 * W120-DP and the Cop Rose X5S, both of which cite a manual for it; it had been
 * borrowed from a sibling record and attributed to nothing.
 */
describe("a spec table never answers the same question twice", () => {
  it.each(Object.keys(REVIEWS))("%s states each specification once", (slug) => {
    const rows = REVIEWS[slug].specGroups.flatMap((g) => g.rows);
    const byLabel = new Map<string, string[]>();
    for (const r of rows) {
      const key = r.label.trim().toLowerCase();
      byLabel.set(key, [...(byLabel.get(key) ?? []), String(r.value ?? "")]);
    }
    const contradictions = [...byLabel.entries()]
      .filter(([, values]) => new Set(values.map((v) => v.trim().toLowerCase())).size > 1)
      .map(([label, values]) => `${label}: ${values.join(" / ")}`);
    expect(
      contradictions,
      `${slug} gives two different answers for the same specification`,
    ).toEqual([]);
  });

  /**
   * And the safety figure specifically — but testing the thing that is PROVEN
   * rather than the thing that is merely suspected.
   *
   * The first version demanded a source note on every printed power-off
   * duration and failed four more products: two WINBOTs at "30 minutes", the
   * Mini, and the HOBOT 2S at "20 minutes on the embedded UPS". Those may well
   * be their makers' own figures — the window hub says ECOVACS states around
   * thirty — but nobody has re-read those pages, and a test that forces a
   * source note gets a source note invented to satisfy it. That is a worse
   * outcome than the gap. They are recorded for a source read instead.
   *
   * What IS provable is the 298's failure: a duration whose exact wording
   * appears in another product's record. That is not a coincidence and it is
   * not a manufacturer figure — it is one page's number printed under another
   * machine's name, on the one specification where being wrong is dangerous.
   */
  it("never prints a power-off duration copied verbatim from another product", () => {
    const durations = new Map<string, string[]>();
    for (const [slug, review] of Object.entries(REVIEWS)) {
      for (const r of review.specGroups.flatMap((g) => g.rows)) {
        if (!/power-off|power off|power cut/i.test(r.label)) continue;
        const value = String(r.value ?? "").trim().toLowerCase();
        if (!/\d+\s*(min|hour)/i.test(value)) continue;
        /* A bare "30 minutes" is a figure two makers can legitimately both
           state. A whole descriptive phrase repeated word for word is a copy. */
        if (value.split(/\s+/).length < 4) continue;
        durations.set(value, [...(durations.get(value) ?? []), slug]);
      }
    }
    const copied = [...durations.entries()]
      .filter(([, slugs]) => slugs.length > 1)
      .map(([value, slugs]) => `"${value}" appears on ${slugs.join(" and ")}`);
    expect(copied, "a power-off duration is shared verbatim between products").toEqual([]);
  });
});
