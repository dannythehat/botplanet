import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import {
  AIPER_CJ_TERMS,
  AIPER_CREATIVES,
  AIPER_FEED,
  AIPER_MATCHERS,
  AIPER_RELATIONSHIP,
  CJ_AIPER_ADVERTISER_ID,
  CJ_CONSERVATIVE_RIGHTS,
  CJ_IMAGES,
  CJ_INGESTION_BLOCKER,
  CJ_PUBLISHER_ID,
  CJ_TOKEN_SECRET_REF,
  CJ_VIDEOS,
  CJ_WEBSITE_ID,
  matchAiperModel,
  tokenise,
} from "../src/content/media/cj";
import { fetchAiperCatalogue, fetchRelationship, isStatusStale, redact } from "../src/lib/cj-client";
import { ACQUISITION_BLOCKERS, MEDIA_ASSETS } from "../src/content/media/assets";
import { CREDENTIAL_PATTERNS, resolveImage } from "../src/lib/media-registry";

const AIPER_IDS = ["prod-aiper-scuba-x1", "prod-aiper-scuba-s1", "prod-aiper-seagull-se"];

describe("CJ programme identity", () => {
  it("records the Aiper advertiser, not the WYBOT Awin relationship", () => {
    expect(CJ_AIPER_ADVERTISER_ID).toBe("6404897");
    expect(AIPER_RELATIONSHIP.advertiserName).toBe("Aiper");
    expect(AIPER_RELATIONSHIP.notes).toContain("Awin");
    expect(AIPER_RELATIONSHIP.notes).toContain("WYBOT");
  });

  it("keeps the company ID and the website ID apart", () => {
    expect(CJ_PUBLISHER_ID).toBe("8029924");
    expect(CJ_WEBSITE_ID).toBe("101845913");
    expect(CJ_PUBLISHER_ID).not.toBe(CJ_WEBSITE_ID);
  });

  it("reports the relationship as joined and API-verified", () => {
    expect(AIPER_RELATIONSHIP.status).toBe("joined");
    expect(AIPER_RELATIONSHIP.ownerConfirmed).toBe(true);
    expect(AIPER_RELATIONSHIP.apiVerified).toBe(true);
    expect(AIPER_RELATIONSHIP.lastApiResponse).toContain("HTTP 200");
  });

  it("detects a stale relationship status", () => {
    const live = { ...AIPER_RELATIONSHIP, status: "declined" as const };
    expect(isStatusStale(AIPER_RELATIONSHIP, live)).toBe(true);
    expect(isStatusStale(AIPER_RELATIONSHIP, AIPER_RELATIONSHIP)).toBe(false);
  });
});

describe("exact-model matching", () => {
  it("matches each of the three Aiper launch models", () => {
    expect(matchAiperModel("Aiper Scuba X1").productId).toBe("prod-aiper-scuba-x1");
    expect(matchAiperModel("Aiper Scuba S1 Cordless Robotic Pool Cleaner").productId).toBe("prod-aiper-scuba-s1");
    expect(matchAiperModel("Aiper Seagull SE").productId).toBe("prod-aiper-seagull-se");
  });

  it("rejects every sibling model rather than assigning it to the nearest match", () => {
    for (const title of [
      "Aiper Scuba X1 Pro",
      "Aiper Scuba S1 Pro",
      "Aiper Scuba N1",
      "Aiper Seagull Pro",
      "Aiper Seagull Plus",
      "Aiper Seagull 800B",
      "Aiper Scuba X1 Max",
      "Aiper Seagull SE Pro",
    ]) {
      const m = matchAiperModel(title);
      expect(m.productId).toBeNull();
      expect(m.confidence).toBe("rejected");
      expect(m.reason.length).toBeGreaterThan(20);
    }
  });

  it("explains WHY a sibling was rejected, naming the variant token", () => {
    const m = matchAiperModel("Aiper Scuba X1 Pro");
    expect(m.reason).toContain("pro");
    expect(m.reason).toContain("sibling");
  });

  it("never cross-assigns one Aiper model to another", () => {
    expect(matchAiperModel("Aiper Scuba X1").productId).not.toBe("prod-aiper-scuba-s1");
    expect(matchAiperModel("Aiper Scuba S1").productId).not.toBe("prod-aiper-scuba-x1");
    expect(matchAiperModel("Aiper Seagull SE").productId).not.toBe("prod-aiper-scuba-s1");
  });

  it("leaks no other brand into an Aiper slot", () => {
    for (const title of [
      "Betta SE Plus Solar Pool Skimmer",
      "WYBOT C1 Cordless Robotic Pool Cleaner",
      "Dolphin E10",
      "Beatbot AquaSense 2 Ultra",
      "Polaris FREEDOM",
    ]) {
      expect(matchAiperModel(title).productId).toBeNull();
    }
  });

  it("rejects the campaign creative names CJ actually returned", () => {
    for (const title of ["2025 Black Friday US", "Mother's Day Sale", "Aiper US", "Evergreen Link for Aiper", "Aiper Experts Duo"]) {
      expect(matchAiperModel(title).productId).toBeNull();
    }
  });

  it("tokenises on non-alphanumerics so punctuation cannot hide a variant", () => {
    expect(tokenise("Aiper Scuba X1-Pro")).toContain("pro");
    expect(matchAiperModel("Aiper Scuba X1-Pro").productId).toBeNull();
  });

  it("names the Job 8 exact model on every matcher", () => {
    expect(AIPER_MATCHERS).toHaveLength(3);
    for (const m of AIPER_MATCHERS) {
      expect(AIPER_IDS).toContain(m.productId);
      expect(m.require.length).toBeGreaterThan(0);
      expect(m.deny.length).toBeGreaterThan(0);
    }
  });
});

describe("verified CJ inventory", () => {
  it("records the feed as present but empty", () => {
    expect(AIPER_FEED.adId).toBe("17133094");
    expect(AIPER_FEED.productCount).toBe(0);
  });

  it("records twelve creatives, none of them product media", () => {
    expect(AIPER_CREATIVES.totalMatched).toBe(12);
    expect(AIPER_CREATIVES.productImages).toBe(0);
    expect(AIPER_CREATIVES.videoCreatives).toBe(0);
    expect(AIPER_CREATIVES.exactModelMatches).toBe(0);
    expect(AIPER_CREATIVES.byType.Banner).toBe(9);
  });

  it("ingests no image or video record, because none exists to ingest", () => {
    expect(CJ_IMAGES).toEqual([]);
    expect(CJ_VIDEOS).toEqual([]);
  });

  it("attributes the blocker upstream to the advertiser, not to access", () => {
    expect(CJ_INGESTION_BLOCKER.owner).toBe("manufacturer");
    expect(CJ_INGESTION_BLOCKER.reason).toContain("zero products");
    expect(CJ_INGESTION_BLOCKER.reason).toContain("relationship is live");
  });

  it("puts no CJ campaign banner into the media library", () => {
    for (const a of MEDIA_ASSETS) {
      expect(a.src ?? "").not.toContain("lduhtrp.net");
      expect(a.src ?? "").not.toContain("tqlkg.com");
      expect(a.src ?? "").not.toContain("ftjcfx.com");
      expect(a.src ?? "").not.toContain("awltovhc.com");
    }
  });
});

describe("CJ rights posture", () => {
  it("treats every unconfirmed term as restrictive rather than permissive", () => {
    for (const t of AIPER_CJ_TERMS) {
      expect(t.source).toBe("not_confirmed_through_api");
      expect(t.value).toMatch(/not confirmed|assumed (required|prohibited|proportional)/);
    }
  });

  it("requires remote serving and forbids local caching until CJ says otherwise", () => {
    expect(CJ_CONSERVATIVE_RIGHTS.remoteServingRequired).toBe(true);
    expect(CJ_CONSERVATIVE_RIGHTS.localStoragePermitted).toBe(false);
    expect(CJ_CONSERVATIVE_RIGHTS.allowedTransformations).toEqual(["proportional_resize"]);
  });

  it("permits no placement CJ has not confirmed", () => {
    expect(CJ_CONSERVATIVE_RIGHTS.allowedPlacements).not.toContain("open_graph");
    expect(CJ_CONSERVATIVE_RIGHTS.allowedPlacements).not.toContain("structured_data");
    expect(CJ_CONSERVATIVE_RIGHTS.allowedPlacements).not.toContain("email");
  });
});

describe("credential safety", () => {
  it("names the secret without ever holding its value", () => {
    expect(CJ_TOKEN_SECRET_REF).toBe("CJ_API_TOKEN");
    const src = readFileSync("apps/web/src/content/media/cj.ts", "utf8");
    const client = readFileSync("apps/web/src/lib/cj-client.ts", "utf8");
    for (const re of CREDENTIAL_PATTERNS) {
      expect(re.test(src)).toBe(false);
      expect(re.test(client)).toBe(false);
    }
  });

  it("redacts a bearer token out of any error text", () => {
    expect(redact("failed: Bearer abc123def456ghi789")).toContain("[redacted]");
    expect(redact("failed: Bearer abc123def456ghi789")).not.toContain("abc123def456ghi789");
    expect(redact("api_key=SUPERSECRETVALUE123")).not.toContain("SUPERSECRETVALUE123");
  });

  it("returns a typed refusal instead of throwing when no credential exists", async () => {
    const res = await fetchRelationship({});
    expect(res.ok).toBe(false);
    if (!res.ok) {
      expect(res.reason).toBe("no_credential");
      expect(res.detail).toContain("CJ_API_TOKEN");
    }
  });

  it("never puts the token in a request it reports on", async () => {
    let seenAuth = "";
    const fakeFetch = (async (_u: string, init: RequestInit) => {
      seenAuth = String((init.headers as Record<string, string>).Authorization);
      return new Response(JSON.stringify({ data: { shoppingProducts: { totalCount: 0, resultList: [] } } }), { status: 200 });
    }) as unknown as typeof fetch;
    const res = await fetchAiperCatalogue({ CJ_API_TOKEN: "tok-abc-123" }, fakeFetch);
    expect(seenAuth).toBe("Bearer tok-abc-123");
    expect(JSON.stringify(res)).not.toContain("tok-abc-123");
  });

  it("stores no signed or private CJ URL in the media records", () => {
    for (const a of MEDIA_ASSETS) {
      expect(a.src ?? "").not.toMatch(/image-\d+-\d+-\d+/);
      expect(a.sourceRef ?? "").not.toMatch(/image-\d+-\d+-\d+/);
    }
  });
});

describe("catalogue ingestion behaviour", () => {
  it("rejects sibling rows returned by a live catalogue", async () => {
    const fakeFetch = (async () =>
      new Response(
        JSON.stringify({
          data: {
            shoppingProducts: {
              totalCount: 3,
              resultList: [
                { id: "1", title: "Aiper Scuba X1", imageLink: "https://cdn.example/x1.jpg" },
                { id: "2", title: "Aiper Scuba X1 Pro", imageLink: "https://cdn.example/x1pro.jpg" },
                { id: "3", title: "Aiper Seagull Pro", imageLink: "https://cdn.example/gullpro.jpg" },
              ],
            },
          },
        }),
        { status: 200 },
      )) as unknown as typeof fetch;

    const res = await fetchAiperCatalogue({ CJ_API_TOKEN: "t" }, fakeFetch);
    expect(res.ok).toBe(true);
    if (!res.ok) return;
    expect(res.catalogue.images).toHaveLength(1);
    expect(res.catalogue.images[0].productId).toBe("prod-aiper-scuba-x1");
    expect(res.catalogue.images[0].url).toBe("https://cdn.example/x1.jpg");
    expect(res.catalogue.rejectedSiblings).toBe(2);
  });

  it("reports an unauthorised response rather than failing silently", async () => {
    const fakeFetch = (async () => new Response("nope", { status: 403 })) as unknown as typeof fetch;
    const res = await fetchAiperCatalogue({ CJ_API_TOKEN: "t" }, fakeFetch);
    expect(res.ok).toBe(false);
    if (!res.ok) expect(res.reason).toBe("unauthorized");
  });
});

describe("Aiper public fallback", () => {
  it("still renders the branded placeholder for all three Aiper products", () => {
    for (const id of AIPER_IDS) {
      const r = resolveImage(id, "listing_card", ["product_hero", "branded_placeholder"])!;
      expect(r.isPlaceholder).toBe(true);
      expect(r.schemaProductImage).toBe(false);
    }
  });

  it("routes each Aiper blocker upstream to the advertiser", () => {
    for (const id of AIPER_IDS) {
      const b = ACQUISITION_BLOCKERS.find((x) => x.productId === id)!;
      expect(b.owner).toBe("manufacturer");
      expect(b.blocker).toContain("zero products");
      expect(b.checked.join(" ")).toContain("6404897");
    }
  });
});
