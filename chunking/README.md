# Chunking

Text chunking strategies for RAG (Retrieval-Augmented Generation) pipelines.

## Sub-sections

| Directory | Description |
|-----------|-------------|
| [`strategies/`](./strategies/) | Named strategy implementations and configuration files |

## Overview

Chunking is the process of splitting source documents into segments before embedding and indexing. The right strategy depends on document type, embedding model, and retrieval requirements.

## Common Strategies

| Strategy | Best For |
|----------|----------|
| Fixed-size | Simple uniform content |
| Sentence | Narrative text |
| Paragraph | Structured documents |
| Semantic | Mixed or complex documents |
| Recursive | Nested structures (code, JSON) |
| Sliding window | Overlapping context preservation |

See [`strategies/`](./strategies/) for implementations and configuration examples.
