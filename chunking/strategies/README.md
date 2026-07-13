# Chunking — Strategies

Named chunking strategy implementations and configuration files.

## Structure

```
strategies/
├── fixed-size/        # Token or character count based splitting
├── sentence/          # Sentence boundary splitting
├── paragraph/         # Paragraph boundary splitting
├── semantic/          # Embedding-similarity based splitting
├── recursive/         # Recursive character/structure splitting
└── sliding-window/    # Overlapping chunk windows
```

## Adding a Strategy

Each strategy directory should contain:
- `README.md` — description, parameters, and use cases
- Implementation file(s) or configuration
- Example input/output pair
