/**
 * Turns declared anchors into real links inside compiled prose.
 *
 * It walks the HTML as a sequence of tags and text runs rather than using a
 * regular expression over the whole string, because the three rules that
 * matter are all about WHERE a phrase sits, not what it says:
 *
 *   - not inside a heading — a heading points at this page, not off it;
 *   - not inside an existing anchor — nested links are invalid and the
 *     browser's recovery is anyone's guess;
 *   - not inside a figure caption — a caption describes a picture.
 *
 * A regex cannot see any of that. Depth counters can.
 *
 * Matching is case-insensitive and whole-word, and the original casing is
 * kept: "BotMatch" stays "BotMatch", "waterline" stays "waterline".
 */
import type { InternalAnchor } from "../content/internal-links";

const SKIP_INSIDE = /^(h[1-6]|a|figure|figcaption|code|pre)$/i;

const escapeRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export interface LinkResult {
  html: string;
  /** What actually linked, in document order. */
  applied: { anchor: string; href: string }[];
}

/**
 * @param selfPath The path of the page being rendered. Anchors pointing at it
 *   are dropped.
 *
 *   THIS MATTERS FROM THE SECOND REVIEW ONWARDS. With one review the anchor
 *   list could only point elsewhere. With two, "Polaris FREEDOM" is both a
 *   phrase in the Nautilus review and the name of a page — and without this the
 *   Polaris page would link its own product name to itself, on every mention.
 *   A self-link is a dead end for a reader and a wasted signal for a crawler.
 */
export function applyInternalLinks(
  html: string,
  anchors: InternalAnchor[],
  selfPath?: string,
): LinkResult {
  /* Compared without a trailing slash so "/robots/x/" and "/robots/x" are the
     same page, which they are. A fragment link back into the current page is
     left alone — that is navigation, not a self-link. */
  const norm = (p: string) => p.split("#")[0].replace(/\/+$/, "");
  const self = selfPath ? norm(selfPath) : null;

  const live = anchors.filter(
    (a) => a.status === "live" && !(self !== null && norm(a.href) === self && !a.href.includes("#")),
  );
  if (live.length === 0) return { html, applied: [] };

  const remaining = new Map(live.map((a) => [a.anchor.toLowerCase(), a.max ?? 1]));
  const applied: { anchor: string; href: string }[] = [];

  // Depth of elements we must not link inside. One counter per tag name keeps
  // nesting honest (a figure inside a figure, an anchor inside a heading).
  const depth = new Map<string, number>();
  const blocked = () => [...depth.values()].some((n) => n > 0);

  let out = "";
  let i = 0;

  while (i < html.length) {
    const lt = html.indexOf("<", i);

    // ---- text run ----
    const text = html.slice(i, lt === -1 ? html.length : lt);
    out += blocked() ? text : linkRun(text);
    if (lt === -1) break;

    // ---- tag ----
    const gt = html.indexOf(">", lt);
    if (gt === -1) {
      out += html.slice(lt);
      break;
    }
    const tag = html.slice(lt, gt + 1);
    const m = /^<(\/?)([a-zA-Z][a-zA-Z0-9]*)/.exec(tag);
    if (m) {
      const [, slash, nameRaw] = m;
      const name = nameRaw.toLowerCase();
      if (SKIP_INSIDE.test(name) && !tag.endsWith("/>")) {
        depth.set(name, Math.max(0, (depth.get(name) ?? 0) + (slash ? -1 : 1)));
      }
    }
    out += tag;
    i = gt + 1;
  }

  return { html: out, applied };

  /**
   * Link every anchor that fits, without ever nesting one inside another.
   *
   * THE BUG THIS REPLACES. The old version searched and rewrote the same
   * string in a loop, so the second anchor was matched against text that
   * already contained the first anchor's `<a>` tag — and cheerfully matched
   * inside it. That produced `<a ...><a ...>`, which is invalid HTML and whose
   * rendering is the browser's guess. Eight pages carried one before this was
   * found by crawling the live site and grepping for the pattern.
   *
   * The walker above cannot prevent it: it tracks the depth of anchors it
   * meets in the incoming HTML, and a link created in here was never in that
   * HTML to be counted.
   *
   * So matching now happens once, against the untouched run, and every hit
   * claims a range. A later anchor may not overlap a claimed range, which
   * makes nesting impossible rather than unlikely. The string is assembled at
   * the end, in document order.
   */
  function linkRun(run: string): string {
    const claims: { start: number; end: number; href: string; phrase: string; anchor: string }[] = [];
    const overlaps = (a: number, b: number) => claims.some((c) => a < c.end && b > c.start);

    for (const a of live) {
      const key = a.anchor.toLowerCase();
      let left = remaining.get(key) ?? 0;
      if (left <= 0) continue;

      /* \b does not work either side of a hyphen, so the boundary is spelled
         out: not preceded or followed by a word character or a hyphen.

         SPACES IN THE ANCHOR MATCH ANY WHITESPACE, INCLUDING A NEWLINE.
         Markdown keeps the author's line breaks inside a paragraph, so a
         phrase that happened to wrap in the source arrives here as
         "Dolphin\nNautilus CC Plus". Matching a literal space meant the
         longer an anchor was, the more likely it silently failed to link —
         and it failed invisibly, because the page still rendered perfectly.
         Found on the live Polaris review, where the one cross-review link on
         the page was missing for exactly this reason. */
      const pattern = escapeRe(a.anchor).replace(/ /g, "\\s+");
      const re = new RegExp(`(^|[^\\w-])(${pattern})(?![\\w-])`, "gi");

      for (let m = re.exec(run); m && left > 0; m = re.exec(run)) {
        const s0 = m.index + m[1].length;
        const e0 = s0 + m[2].length;
        if (overlaps(s0, e0)) continue;
        claims.push({ start: s0, end: e0, href: a.href, phrase: m[2], anchor: a.anchor });
        left -= 1;
      }
      remaining.set(key, left);
    }

    if (claims.length === 0) return run;
    claims.sort((x, y) => x.start - y.start);

    let out2 = "";
    let at = 0;
    for (const c of claims) {
      out2 += run.slice(at, c.start) + `<a href="${c.href}" class="bp-prose__link">${c.phrase}</a>`;
      at = c.end;
      applied.push({ anchor: c.phrase, href: c.href });
    }
    return out2 + run.slice(at);
  }
}
