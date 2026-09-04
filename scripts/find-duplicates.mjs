#!/usr/bin/env node
/**
 * find-duplicates.mjs — content-hash duplicate file detector.
 *
 * This repo accumulates a lot of imported/exported content (Notion exports,
 * Home Assistant snapshots, etc.) where the same file often ends up copied
 * into more than one directory as it gets triaged/organised. That silent
 * duplication is exactly what this script catches, so backlog can be
 * triaged with confidence and CI can block *new* duplication from landing.
 *
 * Usage:
 *   node scripts/find-duplicates.mjs                 # human-readable report
 *   node scripts/find-duplicates.mjs --json          # machine-readable report
 *   node scripts/find-duplicates.mjs --fail-on-found # exit 1 if duplicates exist (CI gate)
 *
 * A file is only considered a duplicate if its content (hash) exactly
 * matches another file's content. Zero-byte files (e.g. `.gitkeep`
 * placeholders, which are intentionally identical-empty) are ignored.
 */
import { createHash } from "node:crypto";
import { createReadStream, statSync } from "node:fs";
import { readdir } from "node:fs/promises";
import { join, relative } from "node:path";

const ROOT = new URL("..", import.meta.url).pathname;

const IGNORED_DIR_NAMES = new Set([
  "node_modules",
  ".git",
  ".github",
  ".turbo",
  "dist",
  "generated",
  "coverage",
  // Deliberately-separate legacy/parallel sub-project retained for reference;
  // it intentionally overlaps with docs/lockfiles in the main package.
  "experimental",
]);

const args = new Set(process.argv.slice(2));
const asJson = args.has("--json");
const failOnFound = args.has("--fail-on-found");

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    if (IGNORED_DIR_NAMES.has(entry.name)) continue;
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walk(fullPath)));
    } else if (entry.isFile()) {
      files.push(fullPath);
    }
  }
  return files;
}

function hashFile(path) {
  return new Promise((resolve, reject) => {
    const hash = createHash("sha256");
    const stream = createReadStream(path);
    stream.on("data", (chunk) => hash.update(chunk));
    stream.on("end", () => resolve(hash.digest("hex")));
    stream.on("error", reject);
  });
}

const allFiles = await walk(ROOT);

/** @type {Map<string, string[]>} */
const byHash = new Map();

for (const file of allFiles) {
  const { size } = statSync(file);
  if (size === 0) continue; // ignore .gitkeep-style empty placeholders

  const hash = await hashFile(file);
  const relPath = relative(ROOT, file);
  const group = byHash.get(hash) ?? [];
  group.push(relPath);
  byHash.set(hash, group);
}

const duplicateGroups = [...byHash.values()]
  .filter((group) => group.length > 1)
  .map((group) => group.sort())
  .sort((a, b) => a[0].localeCompare(b[0]));

if (asJson) {
  console.log(JSON.stringify(duplicateGroups, null, 2));
} else if (duplicateGroups.length === 0) {
  console.log("No duplicate files found.");
} else {
  console.log(`Found ${duplicateGroups.length} group(s) of byte-identical duplicate files:\n`);
  for (const group of duplicateGroups) {
    console.log(`  - ${group.join("\n    = ")}`);
  }
  console.log(
    `\n${duplicateGroups.length} duplicate group(s). Keep one copy per group and remove the rest,` +
      " or document why the duplication is intentional.",
  );
}

if (failOnFound && duplicateGroups.length > 0) {
  process.exit(1);
}
