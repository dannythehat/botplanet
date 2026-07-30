import { describe, expect, it } from "vitest";
import {
  clickCompleteness,
  deviceClassFromUserAgent,
  isSafeAffiliateDestination,
  pageTypeFromPath,
  resolveSourcePath,
  summariseClickQuality,
} from "../src/clicks.js";

const HOSTS = ["botplanet.io", "preview.botplanet.io"];

describe("isSafeAffiliateDestination", () => {
  it("accepts absolute http(s) URLs with a real host", () => {
    expect(isSafeAffiliateDestination("https://www.amazon.com/dp/B0XYZ?tag=botplanet-20")).toBe(true);
    expect(isSafeAffiliateDestination("http://lesliespool.com/product")).toBe(true);
  });

  it("rejects dangerous or non-absolute values so they can never reach a Location header", () => {
    for (const bad of [
      "javascript:alert(1)",
      "data:text/html,<script>alert(1)</script>",
      "//evil.example.com",
      "/robots/robotic-pool-cleaners/",
      "not a url",
      "https://",
      "",
      "   ",
      null,
      undefined,
    ]) {
      expect(isSafeAffiliateDestination(bad as string)).toBe(false);
    }
  });
});

describe("resolveSourcePath", () => {
  it("keeps the path for same-site referrers", () => {
    expect(resolveSourcePath("https://botplanet.io/robots/robotic-pool-cleaners/dolphin-e10/", HOSTS)).toBe(
      "/robots/robotic-pool-cleaners/dolphin-e10/",
    );
    expect(resolveSourcePath("https://preview.botplanet.io/", HOSTS)).toBe("/");
  });

  it("never keeps a query string, so questionnaire answers cannot leak into attribution", () => {
    const path = resolveSourcePath("https://botplanet.io/botmatch/robotic-pool-cleaners/?size=large&budget=800", HOSTS);
    expect(path).toBe("/botmatch/robotic-pool-cleaners/");
    expect(path).not.toContain("?");
    expect(path).not.toContain("budget");
  });

  it("drops off-site, missing and malformed referrers", () => {
    expect(resolveSourcePath("https://www.google.com/search?q=pool+robot", HOSTS)).toBeNull();
    expect(resolveSourcePath("https://notbotplanet.io/", HOSTS)).toBeNull();
    expect(resolveSourcePath("garbage", HOSTS)).toBeNull();
    expect(resolveSourcePath(null, HOSTS)).toBeNull();
  });
});

describe("pageTypeFromPath", () => {
  it("classifies the launch routes", () => {
    expect(pageTypeFromPath("/")).toBe("home");
    expect(pageTypeFromPath("/robots/robotic-pool-cleaners/")).toBe("category");
    expect(pageTypeFromPath("/robots/robotic-pool-cleaners/dolphin-e10/")).toBe("product");
    expect(pageTypeFromPath("/compare/robotic-pool-cleaners/")).toBe("compare");
    expect(pageTypeFromPath("/botmatch/robotic-pool-cleaners/")).toBe("botmatch");
    expect(pageTypeFromPath("/recommendation/abc123/")).toBe("recommendation");
    expect(pageTypeFromPath("/affiliate-disclosure/")).toBe("editorial");
    expect(pageTypeFromPath("/something-else/")).toBe("other");
    expect(pageTypeFromPath(null)).toBeNull();
  });
});

describe("deviceClassFromUserAgent", () => {
  it("splits reporting three ways without identifying anyone", () => {
    expect(deviceClassFromUserAgent("Mozilla/5.0 (iPhone; CPU iPhone OS 17_0) AppleWebKit/605.1.15 Mobile/15E148")).toBe("mobile");
    expect(deviceClassFromUserAgent("Mozilla/5.0 (iPad; CPU OS 17_0) AppleWebKit/605.1.15")).toBe("tablet");
    expect(deviceClassFromUserAgent("Mozilla/5.0 (Linux; Android 13; SM-X710) AppleWebKit/537.36")).toBe("tablet");
    expect(deviceClassFromUserAgent("Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 Mobile Safari/537.36")).toBe("mobile");
    expect(deviceClassFromUserAgent("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36")).toBe("desktop");
    expect(deviceClassFromUserAgent(null)).toBeNull();
  });
});

describe("clickCompleteness", () => {
  const full = {
    productId: "prod-dolphin-e10",
    offerId: "off-1",
    destinationKind: "offer_destination" as const,
    sourcePage: "/robots/robotic-pool-cleaners/dolphin-e10/",
    pageType: "product" as const,
    deviceClass: "desktop" as const,
  };

  it("marks a product click to the real affiliate destination with full context as attributed", () => {
    expect(clickCompleteness(full)).toBe("attributed");
  });

  it("downgrades to partial when context is missing or the destination is a search fallback", () => {
    expect(clickCompleteness({ ...full, sourcePage: null })).toBe("partial");
    expect(clickCompleteness({ ...full, deviceClass: null })).toBe("partial");
    expect(clickCompleteness({ ...full, destinationKind: "amazon_search" })).toBe("partial");
  });

  it("marks records with no product/offer, or a homepage-only destination, as minimal", () => {
    expect(clickCompleteness({ ...full, productId: null })).toBe("minimal");
    expect(clickCompleteness({ ...full, offerId: "  " })).toBe("minimal");
    expect(clickCompleteness({ ...full, destinationKind: "retailer_home" })).toBe("minimal");
    expect(clickCompleteness({})).toBe("minimal");
  });

  it("never reports an unavailable destination as a usable click", () => {
    expect(clickCompleteness({ ...full, destinationKind: "unavailable" })).toBe("minimal");
  });
});

describe("summariseClickQuality", () => {
  it("splits a batch into honest buckets that sum to the total", () => {
    const rows = [
      { productId: "p", offerId: "o", destinationKind: "offer_destination" as const, sourcePage: "/", pageType: "home" as const, deviceClass: "desktop" as const },
      { productId: "p", offerId: "o", destinationKind: "amazon_search" as const, sourcePage: "/", pageType: "home" as const, deviceClass: "mobile" as const },
      { productId: null, offerId: null },
    ];
    const s = summariseClickQuality(rows);
    expect(s).toEqual({ total: 3, attributed: 1, partial: 1, minimal: 1 });
    expect(s.attributed + s.partial + s.minimal).toBe(s.total);
  });

  it("reports zeros for an empty set rather than inventing activity", () => {
    expect(summariseClickQuality([])).toEqual({ total: 0, attributed: 0, partial: 0, minimal: 0 });
  });
});
