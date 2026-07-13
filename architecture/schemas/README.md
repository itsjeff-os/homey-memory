# Architecture — Schemas

Data model definitions, JSON Schemas, and OpenAPI specifications.

## Structure

```
schemas/
├── openapi/           # OpenAPI (YAML/JSON) specs
├── json-schema/       # JSON Schema definitions
└── models/            # Entity/domain model diagrams and descriptions
```

## Conventions

- OpenAPI files follow `<service>-v<N>.yaml` naming.
- JSON Schema files include a `$schema` declaration and a `version` field.
- Breaking changes increment the version number; non-breaking changes use a patch suffix.
