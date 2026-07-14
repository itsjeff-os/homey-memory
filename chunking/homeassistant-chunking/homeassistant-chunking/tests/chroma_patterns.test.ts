import { describe, expect, it } from 'vitest';
import { ChromaPatternsClient } from '../packages/substrates/chroma_patterns/client';

function jsonResponse(body: unknown): Response {
  return {
    ok: true,
    status: 200,
    json: async () => body,
    text: async () => JSON.stringify(body)
  } as Response;
}

describe('ChromaPatternsClient', () => {
  it('queries an entity against the automation collection with metadata includes', async () => {
    const calls: Array<{ url: string; init: RequestInit }> = [];
    const client = new ChromaPatternsClient({
      url: 'https://api.trychroma.com',
      apiKey: 'test-key',
      tenant: 'tenant-1',
      database: 'home',
      collectionIds: {
        home_ha_automations: 'auto-id'
      },
      fetchImpl: async (url, init) => {
        calls.push({ url: String(url), init: init ?? {} });
        return jsonResponse({
          ids: [['chunk-1']],
          documents: [['doc']],
          metadatas: [[{ source_path: 'script.test' }]],
          distances: [[0.1]]
        });
      }
    });

    const result = await client.queryByEntity('light.kitchen', { queryEmbedding: [0.1, 0.2] });

    expect(result.collection).toBe('home_ha_automations');
    expect(result.ids).toEqual([['chunk-1']]);
    expect(calls[0].url).toBe('https://api.trychroma.com/api/v2/tenants/tenant-1/databases/home/collections/auto-id/query');
    expect((calls[0].init.headers as Headers).get('x-chroma-token')).toBe('test-key');
    const body = JSON.parse(String(calls[0].init.body));
    expect(body.query_embeddings).toEqual([[0.1, 0.2]]);
    expect(body.where_document).toEqual({ '$contains': 'light.kitchen' });
    expect(body.include).toEqual(['documents', 'metadatas', 'distances']);
  });

  it('resolves a collection id by name when ids are not configured', async () => {
    const calls: string[] = [];
    const client = new ChromaPatternsClient({
      url: 'http://localhost:8000',
      embedQuery: () => [0.3, 0.4],
      fetchImpl: async (url) => {
        calls.push(String(url));
        if (calls.length === 1) {
          return jsonResponse([{ id: 'docs-id', name: 'home_system_docs' }]);
        }
        return jsonResponse({ ids: [['doc-1']] });
      }
    });

    const result = await client.queryByIntent('network topology');

    expect(result.ids).toEqual([['doc-1']]);
    expect(calls[0]).toBe('http://localhost:8000/api/v2/tenants/default_tenant/databases/default_database/collections');
    expect(calls[1]).toBe('http://localhost:8000/api/v2/tenants/default_tenant/databases/default_database/collections/docs-id/query');
  });

  it('requires an embedding source for semantic queries', async () => {
    const client = new ChromaPatternsClient({
      url: 'http://localhost:8000',
      collectionIds: {
        home_system_docs: 'docs-id'
      },
      fetchImpl: async () => jsonResponse({ ids: [[]] })
    });

    await expect(client.queryByIntent('morning routine')).rejects.toThrow('requires queryEmbedding or config.embedQuery');
  });
});
