# Implementation Plan — Khang Tran Portfolio Site

**Status:** DRAFT — core decisions locked (see §7). Remaining blockers: §8. No code written yet.
**Date:** 2026-11-23
**Repo:** `MEGAFICER/portfolio` (local dir `ken-resume`)
**Sources of truth:**

- `README.md` (requirements)
- `khang-tran-work-experience-details.docx` (technical work detail)
- `khang-tran-linkedin-pdf-2026112301.pdf` (dates + tenures, per README)

---

## 1. Goals

1. A single-page portfolio for Khang Tran positioned as a **Physical Design Engineer on a Senior PD trajectory**, targeting **Winter 2027 internships** and **Summer 2027 co-ops** in **Ottawa / Montréal / Toronto**.
2. Astro static site, GitHub Pages, push-to-`main` auto-deploy.
3. WCAG 2.2 AA, fast (Core Web Vitals green), top-tier SEO, responsive, auto/light/dark theming, tasteful high-performance motion.
4. Resume download with a timestamped filename; LinkedIn links.
5. PRDs for functional requirements, ADRs for technical decisions, GitHub issues for every Khang-side action item.
6. Lint + format + unit tests enforced pre-commit and in CI.

### Non-goals

- No CMS, no database, no server runtime, no auth.
- No blog unless requested.
- No contact form backend (mailto only) unless requested.

---

## 2. Content strategy (the part that actually sells him)

The site must read like an engineer's **execution record**, not a student page. Recruiters at Marvell/Synopsys/Cadence/Qualcomm/Tenstorrent screen for: tape-outs, node experience, signoff ownership, tool fluency, and scope.

### Positioning spine

- Headline: Physical Design Engineer — **netlist-to-GDSII for advanced-node SoCs**.
- Proof line: **3.5 years**, multiple **taped-out** blocks across **TSMC 7nm, Intel 16nm, UMC/14nm-class** designs, blocks up to **~3.7M instances** at **~800 MHz**.
- Availability line: full-time MEng ECE student @ uOttawa (Sep 2026 – May 2028) · open to **Winter 2027 internships** and **Summer 2027 co-ops** in Ottawa / Montréal / Toronto · **on-site, hybrid, or remote**.
- Role targeting: **Physical Design (implementation)**, plus **STA** and **PV/signoff** roles.
- Aspiration line (explicit, but not arrogant): building toward **Senior Physical Design Engineer** — ownership from floorplan through signoff, methodology/automation, and mentoring.
- **Clients and blocks are anonymized; all numbers stay real.** (See D-03.)

### Sections (single page, anchor nav)

1. **Hero** — name, role, one-line pitch, availability pill, CTAs (Download Resume, LinkedIn, Contact).
2. **Impact strip** — 4–6 quantified facts (years, tape-outs, max block size, top frequency, nodes, interns mentored).
3. **About / How I work** — 3 short paragraphs: ownership, root-cause-first optimization, constraints discipline, automation to kill toil.
4. **Experience timeline** — Faraday (Mar 2023 – Jul 2026), Uniquify/Ideas2Silicon, Synopsys training. Each entry: scope, what he owned, techniques, outcome. ← _company/title conflicts pending Q4._
5. **Selected work / case studies** (3 expanded): large multi-million-instance NoC block (3.7M instances, 801 MHz, heavy feedthroughs, congestion root-cause matrix, manual CTS/insertion-delay tuning, 94-level path escalation), 1.4M-instance wrapper/EMI block (528 MHz, multi-corner/PVT, SDC debugging, `set_path_group`), and a taped-out DDR PHY (full PD + PV/signoff). Nodes described generically ("advanced node", "16nm-class", "14nm-class") per D-03 until Khang clears client names.
6. **Additional engagements** — UMC test chip (114 memories, IR-drop/RLRP, hold on memory interfaces), GPU preCTS/CTS, metal ECO/signoff, chip-top PV.
7. **Toolchain & skills** — grouped: PnR (Innovus), Timing (PrimeTime, PrimeClosure), PV (Calibre: LVS/DRC/ERC/PERC), Power (Voltus, Thunder), Scripting (Tcl/AWK/csh/Python), OS, methodologies (FPPG, early PV, ECO, multi-corner).
8. **Mentoring & technical leadership** — 2 interns, mentor lead, training curriculum (floorplan → preCTS → routing → flow).
9. **Education & awards** — uOttawa MEng (expected May 2028), HCMUT BEng (GPA 8.09/10, 2022 outstanding academic performance), 45nm D-flip-flop thesis, fertigation research, Synopsys Fast Track certificate, Top-5 presentation.
10. **Contact / footer** — email, LinkedIn, location, resume.

### Copy rules (recorded as PRD-002)

- Verb-first, quantified, no adjectives without a number.
- Google X-Y-Z: "Accomplished [X] as measured by [Y] by doing [Z]."
- PD vocabulary used precisely (FPPG, LVS, IR-drop, skew groups, insertion delay, ULVT, ECO, multi-corner, feedthrough).
- No confidential client names unless Khang approves (see Q3).

---

## 3. Requirement traceability (README → deliverable)

| README requirement            | Deliverable                                                             | Verified by                                                  |
| ----------------------------- | ----------------------------------------------------------------------- | ------------------------------------------------------------ |
| Astro                         | Astro 7 + TS strict                                                     | build                                                        |
| GitHub Pages deploy           | `deploy.yml` (artifact + `deploy-pages`)                                | live URL check                                               |
| CI/CD on push to main         | `ci.yml` (PR) + `deploy.yml` (main)                                     | Actions run                                                  |
| WCAG 2.2 AA                   | semantic shell, tokens, focus, contrast, 24px targets, reduced motion   | axe in Playwright (both themes), manual checklist in PRD-005 |
| Performance                   | zero-JS-by-default, self-hosted subset fonts, no animation libs, budget | Lighthouse CI budgets in `ci.yml`                            |
| SEO                           | meta/canonical/OG/JSON-LD/sitemap/robots/404                            | unit tests on meta output + Lighthouse SEO 100               |
| Dark/light/auto               | `prefers-color-scheme` + persisted override, no flash                   | unit tests + Playwright                                      |
| Unit tests for everything     | Vitest + Testing Library; e2e smoke                                     | coverage gate in CI                                          |
| Responsive/mobile             | fluid type/space, mobile-first breakpoints                              | Playwright viewports (360/768/1280)                          |
| Latest resume on site         | `/resume` page + PDF                                                    | build check + e2e download                                   |
| Timestamped download filename | client-side `<a download>` name                                         | unit test of filename formatter                              |
| LinkedIn links                | header, hero, footer                                                    | e2e link assertions                                          |
| Modern animations, performant | CSS scroll-driven + view transitions, `prefers-reduced-motion`          | budget + reduced-motion e2e                                  |
| PRDs                          | `docs/prd/` (12)                                                        | review                                                       |
| ADRs                          | `docs/adr/` (12–13)                                                     | review                                                       |
| Khang action items → issues   | `gh issue create` batch                                                 | issue links in final report                                  |
| Pre-commit hooks              | husky + lint-staged: eslint, prettier, `astro check`, `vitest run`      | hook smoke test                                              |
| Docx/LinkedIn as sources      | `docs/content-inventory.md` mapping every claim to source               | review                                                       |

---

## 4. Technical architecture

### Stack (versions verified on npm, 2026-11-23)

- `astro@7` (SSG), `typescript` strict, `@astrojs/check`
- `@astrojs/sitemap`
- `vitest` + `@testing-library/dom` + `jsdom` (unit), `@playwright/test` + `@axe-core/playwright` (e2e/a11y), `@lhci/cli`
- `eslint` (flat config, typescript-eslint, astro plugin) + `prettier` + `prettier-plugin-astro`
- `husky` + `lint-staged`
- Package manager: **npm** (proposed; Q10)

### Repo layout (proposed)

```
.github/workflows/{ci.yml,deploy.yml}
.husky/{pre-commit}
docs/{prd,adr,plans,content-inventory.md}
public/{favicon.svg,apple-touch-icon.png,og/…,robots.txt}
src/
  components/layout/{Header,Footer,Nav,ThemeToggle,SkipLink}.astro
  components/sections/{Hero,ImpactStrip,About,Experience,CaseStudies,Skills,Mentoring,Education,Contact}.astro
  components/ui/{TimelineItem,Tag,DownloadResume,SectionHeader,Icon}.astro
  components/seo/{Seo.astro,JsonLd.astro}
  data/{profile.ts,experience.ts,cases.ts,skills.ts,education.ts}
  layouts/BaseLayout.astro
  pages/{index.astro,resume.astro,404.astro}
  styles/{tokens,base,layout,motion}.css
  lib/{theme.ts,datetime.ts,resume.ts,seo.ts}
  scripts/{theme-init.ts,resume-download.ts}
tests/unit/**  tests/e2e/**
astro.config.mjs tsconfig.json eslint.config.js .prettierrc vitest.config.ts playwright.config.ts lighthouserc.json
```

### Key technical decisions (to be recorded as ADRs, pending Q11 approval)

- **ADR-0001** Astro SSG — zero-JS default, islands only for theme toggle + download filename.
- **ADR-0002** No UI framework — hand-written semantic HTML + CSS; smallest possible payload.
- **ADR-0003** Content as typed TS modules (`src/data/*.ts`, Zod-validated) — one source of truth shared by page, `/resume`, JSON-LD, and future PDF.
- **ADR-0004** Pages deploy via `actions/upload-pages-artifact` + `deploy-pages`, `permissions: pages/id-token`, `concurrency`, environment protection.
- **ADR-0005** URL strategy — project site (`/portfolio` base) unless custom domain (Q1).
- **ADR-0006** Theme = `data-theme` on `<html>`, inline head script reads `localStorage` → else `matchMedia`, sets before paint (no FOUC); explicit toggle stored, `system` respected until overridden.
- **ADR-0007** Motion = CSS only (scroll-driven `animation-timeline: view()` behind `@supports`, View Transitions API for navigation, transform/opacity only), fully disabled under `prefers-reduced-motion`.
- **ADR-0008** Self-hosted variable fonts (subset, `font-display: swap`, preload) + system fallback metrics.
- **ADR-0009** Testing pyramid: unit (logic, data integrity, meta, filename), e2e (nav, theme persistence, download, responsive), axe (both themes), Lighthouse budgets.
- **ADR-0010** Resume delivery strategy (pending Q2).
- **ADR-0011** Confidentiality policy for block/company detail (pending Q3).
- **ADR-0012** Pre-commit gate = lint-staged (eslint --fix, prettier) + full `astro check` + full `vitest run` (README mandates tests pre-commit).
- **ADR-0013** Analytics (none by default; pending Q10).

---

## 5. Phases

| #   | Phase          | Output                                                                            | Exit criteria                                     |
| --- | -------------- | --------------------------------------------------------------------------------- | ------------------------------------------------- |
| 0   | Decisions      | answered questions, `docs/content-inventory.md`                                   | all blocking Qs answered                          |
| 1   | Scaffold       | Astro 7 + TS, structure, eslint/prettier, husky, vitest, PRD-001, ADR-0001/2/3/12 | `npm run build`, `lint`, `test` green; hook fires |
| 2   | Shell & tokens | header/nav/footer/skip link, tokens, theme system, PRD-003, ADR-0006/8            | theme switch + persistence + no flash; axe clean  |
| 3   | Content model  | typed data + `content-inventory.md`, unit tests for data integrity                | schema tests pass                                 |
| 4   | Sections       | all 10 sections, responsive, PRD-002/004                                          | Lighthouse mobile ≥95 perf, all breakpoints OK    |
| 5   | Motion         | reveals, view transitions, hover states, PRD-008, ADR-0007                        | reduced-motion e2e; CLS 0                         |
| 6   | Resume         | `/resume` page, PDF, timestamped download, PRD-009, ADR-0010                      | e2e download asserts filename                     |
| 7   | SEO            | meta, JSON-LD Person, sitemap, robots, OG image, 404, PRD-007                     | Lighthouse SEO 100; rich-result validator         |
| 8   | Quality gates  | axe in both themes, keyboard/zoom audit, budgets, PRD-005/006/010                 | all gates green                                   |
| 9   | CI/CD          | `ci.yml`, `deploy.yml`, Pages settings, branch protection, PRD-011, ADR-0004/5    | push to main → live site                          |
| 10  | Docs & issues  | 12 PRDs, 12 ADRs, README, GitHub issues for Khang, final report                   | issues linked, docs reviewed                      |

---

## 6. Risks

| Risk                                                          | Mitigation                                                            |
| ------------------------------------------------------------- | --------------------------------------------------------------------- |
| Confidential chip/company details not cleared for publication | Q3; anonymized variant pre-written                                    |
| No resume PDF exists                                          | Q2; can generate PDF from site data                                   |
| GitHub Pages base path breaks assets                          | `site` + `base` in config, relative asset URLs, e2e on built output   |
| Full test suite on every commit too slow                      | keep suite < 5 s at unit level; e2e in CI only                        |
| Playwright + Lighthouse flakiness in CI                       | fixed budgets with tolerance, retries, artifact uploads               |
| Public repo containing personal PDFs                          | do not commit source PDFs; `public/resumes/*.pdf` only after approval |

---

## 7. Decision log

| ID   | Decision                                                                                                               | Consequence                                                                                                              |
| ---- | ---------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| D-01 | Legal/display name **Khang Nguyen Tran**                                                                               | `<title>`, JSON-LD, hero                                                                                                 |
| D-02 | Resume **generated by us** for now (print-CSS PDF from the same data); Khang drops his own PDF in later                | `src/data` is the single source; ADR-0010; swap path documented                                                          |
| D-03 | **Anonymize clients/blocks, keep real numbers**                                                                        | "Large NoC block, 3.7M instances, 801 MHz" not "TSMC 7nm NoC for X"; ADR-0011. Revisit when Khang confirms               |
| D-04 | Repo stays **private**; only the Pages site is public                                                                  | Private-repo Pages needs GitHub Pro on `MEGAFICER` + admin action (see §8)                                               |
| D-05 | Khang is a **full-time uOttawa MEng student** as of Nov 2026; Faraday ended Jul 2026                                   | No "currently at Faraday" phrasing                                                                                       |
| D-06 | Include fertigation research + 45nm flip-flop thesis; exclude IELTS and the Top-5 presentation contest; keep Languages | Content inventory updated                                                                                                |
| D-07 | Availability: **on-site, hybrid, remote**; roles **PD implementation, STA, PV**                                        | Hero + contact copy                                                                                                      |
| D-08 | **Single scrolling page**, anchor (`#`) navigation, no sub-pages                                                       | `/resume` is not a page — the PDF is a static asset; `404.astro` remains                                                 |
| D-09 | Visual direction **(a) Silicon blueprint**                                                                             | Dark-first, monochrome + copper/cyan accent, mono labels, grid motifs                                                    |
| D-10 | Engineering baseline approved as proposed (§4)                                                                         | npm, Node 22, TS strict, no UI framework, blocking a11y/SEO/Lighthouse gates                                             |
| D-11 | Hosting: repo already belongs to **Khang (`MEGAFICER`)** — deploy there                                                | URL is `megaficer.github.io/portfolio/`; no `kshitijv` in the URL, nothing to hide. Migration README becomes unnecessary |
| D-12 | This session's account has **write but not admin** on `MEGAFICER/portfolio`                                            | Enabling Pages + first deploy is a **Khang action item → GitHub issue**                                                  |

## 8. Remaining blockers

1. Public contact details: email, phone (publish or not), city, GitHub/other links; confirm LinkedIn slug.
2. Headshot (a small photo of his face on the site) vs text-only.
3. Uniquify + Synopsys titles: LinkedIn says "Physical Design Engineer", the docx says intern / trainee.
4. Resume filename format and whether it must be one page.
5. Analytics: none / Plausible / GA4.
6. Mockup to approve first, or build directly.
7. GitHub Pro on `MEGAFICER` (required for Pages on a private repo), or whether the repo goes public temporarily.
