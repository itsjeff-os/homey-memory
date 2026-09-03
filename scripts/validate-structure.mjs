#!/usr/bin/env node
/**
 * Validates repository structural conventions documented in README.md:
 *   - Every top-level section directory contains a README.md.
 *   - Directories that only contain a .gitkeep placeholder don't also
 *     contain real content sitting alongside an outdated .gitkeep.
 *
 * Exits with a non-zero status and prints violations if any convention is
 * broken, so this can be run as a CI gate.
 */
import { readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const ROOT = new URL("..", import.meta.url).pathname;

const IGNORED_DIRS = new Set([
  "node_modules",
  ".git",
  ".github",
  ".turbo",
  "dist",
  "generated",
  "coverage",
]);

const TOP_LEVEL_SECTIONS = [
  "architecture",
  "chunking",
  "cloudflare-workers",
  "codex",
  "corpus",
  "docs",
  "home-assistant",
  "intake",
  "memory",
  "packages",
  "projects",
  "scripts",
  "workflows",
];

/** @type {string[]} */
const violations = [];

function listDir(dir) {
  return readdirSync(dir, { withFileTypes: true }).filter((entry) => !IGNORED_DIRS.has(entry.name));
}

for (const section of TOP_LEVEL_SECTIONS) {
  const dirPath = join(ROOT, section);
  let entries;
  try {
    entries = listDir(dirPath);
  } catch {
    violations.push(`Missing top-level section directory: ${section}/`);
    continue;
  }

  const hasReadme = entries.some((entry) => entry.name.toLowerCase() === "readme.md");
  if (!hasReadme) {
    violations.push(`${section}/ is missing a README.md`);
  }
}

// A directory with a .gitkeep alongside other real files/dirs means the
// placeholder is stale and should be removed.
function checkStaleGitkeep(dir, relativePath) {
  let entries;
  try {
    entries = listDir(dir);
  } catch {
    return;
  }

  const hasGitkeep = entries.some((entry) => entry.isFile() && entry.name === ".gitkeep");
  const hasOtherContent = entries.some(
    (entry) => !(entry.isFile() && (entry.name === ".gitkeep" || entry.name === "README.md")),
  );

  if (hasGitkeep && hasOtherContent) {
    violations.push(`${relativePath || "."}/ has a stale .gitkeep alongside real content`);
  }

  for (const entry of entries) {
    if (entry.isDirectory()) {
      checkStaleGitkeep(join(dir, entry.name), join(relativePath, entry.name));
    }
  }
}

for (const section of TOP_LEVEL_SECTIONS) {
  checkStaleGitkeep(join(ROOT, section), section);
}

if (violations.length > 0) {
  console.error("Repository structure validation failed:\n");
  for (const violation of violations) {
    console.error(`  - ${violation}`);
  }
  console.error(`\n${violations.length} violation(s) found.`);
  process.exit(1);
}

console.log("Repository structure validation passed.");
