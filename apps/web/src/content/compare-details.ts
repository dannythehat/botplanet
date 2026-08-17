export interface CompareCategoryDetail {
  intro: string;
  compareOn: string[];
  action: string;
}

/**
 * The questions that genuinely change a comparison in each robot category.
 * Kept as data so the universal comparison page can never borrow pool-specific
 * language for a different kind of machine again.
 */
export const COMPARE_CATEGORY_DETAILS: Record<string, CompareCategoryDetail> = {
  "robotic-pool-cleaners": {
    intro: "Match the cleaner to the pool before comparing runtime or price.",
    compareOn: ["Pool size", "Floor, walls & waterline", "Corded or cordless", "Debris & filtration"],
    action: "Compare pool cleaners",
  },
  "window-cleaning-robots": {
    intro: "Start with the glass, the frame and how safely the robot can reach it.",
    compareOn: ["Framed or frameless", "Power & safety tether", "Edge detection", "Cleaning pattern"],
    action: "Compare window robots",
  },
  "robotic-lawn-mowers": {
    intro: "Lawn area, slopes and tree cover decide which navigation system will work.",
    compareOn: ["Lawn area", "Worst slope", "Wire, vision or RTK", "Zones & obstacles"],
    action: "Compare robot mowers",
  },
  "robot-vacuums": {
    intro: "Compare against the actual floors, thresholds, pets and cleaning routine in the home.",
    compareOn: ["Floor mix", "Pet hair", "Mopping system", "Dock & obstacle avoidance"],
    action: "Compare robot vacuums",
  },
  "companion-robots": {
    intro: "The right companion depends on who it is for and what kind of interaction feels natural.",
    compareOn: ["Who it is for", "Interaction style", "Subscription", "Camera & privacy"],
    action: "Compare companion robots",
  },
  "pet-camera-robots": {
    intro: "Mobility matters as much as the camera when the robot has to follow life around the home.",
    compareOn: ["Stairs & thresholds", "Camera view", "Treat dispenser", "Docking & battery"],
    action: "Compare pet camera robots",
  },
  "self-cleaning-litter-boxes": {
    intro: "Cat size and safety come first; capacity and app features come afterwards.",
    compareOn: ["Cat size & age", "Entry size", "Litter compatibility", "Multi-cat capacity"],
    action: "Compare litter boxes",
  },
  "grill-cleaning-robots": {
    intro: "The grate material and grill shape decide whether a cleaner can do useful work safely.",
    compareOn: ["Grate material", "Grill dimensions", "Edges & corners", "Power & upkeep"],
    action: "Compare grill cleaners",
  },
  "educational-coding-robots": {
    intro: "Age, reading level and available devices matter more than the length of the feature list.",
    compareOn: ["Age & experience", "Screen-free or app", "Coding progression", "Parts & accessories"],
    action: "Compare coding robots",
  },
};
