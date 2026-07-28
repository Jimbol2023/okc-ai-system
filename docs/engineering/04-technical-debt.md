# Technical Debt Register

This register tracks debt categories that should be reviewed before and after each sprint.

## Current Debt Categories

| Category | Risk | Engineering Response |
|---|---|---|
| Dirty worktree | Changes may be mixed with unrelated work | Scope changes tightly and report status before/after |
| Repeated advisory modules | Similar logic can drift across many files | Prefer shared AI Core services and typed report contracts |
| Connector readiness vs execution | Readiness can be mistaken for permission | Keep provider calls and writes blocked unless exact policy allows |
| Dashboard logic duplication | UI can reimplement business rules | Keep readiness/scoring in `lib/`, render in components |
| Generated artifacts in status | Generated files can obscure review scope | Avoid codegen unless explicitly required |
| Documentation drift | Architecture docs can conflict | Link to authority sources and update indexes deliberately |

## Debt Review Questions

Every sprint should answer:

- Did this create a new abstraction?
- Did this duplicate existing logic?
- Did this make connector execution easier to misuse?
- Did this modify unrelated dirty files?
- Did this increase deployment risk?
- Did this improve or weaken the AI company operating model?

## Carry-Forward Rule

Known debt does not block every sprint, but it must be reported when it affects risk, testing, deployment, maintainability, or future architecture.
