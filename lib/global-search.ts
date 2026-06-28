import { dashboardNavigationItems } from "@/lib/dashboard-navigation";
import { knowledgeDocReferences, type KnowledgeDocReference, type KnowledgeItemRecord } from "@/lib/knowledge";
import type { StoredLead } from "@/lib/leads-storage";

type MarketingDraftLike = {
  id: string;
  channel: string;
  topic: string;
  sourceLabel: string;
  status: string;
  draftCopy: string;
  assetNotes: string | null;
};

export type GlobalSearchSourceType = "lead" | "property" | "knowledge" | "sop" | "marketing" | "navigation";

export type GlobalSearchResult = {
  id: string;
  title: string;
  subtitle: string;
  sourceType: GlobalSearchSourceType;
  href: string;
  score: number;
  matchReasons: string[];
  providerCalled: false;
  generatedPropertyFacts: false;
};

export type GlobalSearchResponse = {
  ok: true;
  query: string;
  results: GlobalSearchResult[];
  providerCalled: false;
  outreachSent: false;
  generatedPropertyFacts: false;
};

type SearchDocument = {
  id: string;
  title: string;
  subtitle: string;
  sourceType: GlobalSearchSourceType;
  href: string;
  fields: {
    title: string;
    keywords: string;
    body: string;
  };
};

const synonyms: Record<string, string[]> = {
  probate: ["probate", "inherited", "estate", "heir", "executor"],
  "follow-up": ["follow-up", "follow up", "seller call", "reply", "contact", "timing"],
  followup: ["follow-up", "follow up", "seller call", "reply", "contact", "timing"],
  offer: ["offer", "checklist", "valuation", "motivation", "contract"],
  marketing: ["marketing", "campaign", "landing page", "video", "social", "gbp"],
};

export function normalizeGlobalSearchQuery(query: string) {
  return query.trim().replace(/\s+/g, " ");
}

function getTerms(query: string) {
  const baseTerms = normalizeGlobalSearchQuery(query)
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean);
  const expanded = new Set(baseTerms);

  baseTerms.forEach((term) => {
    synonyms[term]?.forEach((synonym) => expanded.add(synonym));
  });

  return [...expanded];
}

function stringifyTags(tags: unknown) {
  if (Array.isArray(tags)) return tags.filter((tag): tag is string => typeof tag === "string").join(" ");
  if (typeof tags === "string") return tags;

  return "";
}

function scoreDocument(document: SearchDocument, query: string, terms: string[]) {
  const normalizedQuery = query.toLowerCase();
  const title = document.fields.title.toLowerCase();
  const keywords = document.fields.keywords.toLowerCase();
  const body = document.fields.body.toLowerCase();
  const matchReasons = new Set<string>();
  let score = 0;

  if (title.includes(normalizedQuery)) {
    score += 30;
    matchReasons.add("Matched title");
  }

  if (keywords.includes(normalizedQuery)) {
    score += 20;
    matchReasons.add("Matched category or tag");
  }

  if (body.includes(normalizedQuery)) {
    score += 12;
    matchReasons.add("Matched summary");
  }

  terms.forEach((term) => {
    if (title.includes(term)) {
      score += 8;
      matchReasons.add("Matched title");
    }

    if (keywords.includes(term)) {
      score += 5;
      matchReasons.add("Matched category or tag");
    }

    if (body.includes(term)) {
      score += 2;
      matchReasons.add("Matched content");
    }
  });

  if (terms.length > 1 && terms.every((term) => `${title} ${keywords} ${body}`.includes(term))) {
    score += 10;
    matchReasons.add("Matched multiple terms");
  }

  if (document.sourceType === "navigation") score += 3;

  return {
    matchReasons: [...matchReasons],
    score,
  };
}

function buildKnowledgeDocuments(items: KnowledgeItemRecord[], docReferences: KnowledgeDocReference[]) {
  const itemDocuments: SearchDocument[] = items.map((item) => ({
    id: `knowledge:${item.id}`,
    title: item.title,
    subtitle: `${item.category} / ${item.status}`,
    sourceType: item.category === "sop" ? "sop" : "knowledge",
    href: "/dashboard/knowledge",
    fields: {
      title: item.title,
      keywords: `${item.category} ${item.status} ${stringifyTags(item.tags)}`,
      body: item.content,
    },
  }));
  const referenceDocuments: SearchDocument[] = docReferences.map((doc) => ({
    id: `doc:${doc.path}`,
    title: doc.title,
    subtitle: `${doc.category} / ${doc.path}`,
    sourceType: doc.category === "sop" ? "sop" : "knowledge",
    href: "/dashboard/knowledge",
    fields: {
      title: doc.title,
      keywords: `${doc.category} ${doc.path}`,
      body: doc.summary,
    },
  }));

  return [...itemDocuments, ...referenceDocuments];
}

function buildLeadDocuments(leads: StoredLead[]) {
  return leads.flatMap((lead): SearchDocument[] => {
    const leadName = [lead.firstName, lead.lastName].filter(Boolean).join(" ").trim() || lead.ownerName || "Lead";
    const leadDocument: SearchDocument = {
      id: `lead:${lead.id}`,
      title: leadName,
      subtitle: `${lead.status} / ${lead.source || "unknown source"} / ${lead.propertyAddress || "No property address"}`,
      sourceType: "lead",
      href: "/dashboard/leads",
      fields: {
        title: leadName,
        keywords: `${lead.source} ${lead.status} ${lead.priority} ${lead.opportunityScore}`,
        body: [lead.email, lead.phone, lead.propertyAddress, lead.ownerName, lead.situationDetails, lead.lastSellerReply, lead.county, lead.parcelId].filter(Boolean).join(" "),
      },
    };
    const propertyDocument: SearchDocument | null = lead.propertyAddress
      ? {
          id: `property:${lead.id}`,
          title: lead.propertyAddress,
          subtitle: `${lead.city || "Unknown city"}, ${lead.state || "OK"} / ${lead.source || "unknown source"}`,
          sourceType: "property",
          href: "/dashboard/properties",
          fields: {
            title: lead.propertyAddress,
            keywords: `${lead.city} ${lead.state} ${lead.zipCode} ${lead.county} ${lead.source}`,
            body: [lead.ownerName, lead.mailingAddress, lead.situationDetails, lead.parcelId].filter(Boolean).join(" "),
          },
        }
      : null;

    return propertyDocument ? [leadDocument, propertyDocument] : [leadDocument];
  });
}

function buildMarketingDocuments(marketingDrafts: MarketingDraftLike[]) {
  return marketingDrafts.map((draft): SearchDocument => ({
    id: `marketing:${draft.id}`,
    title: draft.topic,
    subtitle: `${draft.channel} / ${draft.status} / ${draft.sourceLabel}`,
    sourceType: "marketing",
    href: "/dashboard/marketing",
    fields: {
      title: draft.topic,
      keywords: `${draft.channel} ${draft.status} ${draft.sourceLabel}`,
      body: [draft.draftCopy, draft.assetNotes].filter(Boolean).join(" "),
    },
  }));
}

function buildNavigationDocuments() {
  return dashboardNavigationItems.map((item): SearchDocument => ({
    id: `navigation:${item.href}`,
    title: item.label,
    subtitle: item.href,
    sourceType: "navigation",
    href: item.href,
    fields: {
      title: item.label,
      keywords: item.keywords.join(" "),
      body: item.href,
    },
  }));
}

export function searchGlobalRecords({
  query,
  leads,
  knowledgeItems,
  docReferences = knowledgeDocReferences,
  marketingDrafts,
  limit = 12,
}: {
  query: string;
  leads: StoredLead[];
  knowledgeItems: KnowledgeItemRecord[];
  docReferences?: KnowledgeDocReference[];
  marketingDrafts: MarketingDraftLike[];
  limit?: number;
}): GlobalSearchResponse {
  const normalizedQuery = normalizeGlobalSearchQuery(query);
  const terms = getTerms(normalizedQuery);
  const documents = [
    ...buildNavigationDocuments(),
    ...buildLeadDocuments(leads),
    ...buildKnowledgeDocuments(knowledgeItems, docReferences),
    ...buildMarketingDocuments(marketingDrafts),
  ];
  const results = documents
    .map((document) => {
      const score = scoreDocument(document, normalizedQuery, terms);

      return {
        ...document,
        ...score,
      };
    })
    .filter((result) => result.score > 0)
    .sort((a, b) => b.score - a.score || a.title.localeCompare(b.title))
    .slice(0, limit)
    .map((result): GlobalSearchResult => ({
      id: result.id,
      title: result.title,
      subtitle: result.subtitle,
      sourceType: result.sourceType,
      href: result.href,
      score: result.score,
      matchReasons: result.matchReasons,
      providerCalled: false,
      generatedPropertyFacts: false,
    }));

  return {
    ok: true,
    query: normalizedQuery,
    results,
    providerCalled: false,
    outreachSent: false,
    generatedPropertyFacts: false,
  };
}
