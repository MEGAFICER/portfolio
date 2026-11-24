# ADR-0003 — Content as validated JSON, rendered three ways

- **Status:** Accepted
- **Date:** 2026-11-23
- **Deciders:** Khang Nguyen Tran, project maintainers
- **Related:** ADR-0010, PRD-001, PRD-009

## Context

The same facts appear in three places: the web page, the downloadable resume PDF, and the `schema.org` JSON-LD. Hand-maintaining three copies guarantees drift — the exact failure mode where a PDF says "March 2023 – July 2026" and the page says "2023 – present".

The owner is not a web developer; content edits must be obvious and safe.

## Decision

Store all content in `src/data/*.json`, one file per domain (profile, experience, case studies, engagements, skills, education, leadership). Validate every file with a Zod schema in `src/data/schema.ts` at import time. Export typed objects from `src/data/index.ts`. The page, the PDF generator and the JSON-LD all read from those exports; the PDF generator reads the same JSON files directly because it runs in Node.

## Alternatives considered

1. **TypeScript modules (`profile.ts`).** Better autocomplete, but the PDF generator would need a TS runtime (`tsx`/`vite-node`), adding a build dependency; and JSON is friendlier for a non-developer editing dates.
2. **Markdown/MDX content collections.** Good for long-form prose, wrong for structured facts with required fields; schema enforcement is stronger with Zod over JSON.
3. **A headless CMS.** Solves editing for non-technical authors, but adds an account, an API, a build-time fetch and a failure mode for a single-author site that deploys from git.

## Consequences

**Positive**

- One edit updates page, PDF and structured data.
- A malformed file fails the build with a precise message, instead of rendering `undefined`.
- Content diffs are readable in git review.

**Negative / risks**

- JSON has no comments; field intent is documented in `schema.ts` and `docs/content-inventory.md`.
- Long prose inside JSON needs `\n` discipline; sections that are pure copy (About principles) live in components instead, which is a deliberate split: facts in data, rhetoric in markup.
- The PDF template must be kept in step with new schema fields; a new required field fails the generator loudly (acceptable).
