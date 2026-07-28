import type { AiWorkforceDepartmentName } from "@/lib/ai-workforce";
import type { CustomerJourneyOperatingLayerReport } from "@/lib/customer-journey-operating-layer";
import type { DailyRevenueOperatingLoopReport } from "@/lib/daily-revenue-operating-loop";
import type { DepartmentOperatingSystemReport } from "@/lib/department-operating-system";
import type { MarketCustomerIntelligenceFoundationReport } from "@/lib/market-customer-intelligence-foundation";
import type { RevenueIntelligenceOpportunityEngineReport } from "@/lib/revenue-intelligence-opportunity-engine";
import { listEnterpriseConnectors, type EnterpriseConnector } from "@/lib/connector-platform";

export const executiveDecisionBoundaryClassifications = [
  "review_only",
  "request_more_data",
  "department_review",
  "ceo_decision_required",
  "approval_safety_review",
  "separate_execution_gate_required",
] as const;

export const executiveDecisionQueueStatuses = [
  "informational",
  "review_needed",
  "ceo_decision_required",
  "approval_safety_review",
  "deferred",
  "closed_advisory",
] as const;

export type ExecutiveDecisionBoundaryClassification = (typeof executiveDecisionBoundaryClassifications)[number];
export type ExecutiveDecisionQueueStatus = (typeof executiveDecisionQueueStatuses)[number];
export type ExecutivePriorityLevel = "critical" | "high" | "medium" | "low";

export type ExecutiveIntelligenceGovernanceFlags = {
  requiresHumanReview: true;
  advisoryOnly: true;
  providerCalled: false;
  liveExecutionAllowed: false;
  externalWritesAllowed: false;
  connectorActivationAllowed: false;
  approvalAsExecutionAllowed: false;
  crmMutationAllowed: false;
  leadCreationAllowed: false;
  outreachAllowed: false;
  publishingAllowed: false;
  scrapingAllowed: false;
  memoryPersistenceAllowed: false;
  kpiPersistenceAllowed: false;
};

export type ExecutiveIntelligenceInput = {
  revenueIntelligence: RevenueIntelligenceOpportunityEngineReport;
  customerJourney: CustomerJourneyOperatingLayerReport;
  departmentOperatingSystem: DepartmentOperatingSystemReport;
  marketCustomerIntelligence: MarketCustomerIntelligenceFoundationReport;
  dailyRevenueLoop: DailyRevenueOperatingLoopReport;
  connectors?: EnterpriseConnector[];
  generatedAt?: string;
};

export type ExecutiveIntelligencePacket = {
  packetVersion: "sprint-14a-v1";
  executiveQuestion: "CEO, what are today's highest-impact decisions?";
  sourceTraceability: string[];
  topRevenueOpportunities: string[];
  topCustomerJourneys: string[];
  departmentSignals: string[];
  marketSignals: string[];
  safetySignals: string[];
  missingData: string[];
  governanceWarnings: string[];
  requiresHumanReview: true;
  advisoryOnly: true;
  providerCalled: false;
  liveExecutionAllowed: false;
};

export type ExecutiveDecisionBoundaryRecord = {
  recommendationId: string;
  sourceLabel: string;
  classification: ExecutiveDecisionBoundaryClassification;
  reason: string;
  requiresSeparateExecutionGate: boolean;
  advisoryOnly: true;
  providerCalled: false;
  liveExecutionAllowed: false;
};

export type ConnectorCapabilityIntelligenceRecord = {
  connectorId: string;
  displayName: string;
  supportedCapabilities: string[];
  readOnlyCapabilities: string[];
  draftCapabilities: string[];
  liveExecutionCapabilities: string[];
  requiredApprovals: string[];
  requiredScopes: string[];
  riskClassification: "low" | "medium" | "high";
  owningDepartment: string;
  auditRequirements: string[];
  currentGovernanceStatus: "read_only_visibility" | "draft_only" | "blocked" | "monitor_only";
  advisorySummary: string;
  connectorActivationAllowed: false;
  providerCalled: false;
  liveExecutionAllowed: false;
};

export type CeoBriefingContract = {
  briefingVersion: "sprint-14c-v1";
  executiveSummary: string;
  criticalAlerts: string[];
  revenueOpportunities: string[];
  customerJourneyRisks: string[];
  departmentPerformance: string[];
  requiredCeoDecisions: string[];
  confidenceLevel: "high" | "medium" | "low";
  evidence: string[];
  missingData: string[];
  connectorDataGaps: string[];
  governanceWarnings: string[];
  requiresHumanReview: true;
  advisoryOnly: true;
  providerCalled: false;
  liveExecutionAllowed: false;
  externalWritesAllowed: false;
};

export type ExecutiveKpiModel = {
  kpiVersion: "sprint-14d-v1";
  revenueMomentum: number;
  journeyHealth: number;
  opportunityCoverage: number;
  departmentAttention: number;
  bottleneckSeverity: number;
  missingDataSeverity: number;
  connectorReadinessGaps: number;
  governanceRisk: number;
  explanation: string;
  advisoryOnly: true;
  providerCalled: false;
  liveExecutionAllowed: false;
  kpiPersistenceAllowed: false;
};

export type ExecutivePriorityQueueItem = {
  priorityId: string;
  rank: number;
  title: string;
  priority: ExecutivePriorityLevel;
  revenueImpact: number;
  urgency: number;
  confidence: number;
  customerJourneyRisk: number;
  departmentBottleneckRisk: number;
  missingDataSeverity: number;
  connectorDataGapRisk: number;
  approvalSensitivity: number;
  governanceRisk: number;
  totalScore: number;
  explanation: string;
  sourceLabels: string[];
  advisoryOnly: true;
  providerCalled: false;
  liveExecutionAllowed: false;
};

export type DecisionRecommendation = {
  recommendationId: string;
  sourcePriorityId: string;
  recommendation: string;
  recommendedInternalAction:
    | "review_internally"
    | "request_more_data"
    | "assign_department_review"
    | "defer"
    | "escalate_approval_safety"
    | "prepare_separate_approval_workflow";
  decisionBoundary: ExecutiveDecisionBoundaryClassification;
  evidence: string[];
  missingData: string[];
  requiredReview: string[];
  createsTask: false;
  createsApproval: false;
  crmWriteAllowed: false;
  outreachAllowed: false;
  providerCalled: false;
  liveExecutionAllowed: false;
};

export type ExecutiveDecisionQueueItem = {
  queueId: string;
  recommendationId: string;
  status: ExecutiveDecisionQueueStatus;
  auditLabel: string;
  sourceTraceability: string[];
  advisoryOnly: true;
  executionRecordCreated: false;
  providerCalled: false;
  liveExecutionAllowed: false;
};

export type DepartmentDirectiveDraft = {
  draftId: string;
  department: AiWorkforceDepartmentName;
  directive: string;
  sourceRecommendationIds: string[];
  taskCreated: false;
  approvalCreated: false;
  crmWriteAllowed: false;
  providerCalled: false;
  liveExecutionAllowed: false;
};

export type ExecutiveDailyBrief = {
  briefVersion: "sprint-14j-v1";
  morningQuestion: "CEO, what are today's highest-impact decisions?";
  summary: string;
  criticalRisks: string[];
  recommendedInternalDecisions: string[];
  connectorDataGaps: string[];
  departmentAttention: string[];
  nextReviewFocus: string;
  requiresHumanReview: true;
  advisoryOnly: true;
  providerCalled: false;
  liveExecutionAllowed: false;
};

export type ExecutiveTelemetry = {
  telemetryVersion: "sprint-14k-v1";
  ceoAttentionItems: number;
  decisionCategories: Array<{ classification: ExecutiveDecisionBoundaryClassification; count: number }>;
  departmentsNeedingReview: AiWorkforceDepartmentName[];
  unresolvedBottlenecks: string[];
  missingDataFrequency: Array<{ missingData: string; count: number }>;
  connectorDataGaps: string[];
  riskTrendLabels: string[];
  briefingCompleteness: number;
  recommendationQuality: "review_ready" | "needs_more_observed_outcomes";
  memoryPersistenceAllowed: false;
  kpiPersistenceAllowed: false;
  advisoryOnly: true;
  providerCalled: false;
  liveExecutionAllowed: false;
};

export type ExecutiveIntelligencePlatformReport = {
  ok: true;
  sprint: "14";
  generatedAt: string;
  doctrine: "Executive intelligence and CEO decision support only. No execution authority.";
  executiveIntelligencePacket: ExecutiveIntelligencePacket;
  decisionBoundaryGate: ExecutiveDecisionBoundaryRecord[];
  connectorCapabilityIntelligence: ConnectorCapabilityIntelligenceRecord[];
  ceoBriefing: CeoBriefingContract;
  executiveKpis: ExecutiveKpiModel;
  priorityQueue: ExecutivePriorityQueueItem[];
  decisionRecommendations: DecisionRecommendation[];
  executiveDecisionQueue: ExecutiveDecisionQueueItem[];
  departmentDirectiveDrafts: DepartmentDirectiveDraft[];
  executiveDailyBrief: ExecutiveDailyBrief;
  telemetry: ExecutiveTelemetry;
  safety: ExecutiveIntelligenceGovernanceFlags;
  providerCalled: false;
  liveExecutionAllowed: false;
};

export const executiveIntelligenceGovernanceFlags: ExecutiveIntelligenceGovernanceFlags = {
  requiresHumanReview: true,
  advisoryOnly: true,
  providerCalled: false,
  liveExecutionAllowed: false,
  externalWritesAllowed: false,
  connectorActivationAllowed: false,
  approvalAsExecutionAllowed: false,
  crmMutationAllowed: false,
  leadCreationAllowed: false,
  outreachAllowed: false,
  publishingAllowed: false,
  scrapingAllowed: false,
  memoryPersistenceAllowed: false,
  kpiPersistenceAllowed: false,
};

function slug(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 80) || "executive";
}

function clamp(value: number) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function priorityFromScore(score: number): ExecutivePriorityLevel {
  if (score >= 82) return "critical";
  if (score >= 68) return "high";
  if (score >= 48) return "medium";

  return "low";
}

function createExecutiveIntelligencePacket(input: ExecutiveIntelligenceInput): ExecutiveIntelligencePacket {
  const topRevenueOpportunities = input.revenueIntelligence.prioritizedQueue.slice(0, 5).map((item) => `${item.owningDepartment}: ${item.nextInternalStep}`);
  const topCustomerJourneys = input.customerJourney.executiveCustomerJourneyBrief.journeysThatMatterToday.slice(0, 5);
  const departmentSignals = [
    ...input.departmentOperatingSystem.missions.filter((mission) => mission.missionStatus === "blocked" || mission.missionStatus === "waiting_on_dependency").map((mission) => `${mission.department}: ${mission.safeNextAction}`),
    ...input.departmentOperatingSystem.telemetry.confidenceDriftWatch.map((item) => `${item.department}: ${item.reason}`),
  ].slice(0, 5);
  const marketSignals = input.marketCustomerIntelligence.advisoryRecommendations.slice(0, 5);
  const missingData = [...new Set([
    ...input.revenueIntelligence.executiveRevenueBrief.missingDataBlockingRevenue,
    ...input.customerJourney.funnelIntelligence.missingDataPatterns,
    ...input.marketCustomerIntelligence.missingDataRegister.flatMap((item) => item.missingData),
  ])].slice(0, 10);

  return {
    packetVersion: "sprint-14a-v1",
    executiveQuestion: "CEO, what are today's highest-impact decisions?",
    sourceTraceability: ["sprint-12:revenue-intelligence", "sprint-12f:enterprise-opportunities", "sprint-13:customer-journey", "sprint-11:department-operating-system", "sprint-10e:market-customer-intelligence", "daily-revenue-operating-loop", "approval-safety"],
    topRevenueOpportunities,
    topCustomerJourneys,
    departmentSignals,
    marketSignals,
    safetySignals: [
      "Approval / Safety review remains required for high-risk recommendations.",
      "Executive intelligence does not grant execution authority.",
    ],
    missingData,
    governanceWarnings: [
      "No recommendation may create outreach, CRM writes, provider calls, connector activation, publishing, scraping, persistence, or autonomous execution.",
    ],
    requiresHumanReview: true,
    advisoryOnly: true,
    providerCalled: false,
    liveExecutionAllowed: false,
  };
}

function connectorGovernanceStatus(connector: EnterpriseConnector): ConnectorCapabilityIntelligenceRecord["currentGovernanceStatus"] {
  if (connector.safeAutoEligibility === "blocked" || connector.lifecycleState === "available" || connector.lifecycleState === "disabled" || connector.lifecycleState === "removed") return "blocked";
  if (connector.writeCapabilities.length > 0 && connector.humanApprovalRequirements.length > 0) return "draft_only";
  if (connector.lifecycleState === "monitor_only") return "monitor_only";

  return "read_only_visibility";
}

function safeScopeLabel(scope: string) {
  if (/googleapis\.com|https?:\/\//iu.test(scope)) return `scope:${slug(scope.split("/").pop() ?? "provider-scope")}`;

  return scope;
}

function createConnectorCapabilityIntelligence(connectors: EnterpriseConnector[] = listEnterpriseConnectors()): ConnectorCapabilityIntelligenceRecord[] {
  const desired = new Set(["google_business_profile", "google_search_console", "google_analytics", "meta_pages", "canva", "county_assessor", "google_drive", "gmail", "google_calendar"]);

  return connectors
    .filter((connector) => desired.has(connector.connectorId) || connector.category === "government")
    .slice(0, 12)
    .map((connector) => ({
      connectorId: connector.connectorId,
      displayName: connector.displayName,
      supportedCapabilities: [...connector.readCapabilities, ...connector.writeCapabilities].slice(0, 8),
      readOnlyCapabilities: connector.readCapabilities.slice(0, 8),
      draftCapabilities: connector.supportedActions.filter((action) => action.type === "prepare").map((action) => action.label).slice(0, 6),
      liveExecutionCapabilities: connector.writeCapabilities.slice(0, 6),
      requiredApprovals: connector.humanApprovalRequirements,
      requiredScopes: connector.requiredPermissions.map(safeScopeLabel),
      riskClassification: connector.riskLevel,
      owningDepartment: connector.owner,
      auditRequirements: [connector.auditConfiguration, connector.loggingConfiguration].filter(Boolean).slice(0, 4),
      currentGovernanceStatus: connectorGovernanceStatus(connector),
      advisorySummary: `${connector.displayName} can improve executive intelligence through ${connector.readCapabilities[0] ?? "read-only visibility"} when governed; Sprint 14 does not activate it.`,
      connectorActivationAllowed: false,
      providerCalled: false,
      liveExecutionAllowed: false,
    }));
}

function createExecutiveKpis(input: ExecutiveIntelligenceInput, connectorCapabilityIntelligence: ConnectorCapabilityIntelligenceRecord[], missingDataCount: number): ExecutiveKpiModel {
  const coverage = input.customerJourney.funnelIntelligence.opportunityCoverage;
  const opportunityCoverage = coverage.totalOpportunities ? (coverage.mappedToJourney / coverage.totalOpportunities) * 100 : 0;
  const journeyHealth = clamp(100 - input.customerJourney.funnelIntelligence.dropOffPoints.length * 12 - input.customerJourney.telemetry.blockedReasons.length * 10);
  const connectorReadinessGaps = connectorCapabilityIntelligence.filter((item) => item.currentGovernanceStatus === "blocked" || item.readOnlyCapabilities.length === 0).length;
  return {
    kpiVersion: "sprint-14d-v1",
    revenueMomentum: clamp(input.revenueIntelligence.prioritizedQueue[0]?.expectedBusinessImpact ?? 50),
    journeyHealth,
    opportunityCoverage: clamp(opportunityCoverage),
    departmentAttention: clamp(input.customerJourney.executiveCustomerJourneyBrief.departmentsOwningNextSteps.length * 12),
    bottleneckSeverity: clamp(input.customerJourney.funnelIntelligence.bottlenecks.length * 14),
    missingDataSeverity: clamp(missingDataCount * 10),
    connectorReadinessGaps: clamp(connectorReadinessGaps * 12),
    governanceRisk: clamp(input.revenueIntelligence.executiveRevenueBrief.revenueRisks.length * 10 + input.customerJourney.executiveCustomerJourneyBrief.requiresCeoOrSafetyReview.length * 8),
    explanation: "Executive KPIs combine revenue momentum, journey health, opportunity coverage, department attention, bottlenecks, missing data, connector readiness gaps, and governance risk.",
    advisoryOnly: true,
    providerCalled: false,
    liveExecutionAllowed: false,
    kpiPersistenceAllowed: false,
  };
}

function createPriorityQueue(input: ExecutiveIntelligenceInput, connectorCapabilityIntelligence: ConnectorCapabilityIntelligenceRecord[]): ExecutivePriorityQueueItem[] {
  const revenueItems = input.revenueIntelligence.prioritizedQueue.slice(0, 5).map((item) => ({
    title: `Revenue opportunity: ${item.nextInternalStep}`,
    revenueImpact: item.expectedBusinessImpact,
    urgency: item.priority === "critical" ? 95 : item.priority === "high" ? 78 : 52,
    confidence: item.feasibilityScore,
    customerJourneyRisk: 40,
    departmentBottleneckRisk: item.blockedByMissingData ? 70 : 35,
    missingDataSeverity: item.blockedByMissingData ? 75 : 20,
    connectorDataGapRisk: 30,
    approvalSensitivity: item.priority === "critical" ? 80 : 35,
    governanceRisk: item.blockedByMissingData ? 55 : 30,
    sourceLabels: [`revenue:${item.opportunityId}`],
  }));
  const journeyItems = input.customerJourney.journeys.slice(0, 5).map((journey) => ({
    title: `Customer journey: ${journey.currentStage} for ${journey.ownerDepartment}`,
    revenueImpact: journey.riskLevel === "high" ? 82 : journey.riskLevel === "medium" ? 65 : 45,
    urgency: journey.currentStage === "stalled" || journey.currentStage === "needs_ceo_review" ? 88 : 55,
    confidence: journey.missingData.length > 0 ? 50 : 75,
    customerJourneyRisk: journey.riskLevel === "high" ? 90 : journey.riskLevel === "medium" ? 65 : 35,
    departmentBottleneckRisk: journey.currentStage === "stalled" ? 85 : 40,
    missingDataSeverity: Math.min(100, journey.missingData.length * 25),
    connectorDataGapRisk: 35,
    approvalSensitivity: journey.requiredApprovals.some((approval) => /CEO|Safety/i.test(approval)) ? 85 : 30,
    governanceRisk: journey.riskLevel === "high" ? 82 : 35,
    sourceLabels: [`journey:${journey.journeyId}`, ...journey.sourceOpportunityIds],
  }));
  const connectorItems = connectorCapabilityIntelligence
    .filter((item) => item.currentGovernanceStatus === "blocked" || item.readOnlyCapabilities.length === 0)
    .slice(0, 3)
    .map((item) => ({
      title: `Connector data gap: ${item.displayName}`,
      revenueImpact: item.riskClassification === "high" ? 70 : 50,
      urgency: 48,
      confidence: 65,
      customerJourneyRisk: 40,
      departmentBottleneckRisk: 45,
      missingDataSeverity: 70,
      connectorDataGapRisk: 90,
      approvalSensitivity: 60,
      governanceRisk: item.riskClassification === "high" ? 80 : 45,
      sourceLabels: [`connector:${item.connectorId}`],
    }));

  return [...revenueItems, ...journeyItems, ...connectorItems]
    .map((item, index) => {
      const totalScore = clamp(item.revenueImpact * 0.25 + item.urgency * 0.2 + item.confidence * 0.1 + item.customerJourneyRisk * 0.15 + item.departmentBottleneckRisk * 0.1 + item.missingDataSeverity * 0.08 + item.connectorDataGapRisk * 0.06 + item.approvalSensitivity * 0.04 + item.governanceRisk * 0.02);

      return {
        ...item,
        priorityId: `executive-priority-${index + 1}-${slug(item.title)}`,
        rank: 0,
        title: item.title.slice(0, 180),
        priority: priorityFromScore(totalScore),
        totalScore,
        explanation: `Score ${totalScore}/100 ranks revenue impact, urgency, confidence, customer journey risk, bottlenecks, missing data, connector gaps, approval sensitivity, and governance risk.`,
        advisoryOnly: true as const,
        providerCalled: false as const,
        liveExecutionAllowed: false as const,
      };
    })
    .sort((a, b) => b.totalScore - a.totalScore || a.title.localeCompare(b.title))
    .map((item, index) => ({ ...item, rank: index + 1 }));
}

function classifyBoundary(item: ExecutivePriorityQueueItem): ExecutiveDecisionBoundaryClassification {
  if (item.governanceRisk >= 75 || item.approvalSensitivity >= 82) return "approval_safety_review";
  if (item.title.includes("Connector")) return "request_more_data";
  if (item.priority === "critical") return "ceo_decision_required";
  if (item.departmentBottleneckRisk >= 70) return "department_review";
  if (item.missingDataSeverity >= 60) return "request_more_data";

  return "review_only";
}

function actionForBoundary(classification: ExecutiveDecisionBoundaryClassification): DecisionRecommendation["recommendedInternalAction"] {
  if (classification === "request_more_data") return "request_more_data";
  if (classification === "department_review") return "assign_department_review";
  if (classification === "approval_safety_review") return "escalate_approval_safety";
  if (classification === "separate_execution_gate_required") return "prepare_separate_approval_workflow";

  return "review_internally";
}

function createDecisionRecommendations(priorityQueue: ExecutivePriorityQueueItem[]): DecisionRecommendation[] {
  return priorityQueue.slice(0, 8).map((item) => {
    const decisionBoundary = classifyBoundary(item);

    return {
      recommendationId: `executive-recommendation-${item.rank}-${slug(item.title)}`,
      sourcePriorityId: item.priorityId,
      recommendation: item.title.includes("Connector")
        ? `${item.title}: review connector readiness gap before using this signal in CEO decisions.`
        : item.title.includes("Customer journey")
          ? `${item.title}: review journey risk and assign internal department review.`
          : `${item.title}: review as a high-impact internal revenue decision.`,
      recommendedInternalAction: actionForBoundary(decisionBoundary),
      decisionBoundary,
      evidence: [item.explanation, ...item.sourceLabels].slice(0, 6),
      missingData: item.missingDataSeverity >= 60 ? ["Missing or incomplete supporting data reduces confidence."] : [],
      requiredReview: decisionBoundary === "approval_safety_review" ? ["Approval / Safety review"] : decisionBoundary === "ceo_decision_required" ? ["CEO review"] : ["Human executive review"],
      createsTask: false,
      createsApproval: false,
      crmWriteAllowed: false,
      outreachAllowed: false,
      providerCalled: false,
      liveExecutionAllowed: false,
    };
  });
}

function createDecisionBoundaryGate(recommendations: DecisionRecommendation[]): ExecutiveDecisionBoundaryRecord[] {
  return recommendations.map((item) => ({
    recommendationId: item.recommendationId,
    sourceLabel: item.sourcePriorityId,
    classification: item.decisionBoundary,
    reason: `${item.recommendedInternalAction} is advisory and requires human review before any separate workflow.`,
    requiresSeparateExecutionGate: item.decisionBoundary === "separate_execution_gate_required",
    advisoryOnly: true,
    providerCalled: false,
    liveExecutionAllowed: false,
  }));
}

function queueStatusForRecommendation(recommendation: DecisionRecommendation): ExecutiveDecisionQueueStatus {
  if (recommendation.decisionBoundary === "approval_safety_review") return "approval_safety_review";
  if (recommendation.decisionBoundary === "ceo_decision_required") return "ceo_decision_required";
  if (recommendation.decisionBoundary === "review_only") return "informational";

  return "review_needed";
}

function createExecutiveDecisionQueue(recommendations: DecisionRecommendation[]): ExecutiveDecisionQueueItem[] {
  return recommendations.map((item) => ({
    queueId: `executive-decision-queue-${slug(item.recommendationId)}`,
    recommendationId: item.recommendationId,
    status: queueStatusForRecommendation(item),
    auditLabel: "advisory_decision_queue_no_execution",
    sourceTraceability: [item.sourcePriorityId, ...item.evidence].slice(0, 6),
    advisoryOnly: true,
    executionRecordCreated: false,
    providerCalled: false,
    liveExecutionAllowed: false,
  }));
}

function departmentFromRecommendation(recommendation: DecisionRecommendation): AiWorkforceDepartmentName {
  if (/CRM|stalled|Qualification/i.test(recommendation.recommendation)) return "CRM";
  if (/Seller|Acquisition|seller/i.test(recommendation.recommendation)) return "Seller Acquisition";
  if (/Marketing|referral|campaign|ZIP/i.test(recommendation.recommendation)) return "Marketing";
  if (/Approval|Safety|risk/i.test(recommendation.requiredReview.join(" "))) return "Approval / Safety";

  return "AI COO";
}

function createDepartmentDirectiveDrafts(recommendations: DecisionRecommendation[]): DepartmentDirectiveDraft[] {
  return recommendations.slice(0, 6).map((recommendation) => {
    const department = departmentFromRecommendation(recommendation);

    return {
      draftId: `department-directive-${slug(recommendation.recommendationId)}`,
      department,
      directive: `${department}: ${recommendation.recommendation}`,
      sourceRecommendationIds: [recommendation.recommendationId],
      taskCreated: false,
      approvalCreated: false,
      crmWriteAllowed: false,
      providerCalled: false,
      liveExecutionAllowed: false,
    };
  });
}

function createCeoBriefing(input: ExecutiveIntelligenceInput, packet: ExecutiveIntelligencePacket, connectorCapabilityIntelligence: ConnectorCapabilityIntelligenceRecord[], recommendations: DecisionRecommendation[]): CeoBriefingContract {
  const connectorDataGaps = connectorCapabilityIntelligence.filter((item) => item.currentGovernanceStatus === "blocked" || item.readOnlyCapabilities.length === 0).map((item) => `${item.displayName}: ${item.currentGovernanceStatus}`).slice(0, 8);
  const evidence = [
    ...packet.topRevenueOpportunities,
    ...packet.topCustomerJourneys,
    ...input.customerJourney.funnelIntelligence.bottlenecks,
  ].slice(0, 10);
  const missingData = packet.missingData;

  return {
    briefingVersion: "sprint-14c-v1",
    executiveSummary: `Today's highest-impact CEO decisions are driven by ${packet.topRevenueOpportunities.length} revenue signal(s), ${packet.topCustomerJourneys.length} customer journey signal(s), and ${connectorDataGaps.length} connector data gap(s).`,
    criticalAlerts: [
      ...input.revenueIntelligence.executiveRevenueBrief.revenueRisks,
      ...input.customerJourney.executiveCustomerJourneyBrief.requiresCeoOrSafetyReview.map((item) => `CEO or Safety review required: ${item}`),
    ].slice(0, 8),
    revenueOpportunities: packet.topRevenueOpportunities,
    customerJourneyRisks: input.customerJourney.executiveCustomerJourneyBrief.stalledJourneys.concat(input.customerJourney.funnelIntelligence.bottlenecks).slice(0, 8),
    departmentPerformance: input.customerJourney.executiveCustomerJourneyBrief.departmentsOwningNextSteps.map((item) => `${item.department}: ${item.nextSteps.length} next step(s).`).slice(0, 8),
    requiredCeoDecisions: recommendations.filter((item) => item.decisionBoundary === "ceo_decision_required" || item.decisionBoundary === "approval_safety_review").map((item) => item.recommendation).slice(0, 5),
    confidenceLevel: missingData.length > 5 ? "low" : missingData.length > 0 || connectorDataGaps.length > 0 ? "medium" : "high",
    evidence,
    missingData,
    connectorDataGaps,
    governanceWarnings: packet.governanceWarnings,
    requiresHumanReview: true,
    advisoryOnly: true,
    providerCalled: false,
    liveExecutionAllowed: false,
    externalWritesAllowed: false,
  };
}

function createExecutiveDailyBrief(briefing: CeoBriefingContract, recommendations: DecisionRecommendation[], directives: DepartmentDirectiveDraft[]): ExecutiveDailyBrief {
  return {
    briefVersion: "sprint-14j-v1",
    morningQuestion: "CEO, what are today's highest-impact decisions?",
    summary: briefing.executiveSummary,
    criticalRisks: briefing.criticalAlerts,
    recommendedInternalDecisions: recommendations.slice(0, 5).map((item) => item.recommendation),
    connectorDataGaps: briefing.connectorDataGaps,
    departmentAttention: directives.map((item) => `${item.department}: ${item.directive}`).slice(0, 6),
    nextReviewFocus: recommendations[0]?.recommendation ?? "Review executive intelligence after more advisory signals are available.",
    requiresHumanReview: true,
    advisoryOnly: true,
    providerCalled: false,
    liveExecutionAllowed: false,
  };
}

function createTelemetry(recommendations: DecisionRecommendation[], decisionBoundaryGate: ExecutiveDecisionBoundaryRecord[], customerJourney: CustomerJourneyOperatingLayerReport, connectorCapabilityIntelligence: ConnectorCapabilityIntelligenceRecord[], briefing: CeoBriefingContract): ExecutiveTelemetry {
  const counts = new Map<ExecutiveDecisionBoundaryClassification, number>();
  for (const item of decisionBoundaryGate) counts.set(item.classification, (counts.get(item.classification) ?? 0) + 1);
  const missingCounts = new Map<string, number>();
  for (const item of briefing.missingData) missingCounts.set(item, (missingCounts.get(item) ?? 0) + 1);

  return {
    telemetryVersion: "sprint-14k-v1",
    ceoAttentionItems: recommendations.length,
    decisionCategories: executiveDecisionBoundaryClassifications.map((classification) => ({ classification, count: counts.get(classification) ?? 0 })).filter((item) => item.count > 0),
    departmentsNeedingReview: [...new Set(customerJourney.executiveCustomerJourneyBrief.departmentsOwningNextSteps.map((item) => item.department))].slice(0, 8),
    unresolvedBottlenecks: customerJourney.funnelIntelligence.bottlenecks,
    missingDataFrequency: [...missingCounts.entries()].map(([missingData, count]) => ({ missingData, count })).slice(0, 8),
    connectorDataGaps: connectorCapabilityIntelligence.filter((item) => item.currentGovernanceStatus === "blocked" || item.readOnlyCapabilities.length === 0).map((item) => item.displayName).slice(0, 8),
    riskTrendLabels: [...briefing.criticalAlerts, ...customerJourney.funnelIntelligence.dropOffPoints].slice(0, 8),
    briefingCompleteness: clamp(100 - briefing.missingData.length * 8 - briefing.connectorDataGaps.length * 6),
    recommendationQuality: recommendations.length > 0 ? "review_ready" : "needs_more_observed_outcomes",
    memoryPersistenceAllowed: false,
    kpiPersistenceAllowed: false,
    advisoryOnly: true,
    providerCalled: false,
    liveExecutionAllowed: false,
  };
}

export function createExecutiveIntelligencePlatformReportFromInputs(input: ExecutiveIntelligenceInput): ExecutiveIntelligencePlatformReport {
  const generatedAt = input.generatedAt ?? input.customerJourney.generatedAt ?? input.revenueIntelligence.generatedAt ?? new Date().toISOString();
  const executiveIntelligencePacket = createExecutiveIntelligencePacket(input);
  const connectorCapabilityIntelligence = createConnectorCapabilityIntelligence(input.connectors);
  const executiveKpis = createExecutiveKpis(input, connectorCapabilityIntelligence, executiveIntelligencePacket.missingData.length);
  const priorityQueue = createPriorityQueue(input, connectorCapabilityIntelligence);
  const decisionRecommendations = createDecisionRecommendations(priorityQueue);
  const decisionBoundaryGate = createDecisionBoundaryGate(decisionRecommendations);
  const executiveDecisionQueue = createExecutiveDecisionQueue(decisionRecommendations);
  const departmentDirectiveDrafts = createDepartmentDirectiveDrafts(decisionRecommendations);
  const ceoBriefing = createCeoBriefing(input, executiveIntelligencePacket, connectorCapabilityIntelligence, decisionRecommendations);
  const executiveDailyBrief = createExecutiveDailyBrief(ceoBriefing, decisionRecommendations, departmentDirectiveDrafts);
  const telemetry = createTelemetry(decisionRecommendations, decisionBoundaryGate, input.customerJourney, connectorCapabilityIntelligence, ceoBriefing);

  const report: ExecutiveIntelligencePlatformReport = {
    ok: true,
    sprint: "14",
    generatedAt,
    doctrine: "Executive intelligence and CEO decision support only. No execution authority.",
    executiveIntelligencePacket,
    decisionBoundaryGate,
    connectorCapabilityIntelligence,
    ceoBriefing,
    executiveKpis,
    priorityQueue,
    decisionRecommendations,
    executiveDecisionQueue,
    departmentDirectiveDrafts,
    executiveDailyBrief,
    telemetry,
    safety: executiveIntelligenceGovernanceFlags,
    providerCalled: false,
    liveExecutionAllowed: false,
  };

  assertExecutiveIntelligencePlatformSafety(report);

  return report;
}

export function assertExecutiveIntelligencePlatformSafety(report: ExecutiveIntelligencePlatformReport) {
  const serialized = JSON.stringify(report);
  const unsafe = [
    report.providerCalled,
    report.liveExecutionAllowed,
    !report.safety.requiresHumanReview,
    !report.safety.advisoryOnly,
    report.safety.providerCalled,
    report.safety.liveExecutionAllowed,
    report.safety.externalWritesAllowed,
    report.safety.connectorActivationAllowed,
    report.safety.approvalAsExecutionAllowed,
    report.safety.crmMutationAllowed,
    report.safety.leadCreationAllowed,
    report.safety.outreachAllowed,
    report.safety.publishingAllowed,
    report.safety.scrapingAllowed,
    report.safety.memoryPersistenceAllowed,
    report.safety.kpiPersistenceAllowed,
    report.connectorCapabilityIntelligence.some((item) => item.connectorActivationAllowed || item.providerCalled || item.liveExecutionAllowed),
    report.decisionRecommendations.some((item) => item.createsTask || item.createsApproval || item.crmWriteAllowed || item.outreachAllowed || item.providerCalled || item.liveExecutionAllowed),
    report.executiveDecisionQueue.some((item) => item.executionRecordCreated || item.providerCalled || item.liveExecutionAllowed),
    report.departmentDirectiveDrafts.some((item) => item.taskCreated || item.approvalCreated || item.crmWriteAllowed || item.providerCalled || item.liveExecutionAllowed),
    report.executiveKpis.kpiPersistenceAllowed || report.executiveKpis.providerCalled || report.executiveKpis.liveExecutionAllowed,
    report.telemetry.memoryPersistenceAllowed || report.telemetry.kpiPersistenceAllowed || report.telemetry.providerCalled || report.telemetry.liveExecutionAllowed,
  ];

  if (unsafe.some(Boolean)) {
    throw new Error("Executive Intelligence Platform safety contract failed.");
  }
  if (/ya29\.|GOCSPX-|refresh-token|client-secret|BEGIN PRIVATE KEY|authorization|bearer\s+|https:\/\/www\.googleapis\.com|gmail\.googleapis\.com|drive\.googleapis\.com|analytics\.googleapis\.com|searchconsole\.googleapis\.com/iu.test(serialized)) {
    throw new Error("Executive Intelligence Platform exposed secret-like values or provider endpoints.");
  }
  if (/send_email|send_sms|publish_post|reply_to_review|create_lead|crm_mutation|autonomous_work_order|provider_write|drive\.files\.create|drafts\.send|calendar\.events\.insert|connector_activation|oauth_exchange/iu.test(serialized)) {
    throw new Error("Executive Intelligence Platform exposed blocked execution actions.");
  }

  return true;
}
