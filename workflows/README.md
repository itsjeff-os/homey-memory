# Workflows

Visual and low-code workflow definitions for automation platforms.

## Sub-sections

| Directory | Platform | Description |
|-----------|----------|-------------|
| [`n8n/`](./n8n/) | n8n | JSON workflow exports |
| [`ifttt/`](./ifttt/) | IFTTT | Applet definitions and webhook configs |

## Conventions

- Each workflow lives in a descriptively named subdirectory with the platform-specific export/config files documented in that subsection.
- Breaking changes create a new versioned workflow directory rather than overwriting the previous export.
- Credentials and API keys are never stored here — use environment variables or the platform's secret manager.
