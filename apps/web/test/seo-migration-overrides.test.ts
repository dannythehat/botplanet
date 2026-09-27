import { describe, expect, it } from "vitest";
import {
  isSeoMigrationRetiredPath,
  SEO_MIGRATION_REDIRECTS,
} from "../src/content/seo-migration-overrides";
import { resolveRedirect } from "../src/lib/routing";

const expectedRedirects: Record<string, string> = {
  "/reviews/emo-ai-desktop-pet-review-your-new-desk-bestie/":
    "/robots/companion-robots/living-ai-emo/",
  "/product/botley-2-coding-robot/":
    "/robots/educational-coding-robots/botley-the-coding-robot/",
  "/reviews/mammotion-luba-2-awd-review-the-lawn-mowing-beast/":
    "/robots/robotic-lawn-mowers/",
  "/reviews/makeblock-mbot2-review-more-than-just-a-blue-toy-on-wheels/":
    "/robots/educational-coding-robots/",
  "/reviews/shark-ai-ultra-review-scrappy-smart-and-sucks-in-a-good-way/":
    "/robots/robot-vacuums/",
  "/reviews/shark-ai-ultra-review-the-blue-collar-hero-your-carpet-deserves/":
    "/robots/robot-vacuums/",
  "/product/dreame-l20-ultra/": "/robots/robot-vacuums/",
  "/product/matatastudio-vincibot/": "/robots/educational-coding-robots/",
  "/blog/nicoo-realistic-robot-puppy-review-all-bark-no-bite-and-no-poop/":
    "/guides/robot-dog-toys/",
  "/reviews/nicoo-realistic-robot-puppy-review-all-bark-no-bite-and-no-poop/":
    "/guides/robot-dog-toys/",
  "/product/unitree-go2-pro/": "/guides/robot-dog-toys/",
};

const retired = [
  "/security-robots/",
  "/home-security-robots/",
  "/reviews/amazon-echo-show-10-review-the-screen-that-follows-you/",
  "/reviews/amazon-echo-show-10-review-the-smart-display-that-follows-you/",
  "/reviews/amazon-echo-show-10-review-the-speaker-that-follows-you-around/",
  "/reviews/temi-personal-robot-v3-review-the-butler-we-deserve/",
  "/category/kitchen-robots/",
];

describe("Search Console migration overrides", () => {
  it("maps every recovered legacy URL to its intended one-hop successor", () => {
    for (const [from, to] of Object.entries(expectedRedirects)) {
      expect(SEO_MIGRATION_REDIRECTS[from], from).toBe(to);
      const result = resolveRedirect(from);
      expect(result?.status, from).toBe(301);
      expect(result?.to, from).toBe(to);
      expect(resolveRedirect(to), `${from} -> ${to} creates a chain`).toBeNull();
    }
  });

  it("retires out-of-scope legacy URLs before redirect resolution", () => {
    for (const path of retired) {
      expect(isSeoMigrationRetiredPath(path), path).toBe(true);
      expect(isSeoMigrationRetiredPath(path.replace(/\/$/, "")), path).toBe(true);
    }
  });

  it("does not accidentally retire current replacement pages", () => {
    for (const to of Object.values(expectedRedirects)) {
      expect(isSeoMigrationRetiredPath(to), to).toBe(false);
    }
  });
});
