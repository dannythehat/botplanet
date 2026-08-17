/**
 * OWNER-APPROVED HOMEPAGE CONTRACT — 17 AUGUST 2026.
 *
 * The homepage was reviewed visually, technically and on production, then
 * explicitly approved by Danny. These assertions are a deployment lock, not a
 * snapshot of incidental markup: changing any approved promise below requires
 * a deliberate edit to this file in the same PR. Because the production
 * workflow runs the full test suite before deploy, an accidental regression
 * can reach main but cannot replace the approved Worker version.
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { BAR_ITEMS } from "../src/content/nav-surfaces";
import { routeFor } from "../src/content/routes";
import { shellJourneyFor } from "../src/content/journeys";
import { categoryCanMatch } from "../src/content/matcher-router";

const HOME = readFileSync(
  fileURLToPath(new URL("../src/pages/index.astro", import.meta.url)),
  "utf8",
);
const BASE = readFileSync(
  fileURLToPath(new URL("../src/layouts/Base.astro", import.meta.url)),
  "utf8",
);
const SEO = readFileSync(
  fileURLToPath(new URL("../src/lib/seo.ts", import.meta.url)),
  "utf8",
);

/** Reader-visible template only: comments and CSS record old defects by name. */
const HOME_COPY = HOME
  .replace(/<style>[\s\S]*?<\/style>/g, "")
  .replace(/\{\/\*[\s\S]*?\*\/\}/g, "")
  .replace(/\/\*[\s\S]*?\*\//g, "")
  .replace(/<!--([\s\S]*?)-->/g, "");

describe("the approved homepage stays approved", () => {
  it("keeps the owner-approved navigation in the approved order", () => {
    expect(BAR_ITEMS.slice(0, 3).map(({ label, href }) => ({ label, href }))).toEqual([
      { label: "Find My Robot", href: "/botmatch/" },
      { label: "Compare", href: "/compare/" },
      { label: "Buying Advice", href: "/guides/" },
    ]);

    expect(routeFor("/robots/")).toMatchObject({
      label: "Robot Categories",
      navSurface: "none",
    });
    expect(routeFor("/deals/")).toMatchObject({
      navSurface: "none",
      footerGroup: null,
      inSitemap: false,
      indexable: false,
    });
  });

  it("keeps the universal homepage journey", () => {
    expect(shellJourneyFor("/", { canMatch: categoryCanMatch })).toMatchObject({
      category: "universal",
      ctaLabel: "Find My Robot",
      subject: "robot",
      href: "/botmatch/",
    });
  });

  it("keeps the two approved hero actions and no category default", () => {
    expect(HOME_COPY).toContain(
      '<a class="btn btn--accent btn--lg" href="/botmatch/">Find your robot</a>',
    );
    expect(HOME_COPY).toContain(
      '<a class="btn btn--primary btn--lg" href="#robot-worlds">Explore robot categories</a>',
    );
    expect(HOME_COPY).not.toMatch(
      /Find My Pool Cleaner|Explore robotic pool cleaners|9 categories are live|9 robot worlds/i,
    );
  });

  it("keeps the approved category-directory language", () => {
    expect(HOME_COPY).toContain("<h2>Robots that earn their place.</h2>");
    expect(HOME_COPY).toContain(
      "Explore useful robots for your home, garden and everyday life. Compare what they do,",
    );
    expect(HOME_COPY).toContain(
      "where they fall short and which models are genuinely worth considering.",
    );
    expect(HOME_COPY).not.toContain("evidence model");
    expect(HOME_COPY).not.toContain("recommendation journey");
  });

  it("keeps the approved homepage search presentation", () => {
    expect(HOME).toContain(
      'title="Home Robots: Reviews, Comparisons & Buying Advice | BotPlanet"',
    );
    expect(HOME).toContain(
      '"Independent comparisons and buying advice for home robots — robot vacuums, lawn mowers, "',
    );
    expect(HOME).toContain(
      '"pool cleaners, window robots, litter boxes and more."',
    );
    expect(HOME).toContain('type: "CollectionPage"');
    expect(HOME).toContain("categoryList");
  });

  it("keeps the corrected organization and social descriptions", () => {
    expect(SEO).toContain(
      '"BotPlanet helps people discover, compare and choose useful real-world robots for homes, gardens and everyday life in the United States."',
    );
    expect(SEO).not.toContain("starting with robotic pool cleaners");
    expect(BASE).toContain(
      'content="BotPlanet — independent robot comparisons, evidence and buying advice"',
    );
    expect(BASE).not.toContain("shop real-world robots");
  });

  it("keeps the approved wide hero and centred BotMatch close", () => {
    expect(HOME).toContain(
      ".hero__grid { display: grid; grid-template-columns: 1fr; max-width: 1440px;",
    );
    expect(HOME).toContain("margin: 26px auto 0;");
    expect(HOME).toContain("text-align: center;");
    expect(HOME).toContain(
      ".botmatch__actions { display: flex; flex-wrap: wrap; justify-content: center;",
    );
  });
});
