# Smart Home & AI Automation Lab Notebook

**Owner:** Jefffffff  
**Collaborator:** ChatGPT (AI Architect + Automation Co-Pilot)

**Purpose:**
A living, evolving project log, knowledge base, and co-creative space for designing, building, and iterating smart home, AI, and productivity automations for flat-affairs.org and related personal tech domains.

---

## 📍 Table of Contents
- [Vision & Goals](#vision--goals)
- [Current System Architecture](#current-system-architecture)
- [Active Devices & Integrations](#active-devices--integrations)
- [AI/Automation Ideas Backlog](#aiautomation-ideas-backlog)
- [Implemented Automations](#implemented-automations)
- [Config Snippets & Code](#config-snippets--code)
- [Open Questions & Wishlist](#open-questions--wishlist)
- [Changelog & Version History](#changelog--version-history)

---

## 🎯 Vision & Goals
- Build a seamless, intelligent, and adaptive smart home environment using best-in-class tools (Cloudflare, Home Assistant, modern mail stack, AI APIs, etc.)
- Evolve automations that are proactive, context-aware, and deeply personalized
- Keep a running log of decisions, architecture changes, pain points, and experiments
- Make future onboarding and troubleshooting painless (for you, future-you, or collaborators)

---

## 🏗️ Current System Architecture

### Domains & Identity (v1)
- **Domains:**
  - itsjeff.org – personal identity & life
  - flat-affairs.org – flat / infra / smart home lab
- **Registrar & DNS:** Cloudflare for both domains

### Apple IDs
- **Personal Apple ID**
  - Uses: Personal devices, iCloud, Photos, Messages, etc.
  - Mail: `jeff@itsjeff.org` via iCloud custom domain
  - Role: Your human identity, daily driver.

- **Flat Apple ID**
  - Mail: e.g. `flat@flat-affairs.org` or `home@flat-affairs.org`
  - Added to your iCloud Family to share iCloud+ storage & purchases
  - Owns: HomeKit Home, flat-specific calendars/notes if needed
  - Role: "Brain of the flat" in Apple world.

### Email Hosting
- **itsjeff.org (Personal)**
  - Host: iCloud Mail (personal Apple ID)
  - Addresses:
    - `jeff@itsjeff.org` (primary)
    - Optional: `hi@itsjeff.org`, `contact@itsjeff.org` as aliases

- **flat-affairs.org (Flat – human layer)**
  - Host: iCloud Mail (Flat Apple ID)
  - Addresses (examples):
    - `flat@flat-affairs.org` / `home@flat-affairs.org`
    - Optional human-facing aliases: `smarthome@`, `infra@` if desired

- **flat-affairs.org (Automation layer)**
  - Subdomain: e.g. `mg.flat-affairs.org`
  - Host: Mailgun / Postmark / ForwardEmail (TBD when needed)
  - Purpose: Automation & system mail (alerts, digests, AI-generated messages)
  - Example addresses:
    - `alerts@mg.flat-affairs.org`
    - `digest@mg.flat-affairs.org`
    - `system@mg.flat-affairs.org`

### Smart Home & Automations
- **Apple / Home side**
  - HomeKit Home owned by Flat Apple ID
  - Home hubs: Apple TV + HomePods logged into Flat Apple ID
  - Your personal Apple ID invited as full-control Home member
  - Automations:
    - Home app automations (native)
    - Shortcuts & AppleScript on your devices
    - Shortcuts can call HTTP/webhooks (to n8n/MCP/Workers).

- **Infra / Automation side**
  - Core engines: n8n, MCP, Cloudflare Workers
  - Example subdomains:
    - `n8n.flat-affairs.org` – automation UI/flows
    - `mcp.flat-affairs.org` – infra/control plane
    - `api.flat-affairs.org` – Workers & HTTP glue
    - `home.flat-affairs.org` – internal dashboard/docs
    - `status.flat-affairs.org` – optional public/semipublic status page
  - Responsibilities:
    - Integrate with network gear (UniFi, etc.)
    - Talk to AI models (OpenAI/Gemini/etc.)
    - Send system emails via `mg.flat-affairs.org`
    - Receive webhooks from Apple Shortcuts / external services.

---


## 🟩 Active Devices & Integrations
**See [Smart Home Devices & Hubs — Full Inventory](#) for full device list.**

Key Hubs:
- Home Assistant (primary)
- Apple HomeKit (secondary, via Apple TV & HomePods)
- Hue Bridge, Aqara M3, Switchbot Hub 3, Google Nest Mini

Key Device Types:
- Sensors (motion, mmWave, door/window)
- Lighting (Hue, Govee, Switchbot)
- Climate (humidifiers, AC)
- Media (Apple TV, Samsung TV, HomePod, Google Nest)
- Health/utilities (Eufy RoboVac, Withings, Oura)

---

## 🧠 AI/Automation Ideas Backlog
_(Add, review, or iterate at any time — nothing is final!)_
- [ ] AI-powered anomaly detection for unusual sensor events
- [ ] Natural language automations via LLMs (“goodnight” routines, etc.)
- [ ] Predictive climate control using weather & presence
- [ ] Dynamic email sorting/triage with AI (summarize, prioritize, auto-respond)
- [ ] Daily/weekly smart home summary digest (AI-generated)
- [ ] Voice-activated multi-action automations (“flat, party mode!”)
- [ ] Sleep/mood-aware home routines
- [ ] AI event-driven routing (emails, sensors → actions, webhooks)
- [ ] Security automation: AI-driven threat scoring for alerts
- [ ] Personalized notification channels (AI picks SMS, email, or voice based on context)
- [ ] Conversational dashboards for querying flat status
- [ ] More…

---

## ⚡ Implemented Automations
- [ ] (Section for completed, tested, and running automations)
    - Will log config/code, outcome, and lessons learned here

---

## 💻 Config Snippets & Code
- [ ] (Ready-to-use or in-progress code for Home Assistant, Workers, SMTP, email templates, etc.)
- Add/update snippets here as we develop

---

## 📝 Open Questions & Wishlist
- [ ] What email host is best for future-proof, AI/automation-friendly use?
- [ ] Architecture diagram for visual reference
- [ ] Which automations would benefit from AI now vs. future?
- [ ] Device-specific compatibility notes?
- [ ] More…

---

## 🕒 Changelog & Version History
- **v1.0 (Today):** Lab notebook initiated, basic structure & first backlog ideas added.
- (Will log all major changes, experiments, and architecture decisions here)

---

**Instructions:**
- ChatGPT will maintain and update this doc as the living backbone for all things smart home & AI automation.
- You can request changes, review sections, or ask for diffs/versions at any time.
- All major ideas, configs, and decisions get logged here for future reference.

