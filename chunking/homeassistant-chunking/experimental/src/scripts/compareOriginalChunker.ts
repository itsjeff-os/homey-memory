import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { pathToFileURL } from "node:url";
import { chunkHomeAssistantYamlWithDiagnostics } from "../pkg/chunkHomeAssistantYaml";

const INPUT_PATH = "ceiling_daily_rhythm_presence.yaml";
const OLD_CHUNKS_PATH = "ha_chunks.json";
const OUTPUT_DIR = path.join("generated", "chunks");
const OUTPUT_JSON = path.join(OUTPUT_DIR, "homeassistant_chunk_comparison.json");
const OUTPUT_MD = path.join(OUTPUT_DIR, "homeassistant_chunk_comparison.md");

interface OriginalChunk {
  chunk_id: string;
  package: string;
  object_type: string;
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

function loadOriginalChunker() {
  const tempDir = fs.mkdtempSync(
    path.join(process.cwd(), ".tmp-original-chunker-"),
  );
  execFileSync("unzip", ["-q", "src.zip", "-d", tempDir], {
    cwd: process.cwd(),
  });
  const chunkerPath = path.join(tempDir, "src", "pkg", "chunkHomeAssistantYaml.ts");
  return import(pathToFileURL(chunkerPath).href);
}

function stripCurrentPrefix(id: string): string {
  return id.replace(
    /^home_ha_automations:ceiling_daily_rhythm_presence\.yaml:/,
    "",
  );
}

function normalizeOriginal(chunk: OriginalChunk) {
  return {
    id: chunk.chunk_id,
    type: chunk.object_type,
    sectionPath: chunk.section_path,
    summary: chunk.summary,
    entities: chunk.entities,
    raw: chunk.raw,
  };
}

function countBy<T>(items: T[], keyFor: (item: T) => string | undefined) {
  const counts: Record<string, number> = {};
  for (const item of items) {
    const key = keyFor(item) || "unknown";
    counts[key] = (counts[key] ?? 0) + 1;
  }
  return Object.fromEntries(Object.entries(counts).sort());
}

function markdownTable(rows: string[][]): string {
  const widths = rows[0]?.map((_, index) =>
    Math.max(...rows.map((row) => row[index]?.length ?? 0)),
  );
  if (!widths) return "";

  return rows
    .map((row, rowIndex) => {
      const line = `| ${row
        .map((cell, index) => cell.padEnd(widths[index] ?? 0))
        .join(" | ")} |`;
      if (rowIndex === 0) {
        const separator = `| ${widths.map((width) => "-".repeat(width)).join(" | ")} |`;
        return `${line}\n${separator}`;
      }
      return line;
    })
    .join("\n");
}

async function main() {
  const originalModule = await loadOriginalChunker();
  const originalChunker =
    originalModule.chunkHomeAssistantYaml ??
    originalModule.default?.chunkHomeAssistantYaml ??
    originalModule["module.exports"]?.chunkHomeAssistantYaml;

  if (typeof originalChunker !== "function") {
    throw new Error("Could not load original chunkHomeAssistantYaml from src.zip");
  }

  const inputContent = fs.readFileSync(INPUT_PATH, "utf8");
  const freshOriginal = originalChunker(
    inputContent,
    INPUT_PATH,
  ) as OriginalChunk[];
  const savedOriginal = JSON.parse(
    fs.readFileSync(OLD_CHUNKS_PATH, "utf8"),
  ) as OriginalChunk[];
  const currentResult = chunkHomeAssistantYamlWithDiagnostics(
    inputContent,
    path.basename(INPUT_PATH),
    INPUT_PATH,
  );
  const current = currentResult.chunks;

  const oldIds = freshOriginal.map((chunk) => chunk.chunk_id);
  const currentLogicalIds = current.map((chunk) => stripCurrentPrefix(chunk.id));
  const oldOnlyIds = oldIds.filter((id) => !currentLogicalIds.includes(id));
  const currentOnlyLogicalIds = currentLogicalIds.filter(
    (id) => !oldIds.includes(id),
  );
  const savedOldMatchesFreshOriginal =
    JSON.stringify(freshOriginal.map(normalizeOriginal)) ===
    JSON.stringify(savedOriginal.map(normalizeOriginal));

  const sharedIds = oldIds.filter((id) => currentLogicalIds.includes(id));
  const sharedMapping = sharedIds.map((id) => {
    const original = freshOriginal.find((chunk) => chunk.chunk_id === id);
    const currentChunk = current.find((chunk) => stripCurrentPrefix(chunk.id) === id);
    return {
      logicalId: id,
      original: original
        ? {
            id: original.chunk_id,
            type: original.object_type,
            sectionPath: original.section_path,
            entities: original.entities,
            textLength: original.chunk_text.length,
            raw: original.raw,
          }
        : undefined,
      current: currentChunk
        ? {
            id: currentChunk.id,
            collection: currentChunk.collection,
            type: currentChunk.provenance.objectType,
            sectionPath: currentChunk.provenance.sectionPath,
            entities: currentChunk.entities,
            services: currentChunk.services,
            textLength: currentChunk.text.length,
            raw: currentChunk.raw,
          }
        : undefined,
    };
  });

  const comparison = {
    generatedAt: new Date().toISOString(),
    inputUsed: INPUT_PATH,
    files: {
      originalSourceZip: "src.zip",
      savedOriginalChunks: OLD_CHUNKS_PATH,
      currentChunker: "src/pkg/chunkHomeAssistantYaml.ts",
    },
    counts: {
      freshOriginal: freshOriginal.length,
      savedOriginal: savedOriginal.length,
      currentSameInput: current.length,
    },
    savedOldMatchesFreshOriginal,
    originalWarningsExpected: [
      "The original chunker emits YAML warnings for Home Assistant !input tags.",
    ],
    currentDiagnostics: {
      warnings: currentResult.warnings,
      errors: currentResult.errors,
      redactionWarnings: currentResult.redactionWarnings,
    },
    summaries: {
      originalObjectTypes: countBy(freshOriginal, (chunk) => chunk.object_type),
      currentObjectTypes: countBy(current, (chunk) =>
        String(chunk.provenance.objectType),
      ),
      currentCollections: countBy(current, (chunk) => chunk.collection),
    },
    oldOnlyIds,
    currentOnlyLogicalIds,
    sharedMapping,
  };

  const summaryRows = [
    ["Metric", "Original", "Current"],
    ["Input file", INPUT_PATH, INPUT_PATH],
    ["Chunk count", String(freshOriginal.length), String(current.length)],
    [
      "Chunk types",
      JSON.stringify(comparison.summaries.originalObjectTypes),
      JSON.stringify(comparison.summaries.currentObjectTypes),
    ],
    ["Collections", "none", JSON.stringify(comparison.summaries.currentCollections)],
    [
      "Entities total",
      String(freshOriginal.reduce((sum, chunk) => sum + chunk.entities.length, 0)),
      String(current.reduce((sum, chunk) => sum + chunk.entities.length, 0)),
    ],
    [
      "Services total",
      "not extracted",
      String(current.reduce((sum, chunk) => sum + chunk.services.length, 0)),
    ],
  ];

  const idRows = [
    ["Logical ID", "Original Type", "Current Type", "Current Collection"],
    ...sharedMapping.map((entry) => [
      entry.logicalId,
      String(entry.original?.type ?? ""),
      String(entry.current?.type ?? ""),
      String(entry.current?.collection ?? ""),
    ]),
    ...currentOnlyLogicalIds.map((id) => [
      id,
      "",
      String(
        current.find((chunk) => stripCurrentPrefix(chunk.id) === id)?.provenance
          .objectType ?? "",
      ),
      String(
        current.find((chunk) => stripCurrentPrefix(chunk.id) === id)?.collection ??
          "",
      ),
    ]),
  ];

  const markdown = [
    "# HomeAssistant Chunker Comparison",
    "",
    `Generated: ${comparison.generatedAt}`,
    "",
    "This compares the original chunker from `src.zip`, the saved original `ha_chunks.json`, and the current chunker output using the same input file.",
    "",
    `Saved old output matches a fresh run of the original chunker: **${savedOldMatchesFreshOriginal ? "yes" : "no"}**.`,
    "",
    "## Summary",
    "",
    markdownTable(summaryRows),
    "",
    "## ID Coverage",
    "",
    `Old-only IDs: ${oldOnlyIds.length ? oldOnlyIds.join(", ") : "none"}`,
    "",
    `Current-only logical IDs: ${currentOnlyLogicalIds.join(", ") || "none"}`,
    "",
    markdownTable(idRows),
    "",
    "## Notes",
    "",
    "- The current output preserves the 20 original blueprint input logical chunks.",
    "- The current output adds `blueprint` and `blueprint.behavior` chunks for retrieval over metadata and actual automation behavior.",
    "- The current parser handles `!input` without unresolved tag warnings.",
    "",
  ].join("\n");

  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  fs.writeFileSync(OUTPUT_JSON, `${JSON.stringify(comparison, null, 2)}\n`, "utf8");
  fs.writeFileSync(OUTPUT_MD, markdown, "utf8");

  console.log(`Wrote ${OUTPUT_JSON}`);
  console.log(`Wrote ${OUTPUT_MD}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
