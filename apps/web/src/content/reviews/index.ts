/**
 * Long-form review narratives (Batch 1 of the approved page build).
 *
 * The review template assembles a page from THREE layers so nothing is stated
 * twice and nothing is invented:
 *   1. `content/products.ts` — the researched editorial record (verdict, specs,
 *      pros, limitations, FAQs, sources). Facts live there, once.
 *   2. D1 offers via the offer engine — price, availability, checked date.
 *   3. THIS FILE — the connective narrative that turns those facts into a
 *      review a buyer can actually read: what a spec means for ownership, who
 *      the machine suits, and what it is honestly bad at.
 *
 * HONESTY RULES: every claim below traces to the researched record or is
 * explicitly framed as reasoning about those recorded facts. No hands-on
 * testing is claimed anywhere — the template prints the research-led status on
 * every page. No ratings, no scores, no sales figures.
 */

export interface ReviewSection {
  heading: string;
  paragraphs: string[];
}

export interface LongFormReview {
  slug: string;
  /** Locked title tag and meta description from the approved SEO brief. */
  titleTag: string;
  metaDescription: string;
  /** Buyer-focused headline shown under the product name. */
  buyerHeadline: string;
  /** Verdict-strip facts. Statements of recorded facts, never scores. */
  scorecard: { label: string; value: string }[];
  sections: ReviewSection[];
  alternatives: { slug: string; name: string; when: string }[];
  updated: string;
}

export const LONG_FORM_REVIEWS: Record<string, LongFormReview> = {
  "dolphin-nautilus-cc-plus": {
    slug: "dolphin-nautilus-cc-plus",
    titleTag: "Dolphin Nautilus CC Plus Wi-Fi Review (2026) | BotPlanet",
    metaDescription:
      "Research-led review of the Dolphin Nautilus CC Plus Wi-Fi: cleaning coverage, filtration, app control, pool suitability, real limitations and who should buy it — with current retailer links.",
    buyerHeadline: "The proven choice for in-ground pools that just needs to work, week after week",
    scorecard: [
      { label: "Best for", value: "Proven in-ground everyday cleaning" },
      { label: "Coverage", value: "Floor, walls and waterline" },
      { label: "Power", value: "Corded — 60 ft anti-tangle swivel cable, no battery" },
      { label: "Pool fit", value: "In-ground pools up to ~40 ft" },
      { label: "Control", value: "Wi-Fi + MyDolphin Plus app with weekly scheduling" },
    ],
    sections: [
      {
        heading: "Overview: why this robot keeps appearing in every pool conversation",
        paragraphs: [
          "The Dolphin Nautilus CC Plus Wi-Fi is Maytronics' best-selling mid-range robotic cleaner, and the reason is not one standout trick — it is the absence of weak points. It cleans the three surfaces that actually get dirty (floor, walls and the waterline ring), it runs from a cable so there is never a battery to charge or replace, and it is backed by the brand that pool owners and dealers name first when asked what has held up for years.",
          "This is the corded philosophy done properly. Where cordless robots trade cleaning time against battery capacity, the CC Plus simply runs its full 120-minute cycle every time, on demand or on the weekly schedule you set in the app. The cost of that certainty is a 60 ft floating cable and a bit of storage bulk — a trade this review takes seriously rather than waving away.",
        ],
      },
      {
        heading: "Design and build",
        paragraphs: [
          "At about 20 lb the CC Plus is light enough for one person to lower in and lift out, and the top-load filter basket is the design decision you will appreciate most: when the robot comes out, the debris comes straight up with it, gets rinsed under a hose, and clips back in. There is no under-shell tray to flip the machine over for.",
          "The build follows Maytronics' usual pattern — a rigid shell over dual scrubbing surfaces, with the anti-tangle swivel mounted where the cable meets the machine. That swivel is not marketing decoration; it is the specific part that separates a corded robot you can leave alone from one you rescue mid-cycle, and it is the main reason the corded design remains viable in 2026.",
        ],
      },
      {
        heading: "Cleaning coverage: floor, walls and the waterline ring",
        paragraphs: [
          "Plenty of robots at lower prices clean floors adequately. What you are paying for here is the climb: the CC Plus scrubs the walls and then holds itself at the waterline — the band where sunscreen, body oils and airborne dust collect into the scum line that makes a pool look neglected even when the water is balanced.",
          "The active scrubbing brush leads the machine, agitating the surface before the suction path, which matters on textured or older plaster where fine dirt embeds rather than sitting loose. Owners of pools up to roughly 40 ft are inside its rated envelope; if your pool is meaningfully longer, look at the large-pool picks in our best-of guide instead.",
        ],
      },
      {
        heading: "Navigation",
        paragraphs: [
          "CleverClean is Maytronics' scanning logic: the robot maps its runs rather than bouncing randomly, so a standard rectangular or freeform in-ground pool gets covered in a predictable pattern within the cycle. It is not camera-based navigation and does not claim to be — there is no AI object recognition here, just a mature algorithm that has been refined across many Dolphin generations.",
          "The practical consequence: expect systematic coverage rather than perfect efficiency. It may recross cleaned areas, but in a 120-minute corded cycle that costs you nothing — unlike a cordless machine, it is not spending a finite battery on repeat passes.",
        ],
      },
      {
        heading: "Filtration and debris handling",
        paragraphs: [
          "The top-load basket takes fine and ultra-fine cartridges, which cover the realistic range for an in-ground pool: leaves and grit on the standard fine media, silt and pollen on ultra-fine. Cartridges rinse clean rather than needing replacement each time — an ongoing-cost point cheaper filter-bag designs quietly lose on.",
          "One honest note on heavy leaf-fall: a robot's basket is finite. If your pool sits under trees that dump serious volume, the right answer is usually this machine for the floor and walls plus a surface skimmer for the leaves before they sink — see the Betta SE Plus review for exactly that pairing.",
        ],
      },
      {
        heading: "Living with the cable",
        paragraphs: [
          "The cable is the whole corded argument, so here is the balanced version. Against it: 60 ft of floating cable needs somewhere to live, the supplied caddy adds garage footprint, and in tight or unusually shaped pools even a swivel cable can occasionally loop. For it: the robot never has a dead battery on a party morning, never loses runtime capacity as cells age, and costs nothing in replacement batteries across its life.",
          "If the cable is a dealbreaker, that is a legitimate preference — our cordless best-of guide exists for you. But be clear about what you are trading: a cordless robot's runtime is a consumable that degrades; a cable is an inconvenience that doesn't.",
        ],
      },
      {
        heading: "App, scheduling and controls",
        paragraphs: [
          "Wi-Fi with the MyDolphin Plus app lifts the CC Plus above button-only corded rivals: you can start and stop cycles remotely and set a weekly schedule, which in practice is how this machine should be used — pick your days, and stop thinking about it. Scheduling is the feature that converts a gadget into infrastructure.",
          "There is no multi-mode complexity to learn. For owners who explicitly do not want an app, the robot also runs from its power supply without one.",
        ],
      },
      {
        heading: "Setup and maintenance",
        paragraphs: [
          "Setup is genuinely minutes: connect the cable to the power supply, submerge the robot, run a cycle. Ongoing care is the top-load rinse after each run, an occasional check of the brushes for wrapped debris, and laying the cable out straight now and then to relax any memory it builds.",
          "The recorded warranty is a 2-year limited term, with the important caveat our research flagged: coverage terms vary by seller, so confirm what the retailer you buy from actually honours before you order. That is a buying-process step, not a product flaw, but it belongs in an honest review.",
        ],
      },
      {
        heading: "What it does well — and where it honestly falls short",
        paragraphs: [
          "Done well: dependable full-pool coverage on a proven platform; no battery anxiety or degradation; the easiest filter servicing in its class; genuine wall-and-waterline scrubbing; scheduling that makes it fit-and-forget. This is the machine you buy so the pool stops being a chore.",
          "Falls short: it is rated for in-ground pools only, so above-ground owners should look at the Dolphin E10 instead. The cable and caddy demand storage space. And at its price it faces aggressive cordless competition on features-per-dollar — what it offers instead is the track record those newer machines have not yet earned.",
        ],
      },
    ],
    alternatives: [
      { slug: "polaris-freedom", name: "Polaris FREEDOM", when: "You want the no-cable experience from an equally established pool brand, and accept charging between cycles." },
      { slug: "dolphin-e10", name: "Dolphin E10", when: "You have an above-ground pool — same trusted corded approach, sized and rated for above-ground walls." },
      { slug: "beatbot-aquasense-2-ultra", name: "Beatbot AquaSense 2 Ultra", when: "Budget stretches to a premium cordless flagship with surface skimming and water clarification on top of floor/wall/waterline." },
    ],
    updated: "2026-08-01",
  },

  "betta-se-plus": {
    slug: "betta-se-plus",
    titleTag: "Betta SE Plus Review (2026) — Solar Pool Skimmer | BotPlanet",
    metaDescription:
      "Research-led review of the Betta SE Plus solar surface skimmer: what it cleans (and what it doesn't), battery and solar running, durability, limitations and who should buy — with current links.",
    buyerHeadline: "A solar skimmer that keeps the surface spotless — and honestly, that is all it does",
    scorecard: [
      { label: "Best for", value: "Hands-free surface debris" },
      { label: "What it is", value: "Surface skimmer — it never touches the floor or walls" },
      { label: "Power", value: "Solar with dual charging (wall adapter ~3.5 h backup)" },
      { label: "Runtime", value: "Up to ~30 hours of stored running for continuous skimming" },
      { label: "Water", value: "Fresh or saltwater — twin salt-chlorine-tolerant motors" },
    ],
    sections: [
      {
        heading: "Read this first: what a surface skimmer is (and is not)",
        paragraphs: [
          "The Betta SE Plus belongs to a different product class from every floor-cleaning robot on this site, and this review will not let that distinction blur. It is a surface skimmer: a solar-powered catamaran that patrols the top of the water collecting leaves, petals, pollen mats and insects before they sink. It never dives. It cleans no floor, no walls, no waterline.",
          "Judged as what it is, it is the most compelling product of its kind we have researched. Judged as a pool cleaner in the usual sense, it would be a one-star mistake — which is exactly why BotPlanet types it as a `surface skimmer` in our data model and why BotMatch will only ever recommend it when your stated problem is floating debris.",
        ],
      },
      {
        heading: "Why surface-first cleaning is a rational strategy",
        paragraphs: [
          "Everything on your pool floor was on the surface first. Leaves float for hours before they waterlog and sink; catch them during that window and they never become the sunken, decomposing layer that stains plaster and feeds algae. A skimmer that runs continuously — which solar power makes practical — intercepts debris at the cheap end of the problem.",
          "That is also why the SE Plus pairs so naturally with a floor robot rather than competing with one: the skimmer handles the constant rain of surface debris, so the floor robot's basket stops filling with leaves and can do its actual job on silt and grit. For tree-lined pools, the pairing is the honest full answer.",
        ],
      },
      {
        heading: "Design and build",
        paragraphs: [
          "The SE Plus is a 15 lb twin-hull float with a solar deck on top and a wide collection mouth between the hulls, feeding a large fine-mesh basket (around 200 microns — fine enough for pine needles and most pollen clumps, not a silt filter). The basket lifts out by its top handle, dumps into the bin, rinses, and drops back in.",
          "The 'Plus' over the base SE is two specific upgrades our research confirmed: dual charging — the solar panel plus a wall adapter that fills the battery in about 3.5 hours for cloudy spells or overnight prep — and the shallow-water safeguard that steers it away from tanning ledges and steps where a skimmer can strand itself.",
        ],
      },
      {
        heading: "Power and runtime: the solar question, answered honestly",
        paragraphs: [
          "Stored capacity is rated up to roughly 30 hours of running, and the machine is designed to live in the pool, topping itself up as it works. In sunny conditions it approaches genuinely continuous operation — the set-and-forget promise is real, with two caveats the marketing does not lead with.",
          "First, output follows sunlight: shaded pools or long overcast stretches will lean on the adapter charge. Second, it needs adequate water depth to operate properly — very shallow zones are what the safeguard exists to avoid. Neither is a flaw so much as physics, but you should buy knowing it.",
        ],
      },
      {
        heading: "Navigation",
        paragraphs: [
          "Steering is ultrasonic: the SE Plus detects walls and obstacles by echo and turns before contact rather than bumping. Combined with the shallow-water safeguard it patrols unattended, which is the entire point — a skimmer you must supervise saves you nothing over a net.",
          "There is no app; control is a wireless remote for the occasions you want to drive it to a corner, and full-automatic mode for the other 99% of its life. We list the missing app under limitations, but for a device whose job is to be ignored, the remote-plus-automatic arrangement is arguably the correct amount of technology.",
        ],
      },
      {
        heading: "Saltwater, materials and durability",
        paragraphs: [
          "The twin motors are specified as salt-chlorine tolerant, making the SE Plus equally at home in saltwater and traditional pools — worth underlining, because continuous immersion in treated water is a brutal duty cycle. The cover is UV-resistant for the same reason: this machine lives in direct sun by design.",
          "The 1-year warranty is the shortest among our launch products and we flag it plainly. A device that floats in chemically treated water in full sunshine all season deserves a longer promise; budget mentally for the possibility that season three is not guaranteed.",
        ],
      },
      {
        heading: "Setup and maintenance",
        paragraphs: [
          "Setup is: charge it, place it on the water, press auto. Maintenance is emptying the basket — daily in heavy leaf-fall, weekly otherwise — plus an occasional rinse of the hulls and a check that the solar deck is clean, since a dusty panel is a slower charger.",
          "In winter, or any long shutdown, it comes out of the water and stores indoors on an adapter top-up like any lithium device.",
        ],
      },
      {
        heading: "What it does well — and where it honestly falls short",
        paragraphs: [
          "Done well: genuinely autonomous surface clearing powered by the sun; the dual-charge and shallow-safeguard upgrades that fix the base model's real weaknesses; saltwater tolerance; a big, easy basket; and a visible result — the surface is the part of the pool you actually look at.",
          "Falls short: it does nothing below the waterline, and no buyer should discover that after purchase; the warranty is only one year; there is no app; and its economics only make sense if surface debris is a real, recurring problem for your pool. If your pool has no tree cover and little wind-blown debris, put the same money toward a better floor robot instead.",
        ],
      },
    ],
    alternatives: [
      { slug: "dolphin-nautilus-cc-plus", name: "Dolphin Nautilus CC Plus", when: "Your actual problem is the floor, walls and waterline — the things a skimmer never touches." },
      { slug: "wybot-c1", name: "WYBOT C1", when: "You want an affordable cordless robot that cleans below the surface instead." },
      { slug: "beatbot-aquasense-2-ultra", name: "Beatbot AquaSense 2 Ultra", when: "You want surface skimming AND floor/wall/waterline cleaning in one premium machine." },
    ],
    updated: "2026-08-01",
  },
};

export const longFormReview = (slug: string): LongFormReview | undefined => LONG_FORM_REVIEWS[slug];
