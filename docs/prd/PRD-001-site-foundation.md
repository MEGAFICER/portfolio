# PRD-001 — Site foundation and content architecture

- **Status:** Implemented
- **Owner:** Khang Nguyen Tran
- **Last updated:** 2026-11-23
- **Verification:** `npm run build`, `tests/unit/content.test.ts`, `tests/e2e/home.spec.ts`

## Purpose

Define what the site is, how its content is stored, and why the content is stored that way. Every other PRD assumes this foundation.

## Context

The portfolio is a single static site for one person, deployed to GitHub Pages. There is no CMS, no database and no server runtime. Content changes happen through git commits by the owner, so the content format has to be readable in a diff and impossible to half-break.

## Requirements

| ID     | Requirement                                                                                 | Priority |
| ------ | ------------------------------------------------------------------------------------------- | -------- |
| FR-1.1 | The site is built with Astro and outputs fully static HTML, CSS and assets.                 | Must     |
| FR-1.2 | All body copy, dates, metrics and links live in `src/data/*.json`, not inside components.   | Must     |
| FR-1.3 | Each JSON file is validated by a Zod schema at build time; invalid content fails the build. | Must     |
| FR-1.4 | The same data feeds the page, the generated resume PDF and the JSON-LD structured data.     | Must     |
| FR-1.5 | The site is one scrolling page with anchored sections and no secondary routes.              | Must     |
| FR-1.6 | A styled 404 page exists because GitHub Pages serves one automatically for unknown paths.   | Must     |
| FR-1.7 | Navigation targets are defined once in `src/lib/nav.ts` and reused by the header and tests. | Should   |
| FR-1.8 | The page works with JavaScript disabled: content, links and the resume are all reachable.   | Must     |

## Information architecture

| Order | Section         | Anchor         | In navigation |
| ----- | --------------- | -------------- | ------------- |
| 1     | Hero            | `#top`         | via brand     |
| 2     | Impact strip    | —              | no            |
| 3     | About           | `#about`       | yes           |
| 4     | Selected work   | `#work`        | yes           |
| 5     | Experience      | `#experience`  | yes           |
| 6     | Supporting work | `#engagements` | no            |
| 7     | Toolchain       | `#skills`      | yes           |
| 8     | Mentoring       | `#mentoring`   | no            |
| 9     | Education       | `#education`   | no            |
| 10    | Contact         | `#contact`     | yes           |

## Acceptance criteria

1. `npm run build` completes with no TypeScript or Astro diagnostics.
2. Deleting a required field from any JSON file fails `npm run test` with a schema error naming the field.
3. The rendered homepage contains exactly one `<h1>`, one `<main>` and every anchor listed above.
4. With JavaScript blocked, the h1, all sections and the resume link are present in the DOM.
5. No client name appears in any content file (see PRD-002 and ADR-0011).

## Out of scope

- Multiple pages, blog, RSS, CMS, comments, contact form backend.
- Internationalisation. The site is English-only; this is recorded as a non-goal, not an oversight.

## Related

ADR-0001, ADR-0002, ADR-0003, ADR-0005. PRD-002, PRD-007, PRD-009.
