# Codex — Builds

Versioned prompt builds, system messages, and agent configuration files.

## Structure

```
builds/
└── v<N>/
    ├── README.md              # What changed and why
    ├── system-message.md      # System prompt / agent instructions
    ├── tools.json             # Tool/function definitions (OpenAI format)
    └── config.json            # Model, temperature, and other parameters
```

## Versioning

- Increment the version directory (`v1/`, `v2/`, ...) for each significant prompt revision.
- Document changes in the `README.md` inside the version directory.
- Keep older versions — they serve as a history of what was tried.
