/* ============================================================
   BotMatch — the questions.

   THIS IS THE FILE YOU EDIT. To reskin the matcher for another
   category, change the array below: add a question, remove one,
   reword an option. Nothing else has to change.

   Ported from the CryptoWatchdog matcher funnel, with one
   important difference. There, the recommendation is written by
   a human after the fact, so the answers are just profile notes.
   Here, BotPlanet already has a deterministic scoring engine —
   so every question that CAN feed it does, via `scores`.

   `scores` maps an option to the scoring engine's own inputs
   (packages/scoring). A question with no `scores` is a profile
   question: recorded on the lead, used to write the email, and
   never allowed to influence which robot wins.
   ============================================================ */

/** The engine's answer keys. Mirrors PoolAnswers in packages/scoring. */
export interface ScoreFragment {
  environment?: "above_ground" | "in_ground";
  primary_need?: "floor_debris" | "full_clean" | "surface_debris";
  desired_cleans?: ("floor" | "walls" | "waterline" | "water_surface")[];
  power_pref?: "corded" | "cordless" | "solar" | "no_pref";
  budget_tier?: "budget" | "mid" | "premium" | "ultra" | "no_pref";
  pool_length_ft?: number | null;
}

export interface MatcherOption {
  /** Shown on the button. */
  label: string;
  /** Optional second line. */
  hint?: string;
  /** What this answer tells the scoring engine. Omit for profile-only. */
  scores?: ScoreFragment;
}

export interface MatcherQuestion {
  id: string;
  /** Small label above the question. */
  kicker: string;
  /** The question itself. */
  q: string;
  options: MatcherOption[];
}

export const MATCHER_QUESTIONS: MatcherQuestion[] = [
  {
    id: "environment",
    kicker: "Your pool",
    q: "What kind of pool do you have?",
    options: [
      { label: "In-ground", hint: "Built into the ground", scores: { environment: "in_ground" } },
      { label: "Above-ground", hint: "Sits on the surface", scores: { environment: "above_ground" } },
    ],
  },
  {
    id: "pool_length",
    kicker: "Your size",
    q: "Roughly how long is the pool at its longest?",
    options: [
      { label: "Under 20 ft", scores: { pool_length_ft: 20 } },
      { label: "20 – 32 ft", scores: { pool_length_ft: 32 } },
      { label: "33 – 45 ft", scores: { pool_length_ft: 45 } },
      { label: "Over 45 ft", scores: { pool_length_ft: 55 } },
      { label: "Not sure", hint: "We won't rule anything out", scores: { pool_length_ft: null } },
    ],
  },
  {
    id: "primary_need",
    kicker: "Your problem",
    q: "What are you mainly trying to fix?",
    options: [
      {
        label: "Everything — floor, walls and waterline",
        scores: { primary_need: "full_clean", desired_cleans: ["floor", "walls", "waterline"] },
      },
      {
        label: "Dirt settling on the floor",
        scores: { primary_need: "floor_debris", desired_cleans: ["floor"] },
      },
      {
        label: "Leaves floating on the surface",
        scores: { primary_need: "surface_debris", desired_cleans: ["water_surface"] },
      },
    ],
  },
  {
    id: "power_pref",
    kicker: "Your setup",
    q: "Corded or cordless?",
    options: [
      { label: "Cordless", hint: "Nothing trailing across the deck", scores: { power_pref: "cordless" } },
      { label: "Corded", hint: "Continuous power, longer cycles", scores: { power_pref: "corded" } },
      { label: "No preference", scores: { power_pref: "no_pref" } },
    ],
  },
  {
    id: "budget_tier",
    kicker: "Your budget",
    q: "Roughly what are you looking to spend?",
    options: [
      { label: "Under $500", scores: { budget_tier: "budget" } },
      { label: "$500 – $1,000", scores: { budget_tier: "mid" } },
      { label: "$1,000 – $2,000", scores: { budget_tier: "premium" } },
      { label: "Over $2,000", scores: { budget_tier: "ultra" } },
      { label: "Show me the range", scores: { budget_tier: "no_pref" } },
    ],
  },

  /* ---- profile questions: recorded, never scored ---- */
  {
    id: "debris_type",
    kicker: "Your debris",
    q: "What ends up in the pool most?",
    options: [
      { label: "Leaves and twigs" },
      { label: "Fine dirt and sand" },
      { label: "Algae on the walls" },
      { label: "A bit of everything" },
    ],
  },
  {
    id: "main_worry",
    kicker: "Your concern",
    q: "What worries you most about buying one?",
    options: [
      { label: "Paying too much" },
      { label: "It won't clean properly" },
      { label: "It'll break and I'm stuck" },
      { label: "Too complicated to set up" },
    ],
  },
  {
    id: "timeline",
    kicker: "Your timing",
    q: "When are you looking to buy?",
    options: [
      { label: "This week" },
      { label: "This month" },
      { label: "Before next season" },
      { label: "Just researching" },
    ],
  },
];

/** The "analysing" sequence. Every line names something we genuinely do. */
export const MATCHER_TASKS: string[] = [
  "Reading your pool profile",
  "Filtering to robots that fit your pool type",
  "Ruling out machines that can't finish your pool length",
  "Checking floor, wall and waterline coverage",
  "Comparing filtration against your debris",
  "Ranking on suitability — before any retailer is considered",
];

/** How long the analysing screen runs, in ms. */
export const ANALYSE_MS = 14000;

/**
 * Fold the chosen options into the scoring engine's answer shape.
 * Profile-only answers are ignored here by construction.
 */
export function toScoringAnswers(answers: Record<string, string>): ScoreFragment {
  const out: ScoreFragment = {};
  for (const q of MATCHER_QUESTIONS) {
    const chosen = answers[q.id];
    if (!chosen) continue;
    const opt = q.options.find((o) => o.label === chosen);
    if (!opt?.scores) continue;
    Object.assign(out, opt.scores);
  }
  return out;
}
