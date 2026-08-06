# Security Robots — structural findings (free SERP reconnaissance)

**Date:** 2026-08-06 · **Cost: $0.00** · Stage 1.5, between the seed inventory
and the paid run.

**Status: PROVISIONAL, and the paid run has not happened yet.** The GitHub MCP
connection dropped mid-session so the workflow could not be dispatched from
here. Seed inventory is committed and waiting at
`docs/seo/seeds/security-robots.json` — Actions → "SEO Research" → category
`security-robots`.

**Method and its limits, stated up front.** This is twelve live SERPs read
through a search API, not DataForSEO's top-ten domain lists, and it carries no
volume or difficulty figures at all. It is good enough to answer *what kind of
query each term is* — which is the structural question — and not good enough to
size anything. Where the evidence below is thin I say so.

---

## 1. The headline: this category does not behave like the others

Pool, window and lawn all had the same shape — a consumer head term returning
retailers and review publishers. Security does not, and one test makes it
obvious.

### The control

| Query | What Google returns |
|---|---|
| **`home security camera`** *(control — a term we would never target)* | Amazon · safehome.org · ring.com · arlo.com · security.org · homedepot.com · consumerreports.org ×3 |
| **`security robot`** | smprobotics.com · bostondynamics.com · asylonrobotics.com · daxbot.com · **a USPTO patent PDF** · **an arXiv paper** · CNN |

The control is a mature consumer market: retailers, manufacturers, and three
separate Consumer Reports pages. `security robot` is an enterprise and academic
term. Knightscope, SMP, Cobalt, Asylon and Boston Dynamics sell to facilities
managers, not homeowners.

**Zero overlap between the two.** Whatever "security robot" is, Google does not
think it is a kind of home security camera.

### It gets clearer one level down

| Query | What Google returns | Read |
|---|---|---|
| `indoor security robot` | **MDPI academic paper** · **arXiv paper** · SuperDroid Robots · Cobalt AI · spygearco | Academic + B2B |
| `best home security robot` | safehome.org · smprobotics · moorebot · eBay · **Adobe Stock ×2** · a Tom's Guide page about a wristband | Nothing to show |
| `robot guard dog for home security` | **toborlife.ai ×4 of 8** · ARES Security · Halo Group · FOX 2 Detroit · UNILAD | Nothing to show |

**Adobe Stock ranking twice in the top eight of a commercial "best" query is the
finding.** Google is serving stock photography for a buying query. That happens
when there is no content competing, and there is no content competing because
there is no money in it. The same signature appears on `robot guard dog`, where
a single small vendor holds half the page.

For comparison: `best robot lawn mower` returned NYTimes, Consumer Reports,
CNET, ZDNet and Reviewed. That is what a real commercial query looks like.

---

## 2. Where the demand actually is

One term in this whole space returned a normal consumer commerce SERP:

| Query | What Google returns |
|---|---|
| **`pet camera robot`** | **Amazon** (Enabot EBO ROLA) · store.enabot.com ×3 · keyirobot · gearbrain · Newegg · Walmart |
| **`best pet camera robot 2026`** | cybernews · **SafeWise** · **eufy** · thehappylovedlife · crigge · smarthomeexplorer |
| `indoor home monitoring robot for elderly and pets` | **three Amazon product listings** · gearbrain · keyirobot |

Retailers, manufacturers, and six independent publisher roundups. That is a real
market with real editorial competition — the shape pool and lawn had.

**And it shares nothing with `security robot`. Zero domains in common.**

The machines are the same machines. Enabot's EBO Air is sold as a security
camera *and* a pet camera *and* a family robot. But the query that carries
commercial intent is the pet one, and the query that carries none is the
security one.

---

## 3. What that means for the five sections in the brief

| Proposed section | Verdict | Why |
|---|---|---|
| **1. Mobile home security & smart patrollers** | **Refuse as a page** | The SERP is B2B. And both anchor products are unbuyable: **Amazon Astro is invite-only at $1,599** and **Ring Always Home Cam has been invite-only since 2020 and never generally released**. A category page cannot be built on two products with no buy button. |
| **2. Roaming pet cameras & sentry monitors** | **Keep — and it is the whole business** | The only real consumer commerce SERP in the space. But it is a *pet and family* product, not a security product, and naming it security throws away the term that actually converts. |
| **3. Robot dogs & bipedals** | **Refuse** | `robot dog` returns RobotShop, Unitree and **Amazon's toy robot dogs for kids**. Developer platforms at $1,600+ on one side, £30 toys on the other, home security on neither. `robot guard dog for home security` is one vendor and a local news story. |
| **4. Kids' security toys** | **Refuse** | Toys. BotPlanet compares robots that do a household job; a foam-disc-firing alarm clock is a different site. |
| **5. DIY components** | **Refuse** | LiDAR modules and Raspberry Pis are components, not robots — a different audience, a different intent, and nothing BotMatch could ever recommend. |

Four of five sections refused. That is not tidying — it is the SERP evidence
saying this section was scoped from what exists on Amazon rather than from what
anyone searches for.

---

## 4. Recommended structure

### Do NOT build sub-section pages. Build one page, and name it for the demand.

The question was whether "security robots" should be split into sub-pages
because it is a blanket term. The answer the SERPs give is the opposite
problem: **there is not enough demand to fill one page, let alone five.**
Splitting a category with no traffic into five URLs with a fifth of no traffic
each is the cannibalisation rule applied to a corpse.

**Proposed: one category page, reframed.**

| | Proposal |
|---|---|
| **URL** | `/robots/home-monitoring-robots/` *(pending volume — see §5)* |
| **What it is** | Indoor camera robots that drive around the house: check on pets, check on elderly relatives, check the back door. |
| **Commercial engine** | The pet-camera cluster, which is where the searches and the retailers are. |
| **Security framing** | A *section* of the page, not the name of it. "Can it replace a security camera?" is a section, and honestly the answer is mostly no — which the page should say. |
| **Real products** | Enabot EBO Air / SE / X / ROLA, Moorebot Scout, and the generic wheeled pet cams already ranking on Amazon. All buyable today, unlike Astro. |

**Plus one guide, and it has genuine demand of its own:**

`are home security robots worth it` returned HowToGeek, SafeHome, BestReviews,
TechTimes and two others — real publishers competing properly. The
*informational* query works even though the commercial one does not. That is a
guide at `/guides/are-home-security-robots-worth-it/`, and its honest answer —
"a supplement to fixed cameras, not a replacement" — is exactly the kind of
thing BotPlanet is supposed to say.

### Explicitly refused, with the evidence

| Refused | Why |
|---|---|
| `/robots/security-robots/` as the hub | The head term is a B2B/academic SERP. We would be competing with Knightscope and arXiv for a query no homeowner types with a wallet open. |
| A robot-dog sub-page | Split between $1,600 developer platforms and children's toys. Neither is home security. |
| A security-drone sub-page | The only consumer product is the Ring Always Home Cam, which cannot be bought. |
| A DIY-components sub-page | Not robots. Different audience entirely. |
| `moving security camera` as a target | Returns Reolink, eufy, Best Buy — **PTZ auto-tracking cameras**. Swallowed whole by the camera market. Not a robot term. |
| A separate best-of page | Same one-URL rule as every other category. |

---

## 5. What the paid run still has to settle

Nothing above should be built on until these come back, because SERP shape tells
you what a query *is* and not how many people ask it.

1. **Does `pet camera robot` have enough volume to carry a category?** If it is
   a few hundred a month, this section may not be worth building at all yet —
   and saying so is cheaper than building it.
2. **Volume on `home monitoring robot` versus `pet camera robot` versus
   `security robot`.** This decides the URL and the H1. The seed file prices all
   three.
3. **Does the pet-camera cluster belong in the planned companion-robots
   category instead?** These are the same machines. If companion is coming
   anyway, this may be one category rather than two — and that is a one-URL
   ruling worth making before either is built, not after.
4. **KD across the cluster.** The SERPs look weak, which usually means low
   difficulty, but "weak" and "low KD" are not the same measurement.

`docs/seo/seeds/security-robots.json` is written to answer all four. It prices
123 terms, pulls related keywords for 13 leads, and buys 22 live SERPs including
`home security camera` as the control that made this document possible.
