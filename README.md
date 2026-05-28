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
2. Copy `.env.example` to `.env.local` and add PostgreSQL and session values.
3. Run `npm run dev` or the equivalent command for your package manager.

## Next implementation steps

- Apply [database/leadpulse_postgres.sql](/Users/vishnuvu/Documents/Codex/Lead%20CRM/database/leadpulse_postgres.sql:1) to your PostgreSQL database
- Set up an SSH tunnel if the VPS database is not publicly exposed
- Add lead CRUD, notes, follow-up creation, and CSV import
- Deploy the app on the VPS or add a stable private database connection path

## Docker deployment

Build and run locally:

```bash
docker build -t leadpulse-crm .
docker run --rm -p 3000:3000 \
  -e DATABASE_URL=postgresql://user:password@host:5432/leadpulse_crm \
  -e SESSION_SECRET=change-me \
  leadpulse-crm
```
