# Workflows

Visual and low-code workflow definitions for automation platforms.

## Sub-sections

| Directory | Platform | Description |
|-----------|----------|-------------|
| [`n8n/`](./n8n/) | n8n | JSON workflow exports |
| [`ifttt/`](./ifttt/) | IFTTT | Applet definitions and webhook configs |

## Conventions

- Each workflow file is named descriptively: `<purpose>-<version>.json` or `<purpose>.md`.
- Breaking changes to a workflow create a new versioned file rather than overwriting the old one.
- Credentials and API keys are never stored here — use environment variables or the platform's secret manager.
