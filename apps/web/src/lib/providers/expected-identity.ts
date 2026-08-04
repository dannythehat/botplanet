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
    /* Daily until the first clean read of the new ASIN confirms identity and
       price, then back to the normal cadence. */
    exception: "recently_changed",
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
    /* Daily until the first clean read confirms identity and price on this
       newly adopted destination, then back to the normal cadence. */
    exception: "recently_changed",
  },
];

/** Products with no confirmed ASIN. They need discovery, not a refresh. */
export const AWAITING_DISCOVERY = ["prod-wybot-c1", "prod-aiper-scuba-s1"];
