# Handoff prompt — category 010 candidate, robot snow blowers

Paste the fenced block below into ChatGPT (or any model) to get a page map
reviewed or written. Everything in it was measured on 11 August 2026; nothing
in it is estimated. The constraints section is not padding — it is what stops
the model returning a plausible category plan for a market with one product in
it.

---

````text
ROLE
You are an SEO strategist reviewing a proposed page map for BotPlanet, a US
consumer-robot review site. You are not writing copy. You are deciding what
URLs should exist, what each one targets, and what must not be built.

HOUSE RULES — these are hard constraints, not preferences. A recommendation
that breaks one of them is wrong even if it would rank.
1. Never target a brand term the brand itself owns. This site has already
   refused "litter robot" (165,000/mo), "roborock" (110,000) and "irobot
   roomba" (27,100) on that ground. Exception: a term the brand ranks #1 for
   may still be targeted by a REVIEW of that product, because a review answers
   a question the maker's own page will not.
2. One page per search intent. Two URLs sharing >5 of 10 top-ten domains is
   cannibalisation and must be merged. Under 3 of 10 justifies separate URLs.
3. A "category" on this site means four surfaces: a hub, a comparison table, a
   BotMatch matcher and a best-of ranking. All four are comparative. The
   matcher is code-gated at MIN_PRODUCTS_FOR_A_MATCH = 2 and renders disabled
   below it.
4. No invented awards. A best-of with one entry is an advertisement.
5. No price may be written into a guide or best-of page. Prices live on product
   pages with the date they were read.
6. Never publish a figure a manufacturer has not published. "Not disclosed" is
   a valid and preferred value.
7. Seasonal demand is not a reason to skip a category, but it must be stated.

PRIOR PRECEDENT ON THIS SITE — use these as the calibration, not your priors.
- 005 Home Security Robots: CANCELLED. The SERP returned institutional
  procurement and encyclopedia entries where consumer purchase intent should
  have been. The bar is "no consumer demand in the SERPs = kill".
- 006 Grill Cleaning Robots: BUILT and survives with one dominant product
  (Grillbot, brand 18,100 vs category 5,400). Its matcher is gated OFF for
  having too few products, and the category still earns.
- Pet cameras: a proposed "best pet camera robot" page was killed because the
  SERP was answered by Wirecutter's best pet CAMERAS — the robot term was
  swallowed by the larger non-robot market.
- Self-cleaning litter boxes: a separate best-of page was REFUSED at 7/10
  shared domains with the hub term. The hub carries "best automatic litter box"
  (22,200/mo) itself.
- Robotic lawn mowers: a separate best-of page was APPROVED at 2/10 shared
  domains. Built 11 August 2026.

=======================================================================
MEASURED DATA — DataForSEO, US/English (location 2840), 11 August 2026.
Spend $0.2367. 24 seeds, 7 live SERPs, 65 long-tails harvested.
=======================================================================

KEYWORDS — generic robot terms
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
SUBTOTAL generic: ~22,700/mo at KD 0-9

KEYWORDS — brand
yarbo                    | 18,100 | 13 | $3.08 |   33,100 |      9,900 |   3x
yarbo snow blower        | 14,800 |  6 | $2.24 |   74,000 |        720 | 103x
yarbo snow blower reviews|  2,900 |  0 |     - |        - |          - |    -
yarbo review             |  1,900 |  0 | $2.03 |    3,600 |      1,300 |   3x
yarbo m series           |    720 |  0 |     - |        - |          - |    -
yarbo price              |    260 |  2 | $2.61 |      590 |        170 |   3x
yarbo m1                 |     50 |  0 | $4.20 |      170 |         10 |  17x
yarbo s1                 |     20 |  6 | $2.46 |       50 |         10 |   5x
SUBTOTAL brand: ~38,750/mo

KEYWORDS — controls and adjacent
snow blower (conventional)| 246,000 | 41 | $0.49 | 1,220,000 | 27,100 | 45x
electric snow blower      |  40,500 |  6 |     - |         - |      - |   -
snow blower craftsman     |  22,200 |  0 |     - |         - |      - |   -
gas snow blower           |  18,100 |  4 |     - |         - |      - |   -
best snow blower          |  12,100 |  0 | $0.65 |    60,500 |  1,300 | 47x
heated driveway           |   9,900 |  0 | $4.25 |    40,500 |  2,400 | 17x
snow blowers near me      |   9,900 |  0 |     - |         - |      - |   -
snow blower home depot    |   5,400 |  0 |     - |         - |      - |   -
automatic snow shovel     |   4,400 |  0 |     - |         - |      - |   -   <-- new find, no seed produced it
snow blower amazon        |   2,900 |  0 |     - |         - |      - |   -
driveway snow removal     |   1,900 |  8 | $1.30 |    14,800 |     90 | 164x
best snow blower brand    |   1,000 |  1 |     - |         - |      - |   -
best gas snow blower      |   1,000 |  9 |     - |         - |      - |   -
automatic snow removal    |     110 |  0 | $0.53 |       390 |     10 |  39x

SERP OVERLAP (shared top-10 domains, live SERPs)
robot snow blower  vs snow blower (conventional) : 2/10  (youtube, lowes)
robotic snow blower vs snow blower               : 2/10
yarbo snow blower  vs snow blower                : 1/10
autonomous snow blower vs snow blower            : 2/10
best robot snow blower vs snow blower            : 2/10
robot snow blower  vs yarbo                      : 7/10
robot snow blower  vs yarbo snow blower          : 6/10

SERP COMPOSITION for "robot snow blower"
Features: ai_overview, video, popular_products, people_also_ask,
          related_searches, images
 2 amazon.com     "YARBO 2-Stage 24/7 Autonomous Robot Snow Blower..."
 3 smart-dots.com "Commercial Robotic Snow Blower"
 5 reddit.com     "Winter is coming, does anyone sell a good robotic..."
 8 youtube.com
 9 cnygreenteam.com
11 reddit.com
12 lowes.com
13 abc7chicago.com
No Wirecutter, no NYT, no Consumer Reports, no TechGearLab on any robot term.
No institutional/procurement/encyclopedia results anywhere in the top ten.

PEOPLE ALSO ASK, head term, verbatim
- Do robot snow blowers work?
- How much does a robot snow blower cost?
- What is the best robotic snow blower?
- Are remote snowblowers worth the money?

=======================================================================
PRODUCT VERIFICATION — 11 August 2026, primary sources only
=======================================================================

THERE IS ONE MANUFACTURER AND NO SECOND MACHINE.
- Snowbot IS Yarbo. Hanyang Technology Co. Ltd (Shenzhen), NY branch "Hanyang
  Robotics" 2019, Snowbot S1 $1,999 in 2021, S1 Pro $2,999, now sold as Yarbo.
  snowbot.com does not resolve; thesnowbot.com serves Yarbo's own store.
- Left Hand Robotics: acquired by The Toro Company, March 2021. Commercial
  sidewalk clearing, not consumer.
- smart-dots.com and cnygreenteam.com are DEALERS. CNY Green Team lists nine
  SKUs, all Yarbo.

IDENTITY (resolved cleanly)
Brand         : Yarbo
Model number  : YARBO S1        (Lowe's "Model #YARBO S1", item 8256113)
Retail title  : "Black Yarbo S1" (Best Buy SKU J3Q5Q8G9GS)
Product name  : Yarbo Snow Blower (yarbo.com/products/yarbo-snow-blower)
Amazon ASIN   : B0FJF9V1JC
Seller        : "Sold and Shipped by Yarbo" (Lowe's)
Owner reviews : 0 ratings at Lowe's on 11 Aug 2026
Retail        : Amazon, Best Buy, Lowe's — genuine mainstream US distribution

IT IS A MODULE, NOT A SNOW BLOWER. Yarbo is a "1+N" modular system: "One
intelligent core powers multiple attachments with seamless hot-swapping."
Modules: lawn mower, snow blower, leaf blower, trimmer.
  Snow Blower Module alone .................. $1,299
  "Yarbo Snow Blower" (Core+module+dock+etc) . $4,999
  Yarbo Core alone, dealer discount .......... $4,999 -> $3,599
  Modular Snow Blower Robot, dealer .......... $4,530
  Lawn Mower Pro + Snow Blower ............... $7,199
  Complete 4-in-1 ............................ $7,999
The same phrase "snow blower" is quoted at $1,299 and $4,999 depending on
whether the robot is included.

PUBLISHED SPECS (first-party, yarbo.com)
clearing width 24 in | intake height 12 in adj | throw 6-40 ft adj
battery 38.4 Ah | runtime ~90 min | charge 90 min 20-80%
area 6,000 sq ft per charge at 1 in snow | max slope 36% (21 deg)
temp -13F to +140F | Q355 steel | IPX5 | warranty up to 5 yr (2 yr standard)

CONFLICTS FOUND — record, do not resolve by picking the nicer number
1. Runtime: yarbo.com "approximately 90 minutes" vs third-party reviews
   "up to 4 hours". First-party wins.
2. Throw: Yarbo's own module page says "up to 40 feet" AND "6-40 Yards Throw
   Control" in the same panel. One is wrong, both are Yarbo's.
3. Price: third-party reviews headline "$4,999" for a "standalone snow blower
   package"; the module alone is $1,299.
4. Zero owner reviews at Lowe's for a $4,999 purchase.

NOT ESTABLISHED
- Amazon's own details table could not be read (WebFetch returns head only;
  DataForSEO merchant endpoints not enabled on this account). Brand/model rest
  on Lowe's and Best Buy. No buy link should ship before a first-party Amazon
  confirmation.
- M Series is Kickstarter pre-order, not sold.

=======================================================================
THE VERDICT ALREADY REACHED — challenge it if the data does not support it
=======================================================================
NO-GO as a category (all four category surfaces are comparative and there is
nothing to compare; the matcher would be gated off on day one).
GO as three pages under the EXISTING robotic-lawn-mowers hub, because Yarbo is
a modular yard robot whose snow blower shares a core with its mower:
  1. Yarbo review          -> yarbo 18,100 / yarbo snow blower 14,800 /
                              yarbo review 1,900 / reviews 2,900
  2. "Do robot snow blowers work?" -> robot snow blower 12,100 KD 0,
                              robotic 12,100, autonomous 3,600
  3. "How much does a robot snow blower cost?" -> the $1,299 vs $4,999 question
~36,000/mo combined at KD 0-13, no comparative surface pretending a market
exists, and a clean promotion path to a full category if a second manufacturer
ships.

=======================================================================
WHAT I WANT FROM YOU
=======================================================================
1. Agree or disagree with NO-GO-as-category, and say which single piece of
   evidence would flip your answer.
2. Return the page map as a table: URL | page type | primary term (+volume, KD)
   | secondary terms | terms explicitly ceded and to which URL | why this is a
   separate URL rather than a section.
3. Name every term in the data above that should be REFUSED — targeted by no
   page of ours — with the reason.
4. Say where "automatic snow shovel" (4,400, KD 0) belongs, if anywhere. It is
   the one term no seed produced and it may be a different intent entirely.
5. State how the 38x-158x seasonality should change publication timing and
   internal linking, if at all.
6. Flag anything in my verdict you think is motivated reasoning rather than
   evidence.

Do not write page copy. Do not invent volumes. If a recommendation needs a
number that is not above, say which number you need.
````

---

## Provenance

- Keyword and SERP data: `research-output/robot-snow-blowers-results.json`,
  DataForSEO, 11 August 2026, $0.2367 of a $2.00 cap.
- Seed inventory: `docs/seo/seeds/robot-snow-blowers.json`
- Full findings and reasoning: `docs/seo/snow-blower-research-2026-08-11.md`
- Product verification sources, all read 11 August 2026: yarbo.com,
  yarbo.com/products/yarbo-snow-blower, yarbo.com/products/snow-blower-module,
  lowes.com item 8256113, bestbuy.com SKU J3Q5Q8G9GS, smart-dots.com,
  cnygreenteam.com, thesnowbot.com.
