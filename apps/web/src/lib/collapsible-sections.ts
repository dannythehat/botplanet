/* ============================================================
   BotPlanet — progressive disclosure for long reviews.

   THE PROBLEM THIS SOLVES IS MEASURED, NOT FELT. The Nautilus
   review rendered 21,880px tall on a 390px phone — twenty-six
   full screens. That is not "a thorough review", it is a wall,
   and the trace showed the cost: 999ms of RasterTask over a ten
   second scroll, because a page that tall is a page the browser
   is forever painting the next screen of.

   NOTHING IS DELETED TO ACHIEVE IT. Every word still ships in the
   HTML, inside a <details>. That matters for two separate reasons:

     - Google indexes content inside <details>. Collapsing a
       section does not hide it from search, and never has;
     - the reader who wants the SKU trap explained in full can
       still have it. They just are not made to scroll past it to
       reach the verdict.

   WHICH SECTIONS COLLAPSE IS AN EDITORIAL DECISION, NOT A RULE.
   It is named per review in content/reviews.ts. A section that
   answers "should I buy this" is never collapsed; a section that
   answers "why exactly" is a fair candidate. Getting that wrong
   in the direction of collapsing too much turns a review into a
   FAQ, so the default is open and the list is short.

   HTML PARSING. The compiled Markdown from Astro puts every H2 at
   the top level of the fragment, so splitting on them is safe here
   in a way it would not be on arbitrary HTML. The split is on the
   `id` attribute Astro's pipeline writes, not on the heading text,
   so a heading that gets reworded does not silently stop folding.
   ============================================================ */

export interface FoldSpec {
  /**
   * The heading id Astro generated — i.e. the slug of the H2 text.
   * Named rather than matched on the text so a reworded heading fails
   * loudly in dev instead of quietly rendering flat.
   */
  id: string;
  /**
   * The one line shown while it is shut. It has to say what is inside
   * well enough that a reader can decide not to open it — "Read more"
   * tells them nothing and costs them a tap to find out.
   */
  teaser: string;
}

interface FoldResult {
  html: string;
  /** The ids actually folded, so the caller can wire up the contents links. */
  folded: string[];
}

const H2 = /<h2\b[^>]*\bid="([^"]+)"[^>]*>([\s\S]*?)<\/h2>/g;

/**
 * The id is copied straight out of an existing `id="…"` attribute, so it is
 * already entity-escaped. Re-escaping `&` here would turn `&quot;` into
 * `&amp;quot;` and change the id — which would break the anchor it exists to
 * preserve. Only the quote is handled, and only as a belt-and-braces measure:
 * the regex above cannot capture one.
 */
function escapeAttr(s: string): string {
  return s.replace(/"/g, "&quot;");
}

/**
 * Wraps the named H2 sections — heading plus everything up to the next H2 —
 * in a <details> that starts shut.
 *
 * @param strict In dev, throw when a named id is not in the document. A fold
 *   that silently does nothing is the failure mode worth catching early: the
 *   page still renders, so nobody notices until the section is reworded and
 *   the page is twice as long as it was yesterday.
 */
export function foldSections(html: string, folds: FoldSpec[] = [], strict = false): FoldResult {
  if (folds.length === 0) return { html, folded: [] };

  const byId = new Map(folds.map((f) => [f.id, f]));

  /* Every H2 in document order, with where it starts. The section body runs
     from the end of one heading to the start of the next. */
  const heads: { id: string; text: string; start: number; end: number }[] = [];
  for (const m of html.matchAll(H2)) {
    heads.push({
      id: m[1],
      text: m[2],
      start: m.index!,
      end: m.index! + m[0].length,
    });
  }

  const seen = new Set(heads.map((h) => h.id));
  const missing = folds.filter((f) => !seen.has(f.id));
  if (missing.length && strict) {
    throw new Error(
      `foldSections: no <h2 id="…"> for ${missing.map((f) => f.id).join(", ")}. ` +
        `The document has: ${heads.map((h) => h.id).join(", ")}. ` +
        `A heading was probably reworded — update content/reviews.ts.`,
    );
  }

  const folded: string[] = [];
  let out = "";
  let cursor = 0;

  heads.forEach((h, i) => {
    const spec = byId.get(h.id);
    if (!spec) return;

    const bodyEnd = i + 1 < heads.length ? heads[i + 1].start : html.length;

    out += html.slice(cursor, h.start);
    out +=
      `<details class="bp-fold" id="${escapeAttr(h.id)}-fold">` +
      `<summary class="bp-fold__sum">` +
      /* The heading stays a real <h2> inside the summary. The spec allows a
         single heading element there, so the document outline — and every
         crawler that reads it — is unchanged by the folding. */
      `<h2 id="${escapeAttr(h.id)}" class="bp-fold__h">${h.text}</h2>` +
      `<span class="bp-fold__teaser">${spec.teaser}</span>` +
      `<span class="bp-fold__chev" aria-hidden="true"></span>` +
      `</summary>` +
      `<div class="bp-fold__body">${html.slice(h.end, bodyEnd)}</div>` +
      `</details>`;

    cursor = bodyEnd;
    folded.push(h.id);
  });

  out += html.slice(cursor);
  return { html: out, folded };
}
