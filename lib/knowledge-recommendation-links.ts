import { knowledgeDocReferences, type KnowledgeItemRecord } from "@/lib/knowledge";

export type RecommendationKnowledgeLink = {
  title: string;
  category: string;
  href: "/dashboard/knowledge";
  detail: string;
  source: "knowledge_item" | "doc_reference";
};

type LinkCandidate = RecommendationKnowledgeLink & {
  score: number;
};

const TOPIC_KEYWORDS: Record<string, string[]> = {
  follow_up: ["follow", "contact", "seller", "sales", "reply", "timing", "conversation"],
  marketing: ["marketing", "channel", "source", "facebook", "google", "social", "content", "profile"],
  probate: ["probate", "inherited", "estate", "heir"],
  provider_readiness: ["provider", "readiness", "credential", "cloudflare", "twilio", "resend", "api"],
  finance: ["finance", "cost", "cpl", "cpa", "cash", "revenue", "profit"],
  operations: ["closing", "contract", "operation", "blocker", "approval", "manual"],
};

function normalizeText(value: string) {
  return value.toLowerCase();
}

function getTopics(text: string) {
  const normalized = normalizeText(text);

  return Object.entries(TOPIC_KEYWORDS)
    .filter(([, keywords]) => keywords.some((keyword) => normalized.includes(keyword)))
    .map(([topic]) => topic);
}

function scoreTextForTopics(text: string, topics: string[]) {
  const normalized = normalizeText(text);

  return topics.reduce((score, topic) => {
    const keywords = TOPIC_KEYWORDS[topic] ?? [];

    return score + keywords.filter((keyword) => normalized.includes(keyword)).length;
  }, 0);
}

function tagsToText(tags: unknown) {
  return Array.isArray(tags)
    ? tags.filter((tag): tag is string => typeof tag === "string").join(" ")
    : "";
}

function getDocCandidates(topics: string[]): LinkCandidate[] {
  return knowledgeDocReferences
    .map((doc): LinkCandidate => {
      const text = `${doc.title} ${doc.category} ${doc.summary} ${doc.path}`;

      return {
        title: doc.title,
        category: doc.category,
        href: "/dashboard/knowledge",
        detail: doc.summary,
        source: "doc_reference",
        score: scoreTextForTopics(text, topics),
      };
    })
    .filter((candidate) => candidate.score > 0);
}

function getItemCandidates(items: KnowledgeItemRecord[], topics: string[]): LinkCandidate[] {
  return items
    .filter((item) => item.status === "active")
    .map((item): LinkCandidate => {
      const text = `${item.title} ${item.category} ${item.content} ${tagsToText(item.tags)}`;

      return {
        title: item.title,
        category: item.category,
        href: "/dashboard/knowledge",
        detail: `Knowledge Hub item from ${item.source}.`,
        source: "knowledge_item",
        score: scoreTextForTopics(text, topics),
      };
    })
    .filter((candidate) => candidate.score > 0);
}

export function findRecommendationKnowledgeLinks({
  text,
  knowledgeItems,
  limit = 3,
}: {
  text: string;
  knowledgeItems: KnowledgeItemRecord[];
  limit?: number;
}): RecommendationKnowledgeLink[] {
  const topics = getTopics(text);

  if (topics.length === 0) return [];

  const seen = new Set<string>();

  return [...getItemCandidates(knowledgeItems, topics), ...getDocCandidates(topics)]
    .sort((a, b) => b.score - a.score || a.title.localeCompare(b.title))
    .filter((candidate) => {
      const key = `${candidate.source}:${candidate.title}`;

      if (seen.has(key)) return false;

      seen.add(key);
      return true;
    })
    .slice(0, limit)
    .map((candidate) => ({
      title: candidate.title,
      category: candidate.category,
      href: candidate.href,
      detail: candidate.detail,
      source: candidate.source,
    }));
}

export function getKnownRecommendationTopics(text: string) {
  return getTopics(text);
}
