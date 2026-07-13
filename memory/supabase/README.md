# Memory — Supabase

Supabase scaffolds for vector storage using `pgvector`.

## Contents

```
supabase/
├── migrations/        # Numbered SQL migration files
├── schemas/           # Table and index definitions
└── helpers/           # RPC functions and Postgres helpers
```

## Setup

1. Create a Supabase project at [supabase.com](https://supabase.com).
2. Enable the `pgvector` extension in your project's SQL editor:
   ```sql
   create extension if not exists vector;
   ```
3. Apply migrations in order from `migrations/`.

## Environment Variables

```
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=   # server-side only, never expose to client
```
