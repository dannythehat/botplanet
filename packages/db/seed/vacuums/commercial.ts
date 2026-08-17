/**
 * Robot-vacuum commercial seed — A MIRROR OF PRODUCTION D1, NOT A PROPOSAL.
 *
 * WHY THIS FILE DID NOT EXIST UNTIL 14 AUGUST 2026, and what it cost.
 *
 * Eleven vacuums were researched on 10 August: a pinned ASIN, a price, a
 * rating and a review count read off each listing, every sibling ASIN that
 * could be substituted named and denied, the whole working written up in
 * docs/commerce/robot-vacuums-identity.md. Eleven reviews were then written
 * and published on top of that research.
 *
 * The step that never happened is this one. Every other catalogued category
 * has a directory beside this one, and the offers, the redirect links and the
 * buy buttons all come from it. Robot vacuums — the largest category on the
 * site, a 135,000/mo head term — had none, so D1 held eleven published
 * products with zero offer rows and eleven reviews rendered a Buy heading with
 * nothing underneath it.
 *
 * Nothing failed, either, which is the part worth keeping. offers.test.ts
 * checks every routed product's key against the seed files it reads, and it
 * reads a hardcoded list of category directories. A category with no directory
 * is not in the list, so it is not checked, so it passes. The same shape of
 * hole that hid the window offers on 5 August hid these for four days.
 *
 * THE PRICES ARE NULL, deliberately, as in every seed beside this one. All
 * eleven were read on 10 August and not one figure is copied here. The first
 * observation the refresh service accepts fills the column, with the date it
 * was read.
 *
 * THIS CATEGORY IS WHERE A SUBSTITUTION COSTS THE MOST. Four of the eleven sit
 * in variation families or one character from a differently-priced sibling —
 * the eufy X10 in two colourways sharing a review pool, the roborock S8 Max
 * Ultra against the S8 MaxV Ultra, the Dreame X50 against its "Complete"
 * bundle, the Roomba Max 705 against the Max 705 Combo. Every id below names
 * one ASIN and one only.
 *
 * Standing rules, unchanged: no affiliate destination URLs and no tracking
 * parameters in the seed; commission lives at programme level and is private.
 */
import type { offers, redirectLinks } from "../../src/schema/commercial.js";

const USD = "USD";

interface VacuumOfferSeed {
  /** D1 `offers.id`, verbatim. */
  id: string;
  productId: string;
  /** ASIN, pinned and read 2026-08-10 — see commerce/destinations.ts. */
  asin: string;
  /** D1 `offers.redirect_key`, verbatim. NEVER derive this. */
  redirectKey: string;
  /** Null until the refresh service reads one. See the note above. */
  snapshotMinor: number | null;
}

const offerSeeds: VacuumOfferSeed[] = [
  /* Two colourways, one review pool: B0DG5G9HQM is the white X10 at the same
     price and is denied, so a request cannot be answered with its data. */
  { id: "off-eufy-x10-pro-omni-amazon", productId: "prod-eufy-x10-pro-omni", asin: "B0CPFBBHP4", redirectKey: "vac-eufy-x10proomni-amazon", snapshotMinor: null },
  /* The search row returns no price at all; the listing itself did. eufy's own
     product page returned 404 to a direct fetch the same day. */
  { id: "off-eufy-omni-s1-pro-amazon", productId: "prod-eufy-omni-s1-pro", asin: "B0CTY6VT8Y", redirectKey: "vac-eufy-omnis1pro-amazon", snapshotMinor: null },
  /* S8 Max Ultra, NOT the S8 MaxV Ultra. The single letter is the whole
     difference between two machines at two prices, and the MaxV has no
     first-party listing on Amazon US at all — only accessory kits. */
  { id: "off-roborock-s8-max-ultra-amazon", productId: "prod-roborock-s8-max-ultra", asin: "B0D9B9LK9F", redirectKey: "vac-roborock-s8maxultra-amazon", snapshotMinor: null },
  /* B0DLH45139 is the same model carrying no price; not pinned. */
  { id: "off-roborock-saros-10-amazon", productId: "prod-roborock-saros-10", asin: "B0DLH247PS", redirectKey: "vac-roborock-saros10-amazon", snapshotMinor: null },
  /* B0FX4SZ4KB is the same machine at the same price sharing one review pool. */
  { id: "off-roborock-qrevo-s5v-amazon", productId: "prod-roborock-qrevo-s5v", asin: "B0DSP8J476", redirectKey: "vac-roborock-qrevos5v-amazon", snapshotMinor: null },
  /* B0DZHNSL1H is a second X40 listing five dollars cheaper with its own
     review pool — a different listing for the same machine, not pinned. */
  { id: "off-dreame-x40-ultra-amazon", productId: "prod-dreame-x40-ultra", asin: "B0CXDXKSXP", redirectKey: "vac-dreame-x40ultra-amazon", snapshotMinor: null },
  /* The "Complete" listings at $989.99 are a bundle, not the base machine. */
  { id: "off-dreame-x50-ultra-amazon", productId: "prod-dreame-x50-ultra", asin: "B0DM5J52GC", redirectKey: "vac-dreame-x50ultra-amazon", snapshotMinor: null },
  /* AV2820S is the self-empty VACUUM. RV2820ZE is the vacuum-and-mop at a
     different price; the SKU is in the name we publish for that reason. */
  { id: "off-shark-powerdetect-av2820s-amazon", productId: "prod-shark-powerdetect-av2820s", asin: "B0CDJFHM4J", redirectKey: "vac-shark-av2820s-amazon", snapshotMinor: null },
  /* "Matrix" covers four Shark machines across two ranges. UR2650WS is one. */
  { id: "off-shark-matrix-plus-ur2650ws-amazon", productId: "prod-shark-matrix-plus-ur2650ws", asin: "B0FDX7GFQX", redirectKey: "vac-shark-ur2650ws-amazon", snapshotMinor: null },
  /* B0DWG15XKQ at $799 is the Max 705 COMBO — a mop and an AutoWash dock,
     a different machine at a different price. */
  { id: "off-roomba-max-705-amazon", productId: "prod-roomba-max-705", asin: "B0DWG3C3ZF", redirectKey: "vac-irobot-max705-amazon", snapshotMinor: null },
  { id: "off-ecovacs-deebot-t90-pro-omni-amazon", productId: "prod-ecovacs-deebot-t90-pro-omni", asin: "B0GJ5S4V78", redirectKey: "vac-ecovacs-t90proomni-amazon", snapshotMinor: null },
];

export const offerRows: (typeof offers.$inferInsert)[] = offerSeeds.map((o) => ({
  id: o.id,
  productId: o.productId,
  retailerId: "ret-amazon",
  marketId: "us",
  affiliateProgramId: "ap-amazon-us",
  currencyCode: USD,
  basePriceMinor: o.snapshotMinor,
  deliveryPriceMinor: null,
  totalLandedMinor: null,
  stockStatus: "unknown",
  deliveryMinDays: null,
  deliveryMaxDays: null,
  warrantySummary: null,
  returnsUrl: null,
  redirectKey: o.redirectKey,
  affiliateDestinationUrl: null,
  commissionValueBp: null,
  source: "manual",
  freshnessClass: "indicative",
  confidence: "low",
  priceVerification: "snapshot",
  sellerIdentity: null,
  offerStatus: "active",
}));

export const redirectLinkRows: (typeof redirectLinks.$inferInsert)[] = offerSeeds.map((o) => ({
  key: o.redirectKey,
  offerId: o.id,
  active: true,
}));
