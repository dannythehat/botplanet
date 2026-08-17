# Handoff prompt — category 010, robot snow blowers (v4, final gate)

v1 three pages → v2 one page → v3 URL corrected → v4 gates answered, one new
blocker found. This is the copy for ChatGPT as Reviewer of record.

````text
ROLE
You are the Reviewer of record on a page map for BotPlanet, a US consumer-robot
review site. Three review rounds have run; all three found real faults and all
are recorded below. Two build gates were set and answered from the codebase;
answering them exposed a third that is now the pre-build blocker. You are not
writing copy. Clear this for build, or name what stops it.

WHY YOU AND NOT ANOTHER MODEL: rounds 2 and 3 were reviewed by the same model
family that wrote rounds 1 and 2, so parts of this document are that family
reviewing itself and shared blind spots survive by construction. You are the
independent pass.

HOUSE RULES — hard constraints. A recommendation breaking one is wrong even if
it would rank.
1. Never target a brand term the brand owns. Already refused: "litter robot"
   (165,000/mo), "roborock" (110,000), "irobot roomba" (27,100). EXCEPTION: a
   term the brand ranks #1 for may be targeted by a REVIEW of that product.
2. One page per intent. >5 of 10 shared top-10 domains = merge. Under 3 of 10
   justifies separate URLs. 3-5 is ambiguous and must be called as such.
3. A "category" here = four surfaces: hub, comparison, BotMatch matcher,
   best-of. All comparative. Matcher code-gated at MIN_PRODUCTS_FOR_A_MATCH=2.
4. No invented awards. A best-of with one entry is an advertisement.
5. No price in a guide or best-of. Prices live on product pages with the date
   they were read.
6. Never publish a figure a manufacturer has not published. "Not disclosed" is
   valid and preferred.
7. Seasonal demand is not a reason to skip, but must be stated on-page.

PRECEDENT — calibrate on these, not on your priors.
- 005 Home Security Robots: CANCELLED. SERP was institutional procurement and
  encyclopedia entries. Bar = "no consumer demand in the SERPs = kill".
- 006 Grill Cleaning Robots: BUILT as a ONE-PRODUCT category, matcher gated
  OFF, and it earns, on generic volume of only 5,400. BINDING PRECEDENT HERE.
- Pet cameras: "best pet camera robot" killed — SERP answered by Wirecutter's
  best pet CAMERAS. Robot term swallowed by the larger market.
- Litter boxes: separate best-of REFUSED at 7/10 shared with the hub term.
- Lawn mowers: separate best-of APPROVED at 2/10 shared. Built 11 Aug 2026.

=======================================================================
MEASURED DATA — DataForSEO, US/English (2840), 11 Aug 2026. $0.2527 spend.
24 seeds, 11 live SERPs, 65 long-tails.
=======================================================================

GENERIC ROBOT TERMS
keyword                  | volume | KD | CPC   | Jan peak | Aug trough | swing
robot snow blower        | 12,100 |  0 | $1.17 |   60,500 |      1,600 |  38x
robotic snow blower      | 12,100 |  0 | $1.17 |   60,500 |      1,600 |  38x
autonomous snow blower   |  3,600 |  0 | $1.11 |   33,100 |        210 | 158x
automatic snow blower    |  1,600 |  3 | $0.72 |    8,100 |        210 |  39x
robot snow plow          |  1,000 |  0 | $0.81 |    4,400 |        260 |  17x
robotic snow plow        |  1,000 |  0 | $0.81 |    4,400 |        260 |  17x
snow removal robot       |    880 |  9 | $0.97 |    4,400 |        170 |  26x
snow clearing robot      |    880 |  2 | $0.97 |    4,400 |        170 |  26x
robot snow removal       |    880 |  0 | $0.97 |    4,400 |        170 |  26x
self driving snow blower |    210 |  0 | $0.22 |      880 |         20 |  44x
best robot snow blower   |    140 |  9 | $1.40 |      480 |         30 |  16x
best robotic snow blower |    140 |  9 | $1.40 |      480 |         30 |  16x
automatic snow removal   |    110 |  0 | $0.53 |      390 |         10 |  39x

BRAND
yarbo                    | 18,100 | 13 | $3.08 |   33,100 |      9,900 |   3x
yarbo snow blower        | 14,800 |  6 | $2.24 |   74,000 |        720 | 103x
yarbo snow blower reviews|  2,900 |  0
yarbo review             |  1,900 |  0 | $2.03 |    3,600 |      1,300 |   3x
yarbo m series           |    720 |  0
yarbo price              |    260 |  2 | $2.61 |      590 |        170 |   3x
yarbo m1                 |     50 |  0 | $4.20 |      170 |         10 |  17x
yarbo s1                 |     20 |  6 | $2.46 |       50 |         10 |   5x

DO NOT SUM BRAND + GENERIC. v1 claimed "~36,000/mo combined" — double-counting,
the SERPs are 6-8/10 identical. v2 said "~20,000-22,000 honest unique demand" —
also wrong, that dedup rate was estimated not measured. CORRECT STATEMENT:
nominal generic volume is 22,700; true unique demand is lower by an unmeasured
amount. TREAT 22,700 AS A CEILING, NOT A FIGURE.

CONTROLS AND ADJACENT
snow blower (conventional)| 246,000 | 41 | $0.49 | 1,220,000 | 27,100 | 45x
electric snow blower      |  40,500 |  6
snow blower craftsman     |  22,200 |  0
gas snow blower           |  18,100 |  4
best snow blower          |  12,100 |  0 | $0.65 |    60,500 |  1,300 | 47x
heated driveway           |   9,900 |  0 | $4.25 |    40,500 |  2,400 | 17x
snow blowers near me      |   9,900 |  0
snow blower home depot    |   5,400 |  0
automatic snow shovel     |   4,400 |  0   <-- tested, REFUSED
snow blower amazon        |   2,900 |  0
driveway snow removal     |   1,900 |  8 | $1.30 |    14,800 |     90 | 164x  <-- tested, REFUSED
best snow blower brand    |   1,000 |  1
best gas snow blower      |   1,000 |  9

SERP OVERLAP — shared top-10 domains, all live, ALL MEASURED IN AUGUST (trough)
vs CONVENTIONAL market:
  robot snow blower      vs snow blower : 2/10 (youtube, lowes)
  robotic snow blower    vs snow blower : 2/10
  yarbo snow blower      vs snow blower : 1/10
  autonomous snow blower vs snow blower : 2/10
  best robot snow blower vs snow blower : 2/10
  snow removal robot     vs snow blower : 0/10
vs BRAND — these force the merge:
  robot snow blower      vs yarbo             : 7/10
  robot snow blower      vs yarbo snow blower : 6/10
  autonomous snow blower vs yarbo             : 6/10
  autonomous snow blower vs yarbo snow blower : 5/10
  autonomous snow blower vs robot snow blower : 8/10
  snow removal robot     vs robot snow blower : 7/10
  snow removal robot     vs yarbo             : 5/10
REVIEW INTENT — AMBIGUOUS, called as such per rule 2:
  yarbo snow blower reviews vs robot snow blower : 4/10
  yarbo snow blower reviews vs yarbo             : 5/10
  yarbo snow blower reviews vs yarbo snow blower : 4/10
  3-5/10 is above the separate-URL line and below the must-merge line. It is
  kept on the review because it is review intent for the same product, but the
  rule does not force that answer. This is a judgement call, flagged.

SERP "robot snow blower"
features: ai_overview, video, popular_products, people_also_ask, images
 2 amazon.com "YARBO 2-Stage 24/7 Autonomous Robot Snow Blower..."
 3 smart-dots.com  5 reddit.com  8 youtube.com  9 cnygreenteam.com
11 reddit.com  12 lowes.com  13 abc7chicago.com (viral news, still ranking Aug)
No incumbent editorial. No institutional/procurement/encyclopedia results.

SERP "yarbo snow blower reviews" — THE MONEY SERP, and it changes the brief
features: ai_overview, video, people_also_ask, discussions_and_forums
 2 yarbo.com          Yarbo Snow Blower
 3 reddit.com         "Extremely Disappointed with the Yarbo Snow Blower"
 7 amazon.com         YARBO 2-Stage 24/7 Autonomous Robot Snow Blower
 8 trustpilot.com     Read Customer Service Reviews of yarbo.com
 9 forum.yarbo.com    Yarbo Blower - reviews/opinions
10 pcworld.com        Yarbo robotic snow blower review: A yard crawler for all
11 thesnowbot.com     Yarbo Snow Blower Review
13 facebook.com       Yarbo snow blower review and experience
14 facebook.com       What is the Yarbo snowblower's performance like?
15 blog.bluestarcreations.net  An honest review of the Yarbo experience
FINDINGS: (a) owner evidence is NOT absent — it is off-retail, and the loudest
of it is NEGATIVE at position 3. A review built on Yarbo's spec sheet alone is
contradicted by the third result on its own money term. (b) TEXT, NOT VIDEO —
one video block, zero YouTube in the top ten, against YouTube ranking on nearly
every generic term. (c) NO incumbent editorial. PCWorld at 10 is the only
publisher present.

SERP "automatic snow shovel" — tested, CONFIRMED SWALLOWED, refused
 3 amazon.com (Snow Joe)  6 homedepot.com  7 nytimes.com (Ryobi review)
 8 lowes.com  9 greenworkstools.com  16 thespruce.com  17 acehardware.com
~$100 corded tools. NYT and The Spruce hold the review intent. 4/10 vs robot
snow blower. Pet-camera pattern. The 4,400 at KD 0 is bait.

SERP "driveway snow removal" — rescue attempted, FAILED, refused
features: LOCAL_PACK, people_also_ask, video, perspectives
 5 homedepot.com  7 instructables.com  8 lawnlove.com  10 taskrabbit.com
11 familyhandyman.com  17 allenoutdoorstl.com  18 spokanegreenscape.com
Local services pack + regional contractors. 1/10 against robot snow blower,
yarbo AND conventional. Unrankable without premises. The robot-vs-contractor
comparison stays as CONTENT in the walk-away section; not a targeted term.

PAA, head term, verbatim
- Do robot snow blowers work?
- How much does a robot snow blower cost?
- What is the best robotic snow blower?
- Are remote snowblowers worth the money?

=======================================================================
PRODUCT VERIFICATION — 11 Aug 2026, primary sources
=======================================================================
ONE MANUFACTURER. NO SECOND MACHINE.
- Snowbot IS Yarbo. Hanyang Technology (Shenzhen), NY branch 2019, Snowbot S1
  $1,999 in 2021, S1 Pro $2,999, now Yarbo. snowbot.com dead; thesnowbot.com
  serves Yarbo's store.
- Left Hand Robotics: acquired by Toro, March 2021. Commercial, not consumer.
- smart-dots.com and cnygreenteam.com are DEALERS. CNY lists 9 SKUs, all Yarbo.

IDENTITY (clean)
Brand: Yarbo | Model #: YARBO S1 (Lowe's item 8256113)
Best Buy: "Black Yarbo S1", SKU J3Q5Q8G9GS | Amazon ASIN B0FJF9V1JC
Product name: Yarbo Snow Blower | "Sold and Shipped by Yarbo" (Lowe's)
0 owner reviews AT LOWE'S — but see the money SERP above; owner evidence exists
off-retail on Reddit, Trustpilot and Yarbo's own forum.
Retail: Amazon + Best Buy + Lowe's

IT IS A MODULE, NOT A SNOW BLOWER. "1+N": one Core, four attachments (mower,
snow blower, leaf blower, trimmer). THE CORE IS THE LAWN PLATFORM.
  Snow Blower Module alone ............ $1,299
  "Yarbo Snow Blower" (Core + module) . $4,999
  Core alone, dealer discount ......... $4,999 -> $3,599
  dealer "Modular Snow Blower Robot" .. $4,530
  Mower Pro + Snow Blower ............. $7,199
  Complete 4-in-1 ..................... $7,999

SPECS (first-party yarbo.com)
clearing 24in | intake 12in adj | throw 6-40ft adj | battery 38.4Ah
runtime ~90min | charge 90min 20-80% | 6,000 sq ft/charge at 1in snow
max slope 36% (21deg) | -13F to +140F | Q355 steel | IPX5 | up to 5yr warranty

CONFLICTS — recorded, not resolved by picking the nicer number
1. Runtime: yarbo.com "approximately 90 minutes" vs third-party "up to 4
   hours". First-party wins.
2. Throw: Yarbo's own module page says "up to 40 feet" AND "6-40 Yards Throw
   Control" in the same panel. One is wrong, both are Yarbo's.
3. Price: reviews headline "$4,999"; the module is $1,299.
4. Reddit position 3 is a disappointed owner. Trustpilot and Yarbo's forum
   follow. That is evidence and belongs in the review.

NOT ESTABLISHED
- Amazon's details table unread (WebFetch returns head only; DataForSEO
  merchant endpoints not enabled on this account). Brand/model rest on Lowe's
  and Best Buy. NO BUY LINK SHIPS until confirmed first-party on Amazon.
- M Series is Kickstarter pre-order, not sold.

=======================================================================
BUILD GATES — answered from the codebase
=======================================================================
GATE 1 — does a product page under a hidden category inherit noindex? PASS.
  pages/robots/[category]/[slug].astro never passes noindex to Base and never
  reads the category launch state. noindex is an explicit prop, unset on this
  route. A product under a hidden category indexes normally. `hidden` describes
  the hub, not everything beneath it.

GATE 2 — what does the breadcrumb render? PASS.
  ROUTES has no entry for solar-panel-robots, the existing hidden category —
  hidden categories get no route. breadcrumbsFor() falls to nearestAncestor(),
  which resolves to /robots/ (routes.ts line 83). Renders Home > Robots > Yarbo
  Snow Blower. The category segment is never linked, so no crawlable link to a
  hidden hub. Real concern; does not arise, because there is nothing to link.

GATE 3 — *** THE PRE-BUILD BLOCKER, found while answering Gate 1 *** FAIL.
  sitemap.xml.ts line 73 filters product rows on liveSlugs.has(categorySlug);
  liveSlugs comes from liveCategories(), which returns only launch === "live".
  A product in a HIDDEN category is INDEXABLE BUT ABSENT FROM THE SITEMAP.
  That is worse than either failure the reviews anticipated: a money page
  Google may index and this site never declares, on a category whose entire
  thesis is a September indexation head start.
  FIX BEFORE BUILD: sitemap must admit products whose review is published even
  when the category is hidden, while still excluding the hidden hub, comparison
  and matcher. One condition, and it needs a test.

=======================================================================
WHAT THREE REVIEW ROUNDS BROKE — do not repeat
=======================================================================
ROUND 1
1. v1 said NO-GO because "nothing to compare". WRONG REASON — Grillbot was
   built as a one-product category on LESS volume and earns. That silently
   moved the category bar. Correct reasons: (a) 7/10 overlap shows Google
   collapsed the generic market onto one brand; (b) Yarbo's Core IS the lawn
   platform.
2. v1 proposed 3 pages; pages 1 and 2 measured 6-7/10 against each other.
3. v1's third page was a cost guide built on $1,299-vs-$4,999. Rule 5.
4. v1 summed brand + generic to "~36,000". Double-counting.
ROUND 2
5. v2 nested the URL under robotic-lawn-mowers. Fixed via hidden category.
6. v2's "loses to one indexed three months earlier" was invented precision.
7. v2's "~20,000-22,000 unique demand" was an estimated dedup rate.
8. v2 excluded RC/hybrid by fiat. Now decided by SERP overlap if one ships.
ROUND 3
9. v3 buried its own blocker in a footnote at the bottom of the section whose
   argument depended on it. It is now GATE 3 and the headline blocker.
10. v3 never named the breadcrumb question at all. Now GATE 2.
11. v3 presented "40-60% of nominal" beside measured figures. It is a
    PLANNING ASSUMPTION, UNMEASURED — a reviewer's heuristic, not a measurement.
12. v3 left `automatic snow removal` (110) in neither the secondary nor the
    refused list. Unassigned. Now a secondary.
13. v3 recorded "0 owner reviews at Lowe's" and never carried it into
    consequences. The money SERP shows owner evidence is off-retail and largely
    negative — the strongest content angle in the run, one pull from being lost.

=======================================================================
CURRENT MAP — ONE PAGE. Clear it, or name what stops it.
=======================================================================
NO-GO as category. NO guide. ONE product review.

URL      /robots/robot-snow-blowers/yarbo-snow-blower/
Type     Product review
Category robot-snow-blowers, created in launch state HIDDEN
Primary  yarbo snow blower 14,800 / KD 6
Secondary  yarbo 18,100; yarbo review 1,900; yarbo snow blower reviews 2,900;
           robot snow blower 12,100; robotic snow blower 12,100; autonomous
           snow blower 3,600; snow removal robot 880; snow clearing robot 880;
           robot snow removal 880; robot snow plow 1,000; robotic snow plow
           1,000; automatic snow blower 1,600; self driving snow blower 210;
           automatic snow removal 110; yarbo price 260; M Series and S1 as
           sections
Ceded    nothing — it is one SERP
Why one  every generic term measures 6-8/10 against the brand terms. Rule 2
         says merge. It is also the only surface where dated prices may live
         under rule 5, which is where $1,299-vs-$4,999 must be answered.
         Brand terms allowed under the rule 1 review exception.

WHY A HIDDEN CATEGORY RATHER THAN NESTING UNDER LAWN
nav.ts line 60: product: (slug, productSlug) => `/robots/${slug}/${productSlug}/`
The category slug IS the URL segment; productPath() is the single place that
shape is decided, so "hub-link without URL-nesting" is not available.
LaunchState has `hidden` — "reserved slug, noindex, not linked in nav" —
already used by solar-panel-robots. Result: clean URL, no lawn baggage, NO
MIGRATION if the flip fires (hidden -> live is one word), four comparative
surfaces unbuilt. Gates 1 and 2 pass; Gate 3 must be fixed first.

LINKING (separate decision from URL)
Linked from the robotic-lawn-mowers hub with a visible "winter module" block,
plus the lawn best-of. The Core is the lawn platform and the $7,199 mower+snow
bundle is a real cross-sell. The alternative is an orphaned review, strictly
worse.

EVIDENCE BASE — must be in the build prompt or the writer fills gaps quietly
A $4,999-$7,999 product with no retail reviews sources from three classes, each
labelled on the page: (1) Yarbo's own published specifications; (2) PCWorld's
hands-on, the only publisher present; (3) owner reports on Reddit, Trustpilot
and forum.yarbo.com, including the disappointed thread at position 3.

REFUSED, with reasons
  snow blower 246,000 ......... conventional market, Toro/Ariens/CR hold it
  best snow blower 12,100 ..... same market
  electric snow blower 40,500 . machines we do not cover
  gas snow blower 18,100 ...... same
  snow blower craftsman 22,200  brand term, not ours
  snow blowers near me 9,900 .. local intent, no premises
  snow blower home depot 5,400  retailer intent
  snow blower amazon 2,900 .... retailer intent
  best snow blower brand 1,000  conventional
  best gas snow blower 1,000 .. conventional
  automatic snow shovel 4,400 . MEASURED swallowed market (SERP above)
  driveway snow removal 1,900 . MEASURED local pack (SERP above)
  heated driveway 9,900 ....... different industry. $4.25 CPC is bait.
  best robot snow blower 140 .. RULE 4. One product = advertisement. The review
                                answers the PAA verbatim instead: "there is only
                                one, which is why this site has no ranking for
                                it."
  yarbo m1 50 / m series 720 .. preorder, no buy path. Sections only.

TRAFFIC EXPECTATION — PLANNING ASSUMPTION, UNMEASURED
Value the cluster at 40-60% of nominal. This is a heuristic, not a measurement,
and is labelled so it is never quoted as one. Reasoning: KD 0 is low because no
authority competes and the SERP is entity results rather than optimised
content, so a competent review takes top-3 quickly — but the AI Overview
already answers "do they work" so informational variants bleed zero-click, KD 0
means the SERP has not settled, and part of last January's 60,500 was the ABC7
news cycle, which was never buyable traffic.

TIMING
  Review live by 15 SEPTEMBER.
  Cross-links from lawn hub and lawn best-of go up with it (both live 11 Aug).
  Links permanent year-round; seasonality stated on-page per rule 7.
  First week of DECEMBER and first week of JANUARY: re-pull all 11 SERPs.
  TRIGGER A: robot-vs-conventional exceeds 5/10 — generic terms being absorbed
  into the big-box SERP. Halves the traffic expectation; argues for FEWER
  pages, not more.
  TRIGGER B: any of Wirecutter, NYT, Consumer Reports or TechGearLab appears in
  any robot-term top ten. Baseline today is ZERO across all eleven SERPs.
  Overlap with the conventional SERP may not move while difficulty transforms,
  so Trigger A alone is insufficient.
  First week of January also: price re-read and refresh.

FLIP CONDITION TO A FULL CATEGORY
  A second consumer autonomous machine from a DISTINCT manufacturer in
  mainstream US retail. Yarbo M Series does not count (same maker, preorder).
  If an RC or hybrid machine reaches mainstream retail, class membership is
  decided by SERP overlap at that point, not by declaration now.

=======================================================================
WHAT I WANT FROM YOU
=======================================================================
1. Clear for build, or name what stops it. Gate 3 is a known blocker with a
   known fix; say whether anything else must be settled before 15 September.
2. The hidden-category URL: rule 3's spirit is "never present comparative
   surfaces where no market exists". A hidden category presents nothing —
   noindexed hub, no route, no surfaces, and solar-panel-robots is precedent.
   Is that the rule honoured, or the letter honoured and the spirit dodged?
3. `yarbo snow blower reviews` sits at 4-5/10 — rule 2's ambiguous middle. It
   is kept on the review by judgement, not by rule. Do you agree, and would a
   negative-sentiment SERP ever justify its own URL?
4. Anything in REFUSED you would rescue, with the number that justifies it.
   Two rescue attempts have already died on measurement.
5. Motivated reasoning surviving round four. Rounds 1-3 found four, four and
   five instances. Assume this round is not clean either.

Do not write page copy. Do not invent volumes. If you need a number that is not
above, name it.
````
