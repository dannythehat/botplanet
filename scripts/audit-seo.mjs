/**
 * The on-page audit: what each page is trying to rank for, and how the site
 * links itself together.
 *
 * WHY THIS IS SEPARATE FROM audit-links.mjs. That script asks whether a link
 * WORKS — 200, canonical, no noindex, target exists. Every one of those can
 * pass on a site that is quietly failing at search: a page whose title has
 * drifted off its keyword still returns 200, an anchor reading "click here"
 * still resolves, a jump link pointing at a heading id that was renamed still
 * renders as a link. This script asks whether the linking and the wording are
 * doing any WORK, which is a different question and needs different assertions.
 *
 * WHAT IT CHECKS, all against a running site rather than the source, because
 * the source is not what a crawler meets:
 *
 *   KEYWORDS
 *     1. every indexable page has a keyword register row — a page with no row
 *        is a page nothing is asserting anything about;
 *     2. the primary term appears in the title, the H1 and the body;
 *     3. every mustAppear secondary term appears in the body;
 *     4. no two pages claim the same primary term (cannibalisation);
 *     5. no two pages share a title or a meta description;
 *     6. exactly one H1;
 *     7. title and meta description lengths that survive a SERP — skipped on
 *        a page the register marks `notRanking`, which is not in a SERP fight.
 *
 *   JUMP LINKS
 *     8. every #fragment resolves to an id that exists on the target page,
 *        same-page and cross-page alike;
 *     9. a long page with sections offers a way to jump into them.
 *
 *   INTERNAL LINKING
 *    10. anchor text is descriptive, not "click here" / "read more" / a URL;
 *    11. no page in the sitemap is orphaned — reachable only from nav chrome;
 *    12. no single target soaks up a disproportionate share of body links;
 *    13. the same anchor text is not repeated at one target past the point it
 *        reads as natural.
 *
 * WHAT IT DELIBERATELY DOES NOT DO. It does not score, grade or rank. Every
 * finding names the page, the exact string, and what would fix it, because a
 * number out of 100 tells nobody which line to edit.
 *
 * BODY LINKS ONLY, FOR THE LINKING CHECKS. Site nav, breadcrumb and footer
 * links appear on all 94 pages; counting them would show every page as
 * heavily linked and hide the pages nothing in the prose points at. Those
 * regions are cut before the link graph is built. That cut is the single
 * assumption in this file worth knowing about.
 *
 *   node scripts/audit-seo.mjs [baseUrl]
 *   npm run audit:seo
 *
 * Exit code is 1 if any FAIL-level finding stands, 0 when only warnings do.
 */
import { spawnSync } from "node:child_process";

/* Flags are filtered out first: `audit-seo.mjs --json` would otherwise take
   "--json" for the base URL and audit nothing. */
const ARGS = process.argv.slice(2).filter((a) => !a.startsWith("--"));
const BASE = (ARGS[0] ?? "https://botplanet.io").replace(/\/$/, "");
const JSON_OUT = process.argv.includes("--json");
/* With --json the only thing on stdout is the JSON. Progress goes to stderr so
   the output can be piped straight into a tool without being cleaned first. */
const say = (...a) => (JSON_OUT ? console.error(...a) : console.log(...a));

/* ------------------------------------------------------------------ */
/* The register, read through tsx rather than re-parsed here            */
/* ------------------------------------------------------------------ */

/**
 * Same approach as audit-links.mjs: import the real module. A regex over
 * keyword-register.ts would drift the first time somebody used a computed
 * path, and this file's whole value is that it agrees with what ships.
 */
function loadRegister() {
  const r = spawnSync(
    "npx",
    [
      "tsx",
      "-e",
      `import("./apps/web/src/content/seo/keyword-register.ts").then((m) => {
         console.log("__JSON__" + JSON.stringify(m.KEYWORD_REGISTER));
       })`,
    ],
    { encoding: "utf8", maxBuffer: 32 * 1024 * 1024 },
  );
  const line = (r.stdout ?? "").split("\n").find((l) => l.startsWith("__JSON__"));
  if (!line) {
    console.error("could not read the keyword register:\n", r.stderr);
    process.exit(2);
  }
  return JSON.parse(line.slice("__JSON__".length));
}

/* ------------------------------------------------------------------ */
/* Fetching and parsing                                                */
/* ------------------------------------------------------------------ */

/**
 * A 503 FROM OUR OWN CRAWLER IS NOT A BROKEN PAGE, and the first version of
 * this reported it as one. Fetching ninety-four URLs eight at a time trips the
 * edge's rate limiting, and the run came back with twenty-two "sitemap URL
 * returned 503" failures on pages that were serving fine to a browser — plus a
 * false orphan and a false thin-inbound, because a page that failed to load
 * contributed none of its outbound links to the graph. A checker whose own
 * load generates its findings is worse than no checker: it teaches you to
 * ignore the red.
 *
 * So 429 and 503 are retried with backoff rather than recorded, and only a
 * status that survives every attempt is reported.
 */
const RETRYABLE = new Set([408, 425, 429, 500, 502, 503, 504]);

async function get(url) {
  let last = { status: 0, body: "", finalUrl: url };
  for (let attempt = 0; attempt < 5; attempt++) {
    try {
      const res = await fetch(url, { redirect: "follow" });
      const body = await res.text();
      last = { status: res.status, body, finalUrl: res.url };
      if (!RETRYABLE.has(res.status)) return last;
    } catch (err) {
      last = { status: 0, body: "", finalUrl: url, err: String(err) };
    }
    if (attempt < 4) await new Promise((r) => setTimeout(r, 600 * 2 ** attempt));
  }
  return last;
}

const tag = (html, re) => (re.exec(html) ?? [])[1]?.trim();

function decode(s = "") {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;|&apos;|&#x27;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/&mdash;/g, "—")
    .replace(/&ndash;/g, "–")
    .replace(/&hellip;/g, "…");
}

const strip = (html) => decode(html.replace(/<[^>]*>/g, " ")).replace(/\s+/g, " ").trim();

/* ------------------------------------------------------------------ */
/* Term matching                                                       */
/* ------------------------------------------------------------------ */

/**
 * How a search engine sees a phrase, roughly, rather than how a string
 * comparison does.
 *
 * A NAIVE includes() REPORTS TYPOGRAPHY AS A KEYWORD FAILURE. The first run of
 * this audit flagged "Self-Cleaning Litter Boxes" as not containing
 * "self cleaning litter box", and "Wire-Free Robot Lawn Mower" as not
 * containing "wire free robot lawn mower". Both titles are on their term; the
 * only differences were a hyphen and a plural, neither of which any engine has
 * treated as a distinct phrase for a decade. Flagging them buries the handful
 * of pages that genuinely are off their keyword.
 *
 * So punctuation is flattened, and a trailing "s" is ignored at the end of
 * each word. That is deliberately shallow — it is not stemming and does not
 * pretend to be. It removes the two differences that produce false alarms and
 * leaves every real one standing.
 */
function norm(s) {
  return decode(s)
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/[‐-―]/g, "-")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/(\w)s\b/g, "$1")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Whether the phrase is present, and if not, whether its words are all there
 * but interrupted.
 *
 * THE DISTINCTION CHANGES THE FIX, which is why it is not one boolean.
 * "Aiper Scuba V3 AI Vision Review" does not contain the phrase "aiper scuba
 * v3 review" — but every word is there, in order, with "AI Vision" between
 * them. That is a title doing its job and a phrase-match rule being literal;
 * the fix, if there is one, is a decision about the title, not a missing term.
 * A page that simply never says the words is a different problem with a
 * different remedy, and lumping the two together would hide it.
 */
function phrasePresence(haystack, phrase) {
  const h = norm(haystack);
  const p = norm(phrase);
  if (!p) return "exact";
  if (h.includes(p)) return "exact";

  const words = p.split(" ");
  let cursor = 0;
  for (const w of words) {
    const at = h.indexOf(w, cursor);
    if (at === -1) return "absent";
    cursor = at + w.length;
  }
  return "interrupted";
}

/**
 * The page with its chrome removed.
 *
 * Site nav, header and footer are identical on all 94 pages. Left in, they
 * would put ~40 links on every page and make the link graph a picture of the
 * template rather than of the writing.
 *
 * CUT `<main>` FIRST, THEN NAV — NOT THE OTHER WAY ROUND. The first version of
 * this stripped every `<header>` element before extracting main, which was
 * wrong in a way that produced confident nonsense: a review's own title block
 * is a `<header>` INSIDE main, so every review lost its H1 from the body text
 * and the audit reported fourteen pages as "body copy never contains its own
 * primary term" when the term was in the H1 all along. Site header and footer
 * sit outside `<main>` and are removed by taking main at all; the only chrome
 * left inside is the breadcrumb `<nav>`, so that is the only thing cut here.
 */
function bodyOf(html) {
  const cleaned = html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ");
  const main = /<main[^>]*>([\s\S]*?)<\/main>/i.exec(cleaned);
  const inner = main
    ? main[1]
    : cleaned
        .replace(/<header[\s\S]*?<\/header>/gi, " ")
        .replace(/<footer[\s\S]*?<\/footer>/gi, " ");
  return stripChromeNav(inner);
}

/**
 * Chrome navs only — the primary menu, the breadcrumb, the footer menu.
 *
 * NOT EVERY <nav> IS CHROME, AND ASSUMING SO PRODUCED A WHOLE FALSE CATEGORY.
 * A table of contents is correctly marked up as a `<nav>`, and the site does
 * exactly that: `<nav class="bp-toc" aria-labelledby="toc-heading">`. Stripping
 * every nav therefore deleted the contents block from the parsed page and the
 * audit reported fifteen long guides as having "no in-page jump links" while
 * every one of them was shipping a working ToC. The rule was reading its own
 * blind spot back to itself.
 *
 * So the cut is by identity, not by tag: a nav is chrome when it says it is.
 */
function stripChromeNav(html) {
  return html.replace(/<nav\b([^>]*)>[\s\S]*?<\/nav>/gi, (whole, attrs) =>
    /class="(main|crumbs|foot-nav)"|aria-label="(Primary|Breadcrumb|Footer)"/i.test(attrs)
      ? " "
      : whole,
  );
}

function parse(html, path) {
  const body = bodyOf(html);
  const headings = [...html.matchAll(/<h([1-6])[^>]*>([\s\S]*?)<\/h\1>/gi)].map((m) => ({
    level: Number(m[1]),
    text: strip(m[2]),
  }));

  const links = [...body.matchAll(/<a\s([^>]*)>([\s\S]*?)<\/a>/gi)].map((m) => {
    const attrs = m[1];
    const href = decode((/href\s*=\s*"([^"]*)"/i.exec(attrs) ?? [])[1] ?? "");
    const ariaLabel = decode((/aria-label\s*=\s*"([^"]*)"/i.exec(attrs) ?? [])[1] ?? "");
    const inner = m[2];
    const imgAlt = decode((/<img[^>]*\salt\s*=\s*"([^"]*)"/i.exec(inner) ?? [])[1] ?? "");
    return { href, text: strip(inner), ariaLabel, imgAlt, attrs };
  });

  return {
    path,
    title: decode(tag(html, /<title[^>]*>([\s\S]*?)<\/title>/i) ?? ""),
    description: decode(
      tag(html, /<meta\s+name="description"\s+content="([^"]*)"/i) ??
        tag(html, /<meta\s+content="([^"]*)"\s+name="description"/i) ??
        "",
    ),
    noindex: /<meta\s+name="robots"[^>]*noindex/i.test(html),
    h1s: headings.filter((h) => h.level === 1).map((h) => h.text),
    headings,
    ids: new Set([...html.matchAll(/\sid\s*=\s*"([^"]+)"/gi)].map((m) => m[1])),
    links,
    text: strip(body).toLowerCase(),
    words: strip(body).split(/\s+/).filter(Boolean).length,
  };
}

/* ------------------------------------------------------------------ */
/* Findings                                                            */
/* ------------------------------------------------------------------ */

const findings = [];
const add = (level, rule, path, detail, fix) =>
  findings.push({ level, rule, path, detail, fix });

/* ------------------------------------------------------------------ */
/* Run                                                                 */
/* ------------------------------------------------------------------ */

const REGISTER = loadRegister();
const registerFor = (p) => REGISTER.find((k) => k.path === p);

say(`Auditing ${BASE}\n`);

const sitemapRes = await get(`${BASE}/sitemap.xml`);
const paths = [...sitemapRes.body.matchAll(/<loc>([^<]+)<\/loc>/g)]
  .map((m) => new URL(m[1]).pathname)
  .filter((p, i, a) => a.indexOf(p) === i)
  .sort();

if (paths.length === 0) {
  console.error("sitemap returned no URLs — nothing to audit");
  process.exit(2);
}

say(`sitemap: ${paths.length} URLs`);

/* Four at a time, not eight. Politeness, and a 94-way fan-out at once gets
   throttled and produces failures that look like site faults — see the note on
   get() above, which is that mistake written down. */
const pages = new Map();
for (let i = 0; i < paths.length; i += 4) {
  const chunk = paths.slice(i, i + 4);
  const got = await Promise.all(chunk.map((p) => get(`${BASE}${p}`)));
  chunk.forEach((p, j) => {
    if (got[j].status !== 200) {
      add("FAIL", "page_unreachable", p, `sitemap URL returned ${got[j].status}`, "fix the route or drop it from the sitemap");
      return;
    }
    pages.set(p, parse(got[j].body, p));
  });
}
say(`fetched: ${pages.size} pages\n`);

/* ================================================================== */
/* PART A — keywords per page                                          */
/* ================================================================== */

const byTitle = new Map();
const byDescription = new Map();
const byPrimary = new Map();

for (const [path, page] of pages) {
  if (page.noindex) continue;

  const reg = registerFor(path);

  /* 1. a page with no register row is a page nothing asserts anything about */
  if (!reg) {
    add(
      "FAIL",
      "no_register_row",
      path,
      "indexable page with no keyword register row",
      "add a row to apps/web/src/content/seo/keyword-register.ts naming the term this page is built around",
    );
  } else if (reg.notRanking) {
    /* A page the register marks as not competing. Structural checks still run
       below — one H1, unique title, working jump links — because those are
       about the page being well-formed. The SERP economics do not, because
       there is no SERP to be economical about. */
    add("NOTE", "not_a_ranking_target", path, reg.notRanking, "no action — the register says so on purpose");
  } else {
    const primary = reg.primary.term;
    const h1 = page.h1s[0] ?? "";

    /* 2. the primary term where a SERP can see it */
    const inTitle = phrasePresence(page.title, primary);
    if (inTitle === "absent") {
      add("FAIL", "primary_missing_from_title", path, `title does not contain "${primary}" — title is "${page.title}"`, "work the primary term into the title tag, or retarget the page to the term the title actually serves");
    } else if (inTitle === "interrupted") {
      add("WARN", "primary_split_in_title", path, `title carries every word of "${primary}" but not as a phrase — title is "${page.title}"`, "decide which you want: the exact phrase, or the fuller name. Both are defensible; drifting between them is not");
    }

    const inH1 = phrasePresence(h1, primary);
    if (inH1 === "absent") {
      add("WARN", "primary_missing_from_h1", path, `H1 does not contain "${primary}" — H1 is "${h1 || "(none)"}"`, "work the primary term into the H1, or change the primary if the H1 is right");
    }

    const inBody = phrasePresence(page.text, primary);
    if (inBody === "absent") {
      add("FAIL", "primary_missing_from_body", path, `body copy never contains the words of "${primary}"`, "use the term in the copy or retarget the page");
    } else if (inBody === "interrupted" && inTitle !== "exact") {
      add("WARN", "primary_never_exact", path, `"${primary}" appears nowhere as a phrase — not in the title, not in the H1, not in the copy`, "say it once, in a sentence that would have been written anyway");
    }

    /* 3. secondary terms the register marked mustAppear */
    for (const s of reg.secondary.filter((t) => t.mustAppear)) {
      const seen = phrasePresence(page.text, s.term);
      if (seen === "absent") {
        add("FAIL", "secondary_missing", path, `mustAppear secondary "${s.term}" is not in the copy`, "add it naturally, or set mustAppear: false if it was aspirational");
      } else if (seen === "interrupted") {
        add("WARN", "secondary_split", path, `mustAppear secondary "${s.term}" is present only as scattered words, never as the phrase`, "one sentence using the phrase as written, or drop mustAppear — a long-tail term the copy never says is not being targeted");
      }
    }

    /* 4. two pages built around one term compete with each other */
    if (!byPrimary.has(primary)) byPrimary.set(primary, []);
    byPrimary.get(primary).push(path);

    /**
     * A ceded term must not lead the page that ceded it — UNLESS THE PAGE'S
     * OWN TERM CONTAINS IT, which is the normal case and not a fault.
     *
     * "best robotic pool cleaner" contains "robotic pool cleaner". A page
     * built around the first cannot avoid the second, and demanding it does
     * would mean a best-of page unable to name its own subject. The first run
     * flagged all twelve pages in the /best-robots/ and /guides/ trees on
     * exactly this, which is a check reporting the English language rather
     * than a problem with the site.
     *
     * The check that survives is the one that matters: a page leading with a
     * ceded term it has NO claim to, which is two pages competing.
     */
    const front = `${page.title} ${page.description} ${page.h1s[0] ?? ""}`;
    for (const c of reg.cededTo ?? []) {
      if (norm(primary).includes(norm(c.term))) continue;
      if (phrasePresence(front, c.term) === "exact") {
        add("WARN", "chases_ceded_term", path, `leads with "${c.term}", which the register cedes to ${c.path}, and this page's own term ("${primary}") does not contain it`, "keep the ceded term out of the title, H1 and meta description");
      }
    }
  }

  /* 5. duplicate titles and descriptions */
  if (page.title) {
    if (!byTitle.has(page.title)) byTitle.set(page.title, []);
    byTitle.get(page.title).push(path);
  }
  if (page.description) {
    if (!byDescription.has(page.description)) byDescription.set(page.description, []);
    byDescription.get(page.description).push(path);
  }

  /* 6. exactly one H1 */
  if (page.h1s.length === 0) {
    add("FAIL", "no_h1", path, "page has no H1", "give the page a single H1");
  } else if (page.h1s.length > 1) {
    add("WARN", "multiple_h1", path, `${page.h1s.length} H1s: ${page.h1s.map((h) => `"${h}"`).join(", ")}`, "demote all but one to H2");
  }

  /* 7. lengths that survive a SERP. Google truncates around 600px, which is
        roughly 60 characters; descriptions around 155-160. */
  if (!page.title) {
    add("FAIL", "no_title", path, "page has no title tag", "add one");
  } else if (reg?.notRanking) {
    /* no length opinion on a page that is not competing */
  } else if (page.title.length > 65) {
    add("WARN", "title_too_long", path, `title is ${page.title.length} chars and will truncate: "${page.title}"`, "cut to 60 or fewer, front-loading the term");
  } else if (page.title.length < 20) {
    add("WARN", "title_too_short", path, `title is only ${page.title.length} chars: "${page.title}"`, "a fuller title has room for the term and a qualifier");
  }

  if (!page.description) {
    add("FAIL", "no_description", path, "page has no meta description", "add one — Google will otherwise invent a snippet from the copy");
  } else if (reg?.notRanking) {
    /* as above */
  } else if (page.description.length > 165) {
    add("WARN", "description_too_long", path, `meta description is ${page.description.length} chars and will truncate`, "cut to 155 or fewer");
  } else if (page.description.length < 70) {
    add("WARN", "description_too_short", path, `meta description is only ${page.description.length} chars — leaves SERP space unused`, "expand toward 150");
  }

  /* heading order: an H4 directly under an H2 reads as a broken outline to a
     parser building a document structure from the page. */
  let prev = 0;
  for (const h of page.headings) {
    if (prev && h.level > prev + 1) {
      add("WARN", "heading_level_skipped", path, `H${prev} is followed by H${h.level} ("${h.text}")`, "do not skip a level — the outline is what a crawler reads structure from");
      break;
    }
    prev = h.level;
  }
}

for (const [title, ps] of byTitle) {
  if (ps.length > 1) {
    add("FAIL", "duplicate_title", ps[0], `${ps.length} pages share the title "${title}": ${ps.join(", ")}`, "give each page its own title");
  }
}
for (const [desc, ps] of byDescription) {
  if (ps.length > 1) {
    add("FAIL", "duplicate_description", ps[0], `${ps.length} pages share a meta description: ${ps.join(", ")}`, "write one per page");
  }
}
for (const [term, ps] of byPrimary) {
  if (ps.length > 1) {
    add("FAIL", "keyword_cannibalisation", ps[0], `"${term}" is the primary term on ${ps.length} pages: ${ps.join(", ")}`, "one page owns the term; the others cede it with a cededTo entry");
  }
}

/* ================================================================== */
/* PART B — jump links                                                 */
/* ================================================================== */

for (const [path, page] of pages) {
  const sameHost = (h) => h.startsWith("/") || h.startsWith(BASE);
  for (const link of page.links) {
    const href = link.href;
    if (!href || !href.includes("#")) continue;

    const [target, frag] = href.replace(BASE, "").split("#");
    if (!frag) continue;
    if (!sameHost(href) && !href.startsWith("#")) continue;

    const targetPath = target === "" ? path : target;
    const targetPage = pages.get(targetPath);

    if (!targetPage) {
      /* audit-links.mjs already covers a missing target page; only report the
         fragment question here, and only when we can actually answer it. */
      continue;
    }
    if (!targetPage.ids.has(frag)) {
      add(
        "FAIL",
        "jump_link_broken",
        path,
        `"${link.text || link.ariaLabel || href}" jumps to ${targetPath}#${frag}, and no element on that page has that id`,
        "fix the fragment or give the heading the id the link expects",
      );
    }
  }

  /* 9. a long page with real sections and no way into them */
  const sections = page.headings.filter((h) => h.level === 2).length;
  const hasJumpNav = page.links.some((l) => l.href.startsWith("#"));
  if (page.words > 1500 && sections >= 4 && !hasJumpNav) {
    add(
      "WARN",
      "no_jump_nav",
      path,
      `${page.words} words across ${sections} H2 sections with no in-page jump links`,
      "add a contents block — it is what earns a sitelinks box and what a reader on a phone needs",
    );
  }
}

/* ================================================================== */
/* PART C — internal linking and anchor text                           */
/* ================================================================== */

/**
 * Anchor text that describes the destination is the entire mechanism: it tells
 * a reader what they are about to get and tells a crawler what the target is
 * about. These strings tell neither anything.
 */
const EMPTY_ANCHORS = [
  "click here", "here", "read more", "more", "learn more", "this page",
  "this", "link", "see more", "find out more", "view", "go", "continue",
  "read", "details", "info", "check it out", "shop now", "buy now",
];

const inbound = new Map(); // path -> [{from, text}]
const anchorsTo = new Map(); // path -> Map(text -> count)
let bodyLinkCount = 0;

for (const [path, page] of pages) {
  for (const link of page.links) {
    let href = link.href;
    if (!href || href.startsWith("mailto:") || href.startsWith("tel:")) continue;
    if (href.startsWith("#")) continue;
    if (href.startsWith("http") && !href.startsWith(BASE)) continue;
    href = href.replace(BASE, "").split("#")[0].split("?")[0];
    if (!href.startsWith("/")) continue;
    if (href.startsWith("/go/") || href.startsWith("/api/")) continue;

    bodyLinkCount++;

    const label = link.text || link.ariaLabel || link.imgAlt;
    const key = norm(label);

    /* 10. anchor text doing no work */
    if (!label) {
      add("FAIL", "anchor_no_text", path, `link to ${href} has no text, no aria-label and no image alt`, "give it text a screen reader and a crawler can both use");
    } else if (EMPTY_ANCHORS.includes(key)) {
      add("WARN", "anchor_not_descriptive", path, `link to ${href} reads "${label}"`, "name the destination — what the reader gets by following it");
    } else if (/^https?:\/\//i.test(label) || /^www\./i.test(label)) {
      add("WARN", "anchor_is_a_url", path, `link to ${href} uses the URL as its text: "${label}"`, "replace with words");
    }

    if (href !== path) {
      if (!inbound.has(href)) inbound.set(href, []);
      inbound.get(href).push({ from: path, text: label });

      if (!anchorsTo.has(href)) anchorsTo.set(href, new Map());
      const m = anchorsTo.get(href);
      m.set(key, (m.get(key) ?? 0) + 1);
    }
  }
}

/**
 * 11. orphans — in the sitemap, pointed at by no page's prose.
 *
 * A LEGAL PAGE LIVING IN THE FOOTER IS NOT AN ORPHAN, it is a legal page doing
 * what legal pages do, and reporting it alongside a real orphan trains the
 * reader of this audit to skim past both. These are listed separately and
 * without a severity, as a fact rather than a fault.
 */
const CHROME_BY_DESIGN = ["/privacy/", "/terms/", "/contact/", "/about/", "/affiliate-disclosure/", "/editorial-policy/"];

for (const path of pages.keys()) {
  if (path === "/") continue;
  const links = inbound.get(path) ?? [];
  if (links.length === 0) {
    if (CHROME_BY_DESIGN.includes(path)) {
      add("NOTE", "footer_only_by_design", path, "linked only from site chrome, which is where this kind of page belongs", "no action — recorded so it is not mistaken for an orphan");
    } else {
      add("FAIL", "orphan_page", path, "in the sitemap and linked from no page's body copy — reachable only through nav chrome", "link it from the pages whose subject it continues");
    }
  } else if (links.length === 1) {
    add("WARN", "thin_inbound", path, `linked from exactly one page (${links[0].from})`, "a page worth publishing is usually worth linking from more than one place");
  }
}

/* 12. one target soaking up the links. A threshold rather than a rule: this
      flags a shape worth looking at, not a defect. */
const ranked = [...inbound.entries()].sort((a, b) => b[1].length - a[1].length);
const totalInbound = ranked.reduce((n, [, l]) => n + l.length, 0);
for (const [path, links] of ranked.slice(0, 5)) {
  const share = links.length / Math.max(totalInbound, 1);
  if (share > 0.12 && links.length > 12) {
    add("WARN", "link_concentration", path, `${links.length} body links (${Math.round(share * 100)}% of all internal body links) point here`, "check the block generating them is spreading its picks rather than defaulting to one");
  }
}

/**
 * 13. anchor variety at a well-linked target.
 *
 * THE FIRST VERSION OF THIS RULE WAS BACKWARDS. It flagged any anchor text
 * used eight or more times, which put "Aiper Scuba S1" — twenty-one links,
 * every one of them pointing at the Aiper Scuba S1 review — at the top of the
 * report. That is not a problem. That is the single most useful signal a site
 * can send about what a page is, and a rule that calls it a fault is a rule
 * that would make the site worse if followed.
 *
 * The thing actually worth knowing is the opposite: a page with plenty of
 * inbound links where EVERY ONE reads identically. Real writing produces
 * variety without trying, because sentences differ. Total uniformity at scale
 * means one component generated all of them, and a reader meeting the same
 * eleven words in eleven places notices.
 */
/**
 * A BYLINE IS SUPPOSED TO BE UNIFORM, and this rule catches it as a fault.
 *
 * Author boxes went on all sixty-three reviews on 10 August 2026, and every one
 * of them links to the author reading exactly their name — which is the only
 * correct anchor text a byline can have. Varying it would produce "the reviews
 * editor", "she", "our editor" pointing at a person's page, which is worse
 * writing and a worse signal.
 *
 * Listed by path rather than pattern-matched, the same way every other judged
 * exception in this repo is, so a second one cannot join it by accident.
 */
const ANCHOR_UNIFORMITY_BY_DESIGN = new Set([
  "/authors/danny/",
  "/authors/michelle-choa/",
]);

for (const [path, texts] of anchorsTo) {
  if (ANCHOR_UNIFORMITY_BY_DESIGN.has(path)) {
    add(
      "NOTE",
      "byline_anchor_by_design",
      path,
      "every inbound link reads the author's name, which is what a byline is",
      "no action — an author link that varied its wording would be the fault",
    );
    continue;
  }
  const total = [...texts.values()].reduce((a, b) => a + b, 0);
  if (total < 8) continue;
  const [topText, topCount] = [...texts.entries()].sort((a, b) => b[1] - a[1])[0];
  if (topCount / total >= 0.9 && texts.size <= 2) {
    add(
      "WARN",
      "anchor_text_uniform",
      path,
      `${total} body links point here and ${topCount} of them read exactly "${topText}" — ${texts.size} distinct phrasing(s) in total`,
      "vary the wording where the sentence allows it; identical anchors at this scale come from a component, not from writing",
    );
  }
}

/* ================================================================== */
/* Report                                                             */
/* ================================================================== */

const fails = findings.filter((f) => f.level === "FAIL");
const warns = findings.filter((f) => f.level === "WARN");
const notes = findings.filter((f) => f.level === "NOTE");

if (JSON_OUT) {
  console.log(JSON.stringify({ base: BASE, pages: pages.size, findings }, null, 2));
} else {
  const groupBy = (list) => {
    const g = new Map();
    for (const f of list) {
      if (!g.has(f.rule)) g.set(f.rule, []);
      g.get(f.rule).push(f);
    }
    return [...g.entries()].sort((a, b) => b[1].length - a[1].length);
  };

  const print = (label, list) => {
    if (list.length === 0) return;
    console.log(`\n${label} — ${list.length}:\n`);
    for (const [rule, items] of groupBy(list)) {
      console.log(`  ${rule} (${items.length})`);
      for (const f of items) {
        console.log(`    ${f.path}`);
        console.log(`      ${f.detail}`);
        console.log(`      → ${f.fix}`);
      }
      console.log("");
    }
  };

  console.log(`internal body links: ${bodyLinkCount}`);
  console.log(`register rows: ${REGISTER.length} for ${pages.size} pages`);

  print("FAILURES", fails);
  print("WARNINGS (do not block)", warns);
  print("NOTED, NO ACTION", notes);

  console.log(
    fails.length === 0
      ? `\nPASS — ${warns.length} warning(s), nothing blocking.`
      : `\nFAIL — ${fails.length} failure(s), ${warns.length} warning(s).`,
  );
}

/* exitCode, not process.exit(): the latter tears the process down before a
   large stdout write has flushed, which silently truncated the --json output. */
process.exitCode = fails.length === 0 ? 0 : 1;
