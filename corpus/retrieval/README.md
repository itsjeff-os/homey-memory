# Corpus — Retrieval

Processed, chunked, and indexed documents ready for retrieval.

## Structure

```
retrieval/
├── <source-name>/         # Mirrors source-docs/ structure
│   └── chunks/            # Individual chunk files (JSON or plain text)
└── manifests/             # Index manifests mapping chunks to source files
```

## Conventions

- Each chunk file is named `<source-file>-chunk-<N>.json`.
- Chunk JSON includes: `id`, `source`, `chunk_index`, `text`, `metadata`.
- Manifests track which chunks belong to which source document and their embedding status.
- Do not commit raw embedding vectors here — store them in the vector backends under [`../../memory/`](../../memory/).
