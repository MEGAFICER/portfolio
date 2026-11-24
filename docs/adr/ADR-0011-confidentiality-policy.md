# ADR-0011 — Anonymised clients, real numbers

- **Status:** Accepted (provisional — owner confirmation pending, issue #3)
- **Date:** 2026-11-23
- **Deciders:** Khang Nguyen Tran (decision owner), project maintainers
- **Related:** PRD-002, PRD-012

## Context

The source material names specific customer programmes and silicon: a 7nm NoC block, a 16nm wrapper/EMI block, a 14nm DDR PHY, a UMC test chip, GPU blocks. Khang worked at Faraday, a design-services company, where customer identity is normally covered by NDA. Publishing "Intel 16nm wrapper at 528 MHz, 1.4M instances" is specific enough to be identifying even without a name.

At the same time, vague copy ("worked on advanced-node blocks") destroys the entire value of the portfolio. Numbers are what hiring managers screen on.

## Decision

Publish **employers** (Faraday, Uniquify, Synopsys — already public on LinkedIn) and withhold **customers, product names and foundry names**. Keep every quantitative detail: instance counts, pin counts, frequencies, cell counts, memory counts, block orientations.

Node descriptions become generically identifying tiers: `7nm-class`, `16nm-class`, `14nm-class`. Case studies are titled by scale, not by product: "3.7M-instance networking block", "1.4M-instance wrapper/EMI block", "DDR PHY datapath blocks".

A unit test (`tests/unit/content.test.ts`) fails the build if any banned customer name appears in the content files.

## Alternatives considered

1. **Full disclosure with names.** Strongest recruiter signal, highest legal and professional risk. Rejected without written clearance from Khang and his former employer.
2. **Fully generic copy, no numbers.** Zero risk, zero value; indistinguishable from every other new-grad portfolio.
3. **Wait for clearance before publishing anything.** Blocks the entire project on a third party. Rejected; the anonymised version is publishable now and can be upgraded later.
4. **Password-protected detail page.** Adds auth, hurts SEO and accessibility, and does not remove the disclosure risk.

## Consequences

**Positive**

- Publishable today without exposing customer identity.
- Still highly specific: a PD hiring manager can tell a 3.7M-instance, 801 MHz, 20K-pin block from a toy project.
- The ban list is enforced in code, so a future careless edit cannot leak a name.

**Negative / risks**

- Some recruiters infer less about the exact product domain; mitigated by naming the problem class (networking NoC, wrapper/EMI, DDR PHY).
- The node tiers are one abstraction step away from a name; if Khang's employer considers even node + frequency identifying, this ADR must be revisited.
- Provisional status: Khang must confirm the policy (issue #3). If he later obtains clearance, replace the tiers with real names in `src/data/*.json` — no component changes needed.
