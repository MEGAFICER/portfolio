# ADR-0013 — Documentation and owner action items

- **Status:** Accepted
- **Date:** 2026-11-23
- **Deciders:** Khang Nguyen Tran, project maintainers
- **Related:** PRD-012

## Context

The project was built by someone other than its owner. Khang will inherit a repository whose decisions he did not make, and some decisions cannot be made for him: what clients may be named, what contact details are public, who enables GitHub Pages.

Two failure modes to avoid: undocumented decisions that get silently reversed, and action items buried in chat history.

## Decision

1. Functional requirements live in `docs/prd/`, one file per area, each with numbered requirements, acceptance criteria and links to the tests that verify them.
2. Technical decisions live in `docs/adr/`, in the standard Context / Decision / Alternatives / Consequences form. Every ADR names at least two rejected alternatives.
3. Anything only Khang can do becomes a GitHub issue on his own repository, with steps, rationale and acceptance criteria. The issue number is referenced from the ADR or PRD that depends on it.
4. `docs/content-inventory.md` maps each published claim to its source (owner messages, the DOCX, the LinkedIn export) and flags anything still unconfirmed.
5. Source documents (DOCX, LinkedIn PDF) are **not committed**; they stay with the owner. Only the generated resume is published.

## Alternatives considered

1. **A single `DECISIONS.md`.** Simpler to scan, but merges unrelated decisions and makes supersession messy.
2. **GitHub Discussions or a wiki.** Lives outside the repo, so it disappears if the repo is forked or transferred, and it is not reviewed in pull requests.
3. **Chat history as the record.** The status quo this ADR is designed to replace.

## Consequences

**Positive**

- Khang can audit "why is it like this?" without asking anyone.
- Reviewers can reject a change that contradicts an ADR without re-litigating the decision.
- Open questions are visible on the repository's issue list rather than lost in a conversation.

**Negative / risks**

- Documentation must be updated in the same PR as the change; otherwise ADRs drift into fiction.
- Twelve PRDs for one page is heavy ceremony. The trade-off is deliberate: the owner asked for it, and the files are short.
- Issues for the owner can pile up if unanswered; they are labelled `owner-action` to stay visible.
