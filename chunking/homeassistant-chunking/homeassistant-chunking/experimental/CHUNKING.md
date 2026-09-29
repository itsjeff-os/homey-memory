# HomeAssistant Chunking

This folder is currently the active Home Assistant corpus. The chunking flow is intentionally local-first:

1. Read curated inputs already inside `homeassistant/`.
2. Parse and normalize them with the TypeScript chunkers in `src/pkg/`.
3. Write generated JSON under `generated/chunks/`.
4. Review the manifest before any Chroma upsert work.

No live Home Assistant config is changed by these scripts.

## Commands

Run from this directory:

```bash
npm run chunk:test
npm run chunk:dry
npm run chunk:manifest
npm run chunk:validate
```

Or from the build pack root:

```bash
npm --prefix homeassistant run chunk:test
npm --prefix homeassistant run chunk:dry
npm --prefix homeassistant run chunk:manifest
```

## Outputs

- `generated/chunks/homeassistant_chunks.json`
- `generated/chunks/homeassistant_manifest.json`

The manifest includes included/skipped files, chunk counts, collection counts, parse warnings/errors, duplicate IDs, redaction warnings, and a comparison against the legacy `ha_chunks.json` output.

It also includes a consistency report for text-length spread, object type counts, chunk-kind counts, and missing required fields.

## Collections

- `home_ha_automations`: automations, scripts, scenes, blueprints, blueprint inputs
- `home_ha_reference`: helpers, groups, templates, entity/reference YAML
- `home_registry`: room, zone, infrastructure, and device chunks from `home_registry.json`
- `home_system_docs`: selected Markdown and text context docs

Blueprints are split into compact overview chunks, behavior chunks, and individual input chunks. Markdown docs are merged away from heading-only fragments, and JSON-shaped text docs are chunked structurally rather than by arbitrary character windows.

## Current Include Rules

Included:

- `ha_cleaned_yaml/**/*.yaml`
- `ceiling_daily_rhythm_presence.yaml`
- `ha_historical_context/*.yaml`
- `home_registry.json`
- selected `.md` and `.txt` docs in this folder

Skipped by default:

- `node_modules/`, `path/`, `logs/`, `generated/`
- `.DS_Store`, zips, images, PDFs, RTFs
- nested duplicate export files under `ha_cleaned_yaml/ha_cleaned_yaml/`

## Chroma Gate

Chroma upsert should wait until `npm run chunk:manifest` or `npm run chunk:validate` reports:

- zero fatal parse errors
- zero duplicate IDs
- zero redaction warnings
