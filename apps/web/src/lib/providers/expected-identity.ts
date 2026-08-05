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
    /* WI-FI IS PART OF THE MODEL, NOT A FEATURE OF IT.
       "nautilus cc plus" alone matched B00Q8M0NWE — the non-Wi-Fi sibling in
       the same variation family, $829 to our $849 — because Amazon's own
       Model Name field for it reads exactly "Nautilus CC Plus". The token now
       names the variant we actually hold. */
    /* Both spellings. The normaliser turns punctuation into spaces, so "Wi-Fi"
       becomes "wi fi" and "WiFi" becomes "wifi" — two different tokens, and
       Amazon uses both across its own listings for this family. */
    modelTokens: ["nautilus cc plus wi-fi", "cc plus wi-fi", "nautilus cc plus wifi", "cc plus wifi"],
    /* Maytronics ships CC, CC Pro and CC Supreme alongside CC Plus, and the
       variation family adds bundles that are a different SKU at a different
       price — B0C2JHQVR7 is "CC Plus Wi-Fi + Caddy" at $898 and is rated for
       50 ft where ours is rated for 40. */
    denyTokens: ["cc pro", "cc supreme", "nautilus ag", "eon", "caddy", "cover", "pool-up"],
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
    /* CORRECTED 4 August 2026. This entry still held B0DMN6NV6H — the listing
       the destination register RETIRED on 3 August when the owner supplied
       B0G7B6F5FZ — so every daily read since had been checking a listing the
       buy button no longer pointed at. The same class of bug as the X1 Pro
       Max's retired-ASIN entry. The new listing has never been machine-read
       (bot-mitigation page on every direct attempt), so the first clean
       provider read is what confirms it. */
    productId: "prod-beatbot-aquasense-2-ultra",
    asin: "B0G7B6F5FZ",
    brand: "Beatbot",
    modelTokens: ["aquasense 2 ultra", "prcmds02"],
    // The Pro is the 4-in-1 in the same series; the Ultra adds clarification.
    denyTokens: ["aquasense 2 pro", "aquasense 2 plus", "iskim"],
    exception: "recently_changed",
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
    /* MOVED 4 August 2026, B0H5PY2SPF -> B0DJ6MV81N. The 2026-model listing
       (ZT20032026, AiperDirect, $149.99 on 31 July) 404s as of today — gone,
       not out of stock. The owner-confirmed destination B0DJ6MV81N ("Seagull
       SE 2025", read alive today at $159.99, 90 min, 2.5 h charge) was
       already where /go pointed; the refresh now reads the same listing the
       reader lands on, which the two ASINs previously did not agree about. */
    asin: "B0DJ6MV81N",
    brand: "AIPER",
    modelTokens: ["seagull se", "zt2003"],
    denyTokens: ["seagull pro", "seagull plus", "seagull 1000", "scuba"],
    /* Exception lifted 4 August 2026: the first clean read of this ASIN
       confirmed identity and price ($159.99, in stock) the same day, which is
       what the daily watch existed to see. Back to the normal cadence. */
  },
  {
    productId: "prod-aiper-scuba-x1",
    /* CORRECTED 4 August 2026. This entry still held B0F9WN961G — an ASIN the
       verification record had already retired — with modelTokens for the base
       X1 and a deny list containing "x1 pro max": it was configured to REFUSE
       the very machine the record now represents, which is why this product
       failed identity on every daily run since the rename. The destination
       register has held B0GMPWMS2H (Model Name "Scuba X1 Pro Max", read from
       the listing's own fields) since 3 August; the refresh now reads it too. */
    asin: "B0GMPWMS2H",
    brand: "AIPER",
    modelTokens: ["scuba x1 pro max", "x1 pro max"],
    /* "hy pro" catches the Scuba X1+Hy Pro impostor whose URL says Pro;
       "caddy" and "hydrocomm" catch the two bundles; the rest are siblings.
       Deliberately NOT "x1 pro" alone — it is a whole-token substring of the
       real name and would refuse the machine itself. */
    denyTokens: ["hy pro", "hydrocomm", "caddy", "essential", "advanced", "scuba v3", "scuba s1", "seagull"],
  },
  {
    /* The record ID predates the product: it held the Dolphin Premier until
       3 August 2026 and now holds the BuBlue — see content/product-names.ts.
       Identity was machine-read from the listing's own details table that day:
       Brand 'BUBLUE', Model Number 'Bubot 800P gen2', which settles the
       800P / 880P question outright. */
    productId: "prod-dolphin-premier",
    asin: "B0GTYX922J",
    brand: "BUBLUE",
    modelTokens: ["bubot 800p", "800p gen2"],
    /* BuBlue sells a Bubot family of near-identical names. Deliberately NOT
       "800p" alone — it is a whole-token substring of the real name and would
       refuse the machine itself. */
    denyTokens: ["880p", "700p", "500p", "300p", "800p pro", "800p max"],
    /* Exception lifted 4 August 2026, the day it was added: the refresh run
       after the review deployed read the listing cleanly — identity confirmed
       on the structured fields, $799.97, in stock. Back to the normal
       cadence. */
  },
  {
    /* MOVED OFF AWAITING_DISCOVERY on 4 August 2026 — it had been stale there
       since 3 August, when the owner confirmed this destination; the refresh
       never read the listing because this entry did not exist. Identity rests
       on the owner's confirmation: the listing could not be machine-read
       (Amazon served its bot page on every attempt), so the first clean
       provider read is what upgrades it. */
    productId: "prod-wybot-c1",
    asin: "B0GYWJMNWK",
    brand: "WYBOT",
    modelTokens: ["wybot c1", "c1"],
    /* The trap this register exists for: a rejected candidate was TITLED
       "2026 WYBOT C1" and read C1 PLUS in its identity fields. Deny is checked
       before matching, so "c1 plus" refuses before "c1" can confirm. */
    denyTokens: ["c1 plus", "c1 pro", "c1 max", "c2", "s2", "s3", "a1", "b1", "f1"],
    /* Exception lifted 4 August 2026, the day it was added: the refresh run
       after the review deployed machine-read the listing at last — Brand
       'WYBOT', Model Number 'OS7010C', Model Name 'C1', $399.99, in stock —
       which also settled the model number the verification record had refused
       to take from third-party manual libraries. Back to the normal cadence. */
  },
  {
    /* ADDED 4 August 2026 by the site audit. Both this and the Scuba V3 below
       had an owner-confirmed ASIN, a published review and a buy button since
       3 August, and neither had an entry here — so neither was ever price
       checked, and the pages showed no price at all. Neither was on
       AWAITING_DISCOVERY either, which is the list that would have made the
       gap visible. The coverage test in offers.test.ts now closes that hole. */
    productId: "prod-dolphin-proteus-dx4-plus",
    asin: "B083YWJ5PQ",
    brand: "Dolphin",
    modelTokens: ["proteus dx4 plus", "dx4 plus"],
    /* The DX4 and the DX4 Plus are different machines, so "dx4" alone can
       never confirm — it is a whole-token substring of the real name and is
       deliberately absent from both lists. The siblings are denied instead. */
    denyTokens: ["dx3", "dx5", "s200", "s300", "nautilus", "escape", "caddy"],
    exception: "recently_changed",
  },
  {
    productId: "prod-aiper-scuba-v3-ai-vision",
    asin: "B0GG97427D",
    brand: "AIPER",
    modelTokens: ["scuba v3", "v3 ai vision"],
    // The X1 family and the S1 are the near neighbours; "v3 pro" is a sibling.
    denyTokens: ["v3 pro", "scuba s1", "scuba x1", "x1 pro max", "seagull", "hydrocomm", "caddy"],
    exception: "recently_changed",
  },
];

/** Products with no confirmed ASIN. They need discovery, not a refresh. */
export const AWAITING_DISCOVERY = ["prod-aiper-scuba-s1"];
