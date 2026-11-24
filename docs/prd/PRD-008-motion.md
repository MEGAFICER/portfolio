# PRD-008 — Motion and animation

- **Status:** Implemented
- **Owner:** Khang Nguyen Tran
- **Last updated:** 2026-11-23
- **Verification:** `tests/e2e/a11y.spec.ts` (reduced-motion context), PRD-006 budgets, code review

## Purpose

Motion should make the page feel engineered and deliberate — a blueprint coming into register — without costing a single frame that matters. The bar: a senior hardware engineer should find it tasteful; a performance engineer should find nothing to criticise.

## Requirements

| ID     | Requirement                                                                                                 | Priority |
| ------ | ----------------------------------------------------------------------------------------------------------- | -------- |
| FR-8.1 | No animation library. All motion is CSS.                                                                    | Must     |
| FR-8.2 | Only `transform` and `opacity` are animated.                                                                | Must     |
| FR-8.3 | Scroll reveals use the CSS scroll-driven timeline (`animation-timeline: view()`), with no scroll listeners. | Must     |
| FR-8.4 | Browsers without scroll-driven animation support show fully visible content, never blank elements.          | Must     |
| FR-8.5 | `prefers-reduced-motion: reduce` disables all non-essential motion, including smooth scrolling.             | Must     |
| FR-8.6 | No parallax, no autoplaying video, no cursor followers, no infinite loops.                                  | Must     |
| FR-8.7 | Entrance animation is limited to the hero and runs once, ≤ 640 ms.                                          | Should   |
| FR-8.8 | Hover transitions are ≤ 220 ms and have a focus-visible equivalent.                                         | Must     |

## Motion inventory

| Element                | Trigger      | Property            | Duration / curve                      |
| ---------------------- | ------------ | ------------------- | ------------------------------------- |
| Hero copy blocks       | page load    | opacity, translateY | 620 ms, staggered 60 ms, `--ease-out` |
| Section headers, cards | scroll entry | opacity, translateY | scroll-driven, `entry 5% → cover 26%` |
| Section kicker rule    | scroll entry | scaleX              | scroll-driven                         |
| Buttons, links, chips  | hover/focus  | colour, border      | 120–220 ms                            |
| Theme change           | click        | document colours    | 380 ms                                |

## Acceptance criteria

1. With reduced motion enabled, no element animates and the page is fully readable immediately.
2. With `@supports (animation-timeline: view())` disabled in devtools, all content is visible.
3. CLS stays at 0 across reveals.
4. No main-thread long tasks attributable to animation on a throttled CPU.

## Out of scope

- Page transitions (single page), 3D, canvas, SVG path animation, typewriter effects.

## Related

ADR-0007. PRD-005, PRD-006.
