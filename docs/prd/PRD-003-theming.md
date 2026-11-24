# PRD-003 — Theming (system, light, dark)

- **Status:** Implemented
- **Owner:** Khang Nguyen Tran
- **Last updated:** 2026-11-23
- **Verification:** `tests/unit/theme.test.ts`, `tests/unit/contrast.test.ts`, `tests/e2e/home.spec.ts` (theme cycle and persistence)

## Purpose

The site must open in the theme the visitor's device is already using, without a flash, and let them override it permanently.

## Requirements

| ID     | Requirement                                                                                                         | Priority |
| ------ | ------------------------------------------------------------------------------------------------------------------- | -------- |
| FR-3.1 | On first visit the resolved theme follows `prefers-color-scheme`.                                                   | Must     |
| FR-3.2 | The theme is applied before first paint — no flash of the wrong theme.                                              | Must     |
| FR-3.3 | The toggle cycles `system → light → dark → system`.                                                                 | Must     |
| FR-3.4 | An explicit choice persists across reloads and visits (localStorage).                                               | Must     |
| FR-3.5 | While on `system`, a change to the OS preference updates the page live without a reload.                            | Must     |
| FR-3.6 | The control has a visible state label (`auto`, `light`, `dark`) and an accessible name that starts with that label. | Must     |
| FR-3.7 | If storage is unavailable, the site still works and falls back to the device preference.                            | Must     |
| FR-3.8 | Both themes meet WCAG 2.2 AA contrast for every text and focus pair (see PRD-005).                                  | Must     |
| FR-3.9 | `color-scheme` is set so native form controls and scrollbars match the theme.                                       | Should   |

## Behaviour table

| Stored preference | Device is dark | Rendered | Visible label |
| ----------------- | -------------- | -------- | ------------- |
| none / `system`   | yes            | dark     | auto          |
| none / `system`   | no             | light    | auto          |
| `light`           | either         | light    | light         |
| `dark`            | either         | dark     | dark          |

## Implementation notes

- A tiny inline script in `<head>` resolves the theme from `localStorage` and `matchMedia` before the first paint.
- The bundled module in `ThemeToggle.astro` owns the interaction, updates `data-theme`, `color-scheme`, the visible label and the accessible name.
- Tokens live in `src/styles/tokens.css`; `data-theme` selects the block. There is no second source of colour values.

## Acceptance criteria

1. Device in dark mode + no stored preference → `html[data-theme="dark"]` on first paint.
2. Three clicks return the visible label to `auto` and re-follow the device.
3. After choosing light and reloading, the page is light even on a dark device.
4. With `localStorage` throwing, the page renders in the device theme and the toggle still works for the session.
5. Axe reports no `label-content-name-mismatch` on the control (the visible text is part of the accessible name).

## Out of scope

- Per-section themes, tinted accents, high-contrast theme variants, scheduled switching.

## Related

ADR-0006. PRD-005, PRD-008.
