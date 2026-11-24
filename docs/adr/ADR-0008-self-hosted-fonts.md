# ADR-0008 — Self-hosted variable fonts with a system fallback

- **Status:** Accepted
- **Date:** 2026-11-23
- **Deciders:** Khang Nguyen Tran, project maintainers
- **Related:** PRD-006, PRD-008

## Context

The "silicon blueprint" direction needs two voices: a neutral grotesque for reading, and a monospace for labels, metrics and dates. Options are a system font stack (zero bytes), Google Fonts (third-party request, privacy and availability risk), or self-hosted files.

Requirement FR-6.5 forbids third-party scripts; a third-party font CDN is the same category of dependency.

## Decision

Self-host two variable fonts via Fontsource packages, imported through the build so they are hashed and served from the site origin:

- `Inter Variable` — body and headings, weights 100–900.
- `JetBrains Mono Variable` — labels, metrics, metadata, weights 100–800.

Both declare `font-display: swap`, use `unicode-range` subsetting (the browser fetches only the Latin files for English content), and are followed by a full system fallback stack in the token definitions. No preload is used for the mono face; only the text face matters for first paint.

## Alternatives considered

1. **Pure system stack.** Zero network cost and no FOUT, but the design loses its identity and monospace metrics differ across platforms enough to break the "spec sheet" alignment the layout relies on.
2. **Google Fonts CDN.** Easy, but adds a third-party request, a privacy consideration, and a new failure mode (fonts blocked → fallback layout shift). Rejected under the no-third-party rule.
3. **Static single-weight webfonts.** Smaller each, but three files per family (regular/medium/bold) and worse rendering at display sizes than one variable file.

## Consequences

**Positive**

- No third-party requests; the site works offline after first load and in restricted networks.
- Variable weights give the display sizes freedom without extra files.
- Consistent metrics across platforms, which matters for the tabular numeric treatment.

**Negative / risks**

- Two font families add ~150 KB of woff2 in the build output, of which the browser typically fetches two Latin subsets (~60 KB). Acceptable against the budget, but the build ships unused Cyrillic/Greek/Vietnamese subsets; trimming to hand-written `@font-face` rules is a future optimisation if the budget tightens.
- `font-display: swap` can cause a late font swap; metrics are close enough that CLS remains 0 in testing, but this must be rechecked if the families change.
