# Architecture — Handoffs

Context handoff documents and inter-system contracts.

## Purpose

Handoff documents capture the current state of a subsystem, component, or integration at a specific point in time. They allow a new contributor (or an LLM session) to quickly understand what exists, what decisions were made, and what the next steps are.

## Structure

```
handoffs/
└── <YYYY-MM-DD>-<component>.md
```

## Handoff Template

```markdown
# Handoff — <Component> — <Date>

## Overview
Brief description of the component.

## Current State
What exists right now and what works.

## Known Issues / TODOs
Outstanding issues and planned next steps.

## Key Files
List of the most important files and their purpose.

## Dependencies
External services and internal modules this component relies on.
```
