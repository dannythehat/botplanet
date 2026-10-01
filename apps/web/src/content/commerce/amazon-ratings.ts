/**
 * AMAZON'S OWN STAR RATINGS, as displayed on each listing, with the day they were read.
 *
 * THESE ARE NOT OURS. They are a third party's figures, shown as such: labelled
 * "Amazon rating", with the count and the date, never combined into a BotPlanet score
 * and never put in structured data (schema.org rating markup is for a site's own
 * reviews, and marking up Amazon's would claim a rating we did not collect).
 *
 * WHERE THEY COME FROM. Amazon serves a fetch only the page head, so the owner reads
 * each listing on a phone and sends a screenshot. Every row records that. A row with no
 * date is not allowed, and a row older than the shelf life in test/amazon-ratings.test.ts
 * fails the build, the same way a stale price does: a rating that has drifted is worse
 * than none.
 *
 * NEVER INVENT ONE. A product with no row here shows no rating.
 */
export interface AmazonRating {
  /** Stars out of 5, as Amazon prints it. */
  rating: number;
  /** The number of ratings when Amazon prints an exact one. */
  ratings: number | null;
  /** The count as Amazon prints it ("2,374", or "3K" when it rounds). */
  ratingsLabel: string;
  /** YYYY-MM-DD the listing was read. */
  readOn: string;
  source: string;
}

const OWNER = "Owner's screenshot of the Amazon US listing";

export const AMAZON_RATINGS: Record<string, AmazonRating> = {
  "aiper-ecosurfer-s2": { rating: 4.4, ratings: 2374, ratingsLabel: "2,374", readOn: "2026-10-01", source: OWNER },
  "beatbot-iskim": { rating: 4.4, ratings: 303, ratingsLabel: "303", readOn: "2026-10-01", source: OWNER },
  "brinbo-sk01": { rating: 4.7, ratings: 28, ratingsLabel: "28", readOn: "2026-10-01", source: OWNER },
  /* Read off the "Solar powered operation" carousel, where Amazon rounds the count to
     3K. Betta's own SE listing is a different product with a different rating. */
  "betta-se-plus": { rating: 4.5, ratings: null, ratingsLabel: "3K", readOn: "2026-10-01", source: "Owner's screenshot of Amazon US search results" },
};

export const ratingFor = (slug: string): AmazonRating | undefined => AMAZON_RATINGS[slug];

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
/** "1 Oct 2026". */
export function readOnLabel(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return `${d} ${MONTHS[m - 1]} ${y}`;
}
