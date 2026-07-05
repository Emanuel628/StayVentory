# Backend Setup

StayVentory uses Supabase for:

- Auth
- Postgres
- Row Level Security
- Storage

## 1. Create the Supabase project

Create a new Supabase project, then copy:

- project URL
- anon key

## 2. Add local environment variables

Create `.env.local` in the project root:

```bash
EXPO_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## 3. Run the initial schema

Use the SQL in:

- `supabase/migrations/202607050001_initial_schema.sql`

This creates:

- profiles
- houses
- house_members
- rooms
- inventory tables
- cleaning job tables
- notes
- issues
- attachments
- house playbooks
- enums, helper functions, and RLS policies

## 4. Current app wiring

The app now includes:

- `src/lib/env.ts`
- `src/lib/supabase/client.ts`
- `src/lib/supabase/database.types.ts`
- `src/providers/AuthProvider.tsx`
- `src/services/auth.ts`
- `src/services/houses.ts`

## 5. What is wired vs not wired

Wired now:

- typed Supabase client
- persistent auth session support
- auth provider in the app shell
- starter auth service
- starter houses service
- initial SQL schema and RLS

Not wired yet:

- live login/register forms
- live house creation form submission
- room CRUD calls
- notes/issues/checklist service calls
- storage uploads

## 6. Next backend slice

The next implementation step should be:

1. replace owner register/login mocks with real auth actions
2. connect add-property to `createHouse`
3. load houses from Supabase with mock fallback during transition
