# ADR-0005 — URL strategy: project site under `/portfolio/`

- **Status:** Accepted
- **Date:** 2026-11-23
- **Deciders:** Khang Nguyen Tran, project maintainers
- **Related:** ADR-0004, PRD-007, PRD-011

## Context

GitHub Pages has two URL shapes:

- **User site** — repository named `<user>.github.io`, served at `https://<user>.github.io/`.
- **Project site** — any other repository, served at `https://<user>.github.io/<repo>/`.

The repository is `MEGAFICER/portfolio`, so the site is a project site at `https://megaficer.github.io/portfolio/`. Every absolute path in the build must therefore include `/portfolio`, or assets 404 in production while working locally — the classic Pages failure.

## Decision

Configure `site: 'https://megaficer.github.io'` and `base: '/portfolio'` in `astro.config.mjs` as the **only** place the deployment target is declared. All internal URLs go through the tested `withBase()` helper or `import.meta.env.BASE_URL`. Canonical URLs and the OG image URL are built by `buildPageMeta()` with the base included.

## Alternatives considered

1. **Custom domain (e.g. `khangtran.dev`).** Cleaner URL, better long-term identity, and it hides the GitHub handle. Rejected for now because it requires a purchase, DNS records and a `CNAME` file, and the site has no traffic to preserve yet. Switching later is a three-line change (`SITE`, `BASE`, `CNAME`).
2. **Rename the repo to `megaficer.github.io`.** Gives a root-served site, but consumes the account's single user-site slot and makes the repo name carry deployment semantics — a poor fit while Khang still owns other projects.
3. **Relative asset paths only (`./assets/...`).** Avoids the base problem but breaks deep-link canonical URLs and the sitemap, and makes the 404 page fragile.

## Consequences

**Positive**

- One switch point for the deployment target; tests assert the join logic.
- Trailingslash canonicalisation is explicit: `/portfolio/` is canonical, `/portfolio` redirects.
- Moving to a custom domain later does not touch components.

**Negative / risks**

- Local dev and preview also run under `/portfolio/`, which surprises contributors. The README documents it, and `npm run serve` serves `dist/` at the same path.
- The sitemap can double-list `/portfolio` and `/portfolio/` when `trailingSlash: 'ignore'`; filtered in `astro.config.mjs`.
- Any hard-coded `/`-rooted URL bypasses the helper. Enforced by review and by the e2e tests running against the built site under the base path.
