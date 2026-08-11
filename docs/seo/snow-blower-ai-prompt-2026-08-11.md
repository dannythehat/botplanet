# Handoff prompt — category 010, robot snow blowers (v3, merge review)

v1: three pages. v2: one page after adversarial review. v3: signed off with
amendments, URL corrected, all numbers fetched. This is the merge-review copy.

````text
ROLE
You are performing the final merge review on a page map for BotPlanet, a US
consumer-robot review site. Two adversarial reviews have already run; both
found real faults and both are recorded below. You are not writing copy. Sign
this off for build, or name the measured number that stops it.

HOUSE RULES — hard constraints. A recommendation breaking one is wrong even if
it would rank.
1. Never target a brand term the brand owns. Already refused: "litter robot"
   (165,000/mo), "roborock" (110,000), "irobot roomba" (27,100). EXCEPTION: a
   term the brand ranks #1 for may be targeted by a REVIEW of that product.
2. One page per intent. >5 of 10 shared top-10 domains = merge. Under 3 of 10
   justifies separate URLs.
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
MEASURED DATA — DataForSEO, US/English (2840), 11 Aug 2026. $0.2487 spend.
24 seeds, 10 live SERPs, 65 long-tails.
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
automatic snow shovel     |   4,400 |  0   <-- tested, refused, see below
snow blower amazon        |   2,900 |  0
driveway snow removal     |   1,900 |  8 | $1.30 |    14,800 |     90 | 164x  <-- tested, refused
best snow blower brand    |   1,000 |  1
best gas snow blower      |   1,000 |  9
automatic snow removal    |     110 |  0 | $0.53 |       390 |     10 |  39x

SERP OVERLAP — shared top-10 domains, all live, all measured in AUGUST
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

SERP "robot snow blower"
features: ai_overview, video, popular_products, people_also_ask, images
 2 amazon.com "YARBO 2-Stage 24/7 Autonomous Robot Snow Blower..."
 3 smart-dots.com  5 reddit.com  8 youtube.com  9 cnygreenteam.com
11 reddit.com  12 lowes.com  13 abc7chicago.com (viral news, still ranking Aug)
No Wirecutter, NYT, Consumer Reports or TechGearLab on ANY robot term.
No institutional/procurement/encyclopedia results anywhere.

SERP "automatic snow shovel" — hypothesis tested, CONFIRMED SWALLOWED
 3 amazon.com (Snow Joe)  6 homedepot.com  7 nytimes.com (Ryobi review)
 8 lowes.com  9 greenworkstools.com  16 thespruce.com  17 acehardware.com
~$100 corded tools. NYT and The Spruce hold the review intent. 4/10 vs robot
snow blower. Pet-camera pattern. REFUSED — 4,400 at KD 0 is bait.

SERP "driveway snow removal" — rescue attempted, FAILED
features: LOCAL_PACK, people_also_ask, video, perspectives
 5 homedepot.com  7 instructables.com  8 lawnlove.com  10 taskrabbit.com
11 familyhandyman.com  17 allenoutdoorstl.com  18 spokanegreenscape.com
Local services pack + contractors. 1/10 overlap against robot snow blower,
yarbo AND conventional. REFUSED, not even as a secondary — unrankable without
premises. The robot-vs-contractor comparison stays as CONTENT in the review's
walk-away section; it is not a targeted term.

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
0 owner reviews at Lowe's | Retail: Amazon + Best Buy + Lowe's

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
4. Zero owner reviews at Lowe's on a $4,999 purchase.

NOT ESTABLISHED
- Amazon's details table unread (WebFetch returns head only; DataForSEO
  merchant endpoints not enabled on this account). Brand/model rest on Lowe's
  and Best Buy. NO BUY LINK SHIPS until confirmed first-party on Amazon.
- M Series is Kickstarter pre-order, not sold.

=======================================================================
WHAT TWO ADVERSARIAL REVIEWS BROKE — do not repeat
=======================================================================
ROUND 1
1. v1 said NO-GO because "nothing to compare". WRONG REASON — Grillbot was
   built as a one-product category on LESS volume (5,400 vs 22,700) and earns.
   That reason silently moved the category bar. Correct reasons: (a) 7/10
   overlap shows Google collapsed the generic market onto one brand, so a
   category shell = four surfaces chasing one SERP; (b) Yarbo's Core IS the
   lawn platform.
2. v1 proposed 3 pages; pages 1 and 2 measured 6-7/10 against each other.
   Cannibalisation by rule 2, from its own data.
3. v1's third page was a cost guide built on $1,299-vs-$4,999. Rule 5 bans
   prices in guides.
4. v1 summed brand + generic to "~36,000". Double-counting.
ROUND 2
5. v2's URL nested the review under robotic-lawn-mowers. Fixed — see below.
6. v2 said "loses to one indexed three months earlier". Invented precision;
   nothing measures indexation-age advantage. The 15 Sept date stands alone.
7. v2's "~20,000-22,000 unique demand" was an estimated dedup rate. 22,700 is
   a ceiling, not a figure.
8. v2 excluded RC/hybrid machines from the flip condition by declaring them "a
   different class" — an assertion in a document that demands measurements.
   Corrected: class membership decided by SERP overlap if one reaches retail.

=======================================================================
CURRENT MAP — ONE PAGE. Sign off or name the number that stops it.
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
           yarbo price 260; M Series and S1 as sections
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
already used by solar-panel-robots. liveCategories() excludes hidden, which is
what the sitemap and the comparison gate read. Result: clean URL, no lawn
baggage, NO MIGRATION if the flip fires (hidden -> live is one word), and the
four comparative surfaces stay unbuilt.
BUILD-TIME CHECK OUTSTANDING: does a product page under a hidden category
inherit noindex? If yes, that is the blocker and lawn nesting is the fallback.

LINKING (separate decision from URL)
Linked from the robotic-lawn-mowers hub with a visible "winter module" block so
a human understands why it is there, plus the lawn best-of. The Core is the
lawn platform and the $7,199 mower+snow bundle is a real cross-sell. The
alternative is an orphaned review with no hub, which is strictly worse.

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
  automatic snow shovel 4,400 . MEASURED swallowed market (see SERP above)
  driveway snow removal 1,900 . MEASURED local pack (see SERP above)
  heated driveway 9,900 ....... different industry. $4.25 CPC is bait.
  best robot snow blower 140 .. RULE 4. One product = advertisement. This is
                                the term that makes the NO-GO real. The review
                                answers the PAA verbatim instead: "there is
                                only one, which is why this site has no
                                ranking for it."
  yarbo m1 50 / m series 720 .. preorder, no buy path. Sections only.

TRAFFIC EXPECTATION
Value the cluster at 40-60% of nominal. KD 0 is low because no authority
competes and the SERP is entity results rather than optimised content, so a
competent review takes top-3 quickly. Against that: the AI Overview already
answers "do they work" so informational variants bleed zero-click; KD 0 means
the SERP has not settled; and part of last January's 60,500 was the ABC7 news
cycle, which was never buyable traffic.

TIMING
  Review live by 15 SEPTEMBER.
  Cross-links from lawn hub and lawn best-of go up with it (both live 11 Aug).
  Links permanent year-round; seasonality stated on-page per rule 7.
  First week of DECEMBER and first week of JANUARY: re-pull all 10 SERPs.
  TRIGGER: if robot-vs-conventional exceeds 5/10, the generic terms are being
  absorbed into the big-box SERP. That halves the traffic expectation and
  argues for FEWER pages, not more. Architecture is season-proof; the
  expectation is not.
  First week of January also: price re-read and refresh.

FLIP CONDITION TO A FULL CATEGORY
  A second consumer autonomous machine from a DISTINCT manufacturer in
  mainstream US retail. Yarbo M Series does not count (same maker, preorder).
  If an RC or hybrid machine reaches mainstream retail, class membership is
  decided by SERP overlap at that point, not by declaration now.

=======================================================================
WHAT I WANT FROM YOU
=======================================================================
1. Sign off for build, or name the measured number that stops it.
2. The hidden-category URL: does it survive your reading of rule 3? A hidden
   category is still a category record. Is that the letter of the rule being
   honoured while its spirit is dodged?
3. All overlap was measured in August, the demand trough. Is the December /
   January re-pull with a >5/10 trigger sufficient, or does something need
   measuring before 15 September?
4. Anything in REFUSED you would still rescue, with the number that justifies
   it.
5. Any motivated reasoning surviving round three. Rounds 1 and 2 found four
   instances each; assume this round is not clean either.

Do not write page copy. Do not invent volumes. If you need a number that is
not above, name it.
````
