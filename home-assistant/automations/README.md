# Home Assistant — Automations

YAML automations, scripts, scenes, and blueprints.

## Structure

```
automations/
├── automations/       # automation: YAML blocks
├── scripts/           # script: YAML blocks
├── scenes/            # scene: YAML blocks
└── blueprints/        # Blueprint YAML files
```

## Conventions

- Each file covers a single logical automation or script.
- File naming: `<area>-<action>.yaml` (e.g. `living-room-lights-off.yaml`).
- Blueprints include a `blueprint:` block at the top with `domain`, `name`, and `description`.
