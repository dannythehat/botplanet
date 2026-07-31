import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import {
  AWIN_CONSERVATIVE_RIGHTS,
  AWIN_DATAFEED_SECRET_REF,
  AWIN_IMAGES,
  AWIN_INGESTION_BLOCKER,
  AWIN_LAUNCH_BRAND_COVERAGE,
  AWIN_PROGRAMMES,
  AWIN_PUBLISHER_ID,
  AWIN_TOKEN_SECRET_REF,
  AWIN_WYBOT_EU_ADVERTISER_ID,
  AWIN_WYBOT_US_ADVERTISER_ID,
  WYBOT_EU_PROGRAMME,
  WYBOT_MATCHERS,
  WYBOT_US_PROGRAMME,
  WYBOT_US_TERMS,
  matchWybotModel,
} from "../src/content/media/awin";
import { fetchDatafeedList, fetchProgrammeTerms, fetchRelationshipStatus, ingestFeedRows, isAwinStatusStale, redactAwin } from "../src/lib/awin-client";
import { ACQUISITION_BLOCKERS, MEDIA_ASSETS } from "../src/content/media/assets";
import { CREDENTIAL_PATTERNS, resolveImage } from "../src/lib/media-registry";

describe("Awin programme identity", () => {
  it("keeps the EU and US WYBOT programmes apart", () => {
    expect(AWIN_WYBOT_EU_ADVERTISER_ID).toBe("115280");
    expect(AWIN_WYBOT_US_ADVERTISER_ID).toBe("76816");
    expect(WYBOT_EU_PROGRAMME.countryCode).toBe("DE");
    expect(WYBOT_US_PROGRAMME.countryCode).toBe("US");
  });

  it("records the US programme as awaiting advertiser approval", () => {
    expect(WYBOT_US_PROGRAMME.relationship).toBe("pending");
    expect(AWIN_INGESTION_BLOCKER.status).toBe("awaiting_advertiser_approval");
    expect(AWIN_INGESTION_BLOCKER.owner).toBe("manufacturer");
  });

  it("refuses to treat the joined EU programme as usable on the US site", () => {
    expect(WYBOT_EU_PROGRAMME.relationship).toBe("joined");
    expect(WYBOT_EU_PROGRAMME.usableForUsSite).toBe(false);
    expect(WYBOT_US_PROGRAMME.usableForUsSite).toBe(false);
    expect(AWIN_PROGRAMMES.some((p) => p.usableForUsSite)).toBe(false);
  });

  it("records what the directory scan actually found for the other nine brands", () => {
    expect(AWIN_LAUNCH_BRAND_COVERAGE.totalProgrammesScanned).toBe(21429);
    const byBrand = Object.fromEntries(AWIN_LAUNCH_BRAND_COVERAGE.findings.map((f) => [f.brand, f.result]));
    expect(byBrand["WYBOT"]).toContain("76816");
    expect(byBrand["Aiper"]).toContain("not on Awin");
    expect(byBrand["Beatbot"]).toContain("EU only");
    expect(byBrand["Maytronics / Dolphin"]).toContain("not on Awin");
  });
});

describe("relationship checking", () => {
  const rows = {
    joined: [{ id: 115280, name: "Wybot EU", currencyCode: "EUR", status: "Active", primaryRegion: { countryCode: "DE" } }],
    pending: [{ id: 76816, name: "WYBOTICS INC", currencyCode: "USD", status: "Active", primaryRegion: { countryCode: "US" } }],
    rejected: [],
  } as Record<string, unknown[]>;

  const fake = (buckets = rows) =>
    (async (url: string) => {
      const rel = new URL(url).searchParams.get("relationship")!;
      return new Response(JSON.stringify(buckets[rel] ?? []), { status: 200 });
    }) as unknown as typeof fetch;

  it("reports the US programme as pending", async () => {
    const res = await fetchRelationshipStatus("76816", { AWIN_API_TOKEN: "t" }, fake());
    expect(res.ok).toBe(true);
    if (!res.ok) return;
    expect(res.status).toBe("pending");
    expect(res.programme!.name).toBe("WYBOTICS INC");
    expect(res.programme!.usableForUsSite).toBe(false);
  });

  it("marks the US programme usable only once actually joined", async () => {
    const joinedNow = { joined: [{ id: 76816, name: "WYBOTICS INC", currencyCode: "USD", status: "Active", primaryRegion: { countryCode: "US" } }], pending: [], rejected: [] };
    const res = await fetchRelationshipStatus("76816", { AWIN_API_TOKEN: "t" }, fake(joinedNow as Record<string, unknown[]>));
    if (!res.ok) return;
    expect(res.status).toBe("joined");
    expect(res.programme!.usableForUsSite).toBe(true);
  });

  it("never marks a joined EU programme usable on the US site", async () => {
    const res = await fetchRelationshipStatus("115280", { AWIN_API_TOKEN: "t" }, fake());
    if (!res.ok) return;
    expect(res.status).toBe("joined");
    expect(res.programme!.usableForUsSite).toBe(false);
  });

  it("returns notjoined for an advertiser never applied for", async () => {
    const res = await fetchRelationshipStatus("999999", { AWIN_API_TOKEN: "t" }, fake());
    if (!res.ok) return;
    expect(res.status).toBe("notjoined");
    expect(res.programme).toBeNull();
  });

  it("detects a stale stored status", () => {
    expect(isAwinStatusStale("pending", "joined")).toBe(true);
    expect(isAwinStatusStale("pending", "rejected")).toBe(true);
    expect(isAwinStatusStale("pending", "pending")).toBe(false);
  });

  it("tells a pending application apart from a broken credential", async () => {
    const gated = (async () =>
      new Response(JSON.stringify({ error: "missing.relationship", description: "No relationship exists" }), { status: 401 })) as unknown as typeof fetch;
    const res = await fetchProgrammeTerms("76816", { AWIN_API_TOKEN: "t" }, gated);
    expect(res.ok).toBe(false);
    if (!res.ok) expect(res.reason).toBe("no_relationship");

    const badToken = (async () => new Response("nope", { status: 401 })) as unknown as typeof fetch;
    const res2 = await fetchProgrammeTerms("76816", { AWIN_API_TOKEN: "t" }, badToken);
    if (!res2.ok) expect(res2.reason).toBe("unauthorized");
  });
});

describe("WYBOT exact-model matching", () => {
  it("matches the C1", () => {
    expect(matchWybotModel("WYBOT C1 Cordless Robotic Pool Cleaner").productId).toBe("prod-wybot-c1");
    expect(matchWybotModel("WYBOT C1").productId).toBe("prod-wybot-c1");
  });

  it("rejects every C1 sibling", () => {
    for (const t of ["WYBOT C1 Pro", "WYBOT C1 Max", "WYBOT C1 Pro Max", "WYBOT C2", "WYBOT C1 Mini"]) {
      const m = matchWybotModel(t);
      expect(m.productId).toBeNull();
      expect(m.confidence).toBe("rejected");
    }
  });

  it("names the variant token in the rejection", () => {
    expect(matchWybotModel("WYBOT C1 Pro").reason).toContain("pro");
    expect(matchWybotModel("WYBOT C1 Max").reason).toContain("max");
  });

  it("refuses a bare C1 that names no WYBOT brand", () => {
    const m = matchWybotModel("Generic C1 Pool Robot");
    expect(m.productId).toBeNull();
    expect(m.reason).toContain("names no WYBOT brand");
  });

  it("leaks no other launch brand into the WYBOT slot", () => {
    for (const t of ["Aiper Scuba X1", "Dolphin E10", "Betta SE Plus", "Beatbot AquaSense 2 Ultra", "Polaris FREEDOM"]) {
      expect(matchWybotModel(t).productId).toBeNull();
    }
  });

  it("cannot be fooled by punctuation hiding a variant", () => {
    expect(matchWybotModel("WYBOT C1-Pro").productId).toBeNull();
    expect(matchWybotModel("WYBOT C1 / Max").productId).toBeNull();
  });

  it("targets only the C1 for now", () => {
    expect(WYBOT_MATCHERS).toHaveLength(1);
    expect(WYBOT_MATCHERS[0].productId).toBe("prod-wybot-c1");
  });
});

describe("feed ingestion", () => {
  it("keeps the C1 and drops its siblings", () => {
    const summary = ingestFeedRows([
      { aw_product_id: "1", brand_name: "WYBOT", product_name: "C1 Cordless Robotic Pool Cleaner", merchant_image_url: "https://cdn.example/c1.jpg" },
      { aw_product_id: "2", brand_name: "WYBOT", product_name: "C1 Pro Cordless Robotic Pool Cleaner", merchant_image_url: "https://cdn.example/c1pro.jpg" },
      { aw_product_id: "3", brand_name: "WYBOT", product_name: "C1 Max", merchant_image_url: "https://cdn.example/c1max.jpg" },
      { aw_product_id: "4", brand_name: "WYBOT", product_name: "S1 Skimmer", merchant_image_url: "https://cdn.example/s1.jpg" },
    ]);
    expect(summary.matched).toBe(1);
    expect(summary.rejectedSiblings).toBe(2);
    expect(summary.images[0].productId).toBe("prod-wybot-c1");
    expect(summary.images[0].url).toBe("https://cdn.example/c1.jpg");
  });

  it("captures an alternate image when the feed supplies one", () => {
    const s = ingestFeedRows([
      { aw_product_id: "1", brand_name: "WYBOT", product_name: "C1", merchant_image_url: "https://cdn.example/a.jpg", alternate_image: "https://cdn.example/b.jpg" },
    ]);
    expect(s.images.map((i) => i.role)).toEqual(["primary", "alternate"]);
  });

  it("ingests nothing today, because the programme is not approved", () => {
    expect(AWIN_IMAGES).toEqual([]);
  });
});

describe("Awin rights posture", () => {
  it("gates every term until approval and assumes the restriction", () => {
    const gated = WYBOT_US_TERMS.filter((t) => t.source === "gated_until_approval");
    expect(gated.length).toBeGreaterThanOrEqual(13);
    for (const t of gated) expect(t.value).toMatch(/gated until approval|assumed (required|prohibited|proportional)/);
  });

  it("requires remote serving and forbids local caching until Awin says otherwise", () => {
    expect(AWIN_CONSERVATIVE_RIGHTS.remoteServingRequired).toBe(true);
    expect(AWIN_CONSERVATIVE_RIGHTS.localStoragePermitted).toBe(false);
    expect(AWIN_CONSERVATIVE_RIGHTS.allowedTransformations).toEqual(["proportional_resize"]);
  });

  it("permits no placement Awin has not confirmed", () => {
    for (const p of ["open_graph", "structured_data", "email"]) {
      expect(AWIN_CONSERVATIVE_RIGHTS.allowedPlacements).not.toContain(p);
    }
  });
});

describe("credential safety", () => {
  it("keeps the OAuth token and the datafeed key as separate named secrets", () => {
    expect(AWIN_TOKEN_SECRET_REF).toBe("AWIN_API_TOKEN");
    expect(AWIN_DATAFEED_SECRET_REF).toBe("AWIN_DATAFEED_KEY");
    expect(AWIN_TOKEN_SECRET_REF).not.toBe(AWIN_DATAFEED_SECRET_REF);
  });

  it("holds no credential value in the source", () => {
    for (const f of ["apps/web/src/content/media/awin.ts", "apps/web/src/lib/awin-client.ts"]) {
      const src = readFileSync(f, "utf8");
      for (const re of CREDENTIAL_PATTERNS) expect(re.test(src)).toBe(false);
      expect(src).not.toContain("273793b7");
    }
  });

  it("redacts a token out of any error text", () => {
    expect(redactAwin("Bearer abc123def456ghi789")).not.toContain("abc123def456ghi789");
    expect(redactAwin("https://productdata.awin.com/datafeed/list/apikey/SECRETKEY123456")).not.toContain("SECRETKEY123456");
  });

  it("refuses without a credential rather than throwing", async () => {
    const res = await fetchRelationshipStatus("76816", {});
    expect(res.ok).toBe(false);
    if (!res.ok) {
      expect(res.reason).toBe("no_credential");
      expect(res.detail).toContain("AWIN_API_TOKEN");
    }
  });

  it("names the datafeed key, not the OAuth token, when the feed is asked for", async () => {
    const res = await fetchDatafeedList({ AWIN_API_TOKEN: "oauth-token" });
    expect(res.ok).toBe(false);
    if (!res.ok) {
      expect(res.reason).toBe("no_credential");
      expect(res.detail).toContain("AWIN_DATAFEED_KEY");
      expect(res.detail).toContain("NOT the OAuth token");
    }
  });

  it("never echoes the token in a result it reports on", async () => {
    let seen = "";
    const fake = (async (_u: string, init: RequestInit) => {
      seen = String((init.headers as Record<string, string>).Authorization);
      return new Response(JSON.stringify([]), { status: 200 });
    }) as unknown as typeof fetch;
    const res = await fetchRelationshipStatus("76816", { AWIN_API_TOKEN: "tok-xyz-789" }, fake);
    expect(seen).toBe("Bearer tok-xyz-789");
    expect(JSON.stringify(res)).not.toContain("tok-xyz-789");
  });
});

describe("public position while approval is pending", () => {
  it("still renders the branded placeholder for the WYBOT C1", () => {
    const r = resolveImage("prod-wybot-c1", "listing_card", ["product_hero", "branded_placeholder"])!;
    expect(r.isPlaceholder).toBe(true);
    expect(r.schemaProductImage).toBe(false);
  });

  it("puts no Awin or EU-programme asset into the media library", () => {
    for (const a of MEDIA_ASSETS) {
      expect(a.src ?? "").not.toContain("awin1.com");
      expect(a.src ?? "").not.toContain("ui.awin.com");
      expect(a.src ?? "").not.toContain("eu.wybotpool.com");
    }
  });

  it("records the WYBOT blocker as awaiting approval, owned by the advertiser", () => {
    const b = ACQUISITION_BLOCKERS.find((x) => x.productId === "prod-wybot-c1")!;
    expect(b.blocker).toContain("AWAITING ADVERTISER APPROVAL");
    expect(b.blocker).toContain("76816");
    expect(b.owner).toBe("manufacturer");
    expect(b.checked.join(" ")).toContain("21,429");
    expect(b.unblockAction).toContain("AWIN_DATAFEED_KEY");
  });

  it("keeps the publisher ID recorded", () => {
    expect(AWIN_PUBLISHER_ID).toBe("3012175");
  });
});
