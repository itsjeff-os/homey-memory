# Workflows — IFTTT

IFTTT applet definitions, webhook configurations, and trigger/action documentation.

## Structure

```
ifttt/
└── <applet-name>/
    ├── README.md          # Applet description, trigger, and action details
    └── config.md          # Webhook URLs, field mappings, and setup notes
```

## Conventions

- Document the **trigger service**, **trigger event**, **action service**, and **action event** in each README.
- Webhook URLs are documented with placeholder values — replace with real values in your IFTTT dashboard.
- IFTTT Pro features (multi-action, queries) are noted where used.
