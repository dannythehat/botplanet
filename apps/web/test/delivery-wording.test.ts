/* ============================================================
   The delivery line, pinned to the bug that produced it.

   On 4 August 2026 the Nautilus page carried a delivery promise
   captured on 31 July: "FREE delivery Tomorrow, August 1. Order
   within 3 hrs 47 mins. Details". Every word had been true when it
   was read. The first test below is that exact string on that exact
   day, because a regression here does not look like a bug — it
   looks like a working page with a confident, wrong sentence on it.
   ============================================================ */
import { describe, it, expect } from "vitest";
import { deliveryLine, deliveryNote } from "../src/lib/delivery-wording";

describe("the sentence that started this", () => {
  const CAPTURED = "FREE delivery Tomorrow, August 1. Order within 3 hrs 47 mins. Details";

  it("prints only the durable claim four days later", () => {
    expect(deliveryLine(CAPTURED, "2026-07-31", "2026-08-04")).toBe("Free delivery");
  });

  it("says why the date is missing", () => {
    expect(deliveryNote(CAPTURED, "2026-07-31", "2026-08-04")).toMatch(/change daily/i);
  });

  it("keeps the date on the day it was read — but never the countdown", () => {
    const same = deliveryLine(CAPTURED, "2026-07-31", "2026-07-31");
    expect(same).toBe("Free delivery Tomorrow, August 1");
    expect(same).not.toMatch(/Order within/i);
    expect(same).not.toMatch(/Details/);
  });

  it("never prints a date that has already passed, even on the check day", () => {
    /* A scrape can lag its own timestamp. "August 1" read on 2 August is
       wrong on the day it was captured, so same-day is not a free pass. */
    const s = deliveryLine("FREE delivery August 1", "2026-08-02", "2026-08-02");
    expect(s).toBe("Free delivery");
  });
});

describe("the countdown is never printed", () => {
  for (const w of [
    "FREE delivery Thursday, August 6. Order within 1 hr 58 mins",
    "FREE delivery Wednesday, August 5. Order within 14 hrs 47 mins",
    "Order within 59 mins. FREE delivery Tomorrow",
  ]) {
    it(`strips it from: ${w}`, () => {
      expect(deliveryLine(w, "2026-08-04", "2026-08-04")).not.toMatch(/order within/i);
      expect(deliveryLine(w, "2026-07-01", "2026-08-04")).not.toMatch(/order within/i);
    });
  }
});

describe("date clauses in every shape Amazon writes them", () => {
  const stale = (w: string) => deliveryLine(w, "2026-07-25", "2026-08-04");

  it.each([
    ["FREE delivery Tomorrow, August 1", "Free delivery"],
    ["FREE delivery Wednesday, August 5", "Free delivery"],
    ["FREE delivery Thursday, August 6", "Free delivery"],
    ["FREE delivery August 1 - 3", "Free delivery"],
    ["FREE delivery Tuesday, August 11", "Free delivery"],
    ["FREE delivery Sunday, August 2", "Free delivery"],
    ["FREE delivery Tomorrow", "Free delivery"],
    ["FREE delivery by Mon, Aug 10", "Free delivery"],
    ["FREE delivery on 5 August", "Free delivery"],
    ["FREE delivery as soon as Tomorrow", "Free delivery"],
  ])("%s -> %s", (input, expected) => {
    expect(stale(input)).toBe(expected);
  });

  it("keeps a paid delivery charge, which does not expire with the date", () => {
    expect(stale("$9.99 delivery Thursday, August 6")).toBe("$9.99 delivery");
  });
});

describe("nothing is invented and nothing is guessed", () => {
  it("does not roll a captured date forward to a new one", () => {
    const s = deliveryLine("FREE delivery Tomorrow, August 1", "2026-07-31", "2026-08-04");
    expect(s).not.toMatch(/August|Aug|Tomorrow|\d/);
  });

  it("treats an undated capture as stale — we cannot vouch for when it was true", () => {
    expect(deliveryLine("FREE delivery Tomorrow, August 1", null, "2026-08-04")).toBe("Free delivery");
  });

  it("returns null rather than a fragment when nothing durable survives", () => {
    expect(deliveryLine("Arrives Tomorrow", "2026-07-01", "2026-08-04")).toBeNull();
    expect(deliveryLine("Tomorrow", "2026-07-01", "2026-08-04")).toBeNull();
    expect(deliveryLine("Details", "2026-07-01", "2026-08-04")).toBeNull();
  });

  it("returns null for no wording at all", () => {
    expect(deliveryLine(null, "2026-08-04", "2026-08-04")).toBeNull();
    expect(deliveryLine("", "2026-08-04", "2026-08-04")).toBeNull();
    expect(deliveryLine(undefined, null, "2026-08-04")).toBeNull();
  });

  it("leaves wording with no date in it completely alone", () => {
    expect(deliveryLine("Free delivery", "2026-01-01", "2026-08-04")).toBe("Free delivery");
    expect(deliveryLine("Prime eligible", "2026-01-01", "2026-08-04")).toBe("Prime eligible");
    expect(deliveryNote("Free delivery", "2026-01-01", "2026-08-04")).toBeNull();
  });
});

describe("the year the sentence never states", () => {
  it("reads a month far behind as next year rather than as long past", () => {
    /* Read in late December, "January 3" is next week, not eleven months ago. */
    expect(deliveryLine("FREE delivery Saturday, January 3", "2026-12-29", "2026-12-29"))
      .toBe("Free delivery Saturday, January 3");
  });

  it("still drops a genuinely past date in the same month", () => {
    expect(deliveryLine("FREE delivery December 2", "2026-12-29", "2026-12-29")).toBe("Free delivery");
  });
});
