import type { AiWorkforceDepartmentName } from "@/lib/ai-workforce";
import {
  assertEnterpriseOpportunityContractSafety,
  enterpriseOpportunityStatuses,
  enterpriseOpportunityTypes,
  type EnterpriseOpportunity,
} from "@/lib/enterprise-opportunity-contract";

export const customerJourneyStages = [
  "new_signal",
  "qualification",
  "needs_research",
  "needs_department_review",
  "needs_ceo_review",
  "ready_for_internal_follow_up",
  "waiting_on_customer",
  "waiting_on_data",
  "stalled",
  "closing_completed",
  "follow_up_opportunity",
  "referral_opportunity",
  "blocked",
  "closed_advisory",
] as const;

export type CustomerJourneyStage = (typeof customerJourneyStages)[number];
export type CustomerType = "seller" | "buyer" | "referral_partner" | "internal_stakeholder";
export type CustomerJourneyType = "seller_acquisition" | "buyer_disposition" | "referral_growth" | "internal_revenue_operations" | "customer_follow_up";
export type CustomerJourneyRiskLevel = "high" | "medium" | "low";
export type CustomerJourneyStatus = "active_advisory" | "needs_review" | "waiting_on_data" | "blocked" | "closed_advisory" | "not_customer_facing";

export type CustomerJourneyGovernanceFlags = {
  requiresHumanReview: true;
  advisoryOnly: true;
  providerCalled: false;
  liveExecutionAllowed: false;
  externalWritesAllowed: false;
  approvalAsExecutionAllowed: false;
  crmMutationAllowed: false;
  leadCreationAllowed: false;
  outreachAllowed: false;
  publishingAllowed: false;
  scrapingAllowed: false;
  autonomousWorkAllowed: false;
  memoryPersistenceAllowed: false;
  kpiPersistenceAllowed: false;
};

export type EnterpriseOpportunityIntakeRecord = {
  opportunityId: string;
  accepted: boolean;
  blockedReasons: string[];
  classification: "journey_ready" | "not_customer_facing" | "blocked";
  sourceDepartment?: AiWorkforceDepartmentName;
  ownerDepartment?: AiWorkforceDepartmentName;
  requiresHumanReview: true;
  advisoryOnly: true;
  providerCalled: false;
  liveExecutionAllowed: false;
};

export type CustomerJourneyStageMapping = {
  opportunityId: string;
  journeyId?: string;
  stages: CustomerJourneyStage[];
  classification: "mapped_to_journey" | "not_customer_facing" | "coverage_gap" | "blocked";
  reason: string;
  providerCalled: false;
  liveExecutionAllowed: false;
};

export type CustomerJourneyRecord = {
  journeyId: string;
  sourceOpportunityIds: string[];
  customerType: CustomerType;
  journeyType: CustomerJourneyType;
  currentStage: CustomerJourneyStage;
  recommendedNextStep: string;
  ownerDepartment: AiWorkforceDepartmentName;
  supportingDepartments: AiWorkforceDepartmentName[];
  riskLevel: CustomerJourneyRiskLevel;
  requiredApprovals: string[];
  status: CustomerJourneyStatus;
  stageHistory: Array<{
    stage: CustomerJourneyStage;
    label: string;
    sourceOpportunityId: string;
  }>;
  evidence: string[];
  missingData: string[];
  governanceFlags: CustomerJourneyGovernanceFlags;
};

export type DepartmentResponsibilityMatrixEntry = {
  journeyId: string;
  sourceOpportunityId: string;
  ownerDepartment: AiWorkforceDepartmentName;
  supportingDepartments: AiWorkforceDepartmentName[];
  responsibilityReason: string;
  escalationDepartment?: AiWorkforceDepartmentName;
  advisoryOnly: true;
  providerCalled: false;
  liveExecutionAllowed: false;
};

export type AdvisoryTouchpointPlan = {
  journeyId: string;
  sourceOpportunityId: string;
  recommendation: string;
  touchpointType: "call_prep" | "draft_intent" | "crm_task_concept" | "follow_up_timing" | "data_to_collect" | "ceo_review_prompt";
  internalOnly: true;
  sendAllowed: false;
  crmWriteAllowed: false;
  leadCreationAllowed: false;
  providerCalled: false;
  liveExecutionAllowed: false;
};

export type FunnelVisibilityAndBottleneckIntelligence = {
  progression: Array<{ stage: CustomerJourneyStage; count: number }>;
  dropOffPoints: string[];
  bottlenecks: string[];
  missingDataPatterns: string[];
  opportunityCoverage: {
    totalOpportunities: number;
    mappedToJourney: number;
    notCustomerFacing: number;
    coverageGaps: number;
    blocked: number;
  };
  departmentOwnership: Array<{ department: AiWorkforceDepartmentName; journeyCount: number }>;
  advisoryOnly: true;
  providerCalled: false;
  liveExecutionAllowed: false;
};

export type ExecutiveCustomerJourneyBrief = {
  briefVersion: "sprint-13g-v1";
  title: "Executive Customer Journey Brief";
  journeysThatMatterToday: string[];
  stalledJourneys: string[];
  opportunitiesWithoutJourneyCoverage: string[];
  followUpOrReferralOpportunities: string[];
  departmentsOwningNextSteps: Array<{ department: AiWorkforceDepartmentName; nextSteps: string[] }>;
  requiresCeoOrSafetyReview: string[];
  requiresHumanReview: true;
  advisoryOnly: true;
  providerCalled: false;
  liveExecutionAllowed: false;
  externalWritesAllowed: false;
  approvalAsExecutionAllowed: false;
};

export type JourneyTelemetry = {
  telemetryVersion: "sprint-13h-v1";
  journeyVolume: number;
  stageDistribution: Array<{ stage: CustomerJourneyStage; count: number }>;
  averageTimeInStageLabels: string[];
  blockedReasons: string[];
  missingDataFrequency: Array<{ missingData: string; count: number }>;
  departmentBottlenecks: string[];
  opportunityToJourneyCoverage: number;
  recommendationQuality: "needs_more_outcomes" | "review_ready";
  memoryPersistenceAllowed: false;
  kpiPersistenceAllowed: false;
  advisoryOnly: true;
  providerCalled: false;
  liveExecutionAllowed: false;
};

export type CustomerJourneyOperatingLayerReport = {
  ok: true;
  sprint: "13";
  generatedAt: string;
  doctrine: "Customer journey visibility, stage intelligence, department ownership, advisory recommendations, executive review, and telemetry only. No execution authority.";
  intakeGate: EnterpriseOpportunityIntakeRecord[];
  journeys: CustomerJourneyRecord[];
  stageMappings: CustomerJourneyStageMapping[];
  departmentResponsibilityMatrix: DepartmentResponsibilityMatrixEntry[];
  advisoryTouchpointPlans: AdvisoryTouchpointPlan[];
  funnelIntelligence: FunnelVisibilityAndBottleneckIntelligence;
  executiveCustomerJourneyBrief: ExecutiveCustomerJourneyBrief;
  telemetry: JourneyTelemetry;
  safety: CustomerJourneyGovernanceFlags;
  providerCalled: false;
  liveExecutionAllowed: false;
};

export type CustomerJourneyOperatingLayerInput = {
  enterpriseOpportunities: EnterpriseOpportunity[];
  generatedAt?: string;
};

export const customerJourneyGovernanceFlags: CustomerJourneyGovernanceFlags = {
  requiresHumanReview: true,
  advisoryOnly: true,
  providerCalled: false,
  liveExecutionAllowed: false,
  externalWritesAllowed: false,
  approvalAsExecutionAllowed: false,
  crmMutationAllowed: false,
  leadCreationAllowed: false,
  outreachAllowed: false,
  publishingAllowed: false,
  scrapingAllowed: false,
  autonomousWorkAllowed: false,
  memoryPersistenceAllowed: false,
  kpiPersistenceAllowed: false,
};

function slug(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 90) || "journey";
}

function isUnsafePayload(value: unknown) {
  return /ya29\.|GOCSPX-|refresh-token|client-secret|BEGIN PRIVATE KEY|authorization|bearer\s+|https:\/\/www\.googleapis\.com|gmail\.googleapis\.com|drive\.googleapis\.com|analytics\.googleapis\.com|searchconsole\.googleapis\.com|send_email|send_sms|publish_post|reply_to_review|create_lead|crm_mutation|autonomous_work_order|provider_write|drive\.files\.create|drafts\.send|calendar\.events\.insert/iu.test(JSON.stringify(value));
}

function intakeOpportunity(opportunity: EnterpriseOpportunity): EnterpriseOpportunityIntakeRecord {
  const flags = opportunity.governanceFlags;
  const blockedReasons = [
    opportunity.version !== "enterprise-opportunity-v1" ? "Opportunity must use enterprise-opportunity-v1." : "",
    !enterpriseOpportunityTypes.includes(opportunity.type) ? "Opportunity type is not supported." : "",
    !enterpriseOpportunityStatuses.includes(opportunity.status) ? "Opportunity status is not supported." : "",
    !opportunity.sourceDepartment ? "Source department is required." : "",
    !opportunity.ownerDepartment ? "Owner department is required." : "",
    opportunity.evidence.length === 0 ? "Evidence is required." : "",
    opportunity.requiredApprovals.length === 0 ? "Required approval labels are required." : "",
    !flags?.requiresHumanReview || !flags?.advisoryOnly ? "Advisory governance flags are required." : "",
    flags?.providerCalled || flags?.liveExecutionAllowed || flags?.externalWritesAllowed || flags?.approvalAsExecutionAllowed ? "Execution governance flags must remain false." : "",
    flags?.crmMutationAllowed || flags?.leadCreationAllowed || flags?.outreachAllowed || flags?.publishingAllowed || flags?.scrapingAllowed || flags?.autonomousWorkAllowed || flags?.memoryPersistenceAllowed || flags?.kpiPersistenceAllowed ? "Customer journey execution drift is blocked." : "",
    isUnsafePayload(opportunity) ? "Provider/action payloads are blocked." : "",
  ].filter(Boolean);
  const notCustomerFacing = opportunity.type === "compliance" || opportunity.type === "data_gap";

  return {
    opportunityId: opportunity.id,
    accepted: blockedReasons.length === 0,
    blockedReasons,
    classification: blockedReasons.length > 0 ? "blocked" : notCustomerFacing ? "not_customer_facing" : "journey_ready",
    sourceDepartment: opportunity.sourceDepartment,
    ownerDepartment: opportunity.ownerDepartment,
    requiresHumanReview: true,
    advisoryOnly: true,
    providerCalled: false,
    liveExecutionAllowed: false,
  };
}

function customerTypeForOpportunity(opportunity: EnterpriseOpportunity): CustomerType {
  if (opportunity.type === "acquisition") return "seller";
  if (opportunity.type === "marketing" && /referral/i.test(`${opportunity.title} ${opportunity.evidence.join(" ")}`)) return "referral_partner";
  if (opportunity.type === "customer_journey" && /buyer/i.test(`${opportunity.title} ${opportunity.evidence.join(" ")}`)) return "buyer";
  if (opportunity.type === "operations") return "internal_stakeholder";

  return "seller";
}

function journeyTypeForOpportunity(opportunity: EnterpriseOpportunity, customerType: CustomerType): CustomerJourneyType {
  if (customerType === "referral_partner") return "referral_growth";
  if (customerType === "buyer") return "buyer_disposition";
  if (opportunity.type === "operations") return "internal_revenue_operations";
  if (opportunity.type === "customer_journey") return "customer_follow_up";

  return "seller_acquisition";
}

function stagesForOpportunity(opportunity: EnterpriseOpportunity): CustomerJourneyStage[] {
  const text = `${opportunity.title} ${opportunity.evidence.join(" ")} ${opportunity.recommendedActions.join(" ")}`;
  if (opportunity.status === "blocked") return ["blocked"];
  if (opportunity.status === "closed_advisory") return ["closed_advisory"];
  if (/closing completed|completed closing|closed deal/i.test(text)) return ["closing_completed", "follow_up_opportunity"];
  if (/referral/i.test(text)) return ["referral_opportunity"];
  if (opportunity.status === "needs_ceo_review") return ["needs_ceo_review"];
  if (opportunity.status === "needs_data") return ["needs_research", "waiting_on_data"];
  if (opportunity.type === "operations" || opportunity.status === "under_review") return ["needs_department_review", "stalled"];
  if (opportunity.type === "marketing" || opportunity.type === "customer_journey") return ["ready_for_internal_follow_up"];
  if (opportunity.type === "acquisition") return ["new_signal", "qualification"];

  return ["new_signal"];
}

function ownerForOpportunity(opportunity: EnterpriseOpportunity, stages: CustomerJourneyStage[]): AiWorkforceDepartmentName {
  if (stages.includes("needs_ceo_review")) return "CEO Office";
  if (stages.includes("blocked") || opportunity.requiredApprovals.includes("Approval / Safety review")) return "Approval / Safety";
  if (stages.includes("stalled")) return "Operations";
  if (stages.includes("referral_opportunity")) return "Marketing";
  if (opportunity.type === "marketing") return "Marketing";
  if (opportunity.type === "customer_journey") return "CRM";
  if (opportunity.type === "acquisition") return "Seller Acquisition";

  return opportunity.ownerDepartment;
}

function supportDepartmentsForOpportunity(opportunity: EnterpriseOpportunity, ownerDepartment: AiWorkforceDepartmentName, stages: CustomerJourneyStage[]): AiWorkforceDepartmentName[] {
  const departments = new Set<AiWorkforceDepartmentName>([opportunity.sourceDepartment, opportunity.ownerDepartment, "CRM"]);
  if (stages.includes("needs_ceo_review")) departments.add("CEO Office");
  if (opportunity.requiredApprovals.some((approval) => /safety/i.test(approval))) departments.add("Approval / Safety");
  if (opportunity.type === "marketing") {
    departments.add("Content");
    departments.add("SEO");
  }
  if (stages.includes("stalled")) departments.add("Operations");
  departments.delete(ownerDepartment);

  return [...departments].slice(0, 5);
}

function riskForOpportunity(opportunity: EnterpriseOpportunity, stages: CustomerJourneyStage[]): CustomerJourneyRiskLevel {
  if (stages.includes("blocked") || opportunity.requiredApprovals.includes("Approval / Safety review")) return "high";
  if (stages.includes("needs_ceo_review") || opportunity.missingData.length > 0 || opportunity.priority === "critical") return "medium";

  return "low";
}

function statusForStages(stages: CustomerJourneyStage[]): CustomerJourneyStatus {
  if (stages.includes("blocked")) return "blocked";
  if (stages.includes("closed_advisory")) return "closed_advisory";
  if (stages.includes("waiting_on_data")) return "waiting_on_data";
  if (stages.includes("needs_ceo_review") || stages.includes("needs_department_review")) return "needs_review";

  return "active_advisory";
}

function createJourney(opportunity: EnterpriseOpportunity, generatedAt: string): CustomerJourneyRecord {
  const stages = stagesForOpportunity(opportunity);
  const currentStage = stages[stages.length - 1] ?? "new_signal";
  const ownerDepartment = ownerForOpportunity(opportunity, stages);
  const customerType = customerTypeForOpportunity(opportunity);

  return {
    journeyId: `customer-journey-${generatedAt.slice(0, 10)}-${slug(opportunity.id)}`,
    sourceOpportunityIds: [opportunity.id],
    customerType,
    journeyType: journeyTypeForOpportunity(opportunity, customerType),
    currentStage,
    recommendedNextStep: opportunity.nextInternalStep,
    ownerDepartment,
    supportingDepartments: supportDepartmentsForOpportunity(opportunity, ownerDepartment, stages),
    riskLevel: riskForOpportunity(opportunity, stages),
    requiredApprovals: opportunity.requiredApprovals,
    status: statusForStages(stages),
    stageHistory: stages.map((stage) => ({
      stage,
      label: `${stage.replace(/_/g, " ")} from ${opportunity.id}`,
      sourceOpportunityId: opportunity.id,
    })),
    evidence: opportunity.evidence,
    missingData: opportunity.missingData,
    governanceFlags: customerJourneyGovernanceFlags,
  };
}

function createStageMappings(opportunities: EnterpriseOpportunity[], intakeGate: EnterpriseOpportunityIntakeRecord[], journeys: CustomerJourneyRecord[]): CustomerJourneyStageMapping[] {
  const intakeById = new Map(intakeGate.map((item) => [item.opportunityId, item]));
  const journeyByOpportunityId = new Map(journeys.flatMap((journey) => journey.sourceOpportunityIds.map((id) => [id, journey] as const)));

  return opportunities.map((opportunity) => {
    const intake = intakeById.get(opportunity.id);
    const journey = journeyByOpportunityId.get(opportunity.id);
    if (!intake?.accepted) {
      return {
        opportunityId: opportunity.id,
        stages: [],
        classification: "blocked",
        reason: intake?.blockedReasons.join(" ") || "Opportunity failed intake.",
        providerCalled: false,
        liveExecutionAllowed: false,
      };
    }
    if (intake.classification === "not_customer_facing") {
      return {
        opportunityId: opportunity.id,
        stages: [],
        classification: "not_customer_facing",
        reason: "Opportunity is advisory but not customer-facing.",
        providerCalled: false,
        liveExecutionAllowed: false,
      };
    }
    if (!journey) {
      return {
        opportunityId: opportunity.id,
        stages: [],
        classification: "coverage_gap",
        reason: "Opportunity did not map to a customer journey stage.",
        providerCalled: false,
        liveExecutionAllowed: false,
      };
    }

    return {
      opportunityId: opportunity.id,
      journeyId: journey.journeyId,
      stages: journey.stageHistory.map((item) => item.stage),
      classification: "mapped_to_journey",
      reason: "Enterprise Opportunity mapped deterministically to customer journey stage(s).",
      providerCalled: false,
      liveExecutionAllowed: false,
    };
  });
}

function createDepartmentResponsibilityMatrix(journeys: CustomerJourneyRecord[]): DepartmentResponsibilityMatrixEntry[] {
  return journeys.map((journey) => ({
    journeyId: journey.journeyId,
    sourceOpportunityId: journey.sourceOpportunityIds[0] ?? journey.journeyId,
    ownerDepartment: journey.ownerDepartment,
    supportingDepartments: journey.supportingDepartments,
    responsibilityReason: `${journey.ownerDepartment} owns ${journey.currentStage.replace(/_/g, " ")} for ${journey.customerType} journey review.`,
    escalationDepartment: journey.riskLevel === "high" ? "Approval / Safety" : journey.currentStage === "needs_ceo_review" ? "CEO Office" : undefined,
    advisoryOnly: true,
    providerCalled: false,
    liveExecutionAllowed: false,
  }));
}

function touchpointForJourney(journey: CustomerJourneyRecord): AdvisoryTouchpointPlan {
  const stageText = journey.currentStage.replace(/_/g, " ");
  const recommendation = journey.currentStage === "stalled"
    ? "Lead has stalled at Qualification for 10 days. Prepare an internal review of missing blockers before any contact."
    : journey.currentStage === "follow_up_opportunity"
      ? "Customer completed closing but no follow-up opportunity exists. Prepare an internal follow-up review."
      : journey.currentStage === "referral_opportunity"
        ? "Referral opportunity identified. Prepare internal referral review and attribution notes."
        : journey.currentStage === "waiting_on_data"
          ? `Journey is waiting on data. Review missing data: ${journey.missingData[0] ?? "unknown data gap"}.`
          : journey.currentStage === "needs_ceo_review"
            ? "High-impact journey requires CEO review before any next step can be considered."
            : `Prepare internal ${stageText} review.`;

  return {
    journeyId: journey.journeyId,
    sourceOpportunityId: journey.sourceOpportunityIds[0] ?? journey.journeyId,
    recommendation,
    touchpointType: journey.currentStage === "needs_ceo_review"
      ? "ceo_review_prompt"
      : journey.currentStage === "waiting_on_data"
        ? "data_to_collect"
        : journey.currentStage === "ready_for_internal_follow_up" || journey.currentStage === "follow_up_opportunity" || journey.currentStage === "referral_opportunity"
          ? "follow_up_timing"
          : journey.currentStage === "qualification"
            ? "call_prep"
            : "crm_task_concept",
    internalOnly: true,
    sendAllowed: false,
    crmWriteAllowed: false,
    leadCreationAllowed: false,
    providerCalled: false,
    liveExecutionAllowed: false,
  };
}

function countByStage(journeys: CustomerJourneyRecord[]) {
  return customerJourneyStages
    .map((stage) => ({ stage, count: journeys.filter((journey) => journey.currentStage === stage || journey.stageHistory.some((item) => item.stage === stage)).length }))
    .filter((item) => item.count > 0);
}

function createFunnelIntelligence(opportunities: EnterpriseOpportunity[], journeys: CustomerJourneyRecord[], mappings: CustomerJourneyStageMapping[]): FunnelVisibilityAndBottleneckIntelligence {
  const progression = countByStage(journeys);
  const mappedToJourney = mappings.filter((item) => item.classification === "mapped_to_journey").length;
  const notCustomerFacing = mappings.filter((item) => item.classification === "not_customer_facing").length;
  const coverageGaps = mappings.filter((item) => item.classification === "coverage_gap").length;
  const blocked = mappings.filter((item) => item.classification === "blocked").length;
  const missingData = [...new Set(journeys.flatMap((journey) => journey.missingData))].slice(0, 8);
  const owners = [...new Set(journeys.map((journey) => journey.ownerDepartment))];

  return {
    progression,
    dropOffPoints: progression.filter((item) => item.stage === "waiting_on_data" || item.stage === "stalled" || item.stage === "blocked").map((item) => `${item.stage}: ${item.count} journey(s).`),
    bottlenecks: [
      ...journeys.filter((journey) => journey.currentStage === "stalled").map((journey) => `${journey.ownerDepartment}: stalled journey ${journey.journeyId}.`),
      ...journeys.filter((journey) => journey.missingData.length > 0).map((journey) => `${journey.ownerDepartment}: missing ${journey.missingData[0]}.`),
    ].slice(0, 8),
    missingDataPatterns: missingData,
    opportunityCoverage: {
      totalOpportunities: opportunities.length,
      mappedToJourney,
      notCustomerFacing,
      coverageGaps,
      blocked,
    },
    departmentOwnership: owners.map((department) => ({
      department,
      journeyCount: journeys.filter((journey) => journey.ownerDepartment === department).length,
    })),
    advisoryOnly: true,
    providerCalled: false,
    liveExecutionAllowed: false,
  };
}

function createExecutiveBrief(journeys: CustomerJourneyRecord[], mappings: CustomerJourneyStageMapping[], matrix: DepartmentResponsibilityMatrixEntry[]): ExecutiveCustomerJourneyBrief {
  const topJourneys = [...journeys].sort((a, b) => (a.riskLevel === "high" ? -1 : b.riskLevel === "high" ? 1 : b.requiredApprovals.length - a.requiredApprovals.length)).slice(0, 5);
  const departments = [...new Set(matrix.map((item) => item.ownerDepartment))];

  return {
    briefVersion: "sprint-13g-v1",
    title: "Executive Customer Journey Brief",
    journeysThatMatterToday: topJourneys.map((journey) => `${journey.ownerDepartment}: ${journey.currentStage} - ${journey.recommendedNextStep}`).slice(0, 5),
    stalledJourneys: journeys.filter((journey) => journey.currentStage === "stalled").map((journey) => journey.journeyId).slice(0, 8),
    opportunitiesWithoutJourneyCoverage: mappings.filter((item) => item.classification === "coverage_gap").map((item) => item.opportunityId),
    followUpOrReferralOpportunities: journeys.filter((journey) => journey.currentStage === "follow_up_opportunity" || journey.currentStage === "referral_opportunity").map((journey) => journey.journeyId),
    departmentsOwningNextSteps: departments.map((department) => ({
      department,
      nextSteps: journeys.filter((journey) => journey.ownerDepartment === department).map((journey) => journey.recommendedNextStep).slice(0, 3),
    })).slice(0, 8),
    requiresCeoOrSafetyReview: journeys.filter((journey) => journey.requiredApprovals.some((approval) => /CEO|Safety/i.test(approval))).map((journey) => journey.journeyId).slice(0, 8),
    requiresHumanReview: true,
    advisoryOnly: true,
    providerCalled: false,
    liveExecutionAllowed: false,
    externalWritesAllowed: false,
    approvalAsExecutionAllowed: false,
  };
}

function createTelemetry(journeys: CustomerJourneyRecord[], mappings: CustomerJourneyStageMapping[], funnel: FunnelVisibilityAndBottleneckIntelligence): JourneyTelemetry {
  const missingCounts = new Map<string, number>();
  for (const item of journeys.flatMap((journey) => journey.missingData)) {
    missingCounts.set(item, (missingCounts.get(item) ?? 0) + 1);
  }

  return {
    telemetryVersion: "sprint-13h-v1",
    journeyVolume: journeys.length,
    stageDistribution: funnel.progression,
    averageTimeInStageLabels: journeys.map((journey) => `${journey.currentStage}: advisory duration not persisted`).slice(0, 8),
    blockedReasons: mappings.filter((item) => item.classification === "blocked").map((item) => item.reason).slice(0, 8),
    missingDataFrequency: [...missingCounts.entries()].map(([missingData, count]) => ({ missingData, count })).slice(0, 8),
    departmentBottlenecks: funnel.bottlenecks,
    opportunityToJourneyCoverage: mappings.length ? Math.round((mappings.filter((item) => item.classification === "mapped_to_journey").length / mappings.length) * 100) : 0,
    recommendationQuality: journeys.length > 0 ? "review_ready" : "needs_more_outcomes",
    memoryPersistenceAllowed: false,
    kpiPersistenceAllowed: false,
    advisoryOnly: true,
    providerCalled: false,
    liveExecutionAllowed: false,
  };
}

export function createCustomerJourneyOperatingLayerReportFromInputs(input: CustomerJourneyOperatingLayerInput): CustomerJourneyOperatingLayerReport {
  assertEnterpriseOpportunityContractSafety(input.enterpriseOpportunities.filter((opportunity) => opportunity.version === "enterprise-opportunity-v1"));

  const generatedAt = input.generatedAt ?? new Date().toISOString();
  const intakeGate = input.enterpriseOpportunities.map(intakeOpportunity);
  const journeyReady = input.enterpriseOpportunities.filter((opportunity) => intakeGate.find((item) => item.opportunityId === opportunity.id)?.classification === "journey_ready");
  const journeys = journeyReady.map((opportunity) => createJourney(opportunity, generatedAt));
  const stageMappings = createStageMappings(input.enterpriseOpportunities, intakeGate, journeys);
  const departmentResponsibilityMatrix = createDepartmentResponsibilityMatrix(journeys);
  const advisoryTouchpointPlans = journeys.map(touchpointForJourney);
  const funnelIntelligence = createFunnelIntelligence(input.enterpriseOpportunities, journeys, stageMappings);
  const executiveCustomerJourneyBrief = createExecutiveBrief(journeys, stageMappings, departmentResponsibilityMatrix);
  const telemetry = createTelemetry(journeys, stageMappings, funnelIntelligence);

  const report: CustomerJourneyOperatingLayerReport = {
    ok: true,
    sprint: "13",
    generatedAt,
    doctrine: "Customer journey visibility, stage intelligence, department ownership, advisory recommendations, executive review, and telemetry only. No execution authority.",
    intakeGate,
    journeys,
    stageMappings,
    departmentResponsibilityMatrix,
    advisoryTouchpointPlans,
    funnelIntelligence,
    executiveCustomerJourneyBrief,
    telemetry,
    safety: customerJourneyGovernanceFlags,
    providerCalled: false,
    liveExecutionAllowed: false,
  };

  assertCustomerJourneyOperatingLayerSafety(report);

  return report;
}

export function assertCustomerJourneyOperatingLayerSafety(report: CustomerJourneyOperatingLayerReport) {
  const unsafe = [
    report.providerCalled,
    report.liveExecutionAllowed,
    !report.safety.requiresHumanReview,
    !report.safety.advisoryOnly,
    report.safety.providerCalled,
    report.safety.liveExecutionAllowed,
    report.safety.externalWritesAllowed,
    report.safety.approvalAsExecutionAllowed,
    report.safety.crmMutationAllowed,
    report.safety.leadCreationAllowed,
    report.safety.outreachAllowed,
    report.safety.publishingAllowed,
    report.safety.scrapingAllowed,
    report.safety.autonomousWorkAllowed,
    report.safety.memoryPersistenceAllowed,
    report.safety.kpiPersistenceAllowed,
    report.journeys.some((journey) => !journey.governanceFlags.advisoryOnly || journey.governanceFlags.providerCalled || journey.governanceFlags.liveExecutionAllowed || journey.governanceFlags.externalWritesAllowed || journey.governanceFlags.crmMutationAllowed || journey.governanceFlags.outreachAllowed),
    report.advisoryTouchpointPlans.some((plan) => !plan.internalOnly || plan.sendAllowed || plan.crmWriteAllowed || plan.leadCreationAllowed || plan.providerCalled || plan.liveExecutionAllowed),
    !report.executiveCustomerJourneyBrief.advisoryOnly || report.executiveCustomerJourneyBrief.providerCalled || report.executiveCustomerJourneyBrief.liveExecutionAllowed || report.executiveCustomerJourneyBrief.externalWritesAllowed || report.executiveCustomerJourneyBrief.approvalAsExecutionAllowed,
    report.telemetry.memoryPersistenceAllowed || report.telemetry.kpiPersistenceAllowed || report.telemetry.providerCalled || report.telemetry.liveExecutionAllowed,
  ];

  if (unsafe.some(Boolean)) {
    throw new Error("Customer Journey Operating Layer safety contract failed.");
  }
  if (isUnsafePayload(report)) {
    throw new Error("Customer Journey Operating Layer exposed secret-like values, provider endpoints, or blocked execution actions.");
  }

  return true;
}
