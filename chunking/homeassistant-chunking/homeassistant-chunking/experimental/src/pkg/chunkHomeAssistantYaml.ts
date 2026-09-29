import path from "node:path";
import yaml from "yaml";
import {
  type ChunkIssue,
  type ChunkResult,
  type KnowledgeChunk,
  type KnowledgeCollection,
  createKnowledgeChunk,
  extractEntityIds,
  extractRooms,
  extractServices,
  findUnredactedSecretWarnings,
  slugify,
} from "./knowledgeChunk";

export type HaObjectType =
  | "automation"
  | "blueprint"
  | "blueprint_behavior"
  | "blueprint_input"
  | "script"
  | "scene"
  | "template_binary_sensor"
  | "template_sensor"
  | "template"
  | "helper"
  | "entity_reference"
  | "group"
  | "configuration"
  | "unknown";

export type HaChunk = KnowledgeChunk;

const HA_INPUT_TAG = {
  tag: "!input",
  resolve(value: string) {
    return `!input ${value}`;
  },
};

const HA_SECRET_TAG = {
  tag: "!secret",
  resolve() {
    return "!secret <redacted>";
  },
};

const AUTOMATION_SECTIONS = new Set(["automation", "script", "scene"]);

const REFERENCE_SECTIONS = new Set([
  "alert",
  "binary_sensor",
  "button",
  "climate",
  "command_line",
  "counter",
  "cover",
  "fan",
  "group",
  "homeassistant",
  "input_boolean",
  "input_button",
  "input_datetime",
  "input_number",
  "input_select",
  "input_text",
  "light",
  "mqtt",
  "notify",
  "number",
  "recorder",
  "rest",
  "schedule",
  "sensor",
  "shell_command",
  "switch",
  "template",
  "timer",
  "utility_meter",
  "zone",
]);

const HA_SECTIONS = new Set([
  ...Array.from(AUTOMATION_SECTIONS),
  ...Array.from(REFERENCE_SECTIONS),
  "blueprint",
]);

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function firstString(
  value: unknown,
  keys: string[],
): string | undefined {
  if (!isRecord(value)) return undefined;

  for (const key of keys) {
    const item = value[key];
    if (typeof item === "string" && item.trim()) return item.trim();
  }

  return undefined;
}

function toYaml(value: unknown): string {
  return yaml.stringify(value, {
    indent: 2,
    lineWidth: 0,
    minContentWidth: 0,
  });
}

function collectionForSection(section: string): KnowledgeCollection {
  return AUTOMATION_SECTIONS.has(section) || section === "blueprint"
    ? "home_ha_automations"
    : "home_ha_reference";
}

function objectTypeForSection(section: string, raw: unknown): HaObjectType {
  if (section === "automation") return "automation";
  if (section === "script") return "script";
  if (section === "scene") return "scene";
  if (section === "blueprint") return "blueprint";
  if (section === "group" || section === "light") return "group";
  if (section === "template") return "template";
  if (section.startsWith("input_") || section === "timer" || section === "counter") {
    return "helper";
  }
  if (isRecord(raw) && raw.platform) return "entity_reference";
  return REFERENCE_SECTIONS.has(section) ? "entity_reference" : "unknown";
}

function sourcePackageName(sourcePath: string): string {
  return path.basename(sourcePath, path.extname(sourcePath));
}

function hasKnownHaSection(value: Record<string, unknown>): boolean {
  return Object.keys(value).some((key) => HA_SECTIONS.has(key));
}

function looksLikeScriptMap(root: Record<string, unknown>, sourcePath: string): boolean {
  if (sourcePath.includes("/scripts/")) return true;

  const values = Object.values(root);
  return (
    values.length > 0 &&
    values.every(
      (value) =>
        isRecord(value) &&
        ("sequence" in value || "fields" in value || "alias" in value),
    )
  );
}

function looksLikePackageMap(root: Record<string, unknown>): boolean {
  const values = Object.values(root);
  return values.some((value) => isRecord(value) && hasKnownHaSection(value));
}

function makeText(params: {
  objectType: HaObjectType;
  objectName: string;
  alias?: string;
  sourcePath: string;
  sectionPath: string;
  raw: unknown;
  entities?: string[];
  services?: string[];
  rooms?: string[];
}): string {
  const label = params.alias ?? params.objectName;
  return [
    `Home Assistant ${params.objectType}: ${label}`,
    `Source: ${params.sourcePath}`,
    `Section path: ${params.sectionPath}`,
    params.entities?.length
      ? `Entities: ${params.entities.join(", ")}`
      : undefined,
    params.services?.length
      ? `Services: ${params.services.join(", ")}`
      : undefined,
    params.rooms?.length ? `Rooms: ${params.rooms.join(", ")}` : undefined,
    "",
    toYaml(params.raw),
  ]
    .filter(Boolean)
    .join("\n");
}

function makeHaChunk(params: {
  collection?: KnowledgeCollection;
  sourceFile: string;
  sourcePath: string;
  packageName: string;
  section: string;
  sectionPath: string;
  objectType: HaObjectType;
  objectName: string;
  alias?: string;
  raw: unknown;
  tags?: string[];
}): KnowledgeChunk {
  const entities = extractEntityIds(params.raw);
  const services = extractServices(params.raw);
  const rooms = extractRooms({
    sourcePath: params.sourcePath,
    objectName: params.objectName,
    alias: params.alias,
    raw: params.raw,
  });
  const collection = params.collection ?? collectionForSection(params.section);
  const text = makeText({
    objectType: params.objectType,
    objectName: params.objectName,
    alias: params.alias,
    sourcePath: params.sourcePath,
    sectionPath: params.sectionPath,
    raw: params.raw,
    entities,
    services,
    rooms,
  });

  return createKnowledgeChunk({
    collection,
    sourceFile: params.sourceFile,
    sourcePath: params.sourcePath,
    logicalPath: params.sectionPath,
    raw: params.raw,
    text,
    entities,
    services,
    rooms,
    domains: [params.section],
    tags: [
      "home_assistant",
      "yaml",
      params.section,
      params.objectType,
      ...(params.tags ?? []),
    ],
    provenance: {
      sourceType: "home_assistant_yaml",
      parser: "chunkHomeAssistantYaml",
      packageName: params.packageName,
      section: params.section,
      sectionPath: params.sectionPath,
      objectType: params.objectType,
      objectName: params.objectName,
      alias: params.alias,
      chunkKind: "ha_yaml_object",
    },
  });
}

function namedObjectName(
  item: unknown,
  fallback: string,
  key?: string,
): string {
  return (
    firstString(item, ["id", "unique_id", "name", "alias"]) ??
    key ??
    fallback
  );
}

function chunkAutomationLikeSection(params: {
  section: "automation" | "script" | "scene";
  value: unknown;
  packageName: string;
  sourceFile: string;
  sourcePath: string;
  sectionPath: string;
}): KnowledgeChunk[] {
  const chunks: KnowledgeChunk[] = [];
  const objectType = params.section as HaObjectType;

  if (Array.isArray(params.value)) {
    for (let index = 0; index < params.value.length; index++) {
      const item = params.value[index];
      const objectName = namedObjectName(item, `${params.section}_${index}`);
      const alias = firstString(item, ["alias", "name"]);
      chunks.push(
        makeHaChunk({
          packageName: params.packageName,
          sourceFile: params.sourceFile,
          sourcePath: params.sourcePath,
          section: params.section,
          objectType,
          objectName,
          alias,
          raw: { [params.section]: [item] },
          sectionPath: `${params.sectionPath}.${slugify(objectName)}`,
        }),
      );
    }
    return chunks;
  }

  if (isRecord(params.value)) {
    for (const [key, item] of Object.entries(params.value)) {
      const objectName = namedObjectName(item, key, key);
      const alias = firstString(item, ["alias", "name"]);
      chunks.push(
        makeHaChunk({
          packageName: params.packageName,
          sourceFile: params.sourceFile,
          sourcePath: params.sourcePath,
          section: params.section,
          objectType,
          objectName,
          alias,
          raw: { [params.section]: { [key]: item } },
          sectionPath: `${params.sectionPath}.${slugify(objectName)}`,
        }),
      );
    }
  }

  return chunks;
}

function chunkTemplateSection(params: {
  value: unknown;
  packageName: string;
  sourceFile: string;
  sourcePath: string;
  sectionPath: string;
}): KnowledgeChunk[] {
  const chunks: KnowledgeChunk[] = [];

  if (!Array.isArray(params.value)) {
    return chunkReferenceSection({
      section: "template",
      value: params.value,
      packageName: params.packageName,
      sourceFile: params.sourceFile,
      sourcePath: params.sourcePath,
      sectionPath: params.sectionPath,
    });
  }

  for (let templateIndex = 0; templateIndex < params.value.length; templateIndex++) {
    const entry = params.value[templateIndex];
    if (!isRecord(entry)) continue;

    let emittedNestedChunk = false;
    for (const [templateType, value] of Object.entries(entry)) {
      if (!Array.isArray(value)) continue;

      for (let itemIndex = 0; itemIndex < value.length; itemIndex++) {
        const item = value[itemIndex];
        const objectName = namedObjectName(
          item,
          `${templateType}_${templateIndex}_${itemIndex}`,
        );
        const alias = firstString(item, ["name", "alias"]);
        const objectType =
          templateType === "binary_sensor"
            ? "template_binary_sensor"
            : templateType === "sensor"
              ? "template_sensor"
              : "template";

        chunks.push(
          makeHaChunk({
            collection: "home_ha_reference",
            packageName: params.packageName,
            sourceFile: params.sourceFile,
            sourcePath: params.sourcePath,
            section: "template",
            objectType,
            objectName,
            alias,
            raw: { template: [{ [templateType]: [item] }] },
            sectionPath: `${params.sectionPath}.${templateType}.${slugify(
              objectName,
            )}`,
            tags: [templateType],
          }),
        );
        emittedNestedChunk = true;
      }
    }

    if (!emittedNestedChunk) {
      const objectName = namedObjectName(entry, `template_${templateIndex}`);
      chunks.push(
        makeHaChunk({
          collection: "home_ha_reference",
          packageName: params.packageName,
          sourceFile: params.sourceFile,
          sourcePath: params.sourcePath,
          section: "template",
          objectType: "template",
          objectName,
          alias: firstString(entry, ["name", "alias"]),
          raw: { template: [entry] },
          sectionPath: `${params.sectionPath}.${slugify(objectName)}`,
        }),
      );
    }
  }

  return chunks;
}

function chunkReferenceSection(params: {
  section: string;
  value: unknown;
  packageName: string;
  sourceFile: string;
  sourcePath: string;
  sectionPath: string;
}): KnowledgeChunk[] {
  const chunks: KnowledgeChunk[] = [];
  const objectType = objectTypeForSection(params.section, params.value);

  if (Array.isArray(params.value)) {
    for (let index = 0; index < params.value.length; index++) {
      const item = params.value[index];
      const objectName = namedObjectName(item, `${params.section}_${index}`);
      chunks.push(
        makeHaChunk({
          collection: "home_ha_reference",
          packageName: params.packageName,
          sourceFile: params.sourceFile,
          sourcePath: params.sourcePath,
          section: params.section,
          objectType,
          objectName,
          alias: firstString(item, ["name", "alias"]),
          raw: { [params.section]: [item] },
          sectionPath: `${params.sectionPath}.${slugify(objectName)}`,
        }),
      );
    }
    return chunks;
  }

  if (isRecord(params.value)) {
    for (const [key, item] of Object.entries(params.value)) {
      const objectName = namedObjectName(item, key, key);
      chunks.push(
        makeHaChunk({
          collection: "home_ha_reference",
          packageName: params.packageName,
          sourceFile: params.sourceFile,
          sourcePath: params.sourcePath,
          section: params.section,
          objectType,
          objectName,
          alias: firstString(item, ["name", "alias"]),
          raw: { [params.section]: { [key]: item } },
          sectionPath: `${params.sectionPath}.${slugify(objectName)}`,
        }),
      );
    }
    return chunks;
  }

  chunks.push(
    makeHaChunk({
      collection: "home_ha_reference",
      packageName: params.packageName,
      sourceFile: params.sourceFile,
      sourcePath: params.sourcePath,
      section: params.section,
      objectType,
      objectName: params.section,
      raw: { [params.section]: params.value },
      sectionPath: params.sectionPath,
    }),
  );

  return chunks;
}

function chunkBlueprint(params: {
  root: Record<string, unknown>;
  packageName: string;
  sourceFile: string;
  sourcePath: string;
}): KnowledgeChunk[] {
  const chunks: KnowledgeChunk[] = [];
  const blueprint = isRecord(params.root.blueprint) ? params.root.blueprint : {};
  const blueprintName =
    firstString(blueprint, ["name"]) ?? sourcePackageName(params.sourcePath);
  const input = isRecord(blueprint.input) ? blueprint.input : {};
  const blueprintOverview = {
    blueprint: {
      name: blueprint.name,
      description: blueprint.description,
      domain: blueprint.domain,
      input_keys: Object.keys(input).sort(),
    },
    mode: params.root.mode,
  };
  const behaviorRaw = Object.fromEntries(
    ["mode", "variables", "trigger", "condition", "action"].flatMap((key) =>
      key in params.root ? [[key, params.root[key]]] : [],
    ),
  );

  chunks.push(
    makeHaChunk({
      collection: "home_ha_automations",
      packageName: params.packageName,
      sourceFile: params.sourceFile,
      sourcePath: params.sourcePath,
      section: "blueprint",
      objectType: "blueprint",
      objectName: blueprintName,
      alias: blueprintName,
      raw: blueprintOverview,
      sectionPath: "blueprint",
      tags: ["blueprint_overview"],
    }),
  );

  if (Object.keys(behaviorRaw).length) {
    chunks.push(
      makeHaChunk({
        collection: "home_ha_automations",
        packageName: params.packageName,
        sourceFile: params.sourceFile,
        sourcePath: params.sourcePath,
        section: "blueprint",
        objectType: "blueprint_behavior",
        objectName: `${blueprintName} behavior`,
        alias: `${blueprintName} behavior`,
        raw: behaviorRaw,
        sectionPath: "blueprint.behavior",
        tags: ["blueprint_behavior"],
      }),
    );
  }

  for (const [inputName, inputValue] of Object.entries(input)) {
    const alias = firstString(inputValue, ["name"]);
    chunks.push(
      makeHaChunk({
        collection: "home_ha_automations",
        packageName: params.packageName,
        sourceFile: params.sourceFile,
        sourcePath: params.sourcePath,
        section: "blueprint",
        objectType: "blueprint_input",
        objectName: inputName,
        alias,
        raw: { blueprint: { input: { [inputName]: inputValue } } },
        sectionPath: `blueprint.input.${slugify(inputName)}`,
        tags: ["blueprint_input"],
      }),
    );
  }

  return chunks;
}

function chunkSection(params: {
  section: string;
  value: unknown;
  packageName: string;
  sourceFile: string;
  sourcePath: string;
  sectionPath: string;
}): KnowledgeChunk[] {
  if (params.section === "template") return chunkTemplateSection(params);

  if (
    params.section === "automation" ||
    params.section === "script" ||
    params.section === "scene"
  ) {
    return chunkAutomationLikeSection({
      ...params,
      section: params.section,
    });
  }

  return chunkReferenceSection(params);
}

function chunkDirectScriptMap(params: {
  root: Record<string, unknown>;
  packageName: string;
  sourceFile: string;
  sourcePath: string;
}): KnowledgeChunk[] {
  return chunkAutomationLikeSection({
    section: "script",
    value: params.root,
    packageName: params.packageName,
    sourceFile: params.sourceFile,
    sourcePath: params.sourcePath,
    sectionPath: "script",
  });
}

function chunkFallbackYaml(params: {
  root: Record<string, unknown>;
  packageName: string;
  sourceFile: string;
  sourcePath: string;
}): KnowledgeChunk[] {
  return [
    makeHaChunk({
      collection: "home_ha_reference",
      packageName: params.packageName,
      sourceFile: params.sourceFile,
      sourcePath: params.sourcePath,
      section: "configuration",
      objectType: "configuration",
      objectName: params.packageName,
      raw: params.root,
      sectionPath: "configuration",
      tags: ["fallback"],
    }),
  ];
}

export function chunkHomeAssistantYamlWithDiagnostics(
  fileContent: string,
  sourceFile: string,
  sourcePath = sourceFile,
): ChunkResult {
  const warnings: ChunkIssue[] = [];
  const errors: ChunkIssue[] = [];
  const redactionWarnings: ChunkIssue[] = [];
  const packageName = sourcePackageName(sourcePath);

  const doc = yaml.parseDocument(fileContent, {
    customTags: [HA_INPUT_TAG, HA_SECRET_TAG],
  });

  for (const warning of doc.warnings) {
    warnings.push({
      code: "yaml_warning",
      message: warning.message,
      sourcePath,
      severity: "warning",
    });
  }

  for (const error of doc.errors) {
    errors.push({
      code: "yaml_parse_error",
      message: error.message,
      sourcePath,
      severity: "error",
    });
  }

  if (doc.errors.length) {
    return { chunks: [], warnings, errors, redactionWarnings };
  }

  const parsed = doc.toJS() as unknown;
  if (!isRecord(parsed)) {
    warnings.push({
      code: "yaml_empty_or_non_object",
      message: "YAML root was empty or not a mapping.",
      sourcePath,
      severity: "warning",
    });
    return { chunks: [], warnings, errors, redactionWarnings };
  }

  const chunks: KnowledgeChunk[] = [];

  if (isRecord(parsed.blueprint)) {
    chunks.push(
      ...chunkBlueprint({
        root: parsed,
        packageName,
        sourceFile,
        sourcePath,
      }),
    );
  }

  const hasTopLevelHaSections = hasKnownHaSection(parsed);
  if (hasTopLevelHaSections) {
    for (const [section, value] of Object.entries(parsed)) {
      if (section === "blueprint") continue;
      if (!HA_SECTIONS.has(section)) continue;

      chunks.push(
        ...chunkSection({
          section,
          value,
          packageName,
          sourceFile,
          sourcePath,
          sectionPath: section,
        }),
      );
    }
  } else if (looksLikeScriptMap(parsed, sourcePath)) {
    chunks.push(
      ...chunkDirectScriptMap({
        root: parsed,
        packageName,
        sourceFile,
        sourcePath,
      }),
    );
  } else if (looksLikePackageMap(parsed)) {
    for (const [packageKey, packageValue] of Object.entries(parsed)) {
      if (!isRecord(packageValue)) continue;

      for (const [section, value] of Object.entries(packageValue)) {
        if (!HA_SECTIONS.has(section)) continue;

        chunks.push(
          ...chunkSection({
            section,
            value,
            packageName: packageKey,
            sourceFile,
            sourcePath,
            sectionPath: `${packageKey}.${section}`,
          }),
        );
      }
    }
  }

  if (!chunks.length) {
    chunks.push(
      ...chunkFallbackYaml({
        root: parsed,
        packageName,
        sourceFile,
        sourcePath,
      }),
    );
  }

  for (const chunk of chunks) {
    redactionWarnings.push(...findUnredactedSecretWarnings(chunk));
  }

  return { chunks, warnings, errors, redactionWarnings };
}

export function chunkHomeAssistantYaml(
  fileContent: string,
  sourceFile: string,
  sourcePath = sourceFile,
): KnowledgeChunk[] {
  return chunkHomeAssistantYamlWithDiagnostics(
    fileContent,
    sourceFile,
    sourcePath,
  ).chunks;
}
