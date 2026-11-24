# PRD-005 — Accessibility (WCAG 2.2 AA)

- **Status:** Implemented
- **Owner:** Khang Nguyen Tran
- **Last updated:** 2026-11-23
- **Verification:** `tests/e2e/a11y.spec.ts` (axe, both themes, all projects), `tests/unit/contrast.test.ts`, manual checklist below

## Purpose

The site must conform to **WCAG 2.2 Level AA**. Accessibility is also a credibility signal: an engineer who ships an inaccessible portfolio is telling you how they ship.

## Automated requirements

| ID     | Requirement                                                                      | Verified by |
| ------ | -------------------------------------------------------------------------------- | ----------- |
| FR-5.1 | Zero axe violations for `wcag2a`, `wcag2aa`, `wcag21a`, `wcag21aa`, `wcag22aa`.  | axe (CI)    |
| FR-5.2 | Zero violations in both light and dark themes.                                   | axe (CI)    |
| FR-5.3 | Every text/background token pair used for copy meets 4.5:1 (3:1 for large text). | unit        |
| FR-5.4 | Focus indicator meets 3:1 against both page and card backgrounds.                | unit        |
| FR-5.5 | One `<h1>`; heading levels never skip.                                           | e2e         |
| FR-5.6 | Exactly one `<main>`; header, nav and footer are landmarks.                      | e2e         |
| FR-5.7 | All images and icons are either decorative (`aria-hidden`) or labelled.          | review      |
| FR-5.8 | The theme control's accessible name contains its visible label (2.5.3).          | axe + unit  |

## Manual checklist (run before any release)

Target size and pointer (2.5.8 — new in 2.2)

- [ ] Every link and button is at least 24 × 24 px, verified at 200 % zoom.
- [ ] No control relies on hover-only affordances.

Focus and keyboard (2.4.7, 2.1.1, 2.4.11)

- [ ] Tab from page load reaches the skip link first, then the header, then each section.
- [ ] Focus is visible on the theme toggle, menu summary, all links and the resume button.
- [ ] The sticky header never fully covers a focused element (`scroll-padding-top` covers it).
- [ ] `Enter` activates links; `Space`/`Enter` activates the theme button; the menu works with the keyboard.

Reading and structure

- [ ] Screen-reader pass (VoiceOver/Safari, NVDA/Edge): name, role, availability, sections announced in order.
- [ ] Reading order matches visual order at 360 px.
- [ ] The resume PDF is tagged and has real text (selectable), not scanned images.

Motion and zoom

- [ ] With `prefers-reduced-motion: reduce`, no entrance or scroll animation plays.
- [ ] At 200 % zoom and 320 px width, no content is lost or clipped.

Language and content

- [ ] `html lang="en"` is correct; no other language is required.
- [ ] Link text is meaningful out of context (no bare "here").

## Acceptance criteria

1. `npx playwright test tests/e2e/a11y.spec.ts` passes in every project.
2. `tests/unit/contrast.test.ts` passes for both themes.
3. Manual checklist completed and recorded in the release PR description.
4. The resume PDF passes a tag-structure check (Chromium tagged output; text extractable).

## Out of scope

- WCAG AAA, a separate high-contrast theme, captioning for video (no video exists).

## Related

ADR-0006, ADR-0007, ADR-0009. PRD-003, PRD-004, PRD-009.
