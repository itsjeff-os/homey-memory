# Projects

Individual top-level project roots. Each sub-directory should be a self-contained project.

## Structure

```
projects/
└── <project-name>/
    ├── README.md      # Project overview, setup, and usage
    └── ...            # Project files
```

## Conventions

- One directory per project.
- Each project directory must contain its own `README.md`.
- Projects may reference shared packages from [`../packages/`](../packages/).
