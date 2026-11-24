# PRD-012 — Documentation and owner action items

- **Status:** Implemented
- **Owner:** Khang Nguyen Tran
- **Last updated:** 2026-11-23
- **Verification:** `docs/` review, GitHub issue list

## Purpose

This project has two users: Khang, who will maintain and eventually own the site, and anyone helping him. Both need to know what was decided and what only Khang can decide or do.

## Requirements

| ID      | Requirement                                                                                                                          | Priority |
| ------- | ------------------------------------------------------------------------------------------------------------------------------------ | -------- |
| FR-12.1 | Every functional requirement is captured in a PRD under `docs/prd/`.                                                                 | Must     |
| FR-12.2 | Every non-obvious technical decision is captured in an ADR under `docs/adr/`, with context, decision, alternatives and consequences. | Must     |
| FR-12.3 | The README explains setup, scripts, architecture, deployment and how Khang takes over hosting.                                       | Must     |
| FR-12.4 | Any action that only Khang can perform is filed as a GitHub issue with concrete steps.                                               | Must     |
| FR-12.5 | `docs/content-inventory.md` maps each claim to its source (docx, LinkedIn PDF, or owner confirmation).                               | Must     |
| FR-12.6 | Documentation is updated in the same pull request as the change it describes.                                                        | Must     |
| FR-12.7 | No personal documents are committed: no LinkedIn export, no DOCX, no scans.                                                          | Must     |

## Acceptance criteria

1. `docs/prd/` contains PRD-001 to PRD-012; `docs/adr/` contains ADR-0001 to ADR-0012.
2. Every ADR states at least two alternatives that were rejected.
3. The README lets a new machine go from clone to running site in under ten minutes.
4. Every open entry in `docs/content-inventory.md` marked **needs confirmation** has a linked issue.
5. `git ls-files` contains no `.docx`, no LinkedIn export and no personal PDF other than the generated resume.

## Out of scope

- A wiki, a changelog per release, docs site hosting.

## Related

PRD-001, PRD-002. ADR-0013.
