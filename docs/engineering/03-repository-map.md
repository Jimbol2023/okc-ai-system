# Repository Map

This map helps engineers orient before changing files.

## Primary Application Areas

- `app/`: Next.js app routes, pages, and API endpoints.
- `components/`: reusable React UI, especially dashboard surfaces.
- `lib/`: AI Core, business logic, safety policies, connector registries, and domain engines.
- `prisma/`: database schema and migrations.
- `generated/`: generated Prisma client artifacts.
- `docs/architecture/`: authoritative architecture and governance references.
- `docs/ai-company-playbook/`: AI company operating model and workforce playbooks.
- `docs/engineering/`: repository operations, sprint governance, debt tracking, and delivery standards.
- `tests/`: focused safety, activation, and end-to-end tests.

## Change Ownership Guidance

- Core reusable services belong in `lib/`.
- Business-module-specific behavior should remain isolated from AI Core when possible.
- Provider integrations should remain governed connector plug-ins.
- Dashboard UI should consume typed reports rather than duplicate business logic.
- Documentation-only changes should not modify app code, generated files, schema, credentials, or deployment configuration.

## Dirty Worktree Protocol

When the worktree is dirty:

- inspect status before changes
- identify files related to the approved sprint
- do not revert or clean unrelated files
- avoid broad formatters
- report existing dirty state separately from new sprint changes
