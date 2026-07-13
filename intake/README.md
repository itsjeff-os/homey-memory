# Intake

> **The landing zone.** Drop anything here first — organise it later.

Intake removes the friction of adding new content to the repo. Instead of deciding upfront where something belongs, place it here and triage it when you're ready.

---

## How It Works

```
New content arrives
       │
       ▼
  intake/queue/          ← Drop it here. No rules, no structure required.
       │
       ▼  (triage)
  intake/processing/     ← Being reviewed, tagged, or cleaned up.
       │
       ▼  (filed)
  Final destination      ← Moved to the appropriate top-level section.
```

### Unsorted

`intake/unsorted/` is for items that have been looked at but don't yet have a clear home. They stay here until a section is created or a decision is made.

---

## Sub-directories

| Directory | Purpose |
|-----------|---------|
| [`queue/`](./queue/) | Raw intake — anything new goes here |
| [`processing/`](./processing/) | Currently being triaged, tagged, or cleaned up |
| [`unsorted/`](./unsorted/) | Reviewed but no clear destination yet |

---

## Conventions

1. **Anything goes in `queue/`.** Files, folders, links, screenshots, voice-memo transcripts, code snippets — whatever format.
2. **Name files descriptively** when possible, but don't let naming block you from adding something.
3. **Add a front-matter block** (optional but helpful) at the top of markdown files:
   ```markdown
   ---
   date: 2024-01-15
   source: chat / web / voice / manual
   tags: [memory, supabase, idea]
   destination: memory/supabase   # where you think it should end up
   ---
   ```
4. **Triage regularly.** Move items from `queue/` → `processing/` → final section.
5. **If unsure, leave it in `unsorted/`.** That's what it's for.

---

## Triage Checklist

When processing a queued item, ask:

- [ ] What section does this belong to? (memory, architecture, corpus, etc.)
- [ ] Does it need to be split into multiple files?
- [ ] Does it need metadata or front-matter added?
- [ ] Is it ready to be filed, or does it need more work?

Once answered, move it to the correct section or to `unsorted/` if no section fits yet.

---

## Why This Exists

Without an intake layer, every new piece of content requires:
- Knowing the repo structure
- Deciding on categorisation immediately
- Formatting and naming correctly

That friction means things don't get captured at all. The intake layer solves this by separating **capture** from **organisation**.
