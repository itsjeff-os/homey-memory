import fs from "node:fs";
import path from "node:path";
import { chunkHomeAssistantYaml } from "../pkg/chunkHomeAssistantYaml";

const inputPath = path.resolve(process.argv[2] || "./sleep_routine.yaml");
const outputPath = path.resolve("./ha_chunks.json");

const fileContent = fs.readFileSync(inputPath, "utf8");
const chunks = chunkHomeAssistantYaml(fileContent, path.basename(inputPath));

fs.writeFileSync(outputPath, JSON.stringify(chunks, null, 2), "utf8");

console.log(`Created ${chunks.length} chunks`);
console.log(`Saved to ${outputPath}`);

for (const chunk of chunks) {
  console.log(`- ${chunk.chunk_id}`);
}
