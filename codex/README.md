# Codex

Codex builds, prompt libraries, and LLM agent configurations.

## Sub-sections

| Directory | Description |
|-----------|-------------|
| [`builds/`](./builds/) | Versioned prompt builds, system messages, and agent configs |

## Overview

This section stores the "software" layer of the intelligence stack — the carefully crafted prompts, agent instructions, and configuration files that control how LLMs behave in this system.

## Conventions

- Treat prompts as code: version them, review changes, and document the reasoning behind key decisions.
- Each build in `builds/` has a version identifier and a changelog entry.
- System messages and user-facing prompt templates are stored separately.
