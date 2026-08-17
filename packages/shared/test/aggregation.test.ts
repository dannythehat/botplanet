import { describe, expect, it } from "vitest";
import { AGG_ALL, revenueAggregationKey } from "../src/revenue.js";

describe("revenueAggregationKey", () => {
  it("uses the 'all' sentinel for absent, null or empty dimensions (never NULL)", () => {
    const key = revenueAggregationKey({ date: "2026-07-29" });
    expect(key).toBe(`2026-07-29|${AGG_ALL}|${AGG_ALL}|${AGG_ALL}|${AGG_ALL}|${AGG_ALL}|${AGG_ALL}`);
    expect(key).not.toContain("null");
  });

  it("treats null, undefined and blank identically", () => {
    const a = revenueAggregationKey({ date: "2026-07-29", product: null, retailer: "  " });
    const b = revenueAggregationKey({ date: "2026-07-29" });
    expect(a).toBe(b);
  });

  it("is deterministic and order-stable", () => {
    const dims = { date: "2026-07-29", market: "us", product: "prod-x", retailer: "ret-y", program: "ap-z" };
    expect(revenueAggregationKey(dims)).toBe(revenueAggregationKey({ ...dims }));
    expect(revenueAggregationKey(dims)).toBe("2026-07-29|us|all|all|prod-x|ret-y|ap-z");
  });

  it("produces distinct keys for different grains (per-product vs rolled-up)", () => {
    const perProduct = revenueAggregationKey({ date: "2026-07-29", market: "us", product: "prod-x" });
    const allProducts = revenueAggregationKey({ date: "2026-07-29", market: "us" });
    expect(perProduct).not.toBe(allProducts);
  });
});
