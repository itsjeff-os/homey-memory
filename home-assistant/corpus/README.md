# Home Assistant — Corpus

Entity definitions, domain references, and integration notes that form the HA knowledge corpus.

## Structure

```
corpus/
├── domains/           # Per-domain entity and service references (e.g. light.md, switch.md)
├── integrations/      # Notes and configs for specific HA integrations
└── entities/          # Entity ID lists and attribute maps
```

## Purpose

This corpus is used to ground LLM responses and automations in accurate, up-to-date Home Assistant entity and service definitions.
