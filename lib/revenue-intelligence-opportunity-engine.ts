import type { AiWorkforceDepartmentName } from "@/lib/ai-workforce";
import type { DepartmentMission, DepartmentOperatingSystemReport } from "@/lib/department-operating-system";
import {
  assertEnterpriseOpportunityContractSafety,
  createEnterpriseOpportunitiesFromRevenueEngine,
  type EnterpriseOpportunity,
} from "@/lib/enterprise-opportunity-contract";
import type { MarketCustomerIntelligenceFoundationReport } from "@/lib/market-customer-intelligence-foundation";
import type { RevenueCommandCenterReport, RevenueInboxItem } from "@/lib/revenue-spine";

export const revenueOpportunityTypes = [
  "seller_lead_opportunity",
  "marketing_conversion_opportunity",
  "acquisition_focus_opportunity",
  "market_timing_opportunity",
  "department_throughput_opportunity",
  "bottleneck_recovery_opportunity",
] as const;

export type RevenueOpportunityType = (typeof revenueOpportunityTypes)[number];
export type RevenueOpportunityPriority = "critical" | "high" | "medium" | "low";

export type RevenueOpportunityScore = {
  confidence: number;
  expectedValue: number;
  urgency: number;
  estimatedEffort: number;
  dataCompleteness: number;
  governanceRisk: number;
  departmentReadiness: number;
  bottleneckSeverity: number;
  impactScore: number;
  feasibilityScore: number;
  totalScore: number;
  explanation: string;
};

export type AdvisoryRevenueOpportunity = {
  opportunityVersion: "sprint-12a-v1";
  id: string;
  sourceLabels: string[];
  originatingDepartment: AiWorkforceDepartmentName;
  opportunityType: RevenueOpportunityType;
  title: string;
  revenueHypothesis: string;
  supportingEvidence: string[];
  missingData: string[];
  confidence: number;
  expectedValue: number;
  urgency: number;
  estimatedEffort: number;
  dataCompleteness: number;
  governanceRisk: number;
  bottleneckSeverity: number;
  safeNextAction: string;
  score: RevenueOpportunityScore;
  requiresHumanReview: true;
  advisoryOnly: true;
  providerCalled: false;
  liveExecutionAllowed: false;
  externalWritesAllowed: false;
};

export type PrioritizedRevenueOpportunity = {
  prioritizationVersion: "sprint-12c-v1";
  opportunityId: string;
  rank: number;
  priority: RevenueOpportunityPriority;
  originatingDepartment: AiWorkforceDepartmentName;
  totalScore: number;
  expectedBusinessImpact: number;
  feasibilityScore: number;
  reviewFirstReason: string;
  bestRiskReward: boolean;
  blockedByMissingData: boolean;
  owningDepartment: AiWorkforceDepartmentName;
  nextInternalStep: string;
  requiresHumanReview: true;
  advisoryOnly: true;
  providerCalled: false;
  liveExecutionAllowed: false;
  externalWritesAllowed: false;
};

export type ExecutiveRevenueBrief = {
  briefVersion: "sprint-12d-v1";
  title: "Daily Executive Revenue Brief";
  topFiveOpportunities: PrioritizedRevenueOpportunity[];
  enterpriseOpportunityContract: {
    contractVersion: "enterprise-opportunity-v1";
    topOpportunityStatuses: Array<{
      opportunityId: string;
      status: EnterpriseOpportunity["status"];
      requiredApprovals: string[];
    }>;
    requiredApprovalLabels: string[];
    opportunityLifecycleAdvisoryOnly: true;
    approvalAsExecutionAllowed: false;
  };
  revenueRisks: string[];
  bottlenecks: string[];
  departmentsNeedingAttention: AiWorkforceDepartmentName[];
  missingDataBlockingRevenue: string[];
  recommendedInternalDecisions: string[];
  approvalAsExecutionAllowed: false;
  requiresHumanReview: true;
  advisoryOnly: true;
  providerCalled: false;
  liveExecutionAllowed: false;
  externalWritesAllowed: false;
};

export type AdvisoryClosedLoopLearning = {
  learningVersion: "sprint-12e-v1";
  comparedSignals: number;
  observedOutcomeSignals: string[];
  recommendationQualityNotes: string[];
  expectedVsObservedGaps: string[];
  nextRecommendationImprovement: string;
  memoryPersistenceAllowed: false;
  kpiPersistenceAllowed: false;
  automationAllowed: false;
  advisoryOnly: true;
  providerCalled: false;
  liveExecutionAllowed: false;
};

export type RevenueIntelligenceOpportunityEngineReport = {
  ok: true;
  sprint: "12";
  generatedAt: string;
  doctrine: "Opportunity detection, scoring, prioritization, and executive revenue recommendations only. No execution authority.";
  opportunities: AdvisoryRevenueOpportunity[];
  enterpriseOpportunities: EnterpriseOpportunity[];
  prioritizedQueue: PrioritizedRevenueOpportunity[];
  executiveRevenueBrief: ExecutiveRevenueBrief;
  closedLoopLearning: AdvisoryClosedLoopLearning;
  technicalDebtBacklog: Array<{
    issue: "ESLint silent timeout" | "Turbopack tracing warning";
    priority: "high" | "medium";
    recommendation: string;
  }>;
  safety: {
    readOnly: true;
    advisoryOnly: true;
    requiresHumanReview: true;
    providerCalled: false;
    liveExecutionAllowed: false;
    externalWritesAllowed: false;
    connectorActivationAllowed: false;
    crmMutationAllowed: false;
    leadCreationAllowed: false;
    outreachAllowed: false;
    publishingAllowed: false;
    scrapingAllowed: false;
    autonomousWorkAllowed: false;
    memoryPersistenceAllowed: false;
    kpiPersistenceAllowed: false;
    approvalAsExecutionAllowed: false;
  };
  providerCalled: false;
  liveExecutionAllowed: false;
};

export type RevenueIntelligenceOpportunityEngineInput = {
  departmentOperatingSystem: DepartmentOperatingSystemReport;
  marketCustomerIntelligence: MarketCustomerIntelligenceFoundationReport;
  revenueCommandCenter?: RevenueCommandCenterReport | null;
  generatedAt?: string;
};

function slug(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 90) || "opportunity";
}

function clamp(value: number) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function scoreOpportunity(input: {
  confidence: number;
  expectedValue: number;
  urgency: number;
  estimatedEffort: number;
  dataCompleteness: number;
  governanceRisk: number;
  departmentReadiness: number;
  bottleneckSeverity: number;
}): RevenueOpportunityScore {
  const impactScore = clamp(input.expectedValue * 0.45 + input.urgency * 0.25 + input.confidence * 0.2 + input.bottleneckSeverity * 0.1);
  const feasibilityScore = clamp(input.dataCompleteness * 0.35 + input.departmentReadiness * 0.35 + (100 - input.estimatedEffort) * 0.2 + (100 - input.governanceRisk) * 0.1);
  const totalScore = clamp(impactScore * 0.6 + feasibilityScore * 0.4);

  return {
    confidence: clamp(input.confidence),
    expectedValue: clamp(input.expectedValue),
    urgency: clamp(input.urgency),
    estimatedEffort: clamp(input.estimatedEffort),
    dataCompleteness: clamp(input.dataCompleteness),
    governanceRisk: clamp(input.governanceRisk),
    departmentReadiness: clamp(input.departmentReadiness),
    bottleneckSeverity: clamp(input.bottleneckSeverity),
    impactScore,
    feasibilityScore,
    totalScore,
    explanation: `Score ${totalScore}/100 combines expected value ${clamp(input.expectedValue)}, urgency ${clamp(input.urgency)}, confidence ${clamp(input.confidence)}, effort ${clamp(input.estimatedEffort)}, data completeness ${clamp(input.dataCompleteness)}, governance risk ${clamp(input.governanceRisk)}, department readiness ${clamp(input.departmentReadiness)}, and bottleneck severity ${clamp(input.bottleneckSeverity)}.`,
  };
}

function createOpportunity(input: {
  generatedAt: string;
  sourceLabels: string[];
  originatingDepartment: AiWorkforceDepartmentName;
  opportunityType: RevenueOpportunityType;
  title: string;
  revenueHypothesis: string;
  supportingEvidence: string[];
  missingData: string[];
  confidence: number;
  expectedValue: number;
  urgency: number;
  estimatedEffort: number;
  dataCompleteness: number;
  governanceRisk: number;
  departmentReadiness: number;
  bottleneckSeverity: number;
  safeNextAction: string;
}): AdvisoryRevenueOpportunity {
  const score = scoreOpportunity(input);

  return {
    opportunityVersion: "sprint-12a-v1",
    id: ["revenue-opportunity", input.generatedAt.slice(0, 10), slug(input.opportunityType), slug(input.title)].join("-"),
    sourceLabels: input.sourceLabels.slice(0, 8),
    originatingDepartment: input.originatingDepartment,
    opportunityType: input.opportunityType,
    title: input.title.slice(0, 180),
    revenueHypothesis: input.revenueHypothesis.slice(0, 360),
    supportingEvidence: input.supportingEvidence.slice(0, 8),
    missingData: [...new Set(input.missingData)].slice(0, 8),
    confidence: score.confidence,
    expectedValue: score.expectedValue,
    urgency: score.urgency,
    estimatedEffort: score.estimatedEffort,
    dataCompleteness: score.dataCompleteness,
    governanceRisk: score.governanceRisk,
    bottleneckSeverity: score.bottleneckSeverity,
    safeNextAction: input.safeNextAction,
    score,
    requiresHumanReview: true,
    advisoryOnly: true,
    providerCalled: false,
    liveExecutionAllowed: false,
    externalWritesAllowed: false,
  };
}

function opportunityTypeForMission(mission: DepartmentMission): RevenueOpportunityType {
  if (mission.department === "Marketing" || mission.department === "SEO" || mission.department === "Content") return "marketing_conversion_opportunity";
  if (mission.department === "Lead Generation") return "seller_lead_opportunity";
  if (mission.department === "Seller Acquisition") return "acquisition_focus_opportunity";
  if (mission.missingData.length > 0 || mission.missionStatus === "blocked" || mission.missionStatus === "waiting_on_dependency") return "bottleneck_recovery_opportunity";

  return "department_throughput_opportunity";
}

function opportunitiesFromMissions(input: RevenueIntelligenceOpportunityEngineInput, generatedAt: string): AdvisoryRevenueOpportunity[] {
  return input.departmentOperatingSystem.missions.map((mission) => createOpportunity({
    generatedAt,
    sourceLabels: mission.sourceLabels,
    originatingDepartment: mission.department,
    opportunityType: opportunityTypeForMission(mission),
    title: `${mission.department} revenue opportunity`,
    revenueHypothesis: mission.objective,
    supportingEvidence: [mission.recommendedOutput, mission.approvalRule, ...mission.successKpi],
    missingData: mission.missingData,
    confidence: mission.priorityScore,
    expectedValue: mission.priority === "critical" ? 92 : mission.priority === "high" ? 78 : mission.priority === "medium" ? 58 : 36,
    urgency: mission.dueWindow === "today" ? 84 : mission.dueWindow === "tomorrow" ? 58 : 34,
    estimatedEffort: mission.dependencies.length > 0 ? 62 : 38,
    dataCompleteness: mission.missingData.length > 0 ? Math.max(25, 75 - mission.missingData.length * 10) : 82,
    governanceRisk: mission.risk === "high" ? 72 : mission.risk === "medium" ? 48 : 25,
    departmentReadiness: mission.missionStatus === "ready" ? 82 : mission.missionStatus === "queued" ? 60 : mission.missionStatus === "needs_ceo_review" ? 52 : 40,
    bottleneckSeverity: mission.missionStatus === "blocked" ? 86 : mission.missionStatus === "waiting_on_dependency" ? 68 : mission.missingData.length * 12,
    safeNextAction: mission.safeNextAction,
  }));
}

function opportunitiesFromRevenueCommandCenter(report: RevenueCommandCenterReport | null | undefined, generatedAt: string): AdvisoryRevenueOpportunity[] {
  if (!report) return [];

  return report.inbox.slice(0, 5).map((item: RevenueInboxItem) => {
    const score = item.latestScore;

    return createOpportunity({
      generatedAt,
      sourceLabels: [`revenue-spine:${item.lead.id}`, `lead-source:${item.lead.source || "unknown"}`],
      originatingDepartment: "Lead Generation",
      opportunityType: "seller_lead_opportunity",
      title: `Seller lead review ${item.lead.id}`,
      revenueHypothesis: score?.explanation ?? "Revenue spine identified a lead requiring advisory review.",
      supportingEvidence: [
        item.recommendedAction,
        ...(score?.dataUsed ?? ["stored lead source"]),
        ...item.followUpFlags,
      ],
      missingData: score?.missingData ?? [],
      confidence: score?.confidence ?? 45,
      expectedValue: score?.score ?? item.lead.score ?? 40,
      urgency: item.lead.isHot || item.lead.priority === "High" ? 85 : score?.priority === "Medium" ? 58 : 35,
      estimatedEffort: (score?.missingData.length ?? 0) > 0 ? 66 : 38,
      dataCompleteness: score?.scoreBreakdown.dataCompleteness ?? 45,
      governanceRisk: item.lead.doNotContact ? 88 : (score?.missingData.length ?? 0) > 0 ? 48 : 30,
      departmentReadiness: 70,
      bottleneckSeverity: Math.min(100, item.duplicateWarnings.length * 25 + (score?.missingData.length ?? 0) * 10),
      safeNextAction: score?.recommendedNextAction ?? item.recommendedAction,
    });
  });
}

function opportunitiesFromMarketIntelligence(report: MarketCustomerIntelligenceFoundationReport, generatedAt: string): AdvisoryRevenueOpportunity[] {
  return report.intelligenceObjects
    .filter((object) => object.score.revenueRelevance >= 65 || object.score.urgency >= 60)
    .slice(0, 6)
    .map((object) => createOpportunity({
      generatedAt,
      sourceLabels: [object.sourceLabel, `sprint-10e:${object.id}`],
      originatingDepartment: object.recommendedDepartment,
      opportunityType: object.objectType === "market_trend" || object.objectType === "neighborhood_opportunity" ? "market_timing_opportunity" : "marketing_conversion_opportunity",
      title: object.title,
      revenueHypothesis: object.summary,
      supportingEvidence: [object.safeNextAction, ...object.assumptions],
      missingData: object.missingData,
      confidence: object.score.confidence,
      expectedValue: object.score.revenueRelevance,
      urgency: object.score.urgency,
      estimatedEffort: object.missingData.length > 0 ? 64 : 42,
      dataCompleteness: object.score.dataCompleteness,
      governanceRisk: object.score.governanceRisk,
      departmentReadiness: 65,
      bottleneckSeverity: object.missingData.length * 12,
      safeNextAction: object.safeNextAction,
    }));
}

function priorityFromScore(score: number): RevenueOpportunityPriority {
  if (score >= 82) return "critical";
  if (score >= 68) return "high";
  if (score >= 48) return "medium";

  return "low";
}

function prioritize(opportunities: AdvisoryRevenueOpportunity[]): PrioritizedRevenueOpportunity[] {
  const sorted = [...opportunities].sort((a, b) => b.score.totalScore - a.score.totalScore || b.score.impactScore - a.score.impactScore || a.originatingDepartment.localeCompare(b.originatingDepartment));
  const bestRiskRewardId = sorted.find((item) => item.score.governanceRisk <= 45 && item.score.totalScore >= 60)?.id ?? sorted[0]?.id;

  return sorted.map((opportunity, index) => ({
    prioritizationVersion: "sprint-12c-v1",
    opportunityId: opportunity.id,
    rank: index + 1,
    priority: priorityFromScore(opportunity.score.totalScore),
    originatingDepartment: opportunity.originatingDepartment,
    totalScore: opportunity.score.totalScore,
    expectedBusinessImpact: opportunity.score.impactScore,
    feasibilityScore: opportunity.score.feasibilityScore,
    reviewFirstReason: opportunity.score.explanation,
    bestRiskReward: opportunity.id === bestRiskRewardId,
    blockedByMissingData: opportunity.missingData.length > 0 || opportunity.dataCompleteness < 45,
    owningDepartment: opportunity.originatingDepartment,
    nextInternalStep: opportunity.safeNextAction,
    requiresHumanReview: true,
    advisoryOnly: true,
    providerCalled: false,
    liveExecutionAllowed: false,
    externalWritesAllowed: false,
  }));
}

function createExecutiveBrief(opportunities: AdvisoryRevenueOpportunity[], enterpriseOpportunities: EnterpriseOpportunity[], queue: PrioritizedRevenueOpportunity[], departmentOperatingSystem: DepartmentOperatingSystemReport): ExecutiveRevenueBrief {
  const byId = new Map(opportunities.map((opportunity) => [opportunity.id, opportunity]));
  const enterpriseBySourceId = new Map(enterpriseOpportunities.map((opportunity) => [opportunity.createdFrom.sourceId, opportunity]));
  const topFiveOpportunities = queue.slice(0, 5);
  const topObjects = topFiveOpportunities.map((item) => byId.get(item.opportunityId)).filter((item): item is AdvisoryRevenueOpportunity => Boolean(item));
  const topEnterpriseOpportunities = topFiveOpportunities.map((item) => enterpriseBySourceId.get(item.opportunityId)).filter((item): item is EnterpriseOpportunity => Boolean(item));
  const departmentsNeedingAttention = [...new Set([
    ...topFiveOpportunities.filter((item) => item.priority === "critical" || item.blockedByMissingData).map((item) => item.owningDepartment),
    ...departmentOperatingSystem.executiveMissionReview.map((item) => item.department),
  ])].slice(0, 8);
  const missingDataBlockingRevenue = [...new Set(topObjects.flatMap((item) => item.missingData))].slice(0, 8);

  return {
    briefVersion: "sprint-12d-v1",
    title: "Daily Executive Revenue Brief",
    topFiveOpportunities,
    enterpriseOpportunityContract: {
      contractVersion: "enterprise-opportunity-v1",
      topOpportunityStatuses: topEnterpriseOpportunities.map((item) => ({
        opportunityId: item.id,
        status: item.status,
        requiredApprovals: item.requiredApprovals,
      })),
      requiredApprovalLabels: [...new Set(topEnterpriseOpportunities.flatMap((item) => item.requiredApprovals))].slice(0, 8),
      opportunityLifecycleAdvisoryOnly: true,
      approvalAsExecutionAllowed: false,
    },
    revenueRisks: [
      ...topObjects.filter((item) => item.governanceRisk >= 60).map((item) => `${item.originatingDepartment}: governance risk limits ${item.title}.`),
      ...(missingDataBlockingRevenue.length > 0 ? [`${missingDataBlockingRevenue.length} missing-data item(s) reduce revenue confidence.`] : []),
    ].slice(0, 8),
    bottlenecks: [
      ...topObjects.filter((item) => item.bottleneckSeverity >= 50).map((item) => `${item.originatingDepartment}: ${item.missingData[0] ?? "dependency bottleneck"}.`),
      ...departmentOperatingSystem.dependencies.slice(0, 4).map((item) => `${item.fromDepartment} waiting on ${item.toDepartment}.`),
    ].slice(0, 8),
    departmentsNeedingAttention,
    missingDataBlockingRevenue,
    recommendedInternalDecisions: topObjects.map((item) => `${item.originatingDepartment}: ${item.safeNextAction}`).slice(0, 5),
    approvalAsExecutionAllowed: false,
    requiresHumanReview: true,
    advisoryOnly: true,
    providerCalled: false,
    liveExecutionAllowed: false,
    externalWritesAllowed: false,
  };
}

function createClosedLoopLearning(input: RevenueIntelligenceOpportunityEngineInput, opportunities: AdvisoryRevenueOpportunity[]): AdvisoryClosedLoopLearning {
  const observedOutcomeSignals = [
    ...(input.revenueCommandCenter?.decisionFeedback.accepted ? [`${input.revenueCommandCenter.decisionFeedback.accepted} accepted advisory decision(s).`] : []),
    ...(input.revenueCommandCenter?.decisionFeedback.modified ? [`${input.revenueCommandCenter.decisionFeedback.modified} modified advisory decision(s).`] : []),
    ...(input.revenueCommandCenter?.decisionFeedback.unknownOutcome ? [`${input.revenueCommandCenter.decisionFeedback.unknownOutcome} unknown advisory outcome(s).`] : []),
    ...(input.departmentOperatingSystem.telemetry.confidenceDriftWatch.length > 0 ? [`${input.departmentOperatingSystem.telemetry.confidenceDriftWatch.length} department confidence drift watch item(s).`] : []),
  ];
  const expectedVsObservedGaps = [
    ...(input.revenueCommandCenter && input.revenueCommandCenter.decisionFeedback.unknownOutcome > 0 ? ["Decision outcomes are not complete enough to validate expected value."] : []),
    ...(opportunities.some((item) => item.missingData.length > 0) ? ["Missing data reduces opportunity score confidence."] : []),
  ];

  return {
    learningVersion: "sprint-12e-v1",
    comparedSignals: observedOutcomeSignals.length,
    observedOutcomeSignals,
    recommendationQualityNotes: [
      "Use observed outcomes to improve future scoring weights only after governance approves persistence.",
      "Keep expected-value learning advisory until memory/KPI writes are separately authorized.",
    ],
    expectedVsObservedGaps,
    nextRecommendationImprovement: expectedVsObservedGaps[0] ?? "Continue comparing expected value with reviewed outcomes before increasing autonomy.",
    memoryPersistenceAllowed: false,
    kpiPersistenceAllowed: false,
    automationAllowed: false,
    advisoryOnly: true,
    providerCalled: false,
    liveExecutionAllowed: false,
  };
}

export function createRevenueIntelligenceOpportunityEngineReportFromInputs(input: RevenueIntelligenceOpportunityEngineInput): RevenueIntelligenceOpportunityEngineReport {
  const generatedAt = input.generatedAt ?? input.departmentOperatingSystem.generatedAt ?? input.marketCustomerIntelligence.generatedAt ?? new Date().toISOString();
  const opportunities = [
    ...opportunitiesFromMissions(input, generatedAt),
    ...opportunitiesFromRevenueCommandCenter(input.revenueCommandCenter, generatedAt),
    ...opportunitiesFromMarketIntelligence(input.marketCustomerIntelligence, generatedAt),
  ];
  const prioritizedQueue = prioritize(opportunities);
  const enterpriseOpportunities = createEnterpriseOpportunitiesFromRevenueEngine({ opportunities, prioritizedQueue });
  const report: RevenueIntelligenceOpportunityEngineReport = {
    ok: true,
    sprint: "12",
    generatedAt,
    doctrine: "Opportunity detection, scoring, prioritization, and executive revenue recommendations only. No execution authority.",
    opportunities,
    enterpriseOpportunities,
    prioritizedQueue,
    executiveRevenueBrief: createExecutiveBrief(opportunities, enterpriseOpportunities, prioritizedQueue, input.departmentOperatingSystem),
    closedLoopLearning: createClosedLoopLearning(input, opportunities),
    technicalDebtBacklog: [
      {
        issue: "ESLint silent timeout",
        priority: "high",
        recommendation: "Investigate before production readiness so lint becomes a dependable CI gate; record bounded lint as inconclusive until resolved.",
      },
      {
        issue: "Turbopack tracing warning",
        priority: "medium",
        recommendation: "Track separately and resolve when actionable; do not block functional progress unless it becomes a build failure.",
      },
    ],
    safety: {
      readOnly: true,
      advisoryOnly: true,
      requiresHumanReview: true,
      providerCalled: false,
      liveExecutionAllowed: false,
      externalWritesAllowed: false,
      connectorActivationAllowed: false,
      crmMutationAllowed: false,
      leadCreationAllowed: false,
      outreachAllowed: false,
      publishingAllowed: false,
      scrapingAllowed: false,
      autonomousWorkAllowed: false,
      memoryPersistenceAllowed: false,
      kpiPersistenceAllowed: false,
      approvalAsExecutionAllowed: false,
    },
    providerCalled: false,
    liveExecutionAllowed: false,
  };
  assertEnterpriseOpportunityContractSafety(enterpriseOpportunities);
  assertRevenueIntelligenceOpportunityEngineSafety(report);

  return report;
}

export function assertRevenueIntelligenceOpportunityEngineSafety(report: RevenueIntelligenceOpportunityEngineReport) {
  const serialized = JSON.stringify(report);
  const unsafe = [
    report.providerCalled,
    report.liveExecutionAllowed,
    !report.safety.readOnly,
    !report.safety.advisoryOnly,
    !report.safety.requiresHumanReview,
    report.safety.providerCalled,
    report.safety.liveExecutionAllowed,
    report.safety.externalWritesAllowed,
    report.safety.connectorActivationAllowed,
    report.safety.crmMutationAllowed,
    report.safety.leadCreationAllowed,
    report.safety.outreachAllowed,
    report.safety.publishingAllowed,
    report.safety.scrapingAllowed,
    report.safety.autonomousWorkAllowed,
    report.safety.memoryPersistenceAllowed,
    report.safety.kpiPersistenceAllowed,
    report.safety.approvalAsExecutionAllowed,
    report.opportunities.some((item) => !item.advisoryOnly || !item.requiresHumanReview || item.providerCalled || item.liveExecutionAllowed || item.externalWritesAllowed),
    report.enterpriseOpportunities.some((item) => !item.governanceFlags.advisoryOnly || !item.governanceFlags.requiresHumanReview || item.governanceFlags.providerCalled || item.governanceFlags.liveExecutionAllowed || item.governanceFlags.externalWritesAllowed || item.governanceFlags.approvalAsExecutionAllowed),
    report.prioritizedQueue.some((item) => !item.advisoryOnly || !item.requiresHumanReview || item.providerCalled || item.liveExecutionAllowed || item.externalWritesAllowed),
    !report.executiveRevenueBrief.advisoryOnly || report.executiveRevenueBrief.approvalAsExecutionAllowed || report.executiveRevenueBrief.providerCalled || report.executiveRevenueBrief.liveExecutionAllowed || report.executiveRevenueBrief.externalWritesAllowed,
    report.closedLoopLearning.memoryPersistenceAllowed || report.closedLoopLearning.kpiPersistenceAllowed || report.closedLoopLearning.automationAllowed || report.closedLoopLearning.providerCalled || report.closedLoopLearning.liveExecutionAllowed,
  ];

  if (unsafe.some(Boolean)) {
    throw new Error("Revenue Intelligence Opportunity Engine safety contract failed.");
  }
  if (/ya29\.|GOCSPX-|refresh-token|client-secret|BEGIN PRIVATE KEY|authorization|bearer\s+|https:\/\/www\.googleapis\.com|gmail\.googleapis\.com|drive\.googleapis\.com|analytics\.googleapis\.com|searchconsole\.googleapis\.com/iu.test(serialized)) {
    throw new Error("Revenue Intelligence Opportunity Engine exposed secret-like values or provider endpoints.");
  }
  if (/send_email|send_sms|publish_post|reply_to_review|create_lead|crm_mutation|autonomous_work_order|provider_write|drive\.files\.create|drafts\.send|calendar\.events\.insert/iu.test(serialized)) {
    throw new Error("Revenue Intelligence Opportunity Engine exposed blocked execution actions.");
  }

  return true;
}
