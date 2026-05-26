import { z6WorkdayFocusLanes } from "./z6-manual-revenue-workday-policy";
import { phase6CommandCenterSignalFamilies } from "./phase-6-command-center-signal-audit";

export const phase6WorkdayFocusSummaryStates = [
  "stop_before_work",
  "cleanup_before_work",
  "focus_now",
  "focus_today",
  "focus_this_week",
  "monitor_only",
  "defer",
  "no_work",
  "not_ready",
] as const;

export const phase6ManualWorkdayFocusPolicyFlags = {
  readOnly: true,
  advisoryOnly: true,
  planningOnly: true,
  policyOnly: true,
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

export type Phase6ManualWorkdayFocusPolicy = {
  phase: "Phase 6: Daily Acquisition Command Center";
  phaseStep: "Phase 6C — Manual Workday Focus Policy";
  previousStep: "Phase 6B — Command Center Signal Audit";
  phaseDecision: "manual_policy_only";
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
  recommendedNextExactStep: "Phase 6D — Command Center Implementation Scope";
  nextStageRecommendation: "Phase 6D — Command Center Implementation Scope";
  workdayFocusLanes: typeof z6WorkdayFocusLanes;
  summaryStates: typeof phase6WorkdayFocusSummaryStates;
  signalReferences: typeof phase6CommandCenterSignalFamilies;
  policyRules: string[];
  stopRules: string[];
  aiOperatorLeverageBoundary: string[];
  humanOwnershipBoundary: string[];
  forbiddenDrift: string[];
  flags: typeof phase6ManualWorkdayFocusPolicyFlags;
};

export const phase6ManualWorkdayFocusPolicyRules = [
  "Manual workday focus lanes and summary states may organize human review only.",
  "Stop-first, blocked, DNC, governance, terminal, and cleanup states outrank revenue pressure.",
  "Workday focus labels are visibility labels only; they do not create tasks, queues, routing, assignments, reminders, calendar items, notifications, daily plans, CRM mutations, outreach, or revenue execution.",
];

export const phase6ManualWorkdayFocusPolicyStopRules = [
  "Phase 6C is manual workday focus policy only.",
  "No task creation, queue creation, routing, assignment, reminder creation, calendar creation, notification, daily plan persistence, CRM mutation, provider activation, outreach, calling, message sending, audit writing, storage writing, automation, scraping, skip tracing, revenue execution, Phase 7 implementation, or go-live is authorized.",
];

export const phase6ManualWorkdayFocusPolicyAiBoundary = [
  "rank daily work visibility into manual workday focus lanes for human review only",
  "explain blocked work missing data and operator focus reasons",
  "do not create tasks queues routing assignments reminders calendar items notifications or daily plans",
  "do not mutate CRM records",
  "do not contact call or message sellers",
  "do not activate providers or automation",
  "do not write storage or audit logs",
  "do not execute revenue actions",
];

export const phase6ManualWorkdayFocusPolicyHumanBoundary = [
  "final daily work selection",
  "operator prioritization",
  "seller communication",
  "task ownership",
  "manual execution",
  "operator override judgment",
  "CRM approval",
  "future implementation approval",
];

export const phase6ManualWorkdayFocusForbiddenDrift = [
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

export function getPhase6ManualWorkdayFocusPolicy(): Phase6ManualWorkdayFocusPolicy {
  const result: Phase6ManualWorkdayFocusPolicy = {
    phase: "Phase 6: Daily Acquisition Command Center",
    phaseStep: "Phase 6C — Manual Workday Focus Policy",
    previousStep: "Phase 6B — Command Center Signal Audit",
    phaseDecision: "manual_policy_only",
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
    recommendedNextExactStep: "Phase 6D — Command Center Implementation Scope",
    nextStageRecommendation: "Phase 6D — Command Center Implementation Scope",
    workdayFocusLanes: z6WorkdayFocusLanes,
    summaryStates: phase6WorkdayFocusSummaryStates,
    signalReferences: phase6CommandCenterSignalFamilies,
    policyRules: phase6ManualWorkdayFocusPolicyRules,
    stopRules: phase6ManualWorkdayFocusPolicyStopRules,
    aiOperatorLeverageBoundary: phase6ManualWorkdayFocusPolicyAiBoundary,
    humanOwnershipBoundary: phase6ManualWorkdayFocusPolicyHumanBoundary,
    forbiddenDrift: phase6ManualWorkdayFocusForbiddenDrift,
    flags: phase6ManualWorkdayFocusPolicyFlags,
  };
  assertPhase6ManualWorkdayFocusPolicySafe(result);
  return result;
}

export function assertPhase6ManualWorkdayFocusPolicySafe(result: Phase6ManualWorkdayFocusPolicy) {
  const allowedTrue = new Set(["readOnly", "advisoryOnly", "planningOnly", "policyOnly", "operatorLeverageOnly"]);
  const unsafeTrue = Object.entries(result.flags).filter(([key, value]) => !allowedTrue.has(key) && value === true);
  const text = [result.policyRules, result.stopRules, result.aiOperatorLeverageBoundary, result.humanOwnershipBoundary, result.forbiddenDrift, result.workdayFocusLanes, result.summaryStates].flat().join(" ");
  const unsafePattern = /task creation is authorized|queue creation is authorized|routing is authorized|assignment is authorized|reminder creation is authorized|calendar creation is authorized|notification is authorized|daily plan persistence is authorized|CRM mutation is authorized|provider activation is authorized|outreach is authorized|calling is authorized|message sending is authorized|audit writing is authorized|storage writing is authorized|automation is authorized|scraping is authorized|skip tracing is authorized|revenue execution is authorized|Phase 7 implementation is authorized|go-live is authorized/i;

  if (result.phaseStep !== "Phase 6C — Manual Workday Focus Policy") throw new Error("Phase 6C step must remain pinned.");
  if (result.previousStep !== "Phase 6B — Command Center Signal Audit") throw new Error("Phase 6C previous step must remain Phase 6B.");
  if (result.phaseDecision !== "manual_policy_only") throw new Error("Phase 6C must remain manual-policy-only.");
  if (result.workdayFocusLanes.join("|") !== z6WorkdayFocusLanes.join("|")) throw new Error("Phase 6C must include all workday focus lanes.");
  if (result.summaryStates.join("|") !== phase6WorkdayFocusSummaryStates.join("|")) throw new Error("Phase 6C must include all summary states.");
  if (result.signalReferences.join("|") !== phase6CommandCenterSignalFamilies.join("|")) throw new Error("Phase 6C must preserve Phase 6B signal references.");
  if (unsafeTrue.length > 0) throw new Error("Phase 6C blocked flags cannot turn true.");
  if (!/visibility labels only/i.test(result.policyRules.join(" ")) || !/do not create tasks/i.test(result.aiOperatorLeverageBoundary.join(" "))) throw new Error("Phase 6C rules must block workday execution.");
  if (!/manual workday focus policy only/i.test(result.stopRules.join(" "))) throw new Error("Phase 6C stop rules are missing.");
  if (!/final daily work selection/i.test(result.humanOwnershipBoundary.join(" ")) || !/seller communication/i.test(result.humanOwnershipBoundary.join(" "))) throw new Error("Phase 6C human boundary is missing.");
  if (result.recommendedNextExactStep !== "Phase 6D — Command Center Implementation Scope") throw new Error("Phase 6C must hand off to Phase 6D.");
  if (unsafePattern.test(text)) throw new Error("Phase 6C wording must not imply unsafe authorization.");
}

export function getPhase6ManualWorkdayFocusPolicySummary() {
  const result = getPhase6ManualWorkdayFocusPolicy();
  return `${result.phase} / ${result.phaseStep}: defines manual workday focus lanes and summary states for highest acquisition ROI per operator hour with human-owned daily work selection. No task, queue, routing, assignment, reminder, calendar, notification, daily plan, CRM mutation, outreach, automation, revenue execution, Phase 7 implementation, or go-live is authorized. Next step: ${result.recommendedNextExactStep}.`;
}
