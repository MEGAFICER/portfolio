# PRD-011 — CI/CD and deployment

- **Status:** Implemented (deployment awaits the owner enabling Pages — issue #1)
- **Owner:** Khang Nguyen Tran
- **Last updated:** 2026-11-23
- **Verification:** `.github/workflows/ci.yml`, `.github/workflows/deploy.yml`

## Purpose

A push to `main` publishes the site. A pull request proves the site before it can be merged. Nothing about publishing should require a laptop.

## Requirements

| ID       | Requirement                                                                                                | Priority |
| -------- | ---------------------------------------------------------------------------------------------------------- | -------- |
| FR-11.1  | Every push to `main` builds and deploys to GitHub Pages automatically.                                     | Must     |
| FR-11.2  | Deployment uses GitHub's official Pages actions with OIDC, not a personal access token.                    | Must     |
| FR-11.3  | Only one deployment runs at a time; an in-flight deployment is not cancelled.                              | Must     |
| FR-11.4  | Pull requests run lint, format, type check, unit tests, build, e2e and axe.                                | Must     |
| FR-11.5  | The deploy job uploads exactly `dist/`; generated assets (PDF, OG image, icons) are part of it.            | Must     |
| FR-11.6  | The workflow runs on Node 24 with npm caching.                                                             | Must     |
| FR-11.7  | Chromium is installed in CI because the resume PDF and OG image are build artifacts.                       | Must     |
| FR-11.8  | Failed e2e runs upload the Playwright report for debugging.                                                | Must     |
| FR-11.9  | `main` is protected: CI must pass before merge (owner action, issue #7).                                   | Should   |
| FR-11.10 | The site URL is `https://megaficer.github.io/portfolio/`; changing it requires editing `SITE`/`BASE` only. | Must     |

## Pipeline

```
pull_request ──► ci.yml
                  ├─ npm ci
                  ├─ playwright install chromium
                  ├─ lint → format:check → astro check → vitest --coverage
                  ├─ build (assets + astro)
                  ├─ playwright test (3 projects)
                  └─ lighthouse (dist artifact)

push main ────► deploy.yml
                  ├─ npm ci → chromium → build
                  ├─ configure-pages
                  ├─ upload-pages-artifact (dist)
                  └─ deploy-pages  →  https://megaficer.github.io/portfolio/
```

## Acceptance criteria

1. Pushing a commit to `main` produces a successful `Deploy to GitHub Pages` run and the live site updates.
2. A pull request with a lint error, failing test or axe violation cannot merge.
3. A deploy never publishes a `dist/` missing the resume PDF or OG image.
4. Re-running a failed deploy is safe and idempotent.

## Out of scope

- Preview deployments per PR, staging environment, CDN invalidation, self-hosted runners.

## Related

ADR-0004, ADR-0005. PRD-010, PRD-012.
