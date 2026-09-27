import { describe, expect, it } from "vitest";
import { isSeoMigrationRetiredPath } from "../src/content/seo-migration-overrides";
import { resolveRedirect } from "../src/lib/routing";

describe("retired security robot URLs", () => {
  it("marks legacy security intent for a pre-redirect 410 response", () => {
    for (const path of ["/security-robots/", "/home-security-robots/"]) {
      expect(isSeoMigrationRetiredPath(path), path).toBe(true);
    }
  });

  it("catches casing, duplicate slashes and missing trailing slash", () => {
    expect(isSeoMigrationRetiredPath("/Security-Robots")).toBe(true);
    expect(isSeoMigrationRetiredPath("//home-security-robots")).toBe(true);
  });

  it("leaves the historical legacy registry resolvable for integrity checks", () => {
    expect(resolveRedirect("/security-robots/")?.to).toBe("/robots/");
    expect(resolveRedirect("/home-security-robots/")?.to).toBe("/robots/");
  });
});
