/**
 * The decision tables each guide carries, defined as tests over recorded specs.
 *
 * WHY THE TABLES LIVE HERE AND NOT IN THE GUIDE PAGES. A table written into a
 * page is a snapshot: it is right on the day it is typed and silently wrong the
 * first time a product joins the catalogue or a manufacturer revises a sheet.
 * These are defined as QUESTIONS, and answered from the reviews at render time,
 * so a new machine appears in every table it qualifies for without anyone
 * remembering to add it.
 *
 * WHAT IS DELIBERATELY ABSENT. There is no lawn-mower table here, and that is
 * the single biggest thing to know about this file.
 *
 * The brief asked for three: models by slope capability on the hills guide,
 * navigation technology on the wire-free guide, and a table on the cheap-mower
 * guide. None can be built honestly today:
 *
 *   – SLOPE CAPABILITY IS RECORDED NOWHERE. Not in D1, not in a review, not in
 *     the evidence pack. Every mower's gradient rating would have to be
 *     fetched, and a table asserting "this one climbs 45%" from anything less
 *     than the manufacturer's own sheet is exactly the invented figure this
 *     site refuses to publish.
 *   – NAVIGATION TECHNOLOGY IS RECORDED NOWHERE either. Which of the seven use
 *     RTK, which use vision and which use LiDAR is knowable and is not known
 *     to us in any checked form.
 *   – THERE ARE NO LAWN REVIEWS AT ALL. Zero of the seven. The brief asks each
 *     row to link its review; there is nothing to link but a product page
 *     carrying boilerplate metadata and no editorial.
 *
 * What the lawn catalogue does hold, verified, is a rated area per mower. That
 * is one honest column, not a decision table, and it is served by the existing
 * comparison page rather than by a table pretending to more.
 */
import {
  ABSENCE,
  buildRows,
  contains,
  feetOver,
  specValue,
  type DecisionRow,
} from "../lib/decision-tables";
import { REVIEWS } from "./reviews";

export interface GuideTable {
  id: string;
  title: string;
  intro: string;
  /** What the reader's column is called. */
  situationHeading: string;
  rows: DecisionRow[];
  /** Printed under the table, always. */
  note: string;
}

/* ============================================================
   POOL — are robotic pool cleaners worth it?
   Corded against cordless, by the situation the reader is in.
   ============================================================ */

const POOL_SURFACES = ["Surfaces"];
const POOL_POWER = ["Power type"];
const POOL_LENGTH = ["Max pool length", "Max pool size", "Max pool", "Coverage"];

export function poolCordedCordlessTable(): GuideTable {
  return {
    id: "which-machine",
    title: "Which kind answers your situation",
    situationHeading: "If this is you",
    intro:
      "Every machine below is placed by its own published specification, not by our opinion of it. " +
      "The test each row applied is printed beside it, so you can check the working rather than " +
      "take our word for it. A situation nothing in the catalogue answers says so.",
    rows: buildRows("robotic-pool-cleaners", [
      {
        situation: "The cable is the specific thing you hate",
        rule: "Power type recorded as cordless",
        test: contains(POOL_POWER, "cordless"),
      },
      {
        situation: "You never want to think about charging",
        rule: "Power type recorded as corded",
        test: contains(POOL_POWER, "corded"),
      },
      {
        situation: "The ring of scum at the surface is your actual complaint",
        rule: "Surfaces include the waterline",
        test: contains(POOL_SURFACES, "waterline"),
      },
      {
        situation: "Your pool is 50 ft or longer",
        rule: "A published length of 50 ft or more. No published length is not a pass.",
        test: feetOver(POOL_LENGTH, 50),
      },
      {
        situation: "You have steps or a sun ledge",
        rule: "Surfaces name steps",
        test: contains(POOL_SURFACES, "step"),
      },
      {
        situation: "You only need the floor doing",
        rule: "Surfaces recorded, and floor-only",
        test: (r) => {
          const v = specValue(r, POOL_SURFACES);
          if (!v) return null;
          const s = v.toLowerCase();
          const onlyFloor =
            s.includes("floor") && !s.includes("wall") && !s.includes("waterline");
          return onlyFloor ? v : null;
        },
      },
    ]),
    note:
      "Ordered alphabetically inside each row, never by price and never by what we earn. " +
      "Where a manufacturer publishes no figure for the test, that machine is absent from the " +
      "row rather than assumed to pass.",
  };
}

/* ============================================================
   WINDOW — do window cleaning robots work?
   Which robot by glass type, which is the question that rules
   machines out before any other specification.
   ============================================================ */

const GLASS = ["Glass types"];

export function windowGlassTable(): GuideTable {
  return {
    id: "by-glass-type",
    title: "Which robot suits your glass",
    situationHeading: "Your glass",
    intro:
      "Glass type rules machines out before anything else does: a robot that navigates by feeling " +
      "for a frame will drive off the edge of a frameless pane. Each row below is decided by what " +
      "the maker publishes about glass, and nothing else.",
    rows: buildRows("window-cleaning-robots", [
      {
        situation: "Frameless glass — no frame for it to feel for",
        rule: "Glass types explicitly name frameless",
        test: contains(GLASS, "frameless"),
      },
      {
        /* NOT "framed only" — most of these do framed AND frameless, and a
           label implying otherwise would send a frameless owner past machines
           that suit them. */
        situation: "Framed windows",
        rule: "Glass types recorded, and they name framed",
        test: contains(GLASS, "framed"),
      },
      {
        situation: "Sloped or angled glass — a conservatory roof, a skylight",
        rule: "Glass types explicitly name sloped",
        test: contains(GLASS, "sloped"),
      },
      {
        situation: "You need to know before you buy, and the maker will not say",
        rule: "No glass type published at all",
        /* Marked as an absence: this string is our record of a silence, not a
           figure ECOVACS published, and the table renders it differently. */
        test: (r) => (specValue(r, GLASS) ? null : `${ABSENCE}No glass type published`),
      },
    ]),
    note:
      "The last row is not a fault in those machines — it is a gap in what their makers publish, " +
      "and on frameless glass that silence is the answer. Where a maker does not claim frameless, " +
      "we do not claim it for them.",
  };
}

/* ============================================================
   WINDOW HUB — the WINBOT ladder.

   SIX, NOT FIVE. The brief said five WINBOTs differ; the catalogue
   holds six — Mini, W1 PRO, W2 PRO, W2 PRO Omni, W2S and W3 Omni.
   All six are in the table, because a ladder missing a rung sends
   the reader to a comparison that does not include the machine
   they were looking at.
   ============================================================ */

export interface LadderEntry {
  slug: string;
  name: string;
  href: string;
  /** Recorded facts that separate this one from its siblings. */
  separators: { label: string; value: string }[];
}

const LADDER_SEPARATORS: { label: string; match: string[] }[] = [
  { label: "Glass types", match: ["Glass types"] },
  { label: "Suction", match: ["Maximum suction", "Maximum", "Moving suction", "Moving"] },
  { label: "Power-off hold", match: ["Power-off hold"] },
  { label: "Water tank", match: ["Water tank", "Water tanks", "Tank", "Tank capacity"] },
  { label: "Navigation", match: ["Navigation"] },
  { label: "Station", match: ["Station"] },
];

export function winbotLadder(): LadderEntry[] {
  return Object.values(REVIEWS)
    .filter((r) => r.categorySlug === "window-cleaning-robots" && /winbot/i.test(r.slug))
    .map((r) => ({
      slug: r.slug,
      name: r.title.replace(/\s+review$/i, "").trim(),
      href: `/robots/${r.categorySlug}/${r.slug}/`,
      separators: LADDER_SEPARATORS.map((s) => ({
        label: s.label,
        value: specValue(r, s.match) ?? "Not published",
      })),
    }))
    /* Named order, not catalogue order: the reader is climbing a range and
       expects Mini before W3. Sorted on the model token in the slug. */
    .sort((a, b) => a.slug.localeCompare(b.slug));
}

/* ============================================================
   COMPANION HUB — capability table.

   THE BLANKS ARE THE POINT. The brief asked for speaks / responds
   to touch / needs app / works offline. Those four are recorded on
   SOME of the nine and not others, because the makers publish
   wildly different sheets — Casio states Moflin's speech and touch
   sensing outright, Anki states none of it for Vector.

   Printing "Not published" where a maker is silent is the honest
   rendering and is genuinely useful: it shows a buyer which
   companies will tell you what their robot does before you own it.
   Inferring "no" from silence would be inventing a fact, and
   inferring "yes" would be worse.
   ============================================================ */

export interface CapabilityRow {
  slug: string;
  name: string;
  href: string;
  cells: { label: string; value: string; published: boolean }[];
}

/**
 * A GENERIC LABEL NEEDS THE VALUE CHECKED, NOT JUST THE LABEL MATCHED.
 *
 * The first draft of this table filled "Responds to touch" from any row called
 * "Sensors" — which printed Miko's "Time-of-flight range, odometric" and EMO's
 * "More than 10 internal sensors" under a heading claiming touch. Neither says
 * anything about touch. It also filled "Works offline" from Vector's "Wi-Fi:
 * 2.4 GHz only", which is a statement about radio bands.
 *
 * So a source whose LABEL is unambiguous (Speech, Wake word, Offline
 * operation) fills the cell on its own; a source whose label is generic
 * (Sensors, Wi-Fi, Connection) fills it only when the recorded VALUE actually
 * addresses the capability. Anything else is a true sentence placed under a
 * heading that makes it false.
 */
const CAPABILITIES: {
  label: string;
  sources: { match: string[]; requires?: RegExp }[];
}[] = [
  {
    label: "Speaks",
    sources: [
      /* Languages before wake word: "8 — English, Spanish…" answers "does it
         speak" far better than "Hey Miko" does. */
      { match: ["Speech", "Languages", "Voice", "Wake word"] },
    ],
  },
  {
    label: "Responds to touch",
    sources: [
      { match: ["Touch"] },
      { match: ["Sensors"], requires: /touch|tactile|pat|stroke/i },
    ],
  },
  {
    label: "App",
    sources: [
      { match: ["App"] },
      { match: ["Setup"], requires: /app/i },
    ],
  },
  {
    label: "Works offline",
    sources: [
      /* "Account required" is DELIBERATELY NOT HERE. Eilik records it as "No",
         which under a heading reading "Works offline" prints the exact
         opposite of what the maker said — a needing-no-account robot rendered
         as one that does not work offline. An adjacent fact is not the same
         fact, and a cell that can invert its own source is worse than blank. */
      { match: ["Offline operation"] },
      { match: ["Connection", "Wi-Fi"], requires: /offline|required|without/i },
    ],
  },
  {
    label: "Subscription",
    sources: [{ match: ["Subscription", "Monthly", "Ongoing cost"] }],
  },
];

export function companionCapabilities(): CapabilityRow[] {
  return Object.values(REVIEWS)
    .filter((r) => r.categorySlug === "companion-robots")
    .map((r) => ({
      slug: r.slug,
      name: r.title.replace(/\s+review$/i, "").trim(),
      href: `/robots/${r.categorySlug}/${r.slug}/`,
      cells: CAPABILITIES.map((c) => {
        let v: string | null = null;
        for (const src of c.sources) {
          const candidate = specValue(r, src.match);
          if (candidate && (!src.requires || src.requires.test(candidate))) {
            v = candidate;
            break;
          }
        }
        return { label: c.label, value: v ?? "Not published", published: v !== null };
      }),
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
}
