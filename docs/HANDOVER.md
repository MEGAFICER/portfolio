# Handover — Portfolio v1

**Live:** https://megaficer.github.io/portfolio/
**Repository:** https://github.com/MEGAFICER/portfolio
**Released:** 2026-11-24

This document is the short version of the project: what shipped, how it is verified, what was decided, and what is left for the owner. The long version lives in `docs/prd/` and `docs/adr/`.

---

## 1. What shipped

A single-page portfolio for **Khang Nguyen Tran**, Physical Design Engineer, targeting **Winter 2027 internships** and **Summer 2027 co-ops** in Ottawa, Montréal and Toronto.

| Section         | Content                                                                                            |
| --------------- | -------------------------------------------------------------------------------------------------- |
| Hero            | Name, positioning line, availability, work eligibility, three primary actions                      |
| Impact strip    | 3.5 years · 4 taped-out blocks · 3.7M largest block · 801 MHz highest clock · 2 interns mentored   |
| About           | Career summary plus three operating principles (diagnose, automate, own signoff)                   |
| Selected work   | Three case studies: 3.7M-instance NoC block, 1.4M wrapper/EMI block, DDR PHY pair                  |
| Experience      | Faraday (Mar 2023 – Jul 2026), Uniquify (Dec 2022 – Mar 2023), Synopsys (Oct – Nov 2022)           |
| Supporting work | 94K-cell test chip, GPU preCTS/CTS, metal ECO and signoff, chip-top PV                             |
| Toolchain       | Implementation, timing, signoff, tools, scripting, platform                                        |
| Mentoring       | Two interns, mentor lead, training curriculum                                                      |
| Education       | uOttawa MEng (expected May 2028), HCMUT BEng, 45 nm flip-flop thesis, fertigation research, awards |
| Contact         | Email, phone, LinkedIn, GitHub, resume download, availability detail                               |

Cross-cutting: dark/light/system theming with no flash, WCAG 2.2 AA, CSS-only motion with reduced-motion support, generated resume PDF with timestamped filename, sitemap, robots, Open Graph image, styled 404, zero third-party scripts.

## 2. How it is verified

| Gate                             | Result                                                                                                                                             |
| -------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| Unit tests                       | 117 passing                                                                                                                                        |
| Coverage (`src/lib`, `src/data`) | 100% statements/lines/functions, 97% branches                                                                                                      |
| End-to-end                       | 41 passing across desktop-dark, desktop-light, mobile                                                                                              |
| Accessibility                    | axe: zero violations, WCAG 2.0/2.1/2.2 A+AA, both themes, all viewports                                                                            |
| Lint / format / types            | clean                                                                                                                                              |
| Contrast                         | asserted from `src/styles/tokens.css`, not by eye                                                                                                  |
| Live checks                      | 200 on homepage, resume (`application/pdf`), sitemap, robots, OG image; 404 on unknown paths; zero failed requests; 0 px mobile overflow at 360 px |

One intentional skip: the keyboard-path test is desktop-only, because the mobile navigation lives in a collapsed `<details>` menu. Documented in the test.

Defects found and fixed during verification:

1. Availability chip with `white-space: nowrap` caused 118 px of horizontal overflow at 360 px.
2. Theme button's accessible name did not contain its visible label (WCAG 2.5.3), caught by axe.
3. Body colour transitioned over 380 ms while child text switched instantly — unreadable text on every theme change. Removed and guarded by `tests/unit/styles.test.ts`.
4. OG image URL omitted the `/portfolio` base path.
5. Sitemap listed both `/portfolio` and `/portfolio/`.

## 3. Architecture in one screen

```
GitHub push to main
  → deploy.yml: npm ci → Chromium → npm run build → Pages artifact → deploy
      npm run build = generate resume PDF + OG image + touch icon → astro build
  → https://megaficer.github.io/portfolio/

pull request
  → ci.yml: lint → format → astro check → vitest --coverage → build →
            playwright (3 projects, axe) → lighthouse (dist artifact)
```

- **Framework:** Astro 7, static output, base path `/portfolio`.
- **Content:** `src/data/*.json`, Zod-validated at import; feeds page, PDF and JSON-LD.
- **Logic:** `src/lib/*` — theme state machine, filename stamping, base-path joining, SEO metadata.
- **Styling:** CSS custom properties in `src/styles/`, component-scoped styles elsewhere.
- **No UI framework, no animation library, no analytics.**

## 4. Decisions worth knowing

| Decision                                          | ADR        |
| ------------------------------------------------- | ---------- |
| Astro, static, zero JS by default                 | 0001, 0002 |
| Content as validated JSON, rendered three ways    | 0003       |
| Pages deployment via official actions + OIDC      | 0004       |
| Project site under `/portfolio`, one switch point | 0005       |
| Theme resolved inline before paint                | 0006       |
| CSS scroll-driven motion, no JS                   | 0007       |
| Self-hosted variable fonts                        | 0008       |
| Vitest + Playwright + axe + Lighthouse, by layer  | 0009       |
| Resume generated at build time                    | 0010       |
| Clients anonymised, numbers real                  | 0011       |
| Commit gate composition                           | 0012       |
| Docs and owner-action policy                      | 0013       |

## 5. Open owner actions

| Issue | What                                                        | Why it matters                                                                |
| ----- | ----------------------------------------------------------- | ----------------------------------------------------------------------------- |
| #2    | Supply your own resume PDF                                  | The current one is generated; accurate but not designed                       |
| #3    | Confirm the anonymisation policy                            | Site withholds customers/foundries; you decide whether that can loosen        |
| #4    | Confirm phone, location, GitHub handle, custom domain       | Data is currently published; correct it before sending the link to recruiters |
| #5    | Verify derived facts (4 tape-outs, dates, titles, May 2028) | Numbers you cannot defend in an interview are worse than none                 |
| #7    | Protect `main`, set repo description and topics             | Turns CI into a gate instead of a suggestion                                  |

Closed: #1 (Pages enabled), #6 (history verified clean — no personal documents were ever committed).

## 6. Day-2 operations

| Task                 | How                                                                                                                          |
| -------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| Edit copy or metrics | Edit `src/data/*.json`, run `npm test`, push                                                                                 |
| Replace the resume   | See README → Resume (drop file, change one script)                                                                           |
| Change the URL       | Edit `SITE`/`BASE` in `astro.config.mjs`, plus `public/robots.txt`                                                           |
| Add a section        | New component in `src/components/sections`, mount in `src/pages/index.astro`, add to `src/lib/nav.ts` if it needs a nav link |
| Roll back            | Re-run an earlier successful deploy workflow                                                                                 |

## 7. Known limitations

- The resume is generated HTML-to-PDF, not a designed document. Replacement is expected (issue #2).
- Fonts ship Cyrillic/Greek/Vietnamese subsets that English content never fetches. Trimming is an optional optimisation.
- Scroll-driven reveals do not run in Firefox; content is fully visible there by design (the fallback is "no animation").
- English only, single page, no blog, no contact form backend.
- `astro preview` daemonises in Astro 7; the test harness uses `scripts/serve-dist.mjs` instead.

## 8. Privacy notes

- The published site withholds customer, foundry and product names (ADR-0011). All numbers are real.
- Email and phone are public by owner choice; remove them if the profile is ever circulated somewhere undesirable.
- The original `.docx` and LinkedIn export are **not** in the repository and are gitignored.

---

Questions about any decision should be answerable from `docs/adr/`; if not, that is a documentation bug worth fixing in the same PR as the change.
