# PRD-009 — Resume delivery and timestamped download

- **Status:** Implemented
- **Owner:** Khang Nguyen Tran
- **Last updated:** 2026-11-23
- **Verification:** `tests/unit/resume.test.ts`, `tests/unit/datetime.test.ts`, `tests/e2e/home.spec.ts` (download + content type)

## Purpose

A recruiter who wants the resume must get it in one click, as a real PDF, named so it is identifiable months later in a Downloads folder. The site must never show a resume that disagrees with the page.

## Requirements

| ID      | Requirement                                                                                      | Priority |
| ------- | ------------------------------------------------------------------------------------------------ | -------- |
| FR-9.1  | A resume download is available in the header, the hero and the contact section.                  | Must     |
| FR-9.2  | The file is a PDF served from a stable URL under the site base path.                             | Must     |
| FR-9.3  | The suggested filename is `Khang-Nguyen-Tran-Resume-YYYY-MM-DD-HHmm.pdf`, stamped at click time. | Must     |
| FR-9.4  | Repeated downloads produce distinguishable filenames (minute precision).                         | Must     |
| FR-9.5  | The PDF contains real, selectable text with a logical heading structure — not images of text.    | Must     |
| FR-9.6  | The PDF is generated at build time from `src/data/*.json`, so it cannot drift from the site.     | Must     |
| FR-9.7  | The PDF fits on A4 with no clipped content; two pages maximum.                                   | Must     |
| FR-9.8  | The link works without JavaScript (filename then falls back to the static `download` attribute). | Must     |
| FR-9.9  | The link is announced with its file type, not just "download".                                   | Should   |
| FR-9.10 | Replacing the PDF with an externally authored resume must not require touching components.       | Must     |

## Filename contract

```
Khang-Nguyen-Tran-Resume-2026-11-23-1430.pdf
└──────── base ─────────┘ └─── stamp ───┘
```

- Local visitor time, not UTC: the visitor wants to recognise when _they_ downloaded it.
- No slashes, colons or spaces: safe on Windows, macOS and mobile share sheets.
- Milliseconds excluded: the stamp identifies a download, not a machine event.

## Replacement path (owner)

When Khang supplies his own PDF:

1. Put the file at `public/resume/khang-nguyen-tran-resume.pdf`.
2. Remove or guard the `assets` step in `package.json` (`build` currently regenerates it).
3. Keep `RESUME_FILE` in `src/lib/resume.ts` in sync if the filename changes.
4. Run `npm run test && npm run build`.

## Acceptance criteria

1. Clicking any resume button triggers a download whose filename matches the contract regex.
2. `GET /portfolio/resume/khang-nguyen-tran-resume.pdf` returns 200, `application/pdf`, and starts with `%PDF`.
3. Text extracted from the PDF matches the site's experience dates, name and contact details.
4. The PDF is reachable and downloadable with JavaScript disabled.

## Out of scope

- Server-side resume tailoring per job posting, DOCX version, cover letters (separate owner action).

## Related

ADR-0010, ADR-0003. PRD-002, PRD-007.
