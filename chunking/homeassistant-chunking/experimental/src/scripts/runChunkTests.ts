import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { chunkHomeAssistantYamlWithDiagnostics } from "../pkg/chunkHomeAssistantYaml";
import { chunkHomeRegistry } from "../pkg/chunkHomeRegistry";
import { chunkMarkdownDocs } from "../pkg/chunkMarkdownDocs";
import { stableHash } from "../pkg/knowledgeChunk";

const root = process.cwd();

function read(relativePath: string): string {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

function yamlChunks(relativePath: string) {
  return chunkHomeAssistantYamlWithDiagnostics(
    read(relativePath),
    path.basename(relativePath),
    relativePath,
  );
}

function assertNoFatalParseErrors(relativePath: string) {
  const result = yamlChunks(relativePath);
  assert.equal(
    result.errors.length,
    0,
    `${relativePath} should parse without fatal errors`,
  );
  assert.ok(result.chunks.length > 0, `${relativePath} should produce chunks`);
  return result;
}

function assertCollection(
  relativePath: string,
  expectedCollection: string,
  predicate: (id: string) => boolean,
) {
  const result = assertNoFatalParseErrors(relativePath);
  const chunk = result.chunks.find((candidate) => predicate(candidate.id));
  assert.ok(chunk, `${relativePath} should include a matching chunk`);
  assert.equal(chunk.collection, expectedCollection);
  return chunk;
}

const automationResult = assertNoFatalParseErrors(
  "ha_cleaned_yaml/packages/lighting_automations.yaml",
);
assert.equal(automationResult.redactionWarnings.length, 0);
assert.ok(
  automationResult.chunks.every(
    (chunk) => chunk.collection === "home_ha_automations",
  ),
  "lighting automations should route to home_ha_automations",
);
assert.ok(
  automationResult.chunks.some((chunk) =>
    chunk.entities.includes("binary_sensor.fp2_openplan_room"),
  ),
  "automation chunks should extract entity references",
);

const helpersResult = assertNoFatalParseErrors(
  "ha_cleaned_yaml/packages/lighting_helpers.yaml",
);
assert.ok(
  helpersResult.chunks.every((chunk) => chunk.collection === "home_ha_reference"),
  "helpers should route to home_ha_reference",
);

const groupsResult = assertNoFatalParseErrors(
  "ha_cleaned_yaml/packages/light_groups.yaml",
);
assert.ok(
  groupsResult.chunks.every((chunk) => chunk.collection === "home_ha_reference"),
  "light groups should route to home_ha_reference",
);
assert.ok(
  groupsResult.chunks.some((chunk) =>
    chunk.entities.includes("light.ceiling_hallway_front"),
  ),
  "light group chunks should extract grouped entities",
);

const scriptChunk = assertCollection(
  "ha_cleaned_yaml/scripts/write_automation_and_reload.yaml",
  "home_ha_automations",
  (id) => id.includes("write_automation_and_reload"),
);
assert.deepEqual(
  scriptChunk.services,
  ["automation.reload", "shell_command.write_automation"],
);

const blueprintResult = assertNoFatalParseErrors(
  "ceiling_daily_rhythm_presence.yaml",
);
assert.equal(
  blueprintResult.warnings.filter((warning) =>
    warning.message.includes("Unresolved tag"),
  ).length,
  0,
  "!input tags should parse without unresolved tag warnings",
);
assert.ok(
  blueprintResult.chunks.some(
    (chunk) =>
      chunk.collection === "home_ha_automations" &&
      chunk.tags.includes("blueprint_input"),
  ),
  "blueprints should emit input chunks routed to home_ha_automations",
);
assert.ok(
  blueprintResult.chunks.some((chunk) => chunk.services.includes("light.turn_on")),
  "blueprint chunks should extract service calls",
);
assert.ok(
  blueprintResult.chunks.some((chunk) =>
    chunk.tags.includes("blueprint_behavior"),
  ),
  "blueprints should emit a separate behavior chunk",
);
assert.ok(
  blueprintResult.chunks.every(
    (chunk) =>
      !chunk.entities.includes("light.turn_on") &&
      !chunk.entities.includes("light.turn_off"),
  ),
  "service calls should not be misclassified as entities",
);
assert.ok(
  (blueprintResult.chunks.find((chunk) =>
    chunk.tags.includes("blueprint_overview"),
  )?.text.length ?? Infinity) < 3_000,
  "blueprint overview should stay compact and not contain the whole automation body",
);

const secretResult = chunkHomeAssistantYamlWithDiagnostics(
  [
    "automation:",
    "  - alias: Secret Redaction",
    "    trigger: []",
    "    action:",
    "      - service: notify.mobile_app",
    "        data:",
    "          token: !secret mobile_token",
    "          message: hello",
  ].join("\n"),
  "secret_test.yaml",
  "secret_test.yaml",
);
assert.equal(secretResult.errors.length, 0);
assert.equal(secretResult.redactionWarnings.length, 0);
assert.ok(
  secretResult.chunks[0]?.text.includes("[REDACTED]") ||
    secretResult.chunks[0]?.text.includes("!secret <redacted>"),
  "!secret and secret-like keys should be redacted",
);
assert.ok(
  !secretResult.chunks[0]?.text.includes("mobile_token"),
  "secret identifier should not leak into chunk text",
);

const registryResult = chunkHomeRegistry(
  read("home_registry.json"),
  "home_registry.json",
  "home_registry.json",
);
assert.equal(registryResult.errors.length, 0);
assert.ok(registryResult.chunks.length > 1);
assert.ok(
  registryResult.chunks.every((chunk) => chunk.collection === "home_registry"),
  "home_registry.json should route to home_registry",
);
assert.ok(
  registryResult.chunks.some((chunk) => chunk.rooms.includes("room.open_plan")),
  "registry chunks should expose room IDs",
);
assert.ok(
  registryResult.chunks.some((chunk) => chunk.entities.length > 0),
  "registry chunks should expose HA entities",
);

const roomsDocResult = chunkMarkdownDocs(
  read("Rooms/Rooms.md"),
  "Rooms.md",
  "Rooms/Rooms.md",
);
assert.equal(roomsDocResult.errors.length, 0);
assert.ok(
  roomsDocResult.chunks.every((chunk) => chunk.text.length >= 120),
  "doc chunker should merge heading-only fragments",
);

const jsonTextDocResult = chunkMarkdownDocs(
  read("Servers:Homelab /Homelab_mini_Server_extraction.txt"),
  "Homelab_mini_Server_extraction.txt",
  "Servers:Homelab /Homelab_mini_Server_extraction.txt",
);
assert.equal(jsonTextDocResult.errors.length, 0);
assert.ok(
  jsonTextDocResult.chunks.some(
    (chunk) => chunk.provenance.sourceType === "home_system_json_doc",
  ),
  "JSON-shaped text docs should be chunked structurally",
);

const historicalDocResult = chunkMarkdownDocs(
  read("ha_historical_context/execution_plan_adaptive_home_v_0.md"),
  "execution_plan_adaptive_home_v_0.md",
  "ha_historical_context/execution_plan_adaptive_home_v_0.md",
);
assert.ok(
  historicalDocResult.chunks.some((chunk) =>
    chunk.services.includes("light.turn_on"),
  ),
  "docs with YAML examples should expose service calls",
);
assert.ok(
  historicalDocResult.chunks.every(
    (chunk) =>
      !chunk.entities.includes("light.turn_on") &&
      !chunk.entities.includes("light.turn_off"),
  ),
  "docs should not misclassify service calls as entities",
);

const firstIdRun = yamlChunks(
  "ha_cleaned_yaml/packages/lighting_automations.yaml",
).chunks.map((chunk) => chunk.id);
const secondIdRun = yamlChunks(
  "ha_cleaned_yaml/packages/lighting_automations.yaml",
).chunks.map((chunk) => chunk.id);
assert.deepEqual(firstIdRun, secondIdRun, "chunk IDs should be stable");

const firstContentHashes = yamlChunks(
  "ha_cleaned_yaml/packages/lighting_automations.yaml",
).chunks.map((chunk) => stableHash(chunk.text));
const secondContentHashes = yamlChunks(
  "ha_cleaned_yaml/packages/lighting_automations.yaml",
).chunks.map((chunk) => chunk.contentHash);
assert.deepEqual(
  firstContentHashes,
  secondContentHashes,
  "content hashes should be deterministic hashes of chunk text",
);

console.log("Chunk tests passed");
