# Growth baseline — 11 August 2026

**Why this file exists.** An external growth service is about to be pointed at
this site. Without a dated before-picture, "is it working?" becomes an argument
about impressions rather than a comparison of numbers. Everything below was
measured on 11 August 2026, and every figure says where it came from and what
it does not prove.

Read the caveats. Several of these numbers look better or worse than they are.

---

## The one-line summary

The site is technically sound, commercially wired, and almost entirely
unknown to Google. Its indexed presence belongs to a **previous site on the
same domain**. Two external links point at it. Nothing has ever been sold.

---

## 1. Google Search Console

Snapshot taken 11 August 2026. GSC's own "last update" read **7 August 2026**,
so these lag reality by a few days and predate the redirects shipped today.

| | Pages |
|---|---|
| Indexed | **62** |
| Not indexed | **45** |

### Why the 45 are not indexed

| Reason | Pages | Source |
|---|---|---|
| Discovered – currently not indexed | **27** | Google systems |
| Crawled – currently not indexed | 12 | Google systems |
| Not found (404) | 4 | Website |
| Page with redirect | 1 | Website |
| Alternate page with proper canonical tag | 1 | Website |

### The finding that matters

**The 62 indexed pages are the OLD site.** Sampled: `/gifts`, `/quiz`,
`/contact`, `/product/miko-mini-ai-robot`, `/product/enabot-ebo-air-2-se`,
`/reviews/sphero-bolt-review-the-smartest-hamster-ball-in-the-galaxy`,
`/reviews/amazon-echo-show-10-review-the-speaker-that-follows-you-around`,
`/reviews/jjrc-r2-cady-wida-review-a-25-dance-party-in-plastic`.

None of those URL shapes exists on this site.

**The 27 "Discovered" pages are the CURRENT site, and Last crawled reads
`N/A` for every one of them.** Sampled: `/about/`, `/robots/`,
`/robots/robotic-pool-cleaners/`, `/robots/robotic-pool-cleaners/aiper-scuba-s1/`,
`/best-robots/`, `/compare/`, `/guides/`, `/review-methodology/`, `/privacy/`.

Google knows these exist, from the sitemap. It has never fetched one.

The 12 "Crawled – currently not indexed" are also old URLs, last crawled
between 24 May and 26 June 2026: `/product/ecovacs-deebot-x2-omni`,
`/product/irobot-roomba-j9-plus`, `/product/temi-v3-robot`,
`/product/husqvarna-automower-430xh`, `/product/husqvarna-automower-450x-nera`,
`/product/ecovacs-goat-a3000`, `/blog/best-robot-vacuums-small-apartments`,
`/shop?category=Kids & STEM Robots`.

---

## 2. Links

| | |
|---|---|
| **External links, total** | **2** |
| Referring domains | **1** — `tools-radar.com` |
| Anchor text | "official website", "웹사이트 방문" |
| Target | `https://botplanet.io/` (both) |

This is the ceiling on everything else in this document. A domain with two
backlinks earns very little crawl budget, which is the mechanism behind
27 pages sitting at `Last crawled: N/A`.

### Google's internal link graph is also the old site

Its most-linked pages, per GSC: `/` (70), `/terms` (69), `/categories` (68),
`/new-robots` (68), `/returns-policy` (68), `/shop` (68),
`/shop?category=cleaning-robots` (68), `/about` (67), `/privacy-policy` (67),
`/shipping-policy` (67).

Every one of those is a legacy URL. That list is a fair summary of what Google
currently believes this site is.

---

## 3. Traffic — Cloudflare edge, 29 July to 11 August 2026

Cloudflare rather than GA because it sees every request and separates crawlers
from browsers.

### Real browser families

| Browser | Page views |
|---|---|
| Chrome | 621 |
| Mobile Safari | 498 |
| Firefox | 106 |
| Chrome Mobile | 77 |
| Edge | 43 |
| Safari | 33 |
| Samsung Internet | 4 |
| Opera Mobile | 3 |
| Internet Explorer | 1 |
| **Total** | **≈1,386** |

**CAVEAT, AND IT IS A LARGE ONE.** This cannot be split into "the owner" and
"strangers". Referrer data is not available on this Cloudflare plan, so there
is no way to show that anyone arrived from a search result. Mobile Safari is
probably substantially the owner checking the site on a phone.

The honest evidence for genuine strangers is the long tail: Firefox, Edge,
Samsung Internet, Opera Mobile and one Internet Explorer. Those are not one
person's browsers.

### Crawlers

| Bot | Page views |
|---|---|
| YandexBot | 111 |
| AppleBot | 46 |
| BingBot | 34 |
| **GoogleBot** | **9** |

IndexNow is reaching the engines that accept it. Google, which does not, has
visited nine times in a fortnight.

### Excluded from the figures above

`Unknown` 15,511 and `Curl` 3,144 page views. These are overwhelmingly this
project's own audit scripts — the daily peaks line up exactly with the days
audits were run — plus scrapers. Counting them as traffic would be lying to
ourselves.

### Requests by country

US 32,693 · FR 4,213 · NL 3,047 · DE 1,504 · PL 1,424 · SE 1,342 · IT 1,209 ·
CH 1,198 · CN 1,128 · NO 1,112.

Datacentre traffic inflates NL, FR and DE.

---

## 4. Commercial

| | |
|---|---|
| Published products | 64 |
| Products with a live offer | **50** |
| Redirect links | 59 |
| Amazon Associates tag | `botplanet-20` |
| Click events recorded | 498 |
| **Real clicks** | **0** |
| **Commissions** | **0** |
| **Revenue** | **£0** |

**All 498 clicks are internal testing.** The heavy days — 105 on 8 August,
101 on 3 August, 42 on 11 August — are days every `/go/` path was walked end to
end. 42 clicks across 40 distinct products is a script, not a shopper.

---

## 5. Technical health, so a later regression is attributable

| | |
|---|---|
| Pages in sitemap | 111 |
| Server response, median | 117 ms |
| Server response, max | 181 ms |
| Eager image weight, median | 37 KB |
| Files served without responsive variants | 0 |
| `audit:links` | PASS |
| `audit:seo` | PASS — 0 warnings |
| `audit:matchers` | PASS |
| `audit:weight` | PASS |
| Test suite | 1,933 passing |

Nothing here is a bottleneck. That is the point of recording it: when traffic
eventually moves, this rules out "the site got faster" as the explanation.

---

## 6. What changed on the day this baseline was taken

Recorded because the next month's numbers will be measured against a site that
had just been altered, and pretending otherwise would make the comparison
meaningless.

- **301 redirects from every legacy URL** to its current equivalent. Until
  today, `/security-robots`, `/robot-vacuums`, `/shop`, `/quiz` and the rest
  all 404'd. This is the change most likely to move section 1.
- **The Yarbo Snow Blower got a buy button** after its Amazon listing was read
  directly. Product count with offers went 49 → 50.
- Social previews fixed on 11 pages that were showing the site logo.
- ~1 MB of oversized images removed from two hub pages; layout shift fixed on
  every review page.

---

## What to compare in a month

1. **"Discovered – currently not indexed"** — should fall as the 301s are
   crawled. This is the single most informative number in this file.
2. **Indexed pages that are CURRENT URLs** — today it is approximately zero.
3. **Referring domains** — today it is one.
4. **GoogleBot page views** — today it is 9 per fortnight.
5. **Real outbound clicks** — today it is zero.

If 1 and 3 do not move, nothing else will, and no amount of additional content
will change that. More pages on a site Google does not crawl produce more pages
Google does not crawl.
