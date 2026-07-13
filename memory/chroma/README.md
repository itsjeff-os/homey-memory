# Memory — ChromaDB

ChromaDB collection configuration and client setup.

## Contents

```
chroma/
├── collections/       # Collection definition files (JSON)
└── client/            # Client initialisation helpers
```

## Setup

```bash
pip install chromadb
```

Run a local Chroma server:

```bash
chroma run --path ./data
```

Or use the in-process client for lightweight use:

```python
import chromadb
client = chromadb.Client()
```

## Environment Variables

```
CHROMA_HOST=localhost
CHROMA_PORT=8000
```
