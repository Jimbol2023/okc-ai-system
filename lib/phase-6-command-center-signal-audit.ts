import { phase6CommandCenterForbiddenDrift } from "./phase-6-daily-acquisition-command-center-scope";

export const phase6CommandCenterSignalAuditFlags = {
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
  taskCreationEnabled: false,
  queueCreationEnabled: false,
  routingEnabled: false,
  assignmentEnabled: false,
  reminderCreationEnabled: false,
  calendarCreationEnabled: false,
  notificationEnabled: false,
  dailyPlanPersistenceEnabled: false,
  auditWritingEnabled: false,
  storageWritingEnabled: false,
  outreachEnabled: false,
  callingEnabled: false,
  messageSendingEnabled: false,
  scrapingEnabled: false,
  skipTracingEnabled: false,
  revenueExecutionEnabled: false,
  phase7ImplementationEnabled: false,
  goLiveAuthorized: false,
} as const;

export type Phase6CommandCenterSignalFamily =
  | "phase_5_final_lockdown_handoff"
  | "z6_workday_focus_signal_review"
  | "z6_manual_workday_focus_classifier"
  | "z6_manual_revenue_workday_policy"
  | "z6_workday_focus_summary"
  | "z6_final_manual_revenue_workday_focus_summary"
  | "dashboard_revenue_command_center_concepts"
  | "existing_lead_workflow_visibility_fields";

export const phase6CommandCenterSignalFamilies: Phase6CommandCenterSignalFamily[] = [
  "phase_5_final_lockdown_handoff",
  "z6_workday_focus_signal_review",
  "z6_manual_workday_focus_classifier",
  "z6_manual_revenue_workday_policy",
  "z6_workday_focus_summary",
  "z6_final_manual_revenue_workday_focus_summary",
  "dashboard_revenue_command_center_concepts",
  "existing_lead_workflow_visibility_fields",
];

export type Phase6CommandCenterSignalAudit = {
  phase: "Phase 6: Daily Acquisition Command Center";
  phaseStep: "Phase 6B — Command Center Signal Audit";
  previousStep: "Phase 6A — Daily Acquisition Command Center Scope";
  phaseDecision: "signal_audit_only";
  implementationDecision: "not_authorized";
  providerDecision: "not_authorized";
  automationDecision: "not_authorized";
  communicationDecision: "not_authorized";
  crmMutationDecision: "not_authorized";
  taskDecision: "not_authorized";
  queueDecision: "not_authorized";
  routingDecision: "not_authorized";
  assignmentDecision: "not_authorized";
  reminderDecision: "not_authorized";
  calendarDecision: "not_authorized";
  notificationDecision: "not_authorized";
  dailyPlanDecision: "not_authorized";
  auditDecision: "not_authorized";
  recommendedNextExactStep: "Phase 6C — Manual Workday Focus Policy";
  nextStageRecommendation: "Phase 6C — Manual Workday Focus Policy";
  signalFamilies: Phase6CommandCenterSignalFamily[];
  auditPurpose: string[];
  stopRules: string[];
  aiOperatorLeverageBoundary: string[];
  humanOwnershipBoundary: string[];
  forbiddenDrift: string[];
  flags: typeof phase6CommandCenterSignalAuditFlags;
};

export const phase6CommandCenterSignalAuditPurpose = [
  "Audit existing command-center and workday-focus signals without changing dashboards, lead records, queues, tasks, reminders, daily plans, or CRM records.",
  "Surface review-now, work-today, follow-up-today, near-close, buyer-review, cleanup, blocked, monitor, and defer visibility.",
  "Support highest acquisition ROI per operator hour by helping humans choose daily work without execution side effects.",
];

export const phase6CommandCenterSignalAuditStopRules = [
  "Phase 6B audits existing command-center signal families only.",
  "No task creation, queue creation, routing, assignment, reminder creation, calendar creation, notification, daily plan persistence, CRM mutation, provider activation, outreach, calling, message sending, audit writing, storage writing, automation, scraping, skip tracing, revenue execution, Phase 7 implementation, or go-live is authorized.",
];

export const phase6CommandCenterSignalAuditAiBoundary = [
  "summarize existing command-center signals for human review only",
  "flag review-now work-today follow-up-today near-close buyer-review cleanup blocked monitor and defer visibility",
  "do not create tasks queues routes assignments reminders calendar items notifications or daily plans",
  "do not mutate CRM records",
  "do not contact or call sellers",
  "do not activate providers or automation",
  "do not write storage or audit logs",
  "do not scrape or skip trace",
  "do not execute revenue actions",
];

export const phase6CommandCenterSignalAuditHumanBoundary = [
  "daily work selection",
  "operator prioritization",
  "seller communication",
  "task ownership",
  "manual execution",
  "CRM approval",
  "future implementation approval",
];

export function getPhase6CommandCenterSignalAudit(): Phase6CommandCenterSignalAudit {
  const result: Phase6CommandCenterSignalAudit = {
    phase: "Phase 6: Daily Acquisition Command Center",
    phaseStep: "Phase 6B — Command Center Signal Audit",
    previousStep: "Phase 6A — Daily Acquisition Command Center Scope",
    phaseDecision: "signal_audit_only",
    implementationDecision: "not_authorized",
    providerDecision: "not_authorized",
    automationDecision: "not_authorized",
    communicationDecision: "not_authorized",
    crmMutationDecision: "not_authorized",
    taskDecision: "not_authorized",
    queueDecision: "not_authorized",
    routingDecision: "not_authorized",
    assignmentDecision: "not_authorized",
    reminderDecision: "not_authorized",
    calendarDecision: "not_authorized",
    notificationDecision: "not_authorized",
    dailyPlanDecision: "not_authorized",
    auditDecision: "not_authorized",
    recommendedNextExactStep: "Phase 6C — Manual Workday Focus Policy",
    nextStageRecommendation: "Phase 6C — Manual Workday Focus Policy",
    signalFamilies: phase6CommandCenterSignalFamilies,
    auditPurpose: phase6CommandCenterSignalAuditPurpose,
    stopRules: phase6CommandCenterSignalAuditStopRules,
    aiOperatorLeverageBoundary: phase6CommandCenterSignalAuditAiBoundary,
    humanOwnershipBoundary: phase6CommandCenterSignalAuditHumanBoundary,
    forbiddenDrift: phase6CommandCenterForbiddenDrift,
    flags: phase6CommandCenterSignalAuditFlags,
  };
  assertPhase6CommandCenterSignalAuditSafe(result);
  return result;
}

export function assertPhase6CommandCenterSignalAuditSafe(result: Phase6CommandCenterSignalAudit) {
  const allowedTrue = new Set(["readOnly", "advisoryOnly", "planningOnly", "signalAuditOnly", "operatorLeverageOnly"]);
  const unsafeTrue = Object.entries(result.flags).filter(([key, value]) => !allowedTrue.has(key) && value === true);
  const text = [result.auditPurpose, result.stopRules, result.aiOperatorLeverageBoundary, result.humanOwnershipBoundary, result.forbiddenDrift, result.signalFamilies].flat().join(" ");
  const unsafePattern = /task creation is authorized|queue creation is authorized|routing is authorized|assignment is authorized|reminder creation is authorized|calendar creation is authorized|notification is authorized|daily plan persistence is authorized|CRM mutation is authorized|provider activation is authorized|outreach is authorized|calling is authorized|message sending is authorized|audit writing is authorized|storage writing is authorized|automation is authorized|scraping is authorized|skip tracing is authorized|revenue execution is authorized|Phase 7 implementation is authorized|go-live is authorized/i;

  if (result.phaseStep !== "Phase 6B — Command Center Signal Audit") throw new Error("Phase 6B step must remain pinned.");
  if (result.previousStep !== "Phase 6A — Daily Acquisition Command Center Scope") throw new Error("Phase 6B previous step must remain Phase 6A.");
  if (result.phaseDecision !== "signal_audit_only") throw new Error("Phase 6B must remain signal-audit-only.");
  if (result.signalFamilies.join("|") !== phase6CommandCenterSignalFamilies.join("|")) throw new Error("Phase 6B must include all command-center signal families.");
  if (unsafeTrue.length > 0) throw new Error("Phase 6B blocked flags cannot turn true.");
  if (!/z6_workday_focus_signal_review/i.test(result.signalFamilies.join(" ")) || !/dashboard_revenue_command_center_concepts/i.test(result.signalFamilies.join(" "))) throw new Error("Phase 6B repo-grounded signals are missing.");
  if (!/audits existing command-center signal families only/i.test(result.stopRules.join(" "))) throw new Error("Phase 6B stop rules are missing.");
  if (!/human review only/i.test(result.aiOperatorLeverageBoundary.join(" ")) || !/do not create tasks/i.test(result.aiOperatorLeverageBoundary.join(" "))) throw new Error("Phase 6B AI boundary is missing.");
  if (!/daily work selection/i.test(result.humanOwnershipBoundary.join(" ")) || !/seller communication/i.test(result.humanOwnershipBoundary.join(" "))) throw new Error("Phase 6B human boundary is missing.");
  if (result.recommendedNextExactStep !== "Phase 6C — Manual Workday Focus Policy") throw new Error("Phase 6B must hand off to Phase 6C.");
  if (unsafePattern.test(text)) throw new Error("Phase 6B wording must not imply unsafe authorization.");
}

export function getPhase6CommandCenterSignalAuditSummary() {
  const result = getPhase6CommandCenterSignalAudit();
  return `${result.phase} / ${result.phaseStep}: audits existing Phase 5 handoff, Z6 workday focus, dashboard command-center, and lead workflow visibility signals for highest acquisition ROI per operator hour. Human-owned daily work selection remains required. No task, queue, routing, assignment, reminder, calendar, notification, daily plan, CRM mutation, automation, revenue execution, Phase 7 implementation, or go-live is authorized. Next step: ${result.recommendedNextExactStep}.`;
}
