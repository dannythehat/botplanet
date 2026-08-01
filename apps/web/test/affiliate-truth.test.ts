import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { AMAZON_ASSOCIATE_TAG, AMAZON_ASSOCIATE_TAG_STATUS, amazonDestination } from "../src/lib/site";
import { REPORTING_SYSTEMS } from "../src/lib/reporting";
import { AIPER_PROGRAMME_TERMS } from "../src/content/media/cj";
import { DESTINATIONS, destinationFor } from "../src/content/commerce/destinations";

/**
 * Affiliate truth guards — the regression tests behind the 1 August 2026
 * integration correction.
 *
 * The failure these exist to prevent: the offer system withheld the Amazon
 * tag because Associates ownership and approval are unverified, while the
 * admin dashboard and reporting register went on describing Amazon as
 * "approved & live (botplanet-20)". Two surfaces, two truths. Every claim an
 * internal surface makes about a programme must be DERIVED from the same
 * authoritative configuration the offer system uses, so a stale sentence can
 * never again outlive the state it described.
 */

const ADMIN_DASHBOARD = "apps/web/src/pages/admin/index.astro";
const adminSource = () => readFileSync(ADMIN_DASHBOARD, "utf8");

describe("Amazon truth (guarantee 1: no LIVE rendering while the tag is null)", () => {
  it("admin dashboard derives Amazon status from lib/site.ts rather than hardcoding it", () => {
    const src = adminSource();
    expect(src).toContain("AMAZON_ASSOCIATE_TAG");
    expect(src).toContain("AMAZON_ASSOCIATE_TAG_STATUS");
  });

  it("admin dashboard hardcodes no live-programme claim", () => {
    const src = adminSource();
    // The card headline must be computed, never a literal earning claim.
    expect(src).not.toMatch(/>\s*LIVE\s*</);
    expect(src).not.toMatch(/approved\s*(&|&amp;|and)\s*live/i);
  });
});

describe("Amazon truth (guarantee 2: the historical tag is not active configuration)", () => {
  it("the authoritative tag is null until ownership and approval are evidenced", () => {
    expect(AMAZON_ASSOCIATE_TAG).toBeNull();
    expect(AMAZON_ASSOCIATE_TAG_STATUS).toContain("unverified");
  });

  it("the historical tag value appears in no rendered internal surface", () => {
    expect(adminSource()).not.toContain("botplanet-20");
    const reporting = readFileSync("apps/web/src/lib/reporting.ts", "utf8");
    // Permitted only as unverified history in prose — never as the provider
    // identity or as a claim of active configuration.
    expect(reporting).not.toContain("botplanet-20");
  });
});

describe("Amazon truth (guarantee 3: reporting cannot claim approved/live)", () => {
  const amazon = REPORTING_SYSTEMS.find((s) => s.id === "amazon-associates")!;

  it("exists and stays honest about access", () => {
    expect(amazon).toBeDefined();
    expect(amazon.status).toBe("no_access");
  });

  it("describes the unverified state while the tag is null", () => {
    if (AMAZON_ASSOCIATE_TAG === null) {
      const text = JSON.stringify(amazon);
      expect(text).not.toMatch(/approved and live|approved & live|No setup needed/i);
      expect(amazon.provider).toContain("unverified");
      expect(amazon.ownerAction).toContain("Confirm Amazon Associates account ownership");
      expect(amazon.notes).toContain("retailer destination only");
    }
  });
});

describe("Amazon truth (guarantee 4: destinations stay untagged while the tag is null)", () => {
  it("amazonDestination appends nothing", () => {
    const url = "https://www.amazon.com/dp/B0BX9DJS7R";
    expect(amazonDestination(url)).toBe(url);
    expect(amazonDestination("https://www.amazon.com/s?k=x")).not.toContain("tag=");
  });

  it("no recorded destination carries an affiliate tag parameter", () => {
    for (const d of DESTINATIONS) {
      expect(d.sourceUrl ?? "").not.toContain("tag=");
    }
  });
});

describe("CJ truth (guarantee 5: onboarding-incomplete cannot return)", () => {
  it("admin dashboard derives CJ state from the programme-terms record", () => {
    const src = adminSource();
    expect(src).toContain("AIPER_PROGRAMME_TERMS");
    expect(src).not.toMatch(/onboarding (incomplete|checklist)/i);
  });

  it("the authoritative record says accepted and active with the welcome-email terms", () => {
    expect(AIPER_PROGRAMME_TERMS.relationship).toBe("approved and active");
    expect(AIPER_PROGRAMME_TERMS.baseCommissionPercent).toBe(8);
    expect(AIPER_PROGRAMME_TERMS.promotionalCommissionMaxPercent).toBe(15);
    expect(AIPER_PROGRAMME_TERMS.cookieDays).toBe(45);
  });
});

describe("Aiper truth (guarantee 6: deep links stay unpublishable while unresolved)", () => {
  it("the direct-link policy is still unresolved, and no Aiper CJ destination exists", () => {
    // The full structural block lives in cj.test.ts (accepted tests). This
    // cross-check ties policy to routes: while the clause is unclarified, no
    // live destination may route an Aiper product anywhere but Amazon.
    expect(AIPER_PROGRAMME_TERMS.directLinkPolicy.status).toBe("restricted_unclarified");
    for (const id of ["prod-aiper-scuba-x1", "prod-aiper-scuba-s1", "prod-aiper-seagull-se"]) {
      expect(destinationFor(id, "ret-aiper-store")).toBeUndefined();
      for (const d of DESTINATIONS.filter((x) => x.productId === id)) {
        expect(d.retailerId).toBe("ret-amazon");
      }
    }
  });
});

describe("stale-phrase sweep of the corrected surfaces", () => {
  it("neither corrected file claims the rejected state", () => {
    for (const file of [ADMIN_DASHBOARD, "apps/web/src/lib/reporting.ts"]) {
      const src = readFileSync(file, "utf8");
      expect(src).not.toMatch(/approved\s*(&|&amp;|and)\s*live/i);
      expect(src).not.toMatch(/No setup needed/i);
      expect(src).not.toMatch(/onboarding incomplete/i);
    }
  });
});
