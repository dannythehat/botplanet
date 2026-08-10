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
    /**
     * SCORED FROM 10 AUGUST 2026, AND IT WAS THE THIRD QUESTION ON THIS SITE
     * ASKING SOMETHING NOTHING READ. A reader who says the windows are above
     * the ground floor has told us the one thing that decides safety here: if
     * the mains cuts while the machine is on the glass, does it hold?
     *
     * Ten of the eleven robots in the catalogue do — a UPS or backup battery
     * good for twenty to thirty minutes, most with an audible alert. The
     * WINBOT W1 PRO does not; ECOVACS lists "power-off protection: Yes" and
     * means a carabiner and a tether. So this rules out exactly one machine,
     * which is a small effect and the correct one: a reader with third-floor
     * windows should not be handed the only model that stops holding when the
     * socket does.
     *
     * GROUND FLOOR IS NOT SCORED, deliberately. A robot that falls off a
     * ground-floor window lands on the lawn. The whole reason this axis exists
     * is height, and applying it to somebody who told us they have none would
     * rule out a machine on a risk they do not carry.
     */
    id: "window_height",
    kicker: "Your height",
    q: "How high up are the windows that matter?",
    options: [
      { label: "Ground floor", hint: "Nothing here has far to fall" },
      {
        label: "First or second floor",
        scores: { desired_cleans: ["power_off_hold"] },
      },
      {
        label: "Higher than that",
        hint: "The machine has to hold on when the power cuts",
        scores: { desired_cleans: ["power_off_hold"] },
      },
      { label: "A mix", scores: { desired_cleans: ["power_off_hold"] } },
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
   Self-cleaning litter boxes

   Ordered by how much each question narrows the field.

   CAT SIZE IS FIRST and it is the only hard exclusion in the
   category. These machines detect their occupant by weight; a
   kitten below the sensor's minimum may not register at all, and
   a large cat may register perfectly and still not fit the
   chamber. Neither is fixable with a setting, and one of them is
   a safety question rather than a disappointment — which is why
   the scoring config excludes on it and why the funnel is
   willing to end with "not yet, use an ordinary tray".

   LITTER TYPE IS SECOND, ahead of budget, because it decides the
   three-year cost more than the sticker price does. A machine
   that only takes the maker's own trays is a subscription with a
   box attached, and a buyer who will not accept that has ruled
   out a whole half of the market before they have looked at one.

   Power is not asked — they all plug in — so MATCHER_DEFAULTS
   keeps the engine's power factor neutral rather than scoring it
   zero for every candidate.
   ============================================================ */

const LITTER_BOX_QUESTIONS: MatcherQuestion[] = [
  {
    id: "environment",
    kicker: "Your cat",
    q: "How big is your cat?",
    options: [
      {
        label: "An average adult",
        hint: "Roughly 8–15 lb — most cats",
        scores: { environment: "average_cat" },
      },
      {
        label: "Large or long",
        hint: "Over about 15 lb, or a Maine Coon sort of shape",
        scores: { environment: "large_cat" },
      },
      {
        label: "A kitten, or very small",
        hint: "Under about 5 lb — we may tell you to wait",
        scores: { environment: "kitten" },
      },
    ],
  },
  /**
   * THIS QUESTION PROMISED A RULE-OUT AND DELIVERED NOTHING UNTIL 10 AUGUST
   * 2026. Its own hint says "Rules out the sealed-tray systems" and no option
   * carried a `scores` object, so the answer was recorded and never read —
   * there was no capability for it to land on. `any_litter` exists now, and
   * it is the sharpest difference in this category: three of the four boxes
   * take ordinary clumping litter from any shop, and the PetSafe works only
   * with PetSafe's own crystal trays for the life of the machine.
   *
   * The other two answers stay unscored on purpose. "Yes, if it means less
   * handling" is a willingness, not a requirement, and turning it into a
   * preference for the locked system would push a permanent running cost onto
   * somebody who merely said they would tolerate one.
   */
  {
    id: "litter_pref",
    kicker: "Running cost",
    q: "Would you buy the manufacturer's own litter refills?",
    options: [
      {
        label: "No — ordinary litter from any shop",
        hint: "Rules out the sealed-tray systems",
        scores: { desired_cleans: ["any_litter"] },
      },
      { label: "Yes, if it means less handling" },
      { label: "Don't mind, show me both" },
    ],
  },
  {
    id: "primary_need",
    kicker: "Your household",
    q: "How many cats will use it?",
    options: [
      {
        label: "One",
        scores: { primary_need: "single_cat", desired_cleans: ["odor_sealing"] },
      },
      {
        label: "Two",
        scores: {
          primary_need: "two_cats",
          desired_cleans: ["odor_sealing", "multi_cat_capacity"],
        },
      },
      {
        label: "Three or more",
        hint: "You will likely need more than one box",
        scores: {
          primary_need: "many_cats",
          desired_cleans: ["odor_sealing", "multi_cat_capacity", "health_monitoring"],
        },
      },
    ],
  },
  {
    id: "tracking",
    kicker: "Health",
    q: "Do you want it to track each cat's visits and weight?",
    options: [
      {
        label: "Yes — that's useful to me",
        hint: "Visit frequency is an early warning sign",
        scores: { desired_cleans: ["health_monitoring", "app_control"] },
      },
      { label: "No — I just want it emptied", scores: { desired_cleans: ["odor_sealing"] } },
      { label: "Nice to have, not decisive" },
    ],
  },
  {
    id: "budget_tier",
    kicker: "Your budget",
    q: "Roughly what are you looking to spend?",
    options: [
      { label: "Under $200", scores: { budget_tier: "budget" } },
      { label: "$200 – $400", scores: { budget_tier: "mid" } },
      { label: "$400 – $700", scores: { budget_tier: "premium" } },
      { label: "Over $700", scores: { budget_tier: "ultra" } },
      { label: "Show me the range", scores: { budget_tier: "no_pref" } },
    ],
  },

  /* ---- profile questions: recorded, never scored ---- */
  {
    id: "main_worry",
    kicker: "Your concern",
    q: "What worries you most about buying one?",
    options: [
      { label: "Whether it's safe" },
      { label: "Whether my cat will use it" },
      { label: "The smell" },
      { label: "What it costs to run" },
    ],
  },
  {
    id: "timeline",
    kicker: "Your timing",
    q: "When are you looking to buy?",
    options: [
      { label: "This week" },
      { label: "This month" },
      { label: "Still deciding" },
      { label: "Just researching" },
    ],
  },
];

/* ============================================================
   Grill-cleaning robots

   GRATE MATERIAL IS FIRST and it is the only hard exclusion.
   Brass or steel across porcelain-coated grates strips the
   enamel, and the bare cast iron underneath then rusts. That is
   permanent damage done by the right machine with the wrong
   brush, so the config refuses on it rather than ranking it
   lower.

   BAR SPACING IS SECOND, ahead of budget, because it decides
   whether the machine can physically drive at all. It has no
   search volume worth naming and it is the most likely reason
   one of these is returned.

   The funnel is also willing to end with "buy a brush". This is
   the smallest category on the site, one product dominates it,
   and for someone who already cleans their grill after cooking a
   fifteen-dollar bristle-free brush is the better purchase. A
   matcher that cannot say that is a sales page.

   Power is not asked — they are all battery — so
   MATCHER_DEFAULTS keeps the engine's power factor neutral.
   ============================================================ */

const GRILL_QUESTIONS: MatcherQuestion[] = [
  {
    id: "environment",
    kicker: "Your grates",
    q: "What are your cooking grates made of?",
    options: [
      {
        label: "Porcelain-coated",
        hint: "Shiny black or grey coating — nylon brushes only",
        scores: { environment: "porcelain_grates" },
      },
      {
        label: "Bare cast iron",
        hint: "Heavy, matt, needs oiling",
        scores: { environment: "cast_iron_grates" },
      },
      {
        label: "Stainless steel bars",
        scores: { environment: "stainless_grates" },
      },
      {
        label: "Not sure",
        hint: "We will assume coated, which is the safe answer",
        scores: { environment: "porcelain_grates" },
      },
    ],
  },
  {
    id: "bar_spacing",
    kicker: "Your grill",
    q: "How close together are the bars?",
    options: [
      { label: "Close — a standard gas grill grate" },
      { label: "Widely spaced", hint: "A machine may not drive across them" },
      { label: "It is a flat-top griddle", hint: "These are built for bars, not flat tops" },
      { label: "Not sure" },
    ],
  },
  {
    id: "primary_need",
    kicker: "Your problem",
    q: "What are you actually trying to fix?",
    options: [
      {
        label: "I never get round to cleaning it",
        scores: { primary_need: "avoidance", desired_cleans: ["timer_control", "grease_removal"] },
      },
      {
        label: "Baked-on grease",
        scores: { primary_need: "grease", desired_cleans: ["grease_removal", "hot_grill_safe"] },
      },
      {
        label: "Worried about wire bristles in food",
        scores: { primary_need: "bristle_safety", desired_cleans: ["bristle_free"] },
      },
      {
        label: "I just want it done while I do something else",
        scores: { primary_need: "convenience", desired_cleans: ["timer_control"] },
      },
    ],
  },
  {
    id: "frequency",
    kicker: "How often",
    q: "How often do you cook on it?",
    options: [
      { label: "Several times a week" },
      { label: "Most weekends" },
      { label: "A few times a season", hint: "A brush may serve you better" },
    ],
  },
  {
    id: "budget_tier",
    kicker: "Your budget",
    q: "Roughly what are you looking to spend?",
    options: [
      { label: "Under $100", scores: { budget_tier: "budget" } },
      { label: "$100 – $150", scores: { budget_tier: "mid" } },
      { label: "$150 – $250", scores: { budget_tier: "premium" } },
      { label: "Over $250", scores: { budget_tier: "ultra" } },
      { label: "Show me the range", scores: { budget_tier: "no_pref" } },
    ],
  },

  /* ---- profile questions: recorded, never scored ---- */
  {
    id: "main_worry",
    kicker: "Your concern",
    q: "What worries you most about buying one?",
    options: [
      { label: "That it will not really work" },
      { label: "That it will damage the grates" },
      { label: "The cost of replacement heads" },
      { label: "That a brush would do the same job" },
    ],
  },
];

/* ============================================================
   Robot vacuums and mops

   FLOOR TYPE IS FIRST and it is the hard exclusion. A vacuum-mop
   whose pads do not lift will drag a wet pad across carpet, and
   a machine without the clearance for deep pile beaches on it.
   Both are predictable before purchase and neither is fixable
   with a setting.

   HAIR IS SECOND, ahead of budget, because it is the single
   biggest reason people buy one and because the brush design
   that solves it is buried in the specifications rather than on
   the box. "best robot vacuum for pet hair" is 18,100/mo — the
   biggest reachable term in the category after the head — but it
   is asked here because it decides the purchase, not because it
   ranks.

   CLUTTER IS THIRD, and it is the question the category never
   asks. Obstacle avoidance is most of the price gap between a
   $250 machine and a $900 one, and the honest input is not a
   specification, it is how tidy the reader's floor actually is.

   Power is not asked — they all charge from a base — so
   MATCHER_DEFAULTS keeps the engine's power factor neutral.
   ============================================================ */

const VACUUM_QUESTIONS: MatcherQuestion[] = [
  {
    id: "environment",
    kicker: "Your floors",
    q: "What is on most of your floors?",
    options: [
      {
        label: "Mostly hard floors",
        hint: "Wood, tile, laminate, vinyl",
        scores: { environment: "hard_floors", desired_cleans: ["mopping"] },
      },
      {
        label: "A mix of hard floor and carpet",
        hint: "The pads have to lift out of the way",
        scores: { environment: "low_pile_carpet", desired_cleans: ["mopping", "mop_lifting"] },
      },
      {
        label: "Deep or shag pile throughout",
        hint: "A mop is dead weight here, and clearance matters",
        scores: { environment: "deep_pile_carpet" },
      },
    ],
  },
  {
    id: "primary_need",
    kicker: "Hair",
    q: "Is there an animal in the house, or long hair?",
    options: [
      {
        label: "Yes — a shedding animal",
        scores: { primary_need: "pet_hair", desired_cleans: ["self_emptying", "obstacle_avoidance"] },
      },
      {
        label: "Long human hair, no animals",
        scores: { primary_need: "long_hair", desired_cleans: ["self_emptying"] },
      },
      {
        label: "Neither",
        scores: { primary_need: "general", desired_cleans: ["mopping"] },
      },
    ],
  },
  {
    id: "clutter",
    kicker: "Your floor, honestly",
    q: "Is there usually stuff on the floor?",
    options: [
      {
        label: "It is generally clear",
        hint: "Cheaper navigation will cope",
      },
      {
        label: "Cables, shoes, the odd toy",
        hint: "This is what the expensive avoidance is for",
        scores: { desired_cleans: ["obstacle_avoidance"] },
      },
      {
        label: "Children live here",
        scores: { desired_cleans: ["obstacle_avoidance"] },
      },
    ],
  },
  {
    id: "emptying",
    kicker: "Maintenance",
    q: "Would you rather it emptied itself?",
    options: [
      {
        label: "Yes — I do not want to think about it",
        scores: { desired_cleans: ["self_emptying"] },
      },
      { label: "I do not mind emptying a bin" },
      { label: "Not sure what that means" },
    ],
  },
  {
    id: "budget_tier",
    kicker: "Your budget",
    q: "Roughly what are you looking to spend?",
    options: [
      { label: "Under $300", scores: { budget_tier: "budget" } },
      { label: "$300 – $600", scores: { budget_tier: "mid" } },
      { label: "$600 – $1,000", scores: { budget_tier: "premium" } },
      { label: "Over $1,000", scores: { budget_tier: "ultra" } },
      { label: "Show me the range", scores: { budget_tier: "no_pref" } },
    ],
  },

  /**
   * ONE ANSWER HERE IS SCORED AND THE OTHER TWO ARE NOT.
   *
   * This question sat under "recorded, never scored" until 10 August 2026,
   * which threw away the one thing it tells us that the catalogue can answer.
   * `multi_floor_mapping` is a recorded capability — the Qrevo S5V does not
   * have it and the X10 Pro Omni does — and a reader who says the house has
   * several storeys has told us they need it. Nothing else in the funnel asks.
   *
   * "A typical house" is deliberately NOT scored. It is ambiguous about
   * storeys in a way "several storeys" is not, and guessing on the reader's
   * behalf would rule out a machine on an answer they did not give.
   */
  {
    id: "home_size",
    kicker: "Your home",
    q: "How much ground does it have to cover?",
    options: [
      { label: "An apartment or one floor" },
      { label: "A typical house" },
      {
        label: "A large house, several storeys",
        hint: "It has to remember more than one map",
        scores: { desired_cleans: ["multi_floor_mapping"] },
      },
    ],
  },

  /* ---- profile questions: recorded, never scored ---- */
  {
    id: "main_worry",
    kicker: "Your concern",
    q: "What worries you most about buying one?",
    options: [
      { label: "It will get stuck constantly" },
      { label: "It will not clean properly" },
      { label: "Hair wrapping round the brush" },
      { label: "Paying for features I will not use" },
    ],
  },
];

/* ============================================================
   Educational and coding robots

   AGE IS FIRST and it is the hard exclusion — the only one on
   this site that cuts in BOTH directions. Every other category
   fails by a machine not being capable enough. This one fails
   equally by being too capable: a build-it-yourself kit given to
   a five-year-old is abandoned exactly as reliably as a
   button-driven floor robot given to a teenager. An unused robot
   is the failure mode here, not a poor result.

   THE TABLET QUESTION IS SECOND, ahead of budget, because it is
   a household constraint rather than a preference. In a house
   with one shared device an app-based robot is negotiated for
   rather than picked up, and that is the difference between
   daily use and a drawer.

   AND THE FUNNEL ASKS WHETHER THE CHILD ACTUALLY WANTED ONE.
   That question sells nothing and it is the most useful one
   here: no robot in this category creates interest that was not
   already there, and the honest recommendation for an unasked-for
   purchase is the cheap screen-free one rather than the
   flagship kit.
   ============================================================ */

const CODING_QUESTIONS: MatcherQuestion[] = [
  {
    id: "environment",
    kicker: "Their age",
    q: "How old is the child?",
    options: [
      {
        label: "Four to seven",
        hint: "Screen-free, no reading required",
        scores: { environment: "age_4_7", desired_cleans: ["screen_free"] },
      },
      {
        label: "Eight to twelve",
        hint: "Block coding, some building",
        scores: { environment: "age_8_12", desired_cleans: ["block_coding"] },
      },
      {
        label: "Thirteen or older",
        hint: "Real languages, real construction",
        scores: {
          environment: "age_13_plus",
          desired_cleans: ["text_coding", "build_it_yourself"],
        },
      },
    ],
  },
  {
    id: "device",
    kicker: "Your household",
    q: "Is there a tablet or phone they can use freely?",
    options: [
      { label: "Yes, their own" },
      { label: "A shared one, sometimes" },
      {
        label: "No — it needs to work without one",
        hint: "Rules out everything with block coding",
        scores: { desired_cleans: ["screen_free"] },
      },
    ],
  },
  {
    id: "primary_need",
    kicker: "What you want from it",
    q: "What are you hoping it does?",
    options: [
      {
        label: "Introduce the idea of programming",
        scores: { primary_need: "first_steps", desired_cleans: ["screen_free"] },
      },
      {
        label: "Build on coding they already do",
        scores: { primary_need: "progression", desired_cleans: ["block_coding", "text_coding"] },
      },
      {
        label: "Something to build as well as program",
        scores: { primary_need: "building", desired_cleans: ["build_it_yourself"] },
      },
      {
        label: "Keep them off a screen for once",
        scores: { primary_need: "screen_free_play", desired_cleans: ["screen_free"] },
      },
    ],
  },
  {
    id: "asked_for_it",
    kicker: "Honestly",
    q: "Have they actually asked for one?",
    options: [
      { label: "Yes, specifically" },
      { label: "They like this sort of thing" },
      { label: "No — it is my idea", hint: "We will point you at the cheap one first" },
    ],
  },
  {
    id: "budget_tier",
    kicker: "Your budget",
    q: "Roughly what are you looking to spend?",
    options: [
      { label: "Under $60", scores: { budget_tier: "budget" } },
      { label: "$60 – $150", scores: { budget_tier: "mid" } },
      { label: "$150 – $350", scores: { budget_tier: "premium" } },
      { label: "Over $350", scores: { budget_tier: "ultra" } },
      { label: "Show me the range", scores: { budget_tier: "no_pref" } },
    ],
  },

  /* ---- profile questions: recorded, never scored ---- */
  {
    id: "main_worry",
    kicker: "Your concern",
    q: "What worries you most about buying one?",
    options: [
      { label: "It will be used twice and forgotten" },
      { label: "It will be too hard" },
      { label: "It will be too babyish" },
      { label: "Paying a lot for a toy" },
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
  "self-cleaning-litter-boxes": LITTER_BOX_QUESTIONS,
  "grill-cleaning-robots": GRILL_QUESTIONS,
  "robot-vacuums": VACUUM_QUESTIONS,
  "educational-coding-robots": CODING_QUESTIONS,
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
  "self-cleaning-litter-boxes": { power_pref: "no_pref", pool_length_ft: null, pool_area_sqft: null },
  "grill-cleaning-robots": { power_pref: "no_pref", pool_length_ft: null, pool_area_sqft: null },
  "robot-vacuums": { power_pref: "no_pref", pool_length_ft: null, pool_area_sqft: null },
  "educational-coding-robots": { power_pref: "no_pref", pool_length_ft: null, pool_area_sqft: null },
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
  "self-cleaning-litter-boxes": [
    "Reading your cat's size and your household",
    "Ruling out machines whose weight sensor your cat sits below",
    "Checking which chambers a large cat can actually turn around in",
    "Matching litter type and multi-cat capacity to what you told us",
    "Weighing what each one costs to run, not just to buy",
    "Ranking on suitability — before any retailer is considered",
  ],
  "grill-cleaning-robots": [
    "Reading what your grates are made of",
    "Ruling out brush materials that would strip your coating",
    "Checking the machine can drive on bars spaced like yours",
    "Weighing how often you cook against what one would save you",
    "Comparing the machine honestly against a good hand brush",
    "Ranking on suitability — before any retailer is considered",
  ],
  "robot-vacuums": [
    "Reading what is on your floors",
    "Ruling out machines whose pads would sit on your carpet",
    "Checking brush design against the hair in your house",
    "Matching obstacle avoidance to how clear your floor really is",
    "Weighing what each one costs to run, not just to buy",
    "Ranking on suitability — before any retailer is considered",
  ],
  "educational-coding-robots": [
    "Reading the age you gave us",
    "Ruling out machines that would bore them or defeat them",
    "Checking which ones work without a tablet",
    "Looking at what happens when the built-in challenges run out",
    "Weighing what each one costs against how sure you are",
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
    mergeScores(out, opt.scores);
  }
  return out;
}

/**
 * Fold one option's fragment into the answer set.
 *
 * `desired_cleans` IS A UNION AND EVERY OTHER FIELD IS LAST-WINS, and getting
 * that wrong was the largest scoring bug this site has had.
 *
 * Until 10 August 2026 this was `Object.assign`, which meant the LAST question
 * to mention `desired_cleans` silently threw away every capability the reader
 * had asked for before it. A vacuum reader who said hard floors (mopping),
 * shedding animal (self-emptying, obstacle avoidance), cluttered floor
 * (obstacle avoidance) and yes-empty-itself (self-emptying) arrived at the
 * scorer wanting ONE capability — whichever the last scored question named —
 * and the four questions before it had been answered for nothing.
 *
 * That is also most of the reason the matchers tied. `cleansCoverage` is
 * covered-over-desired, so a desired set of one item is satisfied completely by
 * almost every product in a category, the factor saturates at 1.0 for
 * everything, and the ranking collapses onto price tier alone. Six categories
 * were deciding two answer sets out of three or worse, and the engine was being
 * handed a question the reader never asked.
 *
 * The other fields are genuinely last-wins: a category asks about environment,
 * budget and power once each, so there is nothing to merge and a union would be
 * wrong — two environments is not a thing the scorer can hold.
 */
export function mergeScores(out: ScoreFragment, add: ScoreFragment): ScoreFragment {
  for (const [key, value] of Object.entries(add) as [keyof ScoreFragment, unknown][]) {
    if (key === "desired_cleans" && Array.isArray(value)) {
      const seen = new Set([...(out.desired_cleans ?? []), ...(value as CleaningSurface[])]);
      out.desired_cleans = [...seen];
    } else {
      (out as Record<string, unknown>)[key] = value;
    }
  }
  return out;
}
