# PRD-002 — Career narrative and copy standards

- **Status:** Implemented
- **Owner:** Khang Nguyen Tran
- **Last updated:** 2026-11-23
- **Verification:** `tests/unit/content.test.ts` (anonymisation, dates, required facts)

## Purpose

The site exists to get Khang interviews for **Winter 2027 internships** and **Summer 2027 co-ops** in Ottawa, Montréal and Toronto, and to establish him as a **physical design engineer on a senior track**. The copy is the product.

## Audience

1. **Recruiters and university-relations coordinators** — scan for degree, term, location, eligibility. They need it in the first screen.
2. **Hiring managers and senior PD engineers** — scan for tape-outs, nodes, signoff ownership, tool fluency, block scale. They need numbers, not adjectives.
3. **Peers and former colleagues** — check accuracy. Being caught exaggerating ends the process.

## Positioning

- Role: **Physical Design Engineer**, targeting **implementation, STA and PV/signoff**.
- Trajectory: senior PD responsibilities now — block ownership, methodology, automation, mentoring.
- Proof: 3.5 years, 4 taped-out blocks, 13K to 3.7M instances, up to ~801 MHz, 7nm/16nm/14nm-class.
- Status: full-time MEng student at the University of Ottawa since September 2026; not currently employed in industry.

## Requirements

| ID      | Requirement                                                                                              | Priority |
| ------- | -------------------------------------------------------------------------------------------------------- | -------- |
| FR-2.1  | Availability, term length, regions and working modes appear above the fold.                              | Must     |
| FR-2.2  | Every claim is either a number, a named tool, a named technique or a verifiable fact.                    | Must     |
| FR-2.3  | Experience is reverse chronological: Faraday, Uniquify, Synopsys.                                        | Must     |
| FR-2.4  | Synopsys is described as a part-time training programme; Uniquify as an internship. Neither is inflated. | Must     |
| FR-2.5  | Faraday ends July 2026 and is never described as current.                                                | Must     |
| FR-2.6  | Client and product names are withheld; node classes and all numeric metrics are real.                    | Must     |
| FR-2.7  | IELTS score and the presentation contest are not published.                                              | Must     |
| FR-2.8  | The 45 nm flip-flop thesis and the fertigation research are published. Languages are published.          | Must     |
| FR-2.9  | Three case studies appear, strongest first: 3.7M-instance block, 1.4M wrapper, DDR PHY.                  | Must     |
| FR-2.10 | Work eligibility is stated as up to 24 h/week in Winter 2027 and 40 h/week in Summer 2027.               | Must     |
| FR-2.11 | No sentence claims a result Khang cannot defend in an interview.                                         | Must     |

## Copy rules

- Google X-Y-Z: "Accomplished X, measured by Y, by doing Z."
- Prefer the concrete noun: "feedthrough pins", "reg2icg", "insertion delay", "FPPG", "IR-drop".
- No "passionate", "hard-working", "results-driven", "cutting-edge", "leverage", "synergy".
- No sentence longer than 30 words in body copy.
- British/Canadian spelling: "programme" only in prose that is not a tool name; "optimization" per tool naming.
- The word "senior" appears as an aspiration, never as a current title.

## Acceptance criteria

1. `tests/unit/content.test.ts` passes: anonymisation list, dates, required facts, forbidden topics.
2. The hero states name, role, availability and mode in the first viewport at 1280×800.
3. Every case study contains a problem, at least three actions and an outcome.
4. A reader who knows nothing about ASIC can still explain what Khang does after reading the About section.

## Out of scope

- Inventing metrics, clients, titles or outcomes.
- Publishing a photograph, age, nationality, marital status or immigration details.

## Related

PRD-001, ADR-0011. Owner action items: confirm client anonymisation (issue #3), confirm location (issue #4).
