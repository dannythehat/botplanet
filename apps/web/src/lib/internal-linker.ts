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

  function linkRun(run: string): string {
    let result = run;
    for (const a of live) {
      const key = a.anchor.toLowerCase();
      const left = remaining.get(key) ?? 0;
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
      const re = new RegExp(`(^|[^\\w-])(${pattern})(?![\\w-])`, "i");
      const hit = re.exec(result);
      if (!hit) continue;

      const before = hit[1];
      const phrase = hit[2];
      result =
        result.slice(0, hit.index) +
        before +
        `<a href="${a.href}" class="bp-prose__link">${phrase}</a>` +
        result.slice(hit.index + hit[0].length);

      remaining.set(key, left - 1);
      applied.push({ anchor: phrase, href: a.href });
    }
    return result;
  }
}
