#!/usr/bin/env python3
"""
Intake Triage — Automated file router for homey-memory.

Scans intake/queue/ for files, classifies them using front-matter metadata
and triage-rules.yaml, moves them to the correct section, and updates the
destination section's README with an entry for the new file.

Usage:
    python scripts/triage.py                  # triage all queued files
    python scripts/triage.py --dry-run        # preview without moving anything
    python scripts/triage.py --verbose        # show classification reasoning
    python scripts/triage.py --file FILE      # triage a single file

Requires: PyYAML (pip install pyyaml)
"""

from __future__ import annotations

import argparse
import datetime
import os
import re
import shutil
import sys
from pathlib import Path
from typing import Any

try:
    import yaml
except ImportError:
    print("ERROR: PyYAML is required. Install it with: pip install pyyaml", file=sys.stderr)
    sys.exit(1)

# ---------------------------------------------------------------------------
# Paths
# ---------------------------------------------------------------------------

REPO_ROOT = Path(__file__).resolve().parent.parent
QUEUE_DIR = REPO_ROOT / "intake" / "queue"
PROCESSING_DIR = REPO_ROOT / "intake" / "processing"
UNSORTED_DIR = REPO_ROOT / "intake" / "unsorted"
RULES_FILE = REPO_ROOT / "intake" / "triage-rules.yaml"

# ---------------------------------------------------------------------------
# Front-matter parsing
# ---------------------------------------------------------------------------

FRONT_MATTER_RE = re.compile(r"^---\s*\n(.*?)\n---\s*\n", re.DOTALL)


def parse_front_matter(text: str) -> dict[str, Any]:
    """Extract YAML front-matter from a markdown string."""
    match = FRONT_MATTER_RE.match(text)
    if not match:
        return {}
    try:
        fm = yaml.safe_load(match.group(1))
        return fm if isinstance(fm, dict) else {}
    except yaml.YAMLError:
        return {}


def strip_front_matter(text: str) -> str:
    """Return text with front-matter removed."""
    return FRONT_MATTER_RE.sub("", text, count=1)


# ---------------------------------------------------------------------------
# Rule loading and matching
# ---------------------------------------------------------------------------


def load_rules(path: Path) -> list[dict]:
    """Load triage rules from YAML."""
    if not path.exists():
        print(f"WARNING: Rules file not found at {path}. All files will go to unsorted.", file=sys.stderr)
        return []
    with open(path, "r", encoding="utf-8") as f:
        data = yaml.safe_load(f)
    return data.get("rules", []) if data else []


def classify(
    file_path: Path,
    front_matter: dict[str, Any],
    body: str,
    rules: list[dict],
) -> tuple[str, str]:
    """
    Determine the destination section for a file.

    Returns (section_path, reason).
    """
    # 1. Explicit destination in front-matter takes priority
    destination = front_matter.get("destination", "").strip()
    if destination:
        dest = destination.rstrip("/")
        target = REPO_ROOT / dest
        if target.is_dir():
            return dest, f"explicit front-matter destination: {dest}"
        # Destination doesn't exist — fall through to rules

    # 2. Tag and keyword matching
    file_tags = set()
    raw_tags = front_matter.get("tags", [])
    if isinstance(raw_tags, list):
        file_tags = {str(t).lower().strip() for t in raw_tags}

    filename_lower = file_path.name.lower()
    body_lower = body.lower()

    for rule in rules:
        section = rule.get("section", "")
        rule_tags = {str(t).lower() for t in rule.get("tags", [])}
        rule_keywords = [str(k).lower() for k in rule.get("keywords", [])]

        # Tag match
        if file_tags & rule_tags:
            matched = file_tags & rule_tags
            return section, f"tag match: {', '.join(sorted(matched))}"

        # Keyword match (filename or body)
        for kw in rule_keywords:
            if kw in filename_lower or kw in body_lower:
                return section, f"keyword match: '{kw}'"

    # 3. No match — unsorted
    return "intake/unsorted", "no matching rules"


# ---------------------------------------------------------------------------
# README update
# ---------------------------------------------------------------------------


def update_section_readme(section_dir: Path, file_name: str, front_matter: dict[str, Any]) -> None:
    """Append a new-file entry to the section's README."""
    readme = section_dir / "README.md"
    if not readme.exists():
        return

    date_str = front_matter.get("date", datetime.date.today().isoformat())
    tags = front_matter.get("tags", [])
    tag_str = ", ".join(str(t) for t in tags) if tags else ""
    source = front_matter.get("source", "")

    entry_parts = [f"- [`{file_name}`](./{file_name})"]
    meta_parts = []
    if date_str:
        meta_parts.append(str(date_str))
    if source:
        meta_parts.append(f"source: {source}")
    if tag_str:
        meta_parts.append(f"tags: {tag_str}")
    if meta_parts:
        entry_parts.append(f" — {'; '.join(meta_parts)}")

    entry = "".join(entry_parts) + "\n"

    content = readme.read_text(encoding="utf-8")

    # Append under a "## Filed Items" heading, creating it if needed
    heading = "## Filed Items"
    if heading in content:
        # Insert after the heading line
        content = content.replace(heading, f"{heading}\n{entry}", 1)
    else:
        content = content.rstrip("\n") + f"\n\n{heading}\n{entry}"

    readme.write_text(content, encoding="utf-8")


# ---------------------------------------------------------------------------
# Triage pipeline
# ---------------------------------------------------------------------------


def triage_file(
    file_path: Path,
    rules: list[dict],
    dry_run: bool = False,
    verbose: bool = False,
) -> tuple[str, str, str]:
    """
    Triage a single file from the queue.

    Returns (filename, destination, reason).
    """
    # Read content (text files only; binary files get minimal classification)
    try:
        text = file_path.read_text(encoding="utf-8")
    except (UnicodeDecodeError, OSError):
        text = ""

    front_matter = parse_front_matter(text)
    body = strip_front_matter(text)

    section, reason = classify(file_path, front_matter, body, rules)
    dest_dir = REPO_ROOT / section

    if verbose:
        print(f"  {file_path.name} → {section} ({reason})")

    if dry_run:
        return file_path.name, section, reason

    # Ensure destination exists
    dest_dir.mkdir(parents=True, exist_ok=True)

    # Move file (via processing)
    processing_path = PROCESSING_DIR / file_path.name
    final_path = dest_dir / file_path.name

    # Handle name collisions
    if final_path.exists():
        stem = final_path.stem
        suffix = final_path.suffix
        counter = 1
        while final_path.exists():
            final_path = dest_dir / f"{stem}-{counter}{suffix}"
            counter += 1

    shutil.move(str(file_path), str(processing_path))
    shutil.move(str(processing_path), str(final_path))

    # Update destination README
    if section != "intake/unsorted":
        update_section_readme(dest_dir, final_path.name, front_matter)

    return final_path.name, section, reason


def triage_queue(
    dry_run: bool = False,
    verbose: bool = False,
    single_file: str | None = None,
) -> list[tuple[str, str, str]]:
    """Triage all files in the queue (or a single specified file)."""
    rules = load_rules(RULES_FILE)
    results: list[tuple[str, str, str]] = []

    if single_file:
        file_path = Path(single_file)
        if not file_path.is_absolute():
            file_path = QUEUE_DIR / file_path
        if not file_path.exists():
            print(f"ERROR: File not found: {file_path}", file=sys.stderr)
            sys.exit(1)
        files = [file_path]
    else:
        files = sorted(
            p for p in QUEUE_DIR.iterdir()
            if p.is_file() and p.name not in ("README.md", ".gitkeep")
        )

    if not files:
        print("Nothing in the queue.")
        return results

    print(f"{'[DRY RUN] ' if dry_run else ''}Triaging {len(files)} file(s)...\n")

    for file_path in files:
        name, section, reason = triage_file(file_path, rules, dry_run, verbose)
        results.append((name, section, reason))

    # Summary table
    print(f"\n{'─' * 60}")
    print(f"{'File':<30} {'Destination':<25} {'Reason'}")
    print(f"{'─' * 60}")
    for name, section, reason in results:
        print(f"{name:<30} {section:<25} {reason}")
    print(f"{'─' * 60}")
    print(f"\n{'[DRY RUN] No files were moved.' if dry_run else f'{len(results)} file(s) triaged.'}")

    return results


# ---------------------------------------------------------------------------
# CLI
# ---------------------------------------------------------------------------


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Triage files from intake/queue into the correct repo sections."
    )
    parser.add_argument("--dry-run", action="store_true", help="Preview without moving files")
    parser.add_argument("--verbose", action="store_true", help="Show classification reasoning")
    parser.add_argument("--file", type=str, default=None, help="Triage a single file")
    args = parser.parse_args()

    triage_queue(dry_run=args.dry_run, verbose=args.verbose, single_file=args.file)


if __name__ == "__main__":
    main()
