/**
 * "Then what should I buy instead?"
 *
 * A review that rules a machine out and stops there has done half a job. The
 * Nautilus review tells a reader three specific reasons this robot is wrong
 * for them — the waterline, a pool over 40 ft, wanting cordless — and then
 * leaves them to start their search again.
 *
 * This answers each of those from the catalogue rather than from an editor's
 * memory of the range, which is the only way the answer stays right when the
 * range changes.
 *
 * THE RULES IT WILL NOT BEND.
 *
 * Commission is not an input. This takes catalogue facts and nothing else —
 * no price, no offer, no margin. It is the same discipline the matcher runs
 * under, for the same reason: the moment "what earns most" can reach this
 * function, every answer it gives is suspect.
 *
 * A reason with no qualifying machine says so. Recommending the nearest thing
 * to a reader who told you exactly what they need is how a review becomes an
 * advert. "Nothing in our catalogue does this yet" is a real answer and the
 * honest one.
 *
 * It never recommends the product being reviewed.
 */
import type { RuleOut } from "../content/snapshots";

export interface AlternativeCandidate {
  id: string;
  slug: string;
  name: string;
  cleans: string[];
  powerType: string;
  maxPoolLengthFt: number | null;
}

export interface AlternativeMatch {
  /** The reader's reason, printed as written. */
  need: string;
  /** What satisfies it, or null when nothing in the catalogue does. */
  pick: { slug: string; name: string; because: string } | null;
}

function satisfies(c: AlternativeCandidate, test: RuleOut["test"]): string | null {
  switch (test.kind) {
    case "cleans":
      return c.cleans.some((x) => x.toLowerCase() === test.value.toLowerCase())
        ? `Cleans the ${test.value}`
        : null;

    case "maxLengthOver":
      // A machine with no published length is NOT a match. An unknown is not a
      // yes, and sending someone with a 50 ft pool to a robot whose limit
      // nobody has published is exactly the mis-sale this whole system exists
      // to prevent.
      return c.maxPoolLengthFt !== null && c.maxPoolLengthFt > test.feet
        ? `Rated to ${c.maxPoolLengthFt} ft`
        : null;

    case "power":
      return c.powerType.toLowerCase() === test.value.toLowerCase()
        ? `${test.value[0].toUpperCase()}${test.value.slice(1)}`
        : null;
  }
}

export function findAlternatives(
  ruleOuts: RuleOut[],
  candidates: AlternativeCandidate[],
  excludeSlug: string,
): AlternativeMatch[] {
  const pool = candidates.filter((c) => c.slug !== excludeSlug);

  /**
   * ONE PRODUCT ANSWERS ONE RULE-OUT, NOT SEVERAL.
   *
   * Each rule-out scanned the same pool from the top independently, so the
   * first machine that satisfied two different needs was printed twice in one
   * block — the BuBlue page listed the Beatbot for two separate reasons, and
   * the full-site sweep of 14 August 2026 found four pages doing it. A block
   * naming the same machine twice reads as a page with one idea, and it wastes
   * the slot that could have shown the reader something else.
   *
   * A rule-out with no unused answer renders nothing, which is the existing
   * behaviour for "nothing qualifies" and is the honest outcome.
   */
  const used = new Set<string>();

  return ruleOuts.map((r) => {
    for (const c of pool) {
      if (used.has(c.slug)) continue;
      const because = satisfies(c, r.test);
      if (because) {
        used.add(c.slug);
        return { need: r.need, pick: { slug: c.slug, name: c.name, because } };
      }
    }
    return { need: r.need, pick: null };
  });
}
