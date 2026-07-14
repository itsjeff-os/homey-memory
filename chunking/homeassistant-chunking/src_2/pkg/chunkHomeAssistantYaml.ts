import yaml from "yaml";

type ChunkObjectType =
  | "input_boolean"
  | "input_datetime"
  | "input_number"
  | "input_select"
  | "group"
  | "timer"
  | "template_binary_sensor"
  | "template_sensor"
  | "script"
  | "automation"
  | "unknown";

export interface HaChunk {
  chunk_id: string;
  package: string;
  object_type: ChunkObjectType;
  object_name: string;
  alias?: string;
  source_file: string;
  section: string;
  section_path: string;
  entities: string[];
  summary: string;
  chunk_text: string;
  raw: unknown;
}

function stableId(parts: string[]): string {
  return parts
    .join(".")
    .replace(/[^a-zA-Z0-9_.-]/g, "_")
    .replace(/_+/g, "_");
}

function toYaml(value: unknown): string {
  return yaml.stringify(value, {
    indent: 2,
    lineWidth: 0,
    minContentWidth: 0,
  });
}

function extractEntityIds(value: unknown): string[] {
  const found = new Set<string>();

  const entityRegex =
    /\b(?:light|switch|sensor|binary_sensor|input_boolean|input_datetime|input_number|input_select|timer|group|media_player|climate|cover|lock|person|alarm_control_panel)\.[a-zA-Z0-9_]+\b/g;

  const visit = (node: unknown) => {
    if (typeof node === "string") {
      const matches = node.match(entityRegex);
      if (matches) {
        for (const match of matches) found.add(match);
      }
      return;
    }

    if (Array.isArray(node)) {
      for (const item of node) visit(item);
      return;
    }

    if (node && typeof node === "object") {
      for (const v of Object.values(node as Record<string, unknown>)) {
        visit(v);
      }
    }
  };

  visit(value);
  return Array.from(found).sort();
}

function firstString(value: unknown, keys: string[]): string | undefined {
  if (!value || typeof value !== "object") return undefined;
  const obj = value as Record<string, unknown>;
  for (const key of keys) {
    const v = obj[key];
    if (typeof v === "string" && v.trim()) return v.trim();
  }
  return undefined;
}

function makeSummary(
  objectType: ChunkObjectType,
  objectName: string,
  alias: string | undefined,
  entities: string[],
): string {
  const label = alias ?? objectName;
  const entityPart = entities.length
    ? ` Uses ${entities.slice(0, 6).join(", ")}${entities.length > 6 ? "..." : ""}.`
    : "";
  return `${objectType} chunk for ${label}.${entityPart}`;
}

function makeChunk(params: {
  packageName: string;
  sourceFile: string;
  section: string;
  objectType: ChunkObjectType;
  objectName: string;
  alias?: string;
  raw: unknown;
  sectionPath: string;
}): HaChunk {
  const entities = extractEntityIds(params.raw);
  const chunkText = toYaml(params.raw);

  return {
    chunk_id: stableId([
      params.packageName,
      params.section,
      params.objectName,
    ]),
    package: params.packageName,
    object_type: params.objectType,
    object_name: params.objectName,
    alias: params.alias,
    source_file: params.sourceFile,
    section: params.section,
    section_path: params.sectionPath,
    entities,
    summary: makeSummary(
      params.objectType,
      params.objectName,
      params.alias,
      entities,
    ),
    chunk_text: chunkText,
    raw: params.raw,
  };
}

function chunkTemplateSection(
  packageName: string,
  sourceFile: string,
  sectionPath: string,
  templateValue: unknown,
): HaChunk[] {
  const chunks: HaChunk[] = [];
  if (!Array.isArray(templateValue)) return chunks;

  for (let i = 0; i < templateValue.length; i++) {
    const entry = templateValue[i];
    if (!entry || typeof entry !== "object") continue;

    const obj = entry as Record<string, unknown>;

    for (const [templateType, value] of Object.entries(obj)) {
      if (!Array.isArray(value)) continue;

      for (let j = 0; j < value.length; j++) {
        const item = value[j];
        if (!item || typeof item !== "object") continue;

        const itemObj = item as Record<string, unknown>;
        const objectName =
          firstString(itemObj, ["unique_id", "name"]) ??
          `${templateType}_${i}_${j}`;
        const alias = firstString(itemObj, ["name"]);
        const objectType =
          templateType === "binary_sensor"
            ? "template_binary_sensor"
            : templateType === "sensor"
              ? "template_sensor"
              : "unknown";

        chunks.push(
          makeChunk({
            packageName,
            sourceFile,
            section: "template",
            objectType,
            objectName,
            alias,
            raw: { template: [{ [templateType]: [item] }] },
            sectionPath: `${sectionPath}[${i}].${templateType}[${j}]`,
          }),
        );
      }
    }
  }

  return chunks;
}

function chunkAutomationSection(
  packageName: string,
  sourceFile: string,
  sectionPath: string,
  automationValue: unknown,
): HaChunk[] {
  const chunks: HaChunk[] = [];
  if (!Array.isArray(automationValue)) return chunks;

  for (let i = 0; i < automationValue.length; i++) {
    const item = automationValue[i];
    if (!item || typeof item !== "object") continue;

    const obj = item as Record<string, unknown>;
    const objectName =
      firstString(obj, ["id", "alias"]) ?? `automation_${i}`;
    const alias = firstString(obj, ["alias"]);

    chunks.push(
      makeChunk({
        packageName,
        sourceFile,
        section: "automation",
        objectType: "automation",
        objectName,
        alias,
        raw: { automation: [item] },
        sectionPath: `${sectionPath}[${i}]`,
      }),
    );
  }

  return chunks;
}

function chunkNamedObjectSection(
  packageName: string,
  sourceFile: string,
  section: string,
  sectionPath: string,
  value: unknown,
): HaChunk[] {
  const chunks: HaChunk[] = [];
  if (!value || typeof value !== "object" || Array.isArray(value)) return chunks;

  const objectType = section as ChunkObjectType;
  const entries = value as Record<string, unknown>;

  for (const [key, item] of Object.entries(entries)) {
    const alias = firstString(item, ["alias", "name"]);
    chunks.push(
      makeChunk({
        packageName,
        sourceFile,
        section,
        objectType,
        objectName: key,
        alias,
        raw: { [section]: { [key]: item } },
        sectionPath: `${sectionPath}.${key}`,
      }),
    );
  }

  return chunks;
}

export function chunkHomeAssistantYaml(
  fileContent: string,
  sourceFile: string,
): HaChunk[] {
  const parsed = yaml.parse(fileContent) as Record<string, unknown>;
  const chunks: HaChunk[] = [];

  for (const [packageName, packageValue] of Object.entries(parsed)) {
    if (!packageValue || typeof packageValue !== "object" || Array.isArray(packageValue)) {
      continue;
    }

    const pkg = packageValue as Record<string, unknown>;

    for (const [section, value] of Object.entries(pkg)) {
      const sectionPath = `${packageName}.${section}`;

      if (section === "template") {
        chunks.push(
          ...chunkTemplateSection(packageName, sourceFile, sectionPath, value),
        );
        continue;
      }

      if (section === "automation") {
        chunks.push(
          ...chunkAutomationSection(packageName, sourceFile, sectionPath, value),
        );
        continue;
      }

      chunks.push(
        ...chunkNamedObjectSection(
          packageName,
          sourceFile,
          section,
          sectionPath,
          value,
        ),
      );
    }
  }

  return chunks;
}
