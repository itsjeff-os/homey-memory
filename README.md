# homey-memory

> A modular mono-repo corpus and scaffold for projects, memory systems, workflows, and architectural references.

---

## Table of Contents

| Section | Path | Description |
|---------|------|-------------|
| [**Intake**](#intake) | [`intake/`](./intake/) | **Start here** — drop anything, organise later |
| [Projects](#projects) | [`projects/`](./projects/) | Individual project roots |
| [Cloudflare Workers](#cloudflare-workers) | [`cloudflare-workers/`](./cloudflare-workers/) | Worker scripts, bindings, and configs |
| [Memory](#memory) | [`memory/`](./memory/) | Vector store and memory backend scaffolds |
| [Architecture](#architecture) | [`architecture/`](./architecture/) | References, schemas, handoffs, and history |
| [Home Assistant](#home-assistant) | [`home-assistant/`](./home-assistant/) | HA corpus, configs, and automations |
| [Chunking](#chunking) | [`chunking/`](./chunking/) | Chunking strategies and utilities |
| [Scripts](#scripts) | [`scripts/`](./scripts/) | Standalone utility and automation scripts |
| [Workflows](#workflows) | [`workflows/`](./workflows/) | n8n JSON exports and IFTTT applets |
| [Corpus](#corpus) | [`corpus/`](./corpus/) | Retrieval corpus and source documents |
| [Codex](#codex) | [`codex/`](./codex/) | Codex builds and prompt libraries |
| [Packages](#packages) | [`packages/`](./packages/) | Shared/reusable packages |
| [Docs](#docs) | [`docs/`](./docs/) | Loose markdown files, notes, and references |

---

## Sections

### Intake
[`intake/`](./intake/) — **The landing zone.** Drop content here first, organise later. Separates capture from categorisation so nothing gets lost.
- [`intake/queue/`](./intake/queue/) — Raw intake: anything new goes here, no rules
- [`intake/processing/`](./intake/processing/) — Being triaged, tagged, or cleaned up
- [`intake/unsorted/`](./intake/unsorted/) — Reviewed but no clear destination yet

### Projects
[`projects/`](./projects/) — Top-level project folders. Each sub-directory is a self-contained project with its own README and build artifacts.

### Cloudflare Workers
[`cloudflare-workers/`](./cloudflare-workers/) — Cloudflare Worker scripts, `wrangler.toml` configs, KV/D1/R2 bindings, and deployment notes.

### Memory
[`memory/`](./memory/) — Backend scaffolds for memory and vector storage:
- [`memory/supabase/`](./memory/supabase/) — Supabase schemas, migrations, and helpers
- [`memory/chroma/`](./memory/chroma/) — ChromaDB collections and client config
- [`memory/zep/`](./memory/zep/) — Zep memory server config and session scaffolds

### Architecture
[`architecture/`](./architecture/) — System design and architectural artefacts:
- [`architecture/references/`](./architecture/references/) — External papers, links, and reference material
- [`architecture/history/`](./architecture/history/) — Versioned architectural decision records (ADRs) and design history
- [`architecture/schemas/`](./architecture/schemas/) — JSON Schema, OpenAPI, and data model definitions
- [`architecture/handoffs/`](./architecture/handoffs/) — Context handoff documents and inter-system contracts

### Home Assistant
[`home-assistant/`](./home-assistant/) — Home Assistant integration material:
- [`home-assistant/corpus/`](./home-assistant/corpus/) — HA entity corpus and domain references
- [`home-assistant/automations/`](./home-assistant/automations/) — YAML automations, scripts, and blueprints

### Chunking
[`chunking/`](./chunking/) — Text chunking strategies for RAG pipelines:
- [`chunking/strategies/`](./chunking/strategies/) — Named strategy implementations and configuration files

### Scripts
[`scripts/`](./scripts/) — Standalone utility scripts (shell, Python, JS) for ingestion, migration, and automation tasks.

### Workflows
[`workflows/`](./workflows/) — Visual and low-code workflow definitions:
- [`workflows/n8n/`](./workflows/n8n/) — n8n workflow JSON exports
- [`workflows/ifttt/`](./workflows/ifttt/) — IFTTT applet definitions and webhook configs

### Corpus
[`corpus/`](./corpus/) — The retrieval corpus and raw source material:
- [`corpus/retrieval/`](./corpus/retrieval/) — Processed, chunked, and indexed documents ready for retrieval
- [`corpus/source-docs/`](./corpus/source-docs/) — Raw source documents (.md, .pdf, .txt) before processing

### Codex
[`codex/`](./codex/) — Codex and LLM prompt engineering:
- [`codex/builds/`](./codex/builds/) — Versioned prompt builds, system messages, and agent configs

### Packages
[`packages/`](./packages/) — Reusable shared packages/libraries used across projects in this repo.

### Docs
[`docs/`](./docs/) — Loose markdown files, general notes, meeting notes, and reference links that don't belong elsewhere.

---

## Conventions

- Every directory contains a `README.md` describing its contents and purpose.
- Placeholder directories use a `.gitkeep` file until real content is added.
- Prefer one concern per directory — if a folder grows beyond its original scope, split it.
- File naming: `kebab-case` for directories and files; `UPPER_CASE.md` for top-level section READMEs is acceptable but not required.

---

## Getting Started

Clone the repo and navigate to the section you need:

```bash
git clone https://github.com/itsjeff-os/homey-memory.git
cd homey-memory
```

Each section is independently usable. See the section README for setup instructions specific to that area.

## Tooling & CI/CD

Code (as opposed to content/data) lives in a [pnpm](https://pnpm.io) workspace
managed with [Turborepo](https://turbo.build) for parallel, cached
lint/typecheck/test runs. See [`CONTRIBUTING.md`](./CONTRIBUTING.md) for the
module boundaries and local workflow.

```bash
pnpm install
pnpm turbo run lint typecheck test
```

GitHub Actions (`.github/workflows/`) runs CI, CodeQL, dependency review, and
a repo-structure convention check on every push/PR.
