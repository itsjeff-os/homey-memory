# Contributing

This repository is a modular mono-repo. It mixes **content** (corpus, docs,
architecture notes, exported workflows) with **code** (packages, scripts,
Cloudflare Workers). Keeping the two separated is what makes automation,
linting, and CI/CD tractable — please follow these conventions.

## Module boundaries

| Location | What belongs here | Part of the pnpm workspace? |
|---|---|---|
| `packages/` | Shared, reusable TypeScript/JS libraries consumed by other packages or workers. Each package has its own `package.json`, `tsconfig.json`, tests, and README. | Yes |
| `chunking/<name>/` | Standalone domain tools with their own `package.json` (e.g. `chunking/homeassistant-chunking`). | Yes |
| `cloudflare-workers/<name>/` | One directory per deployable Worker, with its own `package.json` and `wrangler.toml`. | Yes |
| `scripts/` | Small standalone utility scripts (shell/Python/Node) not large enough to warrant their own package. | No |
| `intake/`, `corpus/`, `architecture/`, `docs/`, `home-assistant/`, `memory/`, `codex/`, `workflows/`, `projects/` | Data, notes, references, and low-code exports. No build/lint/test tooling runs against these — see `.prettierignore` and `eslint.config.mjs` ignores. | No |

When in doubt: if it has runnable code with dependencies, it should be a
workspace package with its own `package.json`. If it's markdown, JSON/CSV
exports, or reference material, it stays a plain content directory.

## Adding a new package

1. Create the directory under `packages/` (or `chunking/`, `cloudflare-workers/`
   for domain-specific tooling) with a `package.json` (`name`, `version`,
   `private: true` unless it's meant to be published).
2. Add a `tsconfig.json` that extends the root `tsconfig.base.json`.
3. Implement `lint`, `typecheck`, and (where practical) `test` npm scripts —
   these are the scripts Turborepo and CI invoke.
4. Add a `README.md` describing the package's purpose, following the existing
   convention of one README per directory.
5. Run `pnpm install` from the repo root to register it in the workspace.

## Local workflow

```bash
pnpm install                 # install all workspace dependencies
pnpm turbo run lint          # lint every package, in parallel, cached
pnpm turbo run typecheck     # typecheck every package, in parallel, cached
pnpm turbo run test          # test every package, in parallel, cached
pnpm format                  # format code with Prettier
pnpm validate-structure      # check README/`.gitkeep` conventions
```

Turborepo parallelises and caches these tasks across workspace packages, so
CI (and local runs) only redo work for packages that actually changed.

## Conventions (see also the root README)

- Every content directory contains a `README.md`.
- Placeholder directories use a `.gitkeep` file *only* until real content is
  added — remove the `.gitkeep` once the directory has real files.
- File naming: `kebab-case` for directories and files.
- Don't commit secrets. Use `.env.example` to document required environment
  variables without real values.

## Known gaps / follow-up work

- `chunking/homeassistant-chunking`'s `chunk:test` script depends on personal,
  non-committed Home Assistant export data, so it isn't run in CI yet. Adding
  small, committed fixture files and a proper `test` script (e.g. with Vitest)
  is good first follow-up work.
- `cloudflare-workers/` and `packages/` are currently empty scaffolds; once a
  real Worker or package is added, extend `.github/workflows/ci.yml` with a
  path-filtered `deploy.yml` (using `wrangler-action`) and consider Changesets
  for independent package versioning/releases.
