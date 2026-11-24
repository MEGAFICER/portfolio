# Content inventory — every claim and where it came from

Sources are abbreviated:

- **DOCX** — `khang-tran-work-experience-details.docx` (owner-supplied career detail). Not committed to the repository.
- **LI** — `khang-tran-linkedin-pdf-2026112301.pdf` (owner-supplied, source of truth for dates).
- **OWNER** — direct instruction from Khang or his representative in this project.

Status key: **✔ published** · **◐ needs confirmation** · **✘ excluded**

## Identity and contact

| Claim        | Value                                       | Source                             | Status | Notes                                                                     |
| ------------ | ------------------------------------------- | ---------------------------------- | ------ | ------------------------------------------------------------------------- |
| Full name    | Khang Nguyen Tran                           | OWNER                              | ✔      | Display name on site, PDF, JSON-LD                                        |
| Public email | ktran037@uottawa.ca                         | OWNER                              | ✔      | Published in contact section and JSON-LD                                  |
| Public phone | +1 (942) 588-2707                           | OWNER                              | ✔      | Published; remove on request                                              |
| LinkedIn     | linkedin.com/in/khangnguyentran             | LI                                 | ✔      |                                                                           |
| GitHub       | github.com/MEGAFICER                        | Repository owner                   | ✔      | Inferred from repo ownership; confirm if a different profile is preferred |
| Location     | Ottawa, Ontario, Canada                     | **derived** from uOttawa enrolment | ◐      | Issue #4                                                                  |
| Languages    | English (professional), Vietnamese (native) | DOCX + OWNER                       | ✔      | Vietnamese level inferred from origin; confirm wording                    |

## Availability

| Claim          | Value                                                              | Source       | Status |
| -------------- | ------------------------------------------------------------------ | ------------ | ------ |
| Terms          | Winter 2027 internship, Summer 2027 co-op                          | OWNER        | ✔      |
| Hours          | up to 24 h/week in Winter 2027; 40 h/week full-time in Summer 2027 | OWNER        | ✔      |
| Regions        | Ottawa, Montréal, Toronto                                          | OWNER        | ✔      |
| Modes          | on-site, hybrid, remote                                            | OWNER        | ✔      |
| Target roles   | physical design implementation, STA, physical verification         | OWNER        | ✔      |
| Student status | full-time MEng, University of Ottawa, Nov 2026                     | OWNER + DOCX | ✔      |

## Employment

| Claim                                                   | Value                           | Source                              | Status |
| ------------------------------------------------------- | ------------------------------- | ----------------------------------- | ------ |
| Faraday, Physical Design Engineer                       | Mar 2023 – Jul 2026 (3 yr 5 mo) | LI                                  | ✔      |
| Uniquify Vietnam, Physical Design Engineer (Intern)     | Dec 2022 – Mar 2023 (4 mo)      | LI + OWNER ("is an internship")     | ✔      |
| Synopsys, Physical Design Engineer (Trainee), part-time | Oct 2022 – Nov 2022 (2 mo)      | LI + OWNER ("is a training course") | ✔      |
| Total experience                                        | 3.5 years                       | LI summary                          | ✔      |

**Resolved conflicts.** The DOCX dates Uniquify as Dec 2022 – Feb 2023 and describes it as a co-op internship; LinkedIn says Dec 2022 – Mar 2023. Per the owner's instruction, LinkedIn wins for dates, and the DOCX framing wins for role type. The DOCX lists Synopsys as a "Fast Track Training Program" trainee; LinkedIn lists it as a part-time engineer role. The site uses "Physical Design Engineer (Trainee) — Part-time training program", satisfying both.

## Technical claims

All from **DOCX** unless noted.

| Claim             | Value                                                                   | Status                                                                  |
| ----------------- | ----------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| Largest block     | 3.7M instances, 20.2K pins, ~801 MHz, netlist → GDS                     | ✔                                                                       |
| Second block      | 1.1M instances, 3.5K pins, ~800 MHz                                     | ✔ (folded into the NoC case study)                                      |
| Wrapper/EMI block | 1.4M instances, 13K pins, 528 MHz                                       | ✔                                                                       |
| DDR PHY           | CPHY-NS 13.4K cells, CPHY-EW 10.7K cells, taped out                     | ✔                                                                       |
| Test chip         | 93.9K cells, 114 memories, 56 TMU blocks                                | ✔                                                                       |
| Insertion delay   | ~200 ps tuned, ~300 ps tested                                           | ✔                                                                       |
| Escalated path    | ~94 logic levels                                                        | ✔                                                                       |
| Mentoring         | 2 interns, internship mentor lead, training plan                        | ✔                                                                       |
| Tape-outs         | 4 blocks                                                                | ◐ derived from DOCX (DDR PHY, NoC ×2, EMI); confirm count with issue #5 |
| Tools             | Innovus, Thunder, Voltus, PrimeTime, PrimeClosure, Calibre, ICC2, Verdi | ✔                                                                       |
| Scripting         | Tcl, AWK, C-shell, Python, Perl                                         | ✔                                                                       |

## Education

| Claim       | Value                                                     | Source    | Status |
| ----------- | --------------------------------------------------------- | --------- | ------ |
| MEng ECE    | University of Ottawa, Sep 2026 – May 2028 (expected)      | DOCX + LI | ✔      |
| BEng EEE    | HCMUT, Sep 2018 – Apr 2023                                | DOCX + LI | ✔      |
| GPA         | 8.09/10                                                   | DOCX      | ✔      |
| Award       | Outstanding Academic Performance, 2022                    | DOCX      | ✔      |
| Thesis      | 45 nm D flip-flop comparison (SET, DET, TSPC, C2MOS)      | DOCX      | ✔      |
| Research    | Automated Fertigation Control System, Sep 2021 – Jun 2022 | DOCX      | ✔      |
| Certificate | Synopsys Fast Track Training Program, 2022                | DOCX      | ✔      |

## Excluded by owner instruction

| Item                          | Reason                            | Source  |
| ----------------------------- | --------------------------------- | ------- |
| IELTS 6.5                     | Not required; weakens the profile | OWNER   |
| Top 5 presentation contest    | Not required; unverifiable detail | OWNER   |
| Photograph                    | Text-only site                    | OWNER   |
| Customer and foundry names    | Confidentiality policy (ADR-0011) | OWNER   |
| Immigration or permit details | Not published                     | Default |

## Not published, worth adding later

| Item                      | Why it matters                                        | Owner action |
| ------------------------- | ----------------------------------------------------- | ------------ |
| Owner-authored resume PDF | Replaces the generated one                            | Issue #2     |
| Custom domain             | Cleaner identity than `megaficer.github.io/portfolio` | Issue #4     |
