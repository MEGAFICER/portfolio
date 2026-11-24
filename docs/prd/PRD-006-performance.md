# PRD-006 — Performance budgets

- **Status:** Implemented
- **Owner:** Khang Nguyen Tran
- **Last updated:** 2026-11-23
- **Verification:** Lighthouse CI (`lighthouserc.json`), build output inspection

## Purpose

A portfolio opens on a recruiter's phone, often on mobile data, often while they are doing something else. It should appear before they lose interest.

## Budgets

| Metric                           | Budget                    | Gate   |
| -------------------------------- | ------------------------- | ------ |
| Lighthouse performance (mobile)  | ≥ 95                      | warn   |
| Lighthouse accessibility         | 100                       | error  |
| Lighthouse best practices        | 100                       | error  |
| Lighthouse SEO                   | 100                       | error  |
| Cumulative Layout Shift          | ≤ 0.02                    | error  |
| Total Blocking Time              | ≤ 120 ms                  | warn   |
| Unused JavaScript                | 0 bytes                   | warn   |
| JavaScript shipped (first party) | ≤ 8 KB compressed         | review |
| CSS shipped                      | ≤ 40 KB uncompressed      | review |
| Largest Contentful Paint         | ≤ 1.8 s (mobile, slow 4G) | warn   |

## Requirements

| ID     | Requirement                                                                                             | Priority |
| ------ | ------------------------------------------------------------------------------------------------------- | -------- |
| FR-6.1 | The page is server-rendered static HTML; content is visible without JavaScript.                         | Must     |
| FR-6.2 | JavaScript is limited to the theme init, theme toggle and resume filename.                              | Must     |
| FR-6.3 | No animation, UI, date or utility library is shipped to the browser.                                    | Must     |
| FR-6.4 | Fonts are self-hosted, subsetted and loaded with `font-display: swap`; no render-blocking font request. | Must     |
| FR-6.5 | No third-party scripts: no analytics, no embeds, no tag managers, no cookie banners.                    | Must     |
| FR-6.6 | Images are limited to the favicon, touch icon and OG image; the page uses no photographic images.       | Must     |
| FR-6.7 | Animations use only `transform` and `opacity`, never layout or paint properties.                        | Must     |
| FR-6.8 | The resume PDF and OG image are generated at build time, not at request time.                           | Must     |

## Acceptance criteria

1. `npx lhci autorun` meets every `error` assertion.
2. A production build ships fewer than 8 KB of first-party JavaScript.
3. Disabling JavaScript leaves a complete, readable page.
4. CLS on a cold load at 360 px is below 0.02 (no late-loading fonts or images shifting layout).

## Out of scope

- Prefetching, service worker, offline mode, CDN tuning beyond GitHub Pages defaults.

## Related

ADR-0002, ADR-0007, ADR-0008. PRD-008.
