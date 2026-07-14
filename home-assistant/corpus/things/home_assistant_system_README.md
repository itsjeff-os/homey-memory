# 🧠 Jeff's Adaptive Home Assistant System

## Overview
This setup defines a **context-aware, identity-driven smart home** centered on a single user. It blends **Home Assistant YAML packages** with **Node-RED adaptive logic** to deliver an autonomous, personalized environment.  
It is engineered for observability, modularity, and learning — not just automation.

---

## 📁 Folder Structure

```
/config/
├── core/                 # Foundational helpers and inputs
├── presence/             # Context engine (presence + Bayesian logic)
├── environment/          # Lighting, climate, scent, and ambience
├── media/                # Audio and visual media control
├── intelligence/         # AI, history stats, learning sensors
└── rooms/                # Per-room logic and integrations
```

Each folder contains self-contained YAML files. Automations reference sensors and inputs defined in `core/` and `presence/`.

---

## 🔧 Setup Order

### 1️⃣ Import Core Configuration
Copy the contents of `home_assistant_system.zip` into your Home Assistant `/config/` directory.  
Make sure `packages:` is enabled in your `configuration.yaml`:
```yaml
homeassistant:
  packages: !include_dir_named packages
```

### 2️⃣ Add Integrations
Set up these integrations (most via UI):
- Home Assistant Cloud (Nabu Casa)
- ZHA or Zigbee2MQTT (for Aqara FP2, FP1E)
- Hue Bridge
- Withings
- Oura Ring
- Apple TV + HomePod (HomeKit Controller)
- MQTT (Mosquitto)
- Node-RED Add-on

### 3️⃣ Import Dashboards
1. **Diagnostic Dashboard** → `/config/dashboards/diagnostic_dashboard.yaml`  
   Add via **Settings → Dashboards → + Add Dashboard → YAML Mode**  
2. **Control Hub** → `/config/dashboards/control_hub_dashboard.yaml`  
   Add the same way.

### 4️⃣ Import Node-RED Flow
- In Node-RED → Menu → *Import → JSON* → Paste or upload `node_red_adaptive_flow.json`
- Deploy and test that scene triggers activate correctly.

---

## 🧩 Core Concepts

### Context Engine
`presence/context_template.yaml` generates `sensor.jeff_context`, which is the **master state** of your system:
- asleep
- resting
- active_living
- active_bedroom
- home_idle
- away

This state drives most automations.

### Adaptive Learning
`intelligence/adaptive_logic.yaml` uses a **Bayesian sensor** to infer likely rest or transition states.  
Over time, you can add History Stats sensors to fine-tune probabilities based on your actual routine.

### Lighting & Media Coupling
Scenes, scent, and music are tied to mood states via automations like:
```yaml
trigger:
  - platform: state
    entity_id: sensor.jeff_context
    to: "resting"
```
This ensures that environmental control is **contextual** and **autonomous**.

### Node-RED Adaptive Flow
Node-RED listens for context changes → routes them through a `switch` node → triggers the right Home Assistant scene.  
This makes it easy to visualize and extend logic for new modes or AI behaviors.

---

## 🧭 Dashboards

### Diagnostic Dashboard
- **Monitor:** Context, Bayesian probabilities, sensors, automations
- **Debug:** View historical state transitions and logbook entries

### Control Hub
- **Manual Override:** Switch modes or test presence booleans
- **Quick Actions:** Trigger Focus, Relax, or Sleep scenes
- **Environmental Toggles:** Manage AC, purifier, diffuser manually

---

## 🧱 Recommended Expansion Path

| Stage | Focus | Description |
|--------|--------|-------------|
| Phase 1 | Stability | Verify all integrations, ensure presence zones work |
| Phase 2 | Context Refinement | Fine-tune `sensor.jeff_context` states and thresholds |
| Phase 3 | Learning | Enable Bayesian/History Stats logic for adaptive mode switching |
| Phase 4 | AI Integration | Connect webhook to ChatGPT or local LLM via `webhook_llm.yaml` |
| Phase 5 | Ambient AI | Add predictive automations that pre-adjust lighting, air, or scent |

---

## 💾 Backup & Maintenance

- Regularly back up your `/config/` folder using HA snapshots or Git.
- Use the Diagnostic Dashboard to monitor automation drift.
- Keep YAMLs and Node-RED flows versioned together for consistency.

---

**Author:** System generated for Jeff’s adaptive Home Assistant setup  
**Last Updated:** Auto-generated build via ChatGPT (GPT-5)
