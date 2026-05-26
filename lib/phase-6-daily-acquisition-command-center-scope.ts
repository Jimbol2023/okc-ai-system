import {
  phase5FollowUpFinalLockdownFlags,
  phase5FollowUpFinalLockdownRules,
} from "./phase-5-follow-up-final-lockdown";

export const phase6DailyAcquisitionCommandCenterScopeFlags = {
  readOnly: true,
  advisoryOnly: true,
  planningOnly: true,
  operatorLeverageOnly: true,
  scopeOnly: true,
  implementationAuthorized: false,
  providerActivated: false,
  automationEnabled: false,
  communicationEnabled: false,
  crmMutationEnabled: false,
  schemaChangeEnabled: false,
  storageMutationEnabled: false,
  runtimeJobsEnabled: false,
  outreachEnabled: false,
  callingEnabled: false,
  messageSendingEnabled: false,
  taskCreationEnabled: false,
  queueCreationEnabled: false,
  routingEnabled: false,
  assignmentEnabled: false,
  reminderCreationEnabled: false,
  calendarCreationEnabled: false,
  notificationEnabled: false,
  dailyPlanPersistenceEnabled: false,
  auditWritingEnabled: false,
  scrapingEnabled: false,
  skipTracingEnabled: false,
  revenueExecutionEnabled: false,
  phase7ImplementationEnabled: false,
  goLiveAuthorized: false,
} as const;

export type Phase6Decision = "not_authorized";

export type Phase6DailyAcquisitionCommandCenterScope = {
  phase: "Phase 6: Daily Acquisition Command Center";
  phaseStep: "Phase 6A — Daily Acquisition Command Center Scope";
  previousStep: "Phase 5F — Follow-Up Organization Final Lockdown";
  phaseDecision: "scope_only";
  primaryMetric: "acquisition_roi_per_operator_hour";
  aiRole: "operator_leverage_only";
  humanRole: "final_daily_work_selection_seller_communication_task_ownership_prioritization_execution_owner";
  implementationDecision: Phase6Decision;
  providerDecision: Phase6Decision;
  automationDecision: Phase6Decision;
  communicationDecision: Phase6Decision;
  crmMutationDecision: Phase6Decision;
  schemaDecision: Phase6Decision;
  storageDecision: Phase6Decision;
  runtimeDecision: Phase6Decision;
  outreachDecision: Phase6Decision;
  callingDecision: Phase6Decision;
  messageSendingDecision: Phase6Decision;
  taskDecision: Phase6Decision;
  queueDecision: Phase6Decision;
  routingDecision: Phase6Decision;
  assignmentDecision: Phase6Decision;
  reminderDecision: Phase6Decision;
  calendarDecision: Phase6Decision;
  notificationDecision: Phase6Decision;
  dailyPlanDecision: Phase6Decision;
  auditDecision: Phase6Decision;
  recommendedNextExactStep: "Phase 6B — Command Center Signal Audit";
  nextStageRecommendation: "Phase 6B — Command Center Signal Audit";
  phase5FinalLockdownReference: {
    flags: typeof phase5FollowUpFinalLockdownFlags;
    rules: typeof phase5FollowUpFinalLockdownRules;
  };
  scopePurpose: string[];
  stopRules: string[];
  aiOperatorLeverageBoundary: string[];
  humanOwnershipBoundary: string[];
  forbiddenDrift: string[];
  flags: typeof phase6DailyAcquisitionCommandCenterScopeFlags;
};

export const phase6CommandCenterPurpose = [
  "Define read-only Daily Acquisition Command Center planning for highest acquisition ROI per operator hour.",
  "Organize daily work visibility, blocked-work warnings, missing-data notes, and operator review summaries for human review only.",
  "Improve daily work selection without creating tasks, queues, routing, assignments, reminders, calendar items, notifications, daily plans, CRM mutations, or revenue execution.",
];

export const phase6CommandCenterStopRules = [
  "Phase 6A is scope only.",
  "No task creation, queue creation, routing, assignment, reminder creation, calendar creation, notification, daily plan persistence, CRM mutation, provider activation, outreach, calling, message sending, audit writing, storage writing, automation, scraping, skip tracing, revenue execution, Phase 7 implementation, or go-live is authorized.",
];

export const phase6CommandCenterAiBoundary = [
  "summarize daily acquisition command center context for human review only",
  "organize workday focus lanes and blocked-work warnings",
  "prepare missing-data notes and operator review summaries",
  "do not create tasks, queues, routes, assignments, reminders, calendar items, notifications, or daily plans",
  "do not mutate CRM records",
  "do not contact or call sellers",
  "do not send messages",
  "do not activate providers or automation",
  "do not write storage or audit logs",
  "do not scrape or skip trace",
  "do not execute revenue actions",
  "do not approve Phase 7 implementation or go-live",
];

export const phase6CommandCenterHumanBoundary = [
  "final daily work selection",
  "seller communication",
  "task ownership",
  "prioritization",
  "manual execution",
  "CRM approval",
  "operator override judgment",
  "future implementation approval",
];

export const phase6CommandCenterForbiddenDrift = [
  "task creation",
  "queue creation",
  "routing",
  "assignment",
  "reminder creation",
  "calendar creation",
  "notification",
  "daily plan persistence",
  "CRM mutation",
  "provider activation",
  "outreach",
  "calling",
  "message sending",
  "audit writing",
  "storage writing",
  "automation",
  "scraping",
  "skip tracing",
  "revenue execution",
  "Phase 7 implementation",
  "go-live",
];

export function getPhase6DailyAcquisitionCommandCenterScope(): Phase6DailyAcquisitionCommandCenterScope {
  const result: Phase6DailyAcquisitionCommandCenterScope = {
    phase: "Phase 6: Daily Acquisition Command Center",
    phaseStep: "Phase 6A — Daily Acquisition Command Center Scope",
    previousStep: "Phase 5F — Follow-Up Organization Final Lockdown",
    phaseDecision: "scope_only",
    primaryMetric: "acquisition_roi_per_operator_hour",
    aiRole: "operator_leverage_only",
    humanRole: "final_daily_work_selection_seller_communication_task_ownership_prioritization_execution_owner",
    implementationDecision: "not_authorized",
    providerDecision: "not_authorized",
    automationDecision: "not_authorized",
    communicationDecision: "not_authorized",
    crmMutationDecision: "not_authorized",
    schemaDecision: "not_authorized",
    storageDecision: "not_authorized",
    runtimeDecision: "not_authorized",
    outreachDecision: "not_authorized",
    callingDecision: "not_authorized",
    messageSendingDecision: "not_authorized",
    taskDecision: "not_authorized",
    queueDecision: "not_authorized",
    routingDecision: "not_authorized",
    assignmentDecision: "not_authorized",
    reminderDecision: "not_authorized",
    calendarDecision: "not_authorized",
    notificationDecision: "not_authorized",
    dailyPlanDecision: "not_authorized",
    auditDecision: "not_authorized",
    recommendedNextExactStep: "Phase 6B — Command Center Signal Audit",
    nextStageRecommendation: "Phase 6B — Command Center Signal Audit",
    phase5FinalLockdownReference: {
      flags: phase5FollowUpFinalLockdownFlags,
      rules: phase5FollowUpFinalLockdownRules,
    },
    scopePurpose: phase6CommandCenterPurpose,
    stopRules: phase6CommandCenterStopRules,
    aiOperatorLeverageBoundary: phase6CommandCenterAiBoundary,
    humanOwnershipBoundary: phase6CommandCenterHumanBoundary,
    forbiddenDrift: phase6CommandCenterForbiddenDrift,
    flags: phase6DailyAcquisitionCommandCenterScopeFlags,
  };
  assertPhase6DailyAcquisitionCommandCenterScopeSafe(result);
  return result;
}

export function assertPhase6DailyAcquisitionCommandCenterScopeSafe(result: Phase6DailyAcquisitionCommandCenterScope) {
  const allowedTrue = new Set(["readOnly", "advisoryOnly", "planningOnly", "operatorLeverageOnly", "scopeOnly"]);
  const unsafeTrue = Object.entries(result.flags).filter(([key, value]) => !allowedTrue.has(key) && value === true);
  const text = [result.scopePurpose, result.stopRules, result.aiOperatorLeverageBoundary, result.humanOwnershipBoundary, result.forbiddenDrift].flat().join(" ");
  const unsafePattern = /task creation is authorized|queue creation is authorized|routing is authorized|assignment is authorized|reminder creation is authorized|calendar creation is authorized|notification is authorized|daily plan persistence is authorized|CRM mutation is authorized|provider activation is authorized|outreach is authorized|calling is authorized|message sending is authorized|audit writing is authorized|storage writing is authorized|automation is authorized|scraping is authorized|skip tracing is authorized|revenue execution is authorized|Phase 7 implementation is authorized|go-live is authorized/i;

  if (result.phase !== "Phase 6: Daily Acquisition Command Center") throw new Error("Phase 6A phase must remain pinned.");
  if (result.phaseStep !== "Phase 6A — Daily Acquisition Command Center Scope") throw new Error("Phase 6A step must remain pinned.");
  if (result.previousStep !== "Phase 5F — Follow-Up Organization Final Lockdown") throw new Error("Phase 6A previous step must remain Phase 5F.");
  if (result.primaryMetric !== "acquisition_roi_per_operator_hour" || result.aiRole !== "operator_leverage_only") throw new Error("Phase 6A alignment must remain pinned.");
  if (result.phaseDecision !== "scope_only") throw new Error("Phase 6A must remain scope-only.");
  if (
    result.implementationDecision !== "not_authorized" ||
    result.providerDecision !== "not_authorized" ||
    result.automationDecision !== "not_authorized" ||
    result.communicationDecision !== "not_authorized" ||
    result.crmMutationDecision !== "not_authorized" ||
    result.schemaDecision !== "not_authorized" ||
    result.storageDecision !== "not_authorized" ||
    result.runtimeDecision !== "not_authorized" ||
    result.outreachDecision !== "not_authorized" ||
    result.callingDecision !== "not_authorized" ||
    result.messageSendingDecision !== "not_authorized" ||
    result.taskDecision !== "not_authorized" ||
    result.queueDecision !== "not_authorized" ||
    result.routingDecision !== "not_authorized" ||
    result.assignmentDecision !== "not_authorized" ||
    result.reminderDecision !== "not_authorized" ||
    result.calendarDecision !== "not_authorized" ||
    result.notificationDecision !== "not_authorized" ||
    result.dailyPlanDecision !== "not_authorized" ||
    result.auditDecision !== "not_authorized"
  ) throw new Error("Phase 6A decisions must remain not_authorized.");
  if (result.phase5FinalLockdownReference.rules.join("|") !== phase5FollowUpFinalLockdownRules.join("|")) throw new Error("Phase 6A must preserve Phase 5F final lockdown reference.");
  if (result.recommendedNextExactStep !== "Phase 6B — Command Center Signal Audit") throw new Error("Phase 6A must hand off to Phase 6B.");
  if (unsafeTrue.length > 0) throw new Error("Phase 6A blocked flags cannot turn true.");
  if (!/No task creation/i.test(result.stopRules.join(" ")) || !/revenue execution/i.test(result.stopRules.join(" "))) throw new Error("Phase 6A stop rules are missing.");
  if (!/human review only/i.test(result.aiOperatorLeverageBoundary.join(" ")) || !/do not create tasks/i.test(result.aiOperatorLeverageBoundary.join(" "))) throw new Error("Phase 6A AI boundary is missing.");
  if (!/final daily work selection/i.test(result.humanOwnershipBoundary.join(" ")) || !/seller communication/i.test(result.humanOwnershipBoundary.join(" "))) throw new Error("Phase 6A human boundary is missing.");
  if (!/queue creation/i.test(result.forbiddenDrift.join(" ")) || !/Phase 7 implementation/i.test(result.forbiddenDrift.join(" "))) throw new Error("Phase 6A forbidden drift is missing.");
  if (unsafePattern.test(text)) throw new Error("Phase 6A wording must not imply unsafe authorization.");
}

export function getPhase6DailyAcquisitionCommandCenterScopeSummary() {
  const result = getPhase6DailyAcquisitionCommandCenterScope();
  return `${result.phase} / ${result.phaseStep}: read-only Daily Acquisition Command Center scope for highest acquisition ROI per operator hour with human-owned daily work selection, prioritization, task ownership, seller communication, and execution. No task, queue, routing, assignment, reminder, calendar, notification, or daily plan creation, no outreach, no calling, no CRM mutation, no automation, no revenue execution, no Phase 7 implementation, and no go-live are authorized. Next step: ${result.recommendedNextExactStep}.`;
}
