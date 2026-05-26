import { manualFollowUpWorkspaceLanes } from "./manual-follow-up-workspace-usability";
import { z3ManualCadenceBands } from "./z3-follow-up-velocity-policy";
import { phase5FollowUpSignalFamilies } from "./phase-5-follow-up-signal-audit";

export const phase5ManualFollowUpPolicyFlags = {
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
  followUpCreationEnabled: false,
  taskCreationEnabled: false,
  queueCreationEnabled: false,
  reminderCreationEnabled: false,
  calendarCreationEnabled: false,
  scheduleWritingEnabled: false,
  messageDraftPersistenceEnabled: false,
  outreachEnabled: false,
  callingEnabled: false,
  messageSendingEnabled: false,
  scrapingEnabled: false,
  skipTracingEnabled: false,
  autonomousLeadCreationEnabled: false,
  phase6ImplementationEnabled: false,
  goLiveAuthorized: false,
} as const;

export type Phase5ManualFollowUpPolicy = {
  phase: "Phase 5: Follow-Up Organization System";
  phaseStep: "Phase 5C — Manual Follow-Up Organization Policy";
  previousStep: "Phase 5B — Follow-Up Signal Audit";
  phaseDecision: "manual_policy_only";
  implementationDecision: "not_authorized";
  providerDecision: "not_authorized";
  automationDecision: "not_authorized";
  communicationDecision: "not_authorized";
  crmMutationDecision: "not_authorized";
  followUpCreationDecision: "not_authorized";
  taskDecision: "not_authorized";
  queueDecision: "not_authorized";
  reminderDecision: "not_authorized";
  calendarDecision: "not_authorized";
  outreachDecision: "not_authorized";
  callingDecision: "not_authorized";
  recommendedNextExactStep: "Phase 5D — Follow-Up Organization Implementation Scope";
  nextStageRecommendation: "Phase 5D — Follow-Up Organization Implementation Scope";
  manualFollowUpLanes: typeof manualFollowUpWorkspaceLanes;
  advisoryCadenceBands: typeof z3ManualCadenceBands;
  signalReferences: typeof phase5FollowUpSignalFamilies;
  policyRules: string[];
  stopRules: string[];
  aiOperatorLeverageBoundary: string[];
  humanOwnershipBoundary: string[];
  forbiddenDrift: string[];
  flags: typeof phase5ManualFollowUpPolicyFlags;
};

export const phase5ManualFollowUpPolicyRules = [
  "Manual follow-up lanes and cadence bands may organize human review only.",
  "Blocked, DNC, rejected, stop-language, terminal, and cleanup lanes outrank revenue pressure.",
  "Cadence bands are visibility labels only; they do not schedule, send, create tasks, create reminders, create queues, create calendar items, persist drafts, or mutate CRM records.",
];

export const phase5ManualFollowUpPolicyStopRules = [
  "Phase 5C is manual follow-up organization policy only.",
  "No scheduling, sending, calling, provider activation, CRM mutation, follow-up creation, task creation, queue creation, reminder creation, calendar creation, message draft persistence, automation, scraping, skip tracing, Phase 6 implementation, or go-live is authorized.",
];

export const phase5ManualFollowUpPolicyAiBoundary = [
  "rank follow-up context into manual organization lanes for human review only",
  "explain cadence guidance without writing schedules",
  "do not send messages or call sellers",
  "do not mutate CRM records",
  "do not create follow-ups tasks queues reminders or calendar items",
  "do not persist message drafts",
  "do not trigger automation",
  "do not activate providers",
  "do not scrape or skip trace",
  "do not approve implementation",
];

export const phase5ManualFollowUpPolicyHumanBoundary = [
  "final follow-up priority judgment",
  "final cadence judgment",
  "seller communication",
  "task ownership",
  "manual execution",
  "CRM approval",
  "future implementation approval",
];

export const phase5ManualFollowUpPolicyForbiddenDrift = [
  "schedule writing",
  "message sending",
  "calling",
  "provider activation",
  "CRM mutation",
  "follow-up creation",
  "task creation",
  "queue creation",
  "reminder creation",
  "calendar creation",
  "message draft persistence",
  "automation",
  "scraping",
  "skip tracing",
  "Phase 6 implementation",
  "go-live",
];

export function getPhase5ManualFollowUpPolicy(): Phase5ManualFollowUpPolicy {
  const result: Phase5ManualFollowUpPolicy = {
    phase: "Phase 5: Follow-Up Organization System",
    phaseStep: "Phase 5C — Manual Follow-Up Organization Policy",
    previousStep: "Phase 5B — Follow-Up Signal Audit",
    phaseDecision: "manual_policy_only",
    implementationDecision: "not_authorized",
    providerDecision: "not_authorized",
    automationDecision: "not_authorized",
    communicationDecision: "not_authorized",
    crmMutationDecision: "not_authorized",
    followUpCreationDecision: "not_authorized",
    taskDecision: "not_authorized",
    queueDecision: "not_authorized",
    reminderDecision: "not_authorized",
    calendarDecision: "not_authorized",
    outreachDecision: "not_authorized",
    callingDecision: "not_authorized",
    recommendedNextExactStep: "Phase 5D — Follow-Up Organization Implementation Scope",
    nextStageRecommendation: "Phase 5D — Follow-Up Organization Implementation Scope",
    manualFollowUpLanes: manualFollowUpWorkspaceLanes,
    advisoryCadenceBands: z3ManualCadenceBands,
    signalReferences: phase5FollowUpSignalFamilies,
    policyRules: phase5ManualFollowUpPolicyRules,
    stopRules: phase5ManualFollowUpPolicyStopRules,
    aiOperatorLeverageBoundary: phase5ManualFollowUpPolicyAiBoundary,
    humanOwnershipBoundary: phase5ManualFollowUpPolicyHumanBoundary,
    forbiddenDrift: phase5ManualFollowUpPolicyForbiddenDrift,
    flags: phase5ManualFollowUpPolicyFlags,
  };
  assertPhase5ManualFollowUpPolicySafe(result);
  return result;
}

export function assertPhase5ManualFollowUpPolicySafe(result: Phase5ManualFollowUpPolicy) {
  const allowedTrue = new Set(["readOnly", "advisoryOnly", "planningOnly", "policyOnly", "operatorLeverageOnly"]);
  const unsafeTrue = Object.entries(result.flags).filter(([key, value]) => !allowedTrue.has(key) && value === true);
  const text = [result.policyRules, result.stopRules, result.aiOperatorLeverageBoundary, result.humanOwnershipBoundary, result.forbiddenDrift, result.manualFollowUpLanes, result.advisoryCadenceBands].flat().join(" ");
  const unsafePattern = /scheduling is authorized|message sending is authorized|calling is authorized|provider activation is authorized|CRM mutation is authorized|follow-up creation is authorized|task creation is authorized|queue creation is authorized|reminder creation is authorized|calendar creation is authorized|message draft persistence is authorized|automation is authorized|scraping is authorized|skip tracing is authorized|Phase 6 implementation is authorized|go-live is authorized/i;

  if (result.phaseStep !== "Phase 5C — Manual Follow-Up Organization Policy") throw new Error("Phase 5C step must remain pinned.");
  if (result.previousStep !== "Phase 5B — Follow-Up Signal Audit") throw new Error("Phase 5C previous step must remain Phase 5B.");
  if (result.phaseDecision !== "manual_policy_only") throw new Error("Phase 5C must remain manual-policy-only.");
  if (
    result.implementationDecision !== "not_authorized" ||
    result.providerDecision !== "not_authorized" ||
    result.automationDecision !== "not_authorized" ||
    result.communicationDecision !== "not_authorized" ||
    result.crmMutationDecision !== "not_authorized" ||
    result.followUpCreationDecision !== "not_authorized" ||
    result.taskDecision !== "not_authorized" ||
    result.queueDecision !== "not_authorized" ||
    result.reminderDecision !== "not_authorized" ||
    result.calendarDecision !== "not_authorized" ||
    result.outreachDecision !== "not_authorized" ||
    result.callingDecision !== "not_authorized"
  ) throw new Error("Phase 5C decisions must remain not_authorized.");
  if (result.manualFollowUpLanes.join("|") !== manualFollowUpWorkspaceLanes.join("|")) throw new Error("Phase 5C must include all manual follow-up lanes.");
  if (result.advisoryCadenceBands.join("|") !== z3ManualCadenceBands.join("|")) throw new Error("Phase 5C must include all advisory cadence bands.");
  if (result.signalReferences.join("|") !== phase5FollowUpSignalFamilies.join("|")) throw new Error("Phase 5C must preserve Phase 5B signal references.");
  if (unsafeTrue.length > 0) throw new Error("Phase 5C blocked flags cannot turn true.");
  if (!/visibility labels only/i.test(result.policyRules.join(" ")) || !/do not schedule/i.test(result.policyRules.join(" "))) throw new Error("Phase 5C policy rules must block scheduling and sending.");
  if (!/manual follow-up organization policy only/i.test(result.stopRules.join(" "))) throw new Error("Phase 5C stop rules are missing.");
  if (!/human review only/i.test(result.aiOperatorLeverageBoundary.join(" ")) || !/do not create follow-ups/i.test(result.aiOperatorLeverageBoundary.join(" "))) throw new Error("Phase 5C AI boundary is missing.");
  if (!/final cadence judgment/i.test(result.humanOwnershipBoundary.join(" ")) || !/seller communication/i.test(result.humanOwnershipBoundary.join(" "))) throw new Error("Phase 5C human boundary is missing.");
  if (result.recommendedNextExactStep !== "Phase 5D — Follow-Up Organization Implementation Scope") throw new Error("Phase 5C must hand off to Phase 5D.");
  if (unsafePattern.test(text)) throw new Error("Phase 5C wording must not imply unsafe authorization.");
}

export function getPhase5ManualFollowUpPolicySummary() {
  const result = getPhase5ManualFollowUpPolicy();
  return `${result.phase} / ${result.phaseStep}: defines manual follow-up organization lanes and advisory cadence bands for highest acquisition ROI per operator hour with human-owned follow-up judgment. No outreach, no calling, no message sending, no CRM mutation, no follow-up, task, queue, reminder, or calendar creation, no schedule writing, no message draft persistence, no scraping, no autonomous lead creation, no Phase 6 implementation, and no go-live are authorized. Next step: ${result.recommendedNextExactStep}.`;
}
