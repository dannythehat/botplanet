/* ============================================================
   Telling one variant from its siblings.

   THE BUG THIS IS WRITTEN AGAINST, AS FOUND ON THE LIVE SITE.

   The page carried $749.00 for the Dolphin Nautilus CC Plus Wi-Fi.
   Read from amazon.com on 4 August 2026, the real figure was
   $849.00 — and, far worse than being $100 stale, our ASIN turned
   out to be one of NINE size_name variants under a single parent
   (B0HBR6VSXS):

     B09K4C9WGF  Nautilus CC Plus Wi-Fi          $849.00   40 ft   <- ours
     B00Q8M0NWE  Nautilus CC Plus                $829.00
     B0C2JHQVR7  CC Plus Wi-Fi + Caddy           $898.00   50 ft
     ... and six more

   Every one of them publishes Brand "Dolphin" and a Model Name
   built from "Nautilus CC Plus". Our gate matched on the token
   "nautilus cc plus", so ANY of them would have been confirmed as
   our product and had its price published against a review of a
   different machine — and, because BotMatch rules a machine in or
   out on pool length, against a 40 ft limit that belongs to only
   one of them.

   The whole suite passed while that was true. It passed because
   nothing here existed. That is the actual lesson, and it is why
   these tests are about REFUSAL rather than about matching.
   ============================================================ */
import { describe, it, expect } from "vitest";
import { matchIdentity } from "../src/lib/providers/refresh-service";
import { EXPECTED_IDENTITIES } from "../src/lib/providers/expected-identity";
import type { AmazonListing } from "../src/lib/providers/amazon-provider";

const NAUTILUS = EXPECTED_IDENTITIES.find((e) => e.productId === "prod-dolphin-nautilus-cc-plus")!;

/** A listing shaped like the ones SerpApi returns, with only what matters set. */
const listing = (o: {
  asin: string;
  brandName?: string | null;
  modelName?: string | null;
  modelNumber?: string | null;
}): AmazonListing =>
  ({
    asin: o.asin,
    title: "irrelevant — the title is copy the seller writes",
    buyingOptions: [],
    notFound: false,
    attributes: {
      brandName: o.brandName ?? "Dolphin",
      modelName: o.modelName ?? null,
      modelNumber: o.modelNumber ?? null,
      manufacturerPartNumber: null,
    },
  }) as unknown as AmazonListing;

describe("the ASIN that comes back must be the one we asked for", () => {
  it("confirms our own listing", () => {
    const r = matchIdentity(
      NAUTILUS,
      listing({ asin: "B09K4C9WGF", modelName: "Nautilus CC Plus Wi-Fi" }),
    );
    expect(r.confirmed).toBe(true);
  });

  it("refuses a sibling variant even when brand and model name both match", () => {
    /* This is the case that was live. B00Q8M0NWE publishes Model Name
       "Nautilus CC Plus" — a genuine, exact match for the token we used to
       hold — and is a different machine at a different price. */
    const r = matchIdentity(
      NAUTILUS,
      listing({ asin: "B00Q8M0NWE", modelName: "Nautilus CC Plus" }),
    );
    expect(r.confirmed).toBe(false);
    expect(r.evidence).toMatch(/ASIN MISMATCH/);
    expect(r.evidence).toContain("B00Q8M0NWE");
  });

  it("refuses the parent ASIN of the variation family", () => {
    const r = matchIdentity(
      NAUTILUS,
      listing({ asin: "B0HBR6VSXS", modelName: "Nautilus CC Plus Wi-Fi" }),
    );
    expect(r.confirmed).toBe(false);
    expect(r.evidence).toMatch(/ASIN MISMATCH/);
  });

  it("checks the ASIN before anything else, so the reason given is the real one", () => {
    /* A sibling with a wrong brand should still be reported as the ASIN
       problem it is — otherwise the log sends someone chasing a brand bug. */
    const r = matchIdentity(
      NAUTILUS,
      listing({ asin: "B00Q8M0NWE", brandName: "Maytronics", modelName: "Nautilus CC Plus" }),
    );
    expect(r.evidence).toMatch(/ASIN MISMATCH/);
    expect(r.evidence).not.toMatch(/Brand mismatch/);
  });
});

describe("the model tokens name the variant, not the family", () => {
  it("no longer accepts the bare family name", () => {
    /* Belt and braces behind the ASIN check: even reached with the right
       ASIN, a listing whose model name lacks Wi-Fi is not our machine. */
    const r = matchIdentity(
      NAUTILUS,
      listing({ asin: "B09K4C9WGF", modelName: "Nautilus CC Plus" }),
    );
    expect(r.confirmed).toBe(false);
    expect(r.evidence).toMatch(/No identity field names the model/);
  });

  it("refuses the caddy and cover bundles, which are priced differently", () => {
    for (const name of [
      "Nautilus CC Plus Wi-Fi + Caddy",
      "Nautilus CC Plus Wi-Fi + Caddy + Cover",
      "Nautilus CC with Caddy and Cover",
    ]) {
      const r = matchIdentity(NAUTILUS, listing({ asin: "B09K4C9WGF", modelName: name }));
      expect(r.confirmed, `${name} was accepted`).toBe(false);
    }
  });

  it("still accepts the real spelling, however Amazon punctuates Wi-Fi", () => {
    for (const name of ["Nautilus CC Plus Wi-Fi", "Nautilus CC Plus WiFi", "NAUTILUS CC PLUS WI-FI"]) {
      const r = matchIdentity(NAUTILUS, listing({ asin: "B09K4C9WGF", modelName: name }));
      expect(r.confirmed, `${name} was rejected`).toBe(true);
    }
  });
});

describe("every product in the register is guarded the same way", () => {
  it("a wrong ASIN is refused for all of them, not just the one that broke", () => {
    for (const e of EXPECTED_IDENTITIES) {
      const r = matchIdentity(e, listing({ asin: "B000000000", brandName: e.brand }));
      expect(r.confirmed, `${e.productId} accepted a foreign ASIN`).toBe(false);
      expect(r.evidence).toMatch(/ASIN MISMATCH/);
    }
  });
});
