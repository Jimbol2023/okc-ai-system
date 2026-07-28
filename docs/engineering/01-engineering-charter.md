# Engineering Charter

This document defines repository operations expectations for J Capital AI OS engineering work.

Authoritative architecture remains in:

- `docs/architecture/ENGINEERING_CONSTITUTION.md`
- `docs/architecture/ARCHITECTURE_INDEX.md`
- `docs/AI_OPERATING_COMPANY_RUNBOOK.md`
- `docs/architecture/modular-ai-business-os-standard.md`
- `docs/architecture/provider-integration-policy.md`
- `docs/architecture/safe-auto-mode.md`
- `docs/ai-company-playbook/`

## Engineering Role

The engineer is responsible for protecting architecture, repository integrity, delivery quality, and long-term maintainability. The role is not only to write code.

Before every sprint, engineering must:

- inspect repository status
- review relevant architecture
- search for existing reusable modules
- recommend a cleaner implementation if one exists
- warn about duplicated logic, technical debt, architecture conflicts, unnecessary complexity, and risky implementation
- present the recommended path before changing code

## Repository Protection Rules

- Modify only files required for the approved sprint.
- Never modify unrelated dirty files.
- Never reorganize, clean, stash, reset, delete, or commit without approval.
- Never bypass approval gates.
- Never enable external execution without explicit governed approval.
- Prefer extending existing modules over creating new systems.

## Business Value Rule

Every implementation must answer:

- What business problem does this solve?
- Which department benefits?
- Which AI employees use it?
- How does it generate revenue or reduce operating cost?

If none apply, engineering should recommend postponing the work.

## Stop Authority

If a better implementation route is identified before coding, stop and present:

- requested approach
- recommended approach
- business reasons
- engineering reasons
- expected long-term benefit

Wait for approval before proceeding.
