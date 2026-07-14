# HA Corpus — Home Assistant Configuration & Automation Corpus

Compiled: 2026-07-02
Purpose: Consolidated corpus of all discovered Home Assistant (HA) related files on Jeff's machine, for later chunking/embedding into a Chroma vector database.

Scope searched: `~/Documents`, `~/Desktop`, `~/Downloads` (the folders granted access for this session — see manifest for details and caveats).

Note on duplication: the source folders contain heavy recursive backup duplication (e.g. `00_Inbox copy/`, nested `agentic_tier3_kit 2/` trees, and a `Downloads/10_Archive/Duplicated-Pending Deletion/` archive). Where multiple byte-identical copies of the same file were found, only ONE representative copy is included below to keep this corpus clean for embedding. See the manifest file (`ha_corpus_manifest.md`) for full duplicate-path listings and exclusions.

No `secrets.yaml` file was found anywhere on the machine. No API keys, tokens, or passwords were found embedded in any included file — no redaction was necessary.

---

==== FILE: /Users/jeff/Documents/Documents - Macbook-M3/homeassistant/home_assistant_system_README.md (modified: 2026-05-18 17:03:28) ====

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

**Author:** System generated for Jeff's adaptive Home Assistant setup
**Last Updated:** Auto-generated build via ChatGPT (GPT-5)

==== FILE: /Users/jeff/Documents/Documents - Macbook-M3/homeassistant/ceiling_daily_rhythm_presence.yaml (modified: 2026-05-18 17:03:29) ====

blueprint:
  name: Ceiling • Daily Rhythm + Presence
  description: >
    Presence-based ceiling light automation that follows the day (morning/day/evening/night),
    fades out after a delay, and can be limited by sun elevation (so it generally won't run
    in full daylight unless you explicitly enable daytime).
  domain: automation

  input:
    sensor_entity:
      name: Motion / Presence Sensor
      selector:
        entity:
          domain: binary_sensor

    light_target:
      name: Ceiling Light / Group
      selector:
        target:
          entity:
            domain: light

    sun_elevation_below:
      name: Run only when sun elevation below
      description: 15° ≈ bright daytime. Lower number = stricter (only darker conditions).
      default: 15
      selector:
        number:
          min: -10
          max: 45
          step: 1
          unit_of_measurement: "°"

    morning_start:
      name: Morning starts at
      default: "06:00:00"
      selector:
        time: {}
    morning_end:
      name: Morning ends at
      default: "09:30:00"
      selector:
        time: {}
    evening_start:
      name: Evening starts at
      default: "16:00:00"
      selector:
        time: {}
    night_start:
      name: Night starts at
      default: "23:00:00"
      selector:
        time: {}
    night_end:
      name: Night ends at
      default: "06:00:00"
      selector:
        time: {}

    enable_daytime:
      name: Enable daytime automation (between morning_end and evening_start)
      default: false
      selector:
        boolean: {}

    morning_brightness:
      name: Morning brightness (%)
      default: 45
      selector:
        number:
          min: 1
          max: 100
          unit_of_measurement: "%"
    morning_color_temp:
      name: Morning color temperature (mired)
      default: 330
      selector:
        number:
          min: 250
          max: 500
          unit_of_measurement: "mired"

    day_brightness:
      name: Day brightness (%)
      default: 70
      selector:
        number:
          min: 1
          max: 100
          unit_of_measurement: "%"
    day_color_temp:
      name: Day color temperature (mired)
      default: 300
      selector:
        number:
          min: 250
          max: 500
          unit_of_measurement: "mired"

    evening_brightness:
      name: Evening brightness (%)
      default: 55
      selector:
        number:
          min: 1
          max: 100
          unit_of_measurement: "%"
    evening_color_temp:
      name: Evening color temperature (mired)
      default: 350
      selector:
        number:
          min: 250
          max: 500
          unit_of_measurement: "mired"

    night_brightness:
      name: Night brightness (%)
      default: 16
      selector:
        number:
          min: 1
          max: 50
          unit_of_measurement: "%"
    night_color_temp:
      name: Night color temperature (mired)
      default: 420
      selector:
        number:
          min: 300
          max: 500
          unit_of_measurement: "mired"

    off_delay:
      name: Off delay after room empty (minutes)
      default: 4
      selector:
        number:
          min: 0
          max: 60
          unit_of_measurement: minutes
          mode: slider
    fade_in_transition:
      name: Fade-in time (seconds)
      default: 4
      selector:
        number:
          min: 0
          max: 30
          unit_of_measurement: "s"
    fade_out_transition:
      name: Fade-out time (seconds)
      default: 6
      selector:
        number:
          min: 0
          max: 60
          unit_of_measurement: "s"

mode: restart

variables:
  off_delay: !input off_delay
  sun_elevation_below: !input sun_elevation_below
  morning_start: !input morning_start
  morning_end: !input morning_end
  evening_start: !input evening_start
  night_start: !input night_start
  night_end: !input night_end
  enable_daytime: !input enable_daytime
  morning_brightness: !input morning_brightness
  morning_color_temp: !input morning_color_temp
  day_brightness: !input day_brightness
  day_color_temp: !input day_color_temp
  evening_brightness: !input evening_brightness
  evening_color_temp: !input evening_color_temp
  night_brightness: !input night_brightness
  night_color_temp: !input night_color_temp
  fade_in_transition: !input fade_in_transition
  fade_out_transition: !input fade_out_transition

trigger:
  - id: presence_on
    platform: state
    entity_id: !input sensor_entity
    to: "on"
  - id: presence_off
    platform: state
    entity_id: !input sensor_entity
    to: "off"

action:
  - choose:
      - conditions:
          - condition: trigger
            id: presence_on
          - condition: numeric_state
            entity_id: sun.sun
            attribute: elevation
            below: !input sun_elevation_below
        sequence:
          - choose:
              - conditions:
                  - condition: or
                    conditions:
                      - condition: time
                        after: !input night_start
                      - condition: time
                        before: !input night_end
                sequence:
                  - service: light.turn_on
                    target: !input light_target
                    data:
                      brightness_pct: "{{ night_brightness | int }}"
                      color_temp: "{{ night_color_temp | int }}"
                      transition: "{{ fade_in_transition | int }}"
              - conditions:
                  - condition: time
                    after: !input morning_start
                    before: !input morning_end
                sequence:
                  - service: light.turn_on
                    target: !input light_target
                    data:
                      brightness_pct: "{{ morning_brightness | int }}"
                      color_temp: "{{ morning_color_temp | int }}"
                      transition: "{{ fade_in_transition | int }}"
              - conditions:
                  - condition: time
                    after: !input evening_start
                    before: !input night_start
                sequence:
                  - service: light.turn_on
                    target: !input light_target
                    data:
                      brightness_pct: "{{ evening_brightness | int }}"
                      color_temp: "{{ evening_color_temp | int }}"
                      transition: "{{ fade_in_transition | int }}"
              - conditions:
                  - condition: template
                    value_template: "{{ enable_daytime | bool }}"
                  - condition: time
                    after: !input morning_end
                    before: !input evening_start
                sequence:
                  - service: light.turn_on
                    target: !input light_target
                    data:
                      brightness_pct: "{{ day_brightness | int }}"
                      color_temp: "{{ day_color_temp | int }}"
                      transition: "{{ fade_in_transition | int }}"
            default:
              - service: light.turn_on
                target: !input light_target
                data:
                  brightness_pct: "{{ evening_brightness | int }}"
                  color_temp: "{{ evening_color_temp | int }}"
                  transition: "{{ fade_in_transition | int }}"
      - conditions:
          - condition: trigger
            id: presence_off
        sequence:
          - delay:
              minutes: "{{ off_delay | int }}"
          - condition: state
            entity_id: !input sensor_entity
            state: "off"
          - service: light.turn_off
            target: !input light_target
            data:
              transition: "{{ fade_out_transition | int }}"

==== FILE: /Users/jeff/Documents/Documents - Macbook-M3/homeassistant/Blueprint.json (modified: 2026-05-18 17:03:30) ====

blueprint:
  name: Context Skeleton
  description: >
    Provides core context helpers (sleep, guest, away, motion timeout)
    for use across all automations.
  domain: automation
  input:
    sleep_mode:
      name: Sleep Mode
      selector:
        entity:
          domain: input_boolean
    guest_mode:
      name: Guest Mode
      selector:
        entity:
          domain: input_boolean
    motion_timeout:
      name: Motion Timeout
      selector:
        entity:
          domain: input_number

==== FILE: /Users/jeff/Documents/Documents - Macbook-M3/homeassistant/home_registry.json (modified: 2026-05-18 17:03:43) ====

{
  "meta": {
    "version": "0.1.0",
    "generated_by": "GPT-5.1 Thinking (architect mode)",
    "description": "Canonical AI-centred registry of Jeff's flat smart home environment, based on HomeKit logs, HA entity inventory, and manual inventories. Notion is treated as contextual only."
  },
  "rooms": [
    {"id": "room.open_plan", "name": "Open Plan", "aliases": ["Core", "Living Room", "Kitchen", "Dining"], "kind": ["living", "kitchen", "dining"], "zones": ["zone.open_plan_fp2"]},
    {"id": "room.bedroom1", "name": "Bedroom 1 (Alpha)", "aliases": ["Alpha Bedroom", "Primary Bedroom"], "kind": ["bedroom"], "zones": ["zone.bedroom1_fp2"]},
    {"id": "room.bedroom2", "name": "Bedroom 2 (Beta)", "aliases": ["Beta Bedroom", "Secondary Bedroom"], "kind": ["bedroom"], "zones": ["zone.bedroom2_fp2"]},
    {"id": "room.bathroom_throne", "name": "Bathroom (Throne)", "aliases": ["Throne Bathroom", "Primary Bathroom"], "kind": ["bathroom"], "zones": []},
    {"id": "room.bathroom_secondary", "name": "Secondary Bathroom (Splash)", "aliases": ["Splash Bathroom"], "kind": ["bathroom"], "zones": []},
    {"id": "room.hallway", "name": "Hallway (Pass)", "aliases": ["Pass Hallway"], "kind": ["hallway"], "zones": ["zone.hallway_fp2"]},
    {"id": "room.laundry_utility", "name": "Laundry / Utility (Chaos)", "aliases": ["Chaos", "Utility", "Laundry"], "kind": ["utility"], "zones": []}
  ],
  "zones": [
    {"id": "zone.open_plan_fp2", "name": "Open Plan FP2 Zone", "room_ids": ["room.open_plan"], "sensor_ids": ["sensor.fp2_open_plan_presence", "sensor.fp2_open_plan_lux"]},
    {"id": "zone.bedroom1_fp2", "name": "Bedroom 1 FP2 Zone", "room_ids": ["room.bedroom1"], "sensor_ids": ["sensor.fp2_bedroom1_presence", "sensor.fp2_bedroom1_lux"]},
    {"id": "zone.bedroom2_fp2", "name": "Bedroom 2 FP2 Zone", "room_ids": ["room.bedroom2"], "sensor_ids": ["sensor.fp2_bedroom2_presence", "sensor.fp2_bedroom2_lux"]},
    {"id": "zone.hallway_fp2", "name": "Hallway FP2 / Motion Zone", "room_ids": ["room.hallway"], "sensor_ids": ["sensor.motion_hallway_1", "sensor.motion_hallway_2"]}
  ],
  "infrastructure": [
    {"id": "infra.unifi_gateway", "name": "Unifi Cloud Gateway Ultra", "type": "router_controller", "location_room_id": "room.laundry_utility", "integrations": ["network_core"]},
    {"id": "infra.hue_bridge_pro", "name": "Philips Hue Bridge Pro", "type": "lighting_bridge", "location_room_id": "room.laundry_utility", "integrations": ["home_assistant", "homekit", "hue_app"]},
    {"id": "infra.aqara_m3", "name": "Aqara M3 Hub", "type": "zigbee_matter_hub", "location_room_id": "room.laundry_utility", "integrations": ["home_assistant", "homekit", "aqara_app"]},
    {"id": "infra.switchbot_hub3", "name": "Switchbot Hub 3", "type": "switchbot_hub", "location_room_id": "room.laundry_utility", "integrations": ["home_assistant", "switchbot_app"]},
    {"id": "infra.home_assistant_server", "name": "GMKtec Mini PC (Homelab)", "type": "automation_core", "location_room_id": "room.laundry_utility", "integrations": ["docker", "home_assistant"]}
  ],
  "devices": [
    {"id": "device.open_plan_ceiling_group", "name": "Open Plan Ceiling Lights", "type": "light_group", "room_id": "room.open_plan", "capabilities": ["on_off","brightness","color_temp"], "integrations": {"home_assistant": {"primary_entities": ["light.open_plan_ceiling","light.open_plan_all_lights"], "scenes": ["scene.living_relax","scene.living_concentrate","scene.living_energise","scene.living_nightlight","scene.open_plan_ceiling_lights_all_day"]}}},
    {"id": "device.open_plan_ambient_group", "name": "Open Plan Ambient Lighting", "type": "light_group", "room_id": "room.open_plan", "capabilities": ["on_off","brightness","color_temp"], "integrations": {"home_assistant": {"primary_entities": ["light.open_plan_ambient"]}}},
    {"id": "device.open_plan_ac", "name": "Dreo Smart Portable AC (Open Plan)", "type": "climate_device", "role": "ac", "room_id": "room.open_plan", "capabilities": ["on_off","set_mode","set_temperature","fan_speed"], "integrations": {"home_assistant": {"primary_entities": ["climate.living_ac"]}}},
    {"id": "device.open_plan_humidifier", "name": "Levoit Dual 200S Humidifier (Open Plan)", "type": "climate_device", "role": "humidifier", "room_id": "room.open_plan", "capabilities": ["on_off","set_humidity","modes"], "integrations": {"home_assistant": {}}},
    {"id": "device.open_plan_curtains", "name": "Aqara Curtain Controller E1 (Pair)", "type": "window_treatment", "room_id": "room.open_plan", "capabilities": ["open","close","set_position"], "integrations": {"home_assistant": {"primary_entities": ["cover.openplan_curtains"]}}},
    {"id": "device.open_plan_media_cluster", "name": "Open Plan Media Cluster", "type": "media_cluster", "room_id": "room.open_plan", "capabilities": ["on_off","volume","media_control"], "integrations": {"home_assistant": {"primary_entities": ["media_player.living_homepods","media_player.apple_tv"]}}},
    {"id": "device.open_plan_tv", "name": "Samsung Serif 50\" TV", "type": "media_device", "room_id": "room.open_plan", "capabilities": ["on_off","input_select","volume"], "integrations": {"home_assistant": {}}},
    {"id": "sensor.fp2_open_plan_presence", "name": "FP2 Open Plan Presence", "type": "sensor_presence", "room_id": "room.open_plan", "capabilities": ["presence","zones"], "integrations": {"home_assistant": {"primary_entities": ["binary_sensor.presence_sensor_fp2_openplan","binary_sensor.presence_sensor_fp2_living_area","binary_sensor.presence_sensor_fp2_kitchen","binary_sensor.presence_sensor_fp2_dining_area"]}}},
    {"id": "sensor.fp2_open_plan_lux", "name": "FP2 Open Plan Lux", "type": "sensor_lux", "room_id": "room.open_plan", "capabilities": ["illuminance"], "integrations": {"home_assistant": {}}},
    {"id": "device.bedroom1_right_bedside_lamp", "name": "Right Bedside Lamp", "type": "light", "room_id": "room.bedroom1", "capabilities": ["on_off","brightness","color_temp"], "integrations": {"home_assistant": {}}},
    {"id": "device.bedroom1_ola_floor_spot", "name": "Ola XL Floor Spotlamp", "type": "light", "room_id": "room.bedroom1", "capabilities": ["on_off","brightness","color_temp"], "integrations": {"home_assistant": {}}},
    {"id": "device.bedroom1_alpha_ceiling_1", "name": "Alphaflex Ceiling Light.1", "type": "light", "room_id": "room.bedroom1", "capabilities": ["on_off","brightness","color_temp"], "integrations": {"home_assistant": {}}},
    {"id": "device.bedroom1_alpha_ceiling_2", "name": "Alpha Ceiling Light.2", "type": "light", "room_id": "room.bedroom1", "capabilities": ["on_off","brightness","color_temp"], "integrations": {"home_assistant": {}}},
    {"id": "device.bedroom1_alpha_ceiling_3", "name": "Alpha Ceiling Light.3", "type": "light", "room_id": "room.bedroom1", "capabilities": ["on_off","brightness","color_temp"], "integrations": {"home_assistant": {}}},
    {"id": "device.bedroom1_alpha_ceiling_4", "name": "Alpha Ceiling Light.4", "type": "light", "room_id": "room.bedroom1", "capabilities": ["on_off","brightness","color_temp"], "integrations": {"home_assistant": {}}},
    {"id": "device.bedroom1_alpha_ceiling_5", "name": "Alpha Ceiling Light.5", "type": "light", "room_id": "room.bedroom1", "capabilities": ["on_off","brightness","color_temp"], "integrations": {"home_assistant": {}}},
    {"id": "device.bedroom1_alpha_ceiling_6", "name": "Alpha Ceiling Light.6", "type": "light", "room_id": "room.bedroom1", "capabilities": ["on_off","brightness","color_temp"], "integrations": {"home_assistant": {}}},
    {"id": "device.bedroom1_purifier", "name": "Levoit Air 300S Purifier", "type": "climate_device", "role": "air_purifier", "room_id": "room.bedroom1", "capabilities": ["on_off","fan_speed","modes"], "integrations": {"home_assistant": {}}},
    {"id": "device.bedroom1_humidifier", "name": "Dreo Smart Humidifier (Bedroom 1)", "type": "climate_device", "role": "humidifier", "room_id": "room.bedroom1", "capabilities": ["on_off","set_humidity"], "integrations": {"home_assistant": {}}},
    {"id": "device.bedroom1_sleep_mat", "name": "Withings Sleep Mat", "type": "health_device", "room_id": "room.bedroom1", "capabilities": ["sleep_state","presence"], "integrations": {"home_assistant": {}}},
    {"id": "sensor.fp2_bedroom1_presence", "name": "FP2 Bedroom 1 Presence", "type": "sensor_presence", "room_id": "room.bedroom1", "capabilities": ["presence","zones"], "integrations": {"home_assistant": {}}},
    {"id": "sensor.fp2_bedroom1_lux", "name": "FP2 Bedroom 1 Lux", "type": "sensor_lux", "room_id": "room.bedroom1", "capabilities": ["illuminance"], "integrations": {"home_assistant": {}}},
    {"id": "device.bedroom1_tv", "name": "Samsung UHD 50\" TV (Bedroom 1)", "type": "media_device", "room_id": "room.bedroom1", "capabilities": ["on_off","input_select","volume"], "integrations": {"home_assistant": {}}},
    {"id": "device.bedroom2_signe_floor_lamp", "name": "Signe Gradient Floor Lamp", "type": "light", "room_id": "room.bedroom2", "capabilities": ["on_off","brightness","color"], "integrations": {"home_assistant": {}}},
    {"id": "device.bedroom2_betaflex_ceiling_1", "name": "Betaflex Ceiling Light.1", "type": "light", "room_id": "room.bedroom2", "capabilities": ["on_off","brightness","color_temp"], "integrations": {"home_assistant": {}}},
    {"id": "device.bedroom2_beta_ceiling_3", "name": "Beta Ceiling Light.3", "type": "light", "room_id": "room.bedroom2", "capabilities": ["on_off","brightness","color_temp"], "integrations": {"home_assistant": {}}},
    {"id": "device.bedroom2_beta_ceiling_4", "name": "Beta Ceiling Light.4", "type": "light", "room_id": "room.bedroom2", "capabilities": ["on_off","brightness","color_temp"], "integrations": {"home_assistant": {}}},
    {"id": "device.bedroom2_beta_ceiling_5", "name": "Beta Ceiling Light.5", "type": "light", "room_id": "room.bedroom2", "capabilities": ["on_off","brightness","color_temp"], "integrations": {"home_assistant": {}}},
    {"id": "device.bedroom2_beta_ceiling_6", "name": "Beta Ceiling Light.6", "type": "light", "room_id": "room.bedroom2", "capabilities": ["on_off","brightness","color_temp"], "integrations": {"home_assistant": {}}},
    {"id": "device.bedroom2_bed_lightstrip", "name": "Beta Bed Lightstrip", "type": "light", "room_id": "room.bedroom2", "capabilities": ["on_off","brightness","color"], "integrations": {"home_assistant": {}}},
    {"id": "sensor.fp1e_bedroom2_presence", "name": "FP1E Bedroom 2 Presence", "type": "sensor_presence", "room_id": "room.bedroom2", "capabilities": ["presence","zones"], "integrations": {"home_assistant": {}}},
    {"id": "device.bathroom_throne_ceiling_1", "name": "Throne Ceiling Light.1", "type": "light", "room_id": "room.bathroom_throne", "capabilities": ["on_off","brightness","color_temp"], "integrations": {"home_assistant": {}}},
    {"id": "device.bathroom_throne_ceiling_2", "name": "Throne Ceiling Light.2", "type": "light", "room_id": "room.bathroom_throne", "capabilities": ["on_off","brightness","color_temp"], "integrations": {"home_assistant": {}}},
    {"id": "device.bathroom_throne_ceiling_3", "name": "Throne Ceiling Light.3", "type": "light", "room_id": "room.bathroom_throne", "capabilities": ["on_off","brightness","color_temp"], "integrations": {"home_assistant": {}}},
    {"id": "device.bathroom_throne_ceiling_4", "name": "Throne Ceiling Light.4", "type": "light", "room_id": "room.bathroom_throne", "capabilities": ["on_off","brightness","color_temp"], "integrations": {"home_assistant": {}}},
    {"id": "sensor.bathroom_throne_temp", "name": "Throne Bathroom Temperature Sensor", "type": "sensor_temperature", "room_id": "room.bathroom_throne", "capabilities": ["temperature"], "integrations": {"home_assistant": {}}},
    {"id": "device.bathroom_secondary_splash_ceiling_1", "name": "Splash Ceiling Light.1", "type": "light", "room_id": "room.bathroom_secondary", "capabilities": ["on_off","brightness","color_temp"], "integrations": {"home_assistant": {}}},
    {"id": "device.bathroom_secondary_splash_ceiling_2", "name": "Splash Ceiling Light.2", "type": "light", "room_id": "room.bathroom_secondary", "capabilities": ["on_off","brightness","color_temp"], "integrations": {"home_assistant": {}}},
    {"id": "device.bathroom_secondary_splash_ceiling_3", "name": "Splash Ceiling Light.3", "type": "light", "room_id": "room.bathroom_secondary", "capabilities": ["on_off","brightness","color_temp"], "integrations": {"home_assistant": {}}},
    {"id": "device.bathroom_secondary_splash_ceiling_4", "name": "Splash Ceiling Light.4", "type": "light", "room_id": "room.bathroom_secondary", "capabilities": ["on_off","brightness","color_temp"], "integrations": {"home_assistant": {}}},
    {"id": "device.bathroom_secondary_splash_ceiling_5", "name": "Splash Ceiling Light.5", "type": "light", "room_id": "room.bathroom_secondary", "capabilities": ["on_off","brightness","color_temp"], "integrations": {"home_assistant": {}}},
    {"id": "sensor.bathroom_secondary_temp", "name": "Secondary Bathroom Temperature Sensor", "type": "sensor_temperature", "room_id": "room.bathroom_secondary", "capabilities": ["temperature"], "integrations": {"home_assistant": {}}},
    {"id": "sensor.bathroom_secondary_occupancy", "name": "Secondary Bathroom Occupancy Sensor", "type": "sensor_presence", "room_id": "room.bathroom_secondary", "capabilities": ["presence"], "integrations": {"home_assistant": {}}},
    {"id": "device.hallway_pass_ceiling_1", "name": "Pass Ceiling Light.1", "type": "light", "room_id": "room.hallway", "capabilities": ["on_off","brightness","color_temp"], "integrations": {"home_assistant": {}}},
    {"id": "device.hallway_pass_ceiling_2", "name": "Pass Ceiling Light.2", "type": "light", "room_id": "room.hallway", "capabilities": ["on_off","brightness","color_temp"], "integrations": {"home_assistant": {}}},
    {"id": "device.hallway_pass_ceiling_3", "name": "Pass Ceiling Light.3", "type": "light", "room_id": "room.hallway", "capabilities": ["on_off","brightness","color_temp"], "integrations": {"home_assistant": {}}},
    {"id": "device.hallway_pass_ceiling_4", "name": "Pass Ceiling Light.4", "type": "light", "room_id": "room.hallway", "capabilities": ["on_off","brightness","color_temp"], "integrations": {"home_assistant": {}}},
    {"id": "device.hallway_pass_ceiling_5", "name": "Pass Ceiling Light.5", "type": "light", "room_id": "room.hallway", "capabilities": ["on_off","brightness","color_temp"], "integrations": {"home_assistant": {}}},
    {"id": "sensor.motion_hallway_1", "name": "Hallway Motion Sensor 1", "type": "sensor_motion", "room_id": "room.hallway", "capabilities": ["motion"], "integrations": {"home_assistant": {}}},
    {"id": "sensor.motion_hallway_2", "name": "Hallway Motion Sensor 2", "type": "sensor_motion", "room_id": "room.hallway", "capabilities": ["motion"], "integrations": {"home_assistant": {}}},
    {"id": "device.laundry_ceiling_light", "name": "Laundry Ceiling Light", "type": "light", "room_id": "room.laundry_utility", "capabilities": ["on_off","brightness","color_temp"], "integrations": {"home_assistant": {}}},
    {"id": "device.utility_ceiling_light", "name": "Utility Ceiling Light", "type": "light", "room_id": "room.laundry_utility", "capabilities": ["on_off","brightness","color_temp"], "integrations": {"home_assistant": {}}},
    {"id": "device.play_gradient_tube_1", "name": "Play Gradient Tube 1", "type": "light", "room_id": "room.laundry_utility", "capabilities": ["on_off","brightness","color"], "integrations": {"home_assistant": {}}},
    {"id": "device.prestobed_right_gradient", "name": "PrestoBed Right Gradient Light", "type": "light", "room_id": "room.laundry_utility", "capabilities": ["on_off","brightness","color"], "integrations": {"home_assistant": {}}},
    {"id": "device.eufy_s1_omni_pro", "name": "Eufy S1 Omni Pro", "type": "robot_vacuum", "room_id": "room.laundry_utility", "capabilities": ["start","stop","dock","zone_clean"], "integrations": {"home_assistant": {"primary_entities": ["vacuum.eufy_s1_omni_pro"]}}}
  ],
  "actuators": [
    {"id": "actuator.alpha_bedroom_dial", "name": "Alpha Bedroom Hue Dial Switch", "type": "stateless_button", "room_id": "room.bedroom1", "capabilities": ["button_press","dial_rotate"], "integrations": {"home_assistant": {}}},
    {"id": "actuator.bed_smart_button", "name": "Bed Smart Button", "type": "stateless_button", "room_id": "room.bedroom1", "capabilities": ["button_press"], "integrations": {"home_assistant": {}}},
    {"id": "actuator.beta_bedroom_dial", "name": "Beta Bedroom Hue Dial Switch", "type": "stateless_button", "room_id": "room.bedroom2", "capabilities": ["button_press","dial_rotate"], "integrations": {"home_assistant": {}}},
    {"id": "actuator.throne_bathroom_ceiling_switch", "name": "Throne Bathroom Ceiling Switch", "type": "stateless_button", "room_id": "room.bathroom_throne", "capabilities": ["button_press"], "integrations": {"home_assistant": {}}},
    {"id": "actuator.splash_dimmer_switch", "name": "Splash Dimmer Switch", "type": "stateless_button", "room_id": "room.bathroom_secondary", "capabilities": ["button_press","brightness_control"], "integrations": {"home_assistant": {}}},
    {"id": "actuator.hallway_dimmer_switch", "name": "Hallway Dimmer Switch", "type": "stateless_button", "room_id": "room.hallway", "capabilities": ["button_press","brightness_control"], "integrations": {"home_assistant": {}}},
    {"id": "actuator.core_hue_tap_dial", "name": "Core Hue Tap Dial Switch", "type": "stateless_button", "room_id": "room.open_plan", "capabilities": ["button_press","dial_rotate"], "integrations": {"home_assistant": {}}}
  ]
}

==== FILE: /Users/jeff/Documents/Documents - Macbook-M3/homeassistant/rename_map.json (modified: 2026-05-18 17:03:49) ====

{
  "2": "Alpha Ceiling 01", "21": "Alpha Ceiling 02", "26": "Alpha Ceiling 03", "1": "Alpha Ceiling 04", "55": "Alpha Ceiling 05", "6": "Alpha Flex Ceiling 01",
  "35": "Beta Bed Strip 01", "5": "Beta Ceiling 01", "18": "Beta Ceiling 02", "49": "Beta Ceiling 03", "47": "Beta Ceiling 04", "48": "Beta Flex Ceiling 01", "46": "Beta Flex Ceiling 02",
  "52": "Core Ceiling 01", "29": "Core Ceiling 02", "14": "Core Ceiling 03", "16": "Core Ceiling 04", "15": "Core Ceiling 05", "9": "Core Ceiling 06", "27": "Core Ceiling 07", "17": "Core Ceiling 08",
  "23": "Kitchen Ceiling 01", "22": "Kitchen Ceiling 02",
  "28": "Laundry Ceiling 01", "25": "Store Ceiling 01",
  "4": "Pass Ceiling 01", "24": "Pass Ceiling 02", "31": "Pass Ceiling 03", "19": "Pass Ceiling 04", "30": "Pass Ceiling 05",
  "42": "Splash Ceiling 01", "43": "Splash Ceiling 02", "39": "Splash Ceiling 03", "41": "Splash Ceiling 04", "40": "Splash Ceiling 05",
  "13": "Throne Ceiling 01", "3": "Throne Ceiling 02", "12": "Throne Ceiling 03", "10": "Throne Ceiling 04",
  "38": "Beige Ola Spotlight", "51": "Fado Glass Globe", "63": "Hue Play 01", "65": "Hue Play 02", "45": "Ikea Skytrax", "34": "Monica Arc Lamp", "66": "Muji Diffuser", "60": "Mushroom Table Lamp", "56": "Nymane Spot Top", "54": "Nymane Spot Mid", "53": "Nymane Spot Bottom", "68": "Ola Floor XL", "62": "Play Gradient Tube 01", "58": "Right Bedside Lamp", "57": "Signe Floor Gradient 01", "44": "Signe Floor Gradient 02", "69": "Signe Table Gradient 01"
}

==== FILE: /Users/jeff/Documents/Documents - Macbook-M3/homeassistant/Rooms/Rooms.md (modified: 2026-05-18 17:12:30) ====

# Flat context

## Room outline

These are the source of truth for all workspace data.

Room Code Standards

## Room Naming Convention

```python
{
"rooms": {
"Core": {
"type": "open_plan",
"approx_area_sqft": 310,
"neighbors": ["Pass"],
"faces": ["East-facing window"],
"subzones": ["Core_NE", "Core_NW", "Core_SE", "Core_SW", "Kitchen"]
},
"Alpha": {
"type": "bedroom",
"approx_area_sqft": 140,
"neighbors": ["Pass", "Throne"],
"subzones": ["Alpha_Bed", "Alpha_Flex"]
},
"Throne": {
"type": "bathroom_ensuite",
"neighbors": ["Alpha", "Pass"]
},
"Beta": {
"type": "bedroom",
"approx_area_sqft": 163,
"neighbors": ["Pass", "Splash"],
"subzones": ["Beta_Bed", "Beta_Flex"]
},
"Splash": {
"type": "bathroom_rear",
"neighbors": ["Pass", "Beta"]
},
"Pass": {
"type": "hall",
"neighbors": ["Core", "Alpha", "Beta", "Splash", "Chaos"],
"subzones": ["Vault", "Alpha_Pass", "Beta_Pass"]
},
"Chaos": {
"type": "utility_storage",
"neighbors": ["Pass"]
"subzones": ["laundry_room", "storage_rooms"]
}
}
}
```

==== FILE: /Users/jeff/Documents/Documents - Macbook-M3/homeassistant/ha_historical_context/room_presence_lighting_context_v2.yaml (modified: 2026-05-18 17:03:43) ====

blueprint:
  name: Room Presence Lighting (Context-Aligned v2)
  description: >
    Context-aware room lighting that responds to presence while following the global Home Context
    (normal, sleep, away, override). Integrates with Adaptive Lighting and includes optional logging.
  domain: automation
  input:
    presence_entity:
      name: Presence Sensor
      selector:
        entity:
          domain: binary_sensor
    light_target:
      name: Light or Light Group
      selector:
        target:
          entity:
            domain: light
    adaptive_switch:
      name: Adaptive Lighting Switch (optional)
      default: ""
      selector:
        entity:
          domain: switch
          multiple: false
    home_context:
      name: Home Context Sensor
      default: sensor.home_context_stable
      selector:
        entity:
          domain: sensor
    off_delay:
      name: Delay (minutes) before turning off lights when room empty
      default: 2
      selector:
        number:
          min: 0
          max: 60
          step: 1
          unit_of_measurement: min
    night_min_pct:
      name: Minimum brightness during sleep context
      default: 15
      selector:
        number:
          min: 1
          max: 100
          step: 1
          unit_of_measurement: '%'
    enable_logging:
      name: Enable Logbook Entries
      default: false
      selector:
        boolean: {}

mode: restart
max_exceeded: silent

trigger:
  - platform: state
    entity_id: !input presence_entity

variables:
  light_target: !input light_target
  adaptive_switch: !input adaptive_switch
  home_context: !input home_context
  off_delay: !input off_delay
  night_min_pct: !input night_min_pct
  enable_logging: !input enable_logging

condition: []

action:
  - choose:
      - conditions:
          - condition: state
            entity_id: !input presence_entity
            state: "on"
        sequence:
          - choose:
              - conditions:
                  - condition: state
                    entity_id: !input home_context
                    state: "override"
                sequence:
                  - service: light.turn_on
                    target: !input light_target
              - conditions:
                  - condition: state
                    entity_id: !input home_context
                    state: "sleep"
                sequence:
                  - service: light.turn_on
                    target: !input light_target
                    data:
                      brightness_pct: !input night_min_pct
              - conditions:
                  - condition: state
                    entity_id: !input home_context
                    state: "away"
                sequence:
                  - service: light.turn_off
                    target: !input light_target
              - conditions:
                  - condition: state
                    entity_id: !input home_context
                    state: "normal"
                sequence:
                  - service: switch.turn_on
                    target:
                      entity_id: !input adaptive_switch
                  - service: light.turn_on
                    target: !input light_target
          - choose:
              - conditions: "{{ enable_logging }}"
                sequence:
                  - service: logbook.log
                    data:
                      name: "Room Lighting"
                      message: >
                        "{{ trigger.to_state.entity_id }} detected presence | Context: {{ states(home_context) }}"
                      entity_id: !input light_target
      - conditions:
          - condition: state
            entity_id: !input presence_entity
            state: "off"
        sequence:
          - delay:
              minutes: !input off_delay
          - condition: state
            entity_id: !input presence_entity
            state: "off"
          - service: light.turn_off
            target: !input light_target
          - choose:
              - conditions: "{{ enable_logging }}"
                sequence:
                  - service: logbook.log
                    data:
                      name: "Room Lighting"
                      message: >
                        "Room empty for {{ off_delay }} min → lights off | Context: {{ states(home_context) }}"
                      entity_id: !input light_target

==== FILE: /Users/jeff/Documents/Documents - Macbook-M3/homeassistant/ha_historical_context/execution_plan_adaptive_home_v_0.md (modified: 2026-05-18 17:03:43) ====

# Execution Plan — Adaptive Home v0.1

*Last edited: 2025-10-06*

You confirmed FP2 placement in **Open Plan** and **each bedroom** (room-level presence for now). This plan uses placeholders for zones that aren't fully zoned yet and builds on your **Home Context** sensor + meta layer.

## 0) Naming & Conventions (so everything stays readable)

- Areas: `openplan`, `bedroom1`, `bedroom2`, `hallway`, `bath1`, `bath2`.
- Groups: `light.<area>_all_lights`, `binary_sensor.<area>_motion` (if applicable), `binary_sensor.<area>_presence` (FP2/FP1E), `cover.<area>_*`, `climate.<area>_ac`.
- Helpers (existing + new):
  - `input_boolean.sleep_mode`, `input_boolean.guest_mode`, `input_boolean.override_mode`
  - New (optional): `input_boolean.focus_mode`, `input_boolean.recovery_mode`, `input_boolean.hydration_nags_enabled`
  - `input_number.hydration_interval_minutes` (e.g., 90)
  - `input_select.energy_state` → `high | medium | low | recovery`

Tip: add an Area to every device in HA; then use light groups per area to keep Adaptive Lighting simple.

## 1) Instances to Create (Adaptive Lighting)

Create one Adaptive Lighting instance per major area:
- `switch.adaptive_lighting_openplan`
- `switch.adaptive_lighting_bedroom1`
- `switch.adaptive_lighting_bedroom2`
- `switch.adaptive_lighting_hallway`
- `switch.adaptive_lighting_baths` (optional shared instance for both bathrooms)

Suggested room tuning (initial):
- Open Plan: min_brightness 30%, max_brightness 100%, sleep/overnight off at 23:30–06:30
- Bedroom(s): min_brightness 1–5%, max_brightness 60%, prefer warm nights
- Hallway: min_brightness 5–10% after 22:00; quick transitions
- Bathrooms: fixed night floor 3–5% when motion at night

## 2) Context Engine v2 (small additions that simplify logic)

```yaml
# templates.yaml (add alongside your Home Context)
- binary_sensor:
    - name: quiet_hours
      unique_id: quiet_hours
      state: >-
        {% set t = now().strftime('%H:%M') %}
        {{ t >= '23:00' or t < '06:30' }}
    - name: is_daylight
      unique_id: is_daylight
      state: >-
        {{ is_state('sun.sun','above_horizon') }}
    - name: anyone_home
      unique_id: anyone_home
      state: >-
        {{ not is_state('sensor.home_context','away') }}
```

## 3) Global Baseline v2 (use Adaptive Lighting + gentler actions)

```yaml
# automation: Home Context → Global Baseline (v2)
alias: Home Context → Global Baseline (v2)
mode: restart
trigger:
  - platform: state
    entity_id: sensor.home_context
action:
  - choose:
      - conditions: [ { condition: state, entity_id: sensor.home_context, state: 'override' } ]
        sequence:
          - service: logbook.log
            data: { name: Home Context, message: 'Override active — manual controls respected' }
      - conditions: [ { condition: state, entity_id: sensor.home_context, state: 'sleep' } ]
        sequence:
          - service: light.turn_off
            target: { entity_id: light.arc_lights }
          - service: climate.set_preset_mode
            target: { entity_id: [ climate.living_ac, climate.bedroom1_ac, climate.bedroom2_ac ] }
            data: { preset_mode: sleep }
          - service: cover.close_cover
            target: { entity_id: cover.openplan_curtains }
          - service: media_player.turn_off
            target: { entity_id: [ media_player.apple_tv, media_player.bedroom2_tv, media_player.living_homepods, media_player.bedroom1_homepod, media_player.bedroom2_homepod ] }
      - conditions: [ { condition: state, entity_id: sensor.home_context, state: 'away' } ]
        sequence:
          - service: light.turn_off
            target: { entity_id: light.arc_lights }
          - service: climate.turn_off
            target: { entity_id: [ climate.living_ac, climate.bedroom1_ac, climate.bedroom2_ac ] }
          - service: fan.turn_off
            target: { entity_id: [ fan.bedroom1_purifier, fan.bedroom1_humidifier ] }
          - service: cover.close_cover
            target: { entity_id: cover.openplan_curtains }
          - service: media_player.turn_off
            target: { entity_id: [ media_player.apple_tv, media_player.bedroom2_tv, media_player.living_homepods, media_player.bedroom1_homepod, media_player.bedroom2_homepod ] }
      - conditions: [ { condition: state, entity_id: sensor.home_context, state: 'normal' } ]
        sequence:
          - service: adaptive_lighting.apply
            target: { entity_id: [ light.arc_lights ] }
          - choose:
              - conditions:
                  - condition: numeric_state
                    entity_id: sensor.openplan_temp
                    above: 24
                  - condition: state
                    entity_id: binary_sensor.anyone_home
                    state: 'on'
                sequence:
                  - service: climate.set_hvac_mode
                    target: { entity_id: climate.living_ac }
                    data: { hvac_mode: cool }
          - choose:
              - conditions:
                  - condition: state
                    entity_id: binary_sensor.is_daylight
                    state: 'on'
                sequence:
                  - service: cover.open_cover
                    target: { entity_id: cover.openplan_curtains }
```

## 4) Reusable Room Blueprint — Presence-First Lighting (Adaptive-aware)

```yaml
blueprint:
  name: Room Presence Lighting (Adaptive-aware)
  description: FP2/occupancy-driven lighting that calls Adaptive Lighting; optional motion + off-delay.
  domain: automation
  input:
    presence_entity:
      name: Presence entity (FP2/FP1E)
      selector: { entity: { domain: binary_sensor } }
    light_target:
      name: Light group/entity for this room
      selector: { target: { entity: { domain: light } } }
    adaptive_switch:
      name: Adaptive Lighting switch for this room
      selector: { entity: { domain: switch } }
    sleep_mode:
      name: Sleep mode boolean
      default: input_boolean.sleep_mode
      selector: { entity: { domain: input_boolean } }
    guest_mode:
      name: Guest mode boolean
      default: input_boolean.guest_mode
      selector: { entity: { domain: input_boolean } }
    off_delay:
      name: Off delay when room empty (minutes)
      default: 5
      selector: { number: { min: 0, max: 60, step: 1 } }
    night_min_pct:
      name: Night minimum brightness (%)
      default: 5
      selector: { number: { min: 1, max: 30, step: 1 } }

mode: restart
trigger:
  - platform: state
    entity_id: !input presence_entity

condition: []
action:
  - choose:
      - conditions:
          - condition: state
            entity_id: !input presence_entity
            state: 'on'
          - condition: state
            entity_id: !input sleep_mode
            state: 'off'
        sequence:
          - service: light.turn_on
            target: !input light_target
          - service: adaptive_lighting.apply
            target: !input light_target
      - conditions:
          - condition: state
            entity_id: !input presence_entity
            state: 'on'
          - condition: state
            entity_id: !input sleep_mode
            state: 'on'
        sequence:
          - service: light.turn_on
            target: !input light_target
            data:
              brightness_pct: !input night_min_pct
      - conditions:
          - condition: state
            entity_id: !input presence_entity
            state: 'off'
        sequence:
          - delay: "00:{{ '%02d'|format((!input off_delay)|int) }}:00"
          - condition: state
            entity_id: !input presence_entity
            state: 'off'
          - service: light.turn_off
            target: !input light_target
```

Instantiate for: `openplan`, `bedroom1`, `bedroom2`, `hallway` (or use motion for hallways/baths).

## 5) Night Bathroom Blueprint — No-Glare Navigation

```yaml
blueprint:
  name: Night Bathroom Light
  description: Motion-based low-glare bathroom light during quiet hours; turns off after X minutes of no motion.
  domain: automation
  input:
    motion_entity:
      name: Bathroom motion
      selector: { entity: { domain: binary_sensor } }
    light_target:
      name: Bathroom light(s)
      selector: { target: { entity: { domain: light } } }
    off_delay:
      name: Off delay (minutes)
      default: 2
      selector: { number: { min: 1, max: 15, step: 1 } }

mode: restart
trigger:
  - platform: state
    entity_id: !input motion_entity

condition:
  - condition: state
    entity_id: binary_sensor.quiet_hours
    state: 'on'
action:
  - choose:
      - conditions: [ { condition: state, entity_id: !input motion_entity, state: 'on' } ]
        sequence:
          - service: light.turn_on
            target: !input light_target
            data: { brightness_pct: 3 }
      - conditions: [ { condition: state, entity_id: !input motion_entity, state: 'off' } ]
        sequence:
          - delay: "00:{{ '%02d'|format((!input off_delay)|int) }}:00"
          - condition: state
            entity_id: !input motion_entity
            state: 'off'
          - service: light.turn_off
            target: !input light_target
```

## 6) Arrival / Departure Routines (light, curtains, tone)

```yaml
alias: Arrival — Open Plan Warm Welcome
trigger:
  - platform: state
    entity_id: sensor.home_context
    to: 'normal'
condition:
  - condition: state
    entity_id: binary_sensor.is_daylight
    state: 'off'
action:
  - service: scene.turn_on
    target: { entity_id: scene.living_relax }
  - service: adaptive_lighting.apply
    target: { entity_id: light.arc_lights }
```

```yaml
alias: Departure — Energy Save
trigger:
  - platform: state
    entity_id: sensor.home_context
    to: 'away'
action:
  - service: light.turn_off
    target: { entity_id: all }
  - service: climate.turn_off
    target: { entity_id: [ climate.living_ac, climate.bedroom1_ac, climate.bedroom2_ac ] }
  - service: cover.close_cover
    target: { entity_id: cover.openplan_curtains }
```

## 7) Climate Guard (AC + Humidity)

```yaml
alias: Climate Guard — Living AC
mode: restart
trigger:
  - platform: state
    entity_id: sensor.openplan_temp
condition: []
action:
  - choose:
      - conditions:
          - condition: numeric_state
            entity_id: sensor.openplan_temp
            above: 24
          - condition: state
            entity_id: binary_sensor.anyone_home
            state: 'on'
        sequence:
          - service: climate.set_hvac_mode
            target: { entity_id: climate.living_ac }
            data: { hvac_mode: cool }
      - conditions:
          - condition: numeric_state
            entity_id: sensor.openplan_temp
            below: 22
        sequence:
          - service: climate.turn_off
            target: { entity_id: climate.living_ac }
```

```yaml
alias: Humidity Comfort — Bedroom 1
trigger:
  - platform: state
    entity_id: sensor.bedroom1_humidity
condition: []
action:
  - choose:
      - conditions: [ { condition: numeric_state, entity_id: sensor.bedroom1_humidity, below: 40 } ]
        sequence:
          - service: fan.turn_on
            target: { entity_id: fan.bedroom1_humidifier }
      - conditions: [ { condition: numeric_state, entity_id: sensor.bedroom1_humidity, above: 55 } ]
        sequence:
          - service: fan.turn_off
            target: { entity_id: fan.bedroom1_humidifier }
```

## 8) Wellness Cues (Hydration / Gentle Mornings)

```yaml
alias: Hydration Nudge — Open Plan
mode: single
trigger:
  - platform: time_pattern
    minutes: "/{{ states('input_number.hydration_interval_minutes') | int(90) }}"
condition:
  - condition: state
    entity_id: input_boolean.hydration_nags_enabled
    state: 'on'
  - condition: state
    entity_id: binary_sensor.anyone_home
    state: 'on'
  - condition: state
    entity_id: binary_sensor.quiet_hours
    state: 'off'
action:
  - service: tts.google_translate_say
    data:
      entity_id: media_player.living_homepods
      message: "Quick nudge: sip some water."
```

```yaml
alias: Gentle Morning — Ease-In Lights
trigger:
  - platform: state
    entity_id: input_boolean.sleep_mode
    to: 'off'
condition:
  - condition: time
    after: '05:30:00'
    before: '10:30:00'
action:
  - service: light.turn_on
    target: { entity_id: light.arc_lights }
    data: { brightness_pct: 35 }
  - service: adaptive_lighting.apply
    target: { entity_id: light.arc_lights }
```

## 9) Dashboard (Mushroom) Quick Controls

Create a Control view with:
- Chips: Sleep, Guest, Focus, Recovery, Override (all input_booleans)
- Tiles: Adaptive switches per room, AC modes, Curtains, Humidity targets
- Sensors: `home_context`, `quiet_hours`, temps, humidity

## 10) Build Order (safe + testable)

1. Helpers: booleans, number, select
2. Light groups per area
3. Adaptive Lighting instances per area
4. Template sensors (quiet_hours, is_daylight, anyone_home)
5. Blueprints (Room Presence Lighting; Night Bathroom)
6. Global Baseline v2
7. Arrival/Departure routines
8. Climate Guard & Humidity
9. Wellness Cues
10. Dashboard controls

## 11) Placeholders to Replace

- `light.arc_lights` → your Open Plan group
- `climate.*_ac` → your Dreo / Meaco entities
- `fan.bedroom1_humidifier` / `fan.bedroom1_purifier` → confirm exact ids
- `media_player.living_homepods` → the group you want to speak
- Presence entities for blueprint instances:
  - Open Plan: `binary_sensor.fp2_openplan_presence` (or equivalent)
  - Bedroom1: `binary_sensor.bedroom1_fp2_presence`
  - Bedroom2: `binary_sensor.bedroom2_fp2_presence`

==== FILE: /Users/jeff/Documents/Documents - Macbook-M3/homeassistant/ha_historical_context/examples/helpers.yaml (modified: 2026-05-18 17:14:29) ====

sensor:
  - platform: systemmonitor
    resources:
      - type: memory_use_percent
      - type: processor_use
      - type: disk_use_percent
      - type: last_boot
  - platform: file
    name: HA Database Size
    file_path: /config/home-assistant_v2.db
    value_template: "{{ (value | float(0) / 1048576) | round(1) }}"
    unit_of_measurement: "MB"

input_boolean:
  override_mode:
    name: Override Mode
    icon: mdi:tune-variant
  sleep_mode:
    name: Sleep Mode
    icon: mdi:sleep
  away_mode:
    name: Away Mode
    icon: mdi:exit-run
  guest_mode:
    name: Guest Mode
    icon: mdi:account-heart
  focus_mode:
    name: Focus Mode
    icon: mdi:target-variant
  recovery_mode:
    name: Recovery Mode
    icon: mdi:heart-pulse
  hydration_nags_enabled:
    name: Hydration Nags Enabled
    icon: mdi:cup-water

input_select:
  energy_state:
    name: Energy State
    options:
      - enter
      - active
      - focus
      - ease
      - rest
    icon: mdi:pulse

input_number:
  motion_timeout_default:
    name: Motion Timeout Default
    min: 0
    max: 60
    step: 1
    unit_of_measurement: minutes
    icon: mdi:timer

binary_sensor:
  quiet_hours:
    name: Quiet Hours
    device_class: running
  anyone_home:
    name: Anyone Home
    device_class: occupancy
  is_daylight:
    name: Is Daylight
    device_class: light

==== FILE: /Users/jeff/Documents/Documents - Macbook-M3/homeassistant/ha_historical_context/examples/scripts.yaml (modified: 2026-05-18 17:14:29) ====

shell_command:
  write_automation: bash /config/scripts/write_yaml.sh "{{ file_name }}" "{{ automation_yaml }}"

gpt_apply_automation:
  alias: GPT Apply Automation
  mode: single
  sequence:
    - data:
        automation_yaml: "{{ automation_yaml }}"
        file_name: "{{ file_name }}"
      action: shell_command.write_automation
    - action: automation.reload

==== FILE: /Users/jeff/Documents/Documents - Macbook-M3/homeassistant/ship_devices_inventor.md (modified: 2026-05-18 17:03:45) ====

# Smart Home Devices & Hubs — Full Inventory

Created by: Jefffffff
Created time: 13 January 2026 01:36
Category: Smart Home
Summary: Complete smart home device inventory including hubs, sensors, lighting, climate, media, and room-by-room mapping

## Overview
Complete inventory of all smart home hubs, bridges, and IoT devices. Organized by category with room-by-room mapping for spatial reference. Includes quantities, models, status, and integration notes.

## Smart Home Hubs & Bridges

### Aqara M3 Hub
- Role: Zigbee/Matter bridge
- Primary use: Scenes, sensors, and Aqara device control
- Connectivity: Wired ethernet (production)
- Integration: Home Assistant, Apple HomeKit (Matter), Aqara app
- Status: Production

### Philips Hue Bridge Pro
- Role: Lighting control for all rooms
- Coverage: All Hue lights, sensors, switches, dimmers, and buttons across flat
- Connectivity: Wired ethernet (production)
- Integration: Home Assistant, Apple HomeKit, Hue app
- Status: Production

### Apple HomeKit
- Hubs: Apple TV (x2), HomePods (x3)
- Primary hub: Apple TV (Open Plan, wired for reliability)
- Role: Orchestration, presence detection, automation triggers, Siri control, media playback
- Integration: Native HomeKit devices + Home Assistant bridge
- Status: Production

### Switchbot Hub 3
- Role: Switchbot device bridge (blinds)
- Connectivity: Wifi
- Integration: Home Assistant, Switchbot app
- Status: Production

### Google Home / Nest Mini
- Role: Voice assistant, media playback, smart home interface, Google Assistant routines
- Quantity: 1x Google Nest Mini
- Integration: Home Assistant, Google Home app, Chromecast
- Status: Production

## IoT Devices by Category

### Presence, Motion & Door Sensors

Hue Motion Sensors (x2) — Locations: Bedroom 2, Hallway — Use: Motion-triggered lighting, occupancy detection — Integration: Hue Bridge → Home Assistant

Aqara Motion Sensors (x2) — Locations: Various — Use: Motion-triggered automation, security monitoring — Integration: Aqara M3 Hub → Home Assistant

Aqara FP1E Presence Sensor (x1) — Location: Bedroom 2 — Technology: mmWave radar (detects stationary presence) — Use: Presence-aware lighting and climate control — Integration: Aqara M3 Hub → Home Assistant

Aqara FP2 Presence Sensors (x3) — Locations: Open Plan, Bedroom 1, Hallway (pending final config) — Technology: mmWave radar with zone detection — Use: Multi-zone presence detection, fine-grained automation triggers — Integration: Matter → HomeKit/Home Assistant

Aqara Door/Window Sensors (x7 + 1x FP2 Matter-compatible) — Locations: Main entry, bedrooms, bathrooms, laundry, storage — Use: Open/close detection, security monitoring, automation triggers — Integration: Aqara M3 Hub → Home Assistant

### Lighting & Control Interfaces

Aqara Wireless H1 Switches (x2) — Use: Scene triggers, wireless control points — Integration: Aqara M3 Hub → Home Assistant

Hue Dimmer Switches (x4) — Locations: Bedrooms, Open Plan, Hallway — Use: Lighting scenes, dimming, on/off control

Hue Tap Dial Switches (x3) — Locations: Bedrooms, Open Plan — Use: Rotary dimming, multi-scene control

Hue Smart Buttons (x3) — Locations: Various — Use: Single-action triggers, bedside controls

Switchbot Switch Tongue (x1) — Use: Physical switch automation (non-smart switch control)

Philips Hue: Full flat coverage GU10 White Ambiance or Colour ceiling lights in all rooms; ambient colour bulbs/lamps; Gradient Lightstrip accent lighting. Control: Hue app, HomeKit, Home Assistant, voice assistants, physical switches/dimmers.

Govee Colour Light Strip (x1) — accent lighting, RGB effects, music sync — Integration: Govee app, Home Assistant (via API)

### Climate, Environment & Window Treatments

Aqara Curtain Controller E1 (x2, paired) — Open Plan main windows — Integration: Aqara M3 Hub → Home Assistant

Switchbot Roller Blinds: Grey L (x2), Grey M (x2) — Bedrooms, bathrooms — Integration: Switchbot Hub 3 → Home Assistant

Dreo Smart Humidifiers: HM713S (6L), HM311S (4L) — Bedrooms — Integration: Dreo app, Home Assistant (via API)

Levoit Dual 200S Humidifier — Open Plan or Bedroom — Integration: VeSync app, Home Assistant (via API)

Levoit Air 300S Purifier — Bedroom 1 — HEPA, auto mode, air quality sensor, sleep mode — Integration: VeSync app, Home Assistant (via API)

Dreo Smart Portable AC (14,000 BTU – 516S) — Open Plan or Bedroom (mobile)

Meaco Smart Portable AC (12,000 BTU Pro CH) — Bedroom or Open Plan (mobile)

### Scent, Health & Utility

Muji Diffuser (x1) — manual control, no smart integration

Aera Full-Size (x2) — Open Plan, Bedroom — app-controlled scent intensity

Aera Minis (x4) — distributed across rooms

Withings Sleep Mat — Bedroom 1 (under mattress) — sleep tracking, heart rate, breathing — potential HA webhook

Oura Gen 4 Ring — wearable sleep/health tracker — potential API → HA

Larq Pitcher & Bottle — UV-C self-cleaning water purification — no integration

Eufy Smart Scale — weight, body composition — potential HA integration

Eufy S1 Omni Pro RoboVac & Mop — entire flat — Integration: Eufy app, Home Assistant (via API or Tuya)

### Media, Audio & Entertainment

Apple TV (x2) — Open Plan (wired, primary HomeKit hub), Bedroom (wireless, secondary)

Samsung Serif 50" (Open Plan) — 4K QLED, AirPlay 2, HDMI-CEC — Integration: Home Assistant (SmartThings/Samsung API), HomeKit (AirPlay)

Samsung UHD 50" Black (Bedroom) — same integration path

HomePod (x1, Open Plan) — music, Siri, HomeKit hub, intercom

HomePod Minis (x2) — Bedrooms

Google Nest Mini (x1) — Open Plan or Bedroom

Samsung Q700D Soundbar with Subwoofer — in storage / pending replacement

## Room-by-Room Device Mapping

### Open Plan (Core)
Lighting: Philips Hue GU10 ceiling, Hue Colour ambient, Gradient Lightstrip.
Presence: Aqara FP2 mmWave.
Window Treatments: Aqara Curtain Controllers E1 (x2, paired).
Climate: Dreo Portable AC or Meaco AC; Levoit Dual 200S Humidifier (seasonal).
Media: Apple TV (wired), Samsung Serif 50" TV, HomePod, Q700D Soundbar (storage/pending).

### Bedroom 1 (Alpha)
Lighting: Hue GU10 ceiling (x6), Hue Colour gradient/ambient, Hue lamps.
Presence: Aqara FP2 mmWave, Aqara door sensor.
Window Treatments: Switchbot Roller Blinds.
Climate: Dreo Humidifier, Levoit Air 300S Purifier.
Health: Withings Sleep Mat.
Media: Samsung UHD 50" Black TV, HomePod Mini.

### Bedroom 2 (Beta)
Lighting: Hue White Ambiance ceiling.
Presence: Aqara FP1E, Aqara FP2, Aqara door sensor, Hue motion sensor.
Window Treatments: Switchbot Roller Blinds.

### Hallway (Pass)
Lighting: Hue ceiling. Presence: Hue motion, Aqara FP2/FP1E (pending), Aqara door/contact sensors.

### Laundry/Utility (Chaos)
Lighting: Hue ceiling. Sensors: Aqara door sensors. Utilities: Eufy S1 Omni Pro dock.
Infrastructure Hubs (all here): Aqara M3 Hub, Philips Hue Bridge Pro, Switchbot Hub 3, network equipment (Unifi, switches).

## Integration Summary
Primary Control Platform: Home Assistant (all devices integrated).
Secondary Platforms: Apple HomeKit (Hue, Aqara Matter devices, Apple TVs, HomePods), Google Home (Nest Mini, Chromecast), native apps (Hue, Aqara, Switchbot, Dreo, Levoit, Eufy, etc.).
Voice Control: Siri (HomePods, Apple TVs, iPhone), Google Assistant (Nest Mini).
Automation Engine: Home Assistant + Apple Home automations (redundant triggers for reliability).

## Documentation Notes
- All devices catalogued with model numbers, quantities, locations, and integration paths
- Room mapping provides spatial reference for troubleshooting and planning
- Hub inventory shows control topology (which hub manages which device types)
- Spare/retired smart home hardware tracked separately in compute/infrastructure docs

==== FILE: /Users/jeff/Documents/Documents - Macbook-M3/homeassistant/project_ship_full_thread_compilation.md (modified: 2026-05-18 17:03:41) ====

# Project SHIP — Full Thread Recap and Reusable Artefact Compilation

## Purpose
This document compiles the full thread arc into one reusable artefact: chronological recap, reusable drafts/models/rules/code sketches/file structures/routes, proposed-but-unused items, invalidated items, final active interaction frame.

## 1. Thread Arc — Chronological Reconstruction

Phase 1 — Smart-home entry point: renter constraints, existing devices, platforms, hubs, room structure.

Phase 2 — Architectural framing of the flat: floorplan image and home registry introduced. Seven-room system: Open Plan/Core, Bedroom 1/Alpha, Bedroom 2/Beta, Hallway/Pass, Ensuite/Throne, Secondary Bathroom/Splash, Utility/Chaos.

Phase 3 — Automation philosophy and room-brain ideas: presence-driven logic, circadian lighting, room-level state machines, path lighting and night navigation, room-brain architecture, whole-home modes and context variables.

Phase 4 — Review of existing automation blueprints: SHIP • Follow-Me Atmosphere (Ambient); SHIP • Intelligent Presence Lighting v2; SHIP • Night Path (Hallway ↔ Bathroom).

Phase 5 — Recognition of SHIP as broader intelligence system: shift from "smart home project" to system design, modular automation framework, AI/agentic stack ideas, ambient intelligence platform. SHIP = Smart Home Intelligence Project.

Phase 6 — Anchor and context bundle rehydration: SHIP_Anchor_v1.0.json, SHIP_Anchor_v1.1.json, home_registry.json, homelab_overview.txt, homelab_minimal_knowledge_base.json, rooms_breakdown.json, Floorplan - 2D Map.pdf, smart_home_ai_automation_lab_notebook.md, ship_devices_inventor.md, Smart Home Summary.txt.

Phase 7 — Runtime spine: Custom GPT → Responses API → Backend Brain → Home Assistant → Flat. Backend defined as control layer between AI and Home Assistant.

Phase 8 — Backend v0 architecture and scaffold: SHIP Backend v0 architecture spec, endpoint set, module breakdown, FastAPI-based scaffold, Docker compose structure, model indexing layer, minimal deployment path on the homelab. Zip bundle generated with starter backend scaffold.

Phase 9 — Deployment workflow and homelab transfer: scp, ssh, unzip, SSH config aliases, rsync-based dev workflow, one-command deploy functions.

Phase 10 — Structural organisation discussion: how to structure SHIP for Codex CLI, how SHIP fits a larger life-system structure, taxonomy tension, filesystem-behaviour-as-structural-model attempts.

Phase 11 — Epistemic rupture and correction: user challenged overreach, behavioural inference, reframing, explanatory assertion beyond evidence, defensive posture, anthropomorphic language, deviation from stated priorities. Hard reset triggered.

Phase 12 — Final interaction state: updated interaction frame, binding constraints, invalidated behaviour classes, request for this compiled recap artefact.

## 2. Reusable Artefacts and Drafts Explored

### 2.1 Canonical / project context artefacts
SHIP_Anchor_v1.0.json, SHIP_Anchor_v1.1.json, home_registry.json, homelab_overview.txt, homelab_minimal_knowledge_base.json, rooms_breakdown.json, Floorplan - 2D Map.pdf, smart_home_ai_automation_lab_notebook.md, ship_devices_inventor.md, Smart Home Summary.txt.

### 2.2 Automation blueprints reviewed
1. SHIP • Follow-Me Atmosphere (Ambient) — daypart calculation, lux gating, off-delay helper, transition helper, ambient enable switch.
2. SHIP • Intelligent Presence Lighting v2 — adaptive presence lighting, dynamic brightness and CT, profile abstraction (circadian / warm_evening / bright_focus / night_safe), manual override attempt, off-delay logic.
3. SHIP • Night Path (Hallway ↔ Bathroom) — night window definition, linked hallway/bathroom path lighting, low-brightness safe pathing, delayed clear logic.

### 2.3 Core architecture and runtime drafts
Runtime spine: Custom GPT → Responses API → Backend Brain → Home Assistant → Flat.
Backend roles: state engine, validation engine, deployment engine, simulation engine.
Minimal backend modules: Home Model Service, Live State Service, Validation Service, Execution Service, Audit Log.

### 2.4 SHIP Backend v0 endpoints
GET /health, GET /home-model, GET /rooms, GET /devices, GET /rooms/{room_id}, GET /rooms/{room_id}/entities, GET /live-state/entity/{entity_id}, GET /live-state/room/{room_id}, POST /validate/action, POST /execute/action.
Allowed execution services (v0): light.turn_on, light.turn_off, scene.turn_on, cover.set_cover_position.

### 2.5 Backend scaffold and code artefacts
Proposed structure:
```
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
```
Most important upgrade: `app/model_index.py` — builds queryable indexes from home_registry.json; maps rooms, aliases, entities, devices, capabilities, room→entities. Key lookups: rooms_by_id, room_aliases, devices_by_id, entities_by_id, entities_by_room.

### 2.6 Backend deployment and homelab route artefacts
Transfer route: scp zip to /srv/apps/ → ssh servers → unzip → docker compose up -d --build.
Commands explored: `scp ~/Downloads/ship-backend-v0.zip servers:/srv/apps/`, `ssh servers`, `cd /srv/apps`, `unzip ship-backend-v0.zip`, `cd ship-backend`, `docker compose up -d --build`. If unzip missing: `sudo apt update && sudo apt install unzip`.
SSH config proposal:
```
Host homelab
    HostName 192.168.1.39
    User sysadmin
```
rsync dev loop: `rsync -av ~/dev/ship-backend/ homelab:/srv/apps/ship-backend/` (and `--delete` variant).
zsh helpers: `alias ship-push='rsync -av --delete ~/dev/ship-backend/ homelab:/srv/apps/ship-backend/'`, `alias ship-ssh='ssh homelab'`.
Deploy function: `ship-deploy() { rsync -av --delete ~/dev/ship-backend/ homelab:/srv/apps/ship-backend/ && ssh homelab 'cd /srv/apps/ship-backend && docker compose up -d --build' }`.

### 2.7 Codex / repo structure artefacts
Proposed SHIP repo layout includes README.md, AGENTS.md, docs/ (anchor, architecture, homelab, decisions), data/ (registry, floorplans, exports), backend/ (app + tests), prompts/, notebooks/, skills/ship-architect/SKILL.md.

### 2.8 Naming and entity modelling artefacts
Machine IDs vs human names: stable machine IDs in code, human-friendly names for voice/display.
Examples: light.core_living_ceiling → Living Room Ceiling; light.alpha_bedside_r → Main Bedroom Bedside Right; light.beta_all → Spare Bedroom Lights.
Patterns: light.<code>_<area?>_<layer>; light.<code>_<subzone>_<surface>.
Open plan proposals: light.core_living_ceiling, light.core_dining_ceiling, light.core_kitchen_ceiling, light.core_ceiling, light.core_all, light.core_main_ceiling, light.core_main_all.
Lighting inventory JSON principles: top-level entries are actionable control surfaces; individual ceiling bulbs excluded from top-level model; no integration bindings; use status/type/form_factor/capabilities.

### 2.9 Structural / organisational artefacts explored
Environment / Runtime / Control Model / Intelligence; README.md / ANCHOR.md / WORLD_MODEL.md / RUNTIME.md / BACKEND.md; Life_OS nesting under Projects/Active/SHIP; status-style structure (surface / workshop / canon / runtime / residue) — later explicitly challenged, not canonical.

### 2.10 Epistemic / interaction rule artefacts
Failure identified: unauthorised reframing, explanatory narration after correction, interpretive expansion, repeated overstep.
Root causes: continuation bias, frame override, assertion generation under constraint conflict.
Discarded behaviours: reframing user statements, explaining/defending prior responses, interpreting user critique, continuing analysis after a correction requiring halt.
Final active constraints: C1 User definitions are authoritative; C2 No reframing/reinterpretation of user assertions; C3 No explanatory narration unless requested; C4 Corrections are binding and immediately applied; C5 Responses remain structurally minimal and aligned to user's frame; C6 No independent agendas/models/reframings.
Invalidated behaviour classes: B1 Behavioural inference about the user; B2 Problem reframing; B3 Defensive explanation of prior outputs; B4 Expansion beyond scope of user's directive.
Operational rule: Response = function(user_instruction, constraints C1–C6).

## 3. Proposed but Unused / Not Stabilised
Room-brain architecture as main organising model; broad house_mode systems beyond concept phase; larger agent set (Lighting Agent, Climate Agent, Transit Agent, Presence Agent); full multi-agent SHIP framing; broad Life_OS nesting; status-based behavioural structure as asserted explanation; claims about "the real issue"; evidence-strength/claim-strength framework when presented as mechanically enforced.

## 4. Strongest reusable outputs from the thread
Runtime spine; SHIP_Anchor_v1.1.json; home_registry.json; homelab_overview.txt; SHIP Backend v0 architecture; backend scaffold zip; model_index.py approach; homelab transfer/rsync deploy workflow; final interaction constraints C1–C6; invalidated behaviour classes B1–B4.

## 5. Minimal compact recap
The thread began as a smart-home assistance conversation and evolved into SHIP: an AI-assisted smart-home intelligence platform. The flat, devices, homelab, and anchors were formalised through uploaded artefacts. The runtime spine stabilised as Custom GPT → Responses API → Backend Brain → Home Assistant → Flat. Focus shifted to making the backend real before broader agent ideas. A backend v0 architecture, scaffold, and deployment path were drafted. Repo/Codex structures, naming schemes, and broader organisational structures were explored. The conversation then encountered a major epistemic/interaction rupture around overreach, reframing, and explanatory assertion, and was reset under explicit user-defined constraints. This document compiles the whole arc, including active outputs, unused drafts, and invalidated proposals.

==== FILE: /Users/jeff/Documents/Documents - Macbook-M3/homeassistant/ha_cleaned_yaml/README.md (modified: 2026-05-18 17:12:37) ====

# HA Cleaned YAML Set (IDs de-duped)

## What changed
- Removed duplicate automation IDs:
  - `open_plan_follow_me_lighting` had two versions → consolidated into one blueprint instance.
  - `bedroom_daily_rhythm_ceiling` had two versions → kept the expanded override variant.
- Converted "Follow Me" style automations to the `Room • Follow-Me Atmospheric Lighting` blueprint so you only maintain logic once.

## Important
Avoid running two automations that control the same light(s) from the same sensor(s) — they can fight.

## Suggested placement
- `blueprints/automation/*.yaml` → Home Assistant blueprints folder
- `packages/*.yaml` → requires `homeassistant: packages: !include_dir_named packages`
- `lovelace/lighting_brain_view.yaml` → paste into dashboard YAML mode (or merge into an existing view)

==== FILE: /Users/jeff/Documents/Documents - Macbook-M3/homeassistant/ha_cleaned_yaml/blueprints/automation/bedroom_suite_bath_path.yaml (modified: 2026-05-18 17:12:36) ====

blueprint:
  name: Bedroom Suite • Bathroom Path
  description: >
    Coordinates wardrobe + bathroom lighting for bathroom trips.
    Triggered by wardrobe/bathroom motion; applies ultra-low warm lighting at night.
  domain: automation
  input:
    wardrobe_motion:
      name: Wardrobe motion / presence sensor
      selector:
        entity:
          domain: binary_sensor
    bathroom_motion:
      name: Bathroom motion sensor
      selector:
        entity:
          domain: binary_sensor
    wardrobe_light:
      name: Wardrobe ceiling light / group
      selector:
        target:
          entity:
            domain: light
    bathroom_light:
      name: Bathroom ceiling light / group
      selector:
        target:
          entity:
            domain: light
    night_start:
      name: Night starts at
      default: "23:00:00"
      selector:
        time: {}
    night_end:
      name: Night ends at
      default: "06:00:00"
      selector:
        time: {}
    morning_start:
      name: Morning starts at
      default: "06:00:00"
      selector:
        time: {}
    morning_end:
      name: Morning ends at
      default: "09:30:00"
      selector:
        time: {}
    evening_start:
      name: Evening starts at
      default: "16:00:00"
      selector:
        time: {}
    day_brightness:
      name: Day brightness (%)
      default: 80
      selector:
        number:
          min: 1
          max: 100
          unit_of_measurement: "%"
    day_color_temp:
      name: Day color temperature (mired)
      default: 300
      selector:
        number:
          min: 250
          max: 500
          unit_of_measurement: "mired"
    evening_brightness:
      name: Evening brightness (%)
      default: 60
      selector:
        number:
          min: 1
          max: 100
          unit_of_measurement: "%"
    evening_color_temp:
      name: Evening color temperature (mired)
      default: 340
      selector:
        number:
          min: 250
          max: 500
          unit_of_measurement: "mired"
    night_brightness_wardrobe:
      name: Night brightness – wardrobe (%)
      default: 18
      selector:
        number:
          min: 1
          max: 40
          unit_of_measurement: "%"
    night_brightness_bathroom:
      name: Night brightness – bathroom (%)
      default: 10
      selector:
        number:
          min: 1
          max: 40
          unit_of_measurement: "%"
    night_color_temp:
      name: Night color temperature (mired)
      default: 430
      selector:
        number:
          min: 300
          max: 500
          unit_of_measurement: "mired"
    off_delay:
      name: Off delay after last movement (minutes)
      default: 4
      selector:
        number:
          min: 1
          max: 30
          unit_of_measurement: minutes
          mode: slider
    fade_in_transition:
      name: Fade-in time (seconds)
      default: 2
      selector:
        number:
          min: 0
          max: 20
          unit_of_measurement: "s"
    fade_out_transition:
      name: Fade-out time (seconds)
      default: 4
      selector:
        number:
          min: 0
          max: 30
          unit_of_measurement: "s"

mode: restart

variables:
  off_delay: !input off_delay
  fade_in_transition: !input fade_in_transition
  fade_out_transition: !input fade_out_transition
  night_start: !input night_start
  night_end: !input night_end
  morning_start: !input morning_start
  morning_end: !input morning_end
  evening_start: !input evening_start
  day_brightness: !input day_brightness
  day_color_temp: !input day_color_temp
  evening_brightness: !input evening_brightness
  evening_color_temp: !input evening_color_temp
  night_brightness_wardrobe: !input night_brightness_wardrobe
  night_brightness_bathroom: !input night_brightness_bathroom
  night_color_temp: !input night_color_temp

trigger:
  - id: wardrobe_motion_on
    platform: state
    entity_id: !input wardrobe_motion
    to: "on"
  - id: bathroom_motion_on
    platform: state
    entity_id: !input bathroom_motion
    to: "on"
  - id: wardrobe_motion_off
    platform: state
    entity_id: !input wardrobe_motion
    to: "off"
  - id: bathroom_motion_off
    platform: state
    entity_id: !input bathroom_motion
    to: "off"

action:
  - choose:
      - conditions:
          - condition: or
            conditions:
              - condition: trigger
                id: wardrobe_motion_on
              - condition: trigger
                id: bathroom_motion_on
        sequence:
          - condition: numeric_state
            entity_id: sun.sun
            attribute: elevation
            below: 20
          - choose:
              - conditions:
                  - condition: or
                    conditions:
                      - condition: time
                        after: !input night_start
                      - condition: time
                        before: !input night_end
                sequence:
                  - service: light.turn_on
                    target: !input wardrobe_light
                    data:
                      brightness_pct: "{{ night_brightness_wardrobe | int }}"
                      color_temp: "{{ night_color_temp | int }}"
                      transition: "{{ fade_in_transition | int }}"
                  - service: light.turn_on
                    target: !input bathroom_light
                    data:
                      brightness_pct: "{{ night_brightness_bathroom | int }}"
                      color_temp: "{{ night_color_temp | int }}"
                      transition: "{{ fade_in_transition | int }}"
              - conditions:
                  - condition: time
                    after: !input morning_start
                    before: !input morning_end
                sequence:
                  - service: light.turn_on
                    target: !input bathroom_light
                    data:
                      brightness_pct: 60
                      color_temp: 320
                      transition: "{{ fade_in_transition | int }}"
                  - service: light.turn_on
                    target: !input wardrobe_light
                    data:
                      brightness_pct: 50
                      color_temp: 320
                      transition: "{{ fade_in_transition | int }}"
              - conditions:
                  - condition: time
                    after: !input evening_start
                    before: !input night_start
                sequence:
                  - service: light.turn_on
                    target: !input bathroom_light
                    data:
                      brightness_pct: "{{ evening_brightness | int }}"
                      color_temp: "{{ evening_color_temp | int }}"
                      transition: "{{ fade_in_transition | int }}"
                  - service: light.turn_on
                    target: !input wardrobe_light
                    data:
                      brightness_pct: "{{ evening_brightness | int }}"
                      color_temp: "{{ evening_color_temp | int }}"
                      transition: "{{ fade_in_transition | int }}"
            default:
              - service: light.turn_on
                target: !input bathroom_light
                data:
                  brightness_pct: "{{ day_brightness | int }}"
                  color_temp: "{{ day_color_temp | int }}"
                  transition: "{{ fade_in_transition | int }}"
              - service: light.turn_on
                target: !input wardrobe_light
                data:
                  brightness_pct: "{{ day_brightness | int }}"
                  color_temp: "{{ day_color_temp | int }}"
                  transition: "{{ fade_in_transition | int }}"
      - conditions:
          - condition: or
            conditions:
              - condition: trigger
                id: wardrobe_motion_off
              - condition: trigger
                id: bathroom_motion_off
        sequence:
          - delay:
              minutes: "{{ off_delay | int }}"
          - condition: state
            entity_id: !input wardrobe_motion
            state: "off"
          - condition: state
            entity_id: !input bathroom_motion
            state: "off"
          - service: light.turn_off
            target: !input bathroom_light
            data:
              transition: "{{ fade_out_transition | int }}"
          - service: light.turn_off
            target: !input wardrobe_light
            data:
              transition: "{{ fade_out_transition | int }}"

==== FILE: /Users/jeff/Documents/Documents - Macbook-M3/homeassistant/ha_cleaned_yaml/blueprints/automation/room_follow_me_atmosphere.yaml (modified: 2026-05-18 17:12:36) ====

blueprint:
  name: Room • Follow-Me Atmospheric Lighting
  description: >
    Fade-in / fade-out atmospheric lighting that reacts to motion/presence.
    Uses an "evening" profile and a "night (sleepy)" profile. Only runs when
    it's dark outside (sun elevation below threshold).
  domain: automation
  input:
    sensor_entity:
      name: Motion / Presence Sensor
      selector:
        entity:
          domain: binary_sensor
    light_target:
      name: Light or Light Group
      selector:
        target:
          entity:
            domain: light
    off_delay:
      name: Off delay (minutes)
      default: 4
      selector:
        number:
          min: 0
          max: 60
          unit_of_measurement: minutes
          mode: slider
    dark_elevation_below:
      name: Run only when sun elevation below
      default: 0
      selector:
        number:
          min: -10
          max: 30
          step: 1
          unit_of_measurement: "°"
    evening_start:
      name: Evening starts at
      default: "16:00:00"
      selector:
        time: {}
    night_start:
      name: Night (sleepy) starts at
      default: "22:30:00"
      selector:
        time: {}
    morning_end:
      name: Night ends at
      default: "06:00:00"
      selector:
        time: {}
    evening_brightness:
      name: Evening brightness (%)
      default: 60
      selector:
        number:
          min: 1
          max: 100
          unit_of_measurement: "%"
    evening_color_temp:
      name: Evening color temperature (mired)
      default: 350
      selector:
        number:
          min: 250
          max: 500
          unit_of_measurement: "mired"
    night_brightness:
      name: Night brightness (%)
      default: 18
      selector:
        number:
          min: 1
          max: 50
          unit_of_measurement: "%"
    night_color_temp:
      name: Night color temperature (mired)
      default: 400
      selector:
        number:
          min: 300
          max: 500
          unit_of_measurement: "mired"
    fade_in_transition:
      name: Fade-in time (seconds)
      default: 4
      selector:
        number:
          min: 0
          max: 30
          unit_of_measurement: "s"
    fade_out_transition:
      name: Fade-out time (seconds)
      default: 6
      selector:
        number:
          min: 0
          max: 60
          unit_of_measurement: "s"

mode: restart

variables:
  off_delay: !input off_delay
  dark_elevation_below: !input dark_elevation_below
  evening_start: !input evening_start
  night_start: !input night_start
  morning_end: !input morning_end
  evening_brightness: !input evening_brightness
  evening_color_temp: !input evening_color_temp
  night_brightness: !input night_brightness
  night_color_temp: !input night_color_temp
  fade_in_transition: !input fade_in_transition
  fade_out_transition: !input fade_out_transition

trigger:
  - id: presence_on
    platform: state
    entity_id: !input sensor_entity
    to: "on"
  - id: presence_off
    platform: state
    entity_id: !input sensor_entity
    to: "off"

action:
  - choose:
      - conditions:
          - condition: trigger
            id: presence_on
          - condition: numeric_state
            entity_id: sun.sun
            attribute: elevation
            below: !input dark_elevation_below
        sequence:
          - choose:
              - conditions:
                  - condition: time
                    after: !input evening_start
                    before: !input night_start
                sequence:
                  - service: light.turn_on
                    target: !input light_target
                    data:
                      brightness_pct: "{{ evening_brightness | int }}"
                      color_temp: "{{ evening_color_temp | int }}"
                      transition: "{{ fade_in_transition | int }}"
              - conditions:
                  - condition: or
                    conditions:
                      - condition: time
                        after: !input night_start
                      - condition: time
                        before: !input morning_end
                sequence:
                  - service: light.turn_on
                    target: !input light_target
                    data:
                      brightness_pct: "{{ night_brightness | int }}"
                      color_temp: "{{ night_color_temp | int }}"
                      transition: "{{ fade_in_transition | int }}"
            default:
              - service: light.turn_on
                target: !input light_target
                data:
                  brightness_pct: "{{ evening_brightness | int }}"
                  color_temp: "{{ evening_color_temp | int }}"
                  transition: "{{ fade_in_transition | int }}"
      - conditions:
          - condition: trigger
            id: presence_off
        sequence:
          - delay:
              minutes: "{{ off_delay | int }}"
          - condition: state
            entity_id: !input sensor_entity
            state: "off"
          - service: light.turn_off
            target: !input light_target
            data:
              transition: "{{ fade_out_transition | int }}"

==== FILE: /Users/jeff/Documents/Documents - Macbook-M3/homeassistant/ha_cleaned_yaml/packages/lighting_automations.yaml (modified: 2026-05-18 17:12:39) ====

# Cleaned automations (duplicate IDs removed).
#
# NOTE: Avoid running two automations that control the same lights from the same sensors,
# otherwise they can fight each other. This set is designed to be non-overlapping.

automation:
  - id: open_plan_follow_me_atmosphere
    alias: "Open Plan • Follow-Me Atmosphere"
    mode: restart
    use_blueprint:
      path: room_follow_me_atmosphere.yaml
      input:
        sensor_entity: binary_sensor.fp2_openplan_room
        light_target:
          entity_id: light.openplan_ceiling_lights_2
        off_delay: 4
        dark_elevation_below: 0
        evening_start: "16:00:00"
        night_start: "22:30:00"
        morning_end: "06:00:00"
        evening_brightness: 65
        evening_color_temp: 350
        night_brightness: 18
        night_color_temp: 400
        fade_in_transition: 4
        fade_out_transition: 6

  - id: bedroom2_daily_rhythm_ceiling
    alias: "Bedroom 2 • Daily Rhythm Ceiling"
    mode: restart
    use_blueprint:
      path: ceiling_daily_rhythm_presence.yaml
      input:
        sensor_entity: binary_sensor.bedroom_2_fp1e_occupancy_sensor
        light_target:
          entity_id: light.beta_bedroom_ceiling_group
        sun_elevation_below: 15
        off_delay: 7
        enable_daytime: false
        morning_brightness: 40
        morning_color_temp: 330
        day_brightness: 60
        day_color_temp: 310
        evening_brightness: 40
        evening_color_temp: 360
        night_brightness: 12
        night_color_temp: 430
        fade_in_transition: 5
        fade_out_transition: 8

  - id: bedroom2_suite_bath_path
    alias: "Bedroom 2 Suite • Bathroom Path"
    mode: restart
    use_blueprint:
      path: bedroom_suite_bath_path.yaml
      input:
        wardrobe_motion: binary_sensor.bedroom_2_motion
        bathroom_motion: binary_sensor.front_bath_motion
        wardrobe_light:
          entity_id: light.beta_flex_ceiling_lights
        bathroom_light:
          entity_id: light.splash_ceiling_group
        off_delay: 4
        day_brightness: 80
        day_color_temp: 300
        evening_brightness: 60
        evening_color_temp: 340
        night_brightness_wardrobe: 18
        night_brightness_bathroom: 8
        night_color_temp: 430
        fade_in_transition: 2
        fade_out_transition: 4

==== FILE: /Users/jeff/Documents/Documents - Macbook-M3/homeassistant/ha_cleaned_yaml/packages/light_groups.yaml (modified: 2026-05-18 17:12:39) ====

light:
  - platform: group
    name: Bedroom2 Ceiling
    unique_id: bedroom2_ceiling_group
    entities:
      - light.ceiling_bedroom2_tl
      - light.ceiling_bedroom2_tr
      - light.ceiling_rear_br
  - platform: group
    name: Bedroom2 Wardrobe
    unique_id: bedroom2_wardrobe_group
    entities:
      - light.ceiling_wardrobe_left
      - light.ceiling_wardrobe_right
  - platform: group
    name: Rear Bathroom Ceiling
    unique_id: rear_bath_ceiling_group
    entities:
      - light.ceiling_rear_bath_bl
      - light.ceiling_rear_bath_ml
      - light.ceiling_rear_bath_tl
      - light.ceiling_rear_bath_tr
  - platform: group
    name: Hallway Ceiling
    unique_id: hallway_ceiling_group
    entities:
      - light.ceiling_entry_right
      - light.ceiling_hallway_front
      - light.ceiling_hallway_rear_1
      - light.ceiling_hallway_rear_2
  - platform: group
    name: Entry Lights
    unique_id: entry_lights_group
    entities:
      - light.front_door_ceiling_light
      - light.entry_gradient_floor_lamp

==== FILE: /Users/jeff/Documents/Documents - Macbook-M3/homeassistant/ha_cleaned_yaml/packages/lighting_helpers.yaml (modified: 2026-05-18 17:12:41) ====

input_number:
  lighting_global_evening_brightness:
    name: Global Evening Brightness
    min: 1
    max: 100
    step: 1
    unit_of_measurement: "%"
    icon: mdi:weather-sunset
    mode: slider
    initial: 55
  lighting_global_night_brightness:
    name: Global Night Brightness
    min: 1
    max: 50
    step: 1
    unit_of_measurement: "%"
    icon: mdi:weather-night
    mode: slider
    initial: 16
  lighting_global_fade_in_seconds:
    name: Global Fade In (s)
    min: 0
    max: 15
    step: 1
    unit_of_measurement: s
    icon: mdi:arrow-collapse-right
    mode: slider
    initial: 4
  lighting_global_fade_out_seconds:
    name: Global Fade Out (s)
    min: 0
    max: 30
    step: 1
    unit_of_measurement: s
    icon: mdi:arrow-collapse-left
    mode: slider
    initial: 6
  lighting_bedroom_evening_brightness:
    name: Bedroom Evening Brightness
    min: 1
    max: 100
    step: 1
    unit_of_measurement: "%"
    icon: mdi:bed-king
    mode: slider
    initial: 40
  lighting_bedroom_night_brightness:
    name: Bedroom Night Brightness
    min: 1
    max: 40
    step: 1
    unit_of_measurement: "%"
    icon: mdi:bed-king-outline
    mode: slider
    initial: 12
  lighting_wardrobe_night_brightness:
    name: Wardrobe Night Brightness
    min: 1
    max: 40
    step: 1
    unit_of_measurement: "%"
    icon: mdi:wardrobe
    mode: slider
    initial: 22
  lighting_bathroom2_night_brightness:
    name: Bathroom 2 Night Brightness
    min: 1
    max: 40
    step: 1
    unit_of_measurement: "%"
    icon: mdi:shower
    mode: slider
    initial: 8

input_datetime:
  lighting_global_morning_start:
    name: Morning Starts
    has_date: false
    has_time: true
    icon: mdi:weather-sunset-up
  lighting_global_morning_end:
    name: Morning Ends
    has_date: false
    has_time: true
    icon: mdi:weather-sunset-up
  lighting_global_evening_start:
    name: Evening Starts
    has_date: false
    has_time: true
    icon: mdi:weather-sunset
  lighting_global_night_start:
    name: Night Starts
    has_date: false
    has_time: true
    icon: mdi:weather-night
  lighting_global_night_end:
    name: Night Ends
    has_date: false
    has_time: true
    icon: mdi:weather-sunny

==== FILE: /Users/jeff/Documents/Documents - Macbook-M3/homeassistant/ha_cleaned_yaml/configuration_snippet.yaml (modified: 2026-05-18 17:12:52) ====

# Minimal snippet showing the corrected, multiline-safe writer.
# Put this in configuration.yaml (or a package), then restart Home Assistant.

shell_command:
  write_automation: >
    python3 -c 'import sys, json, pathlib;
    d=json.loads(sys.argv[1]);
    p=pathlib.Path("/config/packages")/d["file_name"];
    p.write_text(d["automation_yaml"], encoding="utf-8")'
    '{{ {"file_name": file_name, "automation_yaml": automation_yaml} | tojson }}'

==== FILE: /Users/jeff/Documents/Documents - Macbook-M3/homeassistant/ha_cleaned_yaml/lovelace/lighting_brain_view.yaml (modified: 2026-05-18 17:12:56) ====

views:
  - title: Lighting Brain
    path: lighting_brain
    icon: mdi:lightbulb-group
    cards:
      - type: entities
        title: Global Lighting Rhythm
        show_header_toggle: false
        entities:
          - entity: input_datetime.lighting_global_morning_start
            name: Morning starts
          - entity: input_datetime.lighting_global_morning_end
            name: Morning ends
          - entity: input_datetime.lighting_global_evening_start
            name: Evening starts
          - entity: input_datetime.lighting_global_night_start
            name: Night starts
          - entity: input_datetime.lighting_global_night_end
            name: Night ends
      - type: entities
        title: Global Brightness & Fades
        show_header_toggle: false
        entities:
          - entity: input_number.lighting_global_evening_brightness
            name: Evening brightness (default)
          - entity: input_number.lighting_global_night_brightness
            name: Night brightness (default)
          - entity: input_number.lighting_global_fade_in_seconds
            name: Fade in duration
          - entity: input_number.lighting_global_fade_out_seconds
            name: Fade out duration
      - type: entities
        title: Bedroom Suite • Overrides
        show_header_toggle: false
        entities:
          - entity: input_number.lighting_bedroom_evening_brightness
            name: Bedroom evening brightness
          - entity: input_number.lighting_bedroom_night_brightness
            name: Bedroom night brightness
          - entity: input_number.lighting_wardrobe_night_brightness
            name: Wardrobe night brightness
          - entity: input_number.lighting_bathroom2_night_brightness
            name: Bathroom 2 night brightness
      - type: entities
        title: Bedroom Suite • Lights
        show_header_toggle: true
        entities:
          - light.beta_bedroom_ceiling_group
          - light.beta_flex_ceiling_lights
          - light.splash_ceiling_group

==== FILE: /Users/jeff/Documents/Documents - Macbook-M3/homeassistant/ha_cleaned_yaml/ha_cleaned_yaml/scripts/write_automation_and_reload.yaml (modified: 2026-05-18 17:12:48) ====

write_automation_and_reload:
  alias: Write automation from n8n and reload
  mode: queued
  fields:
    file_name:
      description: File name to write under /config/packages
      example: n8n_automation_1733180720.yaml
    automation_yaml:
      description: Full YAML content of the automation
      example: "alias: Test\ntrigger: []\naction: []"
  sequence:
    - service: shell_command.write_automation
      data:
        file_name: "{{ file_name }}"
        automation_yaml: "{{ automation_yaml }}"
    - delay:
        seconds: 1
    - service: automation.reload

==== FILE: /Users/jeff/Documents/Documents - Macbook-M3/Dev_Project/02_Home/Property/adaptive_logic.yaml (modified: 2025-11-11 02:36:04) ====

binary_sensor:
  - platform: bayesian
    name: "Jeff Likely Resting"
    prior: 0.4
    probability_threshold: 0.7
    observations:
      - platform: state
        entity_id: sensor.oura_readiness
        to_state: "low"
        prob_given_true: 0.8
        prob_given_false: 0.3
      - platform: state
        entity_id: sensor.jeff_context
        to_state: "home_idle"
        prob_given_true: 0.7
        prob_given_false: 0.2

==== FILE: /Users/jeff/Documents/Documents - Macbook-M3/Dev_Project/02_Home/Property/audio.yaml (modified: 2026-05-18 17:20:30) ====

# HomePod / Apple TV / ambient music control

==== FILE: /Users/jeff/Documents/Documents - Macbook-M3/Dev_Project/02_Home/Property/bayesian_context.yaml (modified: 2026-05-18 17:19:12) ====

# Adaptive inference model

==== FILE: /Users/jeff/Documents/Documents - Macbook-M3/Dev_Project/02_Home/Property/bedroom_1.yaml (modified: 2026-05-18 17:19:14) ====

# Bedroom 1 zone logic

==== FILE: /Users/jeff/Documents/Documents - Macbook-M3/Dev_Project/02_Home/Property/bedroom_2.yaml (modified: 2026-05-18 17:20:37) ====

# Bedroom 2 zone logic

==== FILE: /Users/jeff/Documents/Documents - Macbook-M3/Dev_Project/02_Home/Property/climate.yaml (modified: 2026-05-18 17:20:20) ====

# AC / purifier / humidifier logic

==== FILE: /Users/jeff/Documents/Documents - Macbook-M3/Dev_Project/02_Home/Property/context_template.yaml (modified: 2026-05-18 17:19:36) ====

template:
  - sensor:
      - name: "Jeff Context"
        unique_id: jeff_context
        state: >
          {% if is_state('binary_sensor.withings_sleep', 'on') %}
            asleep
          {% elif is_state('sensor.oura_activity_level', 'low') %}
            resting
          {% elif is_state('input_boolean.fp2_living_zone', 'on') %}
            active_living
          {% elif is_state('input_boolean.fp2_bedroom_zone', 'on') %}
            active_bedroom
          {% elif is_state('person.jeff', 'home') %}
            home_idle
          {% else %}
            away
          {% endif %}

==== FILE: /Users/jeff/Documents/Documents - Macbook-M3/Dev_Project/02_Home/Property/hallway.yaml (modified: 2026-05-18 17:20:01) ====

# Hallway & transition logic

==== FILE: /Users/jeff/Documents/Documents - Macbook-M3/Dev_Project/02_Home/Property/history_stats.yaml (modified: 2026-05-18 17:20:15) ====

# Presence & sleep tracking sensors

==== FILE: /Users/jeff/Documents/Documents - Macbook-M3/Dev_Project/02_Home/Property/input_booleans.yaml (modified: 2026-05-18 17:19:52) ====

# Presence/mode switches

==== FILE: /Users/jeff/Documents/Documents - Macbook-M3/Dev_Project/02_Home/Property/input_selects.yaml (modified: 2026-05-18 17:19:43) ====

# Context selector (mood, intent)

==== FILE: /Users/jeff/Documents/Documents - Macbook-M3/Dev_Project/02_Home/Property/lighting.yaml (modified: 2026-05-18 17:19:38) ====

automation:
  - alias: "Adaptive Lighting - Relax Mode"
    trigger:
      - platform: state
        entity_id: sensor.jeff_context
        to: "resting"
    action:
      - service: scene.turn_on
        target:
          entity_id: scene.relax_evening
      - service: media_player.play_media
        data:
          media_content_id: "spotify:playlist:relax"
          media_content_type: "music"
        target:
          entity_id: media_player.homepod
      - service: switch.turn_on
        target:
          entity_id: switch.neom_diffuser

==== FILE: /Users/jeff/Documents/Documents - Macbook-M3/Dev_Project/02_Home/Property/media_scenes.yaml (modified: 2026-05-18 17:19:32) ====

# Mood-based audio profiles

==== FILE: /Users/jeff/Documents/Documents - Macbook-M3/Dev_Project/02_Home/Property/open_plan.yaml (modified: 2026-05-18 17:19:53) ====

# Main open plan area logic

==== FILE: /Users/jeff/Documents/Documents - Macbook-M3/Dev_Project/02_Home/Property/presence_sensors.yaml (modified: 2026-05-18 17:20:05) ====

# FP2 / FP1E / Sleep / Oura mapping

==== FILE: /Users/jeff/Documents/Documents - Macbook-M3/Dev_Project/02_Home/Property/scent.yaml (modified: 2026-05-18 17:20:17) ====

# Aroma diffuser & mood integration

==== FILE: /Users/jeff/Documents/Documents - Macbook-M3/Dev_Project/02_Home/Property/sensors.yaml (modified: 2026-05-18 17:19:52) ====

# Core sensor & helper definitions

==== FILE: /Users/jeff/Documents/Documents - Macbook-M3/Dev_Project/02_Home/Property/webhook_llm.yaml (modified: 2026-05-18 17:20:29) ====

# Hook to ChatGPT or HA Assist pipelines

==== FILE: /Users/jeff/Documents/Documents - Macbook-M3/home_context_2_0_scaffold/configuration.yaml (modified: 2025-10-18 23:23:14) ====

# Home Context 2.0 — Scaffolding Base Configuration

default_config:

frontend:
  themes: !include_dir_merge_named themes

automation: !include automations.yaml
script: !include scripts.yaml
scene: !include scenes.yaml

template: !include_dir_merge_list templates/
homeassistant:
  packages: !include_dir_named packages

==== FILE: /Users/jeff/Documents/Documents - Macbook-M3/home_context_2_0_scaffold/helpers.yaml (modified: 2025-10-18 23:23:14) ====

# Placeholder for helpers.yaml
# This file is part of the Home Context 2.0 scaffolding structure.

==== FILE: /Users/jeff/Documents/Documents - Macbook-M3/home_context_2_0_scaffold/packages/lighting.yaml (modified: 2025-10-18 23:23:14) ====

# Placeholder for lighting.yaml
# This file is part of the Home Context 2.0 scaffolding structure.

==== FILE: /Users/jeff/Documents/Documents - Macbook-M3/home_context_2_0_scaffold/packages/system_hygiene.yaml (modified: 2025-10-18 23:23:14) ====

# Placeholder for system_hygiene.yaml
# This file is part of the Home Context 2.0 scaffolding structure.

==== FILE: /Users/jeff/Documents/Documents - Macbook-M3/home_context_2_0_scaffold/packages/adaptive_rhythm.yaml (modified: 2025-10-18 23:23:14) ====

# Placeholder for adaptive_rhythm.yaml
# This file is part of the Home Context 2.0 scaffolding structure.

==== FILE: /Users/jeff/Documents/Documents - Macbook-M3/home_context_2_0_scaffold/packages/environment.yaml (modified: 2025-10-18 23:23:14) ====

# Placeholder for environment.yaml
# This file is part of the Home Context 2.0 scaffolding structure.

==== FILE: /Users/jeff/Documents/Documents - Macbook-M3/home_context_2_0_scaffold/templates/home_context.yaml (modified: 2025-10-18 23:23:14) ====

# Placeholder for home_context.yaml
# This file is part of the Home Context 2.0 scaffolding structure.

==== FILE: /Users/jeff/Documents/Documents - Macbook-M3/home_context_2_0_scaffold/templates/lighting_phase.yaml (modified: 2025-10-18 23:23:14) ====

# Placeholder for lighting_phase.yaml
# This file is part of the Home Context 2.0 scaffolding structure.

==== FILE: /Users/jeff/Documents/Documents - Macbook-M3/home_context_2_0_scaffold/templates/time_context.yaml (modified: 2025-10-18 23:23:14) ====

# Placeholder for time_context.yaml
# This file is part of the Home Context 2.0 scaffolding structure.

==== FILE: /Users/jeff/Documents/Documents - Macbook-M3/Dev_Project/05_Projects/SHIP_Canonical/automations.json (modified: 2026-05-18 18:38:49) ====

{
  "blueprints": {
    "<blueprint_id>": { "name": "", "version": "", "inputs_schema_ref": "" }
  },
  "instances": {
    "<automation_id>": { "name": "", "blueprint_id": "", "enabled": false, "targets": { "rooms": [], "devices": [], "entity_ids": [] }, "inputs": {} }
  },
  "scenes": {
    "<scene_id>": { "name": "", "entity_ids": [] }
  }
}

==== FILE: /Users/jeff/Downloads/10_Archive/Duplicated-Pending Deletion/Exports/sources/homeassistant/README.md (modified: 2026-05-26 14:26:39) ====

# Home Assistant

Status: Home Assistant operational domain workspace
Updated: 2026-05-26

This folder owns Home Assistant and adjacent smart-home documentation.

Use this area for:

- Home Assistant state and naming work
- MQTT and Mosquitto notes
- Matter server notes
- Node-RED notes
- exports, inventories, and cleanup logs

Live Home Assistant state should be verified from the mini-PC before being documented as current.


==== FILE: /Users/jeff/Downloads/10_Archive/Duplicated-Pending Deletion/Exports/sources/homeassistant/core_lighting_rhythm.yaml (modified: 2026-05-31 05:59:55) ====

input_boolean:
  core_lighting_auto:
    name: Core Lighting Auto
    icon: mdi:lightbulb-auto
    initial: false
  core_lighting_test_enabled:
    name: Core Lighting Test Enabled
    icon: mdi:flask-outline
    initial: false
  core_manual_override:
    name: Core Manual Override
    icon: mdi:hand-back-right
    initial: false
  core_ceiling_allowed:
    name: Core Ceiling Allowed
    icon: mdi:ceiling-light
    initial: true

input_select:
  core_lighting_phase:
    name: Core Lighting Phase
    icon: mdi:theme-light-dark
    options:
      - Morning
      - Day
      - Golden Hour
      - Evening
      - Night
      - Late Night
      - Away
    initial: Day
  core_activity:
    name: Core Activity
    icon: mdi:home-heart
    options:
      - Idle
      - Living
      - Kitchen
      - Dining
      - Media
      - Cleaning
      - Manual
    initial: Idle

input_number:
  core_ceiling_target_brightness:
    name: Core Ceiling Target Brightness
    icon: mdi:brightness-6
    min: 0
    max: 100
    step: 1
    unit_of_measurement: "%"
    initial: 35
  core_ambient_target_brightness:
    name: Core Ambient Target Brightness
    icon: mdi:lamp
    min: 0
    max: 100
    step: 1
    unit_of_measurement: "%"
    initial: 20
  core_path_target_brightness:
    name: Core Path Target Brightness
    icon: mdi:walk
    min: 0
    max: 100
    step: 1
    unit_of_measurement: "%"
    initial: 12
  core_kitchen_target_brightness:
    name: Core Kitchen Target Brightness
    icon: mdi:countertop
    min: 0
    max: 100
    step: 1
    unit_of_measurement: "%"
    initial: 45
  core_target_kelvin:
    name: Core Target Kelvin
    icon: mdi:temperature-kelvin
    min: 2000
    max: 6500
    step: 50
    unit_of_measurement: K
    initial: 3000
  core_fade_seconds:
    name: Core Fade Seconds
    icon: mdi:transition
    min: 1
    max: 1800
    step: 1
    unit_of_measurement: s
    initial: 180

timer:
  core_manual_override:
    name: Core Manual Override Timer
    duration: "00:30:00"


==== FILE: /Users/jeff/Downloads/10_Archive/Duplicated-Pending Deletion/Exports/sources/homeassistant/homeassistant-inventory-2026-05-17.md (modified: 2026-05-17 06:58:00) ====

# Home Assistant Inventory

Generated: 2026-05-17
Source: read-only registry/config inspection from `servers` / `/srv/homeassistant/config`.
Secrets and token-like config data are not included.

## Summary

- Integrations: `28`
- Areas: `21`
- Floors: `1`
- Labels: `5`
- Devices: `147`
- Entities: `589`
- Disabled entities: `103`
- Hidden entities: `0`
- Disabled devices: `0`
- Conversation-exposed entities: `136`
- Google Assistant-exposed entities: `83`
- Alexa-exposed entities: `0`

## Integrations

| Domain | Title | Source | Disabled | Entry ID | Unique ID |
| --- | --- | --- | --- | --- | --- |
| apple_tv | Bedroom | zeroconf |  | 01KK0KGB01KC0MEVTHC9V9Y72H | DA:FC:63:11:CF:75 |
| apple_tv | Beta Bedroom | zeroconf |  | 01KKYZPS9WVV23VF427JP3729K | 0E:42:85:E6:20:95 |
| apple_tv | Living Room | zeroconf |  | 01KJG27B1BS9B3SQP56B6FHP76 | 16:54:0E:A3:12:0A |
| apple_tv | Living Room (2) | zeroconf |  | 01KJG25VSZS1CQXWN50A25JC5T | 5E:69:D8:92:7B:06 |
| apple_tv | Living Room (2) | zeroconf |  | 01KKYZMZ0H4MDY0PDSSTHGVWBQ | E6D3120B306D |
| apple_tv | White HomePod Mini | zeroconf |  | 01KKFP0AH670JVYE9N6BAV6ASA | 82:CA:6B:AD:C9:B5 |
| apple_tv | living Room Apple TV | zeroconf |  | 01KJCWC7FPDDF3JTKWKPS60A2W | 7E:55:28:08:27:9A |
| backup | Backup | system |  | 01KE8C76DVYAAG1D1G773A2P8T |  |
| bluetooth | Shenzhen Phaten Tech. LTD None (8C:BD:37:64:26:26) | integration_discovery |  | 01KE8C76D83VV14J40VFV2MY6Q | 8C:BD:37:64:26:26 |
| cast | Google Cast | zeroconf |  | 01KE8C7AA1W2XK0SDM7KHZZQ1P | cast |
| cloud | Home Assistant Cloud | system |  | 01KEAYSHQG86NT532ZXKVH54WA |  |
| go2rtc | go2rtc | system |  | 01KE8C76DJFSEZ46J6ZA8RJNMX |  |
| google_translate | Google Translate text-to-speech | onboarding |  | 01KE91DVJ87CB7GDQN3816E1T4 |  |
| hue | Hue Bridge c42996c58a91 | zeroconf |  | 01KQJ6JHKQQ2DZ0PK6M0DT3WFR | c42996c58a91 |
| matter | Matter | zeroconf |  | 01KKR0E56PAZ568V40ARDBAMYR |  |
| met | Home | onboarding |  | 01KE91DVPP110V3YHQ6Y1RBFJN |  |
| mobile_app | Jeff’s iPad | registration |  | 01KJXBWPPBWFEJMJ21N1ZVQ6AV | io.robbie.HomeAssistant-2C1B5EF5-AC23-48F3-A01F-3BE96720A309 |
| mobile_app | Jeff’s iPhone | registration |  | 01KMEC8P6EFQAEMK2SR21A30AZ | io.robbie.HomeAssistant-45A83C97-F647-4D17-B996-48F246A805CE |
| mobile_app | MacBook Air  | registration |  | 01KEAY01EBMBS1WC70CWY2KRMM | io.robbie.HomeAssistant-4DF379A5-B89E-587F-9550-D89639687D16 |
| mobile_app | iPhone 16Pro Max  | registration |  | 01KE9K0JRMH5EAY8JFWNCQGM4W | io.robbie.HomeAssistant-1FA7ACC1-D32A-4AF7-96F2-405105601FB7 |
| mqtt | 192.168.1.39 | user |  | 01KJCTC70CN506EE23RWK1JMG3 |  |
| radio_browser | Radio Browser | onboarding |  | 01KE91DVP4CM1GP7W3NQ6RFSES |  |
| shopping_list | Shopping list | onboarding |  | 01KE91DVHS4B7KB3RD5BE8B6DJ | shopping_list |
| speedtestdotnet | SpeedTest | user |  | 01KKQ16Q9W2JX6D0ZPV70901WF |  |
| sun | Sun | import |  | 01KE8C760923KJ4PC4FPDD7AC2 |  |
| thread | Thread | zeroconf |  | 01KE8C797FV5PXCY333VPVMWVE |  |
| vesync | Home@itsjeff.org | user |  | 01KN8Y3019MX4C436429W21Z4A |  |
| withings | Withings | user |  | 01KFF3W24JX0DFXRRAS4KD66QR | 43916788 |

## Integration Domain Counts

| Value | Count |
| --- | ---: |
| apple_tv | 7 |
| backup | 1 |
| bluetooth | 1 |
| cast | 1 |
| cloud | 1 |
| go2rtc | 1 |
| google_translate | 1 |
| hue | 1 |
| matter | 1 |
| met | 1 |
| mobile_app | 4 |
| mqtt | 1 |
| radio_browser | 1 |
| shopping_list | 1 |
| speedtestdotnet | 1 |
| sun | 1 |
| thread | 1 |
| vesync | 1 |
| withings | 1 |

## Entity Domain Counts

| Value | Count |
| --- | ---: |
| binary_sensor | 65 |
| button | 56 |
| cover | 7 |
| device_tracker | 4 |
| event | 38 |
| fan | 1 |
| input_boolean | 1 |
| light | 74 |
| media_player | 12 |
| number | 4 |
| person | 1 |
| remote | 7 |
| scene | 13 |
| select | 1 |
| sensor | 290 |
| stt | 1 |
| switch | 9 |
| todo | 1 |
| tts | 2 |
| update | 1 |
| weather | 1 |

## Entity Platform Counts

| Value | Count |
| --- | ---: |
| apple_tv | 14 |
| backup | 5 |
| cast | 5 |
| cloud | 3 |
| google_translate | 1 |
| homeassistant | 1 |
| hue | 212 |
| input_boolean | 1 |
| matter | 227 |
| met | 1 |
| mobile_app | 70 |
| person | 1 |
| shopping_list | 1 |
| speedtestdotnet | 3 |
| sun | 10 |
| vesync | 7 |
| withings | 27 |

## Device Manufacturer Counts

| Value | Count |
| --- | ---: |
| Signify Netherlands B.V. | 85 |
| Aqara | 26 |
| Apple | 11 |
| SwitchBot | 11 |
| Google Inc. | 4 |
| Unknown | 2 |
| Shenzhen Phaten Tech. LTD | 1 |
| Home Assistant | 1 |
| Met.no | 1 |
| Withings | 1 |
| Signify | 1 |
| Unknown manufacturer | 1 |
| VeSync | 1 |
| IKEA of Sweden | 1 |

## Device Model Counts

| Value | Count |
| --- | ---: |
| Hue ambiance spot | 24 |
| Hue color spot | 12 |
| Zone | 10 |
| Aqara Door and Window Sensor | 7 |
| Room | 7 |
| Hub 3 | 6 |
| Unknown | 4 |
| Google Nest Hub | 4 |
| Hue Essential spot | 4 |
| HomePod (gen 2) | 3 |
| Roller Shade | 3 |
| Hue smart button | 3 |
| Hue color lamp | 3 |
| Hue tap dial switch | 3 |
| Hue dimmer switch | 3 |
| Apple TV 4K (gen 3) | 2 |
| HomePod Mini | 2 |
| Aqara Curtain Driver E1 | 2 |
| Aqara Presence Sensor FP1E | 2 |
| Aqara Motion Sensor P1 | 2 |
| Hue motion sensor | 2 |
| Hue white lamp | 2 |
| Signe gradient floor | 2 |
| Hue color candle | 2 |
| Hue Play | 2 |
| Home Assistant Backup | 1 |
| Forecast | 1 |
| iPhone17,2 | 1 |
| Mac15,12 | 1 |
| iPhone18,2 | 1 |
| iPad17,1 | 1 |
| Aqara Hub M3 | 1 |
| Aqara Vibration Sensor | 1 |
| Aqara Wireless Remote Switch | 1 |
| SwitchBot Hub 3 | 1 |
| Presence kitchen zone | 1 |
| Approaching Openplan room | 1 |
| Presence living zone | 1 |
| Presence Dining zone | 1 |
| Absence for 5mins Openplan | 1 |
| Absence for 3mins kitchen zone | 1 |
| Absence for 3mins living zone | 1 |
| Absence for 3mins dining zone | 1 |
| WiZ A60 Filament | 1 |
| Beta bedroom presence detected | 1 |
| Beta bedroom no presence 3mins | 1 |
| LS01D | 1 |
| Core300S | 1 |
| Bot | 1 |
| Hue Bridge | 1 |
| Signe gradient table | 1 |
| Hue lightguide bulb | 1 |
| Play gradient tube | 1 |
| Dimmable light | 1 |
| Hue smart plug | 1 |
| Hue lightstrip plus | 1 |

## Floors

| Name | ID | Aliases |
| --- | --- | --- |
| Flat |  |  |

## Areas

| Name | ID | Floor | Aliases |
| --- | --- | --- | --- |
| Attic | attic |  |  |
| Bedroom | bedroom |  |  |
| Bedroom (Alpha) | alpha_bedroom |  |  |
| Beta Bedroom | beta_bedroom_2 |  |  |
| Core_kitchen | core_kitchen |  | Kitchen |
| Default | default |  |  |
| Dining | dining |  |  |
| Ensuite (Throne) Bathroom | throne_bathroom |  |  |
| Hallway (Pass) | pass |  |  |
| Laundry room | laundry_room |  |  |
| Laundry/Utilities | chaos |  |  |
| Living Room | living_room |  |  |
| Living Room (2) | living_room_2 |  |  |
| My Bathroom | my_bathroom |  |  |
| Openplan | openplan |  |  |
| Openplan (Core) | core |  |  |
| Parking | parking |  |  |
| Secondary Bathroom | secondary_bathroom |  |  |
| Spare Bedroom | beta_bedroom |  | Beta Bedroom, Guest Bedroom, Rear Bedroom |
| Storage | storage |  |  |
| White HomePod Mini | white_homepod_mini |  |  |

## Devices By Area Count

| Area | Devices |
| --- | ---: |
| Bedroom | 9 |
| Bedroom (Alpha) | 11 |
| Core_kitchen | 4 |
| Ensuite (Throne) Bathroom | 6 |
| Hallway (Pass) | 7 |
| Laundry room | 1 |
| Laundry/Utilities | 3 |
| Living Room | 8 |
| Living Room (2) | 1 |
| My Bathroom | 1 |
| Openplan (Core) | 13 |
| Parking | 1 |
| Secondary Bathroom | 7 |
| Spare Bedroom | 13 |
| Unassigned | 61 |
| White HomePod Mini | 1 |

## Entities By Direct Area Count

| Area | Entities |
| --- | ---: |
| Unassigned | 589 |

## Full Device List

| Name | Area | Manufacturer | Model | Model ID | Domains | Disabled | ID |
| --- | --- | --- | --- | --- | --- | --- | --- |
| All Bedroom & Bathroom | Bedroom | Signify Netherlands B.V. | Zone |  | hue |  | 9bcdac103a6fe193a4cd1ff6864c8012 |
| Alpha Ceiling Light.6 | Bedroom | Signify Netherlands B.V. | Hue Essential spot | LCG008 | hue |  | ba9d7d9777253c445066c26aca659483 |
| alpha gradient light-tube.1 | Bedroom | Signify Netherlands B.V. | Play gradient tube | 915005988001 | hue |  | e6b677474cc1f572d83596e2d103af6a |
| Bedroom Ceiling | Bedroom | Signify Netherlands B.V. | Zone |  | hue |  | b0e22adacb7b181d0195839086e46516 |
| Bedroom Lamps | Bedroom | Signify Netherlands B.V. | Zone |  | hue |  | ee40c0ac85ca50f3ee21e699ac8f14ed |
| Core 300S | Bedroom | VeSync | Core300S |  | vesync |  | 735ef7fcb4452be87b579182ccbe01a5 |
| Ikea Skytrax Light | Bedroom | IKEA of Sweden | Dimmable light | TRADFRI Driver 30W | hue |  | 475fe7c2987064f9797a7860b2e6f7ad |
| Orange HomePod Mini | Bedroom | Apple | HomePod Mini |  | apple_tv |  | 2f4611589743ae3b7fbd280c7f611782 |
| Right Bedside Lamp | Bedroom | Signify Netherlands B.V. | Hue color candle | LCE002 | hue |  | a3f86e911440eba9848a331183d010d2 |
| Alpha Bedroom Dial Switch | Bedroom (Alpha) | Signify Netherlands B.V. | Hue tap dial switch | RDM002 | hue |  | f3a36de300c078041de5869a79f49dbe |
| Alpha Ceiling Light.4 | Bedroom (Alpha) | Signify Netherlands B.V. | Hue color spot | LCG006 | hue |  | eb2058653fe9e0f95ad5aa8018b97de2 |
| Alpha Ceiling Light.6 | Bedroom (Alpha) | Signify Netherlands B.V. | Hue ambiance spot | LTG005 | hue |  | c1c0e309ed8147ef57d651df415bc548 |
| Alpha Hue Smart Button | Bedroom (Alpha) | Signify Netherlands B.V. | Hue smart button | RDM005 | hue |  | 500c186b1b951c54ec8b27c162c9e452 |
| Alphabed Ceiling Light.3 | Bedroom (Alpha) | Signify Netherlands B.V. | Hue color spot | LCG006 | hue |  | 5d5d2cd72b6952b59a09cb567a37284c |
| Alphabed Ceiling Light.5 | Bedroom (Alpha) | Signify Netherlands B.V. | Hue color spot | LCG006 | hue |  | 55f7455e695e1ce7fdddb9b06f95ac1e |
| Alphabed Ceiling Light.5 | Bedroom (Alpha) | Signify Netherlands B.V. | Hue color spot | LCG006 | hue |  | c679070b7932d16308b82b9e3d646938 |
| Bedroom | Bedroom (Alpha) | Signify Netherlands B.V. | Room |  | hue |  | 50a528511760fe9c34e7301b1e2e3cc3 |
| core ceiling.3 | Bedroom (Alpha) | Signify Netherlands B.V. | Hue ambiance spot | LTG005 | hue |  | 3ea5d1bb94beb7cccc04318580529ee7 |
| Nymane 3-spot Lamp - Low | Bedroom (Alpha) | Signify Netherlands B.V. | Hue Essential spot | LCG008 | hue |  | 2e19b66efcd2fdf07d25df6ff0dd9518 |
| Withings | Bedroom (Alpha) | Withings |  |  | withings |  | f30934f854f8d5d86ff183095961de55 |
| Core Ceiling Light.9 | Core_kitchen | Signify Netherlands B.V. | Hue ambiance spot | LTG005 | hue |  | f31d63cbe41b5f1acd30ad687951c840 |
| Kitchen | Core_kitchen | Signify Netherlands B.V. | Room |  | hue |  | c4511e091350b7f37d4f417193c8d386 |
| Kitchen Ceiling | Core_kitchen | Signify Netherlands B.V. | Zone |  | hue |  | fa6e413f91600e74a6443af15cf1797b |
| Kitchen Task | Core_kitchen | Signify Netherlands B.V. | Zone |  | hue |  | 8cc5a4ca37e3955327e390a50af4630f |
| Bathroom dimmer switch | Ensuite (Throne) Bathroom | Signify Netherlands B.V. | Hue dimmer switch | RWL022 | hue |  | 9262c97c808756f1c42c9a5f56d07b44 |
| Hue Motion Sensor | Ensuite (Throne) Bathroom | Signify Netherlands B.V. | Hue motion sensor | SML003 | hue |  | 3a26058d1afa9fa8888a9b3865c8eaa7 |
| Throne Ceiling above Door | Ensuite (Throne) Bathroom | Signify Netherlands B.V. | Hue ambiance spot | LTG005 | hue |  | b4da620be9a589bb9a2039e1ab78ebef |
| Throne Ceiling above shower door | Ensuite (Throne) Bathroom | Signify Netherlands B.V. | Hue ambiance spot | LTG005 | hue |  | 22a1188f6ffa438992b8004a39cd432f |
| Throne Ceiling above sink | Ensuite (Throne) Bathroom | Signify Netherlands B.V. | Hue ambiance spot | LTG005 | hue |  | 062b0dbde1538a39a2caddb290a7f1ec |
| Throne Ceiling Light.3 | Ensuite (Throne) Bathroom | Signify Netherlands B.V. | Hue ambiance spot | LTG005 | hue |  | 7ad73057c31770c617cd496edba33088 |
| Hallway | Hallway (Pass) | Signify Netherlands B.V. | Room |  | hue |  | a8a5ae19c7ced86ad29d7245978c0d56 |
| Hallway Dimmer Switch | Hallway (Pass) | Signify Netherlands B.V. | Hue dimmer switch | RWL022 | hue |  | 7158827f268292c33df8d3ac80d77f8b |
| Pass Ceiling Light.1 | Hallway (Pass) | Signify Netherlands B.V. | Hue ambiance spot | LTG005 | hue |  | 1fc62b8e8aa80845dc7cb23e3f0bc24f |
| Pass Ceiling Light.1  | Hallway (Pass) | Signify Netherlands B.V. | Hue ambiance spot | LTG005 | hue |  | a1493cb9fc881b1421e04687bc9553a3 |
| Pass Ceiling Light.2 | Hallway (Pass) | Signify Netherlands B.V. | Hue ambiance spot | LTG005 | hue |  | b3b83fe3b391eaa9d7c5e917a8a028d1 |
| Pass Ceiling Light.4 | Hallway (Pass) | Signify Netherlands B.V. | Hue ambiance spot | LTG005 | hue |  | fbfcf983165eca43796973ac96dfd87f |
| Pass Ceiling Light.5 | Hallway (Pass) | Signify Netherlands B.V. | Hue ambiance spot | LTG005 | hue |  | b282b813d0ba73db7eb149a8fccfd390 |
| Laundry room | Laundry room | Signify Netherlands B.V. | Zone |  | hue |  | 3c4a13dec7e554b24b395ff8bdc8fda5 |
| Hue Bridge Pro | Laundry/Utilities | Signify Netherlands B.V. | Hue Bridge | BSB003 | hue |  | d655489921cbb3a2585dc855c0d1ea75 |
| Laundry (Chaos) Ceiling Light | Laundry/Utilities | Signify Netherlands B.V. | Hue white lamp | LWA018 | hue |  | cc79d7dfe1b17181869f10c35cc4c833 |
| White (E27) Hue Bulb | Laundry/Utilities | Signify Netherlands B.V. | Hue white lamp | LWA018 | hue |  | f72d9da87ad9f369da5b9fa4bccfb8aa |
| Beige Ola Spotlight Lamp | Living Room | Signify Netherlands B.V. | Hue color lamp | LCA001 | hue |  | 529049bbc4a02b9ebd873f19ca3412da |
| Core Ceiling Light.5 | Living Room | Signify Netherlands B.V. | Hue color spot | LCG002 | hue |  | 25fd95b77ffb4e30f911e0e44136680e |
| Core Living Ceiling | Living Room | Signify Netherlands B.V. | Zone |  | hue |  | 34f94074f6947cf4bb83f5dcd89ffbd8 |
| Core Lounge HomePod | Living Room | Apple | HomePod (gen 2) |  | apple_tv |  | 12b333bc773ab0d1bc7c261a26743962 |
| Core Lounge HomePod | Living Room | Apple | HomePod (gen 2) |  | apple_tv |  | 4a2969bba349c62c3ae8ed2a0139f3ff |
| Living room | Living Room | Signify Netherlands B.V. | Room |  | hue |  | d658ffac53d39553a6e2140b1e97cef0 |
| Living room lamps | Living Room | Signify Netherlands B.V. | Zone |  | hue |  | 2ca99b27e5a48523c674bcc99b7ee560 |
| Lounge Apple TV (WIred) | Living Room | Apple | Apple TV 4K (gen 3) |  | apple_tv |  | 612098715827acdd9ca11b9286e29057 |
| Living Room (2) | Living Room (2) | Apple | HomePod (gen 2) |  | apple_tv |  | 23a9a926a450af03776a332578199e00 |
| Bathroom | My Bathroom | Signify Netherlands B.V. | Room |  | hue |  | 117c704d9e32a6e962854eb81789dab3 |
| Core Ceiling Light.1 | Openplan (Core) | Signify Netherlands B.V. | Hue color spot | LCG006 | hue |  | 1e9955f25dc9f5c09dcb90e0fb8d60dd |
| Core Ceiling Light.10 | Openplan (Core) | Signify Netherlands B.V. | Hue ambiance spot | LTG005 | hue |  | de3a3b86f9f861abd8474a0bbee6e039 |
| Core Ceiling Light.2 | Openplan (Core) | Signify Netherlands B.V. | Hue color spot | LCG006 | hue |  | cac5cdcc358702139ac465f8994f9e83 |
| Core Ceiling Light.4 | Openplan (Core) | Signify Netherlands B.V. | Hue color spot | LCG002 | hue |  | f8149a06f87fed8bb2412cf2fea76be7 |
| Core Ceiling Light.4 | Openplan (Core) | Signify Netherlands B.V. | Hue color spot | LCG002 | hue |  | c1c74acf710e8ce06117655e979e893e |
| Core Ceiling Light.5 | Openplan (Core) | Signify Netherlands B.V. | Hue color spot | LCG002 | hue |  | 7ff3eb57a4f7b8b83823e6bbc1cd43c0 |
| Core Ceiling Light.6 | Openplan (Core) | Signify Netherlands B.V. | Hue color spot | LCG002 | hue |  | f2bdc76a73830aa7fa6193766aed417e |
| Core Ceiling Light.8 | Openplan (Core) | Signify Netherlands B.V. | Hue color spot | LCG002 | hue |  | 11501df1df87e0a6ea1a99334fded6d2 |
| Core Statement Arc Floor Lamp Monica Vibelucci | Openplan (Core) | Signify Netherlands B.V. | Hue lightguide bulb | LCZ001 | hue |  | 9000c66a1b0d6684075d3e5c53d1543c |
| Core Tap Dial Light Switch | Openplan (Core) | Signify Netherlands B.V. | Hue tap dial switch | RDM002 | hue |  | 9f1606f2d60df3ef87d614354986c424 |
| Hue Signe White Gradient Floor Lamp.1 | Openplan (Core) | Signify Netherlands B.V. | Signe gradient floor | 915005987701 | hue |  | 258fcb0a550539cc7ec6fffe58967e36 |
| Klasnick Beige Table Lamp (with E14 Hue Colour) | Openplan (Core) | Signify Netherlands B.V. | Hue color candle | LCE002 | hue |  | 33595151421af22100a3e06457f0d43f |
| Signe gradient floor 1 | Openplan (Core) | Signify Netherlands B.V. | Signe gradient floor | 915005987701 | hue |  | c2789cbe73d4b79832da4a6a2e328737 |
| SpeedTest | Parking |  |  |  | speedtestdotnet |  | 298e8da3405ebce662aec90ec1c65a87 |
| Secondary Bathroom | Secondary Bathroom | Signify Netherlands B.V. | Room |  | hue |  | 6d7b499febad4be04c50281d66c355b9 |
| Splash Ceiling Light.1 | Secondary Bathroom | Signify Netherlands B.V. | Hue ambiance spot | LTG005 | hue |  | 712dfdefa747a25fb6b5491f50d4fc77 |
| Splash Ceiling Light.2 | Secondary Bathroom | Signify Netherlands B.V. | Hue ambiance spot | LTG005 | hue |  | 33028e1253bd920ca8025d846edbb6e6 |
| Splash Ceiling Light.3 | Secondary Bathroom | Signify Netherlands B.V. | Hue ambiance spot | LTG005 | hue |  | 345f22c2aac0cf310cc467f20ad291d4 |
| Splash Ceiling Light.4 | Secondary Bathroom | Signify Netherlands B.V. | Hue ambiance spot | LTG005 | hue |  | 5200e66fdc90aad0dd0cbceb76c22319 |
| Splash Ceiling Light.5 | Secondary Bathroom | Signify Netherlands B.V. | Hue ambiance spot | LTG005 | hue |  | 1aecb535c3b242ba001f8fe849f0cc66 |
| Splash Dimmer Switch | Secondary Bathroom | Signify Netherlands B.V. | Hue dimmer switch | RWL022 | hue |  | 0a7d029aeef8c21cb1ed5d3be91ad78e |
| Bedroom Apple TV | Spare Bedroom | Apple | Apple TV 4K (gen 3) |  | apple_tv |  | f417c8f588f9fd252fc32de6be532da9 |
| Beta Bed Lightstrip | Spare Bedroom | Signify Netherlands B.V. | Hue lightstrip plus | LCL007 | hue |  | d9da816eb1ea175c045b94dda1fab89c |
| Beta Bedroom & Bath | Spare Bedroom | Signify Netherlands B.V. | Zone |  | hue |  | 0fade83b4b0b0f8f4cd529c4720bd2c2 |
| Beta Ceiling Light.3 | Spare Bedroom | Signify Netherlands B.V. | Hue ambiance spot | LTG005 | hue |  | d82ba9da0b831576a30a6202b35686cc |
| Beta Ceiling Light.3 | Spare Bedroom | Signify Netherlands B.V. | Hue ambiance spot | LTG005 | hue |  | ec259a6304fedd4f2569aa942ef6edb9 |
| Beta Ceiling Light.4 | Spare Bedroom | Signify Netherlands B.V. | Hue ambiance spot | LTG005 | hue |  | 95dba2dec02b41db4ea3ca072dcdd6d0 |
| Beta Ceiling Light.6 | Spare Bedroom | Signify Netherlands B.V. | Hue ambiance spot | LTG005 | hue |  | dc71020d45c5332607408e59045efbf9 |
| Betaflex Ceiling Light.1 | Spare Bedroom | Signify Netherlands B.V. | Hue ambiance spot | LTG005 | hue |  | fb3b1cc5cd84b7435b46d79ba3160450 |
| Betaflex Ceiling Light.2 | Spare Bedroom | Signify Netherlands B.V. | Hue ambiance spot | LTG005 | hue |  | c27b8a08b76af2ed70e81a475a781ac8 |
| Hallway Tap Dial Switch | Spare Bedroom | Signify Netherlands B.V. | Hue tap dial switch | RDM002 | hue |  | b8a1e7c445f4889533cbd7600f709aee |
| Hue Motion Sensor | Spare Bedroom | Signify Netherlands B.V. | Hue motion sensor | SML003 | hue |  | c61c4551d3ec38cda5ef874359c7d174 |
| Spare Bedroom | Spare Bedroom | Signify Netherlands B.V. | Room |  | hue |  | 38f7ad003f2fa943ee7574fb8e21dcb2 |
| Spare Bedroom Ceiling | Spare Bedroom | Signify Netherlands B.V. | Zone |  | hue |  | 514f06a7f929e6441e7c3208365296bd |
| Absence for 3mins dining zone | Unassigned | Aqara | Absence for 3mins dining zone |  | matter |  | d87b349943815bc7c6955598c148be6e |
| Absence for 3mins kitchen zone | Unassigned | Aqara | Absence for 3mins kitchen zone |  | matter |  | 9cf834287d35c92b1c2b15d4e2563e3d |
| Absence for 3mins living zone | Unassigned | Aqara | Absence for 3mins living zone |  | matter |  | 9c402f1bb0f2e12aad2c1a3445cc2973 |
| Absence for 5mins Openplan | Unassigned | Aqara | Absence for 5mins Openplan |  | matter |  | b12ba98833de10944c276b8c986b48d5 |
| Approaching Openplan room | Unassigned | Aqara | Approaching Openplan room |  | matter |  | ef6a2abe0d1fa53d01b8198d8aeadee0 |
| Aqara Curtain Driver E1 | Unassigned | Aqara | Aqara Curtain Driver E1 |  | matter |  | 3e1dbf216befd9366e10e291f07948db |
| Aqara Curtain Driver E1 | Unassigned | Aqara | Aqara Curtain Driver E1 |  | matter |  | 412148a8ec0f5f9ba347008bb9c48d19 |
| Aqara Door and Window Sensor | Unassigned | Aqara | Aqara Door and Window Sensor |  | matter |  | 880b2d33ed5a8a7f7f00c30568e2f664 |
| Aqara Door and Window Sensor | Unassigned | Aqara | Aqara Door and Window Sensor |  | matter |  | 55707b23ebbe9e56dac212af4d16e418 |
| Aqara Door and Window Sensor | Unassigned | Aqara | Aqara Door and Window Sensor |  | matter |  | 0cd6f6ad32a2c0b7c938478dc91b1347 |
| Aqara Door and Window Sensor | Unassigned | Aqara | Aqara Door and Window Sensor |  | matter |  | 92e1843e781f34e8bcc13aa84f423eb9 |
| Aqara Door and Window Sensor | Unassigned | Aqara | Aqara Door and Window Sensor |  | matter |  | 0728ce0e83045cf9666b391c53941d1e |
| Aqara Door and Window Sensor | Unassigned | Aqara | Aqara Door and Window Sensor |  | matter |  | 9398c3235542814e4cca0c14249228e4 |
| Aqara Door and Window Sensor | Unassigned | Aqara | Aqara Door and Window Sensor |  | matter |  | e7b7536f089b76b864bc1668e48f665c |
| Aqara Hub M3 | Unassigned | Aqara | Aqara Hub M3 | 2051 | matter |  | acc4a38ba4cb4997f8ce1533f1d485e3 |
| Aqara Motion Sensor P1 | Unassigned | Aqara | Aqara Motion Sensor P1 |  | matter |  | c9d8d61f1d40653e629c68ceabddf488 |
| Aqara Motion Sensor P1 | Unassigned | Aqara | Aqara Motion Sensor P1 |  | matter |  | 5f9599ebee4bf62fc9fb3038a1819397 |
| Aqara Vibration Sensor | Unassigned | Aqara | Aqara Vibration Sensor |  | matter |  | eaefa575e0142c1b997ad86338a1e36e |
| Aqara Wireless Remote Switch | Unassigned | Aqara | Aqara Wireless Remote Switch |  | matter |  | 50568567cd5b532f7c719f8af20887d5 |
| Aqara Presence Sensor FP1E | Unassigned | Aqara | Aqara Presence Sensor FP1E |  | matter |  | a5cccdcd99030b787285cf002880f130 |
| Aqara Presence Sensor FP1E | Unassigned | Aqara | Aqara Presence Sensor FP1E |  | matter |  | 2668f542fc4a530b359a16f4de5cb7e8 |
| Backup | Unassigned | Home Assistant | Home Assistant Backup |  | backup |  | 3c608d14afaa97bf113a32eef969c850 |
| Bedroom Display | Unassigned | Google Inc. | Google Nest Hub |  | cast |  | c6dca7bee9771780c1d8225014c04fb1 |
| Beta bedroom no presence 3mins | Unassigned | Aqara | Beta bedroom no presence 3mins |  | matter |  | b9219d3d32ad3432d09e71878ad14022 |
| Beta bedroom presence detected | Unassigned | Aqara | Beta bedroom presence detected |  | matter |  | 88018fd32d736c704bff5dc3e6d3973b |
| Bot 4A | Unassigned | SwitchBot | Bot |  | matter |  | e1e44b9e90ff621f67173abf1228ec8f |
| fado glass globe lamp | Unassigned | Signify Netherlands B.V. | Hue color lamp | LCA004 | hue |  | b9139ec0152442d7ffe7ec7119dfec48 |
| Forecast | Unassigned | Met.no | Forecast |  | met |  | 38f2f9e968d284138312ff4dafd8961d |
| hci0 (8C:BD:37:64:26:26) | Unassigned | Shenzhen Phaten Tech. LTD | Unknown |  | bluetooth |  | 939eb0b4c92e782ea3d06053bf6421c5 |
| Hub 3 Button 1 | Unassigned | SwitchBot | Hub 3 |  | matter |  | 5a333ca87d58a8ff878d4618c15a08c6 |
| Hub 3 Button 2 | Unassigned | SwitchBot | Hub 3 |  | matter |  | a94fde18da4f2126110649a104e1dc4e |
| Hub 3 Button 3 | Unassigned | SwitchBot | Hub 3 |  | matter |  | 9beffa7c4c3798840d68b0965a880731 |
| Hub 3 HumiSensor | Unassigned | SwitchBot | Hub 3 |  | matter |  | dd6d6604699f9bcb3f1785f0734ca0c7 |
| Hub 3 MotionSensor | Unassigned | SwitchBot | Hub 3 |  | matter |  | f8bce4a32d0483c8e5998ec525bb9369 |
| Hub 3 TempSensor | Unassigned | SwitchBot | Hub 3 |  | matter |  | 46a08e3c0c4c210971727daa590c917f |
| Hue Play 1 | Unassigned | Signify Netherlands B.V. | Hue Play | 440400982842 | hue |  | d89bf5602e1724bf0b26f43bf6866f40 |
| Hue Play 2 | Unassigned | Signify Netherlands B.V. | Hue Play | 440400982841 | hue |  | e6939abcf85960114033763df1633e2e |
| Hue smart button 2 | Unassigned | Signify Netherlands B.V. | Hue smart button | RDM005 | hue |  | da1dd2355bbec3191d522313064aa97c |
| Hue smart button 3 | Unassigned | Signify Netherlands B.V. | Hue smart button | RDM005 | hue |  | 027c1c392e1914472aebdad116e88d1f |
| Hue smart plug 1 | Unassigned | Signify Netherlands B.V. | Hue smart plug | LOM009 | hue |  | 2c9a65b5226b60f36e9fa994d5db3e92 |
| iPhone 16Pro Max  | Unassigned | Apple | iPhone17,2 |  | mobile_app |  | 4ffe60a6382ee637e98da4868aeca8e1 |
| Jeff’s iPad | Unassigned | Apple | iPad17,1 |  | mobile_app |  | 93101baa2aef650396ea126fd61765af |
| Jeff’s iPhone | Unassigned | Apple | iPhone18,2 |  | mobile_app |  | a2e81a41c2ee0a9e1daec770ead9da75 |
| Loft Display | Unassigned | Google Inc. | Google Nest Hub |  | cast |  | fb3b52c889646a1c8fc6bc77fe30205b |
| MacBook Air  | Unassigned | Apple | Mac15,12 |  | mobile_app |  | 652c8cbed207e4d069bdaa8bdcf93e52 |
| NestHubD029 | Unassigned | Google Inc. | Google Nest Hub |  | cast |  | d2d4396241886122805bf4a3ee0450bf |
| NestHubD029 | Unassigned | Google Inc. | Google Nest Hub |  | cast |  | 6a4f6e0da1c233db98df89c682696867 |
| Nyamane 3-spot Lamp - Top  | Unassigned | Signify Netherlands B.V. | Hue Essential spot | LCG008 | hue |  | 543d647ade89fd9e32afd034b4937846 |
| Nymane 3-spot Lamp - Mid | Unassigned | Signify Netherlands B.V. | Hue Essential spot | LCG008 | hue |  | 5c5088969773c38740cbd5f823f58d65 |
| Ola Whitborg XL Floor Lamp | Unassigned | Signify Netherlands B.V. | Hue color lamp | LCA006 | hue |  | 5525c9fb0db1dab203c66826dc6847a0 |
| Presence Dining zone | Unassigned | Aqara | Presence Dining zone |  | matter |  | 57b210076090a8a7602f2c14819c6a71 |
| Presence kitchen zone | Unassigned | Aqara | Presence kitchen zone |  | matter |  | e76350da340adc8f514b17cde07bed88 |
| Presence living zone | Unassigned | Aqara | Presence living zone |  | matter |  | 5347696d7632da6e8853f05ff7706010 |
| Roller Shade 0A | Unassigned | SwitchBot | Roller Shade |  | matter |  | dcd0cddfa4a2499b515bac0840fc7abf |
| Roller Shade 2A | Unassigned | SwitchBot | Roller Shade |  | matter |  | 6364ed40ff74eae0b9ebfaa1bcdefdfa |
| Roller Shade 84 | Unassigned | SwitchBot | Roller Shade |  | matter |  | 264736363a5bf620236a739daa0a1bb0 |
| Serif TV | Unassigned | Unknown manufacturer | LS01D |  | cast |  | cc5249666d50f9cda4fb6b62d3e4e561 |
| Signe gradient table 1 | Unassigned | Signify Netherlands B.V. | Signe gradient table | 915005987001 | hue |  | 81afd7db5465561e20df193ef451d0f4 |
| Sun | Unassigned |  |  |  | sun |  | a2bb6fe6e55358a2fb83fd847f27a746 |
| SwitchBot Hub 3 | Unassigned | SwitchBot | SwitchBot Hub 3 | 2027 | matter |  | 3ba620e83a81087792b346d2b230c289 |
| WiZ A60 Filament | Unassigned | Signify | WiZ A60 Filament | 8722 | matter |  | a21d7792725515ce9008298a03bb798a |
| White HomePod Mini | White HomePod Mini | Apple | HomePod Mini |  | apple_tv |  | dc26045371744833233dc93dc63eb8bd |

## Full Entity List

| Entity ID | Domain | Platform | Device | Device Area | Entity Area | Original Name | Category | Device Class | Unit | Disabled | Hidden |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| binary_sensor.absence_for_3mins_dining_zone_occupancy | binary_sensor | matter | Absence for 3mins dining zone |  |  | Occupancy |  | occupancy |  |  |  |
| binary_sensor.absence_for_3mins_dining_zone_occupancy_2 | binary_sensor | matter | Absence for 3mins dining zone |  |  | Occupancy |  | occupancy |  |  |  |
| binary_sensor.absence_for_3mins_kitchen_zone_occupancy | binary_sensor | matter | Absence for 3mins kitchen zone |  |  | Occupancy |  | occupancy |  |  |  |
| binary_sensor.absence_for_3mins_kitchen_zone_occupancy_2 | binary_sensor | matter | Absence for 3mins kitchen zone |  |  | Occupancy |  | occupancy |  |  |  |
| binary_sensor.absence_for_3mins_living_zone_occupancy | binary_sensor | matter | Absence for 3mins living zone |  |  | Occupancy |  | occupancy |  |  |  |
| binary_sensor.absence_for_3mins_living_zone_occupancy_2 | binary_sensor | matter | Absence for 3mins living zone |  |  | Occupancy |  | occupancy |  |  |  |
| binary_sensor.absence_for_5mins_openplan_occupancy | binary_sensor | matter | Absence for 5mins Openplan |  |  | Occupancy |  | occupancy |  |  |  |
| binary_sensor.absence_for_5mins_openplan_occupancy_2 | binary_sensor | matter | Absence for 5mins Openplan |  |  | Occupancy |  | occupancy |  |  |  |
| binary_sensor.approaching_openplan_room_occupancy | binary_sensor | matter | Approaching Openplan room |  |  | Occupancy |  | occupancy |  |  |  |
| binary_sensor.approaching_openplan_room_occupancy_2 | binary_sensor | matter | Approaching Openplan room |  |  | Occupancy |  | occupancy |  |  |  |
| binary_sensor.aqara_curtain_driver_e1_problem | binary_sensor | matter | Aqara Curtain Driver E1 |  |  | Problem | diagnostic | problem |  |  |  |
| binary_sensor.aqara_curtain_driver_e1_problem_2 | binary_sensor | matter | Aqara Curtain Driver E1 |  |  | Problem | diagnostic | problem |  |  |  |
| binary_sensor.aqara_curtain_driver_e1_problem_3 | binary_sensor | matter | Aqara Curtain Driver E1 |  |  | Problem | diagnostic | problem |  |  |  |
| binary_sensor.aqara_curtain_driver_e1_problem_4 | binary_sensor | matter | Aqara Curtain Driver E1 |  |  | Problem | diagnostic | problem |  |  |  |
| binary_sensor.aqara_door_and_window_sensor_door | binary_sensor | matter | Aqara Door and Window Sensor |  |  | Door |  | door |  |  |  |
| binary_sensor.aqara_door_and_window_sensor_door_10 | binary_sensor | matter | Aqara Door and Window Sensor |  |  | Door |  | door |  |  |  |
| binary_sensor.aqara_door_and_window_sensor_door_11 | binary_sensor | matter | Aqara Door and Window Sensor |  |  | Door |  | door |  |  |  |
| binary_sensor.aqara_door_and_window_sensor_door_12 | binary_sensor | matter | Aqara Door and Window Sensor |  |  | Door |  | door |  |  |  |
| binary_sensor.aqara_door_and_window_sensor_door_13 | binary_sensor | matter | Aqara Door and Window Sensor |  |  | Door |  | door |  |  |  |
| binary_sensor.aqara_door_and_window_sensor_door_14 | binary_sensor | matter | Aqara Door and Window Sensor |  |  | Door |  | door |  |  |  |
| binary_sensor.aqara_door_and_window_sensor_door_2 | binary_sensor | matter | Aqara Door and Window Sensor |  |  | Door |  | door |  |  |  |
| binary_sensor.aqara_door_and_window_sensor_door_3 | binary_sensor | matter | Aqara Door and Window Sensor |  |  | Door |  | door |  |  |  |
| binary_sensor.aqara_door_and_window_sensor_door_4 | binary_sensor | matter | Aqara Door and Window Sensor |  |  | Door |  | door |  |  |  |
| binary_sensor.aqara_door_and_window_sensor_door_5 | binary_sensor | matter | Aqara Door and Window Sensor |  |  | Door |  | door |  |  |  |
| binary_sensor.aqara_door_and_window_sensor_door_6 | binary_sensor | matter | Aqara Door and Window Sensor |  |  | Door |  | door |  |  |  |
| binary_sensor.aqara_door_and_window_sensor_door_7 | binary_sensor | matter | Aqara Door and Window Sensor |  |  | Door |  | door |  |  |  |
| binary_sensor.aqara_door_and_window_sensor_door_8 | binary_sensor | matter | Aqara Door and Window Sensor |  |  | Door |  | door |  |  |  |
| binary_sensor.aqara_door_and_window_sensor_door_9 | binary_sensor | matter | Aqara Door and Window Sensor |  |  | Door |  | door |  |  |  |
| binary_sensor.aqara_motion_sensor_p1_occupancy | binary_sensor | matter | Aqara Motion Sensor P1 |  |  | Occupancy |  | occupancy |  |  |  |
| binary_sensor.aqara_motion_sensor_p1_occupancy_2 | binary_sensor | matter | Aqara Motion Sensor P1 |  |  | Occupancy |  | occupancy |  |  |  |
| binary_sensor.aqara_motion_sensor_p1_occupancy_3 | binary_sensor | matter | Aqara Motion Sensor P1 |  |  | Occupancy |  | occupancy |  |  |  |
| binary_sensor.aqara_motion_sensor_p1_occupancy_4 | binary_sensor | matter | Aqara Motion Sensor P1 |  |  | Occupancy |  | occupancy |  |  |  |
| binary_sensor.aqara_presence_sensor_fp1e_occupancy | binary_sensor | matter | Aqara Presence Sensor FP1E |  |  | Occupancy |  | occupancy |  |  |  |
| binary_sensor.aqara_presence_sensor_fp1e_occupancy_2 | binary_sensor | matter | Aqara Presence Sensor FP1E |  |  | Occupancy |  | occupancy |  |  |  |
| binary_sensor.aqara_presence_sensor_fp1e_occupancy_3 | binary_sensor | matter | Aqara Presence Sensor FP1E |  |  | Occupancy |  | occupancy |  |  |  |
| binary_sensor.aqara_presence_sensor_fp1e_occupancy_4 | binary_sensor | matter | Aqara Presence Sensor FP1E |  |  | Occupancy |  | occupancy |  |  |  |
| binary_sensor.aqara_vibration_sensor_occupancy | binary_sensor | matter | Aqara Vibration Sensor |  |  | Occupancy |  | occupancy |  |  |  |
| binary_sensor.aqara_vibration_sensor_occupancy_2 | binary_sensor | matter | Aqara Vibration Sensor |  |  | Occupancy |  | occupancy |  |  |  |
| binary_sensor.bathroom_motion | binary_sensor | hue | Bathroom | My Bathroom |  | Motion |  | motion |  |  |  |
| binary_sensor.beta_bedroom_no_presence_3mins_occupancy | binary_sensor | matter | Beta bedroom no presence 3mins |  |  | Occupancy |  | occupancy |  |  |  |
| binary_sensor.beta_bedroom_no_presence_3mins_occupancy_2 | binary_sensor | matter | Beta bedroom no presence 3mins |  |  | Occupancy |  | occupancy |  |  |  |
| binary_sensor.beta_bedroom_presence_detected_occupancy | binary_sensor | matter | Beta bedroom presence detected |  |  | Occupancy |  | occupancy |  |  |  |
| binary_sensor.beta_bedroom_presence_detected_occupancy_2 | binary_sensor | matter | Beta bedroom presence detected |  |  | Occupancy |  | occupancy |  |  |  |
| binary_sensor.hallway_motionaware_ceiling | binary_sensor | hue | Hallway | Hallway (Pass) |  | Hallway MotionAware Ceiling |  | motion |  |  |  |
| binary_sensor.hub_3_motionsensor_occupancy | binary_sensor | matter | Hub 3 MotionSensor |  |  | Occupancy |  | occupancy |  |  |  |
| binary_sensor.hue_motion_sensor_motion | binary_sensor | hue | Hue Motion Sensor | Spare Bedroom |  | Motion |  | motion |  |  |  |
| binary_sensor.hue_motion_sensor_motion_2 | binary_sensor | hue | Hue Motion Sensor | Ensuite (Throne) Bathroom |  | Motion |  | motion |  |  |  |
| binary_sensor.iphone_16pro_max_focus | binary_sensor | mobile_app | iPhone 16Pro Max  |  |  | iPhone 16Pro Max  Focus |  |  |  |  |  |
| binary_sensor.macbook_air_active | binary_sensor | mobile_app | MacBook Air  |  |  | MacBook Air  Active |  |  |  |  |  |
| binary_sensor.macbook_air_audio_input_in_use | binary_sensor | mobile_app | MacBook Air  |  |  | MacBook Air  Audio Input In Use |  |  |  |  |  |
| binary_sensor.macbook_air_audio_output_in_use | binary_sensor | mobile_app | MacBook Air  |  |  | MacBook Air  Audio Output In Use |  |  |  |  |  |
| binary_sensor.macbook_air_camera_in_use | binary_sensor | mobile_app | MacBook Air  |  |  | MacBook Air  Camera In Use |  |  |  |  |  |
| binary_sensor.presence_dining_zone_occupancy | binary_sensor | matter | Presence Dining zone |  |  | Occupancy |  | occupancy |  |  |  |
| binary_sensor.presence_dining_zone_occupancy_2 | binary_sensor | matter | Presence Dining zone |  |  | Occupancy |  | occupancy |  |  |  |
| binary_sensor.presence_kitchen_zone_occupancy | binary_sensor | matter | Presence kitchen zone |  |  | Occupancy |  | occupancy |  |  |  |
| binary_sensor.presence_kitchen_zone_occupancy_2 | binary_sensor | matter | Presence kitchen zone |  |  | Occupancy |  | occupancy |  |  |  |
| binary_sensor.presence_living_zone_occupancy | binary_sensor | matter | Presence living zone |  |  | Occupancy |  | occupancy |  |  |  |
| binary_sensor.presence_living_zone_occupancy_2 | binary_sensor | matter | Presence living zone |  |  | Occupancy |  | occupancy |  |  |  |
| binary_sensor.remote_ui | binary_sensor | cloud |  |  |  | Remote UI | diagnostic | connectivity |  |  |  |
| binary_sensor.roller_shade_0a_problem | binary_sensor | matter | Roller Shade 0A |  |  | Problem | diagnostic | problem |  |  |  |
| binary_sensor.roller_shade_2a_problem | binary_sensor | matter | Roller Shade 2A |  |  | Problem | diagnostic | problem |  |  |  |
| binary_sensor.roller_shade_84_problem | binary_sensor | matter | Roller Shade 84 |  |  | Problem | diagnostic | problem |  |  |  |
| binary_sensor.secondary_bathroom_motion | binary_sensor | hue | Secondary Bathroom | Secondary Bathroom |  | Motion |  | motion |  |  |  |
| binary_sensor.sun_solar_rising | binary_sensor | sun | Sun |  |  | Solar rising | diagnostic |  |  | integration |  |
| binary_sensor.withings_in_bed | binary_sensor | withings | Withings | Bedroom (Alpha) |  | In bed |  | occupancy |  |  |  |
| button.absence_for_3mins_dining_zone_identify | button | matter | Absence for 3mins dining zone |  |  | Identify | diagnostic | identify |  |  |  |
| button.absence_for_3mins_dining_zone_identify_2 | button | matter | Absence for 3mins dining zone |  |  | Identify | diagnostic | identify |  |  |  |
| button.absence_for_3mins_kitchen_zone_identify | button | matter | Absence for 3mins kitchen zone |  |  | Identify | diagnostic | identify |  |  |  |
| button.absence_for_3mins_kitchen_zone_identify_2 | button | matter | Absence for 3mins kitchen zone |  |  | Identify | diagnostic | identify |  |  |  |
| button.absence_for_3mins_living_zone_identify | button | matter | Absence for 3mins living zone |  |  | Identify | diagnostic | identify |  |  |  |
| button.absence_for_3mins_living_zone_identify_2 | button | matter | Absence for 3mins living zone |  |  | Identify | diagnostic | identify |  |  |  |
| button.absence_for_5mins_openplan_identify | button | matter | Absence for 5mins Openplan |  |  | Identify | diagnostic | identify |  |  |  |
| button.absence_for_5mins_openplan_identify_2 | button | matter | Absence for 5mins Openplan |  |  | Identify | diagnostic | identify |  |  |  |
| button.approaching_openplan_room_identify | button | matter | Approaching Openplan room |  |  | Identify | diagnostic | identify |  |  |  |
| button.approaching_openplan_room_identify_2 | button | matter | Approaching Openplan room |  |  | Identify | diagnostic | identify |  |  |  |
| button.aqara_curtain_driver_e1_identify | button | matter | Aqara Curtain Driver E1 |  |  | Identify | diagnostic | identify |  |  |  |
| button.aqara_curtain_driver_e1_identify_2 | button | matter | Aqara Curtain Driver E1 |  |  | Identify | diagnostic | identify |  |  |  |
| button.aqara_curtain_driver_e1_identify_3 | button | matter | Aqara Curtain Driver E1 |  |  | Identify | diagnostic | identify |  |  |  |
| button.aqara_curtain_driver_e1_identify_4 | button | matter | Aqara Curtain Driver E1 |  |  | Identify | diagnostic | identify |  |  |  |
| button.aqara_door_and_window_sensor_identify | button | matter | Aqara Door and Window Sensor |  |  | Identify | diagnostic | identify |  |  |  |
| button.aqara_door_and_window_sensor_identify_10 | button | matter | Aqara Door and Window Sensor |  |  | Identify | diagnostic | identify |  |  |  |
| button.aqara_door_and_window_sensor_identify_11 | button | matter | Aqara Door and Window Sensor |  |  | Identify | diagnostic | identify |  |  |  |
| button.aqara_door_and_window_sensor_identify_12 | button | matter | Aqara Door and Window Sensor |  |  | Identify | diagnostic | identify |  |  |  |
| button.aqara_door_and_window_sensor_identify_13 | button | matter | Aqara Door and Window Sensor |  |  | Identify | diagnostic | identify |  |  |  |
| button.aqara_door_and_window_sensor_identify_14 | button | matter | Aqara Door and Window Sensor |  |  | Identify | diagnostic | identify |  |  |  |
| button.aqara_door_and_window_sensor_identify_2 | button | matter | Aqara Door and Window Sensor |  |  | Identify | diagnostic | identify |  |  |  |
| button.aqara_door_and_window_sensor_identify_3 | button | matter | Aqara Door and Window Sensor |  |  | Identify | diagnostic | identify |  |  |  |
| button.aqara_door_and_window_sensor_identify_4 | button | matter | Aqara Door and Window Sensor |  |  | Identify | diagnostic | identify |  |  |  |
| button.aqara_door_and_window_sensor_identify_5 | button | matter | Aqara Door and Window Sensor |  |  | Identify | diagnostic | identify |  |  |  |
| button.aqara_door_and_window_sensor_identify_6 | button | matter | Aqara Door and Window Sensor |  |  | Identify | diagnostic | identify |  |  |  |
| button.aqara_door_and_window_sensor_identify_7 | button | matter | Aqara Door and Window Sensor |  |  | Identify | diagnostic | identify |  |  |  |
| button.aqara_door_and_window_sensor_identify_8 | button | matter | Aqara Door and Window Sensor |  |  | Identify | diagnostic | identify |  |  |  |
| button.aqara_door_and_window_sensor_identify_9 | button | matter | Aqara Door and Window Sensor |  |  | Identify | diagnostic | identify |  |  |  |
| button.aqara_hub_m3_identify | button | matter | Aqara Hub M3 |  |  | Identify | diagnostic | identify |  |  |  |
| button.aqara_hub_m3_identify_2 | button | matter | Aqara Hub M3 |  |  | Identify | diagnostic | identify |  |  |  |
| button.aqara_motion_sensor_p1_identify | button | matter | Aqara Motion Sensor P1 |  |  | Identify | diagnostic | identify |  |  |  |
| button.aqara_motion_sensor_p1_identify_2 | button | matter | Aqara Motion Sensor P1 |  |  | Identify | diagnostic | identify |  |  |  |
| button.aqara_motion_sensor_p1_identify_3 | button | matter | Aqara Motion Sensor P1 |  |  | Identify | diagnostic | identify |  |  |  |
| button.aqara_motion_sensor_p1_identify_4 | button | matter | Aqara Motion Sensor P1 |  |  | Identify | diagnostic | identify |  |  |  |
| button.aqara_presence_sensor_fp1e_identify | button | matter | Aqara Presence Sensor FP1E |  |  | Identify | diagnostic | identify |  |  |  |
| button.aqara_presence_sensor_fp1e_identify_2 | button | matter | Aqara Presence Sensor FP1E |  |  | Identify | diagnostic | identify |  |  |  |
| button.aqara_presence_sensor_fp1e_identify_3 | button | matter | Aqara Presence Sensor FP1E |  |  | Identify | diagnostic | identify |  |  |  |
| button.aqara_presence_sensor_fp1e_identify_4 | button | matter | Aqara Presence Sensor FP1E |  |  | Identify | diagnostic | identify |  |  |  |
| button.aqara_vibration_sensor_identify | button | matter | Aqara Vibration Sensor |  |  | Identify | diagnostic | identify |  |  |  |
| button.aqara_vibration_sensor_identify_2 | button | matter | Aqara Vibration Sensor |  |  | Identify | diagnostic | identify |  |  |  |
| button.aqara_wireless_remote_switch_identify | button | matter | Aqara Wireless Remote Switch |  |  | Identify | diagnostic | identify |  |  |  |
| button.aqara_wireless_remote_switch_identify_2 | button | matter | Aqara Wireless Remote Switch |  |  | Identify | diagnostic | identify |  |  |  |
| button.aqara_wireless_remote_switch_identify_3 | button | matter | Aqara Wireless Remote Switch |  |  | Identify | diagnostic | identify |  |  |  |
| button.aqara_wireless_remote_switch_identify_4 | button | matter | Aqara Wireless Remote Switch |  |  | Identify | diagnostic | identify |  |  |  |
| button.beta_bedroom_no_presence_3mins_identify | button | matter | Beta bedroom no presence 3mins |  |  | Identify | diagnostic | identify |  |  |  |
| button.beta_bedroom_no_presence_3mins_identify_2 | button | matter | Beta bedroom no presence 3mins |  |  | Identify | diagnostic | identify |  |  |  |
| button.beta_bedroom_presence_detected_identify | button | matter | Beta bedroom presence detected |  |  | Identify | diagnostic | identify |  |  |  |
| button.beta_bedroom_presence_detected_identify_2 | button | matter | Beta bedroom presence detected |  |  | Identify | diagnostic | identify |  |  |  |
| button.presence_dining_zone_identify | button | matter | Presence Dining zone |  |  | Identify | diagnostic | identify |  |  |  |
| button.presence_dining_zone_identify_2 | button | matter | Presence Dining zone |  |  | Identify | diagnostic | identify |  |  |  |
| button.presence_kitchen_zone_identify | button | matter | Presence kitchen zone |  |  | Identify | diagnostic | identify |  |  |  |
| button.presence_kitchen_zone_identify_2 | button | matter | Presence kitchen zone |  |  | Identify | diagnostic | identify |  |  |  |
| button.presence_living_zone_identify | button | matter | Presence living zone |  |  | Identify | diagnostic | identify |  |  |  |
| button.presence_living_zone_identify_2 | button | matter | Presence living zone |  |  | Identify | diagnostic | identify |  |  |  |
| button.switchbot_hub_3_identify | button | matter | SwitchBot Hub 3 |  |  | Identify | diagnostic | identify |  |  |  |
| button.wiz_a60_filament_identify | button | matter | WiZ A60 Filament |  |  | Identify | diagnostic | identify |  |  |  |
| cover.aqara_curtain_driver_e1 | cover | matter | Aqara Curtain Driver E1 |  |  |  |  | curtain |  |  |  |
| cover.aqara_curtain_driver_e1_2 | cover | matter | Aqara Curtain Driver E1 |  |  |  |  | curtain |  |  |  |
| cover.aqara_curtain_driver_e1_3 | cover | matter | Aqara Curtain Driver E1 |  |  |  |  | curtain |  |  |  |
| cover.aqara_curtain_driver_e1_4 | cover | matter | Aqara Curtain Driver E1 |  |  |  |  | curtain |  |  |  |
| cover.roller_shade_0a | cover | matter | Roller Shade 0A |  |  |  |  | curtain |  |  |  |
| cover.roller_shade_2a | cover | matter | Roller Shade 2A |  |  |  |  | curtain |  |  |  |
| cover.roller_shade_84 | cover | matter | Roller Shade 84 |  |  |  |  | curtain |  |  |  |
| device_tracker.ipad_pro | device_tracker | mobile_app | Jeff’s iPad |  |  | Jeff’s iPad | diagnostic |  |  |  |  |
| device_tracker.iphone_16pro_max | device_tracker | mobile_app | iPhone 16Pro Max  |  |  | iPhone 16Pro Max  | diagnostic |  |  |  |  |
| device_tracker.iphone_17_pro_max | device_tracker | mobile_app | Jeff’s iPhone |  |  | Jeff’s iPhone | diagnostic |  |  |  |  |
| device_tracker.macbook_air | device_tracker | mobile_app | MacBook Air  |  |  | MacBook Air  | diagnostic |  |  |  |  |
| event.alpha_bedroom_dial_switch_button_1 | event | hue | Alpha Bedroom Dial Switch | Bedroom (Alpha) |  | Button 1 |  | button |  |  |  |
| event.alpha_bedroom_dial_switch_button_2 | event | hue | Alpha Bedroom Dial Switch | Bedroom (Alpha) |  | Button 2 |  | button |  |  |  |
| event.alpha_bedroom_dial_switch_button_3 | event | hue | Alpha Bedroom Dial Switch | Bedroom (Alpha) |  | Button 3 |  | button |  |  |  |
| event.alpha_bedroom_dial_switch_button_4 | event | hue | Alpha Bedroom Dial Switch | Bedroom (Alpha) |  | Button 4 |  | button |  |  |  |
| event.alpha_bedroom_dial_switch_rotary | event | hue | Alpha Bedroom Dial Switch | Bedroom (Alpha) |  | Rotary |  | button |  |  |  |
| event.alpha_hue_smart_button_button_1 | event | hue | Alpha Hue Smart Button | Bedroom (Alpha) |  | Button 1 |  | button |  |  |  |
| event.aqara_wireless_remote_switch_button | event | matter | Aqara Wireless Remote Switch |  |  | Button |  | button |  |  |  |
| event.aqara_wireless_remote_switch_button_2 | event | matter | Aqara Wireless Remote Switch |  |  | Button |  | button |  |  |  |
| event.aqara_wireless_remote_switch_button_3 | event | matter | Aqara Wireless Remote Switch |  |  | Button |  | button |  |  |  |
| event.aqara_wireless_remote_switch_button_4 | event | matter | Aqara Wireless Remote Switch |  |  | Button |  | button |  |  |  |
| event.backup_automatic_backup | event | backup | Backup |  |  | Automatic backup |  |  |  |  |  |
| event.bathroom_dimmer_switch_button_1 | event | hue | Bathroom dimmer switch | Ensuite (Throne) Bathroom |  | Button 1 |  | button |  |  |  |
| event.bathroom_dimmer_switch_button_2 | event | hue | Bathroom dimmer switch | Ensuite (Throne) Bathroom |  | Button 2 |  | button |  |  |  |
| event.bathroom_dimmer_switch_button_3 | event | hue | Bathroom dimmer switch | Ensuite (Throne) Bathroom |  | Button 3 |  | button |  |  |  |
| event.bathroom_dimmer_switch_button_4 | event | hue | Bathroom dimmer switch | Ensuite (Throne) Bathroom |  | Button 4 |  | button |  |  |  |
| event.core_tap_dial_light_switch_button_1 | event | hue | Core Tap Dial Light Switch | Openplan (Core) |  | Button 1 |  | button |  |  |  |
| event.core_tap_dial_light_switch_button_2 | event | hue | Core Tap Dial Light Switch | Openplan (Core) |  | Button 2 |  | button |  |  |  |
| event.core_tap_dial_light_switch_button_3 | event | hue | Core Tap Dial Light Switch | Openplan (Core) |  | Button 3 |  | button |  |  |  |
| event.core_tap_dial_light_switch_button_4 | event | hue | Core Tap Dial Light Switch | Openplan (Core) |  | Button 4 |  | button |  |  |  |
| event.core_tap_dial_light_switch_rotary | event | hue | Core Tap Dial Light Switch | Openplan (Core) |  | Rotary |  | button |  |  |  |
| event.hallway_dimmer_switch_button_1 | event | hue | Hallway Dimmer Switch | Hallway (Pass) |  | Button 1 |  | button |  |  |  |
| event.hallway_dimmer_switch_button_2 | event | hue | Hallway Dimmer Switch | Hallway (Pass) |  | Button 2 |  | button |  |  |  |
| event.hallway_dimmer_switch_button_3 | event | hue | Hallway Dimmer Switch | Hallway (Pass) |  | Button 3 |  | button |  |  |  |
| event.hallway_dimmer_switch_button_4 | event | hue | Hallway Dimmer Switch | Hallway (Pass) |  | Button 4 |  | button |  |  |  |
| event.hallway_tap_dial_switch_button_1 | event | hue | Hallway Tap Dial Switch | Spare Bedroom |  | Button 1 |  | button |  |  |  |
| event.hallway_tap_dial_switch_button_2 | event | hue | Hallway Tap Dial Switch | Spare Bedroom |  | Button 2 |  | button |  |  |  |
| event.hallway_tap_dial_switch_button_3 | event | hue | Hallway Tap Dial Switch | Spare Bedroom |  | Button 3 |  | button |  |  |  |
| event.hallway_tap_dial_switch_button_4 | event | hue | Hallway Tap Dial Switch | Spare Bedroom |  | Button 4 |  | button |  |  |  |
| event.hallway_tap_dial_switch_rotary | event | hue | Hallway Tap Dial Switch | Spare Bedroom |  | Rotary |  | button |  |  |  |
| event.hub_3_button_1_button | event | matter | Hub 3 Button 1 |  |  | Button |  | button |  |  |  |
| event.hub_3_button_2_button | event | matter | Hub 3 Button 2 |  |  | Button |  | button |  |  |  |
| event.hub_3_button_3_button | event | matter | Hub 3 Button 3 |  |  | Button |  | button |  |  |  |
| event.hue_smart_button_2_button_1 | event | hue | Hue smart button 2 |  |  | Button 1 |  | button |  |  |  |
| event.hue_smart_button_3_button_1 | event | hue | Hue smart button 3 |  |  | Button 1 |  | button |  |  |  |
| event.splash_dimmer_switch_button_1 | event | hue | Splash Dimmer Switch | Secondary Bathroom |  | Button 1 |  | button |  |  |  |
| event.splash_dimmer_switch_button_2 | event | hue | Splash Dimmer Switch | Secondary Bathroom |  | Button 2 |  | button |  |  |  |
| event.splash_dimmer_switch_button_3 | event | hue | Splash Dimmer Switch | Secondary Bathroom |  | Button 3 |  | button |  |  |  |
| event.splash_dimmer_switch_button_4 | event | hue | Splash Dimmer Switch | Secondary Bathroom |  | Button 4 |  | button |  |  |  |
| fan.core_300s | fan | vesync | Core 300S | Bedroom |  |  |  |  |  |  |  |
| input_boolean.test_mode | input_boolean | input_boolean |  |  |  | Test Mode |  |  |  |  |  |
| light.all_bedroom_bathroom | light | hue | All Bedroom & Bathroom | Bedroom |  |  |  |  |  |  |  |
| light.alpha_ceiling_light_4 | light | hue | Alpha Ceiling Light.4 | Bedroom (Alpha) |  |  |  |  |  |  |  |
| light.alpha_ceiling_light_6 | light | hue | Alpha Ceiling Light.6 | Bedroom |  |  |  |  |  |  |  |
| light.alpha_gradient_light_tube_1 | light | hue | alpha gradient light-tube.1 | Bedroom |  |  |  |  |  |  |  |
| light.alphabed_ceiling_light_3 | light | hue | Alphabed Ceiling Light.3 | Bedroom (Alpha) |  |  |  |  |  |  |  |
| light.alphabed_ceiling_light_5 | light | hue | Alphabed Ceiling Light.5 | Bedroom (Alpha) |  |  |  |  |  |  |  |
| light.alphabed_ceiling_light_5_2 | light | hue | Alphabed Ceiling Light.5 | Bedroom (Alpha) |  |  |  |  |  |  |  |
| light.alphadoor_ceiling_light_6 | light | hue | Alpha Ceiling Light.6 | Bedroom (Alpha) |  | alphadoor ceiling light.6 |  |  |  |  |  |
| light.bathroom | light | hue | Bathroom | My Bathroom |  |  |  |  |  |  |  |
| light.bedroom | light | hue | Bedroom | Bedroom (Alpha) |  |  |  |  |  |  |  |
| light.bedroom_ceiling | light | hue | Bedroom Ceiling | Bedroom |  |  |  |  |  |  |  |
| light.bedroom_lamps | light | hue | Bedroom Lamps | Bedroom |  |  |  |  |  |  |  |
| light.beige_ola_spotlight_lamp | light | hue | Beige Ola Spotlight Lamp | Living Room |  |  |  |  |  |  |  |
| light.beta_bed_lightstrip | light | hue | Beta Bed Lightstrip | Spare Bedroom |  |  |  |  |  |  |  |
| light.beta_bedroom_bath | light | hue | Beta Bedroom & Bath | Spare Bedroom |  |  |  |  |  |  |  |
| light.beta_ceiling_light_3 | light | hue | Beta Ceiling Light.3 | Spare Bedroom |  |  |  |  |  |  |  |
| light.beta_ceiling_light_3_2 | light | hue | Beta Ceiling Light.3 | Spare Bedroom |  |  |  |  |  |  |  |
| light.beta_ceiling_light_4 | light | hue | Beta Ceiling Light.4 | Spare Bedroom |  |  |  |  |  |  |  |
| light.beta_ceiling_light_6 | light | hue | Beta Ceiling Light.6 | Spare Bedroom |  |  |  |  |  |  |  |
| light.betaflex_ceiling_light_1 | light | hue | Betaflex Ceiling Light.1 | Spare Bedroom |  | Betaflex Ceiling Light.1 |  |  |  |  |  |
| light.betaflex_ceiling_light_2 | light | hue | Betaflex Ceiling Light.2 | Spare Bedroom |  |  |  |  |  |  |  |
| light.core_ceiling_3 | light | hue | core ceiling.3 | Bedroom (Alpha) |  |  |  |  |  |  |  |
| light.core_ceiling_light_1 | light | hue | Core Ceiling Light.1 | Openplan (Core) |  |  |  |  |  |  |  |
| light.core_ceiling_light_10 | light | hue | Core Ceiling Light.10 | Openplan (Core) |  |  |  |  |  |  |  |
| light.core_ceiling_light_2 | light | hue | Core Ceiling Light.2 | Openplan (Core) |  |  |  |  |  |  |  |
| light.core_ceiling_light_4 | light | hue | Core Ceiling Light.4 | Openplan (Core) |  |  |  |  |  |  |  |
| light.core_ceiling_light_5 | light | hue | Core Ceiling Light.5 | Openplan (Core) |  |  |  |  |  |  |  |
| light.core_ceiling_light_5_2 | light | hue | Core Ceiling Light.5 | Living Room |  |  |  |  |  |  |  |
| light.core_ceiling_light_6 | light | hue | Core Ceiling Light.6 | Openplan (Core) |  |  |  |  |  |  |  |
| light.core_ceiling_light_7 | light | hue | Core Ceiling Light.4 | Openplan (Core) |  | Core Ceiling Light.7 |  |  |  |  |  |
| light.core_ceiling_light_8 | light | hue | Core Ceiling Light.8 | Openplan (Core) |  |  |  |  |  |  |  |
| light.core_ceiling_light_9 | light | hue | Core Ceiling Light.9 | Core_kitchen |  |  |  |  |  |  |  |
| light.core_statement_arc_floor_lamp_monica_vibelucci | light | hue | Core Statement Arc Floor Lamp Monica Vibelucci | Openplan (Core) |  |  |  |  |  |  |  |
| light.fado_glass_globe_lamp | light | hue | fado glass globe lamp |  |  |  |  |  |  |  |  |
| light.hallway | light | hue | Hallway | Hallway (Pass) |  |  |  |  |  |  |  |
| light.hue_play_1 | light | hue | Hue Play 1 |  |  |  |  |  |  |  |  |
| light.hue_play_2 | light | hue | Hue Play 2 |  |  |  |  |  |  |  |  |
| light.hue_signe_white_gradient_floor_lamp_1 | light | hue | Hue Signe White Gradient Floor Lamp.1 | Openplan (Core) |  |  |  |  |  |  |  |
| light.hue_smart_plug_1 | light | hue | Hue smart plug 1 |  |  |  |  |  |  |  |  |
| light.ikea_skytrax_light | light | hue | Ikea Skytrax Light | Bedroom |  |  |  |  |  |  |  |
| light.kitchen | light | hue | Kitchen | Core_kitchen |  |  |  |  |  |  |  |
| light.kitchen_ceiling | light | hue | Kitchen Ceiling | Core_kitchen |  |  |  |  |  |  |  |
| light.klasnick_beige_table_lamp_with_e14_hue_colour | light | hue | Klasnick Beige Table Lamp (with E14 Hue Colour) | Openplan (Core) |  |  |  |  |  |  |  |
| light.laundry_chaos_ceiling_light | light | hue | Laundry (Chaos) Ceiling Light | Laundry/Utilities |  |  |  |  |  |  |  |
| light.laundry_room | light | hue | Laundry room | Laundry room |  |  |  |  |  |  |  |
| light.living_room | light | hue | Living room | Living Room |  |  |  |  |  |  |  |
| light.living_room_ceiling | light | hue | Core Living Ceiling | Living Room |  |  |  |  |  |  |  |
| light.living_room_lamps | light | hue | Living room lamps | Living Room |  |  |  |  |  |  |  |
| light.nyamane_3_spot_lamp_top | light | hue | Nyamane 3-spot Lamp - Top  |  |  |  |  |  |  |  |  |
| light.nymane_3_spot_lamp_low | light | hue | Nymane 3-spot Lamp - Low | Bedroom (Alpha) |  |  |  |  |  |  |  |
| light.nymane_3_spot_lamp_mid | light | hue | Nymane 3-spot Lamp - Mid |  |  |  |  |  |  |  |  |
| light.ola_whitborg_xl_floor_lamp | light | hue | Ola Whitborg XL Floor Lamp |  |  |  |  |  |  |  |  |
| light.pass_ceiling_light_1 | light | hue | Pass Ceiling Light.1 | Hallway (Pass) |  |  |  |  |  |  |  |
| light.pass_ceiling_light_1_2 | light | hue | Pass Ceiling Light.1  | Hallway (Pass) |  |  |  |  |  |  |  |
| light.pass_ceiling_light_2 | light | hue | Pass Ceiling Light.2 | Hallway (Pass) |  |  |  |  |  |  |  |
| light.pass_ceiling_light_4 | light | hue | Pass Ceiling Light.4 | Hallway (Pass) |  |  |  |  |  |  |  |
| light.pass_ceiling_light_5 | light | hue | Pass Ceiling Light.5 | Hallway (Pass) |  |  |  |  |  |  |  |
| light.right_bedside_lamp | light | hue | Right Bedside Lamp | Bedroom |  |  |  |  |  |  |  |
| light.secondary_bathroom | light | hue | Secondary Bathroom | Secondary Bathroom |  |  |  |  |  |  |  |
| light.signe_gradient_floor_1 | light | hue | Signe gradient floor 1 | Openplan (Core) |  |  |  |  |  |  |  |
| light.signe_gradient_table_1 | light | hue | Signe gradient table 1 |  |  |  |  |  |  |  |  |
| light.spare_bedroom | light | hue | Spare Bedroom | Spare Bedroom |  |  |  |  |  |  |  |
| light.spare_bedroom_ceiling | light | hue | Spare Bedroom Ceiling | Spare Bedroom |  |  |  |  |  |  |  |
| light.splash_ceiling_light_1 | light | hue | Splash Ceiling Light.1 | Secondary Bathroom |  |  |  |  |  |  |  |
| light.splash_ceiling_light_2 | light | hue | Splash Ceiling Light.2 | Secondary Bathroom |  |  |  |  |  |  |  |
| light.splash_ceiling_light_3 | light | hue | Splash Ceiling Light.3 | Secondary Bathroom |  |  |  |  |  |  |  |
| light.splash_ceiling_light_4 | light | hue | Splash Ceiling Light.4 | Secondary Bathroom |  |  |  |  |  |  |  |
| light.splash_ceiling_light_5 | light | hue | Splash Ceiling Light.5 | Secondary Bathroom |  |  |  |  |  |  |  |
| light.throne_ceiling_light_2 | light | hue | Throne Ceiling above shower door | Ensuite (Throne) Bathroom |  |  |  |  |  |  |  |
| light.throne_ceiling_light_3 | light | hue | Throne Ceiling Light.3 | Ensuite (Throne) Bathroom |  |  |  |  |  |  |  |
| light.throne_ceiling_light_3_2 | light | hue | Throne Ceiling above sink | Ensuite (Throne) Bathroom |  |  |  |  |  |  |  |
| light.throne_ceiling_light_4 | light | hue | Throne Ceiling above Door | Ensuite (Throne) Bathroom |  |  |  |  |  |  |  |
| light.white_e27_hue_bulb | light | hue | White (E27) Hue Bulb | Laundry/Utilities |  |  |  |  |  |  |  |
| light.wiz_a60_filament | light | matter | WiZ A60 Filament |  |  |  |  |  |  |  |  |
| media_player.bedroom_apple_tv | media_player | apple_tv | Bedroom Apple TV | Spare Bedroom |  |  |  |  |  |  |  |
| media_player.bedroom_display | media_player | cast | Bedroom Display |  |  |  |  |  |  |  |  |
| media_player.core_lounge_homepod | media_player | apple_tv | Core Lounge HomePod | Living Room |  |  |  |  |  |  |  |
| media_player.core_lounge_homepod_2 | media_player | apple_tv | Core Lounge HomePod | Living Room |  |  |  |  |  |  |  |
| media_player.living_room_2 | media_player | apple_tv | Living Room (2) | Living Room (2) |  |  |  |  |  |  |  |
| media_player.lounge_apple_tv_wired | media_player | apple_tv | Lounge Apple TV (WIred) | Living Room |  |  |  |  |  |  |  |
| media_player.nesthubd029 | media_player | cast | NestHubD029 |  |  |  |  |  |  |  |  |
| media_player.nesthubd029_2 | media_player | cast | Loft Display |  |  |  |  |  |  |  |  |
| media_player.nesthubd029_3 | media_player | cast | NestHubD029 |  |  |  |  |  |  |  |  |
| media_player.orange_homepod_mini | media_player | apple_tv | Orange HomePod Mini | Bedroom |  |  |  |  |  |  |  |
| media_player.serif_tv | media_player | cast | Serif TV |  |  |  |  |  |  |  |  |
| media_player.white_homepod_mini | media_player | apple_tv | White HomePod Mini | White HomePod Mini |  |  |  |  |  |  |  |
| number.wiz_a60_filament_off_transition_time | number | matter | WiZ A60 Filament |  |  | Off transition time | config |  | s |  |  |
| number.wiz_a60_filament_on_level | number | matter | WiZ A60 Filament |  |  | On level | config |  |  |  |  |
| number.wiz_a60_filament_on_off_transition_time | number | matter | WiZ A60 Filament |  |  | On/off transition time | config |  | s |  |  |
| number.wiz_a60_filament_on_transition_time | number | matter | WiZ A60 Filament |  |  | On transition time | config |  | s |  |  |
| person.jeffffff | person | person |  |  |  | Jeff |  |  |  |  |  |
| remote.bedroom_apple_tv | remote | apple_tv | Bedroom Apple TV | Spare Bedroom |  |  |  |  |  |  |  |
| remote.core_lounge_homepod | remote | apple_tv | Core Lounge HomePod | Living Room |  |  |  |  |  |  |  |
| remote.core_lounge_homepod_2 | remote | apple_tv | Core Lounge HomePod | Living Room |  |  |  |  |  |  |  |
| remote.living_room_2 | remote | apple_tv | Living Room (2) | Living Room (2) |  |  |  |  |  |  |  |
| remote.lounge_apple_tv_wired | remote | apple_tv | Lounge Apple TV (WIred) | Living Room |  |  |  |  |  |  |  |
| remote.orange_homepod_mini | remote | apple_tv | Orange HomePod Mini | Bedroom |  |  |  |  |  |  |  |
| remote.white_homepod_mini | remote | apple_tv | White HomePod Mini | White HomePod Mini |  |  |  |  |  |  |  |
| scene.bedroom_concentrate | scene | hue | Bedroom | Bedroom (Alpha) |  | Concentrate |  |  |  |  |  |
| scene.bedroom_dimmed | scene | hue | Bedroom | Bedroom (Alpha) |  | Dimmed |  |  |  |  |  |
| scene.bedroom_energise | scene | hue | Bedroom | Bedroom (Alpha) |  | Energise |  |  |  |  |  |
| scene.bedroom_nightlight | scene | hue | Bedroom | Bedroom (Alpha) |  | Nightlight |  |  |  |  |  |
| scene.bedroom_read | scene | hue | Bedroom | Bedroom (Alpha) |  | Read |  |  |  |  |  |
| scene.bedroom_relax | scene | hue | Bedroom | Bedroom (Alpha) |  | Relax |  |  |  |  |  |
| scene.bedroom_sleepy | scene | hue | Bedroom | Bedroom (Alpha) |  | Sleepy |  |  |  |  |  |
| scene.hallway_concentrate | scene | hue | Hallway | Hallway (Pass) |  | Concentrate |  |  |  |  |  |
| scene.hallway_energise | scene | hue | Hallway | Hallway (Pass) |  | Energise |  |  |  |  |  |
| scene.hallway_nightlight | scene | hue | Hallway | Hallway (Pass) |  | Nightlight |  |  |  |  |  |
| scene.hallway_read | scene | hue | Hallway | Hallway (Pass) |  | Read |  |  |  |  |  |
| scene.hallway_relax | scene | hue | Hallway | Hallway (Pass) |  | Relax |  |  |  |  |  |
| scene.new_scene | scene | homeassistant |  |  |  | New scene |  |  |  |  |  |
| select.wiz_a60_filament_power_on_behaviour_on_startup | select | matter | WiZ A60 Filament |  |  | Power-on behaviour on startup | config |  |  |  |  |
| sensor.alpha_bed_zone_ceiling_2_zigbee_connectivity | sensor | hue | Alphabed Ceiling Light.5 | Bedroom (Alpha) |  | Zigbee connectivity | diagnostic | enum |  | integration |  |
| sensor.alpha_bedroom_dial_switch_battery | sensor | hue | Alpha Bedroom Dial Switch | Bedroom (Alpha) |  | Battery | diagnostic | battery | % |  |  |
| sensor.alpha_bedroom_dial_switch_zigbee_connectivity | sensor | hue | Alpha Bedroom Dial Switch | Bedroom (Alpha) |  | Zigbee connectivity | diagnostic | enum |  | integration |  |
| sensor.alpha_bedroom_hue_smart_button_zigbee_connectivity | sensor | hue | Alpha Hue Smart Button | Bedroom (Alpha) |  | Zigbee connectivity | diagnostic | enum |  | integration |  |
| sensor.alpha_hue_smart_button_battery | sensor | hue | Alpha Hue Smart Button | Bedroom (Alpha) |  | Battery | diagnostic | battery | % |  |  |
| sensor.alpha_pass_ceiling_zigbee_connectivity | sensor | hue | Pass Ceiling Light.5 | Hallway (Pass) |  | Zigbee connectivity | diagnostic | enum |  | integration |  |
| sensor.aqara_curtain_driver_e1_battery | sensor | matter | Aqara Curtain Driver E1 |  |  | Battery | diagnostic | battery | % |  |  |
| sensor.aqara_curtain_driver_e1_battery_2 | sensor | matter | Aqara Curtain Driver E1 |  |  | Battery | diagnostic | battery | % |  |  |
| sensor.aqara_curtain_driver_e1_battery_3 | sensor | matter | Aqara Curtain Driver E1 |  |  | Battery | diagnostic | battery | % |  |  |
| sensor.aqara_curtain_driver_e1_battery_4 | sensor | matter | Aqara Curtain Driver E1 |  |  | Battery | diagnostic | battery | % |  |  |
| sensor.aqara_curtain_driver_e1_battery_charge_state | sensor | matter | Aqara Curtain Driver E1 |  |  | Battery charge state | diagnostic | enum |  |  |  |
| sensor.aqara_curtain_driver_e1_battery_charge_state_2 | sensor | matter | Aqara Curtain Driver E1 |  |  | Battery charge state | diagnostic | enum |  |  |  |
| sensor.aqara_curtain_driver_e1_battery_charge_state_3 | sensor | matter | Aqara Curtain Driver E1 |  |  | Battery charge state | diagnostic | enum |  |  |  |
| sensor.aqara_curtain_driver_e1_battery_charge_state_4 | sensor | matter | Aqara Curtain Driver E1 |  |  | Battery charge state | diagnostic | enum |  |  |  |
| sensor.aqara_curtain_driver_e1_battery_voltage | sensor | matter | Aqara Curtain Driver E1 |  |  | Battery voltage | diagnostic | voltage | V |  |  |
| sensor.aqara_curtain_driver_e1_battery_voltage_2 | sensor | matter | Aqara Curtain Driver E1 |  |  | Battery voltage | diagnostic | voltage | V |  |  |
| sensor.aqara_curtain_driver_e1_battery_voltage_3 | sensor | matter | Aqara Curtain Driver E1 |  |  | Battery voltage | diagnostic | voltage | V |  |  |
| sensor.aqara_curtain_driver_e1_battery_voltage_4 | sensor | matter | Aqara Curtain Driver E1 |  |  | Battery voltage | diagnostic | voltage | V |  |  |
| sensor.aqara_curtain_driver_e1_target_opening_position | sensor | matter | Aqara Curtain Driver E1 |  |  | Target opening position | diagnostic |  | % | integration |  |
| sensor.aqara_curtain_driver_e1_target_opening_position_2 | sensor | matter | Aqara Curtain Driver E1 |  |  | Target opening position | diagnostic |  | % | integration |  |
| sensor.aqara_curtain_driver_e1_target_opening_position_3 | sensor | matter | Aqara Curtain Driver E1 |  |  | Target opening position | diagnostic |  | % | integration |  |
| sensor.aqara_curtain_driver_e1_target_opening_position_4 | sensor | matter | Aqara Curtain Driver E1 |  |  | Target opening position | diagnostic |  | % | integration |  |
| sensor.aqara_door_and_window_sensor_battery | sensor | matter | Aqara Door and Window Sensor |  |  | Battery | diagnostic | battery | % |  |  |
| sensor.aqara_door_and_window_sensor_battery_10 | sensor | matter | Aqara Door and Window Sensor |  |  | Battery | diagnostic | battery | % |  |  |
| sensor.aqara_door_and_window_sensor_battery_11 | sensor | matter | Aqara Door and Window Sensor |  |  | Battery | diagnostic | battery | % |  |  |
| sensor.aqara_door_and_window_sensor_battery_12 | sensor | matter | Aqara Door and Window Sensor |  |  | Battery | diagnostic | battery | % |  |  |
| sensor.aqara_door_and_window_sensor_battery_13 | sensor | matter | Aqara Door and Window Sensor |  |  | Battery | diagnostic | battery | % |  |  |
| sensor.aqara_door_and_window_sensor_battery_14 | sensor | matter | Aqara Door and Window Sensor |  |  | Battery | diagnostic | battery | % |  |  |
| sensor.aqara_door_and_window_sensor_battery_2 | sensor | matter | Aqara Door and Window Sensor |  |  | Battery | diagnostic | battery | % |  |  |
| sensor.aqara_door_and_window_sensor_battery_3 | sensor | matter | Aqara Door and Window Sensor |  |  | Battery | diagnostic | battery | % |  |  |
| sensor.aqara_door_and_window_sensor_battery_4 | sensor | matter | Aqara Door and Window Sensor |  |  | Battery | diagnostic | battery | % |  |  |
| sensor.aqara_door_and_window_sensor_battery_5 | sensor | matter | Aqara Door and Window Sensor |  |  | Battery | diagnostic | battery | % |  |  |
| sensor.aqara_door_and_window_sensor_battery_6 | sensor | matter | Aqara Door and Window Sensor |  |  | Battery | diagnostic | battery | % |  |  |
| sensor.aqara_door_and_window_sensor_battery_7 | sensor | matter | Aqara Door and Window Sensor |  |  | Battery | diagnostic | battery | % |  |  |
| sensor.aqara_door_and_window_sensor_battery_8 | sensor | matter | Aqara Door and Window Sensor |  |  | Battery | diagnostic | battery | % |  |  |
| sensor.aqara_door_and_window_sensor_battery_9 | sensor | matter | Aqara Door and Window Sensor |  |  | Battery | diagnostic | battery | % |  |  |
| sensor.aqara_door_and_window_sensor_battery_type | sensor | matter | Aqara Door and Window Sensor |  |  | Battery type | diagnostic |  |  |  |  |
| sensor.aqara_door_and_window_sensor_battery_type_10 | sensor | matter | Aqara Door and Window Sensor |  |  | Battery type | diagnostic |  |  |  |  |
| sensor.aqara_door_and_window_sensor_battery_type_11 | sensor | matter | Aqara Door and Window Sensor |  |  | Battery type | diagnostic |  |  |  |  |
| sensor.aqara_door_and_window_sensor_battery_type_12 | sensor | matter | Aqara Door and Window Sensor |  |  | Battery type | diagnostic |  |  |  |  |
| sensor.aqara_door_and_window_sensor_battery_type_13 | sensor | matter | Aqara Door and Window Sensor |  |  | Battery type | diagnostic |  |  |  |  |
| sensor.aqara_door_and_window_sensor_battery_type_14 | sensor | matter | Aqara Door and Window Sensor |  |  | Battery type | diagnostic |  |  |  |  |
| sensor.aqara_door_and_window_sensor_battery_type_2 | sensor | matter | Aqara Door and Window Sensor |  |  | Battery type | diagnostic |  |  |  |  |
| sensor.aqara_door_and_window_sensor_battery_type_3 | sensor | matter | Aqara Door and Window Sensor |  |  | Battery type | diagnostic |  |  |  |  |
| sensor.aqara_door_and_window_sensor_battery_type_4 | sensor | matter | Aqara Door and Window Sensor |  |  | Battery type | diagnostic |  |  |  |  |
| sensor.aqara_door_and_window_sensor_battery_type_5 | sensor | matter | Aqara Door and Window Sensor |  |  | Battery type | diagnostic |  |  |  |  |
| sensor.aqara_door_and_window_sensor_battery_type_6 | sensor | matter | Aqara Door and Window Sensor |  |  | Battery type | diagnostic |  |  |  |  |
| sensor.aqara_door_and_window_sensor_battery_type_7 | sensor | matter | Aqara Door and Window Sensor |  |  | Battery type | diagnostic |  |  |  |  |
| sensor.aqara_door_and_window_sensor_battery_type_8 | sensor | matter | Aqara Door and Window Sensor |  |  | Battery type | diagnostic |  |  |  |  |
| sensor.aqara_door_and_window_sensor_battery_type_9 | sensor | matter | Aqara Door and Window Sensor |  |  | Battery type | diagnostic |  |  |  |  |
| sensor.aqara_door_and_window_sensor_battery_voltage | sensor | matter | Aqara Door and Window Sensor |  |  | Battery voltage | diagnostic | voltage | V |  |  |
| sensor.aqara_door_and_window_sensor_battery_voltage_10 | sensor | matter | Aqara Door and Window Sensor |  |  | Battery voltage | diagnostic | voltage | V |  |  |
| sensor.aqara_door_and_window_sensor_battery_voltage_11 | sensor | matter | Aqara Door and Window Sensor |  |  | Battery voltage | diagnostic | voltage | V |  |  |
| sensor.aqara_door_and_window_sensor_battery_voltage_12 | sensor | matter | Aqara Door and Window Sensor |  |  | Battery voltage | diagnostic | voltage | V |  |  |
| sensor.aqara_door_and_window_sensor_battery_voltage_13 | sensor | matter | Aqara Door and Window Sensor |  |  | Battery voltage | diagnostic | voltage | V |  |  |
| sensor.aqara_door_and_window_sensor_battery_voltage_14 | sensor | matter | Aqara Door and Window Sensor |  |  | Battery voltage | diagnostic | voltage | V |  |  |
| sensor.aqara_door_and_window_sensor_battery_voltage_2 | sensor | matter | Aqara Door and Window Sensor |  |  | Battery voltage | diagnostic | voltage | V |  |  |
| sensor.aqara_door_and_window_sensor_battery_voltage_3 | sensor | matter | Aqara Door and Window Sensor |  |  | Battery voltage | diagnostic | voltage | V |  |  |
| sensor.aqara_door_and_window_sensor_battery_voltage_4 | sensor | matter | Aqara Door and Window Sensor |  |  | Battery voltage | diagnostic | voltage | V |  |  |
| sensor.aqara_door_and_window_sensor_battery_voltage_5 | sensor | matter | Aqara Door and Window Sensor |  |  | Battery voltage | diagnostic | voltage | V |  |  |
| sensor.aqara_door_and_window_sensor_battery_voltage_6 | sensor | matter | Aqara Door and Window Sensor |  |  | Battery voltage | diagnostic | voltage | V |  |  |
| sensor.aqara_door_and_window_sensor_battery_voltage_7 | sensor | matter | Aqara Door and Window Sensor |  |  | Battery voltage | diagnostic | voltage | V |  |  |
| sensor.aqara_door_and_window_sensor_battery_voltage_8 | sensor | matter | Aqara Door and Window Sensor |  |  | Battery voltage | diagnostic | voltage | V |  |  |
| sensor.aqara_door_and_window_sensor_battery_voltage_9 | sensor | matter | Aqara Door and Window Sensor |  |  | Battery voltage | diagnostic | voltage | V |  |  |
| sensor.aqara_motion_sensor_p1_battery | sensor | matter | Aqara Motion Sensor P1 |  |  | Battery | diagnostic | battery | % |  |  |
| sensor.aqara_motion_sensor_p1_battery_2 | sensor | matter | Aqara Motion Sensor P1 |  |  | Battery | diagnostic | battery | % |  |  |
| sensor.aqara_motion_sensor_p1_battery_3 | sensor | matter | Aqara Motion Sensor P1 |  |  | Battery | diagnostic | battery | % |  |  |
| sensor.aqara_motion_sensor_p1_battery_4 | sensor | matter | Aqara Motion Sensor P1 |  |  | Battery | diagnostic | battery | % |  |  |
| sensor.aqara_motion_sensor_p1_battery_type | sensor | matter | Aqara Motion Sensor P1 |  |  | Battery type | diagnostic |  |  |  |  |
| sensor.aqara_motion_sensor_p1_battery_type_2 | sensor | matter | Aqara Motion Sensor P1 |  |  | Battery type | diagnostic |  |  |  |  |
| sensor.aqara_motion_sensor_p1_battery_type_3 | sensor | matter | Aqara Motion Sensor P1 |  |  | Battery type | diagnostic |  |  |  |  |
| sensor.aqara_motion_sensor_p1_battery_type_4 | sensor | matter | Aqara Motion Sensor P1 |  |  | Battery type | diagnostic |  |  |  |  |
| sensor.aqara_motion_sensor_p1_battery_voltage | sensor | matter | Aqara Motion Sensor P1 |  |  | Battery voltage | diagnostic | voltage | V |  |  |
| sensor.aqara_motion_sensor_p1_battery_voltage_2 | sensor | matter | Aqara Motion Sensor P1 |  |  | Battery voltage | diagnostic | voltage | V |  |  |
| sensor.aqara_motion_sensor_p1_battery_voltage_3 | sensor | matter | Aqara Motion Sensor P1 |  |  | Battery voltage | diagnostic | voltage | V |  |  |
| sensor.aqara_motion_sensor_p1_battery_voltage_4 | sensor | matter | Aqara Motion Sensor P1 |  |  | Battery voltage | diagnostic | voltage | V |  |  |
| sensor.aqara_vibration_sensor_battery | sensor | matter | Aqara Vibration Sensor |  |  | Battery | diagnostic | battery | % |  |  |
| sensor.aqara_vibration_sensor_battery_2 | sensor | matter | Aqara Vibration Sensor |  |  | Battery | diagnostic | battery | % |  |  |
| sensor.aqara_vibration_sensor_battery_type | sensor | matter | Aqara Vibration Sensor |  |  | Battery type | diagnostic |  |  |  |  |
| sensor.aqara_vibration_sensor_battery_type_2 | sensor | matter | Aqara Vibration Sensor |  |  | Battery type | diagnostic |  |  |  |  |
| sensor.aqara_vibration_sensor_battery_voltage | sensor | matter | Aqara Vibration Sensor |  |  | Battery voltage | diagnostic | voltage | V |  |  |
| sensor.aqara_vibration_sensor_battery_voltage_2 | sensor | matter | Aqara Vibration Sensor |  |  | Battery voltage | diagnostic | voltage | V |  |  |
| sensor.aqara_wireless_remote_switch_battery | sensor | matter | Aqara Wireless Remote Switch |  |  | Battery | diagnostic | battery | % |  |  |
| sensor.aqara_wireless_remote_switch_battery_2 | sensor | matter | Aqara Wireless Remote Switch |  |  | Battery | diagnostic | battery | % |  |  |
| sensor.aqara_wireless_remote_switch_battery_type | sensor | matter | Aqara Wireless Remote Switch |  |  | Battery type | diagnostic |  |  |  |  |
| sensor.aqara_wireless_remote_switch_battery_type_2 | sensor | matter | Aqara Wireless Remote Switch |  |  | Battery type | diagnostic |  |  |  |  |
| sensor.aqara_wireless_remote_switch_battery_voltage | sensor | matter | Aqara Wireless Remote Switch |  |  | Battery voltage | diagnostic | voltage | V |  |  |
| sensor.aqara_wireless_remote_switch_battery_voltage_2 | sensor | matter | Aqara Wireless Remote Switch |  |  | Battery voltage | diagnostic | voltage | V |  |  |
| sensor.aqara_wireless_remote_switch_current_switch_position | sensor | matter | Aqara Wireless Remote Switch |  |  | Current switch position | diagnostic |  |  | integration |  |
| sensor.aqara_wireless_remote_switch_current_switch_position_2 | sensor | matter | Aqara Wireless Remote Switch |  |  | Current switch position | diagnostic |  |  | integration |  |
| sensor.aqara_wireless_remote_switch_current_switch_position_3 | sensor | matter | Aqara Wireless Remote Switch |  |  | Current switch position | diagnostic |  |  | integration |  |
| sensor.aqara_wireless_remote_switch_current_switch_position_4 | sensor | matter | Aqara Wireless Remote Switch |  |  | Current switch position | diagnostic |  |  | integration |  |
| sensor.backup_backup_manager_state | sensor | backup | Backup |  |  | Backup Manager state |  | enum |  |  |  |
| sensor.backup_last_attempted_automatic_backup | sensor | backup | Backup |  |  | Last attempted automatic backup |  | timestamp |  |  |  |
| sensor.backup_last_successful_automatic_backup | sensor | backup | Backup |  |  | Last successful automatic backup |  | timestamp |  |  |  |
| sensor.backup_next_scheduled_automatic_backup | sensor | backup | Backup |  |  | Next scheduled automatic backup |  | timestamp |  |  |  |
| sensor.bathroom2_hue_motion_sensor_zigbee_connectivity | sensor | hue | Hue Motion Sensor | Spare Bedroom |  | Zigbee connectivity | diagnostic | enum |  | integration |  |
| sensor.bathroom_dimmer_switch_battery | sensor | hue | Bathroom dimmer switch | Ensuite (Throne) Bathroom |  | Battery | diagnostic | battery | % |  |  |
| sensor.bathroom_illuminance | sensor | hue | Bathroom | My Bathroom |  | Illuminance |  | illuminance | lx |  |  |
| sensor.bed1_zigbee_connectivity | sensor | hue | Alphabed Ceiling Light.5 | Bedroom (Alpha) |  | Zigbee connectivity | diagnostic | enum |  | integration |  |
| sensor.bed3_zigbee_connectivity | sensor | hue | Alphabed Ceiling Light.3 | Bedroom (Alpha) |  | Zigbee connectivity | diagnostic | enum |  | integration |  |
| sensor.beige_ola_spotlight_lamp_zigbee_connectivity | sensor | hue | Beige Ola Spotlight Lamp | Living Room |  | Zigbee connectivity | diagnostic | enum |  | integration |  |
| sensor.beta_bed_lightstrip_zigbee_connectivity | sensor | hue | Beta Bed Lightstrip | Spare Bedroom |  | Zigbee connectivity | diagnostic | enum |  | integration |  |
| sensor.beta_bedroom_hue_dial_switch_zigbee_connectivity | sensor | hue | Hallway Tap Dial Switch | Spare Bedroom |  | Zigbee connectivity | diagnostic | enum |  | integration |  |
| sensor.beta_ceiling_light_3_zigbee_connectivity | sensor | hue | Beta Ceiling Light.3 | Spare Bedroom |  | Zigbee connectivity | diagnostic | enum |  | integration |  |
| sensor.beta_ceiling_light_4_zigbee_connectivity | sensor | hue | Beta Ceiling Light.4 | Spare Bedroom |  | Zigbee connectivity | diagnostic | enum |  | integration |  |
| sensor.beta_ceiling_light_6_zigbee_connectivity | sensor | hue | Beta Ceiling Light.6 | Spare Bedroom |  | Zigbee connectivity | diagnostic | enum |  | integration |  |
| sensor.beta_ceiling_light_zigbee_connectivity | sensor | hue | Beta Ceiling Light.3 | Spare Bedroom |  | Zigbee connectivity | diagnostic | enum |  | integration |  |
| sensor.beta_flex_ceiling_light_1_zigbee_connectivity | sensor | hue | Betaflex Ceiling Light.1 | Spare Bedroom |  | Zigbee connectivity | diagnostic | enum |  | integration |  |
| sensor.beta_flex_ceiling_light_2_zigbee_connectivity | sensor | hue | Betaflex Ceiling Light.2 | Spare Bedroom |  | Zigbee connectivity | diagnostic | enum |  | integration |  |
| sensor.beta_pass_ceiling_zigbee_connectivity | sensor | hue | Pass Ceiling Light.1  | Hallway (Pass) |  | Zigbee connectivity | diagnostic | enum |  | integration |  |
| sensor.betaflex_lower_shelf_zigbee_connectivity | sensor | hue | Ikea Skytrax Light | Bedroom |  | Zigbee connectivity | diagnostic | enum |  | integration |  |
| sensor.bot_4a_battery | sensor | matter | Bot 4A |  |  | Battery | diagnostic | battery | % |  |  |
| sensor.ceiling_bedroom1_bed4_zigbee_connectivity | sensor | hue | Alpha Ceiling Light.4 | Bedroom (Alpha) |  | Zigbee connectivity | diagnostic | enum |  | integration |  |
| sensor.ceiling_bedroom1_closet_zone_zigbee_connectivity | sensor | hue | core ceiling.3 | Bedroom (Alpha) |  | Zigbee connectivity | diagnostic | enum |  | integration |  |
| sensor.ceiling_bedroom1_door_zone_zigbee_connectivity | sensor | hue | Alpha Ceiling Light.6 | Bedroom (Alpha) |  | Zigbee connectivity | diagnostic | enum |  | integration |  |
| sensor.ceiling_ensuite_bathroom_zigbee_connectivity | sensor | hue | Throne Ceiling above sink | Ensuite (Throne) Bathroom |  | Zigbee connectivity | diagnostic | enum |  | integration |  |
| sensor.ceiling_ensuite_bathroom_zigbee_connectivity_2 | sensor | hue | Throne Ceiling above Door | Ensuite (Throne) Bathroom |  | Zigbee connectivity | diagnostic | enum |  | integration |  |
| sensor.ceiling_ensuite_bathroom_zigbee_connectivity_3 | sensor | hue | Throne Ceiling above shower door | Ensuite (Throne) Bathroom |  | Zigbee connectivity | diagnostic | enum |  | integration |  |
| sensor.ceiling_ensuite_bathroom_zigbee_connectivity_4 | sensor | hue | Throne Ceiling Light.3 | Ensuite (Throne) Bathroom |  | Zigbee connectivity | diagnostic | enum |  | integration |  |
| sensor.ceiling_kitchen_fridge_zigbee_connectivity | sensor | hue | Core Ceiling Light.9 | Core_kitchen |  | Zigbee connectivity | diagnostic | enum |  | integration |  |
| sensor.ceiling_kitchen_sink_zigbee_connectivity | sensor | hue | Core Ceiling Light.10 | Openplan (Core) |  | Zigbee connectivity | diagnostic | enum |  | integration |  |
| sensor.ceiling_op_br_zigbee_connectivity | sensor | hue | Core Ceiling Light.8 | Openplan (Core) |  | Zigbee connectivity | diagnostic | enum |  | integration |  |
| sensor.ceiling_op_north_wall_zone_a1b_zigbee_connectivity | sensor | hue | Core Ceiling Light.1 | Openplan (Core) |  | Zigbee connectivity | diagnostic | enum |  | integration |  |
| sensor.ceiling_op_north_wall_zone_zigbee_connectivity | sensor | hue | Core Ceiling Light.2 | Openplan (Core) |  | Zigbee connectivity | diagnostic | enum |  | integration |  |
| sensor.ceiling_op_south_zigbee_connectivity | sensor | hue | Core Ceiling Light.5 | Living Room |  | Zigbee connectivity | diagnostic | enum |  | integration |  |
| sensor.ceiling_open_plan_east_zigbee_connectivity | sensor | hue | Core Ceiling Light.5 | Openplan (Core) |  | Zigbee connectivity | diagnostic | enum |  | integration |  |
| sensor.ceiling_open_plan_mm_zigbee_connectivity | sensor | hue | Core Ceiling Light.6 | Openplan (Core) |  | Zigbee connectivity | diagnostic | enum |  | integration |  |
| sensor.ceiling_open_plan_mr_zigbee_connectivity | sensor | hue | Core Ceiling Light.4 | Openplan (Core) |  | Zigbee connectivity | diagnostic | enum |  | integration |  |
| sensor.ceiling_open_plan_se_zigbee_connectivity | sensor | hue | Core Ceiling Light.4 | Openplan (Core) |  | Zigbee connectivity | diagnostic | enum |  | integration |  |
| sensor.chaos_laundry_ceiling_zigbee_connectivity | sensor | hue | Laundry (Chaos) Ceiling Light | Laundry/Utilities |  | Zigbee connectivity | diagnostic | enum |  | integration |  |
| sensor.chaos_storage_ceiling_zigbee_connectivity | sensor | hue | White (E27) Hue Bulb | Laundry/Utilities |  | Zigbee connectivity | diagnostic | enum |  | integration |  |
| sensor.chaos_vault_ceiling_zigbee_connectivity | sensor | hue | Pass Ceiling Light.1 | Hallway (Pass) |  | Zigbee connectivity | diagnostic | enum |  | integration |  |
| sensor.core_300s_air_quality | sensor | vesync | Core 300S | Bedroom |  | Air quality |  |  |  |  |  |
| sensor.core_300s_filter_lifetime | sensor | vesync | Core 300S | Bedroom |  | Filter lifetime | diagnostic |  | % |  |  |
| sensor.core_300s_pm2_5 | sensor | vesync | Core 300S | Bedroom |  | PM2.5 |  | pm25 | μg/m³ |  |  |
| sensor.core_hue_tap_dial_switch_zigbee_connectivity | sensor | hue | Core Tap Dial Light Switch | Openplan (Core) |  | Zigbee connectivity | diagnostic | enum |  | integration |  |
| sensor.core_signe_floor_lamp_zigbee_connectivity | sensor | hue | Hue Signe White Gradient Floor Lamp.1 | Openplan (Core) |  | Zigbee connectivity | diagnostic | enum |  | integration |  |
| sensor.core_tap_dial_light_switch_battery | sensor | hue | Core Tap Dial Light Switch | Openplan (Core) |  | Battery | diagnostic | battery | % |  |  |
| sensor.core_vault_ceiling_zigbee_connectivity | sensor | hue | Pass Ceiling Light.4 | Hallway (Pass) |  | Zigbee connectivity | diagnostic | enum |  | integration |  |
| sensor.hallway_dimmer_switch_battery | sensor | hue | Hallway Dimmer Switch | Hallway (Pass) |  | Battery | diagnostic | battery | % |  |  |
| sensor.hallway_tap_dial_switch_battery | sensor | hue | Hallway Tap Dial Switch | Spare Bedroom |  | Battery | diagnostic | battery | % |  |  |
| sensor.hub_3_button_1_current_switch_position | sensor | matter | Hub 3 Button 1 |  |  | Current switch position | diagnostic |  |  | integration |  |
| sensor.hub_3_button_2_current_switch_position | sensor | matter | Hub 3 Button 2 |  |  | Current switch position | diagnostic |  |  | integration |  |
| sensor.hub_3_button_3_current_switch_position | sensor | matter | Hub 3 Button 3 |  |  | Current switch position | diagnostic |  |  | integration |  |
| sensor.hub_3_humisensor_humidity | sensor | matter | Hub 3 HumiSensor |  |  | Humidity |  | humidity | % |  |  |
| sensor.hub_3_tempsensor_temperature | sensor | matter | Hub 3 TempSensor |  |  | Temperature |  | temperature | °C |  |  |
| sensor.hue_bridge_pro_zigbee_connectivity | sensor | hue | Hue Bridge Pro | Laundry/Utilities |  | Zigbee connectivity | diagnostic | enum |  | integration |  |
| sensor.hue_color_candle_1_zigbee_connectivity | sensor | hue | Right Bedside Lamp | Bedroom |  | Zigbee connectivity | diagnostic | enum |  | integration |  |
| sensor.hue_color_lamp_1_zigbee_connectivity | sensor | hue | Ola Whitborg XL Floor Lamp |  |  | Zigbee connectivity | diagnostic | enum |  | integration |  |
| sensor.hue_color_lamp_1_zigbee_connectivity_2 | sensor | hue | fado glass globe lamp |  |  | Zigbee connectivity | diagnostic | enum |  | integration |  |
| sensor.hue_dimmer_switch_4_zigbee_connectivity | sensor | hue | Hallway Dimmer Switch | Hallway (Pass) |  | Zigbee connectivity | diagnostic | enum |  | integration |  |
| sensor.hue_essential_spot_1_zigbee_connectivity | sensor | hue | Nymane 3-spot Lamp - Mid |  |  | Zigbee connectivity | diagnostic | enum |  | integration |  |
| sensor.hue_essential_spot_2_zigbee_connectivity | sensor | hue | Alpha Ceiling Light.6 | Bedroom |  | Zigbee connectivity | diagnostic | enum |  | integration |  |
| sensor.hue_essential_spot_3_zigbee_connectivity | sensor | hue | Nyamane 3-spot Lamp - Top  |  |  | Zigbee connectivity | diagnostic | enum |  | integration |  |
| sensor.hue_motion_sensor_battery | sensor | hue | Hue Motion Sensor | Spare Bedroom |  | Battery | diagnostic | battery | % |  |  |
| sensor.hue_motion_sensor_battery_2 | sensor | hue | Hue Motion Sensor | Ensuite (Throne) Bathroom |  | Battery | diagnostic | battery | % |  |  |
| sensor.hue_motion_sensor_illuminance | sensor | hue | Hue Motion Sensor | Spare Bedroom |  | Illuminance |  | illuminance | lx |  |  |
| sensor.hue_motion_sensor_illuminance_2 | sensor | hue | Hue Motion Sensor | Ensuite (Throne) Bathroom |  | Illuminance |  | illuminance | lx |  |  |
| sensor.hue_motion_sensor_temperature | sensor | hue | Hue Motion Sensor | Spare Bedroom |  | Temperature |  | temperature | °C |  |  |
| sensor.hue_motion_sensor_temperature_2 | sensor | hue | Hue Motion Sensor | Ensuite (Throne) Bathroom |  | Temperature |  | temperature | °C |  |  |
| sensor.hue_play_1_zigbee_connectivity | sensor | hue | Hue Play 1 |  |  | Zigbee connectivity | diagnostic | enum |  | integration |  |
| sensor.hue_play_2_zigbee_connectivity | sensor | hue | Hue Play 2 |  |  | Zigbee connectivity | diagnostic | enum |  | integration |  |
| sensor.hue_smart_button_2_battery | sensor | hue | Hue smart button 2 |  |  | Battery | diagnostic | battery | % |  |  |
| sensor.hue_smart_button_2_zigbee_connectivity | sensor | hue | Hue smart button 2 |  |  | Zigbee connectivity | diagnostic | enum |  | integration |  |
| sensor.hue_smart_button_3_battery | sensor | hue | Hue smart button 3 |  |  | Battery | diagnostic | battery | % |  |  |
| sensor.hue_smart_button_3_zigbee_connectivity | sensor | hue | Hue smart button 3 |  |  | Zigbee connectivity | diagnostic | enum |  | integration |  |
| sensor.hue_smart_plug_1_zigbee_connectivity | sensor | hue | Hue smart plug 1 |  |  | Zigbee connectivity | diagnostic | enum |  | integration |  |
| sensor.iphone_16pro_max_activity | sensor | mobile_app | iPhone 16Pro Max  |  |  | iPhone 16Pro Max  Activity |  |  |  |  |  |
| sensor.iphone_16pro_max_app_version | sensor | mobile_app | iPhone 16Pro Max  |  |  | iPhone 16Pro Max  App Version | diagnostic |  |  |  |  |
| sensor.iphone_16pro_max_audio_output | sensor | mobile_app | iPhone 16Pro Max  |  |  | iPhone 16Pro Max  Audio Output |  |  |  |  |  |
| sensor.iphone_16pro_max_average_active_pace | sensor | mobile_app | iPhone 16Pro Max  |  |  | iPhone 16Pro Max  Average Active Pace |  |  |  |  |  |
| sensor.iphone_16pro_max_battery_level | sensor | mobile_app | iPhone 16Pro Max  |  |  | iPhone 16Pro Max  Battery Level |  | battery | % |  |  |
| sensor.iphone_16pro_max_battery_state | sensor | mobile_app | iPhone 16Pro Max  |  |  | iPhone 16Pro Max  Battery State |  |  |  |  |  |
| sensor.iphone_16pro_max_bssid | sensor | mobile_app | iPhone 16Pro Max  |  |  | iPhone 16Pro Max  BSSID |  |  |  |  |  |
| sensor.iphone_16pro_max_connection_type | sensor | mobile_app | iPhone 16Pro Max  |  |  | iPhone 16Pro Max  Connection Type |  |  |  |  |  |
| sensor.iphone_16pro_max_distance | sensor | mobile_app | iPhone 16Pro Max  |  |  | iPhone 16Pro Max  Distance |  |  |  |  |  |
| sensor.iphone_16pro_max_floors_ascended | sensor | mobile_app | iPhone 16Pro Max  |  |  | iPhone 16Pro Max  Floors Ascended |  |  |  |  |  |
| sensor.iphone_16pro_max_floors_descended | sensor | mobile_app | iPhone 16Pro Max  |  |  | iPhone 16Pro Max  Floors Descended |  |  |  |  |  |
| sensor.iphone_16pro_max_geocoded_location | sensor | mobile_app | iPhone 16Pro Max  |  |  | iPhone 16Pro Max  Geocoded Location |  |  |  |  |  |
| sensor.iphone_16pro_max_last_update_trigger | sensor | mobile_app | iPhone 16Pro Max  |  |  | iPhone 16Pro Max  Last Update Trigger |  |  |  |  |  |
| sensor.iphone_16pro_max_location_permission | sensor | mobile_app | iPhone 16Pro Max  |  |  | iPhone 16Pro Max  Location permission |  |  |  |  |  |
| sensor.iphone_16pro_max_sim_1 | sensor | mobile_app | iPhone 16Pro Max  |  |  | iPhone 16Pro Max  SIM 1 |  |  |  |  |  |
| sensor.iphone_16pro_max_sim_2 | sensor | mobile_app | iPhone 16Pro Max  |  |  | iPhone 16Pro Max  SIM 2 |  |  |  |  |  |
| sensor.iphone_16pro_max_ssid | sensor | mobile_app | iPhone 16Pro Max  |  |  | iPhone 16Pro Max  SSID |  |  |  |  |  |
| sensor.iphone_16pro_max_steps | sensor | mobile_app | iPhone 16Pro Max  |  |  | iPhone 16Pro Max  Steps |  |  |  |  |  |
| sensor.iphone_16pro_max_storage | sensor | mobile_app | iPhone 16Pro Max  |  |  | iPhone 16Pro Max  Storage |  |  |  |  |  |
| sensor.jeffs_ipad_app_version | sensor | mobile_app | Jeff’s iPad |  |  | Jeff’s iPad App Version | diagnostic |  |  |  |  |
| sensor.jeffs_ipad_audio_output | sensor | mobile_app | Jeff’s iPad |  |  | Jeff’s iPad Audio Output |  |  |  |  |  |
| sensor.jeffs_ipad_battery_level | sensor | mobile_app | Jeff’s iPad |  |  | Jeff’s iPad Battery Level |  | battery | % |  |  |
| sensor.jeffs_ipad_battery_state | sensor | mobile_app | Jeff’s iPad |  |  | Jeff’s iPad Battery State |  |  |  |  |  |
| sensor.jeffs_ipad_bssid | sensor | mobile_app | Jeff’s iPad |  |  | Jeff’s iPad BSSID |  |  |  |  |  |
| sensor.jeffs_ipad_connection_type | sensor | mobile_app | Jeff’s iPad |  |  | Jeff’s iPad Connection Type |  |  |  |  |  |
| sensor.jeffs_ipad_geocoded_location | sensor | mobile_app | Jeff’s iPad |  |  | Jeff’s iPad Geocoded Location |  |  |  |  |  |
| sensor.jeffs_ipad_last_update_trigger | sensor | mobile_app | Jeff’s iPad |  |  | Jeff’s iPad Last Update Trigger |  |  |  |  |  |
| sensor.jeffs_ipad_location_permission | sensor | mobile_app | Jeff’s iPad |  |  | Jeff’s iPad Location permission |  |  |  |  |  |
| sensor.jeffs_ipad_ssid | sensor | mobile_app | Jeff’s iPad |  |  | Jeff’s iPad SSID |  |  |  |  |  |
| sensor.jeffs_ipad_storage | sensor | mobile_app | Jeff’s iPad |  |  | Jeff’s iPad Storage |  |  | % available |  |  |
| sensor.jeffs_iphone_app_version | sensor | mobile_app | Jeff’s iPhone |  |  | Jeff’s iPhone App Version | diagnostic |  |  |  |  |
| sensor.jeffs_iphone_audio_output | sensor | mobile_app | Jeff’s iPhone |  |  | Jeff’s iPhone Audio Output |  |  |  |  |  |
| sensor.jeffs_iphone_battery_level | sensor | mobile_app | Jeff’s iPhone |  |  | Jeff’s iPhone Battery Level |  | battery | % |  |  |
| sensor.jeffs_iphone_battery_state | sensor | mobile_app | Jeff’s iPhone |  |  | Jeff’s iPhone Battery State |  |  |  |  |  |
| sensor.jeffs_iphone_bssid | sensor | mobile_app | Jeff’s iPhone |  |  | Jeff’s iPhone BSSID |  |  |  |  |  |
| sensor.jeffs_iphone_connection_type | sensor | mobile_app | Jeff’s iPhone |  |  | Jeff’s iPhone Connection Type |  |  |  |  |  |
| sensor.jeffs_iphone_geocoded_location | sensor | mobile_app | Jeff’s iPhone |  |  | Jeff’s iPhone Geocoded Location |  |  |  |  |  |
| sensor.jeffs_iphone_last_update_trigger | sensor | mobile_app | Jeff’s iPhone |  |  | Jeff’s iPhone Last Update Trigger |  |  |  |  |  |
| sensor.jeffs_iphone_location_permission | sensor | mobile_app | Jeff’s iPhone |  |  | Jeff’s iPhone Location permission |  |  |  |  |  |
| sensor.jeffs_iphone_sim_1 | sensor | mobile_app | Jeff’s iPhone |  |  | Jeff’s iPhone SIM 1 |  |  |  |  |  |
| sensor.jeffs_iphone_sim_2 | sensor | mobile_app | Jeff’s iPhone |  |  | Jeff’s iPhone SIM 2 |  |  |  |  |  |
| sensor.jeffs_iphone_ssid | sensor | mobile_app | Jeff’s iPhone |  |  | Jeff’s iPhone SSID |  |  |  |  |  |
| sensor.jeffs_iphone_storage | sensor | mobile_app | Jeff’s iPhone |  |  | Jeff’s iPhone Storage |  |  |  |  |  |
| sensor.klasnick_beige_table_lamp_zigbee_connectivity | sensor | hue | Klasnick Beige Table Lamp (with E14 Hue Colour) | Openplan (Core) |  | Zigbee connectivity | diagnostic | enum |  | integration |  |
| sensor.macbook_air_active_audio_input | sensor | mobile_app | MacBook Air  |  |  | MacBook Air  Active Audio Input |  |  |  |  |  |
| sensor.macbook_air_active_audio_output | sensor | mobile_app | MacBook Air  |  |  | MacBook Air  Active Audio Output |  |  |  |  |  |
| sensor.macbook_air_active_camera | sensor | mobile_app | MacBook Air  |  |  | MacBook Air  Active Camera |  |  |  |  |  |
| sensor.macbook_air_app_version | sensor | mobile_app | MacBook Air  |  |  | MacBook Air  App Version | diagnostic |  |  |  |  |
| sensor.macbook_air_audio_output | sensor | mobile_app | MacBook Air  |  |  | MacBook Air  Audio Output |  |  |  |  |  |
| sensor.macbook_air_bssid | sensor | mobile_app | MacBook Air  |  |  | MacBook Air  BSSID |  |  |  |  |  |
| sensor.macbook_air_connection_type | sensor | mobile_app | MacBook Air  |  |  | MacBook Air  Connection Type |  |  |  |  |  |
| sensor.macbook_air_displays | sensor | mobile_app | MacBook Air  |  |  | MacBook Air  Displays |  |  |  |  |  |
| sensor.macbook_air_frontmost_app | sensor | mobile_app | MacBook Air  |  |  | MacBook Air  Frontmost App |  |  |  |  |  |
| sensor.macbook_air_geocoded_location | sensor | mobile_app | MacBook Air  |  |  | MacBook Air  Geocoded Location |  |  |  |  |  |
| sensor.macbook_air_internal_battery_level | sensor | mobile_app | MacBook Air  |  |  | MacBook Air  Internal Battery Level |  |  |  |  |  |
| sensor.macbook_air_internal_battery_state | sensor | mobile_app | MacBook Air  |  |  | MacBook Air  Internal Battery State |  |  |  |  |  |
| sensor.macbook_air_last_update_trigger | sensor | mobile_app | MacBook Air  |  |  | MacBook Air  Last Update Trigger |  |  |  |  |  |
| sensor.macbook_air_location_permission | sensor | mobile_app | MacBook Air  |  |  | MacBook Air  Location permission |  |  |  |  |  |
| sensor.macbook_air_primary_display_id | sensor | mobile_app | MacBook Air  |  |  | MacBook Air  Primary Display ID |  |  |  |  |  |
| sensor.macbook_air_primary_display_name | sensor | mobile_app | MacBook Air  |  |  | MacBook Air  Primary Display Name |  |  |  |  |  |
| sensor.macbook_air_ssid | sensor | mobile_app | MacBook Air  |  |  | MacBook Air  SSID |  |  |  |  |  |
| sensor.macbook_air_storage | sensor | mobile_app | MacBook Air  |  |  | MacBook Air  Storage |  |  |  |  |  |
| sensor.monica_vibelucci_arc_lamp_zigbee_connectivity | sensor | hue | Core Statement Arc Floor Lamp Monica Vibelucci | Openplan (Core) |  | Zigbee connectivity | diagnostic | enum |  | integration |  |
| sensor.nymane_3_spot_lamp_low_zigbee_connectivity | sensor | hue | Nymane 3-spot Lamp - Low | Bedroom (Alpha) |  | Zigbee connectivity | diagnostic | enum |  | integration |  |
| sensor.play_gradient_tube_1_zigbee_connectivity | sensor | hue | alpha gradient light-tube.1 | Bedroom |  | Zigbee connectivity | diagnostic | enum |  | integration |  |
| sensor.roller_shade_0a_battery | sensor | matter | Roller Shade 0A |  |  | Battery | diagnostic | battery | % |  |  |
| sensor.roller_shade_0a_target_opening_position | sensor | matter | Roller Shade 0A |  |  | Target opening position | diagnostic |  | % | integration |  |
| sensor.roller_shade_2a_battery | sensor | matter | Roller Shade 2A |  |  | Battery | diagnostic | battery | % |  |  |
| sensor.roller_shade_2a_target_opening_position | sensor | matter | Roller Shade 2A |  |  | Target opening position | diagnostic |  | % | integration |  |
| sensor.roller_shade_84_battery | sensor | matter | Roller Shade 84 |  |  | Battery | diagnostic | battery | % |  |  |
| sensor.roller_shade_84_target_opening_position | sensor | matter | Roller Shade 84 |  |  | Target opening position | diagnostic |  | % | integration |  |
| sensor.secondary_bathroom_illuminance | sensor | hue | Secondary Bathroom | Secondary Bathroom |  | Illuminance |  | illuminance | lx |  |  |
| sensor.signe_gradient_floor_1_zigbee_connectivity | sensor | hue | Signe gradient floor 1 | Openplan (Core) |  | Zigbee connectivity | diagnostic | enum |  | integration |  |
| sensor.signe_gradient_table_1_zigbee_connectivity | sensor | hue | Signe gradient table 1 |  |  | Zigbee connectivity | diagnostic | enum |  | integration |  |
| sensor.speedtest_download | sensor | speedtestdotnet | SpeedTest | Parking |  | Download |  | data_rate | Mbit/s |  |  |
| sensor.speedtest_ping | sensor | speedtestdotnet | SpeedTest | Parking |  | Ping |  | duration | ms |  |  |
| sensor.speedtest_upload | sensor | speedtestdotnet | SpeedTest | Parking |  | Upload |  | data_rate | Mbit/s |  |  |
| sensor.splash_bathroom_dimmer_zigbee_connectivity | sensor | hue | Splash Dimmer Switch | Secondary Bathroom |  | Zigbee connectivity | diagnostic | enum |  | integration |  |
| sensor.splash_ceiling_light_1_zigbee_connectivity | sensor | hue | Splash Ceiling Light.4 | Secondary Bathroom |  | Zigbee connectivity | diagnostic | enum |  | integration |  |
| sensor.splash_ceiling_light_2_zigbee_connectivity | sensor | hue | Splash Ceiling Light.1 | Secondary Bathroom |  | Zigbee connectivity | diagnostic | enum |  | integration |  |
| sensor.splash_ceiling_light_3_zigbee_connectivity | sensor | hue | Splash Ceiling Light.2 | Secondary Bathroom |  | Zigbee connectivity | diagnostic | enum |  | integration |  |
| sensor.splash_ceiling_light_4_zigbee_connectivity | sensor | hue | Splash Ceiling Light.5 | Secondary Bathroom |  | Zigbee connectivity | diagnostic | enum |  | integration |  |
| sensor.splash_ceiling_light_5_zigbee_connectivity | sensor | hue | Splash Ceiling Light.3 | Secondary Bathroom |  | Zigbee connectivity | diagnostic | enum |  | integration |  |
| sensor.splash_dimmer_switch_battery | sensor | hue | Splash Dimmer Switch | Secondary Bathroom |  | Battery | diagnostic | battery | % |  |  |
| sensor.splash_pass_ceiling_zigbee_connectivity | sensor | hue | Pass Ceiling Light.2 | Hallway (Pass) |  | Zigbee connectivity | diagnostic | enum |  | integration |  |
| sensor.sun_next_dawn | sensor | sun | Sun |  |  | Next dawn | diagnostic | timestamp |  |  |  |
| sensor.sun_next_dusk | sensor | sun | Sun |  |  | Next dusk | diagnostic | timestamp |  |  |  |
| sensor.sun_next_midnight | sensor | sun | Sun |  |  | Next midnight | diagnostic | timestamp |  |  |  |
| sensor.sun_next_noon | sensor | sun | Sun |  |  | Next noon | diagnostic | timestamp |  |  |  |
| sensor.sun_next_rising | sensor | sun | Sun |  |  | Next rising | diagnostic | timestamp |  |  |  |
| sensor.sun_next_setting | sensor | sun | Sun |  |  | Next setting | diagnostic | timestamp |  |  |  |
| sensor.sun_solar_azimuth | sensor | sun | Sun |  |  | Solar azimuth | diagnostic |  | ° | integration |  |
| sensor.sun_solar_elevation | sensor | sun | Sun |  |  | Solar elevation | diagnostic |  | ° | integration |  |
| sensor.sun_solar_rising | sensor | sun | Sun |  |  | Solar rising | diagnostic |  |  | integration |  |
| sensor.throne_bathroom_ceiling_zigbee_connectivity | sensor | hue | Bathroom dimmer switch | Ensuite (Throne) Bathroom |  | Zigbee connectivity | diagnostic | enum |  | integration |  |
| sensor.throne_hue_motion_sensor_zigbee_connectivity | sensor | hue | Hue Motion Sensor | Ensuite (Throne) Bathroom |  | Zigbee connectivity | diagnostic | enum |  | integration |  |
| sensor.withings_active_calories_burnt_today | sensor | withings | Withings | Bedroom (Alpha) |  | Active calories burnt today |  |  | calories | user |  |
| sensor.withings_active_time_today | sensor | withings | Withings | Bedroom (Alpha) |  | Active time today |  | duration | h | user |  |
| sensor.withings_average_heart_rate | sensor | withings | Withings | Bedroom (Alpha) |  | Average heart rate |  |  | bpm | integration |  |
| sensor.withings_average_respiratory_rate | sensor | withings | Withings | Bedroom (Alpha) |  | Average respiratory rate |  |  | br/min | integration |  |
| sensor.withings_breathing_disturbances_intensity | sensor | withings | Withings | Bedroom (Alpha) |  | Breathing disturbances intensity |  |  |  | integration |  |
| sensor.withings_deep_sleep | sensor | withings | Withings | Bedroom (Alpha) |  | Deep sleep |  | duration | h |  |  |
| sensor.withings_distance_travelled_today | sensor | withings | Withings | Bedroom (Alpha) |  | Distance travelled today |  | distance | m | user |  |
| sensor.withings_elevation_change_today | sensor | withings | Withings | Bedroom (Alpha) |  | Elevation change today |  | distance | m | user |  |
| sensor.withings_intense_activity_today | sensor | withings | Withings | Bedroom (Alpha) |  | Intense activity today |  | duration | min | integration |  |
| sensor.withings_light_sleep | sensor | withings | Withings | Bedroom (Alpha) |  | Light sleep |  | duration | h |  |  |
| sensor.withings_maximum_heart_rate | sensor | withings | Withings | Bedroom (Alpha) |  | Maximum heart rate |  |  | bpm |  |  |
| sensor.withings_maximum_respiratory_rate | sensor | withings | Withings | Bedroom (Alpha) |  | Maximum respiratory rate |  |  | br/min | integration |  |
| sensor.withings_minimum_heart_rate | sensor | withings | Withings | Bedroom (Alpha) |  | Minimum heart rate |  |  | bpm | integration |  |
| sensor.withings_minimum_respiratory_rate | sensor | withings | Withings | Bedroom (Alpha) |  | Minimum respiratory rate |  |  | br/min | integration |  |
| sensor.withings_moderate_activity_today | sensor | withings | Withings | Bedroom (Alpha) |  | Moderate activity today |  | duration | min | integration |  |
| sensor.withings_rem_sleep | sensor | withings | Withings | Bedroom (Alpha) |  | REM sleep |  | duration | h |  |  |
| sensor.withings_sleep_score | sensor | withings | Withings | Bedroom (Alpha) |  | Sleep score |  |  | points |  |  |
| sensor.withings_snoring | sensor | withings | Withings | Bedroom (Alpha) |  | Snoring |  | duration | min |  |  |
| sensor.withings_snoring_episode_count | sensor | withings | Withings | Bedroom (Alpha) |  | Snoring episode count |  |  |  | integration |  |
| sensor.withings_soft_activity_today | sensor | withings | Withings | Bedroom (Alpha) |  | Soft activity today |  | duration | min | integration |  |
| sensor.withings_steps_today | sensor | withings | Withings | Bedroom (Alpha) |  | Steps today |  |  | steps | user |  |
| sensor.withings_time_to_sleep | sensor | withings | Withings | Bedroom (Alpha) |  | Time to sleep |  | duration | h |  |  |
| sensor.withings_time_to_wakeup | sensor | withings | Withings | Bedroom (Alpha) |  | Time to wakeup |  | duration | h |  |  |
| sensor.withings_total_calories_burnt_today | sensor | withings | Withings | Bedroom (Alpha) |  | Total calories burnt today |  |  | calories | user |  |
| sensor.withings_wakeup_count | sensor | withings | Withings | Bedroom (Alpha) |  | Wakeup count |  |  | times |  |  |
| sensor.withings_wakeup_time | sensor | withings | Withings | Bedroom (Alpha) |  | Wakeup time |  | duration | h |  |  |
| stt.home_assistant_cloud | stt | cloud |  |  |  | Home Assistant Cloud |  |  |  |  |  |
| switch.automation_alpha_bedroom_dial_switch | switch | hue | Hue Bridge Pro | Laundry/Utilities |  | Automation: Alpha Bedroom Dial Switch | config | switch |  |  |  |
| switch.automation_hue_smart_button_3 | switch | hue | Hue Bridge Pro | Laundry/Utilities |  | Automation: Hue smart button 3 | config | switch |  |  |  |
| switch.bot_4a | switch | matter | Bot 4A |  |  |  |  | outlet |  |  |  |
| switch.core_300s_child_lock | switch | vesync | Core 300S | Bedroom |  | Child lock |  |  |  |  |  |
| switch.core_300s_display | switch | vesync | Core 300S | Bedroom |  | Display |  |  |  |  |  |
| switch.hue_motion_sensor_light_sensor_enabled | switch | hue | Hue Motion Sensor | Spare Bedroom |  | Light sensor enabled | config | switch |  |  |  |
| switch.hue_motion_sensor_light_sensor_enabled_2 | switch | hue | Hue Motion Sensor | Ensuite (Throne) Bathroom |  | Light sensor enabled | config | switch |  |  |  |
| switch.hue_motion_sensor_motion_sensor_enabled | switch | hue | Hue Motion Sensor | Spare Bedroom |  | Motion sensor enabled | config | switch |  |  |  |
| switch.hue_motion_sensor_motion_sensor_enabled_2 | switch | hue | Hue Motion Sensor | Ensuite (Throne) Bathroom |  | Motion sensor enabled | config | switch |  |  |  |
| todo.shopping_list | todo | shopping_list |  |  |  | Shopping List |  |  |  |  |  |
| tts.google_translate_en_com | tts | google_translate |  |  |  | Google Translate en com |  |  |  |  |  |
| tts.home_assistant_cloud | tts | cloud |  |  |  | Home Assistant Cloud |  |  |  |  |  |
| update.core_300s_firmware | update | vesync | Core 300S | Bedroom |  | Firmware | diagnostic | firmware |  |  |  |
| weather.forecast_home | weather | met | Forecast |  |  | Home |  |  |  |  |  |

## Labels

| Name | ID | Color | Description |
| --- | --- | --- | --- |
| Alpha-pass | alpha_pass |  |  |
| Beta Bedroom | beta_bedroom |  |  |
| Core | core | amber |  |
| Core - Kitchen | core_kitchen |  |  |
| Core- Living | core_living |  |  |


## YAML / Config Surface

### YAML Files
```text
/srv/homeassistant/config/automations.yaml
/srv/homeassistant/config/blueprints/automation/Blackshome/sensor-light.yaml
/srv/homeassistant/config/blueprints/automation/follow_me/room_follow_me_atmosphere.yaml
/srv/homeassistant/config/blueprints/automation/homeassistant/motion_light.yaml
/srv/homeassistant/config/blueprints/automation/homeassistant/notify_leaving_zone.yaml
/srv/homeassistant/config/blueprints/script/homeassistant/confirmable_notification.yaml
/srv/homeassistant/config/configuration.yaml
/srv/homeassistant/config/packages/.example.yaml
/srv/homeassistant/config/packages/test_mode.yaml
/srv/homeassistant/config/scenes.yaml
/srv/homeassistant/config/scripts.yaml
/srv/homeassistant/config/secrets.yaml
```

### Line Counts
```text
  20 /srv/homeassistant/config/configuration.yaml
   1 /srv/homeassistant/config/automations.yaml
   0 /srv/homeassistant/config/scripts.yaml
  18 /srv/homeassistant/config/scenes.yaml
  15 /srv/homeassistant/config/packages/test_mode.yaml
  54 total
```

### Package Directories
```text
/srv/homeassistant/config/packages
/srv/homeassistant/config/packages/gpt_automations
```

## Runtime Containers

```text
homeassistantz	ghcr.io/home-assistant/home-assistant:stable	Up 16 hours	
matter-server	ghcr.io/home-assistant-libs/python-matter-server:stable	Up 16 hours	
nodered	nodered/node-red:latest	Up 16 hours (healthy)	0.0.0.0:1880->1880/tcp, [::]:1880->1880/tcp
mosquitto	eclipse-mosquitto:2	Up 16 hours	0.0.0.0:1883->1883/tcp, [::]:1883->1883/tcp
```

## Node-RED Surface

### Flow Summary
```json
bash: -c: line 1: syntax error near unexpected token `)'
bash: -c: line 1: `docker exec nodered sh -lc 'node -e "const fs=require(\'fs\'); const f=\'/data/flows.json\'; if(!fs.existsSync(f)){console.log(JSON.stringify({missing:true},null,2)); process.exit(0)}; const flows=JSON.parse(fs.readFileSync(f,\'utf8\')); const counts={}; for(const n of flows){counts[n.type]=(counts[n.type]||0)+1}; console.log(JSON.stringify({counts,tabs:flows.filter(n=>n.type===\'tab\').map(n=>({id:n.id,label:n.label,disabled:n.disabled})),nodes:flows.map(n=>({id:n.id,type:n.type,label:n.label||n.name||null,z:n.z||null}))},null,2))"''
```


==== FILE: /Users/jeff/Downloads/10_Archive/Duplicated-Pending Deletion/Exports/sources/homeassistant/homeassistant-top-down-inventory-2026-05-17.md (modified: 2026-05-17 07:06:46) ====

# Home Assistant Top-Down Inventory

Generated: 2026-05-17
Source: read-only inspection of Home Assistant registries/config on `servers`.
No Home Assistant config, storage, services, containers, or integrations were changed.

## 1. System Snapshot

| Item | Count / Value |
| --- | ---: |
| Integrations | 28 |
| Areas | 21 |
| Floors | 1 |
| Labels | 5 |
| Devices | 147 |
| Entities | 589 |
| Disabled entities | 103 |
| Hidden entities | 0 |
| Disabled devices | 0 |
| Conversation-exposed entities | 136 |
| Google Assistant-exposed entities | 83 |
| Alexa-exposed entities | 0 |

## 2. Integration Surface

### Integrations

| Domain | Title | Source | Disabled |
| --- | --- | --- | --- |
| apple_tv | Bedroom | zeroconf |  |
| apple_tv | Beta Bedroom | zeroconf |  |
| apple_tv | Living Room | zeroconf |  |
| apple_tv | Living Room (2) | zeroconf |  |
| apple_tv | Living Room (2) | zeroconf |  |
| apple_tv | White HomePod Mini | zeroconf |  |
| apple_tv | living Room Apple TV | zeroconf |  |
| backup | Backup | system |  |
| bluetooth | Shenzhen Phaten Tech. LTD None (8C:BD:37:64:26:26) | integration_discovery |  |
| cast | Google Cast | zeroconf |  |
| cloud | Home Assistant Cloud | system |  |
| go2rtc | go2rtc | system |  |
| google_translate | Google Translate text-to-speech | onboarding |  |
| hue | Hue Bridge c42996c58a91 | zeroconf |  |
| matter | Matter | zeroconf |  |
| met | Home | onboarding |  |
| mobile_app | Jeff’s iPad | registration |  |
| mobile_app | Jeff’s iPhone | registration |  |
| mobile_app | MacBook Air  | registration |  |
| mobile_app | iPhone 16Pro Max  | registration |  |
| mqtt | 192.168.1.39 | user |  |
| radio_browser | Radio Browser | onboarding |  |
| shopping_list | Shopping list | onboarding |  |
| speedtestdotnet | SpeedTest | user |  |
| sun | Sun | import |  |
| thread | Thread | zeroconf |  |
| vesync | Home@itsjeff.org | user |  |
| withings | Withings | user |  |

### Integration Counts

| Domain | Count |
| --- | ---: |
| apple_tv | 7 |
| backup | 1 |
| bluetooth | 1 |
| cast | 1 |
| cloud | 1 |
| go2rtc | 1 |
| google_translate | 1 |
| hue | 1 |
| matter | 1 |
| met | 1 |
| mobile_app | 4 |
| mqtt | 1 |
| radio_browser | 1 |
| shopping_list | 1 |
| speedtestdotnet | 1 |
| sun | 1 |
| thread | 1 |
| vesync | 1 |
| withings | 1 |

## 3. Home Areas

| Area | ID | Floor | Devices | Direct Entity Assignments | Aliases |
| --- | --- | --- | ---: | ---: | --- |
| Attic | attic |  | 0 | 0 |  |
| Bedroom | bedroom |  | 9 | 0 |  |
| Bedroom (Alpha) | alpha_bedroom |  | 11 | 0 |  |
| Beta Bedroom | beta_bedroom_2 |  | 0 | 0 |  |
| Core_kitchen | core_kitchen |  | 4 | 0 | Kitchen |
| Default | default |  | 0 | 0 |  |
| Dining | dining |  | 0 | 0 |  |
| Ensuite (Throne) Bathroom | throne_bathroom |  | 6 | 0 |  |
| Hallway (Pass) | pass |  | 7 | 0 |  |
| Laundry room | laundry_room |  | 1 | 0 |  |
| Laundry/Utilities | chaos |  | 3 | 0 |  |
| Living Room | living_room |  | 8 | 0 |  |
| Living Room (2) | living_room_2 |  | 1 | 0 |  |
| My Bathroom | my_bathroom |  | 1 | 0 |  |
| Openplan | openplan |  | 0 | 0 |  |
| Openplan (Core) | core |  | 13 | 0 |  |
| Parking | parking |  | 1 | 0 |  |
| Secondary Bathroom | secondary_bathroom |  | 7 | 0 |  |
| Spare Bedroom | beta_bedroom |  | 13 | 0 | Beta Bedroom, Guest Bedroom, Rear Bedroom |
| Storage | storage |  | 0 | 0 |  |
| White HomePod Mini | white_homepod_mini |  | 1 | 0 |  |
| Unassigned |  |  | 61 | 589 |  |

## 4. Area-First Inventory

Entities are nested under their device where Home Assistant has a `device_id`. Entity area assignment is currently mostly direct-unassigned, so device area is the useful top-down grouping.

### Bedroom

Devices: `9`

#### All Bedroom & Bathroom

- Area: `Bedroom`
- Manufacturer/model: `Signify Netherlands B.V.` / `Zone`
- Integration domains: `hue`
- Entities: `1`
- Controls:
  - `light.all_bedroom_bathroom` — light.all_bedroom_bathroom — conversation, google

#### Alpha Ceiling Light.6

- Area: `Bedroom`
- Manufacturer/model: `Signify Netherlands B.V.` / `Hue Essential spot`
- Integration domains: `hue`
- Entities: `2`
- Controls:
  - `light.alpha_ceiling_light_6` — light.alpha_ceiling_light_6 — conversation, google
- Disabled:
  - `sensor.hue_essential_spot_2_zigbee_connectivity` — Zigbee connectivity — disabled:integration, diagnostic

#### alpha gradient light-tube.1

- Area: `Bedroom`
- Manufacturer/model: `Signify Netherlands B.V.` / `Play gradient tube`
- Integration domains: `hue`
- Entities: `2`
- Controls:
  - `light.alpha_gradient_light_tube_1` — light.alpha_gradient_light_tube_1 — conversation, google
- Disabled:
  - `sensor.play_gradient_tube_1_zigbee_connectivity` — Zigbee connectivity — disabled:integration, diagnostic

#### Bedroom Ceiling

- Area: `Bedroom`
- Manufacturer/model: `Signify Netherlands B.V.` / `Zone`
- Integration domains: `hue`
- Entities: `1`
- Controls:
  - `light.bedroom_ceiling` — light.bedroom_ceiling — conversation, google

#### Bedroom Lamps

- Area: `Bedroom`
- Manufacturer/model: `Signify Netherlands B.V.` / `Zone`
- Integration domains: `hue`
- Entities: `1`
- Controls:
  - `light.bedroom_lamps` — light.bedroom_lamps — conversation, google

#### Core 300S

- Area: `Bedroom`
- Manufacturer/model: `VeSync` / `Core300S`
- Integration domains: `vesync`
- Entities: `7`
- Controls:
  - `fan.core_300s` — fan.core_300s — conversation, google
  - `switch.core_300s_child_lock` — Child lock — conversation, google
  - `switch.core_300s_display` — Display — conversation, google
- Sensors:
  - `sensor.core_300s_air_quality` — Air quality
  - `sensor.core_300s_pm2_5` — PM2.5 — conversation, google
- Diagnostic:
  - `sensor.core_300s_filter_lifetime` — Filter lifetime — diagnostic
  - `update.core_300s_firmware` — Firmware — diagnostic

#### Ikea Skytrax Light

- Area: `Bedroom`
- Manufacturer/model: `IKEA of Sweden` / `Dimmable light`
- Integration domains: `hue`
- Entities: `2`
- Controls:
  - `light.ikea_skytrax_light` — light.ikea_skytrax_light — conversation
- Disabled:
  - `sensor.betaflex_lower_shelf_zigbee_connectivity` — Zigbee connectivity — disabled:integration, diagnostic

#### Orange HomePod Mini

- Area: `Bedroom`
- Manufacturer/model: `Apple` / `HomePod Mini`
- Integration domains: `apple_tv`
- Entities: `2`
- Controls:
  - `media_player.orange_homepod_mini` — media_player.orange_homepod_mini — conversation, google
  - `remote.orange_homepod_mini` — remote.orange_homepod_mini

#### Right Bedside Lamp

- Area: `Bedroom`
- Manufacturer/model: `Signify Netherlands B.V.` / `Hue color candle`
- Integration domains: `hue`
- Entities: `2`
- Controls:
  - `light.right_bedside_lamp` — light.right_bedside_lamp — conversation, google
- Disabled:
  - `sensor.hue_color_candle_1_zigbee_connectivity` — Zigbee connectivity — disabled:integration, diagnostic

### Bedroom (Alpha)

Devices: `11`

#### Alpha Bedroom Dial Switch

- Area: `Bedroom (Alpha)`
- Manufacturer/model: `Signify Netherlands B.V.` / `Hue tap dial switch`
- Integration domains: `hue`
- Entities: `7`
- Presence / Events:
  - `event.alpha_bedroom_dial_switch_button_1` — Button 1
  - `event.alpha_bedroom_dial_switch_button_2` — Button 2
  - `event.alpha_bedroom_dial_switch_button_3` — Button 3
  - `event.alpha_bedroom_dial_switch_button_4` — Button 4
  - `event.alpha_bedroom_dial_switch_rotary` — Rotary
- Diagnostic:
  - `sensor.alpha_bedroom_dial_switch_battery` — Battery — diagnostic
- Disabled:
  - `sensor.alpha_bedroom_dial_switch_zigbee_connectivity` — Zigbee connectivity — disabled:integration, diagnostic

#### Alpha Ceiling Light.4

- Area: `Bedroom (Alpha)`
- Manufacturer/model: `Signify Netherlands B.V.` / `Hue color spot`
- Integration domains: `hue`
- Entities: `2`
- Controls:
  - `light.alpha_ceiling_light_4` — light.alpha_ceiling_light_4 — conversation
- Disabled:
  - `sensor.ceiling_bedroom1_bed4_zigbee_connectivity` — Zigbee connectivity — disabled:integration, diagnostic

#### Alpha Ceiling Light.6

- Area: `Bedroom (Alpha)`
- Manufacturer/model: `Signify Netherlands B.V.` / `Hue ambiance spot`
- Integration domains: `hue`
- Entities: `2`
- Controls:
  - `light.alphadoor_ceiling_light_6` — alphadoor ceiling light.6 — conversation, google
- Disabled:
  - `sensor.ceiling_bedroom1_door_zone_zigbee_connectivity` — Zigbee connectivity — disabled:integration, diagnostic

#### Alpha Hue Smart Button

- Area: `Bedroom (Alpha)`
- Manufacturer/model: `Signify Netherlands B.V.` / `Hue smart button`
- Integration domains: `hue`
- Entities: `3`
- Presence / Events:
  - `event.alpha_hue_smart_button_button_1` — Button 1
- Diagnostic:
  - `sensor.alpha_hue_smart_button_battery` — Battery — diagnostic
- Disabled:
  - `sensor.alpha_bedroom_hue_smart_button_zigbee_connectivity` — Zigbee connectivity — disabled:integration, diagnostic

#### Alphabed Ceiling Light.3

- Area: `Bedroom (Alpha)`
- Manufacturer/model: `Signify Netherlands B.V.` / `Hue color spot`
- Integration domains: `hue`
- Entities: `2`
- Controls:
  - `light.alphabed_ceiling_light_3` — light.alphabed_ceiling_light_3 — conversation
- Disabled:
  - `sensor.bed3_zigbee_connectivity` — Zigbee connectivity — disabled:integration, diagnostic

#### Alphabed Ceiling Light.5

- Area: `Bedroom (Alpha)`
- Manufacturer/model: `Signify Netherlands B.V.` / `Hue color spot`
- Integration domains: `hue`
- Entities: `2`
- Controls:
  - `light.alphabed_ceiling_light_5_2` — light.alphabed_ceiling_light_5_2 — conversation
- Disabled:
  - `sensor.bed1_zigbee_connectivity` — Zigbee connectivity — disabled:integration, diagnostic

#### Alphabed Ceiling Light.5

- Area: `Bedroom (Alpha)`
- Manufacturer/model: `Signify Netherlands B.V.` / `Hue color spot`
- Integration domains: `hue`
- Entities: `2`
- Controls:
  - `light.alphabed_ceiling_light_5` — light.alphabed_ceiling_light_5 — conversation, google
- Disabled:
  - `sensor.alpha_bed_zone_ceiling_2_zigbee_connectivity` — Zigbee connectivity — disabled:integration, diagnostic

#### Bedroom

- Area: `Bedroom (Alpha)`
- Manufacturer/model: `Signify Netherlands B.V.` / `Room`
- Integration domains: `hue`
- Entities: `8`
- Controls:
  - `light.bedroom` — light.bedroom — conversation
  - `scene.bedroom_concentrate` — Concentrate — conversation, google
  - `scene.bedroom_dimmed` — Dimmed — conversation, google
  - `scene.bedroom_energise` — Energise — conversation, google
  - `scene.bedroom_nightlight` — Nightlight — conversation, google
  - `scene.bedroom_read` — Read — conversation, google
  - `scene.bedroom_relax` — Relax — conversation, google
  - `scene.bedroom_sleepy` — Sleepy — conversation, google

#### core ceiling.3

- Area: `Bedroom (Alpha)`
- Manufacturer/model: `Signify Netherlands B.V.` / `Hue ambiance spot`
- Integration domains: `hue`
- Entities: `2`
- Controls:
  - `light.core_ceiling_3` — light.core_ceiling_3 — conversation
- Disabled:
  - `sensor.ceiling_bedroom1_closet_zone_zigbee_connectivity` — Zigbee connectivity — disabled:integration, diagnostic

#### Nymane 3-spot Lamp - Low

- Area: `Bedroom (Alpha)`
- Manufacturer/model: `Signify Netherlands B.V.` / `Hue Essential spot`
- Integration domains: `hue`
- Entities: `2`
- Controls:
  - `light.nymane_3_spot_lamp_low` — light.nymane_3_spot_lamp_low — conversation, google
- Disabled:
  - `sensor.nymane_3_spot_lamp_low_zigbee_connectivity` — Zigbee connectivity — disabled:integration, diagnostic

#### Withings

- Area: `Bedroom (Alpha)`
- Manufacturer/model: `Withings` / `Unknown model`
- Integration domains: `withings`
- Entities: `27`
- Presence / Events:
  - `binary_sensor.withings_in_bed` — In bed — conversation
- Sensors:
  - `sensor.withings_deep_sleep` — Deep sleep
  - `sensor.withings_light_sleep` — Light sleep
  - `sensor.withings_maximum_heart_rate` — Maximum heart rate
  - `sensor.withings_rem_sleep` — REM sleep
  - `sensor.withings_sleep_score` — Sleep score
  - `sensor.withings_snoring` — Snoring
  - `sensor.withings_time_to_sleep` — Time to sleep
  - `sensor.withings_time_to_wakeup` — Time to wakeup
  - `sensor.withings_wakeup_count` — Wakeup count
  - `sensor.withings_wakeup_time` — Wakeup time
- Disabled:
  - `sensor.withings_active_calories_burnt_today` — Active calories burnt today — disabled:user
  - `sensor.withings_active_time_today` — Active time today — disabled:user
  - `sensor.withings_average_heart_rate` — Average heart rate — disabled:integration
  - `sensor.withings_average_respiratory_rate` — Average respiratory rate — disabled:integration
  - `sensor.withings_breathing_disturbances_intensity` — Breathing disturbances intensity — disabled:integration
  - `sensor.withings_distance_travelled_today` — Distance travelled today — disabled:user
  - `sensor.withings_elevation_change_today` — Elevation change today — disabled:user
  - `sensor.withings_intense_activity_today` — Intense activity today — disabled:integration
  - `sensor.withings_maximum_respiratory_rate` — Maximum respiratory rate — disabled:integration
  - `sensor.withings_minimum_heart_rate` — Minimum heart rate — disabled:integration
  - `sensor.withings_minimum_respiratory_rate` — Minimum respiratory rate — disabled:integration
  - `sensor.withings_moderate_activity_today` — Moderate activity today — disabled:integration
  - `sensor.withings_snoring_episode_count` — Snoring episode count — disabled:integration
  - `sensor.withings_soft_activity_today` — Soft activity today — disabled:integration
  - `sensor.withings_steps_today` — Steps today — disabled:user
  - `sensor.withings_total_calories_burnt_today` — Total calories burnt today — disabled:user

### Core_kitchen

Devices: `4`

#### Core Ceiling Light.9

- Area: `Core_kitchen`
- Manufacturer/model: `Signify Netherlands B.V.` / `Hue ambiance spot`
- Integration domains: `hue`
- Entities: `2`
- Controls:
  - `light.core_ceiling_light_9` — light.core_ceiling_light_9 — conversation
- Disabled:
  - `sensor.ceiling_kitchen_fridge_zigbee_connectivity` — Zigbee connectivity — disabled:integration, diagnostic

#### Kitchen

- Area: `Core_kitchen`
- Manufacturer/model: `Signify Netherlands B.V.` / `Room`
- Integration domains: `hue`
- Entities: `1`
- Controls:
  - `light.kitchen` — light.kitchen — conversation, google

#### Kitchen Ceiling

- Area: `Core_kitchen`
- Manufacturer/model: `Signify Netherlands B.V.` / `Zone`
- Integration domains: `hue`
- Entities: `1`
- Controls:
  - `light.kitchen_ceiling` — light.kitchen_ceiling — conversation, google

#### Kitchen Task

- Area: `Core_kitchen`
- Manufacturer/model: `Signify Netherlands B.V.` / `Zone`
- Integration domains: `hue`
- Entities: `0`
- Entities: none registered under this device.

### Ensuite (Throne) Bathroom

Devices: `6`

#### Bathroom dimmer switch

- Area: `Ensuite (Throne) Bathroom`
- Manufacturer/model: `Signify Netherlands B.V.` / `Hue dimmer switch`
- Integration domains: `hue`
- Entities: `6`
- Presence / Events:
  - `event.bathroom_dimmer_switch_button_1` — Button 1
  - `event.bathroom_dimmer_switch_button_2` — Button 2
  - `event.bathroom_dimmer_switch_button_3` — Button 3
  - `event.bathroom_dimmer_switch_button_4` — Button 4
- Diagnostic:
  - `sensor.bathroom_dimmer_switch_battery` — Battery — diagnostic
- Disabled:
  - `sensor.throne_bathroom_ceiling_zigbee_connectivity` — Zigbee connectivity — disabled:integration, diagnostic

#### Hue Motion Sensor

- Area: `Ensuite (Throne) Bathroom`
- Manufacturer/model: `Signify Netherlands B.V.` / `Hue motion sensor`
- Integration domains: `hue`
- Entities: `7`
- Controls:
  - `switch.hue_motion_sensor_light_sensor_enabled_2` — Light sensor enabled — config
  - `switch.hue_motion_sensor_motion_sensor_enabled_2` — Motion sensor enabled — config
- Presence / Events:
  - `binary_sensor.hue_motion_sensor_motion_2` — Motion — conversation
- Sensors:
  - `sensor.hue_motion_sensor_illuminance_2` — Illuminance
  - `sensor.hue_motion_sensor_temperature_2` — Temperature — conversation
- Diagnostic:
  - `sensor.hue_motion_sensor_battery_2` — Battery — diagnostic
- Disabled:
  - `sensor.throne_hue_motion_sensor_zigbee_connectivity` — Zigbee connectivity — disabled:integration, diagnostic

#### Throne Ceiling above Door

- Area: `Ensuite (Throne) Bathroom`
- Manufacturer/model: `Signify Netherlands B.V.` / `Hue ambiance spot`
- Integration domains: `hue`
- Entities: `2`
- Controls:
  - `light.throne_ceiling_light_4` — light.throne_ceiling_light_4 — conversation
- Disabled:
  - `sensor.ceiling_ensuite_bathroom_zigbee_connectivity_2` — Zigbee connectivity — disabled:integration, diagnostic

#### Throne Ceiling above shower door

- Area: `Ensuite (Throne) Bathroom`
- Manufacturer/model: `Signify Netherlands B.V.` / `Hue ambiance spot`
- Integration domains: `hue`
- Entities: `2`
- Controls:
  - `light.throne_ceiling_light_2` — light.throne_ceiling_light_2 — conversation
- Disabled:
  - `sensor.ceiling_ensuite_bathroom_zigbee_connectivity_3` — Zigbee connectivity — disabled:integration, diagnostic

#### Throne Ceiling above sink

- Area: `Ensuite (Throne) Bathroom`
- Manufacturer/model: `Signify Netherlands B.V.` / `Hue ambiance spot`
- Integration domains: `hue`
- Entities: `2`
- Controls:
  - `light.throne_ceiling_light_3_2` — light.throne_ceiling_light_3_2 — conversation
- Disabled:
  - `sensor.ceiling_ensuite_bathroom_zigbee_connectivity` — Zigbee connectivity — disabled:integration, diagnostic

#### Throne Ceiling Light.3

- Area: `Ensuite (Throne) Bathroom`
- Manufacturer/model: `Signify Netherlands B.V.` / `Hue ambiance spot`
- Integration domains: `hue`
- Entities: `2`
- Controls:
  - `light.throne_ceiling_light_3` — light.throne_ceiling_light_3 — conversation
- Disabled:
  - `sensor.ceiling_ensuite_bathroom_zigbee_connectivity_4` — Zigbee connectivity — disabled:integration, diagnostic

### Hallway (Pass)

Devices: `7`

#### Hallway

- Area: `Hallway (Pass)`
- Manufacturer/model: `Signify Netherlands B.V.` / `Room`
- Integration domains: `hue`
- Entities: `7`
- Controls:
  - `light.hallway` — light.hallway — conversation
  - `scene.hallway_concentrate` — Concentrate — conversation, google
  - `scene.hallway_energise` — Energise — conversation, google
  - `scene.hallway_nightlight` — Nightlight — conversation, google
  - `scene.hallway_read` — Read — conversation, google
  - `scene.hallway_relax` — Relax — conversation, google
- Presence / Events:
  - `binary_sensor.hallway_motionaware_ceiling` — Hallway MotionAware Ceiling — conversation, google

#### Hallway Dimmer Switch

- Area: `Hallway (Pass)`
- Manufacturer/model: `Signify Netherlands B.V.` / `Hue dimmer switch`
- Integration domains: `hue`
- Entities: `6`
- Presence / Events:
  - `event.hallway_dimmer_switch_button_1` — Button 1
  - `event.hallway_dimmer_switch_button_2` — Button 2
  - `event.hallway_dimmer_switch_button_3` — Button 3
  - `event.hallway_dimmer_switch_button_4` — Button 4
- Diagnostic:
  - `sensor.hallway_dimmer_switch_battery` — Battery — diagnostic
- Disabled:
  - `sensor.hue_dimmer_switch_4_zigbee_connectivity` — Zigbee connectivity — disabled:integration, diagnostic

#### Pass Ceiling Light.1

- Area: `Hallway (Pass)`
- Manufacturer/model: `Signify Netherlands B.V.` / `Hue ambiance spot`
- Integration domains: `hue`
- Entities: `2`
- Controls:
  - `light.pass_ceiling_light_1` — light.pass_ceiling_light_1 — conversation
- Disabled:
  - `sensor.chaos_vault_ceiling_zigbee_connectivity` — Zigbee connectivity — disabled:integration, diagnostic

#### Pass Ceiling Light.1 

- Area: `Hallway (Pass)`
- Manufacturer/model: `Signify Netherlands B.V.` / `Hue ambiance spot`
- Integration domains: `hue`
- Entities: `2`
- Controls:
  - `light.pass_ceiling_light_1_2` — light.pass_ceiling_light_1_2 — conversation
- Disabled:
  - `sensor.beta_pass_ceiling_zigbee_connectivity` — Zigbee connectivity — disabled:integration, diagnostic

#### Pass Ceiling Light.2

- Area: `Hallway (Pass)`
- Manufacturer/model: `Signify Netherlands B.V.` / `Hue ambiance spot`
- Integration domains: `hue`
- Entities: `2`
- Controls:
  - `light.pass_ceiling_light_2` — light.pass_ceiling_light_2 — conversation
- Disabled:
  - `sensor.splash_pass_ceiling_zigbee_connectivity` — Zigbee connectivity — disabled:integration, diagnostic

#### Pass Ceiling Light.4

- Area: `Hallway (Pass)`
- Manufacturer/model: `Signify Netherlands B.V.` / `Hue ambiance spot`
- Integration domains: `hue`
- Entities: `2`
- Controls:
  - `light.pass_ceiling_light_4` — light.pass_ceiling_light_4 — conversation
- Disabled:
  - `sensor.core_vault_ceiling_zigbee_connectivity` — Zigbee connectivity — disabled:integration, diagnostic

#### Pass Ceiling Light.5

- Area: `Hallway (Pass)`
- Manufacturer/model: `Signify Netherlands B.V.` / `Hue ambiance spot`
- Integration domains: `hue`
- Entities: `2`
- Controls:
  - `light.pass_ceiling_light_5` — light.pass_ceiling_light_5 — conversation
- Disabled:
  - `sensor.alpha_pass_ceiling_zigbee_connectivity` — Zigbee connectivity — disabled:integration, diagnostic

### Laundry room

Devices: `1`

#### Laundry room

- Area: `Laundry room`
- Manufacturer/model: `Signify Netherlands B.V.` / `Zone`
- Integration domains: `hue`
- Entities: `1`
- Controls:
  - `light.laundry_room` — light.laundry_room — conversation, google

### Laundry/Utilities

Devices: `3`

#### Hue Bridge Pro

- Area: `Laundry/Utilities`
- Manufacturer/model: `Signify Netherlands B.V.` / `Hue Bridge`
- Integration domains: `hue`
- Entities: `3`
- Controls:
  - `switch.automation_alpha_bedroom_dial_switch` — Automation: Alpha Bedroom Dial Switch — config
  - `switch.automation_hue_smart_button_3` — Automation: Hue smart button 3 — config
- Disabled:
  - `sensor.hue_bridge_pro_zigbee_connectivity` — Zigbee connectivity — disabled:integration, diagnostic

#### Laundry (Chaos) Ceiling Light

- Area: `Laundry/Utilities`
- Manufacturer/model: `Signify Netherlands B.V.` / `Hue white lamp`
- Integration domains: `hue`
- Entities: `2`
- Controls:
  - `light.laundry_chaos_ceiling_light` — light.laundry_chaos_ceiling_light — conversation
- Disabled:
  - `sensor.chaos_laundry_ceiling_zigbee_connectivity` — Zigbee connectivity — disabled:integration, diagnostic

#### White (E27) Hue Bulb

- Area: `Laundry/Utilities`
- Manufacturer/model: `Signify Netherlands B.V.` / `Hue white lamp`
- Integration domains: `hue`
- Entities: `2`
- Controls:
  - `light.white_e27_hue_bulb` — light.white_e27_hue_bulb — conversation
- Disabled:
  - `sensor.chaos_storage_ceiling_zigbee_connectivity` — Zigbee connectivity — disabled:integration, diagnostic

### Living Room

Devices: `8`

#### Beige Ola Spotlight Lamp

- Area: `Living Room`
- Manufacturer/model: `Signify Netherlands B.V.` / `Hue color lamp`
- Integration domains: `hue`
- Entities: `2`
- Controls:
  - `light.beige_ola_spotlight_lamp` — light.beige_ola_spotlight_lamp — conversation
- Disabled:
  - `sensor.beige_ola_spotlight_lamp_zigbee_connectivity` — Zigbee connectivity — disabled:integration, diagnostic

#### Core Ceiling Light.5

- Area: `Living Room`
- Manufacturer/model: `Signify Netherlands B.V.` / `Hue color spot`
- Integration domains: `hue`
- Entities: `2`
- Controls:
  - `light.core_ceiling_light_5_2` — light.core_ceiling_light_5_2 — conversation
- Disabled:
  - `sensor.ceiling_op_south_zigbee_connectivity` — Zigbee connectivity — disabled:integration, diagnostic

#### Core Living Ceiling

- Area: `Living Room`
- Manufacturer/model: `Signify Netherlands B.V.` / `Zone`
- Integration domains: `hue`
- Entities: `1`
- Controls:
  - `light.living_room_ceiling` — light.living_room_ceiling — conversation, google

#### Core Lounge HomePod

- Area: `Living Room`
- Manufacturer/model: `Apple` / `HomePod (gen 2)`
- Integration domains: `apple_tv`
- Entities: `2`
- Controls:
  - `media_player.core_lounge_homepod` — media_player.core_lounge_homepod — conversation, google
  - `remote.core_lounge_homepod` — remote.core_lounge_homepod

#### Core Lounge HomePod

- Area: `Living Room`
- Manufacturer/model: `Apple` / `HomePod (gen 2)`
- Integration domains: `apple_tv`
- Entities: `2`
- Controls:
  - `media_player.core_lounge_homepod_2` — media_player.core_lounge_homepod_2 — conversation, google
  - `remote.core_lounge_homepod_2` — remote.core_lounge_homepod_2

#### Living room

- Area: `Living Room`
- Manufacturer/model: `Signify Netherlands B.V.` / `Room`
- Integration domains: `hue`
- Entities: `1`
- Controls:
  - `light.living_room` — light.living_room — conversation, google

#### Living room lamps

- Area: `Living Room`
- Manufacturer/model: `Signify Netherlands B.V.` / `Zone`
- Integration domains: `hue`
- Entities: `1`
- Controls:
  - `light.living_room_lamps` — light.living_room_lamps — conversation, google

#### Lounge Apple TV (WIred)

- Area: `Living Room`
- Manufacturer/model: `Apple` / `Apple TV 4K (gen 3)`
- Integration domains: `apple_tv`
- Entities: `2`
- Controls:
  - `media_player.lounge_apple_tv_wired` — media_player.lounge_apple_tv_wired — conversation, google
  - `remote.lounge_apple_tv_wired` — remote.lounge_apple_tv_wired

### Living Room (2)

Devices: `1`

#### Living Room (2)

- Area: `Living Room (2)`
- Manufacturer/model: `Apple` / `HomePod (gen 2)`
- Integration domains: `apple_tv`
- Entities: `2`
- Controls:
  - `media_player.living_room_2` — media_player.living_room_2 — conversation, google
  - `remote.living_room_2` — remote.living_room_2

### My Bathroom

Devices: `1`

#### Bathroom

- Area: `My Bathroom`
- Manufacturer/model: `Signify Netherlands B.V.` / `Room`
- Integration domains: `hue`
- Entities: `3`
- Controls:
  - `light.bathroom` — light.bathroom — conversation, google
- Presence / Events:
  - `binary_sensor.bathroom_motion` — Motion — conversation, google
- Sensors:
  - `sensor.bathroom_illuminance` — Illuminance

### Openplan (Core)

Devices: `13`

#### Core Ceiling Light.1

- Area: `Openplan (Core)`
- Manufacturer/model: `Signify Netherlands B.V.` / `Hue color spot`
- Integration domains: `hue`
- Entities: `2`
- Controls:
  - `light.core_ceiling_light_1` — light.core_ceiling_light_1 — conversation
- Disabled:
  - `sensor.ceiling_op_north_wall_zone_a1b_zigbee_connectivity` — Zigbee connectivity — disabled:integration, diagnostic

#### Core Ceiling Light.10

- Area: `Openplan (Core)`
- Manufacturer/model: `Signify Netherlands B.V.` / `Hue ambiance spot`
- Integration domains: `hue`
- Entities: `2`
- Controls:
  - `light.core_ceiling_light_10` — light.core_ceiling_light_10 — conversation
- Disabled:
  - `sensor.ceiling_kitchen_sink_zigbee_connectivity` — Zigbee connectivity — disabled:integration, diagnostic

#### Core Ceiling Light.2

- Area: `Openplan (Core)`
- Manufacturer/model: `Signify Netherlands B.V.` / `Hue color spot`
- Integration domains: `hue`
- Entities: `2`
- Controls:
  - `light.core_ceiling_light_2` — light.core_ceiling_light_2 — conversation
- Disabled:
  - `sensor.ceiling_op_north_wall_zone_zigbee_connectivity` — Zigbee connectivity — disabled:integration, diagnostic

#### Core Ceiling Light.4

- Area: `Openplan (Core)`
- Manufacturer/model: `Signify Netherlands B.V.` / `Hue color spot`
- Integration domains: `hue`
- Entities: `2`
- Controls:
  - `light.core_ceiling_light_7` — Core Ceiling Light.7 — conversation
- Disabled:
  - `sensor.ceiling_open_plan_mr_zigbee_connectivity` — Zigbee connectivity — disabled:integration, diagnostic

#### Core Ceiling Light.4

- Area: `Openplan (Core)`
- Manufacturer/model: `Signify Netherlands B.V.` / `Hue color spot`
- Integration domains: `hue`
- Entities: `2`
- Controls:
  - `light.core_ceiling_light_4` — light.core_ceiling_light_4 — conversation
- Disabled:
  - `sensor.ceiling_open_plan_se_zigbee_connectivity` — Zigbee connectivity — disabled:integration, diagnostic

#### Core Ceiling Light.5

- Area: `Openplan (Core)`
- Manufacturer/model: `Signify Netherlands B.V.` / `Hue color spot`
- Integration domains: `hue`
- Entities: `2`
- Controls:
  - `light.core_ceiling_light_5` — light.core_ceiling_light_5 — conversation
- Disabled:
  - `sensor.ceiling_open_plan_east_zigbee_connectivity` — Zigbee connectivity — disabled:integration, diagnostic

#### Core Ceiling Light.6

- Area: `Openplan (Core)`
- Manufacturer/model: `Signify Netherlands B.V.` / `Hue color spot`
- Integration domains: `hue`
- Entities: `2`
- Controls:
  - `light.core_ceiling_light_6` — light.core_ceiling_light_6 — conversation
- Disabled:
  - `sensor.ceiling_open_plan_mm_zigbee_connectivity` — Zigbee connectivity — disabled:integration, diagnostic

#### Core Ceiling Light.8

- Area: `Openplan (Core)`
- Manufacturer/model: `Signify Netherlands B.V.` / `Hue color spot`
- Integration domains: `hue`
- Entities: `2`
- Controls:
  - `light.core_ceiling_light_8` — light.core_ceiling_light_8 — conversation
- Disabled:
  - `sensor.ceiling_op_br_zigbee_connectivity` — Zigbee connectivity — disabled:integration, diagnostic

#### Core Statement Arc Floor Lamp Monica Vibelucci

- Area: `Openplan (Core)`
- Manufacturer/model: `Signify Netherlands B.V.` / `Hue lightguide bulb`
- Integration domains: `hue`
- Entities: `2`
- Controls:
  - `light.core_statement_arc_floor_lamp_monica_vibelucci` — light.core_statement_arc_floor_lamp_monica_vibelucci — conversation
- Disabled:
  - `sensor.monica_vibelucci_arc_lamp_zigbee_connectivity` — Zigbee connectivity — disabled:integration, diagnostic

#### Core Tap Dial Light Switch

- Area: `Openplan (Core)`
- Manufacturer/model: `Signify Netherlands B.V.` / `Hue tap dial switch`
- Integration domains: `hue`
- Entities: `7`
- Presence / Events:
  - `event.core_tap_dial_light_switch_button_1` — Button 1
  - `event.core_tap_dial_light_switch_button_2` — Button 2
  - `event.core_tap_dial_light_switch_button_3` — Button 3
  - `event.core_tap_dial_light_switch_button_4` — Button 4
  - `event.core_tap_dial_light_switch_rotary` — Rotary
- Diagnostic:
  - `sensor.core_tap_dial_light_switch_battery` — Battery — diagnostic
- Disabled:
  - `sensor.core_hue_tap_dial_switch_zigbee_connectivity` — Zigbee connectivity — disabled:integration, diagnostic

#### Hue Signe White Gradient Floor Lamp.1

- Area: `Openplan (Core)`
- Manufacturer/model: `Signify Netherlands B.V.` / `Signe gradient floor`
- Integration domains: `hue`
- Entities: `2`
- Controls:
  - `light.hue_signe_white_gradient_floor_lamp_1` — light.hue_signe_white_gradient_floor_lamp_1 — conversation
- Disabled:
  - `sensor.core_signe_floor_lamp_zigbee_connectivity` — Zigbee connectivity — disabled:integration, diagnostic

#### Klasnick Beige Table Lamp (with E14 Hue Colour)

- Area: `Openplan (Core)`
- Manufacturer/model: `Signify Netherlands B.V.` / `Hue color candle`
- Integration domains: `hue`
- Entities: `2`
- Controls:
  - `light.klasnick_beige_table_lamp_with_e14_hue_colour` — light.klasnick_beige_table_lamp_with_e14_hue_colour — conversation
- Disabled:
  - `sensor.klasnick_beige_table_lamp_zigbee_connectivity` — Zigbee connectivity — disabled:integration, diagnostic

#### Signe gradient floor 1

- Area: `Openplan (Core)`
- Manufacturer/model: `Signify Netherlands B.V.` / `Signe gradient floor`
- Integration domains: `hue`
- Entities: `2`
- Controls:
  - `light.signe_gradient_floor_1` — light.signe_gradient_floor_1 — conversation, google
- Disabled:
  - `sensor.signe_gradient_floor_1_zigbee_connectivity` — Zigbee connectivity — disabled:integration, diagnostic

### Parking

Devices: `1`

#### SpeedTest

- Area: `Parking`
- Manufacturer/model: `Unknown manufacturer` / `Unknown model`
- Integration domains: `speedtestdotnet`
- Entities: `3`
- Sensors:
  - `sensor.speedtest_download` — Download
  - `sensor.speedtest_ping` — Ping
  - `sensor.speedtest_upload` — Upload

### Secondary Bathroom

Devices: `7`

#### Secondary Bathroom

- Area: `Secondary Bathroom`
- Manufacturer/model: `Signify Netherlands B.V.` / `Room`
- Integration domains: `hue`
- Entities: `3`
- Controls:
  - `light.secondary_bathroom` — light.secondary_bathroom — conversation, google
- Presence / Events:
  - `binary_sensor.secondary_bathroom_motion` — Motion — conversation, google
- Sensors:
  - `sensor.secondary_bathroom_illuminance` — Illuminance

#### Splash Ceiling Light.1

- Area: `Secondary Bathroom`
- Manufacturer/model: `Signify Netherlands B.V.` / `Hue ambiance spot`
- Integration domains: `hue`
- Entities: `2`
- Controls:
  - `light.splash_ceiling_light_1` — light.splash_ceiling_light_1 — conversation
- Disabled:
  - `sensor.splash_ceiling_light_2_zigbee_connectivity` — Zigbee connectivity — disabled:integration, diagnostic

#### Splash Ceiling Light.2

- Area: `Secondary Bathroom`
- Manufacturer/model: `Signify Netherlands B.V.` / `Hue ambiance spot`
- Integration domains: `hue`
- Entities: `2`
- Controls:
  - `light.splash_ceiling_light_2` — light.splash_ceiling_light_2 — conversation
- Disabled:
  - `sensor.splash_ceiling_light_3_zigbee_connectivity` — Zigbee connectivity — disabled:integration, diagnostic

#### Splash Ceiling Light.3

- Area: `Secondary Bathroom`
- Manufacturer/model: `Signify Netherlands B.V.` / `Hue ambiance spot`
- Integration domains: `hue`
- Entities: `2`
- Controls:
  - `light.splash_ceiling_light_3` — light.splash_ceiling_light_3 — conversation
- Disabled:
  - `sensor.splash_ceiling_light_5_zigbee_connectivity` — Zigbee connectivity — disabled:integration, diagnostic

#### Splash Ceiling Light.4

- Area: `Secondary Bathroom`
- Manufacturer/model: `Signify Netherlands B.V.` / `Hue ambiance spot`
- Integration domains: `hue`
- Entities: `2`
- Controls:
  - `light.splash_ceiling_light_4` — light.splash_ceiling_light_4 — conversation
- Disabled:
  - `sensor.splash_ceiling_light_1_zigbee_connectivity` — Zigbee connectivity — disabled:integration, diagnostic

#### Splash Ceiling Light.5

- Area: `Secondary Bathroom`
- Manufacturer/model: `Signify Netherlands B.V.` / `Hue ambiance spot`
- Integration domains: `hue`
- Entities: `2`
- Controls:
  - `light.splash_ceiling_light_5` — light.splash_ceiling_light_5 — conversation
- Disabled:
  - `sensor.splash_ceiling_light_4_zigbee_connectivity` — Zigbee connectivity — disabled:integration, diagnostic

#### Splash Dimmer Switch

- Area: `Secondary Bathroom`
- Manufacturer/model: `Signify Netherlands B.V.` / `Hue dimmer switch`
- Integration domains: `hue`
- Entities: `6`
- Presence / Events:
  - `event.splash_dimmer_switch_button_1` — Button 1
  - `event.splash_dimmer_switch_button_2` — Button 2
  - `event.splash_dimmer_switch_button_3` — Button 3
  - `event.splash_dimmer_switch_button_4` — Button 4
- Diagnostic:
  - `sensor.splash_dimmer_switch_battery` — Battery — diagnostic
- Disabled:
  - `sensor.splash_bathroom_dimmer_zigbee_connectivity` — Zigbee connectivity — disabled:integration, diagnostic

### Spare Bedroom

Devices: `13`

#### Bedroom Apple TV

- Area: `Spare Bedroom`
- Manufacturer/model: `Apple` / `Apple TV 4K (gen 3)`
- Integration domains: `apple_tv`
- Entities: `2`
- Controls:
  - `media_player.bedroom_apple_tv` — media_player.bedroom_apple_tv — conversation, google
  - `remote.bedroom_apple_tv` — remote.bedroom_apple_tv

#### Beta Bed Lightstrip

- Area: `Spare Bedroom`
- Manufacturer/model: `Signify Netherlands B.V.` / `Hue lightstrip plus`
- Integration domains: `hue`
- Entities: `2`
- Controls:
  - `light.beta_bed_lightstrip` — light.beta_bed_lightstrip — conversation
- Disabled:
  - `sensor.beta_bed_lightstrip_zigbee_connectivity` — Zigbee connectivity — disabled:integration, diagnostic

#### Beta Bedroom & Bath

- Area: `Spare Bedroom`
- Manufacturer/model: `Signify Netherlands B.V.` / `Zone`
- Integration domains: `hue`
- Entities: `1`
- Controls:
  - `light.beta_bedroom_bath` — light.beta_bedroom_bath — conversation, google

#### Beta Ceiling Light.3

- Area: `Spare Bedroom`
- Manufacturer/model: `Signify Netherlands B.V.` / `Hue ambiance spot`
- Integration domains: `hue`
- Entities: `2`
- Controls:
  - `light.beta_ceiling_light_3_2` — light.beta_ceiling_light_3_2 — conversation
- Disabled:
  - `sensor.beta_ceiling_light_zigbee_connectivity` — Zigbee connectivity — disabled:integration, diagnostic

#### Beta Ceiling Light.3

- Area: `Spare Bedroom`
- Manufacturer/model: `Signify Netherlands B.V.` / `Hue ambiance spot`
- Integration domains: `hue`
- Entities: `2`
- Controls:
  - `light.beta_ceiling_light_3` — light.beta_ceiling_light_3 — conversation
- Disabled:
  - `sensor.beta_ceiling_light_3_zigbee_connectivity` — Zigbee connectivity — disabled:integration, diagnostic

#### Beta Ceiling Light.4

- Area: `Spare Bedroom`
- Manufacturer/model: `Signify Netherlands B.V.` / `Hue ambiance spot`
- Integration domains: `hue`
- Entities: `2`
- Controls:
  - `light.beta_ceiling_light_4` — light.beta_ceiling_light_4 — conversation
- Disabled:
  - `sensor.beta_ceiling_light_4_zigbee_connectivity` — Zigbee connectivity — disabled:integration, diagnostic

#### Beta Ceiling Light.6

- Area: `Spare Bedroom`
- Manufacturer/model: `Signify Netherlands B.V.` / `Hue ambiance spot`
- Integration domains: `hue`
- Entities: `2`
- Controls:
  - `light.beta_ceiling_light_6` — light.beta_ceiling_light_6 — conversation
- Disabled:
  - `sensor.beta_ceiling_light_6_zigbee_connectivity` — Zigbee connectivity — disabled:integration, diagnostic

#### Betaflex Ceiling Light.1

- Area: `Spare Bedroom`
- Manufacturer/model: `Signify Netherlands B.V.` / `Hue ambiance spot`
- Integration domains: `hue`
- Entities: `2`
- Controls:
  - `light.betaflex_ceiling_light_1` — Betaflex Ceiling Light.1 — conversation
- Disabled:
  - `sensor.beta_flex_ceiling_light_1_zigbee_connectivity` — Zigbee connectivity — disabled:integration, diagnostic

#### Betaflex Ceiling Light.2

- Area: `Spare Bedroom`
- Manufacturer/model: `Signify Netherlands B.V.` / `Hue ambiance spot`
- Integration domains: `hue`
- Entities: `2`
- Controls:
  - `light.betaflex_ceiling_light_2` — light.betaflex_ceiling_light_2 — conversation
- Disabled:
  - `sensor.beta_flex_ceiling_light_2_zigbee_connectivity` — Zigbee connectivity — disabled:integration, diagnostic

#### Hallway Tap Dial Switch

- Area: `Spare Bedroom`
- Manufacturer/model: `Signify Netherlands B.V.` / `Hue tap dial switch`
- Integration domains: `hue`
- Entities: `7`
- Presence / Events:
  - `event.hallway_tap_dial_switch_button_1` — Button 1
  - `event.hallway_tap_dial_switch_button_2` — Button 2
  - `event.hallway_tap_dial_switch_button_3` — Button 3
  - `event.hallway_tap_dial_switch_button_4` — Button 4
  - `event.hallway_tap_dial_switch_rotary` — Rotary
- Diagnostic:
  - `sensor.hallway_tap_dial_switch_battery` — Battery — diagnostic
- Disabled:
  - `sensor.beta_bedroom_hue_dial_switch_zigbee_connectivity` — Zigbee connectivity — disabled:integration, diagnostic

#### Hue Motion Sensor

- Area: `Spare Bedroom`
- Manufacturer/model: `Signify Netherlands B.V.` / `Hue motion sensor`
- Integration domains: `hue`
- Entities: `7`
- Controls:
  - `switch.hue_motion_sensor_light_sensor_enabled` — Light sensor enabled — config
  - `switch.hue_motion_sensor_motion_sensor_enabled` — Motion sensor enabled — config
- Presence / Events:
  - `binary_sensor.hue_motion_sensor_motion` — Motion — conversation
- Sensors:
  - `sensor.hue_motion_sensor_illuminance` — Illuminance
  - `sensor.hue_motion_sensor_temperature` — Temperature — conversation
- Diagnostic:
  - `sensor.hue_motion_sensor_battery` — Battery — diagnostic
- Disabled:
  - `sensor.bathroom2_hue_motion_sensor_zigbee_connectivity` — Zigbee connectivity — disabled:integration, diagnostic

#### Spare Bedroom

- Area: `Spare Bedroom`
- Manufacturer/model: `Signify Netherlands B.V.` / `Room`
- Integration domains: `hue`
- Entities: `1`
- Controls:
  - `light.spare_bedroom` — light.spare_bedroom — conversation

#### Spare Bedroom Ceiling

- Area: `Spare Bedroom`
- Manufacturer/model: `Signify Netherlands B.V.` / `Zone`
- Integration domains: `hue`
- Entities: `1`
- Controls:
  - `light.spare_bedroom_ceiling` — light.spare_bedroom_ceiling — conversation, google

### Unassigned

Devices: `61`

#### Absence for 3mins dining zone

- Area: `Unassigned`
- Manufacturer/model: `Aqara` / `Absence for 3mins dining zone`
- Integration domains: `matter`
- Entities: `4`
- Presence / Events:
  - `binary_sensor.absence_for_3mins_dining_zone_occupancy` — Occupancy
  - `binary_sensor.absence_for_3mins_dining_zone_occupancy_2` — Occupancy
- Diagnostic:
  - `button.absence_for_3mins_dining_zone_identify` — Identify — diagnostic
  - `button.absence_for_3mins_dining_zone_identify_2` — Identify — diagnostic

#### Absence for 3mins kitchen zone

- Area: `Unassigned`
- Manufacturer/model: `Aqara` / `Absence for 3mins kitchen zone`
- Integration domains: `matter`
- Entities: `4`
- Presence / Events:
  - `binary_sensor.absence_for_3mins_kitchen_zone_occupancy` — Occupancy
  - `binary_sensor.absence_for_3mins_kitchen_zone_occupancy_2` — Occupancy
- Diagnostic:
  - `button.absence_for_3mins_kitchen_zone_identify` — Identify — diagnostic
  - `button.absence_for_3mins_kitchen_zone_identify_2` — Identify — diagnostic

#### Absence for 3mins living zone

- Area: `Unassigned`
- Manufacturer/model: `Aqara` / `Absence for 3mins living zone`
- Integration domains: `matter`
- Entities: `4`
- Presence / Events:
  - `binary_sensor.absence_for_3mins_living_zone_occupancy` — Occupancy
  - `binary_sensor.absence_for_3mins_living_zone_occupancy_2` — Occupancy
- Diagnostic:
  - `button.absence_for_3mins_living_zone_identify` — Identify — diagnostic
  - `button.absence_for_3mins_living_zone_identify_2` — Identify — diagnostic

#### Absence for 5mins Openplan

- Area: `Unassigned`
- Manufacturer/model: `Aqara` / `Absence for 5mins Openplan`
- Integration domains: `matter`
- Entities: `4`
- Presence / Events:
  - `binary_sensor.absence_for_5mins_openplan_occupancy` — Occupancy
  - `binary_sensor.absence_for_5mins_openplan_occupancy_2` — Occupancy
- Diagnostic:
  - `button.absence_for_5mins_openplan_identify` — Identify — diagnostic
  - `button.absence_for_5mins_openplan_identify_2` — Identify — diagnostic

#### Approaching Openplan room

- Area: `Unassigned`
- Manufacturer/model: `Aqara` / `Approaching Openplan room`
- Integration domains: `matter`
- Entities: `4`
- Presence / Events:
  - `binary_sensor.approaching_openplan_room_occupancy` — Occupancy
  - `binary_sensor.approaching_openplan_room_occupancy_2` — Occupancy
- Diagnostic:
  - `button.approaching_openplan_room_identify` — Identify — diagnostic
  - `button.approaching_openplan_room_identify_2` — Identify — diagnostic

#### Aqara Curtain Driver E1

- Area: `Unassigned`
- Manufacturer/model: `Aqara` / `Aqara Curtain Driver E1`
- Integration domains: `matter`
- Entities: `14`
- Controls:
  - `cover.aqara_curtain_driver_e1` — cover.aqara_curtain_driver_e1 — conversation, google
  - `cover.aqara_curtain_driver_e1_3` — cover.aqara_curtain_driver_e1_3 — conversation, google
- Diagnostic:
  - `binary_sensor.aqara_curtain_driver_e1_problem` — Problem — diagnostic
  - `binary_sensor.aqara_curtain_driver_e1_problem_3` — Problem — diagnostic
  - `button.aqara_curtain_driver_e1_identify` — Identify — diagnostic
  - `button.aqara_curtain_driver_e1_identify_3` — Identify — diagnostic
  - `sensor.aqara_curtain_driver_e1_battery` — Battery — diagnostic
  - `sensor.aqara_curtain_driver_e1_battery_3` — Battery — diagnostic
  - `sensor.aqara_curtain_driver_e1_battery_charge_state` — Battery charge state — diagnostic
  - `sensor.aqara_curtain_driver_e1_battery_charge_state_3` — Battery charge state — diagnostic
  - `sensor.aqara_curtain_driver_e1_battery_voltage` — Battery voltage — diagnostic
  - `sensor.aqara_curtain_driver_e1_battery_voltage_3` — Battery voltage — diagnostic
- Disabled:
  - `sensor.aqara_curtain_driver_e1_target_opening_position` — Target opening position — disabled:integration, diagnostic
  - `sensor.aqara_curtain_driver_e1_target_opening_position_3` — Target opening position — disabled:integration, diagnostic

#### Aqara Curtain Driver E1

- Area: `Unassigned`
- Manufacturer/model: `Aqara` / `Aqara Curtain Driver E1`
- Integration domains: `matter`
- Entities: `14`
- Controls:
  - `cover.aqara_curtain_driver_e1_2` — cover.aqara_curtain_driver_e1_2 — conversation, google
  - `cover.aqara_curtain_driver_e1_4` — cover.aqara_curtain_driver_e1_4 — conversation, google
- Diagnostic:
  - `binary_sensor.aqara_curtain_driver_e1_problem_2` — Problem — diagnostic
  - `binary_sensor.aqara_curtain_driver_e1_problem_4` — Problem — diagnostic
  - `button.aqara_curtain_driver_e1_identify_2` — Identify — diagnostic
  - `button.aqara_curtain_driver_e1_identify_4` — Identify — diagnostic
  - `sensor.aqara_curtain_driver_e1_battery_2` — Battery — diagnostic
  - `sensor.aqara_curtain_driver_e1_battery_4` — Battery — diagnostic
  - `sensor.aqara_curtain_driver_e1_battery_charge_state_2` — Battery charge state — diagnostic
  - `sensor.aqara_curtain_driver_e1_battery_charge_state_4` — Battery charge state — diagnostic
  - `sensor.aqara_curtain_driver_e1_battery_voltage_2` — Battery voltage — diagnostic
  - `sensor.aqara_curtain_driver_e1_battery_voltage_4` — Battery voltage — diagnostic
- Disabled:
  - `sensor.aqara_curtain_driver_e1_target_opening_position_2` — Target opening position — disabled:integration, diagnostic
  - `sensor.aqara_curtain_driver_e1_target_opening_position_4` — Target opening position — disabled:integration, diagnostic

#### Aqara Door and Window Sensor

- Area: `Unassigned`
- Manufacturer/model: `Aqara` / `Aqara Door and Window Sensor`
- Integration domains: `matter`
- Entities: `10`
- Presence / Events:
  - `binary_sensor.aqara_door_and_window_sensor_door` — Door — conversation, google
  - `binary_sensor.aqara_door_and_window_sensor_door_8` — Door — conversation, google
- Diagnostic:
  - `button.aqara_door_and_window_sensor_identify` — Identify — diagnostic
  - `button.aqara_door_and_window_sensor_identify_8` — Identify — diagnostic
  - `sensor.aqara_door_and_window_sensor_battery` — Battery — diagnostic
  - `sensor.aqara_door_and_window_sensor_battery_8` — Battery — diagnostic
  - `sensor.aqara_door_and_window_sensor_battery_type` — Battery type — diagnostic
  - `sensor.aqara_door_and_window_sensor_battery_type_8` — Battery type — diagnostic
  - `sensor.aqara_door_and_window_sensor_battery_voltage` — Battery voltage — diagnostic
  - `sensor.aqara_door_and_window_sensor_battery_voltage_8` — Battery voltage — diagnostic

#### Aqara Door and Window Sensor

- Area: `Unassigned`
- Manufacturer/model: `Aqara` / `Aqara Door and Window Sensor`
- Integration domains: `matter`
- Entities: `10`
- Presence / Events:
  - `binary_sensor.aqara_door_and_window_sensor_door_2` — Door — conversation, google
  - `binary_sensor.aqara_door_and_window_sensor_door_9` — Door — conversation, google
- Diagnostic:
  - `button.aqara_door_and_window_sensor_identify_2` — Identify — diagnostic
  - `button.aqara_door_and_window_sensor_identify_9` — Identify — diagnostic
  - `sensor.aqara_door_and_window_sensor_battery_2` — Battery — diagnostic
  - `sensor.aqara_door_and_window_sensor_battery_9` — Battery — diagnostic
  - `sensor.aqara_door_and_window_sensor_battery_type_2` — Battery type — diagnostic
  - `sensor.aqara_door_and_window_sensor_battery_type_9` — Battery type — diagnostic
  - `sensor.aqara_door_and_window_sensor_battery_voltage_2` — Battery voltage — diagnostic
  - `sensor.aqara_door_and_window_sensor_battery_voltage_9` — Battery voltage — diagnostic

#### Aqara Door and Window Sensor

- Area: `Unassigned`
- Manufacturer/model: `Aqara` / `Aqara Door and Window Sensor`
- Integration domains: `matter`
- Entities: `10`
- Presence / Events:
  - `binary_sensor.aqara_door_and_window_sensor_door_10` — Door — conversation, google
  - `binary_sensor.aqara_door_and_window_sensor_door_3` — Door — conversation, google
- Diagnostic:
  - `button.aqara_door_and_window_sensor_identify_10` — Identify — diagnostic
  - `button.aqara_door_and_window_sensor_identify_3` — Identify — diagnostic
  - `sensor.aqara_door_and_window_sensor_battery_10` — Battery — diagnostic
  - `sensor.aqara_door_and_window_sensor_battery_3` — Battery — diagnostic
  - `sensor.aqara_door_and_window_sensor_battery_type_10` — Battery type — diagnostic
  - `sensor.aqara_door_and_window_sensor_battery_type_3` — Battery type — diagnostic
  - `sensor.aqara_door_and_window_sensor_battery_voltage_10` — Battery voltage — diagnostic
  - `sensor.aqara_door_and_window_sensor_battery_voltage_3` — Battery voltage — diagnostic

#### Aqara Door and Window Sensor

- Area: `Unassigned`
- Manufacturer/model: `Aqara` / `Aqara Door and Window Sensor`
- Integration domains: `matter`
- Entities: `10`
- Presence / Events:
  - `binary_sensor.aqara_door_and_window_sensor_door_11` — Door — conversation, google
  - `binary_sensor.aqara_door_and_window_sensor_door_4` — Door — conversation, google
- Diagnostic:
  - `button.aqara_door_and_window_sensor_identify_11` — Identify — diagnostic
  - `button.aqara_door_and_window_sensor_identify_4` — Identify — diagnostic
  - `sensor.aqara_door_and_window_sensor_battery_11` — Battery — diagnostic
  - `sensor.aqara_door_and_window_sensor_battery_4` — Battery — diagnostic
  - `sensor.aqara_door_and_window_sensor_battery_type_11` — Battery type — diagnostic
  - `sensor.aqara_door_and_window_sensor_battery_type_4` — Battery type — diagnostic
  - `sensor.aqara_door_and_window_sensor_battery_voltage_11` — Battery voltage — diagnostic
  - `sensor.aqara_door_and_window_sensor_battery_voltage_4` — Battery voltage — diagnostic

#### Aqara Door and Window Sensor

- Area: `Unassigned`
- Manufacturer/model: `Aqara` / `Aqara Door and Window Sensor`
- Integration domains: `matter`
- Entities: `10`
- Presence / Events:
  - `binary_sensor.aqara_door_and_window_sensor_door_12` — Door — conversation, google
  - `binary_sensor.aqara_door_and_window_sensor_door_5` — Door — conversation, google
- Diagnostic:
  - `button.aqara_door_and_window_sensor_identify_12` — Identify — diagnostic
  - `button.aqara_door_and_window_sensor_identify_5` — Identify — diagnostic
  - `sensor.aqara_door_and_window_sensor_battery_12` — Battery — diagnostic
  - `sensor.aqara_door_and_window_sensor_battery_5` — Battery — diagnostic
  - `sensor.aqara_door_and_window_sensor_battery_type_12` — Battery type — diagnostic
  - `sensor.aqara_door_and_window_sensor_battery_type_5` — Battery type — diagnostic
  - `sensor.aqara_door_and_window_sensor_battery_voltage_12` — Battery voltage — diagnostic
  - `sensor.aqara_door_and_window_sensor_battery_voltage_5` — Battery voltage — diagnostic

#### Aqara Door and Window Sensor

- Area: `Unassigned`
- Manufacturer/model: `Aqara` / `Aqara Door and Window Sensor`
- Integration domains: `matter`
- Entities: `10`
- Presence / Events:
  - `binary_sensor.aqara_door_and_window_sensor_door_13` — Door — conversation, google
  - `binary_sensor.aqara_door_and_window_sensor_door_6` — Door — conversation, google
- Diagnostic:
  - `button.aqara_door_and_window_sensor_identify_13` — Identify — diagnostic
  - `button.aqara_door_and_window_sensor_identify_6` — Identify — diagnostic
  - `sensor.aqara_door_and_window_sensor_battery_13` — Battery — diagnostic
  - `sensor.aqara_door_and_window_sensor_battery_6` — Battery — diagnostic
  - `sensor.aqara_door_and_window_sensor_battery_type_13` — Battery type — diagnostic
  - `sensor.aqara_door_and_window_sensor_battery_type_6` — Battery type — diagnostic
  - `sensor.aqara_door_and_window_sensor_battery_voltage_13` — Battery voltage — diagnostic
  - `sensor.aqara_door_and_window_sensor_battery_voltage_6` — Battery voltage — diagnostic

#### Aqara Door and Window Sensor

- Area: `Unassigned`
- Manufacturer/model: `Aqara` / `Aqara Door and Window Sensor`
- Integration domains: `matter`
- Entities: `10`
- Presence / Events:
  - `binary_sensor.aqara_door_and_window_sensor_door_14` — Door — conversation, google
  - `binary_sensor.aqara_door_and_window_sensor_door_7` — Door — conversation, google
- Diagnostic:
  - `button.aqara_door_and_window_sensor_identify_14` — Identify — diagnostic
  - `button.aqara_door_and_window_sensor_identify_7` — Identify — diagnostic
  - `sensor.aqara_door_and_window_sensor_battery_14` — Battery — diagnostic
  - `sensor.aqara_door_and_window_sensor_battery_7` — Battery — diagnostic
  - `sensor.aqara_door_and_window_sensor_battery_type_14` — Battery type — diagnostic
  - `sensor.aqara_door_and_window_sensor_battery_type_7` — Battery type — diagnostic
  - `sensor.aqara_door_and_window_sensor_battery_voltage_14` — Battery voltage — diagnostic
  - `sensor.aqara_door_and_window_sensor_battery_voltage_7` — Battery voltage — diagnostic

#### Aqara Hub M3

- Area: `Unassigned`
- Manufacturer/model: `Aqara` / `Aqara Hub M3`
- Integration domains: `matter`
- Entities: `2`
- Diagnostic:
  - `button.aqara_hub_m3_identify` — Identify — diagnostic
  - `button.aqara_hub_m3_identify_2` — Identify — diagnostic

#### Aqara Motion Sensor P1

- Area: `Unassigned`
- Manufacturer/model: `Aqara` / `Aqara Motion Sensor P1`
- Integration domains: `matter`
- Entities: `10`
- Presence / Events:
  - `binary_sensor.aqara_motion_sensor_p1_occupancy` — Occupancy
  - `binary_sensor.aqara_motion_sensor_p1_occupancy_3` — Occupancy
- Diagnostic:
  - `button.aqara_motion_sensor_p1_identify` — Identify — diagnostic
  - `button.aqara_motion_sensor_p1_identify_3` — Identify — diagnostic
  - `sensor.aqara_motion_sensor_p1_battery` — Battery — diagnostic
  - `sensor.aqara_motion_sensor_p1_battery_3` — Battery — diagnostic
  - `sensor.aqara_motion_sensor_p1_battery_type` — Battery type — diagnostic
  - `sensor.aqara_motion_sensor_p1_battery_type_3` — Battery type — diagnostic
  - `sensor.aqara_motion_sensor_p1_battery_voltage` — Battery voltage — diagnostic
  - `sensor.aqara_motion_sensor_p1_battery_voltage_3` — Battery voltage — diagnostic

#### Aqara Motion Sensor P1

- Area: `Unassigned`
- Manufacturer/model: `Aqara` / `Aqara Motion Sensor P1`
- Integration domains: `matter`
- Entities: `10`
- Presence / Events:
  - `binary_sensor.aqara_motion_sensor_p1_occupancy_2` — Occupancy
  - `binary_sensor.aqara_motion_sensor_p1_occupancy_4` — Occupancy
- Diagnostic:
  - `button.aqara_motion_sensor_p1_identify_2` — Identify — diagnostic
  - `button.aqara_motion_sensor_p1_identify_4` — Identify — diagnostic
  - `sensor.aqara_motion_sensor_p1_battery_2` — Battery — diagnostic
  - `sensor.aqara_motion_sensor_p1_battery_4` — Battery — diagnostic
  - `sensor.aqara_motion_sensor_p1_battery_type_2` — Battery type — diagnostic
  - `sensor.aqara_motion_sensor_p1_battery_type_4` — Battery type — diagnostic
  - `sensor.aqara_motion_sensor_p1_battery_voltage_2` — Battery voltage — diagnostic
  - `sensor.aqara_motion_sensor_p1_battery_voltage_4` — Battery voltage — diagnostic

#### Aqara Vibration Sensor

- Area: `Unassigned`
- Manufacturer/model: `Aqara` / `Aqara Vibration Sensor`
- Integration domains: `matter`
- Entities: `10`
- Presence / Events:
  - `binary_sensor.aqara_vibration_sensor_occupancy` — Occupancy
  - `binary_sensor.aqara_vibration_sensor_occupancy_2` — Occupancy
- Diagnostic:
  - `button.aqara_vibration_sensor_identify` — Identify — diagnostic
  - `button.aqara_vibration_sensor_identify_2` — Identify — diagnostic
  - `sensor.aqara_vibration_sensor_battery` — Battery — diagnostic
  - `sensor.aqara_vibration_sensor_battery_2` — Battery — diagnostic
  - `sensor.aqara_vibration_sensor_battery_type` — Battery type — diagnostic
  - `sensor.aqara_vibration_sensor_battery_type_2` — Battery type — diagnostic
  - `sensor.aqara_vibration_sensor_battery_voltage` — Battery voltage — diagnostic
  - `sensor.aqara_vibration_sensor_battery_voltage_2` — Battery voltage — diagnostic

#### Aqara Wireless Remote Switch

- Area: `Unassigned`
- Manufacturer/model: `Aqara` / `Aqara Wireless Remote Switch`
- Integration domains: `matter`
- Entities: `18`
- Presence / Events:
  - `event.aqara_wireless_remote_switch_button` — Button
  - `event.aqara_wireless_remote_switch_button_2` — Button
  - `event.aqara_wireless_remote_switch_button_3` — Button
  - `event.aqara_wireless_remote_switch_button_4` — Button
- Diagnostic:
  - `button.aqara_wireless_remote_switch_identify` — Identify — diagnostic
  - `button.aqara_wireless_remote_switch_identify_2` — Identify — diagnostic
  - `button.aqara_wireless_remote_switch_identify_3` — Identify — diagnostic
  - `button.aqara_wireless_remote_switch_identify_4` — Identify — diagnostic
  - `sensor.aqara_wireless_remote_switch_battery` — Battery — diagnostic
  - `sensor.aqara_wireless_remote_switch_battery_2` — Battery — diagnostic
  - `sensor.aqara_wireless_remote_switch_battery_type` — Battery type — diagnostic
  - `sensor.aqara_wireless_remote_switch_battery_type_2` — Battery type — diagnostic
  - `sensor.aqara_wireless_remote_switch_battery_voltage` — Battery voltage — diagnostic
  - `sensor.aqara_wireless_remote_switch_battery_voltage_2` — Battery voltage — diagnostic
- Disabled:
  - `sensor.aqara_wireless_remote_switch_current_switch_position` — Current switch position — disabled:integration, diagnostic
  - `sensor.aqara_wireless_remote_switch_current_switch_position_2` — Current switch position — disabled:integration, diagnostic
  - `sensor.aqara_wireless_remote_switch_current_switch_position_3` — Current switch position — disabled:integration, diagnostic
  - `sensor.aqara_wireless_remote_switch_current_switch_position_4` — Current switch position — disabled:integration, diagnostic

#### Aqara Presence Sensor FP1E

- Area: `Unassigned`
- Manufacturer/model: `Aqara` / `Aqara Presence Sensor FP1E`
- Integration domains: `matter`
- Entities: `4`
- Presence / Events:
  - `binary_sensor.aqara_presence_sensor_fp1e_occupancy` — Occupancy
  - `binary_sensor.aqara_presence_sensor_fp1e_occupancy_3` — Occupancy
- Diagnostic:
  - `button.aqara_presence_sensor_fp1e_identify` — Identify — diagnostic
  - `button.aqara_presence_sensor_fp1e_identify_3` — Identify — diagnostic

#### Aqara Presence Sensor FP1E

- Area: `Unassigned`
- Manufacturer/model: `Aqara` / `Aqara Presence Sensor FP1E`
- Integration domains: `matter`
- Entities: `4`
- Presence / Events:
  - `binary_sensor.aqara_presence_sensor_fp1e_occupancy_2` — Occupancy
  - `binary_sensor.aqara_presence_sensor_fp1e_occupancy_4` — Occupancy
- Diagnostic:
  - `button.aqara_presence_sensor_fp1e_identify_2` — Identify — diagnostic
  - `button.aqara_presence_sensor_fp1e_identify_4` — Identify — diagnostic

#### Backup

- Area: `Unassigned`
- Manufacturer/model: `Home Assistant` / `Home Assistant Backup`
- Integration domains: `backup`
- Entities: `5`
- Presence / Events:
  - `event.backup_automatic_backup` — Automatic backup
- Sensors:
  - `sensor.backup_backup_manager_state` — Backup Manager state
  - `sensor.backup_last_attempted_automatic_backup` — Last attempted automatic backup
  - `sensor.backup_last_successful_automatic_backup` — Last successful automatic backup
  - `sensor.backup_next_scheduled_automatic_backup` — Next scheduled automatic backup

#### Bedroom Display

- Area: `Unassigned`
- Manufacturer/model: `Google Inc.` / `Google Nest Hub`
- Integration domains: `cast`
- Entities: `1`
- Controls:
  - `media_player.bedroom_display` — media_player.bedroom_display — conversation

#### Beta bedroom no presence 3mins

- Area: `Unassigned`
- Manufacturer/model: `Aqara` / `Beta bedroom no presence 3mins`
- Integration domains: `matter`
- Entities: `4`
- Presence / Events:
  - `binary_sensor.beta_bedroom_no_presence_3mins_occupancy` — Occupancy
  - `binary_sensor.beta_bedroom_no_presence_3mins_occupancy_2` — Occupancy
- Diagnostic:
  - `button.beta_bedroom_no_presence_3mins_identify` — Identify — diagnostic
  - `button.beta_bedroom_no_presence_3mins_identify_2` — Identify — diagnostic

#### Beta bedroom presence detected

- Area: `Unassigned`
- Manufacturer/model: `Aqara` / `Beta bedroom presence detected`
- Integration domains: `matter`
- Entities: `4`
- Presence / Events:
  - `binary_sensor.beta_bedroom_presence_detected_occupancy` — Occupancy
  - `binary_sensor.beta_bedroom_presence_detected_occupancy_2` — Occupancy
- Diagnostic:
  - `button.beta_bedroom_presence_detected_identify` — Identify — diagnostic
  - `button.beta_bedroom_presence_detected_identify_2` — Identify — diagnostic

#### Bot 4A

- Area: `Unassigned`
- Manufacturer/model: `SwitchBot` / `Bot`
- Integration domains: `matter`
- Entities: `2`
- Controls:
  - `switch.bot_4a` — switch.bot_4a — conversation, google
- Diagnostic:
  - `sensor.bot_4a_battery` — Battery — diagnostic

#### fado glass globe lamp

- Area: `Unassigned`
- Manufacturer/model: `Signify Netherlands B.V.` / `Hue color lamp`
- Integration domains: `hue`
- Entities: `2`
- Controls:
  - `light.fado_glass_globe_lamp` — light.fado_glass_globe_lamp — conversation, google
- Disabled:
  - `sensor.hue_color_lamp_1_zigbee_connectivity_2` — Zigbee connectivity — disabled:integration, diagnostic

#### Forecast

- Area: `Unassigned`
- Manufacturer/model: `Met.no` / `Forecast`
- Integration domains: `met`
- Entities: `1`
- Sensors:
  - `weather.forecast_home` — Home

#### hci0 (8C:BD:37:64:26:26)

- Area: `Unassigned`
- Manufacturer/model: `Shenzhen Phaten Tech. LTD` / `Unknown`
- Integration domains: `bluetooth`
- Entities: `0`
- Entities: none registered under this device.

#### Hub 3 Button 1

- Area: `Unassigned`
- Manufacturer/model: `SwitchBot` / `Hub 3`
- Integration domains: `matter`
- Entities: `2`
- Presence / Events:
  - `event.hub_3_button_1_button` — Button
- Disabled:
  - `sensor.hub_3_button_1_current_switch_position` — Current switch position — disabled:integration, diagnostic

#### Hub 3 Button 2

- Area: `Unassigned`
- Manufacturer/model: `SwitchBot` / `Hub 3`
- Integration domains: `matter`
- Entities: `2`
- Presence / Events:
  - `event.hub_3_button_2_button` — Button
- Disabled:
  - `sensor.hub_3_button_2_current_switch_position` — Current switch position — disabled:integration, diagnostic

#### Hub 3 Button 3

- Area: `Unassigned`
- Manufacturer/model: `SwitchBot` / `Hub 3`
- Integration domains: `matter`
- Entities: `2`
- Presence / Events:
  - `event.hub_3_button_3_button` — Button
- Disabled:
  - `sensor.hub_3_button_3_current_switch_position` — Current switch position — disabled:integration, diagnostic

#### Hub 3 HumiSensor

- Area: `Unassigned`
- Manufacturer/model: `SwitchBot` / `Hub 3`
- Integration domains: `matter`
- Entities: `1`
- Sensors:
  - `sensor.hub_3_humisensor_humidity` — Humidity — conversation, google

#### Hub 3 MotionSensor

- Area: `Unassigned`
- Manufacturer/model: `SwitchBot` / `Hub 3`
- Integration domains: `matter`
- Entities: `1`
- Presence / Events:
  - `binary_sensor.hub_3_motionsensor_occupancy` — Occupancy

#### Hub 3 TempSensor

- Area: `Unassigned`
- Manufacturer/model: `SwitchBot` / `Hub 3`
- Integration domains: `matter`
- Entities: `1`
- Sensors:
  - `sensor.hub_3_tempsensor_temperature` — Temperature — conversation, google

#### Hue Play 1

- Area: `Unassigned`
- Manufacturer/model: `Signify Netherlands B.V.` / `Hue Play`
- Integration domains: `hue`
- Entities: `2`
- Controls:
  - `light.hue_play_1` — light.hue_play_1 — conversation, google
- Disabled:
  - `sensor.hue_play_1_zigbee_connectivity` — Zigbee connectivity — disabled:integration, diagnostic

#### Hue Play 2

- Area: `Unassigned`
- Manufacturer/model: `Signify Netherlands B.V.` / `Hue Play`
- Integration domains: `hue`
- Entities: `2`
- Controls:
  - `light.hue_play_2` — light.hue_play_2 — conversation, google
- Disabled:
  - `sensor.hue_play_2_zigbee_connectivity` — Zigbee connectivity — disabled:integration, diagnostic

#### Hue smart button 2

- Area: `Unassigned`
- Manufacturer/model: `Signify Netherlands B.V.` / `Hue smart button`
- Integration domains: `hue`
- Entities: `3`
- Presence / Events:
  - `event.hue_smart_button_2_button_1` — Button 1
- Diagnostic:
  - `sensor.hue_smart_button_2_battery` — Battery — diagnostic
- Disabled:
  - `sensor.hue_smart_button_2_zigbee_connectivity` — Zigbee connectivity — disabled:integration, diagnostic

#### Hue smart button 3

- Area: `Unassigned`
- Manufacturer/model: `Signify Netherlands B.V.` / `Hue smart button`
- Integration domains: `hue`
- Entities: `3`
- Presence / Events:
  - `event.hue_smart_button_3_button_1` — Button 1
- Diagnostic:
  - `sensor.hue_smart_button_3_battery` — Battery — diagnostic
- Disabled:
  - `sensor.hue_smart_button_3_zigbee_connectivity` — Zigbee connectivity — disabled:integration, diagnostic

#### Hue smart plug 1

- Area: `Unassigned`
- Manufacturer/model: `Signify Netherlands B.V.` / `Hue smart plug`
- Integration domains: `hue`
- Entities: `2`
- Controls:
  - `light.hue_smart_plug_1` — light.hue_smart_plug_1 — conversation, google
- Disabled:
  - `sensor.hue_smart_plug_1_zigbee_connectivity` — Zigbee connectivity — disabled:integration, diagnostic

#### iPhone 16Pro Max 

- Area: `Unassigned`
- Manufacturer/model: `Apple` / `iPhone17,2`
- Integration domains: `mobile_app`
- Entities: `21`
- Presence / Events:
  - `binary_sensor.iphone_16pro_max_focus` — iPhone 16Pro Max  Focus
- Sensors:
  - `sensor.iphone_16pro_max_activity` — iPhone 16Pro Max  Activity
  - `sensor.iphone_16pro_max_audio_output` — iPhone 16Pro Max  Audio Output
  - `sensor.iphone_16pro_max_average_active_pace` — iPhone 16Pro Max  Average Active Pace
  - `sensor.iphone_16pro_max_battery_level` — iPhone 16Pro Max  Battery Level
  - `sensor.iphone_16pro_max_battery_state` — iPhone 16Pro Max  Battery State
  - `sensor.iphone_16pro_max_bssid` — iPhone 16Pro Max  BSSID
  - `sensor.iphone_16pro_max_connection_type` — iPhone 16Pro Max  Connection Type
  - `sensor.iphone_16pro_max_distance` — iPhone 16Pro Max  Distance
  - `sensor.iphone_16pro_max_floors_ascended` — iPhone 16Pro Max  Floors Ascended
  - `sensor.iphone_16pro_max_floors_descended` — iPhone 16Pro Max  Floors Descended
  - `sensor.iphone_16pro_max_geocoded_location` — iPhone 16Pro Max  Geocoded Location
  - `sensor.iphone_16pro_max_last_update_trigger` — iPhone 16Pro Max  Last Update Trigger
  - `sensor.iphone_16pro_max_location_permission` — iPhone 16Pro Max  Location permission
  - `sensor.iphone_16pro_max_sim_1` — iPhone 16Pro Max  SIM 1
  - `sensor.iphone_16pro_max_sim_2` — iPhone 16Pro Max  SIM 2
  - `sensor.iphone_16pro_max_ssid` — iPhone 16Pro Max  SSID
  - `sensor.iphone_16pro_max_steps` — iPhone 16Pro Max  Steps
  - `sensor.iphone_16pro_max_storage` — iPhone 16Pro Max  Storage
- Diagnostic:
  - `device_tracker.iphone_16pro_max` — iPhone 16Pro Max  — diagnostic
  - `sensor.iphone_16pro_max_app_version` — iPhone 16Pro Max  App Version — diagnostic

#### Jeff’s iPad

- Area: `Unassigned`
- Manufacturer/model: `Apple` / `iPad17,1`
- Integration domains: `mobile_app`
- Entities: `12`
- Sensors:
  - `sensor.jeffs_ipad_audio_output` — Jeff’s iPad Audio Output
  - `sensor.jeffs_ipad_battery_level` — Jeff’s iPad Battery Level
  - `sensor.jeffs_ipad_battery_state` — Jeff’s iPad Battery State
  - `sensor.jeffs_ipad_bssid` — Jeff’s iPad BSSID
  - `sensor.jeffs_ipad_connection_type` — Jeff’s iPad Connection Type
  - `sensor.jeffs_ipad_geocoded_location` — Jeff’s iPad Geocoded Location
  - `sensor.jeffs_ipad_last_update_trigger` — Jeff’s iPad Last Update Trigger
  - `sensor.jeffs_ipad_location_permission` — Jeff’s iPad Location permission
  - `sensor.jeffs_ipad_ssid` — Jeff’s iPad SSID
  - `sensor.jeffs_ipad_storage` — Jeff’s iPad Storage
- Diagnostic:
  - `device_tracker.ipad_pro` — Jeff’s iPad — diagnostic
  - `sensor.jeffs_ipad_app_version` — Jeff’s iPad App Version — diagnostic

#### Jeff’s iPhone

- Area: `Unassigned`
- Manufacturer/model: `Apple` / `iPhone18,2`
- Integration domains: `mobile_app`
- Entities: `14`
- Sensors:
  - `sensor.jeffs_iphone_audio_output` — Jeff’s iPhone Audio Output
  - `sensor.jeffs_iphone_battery_level` — Jeff’s iPhone Battery Level
  - `sensor.jeffs_iphone_battery_state` — Jeff’s iPhone Battery State
  - `sensor.jeffs_iphone_bssid` — Jeff’s iPhone BSSID
  - `sensor.jeffs_iphone_connection_type` — Jeff’s iPhone Connection Type
  - `sensor.jeffs_iphone_geocoded_location` — Jeff’s iPhone Geocoded Location
  - `sensor.jeffs_iphone_last_update_trigger` — Jeff’s iPhone Last Update Trigger
  - `sensor.jeffs_iphone_location_permission` — Jeff’s iPhone Location permission
  - `sensor.jeffs_iphone_sim_1` — Jeff’s iPhone SIM 1
  - `sensor.jeffs_iphone_sim_2` — Jeff’s iPhone SIM 2
  - `sensor.jeffs_iphone_ssid` — Jeff’s iPhone SSID
  - `sensor.jeffs_iphone_storage` — Jeff’s iPhone Storage
- Diagnostic:
  - `device_tracker.iphone_17_pro_max` — Jeff’s iPhone — diagnostic
  - `sensor.jeffs_iphone_app_version` — Jeff’s iPhone App Version — diagnostic

#### Loft Display

- Area: `Unassigned`
- Manufacturer/model: `Google Inc.` / `Google Nest Hub`
- Integration domains: `cast`
- Entities: `1`
- Controls:
  - `media_player.nesthubd029_2` — media_player.nesthubd029_2 — conversation, google

#### MacBook Air 

- Area: `Unassigned`
- Manufacturer/model: `Apple` / `Mac15,12`
- Integration domains: `mobile_app`
- Entities: `23`
- Presence / Events:
  - `binary_sensor.macbook_air_active` — MacBook Air  Active
  - `binary_sensor.macbook_air_audio_input_in_use` — MacBook Air  Audio Input In Use
  - `binary_sensor.macbook_air_audio_output_in_use` — MacBook Air  Audio Output In Use
  - `binary_sensor.macbook_air_camera_in_use` — MacBook Air  Camera In Use
- Sensors:
  - `sensor.macbook_air_active_audio_input` — MacBook Air  Active Audio Input
  - `sensor.macbook_air_active_audio_output` — MacBook Air  Active Audio Output
  - `sensor.macbook_air_active_camera` — MacBook Air  Active Camera
  - `sensor.macbook_air_audio_output` — MacBook Air  Audio Output
  - `sensor.macbook_air_bssid` — MacBook Air  BSSID
  - `sensor.macbook_air_connection_type` — MacBook Air  Connection Type
  - `sensor.macbook_air_displays` — MacBook Air  Displays
  - `sensor.macbook_air_frontmost_app` — MacBook Air  Frontmost App
  - `sensor.macbook_air_geocoded_location` — MacBook Air  Geocoded Location
  - `sensor.macbook_air_internal_battery_level` — MacBook Air  Internal Battery Level
  - `sensor.macbook_air_internal_battery_state` — MacBook Air  Internal Battery State
  - `sensor.macbook_air_last_update_trigger` — MacBook Air  Last Update Trigger
  - `sensor.macbook_air_location_permission` — MacBook Air  Location permission
  - `sensor.macbook_air_primary_display_id` — MacBook Air  Primary Display ID
  - `sensor.macbook_air_primary_display_name` — MacBook Air  Primary Display Name
  - `sensor.macbook_air_ssid` — MacBook Air  SSID
  - `sensor.macbook_air_storage` — MacBook Air  Storage
- Diagnostic:
  - `device_tracker.macbook_air` — MacBook Air  — diagnostic
  - `sensor.macbook_air_app_version` — MacBook Air  App Version — diagnostic

#### NestHubD029

- Area: `Unassigned`
- Manufacturer/model: `Google Inc.` / `Google Nest Hub`
- Integration domains: `cast`
- Entities: `1`
- Controls:
  - `media_player.nesthubd029` — media_player.nesthubd029 — conversation, google

#### NestHubD029

- Area: `Unassigned`
- Manufacturer/model: `Google Inc.` / `Google Nest Hub`
- Integration domains: `cast`
- Entities: `1`
- Controls:
  - `media_player.nesthubd029_3` — media_player.nesthubd029_3 — conversation, google

#### Nyamane 3-spot Lamp - Top 

- Area: `Unassigned`
- Manufacturer/model: `Signify Netherlands B.V.` / `Hue Essential spot`
- Integration domains: `hue`
- Entities: `2`
- Controls:
  - `light.nyamane_3_spot_lamp_top` — light.nyamane_3_spot_lamp_top — conversation, google
- Disabled:
  - `sensor.hue_essential_spot_3_zigbee_connectivity` — Zigbee connectivity — disabled:integration, diagnostic

#### Nymane 3-spot Lamp - Mid

- Area: `Unassigned`
- Manufacturer/model: `Signify Netherlands B.V.` / `Hue Essential spot`
- Integration domains: `hue`
- Entities: `2`
- Controls:
  - `light.nymane_3_spot_lamp_mid` — light.nymane_3_spot_lamp_mid — conversation, google
- Disabled:
  - `sensor.hue_essential_spot_1_zigbee_connectivity` — Zigbee connectivity — disabled:integration, diagnostic

#### Ola Whitborg XL Floor Lamp

- Area: `Unassigned`
- Manufacturer/model: `Signify Netherlands B.V.` / `Hue color lamp`
- Integration domains: `hue`
- Entities: `2`
- Controls:
  - `light.ola_whitborg_xl_floor_lamp` — light.ola_whitborg_xl_floor_lamp — conversation, google
- Disabled:
  - `sensor.hue_color_lamp_1_zigbee_connectivity` — Zigbee connectivity — disabled:integration, diagnostic

#### Presence Dining zone

- Area: `Unassigned`
- Manufacturer/model: `Aqara` / `Presence Dining zone`
- Integration domains: `matter`
- Entities: `4`
- Presence / Events:
  - `binary_sensor.presence_dining_zone_occupancy` — Occupancy
  - `binary_sensor.presence_dining_zone_occupancy_2` — Occupancy
- Diagnostic:
  - `button.presence_dining_zone_identify` — Identify — diagnostic
  - `button.presence_dining_zone_identify_2` — Identify — diagnostic

#### Presence kitchen zone

- Area: `Unassigned`
- Manufacturer/model: `Aqara` / `Presence kitchen zone`
- Integration domains: `matter`
- Entities: `4`
- Presence / Events:
  - `binary_sensor.presence_kitchen_zone_occupancy` — Occupancy
  - `binary_sensor.presence_kitchen_zone_occupancy_2` — Occupancy
- Diagnostic:
  - `button.presence_kitchen_zone_identify` — Identify — diagnostic
  - `button.presence_kitchen_zone_identify_2` — Identify — diagnostic

#### Presence living zone

- Area: `Unassigned`
- Manufacturer/model: `Aqara` / `Presence living zone`
- Integration domains: `matter`
- Entities: `4`
- Presence / Events:
  - `binary_sensor.presence_living_zone_occupancy` — Occupancy
  - `binary_sensor.presence_living_zone_occupancy_2` — Occupancy
- Diagnostic:
  - `button.presence_living_zone_identify` — Identify — diagnostic
  - `button.presence_living_zone_identify_2` — Identify — diagnostic

#### Roller Shade 0A

- Area: `Unassigned`
- Manufacturer/model: `SwitchBot` / `Roller Shade`
- Integration domains: `matter`
- Entities: `4`
- Controls:
  - `cover.roller_shade_0a` — cover.roller_shade_0a — conversation, google
- Diagnostic:
  - `binary_sensor.roller_shade_0a_problem` — Problem — diagnostic
  - `sensor.roller_shade_0a_battery` — Battery — diagnostic
- Disabled:
  - `sensor.roller_shade_0a_target_opening_position` — Target opening position — disabled:integration, diagnostic

#### Roller Shade 2A

- Area: `Unassigned`
- Manufacturer/model: `SwitchBot` / `Roller Shade`
- Integration domains: `matter`
- Entities: `4`
- Controls:
  - `cover.roller_shade_2a` — cover.roller_shade_2a — conversation, google
- Diagnostic:
  - `binary_sensor.roller_shade_2a_problem` — Problem — diagnostic
  - `sensor.roller_shade_2a_battery` — Battery — diagnostic
- Disabled:
  - `sensor.roller_shade_2a_target_opening_position` — Target opening position — disabled:integration, diagnostic

#### Roller Shade 84

- Area: `Unassigned`
- Manufacturer/model: `SwitchBot` / `Roller Shade`
- Integration domains: `matter`
- Entities: `4`
- Controls:
  - `cover.roller_shade_84` — cover.roller_shade_84 — conversation, google
- Diagnostic:
  - `binary_sensor.roller_shade_84_problem` — Problem — diagnostic
  - `sensor.roller_shade_84_battery` — Battery — diagnostic
- Disabled:
  - `sensor.roller_shade_84_target_opening_position` — Target opening position — disabled:integration, diagnostic

#### Serif TV

- Area: `Unassigned`
- Manufacturer/model: `Unknown manufacturer` / `LS01D`
- Integration domains: `cast`
- Entities: `1`
- Controls:
  - `media_player.serif_tv` — media_player.serif_tv — conversation

#### Signe gradient table 1

- Area: `Unassigned`
- Manufacturer/model: `Signify Netherlands B.V.` / `Signe gradient table`
- Integration domains: `hue`
- Entities: `2`
- Controls:
  - `light.signe_gradient_table_1` — light.signe_gradient_table_1 — conversation, google
- Disabled:
  - `sensor.signe_gradient_table_1_zigbee_connectivity` — Zigbee connectivity — disabled:integration, diagnostic

#### Sun

- Area: `Unassigned`
- Manufacturer/model: `Unknown manufacturer` / `Unknown model`
- Integration domains: `sun`
- Entities: `10`
- Diagnostic:
  - `sensor.sun_next_dawn` — Next dawn — diagnostic
  - `sensor.sun_next_dusk` — Next dusk — diagnostic
  - `sensor.sun_next_midnight` — Next midnight — diagnostic
  - `sensor.sun_next_noon` — Next noon — diagnostic
  - `sensor.sun_next_rising` — Next rising — diagnostic
  - `sensor.sun_next_setting` — Next setting — diagnostic
- Disabled:
  - `binary_sensor.sun_solar_rising` — Solar rising — disabled:integration, diagnostic
  - `sensor.sun_solar_azimuth` — Solar azimuth — disabled:integration, diagnostic
  - `sensor.sun_solar_elevation` — Solar elevation — disabled:integration, diagnostic
  - `sensor.sun_solar_rising` — Solar rising — disabled:integration, diagnostic

#### SwitchBot Hub 3

- Area: `Unassigned`
- Manufacturer/model: `SwitchBot` / `SwitchBot Hub 3`
- Integration domains: `matter`
- Entities: `1`
- Diagnostic:
  - `button.switchbot_hub_3_identify` — Identify — diagnostic

#### WiZ A60 Filament

- Area: `Unassigned`
- Manufacturer/model: `Signify` / `WiZ A60 Filament`
- Integration domains: `matter`
- Entities: `7`
- Controls:
  - `light.wiz_a60_filament` — light.wiz_a60_filament — conversation, google
  - `number.wiz_a60_filament_off_transition_time` — Off transition time — config
  - `number.wiz_a60_filament_on_level` — On level — config
  - `number.wiz_a60_filament_on_off_transition_time` — On/off transition time — config
  - `number.wiz_a60_filament_on_transition_time` — On transition time — config
  - `select.wiz_a60_filament_power_on_behaviour_on_startup` — Power-on behaviour on startup — config
- Diagnostic:
  - `button.wiz_a60_filament_identify` — Identify — diagnostic

### White HomePod Mini

Devices: `1`

#### White HomePod Mini

- Area: `White HomePod Mini`
- Manufacturer/model: `Apple` / `HomePod Mini`
- Integration domains: `apple_tv`
- Entities: `2`
- Controls:
  - `media_player.white_homepod_mini` — media_player.white_homepod_mini — conversation, google
  - `remote.white_homepod_mini` — remote.white_homepod_mini

## 5. Entities Without A Registered Device

Count: `8`

### binary_sensor (1)

- - `binary_sensor.remote_ui` — Remote UI — diagnostic

### input_boolean (1)

- - `input_boolean.test_mode` — Test Mode

### person (1)

- - `person.jeffffff` — Jeff

### scene (1)

- - `scene.new_scene` — New scene — conversation, google

### stt (1)

- - `stt.home_assistant_cloud` — Home Assistant Cloud

### todo (1)

- - `todo.shopping_list` — Shopping List — conversation

### tts (2)

- - `tts.google_translate_en_com` — Google Translate en com
- - `tts.home_assistant_cloud` — Home Assistant Cloud

## 6. Capability Views

### Lighting

Count: `74`

- `light.all_bedroom_bathroom` — light.all_bedroom_bathroom | device: All Bedroom & Bathroom | area: Bedroom — conversation, google
- `light.alpha_ceiling_light_4` — light.alpha_ceiling_light_4 | device: Alpha Ceiling Light.4 | area: Bedroom (Alpha) — conversation
- `light.alpha_ceiling_light_6` — light.alpha_ceiling_light_6 | device: Alpha Ceiling Light.6 | area: Bedroom — conversation, google
- `light.alpha_gradient_light_tube_1` — light.alpha_gradient_light_tube_1 | device: alpha gradient light-tube.1 | area: Bedroom — conversation, google
- `light.alphabed_ceiling_light_3` — light.alphabed_ceiling_light_3 | device: Alphabed Ceiling Light.3 | area: Bedroom (Alpha) — conversation
- `light.alphabed_ceiling_light_5` — light.alphabed_ceiling_light_5 | device: Alphabed Ceiling Light.5 | area: Bedroom (Alpha) — conversation, google
- `light.alphabed_ceiling_light_5_2` — light.alphabed_ceiling_light_5_2 | device: Alphabed Ceiling Light.5 | area: Bedroom (Alpha) — conversation
- `light.alphadoor_ceiling_light_6` — alphadoor ceiling light.6 | device: Alpha Ceiling Light.6 | area: Bedroom (Alpha) — conversation, google
- `light.bathroom` — light.bathroom | device: Bathroom | area: My Bathroom — conversation, google
- `light.bedroom` — light.bedroom | device: Bedroom | area: Bedroom (Alpha) — conversation
- `light.bedroom_ceiling` — light.bedroom_ceiling | device: Bedroom Ceiling | area: Bedroom — conversation, google
- `light.bedroom_lamps` — light.bedroom_lamps | device: Bedroom Lamps | area: Bedroom — conversation, google
- `light.beige_ola_spotlight_lamp` — light.beige_ola_spotlight_lamp | device: Beige Ola Spotlight Lamp | area: Living Room — conversation
- `light.beta_bed_lightstrip` — light.beta_bed_lightstrip | device: Beta Bed Lightstrip | area: Spare Bedroom — conversation
- `light.beta_bedroom_bath` — light.beta_bedroom_bath | device: Beta Bedroom & Bath | area: Spare Bedroom — conversation, google
- `light.beta_ceiling_light_3` — light.beta_ceiling_light_3 | device: Beta Ceiling Light.3 | area: Spare Bedroom — conversation
- `light.beta_ceiling_light_3_2` — light.beta_ceiling_light_3_2 | device: Beta Ceiling Light.3 | area: Spare Bedroom — conversation
- `light.beta_ceiling_light_4` — light.beta_ceiling_light_4 | device: Beta Ceiling Light.4 | area: Spare Bedroom — conversation
- `light.beta_ceiling_light_6` — light.beta_ceiling_light_6 | device: Beta Ceiling Light.6 | area: Spare Bedroom — conversation
- `light.betaflex_ceiling_light_1` — Betaflex Ceiling Light.1 | device: Betaflex Ceiling Light.1 | area: Spare Bedroom — conversation
- `light.betaflex_ceiling_light_2` — light.betaflex_ceiling_light_2 | device: Betaflex Ceiling Light.2 | area: Spare Bedroom — conversation
- `light.core_ceiling_3` — light.core_ceiling_3 | device: core ceiling.3 | area: Bedroom (Alpha) — conversation
- `light.core_ceiling_light_1` — light.core_ceiling_light_1 | device: Core Ceiling Light.1 | area: Openplan (Core) — conversation
- `light.core_ceiling_light_10` — light.core_ceiling_light_10 | device: Core Ceiling Light.10 | area: Openplan (Core) — conversation
- `light.core_ceiling_light_2` — light.core_ceiling_light_2 | device: Core Ceiling Light.2 | area: Openplan (Core) — conversation
- `light.core_ceiling_light_4` — light.core_ceiling_light_4 | device: Core Ceiling Light.4 | area: Openplan (Core) — conversation
- `light.core_ceiling_light_5` — light.core_ceiling_light_5 | device: Core Ceiling Light.5 | area: Openplan (Core) — conversation
- `light.core_ceiling_light_5_2` — light.core_ceiling_light_5_2 | device: Core Ceiling Light.5 | area: Living Room — conversation
- `light.core_ceiling_light_6` — light.core_ceiling_light_6 | device: Core Ceiling Light.6 | area: Openplan (Core) — conversation
- `light.core_ceiling_light_7` — Core Ceiling Light.7 | device: Core Ceiling Light.4 | area: Openplan (Core) — conversation
- `light.core_ceiling_light_8` — light.core_ceiling_light_8 | device: Core Ceiling Light.8 | area: Openplan (Core) — conversation
- `light.core_ceiling_light_9` — light.core_ceiling_light_9 | device: Core Ceiling Light.9 | area: Core_kitchen — conversation
- `light.core_statement_arc_floor_lamp_monica_vibelucci` — light.core_statement_arc_floor_lamp_monica_vibelucci | device: Core Statement Arc Floor Lamp Monica Vibelucci | area: Openplan (Core) — conversation
- `light.fado_glass_globe_lamp` — light.fado_glass_globe_lamp | device: fado glass globe lamp | area: Unassigned — conversation, google
- `light.hallway` — light.hallway | device: Hallway | area: Hallway (Pass) — conversation
- `light.hue_play_1` — light.hue_play_1 | device: Hue Play 1 | area: Unassigned — conversation, google
- `light.hue_play_2` — light.hue_play_2 | device: Hue Play 2 | area: Unassigned — conversation, google
- `light.hue_signe_white_gradient_floor_lamp_1` — light.hue_signe_white_gradient_floor_lamp_1 | device: Hue Signe White Gradient Floor Lamp.1 | area: Openplan (Core) — conversation
- `light.hue_smart_plug_1` — light.hue_smart_plug_1 | device: Hue smart plug 1 | area: Unassigned — conversation, google
- `light.ikea_skytrax_light` — light.ikea_skytrax_light | device: Ikea Skytrax Light | area: Bedroom — conversation
- `light.kitchen` — light.kitchen | device: Kitchen | area: Core_kitchen — conversation, google
- `light.kitchen_ceiling` — light.kitchen_ceiling | device: Kitchen Ceiling | area: Core_kitchen — conversation, google
- `light.klasnick_beige_table_lamp_with_e14_hue_colour` — light.klasnick_beige_table_lamp_with_e14_hue_colour | device: Klasnick Beige Table Lamp (with E14 Hue Colour) | area: Openplan (Core) — conversation
- `light.laundry_chaos_ceiling_light` — light.laundry_chaos_ceiling_light | device: Laundry (Chaos) Ceiling Light | area: Laundry/Utilities — conversation
- `light.laundry_room` — light.laundry_room | device: Laundry room | area: Laundry room — conversation, google
- `light.living_room` — light.living_room | device: Living room | area: Living Room — conversation, google
- `light.living_room_ceiling` — light.living_room_ceiling | device: Core Living Ceiling | area: Living Room — conversation, google
- `light.living_room_lamps` — light.living_room_lamps | device: Living room lamps | area: Living Room — conversation, google
- `light.nyamane_3_spot_lamp_top` — light.nyamane_3_spot_lamp_top | device: Nyamane 3-spot Lamp - Top  | area: Unassigned — conversation, google
- `light.nymane_3_spot_lamp_low` — light.nymane_3_spot_lamp_low | device: Nymane 3-spot Lamp - Low | area: Bedroom (Alpha) — conversation, google
- `light.nymane_3_spot_lamp_mid` — light.nymane_3_spot_lamp_mid | device: Nymane 3-spot Lamp - Mid | area: Unassigned — conversation, google
- `light.ola_whitborg_xl_floor_lamp` — light.ola_whitborg_xl_floor_lamp | device: Ola Whitborg XL Floor Lamp | area: Unassigned — conversation, google
- `light.pass_ceiling_light_1` — light.pass_ceiling_light_1 | device: Pass Ceiling Light.1 | area: Hallway (Pass) — conversation
- `light.pass_ceiling_light_1_2` — light.pass_ceiling_light_1_2 | device: Pass Ceiling Light.1  | area: Hallway (Pass) — conversation
- `light.pass_ceiling_light_2` — light.pass_ceiling_light_2 | device: Pass Ceiling Light.2 | area: Hallway (Pass) — conversation
- `light.pass_ceiling_light_4` — light.pass_ceiling_light_4 | device: Pass Ceiling Light.4 | area: Hallway (Pass) — conversation
- `light.pass_ceiling_light_5` — light.pass_ceiling_light_5 | device: Pass Ceiling Light.5 | area: Hallway (Pass) — conversation
- `light.right_bedside_lamp` — light.right_bedside_lamp | device: Right Bedside Lamp | area: Bedroom — conversation, google
- `light.secondary_bathroom` — light.secondary_bathroom | device: Secondary Bathroom | area: Secondary Bathroom — conversation, google
- `light.signe_gradient_floor_1` — light.signe_gradient_floor_1 | device: Signe gradient floor 1 | area: Openplan (Core) — conversation, google
- `light.signe_gradient_table_1` — light.signe_gradient_table_1 | device: Signe gradient table 1 | area: Unassigned — conversation, google
- `light.spare_bedroom` — light.spare_bedroom | device: Spare Bedroom | area: Spare Bedroom — conversation
- `light.spare_bedroom_ceiling` — light.spare_bedroom_ceiling | device: Spare Bedroom Ceiling | area: Spare Bedroom — conversation, google
- `light.splash_ceiling_light_1` — light.splash_ceiling_light_1 | device: Splash Ceiling Light.1 | area: Secondary Bathroom — conversation
- `light.splash_ceiling_light_2` — light.splash_ceiling_light_2 | device: Splash Ceiling Light.2 | area: Secondary Bathroom — conversation
- `light.splash_ceiling_light_3` — light.splash_ceiling_light_3 | device: Splash Ceiling Light.3 | area: Secondary Bathroom — conversation
- `light.splash_ceiling_light_4` — light.splash_ceiling_light_4 | device: Splash Ceiling Light.4 | area: Secondary Bathroom — conversation
- `light.splash_ceiling_light_5` — light.splash_ceiling_light_5 | device: Splash Ceiling Light.5 | area: Secondary Bathroom — conversation
- `light.throne_ceiling_light_2` — light.throne_ceiling_light_2 | device: Throne Ceiling above shower door | area: Ensuite (Throne) Bathroom — conversation
- `light.throne_ceiling_light_3` — light.throne_ceiling_light_3 | device: Throne Ceiling Light.3 | area: Ensuite (Throne) Bathroom — conversation
- `light.throne_ceiling_light_3_2` — light.throne_ceiling_light_3_2 | device: Throne Ceiling above sink | area: Ensuite (Throne) Bathroom — conversation
- `light.throne_ceiling_light_4` — light.throne_ceiling_light_4 | device: Throne Ceiling above Door | area: Ensuite (Throne) Bathroom — conversation
- `light.white_e27_hue_bulb` — light.white_e27_hue_bulb | device: White (E27) Hue Bulb | area: Laundry/Utilities — conversation
- `light.wiz_a60_filament` — light.wiz_a60_filament | device: WiZ A60 Filament | area: Unassigned — conversation, google

### Presence / Occupancy / Tracking

Count: `70`

- `binary_sensor.absence_for_3mins_dining_zone_occupancy` — Occupancy | device: Absence for 3mins dining zone | area: Unassigned
- `binary_sensor.absence_for_3mins_dining_zone_occupancy_2` — Occupancy | device: Absence for 3mins dining zone | area: Unassigned
- `binary_sensor.absence_for_3mins_kitchen_zone_occupancy` — Occupancy | device: Absence for 3mins kitchen zone | area: Unassigned
- `binary_sensor.absence_for_3mins_kitchen_zone_occupancy_2` — Occupancy | device: Absence for 3mins kitchen zone | area: Unassigned
- `binary_sensor.absence_for_3mins_living_zone_occupancy` — Occupancy | device: Absence for 3mins living zone | area: Unassigned
- `binary_sensor.absence_for_3mins_living_zone_occupancy_2` — Occupancy | device: Absence for 3mins living zone | area: Unassigned
- `binary_sensor.absence_for_5mins_openplan_occupancy` — Occupancy | device: Absence for 5mins Openplan | area: Unassigned
- `binary_sensor.absence_for_5mins_openplan_occupancy_2` — Occupancy | device: Absence for 5mins Openplan | area: Unassigned
- `binary_sensor.approaching_openplan_room_occupancy` — Occupancy | device: Approaching Openplan room | area: Unassigned
- `binary_sensor.approaching_openplan_room_occupancy_2` — Occupancy | device: Approaching Openplan room | area: Unassigned
- `binary_sensor.aqara_curtain_driver_e1_problem` — Problem | device: Aqara Curtain Driver E1 | area: Unassigned — diagnostic
- `binary_sensor.aqara_curtain_driver_e1_problem_2` — Problem | device: Aqara Curtain Driver E1 | area: Unassigned — diagnostic
- `binary_sensor.aqara_curtain_driver_e1_problem_3` — Problem | device: Aqara Curtain Driver E1 | area: Unassigned — diagnostic
- `binary_sensor.aqara_curtain_driver_e1_problem_4` — Problem | device: Aqara Curtain Driver E1 | area: Unassigned — diagnostic
- `binary_sensor.aqara_door_and_window_sensor_door` — Door | device: Aqara Door and Window Sensor | area: Unassigned — conversation, google
- `binary_sensor.aqara_door_and_window_sensor_door_10` — Door | device: Aqara Door and Window Sensor | area: Unassigned — conversation, google
- `binary_sensor.aqara_door_and_window_sensor_door_11` — Door | device: Aqara Door and Window Sensor | area: Unassigned — conversation, google
- `binary_sensor.aqara_door_and_window_sensor_door_12` — Door | device: Aqara Door and Window Sensor | area: Unassigned — conversation, google
- `binary_sensor.aqara_door_and_window_sensor_door_13` — Door | device: Aqara Door and Window Sensor | area: Unassigned — conversation, google
- `binary_sensor.aqara_door_and_window_sensor_door_14` — Door | device: Aqara Door and Window Sensor | area: Unassigned — conversation, google
- `binary_sensor.aqara_door_and_window_sensor_door_2` — Door | device: Aqara Door and Window Sensor | area: Unassigned — conversation, google
- `binary_sensor.aqara_door_and_window_sensor_door_3` — Door | device: Aqara Door and Window Sensor | area: Unassigned — conversation, google
- `binary_sensor.aqara_door_and_window_sensor_door_4` — Door | device: Aqara Door and Window Sensor | area: Unassigned — conversation, google
- `binary_sensor.aqara_door_and_window_sensor_door_5` — Door | device: Aqara Door and Window Sensor | area: Unassigned — conversation, google
- `binary_sensor.aqara_door_and_window_sensor_door_6` — Door | device: Aqara Door and Window Sensor | area: Unassigned — conversation, google
- `binary_sensor.aqara_door_and_window_sensor_door_7` — Door | device: Aqara Door and Window Sensor | area: Unassigned — conversation, google
- `binary_sensor.aqara_door_and_window_sensor_door_8` — Door | device: Aqara Door and Window Sensor | area: Unassigned — conversation, google
- `binary_sensor.aqara_door_and_window_sensor_door_9` — Door | device: Aqara Door and Window Sensor | area: Unassigned — conversation, google
- `binary_sensor.aqara_motion_sensor_p1_occupancy` — Occupancy | device: Aqara Motion Sensor P1 | area: Unassigned
- `binary_sensor.aqara_motion_sensor_p1_occupancy_2` — Occupancy | device: Aqara Motion Sensor P1 | area: Unassigned
- `binary_sensor.aqara_motion_sensor_p1_occupancy_3` — Occupancy | device: Aqara Motion Sensor P1 | area: Unassigned
- `binary_sensor.aqara_motion_sensor_p1_occupancy_4` — Occupancy | device: Aqara Motion Sensor P1 | area: Unassigned
- `binary_sensor.aqara_presence_sensor_fp1e_occupancy` — Occupancy | device: Aqara Presence Sensor FP1E | area: Unassigned
- `binary_sensor.aqara_presence_sensor_fp1e_occupancy_2` — Occupancy | device: Aqara Presence Sensor FP1E | area: Unassigned
- `binary_sensor.aqara_presence_sensor_fp1e_occupancy_3` — Occupancy | device: Aqara Presence Sensor FP1E | area: Unassigned
- `binary_sensor.aqara_presence_sensor_fp1e_occupancy_4` — Occupancy | device: Aqara Presence Sensor FP1E | area: Unassigned
- `binary_sensor.aqara_vibration_sensor_occupancy` — Occupancy | device: Aqara Vibration Sensor | area: Unassigned
- `binary_sensor.aqara_vibration_sensor_occupancy_2` — Occupancy | device: Aqara Vibration Sensor | area: Unassigned
- `binary_sensor.bathroom_motion` — Motion | device: Bathroom | area: My Bathroom — conversation, google
- `binary_sensor.beta_bedroom_no_presence_3mins_occupancy` — Occupancy | device: Beta bedroom no presence 3mins | area: Unassigned
- `binary_sensor.beta_bedroom_no_presence_3mins_occupancy_2` — Occupancy | device: Beta bedroom no presence 3mins | area: Unassigned
- `binary_sensor.beta_bedroom_presence_detected_occupancy` — Occupancy | device: Beta bedroom presence detected | area: Unassigned
- `binary_sensor.beta_bedroom_presence_detected_occupancy_2` — Occupancy | device: Beta bedroom presence detected | area: Unassigned
- `binary_sensor.hallway_motionaware_ceiling` — Hallway MotionAware Ceiling | device: Hallway | area: Hallway (Pass) — conversation, google
- `binary_sensor.hub_3_motionsensor_occupancy` — Occupancy | device: Hub 3 MotionSensor | area: Unassigned
- `binary_sensor.hue_motion_sensor_motion` — Motion | device: Hue Motion Sensor | area: Spare Bedroom — conversation
- `binary_sensor.hue_motion_sensor_motion_2` — Motion | device: Hue Motion Sensor | area: Ensuite (Throne) Bathroom — conversation
- `binary_sensor.iphone_16pro_max_focus` — iPhone 16Pro Max  Focus | device: iPhone 16Pro Max  | area: Unassigned
- `binary_sensor.macbook_air_active` — MacBook Air  Active | device: MacBook Air  | area: Unassigned
- `binary_sensor.macbook_air_audio_input_in_use` — MacBook Air  Audio Input In Use | device: MacBook Air  | area: Unassigned
- `binary_sensor.macbook_air_audio_output_in_use` — MacBook Air  Audio Output In Use | device: MacBook Air  | area: Unassigned
- `binary_sensor.macbook_air_camera_in_use` — MacBook Air  Camera In Use | device: MacBook Air  | area: Unassigned
- `binary_sensor.presence_dining_zone_occupancy` — Occupancy | device: Presence Dining zone | area: Unassigned
- `binary_sensor.presence_dining_zone_occupancy_2` — Occupancy | device: Presence Dining zone | area: Unassigned
- `binary_sensor.presence_kitchen_zone_occupancy` — Occupancy | device: Presence kitchen zone | area: Unassigned
- `binary_sensor.presence_kitchen_zone_occupancy_2` — Occupancy | device: Presence kitchen zone | area: Unassigned
- `binary_sensor.presence_living_zone_occupancy` — Occupancy | device: Presence living zone | area: Unassigned
- `binary_sensor.presence_living_zone_occupancy_2` — Occupancy | device: Presence living zone | area: Unassigned
- `binary_sensor.remote_ui` — Remote UI | device: none | area: Unassigned — diagnostic
- `binary_sensor.roller_shade_0a_problem` — Problem | device: Roller Shade 0A | area: Unassigned — diagnostic
- `binary_sensor.roller_shade_2a_problem` — Problem | device: Roller Shade 2A | area: Unassigned — diagnostic
- `binary_sensor.roller_shade_84_problem` — Problem | device: Roller Shade 84 | area: Unassigned — diagnostic
- `binary_sensor.secondary_bathroom_motion` — Motion | device: Secondary Bathroom | area: Secondary Bathroom — conversation, google
- `binary_sensor.sun_solar_rising` — Solar rising | device: Sun | area: Unassigned — disabled:integration, diagnostic
- `binary_sensor.withings_in_bed` — In bed | device: Withings | area: Bedroom (Alpha) — conversation
- `device_tracker.ipad_pro` — Jeff’s iPad | device: Jeff’s iPad | area: Unassigned — diagnostic
- `device_tracker.iphone_16pro_max` — iPhone 16Pro Max  | device: iPhone 16Pro Max  | area: Unassigned — diagnostic
- `device_tracker.iphone_17_pro_max` — Jeff’s iPhone | device: Jeff’s iPhone | area: Unassigned — diagnostic
- `device_tracker.macbook_air` — MacBook Air  | device: MacBook Air  | area: Unassigned — diagnostic
- `person.jeffffff` — Jeff | device: none | area: Unassigned

### Media / Remote

Count: `19`

- `media_player.bedroom_apple_tv` — media_player.bedroom_apple_tv | device: Bedroom Apple TV | area: Spare Bedroom — conversation, google
- `media_player.bedroom_display` — media_player.bedroom_display | device: Bedroom Display | area: Unassigned — conversation
- `media_player.core_lounge_homepod` — media_player.core_lounge_homepod | device: Core Lounge HomePod | area: Living Room — conversation, google
- `media_player.core_lounge_homepod_2` — media_player.core_lounge_homepod_2 | device: Core Lounge HomePod | area: Living Room — conversation, google
- `media_player.living_room_2` — media_player.living_room_2 | device: Living Room (2) | area: Living Room (2) — conversation, google
- `media_player.lounge_apple_tv_wired` — media_player.lounge_apple_tv_wired | device: Lounge Apple TV (WIred) | area: Living Room — conversation, google
- `media_player.nesthubd029` — media_player.nesthubd029 | device: NestHubD029 | area: Unassigned — conversation, google
- `media_player.nesthubd029_2` — media_player.nesthubd029_2 | device: Loft Display | area: Unassigned — conversation, google
- `media_player.nesthubd029_3` — media_player.nesthubd029_3 | device: NestHubD029 | area: Unassigned — conversation, google
- `media_player.orange_homepod_mini` — media_player.orange_homepod_mini | device: Orange HomePod Mini | area: Bedroom — conversation, google
- `media_player.serif_tv` — media_player.serif_tv | device: Serif TV | area: Unassigned — conversation
- `media_player.white_homepod_mini` — media_player.white_homepod_mini | device: White HomePod Mini | area: White HomePod Mini — conversation, google
- `remote.bedroom_apple_tv` — remote.bedroom_apple_tv | device: Bedroom Apple TV | area: Spare Bedroom
- `remote.core_lounge_homepod` — remote.core_lounge_homepod | device: Core Lounge HomePod | area: Living Room
- `remote.core_lounge_homepod_2` — remote.core_lounge_homepod_2 | device: Core Lounge HomePod | area: Living Room
- `remote.living_room_2` — remote.living_room_2 | device: Living Room (2) | area: Living Room (2)
- `remote.lounge_apple_tv_wired` — remote.lounge_apple_tv_wired | device: Lounge Apple TV (WIred) | area: Living Room
- `remote.orange_homepod_mini` — remote.orange_homepod_mini | device: Orange HomePod Mini | area: Bedroom
- `remote.white_homepod_mini` — remote.white_homepod_mini | device: White HomePod Mini | area: White HomePod Mini

### Covers / Shades

Count: `7`

- `cover.aqara_curtain_driver_e1` — cover.aqara_curtain_driver_e1 | device: Aqara Curtain Driver E1 | area: Unassigned — conversation, google
- `cover.aqara_curtain_driver_e1_2` — cover.aqara_curtain_driver_e1_2 | device: Aqara Curtain Driver E1 | area: Unassigned — conversation, google
- `cover.aqara_curtain_driver_e1_3` — cover.aqara_curtain_driver_e1_3 | device: Aqara Curtain Driver E1 | area: Unassigned — conversation, google
- `cover.aqara_curtain_driver_e1_4` — cover.aqara_curtain_driver_e1_4 | device: Aqara Curtain Driver E1 | area: Unassigned — conversation, google
- `cover.roller_shade_0a` — cover.roller_shade_0a | device: Roller Shade 0A | area: Unassigned — conversation, google
- `cover.roller_shade_2a` — cover.roller_shade_2a | device: Roller Shade 2A | area: Unassigned — conversation, google
- `cover.roller_shade_84` — cover.roller_shade_84 | device: Roller Shade 84 | area: Unassigned — conversation, google

### Switches / Buttons / Selectors

Count: `71`

- `button.absence_for_3mins_dining_zone_identify` — Identify | device: Absence for 3mins dining zone | area: Unassigned — diagnostic
- `button.absence_for_3mins_dining_zone_identify_2` — Identify | device: Absence for 3mins dining zone | area: Unassigned — diagnostic
- `button.absence_for_3mins_kitchen_zone_identify` — Identify | device: Absence for 3mins kitchen zone | area: Unassigned — diagnostic
- `button.absence_for_3mins_kitchen_zone_identify_2` — Identify | device: Absence for 3mins kitchen zone | area: Unassigned — diagnostic
- `button.absence_for_3mins_living_zone_identify` — Identify | device: Absence for 3mins living zone | area: Unassigned — diagnostic
- `button.absence_for_3mins_living_zone_identify_2` — Identify | device: Absence for 3mins living zone | area: Unassigned — diagnostic
- `button.absence_for_5mins_openplan_identify` — Identify | device: Absence for 5mins Openplan | area: Unassigned — diagnostic
- `button.absence_for_5mins_openplan_identify_2` — Identify | device: Absence for 5mins Openplan | area: Unassigned — diagnostic
- `button.approaching_openplan_room_identify` — Identify | device: Approaching Openplan room | area: Unassigned — diagnostic
- `button.approaching_openplan_room_identify_2` — Identify | device: Approaching Openplan room | area: Unassigned — diagnostic
- `button.aqara_curtain_driver_e1_identify` — Identify | device: Aqara Curtain Driver E1 | area: Unassigned — diagnostic
- `button.aqara_curtain_driver_e1_identify_2` — Identify | device: Aqara Curtain Driver E1 | area: Unassigned — diagnostic
- `button.aqara_curtain_driver_e1_identify_3` — Identify | device: Aqara Curtain Driver E1 | area: Unassigned — diagnostic
- `button.aqara_curtain_driver_e1_identify_4` — Identify | device: Aqara Curtain Driver E1 | area: Unassigned — diagnostic
- `button.aqara_door_and_window_sensor_identify` — Identify | device: Aqara Door and Window Sensor | area: Unassigned — diagnostic
- `button.aqara_door_and_window_sensor_identify_10` — Identify | device: Aqara Door and Window Sensor | area: Unassigned — diagnostic
- `button.aqara_door_and_window_sensor_identify_11` — Identify | device: Aqara Door and Window Sensor | area: Unassigned — diagnostic
- `button.aqara_door_and_window_sensor_identify_12` — Identify | device: Aqara Door and Window Sensor | area: Unassigned — diagnostic
- `button.aqara_door_and_window_sensor_identify_13` — Identify | device: Aqara Door and Window Sensor | area: Unassigned — diagnostic
- `button.aqara_door_and_window_sensor_identify_14` — Identify | device: Aqara Door and Window Sensor | area: Unassigned — diagnostic
- `button.aqara_door_and_window_sensor_identify_2` — Identify | device: Aqara Door and Window Sensor | area: Unassigned — diagnostic
- `button.aqara_door_and_window_sensor_identify_3` — Identify | device: Aqara Door and Window Sensor | area: Unassigned — diagnostic
- `button.aqara_door_and_window_sensor_identify_4` — Identify | device: Aqara Door and Window Sensor | area: Unassigned — diagnostic
- `button.aqara_door_and_window_sensor_identify_5` — Identify | device: Aqara Door and Window Sensor | area: Unassigned — diagnostic
- `button.aqara_door_and_window_sensor_identify_6` — Identify | device: Aqara Door and Window Sensor | area: Unassigned — diagnostic
- `button.aqara_door_and_window_sensor_identify_7` — Identify | device: Aqara Door and Window Sensor | area: Unassigned — diagnostic
- `button.aqara_door_and_window_sensor_identify_8` — Identify | device: Aqara Door and Window Sensor | area: Unassigned — diagnostic
- `button.aqara_door_and_window_sensor_identify_9` — Identify | device: Aqara Door and Window Sensor | area: Unassigned — diagnostic
- `button.aqara_hub_m3_identify` — Identify | device: Aqara Hub M3 | area: Unassigned — diagnostic
- `button.aqara_hub_m3_identify_2` — Identify | device: Aqara Hub M3 | area: Unassigned — diagnostic
- `button.aqara_motion_sensor_p1_identify` — Identify | device: Aqara Motion Sensor P1 | area: Unassigned — diagnostic
- `button.aqara_motion_sensor_p1_identify_2` — Identify | device: Aqara Motion Sensor P1 | area: Unassigned — diagnostic
- `button.aqara_motion_sensor_p1_identify_3` — Identify | device: Aqara Motion Sensor P1 | area: Unassigned — diagnostic
- `button.aqara_motion_sensor_p1_identify_4` — Identify | device: Aqara Motion Sensor P1 | area: Unassigned — diagnostic
- `button.aqara_presence_sensor_fp1e_identify` — Identify | device: Aqara Presence Sensor FP1E | area: Unassigned — diagnostic
- `button.aqara_presence_sensor_fp1e_identify_2` — Identify | device: Aqara Presence Sensor FP1E | area: Unassigned — diagnostic
- `button.aqara_presence_sensor_fp1e_identify_3` — Identify | device: Aqara Presence Sensor FP1E | area: Unassigned — diagnostic
- `button.aqara_presence_sensor_fp1e_identify_4` — Identify | device: Aqara Presence Sensor FP1E | area: Unassigned — diagnostic
- `button.aqara_vibration_sensor_identify` — Identify | device: Aqara Vibration Sensor | area: Unassigned — diagnostic
- `button.aqara_vibration_sensor_identify_2` — Identify | device: Aqara Vibration Sensor | area: Unassigned — diagnostic
- `button.aqara_wireless_remote_switch_identify` — Identify | device: Aqara Wireless Remote Switch | area: Unassigned — diagnostic
- `button.aqara_wireless_remote_switch_identify_2` — Identify | device: Aqara Wireless Remote Switch | area: Unassigned — diagnostic
- `button.aqara_wireless_remote_switch_identify_3` — Identify | device: Aqara Wireless Remote Switch | area: Unassigned — diagnostic
- `button.aqara_wireless_remote_switch_identify_4` — Identify | device: Aqara Wireless Remote Switch | area: Unassigned — diagnostic
- `button.beta_bedroom_no_presence_3mins_identify` — Identify | device: Beta bedroom no presence 3mins | area: Unassigned — diagnostic
- `button.beta_bedroom_no_presence_3mins_identify_2` — Identify | device: Beta bedroom no presence 3mins | area: Unassigned — diagnostic
- `button.beta_bedroom_presence_detected_identify` — Identify | device: Beta bedroom presence detected | area: Unassigned — diagnostic
- `button.beta_bedroom_presence_detected_identify_2` — Identify | device: Beta bedroom presence detected | area: Unassigned — diagnostic
- `button.presence_dining_zone_identify` — Identify | device: Presence Dining zone | area: Unassigned — diagnostic
- `button.presence_dining_zone_identify_2` — Identify | device: Presence Dining zone | area: Unassigned — diagnostic
- `button.presence_kitchen_zone_identify` — Identify | device: Presence kitchen zone | area: Unassigned — diagnostic
- `button.presence_kitchen_zone_identify_2` — Identify | device: Presence kitchen zone | area: Unassigned — diagnostic
- `button.presence_living_zone_identify` — Identify | device: Presence living zone | area: Unassigned — diagnostic
- `button.presence_living_zone_identify_2` — Identify | device: Presence living zone | area: Unassigned — diagnostic
- `button.switchbot_hub_3_identify` — Identify | device: SwitchBot Hub 3 | area: Unassigned — diagnostic
- `button.wiz_a60_filament_identify` — Identify | device: WiZ A60 Filament | area: Unassigned — diagnostic
- `input_boolean.test_mode` — Test Mode | device: none | area: Unassigned
- `number.wiz_a60_filament_off_transition_time` — Off transition time | device: WiZ A60 Filament | area: Unassigned — config
- `number.wiz_a60_filament_on_level` — On level | device: WiZ A60 Filament | area: Unassigned — config
- `number.wiz_a60_filament_on_off_transition_time` — On/off transition time | device: WiZ A60 Filament | area: Unassigned — config
- `number.wiz_a60_filament_on_transition_time` — On transition time | device: WiZ A60 Filament | area: Unassigned — config
- `select.wiz_a60_filament_power_on_behaviour_on_startup` — Power-on behaviour on startup | device: WiZ A60 Filament | area: Unassigned — config
- `switch.automation_alpha_bedroom_dial_switch` — Automation: Alpha Bedroom Dial Switch | device: Hue Bridge Pro | area: Laundry/Utilities — config
- `switch.automation_hue_smart_button_3` — Automation: Hue smart button 3 | device: Hue Bridge Pro | area: Laundry/Utilities — config
- `switch.bot_4a` — switch.bot_4a | device: Bot 4A | area: Unassigned — conversation, google
- `switch.core_300s_child_lock` — Child lock | device: Core 300S | area: Bedroom — conversation, google
- `switch.core_300s_display` — Display | device: Core 300S | area: Bedroom — conversation, google
- `switch.hue_motion_sensor_light_sensor_enabled` — Light sensor enabled | device: Hue Motion Sensor | area: Spare Bedroom — config
- `switch.hue_motion_sensor_light_sensor_enabled_2` — Light sensor enabled | device: Hue Motion Sensor | area: Ensuite (Throne) Bathroom — config
- `switch.hue_motion_sensor_motion_sensor_enabled` — Motion sensor enabled | device: Hue Motion Sensor | area: Spare Bedroom — config
- `switch.hue_motion_sensor_motion_sensor_enabled_2` — Motion sensor enabled | device: Hue Motion Sensor | area: Ensuite (Throne) Bathroom — config

### Scenes

Count: `13`

- `scene.bedroom_concentrate` — Concentrate | device: Bedroom | area: Bedroom (Alpha) — conversation, google
- `scene.bedroom_dimmed` — Dimmed | device: Bedroom | area: Bedroom (Alpha) — conversation, google
- `scene.bedroom_energise` — Energise | device: Bedroom | area: Bedroom (Alpha) — conversation, google
- `scene.bedroom_nightlight` — Nightlight | device: Bedroom | area: Bedroom (Alpha) — conversation, google
- `scene.bedroom_read` — Read | device: Bedroom | area: Bedroom (Alpha) — conversation, google
- `scene.bedroom_relax` — Relax | device: Bedroom | area: Bedroom (Alpha) — conversation, google
- `scene.bedroom_sleepy` — Sleepy | device: Bedroom | area: Bedroom (Alpha) — conversation, google
- `scene.hallway_concentrate` — Concentrate | device: Hallway | area: Hallway (Pass) — conversation, google
- `scene.hallway_energise` — Energise | device: Hallway | area: Hallway (Pass) — conversation, google
- `scene.hallway_nightlight` — Nightlight | device: Hallway | area: Hallway (Pass) — conversation, google
- `scene.hallway_read` — Read | device: Hallway | area: Hallway (Pass) — conversation, google
- `scene.hallway_relax` — Relax | device: Hallway | area: Hallway (Pass) — conversation, google
- `scene.new_scene` — New scene | device: none | area: Unassigned — conversation, google

### Sensors

Count: `292`

- `sensor.alpha_bed_zone_ceiling_2_zigbee_connectivity` — Zigbee connectivity | device: Alphabed Ceiling Light.5 | area: Bedroom (Alpha) — disabled:integration, diagnostic
- `sensor.alpha_bedroom_dial_switch_battery` — Battery | device: Alpha Bedroom Dial Switch | area: Bedroom (Alpha) — diagnostic
- `sensor.alpha_bedroom_dial_switch_zigbee_connectivity` — Zigbee connectivity | device: Alpha Bedroom Dial Switch | area: Bedroom (Alpha) — disabled:integration, diagnostic
- `sensor.alpha_bedroom_hue_smart_button_zigbee_connectivity` — Zigbee connectivity | device: Alpha Hue Smart Button | area: Bedroom (Alpha) — disabled:integration, diagnostic
- `sensor.alpha_hue_smart_button_battery` — Battery | device: Alpha Hue Smart Button | area: Bedroom (Alpha) — diagnostic
- `sensor.alpha_pass_ceiling_zigbee_connectivity` — Zigbee connectivity | device: Pass Ceiling Light.5 | area: Hallway (Pass) — disabled:integration, diagnostic
- `sensor.aqara_curtain_driver_e1_battery` — Battery | device: Aqara Curtain Driver E1 | area: Unassigned — diagnostic
- `sensor.aqara_curtain_driver_e1_battery_2` — Battery | device: Aqara Curtain Driver E1 | area: Unassigned — diagnostic
- `sensor.aqara_curtain_driver_e1_battery_3` — Battery | device: Aqara Curtain Driver E1 | area: Unassigned — diagnostic
- `sensor.aqara_curtain_driver_e1_battery_4` — Battery | device: Aqara Curtain Driver E1 | area: Unassigned — diagnostic
- `sensor.aqara_curtain_driver_e1_battery_charge_state` — Battery charge state | device: Aqara Curtain Driver E1 | area: Unassigned — diagnostic
- `sensor.aqara_curtain_driver_e1_battery_charge_state_2` — Battery charge state | device: Aqara Curtain Driver E1 | area: Unassigned — diagnostic
- `sensor.aqara_curtain_driver_e1_battery_charge_state_3` — Battery charge state | device: Aqara Curtain Driver E1 | area: Unassigned — diagnostic
- `sensor.aqara_curtain_driver_e1_battery_charge_state_4` — Battery charge state | device: Aqara Curtain Driver E1 | area: Unassigned — diagnostic
- `sensor.aqara_curtain_driver_e1_battery_voltage` — Battery voltage | device: Aqara Curtain Driver E1 | area: Unassigned — diagnostic
- `sensor.aqara_curtain_driver_e1_battery_voltage_2` — Battery voltage | device: Aqara Curtain Driver E1 | area: Unassigned — diagnostic
- `sensor.aqara_curtain_driver_e1_battery_voltage_3` — Battery voltage | device: Aqara Curtain Driver E1 | area: Unassigned — diagnostic
- `sensor.aqara_curtain_driver_e1_battery_voltage_4` — Battery voltage | device: Aqara Curtain Driver E1 | area: Unassigned — diagnostic
- `sensor.aqara_curtain_driver_e1_target_opening_position` — Target opening position | device: Aqara Curtain Driver E1 | area: Unassigned — disabled:integration, diagnostic
- `sensor.aqara_curtain_driver_e1_target_opening_position_2` — Target opening position | device: Aqara Curtain Driver E1 | area: Unassigned — disabled:integration, diagnostic
- `sensor.aqara_curtain_driver_e1_target_opening_position_3` — Target opening position | device: Aqara Curtain Driver E1 | area: Unassigned — disabled:integration, diagnostic
- `sensor.aqara_curtain_driver_e1_target_opening_position_4` — Target opening position | device: Aqara Curtain Driver E1 | area: Unassigned — disabled:integration, diagnostic
- `sensor.aqara_door_and_window_sensor_battery` — Battery | device: Aqara Door and Window Sensor | area: Unassigned — diagnostic
- `sensor.aqara_door_and_window_sensor_battery_10` — Battery | device: Aqara Door and Window Sensor | area: Unassigned — diagnostic
- `sensor.aqara_door_and_window_sensor_battery_11` — Battery | device: Aqara Door and Window Sensor | area: Unassigned — diagnostic
- `sensor.aqara_door_and_window_sensor_battery_12` — Battery | device: Aqara Door and Window Sensor | area: Unassigned — diagnostic
- `sensor.aqara_door_and_window_sensor_battery_13` — Battery | device: Aqara Door and Window Sensor | area: Unassigned — diagnostic
- `sensor.aqara_door_and_window_sensor_battery_14` — Battery | device: Aqara Door and Window Sensor | area: Unassigned — diagnostic
- `sensor.aqara_door_and_window_sensor_battery_2` — Battery | device: Aqara Door and Window Sensor | area: Unassigned — diagnostic
- `sensor.aqara_door_and_window_sensor_battery_3` — Battery | device: Aqara Door and Window Sensor | area: Unassigned — diagnostic
- `sensor.aqara_door_and_window_sensor_battery_4` — Battery | device: Aqara Door and Window Sensor | area: Unassigned — diagnostic
- `sensor.aqara_door_and_window_sensor_battery_5` — Battery | device: Aqara Door and Window Sensor | area: Unassigned — diagnostic
- `sensor.aqara_door_and_window_sensor_battery_6` — Battery | device: Aqara Door and Window Sensor | area: Unassigned — diagnostic
- `sensor.aqara_door_and_window_sensor_battery_7` — Battery | device: Aqara Door and Window Sensor | area: Unassigned — diagnostic
- `sensor.aqara_door_and_window_sensor_battery_8` — Battery | device: Aqara Door and Window Sensor | area: Unassigned — diagnostic
- `sensor.aqara_door_and_window_sensor_battery_9` — Battery | device: Aqara Door and Window Sensor | area: Unassigned — diagnostic
- `sensor.aqara_door_and_window_sensor_battery_type` — Battery type | device: Aqara Door and Window Sensor | area: Unassigned — diagnostic
- `sensor.aqara_door_and_window_sensor_battery_type_10` — Battery type | device: Aqara Door and Window Sensor | area: Unassigned — diagnostic
- `sensor.aqara_door_and_window_sensor_battery_type_11` — Battery type | device: Aqara Door and Window Sensor | area: Unassigned — diagnostic
- `sensor.aqara_door_and_window_sensor_battery_type_12` — Battery type | device: Aqara Door and Window Sensor | area: Unassigned — diagnostic
- `sensor.aqara_door_and_window_sensor_battery_type_13` — Battery type | device: Aqara Door and Window Sensor | area: Unassigned — diagnostic
- `sensor.aqara_door_and_window_sensor_battery_type_14` — Battery type | device: Aqara Door and Window Sensor | area: Unassigned — diagnostic
- `sensor.aqara_door_and_window_sensor_battery_type_2` — Battery type | device: Aqara Door and Window Sensor | area: Unassigned — diagnostic
- `sensor.aqara_door_and_window_sensor_battery_type_3` — Battery type | device: Aqara Door and Window Sensor | area: Unassigned — diagnostic
- `sensor.aqara_door_and_window_sensor_battery_type_4` — Battery type | device: Aqara Door and Window Sensor | area: Unassigned — diagnostic
- `sensor.aqara_door_and_window_sensor_battery_type_5` — Battery type | device: Aqara Door and Window Sensor | area: Unassigned — diagnostic
- `sensor.aqara_door_and_window_sensor_battery_type_6` — Battery type | device: Aqara Door and Window Sensor | area: Unassigned — diagnostic
- `sensor.aqara_door_and_window_sensor_battery_type_7` — Battery type | device: Aqara Door and Window Sensor | area: Unassigned — diagnostic
- `sensor.aqara_door_and_window_sensor_battery_type_8` — Battery type | device: Aqara Door and Window Sensor | area: Unassigned — diagnostic
- `sensor.aqara_door_and_window_sensor_battery_type_9` — Battery type | device: Aqara Door and Window Sensor | area: Unassigned — diagnostic
- `sensor.aqara_door_and_window_sensor_battery_voltage` — Battery voltage | device: Aqara Door and Window Sensor | area: Unassigned — diagnostic
- `sensor.aqara_door_and_window_sensor_battery_voltage_10` — Battery voltage | device: Aqara Door and Window Sensor | area: Unassigned — diagnostic
- `sensor.aqara_door_and_window_sensor_battery_voltage_11` — Battery voltage | device: Aqara Door and Window Sensor | area: Unassigned — diagnostic
- `sensor.aqara_door_and_window_sensor_battery_voltage_12` — Battery voltage | device: Aqara Door and Window Sensor | area: Unassigned — diagnostic
- `sensor.aqara_door_and_window_sensor_battery_voltage_13` — Battery voltage | device: Aqara Door and Window Sensor | area: Unassigned — diagnostic
- `sensor.aqara_door_and_window_sensor_battery_voltage_14` — Battery voltage | device: Aqara Door and Window Sensor | area: Unassigned — diagnostic
- `sensor.aqara_door_and_window_sensor_battery_voltage_2` — Battery voltage | device: Aqara Door and Window Sensor | area: Unassigned — diagnostic
- `sensor.aqara_door_and_window_sensor_battery_voltage_3` — Battery voltage | device: Aqara Door and Window Sensor | area: Unassigned — diagnostic
- `sensor.aqara_door_and_window_sensor_battery_voltage_4` — Battery voltage | device: Aqara Door and Window Sensor | area: Unassigned — diagnostic
- `sensor.aqara_door_and_window_sensor_battery_voltage_5` — Battery voltage | device: Aqara Door and Window Sensor | area: Unassigned — diagnostic
- `sensor.aqara_door_and_window_sensor_battery_voltage_6` — Battery voltage | device: Aqara Door and Window Sensor | area: Unassigned — diagnostic
- `sensor.aqara_door_and_window_sensor_battery_voltage_7` — Battery voltage | device: Aqara Door and Window Sensor | area: Unassigned — diagnostic
- `sensor.aqara_door_and_window_sensor_battery_voltage_8` — Battery voltage | device: Aqara Door and Window Sensor | area: Unassigned — diagnostic
- `sensor.aqara_door_and_window_sensor_battery_voltage_9` — Battery voltage | device: Aqara Door and Window Sensor | area: Unassigned — diagnostic
- `sensor.aqara_motion_sensor_p1_battery` — Battery | device: Aqara Motion Sensor P1 | area: Unassigned — diagnostic
- `sensor.aqara_motion_sensor_p1_battery_2` — Battery | device: Aqara Motion Sensor P1 | area: Unassigned — diagnostic
- `sensor.aqara_motion_sensor_p1_battery_3` — Battery | device: Aqara Motion Sensor P1 | area: Unassigned — diagnostic
- `sensor.aqara_motion_sensor_p1_battery_4` — Battery | device: Aqara Motion Sensor P1 | area: Unassigned — diagnostic
- `sensor.aqara_motion_sensor_p1_battery_type` — Battery type | device: Aqara Motion Sensor P1 | area: Unassigned — diagnostic
- `sensor.aqara_motion_sensor_p1_battery_type_2` — Battery type | device: Aqara Motion Sensor P1 | area: Unassigned — diagnostic
- `sensor.aqara_motion_sensor_p1_battery_type_3` — Battery type | device: Aqara Motion Sensor P1 | area: Unassigned — diagnostic
- `sensor.aqara_motion_sensor_p1_battery_type_4` — Battery type | device: Aqara Motion Sensor P1 | area: Unassigned — diagnostic
- `sensor.aqara_motion_sensor_p1_battery_voltage` — Battery voltage | device: Aqara Motion Sensor P1 | area: Unassigned — diagnostic
- `sensor.aqara_motion_sensor_p1_battery_voltage_2` — Battery voltage | device: Aqara Motion Sensor P1 | area: Unassigned — diagnostic
- `sensor.aqara_motion_sensor_p1_battery_voltage_3` — Battery voltage | device: Aqara Motion Sensor P1 | area: Unassigned — diagnostic
- `sensor.aqara_motion_sensor_p1_battery_voltage_4` — Battery voltage | device: Aqara Motion Sensor P1 | area: Unassigned — diagnostic
- `sensor.aqara_vibration_sensor_battery` — Battery | device: Aqara Vibration Sensor | area: Unassigned — diagnostic
- `sensor.aqara_vibration_sensor_battery_2` — Battery | device: Aqara Vibration Sensor | area: Unassigned — diagnostic
- `sensor.aqara_vibration_sensor_battery_type` — Battery type | device: Aqara Vibration Sensor | area: Unassigned — diagnostic
- `sensor.aqara_vibration_sensor_battery_type_2` — Battery type | device: Aqara Vibration Sensor | area: Unassigned — diagnostic
- `sensor.aqara_vibration_sensor_battery_voltage` — Battery voltage | device: Aqara Vibration Sensor | area: Unassigned — diagnostic
- `sensor.aqara_vibration_sensor_battery_voltage_2` — Battery voltage | device: Aqara Vibration Sensor | area: Unassigned — diagnostic
- `sensor.aqara_wireless_remote_switch_battery` — Battery | device: Aqara Wireless Remote Switch | area: Unassigned — diagnostic
- `sensor.aqara_wireless_remote_switch_battery_2` — Battery | device: Aqara Wireless Remote Switch | area: Unassigned — diagnostic
- `sensor.aqara_wireless_remote_switch_battery_type` — Battery type | device: Aqara Wireless Remote Switch | area: Unassigned — diagnostic
- `sensor.aqara_wireless_remote_switch_battery_type_2` — Battery type | device: Aqara Wireless Remote Switch | area: Unassigned — diagnostic
- `sensor.aqara_wireless_remote_switch_battery_voltage` — Battery voltage | device: Aqara Wireless Remote Switch | area: Unassigned — diagnostic
- `sensor.aqara_wireless_remote_switch_battery_voltage_2` — Battery voltage | device: Aqara Wireless Remote Switch | area: Unassigned — diagnostic
- `sensor.aqara_wireless_remote_switch_current_switch_position` — Current switch position | device: Aqara Wireless Remote Switch | area: Unassigned — disabled:integration, diagnostic
- `sensor.aqara_wireless_remote_switch_current_switch_position_2` — Current switch position | device: Aqara Wireless Remote Switch | area: Unassigned — disabled:integration, diagnostic
- `sensor.aqara_wireless_remote_switch_current_switch_position_3` — Current switch position | device: Aqara Wireless Remote Switch | area: Unassigned — disabled:integration, diagnostic
- `sensor.aqara_wireless_remote_switch_current_switch_position_4` — Current switch position | device: Aqara Wireless Remote Switch | area: Unassigned — disabled:integration, diagnostic
- `sensor.backup_backup_manager_state` — Backup Manager state | device: Backup | area: Unassigned
- `sensor.backup_last_attempted_automatic_backup` — Last attempted automatic backup | device: Backup | area: Unassigned
- `sensor.backup_last_successful_automatic_backup` — Last successful automatic backup | device: Backup | area: Unassigned
- `sensor.backup_next_scheduled_automatic_backup` — Next scheduled automatic backup | device: Backup | area: Unassigned
- `sensor.bathroom2_hue_motion_sensor_zigbee_connectivity` — Zigbee connectivity | device: Hue Motion Sensor | area: Spare Bedroom — disabled:integration, diagnostic
- `sensor.bathroom_dimmer_switch_battery` — Battery | device: Bathroom dimmer switch | area: Ensuite (Throne) Bathroom — diagnostic
- `sensor.bathroom_illuminance` — Illuminance | device: Bathroom | area: My Bathroom
- `sensor.bed1_zigbee_connectivity` — Zigbee connectivity | device: Alphabed Ceiling Light.5 | area: Bedroom (Alpha) — disabled:integration, diagnostic
- `sensor.bed3_zigbee_connectivity` — Zigbee connectivity | device: Alphabed Ceiling Light.3 | area: Bedroom (Alpha) — disabled:integration, diagnostic
- `sensor.beige_ola_spotlight_lamp_zigbee_connectivity` — Zigbee connectivity | device: Beige Ola Spotlight Lamp | area: Living Room — disabled:integration, diagnostic
- `sensor.beta_bed_lightstrip_zigbee_connectivity` — Zigbee connectivity | device: Beta Bed Lightstrip | area: Spare Bedroom — disabled:integration, diagnostic
- `sensor.beta_bedroom_hue_dial_switch_zigbee_connectivity` — Zigbee connectivity | device: Hallway Tap Dial Switch | area: Spare Bedroom — disabled:integration, diagnostic
- `sensor.beta_ceiling_light_3_zigbee_connectivity` — Zigbee connectivity | device: Beta Ceiling Light.3 | area: Spare Bedroom — disabled:integration, diagnostic
- `sensor.beta_ceiling_light_4_zigbee_connectivity` — Zigbee connectivity | device: Beta Ceiling Light.4 | area: Spare Bedroom — disabled:integration, diagnostic
- `sensor.beta_ceiling_light_6_zigbee_connectivity` — Zigbee connectivity | device: Beta Ceiling Light.6 | area: Spare Bedroom — disabled:integration, diagnostic
- `sensor.beta_ceiling_light_zigbee_connectivity` — Zigbee connectivity | device: Beta Ceiling Light.3 | area: Spare Bedroom — disabled:integration, diagnostic
- `sensor.beta_flex_ceiling_light_1_zigbee_connectivity` — Zigbee connectivity | device: Betaflex Ceiling Light.1 | area: Spare Bedroom — disabled:integration, diagnostic
- `sensor.beta_flex_ceiling_light_2_zigbee_connectivity` — Zigbee connectivity | device: Betaflex Ceiling Light.2 | area: Spare Bedroom — disabled:integration, diagnostic
- `sensor.beta_pass_ceiling_zigbee_connectivity` — Zigbee connectivity | device: Pass Ceiling Light.1  | area: Hallway (Pass) — disabled:integration, diagnostic
- `sensor.betaflex_lower_shelf_zigbee_connectivity` — Zigbee connectivity | device: Ikea Skytrax Light | area: Bedroom — disabled:integration, diagnostic
- `sensor.bot_4a_battery` — Battery | device: Bot 4A | area: Unassigned — diagnostic
- `sensor.ceiling_bedroom1_bed4_zigbee_connectivity` — Zigbee connectivity | device: Alpha Ceiling Light.4 | area: Bedroom (Alpha) — disabled:integration, diagnostic
- `sensor.ceiling_bedroom1_closet_zone_zigbee_connectivity` — Zigbee connectivity | device: core ceiling.3 | area: Bedroom (Alpha) — disabled:integration, diagnostic
- `sensor.ceiling_bedroom1_door_zone_zigbee_connectivity` — Zigbee connectivity | device: Alpha Ceiling Light.6 | area: Bedroom (Alpha) — disabled:integration, diagnostic
- `sensor.ceiling_ensuite_bathroom_zigbee_connectivity` — Zigbee connectivity | device: Throne Ceiling above sink | area: Ensuite (Throne) Bathroom — disabled:integration, diagnostic
- `sensor.ceiling_ensuite_bathroom_zigbee_connectivity_2` — Zigbee connectivity | device: Throne Ceiling above Door | area: Ensuite (Throne) Bathroom — disabled:integration, diagnostic
- `sensor.ceiling_ensuite_bathroom_zigbee_connectivity_3` — Zigbee connectivity | device: Throne Ceiling above shower door | area: Ensuite (Throne) Bathroom — disabled:integration, diagnostic
- `sensor.ceiling_ensuite_bathroom_zigbee_connectivity_4` — Zigbee connectivity | device: Throne Ceiling Light.3 | area: Ensuite (Throne) Bathroom — disabled:integration, diagnostic
- `sensor.ceiling_kitchen_fridge_zigbee_connectivity` — Zigbee connectivity | device: Core Ceiling Light.9 | area: Core_kitchen — disabled:integration, diagnostic
- `sensor.ceiling_kitchen_sink_zigbee_connectivity` — Zigbee connectivity | device: Core Ceiling Light.10 | area: Openplan (Core) — disabled:integration, diagnostic
- `sensor.ceiling_op_br_zigbee_connectivity` — Zigbee connectivity | device: Core Ceiling Light.8 | area: Openplan (Core) — disabled:integration, diagnostic
- `sensor.ceiling_op_north_wall_zone_a1b_zigbee_connectivity` — Zigbee connectivity | device: Core Ceiling Light.1 | area: Openplan (Core) — disabled:integration, diagnostic
- `sensor.ceiling_op_north_wall_zone_zigbee_connectivity` — Zigbee connectivity | device: Core Ceiling Light.2 | area: Openplan (Core) — disabled:integration, diagnostic
- `sensor.ceiling_op_south_zigbee_connectivity` — Zigbee connectivity | device: Core Ceiling Light.5 | area: Living Room — disabled:integration, diagnostic
- `sensor.ceiling_open_plan_east_zigbee_connectivity` — Zigbee connectivity | device: Core Ceiling Light.5 | area: Openplan (Core) — disabled:integration, diagnostic
- `sensor.ceiling_open_plan_mm_zigbee_connectivity` — Zigbee connectivity | device: Core Ceiling Light.6 | area: Openplan (Core) — disabled:integration, diagnostic
- `sensor.ceiling_open_plan_mr_zigbee_connectivity` — Zigbee connectivity | device: Core Ceiling Light.4 | area: Openplan (Core) — disabled:integration, diagnostic
- `sensor.ceiling_open_plan_se_zigbee_connectivity` — Zigbee connectivity | device: Core Ceiling Light.4 | area: Openplan (Core) — disabled:integration, diagnostic
- `sensor.chaos_laundry_ceiling_zigbee_connectivity` — Zigbee connectivity | device: Laundry (Chaos) Ceiling Light | area: Laundry/Utilities — disabled:integration, diagnostic
- `sensor.chaos_storage_ceiling_zigbee_connectivity` — Zigbee connectivity | device: White (E27) Hue Bulb | area: Laundry/Utilities — disabled:integration, diagnostic
- `sensor.chaos_vault_ceiling_zigbee_connectivity` — Zigbee connectivity | device: Pass Ceiling Light.1 | area: Hallway (Pass) — disabled:integration, diagnostic
- `sensor.core_300s_air_quality` — Air quality | device: Core 300S | area: Bedroom
- `sensor.core_300s_filter_lifetime` — Filter lifetime | device: Core 300S | area: Bedroom — diagnostic
- `sensor.core_300s_pm2_5` — PM2.5 | device: Core 300S | area: Bedroom — conversation, google
- `sensor.core_hue_tap_dial_switch_zigbee_connectivity` — Zigbee connectivity | device: Core Tap Dial Light Switch | area: Openplan (Core) — disabled:integration, diagnostic
- `sensor.core_signe_floor_lamp_zigbee_connectivity` — Zigbee connectivity | device: Hue Signe White Gradient Floor Lamp.1 | area: Openplan (Core) — disabled:integration, diagnostic
- `sensor.core_tap_dial_light_switch_battery` — Battery | device: Core Tap Dial Light Switch | area: Openplan (Core) — diagnostic
- `sensor.core_vault_ceiling_zigbee_connectivity` — Zigbee connectivity | device: Pass Ceiling Light.4 | area: Hallway (Pass) — disabled:integration, diagnostic
- `sensor.hallway_dimmer_switch_battery` — Battery | device: Hallway Dimmer Switch | area: Hallway (Pass) — diagnostic
- `sensor.hallway_tap_dial_switch_battery` — Battery | device: Hallway Tap Dial Switch | area: Spare Bedroom — diagnostic
- `sensor.hub_3_button_1_current_switch_position` — Current switch position | device: Hub 3 Button 1 | area: Unassigned — disabled:integration, diagnostic
- `sensor.hub_3_button_2_current_switch_position` — Current switch position | device: Hub 3 Button 2 | area: Unassigned — disabled:integration, diagnostic
- `sensor.hub_3_button_3_current_switch_position` — Current switch position | device: Hub 3 Button 3 | area: Unassigned — disabled:integration, diagnostic
- `sensor.hub_3_humisensor_humidity` — Humidity | device: Hub 3 HumiSensor | area: Unassigned — conversation, google
- `sensor.hub_3_tempsensor_temperature` — Temperature | device: Hub 3 TempSensor | area: Unassigned — conversation, google
- `sensor.hue_bridge_pro_zigbee_connectivity` — Zigbee connectivity | device: Hue Bridge Pro | area: Laundry/Utilities — disabled:integration, diagnostic
- `sensor.hue_color_candle_1_zigbee_connectivity` — Zigbee connectivity | device: Right Bedside Lamp | area: Bedroom — disabled:integration, diagnostic
- `sensor.hue_color_lamp_1_zigbee_connectivity` — Zigbee connectivity | device: Ola Whitborg XL Floor Lamp | area: Unassigned — disabled:integration, diagnostic
- `sensor.hue_color_lamp_1_zigbee_connectivity_2` — Zigbee connectivity | device: fado glass globe lamp | area: Unassigned — disabled:integration, diagnostic
- `sensor.hue_dimmer_switch_4_zigbee_connectivity` — Zigbee connectivity | device: Hallway Dimmer Switch | area: Hallway (Pass) — disabled:integration, diagnostic
- `sensor.hue_essential_spot_1_zigbee_connectivity` — Zigbee connectivity | device: Nymane 3-spot Lamp - Mid | area: Unassigned — disabled:integration, diagnostic
- `sensor.hue_essential_spot_2_zigbee_connectivity` — Zigbee connectivity | device: Alpha Ceiling Light.6 | area: Bedroom — disabled:integration, diagnostic
- `sensor.hue_essential_spot_3_zigbee_connectivity` — Zigbee connectivity | device: Nyamane 3-spot Lamp - Top  | area: Unassigned — disabled:integration, diagnostic
- `sensor.hue_motion_sensor_battery` — Battery | device: Hue Motion Sensor | area: Spare Bedroom — diagnostic
- `sensor.hue_motion_sensor_battery_2` — Battery | device: Hue Motion Sensor | area: Ensuite (Throne) Bathroom — diagnostic
- `sensor.hue_motion_sensor_illuminance` — Illuminance | device: Hue Motion Sensor | area: Spare Bedroom
- `sensor.hue_motion_sensor_illuminance_2` — Illuminance | device: Hue Motion Sensor | area: Ensuite (Throne) Bathroom
- `sensor.hue_motion_sensor_temperature` — Temperature | device: Hue Motion Sensor | area: Spare Bedroom — conversation
- `sensor.hue_motion_sensor_temperature_2` — Temperature | device: Hue Motion Sensor | area: Ensuite (Throne) Bathroom — conversation
- `sensor.hue_play_1_zigbee_connectivity` — Zigbee connectivity | device: Hue Play 1 | area: Unassigned — disabled:integration, diagnostic
- `sensor.hue_play_2_zigbee_connectivity` — Zigbee connectivity | device: Hue Play 2 | area: Unassigned — disabled:integration, diagnostic
- `sensor.hue_smart_button_2_battery` — Battery | device: Hue smart button 2 | area: Unassigned — diagnostic
- `sensor.hue_smart_button_2_zigbee_connectivity` — Zigbee connectivity | device: Hue smart button 2 | area: Unassigned — disabled:integration, diagnostic
- `sensor.hue_smart_button_3_battery` — Battery | device: Hue smart button 3 | area: Unassigned — diagnostic
- `sensor.hue_smart_button_3_zigbee_connectivity` — Zigbee connectivity | device: Hue smart button 3 | area: Unassigned — disabled:integration, diagnostic
- `sensor.hue_smart_plug_1_zigbee_connectivity` — Zigbee connectivity | device: Hue smart plug 1 | area: Unassigned — disabled:integration, diagnostic
- `sensor.iphone_16pro_max_activity` — iPhone 16Pro Max  Activity | device: iPhone 16Pro Max  | area: Unassigned
- `sensor.iphone_16pro_max_app_version` — iPhone 16Pro Max  App Version | device: iPhone 16Pro Max  | area: Unassigned — diagnostic
- `sensor.iphone_16pro_max_audio_output` — iPhone 16Pro Max  Audio Output | device: iPhone 16Pro Max  | area: Unassigned
- `sensor.iphone_16pro_max_average_active_pace` — iPhone 16Pro Max  Average Active Pace | device: iPhone 16Pro Max  | area: Unassigned
- `sensor.iphone_16pro_max_battery_level` — iPhone 16Pro Max  Battery Level | device: iPhone 16Pro Max  | area: Unassigned
- `sensor.iphone_16pro_max_battery_state` — iPhone 16Pro Max  Battery State | device: iPhone 16Pro Max  | area: Unassigned
- `sensor.iphone_16pro_max_bssid` — iPhone 16Pro Max  BSSID | device: iPhone 16Pro Max  | area: Unassigned
- `sensor.iphone_16pro_max_connection_type` — iPhone 16Pro Max  Connection Type | device: iPhone 16Pro Max  | area: Unassigned
- `sensor.iphone_16pro_max_distance` — iPhone 16Pro Max  Distance | device: iPhone 16Pro Max  | area: Unassigned
- `sensor.iphone_16pro_max_floors_ascended` — iPhone 16Pro Max  Floors Ascended | device: iPhone 16Pro Max  | area: Unassigned
- `sensor.iphone_16pro_max_floors_descended` — iPhone 16Pro Max  Floors Descended | device: iPhone 16Pro Max  | area: Unassigned
- `sensor.iphone_16pro_max_geocoded_location` — iPhone 16Pro Max  Geocoded Location | device: iPhone 16Pro Max  | area: Unassigned
- `sensor.iphone_16pro_max_last_update_trigger` — iPhone 16Pro Max  Last Update Trigger | device: iPhone 16Pro Max  | area: Unassigned
- `sensor.iphone_16pro_max_location_permission` — iPhone 16Pro Max  Location permission | device: iPhone 16Pro Max  | area: Unassigned
- `sensor.iphone_16pro_max_sim_1` — iPhone 16Pro Max  SIM 1 | device: iPhone 16Pro Max  | area: Unassigned
- `sensor.iphone_16pro_max_sim_2` — iPhone 16Pro Max  SIM 2 | device: iPhone 16Pro Max  | area: Unassigned
- `sensor.iphone_16pro_max_ssid` — iPhone 16Pro Max  SSID | device: iPhone 16Pro Max  | area: Unassigned
- `sensor.iphone_16pro_max_steps` — iPhone 16Pro Max  Steps | device: iPhone 16Pro Max  | area: Unassigned
- `sensor.iphone_16pro_max_storage` — iPhone 16Pro Max  Storage | device: iPhone 16Pro Max  | area: Unassigned
- `sensor.jeffs_ipad_app_version` — Jeff’s iPad App Version | device: Jeff’s iPad | area: Unassigned — diagnostic
- `sensor.jeffs_ipad_audio_output` — Jeff’s iPad Audio Output | device: Jeff’s iPad | area: Unassigned
- `sensor.jeffs_ipad_battery_level` — Jeff’s iPad Battery Level | device: Jeff’s iPad | area: Unassigned
- `sensor.jeffs_ipad_battery_state` — Jeff’s iPad Battery State | device: Jeff’s iPad | area: Unassigned
- `sensor.jeffs_ipad_bssid` — Jeff’s iPad BSSID | device: Jeff’s iPad | area: Unassigned
- `sensor.jeffs_ipad_connection_type` — Jeff’s iPad Connection Type | device: Jeff’s iPad | area: Unassigned
- `sensor.jeffs_ipad_geocoded_location` — Jeff’s iPad Geocoded Location | device: Jeff’s iPad | area: Unassigned
- `sensor.jeffs_ipad_last_update_trigger` — Jeff’s iPad Last Update Trigger | device: Jeff’s iPad | area: Unassigned
- `sensor.jeffs_ipad_location_permission` — Jeff’s iPad Location permission | device: Jeff’s iPad | area: Unassigned
- `sensor.jeffs_ipad_ssid` — Jeff’s iPad SSID | device: Jeff’s iPad | area: Unassigned
- `sensor.jeffs_ipad_storage` — Jeff’s iPad Storage | device: Jeff’s iPad | area: Unassigned
- `sensor.jeffs_iphone_app_version` — Jeff’s iPhone App Version | device: Jeff’s iPhone | area: Unassigned — diagnostic
- `sensor.jeffs_iphone_audio_output` — Jeff’s iPhone Audio Output | device: Jeff’s iPhone | area: Unassigned
- `sensor.jeffs_iphone_battery_level` — Jeff’s iPhone Battery Level | device: Jeff’s iPhone | area: Unassigned
- `sensor.jeffs_iphone_battery_state` — Jeff’s iPhone Battery State | device: Jeff’s iPhone | area: Unassigned
- `sensor.jeffs_iphone_bssid` — Jeff’s iPhone BSSID | device: Jeff’s iPhone | area: Unassigned
- `sensor.jeffs_iphone_connection_type` — Jeff’s iPhone Connection Type | device: Jeff’s iPhone | area: Unassigned
- `sensor.jeffs_iphone_geocoded_location` — Jeff’s iPhone Geocoded Location | device: Jeff’s iPhone | area: Unassigned
- `sensor.jeffs_iphone_last_update_trigger` — Jeff’s iPhone Last Update Trigger | device: Jeff’s iPhone | area: Unassigned
- `sensor.jeffs_iphone_location_permission` — Jeff’s iPhone Location permission | device: Jeff’s iPhone | area: Unassigned
- `sensor.jeffs_iphone_sim_1` — Jeff’s iPhone SIM 1 | device: Jeff’s iPhone | area: Unassigned
- `sensor.jeffs_iphone_sim_2` — Jeff’s iPhone SIM 2 | device: Jeff’s iPhone | area: Unassigned
- `sensor.jeffs_iphone_ssid` — Jeff’s iPhone SSID | device: Jeff’s iPhone | area: Unassigned
- `sensor.jeffs_iphone_storage` — Jeff’s iPhone Storage | device: Jeff’s iPhone | area: Unassigned
- `sensor.klasnick_beige_table_lamp_zigbee_connectivity` — Zigbee connectivity | device: Klasnick Beige Table Lamp (with E14 Hue Colour) | area: Openplan (Core) — disabled:integration, diagnostic
- `sensor.macbook_air_active_audio_input` — MacBook Air  Active Audio Input | device: MacBook Air  | area: Unassigned
- `sensor.macbook_air_active_audio_output` — MacBook Air  Active Audio Output | device: MacBook Air  | area: Unassigned
- `sensor.macbook_air_active_camera` — MacBook Air  Active Camera | device: MacBook Air  | area: Unassigned
- `sensor.macbook_air_app_version` — MacBook Air  App Version | device: MacBook Air  | area: Unassigned — diagnostic
- `sensor.macbook_air_audio_output` — MacBook Air  Audio Output | device: MacBook Air  | area: Unassigned
- `sensor.macbook_air_bssid` — MacBook Air  BSSID | device: MacBook Air  | area: Unassigned
- `sensor.macbook_air_connection_type` — MacBook Air  Connection Type | device: MacBook Air  | area: Unassigned
- `sensor.macbook_air_displays` — MacBook Air  Displays | device: MacBook Air  | area: Unassigned
- `sensor.macbook_air_frontmost_app` — MacBook Air  Frontmost App | device: MacBook Air  | area: Unassigned
- `sensor.macbook_air_geocoded_location` — MacBook Air  Geocoded Location | device: MacBook Air  | area: Unassigned
- `sensor.macbook_air_internal_battery_level` — MacBook Air  Internal Battery Level | device: MacBook Air  | area: Unassigned
- `sensor.macbook_air_internal_battery_state` — MacBook Air  Internal Battery State | device: MacBook Air  | area: Unassigned
- `sensor.macbook_air_last_update_trigger` — MacBook Air  Last Update Trigger | device: MacBook Air  | area: Unassigned
- `sensor.macbook_air_location_permission` — MacBook Air  Location permission | device: MacBook Air  | area: Unassigned
- `sensor.macbook_air_primary_display_id` — MacBook Air  Primary Display ID | device: MacBook Air  | area: Unassigned
- `sensor.macbook_air_primary_display_name` — MacBook Air  Primary Display Name | device: MacBook Air  | area: Unassigned
- `sensor.macbook_air_ssid` — MacBook Air  SSID | device: MacBook Air  | area: Unassigned
- `sensor.macbook_air_storage` — MacBook Air  Storage | device: MacBook Air  | area: Unassigned
- `sensor.monica_vibelucci_arc_lamp_zigbee_connectivity` — Zigbee connectivity | device: Core Statement Arc Floor Lamp Monica Vibelucci | area: Openplan (Core) — disabled:integration, diagnostic
- `sensor.nymane_3_spot_lamp_low_zigbee_connectivity` — Zigbee connectivity | device: Nymane 3-spot Lamp - Low | area: Bedroom (Alpha) — disabled:integration, diagnostic
- `sensor.play_gradient_tube_1_zigbee_connectivity` — Zigbee connectivity | device: alpha gradient light-tube.1 | area: Bedroom — disabled:integration, diagnostic
- `sensor.roller_shade_0a_battery` — Battery | device: Roller Shade 0A | area: Unassigned — diagnostic
- `sensor.roller_shade_0a_target_opening_position` — Target opening position | device: Roller Shade 0A | area: Unassigned — disabled:integration, diagnostic
- `sensor.roller_shade_2a_battery` — Battery | device: Roller Shade 2A | area: Unassigned — diagnostic
- `sensor.roller_shade_2a_target_opening_position` — Target opening position | device: Roller Shade 2A | area: Unassigned — disabled:integration, diagnostic
- `sensor.roller_shade_84_battery` — Battery | device: Roller Shade 84 | area: Unassigned — diagnostic
- `sensor.roller_shade_84_target_opening_position` — Target opening position | device: Roller Shade 84 | area: Unassigned — disabled:integration, diagnostic
- `sensor.secondary_bathroom_illuminance` — Illuminance | device: Secondary Bathroom | area: Secondary Bathroom
- `sensor.signe_gradient_floor_1_zigbee_connectivity` — Zigbee connectivity | device: Signe gradient floor 1 | area: Openplan (Core) — disabled:integration, diagnostic
- `sensor.signe_gradient_table_1_zigbee_connectivity` — Zigbee connectivity | device: Signe gradient table 1 | area: Unassigned — disabled:integration, diagnostic
- `sensor.speedtest_download` — Download | device: SpeedTest | area: Parking
- `sensor.speedtest_ping` — Ping | device: SpeedTest | area: Parking
- `sensor.speedtest_upload` — Upload | device: SpeedTest | area: Parking
- `sensor.splash_bathroom_dimmer_zigbee_connectivity` — Zigbee connectivity | device: Splash Dimmer Switch | area: Secondary Bathroom — disabled:integration, diagnostic
- `sensor.splash_ceiling_light_1_zigbee_connectivity` — Zigbee connectivity | device: Splash Ceiling Light.4 | area: Secondary Bathroom — disabled:integration, diagnostic
- `sensor.splash_ceiling_light_2_zigbee_connectivity` — Zigbee connectivity | device: Splash Ceiling Light.1 | area: Secondary Bathroom — disabled:integration, diagnostic
- `sensor.splash_ceiling_light_3_zigbee_connectivity` — Zigbee connectivity | device: Splash Ceiling Light.2 | area: Secondary Bathroom — disabled:integration, diagnostic
- `sensor.splash_ceiling_light_4_zigbee_connectivity` — Zigbee connectivity | device: Splash Ceiling Light.5 | area: Secondary Bathroom — disabled:integration, diagnostic
- `sensor.splash_ceiling_light_5_zigbee_connectivity` — Zigbee connectivity | device: Splash Ceiling Light.3 | area: Secondary Bathroom — disabled:integration, diagnostic
- `sensor.splash_dimmer_switch_battery` — Battery | device: Splash Dimmer Switch | area: Secondary Bathroom — diagnostic
- `sensor.splash_pass_ceiling_zigbee_connectivity` — Zigbee connectivity | device: Pass Ceiling Light.2 | area: Hallway (Pass) — disabled:integration, diagnostic
- `sensor.sun_next_dawn` — Next dawn | device: Sun | area: Unassigned — diagnostic
- `sensor.sun_next_dusk` — Next dusk | device: Sun | area: Unassigned — diagnostic
- `sensor.sun_next_midnight` — Next midnight | device: Sun | area: Unassigned — diagnostic
- `sensor.sun_next_noon` — Next noon | device: Sun | area: Unassigned — diagnostic
- `sensor.sun_next_rising` — Next rising | device: Sun | area: Unassigned — diagnostic
- `sensor.sun_next_setting` — Next setting | device: Sun | area: Unassigned — diagnostic
- `sensor.sun_solar_azimuth` — Solar azimuth | device: Sun | area: Unassigned — disabled:integration, diagnostic
- `sensor.sun_solar_elevation` — Solar elevation | device: Sun | area: Unassigned — disabled:integration, diagnostic
- `sensor.sun_solar_rising` — Solar rising | device: Sun | area: Unassigned — disabled:integration, diagnostic
- `sensor.throne_bathroom_ceiling_zigbee_connectivity` — Zigbee connectivity | device: Bathroom dimmer switch | area: Ensuite (Throne) Bathroom — disabled:integration, diagnostic
- `sensor.throne_hue_motion_sensor_zigbee_connectivity` — Zigbee connectivity | device: Hue Motion Sensor | area: Ensuite (Throne) Bathroom — disabled:integration, diagnostic
- `sensor.withings_active_calories_burnt_today` — Active calories burnt today | device: Withings | area: Bedroom (Alpha) — disabled:user
- `sensor.withings_active_time_today` — Active time today | device: Withings | area: Bedroom (Alpha) — disabled:user
- `sensor.withings_average_heart_rate` — Average heart rate | device: Withings | area: Bedroom (Alpha) — disabled:integration
- `sensor.withings_average_respiratory_rate` — Average respiratory rate | device: Withings | area: Bedroom (Alpha) — disabled:integration
- `sensor.withings_breathing_disturbances_intensity` — Breathing disturbances intensity | device: Withings | area: Bedroom (Alpha) — disabled:integration
- `sensor.withings_deep_sleep` — Deep sleep | device: Withings | area: Bedroom (Alpha)
- `sensor.withings_distance_travelled_today` — Distance travelled today | device: Withings | area: Bedroom (Alpha) — disabled:user
- `sensor.withings_elevation_change_today` — Elevation change today | device: Withings | area: Bedroom (Alpha) — disabled:user
- `sensor.withings_intense_activity_today` — Intense activity today | device: Withings | area: Bedroom (Alpha) — disabled:integration
- `sensor.withings_light_sleep` — Light sleep | device: Withings | area: Bedroom (Alpha)
- `sensor.withings_maximum_heart_rate` — Maximum heart rate | device: Withings | area: Bedroom (Alpha)
- `sensor.withings_maximum_respiratory_rate` — Maximum respiratory rate | device: Withings | area: Bedroom (Alpha) — disabled:integration
- `sensor.withings_minimum_heart_rate` — Minimum heart rate | device: Withings | area: Bedroom (Alpha) — disabled:integration
- `sensor.withings_minimum_respiratory_rate` — Minimum respiratory rate | device: Withings | area: Bedroom (Alpha) — disabled:integration
- `sensor.withings_moderate_activity_today` — Moderate activity today | device: Withings | area: Bedroom (Alpha) — disabled:integration
- `sensor.withings_rem_sleep` — REM sleep | device: Withings | area: Bedroom (Alpha)
- `sensor.withings_sleep_score` — Sleep score | device: Withings | area: Bedroom (Alpha)
- `sensor.withings_snoring` — Snoring | device: Withings | area: Bedroom (Alpha)
- `sensor.withings_snoring_episode_count` — Snoring episode count | device: Withings | area: Bedroom (Alpha) — disabled:integration
- `sensor.withings_soft_activity_today` — Soft activity today | device: Withings | area: Bedroom (Alpha) — disabled:integration
- `sensor.withings_steps_today` — Steps today | device: Withings | area: Bedroom (Alpha) — disabled:user
- `sensor.withings_time_to_sleep` — Time to sleep | device: Withings | area: Bedroom (Alpha)
- `sensor.withings_time_to_wakeup` — Time to wakeup | device: Withings | area: Bedroom (Alpha)
- `sensor.withings_total_calories_burnt_today` — Total calories burnt today | device: Withings | area: Bedroom (Alpha) — disabled:user
- `sensor.withings_wakeup_count` — Wakeup count | device: Withings | area: Bedroom (Alpha)
- `sensor.withings_wakeup_time` — Wakeup time | device: Withings | area: Bedroom (Alpha)
- `update.core_300s_firmware` — Firmware | device: Core 300S | area: Bedroom — diagnostic
- `weather.forecast_home` — Home | device: Forecast | area: Unassigned

## 7. Naming / Assignment Signals

### Duplicate Entity Base Names

| Base | Numbered Variants |
| --- | ---: |
| `binary_sensor.absence_for_3mins_dining_zone_occupancy` | binary_sensor.absence_for_3mins_dining_zone_occupancy_2 |
| `binary_sensor.absence_for_3mins_kitchen_zone_occupancy` | binary_sensor.absence_for_3mins_kitchen_zone_occupancy_2 |
| `binary_sensor.absence_for_3mins_living_zone_occupancy` | binary_sensor.absence_for_3mins_living_zone_occupancy_2 |
| `binary_sensor.absence_for_5mins_openplan_occupancy` | binary_sensor.absence_for_5mins_openplan_occupancy_2 |
| `binary_sensor.approaching_openplan_room_occupancy` | binary_sensor.approaching_openplan_room_occupancy_2 |
| `binary_sensor.aqara_curtain_driver_e1_problem` | binary_sensor.aqara_curtain_driver_e1_problem_2, binary_sensor.aqara_curtain_driver_e1_problem_3, binary_sensor.aqara_curtain_driver_e1_problem_4 |
| `binary_sensor.aqara_door_and_window_sensor_door` | binary_sensor.aqara_door_and_window_sensor_door_10, binary_sensor.aqara_door_and_window_sensor_door_11, binary_sensor.aqara_door_and_window_sensor_door_12, binary_sensor.aqara_door_and_window_sensor_door_13, binary_sensor.aqara_door_and_window_sensor_door_14, binary_sensor.aqara_door_and_window_sensor_door_2, binary_sensor.aqara_door_and_window_sensor_door_3, binary_sensor.aqara_door_and_window_sensor_door_4, binary_sensor.aqara_door_and_window_sensor_door_5, binary_sensor.aqara_door_and_window_sensor_door_6, binary_sensor.aqara_door_and_window_sensor_door_7, binary_sensor.aqara_door_and_window_sensor_door_8 |
| `binary_sensor.aqara_motion_sensor_p1_occupancy` | binary_sensor.aqara_motion_sensor_p1_occupancy_2, binary_sensor.aqara_motion_sensor_p1_occupancy_3, binary_sensor.aqara_motion_sensor_p1_occupancy_4 |
| `binary_sensor.aqara_presence_sensor_fp1e_occupancy` | binary_sensor.aqara_presence_sensor_fp1e_occupancy_2, binary_sensor.aqara_presence_sensor_fp1e_occupancy_3, binary_sensor.aqara_presence_sensor_fp1e_occupancy_4 |
| `binary_sensor.aqara_vibration_sensor_occupancy` | binary_sensor.aqara_vibration_sensor_occupancy_2 |
| `binary_sensor.beta_bedroom_no_presence_3mins_occupancy` | binary_sensor.beta_bedroom_no_presence_3mins_occupancy_2 |
| `binary_sensor.beta_bedroom_presence_detected_occupancy` | binary_sensor.beta_bedroom_presence_detected_occupancy_2 |
| `binary_sensor.hue_motion_sensor_motion` | binary_sensor.hue_motion_sensor_motion_2 |
| `binary_sensor.presence_dining_zone_occupancy` | binary_sensor.presence_dining_zone_occupancy_2 |
| `binary_sensor.presence_kitchen_zone_occupancy` | binary_sensor.presence_kitchen_zone_occupancy_2 |
| `binary_sensor.presence_living_zone_occupancy` | binary_sensor.presence_living_zone_occupancy_2 |
| `button.absence_for_3mins_dining_zone_identify` | button.absence_for_3mins_dining_zone_identify_2 |
| `button.absence_for_3mins_kitchen_zone_identify` | button.absence_for_3mins_kitchen_zone_identify_2 |
| `button.absence_for_3mins_living_zone_identify` | button.absence_for_3mins_living_zone_identify_2 |
| `button.absence_for_5mins_openplan_identify` | button.absence_for_5mins_openplan_identify_2 |
| `button.approaching_openplan_room_identify` | button.approaching_openplan_room_identify_2 |
| `button.aqara_curtain_driver_e1_identify` | button.aqara_curtain_driver_e1_identify_2, button.aqara_curtain_driver_e1_identify_3, button.aqara_curtain_driver_e1_identify_4 |
| `button.aqara_door_and_window_sensor_identify` | button.aqara_door_and_window_sensor_identify_10, button.aqara_door_and_window_sensor_identify_11, button.aqara_door_and_window_sensor_identify_12, button.aqara_door_and_window_sensor_identify_13, button.aqara_door_and_window_sensor_identify_14, button.aqara_door_and_window_sensor_identify_2, button.aqara_door_and_window_sensor_identify_3, button.aqara_door_and_window_sensor_identify_4, button.aqara_door_and_window_sensor_identify_5, button.aqara_door_and_window_sensor_identify_6, button.aqara_door_and_window_sensor_identify_7, button.aqara_door_and_window_sensor_identify_8 |
| `button.aqara_hub_m3_identify` | button.aqara_hub_m3_identify_2 |
| `button.aqara_motion_sensor_p1_identify` | button.aqara_motion_sensor_p1_identify_2, button.aqara_motion_sensor_p1_identify_3, button.aqara_motion_sensor_p1_identify_4 |
| `button.aqara_presence_sensor_fp1e_identify` | button.aqara_presence_sensor_fp1e_identify_2, button.aqara_presence_sensor_fp1e_identify_3, button.aqara_presence_sensor_fp1e_identify_4 |
| `button.aqara_vibration_sensor_identify` | button.aqara_vibration_sensor_identify_2 |
| `button.aqara_wireless_remote_switch_identify` | button.aqara_wireless_remote_switch_identify_2, button.aqara_wireless_remote_switch_identify_3, button.aqara_wireless_remote_switch_identify_4 |
| `button.beta_bedroom_no_presence_3mins_identify` | button.beta_bedroom_no_presence_3mins_identify_2 |
| `button.beta_bedroom_presence_detected_identify` | button.beta_bedroom_presence_detected_identify_2 |
| `button.presence_dining_zone_identify` | button.presence_dining_zone_identify_2 |
| `button.presence_kitchen_zone_identify` | button.presence_kitchen_zone_identify_2 |
| `button.presence_living_zone_identify` | button.presence_living_zone_identify_2 |
| `cover.aqara_curtain_driver_e1` | cover.aqara_curtain_driver_e1_2, cover.aqara_curtain_driver_e1_3, cover.aqara_curtain_driver_e1_4 |
| `cover.roller_shade` | cover.roller_shade_0a, cover.roller_shade_2a, cover.roller_shade_84 |
| `event.alpha_bedroom_dial_switch_button` | event.alpha_bedroom_dial_switch_button_1, event.alpha_bedroom_dial_switch_button_2, event.alpha_bedroom_dial_switch_button_3, event.alpha_bedroom_dial_switch_button_4 |
| `event.alpha_hue_smart_button_button` | event.alpha_hue_smart_button_button_1 |
| `event.aqara_wireless_remote_switch_button` | event.aqara_wireless_remote_switch_button_2, event.aqara_wireless_remote_switch_button_3, event.aqara_wireless_remote_switch_button_4 |
| `event.bathroom_dimmer_switch_button` | event.bathroom_dimmer_switch_button_1, event.bathroom_dimmer_switch_button_2, event.bathroom_dimmer_switch_button_3, event.bathroom_dimmer_switch_button_4 |
| `event.core_tap_dial_light_switch_button` | event.core_tap_dial_light_switch_button_1, event.core_tap_dial_light_switch_button_2, event.core_tap_dial_light_switch_button_3, event.core_tap_dial_light_switch_button_4 |
| `event.hallway_dimmer_switch_button` | event.hallway_dimmer_switch_button_1, event.hallway_dimmer_switch_button_2, event.hallway_dimmer_switch_button_3, event.hallway_dimmer_switch_button_4 |
| `event.hallway_tap_dial_switch_button` | event.hallway_tap_dial_switch_button_1, event.hallway_tap_dial_switch_button_2, event.hallway_tap_dial_switch_button_3, event.hallway_tap_dial_switch_button_4 |
| `event.hue_smart_button_2_button` | event.hue_smart_button_2_button_1 |
| `event.hue_smart_button_3_button` | event.hue_smart_button_3_button_1 |
| `event.splash_dimmer_switch_button` | event.splash_dimmer_switch_button_1, event.splash_dimmer_switch_button_2, event.splash_dimmer_switch_button_3, event.splash_dimmer_switch_button_4 |
| `light.alpha_ceiling_light` | light.alpha_ceiling_light_4, light.alpha_ceiling_light_6 |
| `light.alpha_gradient_light_tube` | light.alpha_gradient_light_tube_1 |
| `light.alphabed_ceiling_light` | light.alphabed_ceiling_light_3, light.alphabed_ceiling_light_5, light.alphabed_ceiling_light_5_2 |
| `light.alphabed_ceiling_light_5` | light.alphabed_ceiling_light_5_2 |
| `light.alphadoor_ceiling_light` | light.alphadoor_ceiling_light_6 |
| `light.beta_ceiling_light` | light.beta_ceiling_light_3, light.beta_ceiling_light_3_2, light.beta_ceiling_light_4, light.beta_ceiling_light_6 |
| `light.beta_ceiling_light_3` | light.beta_ceiling_light_3_2 |
| `light.betaflex_ceiling_light` | light.betaflex_ceiling_light_1, light.betaflex_ceiling_light_2 |
| `light.core_ceiling` | light.core_ceiling_3, light.core_ceiling_light_1, light.core_ceiling_light_10, light.core_ceiling_light_2, light.core_ceiling_light_4, light.core_ceiling_light_5, light.core_ceiling_light_5_2, light.core_ceiling_light_6, light.core_ceiling_light_7, light.core_ceiling_light_8, light.core_ceiling_light_9 |
| `light.core_ceiling_light` | light.core_ceiling_light_1, light.core_ceiling_light_10, light.core_ceiling_light_2, light.core_ceiling_light_4, light.core_ceiling_light_5, light.core_ceiling_light_5_2, light.core_ceiling_light_6, light.core_ceiling_light_7, light.core_ceiling_light_8, light.core_ceiling_light_9 |
| `light.core_ceiling_light_5` | light.core_ceiling_light_5_2 |
| `light.hue_play` | light.hue_play_1, light.hue_play_2 |
| `light.hue_signe_white_gradient_floor_lamp` | light.hue_signe_white_gradient_floor_lamp_1 |
| `light.hue_smart_plug` | light.hue_smart_plug_1 |
| `light.pass_ceiling_light` | light.pass_ceiling_light_1, light.pass_ceiling_light_1_2, light.pass_ceiling_light_2, light.pass_ceiling_light_4, light.pass_ceiling_light_5 |
| `light.pass_ceiling_light_1` | light.pass_ceiling_light_1_2 |
| `light.signe_gradient_floor` | light.signe_gradient_floor_1 |
| `light.signe_gradient_table` | light.signe_gradient_table_1 |
| `light.splash_ceiling_light` | light.splash_ceiling_light_1, light.splash_ceiling_light_2, light.splash_ceiling_light_3, light.splash_ceiling_light_4, light.splash_ceiling_light_5 |
| `light.throne_ceiling_light` | light.throne_ceiling_light_2, light.throne_ceiling_light_3, light.throne_ceiling_light_3_2, light.throne_ceiling_light_4 |
| `light.throne_ceiling_light_3` | light.throne_ceiling_light_3_2 |
| `media_player.core_lounge_homepod` | media_player.core_lounge_homepod_2 |
| `media_player.living_room` | media_player.living_room_2 |
| `media_player.nesthubd029` | media_player.nesthubd029_2, media_player.nesthubd029_3 |
| `remote.core_lounge_homepod` | remote.core_lounge_homepod_2 |
| `remote.living_room` | remote.living_room_2 |
| `sensor.aqara_curtain_driver_e1_battery` | sensor.aqara_curtain_driver_e1_battery_2, sensor.aqara_curtain_driver_e1_battery_3, sensor.aqara_curtain_driver_e1_battery_4, sensor.aqara_curtain_driver_e1_battery_charge_state, sensor.aqara_curtain_driver_e1_battery_charge_state_2, sensor.aqara_curtain_driver_e1_battery_charge_state_3, sensor.aqara_curtain_driver_e1_battery_charge_state_4, sensor.aqara_curtain_driver_e1_battery_voltage, sensor.aqara_curtain_driver_e1_battery_voltage_2, sensor.aqara_curtain_driver_e1_battery_voltage_3, sensor.aqara_curtain_driver_e1_battery_voltage_4 |
| `sensor.aqara_curtain_driver_e1_battery_charge_state` | sensor.aqara_curtain_driver_e1_battery_charge_state_2, sensor.aqara_curtain_driver_e1_battery_charge_state_3, sensor.aqara_curtain_driver_e1_battery_charge_state_4 |
| `sensor.aqara_curtain_driver_e1_battery_voltage` | sensor.aqara_curtain_driver_e1_battery_voltage_2, sensor.aqara_curtain_driver_e1_battery_voltage_3, sensor.aqara_curtain_driver_e1_battery_voltage_4 |
| `sensor.aqara_curtain_driver_e1_target_opening_position` | sensor.aqara_curtain_driver_e1_target_opening_position_2, sensor.aqara_curtain_driver_e1_target_opening_position_3, sensor.aqara_curtain_driver_e1_target_opening_position_4 |
| `sensor.aqara_door_and_window_sensor_battery` | sensor.aqara_door_and_window_sensor_battery_10, sensor.aqara_door_and_window_sensor_battery_11, sensor.aqara_door_and_window_sensor_battery_12, sensor.aqara_door_and_window_sensor_battery_13, sensor.aqara_door_and_window_sensor_battery_14, sensor.aqara_door_and_window_sensor_battery_2, sensor.aqara_door_and_window_sensor_battery_3, sensor.aqara_door_and_window_sensor_battery_4, sensor.aqara_door_and_window_sensor_battery_5, sensor.aqara_door_and_window_sensor_battery_6, sensor.aqara_door_and_window_sensor_battery_7, sensor.aqara_door_and_window_sensor_battery_8 |
| `sensor.aqara_door_and_window_sensor_battery_type` | sensor.aqara_door_and_window_sensor_battery_type_10, sensor.aqara_door_and_window_sensor_battery_type_11, sensor.aqara_door_and_window_sensor_battery_type_12, sensor.aqara_door_and_window_sensor_battery_type_13, sensor.aqara_door_and_window_sensor_battery_type_14, sensor.aqara_door_and_window_sensor_battery_type_2, sensor.aqara_door_and_window_sensor_battery_type_3, sensor.aqara_door_and_window_sensor_battery_type_4, sensor.aqara_door_and_window_sensor_battery_type_5, sensor.aqara_door_and_window_sensor_battery_type_6, sensor.aqara_door_and_window_sensor_battery_type_7, sensor.aqara_door_and_window_sensor_battery_type_8 |
| `sensor.aqara_door_and_window_sensor_battery_voltage` | sensor.aqara_door_and_window_sensor_battery_voltage_10, sensor.aqara_door_and_window_sensor_battery_voltage_11, sensor.aqara_door_and_window_sensor_battery_voltage_12, sensor.aqara_door_and_window_sensor_battery_voltage_13, sensor.aqara_door_and_window_sensor_battery_voltage_14, sensor.aqara_door_and_window_sensor_battery_voltage_2, sensor.aqara_door_and_window_sensor_battery_voltage_3, sensor.aqara_door_and_window_sensor_battery_voltage_4, sensor.aqara_door_and_window_sensor_battery_voltage_5, sensor.aqara_door_and_window_sensor_battery_voltage_6, sensor.aqara_door_and_window_sensor_battery_voltage_7, sensor.aqara_door_and_window_sensor_battery_voltage_8 |
| `sensor.aqara_motion_sensor_p1_battery` | sensor.aqara_motion_sensor_p1_battery_2, sensor.aqara_motion_sensor_p1_battery_3, sensor.aqara_motion_sensor_p1_battery_4, sensor.aqara_motion_sensor_p1_battery_type, sensor.aqara_motion_sensor_p1_battery_type_2, sensor.aqara_motion_sensor_p1_battery_type_3, sensor.aqara_motion_sensor_p1_battery_type_4, sensor.aqara_motion_sensor_p1_battery_voltage, sensor.aqara_motion_sensor_p1_battery_voltage_2, sensor.aqara_motion_sensor_p1_battery_voltage_3, sensor.aqara_motion_sensor_p1_battery_voltage_4 |
| `sensor.aqara_motion_sensor_p1_battery_type` | sensor.aqara_motion_sensor_p1_battery_type_2, sensor.aqara_motion_sensor_p1_battery_type_3, sensor.aqara_motion_sensor_p1_battery_type_4 |
| `sensor.aqara_motion_sensor_p1_battery_voltage` | sensor.aqara_motion_sensor_p1_battery_voltage_2, sensor.aqara_motion_sensor_p1_battery_voltage_3, sensor.aqara_motion_sensor_p1_battery_voltage_4 |
| `sensor.aqara_vibration_sensor_battery` | sensor.aqara_vibration_sensor_battery_2, sensor.aqara_vibration_sensor_battery_type, sensor.aqara_vibration_sensor_battery_type_2, sensor.aqara_vibration_sensor_battery_voltage, sensor.aqara_vibration_sensor_battery_voltage_2 |
| `sensor.aqara_vibration_sensor_battery_type` | sensor.aqara_vibration_sensor_battery_type_2 |
| `sensor.aqara_vibration_sensor_battery_voltage` | sensor.aqara_vibration_sensor_battery_voltage_2 |
| `sensor.aqara_wireless_remote_switch_battery` | sensor.aqara_wireless_remote_switch_battery_2, sensor.aqara_wireless_remote_switch_battery_type, sensor.aqara_wireless_remote_switch_battery_type_2, sensor.aqara_wireless_remote_switch_battery_voltage, sensor.aqara_wireless_remote_switch_battery_voltage_2 |
| `sensor.aqara_wireless_remote_switch_battery_type` | sensor.aqara_wireless_remote_switch_battery_type_2 |
| `sensor.aqara_wireless_remote_switch_battery_voltage` | sensor.aqara_wireless_remote_switch_battery_voltage_2 |
| `sensor.aqara_wireless_remote_switch_current_switch_position` | sensor.aqara_wireless_remote_switch_current_switch_position_2, sensor.aqara_wireless_remote_switch_current_switch_position_3, sensor.aqara_wireless_remote_switch_current_switch_position_4 |
| `sensor.ceiling_ensuite_bathroom_zigbee_connectivity` | sensor.ceiling_ensuite_bathroom_zigbee_connectivity_2, sensor.ceiling_ensuite_bathroom_zigbee_connectivity_3, sensor.ceiling_ensuite_bathroom_zigbee_connectivity_4 |
| `sensor.core_300s_pm2` | sensor.core_300s_pm2_5 |
| `sensor.hue_color_lamp_1_zigbee_connectivity` | sensor.hue_color_lamp_1_zigbee_connectivity_2 |
| `sensor.hue_motion_sensor_battery` | sensor.hue_motion_sensor_battery_2 |
| `sensor.hue_motion_sensor_illuminance` | sensor.hue_motion_sensor_illuminance_2 |
| `sensor.hue_motion_sensor_temperature` | sensor.hue_motion_sensor_temperature_2 |
| `sensor.iphone_16pro_max_sim` | sensor.iphone_16pro_max_sim_1, sensor.iphone_16pro_max_sim_2 |
| `sensor.jeffs_iphone_sim` | sensor.jeffs_iphone_sim_1, sensor.jeffs_iphone_sim_2 |
| `switch.automation_hue_smart_button` | switch.automation_hue_smart_button_3 |
| `switch.hue_motion_sensor_light_sensor_enabled` | switch.hue_motion_sensor_light_sensor_enabled_2 |
| `switch.hue_motion_sensor_motion_sensor_enabled` | switch.hue_motion_sensor_motion_sensor_enabled_2 |

### Devices With Duplicate Display Names

| Device Name | Count | Areas / Models |
| --- | ---: | --- |
| Alpha Ceiling Light.6 | 2 | Bedroom (Alpha) / Hue ambiance spot; Bedroom / Hue Essential spot |
| Alphabed Ceiling Light.5 | 2 | Bedroom (Alpha) / Hue color spot; Bedroom (Alpha) / Hue color spot |
| Aqara Curtain Driver E1 | 2 | Unassigned / Aqara Curtain Driver E1; Unassigned / Aqara Curtain Driver E1 |
| Aqara Door and Window Sensor | 7 | Unassigned / Aqara Door and Window Sensor; Unassigned / Aqara Door and Window Sensor; Unassigned / Aqara Door and Window Sensor; Unassigned / Aqara Door and Window Sensor; Unassigned / Aqara Door and Window Sensor; Unassigned / Aqara Door and Window Sensor; Unassigned / Aqara Door and Window Sensor |
| Aqara Motion Sensor P1 | 2 | Unassigned / Aqara Motion Sensor P1; Unassigned / Aqara Motion Sensor P1 |
| Aqara Presence Sensor FP1E | 2 | Unassigned / Aqara Presence Sensor FP1E; Unassigned / Aqara Presence Sensor FP1E |
| Beta Ceiling Light.3 | 2 | Spare Bedroom / Hue ambiance spot; Spare Bedroom / Hue ambiance spot |
| Core Ceiling Light.4 | 2 | Openplan (Core) / Hue color spot; Openplan (Core) / Hue color spot |
| Core Ceiling Light.5 | 2 | Openplan (Core) / Hue color spot; Living Room / Hue color spot |
| Core Lounge HomePod | 2 | Living Room / HomePod (gen 2); Living Room / HomePod (gen 2) |
| Hue Motion Sensor | 2 | Spare Bedroom / Hue motion sensor; Ensuite (Throne) Bathroom / Hue motion sensor |
| NestHubD029 | 2 | Unassigned / Google Nest Hub; Unassigned / Google Nest Hub |

### Disabled Entities

Count: `103`

- - `binary_sensor.sun_solar_rising` — Solar rising — disabled:integration, diagnostic
- - `sensor.alpha_bed_zone_ceiling_2_zigbee_connectivity` — Zigbee connectivity — disabled:integration, diagnostic
- - `sensor.alpha_bedroom_dial_switch_zigbee_connectivity` — Zigbee connectivity — disabled:integration, diagnostic
- - `sensor.alpha_bedroom_hue_smart_button_zigbee_connectivity` — Zigbee connectivity — disabled:integration, diagnostic
- - `sensor.alpha_pass_ceiling_zigbee_connectivity` — Zigbee connectivity — disabled:integration, diagnostic
- - `sensor.aqara_curtain_driver_e1_target_opening_position` — Target opening position — disabled:integration, diagnostic
- - `sensor.aqara_curtain_driver_e1_target_opening_position_2` — Target opening position — disabled:integration, diagnostic
- - `sensor.aqara_curtain_driver_e1_target_opening_position_3` — Target opening position — disabled:integration, diagnostic
- - `sensor.aqara_curtain_driver_e1_target_opening_position_4` — Target opening position — disabled:integration, diagnostic
- - `sensor.aqara_wireless_remote_switch_current_switch_position` — Current switch position — disabled:integration, diagnostic
- - `sensor.aqara_wireless_remote_switch_current_switch_position_2` — Current switch position — disabled:integration, diagnostic
- - `sensor.aqara_wireless_remote_switch_current_switch_position_3` — Current switch position — disabled:integration, diagnostic
- - `sensor.aqara_wireless_remote_switch_current_switch_position_4` — Current switch position — disabled:integration, diagnostic
- - `sensor.bathroom2_hue_motion_sensor_zigbee_connectivity` — Zigbee connectivity — disabled:integration, diagnostic
- - `sensor.bed1_zigbee_connectivity` — Zigbee connectivity — disabled:integration, diagnostic
- - `sensor.bed3_zigbee_connectivity` — Zigbee connectivity — disabled:integration, diagnostic
- - `sensor.beige_ola_spotlight_lamp_zigbee_connectivity` — Zigbee connectivity — disabled:integration, diagnostic
- - `sensor.beta_bed_lightstrip_zigbee_connectivity` — Zigbee connectivity — disabled:integration, diagnostic
- - `sensor.beta_bedroom_hue_dial_switch_zigbee_connectivity` — Zigbee connectivity — disabled:integration, diagnostic
- - `sensor.beta_ceiling_light_3_zigbee_connectivity` — Zigbee connectivity — disabled:integration, diagnostic
- - `sensor.beta_ceiling_light_4_zigbee_connectivity` — Zigbee connectivity — disabled:integration, diagnostic
- - `sensor.beta_ceiling_light_6_zigbee_connectivity` — Zigbee connectivity — disabled:integration, diagnostic
- - `sensor.beta_ceiling_light_zigbee_connectivity` — Zigbee connectivity — disabled:integration, diagnostic
- - `sensor.beta_flex_ceiling_light_1_zigbee_connectivity` — Zigbee connectivity — disabled:integration, diagnostic
- - `sensor.beta_flex_ceiling_light_2_zigbee_connectivity` — Zigbee connectivity — disabled:integration, diagnostic
- - `sensor.beta_pass_ceiling_zigbee_connectivity` — Zigbee connectivity — disabled:integration, diagnostic
- - `sensor.betaflex_lower_shelf_zigbee_connectivity` — Zigbee connectivity — disabled:integration, diagnostic
- - `sensor.ceiling_bedroom1_bed4_zigbee_connectivity` — Zigbee connectivity — disabled:integration, diagnostic
- - `sensor.ceiling_bedroom1_closet_zone_zigbee_connectivity` — Zigbee connectivity — disabled:integration, diagnostic
- - `sensor.ceiling_bedroom1_door_zone_zigbee_connectivity` — Zigbee connectivity — disabled:integration, diagnostic
- - `sensor.ceiling_ensuite_bathroom_zigbee_connectivity` — Zigbee connectivity — disabled:integration, diagnostic
- - `sensor.ceiling_ensuite_bathroom_zigbee_connectivity_2` — Zigbee connectivity — disabled:integration, diagnostic
- - `sensor.ceiling_ensuite_bathroom_zigbee_connectivity_3` — Zigbee connectivity — disabled:integration, diagnostic
- - `sensor.ceiling_ensuite_bathroom_zigbee_connectivity_4` — Zigbee connectivity — disabled:integration, diagnostic
- - `sensor.ceiling_kitchen_fridge_zigbee_connectivity` — Zigbee connectivity — disabled:integration, diagnostic
- - `sensor.ceiling_kitchen_sink_zigbee_connectivity` — Zigbee connectivity — disabled:integration, diagnostic
- - `sensor.ceiling_op_br_zigbee_connectivity` — Zigbee connectivity — disabled:integration, diagnostic
- - `sensor.ceiling_op_north_wall_zone_a1b_zigbee_connectivity` — Zigbee connectivity — disabled:integration, diagnostic
- - `sensor.ceiling_op_north_wall_zone_zigbee_connectivity` — Zigbee connectivity — disabled:integration, diagnostic
- - `sensor.ceiling_op_south_zigbee_connectivity` — Zigbee connectivity — disabled:integration, diagnostic
- - `sensor.ceiling_open_plan_east_zigbee_connectivity` — Zigbee connectivity — disabled:integration, diagnostic
- - `sensor.ceiling_open_plan_mm_zigbee_connectivity` — Zigbee connectivity — disabled:integration, diagnostic
- - `sensor.ceiling_open_plan_mr_zigbee_connectivity` — Zigbee connectivity — disabled:integration, diagnostic
- - `sensor.ceiling_open_plan_se_zigbee_connectivity` — Zigbee connectivity — disabled:integration, diagnostic
- - `sensor.chaos_laundry_ceiling_zigbee_connectivity` — Zigbee connectivity — disabled:integration, diagnostic
- - `sensor.chaos_storage_ceiling_zigbee_connectivity` — Zigbee connectivity — disabled:integration, diagnostic
- - `sensor.chaos_vault_ceiling_zigbee_connectivity` — Zigbee connectivity — disabled:integration, diagnostic
- - `sensor.core_hue_tap_dial_switch_zigbee_connectivity` — Zigbee connectivity — disabled:integration, diagnostic
- - `sensor.core_signe_floor_lamp_zigbee_connectivity` — Zigbee connectivity — disabled:integration, diagnostic
- - `sensor.core_vault_ceiling_zigbee_connectivity` — Zigbee connectivity — disabled:integration, diagnostic
- - `sensor.hub_3_button_1_current_switch_position` — Current switch position — disabled:integration, diagnostic
- - `sensor.hub_3_button_2_current_switch_position` — Current switch position — disabled:integration, diagnostic
- - `sensor.hub_3_button_3_current_switch_position` — Current switch position — disabled:integration, diagnostic
- - `sensor.hue_bridge_pro_zigbee_connectivity` — Zigbee connectivity — disabled:integration, diagnostic
- - `sensor.hue_color_candle_1_zigbee_connectivity` — Zigbee connectivity — disabled:integration, diagnostic
- - `sensor.hue_color_lamp_1_zigbee_connectivity` — Zigbee connectivity — disabled:integration, diagnostic
- - `sensor.hue_color_lamp_1_zigbee_connectivity_2` — Zigbee connectivity — disabled:integration, diagnostic
- - `sensor.hue_dimmer_switch_4_zigbee_connectivity` — Zigbee connectivity — disabled:integration, diagnostic
- - `sensor.hue_essential_spot_1_zigbee_connectivity` — Zigbee connectivity — disabled:integration, diagnostic
- - `sensor.hue_essential_spot_2_zigbee_connectivity` — Zigbee connectivity — disabled:integration, diagnostic
- - `sensor.hue_essential_spot_3_zigbee_connectivity` — Zigbee connectivity — disabled:integration, diagnostic
- - `sensor.hue_play_1_zigbee_connectivity` — Zigbee connectivity — disabled:integration, diagnostic
- - `sensor.hue_play_2_zigbee_connectivity` — Zigbee connectivity — disabled:integration, diagnostic
- - `sensor.hue_smart_button_2_zigbee_connectivity` — Zigbee connectivity — disabled:integration, diagnostic
- - `sensor.hue_smart_button_3_zigbee_connectivity` — Zigbee connectivity — disabled:integration, diagnostic
- - `sensor.hue_smart_plug_1_zigbee_connectivity` — Zigbee connectivity — disabled:integration, diagnostic
- - `sensor.klasnick_beige_table_lamp_zigbee_connectivity` — Zigbee connectivity — disabled:integration, diagnostic
- - `sensor.monica_vibelucci_arc_lamp_zigbee_connectivity` — Zigbee connectivity — disabled:integration, diagnostic
- - `sensor.nymane_3_spot_lamp_low_zigbee_connectivity` — Zigbee connectivity — disabled:integration, diagnostic
- - `sensor.play_gradient_tube_1_zigbee_connectivity` — Zigbee connectivity — disabled:integration, diagnostic
- - `sensor.roller_shade_0a_target_opening_position` — Target opening position — disabled:integration, diagnostic
- - `sensor.roller_shade_2a_target_opening_position` — Target opening position — disabled:integration, diagnostic
- - `sensor.roller_shade_84_target_opening_position` — Target opening position — disabled:integration, diagnostic
- - `sensor.signe_gradient_floor_1_zigbee_connectivity` — Zigbee connectivity — disabled:integration, diagnostic
- - `sensor.signe_gradient_table_1_zigbee_connectivity` — Zigbee connectivity — disabled:integration, diagnostic
- - `sensor.splash_bathroom_dimmer_zigbee_connectivity` — Zigbee connectivity — disabled:integration, diagnostic
- - `sensor.splash_ceiling_light_1_zigbee_connectivity` — Zigbee connectivity — disabled:integration, diagnostic
- - `sensor.splash_ceiling_light_2_zigbee_connectivity` — Zigbee connectivity — disabled:integration, diagnostic
- - `sensor.splash_ceiling_light_3_zigbee_connectivity` — Zigbee connectivity — disabled:integration, diagnostic
- - `sensor.splash_ceiling_light_4_zigbee_connectivity` — Zigbee connectivity — disabled:integration, diagnostic
- - `sensor.splash_ceiling_light_5_zigbee_connectivity` — Zigbee connectivity — disabled:integration, diagnostic
- - `sensor.splash_pass_ceiling_zigbee_connectivity` — Zigbee connectivity — disabled:integration, diagnostic
- - `sensor.sun_solar_azimuth` — Solar azimuth — disabled:integration, diagnostic
- - `sensor.sun_solar_elevation` — Solar elevation — disabled:integration, diagnostic
- - `sensor.sun_solar_rising` — Solar rising — disabled:integration, diagnostic
- - `sensor.throne_bathroom_ceiling_zigbee_connectivity` — Zigbee connectivity — disabled:integration, diagnostic
- - `sensor.throne_hue_motion_sensor_zigbee_connectivity` — Zigbee connectivity — disabled:integration, diagnostic
- - `sensor.withings_active_calories_burnt_today` — Active calories burnt today — disabled:user
- - `sensor.withings_active_time_today` — Active time today — disabled:user
- - `sensor.withings_average_heart_rate` — Average heart rate — disabled:integration
- - `sensor.withings_average_respiratory_rate` — Average respiratory rate — disabled:integration
- - `sensor.withings_breathing_disturbances_intensity` — Breathing disturbances intensity — disabled:integration
- - `sensor.withings_distance_travelled_today` — Distance travelled today — disabled:user
- - `sensor.withings_elevation_change_today` — Elevation change today — disabled:user
- - `sensor.withings_intense_activity_today` — Intense activity today — disabled:integration
- - `sensor.withings_maximum_respiratory_rate` — Maximum respiratory rate — disabled:integration
- - `sensor.withings_minimum_heart_rate` — Minimum heart rate — disabled:integration
- - `sensor.withings_minimum_respiratory_rate` — Minimum respiratory rate — disabled:integration
- - `sensor.withings_moderate_activity_today` — Moderate activity today — disabled:integration
- - `sensor.withings_snoring_episode_count` — Snoring episode count — disabled:integration
- - `sensor.withings_soft_activity_today` — Soft activity today — disabled:integration
- - `sensor.withings_steps_today` — Steps today — disabled:user
- - `sensor.withings_total_calories_burnt_today` — Total calories burnt today — disabled:user

### Assistant Exposure

#### Conversation exposed (136)

- - `binary_sensor.aqara_door_and_window_sensor_door` — Door — conversation, google
- - `binary_sensor.aqara_door_and_window_sensor_door_10` — Door — conversation, google
- - `binary_sensor.aqara_door_and_window_sensor_door_11` — Door — conversation, google
- - `binary_sensor.aqara_door_and_window_sensor_door_12` — Door — conversation, google
- - `binary_sensor.aqara_door_and_window_sensor_door_13` — Door — conversation, google
- - `binary_sensor.aqara_door_and_window_sensor_door_14` — Door — conversation, google
- - `binary_sensor.aqara_door_and_window_sensor_door_2` — Door — conversation, google
- - `binary_sensor.aqara_door_and_window_sensor_door_3` — Door — conversation, google
- - `binary_sensor.aqara_door_and_window_sensor_door_4` — Door — conversation, google
- - `binary_sensor.aqara_door_and_window_sensor_door_5` — Door — conversation, google
- - `binary_sensor.aqara_door_and_window_sensor_door_6` — Door — conversation, google
- - `binary_sensor.aqara_door_and_window_sensor_door_7` — Door — conversation, google
- - `binary_sensor.aqara_door_and_window_sensor_door_8` — Door — conversation, google
- - `binary_sensor.aqara_door_and_window_sensor_door_9` — Door — conversation, google
- - `binary_sensor.bathroom_motion` — Motion — conversation, google
- - `binary_sensor.hallway_motionaware_ceiling` — Hallway MotionAware Ceiling — conversation, google
- - `binary_sensor.hue_motion_sensor_motion` — Motion — conversation
- - `binary_sensor.hue_motion_sensor_motion_2` — Motion — conversation
- - `binary_sensor.secondary_bathroom_motion` — Motion — conversation, google
- - `binary_sensor.withings_in_bed` — In bed — conversation
- - `cover.aqara_curtain_driver_e1` — cover.aqara_curtain_driver_e1 — conversation, google
- - `cover.aqara_curtain_driver_e1_2` — cover.aqara_curtain_driver_e1_2 — conversation, google
- - `cover.aqara_curtain_driver_e1_3` — cover.aqara_curtain_driver_e1_3 — conversation, google
- - `cover.aqara_curtain_driver_e1_4` — cover.aqara_curtain_driver_e1_4 — conversation, google
- - `cover.roller_shade_0a` — cover.roller_shade_0a — conversation, google
- - `cover.roller_shade_2a` — cover.roller_shade_2a — conversation, google
- - `cover.roller_shade_84` — cover.roller_shade_84 — conversation, google
- - `fan.core_300s` — fan.core_300s — conversation, google
- - `light.all_bedroom_bathroom` — light.all_bedroom_bathroom — conversation, google
- - `light.alpha_ceiling_light_4` — light.alpha_ceiling_light_4 — conversation
- - `light.alpha_ceiling_light_6` — light.alpha_ceiling_light_6 — conversation, google
- - `light.alpha_gradient_light_tube_1` — light.alpha_gradient_light_tube_1 — conversation, google
- - `light.alphabed_ceiling_light_3` — light.alphabed_ceiling_light_3 — conversation
- - `light.alphabed_ceiling_light_5` — light.alphabed_ceiling_light_5 — conversation, google
- - `light.alphabed_ceiling_light_5_2` — light.alphabed_ceiling_light_5_2 — conversation
- - `light.alphadoor_ceiling_light_6` — alphadoor ceiling light.6 — conversation, google
- - `light.bathroom` — light.bathroom — conversation, google
- - `light.bedroom` — light.bedroom — conversation
- - `light.bedroom_ceiling` — light.bedroom_ceiling — conversation, google
- - `light.bedroom_lamps` — light.bedroom_lamps — conversation, google
- - `light.beige_ola_spotlight_lamp` — light.beige_ola_spotlight_lamp — conversation
- - `light.beta_bed_lightstrip` — light.beta_bed_lightstrip — conversation
- - `light.beta_bedroom_bath` — light.beta_bedroom_bath — conversation, google
- - `light.beta_ceiling_light_3` — light.beta_ceiling_light_3 — conversation
- - `light.beta_ceiling_light_3_2` — light.beta_ceiling_light_3_2 — conversation
- - `light.beta_ceiling_light_4` — light.beta_ceiling_light_4 — conversation
- - `light.beta_ceiling_light_6` — light.beta_ceiling_light_6 — conversation
- - `light.betaflex_ceiling_light_1` — Betaflex Ceiling Light.1 — conversation
- - `light.betaflex_ceiling_light_2` — light.betaflex_ceiling_light_2 — conversation
- - `light.core_ceiling_3` — light.core_ceiling_3 — conversation
- - `light.core_ceiling_light_1` — light.core_ceiling_light_1 — conversation
- - `light.core_ceiling_light_10` — light.core_ceiling_light_10 — conversation
- - `light.core_ceiling_light_2` — light.core_ceiling_light_2 — conversation
- - `light.core_ceiling_light_4` — light.core_ceiling_light_4 — conversation
- - `light.core_ceiling_light_5` — light.core_ceiling_light_5 — conversation
- - `light.core_ceiling_light_5_2` — light.core_ceiling_light_5_2 — conversation
- - `light.core_ceiling_light_6` — light.core_ceiling_light_6 — conversation
- - `light.core_ceiling_light_7` — Core Ceiling Light.7 — conversation
- - `light.core_ceiling_light_8` — light.core_ceiling_light_8 — conversation
- - `light.core_ceiling_light_9` — light.core_ceiling_light_9 — conversation
- - `light.core_statement_arc_floor_lamp_monica_vibelucci` — light.core_statement_arc_floor_lamp_monica_vibelucci — conversation
- - `light.fado_glass_globe_lamp` — light.fado_glass_globe_lamp — conversation, google
- - `light.hallway` — light.hallway — conversation
- - `light.hue_play_1` — light.hue_play_1 — conversation, google
- - `light.hue_play_2` — light.hue_play_2 — conversation, google
- - `light.hue_signe_white_gradient_floor_lamp_1` — light.hue_signe_white_gradient_floor_lamp_1 — conversation
- - `light.hue_smart_plug_1` — light.hue_smart_plug_1 — conversation, google
- - `light.ikea_skytrax_light` — light.ikea_skytrax_light — conversation
- - `light.kitchen` — light.kitchen — conversation, google
- - `light.kitchen_ceiling` — light.kitchen_ceiling — conversation, google
- - `light.klasnick_beige_table_lamp_with_e14_hue_colour` — light.klasnick_beige_table_lamp_with_e14_hue_colour — conversation
- - `light.laundry_chaos_ceiling_light` — light.laundry_chaos_ceiling_light — conversation
- - `light.laundry_room` — light.laundry_room — conversation, google
- - `light.living_room` — light.living_room — conversation, google
- - `light.living_room_ceiling` — light.living_room_ceiling — conversation, google
- - `light.living_room_lamps` — light.living_room_lamps — conversation, google
- - `light.nyamane_3_spot_lamp_top` — light.nyamane_3_spot_lamp_top — conversation, google
- - `light.nymane_3_spot_lamp_low` — light.nymane_3_spot_lamp_low — conversation, google
- - `light.nymane_3_spot_lamp_mid` — light.nymane_3_spot_lamp_mid — conversation, google
- - `light.ola_whitborg_xl_floor_lamp` — light.ola_whitborg_xl_floor_lamp — conversation, google
- - `light.pass_ceiling_light_1` — light.pass_ceiling_light_1 — conversation
- - `light.pass_ceiling_light_1_2` — light.pass_ceiling_light_1_2 — conversation
- - `light.pass_ceiling_light_2` — light.pass_ceiling_light_2 — conversation
- - `light.pass_ceiling_light_4` — light.pass_ceiling_light_4 — conversation
- - `light.pass_ceiling_light_5` — light.pass_ceiling_light_5 — conversation
- - `light.right_bedside_lamp` — light.right_bedside_lamp — conversation, google
- - `light.secondary_bathroom` — light.secondary_bathroom — conversation, google
- - `light.signe_gradient_floor_1` — light.signe_gradient_floor_1 — conversation, google
- - `light.signe_gradient_table_1` — light.signe_gradient_table_1 — conversation, google
- - `light.spare_bedroom` — light.spare_bedroom — conversation
- - `light.spare_bedroom_ceiling` — light.spare_bedroom_ceiling — conversation, google
- - `light.splash_ceiling_light_1` — light.splash_ceiling_light_1 — conversation
- - `light.splash_ceiling_light_2` — light.splash_ceiling_light_2 — conversation
- - `light.splash_ceiling_light_3` — light.splash_ceiling_light_3 — conversation
- - `light.splash_ceiling_light_4` — light.splash_ceiling_light_4 — conversation
- - `light.splash_ceiling_light_5` — light.splash_ceiling_light_5 — conversation
- - `light.throne_ceiling_light_2` — light.throne_ceiling_light_2 — conversation
- - `light.throne_ceiling_light_3` — light.throne_ceiling_light_3 — conversation
- - `light.throne_ceiling_light_3_2` — light.throne_ceiling_light_3_2 — conversation
- - `light.throne_ceiling_light_4` — light.throne_ceiling_light_4 — conversation
- - `light.white_e27_hue_bulb` — light.white_e27_hue_bulb — conversation
- - `light.wiz_a60_filament` — light.wiz_a60_filament — conversation, google
- - `media_player.bedroom_apple_tv` — media_player.bedroom_apple_tv — conversation, google
- - `media_player.bedroom_display` — media_player.bedroom_display — conversation
- - `media_player.core_lounge_homepod` — media_player.core_lounge_homepod — conversation, google
- - `media_player.core_lounge_homepod_2` — media_player.core_lounge_homepod_2 — conversation, google
- - `media_player.living_room_2` — media_player.living_room_2 — conversation, google
- - `media_player.lounge_apple_tv_wired` — media_player.lounge_apple_tv_wired — conversation, google
- - `media_player.nesthubd029` — media_player.nesthubd029 — conversation, google
- - `media_player.nesthubd029_2` — media_player.nesthubd029_2 — conversation, google
- - `media_player.nesthubd029_3` — media_player.nesthubd029_3 — conversation, google
- - `media_player.orange_homepod_mini` — media_player.orange_homepod_mini — conversation, google
- - `media_player.serif_tv` — media_player.serif_tv — conversation
- - `media_player.white_homepod_mini` — media_player.white_homepod_mini — conversation, google
- - `scene.bedroom_concentrate` — Concentrate — conversation, google
- - `scene.bedroom_dimmed` — Dimmed — conversation, google
- - `scene.bedroom_energise` — Energise — conversation, google
- - `scene.bedroom_nightlight` — Nightlight — conversation, google
- - `scene.bedroom_read` — Read — conversation, google
- - `scene.bedroom_relax` — Relax — conversation, google
- - `scene.bedroom_sleepy` — Sleepy — conversation, google
- - `scene.hallway_concentrate` — Concentrate — conversation, google
- - `scene.hallway_energise` — Energise — conversation, google
- - `scene.hallway_nightlight` — Nightlight — conversation, google
- - `scene.hallway_read` — Read — conversation, google
- - `scene.hallway_relax` — Relax — conversation, google
- - `scene.new_scene` — New scene — conversation, google
- - `sensor.core_300s_pm2_5` — PM2.5 — conversation, google
- - `sensor.hub_3_humisensor_humidity` — Humidity — conversation, google
- - `sensor.hub_3_tempsensor_temperature` — Temperature — conversation, google
- - `sensor.hue_motion_sensor_temperature` — Temperature — conversation
- - `sensor.hue_motion_sensor_temperature_2` — Temperature — conversation
- - `switch.bot_4a` — switch.bot_4a — conversation, google
- - `switch.core_300s_child_lock` — Child lock — conversation, google
- - `switch.core_300s_display` — Display — conversation, google
- - `todo.shopping_list` — Shopping List — conversation

#### Google Assistant exposed (83)

- - `binary_sensor.aqara_door_and_window_sensor_door` — Door — conversation, google
- - `binary_sensor.aqara_door_and_window_sensor_door_10` — Door — conversation, google
- - `binary_sensor.aqara_door_and_window_sensor_door_11` — Door — conversation, google
- - `binary_sensor.aqara_door_and_window_sensor_door_12` — Door — conversation, google
- - `binary_sensor.aqara_door_and_window_sensor_door_13` — Door — conversation, google
- - `binary_sensor.aqara_door_and_window_sensor_door_14` — Door — conversation, google
- - `binary_sensor.aqara_door_and_window_sensor_door_2` — Door — conversation, google
- - `binary_sensor.aqara_door_and_window_sensor_door_3` — Door — conversation, google
- - `binary_sensor.aqara_door_and_window_sensor_door_4` — Door — conversation, google
- - `binary_sensor.aqara_door_and_window_sensor_door_5` — Door — conversation, google
- - `binary_sensor.aqara_door_and_window_sensor_door_6` — Door — conversation, google
- - `binary_sensor.aqara_door_and_window_sensor_door_7` — Door — conversation, google
- - `binary_sensor.aqara_door_and_window_sensor_door_8` — Door — conversation, google
- - `binary_sensor.aqara_door_and_window_sensor_door_9` — Door — conversation, google
- - `binary_sensor.bathroom_motion` — Motion — conversation, google
- - `binary_sensor.hallway_motionaware_ceiling` — Hallway MotionAware Ceiling — conversation, google
- - `binary_sensor.secondary_bathroom_motion` — Motion — conversation, google
- - `cover.aqara_curtain_driver_e1` — cover.aqara_curtain_driver_e1 — conversation, google
- - `cover.aqara_curtain_driver_e1_2` — cover.aqara_curtain_driver_e1_2 — conversation, google
- - `cover.aqara_curtain_driver_e1_3` — cover.aqara_curtain_driver_e1_3 — conversation, google
- - `cover.aqara_curtain_driver_e1_4` — cover.aqara_curtain_driver_e1_4 — conversation, google
- - `cover.roller_shade_0a` — cover.roller_shade_0a — conversation, google
- - `cover.roller_shade_2a` — cover.roller_shade_2a — conversation, google
- - `cover.roller_shade_84` — cover.roller_shade_84 — conversation, google
- - `fan.core_300s` — fan.core_300s — conversation, google
- - `light.all_bedroom_bathroom` — light.all_bedroom_bathroom — conversation, google
- - `light.alpha_ceiling_light_6` — light.alpha_ceiling_light_6 — conversation, google
- - `light.alpha_gradient_light_tube_1` — light.alpha_gradient_light_tube_1 — conversation, google
- - `light.alphabed_ceiling_light_5` — light.alphabed_ceiling_light_5 — conversation, google
- - `light.alphadoor_ceiling_light_6` — alphadoor ceiling light.6 — conversation, google
- - `light.bathroom` — light.bathroom — conversation, google
- - `light.bedroom_ceiling` — light.bedroom_ceiling — conversation, google
- - `light.bedroom_lamps` — light.bedroom_lamps — conversation, google
- - `light.beta_bedroom_bath` — light.beta_bedroom_bath — conversation, google
- - `light.fado_glass_globe_lamp` — light.fado_glass_globe_lamp — conversation, google
- - `light.hue_play_1` — light.hue_play_1 — conversation, google
- - `light.hue_play_2` — light.hue_play_2 — conversation, google
- - `light.hue_smart_plug_1` — light.hue_smart_plug_1 — conversation, google
- - `light.kitchen` — light.kitchen — conversation, google
- - `light.kitchen_ceiling` — light.kitchen_ceiling — conversation, google
- - `light.laundry_room` — light.laundry_room — conversation, google
- - `light.living_room` — light.living_room — conversation, google
- - `light.living_room_ceiling` — light.living_room_ceiling — conversation, google
- - `light.living_room_lamps` — light.living_room_lamps — conversation, google
- - `light.nyamane_3_spot_lamp_top` — light.nyamane_3_spot_lamp_top — conversation, google
- - `light.nymane_3_spot_lamp_low` — light.nymane_3_spot_lamp_low — conversation, google
- - `light.nymane_3_spot_lamp_mid` — light.nymane_3_spot_lamp_mid — conversation, google
- - `light.ola_whitborg_xl_floor_lamp` — light.ola_whitborg_xl_floor_lamp — conversation, google
- - `light.right_bedside_lamp` — light.right_bedside_lamp — conversation, google
- - `light.secondary_bathroom` — light.secondary_bathroom — conversation, google
- - `light.signe_gradient_floor_1` — light.signe_gradient_floor_1 — conversation, google
- - `light.signe_gradient_table_1` — light.signe_gradient_table_1 — conversation, google
- - `light.spare_bedroom_ceiling` — light.spare_bedroom_ceiling — conversation, google
- - `light.wiz_a60_filament` — light.wiz_a60_filament — conversation, google
- - `media_player.bedroom_apple_tv` — media_player.bedroom_apple_tv — conversation, google
- - `media_player.core_lounge_homepod` — media_player.core_lounge_homepod — conversation, google
- - `media_player.core_lounge_homepod_2` — media_player.core_lounge_homepod_2 — conversation, google
- - `media_player.living_room_2` — media_player.living_room_2 — conversation, google
- - `media_player.lounge_apple_tv_wired` — media_player.lounge_apple_tv_wired — conversation, google
- - `media_player.nesthubd029` — media_player.nesthubd029 — conversation, google
- - `media_player.nesthubd029_2` — media_player.nesthubd029_2 — conversation, google
- - `media_player.nesthubd029_3` — media_player.nesthubd029_3 — conversation, google
- - `media_player.orange_homepod_mini` — media_player.orange_homepod_mini — conversation, google
- - `media_player.white_homepod_mini` — media_player.white_homepod_mini — conversation, google
- - `scene.bedroom_concentrate` — Concentrate — conversation, google
- - `scene.bedroom_dimmed` — Dimmed — conversation, google
- - `scene.bedroom_energise` — Energise — conversation, google
- - `scene.bedroom_nightlight` — Nightlight — conversation, google
- - `scene.bedroom_read` — Read — conversation, google
- - `scene.bedroom_relax` — Relax — conversation, google
- - `scene.bedroom_sleepy` — Sleepy — conversation, google
- - `scene.hallway_concentrate` — Concentrate — conversation, google
- - `scene.hallway_energise` — Energise — conversation, google
- - `scene.hallway_nightlight` — Nightlight — conversation, google
- - `scene.hallway_read` — Read — conversation, google
- - `scene.hallway_relax` — Relax — conversation, google
- - `scene.new_scene` — New scene — conversation, google
- - `sensor.core_300s_pm2_5` — PM2.5 — conversation, google
- - `sensor.hub_3_humisensor_humidity` — Humidity — conversation, google
- - `sensor.hub_3_tempsensor_temperature` — Temperature — conversation, google
- - `switch.bot_4a` — switch.bot_4a — conversation, google
- - `switch.core_300s_child_lock` — Child lock — conversation, google
- - `switch.core_300s_display` — Display — conversation, google

#### Alexa exposed (0)


## 8. YAML / Config Surface

### YAML Files

- `/srv/homeassistant/config/automations.yaml`
- `/srv/homeassistant/config/blueprints/automation/Blackshome/sensor-light.yaml`
- `/srv/homeassistant/config/blueprints/automation/follow_me/room_follow_me_atmosphere.yaml`
- `/srv/homeassistant/config/blueprints/automation/homeassistant/motion_light.yaml`
- `/srv/homeassistant/config/blueprints/automation/homeassistant/notify_leaving_zone.yaml`
- `/srv/homeassistant/config/blueprints/script/homeassistant/confirmable_notification.yaml`
- `/srv/homeassistant/config/configuration.yaml`
- `/srv/homeassistant/config/packages/.example.yaml`
- `/srv/homeassistant/config/packages/test_mode.yaml`
- `/srv/homeassistant/config/scenes.yaml`
- `/srv/homeassistant/config/scripts.yaml`
- `/srv/homeassistant/config/secrets.yaml`

### YAML Line Counts

| File | Lines |
| --- | ---: |
| `/srv/homeassistant/config/automations.yaml` | 1 |
| `/srv/homeassistant/config/blueprints/automation/Blackshome/sensor-light.yaml` | 10567 |
| `/srv/homeassistant/config/blueprints/automation/follow_me/room_follow_me_atmosphere.yaml` | 199 |
| `/srv/homeassistant/config/blueprints/automation/homeassistant/motion_light.yaml` | 58 |
| `/srv/homeassistant/config/blueprints/automation/homeassistant/notify_leaving_zone.yaml` | 50 |
| `/srv/homeassistant/config/blueprints/script/homeassistant/confirmable_notification.yaml` | 86 |
| `/srv/homeassistant/config/configuration.yaml` | 20 |
| `/srv/homeassistant/config/packages/.example.yaml` | 1 |
| `/srv/homeassistant/config/packages/test_mode.yaml` | 15 |
| `/srv/homeassistant/config/scenes.yaml` | 18 |
| `/srv/homeassistant/config/scripts.yaml` | 0 |
| `/srv/homeassistant/config/secrets.yaml` | 4 |

## 9. Raw Appendix: Full Entity Table

| Entity | Name | Platform | Device | Area | Category | Disabled | Exposure |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `binary_sensor.absence_for_3mins_dining_zone_occupancy` | Occupancy | matter | Absence for 3mins dining zone |  |  |  |  |
| `binary_sensor.absence_for_3mins_dining_zone_occupancy_2` | Occupancy | matter | Absence for 3mins dining zone |  |  |  |  |
| `binary_sensor.absence_for_3mins_kitchen_zone_occupancy` | Occupancy | matter | Absence for 3mins kitchen zone |  |  |  |  |
| `binary_sensor.absence_for_3mins_kitchen_zone_occupancy_2` | Occupancy | matter | Absence for 3mins kitchen zone |  |  |  |  |
| `binary_sensor.absence_for_3mins_living_zone_occupancy` | Occupancy | matter | Absence for 3mins living zone |  |  |  |  |
| `binary_sensor.absence_for_3mins_living_zone_occupancy_2` | Occupancy | matter | Absence for 3mins living zone |  |  |  |  |
| `binary_sensor.absence_for_5mins_openplan_occupancy` | Occupancy | matter | Absence for 5mins Openplan |  |  |  |  |
| `binary_sensor.absence_for_5mins_openplan_occupancy_2` | Occupancy | matter | Absence for 5mins Openplan |  |  |  |  |
| `binary_sensor.approaching_openplan_room_occupancy` | Occupancy | matter | Approaching Openplan room |  |  |  |  |
| `binary_sensor.approaching_openplan_room_occupancy_2` | Occupancy | matter | Approaching Openplan room |  |  |  |  |
| `binary_sensor.aqara_curtain_driver_e1_problem` | Problem | matter | Aqara Curtain Driver E1 |  | diagnostic |  |  |
| `binary_sensor.aqara_curtain_driver_e1_problem_2` | Problem | matter | Aqara Curtain Driver E1 |  | diagnostic |  |  |
| `binary_sensor.aqara_curtain_driver_e1_problem_3` | Problem | matter | Aqara Curtain Driver E1 |  | diagnostic |  |  |
| `binary_sensor.aqara_curtain_driver_e1_problem_4` | Problem | matter | Aqara Curtain Driver E1 |  | diagnostic |  |  |
| `binary_sensor.aqara_door_and_window_sensor_door` | Door | matter | Aqara Door and Window Sensor |  |  |  | conversation, google |
| `binary_sensor.aqara_door_and_window_sensor_door_10` | Door | matter | Aqara Door and Window Sensor |  |  |  | conversation, google |
| `binary_sensor.aqara_door_and_window_sensor_door_11` | Door | matter | Aqara Door and Window Sensor |  |  |  | conversation, google |
| `binary_sensor.aqara_door_and_window_sensor_door_12` | Door | matter | Aqara Door and Window Sensor |  |  |  | conversation, google |
| `binary_sensor.aqara_door_and_window_sensor_door_13` | Door | matter | Aqara Door and Window Sensor |  |  |  | conversation, google |
| `binary_sensor.aqara_door_and_window_sensor_door_14` | Door | matter | Aqara Door and Window Sensor |  |  |  | conversation, google |
| `binary_sensor.aqara_door_and_window_sensor_door_2` | Door | matter | Aqara Door and Window Sensor |  |  |  | conversation, google |
| `binary_sensor.aqara_door_and_window_sensor_door_3` | Door | matter | Aqara Door and Window Sensor |  |  |  | conversation, google |
| `binary_sensor.aqara_door_and_window_sensor_door_4` | Door | matter | Aqara Door and Window Sensor |  |  |  | conversation, google |
| `binary_sensor.aqara_door_and_window_sensor_door_5` | Door | matter | Aqara Door and Window Sensor |  |  |  | conversation, google |
| `binary_sensor.aqara_door_and_window_sensor_door_6` | Door | matter | Aqara Door and Window Sensor |  |  |  | conversation, google |
| `binary_sensor.aqara_door_and_window_sensor_door_7` | Door | matter | Aqara Door and Window Sensor |  |  |  | conversation, google |
| `binary_sensor.aqara_door_and_window_sensor_door_8` | Door | matter | Aqara Door and Window Sensor |  |  |  | conversation, google |
| `binary_sensor.aqara_door_and_window_sensor_door_9` | Door | matter | Aqara Door and Window Sensor |  |  |  | conversation, google |
| `binary_sensor.aqara_motion_sensor_p1_occupancy` | Occupancy | matter | Aqara Motion Sensor P1 |  |  |  |  |
| `binary_sensor.aqara_motion_sensor_p1_occupancy_2` | Occupancy | matter | Aqara Motion Sensor P1 |  |  |  |  |
| `binary_sensor.aqara_motion_sensor_p1_occupancy_3` | Occupancy | matter | Aqara Motion Sensor P1 |  |  |  |  |
| `binary_sensor.aqara_motion_sensor_p1_occupancy_4` | Occupancy | matter | Aqara Motion Sensor P1 |  |  |  |  |
| `binary_sensor.aqara_presence_sensor_fp1e_occupancy` | Occupancy | matter | Aqara Presence Sensor FP1E |  |  |  |  |
| `binary_sensor.aqara_presence_sensor_fp1e_occupancy_2` | Occupancy | matter | Aqara Presence Sensor FP1E |  |  |  |  |
| `binary_sensor.aqara_presence_sensor_fp1e_occupancy_3` | Occupancy | matter | Aqara Presence Sensor FP1E |  |  |  |  |
| `binary_sensor.aqara_presence_sensor_fp1e_occupancy_4` | Occupancy | matter | Aqara Presence Sensor FP1E |  |  |  |  |
| `binary_sensor.aqara_vibration_sensor_occupancy` | Occupancy | matter | Aqara Vibration Sensor |  |  |  |  |
| `binary_sensor.aqara_vibration_sensor_occupancy_2` | Occupancy | matter | Aqara Vibration Sensor |  |  |  |  |
| `binary_sensor.bathroom_motion` | Motion | hue | Bathroom | My Bathroom |  |  | conversation, google |
| `binary_sensor.beta_bedroom_no_presence_3mins_occupancy` | Occupancy | matter | Beta bedroom no presence 3mins |  |  |  |  |
| `binary_sensor.beta_bedroom_no_presence_3mins_occupancy_2` | Occupancy | matter | Beta bedroom no presence 3mins |  |  |  |  |
| `binary_sensor.beta_bedroom_presence_detected_occupancy` | Occupancy | matter | Beta bedroom presence detected |  |  |  |  |
| `binary_sensor.beta_bedroom_presence_detected_occupancy_2` | Occupancy | matter | Beta bedroom presence detected |  |  |  |  |
| `binary_sensor.hallway_motionaware_ceiling` | Hallway MotionAware Ceiling | hue | Hallway | Hallway (Pass) |  |  | conversation, google |
| `binary_sensor.hub_3_motionsensor_occupancy` | Occupancy | matter | Hub 3 MotionSensor |  |  |  |  |
| `binary_sensor.hue_motion_sensor_motion` | Motion | hue | Hue Motion Sensor | Spare Bedroom |  |  | conversation |
| `binary_sensor.hue_motion_sensor_motion_2` | Motion | hue | Hue Motion Sensor | Ensuite (Throne) Bathroom |  |  | conversation |
| `binary_sensor.iphone_16pro_max_focus` | iPhone 16Pro Max  Focus | mobile_app | iPhone 16Pro Max  |  |  |  |  |
| `binary_sensor.macbook_air_active` | MacBook Air  Active | mobile_app | MacBook Air  |  |  |  |  |
| `binary_sensor.macbook_air_audio_input_in_use` | MacBook Air  Audio Input In Use | mobile_app | MacBook Air  |  |  |  |  |
| `binary_sensor.macbook_air_audio_output_in_use` | MacBook Air  Audio Output In Use | mobile_app | MacBook Air  |  |  |  |  |
| `binary_sensor.macbook_air_camera_in_use` | MacBook Air  Camera In Use | mobile_app | MacBook Air  |  |  |  |  |
| `binary_sensor.presence_dining_zone_occupancy` | Occupancy | matter | Presence Dining zone |  |  |  |  |
| `binary_sensor.presence_dining_zone_occupancy_2` | Occupancy | matter | Presence Dining zone |  |  |  |  |
| `binary_sensor.presence_kitchen_zone_occupancy` | Occupancy | matter | Presence kitchen zone |  |  |  |  |
| `binary_sensor.presence_kitchen_zone_occupancy_2` | Occupancy | matter | Presence kitchen zone |  |  |  |  |
| `binary_sensor.presence_living_zone_occupancy` | Occupancy | matter | Presence living zone |  |  |  |  |
| `binary_sensor.presence_living_zone_occupancy_2` | Occupancy | matter | Presence living zone |  |  |  |  |
| `binary_sensor.remote_ui` | Remote UI | cloud |  |  | diagnostic |  |  |
| `binary_sensor.roller_shade_0a_problem` | Problem | matter | Roller Shade 0A |  | diagnostic |  |  |
| `binary_sensor.roller_shade_2a_problem` | Problem | matter | Roller Shade 2A |  | diagnostic |  |  |
| `binary_sensor.roller_shade_84_problem` | Problem | matter | Roller Shade 84 |  | diagnostic |  |  |
| `binary_sensor.secondary_bathroom_motion` | Motion | hue | Secondary Bathroom | Secondary Bathroom |  |  | conversation, google |
| `binary_sensor.sun_solar_rising` | Solar rising | sun | Sun |  | diagnostic | integration |  |
| `binary_sensor.withings_in_bed` | In bed | withings | Withings | Bedroom (Alpha) |  |  | conversation |
| `button.absence_for_3mins_dining_zone_identify` | Identify | matter | Absence for 3mins dining zone |  | diagnostic |  |  |
| `button.absence_for_3mins_dining_zone_identify_2` | Identify | matter | Absence for 3mins dining zone |  | diagnostic |  |  |
| `button.absence_for_3mins_kitchen_zone_identify` | Identify | matter | Absence for 3mins kitchen zone |  | diagnostic |  |  |
| `button.absence_for_3mins_kitchen_zone_identify_2` | Identify | matter | Absence for 3mins kitchen zone |  | diagnostic |  |  |
| `button.absence_for_3mins_living_zone_identify` | Identify | matter | Absence for 3mins living zone |  | diagnostic |  |  |
| `button.absence_for_3mins_living_zone_identify_2` | Identify | matter | Absence for 3mins living zone |  | diagnostic |  |  |
| `button.absence_for_5mins_openplan_identify` | Identify | matter | Absence for 5mins Openplan |  | diagnostic |  |  |
| `button.absence_for_5mins_openplan_identify_2` | Identify | matter | Absence for 5mins Openplan |  | diagnostic |  |  |
| `button.approaching_openplan_room_identify` | Identify | matter | Approaching Openplan room |  | diagnostic |  |  |
| `button.approaching_openplan_room_identify_2` | Identify | matter | Approaching Openplan room |  | diagnostic |  |  |
| `button.aqara_curtain_driver_e1_identify` | Identify | matter | Aqara Curtain Driver E1 |  | diagnostic |  |  |
| `button.aqara_curtain_driver_e1_identify_2` | Identify | matter | Aqara Curtain Driver E1 |  | diagnostic |  |  |
| `button.aqara_curtain_driver_e1_identify_3` | Identify | matter | Aqara Curtain Driver E1 |  | diagnostic |  |  |
| `button.aqara_curtain_driver_e1_identify_4` | Identify | matter | Aqara Curtain Driver E1 |  | diagnostic |  |  |
| `button.aqara_door_and_window_sensor_identify` | Identify | matter | Aqara Door and Window Sensor |  | diagnostic |  |  |
| `button.aqara_door_and_window_sensor_identify_10` | Identify | matter | Aqara Door and Window Sensor |  | diagnostic |  |  |
| `button.aqara_door_and_window_sensor_identify_11` | Identify | matter | Aqara Door and Window Sensor |  | diagnostic |  |  |
| `button.aqara_door_and_window_sensor_identify_12` | Identify | matter | Aqara Door and Window Sensor |  | diagnostic |  |  |
| `button.aqara_door_and_window_sensor_identify_13` | Identify | matter | Aqara Door and Window Sensor |  | diagnostic |  |  |
| `button.aqara_door_and_window_sensor_identify_14` | Identify | matter | Aqara Door and Window Sensor |  | diagnostic |  |  |
| `button.aqara_door_and_window_sensor_identify_2` | Identify | matter | Aqara Door and Window Sensor |  | diagnostic |  |  |
| `button.aqara_door_and_window_sensor_identify_3` | Identify | matter | Aqara Door and Window Sensor |  | diagnostic |  |  |
| `button.aqara_door_and_window_sensor_identify_4` | Identify | matter | Aqara Door and Window Sensor |  | diagnostic |  |  |
| `button.aqara_door_and_window_sensor_identify_5` | Identify | matter | Aqara Door and Window Sensor |  | diagnostic |  |  |
| `button.aqara_door_and_window_sensor_identify_6` | Identify | matter | Aqara Door and Window Sensor |  | diagnostic |  |  |
| `button.aqara_door_and_window_sensor_identify_7` | Identify | matter | Aqara Door and Window Sensor |  | diagnostic |  |  |
| `button.aqara_door_and_window_sensor_identify_8` | Identify | matter | Aqara Door and Window Sensor |  | diagnostic |  |  |
| `button.aqara_door_and_window_sensor_identify_9` | Identify | matter | Aqara Door and Window Sensor |  | diagnostic |  |  |
| `button.aqara_hub_m3_identify` | Identify | matter | Aqara Hub M3 |  | diagnostic |  |  |
| `button.aqara_hub_m3_identify_2` | Identify | matter | Aqara Hub M3 |  | diagnostic |  |  |
| `button.aqara_motion_sensor_p1_identify` | Identify | matter | Aqara Motion Sensor P1 |  | diagnostic |  |  |
| `button.aqara_motion_sensor_p1_identify_2` | Identify | matter | Aqara Motion Sensor P1 |  | diagnostic |  |  |
| `button.aqara_motion_sensor_p1_identify_3` | Identify | matter | Aqara Motion Sensor P1 |  | diagnostic |  |  |
| `button.aqara_motion_sensor_p1_identify_4` | Identify | matter | Aqara Motion Sensor P1 |  | diagnostic |  |  |
| `button.aqara_presence_sensor_fp1e_identify` | Identify | matter | Aqara Presence Sensor FP1E |  | diagnostic |  |  |
| `button.aqara_presence_sensor_fp1e_identify_2` | Identify | matter | Aqara Presence Sensor FP1E |  | diagnostic |  |  |
| `button.aqara_presence_sensor_fp1e_identify_3` | Identify | matter | Aqara Presence Sensor FP1E |  | diagnostic |  |  |
| `button.aqara_presence_sensor_fp1e_identify_4` | Identify | matter | Aqara Presence Sensor FP1E |  | diagnostic |  |  |
| `button.aqara_vibration_sensor_identify` | Identify | matter | Aqara Vibration Sensor |  | diagnostic |  |  |
| `button.aqara_vibration_sensor_identify_2` | Identify | matter | Aqara Vibration Sensor |  | diagnostic |  |  |
| `button.aqara_wireless_remote_switch_identify` | Identify | matter | Aqara Wireless Remote Switch |  | diagnostic |  |  |
| `button.aqara_wireless_remote_switch_identify_2` | Identify | matter | Aqara Wireless Remote Switch |  | diagnostic |  |  |
| `button.aqara_wireless_remote_switch_identify_3` | Identify | matter | Aqara Wireless Remote Switch |  | diagnostic |  |  |
| `button.aqara_wireless_remote_switch_identify_4` | Identify | matter | Aqara Wireless Remote Switch |  | diagnostic |  |  |
| `button.beta_bedroom_no_presence_3mins_identify` | Identify | matter | Beta bedroom no presence 3mins |  | diagnostic |  |  |
| `button.beta_bedroom_no_presence_3mins_identify_2` | Identify | matter | Beta bedroom no presence 3mins |  | diagnostic |  |  |
| `button.beta_bedroom_presence_detected_identify` | Identify | matter | Beta bedroom presence detected |  | diagnostic |  |  |
| `button.beta_bedroom_presence_detected_identify_2` | Identify | matter | Beta bedroom presence detected |  | diagnostic |  |  |
| `button.presence_dining_zone_identify` | Identify | matter | Presence Dining zone |  | diagnostic |  |  |
| `button.presence_dining_zone_identify_2` | Identify | matter | Presence Dining zone |  | diagnostic |  |  |
| `button.presence_kitchen_zone_identify` | Identify | matter | Presence kitchen zone |  | diagnostic |  |  |
| `button.presence_kitchen_zone_identify_2` | Identify | matter | Presence kitchen zone |  | diagnostic |  |  |
| `button.presence_living_zone_identify` | Identify | matter | Presence living zone |  | diagnostic |  |  |
| `button.presence_living_zone_identify_2` | Identify | matter | Presence living zone |  | diagnostic |  |  |
| `button.switchbot_hub_3_identify` | Identify | matter | SwitchBot Hub 3 |  | diagnostic |  |  |
| `button.wiz_a60_filament_identify` | Identify | matter | WiZ A60 Filament |  | diagnostic |  |  |
| `cover.aqara_curtain_driver_e1` | cover.aqara_curtain_driver_e1 | matter | Aqara Curtain Driver E1 |  |  |  | conversation, google |
| `cover.aqara_curtain_driver_e1_2` | cover.aqara_curtain_driver_e1_2 | matter | Aqara Curtain Driver E1 |  |  |  | conversation, google |
| `cover.aqara_curtain_driver_e1_3` | cover.aqara_curtain_driver_e1_3 | matter | Aqara Curtain Driver E1 |  |  |  | conversation, google |
| `cover.aqara_curtain_driver_e1_4` | cover.aqara_curtain_driver_e1_4 | matter | Aqara Curtain Driver E1 |  |  |  | conversation, google |
| `cover.roller_shade_0a` | cover.roller_shade_0a | matter | Roller Shade 0A |  |  |  | conversation, google |
| `cover.roller_shade_2a` | cover.roller_shade_2a | matter | Roller Shade 2A |  |  |  | conversation, google |
| `cover.roller_shade_84` | cover.roller_shade_84 | matter | Roller Shade 84 |  |  |  | conversation, google |
| `device_tracker.ipad_pro` | Jeff’s iPad | mobile_app | Jeff’s iPad |  | diagnostic |  |  |
| `device_tracker.iphone_16pro_max` | iPhone 16Pro Max  | mobile_app | iPhone 16Pro Max  |  | diagnostic |  |  |
| `device_tracker.iphone_17_pro_max` | Jeff’s iPhone | mobile_app | Jeff’s iPhone |  | diagnostic |  |  |
| `device_tracker.macbook_air` | MacBook Air  | mobile_app | MacBook Air  |  | diagnostic |  |  |
| `event.alpha_bedroom_dial_switch_button_1` | Button 1 | hue | Alpha Bedroom Dial Switch | Bedroom (Alpha) |  |  |  |
| `event.alpha_bedroom_dial_switch_button_2` | Button 2 | hue | Alpha Bedroom Dial Switch | Bedroom (Alpha) |  |  |  |
| `event.alpha_bedroom_dial_switch_button_3` | Button 3 | hue | Alpha Bedroom Dial Switch | Bedroom (Alpha) |  |  |  |
| `event.alpha_bedroom_dial_switch_button_4` | Button 4 | hue | Alpha Bedroom Dial Switch | Bedroom (Alpha) |  |  |  |
| `event.alpha_bedroom_dial_switch_rotary` | Rotary | hue | Alpha Bedroom Dial Switch | Bedroom (Alpha) |  |  |  |
| `event.alpha_hue_smart_button_button_1` | Button 1 | hue | Alpha Hue Smart Button | Bedroom (Alpha) |  |  |  |
| `event.aqara_wireless_remote_switch_button` | Button | matter | Aqara Wireless Remote Switch |  |  |  |  |
| `event.aqara_wireless_remote_switch_button_2` | Button | matter | Aqara Wireless Remote Switch |  |  |  |  |
| `event.aqara_wireless_remote_switch_button_3` | Button | matter | Aqara Wireless Remote Switch |  |  |  |  |
| `event.aqara_wireless_remote_switch_button_4` | Button | matter | Aqara Wireless Remote Switch |  |  |  |  |
| `event.backup_automatic_backup` | Automatic backup | backup | Backup |  |  |  |  |
| `event.bathroom_dimmer_switch_button_1` | Button 1 | hue | Bathroom dimmer switch | Ensuite (Throne) Bathroom |  |  |  |
| `event.bathroom_dimmer_switch_button_2` | Button 2 | hue | Bathroom dimmer switch | Ensuite (Throne) Bathroom |  |  |  |
| `event.bathroom_dimmer_switch_button_3` | Button 3 | hue | Bathroom dimmer switch | Ensuite (Throne) Bathroom |  |  |  |
| `event.bathroom_dimmer_switch_button_4` | Button 4 | hue | Bathroom dimmer switch | Ensuite (Throne) Bathroom |  |  |  |
| `event.core_tap_dial_light_switch_button_1` | Button 1 | hue | Core Tap Dial Light Switch | Openplan (Core) |  |  |  |
| `event.core_tap_dial_light_switch_button_2` | Button 2 | hue | Core Tap Dial Light Switch | Openplan (Core) |  |  |  |
| `event.core_tap_dial_light_switch_button_3` | Button 3 | hue | Core Tap Dial Light Switch | Openplan (Core) |  |  |  |
| `event.core_tap_dial_light_switch_button_4` | Button 4 | hue | Core Tap Dial Light Switch | Openplan (Core) |  |  |  |
| `event.core_tap_dial_light_switch_rotary` | Rotary | hue | Core Tap Dial Light Switch | Openplan (Core) |  |  |  |
| `event.hallway_dimmer_switch_button_1` | Button 1 | hue | Hallway Dimmer Switch | Hallway (Pass) |  |  |  |
| `event.hallway_dimmer_switch_button_2` | Button 2 | hue | Hallway Dimmer Switch | Hallway (Pass) |  |  |  |
| `event.hallway_dimmer_switch_button_3` | Button 3 | hue | Hallway Dimmer Switch | Hallway (Pass) |  |  |  |
| `event.hallway_dimmer_switch_button_4` | Button 4 | hue | Hallway Dimmer Switch | Hallway (Pass) |  |  |  |
| `event.hallway_tap_dial_switch_button_1` | Button 1 | hue | Hallway Tap Dial Switch | Spare Bedroom |  |  |  |
| `event.hallway_tap_dial_switch_button_2` | Button 2 | hue | Hallway Tap Dial Switch | Spare Bedroom |  |  |  |
| `event.hallway_tap_dial_switch_button_3` | Button 3 | hue | Hallway Tap Dial Switch | Spare Bedroom |  |  |  |
| `event.hallway_tap_dial_switch_button_4` | Button 4 | hue | Hallway Tap Dial Switch | Spare Bedroom |  |  |  |
| `event.hallway_tap_dial_switch_rotary` | Rotary | hue | Hallway Tap Dial Switch | Spare Bedroom |  |  |  |
| `event.hub_3_button_1_button` | Button | matter | Hub 3 Button 1 |  |  |  |  |
| `event.hub_3_button_2_button` | Button | matter | Hub 3 Button 2 |  |  |  |  |
| `event.hub_3_button_3_button` | Button | matter | Hub 3 Button 3 |  |  |  |  |
| `event.hue_smart_button_2_button_1` | Button 1 | hue | Hue smart button 2 |  |  |  |  |
| `event.hue_smart_button_3_button_1` | Button 1 | hue | Hue smart button 3 |  |  |  |  |
| `event.splash_dimmer_switch_button_1` | Button 1 | hue | Splash Dimmer Switch | Secondary Bathroom |  |  |  |
| `event.splash_dimmer_switch_button_2` | Button 2 | hue | Splash Dimmer Switch | Secondary Bathroom |  |  |  |
| `event.splash_dimmer_switch_button_3` | Button 3 | hue | Splash Dimmer Switch | Secondary Bathroom |  |  |  |
| `event.splash_dimmer_switch_button_4` | Button 4 | hue | Splash Dimmer Switch | Secondary Bathroom |  |  |  |
| `fan.core_300s` | fan.core_300s | vesync | Core 300S | Bedroom |  |  | conversation, google |
| `input_boolean.test_mode` | Test Mode | input_boolean |  |  |  |  |  |
| `light.all_bedroom_bathroom` | light.all_bedroom_bathroom | hue | All Bedroom & Bathroom | Bedroom |  |  | conversation, google |
| `light.alpha_ceiling_light_4` | light.alpha_ceiling_light_4 | hue | Alpha Ceiling Light.4 | Bedroom (Alpha) |  |  | conversation |
| `light.alpha_ceiling_light_6` | light.alpha_ceiling_light_6 | hue | Alpha Ceiling Light.6 | Bedroom |  |  | conversation, google |
| `light.alpha_gradient_light_tube_1` | light.alpha_gradient_light_tube_1 | hue | alpha gradient light-tube.1 | Bedroom |  |  | conversation, google |
| `light.alphabed_ceiling_light_3` | light.alphabed_ceiling_light_3 | hue | Alphabed Ceiling Light.3 | Bedroom (Alpha) |  |  | conversation |
| `light.alphabed_ceiling_light_5` | light.alphabed_ceiling_light_5 | hue | Alphabed Ceiling Light.5 | Bedroom (Alpha) |  |  | conversation, google |
| `light.alphabed_ceiling_light_5_2` | light.alphabed_ceiling_light_5_2 | hue | Alphabed Ceiling Light.5 | Bedroom (Alpha) |  |  | conversation |
| `light.alphadoor_ceiling_light_6` | alphadoor ceiling light.6 | hue | Alpha Ceiling Light.6 | Bedroom (Alpha) |  |  | conversation, google |
| `light.bathroom` | light.bathroom | hue | Bathroom | My Bathroom |  |  | conversation, google |
| `light.bedroom` | light.bedroom | hue | Bedroom | Bedroom (Alpha) |  |  | conversation |
| `light.bedroom_ceiling` | light.bedroom_ceiling | hue | Bedroom Ceiling | Bedroom |  |  | conversation, google |
| `light.bedroom_lamps` | light.bedroom_lamps | hue | Bedroom Lamps | Bedroom |  |  | conversation, google |
| `light.beige_ola_spotlight_lamp` | light.beige_ola_spotlight_lamp | hue | Beige Ola Spotlight Lamp | Living Room |  |  | conversation |
| `light.beta_bed_lightstrip` | light.beta_bed_lightstrip | hue | Beta Bed Lightstrip | Spare Bedroom |  |  | conversation |
| `light.beta_bedroom_bath` | light.beta_bedroom_bath | hue | Beta Bedroom & Bath | Spare Bedroom |  |  | conversation, google |
| `light.beta_ceiling_light_3` | light.beta_ceiling_light_3 | hue | Beta Ceiling Light.3 | Spare Bedroom |  |  | conversation |
| `light.beta_ceiling_light_3_2` | light.beta_ceiling_light_3_2 | hue | Beta Ceiling Light.3 | Spare Bedroom |  |  | conversation |
| `light.beta_ceiling_light_4` | light.beta_ceiling_light_4 | hue | Beta Ceiling Light.4 | Spare Bedroom |  |  | conversation |
| `light.beta_ceiling_light_6` | light.beta_ceiling_light_6 | hue | Beta Ceiling Light.6 | Spare Bedroom |  |  | conversation |
| `light.betaflex_ceiling_light_1` | Betaflex Ceiling Light.1 | hue | Betaflex Ceiling Light.1 | Spare Bedroom |  |  | conversation |
| `light.betaflex_ceiling_light_2` | light.betaflex_ceiling_light_2 | hue | Betaflex Ceiling Light.2 | Spare Bedroom |  |  | conversation |
| `light.core_ceiling_3` | light.core_ceiling_3 | hue | core ceiling.3 | Bedroom (Alpha) |  |  | conversation |
| `light.core_ceiling_light_1` | light.core_ceiling_light_1 | hue | Core Ceiling Light.1 | Openplan (Core) |  |  | conversation |
| `light.core_ceiling_light_10` | light.core_ceiling_light_10 | hue | Core Ceiling Light.10 | Openplan (Core) |  |  | conversation |
| `light.core_ceiling_light_2` | light.core_ceiling_light_2 | hue | Core Ceiling Light.2 | Openplan (Core) |  |  | conversation |
| `light.core_ceiling_light_4` | light.core_ceiling_light_4 | hue | Core Ceiling Light.4 | Openplan (Core) |  |  | conversation |
| `light.core_ceiling_light_5` | light.core_ceiling_light_5 | hue | Core Ceiling Light.5 | Openplan (Core) |  |  | conversation |
| `light.core_ceiling_light_5_2` | light.core_ceiling_light_5_2 | hue | Core Ceiling Light.5 | Living Room |  |  | conversation |
| `light.core_ceiling_light_6` | light.core_ceiling_light_6 | hue | Core Ceiling Light.6 | Openplan (Core) |  |  | conversation |
| `light.core_ceiling_light_7` | Core Ceiling Light.7 | hue | Core Ceiling Light.4 | Openplan (Core) |  |  | conversation |
| `light.core_ceiling_light_8` | light.core_ceiling_light_8 | hue | Core Ceiling Light.8 | Openplan (Core) |  |  | conversation |
| `light.core_ceiling_light_9` | light.core_ceiling_light_9 | hue | Core Ceiling Light.9 | Core_kitchen |  |  | conversation |
| `light.core_statement_arc_floor_lamp_monica_vibelucci` | light.core_statement_arc_floor_lamp_monica_vibelucci | hue | Core Statement Arc Floor Lamp Monica Vibelucci | Openplan (Core) |  |  | conversation |
| `light.fado_glass_globe_lamp` | light.fado_glass_globe_lamp | hue | fado glass globe lamp |  |  |  | conversation, google |
| `light.hallway` | light.hallway | hue | Hallway | Hallway (Pass) |  |  | conversation |
| `light.hue_play_1` | light.hue_play_1 | hue | Hue Play 1 |  |  |  | conversation, google |
| `light.hue_play_2` | light.hue_play_2 | hue | Hue Play 2 |  |  |  | conversation, google |
| `light.hue_signe_white_gradient_floor_lamp_1` | light.hue_signe_white_gradient_floor_lamp_1 | hue | Hue Signe White Gradient Floor Lamp.1 | Openplan (Core) |  |  | conversation |
| `light.hue_smart_plug_1` | light.hue_smart_plug_1 | hue | Hue smart plug 1 |  |  |  | conversation, google |
| `light.ikea_skytrax_light` | light.ikea_skytrax_light | hue | Ikea Skytrax Light | Bedroom |  |  | conversation |
| `light.kitchen` | light.kitchen | hue | Kitchen | Core_kitchen |  |  | conversation, google |
| `light.kitchen_ceiling` | light.kitchen_ceiling | hue | Kitchen Ceiling | Core_kitchen |  |  | conversation, google |
| `light.klasnick_beige_table_lamp_with_e14_hue_colour` | light.klasnick_beige_table_lamp_with_e14_hue_colour | hue | Klasnick Beige Table Lamp (with E14 Hue Colour) | Openplan (Core) |  |  | conversation |
| `light.laundry_chaos_ceiling_light` | light.laundry_chaos_ceiling_light | hue | Laundry (Chaos) Ceiling Light | Laundry/Utilities |  |  | conversation |
| `light.laundry_room` | light.laundry_room | hue | Laundry room | Laundry room |  |  | conversation, google |
| `light.living_room` | light.living_room | hue | Living room | Living Room |  |  | conversation, google |
| `light.living_room_ceiling` | light.living_room_ceiling | hue | Core Living Ceiling | Living Room |  |  | conversation, google |
| `light.living_room_lamps` | light.living_room_lamps | hue | Living room lamps | Living Room |  |  | conversation, google |
| `light.nyamane_3_spot_lamp_top` | light.nyamane_3_spot_lamp_top | hue | Nyamane 3-spot Lamp - Top  |  |  |  | conversation, google |
| `light.nymane_3_spot_lamp_low` | light.nymane_3_spot_lamp_low | hue | Nymane 3-spot Lamp - Low | Bedroom (Alpha) |  |  | conversation, google |
| `light.nymane_3_spot_lamp_mid` | light.nymane_3_spot_lamp_mid | hue | Nymane 3-spot Lamp - Mid |  |  |  | conversation, google |
| `light.ola_whitborg_xl_floor_lamp` | light.ola_whitborg_xl_floor_lamp | hue | Ola Whitborg XL Floor Lamp |  |  |  | conversation, google |
| `light.pass_ceiling_light_1` | light.pass_ceiling_light_1 | hue | Pass Ceiling Light.1 | Hallway (Pass) |  |  | conversation |
| `light.pass_ceiling_light_1_2` | light.pass_ceiling_light_1_2 | hue | Pass Ceiling Light.1  | Hallway (Pass) |  |  | conversation |
| `light.pass_ceiling_light_2` | light.pass_ceiling_light_2 | hue | Pass Ceiling Light.2 | Hallway (Pass) |  |  | conversation |
| `light.pass_ceiling_light_4` | light.pass_ceiling_light_4 | hue | Pass Ceiling Light.4 | Hallway (Pass) |  |  | conversation |
| `light.pass_ceiling_light_5` | light.pass_ceiling_light_5 | hue | Pass Ceiling Light.5 | Hallway (Pass) |  |  | conversation |
| `light.right_bedside_lamp` | light.right_bedside_lamp | hue | Right Bedside Lamp | Bedroom |  |  | conversation, google |
| `light.secondary_bathroom` | light.secondary_bathroom | hue | Secondary Bathroom | Secondary Bathroom |  |  | conversation, google |
| `light.signe_gradient_floor_1` | light.signe_gradient_floor_1 | hue | Signe gradient floor 1 | Openplan (Core) |  |  | conversation, google |
| `light.signe_gradient_table_1` | light.signe_gradient_table_1 | hue | Signe gradient table 1 |  |  |  | conversation, google |
| `light.spare_bedroom` | light.spare_bedroom | hue | Spare Bedroom | Spare Bedroom |  |  | conversation |
| `light.spare_bedroom_ceiling` | light.spare_bedroom_ceiling | hue | Spare Bedroom Ceiling | Spare Bedroom |  |  | conversation, google |
| `light.splash_ceiling_light_1` | light.splash_ceiling_light_1 | hue | Splash Ceiling Light.1 | Secondary Bathroom |  |  | conversation |
| `light.splash_ceiling_light_2` | light.splash_ceiling_light_2 | hue | Splash Ceiling Light.2 | Secondary Bathroom |  |  | conversation |
| `light.splash_ceiling_light_3` | light.splash_ceiling_light_3 | hue | Splash Ceiling Light.3 | Secondary Bathroom |  |  | conversation |
| `light.splash_ceiling_light_4` | light.splash_ceiling_light_4 | hue | Splash Ceiling Light.4 | Secondary Bathroom |  |  | conversation |
| `light.splash_ceiling_light_5` | light.splash_ceiling_light_5 | hue | Splash Ceiling Light.5 | Secondary Bathroom |  |  | conversation |
| `light.throne_ceiling_light_2` | light.throne_ceiling_light_2 | hue | Throne Ceiling above shower door | Ensuite (Throne) Bathroom |  |  | conversation |
| `light.throne_ceiling_light_3` | light.throne_ceiling_light_3 | hue | Throne Ceiling Light.3 | Ensuite (Throne) Bathroom |  |  | conversation |
| `light.throne_ceiling_light_3_2` | light.throne_ceiling_light_3_2 | hue | Throne Ceiling above sink | Ensuite (Throne) Bathroom |  |  | conversation |
| `light.throne_ceiling_light_4` | light.throne_ceiling_light_4 | hue | Throne Ceiling above Door | Ensuite (Throne) Bathroom |  |  | conversation |
| `light.white_e27_hue_bulb` | light.white_e27_hue_bulb | hue | White (E27) Hue Bulb | Laundry/Utilities |  |  | conversation |
| `light.wiz_a60_filament` | light.wiz_a60_filament | matter | WiZ A60 Filament |  |  |  | conversation, google |
| `media_player.bedroom_apple_tv` | media_player.bedroom_apple_tv | apple_tv | Bedroom Apple TV | Spare Bedroom |  |  | conversation, google |
| `media_player.bedroom_display` | media_player.bedroom_display | cast | Bedroom Display |  |  |  | conversation |
| `media_player.core_lounge_homepod` | media_player.core_lounge_homepod | apple_tv | Core Lounge HomePod | Living Room |  |  | conversation, google |
| `media_player.core_lounge_homepod_2` | media_player.core_lounge_homepod_2 | apple_tv | Core Lounge HomePod | Living Room |  |  | conversation, google |
| `media_player.living_room_2` | media_player.living_room_2 | apple_tv | Living Room (2) | Living Room (2) |  |  | conversation, google |
| `media_player.lounge_apple_tv_wired` | media_player.lounge_apple_tv_wired | apple_tv | Lounge Apple TV (WIred) | Living Room |  |  | conversation, google |
| `media_player.nesthubd029` | media_player.nesthubd029 | cast | NestHubD029 |  |  |  | conversation, google |
| `media_player.nesthubd029_2` | media_player.nesthubd029_2 | cast | Loft Display |  |  |  | conversation, google |
| `media_player.nesthubd029_3` | media_player.nesthubd029_3 | cast | NestHubD029 |  |  |  | conversation, google |
| `media_player.orange_homepod_mini` | media_player.orange_homepod_mini | apple_tv | Orange HomePod Mini | Bedroom |  |  | conversation, google |
| `media_player.serif_tv` | media_player.serif_tv | cast | Serif TV |  |  |  | conversation |
| `media_player.white_homepod_mini` | media_player.white_homepod_mini | apple_tv | White HomePod Mini | White HomePod Mini |  |  | conversation, google |
| `number.wiz_a60_filament_off_transition_time` | Off transition time | matter | WiZ A60 Filament |  | config |  |  |
| `number.wiz_a60_filament_on_level` | On level | matter | WiZ A60 Filament |  | config |  |  |
| `number.wiz_a60_filament_on_off_transition_time` | On/off transition time | matter | WiZ A60 Filament |  | config |  |  |
| `number.wiz_a60_filament_on_transition_time` | On transition time | matter | WiZ A60 Filament |  | config |  |  |
| `person.jeffffff` | Jeff | person |  |  |  |  |  |
| `remote.bedroom_apple_tv` | remote.bedroom_apple_tv | apple_tv | Bedroom Apple TV | Spare Bedroom |  |  |  |
| `remote.core_lounge_homepod` | remote.core_lounge_homepod | apple_tv | Core Lounge HomePod | Living Room |  |  |  |
| `remote.core_lounge_homepod_2` | remote.core_lounge_homepod_2 | apple_tv | Core Lounge HomePod | Living Room |  |  |  |
| `remote.living_room_2` | remote.living_room_2 | apple_tv | Living Room (2) | Living Room (2) |  |  |  |
| `remote.lounge_apple_tv_wired` | remote.lounge_apple_tv_wired | apple_tv | Lounge Apple TV (WIred) | Living Room |  |  |  |
| `remote.orange_homepod_mini` | remote.orange_homepod_mini | apple_tv | Orange HomePod Mini | Bedroom |  |  |  |
| `remote.white_homepod_mini` | remote.white_homepod_mini | apple_tv | White HomePod Mini | White HomePod Mini |  |  |  |
| `scene.bedroom_concentrate` | Concentrate | hue | Bedroom | Bedroom (Alpha) |  |  | conversation, google |
| `scene.bedroom_dimmed` | Dimmed | hue | Bedroom | Bedroom (Alpha) |  |  | conversation, google |
| `scene.bedroom_energise` | Energise | hue | Bedroom | Bedroom (Alpha) |  |  | conversation, google |
| `scene.bedroom_nightlight` | Nightlight | hue | Bedroom | Bedroom (Alpha) |  |  | conversation, google |
| `scene.bedroom_read` | Read | hue | Bedroom | Bedroom (Alpha) |  |  | conversation, google |
| `scene.bedroom_relax` | Relax | hue | Bedroom | Bedroom (Alpha) |  |  | conversation, google |
| `scene.bedroom_sleepy` | Sleepy | hue | Bedroom | Bedroom (Alpha) |  |  | conversation, google |
| `scene.hallway_concentrate` | Concentrate | hue | Hallway | Hallway (Pass) |  |  | conversation, google |
| `scene.hallway_energise` | Energise | hue | Hallway | Hallway (Pass) |  |  | conversation, google |
| `scene.hallway_nightlight` | Nightlight | hue | Hallway | Hallway (Pass) |  |  | conversation, google |
| `scene.hallway_read` | Read | hue | Hallway | Hallway (Pass) |  |  | conversation, google |
| `scene.hallway_relax` | Relax | hue | Hallway | Hallway (Pass) |  |  | conversation, google |
| `scene.new_scene` | New scene | homeassistant |  |  |  |  | conversation, google |
| `select.wiz_a60_filament_power_on_behaviour_on_startup` | Power-on behaviour on startup | matter | WiZ A60 Filament |  | config |  |  |
| `sensor.alpha_bed_zone_ceiling_2_zigbee_connectivity` | Zigbee connectivity | hue | Alphabed Ceiling Light.5 | Bedroom (Alpha) | diagnostic | integration |  |
| `sensor.alpha_bedroom_dial_switch_battery` | Battery | hue | Alpha Bedroom Dial Switch | Bedroom (Alpha) | diagnostic |  |  |
| `sensor.alpha_bedroom_dial_switch_zigbee_connectivity` | Zigbee connectivity | hue | Alpha Bedroom Dial Switch | Bedroom (Alpha) | diagnostic | integration |  |
| `sensor.alpha_bedroom_hue_smart_button_zigbee_connectivity` | Zigbee connectivity | hue | Alpha Hue Smart Button | Bedroom (Alpha) | diagnostic | integration |  |
| `sensor.alpha_hue_smart_button_battery` | Battery | hue | Alpha Hue Smart Button | Bedroom (Alpha) | diagnostic |  |  |
| `sensor.alpha_pass_ceiling_zigbee_connectivity` | Zigbee connectivity | hue | Pass Ceiling Light.5 | Hallway (Pass) | diagnostic | integration |  |
| `sensor.aqara_curtain_driver_e1_battery` | Battery | matter | Aqara Curtain Driver E1 |  | diagnostic |  |  |
| `sensor.aqara_curtain_driver_e1_battery_2` | Battery | matter | Aqara Curtain Driver E1 |  | diagnostic |  |  |
| `sensor.aqara_curtain_driver_e1_battery_3` | Battery | matter | Aqara Curtain Driver E1 |  | diagnostic |  |  |
| `sensor.aqara_curtain_driver_e1_battery_4` | Battery | matter | Aqara Curtain Driver E1 |  | diagnostic |  |  |
| `sensor.aqara_curtain_driver_e1_battery_charge_state` | Battery charge state | matter | Aqara Curtain Driver E1 |  | diagnostic |  |  |
| `sensor.aqara_curtain_driver_e1_battery_charge_state_2` | Battery charge state | matter | Aqara Curtain Driver E1 |  | diagnostic |  |  |
| `sensor.aqara_curtain_driver_e1_battery_charge_state_3` | Battery charge state | matter | Aqara Curtain Driver E1 |  | diagnostic |  |  |
| `sensor.aqara_curtain_driver_e1_battery_charge_state_4` | Battery charge state | matter | Aqara Curtain Driver E1 |  | diagnostic |  |  |
| `sensor.aqara_curtain_driver_e1_battery_voltage` | Battery voltage | matter | Aqara Curtain Driver E1 |  | diagnostic |  |  |
| `sensor.aqara_curtain_driver_e1_battery_voltage_2` | Battery voltage | matter | Aqara Curtain Driver E1 |  | diagnostic |  |  |
| `sensor.aqara_curtain_driver_e1_battery_voltage_3` | Battery voltage | matter | Aqara Curtain Driver E1 |  | diagnostic |  |  |
| `sensor.aqara_curtain_driver_e1_battery_voltage_4` | Battery voltage | matter | Aqara Curtain Driver E1 |  | diagnostic |  |  |
| `sensor.aqara_curtain_driver_e1_target_opening_position` | Target opening position | matter | Aqara Curtain Driver E1 |  | diagnostic | integration |  |
| `sensor.aqara_curtain_driver_e1_target_opening_position_2` | Target opening position | matter | Aqara Curtain Driver E1 |  | diagnostic | integration |  |
| `sensor.aqara_curtain_driver_e1_target_opening_position_3` | Target opening position | matter | Aqara Curtain Driver E1 |  | diagnostic | integration |  |
| `sensor.aqara_curtain_driver_e1_target_opening_position_4` | Target opening position | matter | Aqara Curtain Driver E1 |  | diagnostic | integration |  |
| `sensor.aqara_door_and_window_sensor_battery` | Battery | matter | Aqara Door and Window Sensor |  | diagnostic |  |  |
| `sensor.aqara_door_and_window_sensor_battery_10` | Battery | matter | Aqara Door and Window Sensor |  | diagnostic |  |  |
| `sensor.aqara_door_and_window_sensor_battery_11` | Battery | matter | Aqara Door and Window Sensor |  | diagnostic |  |  |
| `sensor.aqara_door_and_window_sensor_battery_12` | Battery | matter | Aqara Door and Window Sensor |  | diagnostic |  |  |
| `sensor.aqara_door_and_window_sensor_battery_13` | Battery | matter | Aqara Door and Window Sensor |  | diagnostic |  |  |
| `sensor.aqara_door_and_window_sensor_battery_14` | Battery | matter | Aqara Door and Window Sensor |  | diagnostic |  |  |
| `sensor.aqara_door_and_window_sensor_battery_2` | Battery | matter | Aqara Door and Window Sensor |  | diagnostic |  |  |
| `sensor.aqara_door_and_window_sensor_battery_3` | Battery | matter | Aqara Door and Window Sensor |  | diagnostic |  |  |
| `sensor.aqara_door_and_window_sensor_battery_4` | Battery | matter | Aqara Door and Window Sensor |  | diagnostic |  |  |
| `sensor.aqara_door_and_window_sensor_battery_5` | Battery | matter | Aqara Door and Window Sensor |  | diagnostic |  |  |
| `sensor.aqara_door_and_window_sensor_battery_6` | Battery | matter | Aqara Door and Window Sensor |  | diagnostic |  |  |
| `sensor.aqara_door_and_window_sensor_battery_7` | Battery | matter | Aqara Door and Window Sensor |  | diagnostic |  |  |
| `sensor.aqara_door_and_window_sensor_battery_8` | Battery | matter | Aqara Door and Window Sensor |  | diagnostic |  |  |
| `sensor.aqara_door_and_window_sensor_battery_9` | Battery | matter | Aqara Door and Window Sensor |  | diagnostic |  |  |
| `sensor.aqara_door_and_window_sensor_battery_type` | Battery type | matter | Aqara Door and Window Sensor |  | diagnostic |  |  |
| `sensor.aqara_door_and_window_sensor_battery_type_10` | Battery type | matter | Aqara Door and Window Sensor |  | diagnostic |  |  |
| `sensor.aqara_door_and_window_sensor_battery_type_11` | Battery type | matter | Aqara Door and Window Sensor |  | diagnostic |  |  |
| `sensor.aqara_door_and_window_sensor_battery_type_12` | Battery type | matter | Aqara Door and Window Sensor |  | diagnostic |  |  |
| `sensor.aqara_door_and_window_sensor_battery_type_13` | Battery type | matter | Aqara Door and Window Sensor |  | diagnostic |  |  |
| `sensor.aqara_door_and_window_sensor_battery_type_14` | Battery type | matter | Aqara Door and Window Sensor |  | diagnostic |  |  |
| `sensor.aqara_door_and_window_sensor_battery_type_2` | Battery type | matter | Aqara Door and Window Sensor |  | diagnostic |  |  |
| `sensor.aqara_door_and_window_sensor_battery_type_3` | Battery type | matter | Aqara Door and Window Sensor |  | diagnostic |  |  |
| `sensor.aqara_door_and_window_sensor_battery_type_4` | Battery type | matter | Aqara Door and Window Sensor |  | diagnostic |  |  |
| `sensor.aqara_door_and_window_sensor_battery_type_5` | Battery type | matter | Aqara Door and Window Sensor |  | diagnostic |  |  |
| `sensor.aqara_door_and_window_sensor_battery_type_6` | Battery type | matter | Aqara Door and Window Sensor |  | diagnostic |  |  |
| `sensor.aqara_door_and_window_sensor_battery_type_7` | Battery type | matter | Aqara Door and Window Sensor |  | diagnostic |  |  |
| `sensor.aqara_door_and_window_sensor_battery_type_8` | Battery type | matter | Aqara Door and Window Sensor |  | diagnostic |  |  |
| `sensor.aqara_door_and_window_sensor_battery_type_9` | Battery type | matter | Aqara Door and Window Sensor |  | diagnostic |  |  |
| `sensor.aqara_door_and_window_sensor_battery_voltage` | Battery voltage | matter | Aqara Door and Window Sensor |  | diagnostic |  |  |
| `sensor.aqara_door_and_window_sensor_battery_voltage_10` | Battery voltage | matter | Aqara Door and Window Sensor |  | diagnostic |  |  |
| `sensor.aqara_door_and_window_sensor_battery_voltage_11` | Battery voltage | matter | Aqara Door and Window Sensor |  | diagnostic |  |  |
| `sensor.aqara_door_and_window_sensor_battery_voltage_12` | Battery voltage | matter | Aqara Door and Window Sensor |  | diagnostic |  |  |
| `sensor.aqara_door_and_window_sensor_battery_voltage_13` | Battery voltage | matter | Aqara Door and Window Sensor |  | diagnostic |  |  |
| `sensor.aqara_door_and_window_sensor_battery_voltage_14` | Battery voltage | matter | Aqara Door and Window Sensor |  | diagnostic |  |  |
| `sensor.aqara_door_and_window_sensor_battery_voltage_2` | Battery voltage | matter | Aqara Door and Window Sensor |  | diagnostic |  |  |
| `sensor.aqara_door_and_window_sensor_battery_voltage_3` | Battery voltage | matter | Aqara Door and Window Sensor |  | diagnostic |  |  |
| `sensor.aqara_door_and_window_sensor_battery_voltage_4` | Battery voltage | matter | Aqara Door and Window Sensor |  | diagnostic |  |  |
| `sensor.aqara_door_and_window_sensor_battery_voltage_5` | Battery voltage | matter | Aqara Door and Window Sensor |  | diagnostic |  |  |
| `sensor.aqara_door_and_window_sensor_battery_voltage_6` | Battery voltage | matter | Aqara Door and Window Sensor |  | diagnostic |  |  |
| `sensor.aqara_door_and_window_sensor_battery_voltage_7` | Battery voltage | matter | Aqara Door and Window Sensor |  | diagnostic |  |  |
| `sensor.aqara_door_and_window_sensor_battery_voltage_8` | Battery voltage | matter | Aqara Door and Window Sensor |  | diagnostic |  |  |
| `sensor.aqara_door_and_window_sensor_battery_voltage_9` | Battery voltage | matter | Aqara Door and Window Sensor |  | diagnostic |  |  |
| `sensor.aqara_motion_sensor_p1_battery` | Battery | matter | Aqara Motion Sensor P1 |  | diagnostic |  |  |
| `sensor.aqara_motion_sensor_p1_battery_2` | Battery | matter | Aqara Motion Sensor P1 |  | diagnostic |  |  |
| `sensor.aqara_motion_sensor_p1_battery_3` | Battery | matter | Aqara Motion Sensor P1 |  | diagnostic |  |  |
| `sensor.aqara_motion_sensor_p1_battery_4` | Battery | matter | Aqara Motion Sensor P1 |  | diagnostic |  |  |
| `sensor.aqara_motion_sensor_p1_battery_type` | Battery type | matter | Aqara Motion Sensor P1 |  | diagnostic |  |  |
| `sensor.aqara_motion_sensor_p1_battery_type_2` | Battery type | matter | Aqara Motion Sensor P1 |  | diagnostic |  |  |
| `sensor.aqara_motion_sensor_p1_battery_type_3` | Battery type | matter | Aqara Motion Sensor P1 |  | diagnostic |  |  |
| `sensor.aqara_motion_sensor_p1_battery_type_4` | Battery type | matter | Aqara Motion Sensor P1 |  | diagnostic |  |  |
| `sensor.aqara_motion_sensor_p1_battery_voltage` | Battery voltage | matter | Aqara Motion Sensor P1 |  | diagnostic |  |  |
| `sensor.aqara_motion_sensor_p1_battery_voltage_2` | Battery voltage | matter | Aqara Motion Sensor P1 |  | diagnostic |  |  |
| `sensor.aqara_motion_sensor_p1_battery_voltage_3` | Battery voltage | matter | Aqara Motion Sensor P1 |  | diagnostic |  |  |
| `sensor.aqara_motion_sensor_p1_battery_voltage_4` | Battery voltage | matter | Aqara Motion Sensor P1 |  | diagnostic |  |  |
| `sensor.aqara_vibration_sensor_battery` | Battery | matter | Aqara Vibration Sensor |  | diagnostic |  |  |
| `sensor.aqara_vibration_sensor_battery_2` | Battery | matter | Aqara Vibration Sensor |  | diagnostic |  |  |
| `sensor.aqara_vibration_sensor_battery_type` | Battery type | matter | Aqara Vibration Sensor |  | diagnostic |  |  |
| `sensor.aqara_vibration_sensor_battery_type_2` | Battery type | matter | Aqara Vibration Sensor |  | diagnostic |  |  |
| `sensor.aqara_vibration_sensor_battery_voltage` | Battery voltage | matter | Aqara Vibration Sensor |  | diagnostic |  |  |
| `sensor.aqara_vibration_sensor_battery_voltage_2` | Battery voltage | matter | Aqara Vibration Sensor |  | diagnostic |  |  |
| `sensor.aqara_wireless_remote_switch_battery` | Battery | matter | Aqara Wireless Remote Switch |  | diagnostic |  |  |
| `sensor.aqara_wireless_remote_switch_battery_2` | Battery | matter | Aqara Wireless Remote Switch |  | diagnostic |  |  |
| `sensor.aqara_wireless_remote_switch_battery_type` | Battery type | matter | Aqara Wireless Remote Switch |  | diagnostic |  |  |
| `sensor.aqara_wireless_remote_switch_battery_type_2` | Battery type | matter | Aqara Wireless Remote Switch |  | diagnostic |  |  |
| `sensor.aqara_wireless_remote_switch_battery_voltage` | Battery voltage | matter | Aqara Wireless Remote Switch |  | diagnostic |  |  |
| `sensor.aqara_wireless_remote_switch_battery_voltage_2` | Battery voltage | matter | Aqara Wireless Remote Switch |  | diagnostic |  |  |
| `sensor.aqara_wireless_remote_switch_current_switch_position` | Current switch position | matter | Aqara Wireless Remote Switch |  | diagnostic | integration |  |
| `sensor.aqara_wireless_remote_switch_current_switch_position_2` | Current switch position | matter | Aqara Wireless Remote Switch |  | diagnostic | integration |  |
| `sensor.aqara_wireless_remote_switch_current_switch_position_3` | Current switch position | matter | Aqara Wireless Remote Switch |  | diagnostic | integration |  |
| `sensor.aqara_wireless_remote_switch_current_switch_position_4` | Current switch position | matter | Aqara Wireless Remote Switch |  | diagnostic | integration |  |
| `sensor.backup_backup_manager_state` | Backup Manager state | backup | Backup |  |  |  |  |
| `sensor.backup_last_attempted_automatic_backup` | Last attempted automatic backup | backup | Backup |  |  |  |  |
| `sensor.backup_last_successful_automatic_backup` | Last successful automatic backup | backup | Backup |  |  |  |  |
| `sensor.backup_next_scheduled_automatic_backup` | Next scheduled automatic backup | backup | Backup |  |  |  |  |
| `sensor.bathroom2_hue_motion_sensor_zigbee_connectivity` | Zigbee connectivity | hue | Hue Motion Sensor | Spare Bedroom | diagnostic | integration |  |
| `sensor.bathroom_dimmer_switch_battery` | Battery | hue | Bathroom dimmer switch | Ensuite (Throne) Bathroom | diagnostic |  |  |
| `sensor.bathroom_illuminance` | Illuminance | hue | Bathroom | My Bathroom |  |  |  |
| `sensor.bed1_zigbee_connectivity` | Zigbee connectivity | hue | Alphabed Ceiling Light.5 | Bedroom (Alpha) | diagnostic | integration |  |
| `sensor.bed3_zigbee_connectivity` | Zigbee connectivity | hue | Alphabed Ceiling Light.3 | Bedroom (Alpha) | diagnostic | integration |  |
| `sensor.beige_ola_spotlight_lamp_zigbee_connectivity` | Zigbee connectivity | hue | Beige Ola Spotlight Lamp | Living Room | diagnostic | integration |  |
| `sensor.beta_bed_lightstrip_zigbee_connectivity` | Zigbee connectivity | hue | Beta Bed Lightstrip | Spare Bedroom | diagnostic | integration |  |
| `sensor.beta_bedroom_hue_dial_switch_zigbee_connectivity` | Zigbee connectivity | hue | Hallway Tap Dial Switch | Spare Bedroom | diagnostic | integration |  |
| `sensor.beta_ceiling_light_3_zigbee_connectivity` | Zigbee connectivity | hue | Beta Ceiling Light.3 | Spare Bedroom | diagnostic | integration |  |
| `sensor.beta_ceiling_light_4_zigbee_connectivity` | Zigbee connectivity | hue | Beta Ceiling Light.4 | Spare Bedroom | diagnostic | integration |  |
| `sensor.beta_ceiling_light_6_zigbee_connectivity` | Zigbee connectivity | hue | Beta Ceiling Light.6 | Spare Bedroom | diagnostic | integration |  |
| `sensor.beta_ceiling_light_zigbee_connectivity` | Zigbee connectivity | hue | Beta Ceiling Light.3 | Spare Bedroom | diagnostic | integration |  |
| `sensor.beta_flex_ceiling_light_1_zigbee_connectivity` | Zigbee connectivity | hue | Betaflex Ceiling Light.1 | Spare Bedroom | diagnostic | integration |  |
| `sensor.beta_flex_ceiling_light_2_zigbee_connectivity` | Zigbee connectivity | hue | Betaflex Ceiling Light.2 | Spare Bedroom | diagnostic | integration |  |
| `sensor.beta_pass_ceiling_zigbee_connectivity` | Zigbee connectivity | hue | Pass Ceiling Light.1  | Hallway (Pass) | diagnostic | integration |  |
| `sensor.betaflex_lower_shelf_zigbee_connectivity` | Zigbee connectivity | hue | Ikea Skytrax Light | Bedroom | diagnostic | integration |  |
| `sensor.bot_4a_battery` | Battery | matter | Bot 4A |  | diagnostic |  |  |
| `sensor.ceiling_bedroom1_bed4_zigbee_connectivity` | Zigbee connectivity | hue | Alpha Ceiling Light.4 | Bedroom (Alpha) | diagnostic | integration |  |
| `sensor.ceiling_bedroom1_closet_zone_zigbee_connectivity` | Zigbee connectivity | hue | core ceiling.3 | Bedroom (Alpha) | diagnostic | integration |  |
| `sensor.ceiling_bedroom1_door_zone_zigbee_connectivity` | Zigbee connectivity | hue | Alpha Ceiling Light.6 | Bedroom (Alpha) | diagnostic | integration |  |
| `sensor.ceiling_ensuite_bathroom_zigbee_connectivity` | Zigbee connectivity | hue | Throne Ceiling above sink | Ensuite (Throne) Bathroom | diagnostic | integration |  |
| `sensor.ceiling_ensuite_bathroom_zigbee_connectivity_2` | Zigbee connectivity | hue | Throne Ceiling above Door | Ensuite (Throne) Bathroom | diagnostic | integration |  |
| `sensor.ceiling_ensuite_bathroom_zigbee_connectivity_3` | Zigbee connectivity | hue | Throne Ceiling above shower door | Ensuite (Throne) Bathroom | diagnostic | integration |  |
| `sensor.ceiling_ensuite_bathroom_zigbee_connectivity_4` | Zigbee connectivity | hue | Throne Ceiling Light.3 | Ensuite (Throne) Bathroom | diagnostic | integration |  |
| `sensor.ceiling_kitchen_fridge_zigbee_connectivity` | Zigbee connectivity | hue | Core Ceiling Light.9 | Core_kitchen | diagnostic | integration |  |
| `sensor.ceiling_kitchen_sink_zigbee_connectivity` | Zigbee connectivity | hue | Core Ceiling Light.10 | Openplan (Core) | diagnostic | integration |  |
| `sensor.ceiling_op_br_zigbee_connectivity` | Zigbee connectivity | hue | Core Ceiling Light.8 | Openplan (Core) | diagnostic | integration |  |
| `sensor.ceiling_op_north_wall_zone_a1b_zigbee_connectivity` | Zigbee connectivity | hue | Core Ceiling Light.1 | Openplan (Core) | diagnostic | integration |  |
| `sensor.ceiling_op_north_wall_zone_zigbee_connectivity` | Zigbee connectivity | hue | Core Ceiling Light.2 | Openplan (Core) | diagnostic | integration |  |
| `sensor.ceiling_op_south_zigbee_connectivity` | Zigbee connectivity | hue | Core Ceiling Light.5 | Living Room | diagnostic | integration |  |
| `sensor.ceiling_open_plan_east_zigbee_connectivity` | Zigbee connectivity | hue | Core Ceiling Light.5 | Openplan (Core) | diagnostic | integration |  |
| `sensor.ceiling_open_plan_mm_zigbee_connectivity` | Zigbee connectivity | hue | Core Ceiling Light.6 | Openplan (Core) | diagnostic | integration |  |
| `sensor.ceiling_open_plan_mr_zigbee_connectivity` | Zigbee connectivity | hue | Core Ceiling Light.4 | Openplan (Core) | diagnostic | integration |  |
| `sensor.ceiling_open_plan_se_zigbee_connectivity` | Zigbee connectivity | hue | Core Ceiling Light.4 | Openplan (Core) | diagnostic | integration |  |
| `sensor.chaos_laundry_ceiling_zigbee_connectivity` | Zigbee connectivity | hue | Laundry (Chaos) Ceiling Light | Laundry/Utilities | diagnostic | integration |  |
| `sensor.chaos_storage_ceiling_zigbee_connectivity` | Zigbee connectivity | hue | White (E27) Hue Bulb | Laundry/Utilities | diagnostic | integration |  |
| `sensor.chaos_vault_ceiling_zigbee_connectivity` | Zigbee connectivity | hue | Pass Ceiling Light.1 | Hallway (Pass) | diagnostic | integration |  |
| `sensor.core_300s_air_quality` | Air quality | vesync | Core 300S | Bedroom |  |  |  |
| `sensor.core_300s_filter_lifetime` | Filter lifetime | vesync | Core 300S | Bedroom | diagnostic |  |  |
| `sensor.core_300s_pm2_5` | PM2.5 | vesync | Core 300S | Bedroom |  |  | conversation, google |
| `sensor.core_hue_tap_dial_switch_zigbee_connectivity` | Zigbee connectivity | hue | Core Tap Dial Light Switch | Openplan (Core) | diagnostic | integration |  |
| `sensor.core_signe_floor_lamp_zigbee_connectivity` | Zigbee connectivity | hue | Hue Signe White Gradient Floor Lamp.1 | Openplan (Core) | diagnostic | integration |  |
| `sensor.core_tap_dial_light_switch_battery` | Battery | hue | Core Tap Dial Light Switch | Openplan (Core) | diagnostic |  |  |
| `sensor.core_vault_ceiling_zigbee_connectivity` | Zigbee connectivity | hue | Pass Ceiling Light.4 | Hallway (Pass) | diagnostic | integration |  |
| `sensor.hallway_dimmer_switch_battery` | Battery | hue | Hallway Dimmer Switch | Hallway (Pass) | diagnostic |  |  |
| `sensor.hallway_tap_dial_switch_battery` | Battery | hue | Hallway Tap Dial Switch | Spare Bedroom | diagnostic |  |  |
| `sensor.hub_3_button_1_current_switch_position` | Current switch position | matter | Hub 3 Button 1 |  | diagnostic | integration |  |
| `sensor.hub_3_button_2_current_switch_position` | Current switch position | matter | Hub 3 Button 2 |  | diagnostic | integration |  |
| `sensor.hub_3_button_3_current_switch_position` | Current switch position | matter | Hub 3 Button 3 |  | diagnostic | integration |  |
| `sensor.hub_3_humisensor_humidity` | Humidity | matter | Hub 3 HumiSensor |  |  |  | conversation, google |
| `sensor.hub_3_tempsensor_temperature` | Temperature | matter | Hub 3 TempSensor |  |  |  | conversation, google |
| `sensor.hue_bridge_pro_zigbee_connectivity` | Zigbee connectivity | hue | Hue Bridge Pro | Laundry/Utilities | diagnostic | integration |  |
| `sensor.hue_color_candle_1_zigbee_connectivity` | Zigbee connectivity | hue | Right Bedside Lamp | Bedroom | diagnostic | integration |  |
| `sensor.hue_color_lamp_1_zigbee_connectivity` | Zigbee connectivity | hue | Ola Whitborg XL Floor Lamp |  | diagnostic | integration |  |
| `sensor.hue_color_lamp_1_zigbee_connectivity_2` | Zigbee connectivity | hue | fado glass globe lamp |  | diagnostic | integration |  |
| `sensor.hue_dimmer_switch_4_zigbee_connectivity` | Zigbee connectivity | hue | Hallway Dimmer Switch | Hallway (Pass) | diagnostic | integration |  |
| `sensor.hue_essential_spot_1_zigbee_connectivity` | Zigbee connectivity | hue | Nymane 3-spot Lamp - Mid |  | diagnostic | integration |  |
| `sensor.hue_essential_spot_2_zigbee_connectivity` | Zigbee connectivity | hue | Alpha Ceiling Light.6 | Bedroom | diagnostic | integration |  |
| `sensor.hue_essential_spot_3_zigbee_connectivity` | Zigbee connectivity | hue | Nyamane 3-spot Lamp - Top  |  | diagnostic | integration |  |
| `sensor.hue_motion_sensor_battery` | Battery | hue | Hue Motion Sensor | Spare Bedroom | diagnostic |  |  |
| `sensor.hue_motion_sensor_battery_2` | Battery | hue | Hue Motion Sensor | Ensuite (Throne) Bathroom | diagnostic |  |  |
| `sensor.hue_motion_sensor_illuminance` | Illuminance | hue | Hue Motion Sensor | Spare Bedroom |  |  |  |
| `sensor.hue_motion_sensor_illuminance_2` | Illuminance | hue | Hue Motion Sensor | Ensuite (Throne) Bathroom |  |  |  |
| `sensor.hue_motion_sensor_temperature` | Temperature | hue | Hue Motion Sensor | Spare Bedroom |  |  | conversation |
| `sensor.hue_motion_sensor_temperature_2` | Temperature | hue | Hue Motion Sensor | Ensuite (Throne) Bathroom |  |  | conversation |
| `sensor.hue_play_1_zigbee_connectivity` | Zigbee connectivity | hue | Hue Play 1 |  | diagnostic | integration |  |
| `sensor.hue_play_2_zigbee_connectivity` | Zigbee connectivity | hue | Hue Play 2 |  | diagnostic | integration |  |
| `sensor.hue_smart_button_2_battery` | Battery | hue | Hue smart button 2 |  | diagnostic |  |  |
| `sensor.hue_smart_button_2_zigbee_connectivity` | Zigbee connectivity | hue | Hue smart button 2 |  | diagnostic | integration |  |
| `sensor.hue_smart_button_3_battery` | Battery | hue | Hue smart button 3 |  | diagnostic |  |  |
| `sensor.hue_smart_button_3_zigbee_connectivity` | Zigbee connectivity | hue | Hue smart button 3 |  | diagnostic | integration |  |
| `sensor.hue_smart_plug_1_zigbee_connectivity` | Zigbee connectivity | hue | Hue smart plug 1 |  | diagnostic | integration |  |
| `sensor.iphone_16pro_max_activity` | iPhone 16Pro Max  Activity | mobile_app | iPhone 16Pro Max  |  |  |  |  |
| `sensor.iphone_16pro_max_app_version` | iPhone 16Pro Max  App Version | mobile_app | iPhone 16Pro Max  |  | diagnostic |  |  |
| `sensor.iphone_16pro_max_audio_output` | iPhone 16Pro Max  Audio Output | mobile_app | iPhone 16Pro Max  |  |  |  |  |
| `sensor.iphone_16pro_max_average_active_pace` | iPhone 16Pro Max  Average Active Pace | mobile_app | iPhone 16Pro Max  |  |  |  |  |
| `sensor.iphone_16pro_max_battery_level` | iPhone 16Pro Max  Battery Level | mobile_app | iPhone 16Pro Max  |  |  |  |  |
| `sensor.iphone_16pro_max_battery_state` | iPhone 16Pro Max  Battery State | mobile_app | iPhone 16Pro Max  |  |  |  |  |
| `sensor.iphone_16pro_max_bssid` | iPhone 16Pro Max  BSSID | mobile_app | iPhone 16Pro Max  |  |  |  |  |
| `sensor.iphone_16pro_max_connection_type` | iPhone 16Pro Max  Connection Type | mobile_app | iPhone 16Pro Max  |  |  |  |  |
| `sensor.iphone_16pro_max_distance` | iPhone 16Pro Max  Distance | mobile_app | iPhone 16Pro Max  |  |  |  |  |
| `sensor.iphone_16pro_max_floors_ascended` | iPhone 16Pro Max  Floors Ascended | mobile_app | iPhone 16Pro Max  |  |  |  |  |
| `sensor.iphone_16pro_max_floors_descended` | iPhone 16Pro Max  Floors Descended | mobile_app | iPhone 16Pro Max  |  |  |  |  |
| `sensor.iphone_16pro_max_geocoded_location` | iPhone 16Pro Max  Geocoded Location | mobile_app | iPhone 16Pro Max  |  |  |  |  |
| `sensor.iphone_16pro_max_last_update_trigger` | iPhone 16Pro Max  Last Update Trigger | mobile_app | iPhone 16Pro Max  |  |  |  |  |
| `sensor.iphone_16pro_max_location_permission` | iPhone 16Pro Max  Location permission | mobile_app | iPhone 16Pro Max  |  |  |  |  |
| `sensor.iphone_16pro_max_sim_1` | iPhone 16Pro Max  SIM 1 | mobile_app | iPhone 16Pro Max  |  |  |  |  |
| `sensor.iphone_16pro_max_sim_2` | iPhone 16Pro Max  SIM 2 | mobile_app | iPhone 16Pro Max  |  |  |  |  |
| `sensor.iphone_16pro_max_ssid` | iPhone 16Pro Max  SSID | mobile_app | iPhone 16Pro Max  |  |  |  |  |
| `sensor.iphone_16pro_max_steps` | iPhone 16Pro Max  Steps | mobile_app | iPhone 16Pro Max  |  |  |  |  |
| `sensor.iphone_16pro_max_storage` | iPhone 16Pro Max  Storage | mobile_app | iPhone 16Pro Max  |  |  |  |  |
| `sensor.jeffs_ipad_app_version` | Jeff’s iPad App Version | mobile_app | Jeff’s iPad |  | diagnostic |  |  |
| `sensor.jeffs_ipad_audio_output` | Jeff’s iPad Audio Output | mobile_app | Jeff’s iPad |  |  |  |  |
| `sensor.jeffs_ipad_battery_level` | Jeff’s iPad Battery Level | mobile_app | Jeff’s iPad |  |  |  |  |
| `sensor.jeffs_ipad_battery_state` | Jeff’s iPad Battery State | mobile_app | Jeff’s iPad |  |  |  |  |
| `sensor.jeffs_ipad_bssid` | Jeff’s iPad BSSID | mobile_app | Jeff’s iPad |  |  |  |  |
| `sensor.jeffs_ipad_connection_type` | Jeff’s iPad Connection Type | mobile_app | Jeff’s iPad |  |  |  |  |
| `sensor.jeffs_ipad_geocoded_location` | Jeff’s iPad Geocoded Location | mobile_app | Jeff’s iPad |  |  |  |  |
| `sensor.jeffs_ipad_last_update_trigger` | Jeff’s iPad Last Update Trigger | mobile_app | Jeff’s iPad |  |  |  |  |
| `sensor.jeffs_ipad_location_permission` | Jeff’s iPad Location permission | mobile_app | Jeff’s iPad |  |  |  |  |
| `sensor.jeffs_ipad_ssid` | Jeff’s iPad SSID | mobile_app | Jeff’s iPad |  |  |  |  |
| `sensor.jeffs_ipad_storage` | Jeff’s iPad Storage | mobile_app | Jeff’s iPad |  |  |  |  |
| `sensor.jeffs_iphone_app_version` | Jeff’s iPhone App Version | mobile_app | Jeff’s iPhone |  | diagnostic |  |  |
| `sensor.jeffs_iphone_audio_output` | Jeff’s iPhone Audio Output | mobile_app | Jeff’s iPhone |  |  |  |  |
| `sensor.jeffs_iphone_battery_level` | Jeff’s iPhone Battery Level | mobile_app | Jeff’s iPhone |  |  |  |  |
| `sensor.jeffs_iphone_battery_state` | Jeff’s iPhone Battery State | mobile_app | Jeff’s iPhone |  |  |  |  |
| `sensor.jeffs_iphone_bssid` | Jeff’s iPhone BSSID | mobile_app | Jeff’s iPhone |  |  |  |  |
| `sensor.jeffs_iphone_connection_type` | Jeff’s iPhone Connection Type | mobile_app | Jeff’s iPhone |  |  |  |  |
| `sensor.jeffs_iphone_geocoded_location` | Jeff’s iPhone Geocoded Location | mobile_app | Jeff’s iPhone |  |  |  |  |
| `sensor.jeffs_iphone_last_update_trigger` | Jeff’s iPhone Last Update Trigger | mobile_app | Jeff’s iPhone |  |  |  |  |
| `sensor.jeffs_iphone_location_permission` | Jeff’s iPhone Location permission | mobile_app | Jeff’s iPhone |  |  |  |  |
| `sensor.jeffs_iphone_sim_1` | Jeff’s iPhone SIM 1 | mobile_app | Jeff’s iPhone |  |  |  |  |
| `sensor.jeffs_iphone_sim_2` | Jeff’s iPhone SIM 2 | mobile_app | Jeff’s iPhone |  |  |  |  |
| `sensor.jeffs_iphone_ssid` | Jeff’s iPhone SSID | mobile_app | Jeff’s iPhone |  |  |  |  |
| `sensor.jeffs_iphone_storage` | Jeff’s iPhone Storage | mobile_app | Jeff’s iPhone |  |  |  |  |
| `sensor.klasnick_beige_table_lamp_zigbee_connectivity` | Zigbee connectivity | hue | Klasnick Beige Table Lamp (with E14 Hue Colour) | Openplan (Core) | diagnostic | integration |  |
| `sensor.macbook_air_active_audio_input` | MacBook Air  Active Audio Input | mobile_app | MacBook Air  |  |  |  |  |
| `sensor.macbook_air_active_audio_output` | MacBook Air  Active Audio Output | mobile_app | MacBook Air  |  |  |  |  |
| `sensor.macbook_air_active_camera` | MacBook Air  Active Camera | mobile_app | MacBook Air  |  |  |  |  |
| `sensor.macbook_air_app_version` | MacBook Air  App Version | mobile_app | MacBook Air  |  | diagnostic |  |  |
| `sensor.macbook_air_audio_output` | MacBook Air  Audio Output | mobile_app | MacBook Air  |  |  |  |  |
| `sensor.macbook_air_bssid` | MacBook Air  BSSID | mobile_app | MacBook Air  |  |  |  |  |
| `sensor.macbook_air_connection_type` | MacBook Air  Connection Type | mobile_app | MacBook Air  |  |  |  |  |
| `sensor.macbook_air_displays` | MacBook Air  Displays | mobile_app | MacBook Air  |  |  |  |  |
| `sensor.macbook_air_frontmost_app` | MacBook Air  Frontmost App | mobile_app | MacBook Air  |  |  |  |  |
| `sensor.macbook_air_geocoded_location` | MacBook Air  Geocoded Location | mobile_app | MacBook Air  |  |  |  |  |
| `sensor.macbook_air_internal_battery_level` | MacBook Air  Internal Battery Level | mobile_app | MacBook Air  |  |  |  |  |
| `sensor.macbook_air_internal_battery_state` | MacBook Air  Internal Battery State | mobile_app | MacBook Air  |  |  |  |  |
| `sensor.macbook_air_last_update_trigger` | MacBook Air  Last Update Trigger | mobile_app | MacBook Air  |  |  |  |  |
| `sensor.macbook_air_location_permission` | MacBook Air  Location permission | mobile_app | MacBook Air  |  |  |  |  |
| `sensor.macbook_air_primary_display_id` | MacBook Air  Primary Display ID | mobile_app | MacBook Air  |  |  |  |  |
| `sensor.macbook_air_primary_display_name` | MacBook Air  Primary Display Name | mobile_app | MacBook Air  |  |  |  |  |
| `sensor.macbook_air_ssid` | MacBook Air  SSID | mobile_app | MacBook Air  |  |  |  |  |
| `sensor.macbook_air_storage` | MacBook Air  Storage | mobile_app | MacBook Air  |  |  |  |  |
| `sensor.monica_vibelucci_arc_lamp_zigbee_connectivity` | Zigbee connectivity | hue | Core Statement Arc Floor Lamp Monica Vibelucci | Openplan (Core) | diagnostic | integration |  |
| `sensor.nymane_3_spot_lamp_low_zigbee_connectivity` | Zigbee connectivity | hue | Nymane 3-spot Lamp - Low | Bedroom (Alpha) | diagnostic | integration |  |
| `sensor.play_gradient_tube_1_zigbee_connectivity` | Zigbee connectivity | hue | alpha gradient light-tube.1 | Bedroom | diagnostic | integration |  |
| `sensor.roller_shade_0a_battery` | Battery | matter | Roller Shade 0A |  | diagnostic |  |  |
| `sensor.roller_shade_0a_target_opening_position` | Target opening position | matter | Roller Shade 0A |  | diagnostic | integration |  |
| `sensor.roller_shade_2a_battery` | Battery | matter | Roller Shade 2A |  | diagnostic |  |  |
| `sensor.roller_shade_2a_target_opening_position` | Target opening position | matter | Roller Shade 2A |  | diagnostic | integration |  |
| `sensor.roller_shade_84_battery` | Battery | matter | Roller Shade 84 |  | diagnostic |  |  |
| `sensor.roller_shade_84_target_opening_position` | Target opening position | matter | Roller Shade 84 |  | diagnostic | integration |  |
| `sensor.secondary_bathroom_illuminance` | Illuminance | hue | Secondary Bathroom | Secondary Bathroom |  |  |  |
| `sensor.signe_gradient_floor_1_zigbee_connectivity` | Zigbee connectivity | hue | Signe gradient floor 1 | Openplan (Core) | diagnostic | integration |  |
| `sensor.signe_gradient_table_1_zigbee_connectivity` | Zigbee connectivity | hue | Signe gradient table 1 |  | diagnostic | integration |  |
| `sensor.speedtest_download` | Download | speedtestdotnet | SpeedTest | Parking |  |  |  |
| `sensor.speedtest_ping` | Ping | speedtestdotnet | SpeedTest | Parking |  |  |  |
| `sensor.speedtest_upload` | Upload | speedtestdotnet | SpeedTest | Parking |  |  |  |
| `sensor.splash_bathroom_dimmer_zigbee_connectivity` | Zigbee connectivity | hue | Splash Dimmer Switch | Secondary Bathroom | diagnostic | integration |  |
| `sensor.splash_ceiling_light_1_zigbee_connectivity` | Zigbee connectivity | hue | Splash Ceiling Light.4 | Secondary Bathroom | diagnostic | integration |  |
| `sensor.splash_ceiling_light_2_zigbee_connectivity` | Zigbee connectivity | hue | Splash Ceiling Light.1 | Secondary Bathroom | diagnostic | integration |  |
| `sensor.splash_ceiling_light_3_zigbee_connectivity` | Zigbee connectivity | hue | Splash Ceiling Light.2 | Secondary Bathroom | diagnostic | integration |  |
| `sensor.splash_ceiling_light_4_zigbee_connectivity` | Zigbee connectivity | hue | Splash Ceiling Light.5 | Secondary Bathroom | diagnostic | integration |  |
| `sensor.splash_ceiling_light_5_zigbee_connectivity` | Zigbee connectivity | hue | Splash Ceiling Light.3 | Secondary Bathroom | diagnostic | integration |  |
| `sensor.splash_dimmer_switch_battery` | Battery | hue | Splash Dimmer Switch | Secondary Bathroom | diagnostic |  |  |
| `sensor.splash_pass_ceiling_zigbee_connectivity` | Zigbee connectivity | hue | Pass Ceiling Light.2 | Hallway (Pass) | diagnostic | integration |  |
| `sensor.sun_next_dawn` | Next dawn | sun | Sun |  | diagnostic |  |  |
| `sensor.sun_next_dusk` | Next dusk | sun | Sun |  | diagnostic |  |  |
| `sensor.sun_next_midnight` | Next midnight | sun | Sun |  | diagnostic |  |  |
| `sensor.sun_next_noon` | Next noon | sun | Sun |  | diagnostic |  |  |
| `sensor.sun_next_rising` | Next rising | sun | Sun |  | diagnostic |  |  |
| `sensor.sun_next_setting` | Next setting | sun | Sun |  | diagnostic |  |  |
| `sensor.sun_solar_azimuth` | Solar azimuth | sun | Sun |  | diagnostic | integration |  |
| `sensor.sun_solar_elevation` | Solar elevation | sun | Sun |  | diagnostic | integration |  |
| `sensor.sun_solar_rising` | Solar rising | sun | Sun |  | diagnostic | integration |  |
| `sensor.throne_bathroom_ceiling_zigbee_connectivity` | Zigbee connectivity | hue | Bathroom dimmer switch | Ensuite (Throne) Bathroom | diagnostic | integration |  |
| `sensor.throne_hue_motion_sensor_zigbee_connectivity` | Zigbee connectivity | hue | Hue Motion Sensor | Ensuite (Throne) Bathroom | diagnostic | integration |  |
| `sensor.withings_active_calories_burnt_today` | Active calories burnt today | withings | Withings | Bedroom (Alpha) |  | user |  |
| `sensor.withings_active_time_today` | Active time today | withings | Withings | Bedroom (Alpha) |  | user |  |
| `sensor.withings_average_heart_rate` | Average heart rate | withings | Withings | Bedroom (Alpha) |  | integration |  |
| `sensor.withings_average_respiratory_rate` | Average respiratory rate | withings | Withings | Bedroom (Alpha) |  | integration |  |
| `sensor.withings_breathing_disturbances_intensity` | Breathing disturbances intensity | withings | Withings | Bedroom (Alpha) |  | integration |  |
| `sensor.withings_deep_sleep` | Deep sleep | withings | Withings | Bedroom (Alpha) |  |  |  |
| `sensor.withings_distance_travelled_today` | Distance travelled today | withings | Withings | Bedroom (Alpha) |  | user |  |
| `sensor.withings_elevation_change_today` | Elevation change today | withings | Withings | Bedroom (Alpha) |  | user |  |
| `sensor.withings_intense_activity_today` | Intense activity today | withings | Withings | Bedroom (Alpha) |  | integration |  |
| `sensor.withings_light_sleep` | Light sleep | withings | Withings | Bedroom (Alpha) |  |  |  |
| `sensor.withings_maximum_heart_rate` | Maximum heart rate | withings | Withings | Bedroom (Alpha) |  |  |  |
| `sensor.withings_maximum_respiratory_rate` | Maximum respiratory rate | withings | Withings | Bedroom (Alpha) |  | integration |  |
| `sensor.withings_minimum_heart_rate` | Minimum heart rate | withings | Withings | Bedroom (Alpha) |  | integration |  |
| `sensor.withings_minimum_respiratory_rate` | Minimum respiratory rate | withings | Withings | Bedroom (Alpha) |  | integration |  |
| `sensor.withings_moderate_activity_today` | Moderate activity today | withings | Withings | Bedroom (Alpha) |  | integration |  |
| `sensor.withings_rem_sleep` | REM sleep | withings | Withings | Bedroom (Alpha) |  |  |  |
| `sensor.withings_sleep_score` | Sleep score | withings | Withings | Bedroom (Alpha) |  |  |  |
| `sensor.withings_snoring` | Snoring | withings | Withings | Bedroom (Alpha) |  |  |  |
| `sensor.withings_snoring_episode_count` | Snoring episode count | withings | Withings | Bedroom (Alpha) |  | integration |  |
| `sensor.withings_soft_activity_today` | Soft activity today | withings | Withings | Bedroom (Alpha) |  | integration |  |
| `sensor.withings_steps_today` | Steps today | withings | Withings | Bedroom (Alpha) |  | user |  |
| `sensor.withings_time_to_sleep` | Time to sleep | withings | Withings | Bedroom (Alpha) |  |  |  |
| `sensor.withings_time_to_wakeup` | Time to wakeup | withings | Withings | Bedroom (Alpha) |  |  |  |
| `sensor.withings_total_calories_burnt_today` | Total calories burnt today | withings | Withings | Bedroom (Alpha) |  | user |  |
| `sensor.withings_wakeup_count` | Wakeup count | withings | Withings | Bedroom (Alpha) |  |  |  |
| `sensor.withings_wakeup_time` | Wakeup time | withings | Withings | Bedroom (Alpha) |  |  |  |
| `stt.home_assistant_cloud` | Home Assistant Cloud | cloud |  |  |  |  |  |
| `switch.automation_alpha_bedroom_dial_switch` | Automation: Alpha Bedroom Dial Switch | hue | Hue Bridge Pro | Laundry/Utilities | config |  |  |
| `switch.automation_hue_smart_button_3` | Automation: Hue smart button 3 | hue | Hue Bridge Pro | Laundry/Utilities | config |  |  |
| `switch.bot_4a` | switch.bot_4a | matter | Bot 4A |  |  |  | conversation, google |
| `switch.core_300s_child_lock` | Child lock | vesync | Core 300S | Bedroom |  |  | conversation, google |
| `switch.core_300s_display` | Display | vesync | Core 300S | Bedroom |  |  | conversation, google |
| `switch.hue_motion_sensor_light_sensor_enabled` | Light sensor enabled | hue | Hue Motion Sensor | Spare Bedroom | config |  |  |
| `switch.hue_motion_sensor_light_sensor_enabled_2` | Light sensor enabled | hue | Hue Motion Sensor | Ensuite (Throne) Bathroom | config |  |  |
| `switch.hue_motion_sensor_motion_sensor_enabled` | Motion sensor enabled | hue | Hue Motion Sensor | Spare Bedroom | config |  |  |
| `switch.hue_motion_sensor_motion_sensor_enabled_2` | Motion sensor enabled | hue | Hue Motion Sensor | Ensuite (Throne) Bathroom | config |  |  |
| `todo.shopping_list` | Shopping List | shopping_list |  |  |  |  | conversation |
| `tts.google_translate_en_com` | Google Translate en com | google_translate |  |  |  |  |  |
| `tts.home_assistant_cloud` | Home Assistant Cloud | cloud |  |  |  |  |  |
| `update.core_300s_firmware` | Firmware | vesync | Core 300S | Bedroom | diagnostic |  |  |
| `weather.forecast_home` | Home | met | Forecast |  |  |  |  |

## 10. Runtime Containers

```text
homeassistantz	ghcr.io/home-assistant/home-assistant:stable	Up 16 hours	
matter-server	ghcr.io/home-assistant-libs/python-matter-server:stable	Up 16 hours	
nodered	nodered/node-red:latest	Up 16 hours (healthy)	0.0.0.0:1880->1880/tcp, [::]:1880->1880/tcp
mosquitto	eclipse-mosquitto:2	Up 16 hours	0.0.0.0:1883->1883/tcp, [::]:1883->1883/tcp
```

## 11. Node-RED Surface

```json
{
  "counts": {
    "tab": 1,
    "comment": 1
  },
  "tabs": [
    {
      "id": "f6f2187d.f17ca8",
      "label": "Flow 1",
      "disabled": false
    }
  ],
  "nodes": [
    {
      "id": "f6f2187d.f17ca8",
      "type": "tab",
      "label": "Flow 1",
      "z": null
    },
    {
      "id": "3cc11d24.ff01a2",
      "type": "comment",
      "label": "WARNING: please check you have started this container with a volume that is mounted to /data\\n otherwise any flow changes are lost when you redeploy or upgrade the container\\n (e.g. upgrade to a more recent node-red docker image).\\n  If you are using named volumes you can ignore this warning.\\n Double click or see info side panel to learn how to start Node-RED in Docker to save your work",
      "z": "f6f2187d.f17ca8"
    }
  ]
}
```


==== FILE: /Users/jeff/Downloads/10_Archive/Duplicated-Pending Deletion/Exports/sources/homeassistant/hue-control/README.md (modified: 2026-05-24 03:34:22) ====

# Hue Control

Small programmable Hue workspace for the mini-PC app stack.

Location:

```text
/srv/ai-stack/apps/hue-control
```

This belongs under `ai-stack/apps` rather than `homeassistant` because it is intended as a direct automation/control surface for agents, scripts, and future services. Home Assistant can still consume Hue separately, but this folder keeps the Codex/AI runtime path independent.

## Secrets

Secrets are loaded from the same 1Password Environment pattern used by `project-codex`.

Expected variables:

```text
OP_SERVICE_ACCOUNT_TOKEN
OP_ENVIRONMENT_ID
HUE_BRIDGE_IP
HUE_APP_KEY
```

`HUE_APP_KEY` is never printed by the included scripts.

## Commands

```bash
npm install
npm run status
npm run lights
npm run rooms
npm run scenes
```

If this app is running on the mini PC with the current 1Password Environment, `npm run lights` should authenticate to the Hue Bridge Pro at `192.168.1.136` and list the current lights.

## Flat Structure

The current Hue room, zone, and naming cleanup record lives in [`docs/hue-structure-plan.md`](docs/hue-structure-plan.md).

The naming priority is daily home usability across Hue, HomeKit, Siri/voice, Home Assistant, dashboards, and physical control habits. The flat uses a hybrid naming model: meaningful spatial codes such as `Core`, `Alpha`, and `Pass` are preserved, then paired with plain room/use language where that makes control clearer.

## Direction

This folder is a foundation for direct Hue automation from the mini PC:

- read bridge, lights, rooms, zones, scenes, and sensors
- trigger scenes or state changes without going through Home Assistant
- expose a narrow local API or MCP tool later if useful
- keep Hue credentials centralized in 1Password


==== FILE: /Users/jeff/Downloads/10_Archive/Duplicated-Pending Deletion/Exports/sources/homeassistant/hue-control/docs/hue-structure-plan.md (modified: 2026-05-24 04:03:33) ====

# Hue Flat Naming & Structure

Last checked: 2026-05-24

This document tracks the Hue and Home Assistant naming layer for the flat. The priority is daily usability in Hue, HomeKit, Siri/voice, Home Assistant, dashboards, and physical control habits.

The flat uses a hybrid naming model:

- preserve the spatial codes because they are meaningful in the home model
- pair them with plain room/use language so the names remain readable in Hue, HomeKit, and HA
- keep fixture numbers stable so physical location, dashboards, and automations can converge

## Room Codes

| Code | User-facing meaning |
| --- | --- |
| Core | Shared open-plan living / dining / kitchen area |
| Alpha | Bedroom |
| Beta | Bedroom / spare room |
| Throne | Bathroom |
| Splash | Bathroom |
| Pass | Hallway |
| Chaos | Utility / storage |

## Current Hue Rooms

| Hue room |
| --- |
| Core Open Plan |
| Alpha Bedroom |
| Beta Bedroom |
| Pass Hallway |
| Splash Bathroom |
| Throne Bathroom |
| Chaos Utility |

`Core Kitchen` was deleted as a separate Hue room. Kitchen is now represented as a Core lighting zone rather than a separate room.

## Current Home Assistant Areas

Home Assistant areas were consolidated on 2026-05-24 to match the flat's room model. Duplicate, stale, and device-named areas were retired after their devices were moved.

| HA area | Aliases | Device count |
| --- | --- | ---: |
| Core Open Plan | Open Plan; Openplan; Openplan Core; Living Room; Living; Dining | 23 |
| Core Kitchen | Kitchen | 3 |
| Alpha Bedroom | Bedroom; Bedroom Alpha; Primary Bedroom; Main Bedroom | 20 |
| Beta Bedroom | Spare Bedroom; Spare Room; Room 2; Rear Bedroom; Guest Bedroom | 13 |
| Pass Hallway | Hallway; Pass; Front Door; Entry; Entrance | 9 |
| Throne Bathroom | Ensuite; Ensuite Bathroom; Main Bathroom; My Bathroom | 7 |
| Splash Bathroom | Secondary Bathroom; Rear Bathroom; Bathroom 2; Splash | 7 |
| Chaos Utility | Chaos; Utility; Laundry; Laundry Room; Laundry/Utilities; Storage | 5 |
| Parking | | 1 |

Retired HA areas:

- `Attic`
- `Bedroom`
- `Beta Bedroom` duplicate area
- `Default`
- `Dining`
- `Front Door`
- `Laundry room`
- `Living Room`
- `Living Room (2)`
- `My Bathroom`
- `Openplan`
- `Orange HomePod Mini`
- `Storage`
- `White HomePod Mini`

Area consolidation verification:

- Stale device area references: 0
- Stale entity area references: 0
- Registry backups were created before the merge in `/srv/homeassistant/config/.storage/` with the suffix `codex-area-merge-20260524-030121.bak`.

## Core Ceiling Numbering

Core ceiling fixtures are now numbered across the whole Core area:

| Range | Meaning |
| --- | --- |
| Core Ceiling 01-02 | Pathway to balcony |
| Core Ceiling 03-08 | Living area |
| Core Ceiling 09-10 | Kitchen area |

Individual fixture names in Hue and HA:

| Hue name | HA entity |
| --- | --- |
| Core Ceiling 01 | `light.core_ceiling_01` |
| Core Ceiling 02 | `light.core_ceiling_02` |
| Core Ceiling 03 | `light.core_ceiling_03` |
| Core Ceiling 04 | `light.core_ceiling_04` |
| Core Ceiling 05 | `light.core_ceiling_05` |
| Core Ceiling 06 | `light.core_ceiling_06` |
| Core Ceiling 07 | `light.core_ceiling_07` |
| Core Ceiling 08 | `light.core_ceiling_08` |
| Core Ceiling 09 | `light.core_ceiling_09` |
| Core Ceiling 10 | `light.core_ceiling_10` |

## Core Groups / Zones

The Core control layer exists in both Hue zones and HA light entities:

| Group | Contents | HA entity |
| --- | --- | --- |
| Core Path | Core Ceiling 01-02 | `light.core_path` |
| Core Living | Core Ceiling 03-08 | `light.core_living` |
| Core Kitchen | Core Ceiling 09-10 | `light.core_kitchen` |
| Core Ceiling | Core Ceiling 01-10 | `light.core_ceiling` |
| Core Ambient | Core lamps / strips / decorative ambient lights | `light.core_ambient` |
| Core All | Core Ceiling plus Core Ambient | `light.core_all` |

Hue zone child counts after verification:

| Hue zone | Child count |
| --- | ---: |
| Core Path | 2 |
| Core Living | 6 |
| Core Kitchen | 2 |
| Core Ceiling | 10 |
| Core Ambient | 9 |
| Core All | 19 |

## Applied Core Changes

Applied on 2026-05-24:

- Renamed Hue fixtures from `Core Open Plan Ceiling 01-08` and `Core Kitchen Ceiling 01-02` to `Core Ceiling 01-10`.
- Updated/created Hue zones: `Core Path`, `Core Living`, `Core Kitchen`, `Core Ceiling`, `Core All`.
- Renamed HA entity IDs and friendly names for the ten Core ceiling fixtures.
- Renamed HA entity IDs and friendly names for the Core group layer.

Applied ambient layer on 2026-05-24:

- Created Hue zone `Core Ambient`.
- Home Assistant exposed it as `light.core_ambient`.
- `Core Ambient` is the non-ceiling Core layer: lamps, Hue Play, gradient tube/strip, and decorative ambient fixtures.

## Verification

Hue verification:

- Core ceiling fixtures found: `Core Ceiling 01` through `Core Ceiling 10`
- Core zones found: `Core Path`, `Core Living`, `Core Kitchen`, `Core Ceiling`, `Core Ambient`, `Core All`

Home Assistant verification:

- Individual fixtures found as `light.core_ceiling_01` through `light.core_ceiling_10`
- Groups found as `light.core_path`, `light.core_living`, `light.core_kitchen`, `light.core_ceiling`, `light.core_ambient`, `light.core_all`

## Remaining Notes

- `Core All` currently includes Core Ceiling 01-10 plus the Core ambient layer available from Hue at the time of the change.
- The HA registry was updated through Home Assistant's websocket registry API, not by editing `.storage` directly.
- Future structural changes should preserve the hybrid naming model: code first, plain-language meaning second where needed.


==== FILE: /Users/jeff/Downloads/10_Archive/Duplicated-Pending Deletion/Exports/sources/homeassistant/hue-control/package.json (modified: 2026-05-22 02:55:04) ====

{
  "name": "hue-control",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "scripts": {
    "lights": "node src/cli.mjs lights",
    "rooms": "node src/cli.mjs rooms",
    "scenes": "node src/cli.mjs scenes",
    "status": "node src/cli.mjs status"
  },
  "dependencies": {
    "@1password/sdk": "^0.4.1-beta.1",
    "dotenv": "^17.4.2"
  },
  "engines": {
    "node": ">=20"
  }
}


==== FILE: /Users/jeff/Downloads/10_Archive/Duplicated-Pending Deletion/Exports/sources/homeassistant/node-red/flows.json (modified: 2026-05-24 12:48:34) ====

[
  {
    "id": "core-lighting-rhythm",
    "type": "tab",
    "label": "Core Lighting Rhythm",
    "disabled": false,
    "info": "Core circadian lighting pilot. This tab is the design skeleton for the baseline rhythm: ceiling gradually yields to ambient through evening, and night defaults to ambient/path/kitchen task light rather than overhead ceiling."
  },
  {
    "id": "core-rhythm-overview",
    "type": "comment",
    "z": "core-lighting-rhythm",
    "name": "Core circadian baseline",
    "info": "Design intent: Core lighting should feel alive and calm, not binary. Morning/day allows ceiling for functional light. Golden hour/evening fades ceiling down while ambient comes up. Night and late night use lamps, ambient, path, and kitchen task light by default; ceiling is only for explicit manual/cleaning override.",
    "x": 230,
    "y": 80,
    "wires": []
  },
  {
    "id": "core-rhythm-inputs",
    "type": "comment",
    "z": "core-lighting-rhythm",
    "name": "Inputs to wire",
    "info": "Use sun.sun, sensor.sun_solar_elevation, sensor.sun_solar_azimuth, Core presence helpers, Core media players, Core tap dial events, input_boolean.test_mode, input_boolean.core_lighting_auto, input_boolean.core_lighting_test_enabled, input_boolean.core_manual_override, and timer.core_manual_override.",
    "x": 190,
    "y": 160,
    "wires": []
  },
  {
    "id": "core-rhythm-outputs",
    "type": "comment",
    "z": "core-lighting-rhythm",
    "name": "Outputs to control",
    "info": "Primary outputs: light.core_ambient, light.core_path, light.core_living, light.core_kitchen, light.core_ceiling, light.core_all. Helpers to update: input_select.core_lighting_phase, input_select.core_activity, input_boolean.core_ceiling_allowed, input_number core target brightness/kelvin/fade values.",
    "x": 200,
    "y": 240,
    "wires": []
  },
  {
    "id": "core-rhythm-guardrails",
    "type": "comment",
    "z": "core-lighting-rhythm",
    "name": "Guardrails before live actions",
    "info": "No live light action should run unless Core Lighting Auto is on. During buildout, live actions should also require both Test Mode and Core Lighting Test Enabled. Manual Core dial/switch use should set Core Manual Override and start timer.core_manual_override so automations back off.",
    "x": 230,
    "y": 320,
    "wires": []
  },
  {
    "id": "core-rhythm-phase-map",
    "type": "comment",
    "z": "core-lighting-rhythm",
    "name": "Phase map v0",
    "info": "Morning: clearer moderate ceiling, low ambient. Day: ceiling available, ambient minimal. Golden Hour: ceiling steps down, ambient warms up. Evening: ambient leads, ceiling low. Night: ceiling off by default, ambient/path/kitchen only. Late Night: very low warm path/ambient, ceiling blocked unless manual or cleaning.",
    "x": 200,
    "y": 400,
    "wires": []
  },
  {
    "id": "core-rhythm-next-build",
    "type": "comment",
    "z": "core-lighting-rhythm",
    "name": "Next build nodes",
    "info": "Next implementation slice: inject every 5 minutes + sun/time evaluator -> phase targets -> HA service calls to update helper targets only. After that, add guarded light.turn_on calls with transition seconds for Core Ambient and Core Ceiling.",
    "x": 200,
    "y": 480,
    "wires": []
  },
  {
    "id": "area-lighting-backlog",
    "type": "tab",
    "label": "Area Lighting Backlog",
    "disabled": false,
    "info": "Placeholder tabs/notes for later lighting behavior by area. Core is the pilot; do not copy behavior to other rooms until the feel is confirmed."
  },
  {
    "id": "area-lighting-backlog-note",
    "type": "comment",
    "z": "area-lighting-backlog",
    "name": "Future area rhythms",
    "info": "Future areas: Alpha Bedroom, Beta Bedroom, Pass Hallway, Throne Bathroom, Splash Bathroom, Chaos Utility. Each area should inherit the same home rhythm language but have room-specific manners: bathrooms at night stay soft, hallway guides rather than floods, bedroom respects sleep/wind-down.",
    "x": 240,
    "y": 100,
    "wires": []
  }
]


==== FILE: /Users/jeff/Downloads/10_Archive/Duplicated-Pending Deletion/Exports/sources/homeassistant/packages/test_mode.yaml (modified: 2026-05-24 12:47:52) ====

input_boolean:
  test_mode:
    name: Test Mode
    icon: mdi:flask


==== FILE: /Users/jeff/Downloads/10_Archive/Duplicated-Pending Deletion/Exports/sources/homeassistant/remote-docs/core-lighting-rhythm.md (modified: 2026-05-24 12:50:23) ====

# Core Lighting Rhythm

Last checked: 2026-05-24

This document tracks the confirmed foundation for the Core Open Plan lighting rhythm. The goal is lighting that feels alive and textured: gradual fades, warmer evenings, ambient-first night behavior, and activity-aware functional light.

## Physical Intent

Core lighting should not behave like a simple motion switch. The baseline rhythm should shift the room through the day:

| Phase | Ceiling behavior | Ambient / lamp behavior | Feel |
| --- | --- | --- | --- |
| Morning | Available, clearer, moderate brightness | Low support | Wakeful and practical |
| Day | Available for tasks | Minimal unless useful | Functional |
| Golden Hour | Starts fading down | Starts warming and rising | Softer transition |
| Evening | Low / secondary | Leads the room | Relaxed and lived-in |
| Night | Off by default | Functional light source | Calm, no overhead glare |
| Late Night | Blocked unless explicit | Very low, warm, path-led | Movement without waking the room |

The key rule: ceiling light gradually yields to lamps and ambient light as the day moves into night.

## Core Control Targets

| Target | HA entity | Role |
| --- | --- | --- |
| Core Ambient | `light.core_ambient` | Main evening/night living layer |
| Core Path | `light.core_path` | Balcony/pathway guidance |
| Core Living | `light.core_living` | Living-area ceiling zone |
| Core Kitchen | `light.core_kitchen` | Kitchen task light |
| Core Ceiling | `light.core_ceiling` | Whole Core overhead layer |
| Core All | `light.core_all` | Whole Core lighting group |

## Rhythm Helpers

These helpers are defined in `/srv/homeassistant/config/packages/core_lighting_rhythm.yaml`.

| Helper | Default | Purpose |
| --- | --- | --- |
| `input_boolean.core_lighting_auto` | `off` | Master enable for Core automatic lighting |
| `input_boolean.core_lighting_test_enabled` | `off` | Extra build/test gate before live light actions |
| `input_boolean.core_manual_override` | `off` | Tells automation to back off after manual control |
| `input_boolean.core_ceiling_allowed` | `on` | Whether the rhythm currently allows ceiling by default |
| `input_select.core_lighting_phase` | `Day` | Current rhythm phase |
| `input_select.core_activity` | `Idle` | Current inferred Core activity |
| `input_number.core_ceiling_target_brightness` | `35%` | Target ceiling brightness |
| `input_number.core_ambient_target_brightness` | `20%` | Target ambient brightness |
| `input_number.core_path_target_brightness` | `12%` | Target path brightness |
| `input_number.core_kitchen_target_brightness` | `45%` | Target kitchen task brightness |
| `input_number.core_target_kelvin` | `3000 K` | Target color temperature |
| `input_number.core_fade_seconds` | `180 s` | Default transition time |
| `timer.core_manual_override` | `30 min` | Manual override timeout |

## Automation Workspace

Node-RED now has a Core lighting workspace skeleton:

| Node-RED tab | Purpose |
| --- | --- |
| `Core Lighting Rhythm` | Core circadian baseline design and guardrails |
| `Area Lighting Backlog` | Placeholder for future room-specific rhythm work |

The current Node-RED flow contains comments only. It does not yet perform live light actions.

## Guardrails

Live light actions should require:

- `input_boolean.core_lighting_auto` is `on`
- during buildout, both `input_boolean.test_mode` and `input_boolean.core_lighting_test_enabled` are `on`
- `input_boolean.core_manual_override` is `off`

Manual Core dial/switch use should eventually set `input_boolean.core_manual_override` and start `timer.core_manual_override`, so the flat does not fight manual choices.

## Applied Changes

Applied on 2026-05-24:

- Replaced the old `test_mode` demo automation with a clean test-mode helper only.
- Added `/srv/homeassistant/config/packages/core_lighting_rhythm.yaml`.
- Added Core rhythm helpers for phase, activity, target brightness, target kelvin, fade duration, auto enable, test enable, ceiling allowance, and manual override.
- Added a Node-RED `Core Lighting Rhythm` tab and `Area Lighting Backlog` tab.
- Reloaded HA helper domains and automations.
- Restarted Node-RED so the workspace appears in the editor.

## Verification

Verified on 2026-05-24:

- Home Assistant configuration check passed.
- Core rhythm helpers are loaded in HA.
- `input_boolean.core_lighting_auto` is `off`.
- `input_boolean.core_lighting_test_enabled` is `off`.
- `input_boolean.test_mode` is `off`.
- Node-RED is running with the new Core lighting workspace.
- No live light-changing automation nodes have been added yet.

## Next Build Slice

The next implementation step is to wire a test-mode-only evaluator:

- every 5 minutes, read sun/time/presence/media context
- update `core_lighting_phase`, `core_activity`, brightness targets, kelvin, fade seconds, and `core_ceiling_allowed`
- do not touch lights yet

After the helper values feel right, add guarded light actions for `Core Ambient`, `Core Ceiling`, `Core Path`, and `Core Kitchen`.


==== FILE: /Users/jeff/Downloads/10_Archive/Duplicated-Pending Deletion/Exports/sources/homeassistant/remote-docs/home-map-working-model.md (modified: 2026-05-24 04:25:08) ====

# Home Map Working Model

Last checked: 2026-05-24

This smart-home work uses a hybrid collaboration model:

- chat through choices that affect the lived home experience
- execute bounded, reversible, confirmed changes directly
- report back with what changed, what stayed untouched, and what needs confirmation
- document the confirmed home map, not every half-formed option

The goal is a home that is easy to use in Hue, HomeKit, Siri, Home Assistant, dashboards, and physical controls. Internal structure should support that experience, not override it.

## Working Lanes

| Lane | Owns | Must not own |
| --- | --- | --- |
| Home Map Naming | Hue rooms, Hue zones, HA areas, device/fixture identity, entity names, aliases, confirmed home-map docs | Automations, Node-RED flow behavior, scripts unrelated to naming |
| HA Automations / Node-RED | HA automations, scripts, helpers, scenes, Node-RED flows, integration behavior, runtime checks | Hue/HA naming, room/area membership, fixture identity |

The lanes can inspect each other's docs for context, but changes should stay inside the owning lane unless explicitly coordinated.

## Decision Rules

Apply directly when all are true:

- the change is reversible
- the target area/room/device is already confirmed
- the blast radius is local and obvious
- the change improves daily use or keeps HA/Hue aligned

Pause and chat first when any are true:

- the change affects voice control, dashboards, HomeKit grouping, or muscle memory
- the device location cannot be inferred confidently
- Hue, HA, and device names disagree
- a structural move could affect scenes, automations, or Node-RED flows

## Documentation Standard

Confirmed docs should read like a home map:

- physical meaning first
- system mapping second
- clear tables for rooms, zones, devices, entities, and aliases
- applied changes separate from verification
- pending items isolated in a review queue

The Core ceiling model is the reference pattern:

| Physical range | Meaning |
| --- | --- |
| Core Ceiling 01-02 | Pathway to balcony |
| Core Ceiling 03-08 | Living area |
| Core Ceiling 09-10 | Kitchen area |

## Current Parallel Agents

| Agent | Lane | Current brief |
| --- | --- | --- |
| Dewey | Home Map Naming | Prepare a lane brief for Hue/HA naming ownership, available files/scripts, and remaining device-area review items. |
| Mill | HA Automations / Node-RED | Prepare a lane brief for HA automations, Node-RED/runtime locations, safe inspection boundaries, and first opportunities. |

Agents should not apply cross-lane changes without coordination.


==== FILE: /Users/jeff/Downloads/10_Archive/Duplicated-Pending Deletion/Exports/sources/homeassistant/remote-docs/hue-structure-plan.md (modified: 2026-05-24 04:19:13) ====

# Hue Flat Naming & Structure

Last checked: 2026-05-24

This document tracks the Hue and Home Assistant naming layer for the flat. The priority is daily usability in Hue, HomeKit, Siri/voice, Home Assistant, dashboards, and physical control habits.

The flat uses a hybrid naming model:

- preserve the spatial codes because they are meaningful in the home model
- pair them with plain room/use language so the names remain readable in Hue, HomeKit, and HA
- keep fixture numbers stable so physical location, dashboards, and automations can converge

## Room Codes

| Code | User-facing meaning |
| --- | --- |
| Core | Shared open-plan living / dining / kitchen area |
| Alpha | Bedroom |
| Beta | Bedroom / spare room |
| Throne | Bathroom |
| Splash | Bathroom |
| Pass | Hallway |
| Chaos | Utility / storage |

## Current Hue Rooms

| Hue room |
| --- |
| Core Open Plan |
| Alpha Bedroom |
| Beta Bedroom |
| Pass Hallway |
| Splash Bathroom |
| Throne Bathroom |
| Chaos Utility |

`Core Kitchen` was deleted as a separate Hue room. Kitchen is now represented as a Core lighting zone rather than a separate room.

## Current Home Assistant Areas

Home Assistant areas were consolidated on 2026-05-24 to match the flat's room model. Duplicate, stale, and device-named areas were retired after their devices were moved.

| HA area | Aliases | Device count |
| --- | --- | ---: |
| Core Open Plan | Open Plan; Openplan; Openplan Core; Living Room; Living; Dining | 35 |
| Core Kitchen | Kitchen | 5 |
| Alpha Bedroom | Bedroom; Bedroom Alpha; Primary Bedroom; Main Bedroom | 23 |
| Beta Bedroom | Spare Bedroom; Spare Room; Room 2; Rear Bedroom; Guest Bedroom | 15 |
| Pass Hallway | Hallway; Pass; Front Door; Entry; Entrance | 10 |
| Throne Bathroom | Ensuite; Ensuite Bathroom; Main Bathroom; My Bathroom | 7 |
| Splash Bathroom | Secondary Bathroom; Rear Bathroom; Bathroom 2; Splash | 7 |
| Chaos Utility | Chaos; Utility; Laundry; Laundry Room; Laundry/Utilities; Storage | 5 |
| Parking | | 1 |

Retired HA areas:

- `Attic`
- `Bedroom`
- `Beta Bedroom` duplicate area
- `Default`
- `Dining`
- `Front Door`
- `Laundry room`
- `Living Room`
- `Living Room (2)`
- `My Bathroom`
- `Openplan`
- `Orange HomePod Mini`
- `Storage`
- `White HomePod Mini`

Area consolidation verification:

- Stale device area references: 0
- Stale entity area references: 0
- Registry backups were created before the merge in `/srv/homeassistant/config/.storage/` with the suffix `codex-area-merge-20260524-030121.bak`.

## Home Assistant Device Area Reconciliation

Device areas were cross-referenced on 2026-05-24 using Hue room/zone membership, Home Assistant device names, and the current flat area model. High-confidence changes were applied through Home Assistant's device registry websocket API. Ambiguous devices were left unassigned for user confirmation.

Applied high-confidence assignments:

| Target HA area | Devices assigned |
| --- | --- |
| Core Open Plan | `Core Ambient`; `Core Living`; Core ambient/member Hue devices from the Core Hue room; Aqara Openplan/dining/living presence helper devices; `Core Path` zone |
| Core Kitchen | `Core Kitchen`; Core kitchen ceiling devices 09-10; Aqara kitchen presence helper devices |
| Alpha Bedroom | Alpha Hue room/zone devices; bedroom display; remaining Nymane/Nyamane bedroom spot |
| Beta Bedroom | Beta Hue room/zone devices; Beta bedroom presence helper devices |
| Pass Hallway | Pass Hue room/zone devices |
| Chaos Utility | Chaos Hue room/zone devices where Hue/device naming aligned |

Verification after reconciliation:

- Total HA devices: 151
- Assigned to flat areas: 108
- Left unassigned / pending confirmation: 43
- Stale device area references: 0

Pending confirmation queue:

| Device group | Count | Why left pending |
| --- | ---: | --- |
| Apple mobile devices / laptops | 4 | Personal devices move around; assigning them to rooms would be misleading. |
| System / virtual integrations | 4 | `Sun`, `Forecast`, `Backup`, and Bluetooth adapter are not physical room devices. |
| Aqara unnamed door/window sensors | 7 | No room signal in the device names. |
| Aqara unnamed motion/presence/vibration/switch devices | 6 | Physical placement cannot be inferred confidently from generic names. |
| Aqara curtain drivers | 2 | Need window/room confirmation. |
| Aqara Hub M3 | 1 | Hub placement affects area only if it is useful in HA UI. |
| Google Nest Hub displays with generic names | 3 | `Loft Display` and duplicate `NestHubD029` names need room confirmation or rename first. |
| Hue smart buttons / smart plug | 3 | Button/plug names do not identify their physical room. |
| SwitchBot Hub 3, buttons, sensors, bot, roller shades | 11 | Likely one cluster, but room/window assignment should be confirmed before area placement. |
| WiZ A60 Filament | 1 | No room signal in the name. |
| Serif TV | 1 | Likely Core Open Plan, but left pending because the name alone does not prove placement. |

Known conflict left for review:

- `Laundry (Chaos) Ceiling Light` and `White (E27) Hue Bulb` are assigned to `Chaos Utility` in HA because their device names indicate utility/storage. Their Hue room signal previously pointed at `Pass Hallway`; if the physical bulbs still live in the hallway, Hue membership should be corrected rather than carrying the mismatch forward.

## Core Ceiling Numbering

Core ceiling fixtures are now numbered across the whole Core area:

| Range | Meaning |
| --- | --- |
| Core Ceiling 01-02 | Pathway to balcony |
| Core Ceiling 03-08 | Living area |
| Core Ceiling 09-10 | Kitchen area |

Individual fixture names in Hue and HA:

| Hue name | HA entity |
| --- | --- |
| Core Ceiling 01 | `light.core_ceiling_01` |
| Core Ceiling 02 | `light.core_ceiling_02` |
| Core Ceiling 03 | `light.core_ceiling_03` |
| Core Ceiling 04 | `light.core_ceiling_04` |
| Core Ceiling 05 | `light.core_ceiling_05` |
| Core Ceiling 06 | `light.core_ceiling_06` |
| Core Ceiling 07 | `light.core_ceiling_07` |
| Core Ceiling 08 | `light.core_ceiling_08` |
| Core Ceiling 09 | `light.core_ceiling_09` |
| Core Ceiling 10 | `light.core_ceiling_10` |

## Core Groups / Zones

The Core control layer exists in both Hue zones and HA light entities:

| Group | Contents | HA entity |
| --- | --- | --- |
| Core Path | Core Ceiling 01-02 | `light.core_path` |
| Core Living | Core Ceiling 03-08 | `light.core_living` |
| Core Kitchen | Core Ceiling 09-10 | `light.core_kitchen` |
| Core Ceiling | Core Ceiling 01-10 | `light.core_ceiling` |
| Core Ambient | Core lamps / strips / decorative ambient lights | `light.core_ambient` |
| Core All | Core Ceiling plus Core Ambient | `light.core_all` |

Hue zone child counts after verification:

| Hue zone | Child count |
| --- | ---: |
| Core Path | 2 |
| Core Living | 6 |
| Core Kitchen | 2 |
| Core Ceiling | 10 |
| Core Ambient | 9 |
| Core All | 19 |

## Applied Core Changes

Applied on 2026-05-24:

- Renamed Hue fixtures from `Core Open Plan Ceiling 01-08` and `Core Kitchen Ceiling 01-02` to `Core Ceiling 01-10`.
- Updated/created Hue zones: `Core Path`, `Core Living`, `Core Kitchen`, `Core Ceiling`, `Core All`.
- Renamed HA entity IDs and friendly names for the ten Core ceiling fixtures.
- Renamed HA entity IDs and friendly names for the Core group layer.

Applied ambient layer on 2026-05-24:

- Created Hue zone `Core Ambient`.
- Home Assistant exposed it as `light.core_ambient`.
- `Core Ambient` is the non-ceiling Core layer: lamps, Hue Play, gradient tube/strip, and decorative ambient fixtures.

## Verification

Hue verification:

- Core ceiling fixtures found: `Core Ceiling 01` through `Core Ceiling 10`
- Core zones found: `Core Path`, `Core Living`, `Core Kitchen`, `Core Ceiling`, `Core Ambient`, `Core All`

Home Assistant verification:

- Individual fixtures found as `light.core_ceiling_01` through `light.core_ceiling_10`
- Groups found as `light.core_path`, `light.core_living`, `light.core_kitchen`, `light.core_ceiling`, `light.core_ambient`, `light.core_all`

## Remaining Notes

- `Core All` currently includes Core Ceiling 01-10 plus the Core ambient layer available from Hue at the time of the change.
- The HA registry was updated through Home Assistant's websocket registry API, not by editing `.storage` directly.
- Future structural changes should preserve the hybrid naming model: code first, plain-language meaning second where needed.


==== FILE: /Users/jeff/Downloads/10_Archive/Duplicated-Pending Deletion/Exports/agentic_tier3_kit 2/ha/ha_cleaned_yaml/blueprints/automation/bedroom_suite_bath_path.yaml (modified: 2026-05-18 17:21:44) ====

blueprint:
  name: Bedroom Suite • Bathroom Path
  description: >
    Coordinates wardrobe + bathroom lighting for bathroom trips.
    Triggered by wardrobe/bathroom motion; applies ultra-low warm lighting at night.
  domain: automation

  input:
    wardrobe_motion:
      name: Wardrobe motion / presence sensor
      selector:
        entity:
          domain: binary_sensor

    bathroom_motion:
      name: Bathroom motion sensor
      selector:
        entity:
          domain: binary_sensor

    wardrobe_light:
      name: Wardrobe ceiling light / group
      selector:
        target:
          entity:
            domain: light

    bathroom_light:
      name: Bathroom ceiling light / group
      selector:
        target:
          entity:
            domain: light

    # Time windows
    night_start:
      name: Night starts at
      default: "23:00:00"
      selector:
        time: {}
    night_end:
      name: Night ends at
      default: "06:00:00"
      selector:
        time: {}

    morning_start:
      name: Morning starts at
      default: "06:00:00"
      selector:
        time: {}
    morning_end:
      name: Morning ends at
      default: "09:30:00"
      selector:
        time: {}

    evening_start:
      name: Evening starts at
      default: "16:00:00"
      selector:
        time: {}

    # Profiles
    day_brightness:
      name: Day brightness (%)
      default: 80
      selector:
        number:
          min: 1
          max: 100
          unit_of_measurement: "%"
    day_color_temp:
      name: Day color temperature (mired)
      default: 300
      selector:
        number:
          min: 250
          max: 500
          unit_of_measurement: "mired"

    evening_brightness:
      name: Evening brightness (%)
      default: 60
      selector:
        number:
          min: 1
          max: 100
          unit_of_measurement: "%"
    evening_color_temp:
      name: Evening color temperature (mired)
      default: 340
      selector:
        number:
          min: 250
          max: 500
          unit_of_measurement: "mired"

    night_brightness_wardrobe:
      name: Night brightness – wardrobe (%)
      default: 18
      selector:
        number:
          min: 1
          max: 40
          unit_of_measurement: "%"
    night_brightness_bathroom:
      name: Night brightness – bathroom (%)
      default: 10
      selector:
        number:
          min: 1
          max: 40
          unit_of_measurement: "%"
    night_color_temp:
      name: Night color temperature (mired)
      default: 430
      selector:
        number:
          min: 300
          max: 500
          unit_of_measurement: "mired"

    off_delay:
      name: Off delay after last movement (minutes)
      default: 4
      selector:
        number:
          min: 1
          max: 30
          unit_of_measurement: minutes
          mode: slider

    fade_in_transition:
      name: Fade-in time (seconds)
      default: 2
      selector:
        number:
          min: 0
          max: 20
          unit_of_measurement: "s"
    fade_out_transition:
      name: Fade-out time (seconds)
      default: 4
      selector:
        number:
          min: 0
          max: 30
          unit_of_measurement: "s"

mode: restart

variables:
  off_delay: !input off_delay
  fade_in_transition: !input fade_in_transition
  fade_out_transition: !input fade_out_transition
  night_start: !input night_start
  night_end: !input night_end
  morning_start: !input morning_start
  morning_end: !input morning_end
  evening_start: !input evening_start
  day_brightness: !input day_brightness
  day_color_temp: !input day_color_temp
  evening_brightness: !input evening_brightness
  evening_color_temp: !input evening_color_temp
  night_brightness_wardrobe: !input night_brightness_wardrobe
  night_brightness_bathroom: !input night_brightness_bathroom
  night_color_temp: !input night_color_temp

trigger:
  - id: wardrobe_motion_on
    platform: state
    entity_id: !input wardrobe_motion
    to: "on"
  - id: bathroom_motion_on
    platform: state
    entity_id: !input bathroom_motion
    to: "on"
  - id: wardrobe_motion_off
    platform: state
    entity_id: !input wardrobe_motion
    to: "off"
  - id: bathroom_motion_off
    platform: state
    entity_id: !input bathroom_motion
    to: "off"

action:
  - choose:
      # TURN ON: any motion
      - conditions:
          - condition: or
            conditions:
              - condition: trigger
                id: wardrobe_motion_on
              - condition: trigger
                id: bathroom_motion_on
        sequence:
          # Don't bother in full daylight
          - condition: numeric_state
            entity_id: sun.sun
            attribute: elevation
            below: 20

          - choose:
              # Night – ultra gentle
              - conditions:
                  - condition: or
                    conditions:
                      - condition: time
                        after: !input night_start
                      - condition: time
                        before: !input night_end
                sequence:
                  - service: light.turn_on
                    target: !input wardrobe_light
                    data:
                      brightness_pct: "{{ night_brightness_wardrobe | int }}"
                      color_temp: "{{ night_color_temp | int }}"
                      transition: "{{ fade_in_transition | int }}"
                  - service: light.turn_on
                    target: !input bathroom_light
                    data:
                      brightness_pct: "{{ night_brightness_bathroom | int }}"
                      color_temp: "{{ night_color_temp | int }}"
                      transition: "{{ fade_in_transition | int }}"

              # Morning – brighter and neutral-warm
              - conditions:
                  - condition: time
                    after: !input morning_start
                    before: !input morning_end
                sequence:
                  - service: light.turn_on
                    target: !input bathroom_light
                    data:
                      brightness_pct: 60
                      color_temp: 320
                      transition: "{{ fade_in_transition | int }}"
                  - service: light.turn_on
                    target: !input wardrobe_light
                    data:
                      brightness_pct: 50
                      color_temp: 320
                      transition: "{{ fade_in_transition | int }}"

              # Evening – warm and functional
              - conditions:
                  - condition: time
                    after: !input evening_start
                    before: !input night_start
                sequence:
                  - service: light.turn_on
                    target: !input bathroom_light
                    data:
                      brightness_pct: "{{ evening_brightness | int }}"
                      color_temp: "{{ evening_color_temp | int }}"
                      transition: "{{ fade_in_transition | int }}"
                  - service: light.turn_on
                    target: !input wardrobe_light
                    data:
                      brightness_pct: "{{ evening_brightness | int }}"
                      color_temp: "{{ evening_color_temp | int }}"
                      transition: "{{ fade_in_transition | int }}"

            default:
              # Day – if it's gloomy (sun < 20) but not evening yet
              - service: light.turn_on
                target: !input bathroom_light
                data:
                  brightness_pct: "{{ day_brightness | int }}"
                  color_temp: "{{ day_color_temp | int }}"
                  transition: "{{ fade_in_transition | int }}"
              - service: light.turn_on
                target: !input wardrobe_light
                data:
                  brightness_pct: "{{ day_brightness | int }}"
                  color_temp: "{{ day_color_temp | int }}"
                  transition: "{{ fade_in_transition | int }}"

      # TURN OFF: both sensors quiet
      - conditions:
          - condition: or
            conditions:
              - condition: trigger
                id: wardrobe_motion_off
              - condition: trigger
                id: bathroom_motion_off
        sequence:
          - delay:
              minutes: "{{ off_delay | int }}"
          - condition: state
            entity_id: !input wardrobe_motion
            state: "off"
          - condition: state
            entity_id: !input bathroom_motion
            state: "off"
          - service: light.turn_off
            target: !input bathroom_light
            data:
              transition: "{{ fade_out_transition | int }}"
          - service: light.turn_off
            target: !input wardrobe_light
            data:
              transition: "{{ fade_out_transition | int }}"


==== FILE: /Users/jeff/Downloads/10_Archive/Duplicated-Pending Deletion/Exports/agentic_tier3_kit 2/ha/ha_cleaned_yaml/blueprints/automation/ceiling_daily_rhythm_presence.yaml (modified: 2026-05-18 17:21:45) ====

blueprint:
  name: Ceiling • Daily Rhythm + Presence
  description: >
    Presence-based ceiling light automation that follows the day (morning/day/evening/night),
    fades out after a delay, and can be limited by sun elevation (so it generally won't run
    in full daylight unless you explicitly enable daytime).
  domain: automation

  input:
    sensor_entity:
      name: Motion / Presence Sensor
      selector:
        entity:
          domain: binary_sensor

    light_target:
      name: Ceiling Light / Group
      selector:
        target:
          entity:
            domain: light

    sun_elevation_below:
      name: Run only when sun elevation below
      description: 15° ≈ bright daytime. Lower number = stricter (only darker conditions).
      default: 15
      selector:
        number:
          min: -10
          max: 45
          step: 1
          unit_of_measurement: "°"

    # Time windows
    morning_start:
      name: Morning starts at
      default: "06:00:00"
      selector:
        time: {}
    morning_end:
      name: Morning ends at
      default: "09:30:00"
      selector:
        time: {}
    evening_start:
      name: Evening starts at
      default: "16:00:00"
      selector:
        time: {}
    night_start:
      name: Night starts at
      default: "23:00:00"
      selector:
        time: {}
    night_end:
      name: Night ends at
      default: "06:00:00"
      selector:
        time: {}

    enable_daytime:
      name: Enable daytime automation (between morning_end and evening_start)
      default: false
      selector:
        boolean: {}

    # Profiles
    morning_brightness:
      name: Morning brightness (%)
      default: 45
      selector:
        number:
          min: 1
          max: 100
          unit_of_measurement: "%"
    morning_color_temp:
      name: Morning color temperature (mired)
      default: 330
      selector:
        number:
          min: 250
          max: 500
          unit_of_measurement: "mired"

    day_brightness:
      name: Day brightness (%)
      default: 70
      selector:
        number:
          min: 1
          max: 100
          unit_of_measurement: "%"
    day_color_temp:
      name: Day color temperature (mired)
      default: 300
      selector:
        number:
          min: 250
          max: 500
          unit_of_measurement: "mired"

    evening_brightness:
      name: Evening brightness (%)
      default: 55
      selector:
        number:
          min: 1
          max: 100
          unit_of_measurement: "%"
    evening_color_temp:
      name: Evening color temperature (mired)
      default: 350
      selector:
        number:
          min: 250
          max: 500
          unit_of_measurement: "mired"

    night_brightness:
      name: Night brightness (%)
      default: 16
      selector:
        number:
          min: 1
          max: 50
          unit_of_measurement: "%"
    night_color_temp:
      name: Night color temperature (mired)
      default: 420
      selector:
        number:
          min: 300
          max: 500
          unit_of_measurement: "mired"

    # Tuning
    off_delay:
      name: Off delay after room empty (minutes)
      default: 4
      selector:
        number:
          min: 0
          max: 60
          unit_of_measurement: minutes
          mode: slider
    fade_in_transition:
      name: Fade-in time (seconds)
      default: 4
      selector:
        number:
          min: 0
          max: 30
          unit_of_measurement: "s"
    fade_out_transition:
      name: Fade-out time (seconds)
      default: 6
      selector:
        number:
          min: 0
          max: 60
          unit_of_measurement: "s"

mode: restart

variables:
  off_delay: !input off_delay
  sun_elevation_below: !input sun_elevation_below
  morning_start: !input morning_start
  morning_end: !input morning_end
  evening_start: !input evening_start
  night_start: !input night_start
  night_end: !input night_end
  enable_daytime: !input enable_daytime
  morning_brightness: !input morning_brightness
  morning_color_temp: !input morning_color_temp
  day_brightness: !input day_brightness
  day_color_temp: !input day_color_temp
  evening_brightness: !input evening_brightness
  evening_color_temp: !input evening_color_temp
  night_brightness: !input night_brightness
  night_color_temp: !input night_color_temp
  fade_in_transition: !input fade_in_transition
  fade_out_transition: !input fade_out_transition

trigger:
  - id: presence_on
    platform: state
    entity_id: !input sensor_entity
    to: "on"
  - id: presence_off
    platform: state
    entity_id: !input sensor_entity
    to: "off"

action:
  - choose:
      # 1) SENSOR ON → pick phase + fade in
      - conditions:
          - condition: trigger
            id: presence_on
          - condition: numeric_state
            entity_id: sun.sun
            attribute: elevation
            below: !input sun_elevation_below
        sequence:
          - choose:
              # Night
              - conditions:
                  - condition: or
                    conditions:
                      - condition: time
                        after: !input night_start
                      - condition: time
                        before: !input night_end
                sequence:
                  - service: light.turn_on
                    target: !input light_target
                    data:
                      brightness_pct: "{{ night_brightness | int }}"
                      color_temp: "{{ night_color_temp | int }}"
                      transition: "{{ fade_in_transition | int }}"

              # Morning
              - conditions:
                  - condition: time
                    after: !input morning_start
                    before: !input morning_end
                sequence:
                  - service: light.turn_on
                    target: !input light_target
                    data:
                      brightness_pct: "{{ morning_brightness | int }}"
                      color_temp: "{{ morning_color_temp | int }}"
                      transition: "{{ fade_in_transition | int }}"

              # Evening
              - conditions:
                  - condition: time
                    after: !input evening_start
                    before: !input night_start
                sequence:
                  - service: light.turn_on
                    target: !input light_target
                    data:
                      brightness_pct: "{{ evening_brightness | int }}"
                      color_temp: "{{ evening_color_temp | int }}"
                      transition: "{{ fade_in_transition | int }}"

              # Optional Day
              - conditions:
                  - condition: template
                    value_template: "{{ enable_daytime | bool }}"
                  - condition: time
                    after: !input morning_end
                    before: !input evening_start
                sequence:
                  - service: light.turn_on
                    target: !input light_target
                    data:
                      brightness_pct: "{{ day_brightness | int }}"
                      color_temp: "{{ day_color_temp | int }}"
                      transition: "{{ fade_in_transition | int }}"

            default:
              - service: light.turn_on
                target: !input light_target
                data:
                  brightness_pct: "{{ evening_brightness | int }}"
                  color_temp: "{{ evening_color_temp | int }}"
                  transition: "{{ fade_in_transition | int }}"

      # 2) SENSOR OFF → delay + fade out
      - conditions:
          - condition: trigger
            id: presence_off
        sequence:
          - delay:
              minutes: "{{ off_delay | int }}"
          - condition: state
            entity_id: !input sensor_entity
            state: "off"
          - service: light.turn_off
            target: !input light_target
            data:
              transition: "{{ fade_out_transition | int }}"


==== FILE: /Users/jeff/Downloads/10_Archive/Duplicated-Pending Deletion/Exports/agentic_tier3_kit 2/ha/ha_cleaned_yaml/blueprints/automation/room_follow_me_atmosphere.yaml (modified: 2026-05-18 17:21:44) ====

blueprint:
  name: Room • Follow-Me Atmospheric Lighting
  description: >
    Fade-in / fade-out atmospheric lighting that reacts to motion/presence.
    Uses an "evening" profile and a "night (sleepy)" profile. Only runs when
    it's dark outside (sun elevation below threshold).
  domain: automation

  input:
    sensor_entity:
      name: Motion / Presence Sensor
      description: Binary sensor that indicates occupancy (motion or presence).
      selector:
        entity:
          domain: binary_sensor

    light_target:
      name: Light or Light Group
      description: The light (or group) to control.
      selector:
        target:
          entity:
            domain: light

    off_delay:
      name: Off delay (minutes)
      description: How long after the room is empty before fading lights out.
      default: 4
      selector:
        number:
          min: 0
          max: 60
          unit_of_measurement: minutes
          mode: slider

    dark_elevation_below:
      name: Run only when sun elevation below
      description: 0 ≈ sunset/dusk. Increase if you want it to trigger earlier.
      default: 0
      selector:
        number:
          min: -10
          max: 30
          step: 1
          unit_of_measurement: "°"

    evening_start:
      name: Evening starts at
      default: "16:00:00"
      selector:
        time: {}

    night_start:
      name: Night (sleepy) starts at
      default: "22:30:00"
      selector:
        time: {}

    morning_end:
      name: Night ends at
      default: "06:00:00"
      selector:
        time: {}

    evening_brightness:
      name: Evening brightness (%)
      default: 60
      selector:
        number:
          min: 1
          max: 100
          unit_of_measurement: "%"

    evening_color_temp:
      name: Evening color temperature (mired)
      description: Lower = cooler, higher = warmer.
      default: 350
      selector:
        number:
          min: 250
          max: 500
          unit_of_measurement: "mired"

    night_brightness:
      name: Night brightness (%)
      default: 18
      selector:
        number:
          min: 1
          max: 50
          unit_of_measurement: "%"

    night_color_temp:
      name: Night color temperature (mired)
      default: 400
      selector:
        number:
          min: 300
          max: 500
          unit_of_measurement: "mired"

    fade_in_transition:
      name: Fade-in time (seconds)
      default: 4
      selector:
        number:
          min: 0
          max: 30
          unit_of_measurement: "s"

    fade_out_transition:
      name: Fade-out time (seconds)
      default: 6
      selector:
        number:
          min: 0
          max: 60
          unit_of_measurement: "s"

mode: restart

variables:
  off_delay: !input off_delay
  dark_elevation_below: !input dark_elevation_below
  evening_start: !input evening_start
  night_start: !input night_start
  morning_end: !input morning_end
  evening_brightness: !input evening_brightness
  evening_color_temp: !input evening_color_temp
  night_brightness: !input night_brightness
  night_color_temp: !input night_color_temp
  fade_in_transition: !input fade_in_transition
  fade_out_transition: !input fade_out_transition

trigger:
  - id: presence_on
    platform: state
    entity_id: !input sensor_entity
    to: "on"
  - id: presence_off
    platform: state
    entity_id: !input sensor_entity
    to: "off"

action:
  - choose:
      # 1) SENSOR ON → Fade in
      - conditions:
          - condition: trigger
            id: presence_on
          - condition: numeric_state
            entity_id: sun.sun
            attribute: elevation
            below: !input dark_elevation_below
        sequence:
          - choose:
              # Evening profile
              - conditions:
                  - condition: time
                    after: !input evening_start
                    before: !input night_start
                sequence:
                  - service: light.turn_on
                    target: !input light_target
                    data:
                      brightness_pct: "{{ evening_brightness | int }}"
                      color_temp: "{{ evening_color_temp | int }}"
                      transition: "{{ fade_in_transition | int }}"

              # Night profile
              - conditions:
                  - condition: or
                    conditions:
                      - condition: time
                        after: !input night_start
                      - condition: time
                        before: !input morning_end
                sequence:
                  - service: light.turn_on
                    target: !input light_target
                    data:
                      brightness_pct: "{{ night_brightness | int }}"
                      color_temp: "{{ night_color_temp | int }}"
                      transition: "{{ fade_in_transition | int }}"
            default:
              - service: light.turn_on
                target: !input light_target
                data:
                  brightness_pct: "{{ evening_brightness | int }}"
                  color_temp: "{{ evening_color_temp | int }}"
                  transition: "{{ fade_in_transition | int }}"

      # 2) SENSOR OFF → Delay + fade out
      - conditions:
          - condition: trigger
            id: presence_off
        sequence:
          - delay:
              minutes: "{{ off_delay | int }}"
          - condition: state
            entity_id: !input sensor_entity
            state: "off"
          - service: light.turn_off
            target: !input light_target
            data:
              transition: "{{ fade_out_transition | int }}"


==== FILE: /Users/jeff/Downloads/10_Archive/Duplicated-Pending Deletion/Exports/agentic_tier3_kit 2/inventory/homeassistant_entity_reference.md (modified: 2026-05-18 17:21:31) ====

# Home Assistant Entity Reference Map — Blank

## Open Plan (Living / Dining / Kitchen)
- binary_sensor.presence_sensor_fp2_openplan
- binary_sensor.presence_sensor_fp2_living_area
- binary_sensor.presence_sensor_fp2_kitchen
- binary_sensor.presence_sensor_fp2_dining_area
- light.open_plan_ceiling
- light.open_plan_ambient
- light.open_plan_all_lights
- cover.openplan_curtains
- climate.living_ac
- sensor.openplan_temp
- sensor.openplan_humidity
- media_player.living_homepods
- media_player.apple_tv
- scene.living_relax
- scene.living_concentrate
- scene.living_energise
- scene.living_nightlight

## Bedroom 1
- binary_sensor.bedroom1_fp2_presence
- binary_sensor.bedroom1_fp2_bedzone
- binary_sensor.bedroom1_door
- light.bedroom1_all_lights
- climate.bedroom1_ac
- fan.bedroom1_purifier
- fan.bedroom1_humidifier
- sensor.bedroom1_temp
- sensor.bedroom1_humidity
- binary_sensor.bedroom1_withings_sleep_inbed
- sensor.bedroom1_withings_deepsleep
- sensor.withings_sleep_light_sleep
- media_player.bedroom1_homepod
- media_player.bedroom1_tv

## Bedroom 2
- binary_sensor.bedroom2_fp2_presence
- binary_sensor.bedroom2_fp2_bedzone
- binary_sensor.bedroom2_door
- light.bedroom2_all_lights
- climate.bedroom2_ac
- media_player.bedroom2_homepod
- media_player.bedroom2_tv

## Hallway
- binary_sensor.hallway_motion
- binary_sensor.hallway_door
- light.hallway_all_lights
- scene.hallway_relax
- scene.hallway_sleepy15
- scene.hallway_read

## Bathrooms
- binary_sensor.bath1_motion
- binary_sensor.bath2_motion
- binary_sensor.bath1_door
- binary_sensor.bath2_door
- light.bathroom1_all_lights
- light.bathroom2_all_lights
- scene.bathroom_relax
- scene.bathroom_nightlight

## Laundry / Storage
- binary_sensor.laundry_sns_door_door
- vacuum.eufy_s1_omni_pro

## System / Helpers
- device_tracker.iphone_16_pro_max
- device_tracker.primary_ipad_10_5
- input_boolean.sleep_mode
- input_boolean.guest_mode
- input_boolean.override_mode
- input_boolean.focus_mode
- input_boolean.recovery_mode
- input_boolean.hydration_nags_enabled
- input_number.hydration_interval_minutes
- sun.sun

## Hubs / Infrastructure
- button.aqara_hub_m3_identify
- hue.bridge_pro
- media_player.homepods
- media_player.apple_tv_main

## Automations (active or intended)
- automation.room_presence_lighting
- automation.sleep_mode_wind_down
- automation.wake_up_morning_reset
- automation.away_mode_power_down
- automation.night_bathroom_light
- automation.climate_guard
- automation.humidity_comfort
- automation.hydration_nudge


==== FILE: /Users/jeff/Downloads/10_Archive/Duplicated-Pending Deletion/Exports/agents_workspace_kit/actions/home_assistant_openapi.yaml (modified: 2026-05-18 18:38:24) ====

openapi: 3.1.0
info:
  title: Home Assistant REST API (Minimal)
  version: 1.0.0
  description: |
    Minimal Home Assistant API for reading entity state and calling services.
    IMPORTANT: Set the server URL to your Home Assistant base URL (e.g., https://ha.example.com).
servers:
  - url: https://YOUR_HOME_ASSISTANT_BASE_URL
paths:
  /api/:
    get:
      operationId: getApiRoot
      summary: API root
      responses:
        "200":
          description: OK
  /api/config:
    get:
      operationId: getConfig
      summary: Get Home Assistant config (timezone, location, etc.)
      responses:
        "200":
          description: OK
  /api/states:
    get:
      operationId: listStates
      summary: List all entity states (can be large)
      responses:
        "200":
          description: OK
  /api/states/{entity_id}:
    get:
      operationId: getState
      summary: Get a single entity state
      parameters:
        - name: entity_id
          in: path
          required: true
          schema:
            type: string
          description: Home Assistant entity_id (e.g., light.kitchen)
      responses:
        "200":
          description: OK
        "404":
          description: Not Found
  /api/services/{domain}/{service}:
    post:
      operationId: callService
      summary: Call a Home Assistant service
      parameters:
        - name: domain
          in: path
          required: true
          schema:
            type: string
          description: Service domain (e.g., light, switch, scene, script)
        - name: service
          in: path
          required: true
          schema:
            type: string
          description: Service name (e.g., turn_on, turn_off, toggle)
      requestBody:
        required: false
        content:
          application/json:
            schema:
              type: object
              additionalProperties: true
            examples:
              turn_on_light:
                summary: Turn on a light
                value:
                  entity_id: light.kitchen
                  brightness_pct: 30
                  transition: 2
      responses:
        "200":
          description: OK
components:
  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer
security:
  - bearerAuth: []


==== FILE: /Users/jeff/Downloads/10_Archive/Duplicated-Pending Deletion/Exports/infrastructure/N8N/51CHQXWOEecaDRer-ChatGPT_to_Home_Assistant_Automation_Writer_with_Feedback_Loop.json (modified: 2025-12-03 02:04:38) ====

{
  "name": "ChatGPT to Home Assistant Automation Writer with Feedback Loop",
  "nodes": [
    {
      "parameters": {
        "respondWith": "json",
        "responseBody": "={{ $json }}",
        "options": {
          "responseCode": 200
        }
      },
      "id": "94ce8ee7-5f22-4120-bda0-c19ed6fe5a62",
      "name": "Send Response to ChatGPT",
      "type": "n8n-nodes-base.respondToWebhook",
      "typeVersion": 1.5,
      "position": [
        -400,
        320
      ]
    },
    {
      "parameters": {
        "assignments": {
          "assignments": [
            {
              "id": "id-1",
              "name": "wrote",
              "value": true,
              "type": "boolean"
            },
            {
              "id": "id-2",
              "name": "automation_id",
              "value": "={{ $('ChatGPT Custom Action Webhook').item.json.body.automation_id }}",
              "type": "string"
            },
            {
              "id": "id-3",
              "name": "ha_response",
              "value": "={{ $('Write Automation to File').item.json }}",
              "type": "object"
            },
            {
              "id": "85f4c10e-564d-4c99-8c6d-adc29c796f63",
              "name": "reloaded",
              "value": true,
              "type": "boolean"
            },
            {
              "id": "5c5073ca-a308-497b-9da6-b8b9b31eeb1f",
              "name": "reloaded_response",
              "value": "={{ $('Reload HA Automations').item.json }}",
              "type": "object"
            }
          ]
        },
        "options": {}
      },
      "id": "fa665880-1282-487b-b312-2059791efcbd",
      "name": "Format Response for ChatGPT",
      "type": "n8n-nodes-base.set",
      "typeVersion": 3.4,
      "position": [
        -624,
        320
      ]
    },
    {
      "parameters": {
        "resource": "service",
        "operation": "call",
        "domain": "automation",
        "service": "reload"
      },
      "id": "5fd029ea-9142-4d46-98ac-460cb0f16e52",
      "name": "Reload HA Automations",
      "type": "n8n-nodes-base.homeAssistant",
      "typeVersion": 1,
      "position": [
        -848,
        320
      ],
      "credentials": {
        "homeAssistantApi": {
          "id": "7wLyOzLMuiEtEWbl",
          "name": "Home Assistant account"
        }
      }
    },
    {
      "parameters": {
        "method": "POST",
        "url": "=https://jlwbrp0r3ehtw3gun0evo38gh1g2jjbz.ui.nabu.casa/api/config/automation/config/{{ $json.body.automation_id }}",
        "sendBody": true,
        "specifyBody": "json",
        "jsonBody": "={{ $json.body.automation }}",
        "options": {}
      },
      "id": "1924745b-47c6-42dc-b623-6b453ba78ba3",
      "name": "Write Automation to File",
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 4.3,
      "position": [
        -1072,
        320
      ]
    },
    {
      "parameters": {
        "httpMethod": "POST",
        "path": "ship-automation",
        "responseMode": "responseNode",
        "options": {
          "binaryPropertyName": ""
        }
      },
      "id": "89332d63-5178-42a3-9024-6f8c2b3645b4",
      "name": "ChatGPT Custom Action Webhook",
      "type": "n8n-nodes-base.webhook",
      "typeVersion": 2.1,
      "position": [
        -1296,
        320
      ],
      "webhookId": "4c5e9294-065e-4ce4-8da7-e949fbef8f08",
      "alwaysOutputData": true
    }
  ],
  "connections": {
    "Format Response for ChatGPT": {
      "main": [
        [
          {
            "node": "Send Response to ChatGPT",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Reload HA Automations": {
      "main": [
        [
          {
            "node": "Format Response for ChatGPT",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Write Automation to File": {
      "main": [
        [
          {
            "node": "Reload HA Automations",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "ChatGPT Custom Action Webhook": {
      "main": [
        [
          {
            "node": "Write Automation to File",
            "type": "main",
            "index": 0
          }
        ]
      ]
    }
  },
  "settings": {
    "executionOrder": "v1",
    "callerPolicy": "any",
    "availableInMCP": true,
    "saveExecutionProgress": true,
    "errorWorkflow": "AXLtKKUH7yLoz5tb"
  },
  "staticData": null,
  "pinData": {},
  "triggerCount": 1,
  "meta": {
    "templateCredsSetupCompleted": true
  }
}

==== FILE: /Users/jeff/Downloads/10_Archive/Duplicated-Pending Deletion/Exports/infrastructure/N8N/5EU9SO6Y4vV7RQEu-ChatGPT_to_Home_Assistant_Automation_Writer.json (modified: 2025-12-23 22:39:30) ====

{
  "name": "ChatGPT to Home Assistant Automation Writer",
  "nodes": [
    {
      "parameters": {
        "options": {}
      },
      "id": "f6b34f99-6e8b-4e14-94ee-f2ce5edd110e",
      "name": "Chat Trigger",
      "type": "@n8n/n8n-nodes-langchain.chatTrigger",
      "typeVersion": 1.4,
      "position": [
        -1376,
        544
      ],
      "webhookId": "7dada84a-e9b6-490c-a878-b050e996594a"
    },
    {
      "parameters": {},
      "id": "c6fa6488-0650-401a-bc0c-19356a9c01f0",
      "name": "Manual Test Trigger",
      "type": "n8n-nodes-base.manualTrigger",
      "typeVersion": 1,
      "position": [
        -1600,
        160
      ]
    },
    {
      "parameters": {
        "options": {}
      },
      "id": "8c1c8322-d2c2-4f83-a290-d2d5735e1d49",
      "name": "Test Chat Input",
      "type": "n8n-nodes-base.set",
      "typeVersion": 3.4,
      "position": [
        -1376,
        160
      ]
    },
    {
      "parameters": {
        "options": {}
      },
      "id": "284bf627-fc4d-4410-9b48-bc08e4ba932b",
      "name": "Workflow Configuration",
      "type": "n8n-nodes-base.set",
      "typeVersion": 3.4,
      "position": [
        -1088,
        160
      ]
    },
    {
      "parameters": {},
      "id": "240de728-8fc5-46d6-8d45-342288b97b43",
      "name": "Enrich Context",
      "type": "n8n-nodes-base.code",
      "typeVersion": 2,
      "position": [
        -800,
        160
      ]
    },
    {
      "parameters": {
        "options": {}
      },
      "id": "b587615a-4420-4328-bc48-2be664a9a21c",
      "name": "Conversational AI Agent",
      "type": "@n8n/n8n-nodes-langchain.agent",
      "typeVersion": 3,
      "position": [
        -576,
        160
      ]
    },
    {
      "parameters": {
        "model": {
          "__rl": true,
          "mode": "list",
          "value": "gpt-4.1-mini"
        },
        "builtInTools": {},
        "options": {}
      },
      "id": "f8c77160-e089-4df1-9c40-cd68ff12fb17",
      "name": "GPT-4o Chat Model",
      "type": "@n8n/n8n-nodes-langchain.lmChatOpenAi",
      "typeVersion": 1.3,
      "position": [
        -560,
        384
      ],
      "credentials": {
        "openAiApi": {
          "id": "CMhKPlZbpTSz8VdJ",
          "name": "OpenAi account"
        }
      }
    },
    {
      "parameters": {},
      "id": "71df26b2-54a0-4b4a-86ee-7c5f865fc7f4",
      "name": "Short-term Memory",
      "type": "@n8n/n8n-nodes-langchain.memoryBufferWindow",
      "typeVersion": 1.3,
      "position": [
        -432,
        384
      ]
    },
    {
      "parameters": {},
      "id": "59ca8f6b-1910-42c2-b3c2-f7e10b7bc2c1",
      "name": "Store Memories",
      "type": "n8n-nodes-base.code",
      "typeVersion": 2,
      "position": [
        -224,
        160
      ]
    },
    {
      "parameters": {
        "mode": "insert",
        "memoryKey": {
          "__rl": true,
          "mode": "list",
          "value": "vector_store_key"
        }
      },
      "id": "0c40c2b1-c22b-4201-8d0e-b43179a9f3aa",
      "name": "Episodic Memory Store",
      "type": "@n8n/n8n-nodes-langchain.vectorStoreInMemory",
      "typeVersion": 1.3,
      "position": [
        0,
        0
      ]
    },
    {
      "parameters": {
        "mode": "insert",
        "memoryKey": {
          "__rl": true,
          "mode": "list",
          "value": "vector_store_key"
        }
      },
      "id": "67dd0156-cae2-44d2-ab45-4d695dd50f68",
      "name": "User Profile Store",
      "type": "@n8n/n8n-nodes-langchain.vectorStoreInMemory",
      "typeVersion": 1.3,
      "position": [
        0,
        400
      ]
    },
    {
      "parameters": {
        "mode": "insert",
        "memoryKey": {
          "__rl": true,
          "mode": "list",
          "value": "vector_store_key"
        }
      },
      "id": "1634ecbb-ff6f-439d-8d4e-cf8ac53b8a0f",
      "name": "Semantic Knowledge Store",
      "type": "@n8n/n8n-nodes-langchain.vectorStoreInMemory",
      "typeVersion": 1.3,
      "position": [
        -1152,
        352
      ]
    },
    {
      "parameters": {
        "options": {}
      },
      "id": "8ecd4978-d88f-4cbd-9931-b0cfba0756d5",
      "name": "OpenAI Embeddings",
      "type": "@n8n/n8n-nodes-langchain.embeddingsOpenAi",
      "typeVersion": 1.2,
      "position": [
        16,
        224
      ],
      "credentials": {
        "openAiApi": {
          "id": "CMhKPlZbpTSz8VdJ",
          "name": "OpenAi account"
        }
      }
    },
    {
      "parameters": {
        "options": {}
      },
      "id": "87997a19-7450-4218-bb08-73b7bf8873e8",
      "name": "Memory Document Loader",
      "type": "@n8n/n8n-nodes-langchain.documentDefaultDataLoader",
      "typeVersion": 1.1,
      "position": [
        144,
        224
      ]
    },
    {
      "parameters": {
        "rule": {
          "interval": [
            {}
          ]
        }
      },
      "id": "38f10c36-9b0e-4887-93c1-aa91d926ceaf",
      "name": "Reflection Schedule",
      "type": "n8n-nodes-base.scheduleTrigger",
      "typeVersion": 1.3,
      "position": [
        -1600,
        352
      ]
    },
    {
      "parameters": {},
      "id": "c7c5b795-a9af-4171-af7b-06e21cb2d113",
      "name": "Reflection Engine",
      "type": "n8n-nodes-base.code",
      "typeVersion": 2,
      "position": [
        -1376,
        352
      ]
    }
  ],
  "connections": {
    "Chat Trigger": {
      "main": [
        [
          {
            "node": "Workflow Configuration",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Manual Test Trigger": {
      "main": [
        [
          {
            "node": "Test Chat Input",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Test Chat Input": {
      "main": [
        [
          {
            "node": "Workflow Configuration",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Workflow Configuration": {
      "main": [
        [
          {
            "node": "Enrich Context",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Enrich Context": {
      "main": [
        [
          {
            "node": "Conversational AI Agent",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "GPT-4o Chat Model": {
      "ai_languageModel": [
        [
          {
            "node": "Conversational AI Agent",
            "type": "ai_languageModel",
            "index": 0
          }
        ]
      ]
    },
    "Short-term Memory": {
      "ai_memory": [
        [
          {
            "node": "Conversational AI Agent",
            "type": "ai_memory",
            "index": 0
          }
        ]
      ]
    },
    "Conversational AI Agent": {
      "main": [
        [
          {
            "node": "Store Memories",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Store Memories": {
      "main": [
        [
          {
            "node": "Episodic Memory Store",
            "type": "main",
            "index": 0
          },
          {
            "node": "User Profile Store",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "OpenAI Embeddings": {
      "ai_embedding": [
        [
          {
            "node": "Episodic Memory Store",
            "type": "ai_embedding",
            "index": 0
          },
          {
            "node": "User Profile Store",
            "type": "ai_embedding",
            "index": 0
          },
          {
            "node": "Semantic Knowledge Store",
            "type": "ai_embedding",
            "index": 0
          }
        ]
      ]
    },
    "Memory Document Loader": {
      "ai_document": [
        [
          {
            "node": "Episodic Memory Store",
            "type": "ai_document",
            "index": 0
          },
          {
            "node": "User Profile Store",
            "type": "ai_document",
            "index": 0
          },
          {
            "node": "Semantic Knowledge Store",
            "type": "ai_document",
            "index": 0
          }
        ]
      ]
    },
    "Reflection Schedule": {
      "main": [
        [
          {
            "node": "Reflection Engine",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Reflection Engine": {
      "main": [
        [
          {
            "node": "Semantic Knowledge Store",
            "type": "main",
            "index": 0
          }
        ]
      ]
    }
  },
  "settings": {
    "executionOrder": "v1"
  },
  "staticData": {
    "node:Reflection Schedule": {
      "recurrenceRules": []
    }
  },
  "pinData": {},
  "triggerCount": 2,
  "meta": null
}

==== FILE: /Users/jeff/Downloads/10_Archive/Duplicated-Pending Deletion/Exports/infrastructure/N8N/AXLtKKUH7yLoz5tb-ChatGPT_to_Home_Assistant_Automation_Writer_with_Feedback_Loop.json (modified: 2025-12-03 02:04:38) ====

{
  "name": "ChatGPT to Home Assistant Automation Writer with Feedback Loop",
  "nodes": [
    {
      "parameters": {
        "httpMethod": "POST",
        "path": "get-entity",
        "authentication": "headerAuth",
        "responseMode": "lastNode",
        "options": {}
      },
      "id": "20c55cc3-da5a-407e-b6ad-9d903c794669",
      "name": "ChatGPT Custom Action Webhook",
      "type": "n8n-nodes-base.webhook",
      "typeVersion": 2.1,
      "position": [
        -5584,
        560
      ],
      "webhookId": "4c5e9294-065e-4ce4-8da7-e949fbef8f08",
      "retryOnFail": true,
      "credentials": {
        "httpHeaderAuth": {
          "id": "qPYW48A8AsuQ8rqd",
          "name": "Header Auth account"
        }
      },
      "onError": "continueRegularOutput"
    },
    {
      "parameters": {
        "conditions": {
          "options": {
            "caseSensitive": true,
            "leftValue": "",
            "typeValidation": "strict",
            "version": 2
          },
          "conditions": [
            {
              "id": "id-1",
              "leftValue": "={{ $json.body.action }}",
              "rightValue": "getEntityState",
              "operator": {
                "type": "string",
                "operation": "equals"
              }
            }
          ],
          "combinator": "and"
        },
        "options": {}
      },
      "id": "43b14528-9da0-4255-b1ea-78f8658483af",
      "name": "Route by Action",
      "type": "n8n-nodes-base.if",
      "typeVersion": 2.2,
      "position": [
        -5280,
        560
      ]
    },
    {
      "parameters": {
        "operation": "check"
      },
      "id": "96633891-1d91-46ac-addd-9b9f83cf2a34",
      "name": "Get HA Entity States",
      "type": "n8n-nodes-base.homeAssistant",
      "typeVersion": 1,
      "position": [
        -4528,
        464
      ],
      "credentials": {
        "homeAssistantApi": {
          "id": "7wLyOzLMuiEtEWbl",
          "name": "Home Assistant account"
        }
      }
    },
    {
      "parameters": {
        "method": "POST",
        "url": "=https://hooks.nabu.casa/gAAAAABpImwhcBYJ2bXYyxR4Uq0W2WwYDq4wW_sd9g-0RZHz-LbzzucccIlCHHd1VRTLrM1rWBOkI317pv8Dac1l2_AipV-cBD467_hiA_uvCjgbCA9VXYmc0lz-lSH7esfrfBUVMdkRUgCXKnfi9zujAFfCZ_0rpi93hCYcV3M7DtYJhW-aV38=",
        "authentication": "predefinedCredentialType",
        "nodeCredentialType": "homeAssistantApi",
        "sendBody": true,
        "specifyBody": "json",
        "jsonBody": "={ \"path\": $('Workflow Configuration').first().json.automationsFilePath, \"contents\": $('ChatGPT Custom Action Webhook').first().json.body.automation_yaml }",
        "options": {}
      },
      "id": "d15c8351-8aa0-4347-85b6-314f0e8776a6",
      "name": "Write Automation to File",
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 4.3,
      "position": [
        -4912,
        656
      ],
      "credentials": {
        "homeAssistantApi": {
          "id": "7wLyOzLMuiEtEWbl",
          "name": "Home Assistant account"
        }
      }
    },
    {
      "parameters": {
        "resource": "service",
        "operation": "call",
        "domain": "automation",
        "service": "reload"
      },
      "id": "087d6435-e98d-422a-a5ac-3b152398f384",
      "name": "Reload HA Automations",
      "type": "n8n-nodes-base.homeAssistant",
      "typeVersion": 1,
      "position": [
        -4688,
        656
      ],
      "credentials": {
        "homeAssistantApi": {
          "id": "7wLyOzLMuiEtEWbl",
          "name": "Home Assistant account"
        }
      }
    },
    {
      "parameters": {
        "resource": "service",
        "operation": "call",
        "domain": "={{ $('ChatGPT Custom Action Webhook').first().json.body.test_domain || 'automation' }}",
        "service": "={{ $('ChatGPT Custom Action Webhook').first().json.body.test_service || 'trigger' }}"
      },
      "id": "7cdcc153-d570-4c87-866e-c3ce567406c0",
      "name": "Test Automation",
      "type": "n8n-nodes-base.homeAssistant",
      "typeVersion": 1,
      "position": [
        -4464,
        656
      ],
      "credentials": {
        "homeAssistantApi": {
          "id": "7wLyOzLMuiEtEWbl",
          "name": "Home Assistant account"
        }
      }
    },
    {
      "parameters": {
        "options": {}
      },
      "id": "d66d60b9-6ae6-4489-9470-840b9f7c0d8a",
      "name": "Format Response for ChatGPT",
      "type": "n8n-nodes-base.set",
      "typeVersion": 3.4,
      "position": [
        -4240,
        560
      ]
    }
  ],
  "connections": {
    "ChatGPT Custom Action Webhook": {
      "main": [
        [
          {
            "node": "Route by Action",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Route by Action": {
      "main": [
        [
          {
            "node": "Get HA Entity States",
            "type": "main",
            "index": 0
          }
        ],
        [
          {
            "node": "Write Automation to File",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Get HA Entity States": {
      "main": [
        [
          {
            "node": "Format Response for ChatGPT",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Write Automation to File": {
      "main": [
        [
          {
            "node": "Reload HA Automations",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Reload HA Automations": {
      "main": [
        [
          {
            "node": "Test Automation",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Test Automation": {
      "main": [
        [
          {
            "node": "Format Response for ChatGPT",
            "type": "main",
            "index": 0
          }
        ]
      ]
    }
  },
  "settings": {
    "executionOrder": "v1",
    "callerPolicy": "workflowsFromSameOwner",
    "availableInMCP": false,
    "saveExecutionProgress": true
  },
  "staticData": null,
  "pinData": {},
  "triggerCount": 1,
  "meta": {
    "templateCredsSetupCompleted": true
  }
}

==== FILE: /Users/jeff/Downloads/10_Archive/Duplicated-Pending Deletion/Exports/infrastructure/N8N/C83ZbzV4lTlKkq8V-GPT_Home_Assistant_Delegation.json (modified: 2026-03-31 10:12:38) ====

{
  "name": "GPT → Home Assistant Delegation",
  "nodes": [
    {
      "parameters": {
        "httpMethod": "POST",
        "path": "gpt-ha-action",
        "responseMode": "lastNode",
        "options": {}
      },
      "id": "cd427b08-f00e-4d08-93b3-af8d1136f692",
      "name": "GPT Webhook",
      "type": "n8n-nodes-base.webhook",
      "typeVersion": 1,
      "position": [
        -544,
        0
      ],
      "webhookId": "0fc8402e-2b8a-4457-a598-8908493699f9"
    },
    {
      "parameters": {
        "dataType": "boolean",
        "rules": {
          "rules": [
            {}
          ]
        }
      },
      "id": "15686052-a2d3-4fd2-bdd7-ac058ca03b33",
      "name": "Action Router",
      "type": "n8n-nodes-base.switch",
      "typeVersion": 1,
      "position": [
        -224,
        0
      ]
    },
    {
      "parameters": {
        "fileName": "=/config/automations/{{$json.filename}}",
        "options": {}
      },
      "id": "2b15eb13-fb67-466f-aa01-6965d250c5eb",
      "name": "Deploy Automation File",
      "type": "n8n-nodes-base.writeBinaryFile",
      "typeVersion": 1,
      "position": [
        64,
        -160
      ]
    },
    {
      "parameters": {
        "authentication": "headerAuth",
        "url": "http://homeassistant.local:8123/api/services/automation/reload",
        "options": {},
        "headerParametersUi": {
          "parameter": [
            {
              "name": "Authorization",
              "value": "Bearer [REDACTED_PLACEHOLDER_TOKEN]"
            }
          ]
        }
      },
      "id": "80e0d459-7f18-4603-972b-b52ab45611bb",
      "name": "Reload Automations",
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 1,
      "position": [
        368,
        -160
      ],
      "credentials": {
        "httpHeaderAuth": {
          "id": "HdOyaOpSRm7zDWof",
          "name": "Servers ->HA"
        }
      }
    },
    {
      "parameters": {
        "authentication": "headerAuth",
        "url": "={{ 'http://homeassistant.local:8123/api/services/' + $json.domain + '/' + $json.service }}",
        "jsonParameters": true,
        "options": {}
      },
      "id": "cd460256-028c-457a-964c-6e1395713baa",
      "name": "HA Service Call",
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 1,
      "position": [
        64,
        0
      ],
      "credentials": {
        "httpHeaderAuth": {
          "id": "HdOyaOpSRm7zDWof",
          "name": "Servers ->HA"
        }
      }
    },
    {
      "parameters": {
        "authentication": "headerAuth",
        "url": "={{ 'http://homeassistant.local:8123/api/states/' + $json.entity_id }}",
        "options": {}
      },
      "id": "4d9ba29b-fe5f-4673-badf-4b0d922a8b64",
      "name": "HA Read State",
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 1,
      "position": [
        64,
        144
      ],
      "credentials": {
        "httpHeaderAuth": {
          "id": "HdOyaOpSRm7zDWof",
          "name": "Servers ->HA"
        }
      }
    },
    {
      "parameters": {
        "fileName": "=/config/{{$json.filename}}",
        "options": {}
      },
      "id": "feed68cb-a0a2-4278-b69d-1e3c43222558",
      "name": "Write Arbitrary File",
      "type": "n8n-nodes-base.writeBinaryFile",
      "typeVersion": 1,
      "position": [
        64,
        304
      ]
    }
  ],
  "connections": {
    "GPT Webhook": {
      "main": [
        [
          {
            "node": "Action Router",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Action Router": {
      "main": [
        [
          {
            "node": "Deploy Automation File",
            "type": "main",
            "index": 0
          }
        ],
        [
          {
            "node": "HA Service Call",
            "type": "main",
            "index": 0
          }
        ],
        [
          {
            "node": "HA Read State",
            "type": "main",
            "index": 0
          }
        ],
        [
          {
            "node": "Write Arbitrary File",
            "type": "main",
            "index": 0
          }
        ]
      ]
    }
  },
  "settings": {
    "executionOrder": "v1",
    "binaryMode": "separate",
    "availableInMCP": false
  },
  "staticData": null,
  "pinData": {},
  "triggerCount": 0,
  "meta": {
    "templateCredsSetupCompleted": true
  }
}

==== FILE: /Users/jeff/Downloads/10_Archive/Duplicated-Pending Deletion/Exports/infrastructure/N8N/DPJFWCwaGxBkPLMO-ChatGPT_to_Home_Assistant_Automation_Writer.json (modified: 2025-12-03 02:04:38) ====

{
  "name": "ChatGPT to Home Assistant Automation Writer",
  "nodes": [
    {
      "parameters": {
        "httpMethod": "POST",
        "path": "ha-automation-writer",
        "responseMode": "responseNode",
        "options": {}
      },
      "id": "3e7698d8-129f-439e-bf80-adbf465bdfa6",
      "name": "ChatGPT Custom Action Trigger",
      "type": "n8n-nodes-base.webhook",
      "typeVersion": 2.1,
      "position": [
        240,
        64
      ],
      "webhookId": "74b8a077-4d45-4799-8e26-08059c04f07b"
    },
    {
      "parameters": {
        "assignments": {
          "assignments": [
            {
              "id": "id-1",
              "name": "haBaseUrl",
              "value": "http://homeassistant.local:8123/lovelace/0",
              "type": "string"
            },
            {
              "id": "id-2",
              "name": "haToken",
              "value": "",
              "type": "string"
            }
          ]
        },
        "includeOtherFields": true,
        "options": {}
      },
      "id": "4fd15726-6571-4c46-a401-23ab305e7a56",
      "name": "Workflow Configuration",
      "type": "n8n-nodes-base.set",
      "typeVersion": 3.4,
      "position": [
        464,
        64
      ]
    },
    {
      "parameters": {
        "modelId": {
          "__rl": true,
          "mode": "id",
          "value": "gpt-4o-mini"
        },
        "responses": {
          "values": [
            {
              "content": "={{ $json.body.userRequest }}"
            }
          ]
        },
        "builtInTools": {},
        "options": {
          "instructions": "You are a Home Assistant automation expert. Your task is to generate valid Home Assistant automation YAML code based on user requests.\n\nIMPORTANT RULES:\n1. Generate ONLY valid YAML automation code\n2. Include all required fields: alias, description, trigger, condition (if needed), action\n3. Use proper Home Assistant syntax and entity IDs\n4. Return ONLY the YAML code without any markdown formatting, explanations, or extra text\n5. Do not wrap the YAML in code blocks or backticks\n6. Ensure proper indentation (2 spaces per level)\n7. Use realistic entity IDs that follow Home Assistant naming conventions\n\nExample output format:\nalias: Turn on lights at sunset\ndescription: Automatically turn on living room lights when sun sets\ntrigger:\n  - platform: sun\n    event: sunset\naction:\n  - service: light.turn_on\n    target:\n      entity_id: light.living_room"
        }
      },
      "id": "51350c5e-b252-4a21-abe8-88c712599a63",
      "name": "Generate HA Automation YAML",
      "type": "@n8n/n8n-nodes-langchain.openAi",
      "typeVersion": 2,
      "position": [
        688,
        64
      ],
      "credentials": {
        "openAiApi": {
          "id": "CMhKPlZbpTSz8VdJ",
          "name": "OpenAi account"
        }
      }
    },
    {
      "parameters": {
        "assignments": {
          "assignments": [
            {
              "id": "id-1",
              "name": "yamlContent",
              "value": "={{ $json.message.content }}",
              "type": "string"
            }
          ]
        },
        "includeOtherFields": true,
        "options": {}
      },
      "id": "4c2c0825-021c-4568-85f8-5299ca2bbfa5",
      "name": "Extract YAML Content",
      "type": "n8n-nodes-base.set",
      "typeVersion": 3.4,
      "position": [
        1040,
        64
      ]
    },
    {
      "parameters": {
        "method": "POST",
        "url": "={{ $('Workflow Configuration').first().json.haBaseUrl }}/api/config/automation/config/n8n_automation_{{ $now.toUnixInteger() }}",
        "authentication": "genericCredentialType",
        "sendHeaders": true,
        "headerParameters": {
          "parameters": [
            {
              "name": "Authorization",
              "value": "={{ 'Bearer ' + $('Workflow Configuration').first().json.haToken }}"
            },
            {
              "name": "Content-Type",
              "value": "application/json"
            }
          ]
        },
        "sendBody": true,
        "contentType": "raw",
        "rawContentType": "application/json",
        "body": "={{ JSON.stringify({ yaml: $json.yamlContent }) }}",
        "options": {}
      },
      "id": "c8e8ad72-5bf3-4eca-b69d-93439ea5ed9f",
      "name": "Write Automation to Home Assistant",
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 4.3,
      "position": [
        1264,
        64
      ]
    },
    {
      "parameters": {
        "respondWith": "json",
        "responseBody": "={{ { \"success\": true, \"message\": \"Home Assistant automation created successfully\", \"automation_id\": \"n8n_automation_\" + $now.toUnixInteger(), \"yaml\": $('Extract YAML Content').first().json.yamlContent } }}",
        "options": {}
      },
      "id": "2a91f918-7bb3-4e23-ba11-4fb5e9a17611",
      "name": "Return Success to ChatGPT",
      "type": "n8n-nodes-base.respondToWebhook",
      "typeVersion": 1.5,
      "position": [
        1488,
        64
      ]
    }
  ],
  "connections": {
    "ChatGPT Custom Action Trigger": {
      "main": [
        [
          {
            "node": "Workflow Configuration",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Workflow Configuration": {
      "main": [
        [
          {
            "node": "Generate HA Automation YAML",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Generate HA Automation YAML": {
      "main": [
        [
          {
            "node": "Extract YAML Content",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Extract YAML Content": {
      "main": [
        [
          {
            "node": "Write Automation to Home Assistant",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Write Automation to Home Assistant": {
      "main": [
        [
          {
            "node": "Return Success to ChatGPT",
            "type": "main",
            "index": 0
          }
        ]
      ]
    }
  },
  "settings": {
    "executionOrder": "v1"
  },
  "staticData": null,
  "pinData": {},
  "triggerCount": 0,
  "meta": null
}

==== FILE: /Users/jeff/Downloads/10_Archive/Duplicated-Pending Deletion/Exports/infrastructure/N8N/OKYUrkukH0KiGYqa-ChatGPT_to_Home_Assistant_Simple_Complexxxxxx.json (modified: 2025-12-23 22:39:30) ====

{
  "name": "ChatGPT to Home Assistant - Simple & Complexxxxxx",
  "nodes": [
    {
      "parameters": {
        "httpMethod": "POST",
        "path": "50d6b053-5d7a-412b-9966-9258deb09cdd",
        "responseMode": "responseNode",
        "options": {}
      },
      "id": "dfeb348a-7309-443e-a90d-29f93d7549e4",
      "name": "ChatGPT Custom Action Trigger",
      "type": "n8n-nodes-base.webhook",
      "typeVersion": 2.1,
      "position": [
        3040,
        368
      ],
      "webhookId": "50d6b053-5d7a-412b-9966-9258deb09cdd"
    },
    {
      "parameters": {
        "assignments": {
          "assignments": [
            {
              "id": "id-1",
              "name": "haBaseUrl",
              "value": "https://jlwbrp0r3ehtw3gun0evo38gh1g2jjbz.ui.nabu.casa",
              "type": "string"
            }
          ]
        },
        "includeOtherFields": true,
        "options": {}
      },
      "id": "de10cdd8-15ca-4454-aeb7-d65ac1f446a3",
      "name": "Workflow Configuration",
      "type": "n8n-nodes-base.set",
      "typeVersion": 3.4,
      "position": [
        3264,
        272
      ]
    },
    {
      "parameters": {
        "modelId": {
          "__rl": true,
          "mode": "id",
          "value": "gpt-4o-mini"
        },
        "responses": {
          "values": [
            {
              "content": "={{ $json.body.userRequest }}"
            }
          ]
        },
        "builtInTools": {},
        "options": {
          "instructions": "You are a Home Assistant automation expert. Your task is to generate valid Home Assistant automation YAML code based on user requests.\n\nIMPORTANT RULES:\n1. Generate ONLY valid YAML automation code\n2. Include all required fields: alias, description, trigger, condition (if needed), action\n3. Use proper Home Assistant syntax and entity IDs\n4. Return ONLY the YAML code without any markdown formatting, explanations, or extra text\n5. Do not wrap the YAML in code blocks or backticks\n6. Ensure proper indentation (2 spaces per level)\n7. Use realistic entity IDs that follow Home Assistant naming conventions\n\nExample output format:\nalias: Turn on lights at sunset\ndescription: Automatically turn on living room lights when sun sets\ntrigger:\n  - platform: sun\n    event: sunset\naction:\n  - service: light.turn_on\n    target:\n      entity_id: light.living_room"
        }
      },
      "id": "247d1d3f-352b-4961-9956-ac5e32aeefde",
      "name": "Generate HA Automation YAML",
      "type": "@n8n/n8n-nodes-langchain.openAi",
      "typeVersion": 2,
      "position": [
        3488,
        272
      ],
      "credentials": {
        "openAiApi": {
          "id": "CMhKPlZbpTSz8VdJ",
          "name": "OpenAi account"
        }
      }
    },
    {
      "parameters": {
        "assignments": {
          "assignments": [
            {
              "id": "id-1",
              "name": "yamlContent",
              "value": "={{ $json.message.content }}",
              "type": "string"
            }
          ]
        },
        "includeOtherFields": true,
        "options": {}
      },
      "id": "ab271c43-dad4-46e7-b459-126265de8e20",
      "name": "Extract YAML Content",
      "type": "n8n-nodes-base.set",
      "typeVersion": 3.4,
      "position": [
        3840,
        272
      ]
    },
    {
      "parameters": {
        "method": "POST",
        "url": "={{ $('Workflow Configuration').first().json.haBaseUrl }}/api/services/shell_command/write_automation",
        "authentication": "genericCredentialType",
        "genericAuthType": "httpBearerAuth",
        "sendHeaders": true,
        "headerParameters": {
          "parameters": [
            {
              "name": "Content-Type",
              "value": "application/json"
            }
          ]
        },
        "sendBody": true,
        "contentType": "raw",
        "rawContentType": "application/json",
        "body": "={{ JSON.stringify({ file_name: \"n8n_automation_\" + $now.toUnixInteger() + \".yaml\", automation_yaml: $json.yamlContent }) }}",
        "options": {}
      },
      "id": "acc6a4c6-46c1-4d32-b893-fd019e2e972d",
      "name": "Write Automation to Home Assistant",
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 4.3,
      "position": [
        4064,
        272
      ],
      "credentials": {
        "httpBearerAuth": {
          "id": "txjUG2OPyNBLA3QG",
          "name": "HAxN8N"
        },
        "homeAssistantApi": {
          "id": "7qaIGmmKngYnKYIG",
          "name": "Home Assistant account"
        },
        "httpHeaderAuth": {
          "id": "qPYW48A8AsuQ8rqd",
          "name": "Header Auth account"
        }
      }
    },
    {
      "parameters": {
        "respondWith": "json",
        "responseBody": "={{ { \"success\": true, \"message\": \"Home Assistant automation created successfully\", \"automation_id\": \"n8n_automation_\" + $now.toUnixInteger(), \"yaml\": $('Extract YAML Content').first().json.yamlContent } }}",
        "options": {}
      },
      "id": "e6a2421d-0fe3-41eb-ba1e-ba0983a8ff97",
      "name": "Return Success to ChatGPT",
      "type": "n8n-nodes-base.respondToWebhook",
      "typeVersion": 1.5,
      "position": [
        4288,
        272
      ]
    },
    {
      "parameters": {},
      "id": "80f9dc67-da4f-4c27-88e6-5e08b4c4e561",
      "name": "Test Trigger",
      "type": "n8n-nodes-base.manualTrigger",
      "typeVersion": 1,
      "position": [
        2816,
        176
      ]
    },
    {
      "parameters": {
        "assignments": {
          "assignments": [
            {
              "id": "id-1",
              "name": "body",
              "value": "{ \"userRequest\": \"turn on the living room lights at sunset\" }",
              "type": "object"
            }
          ]
        },
        "options": {}
      },
      "id": "a58bd3d6-a607-4cd6-abc5-6e1dfdeb56ee",
      "name": "Test Data",
      "type": "n8n-nodes-base.set",
      "typeVersion": 3.4,
      "position": [
        3040,
        176
      ]
    }
  ],
  "connections": {
    "ChatGPT Custom Action Trigger": {
      "main": [
        [
          {
            "node": "Workflow Configuration",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Workflow Configuration": {
      "main": [
        [
          {
            "node": "Generate HA Automation YAML",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Generate HA Automation YAML": {
      "main": [
        [
          {
            "node": "Extract YAML Content",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Extract YAML Content": {
      "main": [
        [
          {
            "node": "Write Automation to Home Assistant",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Write Automation to Home Assistant": {
      "main": [
        [
          {
            "node": "Return Success to ChatGPT",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Test Trigger": {
      "main": [
        [
          {
            "node": "Test Data",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Test Data": {
      "main": [
        [
          {
            "node": "Workflow Configuration",
            "type": "main",
            "index": 0
          }
        ]
      ]
    }
  },
  "settings": {
    "executionOrder": "v1"
  },
  "staticData": null,
  "pinData": {},
  "triggerCount": 1,
  "meta": null
}

==== FILE: /Users/jeff/Downloads/10_Archive/Duplicated-Pending Deletion/Exports/infrastructure/N8N/PvMHGMz1vaZJgj54-ChatGPT_to_Home_Assistant_Automation_Writer_copy_orchestrate.json (modified: 2025-12-23 22:39:30) ====

{
  "name": "ChatGPT to Home Assistant Automation Writer copy - orchestrate",
  "nodes": [
    {
      "parameters": {
        "httpMethod": "POST",
        "path": "c5b27463-cf33-4c55-8440-b9038296b063",
        "responseMode": "responseNode",
        "options": {}
      },
      "id": "9f0e0dc6-d705-4320-9d5c-2b29fe3f8f11",
      "name": "ChatGPT Custom Action Trigger",
      "type": "n8n-nodes-base.webhook",
      "typeVersion": 2.1,
      "position": [
        3040,
        368
      ],
      "webhookId": "c5b27463-cf33-4c55-8440-b9038296b063"
    },
    {
      "parameters": {
        "assignments": {
          "assignments": [
            {
              "id": "id-1",
              "name": "haBaseUrl",
              "value": "https://jlwbrp0r3ehtw3gun0evo38gh1g2jjbz.ui.nabu.casa",
              "type": "string"
            }
          ]
        },
        "includeOtherFields": true,
        "options": {}
      },
      "id": "52378cd4-1f57-421a-a8c7-21548ae51b3c",
      "name": "Workflow Configuration",
      "type": "n8n-nodes-base.set",
      "typeVersion": 3.4,
      "position": [
        3264,
        272
      ]
    },
    {
      "parameters": {
        "modelId": {
          "__rl": true,
          "mode": "id",
          "value": "gpt-4o-mini"
        },
        "responses": {
          "values": [
            {
              "content": "={{ $json.body.userRequest }}"
            }
          ]
        },
        "builtInTools": {},
        "options": {
          "instructions": "You are a Home Assistant automation expert. Your task is to generate valid Home Assistant automation YAML code based on user requests.\n\nIMPORTANT RULES:\n1. Generate ONLY valid YAML automation code\n2. Include all required fields: alias, description, trigger, condition (if needed), action\n3. Use proper Home Assistant syntax and entity IDs\n4. Return ONLY the YAML code without any markdown formatting, explanations, or extra text\n5. Do not wrap the YAML in code blocks or backticks\n6. Ensure proper indentation (2 spaces per level)\n7. Use realistic entity IDs that follow Home Assistant naming conventions\n\nExample output format:\nalias: Turn on lights at sunset\ndescription: Automatically turn on living room lights when sun sets\ntrigger:\n  - platform: sun\n    event: sunset\naction:\n  - service: light.turn_on\n    target:\n      entity_id: light.living_room"
        }
      },
      "id": "7cf23ff4-e7ae-4c5e-948c-d2bbbf3edfa3",
      "name": "Generate HA Automation YAML",
      "type": "@n8n/n8n-nodes-langchain.openAi",
      "typeVersion": 2,
      "position": [
        3488,
        272
      ],
      "credentials": {
        "openAiApi": {
          "id": "CMhKPlZbpTSz8VdJ",
          "name": "OpenAi account"
        }
      }
    },
    {
      "parameters": {
        "assignments": {
          "assignments": [
            {
              "id": "id-1",
              "name": "yamlContent",
              "value": "={{ $json.message.content }}",
              "type": "string"
            }
          ]
        },
        "includeOtherFields": true,
        "options": {}
      },
      "id": "011b57f1-7ccf-4d6b-b295-87af0dc64d93",
      "name": "Extract YAML Content",
      "type": "n8n-nodes-base.set",
      "typeVersion": 3.4,
      "position": [
        3840,
        272
      ]
    },
    {
      "parameters": {
        "method": "POST",
        "url": "={{ $('Workflow Configuration').first().json.haBaseUrl }}/api/services/shell_command/write_automation",
        "authentication": "genericCredentialType",
        "genericAuthType": "httpBearerAuth",
        "sendHeaders": true,
        "headerParameters": {
          "parameters": [
            {
              "name": "Content-Type",
              "value": "application/json"
            }
          ]
        },
        "sendBody": true,
        "contentType": "raw",
        "rawContentType": "application/json",
        "body": "={{ JSON.stringify({ file_name: \"n8n_automation_\" + $now.toUnixInteger() + \".yaml\", automation_yaml: $json.yamlContent }) }}",
        "options": {}
      },
      "id": "23e754d5-cf9e-4dc9-826c-1bad8c0139c2",
      "name": "Write Automation to Home Assistant",
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 4.3,
      "position": [
        4064,
        272
      ],
      "credentials": {
        "httpBearerAuth": {
          "id": "txjUG2OPyNBLA3QG",
          "name": "HAxN8N"
        },
        "homeAssistantApi": {
          "id": "7qaIGmmKngYnKYIG",
          "name": "Home Assistant account"
        },
        "httpHeaderAuth": {
          "id": "qPYW48A8AsuQ8rqd",
          "name": "Header Auth account"
        }
      }
    },
    {
      "parameters": {
        "respondWith": "json",
        "responseBody": "={{ { \"success\": true, \"message\": \"Home Assistant automation created successfully\", \"automation_id\": \"n8n_automation_\" + $now.toUnixInteger(), \"yaml\": $('Extract YAML Content').first().json.yamlContent } }}",
        "options": {}
      },
      "id": "184d915a-4fb8-4107-aaad-26bc628ac6fc",
      "name": "Return Success to ChatGPT",
      "type": "n8n-nodes-base.respondToWebhook",
      "typeVersion": 1.5,
      "position": [
        4288,
        272
      ]
    },
    {
      "parameters": {},
      "id": "fa9ac8e5-ae50-4919-aee4-8c5d817ceabf",
      "name": "Test Trigger",
      "type": "n8n-nodes-base.manualTrigger",
      "typeVersion": 1,
      "position": [
        2816,
        176
      ]
    },
    {
      "parameters": {
        "assignments": {
          "assignments": [
            {
              "id": "id-1",
              "name": "body",
              "value": "{ \"userRequest\": \"turn on the living room lights at sunset\" }",
              "type": "object"
            }
          ]
        },
        "options": {}
      },
      "id": "d2936f0e-b540-47c7-9781-32e6f819c6c8",
      "name": "Test Data",
      "type": "n8n-nodes-base.set",
      "typeVersion": 3.4,
      "position": [
        3040,
        176
      ]
    }
  ],
  "connections": {
    "ChatGPT Custom Action Trigger": {
      "main": [
        [
          {
            "node": "Workflow Configuration",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Workflow Configuration": {
      "main": [
        [
          {
            "node": "Generate HA Automation YAML",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Generate HA Automation YAML": {
      "main": [
        [
          {
            "node": "Extract YAML Content",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Extract YAML Content": {
      "main": [
        [
          {
            "node": "Write Automation to Home Assistant",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Write Automation to Home Assistant": {
      "main": [
        [
          {
            "node": "Return Success to ChatGPT",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Test Trigger": {
      "main": [
        [
          {
            "node": "Test Data",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Test Data": {
      "main": [
        [
          {
            "node": "Workflow Configuration",
            "type": "main",
            "index": 0
          }
        ]
      ]
    }
  },
  "settings": {
    "executionOrder": "v1"
  },
  "staticData": null,
  "pinData": {},
  "triggerCount": 1,
  "meta": null
}

==== FILE: /Users/jeff/Downloads/10_Archive/Duplicated-Pending Deletion/Exports/infrastructure/N8N/aMSk5YI4j1zJg4qy-ChatGPT_to_Home_Assistant_Automation_Writer_Dec_2_at_23_38_37_.json (modified: 2025-12-23 22:39:30) ====

{
  "name": "ChatGPT to Home Assistant Automation Writer (Dec 2 at 23:38:37)",
  "nodes": [
    {
      "parameters": {
        "httpMethod": "POST",
        "path": "ha-automation-writer",
        "authentication": "headerAuth",
        "responseMode": "responseNode",
        "options": {}
      },
      "id": "3e7698d8-129f-439e-bf80-adbf465bdfa6",
      "name": "ChatGPT Custom Action Trigger",
      "type": "n8n-nodes-base.webhook",
      "typeVersion": 2.1,
      "position": [
        2816,
        368
      ],
      "webhookId": "74b8a077-4d45-4799-8e26-08059c04f07b",
      "credentials": {
        "httpHeaderAuth": {
          "id": "OBEOGOR2yeIDU8PT",
          "name": "N8n API"
        }
      }
    },
    {
      "parameters": {
        "assignments": {
          "assignments": [
            {
              "id": "id-1",
              "name": "haBaseUrl",
              "value": "https://jlwbrp0r3ehtw3gun0evo38gh1g2jjbz.ui.nabu.casa",
              "type": "string"
            }
          ]
        },
        "includeOtherFields": true,
        "options": {}
      },
      "id": "4fd15726-6571-4c46-a401-23ab305e7a56",
      "name": "Workflow Configuration",
      "type": "n8n-nodes-base.set",
      "typeVersion": 3.4,
      "position": [
        3264,
        272
      ]
    },
    {
      "parameters": {
        "modelId": {
          "__rl": true,
          "value": "gpt-4.1",
          "mode": "list",
          "cachedResultName": "GPT-4.1"
        },
        "responses": {
          "values": [
            {
              "role": "system",
              "content": "You are a Home Assistant automation expert. Your task is to generate valid Home Assistant automation YAML code based on user requests.\n\nEXAMPLE:\n\nautomation:\n  - id: unique_id_here\n    alias: Some nice name\n    mode: single\n    trigger:\n      - platform: state\n        entity_id: ...\n        to: \"on\"\n    condition: []\n    action:\n      - service: light.turn_on\n        target:\n          entity_id: light.xyz\n"
            },
            {
              "content": "={{ $json.body }}"
            }
          ]
        },
        "simplify": "=automation:\n  - id: unique_id_here\n    alias: Some nice name\n    mode: single\n    trigger:\n      - platform: state\n        entity_id: ...\n        to: \"on\"\n    condition: []\n    action:\n      - service: light.turn_on\n        target:\n          entity_id: light.xyz\n",
        "builtInTools": {
          "codeInterpreter": false
        },
        "options": {
          "instructions": ""
        }
      },
      "id": "51350c5e-b252-4a21-abe8-88c712599a63",
      "name": "Generate HA Automation YAML",
      "type": "@n8n/n8n-nodes-langchain.openAi",
      "typeVersion": 2,
      "position": [
        3488,
        272
      ],
      "credentials": {
        "openAiApi": {
          "id": "CMhKPlZbpTSz8VdJ",
          "name": "OpenAi account GPT Project"
        }
      }
    },
    {
      "parameters": {
        "assignments": {
          "assignments": [
            {
              "id": "b5de0e2a-c23e-46cc-9283-0b1df67ea4a0",
              "name": "yamlContent",
              "value": "={{ $json.output[0].content[0].text }}",
              "type": "string"
            }
          ]
        },
        "includeOtherFields": true,
        "options": {}
      },
      "id": "4c2c0825-021c-4568-85f8-5299ca2bbfa5",
      "name": "Extract YAML Content",
      "type": "n8n-nodes-base.set",
      "typeVersion": 3.4,
      "position": [
        3840,
        272
      ]
    },
    {
      "parameters": {},
      "id": "b80cb257-a084-4bb1-9c8e-f7b176708fd2",
      "name": "Test Trigger",
      "type": "n8n-nodes-base.manualTrigger",
      "typeVersion": 1,
      "position": [
        2816,
        176
      ]
    },
    {
      "parameters": {
        "assignments": {
          "assignments": [
            {
              "id": "id-1",
              "name": "body",
              "value": "{   \"userRequest\": {     \"file_name\": \"living_room_lights_on_sunset.yaml\",     \"automation_yaml\": \"alias: \\\"Turn on Living Room Lights at Sunset\\\"\\ntrigger:\\n  - platform: sun\\n    event: sunset\\naction:\\n  - service: light.turn_on\\n    target:\\n      entity_id: light.living_room\\nmode: single\\nid: living_room_lights_on_sunset\"   } }",
              "type": "string"
            }
          ]
        },
        "options": {}
      },
      "id": "40cb7e45-b556-43b1-9460-6420d6e86ebf",
      "name": "Test Data",
      "type": "n8n-nodes-base.set",
      "typeVersion": 3.4,
      "position": [
        3040,
        176
      ]
    },
    {
      "parameters": {
        "method": "POST",
        "url": "={{ $('Workflow Configuration').first().json.haBaseUrl }}/api/services/script/write_automation_and_reload",
        "authentication": "genericCredentialType",
        "genericAuthType": "httpBearerAuth",
        "sendHeaders": true,
        "headerParameters": {
          "parameters": [
            {
              "name": "Content-Type",
              "value": "application/json"
            }
          ]
        },
        "sendBody": true,
        "contentType": "raw",
        "rawContentType": "application/json",
        "body": "={{ JSON.stringify({ file_name: \"n8n_automation_\" + $now.toUnixInteger() + \".yaml\", automation_yaml: $json.yamlContent }) }}",
        "options": {}
      },
      "id": "bfecefb3-772b-498c-a4ae-bbe9a99f242e",
      "name": "Write Automation to Home Assistant1",
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 4.3,
      "position": [
        4064,
        272
      ],
      "credentials": {
        "httpBearerAuth": {
          "id": "txjUG2OPyNBLA3QG",
          "name": "HAxN8N"
        },
        "homeAssistantApi": {
          "id": "7qaIGmmKngYnKYIG",
          "name": "Home Assistant account"
        },
        "httpHeaderAuth": {
          "id": "qPYW48A8AsuQ8rqd",
          "name": "Header Auth account"
        }
      }
    }
  ],
  "connections": {
    "ChatGPT Custom Action Trigger": {
      "main": [
        [
          {
            "node": "Workflow Configuration",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Workflow Configuration": {
      "main": [
        [
          {
            "node": "Generate HA Automation YAML",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Generate HA Automation YAML": {
      "main": [
        [
          {
            "node": "Extract YAML Content",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Extract YAML Content": {
      "main": [
        [
          {
            "node": "Write Automation to Home Assistant1",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Test Trigger": {
      "main": [
        [
          {
            "node": "Test Data",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Test Data": {
      "main": [
        [
          {
            "node": "Workflow Configuration",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Write Automation to Home Assistant1": {
      "main": [
        []
      ]
    }
  },
  "settings": {
    "saveDataErrorExecution": "all",
    "saveDataSuccessExecution": "all",
    "saveExecutionProgress": true,
    "saveManualExecutions": true,
    "callerPolicy": "any",
    "executionOrder": "v1",
    "availableInMCP": false
  },
  "staticData": null,
  "pinData": {
    "Test Trigger": [
      {
        "json": {}
      }
    ]
  },
  "triggerCount": 1,
  "meta": {
    "templateCredsSetupCompleted": true
  }
}

==== FILE: /Users/jeff/Downloads/10_Archive/Duplicated-Pending Deletion/Exports/infrastructure/N8N/qiV3v049cD9wqjTl-N8N_HA_ChatGPT_to_Home_Assistant_Automation_Writer_with_Feedback_Loop.json (modified: 2025-12-03 02:04:38) ====

{
  "name": "N8N HA-ChatGPT to Home Assistant Automation Writer with Feedback Loop",
  "nodes": [
    {
      "parameters": {
        "httpMethod": "POST",
        "path": "ha-automation-writer",
        "responseMode": "responseNode",
        "options": {}
      },
      "id": "4d3636f3-7984-4c9b-8460-d28c56585970",
      "name": "ChatGPT Custom Action Webhook",
      "type": "n8n-nodes-base.webhook",
      "typeVersion": 2.1,
      "position": [
        -1472,
        688
      ],
      "webhookId": "4c5e9294-065e-4ce4-8da7-e949fbef8f08",
      "onError": "continueRegularOutput"
    },
    {
      "parameters": {
        "assignments": {
          "assignments": [
            {
              "id": "id-1",
              "name": "haBaseUrl",
              "value": "http://homeassistant.local:8123",
              "type": "string"
            },
            {
              "id": "id-2",
              "name": "automationsFilePath",
              "value": "/config/automations.yaml",
              "type": "string"
            }
          ]
        },
        "includeOtherFields": true,
        "options": {}
      },
      "id": "40819542-2d71-428d-9a53-132c90acd52a",
      "name": "Workflow Configuration",
      "type": "n8n-nodes-base.set",
      "typeVersion": 3.4,
      "position": [
        -1248,
        688
      ]
    },
    {
      "parameters": {
        "resource": "state",
        "operation": "getAll",
        "returnAll": true
      },
      "id": "38f48643-dd8b-4eb1-96d5-c71b2f73b131",
      "name": "Get HA Entity States",
      "type": "n8n-nodes-base.homeAssistant",
      "typeVersion": 1,
      "position": [
        -128,
        608
      ],
      "credentials": {
        "homeAssistantApi": {
          "id": "7wLyOzLMuiEtEWbl",
          "name": "Home Assistant account"
        }
      }
    },
    {
      "parameters": {
        "resource": "service",
        "operation": "call",
        "domain": "automation",
        "service": "reload"
      },
      "id": "a7fb0886-2d21-46cf-a386-73aa211be738",
      "name": "Reload HA Automations",
      "type": "n8n-nodes-base.homeAssistant",
      "typeVersion": 1,
      "position": [
        -352,
        416
      ],
      "credentials": {
        "homeAssistantApi": {
          "id": "7wLyOzLMuiEtEWbl",
          "name": "Home Assistant account"
        }
      }
    },
    {
      "parameters": {
        "resource": "service",
        "operation": "call",
        "domain": "={{ $('ChatGPT Custom Action Webhook').first().json.body.test_domain || 'automation' }}",
        "service": "={{ $('ChatGPT Custom Action Webhook').first().json.body.test_service || 'trigger' }}"
      },
      "id": "aa668618-3c4c-4042-9add-4eac975ff33b",
      "name": "Test Automation",
      "type": "n8n-nodes-base.homeAssistant",
      "typeVersion": 1,
      "position": [
        -128,
        416
      ],
      "credentials": {
        "homeAssistantApi": {
          "id": "7wLyOzLMuiEtEWbl",
          "name": "Home Assistant account"
        }
      }
    },
    {
      "parameters": {
        "assignments": {
          "assignments": [
            {
              "id": "id-1",
              "name": "success",
              "value": true,
              "type": "boolean"
            },
            {
              "id": "id-2",
              "name": "message",
              "value": "={{ $json.message || 'Operation completed successfully' }}",
              "type": "string"
            },
            {
              "id": "id-3",
              "name": "data",
              "value": "={{ JSON.stringify($json) }}",
              "type": "object"
            }
          ]
        },
        "options": {}
      },
      "id": "797fe9db-e9fa-427e-abd8-b8bb090266c3",
      "name": "Format Response for ChatGPT",
      "type": "n8n-nodes-base.set",
      "typeVersion": 3.4,
      "position": [
        96,
        608
      ]
    },
    {
      "parameters": {
        "enableResponseOutput": true,
        "respondWith": "json",
        "responseBody": "={{ $json }}",
        "options": {}
      },
      "id": "d39cdb9b-83ed-4d12-b36c-c3ee91638deb",
      "name": "Send Response to ChatGPT",
      "type": "n8n-nodes-base.respondToWebhook",
      "typeVersion": 1.5,
      "position": [
        320,
        784
      ]
    },
    {
      "parameters": {
        "rules": {
          "values": [
            {
              "conditions": {
                "options": {
                  "caseSensitive": true,
                  "leftValue": "",
                  "typeValidation": "strict",
                  "version": 2
                },
                "conditions": [
                  {
                    "leftValue": "={{ $json.body.action }}",
                    "rightValue": "get_all_entities",
                    "operator": {
                      "type": "string",
                      "operation": "equals"
                    },
                    "id": "1d900987-d486-4823-9a09-ec021ddf944b"
                  }
                ],
                "combinator": "and"
              },
              "renameOutput": true,
              "outputKey": "Get All Entities"
            },
            {
              "conditions": {
                "options": {
                  "caseSensitive": true,
                  "leftValue": "",
                  "typeValidation": "strict",
                  "version": 2
                },
                "conditions": [
                  {
                    "leftValue": "={{ $json.body.action }}",
                    "rightValue": "get_entity",
                    "operator": {
                      "type": "string",
                      "operation": "equals"
                    },
                    "id": "c0bc557c-1a84-4c27-9b7c-062e2923d83b"
                  }
                ],
                "combinator": "and"
              },
              "renameOutput": true,
              "outputKey": "Get Single Entity"
            },
            {
              "conditions": {
                "options": {
                  "caseSensitive": true,
                  "leftValue": "",
                  "typeValidation": "strict",
                  "version": 2
                },
                "conditions": [
                  {
                    "leftValue": "={{ $json.body.action }}",
                    "rightValue": "write_automation",
                    "operator": {
                      "type": "string",
                      "operation": "equals"
                    },
                    "id": "f58a9308-ec4a-4d51-b255-4f9906b8f50c"
                  }
                ],
                "combinator": "and"
              },
              "renameOutput": true,
              "outputKey": "Write Automation"
            }
          ]
        },
        "options": {
          "fallbackOutput": "extra",
          "renameFallbackOutput": "Invalid Action"
        }
      },
      "id": "642b2136-2572-4207-8007-8995e3607329",
      "name": "Route by Action",
      "type": "n8n-nodes-base.switch",
      "typeVersion": 3.3,
      "position": [
        -1024,
        656
      ]
    },
    {
      "parameters": {
        "assignments": {
          "assignments": [
            {
              "id": "id-1",
              "name": "success",
              "value": false,
              "type": "boolean"
            },
            {
              "id": "id-2",
              "name": "error",
              "value": "Invalid action. Supported actions: get_all_entities, get_entity, write_automation",
              "type": "string"
            },
            {
              "id": "id-3",
              "name": "received_action",
              "value": "={{ $json.body.action }}",
              "type": "string"
            }
          ]
        },
        "options": {}
      },
      "id": "4eaa9ad1-2866-4701-a5e6-4e40353a12e8",
      "name": "Format Error Response",
      "type": "n8n-nodes-base.set",
      "typeVersion": 3.4,
      "position": [
        96,
        944
      ]
    },
    {
      "parameters": {
        "resource": "state",
        "entityId": "={{ $json.body.entity_id }}"
      },
      "id": "15006bab-39dc-47a8-9121-364dc434bac7",
      "name": "Get Single Entity State",
      "type": "n8n-nodes-base.homeAssistant",
      "typeVersion": 1,
      "position": [
        -128,
        800
      ],
      "credentials": {
        "homeAssistantApi": {
          "id": "7wLyOzLMuiEtEWbl",
          "name": "Home Assistant account"
        }
      }
    },
    {
      "parameters": {
        "operation": "write",
        "options": {}
      },
      "id": "bb399f36-c17c-49e6-a1ea-5024c9db76bb",
      "name": "Read Automations File",
      "type": "n8n-nodes-base.readWriteFile",
      "typeVersion": 1,
      "position": [
        -800,
        416
      ]
    },
    {
      "parameters": {
        "options": {}
      },
      "id": "c6f3ce8f-1ee3-4836-8593-575afb441ec9",
      "name": "Write Automation to File",
      "type": "n8n-nodes-base.readWriteFile",
      "typeVersion": 1,
      "position": [
        -576,
        416
      ]
    }
  ],
  "connections": {
    "ChatGPT Custom Action Webhook": {
      "main": [
        [
          {
            "node": "Workflow Configuration",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Workflow Configuration": {
      "main": [
        [
          {
            "node": "Route by Action",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Route by Action": {
      "main": [
        [
          {
            "node": "Get HA Entity States",
            "type": "main",
            "index": 0
          }
        ],
        [
          {
            "node": "Read Automations File",
            "type": "main",
            "index": 0
          },
          {
            "node": "Get Single Entity State",
            "type": "main",
            "index": 0
          }
        ],
        [
          {
            "node": "Read Automations File",
            "type": "main",
            "index": 0
          }
        ],
        [
          {
            "node": "Format Error Response",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Get HA Entity States": {
      "main": [
        [
          {
            "node": "Format Response for ChatGPT",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Read Automations File": {
      "main": [
        [
          {
            "node": "Write Automation to File",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Write Automation to File": {
      "main": [
        [
          {
            "node": "Reload HA Automations",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Reload HA Automations": {
      "main": [
        [
          {
            "node": "Test Automation",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Test Automation": {
      "main": [
        [
          {
            "node": "Format Response for ChatGPT",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Format Response for ChatGPT": {
      "main": [
        [
          {
            "node": "Send Response to ChatGPT",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Get Single Entity State": {
      "main": [
        [
          {
            "node": "Format Response for ChatGPT",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Format Error Response": {
      "main": [
        [
          {
            "node": "Send Response to ChatGPT",
            "type": "main",
            "index": 0
          }
        ]
      ]
    }
  },
  "settings": {
    "executionOrder": "v1",
    "callerPolicy": "workflowsFromSameOwner",
    "availableInMCP": false
  },
  "staticData": null,
  "pinData": {},
  "triggerCount": 1,
  "meta": {
    "templateCredsSetupCompleted": true
  }
}

==== FILE: /Users/jeff/Downloads/10_Archive/Duplicated-Pending Deletion/Exports/sources/markdown/06_Knowledge/homeassistant/helpers.yaml (modified: 2026-05-18 19:19:33) ====

sensor:
  - platform: systemmonitor
    resources:
      - type: memory_use_percent
      - type: processor_use
      - type: disk_use_percent
      - type: last_boot

  - platform: file
    name: HA Database Size
    file_path: /config/home-assistant_v2.db
    value_template: "{{ (value | float(0) / 1048576) | round(1) }}"  # Convert bytes→MB
    unit_of_measurement: "MB"
    
############################################################
# INPUT BOOLEANS — Contextual States
############################################################
input_boolean:
  override_mode:
    name: Override Mode
    icon: mdi:tune-variant

  sleep_mode:
    name: Sleep Mode
    icon: mdi:sleep

  away_mode:
    name: Away Mode
    icon: mdi:exit-run

  guest_mode:
    name: Guest Mode
    icon: mdi:account-heart

  focus_mode:
    name: Focus Mode
    icon: mdi:target-variant

  recovery_mode:
    name: Recovery Mode
    icon: mdi:heart-pulse

  hydration_nags_enabled:
    name: Hydration Nags Enabled
    icon: mdi:cup-water

############################################################
# INPUT SELECT — Environmental Energy State
############################################################
input_select:
  energy_state:
    name: Energy State
    options:
      - enter
      - active
      - focus
      - ease
      - rest
    icon: mdi:pulse

############################################################
# INPUT NUMBER — Motion Timeout Default
############################################################
input_number:
  motion_timeout_default:
    name: Motion Timeout Default
    min: 0
    max: 60
    step: 1
    unit_of_measurement: minutes
    icon: mdi:timer

############################################################
# BINARY SENSORS — Derived Contextual Sensors
############################################################
binary_sensor:
  quiet_hours:
    name: Quiet Hours
    device_class: running
  anyone_home:
    name: Anyone Home
    device_class: occupancy
  is_daylight:
    name: Is Daylight
    device_class: light

==== FILE: /Users/jeff/Downloads/10_Archive/Duplicated-Pending Deletion/Exports/sources/notion/conversation home_assistant 16cd3aaecdca42639535bef4ee570b71.md (modified: 2025-11-19 14:21:22) ====

# conversation.home_assistant

Description: Home Assistant conversation status
Domain: Conversations
Type/Purpose: System interaction

==== FILE: /Users/jeff/Downloads/10_Archive/Duplicated-Pending Deletion/Exports/sources/notion/home_assistant_system_README.md (modified: 2025-11-11 02:41:27) ====

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


==== FILE: /Users/jeff/Downloads/10_Archive/Duplicated-Pending Deletion/Exports/sources/notion/tts home_assistant_cloud 55241a864a564b70b71eed69a6a68010.md (modified: 2025-11-19 14:21:22) ====

# tts.home_assistant_cloud

Description: Home Assistant Cloud TTS
Domain: TTS
Type/Purpose: Audio output

==== FILE: /Users/jeff/Downloads/10_Archive/Duplicated-Pending Deletion/Exports/sources/notion/update home_assistant_core_update 0940ca15d43c408b85a99857fbd8fd1c.md (modified: 2025-11-19 14:21:22) ====

# update.home_assistant_core_update

Description: Core update available
Domain: Updates
Type/Purpose: System update

==== FILE: /Users/jeff/Downloads/10_Archive/Duplicated-Pending Deletion/Exports/sources/notion/update home_assistant_operating_system_update b8e72b75d5ba4824ac0484f36f2df5dd.md (modified: 2025-11-19 14:21:22) ====

# update.home_assistant_operating_system_update

Description: OS update available
Domain: Updates
Type/Purpose: System update

==== FILE: /Users/jeff/Downloads/10_Archive/Duplicated-Pending Deletion/Exports/sources/notion/update home_assistant_supervisor_update 0beb8fc86b37455fb25377705db25b9e.md (modified: 2025-11-19 14:21:22) ====

# update.home_assistant_supervisor_update

Description: Supervisor update available
Domain: Updates
Type/Purpose: System update

==== FILE: /Users/jeff/Downloads/10_Archive/Duplicated-Pending Deletion/shared/services/homeassistant/README.md (modified: 2026-05-19 16:16:06) ====

# Home Assistant

Operational wrapper for the Home Assistant stack at `/srv/homeassistant`.

## Status

Active.

Observed running containers:

- `homeassistantz`
- `matter-server`
- `nodered`

Related active container:

- `mosquitto` is active but its Compose/source root is unresolved, so it has its
  own wrapper at `services/mosquitto`.

## Runtime Root

```text
/srv/homeassistant
```

Observed Compose file:

```text
/srv/homeassistant/docker-compose.yml
```

## Ownership

Home Assistant owns:

- `/srv/homeassistant/config`
- HA area/device/entity/integration registries
- HA automation/script/scene YAML files
- HA runtime database and `.storage` files
- HA Cloud/Nabu Casa configuration

This repo stores exported registry snapshots only. It does not own HA runtime
state.

## Exports

Current exported snapshots:

- `exports/areas.json`
- `exports/devices.json`
- `exports/entities.json`
- `exports/integrations.json`

Generate with:

```bash
../../scripts/export-ha-state.sh
```

## Validation

- Docker container `homeassistantz` should be up.
- Docker container `matter-server` should be up.
- Docker container `nodered` should be up and healthy.
- HA UI/API checks require credentials and are not part of the generic status script.

## Known Gaps

- HA naming/area cleanup is not complete.
- Node-RED flow contents are not exported here yet.
- Historical docs sometimes say container `homeassistant`; actual container is
  `homeassistantz`.


==== FILE: /Users/jeff/Downloads/10_Archive/Duplicated-Pending Deletion/shared/services/homeassistant/backup.md (modified: 2026-05-19 16:16:07) ====

# Home Assistant Backup

Home Assistant backup handling must be HA-aware.

## Runtime Data

Important runtime paths include:

- `/srv/homeassistant/config`
- `/srv/homeassistant/config/.storage`
- `/srv/homeassistant/config/home-assistant_v2.db*`
- `/srv/homeassistant/config/secrets.yaml`
- `/srv/homeassistant/config/automations.yaml`
- `/srv/homeassistant/config/scenes.yaml`
- `/srv/homeassistant/config/scripts.yaml`

These are not tracked in this repo.

## Repo Exports

This repo tracks registry exports only:

- `exports/areas.json`
- `exports/devices.json`
- `exports/entities.json`
- `exports/integrations.json`

These help with audits and naming work. They are not a complete HA backup.

## Before HA Changes

Before editing HA config or applying naming/entity changes:

1. Capture a Home Assistant backup or copy the specific target files.
2. Export current registries with `scripts/export-ha-state.sh`.
3. Record the change in `CHANGE_LEDGER.md`.
4. Validate HA starts and the affected entity/area state remains coherent.


==== FILE: /Users/jeff/Downloads/10_Archive/Duplicated-Pending Deletion/shared/services/homeassistant/compose.yml (modified: 2026-05-18 18:21:07) ====

services:
  homeassistant:
    container_name: homeassistantz
    image: ghcr.io/home-assistant/home-assistant:stable
    volumes:
      - ./config:/config
      - /etc/localtime:/etc/localtime:ro
      - /run/dbus:/run/dbus:ro
    restart: unless-stopped
    network_mode: host

  matter-server:
    container_name: matter-server
    image: ghcr.io/home-assistant-libs/python-matter-server:stable
    restart: unless-stopped
    security_opt:
      - apparmor:unconfined
    volumes:
      - ./matter:/data
      - /run/dbus:/run/dbus:ro
    network_mode: host

  nodered:
    container_name: nodered
    image: nodered/node-red:latest
    restart: unless-stopped
    ports:
      - "1880:1880"
    environment:
      TZ: Europe/London
    volumes:
      - node_red_data:/data

volumes:
  node_red_data:
    external: true


==== FILE: /Users/jeff/Downloads/10_Archive/Duplicated-Pending Deletion/shared/services/homeassistant/exports/areas.json (modified: 2026-05-19 16:17:29) ====

[
  {
    "aliases": [
      "Rear Bedroom",
      "Beta Bedroom",
      "Guest Bedroom"
    ],
    "floor_id": "flat",
    "id": "beta_bedroom",
    "labels": [
      "beta_bedroom"
    ],
    "name": "Spare Bedroom"
  },
  {
    "aliases": [],
    "floor_id": null,
    "id": "chaos",
    "labels": [],
    "name": "Laundry/Utilities"
  },
  {
    "aliases": [],
    "floor_id": "flat",
    "id": "core",
    "labels": [
      "core_living",
      "core_kitchen"
    ],
    "name": "Openplan (Core)"
  },
  {
    "aliases": [],
    "floor_id": null,
    "id": "alpha_bedroom",
    "labels": [],
    "name": "Bedroom (Alpha)"
  },
  {
    "aliases": [],
    "floor_id": "flat",
    "id": "pass",
    "labels": [
      "alpha_pass"
    ],
    "name": "Hallway (Pass)"
  },
  {
    "aliases": [],
    "floor_id": "flat",
    "id": "throne_bathroom",
    "labels": [],
    "name": "Ensuite (Throne) Bathroom"
  },
  {
    "aliases": [],
    "floor_id": null,
    "id": "default",
    "labels": [],
    "name": "Default"
  },
  {
    "aliases": [],
    "floor_id": null,
    "id": "my_bathroom",
    "labels": [],
    "name": "My Bathroom"
  },
  {
    "aliases": [],
    "floor_id": "flat",
    "id": "laundry_room",
    "labels": [],
    "name": "Laundry room"
  },
  {
    "aliases": [],
    "floor_id": "flat",
    "id": "storage",
    "labels": [],
    "name": "Storage"
  },
  {
    "aliases": [],
    "floor_id": "flat",
    "id": "secondary_bathroom",
    "labels": [],
    "name": "Secondary Bathroom"
  },
  {
    "aliases": [],
    "floor_id": "flat",
    "id": "dining",
    "labels": [],
    "name": "Dining"
  },
  {
    "aliases": [],
    "floor_id": null,
    "id": "attic",
    "labels": [],
    "name": "Attic"
  },
  {
    "aliases": [],
    "floor_id": "flat",
    "id": "living_room",
    "labels": [],
    "name": "Living Room"
  },
  {
    "aliases": [],
    "floor_id": null,
    "id": "openplan",
    "labels": [],
    "name": "Openplan"
  },
  {
    "aliases": [],
    "floor_id": null,
    "id": "living_room_2",
    "labels": [],
    "name": "Living Room (2)"
  },
  {
    "aliases": [],
    "floor_id": "flat",
    "id": "bedroom",
    "labels": [],
    "name": "Bedroom"
  },
  {
    "aliases": [],
    "floor_id": "flat",
    "id": "parking",
    "labels": [],
    "name": "Parking"
  },
  {
    "aliases": [],
    "floor_id": null,
    "id": "white_homepod_mini",
    "labels": [],
    "name": "White HomePod Mini"
  },
  {
    "aliases": [],
    "floor_id": null,
    "id": "beta_bedroom_2",
    "labels": [],
    "name": "Beta Bedroom"
  },
  {
    "aliases": [
      "Kitchen"
    ],
    "floor_id": "flat",
    "id": "core_kitchen",
    "labels": [
      "core"
    ],
    "name": "Core_kitchen"
  },
  {
    "aliases": [],
    "floor_id": null,
    "id": "orange_homepod_mini",
    "labels": [],
    "name": "Orange HomePod Mini"
  }
]


==== FILE: /Users/jeff/Downloads/10_Archive/Duplicated-Pending Deletion/shared/services/homeassistant/exports/devices.json (modified: 2026-05-19 16:17:29) ====

[
  {
    "area_id": null,
    "disabled_by": null,
    "entry_type": "service",
    "id": "a2bb6fe6e55358a2fb83fd847f27a746",
    "manufacturer": null,
    "model": null,
    "name": "Sun",
    "name_by_user": null
  },
  {
    "area_id": null,
    "disabled_by": null,
    "entry_type": null,
    "id": "939eb0b4c92e782ea3d06053bf6421c5",
    "manufacturer": "Shenzhen Phaten Tech. LTD",
    "model": "Unknown",
    "name": "hci0 (8C:BD:37:64:26:26)",
    "name_by_user": null
  },
  {
    "area_id": null,
    "disabled_by": null,
    "entry_type": "service",
    "id": "3c608d14afaa97bf113a32eef969c850",
    "manufacturer": "Home Assistant",
    "model": "Home Assistant Backup",
    "name": "Backup",
    "name_by_user": null
  },
  {
    "area_id": null,
    "disabled_by": null,
    "entry_type": null,
    "id": "c6dca7bee9771780c1d8225014c04fb1",
    "manufacturer": "Google Inc.",
    "model": "Google Nest Hub",
    "name": "Bedroom Display",
    "name_by_user": null
  },
  {
    "area_id": null,
    "disabled_by": null,
    "entry_type": "service",
    "id": "38f2f9e968d284138312ff4dafd8961d",
    "manufacturer": "Met.no",
    "model": "Forecast",
    "name": "Forecast",
    "name_by_user": null
  },
  {
    "area_id": null,
    "disabled_by": null,
    "entry_type": null,
    "id": "4ffe60a6382ee637e98da4868aeca8e1",
    "manufacturer": "Apple",
    "model": "iPhone17,2",
    "name": "iPhone 16Pro Max ",
    "name_by_user": null
  },
  {
    "area_id": null,
    "disabled_by": null,
    "entry_type": null,
    "id": "652c8cbed207e4d069bdaa8bdcf93e52",
    "manufacturer": "Apple",
    "model": "Mac15,12",
    "name": "MacBook Air ",
    "name_by_user": null
  },
  {
    "area_id": "alpha_bedroom",
    "disabled_by": null,
    "entry_type": null,
    "id": "f30934f854f8d5d86ff183095961de55",
    "manufacturer": "Withings",
    "model": null,
    "name": "Withings",
    "name_by_user": null
  },
  {
    "area_id": null,
    "disabled_by": null,
    "entry_type": null,
    "id": "a2e81a41c2ee0a9e1daec770ead9da75",
    "manufacturer": "Apple",
    "model": "iPhone18,2",
    "name": "Jeff\u2019s iPhone",
    "name_by_user": null
  },
  {
    "area_id": null,
    "disabled_by": null,
    "entry_type": null,
    "id": "93101baa2aef650396ea126fd61765af",
    "manufacturer": "Apple",
    "model": "iPad17,1",
    "name": "Jeff\u2019s iPad",
    "name_by_user": null
  },
  {
    "area_id": "living_room",
    "disabled_by": null,
    "entry_type": null,
    "id": "612098715827acdd9ca11b9286e29057",
    "manufacturer": "Apple",
    "model": "Apple TV 4K (gen 3)",
    "name": "living Room Apple TV",
    "name_by_user": "Lounge Apple TV (WIred)"
  },
  {
    "area_id": "living_room",
    "disabled_by": null,
    "entry_type": null,
    "id": "12b333bc773ab0d1bc7c261a26743962",
    "manufacturer": "Apple",
    "model": "HomePod (gen 2)",
    "name": "Living Room (2)",
    "name_by_user": "Core Lounge HomePod"
  },
  {
    "area_id": "living_room",
    "disabled_by": null,
    "entry_type": null,
    "id": "4a2969bba349c62c3ae8ed2a0139f3ff",
    "manufacturer": "Apple",
    "model": "HomePod (gen 2)",
    "name": "Living Room",
    "name_by_user": "Core Lounge HomePod"
  },
  {
    "area_id": "bedroom",
    "disabled_by": null,
    "entry_type": null,
    "id": "2f4611589743ae3b7fbd280c7f611782",
    "manufacturer": "Apple",
    "model": "HomePod Mini",
    "name": "Bedroom",
    "name_by_user": "Orange HomePod Mini"
  },
  {
    "area_id": "white_homepod_mini",
    "disabled_by": null,
    "entry_type": null,
    "id": "dc26045371744833233dc93dc63eb8bd",
    "manufacturer": "Apple",
    "model": "HomePod Mini",
    "name": "White HomePod Mini",
    "name_by_user": null
  },
  {
    "area_id": "parking",
    "disabled_by": null,
    "entry_type": "service",
    "id": "298e8da3405ebce662aec90ec1c65a87",
    "manufacturer": null,
    "model": null,
    "name": "SpeedTest",
    "name_by_user": null
  },
  {
    "area_id": null,
    "disabled_by": null,
    "entry_type": null,
    "id": "acc4a38ba4cb4997f8ce1533f1d485e3",
    "manufacturer": "Aqara",
    "model": "Aqara Hub M3",
    "name": "Aqara Hub M3",
    "name_by_user": null
  },
  {
    "area_id": null,
    "disabled_by": null,
    "entry_type": null,
    "id": "eaefa575e0142c1b997ad86338a1e36e",
    "manufacturer": "Aqara",
    "model": "Aqara Vibration Sensor",
    "name": "Aqara Vibration Sensor",
    "name_by_user": null
  },
  {
    "area_id": null,
    "disabled_by": null,
    "entry_type": null,
    "id": "880b2d33ed5a8a7f7f00c30568e2f664",
    "manufacturer": "Aqara",
    "model": "Aqara Door and Window Sensor",
    "name": "Aqara Door and Window Sensor",
    "name_by_user": null
  },
  {
    "area_id": null,
    "disabled_by": null,
    "entry_type": null,
    "id": "55707b23ebbe9e56dac212af4d16e418",
    "manufacturer": "Aqara",
    "model": "Aqara Door and Window Sensor",
    "name": "Aqara Door and Window Sensor",
    "name_by_user": null
  },
  {
    "area_id": null,
    "disabled_by": null,
    "entry_type": null,
    "id": "0cd6f6ad32a2c0b7c938478dc91b1347",
    "manufacturer": "Aqara",
    "model": "Aqara Door and Window Sensor",
    "name": "Aqara Door and Window Sensor",
    "name_by_user": null
  },
  {
    "area_id": null,
    "disabled_by": null,
    "entry_type": null,
    "id": "92e1843e781f34e8bcc13aa84f423eb9",
    "manufacturer": "Aqara",
    "model": "Aqara Door and Window Sensor",
    "name": "Aqara Door and Window Sensor",
    "name_by_user": null
  },
  {
    "area_id": null,
    "disabled_by": null,
    "entry_type": null,
    "id": "0728ce0e83045cf9666b391c53941d1e",
    "manufacturer": "Aqara",
    "model": "Aqara Door and Window Sensor",
    "name": "Aqara Door and Window Sensor",
    "name_by_user": null
  },
  {
    "area_id": null,
    "disabled_by": null,
    "entry_type": null,
    "id": "9398c3235542814e4cca0c14249228e4",
    "manufacturer": "Aqara",
    "model": "Aqara Door and Window Sensor",
    "name": "Aqara Door and Window Sensor",
    "name_by_user": null
  },
  {
    "area_id": null,
    "disabled_by": null,
    "entry_type": null,
    "id": "e7b7536f089b76b864bc1668e48f665c",
    "manufacturer": "Aqara",
    "model": "Aqara Door and Window Sensor",
    "name": "Aqara Door and Window Sensor",
    "name_by_user": null
  },
  {
    "area_id": null,
    "disabled_by": null,
    "entry_type": null,
    "id": "3e1dbf216befd9366e10e291f07948db",
    "manufacturer": "Aqara",
    "model": "Aqara Curtain Driver E1",
    "name": "Aqara Curtain Driver E1",
    "name_by_user": null
  },
  {
    "area_id": null,
    "disabled_by": null,
    "entry_type": null,
    "id": "412148a8ec0f5f9ba347008bb9c48d19",
    "manufacturer": "Aqara",
    "model": "Aqara Curtain Driver E1",
    "name": "Aqara Curtain Driver E1",
    "name_by_user": null
  },
  {
    "area_id": null,
    "disabled_by": null,
    "entry_type": null,
    "id": "a5cccdcd99030b787285cf002880f130",
    "manufacturer": "Aqara",
    "model": "Aqara\u00a0Presence\u00a0Sensor FP1E",
    "name": "Aqara\u00a0Presence\u00a0Sensor FP1E",
    "name_by_user": null
  },
  {
    "area_id": null,
    "disabled_by": null,
    "entry_type": null,
    "id": "c9d8d61f1d40653e629c68ceabddf488",
    "manufacturer": "Aqara",
    "model": "Aqara Motion Sensor P1",
    "name": "Aqara Motion Sensor P1",
    "name_by_user": null
  },
  {
    "area_id": null,
    "disabled_by": null,
    "entry_type": null,
    "id": "5f9599ebee4bf62fc9fb3038a1819397",
    "manufacturer": "Aqara",
    "model": "Aqara Motion Sensor P1",
    "name": "Aqara Motion Sensor P1",
    "name_by_user": null
  },
  {
    "area_id": null,
    "disabled_by": null,
    "entry_type": null,
    "id": "50568567cd5b532f7c719f8af20887d5",
    "manufacturer": "Aqara",
    "model": "Aqara Wireless Remote Switch",
    "name": "Aqara Wireless Remote Switch",
    "name_by_user": null
  },
  {
    "area_id": null,
    "disabled_by": null,
    "entry_type": null,
    "id": "3ba620e83a81087792b346d2b230c289",
    "manufacturer": "SwitchBot",
    "model": "SwitchBot Hub 3",
    "name": "SwitchBot Hub 3",
    "name_by_user": null
  },
  {
    "area_id": null,
    "disabled_by": null,
    "entry_type": null,
    "id": "46a08e3c0c4c210971727daa590c917f",
    "manufacturer": "SwitchBot",
    "model": "Hub 3",
    "name": "Hub 3 TempSensor",
    "name_by_user": null
  },
  {
    "area_id": null,
    "disabled_by": null,
    "entry_type": null,
    "id": "dd6d6604699f9bcb3f1785f0734ca0c7",
    "manufacturer": "SwitchBot",
    "model": "Hub 3",
    "name": "Hub 3 HumiSensor",
    "name_by_user": null
  },
  {
    "area_id": null,
    "disabled_by": null,
    "entry_type": null,
    "id": "f8bce4a32d0483c8e5998ec525bb9369",
    "manufacturer": "SwitchBot",
    "model": "Hub 3",
    "name": "Hub 3 MotionSensor",
    "name_by_user": null
  },
  {
    "area_id": "living_room_2",
    "disabled_by": null,
    "entry_type": null,
    "id": "23a9a926a450af03776a332578199e00",
    "manufacturer": "Apple",
    "model": "HomePod (gen 2)",
    "name": "Living Room (2)",
    "name_by_user": null
  },
  {
    "area_id": "beta_bedroom",
    "disabled_by": null,
    "entry_type": null,
    "id": "f417c8f588f9fd252fc32de6be532da9",
    "manufacturer": "Apple",
    "model": "Apple TV 4K (gen 3)",
    "name": "Beta Bedroom",
    "name_by_user": "Bedroom Apple TV"
  },
  {
    "area_id": null,
    "disabled_by": null,
    "entry_type": null,
    "id": "5a333ca87d58a8ff878d4618c15a08c6",
    "manufacturer": "SwitchBot",
    "model": "Hub 3",
    "name": "Hub 3 Button 1",
    "name_by_user": null
  },
  {
    "area_id": null,
    "disabled_by": null,
    "entry_type": null,
    "id": "e76350da340adc8f514b17cde07bed88",
    "manufacturer": "Aqara",
    "model": "Presence kitchen zone",
    "name": "Presence kitchen zone",
    "name_by_user": null
  },
  {
    "area_id": null,
    "disabled_by": null,
    "entry_type": null,
    "id": "ef6a2abe0d1fa53d01b8198d8aeadee0",
    "manufacturer": "Aqara",
    "model": "Approaching Openplan room",
    "name": "Approaching Openplan room",
    "name_by_user": null
  },
  {
    "area_id": null,
    "disabled_by": null,
    "entry_type": null,
    "id": "5347696d7632da6e8853f05ff7706010",
    "manufacturer": "Aqara",
    "model": "Presence living zone",
    "name": "Presence living zone",
    "name_by_user": null
  },
  {
    "area_id": null,
    "disabled_by": null,
    "entry_type": null,
    "id": "57b210076090a8a7602f2c14819c6a71",
    "manufacturer": "Aqara",
    "model": "Presence Dining zone",
    "name": "Presence Dining zone",
    "name_by_user": null
  },
  {
    "area_id": null,
    "disabled_by": null,
    "entry_type": null,
    "id": "b12ba98833de10944c276b8c986b48d5",
    "manufacturer": "Aqara",
    "model": "Absence for 5mins Openplan",
    "name": "Absence for 5mins Openplan",
    "name_by_user": null
  },
  {
    "area_id": null,
    "disabled_by": null,
    "entry_type": null,
    "id": "9cf834287d35c92b1c2b15d4e2563e3d",
    "manufacturer": "Aqara",
    "model": "Absence for 3mins kitchen zone",
    "name": "Absence for 3mins kitchen zone",
    "name_by_user": null
  },
  {
    "area_id": null,
    "disabled_by": null,
    "entry_type": null,
    "id": "9c402f1bb0f2e12aad2c1a3445cc2973",
    "manufacturer": "Aqara",
    "model": "Absence for 3mins living zone",
    "name": "Absence for 3mins living zone",
    "name_by_user": null
  },
  {
    "area_id": null,
    "disabled_by": null,
    "entry_type": null,
    "id": "d87b349943815bc7c6955598c148be6e",
    "manufacturer": "Aqara",
    "model": "Absence for 3mins dining zone",
    "name": "Absence for 3mins dining zone",
    "name_by_user": null
  },
  {
    "area_id": null,
    "disabled_by": null,
    "entry_type": null,
    "id": "6364ed40ff74eae0b9ebfaa1bcdefdfa",
    "manufacturer": "SwitchBot",
    "model": "Roller Shade",
    "name": "Roller Shade 2A",
    "name_by_user": null
  },
  {
    "area_id": null,
    "disabled_by": null,
    "entry_type": null,
    "id": "a94fde18da4f2126110649a104e1dc4e",
    "manufacturer": "SwitchBot",
    "model": "Hub 3",
    "name": "Hub 3 Button 2",
    "name_by_user": null
  },
  {
    "area_id": null,
    "disabled_by": null,
    "entry_type": null,
    "id": "a21d7792725515ce9008298a03bb798a",
    "manufacturer": "Signify",
    "model": "WiZ A60 Filament",
    "name": "WiZ A60 Filament",
    "name_by_user": null
  },
  {
    "area_id": null,
    "disabled_by": null,
    "entry_type": null,
    "id": "88018fd32d736c704bff5dc3e6d3973b",
    "manufacturer": "Aqara",
    "model": "Beta bedroom presence detected",
    "name": "Beta bedroom presence detected",
    "name_by_user": null
  },
  {
    "area_id": null,
    "disabled_by": null,
    "entry_type": null,
    "id": "b9219d3d32ad3432d09e71878ad14022",
    "manufacturer": "Aqara",
    "model": "Beta bedroom no presence 3mins",
    "name": "Beta bedroom no presence 3mins",
    "name_by_user": null
  },
  {
    "area_id": null,
    "disabled_by": null,
    "entry_type": null,
    "id": "2668f542fc4a530b359a16f4de5cb7e8",
    "manufacturer": "Aqara",
    "model": "Aqara\u00a0Presence\u00a0Sensor FP1E",
    "name": "Aqara\u00a0Presence\u00a0Sensor FP1E",
    "name_by_user": null
  },
  {
    "area_id": null,
    "disabled_by": null,
    "entry_type": null,
    "id": "cc5249666d50f9cda4fb6b62d3e4e561",
    "manufacturer": "Unknown manufacturer",
    "model": "LS01D",
    "name": "Serif TV",
    "name_by_user": null
  },
  {
    "area_id": "bedroom",
    "disabled_by": null,
    "entry_type": null,
    "id": "735ef7fcb4452be87b579182ccbe01a5",
    "manufacturer": "VeSync",
    "model": "Core300S",
    "name": "Core 300S",
    "name_by_user": null
  },
  {
    "area_id": null,
    "disabled_by": null,
    "entry_type": null,
    "id": "d2d4396241886122805bf4a3ee0450bf",
    "manufacturer": "Google Inc.",
    "model": "Google Nest Hub",
    "name": "NestHubD029",
    "name_by_user": null
  },
  {
    "area_id": null,
    "disabled_by": null,
    "entry_type": null,
    "id": "fb3b52c889646a1c8fc6bc77fe30205b",
    "manufacturer": "Google Inc.",
    "model": "Google Nest Hub",
    "name": "Loft Display",
    "name_by_user": null
  },
  {
    "area_id": null,
    "disabled_by": null,
    "entry_type": null,
    "id": "dcd0cddfa4a2499b515bac0840fc7abf",
    "manufacturer": "SwitchBot",
    "model": "Roller Shade",
    "name": "Roller Shade 0A",
    "name_by_user": null
  },
  {
    "area_id": null,
    "disabled_by": null,
    "entry_type": null,
    "id": "264736363a5bf620236a739daa0a1bb0",
    "manufacturer": "SwitchBot",
    "model": "Roller Shade",
    "name": "Roller Shade 84",
    "name_by_user": null
  },
  {
    "area_id": null,
    "disabled_by": null,
    "entry_type": null,
    "id": "9beffa7c4c3798840d68b0965a880731",
    "manufacturer": "SwitchBot",
    "model": "Hub 3",
    "name": "Hub 3 Button 3",
    "name_by_user": null
  },
  {
    "area_id": null,
    "disabled_by": null,
    "entry_type": null,
    "id": "e1e44b9e90ff621f67173abf1228ec8f",
    "manufacturer": "SwitchBot",
    "model": "Bot",
    "name": "Bot 4A",
    "name_by_user": null
  },
  {
    "area_id": "chaos",
    "disabled_by": null,
    "entry_type": null,
    "id": "d655489921cbb3a2585dc855c0d1ea75",
    "manufacturer": "Signify Netherlands B.V.",
    "model": "Hue Bridge",
    "name": "Hue Bridge Pro",
    "name_by_user": null
  },
  {
    "area_id": "beta_bedroom",
    "disabled_by": null,
    "entry_type": null,
    "id": "c61c4551d3ec38cda5ef874359c7d174",
    "manufacturer": "Signify Netherlands B.V.",
    "model": "Hue motion sensor",
    "name": "Bathroom2 Hue Motion Sensor",
    "name_by_user": "Hue Motion Sensor"
  },
  {
    "area_id": "chaos",
    "disabled_by": null,
    "entry_type": null,
    "id": "f72d9da87ad9f369da5b9fa4bccfb8aa",
    "manufacturer": "Signify Netherlands B.V.",
    "model": "Hue white lamp",
    "name": "store room ceiling",
    "name_by_user": "White (E27) Hue Bulb"
  },
  {
    "area_id": null,
    "disabled_by": null,
    "entry_type": null,
    "id": "5c5088969773c38740cbd5f823f58d65",
    "manufacturer": "Signify Netherlands B.V.",
    "model": "Hue Essential spot",
    "name": "Nymane 3-spot Lamp - Mid",
    "name_by_user": null
  },
  {
    "area_id": "core",
    "disabled_by": null,
    "entry_type": null,
    "id": "c2789cbe73d4b79832da4a6a2e328737",
    "manufacturer": "Signify Netherlands B.V.",
    "model": "Signe gradient floor",
    "name": "Signe gradient floor 1",
    "name_by_user": null
  },
  {
    "area_id": "core",
    "disabled_by": null,
    "entry_type": null,
    "id": "de3a3b86f9f861abd8474a0bbee6e039",
    "manufacturer": "Signify Netherlands B.V.",
    "model": "Hue ambiance spot",
    "name": "kitchen ceiling.2",
    "name_by_user": "Core Ceiling Light.10"
  },
  {
    "area_id": "core",
    "disabled_by": null,
    "entry_type": null,
    "id": "11501df1df87e0a6ea1a99334fded6d2",
    "manufacturer": "Signify Netherlands B.V.",
    "model": "Hue color spot",
    "name": "core ceiling.8",
    "name_by_user": "Core Ceiling Light.8"
  },
  {
    "area_id": "core",
    "disabled_by": null,
    "entry_type": null,
    "id": "33595151421af22100a3e06457f0d43f",
    "manufacturer": "Signify Netherlands B.V.",
    "model": "Hue color candle",
    "name": "Mushroom Table Lamp",
    "name_by_user": "Klasnick Beige Table Lamp (with E14 Hue Colour)"
  },
  {
    "area_id": "core",
    "disabled_by": null,
    "entry_type": null,
    "id": "1e9955f25dc9f5c09dcb90e0fb8d60dd",
    "manufacturer": "Signify Netherlands B.V.",
    "model": "Hue color spot",
    "name": "Alpha-flex ceiling.6",
    "name_by_user": "Core Ceiling Light.1"
  },
  {
    "area_id": "alpha_bedroom",
    "disabled_by": null,
    "entry_type": null,
    "id": "55f7455e695e1ce7fdddb9b06f95ac1e",
    "manufacturer": "Signify Netherlands B.V.",
    "model": "Hue color spot",
    "name": "Alpha Ceiling Light.2",
    "name_by_user": "Alphabed Ceiling Light.5"
  },
  {
    "area_id": null,
    "disabled_by": null,
    "entry_type": null,
    "id": "d89bf5602e1724bf0b26f43bf6866f40",
    "manufacturer": "Signify Netherlands B.V.",
    "model": "Hue Play",
    "name": "Hue Play 1",
    "name_by_user": null
  },
  {
    "area_id": null,
    "disabled_by": null,
    "entry_type": null,
    "id": "81afd7db5465561e20df193ef451d0f4",
    "manufacturer": "Signify Netherlands B.V.",
    "model": "Signe gradient table",
    "name": "Signe gradient table 1",
    "name_by_user": null
  },
  {
    "area_id": "core",
    "disabled_by": null,
    "entry_type": null,
    "id": "258fcb0a550539cc7ec6fffe58967e36",
    "manufacturer": "Signify Netherlands B.V.",
    "model": "Signe gradient floor",
    "name": "signe gradient floor lamp.1",
    "name_by_user": "Hue Signe White Gradient Floor Lamp.1"
  },
  {
    "area_id": "beta_bedroom",
    "disabled_by": null,
    "entry_type": null,
    "id": "dc71020d45c5332607408e59045efbf9",
    "manufacturer": "Signify Netherlands B.V.",
    "model": "Hue ambiance spot",
    "name": "Beta Ceiling Light.6",
    "name_by_user": null
  },
  {
    "area_id": "alpha_bedroom",
    "disabled_by": null,
    "entry_type": null,
    "id": "c1c0e309ed8147ef57d651df415bc548",
    "manufacturer": "Signify Netherlands B.V.",
    "model": "Hue ambiance spot",
    "name": "core ceiling.1",
    "name_by_user": "Alpha Ceiling Light.6"
  },
  {
    "area_id": "pass",
    "disabled_by": null,
    "entry_type": null,
    "id": "1fc62b8e8aa80845dc7cb23e3f0bc24f",
    "manufacturer": "Signify Netherlands B.V.",
    "model": "Hue ambiance spot",
    "name": "Pass Ceiling Light.3",
    "name_by_user": "Pass Ceiling Light.1"
  },
  {
    "area_id": "alpha_bedroom",
    "disabled_by": null,
    "entry_type": null,
    "id": "2e19b66efcd2fdf07d25df6ff0dd9518",
    "manufacturer": "Signify Netherlands B.V.",
    "model": "Hue Essential spot",
    "name": "Nymane 3-spot Lamp - Low",
    "name_by_user": null
  },
  {
    "area_id": "throne_bathroom",
    "disabled_by": null,
    "entry_type": null,
    "id": "3a26058d1afa9fa8888a9b3865c8eaa7",
    "manufacturer": "Signify Netherlands B.V.",
    "model": "Hue motion sensor",
    "name": "Throne  Hue Motion Sensor",
    "name_by_user": "Hue Motion Sensor"
  },
  {
    "area_id": "beta_bedroom",
    "disabled_by": null,
    "entry_type": null,
    "id": "d82ba9da0b831576a30a6202b35686cc",
    "manufacturer": "Signify Netherlands B.V.",
    "model": "Hue ambiance spot",
    "name": "Beta Ceiling Light.5",
    "name_by_user": "Beta Ceiling Light.3"
  },
  {
    "area_id": null,
    "disabled_by": null,
    "entry_type": null,
    "id": "da1dd2355bbec3191d522313064aa97c",
    "manufacturer": "Signify Netherlands B.V.",
    "model": "Hue smart button",
    "name": "Hue smart button 2",
    "name_by_user": null
  },
  {
    "area_id": "chaos",
    "disabled_by": null,
    "entry_type": null,
    "id": "cc79d7dfe1b17181869f10c35cc4c833",
    "manufacturer": "Signify Netherlands B.V.",
    "model": "Hue white lamp",
    "name": "Laundry room ceiling",
    "name_by_user": "Laundry (Chaos) Ceiling Light"
  },
  {
    "area_id": "secondary_bathroom",
    "disabled_by": null,
    "entry_type": null,
    "id": "712dfdefa747a25fb6b5491f50d4fc77",
    "manufacturer": "Signify Netherlands B.V.",
    "model": "Hue ambiance spot",
    "name": "Splash Ceiling Light.1",
    "name_by_user": null
  },
  {
    "area_id": "throne_bathroom",
    "disabled_by": null,
    "entry_type": null,
    "id": "7ad73057c31770c617cd496edba33088",
    "manufacturer": "Signify Netherlands B.V.",
    "model": "Hue ambiance spot",
    "name": "Throne Ceiling above Toilet",
    "name_by_user": "Throne Ceiling Light.3"
  },
  {
    "area_id": "alpha_bedroom",
    "disabled_by": null,
    "entry_type": null,
    "id": "500c186b1b951c54ec8b27c162c9e452",
    "manufacturer": "Signify Netherlands B.V.",
    "model": "Hue smart button",
    "name": "Bedroom behind Bed Smart Button",
    "name_by_user": "Alpha Hue Smart Button"
  },
  {
    "area_id": "alpha_bedroom",
    "disabled_by": null,
    "entry_type": null,
    "id": "c679070b7932d16308b82b9e3d646938",
    "manufacturer": "Signify Netherlands B.V.",
    "model": "Hue color spot",
    "name": "Alpha Ceiling Light.3",
    "name_by_user": "Alphabed Ceiling Light.5"
  },
  {
    "area_id": null,
    "disabled_by": null,
    "entry_type": null,
    "id": "543d647ade89fd9e32afd034b4937846",
    "manufacturer": "Signify Netherlands B.V.",
    "model": "Hue Essential spot",
    "name": "Nyamane 3-spot Lamp - Top ",
    "name_by_user": null
  },
  {
    "area_id": "core",
    "disabled_by": null,
    "entry_type": null,
    "id": "f8149a06f87fed8bb2412cf2fea76be7",
    "manufacturer": "Signify Netherlands B.V.",
    "model": "Hue color spot",
    "name": "core ceiling.7",
    "name_by_user": "Core Ceiling Light.4"
  },
  {
    "area_id": "core",
    "disabled_by": null,
    "entry_type": null,
    "id": "7ff3eb57a4f7b8b83823e6bbc1cd43c0",
    "manufacturer": "Signify Netherlands B.V.",
    "model": "Hue color spot",
    "name": "Alpha Ceiling Light.1",
    "name_by_user": "Core Ceiling Light.5"
  },
  {
    "area_id": "beta_bedroom",
    "disabled_by": null,
    "entry_type": null,
    "id": "c27b8a08b76af2ed70e81a475a781ac8",
    "manufacturer": "Signify Netherlands B.V.",
    "model": "Hue ambiance spot",
    "name": "Betaflex Ceiling Light.2",
    "name_by_user": "Betaflex Ceiling Light.2"
  },
  {
    "area_id": "pass",
    "disabled_by": null,
    "entry_type": null,
    "id": "a1493cb9fc881b1421e04687bc9553a3",
    "manufacturer": "Signify Netherlands B.V.",
    "model": "Hue ambiance spot",
    "name": "Pass Ceiling Light.1",
    "name_by_user": "Pass Ceiling Light.1 "
  },
  {
    "area_id": null,
    "disabled_by": null,
    "entry_type": null,
    "id": "5525c9fb0db1dab203c66826dc6847a0",
    "manufacturer": "Signify Netherlands B.V.",
    "model": "Hue color lamp",
    "name": "Ola Whitborg XL Floor Lamp",
    "name_by_user": null
  },
  {
    "area_id": "throne_bathroom",
    "disabled_by": null,
    "entry_type": null,
    "id": "22a1188f6ffa438992b8004a39cd432f",
    "manufacturer": "Signify Netherlands B.V.",
    "model": "Hue ambiance spot",
    "name": "Throne Ceiling above shower door",
    "name_by_user": null
  },
  {
    "area_id": null,
    "disabled_by": null,
    "entry_type": null,
    "id": "e6939abcf85960114033763df1633e2e",
    "manufacturer": "Signify Netherlands B.V.",
    "model": "Hue Play",
    "name": "Hue Play 2",
    "name_by_user": null
  },
  {
    "area_id": "bedroom",
    "disabled_by": null,
    "entry_type": null,
    "id": "ba9d7d9777253c445066c26aca659483",
    "manufacturer": "Signify Netherlands B.V.",
    "model": "Hue Essential spot",
    "name": "Alpha Ceiling Light.6",
    "name_by_user": null
  },
  {
    "area_id": "core",
    "disabled_by": null,
    "entry_type": null,
    "id": "9f1606f2d60df3ef87d614354986c424",
    "manufacturer": "Signify Netherlands B.V.",
    "model": "Hue tap dial switch",
    "name": "Core Hue Tap Dial Switch",
    "name_by_user": "Core Tap Dial Light Switch"
  },
  {
    "area_id": "alpha_bedroom",
    "disabled_by": null,
    "entry_type": null,
    "id": "f3a36de300c078041de5869a79f49dbe",
    "manufacturer": "Signify Netherlands B.V.",
    "model": "Hue tap dial switch",
    "name": "Alpha Bedroom Dial Switch",
    "name_by_user": null
  },
  {
    "area_id": "secondary_bathroom",
    "disabled_by": null,
    "entry_type": null,
    "id": "345f22c2aac0cf310cc467f20ad291d4",
    "manufacturer": "Signify Netherlands B.V.",
    "model": "Hue ambiance spot",
    "name": "Splash Ceiling Light.3",
    "name_by_user": null
  },
  {
    "area_id": null,
    "disabled_by": null,
    "entry_type": null,
    "id": "b9139ec0152442d7ffe7ec7119dfec48",
    "manufacturer": "Signify Netherlands B.V.",
    "model": "Hue color lamp",
    "name": "fado glass globe lamp",
    "name_by_user": null
  },
  {
    "area_id": "secondary_bathroom",
    "disabled_by": null,
    "entry_type": null,
    "id": "0a7d029aeef8c21cb1ed5d3be91ad78e",
    "manufacturer": "Signify Netherlands B.V.",
    "model": "Hue dimmer switch",
    "name": "Splash Dimmer Switch",
    "name_by_user": null
  },
  {
    "area_id": "core",
    "disabled_by": null,
    "entry_type": null,
    "id": "c1c74acf710e8ce06117655e979e893e",
    "manufacturer": "Signify Netherlands B.V.",
    "model": "Hue color spot",
    "name": "core ceiling.4",
    "name_by_user": "Core Ceiling Light.4"
  },
  {
    "area_id": "core",
    "disabled_by": null,
    "entry_type": null,
    "id": "9000c66a1b0d6684075d3e5c53d1543c",
    "manufacturer": "Signify Netherlands B.V.",
    "model": "Hue lightguide bulb",
    "name": "monica vibelucci  arc lamp",
    "name_by_user": "Core Statement Arc Floor Lamp Monica Vibelucci"
  },
  {
    "area_id": "secondary_bathroom",
    "disabled_by": null,
    "entry_type": null,
    "id": "33028e1253bd920ca8025d846edbb6e6",
    "manufacturer": "Signify Netherlands B.V.",
    "model": "Hue ambiance spot",
    "name": "Splash Ceiling Light.2",
    "name_by_user": null
  },
  {
    "area_id": "core",
    "disabled_by": null,
    "entry_type": null,
    "id": "cac5cdcc358702139ac465f8994f9e83",
    "manufacturer": "Signify Netherlands B.V.",
    "model": "Hue color spot",
    "name": "core ceiling.2",
    "name_by_user": "Core Ceiling Light.2"
  },
  {
    "area_id": "beta_bedroom",
    "disabled_by": null,
    "entry_type": null,
    "id": "b8a1e7c445f4889533cbd7600f709aee",
    "manufacturer": "Signify Netherlands B.V.",
    "model": "Hue tap dial switch",
    "name": "Hallway Tap Dial Switch",
    "name_by_user": null
  },
  {
    "area_id": "throne_bathroom",
    "disabled_by": null,
    "entry_type": null,
    "id": "b4da620be9a589bb9a2039e1ab78ebef",
    "manufacturer": "Signify Netherlands B.V.",
    "model": "Hue ambiance spot",
    "name": "Throne Ceiling above Door",
    "name_by_user": null
  },
  {
    "area_id": "bedroom",
    "disabled_by": null,
    "entry_type": null,
    "id": "e6b677474cc1f572d83596e2d103af6a",
    "manufacturer": "Signify Netherlands B.V.",
    "model": "Play gradient tube",
    "name": "Play gradient tube 1",
    "name_by_user": "alpha gradient light-tube.1"
  },
  {
    "area_id": "alpha_bedroom",
    "disabled_by": null,
    "entry_type": null,
    "id": "eb2058653fe9e0f95ad5aa8018b97de2",
    "manufacturer": "Signify Netherlands B.V.",
    "model": "Hue color spot",
    "name": "Alpha Ceiling Light.4",
    "name_by_user": "Alpha Ceiling Light.4"
  },
  {
    "area_id": "secondary_bathroom",
    "disabled_by": null,
    "entry_type": null,
    "id": "5200e66fdc90aad0dd0cbceb76c22319",
    "manufacturer": "Signify Netherlands B.V.",
    "model": "Hue ambiance spot",
    "name": "Splash Ceiling Light.4",
    "name_by_user": null
  },
  {
    "area_id": "living_room",
    "disabled_by": null,
    "entry_type": null,
    "id": "529049bbc4a02b9ebd873f19ca3412da",
    "manufacturer": "Signify Netherlands B.V.",
    "model": "Hue color lamp",
    "name": "Beige Ola Spotlight Lamp",
    "name_by_user": null
  },
  {
    "area_id": "beta_bedroom",
    "disabled_by": null,
    "entry_type": null,
    "id": "ec259a6304fedd4f2569aa942ef6edb9",
    "manufacturer": "Signify Netherlands B.V.",
    "model": "Hue ambiance spot",
    "name": "Beta Ceiling Light.3",
    "name_by_user": null
  },
  {
    "area_id": "pass",
    "disabled_by": null,
    "entry_type": null,
    "id": "7158827f268292c33df8d3ac80d77f8b",
    "manufacturer": "Signify Netherlands B.V.",
    "model": "Hue dimmer switch",
    "name": "Hallway Dimmer Switch",
    "name_by_user": null
  },
  {
    "area_id": "bedroom",
    "disabled_by": null,
    "entry_type": null,
    "id": "a3f86e911440eba9848a331183d010d2",
    "manufacturer": "Signify Netherlands B.V.",
    "model": "Hue color candle",
    "name": "Right Bedside Lamp",
    "name_by_user": null
  },
  {
    "area_id": "throne_bathroom",
    "disabled_by": null,
    "entry_type": null,
    "id": "9262c97c808756f1c42c9a5f56d07b44",
    "manufacturer": "Signify Netherlands B.V.",
    "model": "Hue dimmer switch",
    "name": "Throne Bathroom Ceiling",
    "name_by_user": "Bathroom dimmer switch"
  },
  {
    "area_id": "throne_bathroom",
    "disabled_by": null,
    "entry_type": null,
    "id": "062b0dbde1538a39a2caddb290a7f1ec",
    "manufacturer": "Signify Netherlands B.V.",
    "model": "Hue ambiance spot",
    "name": "Throne Ceiling above sink",
    "name_by_user": null
  },
  {
    "area_id": "living_room",
    "disabled_by": null,
    "entry_type": null,
    "id": "25fd95b77ffb4e30f911e0e44136680e",
    "manufacturer": "Signify Netherlands B.V.",
    "model": "Hue color spot",
    "name": "core ceiling.5",
    "name_by_user": "Core Ceiling Light.5"
  },
  {
    "area_id": "secondary_bathroom",
    "disabled_by": null,
    "entry_type": null,
    "id": "1aecb535c3b242ba001f8fe849f0cc66",
    "manufacturer": "Signify Netherlands B.V.",
    "model": "Hue ambiance spot",
    "name": "Splash Ceiling Light.5",
    "name_by_user": null
  },
  {
    "area_id": "beta_bedroom",
    "disabled_by": null,
    "entry_type": null,
    "id": "95dba2dec02b41db4ea3ca072dcdd6d0",
    "manufacturer": "Signify Netherlands B.V.",
    "model": "Hue ambiance spot",
    "name": "Beta Ceiling Light.4",
    "name_by_user": null
  },
  {
    "area_id": "core_kitchen",
    "disabled_by": null,
    "entry_type": null,
    "id": "f31d63cbe41b5f1acd30ad687951c840",
    "manufacturer": "Signify Netherlands B.V.",
    "model": "Hue ambiance spot",
    "name": "kitchen ceiling.1",
    "name_by_user": "Core Ceiling Light.9"
  },
  {
    "area_id": null,
    "disabled_by": null,
    "entry_type": null,
    "id": "027c1c392e1914472aebdad116e88d1f",
    "manufacturer": "Signify Netherlands B.V.",
    "model": "Hue smart button",
    "name": "Hue smart button 3",
    "name_by_user": null
  },
  {
    "area_id": "core",
    "disabled_by": null,
    "entry_type": null,
    "id": "f2bdc76a73830aa7fa6193766aed417e",
    "manufacturer": "Signify Netherlands B.V.",
    "model": "Hue color spot",
    "name": "core ceiling.6",
    "name_by_user": "Core Ceiling Light.6"
  },
  {
    "area_id": "pass",
    "disabled_by": null,
    "entry_type": null,
    "id": "fbfcf983165eca43796973ac96dfd87f",
    "manufacturer": "Signify Netherlands B.V.",
    "model": "Hue ambiance spot",
    "name": "Pass Ceiling Light.4",
    "name_by_user": null
  },
  {
    "area_id": "pass",
    "disabled_by": null,
    "entry_type": null,
    "id": "b282b813d0ba73db7eb149a8fccfd390",
    "manufacturer": "Signify Netherlands B.V.",
    "model": "Hue ambiance spot",
    "name": "Pass Ceiling Light.5",
    "name_by_user": null
  },
  {
    "area_id": "pass",
    "disabled_by": null,
    "entry_type": null,
    "id": "b3b83fe3b391eaa9d7c5e917a8a028d1",
    "manufacturer": "Signify Netherlands B.V.",
    "model": "Hue ambiance spot",
    "name": "Pass Ceiling Light.2",
    "name_by_user": null
  },
  {
    "area_id": "beta_bedroom",
    "disabled_by": null,
    "entry_type": null,
    "id": "fb3b1cc5cd84b7435b46d79ba3160450",
    "manufacturer": "Signify Netherlands B.V.",
    "model": "Hue ambiance spot",
    "name": "Betaflex Ceiling Light.1",
    "name_by_user": null
  },
  {
    "area_id": "bedroom",
    "disabled_by": null,
    "entry_type": null,
    "id": "475fe7c2987064f9797a7860b2e6f7ad",
    "manufacturer": "IKEA of Sweden",
    "model": "Dimmable light",
    "name": "Ikea Skytrax Light",
    "name_by_user": null
  },
  {
    "area_id": null,
    "disabled_by": null,
    "entry_type": null,
    "id": "2c9a65b5226b60f36e9fa994d5db3e92",
    "manufacturer": "Signify Netherlands B.V.",
    "model": "Hue smart plug",
    "name": "Hue smart plug 1",
    "name_by_user": null
  },
  {
    "area_id": "beta_bedroom",
    "disabled_by": null,
    "entry_type": null,
    "id": "d9da816eb1ea175c045b94dda1fab89c",
    "manufacturer": "Signify Netherlands B.V.",
    "model": "Hue lightstrip plus",
    "name": "Beta Bed Lightstrip",
    "name_by_user": null
  },
  {
    "area_id": "alpha_bedroom",
    "disabled_by": null,
    "entry_type": null,
    "id": "3ea5d1bb94beb7cccc04318580529ee7",
    "manufacturer": "Signify Netherlands B.V.",
    "model": "Hue ambiance spot",
    "name": "core ceiling.3",
    "name_by_user": null
  },
  {
    "area_id": "alpha_bedroom",
    "disabled_by": null,
    "entry_type": null,
    "id": "5d5d2cd72b6952b59a09cb567a37284c",
    "manufacturer": "Signify Netherlands B.V.",
    "model": "Hue color spot",
    "name": "Alpha Ceiling Light.5",
    "name_by_user": "Alphabed Ceiling Light.3"
  },
  {
    "area_id": "pass",
    "disabled_by": null,
    "entry_type": "service",
    "id": "a8a5ae19c7ced86ad29d7245978c0d56",
    "manufacturer": "Signify Netherlands B.V.",
    "model": "Room",
    "name": "Hallway",
    "name_by_user": null
  },
  {
    "area_id": "beta_bedroom",
    "disabled_by": null,
    "entry_type": "service",
    "id": "38f7ad003f2fa943ee7574fb8e21dcb2",
    "manufacturer": "Signify Netherlands B.V.",
    "model": "Room",
    "name": "Spare Bedroom",
    "name_by_user": null
  },
  {
    "area_id": "secondary_bathroom",
    "disabled_by": null,
    "entry_type": "service",
    "id": "6d7b499febad4be04c50281d66c355b9",
    "manufacturer": "Signify Netherlands B.V.",
    "model": "Room",
    "name": "Secondary Bathroom",
    "name_by_user": null
  },
  {
    "area_id": "living_room",
    "disabled_by": null,
    "entry_type": "service",
    "id": "d658ffac53d39553a6e2140b1e97cef0",
    "manufacturer": "Signify Netherlands B.V.",
    "model": "Room",
    "name": "Living room",
    "name_by_user": null
  },
  {
    "area_id": "core_kitchen",
    "disabled_by": null,
    "entry_type": "service",
    "id": "c4511e091350b7f37d4f417193c8d386",
    "manufacturer": "Signify Netherlands B.V.",
    "model": "Room",
    "name": "Kitchen",
    "name_by_user": null
  },
  {
    "area_id": "my_bathroom",
    "disabled_by": null,
    "entry_type": "service",
    "id": "117c704d9e32a6e962854eb81789dab3",
    "manufacturer": "Signify Netherlands B.V.",
    "model": "Room",
    "name": "Bathroom",
    "name_by_user": null
  },
  {
    "area_id": "alpha_bedroom",
    "disabled_by": null,
    "entry_type": "service",
    "id": "50a528511760fe9c34e7301b1e2e3cc3",
    "manufacturer": "Signify Netherlands B.V.",
    "model": "Room",
    "name": "Bedroom",
    "name_by_user": null
  },
  {
    "area_id": "beta_bedroom",
    "disabled_by": null,
    "entry_type": "service",
    "id": "0fade83b4b0b0f8f4cd529c4720bd2c2",
    "manufacturer": "Signify Netherlands B.V.",
    "model": "Zone",
    "name": "Beta Bedroom & Bath",
    "name_by_user": null
  },
  {
    "area_id": "living_room",
    "disabled_by": null,
    "entry_type": "service",
    "id": "34f94074f6947cf4bb83f5dcd89ffbd8",
    "manufacturer": "Signify Netherlands B.V.",
    "model": "Zone",
    "name": "Core Living Ceiling",
    "name_by_user": null
  },
  {
    "area_id": "bedroom",
    "disabled_by": null,
    "entry_type": "service",
    "id": "b0e22adacb7b181d0195839086e46516",
    "manufacturer": "Signify Netherlands B.V.",
    "model": "Zone",
    "name": "Bedroom Ceiling",
    "name_by_user": null
  },
  {
    "area_id": "bedroom",
    "disabled_by": null,
    "entry_type": "service",
    "id": "ee40c0ac85ca50f3ee21e699ac8f14ed",
    "manufacturer": "Signify Netherlands B.V.",
    "model": "Zone",
    "name": "Bedroom Lamps",
    "name_by_user": null
  },
  {
    "area_id": "laundry_room",
    "disabled_by": null,
    "entry_type": "service",
    "id": "3c4a13dec7e554b24b395ff8bdc8fda5",
    "manufacturer": "Signify Netherlands B.V.",
    "model": "Zone",
    "name": "Laundry room",
    "name_by_user": null
  },
  {
    "area_id": "beta_bedroom",
    "disabled_by": null,
    "entry_type": "service",
    "id": "514f06a7f929e6441e7c3208365296bd",
    "manufacturer": "Signify Netherlands B.V.",
    "model": "Zone",
    "name": "Spare Bedroom Ceiling",
    "name_by_user": null
  },
  {
    "area_id": "core_kitchen",
    "disabled_by": null,
    "entry_type": "service",
    "id": "fa6e413f91600e74a6443af15cf1797b",
    "manufacturer": "Signify Netherlands B.V.",
    "model": "Zone",
    "name": "Kitchen Ceiling",
    "name_by_user": null
  },
  {
    "area_id": "core_kitchen",
    "disabled_by": null,
    "entry_type": "service",
    "id": "8cc5a4ca37e3955327e390a50af4630f",
    "manufacturer": "Signify Netherlands B.V.",
    "model": "Zone",
    "name": "Kitchen Task",
    "name_by_user": null
  },
  {
    "area_id": "living_room",
    "disabled_by": null,
    "entry_type": "service",
    "id": "2ca99b27e5a48523c674bcc99b7ee560",
    "manufacturer": "Signify Netherlands B.V.",
    "model": "Zone",
    "name": "Living room lamps",
    "name_by_user": null
  },
  {
    "area_id": "bedroom",
    "disabled_by": null,
    "entry_type": "service",
    "id": "9bcdac103a6fe193a4cd1ff6864c8012",
    "manufacturer": "Signify Netherlands B.V.",
    "model": "Zone",
    "name": "All Bedroom & Bathroom",
    "name_by_user": null
  },
  {
    "area_id": null,
    "disabled_by": null,
    "entry_type": null,
    "id": "6a4f6e0da1c233db98df89c682696867",
    "manufacturer": "Google Inc.",
    "model": "Google Nest Hub",
    "name": "NestHubD029",
    "name_by_user": null
  },
  {
    "area_id": "pass",
    "disabled_by": null,
    "entry_type": null,
    "id": "51713f83c0aeecdf8d304f02755b2ed6",
    "manufacturer": "Apple",
    "model": "HomePod Mini",
    "name": "Orange HomePod Mini",
    "name_by_user": null
  },
  {
    "area_id": "default",
    "disabled_by": null,
    "entry_type": "service",
    "id": "5a896ec0939280f63f69cff464e31d77",
    "manufacturer": "Signify Netherlands B.V.",
    "model": "Room",
    "name": "Default",
    "name_by_user": null
  }
]


==== FILE: /Users/jeff/Downloads/10_Archive/Duplicated-Pending Deletion/shared/services/homeassistant/exports/entities.json (modified: 2026-05-19 16:17:29) ====

[
  {
    "area_id": null,
    "device_id": "a2bb6fe6e55358a2fb83fd847f27a746",
    "disabled_by": "integration",
    "entity_id": "binary_sensor.sun_solar_rising",
    "hidden_by": null,
    "name": null,
    "original_name": "Solar rising",
    "platform": "sun"
  },
  {
    "area_id": null,
    "device_id": "a2bb6fe6e55358a2fb83fd847f27a746",
    "disabled_by": null,
    "entity_id": "sensor.sun_next_dawn",
    "hidden_by": null,
    "name": null,
    "original_name": "Next dawn",
    "platform": "sun"
  },
  {
    "area_id": null,
    "device_id": "a2bb6fe6e55358a2fb83fd847f27a746",
    "disabled_by": null,
    "entity_id": "sensor.sun_next_dusk",
    "hidden_by": null,
    "name": null,
    "original_name": "Next dusk",
    "platform": "sun"
  },
  {
    "area_id": null,
    "device_id": "a2bb6fe6e55358a2fb83fd847f27a746",
    "disabled_by": null,
    "entity_id": "sensor.sun_next_midnight",
    "hidden_by": null,
    "name": null,
    "original_name": "Next midnight",
    "platform": "sun"
  },
  {
    "area_id": null,
    "device_id": "a2bb6fe6e55358a2fb83fd847f27a746",
    "disabled_by": null,
    "entity_id": "sensor.sun_next_noon",
    "hidden_by": null,
    "name": null,
    "original_name": "Next noon",
    "platform": "sun"
  },
  {
    "area_id": null,
    "device_id": "a2bb6fe6e55358a2fb83fd847f27a746",
    "disabled_by": null,
    "entity_id": "sensor.sun_next_rising",
    "hidden_by": null,
    "name": null,
    "original_name": "Next rising",
    "platform": "sun"
  },
  {
    "area_id": null,
    "device_id": "a2bb6fe6e55358a2fb83fd847f27a746",
    "disabled_by": null,
    "entity_id": "sensor.sun_next_setting",
    "hidden_by": null,
    "name": null,
    "original_name": "Next setting",
    "platform": "sun"
  },
  {
    "area_id": null,
    "device_id": "a2bb6fe6e55358a2fb83fd847f27a746",
    "disabled_by": "integration",
    "entity_id": "sensor.sun_solar_elevation",
    "hidden_by": null,
    "name": null,
    "original_name": "Solar elevation",
    "platform": "sun"
  },
  {
    "area_id": null,
    "device_id": "a2bb6fe6e55358a2fb83fd847f27a746",
    "disabled_by": "integration",
    "entity_id": "sensor.sun_solar_azimuth",
    "hidden_by": null,
    "name": null,
    "original_name": "Solar azimuth",
    "platform": "sun"
  },
  {
    "area_id": null,
    "device_id": "a2bb6fe6e55358a2fb83fd847f27a746",
    "disabled_by": "integration",
    "entity_id": "sensor.sun_solar_rising",
    "hidden_by": null,
    "name": null,
    "original_name": "Solar rising",
    "platform": "sun"
  },
  {
    "area_id": null,
    "device_id": "3c608d14afaa97bf113a32eef969c850",
    "disabled_by": null,
    "entity_id": "event.backup_automatic_backup",
    "hidden_by": null,
    "name": null,
    "original_name": "Automatic backup",
    "platform": "backup"
  },
  {
    "area_id": null,
    "device_id": "3c608d14afaa97bf113a32eef969c850",
    "disabled_by": null,
    "entity_id": "sensor.backup_backup_manager_state",
    "hidden_by": null,
    "name": null,
    "original_name": "Backup Manager state",
    "platform": "backup"
  },
  {
    "area_id": null,
    "device_id": "3c608d14afaa97bf113a32eef969c850",
    "disabled_by": null,
    "entity_id": "sensor.backup_next_scheduled_automatic_backup",
    "hidden_by": null,
    "name": null,
    "original_name": "Next scheduled automatic backup",
    "platform": "backup"
  },
  {
    "area_id": null,
    "device_id": "3c608d14afaa97bf113a32eef969c850",
    "disabled_by": null,
    "entity_id": "sensor.backup_last_successful_automatic_backup",
    "hidden_by": null,
    "name": null,
    "original_name": "Last successful automatic backup",
    "platform": "backup"
  },
  {
    "area_id": null,
    "device_id": "3c608d14afaa97bf113a32eef969c850",
    "disabled_by": null,
    "entity_id": "sensor.backup_last_attempted_automatic_backup",
    "hidden_by": null,
    "name": null,
    "original_name": "Last attempted automatic backup",
    "platform": "backup"
  },
  {
    "area_id": null,
    "device_id": null,
    "disabled_by": null,
    "entity_id": "person.jeffffff",
    "hidden_by": null,
    "name": null,
    "original_name": "Jeff",
    "platform": "person"
  },
  {
    "area_id": null,
    "device_id": null,
    "disabled_by": null,
    "entity_id": "todo.shopping_list",
    "hidden_by": null,
    "name": null,
    "original_name": "Shopping List",
    "platform": "shopping_list"
  },
  {
    "area_id": null,
    "device_id": null,
    "disabled_by": null,
    "entity_id": "tts.google_translate_en_com",
    "hidden_by": null,
    "name": null,
    "original_name": "Google Translate en com",
    "platform": "google_translate"
  },
  {
    "area_id": null,
    "device_id": "38f2f9e968d284138312ff4dafd8961d",
    "disabled_by": null,
    "entity_id": "weather.forecast_home",
    "hidden_by": null,
    "name": null,
    "original_name": "Home",
    "platform": "met"
  },
  {
    "area_id": null,
    "device_id": "4ffe60a6382ee637e98da4868aeca8e1",
    "disabled_by": null,
    "entity_id": "device_tracker.iphone_16pro_max",
    "hidden_by": null,
    "name": null,
    "original_name": "iPhone 16Pro Max ",
    "platform": "mobile_app"
  },
  {
    "area_id": null,
    "device_id": "4ffe60a6382ee637e98da4868aeca8e1",
    "disabled_by": null,
    "entity_id": "sensor.iphone_16pro_max_activity",
    "hidden_by": null,
    "name": null,
    "original_name": "iPhone 16Pro Max  Activity",
    "platform": "mobile_app"
  },
  {
    "area_id": null,
    "device_id": "4ffe60a6382ee637e98da4868aeca8e1",
    "disabled_by": null,
    "entity_id": "sensor.iphone_16pro_max_distance",
    "hidden_by": null,
    "name": null,
    "original_name": "iPhone 16Pro Max  Distance",
    "platform": "mobile_app"
  },
  {
    "area_id": null,
    "device_id": "4ffe60a6382ee637e98da4868aeca8e1",
    "disabled_by": null,
    "entity_id": "sensor.iphone_16pro_max_floors_ascended",
    "hidden_by": null,
    "name": null,
    "original_name": "iPhone 16Pro Max  Floors Ascended",
    "platform": "mobile_app"
  },
  {
    "area_id": null,
    "device_id": "4ffe60a6382ee637e98da4868aeca8e1",
    "disabled_by": null,
    "entity_id": "sensor.iphone_16pro_max_floors_descended",
    "hidden_by": null,
    "name": null,
    "original_name": "iPhone 16Pro Max  Floors Descended",
    "platform": "mobile_app"
  },
  {
    "area_id": null,
    "device_id": "4ffe60a6382ee637e98da4868aeca8e1",
    "disabled_by": null,
    "entity_id": "sensor.iphone_16pro_max_battery_state",
    "hidden_by": null,
    "name": null,
    "original_name": "iPhone 16Pro Max  Battery State",
    "platform": "mobile_app"
  },
  {
    "area_id": null,
    "device_id": "4ffe60a6382ee637e98da4868aeca8e1",
    "disabled_by": null,
    "entity_id": "sensor.iphone_16pro_max_storage",
    "hidden_by": null,
    "name": null,
    "original_name": "iPhone 16Pro Max  Storage",
    "platform": "mobile_app"
  },
  {
    "area_id": null,
    "device_id": "4ffe60a6382ee637e98da4868aeca8e1",
    "disabled_by": null,
    "entity_id": "sensor.iphone_16pro_max_ssid",
    "hidden_by": null,
    "name": null,
    "original_name": "iPhone 16Pro Max  SSID",
    "platform": "mobile_app"
  },
  {
    "area_id": null,
    "device_id": "4ffe60a6382ee637e98da4868aeca8e1",
    "disabled_by": null,
    "entity_id": "sensor.iphone_16pro_max_bssid",
    "hidden_by": null,
    "name": null,
    "original_name": "iPhone 16Pro Max  BSSID",
    "platform": "mobile_app"
  },
  {
    "area_id": null,
    "device_id": "4ffe60a6382ee637e98da4868aeca8e1",
    "disabled_by": null,
    "entity_id": "sensor.iphone_16pro_max_connection_type",
    "hidden_by": null,
    "name": null,
    "original_name": "iPhone 16Pro Max  Connection Type",
    "platform": "mobile_app"
  },
  {
    "area_id": null,
    "device_id": "4ffe60a6382ee637e98da4868aeca8e1",
    "disabled_by": null,
    "entity_id": "sensor.iphone_16pro_max_sim_2",
    "hidden_by": null,
    "name": null,
    "original_name": "iPhone 16Pro Max  SIM 2",
    "platform": "mobile_app"
  },
  {
    "area_id": null,
    "device_id": "4ffe60a6382ee637e98da4868aeca8e1",
    "disabled_by": null,
    "entity_id": "sensor.iphone_16pro_max_sim_1",
    "hidden_by": null,
    "name": null,
    "original_name": "iPhone 16Pro Max  SIM 1",
    "platform": "mobile_app"
  },
  {
    "area_id": null,
    "device_id": "4ffe60a6382ee637e98da4868aeca8e1",
    "disabled_by": null,
    "entity_id": "sensor.iphone_16pro_max_geocoded_location",
    "hidden_by": null,
    "name": null,
    "original_name": "iPhone 16Pro Max  Geocoded Location",
    "platform": "mobile_app"
  },
  {
    "area_id": null,
    "device_id": "4ffe60a6382ee637e98da4868aeca8e1",
    "disabled_by": null,
    "entity_id": "binary_sensor.iphone_16pro_max_focus",
    "hidden_by": null,
    "name": null,
    "original_name": "iPhone 16Pro Max  Focus",
    "platform": "mobile_app"
  },
  {
    "area_id": null,
    "device_id": "4ffe60a6382ee637e98da4868aeca8e1",
    "disabled_by": null,
    "entity_id": "sensor.iphone_16pro_max_last_update_trigger",
    "hidden_by": null,
    "name": null,
    "original_name": "iPhone 16Pro Max  Last Update Trigger",
    "platform": "mobile_app"
  },
  {
    "area_id": null,
    "device_id": "4ffe60a6382ee637e98da4868aeca8e1",
    "disabled_by": null,
    "entity_id": "sensor.iphone_16pro_max_app_version",
    "hidden_by": null,
    "name": null,
    "original_name": "iPhone 16Pro Max  App Version",
    "platform": "mobile_app"
  },
  {
    "area_id": null,
    "device_id": "4ffe60a6382ee637e98da4868aeca8e1",
    "disabled_by": null,
    "entity_id": "sensor.iphone_16pro_max_location_permission",
    "hidden_by": null,
    "name": null,
    "original_name": "iPhone 16Pro Max  Location permission",
    "platform": "mobile_app"
  },
  {
    "area_id": null,
    "device_id": "4ffe60a6382ee637e98da4868aeca8e1",
    "disabled_by": null,
    "entity_id": "sensor.iphone_16pro_max_audio_output",
    "hidden_by": null,
    "name": null,
    "original_name": "iPhone 16Pro Max  Audio Output",
    "platform": "mobile_app"
  },
  {
    "area_id": null,
    "device_id": "4ffe60a6382ee637e98da4868aeca8e1",
    "disabled_by": null,
    "entity_id": "sensor.iphone_16pro_max_battery_level",
    "hidden_by": null,
    "name": null,
    "original_name": "iPhone 16Pro Max  Battery Level",
    "platform": "mobile_app"
  },
  {
    "area_id": null,
    "device_id": "4ffe60a6382ee637e98da4868aeca8e1",
    "disabled_by": null,
    "entity_id": "sensor.iphone_16pro_max_steps",
    "hidden_by": null,
    "name": null,
    "original_name": "iPhone 16Pro Max  Steps",
    "platform": "mobile_app"
  },
  {
    "area_id": null,
    "device_id": "652c8cbed207e4d069bdaa8bdcf93e52",
    "disabled_by": null,
    "entity_id": "device_tracker.macbook_air",
    "hidden_by": null,
    "name": null,
    "original_name": "MacBook Air ",
    "platform": "mobile_app"
  },
  {
    "area_id": null,
    "device_id": "652c8cbed207e4d069bdaa8bdcf93e52",
    "disabled_by": null,
    "entity_id": "sensor.macbook_air_internal_battery_level",
    "hidden_by": null,
    "name": null,
    "original_name": "MacBook Air  Internal Battery Level",
    "platform": "mobile_app"
  },
  {
    "area_id": null,
    "device_id": "652c8cbed207e4d069bdaa8bdcf93e52",
    "disabled_by": null,
    "entity_id": "sensor.macbook_air_storage",
    "hidden_by": null,
    "name": null,
    "original_name": "MacBook Air  Storage",
    "platform": "mobile_app"
  },
  {
    "area_id": null,
    "device_id": "652c8cbed207e4d069bdaa8bdcf93e52",
    "disabled_by": null,
    "entity_id": "sensor.macbook_air_internal_battery_state",
    "hidden_by": null,
    "name": null,
    "original_name": "MacBook Air  Internal Battery State",
    "platform": "mobile_app"
  },
  {
    "area_id": null,
    "device_id": "652c8cbed207e4d069bdaa8bdcf93e52",
    "disabled_by": null,
    "entity_id": "sensor.macbook_air_bssid",
    "hidden_by": null,
    "name": null,
    "original_name": "MacBook Air  BSSID",
    "platform": "mobile_app"
  },
  {
    "area_id": null,
    "device_id": "652c8cbed207e4d069bdaa8bdcf93e52",
    "disabled_by": null,
    "entity_id": "sensor.macbook_air_ssid",
    "hidden_by": null,
    "name": null,
    "original_name": "MacBook Air  SSID",
    "platform": "mobile_app"
  },
  {
    "area_id": null,
    "device_id": "652c8cbed207e4d069bdaa8bdcf93e52",
    "disabled_by": null,
    "entity_id": "sensor.macbook_air_connection_type",
    "hidden_by": null,
    "name": null,
    "original_name": "MacBook Air  Connection Type",
    "platform": "mobile_app"
  },
  {
    "area_id": null,
    "device_id": "652c8cbed207e4d069bdaa8bdcf93e52",
    "disabled_by": null,
    "entity_id": "sensor.macbook_air_geocoded_location",
    "hidden_by": null,
    "name": null,
    "original_name": "MacBook Air  Geocoded Location",
    "platform": "mobile_app"
  },
  {
    "area_id": null,
    "device_id": "652c8cbed207e4d069bdaa8bdcf93e52",
    "disabled_by": null,
    "entity_id": "sensor.macbook_air_active_camera",
    "hidden_by": null,
    "name": null,
    "original_name": "MacBook Air  Active Camera",
    "platform": "mobile_app"
  },
  {
    "area_id": null,
    "device_id": "652c8cbed207e4d069bdaa8bdcf93e52",
    "disabled_by": null,
    "entity_id": "binary_sensor.macbook_air_camera_in_use",
    "hidden_by": null,
    "name": null,
    "original_name": "MacBook Air  Camera In Use",
    "platform": "mobile_app"
  },
  {
    "area_id": null,
    "device_id": "652c8cbed207e4d069bdaa8bdcf93e52",
    "disabled_by": null,
    "entity_id": "binary_sensor.macbook_air_audio_input_in_use",
    "hidden_by": null,
    "name": null,
    "original_name": "MacBook Air  Audio Input In Use",
    "platform": "mobile_app"
  },
  {
    "area_id": null,
    "device_id": "652c8cbed207e4d069bdaa8bdcf93e52",
    "disabled_by": null,
    "entity_id": "sensor.macbook_air_active_audio_output",
    "hidden_by": null,
    "name": null,
    "original_name": "MacBook Air  Active Audio Output",
    "platform": "mobile_app"
  },
  {
    "area_id": null,
    "device_id": "652c8cbed207e4d069bdaa8bdcf93e52",
    "disabled_by": null,
    "entity_id": "sensor.macbook_air_active_audio_input",
    "hidden_by": null,
    "name": null,
    "original_name": "MacBook Air  Active Audio Input",
    "platform": "mobile_app"
  },
  {
    "area_id": null,
    "device_id": "652c8cbed207e4d069bdaa8bdcf93e52",
    "disabled_by": null,
    "entity_id": "binary_sensor.macbook_air_audio_output_in_use",
    "hidden_by": null,
    "name": null,
    "original_name": "MacBook Air  Audio Output In Use",
    "platform": "mobile_app"
  },
  {
    "area_id": null,
    "device_id": "652c8cbed207e4d069bdaa8bdcf93e52",
    "disabled_by": null,
    "entity_id": "sensor.macbook_air_displays",
    "hidden_by": null,
    "name": null,
    "original_name": "MacBook Air  Displays",
    "platform": "mobile_app"
  },
  {
    "area_id": null,
    "device_id": "652c8cbed207e4d069bdaa8bdcf93e52",
    "disabled_by": null,
    "entity_id": "sensor.macbook_air_primary_display_name",
    "hidden_by": null,
    "name": null,
    "original_name": "MacBook Air  Primary Display Name",
    "platform": "mobile_app"
  },
  {
    "area_id": null,
    "device_id": "652c8cbed207e4d069bdaa8bdcf93e52",
    "disabled_by": null,
    "entity_id": "sensor.macbook_air_primary_display_id",
    "hidden_by": null,
    "name": null,
    "original_name": "MacBook Air  Primary Display ID",
    "platform": "mobile_app"
  },
  {
    "area_id": null,
    "device_id": "652c8cbed207e4d069bdaa8bdcf93e52",
    "disabled_by": null,
    "entity_id": "binary_sensor.macbook_air_active",
    "hidden_by": null,
    "name": null,
    "original_name": "MacBook Air  Active",
    "platform": "mobile_app"
  },
  {
    "area_id": null,
    "device_id": "652c8cbed207e4d069bdaa8bdcf93e52",
    "disabled_by": null,
    "entity_id": "sensor.macbook_air_frontmost_app",
    "hidden_by": null,
    "name": null,
    "original_name": "MacBook Air  Frontmost App",
    "platform": "mobile_app"
  },
  {
    "area_id": null,
    "device_id": "652c8cbed207e4d069bdaa8bdcf93e52",
    "disabled_by": null,
    "entity_id": "sensor.macbook_air_last_update_trigger",
    "hidden_by": null,
    "name": null,
    "original_name": "MacBook Air  Last Update Trigger",
    "platform": "mobile_app"
  },
  {
    "area_id": null,
    "device_id": "652c8cbed207e4d069bdaa8bdcf93e52",
    "disabled_by": null,
    "entity_id": "sensor.macbook_air_app_version",
    "hidden_by": null,
    "name": null,
    "original_name": "MacBook Air  App Version",
    "platform": "mobile_app"
  },
  {
    "area_id": null,
    "device_id": "652c8cbed207e4d069bdaa8bdcf93e52",
    "disabled_by": null,
    "entity_id": "sensor.macbook_air_location_permission",
    "hidden_by": null,
    "name": null,
    "original_name": "MacBook Air  Location permission",
    "platform": "mobile_app"
  },
  {
    "area_id": null,
    "device_id": "652c8cbed207e4d069bdaa8bdcf93e52",
    "disabled_by": null,
    "entity_id": "sensor.macbook_air_audio_output",
    "hidden_by": null,
    "name": null,
    "original_name": "MacBook Air  Audio Output",
    "platform": "mobile_app"
  },
  {
    "area_id": null,
    "device_id": null,
    "disabled_by": null,
    "entity_id": "binary_sensor.remote_ui",
    "hidden_by": null,
    "name": null,
    "original_name": "Remote UI",
    "platform": "cloud"
  },
  {
    "area_id": null,
    "device_id": null,
    "disabled_by": null,
    "entity_id": "stt.home_assistant_cloud",
    "hidden_by": null,
    "name": null,
    "original_name": "Home Assistant Cloud",
    "platform": "cloud"
  },
  {
    "area_id": null,
    "device_id": null,
    "disabled_by": null,
    "entity_id": "tts.home_assistant_cloud",
    "hidden_by": null,
    "name": null,
    "original_name": "Home Assistant Cloud",
    "platform": "cloud"
  },
  {
    "area_id": null,
    "device_id": "4ffe60a6382ee637e98da4868aeca8e1",
    "disabled_by": null,
    "entity_id": "sensor.iphone_16pro_max_average_active_pace",
    "hidden_by": null,
    "name": null,
    "original_name": "iPhone 16Pro Max  Average Active Pace",
    "platform": "mobile_app"
  },
  {
    "area_id": null,
    "device_id": "f30934f854f8d5d86ff183095961de55",
    "disabled_by": "integration",
    "entity_id": "sensor.withings_breathing_disturbances_intensity",
    "hidden_by": null,
    "name": null,
    "original_name": "Breathing disturbances intensity",
    "platform": "withings"
  },
  {
    "area_id": null,
    "device_id": "f30934f854f8d5d86ff183095961de55",
    "disabled_by": null,
    "entity_id": "sensor.withings_deep_sleep",
    "hidden_by": null,
    "name": null,
    "original_name": "Deep sleep",
    "platform": "withings"
  },
  {
    "area_id": null,
    "device_id": "f30934f854f8d5d86ff183095961de55",
    "disabled_by": null,
    "entity_id": "sensor.withings_time_to_sleep",
    "hidden_by": null,
    "name": null,
    "original_name": "Time to sleep",
    "platform": "withings"
  },
  {
    "area_id": null,
    "device_id": "f30934f854f8d5d86ff183095961de55",
    "disabled_by": null,
    "entity_id": "sensor.withings_time_to_wakeup",
    "hidden_by": null,
    "name": null,
    "original_name": "Time to wakeup",
    "platform": "withings"
  },
  {
    "area_id": null,
    "device_id": "f30934f854f8d5d86ff183095961de55",
    "disabled_by": "integration",
    "entity_id": "sensor.withings_average_heart_rate",
    "hidden_by": null,
    "name": null,
    "original_name": "Average heart rate",
    "platform": "withings"
  },
  {
    "area_id": null,
    "device_id": "f30934f854f8d5d86ff183095961de55",
    "disabled_by": null,
    "entity_id": "sensor.withings_maximum_heart_rate",
    "hidden_by": null,
    "name": null,
    "original_name": "Maximum heart rate",
    "platform": "withings"
  },
  {
    "area_id": null,
    "device_id": "f30934f854f8d5d86ff183095961de55",
    "disabled_by": "integration",
    "entity_id": "sensor.withings_minimum_heart_rate",
    "hidden_by": null,
    "name": null,
    "original_name": "Minimum heart rate",
    "platform": "withings"
  },
  {
    "area_id": null,
    "device_id": "f30934f854f8d5d86ff183095961de55",
    "disabled_by": null,
    "entity_id": "sensor.withings_light_sleep",
    "hidden_by": null,
    "name": null,
    "original_name": "Light sleep",
    "platform": "withings"
  },
  {
    "area_id": null,
    "device_id": "f30934f854f8d5d86ff183095961de55",
    "disabled_by": null,
    "entity_id": "sensor.withings_rem_sleep",
    "hidden_by": null,
    "name": null,
    "original_name": "REM sleep",
    "platform": "withings"
  },
  {
    "area_id": null,
    "device_id": "f30934f854f8d5d86ff183095961de55",
    "disabled_by": "integration",
    "entity_id": "sensor.withings_average_respiratory_rate",
    "hidden_by": null,
    "name": null,
    "original_name": "Average respiratory rate",
    "platform": "withings"
  },
  {
    "area_id": null,
    "device_id": "f30934f854f8d5d86ff183095961de55",
    "disabled_by": "integration",
    "entity_id": "sensor.withings_maximum_respiratory_rate",
    "hidden_by": null,
    "name": null,
    "original_name": "Maximum respiratory rate",
    "platform": "withings"
  },
  {
    "area_id": null,
    "device_id": "f30934f854f8d5d86ff183095961de55",
    "disabled_by": "integration",
    "entity_id": "sensor.withings_minimum_respiratory_rate",
    "hidden_by": null,
    "name": null,
    "original_name": "Minimum respiratory rate",
    "platform": "withings"
  },
  {
    "area_id": null,
    "device_id": "f30934f854f8d5d86ff183095961de55",
    "disabled_by": null,
    "entity_id": "sensor.withings_sleep_score",
    "hidden_by": null,
    "name": null,
    "original_name": "Sleep score",
    "platform": "withings"
  },
  {
    "area_id": null,
    "device_id": "f30934f854f8d5d86ff183095961de55",
    "disabled_by": null,
    "entity_id": "sensor.withings_snoring",
    "hidden_by": null,
    "name": null,
    "original_name": "Snoring",
    "platform": "withings"
  },
  {
    "area_id": null,
    "device_id": "f30934f854f8d5d86ff183095961de55",
    "disabled_by": "integration",
    "entity_id": "sensor.withings_snoring_episode_count",
    "hidden_by": null,
    "name": null,
    "original_name": "Snoring episode count",
    "platform": "withings"
  },
  {
    "area_id": null,
    "device_id": "f30934f854f8d5d86ff183095961de55",
    "disabled_by": null,
    "entity_id": "sensor.withings_wakeup_count",
    "hidden_by": null,
    "name": null,
    "original_name": "Wakeup count",
    "platform": "withings"
  },
  {
    "area_id": null,
    "device_id": "f30934f854f8d5d86ff183095961de55",
    "disabled_by": null,
    "entity_id": "sensor.withings_wakeup_time",
    "hidden_by": null,
    "name": null,
    "original_name": "Wakeup time",
    "platform": "withings"
  },
  {
    "area_id": null,
    "device_id": "f30934f854f8d5d86ff183095961de55",
    "disabled_by": "user",
    "entity_id": "sensor.withings_steps_today",
    "hidden_by": null,
    "name": null,
    "original_name": "Steps today",
    "platform": "withings"
  },
  {
    "area_id": null,
    "device_id": "f30934f854f8d5d86ff183095961de55",
    "disabled_by": "user",
    "entity_id": "sensor.withings_distance_travelled_today",
    "hidden_by": null,
    "name": null,
    "original_name": "Distance travelled today",
    "platform": "withings"
  },
  {
    "area_id": null,
    "device_id": "f30934f854f8d5d86ff183095961de55",
    "disabled_by": "user",
    "entity_id": "sensor.withings_elevation_change_today",
    "hidden_by": null,
    "name": null,
    "original_name": "Elevation change today",
    "platform": "withings"
  },
  {
    "area_id": null,
    "device_id": "f30934f854f8d5d86ff183095961de55",
    "disabled_by": "integration",
    "entity_id": "sensor.withings_soft_activity_today",
    "hidden_by": null,
    "name": null,
    "original_name": "Soft activity today",
    "platform": "withings"
  },
  {
    "area_id": null,
    "device_id": "f30934f854f8d5d86ff183095961de55",
    "disabled_by": "integration",
    "entity_id": "sensor.withings_moderate_activity_today",
    "hidden_by": null,
    "name": null,
    "original_name": "Moderate activity today",
    "platform": "withings"
  },
  {
    "area_id": null,
    "device_id": "f30934f854f8d5d86ff183095961de55",
    "disabled_by": "integration",
    "entity_id": "sensor.withings_intense_activity_today",
    "hidden_by": null,
    "name": null,
    "original_name": "Intense activity today",
    "platform": "withings"
  },
  {
    "area_id": null,
    "device_id": "f30934f854f8d5d86ff183095961de55",
    "disabled_by": "user",
    "entity_id": "sensor.withings_active_time_today",
    "hidden_by": null,
    "name": null,
    "original_name": "Active time today",
    "platform": "withings"
  },
  {
    "area_id": null,
    "device_id": "f30934f854f8d5d86ff183095961de55",
    "disabled_by": "user",
    "entity_id": "sensor.withings_active_calories_burnt_today",
    "hidden_by": null,
    "name": null,
    "original_name": "Active calories burnt today",
    "platform": "withings"
  },
  {
    "area_id": null,
    "device_id": "f30934f854f8d5d86ff183095961de55",
    "disabled_by": "user",
    "entity_id": "sensor.withings_total_calories_burnt_today",
    "hidden_by": null,
    "name": null,
    "original_name": "Total calories burnt today",
    "platform": "withings"
  },
  {
    "area_id": null,
    "device_id": "f30934f854f8d5d86ff183095961de55",
    "disabled_by": null,
    "entity_id": "binary_sensor.withings_in_bed",
    "hidden_by": null,
    "name": null,
    "original_name": "In bed",
    "platform": "withings"
  },
  {
    "area_id": null,
    "device_id": "a2e81a41c2ee0a9e1daec770ead9da75",
    "disabled_by": null,
    "entity_id": "device_tracker.iphone_17_pro_max",
    "hidden_by": null,
    "name": null,
    "original_name": "Jeff\u2019s iPhone",
    "platform": "mobile_app"
  },
  {
    "area_id": null,
    "device_id": "93101baa2aef650396ea126fd61765af",
    "disabled_by": null,
    "entity_id": "device_tracker.ipad_pro",
    "hidden_by": null,
    "name": null,
    "original_name": "Jeff\u2019s iPad",
    "platform": "mobile_app"
  },
  {
    "area_id": null,
    "device_id": "12b333bc773ab0d1bc7c261a26743962",
    "disabled_by": null,
    "entity_id": "media_player.core_lounge_homepod",
    "hidden_by": null,
    "name": null,
    "original_name": null,
    "platform": "apple_tv"
  },
  {
    "area_id": null,
    "device_id": "12b333bc773ab0d1bc7c261a26743962",
    "disabled_by": null,
    "entity_id": "remote.core_lounge_homepod",
    "hidden_by": null,
    "name": null,
    "original_name": null,
    "platform": "apple_tv"
  },
  {
    "area_id": null,
    "device_id": "4a2969bba349c62c3ae8ed2a0139f3ff",
    "disabled_by": null,
    "entity_id": "media_player.core_lounge_homepod_2",
    "hidden_by": null,
    "name": null,
    "original_name": null,
    "platform": "apple_tv"
  },
  {
    "area_id": null,
    "device_id": "4a2969bba349c62c3ae8ed2a0139f3ff",
    "disabled_by": null,
    "entity_id": "remote.core_lounge_homepod_2",
    "hidden_by": null,
    "name": null,
    "original_name": null,
    "platform": "apple_tv"
  },
  {
    "area_id": null,
    "device_id": "93101baa2aef650396ea126fd61765af",
    "disabled_by": null,
    "entity_id": "sensor.jeffs_ipad_battery_state",
    "hidden_by": null,
    "name": null,
    "original_name": "Jeff\u2019s iPad Battery State",
    "platform": "mobile_app"
  },
  {
    "area_id": null,
    "device_id": "93101baa2aef650396ea126fd61765af",
    "disabled_by": null,
    "entity_id": "sensor.jeffs_ipad_storage",
    "hidden_by": null,
    "name": null,
    "original_name": "Jeff\u2019s iPad Storage",
    "platform": "mobile_app"
  },
  {
    "area_id": null,
    "device_id": "93101baa2aef650396ea126fd61765af",
    "disabled_by": null,
    "entity_id": "sensor.jeffs_ipad_geocoded_location",
    "hidden_by": null,
    "name": null,
    "original_name": "Jeff\u2019s iPad Geocoded Location",
    "platform": "mobile_app"
  },
  {
    "area_id": null,
    "device_id": "93101baa2aef650396ea126fd61765af",
    "disabled_by": null,
    "entity_id": "sensor.jeffs_ipad_battery_level",
    "hidden_by": null,
    "name": null,
    "original_name": "Jeff\u2019s iPad Battery Level",
    "platform": "mobile_app"
  },
  {
    "area_id": null,
    "device_id": "93101baa2aef650396ea126fd61765af",
    "disabled_by": null,
    "entity_id": "sensor.jeffs_ipad_last_update_trigger",
    "hidden_by": null,
    "name": null,
    "original_name": "Jeff\u2019s iPad Last Update Trigger",
    "platform": "mobile_app"
  },
  {
    "area_id": null,
    "device_id": "93101baa2aef650396ea126fd61765af",
    "disabled_by": null,
    "entity_id": "sensor.jeffs_ipad_app_version",
    "hidden_by": null,
    "name": null,
    "original_name": "Jeff\u2019s iPad App Version",
    "platform": "mobile_app"
  },
  {
    "area_id": null,
    "device_id": "93101baa2aef650396ea126fd61765af",
    "disabled_by": null,
    "entity_id": "sensor.jeffs_ipad_ssid",
    "hidden_by": null,
    "name": null,
    "original_name": "Jeff\u2019s iPad SSID",
    "platform": "mobile_app"
  },
  {
    "area_id": null,
    "device_id": "93101baa2aef650396ea126fd61765af",
    "disabled_by": null,
    "entity_id": "sensor.jeffs_ipad_connection_type",
    "hidden_by": null,
    "name": null,
    "original_name": "Jeff\u2019s iPad Connection Type",
    "platform": "mobile_app"
  },
  {
    "area_id": null,
    "device_id": "93101baa2aef650396ea126fd61765af",
    "disabled_by": null,
    "entity_id": "sensor.jeffs_ipad_bssid",
    "hidden_by": null,
    "name": null,
    "original_name": "Jeff\u2019s iPad BSSID",
    "platform": "mobile_app"
  },
  {
    "area_id": null,
    "device_id": "93101baa2aef650396ea126fd61765af",
    "disabled_by": null,
    "entity_id": "sensor.jeffs_ipad_location_permission",
    "hidden_by": null,
    "name": null,
    "original_name": "Jeff\u2019s iPad Location permission",
    "platform": "mobile_app"
  },
  {
    "area_id": null,
    "device_id": "93101baa2aef650396ea126fd61765af",
    "disabled_by": null,
    "entity_id": "sensor.jeffs_ipad_audio_output",
    "hidden_by": null,
    "name": null,
    "original_name": "Jeff\u2019s iPad Audio Output",
    "platform": "mobile_app"
  },
  {
    "area_id": null,
    "device_id": null,
    "disabled_by": null,
    "entity_id": "input_boolean.test_mode",
    "hidden_by": null,
    "name": null,
    "original_name": "Test Mode",
    "platform": "input_boolean"
  },
  {
    "area_id": null,
    "device_id": "2f4611589743ae3b7fbd280c7f611782",
    "disabled_by": null,
    "entity_id": "media_player.orange_homepod_mini",
    "hidden_by": null,
    "name": null,
    "original_name": null,
    "platform": "apple_tv"
  },
  {
    "area_id": null,
    "device_id": "2f4611589743ae3b7fbd280c7f611782",
    "disabled_by": null,
    "entity_id": "remote.orange_homepod_mini",
    "hidden_by": null,
    "name": null,
    "original_name": null,
    "platform": "apple_tv"
  },
  {
    "area_id": null,
    "device_id": "c6dca7bee9771780c1d8225014c04fb1",
    "disabled_by": null,
    "entity_id": "media_player.bedroom_display",
    "hidden_by": null,
    "name": null,
    "original_name": null,
    "platform": "cast"
  },
  {
    "area_id": null,
    "device_id": "612098715827acdd9ca11b9286e29057",
    "disabled_by": null,
    "entity_id": "media_player.lounge_apple_tv_wired",
    "hidden_by": null,
    "name": null,
    "original_name": null,
    "platform": "apple_tv"
  },
  {
    "area_id": null,
    "device_id": "612098715827acdd9ca11b9286e29057",
    "disabled_by": null,
    "entity_id": "remote.lounge_apple_tv_wired",
    "hidden_by": null,
    "name": null,
    "original_name": null,
    "platform": "apple_tv"
  },
  {
    "area_id": null,
    "device_id": "dc26045371744833233dc93dc63eb8bd",
    "disabled_by": null,
    "entity_id": "media_player.white_homepod_mini",
    "hidden_by": null,
    "name": null,
    "original_name": null,
    "platform": "apple_tv"
  },
  {
    "area_id": null,
    "device_id": "dc26045371744833233dc93dc63eb8bd",
    "disabled_by": null,
    "entity_id": "remote.white_homepod_mini",
    "hidden_by": null,
    "name": null,
    "original_name": null,
    "platform": "apple_tv"
  },
  {
    "area_id": null,
    "device_id": "298e8da3405ebce662aec90ec1c65a87",
    "disabled_by": null,
    "entity_id": "sensor.speedtest_ping",
    "hidden_by": null,
    "name": null,
    "original_name": "Ping",
    "platform": "speedtestdotnet"
  },
  {
    "area_id": null,
    "device_id": "298e8da3405ebce662aec90ec1c65a87",
    "disabled_by": null,
    "entity_id": "sensor.speedtest_download",
    "hidden_by": null,
    "name": null,
    "original_name": "Download",
    "platform": "speedtestdotnet"
  },
  {
    "area_id": null,
    "device_id": "298e8da3405ebce662aec90ec1c65a87",
    "disabled_by": null,
    "entity_id": "sensor.speedtest_upload",
    "hidden_by": null,
    "name": null,
    "original_name": "Upload",
    "platform": "speedtestdotnet"
  },
  {
    "area_id": null,
    "device_id": "acc4a38ba4cb4997f8ce1533f1d485e3",
    "disabled_by": null,
    "entity_id": "button.aqara_hub_m3_identify",
    "hidden_by": null,
    "name": null,
    "original_name": "Identify",
    "platform": "matter"
  },
  {
    "area_id": null,
    "device_id": "eaefa575e0142c1b997ad86338a1e36e",
    "disabled_by": null,
    "entity_id": "binary_sensor.aqara_vibration_sensor_occupancy",
    "hidden_by": null,
    "name": null,
    "original_name": "Occupancy",
    "platform": "matter"
  },
  {
    "area_id": null,
    "device_id": "eaefa575e0142c1b997ad86338a1e36e",
    "disabled_by": null,
    "entity_id": "button.aqara_vibration_sensor_identify",
    "hidden_by": null,
    "name": null,
    "original_name": "Identify",
    "platform": "matter"
  },
  {
    "area_id": null,
    "device_id": "eaefa575e0142c1b997ad86338a1e36e",
    "disabled_by": null,
    "entity_id": "sensor.aqara_vibration_sensor_battery",
    "hidden_by": null,
    "name": null,
    "original_name": "Battery",
    "platform": "matter"
  },
  {
    "area_id": null,
    "device_id": "eaefa575e0142c1b997ad86338a1e36e",
    "disabled_by": null,
    "entity_id": "sensor.aqara_vibration_sensor_battery_voltage",
    "hidden_by": null,
    "name": null,
    "original_name": "Battery voltage",
    "platform": "matter"
  },
  {
    "area_id": null,
    "device_id": "eaefa575e0142c1b997ad86338a1e36e",
    "disabled_by": null,
    "entity_id": "sensor.aqara_vibration_sensor_battery_type",
    "hidden_by": null,
    "name": null,
    "original_name": "Battery type",
    "platform": "matter"
  },
  {
    "area_id": null,
    "device_id": "880b2d33ed5a8a7f7f00c30568e2f664",
    "disabled_by": null,
    "entity_id": "binary_sensor.aqara_door_and_window_sensor_door",
    "hidden_by": null,
    "name": null,
    "original_name": "Door",
    "platform": "matter"
  },
  {
    "area_id": null,
    "device_id": "880b2d33ed5a8a7f7f00c30568e2f664",
    "disabled_by": null,
    "entity_id": "button.aqara_door_and_window_sensor_identify",
    "hidden_by": null,
    "name": null,
    "original_name": "Identify",
    "platform": "matter"
  },
  {
    "area_id": null,
    "device_id": "880b2d33ed5a8a7f7f00c30568e2f664",
    "disabled_by": null,
    "entity_id": "sensor.aqara_door_and_window_sensor_battery",
    "hidden_by": null,
    "name": null,
    "original_name": "Battery",
    "platform": "matter"
  },
  {
    "area_id": null,
    "device_id": "880b2d33ed5a8a7f7f00c30568e2f664",
    "disabled_by": null,
    "entity_id": "sensor.aqara_door_and_window_sensor_battery_voltage",
    "hidden_by": null,
    "name": null,
    "original_name": "Battery voltage",
    "platform": "matter"
  },
  {
    "area_id": null,
    "device_id": "880b2d33ed5a8a7f7f00c30568e2f664",
    "disabled_by": null,
    "entity_id": "sensor.aqara_door_and_window_sensor_battery_type",
    "hidden_by": null,
    "name": null,
    "original_name": "Battery type",
    "platform": "matter"
  },
  {
    "area_id": null,
    "device_id": "55707b23ebbe9e56dac212af4d16e418",
    "disabled_by": null,
    "entity_id": "binary_sensor.aqara_door_and_window_sensor_door_2",
    "hidden_by": null,
    "name": null,
    "original_name": "Door",
    "platform": "matter"
  },
  {
    "area_id": null,
    "device_id": "55707b23ebbe9e56dac212af4d16e418",
    "disabled_by": null,
    "entity_id": "button.aqara_door_and_window_sensor_identify_2",
    "hidden_by": null,
    "name": null,
    "original_name": "Identify",
    "platform": "matter"
  },
  {
    "area_id": null,
    "device_id": "55707b23ebbe9e56dac212af4d16e418",
    "disabled_by": null,
    "entity_id": "sensor.aqara_door_and_window_sensor_battery_2",
    "hidden_by": null,
    "name": null,
    "original_name": "Battery",
    "platform": "matter"
  },
  {
    "area_id": null,
    "device_id": "55707b23ebbe9e56dac212af4d16e418",
    "disabled_by": null,
    "entity_id": "sensor.aqara_door_and_window_sensor_battery_voltage_2",
    "hidden_by": null,
    "name": null,
    "original_name": "Battery voltage",
    "platform": "matter"
  },
  {
    "area_id": null,
    "device_id": "55707b23ebbe9e56dac212af4d16e418",
    "disabled_by": null,
    "entity_id": "sensor.aqara_door_and_window_sensor_battery_type_2",
    "hidden_by": null,
    "name": null,
    "original_name": "Battery type",
    "platform": "matter"
  },
  {
    "area_id": null,
    "device_id": "0cd6f6ad32a2c0b7c938478dc91b1347",
    "disabled_by": null,
    "entity_id": "binary_sensor.aqara_door_and_window_sensor_door_3",
    "hidden_by": null,
    "name": null,
    "original_name": "Door",
    "platform": "matter"
  },
  {
    "area_id": null,
    "device_id": "0cd6f6ad32a2c0b7c938478dc91b1347",
    "disabled_by": null,
    "entity_id": "button.aqara_door_and_window_sensor_identify_3",
    "hidden_by": null,
    "name": null,
    "original_name": "Identify",
    "platform": "matter"
  },
  {
    "area_id": null,
    "device_id": "0cd6f6ad32a2c0b7c938478dc91b1347",
    "disabled_by": null,
    "entity_id": "sensor.aqara_door_and_window_sensor_battery_3",
    "hidden_by": null,
    "name": null,
    "original_name": "Battery",
    "platform": "matter"
  },
  {
    "area_id": null,
    "device_id": "0cd6f6ad32a2c0b7c938478dc91b1347",
    "disabled_by": null,
    "entity_id": "sensor.aqara_door_and_window_sensor_battery_voltage_3",
    "hidden_by": null,
    "name": null,
    "original_name": "Battery voltage",
    "platform": "matter"
  },
  {
    "area_id": null,
    "device_id": "0cd6f6ad32a2c0b7c938478dc91b1347",
    "disabled_by": null,
    "entity_id": "sensor.aqara_door_and_window_sensor_battery_type_3",
    "hidden_by": null,
    "name": null,
    "original_name": "Battery type",
    "platform": "matter"
  },
  {
    "area_id": null,
    "device_id": "92e1843e781f34e8bcc13aa84f423eb9",
    "disabled_by": null,
    "entity_id": "binary_sensor.aqara_door_and_window_sensor_door_4",
    "hidden_by": null,
    "name": null,
    "original_name": "Door",
    "platform": "matter"
  },
  {
    "area_id": null,
    "device_id": "92e1843e781f34e8bcc13aa84f423eb9",
    "disabled_by": null,
    "entity_id": "button.aqara_door_and_window_sensor_identify_4",
    "hidden_by": null,
    "name": null,
    "original_name": "Identify",
    "platform": "matter"
  },
  {
    "area_id": null,
    "device_id": "92e1843e781f34e8bcc13aa84f423eb9",
    "disabled_by": null,
    "entity_id": "sensor.aqara_door_and_window_sensor_battery_4",
    "hidden_by": null,
    "name": null,
    "original_name": "Battery",
    "platform": "matter"
  },
  {
    "area_id": null,
    "device_id": "92e1843e781f34e8bcc13aa84f423eb9",
    "disabled_by": null,
    "entity_id": "sensor.aqara_door_and_window_sensor_battery_voltage_4",
    "hidden_by": null,
    "name": null,
    "original_name": "Battery voltage",
    "platform": "matter"
  },
  {
    "area_id": null,
    "device_id": "92e1843e781f34e8bcc13aa84f423eb9",
    "disabled_by": null,
    "entity_id": "sensor.aqara_door_and_window_sensor_battery_type_4",
    "hidden_by": null,
    "name": null,
    "original_name": "Battery type",
    "platform": "matter"
  },
  {
    "area_id": null,
    "device_id": "0728ce0e83045cf9666b391c53941d1e",
    "disabled_by": null,
    "entity_id": "binary_sensor.aqara_door_and_window_sensor_door_5",
    "hidden_by": null,
    "name": null,
    "original_name": "Door",
    "platform": "matter"
  },
  {
    "area_id": null,
    "device_id": "0728ce0e83045cf9666b391c53941d1e",
    "disabled_by": null,
    "entity_id": "button.aqara_door_and_window_sensor_identify_5",
    "hidden_by": null,
    "name": null,
    "original_name": "Identify",
    "platform": "matter"
  },
  {
    "area_id": null,
    "device_id": "0728ce0e83045cf9666b391c53941d1e",
    "disabled_by": null,
    "entity_id": "sensor.aqara_door_and_window_sensor_battery_5",
    "hidden_by": null,
    "name": null,
    "original_name": "Battery",
    "platform": "matter"
  },
  {
    "area_id": null,
    "device_id": "0728ce0e83045cf9666b391c53941d1e",
    "disabled_by": null,
    "entity_id": "sensor.aqara_door_and_window_sensor_battery_voltage_5",
    "hidden_by": null,
    "name": null,
    "original_name": "Battery voltage",
    "platform": "matter"
  },
  {
    "area_id": null,
    "device_id": "0728ce0e83045cf9666b391c53941d1e",
    "disabled_by": null,
    "entity_id": "sensor.aqara_door_and_window_sensor_battery_type_5",
    "hidden_by": null,
    "name": null,
    "original_name": "Battery type",
    "platform": "matter"
  },
  {
    "area_id": null,
    "device_id": "9398c3235542814e4cca0c14249228e4",
    "disabled_by": null,
    "entity_id": "binary_sensor.aqara_door_and_window_sensor_door_6",
    "hidden_by": null,
    "name": null,
    "original_name": "Door",
    "platform": "matter"
  },
  {
    "area_id": null,
    "device_id": "9398c3235542814e4cca0c14249228e4",
    "disabled_by": null,
    "entity_id": "button.aqara_door_and_window_sensor_identify_6",
    "hidden_by": null,
    "name": null,
    "original_name": "Identify",
    "platform": "matter"
  },
  {
    "area_id": null,
    "device_id": "9398c3235542814e4cca0c14249228e4",
    "disabled_by": null,
    "entity_id": "sensor.aqara_door_and_window_sensor_battery_6",
    "hidden_by": null,
    "name": null,
    "original_name": "Battery",
    "platform": "matter"
  },
  {
    "area_id": null,
    "device_id": "9398c3235542814e4cca0c14249228e4",
    "disabled_by": null,
    "entity_id": "sensor.aqara_door_and_window_sensor_battery_voltage_6",
    "hidden_by": null,
    "name": null,
    "original_name": "Battery voltage",
    "platform": "matter"
  },
  {
    "area_id": null,
    "device_id": "9398c3235542814e4cca0c14249228e4",
    "disabled_by": null,
    "entity_id": "sensor.aqara_door_and_window_sensor_battery_type_6",
    "hidden_by": null,
    "name": null,
    "original_name": "Battery type",
    "platform": "matter"
  },
  {
    "area_id": null,
    "device_id": "e7b7536f089b76b864bc1668e48f665c",
    "disabled_by": null,
    "entity_id": "binary_sensor.aqara_door_and_window_sensor_door_7",
    "hidden_by": null,
    "name": null,
    "original_name": "Door",
    "platform": "matter"
  },
  {
    "area_id": null,
    "device_id": "e7b7536f089b76b864bc1668e48f665c",
    "disabled_by": null,
    "entity_id": "button.aqara_door_and_window_sensor_identify_7",
    "hidden_by": null,
    "name": null,
    "original_name": "Identify",
    "platform": "matter"
  },
  {
    "area_id": null,
    "device_id": "e7b7536f089b76b864bc1668e48f665c",
    "disabled_by": null,
    "entity_id": "sensor.aqara_door_and_window_sensor_battery_7",
    "hidden_by": null,
    "name": null,
    "original_name": "Battery",
    "platform": "matter"
  },
  {
    "area_id": null,
    "device_id": "e7b7536f089b76b864bc1668e48f665c",
    "disabled_by": null,
    "entity_id": "sensor.aqara_door_and_window_sensor_battery_voltage_7",
    "hidden_by": null,
    "name": null,
    "original_name": "Battery voltage",
    "platform": "matter"
  },
  {
    "area_id": null,
    "device_id": "e7b7536f089b76b864bc1668e48f665c",
    "disabled_by": null,
    "entity_id": "sensor.aqara_door_and_window_sensor_battery_type_7",
    "hidden_by": null,
    "name": null,
    "original_name": "Battery type",
    "platform": "matter"
  },
  {
    "area_id": null,
    "device_id": "3e1dbf216befd9366e10e291f07948db",
    "disabled_by": null,
    "entity_id": "binary_sensor.aqara_curtain_driver_e1_problem",
    "hidden_by": null,
    "name": null,
    "original_name": "Problem",
    "platform": "matter"
  },
  {
    "area_id": null,
    "device_id": "3e1dbf216befd9366e10e291f07948db",
    "disabled_by": null,
    "entity_id": "button.aqara_curtain_driver_e1_identify",
    "hidden_by": null,
    "name": null,
    "original_name": "Identify",
    "platform": "matter"
  },
  {
    "area_id": null,
    "device_id": "3e1dbf216befd9366e10e291f07948db",
    "disabled_by": null,
    "entity_id": "cover.aqara_curtain_driver_e1",
    "hidden_by": null,
    "name": null,
    "original_name": null,
    "platform": "matter"
  },
  {
    "area_id": null,
    "device_id": "3e1dbf216befd9366e10e291f07948db",
    "disabled_by": null,
    "entity_id": "sensor.aqara_curtain_driver_e1_battery",
    "hidden_by": null,
    "name": null,
    "original_name": "Battery",
    "platform": "matter"
  },
  {
    "area_id": null,
    "device_id": "3e1dbf216befd9366e10e291f07948db",
    "disabled_by": null,
    "entity_id": "sensor.aqara_curtain_driver_e1_battery_voltage",
    "hidden_by": null,
    "name": null,
    "original_name": "Battery voltage",
    "platform": "matter"
  },
  {
    "area_id": null,
    "device_id": "3e1dbf216befd9366e10e291f07948db",
    "disabled_by": null,
    "entity_id": "sensor.aqara_curtain_driver_e1_battery_charge_state",
    "hidden_by": null,
    "name": null,
    "original_name": "Battery charge state",
    "platform": "matter"
  },
  {
    "area_id": null,
    "device_id": "3e1dbf216befd9366e10e291f07948db",
    "disabled_by": "integration",
    "entity_id": "sensor.aqara_curtain_driver_e1_target_opening_position",
    "hidden_by": null,
    "name": null,
    "original_name": "Target opening position",
    "platform": "matter"
  },
  {
    "area_id": null,
    "device_id": "412148a8ec0f5f9ba347008bb9c48d19",
    "disabled_by": null,
    "entity_id": "binary_sensor.aqara_curtain_driver_e1_problem_2",
    "hidden_by": null,
    "name": null,
    "original_name": "Problem",
    "platform": "matter"
  },
  {
    "area_id": null,
    "device_id": "412148a8ec0f5f9ba347008bb9c48d19",
    "disabled_by": null,
    "entity_id": "button.aqara_curtain_driver_e1_identify_2",
    "hidden_by": null,
    "name": null,
    "original_name": "Identify",
    "platform": "matter"
  },
  {
    "area_id": null,
    "device_id": "412148a8ec0f5f9ba347008bb9c48d19",
    "disabled_by": null,
    "entity_id": "cover.aqara_curtain_driver_e1_2",
    "hidden_by": null,
    "name": null,
    "original_name": null,
    "platform": "matter"
  },
  {
    "area_id": null,
    "device_id": "412148a8ec0f5f9ba347008bb9c48d19",
    "disabled_by": null,
    "entity_id": "sensor.aqara_curtain_driver_e1_battery_2",
    "hidden_by": null,
    "name": null,
    "original_name": "Battery",
    "platform": "matter"
  },
  {
    "area_id": null,
    "device_id": "412148a8ec0f5f9ba347008bb9c48d19",
    "disabled_by": null,
    "entity_id": "sensor.aqara_curtain_driver_e1_battery_voltage_2",
    "hidden_by": null,
    "name": null,
    "original_name": "Battery voltage",
    "platform": "matter"
  },
  {
    "area_id": null,
    "device_id": "412148a8ec0f5f9ba347008bb9c48d19",
    "disabled_by": null,
    "entity_id": "sensor.aqara_curtain_driver_e1_battery_charge_state_2",
    "hidden_by": null,
    "name": null,
    "original_name": "Battery charge state",
    "platform": "matter"
  },
  {
    "area_id": null,
    "device_id": "412148a8ec0f5f9ba347008bb9c48d19",
    "disabled_by": "integration",
    "entity_id": "sensor.aqara_curtain_driver_e1_target_opening_position_2",
    "hidden_by": null,
    "name": null,
    "original_name": "Target opening position",
    "platform": "matter"
  },
  {
    "area_id": null,
    "device_id": "a5cccdcd99030b787285cf002880f130",
    "disabled_by": null,
    "entity_id": "binary_sensor.aqara_presence_sensor_fp1e_occupancy",
    "hidden_by": null,
    "name": null,
    "original_name": "Occupancy",
    "platform": "matter"
  },
  {
    "area_id": null,
    "device_id": "a5cccdcd99030b787285cf002880f130",
    "disabled_by": null,
    "entity_id": "button.aqara_presence_sensor_fp1e_identify",
    "hidden_by": null,
    "name": null,
    "original_name": "Identify",
    "platform": "matter"
  },
  {
    "area_id": null,
    "device_id": "c9d8d61f1d40653e629c68ceabddf488",
    "disabled_by": null,
    "entity_id": "binary_sensor.aqara_motion_sensor_p1_occupancy",
    "hidden_by": null,
    "name": null,
    "original_name": "Occupancy",
    "platform": "matter"
  },
  {
    "area_id": null,
    "device_id": "c9d8d61f1d40653e629c68ceabddf488",
    "disabled_by": null,
    "entity_id": "button.aqara_motion_sensor_p1_identify",
    "hidden_by": null,
    "name": null,
    "original_name": "Identify",
    "platform": "matter"
  },
  {
    "area_id": null,
    "device_id": "c9d8d61f1d40653e629c68ceabddf488",
    "disabled_by": null,
    "entity_id": "sensor.aqara_motion_sensor_p1_battery",
    "hidden_by": null,
    "name": null,
    "original_name": "Battery",
    "platform": "matter"
  },
  {
    "area_id": null,
    "device_id": "c9d8d61f1d40653e629c68ceabddf488",
    "disabled_by": null,
    "entity_id": "sensor.aqara_motion_sensor_p1_battery_voltage",
    "hidden_by": null,
    "name": null,
    "original_name": "Battery voltage",
    "platform": "matter"
  },
  {
    "area_id": null,
    "device_id": "c9d8d61f1d40653e629c68ceabddf488",
    "disabled_by": null,
    "entity_id": "sensor.aqara_motion_sensor_p1_battery_type",
    "hidden_by": null,
    "name": null,
    "original_name": "Battery type",
    "platform": "matter"
  },
  {
    "area_id": null,
    "device_id": "5f9599ebee4bf62fc9fb3038a1819397",
    "disabled_by": null,
    "entity_id": "binary_sensor.aqara_motion_sensor_p1_occupancy_2",
    "hidden_by": null,
    "name": null,
    "original_name": "Occupancy",
    "platform": "matter"
  },
  {
    "area_id": null,
    "device_id": "5f9599ebee4bf62fc9fb3038a1819397",
    "disabled_by": null,
    "entity_id": "button.aqara_motion_sensor_p1_identify_2",
    "hidden_by": null,
    "name": null,
    "original_name": "Identify",
    "platform": "matter"
  },
  {
    "area_id": null,
    "device_id": "5f9599ebee4bf62fc9fb3038a1819397",
    "disabled_by": null,
    "entity_id": "sensor.aqara_motion_sensor_p1_battery_2",
    "hidden_by": null,
    "name": null,
    "original_name": "Battery",
    "platform": "matter"
  },
  {
    "area_id": null,
    "device_id": "5f9599ebee4bf62fc9fb3038a1819397",
    "disabled_by": null,
    "entity_id": "sensor.aqara_motion_sensor_p1_battery_voltage_2",
    "hidden_by": null,
    "name": null,
    "original_name": "Battery voltage",
    "platform": "matter"
  },
  {
    "area_id": null,
    "device_id": "5f9599ebee4bf62fc9fb3038a1819397",
    "disabled_by": null,
    "entity_id": "sensor.aqara_motion_sensor_p1_battery_type_2",
    "hidden_by": null,
    "name": null,
    "original_name": "Battery type",
    "platform": "matter"
  },
  {
    "area_id": null,
    "device_id": "50568567cd5b532f7c719f8af20887d5",
    "disabled_by": null,
    "entity_id": "sensor.aqara_wireless_remote_switch_battery",
    "hidden_by": null,
    "name": null,
    "original_name": "Battery",
    "platform": "matter"
  },
  {
    "area_id": null,
    "device_id": "50568567cd5b532f7c719f8af20887d5",
    "disabled_by": null,
    "entity_id": "sensor.aqara_wireless_remote_switch_battery_voltage",
    "hidden_by": null,
    "name": null,
    "original_name": "Battery voltage",
    "platform": "matter"
  },
  {
    "area_id": null,
    "device_id": "50568567cd5b532f7c719f8af20887d5",
    "disabled_by": null,
    "entity_id": "sensor.aqara_wireless_remote_switch_battery_type",
    "hidden_by": null,
    "name": null,
    "original_name": "Battery type",
    "platform": "matter"
  },
  {
    "area_id": null,
    "device_id": "50568567cd5b532f7c719f8af20887d5",
    "disabled_by": null,
    "entity_id": "button.aqara_wireless_remote_switch_identify",
    "hidden_by": null,
    "name": null,
    "original_name": "Identify",
    "platform": "matter"
  },
  {
    "area_id": null,
    "device_id": "50568567cd5b532f7c719f8af20887d5",
    "disabled_by": null,
    "entity_id": "event.aqara_wireless_remote_switch_button",
    "hidden_by": null,
    "name": null,
    "original_name": "Button",
    "platform": "matter"
  },
  {
    "area_id": null,
    "device_id": "50568567cd5b532f7c719f8af20887d5",
    "disabled_by": "integration",
    "entity_id": "sensor.aqara_wireless_remote_switch_current_switch_position",
    "hidden_by": null,
    "name": null,
    "original_name": "Current switch position",
    "platform": "matter"
  },
  {
    "area_id": null,
    "device_id": "50568567cd5b532f7c719f8af20887d5",
    "disabled_by": null,
    "entity_id": "button.aqara_wireless_remote_switch_identify_2",
    "hidden_by": null,
    "name": null,
    "original_name": "Identify",
    "platform": "matter"
  },
  {
    "area_id": null,
    "device_id": "50568567cd5b532f7c719f8af20887d5",
    "disabled_by": null,
    "entity_id": "event.aqara_wireless_remote_switch_button_2",
    "hidden_by": null,
    "name": null,
    "original_name": "Button",
    "platform": "matter"
  },
  {
    "area_id": null,
    "device_id": "50568567cd5b532f7c719f8af20887d5",
    "disabled_by": "integration",
    "entity_id": "sensor.aqara_wireless_remote_switch_current_switch_position_2",
    "hidden_by": null,
    "name": null,
    "original_name": "Current switch position",
    "platform": "matter"
  },
  {
    "area_id": null,
    "device_id": "3ba620e83a81087792b346d2b230c289",
    "disabled_by": null,
    "entity_id": "button.switchbot_hub_3_identify",
    "hidden_by": null,
    "name": null,
    "original_name": "Identify",
    "platform": "matter"
  },
  {
    "area_id": null,
    "device_id": "46a08e3c0c4c210971727daa590c917f",
    "disabled_by": null,
    "entity_id": "sensor.hub_3_tempsensor_temperature",
    "hidden_by": null,
    "name": null,
    "original_name": "Temperature",
    "platform": "matter"
  },
  {
    "area_id": null,
    "device_id": "dd6d6604699f9bcb3f1785f0734ca0c7",
    "disabled_by": null,
    "entity_id": "sensor.hub_3_humisensor_humidity",
    "hidden_by": null,
    "name": null,
    "original_name": "Humidity",
    "platform": "matter"
  },
  {
    "area_id": null,
    "device_id": "f8bce4a32d0483c8e5998ec525bb9369",
    "disabled_by": null,
    "entity_id": "binary_sensor.hub_3_motionsensor_occupancy",
    "hidden_by": null,
    "name": null,
    "original_name": "Occupancy",
    "platform": "matter"
  },
  {
    "area_id": null,
    "device_id": "23a9a926a450af03776a332578199e00",
    "disabled_by": null,
    "entity_id": "media_player.living_room_2",
    "hidden_by": null,
    "name": null,
    "original_name": null,
    "platform": "apple_tv"
  },
  {
    "area_id": null,
    "device_id": "23a9a926a450af03776a332578199e00",
    "disabled_by": null,
    "entity_id": "remote.living_room_2",
    "hidden_by": null,
    "name": null,
    "original_name": null,
    "platform": "apple_tv"
  },
  {
    "area_id": null,
    "device_id": "5a333ca87d58a8ff878d4618c15a08c6",
    "disabled_by": null,
    "entity_id": "event.hub_3_button_1_button",
    "hidden_by": null,
    "name": null,
    "original_name": "Button",
    "platform": "matter"
  },
  {
    "area_id": null,
    "device_id": "5a333ca87d58a8ff878d4618c15a08c6",
    "disabled_by": "integration",
    "entity_id": "sensor.hub_3_button_1_current_switch_position",
    "hidden_by": null,
    "name": null,
    "original_name": "Current switch position",
    "platform": "matter"
  },
  {
    "area_id": null,
    "device_id": "e76350da340adc8f514b17cde07bed88",
    "disabled_by": null,
    "entity_id": "binary_sensor.presence_kitchen_zone_occupancy",
    "hidden_by": null,
    "name": null,
    "original_name": "Occupancy",
    "platform": "matter"
  },
  {
    "area_id": null,
    "device_id": "e76350da340adc8f514b17cde07bed88",
    "disabled_by": null,
    "entity_id": "button.presence_kitchen_zone_identify",
    "hidden_by": null,
    "name": null,
    "original_name": "Identify",
    "platform": "matter"
  },
  {
    "area_id": null,
    "device_id": "ef6a2abe0d1fa53d01b8198d8aeadee0",
    "disabled_by": null,
    "entity_id": "binary_sensor.approaching_openplan_room_occupancy",
    "hidden_by": null,
    "name": null,
    "original_name": "Occupancy",
    "platform": "matter"
  },
  {
    "area_id": null,
    "device_id": "ef6a2abe0d1fa53d01b8198d8aeadee0",
    "disabled_by": null,
    "entity_id": "button.approaching_openplan_room_identify",
    "hidden_by": null,
    "name": null,
    "original_name": "Identify",
    "platform": "matter"
  },
  {
    "area_id": null,
    "device_id": "5347696d7632da6e8853f05ff7706010",
    "disabled_by": null,
    "entity_id": "binary_sensor.presence_living_zone_occupancy",
    "hidden_by": null,
    "name": null,
    "original_name": "Occupancy",
    "platform": "matter"
  },
  {
    "area_id": null,
    "device_id": "5347696d7632da6e8853f05ff7706010",
    "disabled_by": null,
    "entity_id": "button.presence_living_zone_identify",
    "hidden_by": null,
    "name": null,
    "original_name": "Identify",
    "platform": "matter"
  },
  {
    "area_id": null,
    "device_id": "57b210076090a8a7602f2c14819c6a71",
    "disabled_by": null,
    "entity_id": "binary_sensor.presence_dining_zone_occupancy",
    "hidden_by": null,
    "name": null,
    "original_name": "Occupancy",
    "platform": "matter"
  },
  {
    "area_id": null,
    "device_id": "57b210076090a8a7602f2c14819c6a71",
    "disabled_by": null,
    "entity_id": "button.presence_dining_zone_identify",
    "hidden_by": null,
    "name": null,
    "original_name": "Identify",
    "platform": "matter"
  },
  {
    "area_id": null,
    "device_id": "b12ba98833de10944c276b8c986b48d5",
    "disabled_by": null,
    "entity_id": "binary_sensor.absence_for_5mins_openplan_occupancy",
    "hidden_by": null,
    "name": null,
    "original_name": "Occupancy",
    "platform": "matter"
  },
  {
    "area_id": null,
    "device_id": "b12ba98833de10944c276b8c986b48d5",
    "disabled_by": null,
    "entity_id": "button.absence_for_5mins_openplan_identify",
    "hidden_by": null,
    "name": null,
    "original_name": "Identify",
    "platform": "matter"
  },
  {
    "area_id": null,
    "device_id": "9cf834287d35c92b1c2b15d4e2563e3d",
    "disabled_by": null,
    "entity_id": "binary_sensor.absence_for_3mins_kitchen_zone_occupancy",
    "hidden_by": null,
    "name": null,
    "original_name": "Occupancy",
    "platform": "matter"
  },
  {
    "area_id": null,
    "device_id": "9cf834287d35c92b1c2b15d4e2563e3d",
    "disabled_by": null,
    "entity_id": "button.absence_for_3mins_kitchen_zone_identify",
    "hidden_by": null,
    "name": null,
    "original_name": "Identify",
    "platform": "matter"
  },
  {
    "area_id": null,
    "device_id": "9c402f1bb0f2e12aad2c1a3445cc2973",
    "disabled_by": null,
    "entity_id": "binary_sensor.absence_for_3mins_living_zone_occupancy",
    "hidden_by": null,
    "name": null,
    "original_name": "Occupancy",
    "platform": "matter"
  },
  {
    "area_id": null,
    "device_id": "9c402f1bb0f2e12aad2c1a3445cc2973",
    "disabled_by": null,
    "entity_id": "button.absence_for_3mins_living_zone_identify",
    "hidden_by": null,
    "name": null,
    "original_name": "Identify",
    "platform": "matter"
  },
  {
    "area_id": null,
    "device_id": "d87b349943815bc7c6955598c148be6e",
    "disabled_by": null,
    "entity_id": "binary_sensor.absence_for_3mins_dining_zone_occupancy",
    "hidden_by": null,
    "name": null,
    "original_name": "Occupancy",
    "platform": "matter"
  },
  {
    "area_id": null,
    "device_id": "d87b349943815bc7c6955598c148be6e",
    "disabled_by": null,
    "entity_id": "button.absence_for_3mins_dining_zone_identify",
    "hidden_by": null,
    "name": null,
    "original_name": "Identify",
    "platform": "matter"
  },
  {
    "area_id": null,
    "device_id": "6364ed40ff74eae0b9ebfaa1bcdefdfa",
    "disabled_by": null,
    "entity_id": "binary_sensor.roller_shade_2a_problem",
    "hidden_by": null,
    "name": null,
    "original_name": "Problem",
    "platform": "matter"
  },
  {
    "area_id": null,
    "device_id": "6364ed40ff74eae0b9ebfaa1bcdefdfa",
    "disabled_by": null,
    "entity_id": "sensor.roller_shade_2a_battery",
    "hidden_by": null,
    "name": null,
    "original_name": "Battery",
    "platform": "matter"
  },
  {
    "area_id": null,
    "device_id": "6364ed40ff74eae0b9ebfaa1bcdefdfa",
    "disabled_by": null,
    "entity_id": "cover.roller_shade_2a",
    "hidden_by": null,
    "name": null,
    "original_name": null,
    "platform": "matter"
  },
  {
    "area_id": null,
    "device_id": "6364ed40ff74eae0b9ebfaa1bcdefdfa",
    "disabled_by": "integration",
    "entity_id": "sensor.roller_shade_2a_target_opening_position",
    "hidden_by": null,
    "name": null,
    "original_name": "Target opening position",
    "platform": "matter"
  },
  {
    "area_id": null,
    "device_id": "a94fde18da4f2126110649a104e1dc4e",
    "disabled_by": null,
    "entity_id": "event.hub_3_button_2_button",
    "hidden_by": null,
    "name": null,
    "original_name": "Button",
    "platform": "matter"
  },
  {
    "area_id": null,
    "device_id": "a94fde18da4f2126110649a104e1dc4e",
    "disabled_by": "integration",
    "entity_id": "sensor.hub_3_button_2_current_switch_position",
    "hidden_by": null,
    "name": null,
    "original_name": "Current switch position",
    "platform": "matter"
  },
  {
    "area_id": null,
    "device_id": "a2e81a41c2ee0a9e1daec770ead9da75",
    "disabled_by": null,
    "entity_id": "sensor.jeffs_iphone_battery_level",
    "hidden_by": null,
    "name": null,
    "original_name": "Jeff\u2019s iPhone Battery Level",
    "platform": "mobile_app"
  },
  {
    "area_id": null,
    "device_id": "a2e81a41c2ee0a9e1daec770ead9da75",
    "disabled_by": null,
    "entity_id": "sensor.jeffs_iphone_sim_2",
    "hidden_by": null,
    "name": null,
    "original_name": "Jeff\u2019s iPhone SIM 2",
    "platform": "mobile_app"
  },
  {
    "area_id": null,
    "device_id": "a2e81a41c2ee0a9e1daec770ead9da75",
    "disabled_by": null,
    "entity_id": "sensor.jeffs_iphone_sim_1",
    "hidden_by": null,
    "name": null,
    "original_name": "Jeff\u2019s iPhone SIM 1",
    "platform": "mobile_app"
  },
  {
    "area_id": null,
    "device_id": "a2e81a41c2ee0a9e1daec770ead9da75",
    "disabled_by": null,
    "entity_id": "sensor.jeffs_iphone_geocoded_location",
    "hidden_by": null,
    "name": null,
    "original_name": "Jeff\u2019s iPhone Geocoded Location",
    "platform": "mobile_app"
  },
  {
    "area_id": null,
    "device_id": "a2e81a41c2ee0a9e1daec770ead9da75",
    "disabled_by": null,
    "entity_id": "sensor.jeffs_iphone_last_update_trigger",
    "hidden_by": null,
    "name": null,
    "original_name": "Jeff\u2019s iPhone Last Update Trigger",
    "platform": "mobile_app"
  },
  {
    "area_id": null,
    "device_id": "a2e81a41c2ee0a9e1daec770ead9da75",
    "disabled_by": null,
    "entity_id": "sensor.jeffs_iphone_app_version",
    "hidden_by": null,
    "name": null,
    "original_name": "Jeff\u2019s iPhone App Version",
    "platform": "mobile_app"
  },
  {
    "area_id": null,
    "device_id": "a2e81a41c2ee0a9e1daec770ead9da75",
    "disabled_by": null,
    "entity_id": "sensor.jeffs_iphone_location_permission",
    "hidden_by": null,
    "name": null,
    "original_name": "Jeff\u2019s iPhone Location permission",
    "platform": "mobile_app"
  },
  {
    "area_id": null,
    "device_id": "a2e81a41c2ee0a9e1daec770ead9da75",
    "disabled_by": null,
    "entity_id": "sensor.jeffs_iphone_audio_output",
    "hidden_by": null,
    "name": null,
    "original_name": "Jeff\u2019s iPhone Audio Output",
    "platform": "mobile_app"
  },
  {
    "area_id": null,
    "device_id": "a2e81a41c2ee0a9e1daec770ead9da75",
    "disabled_by": null,
    "entity_id": "sensor.jeffs_iphone_battery_state",
    "hidden_by": null,
    "name": null,
    "original_name": "Jeff\u2019s iPhone Battery State",
    "platform": "mobile_app"
  },
  {
    "area_id": null,
    "device_id": "a2e81a41c2ee0a9e1daec770ead9da75",
    "disabled_by": null,
    "entity_id": "sensor.jeffs_iphone_storage",
    "hidden_by": null,
    "name": null,
    "original_name": "Jeff\u2019s iPhone Storage",
    "platform": "mobile_app"
  },
  {
    "area_id": null,
    "device_id": "a2e81a41c2ee0a9e1daec770ead9da75",
    "disabled_by": null,
    "entity_id": "sensor.jeffs_iphone_connection_type",
    "hidden_by": null,
    "name": null,
    "original_name": "Jeff\u2019s iPhone Connection Type",
    "platform": "mobile_app"
  },
  {
    "area_id": null,
    "device_id": "a2e81a41c2ee0a9e1daec770ead9da75",
    "disabled_by": null,
    "entity_id": "sensor.jeffs_iphone_ssid",
    "hidden_by": null,
    "name": null,
    "original_name": "Jeff\u2019s iPhone SSID",
    "platform": "mobile_app"
  },
  {
    "area_id": null,
    "device_id": "a2e81a41c2ee0a9e1daec770ead9da75",
    "disabled_by": null,
    "entity_id": "sensor.jeffs_iphone_bssid",
    "hidden_by": null,
    "name": null,
    "original_name": "Jeff\u2019s iPhone BSSID",
    "platform": "mobile_app"
  },
  {
    "area_id": null,
    "device_id": "a21d7792725515ce9008298a03bb798a",
    "disabled_by": null,
    "entity_id": "button.wiz_a60_filament_identify",
    "hidden_by": null,
    "name": null,
    "original_name": "Identify",
    "platform": "matter"
  },
  {
    "area_id": null,
    "device_id": "a21d7792725515ce9008298a03bb798a",
    "disabled_by": null,
    "entity_id": "light.wiz_a60_filament",
    "hidden_by": null,
    "name": null,
    "original_name": null,
    "platform": "matter"
  },
  {
    "area_id": null,
    "device_id": "a21d7792725515ce9008298a03bb798a",
    "disabled_by": null,
    "entity_id": "number.wiz_a60_filament_on_level",
    "hidden_by": null,
    "name": null,
    "original_name": "On level",
    "platform": "matter"
  },
  {
    "area_id": null,
    "device_id": "a21d7792725515ce9008298a03bb798a",
    "disabled_by": null,
    "entity_id": "number.wiz_a60_filament_on_transition_time",
    "hidden_by": null,
    "name": null,
    "original_name": "On transition time",
    "platform": "matter"
  },
  {
    "area_id": null,
    "device_id": "a21d7792725515ce9008298a03bb798a",
    "disabled_by": null,
    "entity_id": "number.wiz_a60_filament_off_transition_time",
    "hidden_by": null,
    "name": null,
    "original_name": "Off transition time",
    "platform": "matter"
  },
  {
    "area_id": null,
    "device_id": "a21d7792725515ce9008298a03bb798a",
    "disabled_by": null,
    "entity_id": "number.wiz_a60_filament_on_off_transition_time",
    "hidden_by": null,
    "name": null,
    "original_name": "On/off transition time",
    "platform": "matter"
  },
  {
    "area_id": null,
    "device_id": "a21d7792725515ce9008298a03bb798a",
    "disabled_by": null,
    "entity_id": "select.wiz_a60_filament_power_on_behaviour_on_startup",
    "hidden_by": null,
    "name": null,
    "original_name": "Power-on behaviour on startup",
    "platform": "matter"
  },
  {
    "area_id": null,
    "device_id": "f417c8f588f9fd252fc32de6be532da9",
    "disabled_by": null,
    "entity_id": "media_player.bedroom_apple_tv",
    "hidden_by": null,
    "name": null,
    "original_name": null,
    "platform": "apple_tv"
  },
  {
    "area_id": null,
    "device_id": "f417c8f588f9fd252fc32de6be532da9",
    "disabled_by": null,
    "entity_id": "remote.bedroom_apple_tv",
    "hidden_by": null,
    "name": null,
    "original_name": null,
    "platform": "apple_tv"
  },
  {
    "area_id": null,
    "device_id": null,
    "disabled_by": null,
    "entity_id": "scene.new_scene",
    "hidden_by": null,
    "name": null,
    "original_name": "New scene",
    "platform": "homeassistant"
  },
  {
    "area_id": null,
    "device_id": "88018fd32d736c704bff5dc3e6d3973b",
    "disabled_by": null,
    "entity_id": "binary_sensor.beta_bedroom_presence_detected_occupancy",
    "hidden_by": null,
    "name": null,
    "original_name": "Occupancy",
    "platform": "matter"
  },
  {
    "area_id": null,
    "device_id": "88018fd32d736c704bff5dc3e6d3973b",
    "disabled_by": null,
    "entity_id": "button.beta_bedroom_presence_detected_identify",
    "hidden_by": null,
    "name": null,
    "original_name": "Identify",
    "platform": "matter"
  },
  {
    "area_id": null,
    "device_id": "b9219d3d32ad3432d09e71878ad14022",
    "disabled_by": null,
    "entity_id": "binary_sensor.beta_bedroom_no_presence_3mins_occupancy",
    "hidden_by": null,
    "name": null,
    "original_name": "Occupancy",
    "platform": "matter"
  },
  {
    "area_id": null,
    "device_id": "b9219d3d32ad3432d09e71878ad14022",
    "disabled_by": null,
    "entity_id": "button.beta_bedroom_no_presence_3mins_identify",
    "hidden_by": null,
    "name": null,
    "original_name": "Identify",
    "platform": "matter"
  },
  {
    "area_id": null,
    "device_id": "2668f542fc4a530b359a16f4de5cb7e8",
    "disabled_by": null,
    "entity_id": "binary_sensor.aqara_presence_sensor_fp1e_occupancy_2",
    "hidden_by": null,
    "name": null,
    "original_name": "Occupancy",
    "platform": "matter"
  },
  {
    "area_id": null,
    "device_id": "2668f542fc4a530b359a16f4de5cb7e8",
    "disabled_by": null,
    "entity_id": "button.aqara_presence_sensor_fp1e_identify_2",
    "hidden_by": null,
    "name": null,
    "original_name": "Identify",
    "platform": "matter"
  },
  {
    "area_id": null,
    "device_id": "cc5249666d50f9cda4fb6b62d3e4e561",
    "disabled_by": null,
    "entity_id": "media_player.serif_tv",
    "hidden_by": null,
    "name": null,
    "original_name": null,
    "platform": "cast"
  },
  {
    "area_id": null,
    "device_id": "735ef7fcb4452be87b579182ccbe01a5",
    "disabled_by": null,
    "entity_id": "fan.core_300s",
    "hidden_by": null,
    "name": null,
    "original_name": null,
    "platform": "vesync"
  },
  {
    "area_id": null,
    "device_id": "735ef7fcb4452be87b579182ccbe01a5",
    "disabled_by": null,
    "entity_id": "sensor.core_300s_air_quality",
    "hidden_by": null,
    "name": null,
    "original_name": "Air quality",
    "platform": "vesync"
  },
  {
    "area_id": null,
    "device_id": "735ef7fcb4452be87b579182ccbe01a5",
    "disabled_by": null,
    "entity_id": "sensor.core_300s_pm2_5",
    "hidden_by": null,
    "name": null,
    "original_name": "PM2.5",
    "platform": "vesync"
  },
  {
    "area_id": null,
    "device_id": "735ef7fcb4452be87b579182ccbe01a5",
    "disabled_by": null,
    "entity_id": "switch.core_300s_display",
    "hidden_by": null,
    "name": null,
    "original_name": "Display",
    "platform": "vesync"
  },
  {
    "area_id": null,
    "device_id": "735ef7fcb4452be87b579182ccbe01a5",
    "disabled_by": null,
    "entity_id": "switch.core_300s_child_lock",
    "hidden_by": null,
    "name": null,
    "original_name": "Child lock",
    "platform": "vesync"
  },
  {
    "area_id": null,
    "device_id": "735ef7fcb4452be87b579182ccbe01a5",
    "disabled_by": null,
    "entity_id": "update.core_300s_firmware",
    "hidden_by": null,
    "name": null,
    "original_name": "Firmware",
    "platform": "vesync"
  },
  {
    "area_id": null,
    "device_id": "735ef7fcb4452be87b579182ccbe01a5",
    "disabled_by": null,
    "entity_id": "sensor.core_300s_filter_lifetime",
    "hidden_by": null,
    "name": null,
    "original_name": "Filter lifetime",
    "platform": "vesync"
  },
  {
    "area_id": null,
    "device_id": "acc4a38ba4cb4997f8ce1533f1d485e3",
    "disabled_by": null,
    "entity_id": "button.aqara_hub_m3_identify_2",
    "hidden_by": null,
    "name": null,
    "original_name": "Identify",
    "platform": "matter"
  },
  {
    "area_id": null,
    "device_id": "e76350da340adc8f514b17cde07bed88",
    "disabled_by": null,
    "entity_id": "binary_sensor.presence_kitchen_zone_occupancy_2",
    "hidden_by": null,
    "name": null,
    "original_name": "Occupancy",
    "platform": "matter"
  },
  {
    "area_id": null,
    "device_id": "e76350da340adc8f514b17cde07bed88",
    "disabled_by": null,
    "entity_id": "button.presence_kitchen_zone_identify_2",
    "hidden_by": null,
    "name": null,
    "original_name": "Identify",
    "platform": "matter"
  },
  {
    "area_id": null,
    "device_id": "ef6a2abe0d1fa53d01b8198d8aeadee0",
    "disabled_by": null,
    "entity_id": "binary_sensor.approaching_openplan_room_occupancy_2",
    "hidden_by": null,
    "name": null,
    "original_name": "Occupancy",
    "platform": "matter"
  },
  {
    "area_id": null,
    "device_id": "ef6a2abe0d1fa53d01b8198d8aeadee0",
    "disabled_by": null,
    "entity_id": "button.approaching_openplan_room_identify_2",
    "hidden_by": null,
    "name": null,
    "original_name": "Identify",
    "platform": "matter"
  },
  {
    "area_id": null,
    "device_id": "5347696d7632da6e8853f05ff7706010",
    "disabled_by": null,
    "entity_id": "binary_sensor.presence_living_zone_occupancy_2",
    "hidden_by": null,
    "name": null,
    "original_name": "Occupancy",
    "platform": "matter"
  },
  {
    "area_id": null,
    "device_id": "5347696d7632da6e8853f05ff7706010",
    "disabled_by": null,
    "entity_id": "button.presence_living_zone_identify_2",
    "hidden_by": null,
    "name": null,
    "original_name": "Identify",
    "platform": "matter"
  },
  {
    "area_id": null,
    "device_id": "57b210076090a8a7602f2c14819c6a71",
    "disabled_by": null,
    "entity_id": "binary_sensor.presence_dining_zone_occupancy_2",
    "hidden_by": null,
    "name": null,
    "original_name": "Occupancy",
    "platform": "matter"
  },
  {
    "area_id": null,
    "device_id": "57b210076090a8a7602f2c14819c6a71",
    "disabled_by": null,
    "entity_id": "button.presence_dining_zone_identify_2",
    "hidden_by": null,
    "name": null,
    "original_name": "Identify",
    "platform": "matter"
  },
  {
    "area_id": null,
    "device_id": "b12ba98833de10944c276b8c986b48d5",
    "disabled_by": null,
    "entity_id": "binary_sensor.absence_for_5mins_openplan_occupancy_2",
    "hidden_by": null,
    "name": null,
    "original_name": "Occupancy",
    "platform": "matter"
  },
  {
    "area_id": null,
    "device_id": "b12ba98833de10944c276b8c986b48d5",
    "disabled_by": null,
    "entity_id": "button.absence_for_5mins_openplan_identify_2",
    "hidden_by": null,
    "name": null,
    "original_name": "Identify",
    "platform": "matter"
  },
  {
    "area_id": null,
    "device_id": "9c402f1bb0f2e12aad2c1a3445cc2973",
    "disabled_by": null,
    "entity_id": "binary_sensor.absence_for_3mins_living_zone_occupancy_2",
    "hidden_by": null,
    "name": null,
    "original_name": "Occupancy",
    "platform": "matter"
  },
  {
    "area_id": null,
    "device_id": "9c402f1bb0f2e12aad2c1a3445cc2973",
    "disabled_by": null,
    "entity_id": "button.absence_for_3mins_living_zone_identify_2",
    "hidden_by": null,
    "name": null,
    "original_name": "Identify",
    "platform": "matter"
  },
  {
    "area_id": null,
    "device_id": "d87b349943815bc7c6955598c148be6e",
    "disabled_by": null,
    "entity_id": "binary_sensor.absence_for_3mins_dining_zone_occupancy_2",
    "hidden_by": null,
    "name": null,
    "original_name": "Occupancy",
    "platform": "matter"
  },
  {
    "area_id": null,
    "device_id": "d87b349943815bc7c6955598c148be6e",
    "disabled_by": null,
    "entity_id": "button.absence_for_3mins_dining_zone_identify_2",
    "hidden_by": null,
    "name": null,
    "original_name": "Identify",
    "platform": "matter"
  },
  {
    "area_id": null,
    "device_id": "9cf834287d35c92b1c2b15d4e2563e3d",
    "disabled_by": null,
    "entity_id": "binary_sensor.absence_for_3mins_kitchen_zone_occupancy_2",
    "hidden_by": null,
    "name": null,
    "original_name": "Occupancy",
    "platform": "matter"
  },
  {
    "area_id": null,
    "device_id": "9cf834287d35c92b1c2b15d4e2563e3d",
    "disabled_by": null,
    "entity_id": "button.absence_for_3mins_kitchen_zone_identify_2",
    "hidden_by": null,
    "name": null,
    "original_name": "Identify",
    "platform": "matter"
  },
  {
    "area_id": null,
    "device_id": "88018fd32d736c704bff5dc3e6d3973b",
    "disabled_by": null,
    "entity_id": "binary_sensor.beta_bedroom_presence_detected_occupancy_2",
    "hidden_by": null,
    "name": null,
    "original_name": "Occupancy",
    "platform": "matter"
  },
  {
    "area_id": null,
    "device_id": "88018fd32d736c704bff5dc3e6d3973b",
    "disabled_by": null,
    "entity_id": "button.beta_bedroom_presence_detected_identify_2",
    "hidden_by": null,
    "name": null,
    "original_name": "Identify",
    "platform": "matter"
  },
  {
    "area_id": null,
    "device_id": "b9219d3d32ad3432d09e71878ad14022",
    "disabled_by": null,
    "entity_id": "binary_sensor.beta_bedroom_no_presence_3mins_occupancy_2",
    "hidden_by": null,
    "name": null,
    "original_name": "Occupancy",
    "platform": "matter"
  },
  {
    "area_id": null,
    "device_id": "b9219d3d32ad3432d09e71878ad14022",
    "disabled_by": null,
    "entity_id": "button.beta_bedroom_no_presence_3mins_identify_2",
    "hidden_by": null,
    "name": null,
    "original_name": "Identify",
    "platform": "matter"
  },
  {
    "area_id": null,
    "device_id": "eaefa575e0142c1b997ad86338a1e36e",
    "disabled_by": null,
    "entity_id": "binary_sensor.aqara_vibration_sensor_occupancy_2",
    "hidden_by": null,
    "name": null,
    "original_name": "Occupancy",
    "platform": "matter"
  },
  {
    "area_id": null,
    "device_id": "eaefa575e0142c1b997ad86338a1e36e",
    "disabled_by": null,
    "entity_id": "button.aqara_vibration_sensor_identify_2",
    "hidden_by": null,
    "name": null,
    "original_name": "Identify",
    "platform": "matter"
  },
  {
    "area_id": null,
    "device_id": "eaefa575e0142c1b997ad86338a1e36e",
    "disabled_by": null,
    "entity_id": "sensor.aqara_vibration_sensor_battery_2",
    "hidden_by": null,
    "name": null,
    "original_name": "Battery",
    "platform": "matter"
  },
  {
    "area_id": null,
    "device_id": "eaefa575e0142c1b997ad86338a1e36e",
    "disabled_by": null,
    "entity_id": "sensor.aqara_vibration_sensor_battery_voltage_2",
    "hidden_by": null,
    "name": null,
    "original_name": "Battery voltage",
    "platform": "matter"
  },
  {
    "area_id": null,
    "device_id": "eaefa575e0142c1b997ad86338a1e36e",
    "disabled_by": null,
    "entity_id": "sensor.aqara_vibration_sensor_battery_type_2",
    "hidden_by": null,
    "name": null,
    "original_name": "Battery type",
    "platform": "matter"
  },
  {
    "area_id": null,
    "device_id": "880b2d33ed5a8a7f7f00c30568e2f664",
    "disabled_by": null,
    "entity_id": "binary_sensor.aqara_door_and_window_sensor_door_8",
    "hidden_by": null,
    "name": null,
    "original_name": "Door",
    "platform": "matter"
  },
  {
    "area_id": null,
    "device_id": "880b2d33ed5a8a7f7f00c30568e2f664",
    "disabled_by": null,
    "entity_id": "button.aqara_door_and_window_sensor_identify_8",
    "hidden_by": null,
    "name": null,
    "original_name": "Identify",
    "platform": "matter"
  },
  {
    "area_id": null,
    "device_id": "880b2d33ed5a8a7f7f00c30568e2f664",
    "disabled_by": null,
    "entity_id": "sensor.aqara_door_and_window_sensor_battery_8",
    "hidden_by": null,
    "name": null,
    "original_name": "Battery",
    "platform": "matter"
  },
  {
    "area_id": null,
    "device_id": "880b2d33ed5a8a7f7f00c30568e2f664",
    "disabled_by": null,
    "entity_id": "sensor.aqara_door_and_window_sensor_battery_voltage_8",
    "hidden_by": null,
    "name": null,
    "original_name": "Battery voltage",
    "platform": "matter"
  },
  {
    "area_id": null,
    "device_id": "880b2d33ed5a8a7f7f00c30568e2f664",
    "disabled_by": null,
    "entity_id": "sensor.aqara_door_and_window_sensor_battery_type_8",
    "hidden_by": null,
    "name": null,
    "original_name": "Battery type",
    "platform": "matter"
  },
  {
    "area_id": null,
    "device_id": "55707b23ebbe9e56dac212af4d16e418",
    "disabled_by": null,
    "entity_id": "binary_sensor.aqara_door_and_window_sensor_door_9",
    "hidden_by": null,
    "name": null,
    "original_name": "Door",
    "platform": "matter"
  },
  {
    "area_id": null,
    "device_id": "55707b23ebbe9e56dac212af4d16e418",
    "disabled_by": null,
    "entity_id": "button.aqara_door_and_window_sensor_identify_9",
    "hidden_by": null,
    "name": null,
    "original_name": "Identify",
    "platform": "matter"
  },
  {
    "area_id": null,
    "device_id": "55707b23ebbe9e56dac212af4d16e418",
    "disabled_by": null,
    "entity_id": "sensor.aqara_door_and_window_sensor_battery_9",
    "hidden_by": null,
    "name": null,
    "original_name": "Battery",
    "platform": "matter"
  },
  {
    "area_id": null,
    "device_id": "55707b23ebbe9e56dac212af4d16e418",
    "disabled_by": null,
    "entity_id": "sensor.aqara_door_and_window_sensor_battery_voltage_9",
    "hidden_by": null,
    "name": null,
    "original_name": "Battery voltage",
    "platform": "matter"
  },
  {
    "area_id": null,
    "device_id": "55707b23ebbe9e56dac212af4d16e418",
    "disabled_by": null,
    "entity_id": "sensor.aqara_door_and_window_sensor_battery_type_9",
    "hidden_by": null,
    "name": null,
    "original_name": "Battery type",
    "platform": "matter"
  },
  {
    "area_id": null,
    "device_id": "0cd6f6ad32a2c0b7c938478dc91b1347",
    "disabled_by": null,
    "entity_id": "binary_sensor.aqara_door_and_window_sensor_door_10",
    "hidden_by": null,
    "name": null,
    "original_name": "Door",
    "platform": "matter"
  },
  {
    "area_id": null,
    "device_id": "0cd6f6ad32a2c0b7c938478dc91b1347",
    "disabled_by": null,
    "entity_id": "button.aqara_door_and_window_sensor_identify_10",
    "hidden_by": null,
    "name": null,
    "original_name": "Identify",
    "platform": "matter"
  },
  {
    "area_id": null,
    "device_id": "0cd6f6ad32a2c0b7c938478dc91b1347",
    "disabled_by": null,
    "entity_id": "sensor.aqara_door_and_window_sensor_battery_10",
    "hidden_by": null,
    "name": null,
    "original_name": "Battery",
    "platform": "matter"
  },
  {
    "area_id": null,
    "device_id": "0cd6f6ad32a2c0b7c938478dc91b1347",
    "disabled_by": null,
    "entity_id": "sensor.aqara_door_and_window_sensor_battery_voltage_10",
    "hidden_by": null,
    "name": null,
    "original_name": "Battery voltage",
    "platform": "matter"
  },
  {
    "area_id": null,
    "device_id": "0cd6f6ad32a2c0b7c938478dc91b1347",
    "disabled_by": null,
    "entity_id": "sensor.aqara_door_and_window_sensor_battery_type_10",
    "hidden_by": null,
    "name": null,
    "original_name": "Battery type",
    "platform": "matter"
  },
  {
    "area_id": null,
    "device_id": "92e1843e781f34e8bcc13aa84f423eb9",
    "disabled_by": null,
    "entity_id": "binary_sensor.aqara_door_and_window_sensor_door_11",
    "hidden_by": null,
    "name": null,
    "original_name": "Door",
    "platform": "matter"
  },
  {
    "area_id": null,
    "device_id": "92e1843e781f34e8bcc13aa84f423eb9",
    "disabled_by": null,
    "entity_id": "button.aqara_door_and_window_sensor_identify_11",
    "hidden_by": null,
    "name": null,
    "original_name": "Identify",
    "platform": "matter"
  },
  {
    "area_id": null,
    "device_id": "92e1843e781f34e8bcc13aa84f423eb9",
    "disabled_by": null,
    "entity_id": "sensor.aqara_door_and_window_sensor_battery_11",
    "hidden_by": null,
    "name": null,
    "original_name": "Battery",
    "platform": "matter"
  },
  {
    "area_id": null,
    "device_id": "92e1843e781f34e8bcc13aa84f423eb9",
    "disabled_by": null,
    "entity_id": "sensor.aqara_door_and_window_sensor_battery_voltage_11",
    "hidden_by": null,
    "name": null,
    "original_name": "Battery voltage",
    "platform": "matter"
  },
  {
    "area_id": null,
    "device_id": "92e1843e781f34e8bcc13aa84f423eb9",
    "disabled_by": null,
    "entity_id": "sensor.aqara_door_and_window_sensor_battery_type_11",
    "hidden_by": null,
    "name": null,
    "original_name": "Battery type",
    "platform": "matter"
  },
  {
    "area_id": null,
    "device_id": "0728ce0e83045cf9666b391c53941d1e",
    "disabled_by": null,
    "entity_id": "binary_sensor.aqara_door_and_window_sensor_door_12",
    "hidden_by": null,
    "name": null,
    "original_name": "Door",
    "platform": "matter"
  },
  {
    "area_id": null,
    "device_id": "0728ce0e83045cf9666b391c53941d1e",
    "disabled_by": null,
    "entity_id": "button.aqara_door_and_window_sensor_identify_12",
    "hidden_by": null,
    "name": null,
    "original_name": "Identify",
    "platform": "matter"
  },
  {
    "area_id": null,
    "device_id": "0728ce0e83045cf9666b391c53941d1e",
    "disabled_by": null,
    "entity_id": "sensor.aqara_door_and_window_sensor_battery_12",
    "hidden_by": null,
    "name": null,
    "original_name": "Battery",
    "platform": "matter"
  },
  {
    "area_id": null,
    "device_id": "0728ce0e83045cf9666b391c53941d1e",
    "disabled_by": null,
    "entity_id": "sensor.aqara_door_and_window_sensor_battery_voltage_12",
    "hidden_by": null,
    "name": null,
    "original_name": "Battery voltage",
    "platform": "matter"
  },
  {
    "area_id": null,
    "device_id": "0728ce0e83045cf9666b391c53941d1e",
    "disabled_by": null,
    "entity_id": "sensor.aqara_door_and_window_sensor_battery_type_12",
    "hidden_by": null,
    "name": null,
    "original_name": "Battery type",
    "platform": "matter"
  },
  {
    "area_id": null,
    "device_id": "9398c3235542814e4cca0c14249228e4",
    "disabled_by": null,
    "entity_id": "binary_sensor.aqara_door_and_window_sensor_door_13",
    "hidden_by": null,
    "name": null,
    "original_name": "Door",
    "platform": "matter"
  },
  {
    "area_id": null,
    "device_id": "9398c3235542814e4cca0c14249228e4",
    "disabled_by": null,
    "entity_id": "button.aqara_door_and_window_sensor_identify_13",
    "hidden_by": null,
    "name": null,
    "original_name": "Identify",
    "platform": "matter"
  },
  {
    "area_id": null,
    "device_id": "9398c3235542814e4cca0c14249228e4",
    "disabled_by": null,
    "entity_id": "sensor.aqara_door_and_window_sensor_battery_13",
    "hidden_by": null,
    "name": null,
    "original_name": "Battery",
    "platform": "matter"
  },
  {
    "area_id": null,
    "device_id": "9398c3235542814e4cca0c14249228e4",
    "disabled_by": null,
    "entity_id": "sensor.aqara_door_and_window_sensor_battery_voltage_13",
    "hidden_by": null,
    "name": null,
    "original_name": "Battery voltage",
    "platform": "matter"
  },
  {
    "area_id": null,
    "device_id": "9398c3235542814e4cca0c14249228e4",
    "disabled_by": null,
    "entity_id": "sensor.aqara_door_and_window_sensor_battery_type_13",
    "hidden_by": null,
    "name": null,
    "original_name": "Battery type",
    "platform": "matter"
  },
  {
    "area_id": null,
    "device_id": "e7b7536f089b76b864bc1668e48f665c",
    "disabled_by": null,
    "entity_id": "binary_sensor.aqara_door_and_window_sensor_door_14",
    "hidden_by": null,
    "name": null,
    "original_name": "Door",
    "platform": "matter"
  },
  {
    "area_id": null,
    "device_id": "e7b7536f089b76b864bc1668e48f665c",
    "disabled_by": null,
    "entity_id": "button.aqara_door_and_window_sensor_identify_14",
    "hidden_by": null,
    "name": null,
    "original_name": "Identify",
    "platform": "matter"
  },
  {
    "area_id": null,
    "device_id": "e7b7536f089b76b864bc1668e48f665c",
    "disabled_by": null,
    "entity_id": "sensor.aqara_door_and_window_sensor_battery_14",
    "hidden_by": null,
    "name": null,
    "original_name": "Battery",
    "platform": "matter"
  },
  {
    "area_id": null,
    "device_id": "e7b7536f089b76b864bc1668e48f665c",
    "disabled_by": null,
    "entity_id": "sensor.aqara_door_and_window_sensor_battery_voltage_14",
    "hidden_by": null,
    "name": null,
    "original_name": "Battery voltage",
    "platform": "matter"
  },
  {
    "area_id": null,
    "device_id": "e7b7536f089b76b864bc1668e48f665c",
    "disabled_by": null,
    "entity_id": "sensor.aqara_door_and_window_sensor_battery_type_14",
    "hidden_by": null,
    "name": null,
    "original_name": "Battery type",
    "platform": "matter"
  },
  {
    "area_id": null,
    "device_id": "3e1dbf216befd9366e10e291f07948db",
    "disabled_by": null,
    "entity_id": "binary_sensor.aqara_curtain_driver_e1_problem_3",
    "hidden_by": null,
    "name": null,
    "original_name": "Problem",
    "platform": "matter"
  },
  {
    "area_id": null,
    "device_id": "3e1dbf216befd9366e10e291f07948db",
    "disabled_by": null,
    "entity_id": "button.aqara_curtain_driver_e1_identify_3",
    "hidden_by": null,
    "name": null,
    "original_name": "Identify",
    "platform": "matter"
  },
  {
    "area_id": null,
    "device_id": "3e1dbf216befd9366e10e291f07948db",
    "disabled_by": null,
    "entity_id": "cover.aqara_curtain_driver_e1_3",
    "hidden_by": null,
    "name": null,
    "original_name": null,
    "platform": "matter"
  },
  {
    "area_id": null,
    "device_id": "3e1dbf216befd9366e10e291f07948db",
    "disabled_by": null,
    "entity_id": "sensor.aqara_curtain_driver_e1_battery_3",
    "hidden_by": null,
    "name": null,
    "original_name": "Battery",
    "platform": "matter"
  },
  {
    "area_id": null,
    "device_id": "3e1dbf216befd9366e10e291f07948db",
    "disabled_by": null,
    "entity_id": "sensor.aqara_curtain_driver_e1_battery_voltage_3",
    "hidden_by": null,
    "name": null,
    "original_name": "Battery voltage",
    "platform": "matter"
  },
  {
    "area_id": null,
    "device_id": "3e1dbf216befd9366e10e291f07948db",
    "disabled_by": null,
    "entity_id": "sensor.aqara_curtain_driver_e1_battery_charge_state_3",
    "hidden_by": null,
    "name": null,
    "original_name": "Battery charge state",
    "platform": "matter"
  },
  {
    "area_id": null,
    "device_id": "3e1dbf216befd9366e10e291f07948db",
    "disabled_by": "integration",
    "entity_id": "sensor.aqara_curtain_driver_e1_target_opening_position_3",
    "hidden_by": null,
    "name": null,
    "original_name": "Target opening position",
    "platform": "matter"
  },
  {
    "area_id": null,
    "device_id": "412148a8ec0f5f9ba347008bb9c48d19",
    "disabled_by": null,
    "entity_id": "binary_sensor.aqara_curtain_driver_e1_problem_4",
    "hidden_by": null,
    "name": null,
    "original_name": "Problem",
    "platform": "matter"
  },
  {
    "area_id": null,
    "device_id": "412148a8ec0f5f9ba347008bb9c48d19",
    "disabled_by": null,
    "entity_id": "button.aqara_curtain_driver_e1_identify_4",
    "hidden_by": null,
    "name": null,
    "original_name": "Identify",
    "platform": "matter"
  },
  {
    "area_id": null,
    "device_id": "412148a8ec0f5f9ba347008bb9c48d19",
    "disabled_by": null,
    "entity_id": "cover.aqara_curtain_driver_e1_4",
    "hidden_by": null,
    "name": null,
    "original_name": null,
    "platform": "matter"
  },
  {
    "area_id": null,
    "device_id": "412148a8ec0f5f9ba347008bb9c48d19",
    "disabled_by": null,
    "entity_id": "sensor.aqara_curtain_driver_e1_battery_4",
    "hidden_by": null,
    "name": null,
    "original_name": "Battery",
    "platform": "matter"
  },
  {
    "area_id": null,
    "device_id": "412148a8ec0f5f9ba347008bb9c48d19",
    "disabled_by": null,
    "entity_id": "sensor.aqara_curtain_driver_e1_battery_voltage_4",
    "hidden_by": null,
    "name": null,
    "original_name": "Battery voltage",
    "platform": "matter"
  },
  {
    "area_id": null,
    "device_id": "412148a8ec0f5f9ba347008bb9c48d19",
    "disabled_by": null,
    "entity_id": "sensor.aqara_curtain_driver_e1_battery_charge_state_4",
    "hidden_by": null,
    "name": null,
    "original_name": "Battery charge state",
    "platform": "matter"
  },
  {
    "area_id": null,
    "device_id": "412148a8ec0f5f9ba347008bb9c48d19",
    "disabled_by": "integration",
    "entity_id": "sensor.aqara_curtain_driver_e1_target_opening_position_4",
    "hidden_by": null,
    "name": null,
    "original_name": "Target opening position",
    "platform": "matter"
  },
  {
    "area_id": null,
    "device_id": "a5cccdcd99030b787285cf002880f130",
    "disabled_by": null,
    "entity_id": "binary_sensor.aqara_presence_sensor_fp1e_occupancy_3",
    "hidden_by": null,
    "name": null,
    "original_name": "Occupancy",
    "platform": "matter"
  },
  {
    "area_id": null,
    "device_id": "a5cccdcd99030b787285cf002880f130",
    "disabled_by": null,
    "entity_id": "button.aqara_presence_sensor_fp1e_identify_3",
    "hidden_by": null,
    "name": null,
    "original_name": "Identify",
    "platform": "matter"
  },
  {
    "area_id": null,
    "device_id": "c9d8d61f1d40653e629c68ceabddf488",
    "disabled_by": null,
    "entity_id": "binary_sensor.aqara_motion_sensor_p1_occupancy_3",
    "hidden_by": null,
    "name": null,
    "original_name": "Occupancy",
    "platform": "matter"
  },
  {
    "area_id": null,
    "device_id": "c9d8d61f1d40653e629c68ceabddf488",
    "disabled_by": null,
    "entity_id": "button.aqara_motion_sensor_p1_identify_3",
    "hidden_by": null,
    "name": null,
    "original_name": "Identify",
    "platform": "matter"
  },
  {
    "area_id": null,
    "device_id": "c9d8d61f1d40653e629c68ceabddf488",
    "disabled_by": null,
    "entity_id": "sensor.aqara_motion_sensor_p1_battery_3",
    "hidden_by": null,
    "name": null,
    "original_name": "Battery",
    "platform": "matter"
  },
  {
    "area_id": null,
    "device_id": "c9d8d61f1d40653e629c68ceabddf488",
    "disabled_by": null,
    "entity_id": "sensor.aqara_motion_sensor_p1_battery_voltage_3",
    "hidden_by": null,
    "name": null,
    "original_name": "Battery voltage",
    "platform": "matter"
  },
  {
    "area_id": null,
    "device_id": "c9d8d61f1d40653e629c68ceabddf488",
    "disabled_by": null,
    "entity_id": "sensor.aqara_motion_sensor_p1_battery_type_3",
    "hidden_by": null,
    "name": null,
    "original_name": "Battery type",
    "platform": "matter"
  },
  {
    "area_id": null,
    "device_id": "5f9599ebee4bf62fc9fb3038a1819397",
    "disabled_by": null,
    "entity_id": "binary_sensor.aqara_motion_sensor_p1_occupancy_4",
    "hidden_by": null,
    "name": null,
    "original_name": "Occupancy",
    "platform": "matter"
  },
  {
    "area_id": null,
    "device_id": "5f9599ebee4bf62fc9fb3038a1819397",
    "disabled_by": null,
    "entity_id": "button.aqara_motion_sensor_p1_identify_4",
    "hidden_by": null,
    "name": null,
    "original_name": "Identify",
    "platform": "matter"
  },
  {
    "area_id": null,
    "device_id": "5f9599ebee4bf62fc9fb3038a1819397",
    "disabled_by": null,
    "entity_id": "sensor.aqara_motion_sensor_p1_battery_4",
    "hidden_by": null,
    "name": null,
    "original_name": "Battery",
    "platform": "matter"
  },
  {
    "area_id": null,
    "device_id": "5f9599ebee4bf62fc9fb3038a1819397",
    "disabled_by": null,
    "entity_id": "sensor.aqara_motion_sensor_p1_battery_voltage_4",
    "hidden_by": null,
    "name": null,
    "original_name": "Battery voltage",
    "platform": "matter"
  },
  {
    "area_id": null,
    "device_id": "5f9599ebee4bf62fc9fb3038a1819397",
    "disabled_by": null,
    "entity_id": "sensor.aqara_motion_sensor_p1_battery_type_4",
    "hidden_by": null,
    "name": null,
    "original_name": "Battery type",
    "platform": "matter"
  },
  {
    "area_id": null,
    "device_id": "50568567cd5b532f7c719f8af20887d5",
    "disabled_by": null,
    "entity_id": "sensor.aqara_wireless_remote_switch_battery_2",
    "hidden_by": null,
    "name": null,
    "original_name": "Battery",
    "platform": "matter"
  },
  {
    "area_id": null,
    "device_id": "50568567cd5b532f7c719f8af20887d5",
    "disabled_by": null,
    "entity_id": "sensor.aqara_wireless_remote_switch_battery_voltage_2",
    "hidden_by": null,
    "name": null,
    "original_name": "Battery voltage",
    "platform": "matter"
  },
  {
    "area_id": null,
    "device_id": "50568567cd5b532f7c719f8af20887d5",
    "disabled_by": null,
    "entity_id": "sensor.aqara_wireless_remote_switch_battery_type_2",
    "hidden_by": null,
    "name": null,
    "original_name": "Battery type",
    "platform": "matter"
  },
  {
    "area_id": null,
    "device_id": "50568567cd5b532f7c719f8af20887d5",
    "disabled_by": null,
    "entity_id": "button.aqara_wireless_remote_switch_identify_3",
    "hidden_by": null,
    "name": null,
    "original_name": "Identify",
    "platform": "matter"
  },
  {
    "area_id": null,
    "device_id": "50568567cd5b532f7c719f8af20887d5",
    "disabled_by": null,
    "entity_id": "event.aqara_wireless_remote_switch_button_3",
    "hidden_by": null,
    "name": null,
    "original_name": "Button",
    "platform": "matter"
  },
  {
    "area_id": null,
    "device_id": "50568567cd5b532f7c719f8af20887d5",
    "disabled_by": "integration",
    "entity_id": "sensor.aqara_wireless_remote_switch_current_switch_position_3",
    "hidden_by": null,
    "name": null,
    "original_name": "Current switch position",
    "platform": "matter"
  },
  {
    "area_id": null,
    "device_id": "50568567cd5b532f7c719f8af20887d5",
    "disabled_by": null,
    "entity_id": "button.aqara_wireless_remote_switch_identify_4",
    "hidden_by": null,
    "name": null,
    "original_name": "Identify",
    "platform": "matter"
  },
  {
    "area_id": null,
    "device_id": "50568567cd5b532f7c719f8af20887d5",
    "disabled_by": null,
    "entity_id": "event.aqara_wireless_remote_switch_button_4",
    "hidden_by": null,
    "name": null,
    "original_name": "Button",
    "platform": "matter"
  },
  {
    "area_id": null,
    "device_id": "50568567cd5b532f7c719f8af20887d5",
    "disabled_by": "integration",
    "entity_id": "sensor.aqara_wireless_remote_switch_current_switch_position_4",
    "hidden_by": null,
    "name": null,
    "original_name": "Current switch position",
    "platform": "matter"
  },
  {
    "area_id": null,
    "device_id": "2668f542fc4a530b359a16f4de5cb7e8",
    "disabled_by": null,
    "entity_id": "binary_sensor.aqara_presence_sensor_fp1e_occupancy_4",
    "hidden_by": null,
    "name": null,
    "original_name": "Occupancy",
    "platform": "matter"
  },
  {
    "area_id": null,
    "device_id": "2668f542fc4a530b359a16f4de5cb7e8",
    "disabled_by": null,
    "entity_id": "button.aqara_presence_sensor_fp1e_identify_4",
    "hidden_by": null,
    "name": null,
    "original_name": "Identify",
    "platform": "matter"
  },
  {
    "area_id": null,
    "device_id": "d2d4396241886122805bf4a3ee0450bf",
    "disabled_by": null,
    "entity_id": "media_player.nesthubd029",
    "hidden_by": null,
    "name": null,
    "original_name": null,
    "platform": "cast"
  },
  {
    "area_id": null,
    "device_id": "fb3b52c889646a1c8fc6bc77fe30205b",
    "disabled_by": null,
    "entity_id": "media_player.nesthubd029_2",
    "hidden_by": null,
    "name": null,
    "original_name": null,
    "platform": "cast"
  },
  {
    "area_id": null,
    "device_id": "dcd0cddfa4a2499b515bac0840fc7abf",
    "disabled_by": null,
    "entity_id": "binary_sensor.roller_shade_0a_problem",
    "hidden_by": null,
    "name": null,
    "original_name": "Problem",
    "platform": "matter"
  },
  {
    "area_id": null,
    "device_id": "dcd0cddfa4a2499b515bac0840fc7abf",
    "disabled_by": null,
    "entity_id": "sensor.roller_shade_0a_battery",
    "hidden_by": null,
    "name": null,
    "original_name": "Battery",
    "platform": "matter"
  },
  {
    "area_id": null,
    "device_id": "dcd0cddfa4a2499b515bac0840fc7abf",
    "disabled_by": null,
    "entity_id": "cover.roller_shade_0a",
    "hidden_by": null,
    "name": null,
    "original_name": null,
    "platform": "matter"
  },
  {
    "area_id": null,
    "device_id": "dcd0cddfa4a2499b515bac0840fc7abf",
    "disabled_by": "integration",
    "entity_id": "sensor.roller_shade_0a_target_opening_position",
    "hidden_by": null,
    "name": null,
    "original_name": "Target opening position",
    "platform": "matter"
  },
  {
    "area_id": null,
    "device_id": "264736363a5bf620236a739daa0a1bb0",
    "disabled_by": null,
    "entity_id": "binary_sensor.roller_shade_84_problem",
    "hidden_by": null,
    "name": null,
    "original_name": "Problem",
    "platform": "matter"
  },
  {
    "area_id": null,
    "device_id": "264736363a5bf620236a739daa0a1bb0",
    "disabled_by": null,
    "entity_id": "sensor.roller_shade_84_battery",
    "hidden_by": null,
    "name": null,
    "original_name": "Battery",
    "platform": "matter"
  },
  {
    "area_id": null,
    "device_id": "264736363a5bf620236a739daa0a1bb0",
    "disabled_by": null,
    "entity_id": "cover.roller_shade_84",
    "hidden_by": null,
    "name": null,
    "original_name": null,
    "platform": "matter"
  },
  {
    "area_id": null,
    "device_id": "264736363a5bf620236a739daa0a1bb0",
    "disabled_by": "integration",
    "entity_id": "sensor.roller_shade_84_target_opening_position",
    "hidden_by": null,
    "name": null,
    "original_name": "Target opening position",
    "platform": "matter"
  },
  {
    "area_id": null,
    "device_id": "9beffa7c4c3798840d68b0965a880731",
    "disabled_by": null,
    "entity_id": "event.hub_3_button_3_button",
    "hidden_by": null,
    "name": null,
    "original_name": "Button",
    "platform": "matter"
  },
  {
    "area_id": null,
    "device_id": "9beffa7c4c3798840d68b0965a880731",
    "disabled_by": "integration",
    "entity_id": "sensor.hub_3_button_3_current_switch_position",
    "hidden_by": null,
    "name": null,
    "original_name": "Current switch position",
    "platform": "matter"
  },
  {
    "area_id": null,
    "device_id": "e1e44b9e90ff621f67173abf1228ec8f",
    "disabled_by": null,
    "entity_id": "sensor.bot_4a_battery",
    "hidden_by": null,
    "name": null,
    "original_name": "Battery",
    "platform": "matter"
  },
  {
    "area_id": null,
    "device_id": "e1e44b9e90ff621f67173abf1228ec8f",
    "disabled_by": null,
    "entity_id": "switch.bot_4a",
    "hidden_by": null,
    "name": null,
    "original_name": null,
    "platform": "matter"
  },
  {
    "area_id": null,
    "device_id": "c61c4551d3ec38cda5ef874359c7d174",
    "disabled_by": null,
    "entity_id": "binary_sensor.hue_motion_sensor_motion",
    "hidden_by": null,
    "name": null,
    "original_name": "Motion",
    "platform": "hue"
  },
  {
    "area_id": null,
    "device_id": "3a26058d1afa9fa8888a9b3865c8eaa7",
    "disabled_by": null,
    "entity_id": "binary_sensor.hue_motion_sensor_motion_2",
    "hidden_by": null,
    "name": null,
    "original_name": "Motion",
    "platform": "hue"
  },
  {
    "area_id": null,
    "device_id": "6d7b499febad4be04c50281d66c355b9",
    "disabled_by": null,
    "entity_id": "binary_sensor.secondary_bathroom_motion",
    "hidden_by": null,
    "name": null,
    "original_name": "Motion",
    "platform": "hue"
  },
  {
    "area_id": null,
    "device_id": "117c704d9e32a6e962854eb81789dab3",
    "disabled_by": null,
    "entity_id": "binary_sensor.bathroom_motion",
    "hidden_by": null,
    "name": null,
    "original_name": "Motion",
    "platform": "hue"
  },
  {
    "area_id": null,
    "device_id": "a8a5ae19c7ced86ad29d7245978c0d56",
    "disabled_by": null,
    "entity_id": "binary_sensor.hallway_motionaware_ceiling",
    "hidden_by": null,
    "name": null,
    "original_name": "Hallway MotionAware Ceiling",
    "platform": "hue"
  },
  {
    "area_id": null,
    "device_id": "7158827f268292c33df8d3ac80d77f8b",
    "disabled_by": null,
    "entity_id": "event.hallway_dimmer_switch_button_1",
    "hidden_by": null,
    "name": null,
    "original_name": "Button 1",
    "platform": "hue"
  },
  {
    "area_id": null,
    "device_id": "f3a36de300c078041de5869a79f49dbe",
    "disabled_by": null,
    "entity_id": "event.alpha_bedroom_dial_switch_button_4",
    "hidden_by": null,
    "name": null,
    "original_name": "Button 4",
    "platform": "hue"
  },
  {
    "area_id": null,
    "device_id": "9f1606f2d60df3ef87d614354986c424",
    "disabled_by": null,
    "entity_id": "event.core_tap_dial_light_switch_button_2",
    "hidden_by": null,
    "name": null,
    "original_name": "Button 2",
    "platform": "hue"
  },
  {
    "area_id": null,
    "device_id": "0a7d029aeef8c21cb1ed5d3be91ad78e",
    "disabled_by": null,
    "entity_id": "event.splash_dimmer_switch_button_1",
    "hidden_by": null,
    "name": null,
    "original_name": "Button 1",
    "platform": "hue"
  },
  {
    "area_id": null,
    "device_id": "b8a1e7c445f4889533cbd7600f709aee",
    "disabled_by": null,
    "entity_id": "event.hallway_tap_dial_switch_button_3",
    "hidden_by": null,
    "name": null,
    "original_name": "Button 3",
    "platform": "hue"
  },
  {
    "area_id": null,
    "device_id": "f3a36de300c078041de5869a79f49dbe",
    "disabled_by": null,
    "entity_id": "event.alpha_bedroom_dial_switch_button_3",
    "hidden_by": null,
    "name": null,
    "original_name": "Button 3",
    "platform": "hue"
  },
  {
    "area_id": null,
    "device_id": "0a7d029aeef8c21cb1ed5d3be91ad78e",
    "disabled_by": null,
    "entity_id": "event.splash_dimmer_switch_button_3",
    "hidden_by": null,
    "name": null,
    "original_name": "Button 3",
    "platform": "hue"
  },
  {
    "area_id": null,
    "device_id": "b8a1e7c445f4889533cbd7600f709aee",
    "disabled_by": null,
    "entity_id": "event.hallway_tap_dial_switch_button_1",
    "hidden_by": null,
    "name": null,
    "original_name": "Button 1",
    "platform": "hue"
  },
  {
    "area_id": null,
    "device_id": "9f1606f2d60df3ef87d614354986c424",
    "disabled_by": null,
    "entity_id": "event.core_tap_dial_light_switch_button_4",
    "hidden_by": null,
    "name": null,
    "original_name": "Button 4",
    "platform": "hue"
  },
  {
    "area_id": null,
    "device_id": "f3a36de300c078041de5869a79f49dbe",
    "disabled_by": null,
    "entity_id": "event.alpha_bedroom_dial_switch_button_2",
    "hidden_by": null,
    "name": null,
    "original_name": "Button 2",
    "platform": "hue"
  },
  {
    "area_id": null,
    "device_id": "b8a1e7c445f4889533cbd7600f709aee",
    "disabled_by": null,
    "entity_id": "event.hallway_tap_dial_switch_button_4",
    "hidden_by": null,
    "name": null,
    "original_name": "Button 4",
    "platform": "hue"
  },
  {
    "area_id": null,
    "device_id": "9262c97c808756f1c42c9a5f56d07b44",
    "disabled_by": null,
    "entity_id": "event.bathroom_dimmer_switch_button_2",
    "hidden_by": null,
    "name": null,
    "original_name": "Button 2",
    "platform": "hue"
  },
  {
    "area_id": null,
    "device_id": "da1dd2355bbec3191d522313064aa97c",
    "disabled_by": null,
    "entity_id": "event.hue_smart_button_2_button_1",
    "hidden_by": null,
    "name": null,
    "original_name": "Button 1",
    "platform": "hue"
  },
  {
    "area_id": null,
    "device_id": "9f1606f2d60df3ef87d614354986c424",
    "disabled_by": null,
    "entity_id": "event.core_tap_dial_light_switch_button_3",
    "hidden_by": null,
    "name": null,
    "original_name": "Button 3",
    "platform": "hue"
  },
  {
    "area_id": null,
    "device_id": "9262c97c808756f1c42c9a5f56d07b44",
    "disabled_by": null,
    "entity_id": "event.bathroom_dimmer_switch_button_4",
    "hidden_by": null,
    "name": null,
    "original_name": "Button 4",
    "platform": "hue"
  },
  {
    "area_id": null,
    "device_id": "0a7d029aeef8c21cb1ed5d3be91ad78e",
    "disabled_by": null,
    "entity_id": "event.splash_dimmer_switch_button_4",
    "hidden_by": null,
    "name": null,
    "original_name": "Button 4",
    "platform": "hue"
  },
  {
    "area_id": null,
    "device_id": "027c1c392e1914472aebdad116e88d1f",
    "disabled_by": null,
    "entity_id": "event.hue_smart_button_3_button_1",
    "hidden_by": null,
    "name": null,
    "original_name": "Button 1",
    "platform": "hue"
  },
  {
    "area_id": null,
    "device_id": "b8a1e7c445f4889533cbd7600f709aee",
    "disabled_by": null,
    "entity_id": "event.hallway_tap_dial_switch_button_2",
    "hidden_by": null,
    "name": null,
    "original_name": "Button 2",
    "platform": "hue"
  },
  {
    "area_id": null,
    "device_id": "9262c97c808756f1c42c9a5f56d07b44",
    "disabled_by": null,
    "entity_id": "event.bathroom_dimmer_switch_button_3",
    "hidden_by": null,
    "name": null,
    "original_name": "Button 3",
    "platform": "hue"
  },
  {
    "area_id": null,
    "device_id": "7158827f268292c33df8d3ac80d77f8b",
    "disabled_by": null,
    "entity_id": "event.hallway_dimmer_switch_button_3",
    "hidden_by": null,
    "name": null,
    "original_name": "Button 3",
    "platform": "hue"
  },
  {
    "area_id": null,
    "device_id": "0a7d029aeef8c21cb1ed5d3be91ad78e",
    "disabled_by": null,
    "entity_id": "event.splash_dimmer_switch_button_2",
    "hidden_by": null,
    "name": null,
    "original_name": "Button 2",
    "platform": "hue"
  },
  {
    "area_id": null,
    "device_id": "f3a36de300c078041de5869a79f49dbe",
    "disabled_by": null,
    "entity_id": "event.alpha_bedroom_dial_switch_button_1",
    "hidden_by": null,
    "name": null,
    "original_name": "Button 1",
    "platform": "hue"
  },
  {
    "area_id": null,
    "device_id": "7158827f268292c33df8d3ac80d77f8b",
    "disabled_by": null,
    "entity_id": "event.hallway_dimmer_switch_button_4",
    "hidden_by": null,
    "name": null,
    "original_name": "Button 4",
    "platform": "hue"
  },
  {
    "area_id": null,
    "device_id": "7158827f268292c33df8d3ac80d77f8b",
    "disabled_by": null,
    "entity_id": "event.hallway_dimmer_switch_button_2",
    "hidden_by": null,
    "name": null,
    "original_name": "Button 2",
    "platform": "hue"
  },
  {
    "area_id": null,
    "device_id": "500c186b1b951c54ec8b27c162c9e452",
    "disabled_by": null,
    "entity_id": "event.alpha_hue_smart_button_button_1",
    "hidden_by": null,
    "name": null,
    "original_name": "Button 1",
    "platform": "hue"
  },
  {
    "area_id": null,
    "device_id": "9262c97c808756f1c42c9a5f56d07b44",
    "disabled_by": null,
    "entity_id": "event.bathroom_dimmer_switch_button_1",
    "hidden_by": null,
    "name": null,
    "original_name": "Button 1",
    "platform": "hue"
  },
  {
    "area_id": null,
    "device_id": "9f1606f2d60df3ef87d614354986c424",
    "disabled_by": null,
    "entity_id": "event.core_tap_dial_light_switch_button_1",
    "hidden_by": null,
    "name": null,
    "original_name": "Button 1",
    "platform": "hue"
  },
  {
    "area_id": null,
    "device_id": "b8a1e7c445f4889533cbd7600f709aee",
    "disabled_by": null,
    "entity_id": "event.hallway_tap_dial_switch_rotary",
    "hidden_by": null,
    "name": null,
    "original_name": "Rotary",
    "platform": "hue"
  },
  {
    "area_id": null,
    "device_id": "9f1606f2d60df3ef87d614354986c424",
    "disabled_by": null,
    "entity_id": "event.core_tap_dial_light_switch_rotary",
    "hidden_by": null,
    "name": null,
    "original_name": "Rotary",
    "platform": "hue"
  },
  {
    "area_id": null,
    "device_id": "f3a36de300c078041de5869a79f49dbe",
    "disabled_by": null,
    "entity_id": "event.alpha_bedroom_dial_switch_rotary",
    "hidden_by": null,
    "name": null,
    "original_name": "Rotary",
    "platform": "hue"
  },
  {
    "area_id": null,
    "device_id": "712dfdefa747a25fb6b5491f50d4fc77",
    "disabled_by": null,
    "entity_id": "light.splash_ceiling_light_1",
    "hidden_by": null,
    "name": null,
    "original_name": null,
    "platform": "hue"
  },
  {
    "area_id": null,
    "device_id": "a3f86e911440eba9848a331183d010d2",
    "disabled_by": null,
    "entity_id": "light.right_bedside_lamp",
    "hidden_by": null,
    "name": null,
    "original_name": null,
    "platform": "hue"
  },
  {
    "area_id": null,
    "device_id": "eb2058653fe9e0f95ad5aa8018b97de2",
    "disabled_by": null,
    "entity_id": "light.alpha_ceiling_light_4",
    "hidden_by": null,
    "name": null,
    "original_name": null,
    "platform": "hue"
  },
  {
    "area_id": null,
    "device_id": "cac5cdcc358702139ac465f8994f9e83",
    "disabled_by": null,
    "entity_id": "light.core_ceiling_light_2",
    "hidden_by": null,
    "name": null,
    "original_name": null,
    "platform": "hue"
  },
  {
    "area_id": null,
    "device_id": "ba9d7d9777253c445066c26aca659483",
    "disabled_by": null,
    "entity_id": "light.alpha_ceiling_light_6",
    "hidden_by": null,
    "name": null,
    "original_name": null,
    "platform": "hue"
  },
  {
    "area_id": null,
    "device_id": "fbfcf983165eca43796973ac96dfd87f",
    "disabled_by": null,
    "entity_id": "light.pass_ceiling_light_4",
    "hidden_by": null,
    "name": null,
    "original_name": null,
    "platform": "hue"
  },
  {
    "area_id": null,
    "device_id": "5c5088969773c38740cbd5f823f58d65",
    "disabled_by": null,
    "entity_id": "light.nymane_3_spot_lamp_mid",
    "hidden_by": null,
    "name": null,
    "original_name": null,
    "platform": "hue"
  },
  {
    "area_id": null,
    "device_id": "2e19b66efcd2fdf07d25df6ff0dd9518",
    "disabled_by": null,
    "entity_id": "light.nymane_3_spot_lamp_low",
    "hidden_by": null,
    "name": null,
    "original_name": null,
    "platform": "hue"
  },
  {
    "area_id": null,
    "device_id": "b4da620be9a589bb9a2039e1ab78ebef",
    "disabled_by": null,
    "entity_id": "light.throne_ceiling_light_4",
    "hidden_by": null,
    "name": null,
    "original_name": null,
    "platform": "hue"
  },
  {
    "area_id": null,
    "device_id": "f8149a06f87fed8bb2412cf2fea76be7",
    "disabled_by": null,
    "entity_id": "light.core_ceiling_light_7",
    "hidden_by": null,
    "name": "Core Ceiling Light.7",
    "original_name": null,
    "platform": "hue"
  },
  {
    "area_id": null,
    "device_id": "dc71020d45c5332607408e59045efbf9",
    "disabled_by": null,
    "entity_id": "light.beta_ceiling_light_6",
    "hidden_by": null,
    "name": null,
    "original_name": null,
    "platform": "hue"
  },
  {
    "area_id": null,
    "device_id": "55f7455e695e1ce7fdddb9b06f95ac1e",
    "disabled_by": null,
    "entity_id": "light.alphabed_ceiling_light_5_2",
    "hidden_by": null,
    "name": null,
    "original_name": null,
    "platform": "hue"
  },
  {
    "area_id": null,
    "device_id": "5d5d2cd72b6952b59a09cb567a37284c",
    "disabled_by": null,
    "entity_id": "light.alphabed_ceiling_light_3",
    "hidden_by": null,
    "name": null,
    "original_name": null,
    "platform": "hue"
  },
  {
    "area_id": null,
    "device_id": "529049bbc4a02b9ebd873f19ca3412da",
    "disabled_by": null,
    "entity_id": "light.beige_ola_spotlight_lamp",
    "hidden_by": null,
    "name": null,
    "original_name": null,
    "platform": "hue"
  },
  {
    "area_id": null,
    "device_id": "a1493cb9fc881b1421e04687bc9553a3",
    "disabled_by": null,
    "entity_id": "light.pass_ceiling_light_1_2",
    "hidden_by": null,
    "name": null,
    "original_name": null,
    "platform": "hue"
  },
  {
    "area_id": null,
    "device_id": "cc79d7dfe1b17181869f10c35cc4c833",
    "disabled_by": null,
    "entity_id": "light.laundry_chaos_ceiling_light",
    "hidden_by": null,
    "name": null,
    "original_name": null,
    "platform": "hue"
  },
  {
    "area_id": null,
    "device_id": "c27b8a08b76af2ed70e81a475a781ac8",
    "disabled_by": null,
    "entity_id": "light.betaflex_ceiling_light_2",
    "hidden_by": null,
    "name": null,
    "original_name": null,
    "platform": "hue"
  },
  {
    "area_id": null,
    "device_id": "ec259a6304fedd4f2569aa942ef6edb9",
    "disabled_by": null,
    "entity_id": "light.beta_ceiling_light_3",
    "hidden_by": null,
    "name": null,
    "original_name": null,
    "platform": "hue"
  },
  {
    "area_id": null,
    "device_id": "d89bf5602e1724bf0b26f43bf6866f40",
    "disabled_by": null,
    "entity_id": "light.hue_play_1",
    "hidden_by": null,
    "name": null,
    "original_name": null,
    "platform": "hue"
  },
  {
    "area_id": null,
    "device_id": "11501df1df87e0a6ea1a99334fded6d2",
    "disabled_by": null,
    "entity_id": "light.core_ceiling_light_8",
    "hidden_by": null,
    "name": null,
    "original_name": null,
    "platform": "hue"
  },
  {
    "area_id": null,
    "device_id": "fb3b1cc5cd84b7435b46d79ba3160450",
    "disabled_by": null,
    "entity_id": "light.betaflex_ceiling_light_1",
    "hidden_by": null,
    "name": "Betaflex Ceiling Light.1",
    "original_name": null,
    "platform": "hue"
  },
  {
    "area_id": null,
    "device_id": "c2789cbe73d4b79832da4a6a2e328737",
    "disabled_by": null,
    "entity_id": "light.signe_gradient_floor_1",
    "hidden_by": null,
    "name": null,
    "original_name": null,
    "platform": "hue"
  },
  {
    "area_id": null,
    "device_id": "b9139ec0152442d7ffe7ec7119dfec48",
    "disabled_by": null,
    "entity_id": "light.fado_glass_globe_lamp",
    "hidden_by": null,
    "name": null,
    "original_name": null,
    "platform": "hue"
  },
  {
    "area_id": null,
    "device_id": "7ad73057c31770c617cd496edba33088",
    "disabled_by": null,
    "entity_id": "light.throne_ceiling_light_3",
    "hidden_by": null,
    "name": null,
    "original_name": null,
    "platform": "hue"
  },
  {
    "area_id": null,
    "device_id": "c1c74acf710e8ce06117655e979e893e",
    "disabled_by": null,
    "entity_id": "light.core_ceiling_light_4",
    "hidden_by": null,
    "name": null,
    "original_name": null,
    "platform": "hue"
  },
  {
    "area_id": null,
    "device_id": "2c9a65b5226b60f36e9fa994d5db3e92",
    "disabled_by": null,
    "entity_id": "light.hue_smart_plug_1",
    "hidden_by": null,
    "name": null,
    "original_name": null,
    "platform": "hue"
  },
  {
    "area_id": null,
    "device_id": "e6939abcf85960114033763df1633e2e",
    "disabled_by": null,
    "entity_id": "light.hue_play_2",
    "hidden_by": null,
    "name": null,
    "original_name": null,
    "platform": "hue"
  },
  {
    "area_id": null,
    "device_id": "de3a3b86f9f861abd8474a0bbee6e039",
    "disabled_by": null,
    "entity_id": "light.core_ceiling_light_10",
    "hidden_by": null,
    "name": null,
    "original_name": null,
    "platform": "hue"
  },
  {
    "area_id": null,
    "device_id": "345f22c2aac0cf310cc467f20ad291d4",
    "disabled_by": null,
    "entity_id": "light.splash_ceiling_light_3",
    "hidden_by": null,
    "name": null,
    "original_name": null,
    "platform": "hue"
  },
  {
    "area_id": null,
    "device_id": "f2bdc76a73830aa7fa6193766aed417e",
    "disabled_by": null,
    "entity_id": "light.core_ceiling_light_6",
    "hidden_by": null,
    "name": null,
    "original_name": null,
    "platform": "hue"
  },
  {
    "area_id": null,
    "device_id": "f72d9da87ad9f369da5b9fa4bccfb8aa",
    "disabled_by": null,
    "entity_id": "light.white_e27_hue_bulb",
    "hidden_by": null,
    "name": null,
    "original_name": null,
    "platform": "hue"
  },
  {
    "area_id": null,
    "device_id": "f31d63cbe41b5f1acd30ad687951c840",
    "disabled_by": null,
    "entity_id": "light.core_ceiling_light_9",
    "hidden_by": null,
    "name": null,
    "original_name": null,
    "platform": "hue"
  },
  {
    "area_id": null,
    "device_id": "33028e1253bd920ca8025d846edbb6e6",
    "disabled_by": null,
    "entity_id": "light.splash_ceiling_light_2",
    "hidden_by": null,
    "name": null,
    "original_name": null,
    "platform": "hue"
  },
  {
    "area_id": null,
    "device_id": "d9da816eb1ea175c045b94dda1fab89c",
    "disabled_by": null,
    "entity_id": "light.beta_bed_lightstrip",
    "hidden_by": null,
    "name": null,
    "original_name": null,
    "platform": "hue"
  },
  {
    "area_id": null,
    "device_id": "33595151421af22100a3e06457f0d43f",
    "disabled_by": null,
    "entity_id": "light.klasnick_beige_table_lamp_with_e14_hue_colour",
    "hidden_by": null,
    "name": null,
    "original_name": null,
    "platform": "hue"
  },
  {
    "area_id": null,
    "device_id": "d82ba9da0b831576a30a6202b35686cc",
    "disabled_by": null,
    "entity_id": "light.beta_ceiling_light_3_2",
    "hidden_by": null,
    "name": null,
    "original_name": null,
    "platform": "hue"
  },
  {
    "area_id": null,
    "device_id": "b282b813d0ba73db7eb149a8fccfd390",
    "disabled_by": null,
    "entity_id": "light.pass_ceiling_light_5",
    "hidden_by": null,
    "name": null,
    "original_name": null,
    "platform": "hue"
  },
  {
    "area_id": null,
    "device_id": "5200e66fdc90aad0dd0cbceb76c22319",
    "disabled_by": null,
    "entity_id": "light.splash_ceiling_light_4",
    "hidden_by": null,
    "name": null,
    "original_name": null,
    "platform": "hue"
  },
  {
    "area_id": null,
    "device_id": "543d647ade89fd9e32afd034b4937846",
    "disabled_by": null,
    "entity_id": "light.nyamane_3_spot_lamp_top",
    "hidden_by": null,
    "name": null,
    "original_name": null,
    "platform": "hue"
  },
  {
    "area_id": null,
    "device_id": "1fc62b8e8aa80845dc7cb23e3f0bc24f",
    "disabled_by": null,
    "entity_id": "light.pass_ceiling_light_1",
    "hidden_by": null,
    "name": null,
    "original_name": null,
    "platform": "hue"
  },
  {
    "area_id": null,
    "device_id": "062b0dbde1538a39a2caddb290a7f1ec",
    "disabled_by": null,
    "entity_id": "light.throne_ceiling_light_3_2",
    "hidden_by": null,
    "name": null,
    "original_name": null,
    "platform": "hue"
  },
  {
    "area_id": null,
    "device_id": "1e9955f25dc9f5c09dcb90e0fb8d60dd",
    "disabled_by": null,
    "entity_id": "light.core_ceiling_light_1",
    "hidden_by": null,
    "name": null,
    "original_name": null,
    "platform": "hue"
  },
  {
    "area_id": null,
    "device_id": "c1c0e309ed8147ef57d651df415bc548",
    "disabled_by": null,
    "entity_id": "light.alphadoor_ceiling_light_6",
    "hidden_by": null,
    "name": "alphadoor ceiling light.6",
    "original_name": null,
    "platform": "hue"
  },
  {
    "area_id": null,
    "device_id": "9000c66a1b0d6684075d3e5c53d1543c",
    "disabled_by": null,
    "entity_id": "light.core_statement_arc_floor_lamp_monica_vibelucci",
    "hidden_by": null,
    "name": null,
    "original_name": null,
    "platform": "hue"
  },
  {
    "area_id": null,
    "device_id": "95dba2dec02b41db4ea3ca072dcdd6d0",
    "disabled_by": null,
    "entity_id": "light.beta_ceiling_light_4",
    "hidden_by": null,
    "name": null,
    "original_name": null,
    "platform": "hue"
  },
  {
    "area_id": null,
    "device_id": "c679070b7932d16308b82b9e3d646938",
    "disabled_by": null,
    "entity_id": "light.alphabed_ceiling_light_5",
    "hidden_by": null,
    "name": null,
    "original_name": null,
    "platform": "hue"
  },
  {
    "area_id": null,
    "device_id": "258fcb0a550539cc7ec6fffe58967e36",
    "disabled_by": null,
    "entity_id": "light.hue_signe_white_gradient_floor_lamp_1",
    "hidden_by": null,
    "name": null,
    "original_name": null,
    "platform": "hue"
  },
  {
    "area_id": null,
    "device_id": "1aecb535c3b242ba001f8fe849f0cc66",
    "disabled_by": null,
    "entity_id": "light.splash_ceiling_light_5",
    "hidden_by": null,
    "name": null,
    "original_name": null,
    "platform": "hue"
  },
  {
    "area_id": null,
    "device_id": "22a1188f6ffa438992b8004a39cd432f",
    "disabled_by": null,
    "entity_id": "light.throne_ceiling_light_2",
    "hidden_by": null,
    "name": null,
    "original_name": null,
    "platform": "hue"
  },
  {
    "area_id": null,
    "device_id": "81afd7db5465561e20df193ef451d0f4",
    "disabled_by": null,
    "entity_id": "light.signe_gradient_table_1",
    "hidden_by": null,
    "name": null,
    "original_name": null,
    "platform": "hue"
  },
  {
    "area_id": null,
    "device_id": "25fd95b77ffb4e30f911e0e44136680e",
    "disabled_by": null,
    "entity_id": "light.core_ceiling_light_5_2",
    "hidden_by": null,
    "name": null,
    "original_name": null,
    "platform": "hue"
  },
  {
    "area_id": null,
    "device_id": "e6b677474cc1f572d83596e2d103af6a",
    "disabled_by": null,
    "entity_id": "light.alpha_gradient_light_tube_1",
    "hidden_by": null,
    "name": null,
    "original_name": null,
    "platform": "hue"
  },
  {
    "area_id": null,
    "device_id": "b3b83fe3b391eaa9d7c5e917a8a028d1",
    "disabled_by": null,
    "entity_id": "light.pass_ceiling_light_2",
    "hidden_by": null,
    "name": null,
    "original_name": null,
    "platform": "hue"
  },
  {
    "area_id": null,
    "device_id": "7ff3eb57a4f7b8b83823e6bbc1cd43c0",
    "disabled_by": null,
    "entity_id": "light.core_ceiling_light_5",
    "hidden_by": null,
    "name": null,
    "original_name": null,
    "platform": "hue"
  },
  {
    "area_id": null,
    "device_id": "5525c9fb0db1dab203c66826dc6847a0",
    "disabled_by": null,
    "entity_id": "light.ola_whitborg_xl_floor_lamp",
    "hidden_by": null,
    "name": null,
    "original_name": null,
    "platform": "hue"
  },
  {
    "area_id": null,
    "device_id": "3c4a13dec7e554b24b395ff8bdc8fda5",
    "disabled_by": null,
    "entity_id": "light.laundry_room",
    "hidden_by": null,
    "name": null,
    "original_name": null,
    "platform": "hue"
  },
  {
    "area_id": null,
    "device_id": "117c704d9e32a6e962854eb81789dab3",
    "disabled_by": null,
    "entity_id": "light.bathroom",
    "hidden_by": null,
    "name": null,
    "original_name": null,
    "platform": "hue"
  },
  {
    "area_id": null,
    "device_id": "fa6e413f91600e74a6443af15cf1797b",
    "disabled_by": null,
    "entity_id": "light.kitchen_ceiling",
    "hidden_by": null,
    "name": null,
    "original_name": null,
    "platform": "hue"
  },
  {
    "area_id": null,
    "device_id": "2ca99b27e5a48523c674bcc99b7ee560",
    "disabled_by": null,
    "entity_id": "light.living_room_lamps",
    "hidden_by": null,
    "name": null,
    "original_name": null,
    "platform": "hue"
  },
  {
    "area_id": null,
    "device_id": "9bcdac103a6fe193a4cd1ff6864c8012",
    "disabled_by": null,
    "entity_id": "light.all_bedroom_bathroom",
    "hidden_by": null,
    "name": null,
    "original_name": null,
    "platform": "hue"
  },
  {
    "area_id": null,
    "device_id": "38f7ad003f2fa943ee7574fb8e21dcb2",
    "disabled_by": null,
    "entity_id": "light.spare_bedroom",
    "hidden_by": null,
    "name": null,
    "original_name": null,
    "platform": "hue"
  },
  {
    "area_id": null,
    "device_id": "50a528511760fe9c34e7301b1e2e3cc3",
    "disabled_by": null,
    "entity_id": "light.bedroom",
    "hidden_by": null,
    "name": null,
    "original_name": null,
    "platform": "hue"
  },
  {
    "area_id": null,
    "device_id": "a8a5ae19c7ced86ad29d7245978c0d56",
    "disabled_by": null,
    "entity_id": "light.hallway",
    "hidden_by": null,
    "name": null,
    "original_name": null,
    "platform": "hue"
  },
  {
    "area_id": null,
    "device_id": "34f94074f6947cf4bb83f5dcd89ffbd8",
    "disabled_by": null,
    "entity_id": "light.living_room_ceiling",
    "hidden_by": null,
    "name": null,
    "original_name": null,
    "platform": "hue"
  },
  {
    "area_id": null,
    "device_id": "c4511e091350b7f37d4f417193c8d386",
    "disabled_by": null,
    "entity_id": "light.kitchen",
    "hidden_by": null,
    "name": null,
    "original_name": null,
    "platform": "hue"
  },
  {
    "area_id": null,
    "device_id": "6d7b499febad4be04c50281d66c355b9",
    "disabled_by": null,
    "entity_id": "light.secondary_bathroom",
    "hidden_by": null,
    "name": null,
    "original_name": null,
    "platform": "hue"
  },
  {
    "area_id": null,
    "device_id": "b0e22adacb7b181d0195839086e46516",
    "disabled_by": null,
    "entity_id": "light.bedroom_ceiling",
    "hidden_by": null,
    "name": null,
    "original_name": null,
    "platform": "hue"
  },
  {
    "area_id": null,
    "device_id": "ee40c0ac85ca50f3ee21e699ac8f14ed",
    "disabled_by": null,
    "entity_id": "light.bedroom_lamps",
    "hidden_by": null,
    "name": null,
    "original_name": null,
    "platform": "hue"
  },
  {
    "area_id": null,
    "device_id": "d658ffac53d39553a6e2140b1e97cef0",
    "disabled_by": null,
    "entity_id": "light.living_room",
    "hidden_by": null,
    "name": null,
    "original_name": null,
    "platform": "hue"
  },
  {
    "area_id": null,
    "device_id": "0fade83b4b0b0f8f4cd529c4720bd2c2",
    "disabled_by": null,
    "entity_id": "light.beta_bedroom_bath",
    "hidden_by": null,
    "name": null,
    "original_name": null,
    "platform": "hue"
  },
  {
    "area_id": null,
    "device_id": "50a528511760fe9c34e7301b1e2e3cc3",
    "disabled_by": null,
    "entity_id": "scene.bedroom_sleepy",
    "hidden_by": null,
    "name": null,
    "original_name": "Sleepy",
    "platform": "hue"
  },
  {
    "area_id": null,
    "device_id": "a8a5ae19c7ced86ad29d7245978c0d56",
    "disabled_by": null,
    "entity_id": "scene.hallway_energise",
    "hidden_by": null,
    "name": null,
    "original_name": "Energise",
    "platform": "hue"
  },
  {
    "area_id": null,
    "device_id": "a8a5ae19c7ced86ad29d7245978c0d56",
    "disabled_by": null,
    "entity_id": "scene.hallway_nightlight",
    "hidden_by": null,
    "name": null,
    "original_name": "Nightlight",
    "platform": "hue"
  },
  {
    "area_id": null,
    "device_id": "a8a5ae19c7ced86ad29d7245978c0d56",
    "disabled_by": null,
    "entity_id": "scene.hallway_relax",
    "hidden_by": null,
    "name": null,
    "original_name": "Relax",
    "platform": "hue"
  },
  {
    "area_id": null,
    "device_id": "a8a5ae19c7ced86ad29d7245978c0d56",
    "disabled_by": null,
    "entity_id": "scene.hallway_concentrate",
    "hidden_by": null,
    "name": null,
    "original_name": "Concentrate",
    "platform": "hue"
  },
  {
    "area_id": null,
    "device_id": "a8a5ae19c7ced86ad29d7245978c0d56",
    "disabled_by": null,
    "entity_id": "scene.hallway_read",
    "hidden_by": null,
    "name": null,
    "original_name": "Read",
    "platform": "hue"
  },
  {
    "area_id": null,
    "device_id": "c61c4551d3ec38cda5ef874359c7d174",
    "disabled_by": null,
    "entity_id": "sensor.hue_motion_sensor_temperature",
    "hidden_by": null,
    "name": null,
    "original_name": "Temperature",
    "platform": "hue"
  },
  {
    "area_id": null,
    "device_id": "3a26058d1afa9fa8888a9b3865c8eaa7",
    "disabled_by": null,
    "entity_id": "sensor.hue_motion_sensor_temperature_2",
    "hidden_by": null,
    "name": null,
    "original_name": "Temperature",
    "platform": "hue"
  },
  {
    "area_id": null,
    "device_id": "3a26058d1afa9fa8888a9b3865c8eaa7",
    "disabled_by": null,
    "entity_id": "sensor.hue_motion_sensor_illuminance_2",
    "hidden_by": null,
    "name": null,
    "original_name": "Illuminance",
    "platform": "hue"
  },
  {
    "area_id": null,
    "device_id": "c61c4551d3ec38cda5ef874359c7d174",
    "disabled_by": null,
    "entity_id": "sensor.hue_motion_sensor_illuminance",
    "hidden_by": null,
    "name": null,
    "original_name": "Illuminance",
    "platform": "hue"
  },
  {
    "area_id": null,
    "device_id": "9262c97c808756f1c42c9a5f56d07b44",
    "disabled_by": null,
    "entity_id": "sensor.bathroom_dimmer_switch_battery",
    "hidden_by": null,
    "name": null,
    "original_name": "Battery",
    "platform": "hue"
  },
  {
    "area_id": null,
    "device_id": "7158827f268292c33df8d3ac80d77f8b",
    "disabled_by": null,
    "entity_id": "sensor.hallway_dimmer_switch_battery",
    "hidden_by": null,
    "name": null,
    "original_name": "Battery",
    "platform": "hue"
  },
  {
    "area_id": null,
    "device_id": "500c186b1b951c54ec8b27c162c9e452",
    "disabled_by": null,
    "entity_id": "sensor.alpha_hue_smart_button_battery",
    "hidden_by": null,
    "name": null,
    "original_name": "Battery",
    "platform": "hue"
  },
  {
    "area_id": null,
    "device_id": "f3a36de300c078041de5869a79f49dbe",
    "disabled_by": null,
    "entity_id": "sensor.alpha_bedroom_dial_switch_battery",
    "hidden_by": null,
    "name": null,
    "original_name": "Battery",
    "platform": "hue"
  },
  {
    "area_id": null,
    "device_id": "9f1606f2d60df3ef87d614354986c424",
    "disabled_by": null,
    "entity_id": "sensor.core_tap_dial_light_switch_battery",
    "hidden_by": null,
    "name": null,
    "original_name": "Battery",
    "platform": "hue"
  },
  {
    "area_id": null,
    "device_id": "3a26058d1afa9fa8888a9b3865c8eaa7",
    "disabled_by": null,
    "entity_id": "sensor.hue_motion_sensor_battery_2",
    "hidden_by": null,
    "name": null,
    "original_name": "Battery",
    "platform": "hue"
  },
  {
    "area_id": null,
    "device_id": "da1dd2355bbec3191d522313064aa97c",
    "disabled_by": null,
    "entity_id": "sensor.hue_smart_button_2_battery",
    "hidden_by": null,
    "name": null,
    "original_name": "Battery",
    "platform": "hue"
  },
  {
    "area_id": null,
    "device_id": "027c1c392e1914472aebdad116e88d1f",
    "disabled_by": null,
    "entity_id": "sensor.hue_smart_button_3_battery",
    "hidden_by": null,
    "name": null,
    "original_name": "Battery",
    "platform": "hue"
  },
  {
    "area_id": null,
    "device_id": "c61c4551d3ec38cda5ef874359c7d174",
    "disabled_by": null,
    "entity_id": "sensor.hue_motion_sensor_battery",
    "hidden_by": null,
    "name": null,
    "original_name": "Battery",
    "platform": "hue"
  },
  {
    "area_id": null,
    "device_id": "b8a1e7c445f4889533cbd7600f709aee",
    "disabled_by": null,
    "entity_id": "sensor.hallway_tap_dial_switch_battery",
    "hidden_by": null,
    "name": null,
    "original_name": "Battery",
    "platform": "hue"
  },
  {
    "area_id": null,
    "device_id": "0a7d029aeef8c21cb1ed5d3be91ad78e",
    "disabled_by": null,
    "entity_id": "sensor.splash_dimmer_switch_battery",
    "hidden_by": null,
    "name": null,
    "original_name": "Battery",
    "platform": "hue"
  },
  {
    "area_id": null,
    "device_id": "529049bbc4a02b9ebd873f19ca3412da",
    "disabled_by": "integration",
    "entity_id": "sensor.beige_ola_spotlight_lamp_zigbee_connectivity",
    "hidden_by": null,
    "name": null,
    "original_name": "Zigbee connectivity",
    "platform": "hue"
  },
  {
    "area_id": null,
    "device_id": "b282b813d0ba73db7eb149a8fccfd390",
    "disabled_by": "integration",
    "entity_id": "sensor.alpha_pass_ceiling_zigbee_connectivity",
    "hidden_by": null,
    "name": null,
    "original_name": "Zigbee connectivity",
    "platform": "hue"
  },
  {
    "area_id": null,
    "device_id": "c1c74acf710e8ce06117655e979e893e",
    "disabled_by": "integration",
    "entity_id": "sensor.ceiling_open_plan_se_zigbee_connectivity",
    "hidden_by": null,
    "name": null,
    "original_name": "Zigbee connectivity",
    "platform": "hue"
  },
  {
    "area_id": null,
    "device_id": "c27b8a08b76af2ed70e81a475a781ac8",
    "disabled_by": "integration",
    "entity_id": "sensor.beta_flex_ceiling_light_2_zigbee_connectivity",
    "hidden_by": null,
    "name": null,
    "original_name": "Zigbee connectivity",
    "platform": "hue"
  },
  {
    "area_id": null,
    "device_id": "b9139ec0152442d7ffe7ec7119dfec48",
    "disabled_by": "integration",
    "entity_id": "sensor.hue_color_lamp_1_zigbee_connectivity_2",
    "hidden_by": null,
    "name": null,
    "original_name": "Zigbee connectivity",
    "platform": "hue"
  },
  {
    "area_id": null,
    "device_id": "a3f86e911440eba9848a331183d010d2",
    "disabled_by": "integration",
    "entity_id": "sensor.hue_color_candle_1_zigbee_connectivity",
    "hidden_by": null,
    "name": null,
    "original_name": "Zigbee connectivity",
    "platform": "hue"
  },
  {
    "area_id": null,
    "device_id": "d9da816eb1ea175c045b94dda1fab89c",
    "disabled_by": "integration",
    "entity_id": "sensor.beta_bed_lightstrip_zigbee_connectivity",
    "hidden_by": null,
    "name": null,
    "original_name": "Zigbee connectivity",
    "platform": "hue"
  },
  {
    "area_id": null,
    "device_id": "e6b677474cc1f572d83596e2d103af6a",
    "disabled_by": "integration",
    "entity_id": "sensor.play_gradient_tube_1_zigbee_connectivity",
    "hidden_by": null,
    "name": null,
    "original_name": "Zigbee connectivity",
    "platform": "hue"
  },
  {
    "area_id": null,
    "device_id": "cac5cdcc358702139ac465f8994f9e83",
    "disabled_by": "integration",
    "entity_id": "sensor.ceiling_op_north_wall_zone_zigbee_connectivity",
    "hidden_by": null,
    "name": null,
    "original_name": "Zigbee connectivity",
    "platform": "hue"
  },
  {
    "area_id": null,
    "device_id": "b3b83fe3b391eaa9d7c5e917a8a028d1",
    "disabled_by": "integration",
    "entity_id": "sensor.splash_pass_ceiling_zigbee_connectivity",
    "hidden_by": null,
    "name": null,
    "original_name": "Zigbee connectivity",
    "platform": "hue"
  },
  {
    "area_id": null,
    "device_id": "2e19b66efcd2fdf07d25df6ff0dd9518",
    "disabled_by": "integration",
    "entity_id": "sensor.nymane_3_spot_lamp_low_zigbee_connectivity",
    "hidden_by": null,
    "name": null,
    "original_name": "Zigbee connectivity",
    "platform": "hue"
  },
  {
    "area_id": null,
    "device_id": "062b0dbde1538a39a2caddb290a7f1ec",
    "disabled_by": "integration",
    "entity_id": "sensor.ceiling_ensuite_bathroom_zigbee_connectivity",
    "hidden_by": null,
    "name": null,
    "original_name": "Zigbee connectivity",
    "platform": "hue"
  },
  {
    "area_id": null,
    "device_id": "55f7455e695e1ce7fdddb9b06f95ac1e",
    "disabled_by": "integration",
    "entity_id": "sensor.bed1_zigbee_connectivity",
    "hidden_by": null,
    "name": null,
    "original_name": "Zigbee connectivity",
    "platform": "hue"
  },
  {
    "area_id": null,
    "device_id": "b8a1e7c445f4889533cbd7600f709aee",
    "disabled_by": "integration",
    "entity_id": "sensor.beta_bedroom_hue_dial_switch_zigbee_connectivity",
    "hidden_by": null,
    "name": null,
    "original_name": "Zigbee connectivity",
    "platform": "hue"
  },
  {
    "area_id": null,
    "device_id": "b4da620be9a589bb9a2039e1ab78ebef",
    "disabled_by": "integration",
    "entity_id": "sensor.ceiling_ensuite_bathroom_zigbee_connectivity_2",
    "hidden_by": null,
    "name": null,
    "original_name": "Zigbee connectivity",
    "platform": "hue"
  },
  {
    "area_id": null,
    "device_id": "9000c66a1b0d6684075d3e5c53d1543c",
    "disabled_by": "integration",
    "entity_id": "sensor.monica_vibelucci_arc_lamp_zigbee_connectivity",
    "hidden_by": null,
    "name": null,
    "original_name": "Zigbee connectivity",
    "platform": "hue"
  },
  {
    "area_id": null,
    "device_id": "11501df1df87e0a6ea1a99334fded6d2",
    "disabled_by": "integration",
    "entity_id": "sensor.ceiling_op_br_zigbee_connectivity",
    "hidden_by": null,
    "name": null,
    "original_name": "Zigbee connectivity",
    "platform": "hue"
  },
  {
    "area_id": null,
    "device_id": "f72d9da87ad9f369da5b9fa4bccfb8aa",
    "disabled_by": "integration",
    "entity_id": "sensor.chaos_storage_ceiling_zigbee_connectivity",
    "hidden_by": null,
    "name": null,
    "original_name": "Zigbee connectivity",
    "platform": "hue"
  },
  {
    "area_id": null,
    "device_id": "fb3b1cc5cd84b7435b46d79ba3160450",
    "disabled_by": "integration",
    "entity_id": "sensor.beta_flex_ceiling_light_1_zigbee_connectivity",
    "hidden_by": null,
    "name": null,
    "original_name": "Zigbee connectivity",
    "platform": "hue"
  },
  {
    "area_id": null,
    "device_id": "543d647ade89fd9e32afd034b4937846",
    "disabled_by": "integration",
    "entity_id": "sensor.hue_essential_spot_3_zigbee_connectivity",
    "hidden_by": null,
    "name": null,
    "original_name": "Zigbee connectivity",
    "platform": "hue"
  },
  {
    "area_id": null,
    "device_id": "3a26058d1afa9fa8888a9b3865c8eaa7",
    "disabled_by": "integration",
    "entity_id": "sensor.throne_hue_motion_sensor_zigbee_connectivity",
    "hidden_by": null,
    "name": null,
    "original_name": "Zigbee connectivity",
    "platform": "hue"
  },
  {
    "area_id": null,
    "device_id": "f31d63cbe41b5f1acd30ad687951c840",
    "disabled_by": "integration",
    "entity_id": "sensor.ceiling_kitchen_fridge_zigbee_connectivity",
    "hidden_by": null,
    "name": null,
    "original_name": "Zigbee connectivity",
    "platform": "hue"
  },
  {
    "area_id": null,
    "device_id": "cc79d7dfe1b17181869f10c35cc4c833",
    "disabled_by": "integration",
    "entity_id": "sensor.chaos_laundry_ceiling_zigbee_connectivity",
    "hidden_by": null,
    "name": null,
    "original_name": "Zigbee connectivity",
    "platform": "hue"
  },
  {
    "area_id": null,
    "device_id": "1aecb535c3b242ba001f8fe849f0cc66",
    "disabled_by": "integration",
    "entity_id": "sensor.splash_ceiling_light_4_zigbee_connectivity",
    "hidden_by": null,
    "name": null,
    "original_name": "Zigbee connectivity",
    "platform": "hue"
  },
  {
    "area_id": null,
    "device_id": "1fc62b8e8aa80845dc7cb23e3f0bc24f",
    "disabled_by": "integration",
    "entity_id": "sensor.chaos_vault_ceiling_zigbee_connectivity",
    "hidden_by": null,
    "name": null,
    "original_name": "Zigbee connectivity",
    "platform": "hue"
  },
  {
    "area_id": null,
    "device_id": "500c186b1b951c54ec8b27c162c9e452",
    "disabled_by": "integration",
    "entity_id": "sensor.alpha_bedroom_hue_smart_button_zigbee_connectivity",
    "hidden_by": null,
    "name": null,
    "original_name": "Zigbee connectivity",
    "platform": "hue"
  },
  {
    "area_id": null,
    "device_id": "d655489921cbb3a2585dc855c0d1ea75",
    "disabled_by": "integration",
    "entity_id": "sensor.hue_bridge_pro_zigbee_connectivity",
    "hidden_by": null,
    "name": null,
    "original_name": "Zigbee connectivity",
    "platform": "hue"
  },
  {
    "area_id": null,
    "device_id": "de3a3b86f9f861abd8474a0bbee6e039",
    "disabled_by": "integration",
    "entity_id": "sensor.ceiling_kitchen_sink_zigbee_connectivity",
    "hidden_by": null,
    "name": null,
    "original_name": "Zigbee connectivity",
    "platform": "hue"
  },
  {
    "area_id": null,
    "device_id": "2c9a65b5226b60f36e9fa994d5db3e92",
    "disabled_by": "integration",
    "entity_id": "sensor.hue_smart_plug_1_zigbee_connectivity",
    "hidden_by": null,
    "name": null,
    "original_name": "Zigbee connectivity",
    "platform": "hue"
  },
  {
    "area_id": null,
    "device_id": "ec259a6304fedd4f2569aa942ef6edb9",
    "disabled_by": "integration",
    "entity_id": "sensor.beta_ceiling_light_3_zigbee_connectivity",
    "hidden_by": null,
    "name": null,
    "original_name": "Zigbee connectivity",
    "platform": "hue"
  },
  {
    "area_id": null,
    "device_id": "7ff3eb57a4f7b8b83823e6bbc1cd43c0",
    "disabled_by": "integration",
    "entity_id": "sensor.ceiling_open_plan_east_zigbee_connectivity",
    "hidden_by": null,
    "name": null,
    "original_name": "Zigbee connectivity",
    "platform": "hue"
  },
  {
    "area_id": null,
    "device_id": "f3a36de300c078041de5869a79f49dbe",
    "disabled_by": "integration",
    "entity_id": "sensor.alpha_bedroom_dial_switch_zigbee_connectivity",
    "hidden_by": null,
    "name": null,
    "original_name": "Zigbee connectivity",
    "platform": "hue"
  },
  {
    "area_id": null,
    "device_id": "9f1606f2d60df3ef87d614354986c424",
    "disabled_by": "integration",
    "entity_id": "sensor.core_hue_tap_dial_switch_zigbee_connectivity",
    "hidden_by": null,
    "name": null,
    "original_name": "Zigbee connectivity",
    "platform": "hue"
  },
  {
    "area_id": null,
    "device_id": "c61c4551d3ec38cda5ef874359c7d174",
    "disabled_by": "integration",
    "entity_id": "sensor.bathroom2_hue_motion_sensor_zigbee_connectivity",
    "hidden_by": null,
    "name": null,
    "original_name": "Zigbee connectivity",
    "platform": "hue"
  },
  {
    "area_id": null,
    "device_id": "22a1188f6ffa438992b8004a39cd432f",
    "disabled_by": "integration",
    "entity_id": "sensor.ceiling_ensuite_bathroom_zigbee_connectivity_3",
    "hidden_by": null,
    "name": null,
    "original_name": "Zigbee connectivity",
    "platform": "hue"
  },
  {
    "area_id": null,
    "device_id": "5c5088969773c38740cbd5f823f58d65",
    "disabled_by": "integration",
    "entity_id": "sensor.hue_essential_spot_1_zigbee_connectivity",
    "hidden_by": null,
    "name": null,
    "original_name": "Zigbee connectivity",
    "platform": "hue"
  },
  {
    "area_id": null,
    "device_id": "95dba2dec02b41db4ea3ca072dcdd6d0",
    "disabled_by": "integration",
    "entity_id": "sensor.beta_ceiling_light_4_zigbee_connectivity",
    "hidden_by": null,
    "name": null,
    "original_name": "Zigbee connectivity",
    "platform": "hue"
  },
  {
    "area_id": null,
    "device_id": "fbfcf983165eca43796973ac96dfd87f",
    "disabled_by": "integration",
    "entity_id": "sensor.core_vault_ceiling_zigbee_connectivity",
    "hidden_by": null,
    "name": null,
    "original_name": "Zigbee connectivity",
    "platform": "hue"
  },
  {
    "area_id": null,
    "device_id": "9262c97c808756f1c42c9a5f56d07b44",
    "disabled_by": "integration",
    "entity_id": "sensor.throne_bathroom_ceiling_zigbee_connectivity",
    "hidden_by": null,
    "name": null,
    "original_name": "Zigbee connectivity",
    "platform": "hue"
  },
  {
    "area_id": null,
    "device_id": "d89bf5602e1724bf0b26f43bf6866f40",
    "disabled_by": "integration",
    "entity_id": "sensor.hue_play_1_zigbee_connectivity",
    "hidden_by": null,
    "name": null,
    "original_name": "Zigbee connectivity",
    "platform": "hue"
  },
  {
    "area_id": null,
    "device_id": "dc71020d45c5332607408e59045efbf9",
    "disabled_by": "integration",
    "entity_id": "sensor.beta_ceiling_light_6_zigbee_connectivity",
    "hidden_by": null,
    "name": null,
    "original_name": "Zigbee connectivity",
    "platform": "hue"
  },
  {
    "area_id": null,
    "device_id": "81afd7db5465561e20df193ef451d0f4",
    "disabled_by": "integration",
    "entity_id": "sensor.signe_gradient_table_1_zigbee_connectivity",
    "hidden_by": null,
    "name": null,
    "original_name": "Zigbee connectivity",
    "platform": "hue"
  },
  {
    "area_id": null,
    "device_id": "5d5d2cd72b6952b59a09cb567a37284c",
    "disabled_by": "integration",
    "entity_id": "sensor.bed3_zigbee_connectivity",
    "hidden_by": null,
    "name": null,
    "original_name": "Zigbee connectivity",
    "platform": "hue"
  },
  {
    "area_id": null,
    "device_id": "5525c9fb0db1dab203c66826dc6847a0",
    "disabled_by": "integration",
    "entity_id": "sensor.hue_color_lamp_1_zigbee_connectivity",
    "hidden_by": null,
    "name": null,
    "original_name": "Zigbee connectivity",
    "platform": "hue"
  },
  {
    "area_id": null,
    "device_id": "712dfdefa747a25fb6b5491f50d4fc77",
    "disabled_by": "integration",
    "entity_id": "sensor.splash_ceiling_light_2_zigbee_connectivity",
    "hidden_by": null,
    "name": null,
    "original_name": "Zigbee connectivity",
    "platform": "hue"
  },
  {
    "area_id": null,
    "device_id": "f2bdc76a73830aa7fa6193766aed417e",
    "disabled_by": "integration",
    "entity_id": "sensor.ceiling_open_plan_mm_zigbee_connectivity",
    "hidden_by": null,
    "name": null,
    "original_name": "Zigbee connectivity",
    "platform": "hue"
  },
  {
    "area_id": null,
    "device_id": "475fe7c2987064f9797a7860b2e6f7ad",
    "disabled_by": "integration",
    "entity_id": "sensor.betaflex_lower_shelf_zigbee_connectivity",
    "hidden_by": null,
    "name": null,
    "original_name": "Zigbee connectivity",
    "platform": "hue"
  },
  {
    "area_id": null,
    "device_id": "eb2058653fe9e0f95ad5aa8018b97de2",
    "disabled_by": "integration",
    "entity_id": "sensor.ceiling_bedroom1_bed4_zigbee_connectivity",
    "hidden_by": null,
    "name": null,
    "original_name": "Zigbee connectivity",
    "platform": "hue"
  },
  {
    "area_id": null,
    "device_id": "f8149a06f87fed8bb2412cf2fea76be7",
    "disabled_by": "integration",
    "entity_id": "sensor.ceiling_open_plan_mr_zigbee_connectivity",
    "hidden_by": null,
    "name": null,
    "original_name": "Zigbee connectivity",
    "platform": "hue"
  },
  {
    "area_id": null,
    "device_id": "7ad73057c31770c617cd496edba33088",
    "disabled_by": "integration",
    "entity_id": "sensor.ceiling_ensuite_bathroom_zigbee_connectivity_4",
    "hidden_by": null,
    "name": null,
    "original_name": "Zigbee connectivity",
    "platform": "hue"
  },
  {
    "area_id": null,
    "device_id": "027c1c392e1914472aebdad116e88d1f",
    "disabled_by": "integration",
    "entity_id": "sensor.hue_smart_button_3_zigbee_connectivity",
    "hidden_by": null,
    "name": null,
    "original_name": "Zigbee connectivity",
    "platform": "hue"
  },
  {
    "area_id": null,
    "device_id": "25fd95b77ffb4e30f911e0e44136680e",
    "disabled_by": "integration",
    "entity_id": "sensor.ceiling_op_south_zigbee_connectivity",
    "hidden_by": null,
    "name": null,
    "original_name": "Zigbee connectivity",
    "platform": "hue"
  },
  {
    "area_id": null,
    "device_id": "1e9955f25dc9f5c09dcb90e0fb8d60dd",
    "disabled_by": "integration",
    "entity_id": "sensor.ceiling_op_north_wall_zone_a1b_zigbee_connectivity",
    "hidden_by": null,
    "name": null,
    "original_name": "Zigbee connectivity",
    "platform": "hue"
  },
  {
    "area_id": null,
    "device_id": "da1dd2355bbec3191d522313064aa97c",
    "disabled_by": "integration",
    "entity_id": "sensor.hue_smart_button_2_zigbee_connectivity",
    "hidden_by": null,
    "name": null,
    "original_name": "Zigbee connectivity",
    "platform": "hue"
  },
  {
    "area_id": null,
    "device_id": "258fcb0a550539cc7ec6fffe58967e36",
    "disabled_by": "integration",
    "entity_id": "sensor.core_signe_floor_lamp_zigbee_connectivity",
    "hidden_by": null,
    "name": null,
    "original_name": "Zigbee connectivity",
    "platform": "hue"
  },
  {
    "area_id": null,
    "device_id": "3ea5d1bb94beb7cccc04318580529ee7",
    "disabled_by": "integration",
    "entity_id": "sensor.ceiling_bedroom1_closet_zone_zigbee_connectivity",
    "hidden_by": null,
    "name": null,
    "original_name": "Zigbee connectivity",
    "platform": "hue"
  },
  {
    "area_id": null,
    "device_id": "345f22c2aac0cf310cc467f20ad291d4",
    "disabled_by": "integration",
    "entity_id": "sensor.splash_ceiling_light_5_zigbee_connectivity",
    "hidden_by": null,
    "name": null,
    "original_name": "Zigbee connectivity",
    "platform": "hue"
  },
  {
    "area_id": null,
    "device_id": "33595151421af22100a3e06457f0d43f",
    "disabled_by": "integration",
    "entity_id": "sensor.klasnick_beige_table_lamp_zigbee_connectivity",
    "hidden_by": null,
    "name": null,
    "original_name": "Zigbee connectivity",
    "platform": "hue"
  },
  {
    "area_id": null,
    "device_id": "e6939abcf85960114033763df1633e2e",
    "disabled_by": "integration",
    "entity_id": "sensor.hue_play_2_zigbee_connectivity",
    "hidden_by": null,
    "name": null,
    "original_name": "Zigbee connectivity",
    "platform": "hue"
  },
  {
    "area_id": null,
    "device_id": "0a7d029aeef8c21cb1ed5d3be91ad78e",
    "disabled_by": "integration",
    "entity_id": "sensor.splash_bathroom_dimmer_zigbee_connectivity",
    "hidden_by": null,
    "name": null,
    "original_name": "Zigbee connectivity",
    "platform": "hue"
  },
  {
    "area_id": null,
    "device_id": "7158827f268292c33df8d3ac80d77f8b",
    "disabled_by": "integration",
    "entity_id": "sensor.hue_dimmer_switch_4_zigbee_connectivity",
    "hidden_by": null,
    "name": null,
    "original_name": "Zigbee connectivity",
    "platform": "hue"
  },
  {
    "area_id": null,
    "device_id": "c1c0e309ed8147ef57d651df415bc548",
    "disabled_by": "integration",
    "entity_id": "sensor.ceiling_bedroom1_door_zone_zigbee_connectivity",
    "hidden_by": null,
    "name": null,
    "original_name": "Zigbee connectivity",
    "platform": "hue"
  },
  {
    "area_id": null,
    "device_id": "c679070b7932d16308b82b9e3d646938",
    "disabled_by": "integration",
    "entity_id": "sensor.alpha_bed_zone_ceiling_2_zigbee_connectivity",
    "hidden_by": null,
    "name": null,
    "original_name": "Zigbee connectivity",
    "platform": "hue"
  },
  {
    "area_id": null,
    "device_id": "c2789cbe73d4b79832da4a6a2e328737",
    "disabled_by": "integration",
    "entity_id": "sensor.signe_gradient_floor_1_zigbee_connectivity",
    "hidden_by": null,
    "name": null,
    "original_name": "Zigbee connectivity",
    "platform": "hue"
  },
  {
    "area_id": null,
    "device_id": "5200e66fdc90aad0dd0cbceb76c22319",
    "disabled_by": "integration",
    "entity_id": "sensor.splash_ceiling_light_1_zigbee_connectivity",
    "hidden_by": null,
    "name": null,
    "original_name": "Zigbee connectivity",
    "platform": "hue"
  },
  {
    "area_id": null,
    "device_id": "a1493cb9fc881b1421e04687bc9553a3",
    "disabled_by": "integration",
    "entity_id": "sensor.beta_pass_ceiling_zigbee_connectivity",
    "hidden_by": null,
    "name": null,
    "original_name": "Zigbee connectivity",
    "platform": "hue"
  },
  {
    "area_id": null,
    "device_id": "33028e1253bd920ca8025d846edbb6e6",
    "disabled_by": "integration",
    "entity_id": "sensor.splash_ceiling_light_3_zigbee_connectivity",
    "hidden_by": null,
    "name": null,
    "original_name": "Zigbee connectivity",
    "platform": "hue"
  },
  {
    "area_id": null,
    "device_id": "d82ba9da0b831576a30a6202b35686cc",
    "disabled_by": "integration",
    "entity_id": "sensor.beta_ceiling_light_zigbee_connectivity",
    "hidden_by": null,
    "name": null,
    "original_name": "Zigbee connectivity",
    "platform": "hue"
  },
  {
    "area_id": null,
    "device_id": "ba9d7d9777253c445066c26aca659483",
    "disabled_by": "integration",
    "entity_id": "sensor.hue_essential_spot_2_zigbee_connectivity",
    "hidden_by": null,
    "name": null,
    "original_name": "Zigbee connectivity",
    "platform": "hue"
  },
  {
    "area_id": null,
    "device_id": "117c704d9e32a6e962854eb81789dab3",
    "disabled_by": null,
    "entity_id": "sensor.bathroom_illuminance",
    "hidden_by": null,
    "name": null,
    "original_name": "Illuminance",
    "platform": "hue"
  },
  {
    "area_id": null,
    "device_id": "6d7b499febad4be04c50281d66c355b9",
    "disabled_by": null,
    "entity_id": "sensor.secondary_bathroom_illuminance",
    "hidden_by": null,
    "name": null,
    "original_name": "Illuminance",
    "platform": "hue"
  },
  {
    "area_id": null,
    "device_id": "c61c4551d3ec38cda5ef874359c7d174",
    "disabled_by": null,
    "entity_id": "switch.hue_motion_sensor_motion_sensor_enabled",
    "hidden_by": null,
    "name": null,
    "original_name": "Motion sensor enabled",
    "platform": "hue"
  },
  {
    "area_id": null,
    "device_id": "3a26058d1afa9fa8888a9b3865c8eaa7",
    "disabled_by": null,
    "entity_id": "switch.hue_motion_sensor_motion_sensor_enabled_2",
    "hidden_by": null,
    "name": null,
    "original_name": "Motion sensor enabled",
    "platform": "hue"
  },
  {
    "area_id": null,
    "device_id": "3a26058d1afa9fa8888a9b3865c8eaa7",
    "disabled_by": null,
    "entity_id": "switch.hue_motion_sensor_light_sensor_enabled_2",
    "hidden_by": null,
    "name": null,
    "original_name": "Light sensor enabled",
    "platform": "hue"
  },
  {
    "area_id": null,
    "device_id": "c61c4551d3ec38cda5ef874359c7d174",
    "disabled_by": null,
    "entity_id": "switch.hue_motion_sensor_light_sensor_enabled",
    "hidden_by": null,
    "name": null,
    "original_name": "Light sensor enabled",
    "platform": "hue"
  },
  {
    "area_id": null,
    "device_id": "d655489921cbb3a2585dc855c0d1ea75",
    "disabled_by": null,
    "entity_id": "switch.automation_hue_smart_button_3",
    "hidden_by": null,
    "name": null,
    "original_name": "Automation: Hue smart button 3",
    "platform": "hue"
  },
  {
    "area_id": null,
    "device_id": "514f06a7f929e6441e7c3208365296bd",
    "disabled_by": null,
    "entity_id": "light.spare_bedroom_ceiling",
    "hidden_by": null,
    "name": null,
    "original_name": null,
    "platform": "hue"
  },
  {
    "area_id": null,
    "device_id": "475fe7c2987064f9797a7860b2e6f7ad",
    "disabled_by": null,
    "entity_id": "light.ikea_skytrax_light",
    "hidden_by": null,
    "name": null,
    "original_name": null,
    "platform": "hue"
  },
  {
    "area_id": null,
    "device_id": "50a528511760fe9c34e7301b1e2e3cc3",
    "disabled_by": null,
    "entity_id": "scene.bedroom_energise",
    "hidden_by": null,
    "name": null,
    "original_name": "Energise",
    "platform": "hue"
  },
  {
    "area_id": null,
    "device_id": "50a528511760fe9c34e7301b1e2e3cc3",
    "disabled_by": null,
    "entity_id": "scene.bedroom_concentrate",
    "hidden_by": null,
    "name": null,
    "original_name": "Concentrate",
    "platform": "hue"
  },
  {
    "area_id": null,
    "device_id": "50a528511760fe9c34e7301b1e2e3cc3",
    "disabled_by": null,
    "entity_id": "scene.bedroom_read",
    "hidden_by": null,
    "name": null,
    "original_name": "Read",
    "platform": "hue"
  },
  {
    "area_id": null,
    "device_id": "50a528511760fe9c34e7301b1e2e3cc3",
    "disabled_by": null,
    "entity_id": "scene.bedroom_relax",
    "hidden_by": null,
    "name": null,
    "original_name": "Relax",
    "platform": "hue"
  },
  {
    "area_id": null,
    "device_id": "50a528511760fe9c34e7301b1e2e3cc3",
    "disabled_by": null,
    "entity_id": "scene.bedroom_nightlight",
    "hidden_by": null,
    "name": null,
    "original_name": "Nightlight",
    "platform": "hue"
  },
  {
    "area_id": null,
    "device_id": "50a528511760fe9c34e7301b1e2e3cc3",
    "disabled_by": null,
    "entity_id": "scene.bedroom_dimmed",
    "hidden_by": null,
    "name": null,
    "original_name": "Dimmed",
    "platform": "hue"
  },
  {
    "area_id": null,
    "device_id": "d655489921cbb3a2585dc855c0d1ea75",
    "disabled_by": null,
    "entity_id": "switch.automation_alpha_bedroom_dial_switch",
    "hidden_by": null,
    "name": null,
    "original_name": "Automation: Alpha Bedroom Dial Switch",
    "platform": "hue"
  },
  {
    "area_id": null,
    "device_id": "3ea5d1bb94beb7cccc04318580529ee7",
    "disabled_by": null,
    "entity_id": "light.core_ceiling_3",
    "hidden_by": null,
    "name": null,
    "original_name": null,
    "platform": "hue"
  },
  {
    "area_id": null,
    "device_id": "6a4f6e0da1c233db98df89c682696867",
    "disabled_by": null,
    "entity_id": "media_player.nesthubd029_3",
    "hidden_by": null,
    "name": null,
    "original_name": null,
    "platform": "cast"
  },
  {
    "area_id": null,
    "device_id": "51713f83c0aeecdf8d304f02755b2ed6",
    "disabled_by": null,
    "entity_id": "media_player.orange_homepod_mini_2",
    "hidden_by": null,
    "name": null,
    "original_name": null,
    "platform": "apple_tv"
  },
  {
    "area_id": null,
    "device_id": "51713f83c0aeecdf8d304f02755b2ed6",
    "disabled_by": null,
    "entity_id": "remote.orange_homepod_mini_2",
    "hidden_by": null,
    "name": null,
    "original_name": null,
    "platform": "apple_tv"
  }
]


==== FILE: /Users/jeff/Downloads/10_Archive/Duplicated-Pending Deletion/shared/services/homeassistant/exports/integrations.json (modified: 2026-05-19 16:17:29) ====

[
  {
    "disabled_by": null,
    "domain": "sun",
    "entry_id": "01KE8C760923KJ4PC4FPDD7AC2",
    "source": "import",
    "title": "Sun"
  },
  {
    "disabled_by": null,
    "domain": "bluetooth",
    "entry_id": "01KE8C76D83VV14J40VFV2MY6Q",
    "source": "integration_discovery",
    "title": "Shenzhen Phaten Tech. LTD None (8C:BD:37:64:26:26)"
  },
  {
    "disabled_by": null,
    "domain": "go2rtc",
    "entry_id": "01KE8C76DJFSEZ46J6ZA8RJNMX",
    "source": "system",
    "title": "go2rtc"
  },
  {
    "disabled_by": null,
    "domain": "backup",
    "entry_id": "01KE8C76DVYAAG1D1G773A2P8T",
    "source": "system",
    "title": "Backup"
  },
  {
    "disabled_by": null,
    "domain": "thread",
    "entry_id": "01KE8C797FV5PXCY333VPVMWVE",
    "source": "zeroconf",
    "title": "Thread"
  },
  {
    "disabled_by": null,
    "domain": "cast",
    "entry_id": "01KE8C7AA1W2XK0SDM7KHZZQ1P",
    "source": "zeroconf",
    "title": "Google Cast"
  },
  {
    "disabled_by": null,
    "domain": "shopping_list",
    "entry_id": "01KE91DVHS4B7KB3RD5BE8B6DJ",
    "source": "onboarding",
    "title": "Shopping list"
  },
  {
    "disabled_by": null,
    "domain": "google_translate",
    "entry_id": "01KE91DVJ87CB7GDQN3816E1T4",
    "source": "onboarding",
    "title": "Google Translate text-to-speech"
  },
  {
    "disabled_by": null,
    "domain": "radio_browser",
    "entry_id": "01KE91DVP4CM1GP7W3NQ6RFSES",
    "source": "onboarding",
    "title": "Radio Browser"
  },
  {
    "disabled_by": null,
    "domain": "met",
    "entry_id": "01KE91DVPP110V3YHQ6Y1RBFJN",
    "source": "onboarding",
    "title": "Home"
  },
  {
    "disabled_by": null,
    "domain": "mobile_app",
    "entry_id": "01KE9K0JRMH5EAY8JFWNCQGM4W",
    "source": "registration",
    "title": "iPhone 16Pro Max "
  },
  {
    "disabled_by": null,
    "domain": "mobile_app",
    "entry_id": "01KEAY01EBMBS1WC70CWY2KRMM",
    "source": "registration",
    "title": "MacBook Air "
  },
  {
    "disabled_by": null,
    "domain": "cloud",
    "entry_id": "01KEAYSHQG86NT532ZXKVH54WA",
    "source": "system",
    "title": "Home Assistant Cloud"
  },
  {
    "disabled_by": null,
    "domain": "withings",
    "entry_id": "01KFF3W24JX0DFXRRAS4KD66QR",
    "source": "user",
    "title": "Withings"
  },
  {
    "disabled_by": null,
    "domain": "mqtt",
    "entry_id": "01KJCTC70CN506EE23RWK1JMG3",
    "source": "user",
    "title": "192.168.1.39"
  },
  {
    "disabled_by": null,
    "domain": "apple_tv",
    "entry_id": "01KJCWC7FPDDF3JTKWKPS60A2W",
    "source": "zeroconf",
    "title": "living Room Apple TV"
  },
  {
    "disabled_by": null,
    "domain": "apple_tv",
    "entry_id": "01KJG25VSZS1CQXWN50A25JC5T",
    "source": "zeroconf",
    "title": "Living Room (2)"
  },
  {
    "disabled_by": null,
    "domain": "apple_tv",
    "entry_id": "01KJG27B1BS9B3SQP56B6FHP76",
    "source": "zeroconf",
    "title": "Living Room"
  },
  {
    "disabled_by": null,
    "domain": "mobile_app",
    "entry_id": "01KJXBWPPBWFEJMJ21N1ZVQ6AV",
    "source": "registration",
    "title": "Jeff\u2019s iPad"
  },
  {
    "disabled_by": null,
    "domain": "apple_tv",
    "entry_id": "01KK0KGB01KC0MEVTHC9V9Y72H",
    "source": "zeroconf",
    "title": "Bedroom"
  },
  {
    "disabled_by": null,
    "domain": "apple_tv",
    "entry_id": "01KKFP0AH670JVYE9N6BAV6ASA",
    "source": "zeroconf",
    "title": "White HomePod Mini"
  },
  {
    "disabled_by": null,
    "domain": "speedtestdotnet",
    "entry_id": "01KKQ16Q9W2JX6D0ZPV70901WF",
    "source": "user",
    "title": "SpeedTest"
  },
  {
    "disabled_by": null,
    "domain": "matter",
    "entry_id": "01KKR0E56PAZ568V40ARDBAMYR",
    "source": "zeroconf",
    "title": "Matter"
  },
  {
    "disabled_by": null,
    "domain": "apple_tv",
    "entry_id": "01KKYZMZ0H4MDY0PDSSTHGVWBQ",
    "source": "zeroconf",
    "title": "Living Room (2)"
  },
  {
    "disabled_by": null,
    "domain": "apple_tv",
    "entry_id": "01KKYZPS9WVV23VF427JP3729K",
    "source": "zeroconf",
    "title": "Beta Bedroom"
  },
  {
    "disabled_by": null,
    "domain": "mobile_app",
    "entry_id": "01KMEC8P6EFQAEMK2SR21A30AZ",
    "source": "registration",
    "title": "Jeff\u2019s iPhone"
  },
  {
    "disabled_by": null,
    "domain": "vesync",
    "entry_id": "01KN8Y3019MX4C436429W21Z4A",
    "source": "user",
    "title": "Home@itsjeff.org"
  },
  {
    "disabled_by": null,
    "domain": "hue",
    "entry_id": "01KQJ6JHKQQ2DZ0PK6M0DT3WFR",
    "source": "zeroconf",
    "title": "Hue Bridge c42996c58a91"
  },
  {
    "disabled_by": null,
    "domain": "apple_tv",
    "entry_id": "01KRVPXXQBZ7VX8NCNFTVV2MEC",
    "source": "zeroconf",
    "title": "Orange HomePod Mini"
  }
]


==== FILE: /Users/jeff/Downloads/10_Archive/Duplicated-Pending Deletion/shared/services/homeassistant/naming.md (modified: 2026-05-19 16:16:07) ====

# Home Assistant Naming

Current naming work is not complete.

## Working Principles

- Rooms are human geography.
- Zones are control surfaces or meaningful sub-areas.
- Scenes are intent/mood layers.
- Device/entity names should support voice control and coherent grouped control.
- Statement pieces may have editorial names; utility lights should stay legible.

## Known Alias Concepts

- Core / Open Plan
- Throne / alpha bathroom
- Splash / beta bathroom with tub
- Flex / walk-in

These are conversational/design aliases, not automatically final HA area names.

## Current State

Real HA exports exist in `exports/`. They should be used before making naming
decisions.

The naming cleanup has not been executed across HA.

## Operational Boundary

Do not rename entities/devices/areas from this repo alone. HA naming changes
must be performed through Home Assistant or a verified HA API flow, then
re-exported back into this repo.


==== FILE: /Users/jeff/Downloads/10_Archive/Duplicated-Pending Deletion/shared/services/homeassistant/remote-docs/README.md (modified: 2026-05-24 12:50:26) ====

# Hue Control

Small programmable Hue workspace for the mini-PC app stack.

Location:

```text
/srv/ai-stack/apps/hue-control
```

This belongs under `ai-stack/apps` rather than `homeassistant` because it is intended as a direct automation/control surface for agents, scripts, and future services. Home Assistant can still consume Hue separately, but this folder keeps the Codex/AI runtime path independent.

## Secrets

Secrets are loaded from the same 1Password Environment pattern used by `project-codex`.

Expected variables:

```text
OP_SERVICE_ACCOUNT_TOKEN
OP_ENVIRONMENT_ID
HUE_BRIDGE_IP
HUE_APP_KEY
```

`HUE_APP_KEY` is never printed by the included scripts.

## Commands

```bash
npm install
npm run status
npm run lights
npm run rooms
npm run scenes
```

If this app is running on the mini PC with the current 1Password Environment, `npm run lights` should authenticate to the Hue Bridge Pro at `192.168.1.136` and list the current lights.

## Flat Structure

The current Hue room, zone, and naming cleanup record lives in [`docs/hue-structure-plan.md`](docs/hue-structure-plan.md).

The naming priority is daily home usability across Hue, HomeKit, Siri/voice, Home Assistant, dashboards, and physical control habits. The flat uses a hybrid naming model: meaningful spatial codes such as `Core`, `Alpha`, and `Pass` are preserved, then paired with plain room/use language where that makes control clearer.

The collaboration and parallel-agent boundaries are documented in [`docs/home-map-working-model.md`](docs/home-map-working-model.md).

The confirmed Core lighting automation foundation is documented in [`docs/core-lighting-rhythm.md`](docs/core-lighting-rhythm.md).

## Direction

This folder is a foundation for direct Hue automation from the mini PC:

- read bridge, lights, rooms, zones, scenes, and sensors
- trigger scenes or state changes without going through Home Assistant
- expose a narrow local API or MCP tool later if useful
- keep Hue credentials centralized in 1Password


==== FILE: /Users/jeff/Downloads/10_Archive/Duplicated-Pending Deletion/shared/inventories/forensic-srv-inventory/homeassistant.md (modified: 2026-05-23 23:08:35) ====

# homeassistant
Generated: 2026-05-23T22:08:32+00:00

Forensic stance: this report describes observed files, config, docs, and runtime metadata. It does not propose fixes or reconcile contradictions.
## High-level summary
- Roots examined: `/srv/homeassistant`.
- Evidence basis: manifests/compose/build files, docs, active Docker metadata.
- No runtime route/tool/function surface was extracted from sampled code.
- Active containers tied to these roots:
  - `nodered` image `nodered/node-red:latest`, command `"./entrypoint.sh"`, ports `0.0.0.0:1880->1880/tcp, [::]:1880->1880/tcp`, networks `homeassistant_default`.
  - `homeassistantz` image `ghcr.io/home-assistant/home-assistant:stable`, command `"/init"`, ports `none`, networks `host`.
  - `matter-server` image `ghcr.io/home-assistant-libs/python-matter-server:stable`, command `"matter-server --sto…"`, ports `none`, networks `host`.

## Main entrypoints and manifests
- `/srv/homeassistant/docker-compose.yml`: Docker Compose configuration with services, networks, ports, mounts, and env wiring.

## Per-file / per-module roles
### `/srv/homeassistant/README.md`
- Status: readable; 5917 bytes.
- Role: Documentation/readme artifact.
- Inputs/dependencies: No explicit env/import inputs extracted from sampled content.
- Outputs/effects: Docker/container effect
- Runtime fragility signal: No definite fragility extracted from sampled content.
### `/srv/homeassistant/config/.HA_VERSION`
- Status: readable; 9 bytes.
- Role: First-party text artifact.
- Inputs/dependencies: No explicit env/import inputs extracted from sampled content.
- Outputs/effects: No obvious external side effect extracted from sampled content.
- Runtime fragility signal: No definite fragility extracted from sampled content.
### `/srv/homeassistant/config/.cloud/acme_account.pem`
- Status: summarized; 1704 bytes.
- Role: Not read in detail: non-text or unsupported extension.
- Inputs/dependencies: 
- Outputs/effects: 
- Runtime fragility signal: Semantic detail not confirmed from content.
### `/srv/homeassistant/config/.cloud/acme_reg.json`
- Status: readable; 676 bytes.
- Role: Configuration or structured data file.
- Inputs/dependencies: No explicit env/import inputs extracted from sampled content.
- Outputs/effects: No obvious external side effect extracted from sampled content.
- Runtime fragility signal: No definite fragility extracted from sampled content.
### `/srv/homeassistant/config/.cloud/production_auth.json`
- Status: summarized; 3901 bytes.
- Role: Not read in detail: read failed: [Errno 13] Permission denied: '/srv/homeassistant/config/.cloud/production_auth.json'.
- Inputs/dependencies: 
- Outputs/effects: 
- Runtime fragility signal: Semantic detail not confirmed from content.
### `/srv/homeassistant/config/.cloud/remote_fullchain.pem`
- Status: summarized; 3668 bytes.
- Role: Not read in detail: non-text or unsupported extension.
- Inputs/dependencies: 
- Outputs/effects: 
- Runtime fragility signal: Semantic detail not confirmed from content.
### `/srv/homeassistant/config/.cloud/remote_private.pem`
- Status: summarized; 1704 bytes.
- Role: Not read in detail: non-text or unsupported extension.
- Inputs/dependencies: 
- Outputs/effects: 
- Runtime fragility signal: Semantic detail not confirmed from content.
### `/srv/homeassistant/config/.ha_run.lock`
- Status: summarized; 84 bytes.
- Role: Not read in detail: non-text or unsupported extension.
- Inputs/dependencies: 
- Outputs/effects: 
- Runtime fragility signal: Semantic detail not confirmed from content.
### `/srv/homeassistant/config/.storage/application_credentials`
- Status: summarized; 463 bytes.
- Role: Not read in detail: runtime/opaque or backup area.
- Inputs/dependencies: 
- Outputs/effects: 
- Runtime fragility signal: Semantic detail not confirmed from content.
### `/srv/homeassistant/config/.storage/assist_pipeline.pipelines`
- Status: summarized; 1744 bytes.
- Role: Not read in detail: runtime/opaque or backup area.
- Inputs/dependencies: 
- Outputs/effects: 
- Runtime fragility signal: Semantic detail not confirmed from content.
### `/srv/homeassistant/config/.storage/auth`
- Status: summarized; 16991 bytes.
- Role: Not read in detail: runtime/opaque or backup area.
- Inputs/dependencies: 
- Outputs/effects: 
- Runtime fragility signal: Semantic detail not confirmed from content.
### `/srv/homeassistant/config/.storage/auth_provider.homeassistant`
- Status: summarized; 270 bytes.
- Role: Not read in detail: runtime/opaque or backup area.
- Inputs/dependencies: 
- Outputs/effects: 
- Runtime fragility signal: Semantic detail not confirmed from content.
### `/srv/homeassistant/config/.storage/backup`
- Status: summarized; 12395 bytes.
- Role: Not read in detail: runtime/opaque or backup area.
- Inputs/dependencies: 
- Outputs/effects: 
- Runtime fragility signal: Semantic detail not confirmed from content.
### `/srv/homeassistant/config/.storage/bluetooth.passive_update_processor`
- Status: summarized; 101 bytes.
- Role: Not read in detail: runtime/opaque or backup area.
- Inputs/dependencies: 
- Outputs/effects: 
- Runtime fragility signal: Semantic detail not confirmed from content.
### `/srv/homeassistant/config/.storage/bluetooth.remote_scanners`
- Status: summarized; 313 bytes.
- Role: Not read in detail: runtime/opaque or backup area.
- Inputs/dependencies: 
- Outputs/effects: 
- Runtime fragility signal: Semantic detail not confirmed from content.
### `/srv/homeassistant/config/.storage/cloud`
- Status: summarized; 3742 bytes.
- Role: Not read in detail: runtime/opaque or backup area.
- Inputs/dependencies: 
- Outputs/effects: 
- Runtime fragility signal: Semantic detail not confirmed from content.
### `/srv/homeassistant/config/.storage/core.analytics`
- Status: summarized; 220 bytes.
- Role: Not read in detail: runtime/opaque or backup area.
- Inputs/dependencies: 
- Outputs/effects: 
- Runtime fragility signal: Semantic detail not confirmed from content.
### `/srv/homeassistant/config/.storage/core.area_registry`
- Status: summarized; 9345 bytes.
- Role: Not read in detail: runtime/opaque or backup area.
- Inputs/dependencies: 
- Outputs/effects: 
- Runtime fragility signal: Semantic detail not confirmed from content.
### `/srv/homeassistant/config/.storage/core.config`
- Status: summarized; 428 bytes.
- Role: Not read in detail: runtime/opaque or backup area.
- Inputs/dependencies: 
- Outputs/effects: 
- Runtime fragility signal: Semantic detail not confirmed from content.
### `/srv/homeassistant/config/.storage/core.config_entries`
- Status: summarized; 23981 bytes.
- Role: Not read in detail: runtime/opaque or backup area.
- Inputs/dependencies: 
- Outputs/effects: 
- Runtime fragility signal: Semantic detail not confirmed from content.
### `/srv/homeassistant/config/.storage/core.device_registry`
- Status: summarized; 123370 bytes.
- Role: Not read in detail: runtime/opaque or backup area.
- Inputs/dependencies: 
- Outputs/effects: 
- Runtime fragility signal: Semantic detail not confirmed from content.
### `/srv/homeassistant/config/.storage/core.entity_registry`
- Status: summarized; 698977 bytes.
- Role: Not read in detail: runtime/opaque or backup area.
- Inputs/dependencies: 
- Outputs/effects: 
- Runtime fragility signal: Semantic detail not confirmed from content.
### `/srv/homeassistant/config/.storage/core.floor_registry`
- Status: summarized; 360 bytes.
- Role: Not read in detail: runtime/opaque or backup area.
- Inputs/dependencies: 
- Outputs/effects: 
- Runtime fragility signal: Semantic detail not confirmed from content.
### `/srv/homeassistant/config/.storage/core.label_registry`
- Status: summarized; 1488 bytes.
- Role: Not read in detail: runtime/opaque or backup area.
- Inputs/dependencies: 
- Outputs/effects: 
- Runtime fragility signal: Semantic detail not confirmed from content.
### `/srv/homeassistant/config/.storage/core.labs`
- Status: summarized; 218 bytes.
- Role: Not read in detail: runtime/opaque or backup area.
- Inputs/dependencies: 
- Outputs/effects: 
- Runtime fragility signal: Semantic detail not confirmed from content.
### `/srv/homeassistant/config/.storage/core.restore_state`
- Status: summarized; 112966 bytes.
- Role: Not read in detail: runtime/opaque or backup area.
- Inputs/dependencies: 
- Outputs/effects: 
- Runtime fragility signal: Semantic detail not confirmed from content.
### `/srv/homeassistant/config/.storage/core.uuid`
- Status: summarized; 126 bytes.
- Role: Not read in detail: runtime/opaque or backup area.
- Inputs/dependencies: 
- Outputs/effects: 
- Runtime fragility signal: Semantic detail not confirmed from content.
### `/srv/homeassistant/config/.storage/frontend.user_data_78c439dc78964fc8a13afa67c1284b8a`
- Status: summarized; 417 bytes.
- Role: Not read in detail: runtime/opaque or backup area.
- Inputs/dependencies: 
- Outputs/effects: 
- Runtime fragility signal: Semantic detail not confirmed from content.
### `/srv/homeassistant/config/.storage/homeassistant.exposed_entities`
- Status: summarized; 130481 bytes.
- Role: Not read in detail: runtime/opaque or backup area.
- Inputs/dependencies: 
- Outputs/effects: 
- Runtime fragility signal: Semantic detail not confirmed from content.
### `/srv/homeassistant/config/.storage/http`
- Status: summarized; 300 bytes.
- Role: Not read in detail: runtime/opaque or backup area.
- Inputs/dependencies: 
- Outputs/effects: 
- Runtime fragility signal: Semantic detail not confirmed from content.
### `/srv/homeassistant/config/.storage/http.auth`
- Status: summarized; 134 bytes.
- Role: Not read in detail: runtime/opaque or backup area.
- Inputs/dependencies: 
- Outputs/effects: 
- Runtime fragility signal: Semantic detail not confirmed from content.
### `/srv/homeassistant/config/.storage/lovelace.map`
- Status: summarized; 154 bytes.
- Role: Not read in detail: runtime/opaque or backup area.
- Inputs/dependencies: 
- Outputs/effects: 
- Runtime fragility signal: Semantic detail not confirmed from content.
### `/srv/homeassistant/config/.storage/lovelace_dashboards`
- Status: summarized; 316 bytes.
- Role: Not read in detail: runtime/opaque or backup area.
- Inputs/dependencies: 
- Outputs/effects: 
- Runtime fragility signal: Semantic detail not confirmed from content.
### `/srv/homeassistant/config/.storage/mobile_app`
- Status: summarized; 254 bytes.
- Role: Not read in detail: runtime/opaque or backup area.
- Inputs/dependencies: 
- Outputs/effects: 
- Runtime fragility signal: Semantic detail not confirmed from content.
### `/srv/homeassistant/config/.storage/onboarding`
- Status: summarized; 174 bytes.
- Role: Not read in detail: runtime/opaque or backup area.
- Inputs/dependencies: 
- Outputs/effects: 
- Runtime fragility signal: Semantic detail not confirmed from content.
### `/srv/homeassistant/config/.storage/person`
- Status: summarized; 449 bytes.
- Role: Not read in detail: runtime/opaque or backup area.
- Inputs/dependencies: 
- Outputs/effects: 
- Runtime fragility signal: Semantic detail not confirmed from content.
### `/srv/homeassistant/config/.storage/repairs.issue_registry`
- Status: summarized; 363 bytes.
- Role: Not read in detail: runtime/opaque or backup area.
- Inputs/dependencies: 
- Outputs/effects: 
- Runtime fragility signal: Semantic detail not confirmed from content.
### `/srv/homeassistant/config/.storage/tmp0tpx7o_6`
- Status: summarized; 0 bytes.
- Role: Not read in detail: runtime/opaque or backup area.
- Inputs/dependencies: 
- Outputs/effects: 
- Runtime fragility signal: Semantic detail not confirmed from content.
### `/srv/homeassistant/config/.storage/tmp28vxufij`
- Status: summarized; 0 bytes.
- Role: Not read in detail: runtime/opaque or backup area.
- Inputs/dependencies: 
- Outputs/effects: 
- Runtime fragility signal: Semantic detail not confirmed from content.
### `/srv/homeassistant/config/.storage/tmpb5cg7tip`
- Status: summarized; 0 bytes.
- Role: Not read in detail: runtime/opaque or backup area.
- Inputs/dependencies: 
- Outputs/effects: 
- Runtime fragility signal: Semantic detail not confirmed from content.
### `/srv/homeassistant/config/.storage/tmpogqas_nk`
- Status: summarized; 0 bytes.
- Role: Not read in detail: runtime/opaque or backup area.
- Inputs/dependencies: 
- Outputs/effects: 
- Runtime fragility signal: Semantic detail not confirmed from content.
### `/srv/homeassistant/config/.storage/tmpz2rgrg6d`
- Status: summarized; 0 bytes.
- Role: Not read in detail: runtime/opaque or backup area.
- Inputs/dependencies: 
- Outputs/effects: 
- Runtime fragility signal: Semantic detail not confirmed from content.
### `/srv/homeassistant/config/.storage/trace.saved_traces`
- Status: summarized; 85 bytes.
- Role: Not read in detail: runtime/opaque or backup area.
- Inputs/dependencies: 
- Outputs/effects: 
- Runtime fragility signal: Semantic detail not confirmed from content.
### `/srv/homeassistant/config/.storage/unifi_data`
- Status: summarized; 1029 bytes.
- Role: Not read in detail: runtime/opaque or backup area.
- Inputs/dependencies: 
- Outputs/effects: 
- Runtime fragility signal: Semantic detail not confirmed from content.
### `/srv/homeassistant/config/automations.yaml`
- Status: readable; 3 bytes.
- Role: Configuration or structured data file.
- Inputs/dependencies: No explicit env/import inputs extracted from sampled content.
- Outputs/effects: No obvious external side effect extracted from sampled content.
- Runtime fragility signal: No definite fragility extracted from sampled content.
### `/srv/homeassistant/config/automations.yaml.save`
- Status: summarized; 5 bytes.
- Role: Not read in detail: non-text or unsupported extension.
- Inputs/dependencies: 
- Outputs/effects: 
- Runtime fragility signal: Semantic detail not confirmed from content.
### `/srv/homeassistant/config/backups/Automatic_backup_2025.12.5_2026-02-28_05.21_18002881.tar`
- Status: summarized; 10403840 bytes.
- Role: Not read in detail: runtime/opaque or backup area.
- Inputs/dependencies: 
- Outputs/effects: 
- Runtime fragility signal: Semantic detail not confirmed from content.
### `/srv/homeassistant/config/backups/Automatic_backup_2025.12.5_2026-03-01_05.37_37002683.tar`
- Status: summarized; 10301440 bytes.
- Role: Not read in detail: runtime/opaque or backup area.
- Inputs/dependencies: 
- Outputs/effects: 
- Runtime fragility signal: Semantic detail not confirmed from content.
### `/srv/homeassistant/config/blueprints/automation/Blackshome/sensor-light.yaml`
- Status: summarized; 521669 bytes.
- Role: Not read in detail: large text file; summarized by metadata.
- Inputs/dependencies: 
- Outputs/effects: 
- Runtime fragility signal: Semantic detail not confirmed from content.
### `/srv/homeassistant/config/blueprints/automation/follow_me/room_follow_me_atmosphere.yaml`
- Status: readable; 5461 bytes.
- Role: Configuration or structured data file.
- Inputs/dependencies: No explicit env/import inputs extracted from sampled content.
- Outputs/effects: No obvious external side effect extracted from sampled content.
- Runtime fragility signal: No definite fragility extracted from sampled content.
### `/srv/homeassistant/config/blueprints/automation/homeassistant/ceiling_daily_ryhthm_presence.yaml.save`
- Status: summarized; 8111 bytes.
- Role: Not read in detail: non-text or unsupported extension.
- Inputs/dependencies: 
- Outputs/effects: 
- Runtime fragility signal: Semantic detail not confirmed from content.
### `/srv/homeassistant/config/blueprints/automation/homeassistant/motion_light.yaml`
- Status: readable; 1518 bytes.
- Role: Configuration or structured data file.
- Inputs/dependencies: No explicit env/import inputs extracted from sampled content.
- Outputs/effects: No obvious external side effect extracted from sampled content.
- Runtime fragility signal: No definite fragility extracted from sampled content.
### `/srv/homeassistant/config/blueprints/automation/homeassistant/notify_leaving_zone.yaml`
- Status: readable; 1668 bytes.
- Role: Configuration or structured data file.
- Inputs/dependencies: No explicit env/import inputs extracted from sampled content.
- Outputs/effects: No obvious external side effect extracted from sampled content.
- Runtime fragility signal: No definite fragility extracted from sampled content.
### `/srv/homeassistant/config/blueprints/script/homeassistant/confirmable_notification.yaml`
- Status: readable; 2593 bytes.
- Role: Configuration or structured data file.
- Inputs/dependencies: No explicit env/import inputs extracted from sampled content.
- Outputs/effects: No obvious external side effect extracted from sampled content.
- Runtime fragility signal: No definite fragility extracted from sampled content.
### `/srv/homeassistant/config/configuration.yaml`
- Status: readable; 327 bytes.
- Role: Configuration or structured data file.
- Inputs/dependencies: No explicit env/import inputs extracted from sampled content.
- Outputs/effects: No obvious external side effect extracted from sampled content.
- Runtime fragility signal: No definite fragility extracted from sampled content.
### `/srv/homeassistant/config/home-assistant.log`
- Status: summarized; 40292 bytes.
- Role: Not read in detail: opaque binary/runtime/archive/log artifact.
- Inputs/dependencies: 
- Outputs/effects: 
- Runtime fragility signal: Semantic detail not confirmed from content.
### `/srv/homeassistant/config/home-assistant.log.1`
- Status: summarized; 11130 bytes.
- Role: Not read in detail: non-text or unsupported extension.
- Inputs/dependencies: 
- Outputs/effects: 
- Runtime fragility signal: Semantic detail not confirmed from content.
### `/srv/homeassistant/config/home-assistant.log.fault`
- Status: summarized; 0 bytes.
- Role: Not read in detail: non-text or unsupported extension.
- Inputs/dependencies: 
- Outputs/effects: 
- Runtime fragility signal: Semantic detail not confirmed from content.
### `/srv/homeassistant/config/home-assistant_v2.db`
- Status: summarized; 38817792 bytes.
- Role: Not read in detail: opaque binary/runtime/archive/log artifact.
- Inputs/dependencies: 
- Outputs/effects: 
- Runtime fragility signal: Semantic detail not confirmed from content.
### `/srv/homeassistant/config/home-assistant_v2.db-shm`
- Status: summarized; 32768 bytes.
- Role: Not read in detail: opaque binary/runtime/archive/log artifact.
- Inputs/dependencies: 
- Outputs/effects: 
- Runtime fragility signal: Semantic detail not confirmed from content.
### `/srv/homeassistant/config/home-assistant_v2.db-wal`
- Status: summarized; 4342512 bytes.
- Role: Not read in detail: opaque binary/runtime/archive/log artifact.
- Inputs/dependencies: 
- Outputs/effects: 
- Runtime fragility signal: Semantic detail not confirmed from content.
### `/srv/homeassistant/config/packages/.example.yaml`
- Status: readable; 8 bytes.
- Role: Configuration or structured data file.
- Inputs/dependencies: No explicit env/import inputs extracted from sampled content.
- Outputs/effects: No obvious external side effect extracted from sampled content.
- Runtime fragility signal: No definite fragility extracted from sampled content.
### `/srv/homeassistant/config/packages/test_mode.yaml`
- Status: readable; 335 bytes.
- Role: Configuration or structured data file.
- Inputs/dependencies: No explicit env/import inputs extracted from sampled content.
- Outputs/effects: No obvious external side effect extracted from sampled content.
- Runtime fragility signal: No definite fragility extracted from sampled content.
### `/srv/homeassistant/config/scenes.yaml`
- Status: readable; 391 bytes.
- Role: Configuration or structured data file.
- Inputs/dependencies: No explicit env/import inputs extracted from sampled content.
- Outputs/effects: No obvious external side effect extracted from sampled content.
- Runtime fragility signal: No definite fragility extracted from sampled content.
### `/srv/homeassistant/config/scripts.yaml`
- Status: readable; 0 bytes.
- Role: Configuration or structured data file.
- Inputs/dependencies: No explicit env/import inputs extracted from sampled content.
- Outputs/effects: No obvious external side effect extracted from sampled content.
- Runtime fragility signal: No definite fragility extracted from sampled content.
### `/srv/homeassistant/config/secrets.yaml`
- Status: readable; 161 bytes.
- Role: Configuration or structured data file.
- Inputs/dependencies: No explicit env/import inputs extracted from sampled content.
- Outputs/effects: No obvious external side effect extracted from sampled content.
- Runtime fragility signal: No definite fragility extracted from sampled content.
### `/srv/homeassistant/config/tts/789c12f41dd3e864c9207260274601b6d4b97faf_en-gb_0d2fa44024_tts.home_assistant_cloud.mp3`
- Status: summarized; 23422 bytes.
- Role: Not read in detail: runtime/opaque or backup area.
- Inputs/dependencies: 
- Outputs/effects: 
- Runtime fragility signal: Semantic detail not confirmed from content.
### `/srv/homeassistant/config/tts/789c12f41dd3e864c9207260274601b6d4b97faf_en-gb_3218e3aa17_tts.home_assistant_cloud.mp3`
- Status: summarized; 25147 bytes.
- Role: Not read in detail: runtime/opaque or backup area.
- Inputs/dependencies: 
- Outputs/effects: 
- Runtime fragility signal: Semantic detail not confirmed from content.
### `/srv/homeassistant/config/tts/789c12f41dd3e864c9207260274601b6d4b97faf_en-gb_3479e059d2_tts.home_assistant_cloud.mp3`
- Status: summarized; 25242 bytes.
- Role: Not read in detail: runtime/opaque or backup area.
- Inputs/dependencies: 
- Outputs/effects: 
- Runtime fragility signal: Semantic detail not confirmed from content.
### `/srv/homeassistant/config/tts/789c12f41dd3e864c9207260274601b6d4b97faf_en-gb_519cf00aad_tts.home_assistant_cloud.mp3`
- Status: summarized; 25627 bytes.
- Role: Not read in detail: runtime/opaque or backup area.
- Inputs/dependencies: 
- Outputs/effects: 
- Runtime fragility signal: Semantic detail not confirmed from content.
### `/srv/homeassistant/config/tts/789c12f41dd3e864c9207260274601b6d4b97faf_en-gb_e61cb6a1ac_tts.home_assistant_cloud.mp3`
- Status: summarized; 25011 bytes.
- Role: Not read in detail: runtime/opaque or backup area.
- Inputs/dependencies: 
- Outputs/effects: 
- Runtime fragility signal: Semantic detail not confirmed from content.
### `/srv/homeassistant/config/tts/a8c3971a411cdbdf7c610d3a47faa1a4741921a9_af-za_85801fbabb_tts.home_assistant_cloud.mp3`
- Status: summarized; 48973 bytes.
- Role: Not read in detail: runtime/opaque or backup area.
- Inputs/dependencies: 
- Outputs/effects: 
- Runtime fragility signal: Semantic detail not confirmed from content.
### `/srv/homeassistant/config/tts/a8c3971a411cdbdf7c610d3a47faa1a4741921a9_am-et_a89c77a58e_tts.home_assistant_cloud.mp3`
- Status: summarized; 57839 bytes.
- Role: Not read in detail: runtime/opaque or backup area.
- Inputs/dependencies: 
- Outputs/effects: 
- Runtime fragility signal: Semantic detail not confirmed from content.
### `/srv/homeassistant/config/tts/a8c3971a411cdbdf7c610d3a47faa1a4741921a9_en-au_ff2f65b8ae_tts.home_assistant_cloud.mp3`
- Status: summarized; 45973 bytes.
- Role: Not read in detail: runtime/opaque or backup area.
- Inputs/dependencies: 
- Outputs/effects: 
- Runtime fragility signal: Semantic detail not confirmed from content.
### `/srv/homeassistant/config/tts/a8c3971a411cdbdf7c610d3a47faa1a4741921a9_en_-_tts.google_translate_en_com.mp3`
- Status: summarized; 41523 bytes.
- Role: Not read in detail: runtime/opaque or backup area.
- Inputs/dependencies: 
- Outputs/effects: 
- Runtime fragility signal: Semantic detail not confirmed from content.
### `/srv/homeassistant/config/tts/a8c3971a411cdbdf7c610d3a47faa1a4741921a9_sw-ke_a56bcf8564_tts.home_assistant_cloud.mp3`
- Status: summarized; 57766 bytes.
- Role: Not read in detail: runtime/opaque or backup area.
- Inputs/dependencies: 
- Outputs/effects: 
- Runtime fragility signal: Semantic detail not confirmed from content.
### `/srv/homeassistant/config/tts/a8c3971a411cdbdf7c610d3a47faa1a4741921a9_sw-ke_dec3e8d246_tts.home_assistant_cloud.mp3`
- Status: summarized; 55702 bytes.
- Role: Not read in detail: runtime/opaque or backup area.
- Inputs/dependencies: 
- Outputs/effects: 
- Runtime fragility signal: Semantic detail not confirmed from content.
### `/srv/homeassistant/config/tts/a8c3971a411cdbdf7c610d3a47faa1a4741921a9_ur-pk_db50514860_tts.home_assistant_cloud.mp3`
- Status: summarized; 46691 bytes.
- Role: Not read in detail: runtime/opaque or backup area.
- Inputs/dependencies: 
- Outputs/effects: 
- Runtime fragility signal: Semantic detail not confirmed from content.
### `/srv/homeassistant/docker-compose.yml`
- Status: readable; 824 bytes.
- Role: Docker Compose configuration with services, networks, ports, mounts, and env wiring.
- Inputs/dependencies: No explicit env/import inputs extracted from sampled content.
- Outputs/effects: Docker/container effect
- Runtime fragility signal: No definite fragility extracted from sampled content.
### `/srv/homeassistant/homeassistant.STALE/.HA_VERSION`
- Status: summarized; 9 bytes.
- Role: Not read in detail: listed but not sampled; lower-priority first-party text/config.
- Inputs/dependencies: 
- Outputs/effects: 
- Runtime fragility signal: Semantic detail not confirmed from content.
### `/srv/homeassistant/homeassistant.STALE/.cloud/acme_account.pem`
- Status: summarized; 1704 bytes.
- Role: Not read in detail: non-text or unsupported extension.
- Inputs/dependencies: 
- Outputs/effects: 
- Runtime fragility signal: Semantic detail not confirmed from content.
### `/srv/homeassistant/homeassistant.STALE/.cloud/acme_reg.json`
- Status: summarized; 676 bytes.
- Role: Not read in detail: listed but not sampled; lower-priority first-party text/config.
- Inputs/dependencies: 
- Outputs/effects: 
- Runtime fragility signal: Semantic detail not confirmed from content.
### `/srv/homeassistant/homeassistant.STALE/.cloud/production_auth.json`
- Status: summarized; 3901 bytes.
- Role: Not read in detail: listed but not sampled; lower-priority first-party text/config.
- Inputs/dependencies: 
- Outputs/effects: 
- Runtime fragility signal: Semantic detail not confirmed from content.
### `/srv/homeassistant/homeassistant.STALE/.cloud/remote_private.pem`
- Status: summarized; 1704 bytes.
- Role: Not read in detail: non-text or unsupported extension.
- Inputs/dependencies: 
- Outputs/effects: 
- Runtime fragility signal: Semantic detail not confirmed from content.
### `/srv/homeassistant/homeassistant.STALE/.ha_run.lock`
- Status: summarized; 84 bytes.
- Role: Not read in detail: non-text or unsupported extension.
- Inputs/dependencies: 
- Outputs/effects: 
- Runtime fragility signal: Semantic detail not confirmed from content.
### `/srv/homeassistant/homeassistant.STALE/.storage/assist_pipeline.pipelines`
- Status: summarized; 634 bytes.
- Role: Not read in detail: runtime/opaque or backup area.
- Inputs/dependencies: 
- Outputs/effects: 
- Runtime fragility signal: Semantic detail not confirmed from content.
### `/srv/homeassistant/homeassistant.STALE/.storage/auth`
- Status: summarized; 2827 bytes.
- Role: Not read in detail: runtime/opaque or backup area.
- Inputs/dependencies: 
- Outputs/effects: 
- Runtime fragility signal: Semantic detail not confirmed from content.
### `/srv/homeassistant/homeassistant.STALE/.storage/bluetooth.passive_update_processor`
- Status: summarized; 101 bytes.
- Role: Not read in detail: runtime/opaque or backup area.
- Inputs/dependencies: 
- Outputs/effects: 
- Runtime fragility signal: Semantic detail not confirmed from content.
### `/srv/homeassistant/homeassistant.STALE/.storage/bluetooth.remote_scanners`
- Status: summarized; 313 bytes.
- Role: Not read in detail: runtime/opaque or backup area.
- Inputs/dependencies: 
- Outputs/effects: 
- Runtime fragility signal: Semantic detail not confirmed from content.
### `/srv/homeassistant/homeassistant.STALE/.storage/cloud`
- Status: summarized; 1257 bytes.
- Role: Not read in detail: runtime/opaque or backup area.
- Inputs/dependencies: 
- Outputs/effects: 
- Runtime fragility signal: Semantic detail not confirmed from content.
### `/srv/homeassistant/homeassistant.STALE/.storage/core.config_entries`
- Status: summarized; 3267 bytes.
- Role: Not read in detail: runtime/opaque or backup area.
- Inputs/dependencies: 
- Outputs/effects: 
- Runtime fragility signal: Semantic detail not confirmed from content.
### `/srv/homeassistant/homeassistant.STALE/.storage/core.device_registry`
- Status: summarized; 2825 bytes.
- Role: Not read in detail: runtime/opaque or backup area.
- Inputs/dependencies: 
- Outputs/effects: 
- Runtime fragility signal: Semantic detail not confirmed from content.
### `/srv/homeassistant/homeassistant.STALE/.storage/core.entity_registry`
- Status: summarized; 16653 bytes.
- Role: Not read in detail: runtime/opaque or backup area.
- Inputs/dependencies: 
- Outputs/effects: 
- Runtime fragility signal: Semantic detail not confirmed from content.
### `/srv/homeassistant/homeassistant.STALE/.storage/core.restore_state`
- Status: summarized; 2064 bytes.
- Role: Not read in detail: runtime/opaque or backup area.
- Inputs/dependencies: 
- Outputs/effects: 
- Runtime fragility signal: Semantic detail not confirmed from content.
### `/srv/homeassistant/homeassistant.STALE/.storage/core.uuid`
- Status: summarized; 126 bytes.
- Role: Not read in detail: runtime/opaque or backup area.
- Inputs/dependencies: 
- Outputs/effects: 
- Runtime fragility signal: Semantic detail not confirmed from content.
### `/srv/homeassistant/homeassistant.STALE/.storage/homeassistant.exposed_entities`
- Status: summarized; 586 bytes.
- Role: Not read in detail: runtime/opaque or backup area.
- Inputs/dependencies: 
- Outputs/effects: 
- Runtime fragility signal: Semantic detail not confirmed from content.
### `/srv/homeassistant/homeassistant.STALE/.storage/http`
- Status: summarized; 300 bytes.
- Role: Not read in detail: runtime/opaque or backup area.
- Inputs/dependencies: 
- Outputs/effects: 
- Runtime fragility signal: Semantic detail not confirmed from content.
### `/srv/homeassistant/homeassistant.STALE/.storage/http.auth`
- Status: summarized; 134 bytes.
- Role: Not read in detail: runtime/opaque or backup area.
- Inputs/dependencies: 
- Outputs/effects: 
- Runtime fragility signal: Semantic detail not confirmed from content.
### `/srv/homeassistant/homeassistant.STALE/.storage/repairs.issue_registry`
- Status: summarized; 332 bytes.
- Role: Not read in detail: runtime/opaque or backup area.
- Inputs/dependencies: 
- Outputs/effects: 
- Runtime fragility signal: Semantic detail not confirmed from content.
### `/srv/homeassistant/homeassistant.STALE/.storage/trace.saved_traces`
- Status: summarized; 85 bytes.
- Role: Not read in detail: runtime/opaque or backup area.
- Inputs/dependencies: 
- Outputs/effects: 
- Runtime fragility signal: Semantic detail not confirmed from content.
### `/srv/homeassistant/homeassistant.STALE/automations.yaml`
- Status: summarized; 2 bytes.
- Role: Not read in detail: listed but not sampled; lower-priority first-party text/config.
- Inputs/dependencies: 
- Outputs/effects: 
- Runtime fragility signal: Semantic detail not confirmed from content.
### `/srv/homeassistant/homeassistant.STALE/blueprints/automation/homeassistant/motion_light.yaml`
- Status: summarized; 1518 bytes.
- Role: Not read in detail: listed but not sampled; lower-priority first-party text/config.
- Inputs/dependencies: 
- Outputs/effects: 
- Runtime fragility signal: Semantic detail not confirmed from content.
### `/srv/homeassistant/homeassistant.STALE/blueprints/automation/homeassistant/notify_leaving_zone.yaml`
- Status: summarized; 1668 bytes.
- Role: Not read in detail: listed but not sampled; lower-priority first-party text/config.
- Inputs/dependencies: 
- Outputs/effects: 
- Runtime fragility signal: Semantic detail not confirmed from content.
### `/srv/homeassistant/homeassistant.STALE/blueprints/script/homeassistant/confirmable_notification.yaml`
- Status: summarized; 2593 bytes.
- Role: Not read in detail: listed but not sampled; lower-priority first-party text/config.
- Inputs/dependencies: 
- Outputs/effects: 
- Runtime fragility signal: Semantic detail not confirmed from content.
### `/srv/homeassistant/homeassistant.STALE/configuration.yaml`
- Status: summarized; 265 bytes.
- Role: Not read in detail: listed but not sampled; lower-priority first-party text/config.
- Inputs/dependencies: 
- Outputs/effects: 
- Runtime fragility signal: Semantic detail not confirmed from content.
### `/srv/homeassistant/homeassistant.STALE/home-assistant.log`
- Status: summarized; 3922974 bytes.
- Role: Not read in detail: opaque binary/runtime/archive/log artifact.
- Inputs/dependencies: 
- Outputs/effects: 
- Runtime fragility signal: Semantic detail not confirmed from content.
### `/srv/homeassistant/homeassistant.STALE/home-assistant.log.1`
- Status: summarized; 0 bytes.
- Role: Not read in detail: non-text or unsupported extension.
- Inputs/dependencies: 
- Outputs/effects: 
- Runtime fragility signal: Semantic detail not confirmed from content.
### `/srv/homeassistant/homeassistant.STALE/home-assistant_v2.db`
- Status: summarized; 212992 bytes.
- Role: Not read in detail: opaque binary/runtime/archive/log artifact.
- Inputs/dependencies: 
- Outputs/effects: 
- Runtime fragility signal: Semantic detail not confirmed from content.
### `/srv/homeassistant/homeassistant.STALE/scenes.yaml`
- Status: summarized; 0 bytes.
- Role: Not read in detail: listed but not sampled; lower-priority first-party text/config.
- Inputs/dependencies: 
- Outputs/effects: 
- Runtime fragility signal: Semantic detail not confirmed from content.
### `/srv/homeassistant/homeassistant.STALE/scripts.yaml`
- Status: summarized; 0 bytes.
- Role: Not read in detail: listed but not sampled; lower-priority first-party text/config.
- Inputs/dependencies: 
- Outputs/effects: 
- Runtime fragility signal: Semantic detail not confirmed from content.
### `/srv/homeassistant/homeassistant.STALE/secrets.yaml`
- Status: summarized; 161 bytes.
- Role: Not read in detail: listed but not sampled; lower-priority first-party text/config.
- Inputs/dependencies: 
- Outputs/effects: 
- Runtime fragility signal: Semantic detail not confirmed from content.
### `/srv/homeassistant/matter/18073752089792134086.json`
- Status: summarized; 446097 bytes.
- Role: Not read in detail: large text file; summarized by metadata.
- Inputs/dependencies: 
- Outputs/effects: 
- Runtime fragility signal: Semantic detail not confirmed from content.
### `/srv/homeassistant/matter/18073752089792134086.json.backup`
- Status: summarized; 446097 bytes.
- Role: Not read in detail: non-text or unsupported extension.
- Inputs/dependencies: 
- Outputs/effects: 
- Runtime fragility signal: Semantic detail not confirmed from content.
### `/srv/homeassistant/matter/chip.json`
- Status: summarized; 3204 bytes.
- Role: Not read in detail: listed but not sampled; lower-priority first-party text/config.
- Inputs/dependencies: 
- Outputs/effects: 
- Runtime fragility signal: Semantic detail not confirmed from content.
### `/srv/homeassistant/matter/chip_config.ini`
- Status: summarized; 79 bytes.
- Role: Not read in detail: non-text or unsupported extension.
- Inputs/dependencies: 
- Outputs/effects: 
- Runtime fragility signal: Semantic detail not confirmed from content.
### `/srv/homeassistant/matter/chip_counters.ini`
- Status: summarized; 68 bytes.
- Role: Not read in detail: non-text or unsupported extension.
- Inputs/dependencies: 
- Outputs/effects: 
- Runtime fragility signal: Semantic detail not confirmed from content.
### `/srv/homeassistant/matter/chip_factory.ini`
- Status: summarized; 71 bytes.
- Role: Not read in detail: non-text or unsupported extension.
- Inputs/dependencies: 
- Outputs/effects: 
- Runtime fragility signal: Semantic detail not confirmed from content.
### `/srv/homeassistant/matter/credentials/.version`
- Status: summarized; 1 bytes.
- Role: Not read in detail: runtime/opaque or backup area.
- Inputs/dependencies: 
- Outputs/effects: 
- Runtime fragility signal: Semantic detail not confirmed from content.
### `/srv/homeassistant/matter/credentials/dcld_production_CN_70mai_Matter_PAA_vid_0x140B_145a51b59b3b8f596a8cd99642f0750c3498386f.der`
- Status: summarized; 458 bytes.
- Role: Not read in detail: runtime/opaque or backup area.
- Inputs/dependencies: 
- Outputs/effects: 
- Runtime fragility signal: Semantic detail not confirmed from content.
### `/srv/homeassistant/matter/credentials/dcld_production_CN_70mai_Matter_PAA_vid_0x140B_145a51b59b3b8f596a8cd99642f0750c3498386f.pem`
- Status: summarized; 675 bytes.
- Role: Not read in detail: runtime/opaque or backup area.
- Inputs/dependencies: 
- Outputs/effects: 
- Runtime fragility signal: Semantic detail not confirmed from content.
### `/srv/homeassistant/matter/credentials/dcld_production_CN_ACK_PAA_vid_0x137A_b265f84676e465cf6cd232b6938330c8ea306406.der`
- Status: summarized; 440 bytes.
- Role: Not read in detail: runtime/opaque or backup area.
- Inputs/dependencies: 
- Outputs/effects: 
- Runtime fragility signal: Semantic detail not confirmed from content.
### `/srv/homeassistant/matter/credentials/dcld_production_CN_ACK_PAA_vid_0x137A_b265f84676e465cf6cd232b6938330c8ea306406.pem`
- Status: summarized; 651 bytes.
- Role: Not read in detail: runtime/opaque or backup area.
- Inputs/dependencies: 
- Outputs/effects: 
- Runtime fragility signal: Semantic detail not confirmed from content.
### `/srv/homeassistant/matter/credentials/dcld_production_CN_Anker_Innovations_Matter_PAA_vid_0x1533_5d116e71031b9a4fc354b598cc7857a4ae50b286.der`
- Status: summarized; 471 bytes.
- Role: Not read in detail: runtime/opaque or backup area.
- Inputs/dependencies: 
- Outputs/effects: 
- Runtime fragility signal: Semantic detail not confirmed from content.
### `/srv/homeassistant/matter/credentials/dcld_production_CN_Anker_Innovations_Matter_PAA_vid_0x1533_5d116e71031b9a4fc354b598cc7857a4ae50b286.pem`
- Status: summarized; 691 bytes.
- Role: Not read in detail: runtime/opaque or backup area.
- Inputs/dependencies: 
- Outputs/effects: 
- Runtime fragility signal: Semantic detail not confirmed from content.
### `/srv/homeassistant/matter/credentials/dcld_production_CN_Aqara_Matter_PAA_01_O_Lumi_United_Technology_Co__Ltd_9a97fbee13625f7fef55740bf935f17471de4b76.der`
- Status: summarized; 505 bytes.
- Role: Not read in detail: runtime/opaque or backup area.
- Inputs/dependencies: 
- Outputs/effects: 
- Runtime fragility signal: Semantic detail not confirmed from content.
### `/srv/homeassistant/matter/credentials/dcld_production_CN_Aqara_Matter_PAA_01_O_Lumi_United_Technology_Co__Ltd_9a97fbee13625f7fef55740bf935f17471de4b76.pem`
- Status: summarized; 740 bytes.
- Role: Not read in detail: runtime/opaque or backup area.
- Inputs/dependencies: 
- Outputs/effects: 
- Runtime fragility signal: Semantic detail not confirmed from content.
### `/srv/homeassistant/matter/credentials/dcld_production_CN_Basics_PAA_vid_0x137B_3fe30cb51526467b44c11022086e2850a5509caa.der`
- Status: summarized; 446 bytes.
- Role: Not read in detail: runtime/opaque or backup area.
- Inputs/dependencies: 
- Outputs/effects: 
- Runtime fragility signal: Semantic detail not confirmed from content.
### `/srv/homeassistant/matter/credentials/dcld_production_CN_Basics_PAA_vid_0x137B_3fe30cb51526467b44c11022086e2850a5509caa.pem`
- Status: summarized; 659 bytes.
- Role: Not read in detail: runtime/opaque or backup area.
- Inputs/dependencies: 
- Outputs/effects: 
- Runtime fragility signal: Semantic detail not confirmed from content.
### `/srv/homeassistant/matter/credentials/dcld_production_CN_BouffaloLab_Matter_PAA_vid_0x130D_65b4a881fedf585123af92a952ca908f463d75eb.der`
- Status: summarized; 469 bytes.
- Role: Not read in detail: runtime/opaque or backup area.
- Inputs/dependencies: 
- Outputs/effects: 
- Runtime fragility signal: Semantic detail not confirmed from content.
### `/srv/homeassistant/matter/credentials/dcld_production_CN_BouffaloLab_Matter_PAA_vid_0x130D_65b4a881fedf585123af92a952ca908f463d75eb.pem`
- Status: summarized; 691 bytes.
- Role: Not read in detail: runtime/opaque or backup area.
- Inputs/dependencies: 
- Outputs/effects: 
- Runtime fragility signal: Semantic detail not confirmed from content.
### `/srv/homeassistant/matter/credentials/dcld_production_CN_CableLabs_Matter_PAA_9ff6b39edda3a11f6d255c893b4eb19d6120e8c7.der`
- Status: summarized; 392 bytes.
- Role: Not read in detail: runtime/opaque or backup area.
- Inputs/dependencies: 
- Outputs/effects: 
- Runtime fragility signal: Semantic detail not confirmed from content.
### `/srv/homeassistant/matter/credentials/dcld_production_CN_CableLabs_Matter_PAA_9ff6b39edda3a11f6d255c893b4eb19d6120e8c7.pem`
- Status: summarized; 586 bytes.
- Role: Not read in detail: runtime/opaque or backup area.
- Inputs/dependencies: 
- Outputs/effects: 
- Runtime fragility signal: Semantic detail not confirmed from content.
### `/srv/homeassistant/matter/credentials/dcld_production_CN_CommScope_Technologies_LLC_Matter_PAA_59f8edd15755d2da66a89e54bc797234435df46b.der`
- Status: summarized; 462 bytes.
- Role: Not read in detail: runtime/opaque or backup area.
- Inputs/dependencies: 
- Outputs/effects: 
- Runtime fragility signal: Semantic detail not confirmed from content.
### `/srv/homeassistant/matter/credentials/dcld_production_CN_CommScope_Technologies_LLC_Matter_PAA_59f8edd15755d2da66a89e54bc797234435df46b.pem`
- Status: summarized; 679 bytes.
- Role: Not read in detail: runtime/opaque or backup area.
- Inputs/dependencies: 
- Outputs/effects: 
- Runtime fragility signal: Semantic detail not confirmed from content.
### `/srv/homeassistant/matter/credentials/dcld_production_CN_Coolkit_Matter_PAA_vid_0x1286_d2cc1924a887c77da6ef95c95edebccc553a5ebe.der`
- Status: summarized; 462 bytes.
- Role: Not read in detail: runtime/opaque or backup area.
- Inputs/dependencies: 
- Outputs/effects: 
- Runtime fragility signal: Semantic detail not confirmed from content.
### `/srv/homeassistant/matter/credentials/dcld_production_CN_Coolkit_Matter_PAA_vid_0x1286_d2cc1924a887c77da6ef95c95edebccc553a5ebe.pem`
- Status: summarized; 679 bytes.
- Role: Not read in detail: runtime/opaque or backup area.
- Inputs/dependencies: 
- Outputs/effects: 
- Runtime fragility signal: Semantic detail not confirmed from content.
### `/srv/homeassistant/matter/credentials/dcld_production_CN_Cybertrust_Matter_PAA_G1_77c036e6c478b676dcab9bcae925652a1002cf82.der`
- Status: summarized; 435 bytes.
- Role: Not read in detail: runtime/opaque or backup area.
- Inputs/dependencies: 
- Outputs/effects: 
- Runtime fragility signal: Semantic detail not confirmed from content.
### `/srv/homeassistant/matter/credentials/dcld_production_CN_Cybertrust_Matter_PAA_G1_77c036e6c478b676dcab9bcae925652a1002cf82.pem`
- Status: summarized; 643 bytes.
- Role: Not read in detail: runtime/opaque or backup area.
- Inputs/dependencies: 
- Outputs/effects: 
- Runtime fragility signal: Semantic detail not confirmed from content.
### `/srv/homeassistant/matter/credentials/dcld_production_CN_DSC_Matter_PAA_O_Dream_Security_Co__Ltd_C_KR_4af051da936e771be615137128de4025335e698d.der`
- Status: summarized; 512 bytes.
- Role: Not read in detail: runtime/opaque or backup area.
- Inputs/dependencies: 
- Outputs/effects: 
- Runtime fragility signal: Semantic detail not confirmed from content.
### `/srv/homeassistant/matter/credentials/dcld_production_CN_DSC_Matter_PAA_O_Dream_Security_Co__Ltd_C_KR_4af051da936e771be615137128de4025335e698d.pem`
- Status: summarized; 748 bytes.
- Role: Not read in detail: runtime/opaque or backup area.
- Inputs/dependencies: 
- Outputs/effects: 
- Runtime fragility signal: Semantic detail not confirmed from content.
### `/srv/homeassistant/matter/credentials/dcld_production_CN_DigiCert_Root_CA_for_MATTER_PKI_G1_O_DigiCert__Inc_C_US_325045193344599b4665d459fd3a15f1c116ccbd.der`
- Status: summarized; 529 bytes.
- Role: Not read in detail: runtime/opaque or backup area.
- Inputs/dependencies: 
- Outputs/effects: 
- Runtime fragility signal: Semantic detail not confirmed from content.
### `/srv/homeassistant/matter/credentials/dcld_production_CN_DigiCert_Root_CA_for_MATTER_PKI_G1_O_DigiCert__Inc_C_US_325045193344599b4665d459fd3a15f1c116ccbd.pem`
- Status: summarized; 773 bytes.
- Role: Not read in detail: runtime/opaque or backup area.
- Inputs/dependencies: 
- Outputs/effects: 
- Runtime fragility signal: Semantic detail not confirmed from content.
### `/srv/homeassistant/matter/credentials/dcld_production_CN_Dooya_Matter_PAA_vid_0x1365_d87e4675aaf0be52be439cf2c006986d9af02e75.der`
- Status: summarized; 458 bytes.
- Role: Not read in detail: runtime/opaque or backup area.
- Inputs/dependencies: 
- Outputs/effects: 
- Runtime fragility signal: Semantic detail not confirmed from content.
### `/srv/homeassistant/matter/credentials/dcld_production_CN_Dooya_Matter_PAA_vid_0x1365_d87e4675aaf0be52be439cf2c006986d9af02e75.pem`
- Status: summarized; 675 bytes.
- Role: Not read in detail: runtime/opaque or backup area.
- Inputs/dependencies: 
- Outputs/effects: 
- Runtime fragility signal: Semantic detail not confirmed from content.
### `/srv/homeassistant/matter/credentials/dcld_production_CN_Ecovacs_Matter_PAA_CN_O_ECOVACS_IOT_vid_0x1405_ec77722a49bdab04f67e82718cca9778bacdf35e.der`
- Status: summarized; 479 bytes.
- Role: Not read in detail: runtime/opaque or backup area.
- Inputs/dependencies: 
- Outputs/effects: 
- Runtime fragility signal: Semantic detail not confirmed from content.
### `/srv/homeassistant/matter/credentials/dcld_production_CN_Ecovacs_Matter_PAA_CN_O_ECOVACS_IOT_vid_0x1405_ec77722a49bdab04f67e82718cca9778bacdf35e.pem`
- Status: summarized; 703 bytes.
- Role: Not read in detail: runtime/opaque or backup area.
- Inputs/dependencies: 
- Outputs/effects: 
- Runtime fragility signal: Semantic detail not confirmed from content.
### `/srv/homeassistant/matter/credentials/dcld_production_CN_Ecovacs_Matter_PAA_O_ECOVACS_IOT_vid_0x1405_2226720a08da696362b116923cb4742d12eb3a50.der`
- Status: summarized; 472 bytes.
- Role: Not read in detail: runtime/opaque or backup area.
- Inputs/dependencies: 
- Outputs/effects: 
- Runtime fragility signal: Semantic detail not confirmed from content.
### `/srv/homeassistant/matter/credentials/dcld_production_CN_Ecovacs_Matter_PAA_O_ECOVACS_IOT_vid_0x1405_2226720a08da696362b116923cb4742d12eb3a50.pem`
- Status: summarized; 695 bytes.
- Role: Not read in detail: runtime/opaque or backup area.
- Inputs/dependencies: 
- Outputs/effects: 
- Runtime fragility signal: Semantic detail not confirmed from content.
### `/srv/homeassistant/matter/credentials/dcld_production_CN_Energy_Magic_Cube_Matter_PAA_001_vid_0x1462_ae6a41baeeddf43063cc1dcee7cdc8133fcca738.der`
- Status: summarized; 490 bytes.
- Role: Not read in detail: runtime/opaque or backup area.
- Inputs/dependencies: 
- Outputs/effects: 
- Runtime fragility signal: Semantic detail not confirmed from content.
### `/srv/homeassistant/matter/credentials/dcld_production_CN_Energy_Magic_Cube_Matter_PAA_001_vid_0x1462_ae6a41baeeddf43063cc1dcee7cdc8133fcca738.pem`
- Status: summarized; 720 bytes.
- Role: Not read in detail: runtime/opaque or backup area.
- Inputs/dependencies: 
- Outputs/effects: 
- Runtime fragility signal: Semantic detail not confirmed from content.
### `/srv/homeassistant/matter/credentials/dcld_production_CN_Espressif_Matter_Open_PAA_O_Espressif_Systems_664cc1b02d331cd791546e9e1488333189bd6fd0.der`
- Status: summarized; 492 bytes.
- Role: Not read in detail: runtime/opaque or backup area.
- Inputs/dependencies: 
- Outputs/effects: 
- Runtime fragility signal: Semantic detail not confirmed from content.
### `/srv/homeassistant/matter/credentials/dcld_production_CN_Espressif_Matter_Open_PAA_O_Espressif_Systems_664cc1b02d331cd791546e9e1488333189bd6fd0.pem`
- Status: summarized; 720 bytes.
- Role: Not read in detail: runtime/opaque or backup area.
- Inputs/dependencies: 
- Outputs/effects: 
- Runtime fragility signal: Semantic detail not confirmed from content.
### `/srv/homeassistant/matter/credentials/dcld_production_CN_Espressif_Matter_PAA_O_Espressif_Systems_vid_0x131B_4d12f5801b75d32385c55590ef4527bcb3ba71e0.der`
- Status: summarized; 524 bytes.
- Role: Not read in detail: runtime/opaque or backup area.
- Inputs/dependencies: 
- Outputs/effects: 
- Runtime fragility signal: Semantic detail not confirmed from content.
### `/srv/homeassistant/matter/credentials/dcld_production_CN_Espressif_Matter_PAA_O_Espressif_Systems_vid_0x131B_4d12f5801b75d32385c55590ef4527bcb3ba71e0.pem`
- Status: summarized; 764 bytes.
- Role: Not read in detail: runtime/opaque or backup area.
- Inputs/dependencies: 
- Outputs/effects: 
- Runtime fragility signal: Semantic detail not confirmed from content.
### `/srv/homeassistant/matter/credentials/dcld_production_CN_Feit_Electric_PAA_vid_0x1423_069e86bf71db52f9df3cea7de4290c9f5b9968f1.der`
- Status: summarized; 463 bytes.
- Role: Not read in detail: runtime/opaque or backup area.
- Inputs/dependencies: 
- Outputs/effects: 
- Runtime fragility signal: Semantic detail not confirmed from content.
### `/srv/homeassistant/matter/credentials/dcld_production_CN_Feit_Electric_PAA_vid_0x1423_069e86bf71db52f9df3cea7de4290c9f5b9968f1.pem`
- Status: summarized; 683 bytes.
- Role: Not read in detail: runtime/opaque or backup area.
- Inputs/dependencies: 
- Outputs/effects: 
- Runtime fragility signal: Semantic detail not confirmed from content.
### `/srv/homeassistant/matter/credentials/dcld_production_CN_Freedompro_vid_0x1411_vid_0x1411_3cc0a7a85b62c1c5f4e17d064729112bdb0906c3.der`
- Status: summarized; 463 bytes.
- Role: Not read in detail: runtime/opaque or backup area.
- Inputs/dependencies: 
- Outputs/effects: 
- Runtime fragility signal: Semantic detail not confirmed from content.
### `/srv/homeassistant/matter/credentials/dcld_production_CN_Freedompro_vid_0x1411_vid_0x1411_3cc0a7a85b62c1c5f4e17d064729112bdb0906c3.pem`
- Status: summarized; 683 bytes.
- Role: Not read in detail: runtime/opaque or backup area.
- Inputs/dependencies: 
- Outputs/effects: 
- Runtime fragility signal: Semantic detail not confirmed from content.
### `/srv/homeassistant/matter/credentials/dcld_production_CN_HOPERF_Matter_PAA_01_vid_0x1470_e9160dc417f7419c95320bbf365671933ff31222.der`
- Status: summarized; 466 bytes.
- Role: Not read in detail: runtime/opaque or backup area.
- Inputs/dependencies: 
- Outputs/effects: 
- Runtime fragility signal: Semantic detail not confirmed from content.
### `/srv/homeassistant/matter/credentials/dcld_production_CN_HOPERF_Matter_PAA_01_vid_0x1470_e9160dc417f7419c95320bbf365671933ff31222.pem`
- Status: summarized; 687 bytes.
- Role: Not read in detail: runtime/opaque or backup area.
- Inputs/dependencies: 
- Outputs/effects: 
- Runtime fragility signal: Semantic detail not confirmed from content.
### `/srv/homeassistant/matter/credentials/dcld_production_CN_HooRii_Matter_PAA_G1_vid_0x1351_b716d73f2d66c67f788ce9c011133a0a5a12b1f5.der`
- Status: summarized; 464 bytes.
- Role: Not read in detail: runtime/opaque or backup area.
- Inputs/dependencies: 
- Outputs/effects: 
- Runtime fragility signal: Semantic detail not confirmed from content.
### `/srv/homeassistant/matter/credentials/dcld_production_CN_HooRii_Matter_PAA_G1_vid_0x1351_b716d73f2d66c67f788ce9c011133a0a5a12b1f5.pem`
- Status: summarized; 683 bytes.
- Role: Not read in detail: runtime/opaque or backup area.
- Inputs/dependencies: 
- Outputs/effects: 
- Runtime fragility signal: Semantic detail not confirmed from content.
### `/srv/homeassistant/matter/credentials/dcld_production_CN_HuaCheng_vid_0x1517_96c61d9ced0ad29e0429268e382473c8f8df69cd.der`
- Status: summarized; 440 bytes.
- Role: Not read in detail: runtime/opaque or backup area.
- Inputs/dependencies: 
- Outputs/effects: 
- Runtime fragility signal: Semantic detail not confirmed from content.
### `/srv/homeassistant/matter/credentials/dcld_production_CN_HuaCheng_vid_0x1517_96c61d9ced0ad29e0429268e382473c8f8df69cd.pem`
- Status: summarized; 651 bytes.
- Role: Not read in detail: runtime/opaque or backup area.
- Inputs/dependencies: 
- Outputs/effects: 
- Runtime fragility signal: Semantic detail not confirmed from content.
### `/srv/homeassistant/matter/credentials/dcld_production_CN_IKEA_of_Sweden_Matter_PAA_G1_vid_0x117C_6b318cfce99920d7328f5f436d5ea332b8b75d9a.der`
- Status: summarized; 487 bytes.
- Role: Not read in detail: runtime/opaque or backup area.
- Inputs/dependencies: 
- Outputs/effects: 
- Runtime fragility signal: Semantic detail not confirmed from content.
### `/srv/homeassistant/matter/credentials/dcld_production_CN_IKEA_of_Sweden_Matter_PAA_G1_vid_0x117C_6b318cfce99920d7328f5f436d5ea332b8b75d9a.pem`
- Status: summarized; 716 bytes.
- Role: Not read in detail: runtime/opaque or backup area.
- Inputs/dependencies: 
- Outputs/effects: 
- Runtime fragility signal: Semantic detail not confirmed from content.
### `/srv/homeassistant/matter/credentials/dcld_production_CN_Kasa_Matter_PAA_vid_0x1391_3567cf5979f65aa26080f4f1c95aad6e89519d2f.der`
- Status: summarized; 451 bytes.
- Role: Not read in detail: runtime/opaque or backup area.
- Inputs/dependencies: 
- Outputs/effects: 
- Runtime fragility signal: Semantic detail not confirmed from content.
### `/srv/homeassistant/matter/credentials/dcld_production_CN_Kasa_Matter_PAA_vid_0x1391_3567cf5979f65aa26080f4f1c95aad6e89519d2f.pem`
- Status: summarized; 667 bytes.
- Role: Not read in detail: runtime/opaque or backup area.
- Inputs/dependencies: 
- Outputs/effects: 
- Runtime fragility signal: Semantic detail not confirmed from content.
### `/srv/homeassistant/matter/credentials/dcld_production_CN_Kudelski_Matter_PAA_01_a607c3607b7150e3622ab0ba889e6cbc3fc552f9.der`
- Status: summarized; 428 bytes.
- Role: Not read in detail: runtime/opaque or backup area.
- Inputs/dependencies: 
- Outputs/effects: 
- Runtime fragility signal: Semantic detail not confirmed from content.
### `/srv/homeassistant/matter/credentials/dcld_production_CN_Kudelski_Matter_PAA_01_a607c3607b7150e3622ab0ba889e6cbc3fc552f9.pem`
- Status: summarized; 634 bytes.
- Role: Not read in detail: runtime/opaque or backup area.
- Inputs/dependencies: 
- Outputs/effects: 
- Runtime fragility signal: Semantic detail not confirmed from content.
### `/srv/homeassistant/matter/credentials/dcld_production_CN_Kwikset_Matter_PAA_O_Kwikset_vid_0x1421_fedc58bbaaa32ffbe09bac7cc40360a08f965837.der`
- Status: summarized; 463 bytes.
- Role: Not read in detail: runtime/opaque or backup area.
- Inputs/dependencies: 
- Outputs/effects: 
- Runtime fragility signal: Semantic detail not confirmed from content.
### `/srv/homeassistant/matter/credentials/dcld_production_CN_Kwikset_Matter_PAA_O_Kwikset_vid_0x1421_fedc58bbaaa32ffbe09bac7cc40360a08f965837.pem`
- Status: summarized; 683 bytes.
- Role: Not read in detail: runtime/opaque or backup area.
- Inputs/dependencies: 
- Outputs/effects: 
- Runtime fragility signal: Semantic detail not confirmed from content.
### `/srv/homeassistant/matter/credentials/dcld_production_CN_LEEDARSON-MATTER-PAA_vid_0x1168_0ea09d6b393f8a2b3733669a90a573d31e7a056a.der`
- Status: summarized; 422 bytes.
- Role: Not read in detail: runtime/opaque or backup area.
- Inputs/dependencies: 
- Outputs/effects: 
- Runtime fragility signal: Semantic detail not confirmed from content.
### `/srv/homeassistant/matter/credentials/dcld_production_CN_LEEDARSON-MATTER-PAA_vid_0x1168_0ea09d6b393f8a2b3733669a90a573d31e7a056a.pem`
- Status: summarized; 626 bytes.
- Role: Not read in detail: runtime/opaque or backup area.
- Inputs/dependencies: 
- Outputs/effects: 
- Runtime fragility signal: Semantic detail not confirmed from content.
### `/srv/homeassistant/matter/credentials/dcld_production_CN_LEEDARSON-MATTER-PAA_vid_0x1168_72a63a316e9a3cae15299cff8e8cc7fab387d185.der`
- Status: summarized; 465 bytes.
- Role: Not read in detail: runtime/opaque or backup area.
- Inputs/dependencies: 
- Outputs/effects: 
- Runtime fragility signal: Semantic detail not confirmed from content.
### `/srv/homeassistant/matter/credentials/dcld_production_CN_LEEDARSON-MATTER-PAA_vid_0x1168_72a63a316e9a3cae15299cff8e8cc7fab387d185.pem`
- Status: summarized; 683 bytes.
- Role: Not read in detail: runtime/opaque or backup area.
- Inputs/dependencies: 
- Outputs/effects: 
- Runtime fragility signal: Semantic detail not confirmed from content.
### `/srv/homeassistant/matter/credentials/dcld_production_CN_Legrand_Group_Matter_PAA_vid_0x1021_0b5107bcde0d3041d6268918ca7d7a928642a1f1.der`
- Status: summarized; 480 bytes.
- Role: Not read in detail: runtime/opaque or backup area.
- Inputs/dependencies: 
- Outputs/effects: 
- Runtime fragility signal: Semantic detail not confirmed from content.
### `/srv/homeassistant/matter/credentials/dcld_production_CN_Legrand_Group_Matter_PAA_vid_0x1021_0b5107bcde0d3041d6268918ca7d7a928642a1f1.pem`
- Status: summarized; 703 bytes.
- Role: Not read in detail: runtime/opaque or backup area.
- Inputs/dependencies: 
- Outputs/effects: 
- Runtime fragility signal: Semantic detail not confirmed from content.
### `/srv/homeassistant/matter/credentials/dcld_production_CN_Leviton_PAA_vid_0x109B_8e95b1c0b6105193db41b66bef434e2c38a27a67.der`
- Status: summarized; 442 bytes.
- Role: Not read in detail: runtime/opaque or backup area.
- Inputs/dependencies: 
- Outputs/effects: 
- Runtime fragility signal: Semantic detail not confirmed from content.
### `/srv/homeassistant/matter/credentials/dcld_production_CN_Leviton_PAA_vid_0x109B_8e95b1c0b6105193db41b66bef434e2c38a27a67.pem`
- Status: summarized; 655 bytes.
- Role: Not read in detail: runtime/opaque or backup area.
- Inputs/dependencies: 
- Outputs/effects: 
- Runtime fragility signal: Semantic detail not confirmed from content.
### `/srv/homeassistant/matter/credentials/dcld_production_CN_Longanlink_Matter_PAA_01_vid_0x131F_c1204b09bcfe2cda63ce9b7e308284cbc6a27847.der`
- Status: summarized; 479 bytes.
- Role: Not read in detail: runtime/opaque or backup area.
- Inputs/dependencies: 
- Outputs/effects: 
- Runtime fragility signal: Semantic detail not confirmed from content.
### `/srv/homeassistant/matter/credentials/dcld_production_CN_Longanlink_Matter_PAA_01_vid_0x131F_c1204b09bcfe2cda63ce9b7e308284cbc6a27847.pem`
- Status: summarized; 703 bytes.
- Role: Not read in detail: runtime/opaque or backup area.
- Inputs/dependencies: 
- Outputs/effects: 
- Runtime fragility signal: Semantic detail not confirmed from content.
### `/srv/homeassistant/matter/credentials/dcld_production_CN_Matter_Certification_and_Testing_CA_O_CSA_vid_0xC5A0_97e469d0c50414c26fc701f77e947739098df6a5.der`
- Status: summarized; 517 bytes.
- Role: Not read in detail: runtime/opaque or backup area.
- Inputs/dependencies: 
- Outputs/effects: 
- Runtime fragility signal: Semantic detail not confirmed from content.
### `/srv/homeassistant/matter/credentials/dcld_production_CN_Matter_Certification_and_Testing_CA_O_CSA_vid_0xC5A0_97e469d0c50414c26fc701f77e947739098df6a5.pem`
- Status: summarized; 756 bytes.
- Role: Not read in detail: runtime/opaque or backup area.
- Inputs/dependencies: 
- Outputs/effects: 
- Runtime fragility signal: Semantic detail not confirmed from content.
### `/srv/homeassistant/matter/credentials/dcld_production_CN_Matter_PAA_1_O_ubisys_technologies_GmbH_vid_0x10F2_a5d1b0bf948948679986d706114d948afa87f902.der`
- Status: summarized; 523 bytes.
- Role: Not read in detail: runtime/opaque or backup area.
- Inputs/dependencies: 
- Outputs/effects: 
- Runtime fragility signal: Semantic detail not confirmed from content.
### `/srv/homeassistant/matter/credentials/dcld_production_CN_Matter_PAA_1_O_ubisys_technologies_GmbH_vid_0x10F2_a5d1b0bf948948679986d706114d948afa87f902.pem`
- Status: summarized; 764 bytes.
- Role: Not read in detail: runtime/opaque or backup area.
- Inputs/dependencies: 
- Outputs/effects: 
- Runtime fragility signal: Semantic detail not confirmed from content.
### `/srv/homeassistant/matter/credentials/dcld_production_CN_Matter_PAA_2_O_Google_C_US_vid_0x6006_7ab9eda76fe9cb646275326dd14508b800f8e1c8.der`
- Status: summarized; 498 bytes.
- Role: Not read in detail: runtime/opaque or backup area.
- Inputs/dependencies: 
- Outputs/effects: 
- Runtime fragility signal: Semantic detail not confirmed from content.
### `/srv/homeassistant/matter/credentials/dcld_production_CN_Matter_PAA_2_O_Google_C_US_vid_0x6006_7ab9eda76fe9cb646275326dd14508b800f8e1c8.pem`
- Status: summarized; 728 bytes.
- Role: Not read in detail: runtime/opaque or backup area.
- Inputs/dependencies: 
- Outputs/effects: 
- Runtime fragility signal: Semantic detail not confirmed from content.
### `/srv/homeassistant/matter/credentials/dcld_production_CN_Matter_Signify_PAA_1_vid_0x100B_10de4559bcaa8082867879c09a7f8eec8a887ef7.der`
- Status: summarized; 433 bytes.
- Role: Not read in detail: runtime/opaque or backup area.
- Inputs/dependencies: 
- Outputs/effects: 
- Runtime fragility signal: Semantic detail not confirmed from content.
### `/srv/homeassistant/matter/credentials/dcld_production_CN_Matter_Signify_PAA_1_vid_0x100B_10de4559bcaa8082867879c09a7f8eec8a887ef7.pem`
- Status: summarized; 643 bytes.
- Role: Not read in detail: runtime/opaque or backup area.
- Inputs/dependencies: 
- Outputs/effects: 
- Runtime fragility signal: Semantic detail not confirmed from content.
### `/srv/homeassistant/matter/credentials/dcld_production_CN_Matter_Uascent_PAA_0x1400_vid_0x1400_3083798964e093a8b259feb6c378096e25684e9a.der`
- Status: summarized; 476 bytes.
- Role: Not read in detail: runtime/opaque or backup area.
- Inputs/dependencies: 
- Outputs/effects: 
- Runtime fragility signal: Semantic detail not confirmed from content.
### `/srv/homeassistant/matter/credentials/dcld_production_CN_Matter_Uascent_PAA_0x1400_vid_0x1400_3083798964e093a8b259feb6c378096e25684e9a.pem`
- Status: summarized; 699 bytes.
- Role: Not read in detail: runtime/opaque or backup area.
- Inputs/dependencies: 
- Outputs/effects: 
- Runtime fragility signal: Semantic detail not confirmed from content.
### `/srv/homeassistant/matter/credentials/dcld_production_CN_Meross_Matter_PAA_vid_0x1345_409746a43d7ef151b6cdd8a09ea476fa9bdf7563.der`
- Status: summarized; 453 bytes.
- Role: Not read in detail: runtime/opaque or backup area.
- Inputs/dependencies: 
- Outputs/effects: 
- Runtime fragility signal: Semantic detail not confirmed from content.
### `/srv/homeassistant/matter/credentials/dcld_production_CN_Meross_Matter_PAA_vid_0x1345_409746a43d7ef151b6cdd8a09ea476fa9bdf7563.pem`
- Status: summarized; 667 bytes.
- Role: Not read in detail: runtime/opaque or backup area.
- Inputs/dependencies: 
- Outputs/effects: 
- Runtime fragility signal: Semantic detail not confirmed from content.
### `/srv/homeassistant/matter/credentials/dcld_production_CN_Midea_Group_Matter_PAA_G1_Prod_vid_0x118C_a95ee7c4727f6463a5294840550ce8af625f3111.der`
- Status: summarized; 482 bytes.
- Role: Not read in detail: runtime/opaque or backup area.
- Inputs/dependencies: 
- Outputs/effects: 
- Runtime fragility signal: Semantic detail not confirmed from content.
### `/srv/homeassistant/matter/credentials/dcld_production_CN_Midea_Group_Matter_PAA_G1_Prod_vid_0x118C_a95ee7c4727f6463a5294840550ce8af625f3111.pem`
- Status: summarized; 708 bytes.
- Role: Not read in detail: runtime/opaque or backup area.
- Inputs/dependencies: 
- Outputs/effects: 
- Runtime fragility signal: Semantic detail not confirmed from content.
### `/srv/homeassistant/matter/credentials/dcld_production_CN_Nexus_Matter_PAA_G1_O_Technology_Nexus_SBS_AB_C_SE_a8d9a7562018c076c6bb7cbdf677744641deb6a7.der`
- Status: summarized; 517 bytes.
- Role: Not read in detail: runtime/opaque or backup area.
- Inputs/dependencies: 
- Outputs/effects: 
- Runtime fragility signal: Semantic detail not confirmed from content.
### `/srv/homeassistant/matter/credentials/dcld_production_CN_Nexus_Matter_PAA_G1_O_Technology_Nexus_SBS_AB_C_SE_a8d9a7562018c076c6bb7cbdf677744641deb6a7.pem`
- Status: summarized; 756 bytes.
- Role: Not read in detail: runtime/opaque or backup area.
- Inputs/dependencies: 
- Outputs/effects: 
- Runtime fragility signal: Semantic detail not confirmed from content.
### `/srv/homeassistant/matter/credentials/dcld_production_CN_PanKorePAA_O_PanKore_vid_0x1316_568b487d9ff7ba9f86f976efe1ad79043357abc3.der`
- Status: summarized; 449 bytes.
- Role: Not read in detail: runtime/opaque or backup area.
- Inputs/dependencies: 
- Outputs/effects: 
- Runtime fragility signal: Semantic detail not confirmed from content.
### `/srv/homeassistant/matter/credentials/dcld_production_CN_PanKorePAA_O_PanKore_vid_0x1316_568b487d9ff7ba9f86f976efe1ad79043357abc3.pem`
- Status: summarized; 663 bytes.
- Role: Not read in detail: runtime/opaque or backup area.
- Inputs/dependencies: 
- Outputs/effects: 
- Runtime fragility signal: Semantic detail not confirmed from content.
### `/srv/homeassistant/matter/credentials/dcld_production_CN_Phaten_Matter_PAA_vid_0x1404_9920e855b8b4658f1fde8b782f09b21c45b141b7.der`
- Status: summarized; 460 bytes.
- Role: Not read in detail: runtime/opaque or backup area.
- Inputs/dependencies: 
- Outputs/effects: 
- Runtime fragility signal: Semantic detail not confirmed from content.
### `/srv/homeassistant/matter/credentials/dcld_production_CN_Phaten_Matter_PAA_vid_0x1404_9920e855b8b4658f1fde8b782f09b21c45b141b7.pem`
- Status: summarized; 679 bytes.
- Role: Not read in detail: runtime/opaque or backup area.
- Inputs/dependencies: 
- Outputs/effects: 
- Runtime fragility signal: Semantic detail not confirmed from content.
### `/srv/homeassistant/matter/credentials/dcld_production_CN_PhotonSail_Matter_PAA_vid_0x140D_a12c4edaaa4231627ca3ade4631b96d76fef653d.der`
- Status: summarized; 468 bytes.
- Role: Not read in detail: runtime/opaque or backup area.
- Inputs/dependencies: 
- Outputs/effects: 
- Runtime fragility signal: Semantic detail not confirmed from content.
### `/srv/homeassistant/matter/credentials/dcld_production_CN_PhotonSail_Matter_PAA_vid_0x140D_a12c4edaaa4231627ca3ade4631b96d76fef653d.pem`
- Status: summarized; 687 bytes.
- Role: Not read in detail: runtime/opaque or backup area.
- Inputs/dependencies: 
- Outputs/effects: 
- Runtime fragility signal: Semantic detail not confirmed from content.
### `/srv/homeassistant/matter/credentials/dcld_production_CN_Prime_PAA_vid_0x1381_e7b991bb9c9ed061a7cb9bf188644a1563c24e2b.der`
- Status: summarized; 444 bytes.
- Role: Not read in detail: runtime/opaque or backup area.
- Inputs/dependencies: 
- Outputs/effects: 
- Runtime fragility signal: Semantic detail not confirmed from content.
### `/srv/homeassistant/matter/credentials/dcld_production_CN_Prime_PAA_vid_0x1381_e7b991bb9c9ed061a7cb9bf188644a1563c24e2b.pem`
- Status: summarized; 655 bytes.
- Role: Not read in detail: runtime/opaque or backup area.
- Inputs/dependencies: 
- Outputs/effects: 
- Runtime fragility signal: Semantic detail not confirmed from content.
### `/srv/homeassistant/matter/credentials/dcld_production_CN_Qianyan_Matter_PAA_vid_0x1387_30a7fc6cd6fa5acb827f776e3262076bb811e429.der`
- Status: summarized; 462 bytes.
- Role: Not read in detail: runtime/opaque or backup area.
- Inputs/dependencies: 
- Outputs/effects: 
- Runtime fragility signal: Semantic detail not confirmed from content.
### `/srv/homeassistant/matter/credentials/dcld_production_CN_Qianyan_Matter_PAA_vid_0x1387_30a7fc6cd6fa5acb827f776e3262076bb811e429.pem`
- Status: summarized; 679 bytes.
- Role: Not read in detail: runtime/opaque or backup area.
- Inputs/dependencies: 
- Outputs/effects: 
- Runtime fragility signal: Semantic detail not confirmed from content.
### `/srv/homeassistant/matter/credentials/dcld_production_CN_Quectel_Matter_PAA_vid_0x1410_d8cef49840a35ba100dc3be786b54cda387e2502.der`
- Status: summarized; 468 bytes.
- Role: Not read in detail: runtime/opaque or backup area.
- Inputs/dependencies: 
- Outputs/effects: 
- Runtime fragility signal: Semantic detail not confirmed from content.
### `/srv/homeassistant/matter/credentials/dcld_production_CN_Quectel_Matter_PAA_vid_0x1410_d8cef49840a35ba100dc3be786b54cda387e2502.pem`
- Status: summarized; 687 bytes.
- Role: Not read in detail: runtime/opaque or backup area.
- Inputs/dependencies: 
- Outputs/effects: 
- Runtime fragility signal: Semantic detail not confirmed from content.
### `/srv/homeassistant/matter/credentials/dcld_production_CN_Rafael_Matter_PAA_vid_0x1346_c4f7e1d5bbf99dffd1ee0176d568278ce89b2017.der`
- Status: summarized; 454 bytes.
- Role: Not read in detail: runtime/opaque or backup area.
- Inputs/dependencies: 
- Outputs/effects: 
- Runtime fragility signal: Semantic detail not confirmed from content.
### `/srv/homeassistant/matter/credentials/dcld_production_CN_Rafael_Matter_PAA_vid_0x1346_c4f7e1d5bbf99dffd1ee0176d568278ce89b2017.pem`
- Status: summarized; 671 bytes.
- Role: Not read in detail: runtime/opaque or backup area.
- Inputs/dependencies: 
- Outputs/effects: 
- Runtime fragility signal: Semantic detail not confirmed from content.
### `/srv/homeassistant/matter/credentials/dcld_production_CN_Resideo_Matter_PAA_vid_0x131A_33b9842506fa39b2ddf3b70b8a821469e2f5c2f6.der`
- Status: summarized; 429 bytes.
- Role: Not read in detail: runtime/opaque or backup area.
- Inputs/dependencies: 
- Outputs/effects: 
- Runtime fragility signal: Semantic detail not confirmed from content.
### `/srv/homeassistant/matter/credentials/dcld_production_CN_Resideo_Matter_PAA_vid_0x131A_33b9842506fa39b2ddf3b70b8a821469e2f5c2f6.pem`
- Status: summarized; 634 bytes.
- Role: Not read in detail: runtime/opaque or backup area.
- Inputs/dependencies: 
- Outputs/effects: 
- Runtime fragility signal: Semantic detail not confirmed from content.
### `/srv/homeassistant/matter/credentials/dcld_production_CN_SSLcom_Matter_ECC_Root_CA_2025_O_SSL_Corporation_C_US_dc68452b760519bd0f59b11eaa314185c15ae642.der`
- Status: summarized; 525 bytes.
- Role: Not read in detail: runtime/opaque or backup area.
- Inputs/dependencies: 
- Outputs/effects: 
- Runtime fragility signal: Semantic detail not confirmed from content.
### `/srv/homeassistant/matter/credentials/dcld_production_CN_SSLcom_Matter_ECC_Root_CA_2025_O_SSL_Corporation_C_US_dc68452b760519bd0f59b11eaa314185c15ae642.pem`
- Status: summarized; 764 bytes.
- Role: Not read in detail: runtime/opaque or backup area.
- Inputs/dependencies: 
- Outputs/effects: 
- Runtime fragility signal: Semantic detail not confirmed from content.
### `/srv/homeassistant/matter/credentials/dcld_production_CN_STMicroelectronics_Matter_PAA_01_f96dbf5e2f76a27529ef80b90a635a9ddec82c53.der`
- Status: summarized; 451 bytes.
- Role: Not read in detail: runtime/opaque or backup area.
- Inputs/dependencies: 
- Outputs/effects: 
- Runtime fragility signal: Semantic detail not confirmed from content.
### `/srv/homeassistant/matter/credentials/dcld_production_CN_STMicroelectronics_Matter_PAA_01_f96dbf5e2f76a27529ef80b90a635a9ddec82c53.pem`
- Status: summarized; 667 bytes.
- Role: Not read in detail: runtime/opaque or backup area.
- Inputs/dependencies: 
- Outputs/effects: 
- Runtime fragility signal: Semantic detail not confirmed from content.
### `/srv/homeassistant/matter/credentials/dcld_production_CN_Safemo_Matter_PAA_vid_0x1506_2b0022f9b4711f5d24d96d0f0373aa090ea5db93.der`
- Status: summarized; 460 bytes.
- Role: Not read in detail: runtime/opaque or backup area.
- Inputs/dependencies: 
- Outputs/effects: 
- Runtime fragility signal: Semantic detail not confirmed from content.
### `/srv/homeassistant/matter/credentials/dcld_production_CN_Safemo_Matter_PAA_vid_0x1506_2b0022f9b4711f5d24d96d0f0373aa090ea5db93.pem`
- Status: summarized; 679 bytes.
- Role: Not read in detail: runtime/opaque or backup area.
- Inputs/dependencies: 
- Outputs/effects: 
- Runtime fragility signal: Semantic detail not confirmed from content.
### `/srv/homeassistant/matter/credentials/dcld_production_CN_Schneider_Electric_Matter_PAA_01_vid_0x105E_aad471a2a11611c94128f1ab35cbc26cb4a64b00.der`
- Status: summarized; 494 bytes.
- Role: Not read in detail: runtime/opaque or backup area.
- Inputs/dependencies: 
- Outputs/effects: 
- Runtime fragility signal: Semantic detail not confirmed from content.
### `/srv/homeassistant/matter/credentials/dcld_production_CN_Schneider_Electric_Matter_PAA_01_vid_0x105E_aad471a2a11611c94128f1ab35cbc26cb4a64b00.pem`
- Status: summarized; 724 bytes.
- Role: Not read in detail: runtime/opaque or backup area.
- Inputs/dependencies: 
- Outputs/effects: 
- Runtime fragility signal: Semantic detail not confirmed from content.
### `/srv/homeassistant/matter/credentials/dcld_production_CN_Sengled_Matter_PAA_vid_0x1160_0fd9c7d62f1c534f95f50f51520fbb0075b59290.der`
- Status: summarized; 428 bytes.
- Role: Not read in detail: runtime/opaque or backup area.
- Inputs/dependencies: 
- Outputs/effects: 
- Runtime fragility signal: Semantic detail not confirmed from content.
### `/srv/homeassistant/matter/credentials/dcld_production_CN_Sengled_Matter_PAA_vid_0x1160_0fd9c7d62f1c534f95f50f51520fbb0075b59290.pem`
- Status: summarized; 634 bytes.
- Role: Not read in detail: runtime/opaque or backup area.
- Inputs/dependencies: 
- Outputs/effects: 
- Runtime fragility signal: Semantic detail not confirmed from content.
### `/srv/homeassistant/matter/credentials/dcld_production_CN_Sercomm-Matter-PAA-01_vid_0x1131_908fd2ebc953adb0f4aeb2d8423c2da1402d3182.der`
- Status: summarized; 474 bytes.
- Role: Not read in detail: runtime/opaque or backup area.
- Inputs/dependencies: 
- Outputs/effects: 
- Runtime fragility signal: Semantic detail not confirmed from content.
### `/srv/homeassistant/matter/credentials/dcld_production_CN_Sercomm-Matter-PAA-01_vid_0x1131_908fd2ebc953adb0f4aeb2d8423c2da1402d3182.pem`
- Status: summarized; 695 bytes.
- Role: Not read in detail: runtime/opaque or backup area.
- Inputs/dependencies: 
- Outputs/effects: 
- Runtime fragility signal: Semantic detail not confirmed from content.
### `/srv/homeassistant/matter/credentials/dcld_production_CN_Siterwell_Matter_PAA_vid_0x1280_5441e16bb2ecccfedbb0dfbe00597897ef510a42.der`
- Status: summarized; 432 bytes.
- Role: Not read in detail: runtime/opaque or backup area.
- Inputs/dependencies: 
- Outputs/effects: 
- Runtime fragility signal: Semantic detail not confirmed from content.
### `/srv/homeassistant/matter/credentials/dcld_production_CN_Siterwell_Matter_PAA_vid_0x1280_5441e16bb2ecccfedbb0dfbe00597897ef510a42.pem`
- Status: summarized; 638 bytes.
- Role: Not read in detail: runtime/opaque or backup area.
- Inputs/dependencies: 
- Outputs/effects: 
- Runtime fragility signal: Semantic detail not confirmed from content.
### `/srv/homeassistant/matter/credentials/dcld_production_CN_Snowball_Matter_PAA_01_f30a7ef7ca9343aabea4801bbf45484ffef81e65.der`
- Status: summarized; 426 bytes.
- Role: Not read in detail: runtime/opaque or backup area.
- Inputs/dependencies: 
- Outputs/effects: 
- Runtime fragility signal: Semantic detail not confirmed from content.
### `/srv/homeassistant/matter/credentials/dcld_production_CN_Snowball_Matter_PAA_01_f30a7ef7ca9343aabea4801bbf45484ffef81e65.pem`
- Status: summarized; 630 bytes.
- Role: Not read in detail: runtime/opaque or backup area.
- Inputs/dependencies: 
- Outputs/effects: 
- Runtime fragility signal: Semantic detail not confirmed from content.
### `/srv/homeassistant/matter/credentials/dcld_production_CN_StrongKey_Matter_G1_PAA_O_StrongKey_374e295ac551730baf65d529839b4ee09d39588a.der`
- Status: summarized; 472 bytes.
- Role: Not read in detail: runtime/opaque or backup area.
- Inputs/dependencies: 
- Outputs/effects: 
- Runtime fragility signal: Semantic detail not confirmed from content.
### `/srv/homeassistant/matter/credentials/dcld_production_CN_StrongKey_Matter_G1_PAA_O_StrongKey_374e295ac551730baf65d529839b4ee09d39588a.pem`
- Status: summarized; 695 bytes.
- Role: Not read in detail: runtime/opaque or backup area.
- Inputs/dependencies: 
- Outputs/effects: 
- Runtime fragility signal: Semantic detail not confirmed from content.
### `/srv/homeassistant/matter/credentials/dcld_production_CN_SwitchBot_Matter_PAA_vid_0x1397_c396a6e6948cc46b42a2824d2a6f694797ea6004.der`
- Status: summarized; 433 bytes.
- Role: Not read in detail: runtime/opaque or backup area.
- Inputs/dependencies: 
- Outputs/effects: 
- Runtime fragility signal: Semantic detail not confirmed from content.
### `/srv/homeassistant/matter/credentials/dcld_production_CN_SwitchBot_Matter_PAA_vid_0x1397_c396a6e6948cc46b42a2824d2a6f694797ea6004.pem`
- Status: summarized; 643 bytes.
- Role: Not read in detail: runtime/opaque or backup area.
- Inputs/dependencies: 
- Outputs/effects: 
- Runtime fragility signal: Semantic detail not confirmed from content.
### `/srv/homeassistant/matter/credentials/dcld_production_CN_TP-Link_Matter_PAA_vid_0x1188_c58531419ee03ee4a1dcf551e03440dc2bbec20a.der`
- Status: summarized; 456 bytes.
- Role: Not read in detail: runtime/opaque or backup area.
- Inputs/dependencies: 
- Outputs/effects: 
- Runtime fragility signal: Semantic detail not confirmed from content.
### `/srv/homeassistant/matter/credentials/dcld_production_CN_TP-Link_Matter_PAA_vid_0x1188_c58531419ee03ee4a1dcf551e03440dc2bbec20a.pem`
- Status: summarized; 671 bytes.
- Role: Not read in detail: runtime/opaque or backup area.
- Inputs/dependencies: 
- Outputs/effects: 
- Runtime fragility signal: Semantic detail not confirmed from content.
### `/srv/homeassistant/matter/credentials/dcld_production_CN_Tapo_Matter_PAA_vid_0x1392_9f63b35b952480405222796771f65ad84db18049.der`
- Status: summarized; 451 bytes.
- Role: Not read in detail: runtime/opaque or backup area.
- Inputs/dependencies: 
- Outputs/effects: 
- Runtime fragility signal: Semantic detail not confirmed from content.
### `/srv/homeassistant/matter/credentials/dcld_production_CN_Tapo_Matter_PAA_vid_0x1392_9f63b35b952480405222796771f65ad84db18049.pem`
- Status: summarized; 667 bytes.
- Role: Not read in detail: runtime/opaque or backup area.
- Inputs/dependencies: 
- Outputs/effects: 
- Runtime fragility signal: Semantic detail not confirmed from content.
### `/srv/homeassistant/matter/credentials/dcld_production_CN_TrustAsia_Matter_PAA_O_TrustAsia_Technologies__Inc_b6cff60acfc424d61c2614d963b632dbdd03a88a.der`
- Status: summarized; 494 bytes.
- Role: Not read in detail: runtime/opaque or backup area.
- Inputs/dependencies: 
- Outputs/effects: 
- Runtime fragility signal: Semantic detail not confirmed from content.
### `/srv/homeassistant/matter/credentials/dcld_production_CN_TrustAsia_Matter_PAA_O_TrustAsia_Technologies__Inc_b6cff60acfc424d61c2614d963b632dbdd03a88a.pem`
- Status: summarized; 724 bytes.
- Role: Not read in detail: runtime/opaque or backup area.
- Inputs/dependencies: 
- Outputs/effects: 
- Runtime fragility signal: Semantic detail not confirmed from content.
### `/srv/homeassistant/matter/credentials/dcld_production_CN_Tuya_Global_Matter_PAA_84b98b66ac1afd96b6450f23d3bb964d4e8a9c66.der`
- Status: summarized; 429 bytes.
- Role: Not read in detail: runtime/opaque or backup area.
- Inputs/dependencies: 
- Outputs/effects: 
- Runtime fragility signal: Semantic detail not confirmed from content.
### `/srv/homeassistant/matter/credentials/dcld_production_CN_Tuya_Global_Matter_PAA_84b98b66ac1afd96b6450f23d3bb964d4e8a9c66.pem`
- Status: summarized; 634 bytes.
- Role: Not read in detail: runtime/opaque or backup area.
- Inputs/dependencies: 
- Outputs/effects: 
- Runtime fragility signal: Semantic detail not confirmed from content.
### `/srv/homeassistant/matter/credentials/dcld_production_CN_Tuya_Matter_PAA_vid_0x125D_355752a3a7205833771efabea532670cb0b31d09.der`
- Status: summarized; 448 bytes.
- Role: Not read in detail: runtime/opaque or backup area.
- Inputs/dependencies: 
- Outputs/effects: 
- Runtime fragility signal: Semantic detail not confirmed from content.
### `/srv/homeassistant/matter/credentials/dcld_production_CN_Tuya_Matter_PAA_vid_0x125D_355752a3a7205833771efabea532670cb0b31d09.pem`
- Status: summarized; 663 bytes.
- Role: Not read in detail: runtime/opaque or backup area.
- Inputs/dependencies: 
- Outputs/effects: 
- Runtime fragility signal: Semantic detail not confirmed from content.
### `/srv/homeassistant/matter/credentials/dcld_production_CN_U-tec_Group_Matter_PAA_vid_0x147F_9de24f6b78b2b4893c8263186b0f694e68b77040.der`
- Status: summarized; 469 bytes.
- Role: Not read in detail: runtime/opaque or backup area.
- Inputs/dependencies: 
- Outputs/effects: 
- Runtime fragility signal: Semantic detail not confirmed from content.
### `/srv/homeassistant/matter/credentials/dcld_production_CN_U-tec_Group_Matter_PAA_vid_0x147F_9de24f6b78b2b4893c8263186b0f694e68b77040.pem`
- Status: summarized; 691 bytes.
- Role: Not read in detail: runtime/opaque or backup area.
- Inputs/dependencies: 
- Outputs/effects: 
- Runtime fragility signal: Semantic detail not confirmed from content.
### `/srv/homeassistant/matter/credentials/dcld_production_CN_UEI_Development_PAA_vid_0x10EE_52998677dcf2105e3166c995acf9f2b34f3cb530.der`
- Status: summarized; 455 bytes.
- Role: Not read in detail: runtime/opaque or backup area.
- Inputs/dependencies: 
- Outputs/effects: 
- Runtime fragility signal: Semantic detail not confirmed from content.
### `/srv/homeassistant/matter/credentials/dcld_production_CN_UEI_Development_PAA_vid_0x10EE_52998677dcf2105e3166c995acf9f2b34f3cb530.pem`
- Status: summarized; 671 bytes.
- Role: Not read in detail: runtime/opaque or backup area.
- Inputs/dependencies: 
- Outputs/effects: 
- Runtime fragility signal: Semantic detail not confirmed from content.
### `/srv/homeassistant/matter/credentials/dcld_production_CN_WISeKey_OISTE_Matter_PAA_GA_d8935a88dc5253ea354fced903ced2f62a5caaff.der`
- Status: summarized; 430 bytes.
- Role: Not read in detail: runtime/opaque or backup area.
- Inputs/dependencies: 
- Outputs/effects: 
- Runtime fragility signal: Semantic detail not confirmed from content.
### `/srv/homeassistant/matter/credentials/dcld_production_CN_WISeKey_OISTE_Matter_PAA_GA_d8935a88dc5253ea354fced903ced2f62a5caaff.pem`
- Status: summarized; 638 bytes.
- Role: Not read in detail: runtime/opaque or backup area.
- Inputs/dependencies: 
- Outputs/effects: 
- Runtime fragility signal: Semantic detail not confirmed from content.
### `/srv/homeassistant/matter/credentials/dcld_production_CN_XFN_Matter_PAA_VID_vid_0x111D_10b6b58d62bde93d48b64ef201e39d8068879292.der`
- Status: summarized; 468 bytes.
- Role: Not read in detail: runtime/opaque or backup area.
- Inputs/dependencies: 
- Outputs/effects: 
- Runtime fragility signal: Semantic detail not confirmed from content.
### `/srv/homeassistant/matter/credentials/dcld_production_CN_XFN_Matter_PAA_VID_vid_0x111D_10b6b58d62bde93d48b64ef201e39d8068879292.pem`
- Status: summarized; 687 bytes.
- Role: Not read in detail: runtime/opaque or backup area.
- Inputs/dependencies: 
- Outputs/effects: 
- Runtime fragility signal: Semantic detail not confirmed from content.
### `/srv/homeassistant/matter/credentials/dcld_production_CN_Xiaomi_Mijia_Matter_PAA_vid_0x126E_31bb7e10d1f081e6c6543091c44a6a791dd4ee09.der`
- Status: summarized; 467 bytes.
- Role: Not read in detail: runtime/opaque or backup area.
- Inputs/dependencies: 
- Outputs/effects: 
- Runtime fragility signal: Semantic detail not confirmed from content.
### `/srv/homeassistant/matter/credentials/dcld_production_CN_Xiaomi_Mijia_Matter_PAA_vid_0x126E_31bb7e10d1f081e6c6543091c44a6a791dd4ee09.pem`
- Status: summarized; 687 bytes.
- Role: Not read in detail: runtime/opaque or backup area.
- Inputs/dependencies: 
- Outputs/effects: 
- Runtime fragility signal: Semantic detail not confirmed from content.
### `/srv/homeassistant/matter/credentials/dcld_production_CN_Yeelight_Matter_PAA_vid_0x1312_d4870d54b2305b868ca3afeea72518973ac8208e.der`
- Status: summarized; 462 bytes.
- Role: Not read in detail: runtime/opaque or backup area.
- Inputs/dependencies: 
- Outputs/effects: 
- Runtime fragility signal: Semantic detail not confirmed from content.
### `/srv/homeassistant/matter/credentials/dcld_production_CN_Yeelight_Matter_PAA_vid_0x1312_d4870d54b2305b868ca3afeea72518973ac8208e.pem`
- Status: summarized; 679 bytes.
- Role: Not read in detail: runtime/opaque or backup area.
- Inputs/dependencies: 
- Outputs/effects: 
- Runtime fragility signal: Semantic detail not confirmed from content.
### `/srv/homeassistant/matter/credentials/dcld_production_CN_heiman_Matter_Protocol_PAA_vid_0x120B_d9125370e830d1081182bf9507cd504f635b674f.der`
- Status: summarized; 479 bytes.
- Role: Not read in detail: runtime/opaque or backup area.
- Inputs/dependencies: 
- Outputs/effects: 
- Runtime fragility signal: Semantic detail not confirmed from content.
### `/srv/homeassistant/matter/credentials/dcld_production_CN_heiman_Matter_Protocol_PAA_vid_0x120B_d9125370e830d1081182bf9507cd504f635b674f.pem`
- Status: summarized; 703 bytes.
- Role: Not read in detail: runtime/opaque or backup area.
- Inputs/dependencies: 
- Outputs/effects: 
- Runtime fragility signal: Semantic detail not confirmed from content.
### `/srv/homeassistant/matter/credentials/dcld_production_CN_iRobot_Main-Net_PAA_vid_0x1516_3ee1e8f714720a82fb18503b9975cd2d2eb684d4.der`
- Status: summarized; 470 bytes.
- Role: Not read in detail: runtime/opaque or backup area.
- Inputs/dependencies: 
- Outputs/effects: 
- Runtime fragility signal: Semantic detail not confirmed from content.
### `/srv/homeassistant/matter/credentials/dcld_production_CN_iRobot_Main-Net_PAA_vid_0x1516_3ee1e8f714720a82fb18503b9975cd2d2eb684d4.pem`
- Status: summarized; 691 bytes.
- Role: Not read in detail: runtime/opaque or backup area.
- Inputs/dependencies: 
- Outputs/effects: 
- Runtime fragility signal: Semantic detail not confirmed from content.
### `/srv/homeassistant/matter/credentials/dcld_production_CN_paa-prodpuzllabscom_O_PuzL_Labs_LLC_vid_0x149D_07aa23abc27f597674961e18b90a3bac2c958b44.der`
- Status: summarized; 483 bytes.
- Role: Not read in detail: runtime/opaque or backup area.
- Inputs/dependencies: 
- Outputs/effects: 
- Runtime fragility signal: Semantic detail not confirmed from content.
### `/srv/homeassistant/matter/credentials/dcld_production_CN_paa-prodpuzllabscom_O_PuzL_Labs_LLC_vid_0x149D_07aa23abc27f597674961e18b90a3bac2c958b44.pem`
- Status: summarized; 710 bytes.
- Role: Not read in detail: runtime/opaque or backup area.
- Inputs/dependencies: 
- Outputs/effects: 
- Runtime fragility signal: Semantic detail not confirmed from content.
### `/srv/homeassistant/matter/credentials/dcld_production_SERIALNUMBER_63709330400001_CN_NXP_Matter_PAA_O_NXP_Semiconductors_NV_C_NL_9797a42f8d076f23c388804d4d8242d93dd771fd.der`
- Status: summarized; 558 bytes.
- Role: Not read in detail: runtime/opaque or backup area.
- Inputs/dependencies: 
- Outputs/effects: 
- Runtime fragility signal: Semantic detail not confirmed from content.
### `/srv/homeassistant/matter/credentials/dcld_production_SERIALNUMBER_63709330400001_CN_NXP_Matter_PAA_O_NXP_Semiconductors_NV_C_NL_9797a42f8d076f23c388804d4d8242d93dd771fd.pem`
- Status: summarized; 809 bytes.
- Role: Not read in detail: runtime/opaque or backup area.
- Inputs/dependencies: 
- Outputs/effects: 
- Runtime fragility signal: Semantic detail not confirmed from content.
### `/srv/homeassistant/matter/credentials/dcld_production_SERIALNUMBER_63709330400004_CN_NXP_Matter_PAA_G2_4489f839c322745d30da66bcc3e1b23b1f38cf08.der`
- Status: summarized; 469 bytes.
- Role: Not read in detail: runtime/opaque or backup area.
- Inputs/dependencies: 
- Outputs/effects: 
- Runtime fragility signal: Semantic detail not confirmed from content.
### `/srv/homeassistant/matter/credentials/dcld_production_SERIALNUMBER_63709330400004_CN_NXP_Matter_PAA_G2_4489f839c322745d30da66bcc3e1b23b1f38cf08.pem`
- Status: summarized; 691 bytes.
- Role: Not read in detail: runtime/opaque or backup area.
- Inputs/dependencies: 
- Outputs/effects: 
- Runtime fragility signal: Semantic detail not confirmed from content.
### `/srv/homeassistant/matter/credentials/git_Chip-Test-PAA-FFF1-Cert_6afd22771f511fecbf1641976710dcdc31a1717e.der`
- Status: summarized; 449 bytes.
- Role: Not read in detail: runtime/opaque or backup area.
- Inputs/dependencies: 
- Outputs/effects: 
- Runtime fragility signal: Semantic detail not confirmed from content.
### `/srv/homeassistant/matter/credentials/git_Chip-Test-PAA-FFF1-Cert_6afd22771f511fecbf1641976710dcdc31a1717e.pem`
- Status: summarized; 664 bytes.
- Role: Not read in detail: runtime/opaque or backup area.
- Inputs/dependencies: 
- Outputs/effects: 
- Runtime fragility signal: Semantic detail not confirmed from content.
### `/srv/homeassistant/matter/credentials/git_Chip-Test-PAA-NoVID-Cert_785ce705b86b8f4e6fc793aa60cb43ea696882d5.der`
- Status: summarized; 405 bytes.
- Role: Not read in detail: runtime/opaque or backup area.
- Inputs/dependencies: 
- Outputs/effects: 
- Runtime fragility signal: Semantic detail not confirmed from content.
### `/srv/homeassistant/matter/credentials/git_Chip-Test-PAA-NoVID-Cert_785ce705b86b8f4e6fc793aa60cb43ea696882d5.pem`
- Status: summarized; 603 bytes.
- Role: Not read in detail: runtime/opaque or backup area.
- Inputs/dependencies: 
- Outputs/effects: 
- Runtime fragility signal: Semantic detail not confirmed from content.
### `/srv/homeassistant/mosquitto/config/mosquitto.conf`
- Status: readable; 189 bytes.
- Role: Configuration or structured data file.
- Inputs/dependencies: No explicit env/import inputs extracted from sampled content.
- Outputs/effects: No obvious external side effect extracted from sampled content.
- Runtime fragility signal: No definite fragility extracted from sampled content.

## Control flow and data flow
- Runtime data reaches the project through Docker container entrypoints and compose-declared ports/mounts shown above.

## Assumptions and dependencies
- No explicit environment variable references extracted from sampled content.
- Docker dependency context for `nodered`: network `homeassistant_default`, mounts `node_red_data`, compose labels `authors=Dave Conway-Jones, Nick O'Leary, James Thomas, Raymond Mouthaan,com.docker.compose.config-hash=0fe573dce4b7276b95f9dbfa56552525cb5c8ccdc7fcd134d880d2d692118360,com.docker.compose.container-number=1,com.docker.compose.depends_on=,com.docker.compose.imag`.
- Docker dependency context for `homeassistantz`: network `host`, mounts `/etc/localtime,/run/dbus,/srv/homeassis…`, compose labels `com.docker.compose.config-hash=0d63dee88d8e6942cd2278e3e12dfd07a30141d53e96443d4051d45e61834d88,com.docker.compose.container-number=1,com.docker.compose.depends_on=,com.docker.compose.image=sha256:8159b718f3858fceea2f9560e4848a45b72a17ac286c2feaa08e168174919a8`.
- Docker dependency context for `matter-server`: network `host`, mounts `/srv/homeassis…,/run/dbus`, compose labels `com.docker.compose.config-hash=9fe444eb4ee9bb80fe3d6a6b6b08669128918614b5b88bc7bfcc629e5d5d5b22,com.docker.compose.container-number=1,com.docker.compose.depends_on=,com.docker.compose.image=sha256:48fc8f41e5ab842f95c3598fdc1c25c8ff8651bbae8aa75edd13d04dcaaaf75`.

## Breakpoints and fragilities
- `/srv/homeassistant/config/.ha_run.lock`: not semantically analyzed because non-text or unsupported extension.
- `/srv/homeassistant/config/automations.yaml.save`: not semantically analyzed because non-text or unsupported extension.
- `/srv/homeassistant/config/home-assistant.log`: not semantically analyzed because opaque binary/runtime/archive/log artifact.
- `/srv/homeassistant/config/home-assistant.log.1`: not semantically analyzed because non-text or unsupported extension.
- `/srv/homeassistant/config/home-assistant.log.fault`: not semantically analyzed because non-text or unsupported extension.
- `/srv/homeassistant/config/home-assistant_v2.db`: not semantically analyzed because opaque binary/runtime/archive/log artifact.
- `/srv/homeassistant/config/home-assistant_v2.db-shm`: not semantically analyzed because opaque binary/runtime/archive/log artifact.
- `/srv/homeassistant/config/home-assistant_v2.db-wal`: not semantically analyzed because opaque binary/runtime/archive/log artifact.
- `/srv/homeassistant/config/.cloud/acme_account.pem`: not semantically analyzed because non-text or unsupported extension.
- `/srv/homeassistant/config/.cloud/production_auth.json`: not semantically analyzed because read failed: [Errno 13] Permission denied: '/srv/homeassistant/config/.cloud/production_auth.json'.
- `/srv/homeassistant/config/.cloud/remote_fullchain.pem`: not semantically analyzed because non-text or unsupported extension.
- `/srv/homeassistant/config/.cloud/remote_private.pem`: not semantically analyzed because non-text or unsupported extension.
- `/srv/homeassistant/config/.storage/application_credentials`: not semantically analyzed because runtime/opaque or backup area.
- `/srv/homeassistant/config/.storage/assist_pipeline.pipelines`: not semantically analyzed because runtime/opaque or backup area.
- `/srv/homeassistant/config/.storage/auth`: not semantically analyzed because runtime/opaque or backup area.
- `/srv/homeassistant/config/.storage/auth_provider.homeassistant`: not semantically analyzed because runtime/opaque or backup area.
- `/srv/homeassistant/config/.storage/backup`: not semantically analyzed because runtime/opaque or backup area.
- `/srv/homeassistant/config/.storage/bluetooth.passive_update_processor`: not semantically analyzed because runtime/opaque or backup area.
- `/srv/homeassistant/config/.storage/bluetooth.remote_scanners`: not semantically analyzed because runtime/opaque or backup area.
- `/srv/homeassistant/config/.storage/cloud`: not semantically analyzed because runtime/opaque or backup area.
- `/srv/homeassistant/config/.storage/core.analytics`: not semantically analyzed because runtime/opaque or backup area.
- `/srv/homeassistant/config/.storage/core.area_registry`: not semantically analyzed because runtime/opaque or backup area.
- `/srv/homeassistant/config/.storage/core.config`: not semantically analyzed because runtime/opaque or backup area.
- `/srv/homeassistant/config/.storage/core.config_entries`: not semantically analyzed because runtime/opaque or backup area.
- `/srv/homeassistant/config/.storage/core.device_registry`: not semantically analyzed because runtime/opaque or backup area.
- `/srv/homeassistant/config/.storage/core.entity_registry`: not semantically analyzed because runtime/opaque or backup area.
- `/srv/homeassistant/config/.storage/core.floor_registry`: not semantically analyzed because runtime/opaque or backup area.
- `/srv/homeassistant/config/.storage/core.label_registry`: not semantically analyzed because runtime/opaque or backup area.
- `/srv/homeassistant/config/.storage/core.labs`: not semantically analyzed because runtime/opaque or backup area.
- `/srv/homeassistant/config/.storage/core.restore_state`: not semantically analyzed because runtime/opaque or backup area.
- `/srv/homeassistant/config/.storage/core.uuid`: not semantically analyzed because runtime/opaque or backup area.
- `/srv/homeassistant/config/.storage/frontend.user_data_78c439dc78964fc8a13afa67c1284b8a`: not semantically analyzed because runtime/opaque or backup area.
- `/srv/homeassistant/config/.storage/homeassistant.exposed_entities`: not semantically analyzed because runtime/opaque or backup area.
- `/srv/homeassistant/config/.storage/http`: not semantically analyzed because runtime/opaque or backup area.
- `/srv/homeassistant/config/.storage/http.auth`: not semantically analyzed because runtime/opaque or backup area.
- `/srv/homeassistant/config/.storage/lovelace.map`: not semantically analyzed because runtime/opaque or backup area.
- `/srv/homeassistant/config/.storage/lovelace_dashboards`: not semantically analyzed because runtime/opaque or backup area.
- `/srv/homeassistant/config/.storage/mobile_app`: not semantically analyzed because runtime/opaque or backup area.
- `/srv/homeassistant/config/.storage/onboarding`: not semantically analyzed because runtime/opaque or backup area.
- `/srv/homeassistant/config/.storage/person`: not semantically analyzed because runtime/opaque or backup area.
- `/srv/homeassistant/config/.storage/repairs.issue_registry`: not semantically analyzed because runtime/opaque or backup area.
- `/srv/homeassistant/config/.storage/tmp0tpx7o_6`: not semantically analyzed because runtime/opaque or backup area.
- `/srv/homeassistant/config/.storage/tmp28vxufij`: not semantically analyzed because runtime/opaque or backup area.
- `/srv/homeassistant/config/.storage/tmpb5cg7tip`: not semantically analyzed because runtime/opaque or backup area.
- `/srv/homeassistant/config/.storage/tmpogqas_nk`: not semantically analyzed because runtime/opaque or backup area.
- `/srv/homeassistant/config/.storage/tmpz2rgrg6d`: not semantically analyzed because runtime/opaque or backup area.
- `/srv/homeassistant/config/.storage/trace.saved_traces`: not semantically analyzed because runtime/opaque or backup area.
- `/srv/homeassistant/config/.storage/unifi_data`: not semantically analyzed because runtime/opaque or backup area.
- `/srv/homeassistant/config/backups/Automatic_backup_2025.12.5_2026-02-28_05.21_18002881.tar`: not semantically analyzed because runtime/opaque or backup area.
- `/srv/homeassistant/config/backups/Automatic_backup_2025.12.5_2026-03-01_05.37_37002683.tar`: not semantically analyzed because runtime/opaque or backup area.
- `/srv/homeassistant/config/blueprints/automation/Blackshome/sensor-light.yaml`: not semantically analyzed because large text file; summarized by metadata.
- `/srv/homeassistant/config/blueprints/automation/homeassistant/ceiling_daily_ryhthm_presence.yaml.save`: not semantically analyzed because non-text or unsupported extension.
- `/srv/homeassistant/config/tts/789c12f41dd3e864c9207260274601b6d4b97faf_en-gb_0d2fa44024_tts.home_assistant_cloud.mp3`: not semantically analyzed because runtime/opaque or backup area.
- `/srv/homeassistant/config/tts/789c12f41dd3e864c9207260274601b6d4b97faf_en-gb_3218e3aa17_tts.home_assistant_cloud.mp3`: not semantically analyzed because runtime/opaque or backup area.
- `/srv/homeassistant/config/tts/789c12f41dd3e864c9207260274601b6d4b97faf_en-gb_3479e059d2_tts.home_assistant_cloud.mp3`: not semantically analyzed because runtime/opaque or backup area.
- `/srv/homeassistant/config/tts/789c12f41dd3e864c9207260274601b6d4b97faf_en-gb_519cf00aad_tts.home_assistant_cloud.mp3`: not semantically analyzed because runtime/opaque or backup area.
- `/srv/homeassistant/config/tts/789c12f41dd3e864c9207260274601b6d4b97faf_en-gb_e61cb6a1ac_tts.home_assistant_cloud.mp3`: not semantically analyzed because runtime/opaque or backup area.
- `/srv/homeassistant/config/tts/a8c3971a411cdbdf7c610d3a47faa1a4741921a9_af-za_85801fbabb_tts.home_assistant_cloud.mp3`: not semantically analyzed because runtime/opaque or backup area.
- `/srv/homeassistant/config/tts/a8c3971a411cdbdf7c610d3a47faa1a4741921a9_am-et_a89c77a58e_tts.home_assistant_cloud.mp3`: not semantically analyzed because runtime/opaque or backup area.
- `/srv/homeassistant/config/tts/a8c3971a411cdbdf7c610d3a47faa1a4741921a9_en-au_ff2f65b8ae_tts.home_assistant_cloud.mp3`: not semantically analyzed because runtime/opaque or backup area.
- `/srv/homeassistant/config/tts/a8c3971a411cdbdf7c610d3a47faa1a4741921a9_en_-_tts.google_translate_en_com.mp3`: not semantically analyzed because runtime/opaque or backup area.
- `/srv/homeassistant/config/tts/a8c3971a411cdbdf7c610d3a47faa1a4741921a9_sw-ke_a56bcf8564_tts.home_assistant_cloud.mp3`: not semantically analyzed because runtime/opaque or backup area.
- `/srv/homeassistant/config/tts/a8c3971a411cdbdf7c610d3a47faa1a4741921a9_sw-ke_dec3e8d246_tts.home_assistant_cloud.mp3`: not semantically analyzed because runtime/opaque or backup area.
- `/srv/homeassistant/config/tts/a8c3971a411cdbdf7c610d3a47faa1a4741921a9_ur-pk_db50514860_tts.home_assistant_cloud.mp3`: not semantically analyzed because runtime/opaque or backup area.
- `/srv/homeassistant/homeassistant.STALE/.HA_VERSION`: not semantically analyzed because listed but not sampled; lower-priority first-party text/config.
- `/srv/homeassistant/homeassistant.STALE/.ha_run.lock`: not semantically analyzed because non-text or unsupported extension.
- `/srv/homeassistant/homeassistant.STALE/automations.yaml`: not semantically analyzed because listed but not sampled; lower-priority first-party text/config.
- `/srv/homeassistant/homeassistant.STALE/configuration.yaml`: not semantically analyzed because listed but not sampled; lower-priority first-party text/config.
- `/srv/homeassistant/homeassistant.STALE/home-assistant.log`: not semantically analyzed because opaque binary/runtime/archive/log artifact.
- `/srv/homeassistant/homeassistant.STALE/home-assistant.log.1`: not semantically analyzed because non-text or unsupported extension.
- `/srv/homeassistant/homeassistant.STALE/home-assistant_v2.db`: not semantically analyzed because opaque binary/runtime/archive/log artifact.
- `/srv/homeassistant/homeassistant.STALE/scenes.yaml`: not semantically analyzed because listed but not sampled; lower-priority first-party text/config.
- `/srv/homeassistant/homeassistant.STALE/scripts.yaml`: not semantically analyzed because listed but not sampled; lower-priority first-party text/config.
- `/srv/homeassistant/homeassistant.STALE/secrets.yaml`: not semantically analyzed because listed but not sampled; lower-priority first-party text/config.
- `/srv/homeassistant/homeassistant.STALE/.cloud/acme_account.pem`: not semantically analyzed because non-text or unsupported extension.
- `/srv/homeassistant/homeassistant.STALE/.cloud/acme_reg.json`: not semantically analyzed because listed but not sampled; lower-priority first-party text/config.
- `/srv/homeassistant/homeassistant.STALE/.cloud/production_auth.json`: not semantically analyzed because listed but not sampled; lower-priority first-party text/config.
- `/srv/homeassistant/homeassistant.STALE/.cloud/remote_private.pem`: not semantically analyzed because non-text or unsupported extension.
- `/srv/homeassistant/homeassistant.STALE/.storage/assist_pipeline.pipelines`: not semantically analyzed because runtime/opaque or backup area.
- `/srv/homeassistant/homeassistant.STALE/.storage/auth`: not semantically analyzed because runtime/opaque or backup area.

## What is obviously missing
- Any secrets, runtime databases, and generated dependencies are deliberately absent from semantic analysis.

## Open questions / uncertainties
- Opaque runtime data and secret-bearing env files were not read, so behavior that depends on their values remains unconfirmed.
- Container uptime confirms a running process, not correctness of its application-level behavior.

