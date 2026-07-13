# Scripts

Standalone utility and automation scripts.

## Available Scripts

| Script | Description |
|--------|-------------|
| [`triage.py`](./triage.py) | Automated intake triage — routes files from `intake/queue/` to the correct section |

### triage.py

Routes queued files to the correct repo section using front-matter metadata and keyword rules defined in [`intake/triage-rules.yaml`](../intake/triage-rules.yaml). Also appends a "Filed Items" entry to the destination section's README.

```bash
python scripts/triage.py                  # triage all queued files
python scripts/triage.py --dry-run        # preview without moving anything
python scripts/triage.py --verbose        # show classification reasoning
python scripts/triage.py --file FILE      # triage a single file
```

**Requires:** Python 3.10+, PyYAML (`pip install pyyaml`)

## Structure

```
scripts/
├── triage.py          # Intake triage automation
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
