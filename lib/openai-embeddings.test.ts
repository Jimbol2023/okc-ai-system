import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { createOpenAiEmbedding, getOpenAiEmbeddingConfig } from "@/lib/openai-embeddings";

describe("OpenAI embeddings boundary", () => {
  it("keeps embeddings disabled unless the explicit env flag and API key are present", () => {
    assert.deepEqual(getOpenAiEmbeddingConfig({}), {
      enabled: false,
      model: "text-embedding-3-small",
      reason: "openai_embeddings_disabled",
    });

    assert.deepEqual(getOpenAiEmbeddingConfig({ OPENAI_EMBEDDINGS_ENABLED: "true" }), {
      enabled: false,
      model: "text-embedding-3-small",
      reason: "openai_api_key_missing",
    });
  });

  it("does not call fetch when disabled", async () => {
    let called = false;
    const result = await createOpenAiEmbedding({
      input: "probate",
      env: {},
      fetchImpl: (async () => {
        called = true;
        return new Response("{}");
      }) as typeof fetch,
    });

    assert.equal(called, false);
    assert.equal(result.ok, false);
    assert.equal(result.providerCalled, false);
    assert.equal(result.semanticSearchUsed, false);
  });

  it("fails closed when the provider request fails", async () => {
    const result = await createOpenAiEmbedding({
      input: "probate",
      env: {
        OPENAI_API_KEY: "test-key",
        OPENAI_EMBEDDINGS_ENABLED: "true",
      },
      fetchImpl: (async () => new Response("{}", { status: 500 })) as typeof fetch,
    });

    assert.equal(result.ok, false);
    assert.equal(result.providerCalled, false);
    assert.equal(result.semanticSearchUsed, false);
  });

  it("returns a successful embedding only for valid provider responses", async () => {
    const result = await createOpenAiEmbedding({
      input: "probate",
      env: {
        OPENAI_API_KEY: "test-key",
        OPENAI_EMBEDDINGS_ENABLED: "true",
      },
      fetchImpl: (async () =>
        new Response(
          JSON.stringify({
            data: [{ embedding: [0.1, 0.2, 0.3] }],
            model: "text-embedding-3-small",
          }),
          { status: 200 },
        )) as typeof fetch,
    });

    assert.equal(result.ok, true);
    assert.equal(result.providerCalled, true);
    assert.equal(result.semanticSearchUsed, true);
  });
});
