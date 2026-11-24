# PRD-010 — Testing and quality gates

- **Status:** Implemented
- **Owner:** Khang Nguyen Tran
- **Last updated:** 2026-11-23
- **Verification:** `npm run test:coverage`, `npx playwright test`, CI job `verify`

## Purpose

"Unit tests for everything" is only useful if the tests can fail for the right reasons. This PRD defines the layers, what each layer is responsible for, and the thresholds that block a merge.

## Layers

| Layer           | Tool                                                     | Scope                                                                                                        | Blocks      |
| --------------- | -------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ | ----------- |
| Unit            | Vitest + `@vitest/coverage-v8`                           | Pure logic: theme resolution, filename stamping, URL joining, SEO metadata, content schemas, colour contrast | commit + PR |
| Integration-ish | Vitest (schema + data)                                   | Every JSON content file parsed against Zod; anonymisation and fact assertions                                | commit + PR |
| End-to-end      | Playwright (Chromium desktop dark/light, Pixel 7)        | Navigation, theme cycling and persistence, download filename, 404, metadata, JSON-LD                         | PR          |
| Accessibility   | `@axe-core/playwright`                                   | WCAG 2.0/2.1/2.2 A + AA, both themes, every project                                                          | PR          |
| Performance     | Lighthouse CI                                            | Budgets in PRD-006                                                                                           | PR          |
| Build           | `astro build`                                            | Type/diagnostic errors, broken imports, missing assets                                                       | commit + PR |
| Static analysis | ESLint (incl. Astro a11y rules), Prettier, `astro check` | Lint, format, types                                                                                          | commit + PR |

## Coverage policy

- Enforced thresholds for `src/lib/**` and the data layer: 90 % statements, 90 % functions, 90 % lines, 85 % branches.
- `.astro` components are not unit-tested by rendering; they are covered by e2e and axe. Rendering them in isolation would duplicate the browser tests at higher maintenance cost.
- Every bug fixed in the site logic gets a regression test at the lowest layer that can catch it.

## Requirements

| ID      | Requirement                                                                                      | Priority |
| ------- | ------------------------------------------------------------------------------------------------ | -------- |
| FR-10.1 | The full unit suite runs on every commit via Husky.                                              | Must     |
| FR-10.2 | Lint, format check, type check, unit tests and e2e run on every pull request.                    | Must     |
| FR-10.3 | Coverage thresholds fail the build when not met.                                                 | Must     |
| FR-10.4 | Axe violations fail the pipeline; the report is uploaded as an artifact.                         | Must     |
| FR-10.5 | Tests are deterministic: fixed dates injected, no reliance on wall-clock time or network.        | Must     |
| FR-10.6 | E2E runs against the production build served under the real base path (`/portfolio/`).           | Must     |
| FR-10.7 | A failing test is never skipped silently; skips must state a reason (e.g. mobile keyboard path). | Must     |

## Acceptance criteria

1. `npm run test:coverage` passes with thresholds met.
2. `npx playwright test` passes across all three projects.
3. A deliberate colour-token change that breaks AA fails `tests/unit/contrast.test.ts`.
4. A deliberate client name added to a case study fails `tests/unit/content.test.ts`.
5. Removing the `download` timestamp logic fails the e2e download test.

## Out of scope

- Visual regression snapshots, cross-browser WebKit/Firefox runs (Chromium is the delivery target; WebKit coverage can be added if a bug appears).

## Related

ADR-0009, ADR-0012. PRD-005, PRD-006, PRD-011.
