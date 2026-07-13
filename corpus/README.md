# Corpus

The retrieval corpus and raw source material for RAG pipelines.

## Sub-sections

| Directory | Description |
|-----------|-------------|
| [`source-docs/`](./source-docs/) | Raw source documents before processing |
| [`retrieval/`](./retrieval/) | Processed, chunked, and indexed documents ready for retrieval |

## Pipeline Overview

```
source-docs/ ──[ingest]──▶ chunking/ ──[embed]──▶ retrieval/
                                                        │
                                                   memory/ (vector store)
```

1. Add raw documents to `source-docs/`.
2. Run the appropriate chunking strategy from [`../chunking/`](../chunking/).
3. Embed and index chunks — outputs land in `retrieval/` or are pushed to a vector store in [`../memory/`](../memory/).
