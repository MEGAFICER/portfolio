# ADR-0004 — GitHub Pages deployment through official Actions with OIDC

- **Status:** Accepted
- **Date:** 2026-11-23
- **Deciders:** Khang Nguyen Tran, project maintainers
- **Related:** ADR-0005, PRD-011

## Context

The repository lives under Khang's account (`MEGAFICER/portfolio`). A push to `main` must publish the site. Options range from committing `dist/` (bad) to using a personal access token (worse) to using GitHub's first-party Pages pipeline.

The build now includes generated artifacts (resume PDF, OG image, touch icon) that require a headless browser, so deployment must run a real build job, not just upload a folder.

## Decision

Use **GitHub Actions** with the official Pages actions:

- `actions/configure-pages`
- `actions/upload-pages-artifact` (uploads `dist/`)
- `actions/deploy-pages`

Authenticate with OIDC (`id-token: write`) and `pages: write`, driven by a `github-pages` environment. Deploy only from `main`, with `concurrency: pages` and `cancel-in-progress: false` so an in-flight deploy is never torn apart.

## Alternatives considered

1. **`gh-pages` branch with a publish action.** Works, but stores build output in git history, needs a token with write scope, and makes "what is deployed" a second source of truth.
2. **Personal access token stored as a secret.** A long-lived credential in a student project is an avoidable liability; OIDC tokens are short-lived and scoped per run.
3. **Cloudflare Pages / Netlify.** Simpler previews and no Pages enablement step, but the owner asked for GitHub Pages and the repo already lives there. Revisit only if Pages proves unavailable.

## Consequences

**Positive**

- No stored long-lived secrets; permissions are declared per workflow.
- Deployed artifact is exactly the CI build output.
- Rollback is a re-run of an earlier workflow.

**Negative / risks**

- **Owner action required:** Pages must be enabled with "GitHub Actions" as the source (Settings → Pages). Until then, `deploy-pages` fails. Tracked as issue #1.
- Private repositories require a paid plan for Pages; the repo is public, so this does not apply.
- Builds need Chromium in CI (~1 min overhead) because the resume PDF is a build artifact.
