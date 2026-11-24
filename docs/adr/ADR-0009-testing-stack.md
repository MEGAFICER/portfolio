# ADR-0009 — Testing stack and layer responsibilities

- **Status:** Accepted
- **Date:** 2026-11-23
- **Deciders:** Khang Nguyen Tran, project maintainers
- **Related:** PRD-010, PRD-005, PRD-011

## Context

The owner asked for "unit tests for everything" and for those tests to gate commits and CI. Taken literally, unit-testing `.astro` markup means rendering components in isolation, which duplicates what a real browser already proves and becomes brittle as copy changes. The useful question is: which layer can catch which class of defect?

## Decision

Four layers, each with a clear job:

1. **Vitest** for pure logic — theme resolution, date/filename stamping, base-path joining, SEO metadata, JSON-LD shape, content schemas, and _colour contrast parsed from the real tokens file_. Coverage thresholds: 90 % statements/functions/lines, 85 % branches on `src/lib` and the data layer.
2. **Playwright** against the production build served under `/portfolio/` — navigation, skip link, theme cycle and persistence, download filename, 404, metadata, responsive width.
3. **`@axe-core/playwright`** — WCAG 2.0/2.1/2.2 A+AA in both themes, in desktop and mobile projects.
4. **Lighthouse CI** — performance/a11y/SEO budgets, run against the built `dist/`.

A tiny static server (`scripts/serve-dist.mjs`) serves the build, because Astro 7's `astro preview` daemonises and exits, breaking process-managed test servers.

## Alternatives considered

1. **Astro Container API to render `.astro` components in Vitest.** Possible, but asserts on markup that axe and Playwright already validate against the real page, including CSS. Higher maintenance, lower signal.
2. **Jest + `@testing-library/react`.** Wrong runtime for a component model that has no React.
3. **Cypress instead of Playwright.** Comparable, but Playwright's multi-project config, built-in `request` fixture and axe integration made the a11y gate simpler.
4. **Visual regression (Percy/Chromatic).** Useful for a design system, premature for one page maintained by one person.

## Consequences

**Positive**

- Fast feedback: 109 unit tests in under a second; the full commit gate stays under ~10 s.
- Failures point at a real cause: a broken contrast token fails the contrast test with the ratio printed, not a screenshot diff.
- Content regression net: anonymisation and fact requirements are tests, not review checklists.

**Negative / risks**

- The e2e suite is slow (~6 min across three projects) and is therefore CI-only, not pre-commit.
- Playwright adds a ~150 MB browser download per CI run; cached poorly on hosted runners.
- Unit coverage is intentionally limited to logic; a broken layout is caught by axe/lighthouse/user eyes, not by tests.
