import { createHash } from "node:crypto";

import type { Prisma } from "@/generated/prisma";

import { knowledgeDocReferences, listKnowledgeItems, type KnowledgeDocReference, type KnowledgeItemRecord } from "@/lib/knowledge";
import { createOpenAiEmbedding } from "@/lib/openai-embeddings";
import { prisma } from "@/lib/prisma";

export type KnowledgeSearchSourceType = "knowledge_item" | "doc_reference";

export type KnowledgeSearchResult = {
  title: string;
  category: string;
  sourceType: KnowledgeSearchSourceType;
  sourceId: string;
  snippet: string;
  score: number;
  href: "/dashboard/knowledge";
  providerCalled: boolean;
  semanticSearchUsed: boolean;
  matchReasons: string[];
};

export type KnowledgeSearchResponse = {
  ok: true;
  query: string;
  results: KnowledgeSearchResult[];
  providerCalled: boolean;
  semanticSearchUsed: boolean;
  semanticSearchReason: string;
  safetyFlags: {
    internalSearch: true;
    providerOptional: true;
    generatedPropertyFacts: false;
    outreachSent: false;
    providerActivationAllowed: false;
  };
};

type KnowledgeSearchDocument = {
  sourceType: KnowledgeSearchSourceType;
  sourceId: string;
  title: string;
  category: string;
  content: string;
  tags: string[];
  status: string;
  path?: string;
  summary?: string;
};

type KnowledgeSearchEmbeddingRecord = {
  sourceType: string;
  sourceId: string;
  contentHash: string;
  embedding: Prisma.JsonValue;
  model: string;
  dimensions: number;
};

type KnowledgeSearchEmbeddingDelegate = {
  findMany(args?: unknown): Promise<KnowledgeSearchEmbeddingRecord[]>;
  upsert(args: unknown): Promise<KnowledgeSearchEmbeddingRecord>;
};

const QUERY_MAX_LENGTH = 120;
const RESULT_LIMIT = 12;

const SYNONYMS: Record<string, string[]> = {
  probate: ["inherited", "estate", "heir", "executor"],
  inherited: ["probate", "estate", "heir", "executor"],
  "follow-up": ["seller", "call", "reply", "contact", "timing"],
  followup: ["seller", "call", "reply", "contact", "timing"],
  offer: ["checklist", "valuation", "motivation", "contract"],
  marketing: ["campaign", "landing", "page", "video", "social", "gbp"],
};

function getEmbeddingDelegate() {
  return (prisma as unknown as { knowledgeSearchEmbedding: KnowledgeSearchEmbeddingDelegate }).knowledgeSearchEmbedding;
}

export function normalizeKnowledgeSearchQuery(query: string) {
  return query.trim().replace(/\s+/g, " ").slice(0, QUERY_MAX_LENGTH);
}

function tokenize(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .split(/\s+/)
    .map((term) => term.trim())
    .filter((term) => term.length >= 2);
}

function expandTerms(query: string) {
  const terms = tokenize(query);
  const expanded = new Set(terms);

  terms.forEach((term) => {
    SYNONYMS[term]?.forEach((synonym) => expanded.add(synonym));
  });

  return [...expanded];
}

function tagsToArray(tags: unknown) {
  return Array.isArray(tags)
    ? tags.filter((tag): tag is string => typeof tag === "string" && tag.trim().length > 0)
    : [];
}

function buildItemDocument(item: KnowledgeItemRecord): KnowledgeSearchDocument {
  const tags = tagsToArray(item.tags);

  return {
    sourceType: "knowledge_item",
    sourceId: item.id,
    title: item.title,
    category: item.category,
    content: item.content,
    tags,
    status: item.status,
  };
}

function buildDocReferenceDocument(doc: KnowledgeDocReference): KnowledgeSearchDocument {
  return {
    sourceType: "doc_reference",
    sourceId: doc.path,
    title: doc.title,
    category: doc.category,
    content: doc.summary,
    tags: [],
    status: "active",
    path: doc.path,
    summary: doc.summary,
  };
}

export function buildKnowledgeSearchDocuments({
  items,
  docReferences = knowledgeDocReferences,
}: {
  items: KnowledgeItemRecord[];
  docReferences?: KnowledgeDocReference[];
}) {
  return [...items.map(buildItemDocument), ...docReferences.map(buildDocReferenceDocument)];
}

function includesTerm(value: string, term: string) {
  return value.toLowerCase().includes(term.toLowerCase());
}

function getSnippet(document: KnowledgeSearchDocument, queryTerms: string[]) {
  const text = document.summary || document.content;
  const lower = text.toLowerCase();
  const matchedTerm = queryTerms.find((term) => lower.includes(term.toLowerCase()));

  if (!matchedTerm) {
    return text.slice(0, 220);
  }

  const index = Math.max(0, lower.indexOf(matchedTerm.toLowerCase()) - 70);

  return text.slice(index, index + 220);
}

function scoreDocument(document: KnowledgeSearchDocument, normalizedQuery: string, queryTerms: string[]) {
  const title = document.title.toLowerCase();
  const category = document.category.toLowerCase();
  const content = document.content.toLowerCase();
  const tags = document.tags.map((tag) => tag.toLowerCase());
  const path = document.path?.toLowerCase() ?? "";
  const query = normalizedQuery.toLowerCase();
  const matchReasons = new Set<string>();
  let score = 0;

  if (title.includes(query)) {
    score += 80;
    matchReasons.add("Matched title");
  }

  if (content.includes(query)) {
    score += 40;
    matchReasons.add(document.sourceType === "doc_reference" ? "Matched summary" : "Matched content");
  }

  if (category.includes(query)) {
    score += 30;
    matchReasons.add("Matched category");
  }

  if (tags.some((tag) => tag.includes(query))) {
    score += 45;
    matchReasons.add("Matched tag");
  }

  queryTerms.forEach((term) => {
    if (includesTerm(document.title, term)) {
      score += 18;
      matchReasons.add("Matched title");
    }

    if (tags.some((tag) => includesTerm(tag, term))) {
      score += 14;
      matchReasons.add("Matched tag");
    }

    if (includesTerm(document.category, term)) {
      score += 10;
      matchReasons.add("Matched category");
    }

    if (includesTerm(document.content, term)) {
      score += 8;
      matchReasons.add(document.sourceType === "doc_reference" ? "Matched summary" : "Matched content");
    }

    if (includesTerm(path, term)) {
      score += 7;
      matchReasons.add("Matched path");
    }
  });

  const directTerms = tokenize(normalizedQuery);
  const directMatches = directTerms.filter((term) => `${title} ${category} ${content} ${tags.join(" ")} ${path}`.includes(term)).length;

  if (directMatches > 1) {
    score += directMatches * 8;
    matchReasons.add("Matched multiple terms");
  }

  if (document.status === "active") {
    score += 10;
  } else if (document.status === "archived") {
    score -= 10;
  }

  return {
    score,
    matchReasons: [...matchReasons],
  };
}

export function searchKnowledgeDocuments({
  query,
  documents,
  limit = RESULT_LIMIT,
}: {
  query: string;
  documents: KnowledgeSearchDocument[];
  limit?: number;
}): KnowledgeSearchResult[] {
  const normalizedQuery = normalizeKnowledgeSearchQuery(query);
  const queryTerms = expandTerms(normalizedQuery);

  if (!normalizedQuery || queryTerms.length === 0) return [];

  return documents
    .map((document) => {
      const scored = scoreDocument(document, normalizedQuery, queryTerms);

      return {
        title: document.title,
        category: document.category,
        sourceType: document.sourceType,
        sourceId: document.sourceId,
        snippet: getSnippet(document, queryTerms),
        score: scored.score,
        href: "/dashboard/knowledge" as const,
        providerCalled: false,
        semanticSearchUsed: false,
        matchReasons: scored.matchReasons,
      };
    })
    .filter((result) => result.score > 0)
    .sort((a, b) => b.score - a.score || a.title.localeCompare(b.title))
    .slice(0, limit);
}

function getDocumentText(document: KnowledgeSearchDocument) {
  return [document.title, document.category, document.tags.join(" "), document.path, document.summary, document.content]
    .filter(Boolean)
    .join("\n");
}

function getContentHash(document: KnowledgeSearchDocument) {
  return createHash("sha256").update(getDocumentText(document)).digest("hex");
}

function asEmbedding(value: Prisma.JsonValue): number[] | null {
  if (!Array.isArray(value) || !value.every((item) => typeof item === "number" && Number.isFinite(item))) {
    return null;
  }

  return value.map((item) => Number(item));
}

function cosineSimilarity(a: number[], b: number[]) {
  if (a.length === 0 || b.length === 0 || a.length !== b.length) return 0;

  let dot = 0;
  let magnitudeA = 0;
  let magnitudeB = 0;

  a.forEach((value, index) => {
    dot += value * b[index];
    magnitudeA += value * value;
    magnitudeB += b[index] * b[index];
  });

  if (magnitudeA === 0 || magnitudeB === 0) return 0;

  return dot / (Math.sqrt(magnitudeA) * Math.sqrt(magnitudeB));
}

function mergeSemanticResults({
  keywordResults,
  documents,
  records,
  queryEmbedding,
}: {
  keywordResults: KnowledgeSearchResult[];
  documents: KnowledgeSearchDocument[];
  records: KnowledgeSearchEmbeddingRecord[];
  queryEmbedding: number[];
}) {
  const byKey = new Map(keywordResults.map((result) => [`${result.sourceType}:${result.sourceId}`, result]));
  const docsByKey = new Map(documents.map((document) => [`${document.sourceType}:${document.sourceId}`, document]));

  records.forEach((record) => {
    const embedding = asEmbedding(record.embedding);
    const document = docsByKey.get(`${record.sourceType}:${record.sourceId}`);

    if (!embedding || !document) return;

    const semanticScore = Math.round(cosineSimilarity(queryEmbedding, embedding) * 100);

    if (semanticScore <= 0) return;

    const key = `${document.sourceType}:${document.sourceId}`;
    const existing = byKey.get(key);

    if (existing) {
      existing.score += semanticScore;
      existing.semanticSearchUsed = true;
      existing.matchReasons = [...new Set([...existing.matchReasons, "Semantic match"])];
      return;
    }

    byKey.set(key, {
      title: document.title,
      category: document.category,
      sourceType: document.sourceType,
      sourceId: document.sourceId,
      snippet: getSnippet(document, tokenize(document.title)),
      score: semanticScore,
      href: "/dashboard/knowledge",
      providerCalled: false,
      semanticSearchUsed: true,
      matchReasons: ["Semantic match"],
    });
  });

  return [...byKey.values()]
    .sort((a, b) => b.score - a.score || a.title.localeCompare(b.title))
    .slice(0, RESULT_LIMIT);
}

async function getStoredEmbeddings(model: string) {
  return getEmbeddingDelegate().findMany({
    where: {
      model,
    },
  });
}

export async function searchKnowledge({
  query,
}: {
  query: string;
}): Promise<KnowledgeSearchResponse> {
  const normalizedQuery = normalizeKnowledgeSearchQuery(query);
  const items = await listKnowledgeItems();
  const documents = buildKnowledgeSearchDocuments({ items });
  const keywordResults = searchKnowledgeDocuments({
    query: normalizedQuery,
    documents,
  });
  const embedding = await createOpenAiEmbedding({
    input: normalizedQuery,
  });

  if (!embedding.ok) {
    return {
      ok: true,
      query: normalizedQuery,
      results: keywordResults,
      providerCalled: false,
      semanticSearchUsed: false,
      semanticSearchReason: embedding.reason,
      safetyFlags: {
        internalSearch: true,
        providerOptional: true,
        generatedPropertyFacts: false,
        outreachSent: false,
        providerActivationAllowed: false,
      },
    };
  }

  const storedEmbeddings = await getStoredEmbeddings(embedding.model);
  const results = mergeSemanticResults({
    keywordResults,
    documents,
    records: storedEmbeddings,
    queryEmbedding: embedding.embedding,
  });

  return {
    ok: true,
    query: normalizedQuery,
    results,
    providerCalled: embedding.providerCalled,
    semanticSearchUsed: true,
    semanticSearchReason: "semantic_search_enabled",
    safetyFlags: {
      internalSearch: true,
      providerOptional: true,
      generatedPropertyFacts: false,
      outreachSent: false,
      providerActivationAllowed: false,
    },
  };
}

export async function indexKnowledgeSearchEmbeddings({
  sourceType,
  sourceId,
}: {
  sourceType?: KnowledgeSearchSourceType;
  sourceId?: string;
} = {}) {
  const items = await listKnowledgeItems();
  const documents = buildKnowledgeSearchDocuments({ items }).filter((document) => {
    if (sourceType && document.sourceType !== sourceType) return false;
    if (sourceId && document.sourceId !== sourceId) return false;

    return true;
  });
  const indexed: Array<{ sourceType: KnowledgeSearchSourceType; sourceId: string; model: string; dimensions: number }> = [];
  let providerCalled = false;
  let skippedReason = "";

  for (const document of documents) {
    const embedding = await createOpenAiEmbedding({
      input: getDocumentText(document),
    });

    if (!embedding.ok) {
      skippedReason = embedding.reason;
      continue;
    }

    providerCalled = true;

    await getEmbeddingDelegate().upsert({
      where: {
        sourceType_sourceId: {
          sourceType: document.sourceType,
          sourceId: document.sourceId,
        },
      },
      update: {
        contentHash: getContentHash(document),
        embedding: embedding.embedding,
        model: embedding.model,
        dimensions: embedding.dimensions,
      },
      create: {
        sourceType: document.sourceType,
        sourceId: document.sourceId,
        contentHash: getContentHash(document),
        embedding: embedding.embedding,
        model: embedding.model,
        dimensions: embedding.dimensions,
      },
    });

    indexed.push({
      sourceType: document.sourceType,
      sourceId: document.sourceId,
      model: embedding.model,
      dimensions: embedding.dimensions,
    });
  }

  return {
    ok: indexed.length > 0,
    indexed,
    totalCandidates: documents.length,
    providerCalled,
    semanticSearchUsed: false,
    reason: indexed.length > 0 ? "indexed" : skippedReason || "no_documents_indexed",
  };
}
