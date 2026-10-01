# Robot news and New Robots: how the content engine works (for agreement, not yet built)

Agreed direction (owner, 1 October 2026): cover everything to do with robots and AI robots; link to the money
pages wherever it helps the reader; use other sources for the news, but build our own content and our own
images around it. Not a feed of other people's stories.

## 1. What "our own" means, in practice

A source gives us a **fact** (a robot was announced, a price changed, a model shipped). We never copy its
sentences, structure or pictures. Every post has to pass one test before it publishes:

> What does this page give the reader that the source did not?

At least one of these must be true, and the post says which:
* **Our analysis:** what it means for someone deciding what to buy.
* **Our comparison:** how it stacks up against robots we already cover, with figures from official pages.
* **Our data:** a price, availability or spec we checked ourselves, with the date.
* **Our picture:** a graphic or render we made, not a copied photograph.
* **Our answer:** the question a buyer actually asks ("can I buy it, and what does it cost?").

A post that is only a rewording of the source does not publish. This is also what search engines reward: they
demote mass-produced pages that add nothing, so volume stays low and quality stays high.

## 2. The post types

| Type | Length | Purpose |
|---|---|---|
| News brief | 200 to 350 words | The news in one line with source, what changed, who it matters to, our take, can you buy it, where to go next |
| Analysis | 700 to 1,000 | A news hook with a real comparison or buyer angle |
| Explainer (evergreen) | 900 to 1,500 | The questions that never expire: what is a humanoid robot, how much does a home robot cost, can I buy one |
| Roundup | 900 to 1,500 | Event or period summary (CES, IFA, best new robots this quarter) |
| Arrivals entry | short | One robot on the New Robots list, passing the buyable test |

News briefs are for freshness, links and social. Explainers and roundups are for lasting search traffic.

## 3. Every post links to money pages, by a fixed map

| If the story is about | It links to |
|---|---|
| Humanoid and home robots | the New Robots list, the "can you buy a humanoid robot" guide |
| Robot dogs and pets, companion and AI companion robots | the companion hub, the robot dog guide and best-of |
| Robot vacuums and mops | the robot vacuum hub and best-of |
| Robot lawn mowers and snow | the lawn mower hub and best-of |
| Pool robots and skimmers | the pool hub, the pool best-ofs, the solar skimmer best-of |
| Window, grill, litter, pet camera, coding robots | their hubs and best-ofs |
| Kitchen, cooking, laundry robots | a hub we have not built yet |

Rules: two or three money links per post, only where they genuinely help; the anchor is a normal phrase in the
sentence; a buy button only where we can sell the product; the affiliate disclosure sits beside any buy button.
The existing rule still holds: every new page gets inbound links from older ones.

## 4. Pictures: ours, with a template, never blocking a post

* Each post has one hero in the page-system format (1672x941 and a phone version) and a square social crop
  made from it by the same tool, so the blog and the socials look like one brand.
* The owner makes the art. Until it exists the post shows the BotPlanet placeholder and stays noindex; the
  image checklist (`page:images`) says exactly which pictures are missing.
* For every story the engine produces an image brief (subject, mood, what words go on it) so the art can be made
  in one pass.
* Where the story is about a product we already hold a render of, we reuse our own render.

## 5. Source handling

* Two or more sources for any claim a buyer might act on; the source is linked in the post with the date read.
* Each fact is labelled confirmed by the maker, reported by a named outlet, or rumour. Rumours are written as
  rumours or not used.
* Prices and availability are re-read from the retailer or maker before publishing, never copied from a story.
* We keep the source list (names, feeds) in the repo, so the sources are chosen on purpose.

## 6. The New Robots list (the money page)

Entry rule (all must pass): orderable by a US buyer now or a dated pre-order; a real price from a real
retailer or the maker; identity checked to the exact model; a working affiliate route on any network (Amazon,
Awin, CJ, Impact, Rakuten, ShareASale, FlexOffers or a direct programme) or it stays "news only"; a return
policy we can state. Each entry has our own picture, a dated "added" stamp, and its buy button.

## 7. Automation, in order of build

1. Source watcher: collects candidate stories from the chosen sources and drops duplicates.
2. Scoring: buyable, affiliate route, search demand, category match.
3. Draft: a post in the page-file format with sources, an image brief and the money-page links filled from the map.
4. Owner review: nothing publishes without approval.
5. Social pack: a script and caption per platform with tracked links, made from the post.
6. Weekly digest email.
7. Indexing through Search Console, once a connection exists.

## 8. What happens before anything is built

* Research wave two: the robot dog, cooking and kitchen, Unitree model, companion and humanoid price clusters,
  plus a headings and formats audit of the sites ranking for them.
* The affiliate check: which networks carry 1X, Unitree resellers and the new kitchen and companion robots, and
  which accounts the owner already holds.
* The source shortlist, agreed with the owner.
* Then the templates (news brief, explainer, arrivals entry), then the arrivals list with its first products,
  then the first posts by hand, then the automation.

---

## Decisions so far (owner, 1 October 2026)

* Cadence: one or two articles a day, each approved before it publishes.
* Images: OpenAI's image API, with the owner's key. The key lives in a private file outside the repo while we
  work, and in a GitHub Actions secret if a scheduled job ever runs. Never in a file or a commit.
* Every article names its sources, in the text and in a Sources list.
* Every article ends with a "Where to buy" block built from a product list. A product we hold gets our buy button.
  A product we do not hold gets the best link we have: our affiliate link where a programme exists, otherwise the
  maker's or retailer's own page with no commission. Each also links to our own page for it.

## News sources checked (feeds reachable from our build environment, 1 October 2026)

Working feeds: The Robot Report, IEEE Spectrum Robotics, TechCrunch Robotics, Interesting Engineering,
humanoid.guide, Engadget. The Verge's robots feed answered with almost nothing and needs another look.
Maker pages reachable: 1X, Unitree, Figure. Boston Dynamics' newsroom did not answer.
These are for finding stories and checking facts. Nothing is copied from them.

## Affiliate availability: not confirmed yet

* RobotShop is a Unitree distributor (R1 on pre-order there). A search found no stated affiliate programme.
* No affiliate or referral programme for 1X NEO turned up.
* Unitree sells direct and through resellers; no programme confirmed.
* This has to be checked inside the networks the owner holds (Awin, CJ, Impact, Rakuten, ShareASale, FlexOffers)
  by searching each for RobotShop, RoboStore, Unitree and the other sellers. Until a programme is confirmed,
  those products are linked without commission.
