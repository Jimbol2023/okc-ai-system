import { prisma } from "@/lib/prisma";
import { listKnowledgeItems } from "@/lib/knowledge";
import type { AgentContextQuery, KnowledgeCitationUsage, KnowledgeSensitivity, RegisterKnowledgeSourceInput } from "@/lib/validations/enterprise-knowledge";

export type KnowledgeSourceRecord = {
  id: string;
  tenantId: string;
  title: string;
  sourceType: string;
  sourceUri: string | null;
  owner: string;
  versionRef: string;
  approvalStatus: string;
  trustScore: number;
  qualityScore: number;
  license: string;
  provenance: string;
  categories: unknown;
  businessModule: string;
  visibility: string;
  sensitivity: KnowledgeSensitivity;
  freshnessStatus: string;
  reviewCadenceDays: number | null;
  staleAfter: Date | string | null;
  deprecatedAt: Date | string | null;
  replacementSourceId: string | null;
  lastIndexedAt: Date | string | null;
  updateHistory: unknown;
  qualitySignals: unknown;
  contradictionRisk: number;
  providerCalled: boolean;
  liveExecutionAllowed: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
};

export type KnowledgePackDefinition = {
  packKey: string;
  name: string;
  description: string;
  categories: string[];
  agentTypes: string[];
  businessModules: string[];
  minTrustScore: number;
  minQualityScore: number;
};

export type KnowledgeCitation = {
  sourceId: string;
  sourceType: string;
  versionRef: string;
  confidence: number;
  usageType: KnowledgeCitationUsage;
};

export type AgentKnowledgeContextItem = {
  sourceId: string;
  title: string;
  sourceType: string;
  versionRef: string;
  packKeys: string[];
  trustScore: number;
  qualityScore: number;
  sensitivity: KnowledgeSensitivity;
  relevanceScore: number;
  estimatedTokens: number;
  citation: KnowledgeCitation;
};

export type RevenueGraphNodeType = "seller" | "property" | "market" | "campaign" | "lead" | "decision" | "outcome" | "knowledge";
export type RevenueGraphRelationshipType = "owns" | "located_in" | "has_situation" | "generated" | "converted_by" | "informed_by" | "produced";

export type EnterpriseKnowledgeGraphNodeType =
  | RevenueGraphNodeType
  | "business"
  | "customer"
  | "department"
  | "document"
  | "project"
  | "person"
  | "task"
  | "source"
  | "pack"
  | "domain";

export type EnterpriseKnowledgeGraphRelationshipType =
  | RevenueGraphRelationshipType
  | "created_from"
  | "updated_from"
  | "approved_by"
  | "superseded_by"
  | "referenced_by"
  | "used_in"
  | "decision_history"
  | "belongs_to_domain";

export type RevenueGraphNodeInput = {
  nodeType: RevenueGraphNodeType;
  label: string;
  referenceId?: string;
  metadata?: Record<string, unknown>;
};

export type EnterpriseKnowledgeGraphNodeInput = Omit<RevenueGraphNodeInput, "nodeType"> & {
  nodeType: EnterpriseKnowledgeGraphNodeType;
};

export type RevenueGraphRelationshipInput = {
  from: RevenueGraphNodeInput;
  to: RevenueGraphNodeInput;
  relationshipType: RevenueGraphRelationshipType;
  sourceId: string;
  sourceType: string;
  versionRef: string;
  confidence: number;
  qualityScore: number;
  approvalStatus: "pending_review" | "approved" | "rejected";
  provenance: string;
};

export type EnterpriseKnowledgeGraphRelationshipInput = Omit<RevenueGraphRelationshipInput, "from" | "to" | "relationshipType"> & {
  from: EnterpriseKnowledgeGraphNodeInput;
  to: EnterpriseKnowledgeGraphNodeInput;
  relationshipType: EnterpriseKnowledgeGraphRelationshipType;
  domains?: string[];
};

export type KnowledgeLineageType = "created_from" | "updated_from" | "approved_by" | "superseded_by" | "referenced_by" | "used_in" | "decision_history";

export type KnowledgeLineageEventInput = {
  targetType: string;
  targetId: string;
  lineageType: KnowledgeLineageType;
  relatedType?: string;
  relatedId?: string;
  actorId?: string;
  provenance: string;
  decisionHistory?: unknown;
  safeMetadata?: Record<string, unknown>;
};

export type KnowledgeHealthInput = {
  targetType: string;
  targetId: string;
  approvalStatus: string;
  confidence?: number;
  qualityScore?: number;
  citationCount?: number;
  requiredCitationCount?: number;
  coverageSignals?: number;
  expectedCoverageSignals?: number;
  usageCount?: number;
  lastReferencedAt?: Date | string | null;
  staleAfter?: Date | string | null;
};

export type SemanticKnowledgeDocument = {
  id: string;
  title: string;
  content: string;
  sourceType: string;
  versionRef: string;
  qualityScore: number;
  confidence: number;
  approvalStatus: string;
  sensitivity: KnowledgeSensitivity;
  recommendedUse: string;
};

export type SemanticSearchResult = {
  sourceId: string;
  title: string;
  excerpt: string;
  score: number;
  qualityScore: number;
  confidence: number;
  versionRef: string;
  recommendedUse: string;
  citation: KnowledgeCitation;
};

export const revenueKnowledgePack: KnowledgePackDefinition = {
  packKey: "revenue_knowledge",
  name: "Revenue Knowledge Pack",
  description: "High-ROI seller, campaign, follow-up, source-attribution, and offer-readiness knowledge for revenue decisions.",
  categories: ["Inherited Property", "Out-of-State Owners", "Vacant Houses", "Probate Education", "Follow-up Scripts", "Objection Handling", "Offer Readiness", "Campaign Lessons", "Source Attribution"],
  agentTypes: ["marketing_ai", "sales_ai", "crm_ai", "executive_ai", "revenue_ai"],
  businessModules: ["enterprise", "real_estate"],
  minTrustScore: 60,
  minQualityScore: 60,
};

export const highRoiResearchLifecycleStages = [
  "research_draft",
  "approved",
  "knowledge_pack_candidate",
  "marketing_reference",
  "sales_reference",
  "coo_reference",
  "executive_brief_reference",
] as const;

export const enterpriseKnowledgeDomains = [
  { domainKey: "real_estate", name: "Real Estate", description: "Property, seller, buyer, market, acquisitions, and real estate operating knowledge." },
  { domainKey: "mortgage", name: "Mortgage", description: "Mortgage operations, lending, qualification, and borrower workflow knowledge." },
  { domainKey: "insurance", name: "Insurance", description: "Insurance product, risk, claims, and policy operating knowledge." },
  { domainKey: "accounting", name: "Accounting", description: "Accounting, bookkeeping, tax preparation, and financial operations knowledge." },
  { domainKey: "construction", name: "Construction", description: "Construction, renovation, estimates, vendors, and project execution knowledge." },
  { domainKey: "marketing", name: "Marketing", description: "Campaign, content, SEO, brand, channel, and creative performance knowledge." },
  { domainKey: "sales", name: "Sales", description: "Sales playbooks, follow-up, objections, CRM, and conversion knowledge." },
  { domainKey: "operations", name: "Operations", description: "SOPs, workflows, execution standards, and operating cadence knowledge." },
  { domainKey: "executive", name: "Executive", description: "Executive decisions, strategy, CEO agenda, and leadership memory." },
  { domainKey: "legal", name: "Legal", description: "Legal, compliance, contracts, and policy review knowledge." },
  { domainKey: "finance", name: "Finance", description: "Finance, capital allocation, KPIs, forecasts, and performance knowledge." },
  { domainKey: "healthcare", name: "Healthcare", description: "Healthcare operations, policy, compliance, and service knowledge." },
  { domainKey: "general_enterprise", name: "General Enterprise", description: "Cross-company AI Core knowledge that is not limited to one industry domain." },
] as const;

type KnowledgeSourceDelegate = {
  findMany(args?: unknown): Promise<KnowledgeSourceRecord[]>;
  findUnique(args: unknown): Promise<KnowledgeSourceRecord | null>;
  create(args: unknown): Promise<KnowledgeSourceRecord>;
};

type CountDelegate = {
  count(args?: unknown): Promise<number>;
  findMany(args?: unknown): Promise<unknown[]>;
};

type ExecutiveDecisionMemoryDelegate = {
  findMany(args?: unknown): Promise<unknown[]>;
  create(args: unknown): Promise<unknown>;
};

type UnifiedApprovalDelegate = {
  create(args: unknown): Promise<unknown>;
};

const DEFAULT_TENANT_ID = "default";

export const enterpriseKnowledgePacks: KnowledgePackDefinition[] = [
  { packKey: "ui_ux", name: "UI & UX Pack", description: "Design systems, accessibility, usability, and interface patterns.", categories: ["UI/UX", "Design Systems"], agentTypes: ["design_ai"], businessModules: ["enterprise"], minTrustScore: 60, minQualityScore: 60 },
  { packKey: "ai_engineering", name: "AI Engineering Pack", description: "AI architecture, agent patterns, prompt governance, and model integration guidance.", categories: ["AI Engineering", "Knowledge Management"], agentTypes: ["engineering_ai", "document_ai"], businessModules: ["enterprise"], minTrustScore: 65, minQualityScore: 60 },
  { packKey: "security", name: "Security Pack", description: "Zero Trust, governance, privacy, audit, RBAC, connector safety, and secure storage.", categories: ["Cybersecurity", "Observability"], agentTypes: ["security_ai"], businessModules: ["enterprise"], minTrustScore: 75, minQualityScore: 70 },
  { packKey: "marketing", name: "Marketing Pack", description: "Campaigns, content operations, creative briefs, SEO, and channel readiness.", categories: ["Marketing", "SEO", "Video Production"], agentTypes: ["marketing_ai", "creative_ai"], businessModules: ["enterprise", "real_estate"], minTrustScore: 60, minQualityScore: 60 },
  { packKey: "sales", name: "Sales Pack", description: "CRM, sales playbooks, conversion workflows, follow-up, and relationship intelligence.", categories: ["Sales", "CRM"], agentTypes: ["crm_ai", "revenue_ai"], businessModules: ["enterprise", "real_estate"], minTrustScore: 60, minQualityScore: 60 },
  { packKey: "real_estate", name: "Real Estate Pack", description: "Real estate business module knowledge, seller education, acquisitions, and local-market SOPs.", categories: ["Real Estate"], agentTypes: ["real_estate_ai", "acquisition_ai"], businessModules: ["real_estate"], minTrustScore: 60, minQualityScore: 60 },
  { packKey: "commerce", name: "E-commerce Pack", description: "Commerce workflows, catalog operations, buyer journeys, and conversion optimization.", categories: ["E-commerce"], agentTypes: ["commerce_ai"], businessModules: ["ecommerce"], minTrustScore: 60, minQualityScore: 60 },
  { packKey: "productivity", name: "Microsoft 365 & Google Workspace Pack", description: "Productivity-suite document, spreadsheet, email, calendar, and workspace patterns.", categories: ["Microsoft 365", "Google Workspace", "Documentation"], agentTypes: ["document_ai"], businessModules: ["enterprise"], minTrustScore: 60, minQualityScore: 60 },
  { packKey: "business_intelligence", name: "Business Intelligence Pack", description: "Analytics, KPI interpretation, executive briefings, finance, and decision support.", categories: ["Business Intelligence", "Analytics", "Finance"], agentTypes: ["executive_ai", "finance_ai"], businessModules: ["enterprise"], minTrustScore: 65, minQualityScore: 60 },
  { packKey: "automation_api", name: "API & Automation Pack", description: "API integration, workflow automation, DevOps, testing, observability, and connector patterns.", categories: ["API Integration", "Workflow Automation", "DevOps", "Testing"], agentTypes: ["engineering_ai", "automation_ai"], businessModules: ["enterprise"], minTrustScore: 65, minQualityScore: 60 },
  { packKey: "leadership", name: "Leadership & Executive Decision Pack", description: "Leadership operating rhythm, executive decisions, organizational memory, and strategy guidance.", categories: ["Leadership", "Executive Decision"], agentTypes: ["executive_ai"], businessModules: ["enterprise"], minTrustScore: 70, minQualityScore: 65 },
  revenueKnowledgePack,
];

const sensitivityRank: Record<KnowledgeSensitivity, number> = {
  public: 1,
  internal: 2,
  confidential: 3,
  restricted: 4,
  credential_adjacent: 5,
  prompt_library: 5,
  strategy_sensitive: 5,
};

function getKnowledgeSourceDelegate() {
  return (prisma as unknown as { knowledgeSource: KnowledgeSourceDelegate }).knowledgeSource;
}

function getCountDelegate(name: string) {
  return (prisma as unknown as Record<string, CountDelegate>)[name];
}

function getUnifiedApprovalDelegate() {
  return (prisma as unknown as { unifiedApprovalItem: UnifiedApprovalDelegate }).unifiedApprovalItem;
}

function getExecutiveDecisionMemoryDelegate() {
  return (prisma as unknown as { executiveDecisionMemory: ExecutiveDecisionMemoryDelegate }).executiveDecisionMemory;
}

function clampScore(value: number) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function asStringArray(value: unknown) {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
}

function tokenizeSearch(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .split(/\s+/)
    .map((term) => term.trim())
    .filter((term) => term.length >= 2);
}

function getExcerptAroundTerms(content: string, terms: string[], maxLength = 420) {
  const lower = content.toLowerCase();
  const matchedTerm = terms.find((term) => lower.includes(term));
  const start = matchedTerm ? Math.max(0, lower.indexOf(matchedTerm) - 120) : 0;

  return content.slice(start, start + maxLength).trim();
}

function daysUntil(value: Date | string | null | undefined) {
  if (!value) return null;
  const time = new Date(value).getTime();
  if (Number.isNaN(time)) return null;
  return Math.ceil((time - Date.now()) / (1000 * 60 * 60 * 24));
}

export function calculateKnowledgeSourceQualityScore(input: {
  categories: string[];
  provenance: string;
  license: string;
  approvalStatus: string;
  sensitivity: KnowledgeSensitivity;
  staleAfter?: string | Date | null;
  contradictionRisk?: number;
}) {
  const completeness = input.categories.length > 0 && input.provenance.trim().length >= 20 && input.license.trim().length >= 2 ? 20 : 10;
  const staleDays = daysUntil(input.staleAfter);
  const freshness = staleDays === null ? 12 : staleDays >= 30 ? 20 : staleDays >= 0 ? 12 : 4;
  const provenanceQuality = input.provenance.trim().length >= 80 ? 20 : input.provenance.trim().length >= 30 ? 14 : 6;
  const licenseClarity = /unknown|tbd|unclear/i.test(input.license) ? 5 : 15;
  const sensitivityPenalty = Math.max(0, sensitivityRank[input.sensitivity] - 2) * 3;
  const reviewStatus = input.approvalStatus === "approved" ? 15 : input.approvalStatus === "pending_review" ? 8 : 2;
  const contradictionPenalty = Math.min(20, Math.max(0, input.contradictionRisk ?? 0) * 0.2);

  return clampScore(completeness + freshness + provenanceQuality + licenseClarity + reviewStatus - sensitivityPenalty - contradictionPenalty);
}

export function estimateKnowledgeTokens(value: string) {
  return Math.max(1, Math.ceil(value.length / 4));
}

export function canRoleAccessSensitivity(role: string, sensitivity: KnowledgeSensitivity) {
  const normalizedRole = role.toLowerCase();
  if (normalizedRole.includes("admin") || normalizedRole.includes("security")) return true;
  if (["credential_adjacent", "prompt_library", "strategy_sensitive", "restricted"].includes(sensitivity)) return false;
  if (normalizedRole.includes("executive")) return ["public", "internal", "confidential"].includes(sensitivity);
  return ["public", "internal"].includes(sensitivity);
}

function sourceMatchesBusiness(source: KnowledgeSourceRecord, businessModule: string) {
  return source.visibility === "enterprise_shared" || source.businessModule === businessModule || source.businessModule === "enterprise";
}

export function normalizeKnowledgeDomains(domains: string[]) {
  const allowed = new Map<string, string>(enterpriseKnowledgeDomains.map((domain) => [domain.domainKey, domain.domainKey]));
  const displayToKey = new Map<string, string>(enterpriseKnowledgeDomains.map((domain) => [domain.name.toLowerCase(), domain.domainKey]));
  const normalized = domains
    .map((domain) => domain.trim().toLowerCase().replaceAll("&", "and").replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, ""))
    .map((domain) => allowed.get(domain) ?? displayToKey.get(domain.replaceAll("_", " ")) ?? "general_enterprise");

  return Array.from(new Set(normalized.length > 0 ? normalized : ["general_enterprise"]));
}

function getDomainNames(domainKeys: string[]) {
  const names = new Map<string, string>(enterpriseKnowledgeDomains.map((domain) => [domain.domainKey, domain.name]));
  return domainKeys.map((domainKey) => names.get(domainKey) ?? "General Enterprise");
}

function scoreSourceForTask(source: KnowledgeSourceRecord, task: string, agent: string) {
  const terms = `${task} ${agent}`.toLowerCase().split(/\s+/).filter(Boolean);
  const categories = asStringArray(source.categories).join(" ").toLowerCase();
  const searchable = `${source.title} ${source.sourceType} ${source.businessModule} ${categories}`.toLowerCase();
  const termScore = terms.reduce((total, term) => total + (searchable.includes(term) ? 8 : 0), 0);

  return clampScore(source.trustScore * 0.25 + source.qualityScore * 0.35 + termScore + (source.approvalStatus === "approved" ? 15 : 0));
}

function selectPackKeys(source: KnowledgeSourceRecord, agent: string, businessModule: string) {
  const categories = asStringArray(source.categories).map((category) => category.toLowerCase());
  const normalizedAgent = agent.toLowerCase();

  return enterpriseKnowledgePacks
    .filter((pack) => {
      const packCategories = pack.categories.map((category) => category.toLowerCase());
      const agentMatches = pack.agentTypes.some((agentType) => normalizedAgent.includes(agentType.replace("_ai", "")) || agentType === normalizedAgent);
      const moduleMatches = pack.businessModules.includes("enterprise") || pack.businessModules.includes(businessModule);
      const categoryMatches = categories.some((category) => packCategories.some((packCategory) => category.includes(packCategory.toLowerCase()) || packCategory.includes(category)));

      return moduleMatches && (agentMatches || categoryMatches);
    })
    .map((pack) => pack.packKey);
}

export function buildAgentKnowledgeContext(input: AgentContextQuery & { sources: KnowledgeSourceRecord[] }) {
  let tokenBudget = input.maxEstimatedTokens;
  const items: AgentKnowledgeContextItem[] = input.sources
    .filter((source) => source.approvalStatus === "approved")
    .filter((source) => source.providerCalled === false && source.liveExecutionAllowed === false)
    .filter((source) => sourceMatchesBusiness(source, input.businessModule))
    .filter((source) => canRoleAccessSensitivity(input.role, source.sensitivity))
    .map((source) => {
      const relevanceScore = scoreSourceForTask(source, input.task, input.agent);
      const estimatedTokens = estimateKnowledgeTokens(`${source.title} ${source.provenance} ${asStringArray(source.categories).join(" ")}`);

      return {
        sourceId: source.id,
        title: source.title,
        sourceType: source.sourceType,
        versionRef: source.versionRef,
        packKeys: selectPackKeys(source, input.agent, input.businessModule),
        trustScore: source.trustScore,
        qualityScore: source.qualityScore,
        sensitivity: source.sensitivity,
        relevanceScore,
        estimatedTokens,
        citation: {
          sourceId: source.id,
          sourceType: source.sourceType,
          versionRef: source.versionRef,
          confidence: Math.min(source.trustScore, source.qualityScore),
          usageType: "factual" as const,
        },
      };
    })
    .sort((a, b) => b.relevanceScore - a.relevanceScore || b.qualityScore - a.qualityScore);

  const selected: AgentKnowledgeContextItem[] = [];
  for (const item of items) {
    if (selected.length >= input.maxSources) break;
    if (item.estimatedTokens > tokenBudget && selected.length > 0) continue;
    selected.push(item);
    tokenBudget -= item.estimatedTokens;
  }

  return {
    ok: true,
    agent: input.agent,
    task: input.task,
    role: input.role,
    businessModule: input.businessModule,
    selected,
    citations: selected.map((item) => item.citation),
    budget: {
      maxSources: input.maxSources,
      maxEstimatedTokens: input.maxEstimatedTokens,
      estimatedTokensUsed: selected.reduce((total, item) => total + item.estimatedTokens, 0),
    },
    safetyFlags: {
      approvedSourcesOnly: true,
      sensitivityFiltered: true,
      citationsRequired: true,
      providerCalled: false,
      liveExecutionAllowed: false,
    },
    providerCalled: false,
    liveExecutionAllowed: false,
  };
}

export function createRevenueGraphRelationship(input: RevenueGraphRelationshipInput) {
  const citation: KnowledgeCitation = {
    sourceId: input.sourceId,
    sourceType: input.sourceType,
    versionRef: input.versionRef,
    confidence: Math.min(input.confidence, input.qualityScore),
    usageType: "factual",
  };

  return {
    from: {
      ...input.from,
      metadata: input.from.metadata ?? {},
    },
    to: {
      ...input.to,
      metadata: input.to.metadata ?? {},
    },
    relationshipType: input.relationshipType,
    confidence: clampScore(input.confidence),
    qualityScore: clampScore(input.qualityScore),
    approvalStatus: input.approvalStatus,
    provenance: input.provenance,
    evidence: {
      citations: [citation],
      sourceId: input.sourceId,
      sourceType: input.sourceType,
      versionRef: input.versionRef,
      providerCalled: false,
      liveExecutionAllowed: false,
    },
    safetyFlags: {
      metadataOnly: true,
      leadCreated: false,
      outreachSent: false,
      campaignStarted: false,
      providerCalled: false,
      liveExecutionAllowed: false,
    },
    providerCalled: false,
    liveExecutionAllowed: false,
  };
}

export function createEnterpriseKnowledgeGraphRelationship(input: EnterpriseKnowledgeGraphRelationshipInput) {
  const domainKeys = normalizeKnowledgeDomains(input.domains ?? []);
  const citation: KnowledgeCitation = {
    sourceId: input.sourceId,
    sourceType: input.sourceType,
    versionRef: input.versionRef,
    confidence: Math.min(input.confidence, input.qualityScore),
    usageType: "factual",
  };

  return {
    graphName: "Enterprise Knowledge Graph",
    from: {
      ...input.from,
      metadata: input.from.metadata ?? {},
    },
    to: {
      ...input.to,
      metadata: input.to.metadata ?? {},
    },
    relationshipType: input.relationshipType,
    domains: domainKeys,
    domainNames: getDomainNames(domainKeys),
    confidence: clampScore(input.confidence),
    qualityScore: clampScore(input.qualityScore),
    approvalStatus: input.approvalStatus,
    provenance: input.provenance,
    evidence: {
      citations: [citation],
      sourceId: input.sourceId,
      sourceType: input.sourceType,
      versionRef: input.versionRef,
      providerCalled: false,
      liveExecutionAllowed: false,
    },
    safetyFlags: {
      metadataOnly: true,
      leadCreated: false,
      outreachSent: false,
      campaignStarted: false,
      autonomousDecisionMade: false,
      providerCalled: false,
      liveExecutionAllowed: false,
    },
    providerCalled: false,
    liveExecutionAllowed: false,
  };
}

export function createDefaultRevenueGraphPreview() {
  const common = {
    sourceId: "phase8-high-roi-plan",
    sourceType: "internal_company_knowledge",
    versionRef: "8.1",
    confidence: 78,
    qualityScore: 76,
    approvalStatus: "approved" as const,
    provenance: "High-ROI Phase 8 implementation plan approved as internal AI Core direction.",
  };

  return [
    createRevenueGraphRelationship({
      ...common,
      from: { nodeType: "seller", label: "Seller" },
      to: { nodeType: "property", label: "Property" },
      relationshipType: "owns",
    }),
    createRevenueGraphRelationship({
      ...common,
      from: { nodeType: "property", label: "Property" },
      to: { nodeType: "market", label: "Oklahoma City" },
      relationshipType: "located_in",
    }),
    createRevenueGraphRelationship({
      ...common,
      from: { nodeType: "seller", label: "Seller" },
      to: { nodeType: "knowledge", label: "Inherited Property Situation" },
      relationshipType: "has_situation",
    }),
  ];
}

export function createDefaultEnterpriseKnowledgeGraphPreview() {
  const common = {
    sourceId: "sprint13-5-hardening-plan",
    sourceType: "internal_company_knowledge",
    versionRef: "13.5",
    confidence: 80,
    qualityScore: 78,
    approvalStatus: "approved" as const,
    provenance: "Sprint 13.5 hardening plan approved as metadata-first AI Core direction.",
    domains: ["real_estate", "operations", "executive"],
  };

  return [
    createEnterpriseKnowledgeGraphRelationship({
      ...common,
      from: { nodeType: "seller", label: "Seller" },
      to: { nodeType: "property", label: "Property" },
      relationshipType: "owns",
      domains: ["real_estate"],
    }),
    createEnterpriseKnowledgeGraphRelationship({
      ...common,
      from: { nodeType: "property", label: "Property" },
      to: { nodeType: "market", label: "Oklahoma City" },
      relationshipType: "located_in",
      domains: ["real_estate"],
    }),
    createEnterpriseKnowledgeGraphRelationship({
      ...common,
      from: { nodeType: "decision", label: "Executive Decision" },
      to: { nodeType: "knowledge", label: "Approved Knowledge" },
      relationshipType: "referenced_by",
      domains: ["executive", "general_enterprise"],
    }),
  ];
}

export function semanticSearchApprovedKnowledge(input: {
  query: string;
  documents: SemanticKnowledgeDocument[];
  role?: string;
  maxResults?: number;
  maxEstimatedTokens?: number;
}) {
  const terms = tokenizeSearch(input.query);
  const maxResults = input.maxResults ?? 8;
  const maxEstimatedTokens = input.maxEstimatedTokens ?? 1600;
  let tokenBudget = maxEstimatedTokens;

  const scored = input.documents
    .filter((document) => document.approvalStatus === "approved")
    .filter((document) => canRoleAccessSensitivity(input.role ?? "operator", document.sensitivity))
    .map((document) => {
      const searchable = `${document.title} ${document.content} ${document.recommendedUse}`.toLowerCase();
      const termMatches = terms.filter((term) => searchable.includes(term)).length;
      const exactBoost = searchable.includes(input.query.toLowerCase()) ? 25 : 0;
      const score = clampScore(termMatches * 14 + exactBoost + document.qualityScore * 0.25 + document.confidence * 0.2);
      const excerpt = getExcerptAroundTerms(document.content, terms);

      return {
        sourceId: document.id,
        title: document.title,
        excerpt,
        score,
        qualityScore: document.qualityScore,
        confidence: document.confidence,
        versionRef: document.versionRef,
        recommendedUse: document.recommendedUse,
        citation: {
          sourceId: document.id,
          sourceType: document.sourceType,
          versionRef: document.versionRef,
          confidence: Math.min(document.confidence, document.qualityScore),
          usageType: "factual" as const,
        },
        estimatedTokens: estimateKnowledgeTokens(`${document.title} ${excerpt}`),
      };
    })
    .filter((result) => result.score > 0)
    .sort((a, b) => b.score - a.score || b.qualityScore - a.qualityScore);

  const selected: Array<SemanticSearchResult & { estimatedTokens: number }> = [];
  for (const result of scored) {
    if (selected.length >= maxResults) break;
    if (result.estimatedTokens > tokenBudget && selected.length > 0) continue;
    selected.push(result);
    tokenBudget -= result.estimatedTokens;
  }

  return {
    ok: true,
    query: input.query,
    results: selected.map((result) => ({
      sourceId: result.sourceId,
      title: result.title,
      excerpt: result.excerpt,
      score: result.score,
      qualityScore: result.qualityScore,
      confidence: result.confidence,
      versionRef: result.versionRef,
      recommendedUse: result.recommendedUse,
      citation: result.citation,
    })),
    budget: {
      maxResults,
      maxEstimatedTokens,
      estimatedTokensUsed: selected.reduce((total, result) => total + result.estimatedTokens, 0),
      omittedResultCount: Math.max(0, scored.length - selected.length),
    },
    safetyFlags: {
      approvedSourcesOnly: true,
      excerptLevelOnly: true,
      citationContractRequired: true,
      providerCalled: false,
      liveExecutionAllowed: false,
    },
    providerCalled: false,
    liveExecutionAllowed: false,
  };
}

export function canAdvanceResearchLifecycle(fromStage: string | null | undefined, toStage: string, approvalStatus: string) {
  const fromIndex = fromStage ? highRoiResearchLifecycleStages.indexOf(fromStage as (typeof highRoiResearchLifecycleStages)[number]) : 0;
  const toIndex = highRoiResearchLifecycleStages.indexOf(toStage as (typeof highRoiResearchLifecycleStages)[number]);

  if (toIndex < 0) return false;
  if (toIndex > 0 && approvalStatus !== "approved") return false;
  return toIndex >= fromIndex;
}

export function createExecutiveDecisionMemoryPreview() {
  return {
    decisionKey: "campaign-001",
    decisionType: "campaign_launch",
    title: "Launch Campaign 001 for inherited-property education",
    rationale: "Inherited-property education aligns with existing public content, seller situation patterns, and source-attribution goals.",
    assumptions: ["Seller education improves trust before acquisition conversations.", "Oklahoma inherited-property content can support both Marketing and Sales."],
    supportingEvidence: ["Revenue Knowledge Pack priority", "Existing inherited property public content", "Manual source attribution goals"],
    expectedOutcome: "Generate clearer inherited-property lead conversations and reusable sales follow-up guidance.",
    actualOutcome: "Pending measurement.",
    followUpRecommendation: "Review lead quality, cost, and seller response patterns before scaling.",
    citations: [
      {
        sourceId: "phase8-high-roi-plan",
        sourceType: "internal_company_knowledge",
        versionRef: "8.1",
        confidence: 80,
        usageType: "recommended" as const,
      },
    ],
    providerCalled: false,
    liveExecutionAllowed: false,
  };
}

export async function recordExecutiveDecisionMemory(input: { actorId?: string | null } = {}) {
  const preview = createExecutiveDecisionMemoryPreview();
  const delegate = getExecutiveDecisionMemoryDelegate();
  const existing = await delegate.findMany({
    where: {
      tenantId: DEFAULT_TENANT_ID,
      decisionKey: preview.decisionKey,
    },
    orderBy: [{ createdAt: "desc" }],
    take: 1,
  });

  if (existing.length > 0) {
    return {
      ok: true,
      status: "already_recorded" as const,
      decisionMemory: existing[0],
      message: "Executive memory was already recorded. No duplicate provider, publishing, outreach, or workflow action occurred.",
      actorId: input.actorId ?? null,
      providerCalled: false,
      sent: false,
      published: false,
      scraped: false,
      outreachSent: false,
      workflowStarted: false,
      liveExecutionAllowed: false,
    };
  }

  const decisionMemory = await delegate.create({
    data: {
      tenantId: DEFAULT_TENANT_ID,
      decisionKey: preview.decisionKey,
      decisionType: preview.decisionType,
      title: preview.title,
      rationale: preview.rationale,
      assumptions: preview.assumptions,
      supportingEvidence: preview.supportingEvidence,
      expectedOutcome: preview.expectedOutcome,
      actualOutcome: preview.actualOutcome,
      followUpRecommendation: preview.followUpRecommendation,
      linkedCampaignId: preview.decisionKey,
      linkedKnowledgePack: revenueKnowledgePack.packKey,
      citations: preview.citations,
      approvalStatus: "pending_review",
      providerCalled: false,
      liveExecutionAllowed: false,
    },
  });

  return {
    ok: true,
    status: "recorded" as const,
    decisionMemory,
    message: "Executive memory recorded internally for Campaign 001 review. No provider, publishing, outreach, or workflow action occurred.",
    actorId: input.actorId ?? null,
    providerCalled: false,
    sent: false,
    published: false,
    scraped: false,
    outreachSent: false,
    workflowStarted: false,
    liveExecutionAllowed: false,
  };
}

export function createCampaignLearningLoopPreview() {
  return {
    actionType: "campaign",
    actionLabel: "Campaign A inherited-property education angle",
    outcomeSummary: "Example outcome: generated 28 leads.",
    performanceSummary: "Example performance: cost $410, best-performing headline captured for review.",
    lesson: "Inherited-property education may produce reusable seller conversations when source attribution is clean.",
    futureGuidance: "Store as pending-review organizational knowledge before reusing in Marketing or Sales.",
    recommendationStatus: "pending_review",
    metrics: {
      leadsGenerated: 28,
      costCents: 41000,
      providerCalled: false,
    },
    citations: [
      {
        sourceId: "phase8-high-roi-plan",
        sourceType: "internal_company_knowledge",
        versionRef: "8.1",
        confidence: 76,
        usageType: "recommended" as const,
      },
    ],
    providerCalled: false,
    liveExecutionAllowed: false,
  };
}

export function createKnowledgeIndexPlan(source: KnowledgeSourceRecord) {
  return {
    sourceId: source.id,
    title: source.title,
    sourceType: source.sourceType,
    approvalStatus: source.approvalStatus,
    allowed: source.approvalStatus === "approved",
    plannedSteps: [
      "Verify source approval, license, sensitivity, and owner.",
      "Register source version metadata and provenance.",
      "Prepare documentation and pattern extraction plan from approved content only.",
      "Create citations and learning artifact drafts for human review.",
      "Update quality score, freshness status, graph relationships, and conflict-risk records.",
    ],
    blockedActions: ["repository clone", "live GitHub read", "scraping", "provider call", "external write", "autonomous ingestion"],
    providerCalled: false,
    liveExecutionAllowed: false,
  };
}

export async function registerKnowledgeSource(input: RegisterKnowledgeSourceInput) {
  const staleAfter = input.staleAfter ? new Date(input.staleAfter) : null;
  const qualityScore = calculateKnowledgeSourceQualityScore({
    categories: input.categories,
    provenance: input.provenance,
    license: input.license,
    approvalStatus: "pending_review",
    sensitivity: input.sensitivity,
    staleAfter,
    contradictionRisk: input.contradictionRisk,
  });

  return getKnowledgeSourceDelegate().create({
    data: {
      tenantId: DEFAULT_TENANT_ID,
      title: input.title,
      sourceType: input.sourceType,
      sourceUri: input.sourceUri || null,
      owner: input.owner,
      versionRef: input.versionRef,
      approvalStatus: "pending_review",
      trustScore: input.trustScore,
      qualityScore,
      license: input.license,
      provenance: input.provenance,
      categories: input.categories,
      businessModule: input.businessModule,
      visibility: input.visibility,
      sensitivity: input.sensitivity,
      freshnessStatus: staleAfter && staleAfter.getTime() < Date.now() ? "stale" : "current",
      reviewCadenceDays: input.reviewCadenceDays ?? null,
      staleAfter,
      updateHistory: [{ event: "registered", status: "pending_review", at: new Date().toISOString() }],
      qualitySignals: {
        qualityScore,
        trustScore: input.trustScore,
        contradictionRisk: input.contradictionRisk,
      },
      contradictionRisk: input.contradictionRisk,
      providerCalled: false,
      liveExecutionAllowed: false,
    },
  });
}

export async function listKnowledgeSources() {
  return getKnowledgeSourceDelegate().findMany({
    orderBy: [{ updatedAt: "desc" }, { createdAt: "desc" }],
    take: 100,
  });
}

export async function getKnowledgeSource(sourceId: string) {
  return getKnowledgeSourceDelegate().findUnique({
    where: { id: sourceId },
  });
}

export async function createKnowledgeSourceApprovalRequest(source: KnowledgeSourceRecord) {
  return getUnifiedApprovalDelegate().create({
    data: {
      tenantId: source.tenantId,
      itemType: "knowledge_source_approval",
      sourceType: "enterprise_knowledge_platform",
      sourceId: source.id,
      title: `Approve knowledge source: ${source.title}`,
      sourceLabel: source.sourceType,
      status: "pending_review",
      riskLevel: source.sensitivity === "public" || source.sensitivity === "internal" ? "medium" : "high",
      requiredApprovals: ["Knowledge owner approval", "Security/sensitivity review", "License/provenance review"],
      connectorId: null,
      executionBlockedReason: "Knowledge source approval never authorizes cloning, provider calls, scraping, external writes, or autonomous ingestion.",
      payload: {
        sourceId: source.id,
        sourceType: source.sourceType,
        versionRef: source.versionRef,
        trustScore: source.trustScore,
        qualityScore: source.qualityScore,
        sensitivity: source.sensitivity,
      },
      providerCalled: false,
      sent: false,
      published: false,
      liveExecutionAllowed: false,
    },
  });
}

export async function listKnowledgeRecommendations() {
  return getCountDelegate("knowledgeRecommendation").findMany({
    orderBy: [{ createdAt: "desc" }],
    take: 50,
  });
}

export async function listKnowledgeConflicts() {
  return getCountDelegate("knowledgeConflict").findMany({
    orderBy: [{ createdAt: "desc" }],
    take: 50,
  });
}

export async function createHighRoiSemanticSearch(query: string, role = "operator") {
  const [sources, items] = await Promise.all([listKnowledgeSources().catch(() => []), listKnowledgeItems().catch(() => [])]);
  const sourceDocuments: SemanticKnowledgeDocument[] = sources.map((source) => ({
    id: source.id,
    title: source.title,
    content: `${source.title}. ${source.provenance}. ${asStringArray(source.categories).join(", ")}.`,
    sourceType: source.sourceType,
    versionRef: source.versionRef,
    qualityScore: source.qualityScore,
    confidence: Math.min(source.trustScore, source.qualityScore),
    approvalStatus: source.approvalStatus,
    sensitivity: source.sensitivity,
    recommendedUse: source.sourceType === "approved_github_repository" ? "Engineering pattern review after approval" : "Operator knowledge review",
  }));
  const itemDocuments: SemanticKnowledgeDocument[] = items.map((item) => ({
    id: item.id,
    title: item.title,
    content: item.content,
    sourceType: "knowledge_item",
    versionRef: "current",
    qualityScore: item.status === "active" ? 70 : 50,
    confidence: item.status === "active" ? 68 : 45,
    approvalStatus: item.status === "active" ? "approved" : "pending_review",
    sensitivity: "internal",
    recommendedUse: item.category.includes("marketing") ? "Reuse in Marketing after review" : item.category.includes("sales") ? "Use in Sales after review" : "Operator review",
  }));

  return semanticSearchApprovedKnowledge({
    query,
    role,
    documents: [...sourceDocuments, ...itemDocuments],
    maxResults: 8,
    maxEstimatedTokens: 1600,
  });
}

export async function createHighRoiKnowledgeReport() {
  const [excerpts, lifecycleEvents, executiveMemory, learningLoopEvents] = await Promise.all([
    getCountDelegate("knowledgeExcerpt").count().catch(() => 0),
    getCountDelegate("knowledgeResearchLifecycleEvent").count().catch(() => 0),
    getCountDelegate("executiveDecisionMemory").count().catch(() => 0),
    getCountDelegate("knowledgeLearningLoopEvent").count().catch(() => 0),
  ]);

  return {
    ok: true,
    revenueGraph: {
      preview: createDefaultRevenueGraphPreview(),
      ontology: ["seller", "property", "market", "campaign", "lead", "decision", "outcome", "knowledge"],
      relationships: ["owns", "located_in", "has_situation", "generated", "converted_by", "informed_by", "produced"],
    },
    revenueKnowledgePack,
    semanticRetrieval: {
      excerptCount: excerpts,
      defaultTopResults: 8,
      mode: "approved_source_hybrid_lexical_v1",
    },
    researchLifecycle: {
      stages: highRoiResearchLifecycleStages,
      eventCount: lifecycleEvents,
      rule: "Research must be approved before becoming pack or Marketing/Sales/COO/Executive reference material.",
    },
    executiveMemory: {
      decisionCount: executiveMemory,
      preview: createExecutiveDecisionMemoryPreview(),
    },
    learningLoop: {
      eventCount: learningLoopEvents,
      preview: createCampaignLearningLoopPreview(),
    },
    operatorCards: ["Reuse this in Marketing", "Use this in Sales", "Review for Executive Brief", "Needs more evidence", "Approved Knowledge Pack candidate"],
    safetyFlags: {
      metadataOnly: true,
      noModelTraining: true,
      providerCalled: false,
      liveExecutionAllowed: false,
      outreachSent: false,
      campaignStarted: false,
      leadCreated: false,
    },
    providerCalled: false,
    liveExecutionAllowed: false,
  };
}

export function createKnowledgeLineageEvent(input: KnowledgeLineageEventInput) {
  return {
    targetType: input.targetType,
    targetId: input.targetId,
    lineageType: input.lineageType,
    relatedType: input.relatedType ?? null,
    relatedId: input.relatedId ?? null,
    actorId: input.actorId ?? null,
    provenance: input.provenance,
    decisionHistory: input.decisionHistory ?? null,
    safeMetadata: {
      ...(input.safeMetadata ?? {}),
      lineagePreservesHistory: true,
      doesNotOverwriteSource: true,
      providerCalled: false,
      liveExecutionAllowed: false,
    },
    providerCalled: false,
    liveExecutionAllowed: false,
  };
}

export function calculateKnowledgeHealth(input: KnowledgeHealthInput) {
  const staleDays = daysUntil(input.staleAfter);
  const freshnessScore = staleDays === null ? 75 : staleDays >= 30 ? 95 : staleDays >= 0 ? 70 : staleDays >= -30 ? 35 : 15;
  const requiredCitationCount = Math.max(1, input.requiredCitationCount ?? 1);
  const citationCompleteness = clampScore(((input.citationCount ?? 0) / requiredCitationCount) * 100);
  const approvalReadiness = input.approvalStatus === "approved" ? 100 : input.approvalStatus === "pending_review" ? 55 : 15;
  const confidenceScore = clampScore(input.confidence ?? input.qualityScore ?? 50);
  const expectedCoverageSignals = Math.max(1, input.expectedCoverageSignals ?? 1);
  const coverageScore = clampScore(((input.coverageSignals ?? 0) / expectedCoverageSignals) * 100);
  const usageCount = Math.max(0, input.usageCount ?? 0);
  const lastReferencedAt = input.lastReferencedAt ?? null;
  const stalenessScore = clampScore(100 - freshnessScore + (usageCount === 0 ? 15 : 0));
  const reviewSignals = [
    ...(freshnessScore < 50 ? ["stale"] : []),
    ...(citationCompleteness < 75 ? ["under_cited"] : []),
    ...(confidenceScore < 60 ? ["low_confidence"] : []),
    ...(coverageScore < 60 ? ["under_covered"] : []),
    ...(usageCount === 0 ? ["unused"] : []),
    ...(approvalReadiness < 100 ? ["approval_review_needed"] : []),
  ];

  return {
    targetType: input.targetType,
    targetId: input.targetId,
    freshnessScore,
    citationCompleteness,
    approvalReadiness,
    confidenceScore,
    coverageScore,
    usageCount,
    lastReferencedAt,
    stalenessScore,
    reviewSignals,
    safetyFlags: {
      metadataOnly: true,
      reviewSignalsOnly: true,
      providerCalled: false,
      liveExecutionAllowed: false,
    },
    providerCalled: false,
    liveExecutionAllowed: false,
  };
}

export async function createKnowledgeDomainsReport() {
  const [assignments, sources] = await Promise.all([
    getCountDelegate("knowledgeDomainAssignment").findMany({ take: 200 }).catch(() => []),
    listKnowledgeSources().catch(() => []),
  ]);
  const assignmentRecords = assignments as Array<{ domainKey?: string; targetType?: string; approvalStatus?: string }>;
  const sourceDomainKeys = sources.flatMap((source) => normalizeKnowledgeDomains([source.businessModule, ...asStringArray(source.categories)]));

  return {
    taxonomy: enterpriseKnowledgeDomains,
    coverage: enterpriseKnowledgeDomains.map((domain) => {
      const assignedCount = assignmentRecords.filter((assignment) => assignment.domainKey === domain.domainKey && assignment.approvalStatus !== "rejected").length;
      const inferredSourceCount = sourceDomainKeys.filter((domainKey) => domainKey === domain.domainKey).length;

      return {
        domainKey: domain.domainKey,
        name: domain.name,
        assignedCount,
        inferredSourceCount,
        totalSignals: assignedCount + inferredSourceCount,
      };
    }),
    assignmentCount: assignmentRecords.length,
    restrictedKnowledgeExposed: false,
    providerCalled: false,
    liveExecutionAllowed: false,
  };
}

export async function createKnowledgeLineageReport(targetType?: string | null, targetId?: string | null) {
  const where = targetType && targetId ? { targetType, targetId } : undefined;
  const events = (await getCountDelegate("knowledgeLineageEvent").findMany({
    where,
    orderBy: [{ createdAt: "desc" }],
    take: 50,
  }).catch(() => [])) as Array<{ lineageType?: string; targetType?: string; targetId?: string; relatedType?: string; relatedId?: string; provenance?: string; createdAt?: Date }>;

  const eventCounts = events.reduce<Record<string, number>>((counts, event) => {
    const key = event.lineageType ?? "unknown";
    counts[key] = (counts[key] ?? 0) + 1;
    return counts;
  }, {});

  return {
    targetType: targetType ?? "all",
    targetId: targetId ?? "all",
    eventCount: events.length,
    eventCounts,
    recentEvents: events,
    supportedLineage: ["created_from", "updated_from", "approved_by", "superseded_by", "referenced_by", "used_in", "decision_history"] satisfies KnowledgeLineageType[],
    safetyFlags: {
      preservesHistory: true,
      overwriteAllowed: false,
      providerCalled: false,
      liveExecutionAllowed: false,
    },
    providerCalled: false,
    liveExecutionAllowed: false,
  };
}

export async function createKnowledgeHealthReport() {
  const [sources, snapshots] = await Promise.all([
    listKnowledgeSources().catch(() => []),
    getCountDelegate("knowledgeHealthSnapshot").findMany({ orderBy: [{ createdAt: "desc" }], take: 100 }).catch(() => []),
  ]);
  const storedSnapshots = snapshots as Array<{ stalenessScore?: number; usageCount?: number; citationCompleteness?: number; confidenceScore?: number; targetType?: string; targetId?: string }>;
  const calculated = sources.slice(0, 25).map((source) =>
    calculateKnowledgeHealth({
      targetType: "knowledge_source",
      targetId: source.id,
      approvalStatus: source.approvalStatus,
      confidence: Math.min(source.trustScore, source.qualityScore),
      qualityScore: source.qualityScore,
      citationCount: source.provenance ? 1 : 0,
      requiredCitationCount: 1,
      coverageSignals: asStringArray(source.categories).length,
      expectedCoverageSignals: 2,
      usageCount: 0,
      lastReferencedAt: null,
      staleAfter: source.staleAfter,
    }),
  );
  const combined = [...storedSnapshots, ...calculated];

  return {
    snapshotCount: storedSnapshots.length,
    calculatedCount: calculated.length,
    averages: {
      freshness: calculated.length === 0 ? 0 : Math.round(calculated.reduce((total, item) => total + item.freshnessScore, 0) / calculated.length),
      citationCompleteness: calculated.length === 0 ? 0 : Math.round(calculated.reduce((total, item) => total + item.citationCompleteness, 0) / calculated.length),
      confidence: calculated.length === 0 ? 0 : Math.round(calculated.reduce((total, item) => total + item.confidenceScore, 0) / calculated.length),
      coverage: calculated.length === 0 ? 0 : Math.round(calculated.reduce((total, item) => total + item.coverageScore, 0) / calculated.length),
    },
    reviewSignals: {
      staleKnowledge: combined.filter((item) => (item.stalenessScore ?? 0) >= 50).length,
      unusedKnowledge: combined.filter((item) => (item.usageCount ?? 0) === 0).length,
      underCitedKnowledge: combined.filter((item) => (item.citationCompleteness ?? 100) < 75).length,
      lowConfidenceKnowledge: combined.filter((item) => (item.confidenceScore ?? 100) < 60).length,
    },
    sample: calculated.slice(0, 8),
    providerCalled: false,
    liveExecutionAllowed: false,
  };
}

export async function createKnowledgeExecutiveInsightsReport() {
  const [sources, packs, lineage, health, storedInsights, researchLifecycleEvents, executiveDecisionCount] = await Promise.all([
    listKnowledgeSources().catch(() => []),
    Promise.resolve(enterpriseKnowledgePacks),
    createKnowledgeLineageReport().catch(() => null),
    createKnowledgeHealthReport().catch(() => null),
    getCountDelegate("knowledgeExecutiveInsight").findMany({ orderBy: [{ createdAt: "desc" }], take: 20 }).catch(() => []),
    getCountDelegate("knowledgeResearchLifecycleEvent").findMany({ take: 100 }).catch(() => []),
    getCountDelegate("executiveDecisionMemory").count().catch(() => 0),
  ]);
  const lifecycle = researchLifecycleEvents as Array<{ toStage?: string; approvalStatus?: string }>;
  const staleKnowledge = health?.sample.filter((item) => item.reviewSignals.includes("stale")) ?? [];
  const unusedKnowledge = health?.sample.filter((item) => item.reviewSignals.includes("unused")) ?? [];

  return {
    topReferencedKnowledge: sources
      .filter((source) => source.approvalStatus === "approved")
      .slice(0, 5)
      .map((source) => ({
        sourceId: source.id,
        title: source.title,
        usageCount: 0,
        qualityScore: source.qualityScore,
        citation: { sourceId: source.id, sourceType: source.sourceType, versionRef: source.versionRef, confidence: Math.min(source.trustScore, source.qualityScore), usageType: "factual" as const },
      })),
    mostValuableKnowledgePacks: packs.slice(0, 6).map((pack) => ({
      packKey: pack.packKey,
      name: pack.name,
      valueSignals: pack.agentTypes.length + pack.businessModules.length + pack.categories.length,
      minQualityScore: pack.minQualityScore,
    })),
    knowledgeGaps: enterpriseKnowledgeDomains
      .filter((domain) => !sources.some((source) => normalizeKnowledgeDomains([source.businessModule, ...asStringArray(source.categories)]).includes(domain.domainKey)))
      .slice(0, 6)
      .map((domain) => ({ domainKey: domain.domainKey, name: domain.name, reason: "No approved or registered source coverage detected in local metadata." })),
    unusedKnowledge,
    staleKnowledge,
    decisionCoverage: {
      decisionCount: executiveDecisionCount,
      lineageDecisionEvents: lineage?.eventCounts.decision_history ?? 0,
      status: executiveDecisionCount > 0 ? "tracked" : "needs_decision_memory",
    },
    researchBottlenecks: {
      draftCount: lifecycle.filter((event) => event.toStage === "research_draft").length,
      approvedCount: lifecycle.filter((event) => event.toStage === "approved").length,
      referenceCount: lifecycle.filter((event) => String(event.toStage ?? "").includes("reference")).length,
      status: lifecycle.length === 0 ? "no_lifecycle_events_yet" : "tracked",
    },
    knowledgeGrowth: {
      totalSources: sources.length,
      approvedSources: sources.filter((source) => source.approvalStatus === "approved").length,
      storedInsightCount: (storedInsights as unknown[]).length,
    },
    storedInsights,
    advisoryOnly: true,
    providerCalled: false,
    liveExecutionAllowed: false,
  };
}

export function createKnowledgeRecommendationPreview(): Array<{
  recommendationType: string;
  title: string;
  why: string;
  expectedBenefits: string[];
  potentialRisks: string[];
  confidence: number;
  assumptions: string[];
  citations: KnowledgeCitation[];
  providerCalled: false;
  liveExecutionAllowed: false;
}> {
  return [
    {
      recommendationType: "architecture_improvement",
      title: "Use approved knowledge packs before agent recommendations",
      why: "Agent guidance becomes more consistent when it loads only approved, relevant, citation-ready knowledge.",
      expectedBenefits: ["Better explainability", "Lower context noise", "Reusable business-module intelligence"],
      potentialRisks: ["Incomplete source coverage can limit recommendations until more sources are approved."],
      confidence: 82,
      assumptions: ["Knowledge sources remain approval-gated.", "Agents honor the citation contract."],
      citations: [
        {
          sourceId: "phase8-platform-plan",
          sourceType: "internal_company_knowledge",
          versionRef: "v1",
          confidence: 82,
          usageType: "recommended",
        },
      ],
      providerCalled: false,
      liveExecutionAllowed: false,
    },
  ];
}

export async function createEnterpriseKnowledgePlatformReport() {
  const [sources, recommendations, conflicts, versions, artifacts, graphNodes, graphEdges, researchBriefs, highRoi, domains, lineage, health, executiveInsights] = await Promise.all([
    listKnowledgeSources().catch(() => []),
    getCountDelegate("knowledgeRecommendation").count().catch(() => 0),
    getCountDelegate("knowledgeConflict").count().catch(() => 0),
    getCountDelegate("knowledgeSourceVersion").count().catch(() => 0),
    getCountDelegate("knowledgeLearningArtifact").count().catch(() => 0),
    getCountDelegate("knowledgeGraphNode").count().catch(() => 0),
    getCountDelegate("knowledgeGraphEdge").count().catch(() => 0),
    getCountDelegate("knowledgeResearchBrief").count().catch(() => 0),
    createHighRoiKnowledgeReport().catch(() => null),
    createKnowledgeDomainsReport().catch(() => null),
    createKnowledgeLineageReport().catch(() => null),
    createKnowledgeHealthReport().catch(() => null),
    createKnowledgeExecutiveInsightsReport().catch(() => null),
  ]);

  const approvedSources = sources.filter((source) => source.approvalStatus === "approved");
  const averageQuality = sources.length === 0 ? 0 : Math.round(sources.reduce((total, source) => total + source.qualityScore, 0) / sources.length);
  const averageTrust = sources.length === 0 ? 0 : Math.round(sources.reduce((total, source) => total + source.trustScore, 0) / sources.length);

  return {
    ok: true,
    subsystem: "Enterprise AI Knowledge, Learning, Research, and Intelligence Platform",
    mode: "metadata_first_governed_v1",
    registry: {
      totalSources: sources.length,
      approvedSources: approvedSources.length,
      pendingSources: sources.filter((source) => source.approvalStatus === "pending_review").length,
      githubSources: sources.filter((source) => source.sourceType === "approved_github_repository").length,
      recentlyUpdatedSources: sources.slice(0, 5),
    },
    quality: {
      averageTrust,
      averageQuality,
      staleSources: sources.filter((source) => source.freshnessStatus === "stale").length,
      restrictedSources: sources.filter((source) => sensitivityRank[source.sensitivity] >= sensitivityRank.restricted).length,
    },
    packs: enterpriseKnowledgePacks,
    learning: {
      artifactCount: artifacts,
      versionCount: versions,
      researchBriefCount: researchBriefs,
    },
    graph: {
      nodeCount: graphNodes,
      edgeCount: graphEdges,
    },
    enterpriseGraph: {
      name: "Enterprise Knowledge Graph",
      nodeCount: graphNodes,
      edgeCount: graphEdges,
      preview: createDefaultEnterpriseKnowledgeGraphPreview(),
      ontology: ["business", "customer", "seller", "property", "market", "campaign", "lead", "decision", "outcome", "document", "project", "person", "task", "knowledge", "source", "pack", "domain"],
      relationships: ["owns", "located_in", "has_situation", "generated", "converted_by", "informed_by", "produced", "created_from", "updated_from", "approved_by", "superseded_by", "referenced_by", "used_in", "decision_history", "belongs_to_domain"],
      compatibilityAliases: ["revenueGraph", "createRevenueGraphRelationship", "createDefaultRevenueGraphPreview"],
    },
    recommendations: {
      storedCount: recommendations,
      preview: createKnowledgeRecommendationPreview(),
    },
    conflicts: {
      openCount: conflicts,
      reviewRequired: conflicts > 0,
    },
    highRoi,
    domains,
    lineage,
    health,
    executiveInsights,
    safetyFlags: {
      sourceApprovalRequired: true,
      citationContractRequired: true,
      sensitivityFiltered: true,
      githubCloneAllowed: false,
      scrapingAllowed: false,
      providerCalled: false,
      liveExecutionAllowed: false,
    },
    providerCalled: false,
    liveExecutionAllowed: false,
  };
}
