import { phase7KpiRevenueForbiddenDrift } from "./phase-7-kpi-revenue-intelligence-scope";
import { z7BottleneckCleanupLanes } from "./z7-manual-revenue-bottleneck-policy";
import { z8RecoveryCoordinationLanes } from "./z8-manual-revenue-recovery-policy";
import { z9RevenueRiskReviewLanes } from "./z9-manual-revenue-risk-policy";

export const phase7KpiRevenueSignalAuditFlags = {
  readOnly: true,
  advisoryOnly: true,
  planningOnly: true,
  signalAuditOnly: true,
  operatorLeverageOnly: true,
  implementationAuthorized: false,
  providerActivated: false,
  automationEnabled: false,
  communicationEnabled: false,
  crmMutationEnabled: false,
  reportPersistenceEnabled: false,
  metricPersistenceEnabled: false,
  scorePersistenceEnabled: false,
  sourceMutationEnabled: false,
  spendChangeEnabled: false,
  marketingChangeEnabled: false,
  taskCreationEnabled: false,
  queueCreationEnabled: false,
  routingEnabled: false,
  assignmentEnabled: false,
  notificationEnabled: false,
  dailyPlanPersistenceEnabled: false,
  auditWritingEnabled: false,
  storageWritingEnabled: false,
  outreachEnabled: false,
  callingEnabled: false,
  messageSendingEnabled: false,
  scrapingEnabled: false,
  skipTracingEnabled: false,
  autonomousLeadCreationEnabled: false,
  revenueExecutionEnabled: false,
  phase8ImplementationEnabled: false,
  goLiveAuthorized: false,
} as const;

export type Phase7KpiRevenueSignalFamily =
  | "phase_6_final_lockdown_handoff"
  | "r53_manual_revenue_metrics_safe_metric_families"
  | "r53_manual_revenue_metrics_excluded_unsafe_metrics"
  | "dashboard_signal_consolidation_priorities_and_cards"
  | "revenue_pipeline_buckets_actions_urgency_bottlenecks_missing_value_assumptions"
  | "z7_bottleneck_cleanup_lanes_and_signal_review"
  | "z8_manual_revenue_recovery_coordination_concepts"
  | "z9_revenue_risk_review_concepts"
  | "existing_lead_workflow_visibility_fields";

export const phase7KpiRevenueSignalFamilies: Phase7KpiRevenueSignalFamily[] = [
  "phase_6_final_lockdown_handoff",
  "r53_manual_revenue_metrics_safe_metric_families",
  "r53_manual_revenue_metrics_excluded_unsafe_metrics",
  "dashboard_signal_consolidation_priorities_and_cards",
  "revenue_pipeline_buckets_actions_urgency_bottlenecks_missing_value_assumptions",
  "z7_bottleneck_cleanup_lanes_and_signal_review",
  "z8_manual_revenue_recovery_coordination_concepts",
  "z9_revenue_risk_review_concepts",
  "existing_lead_workflow_visibility_fields",
];

export type Phase7KpiRevenueSignalAudit = {
  phase: "Phase 7: KPI & Revenue Intelligence";
  phaseStep: "Phase 7B — KPI & Revenue Signal Audit";
  previousStep: "Phase 7A — KPI & Revenue Intelligence Scope";
  phaseDecision: "signal_audit_only";
  implementationDecision: "not_authorized";
  providerDecision: "not_authorized";
  automationDecision: "not_authorized";
  communicationDecision: "not_authorized";
  crmMutationDecision: "not_authorized";
  reportDecision: "not_authorized";
  metricDecision: "not_authorized";
  scoreDecision: "not_authorized";
  spendDecision: "not_authorized";
  marketingDecision: "not_authorized";
  taskDecision: "not_authorized";
  queueDecision: "not_authorized";
  routingDecision: "not_authorized";
  assignmentDecision: "not_authorized";
  notificationDecision: "not_authorized";
  dailyPlanDecision: "not_authorized";
  auditDecision: "not_authorized";
  recommendedNextExactStep: "Phase 7C — Manual KPI & Revenue Intelligence Policy";
  nextStageRecommendation: "Phase 7C — Manual KPI & Revenue Intelligence Policy";
  signalFamilies: Phase7KpiRevenueSignalFamily[];
  z7LaneReferences: typeof z7BottleneckCleanupLanes;
  z8LaneReferences: typeof z8RecoveryCoordinationLanes;
  z9LaneReferences: typeof z9RevenueRiskReviewLanes;
  auditPurpose: string[];
  stopRules: string[];
  aiOperatorLeverageBoundary: string[];
  humanOwnershipBoundary: string[];
  forbiddenDrift: string[];
  flags: typeof phase7KpiRevenueSignalAuditFlags;
};

export const phase7KpiRevenueSignalAuditPurpose = [
  "Audit existing KPI and revenue signal families without persisting reports, metrics, scores, source changes, CRM changes, tasks, queues, notifications, daily plans, audit logs, or storage.",
  "Reference R53 safe metrics, dashboard signal consolidation, revenue pipeline buckets, Z7 bottlenecks, Z8 recovery coordination, Z9 risk review, and existing lead workflow visibility only.",
  "Support highest acquisition ROI per operator hour by making source quality, throughput, leakage, conversion, bottlenecks, and assumptions easier for humans to review.",
];

export const phase7KpiRevenueSignalAuditStopRules = [
  "Phase 7B audits existing KPI and revenue signal families only.",
  "No KPI persistence, report persistence, score persistence, CRM mutation, source mutation, spend change, marketing change, task creation, queue creation, routing, assignment, notification, daily plan persistence, provider activation, outreach, calling, message sending, audit writing, storage writing, automation, scraping, skip tracing, autonomous lead creation, revenue execution, Phase 8 implementation, or go-live is authorized.",
];

export const phase7KpiRevenueSignalAuditAiBoundary = [
  "summarize existing KPI and revenue signals for human review only",
  "flag safe metrics excluded unsafe metrics source quality throughput leakage conversion bottlenecks and assumption-labeled pipeline value",
  "do not persist metrics reports scores sources or revenue claims",
  "do not mutate CRM records",
  "do not create tasks queues routes assignments notifications or daily plans",
  "do not change spend or marketing decisions",
  "do not contact or call sellers or send messages",
  "do not activate providers or automation",
  "do not write storage or audit logs",
  "do not scrape or skip trace",
  "do not execute revenue actions",
];

export const phase7KpiRevenueSignalAuditHumanBoundary = [
  "KPI interpretation",
  "source judgment",
  "revenue judgment",
  "pipeline assumption verification",
  "operational adjustment",
  "spend decisions",
  "marketing decisions",
  "future implementation approval",
];

export function getPhase7KpiRevenueSignalAudit(): Phase7KpiRevenueSignalAudit {
  const result: Phase7KpiRevenueSignalAudit = {
    phase: "Phase 7: KPI & Revenue Intelligence",
    phaseStep: "Phase 7B — KPI & Revenue Signal Audit",
    previousStep: "Phase 7A — KPI & Revenue Intelligence Scope",
    phaseDecision: "signal_audit_only",
    implementationDecision: "not_authorized",
    providerDecision: "not_authorized",
    automationDecision: "not_authorized",
    communicationDecision: "not_authorized",
    crmMutationDecision: "not_authorized",
    reportDecision: "not_authorized",
    metricDecision: "not_authorized",
    scoreDecision: "not_authorized",
    spendDecision: "not_authorized",
    marketingDecision: "not_authorized",
    taskDecision: "not_authorized",
    queueDecision: "not_authorized",
    routingDecision: "not_authorized",
    assignmentDecision: "not_authorized",
    notificationDecision: "not_authorized",
    dailyPlanDecision: "not_authorized",
    auditDecision: "not_authorized",
    recommendedNextExactStep: "Phase 7C — Manual KPI & Revenue Intelligence Policy",
    nextStageRecommendation: "Phase 7C — Manual KPI & Revenue Intelligence Policy",
    signalFamilies: phase7KpiRevenueSignalFamilies,
    z7LaneReferences: z7BottleneckCleanupLanes,
    z8LaneReferences: z8RecoveryCoordinationLanes,
    z9LaneReferences: z9RevenueRiskReviewLanes,
    auditPurpose: phase7KpiRevenueSignalAuditPurpose,
    stopRules: phase7KpiRevenueSignalAuditStopRules,
    aiOperatorLeverageBoundary: phase7KpiRevenueSignalAuditAiBoundary,
    humanOwnershipBoundary: phase7KpiRevenueSignalAuditHumanBoundary,
    forbiddenDrift: phase7KpiRevenueForbiddenDrift,
    flags: phase7KpiRevenueSignalAuditFlags,
  };
  assertPhase7KpiRevenueSignalAuditSafe(result);
  return result;
}

export function assertPhase7KpiRevenueSignalAuditSafe(result: Phase7KpiRevenueSignalAudit) {
  const allowedTrue = new Set(["readOnly", "advisoryOnly", "planningOnly", "signalAuditOnly", "operatorLeverageOnly"]);
  const unsafeTrue = Object.entries(result.flags).filter(([key, value]) => !allowedTrue.has(key) && value === true);
  const text = [result.auditPurpose, result.stopRules, result.aiOperatorLeverageBoundary, result.humanOwnershipBoundary, result.forbiddenDrift, result.signalFamilies].flat().join(" ");
  const unsafePattern = /KPI persistence is authorized|report persistence is authorized|score persistence is authorized|CRM mutation is authorized|source mutation is authorized|spend change is authorized|marketing change is authorized|task creation is authorized|queue creation is authorized|routing is authorized|assignment is authorized|provider activation is authorized|outreach is authorized|calling is authorized|message sending is authorized|audit writing is authorized|storage writing is authorized|scraping is authorized|skip tracing is authorized|autonomous lead creation is authorized|revenue execution is authorized|Phase 8 implementation is authorized|go-live is authorized/i;

  if (result.phaseStep !== "Phase 7B — KPI & Revenue Signal Audit") throw new Error("Phase 7B step must remain pinned.");
  if (result.previousStep !== "Phase 7A — KPI & Revenue Intelligence Scope") throw new Error("Phase 7B previous step must remain Phase 7A.");
  if (result.phaseDecision !== "signal_audit_only") throw new Error("Phase 7B must remain signal-audit-only.");
  if (Object.entries(result).some(([key, value]) => key.endsWith("Decision") && key !== "phaseDecision" && value !== "not_authorized")) throw new Error("Phase 7B decisions must remain not_authorized.");
  if (result.signalFamilies.join("|") !== phase7KpiRevenueSignalFamilies.join("|")) throw new Error("Phase 7B must include all KPI and revenue signal families.");
  if (result.z7LaneReferences.join("|") !== z7BottleneckCleanupLanes.join("|") || result.z8LaneReferences.join("|") !== z8RecoveryCoordinationLanes.join("|") || result.z9LaneReferences.join("|") !== z9RevenueRiskReviewLanes.join("|")) throw new Error("Phase 7B must preserve Z7 Z8 Z9 references.");
  if (unsafeTrue.length > 0) throw new Error("Phase 7B blocked flags cannot turn true.");
  if (!/r53_manual_revenue_metrics_safe_metric_families/i.test(result.signalFamilies.join(" ")) || !/revenue_pipeline/i.test(result.signalFamilies.join(" "))) throw new Error("Phase 7B repo-grounded signals are missing.");
  if (!/audits existing KPI and revenue signal families only/i.test(result.stopRules.join(" "))) throw new Error("Phase 7B stop rules are missing.");
  if (!/human review only/i.test(result.aiOperatorLeverageBoundary.join(" ")) || !/do not persist metrics/i.test(result.aiOperatorLeverageBoundary.join(" "))) throw new Error("Phase 7B AI boundary is missing.");
  if (!/KPI interpretation/i.test(result.humanOwnershipBoundary.join(" ")) || !/source judgment/i.test(result.humanOwnershipBoundary.join(" "))) throw new Error("Phase 7B human boundary is missing.");
  if (result.recommendedNextExactStep !== "Phase 7C — Manual KPI & Revenue Intelligence Policy") throw new Error("Phase 7B must hand off to Phase 7C.");
  if (unsafePattern.test(text)) throw new Error("Phase 7B wording must not imply unsafe authorization.");
}

export function getPhase7KpiRevenueSignalAuditSummary() {
  const result = getPhase7KpiRevenueSignalAudit();
  return `${result.phase} / ${result.phaseStep}: audits existing R53 safe metrics, dashboard signal consolidation, revenue pipeline, Z7, Z8, Z9, and lead workflow visibility signals for highest acquisition ROI per operator hour. Human-owned KPI interpretation, source judgment, and revenue judgment remain required. No KPI persistence, no CRM mutation, no outreach, no automation, no revenue execution, no Phase 8 implementation, and no go-live are authorized. Next step: ${result.recommendedNextExactStep}.`;
}
