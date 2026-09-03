import path from "node:path";
import {
  type ChunkIssue,
  type ChunkResult,
  createKnowledgeChunk,
  redactText,
  stableJson,
} from "./knowledgeChunk.js";

const MAX_DOC_CHARS = 4_000;
const MIN_DOC_CHARS = 220;

interface DocSection {
  heading: string;
  level: number;
  text: string;
  index: number;
  format: "markdown" | "text" | "json";
}

function splitByHeadings(content: string, sourceFile: string): DocSection[] {
  const normalized = redactText(content).replace(/\r\n/g, "\n");
  const lines = normalized.split("\n");
  const isMarkdown = sourceFile.toLowerCase().endsWith(".md");
  const sections: DocSection[] = [];
  let currentHeading = path.basename(sourceFile);
  let currentLevel = 0;
  let buffer: string[] = [];

  const flush = () => {
    const text = buffer.join("\n").trim();
    if (!text) return;

    sections.push({
      heading: currentHeading,
      level: currentLevel,
      text,
      index: sections.length,
      format: isMarkdown ? "markdown" : "text",
    });
    buffer = [];
  };

  for (const line of lines) {
    const headingMatch = isMarkdown ? /^(#{1,4})\s+(.+)$/.exec(line) : null;
    if (headingMatch) {
      flush();
      currentHeading = headingMatch[2]?.trim() || path.basename(sourceFile);
      currentLevel = headingMatch[1]?.length ?? 0;
      buffer = [line];
      continue;
    }

    buffer.push(line);
  }

  flush();
  return normalizeSections(sections);
}

function splitDocument(content: string, sourceFile: string): DocSection[] {
  const parsedJson = parseJsonLikeDoc(content, sourceFile);
  if (parsedJson) return parsedJson;
  return splitByHeadings(content, sourceFile);
}

function parseJsonLikeDoc(content: string, sourceFile: string): DocSection[] | undefined {
  const trimmed = redactText(content).trim();
  const extension = path.extname(sourceFile).toLowerCase();
  if (![".json", ".txt"].includes(extension)) return undefined;
  if (!trimmed.startsWith("{") && !trimmed.startsWith("[")) return undefined;

  let parsed: unknown;
  try {
    parsed = JSON.parse(trimmed);
  } catch {
    return undefined;
  }

  const sections: DocSection[] = [];
  const add = (heading: string, value: unknown) => {
    const text = stableJson(value);
    if (!text || text === "{}" || text === "[]") return;
    sections.push({
      heading,
      level: 1,
      text,
      index: sections.length,
      format: "json",
    });
  };

  if (Array.isArray(parsed)) {
    for (let index = 0; index < parsed.length; index++) {
      add(`${path.basename(sourceFile)} item ${index + 1}`, parsed[index]);
    }
    return normalizeSections(sections);
  }

  if (!parsed || typeof parsed !== "object") return undefined;
  const root = parsed as Record<string, unknown>;

  add(`${path.basename(sourceFile)} overview`, {
    keys: Object.keys(root).sort(),
  });

  for (const [key, value] of Object.entries(root)) {
    if (key === "facts" && value && typeof value === "object" && !Array.isArray(value)) {
      for (const [factKey, factValue] of Object.entries(value as Record<string, unknown>)) {
        add(`facts.${factKey}`, factValue);
      }
      continue;
    }

    add(key, value);
  }

  return normalizeSections(sections);
}

function normalizeSections(sections: DocSection[]): DocSection[] {
  const merged = mergeShortSections(sections);
  const split = merged.flatMap(splitLongSection);

  return split.map((section, index) => ({
    ...section,
    index,
  }));
}

function mergeShortSections(sections: DocSection[]): DocSection[] {
  const queue = [...sections];
  const merged: DocSection[] = [];

  while (queue.length) {
    const section = queue.shift();
    if (!section) break;

    if (section.text.length < MIN_DOC_CHARS && queue.length) {
      const next = queue.shift();
      if (!next) break;
      queue.unshift({
        ...next,
        heading: `${section.heading} / ${next.heading}`,
        level: Math.min(section.level, next.level),
        text: `${section.text}\n\n${next.text}`.trim(),
      });
      continue;
    }

    if (section.text.length < MIN_DOC_CHARS && merged.length) {
      const previous = merged[merged.length - 1];
      if (previous) {
        previous.text = `${previous.text}\n\n${section.text}`.trim();
      }
      continue;
    }

    merged.push(section);
  }

  return merged;
}

function splitLongSection(section: DocSection): DocSection[] {
  if (section.text.length <= MAX_DOC_CHARS) return [section];

  const chunks: DocSection[] = [];
  let remaining = section.text;

  while (remaining.length > MAX_DOC_CHARS) {
    const slice = remaining.slice(0, MAX_DOC_CHARS);
    const splitAt = Math.max(
      slice.lastIndexOf("\n\n"),
      slice.lastIndexOf("\n"),
      Math.floor(MAX_DOC_CHARS * 0.75),
    );
    chunks.push({
      ...section,
      heading: `${section.heading} part ${chunks.length + 1}`,
      text: remaining.slice(0, splitAt).trim(),
    });
    remaining = remaining.slice(splitAt).trim();
  }

  if (remaining) {
    chunks.push({
      ...section,
      heading: `${section.heading} part ${chunks.length + 1}`,
      text: remaining,
    });
  }

  return chunks;
}

export function chunkMarkdownDocs(
  fileContent: string,
  sourceFile: string,
  sourcePath = sourceFile,
): ChunkResult {
  const warnings: ChunkIssue[] = [];
  const errors: ChunkIssue[] = [];
  const redactionWarnings: ChunkIssue[] = [];
  const sections = splitDocument(fileContent, sourceFile);

  if (!sections.length) {
    warnings.push({
      code: "doc_empty",
      message: "Document had no chunkable text.",
      sourcePath,
      severity: "warning",
    });
  }

  const ext = path.extname(sourceFile).slice(1).toLowerCase() || "text";
  const chunks = sections.map((section) =>
    createKnowledgeChunk({
      collection: "home_system_docs",
      sourceFile,
      sourcePath,
      logicalPath: `doc.${section.index}.${section.heading}`,
      raw: {
        heading: section.heading,
        level: section.level,
        text: section.text,
      },
      tags: ["doc", ext],
      provenance: {
        sourceType: section.format === "json" ? "home_system_json_doc" : "home_system_doc",
        parser: "chunkMarkdownDocs",
        objectType: "doc_section",
        objectName: section.heading,
        sectionPath: `doc.${section.index}.${section.heading}`,
        chunkKind: section.format,
        heading: section.heading,
        headingLevel: section.level,
        sectionIndex: section.index,
      },
      text: [
        `Home system document: ${section.heading}`,
        `Source: ${sourcePath}`,
        "",
        section.text,
      ].join("\n"),
    }),
  );

  return { chunks, warnings, errors, redactionWarnings };
}
