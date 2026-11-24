# PRD-007 — SEO and structured data

- **Status:** Implemented
- **Owner:** Khang Nguyen Tran
- **Last updated:** 2026-11-23
- **Verification:** `tests/unit/seo.test.ts`, `tests/e2e/home.spec.ts` (metadata, JSON-LD), Lighthouse SEO = 100

## Purpose

When a recruiter searches "Khang Nguyen Tran physical design" or "physical design engineer Ottawa intern", the site should be findable and the result should look professional and specific.

## Target queries

- `Khang Nguyen Tran` / `Khang Tran physical design`
- `physical design engineer Ottawa intern`
- `ASIC physical design co-op Ottawa`
- `STA physical verification engineer Toronto internship`

## Requirements

| ID      | Requirement                                                                                                                                         | Priority |
| ------- | --------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| FR-7.1  | One `<title>` per page, under 60 characters, containing the name and the role.                                                                      | Must     |
| FR-7.2  | A meta description of 60–160 characters that states role, experience and availability.                                                              | Must     |
| FR-7.3  | A canonical URL on every page, absolute and base-path aware.                                                                                        | Must     |
| FR-7.4  | Open Graph and Twitter card metadata with a generated 1200 × 630 PNG and meaningful alt text.                                                       | Must     |
| FR-7.5  | `schema.org` `Person` JSON-LD: name, job title, description, URL, email, telephone, address, alumni, languages, `sameAs`, `knowsAbout`.             | Must     |
| FR-7.6  | `sitemap-index.xml` generated at build, linked from `robots.txt` and from the document head.                                                        | Must     |
| FR-7.7  | `robots.txt` allows everything except nothing — the site is fully indexable; the 404 page is `noindex`.                                             | Must     |
| FR-7.8  | Semantic heading structure, descriptive link text, `lang="en"`, and readable content that matches the queries above.                                | Must     |
| FR-7.9  | The 404 page is excluded from the sitemap and marked `noindex, nofollow`.                                                                           | Must     |
| FR-7.10 | No duplicate URLs in the sitemap (Astro emits both `/portfolio` and `/portfolio/` when `trailingSlash: 'ignore'`; only the canonical form is kept). | Must     |

## Acceptance criteria

1. Lighthouse SEO score is 100.
2. The JSON-LD parses as valid JSON and validates as `Person` with `sameAs` containing LinkedIn and GitHub.
3. `dist/sitemap-0.xml` contains exactly one URL for the homepage and no 404 entry.
4. `og:image` resolves to `https://megaficer.github.io/portfolio/og/og.png` (absolute, base path included).
5. `/portfolio/` and `/portfolio` both resolve; only the trailing-slash form is canonical.

## Out of scope

- Paid search, hreflang, AMP, blog/article schema, review/rating markup.

## Related

ADR-0005, ADR-0009. PRD-001, PRD-009.
