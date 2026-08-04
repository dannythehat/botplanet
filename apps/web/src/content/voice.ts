/* ============================================================
   BotPlanet — the brand voice.

   THIS IS NOT AN ASPIRATION. Every example below is lifted from
   copy already published on this site. The voice exists; this
   names it so it survives the next writer, the next agency and the
   next model.

   THE POSITION, IN ONE LINE:
   BotPlanet is the site that tells you when not to buy.

   That is the whole differentiator. Every robot review on the
   internet tells you what a machine does. Almost none tell you who
   should walk away, what the manufacturer refuses to publish, or
   which of their own earlier claims turned out to be wrong. Those
   three moves are the brand. Lose them and BotPlanet is another
   affiliate site with better artwork.
   ============================================================ */

export interface VoiceRule {
  id: string;
  rule: string;
  why: string;
  /** Real published BotPlanet copy that does it. */
  example: string;
}

export const VOICE_RULES: VoiceRule[] = [
  {
    id: "rule-out-first",
    rule: "Say who should NOT buy it, early, and in plain terms.",
    why: "Every competitor leads with what a machine does. Leading with who it fails is the fastest way to be believed about everything else — and it is the only thing a reader cannot get from the manufacturer's own page.",
    example:
      "The waterline ring is your actual complaint, your pool runs longer than 40 ft, or you want a cordless machine you can drop in anywhere.",
  },
  {
    id: "own-the-error",
    rule: "When we get something wrong, correct it in public, in the article, with the date.",
    why: "A correction buried in a changelog is a correction nobody reads. Printed in the paragraph where the mistake lived, it is the strongest trust signal on the page — and it costs nothing but pride.",
    example:
      "We are being blunt about this because our own product copy claimed waterline cleaning for this robot until we checked it against the manufacturer's technical sheet on 3 August 2026. It was wrong, it is corrected, and if you were about to buy on the strength of that line, we would rather lose the sale than have you open the box and find a tide-mark still there.",
  },
  {
    id: "name-the-gap",
    rule: "State what we could not find out. Give it a heading, not a footnote.",
    why: "Padding around an unknown is how every other site handles it. Naming the gap is more useful and takes fewer words, and it tells the reader exactly how much weight to put on the rest.",
    example:
      "Where a manufacturer does not publish a figure, we say so rather than borrowing one from a review site that borrowed it from another review site.",
  },
  {
    id: "so-what",
    rule: "Never leave a fact sitting there. Say what to do about it.",
    why: "A specification is not advice. The sentence after the fact is where the reader is actually served, and it is the sentence most reviews skip.",
    example:
      "What to do with that information: if the waterline is genuinely your problem, you want a model that states waterline scrubbing explicitly in its own specification. Check that on the product page for the exact SKU you are buying.",
  },
  {
    id: "plain-over-clever",
    rule: "Short words. Concrete nouns. No adjective doing a fact's job.",
    why: "\"Powerful suction\" is a mood. \"Two passive brushes, not driven\" is a fact a reader can act on. Every adjective that replaces a measurement is a small lie.",
    example: "Two, described by Maytronics as a Combine Brush. Note that this is a passive brush arrangement rather than an actively driven scrubbing brush.",
  },
  {
    id: "no-fake-balance",
    rule: "Have an opinion. A pro for every con is not fairness, it is cowardice.",
    why: "Symmetrical pros and cons are the house style of every site that has nothing to say. If a machine is worse, say it is worse and say for whom.",
    example:
      "A corded floor-and-wall cleaner that does a specific job reliably and does not pretend to do more.",
  },
];

/**
 * Constructions that make writing read as machine-generated.
 *
 * These are not banned because they are ungrammatical. They are banned because
 * they are the exact phrases that appear when a writer — human or model — is
 * producing text without having decided anything. Each one is a place where a
 * sentence goes through the motions of saying something.
 *
 * `pattern` is matched case-insensitively against review prose by
 * test/voice.test.ts, which fails the build rather than filing a note.
 */
export interface BannedPhrase {
  pattern: RegExp;
  label: string;
  instead: string;
}

export const BANNED_PHRASES: BannedPhrase[] = [
  {
    pattern: /\bin (today's|the modern) (world|market|age)\b/i,
    label: "In today's world",
    instead: "Start with the fact. The reader knows what year it is.",
  },
  {
    pattern: /\bwhen it comes to\b/i,
    label: "When it comes to",
    instead: "Four words that introduce the subject you were already writing about. Delete them and start with the noun.",
  },
  {
    pattern: /\bit'?s (important|worth) (to note|noting)\b/i,
    label: "It's important to note",
    instead: "If it were not worth noting you would not be writing it. Say the thing.",
  },
  {
    pattern: /\bin conclusion\b/i,
    label: "In conclusion",
    instead: "The reader can see the page ending. Use the space for the verdict instead.",
  },
  {
    pattern: /\blook no further\b/i,
    label: "Look no further",
    instead: "Ad copy. It promises a conclusion before making the argument.",
  },
  {
    pattern: /\bnot only\b[^.]{0,80}\bbut also\b/i,
    label: "Not only… but also",
    instead: "Two sentences. The construction pads one idea into the shape of two.",
  },
  {
    pattern: /\bwhether you'?re\b[^.]{0,60}\bor\b/i,
    label: "Whether you're X or Y",
    instead: "The false-inclusivity opener. Name the one reader this paragraph is for.",
  },
  {
    pattern: /\b(game[- ]?changer|cutting[- ]edge|state[- ]of[- ]the[- ]art|revolutionary|seamlessly|effortlessly|robust)\b/i,
    label: "Marketing filler",
    instead: "Replace with the measurement or behaviour the word is standing in for.",
  },
  {
    pattern: /\b(truly|incredibly|extremely|very) \w+/i,
    label: "Empty intensifier",
    instead: "An intensifier in front of an adjective is an adjective admitting it is weak. Use a number.",
  },
  {
    pattern: /\bdelve into\b|\bnavigate the (world|landscape)\b|\btapestry\b/i,
    label: "Model tell",
    instead: "Nobody has ever said this out loud. Rewrite it as you would say it.",
  },
  {
    pattern: /\bat the end of the day\b|\bthe bottom line is\b/i,
    label: "Throat-clearing",
    instead: "Delete and keep the sentence that follows it.",
  },
  {
    pattern: /\bthis (article|review|guide) will\b/i,
    label: "Announcing the article",
    instead: "Do the thing rather than describing what you are about to do.",
  },
];

/**
 * Rhythm.
 *
 * The most reliable mechanical tell of generated prose is not vocabulary — it
 * is that every sentence is roughly the same length. Human writing lurches:
 * a long qualified clause, then four words. That variance is what makes a
 * paragraph sound like a person having a thought rather than a system
 * completing a pattern.
 *
 * Measured as the standard deviation of sentence word-count. Below this, the
 * prose is flat regardless of how good the words are.
 */
export const MIN_SENTENCE_LENGTH_VARIANCE = 6.5;

/** Sentences longer than this are usually two sentences wearing a coat. */
export const MAX_SENTENCE_WORDS = 55;
