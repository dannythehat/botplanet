import { describe, expect, it } from "vitest";
import { isGone, resolveRedirect } from "../src/lib/routing";

describe("retired security robot URLs", () => {
  it("returns Gone instead of redirecting legacy security intent to the generic robot directory", () => {
    for (const path of ["/security-robots/", "/home-security-robots/"]) {
      expect(isGone(path), path).toBe(true);
      expect(resolveRedirect(path), path).toBeNull();
    }
  });

  it("catches casing and missing trailing slash without creating a redirect hop", () => {
    expect(isGone("/Security-Robots")).toBe(true);
    expect(resolveRedirect("/Security-Robots")).toBeNull();
  });
});
