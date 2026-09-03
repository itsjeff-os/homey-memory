import crypto from "node:crypto";
import path from "node:path";

export type KnowledgeCollection =
  "home_ha_automations" | "home_ha_reference" | "home_registry" | "home_system_docs";

export interface KnowledgeChunk {
  id: string;
  collection: KnowledgeCollection;
  text: string;
  sourceFile: string;
  sourcePath: string;
  contentHash: string;
  entities: string[];
  services: string[];
  domains: string[];
  rooms: string[];
  tags: string[];
  provenance: Record<string, unknown>;
  raw: unknown;
}

export interface ChunkIssue {
  code: string;
  message: string;
  sourcePath?: string;
  severity: "warning" | "error";
}

export interface ChunkResult {
  chunks: KnowledgeChunk[];
  warnings: ChunkIssue[];
  errors: ChunkIssue[];
  redactionWarnings: ChunkIssue[];
}

const SECRET_KEY_RE =
  /(?:password|passwd|secret|token|api[_-]?key|access[_-]?token|refresh[_-]?token|authorization|bearer|credential|client[_-]?secret)/i;

const ENTITY_DOMAINS = [
  "alarm_control_panel",
  "automation",
  "binary_sensor",
  "button",
  "calendar",
  "camera",
  "climate",
  "cover",
  "device_tracker",
  "fan",
  "group",
  "humidifier",
  "input_boolean",
  "input_button",
  "input_datetime",
  "input_number",
  "input_select",
  "input_text",
  "light",
  "lock",
  "media_player",
  "number",
  "person",
  "remote",
  "scene",
  "script",
  "select",
  "sensor",
  "sun",
  "switch",
  "timer",
  "update",
  "vacuum",
  "weather",
  "zone",
];

const ENTITY_RE = new RegExp(`\\b(?:${ENTITY_DOMAINS.join("|")})\\.[a-zA-Z0-9_]+\\b`, "g");

const SERVICE_RE = /\b[a-z_][a-z0-9_]*\.[a-zA-Z0-9_]+\b/g;

const SERVICE_LIKE_OBJECT_IDS = new Set([
  "activate",
  "clear",
  "close_cover",
  "create",
  "dismiss",
  "mobile_app",
  "open_cover",
  "play_media",
  "reload",
  "send_message",
  "set_cover_position",
  "set_hvac_mode",
  "set_temperature",
  "set_value",
  "select_option",
  "start",
  "stop",
  "toggle",
  "turn_off",
  "turn_on",
  "volume_set",
]);

const FREE_TEXT_KEYS = new Set([
  "body",
  "content",
  "description",
  "example",
  "heading",
  "message",
  "notes",
  "summary",
  "text",
  "title",
  "value",
]);

const ROOM_PATTERNS: Array<{ id: string; patterns: RegExp[] }> = [
  {
    id: "room.open_plan",
    patterns: [/open[ _-]?plan/i, /\bliving\b/i, /\bkitchen\b/i, /\bdining\b/i],
  },
  {
    id: "room.bedroom1",
    patterns: [/bedroom[ _-]?1/i, /\balpha\b/i, /primary bedroom/i],
  },
  {
    id: "room.bedroom2",
    patterns: [/bedroom[ _-]?2/i, /\bbeta\b/i, /secondary bedroom/i, /\bwardrobe\b/i],
  },
  {
    id: "room.bathroom_throne",
    patterns: [/\bthrone\b/i, /primary bathroom/i],
  },
  {
    id: "room.bathroom_secondary",
    patterns: [/\bsplash\b/i, /secondary bathroom/i, /front[ _-]?bath/i],
  },
  {
    id: "room.hallway",
    patterns: [/\bhallway\b/i, /\bpass\b/i, /\bentry\b/i],
  },
  {
    id: "room.laundry_utility",
    patterns: [/\blaundry\b/i, /\butility\b/i, /\bchaos\b/i, /\bhomelab\b/i],
  },
];

export function stableHash(value: string): string {
  return crypto.createHash("sha256").update(value).digest("hex");
}

export function contentHash(value: string): string {
  return stableHash(value);
}

export function shortHash(value: string, length = 12): string {
  return stableHash(value).slice(0, length);
}

export function sortUnique(values: Iterable<string>): string[] {
  return Array.from(new Set(Array.from(values).filter(Boolean))).sort();
}

export function slugify(value: string): string {
  const slug = value
    .trim()
    .replace(/\\/g, "/")
    .replace(/[^a-zA-Z0-9_.:/-]/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_+|_+$/g, "")
    .toLowerCase();
  return slug || "unknown";
}

export function stableChunkId(
  collection: KnowledgeCollection,
  sourcePath: string,
  logicalPath: string,
): string {
  const base = [collection, sourcePath, logicalPath].map(slugify).join(":");
  if (base.length <= 180) return base;

  return [collection, path.basename(sourcePath), shortHash(`${sourcePath}:${logicalPath}`, 16)]
    .map(slugify)
    .join(":");
}

export function stableJson(value: unknown): string {
  return JSON.stringify(sortObject(value), null, 2);
}

function sortObject(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(sortObject);
  if (!value || typeof value !== "object") return value;

  const sorted: Record<string, unknown> = {};
  for (const key of Object.keys(value as Record<string, unknown>).sort()) {
    sorted[key] = sortObject((value as Record<string, unknown>)[key]);
  }
  return sorted;
}

export function redactText(text: string): string {
  return text
    .replace(/!secret\s+([^\s#]+)/gi, "!secret <redacted>")
    .replace(
      /((?:password|passwd|secret|token|api[_-]?key|access[_-]?token|refresh[_-]?token|authorization|client[_-]?secret)\s*[:=]\s*)("[^"]*"|'[^']*'|[^\s#]+)/gi,
      "$1[REDACTED]",
    );
}

export function redactValue(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(redactValue);

  if (typeof value === "string") {
    return redactText(value);
  }

  if (!value || typeof value !== "object") return value;

  const output: Record<string, unknown> = {};
  for (const [key, item] of Object.entries(value as Record<string, unknown>)) {
    if (SECRET_KEY_RE.test(key)) {
      output[key] = "[REDACTED]";
      continue;
    }
    output[key] = redactValue(item);
  }
  return output;
}

export function findUnredactedSecretWarnings(
  chunk: Pick<KnowledgeChunk, "id" | "text" | "raw" | "sourcePath">,
): ChunkIssue[] {
  const issues: ChunkIssue[] = [];
  const serializedRaw = stableJson(chunk.raw);
  const combined = `${chunk.text}\n${serializedRaw}`;

  if (/!secret\s+(?!<redacted>)([^\s#]+)/i.test(combined)) {
    issues.push({
      code: "unredacted_yaml_secret",
      message: `Chunk ${chunk.id} contains an unredacted !secret value.`,
      sourcePath: chunk.sourcePath,
      severity: "warning",
    });
  }

  if (
    /(?:password|passwd|api[_-]?key|access[_-]?token|refresh[_-]?token|client[_-]?secret)\s*[:=]\s*(?!\[REDACTED\])("[^"]+"|'[^']+'|[^\s#]+)/i.test(
      combined,
    )
  ) {
    issues.push({
      code: "possible_unredacted_secret_key",
      message: `Chunk ${chunk.id} contains a possible unredacted secret-like key.`,
      sourcePath: chunk.sourcePath,
      severity: "warning",
    });
  }

  return issues;
}

export function extractEntityIds(value: unknown): string[] {
  const found = new Set<string>();

  const visit = (node: unknown, keyPath: string[] = []) => {
    const key = keyPath.at(-1);

    if (typeof node === "string") {
      if (key === "service" || key === "action") return;

      const matches = node.match(ENTITY_RE);
      if (matches) {
        for (const match of matches) {
          if (!looksLikeServiceCall(match)) found.add(match);
        }
      }
      return;
    }

    if (Array.isArray(node)) {
      for (const item of node) visit(item, keyPath);
      return;
    }

    if (!node || typeof node !== "object") return;

    for (const [childKey, childValue] of Object.entries(node as Record<string, unknown>)) {
      visit(childValue, [...keyPath, childKey]);
    }
  };

  visit(value);
  return sortUnique(found);
}

export function extractServices(value: unknown): string[] {
  const found = new Set<string>();

  const visit = (node: unknown, keyPath: string[] = []) => {
    const key = keyPath.at(-1);

    if (typeof node === "string") {
      if (key === "service" || key === "action" || key === "service_template") {
        const matches = node.match(SERVICE_RE);
        if (matches) {
          for (const match of matches) found.add(match);
        }
      } else if (key && FREE_TEXT_KEYS.has(key)) {
        const matches = node.match(SERVICE_RE);
        if (matches) {
          for (const match of matches) {
            if (looksLikeServiceCall(match)) found.add(match);
          }
        }
      }
      return;
    }

    if (Array.isArray(node)) {
      for (const item of node) visit(item, keyPath);
      return;
    }

    if (!node || typeof node !== "object") return;

    for (const [childKey, childValue] of Object.entries(node as Record<string, unknown>)) {
      visit(childValue, [...keyPath, childKey]);
    }
  };

  visit(value);
  return sortUnique(found);
}

function looksLikeServiceCall(value: string): boolean {
  const [, objectId] = value.split(".");
  return Boolean(objectId && SERVICE_LIKE_OBJECT_IDS.has(objectId));
}

export function extractDomainsFromEntitiesAndServices(params: {
  entities?: string[];
  services?: string[];
  extra?: string[];
}): string[] {
  const domains = new Set<string>();

  for (const entity of params.entities ?? []) {
    const [domain] = entity.split(".");
    if (domain) domains.add(domain);
  }

  for (const service of params.services ?? []) {
    const [domain] = service.split(".");
    if (domain) domains.add(domain);
  }

  for (const domain of params.extra ?? []) {
    if (domain) domains.add(domain);
  }

  return sortUnique(domains);
}

export function extractRooms(value: unknown): string[] {
  const haystack = typeof value === "string" ? value : stableJson(redactValue(value));
  const rooms = new Set<string>();

  for (const room of ROOM_PATTERNS) {
    if (room.patterns.some((pattern) => pattern.test(haystack))) {
      rooms.add(room.id);
    }
  }

  collectExplicitRoomIds(value, rooms);
  return sortUnique(rooms);
}

function collectExplicitRoomIds(value: unknown, rooms: Set<string>): void {
  if (typeof value === "string") {
    if (/^room\.[a-z0-9_]+$/i.test(value)) rooms.add(value);
    return;
  }

  if (Array.isArray(value)) {
    for (const item of value) collectExplicitRoomIds(item, rooms);
    return;
  }

  if (!value || typeof value !== "object") return;

  for (const [key, item] of Object.entries(value as Record<string, unknown>)) {
    if ((key === "room_id" || key === "location_room_id") && typeof item === "string") {
      rooms.add(item);
      continue;
    }

    if (key === "room_ids" && Array.isArray(item)) {
      for (const roomId of item) {
        if (typeof roomId === "string") rooms.add(roomId);
      }
      continue;
    }

    collectExplicitRoomIds(item, rooms);
  }
}

export function createKnowledgeChunk(params: {
  collection: KnowledgeCollection;
  sourceFile: string;
  sourcePath: string;
  logicalPath: string;
  raw: unknown;
  text: string;
  tags?: string[];
  provenance?: Record<string, unknown>;
  entities?: string[];
  services?: string[];
  domains?: string[];
  rooms?: string[];
}): KnowledgeChunk {
  const raw = redactValue(params.raw);
  const redactedText = redactText(params.text);
  const entities = sortUnique([...(params.entities ?? []), ...extractEntityIds(raw)]);
  const services = sortUnique([...(params.services ?? []), ...extractServices(raw)]);
  const rooms = sortUnique([...(params.rooms ?? []), ...extractRooms(raw)]);
  const domains = extractDomainsFromEntitiesAndServices({
    entities,
    services,
    extra: params.domains,
  });
  const id = stableChunkId(params.collection, params.sourcePath, params.logicalPath);

  return {
    id,
    collection: params.collection,
    text: redactedText,
    sourceFile: params.sourceFile,
    sourcePath: params.sourcePath,
    contentHash: contentHash(redactedText),
    entities,
    services,
    domains,
    rooms,
    tags: sortUnique(params.tags ?? []),
    provenance: {
      schemaVersion: "homeassistant.knowledge_chunk.v1",
      corpus: "homeassistant",
      logicalPath: params.logicalPath,
      ...params.provenance,
    },
    raw,
  };
}
