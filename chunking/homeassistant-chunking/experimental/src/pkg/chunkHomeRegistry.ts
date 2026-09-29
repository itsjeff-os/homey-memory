import path from "node:path";
import {
  type ChunkIssue,
  type ChunkResult,
  createKnowledgeChunk,
  extractEntityIds,
  extractRooms,
  stableJson,
} from "./knowledgeChunk";

function asArray(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [];
}

function labelFor(value: unknown, fallback: string): string {
  if (!value || typeof value !== "object") return fallback;
  const obj = value as Record<string, unknown>;
  return (
    stringField(obj, "name") ??
    stringField(obj, "id") ??
    stringField(obj, "type") ??
    fallback
  );
}

function stringField(obj: Record<string, unknown>, key: string): string | undefined {
  const value = obj[key];
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function idFor(value: unknown, fallback: string): string {
  if (!value || typeof value !== "object") return fallback;
  const obj = value as Record<string, unknown>;
  return stringField(obj, "id") ?? fallback;
}

export function chunkHomeRegistry(
  fileContent: string,
  sourceFile: string,
  sourcePath = sourceFile,
): ChunkResult {
  const warnings: ChunkIssue[] = [];
  const errors: ChunkIssue[] = [];
  const redactionWarnings: ChunkIssue[] = [];

  let parsed: unknown;
  try {
    parsed = JSON.parse(fileContent);
  } catch (error) {
    errors.push({
      code: "registry_json_parse_failed",
      message: error instanceof Error ? error.message : String(error),
      sourcePath,
      severity: "error",
    });
    return { chunks: [], warnings, errors, redactionWarnings };
  }

  if (!parsed || typeof parsed !== "object") {
    errors.push({
      code: "registry_not_object",
      message: "Home registry root must be a JSON object.",
      sourcePath,
      severity: "error",
    });
    return { chunks: [], warnings, errors, redactionWarnings };
  }

  const root = parsed as Record<string, unknown>;
  const chunks = [];

  chunks.push(
    createKnowledgeChunk({
      collection: "home_registry",
      sourceFile,
      sourcePath,
      logicalPath: "registry.overview",
      raw: {
        meta: root.meta,
        room_count: asArray(root.rooms).length,
        zone_count: asArray(root.zones).length,
        infrastructure_count: asArray(root.infrastructure).length,
        device_count: asArray(root.devices).length,
      },
      tags: ["registry", "overview"],
      provenance: {
        sourceType: "home_registry_json",
        parser: "chunkHomeRegistry",
        objectType: "overview",
        objectName: "home_registry",
        sectionPath: "registry.overview",
        chunkKind: "registry_overview",
      },
      text: [
        "Home registry overview",
        `Source: ${sourcePath}`,
        `Rooms: ${asArray(root.rooms).length}`,
        `Zones: ${asArray(root.zones).length}`,
        `Devices: ${asArray(root.devices).length}`,
        `Infrastructure: ${asArray(root.infrastructure).length}`,
        "",
        stableJson(root.meta ?? {}),
      ].join("\n"),
    }),
  );

  for (const section of ["rooms", "zones", "devices", "infrastructure"]) {
    const entries = asArray(root[section]);
    if (!entries.length) continue;

    for (let index = 0; index < entries.length; index++) {
      const raw = entries[index];
      const objectId = idFor(raw, `${section}_${index}`);
      const label = labelFor(raw, objectId);
      const entities = extractEntityIds(raw);
      const rooms = extractRooms(raw);

      chunks.push(
        createKnowledgeChunk({
          collection: "home_registry",
          sourceFile,
          sourcePath,
          logicalPath: `registry.${section}.${objectId}`,
          raw,
          entities,
          rooms,
          tags: ["registry", section],
          provenance: {
            sourceType: "home_registry_json",
            parser: "chunkHomeRegistry",
            section,
            sectionPath: `registry.${section}.${objectId}`,
            objectType: section.replace(/s$/, ""),
            objectName: label,
            objectId,
            label,
            chunkKind: "registry_object",
          },
          text: [
            `Home registry ${section.replace(/s$/, "")}: ${label}`,
            `Source: ${sourcePath}`,
            `Registry path: registry.${section}.${objectId}`,
            entities.length ? `Entities: ${entities.join(", ")}` : undefined,
            rooms.length ? `Rooms: ${rooms.join(", ")}` : undefined,
            "",
            stableJson(raw),
          ]
            .filter(Boolean)
            .join("\n"),
        }),
      );
    }
  }

  if (!asArray(root.rooms).length) {
    warnings.push({
      code: "registry_missing_rooms",
      message: "Home registry did not contain a rooms array.",
      sourcePath,
      severity: "warning",
    });
  }

  return { chunks, warnings, errors, redactionWarnings };
}

export function chunkHomeRegistryFileName(filePath: string): string {
  return path.basename(filePath);
}
