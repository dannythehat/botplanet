import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { REVIEWS } from "../src/content/reviews";
import { buildGlance, MIN_GLANCE_ROWS } from "../src/lib/spec-glance";
import { glanceFieldsFor, GLANCE_FIELDS } from "../src/content/spec-glance";
import {
  poolCordedCordlessTable,
  windowGlassTable,
  winbotLadder,
  companionCapabilities,
} from "../src/content/decision-tables";
import { alsoCompared } from "../src/lib/also-compared";
import { NO_OFFER_BY_DESIGN, PRODUCT_ID } from "../src/content/products";
import { ROUTES } from "../src/content/routes";

/**
 * THE EDUCATIONAL STRUCTURE PASS, AND THE ONE RULE IT ALL RESTS ON.
 *
 * Every box, table and link block added here is a PROJECTION of facts already
 * recorded in content/reviews.ts. Not one of them may introduce a value, and
 * that is not a style preference — it is the difference between a site that
 * can be checked and a site that has to be trusted.
 *
 * So the load-bearing test in this file is "every printed value appears
 * verbatim in the source review". If that passes, no amount of restructuring
 * can have invented a specification.
 */

const all = Object.values(REVIEWS);
const valuesOf = (slug: string) =>
  new Set(
    REVIEWS[slug].specGroups
      .flatMap((g) => g.rows)
      .filter((r) => r.value)
      .map((r) => r.value as string),
  );

describe("the glance box invents nothing", () => {
  it("prints only values that appear verbatim in that review's own spec table", () => {
    const invented: string[] = [];
    for (const r of all) {
      const source = valuesOf(r.slug);
      for (const row of buildGlance(r.categorySlug, r.specGroups).rows) {
        if (!source.has(row.value)) invented.push(`${r.slug}: "${row.label}" = "${row.value}"`);
      }
    }
    expect(invented, "a glance value that is not in the review it came from").toEqual([]);
  });

  /**
   * A NOTE CARRIES A REGIONAL SKU CONFLICT — the same field reading differently
   * on the US and global variants. Keeping the number and dropping the caveat
   * is the one transformation that turns a correct table into an incorrect box.
   */
  it("carries a row's note whenever the source row had one", () => {
    for (const r of all) {
      const rows = r.specGroups.flatMap((g) => g.rows);
      for (const g of buildGlance(r.categorySlug, r.specGroups).rows) {
        const src = rows.find((x) => x.value === g.value && x.note);
        if (src) expect(g.note, `${r.slug}: ${g.label} dropped its note`).toBe(src.note);
      }
    }
  });

  it("shows no box rather than a box of one or two cells", () => {
    for (const r of all) {
      const g = buildGlance(r.categorySlug, r.specGroups);
      if (g.worthShowing) expect(g.rows.length).toBeGreaterThanOrEqual(MIN_GLANCE_ROWS);
    }
  });

  /* Three reviews legitimately resolve nothing: Cozmo, Moxie and EMO record a
     company's collapse and a counterfeit listing rather than a product's
     dimensions. Pinned so that "no box" stays a decision rather than a bug. */
  it("renders on the reviews that have a specification and not on the rule-outs", () => {
    const showing = all.filter((r) => buildGlance(r.categorySlug, r.specGroups).worthShowing);
    expect(showing.length).toBeGreaterThanOrEqual(33);
    for (const slug of ["cozmo", "living-ai-emo"]) {
      expect(
        buildGlance(REVIEWS[slug].categorySlug, REVIEWS[slug].specGroups).worthShowing,
        `${slug} is a rule-out review with no product specification to glance at`,
      ).toBe(false);
    }
  });

  it("defines glance fields for every category that has reviews", () => {
    const cats = new Set(all.map((r) => r.categorySlug));
    for (const c of cats) expect(glanceFieldsFor(c).length, `${c} has no glance fields`).toBeGreaterThan(0);
  });

  it("never lists the same source label twice within one category", () => {
    for (const [cat, fields] of Object.entries(GLANCE_FIELDS)) {
      const seen = new Set<string>();
      for (const f of fields)
        for (const m of f.match) {
          const k = m.toLowerCase();
          expect(seen.has(k), `${cat}: "${m}" feeds two different glance slots`).toBe(false);
          seen.add(k);
        }
    }
  });
});

describe("decision tables report a test rather than an opinion", () => {
  const tables = [poolCordedCordlessTable(), windowGlassTable()];

  it("prints the rule it applied on every row", () => {
    for (const t of tables)
      for (const row of t.rows) {
        expect(row.rule.length, `${t.id}/${row.situation} has no stated rule`).toBeGreaterThan(10);
      }
  });

  it("carries the recorded value that satisfied the test on every pick", () => {
    for (const t of tables)
      for (const row of t.rows)
        for (const p of row.picks) {
          /* An absence row records a SILENCE — "No glass type published" is our
             note, not ECOVACS'. It is flagged and rendered differently, and it
             is the only evidence permitted not to be a quoted figure. */
          if (p.absence) continue;
          expect(valuesOf(p.slug).has(p.evidence), `${p.slug}: evidence not in its review`).toBe(true);
        }
  });

  it("links only to reviews that exist", () => {
    for (const t of tables)
      for (const row of t.rows)
        for (const p of row.picks) expect(REVIEWS[p.slug], `${p.href} has no review`).toBeTruthy();
  });

  /* A machine with no published figure for the test must be ABSENT from the
     row, never assumed to pass — the same rule lib/alternatives.ts follows. */
  it("never passes a product on an unrecorded field", () => {
    const t = poolCordedCordlessTable();
    const row = t.rows.find((r) => r.situation.includes("50 ft"))!;
    for (const p of row.picks) expect(p.evidence).toMatch(/\d/);
  });

  /* The flag exists so an absence can never be mistaken for a quoted spec —
     if it stopped being set, the verbatim check above would silently pass a
     synthesized string. */
  it("flags an absence row as an absence", () => {
    const row = windowGlassTable().rows.find((r) => r.rule.includes("No glass type"))!;
    expect(row.picks.length).toBeGreaterThan(0);
    for (const p of row.picks) expect(p.absence, `${p.slug} not flagged`).toBe(true);
    for (const t of [poolCordedCordlessTable()])
      for (const r of t.rows) for (const p of r.picks) expect(p.absence).toBeUndefined();
  });

  it("finds at least one qualifying machine for most situations", () => {
    for (const t of tables) {
      const empty = t.rows.filter((r) => r.picks.length === 0);
      expect(empty.length, `${t.id}: too many empty rows to be useful`).toBeLessThan(t.rows.length);
    }
  });
});

describe("the hub tables", () => {
  it("puts every WINBOT in the catalogue on the ladder", () => {
    const inCatalogue = all.filter(
      (r) => r.categorySlug === "window-cleaning-robots" && /winbot/i.test(r.slug),
    );
    const ladder = winbotLadder();
    expect(ladder.length).toBe(inCatalogue.length);
    /* Six, not the five the brief assumed. A ladder missing a rung sends the
       reader looking at that machine away. */
    expect(ladder.length).toBe(6);
  });

  it("prints only ECOVACS' own figures, or says they are not published", () => {
    for (const e of winbotLadder()) {
      const source = valuesOf(e.slug);
      for (const s of e.separators) {
        if (s.value === "Not published") continue;
        expect(source.has(s.value), `${e.slug}: ${s.label} is not in its review`).toBe(true);
      }
    }
  });

  it("covers every companion review in the capability table", () => {
    const comps = all.filter((r) => r.categorySlug === "companion-robots");
    expect(companionCapabilities().length).toBe(comps.length);
  });

  /**
   * THE ONE THAT CAUGHT A REAL INVERSION. An early draft filled "Works
   * offline" from Eilik's "Account required: No", printing "No" under a
   * heading that means the opposite of what the maker said. A cell may only
   * ever hold its own source's words.
   */
  it("never prints a capability value that is not in the source review", () => {
    for (const row of companionCapabilities()) {
      const source = valuesOf(row.slug);
      for (const c of row.cells) {
        if (!c.published) {
          expect(c.value).toBe("Not published");
          continue;
        }
        expect(source.has(c.value), `${row.slug}: "${c.label}" = "${c.value}" is not recorded`).toBe(true);
      }
    }
  });

  it("infers nothing from silence", () => {
    for (const row of companionCapabilities())
      for (const c of row.cells)
        if (!c.published) expect(c.value).not.toMatch(/^(no|none|yes)$/i);
  });
});

describe("readers also compared", () => {
  it("gives every review at least two contextual links", () => {
    for (const r of all) expect(alsoCompared(r).length, `${r.slug}`).toBeGreaterThanOrEqual(2);
  });

  it("never links a review to itself", () => {
    for (const r of all)
      for (const l of alsoCompared(r)) expect(l.href).not.toContain(`/${r.slug}/`);
  });

  it("links only to live routes or real reviews", () => {
    const live = new Set(ROUTES.filter((x) => x.status === "live").map((x) => x.path));
    for (const r of all)
      for (const l of alsoCompared(r)) {
        const isReview = l.href.startsWith("/robots/") && l.href.split("/").length === 5;
        expect(isReview || live.has(l.href), `${r.slug} -> ${l.href} is not live`).toBe(true);
      }
  });

  /**
   * BEFORE THIS EXISTED, FIVE EDUCATIONAL REVIEWS ALL POINTED AT COZMO —
   * whose seller is under suit over about 14,000 undelivered orders and whose
   * sale we refuse in writing. It sat first in the registry, so `.find()`
   * chose it every time. The site was steering readers at the one machine it
   * tells them not to buy.
   */
  it("never offers a product we refuse to sell as the nearest sibling", () => {
    const refused = new Set(
      Object.keys(PRODUCT_ID).filter((slug) => NO_OFFER_BY_DESIGN[PRODUCT_ID[slug]]),
    );
    expect(refused.size).toBeGreaterThan(0);
    for (const r of all)
      for (const l of alsoCompared(r))
        if (l.href.startsWith("/robots/"))
          for (const bad of refused)
            expect(l.href.endsWith(`/${bad}/`), `${r.slug} -> refused ${bad}`).toBe(false);
  });

  /* A lateral link that always lands on the same page is a link readers stop
     seeing. Seven of eleven window reviews once shared one target. */
  it("spreads across the catalogue rather than funnelling onto one page", () => {
    const counts = new Map<string, number>();
    for (const r of all) {
      const sib = alsoCompared(r).find((l) => l.href.startsWith("/robots/"));
      if (sib) counts.set(sib.href, (counts.get(sib.href) ?? 0) + 1);
    }
    expect(Math.max(...counts.values()), "one review absorbs too many lateral links").toBeLessThanOrEqual(5);
    expect(counts.size, "too few distinct destinations").toBeGreaterThanOrEqual(15);
  });

  it("says why each link is there, in the reader's terms", () => {
    for (const r of all)
      for (const l of alsoCompared(r)) {
        expect(l.because.length).toBeGreaterThan(20);
        expect(l.because.toLowerCase()).not.toMatch(/^related|^see also/);
      }
  });
});

describe("no commercial field reaches the structure modules", () => {
  /**
   * The same guard the matcher runs under. These modules decide what a reader
   * is shown next; the moment "what earns most" can reach them, every answer
   * they give is suspect.
   *
   * NO_OFFER_BY_DESIGN is deliberately permitted in also-compared: it is an
   * editorial refusal, not a price, and reading it is what stops the block
   * recommending a machine we tell people not to buy.
   */
  const files = [
    "apps/web/src/lib/spec-glance.ts",
    "apps/web/src/lib/decision-tables.ts",
    "apps/web/src/lib/also-compared.ts",
    "apps/web/src/content/decision-tables.ts",
    "apps/web/src/content/spec-glance.ts",
  ];

  it("references no price, offer or commission field", () => {
    for (const f of files) {
      const code = readFileSync(f, "utf8")
        .split("\n")
        .filter((l) => {
          const t = l.trim();
          return !t.startsWith("*") && !t.startsWith("/*") && !t.startsWith("//");
        })
        .join("\n");
      for (const banned of ["priceMinor", "commission", "basePrice", "OFFERS", "buildOffers"]) {
        expect(code, `${f} references "${banned}"`).not.toContain(banned);
      }
    }
  });
});

describe("the structure copy is held to the brand voice", () => {
  /**
   * VOICE.TEST.TS READS REVIEW MARKDOWN AND NOTHING ELSE. Everything this pass
   * added — table intros, the notes under them, the glance box footer — is
   * user-facing prose that ships on forty reviews and four hubs and guides,
   * and none of it was covered. Copy that escapes the voice check is copy that
   * drifts, and it drifts hardest in components because nobody re-reads them.
   *
   * Sentence-length variance is deliberately NOT applied here: a table intro
   * is two or three sentences by design, and variance over three sentences
   * measures nothing.
   */
  const copy = [
    poolCordedCordlessTable(),
    windowGlassTable(),
  ].flatMap((t) => [t.title, t.intro, t.note, ...t.rows.map((r) => r.situation), ...t.rows.map((r) => r.rule)]);

  const componentProse = [
    "apps/web/src/components/SpecGlance.astro",
    "apps/web/src/components/DecisionTable.astro",
    "apps/web/src/components/WinbotLadder.astro",
    "apps/web/src/components/CapabilityTable.astro",
    "apps/web/src/components/AlsoCompared.astro",
  ].map((f) => {
    const src = readFileSync(f, "utf8");
    /* Template only — the docblocks above the fence are notes to the next
       developer, not copy a reader ever sees. */
    return src.slice(src.indexOf("---", src.indexOf("---") + 3));
  });

  it("uses no banned construction in any table or box copy", async () => {
    const { BANNED_PHRASES } = await import("../src/content/voice");
    const hits: string[] = [];
    for (const text of [...copy, ...componentProse]) {
      for (const b of BANNED_PHRASES) {
        if (b.pattern.test(text)) hits.push(`${b.label} → ${b.instead}`);
      }
    }
    expect(hits).toEqual([]);
  });

  it("keeps every sentence under the house ceiling", async () => {
    const { MAX_SENTENCE_WORDS } = await import("../src/content/voice");
    const long: string[] = [];
    for (const text of copy) {
      for (const s of text.split(/(?<=[.!?])\s+/)) {
        const n = s.trim().split(/\s+/).length;
        if (n > MAX_SENTENCE_WORDS) long.push(`${n} words: "${s.slice(0, 90)}…"`);
      }
    }
    expect(long).toEqual([]);
  });

  /* Rule 3, name the gap. Every one of these tables has rows or cells the
     manufacturers do not fill, and the copy has to say so rather than let a
     reader assume the blanks mean "no". */
  it("names the gap in every table's own words", () => {
    for (const t of [poolCordedCordlessTable(), windowGlassTable()]) {
      const said = `${t.intro} ${t.note}`.toLowerCase();
      expect(
        /not publish|does not|no published|rather than|nothing in our catalogue|absent/.test(said),
        `${t.id} never says what it does not know`,
      ).toBe(true);
    }
  });
});

describe("every guide keeps its table of contents", () => {
  /* ArticleContents renders at four or more H2s. Every article clears it
     today; this fails the moment one is cut below the threshold. */
  it("gives every article at least four H2s", () => {
    const thin: string[] = [];
    for (const r of all) {
      const md = readFileSync(`apps/web/src/reviews/${r.slug}.md`, "utf8");
      if ((md.match(/^## /gm) ?? []).length < 4) thin.push(r.slug);
    }
    expect(thin, "reviews below the contents threshold").toEqual([]);
  });
});

describe("figure slots are ready for the incoming teaching images", () => {
  /**
   * A figure is placed by naming the exact H2 it sits under. This confirms
   * every review has spare headings to hang one on, so placement on upload is
   * a three-line record in content/reviews.ts and nothing else.
   */
  it("leaves every review at least two unused headings", () => {
    const full: string[] = [];
    for (const r of all) {
      const md = readFileSync(`apps/web/src/reviews/${r.slug}.md`, "utf8");
      const heads = (md.match(/^## .*$/gm) ?? []).map((h) => h.replace(/^##\s*/, "").trim());
      const used = new Set((r.figures ?? []).map((f) => f.afterHeading));
      if (heads.filter((h) => !used.has(h)).length < 2) full.push(r.slug);
    }
    expect(full, "reviews with no room for another figure").toEqual([]);
  });

  it("places every declared figure against a heading that exists", () => {
    const orphans: string[] = [];
    for (const r of all) {
      if (!r.figures?.length) continue;
      const md = readFileSync(`apps/web/src/reviews/${r.slug}.md`, "utf8");
      for (const f of r.figures) {
        /* Compared on words alone — Markdown applies smart punctuation, so a
           heading with quotes never matches character-for-character. */
        const flat = (s: string) => s.replace(/[^a-z0-9]+/gi, " ").trim().toLowerCase();
        if (!md.split("\n").some((l) => l.startsWith("## ") && flat(l.slice(3)) === flat(f.afterHeading)))
          orphans.push(`${r.slug}: "${f.afterHeading}"`);
      }
    }
    expect(orphans, "figures pointing at a heading that is not in the prose").toEqual([]);
  });
});
