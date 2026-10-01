import { describe, expect, it } from "vitest";
import { parseUsdMinor, reconcilePriceFact } from "../src/lib/price-fact";

const facts = (value: string) => [
  { label: "Price", value },
  { label: "Max slope", value: "18°" },
];
const live = { price: "$1,299.99", checkedDate: "2026-10-01" };

describe("price fact reconciliation", () => {
  it("parses dollar amounts regardless of separators and cents", () => {
    expect(parseUsdMinor("$1,199.99")).toBe(119999);
    expect(parseUsdMinor("$599")).toBe(59900);
    expect(parseUsdMinor("$599.00")).toBe(59900);
    expect(parseUsdMinor("Check price")).toBeNull();
  });

  it("lets the live price win when it contradicts the typed one", () => {
    // The eufy E15 on 1 October 2026: header $1,199.99, buy box $1,299.99.
    const out = reconcilePriceFact(facts("$1,199.99, read 8 August 2026"), live);
    expect(out[0].value).toBe("$1,299.99, checked 1 October 2026");
  });

  it("leaves the other facts alone", () => {
    expect(reconcilePriceFact(facts("$1,199.99"), live)[1]).toEqual({ label: "Max slope", value: "18°" });
  });

  it("does not treat $599 and $599.00 as a conflict", () => {
    const f = facts("$599, read 8 August 2026");
    expect(reconcilePriceFact(f, { price: "$599.00", checkedDate: "2026-10-01" })).toEqual(f);
  });

  it("keeps the typed figure when there is no live price — a dated figure is honest", () => {
    const f = facts("$4,999 complete / $1,299 module only, read 11 August 2026");
    expect(reconcilePriceFact(f, null)).toEqual(f);
    expect(reconcilePriceFact(f, { price: null, checkedDate: null })).toEqual(f);
  });

  it("never collapses a multi-SKU price into one live figure", () => {
    // Two figures ARE the content: they say which SKU costs what.
    const f = facts("$2,399 (1500H) / $2,799 (3000H), read 8 August 2026");
    expect(reconcilePriceFact(f, { price: "$2,499.00", checkedDate: "2026-10-01" })).toEqual(f);
  });

  it("still states the live price when no date is known", () => {
    expect(reconcilePriceFact(facts("$1,199.99"), { price: "$1,299.99", checkedDate: null })[0].value).toBe("$1,299.99");
  });
});
