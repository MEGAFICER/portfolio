# ADR-0010 — Resume PDF generated at build time

- **Status:** Accepted
- **Date:** 2026-11-23
- **Deciders:** Khang Nguyen Tran, project maintainers
- **Related:** PRD-009, ADR-0003

## Context

The site must offer "the latest resume" as a timestamped download. There was no resume file in the repository — only a LinkedIn export and a DOCX of work details. Two goals conflict: the site copy must match the PDF, and the owner will eventually supply a professionally designed PDF of his own.

## Decision

Generate `public/resume/khang-nguyen-tran-resume.pdf` at build time from the same JSON the page uses:

1. `scripts/generate-assets.mjs` renders an A4 HTML resume from `src/data/*.json`.
2. Playwright Chromium prints it with `tagged: true` (accessible PDF) and `outline: true`, falling back to untagged output on older Chromium.
3. The same script renders the 1200×630 OG image and the 180×180 touch icon.
4. The download button sets `download="Khang-Nguyen-Tran-Resume-YYYY-MM-DD-HHmm.pdf"` at click time.

Replacing the file with an owner-authored PDF is documented in PRD-009 and requires no component change.

## Alternatives considered

1. **Hand-maintain a PDF and upload it.** Fastest today, but guarantees drift between the site and the PDF, and produces a file nobody can diff.
2. **`@react-pdf/renderer` or `pdf-lib`.** Programmatic and dependency-light, but typography control and text reflow are poor; the output looks like a generated report, not a resume.
3. **LaTeX (`.tex` → PDF) in CI.** Excellent typesetting, but a second toolchain, a large TeX install in CI, and content duplicated in LaTeX source.
4. **Print-to-PDF from the live page.** Would export the whole portfolio (long, screen-optimised) rather than a resume; also couples resume design to page design.

## Consequences

**Positive**

- The PDF cannot contradict the page: one dataset, two renderings.
- Real selectable text with a heading structure, which matters for ATS parsing.
- No binary blobs in git history on every content update.

**Negative / risks**

- The build now requires Chromium (`npx playwright install chromium`). Documented in README; CI installs it explicitly.
- The generated PDF is a solid engineering resume, not a designed one. Replacing it with the owner's PDF is the expected end state.
- Rendering twice (page + PDF) means resume-specific CSS must be maintained in the generator script.
- Generated assets are gitignored, so a local build is required before inspecting them; the deployed site always has them because CI builds.
