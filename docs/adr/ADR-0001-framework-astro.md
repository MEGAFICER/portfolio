# ADR-0001 — Astro as the site framework

- **Status:** Accepted
- **Date:** 2026-11-23
- **Deciders:** Khang Nguyen Tran, project maintainers
- **Related:** ADR-0002, ADR-0005, PRD-001

## Context

The site is a mostly-static portfolio: one long page, no personalisation, no server data, no authentication. It must be fast on mobile, indexable, accessible and deployable to GitHub Pages as plain files. The owner asked for Astro explicitly.

## Decision

Use **Astro 7** with `output: 'static'`, TypeScript strict, and the official sitemap integration. Ship zero JavaScript by default; the only client-side code is the theme resolver, the theme toggle and the resume-filename stamp.

## Alternatives considered

1. **Plain HTML/CSS hand-written files.** Simplest possible output, but no component model, no typed content validation, no build-time asset pipeline, and duplication across sections becomes unmanageable.
2. **Next.js static export.** Solves the same problem but ships a React runtime and a heavier build for a page that has no interactive UI. Also adds a server-shaped mental model for a site with no server.
3. **Eleventy.** Excellent static output and speed, but weaker TypeScript/component story and no scoped-style ergonomics; the ecosystem for typed content is thinner.

## Consequences

**Positive**

- Static HTML with per-component scoped CSS; no hydration cost.
- Built-in TypeScript, Vite pipeline and image/font asset handling.
- `@astrojs/sitemap` handles the sitemap; `base` handles project-site paths.
- Trivial GitHub Pages compatibility (a folder of files).

**Negative / risks**

- Framework upgrade churn (Astro majors move fast). Mitigated by pinning a major and keeping framework usage to defaults.
- The `.astro` component syntax is another thing for the owner to learn; mitigated by keeping components thin and content in JSON.

## Notes

`astro preview` in Astro 7 daemonises and exits, which breaks process-managed test servers; the project uses `scripts/serve-dist.mjs` instead (see ADR-0009).
