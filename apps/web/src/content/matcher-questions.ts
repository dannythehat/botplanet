/* ============================================================
   BotMatch — the questions.

   THE RULE, and it is not negotiable:

     EVERY CATEGORY HAS ITS OWN QUESTION SET. They are independent
     of one another. A question set is never shared, reused,
     defaulted to, or "close enough" borrowed from another
     category.

   This file held ONE array until 6 August 2026, and that array
   was the pool one. Window went live on 5 August pointing at it,
   which meant a reader who wanted to clean their windows was
   asked whether their pool was in-ground and how many feet long
   it was. It was live for a day. Nothing flagged it, because
   nothing could: there was no second set to be inconsistent with.

   So the shape below is a map keyed by category slug, and a
   category with no entry gets NO questionnaire rather than
   somebody else's. See questionsFor() — it returns null, and the
   BotMatch page refuses to render a funnel instead of rendering
   the wrong one.

   Ported originally from the CryptoWatchdog matcher funnel, with
   one important difference. There, the recommendation is written
   by a human after the fact, so answers are just profile notes.
   Here, BotPlanet has a deterministic scoring engine — so every
   question that CAN feed it does, via `scores`.

   `scores` maps an option to the scoring engine's own inputs
   (packages/scoring). A question with no `scores` is a profile
   question: recorded on the lead, used to write the email, and
   never allowed to influence which robot wins.
   ============================================================ */

import type { CleaningSurface, Environment, PowerType } from "@botplanet/shared";

/** The engine's answer keys. Mirrors MatchAnswers in packages/scoring. */
export interface ScoreFragment {
  environment?: Environment;
  /** A key into the category's scoring config classEligibility.byPrimaryNeed. */
  primary_need?: string;
  desired_cleans?: CleaningSurface[];
  power_pref?: PowerType | "no_pref";
  budget_tier?: "budget" | "mid" | "premium" | "ultra" | "no_pref";
  pool_length_ft?: number | null;
  pool_area_sqft?: number | null;
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

/* ============================================================
   Pool — robotic pool cleaners
   ============================================================ */

const POOL_QUESTIONS: MatcherQuestion[] = [
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

/* ============================================================
   Window-cleaning robots

   The deciding questions come from the category research
   (docs/seo/window-cleaning-robots-research-findings.md): the
   frame is what rules a machine out, the height is what makes it
   worth owning, and the socket is what the flagship price buys.
   ============================================================ */

const WINDOW_QUESTIONS: MatcherQuestion[] = [
  {
    id: "environment",
    kicker: "Your glass",
    q: "Are your windows framed or frameless?",
    options: [
      {
        label: "Framed",
        hint: "A visible frame around each pane",
        scores: { environment: "framed_glass" },
      },
      {
        label: "Frameless",
        hint: "Glass walls, sliding doors, balustrades",
        scores: { environment: "frameless_glass" },
      },
    ],
  },
  {
    id: "primary_need",
    kicker: "Your windows",
    q: "Which glass are you actually trying to reach?",
    options: [
      {
        label: "Outside, above ground level",
        hint: "The windows you should not be on a ladder for",
        scores: { primary_need: "exterior_glass", desired_cleans: ["glass_exterior"] },
      },
      {
        label: "Inside only",
        hint: "Patio doors, room dividers, big indoor panes",
        scores: { primary_need: "interior_glass", desired_cleans: ["glass_interior"] },
      },
      {
        label: "Sloped glass",
        hint: "Conservatory roof, skylights, angled glazing",
        scores: { primary_need: "sloped_glass", desired_cleans: ["glass_sloped"] },
      },
      {
        label: "All of it",
        scores: { primary_need: "all_glass", desired_cleans: ["glass_interior", "glass_exterior"] },
      },
    ],
  },
  {
    id: "power_pref",
    kicker: "Your setup",
    q: "Is there a power socket near the windows?",
    options: [
      {
        label: "Yes, near enough",
        hint: "A mains cable is fine",
        scores: { power_pref: "corded" },
      },
      {
        label: "No — stairwell, landing, awkward spot",
        hint: "You need a portable battery station",
        scores: { power_pref: "cordless" },
      },
      { label: "Not sure", scores: { power_pref: "no_pref" } },
    ],
  },
  {
    id: "budget_tier",
    kicker: "Your budget",
    q: "Roughly what are you looking to spend?",
    options: [
      { label: "Under $200", scores: { budget_tier: "budget" } },
      { label: "$200 – $350", scores: { budget_tier: "mid" } },
      { label: "$350 – $500", scores: { budget_tier: "premium" } },
      { label: "Over $500", scores: { budget_tier: "ultra" } },
      { label: "Show me the range", scores: { budget_tier: "no_pref" } },
    ],
  },

  /* ---- profile questions: recorded, never scored ---- */
  {
    id: "window_height",
    kicker: "Your height",
    q: "How high up are the windows that matter?",
    options: [
      { label: "Ground floor" },
      { label: "First or second floor" },
      { label: "Higher than that" },
      { label: "A mix" },
    ],
  },
  {
    id: "soil_type",
    kicker: "Your glass",
    q: "What is actually on the windows?",
    options: [
      { label: "Rain spots and hard-water marks" },
      { label: "Dust and pollen film" },
      { label: "Greasy marks and fingerprints" },
      { label: "A bit of everything" },
    ],
  },
  {
    id: "main_worry",
    kicker: "Your concern",
    q: "What worries you most about buying one?",
    options: [
      { label: "It'll fall off the glass" },
      { label: "It'll leave streaks" },
      { label: "Paying too much" },
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
      { label: "Before spring cleaning" },
      { label: "Just researching" },
    ],
  },
];

/* ============================================================
   Robotic lawn mowers

   Order matters here and it is not the order a listing would
   use. The research (docs/seo/robotic-lawn-mowers-research-
   findings.md §7) put these in order of how much each one
   narrows the field: area first because it is the hardest
   constraint, then overhead cover because it silently rules out
   every satellite-navigated machine, then the shape of the
   ground.

   Overhead cover has almost no search volume behind it and is
   the single most likely reason a lawn purchase disappoints.
   BotMatch asks what decides the purchase, not what gets
   searched.

   Power is deliberately not asked. Every robot mower runs on a
   battery, so the question has no discriminating value — the
   lawn scoring config gives it zero weight and the default below
   keeps the engine's power factor neutral rather than zeroing
   every candidate.
   ============================================================ */

const LAWN_QUESTIONS: MatcherQuestion[] = [
  {
    id: "lawn_size",
    kicker: "Your lawn",
    q: "Roughly how much grass is there in total?",
    options: [
      { label: "A small yard", hint: "Under about 1/8 acre", scores: { pool_area_sqft: 5000 } },
      { label: "1/8 to 1/4 acre", scores: { pool_area_sqft: 11000 } },
      { label: "1/4 to 1/2 acre", scores: { pool_area_sqft: 22000 } },
      { label: "1/2 acre to an acre", scores: { pool_area_sqft: 43560 } },
      { label: "More than an acre", scores: { pool_area_sqft: 87120 } },
      { label: "Not sure", hint: "We won't rule anything out", scores: { pool_area_sqft: null } },
    ],
  },
  {
    id: "environment",
    kicker: "Your sky",
    q: "Is the lawn open overhead, or under trees?",
    options: [
      {
        label: "Open sky",
        hint: "Little or no canopy over the grass",
        scores: { environment: "open_sky" },
      },
      {
        label: "Under trees or beside a tall building",
        hint: "Rules out satellite navigation — this matters more than it sounds",
        scores: { environment: "tree_cover" },
      },
    ],
  },
  {
    id: "primary_need",
    kicker: "Your ground",
    q: "What does the machine have to deal with?",
    options: [
      {
        label: "One flat lawn",
        hint: "Level, all in one piece",
        scores: { primary_need: "flat_lawn", desired_cleans: ["grass_flat"] },
      },
      {
        label: "Real slopes or banks",
        scores: { primary_need: "slopes", desired_cleans: ["grass_flat", "grass_slopes"] },
      },
      {
        label: "Separate lawns — front and back",
        hint: "Split by a path, a drive or a gate",
        scores: { primary_need: "multi_zone", desired_cleans: ["grass_flat", "grass_zones"] },
      },
      {
        label: "Both — slopes and separate lawns",
        scores: {
          primary_need: "slopes_and_zones",
          desired_cleans: ["grass_flat", "grass_slopes", "grass_zones"],
        },
      },
    ],
  },
  {
    id: "budget_tier",
    kicker: "Your budget",
    q: "Roughly what are you looking to spend?",
    options: [
      { label: "Under $800", scores: { budget_tier: "budget" } },
      { label: "$800 – $1,500", scores: { budget_tier: "mid" } },
      { label: "$1,500 – $2,500", scores: { budget_tier: "premium" } },
      { label: "Over $2,500", scores: { budget_tier: "ultra" } },
      { label: "Show me the range", scores: { budget_tier: "no_pref" } },
    ],
  },

  /* ---- profile questions: recorded, never scored ---- */
  {
    id: "boundary_pref",
    kicker: "Your setup",
    q: "Would you lay a boundary wire around the lawn?",
    options: [
      { label: "Happy to — it's cheaper" },
      { label: "I'd rather not" },
      { label: "Absolutely not" },
      { label: "No idea what that means" },
    ],
  },
  {
    id: "main_worry",
    kicker: "Your concern",
    q: "What worries you most about buying one?",
    options: [
      { label: "It won't cut properly" },
      { label: "It'll get stuck or stranded" },
      { label: "Someone will steal it" },
      { label: "Paying too much" },
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

/* ============================================================
   Companion robots

   Ordered by how much each question narrows the field, which
   here is not the order a spec sheet would use.

   WHO IT IS FOR comes first and it is doing most of the work.
   An adult's desk companion, a child's learning robot and a
   machine for someone living with dementia are three different
   products with almost no overlap, and getting this wrong is the
   expensive mistake in the category.

   SUBSCRIPTION comes second, ahead of budget, and that is
   deliberate. It has barely any search volume — "companion robot
   subscription fee" returned no data at all — but Google's own
   People Also Ask surfaces the subscription question on THREE
   separate products in this category. It is what buyers are
   actually afraid of, and BotMatch asks what decides the
   purchase rather than what gets searched.

   Environment is NOT asked. Nothing about a room rules out a
   robot pet, so rather than invent a distinction to fill the
   field, the companion scoring config turns the environment
   exclusion off. Power is not asked either — every machine here
   charges from a dock or a cable and the axis cannot
   discriminate, so MATCHER_DEFAULTS keeps it neutral.
   ============================================================ */

const COMPANION_QUESTIONS: MatcherQuestion[] = [
  {
    id: "primary_need",
    kicker: "Who it's for",
    q: "Who is going to live with it?",
    options: [
      {
        label: "Me, or another adult",
        hint: "Company at a desk or around the house",
        scores: { primary_need: "adult_company", desired_cleans: ["companionship", "conversation"] },
      },
      {
        label: "A child",
        hint: "Roughly five to ten",
        scores: { primary_need: "child", desired_cleans: ["play_interaction", "learning_content"] },
      },
      {
        label: "An older relative",
        hint: "Living alone, or living with dementia",
        scores: { primary_need: "older_adult", desired_cleans: ["companionship", "play_interaction"] },
      },
      {
        label: "A whole household",
        hint: "Something everyone interacts with",
        scores: {
          primary_need: "household",
          desired_cleans: ["companionship", "conversation", "play_interaction"],
        },
      },
    ],
  },
  {
    id: "subscription_tolerance",
    kicker: "Ongoing cost",
    q: "Are you willing to pay a monthly fee to keep it talking?",
    options: [
      { label: "No — one payment only", hint: "Rules out most conversational machines" },
      { label: "A small one, if it earns it" },
      { label: "Yes, if the conversation is genuinely good" },
      { label: "I didn't know that was a thing" },
    ],
  },
  {
    id: "movement",
    kicker: "How it behaves",
    q: "Should it stay put, or move around?",
    options: [
      {
        label: "Stays on a desk or table",
        hint: "Expressive, reacts to you, nothing underfoot",
        scores: { desired_cleans: ["companionship", "conversation"] },
      },
      {
        label: "Moves around the room",
        hint: "Behaves more like an animal — and costs more",
        scores: { desired_cleans: ["companionship", "play_interaction"] },
      },
      { label: "Don't mind either way" },
    ],
  },
  {
    id: "talking",
    kicker: "Conversation",
    q: "How much should it actually talk?",
    options: [
      {
        label: "Proper conversation",
        hint: "Answers questions, holds a thread",
        scores: { desired_cleans: ["conversation"] },
      },
      {
        label: "Sounds and reactions are enough",
        hint: "No speech — often the more durable choice",
        scores: { desired_cleans: ["companionship"] },
      },
      { label: "Somewhere in between" },
    ],
  },
  {
    id: "budget_tier",
    kicker: "Your budget",
    q: "Roughly what are you looking to spend?",
    options: [
      { label: "Under $150", scores: { budget_tier: "budget" } },
      { label: "$150 – $400", scores: { budget_tier: "mid" } },
      { label: "$400 – $1,000", scores: { budget_tier: "premium" } },
      { label: "Over $1,000", scores: { budget_tier: "ultra" } },
      { label: "Show me the range", scores: { budget_tier: "no_pref" } },
    ],
  },

  /* ---- profile questions: recorded, never scored ---- */
  {
    id: "main_worry",
    kicker: "Your concern",
    q: "What worries you most about buying one?",
    options: [
      { label: "It'll be boring after a fortnight" },
      { label: "The company will shut down" },
      { label: "The monthly fees" },
      { label: "What it's listening to" },
    ],
  },
  {
    id: "timeline",
    kicker: "Your timing",
    q: "When are you looking to buy?",
    options: [
      { label: "This week" },
      { label: "This month" },
      { label: "It's a present, for later" },
      { label: "Just researching" },
    ],
  },
];

/* ============================================================
   Pet camera robots

   A separate set from companion robots because they are a
   separate category — measured, not assumed: the two head SERPs
   share only Amazon, Reddit and YouTube.

   STAIRS is asked second and it is the only hard exclusion in
   the category. Every one of these machines is wheeled and none
   of them climbs, so a household where the pet lives upstairs
   and the dock lives downstairs is a household where the product
   does not work. That is the frameless-glass of this category:
   absolute, cheap to ask about, and the most common reason one
   of these disappoints.

   Power is not asked — they all charge from a dock — so
   MATCHER_DEFAULTS keeps the engine's power factor neutral
   rather than scoring it zero for every candidate.
   ============================================================ */

const PET_CAMERA_QUESTIONS: MatcherQuestion[] = [
  {
    id: "primary_need",
    kicker: "What you need",
    q: "What are you mainly trying to do?",
    options: [
      {
        label: "Check on a dog while I'm out",
        scores: { primary_need: "watch_dog", desired_cleans: ["remote_video", "roams_home"] },
      },
      {
        label: "Check on a cat",
        scores: { primary_need: "watch_cat", desired_cleans: ["remote_video", "roams_home"] },
      },
      {
        label: "Talk to them and give treats",
        hint: "Interaction, not just watching",
        scores: {
          primary_need: "interact",
          desired_cleans: ["remote_video", "two_way_audio", "treat_dispensing"],
        },
      },
      {
        label: "Look around the house generally",
        scores: { primary_need: "watch_home", desired_cleans: ["remote_video", "roams_home"] },
      },
    ],
  },
  {
    id: "environment",
    kicker: "Your layout",
    q: "Is there a staircase between the rooms that matter?",
    options: [
      {
        label: "No — one level",
        hint: "Or one level is all I need covered",
        scores: { environment: "single_storey" },
      },
      {
        label: "Yes — they follow me up and down",
        hint: "None of these climb. We'll say so rather than sell you one.",
        scores: { environment: "multi_storey" },
      },
    ],
  },
  {
    id: "flooring",
    kicker: "Your floors",
    q: "What is underfoot in most of the rooms it would cover?",
    options: [
      { label: "Hard floors", hint: "Wood, tile, laminate" },
      { label: "Low carpet or rugs" },
      { label: "Thick carpet throughout", hint: "Small wheels struggle badly here" },
      { label: "A mix" },
    ],
  },
  {
    id: "autonomy",
    kicker: "How it works",
    q: "Should it patrol on its own, or would you drive it?",
    options: [
      {
        label: "Patrol and follow on its own",
        hint: "Works when you're not watching — costs more",
        scores: { desired_cleans: ["roams_home", "remote_video"] },
      },
      {
        label: "I'll drive it from my phone",
        hint: "Cheaper, and fine if you check in a couple of times a day",
        scores: { desired_cleans: ["remote_video", "two_way_audio"] },
      },
      { label: "Not sure yet" },
    ],
  },
  {
    id: "budget_tier",
    kicker: "Your budget",
    q: "Roughly what are you looking to spend?",
    options: [
      { label: "Under $150", scores: { budget_tier: "budget" } },
      { label: "$150 – $300", scores: { budget_tier: "mid" } },
      { label: "$300 – $600", scores: { budget_tier: "premium" } },
      { label: "Over $600", scores: { budget_tier: "ultra" } },
      { label: "Show me the range", scores: { budget_tier: "no_pref" } },
    ],
  },

  /* ---- profile questions: recorded, never scored ---- */
  {
    id: "recording_pref",
    kicker: "Recordings",
    q: "Do you need it to record, or is live viewing enough?",
    options: [
      { label: "Live viewing is enough" },
      { label: "I want recordings, without a monthly fee" },
      { label: "Happy to pay for cloud recording" },
      { label: "Not sure" },
    ],
  },
  {
    id: "main_worry",
    kicker: "Your concern",
    q: "What worries you most about buying one?",
    options: [
      { label: "It'll get stuck and I'll come home to a dead robot" },
      { label: "My pet will be frightened of it" },
      { label: "Security — it's a camera on the internet" },
      { label: "Paying too much for a novelty" },
    ],
  },
];

/* ============================================================
   The registry
   ============================================================ */

/**
 * Question sets by category slug. Independent by rule — see the header.
 *
 * A category absent from this map has no BotMatch. That is the correct
 * outcome, not a gap to paper over with another category's questions.
 */
/* @extension-point per-category | required | BotMatch returns 404 for the
   category. That is deliberate and must stay that way: a category never
   inherits another category's questions. MATCHER_TASKS_BY_CATEGORY and
   MATCHER_DEFAULTS in this file are keyed the same way. */
export const MATCHER_QUESTIONS_BY_CATEGORY: Record<string, MatcherQuestion[]> = {
  "robotic-pool-cleaners": POOL_QUESTIONS,
  "window-cleaning-robots": WINDOW_QUESTIONS,
  "robotic-lawn-mowers": LAWN_QUESTIONS,
  "companion-robots": COMPANION_QUESTIONS,
  "pet-camera-robots": PET_CAMERA_QUESTIONS,
};

/**
 * Answer values a category takes as read, folded in before the reader's own.
 *
 * Only for axes a category deliberately does not ask about. Lawn does not ask
 * corded-or-cordless because every robot mower is battery-powered, and without
 * a default the engine would compare every candidate against `undefined` and
 * score the power factor zero for all of them — a silent, uniform penalty that
 * looks like nothing at all.
 */
export const MATCHER_DEFAULTS: Record<string, ScoreFragment> = {
  "robotic-lawn-mowers": { power_pref: "no_pref", pool_length_ft: null },
  /* Neither companion category asks about power — every machine in both
     charges from a dock or a cable, so the axis cannot discriminate. Without a
     default the engine would compare every candidate against `undefined` and
     score them all zero on power: a silent, uniform penalty that looks like
     nothing at all. The size fields are nulled for the same reason — there is
     no "how big is your robot pet" question and there should not be. */
  "companion-robots": { power_pref: "no_pref", pool_length_ft: null, pool_area_sqft: null },
  "pet-camera-robots": { power_pref: "no_pref", pool_length_ft: null, pool_area_sqft: null },
};

/**
 * The "analysing" sequence, per category. Every line names something we
 * genuinely do — no line may describe a step the engine does not take.
 */
export const MATCHER_TASKS_BY_CATEGORY: Record<string, string[]> = {
  "robotic-pool-cleaners": [
    "Reading your pool profile",
    "Filtering to robots that fit your pool type",
    "Ruling out machines that can't finish your pool length",
    "Checking floor, wall and waterline coverage",
    "Comparing filtration against your debris",
    "Ranking on suitability — before any retailer is considered",
  ],
  "window-cleaning-robots": [
    "Reading your glass profile",
    "Ruling out machines that need a frame to find an edge",
    "Checking interior, exterior and sloped-glass coverage",
    "Matching mains or portable-station power to your setup",
    "Weighing what each one costs against your budget",
    "Ranking on suitability — before any retailer is considered",
  ],
  "robotic-lawn-mowers": [
    "Reading your lawn profile",
    "Ruling out machines rated for less ground than you have",
    "Checking whether satellite navigation works in your garden",
    "Matching slope and separate-zone handling to your ground",
    "Weighing what each one costs against your budget",
    "Ranking on suitability — before any retailer is considered",
  ],
  "companion-robots": [
    "Reading who this is actually for",
    "Ruling out machines built for a different age group",
    "Checking which ones still work without a monthly fee",
    "Matching movement and conversation to what you asked for",
    "Weighing what each one costs against your budget",
    "Ranking on suitability — before any retailer is considered",
  ],
  "pet-camera-robots": [
    "Reading your home's layout",
    "Ruling out wheeled machines where there are stairs to climb",
    "Checking which ones cope with what is on your floors",
    "Matching patrol, audio and treat handling to what you need",
    "Weighing what each one costs against your budget",
    "Ranking on suitability — before any retailer is considered",
  ],
};

/** How long the analysing screen runs, in ms. */
export const ANALYSE_MS = 14000;

/** The question set for a category, or null when it has none. Never a fallback. */
export function questionsFor(categorySlug: string | undefined | null): MatcherQuestion[] | null {
  if (!categorySlug) return null;
  return MATCHER_QUESTIONS_BY_CATEGORY[categorySlug] ?? null;
}

/** The analysing sequence for a category, or null when it has none. */
export function tasksFor(categorySlug: string | undefined | null): string[] | null {
  if (!categorySlug) return null;
  return MATCHER_TASKS_BY_CATEGORY[categorySlug] ?? null;
}

/**
 * Fold the chosen options into the scoring engine's answer shape.
 *
 * Takes the category, because the questions are per-category and folding a
 * reader's answers through the wrong set is exactly the bug this file exists
 * to prevent. An unknown category yields an empty fragment rather than a
 * pool-shaped guess.
 *
 * Profile-only answers are ignored here by construction.
 */
export function toScoringAnswers(
  categorySlug: string | undefined | null,
  answers: Record<string, string>,
): ScoreFragment {
  const questions = questionsFor(categorySlug);
  if (!questions) return {};
  const out: ScoreFragment = { ...(MATCHER_DEFAULTS[categorySlug!] ?? {}) };
  for (const q of questions) {
    const chosen = answers[q.id];
    if (!chosen) continue;
    const opt = q.options.find((o) => o.label === chosen);
    if (!opt?.scores) continue;
    Object.assign(out, opt.scores);
  }
  return out;
}
