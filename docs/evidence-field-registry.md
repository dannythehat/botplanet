# Evidence field registry

**Status:** Job 8 (product data ingestion and evidence model)
**Verification pass:** 2026-07-31
**Source of truth:** `apps/web/src/content/evidence/field-registry.ts` — this document explains it; the file governs.

---

## 1. Why a registry exists

A completeness percentage means nothing without a written-down denominator. The first Job 8 pass counted only the
eleven fields the editorial records happened to hold, which flattered the score by excluding everything nobody had
researched. The registry fixes the denominator in advance: **31 fields**, whether or not any product currently has a
value for one.

Two figures are reported, and they are deliberately different:

| Figure | Numerator | Denominator |
| --- | --- | --- |
| **Raw completeness** | fields with a publishable value | fields that apply to this product |
| **Weighted completeness** | weight of those fields | weight of applicable fields |

The raw figure keeps the weighted one honest. The weighted figure catches the case the raw one hides: a product that
looks 70% complete while missing warranty, pool size and power type — the three things a buyer decides on.

## 2. Weights

Weights run 1–5 and affect **only** the weighted completeness figure. They never influence whether a value may be
published.

| Weight | Meaning | Examples |
| --- | --- | --- |
| 5 | Cannot ship a product page without it | brand, canonical name, model number, official page, power type, runtime, pool types, pool size, surfaces cleaned, warranty |
| 4 | Materially changes a buying decision | manual URL, cable length, filtration, navigation, weight, app support |
| 3 | Useful, comparable, not decisive | battery capacity, charge time, surface types, micron rating, cleaning modes, Wi-Fi |
| 2 | Detail | manual document ID, manual revision, operating depths, filter capacity, suction rate, dimensions, in the box, remote control |

Total registry weight: **110**.

## 3. Applicability

Some fields cannot apply to some products, and counting them as missing would be a lie about coverage.

| Rule | Effect |
| --- | --- |
| `always` | Always counted. |
| `corded_only` | Removed from the denominator when the product is cordless (e.g. cable length). |
| `cordless_only` | Removed from the denominator when the product is mains-powered (e.g. battery capacity, charge time). |
| `connected_only` | Removed when the product has no app or Wi-Fi. |

`powerType` is resolved first. While it is unknown, power-dependent fields stay **applicable**, so the gap stays
visible rather than being quietly excused.

## 4. Field states

Seven states, not a nullable value. "We never looked", "the manufacturer does not publish it" and "two sources
disagree so we are withholding it" are three different facts with three different consequences.

| State | Meaning | Publishable |
| --- | --- | --- |
| `populated` | A named source states it, read on a known date, uncontradicted. | **Yes** |
| `not_publicly_stated` | Official sources were checked; none publishes it. The sources checked are recorded. | No |
| `suppressed` | We held a value and are withholding it because no checked source supports it. | No |
| `conflicting` | Sources disagree and authority cannot settle it. | No |
| `not_applicable` | The field cannot exist for this product. Excluded from both denominators. | No |
| `pending_verification` | A value exists but has not been re-checked against its source. | No |
| `unknown` | No value and nobody looked. **Must be zero after a verification pass.** | No |

## 5. Refresh cadence

| Cadence | Days before stale | Applies to |
| --- | --- | --- |
| `monthly` | 31 | — (reserved for commercial data, which is not in this model) |
| `quarterly` | 92 | warranty, app support, Wi-Fi, official page |
| `six_monthly` | 183 | runtime, charge time, cable length, battery, pool size, pool types, filtration, navigation, surfaces, modes |
| `annual` | 366 | identity, dimensions, weight, depths, capacities, suction, surface types, accessories |

A field is **current** only when `verifiedDate` is set and falls inside its own cadence. A recent value that has never
been re-checked is not current, however recently it was first written down.

## 6. Source hierarchy and conflict resolution

1. `manufacturer_document` — manual, spec sheet, support document
2. `manufacturer_page` — official product page
3. `retailer_api` — approved retailer/affiliate API
4. `retailer_listing` — attributable retailer listing
5. `editorial_research` — independent research, labelled as such

An unrecognised host falls to tier 5 and is flagged, never silently promoted.

Where two sources disagree, the higher tier wins and the rule is recorded on the conflict entry. Where they are of
**equal** rank — or where the winning source's own figure is not credible — nothing is published and the field enters
`conflicting`. Two different *wordings* of the same fact are not a conflict: the comparison is on the leading
quantity-and-unit token where both strings have one.

## 7. The 31 fields

### identity
| Field | Weight | Cadence | Definition |
| --- | --- | --- | --- |
| `brand` | 5 | annual | Manufacturer as it appears on the official product page. |
| `canonicalName` | 5 | annual | The exact model name the manufacturer uses, including suffixes that distinguish near-identical models. |
| `modelNumber` | 5 | annual | Manufacturer part number or SKU. This is what separates a Betta SE from a Betta SE Plus. |
| `officialProductPageUrl` | 5 | quarterly | The manufacturer's own page for this exact model — not a dealer, not a near model. |
| `manualUrl` | 4 | annual | URL of the manufacturer's manual for this model. |
| `manualDocumentId` | 2 | annual | Printed document/part number of the manual, so a revision can be detected. |
| `manualRevisionDate` | 2 | annual | Revision marker or copyright year printed on the manual. |

### power_operation
| Field | Weight | Applicability | Definition |
| --- | --- | --- | --- |
| `powerType` | 5 | always | Corded or cordless. Drives every other applicability rule. |
| `cableLengthFt` | 4 | corded only | Floating cable length, which caps the pool size a corded unit can reach. |
| `batteryCapacity` | 3 | cordless only | Stated cell capacity, verbatim with its unit. |
| `runtimeMins` | 5 | always | Longest stated cleaning cycle in the default full-coverage mode. |
| `chargeTimeHrs` | 3 | cordless only | Stated time to a full charge from empty. |

### pool_suitability
| Field | Weight | Definition |
| --- | --- | --- |
| `poolTypes` | 5 | Above-ground, in-ground, or both, as stated by the manufacturer. |
| `poolSizeSuitability` | 5 | Stated maximum pool length or area. **Never inferred from cable length or operating depth.** |
| `maxDepthFt` | 2 | Deepest water the unit is rated for. |
| `minDepthFt` | 2 | Shallowest water the unit is rated for. |
| `surfaceTypes` | 3 | Liner/finish types stated as suitable. |

### cleaning_coverage
| Field | Weight | Definition |
| --- | --- | --- |
| `surfacesCleaned` | 5 | Which of floor, walls and waterline the manufacturer states it cleans. |
| `filtration` | 4 | Filter media/basket description, in the manufacturer's wording. |
| `filtrationMicrons` | 3 | Finest micron rating stated for any filter supplied in the box. |
| `filterCapacityL` | 2 | Stated volume of the debris basket or canister. |
| `navigation` | 4 | Named navigation/path-planning system, verbatim. |
| `suctionRate` | 2 | Stated flow rate with its unit. **Units are not converted across brands.** |
| `cleaningModes` | 3 | Named cleaning modes the manufacturer lists. |

### physical
| Field | Weight | Definition |
| --- | --- | --- |
| `weightLbs` | 4 | Weight of the cleaner itself, dry, excluding caddy and packaging. |
| `dimensions` | 2 | Stated W×D×H of the cleaner. **Package dimensions are never substituted.** |
| `includedAccessories` | 2 | Items stated as supplied with the unit. |

### connectivity
| Field | Weight | Definition |
| --- | --- | --- |
| `appSupport` | 4 | Named app and what it controls, or an explicit statement that there is no app. |
| `wifi` | 3 | Whether the unit itself connects to Wi-Fi, as distinct from Bluetooth or a remote. |
| `remoteControl` | 2 | Whether a physical remote handset is supplied. |

### warranty_support
| Field | Weight | Definition |
| --- | --- | --- |
| `warranty` | 5 | Warranty term and type exactly as stated for the US market. |

## 8. Rules that are enforced by tests, not by convention

- A field may be `publishable` only in state `populated`, and only with at least one evidence record behind it.
- Evidence IDs are deterministic: two ledger builds produce identical IDs, so a claim generated in one process
  references the same evidence in another.
- Every observation carries a date, a source URL and a source title.
- Before a field may be called "not publicly stated", the list of sources actually checked is recorded.
- A range is never reduced to a number the source did not print (`3-4 Hours` normalises to nothing).
- Package dimensions, power-supply placement distances and operating depths are never promoted into unit dimensions,
  cable lengths or pool sizes.
- No claim asserts hands-on testing, ranks products against each other, or mentions price, stock or commission.
- Warranty claims are barred from structured data and page metadata, because warranty terms change without notice.

## 9. Publication states

One boolean cannot express readiness. Seven are reported per product:

| State | Condition |
| --- | --- |
| `structurallyValid` | No error-severity validation issues. |
| `factuallyEvidenced` | Every published field traces to a source. |
| `currentlyVerified` | Every published field was re-checked inside its cadence. |
| `safeForLimitedFactualUse` | All three of the above. Individual attributed facts may appear. |
| `readyForReviewWriting` | The above, plus **all six review gates** below. |
| `readyForComparison` | The above, plus every comparison field available. |
| `readyForBotMatch` | The above, plus every field BotMatch filters on available. |

### The six review-writing gates

A percentage alone never makes a product ready. All six must pass:

| Gate | Passes when |
| --- | --- |
| `weighted_completeness` | Weighted completeness is at least **65%**. |
| `model_identity` | Brand, canonical name and an accepted official manufacturer page are all publishable. |
| `no_material_conflict` | No unresolved conflict on power type, pool types, pool size, surfaces cleaned, runtime or warranty. |
| `review_sections_writable` | Every intended review section has the fields it needs. |
| `no_speculation` | No review section rests on a suppressed value. |
| `corrections_identified` | Every unsupported or conflicting stored value carries a written correction. |

Review sections and what each one needs: **What it is** (brand, canonical name, power type) · **Where it fits**
(pool types, pool size) · **What it cleans** (surfaces, navigation, filtration) · **How it runs** (runtime) ·
**Living with it** (weight).

### Launch status

An explicit typed state, because "not ready" covers two different situations.

| Status | Meaning |
| --- | --- |
| `launch_ready` | Identified, evidenced and complete enough to write a review around. |
| `limited_factual_use` | Identified and safe to state individual facts from, but not to review or compare. |
| `candidate_under_review` | Identity or evidence is too weak to treat as a settled launch product — no accepted manufacturer page, or an unresolved conflict on a material review field. |

## 10. Canonical product URLs

There is exactly one place where a product URL's shape is decided: `productPath()` in
`apps/web/src/content/routes.ts`, which delegates to the central category route helpers. The sitemap and the Notion
register export both call it. A second hand-written pattern is how ten obsolete `/pool-cleaners/<slug>/` URLs reached
the SEO register, and tests now assert that every mapped URL matches the registry, resolves to a stable product ID,
and points at no redirect source.

Canonical shape: `https://botplanet.io/robots/robotic-pool-cleaners/<slug>/`

## 11. Warranty wording

Where no official manufacturer term is verified, the single approved public sentence is:

> Manufacturer warranty term not confirmed

Held once in `apps/web/src/lib/warranty.ts`. A term is "confirmed" only when the manufacturer's own page or manual
states it — a dealer's warranty offer is a fact about that dealer and is never promoted to the product's canonical
warranty, never enters a comparison row, and never becomes a claim. These phrasings are forbidden anywhere on a
public surface and are enforced by a validation rule: "no warranty", "warranty unavailable", "does not offer a
warranty", "without a warranty", "warranty: none".
