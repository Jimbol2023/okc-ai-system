# AGENTS.md

This project is J Capital AI OS: a production-ready, enterprise AI Business Operating System.

The Oklahoma City wholesale real estate experience is the first business module, not the whole platform.

Engineering constitution:
- Follow `docs/architecture/ENGINEERING_CONSTITUTION.md` for implementation authority, source priority, PR verification, and stop conditions.
- Engineering implements approved architecture safely; it does not redefine business priorities or replace governed architecture.

Rules:
- Never invent property facts
- Label assumptions clearly
- Mobile-first design
- Clean, professional UI
- All forms must validate input
- Every lead must track source
- Keep code simple and maintainable
- Treat reusable services as AI Core
- Treat industry-specific behavior as installable Business Modules
- Treat provider integrations as governed connector plug-ins
- Preserve Safe Auto Mode, feature flags, audit logs, approvals, AI permissions, and connector health
- External actions remain approval-gated unless an explicit governed policy authorizes the exact action

Goals:
- Multi-page real estate website as the first Real Estate Business Module surface
- Lead capture system with source attribution
- Deal analyzer inside the Real Estate Business Module
- Tax list importer inside the Real Estate Business Module
- Out-of-state owner detection inside the Real Estate Business Module
- Driving-for-dollars tool inside the Real Estate Business Module
- Business-agnostic CRM dashboard primitives in AI Core
- Modular plug-in architecture for future industries

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
