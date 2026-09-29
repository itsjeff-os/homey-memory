#!/usr/bin/env python3
"""Split a home_registry.json into sectioned JSON files.

Usage:
    ./split_home_registry.py [path/to/home_registry.json] [output_dir]

Defaults:
    source/home_registry.json -> canonical/sections/
"""

import json
import sys
from pathlib import Path

def main() -> None:
    root = Path(__file__).resolve().parents[1]
    src = root / "source" / "home_registry.json"
    out = root / "canonical" / "sections"

    if len(sys.argv) > 1:
        src = Path(sys.argv[1])
    if len(sys.argv) > 2:
        out = Path(sys.argv[2])

    out.mkdir(parents=True, exist_ok=True)

    data = json.loads(src.read_text())

    keys = ["meta", "rooms", "zones", "infrastructure", "devices", "actuators"]
    for k in keys:
        (out / f"{k}.json").write_text(json.dumps(data.get(k, {} if k == "meta" else []), indent=2))

    print(f"OK: wrote sections to {out}")

if __name__ == "__main__":
    main()
