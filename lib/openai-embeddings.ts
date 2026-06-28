export type OpenAiEmbeddingConfig = {
  enabled: boolean;
  model: string;
  reason?: string;
};

export type OpenAiEmbeddingResult =
  | {
      ok: true;
      embedding: number[];
      model: string;
      dimensions: number;
      providerCalled: true;
      semanticSearchUsed: true;
    }
  | {
      ok: false;
      reason: string;
      model: string;
      providerCalled: false;
      semanticSearchUsed: false;
    };

const DEFAULT_EMBEDDING_MODEL = "text-embedding-3-small";
const OPENAI_EMBEDDINGS_URL = "https://api.openai.com/v1/embeddings";

function hasUsableValue(value: string | undefined) {
  const trimmed = value?.trim();

  return Boolean(trimmed && !trimmed.includes("replace-with") && !trimmed.includes("your-"));
}

export function getOpenAiEmbeddingConfig(env: NodeJS.ProcessEnv = process.env): OpenAiEmbeddingConfig {
  const enabledFlag = env.OPENAI_EMBEDDINGS_ENABLED === "true";
  const hasApiKey = hasUsableValue(env.OPENAI_API_KEY);

  if (!enabledFlag) {
    return {
      enabled: false,
      model: env.OPENAI_EMBEDDING_MODEL?.trim() || DEFAULT_EMBEDDING_MODEL,
      reason: "openai_embeddings_disabled",
    };
  }

  if (!hasApiKey) {
    return {
      enabled: false,
      model: env.OPENAI_EMBEDDING_MODEL?.trim() || DEFAULT_EMBEDDING_MODEL,
      reason: "openai_api_key_missing",
    };
  }

  return {
    enabled: true,
    model: env.OPENAI_EMBEDDING_MODEL?.trim() || DEFAULT_EMBEDDING_MODEL,
  };
}

function isEmbedding(value: unknown): value is number[] {
  return Array.isArray(value) && value.length > 0 && value.every((item) => typeof item === "number" && Number.isFinite(item));
}

export async function createOpenAiEmbedding({
  input,
  env = process.env,
  fetchImpl = fetch,
}: {
  input: string;
  env?: NodeJS.ProcessEnv;
  fetchImpl?: typeof fetch;
}): Promise<OpenAiEmbeddingResult> {
  const config = getOpenAiEmbeddingConfig(env);

  if (!config.enabled) {
    return {
      ok: false,
      reason: config.reason ?? "openai_embeddings_disabled",
      model: config.model,
      providerCalled: false,
      semanticSearchUsed: false,
    };
  }

  try {
    const response = await fetchImpl(OPENAI_EMBEDDINGS_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        input,
        model: config.model,
      }),
    });

    if (!response.ok) {
      return {
        ok: false,
        reason: "openai_embedding_request_failed",
        model: config.model,
        providerCalled: false,
        semanticSearchUsed: false,
      };
    }

    const payload = (await response.json()) as {
      data?: Array<{
        embedding?: unknown;
      }>;
      model?: string;
    };
    const embedding = payload.data?.[0]?.embedding;

    if (!isEmbedding(embedding)) {
      return {
        ok: false,
        reason: "openai_embedding_response_invalid",
        model: payload.model ?? config.model,
        providerCalled: false,
        semanticSearchUsed: false,
      };
    }

    return {
      ok: true,
      embedding,
      model: payload.model ?? config.model,
      dimensions: embedding.length,
      providerCalled: true,
      semanticSearchUsed: true,
    };
  } catch (error) {
    console.error("OpenAI embedding request failed closed:", error);

    return {
      ok: false,
      reason: "openai_embedding_request_failed_closed",
      model: config.model,
      providerCalled: false,
      semanticSearchUsed: false,
    };
  }
}
