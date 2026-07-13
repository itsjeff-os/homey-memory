# Architecture

System design artefacts, decision records, schemas, and handoff documents.

## Sub-sections

| Directory | Description |
|-----------|-------------|
| [`references/`](./references/) | External papers, diagrams, and reference material |
| [`history/`](./history/) | Architectural Decision Records (ADRs) and design history |
| [`schemas/`](./schemas/) | JSON Schema, OpenAPI specs, and data model definitions |
| [`handoffs/`](./handoffs/) | Context handoff documents and inter-system contracts |

## Conventions

- ADRs in `history/` follow the format `NNNN-<short-title>.md` (e.g. `0001-use-pgvector.md`).
- Schemas in `schemas/` are versioned in their filename or a `version` field.
- Handoff documents capture the current state of a subsystem at a point in time to enable context recovery.
