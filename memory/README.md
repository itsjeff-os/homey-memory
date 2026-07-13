# Memory

Scaffolds and configuration for memory and vector-storage backends.

## Sub-sections

| Directory | Backend | Description |
|-----------|---------|-------------|
| [`supabase/`](./supabase/) | Supabase + pgvector | SQL schemas, migrations, and RPC helpers |
| [`chroma/`](./chroma/) | ChromaDB | Collection configs and client setup |
| [`zep/`](./zep/) | Zep | Memory server config and session scaffolds |

## Choosing a Backend

- **Supabase** — best when you need a full relational + vector layer with auth, row-level security, and hosted Postgres.
- **Chroma** — lightweight local/self-hosted vector store, great for rapid prototyping.
- **Zep** — purpose-built for LLM conversation memory with built-in session and user management.

Backends are independent; you can use one or several together.
