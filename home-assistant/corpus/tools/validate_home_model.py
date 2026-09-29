#!/usr/bin/env python3
"""Validate SHIP home_model.json for basic consistency.

This script is intentionally lightweight (no external deps).
"""

import json
import sys
from pathlib import Path

def fail(msg: str) -> None:
    print(f"ERROR: {msg}")
    sys.exit(1)

def warn(msg: str) -> None:
    print(f"WARNING: {msg}")

def main() -> None:
    path = Path(__file__).resolve().parents[1] / "canonical" / "home_model.json"
    if len(sys.argv) > 1:
        path = Path(sys.argv[1])

    if not path.exists():
        fail(f"File not found: {path}")

    data = json.loads(path.read_text())

    rooms = data.get("rooms", [])
    zones = data.get("zones", [])
    infra = data.get("infrastructure", [])
    devices = data.get("devices", [])
    actuators = data.get("actuators", [])

    room_ids = [r.get("id") for r in rooms]
    zone_ids = [z.get("id") for z in zones]

    if None in room_ids:
        fail("One or more rooms missing 'id'")
    if None in zone_ids:
        fail("One or more zones missing 'id'")

    if len(set(room_ids)) != len(room_ids):
        dupes = {i for i in room_ids if room_ids.count(i) > 1}
        fail(f"Duplicate room ids: {sorted(dupes)}")

    if len(set(zone_ids)) != len(zone_ids):
        dupes = {i for i in zone_ids if zone_ids.count(i) > 1}
        fail(f"Duplicate zone ids: {sorted(dupes)}")

    # Validate zone.room_ids references
    for z in zones:
        for rid in z.get("room_ids", []):
            if rid not in room_ids:
                fail(f"Zone {z['id']} references missing room_id: {rid}")

    # Validate room.zones references (if present)
    for r in rooms:
        for zid in r.get("zones", []):
            if zid not in zone_ids:
                warn(f"Room {r['id']} references zone id not found in zones list: {zid}")

    # Validate neighbor graph
    neighbors = (data.get("relationships") or {}).get("neighbors") or {}
    for rid, nbs in neighbors.items():
        if rid not in room_ids:
            warn(f"Neighbor graph includes unknown room id: {rid}")
        for nb in nbs:
            if nb not in room_ids:
                warn(f"Neighbor graph: {rid} references unknown neighbor room id: {nb}")

    print("OK: basic validation passed")
    print(f"Rooms: {len(rooms)} | Zones: {len(zones)} | Infra: {len(infra)} | Devices: {len(devices)} | Actuators: {len(actuators)}")

if __name__ == "__main__":
    main()
