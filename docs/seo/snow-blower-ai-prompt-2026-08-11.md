# Handoff prompt — category 010, robot snow blowers (v2, post-adversarial)

Paste the fenced block into any model. v1 proposed three pages; adversarial
review broke two house rules and one precedent, two extra SERP pulls resolved
the map to one page. This is the corrected version.

````text
ROLE
You are an SEO strategist reviewing a page map for BotPlanet, a US
consumer-robot review site. You are not writing copy. You decide what URLs
exist, what each targets, and what must not be built. This map has already
survived one adversarial review; your job is to break it again or sign it off.

HOUSE RULES — hard constraints. A recommendation breaking one is wrong even if
it would rank.
1. Never target a brand term the brand owns. Already refused: "litter robot"
   (165,000/mo), "roborock" (110,000), "irobot roomba" (27,100). EXCEPTION: a
   term the brand ranks #1 for may be targeted by a REVIEW of that product,
   because a review answers what the maker's page will not.
2. One page per intent. >5 of 10 shared top-10 domains = cannibalisation, must
   merge. Under 3 of 10 justifies separate URLs.
3. A "category" here = four surfaces: hub, comparison table, BotMatch matcher,
   best-of. All comparative. Matcher code-gated at MIN_PRODUCTS_FOR_A_MATCH = 2.
4. No invented awards. A best-of with one entry is an advertisement.
5. No price in a guide or best-of. Prices live on product pages with the date
   they were read.
6. Never publish a figure a manufacturer has not published. "Not disclosed" is
   valid and preferred.
7. Seasonal demand is not a reason to skip, but must be stated on-page.

PRIOR PRECEDENT — calibrate on these, not on your priors.
- 005 Home Security Robots: CANCELLED. SERP returned institutional procurement
  and encyclopedia entries where purchase intent should have been. Bar = "no
  consumer demand in the SERPs = kill".
- 006 Grill Cleaning Robots: BUILT as a ONE-PRODUCT category, matcher gated
  OFF, and it earns. Generic volume only 5,400. THIS IS THE BINDING PRECEDENT
  FOR SNOW — see the correction note below.
- Pet cameras: "best pet camera robot" killed because the SERP was answered by
  Wirecutter's best pet CAMERAS. Robot term swallowed by the larger market.
- Litter boxes: separate best-of REFUSED at 7/10 shared with the hub term.
- Lawn mowers: separate best-of APPROVED at 2/10 shared. Built 11 Aug 2026.

=======================================================================
MEASURED DATA — DataForSEO, US/English (2840), 11 Aug 2026. $0.2447 spend.
24 seeds, 9 live SERPs, 65 long-tails.
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
yarbo snow blower reviews|  2,900 |  0 |     - |        - |          - |    -
yarbo review             |  1,900 |  0 | $2.03 |    3,600 |      1,300 |   3x
yarbo m series           |    720 |  0 |     - |        - |          - |    -
yarbo price              |    260 |  2 | $2.61 |      590 |        170 |   3x
yarbo m1                 |     50 |  0 | $4.20 |      170 |         10 |  17x
yarbo s1                 |     20 |  6 | $2.46 |       50 |         10 |   5x

DO NOT SUM BRAND + GENERIC. v1 claimed "~36,000/mo combined" and that was
double-counting: the SERPs are 6-8/10 identical, so it is the same searchers
counted twice. HONEST UNIQUE DEMAND ~20,000-22,000/mo.

CONTROLS AND ADJACENT
snow blower (conventional)| 246,000 | 41 | $0.49 | 1,220,000 | 27,100 | 45x
electric snow blower      |  40,500 |  6
snow blower craftsman     |  22,200 |  0
gas snow blower           |  18,100 |  4
best snow blower          |  12,100 |  0 | $0.65 |    60,500 |  1,300 | 47x
heated driveway           |   9,900 |  0 | $4.25 |    40,500 |  2,400 | 17x
snow blowers near me      |   9,900 |  0
snow blower home depot    |   5,400 |  0
automatic snow shovel     |   4,400 |  0   <-- tested, see below
snow blower amazon        |   2,900 |  0
driveway snow removal     |   1,900 |  8 | $1.30 |    14,800 |     90 | 164x
best snow blower brand    |   1,000 |  1
best gas snow blower      |   1,000 |  9
automatic snow removal    |     110 |  0 | $0.53 |       390 |     10 |  39x

SERP OVERLAP — shared top-10 domains, all live
vs CONVENTIONAL market:
  robot snow blower      vs snow blower : 2/10 (youtube, lowes)
  robotic snow blower    vs snow blower : 2/10
  yarbo snow blower      vs snow blower : 1/10
  autonomous snow blower vs snow blower : 2/10
  best robot snow blower vs snow blower : 2/10
  snow removal robot     vs snow blower : 0/10
vs BRAND — these are the decisive ones:
  robot snow blower      vs yarbo             : 7/10
  robot snow blower      vs yarbo snow blower : 6/10
  autonomous snow blower vs yarbo             : 6/10
  autonomous snow blower vs yarbo snow blower : 5/10
  autonomous snow blower vs robot snow blower : 8/10
  snow removal robot     vs robot snow blower : 7/10
  snow removal robot     vs yarbo             : 5/10

SERP COMPOSITION "robot snow blower"
features: ai_overview, video, popular_products, people_also_ask,
          related_searches, images
 2 amazon.com     "YARBO 2-Stage 24/7 Autonomous Robot Snow Blower..."
 3 smart-dots.com "Commercial Robotic Snow Blower"
 5 reddit.com     "Winter is coming, does anyone sell a good robotic..."
 8 youtube.com  9 cnygreenteam.com  11 reddit.com  12 lowes.com
13 abc7chicago.com (viral news video, still ranking in August)
No Wirecutter, NYT, Consumer Reports or TechGearLab on ANY robot term.
No institutional/procurement/encyclopedia results anywhere.

SERP COMPOSITION "automatic snow shovel" — hypothesis tested and CONFIRMED
 2 reddit.com   3 amazon.com (Snow Joe)   6 homedepot.com
 7 nytimes.com (Ryobi One+ 18V Electric Snow Shovel Review)
 8 lowes.com    9 greenworkstools.com    16 thespruce.com   17 acehardware.com
~$100 corded tools. NYT and The Spruce already hold the review intent. 4/10
vs robot snow blower. This is the pet-camera swallowed-market pattern.
REFUSED. The 4,400 at KD 0 is bait.

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
  $1,999 in 2021, S1 Pro $2,999, now sold as Yarbo. snowbot.com dead;
  thesnowbot.com serves Yarbo's store.
- Left Hand Robotics: acquired by Toro, March 2021. Commercial, not consumer.
- smart-dots.com and cnygreenteam.com are DEALERS. CNY lists 9 SKUs, all Yarbo.

IDENTITY (clean)
Brand: Yarbo | Model #: YARBO S1 (Lowe's, item 8256113)
Best Buy title: "Black Yarbo S1", SKU J3Q5Q8G9GS
Product name: Yarbo Snow Blower | Amazon ASIN B0FJF9V1JC
Seller: "Sold and Shipped by Yarbo" (Lowe's) | 0 owner reviews at Lowe's
Retail: Amazon + Best Buy + Lowe's — genuine mainstream US distribution

IT IS A MODULE, NOT A SNOW BLOWER. "1+N" system: one Core, four attachments
(mower, snow blower, leaf blower, trimmer). THE CORE IS THE LAWN PLATFORM.
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
3. Price: reviews headline "$4,999" for a "standalone" unit; module is $1,299.
4. Zero owner reviews at Lowe's on a $4,999 purchase.

NOT ESTABLISHED
- Amazon's own details table unread (WebFetch returns head only; DataForSEO
  merchant endpoints not enabled on this account). Brand/model rest on Lowe's
  and Best Buy. NO BUY LINK SHIPS until confirmed first-party on Amazon.
- M Series is Kickstarter pre-order, not sold.

=======================================================================
WHAT THE FIRST ADVERSARIAL REVIEW BROKE — do not repeat these
=======================================================================
1. v1 said NO-GO because "nothing to compare". WRONG REASON. Grillbot was
   built as a one-product category with the matcher gated off and it earns, on
   LESS generic volume (5,400 vs 22,700). That reason silently moved the
   category bar and made Grillbot unexplainable. Correct reasons: (a) 7/10
   overlap shows Google has collapsed the generic market onto one brand, so a
   category shell = four surfaces chasing one SERP; (b) Yarbo's Core IS the
   lawn platform, so the entity belongs under lawn on the merits.
2. v1 proposed 3 pages. Pages 1 and 2 measured 6-7/10 against each other —
   cannibalisation by rule 2, from its own data.
3. v1's third page was a cost guide built on the $1,299-vs-$4,999 question.
   Rule 5 bans prices in guides. The angle is good, which is why the rule got
   forgotten.
4. v1 summed brand + generic to "~36,000". Double-counting.

=======================================================================
CURRENT MAP — ONE PAGE. Break it or sign it off.
=======================================================================
NO-GO as category. NO separate guide. ONE product review.

URL      /robots/robotic-lawn-mowers/yarbo-snow-blower/
Type     Product review, under the existing lawn hub
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
  automatic snow shovel 4,400 . MEASURED: Snow Joe/Ryobi SERP with NYT and
                                The Spruce. Swallowed market.
  heated driveway 9,900 ....... different industry. $4.25 CPC is bait.
  driveway snow removal 1,900 . contractor/local. Refused provisionally.
  best robot snow blower 140 .. RULE 4. One product = advertisement. This is
                                the term that makes the NO-GO real.
  yarbo m1 50 / m series 720 .. preorder, no buy path. Sections only.

TIMING — dictated by 103x seasonality on the money term
  Review live by 15 SEPTEMBER. Deliverable date, not a preference. A page
  published into the January curve loses to one indexed three months earlier.
  Cross-links from the lawn hub and lawn best-of go up with it (both live as
  of 11 Aug). Links permanent year-round; seasonality stated on-page per rule 7.
  First week of January: price re-read + refresh. Last January's spike was
  partly news-driven (the ABC7 viral video still ranks in August) and freshness
  decides January CTR.

WHAT WOULD FLIP THIS TO A FULL CATEGORY
  One thing: a second consumer autonomous machine from a DISTINCT manufacturer
  in mainstream US retail. Yarbo M Series does not count (same maker,
  preorder). RC/hybrid gas machines do not count (different class) — though
  the PAA "are remote snowblowers worth the money" earns them a walk-away
  paragraph inside the review.

=======================================================================
WHAT I WANT FROM YOU
=======================================================================
1. Sign off or break the one-page map. If you break it, name the measured
   number that forces a second URL.
2. Is "under the lawn hub" correct, or motivated reasoning? Nobody searching
   "robot snow blower" in January is thinking about lawns. Argue both sides
   and pick one.
3. All overlap was measured in AUGUST — the demand trough. Lowe's and Home
   Depot push hard in December. Could the 2/10 separation from the
   conventional market be a summer artifact? Say what you would re-measure and
   when.
4. KD 0 on a 12,100 term: prize or warning? Difficulty that low usually means
   Google has not settled the query's meaning. There is an AI Overview on the
   head term already.
5. Anything in the REFUSED list you would rescue, with the number that
   justifies it.
6. Flag any remaining motivated reasoning. v1 had four instances; assume some
   survived.

Do not write page copy. Do not invent volumes. If you need a number that is
not above, name it.
````
