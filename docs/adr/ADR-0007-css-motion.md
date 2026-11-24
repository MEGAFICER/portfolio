# ADR-0007 — Motion with CSS scroll-driven animations

- **Status:** Accepted
- **Date:** 2026-11-23
- **Deciders:** Khang Nguyen Tran, project maintainers
- **Related:** PRD-008, PRD-006, PRD-005

## Context

The owner asked for "mature modern animations that do not trade off performance for looks". The usual approaches — GSAP, Framer Motion, AOS, IntersectionObserver reveal libraries — all add JavaScript, main-thread work, and scroll listeners. On a static page, that is pure cost.

## Decision

All motion is CSS:

- Scroll reveals use the **scroll-driven animation timeline** (`animation-timeline: view()`, `animation-range: entry 5% cover 26%`), which runs off the main thread with no JavaScript.
- The hero entrance is a one-shot `@keyframes` on load.
- Only `transform` and `opacity` animate.
- Everything is wrapped in `@supports (animation-timeline: view())` and `prefers-reduced-motion: no-preference`, so unsupported browsers and reduced-motion users see fully visible content rather than a blank block.
- Hover/focus transitions are limited to colour and border changes at 120–220 ms.

## Alternatives considered

1. **IntersectionObserver + class toggling.** Broad support, but adds a script, a scroll-observer per element, and a flash-of-invisible-content risk if the script fails. Also main-thread work during scroll.
2. **AOS / Motion One / GSAP.** More expressive, but 10–50 KB and a runtime for effects this page does not need. Rejected on the stated performance constraint.
3. **View Transitions API for a single-page site.** No navigation exists, so there is nothing to transition; would add ceremony without effect.
4. **SVG line-drawing / canvas blueprint animation.** Visually attractive, expensive, and a poor fit for text-first content.

## Consequences

**Positive**

- Zero JavaScript and zero scroll listeners for reveal effects.
- CLS stays at 0: reveals only move/opacity, never layout.
- Reduced-motion support is a single CSS condition rather than a JS branch.

**Negative / risks**

- Browser support for scroll-driven animations is Chromium/Safari-recent; Firefox lacks it at time of writing. The fallback is "no animation", which is acceptable and explicitly designed for.
- Designers cannot easily add timeline-scrubbed or physics-based effects later without revisiting this ADR. That is intentional: the constraint is the point.
- Reveal timing is expressed in scroll ranges, which is less intuitive to tune than durations; the ranges are documented in `motion.css`.
