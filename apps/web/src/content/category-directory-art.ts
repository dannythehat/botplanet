/**
 * Artwork for the robot-category directory.
 *
 * Category index images are deliberately real category scenes, never borrowed
 * product imagery. Focal points protect the subject when the 16:9 masters are
 * cropped into directory cards.
 */
export interface CategoryDirectoryArt {
  src: string;
  alt: string;
  focal?: string;
}

export const CATEGORY_DIRECTORY_ART: Record<string, CategoryDirectoryArt> = {
  "robotic-pool-cleaners": {
    src: "/media/hubs/pool/tile.webp",
    alt: "A tracked robotic pool cleaner resting at the edge of a sunlit blue pool.",
  },
  "window-cleaning-robots": {
    src: "/media/window-category/feature-desktop.webp",
    focal: "24% center",
    alt: "A window-cleaning robot gripping the glass of a hillside home at dusk.",
  },
  "robotic-lawn-mowers": {
    src: "/media/hubs/lawn/hero.webp",
    alt: "A robotic lawn mower crossing a striped lawn in front of a country home.",
  },
  "robot-vacuums": {
    src: "/media/hubs/vacuums/hero.webp",
    focal: "70% center",
    alt: "A robot vacuum cleaning the wood floor of a bright open-plan living room.",
  },
  "companion-robots": {
    src: "/media/hubs/companion/tile.webp",
    alt: "A group of companion robots and robot pets standing together.",
  },
  "pet-camera-robots": {
    src: "/media/hubs/petcam/tile.webp",
    alt: "A pet camera robot beside its charging dock.",
  },
  "self-cleaning-litter-boxes": {
    src: "/media/hubs/litter/hero.webp",
    focal: "60% center",
    alt: "A long-haired tabby approaching a self-cleaning litter box in a utility room.",
  },
  "grill-cleaning-robots": {
    src: "/media/hubs/grill/tile.webp",
    alt: "A grill-cleaning robot sitting on stainless steel barbecue grates.",
  },
  "educational-coding-robots": {
    src: "/media/hubs/coding/hero.webp",
    focal: "60% center",
    alt: "A child's hands beside a tracked coding robot and its parts on a table.",
  },
};
