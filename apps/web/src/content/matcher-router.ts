/**
 * Step 1 of the universal BotMatch: what job should the robot do?
 *
 * WHY THIS FILE EXISTS AT ALL. Every matcher on this site starts by assuming
 * the reader already knows which of nine categories they are shopping in.
 * Somebody arriving on the homepage does not. They know their windows are
 * filthy, or that the dog is alone until six. This turns that into a category
 * without asking anyone to learn our taxonomy first.
 *
 * PHRASED BY NEED, NOT BY CATEGORY NAME. "Keep the pool clean" rather than
 * "Robotic pool cleaners". The category name appears in the one-line
 * description underneath, where it teaches rather than gatekeeps — and in the
 * "not sure yet" view, which shows the same nine with their descriptions
 * showing so a reader can browse rather than choose blind.
 *
 * NO SCORING HAPPENS HERE. This picks a questionnaire. Everything that decides
 * a product still happens in @botplanet/scoring, behind /api/botmatch, judged
 * by the category's own stored config. A job that maps to a category simply
 * hands the reader to that category's existing questions.
 */

export interface MatcherJob {
  /** Stable id, used in the URL and in analytics. */
  id: string;
  /** The job, in the reader's words. Never a category name. */
  label: string;
  /** One line, shown under the label in the "not sure yet" view. */
  description: string;
  /** The category whose question set answers this job. */
  categorySlug: string;
}

/**
 * The nine jobs, in the order they are offered.
 *
 * ORDERED BY HOW MANY PEOPLE ARRIVE WANTING THEM, not by how much we have to
 * sell. Pool and window lead because they are the two biggest search clusters
 * on the site and the two categories with eleven published products each. Grill
 * is last because it has none — and it is still on the list, because leaving a
 * live category out of the finder would be a quieter lie than telling somebody
 * we have not finished testing them.
 */
export const MATCHER_JOBS: MatcherJob[] = [
  {
    id: "pool",
    label: "Keep my pool clean",
    description: "Robotic pool cleaners — floor, walls and waterline, corded or cordless.",
    categorySlug: "robotic-pool-cleaners",
  },
  {
    id: "windows",
    label: "Clean my windows",
    description: "Window-cleaning robots — they stick to the glass and work the pane for you.",
    categorySlug: "window-cleaning-robots",
  },
  {
    id: "lawn",
    label: "Cut the grass",
    description: "Robotic lawn mowers — wire-free and boundary-wire, quarter acre upwards.",
    categorySlug: "robotic-lawn-mowers",
  },
  {
    id: "floors",
    label: "Vacuum the floors",
    description: "Robot vacuums — the biggest category in home robotics, and our newest.",
    categorySlug: "robot-vacuums",
  },
  {
    id: "litter",
    label: "Stop scooping the litter tray",
    description: "Self-cleaning litter boxes — they sift after each visit so you empty a drawer.",
    categorySlug: "self-cleaning-litter-boxes",
  },
  {
    id: "petcam",
    label: "Check on my pet while I'm out",
    description: "Pet camera robots — a camera on wheels that goes to the animal.",
    categorySlug: "pet-camera-robots",
  },
  {
    id: "companion",
    label: "Company at home",
    description: "Companion robots — desk pets and comfort robots, for a person rather than a task.",
    categorySlug: "companion-robots",
  },
  {
    id: "learning",
    label: "Teach a child to code",
    description: "Educational and coding robots — screen-free for small children, real code for older ones.",
    categorySlug: "educational-coding-robots",
  },
  {
    id: "grill",
    label: "Clean the barbecue",
    description: "Grill-cleaning robots — they scrub the bars so you are not wire-brushing a hot grate.",
    categorySlug: "grill-cleaning-robots",
  },
];

/**
 * How many published products a category needs before the matcher may pick one.
 *
 * TWO, AND THE REASON IS THAT ONE IS NOT A RECOMMENDATION. Running a
 * questionnaire against a single product and announcing it as the match tells
 * a reader a comparison happened when nothing was compared — the same failure
 * the tie guard exists to prevent, arriving from the other direction. Below
 * this, the funnel says we have not finished testing the category and sends
 * them to the hub, which is true and useful.
 */
export const MIN_PRODUCTS_FOR_A_MATCH = 2;

export const jobFor = (id: string): MatcherJob | undefined =>
  MATCHER_JOBS.find((j) => j.id === id);

export const jobForCategory = (categorySlug: string): MatcherJob | undefined =>
  MATCHER_JOBS.find((j) => j.categorySlug === categorySlug);

/** Whether a category has enough published products to produce a real pick. */
export const canMatch = (publishedCount: number): boolean =>
  publishedCount >= MIN_PRODUCTS_FOR_A_MATCH;

/**
 * What the funnel says when a category cannot produce a pick.
 *
 * ONE SENTENCE, AND IT DOES NOT APOLOGISE OR PROMISE A DATE. "We have not
 * finished testing these yet" is the truth; a date would be a commitment
 * nobody made. The hub link matters more than the sentence — the research that
 * does exist is on it.
 */
export const emptyStateFor = (categoryName: string, publishedCount: number): string =>
  publishedCount === 0
    ? `We have not finished testing ${categoryName.toLowerCase()} yet, so there is nothing here we would put our name to. The category page has what we know so far.`
    : `We hold only ${publishedCount === 1 ? "one" : publishedCount} published ${categoryName.toLowerCase().replace(/s$/, "")} so far, which is not enough to call a comparison. The category page has what we know so far.`;
