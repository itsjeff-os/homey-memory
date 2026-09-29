# Project SHIP — Full Thread Recap and Reusable Artefact Compilation

## Purpose
This document compiles the full thread arc into one reusable artefact.
It includes:
- chronological recap
- reusable drafts, models, rules, code sketches, file structures, routes
- proposed but unused items
- invalidated items
- final active interaction frame

## 1. Thread Arc — Chronological Reconstruction

### Phase 1 — Smart-home entry point
The thread began as a smart-home assistance conversation focused on renter constraints, existing devices, platforms, hubs, and room structure.

### Phase 2 — Architectural framing of the flat
A floorplan image and a home registry were introduced.
The flat was understood as a seven-room system:
- Open Plan / Core
- Bedroom 1 / Alpha
- Bedroom 2 / Beta
- Hallway / Pass
- Ensuite / Throne
- Secondary Bathroom / Splash
- Utility / Chaos

### Phase 3 — Automation philosophy and room-brain ideas
The conversation explored:
- presence-driven logic
- circadian lighting
- room-level state machines
- path lighting and night navigation
- room-brain architecture
- whole-home modes and context variables

### Phase 4 — Review of existing automation blueprints
Three SHIP blueprints were uploaded and reviewed:
1. SHIP • Follow‑Me Atmosphere (Ambient)
2. SHIP • Intelligent Presence Lighting v2
3. SHIP • Night Path (Hallway ↔ Bathroom)

### Phase 5 — Recognition of SHIP as a broader intelligence system
The discussion shifted from “smart home project” toward:
- system design
- modular automation framework thinking
- AI / agentic stack ideas
- SHIP as an ambient intelligence platform

SHIP was clarified as:
**Smart Home Intelligence Project**

### Phase 6 — Anchor and context bundle rehydration
A large project context bundle was loaded, including:
- SHIP_Anchor_v1.0.json
- SHIP_Anchor_v1.1.json
- home_registry.json
- homelab_overview.txt
- homelab_minimal_knowledge_base.json
- rooms_breakdown.json
- Floorplan - 2D Map.pdf
- smart_home_ai_automation_lab_notebook.md
- ship_devices_inventor.md
- Smart Home Summary.txt

### Phase 7 — Runtime spine and backend definition
The runtime spine stabilised as:

Custom GPT
↓
Responses API
↓
Backend Brain
↓
Home Assistant
↓
Flat

The backend was defined as the control layer between AI and Home Assistant.

### Phase 8 — Backend v0 architecture and scaffold
The discussion narrowed to the backend as the next concrete focus.
Outputs explored:
- SHIP Backend v0 architecture spec
- endpoint set
- module breakdown
- FastAPI-based scaffold
- Docker compose structure
- model indexing layer
- minimal deployment path on the homelab

A zip bundle was generated containing a starter backend scaffold.

### Phase 9 — Deployment workflow and homelab transfer
The conversation moved into practical deployment mechanics:
- scp
- ssh
- unzip
- SSH config aliases
- rsync-based dev workflow
- one-command deploy functions

### Phase 10 — Structural organisation discussion
The thread broadened into organisation:
- how to structure SHIP for Codex CLI
- how SHIP might sit inside a larger life-system structure
- tension between imposed taxonomy vs emergent structure
- attempts to map filesystem behaviour into a structural model

### Phase 11 — Epistemic rupture and correction
The user explicitly challenged:
- overreach
- behavioural inference
- reframing
- explanatory assertion beyond evidence
- defensive posture
- anthropomorphic language
- deviation from the system’s own stated priorities

This triggered a hard reset.

### Phase 12 — Final interaction state
The thread ended with an updated interaction frame, binding constraints, invalidated behaviour classes, and a request for this compiled recap artefact.

## 2. Reusable Artefacts and Drafts Explored

### 2.1 Canonical / project context artefacts
- SHIP_Anchor_v1.0.json
- SHIP_Anchor_v1.1.json
- home_registry.json
- homelab_overview.txt
- homelab_minimal_knowledge_base.json
- rooms_breakdown.json
- Floorplan - 2D Map.pdf
- smart_home_ai_automation_lab_notebook.md
- ship_devices_inventor.md
- Smart Home Summary.txt

### 2.2 Automation blueprints reviewed
1. SHIP • Follow‑Me Atmosphere (Ambient)
   - daypart calculation
   - lux gating
   - off-delay helper
   - transition helper
   - ambient enable switch

2. SHIP • Intelligent Presence Lighting v2
   - adaptive presence lighting
   - dynamic brightness and CT
   - profile abstraction: circadian / warm_evening / bright_focus / night_safe
   - manual override attempt
   - off-delay logic

3. SHIP • Night Path (Hallway ↔ Bathroom)
   - night window definition
   - linked hallway/bathroom path lighting
   - low-brightness safe pathing
   - delayed clear logic

### 2.3 Core architecture and runtime drafts
Runtime spine:
Custom GPT
↓
Responses API
↓
Backend Brain
↓
Home Assistant
↓
Flat

Backend roles explored:
- state engine
- validation engine
- deployment engine
- simulation engine

Minimal backend modules:
- Home Model Service
- Live State Service
- Validation Service
- Execution Service
- Audit Log

### 2.4 SHIP Backend v0 endpoints
- GET /health
- GET /home-model
- GET /rooms
- GET /devices
- GET /rooms/{room_id}
- GET /rooms/{room_id}/entities
- GET /live-state/entity/{entity_id}
- GET /live-state/room/{room_id}
- POST /validate/action
- POST /execute/action

Allowed execution services (v0):
- light.turn_on
- light.turn_off
- scene.turn_on
- cover.set_cover_position

### 2.5 Backend scaffold and code artefacts
Proposed structure:

ship-backend/
├── docker-compose.yml
├── Dockerfile
├── requirements.txt
├── README.md
├── app/
│   ├── main.py
│   ├── config.py
│   ├── ha_client.py
│   ├── home_model.py
│   ├── model_index.py
│   ├── validator.py
│   ├── executor.py
│   └── audit.py
└── data/
    └── home_registry.json

Files explored:
- docker-compose.yml
- Dockerfile
- requirements.txt
- app/main.py
- app/config.py
- app/home_model.py
- app/ha_client.py
- app/validator.py
- app/executor.py
- app/audit.py
- data/home_registry.json

Most important upgrade:
`app/model_index.py`

Purpose:
- build queryable indexes from home_registry.json
- map rooms, aliases, entities, devices, capabilities, room→entities

Key lookups:
- rooms_by_id
- room_aliases
- devices_by_id
- entities_by_id
- entities_by_room

### 2.6 Backend deployment and homelab route artefacts
Transfer route:
- scp zip to /srv/apps/
- ssh servers
- unzip
- docker compose up -d --build

Commands explored:
- scp ~/Downloads/ship-backend-v0.zip servers:/srv/apps/
- ssh servers
- cd /srv/apps
- unzip ship-backend-v0.zip
- cd ship-backend
- docker compose up -d --build

If unzip missing:
- sudo apt update
- sudo apt install unzip

SSH config proposal:
Host homelab
    HostName 192.168.1.39
    User sysadmin

rsync dev loop:
- rsync -av ~/dev/ship-backend/ homelab:/srv/apps/ship-backend/
- rsync -av --delete ~/dev/ship-backend/ homelab:/srv/apps/ship-backend/

zsh helpers proposed:
- alias ship-push='rsync -av --delete ~/dev/ship-backend/ homelab:/srv/apps/ship-backend/'
- alias ship-ssh='ssh homelab'

deploy function proposed:
ship-deploy() {
  rsync -av --delete ~/dev/ship-backend/ homelab:/srv/apps/ship-backend/ &&   ssh homelab 'cd /srv/apps/ship-backend && docker compose up -d --build'
}

### 2.7 Codex / repo structure artefacts
Proposed SHIP repo layout:

ship/
├── README.md
├── AGENTS.md
├── .gitignore
├── docs/
│   ├── anchor/
│   │   ├── SHIP_Anchor_v1.1.json
│   │   └── ANCHOR.md
│   ├── architecture/
│   │   ├── SYSTEM_OVERVIEW.md
│   │   ├── BACKEND.md
│   │   ├── RUNTIME.md
│   │   ├── WORLD_MODEL.md
│   │   └── ROADMAP.md
│   ├── homelab/
│   │   ├── HOMELAB_OVERVIEW.md
│   │   ├── NETWORK.md
│   │   ├── ACCESS.md
│   │   └── DEPLOYMENT_CONVENTIONS.md
│   └── decisions/
│       └── ADR-0001-ship-runtime-spine.md
├── data/
│   ├── registry/
│   │   ├── home_registry.json
│   │   ├── rooms_breakdown.json
│   │   ├── lighting_inventory.json
│   │   └── room_aliases.json
│   ├── floorplans/
│   │   └── Floorplan-2D-Map.pdf
│   └── exports/
│       └── README.md
├── backend/
│   ├── README.md
│   ├── docker-compose.yml
│   ├── Dockerfile
│   ├── requirements.txt
│   ├── app/
│   │   ├── main.py
│   │   ├── config.py
│   │   ├── db.py
│   │   ├── home_model.py
│   │   ├── model_index.py
│   │   ├── ha_client.py
│   │   ├── validator.py
│   │   ├── executor.py
│   │   └── audit.py
│   └── tests/
│       ├── test_health.py
│       ├── test_model_index.py
│       └── test_validator.py
├── prompts/
│   ├── backend_tasks.md
│   ├── naming_tasks.md
│   └── registry_tasks.md
├── notebooks/
│   └── smart_home_ai_automation_lab_notebook.md
└── skills/
    └── ship-architect/
        └── SKILL.md

Top-level starter files emphasised:
- README.md
- AGENTS.md
- docs/anchor/SHIP_Anchor_v1.1.json
- docs/architecture/SYSTEM_OVERVIEW.md
- data/registry/home_registry.json

### 2.8 Naming and entity modelling artefacts
Machine IDs vs human names:
- stable machine IDs in code
- human-friendly names for voice/display

Examples:
- light.core_living_ceiling → Living Room Ceiling
- light.alpha_bedside_r → Main Bedroom Bedside Right
- light.beta_all → Spare Bedroom Lights

Patterns explored:
- light.<code>_<area?>_<layer>
- light.<code>_<subzone>_<surface>

Open plan proposals:
- light.core_living_ceiling
- light.core_dining_ceiling
- light.core_kitchen_ceiling
- light.core_ceiling
- light.core_all
- light.core_main_ceiling
- light.core_main_all

Lighting inventory JSON principles:
- top-level entries are actionable control surfaces
- individual ceiling bulbs excluded from top-level model
- no integration bindings
- use status / type / form_factor / capabilities

### 2.9 Structural / organisational artefacts explored
Explored structures:
- Environment / Runtime / Control Model / Intelligence
- README.md / ANCHOR.md / WORLD_MODEL.md / RUNTIME.md / BACKEND.md
- Life_OS nesting under Projects/Active/SHIP
- status-style structure: surface / workshop / canon / runtime / residue

Note:
The status-style behavioural explanation was later explicitly challenged and should not be treated as canonical explanation.

### 2.10 Epistemic / interaction rule artefacts
Failure identified as:
- unauthorised reframing
- explanatory narration after correction
- interpretive expansion
- repeated overstep

Root causes extracted:
1. continuation bias
2. frame override
3. assertion generation under constraint conflict

Discarded behaviours:
- reframing user statements
- explaining / defending prior responses
- interpreting user critique
- continuing analysis after a correction requiring halt

Final active constraints:
- C1 — User definitions are authoritative
- C2 — No reframing or reinterpretation of user assertions
- C3 — No explanatory narration unless explicitly requested
- C4 — Corrections issued by the user are binding and immediately applied
- C5 — Responses must remain structurally minimal and aligned to the user’s stated frame
- C6 — No introduction of independent agendas, models, or problem reframings

Invalidated behaviour classes:
- B1 — Behavioural inference about the user
- B2 — Problem reframing
- B3 — Defensive explanation of prior outputs
- B4 — Expansion beyond the scope of the user's directive

Operational rule:
Response = function(user_instruction, constraints C1–C6)

## 3. Proposed but Unused / Not Stabilised
Explored but not adopted as canon:
- room-brain architecture as the main organising model
- broad house_mode systems beyond concept phase
- larger agent set (Lighting Agent, Climate Agent, Transit Agent, Presence Agent)
- full multi-agent SHIP framing
- broad Life_OS nesting as chosen filesystem
- status-based behavioural structure as asserted explanation
- claims about the “real issue”
- evidence-strength / claim-strength framework when presented as if mechanically enforced

## 4. Strongest reusable outputs from the thread
Best candidates for promotion:
- runtime spine
- SHIP_Anchor_v1.1.json
- home_registry.json
- homelab_overview.txt
- SHIP Backend v0 architecture
- backend scaffold zip
- model_index.py approach
- homelab transfer / rsync deploy workflow
- final interaction constraints C1–C6
- invalidated behaviour classes B1–B4

## 5. Minimal compact recap
- The thread began as a smart-home assistance conversation.
- It evolved into SHIP: an AI-assisted smart-home intelligence platform.
- The flat, devices, homelab, and anchors were formalised through uploaded artefacts.
- The runtime spine stabilised as:
  Custom GPT → Responses API → Backend Brain → Home Assistant → Flat
- Focus shifted to making the backend real before broader agent ideas.
- A backend v0 architecture, scaffold, and deployment path were drafted.
- Repo/Codex structures, naming schemes, and broader organisational structures were explored.
- The conversation then encountered a major epistemic/interaction rupture around overreach, reframing, and explanatory assertion.
- The interaction was reset under explicit user-defined constraints.
- This document compiles the whole arc, including active outputs, unused drafts, and invalidated proposals.
