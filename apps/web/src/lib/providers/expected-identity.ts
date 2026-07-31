/**
 * What each product must prove to be itself.
 *
 * The deny tokens are the important half. Every brand here sells a family of
 * near-identical names, and the discovery run showed the failure is not
 * hypothetical: a listing TITLED "2026 WYBOT C1" turned out to be a C1 PLUS in
 * its identity fields, and would have passed any check that read titles.
 *
 * So a model token alone never confirms — a deny token anywhere in the
 * structured fields refuses outright, before the match is even considered.
 * "C1" appears inside "C1 PLUS", which is exactly why matching is on whole
 * tokens and denial is checked first.
 */
import type { ExceptionReason } from "./refresh-policy";

export interface IdentityExpectation {
  productId: string;
  asin: string;
  brand: string;
  modelTokens: string[];
  denyTokens: string[];
  exception?: ExceptionReason;
}

export const EXPECTED_IDENTITIES: IdentityExpectation[] = [
  {
    productId: "prod-dolphin-nautilus-cc-plus",
    asin: "B09K4C9WGF",
    brand: "Dolphin",
    modelTokens: ["nautilus cc plus", "cc plus"],
    // Maytronics ships CC, CC Pro and CC Supreme alongside CC Plus.
    denyTokens: ["cc pro", "cc supreme", "nautilus ag", "eon"],
  },
  {
    productId: "prod-polaris-freedom",
    asin: "B0BX9DJS7R",
    brand: "Polaris",
    modelTokens: ["freedom", "ffreedom"],
    // Freedom Plus and Freedom SC are separate machines at separate prices.
    denyTokens: ["freedom plus", "plus", "sc", "lt", "vrx", "vrxiq"],
  },
  {
    productId: "prod-betta-se-plus",
    asin: "B0CVMQ3XBX",
    brand: "Betta",
    modelTokens: ["betta se plus", "se plus"],
    denyTokens: ["se pro", "betta se 2", "betta plus"],
  },
  {
    productId: "prod-beatbot-aquasense-2-ultra",
    asin: "B0DMN6NV6H",
    brand: "Beatbot",
    modelTokens: ["aquasense 2 ultra", "prcmds02"],
    // The Pro is the 4-in-1 in the same series; the Ultra adds clarification.
    denyTokens: ["aquasense 2 pro", "aquasense 2 plus", "iskim"],
    // Identity is confirmed but the listing exposes no buy box, so it stays on
    // the exception list until it does.
    exception: "unresolved_identity",
  },
  {
    productId: "prod-dolphin-e10",
    asin: "B0GV15VY1N",
    brand: "Dolphin",
    modelTokens: ["e10"],
    denyTokens: ["e20", "e30", "e70", "nautilus ag", "nautilus cc"],
  },
  {
    productId: "prod-aiper-seagull-se",
    asin: "B0H5PY2SPF",
    brand: "AIPER",
    modelTokens: ["seagull se", "zt2003"],
    denyTokens: ["seagull pro", "seagull plus", "seagull 1000", "scuba"],
  },
  {
    productId: "prod-aiper-scuba-x1",
    asin: "B0F9WN961G",
    brand: "AIPER",
    modelTokens: ["scuba x1"],
    // The held listing is currently unavailable and names its model "Blue",
    // so it is on the daily list until it resolves one way or the other.
    denyTokens: ["x1 pro", "x1 pro max", "scuba s1", "scuba v3", "scuba s3"],
    exception: "unavailable_offer",
  },
];

/** Products with no confirmed ASIN. They need discovery, not a refresh. */
export const AWAITING_DISCOVERY = ["prod-wybot-c1", "prod-aiper-scuba-s1"];
