# Workflows — n8n

n8n workflow JSON exports.

## Structure

```
n8n/
└── <workflow-name>/
    ├── README.md          # Workflow purpose, trigger, and node overview
    └── workflow.json      # n8n exported workflow definition
```

## Importing a Workflow

1. Open your n8n instance.
2. Go to **Workflows → Import from File**.
3. Select the `workflow.json` file.
4. Update any credential references to match your environment.

## Exporting a Workflow

1. Open the workflow in n8n.
2. Go to **⋮ → Download**.
3. Save the file as `workflow.json` in the appropriate sub-directory.
4. Add or update the `README.md` with a description of changes.
