# Architecture (foundation)

The authoritative decisions live in the Notion blueprint. This is a short pointer + what this repo contains today.

## Locked decisions (Notion: "Architecture Review 02" + amendments)
- **Frontend (not in this PR):** Astro on Cloudflare Workers + Static Assets; islands only for BotMatch / filters / compare.
- **Storage:** D1 (structured/operational) · MDX in-repo (editorial) · R2 (media).
- **Market model:** products global; offers/prices/stock/shipping/affiliate/disclosures market-specific. US at root domain; `/ca`, `/uk`, `/au` prefixed. Manual, persistent market switcher; geo-detection suggests but never force-redirects.
- **Email:** Resend (provisional). No affiliate links in recommendation emails — they link to the on-site result page.
- **Launch category:** robotic pool cleaners (US), scored 91/100.

## What this PR contains
- `packages/shared` — market/locale/currency config, product classes, provenance types.
- `packages/db` — market-aware Drizzle schema, migrations (generated), provisional pool seed.
- `packages/scoring` — deterministic, commission-isolated BotMatch engine + tests.
- `docs/` — this file, data model, seed provenance, scoring.

## What this PR deliberately does NOT contain
- No Astro app / no frontend.
- No Cloudflare resources and no `wrangler.toml` bindings — created only after the **dedicated BotPlanet Cloudflare account + `botplanet.io` zone** are confirmed.
- No secrets. `.env.example` documents variable names only.

## Next steps after review
1. Approve the 10th product (Dolphin E10) or pick the runner-up.
2. Confirm Cloudflare account + zone → wire D1/R2/KV bindings.
3. Scaffold the Astro app + `/go` redirect worker + BotMatch UI over this foundation.
