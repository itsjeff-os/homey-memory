# Home Assistant Migration Stages

## Stage 1: Index Without Moving Live Config

- Copy or export current Home Assistant YAML into `raw/`.
- Parse and classify it with the ingestion CLI.
- Upsert validated chunks into typed Chroma collections.
- Record parse warnings and unresolved package ownership.

## Stage 2: Canonicalize Packages

- Move only cleaned staging copies into `canonical/packages/`.
- Split helpers, scripts, blueprints, and automations by package domain.
- Preserve source provenance back to the raw snapshot.
- Keep AI action paths approval-only.

## Stage 3: Validate Home Assistant

- Run Home Assistant config validation against a staging config directory.
- Compare helpers, scripts, automations, entities, and service calls against
  the raw snapshot manifest.
- Fix drift before deployment.

## Stage 4: Deploy Deliberately

- Back up the live Home Assistant config.
- Apply one package domain at a time.
- Reload and verify behavior after each package.
- Do not grant autonomous actions before governance and approval gates exist.
