from __future__ import annotations

from pathlib import Path
import tempfile
import unittest

try:
    import yaml  # noqa: F401
except ImportError:  # pragma: no cover
    yaml = None

from packages.ingestion.cli import build_manifest, load_chunks
from packages.ingestion.chunkers.home_assistant_yaml import chunk_home_assistant_yaml
from packages.ingestion.upsert import upsert
from packages.ingestion.validation import validate_chunks

ROOT = Path(__file__).resolve().parents[1]
EXAMPLES = ROOT / "sources" / "home_assistant" / "raw" / "examples"


@unittest.skipIf(yaml is None, "PyYAML is required for Home Assistant ingestion tests")
class HomeAssistantIngestionTests(unittest.TestCase):
    def test_helpers_chunk_into_reference_collection(self) -> None:
        chunks = chunk_home_assistant_yaml(EXAMPLES / "helpers.yaml")

        self.assertEqual(len(chunks), 14)
        self.assertTrue(all(chunk.collection == "home_ha_reference" for chunk in chunks))
        self.assertIn("input_boolean", {chunk.provenance["object_type"] for chunk in chunks})
        self.assertTrue(all(chunk.content_hash for chunk in chunks))

    def test_scripts_classify_action_surface(self) -> None:
        chunks = chunk_home_assistant_yaml(EXAMPLES / "scripts.yaml")
        by_path = {chunk.source_path: chunk for chunk in chunks}

        self.assertEqual(by_path["shell_command.write_automation"].collection, "home_ha_reference")
        self.assertEqual(by_path["script.gpt_apply_automation"].collection, "home_ha_automations")
        self.assertIn("shell_command.write_automation", by_path["script.gpt_apply_automation"].services)
        self.assertIn("automation.reload", by_path["script.gpt_apply_automation"].services)

    def test_blueprint_supports_home_assistant_tags(self) -> None:
        chunks = chunk_home_assistant_yaml(EXAMPLES / "auto.room_presence_lighting_context.yml")

        self.assertEqual(len(chunks), 1)
        chunk = chunks[0]
        self.assertEqual(chunk.collection, "home_ha_automations")
        self.assertIn("adaptive_lighting.apply", chunk.services)
        self.assertIn("light.turn_off", chunk.services)
        self.assertIn("ha_tag:!input", chunk.tags)

    def test_custom_tags_and_secrets_are_redacted(self) -> None:
        with tempfile.TemporaryDirectory() as tmpdir:
            path = Path(tmpdir) / "tagged.yaml"
            path.write_text(
                """
automation:
  - alias: Tagged Secret Test
    trigger:
      - platform: state
        entity_id: !unknown_tag sensor.example
    action:
      - service: notify.mobile_app
        data:
          token: !secret mobile_token
          message: hello
""",
                encoding="utf-8",
            )

            chunks = chunk_home_assistant_yaml(path)

        self.assertEqual(len(chunks), 1)
        text = chunks[0].text
        self.assertIn("ha_tag:!unknown_tag", chunks[0].tags)
        self.assertIn("ha_tag:!secret", chunks[0].tags)
        self.assertNotIn("mobile_token", text)
        self.assertNotIn("token:", text.lower())
        self.assertIn("<redacted>", text)

    def test_chunk_ids_and_hashes_are_stable(self) -> None:
        first = chunk_home_assistant_yaml(EXAMPLES / "scripts.yaml")
        second = chunk_home_assistant_yaml(EXAMPLES / "scripts.yaml")

        self.assertEqual([chunk.chunk_id for chunk in first], [chunk.chunk_id for chunk in second])
        self.assertEqual([chunk.content_hash for chunk in first], [chunk.content_hash for chunk in second])

    def test_dry_run_manifest_counts_collections(self) -> None:
        chunks, warnings = load_chunks([str(EXAMPLES)])
        manifest = build_manifest("dry-run", chunks, warnings)

        self.assertEqual(manifest["errors"], [])
        self.assertEqual(manifest["collections"]["home_ha_automations"], 2)
        self.assertEqual(manifest["collections"]["home_ha_reference"], 15)
        self.assertEqual(manifest["chunk_count"], 17)

    def test_validation_detects_duplicate_ids(self) -> None:
        chunks = chunk_home_assistant_yaml(EXAMPLES / "scripts.yaml")
        report = validate_chunks([chunks[0], chunks[0]])

        self.assertFalse(report.ok)
        self.assertTrue(any("duplicate chunk_id" in error for error in report.errors))

    def test_upsert_groups_by_collection_and_uses_stable_ids(self) -> None:
        class FakeClient:
            def __init__(self) -> None:
                self.calls = []

            def upsert_collection(self, collection_name, ids, documents, metadatas, embeddings=None) -> None:
                self.calls.append((collection_name, ids, documents, metadatas, embeddings))

        chunks = chunk_home_assistant_yaml(EXAMPLES / "scripts.yaml")
        fake = FakeClient()

        result = upsert(chunks, client=fake, embedding_mode="hash")

        self.assertEqual(result.upserted, 2)
        self.assertEqual(result.collections["home_ha_reference"], 1)
        self.assertEqual(result.collections["home_ha_automations"], 1)
        self.assertEqual(len(fake.calls), 2)
        for _, ids, documents, metadatas, embeddings in fake.calls:
            self.assertEqual(len(ids), len(set(ids)))
            self.assertEqual(len(ids), len(documents))
            self.assertEqual(len(ids), len(metadatas))
            self.assertEqual(len(ids), len(embeddings))
            self.assertTrue(all(isinstance(metadata["entities"], str) for metadata in metadatas))


if __name__ == "__main__":
    unittest.main()
