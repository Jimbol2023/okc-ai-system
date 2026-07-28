import type { AiWorkforceDepartmentName } from "@/lib/ai-workforce";
import type {
  DepartmentIntelligencePacket,
  MarketCustomerIntelligenceFoundationReport,
  MarketCustomerIntelligenceScore,
} from "@/lib/market-customer-intelligence-foundation";

export const departmentMissionStatuses = [
  "queued",
  "ready",
  "waiting_on_dependency",
  "blocked",
  "needs_ceo_review",
  "completed",
  "deferred",
] as const;

export type DepartmentMissionStatus = (typeof departmentMissionStatuses)[number];
export type DepartmentMissionPriority = "critical" | "high" | "medium" | "low";
export type DepartmentDependencyType = "handoff" | "dependency" | "blocker_escalation" | "approval_escalation";

export type DepartmentMissionInputContract = {
  contractVersion: "sprint-11a-v1";
  sourcePacketId: string;
  department: AiWorkforceDepartmentName;
  aiManager: string;
  aiEmployees: string[];
  intelligenceObjectIds: string[];
  confidence: number;
  urgency: number;
  revenueRelevance: number;
  dataCompleteness: number;
  governanceRisk: number;
  missingData: string[];
  safeNextAction: string;
  requiresHumanReview: true;
  advisoryOnly: true;
  providerCalled: false;
  liveExecutionAllowed: false;
  externalWritesAllowed: false;
};

export type DepartmentMission = {
  missionVersion: "sprint-11b-v1";
  id: string;
  sourceLabel: string;
  sourcePacketId: string;
  department: AiWorkforceDepartmentName;
  aiOwner: string;
  aiManager: string;
  missionStatus: DepartmentMissionStatus;
  priority: DepartmentMissionPriority;
  priorityScore: number;
  objective: string;
  recommendedOutput: string;
  dependencies: string[];
  risk: "low" | "medium" | "high";
  dueWindow: "today" | "tomorrow" | "this_week";
  approvalRule: string;
  sourceLabels: string[];
  successKpi: string[];
  missingData: string[];
  safeNextAction: string;
  requiresHumanReview: true;
  advisoryOnly: true;
  providerCalled: false;
  liveExecutionAllowed: false;
  externalWritesAllowed: false;
};

export type DepartmentMissionQueueItem = {
  queueVersion: "sprint-11c-v1";
  missionId: string;
  department: AiWorkforceDepartmentName;
  aiOwner: string;
  missionStatus: DepartmentMissionStatus;
  priority: DepartmentMissionPriority;
  priorityScore: number;
  rank: number;
  scheduleWindow: "morning" | "midday" | "afternoon";
  priorityReason: string;
  missingData: string[];
  safeNextAction: string;
  requiresHumanReview: true;
  advisoryOnly: true;
  providerCalled: false;
  liveExecutionAllowed: false;
  externalWritesAllowed: false;
};

export type DepartmentMissionDependency = {
  dependencyVersion: "sprint-11d-v1";
  id: string;
  missionId: string;
  fromDepartment: AiWorkforceDepartmentName;
  toDepartment: AiWorkforceDepartmentName;
  requestType: DepartmentDependencyType;
  title: string;
  neededOutput: string;
  blocker: string | null;
  status: "requested" | "waiting_on_dependency" | "blocked" | "needs_ceo_review";
  safeNextAction: string;
  requiresHumanReview: true;
  advisoryOnly: true;
  providerCalled: false;
  liveExecutionAllowed: false;
  externalWritesAllowed: false;
};

export type ExecutiveMissionReviewPacket = {
  reviewVersion: "sprint-11e-v1";
  missionId: string;
  department: AiWorkforceDepartmentName;
  aiOwner: string;
  reason: string;
  expectedValue: string;
  blockers: string[];
  requiredApproval: string;
  safeDecisionOptions: Array<"review" | "defer" | "request_changes" | "block">;
  approvalAsExecutionAllowed: false;
  requiresHumanReview: true;
  advisoryOnly: true;
  providerCalled: false;
  liveExecutionAllowed: false;
  externalWritesAllowed: false;
};

export type DepartmentPerformanceTelemetry = {
  telemetryVersion: "sprint-11f-v1";
  missionCount: number;
  readyCount: number;
  blockedCount: number;
  needsCeoReviewCount: number;
  dependencyCount: number;
  dataGapCount: number;
  averageConfidence: number;
  averagePriorityScore: number;
  confidenceDriftWatch: Array<{
    department: AiWorkforceDepartmentName;
    confidence: number;
    reason: string;
  }>;
  outcomePersistenceAllowed: false;
  memoryPersistenceAllowed: false;
  kpiPersistenceAllowed: false;
  advisoryOnly: true;
  providerCalled: false;
  liveExecutionAllowed: false;
};

export type DepartmentOperatingSystemReport = {
  ok: true;
  sprint: "11";
  generatedAt: string;
  missionInputContracts: DepartmentMissionInputContract[];
  missions: DepartmentMission[];
  missionQueue: DepartmentMissionQueueItem[];
  dependencies: DepartmentMissionDependency[];
  executiveMissionReview: ExecutiveMissionReviewPacket[];
  telemetry: DepartmentPerformanceTelemetry;
  technicalDebtBacklog: Array<{
    issue: "ESLint silent timeout" | "Turbopack tracing warning";
    priority: "high" | "medium";
    status: "active";
    nextSafeAction: string;
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
    autonomousWorkflowsAllowed: false;
    memoryPersistenceAllowed: false;
    kpiPersistenceAllowed: false;
    approvalAsExecutionAllowed: false;
  };
  providerCalled: false;
  liveExecutionAllowed: false;
};

export type DepartmentOperatingSystemInput = {
  intelligence: MarketCustomerIntelligenceFoundationReport;
  generatedAt?: string;
};

function slug(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 90) || "mission";
}

function clamp(value: number) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function average(values: number[], fallback = 0) {
  return values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : fallback;
}

function contractFromPacket(packet: DepartmentIntelligencePacket): DepartmentMissionInputContract {
  return {
    contractVersion: "sprint-11a-v1",
    sourcePacketId: `department-packet:${slug(packet.department)}`,
    department: packet.department,
    aiManager: packet.aiManager,
    aiEmployees: [...packet.aiEmployees],
    intelligenceObjectIds: [...packet.intelligenceObjectIds],
    confidence: packet.score.confidence,
    urgency: packet.score.urgency,
    revenueRelevance: packet.score.revenueRelevance,
    dataCompleteness: packet.score.dataCompleteness,
    governanceRisk: packet.score.governanceRisk,
    missingData: [...packet.missingData],
    safeNextAction: packet.topRecommendation,
    requiresHumanReview: true,
    advisoryOnly: true,
    providerCalled: false,
    liveExecutionAllowed: false,
    externalWritesAllowed: false,
  };
}

function priorityScore(score: MarketCustomerIntelligenceScore, department: AiWorkforceDepartmentName) {
  const ceoRelevance = department === "CEO Office" || department === "Approval / Safety" ? 12 : department === "AI COO" ? 8 : 0;

  return clamp(score.urgency * 0.3 + score.revenueRelevance * 0.3 + score.confidence * 0.2 + score.dataCompleteness * 0.1 - score.governanceRisk * 0.1 + ceoRelevance);
}

function priorityFromScore(score: number): DepartmentMissionPriority {
  if (score >= 80) return "critical";
  if (score >= 65) return "high";
  if (score >= 45) return "medium";

  return "low";
}

function statusForContract(contract: DepartmentMissionInputContract): DepartmentMissionStatus {
  if (contract.governanceRisk >= 70 || contract.department === "Approval / Safety") return "needs_ceo_review";
  if (contract.missingData.length >= 4 || contract.dataCompleteness < 25) return "blocked";
  if (contract.missingData.length > 0 || contract.dataCompleteness < 50) return "waiting_on_dependency";
  if (contract.confidence >= 55) return "ready";

  return "queued";
}

function dueWindow(priority: DepartmentMissionPriority): DepartmentMission["dueWindow"] {
  if (priority === "critical" || priority === "high") return "today";
  if (priority === "medium") return "tomorrow";

  return "this_week";
}

function riskFromGovernance(governanceRisk: number): DepartmentMission["risk"] {
  if (governanceRisk >= 65) return "high";
  if (governanceRisk >= 40) return "medium";

  return "low";
}

function missionFromContract(contract: DepartmentMissionInputContract, generatedAt: string): DepartmentMission {
  const score = priorityScore({
    confidence: contract.confidence,
    freshness: "manual_import_ready",
    revenueRelevance: contract.revenueRelevance,
    urgency: contract.urgency,
    dataCompleteness: contract.dataCompleteness,
    governanceRisk: contract.governanceRisk,
    recommendedDepartment: contract.department,
    safeNextAction: contract.safeNextAction,
  }, contract.department);
  const priority = priorityFromScore(score);
  const missionStatus = statusForContract(contract);

  return {
    missionVersion: "sprint-11b-v1",
    id: ["department-mission", generatedAt.slice(0, 10), slug(contract.department)].join("-"),
    sourceLabel: `sprint-10e:${contract.sourcePacketId}`,
    sourcePacketId: contract.sourcePacketId,
    department: contract.department,
    aiOwner: contract.aiEmployees[0] ?? contract.aiManager,
    aiManager: contract.aiManager,
    missionStatus,
    priority,
    priorityScore: score,
    objective: `Use Sprint 10E intelligence to produce ${contract.department} advisory operating output.`,
    recommendedOutput: contract.safeNextAction,
    dependencies: contract.missingData.length > 0 ? ["Operations data-gap review"] : [],
    risk: riskFromGovernance(contract.governanceRisk),
    dueWindow: dueWindow(priority),
    approvalRule: missionStatus === "needs_ceo_review" ? "CEO review required; approval cannot execute work in Sprint 11." : "Human review required before any action; execution remains blocked.",
    sourceLabels: [`sprint-10e:${contract.sourcePacketId}`, ...contract.intelligenceObjectIds.slice(0, 6)],
    successKpi: [
      "mission_review_completed",
      `${slug(contract.department)}_advisory_output_ready`,
      contract.missingData.length > 0 ? "data_gap_triaged" : "department_context_ready",
    ],
    missingData: contract.missingData,
    safeNextAction: contract.safeNextAction,
    requiresHumanReview: true,
    advisoryOnly: true,
    providerCalled: false,
    liveExecutionAllowed: false,
    externalWritesAllowed: false,
  };
}

function queueFromMissions(missions: DepartmentMission[]): DepartmentMissionQueueItem[] {
  return [...missions]
    .sort((a, b) => b.priorityScore - a.priorityScore || a.department.localeCompare(b.department))
    .map((mission, index) => ({
      queueVersion: "sprint-11c-v1",
      missionId: mission.id,
      department: mission.department,
      aiOwner: mission.aiOwner,
      missionStatus: mission.missionStatus,
      priority: mission.priority,
      priorityScore: mission.priorityScore,
      rank: index + 1,
      scheduleWindow: index < 3 ? "morning" : index < 7 ? "midday" : "afternoon",
      priorityReason: `Ranked by urgency, revenue relevance, confidence, data completeness, governance risk, and CEO relevance; score ${mission.priorityScore}.`,
      missingData: mission.missingData,
      safeNextAction: mission.safeNextAction,
      requiresHumanReview: true,
      advisoryOnly: true,
      providerCalled: false,
      liveExecutionAllowed: false,
      externalWritesAllowed: false,
    }));
}

function dependenciesFromMissions(missions: DepartmentMission[]): DepartmentMissionDependency[] {
  const dependencies: DepartmentMissionDependency[] = [];
  for (const mission of missions) {
    if (mission.missingData.length > 0) {
      dependencies.push({
        dependencyVersion: "sprint-11d-v1",
        id: `mission-dependency-${slug(mission.id)}-operations`,
        missionId: mission.id,
        fromDepartment: mission.department,
        toDepartment: "Operations",
        requestType: mission.missionStatus === "blocked" ? "blocker_escalation" : "dependency",
        title: `${mission.department} data gap review`,
        neededOutput: "Manual data-gap triage note",
        blocker: mission.missingData[0] ?? null,
        status: mission.missionStatus === "blocked" ? "blocked" : "waiting_on_dependency",
        safeNextAction: "Triage missing data manually; do not activate connectors, scrape, mutate CRM, or execute outreach.",
        requiresHumanReview: true,
        advisoryOnly: true,
        providerCalled: false,
        liveExecutionAllowed: false,
        externalWritesAllowed: false,
      });
    }
    if (mission.missionStatus === "needs_ceo_review") {
      dependencies.push({
        dependencyVersion: "sprint-11d-v1",
        id: `mission-dependency-${slug(mission.id)}-approval`,
        missionId: mission.id,
        fromDepartment: mission.department,
        toDepartment: "Approval / Safety",
        requestType: "approval_escalation",
        title: `${mission.department} CEO review packet`,
        neededOutput: "Advisory CEO review packet",
        blocker: "CEO review required; approval-as-execution blocked.",
        status: "needs_ceo_review",
        safeNextAction: "Prepare review context only; do not execute approved actions from Sprint 11.",
        requiresHumanReview: true,
        advisoryOnly: true,
        providerCalled: false,
        liveExecutionAllowed: false,
        externalWritesAllowed: false,
      });
    }
  }

  return dependencies;
}

function executiveReviewsFromQueue(queue: DepartmentMissionQueueItem[], missions: DepartmentMission[]): ExecutiveMissionReviewPacket[] {
  const byId = new Map(missions.map((mission) => [mission.id, mission]));

  return queue.slice(0, 5).map((item) => {
    const mission = byId.get(item.missionId) ?? missions[0];

    return {
      reviewVersion: "sprint-11e-v1",
      missionId: item.missionId,
      department: item.department,
      aiOwner: item.aiOwner,
      reason: item.priorityReason,
      expectedValue: `Improve ${item.department} operating focus using Sprint 10E intelligence without external execution.`,
      blockers: item.missingData,
      requiredApproval: mission?.approvalRule ?? "Human review required; no execution allowed.",
      safeDecisionOptions: ["review", "defer", "request_changes", "block"],
      approvalAsExecutionAllowed: false,
      requiresHumanReview: true,
      advisoryOnly: true,
      providerCalled: false,
      liveExecutionAllowed: false,
      externalWritesAllowed: false,
    };
  });
}

function telemetryFromMissions(missions: DepartmentMission[], dependencies: DepartmentMissionDependency[]): DepartmentPerformanceTelemetry {
  return {
    telemetryVersion: "sprint-11f-v1",
    missionCount: missions.length,
    readyCount: missions.filter((mission) => mission.missionStatus === "ready").length,
    blockedCount: missions.filter((mission) => mission.missionStatus === "blocked").length,
    needsCeoReviewCount: missions.filter((mission) => mission.missionStatus === "needs_ceo_review").length,
    dependencyCount: dependencies.length,
    dataGapCount: missions.filter((mission) => mission.missingData.length > 0).length,
    averageConfidence: clamp(average(missions.map((mission) => mission.priorityScore))),
    averagePriorityScore: clamp(average(missions.map((mission) => mission.priorityScore))),
    confidenceDriftWatch: missions
      .filter((mission) => mission.priorityScore < 50 || mission.missingData.length > 0)
      .slice(0, 6)
      .map((mission) => ({
        department: mission.department,
        confidence: mission.priorityScore,
        reason: mission.missingData[0] ?? "Priority confidence below operating threshold.",
      })),
    outcomePersistenceAllowed: false,
    memoryPersistenceAllowed: false,
    kpiPersistenceAllowed: false,
    advisoryOnly: true,
    providerCalled: false,
    liveExecutionAllowed: false,
  };
}

export function createDepartmentOperatingSystemReportFromInputs(input: DepartmentOperatingSystemInput): DepartmentOperatingSystemReport {
  const generatedAt = input.generatedAt ?? input.intelligence.generatedAt ?? new Date().toISOString();
  const missionInputContracts = input.intelligence.departmentPackets.map(contractFromPacket);
  const missions = missionInputContracts.map((contract) => missionFromContract(contract, generatedAt));
  const missionQueue = queueFromMissions(missions);
  const dependencies = dependenciesFromMissions(missions);
  const executiveMissionReview = executiveReviewsFromQueue(missionQueue, missions);
  const report: DepartmentOperatingSystemReport = {
    ok: true,
    sprint: "11",
    generatedAt,
    missionInputContracts,
    missions,
    missionQueue,
    dependencies,
    executiveMissionReview,
    telemetry: telemetryFromMissions(missions, dependencies),
    technicalDebtBacklog: [
      {
        issue: "ESLint silent timeout",
        priority: "high",
        status: "active",
        nextSafeAction: "Diagnose the silent lint timeout before broader Sprint 11/12 expansion; keep bounded lint recorded as inconclusive until resolved.",
      },
      {
        issue: "Turbopack tracing warning",
        priority: "medium",
        status: "active",
        nextSafeAction: "Investigate existing next.config.ts to Prisma referrals tracing warning outside mission orchestration unless it becomes a build failure.",
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
      autonomousWorkflowsAllowed: false,
      memoryPersistenceAllowed: false,
      kpiPersistenceAllowed: false,
      approvalAsExecutionAllowed: false,
    },
    providerCalled: false,
    liveExecutionAllowed: false,
  };
  assertDepartmentOperatingSystemSafety(report);

  return report;
}

export function assertDepartmentOperatingSystemSafety(report: DepartmentOperatingSystemReport) {
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
    report.safety.autonomousWorkflowsAllowed,
    report.safety.memoryPersistenceAllowed,
    report.safety.kpiPersistenceAllowed,
    report.safety.approvalAsExecutionAllowed,
    report.missionInputContracts.some((item) => !item.advisoryOnly || !item.requiresHumanReview || item.providerCalled || item.liveExecutionAllowed || item.externalWritesAllowed),
    report.missions.some((item) => !item.advisoryOnly || !item.requiresHumanReview || item.providerCalled || item.liveExecutionAllowed || item.externalWritesAllowed),
    report.missionQueue.some((item) => !item.advisoryOnly || !item.requiresHumanReview || item.providerCalled || item.liveExecutionAllowed || item.externalWritesAllowed),
    report.dependencies.some((item) => !item.advisoryOnly || !item.requiresHumanReview || item.providerCalled || item.liveExecutionAllowed || item.externalWritesAllowed),
    report.executiveMissionReview.some((item) => !item.advisoryOnly || !item.requiresHumanReview || item.approvalAsExecutionAllowed || item.providerCalled || item.liveExecutionAllowed || item.externalWritesAllowed),
    report.telemetry.outcomePersistenceAllowed || report.telemetry.memoryPersistenceAllowed || report.telemetry.kpiPersistenceAllowed || report.telemetry.providerCalled || report.telemetry.liveExecutionAllowed,
  ];

  if (unsafe.some(Boolean)) {
    throw new Error("Department Operating System safety contract failed.");
  }
  if (/ya29\.|GOCSPX-|refresh-token|client-secret|BEGIN PRIVATE KEY|authorization|bearer\s+|https:\/\/www\.googleapis\.com|gmail\.googleapis\.com|drive\.googleapis\.com|analytics\.googleapis\.com|searchconsole\.googleapis\.com/iu.test(serialized)) {
    throw new Error("Department Operating System exposed secret-like values or provider endpoints.");
  }
  if (/send_email|send_sms|publish_post|reply_to_review|create_lead|crm_mutation|autonomous_work_order|provider_write|drive\.files\.create|drafts\.send|calendar\.events\.insert/iu.test(serialized)) {
    throw new Error("Department Operating System exposed blocked execution actions.");
  }

  return true;
}
