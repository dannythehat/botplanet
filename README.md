# BotPlanet

Global shopping & recommendation platform for real-world robots. **United States is the primary launch market**; the data model is market-aware from day one.

> **Status: repository foundation only.** This PR contains the data model, migrations, a *provisional* pool-category seed draft, and the deterministic BotMatch scoring package. **There is no frontend yet, and no production infrastructure is created.** Framework wiring and deployment are gated on the dedicated BotPlanet Cloudflare account + `botplanet.io` zone being confirmed.

## Locked architecture (see Notion blueprint)

- **Frontend (later):** Astro on Cloudflare Workers + Static Assets; islands only for BotMatch / filters / compare.
- **Data:** D1 (structured/operational) · MDX in-repo (editorial) · R2 (media). Products are **global**; offers, prices, stock, shipping, affiliate programmes and disclosures are **market-specific**.
- **BotMatch:** deterministic, versioned, auditable scoring. **Product suitability is scored before, and independently of, any commission.** Commission may only act as a final tolerance-bounded tie-break between otherwise-equivalent *offers* — never in product selection.
- **Launch category:** robotic pool cleaners (US).

## Monorepo layout

```
packages/
  shared/    market/locale/currency config, product classes, shared domain types
  db/        Drizzle schema (market-aware), SQL migrations, pool seed draft
  scoring/   deterministic BotMatch engine: product suitability + offer ranking (commission-isolated)
docs/        data model, seed provenance, scoring, affiliate hub, deferred requirements
```

## Commands

```bash
npm install
npm run typecheck      # tsc project references
npm test               # vitest — includes commission-isolation proofs
npm run db:generate    # drizzle-kit generate (regenerate SQL from schema)
```

## Guardrails honoured in the seed

- Prices are **research snapshots** (dated), not live truth.
- Unconfirmed affiliate details (commission, cookie) are **nullable / provisional**.
- **No manufacturer image URLs** are added until rights are confirmed.
- **No credentials or private affiliate tracking parameters** in any seed file.
- Products and offers are **separate records**.
- Betta is typed as a **`surface_skimmer`** product class, not a full cleaner.
- All **10 launch products confirmed** (Dolphin E10 approved as the above-ground pick); price/affiliate/image fields stay provisional until verified.
- **Affiliate Hub + attribution** schema (`0001_affiliate_hub`) stores only safe metadata + `secret_ref` — never secrets.
