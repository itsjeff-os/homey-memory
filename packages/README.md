# Packages

Shared, reusable packages and libraries used across projects in this mono-repo.

## Structure

```
packages/
└── <package-name>/
    ├── README.md              # Package overview, API, and usage
    ├── package.json           # (if JS/TS) or pyproject.toml / setup.cfg (if Python)
    └── src/
        └── index.ts / __init__.py
```

## Conventions

- Each package is independently importable and has its own versioning.
- Packages should have no circular dependencies.
- Internal packages reference each other using workspace paths (e.g. `workspace:*` for npm workspaces).
- Public API surface is documented in the package `README.md`.
