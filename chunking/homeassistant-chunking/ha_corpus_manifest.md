# HA Corpus — Manifest

Companion file to `ha_corpus.md`. Documents what was searched, what was included, what was excluded and why.

## Scope of the search

Folders granted access on this machine: `~/Documents`, `~/Desktop`, `~/Downloads`. (`~/homeassistant`, `~/.homeassistant`, `~/ha`, `~/config` do not exist as top-level home-directory folders on this machine — they were checked and are not present.) `~/Desktop` contained no matching files.

Search covered filenames `configuration.yaml`, `automations.yaml`/`.json`, `scripts.yaml`, `scenes.yaml`, `secrets.yaml`, `customize.yaml`, `groups.yaml`, `blueprints/automation/*.yaml`, plus a broad scan of any directory with "homeassistant"/"home_assistant" in its path, and any `.storage` directories (none found).

**No `secrets.yaml` exists anywhere on the machine.**

## Result: 92 files included in `ha_corpus.md`

- 49 files from `~/Documents` (three sub-locations: `Documents - Macbook-M3/homeassistant/`, `Documents - Macbook-M3/Dev_Project/02_Home/Property/`, `Documents - Macbook-M3/home_context_2_0_scaffold/`, plus one `automations.json`)
- 43 files from `~/Downloads/10_Archive/Duplicated-Pending Deletion/` (a rich HA export/backup archive: entity/device registry exports, Node-RED flows, Hue-control app, N8N automation-writer workflows, inventory docs, Notion exports)

Corpus file size: ~928 KB, 21,968 lines, ~92 source-file sections.

## Duplication found and handled

The source folders contain heavy recursive backup duplication — most notably:
- `Documents - Macbook-M3/Dev_Project/00_Inbox/00_Inbox copy/...` — a nested, self-referential copy of large parts of `Dev_Project`
- `.../agentic_tier3_kit 2/` appearing in at least 3 separate locations with identical content
- `Downloads/10_Archive/Duplicated-Pending Deletion/` — an archive folder whose name indicates the user already flagged it as pending cleanup

A content-hash pass on the `~/Downloads` copies found **419 candidate HA-related file paths collapsing to just 45 distinct byte-identical contents** (one file, `Rooms.md`, existed at 287 different nested paths due to the recursive backup structure). Only one representative copy of each unique file was included in the corpus; all duplicate paths were dropped to keep the corpus clean for chunking/embedding.

For `~/Documents`, the same recursive duplication pattern was present (e.g. `ha_cleaned_yaml/blueprints/automation/*.yaml` also exists nested inside itself at `ha_cleaned_yaml/ha_cleaned_yaml/...`). These were excluded by hand, keeping only the top-level canonical copy, except for one file (`write_automation_and_reload.yaml`) that only existed in the nested location.

**Known remaining overlap:** the `blueprints/automation/*.yaml` files and `homeassistant_entity_reference.md` appear once under `~/Documents/.../homeassistant/ha_cleaned_yaml/` and again under `~/Downloads/.../agentic_tier3_kit 2/ha/`. These come from different top-level folders (Documents vs. Downloads) so were kept as separate entries rather than cross-deduplicated — content looked equivalent on inspection but this wasn't verified byte-for-byte, so a vector DB may see near-duplicate chunks from these two paths.

## Explicitly excluded (not in the corpus)

- `homeassistant/ha_scripts/_cleanup_archive_2026-05-17/` — an archived cleanup dump containing a full Python venv (site-packages, pip internals) and other non-HA runtime noise. Not HA config.
- `homeassistant/Full chat thread - Automation Writer HA.rtf` — a raw RTF chat transcript (~21 KB). Skipped in favor of the cleaner `.md` summary (`project_ship_full_thread_compilation.md`) which is included and covers the same material.
- `homeassistant/Rooms/Floorplans/*.png` and other images — not text, not embeddable as-is.
- `homeassistant/logs/*.log` — HA runtime log, not config.
- `Dev_Project/02_Home/Property/*.md` (a handful of Notion-export-named `.md` stubs living inside the Property folder — `home_assistant_system_README.md`, `conversation home_assistant ....md`, `tts home_assistant_cloud....md`, three `update home_assistant_*.md` files) — these share filenames with files already included from the `~/Downloads/.../Exports/sources/notion/` export and were almost certainly synced copies of the same Notion pages, so were skipped to avoid near-duplicate content. If you want them included anyway, say so and I'll add them.
- `TextEdit/openai_unified_actions.yaml` — checked, but it's an OpenAI Custom-GPT Actions schema unrelated to Home Assistant.
- `ha_scripts/hue_inventory_2026-05-13_23-24-57.json` — present but 0 bytes (empty file), so nothing to include.
- Roughly a dozen other N8N workflow JSON files under `Exports/infrastructure/N8N/` that don't reference Home Assistant (Zep, Supabase, generic "AI Agent" workflows, etc.) — out of scope.

## Secret / credential scan

Every included file was scanned for API keys, tokens, passwords, and private-key material before inclusion. Findings:
- Two README files reference "Secrets are loaded from the same 1Password Environment" — this is documentation about *where* secrets live, not a secret itself. Left as-is.
- One N8N workflow (`GPT_Home_Assistant_Delegation.json`) contained a header value `Bearer YOUR_LONG_LIVED_ACCESS_TOKEN` — a literal placeholder, not a real token. Redacted anyway to `Bearer [REDACTED_PLACEHOLDER_TOKEN]` out of caution.
- `devices.json` / `entities.json` / `integrations.json` contain long hex/ULID strings — these are Home Assistant's internal registry IDs (`unique_id`, `config_entry_id`), not credentials. Left as-is.
- No `secrets.yaml`, no live API keys, no passwords, no private keys were found anywhere in the included set.

## Per-file listing

See the `==== FILE: ... ====` headers inside `ha_corpus.md` for the full list of 92 included files with their last-modified timestamps — that list is the authoritative manifest of exactly what's in the corpus.
