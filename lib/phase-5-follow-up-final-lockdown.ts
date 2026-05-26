import { phase5MinimalFollowUpGateLanes } from "./phase-5-minimal-follow-up-gate";

export const phase5FollowUpFinalLockdownFlags = {
  readOnly: true,
  advisoryOnly: true,
  planningOnly: true,
  finalLockdownOnly: true,
  operatorLeverageOnly: true,
  phase5LockdownEnforced: true,
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

export type Phase5FollowUpFinalLockdown = {
  phase: "Phase 5: Follow-Up Organization System";
  phaseStep: "Phase 5F — Follow-Up Organization Final Lockdown";
  previousStep: "Phase 5E — Minimal Follow-Up Organization Gate";
  phaseDecision: "final_lockdown_only";
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
  recommendedNextExactStep: "Phase 6 — Daily Acquisition Command Center";
  nextStageRecommendation: "Phase 6 — Daily Acquisition Command Center";
  finalLockdownRules: string[];
  phase5eGateReferences: typeof phase5MinimalFollowUpGateLanes;
  aiOperatorLeverageBoundary: string[];
  humanOwnershipBoundary: string[];
  forbiddenDrift: string[];
  flags: typeof phase5FollowUpFinalLockdownFlags;
};

export const phase5FollowUpFinalLockdownRules = [
  "Phase 5F locks Phase 5 as read-only Follow-Up Organization System planning only.",
  "Phase 5F authorizes no implementation, message sending, calling, provider activation, CRM mutation, follow-up creation, task creation, queue creation, reminder creation, calendar creation, schedule writing, message draft persistence, automation, scraping, skip tracing, Phase 6 implementation, or go-live.",
  "Phase 5F can recommend Phase 6 — Daily Acquisition Command Center as the next roadmap phase only after human review.",
];

export const phase5FollowUpFinalLockdownAiBoundary = [
  "summarize Phase 5 closeout for human review only",
  "summarize Phase 5A through Phase 5E continuity",
  "prepare Phase 6 transition notes for human review",
  "do not invent property facts",
  "do not send messages or call sellers",
  "do not mutate CRM records",
  "do not create follow-ups tasks queues reminders calendar items schedules or message drafts",
  "do not activate providers or automation",
  "do not scrape or skip trace",
  "do not approve Phase 6 implementation",
  "do not authorize go-live",
];

export const phase5FollowUpFinalLockdownHumanBoundary = [
  "Phase 5 closeout approval",
  "Phase 6 transition approval",
  "follow-up judgment",
  "follow-up timing",
  "seller communication",
  "task ownership",
  "manual execution",
  "CRM approval",
  "future implementation approval",
];

export const phase5FollowUpFinalLockdownForbiddenDrift = [
  "implementation",
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

export function getPhase5FollowUpFinalLockdown(): Phase5FollowUpFinalLockdown {
  const result: Phase5FollowUpFinalLockdown = {
    phase: "Phase 5: Follow-Up Organization System",
    phaseStep: "Phase 5F — Follow-Up Organization Final Lockdown",
    previousStep: "Phase 5E — Minimal Follow-Up Organization Gate",
    phaseDecision: "final_lockdown_only",
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
    recommendedNextExactStep: "Phase 6 — Daily Acquisition Command Center",
    nextStageRecommendation: "Phase 6 — Daily Acquisition Command Center",
    finalLockdownRules: phase5FollowUpFinalLockdownRules,
    phase5eGateReferences: phase5MinimalFollowUpGateLanes,
    aiOperatorLeverageBoundary: phase5FollowUpFinalLockdownAiBoundary,
    humanOwnershipBoundary: phase5FollowUpFinalLockdownHumanBoundary,
    forbiddenDrift: phase5FollowUpFinalLockdownForbiddenDrift,
    flags: phase5FollowUpFinalLockdownFlags,
  };
  assertPhase5FollowUpFinalLockdownSafe(result);
  return result;
}

export function assertPhase5FollowUpFinalLockdownSafe(result: Phase5FollowUpFinalLockdown) {
  const allowedTrue = new Set(["readOnly", "advisoryOnly", "planningOnly", "finalLockdownOnly", "operatorLeverageOnly", "phase5LockdownEnforced"]);
  const unsafeTrue = Object.entries(result.flags).filter(([key, value]) => !allowedTrue.has(key) && value === true);
  const text = [result.finalLockdownRules, result.aiOperatorLeverageBoundary, result.humanOwnershipBoundary, result.forbiddenDrift].flat().join(" ");
  const unsafePattern = /implementation is authorized|message sending is authorized|calling is authorized|provider activation is authorized|CRM mutation is authorized|follow-up creation is authorized|task creation is authorized|queue creation is authorized|reminder creation is authorized|calendar creation is authorized|schedule writing is authorized|message draft persistence is authorized|automation is authorized|scraping is authorized|skip tracing is authorized|Phase 6 implementation is authorized|go-live is authorized/i;

  if (result.phase !== "Phase 5: Follow-Up Organization System") throw new Error("Phase 5F phase must remain pinned.");
  if (result.phaseStep !== "Phase 5F — Follow-Up Organization Final Lockdown") throw new Error("Phase 5F step must remain pinned.");
  if (result.previousStep !== "Phase 5E — Minimal Follow-Up Organization Gate") throw new Error("Phase 5F previous step must remain Phase 5E.");
  if (result.phaseDecision !== "final_lockdown_only") throw new Error("Phase 5F must remain final-lockdown-only.");
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
  ) throw new Error("Phase 5F decisions must remain not_authorized.");
  if (result.phase5eGateReferences.join("|") !== phase5MinimalFollowUpGateLanes.join("|")) throw new Error("Phase 5F must preserve Phase 5E gate references.");
  if (unsafeTrue.length > 0 || !result.flags.phase5LockdownEnforced) throw new Error("Phase 5F blocked flags cannot turn true and lockdown must stay enforced.");
  if (!/locks Phase 5/i.test(text) || !/authorizes no implementation/i.test(text) || !/Phase 6 — Daily Acquisition Command Center/i.test(text)) throw new Error("Phase 5F final lockdown rules are missing.");
  if (!/human review only/i.test(result.aiOperatorLeverageBoundary.join(" ")) || !/do not approve Phase 6 implementation/i.test(result.aiOperatorLeverageBoundary.join(" "))) throw new Error("Phase 5F AI boundary is missing.");
  if (!/Phase 5 closeout approval/i.test(result.humanOwnershipBoundary.join(" ")) || !/Phase 6 transition approval/i.test(result.humanOwnershipBoundary.join(" "))) throw new Error("Phase 5F human boundary is missing.");
  if (!/queue creation/i.test(result.forbiddenDrift.join(" ")) || !/go-live/i.test(result.forbiddenDrift.join(" "))) throw new Error("Phase 5F forbidden drift is missing.");
  if (result.recommendedNextExactStep !== "Phase 6 — Daily Acquisition Command Center") throw new Error("Phase 5F must recommend Phase 6.");
  if (unsafePattern.test(text)) throw new Error("Phase 5F wording must not imply unsafe authorization.");
}

export function getPhase5FollowUpFinalLockdownSummary() {
  const result = getPhase5FollowUpFinalLockdown();
  return `${result.phase} / ${result.phaseStep}: final lockdown for read-only Follow-Up Organization System planning with human-owned follow-up judgment, timing, task ownership, seller communication, and execution. No implementation, no outreach, no calling, no message sending, no CRM mutation, no follow-up, task, queue, reminder, or calendar creation, no scraping, no autonomous lead creation, no Phase 6 implementation, and no go-live are authorized. Next stage: ${result.nextStageRecommendation}.`;
}
