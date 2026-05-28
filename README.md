# LeadPulse CRM

LeadPulse CRM is a WhatsApp-first lead conversion CRM for agencies and small businesses. This starter focuses on the MVP wedge from the project plan: lead capture, follow-ups, lead quality, workspace isolation, and reporting.

## Included in this scaffold

- Next.js App Router + TypeScript project structure
- Premium multi-tenant app shell and responsive product UI
- Dashboard, leads, lead profile, pipeline, follow-ups, reports, workspaces, settings, auth, and onboarding pages
- Seeded demo data to make the product walkthrough tangible before backend wiring
- Supabase helpers, route middleware, environment placeholders, and an initial SQL migration with RLS policies

## To run locally

1. Install dependencies with your package manager of choice.
2. Copy `.env.example` to `.env.local` and add Supabase values.
3. Run `npm run dev` or the equivalent command for your package manager.

## Next implementation steps

- Wire Supabase Auth actions into `/login`, `/signup`, and `/onboarding`
- Replace mock `lib/data.ts` with workspace-scoped database queries
- Add server actions or route handlers for lead CRUD, notes, follow-ups, and template logging
- Add CSV import and workspace switching persistence
