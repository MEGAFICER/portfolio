# PRD-004 — Responsive layout and mobile

- **Status:** Implemented
- **Owner:** Khang Nguyen Tran
- **Last updated:** 2026-11-23
- **Verification:** `tests/e2e/home.spec.ts` (360 px overflow test), Playwright `mobile` project, manual checks at 320/360/390/768/1024/1440

## Purpose

Most recruiters open a portfolio link from a phone or a half-screen laptop window. The page must be readable, tappable and uncluttered at 320 px and up.

## Requirements

| ID     | Requirement                                                                             | Priority |
| ------ | --------------------------------------------------------------------------------------- | -------- |
| FR-4.1 | No horizontal scrolling at any width from 320 px to 2560 px.                            | Must     |
| FR-4.2 | Type scales fluidly with `clamp()`; no fixed font sizes for headings or body copy.      | Must     |
| FR-4.3 | All text stays at ≥ 16 px effective size for body copy on mobile.                       | Must     |
| FR-4.4 | Interactive targets are at least 24 × 24 CSS px, with 44 px for primary controls.       | Must     |
| FR-4.5 | The header collapses to a `Menu` disclosure below 992 px and remains keyboard operable. | Must     |
| FR-4.6 | Long unbroken strings (email, URLs) wrap instead of overflowing.                        | Must     |
| FR-4.7 | Multi-column grids collapse to one column; no information is hidden on small screens.   | Must     |
| FR-4.8 | The page remains usable at 200 % browser zoom and in landscape phone orientation.       | Must     |
| FR-4.9 | The layout does not depend on hover: every hover affordance has a focus equivalent.     | Must     |

## Breakpoints

| Token      | Width      | Behaviour                                              |
| ---------- | ---------- | ------------------------------------------------------ |
| base       | < 480 px   | single column, condensed header, no role subtitle      |
| `30rem`    | 480 px     | theme label returns, brand subtitle returns            |
| `50–56rem` | 800–896 px | hero, about, education, contact collapse to one column |
| `62rem`    | 992 px     | full horizontal navigation replaces the menu           |
| `64rem`    | 1024 px    | case study body becomes two columns                    |

## Acceptance criteria

1. The automated 360 px check reports ≤ 1 px of horizontal overflow.
2. At 320 px, the availability chip wraps rather than forcing a scrollbar (this was a real defect: `white-space: nowrap` on a long chip caused 118 px of overflow).
3. Menu links are reachable by keyboard and the disclosure has a visible focus ring.
4. Screenshots at 360 and 1280 show no clipped headings, overlapping text or cut-off buttons.

## Out of scope

- Native apps, tablet-specific layouts, print layout beyond the resume PDF.

## Related

PRD-005, PRD-008. ADR-0007.
