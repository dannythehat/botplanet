import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { AMAZON_ASSOCIATE_TAG, AMAZON_ASSOCIATE_TAG_STATUS, amazonDestination } from "../src/lib/site";
import { REPORTING_SYSTEMS } from "../src/lib/reporting";
import { AIPER_PROGRAMME_TERMS } from "../src/content/media/cj";
import { DESTINATIONS, destinationFor } from "../src/content/commerce/destinations";

const ADMIN_DASHBOARD = "apps/web/src/pages/admin/index.astro";
const adminSource = () => readFileSync(ADMIN_DASHBOARD, "utf8");

describe("Amazon referral configuration", () => {
  it("uses Danny's confirmed BotPlanet tracking tag", () => {
    expect(AMAZON_ASSOCIATE_TAG).toBe("botplanet-20");
    expect(AMAZON_ASSOCIATE_TAG_STATUS).toContain("owner-confirmed and active");
  });

  it("appends the tag to a clean Amazon product URL", () => {
    expect(amazonDestination("https://www.amazon.com/dp/B0BX9DJS7R")).toBe(
      "https://www.amazon.com/dp/B0BX9DJS7R?tag=botplanet-20",
    );
  });

  it("appends the tag correctly when the Amazon URL already has a query string", () => {
    expect(amazonDestination("https://www.amazon.com/s?k=robotic+pool+cleaner")).toBe(
      "https://www.amazon.com/s?k=robotic+pool+cleaner&tag=botplanet-20",
    );
  });

  it("updates an existing tag instead of appending a duplicate", () => {
    expect(amazonDestination("https://www.amazon.com/dp/B0BX9DJS7R?tag=old-id-20")).toBe(
      "https://www.amazon.com/dp/B0BX9DJS7R?tag=botplanet-20",
    );
  });

  it("puts the tracking tag before a URL fragment so Amazon receives it", () => {
    expect(amazonDestination("https://www.amazon.com/dp/B0BX9DJS7R#reviews")).toBe(
      "https://www.amazon.com/dp/B0BX9DJS7R?tag=botplanet-20#reviews",
    );
  });

  it("keeps a deliberately unmonetised marketplace link free of tracking tags", () => {
    expect(amazonDestination("https://www.amazon.com.au/s?k=robot&tag=stale-20", null)).toBe(
      "https://www.amazon.com.au/s?k=robot",
    );
  });

  it("centralises guide Amazon tags and marks /go links as sponsored", () => {
    const guide = readFileSync("apps/web/src/pages/guides/robot-dog-toys.astro", "utf8");
    expect(guide).toContain('import { amazonDestination } from "../../lib/site"');
    expect(guide).not.toContain("tag=botplanet-20");
    expect(guide).toContain('pick.buyHref.startsWith("/go/")');
    expect(guide).toContain("Search Amazon for Ruko 18011");
  });

  it("keeps raw catalogue destinations untagged so the central builder remains the only tagging point", () => {
    for (const destination of DESTINATIONS) {
      expect(destination.sourceUrl ?? "").not.toContain("tag=");
    }
  });
});

describe("homepage guide and affiliate semantics", () => {
  it("renders the robot-dog buying-guide feature once from the homepage", () => {
    const homepage = readFileSync("apps/web/src/pages/index.astro", "utf8");
    expect(homepage.match(/<section class="featured-guide"/g) ?? []).toHaveLength(1);
    expect(homepage).toContain('href="/guides/robot-dog-toys/"');
    const layout = readFileSync("apps/web/src/layouts/Base.astro", "utf8");
    const footer = readFileSync("apps/web/src/components/Footer.astro", "utf8");
    expect(layout).not.toContain("HomepageRobotDogFeature");
    expect(footer).not.toContain('<section class="home-dog-guide"');
  });

  it("never labels an unpriced listing as a verified price check", () => {
    const buyBox = readFileSync("apps/web/src/components/BuyBox.astro", "utf8");
    expect(buyBox).toContain('lead.price ? "Price checked" : "Listing last checked"');
  });
});

describe("production deploy smoke tests", () => {
  it("checks real homepage HTML for duplicated buying guide sections", () => {
    const workflow = readFileSync(".github/workflows/deploy-botplanet.yml", "utf8");
    expect(workflow).toContain("Verify deployed buying-guide HTML");
    expect(workflow).toContain('guide_count');
    expect(workflow).toContain('Search Amazon for Ruko 18011');
  });
});

describe("Amazon internal surfaces", () => {
  it("admin derives its status and wording from the central tag configuration", () => {
    const src = adminSource();
    expect(src).toContain("AMAZON_ASSOCIATE_TAG");
    expect(src).toContain("AMAZON_ASSOCIATE_TAG_STATUS");
    expect(src).toContain("amazonEarningsNote");
    expect(src).not.toMatch(/>\s*LIVE\s*</);
  });

  it("reporting identifies the active tag without claiming sales that have not been reported", () => {
    const amazon = REPORTING_SYSTEMS.find((system) => system.id === "amazon-associates");
    expect(amazon).toBeDefined();
    expect(amazon?.provider).toContain("botplanet-20");
    expect(amazon?.ownerAction).toContain("Reports → Earnings");
    expect(amazon?.notes).toContain("Tag verified and applied");
  });
});

describe("CJ and Aiper truth remains unchanged", () => {
  it("keeps the accepted Aiper programme terms", () => {
    expect(AIPER_PROGRAMME_TERMS.relationship).toBe("approved and active");
    expect(AIPER_PROGRAMME_TERMS.baseCommissionPercent).toBe(8);
    expect(AIPER_PROGRAMME_TERMS.promotionalCommissionMaxPercent).toBe(15);
    expect(AIPER_PROGRAMME_TERMS.cookieDays).toBe(45);
  });

  it("keeps product-level Aiper CJ deep links blocked while the clause is unresolved", () => {
    expect(AIPER_PROGRAMME_TERMS.directLinkPolicy.status).toBe("restricted_unclarified");
    for (const id of ["prod-aiper-scuba-x1", "prod-aiper-scuba-s1", "prod-aiper-seagull-se"]) {
      expect(destinationFor(id, "ret-aiper-store")).toBeUndefined();
      for (const destination of DESTINATIONS.filter((item) => item.productId === id)) {
        expect(destination.retailerId).toBe("ret-amazon");
      }
    }
  });

  it("does not restore the rejected CJ onboarding wording", () => {
    expect(adminSource()).not.toMatch(/onboarding (incomplete|checklist)/i);
  });
});

describe("stale operational claims stay absent", () => {
  it("does not hardcode the previously rejected phrases in corrected surfaces", () => {
    for (const file of [ADMIN_DASHBOARD, "apps/web/src/lib/reporting.ts"]) {
      const src = readFileSync(file, "utf8");
      expect(src).not.toMatch(/approved\s*(&|&amp;|and)\s*live/i);
      expect(src).not.toMatch(/No setup needed/i);
      expect(src).not.toMatch(/onboarding incomplete/i);
    }
  });
});
