# Execution Plan — Adaptive Home v0.1

*Last edited: 2025‑10‑06*

You confirmed FP2 placement in **Open Plan** and **each bedroom** (room‑level presence for now). This plan uses placeholders for zones that aren’t fully zoned yet and builds on your **Home Context** sensor + meta layer.

---

## 0) Naming & Conventions (so everything stays readable)

- Areas: `openplan`, `bedroom1`, `bedroom2`, `hallway`, `bath1`, `bath2`.
- Groups: `light.<area>_all_lights`, `binary_sensor.<area>_motion` (if applicable), `binary_sensor.<area>_presence` (FP2/FP1E), `cover.<area>_*`, `climate.<area>_ac`.
- Helpers (existing + new):
  - `input_boolean.sleep_mode`, `input_boolean.guest_mode`, `input_boolean.override_mode`
  - **New (optional):** `input_boolean.focus_mode`, `input_boolean.recovery_mode`, `input_boolean.hydration_nags_enabled`
  - `input_number.hydration_interval_minutes` (e.g., 90)
  - `input_select.energy_state` → `high | medium | low | recovery`

> Tip: add an **Area** to every device in HA; then use **light groups** per area to keep Adaptive Lighting simple.

---

## 1) Instances to Create (Adaptive Lighting)

Create one Adaptive Lighting instance per major area:

- `switch.adaptive_lighting_openplan`
- `switch.adaptive_lighting_bedroom1`
- `switch.adaptive_lighting_bedroom2`
- `switch.adaptive_lighting_hallway`
- `switch.adaptive_lighting_baths` (optional shared instance for both bathrooms)

**Suggested room tuning (initial):**

- **Open Plan:** min\_brightness 30%, max\_brightness 100%, sleep/overnight off at 23:30–06:30
- **Bedroom(s):** min\_brightness 1–5%, max\_brightness 60%, prefer warm nights (min\_ct\_mireds high / low kelvin)
- **Hallway:** min\_brightness 5–10% after 22:00; quick transitions
- **Bathrooms:** fixed night floor 3–5% when motion at night

We’ll refine after a few days of observation.

---

## 2) Context Engine v2 (small additions that simplify logic)

Add these **template sensors** so your automations read like English:

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

> These act as guard‑rails for motion lights, TTS nudges, and AC.

---

## 3) Global Baseline v2 (use Adaptive Lighting + gentler actions)

Replace the hardcoded time‑based color/brightness with Adaptive Lighting calls. Keep your override/sleep/away structure.

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
          # Let Adaptive Lighting set tone for shared areas when home & daylight/evening
          - service: adaptive_lighting.apply
            target: { entity_id: [ light.arc_lights ] }
          # Temperature guard for living AC
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
          # Curtains daylight logic
          - choose:
              - conditions:
                  - condition: state
                    entity_id: binary_sensor.is_daylight
                    state: 'on'
                sequence:
                  - service: cover.open_cover
                    target: { entity_id: cover.openplan_curtains }
```

---

## 4) Reusable Room Blueprint — Presence‑First Lighting (Adaptive‑aware)

This gives you a single blueprint you can instantiate per room. It respects sleep/guest, uses FP2 presence, and hands color/brightness to Adaptive Lighting. Use placeholders until FP2 zoning is final.

```yaml
blueprint:
  name: Room Presence Lighting (Adaptive‑aware)
  description: FP2/occupancy‑driven lighting that calls Adaptive Lighting; optional motion + off‑delay.
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
      # When presence detected
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

      # If presence during sleep, use gentle floor
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

      # When room goes empty, delay off
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

**Instantiate for:** `openplan`, `bedroom1`, `bedroom2`, `hallway` (or use motion for hallways/baths).

---

## 5) Night Bathroom Blueprint — No‑Glare Navigation

A small blueprint optimized for nocturnal trips.

```yaml
blueprint:
  name: Night Bathroom Light
  description: Motion‑based low‑glare bathroom light during quiet hours; turns off after X minutes of no motion.
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

---

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

---

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

---

## 8) Wellness Cues (Hydration / Gentle Mornings)

Hydration prompts should be **opt‑in**, respect **quiet hours**, and be **presence‑aware**.

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

**Gentle morning:** if Withings “rough night” style signal exists later, we’ll branch brightness. For now, base on `sleep_mode` exit + time.

```yaml
alias: Gentle Morning — Ease‑In Lights
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

---

## 9) Dashboard (Mushroom) Quick Controls

Create a **Control** view with:

- Chips: Sleep, Guest, Focus, Recovery, Override (all input\_booleans)
- Tiles: Adaptive switches per room, AC modes, Curtains, Humidity targets
- Sensors: `home_context`, `quiet_hours`, temps, humidity

---

## 10) Build Order (safe + testable)

1. **Helpers**: booleans, number, select
2. **Light groups** per area
3. **Adaptive Lighting instances** per area
4. **Template sensors** (quiet\_hours, is\_daylight, anyone\_home)
5. **Blueprints** (Room Presence Lighting; Night Bathroom)
6. **Global Baseline v2**
7. **Arrival/Departure** routines
8. **Climate Guard & Humidity**
9. **Wellness Cues**
10. **Dashboard** controls

We’ll iterate weekly: observe → tweak thresholds/curves → lock‑in.

---

## 11) Placeholders to Replace

- `light.arc_lights` → your Open Plan group
- `climate.*_ac` → your Dreo / Meaco entities
- `fan.bedroom1_humidifier` / `fan.bedroom1_purifier` → confirm exact ids
- `media_player.living_homepods` → the group you want to speak
- Presence entities for blueprint instances:
  - Open Plan: `binary_sensor.fp2_openplan_presence` (or equivalent)
  - Bedroom1: `binary_sensor.bedroom1_fp2_presence`
  - Bedroom2: `binary_sensor.bedroom2_fp2_presence`

---

**Next:** confirm the exact entity ids for AC + humidifiers + FP2 presence names and I’ll pre‑fill these YAMLs for direct paste with your ids.

