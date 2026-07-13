# Scripts

Standalone utility and automation scripts.

## Structure

```
scripts/
├── ingestion/         # Document ingestion and processing scripts
├── migration/         # Data migration helpers
├── sync/              # Sync/export utilities
└── utils/             # General-purpose utilities
```

## Conventions

- Scripts are self-contained and runnable from their directory.
- Each script or group includes a header comment explaining usage.
- Prefer named arguments over positional ones for clarity.
- Shell scripts use `#!/usr/bin/env bash` and `set -euo pipefail`.
- Python scripts target Python 3.10+.
