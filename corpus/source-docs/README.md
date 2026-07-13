# Corpus — Source Documents

Raw, unprocessed source documents (.md, .txt, .pdf, .html, etc.) before ingestion.

## Structure

```
source-docs/
├── <topic-or-source>/     # Grouped by origin or subject
│   └── *.md / *.txt / *.pdf
└── *.md                   # Standalone documents
```

## Conventions

- Keep files in their original format — do not modify source material.
- Use sub-directories to group documents by topic, project, or source system.
- Large binary files (PDFs, images) should be tracked with Git LFS if the repo is configured for it.
