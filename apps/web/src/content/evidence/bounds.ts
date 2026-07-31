/**
 * Bounds and point values.
 *
 * A manufacturer often states the same fact twice in two shapes: a bound
 * ("charges in under 5 hours") and a figure ("charges in only 4 hours"). Those
 * are not two rival answers. The figure satisfies the bound, and the figure is
 * the more useful of the two, so treating them as a conflict would suppress a
 * field over a disagreement that does not exist.
 *
 * The compatibility is not taken on trust. An observation may be DECLARED a
 * supporting bound, but this module then checks that the published figure
 * actually falls inside it. If the numbers cannot be parsed, or the figure
 * exceeds the bound, the declaration fails and the field returns to being a
 * real conflict — the fail-closed direction, because the alternative is a
 * label that quietly launders a contradiction.
 */

const HOURS = 60;

/** Every duration a string mentions, in minutes. */
export function durationsInMinutes(text: string): number[] {
  const s = String(text).toLowerCase();
  const out: number[] = [];

  // Compound "2h 30" / "1h30" — matched first so the hour part is not also
  // read as a standalone figure.
  const compound = /(\d+)\s*h\s*(\d{1,2})\b/g;
  const consumed: [number, number][] = [];
  for (const m of s.matchAll(compound)) {
    out.push(Number(m[1]) * HOURS + Number(m[2]));
    consumed.push([m.index!, m.index! + m[0].length]);
  }
  const inCompound = (i: number) => consumed.some(([a, b]) => i >= a && i < b);

  for (const m of s.matchAll(/(\d+(?:\.\d+)?)\s*(hours?|hrs?|h|minutes?|mins?|m)\b/g)) {
    if (inCompound(m.index!)) continue;
    const n = Number(m[1]);
    const unit = m[2];
    out.push(/^(h|hr|hrs|hour|hours)$/.test(unit) ? n * HOURS : n);
  }
  return out;
}

/** The upper limit a bounding phrase expresses, in minutes. */
export function upperBoundMinutes(text: string): number | null {
  const s = String(text).toLowerCase();
  if (!/\b(under|less than|below|up to|no more than|within)\b/.test(s)) return null;
  const found = durationsInMinutes(s);
  return found.length ? Math.max(...found) : null;
}

/**
 * True when `value` is a figure that falls inside `bound`.
 *
 * The longest duration in the value is the one tested: a runtime stated per
 * mode ("Floor and walls (2h 30); Floor Only (1h 30)") satisfies "up to 2.5
 * hours" only if its LONGEST mode does, which is the claim a reader takes from
 * the bound.
 */
export function satisfiesBound(bound: string | number, value: string | number): boolean {
  const limit = upperBoundMinutes(String(bound));
  if (limit === null) return false;
  const found = durationsInMinutes(String(value));
  if (!found.length) return false;
  return Math.max(...found) <= limit;
}
