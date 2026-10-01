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

/* @extension-point per-product | required | The price checker does not know the
   product exists, so its page shows no price and never will — silently. Two
   products sat like this for days. A product must be here OR explicitly listed
   as awaiting discovery; offers.test.ts fails the build if it is neither. This
   is also what catches a retailer swapping the listing for a sibling model. */
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

  /* ==================================================================
     LITTER BOXES AND LAWN MOWERS, 8 August 2026 — the eleven that came
     off OFFER_SETUP_PENDING when their offers were wired.

     EVERY TOKEN BELOW IS A FIELD SOMEBODY READ. matchIdentity consults
     `modelName`, `modelNumber` and `manufacturerPartNumber` and nothing
     else — the title is copy the seller writes and is deliberately not
     consulted. NONE of these eleven listings publishes a model NAME;
     all eleven publish a model NUMBER, so that is what the tokens are.
     A deny list of readable product names would have looked thorough
     here and fired on nothing, which is worse than an empty one because
     it reads as protection.

     The sibling numbers were read the same day, listing by listing, and
     three of them are the reason this section is long:

       - THE LITTER-ROBOT 4 SUPPLY BUNDLE PUBLISHES OUR MODEL NUMBER.
         B0FFDNZSHT gives model_number 'LR4-0301-00-CA' — byte-identical
         to the bare machine's — and differs only in its part number,
         'LR4-COREBD-BK'. The model number cannot separate them.
       - THE NAVIMOW GARAGE BUNDLE PUBLISHES OUR MODEL NUMBER TOO.
         B0CZ3R3SJH gives 'i110N', same as the bare mower. Nothing in
         the details table separates a $1,099 mower from a $1,298 mower
         plus garage.
       - THE DREAME BUNDLE ALMOST DOES. B0H761SNFG gives
         'MXXA7300+Bundle C', which contains our whole model number as
         its first token, so 'mxxa7300' matches it. 'bundle' is what
         refuses it, and deny is checked before match.

     In two of those three the served-ASIN equality check is the only
     thing standing between a reader and the wrong purchase. That check
     runs first in matchIdentity, before brand and before model, which
     is exactly why it was put there. ================================== */
  {
    productId: "prod-litter-robot-4",
    asin: "B0BH6MD3DJ",
    /* Whisker, not Litter-Robot. The brand row names the company and the
       product name is the machine — they are different words here and
       matching on the wrong one refuses the product forever. */
    brand: "Whisker",
    modelTokens: ["lr4 0301"],
    /* 'lr4 corebd' is the supply bundle's part number and is the ONLY
       field that separates it from this machine. 'bundle' catches the
       accessory bundles that publish one. 'lr4' alone can never deny —
       it is a whole-token substring of this machine's own number. */
    denyTokens: ["lr4 corebd", "lr3", "bundle"],
  },
  {
    productId: "prod-petkit-purobot-max-pro-2",
    asin: "B0DM83CLW3",
    brand: "PETKIT",
    /* 't5 2' is the Max Pro 2's number in full. 't5' alone is a
       whole-token substring of it and may appear in neither list. */
    modelTokens: ["t5 2"],
    /* The Purobot Max 3 publishes model_number 'PuraMax 2' — a
       different product line wearing a similar name, and confirmed by
       reading B0F1YMM29X on 8 August. The other two are name-shaped
       guards for a listing that starts publishing a model name. */
    denyTokens: ["puramax", "purobot max 3", "purobot mini"],
  },
  {
    productId: "prod-casa-leo-loo-too",
    asin: "B09LL9S99B",
    /* SMARTY PEAR, NOT CASA LEO, and this is not an error in the
       listing. Smarty Pear built Leo's Loo Too and Casa Leo is the
       brand it sells under; the brand row carries the maker. Holding
       'Casa Leo' here would fail brandOk on every run and the product
       would never be checked again. */
    brand: "Smarty Pear",
    modelTokens: ["3746"],
    /* Read on 8 August: B0HB41VTJX is 'V2-Avocado Green' and
       B0H5HZXT4C is 'V2B-Pink', a $699 bundle. Both are live, both are
       Smarty Pear, and neither is this $599 machine. 'v2' is
       SKU-shaped, so it prefix-matches 'v2b' as well and covers the
       whole V2 family in one token. */
    denyTokens: ["v2", "v2b"],
  },
  {
    productId: "prod-petsafe-scoopfree-crystal-pro",
    asin: "B0DR3JP2FZ",
    brand: "PetSafe",
    modelTokens: ["pal00 18017"],
    /* THE FOUR-CENT TRAP, NOW A NUMBER RATHER THAN A WARNING. All three
       siblings were read on 8 August and all three publish a PAL00
       number of their own: 16806 is the Crystal Pro *Legacy*
       Front-Entry at $229.95 — four cents under this machine and a
       generation older — 16805 is the Legacy uncovered at $142.49 and
       17296 is the Crystal Classic at $99. 'crystal pro' can never
       deny: it is a whole-token substring of the Legacy's name AND of
       this one, which is the whole reason the name was never enough. */
    denyTokens: ["pal00 16806", "pal00 16805", "pal00 17296", "legacy", "crystal classic"],
  },
  {
    productId: "prod-navimow-i110n",
    asin: "B0CX7T6BR3",
    /* NAVIMOW, not Segway. Segway owns Navimow and the listing's brand
       row says Navimow; the manufacturer row says 'Navimow B.V.'. */
    brand: "NAVIMOW",
    modelTokens: ["i110n"],
    /* HONEST LIMIT, RECORDED. The Garage S bundle (B0CZ3R3SJH, $1,298)
       publishes model_number 'i110N' — the same number as this $1,099
       mower — and the Rough Terrain Kit listing (B0D7HG4319, $1,168.30)
       publishes no model number at all. No deny token can separate
       those from this machine, because the fields do not differ. The
       served-ASIN check is what does it, and for this product it is not
       a backstop but the primary guard. The tokens below cover the
       genuine siblings in the range. */
    denyTokens: ["i105n", "i108n", "i206n", "h800", "garage", "rough terrain"],
  },
  {
    productId: "prod-luba-3-awd-1500h",
    asin: "B0GKNYZPC3",
    brand: "Mammotion",
    modelTokens: ["luba 3 1500h", "1500h"],
    /* The cleanest pair on the site: the two LUBA 3s publish
       'LUBA 3 1500H' and 'LUBA 3 3000H', so each one's deny token is
       the other's model number and both fire on a real field. */
    denyTokens: ["3000h", "5000h", "luba 2", "yuka", "mini"],
  },
  {
    productId: "prod-luba-3-awd-3000h",
    asin: "B0GKNQKJJQ",
    brand: "Mammotion",
    modelTokens: ["luba 3 3000h", "3000h"],
    denyTokens: ["1500h", "5000h", "luba 2", "yuka", "mini"],
  },
  {
    productId: "prod-automower-410iq",
    asin: "B0DTV7TR6W",
    brand: "Husqvarna",
    /* Husqvarna publishes a nine-digit part number rather than the
       marketing name: this mower is 970727401. Nothing in the details
       table says '410iQ' at all. */
    modelTokens: ["970727401"],
    /* 970727501 is the 420iQ, read on 8 August at $3,144.37 — one digit
       away from this machine and $644 dearer. */
    denyTokens: ["970727501", "420iq", "430x", "450x"],
  },
  {
    productId: "prod-worx-landroid-vision-wr320",
    asin: "B0GN8KK8XW",
    brand: "WORX",
    modelTokens: ["wr320"],
    /* WORX puts the SKU in the model number, which makes this the one
       product here whose deny list needed no extra reads: WO7144,
       WR342 and WR344 are the other three live Landroid Visions and
       every one of them answers to the family name. */
    denyTokens: ["wr342", "wr344", "wo7144"],
  },
  {
    productId: "prod-eufy-e15",
    asin: "B0DRVYDXWX",
    brand: "eufy",
    /* Model number T2880, part number T28801a1. The token is
       SKU-shaped, so it prefix-matches the longer part number, which is
       what the prefix allowance exists for. */
    modelTokens: ["t2880"],
    /* THE WEAKEST DENY LIST HERE, AND IT SAYS SO. A search of Amazon US
       on 8 August returned no eufy sibling mower — no E18, no E17,
       nothing but this E15 — so there is no sibling model number to
       read and deny. These are name-shaped and fire only if the listing
       begins publishing a model name. Today the separator is the served
       ASIN plus T2880, and that is the honest description of it. */
    denyTokens: ["e18", "e17"],
  },
  {
    productId: "prod-dreame-a3-awd-1000",
    asin: "B0H3V799KT",
    brand: "dreame",
    modelTokens: ["mxxa7300"],
    /* 'bundle' IS THE LOAD-BEARING TOKEN. B0H761SNFG sells this mower
       with a cleaning and blade set at exactly the same $1,599.99 and
       publishes 'MXXA7300+Bundle C', which normalises to
       'mxxa7300 bundle c' — our model number is its first whole token,
       so the match would confirm. Deny runs first and 'bundle' refuses
       it. 'a3 awd 1000' denies B0H46DDHKC, which publishes that string
       as its model number and is the same machine on a different
       listing we did not take; it is absent from this ASIN's fields, so
       denying it costs nothing here. */
    denyTokens: ["bundle", "a3 awd 1000", "a3 awd pro", "3500"],
  },
  {
    /* Owner-verified 27 September 2026 by a direct screenshot of the live
       listing on his own phone — not a details-table read, but a real,
       current look at the actual page, which is why this graduated straight
       from awaiting discovery rather than sitting in the researched_exact
       tier commerce/destinations.ts still records it at. Brand and title
       match exactly; no sibling name appears anywhere in the screenshot. */
    productId: "prod-botley-2",
    asin: "B083T58PKM",
    brand: "Learning Resources",
    modelTokens: ["botley 2.0", "botley the coding robot"],
    /* Learning Resources also sells a Botley 2.0 Classroom Set at a
       materially different price point; deny it explicitly. */
    denyTokens: ["classroom", "classroom set"],
  },
  {
    /* Owner-verified 27 September 2026, same method as Botley above. */
    productId: "prod-code-and-go-robot-mouse",
    asin: "B01B14XK00",
    brand: "Learning Resources",
    modelTokens: ["code & go robot mouse", "code and go robot mouse", "robot mouse"],
    /* Learning Resources also sells this as a $71.99 Activity Set and a
       $270.99 Classroom Set under near-identical names; deny both. */
    denyTokens: ["activity set", "classroom set", "classroom"],
  },
  {
    /* Owner-supplied 1 October 2026; Blue. Gray (B0DPG7L6QP) and Renewed
       (B0GKPXB186) are other ASINs. The unit's own casing and independent
       reviews say "Surfer S2", Amazon says "EcoSurfer S2": both tokens match. */
    productId: "prod-aiper-ecosurfer-s2",
    asin: "B0DPHGPLGM",
    brand: "Aiper",
    modelTokens: ["ecosurfer s2", "surfer s2"],
    denyTokens: ["renewed", "refurbished", "surfer s1", "seagull", "scuba"],
  },
  {
    /* Owner-supplied 1 October 2026; Navy Blue. The iSkim has several listings
       (colour, with a charger) and a larger iSkim Ultra that is a different
       machine at a different price. */
    productId: "prod-beatbot-iskim",
    asin: "B0GWF6FPPS",
    brand: "Beatbot",
    modelTokens: ["iskim"],
    denyTokens: ["iskim ultra", "iskim pro", "aquasense", "renewed", "refurbished"],
  },
  {
    /* Owner-supplied 1 October 2026; Black Blue. */
    productId: "prod-brinbo-sk01",
    asin: "B0H6ZCNK7B",
    brand: "BRINBO",
    modelTokens: ["sk01"],
    denyTokens: ["renewed", "refurbished", "bundle"],
  },
];

/** Products with no confirmed ASIN. They need discovery, not a refresh. */
export const AWAITING_DISCOVERY = [
  "prod-aiper-scuba-s1",

  /* FORTY-TWO PRODUCTS JOINED THIS LIST ON 14 AUGUST 2026, and none of them
     should have been able to reach production without being on it.

     The price checker reads EXPECTED_IDENTITIES. That list holds pool, litter
     and lawn and nothing else, so every window robot, vacuum, companion,
     coding robot, pet camera, the grill machine and the snow blower has NEVER
     had a price read — 42 of 64 published products. It is why both premium
     WINBOTs have told readers "we are reconciling a price disagreement" since
     31 July: there is no disagreement, there is no observation at all.

     THE COVERAGE TEST THAT WAS WRITTEN TO CATCH EXACTLY THIS DID NOT, because
     it iterated ACTIVE_PRODUCTS — pool-era editorial that no later category
     appears in. A guard reading the same incomplete list as the code it checks
     agrees with it and proves nothing. It reads PRODUCT_ID now.

     THEY GO HERE RATHER THAN INTO EXPECTED_IDENTITIES, and the distinction is
     the whole safety mechanism. An entry there needs modelTokens and, more
     importantly, DENY tokens — the WYBOT C1 taught that a listing titled
     "2026 WYBOT C1" can read C1 PLUS in its own fields. Writing 42 sets of
     deny tokens quickly is how the checker confirms the wrong machine and
     publishes a price for a product nobody is selling. Awaiting discovery is
     the honest state: the gap is now recorded, tested and visible, instead of
     silent for six weeks.

     Promoting a category is per-product work: read the listing, transcribe the
     identity fields, write the deny tokens for its siblings, move it up. */
  "prod-ecovacs-winbot-w2-pro-omni",
  "prod-ecovacs-winbot-w3-omni",
  "prod-ecovacs-winbot-w2-pro",
  "prod-ecovacs-winbot-w2s",
  "prod-ecovacs-winbot-w1-pro",
  "prod-ecovacs-winbot-mini",
  "prod-hutt-s55-pro",
  "prod-mamibot-w120-dp",
  "prod-hobot-2s",
  "prod-hobot-298",
  "prod-cop-rose-x5s",
  "prod-moflin",
  "prod-miko-3",
  "prod-vector-2",
  "prod-eilik",
  "prod-loona",
  "prod-joy-for-all-companion-pets",
  "prod-ropet",
  "prod-enabot-ebo-air-2",
  "prod-enabot-ebo-se",
  "prod-enabot-rola-petpal",
  "prod-sphero-bolt",
  "prod-sphero-mini",
  "prod-sphero-indi",
  "prod-ozobot-evo",
  "prod-makeblock-mbot",
  "prod-living-ai-emo",
  "prod-cozmo",
  "prod-grillbot",
  "prod-moxie",
  "prod-eufy-x10-pro-omni",
  "prod-eufy-omni-s1-pro",
  "prod-roborock-s8-max-ultra",
  "prod-roborock-saros-10",
  "prod-roborock-qrevo-s5v",
  "prod-dreame-x40-ultra",
  "prod-dreame-x50-ultra",
  "prod-ecovacs-deebot-t90-pro-omni",
  "prod-shark-powerdetect-av2820s",
  "prod-shark-matrix-plus-ur2650ws",
  "prod-roomba-max-705",
  "prod-yarbo-snow-blower",
];
