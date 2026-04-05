# OKC Wholesale AI System

Production-oriented starter for a wholesale real estate platform focused on Oklahoma City.

## Stack

- Next.js App Router
- Tailwind CSS
- PostgreSQL
- Prisma ORM
- TypeScript

## Included foundations

- Public website route group in `app/(public)`
- Internal dashboard route group in `app/(dashboard)/dashboard`
- Reusable layout components in `components/layout`
- Shared UI primitives in `components/shared`
- Lead capture form with validation and source tracking
- Prisma schema prepared for leads, properties, and follow-up tasks
- API route scaffold for lead intake in `app/api/leads/route.ts`

## Local setup

1. Copy `.env.example` to `.env`.
2. Set a valid PostgreSQL `DATABASE_URL`.
3. Install dependencies:

```bash
npm install
```

4. Generate the Prisma client:

```bash
npm run prisma:generate
```

5. Run the first migration:

```bash
npm run prisma:migrate -- --name init
```

6. Start the dev server:

```bash
npm run dev
```

## Notes

- Assumption: authentication for `/dashboard` will be added next. It is intentionally scaffolded but not yet protected.
- Assumption: lead records will be stored in PostgreSQL once Prisma migrations are applied.
- No property facts are hardcoded; the current content is structural and operational only.
