# Khang Nguyen Tran — Portfolio

Portfolio site for **Khang Nguyen Tran**, Physical Design Engineer (MEng ECE, University of Ottawa). One scrolling page: about, three case studies, experience, toolchain, mentoring, education, contact, plus a downloadable resume.

- **Live site:** https://megaficer.github.io/portfolio/ _(after issue #1 is completed)_
- **Stack:** Astro 7 · TypeScript strict · hand-written CSS · Vitest · Playwright · Lighthouse CI
- **Hosting:** GitHub Pages, deployed from `main` by GitHub Actions

---

## Quick start

Requirements: **Node ≥ 24.15** (jsdom 31), npm ≥ 10, and Chromium for the resume/OG build step.

```bash
git clone https://github.com/MEGAFICER/portfolio.git
cd portfolio
npm install
npx playwright install chromium   # needed once: builds the resume PDF + OG image
npm run dev                       # http://localhost:4321/portfolio/
```

The site is served under `/portfolio/` because it is a GitHub Pages **project site**. `http://localhost:4321/` will 404 — that is expected.

## Scripts

| Script                            | What it does                                                              |
| --------------------------------- | ------------------------------------------------------------------------- |
| `npm run dev`                     | Dev server with HMR at `/portfolio/`                                      |
| `npm run build`                   | Generates the resume PDF, OG image and touch icon, then builds `dist/`    |
| `npm run build:fast`              | `astro build` only, skipping generated assets (assets must already exist) |
| `npm run serve`                   | Serves the built `dist/` at `http://localhost:4322/portfolio/`            |
| `npm run check`                   | `astro check` — TypeScript and Astro diagnostics                          |
| `npm run lint` / `lint:fix`       | ESLint, including Astro accessibility rules                               |
| `npm run format` / `format:check` | Prettier                                                                  |
| `npm test`                        | Unit tests (fast, no browser)                                             |
| `npm run test:coverage`           | Unit tests with enforced coverage thresholds                              |
| `npm run test:e2e`                | Playwright: desktop dark, desktop light, mobile                           |
| `npm run lighthouse`              | Lighthouse CI budgets against the built site                              |
| `npm run verify`                  | lint + format check + type check + coverage (no browser needed)           |

## Project structure

```
src/
  data/            content as JSON + Zod schemas — the single source of truth
  components/
    layout/        header, footer, skip link, theme toggle
    sections/      hero, about, work, experience, engagements, skills,
                   mentoring, education, contact
    seo/           <head> metadata
    ui/            buttons, section headers, resume download
  layouts/         BaseLayout: head, theme resolver, JSON-LD
  lib/             pure logic: theme, dates, resume filename, paths, SEO
  pages/           index.astro, 404.astro
  styles/          tokens, base, layout, motion
scripts/
  generate-assets.mjs   resume PDF, OG image, touch icon (Playwright)
  serve-dist.mjs        static server used by Playwright and Lighthouse
tests/
  unit/            Vitest: logic, schemas, SEO, contrast
  e2e/             Playwright: behaviour, accessibility
docs/
  prd/             12 product requirement documents
  adr/             13 architecture decision records
  content-inventory.md   every published claim and its source
  plans/           implementation plan and decision log
```

## Editing content

Everything a recruiter reads comes from `src/data/`:

| File                | Contains                                                       |
| ------------------- | -------------------------------------------------------------- |
| `profile.json`      | name, contact, location, availability, languages, impact stats |
| `experience.json`   | the three roles and their highlights                           |
| `case-studies.json` | the three deep-dive blocks                                     |
| `engagements.json`  | supporting work (test chip, GPU CTS, metal ECO, chip-top PV)   |
| `skills.json`       | toolchain and methodology groups                               |
| `education.json`    | degrees, research/thesis, awards                               |
| `leadership.json`   | mentoring                                                      |

Rules enforced by tests:

- Client and foundry names must not appear (`tests/unit/content.test.ts`). Keep `7nm-class` style node descriptions. See `docs/adr/ADR-0011-confidentiality-policy.md`.
- Every field in `src/data/schema.ts` is required unless marked optional. A missing field fails the build with the field name.
- The same data feeds the page, the resume PDF and the structured data. Edit once.

## Resume

`public/resume/khang-nguyen-tran-resume.pdf` is **generated at build time** from `src/data/*.json` by `scripts/generate-assets.mjs` and is gitignored. The download button names the file `Khang-Nguyen-Tran-Resume-YYYY-MM-DD-HHmm.pdf` at click time.

To publish your own designed PDF instead:

1. Drop your file at `public/resume/khang-nguyen-tran-resume.pdf`.
2. Change the `build` script in `package.json` to `astro build` (skip `npm run assets`), or keep the generator and only override this file after building.
3. If the filename changes, update `RESUME_FILE` in `src/lib/resume.ts`.
4. Run `npm test && npm run build`.

## Deployment

The workflow `.github/workflows/deploy.yml` builds and publishes on every push to `main`, using GitHub's official Pages actions (OIDC, no stored tokens).

**One-time setup, done by the repository owner (Khang):**

1. Repository → **Settings → Pages**.
2. **Build and deployment → Source: GitHub Actions**.
3. Push to `main` (or run the workflow manually).
4. The site appears at `https://megaficer.github.io/portfolio/`.

Tracked as **issue #1**. Until it is done, the deploy job fails at the upload step — the code is not the problem.

### Changing the URL

`SITE` and `BASE` in `astro.config.mjs` are the only places the deployment target is declared.

| Target                                 | `SITE`                        | `BASE`                   |
| -------------------------------------- | ----------------------------- | ------------------------ |
| Current project site                   | `https://megaficer.github.io` | `/portfolio`             |
| Custom domain (`khangtran.dev`)        | `https://khangtran.dev`       | `/` + add `public/CNAME` |
| User site (`megaficer.github.io` repo) | `https://megaficer.github.io` | `/`                      |

After changing them, update `public/robots.txt` (sitemap URL) and run the full test suite.

## Ownership and handover

The repository already lives under Khang's GitHub account (`MEGAFICER`), so the Pages URL carries his handle, not a helper's. Nothing needs migrating.

If the site is ever rebuilt under a different account:

1. Fork or transfer the repository.
2. Repeat the one-time Pages setup above.
3. Update `SITE`, `BASE` and the sitemap URL.
4. Delete the old deployment (Settings → Pages → unpublish, or delete the old environment).

## Quality gates

| Gate                    | Command                                                 | Runs on         |
| ----------------------- | ------------------------------------------------------- | --------------- |
| Lint, format, types     | `npm run lint && npm run format:check && npm run check` | pre-commit + CI |
| Unit tests + coverage   | `npm run test:coverage`                                 | pre-commit + CI |
| E2E + axe (WCAG 2.2 AA) | `npx playwright test`                                   | CI              |
| Lighthouse budgets      | `npx lhci autorun`                                      | CI              |

Current state: **109 unit tests**, 3 e2e projects, axe clean in both themes, contrast asserted from the token file, zero third-party scripts, no analytics, no cookies.

## Documentation

- `docs/prd/` — what the site must do, and how each requirement is verified.
- `docs/adr/` — why it is built this way, including rejected alternatives.
- `docs/content-inventory.md` — every claim, its source, and what still needs owner confirmation.
- `docs/plans/` — the implementation plan and running decision log.

## Privacy

The original source documents (`.docx` work details and the LinkedIn export) are **not** part of the published site and should not be committed. If they currently exist in git history, see issue #6 before making the repository public.

## Troubleshooting

| Symptom                                      | Cause                                                 | Fix                                           |
| -------------------------------------------- | ----------------------------------------------------- | --------------------------------------------- |
| `EBADENGINE` / jsdom errors                  | Node older than 24.15                                 | `fnm use 24.15` or newer                      |
| `Asset generation failed` / Chromium missing | Playwright browsers not installed                     | `npx playwright install chromium`             |
| Site 404s locally at `/`                     | Base path is `/portfolio`                             | use `http://localhost:4321/portfolio/`        |
| Deploy fails at `upload-pages-artifact`      | Pages not enabled                                     | complete issue #1                             |
| Fonts look generic                           | Fontsource CSS import missing from `BaseLayout.astro` | re-add the two `@fontsource-variable` imports |
| Theme flashes light on a dark device         | inline resolver removed from `<head>`                 | restore the script in `BaseLayout.astro`      |
