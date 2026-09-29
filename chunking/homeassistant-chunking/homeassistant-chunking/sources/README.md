# Sources

Canonical source material for ingestion. Files here are staging inputs for the
reasoning-agent knowledge substrates, not live Home Assistant configuration.

## Layout

- `home_assistant/raw/` stores untouched exports, snapshots, and examples.
- `home_assistant/canonical/` stores cleaned Home Assistant packages, scripts,
  helpers, blueprints, and migration-ready examples.
- `home_system/` stores system docs for rooms, devices, network, compute,
  runtime setup, rituals, and archived Notion exports.

Live Home Assistant deployment remains deferred until config validation and
behavior comparison pass.
