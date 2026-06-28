# Deployment

The app is a Next.js application with Prisma-generated database access.

Standard validation commands:

```powershell
npm.cmd run prisma:generate
.\node_modules\.bin\tsc.cmd --noEmit
npm.cmd run lint
npm.cmd run build
```

Runtime expectations:

- Prisma client generation must run before production build when schema or generated client files change.
- Dashboard routes that depend on database reads must stay dynamic.
- Environment variables are configured outside git. `.env.local` must not be edited, committed, or exposed.
- Provider keys may exist only as deployment/runtime configuration and must not imply live activation.

Operational notes:

- Build-time prerender must not execute authenticated Prisma dashboard queries.
- Provider integrations are readiness-only unless a future governed phase explicitly activates them.
- Search should remain useful without providers through internal keyword ranking.
- Manual finance entries are required for finance KPIs; missing entries should be reported as data gaps, not fabricated values.
