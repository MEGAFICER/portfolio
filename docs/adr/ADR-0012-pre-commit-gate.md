# ADR-0012 — Pre-commit gate composition

- **Status:** Accepted
- **Date:** 2026-11-23
- **Deciders:** Khang Nguyen Tran, project maintainers
- **Related:** PRD-010, PRD-011

## Context

The owner requires linting, formatting and unit tests to run on every commit. The tension is well known: slow hooks get bypassed with `--no-verify`, and a bypassed hook protects nothing. The unit suite here runs in under a second, so the expensive part is not the tests — it is type-checking and any e2e work.

## Decision

Husky `pre-commit` runs, in order:

1. `lint-staged` — `eslint --fix` then `prettier --write` on staged `js/mjs/ts/astro`, `prettier --write` on staged `json/md/css/yml`.
2. `astro check` — full project diagnostics (not just staged files), because a type error in an unstaged import still breaks the build.
3. `vitest run` — the full unit suite.

End-to-end, a11y and Lighthouse gates run only in CI on pull requests.

## Alternatives considered

1. **Staged-file lint + tests only.** Fast, but misses cross-file breakage; `astro check` needs whole-project context anyway.
2. **Full `npm run build` in the hook.** Would catch asset-generation issues, but adds a Chromium render (~5 s) and makes the hook annoying enough to skip.
3. **No hooks; rely on CI.** Cheapest locally, but commits enter history broken and CI feedback arrives minutes later.
4. **`pre-push` instead of `pre-commit`.** Fewer interruptions, but allows broken local commits and discourages small commits.

## Consequences

**Positive**

- A commit that passes the hook is lint-clean, formatted, type-clean and unit-green.
- The hook completes in roughly five to ten seconds on this project.

**Negative / risks**

- Requires Node ≥ 24.15 (jsdom 31) and installed dependencies; a fresh clone must run `npm install` before committing, which installs husky via `prepare`.
- `astro check` is slower on large changes; if it becomes painful, move it to `pre-push` and keep tests at commit time.
- `--no-verify` is always available; CI is the backstop that makes bypassing pointless.
