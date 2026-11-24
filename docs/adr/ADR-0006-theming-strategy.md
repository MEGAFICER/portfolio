# ADR-0006 — Theming: inline resolver, one attribute, three states

- **Status:** Accepted
- **Date:** 2026-11-23
- **Deciders:** Khang Nguyen Tran, project maintainers
- **Related:** PRD-003, PRD-005

## Context

Requirements: follow the device by default, allow an explicit override, remember the override, never flash the wrong theme on load, and stay accessible. "Never flash" is the hard part: any theme decision made after first paint produces a visible flicker for dark-mode users, which is exactly the audience most likely to notice.

## Decision

1. A small inline `<script>` in `<head>` resolves the theme **before first paint**: read `localStorage['knt-theme']`, validate it, else read `matchMedia('(prefers-color-scheme: dark)')`, then set `documentElement.dataset.theme` and `style.colorScheme`.
2. CSS defines colour tokens under `:root[data-theme='light']` and `:root[data-theme='dark']`; nothing else selects colours.
3. The toggle cycles `system → light → dark`, persisting the preference and updating `data-theme`, the visible label and the accessible name.
4. While on `system`, a `matchMedia` change listener re-resolves the theme live.
5. The storage key is rendered into the `<html data-theme-key>` attribute so the inline script and the module share one source of truth.

## Alternatives considered

1. **`prefers-color-scheme` only, no toggle.** Meets the default requirement but breaks the explicit override requirement and gives the visitor no control (WCAG-adjacent usability issue).
2. **Class-based theming with the module loaded via `type="module"`.** Modules are deferred; the first paint would use the default theme and then flip — the exact flash we are avoiding.
3. **Server-side theme detection + cookie.** Requires a server; the site is static.
4. **Two-state toggle (light/dark) with no `system` state.** Simpler, but then "follow my device" is unreachable after the first click, and the requirement explicitly asks for device-aware behaviour.

## Consequences

**Positive**

- No flash, no layout shift, no hydration mismatch (there is no hydration).
- The state machine is pure and unit-tested (`resolveTheme`, `nextPreference`); the DOM binding is thin.
- Storage failure (private mode, blocked cookies) degrades to device preference without breaking the page.

**Negative / risks**

- One inline script in `<head>` is parser-blocking; it is ~15 lines and adds negligible time.
- The storage key appears twice (attribute + module); a test asserts the constant and the rendered attribute agree.
- With JavaScript disabled the page renders in the light theme regardless of device. Accepted as a progressive-enhancement trade-off; content remains fully readable.
