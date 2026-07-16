import type { AiWorkforceDepartmentName } from "@/lib/ai-workforce";

export const enterpriseOpportunityTypes = [
  "revenue",
  "marketing",
  "acquisition",
  "customer_journey",
  "operations",
  "compliance",
  "data_gap",
] as const;

export const enterpriseOpportunityStatuses = [
  "identified",
  "under_review",
  "needs_data",
  "needs_ceo_review",
  "approved_for_internal_work",
  "deferred",
  "closed_advisory",
  "blocked",
] as const;

export type EnterpriseOpportunityType = (typeof enterpriseOpportunityTypes)[number];
export type EnterpriseOpportunityStatus = (typeof enterpriseOpportunityStatuses)[number];
export type EnterpriseOpportunityPriority = "critical" | "high" | "medium" | "low";

export type EnterpriseOpportunityGovernanceFlags = {
  requiresHumanReview: true;
  advisoryOnly: true;
  providerCalled: false;
  liveExecutionAllowed: false;
  externalWritesAllowed: false;
  approvalAsExecutionAllowed: false;
  connectorActivationAllowed: false;
  crmMutationAllowed: false;
  leadCreationAllowed: false;
  outreachAllowed: false;
  publishingAllowed: false;
  scrapingAllowed: false;
  autonomousWorkAllowed: false;
  memoryPersistenceAllowed: false;
  kpiPersistenceAllowed: false;
};

export type EnterpriseOpportunityCreatedFrom = {
  system: "sprint-12-revenue-intelligence" | "department-operating-system" | "market-customer-intelligence" | "manual-import";
  sourceId: string;
  sourceVersion: string;
};

export type EnterpriseOpportunity = {
  id: string;
  version: "enterprise-opportunity-v1";
  sourceDepartment: AiWorkforceDepartmentName;
  ownerDepartment: AiWorkforceDepartmentName;
  type: EnterpriseOpportunityType;
  title: string;
  estimatedValue: number;
  confidenceScore: number;
  priority: EnterpriseOpportunityPriority;
  evidence: string[];
  missingData: string[];
  recommendedActions: string[];
  requiredApprovals: string[];
  status: EnterpriseOpportunityStatus;
  nextInternalStep: string;
  sourceLabels: string[];
  createdFrom: EnterpriseOpportunityCreatedFrom;
  governanceFlags: EnterpriseOpportunityGovernanceFlags;
};

export type EnterpriseOpportunitySource = {
  id: string;
  opportunityVersion: string;
  sourceLabels: string[];
  originatingDepartment: AiWorkforceDepartmentName;
  opportunityType: string;
  title: string;
  supportingEvidence: string[];
  missingData: string[];
  confidence: number;
  expectedValue: number;
  dataCompleteness: number;
  governanceRisk: number;
  bottleneckSeverity: number;
  safeNextAction: string;
};

export type EnterpriseOpportunityQueueSource = {
  opportunityId: string;
  priority: EnterpriseOpportunityPriority;
  owningDepartment: AiWorkforceDepartmentName;
  nextInternalStep: string;
};

export const enterpriseOpportunityGovernanceFlags: EnterpriseOpportunityGovernanceFlags = {
  requiresHumanReview: true,
  advisoryOnly: true,
  providerCalled: false,
  liveExecutionAllowed: false,
  externalWritesAllowed: false,
  approvalAsExecutionAllowed: false,
  connectorActivationAllowed: false,
  crmMutationAllowed: false,
  leadCreationAllowed: false,
  outreachAllowed: false,
  publishingAllowed: false,
  scrapingAllowed: false,
  autonomousWorkAllowed: false,
  memoryPersistenceAllowed: false,
  kpiPersistenceAllowed: false,
};

function clamp(value: number) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function enterpriseTypeFromRevenueType(type: string): EnterpriseOpportunityType {
  if (type.includes("marketing")) return "marketing";
  if (type.includes("acquisition") || type.includes("seller_lead")) return "acquisition";
  if (type.includes("bottleneck") || type.includes("throughput")) return "operations";
  if (type.includes("market")) return "revenue";

  return "revenue";
}

export function determineEnterpriseOpportunityStatus(input: {
  missingData: string[];
  dataCompleteness: number;
  governanceRisk: number;
  estimatedValue: number;
  bottleneckSeverity: number;
  priority: EnterpriseOpportunityPriority;
  blocked?: boolean;
}): EnterpriseOpportunityStatus {
  if (input.blocked || input.governanceRisk >= 85) return "blocked";
  if (input.missingData.length > 0 || input.dataCompleteness < 45) return "needs_data";
  if (input.priority === "critical" || input.estimatedValue >= 82 || input.bottleneckSeverity >= 80) return "needs_ceo_review";
  if (input.governanceRisk >= 60 || input.dataCompleteness < 60) return "under_review";

  return "identified";
}

export function requiredApprovalsForEnterpriseOpportunity(input: {
  status: EnterpriseOpportunityStatus;
  priority: EnterpriseOpportunityPriority;
  missingData: string[];
  governanceRisk: number;
  estimatedValue: number;
}): string[] {
  const approvals = new Set<string>(["Human opportunity review"]);

  if (input.status === "needs_ceo_review" || input.priority === "critical" || input.estimatedValue >= 82) {
    approvals.add("CEO opportunity review");
  }
  if (input.missingData.length > 0 || input.status === "needs_data") {
    approvals.add("Data completeness review");
  }
  if (input.governanceRisk >= 60 || input.status === "blocked") {
    approvals.add("Approval / Safety review");
  }

  return [...approvals];
}

export function createEnterpriseOpportunityFromRevenueOpportunity(input: {
  opportunity: EnterpriseOpportunitySource;
  queueItem?: EnterpriseOpportunityQueueSource;
}): EnterpriseOpportunity {
  const priority = input.queueItem?.priority ?? "medium";
  const status = determineEnterpriseOpportunityStatus({
    missingData: input.opportunity.missingData,
    dataCompleteness: input.opportunity.dataCompleteness,
    governanceRisk: input.opportunity.governanceRisk,
    estimatedValue: input.opportunity.expectedValue,
    bottleneckSeverity: input.opportunity.bottleneckSeverity,
    priority,
  });

  return {
    id: `enterprise-${input.opportunity.id}`,
    version: "enterprise-opportunity-v1",
    sourceDepartment: input.opportunity.originatingDepartment,
    ownerDepartment: input.queueItem?.owningDepartment ?? input.opportunity.originatingDepartment,
    type: enterpriseTypeFromRevenueType(input.opportunity.opportunityType),
    title: input.opportunity.title,
    estimatedValue: clamp(input.opportunity.expectedValue),
    confidenceScore: clamp(input.opportunity.confidence),
    priority,
    evidence: input.opportunity.supportingEvidence.slice(0, 8),
    missingData: input.opportunity.missingData.slice(0, 8),
    recommendedActions: [input.opportunity.safeNextAction].filter(Boolean),
    requiredApprovals: requiredApprovalsForEnterpriseOpportunity({
      status,
      priority,
      missingData: input.opportunity.missingData,
      governanceRisk: input.opportunity.governanceRisk,
      estimatedValue: input.opportunity.expectedValue,
    }),
    status,
    nextInternalStep: input.queueItem?.nextInternalStep ?? input.opportunity.safeNextAction,
    sourceLabels: input.opportunity.sourceLabels.slice(0, 8),
    createdFrom: {
      system: "sprint-12-revenue-intelligence",
      sourceId: input.opportunity.id,
      sourceVersion: input.opportunity.opportunityVersion,
    },
    governanceFlags: enterpriseOpportunityGovernanceFlags,
  };
}

export function createEnterpriseOpportunitiesFromRevenueEngine(input: {
  opportunities: EnterpriseOpportunitySource[];
  prioritizedQueue: EnterpriseOpportunityQueueSource[];
}): EnterpriseOpportunity[] {
  const queueByOpportunityId = new Map(input.prioritizedQueue.map((item) => [item.opportunityId, item]));

  return input.opportunities.map((opportunity) => createEnterpriseOpportunityFromRevenueOpportunity({
    opportunity,
    queueItem: queueByOpportunityId.get(opportunity.id),
  }));
}

export function assertEnterpriseOpportunityContractSafety(opportunities: EnterpriseOpportunity[]) {
  const serialized = JSON.stringify(opportunities);
  const unsafe = opportunities.some((opportunity) => {
    const flags = opportunity.governanceFlags;

    return (
      opportunity.version !== "enterprise-opportunity-v1" ||
      !enterpriseOpportunityTypes.includes(opportunity.type) ||
      !enterpriseOpportunityStatuses.includes(opportunity.status) ||
      !flags.requiresHumanReview ||
      !flags.advisoryOnly ||
      flags.providerCalled ||
      flags.liveExecutionAllowed ||
      flags.externalWritesAllowed ||
      flags.approvalAsExecutionAllowed ||
      flags.connectorActivationAllowed ||
      flags.crmMutationAllowed ||
      flags.leadCreationAllowed ||
      flags.outreachAllowed ||
      flags.publishingAllowed ||
      flags.scrapingAllowed ||
      flags.autonomousWorkAllowed ||
      flags.memoryPersistenceAllowed ||
      flags.kpiPersistenceAllowed
    );
  });

  if (unsafe) {
    throw new Error("Enterprise Opportunity Contract safety failed.");
  }
  if (/ya29\.|GOCSPX-|refresh-token|client-secret|BEGIN PRIVATE KEY|authorization|bearer\s+|https:\/\/www\.googleapis\.com|gmail\.googleapis\.com|drive\.googleapis\.com|analytics\.googleapis\.com|searchconsole\.googleapis\.com/iu.test(serialized)) {
    throw new Error("Enterprise Opportunity Contract exposed secret-like values or provider endpoints.");
  }
  if (/send_email|send_sms|publish_post|reply_to_review|create_lead|crm_mutation|autonomous_work_order|provider_write|drive\.files\.create|drafts\.send|calendar\.events\.insert/iu.test(serialized)) {
    throw new Error("Enterprise Opportunity Contract exposed blocked execution actions.");
  }

  return true;
}
