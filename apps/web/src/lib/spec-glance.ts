/**
 * Resolve a review's glance rows out of its own specification table.
 *
 * The whole of this module's honesty rests on one property: it can only ever
 * return a `value` string that was already present in `groups`. There is no
 * formatting, no unit conversion, no rounding and no "about". A figure that
 * reads "56 ft / 17.1 m" in the full table reads "56 ft / 17.1 m" here, and if
 * that is wrong it is wrong in one place.
 *
 * A row's `note` travels with it. Notes on this site carry regional SKU
 * conflicts — the same field reading differently on the US and global variants
 * — and dropping the caveat while keeping the number is the one transformation
 * that could turn a correct table into an incorrect box.
 */
import type { SpecGroup, SpecRow } from "../components/SpecTable.astro";
import { glanceFieldsFor } from "../content/spec-glance";

export interface GlanceRow {
  label: string;
  value: string;
  note?: string;
}

export interface Glance {
  rows: GlanceRow[];
  /** How many of this category's glance fields the maker does not publish. */
  missing: number;
  /** Every glance field for the category, filled or not. */
  total: number;
  /** False when too little resolved to be worth a box. */
  worthShowing: boolean;
}

/**
 * BELOW THIS, A GLANCE BOX IS WORSE THAN NO BOX.
 *
 * Two cells under the heading "The specification at a glance" reads as a
 * broken component rather than as a short answer, and it invites the reader to
 * conclude we know almost nothing about the machine — when in fact the full
 * table below may run to thirty rows the box simply has no slot for.
 *
 * Three reviews legitimately resolve nothing at all: Cozmo, Moxie and EMO are
 * RULE-OUT reviews whose specification tables record a company's collapse and
 * a counterfeit listing rather than a product's dimensions. There is no
 * specification to glance at, and inventing slots so the box could appear
 * would be furniture standing in for a fact. They render no box, correctly.
 */
export const MIN_GLANCE_ROWS = 3;

const norm = (s: string) => s.trim().toLowerCase();

/**
 * Flattened once, in document order, so that when two groups both carry a
 * label the earlier one wins — the reviews put the headline group first.
 */
function flatten(groups: SpecGroup[]): SpecRow[] {
  return groups.flatMap((g) => g.rows);
}

/** Values that state an absence rather than a figure. */
const isAbsence = (value: string): boolean =>
  /^(not published|not disclosed|not stated|unpublished|none published|no figure published)\.?$/i.test(
    value.trim(),
  );

export function buildGlance(categorySlug: string, groups: SpecGroup[]): Glance {
  const fields = glanceFieldsFor(categorySlug);
  const rows = flatten(groups);
  const out: GlanceRow[] = [];

  for (const field of fields) {
    let hit: SpecRow | undefined;
    /* Preference order is the ALIAS order, not the document order: "Max pool
       length" is a better answer than "Coverage" even when Coverage appears
       first, because it is the figure the reader is comparing against. */
    for (const alias of field.match) {
      hit = rows.find((r) => norm(r.label) === norm(alias) && r.value !== null && r.value !== "");
      if (hit) break;
    }
    /* A ROW SAYING "Not published" IS A MISSING FIGURE, NOT A PRESENT ONE.
       The counter read "1 of 5 fields here is not published" on the W2S while
       four of its spec rows said exactly that — a wrong number on the page
       whose entire theme is missing numbers. Absence took two shapes and this
       only recognised one: no row at all, and a row whose value IS the
       absence. Both are the maker not publishing it. */
    if (!hit || hit.value === null || isAbsence(hit.value)) continue;
    out.push({ label: field.label, value: hit.value, ...(hit.note ? { note: hit.note } : {}) });
  }

  return {
    rows: out,
    missing: fields.length - out.length,
    total: fields.length,
    worthShowing: out.length >= MIN_GLANCE_ROWS,
  };
}
