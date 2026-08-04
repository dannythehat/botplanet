import { describe, expect, it } from "vitest";
import { injectFigures } from "../src/lib/review-figures";
import { REVIEWS } from "../src/content/reviews";
import { MEDIA_ASSETS, REVIEW_FIGURES_WITHHELD } from "../src/content/media/assets";
import { readFileSync } from "node:fs";

/* Compiled Markdown, near enough: Astro emits h2 elements with slug ids and
   paragraphs between them, which is all the injector cares about. */
const HTML =
  `<h2 id="who-this-is-for">Who this is for</h2><p>One.</p>` +
  `<h2 id="the-app">The app</h2><p>Two.</p>` +
  `<h2 id="filtration-and-the-maintenance-reality">Filtration and the maintenance reality</h2><p>Three.</p>`;

const A_REAL_FIGURE = "/media/reviews/dolphin-nautilus-cc-plus/app-control.webp";

describe("review figures", () => {
  it("puts a figure directly after the heading it names", () => {
    const out = injectFigures(HTML, [{ afterHeading: "The app", src: A_REAL_FIGURE }]);
    expect(out).toContain(`<h2 id="the-app">The app</h2><figure class="bp-figure">`);
  });

  it("takes alt text from the registry, never from the review file", () => {
    const asset = MEDIA_ASSETS.find((a) => a.src === A_REAL_FIGURE)!;
    const out = injectFigures(HTML, [{ afterHeading: "The app", src: A_REAL_FIGURE }]);
    expect(asset.altText.length).toBeGreaterThan(20);
    expect(out).toContain(`alt="${asset.altText.replace(/"/g, "&quot;")}"`);
  });

  it("emits a srcset, so a phone does not download the full-size creative", () => {
    const out = injectFigures(HTML, [{ afterHeading: "The app", src: A_REAL_FIGURE }]);
    expect(out).toMatch(/srcset="[^"]*-360w\.webp 360w/);
    expect(out).toContain("loading=\"lazy\"");
  });

  it("leaves the prose untouched when a figure names a heading that is not there", () => {
    const out = injectFigures(HTML, [{ afterHeading: "A heading nobody wrote", src: A_REAL_FIGURE }]);
    expect(out).toBe(HTML);
  });

  it("throws in dev rather than dropping a figure silently", () => {
    expect(() =>
      injectFigures(HTML, [{ afterHeading: "A heading nobody wrote", src: A_REAL_FIGURE }], true),
    ).toThrow(/not in the prose/);
    expect(() =>
      injectFigures(HTML, [{ afterHeading: "The app", src: "/media/nope.webp" }], true),
    ).toThrow(/not in the media registry/);
  });

  it("escapes a caption rather than letting it inject markup", () => {
    const out = injectFigures(HTML, [
      { afterHeading: "The app", src: A_REAL_FIGURE, caption: 'A <script>alert("x")</script> caption' },
    ]);
    expect(out).not.toContain("<script>");
    expect(out).toContain("&lt;script&gt;");
  });
});

describe("every declared figure actually lands", () => {
  /**
   * The real guard. A figure that names a heading the prose does not contain is
   * silently dropped in production — which is exactly how a review ends up with
   * pictures missing and nobody notices. This reads the actual Markdown.
   */
  it("names a heading that exists in the review's own prose", () => {
    for (const review of Object.values(REVIEWS)) {
      if (!review.figures?.length) continue;
      const md = readFileSync(`apps/web/src/reviews/${review.slug}.md`, "utf8");
      const headings = md
        .split("\n")
        .filter((l) => l.startsWith("## "))
        .map((l) => l.slice(3).trim().toLowerCase());

      for (const fig of review.figures) {
        expect(headings, `${review.slug}: "${fig.afterHeading}"`).toContain(
          fig.afterHeading.toLowerCase(),
        );
      }
    }
  });

  it("points every figure at an asset the registry holds", () => {
    for (const review of Object.values(REVIEWS)) {
      for (const fig of review.figures ?? []) {
        expect(MEDIA_ASSETS.some((a) => a.src === fig.src), `${review.slug}: ${fig.src}`).toBe(true);
      }
    }
  });
});

describe("creatives held back for contradicting the review", () => {
  /**
   * Three of the seven creatives supplied for the Nautilus print claims the
   * manufacturer's own specification denies. They are recorded rather than
   * quietly dropped, so nobody re-adds them later thinking a slot was missed.
   */
  it("records what each one claims and what it contradicts", () => {
    expect(REVIEW_FIGURES_WITHHELD.length).toBeGreaterThan(0);
    for (const w of REVIEW_FIGURES_WITHHELD) {
      expect(w.claim.length).toBeGreaterThan(10);
      expect(w.contradicts.length).toBeGreaterThan(30);
      expect(REVIEWS[w.productSlug]).toBeDefined();
    }
  });

  it("keeps every withheld creative out of the published figure list", () => {
    const published = Object.values(REVIEWS).flatMap((r) => r.figures ?? []).map((f) => f.src);
    // None of the withheld creatives were ever converted into the reviews
    // folder, so no published figure may share their supplied name.
    for (const w of REVIEW_FIGURES_WITHHELD) {
      const slug = w.supplied.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      expect(published.some((src) => src.includes(slug))).toBe(false);
    }
  });
});

describe("review video", () => {
  /**
   * The section renders only for a real YouTube watch URL, and prints the
   * channel. Both matter: a reader should never be unclear whether they are
   * about to watch us, the manufacturer, or a stranger.
   */
  it("points at a real YouTube or Amazon video URL, with no share token", () => {
    const YT = /^https:\/\/(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)[\w-]+$/;
    /* Amazon hosts a seller's own footage on a /vdp/ page. The query string is
       load-bearing there — `product` ties the video to the ASIN — so unlike a
       YouTube link it is not stripped to a bare URL. */
    const AMZ = /^https:\/\/(www\.)?amazon\.[a-z.]+\/vdp\/[0-9a-f]+\?/;
    for (const review of Object.values(REVIEWS)) {
      if (!review.video) continue;
      expect(YT.test(review.video.url) || AMZ.test(review.video.url), review.video.url).toBe(true);
      /* A share token identifies whoever sent the link, not the video.
         YouTube uses si/is; Amazon uses ref=cm_sw_… on a shared link. */
      expect(review.video.url).not.toMatch(/[?&](si|is)=/);
      expect(review.video.url).not.toMatch(/[?&]ref=cm_sw_/);
    }
  });

  it("marks a seller's own video as a seller's own video", () => {
    /* An Amazon URL carrying `amzn1.ive.seller.video` is the manufacturer's
       marketing by definition. A reader cannot decode that, so the flag has to
       be set explicitly and the note has to say it in words. */
    for (const review of Object.values(REVIEWS)) {
      const v = review.video;
      if (!v) continue;
      if (/amzn1\.ive\.seller\.video/.test(v.url)) {
        expect(v.source, `${review.slug}: seller video not flagged`).toBe("seller");
      }
      if (v.source === "seller") {
        expect(v.note?.toLowerCase() ?? "").toMatch(/own video|seller|marketing/);
      }
    }
  });

  it("names the channel, so its provenance is never ambiguous", () => {
    for (const review of Object.values(REVIEWS)) {
      if (!review.video) continue;
      expect(review.video.channel.length).toBeGreaterThan(1);
      expect(review.video.title.length).toBeGreaterThan(10);
    }
  });

  it("says plainly when the video is not ours", () => {
    for (const review of Object.values(REVIEWS)) {
      if (!review.video?.note) continue;
      // Someone else's video must be labelled as someone else's — whether that
      // someone is a stranger with a phone or the manufacturer's marketing team.
      expect(review.video.note.toLowerCase()).toMatch(
        /not ours|independent|third[- ]party|own video|seller|marketing/,
      );
    }
  });
});

describe("headings that markdown has re-punctuated", () => {
  /* Markdown runs typographic substitution. A heading written with straight
     quotes arrives with curly ones, the reference no longer matches, and the
     figure is silently dropped — the page still renders, just without the
     picture. That is what happened to the Betta review in production. */
  const FIG = [{ afterHeading: 'Navigation, and what "ultrasonic radar" is doing here', src: "/media/reviews/betta-se-plus/sensors.webp" }];

  it("matches a heading whose quotes were curled", () => {
    const html = '<h2 id="n">Navigation, and what “ultrasonic radar” is doing here</h2><p>body</p>';
    // dev=true would throw if the heading did not match.
    expect(() => injectFigures(html, FIG as never, true)).not.toThrow();
  });

  it("matches a heading whose apostrophe was curled", () => {
    const ref = [{ afterHeading: "What Betta's own listing says", src: "/media/reviews/betta-se-plus/sensors.webp" }];
    const html = "<h2 id=\"b\">What Betta’s own listing says</h2><p>body</p>";
    expect(() => injectFigures(html, ref as never, true)).not.toThrow();
  });

  it("matches across an en dash written as a hyphen", () => {
    const ref = [{ afterHeading: "Runtime - the real number", src: "/media/reviews/betta-se-plus/sensors.webp" }];
    const html = '<h2 id="r">Runtime – the real number</h2><p>body</p>';
    expect(() => injectFigures(html, ref as never, true)).not.toThrow();
  });

  it("still throws in dev for a heading that genuinely is not there", () => {
    const ref = [{ afterHeading: "A heading nobody wrote", src: "/media/reviews/betta-se-plus/sensors.webp" }];
    expect(() => injectFigures('<h2 id="a">Something else</h2>', ref as never, true)).toThrow(
      /not in the prose/,
    );
  });
});

describe("every declared figure lands in its review", () => {
  /* The production check the unit tests above cannot do: run the real figure
     list against the real compiled headings for every review. A figure that
     names a heading nobody wrote is a picture that never appears. */
  it("names a heading that exists, for every figure of every review", () => {
    for (const review of Object.values(REVIEWS)) {
      const md = readFileSync(`apps/web/src/reviews/${review.slug}.md`, "utf8");
      const headings = [...md.matchAll(/^##\s+(.+)$/gm)].map((m) =>
        m[1].trim().replace(/[‘’]/g, "'").replace(/[“”]/g, '"').toLowerCase(),
      );
      for (const f of review.figures ?? []) {
        const want = f.afterHeading.replace(/[‘’]/g, "'").replace(/[“”]/g, '"').toLowerCase();
        expect(headings, `${review.slug}: no heading "${f.afterHeading}"`).toContain(want);
      }
    }
  });
});
