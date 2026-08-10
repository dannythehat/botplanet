/**
 * The Bot Finder cards — one composed advertisement per category, plus the
 * universal one.
 *
 * WHAT A CARD IS. A single generated image carrying the whole pitch — logo,
 * headline, the machines, the frame — with one rectangle at the bottom left
 * deliberately EMPTY. The button that goes in it is real HTML, positioned over
 * the gap by components/BotFinderCard.astro. Nothing clickable is ever drawn
 * into the artwork.
 *
 * WHY THE CTA GEOMETRY LIVES HERE. The generator does not put the empty frame
 * in the same place twice: the universal card's is 57.6% of the width centred
 * 91.8% down, the window card's is 67.2% centred 89.5%. Every one of these
 * numbers came out of the file itself —
 *
 *     node scripts/measure-cta-frame.mjs <file>
 *
 * — because a button positioned by eye is a button that sits a few pixels
 * proud of its frame on somebody's phone and looks like a mistake. Run the
 * script, paste the numbers, never estimate.
 *
 * THE INSET. The script reports the OUTER stroke box. The values below are
 * about 93% of that width and 80% of that height, which keeps the button
 * inside the drawn border instead of covering it — the glow is the point.
 *
 * ADDING A CARD IS A DATA ENTRY. Ingest the artwork, measure it, add a row.
 * No component changes, no CSS.
 */

export interface FinderCard {
  /** Category slug, or "universal" for the site-wide card. */
  key: string;
  src: string;
  width: number;
  height: number;
  /** The live button's words. Never drawn into the picture. */
  label: string;
  /** Where the button goes. Measured, not guessed. */
  cta: { centreY: string; width: string; height: string; centreX?: string };
  /**
   * Describes the artwork for a screen reader and for search.
   *
   * IT HAS TO CARRY THE DRAWN WORDS. Every headline on these cards is pixels;
   * without alt text the page says nothing at all about them.
   */
  alt: string;
}

export const FINDER_CARDS: Record<string, FinderCard> = {
  universal: {
    key: "universal",
    src: "/media/botmatch/finder-universal.webp",
    width: 1122,
    height: 1402,
    label: "Find my perfect bot",
    /* Frame band y 1223–1351; button inset inside the stroke. Verified by
       compositing this exact box onto the artwork and looking at it. */
    cta: { centreY: "91.80%", width: "54.5%", height: "6.6%" },
    alt:
      "A BotPlanet card headed “Find your perfect bot — universal bot finder”, showing a " +
      "line-up of home robots together in one room: a window-cleaning robot on glass, a " +
      "companion robot, a furry robot pet, a coding robot in a clear ball, a pet camera " +
      "robot, a robot vacuum, a robot lawn mower on grass and a pool cleaner in water.",
  },

  "window-cleaning-robots": {
    key: "window-cleaning-robots",
    src: "/media/botmatch/finder-window.webp",
    width: 1122,
    height: 1402,
    label: "Find my window bot",
    /* Frame band y 1185–1324. Verified the same way. */
    cta: { centreY: "89.48%", width: "64%", height: "7.1%" },
    alt:
      "A BotPlanet card headed “Window cleaning bots — smart picks, clearer views”, showing " +
      "four window-cleaning robots working on a tall city window at dusk, one spraying, each " +
      "on a safety cord, with labels reading spray models, vacuum hold and app-ready picks.",
  },

  "robotic-pool-cleaners": {
    key: "robotic-pool-cleaners",
    src: "/media/botmatch/finder-pool.webp",
    width: 1122,
    height: 1402,
    label: "Find my pool bot",
    /* Frame band y 1222–1344. Verified the same way. */
    cta: { centreY: "91.51%", width: "58%", height: "6.3%" },
    alt:
      "A BotPlanet card headed \u201cPool cleaning bots \u2014 smart picks, cleaner pools\u201d, " +
      "showing six pool-cleaning robots around a lit night-time pool: two on the deck, three " +
      "in the water throwing spray, and one climbing a tiled wall, with labels reading " +
      "cordless picks, wall climbers, skimmer bots and app-ready models.",
  },

  "grill-cleaning-robots": {
    key: "grill-cleaning-robots",
    src: "/media/botmatch/finder-grill.webp",
    width: 1122,
    height: 1402,
    label: "Find my grill bot",
    /* Frame band y 1210–1360. This card's stroke is violet rather than cyan
       and sits under the automatic scan's threshold, so the band was read off
       a row profile and the box then checked by compositing it. */
    cta: { centreY: "91.65%", width: "66%", height: "7.3%" },
    alt:
      "A BotPlanet card headed \u201cGrill cleaning bots \u2014 smart picks, cleaner grills\u201d, " +
      "showing four grill-cleaning robots with brush rollers working across the grates of a " +
      "large open stainless barbecue at dusk, a fire pit behind, with labels reading brush " +
      "rollers, open-lid cleaning, patio-ready picks and easy-maintenance bots.",
  },

  "self-cleaning-litter-boxes": {
    key: "self-cleaning-litter-boxes",
    src: "/media/botmatch/finder-litter.webp",
    width: 1024,
    height: 1536,
    label: "Find my litter bot",
    /* 1024×1536, not 1122×1402 like the others — the generator changed shape.
       Nothing here cares: the button is positioned in percentages of whatever
       the image turns out to be. Frame band y 1250–1440. */
    cta: { centreY: "87.56%", width: "74%", height: "8.5%" },
    alt:
      "A BotPlanet card headed \u201cCat litter bots \u2014 smart picks, happier cats\u201d, " +
      "showing five self-cleaning litter boxes in a dark utility room with four cats around " +
      "them, one sitting inside a globe-shaped unit, with labels reading self-scooping picks, " +
      "open-entry options, odor-control designs and multi-cat homes, and a line reading " +
      "\u201cFind your perfect cat litter robot in 60 seconds\u201d.",
  },

  "companion-robots": {
    key: "companion-robots",
    src: "/media/botmatch/finder-companion.webp",
    width: 1024,
    height: 1536,
    label: "Find my companion",
    /* Frame band y 1302–1450 of 1536. */
    cta: { centreY: "89.58%", width: "76%", height: "6.9%" },
    alt:
      "A BotPlanet card headed \u201cCompanion robots \u2014 smart picks, real personality\u201d, " +
      "showing five desk and pet companion robots together on a rug in a dark living room, " +
      "with labels reading expressive personalities, desk buddies, pet-like companions and " +
      "family-friendly picks, and a line reading \u201cFind your perfect companion robot in " +
      "60 seconds\u201d.",
  },

  "pet-camera-robots": {
    key: "pet-camera-robots",
    src: "/media/botmatch/finder-petcam.webp",
    width: 1122,
    height: 1402,
    label: "Find my pet cam bot",
    /* Frame band y 1221–1301 — the shallowest of the set, and the reason the
       button height is a per-card number rather than a constant. */
    cta: { centreY: "89.94%", width: "72%", height: "4.3%" },
    alt:
      "A BotPlanet card headed \u201cAnimal photography bots\u201d, showing four wheeled pet " +
      "camera robots on a lit platform, with photographs above of a dog leaping over a pool, " +
      "a child playing with a puppy beside one, and a cat watching another, and labels " +
      "reading pet monitoring, playful interaction, night viewing and home-friendly design.",
  },

  "educational-coding-robots": {
    key: "educational-coding-robots",
    src: "/media/botmatch/finder-coding.webp",
    width: 1122,
    height: 1402,
    label: "Find my coding bot",
    cta: { centreY: "88.77%", width: "76.3%", height: "8%" },
    alt:
      "A BotPlanet card headed \u201cEducational robots \u2014 smart picks, STEM made fun\u201d, " +
      "showing three children playing with coding robots at a table: a floor bot on a printed " +
      "map with direction cards, a light-up robot in a clear ball, and a build kit with a " +
      "tablet showing block code, with labels reading screen-free coding, programmable robots, " +
      "STEM build kits and ages 4 to teen.",
  },

  "robot-vacuums": {
    key: "robot-vacuums",
    src: "/media/botmatch/finder-vacuum.webp",
    width: 1024,
    height: 1536,
    label: "Find my floor bot",
    cta: { centreY: "92.61%", width: "77.4%", height: "7.3%" },
    alt:
      "A BotPlanet card headed \u201cFloor cleaning bots \u2014 smart picks, cleaner floors\u201d, " +
      "showing four robot vacuums across a home: one docking at a self-empty tower, one mopping " +
      "tile, and two on a rug beside a golden retriever, with labels reading vacuum and mop, " +
      "self-empty docks, pet hair ready, and hard floor plus carpet.",
  },

  "robotic-lawn-mowers": {
    key: "robotic-lawn-mowers",
    src: "/media/botmatch/finder-lawn.webp",
    width: 1122,
    height: 1402,
    label: "Find my mower",
    cta: { centreY: "92.37%", width: "77.8%", height: "7.5%" },
    alt:
      "A BotPlanet card headed \u201cRobotic lawn mowers \u2014 smart picks, better lawns\u201d, " +
      "showing four robot mowers cutting striped lawns beside flower borders, one passing a " +
      "rabbit, with labels reading wire-free picks, small garden fits, pet and wildlife aware, " +
      "and steep slope ready.",
  },
};

/** The card for a category, or undefined when that category has no artwork yet. */
export const finderCardFor = (key: string): FinderCard | undefined => FINDER_CARDS[key];
