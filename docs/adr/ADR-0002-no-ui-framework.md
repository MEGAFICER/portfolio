# ADR-0002 — No UI framework; hand-written semantic HTML and CSS

- **Status:** Accepted
- **Date:** 2026-11-23
- **Deciders:** Khang Nguyen Tran, project maintainers
- **Related:** ADR-0001, ADR-0007, PRD-006

## Context

The page needs a hero, a timeline, three case studies, skill tables, a contact block and a theme toggle. None of that requires client-side state management. A portfolio that ships 150 KB of framework to toggle a CSS class is a bad first impression for a hardware engineer.

## Decision

No React/Vue/Svelte/Solid. Components are `.astro` files that render static HTML. Interactivity is three small vanilla modules: inline theme resolver, theme toggle, resume filename. CSS is hand-written with custom properties, `clamp()` and grid; no utility framework, no CSS-in-JS runtime.

## Alternatives considered

1. **React island for the theme toggle.** It would work, but pulls a renderer into the bundle for one button with two behaviours.
2. **Tailwind.** Fast to write, but adds a build step, a class-name layer in the markup and a design-token indirection that duplicates what CSS custom properties already do. Also hurts readability of the HTML for an audience that may inspect it.
3. **Web components.** Nice encapsulation, but the only interactive elements are trivial; custom elements add lifecycle code and hydration questions for no benefit.

## Consequences

**Positive**

- First-load JavaScript measured in single-digit kilobytes (theme + filename only).
- Full control over semantics, focus order and landmarks — which is what WCAG conformance actually depends on.
- Nothing to upgrade in the UI layer; the design is inspectable in devtools as plain HTML/CSS.

**Negative / risks**

- No component library: repeated patterns (cards, chips, buttons) are maintained by hand through shared classes in `layout.css`.
- Future interactive features (filterable project list, animated demos) would need a decision review rather than a default. That is intentional.
