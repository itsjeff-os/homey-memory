import fs from "node:fs";
import path from "node:path";
import { chunkHomeAssistantYamlWithDiagnostics } from "../pkg/chunkHomeAssistantYaml";
import { chunkHomeRegistry } from "../pkg/chunkHomeRegistry";
import { chunkMarkdownDocs } from "../pkg/chunkMarkdownDocs";
import {
  type ChunkIssue,
  type ChunkResult,
  type KnowledgeChunk,
  findUnredactedSecretWarnings,
} from "../pkg/knowledgeChunk";

type CorpusMode = "dry-run" | "manifest" | "validate";

interface IncludedFile {
  path: string;
  kind: "yaml" | "registry" | "doc";
}

interface SkippedFile {
  path: string;
  reason: string;
}

interface CorpusManifest {
  generatedAt: string;
  mode: CorpusMode;
  root: string;
  outputs: {
    chunks: string;
    manifest: string;
  };
  fileCounts: {
    included: number;
    yaml: number;
    registry: number;
    docs: number;
    skipped: number;
  };
  chunkCount: number;
  collectionCounts: Record<string, number>;
  includedFiles: IncludedFile[];
  skippedFiles: SkippedFile[];
  duplicateIds: Array<{ id: string; sourcePaths: string[] }>;
  warnings: ChunkIssue[];
  errors: ChunkIssue[];
  redactionWarnings: ChunkIssue[];
  consistency: {
    textLength: {
      min: number;
      max: number;
      average: number;
      p50: number;
      p90: number;
      shortUnder120: number;
      longOver6000: number;
    };
    objectTypeCounts: Record<string, number>;
    chunkKindCounts: Record<string, number>;
    missingFieldCounts: Record<string, number>;
  };
  baselineComparison: {
    baselinePath: string;
    baselineExists: boolean;
    baselineChunkCount?: number;
    newChunkCount: number;
  };
  successCriteria: {
    fatalParseErrors: number;
    duplicateIdCount: number;
    unredactedSecretWarningCount: number;
  };
}

const OUTPUT_DIR = path.join("generated", "chunks");
const CHUNKS_OUTPUT = path.join(OUTPUT_DIR, "homeassistant_chunks.json");
const MANIFEST_OUTPUT = path.join(OUTPUT_DIR, "homeassistant_manifest.json");

const IGNORED_DIRS = new Set([
  ".git",
  "generated",
  "logs",
  "node_modules",
  "path",
]);

const IGNORED_EXTENSIONS = new Set([
  ".ds_store",
  ".jpeg",
  ".jpg",
  ".log",
  ".pdf",
  ".png",
  ".rtf",
  ".zip",
]);

function parseMode(argv: string[]): CorpusMode {
  if (argv.includes("--validate")) return "validate";
  if (argv.includes("--write") || argv.includes("--manifest")) return "manifest";
  return "dry-run";
}

function toPosix(filePath: string): string {
  return filePath.split(path.sep).join("/");
}

function walkFiles(root: string): string[] {
  const results: string[] = [];

  const visit = (dir: string) => {
    const entries = fs
      .readdirSync(path.join(root, dir), { withFileTypes: true })
      .sort((a, b) => a.name.localeCompare(b.name));

    for (const entry of entries) {
      const relative = dir ? path.join(dir, entry.name) : entry.name;
      const posixRelative = toPosix(relative);

      if (entry.isDirectory()) {
        if (IGNORED_DIRS.has(entry.name)) continue;
        visit(relative);
        continue;
      }

      if (!entry.isFile()) continue;
      results.push(posixRelative);
    }
  };

  visit("");
  return results.sort();
}

function isIgnoredByExtension(relativePath: string): boolean {
  const lower = relativePath.toLowerCase();
  if (lower.endsWith(".ds_store")) return true;
  return IGNORED_EXTENSIONS.has(path.extname(lower));
}

function classifyFile(relativePath: string): IncludedFile | SkippedFile {
  if (isIgnoredByExtension(relativePath)) {
    return { path: relativePath, reason: "ignored_extension_or_system_file" };
  }

  if (relativePath.startsWith("ha_cleaned_yaml/ha_cleaned_yaml/")) {
    return { path: relativePath, reason: "duplicate_nested_export" };
  }

  if (relativePath === "home_registry.json") {
    return { path: relativePath, kind: "registry" };
  }

  if (
    relativePath.startsWith("ha_cleaned_yaml/") &&
    relativePath.endsWith(".yaml")
  ) {
    return { path: relativePath, kind: "yaml" };
  }

  if (relativePath === "ceiling_daily_rhythm_presence.yaml") {
    return { path: relativePath, kind: "yaml" };
  }

  if (
    relativePath.startsWith("ha_historical_context/") &&
    relativePath.endsWith(".yaml")
  ) {
    return { path: relativePath, kind: "yaml" };
  }

  if (
    (relativePath.endsWith(".md") || relativePath.endsWith(".txt")) &&
    isSelectedDoc(relativePath)
  ) {
    return { path: relativePath, kind: "doc" };
  }

  return { path: relativePath, reason: "not_in_homeassistant_first_corpus" };
}

function isSelectedDoc(relativePath: string): boolean {
  if (relativePath.startsWith("node_modules/")) return false;
  if (relativePath.startsWith("ha_cleaned_yaml/ha_cleaned_yaml/")) return false;
  if (relativePath === "ha_cleaned_yaml/README.md") return true;
  if (relativePath.startsWith("ha_historical_context/")) return true;
  if (relativePath === "Rooms/Rooms.md") return true;
  if (relativePath.startsWith("Servers:Homelab /")) return true;

  return [
    "Smart Home Summary.txt",
    "home_assistant_system_README.md",
    "homeassistant_entity_reference.md",
    "project_ship_full_thread_compilation.md",
    "ship_devices_inventor.md",
  ].includes(relativePath);
}

function runChunker(root: string, file: IncludedFile): ChunkResult {
  const absolutePath = path.join(root, file.path);
  const content = fs.readFileSync(absolutePath, "utf8");
  const sourceFile = path.basename(file.path);

  if (file.kind === "yaml") {
    return chunkHomeAssistantYamlWithDiagnostics(content, sourceFile, file.path);
  }

  if (file.kind === "registry") {
    return chunkHomeRegistry(content, sourceFile, file.path);
  }

  return chunkMarkdownDocs(content, sourceFile, file.path);
}

function countCollections(chunks: KnowledgeChunk[]): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const chunk of chunks) {
    counts[chunk.collection] = (counts[chunk.collection] ?? 0) + 1;
  }
  return Object.fromEntries(Object.entries(counts).sort());
}

function countByProvenanceKey(
  chunks: KnowledgeChunk[],
  key: string,
): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const chunk of chunks) {
    const value = chunk.provenance[key];
    const label = typeof value === "string" && value ? value : "unknown";
    counts[label] = (counts[label] ?? 0) + 1;
  }
  return Object.fromEntries(Object.entries(counts).sort());
}

function percentile(values: number[], percentileValue: number): number {
  if (!values.length) return 0;
  const index = Math.min(
    values.length - 1,
    Math.floor((values.length - 1) * percentileValue),
  );
  return values[index] ?? 0;
}

function consistencyReport(chunks: KnowledgeChunk[]): CorpusManifest["consistency"] {
  const lengths = chunks.map((chunk) => chunk.text.length).sort((a, b) => a - b);
  const missingFieldCounts: Record<string, number> = {};
  const requiredFields: Array<keyof KnowledgeChunk> = [
    "id",
    "collection",
    "text",
    "sourceFile",
    "sourcePath",
    "contentHash",
    "entities",
    "services",
    "domains",
    "rooms",
    "tags",
    "provenance",
    "raw",
  ];

  for (const field of requiredFields) {
    missingFieldCounts[field] = chunks.filter((chunk) => chunk[field] == null)
      .length;
  }

  return {
    textLength: {
      min: lengths[0] ?? 0,
      max: lengths.at(-1) ?? 0,
      average: lengths.length
        ? Math.round(lengths.reduce((sum, length) => sum + length, 0) / lengths.length)
        : 0,
      p50: percentile(lengths, 0.5),
      p90: percentile(lengths, 0.9),
      shortUnder120: lengths.filter((length) => length < 120).length,
      longOver6000: lengths.filter((length) => length > 6000).length,
    },
    objectTypeCounts: countByProvenanceKey(chunks, "objectType"),
    chunkKindCounts: countByProvenanceKey(chunks, "chunkKind"),
    missingFieldCounts,
  };
}

function findDuplicateIds(
  chunks: KnowledgeChunk[],
): Array<{ id: string; sourcePaths: string[] }> {
  const byId = new Map<string, Set<string>>();
  for (const chunk of chunks) {
    const sourcePaths = byId.get(chunk.id) ?? new Set<string>();
    sourcePaths.add(chunk.sourcePath);
    byId.set(chunk.id, sourcePaths);
  }

  return Array.from(byId.entries())
    .filter(([, sourcePaths]) => sourcePaths.size > 1)
    .map(([id, sourcePaths]) => ({
      id,
      sourcePaths: Array.from(sourcePaths).sort(),
    }))
    .sort((a, b) => a.id.localeCompare(b.id));
}

function baselineComparison(root: string, newChunkCount: number) {
  const baselinePath = "ha_chunks.json";
  const absoluteBaselinePath = path.join(root, baselinePath);

  if (!fs.existsSync(absoluteBaselinePath)) {
    return {
      baselinePath,
      baselineExists: false,
      newChunkCount,
    };
  }

  try {
    const parsed = JSON.parse(fs.readFileSync(absoluteBaselinePath, "utf8"));
    return {
      baselinePath,
      baselineExists: true,
      baselineChunkCount: Array.isArray(parsed) ? parsed.length : undefined,
      newChunkCount,
    };
  } catch {
    return {
      baselinePath,
      baselineExists: true,
      baselineChunkCount: undefined,
      newChunkCount,
    };
  }
}

function writeJson(root: string, relativePath: string, value: unknown): void {
  const absolutePath = path.join(root, relativePath);
  fs.mkdirSync(path.dirname(absolutePath), { recursive: true });
  fs.writeFileSync(absolutePath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

export function chunkHomeAssistantCorpus(root = process.cwd(), argv = process.argv) {
  const mode = parseMode(argv.slice(2));
  const allFiles = walkFiles(root);
  const includedFiles: IncludedFile[] = [];
  const skippedFiles: SkippedFile[] = [];

  for (const filePath of allFiles) {
    const classification = classifyFile(filePath);
    if ("kind" in classification) includedFiles.push(classification);
    else skippedFiles.push(classification);
  }

  const chunks: KnowledgeChunk[] = [];
  const warnings: ChunkIssue[] = [];
  const errors: ChunkIssue[] = [];
  const redactionWarnings: ChunkIssue[] = [];

  for (const file of includedFiles) {
    const result = runChunker(root, file);
    chunks.push(...result.chunks);
    warnings.push(...result.warnings);
    errors.push(...result.errors);
    redactionWarnings.push(...result.redactionWarnings);
  }

  for (const chunk of chunks) {
    redactionWarnings.push(...findUnredactedSecretWarnings(chunk));
  }

  const duplicateIds = findDuplicateIds(chunks);
  const manifest: CorpusManifest = {
    generatedAt: new Date().toISOString(),
    mode,
    root,
    outputs: {
      chunks: CHUNKS_OUTPUT,
      manifest: MANIFEST_OUTPUT,
    },
    fileCounts: {
      included: includedFiles.length,
      yaml: includedFiles.filter((file) => file.kind === "yaml").length,
      registry: includedFiles.filter((file) => file.kind === "registry").length,
      docs: includedFiles.filter((file) => file.kind === "doc").length,
      skipped: skippedFiles.length,
    },
    chunkCount: chunks.length,
    collectionCounts: countCollections(chunks),
    includedFiles,
    skippedFiles,
    duplicateIds,
    warnings,
    errors,
    redactionWarnings,
    consistency: consistencyReport(chunks),
    baselineComparison: baselineComparison(root, chunks.length),
    successCriteria: {
      fatalParseErrors: errors.length,
      duplicateIdCount: duplicateIds.length,
      unredactedSecretWarningCount: redactionWarnings.length,
    },
  };

  writeJson(root, CHUNKS_OUTPUT, chunks);
  writeJson(root, MANIFEST_OUTPUT, manifest);

  return { chunks, manifest };
}

if (require.main === module) {
  const { manifest } = chunkHomeAssistantCorpus();
  const hasBlockingIssue =
    manifest.errors.length > 0 ||
    manifest.duplicateIds.length > 0 ||
    manifest.redactionWarnings.length > 0;

  console.log(
    [
      `Mode: ${manifest.mode}`,
      `Included files: ${manifest.fileCounts.included}`,
      `Chunks: ${manifest.chunkCount}`,
      `Collections: ${JSON.stringify(manifest.collectionCounts)}`,
      `Warnings: ${manifest.warnings.length}`,
      `Errors: ${manifest.errors.length}`,
      `Duplicate IDs: ${manifest.duplicateIds.length}`,
      `Redaction warnings: ${manifest.redactionWarnings.length}`,
      `Wrote: ${CHUNKS_OUTPUT}`,
      `Wrote: ${MANIFEST_OUTPUT}`,
    ].join("\n"),
  );

  if (manifest.mode === "validate" && hasBlockingIssue) {
    process.exitCode = 1;
  }
}
