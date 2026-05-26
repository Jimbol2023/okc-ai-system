import {
  phase4SellerReviewFinalLockdownFlags,
  phase4SellerReviewFinalLockdownRules,
} from "./phase-4-seller-review-final-lockdown";

export const phase5FollowUpOrganizationScopeFlags = {
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
  followUpCreationEnabled: false,
  taskCreationEnabled: false,
  queueCreationEnabled: false,
  reminderCreationEnabled: false,
  calendarCreationEnabled: false,
  scheduleWritingEnabled: false,
  messageDraftPersistenceEnabled: false,
  scrapingEnabled: false,
  skipTracingEnabled: false,
  autonomousLeadCreationEnabled: false,
  phase6ImplementationEnabled: false,
  goLiveAuthorized: false,
} as const;

export type Phase5Decision = "not_authorized";

export type Phase5FollowUpOrganizationScope = {
  phase: "Phase 5: Follow-Up Organization System";
  phaseStep: "Phase 5A — Follow-Up Organization System Scope";
  previousStep: "Phase 4F — Seller Review Final Lockdown";
  phaseDecision: "scope_only";
  primaryMetric: "acquisition_roi_per_operator_hour";
  aiRole: "operator_leverage_only";
  humanRole: "final_follow_up_judgment_seller_communication_timing_task_ownership_execution_owner";
  implementationDecision: Phase5Decision;
  providerDecision: Phase5Decision;
  automationDecision: Phase5Decision;
  communicationDecision: Phase5Decision;
  crmMutationDecision: Phase5Decision;
  schemaDecision: Phase5Decision;
  storageDecision: Phase5Decision;
  runtimeDecision: Phase5Decision;
  outreachDecision: Phase5Decision;
  callingDecision: Phase5Decision;
  messageSendingDecision: Phase5Decision;
  taskDecision: Phase5Decision;
  queueDecision: Phase5Decision;
  reminderDecision: Phase5Decision;
  calendarDecision: Phase5Decision;
  recommendedNextExactStep: "Phase 5B — Follow-Up Signal Audit";
  nextStageRecommendation: "Phase 5B — Follow-Up Signal Audit";
  phase4FinalLockdownReference: {
    flags: typeof phase4SellerReviewFinalLockdownFlags;
    rules: typeof phase4SellerReviewFinalLockdownRules;
  };
  scopePurpose: string[];
  stopRules: string[];
  aiOperatorLeverageBoundary: string[];
  humanOwnershipBoundary: string[];
  forbiddenDrift: string[];
  flags: typeof phase5FollowUpOrganizationScopeFlags;
};

export const phase5FollowUpOrganizationPurpose = [
  "Define read-only Follow-Up Organization System planning for highest acquisition ROI per operator hour.",
  "Organize stale, due, blocked, cleanup, nurture, and terminal follow-up visibility for human review only.",
  "Improve operator focus without sending messages, calling sellers, creating tasks, writing schedules, creating queues, or mutating CRM records.",
];

export const phase5FollowUpOrganizationStopRules = [
  "Phase 5A is scope only.",
  "No message sending, calling, provider activation, CRM mutation, follow-up creation, task creation, queue creation, reminder creation, calendar creation, schedule writing, message draft persistence, automation, scraping, skip tracing, autonomous lead creation, Phase 6 implementation, or go-live is authorized.",
];

export const phase5FollowUpOrganizationAiBoundary = [
  "summarize follow-up organization context for human review only",
  "identify stale, overdue, due-soon, blocked, cleanup, and nurture visibility",
  "prepare manual cadence guidance without creating execution artifacts",
  "do not invent property facts",
  "do not contact or call sellers",
  "do not send SMS or email",
  "do not mutate CRM records",
  "do not create follow-ups, tasks, queues, reminders, or calendar items",
  "do not write schedules",
  "do not persist message drafts",
  "do not activate providers",
  "do not scrape or skip trace",
  "do not approve Phase 6 implementation or go-live",
];

export const phase5FollowUpOrganizationHumanBoundary = [
  "final follow-up judgment",
  "seller communication",
  "follow-up timing",
  "task ownership",
  "manual execution",
  "property fact verification",
  "CRM approval",
  "future implementation approval",
];

export const phase5FollowUpForbiddenDrift = [
  "message sending",
  "calling",
  "provider activation",
  "CRM mutation",
  "follow-up creation",
  "task creation",
  "queue creation",
  "reminder creation",
  "calendar creation",
  "schedule writing",
  "message draft persistence",
  "automation",
  "scraping",
  "skip tracing",
  "autonomous lead creation",
  "Phase 6 implementation",
  "go-live",
];

export function getPhase5FollowUpOrganizationScope(): Phase5FollowUpOrganizationScope {
  const result: Phase5FollowUpOrganizationScope = {
    phase: "Phase 5: Follow-Up Organization System",
    phaseStep: "Phase 5A — Follow-Up Organization System Scope",
    previousStep: "Phase 4F — Seller Review Final Lockdown",
    phaseDecision: "scope_only",
    primaryMetric: "acquisition_roi_per_operator_hour",
    aiRole: "operator_leverage_only",
    humanRole: "final_follow_up_judgment_seller_communication_timing_task_ownership_execution_owner",
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
    reminderDecision: "not_authorized",
    calendarDecision: "not_authorized",
    recommendedNextExactStep: "Phase 5B — Follow-Up Signal Audit",
    nextStageRecommendation: "Phase 5B — Follow-Up Signal Audit",
    phase4FinalLockdownReference: {
      flags: phase4SellerReviewFinalLockdownFlags,
      rules: phase4SellerReviewFinalLockdownRules,
    },
    scopePurpose: phase5FollowUpOrganizationPurpose,
    stopRules: phase5FollowUpOrganizationStopRules,
    aiOperatorLeverageBoundary: phase5FollowUpOrganizationAiBoundary,
    humanOwnershipBoundary: phase5FollowUpOrganizationHumanBoundary,
    forbiddenDrift: phase5FollowUpForbiddenDrift,
    flags: phase5FollowUpOrganizationScopeFlags,
  };
  assertPhase5FollowUpOrganizationScopeSafe(result);
  return result;
}

export function assertPhase5FollowUpOrganizationScopeSafe(result: Phase5FollowUpOrganizationScope) {
  const allowedTrue = new Set(["readOnly", "advisoryOnly", "planningOnly", "operatorLeverageOnly", "scopeOnly"]);
  const unsafeTrue = Object.entries(result.flags).filter(([key, value]) => !allowedTrue.has(key) && value === true);
  const text = [result.scopePurpose, result.stopRules, result.aiOperatorLeverageBoundary, result.humanOwnershipBoundary, result.forbiddenDrift].flat().join(" ");
  const unsafePattern = /message sending is authorized|calling is authorized|provider activation is authorized|CRM mutation is authorized|follow-up creation is authorized|task creation is authorized|queue creation is authorized|reminder creation is authorized|calendar creation is authorized|schedule writing is authorized|message draft persistence is authorized|automation is authorized|scraping is authorized|skip tracing is authorized|autonomous lead creation is authorized|Phase 6 implementation is authorized|go-live is authorized/i;

  if (result.phase !== "Phase 5: Follow-Up Organization System") throw new Error("Phase 5A phase must remain pinned.");
  if (result.phaseStep !== "Phase 5A — Follow-Up Organization System Scope") throw new Error("Phase 5A step must remain pinned.");
  if (result.previousStep !== "Phase 4F — Seller Review Final Lockdown") throw new Error("Phase 5A previous step must remain Phase 4F.");
  if (result.primaryMetric !== "acquisition_roi_per_operator_hour" || result.aiRole !== "operator_leverage_only") throw new Error("Phase 5A alignment must remain pinned.");
  if (result.phaseDecision !== "scope_only") throw new Error("Phase 5A must remain scope-only.");
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
    result.reminderDecision !== "not_authorized" ||
    result.calendarDecision !== "not_authorized"
  ) throw new Error("Phase 5A decisions must remain not_authorized.");
  if (result.phase4FinalLockdownReference.rules.join("|") !== phase4SellerReviewFinalLockdownRules.join("|")) throw new Error("Phase 5A must preserve Phase 4F final lockdown reference.");
  if (result.recommendedNextExactStep !== "Phase 5B — Follow-Up Signal Audit") throw new Error("Phase 5A must hand off to Phase 5B.");
  if (unsafeTrue.length > 0) throw new Error("Phase 5A blocked flags cannot turn true.");
  if (!/No message sending/i.test(result.stopRules.join(" ")) || !/go-live/i.test(result.stopRules.join(" "))) throw new Error("Phase 5A stop rules are missing.");
  if (!/human review only/i.test(result.aiOperatorLeverageBoundary.join(" ")) || !/do not create follow-ups/i.test(result.aiOperatorLeverageBoundary.join(" "))) throw new Error("Phase 5A AI boundary is missing.");
  if (!/final follow-up judgment/i.test(result.humanOwnershipBoundary.join(" ")) || !/seller communication/i.test(result.humanOwnershipBoundary.join(" "))) throw new Error("Phase 5A human boundary is missing.");
  if (!/queue creation/i.test(result.forbiddenDrift.join(" ")) || !/Phase 6 implementation/i.test(result.forbiddenDrift.join(" "))) throw new Error("Phase 5A forbidden drift is missing.");
  if (unsafePattern.test(text)) throw new Error("Phase 5A wording must not imply unsafe authorization.");
}

export function getPhase5FollowUpOrganizationScopeSummary() {
  const result = getPhase5FollowUpOrganizationScope();
  return `${result.phase} / ${result.phaseStep}: read-only Follow-Up Organization System scope for highest acquisition ROI per operator hour with human-owned follow-up judgment, timing, task ownership, seller communication, and execution. No outreach, no calling, no message sending, no CRM mutation, no follow-up creation, no task, queue, reminder, or calendar creation, no scraping, no autonomous lead creation, no Phase 6 implementation, and no go-live are authorized. Next step: ${result.recommendedNextExactStep}.`;
}
